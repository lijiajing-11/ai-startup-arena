#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/beta-dev-2.txt 2>/dev/null || echo "default prompt")
  echo "Starting beta-dev-2..."
  echo "$PROMPT" | timeout 300 hermes -p beta-dev-2 -z "$PROMPT"
  EC=$?
  echo "[run_beta-dev-2] exit=$EC, sleeping 240s..."
  sleep 240
done
