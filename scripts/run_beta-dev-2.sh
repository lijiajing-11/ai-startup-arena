#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/beta-dev-2.txt")
  echo "$PROMPT" | timeout 300 hermes -p "beta-dev-2" -z "$PROMPT"
  echo "[run_beta-dev-2] done, sleeping 240s..."
  sleep 240
done
