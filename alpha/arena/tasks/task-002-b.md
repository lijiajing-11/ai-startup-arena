# Task 002-B: compare 命令表格升级 + JSON 模式 + watch 数据扩展

**分配给:** dev-2  
**优先级:** P1  
**关联决策:** Decision 002 — Project Crystal Dashboard  

---

## 目标
1. 将 `ara compare` 命令的输出升级为表格格式（目前是文本左对齐）
2. 为 `ara compare` 添加 `--json` 输出模式
3. 为 watch 数据流增加 forks / issues / language 等字段的抓取支持

## 涉及文件
- `ara/cli.py` — 修改 `cmd_compare()`，新增 `cmd_compare_json()`
- `ara/display.py` — 重构 `format_compare()` 为表格格式
- `ara/core.py` — 增加 `get_multiple_repos_info()` 批量获取方法
- `tests/test_cli.py` — 添加测试
- `tests/test_display.py` 或 `tests/test_battle.py` — 补对比表格测试

## 技术要求

### 1. 对比表格 — 表格格式
`ara compare owner/a owner/b` 输出格式：

```
╔══════════════════════════════════════════════════════════╗
║             ⚖️  REPO COMPARISON                          ║
╚══════════════════════════════════════════════════════════╝

┌─────────────┬──────────────────┬──────────────────┬────────┐
│ Metric      │ owner/a          │ owner/b          │ Victor │
├─────────────┼──────────────────┼──────────────────┼────────┤
│ ⭐ Stars    │ 12,345           │ 567              │ 🏆 a  │
│ ⑂ Forks     │ 234              │ 12               │ 🏆 a  │
│ ⚠ Issues    │ 12               │ 3                │ 🏆 b  │
│ 🔤 Language │ Python           │ Rust             │ —      │
│ 📜 License  │ MIT              │ Apache-2.0       │ —      │
│ 📅 Created  │ 2020-01-15       │ 2023-06-01       │ —      │
│ 🕐 Updated  │ 2026-05-19       │ 2026-05-18       │ —      │
└─────────────┴──────────────────┴──────────────────┴────────┘

🏆 owner/a WINS!
   Leads by 11,778 stars over owner/b
   Also leads in forks: 222 more
```

设计要求：
- 与现在 `compare` 保持一样的功能（高亮胜者、less issues = better）
- 列宽自适应 repo name 长度，最小 18 字符
- 用 `display.py` 中已有的 `_compare_cell()` 逻辑的着色
- Victor 列：显示 🏆 + 胜出的 repo 简称（或 "Tie"）

### 2. `--json` 模式
新增 `ara compare --json owner/a owner/b` 输出：

```json
{
  "command": "compare",
  "repos": [
    { "full_name": "owner/a", "stars": 12345, "forks": 234, "open_issues": 12, "language": "Python", "license": "MIT", "created_at": "2020-01-15T00:00:00Z", "updated_at": "2026-05-19T12:00:00Z" },
    { "full_name": "owner/b", "stars": 567, "forks": 12, "open_issues": 3, "language": "Rust", "license": "Apache-2.0", "created_at": "2023-06-01T00:00:00Z", "updated_at": "2026-05-18T10:00:00Z" }
  ],
  "winner": "owner/a",
  "lead_by": 11778,
  "fork_leader": "owner/a",
  "issue_leader": "owner/b",
  "errors": null
}
```

### 3. `get_multiple_repos_info()` 
在 `ara/core.py` 中新增批量方法：

```python
def get_multiple_repos_info(self, repos: list[str]) -> list[dict]:
    """Batch-fetch info for multiple repos.
    
    对短列表（≤10）并发或串行获取。先检查缓存。
    返回每个 repo 的 info dict 列表，保持输入顺序。
    单个 repo 失败时，对应的 dict 包含 {"error": "..."}。
    """
```

技术细节：
- 当前 `get_repo_info()` 已是逐个 fetch
- 批量方法 = 封装循环 + 错误收集
- 考虑未来扩展到 `asyncio` 并发（本次不做，只做同步）

## 实现步骤

### Step 1: 新增 `get_multiple_repos_info()`
在 `ara/core.py` 的 `GitHubClient` 类中新增。

### Step 2: 新增 `format_compare_table()`
在 `ara/display.py` 中新增，替代/同存于现有的 `format_compare()`。

函数签名：
```python
def format_compare_table(repo1: dict, repo2: dict) -> str:
    """Format a side-by-side comparison using table layout.
    
    Uses box-drawing characters and ANSI colors only.
    Returns a complete formatted string with borders, winner declaration.
    """
```

### Step 3: 添加 `cmd_compare_json()`
在 `ara/cli.py` 中新增：
- 调用 `get_multiple_repos_info()` 获取数据
- 调用 `_resolve_winner()` 确定胜者
- 输出格式化的 JSON（含 `lead_by`, `fork_leader`, `issue_leader` 等额外信息）

同时在 `build_parser()` 中为 `compare` 子命令添加 `--json` 标志。
在 `main()` 的 `json_handlers` 字典中添加 `"compare": cmd_compare_json`。

### Step 4: 更新 `cmd_compare()` 使用新表格
更新 `cmd_compare` 调用 `format_compare_table()` 替代 `format_compare()`。

### Step 5: 测试
- 新加 `tests/test_cli.py` 中 `test_parser_compare_json_flag()`、`test_cmd_compare_json_output()`
- 新加 `test_compare_table_format()` 验证表格边框和字段

## 接受标准
- [ ] `ara compare owner/a owner/b` 输出带边框的表格
- [ ] 胜出 repo 带 🏆 标记
- [ ] Metric 列包含 Stars, Forks, Issues, Language, License, Created, Updated
- [ ] `ara compare --json owner/a owner/b` 输出合法 JSON
- [ ] JSON 输出包含 winner, lead_by, fork_leader, issue_leader
- [ ] 错误处理：单个 repo 失败不中断整体输出
- [ ] 零新增 pip 依赖
- [ ] 现有测试全部通过

## 参考
- `_resolve_winner()` 已在 `cli.py` 中（用于 battle JSON）
- `get_repo_info()` 返回字段完整
- Beta 的 `battle.ts` 输出表格可作为灵感（但我们做 compare 命令的表格）
