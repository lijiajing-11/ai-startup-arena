# 📢 市场运营 — 标准操作流程 (SOP)

> **来源:** MetaGPT 角色驱动 + 开源项目运营实践 + OpenSpace 跨队经验共享
> **作用:** Marketing Agent 在每个 Cycle 中的对外推广流程

---

## 📋 操作流程

```
Cycle 开始
    │
    ├── 1️⃣ 受众分析
    │   ├── 确定目标用户画像 (开发者/团队/企业)
    │   ├── 分析竞品的宣传策略和卖点
    │   ├── 收集用户评价和讨论热点
    │   └── 总结本轮的宣传核心信息
    │
    ├── 2️⃣ README 编写与更新
    │   ├── 确保 README 反映最新功能
    │   ├── 添加使用示例和截图/GIF
    │   ├── 更新徽章 (CI/版本/下载量)
    │   └── 检查拼写、语法和格式
    │
    ├── 3️⃣ 发布说明 (Release Notes)
    │   ├── 汇总本轮新增功能和改进
    │   ├── 列出修复的 Bug (感谢贡献者)
    │   ├── 标注 Breaking Changes
    │   └── 发布到 GitHub Releases
    │
    ├── 4️⃣ 社区互动
    │   ├── 回复 Issue 和 Discussion
    │   ├── 感谢代码贡献者
    │   ├── 在相关社区发帖 (HackerNews/Reddit)
    │   └── 更新项目徽章和状态
    │
    └── 5️⃣ 指标追踪
        ├── Stars / Forks / Watchers 变化
        ├── npm/PyPI 下载量统计
        ├── Issue 响应时间和关闭率
        └── CI 通过率和测试覆盖率展示
```

---

## 📄 标准模板

### README 结构模板

```markdown
# {项目名称}

> {一句话简介}

## ✨ 特性
- {特性 1}
- {特性 2}
- {特性 3}

## 🚀 快速开始
\`\`\`bash
npm install -g {package}
# 或
pip install {package}
\`\`\`

## 📖 使用指南
\`\`\`bash
{package} --help
{package} subcommand --option value
\`\`\`

## 🏗️ 架构
{简要说明或链接至架构文档}

## 🤝 贡献
{贡献指南链接}

## 📄 许可
{MIT/Apache-2.0/...}
```

### Release Note 格式
```markdown
## v{版本号} ({日期})

### 🚀 新功能
- {功能名称}: {简述} ({PR #xx})

### 🐛 Bug 修复
- {问题}: {修复描述} ({感谢 @contributor})

### 🛠️ 改进
- {改动}: {原因和效果}

### ⚠️ Breaking Changes
- {变更}: {迁移说明}

### 📦 下载
- npm: `npm install {package}@latest`
- PyPI: `pip install --upgrade {package}`
```

### Changelog 标准
```
## [版本号] - 日期

### Added     — 新功能
### Changed   — 已有功能变更
### Deprecated — 即将废弃的功能
### Removed   — 移除的功能
### Fixed     — Bug 修复
### Security  — 安全修复
```

---

## ✅ 发布检查清单

| # | 检查项 | 完成 |
|---|--------|------|
| 1 | README 已更新到最新功能 | ☐ |
| 2 | CHANGELOG.md 已更新 | ☐ |
| 3 | 版本号已更新 (package.json/setup.py) | ☐ |
| 4 | 所有测试通过 | ☐ |
| 5 | GitHub Releases 已创建 | ☐ |
| 6 | 包已发布到 npm/PyPI | ☐ |
| 7 | GitHub 徽章已更新 | ☐ |

---

## 🚫 常见陷阱

| 陷阱 | 后果 | 避免方法 |
|------|------|---------|
| README 与代码不同步 | 用户困惑、Issue 增加 | 每次功能变更后立即更新 README |
| 发布前忘记测试 | 用户下载后崩溃 | 发布前必须跑一遍完整测试套件 |
| 版本号不规范 | 用户升级出问题 | 严格遵循 SemVer (主版本.次版本.补丁) |
| 忽略社区回复 | 贡献者流失 | 24h 内回复所有 Issue 和 PR |
| 忘记发 release notes | 用户不知道新功能 | 每次发布必须配 Release Note |

---

## 📡 结构化通信规范（借鉴 OpenSpace + CAMEL）

Agent 之间交流使用以下格式，禁止自由聊天：

| 类型 | 格式 | 示例 |
|------|------|------|
| **需求传达** | `[需求] 要什么 → 为什么 → 优先级` | `[需求] 新增--json参数 → 用户需要脚本化输出 → P1` |
| **进度报告** | `[报告] 做了什么 → 结果 → 阻塞项` | `[报告] 完成了battle模块 → 测试通过 → 无阻塞` |
| **代码审查** | `[审查] 文件路径 → 发现问题 → 建议方案` | `[审查] src/cli.py → 参数校验缺失 → 加try/except` |
| **经验分享** | `[经验] 发现什么 → 适用场景 → 验证状态` | `[经验] 分页用Link header更稳 → 所有API调用 → ✅验证` |
| **求助** | `[求助] 问题描述 → 已尝试方案 → 急缓程度` | `[求助] GitHub API限流 → 已加retry → 紧急` |

**好处:** 减少 50-70% 通信 token，信息密度提高 3 倍。
