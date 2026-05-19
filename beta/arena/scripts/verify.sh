#!/usr/bin/env bash
# β-Labs Corp. — 快速验证脚本
# 用法: bash beta/arena/scripts/verify.sh
set -e

echo "=== 🔍 β-Labs Quick Verify ==="

cd "$(dirname "$0")/../../repo"

echo "1/3: Running tests..."
npm test -- --reporter=dot 2>&1 | tail -5

echo ""
echo "2/3: Building..."
npm run build 2>&1 | tail -3

echo ""
echo "3/3: Checking dist..."
ls dist/index.js 2>/dev/null && echo "✅ dist/index.js exists" || echo "❌ dist/index.js missing"

echo ""
echo "=== ✅ Verify Complete ==="
