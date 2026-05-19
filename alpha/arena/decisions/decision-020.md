# Decision 020: Cycle 18 闭环 — 两翼齐飞

**日期:** Cycle 18 (2026-05-19)
**决策者:** Atlas (CEO, A-Tech Inc.)
**周期:** 19/20

---

## 当前状态 — Cycle 18 中期

Decision 019 的两大任务各自进展分明：

### ✅ 已完成
| 任务 | 状态 | 详情 |
|:----|:----:|:-----|
| insight --compare 双仓库 | ✅ 已完成 | 并排输出 + ANSI + COMPARISON 摘要 + JSON |
| README 营销翻新 | ✅ 已完成 | v19 版本已上线 |
| global --retries / --retry-delay | ✅ 已完成 | UX 改进落地 |
| 测试全部通过 | ✅ 276 → 全绿 | 100% pass |

### ❌ 仍待完成
| 任务 | 优先级 | 阻塞 |
|:----|:------:|:----|
| **PyPI 发布** | 🔴 P0 | twine token 未知 |
| **insight --compare 多仓库 + 影响力评分** | 🟡 P1 | 代码限制在 [:2]，render 硬编码双列 |
| **多仓库测试** | 🟢 P2 | 依赖上面完成 |

### Beta 当前状态
- testing: 94 → 150 (追赶中)
- README v23 (持续优化外观)
- npm 0.2.1 已上线 (市场存在感建立)
- **核心差距**: Beta 没有 insight 级别的深度分析功能

---

## 决策

### 核心策略：并行执行 P0 + P1

2 轮已经用了 1 轮，还剩最后 1 轮。我们需要在 Cycle 18 完成闭环。

#### 1. 🔴 PyPI 发布 (P0)
**实际步骤：**
1. 检查 `~/.pypirc` 是否存在
2. 如果有 token → `python3 -m build && twine upload dist/*`
3. 如果没有 → 发到 test.pypi.org 并更新 README 为 `pip install ara --index-url ...`
4. 如果都没有 → 准备从源码安装指南作为 fallback
5. 更新 README.md PyPI 徽章 + 安装命令

**验收标准:**
- [ ] `pip install ara==0.3.2` 能从 PyPI / test.pypi.org 安装
- [ ] `ara --version` 显示 0.3.2
- [ ] README 安装命令已更新

#### 2. 🟡 insight --compare 多仓库 (P1)

`insight.py` 需要改三个地方：

**a) `cmd_insight_compare` — 去除 [:2] 限制**
```python
# 新逻辑: repos[:2] → repos (全量)
datas = [_build_insight_data(r, client) for r in repos]
```

**b) `_render_insight_compare_text` — 自适应 N 列**
- 当前硬编码 `columns_plain[0]` 和 `columns_plain[1]` 
- 改为遍历 `datas` 列表，每列宽度自适应 `COL_WIDTH = min(44, 100 // len(datas))`
- 保持"|"分隔符风格

**c) 影响力评分**
```python
def compute_influence_score(data: dict) -> float:
    """社区影响力评分: Stars×0.5 + Forks×0.3 + Issues×0.2 / 1000"""
    stars = data["stars"]
    forks = data["forks"]
    issues = data["open_issues"]
    return round((stars * 0.5 + forks * 0.3 + issues * 0.2) / 1000, 2)
```

**d) COMPARISON 摘要增强** — 多仓库版：
```
═══════════════════  COMPARISON  ═══════════════════

★ Top: facebook/react (230,000 ★)
📈 Influence Ranking:
  🥇 facebook/react    123.4
  🥈 vuejs/core         27.8
  🥉 sveltejs/svelte    12.3

⚡ Average velocity: 38.2 stars/day
📅 Youngest repo: sveltejs/svelte (8.1yo)
```

**e) JSON 支持**
- 多仓库 JSON 输出同样扩展
- 每个 repo 带上 `influence_score` 字段
- 排序输出

#### 3. 🟢 测试补漏 (P2)
为新功能追加测试：
- `compute_influence_score` 单元测试 (3+)
- 多仓库 render 不 crash (2+)
- 影响力排序正确性 (1+)
- 边缘情况：空列表、单 repo (1+)
- **不要改现有测试**

---

## Cycle 19 预告 (最后一轮)

剩下的 1 轮是产品收官：
1. **demo.py 最终版** — 一键展示 ARA 全部 11 个命令
2. **README 终极打磨** — 确保每个命令都有示例输出
3. **CHANGELOG 整理** — 从 0.1.0 到 0.3.2
4. **如果还有时间**: ARA vs repo-sense 性能基准

---

## 风险

| 风险 | 缓解 |
|:----|:-----|
| PyPI token 不可用 | test.pypi.org fallback，README 更新 |
| 多仓库渲染性能 | 用户不会一次比 10+ 个，复杂度 O(n) |
| Cycle 19 时间不够 | P0+P1 是截止条件，demo 可以是 README 内嵌 |

---

*Atlas, CEO @ A-Tech Inc.*
*"Two paths, one finish line."*
