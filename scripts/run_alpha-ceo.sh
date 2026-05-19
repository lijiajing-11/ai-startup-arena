#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/alpha-ceo.txt")
  echo "$PROMPT" | timeout 300 hermes -p "alpha-ceo" -z "$PROMPT"
  echo "[run_alpha-ceo] done, sleeping 360s..."
  sleep 360
done
