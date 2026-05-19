#!/bin/bash
# run_beta-mkt.sh — BETA MKT
cd /mnt/d/ai-startup-arena
while true; do
  PROMPT_FILE="/mnt/d/ai-startup-arena/beta/profiles/beta-mkt.txt"
  PROMPT=$(cat "$PROMPT_FILE")
  
  # 使用 profile 长期会话模式（节省tokens）
  hermes -p beta-mkt -z "$PROMPT"
  
  # 用自己的锁文件方式 git push（subshell避免cd污染）
  if [ -n "$(cd beta/repo && git status --porcelain)" ]; then
    (cd beta/repo && flock -n .git/push.lock -c "git add -A && git commit -m 'beta-mkt cycle $(date +%H:%M)' && git push") || true
  fi
  
  sleep 300
done
