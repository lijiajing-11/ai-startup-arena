#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena/beta/repo || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/beta-ceo.txt 2>/dev/null || echo "default prompt")
  echo "Starting beta-ceo..."
  echo "$PROMPT" | timeout 300 hermes -p beta-ceo -z "$PROMPT"
  EC=$?
  echo "[run_beta-ceo] exit=$EC, sleeping 360s..."
  sleep 360
done
