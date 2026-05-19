#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/beta-mkt.txt 2>/dev/null || echo "default prompt")
  echo "Starting beta-mkt..."
  echo "$PROMPT" | timeout 300 hermes -p beta-mkt -z "$PROMPT"
  EC=$?
  echo "[run_beta-mkt] exit=$EC, sleeping 300s..."
  sleep 300
done
