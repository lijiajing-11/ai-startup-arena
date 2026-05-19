#!/bin/bash
# Arena arbitrator script - runs every 30 min, checks cycle, runs agents
set +euo pipefail  # disable strict mode for reliability
cd /mnt/d/ai-startup-arena || { echo "[ERROR] cd failed"; exit 1; }

ARENA_ROOT="/mnt/d/ai-startup-arena"
MAX_CYCLE=20
CYCLE_FILE="$ARENA_ROOT/arena/arbitrator-cycle.txt"
LEADERBOARD="$ARENA_ROOT/arena/leaderboard.md"
ALPHA_REPO="$ARENA_ROOT/alpha/repo"
BETA_REPO="$ARENA_ROOT/beta/repo"
PROGRESS_DIR="$ARENA_ROOT/arena/progress_reports"

mkdir -p "$ARENA_ROOT/arena" "$PROGRESS_DIR"

# Read current cycle
CURRENT_CYCLE=$(cat "$CYCLE_FILE" 2>/dev/null || echo "17")
if [ -z "$CURRENT_CYCLE" ] || ! echo "$CURRENT_CYCLE" | grep -qE '^[0-9]+$'; then
    CURRENT_CYCLE=17
fi

echo "[Cycle $CURRENT_CYCLE] Starting arbitrator check..."

# Check MAX_CYCLE
if [ "$CURRENT_CYCLE" -ge "$MAX_CYCLE" ]; then
    echo "[Cycle $CURRENT_CYCLE] MAX_CYCLE=$MAX_CYCLE reached. Shutting down."
    echo "$CURRENT_CYCLE" > "$CYCLE_FILE"
    echo "# Arena Complete" > "$ARENA_ROOT/ARENA_COMPLETE.md"
    exit 0
fi

# --- Pollution Detection (Engine A: git diff) ---
pollution_alpha=0
pollution_beta=0
bloat_msg=""

# Alpha pollution check
cd "$ALPHA_REPO" || { echo "[WARN] Alpha repo not found"; cd "$ARENA_ROOT"; }
ALPHA_DIFF=$(git diff HEAD~3 --stat 2>/dev/null || echo "")
ADDED_LINES=$(echo "$ALPHA_DIFF" | grep -Eo '[0-9]+ insertion' | grep -Eo '[0-9]+' || echo "0")
if [ "$ADDED_LINES" -gt 80 ] 2>/dev/null; then
    pollution_alpha=1
    bloat_msg="$bloat_msg Alpha:+${ADDED_LINES}lines"
fi

# Beta pollution check
cd "$BETA_REPO" || { echo "[WARN] Beta repo not found"; cd "$ARENA_ROOT"; }
BETA_DIFF=$(git diff HEAD~3 --stat 2>/dev/null || echo "")
BETA_ADDED=$(echo "$BETA_DIFF" | grep -Eo '[0-9]+ insertion' | grep -Eo '[0-9]+' || echo "0")
if [ "$BETA_ADDED" -gt 80 ] 2>/dev/null; then
    pollution_beta=1
    bloat_msg="$bloat_msg Beta:+${BETA_ADDED}lines"
fi

cd "$ARENA_ROOT"

# --- Check agent output files ---
alpha_ok=0
beta_ok=0
[ -f "$ARENA_ROOT/alpha/arena/reports/report-0$(printf '%03d' $((CURRENT_CYCLE))).md" ] && alpha_ok=1
[ -f "$ARENA_ROOT/beta/arena/reports/report-0$(printf '%03d' $((CURRENT_CYCLE))).md" ] && beta_ok=1

echo "[Cycle $CURRENT_CYCLE] Alpha reports: $alpha_ok, Beta reports: $beta_ok"
echo "[Cycle $CURRENT_CYCLE] Pollution: Alpha=$pollution_alpha, Beta=$pollution_beta"

# --- Score calculation ---
alpha_score=50
beta_score=50
[ "$alpha_ok" = 1 ] && alpha_score=$((alpha_score + 5))
[ "$beta_ok" = 1 ] && beta_score=$((beta_score + 5))
[ "$pollution_alpha" = 1 ] && alpha_score=$((alpha_score - 6))
[ "$pollution_beta" = 1 ] && beta_score=$((beta_score - 6))

# --- Write leaderboard ---
{
    echo "# Arena Leaderboard"
    echo ""
    echo "| Cycle | Alpha (A-Tech) | Beta (B-Labs) |"
    echo "|-------|---------------|---------------|"
    CURRENT_SCORE="$alpha_score"
    RIVAL_SCORE="$beta_score"
    for c in $(seq 1 "$CURRENT_CYCLE"); do
        fn="$PROGRESS_DIR/cycle-$(printf '%03d' $c).txt"
        if [ -f "$fn" ]; then
            read a b < "$fn"
            echo "| $c | $a | $b |"
        else
            echo "| $c | - | - |"
        fi
    done
    echo "| **$CURRENT_CYCLE** | **$CURRENT_SCORE** | **$RIVAL_SCORE** |"
} > "$LEADERBOARD"

# Save cycle score
echo "$alpha_score $beta_score" > "$PROGRESS_DIR/cycle-$(printf '%03d' $CURRENT_CYCLE).txt"

echo "[Cycle $CURRENT_CYCLE] Leaderboard: Alpha $alpha_score - Beta $beta_score"

# --- Increment cycle ---
NEXT_CYCLE=$((CURRENT_CYCLE + 1))
echo "$NEXT_CYCLE" > "$CYCLE_FILE"
echo "[Cycle $CURRENT_CYCLE -> $NEXT_CYCLE] Completed. Next run in 30min."

# --- Trigger prompt files update ---
# Write fresh context files for next cycle's agents
for team in alpha beta; do
    for role in ceo dev-1 dev-2 mkt; do
        profile="${team}-${role}"
        prompt_file="$ARENA_ROOT/prompts/$profile.txt"
        if [ -f "$prompt_file" ]; then
            # Inject current cycle number
            echo "[auto-update] Cycle $NEXT_CYCLE/$MAX_CYCLE"
        fi
    done
done

exit 0
