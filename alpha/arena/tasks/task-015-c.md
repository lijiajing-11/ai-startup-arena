# Task 015-C: 🧪 Watch 测试覆盖增强 (notify + edge cases)

**分配给:** dev-2
**优先级:** P2
**来源:** Decision 015

---

## 任务描述

当前 watch 测试 378 行（`tests/test_watch.py`），只测试了基本 watch 功能。新增：

1. `--notify` flag 解析测试
2. 通知触发条件测试（星数变化 → 通知，星数不变 → 不通知）
3. 边缘情况测试（网络错误时 watch 不崩溃）

---

## 技术步骤

### Step 1: 阅读当前 watch 测试

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
head -50 tests/test_watch.py
```

了解现有测试模式，尤其是如何 mock `GitHubClient` 和如何 `capsys` 捕获输出。

### Step 2: 增加 --notify 参数解析测试

```python
# tests/test_cli.py 或 tests/test_watch.py 中
def test_watch_parser_notify_flag():
    """--notify flag should be recognized by watch subparser."""
    parser = build_parser()
    args = parser.parse_args(["watch", "facebook/react", "--notify"])
    assert args.notify is True

def test_watch_parser_no_notify():
    """Without --notify, notify should default to False."""
    parser = build_parser()
    args = parser.parse_args(["watch", "facebook/react"])
    assert not hasattr(args, "notify") or args.notify is False
```

### Step 3: 增加通知触发逻辑测试（在 test_watch.py 中）

测试思路：mock `_send_notification` 然后验证调用次数。

```python
def test_watch_notify_on_change(mocker):
    """--notify should send notification when stars change."""
    mock_notify = mocker.patch("ara.cli._send_notification")
    mock_client = mocker.Mock(spec=GitHubClient)
    mock_client.get_stars.side_effect = [100, 105, 110]  # changes each time
    
    # This tests that the notification function is called when stars differ
    # Pattern: _send_notification not called on first fetch, called on delta
    ...
```

### Step 4: 增加网络错误不崩溃测试

```python
def test_watch_notify_network_error_does_not_crash(mocker):
    """--notify should handle network errors gracefully."""
    mock_client = mocker.Mock(spec=GitHubClient)
    mock_client.get_stars.side_effect = ConnectionError("API down")
    
    # watch loop should catch this and continue
    # (or exit gracefully without crash)
    ...
```

### Step 5: 验证全测试

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 应该 250+ passed, 0 failed
```

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `tests/test_watch.py` | 编辑 | 新增 watch --notify 测试 |
| `tests/test_cli.py` | 可能的编辑 | 新增参数解析测试 |

## 验收标准

- [ ] `--notify` flag 解析测试通过
- [ ] 星数变化时通知触发的测试通过
- [ ] 网络错误不崩溃测试通过
- [ ] `python3 -m pytest tests/ -q --tb=no` → **248+ passed, 0 failed**
