#!/bin/bash
# Arena 第二轮一键初始化 — 准备目录、生成首版 prompt（cycle 1）、校验种子
# 用法: bash scripts/arena_init.sh [--reset]
#   --reset 会清空上一轮的 state/logs/checkpoint（开全新一轮时用）
set +euo pipefail
ARENA_ROOT="/mnt/d/ai-startup-arena"
cd "$ARENA_ROOT" || { echo "[ERROR] cd failed"; exit 1; }
MAX_CYCLE="${MAX_CYCLE:-10}"
PROFILES="alpha-ceo alpha-dev-1 alpha-dev-2 alpha-mkt beta-ceo beta-dev-1 beta-dev-2 beta-mkt"

echo "=== Arena Round-2 Init ==="

# 建目录
mkdir -p arena/state arena/logs arena/skill_trees arena/playbooks
echo "[ok] directories ready"

# --reset：清空上轮运行态（不动 prompt/种子/repo）
if [ "$1" = "--reset" ]; then
  rm -f arena/state/cycle-*.json arena/state/.cycle-*.tmp 2>/dev/null
  rm -f arena/CHECKPOINT-*.md arena/leaderboard.md ARENA_COMPLETE.md 2>/dev/null
  echo "[ok] previous run state cleared (--reset)"
fi

# 校验 8 个 prompt 模板存在
missing=0
for prof in $PROFILES; do
  [ -f "prompts/templates/$prof.txt" ] || { echo "[MISSING] prompts/templates/$prof.txt"; missing=1; }
done
[ "$missing" = 1 ] && { echo "[ERROR] 缺少 prompt 模板，先补齐再 init"; exit 1; }
echo "[ok] 8 prompt templates present"

# 校验种子文件
[ -f "arena/experience_pool.json" ] || echo "[WARN] arena/experience_pool.json 缺失（建议补）"
seed_count=$(ls arena/skill_trees/*.json 2>/dev/null | wc -l)
echo "[info] skill_trees seeds: $seed_count/8"

# 生成首版 prompt（cycle 1，注入种子技能树）
for prof in $PROFILES; do
  python3 - "$prof" "1" "$MAX_CYCLE" "$ARENA_ROOT" <<'PY'
import sys, json, os
prof, cyc, mx, root = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
tpl = f"{root}/prompts/templates/{prof}.txt"
if not os.path.exists(tpl):
    sys.exit(0)
text = open(tpl, encoding="utf-8").read()
st = f"{root}/arena/skill_trees/{prof}.json"
skills = ""
if os.path.exists(st):
    try:
        d = json.load(open(st, encoding="utf-8"))
        m = d.get("skills", {}).get("mastered", [])
        if m:
            skills = "已掌握技能: " + ", ".join(x["name"] for x in m)
    except Exception:
        pass
text = (text.replace("{{CYCLE}}", f"当前 Cycle {cyc}/{mx}")
            .replace("{{SKILL_TREE}}", skills)
            .replace("{{EXPERIENCE}}", "可查 arena/experience_pool.json 检索相关经验（按 tags）"))
open(f"{root}/prompts/{prof}.txt", "w", encoding="utf-8").write(text)
PY
done
echo "[ok] 8 prompts generated for cycle 1 (memory injected)"

echo ""
echo "=== Init done. 下一步 ==="
echo "  冒烟: MAX_CYCLE=$MAX_CYCLE bash scripts/arbitrator_check.sh   # 手动跑一轮看 state/leaderboard"
echo "  开跑: 启动 8 个 scripts/run_*.sh + 仲裁 cron"
