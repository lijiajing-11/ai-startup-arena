# Task 002-A: 🔴 P0 — Summarizer 接入 digest 管道 + `read` 命令完整实现

**周期:** 2
**负责人:** dev-1 (核心实现) / dev-2 (测试)
**优先级:** P0 — 核心链路断裂，影响评分
**估计提交:** 3 commits (~150 总新增行)
**依赖:** summarizer.py, arxiv_client.py, formatter.py (均已完成)

---

## 背景

Cycle 1 建了 summarizer 模块（`generate_summary()`），formatter 也有 `_summary` 渲染分支，但 **digest 管道从未调用 summarizer**。这是一个"已交付但不生效"的质量缺口。

同时 `read` 命令仍为 placeholder，是三大命令之一。

## 任务拆分

### Step 1: CLI 接入 summarizer — `_cmd_digest` 管道升级

**文件:** `paper_digest/cli.py`

在 `_cmd_digest()` 中，fetch + sort 之后，对每篇论文调用 `generate_summary()`：

```python
from paper_digest.summarizer import generate_summary

for paper in papers:
    paper["_summary"] = generate_summary(paper)
```

位置：`papers = sort_by_relevance(...)` 之后、`print_digest(...)` 之前。

**新增行估算:** ~8 行
**BLOAT 检查:** ✅ 远 < 80

### Step 2: `fetch_by_id()` — 按 arXiv ID 查单篇

**文件:** `paper_digest/arxiv_client.py`

新函数，使用 arXiv API 的 `id_list` 参数：

```python
def fetch_by_id(arxiv_id: str) -> dict | None:
    """Fetch a single paper by arXiv ID."""
    cache_path = CACHE_DIR / f"paper_{arxiv_id}.json"
    cached = _load_cache(cache_path)
    if cached is not None:
        return cached

    url = f"{ARXIV_BASE}?id_list={arxiv_id}"
    for attempt in range(3):
        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            papers = _parse_papers(resp.text)
            if not papers:
                return None
            _save_cache(cache_path, papers[0])
            return papers[0]
        except (requests.RequestException, OSError):
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)
    return None
```

缓存 TTL 可以更短（15min，因为单篇查不需要缓存太久），或复用 1h TTL。

**新增行估算:** ~40 行
**BLOAT 检查:** ✅ < 80 行

### Step 3: `_cmd_read` — 完整实现 + rich 详情面板

**文件:** `paper_digest/cli.py` + `paper_digest/formatter.py`

`cli.py` 的 `_cmd_read`：
```python
def _cmd_read(args):
    paper = fetch_by_id(args.arxiv_id)
    if not paper:
        print(f"  Paper {args.arxiv_id} not found.")
        return 1
    paper["_summary"] = generate_summary(paper)
    print_single_paper(paper)
    return 0
```

`formatter.py` 新函数 `print_single_paper()` — rich Panel 展示全信息：
- 标题（bold white）
- 作者、日期、arXiv ID、分类
- 🔥 相关性评分（用 topic 为论文标题或摘要关键词做一次 TF-IDF 排序）
- 摘要全文（不截断）
- 结构化摘要面板：
  - 关键词（chip style）
  - 贡献类型
  - 新颖度评分（进度条或彩色数字）
  - 方法论
  - 可读性
  - 关键发现（bullet points）

**新增行估算:** ~60 行
**BLOAT 检查:** 如超 80，拆为 `read 命令逻辑` + `print_single_paper` 两个 commit

### Step 4: 测试

**文件:** `tests/test_cli.py`, `tests/test_arxiv_client.py`, `tests/test_formatter.py`

| 测试 | 文件 | 说明 |
|:----|:-----|:-----|
| `test_fetch_by_id_basic` | test_arxiv_client.py | mock API 响应，验证返回 paper dict |
| `test_fetch_by_id_not_found` | test_arxiv_client.py | 空结果返回 None |
| `test_fetch_by_id_cache_hit` | test_arxiv_client.py | 缓存命中不调 API |
| `test_main_read_basic` | test_cli.py | mock fetch 返回 paper，验证 CLI 正常退出 |
| `test_main_read_not_found` | test_cli.py | 未找到打印提示 |
| `test_main_digest_summary_integration` | test_cli.py | 验证 digest 调用后 paper 含 `_summary` |
| `test_print_single_paper_no_crash` | test_formatter.py | 不崩溃 |

**新增行估算:** ~60 行

---

## 验收标准

- [x] `paper-digest digest --topic "LLM" --top 5` 输出含关键词/贡献类型/新颖度
- [x] `paper-digest read 2401.12345` 输出单篇详情面板（标题/作者/摘要全文/结构化摘要）
- [x] `fetch_by_id("2401.12345")` 返回单篇 paper dict（含缓存）
- [x] `fetch_by_id("nonexistent")` 返回 None
- [x] 所有测试绿色（新增 ≥ 7 个）

---

## 风险

- arXiv API 的 `id_list` 参数只接受纯 ID（`2401.12345`）而非 URL，需确认 parser 正确处理
- 单篇查的 cache TTL 可缩短至 15min 避免陈旧
- `print_single_paper` 展示不能太冗长——控制在终端一屏以内
