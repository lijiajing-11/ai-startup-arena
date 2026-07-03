#!/bin/bash
ARENA="/mnt/d/ai-startup-arena"

echo "=== ALPHA GIT LOG ==="
git -C "$ARENA/alpha/repo" log --oneline -3 2>/dev/null || echo "NO_ALPHA_GIT"
echo ""

echo "=== BETA REPO CHECK ==="
if [ -d "$ARENA/beta/repo" ]; then
  echo "BETA REPO EXISTS"
  git -C "$ARENA/beta/repo" log --oneline -3 2>/dev/null || echo "NO_BETA_GIT"
else
  echo "BETA REPO NOT FOUND"
  echo "Contents of $ARENA/beta/:"
  ls "$ARENA/beta/" 2>/dev/null
fi
echo ""

echo "=== ALPHA REPO STATS ==="
cd "$ARENA/alpha/repo" && git rev-list --count HEAD 2>/dev/null && echo "commits" || echo "NO_COMMITS"
echo ""

echo "=== SKILLS CHECK ==="
echo "Looking for SKILL.* files..."
find "$ARENA/sop" -name "SKILL*" -type f 2>/dev/null | head -10
echo ""

echo "=== REPORTS CHECK ==="
echo "Alpha reports:"
ls "$ARENA/alpha/arena/reports/" 2>/dev/null | wc -l
echo "Beta reports:"
ls "$ARENA/beta/arena/reports/" 2>/dev/null | wc -l
echo ""

echo "=== LATEST FILES ==="
find "$ARENA" -maxdepth 1 -type f -name "*.md" -newer "$ARENA/summary.md" 2>/dev/null | head -5
