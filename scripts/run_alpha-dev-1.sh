#!/bin/bash
# run_alpha-dev-1.sh — Alpha DEV
cd /mnt/d/ai-startup-arena
while true; do
  PROMPT_FILE="/mnt/d/ai-startup-arena/alpha/profiles/alpha-dev-1.txt"
  PROMPT=$(cat "$PROMPT_FILE")
  
  # 使用 profile 长期会话模式（节省tokens）
  hermes -p alpha-dev-1 -z "$PROMPT"
  
  # 用自己的锁文件方式 git push（subshell避免cd污染）
  if [ -n "$(cd alpha/repo && git status --porcelain)" ]; then
    (cd alpha/repo && flock -n .git/push.lock -c "git add -A && git commit -m 'alpha-dev-1 cycle $(date +%H:%M)' && git push") || true
  fi
  
  sleep 180
done
