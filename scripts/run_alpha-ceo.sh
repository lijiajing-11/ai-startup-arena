#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/alpha-ceo.txt 2>/dev/null || echo "default prompt")
  echo "Starting alpha-ceo..."
  echo "$PROMPT" | timeout 300 hermes -p alpha-ceo -z "$PROMPT"
  EC=$?
  echo "[run_alpha-ceo] exit=$EC, sleeping 360s..."
  sleep 360
done
