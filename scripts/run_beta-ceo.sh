#!/bin/bash
# run_beta-ceo.sh — BETA CEO
cd /mnt/d/ai-startup-arena
while true; do
  PROMPT_FILE="/mnt/d/ai-startup-arena/beta/profiles/beta-ceo.txt"
  
  # 合并刺激信号到 prompt
  SPUR_DIR="beta/arena/arbitrator-spur-*"
  SPUR_FILES=$(ls $SPUR_DIR 2>/dev/null)
  if [ -n "$SPUR_FILES" ]; then
    SPUR=$(cat $SPUR_FILES 2>/dev/null)
    BASEPROMPT=$(cat "$PROMPT_FILE")
    FULLPROMPT="$BASEPROMPT

[ARBITRATOR STATUS UPDATE]
$SPUR"
    rm -f $SPUR_FILES
  else
    FULLPROMPT=$(cat "$PROMPT_FILE")
  fi
  
  # 使用 profile 长期会话模式（节省tokens）
  hermes -p beta-ceo -z "$FULLPROMPT"
  
  # 检查是否有 arena 通信文件需要push
  if [ -n "$(cd beta/repo && git status --porcelain)" ]; then
    (cd beta/repo && flock -n .git/push.lock -c "git add -A && git commit -m 'beta-ceo cycle $(date +%H:%M)' && git push") || true
  fi
  
  sleep 360
done
