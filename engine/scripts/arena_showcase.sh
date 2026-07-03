#!/bin/bash
# Arena Showcase — 一键启动器
# 放在桌面双击运行

ARENA_ROOT="/mnt/d/ai-startup-arena"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        AI Startup Arena · 成果展示                      ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  1️⃣  巅峰对决 · ARA vs repo-sense 真实CLI对战           ║"
echo "║      → 左右分栏对比 stars/insight/battle 输出           ║"
echo "║      → 真实GitHub数据 · 计时PK                          ║"
echo "║                                                          ║"
echo "║  2️⃣  时间线延时摄影 · 20个Cycle代码库生长动画           ║"
echo "║      → git log驱动 · 进度条+提交回放                    ║"
echo "║      → 从零到330 commits的8小时进化                      ║"
echo "║                                                          ║"
echo "║  3️⃣  完整总结文档 · summary.md                          ║"
echo "║  4️⃣  思维导图 · AI_Startup_Arena_总结.xmind              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -n "  选择 (1/2/3/4/q): "
read choice

case $choice in
    1)
        echo ""
        echo "  🥊 启动巅峰对决..."
        sleep 1
        cd "$ARENA_ROOT" && python3 scripts/arena_showdown.py
        ;;
    2)
        echo ""
        echo "  🎬 启动时间线延时摄影..."
        sleep 1
        cd "$ARENA_ROOT" && python3 scripts/arena_timeline.py
        ;;
    3)
        echo ""
        cat "$ARENA_ROOT/summary.md" | head -50
        echo ""
        echo "  (全文见 $ARENA_ROOT/summary.md)"
        ;;
    4)
        echo ""
        echo "  文件位置:"
        echo "  C:\\Users\\10608\\Desktop\\AI_Startup_Arena_总结.xmind"
        echo "  C:\\Users\\10608\\Desktop\\AI_Startup_Arena_总结.mm"
        echo ""
        echo "  双击打开 .xmind 或 .mm 文件即可"
        ;;
    q|Q)
        exit 0
        ;;
    *)
        echo "  无效选择"
        ;;
esac

echo ""
echo -n "  按 Enter 退出..."
read
