#!/bin/bash
set -euo pipefail
cd "/mnt/d/ai-startup-arena"
while true; do
  PROMPT=$(cat "/mnt/d/ai-startup-arena/prompts/beta-mkt.txt")
  echo "$PROMPT" | timeout 300 hermes -p "beta-mkt" -z "$PROMPT"
  echo "[run_beta-mkt] done, sleeping 300s..."
  sleep 300
done
