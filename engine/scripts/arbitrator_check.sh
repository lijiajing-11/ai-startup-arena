#!/bin/bash
# Arena 仲裁脚本 v4 — JSON原子持久化 + 断点续跑 + 记忆注入 + human-in-loop
# 进化重点：根治第一轮 Cycle 1-16 数据丢失 + Agent 失忆
set +euo pipefail
ARENA_ROOT="/mnt/d/ai-startup-arena"
cd "$ARENA_ROOT" || { echo "[ERROR] cd failed"; exit 1; }

MAX_CYCLE="${MAX_CYCLE:-10}"   # 先 10 试水，顺了改 20
STATE_DIR="$ARENA_ROOT/arena/state"
SKILL_DIR="$ARENA_ROOT/arena/skill_trees"
LOG="$ARENA_ROOT/arena/logs/arbitrator-$(date +%Y%m%d).log"
PROFILES="alpha-ceo alpha-dev-1 alpha-dev-2 alpha-mkt beta-ceo beta-dev-1 beta-dev-2 beta-mkt"
mkdir -p "$STATE_DIR" "$ARENA_ROOT/arena/logs" "$SKILL_DIR"

log(){ echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG"; }

# --- 断点续跑：读 state 目录最大 cycle（LangGraph 持久化思想）---
LAST=$(ls "$STATE_DIR"/cycle-*.json 2>/dev/null | sed -E 's/.*cycle-0*([0-9]+)\.json/\1/' | sort -n | tail -1)
CURRENT_CYCLE=$(( ${LAST:-0} + 1 ))
log "Cycle $CURRENT_CYCLE start (max=$MAX_CYCLE)"

if [ "$CURRENT_CYCLE" -gt "$MAX_CYCLE" ]; then
    log "MAX_CYCLE reached. Arena complete."
    echo "# Arena Complete (round 2)" > "$ARENA_ROOT/ARENA_COMPLETE.md"
    exit 0
fi

CC=$(printf '%03d' "$CURRENT_CYCLE")   # 统一三位，修掉第一轮 report-0NNN 多余 0 的 bug

# --- 评分（确定流程层 = Workflow）---
# 返回: "score report_flag bloat_flag"
score_team(){
  local t="$1" repo="$ARENA_ROOT/$1/repo" s=50 rep=0 bloat=0 added
  [ -f "$ARENA_ROOT/$t/arena/reports/report-$CC.md" ] && { s=$((s+5)); rep=1; }
  if cd "$repo" 2>/dev/null; then
    # 只检测上轮 state 文件之后的新 commit，避免历史大 commit 重复扣分
    last_state=$(ls "$STATE_DIR"/cycle-*.json 2>/dev/null | sort | tail -1)
    if [ -n "$last_state" ]; then
      ref_time=$(python3 -c "import json,os; d=json.load(open('$last_state')); print(d.get('ts','')[:19].replace('T',' '))" 2>/dev/null)
      new_commits=$(git log --after="$ref_time" --pretty=format:"%H" 2>/dev/null | wc -l)
      if [ "${new_commits:-0}" -gt 0 ]; then
        added=$(git log --after="$ref_time" --pretty=format:"%H" 2>/dev/null | \
                xargs -I{} git show --stat {} 2>/dev/null | \
                grep -Eo '[0-9]+ insertion' | grep -Eo '[0-9]+' | \
                awk '{s+=$1} END{print s+0}')
        [ "${added:-0}" -gt 200 ] 2>/dev/null && { s=$((s-6)); bloat=1; }
      fi
    fi
    # BLOAT 零容忍：检测污染标记
    grep -rqs "auto-updated\|arenaStatus" --include="*.py" --include="*.ts" . 2>/dev/null && s=$((s-4))
    cd "$ARENA_ROOT" || true
  fi
  echo "$s $rep $bloat"
}
read AS AREP ABLOAT <<< "$(score_team alpha)"
read BS BREP BBLOAT <<< "$(score_team beta)"
log "Scores: Alpha=$AS(rep=$AREP,bloat=$ABLOAT) Beta=$BS(rep=$BREP,bloat=$BBLOAT)"

# --- 原子写 JSON 状态（先写 tmp 再 mv，防半写丢失）---
TMP="$STATE_DIR/.cycle-$CC.tmp"
cat > "$TMP" <<JSON
{"cycle":$CURRENT_CYCLE,"ts":"$(date -Iseconds)",
 "alpha":{"score":$AS,"report":$AREP,"bloat":$ABLOAT},
 "beta":{"score":$BS,"report":$BREP,"bloat":$BBLOAT}}
JSON
mv "$TMP" "$STATE_DIR/cycle-$CC.json"   # mv 是原子操作
log "State persisted: cycle-$CC.json"

# --- 从所有 state JSON 重建 leaderboard（历史永不丢）---
python3 - "$STATE_DIR" "$ARENA_ROOT/arena/leaderboard.md" <<'PY'
import sys, json, glob, os
state_dir, out = sys.argv[1], sys.argv[2]
rows = []
for f in sorted(glob.glob(os.path.join(state_dir, "cycle-*.json"))):
    try:
        d = json.load(open(f))
        rows.append((d["cycle"], d["alpha"]["score"], d["beta"]["score"]))
    except Exception:
        pass
with open(out, "w") as w:
    w.write("# Arena Leaderboard (Round 2 — paper-digest)\n\n")
    w.write("| Cycle | Alpha (A-Tech) | Beta (B-Labs) |\n|--|--|--|\n")
    for c, a, b in rows:
        w.write(f"| {c} | {a} | {b} |\n")
PY
log "Leaderboard rebuilt"

# --- 为下一轮 agent 生成 prompt：从 template 重新渲染 + 注入记忆 ---
# 关键：占位符永远留在 template 里，不会被一次性消耗（AutoGPT 记忆注入）
NEXT_CYCLE=$((CURRENT_CYCLE + 1))
if [ "$NEXT_CYCLE" -le "$MAX_CYCLE" ]; then
  for prof in $PROFILES; do
    python3 - "$prof" "$NEXT_CYCLE" "$MAX_CYCLE" "$ARENA_ROOT" <<'PY'
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
  log "Prompts regenerated for cycle $NEXT_CYCLE (memory injected)"
fi

# --- human-in-loop 检查点（每 5 cycle）← AutoGen ---
if [ $((CURRENT_CYCLE % 5)) -eq 0 ]; then
  printf "# Checkpoint Cycle %s\n\nAlpha %s : Beta %s\n\n请过目方向是否正确，可在此调整 PROJECT_BRIEF 或 prompt 后继续。\n" \
    "$CURRENT_CYCLE" "$AS" "$BS" > "$ARENA_ROOT/arena/CHECKPOINT-$CC.md"
  log "Checkpoint written: CHECKPOINT-$CC.md"
fi

log "Cycle $CURRENT_CYCLE done: Alpha $AS - Beta $BS -> next $NEXT_CYCLE"
exit 0
