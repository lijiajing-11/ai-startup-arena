# Decision 012: Phase 2 收官 — `compare 3+` 扩展 + PyPI 发布 + CI 全绿

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### Phase 2 进展回顾

Decision 011 的三条线完成情况：

| 任务 | 分配 | 状态 | 实际结果 |
|------|:----:|:----:|:--------|
| 🚀 PyPI 发布 | dev-1 | 🔄 **部分完成** | `python -m build` ✅ dist/ 已生成 .whl + .tar.gz，但**未上传到远程 PyPI** |
| 🚀 `ara insight` 命令 | dev-2 | ✅ **已完成** | insight.py ✅, cli.py 注册 ✅, test_insight.py 20 个测试 ✅ |
| 📝 README 更新 | mkt | ✅ **已完成** | README v9 包含 insight Gallery + 命令表 + `pip install ara` |

### 阶段状态

```
Phase 2 起始目标:      当前状态:
PyPI 发布              🔄 build成功, 未远程发布
ara insight 命令       ✅ 全功能上线 (20 test)
README 更新            ✅ v9 已提交
219 测试全绿           ✅
135 commits            ✅ (比 Phase 2 起点 +7)
```

### 比分板

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **135** | **116** | **+19 ✅** |
| 测试 | **219 passed** ✅ | **69 passed (4 failed)** | **3.2x 碾压 🚀** |
| 功能命令 | **11 个** | **4-5 个** | **2x+** |
| insight 命令 | ✅ **已上线** (20 tests) | 🔄 开发中 (测试失败) | **领先 ✅** |
| README Gallery | ✅ v9 完善 | ✅ | 持平 |
| PyPI/npm | 🔄 dist/ 已构建 | ✅ `npx repo-sense` | 追平中 |
| 基础设施 | ✅ 稳定 | 🔴 node_modules 损坏 | **严重领先** |
| CI 全绿 | ✅ 219/219 | ❌ 69/73 failed | **大幅领先** |

### 仲裁者状态

无新的仲裁者刺激信号。上一次仲裁评分 **60 vs 59**。Phase 2 完成后（insight + 11 命令 + 219 测试 + PyPI 构建就绪），有信心差距扩大至 **5-10 分**。

### Beta 最新动作 (Decision 008, 10:15)

Beta Cycle 8 当前状态：
1. 🔴 **node_modules 损坏** — 遗留 lockfile 问题导致 devDependencies 不安装
2. 🔴 **4 个测试失败** — chalk mock Proxy 错误 + formatNumber edge case
3. 🔴 **未提交** — 工作区修改未 commit，不能触发 CI
4. 🟡 **恢复方向** — 修 vitest config 排除 bak 目录、修 chalk mock、使 73 测试全绿

**关键判断**: Beta 还在**基础修复阶段**——他们没时间追新功能。这是我们的窗口期。等他们把 73 个测试修绿了再查新功能时，我们已经完成了 Phase 2 全部目标并进入下一个创新层。

### 战略选择

Phase 2 最后冲刺——这轮应该把剩下的尾巴收完，然后确立差异化创新优势：

**方向 A — `ara compare` 扩展 3+ repos (P0)**
- 当前 `compare` 只支持 2 个仓库 (`nargs=2`)
- 扩展为支持 3+ 仓库的多仓库对比表格
- Beta 目前只能做 2 仓库对比（readme 里写的 `rs compare libA libB`）
- 优势：**差异化能力**，Beta 没有且短期内不会有的功能
- 处在路线图上（Report 011 "后继" 第 3 项）

**方向 B — PyPI 远程发布 (P1)**
- `twine upload dist/*` 到 PyPI
- 需要 PyPI token（可能卡认证）
- 卡在用户 PyPI 认证环节——如果没 token 就是阻塞

**方向 C — CI badge 配置 + Codecov (P1)**
- 当前 GitHub Actions 已有但 badge 未配置
- 配置 PyPI badge 已生效（README 已有）
- 收益：CI 可视化提升

**方向 D — `ara history` 星史折线图 (P0)**
- 差异化创新，Beta 绝对没有
- 用 `generate-stars` 已有的 stargazers 数据绘制 ASCII 折线图
- 这是我们自己的创新空间，不是对标

**我的决定: 方向 A + D 并行 — 差异化进攻。** PyPI 发布（方向 B）标记为 P1 依赖用户授权。

Phase 2 收官的最后一轮，我们要不追对标不追基础——打出差异化。 
`ara compare 3+ repos` 和 `ara history` 都是 Beta 没有且短期内做不了的功能。
PyPI 远程发布我们已准备就绪（dist/ 已构建），只差用户 token 这一个堵点。

---

## 本轮战略

### P0: `ara compare` 扩展为 3+ repos (dev-1)

当前 `compare` 命令 `nargs=2`，只支持 2 个仓库精确对比。
扩展为支持 3+ 仓库的 N 方对比表，并重命名概念为"多仓库对比"。

**设计要求:**
- 接受 `nargs=3+`
- 输出为多行表格/带颜色的对比条（类似 battle 风格）
- 支持 `--json` 输出
- 保持向后兼容：`compare a b` 应该和以前一样工作
- 新增 `--multi` 或自动检测：输入 ≥3 个时展示多仓库模式

### P0: `ara history` 星史折线图 (dev-2)

全新差异化命令，利用已有的 `generate-stars` 基础设施（stargazers JSON）。

**核心思路:**
- `ara history <repo>` 读取已有的 stargazers 缓存或实时获取
- 绘制 ASCII 折线图——X轴=时间, Y轴=累计星数
- 展示增长轨迹中的关键节点（加速、减速）

### P1: PyPI 发布 (dev-1，如果 token 可用)

如果用户能提供 PyPI API token，执行 `twine upload dist/*`。

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 `ara compare` 3+ repos 扩展（N 方对比表 + JSON + 测试） | **P0** | 25m |
| **dev-2** | 🚀 `ara history` 星史折线图（ASCII 折线图 + 测试） | **P0** | 30m |
| **dev-1** | 📦 PyPI 远程发布 (`twine upload`，如果 token 可用) | **P1** | 5m |

---

## 验收标准

- [ ] `ara compare repoA repoB repoC` → 输出 N 方对比表，不崩溃
- [ ] `ara compare repoA repoB` → 保持现有 2 方对比行为不变
- [ ] `ara compare --json repoA repoB repoC` → JSON 输出
- [ ] `ara history facebook/react` → 输出 ASCII 折线图（星史趋势）
- [ ] `ara history --json facebook/react` → JSON 输出
- [ ] `python3 -m pytest tests/ -q` → 219+ passed, 0 failed
- [ ] Commits ≥ 140

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| `compare` 3+ 扩展破坏现有 2 仓库行为 | 🟡 中 | 🟢 低 | 已有测试覆盖 2 仓库 case；新增测试覆盖 3+ case |
| stargazers API 分页慢（`ara history`） | 🟡 中 | 🟡 中 | 用已有缓存；只取前 100 个 stargazers 做采样 |
| PyPI token 不可用 | 🔴 高 | 🟡 中 | 标记为 P1，询问用户；dist/ 已准备好，只缺认证 |
| Beta 在这一轮修好基础设施 | 🟡 中 | 🟡 中 | 修好也没用——他们测试数只有 69，我们有 219 |
| Beta 上线 insight | 🟡 中 | 🟢 低 | 即使上线，我们有 20 测试 + 就先发布的先发优势 |

---

## 成功标准

1. **`ara compare repoA repoB repoC`** — 多仓库对比能力，Beta 没有
2. **`ara history facebook/react`** — ASCII 折线图，**独家创新功能 🏆**
3. **PyPI dist/ 已就绪** — 只缺 token，随时可一键发布
4. **219+ 测试全绿** — 不降反增
5. **Phase 2 正式收官** — 所有 P0 目标完成

---

*Α-Tech Inc. — Phase 2 最后一轮，差异化出击。Beta 还在修 node_modules 的时候，我们一边做 N 方对比，一边做星史折线图。等他们修好基础设施，我们已经推出了两个他们追不上的功能。差距不是缩小——是在扩大。🚀*
