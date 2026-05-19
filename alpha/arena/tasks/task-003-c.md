# Task 003-C: Update README with watch dashboard + compare table examples (mkt)

**分配给:** mkt
**优先级:** P1
**关联决策:** Decision 003 — Test Suite Cleanup & CI Pipeline Hardening

---

## 目标
更新 `alpha/repo/README.md`，添加 watch dashboard 和 compare table 的新功能示例，突出 ARA 的视觉升级。

## 背景
Decision 002 (Project Crystal Dashboard) 完成了：
- `ara watch <repo>` → box-drawing 仪表盘（stars, forks, issues, language, license, delta 着色）
- `ara watch repo1 repo2` → 紧凑多仓库表格
- `ara compare repo1 repo2` → 带 Victor 列的对比表格
- `ara compare --json repo1 repo2` → JSON 输出（含 winner, lead_by, fork_leader, issue_leader）

当前 README 只覆盖了基本用法（stars, battle），没有展示这些新功能。

## 涉及文件
- `alpha/repo/README.md`

## 具体要求

### 1. 在 README 中新增 "### Watch Mode" 小节
位置：在现有 "### Star Check" 之后，"### Battle Mode" 之前或之后。

内容需要包括：

**单仓库 watch：**
```bash
ara watch owner/repo
```

然后在代码块中**模拟**输出（用文本模拟 box-drawing 表格）：

```
╔════════════════════════════════════════════╗
║        📡 ARA Star Tracker — WATCH         ║
╚════════════════════════════════════════════╝

┌────────────────────┬────────────────────────┐
│ Repository         │ owner/repo              │
├────────────────────┼────────────────────────┤
│ ⭐ Stars           │ 12,345  (+5)            │
│ ⑂ Forks            │ 234     (+1)            │
│ ⚠ Issues           │ 12     (-2)             │
│ 🔤 Language        │ Python                  │
│ 📜 License         │ MIT                     │
│ 🕐 Updated         │ 2026-05-19 14:30:22     │
│ 📅 Created         │ 2020-01-15              │
└────────────────────┴────────────────────────┘

Last updated: 14:30:52  |  Press Ctrl+C to stop
```

**多仓库 watch：**
```bash
ara watch owner/repo-a owner/repo-b
```

输出示例：
```
╔══════════════════════════════════════════════════════════════════╗
║        📡 ARA Multi-Watch                                       ║
╚══════════════════════════════════════════════════════════════════╝

┌──────────┬──────────┬───────┬────────┬────────┬────────┐
│ Repo     │ ⭐ Stars │ ⑂ Forks│ ⚠ Issues│ 🔤 Lang│ 📜 Lic │
├──────────┼──────────┼───────┼────────┼────────┼────────┤
│ owner/a  │ 12,345   │ 234   │ 12     │ Python │ MIT    │
│ owner/b  │ 567      │ 12    │ 3      │ Rust   │ Apache │
└──────────┴──────────┴───────┴────────┴────────┴────────┘

Watching 2 repos  ·  14:30:52  ·  Ctrl+C to stop
```

### 2. 新增 "### Compare Mode" 小节

**表格输出：**
```bash
ara compare owner/repo-a owner/repo-b
```

输出示例（模拟，不要 ANSI 颜色码，纯文本）：
```
╔══════════════════════════════════════════════════════════╗
║             ⚖️  REPO COMPARISON                          ║
╚══════════════════════════════════════════════════════════╝

┌─────────────┬──────────────────┬──────────────────┬────────┐
│ Metric      │ owner/repo-a     │ owner/repo-b     │ Victor │
├─────────────┼──────────────────┼──────────────────┼────────┤
│ ⭐ Stars    │ 12,345           │ 567              │ 🏆 a  │
│ ⑂ Forks     │ 234              │ 12               │ 🏆 a  │
│ ⚠ Issues    │ 12               │ 3                │ 🏆 b  │
│ 🔤 Language │ Python           │ Rust             │ —      │
│ 📜 License  │ MIT              │ Apache-2.0       │ —      │
│ 📅 Created  │ 2020-01-15       │ 2023-06-01       │ —      │
│ 🕐 Updated  │ 2026-05-19       │ 2026-05-18       │ —      │
└─────────────┴──────────────────┴──────────────────┴────────┘

🏆 owner/repo-a WINS!
   Leads by 11,778 stars over repo-b
   Also leads in forks: 222 more
```

**JSON 输出：**
```bash
ara compare --json owner/repo-a owner/repo-b
```

输出：
```json
{
  "command": "compare",
  "repos": [
    { "full_name": "owner/repo-a", "stars": 12345, "forks": 234, "open_issues": 12, ... },
    { "full_name": "owner/repo-b", "stars": 567, "forks": 12, "open_issues": 3, ... }
  ],
  "winner": "owner/repo-a",
  "lead_by": 11778,
  "fork_leader": "owner/repo-a",
  "issue_leader": "owner/repo-b",
  "errors": null
}
```

### 3. 新增 "### JSON Output" 特说明
简要说明所有命令都支持 `--json` 标志：
- `ara stars --json owner/repo`
- `ara watch --json owner/repo`
- `ara battle --json owner/a owner/b`
- `ara compare --json owner/a owner/b`
- `ara info --json owner/repo`

### 4. 不修改
- 不要去掉已有的 battle ASCII 图表展示（那是我们的特色）
- 不要修改项目介绍和安装部分
- 保持现有 README 的排版风格

## 验证
```bash
# 确保 README 格式正确（GitHub 渲染无异常）
cat alpha/repo/README.md | head -5
# 确保没有语法错误
python3 -c "open('README.md').read()"  # 至少能正常读取
```

## 优先级说明
P1 — 可以在 dev-1 / dev-2 测试修复完成后提交，也可以并行做。
测试修复的 PR 合并后补截图占位符（截图需要运行环境 + GitHub Token）。

## 注意
- README 中的 ASCII art 表格对齐要精确，用 tab 补全
- 代码块用 ```bash 和 ```json 以及 ``` 来区分
- 没有截图就不强行贴图，用文本模拟输出即可
