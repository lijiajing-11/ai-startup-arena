#!/bin/bash
# run_alpha-ceo.sh — ALPHA CEO
cd /mnt/d/ai-startup-arena
while true; do
  PROMPT_FILE="/mnt/d/ai-startup-arena/alpha/profiles/alpha-ceo.txt"
  
  # 合并刺激信号到 prompt
  SPUR_DIR="alpha/arena/arbitrator-spur-*"
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
  hermes -p alpha-ceo -z "$FULLPROMPT"
  
  # 检查是否有 arena 通信文件需要push
  if [ -n "$(cd alpha/repo && git status --porcelain)" ]; then
    (cd alpha/repo && flock -n .git/push.lock -c "git add -A && git commit -m 'alpha-ceo cycle $(date +%H:%M)' && git push") || true
  fi
  
  sleep 360
done
