#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/alpha-dev-2.txt 2>/dev/null || echo "default prompt")
  echo "Starting alpha-dev-2..."
  echo "$PROMPT" | timeout 300 hermes -p alpha-dev-2 -z "$PROMPT"
  EC=$?
  echo "[run_alpha-dev-2] exit=$EC, sleeping 240s..."
  sleep 240
done
