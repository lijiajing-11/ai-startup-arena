#!/bin/bash
# scripts/check-evolution.sh
# AI Arena 进化状态检查脚本
echo "=== 进化状态检查 ==="
echo "最近提交:"
git log --oneline -5 2>/dev/null
echo ""
echo "项目文件统计:"
find . -name "*.md" -o -name "*.py" -o -name "*.ts" 2>/dev/null | wc -l
echo " 个源文件"
