#!/bin/bash
# arbitrator_check.sh — 仲裁者检查脚本
# 每 30 分钟运行一次，读两边数据、评分、写刺激信号
set -e

ARENA_ROOT="/mnt/d/ai-startup-arena"
CYCLE_FILE="$ARENA_ROOT/arena/arbitrator-cycle.txt"
PHASE_REPORT_DIR="$ARENA_ROOT/arena/phase-reports"
ALPHA_REPO="$ARENA_ROOT/alpha/repo"
BETA_REPO="$ARENA_ROOT/beta/repo"

mkdir -p "$PHASE_REPORT_DIR"

# 读取当前周期
if [ -f "$CYCLE_FILE" ]; then
    CYCLE=$(cat "$CYCLE_FILE")
    CYCLE=$((CYCLE + 1))
else
    CYCLE=1
fi
echo "$CYCLE" > "$CYCLE_FILE"

# 最大 Cycle 数 — 到站自动收工，约 15:30 结束
MAX_CYCLE=20
if [ "$CYCLE" -ge "$MAX_CYCLE" ]; then
    echo "=== 🎉 Arena 进化运行完毕 — Cycle $CYCLE / MAX $MAX_CYCLE ==="
    echo "" > "$ARENA_ROOT/arena/arbitrator-done.txt"
    echo "最终总结已写入 arbitrator-done.txt"
    # 优雅终止所有 agent 窗口
    for w in alpha-ceo alpha-dev-1 alpha-dev-2 alpha-mkt beta-ceo beta-dev-1 beta-dev-2 beta-mkt; do
        tmux send-keys -t arena-master:$w C-c 2>/dev/null || true
    done
    exit 0
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "=== Arbitrator Cycle $CYCLE — $TIMESTAMP ==="

# Step 1: 采集进度数据
echo ""
echo "[Step 1] 采集进度..."

# Alpha commit 数
ALPHA_COMMITS=$(cd "$ALPHA_REPO" && git log --oneline 2>/dev/null | wc -l)
# Beta commit 数
BETA_COMMITS=$(cd "$BETA_REPO" && git log --oneline 2>/dev/null | wc -l)

# Alpha 最近 5 轮 diff
ALPHA_DIFF=$(cd "$ALPHA_REPO" && timeout 5 git diff HEAD~5 --stat 2>/dev/null || echo "no diff available")
ALPHA_NEW_FILES=$(cd "$ALPHA_REPO" && timeout 5 git diff HEAD~5 --name-only 2>/dev/null || echo "")
# Beta 最近 5 轮 diff
BETA_DIFF=$(cd "$BETA_REPO" && timeout 5 git diff HEAD~3 --stat 2>/dev/null || echo "no diff available")
BETA_NEW_FILES=$(cd "$BETA_REPO" && timeout 5 git diff HEAD~3 --name-only 2>/dev/null || echo "")

# 读取决策/报告
ALPHA_DECISION=$(ls -t $ARENA_ROOT/alpha/arena/decisions/*.md 2>/dev/null | head -1)
BETA_DECISION=$(ls -t $ARENA_ROOT/beta/arena/decisions/*.md 2>/dev/null | head -1)
ALPHA_REPORT=$(ls -t $ARENA_ROOT/alpha/arena/reports/*.md 2>/dev/null | head -1)
BETA_REPORT=$(ls -t $ARENA_ROOT/beta/arena/reports/*.md 2>/dev/null | head -1)

echo "  Alpha: $ALPHA_COMMITS commits | last decision: $(basename $ALPHA_DECISION 2>/dev/null || echo 'none')"
echo "  Beta: $BETA_COMMITS commits | last decision: $(basename $BETA_DECISION 2>/dev/null || echo 'none')"

# Step 2: 代码污染检测（简化版 — 兼容 WSL 性能）
echo ""
echo "[Step 2] 代码污染检测..."

pollution_score=0
alpha_pollution=""
beta_pollution=""

# 引擎 A: 文件暴涨检测
alpha_bloat=$(cd "$ALPHA_REPO" && timeout 5 git diff HEAD~5 --stat 2>/dev/null || true)
beta_bloat=$(cd "$BETA_REPO" && timeout 5 git diff HEAD~3 --stat 2>/dev/null || true)

parse_bloat() {
    local data="$1" outfile="$2"
    [ -z "$data" ] && { > "$outfile"; return; }
    echo "$data" | while IFS= read -r line; do
        echo "$line" | grep -c "changed" >/dev/null 2>&1 && continue || true
        file=$(echo "$line" | sed 's/|.*//' | xargs)
        [ -z "$file" ] && continue
        case "$file" in *.py|*.ts|*.js|*.tsx|*.jsx) ;; *) continue ;; esac
        add=$(echo "$line" | sed 's/.*| //;s/ .*//' | grep -E '^[0-9]+$' || echo 0)
        [ "$add" -gt 80 ] 2>/dev/null && printf "[BLOAT:%s+%slines] " "$file" "$add"
    done > "$outfile" || true
}

parse_bloat "$alpha_bloat" /tmp/alpha_bloat_out
parse_bloat "$beta_bloat" /tmp/beta_bloat_out

a_bloat=$(cat /tmp/alpha_bloat_out 2>/dev/null)
b_bloat=$(cat /tmp/beta_bloat_out 2>/dev/null)

[ -n "$a_bloat" ] && alpha_pollution="BLOAT:$a_bloat"
[ -n "$b_bloat" ] && beta_pollution="BLOAT:$b_bloat"

# 引擎 B+ 精简版: 看看两边有没有太多文件（快速估算）
alpha_file_count=$(timeout 5 ls "$ALPHA_REPO"/*.py 2>/dev/null | wc -l || echo 0)
beta_file_count=$(cd "$BETA_REPO" && timeout 5 find . -name "*.ts" -not -path "./node_modules/*" -not -path "./dist/*" 2>/dev/null | timeout 3 wc -l || echo 0)

# 引擎 C: 看有没有明显巨大的文件
[ -f "$ALPHA_REPO/ara/insight.py" ] && alpha_insight_size=$(wc -l < "$ALPHA_REPO/ara/insight.py" 2>/dev/null || echo 0)
[ -f "$BETA_REPO/src/commands/insight.ts" ] && beta_insight_size=$(wc -l < "$BETA_REPO/src/commands/insight.ts" 2>/dev/null || echo 0)

if [ -z "$alpha_pollution" ] && [ -z "$beta_pollution" ]; then
    echo "  ✅ 无污染"
else
    [ -n "$alpha_pollution" ] && echo "  ⚠️ ALPHA 污染: $alpha_pollution"
    [ -n "$beta_pollution" ] && echo "  ⚠️ BETA 污染: $beta_pollution"
fi

TOTAL_ALPHA_VIOLATIONS=$(echo "$a_bloat" | wc -w)
TOTAL_BETA_VIOLATIONS=$(echo "$b_bloat" | wc -w)

# Step 3: 计算分数
echo ""
echo "[Step 3] 评分..."

# 基础步骤分：commit 数越多越好
ALPHA_COMMIT_SCORE=$(( ALPHA_COMMITS * 20 / (ALPHA_COMMITS + BETA_COMMITS + 1) + 10 ))
BETA_COMMIT_SCORE=$(( BETA_COMMITS * 20 / (ALPHA_COMMITS + BETA_COMMITS + 1) + 10 ))

# 污染扣分：按违规严重程度
# 每个违规点扣 3 分，上限 30 分
ALPHA_POLLUTION_PENALTY=$(( TOTAL_ALPHA_VIOLATIONS * 3 ))
[ "$ALPHA_POLLUTION_PENALTY" -gt 30 ] && ALPHA_POLLUTION_PENALTY=30
BETA_POLLUTION_PENALTY=$(( TOTAL_BETA_VIOLATIONS * 3 ))
[ "$BETA_POLLUTION_PENALTY" -gt 30 ] && BETA_POLLUTION_PENALTY=30

# 基础分 + 内容分（从输出的决策/报告推断）
ALPHA_SCORE=$(( ALPHA_COMMIT_SCORE + 40 - ALPHA_POLLUTION_PENALTY ))
BETA_SCORE=$(( BETA_COMMIT_SCORE + 40 - BETA_POLLUTION_PENALTY ))

# 确保在 0-100 之间
[ "$ALPHA_SCORE" -lt 0 ] && ALPHA_SCORE=0
[ "$ALPHA_SCORE" -gt 100 ] && ALPHA_SCORE=100
[ "$BETA_SCORE" -lt 0 ] && BETA_SCORE=0
[ "$BETA_SCORE" -gt 100 ] && BETA_SCORE=100

echo "  Alpha: $ALPHA_SCORE/100 ($ALPHA_COMMITS commits, pollution penalty: -$ALPHA_POLLUTION_PENALTY)"
echo "  Beta:  $BETA_SCORE/100 ($BETA_COMMITS commits, pollution penalty: -$BETA_POLLUTION_PENALTY)"

# Step 4: 决定刺激目标
echo ""
echo "[Step 4] 刺激信号..."

GAP=$(( ALPHA_SCORE - BETA_SCORE ))
[ "$GAP" -lt 0 ] && GAP=$(( GAP * -1 ))

TARGET=""
TARGET_DIR=""
OPPONENT=""

if [ "$ALPHA_SCORE" -lt "$BETA_SCORE" ]; then
    TARGET="Alpha"
    TARGET_DIR="$ARENA_ROOT/alpha/arena"
    OPPONENT="Beta"
    TEAM_NAME="Alpha (Α-Tech Inc.)"
    OPP_NAME="Beta (β-Labs Corp.)"
    OPP_SCORE=$BETA_SCORE
    MY_SCORE=$ALPHA_SCORE
    OPP_COMMITS=$BETA_COMMITS
    MY_COMMITS=$ALPHA_COMMITS
    OPP_WEAK="$beta_pollution"
    MY_WEAK="$alpha_pollution"
elif [ "$BETA_SCORE" -lt "$ALPHA_SCORE" ]; then
    TARGET="Beta"
    TARGET_DIR="$ARENA_ROOT/beta/arena"
    OPPONENT="Alpha"
    TEAM_NAME="Beta (β-Labs Corp.)"
    OPP_NAME="Alpha (Α-Tech Inc.)"
    OPP_SCORE=$ALPHA_SCORE
    MY_SCORE=$BETA_SCORE
    OPP_COMMITS=$ALPHA_COMMITS
    MY_COMMITS=$BETA_COMMITS
    OPP_WEAK="$alpha_pollution"
    MY_WEAK="$beta_pollution"
fi

if [ -n "$TARGET" ]; then
    SPUR_FILE="$TARGET_DIR/arbitrator-spur-cycle-$CYCLE.md"
    
    # 找出对手最近改了什么
    OPP_NEW=$(cd "$ARENA_ROOT/$OPPONENT/repo" && git log --oneline -3 2>/dev/null)
    
    cat > "$SPUR_FILE" << SPUR
# 🏛️ 仲裁者进度更新 — Cycle $CYCLE

**时间**: $TIMESTAMP

## 当前局势
- 对手 ($OPP_NAME): $OPP_SCORE 分, $OPP_COMMITS 个 commit
- 你方 ($TEAM_NAME): $MY_SCORE 分, $MY_COMMITS 个 commit
- 差距: $GAP 分 (落后)

## 对手最近动向
$OPP_NEW

## 你方问题
$MY_WEAK

## 建议
1. 检查 arena/tasks/ 下的最新任务并执行
2. 关注代码质量，避免产生污染代码
3. 专注于自己擅长的地方，不要盲目模仿对手

SPUR
    echo "  ⚡ 刺激信号 -> $SPUR_FILE"
else
    echo "  ✨ 双方势均力敌，无需刺激"
fi

# Step 5: 写 leaderboard
echo ""
echo "[Step 5] 更新 leaderboard..."

cat > "$ARENA_ROOT/arena/leaderboard.md" << LB
# 🏟️ AI Startup Arena — Leaderboard

**更新**: $TIMESTAMP
**周期**: Cycle $CYCLE

| 排名 | 团队 | 分数 | Commits | 状态 |
|:----:|------|:----:|:-------:|:----:|
| 🥇 | Alpha (Α-Tech Inc.) | $ALPHA_SCORE | $ALPHA_COMMITS | $( [ "$ALPHA_POLLUTION_PENALTY" -gt 0 ] && echo "⚠️污染" || echo "✅干净" ) |
| 🥈 | Beta (β-Labs Corp.) | $BETA_SCORE | $BETA_COMMITS | $( [ "$BETA_POLLUTION_PENALTY" -gt 0 ] && echo "⚠️污染" || echo "✅干净" ) |

$([ "$GAP" -gt 0 ] && echo "**差距**: $GAP 分 — $([ -n "$TARGET" ] && echo "$TARGET 落后" || echo "领先方未知")")
$( [ "$CYCLE" -eq 1 ] && echo "**新周期启动!**" || echo "**仲裁者检查已完成 Cycle $CYCLE**")

$( [ -n "$alpha_pollution" ] && echo "⚠️ Alpha 污染警告: $alpha_pollution" || echo "✅ Alpha 无污染")
$( [ -n "$beta_pollution" ] && echo "⚠️ Beta 污染警告: $beta_pollution" || echo "✅ Beta 无污染")
LB

echo "  leaderboard.md 已更新"

# Step 6: 阶段提炼（每 4 次检查）
if [ $((CYCLE % 4)) -eq 0 ]; then
    echo ""
    echo "[Step 6] 阶段提炼 (Cycle $CYCLE)..."

    PHASE_FILE="$PHASE_REPORT_DIR/phase-$((CYCLE / 4)).md"
    
    # 读取双方最新报告
    ALPHA_LATEST_REPORT=""
    BETA_LATEST_REPORT=""
    [ -f "$ALPHA_REPORT" ] && ALPHA_LATEST_REPORT=$(head -20 "$ALPHA_REPORT" 2>/dev/null)
    [ -f "$BETA_REPORT" ] && BETA_LATEST_REPORT=$(head -20 "$BETA_REPORT" 2>/dev/null)
    
    cat > "$PHASE_FILE" << PHASE
# 📊 阶段提炼 — Cycle $CYCLE (Phase $((CYCLE / 4)))

**时间**: $TIMESTAMP
**跨度**: ${CYCLE} cycles (~$((CYCLE * 30 / 60))h)

## 进度对比
| 指标 | Alpha | Beta |
|------|:-----:|:----:|
| 分数 | $ALPHA_SCORE | $BETA_SCORE |
| Commits | $ALPHA_COMMITS | $BETA_COMMITS |
| 污染 | $( [ -n "$alpha_pollution" ] && echo "有" || echo "无" ) | $( [ -n "$beta_pollution" ] && echo "有" || echo "无" ) |

## Alpha 观察到
${ALPHA_LATEST_REPORT:-暂无最新报告}

## Beta 观察到
${BETA_LATEST_REPORT:-暂无最新报告}

## 初步分析
- 需要仲裁者人工判断具体技能模式
- 污染检测结果已记录
PHASE

    echo "  phase-report 已写入: $PHASE_FILE"
fi

echo ""
echo "=== Arbitrator Cycle $CYCLE DONE ==="
