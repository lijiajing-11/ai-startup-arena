# Task 015-A: 🚀 实现 `ara watch --notify` 桌面通知

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 015

---

## 任务描述

`ara watch` 当前每 30 秒轮询并刷新终端显示，但用户不盯着终端时就错过了变化。增加 `--notify` 选项：当仓库星数发生变化时，发送桌面通知。

**目标行为：**
- `ara watch facebook/react --notify` → 星数变化时弹出桌面通知
- `ara watch facebook/react` (无 flag) → 行为不变，不通知
- 通知内容：`facebook/react: ★ 0 → +5 (245,114 → 245,119)`

---

## 技术步骤

### Step 1: 阅读当前 watch 实现

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
grep -n "def run_watch\|def cmd_watch\|def _cmd_watch\|watch_refresh\|def _watch" ara/cli.py
```

当前 watch 已经在 `cli.py` 中实现，有 `cmd_watch` 函数。通知逻辑需要在 watch 循环的低位注入。

### Step 2: 添加 --notify argparse 参数

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
grep -n "watch_parser\|watch.*parser\|add_parser.*watch" ara/cli.py
```

在 `watch_parser` 中增加：
```python
watch_parser.add_argument(
    "--notify", action="store_true",
    help="Send desktop notification when star count changes",
)
```

### Step 3: 在 watch 循环中注入通知逻辑

watch 的刷新函数在 `_watch_refresh_prefix` 或类似函数中。在检测到 star count 变化时（delta != 0 或 stars != previous），发送通知。

**使用 `plyer` 库**（跨平台桌面通知）：
```bash
pip install plyer
```

```python
from plyer import notification

def _send_notification(repo: str, delta: int, old_stars: int, new_stars: int):
    """Send a desktop notification about star count change."""
    try:
        direction = "⬆️" if delta > 0 else "⬇️"
        notification.notify(
            title=f"{repo} {direction}",
            message=f"{delta:+d} stars ({old_stars:,} → {new_stars:,})",
            timeout=5,
        )
    except Exception:
        pass  # Silently fail — notifications are best-effort
```

**整合到 watch 逻辑**——找到 `cmd_watch` 函数中每次轮询后比较 prev/current stars 的地方，判断如果 `--notify` flag 为 True 且 stars 变化则调用 `_send_notification`。

当前 watch 刷新在 `_watch_refresh_prefix` 中。通知应该在 `run_watch` 返回新 star count 后，与之前值比较时触发。

直接找一个触发器——在 `cmd_watch` 的 while 循环中，fetch 完新数据后：

```python
# Pseudo-code — adapt to actual implementation
while True:
    prev_stars = stars_cache.get(repo)
    current_stars = run_watch(repo, client)
    
    if args.notify and prev_stars is not None and current_stars != prev_stars:
        _send_notification(repo, current_stars - prev_stars, prev_stars, current_stars)
    
    stars_cache[repo] = current_stars
    time.sleep(30)
```

具体位置根据实际的 `cmd_watch` 实现调整。看 `run_watch` 签名是 `(repo, client, previous)`，可以在调用前比较。

### Step 4: 安装 plyer

```bash
pip install plyer
```

确认 setup.py 中的 install_requires 包含 plyer：
```python
# 在 setup.py 中追加
install_requires=[
    "plyer>=2.1",
],
```

### Step 5: 更新版本号

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
# 在 ara/__init__.py 中
grep -n "__version__" ara/__init__.py
```

版本号可以是 `0.3.1`（小版本迭代通知功能）或保持 `0.3.0` 等决策后再定。

### Step 6: 验证

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 应该 248+ passed, 0 failed
```

---

### 💡 Fallback 方案 (WSL 兼容)

如果 `plyer` 在 WSL 中无法显示通知（常见问题），提供以下 fallback：

**备选 1: ANSI 终端 beep**
```python
print("\a", end="", flush=True)  # Terminal bell
```

**备选 2: `notify-send` via WSL interop**
```python
import subprocess
subprocess.run(["powershell.exe", "-Command", 
    f'New-BurntToastNotification -Text "{repo}: {delta:+d} stars"'],
    capture_output=True)
```

**备选 3: `--notify` 只做 print 标注**
```python
print(f"  🔔 {repo}: {old_stars:,} → {new_stars:,} ({delta:+d})")
```

**推荐方案:** 先用 `plyer` native Python 方式，如果 WSL 不兼容则 fallback 到 ANSI + log 输出。plyer 内部会尝试 dbus/notify-send/winrt，跨平台兼容性好。

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/cli.py` | 编辑 | 添加 `--notify` 参数 + 通知逻辑 |
| `setup.py` | 编辑 | 添加 `plyer` 到 `install_requires` |
| `ara/__init__.py` | 可能的编辑 | 版本号更新 |

## 验收标准

- [ ] `ara watch facebook/react --notify` → 星数变化时触发通知（或 fallback 输出）
- [ ] `ara watch facebook/react` (无 flag) → 行为不变
- [ ] `python3 -m pytest tests/ -q --tb=no` → **248+ passed, 0 failed**
- [ ] `pip install ara` 理论上可用（setup.py 已包含 plyer）
