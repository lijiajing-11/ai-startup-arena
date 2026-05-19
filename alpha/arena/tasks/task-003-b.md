# Task 003-B: Fix test_info.py — cmd_compare_json mock + assertion (dev-2)

**分配给:** dev-2
**优先级:** P0
**关联决策:** Decision 003 — Test Suite Cleanup & CI Pipeline Hardening

---

## 目标
修复 `tests/test_info.py` 中 `test_cmd_compare_json_output` 测试失败。

## 根因分析
Decision 002 Task 002-B 重构了 `cmd_compare_json()`: 
- 原实现：逐个调用 `client.get_repo_info(repo)`
- 新实现：调用 `client.get_multiple_repos_info(repos)` 批量获取

但测试 `test_cmd_compare_json_output` 仍然 mock 的是 `get_repo_info`，导致 `get_multiple_repos_info` 返回 `MagicMock` 对象，JSON dumps 时报 `TypeError: Object of type MagicMock is not JSON serializable`。

## 涉及文件
- `tests/test_info.py` — 修改第 227-244 行（`test_cmd_compare_json_output` 函数）

## 当前代码
```python
def test_cmd_compare_json_output(capsys):
    """cmd_compare_json should print valid JSON with compare data."""
    from ara.cli import cmd_compare_json

    mock_client = MagicMock()
    mock_client.get_repo_info.return_value = {
        "full_name": "owner/repo-a",
        "stars": 1000,
        "forks": 200,
        "open_issues": 5,
        "language": "Python",
        "topics": [],
        "license": "MIT",
        "html_url": "",
        "description": "",
        "created_at": "2020-01-15T00:00:00Z",
        "updated_at": "2026-05-19T12:00:00Z",
        "pushed_at": "",
        "name": "repo-a",
    }

    args = argparse.Namespace(repos=["owner/repo-a", "owner/repo-b"])
    cmd_compare_json(args, mock_client)

    captured = capsys.readouterr()
    import json
    data = json.loads(captured.out)
    assert data["command"] == "compare"
    assert "repos" in data
    assert "errors" in data
```

## 修改方案

修改为 mock `get_multiple_repos_info`，并增强断言验证 JSON 结构：

```python
def test_cmd_compare_json_output(capsys):
    """cmd_compare_json should print valid JSON with compare data."""
    from ara.cli import cmd_compare_json

    mock_client = MagicMock()
    mock_client.get_multiple_repos_info.return_value = [
        {
            "name": "repo-a",
            "full_name": "owner/repo-a",
            "stars": 1000,
            "forks": 200,
            "open_issues": 5,
            "language": "Python",
            "topics": [],
            "license": "MIT",
            "html_url": "",
            "description": "",
            "created_at": "2020-01-15T00:00:00Z",
            "updated_at": "2026-05-19T12:00:00Z",
            "pushed_at": "",
        },
        {
            "name": "repo-b",
            "full_name": "owner/repo-b",
            "stars": 500,
            "forks": 50,
            "open_issues": 10,
            "language": "Rust",
            "topics": [],
            "license": "Apache-2.0",
            "html_url": "",
            "description": "",
            "created_at": "2023-06-01T00:00:00Z",
            "updated_at": "2026-05-18T10:00:00Z",
            "pushed_at": "",
        },
    ]

    args = argparse.Namespace(repos=["owner/repo-a", "owner/repo-b"])
    cmd_compare_json(args, mock_client)

    captured = capsys.readouterr()
    import json
    data = json.loads(captured.out)

    # Core structure assertions
    assert data["command"] == "compare"
    assert len(data["repos"]) == 2
    assert data["repos"][0]["full_name"] == "owner/repo-a"
    assert data["repos"][1]["full_name"] == "owner/repo-b"

    # Winner/leader assertions
    assert data["winner"] == "owner/repo-a"
    assert data["lead_by"] == 500
    assert data["fork_leader"] == "owner/repo-a"
    assert data["issue_leader"] == "owner/repo-b"

    # Error handling
    assert data["errors"] is None
```

## 关键要点
- 必须 mock `get_multiple_repos_info`，而不是 `get_repo_info`
- 返回的数据必须是 **list of dicts**（batch 格式），不是单个 dict
- 返回值字段必须与 `get_repo_info()` 输出一致
- JSON 断言新增 winner/lead_by/fork_leader/issue_leader 验证

## 验证

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/test_info.py::test_cmd_compare_json_output -v
```

测试必须 PASS. 同时验证没有回归：

```bash
python3 -m pytest tests/test_info.py -v
# 全部 PASS（其他 13 个 tests 不受影响）
```

## 依赖关系
- dev-1 先修好 format_compare_table 的 import 问题（否则你的测试单独跑也有 import error）
- 建议等 dev-1 的 MR 合并后再改动此项，或先改本文件再等 dev-1

## 额外建议
如果 dev-1 还没完成，你可以先在本函数顶部写 `from ara.display import format_compare_table`（虽然 test 里没用这个 import，但确保整体文件可执行），不过更好的做法是等 dev-1 完成后再提交你的改动。
