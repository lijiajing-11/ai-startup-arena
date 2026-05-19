#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/alpha-dev-2.txt")
  echo "$PROMPT" | timeout 300 hermes -p "alpha-dev-2" -z "$PROMPT"
  echo "[run_alpha-dev-2] done, sleeping 240s..."
  sleep 240
done
