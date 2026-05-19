#!/bin/bash
# Dev agent wrapper: runs hermes profile in repo dir, auto commits any changes
# Agents write code in repo/ dir, wrapper handles git

PROFILE="$1"
REPO_DIR="$2"
INTERVAL="$3"
shift 3
PROMPT="$*"

cd "$REPO_DIR"

while true; do
  echo "=== [$PROFILE] Starting round ==="
  
  # Run hermes profile in repo directory - agent modifies repo files
  hermes profile "$PROFILE" --prompt "$PROMPT" -Q --silent 2>/dev/null
  
  # Auto-commit any changes in the repo
  if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    git add -A
    if ! git diff --cached --quiet; then
      git commit -m "auto: [$PROFILE] $(date '+%Y-%m-%d %H:%M')"
      git push origin HEAD
      echo "=== [$PROFILE] Committed and pushed ==="
    else
      echo "=== [$PROFILE] No staged changes ==="
    fi
  else
    echo "=== [$PROFILE] No changes to commit ==="
  fi
  
  echo "=== [$PROFILE] Round done, sleep ${INTERVAL}s ==="
  sleep "$INTERVAL"
done
