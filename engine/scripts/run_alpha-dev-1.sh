#!/bin/bash
set +euo pipefail
cd /mnt/d/ai-startup-arena/alpha/repo || exit 1
while true; do
  PROMPT=$(cat /mnt/d/ai-startup-arena/prompts/alpha-dev-1.txt 2>/dev/null || echo "default prompt")
  echo "Starting alpha-dev-1..."
  echo "$PROMPT" | timeout 300 hermes -p alpha-dev-1 -z "$PROMPT"
  EC=$?
  echo "[run_alpha-dev-1] exit=$EC, sleeping 360s..."
  sleep 360
done
