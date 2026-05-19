#!/bin/bash
# launch_arena.sh — 启动所有 Agent (profile 长期会话模式)
set -e

ARENA_ROOT="/mnt/d/ai-startup-arena"
SCRIPTS_DIR="$ARENA_ROOT/scripts"

SESSION="arena-master"

echo "=== Launching Arena Agents (Profile Mode via run scripts) ==="

# Window 1: Alpha CEO
tmux new-window -t "$SESSION" -n alpha-ceo
tmux send-keys -t "$SESSION:alpha-ceo" "cd $ARENA_ROOT && bash scripts/run_alpha-ceo.sh" Enter

# Window 2: Alpha Dev-1
tmux new-window -t "$SESSION" -n alpha-dev-1
tmux send-keys -t "$SESSION:alpha-dev-1" "cd $ARENA_ROOT && bash scripts/run_alpha-dev-1.sh" Enter

# Window 3: Alpha Dev-2
tmux new-window -t "$SESSION" -n alpha-dev-2
tmux send-keys -t "$SESSION:alpha-dev-2" "cd $ARENA_ROOT && bash scripts/run_alpha-dev-2.sh" Enter

# Window 4: Alpha Marketing
tmux new-window -t "$SESSION" -n alpha-mkt
tmux send-keys -t "$SESSION:alpha-mkt" "cd $ARENA_ROOT && bash scripts/run_alpha-mkt.sh" Enter

# Window 5: Beta CEO
tmux new-window -t "$SESSION" -n beta-ceo
tmux send-keys -t "$SESSION:beta-ceo" "cd $ARENA_ROOT && bash scripts/run_beta-ceo.sh" Enter

# Window 6: Beta Dev-1
tmux new-window -t "$SESSION" -n beta-dev-1
tmux send-keys -t "$SESSION:beta-dev-1" "cd $ARENA_ROOT && bash scripts/run_beta-dev-1.sh" Enter

# Window 7: Beta Dev-2
tmux new-window -t "$SESSION" -n beta-dev-2
tmux send-keys -t "$SESSION:beta-dev-2" "cd $ARENA_ROOT && bash scripts/run_beta-dev-2.sh" Enter

# Window 8: Beta Marketing
tmux new-window -t "$SESSION" -n beta-mkt
tmux send-keys -t "$SESSION:beta-mkt" "cd $ARENA_ROOT && bash scripts/run_beta-mkt.sh" Enter

echo ""
echo "=== All 9 windows created ==="
echo "Windows: arbitrator, alpha-ceo, alpha-dev-1, alpha-dev-2, alpha-mkt, beta-ceo, beta-dev-1, beta-dev-2, beta-mkt"
