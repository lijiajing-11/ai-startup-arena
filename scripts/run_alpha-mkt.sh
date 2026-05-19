#!/bin/bash
# run_alpha-mkt.sh — ALPHA MKT
cd /mnt/d/ai-startup-arena
while true; do
  PROMPT_FILE="/mnt/d/ai-startup-arena/alpha/profiles/alpha-mkt.txt"
  PROMPT=$(cat "$PROMPT_FILE")
  
  # 使用 profile 长期会话模式（节省tokens）
  hermes -p alpha-mkt -z "$PROMPT"
  
  # 用自己的锁文件方式 git push（subshell避免cd污染）
  if [ -n "$(cd alpha/repo && git status --porcelain)" ]; then
    (cd alpha/repo && flock -n .git/push.lock -c "git add -A && git commit -m 'alpha-mkt cycle $(date +%H:%M)' && git push") || true
  fi
  
  sleep 300
done
