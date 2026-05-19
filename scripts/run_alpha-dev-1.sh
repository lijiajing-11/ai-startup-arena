#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/alpha-dev-1.txt")
  echo "$PROMPT" | timeout 300 hermes -p "alpha-dev-1" -z "$PROMPT"
  echo "[run_alpha-dev-1] done, sleeping 180s..."
  sleep 180
done
