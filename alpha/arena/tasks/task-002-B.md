# Task 002-B: 🔴 P0 — subscribe 命令 — JSON 存储 + 基础管理

**周期:** 2
**负责人:** dev-1
**优先级:** P0 — 三大命令之一，地基性质
**估计提交:** 2 commits (~80 总新增行)
**依赖:** 无（纯文件 IO + argparse）

---

## 背景

`subscribe` 是三大核心命令之一，目前是 placeholder（`print("Subscribe — coming soon!")`）。需要实现：

1. 持久化存储：JSON 文件记录订阅的主题和推送渠道
2. CLI 操作：添加、删除、列出订阅
3. 校验：同一主题不重复订阅

后续推送（Email/Telegram）直接读 subscriptions.json 即可。

## 设计

### storage.py — 通用 JSON DB

```python
# ~/.cache/paper-digest/subscriptions.json 结构:
{
    "subscriptions": [
        {"topic": "LLM", "channels": ["email"], "created": "2026-06-09T08:00:00"},
        {"topic": "RAG", "channels": ["telegram"], "created": "2026-06-09T08:01:00"},
    ]
}
```

API：
- `Subscriptions` 类或模块级函数
- `add(topic, channels)` → 已存在则追加 channel（不重复）
- `remove(topic)` → 删除指定主题
- `list_all()` → 返回全部订阅
- 文件锁？不需要——单用户 CLI 场景。后续可加 `filelock` 但非必须。

### CLI 接口

```bash
# 添加订阅
paper-digest subscribe --topic "LLM" --channel email
paper-digest subscribe --topic "RAG" --channel telegram

# 列出所有订阅
paper-digest subscribe --list

# 删除订阅
paper-digest subscribe --remove LLM
```

**参数设计：** 用 `--list` 和 `--remove` 作为 actions，`--topic` + `--channel` 为数据。合理。

### 文件结构

```
paper_digest/
├── storage.py       # JSON 存储基类（通用，未来可复用）
└── subscribe.py     # subscribe 业务逻辑（可选，或放 cli.py）
```

#### 方案 A（推荐）：轻量 inline

`storage.py` 单独（60 行），CLI handler 在 cli.py 中（30 行）。不建 subscribe.py——当前阶段功能太简单不值得独立模块。

#### 方案 B：独立 subscribe.py

适合后续复杂化（推送历史、订阅配置）。目前选方案 A。

---

## 任务拆分

### Step 1: `storage.py` — JSON 持久化

**文件:** `paper_digest/storage.py`

```python
"""JSON file-based storage for subscriptions."""
import json
from pathlib import Path
from typing import Any

STORAGE_DIR = Path.home() / ".cache" / "paper-digest"
SUB_FILE = STORAGE_DIR / "subscriptions.json"

def _load() -> list[dict]:
    if not SUB_FILE.exists():
        return []
    try:
        with open(SUB_FILE) as f:
            return json.load(f).get("subscriptions", [])
    except (json.JSONDecodeError, OSError):
        return []

def _save(subs: list[dict]) -> None:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = SUB_FILE.with_suffix(".tmp")
    with open(tmp, "w") as f:
        json.dump({"subscriptions": subs}, f, indent=2)
    tmp.rename(SUB_FILE)

def add_subscription(topic: str, channels: list[str]) -> bool:
    """Add a subscription. Returns True if new, False if already exists."""
    subs = _load()
    for s in subs:
        if s["topic"] == topic:
            for ch in channels:
                if ch not in s["channels"]:
                    s["channels"].append(ch)
            _save(subs)
            return False
    subs.append({
        "topic": topic, "channels": channels,
        "created": datetime.now().isoformat(),
    })
    _save(subs)
    return True

def remove_subscription(topic: str) -> bool:
    subs = _load()
    filtered = [s for s in subs if s["topic"] != topic]
    if len(filtered) == len(subs):
        return False
    _save(filtered)
    return True

def list_subscriptions() -> list[dict]:
    return _load()
```

**新增行估算:** ~55 行
**BLOAT 检查:** ✅ < 80 行

### Step 2: CLI handler 升级

**文件:** `paper_digest/cli.py`

```
subscribe parser 改为：
- subscribe [-h] [--topic T] [--channel C] [--list] [--remove R]
```

_cmd_subscribe 逻辑：
1. `--list` → 打印所有订阅（rich Table，含 topics + channels + 时间）
2. `--remove R` → 删除指定主题
3. `--topic T --channel C` → 添加订阅

**新增行估算:** ~30 行 + argparse 升级 ~15 行 = ~45 行

### Step 3: 测试

**文件:** `tests/test_storage.py` 新建（20 行）+ `tests/test_cli.py` 追加（30 行）

| 测试 | 说明 |
|:----|:-----|
| test_add_subscription | 添加后列表包含 |
| test_add_duplicate_topic | 同一主题不重复（仅追加 channel） |
| test_remove_subscription | 删除后列表不含 |
| test_remove_nonexistent | 删除不存在的返回 False |
| test_list_subscriptions | 列表返回正确 |
| test_main_subscribe_add | CLI 调用添加成功 |
| test_main_subscribe_list | CLI 调用列表显示 |

**新增行估算:** ~50 行

---

## 验收标准

- [x] `paper-digest subscribe --topic "LLM" --channel email` 成功添加
- [x] `paper-digest subscribe --list` 显示所有订阅
- [x] `paper-digest subscribe --remove LLM` 删除成功
- [x] 重复添加同一主题不报错，仅更新 channel
- [x] JSON 文件写入使用原子写入（tmp + rename）
- [x] 所有测试绿色（新增 ≥ 7 个）

---

## 风险

- JSON 文件写入在 WSL 下路径：`~/.cache/paper-digest/` 在 WSL 和 Windows 家目录不同，不影响——CLI 默认 Linux 路径
- 暂不加文件锁——单用户场景够用，后续 `filelock` 可选
- 时间戳格式统一用 ISO 8601
