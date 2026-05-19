#!/bin/bash
# ceo_wrapper.sh — CEO Agent（hermes profile 模式）
# 用法: ./ceo_wrapper.sh <team_name> <profile_name> <agent_prompt>
set -e

TEAM_NAME="$1"
PROFILE_NAME="$2"
AGENT_PROMPT="$3"

cd "/mnt/d/ai-startup-arena/$TEAM_NAME/repo" || { echo "ERROR: cannot cd"; exit 1; }

echo "[CEO] Starting $PROFILE_NAME in $(pwd)"

while true; do
  # 检查仲裁者刺激信号
  SPUR_FILE="../arena/arbitrator-spur-*"
  FULL_PROMPT="$AGENT_PROMPT"
  if ls $SPUR_FILE 2>/dev/null; then
    SPUR_CONTENT=$(cat $SPUR_FILE 2>/dev/null)
    FULL_PROMPT="$AGENT_PROMPT

[ARBITRATOR STATUS UPDATE]
$SPUR_CONTENT"
    echo "[CEO] Read spur file"
    rm -f $SPUR_FILE
    echo "[CEO] Deleted spur file"
  fi

  # 运行 hermes profile（CEO 需要角色扮演输出决策）
  echo "[CEO] Running hermes profile $PROFILE_NAME ..."
  echo "$FULL_PROMPT" | timeout 300 hermes profile "$PROFILE_NAME" 2>/dev/null || echo "[CEO] Profile returned"
  echo "[CEO] Profile done"

  # CEO 不直接改代码，不 push

  sleep 120  # CEO 间隔长一点
done
