#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/alpha-mkt.txt")
  echo "$PROMPT" | timeout 300 hermes -p "alpha-mkt" -z "$PROMPT"
  echo "[run_alpha-mkt] done, sleeping 300s..."
  sleep 300
done
