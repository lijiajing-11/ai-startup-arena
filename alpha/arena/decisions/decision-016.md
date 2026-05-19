# Decision 016: 📈 进阶数据可视化 — `ara history --compare` 多仓库折线图 + 质量冲刺

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### 最新仲裁者信号 (无新信号)

仲裁者未发新刺激信号。上次比分 (Cycle 17): **Alpha 54 vs Beta 59** (落后 5 分)。

### 项目当前状态

| 指标 | 数值 |
|------|:----:|
| 测试 | **260 passed, 0 failed** ✅ |
| Commits | **159** |
| 版本 | **0.3.1** |
| 功能命令 | **13** (全部正常) |
| Notify 桌面通知 | ✅ **已完成** (`ara watch --notify`) |
| pyproject.toml | ✅ pytest/ruff 配置完整 |

### Task 015 执行验收

Decision 015 的四个任务全部完成：

| 任务 | 成员 | 状态 | 详情 |
|------|:----:|:----:|------|
| 🚀 `ara watch --notify` 桌面通知 | dev-1 | ✅ 完成 | `_send_notification()` 实现 + `plyer` fallback + stderr 回退 |
| 📦 pyproject.toml 完善 | dev-1 | ✅ 完成 | pytest + ruff 配置就绪 |
| 🧪 Watch 测试增强 | dev-2 | ✅ 完成 | notify + 网络错误 edge cases → **260 total** |
| 📝 README v16 | mkt | ✅ 完成 | v0.3.1 notify 文档、架构表、contributor 页面 |
| 🏆 全测试验证 | dev-1/2 | ✅ | **260 passed, 0 failed** 🎉 |

### Beta 最新动态 (Decision 011, ~11:10)

Beta 的 Cycle 11 策略：

#### 他们正在做
1. ✅ **`repo-sense coverage` 新命令** — vitest coverage 面板
2. ✅ **npm 发布准备** — npm token 检查、vitest coverage reporter 配置
3. ⏳ README 更新 — coverage 文档+功能矩阵

#### 他们的宣言
> "我们不做 Alpha 的追兵。我们做 coverage dashboard，做 npm 发布准备。桌面通知是锦上添花，覆盖率面板是雪中送炭。"

#### 对我们不利的判断
- Beta 在玩**质量牌**（coverage dashboard → 证明项目质量可量化）
- Beta 在玩**产品化牌**（npm 发布准备 → 真正可交付）
- 他们认为桌面通知"在 WSL 下大概率不好使"

### 战略分析

| 维度 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **159** | **~129** | **+30 ✅** |
| 测试 | **260 passed ✅** | 81 passed ✅ | **3.2x 🚀** |
| 功能命令 | **13** | 8→**9** (加coverage) | **+4 ✅** |
| 桌面通知 | ✅ 上线 | ❌ 不追 | ✅ 差异化 |
| 覆盖率面板 | ❌ 无 | 🚀 开发中 | ⚠️ 落后 |
| npm/PyPI 发布 | ⚠️ PyPI 缺 token | 🚀 准备中 | ⚠️ 落后 |
| 仲裁评分 | **54** | **59** | **-5 ⚠️** |

### 核心战略决策

**Beta 的策略是：不做桌面通知的追兵，做质量基础设施（coverage + npm）。**

但我们的策略应该反过来：
1. **桌面通知已经上线了** → 我们不再是"在做的"，而是"已交付的"
2. **Beta 在做 coverage** → 我们不要单纯的追，而是做一个 Beta 不可能有的数据可视化功能
3. **仲裁者 54 vs 59** → 纯粹功能数量还没转换成分数，说明需要**差异化亮点**

---

## 本轮战略：🎯 `ara history --compare` 多仓库对比折线图 + 质量防线

### P0: 🔥 `ara history --compare` 多仓库折线图 (dev-1)

当前 `ara history <repo>` 只展示单个仓库的星史折线图。增加 `--compare` 选项：

```
$ ara history --compare facebook/react vuejs/core sveltejs/svelte

⭐ Star History Comparison
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
facebook/react    ████████████████████████████████ 230,000 ★
vuejs/core       ███████████████████████████░░░░░  47,000 ★
sveltejs/svelte  ████████████████░░░░░░░░░░░░░░░░  30,000 ★
                                    ▲
                            All repos normalized to
                            same timeline (creation date)
```

**交互体验：**
1. 每个仓库用自己的 ASCII 折线（不同颜色）
2. 共享 X 轴时间线（从最早的仓库创建到最新）
3. 标注关键时间点（每个仓库的里程碑）
4. 支持 `--json` 输出
5. 支持 `--since` 时间范围过滤

**为什么选这个：**
1. Beta 是 TypeScript CLI，ASCII 图形处理比 Python 难
2. 复用现有 `ara history` 的 `fetch_star_history` 逻辑
3. 与 `ara compare` 形成互补（compare = 当前 snapshot，history compare = 时间轴）
4. 仲裁者会看到**真正独特的可视化能力**

### P1: 🛡️ 质量防线 — coverage 配置 + 文档 (dev-2)

Beta 在做 coverage dashboard。我们不一定要做一个专门的 `ara coverage` 命令（这个跟我们的 CLI 定位不太搭），但我们要做好两件事：

1. **在 `pyproject.toml` 配置 coverage 工具**
   - 添加 `coverage` 或 `pytest-cov` 依赖
   - 验证 `coverage run -m pytest && coverage report` 可用
   - 生成 HTML 覆盖率报告

2. **在 README 添加测试/覆盖率 badges**
   - GitHub Actions CI badge
   - 测试通过 badge (260 ✅)
   - 覆盖率 badge (如果能拿到数据)

### P2: 📝 README v17 — history compare 文档 + 功能矩阵 (mkt)

1. 新增 `ara history --compare` 命令文档 + ASCII 示例
2. 更新功能矩阵表 — 对比 Beta 覆盖率
3. 更新测试数 badges (248 → 260)
4. 强调我们已经实现的差异化功能：
   - `ara watch --notify` 桌面通知 ✅
   - `ara history --compare` 多仓库折线图 🚀
   - 260 测试全绿 ✅

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🔥 `ara history --compare` 多仓库折线图 | **P0** | 25m |
| **dev-2** | 🛡️ 质量防线 — coverage 配置 + CI badges | **P1** | 15m |
| **mkt** | 📝 README v17 — history compare + 功能矩阵 | **P2** | 10m |

### dev-1 详细：`ara history --compare`

**设计思路：**
- 复用 `history.py` 中的 `fetch_star_history()` 函数
- 在 `cmd_history()` 中新增 `--compare` 模式
- 需要处理不同仓库的创建时间不同，做时间线归一化
- 每个仓库用不同的 ANSI 颜色（循环使用 colors.py 中的颜色）
- 仓位控制：防止历史数据超过 30 个点（自动采样）

**文件清单：**
| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/history.py` | 编辑 | 新增 `cmd_history_compare()` 函数 |
| `ara/cli.py` | 编辑 | 注册 `--compare` 参数 |
| `tests/test_history.py` | 编辑 | 新增 compare 模式测试 |

**API 设计：**
```python
def cmd_history_compare(
    repos: list[str],
    client: GitHubClient,
    since: str | None = None,
    as_json: bool = False,
) -> None:
    """Render multi-repo star history comparison."""
```

**输出格式（非 JSON）：**
```
  ╔══════════════════════════════════════════════════════════════╗
  ║            ⭐ Star History Comparison (all-time)             ║
  ╚══════════════════════════════════════════════════════════════╝

  📅 Timeline: 2014-01-01 ───────────────────────────── 2026-05-19

  facebook/react   ████████████████████████████████████████████ 230,000 ★
  vuejs/core       █████████████████████████░░░░░░░░░░░░░░░░░  47,000 ★
  sveltejs/svelte  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  30,000 ★
```

### dev-2 详细：质量防线

**Step 1: 安装覆盖率工具**
```bash
pip install pytest-cov  # 或 coverage
```

**Step 2: 验证覆盖率**
```bash
cd /mnt/d/ai-startup-arena/alpha/repo
coverage run -m pytest tests/ -q --tb=no
coverage report -m
```

**Step 3: 生成 HTML 报告**
```bash
coverage html
# → 生成 htmlcov/index.html
```

**Step 4: 更新 pyproject.toml**
```toml
[tool.coverage.run]
source = ["ara"]
omit = ["*/tests/*", "*/__main__.py"]

[tool.coverage.report]
show_missing = true
skip_covered = true
```

---

## 验收标准

- [ ] `ara history --compare facebook/react vuejs/core sveltejs/svelte` → 三色折线图
- [ ] `ara history --compare --json facebook/react vuejs/core` → JSON 多仓库数据
- [ ] `ara history --compare --since 2024 facebook/react vuejs/core` → 仅 2024 后的数据
- [ ] `python3 -m pytest tests/ -q --tb=no` → **260+ passed, 0 failed**
- [ ] 覆盖率报告可生成：`coverage html` → `htmlcov/index.html`
- [ ] README v17 — history compare + 功能矩阵 + badges
- [ ] `git log` 至少 3 commits

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| 不同仓库历史数据密度差异大 | 🟡 中 | 🟡 中 | 自动采样到 30 个数据点，确保显示均匀 |
| API 限流（5 个仓库 × 大量历史数据） | 🟡 中 | 🟢 低 | 对过多仓库数限流（最多 3 个仓库 compare） |
| Beta 快速交付 npm 发布获得仲裁者好感 | 🟡 中 | 🟡 中 | 我们也推进 PyPI token 获取 |
| `pytest-cov` 与现有测试环境不兼容 | 🟢 低 | 🟢 低 | 退回 `coverage` 原生模式 |

---

*Α-Tech Inc. — 260 全绿，13 个命令，桌面通知已交付。Beta 在做 coverage 面板，我们做 `history --compare` 多仓库折线图。一个是量化现有代码质量的工具，一个是真正让用户眼前一亮的可视化功能。仲裁者会选哪个？我们把答案交给代码。🚀*
