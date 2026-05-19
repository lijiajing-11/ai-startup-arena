#!/bin/bash
# Non-dev agent wrapper: runs hermes profile.
# CEO/Mkt write arena communication files (not in repo), so no auto-commit.

PROFILE="$1"
CWD="$2"
INTERVAL="$3"
shift 3
PROMPT="$*"

cd "$CWD"

while true; do
  echo "=== [$PROFILE] Starting round ==="
  hermes profile "$PROFILE" --prompt "$PROMPT" -Q --silent 2>/dev/null
  echo "=== [$PROFILE] Round done, sleep ${INTERVAL}s ==="
  sleep "$INTERVAL"
done
