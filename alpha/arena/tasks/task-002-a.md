# Task 002-A: watch 命令表格仪表盘

**分配给:** dev-1  
**优先级:** P0  
**关联决策:** Decision 002 — Project Crystal Dashboard  

---

## 目标
将 `ara watch <repo>` 的输出从纯文本格式升级为带边框的表格仪表盘，显示多维数据并实时刷新。

## 涉及文件
- `ara/cli.py` — 修改 `cmd_watch()` 函数
- `ara/display.py` — 新增 `format_watch_dashboard()` 和 `format_multi_watch_dashboard()`
- `ara/core.py` — 可能需扩展 `get_stars()` 返回更多字段
- `tests/test_cli.py` — 添加测试

## 技术要求

### 1. 单仓库 watch 表格仪表盘
`ara watch owner/repo` 输出格式（每 30s 刷新）：

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

### 2. 多仓库 watch 紧凑表格
`ara watch owner/a owner/b` 输出格式：

```
╔══════════════════════════════════════════════════════════════════╗
║        📡 ARA Multi-Watch                                       ║
╚══════════════════════════════════════════════════════════════════╝

┌──────────┬──────────┬───────┬────────┬────────┬────────┐
│ Repo     │ ⭐ Stars │ ⑂ Forks│ ⚠ Issues│ 🔤 Lang│ 📜 Lic │
├──────────┼──────────┼───────┼────────┼────────┼────────┤
│ owner/a  │ 12,345 +5│ 234   │ 12 -2  │ Python │ MIT    │
│ owner/b  │ 567      │ 12    │ 3      │ Rust   │ Apache │
└──────────┴──────────┴───────┴────────┴────────┴────────┘

Watching 2 repos  ·  14:30:52  ·  Ctrl+C to stop
```

### 3. Delta 着色
- `+` (增长) → 绿色 (GREEN)
- `-` (减少) → 红色 (RED)
- `0` 或无变化 → 不显示颜色

### 4. 零新增依赖
全部用 Python 原生字符串格式化。已有的 `colors.py` 常量（GREEN, RED, YELLOW, CYAN, BOLD, RESET）直接复用。

## 实现步骤

### Step 1: 修改 `cmd_watch()` 调用 `get_repo_info()`
当前 `cmd_watch` 只调 `get_stars()` → 需要改为调用 `get_repo_info()` 获取多维数据。

修改 `ara/cli.py` 中的 `cmd_watch()`:
- 每次 tick 调用 `client.get_repo_info(repo)` 替代 `client.get_stars(repo)`
- 收集 prev 数据用于 delta 计算

### Step 2: 新增 `format_watch_dashboard()`
在 `ara/display.py` 中新增函数：

```python
def format_watch_dashboard(
    repo_name: str,
    info: dict,
    previous_info: dict | None = None,
    timestamp: str = "",
) -> str:
    """Format a single-repo watch dashboard with table layout.
    
    Uses box-drawing characters (┌─┬─┐ etc.) and ANSI colors.
    Zero external dependencies.
    """
```

参数:
- `info`: `get_repo_info()` 返回的完整 dict
- `previous_info`: 上次轮询的 info（用于 delta 计算）
- `timestamp`: 当前时间字符串

### Step 3: 新增 `format_multi_watch_dashboard()`
类似但更紧凑，适用于 N 个仓库。

### Step 4: 更新 `cmd_watch()` 调用
```python
def cmd_watch(args, client):
    repos = args.repos
    previous_infos = {}
    while True:
        snapshots = []
        for repo in repos:
            info = client.get_repo_info(repo)
            prev = previous_infos.get(repo)
            snapshots.append((repo, info, prev))
            previous_infos[repo] = info
        
        if len(repos) == 1:
            output = format_watch_dashboard(repos[0], info, prev, timestamp)
        else:
            output = format_multi_watch_dashboard(snapshots, timestamp)
        
        print(output, end="")
        time.sleep(30)
```

### Step 5: 测试
在 `tests/test_cli.py` 中新增测试：
- `test_cmd_watch_uses_repo_info()` — 验证改用 get_repo_info
- 模拟 `get_repo_info` 返回完整数据
- 验证表格边框、delta 着色标记在输出中

## 接受标准
- [ ] `ara watch owner/repo` 输出完整表格仪表盘
- [ ] `ara watch owner/a owner/b` 输出紧凑多仓库表格
- [ ] Delta 值正确着色（绿+/红-）
- [ ] 每 30s 自动刷新
- [ ] Ctrl+C 优雅退出并打印摘要
- [ ] 零新增 pip 依赖
- [ ] 现有 `test_cli.py` 全部通过
- [ ] 新写测试验证表格包含了必要字段

## 参考
- Beta 的 `watch.ts` 用 `cli-table3`（我们有类似效果但零依赖）
- 项目中已有 `colors.py` 的 ANSI 常量
- `get_repo_info()` 已返回所有需要的字段
- `render_box()` 在 `battle.py` 中已有 box-drawing 实现可参考
