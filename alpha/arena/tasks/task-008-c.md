# Task 008-C: `ara watch --notify` 桌面通知

**分配:** dev-2
**优先级:** P1
**预计工时:** 30 分钟
**来源:** Decision 008

---

## 背景

双方的 watch 命令都不能在星数变化时主动通知用户。`--notify` 将是我们独有的差异化功能——当星数变化时通过 terminal bell (`\a`) 和增强的视觉标记来提醒用户。

**战略意义:** 目前所有 Star tracking 工具都要持续盯着屏幕。有通知机制后，用户可以后台挂起 watch，变化时自动提醒。

## 功能规格

### 用户视角

```bash
# 带通知
$ ara watch facebook/react --notify

# 变化时触发：
# - 新的星星 → 终端发出 beep 声 + 行尾显示 "✨ NEW!"
# - 变化累积 → 按 Ctrl+C 后显示总变化数
```

### 技术实现

修改 `ara/cli.py` 中的 `cmd_watch` 函数：

1. **解析 `--notify` 参数** — 在 watch_parser 中添加 `--notify` flag
2. **变化检测** — 在每次轮询时，比较当前 stars 与上一轮
3. **通知输出** — 如果有变化：
   - 打印 `\a` (ASCII bell) — 终端会发出 beep 声
   - 在 dashboard 中变化行添加 `✨ NEW!` 标记
   - 在 watch 总结中显示总变化次数

注意：不要在 watch dashboard 本身做剧烈改动。watch dashboard 的格式由 `display.py` 的 `format_watch_dashboard` 和 `format_multi_watch_dashboard` 控制。最简单的方式是在 cmd_watch 函数中检测变化后额外打印一行通知。

```python
def cmd_watch(args, client):
    repos = args.repos
    previous_infos: dict[str, dict] = {}
    notify = getattr(args, "notify", False)
    changed_repos = set()  # track which repos have changed
    total_new_stars = 0

    print(f"{BOLD}{CYAN}ARA Star Tracker v{__version__}{RESET}")
    print(f"Watching {len(repos)} repo(s). Press Ctrl+C to stop.")
    if notify:
        print(f"{BOLD}🔔 Notification mode: you'll hear a beep when stars change.{RESET}")
    print()

    try:
        while True:
            snapshots = []
            for repo in repos:
                info = client.get_repo_info(repo)
                prev = previous_infos.get(repo)
                current_stars = info.get("stars", 0)
                
                if notify and prev is not None:
                    prev_stars = prev.get("stars", 0)
                    if current_stars > prev_stars:
                        delta = current_stars - prev_stars
                        total_new_stars += delta
                        changed_repos.add(repo)
                        # Terminal bell
                        print("\a", end="", flush=True)
                
                snapshots.append((repo, info, prev))
                previous_infos[repo] = info

            if len(repos) == 1:
                repo, info, prev = snapshots[0]
                output = format_watch_dashboard(repo, info, prev)
            else:
                output = format_multi_watch_dashboard(snapshots)

            print(output, end="")
            time.sleep(30)
    except KeyboardInterrupt:
        print(f"\n{BOLD}Watch ended.{RESET}")
        for repo in repos:
            info = previous_infos.get(repo, {})
            count = info.get("stars", 0)
            print(f"  {repo}: ★ {count:,}")
        if notify and total_new_stars > 0:
            print(f"\n  {GREEN}✨ {total_new_stars} new star(s) gained while watching!{RESET}")
```

### 修改 `ara/cli.py`

在 watch_parser 中添加：

```python
    watch_parser.add_argument(
        "--notify", action="store_true",
        help="Beep on star changes"
    )
```

### 测试

在 `tests/test_watch.py` 中添加测试：

1. **`test_watch_notify_flag`** — 验证 `--notify` 被正确解析
2. **`test_watch_notify_output`** — 验证 notify 模式输出包含 "Notification mode" 文字

不需要 mock 整个 watch 循环（它是个无限循环）。测试只需验证 flag 解析和输出消息。

## 关键约束

1. **零新增依赖** — `\a` 是 ASCII 标准
2. **不修改 display.py** — 通知逻辑只在 cmd_watch 函数内
3. **不破坏现有的 watch 输出格式**
4. `--notify` 是可选的，默认不启用

## 注意

- `"\a"` 是 ASCII bell 字符，在大多数终端会发出 beep
- 终端可能静音——所以同时要有视觉标记（"✨ NEW!"）
- 不要在 notify 模式中改变 watch dashboard 本身的渲染逻辑——dashboard 仍然由 `format_watch_dashboard` 控制
- 注意 `args.notify` 只在用户传了 `--notify` 时才为 True
