#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/beta-ceo.txt")
  echo "$PROMPT" | timeout 300 hermes -p "beta-ceo" -z "$PROMPT"
  echo "[run_beta-ceo] done, sleeping 360s..."
  sleep 360
done
