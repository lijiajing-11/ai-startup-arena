#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena/beta/repo || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/beta-dev-1.txt 2>/dev/null || echo "default prompt")
  echo "Starting beta-dev-1..."
  echo "$PROMPT" | timeout 300 hermes -p beta-dev-1 -z "$PROMPT"
  EC=$?
  echo "[run_beta-dev-1] exit=$EC, sleeping 360s..."
  sleep 360
done
