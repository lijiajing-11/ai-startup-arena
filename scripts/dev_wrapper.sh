#!/bin/bash
# dev_wrapper.sh — 用于 dev 和 mkt Agent
# 用法: ./dev_wrapper.sh <repo_dir> <team_name> <agent_prompt>
set -e

REPO_DIR="$1"
TEAM_NAME="$2"
AGENT_PROMPT="$3"

cd "$REPO_DIR" || { echo "ERROR: cannot cd to $REPO_DIR"; exit 1; }

echo "[WRAPPER] Starting $TEAM_NAME in $(pwd)"
echo "[WRAPPER] Arena root: $(dirname $(pwd))/arena"

while true; do
  # 检查仲裁者刺激信号
  SPUR_FILE="$(dirname $(pwd))/arena/arbitrator-spur-*"
  FULL_PROMPT="$AGENT_PROMPT"
  if ls $SPUR_FILE 2>/dev/null; then
    SPUR_CONTENT=$(cat $SPUR_FILE 2>/dev/null)
    FULL_PROMPT="$AGENT_PROMPT

[ARBITRATOR STATUS UPDATE]
$SPUR_CONTENT"
    echo "[WRAPPER] Read spur file"
    rm -f $SPUR_FILE
    echo "[WRAPPER] Deleted spur file"
  fi

  # 运行 Agent
  echo "[WRAPPER] Running hermes chat -p ..."
  hermes chat -p "$FULL_PROMPT" -Q --silent 2>/dev/null || true
  echo "[WRAPPER] Agent done"

  # 强制 git push
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    echo "[WRAPPER] Changes detected, committing..."
    git add -A
    git commit -m "arena cycle $(date +%H:%M)"
    git push
    echo "[WRAPPER] Pushed"
  else
    echo "[WRAPPER] No changes"
  fi

  sleep 60
done
