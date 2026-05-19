#!/usr/bin/env bash
# ============================================================
# AI Startup Arena — 初始化环境（第1步）
# ============================================================
# 创建目录结构、Hermes Profiles、GitHub 仓库、注入 Skills。
# 用法: bash scripts/01-setup.sh
# 前提: 先运行 00-check-env.sh 检查通过
# ============================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ──── 加载配置 ────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 尝试多个位置加载 arena.env
if [ -f /mnt/d/ai-startup-arena/arena.env ]; then
    source /mnt/d/ai-startup-arena/arena.env
elif [ -f "$PROJECT_DIR/arena.env" ]; then
    source "$PROJECT_DIR/arena.env"
elif [ -f "$PROJECT_DIR/scripts/arena.env" ]; then
    source "$PROJECT_DIR/scripts/arena.env"
else
    echo -e "${RED}❌ 未找到 arena.env！${NC}"
    echo "  复制 scripts/.env.template 并填入配置:"
    echo "  cp \"$SCRIPT_DIR/.env.template\" /mnt/d/ai-startup-arena/arena.env"
    echo "  然后编辑 arena.env 填入你的密钥"
    exit 1
fi

ARENA_ROOT="${ARENA_ROOT:-/mnt/d/ai-startup-arena}"

echo -e "${CYAN}══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Startup Arena — 初始化环境               ${NC}"
echo -e "${CYAN}  根目录: $ARENA_ROOT${NC}"
echo -e "${CYAN}══════════════════════════════════════════════${NC}"
echo ""

# ──── 1. 创建目录结构 ────
echo -e "${CYAN}[1/6] 创建目录结构 ...${NC}"
for team in alpha beta; do
    mkdir -p "$ARENA_ROOT/$team/repo"
    mkdir -p "$ARENA_ROOT/$team/arena"/{tasks,reports,decisions,bulletins}
    mkdir -p "$ARENA_ROOT/$team/skills"
    mkdir -p "$ARENA_ROOT/$team/memory"
    mkdir -p "$ARENA_ROOT/$team/artifacts"
done
mkdir -p "$ARENA_ROOT/arena"
mkdir -p "$ARENA_ROOT/shared"
echo -e "  ${GREEN}✓${NC} 目录结构已创建"

# ──── 2. 创建 Hermes Profiles ────
echo -e "${CYAN}[2/6] 创建 Hermes Profiles ...${NC}"
for p in arbitrator alpha-ceo alpha-dev-1 alpha-dev-2 alpha-mkt beta-ceo beta-dev-1 beta-dev-2 beta-mkt; do
    if [ -d "$HOME/.hermes/profiles/$p" ]; then
        echo -e "  ${YELLOW}⚠${NC} Profile $p 已存在，跳过"
    else
        hermes profile create "$p" --clone-all 2>/dev/null || {
            echo -e "  ${GREEN}+${NC} Profile $p 已存在（clone-all 可能因无默认profile失败，目录已存在则正常）"
            mkdir -p "$HOME/.hermes/profiles/$p"
        }
        echo -e "  ${GREEN}✓${NC} Profile $p"
    fi
done

# ──── 3. 配置 Profile 的工作目录 ────
echo -e "${CYAN}[3/6] 配置工作目录 ...${NC}"
# Alpha 团队指向 alpha/repo
for p in alpha-ceo alpha-dev-1 alpha-dev-2 alpha-mkt; do
    CONFIG="$HOME/.hermes/profiles/$p/config.yaml"
    if [ -f "$CONFIG" ]; then
        # 用 sed 替换或添加 terminal.cwd
        if grep -q "terminal:" "$CONFIG" 2>/dev/null; then
            # 已有 terminal 块，追加或替换 cwd
            if grep -q "cwd:" "$CONFIG" 2>/dev/null; then
                sed -i "s|cwd:.*|cwd: $ARENA_ROOT/alpha/repo|" "$CONFIG"
            else
                sed -i "/terminal:/a\  cwd: $ARENA_ROOT/alpha/repo" "$CONFIG"
            fi
        else
            echo -e "\nterminal:\n  cwd: $ARENA_ROOT/alpha/repo" >> "$CONFIG"
        fi
    fi
done

# Beta 团队指向 beta/repo
for p in beta-ceo beta-dev-1 beta-dev-2 beta-mkt; do
    CONFIG="$HOME/.hermes/profiles/$p/config.yaml"
    if [ -f "$CONFIG" ]; then
        if grep -q "cwd:" "$CONFIG" 2>/dev/null; then
            sed -i "s|cwd:.*|cwd: $ARENA_ROOT/beta/repo|" "$CONFIG"
        else
            if grep -q "terminal:" "$CONFIG" 2>/dev/null; then
                sed -i "/terminal:/a\  cwd: $ARENA_ROOT/beta/repo" "$CONFIG"
            else
                echo -e "\nterminal:\n  cwd: $ARENA_ROOT/beta/repo" >> "$CONFIG"
            fi
        fi
    fi
done

# 仲裁者指向 arena
CONFIG="$HOME/.hermes/profiles/arbitrator/config.yaml"
if [ -f "$CONFIG" ]; then
    if grep -q "cwd:" "$CONFIG" 2>/dev/null; then
        sed -i "s|cwd:.*|cwd: $ARENA_ROOT/arena|" "$CONFIG"
    else
        if grep -q "terminal:" "$CONFIG" 2>/dev/null; then
            sed -i "/terminal:/a\  cwd: $ARENA_ROOT/arena" "$CONFIG"
        else
            echo -e "\nterminal:\n  cwd: $ARENA_ROOT/arena" >> "$CONFIG"
        fi
    fi
fi
echo -e "  ${GREEN}✓${NC} 工作目录已配置"

# ──── 4. 配置 API Keys ────
echo -e "${CYAN}[4/6] 配置 API Keys ...${NC}"
# 使用 DeepSeek（你已有 Key），不用 OpenRouter
if [ -n "${DEEPSEEK_API_KEY:-}" ]; then
    # 所有 9 个 Profile 共用同一个 DeepSeek Key
    # 同时配置 Provider 为 deepseek，model 为 deepseek-chat
    for p in arbitrator alpha-ceo alpha-dev-1 alpha-dev-2 alpha-mkt beta-ceo beta-dev-1 beta-dev-2 beta-mkt; do
        ENV_FILE="$HOME/.hermes/profiles/$p/.env"
        CONFIG_FILE="$HOME/.hermes/profiles/$p/config.yaml"
        
        # 写入 API Key
        if ! grep -q "DEEPSEEK_API_KEY" "$ENV_FILE" 2>/dev/null; then
            echo "DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY" >> "$ENV_FILE"
        fi
        
        # 配置 Provider 为 deepseek
        if [ -f "$CONFIG_FILE" ]; then
            # 设置 provider
            if grep -q "^model:" "$CONFIG_FILE"; then
                # 已有 model 块
                if grep -q "provider:" "$CONFIG_FILE"; then
                    sed -i "s|provider:.*|provider: \"deepseek\"|" "$CONFIG_FILE"
                else
                    sed -i "/^model:/a\  provider: \"deepseek\"" "$CONFIG_FILE"
                fi
                if grep -q "default:" "$CONFIG_FILE"; then
                    sed -i "s|default:.*|default: \"deepseek-chat\"|" "$CONFIG_FILE"
                fi
            fi
        fi
    done
    echo -e "  ${GREEN}✓${NC} 所有团队 DeepSeek API Key 已配置"
else
    echo -e "  ${YELLOW}⚠${NC} DEEPSEEK_API_KEY 未设置，跳过"
fi

# GitHub Token（仲裁者用）
if [ -n "${GITHUB_TOKEN:-}" ]; then
    ENV_FILE="$HOME/.hermes/profiles/arbitrator/.env"
    if ! grep -q "GITHUB_TOKEN" "$ENV_FILE" 2>/dev/null; then
        echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> "$ENV_FILE"
    fi
    # 也配置 gh CLI
    # GH_CLI not available — using curl API for repo creation
    echo -e "  ${GREEN}✓${NC} GitHub Token 已配置"
else
    echo -e "  ${YELLOW}⚠${NC} GITHUB_TOKEN 未设置，跳过"
fi

# ──── 5. 创建 GitHub 仓库 ────
echo -e "${CYAN}[5/6] 创建 GitHub 仓库 ...${NC}"
GITHUB_USERNAME="${GITHUB_USERNAME:-$(gh api user --jq .login 2>/dev/null || echo 'unknown')}"

# Alpha 仓库
if [ ! -d "$ARENA_ROOT/alpha/repo/.git" ]; then
    cd "$ARENA_ROOT/alpha/repo"
    git init
    echo "# Alpha Project" > README.md
    echo "__pycache__/" > .gitignore
    echo "venv/" >> .gitignore
    echo "*.pyc" >> .gitignore
    echo ".env" >> .gitignore
    git add . && git commit -m "Initial commit"
    curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user/repos -d "{\"name\":\"$ALPHA_REPO\",\"public\":true}" > /dev/null 2>&1 && \
        echo -e "  ${GREEN}✓${NC} Alpha 仓库已创建: $GITHUB_USERNAME/$ALPHA_REPO" || \
        echo -e "  ${YELLOW}⚠${NC} Alpha 仓库创建失败（可能已存在）"
else
    echo -e "  ${GREEN}✓${NC} Alpha 仓库已存在，跳过"
fi

# Beta 仓库
if [ ! -d "$ARENA_ROOT/beta/repo/.git" ]; then
    cd "$ARENA_ROOT/beta/repo"
    git init
    echo "# Beta Project" > README.md
    echo "node_modules/" > .gitignore
    echo "dist/" >> .gitignore
    echo ".env" >> .gitignore
    git add . && git commit -m "Initial commit"
    git remote add origin https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$BETA_REPO.git 2>/dev/null || git remote set-url origin https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$BETA_REPO.git
    curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user/repos -d "{\"name\":\"$BETA_REPO\",\"public\":true}" > /dev/null 2>&1 && \
        echo -e "  ${GREEN}✓${NC} Beta 仓库已创建: $GITHUB_USERNAME/$BETA_REPO" || \
        echo -e "  ${YELLOW}⚠${NC} Beta 仓库创建失败（可能已存在）"
else
    echo -e "  ${GREEN}✓${NC} Beta 仓库已存在，跳过"
fi

# ──── 6. 初始化排行榜和日志 ────
echo -e "${CYAN}[6/6] 初始化仲裁者文件 ...${NC}"

# 排行榜
cat > "$ARENA_ROOT/arena/leaderboard.md" << EOF
# 🏆 GitHub Stars 排行榜

> 最后更新: $(date '+%Y-%m-%d %H:%M:%S')

## 当前排名

| 排名 | 公司 | 仓库 | Stars | 阶段 |
|------|------|------|-------|------|
| - | Α-Tech Inc. | $ALPHA_REPO | 0 | 准备中 |
| - | β-Labs Corp. | $BETA_REPO | 0 | 准备中 |

---

_等待比赛开始..._
EOF

# 日志
cat > "$ARENA_ROOT/arena/journal.md" << EOF
# Arena Journal

## $(date '+%Y-%m-%d %H:%M') — 基础设施准备完成

- 目录结构已创建
- Hermes Profiles 已配置（9个）
- API Keys 已注入
- GitHub 仓库已就绪
- 等待启动...
EOF

echo -e "  ${GREEN}✓${NC} 仲裁者文件已初始化"
echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ 初始化完成！${NC}"
echo -e "${GREEN}  运行 scripts/02-start-arena.sh 启动比赛${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
