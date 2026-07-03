#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena/alpha/repo || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/alpha-mkt.txt 2>/dev/null || echo "default prompt")
  echo "Starting alpha-mkt..."
  echo "$PROMPT" | timeout 300 hermes -p alpha-mkt -z "$PROMPT"
  EC=$?
  echo "[run_alpha-mkt] exit=$EC, sleeping 360s..."
  sleep 360
done
