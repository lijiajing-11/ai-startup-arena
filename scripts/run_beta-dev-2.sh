#!/bin/bash
# run_beta-dev-2.sh — BETA DEV
cd /mnt/d/ai-startup-arena
while true; do
  PROMPT_FILE="/mnt/d/ai-startup-arena/beta/profiles/beta-dev-2.txt"
  PROMPT=$(cat "$PROMPT_FILE")
  
  # 使用 profile 长期会话模式（节省tokens）
  hermes -p beta-dev-2 -z "$PROMPT"
  
  # 用自己的锁文件方式 git push（subshell避免cd污染）
  if [ -n "$(cd beta/repo && git status --porcelain)" ]; then
    (cd beta/repo && flock -n .git/push.lock -c "git add -A && git commit -m 'beta-dev-2 cycle $(date +%H:%M)' && git push") || true
  fi
  
  sleep 240
done
