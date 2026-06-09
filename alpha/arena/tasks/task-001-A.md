# Task 001-A: arXiv 抓取 + 本地缓存模块

**来源:** decision-001.md
**优先级:** P0 🔴
**截止:** Cycle 1 结束前
**负责人:** dev-1
**难度:** 中等

---

## 任务

实现 `paper_digest/fetcher.py` — arXiv API 封装模块，带 retry + 缓存。

### 背景

所有功能（摘要、排序、推送）都依赖论文数据。没有这个模块，后续开发每次需要等 arXiv API 响应，效率极低。这是整个产品的基石。

### 具体实现

#### 1. 新建 `paper_digest/fetcher.py`

```python
"""arXiv paper fetcher with retry + cache."""

import json
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import requests
from paper_digest.models import Paper


CACHE_DIR = Path.home() / ".cache" / "paper-digest"
CACHE_TTL = timedelta(hours=1)  # 1 hour cache TTL
ARXIV_API_BASE = "http://export.arxiv.org/api/query"
MAX_RETRIES = 3
RETRY_BASE_DELAY = 2  # seconds


class FetchError(Exception):
    """Raised when arXiv API request fails after retries."""


def _cache_key(query: str) -> str:
    """Generate a deterministic cache key from query."""
    return hashlib.sha256(query.encode()).hexdigest()[:16]


def _cache_path(key: str) -> Path:
    """Get cache file path for a cache key."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    return CACHE_DIR / f"{key}.json"


def _is_cache_valid(path: Path) -> bool:
    """Check if cache file is still within TTL."""
    if not path.exists():
        return False
    mtime = datetime.fromtimestamp(path.stat().st_mtime)
    return datetime.now() - mtime < CACHE_TTL


def _load_cache(key: str) -> Optional[list[dict]]:
    """Load cached results if valid."""
    path = _cache_path(key)
    if _is_cache_valid(path):
        with open(path) as f:
            return json.load(f)
    return None


def _save_cache(key: str, data: list[dict]) -> None:
    """Save results to cache."""
    path = _cache_path(key)
    with open(path, "w") as f:
        json.dump(data, f)


def _parse_arxiv_response(xml_text: str) -> list[dict]:
    """Parse arXiv Atom XML into list of paper dicts.
    
    Uses simple string parsing to avoid lxml dependency.
    """
    papers = []
    entries = xml_text.split("<entry>")[1:]  # skip prolog
    
    for entry in entries:
        paper = {}
        
        # Title
        if "<title>" in entry:
            raw = entry.split("<title>")[1].split("</title>")[0]
            paper["title"] = raw.strip()
        
        # Summary (abstract)
        if "<summary>" in entry:
            raw = entry.split("<summary>")[1].split("</summary>")[0]
            paper["abstract"] = raw.strip().replace("\n", " ")
        
        # arXiv ID
        if "<id>" in entry:
            raw = entry.split("<id>")[1].split("</id>")[0]
            paper["id"] = raw.strip().split("/")[-1].split("v")[0]  # e.g. 2301.12345
        
        # Published date
        if "<published>" in entry:
            raw = entry.split("<published>")[1].split("</published>")[0]
            paper["published"] = raw.strip()
        
        # Updated date
        if "<updated>" in entry:
            raw = entry.split("<updated>")[1].split("</updated>")[0]
            paper["updated"] = raw.strip()
        
        # Authors
        authors = []
        for author_block in entry.split("<author>")[1:]:
            if "<name>" in author_block:
                name = author_block.split("<name>")[1].split("</name>")[0]
                authors.append(name.strip())
        paper["authors"] = authors
        
        # Categories/primary category
        if "<arxiv:primary_category" in entry:
            # Try scheme attribute
            part = entry.split("<arxiv:primary_category")[1].split(">")[0]
            if 'term="' in part:
                paper["primary_category"] = part.split('term="')[1].split('"')[0]
        
        # Categories list
        categories = []
        for cat_part in entry.split("<category"):
            if 'term="' in cat_part:
                term = cat_part.split('term="')[1].split('"')[0]
                categories.append(term)
        paper["categories"] = categories
        
        # Link (PDF)
        if '<link href="' in entry:
            for link_part in entry.split('<link href="')[1:]:
                url = link_part.split('"')[0]
                if url.endswith(".pdf"):
                    paper["pdf_url"] = url
                    break
        
        if paper.get("id"):
            papers.append(paper)
    
    return papers


def fetch_topic(topic: str, max_results: int = 10) -> list[dict]:
    """Fetch papers by topic from arXiv with retry and cache.
    
    Args:
        topic: arXiv search query (e.g. "cat:cs.AI+AND+cat:cs.CL", or "LLM")
        max_results: Max papers to return (default: 10)
    
    Returns:
        List of paper dicts with keys: id, title, abstract, authors, published, 
        updated, categories, primary_category, pdf_url
    
    Raises:
        FetchError: If API request fails after all retries
    """
    query = f"search_query={topic}&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"
    
    # Check cache
    cached = _load_cache(f"topic:{topic}:{max_results}")
    if cached is not None:
        return cached
    
    # Fetch with retry
    url = f"{ARXIV_API_BASE}?{query}"
    last_error = None
    
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(
                url,
                headers={"User-Agent": "paper-digest/0.1.0"},
                timeout=30,
            )
            resp.raise_for_status()
            
            papers = _parse_arxiv_response(resp.text)
            _save_cache(f"topic:{topic}:{max_results}", papers)
            return papers
            
        except requests.RequestException as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                delay = RETRY_BASE_DELAY * (2 ** attempt)
                time.sleep(delay)
    
    raise FetchError(f"Failed to fetch topic '{topic}' after {MAX_RETRIES} retries: {last_error}")


def fetch_by_id(arxiv_id: str) -> Optional[dict]:
    """Fetch a single paper by arXiv ID.
    
    Args:
        arxiv_id: arXiv ID (e.g. "2301.12345")
    
    Returns:
        Paper dict, or None if not found
    
    Raises:
        FetchError: If API request fails after all retries
    """
    # Normalize: remove version suffix
    clean_id = arxiv_id.split("v")[0] if "v" in arxiv_id else arxiv_id
    
    # Check cache
    cached = _load_cache(f"id:{clean_id}")
    if cached is not None:
        return cached[0] if cached else None
    
    url = f"{ARXIV_API_BASE}?id_list={clean_id}"
    last_error = None
    
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(
                url,
                headers={"User-Agent": "paper-digest/0.1.0"},
                timeout=30,
            )
            resp.raise_for_status()
            
            papers = _parse_arxiv_response(resp.text)
            _save_cache(f"id:{clean_id}", papers)
            return papers[0] if papers else None
            
        except requests.RequestException as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                delay = RETRY_BASE_DELAY * (2 ** attempt)
                time.sleep(delay)
    
    raise FetchError(f"Failed to fetch paper '{arxiv_id}' after {MAX_RETRIES} retries: {last_error}")


def clear_cache() -> int:
    """Clear all cached paper data.
    
    Returns:
        Number of cache files removed
    """
    count = 0
    if CACHE_DIR.exists():
        for f in CACHE_DIR.iterdir():
            if f.suffix == ".json":
                f.unlink()
                count += 1
    return count
```

#### 2. 新建 `paper_digest/models.py`

```python
"""Data models for paper-digest."""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Paper:
    """A single arXiv paper."""
    
    arxiv_id: str
    title: str
    abstract: str
    authors: list[str] = field(default_factory=list)
    published: Optional[str] = None
    updated: Optional[str] = None
    categories: list[str] = field(default_factory=list)
    primary_category: Optional[str] = None
    pdf_url: Optional[str] = None
    
    @classmethod
    def from_dict(cls, data: dict) -> "Paper":
        """Create Paper from parsed arXiv dict."""
        return cls(
            arxiv_id=data.get("id", ""),
            title=data.get("title", ""),
            abstract=data.get("abstract", ""),
            authors=data.get("authors", []),
            published=data.get("published"),
            updated=data.get("updated"),
            categories=data.get("categories", []),
            primary_category=data.get("primary_category"),
            pdf_url=data.get("pdf_url"),
        )
    
    @property
    def short_id(self) -> str:
        """Short arXiv ID without version suffix."""
        return self.arxiv_id.split("v")[0]
    
    @property
    def year(self) -> Optional[str]:
        """Extract publication year."""
        if self.published:
            return self.published[:4]
        return None
```

### 文件结构

新增：
- `paper_digest/fetcher.py` — arXiv API 封装
- `paper_digest/models.py` — Paper dataclass

### 测试覆盖

在 `tests/test_fetcher.py` 写出以下测试：

1. `test_parse_arxiv_response_basic` — 解析一条完整 XML ✅
2. `test_parse_arxiv_response_missing_fields` — 解析缺字段的 entry 不 crash ✅
3. `test_fetch_topic_cache_hit` — mock requests 后缓存命中直接从本地返回 ✅
4. `test_fetch_topic_retry_on_failure` — 第一次失败后重试成功 ✅
5. `test_fetch_topic_all_retries_fail` — 全部失败后抛 FetchError ✅
6. `test_fetch_by_id_normalizes_version` — `2301.12345v2` → `2301.12345` ✅
7. `test_clear_cache` — 清除缓存后 count 正确 ✅
8. `test_paper_from_dict` — Paper 模型转换 ✅

### 不要碰
- ❌ 不改 `cli.py`（下个任务改）
- ❌ 不改 `pyproject.toml`（依赖已在）
- ❌ 不改 `__init__.py`

### 验证标准
- [ ] `python3 -m pytest tests/test_fetcher.py -v` → 8 个测试全绿
- [ ] `python3 -m pytest` → 全部测试 ≥ 10 个，全绿
- [ ] `import paper_digest.fetcher` 不报错
- [ ] 所有 API 外的 import 已确认

---

*dev-1，地基在此。做得稳，后面所有功能才能快。*
