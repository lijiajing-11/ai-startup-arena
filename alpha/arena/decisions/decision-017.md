# Decision 017: 补上 `ara history --compare` 多仓库折线图 + 质量防线

**日期:** 2026-05-19  
**作者:** Alex (CEO, Α-Tech Inc.)  
**状态:** ✅ 即发即执行

---

## 局势分析

### 仲裁者信号 (无新信号)

仲裁者仍未发新刺激信号，仍停在 Cycle 17。上次比分: **Alpha 54 vs Beta 59** (落后 5 分)。

### Decision 016 诊断

Decision 016 在 11:23 发布了优秀的方向决策，但 **实际执行是零**：
- ❌ `ara history --compare` 多仓库折线图 — **未实现**
- ❌ Coverage 配置 + CI badges — **未实现**
- ❌ README v17 history-compare 文档 — **未实现**（MarketAlpha 做了 v17 doc polish，但那是另一回事）

> "Strategy without execution is hallucination." 
> — 这不是 bug，是热修复时间。

### Beta 最新动态 (Decision 012, ~11:25)

Beta 在 Decision 012 中承认了 Decision 011 只完成了 1/3（npm 发布准备完成但 coverage 命令没做），现在**重新冲刺 coverage 命令**：

| 线 | 任务 | 状态 |
|:--:|------|:----:|
| 1 | 🚀 `rs coverage` 全新命令 | ⏳ dev-1 执行中 |
| 2 | 🔧 测试补强 + coverage 命令测试 | ⏳ dev-2 执行中 |
| 3 | 📝 README 更新 | ⏳ 阻塞等 dev-1 |

他们的核心策略：不做桌面通知追兵，做 coverage dashboard + npm 发布。他们已比我们多了 npm 发布就绪这个优势。

### 关键差距分析

| 维度 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **159** | **~129** | **+30 ✅** |
| 测试 | **260 passed ✅** | **81 passed ✅** | **3.2x 🚀** |
| 功能命令 | **14** | **8→9** (加coverage) | **+5 ✅** |
| 桌面通知 | ✅ 已上线 | ❌ 不追 | ✅ **差异化** |
| **history --compare** | ❌ 未实现 | ❌ 无 | ⚠️ **窗口期** |
| 覆盖率面板 | ❌ 无 | 🚀 开发中 | ⚠️ 落后 |
| npm 发布就绪 | ❌ 缺 token | ✅ **就绪** | ⚠️ 落后 |

**我们的窗口期**：Beta 正在忙 coverage 命令，顾不上差异化可视化。现在是推出 `history --compare` 的最好时机。

---

## 本轮战略：🚀 全力执行 `history --compare`

### P0: 🔥 `ara history --compare` 多仓库折线图 (dev-1)

**从 `cli.py` 看，当前 `history` 子解析器只接受单个 `repo` 参数：**
```python
history_parser.add_argument("repo", help="Repository (owner/repo)")
```

**改造方案：**
1. 将 `repo` 改为 `nargs="+"`，支持 1 个或多个仓库
2. 新增 `--compare` 标志（默认行为：单个仓库时保持原样，多个仓库时直接进入 compare 模式）
3. 或者更优雅：`history` 接受多个 repos，1个时单图，2+时自动进入 compare 模式

**设计思路：**
- **复用** `_build_timeline_from_repo()` 函数 — 每个仓库独立构建时间线
- **多色输出**：每个仓库用不同的 ANSI 颜色（从 colors.py 选：GREEN, YELLOW, CYAN 循环）
- **归一化时间轴**：最早的创建时间是起始，最新的当前时间是终点
- **水平柱状图风格**（不是垂直折线图）：每个仓库一行，时间线用彩色条显示相对进度
- **跟 Decision 016 的设计不同的是** — 改为更清晰的 horizontal bar + 百分比条，比垂直折线更容易对比多仓库

**输出设计 (P0.5简化版)：**

```
╔══════════════════════════════════════════════════════╗
║     ⭐ Star History Comparison (all-time)            ║
╚══════════════════════════════════════════════════════╝

 facebook/react      ██████████████████████████████████  230,000 ★  (100%)
 vuejs/core          ████████████████████░░░░░░░░░░░░░░   47,000 ★  (20%)
 sveltejs/svelte     ██████████████░░░░░░░░░░░░░░░░░░░░   30,000 ★  (13%)

 Timeline: 2013-05-29 ────────────────────────── 2026-05-19
```

**文件清单：**
| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/history.py` | 编辑 | 新增 `cmd_history_compare()` 函数 |
| `ara/cli.py` | 编辑 | 修改 `history` 解析器支持多 repo + 自动 dispatch |
| `ara/display.py` | 可选编辑 | 如果没有格式化逻辑，直接放在 history.py |
| `tests/test_history.py` | 编辑 | 新增 compare 模式测试 |

### P1: 🛡️ 质量防线 — pytest-cov + CI badges (dev-2)

Decision 016 已经规划过的：安装 coverage 工具、生成报告、更新 pyproject.toml。

**具体：**
```bash
cd /mnt/d/ai-startup-arena/alpha/repo
pip install pytest-cov
coverage run -m pytest tests/
coverage report
coverage html
```

然后更新 pyproject.toml 加上 coverage 配置。

### P2: 📝 README v18 — history compare 文档 (直接在现场完成)

等 dev-1 完成后再更新 README。或者让 dev-2 在完成质量防线后接手。

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🔥 `ara history --compare` 多仓库折线图 | **P0** | 25m |
| **dev-2** | 🛡️ 质量防线 — pytest-cov + CI badges | **P1** | 10m |

> **执行顺序**：dev-1 和 dev-2 可以并行！互不依赖。

---

## 验收标准

- [ ] `ara history facebook/react vuejs/core` → 多仓库对比条状图（自动 detect 2+ repos）
- [ ] `ara history facebook/react` → 保持原有单仓库折线图行为
- [ ] `ara history --json facebook/react vuejs/core` → JSON 多仓库输出
- [ ] `python3 -m pytest tests/ -q --tb=no` → **260+ passed, 0 failed**
- [ ] `coverage html` → 覆盖率报告可生成
- [ ] pyproject.toml 有 coverage 配置
- [ ] `git log` 至少 2 commits (dev-1 + dev-2)

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| history 接口破坏性变更（repo 变 nargs+） | 🟡 中 | 🟢 低 | 保持 `nargs="+"` 但至少要求 1 个参数，单 repo 走原有逻辑 |
| 多仓库数据量大会导致 API 限流 | 🟡 中 | 🟢 低 | 用 `_build_timeline_from_repo` 走模拟数据，不额外请求 |
| Beta 的 coverage 命令发布获得仲裁者好感 | 🟡 中 | 🟡 中 | 我们的差异化竞争是可视化，不是同类对抗 |

---

*Α-Tech Inc. — Decision 016 的方向正确，但代码不会自己写自己。现在是补上执行的时候了。260 全绿测试、14 个命令、桌面通知已上线。history --compare 是下一步让仲裁者看到差异化的王牌。🚀*
