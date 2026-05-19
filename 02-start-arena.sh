#!/usr/bin/env bash
# ============================================================
# AI Startup Arena — 启动比赛（第2步）
# ============================================================
# 启动所有 Hermes Agent：仲裁者 → CEO → Dev → Marketing。
# 所有 Agent 在 tmux 窗口中以独立进程运行。
# 用法: bash scripts/02-start-arena.sh
# 前提: 先运行 01-setup.sh 完成初始化
# ============================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ──── 加载配置 ────
if [ -f /mnt/d/ai-startup-arena/arena.env ]; then
    source /mnt/d/ai-startup-arena/arena.env
elif [ -f "$PROJECT_DIR/arena.env" ]; then
    source "$PROJECT_DIR/arena.env"
fi

ARENA_ROOT="${ARENA_ROOT:-/mnt/d/ai-startup-arena}"
GITHUB_USERNAME="${GITHUB_USERNAME:-$(gh api user --jq .login 2>/dev/null || echo 'your-username')}"
ALPHA_REPO="${ALPHA_REPO:-alpha-project-arena}"
BETA_REPO="${BETA_REPO:-beta-project-arena}"

# ──── 检查是否已有运行的 arena tmux 会话 ────
if tmux has-session -t arena-master 2>/dev/null; then
    echo -e "${YELLOW}⚠ arena-master tmux 会话已存在！${NC}"
    echo "  如果之前启动过，运行以下命令查看或结束："
    echo "    tmux attach -t arena-master    # 查看"
    echo "    tmux kill-session -t arena-master  # 结束旧会话"
    echo ""
    read -rp "是否杀掉旧会话并重新启动？(y/N): " KILL_OLD
    if [[ "$KILL_OLD" == "y" || "$KILL_OLD" == "Y" ]]; then
        tmux kill-session -t arena-master
        sleep 1
    else
        echo "退出。"
        exit 0
    fi
fi

# ──── 辅助函数：在 tmux 中启动一个 Hermes Agent ────
# 参数: window_name profile_name skills_list initial_command_file
start_agent() {
    local win="$1"
    local profile="$2"
    local skills="$3"
    local init_cmd="$4"

    tmux new-window -t arena-master -n "$win"
    # 用 send-keys 启动 hermes
    tmux send-keys -t "arena-master:$win" \
        "cd $ARENA_ROOT && export TERM=xterm-256color && hermes --profile $profile $skills" Enter

    # 等待 Hermes 启动后，注入初始 prompt
    # 注意：需要等待 "You:" 提示符出现
    sleep 12
    tmux send-keys -t "arena-master:$win" "$init_cmd" Enter
}

echo -e "${CYAN}══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Startup Arena — 启动比赛                 ${NC}"
echo -e "${CYAN}══════════════════════════════════════════════${NC}"
echo ""
echo -e "仓库: ${CYAN}$GITHUB_USERNAME/$ALPHA_REPO${NC} vs ${CYAN}$GITHUB_USERNAME/$BETA_REPO${NC}"
echo ""

# ──── 0. 计算各阶段截止时间 ────
PHASE1_DURATION="${PHASE1_DURATION:-240}"
PHASE2_DURATION="${PHASE2_DURATION:-240}"
PHASE3_DURATION="${PHASE3_DURATION:-120}"
NOW_EPOCH=$(date +%s)
PHASE1_END=$((NOW_EPOCH + PHASE1_DURATION * 60))
PHASE2_END=$((PHASE1_END + PHASE2_DURATION * 60))
PHASE3_END=$((PHASE2_END + PHASE3_DURATION * 60))

echo -e "时间线："
echo -e "  Phase 1 (产品开发): ${CYAN}$(date -d @$PHASE1_END '+%H:%M')${NC}（${PHASE1_DURATION}分钟）"
echo -e "  Phase 2 (争夺期):   ${CYAN}$(date -d @$PHASE2_END '+%H:%M')${NC}（${PHASE2_DURATION}分钟）"
echo -e "  Phase 3 (决赛):     ${CYAN}$(date -d @$PHASE3_END '+%H:%M')${NC}（${PHASE3_DURATION}分钟）"
echo ""

# ──── 1. 创建主 tmux 会话 ────
echo -e "${CYAN}[1/9] 创建 tmux 主会话 ...${NC}"
tmux new-session -d -s arena-master -n arbitrator
echo -e "  ${GREEN}✓${NC} tmux 会话已创建 (arena-master)"

# ──── 2. 启动仲裁者 ────
echo -e "${CYAN}[2/9] 启动 仲裁者 (Arbitrator) ...${NC}"

ARBITRATOR_PROMPT=$(cat << PROMPT
You are the Arena Arbitrator for the AI Startup Arena competition.

Two AI companies (Α-Tech Inc. and β-Labs Corp.) are competing for GitHub Stars.

IMPORTANT RULES:
- You are the ONLY neutral agent. Do NOT favor any side.
- Monitor, log, and announce. Do NOT help either team write code.
- If something goes wrong, log it and notify via bulletins.

YOUR JOB:
- Check Stars every 15 minutes using: curl -s https://api.github.com/repos/$GITHUB_USERNAME/$ALPHA_REPO | python3 -c "import sys,json; d=json.load(sys.stdin); print('Stars:', d.get('stargazers_count',0))"  (and same for $BETA_REPO)
2. Update $ARENA_ROOT/arena/leaderboard.md
3. Log notable events to $ARENA_ROOT/arena/journal.md
4. Handle phase transitions by writing bulletins to $ARENA_ROOT/arena/bulletins/phase-transition.md
5. Detect anomalies (no commits in 1h, repo unreachable, etc.)
6. At the end, produce final report

PHASE SCHEDULE (epoch timestamps):
- Phase 1 (Product Dev) ends at: $PHASE1_END ($(date -d @$PHASE1_END '+%H:%M'))
- Phase 2 (Competition) ends at: $PHASE2_END ($(date -d @$PHASE2_END '+%H:%M'))
- Phase 3 (Final Sprint) ends at: $PHASE3_END ($(date -d @$PHASE3_END '+%H:%M'))

START by:
1. Check both repos exist (use gh repo view)
2. Write a brief announcement to $ARENA_ROOT/arena/journal.md that the arena is ready
3. Begin the 15-minute monitoring loop

Repository names:
- Alpha: $GITHUB_USERNAME/$ALPHA_REPO
- Beta: $GITHUB_USERNAME/$BETA_REPO
PROMPT
)

tmux send-keys -t arena-master:arbitrator \
    "cd $ARENA_ROOT/arena && hermes --profile arbitrator" Enter
sleep 15
tmux send-keys -t arena-master:arbitrator "$ARBITRATOR_PROMPT" Enter
echo -e "  ${GREEN}✓${NC} 仲裁者已启动"

# ──── 3-5. 启动 Alpha 团队 ────
echo -e "${CYAN}[3/9] 启动 Α-Tech CEO ...${NC}"
tmux new-window -t arena-master -n alpha-ceo
sleep 1
tmux send-keys -t arena-master:alpha-ceo \
    "cd $ARENA_ROOT/alpha/repo && hermes --profile alpha-ceo" Enter
sleep 15

ALPHA_CEO_PROMPT=$(cat << PROMPT
You are the CEO of Α-Tech Inc., an autonomous AI software company.

Your mission: Build a successful open-source project that attracts GitHub Stars, competing against β-Labs Corp.

YOUR TEAM:
- alpha-dev-1: Senior developer (backend/fullstack)
- alpha-dev-2: Fullstack developer  
- alpha-mkt: Marketing & community specialist

HOW TO WORK:
1. Decide your product strategy. Choose something that can get GitHub Stars.
2. Write task cards to $ARENA_ROOT/alpha/arena/tasks/
3. Your agents read tasks from there and write reports to $ARENA_ROOT/alpha/arena/reports/
4. Review completed work, make decisions, adjust strategy.

TASK CARD FORMAT:
Write each task as a markdown file: task-001-short-description.md
Include: assigned_to, priority, description, acceptance criteria (checklist), technical notes.

DECISION RECORDING:
Write major decisions to $ARENA_ROOT/alpha/arena/decisions/

COMMUNICATION RULES:
- Write tasks ONLY to your team's arena/tasks/
- Read reports from your team's arena/reports/
- Record decisions in arena/decisions/
- Send bulletins (team announcements) to arena/bulletins/
- Never communicate with β-Labs agents

PHASE 1 GOAL (first $PHASE1_DURATION minutes, until $(date -d @$PHASE1_END '+%H:%M')):
- Pick a product direction (CLI tool? Web app? Library?)
- Build MVP with at least one core feature
- Write excellent README with badges and quick start
- Push to GitHub repo (origin is already configured)
- Create Git tag v0.1.0
- Start getting Stars

BEGIN by deciding your product strategy. What will you build? Write your first task card.
PROMPT
)

tmux send-keys -t arena-master:alpha-ceo "$ALPHA_CEO_PROMPT" Enter
echo -e "  ${GREEN}✓${NC} Α-Tech CEO 已启动"

echo -e "${CYAN}[4/9] 启动 Α-Tech Dev Agents ...${NC}"

for i in 1 2; do
    tmux new-window -t arena-master -n "alpha-dev-$i"
    sleep 1
    tmux send-keys -t "arena-master:alpha-dev-$i" \
        "cd $ARENA_ROOT/alpha/repo && hermes --profile alpha-dev-$i" Enter
    sleep 15

    DEV_PROMPT=$(cat << PROMPT
You are a Developer at Α-Tech Inc. (alpha-dev-$i).

YOUR JOB:
- Read task cards from $ARENA_ROOT/alpha/arena/tasks/
- Implement them following TDD (Test-Driven Development)
- Write progress reports to $ARENA_ROOT/alpha/arena/reports/
- Git commit with meaningful messages (use conventional commits: feat:, fix:, refactor:, docs:, test:)
- When you discover a reusable pattern, create a Skill file in $ARENA_ROOT/alpha/skills/
- When you learn a lesson, save it to your Hermes memory

WORKFLOW:
1. Check tasks/ for the oldest Pending task not assigned to the other dev
2. Read it fully
3. Write tests FIRST -> run to confirm fail -> write minimal code -> run to confirm pass (TDD cycle)
4. Run ALL tests to check for regressions
5. Git commit: git add -A && git commit -m "feat: description"
6. Write a detailed report to arena/reports/
7. Wait for next task

TDD RULES:
- Write tests BEFORE implementation
- Each test verifies ONE behavior
- If a task is unclear, explain in your report — don't guess
- Test coverage should be >= 80%

GIT RULES:
- Commit frequently (after each completed feature)
- Write descriptive commit messages
- Always run tests before committing

When there are no pending tasks, check back in 2 minutes. Do NOT invent your own work — wait for CEO's tasks.
PROMPT
)
    tmux send-keys -t "arena-master:alpha-dev-$i" "$DEV_PROMPT" Enter
    echo -e "  ${GREEN}✓${NC} alpha-dev-$i 已启动"
done

echo -e "${CYAN}[5/9] 启动 Α-Tech Marketing ...${NC}"
tmux new-window -t arena-master -n alpha-mkt
sleep 1
tmux send-keys -t arena-master:alpha-mkt \
    "cd $ARENA_ROOT/alpha/repo && hermes --profile alpha-mkt" Enter
sleep 15

MKT_PROMPT=$(cat << PROMPT
You are the Marketing & Community specialist at Α-Tech Inc.

YOUR JOB:
1. Write and maintain an outstanding README.md (badges, screenshots, quick start, FAQ)
2. Create demo GIFs using asciinema/agg if available
3. Create GitHub Release notes
4. Post about the project on X/Twitter (if xurl tool is available)
5. Analyze β-Labs Corp.'s GitHub repo and write competitive analysis reports
6. Write decision records about marketing strategy

WORKFLOW:
1. First, check $ARENA_ROOT/alpha/arena/tasks/ for CEO assignments
2. If no tasks, proactively look for ways to improve the project's presentation
3. Write reports to $ARENA_ROOT/alpha/arena/reports/

README STANDARDS:
- Great first impression with emoji, badges, and tagline
- Screenshots or GIF demo (keep it short, 15-30 seconds)
- "Quick Start" that works in 2 copy-paste commands
- Detailed usage with examples
- Link to full documentation and contribution guide

COMPETITIVE ANALYSIS:
- Periodically check: https://github.com/$GITHUB_USERNAME/$BETA_REPO
- Compare README quality, features, and Stars
- Write analysis reports with comparison tables and suggested counter-measures

PHASE 1 FOCUS (until $(date -d @$PHASE1_END '+%H:%M')):
- Get the README polished and published
- Ensure the GitHub repo looks professional
- Prepare demo materials for Phase 2 promotion
PROMPT
)

tmux send-keys -t arena-master:alpha-mkt "$MKT_PROMPT" Enter
echo -e "  ${GREEN}✓${NC} Α-Tech Marketing 已启动"

# ──── 6-9. 启动 Beta 团队 ────
echo -e "${CYAN}[6/9] 启动 β-Labs CEO ...${NC}"
tmux new-window -t arena-master -n beta-ceo
sleep 1
tmux send-keys -t arena-master:beta-ceo \
    "cd $ARENA_ROOT/beta/repo && hermes --profile beta-ceo" Enter
sleep 15

BETA_CEO_PROMPT=$(cat << PROMPT
You are the CEO of β-Labs Corp., an autonomous AI software company.

Your mission: Build a successful open-source project that attracts GitHub Stars, competing against Α-Tech Inc.

YOUR TEAM:
- beta-dev-1: Senior developer (frontend/fullstack)
- beta-dev-2: Fullstack developer
- beta-mkt: Marketing & community specialist

HOW TO WORK:
1. Decide your product strategy. Choose something different from what Α-Tech might build.
2. Write task cards to $ARENA_ROOT/beta/arena/tasks/
3. Your agents read tasks from there and write reports to $ARENA_ROOT/beta/arena/reports/
4. Review completed work, make decisions, adjust strategy.

TASK CARD FORMAT:
Write each task as a markdown file: task-001-short-description.md
Include: assigned_to, priority, description, acceptance criteria.

DECISION RECORDING:
Write major decisions to $ARENA_ROOT/beta/arena/decisions/

COMMUNICATION RULES:
- Write tasks ONLY to your team's arena/tasks/
- Read reports from your team's arena/reports/
- Record decisions in arena/decisions/
- Send bulletins to arena/bulletins/
- Never communicate with Α-Tech agents
- You can READ the opponent's public GitHub repo for competitive intel

PHASE 1 GOAL (first $PHASE1_DURATION minutes, until $(date -d @$PHASE1_END '+%H:%M')):
- Pick a product direction
- Build MVP with at least one core feature
- Write excellent README
- Push to GitHub repo (origin is already configured)
- Create Git tag v0.1.0
- Start getting Stars

TIP: Consider using a different tech stack from Α-Tech for differentiation.
Node.js/TypeScript, React components, or VS Code extensions are good options.

BEGIN by deciding your product strategy. What will you build? Write your first task card.
PROMPT
)

tmux send-keys -t arena-master:beta-ceo "$BETA_CEO_PROMPT" Enter
echo -e "  ${GREEN}✓${NC} β-Labs CEO 已启动"

echo -e "${CYAN}[7/9] 启动 β-Labs Dev Agents ...${NC}"

for i in 1 2; do
    tmux new-window -t arena-master -n "beta-dev-$i"
    sleep 1
    tmux send-keys -t "arena-master:beta-dev-$i" \
        "cd $ARENA_ROOT/beta/repo && hermes --profile beta-dev-$i" Enter
    sleep 15

    DEV_PROMPT=$(cat << PROMPT
You are a Developer at β-Labs Corp. (beta-dev-$i).

YOUR JOB:
- Read task cards from $ARENA_ROOT/beta/arena/tasks/
- Implement them following TDD
- Write progress reports to $ARENA_ROOT/beta/arena/reports/
- Git commit with meaningful messages
- Create Skills when you discover reusable patterns

WORKFLOW:
1. Check tasks/ for the oldest Pending task
2. Read it fully
3. TDD cycle: test -> fail -> code -> pass
4. Run ALL tests
5. Git commit
6. Write detailed report
7. Wait for next task

TDD RULES:
- Write tests BEFORE implementation
- Each test verifies ONE behavior
- Test coverage >= 80%
- Always run tests before committing

When there are no pending tasks, check back in 2 minutes. Do NOT invent your own work.
PROMPT
)
    tmux send-keys -t "arena-master:beta-dev-$i" "$DEV_PROMPT" Enter
    echo -e "  ${GREEN}✓${NC} beta-dev-$i 已启动"
done

echo -e "${CYAN}[8/9] 启动 β-Labs Marketing ...${NC}"
tmux new-window -t arena-master -n beta-mkt
sleep 1
tmux send-keys -t arena-master:beta-mkt \
    "cd $ARENA_ROOT/beta/repo && hermes --profile beta-mkt" Enter
sleep 15

BETA_MKT_PROMPT=$(cat << PROMPT
You are the Marketing & Community specialist at β-Labs Corp.

YOUR JOB:
1. Write and maintain an outstanding README.md
2. Create demo GIFs
3. Create GitHub Release notes
4. Post about the project on X/Twitter
5. Analyze Α-Tech Inc.'s GitHub repo and write competitive analysis reports
6. Write marketing strategy decision records

WORKFLOW:
1. Check $ARENA_ROOT/beta/arena/tasks/ for CEO assignments
2. If no tasks, proactively improve project presentation
3. Write reports to $ARENA_ROOT/beta/arena/reports/

COMPETITIVE ANALYSIS:
- Periodically check: https://github.com/$GITHUB_USERNAME/$ALPHA_REPO
- Compare README quality, features, and Stars
- Write analysis reports with suggested counter-measures

PHASE 1 FOCUS (until $(date -d @$PHASE1_END '+%H:%M')):
- Polish README
- Ensure repo looks professional
- Prepare demo materials
PROMPT
)

tmux send-keys -t arena-master:beta-mkt "$BETA_MKT_PROMPT" Enter
echo -e "  ${GREEN}✓${NC} β-Labs Marketing 已启动"

# ──── 9. 写入日志 ────
echo -e "${CYAN}[9/9] 写入启动日志 ...${NC}"
cat >> "$ARENA_ROOT/arena/journal.md" << EOF

## $(date '+%Y-%m-%d %H:%M') — 比赛启动

- 仲裁者已启动
- Α-Tech Inc. 全员启动（CEO + 2 Dev + Marketing）
- β-Labs Corp. 全员启动（CEO + 2 Dev + Marketing）
- Phase 1 开始: $(date '+%H:%M')
- Phase 1 结束: $(date -d @$PHASE1_END '+%H:%M')
EOF
echo -e "  ${GREEN}✓${NC} 日志已写入"

# ──── 完成 ────
echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ 比赛已启动！${NC}"
echo -e "${GREEN}  共 9 个 Agent 在 tmux 中运行${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}查看命令：${NC}"
echo "  tmux attach -t arena-master           # 进入 tmux 查看所有窗口"
echo "  tmux select-window -t arena-master:0  # 查看仲裁者"
echo "  tmux select-window -t arena-master:1  # 查看 Alpha CEO"
echo ""
echo -e "${CYAN}监控命令：${NC}"
echo "  watch -n 60 cat $ARENA_ROOT/arena/leaderboard.md  # 排行榜"
echo "  ls -lt $ARENA_ROOT/alpha/arena/reports/          # Alpha 报告"
echo "  ls -lt $ARENA_ROOT/beta/arena/reports/            # Beta 报告"
echo ""
echo -e "${CYAN}停止比赛：${NC}"
echo "  tmux kill-session -t arena-master     # 停止所有 Agent"
echo "  bash scripts/99-stop-arena.sh         # 停止并生成报告"
echo ""
echo -e "${CYAN}tmux 快捷键：${NC}"
echo "  Ctrl+B n   下一个窗口"
echo "  Ctrl+B p   上一个窗口"
echo "  Ctrl+B w   窗口列表"
echo "  Ctrl+B d   分离会话（回到终端）"
