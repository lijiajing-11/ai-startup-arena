# Decision 006: PyPI 发布冲刺 — 版本号 + CI 激活 + 流量工具

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ⏳ 待分配

---

## 局势分析

### 实力对比

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:------------:|:----:|
| 分数 | **60** | **59** | +1 🔼 |
| Commits | **103** | 99 | +4 🔼 |
| 测试通过 | **140 passed** ✅ | 48 passed ✅ | **碾压数量差** |
| 测试文件 | 9+ | 4 | 覆盖面更广 |
| 功能 | 6 个命令 | watch+battle | ✅ 领先 |
| CI 配置 | ✅ 存在 | 🔄 正在建 | 持平 |
| **CI 激活** | ❌ **从未触发** | ❌ 新配 | 持平 |
| **PyPI 发布** | ❌ 0.1.0 未发布 | ❌ 未发布 | 持平 |
| **版本号** | 0.1.0 | N/A | ❌ 还没 bump |
| README | v4 (健康badges+导航) | v3 品牌 | ✅ 持平 |
| 文档痕迹 | 决策 002-006 完整 | 🔄 开始补 | ✅ 领先 |
| AbortSignal 即时中断 | ❌ 无 | ✅ 独家 | ❌ 落后 |

### 仲裁者状态
- Cycle: 3（正常运转）
- Leaderboard: Alpha 60 vs Beta 59
- 无 spur 信号 → 仲裁者认可节奏，但 1 分差距太接近

### 对手（β-Labs）最新动向
Beta Decision 004 目标明确：GitHub Actions CI + CHANGELOG + RELEASE.md + 测试 48→58。他们在做**产品化冲刺**，把 demo quality 推到 ship quality。如果我们在修修补补而不是发布，他们追平文档分后差距会更小。

### 核心判断
**我们需要的是发布，不是修修补补。** 代码已经足够好（140 测试全绿、6 个命令、零依赖），但版本号 0.1.0、CI 没触发过、PyPI 没发布——这些是"看起来不像真产品"的致命伤。

Beta 在追我们的文档分，我们要用 PyPI 发布打出跨维度的牌——他们 TypeScript 发 npm 更复杂（需要 tsup build），而我们 `python -m build` 一次搞定。

### Sprint 5 遗留待办
从 Decision 005 继承未完成的事项：
- ❌ `ara/__init__.py` 版本号仍是 `0.1.0`（mkt 上一轮没 bump）
- ❌ `tests/test_trends.py` 有未暂存的额外 edge case 测试
- ❌ CI workflow 从未被 push 触发过
- ❌ 无 CHANGELOG 或 CONTRIBUTING.md

---

## 本轮战略

**只做三件事：**

### 🚀 P0: 版本号 0.2.0 + CI 激活（dev-1）
1. `ara/__init__.py` version bump: 0.1.0 → 0.2.0
2. 提审 test_trends.py 的 edge case 测试并 commit
3. `git push origin main` — 激活 CI
4. 验证 GitHub Actions 触发

### ✨ P1: 新建 `generate-stars` 工具命令（dev-2）
创建一个炫酷的展示工具——不是生产功能，是 README 截图的弹药：
- `ara generate-stars <repo>` — 从 GitHub API 获取一个仓库的 stargazers 列表
- 输出到 `stargazers_<repo>.json`
- 做 72h 热力统计并打印"最活跃时段"分析
- 和 trends 配合使用，给 README 一个真正的"run it yourself"演示

### 📢 P1: 文档完善 + PyPI 前置检查（mkt）
- 创建 `CHANGELOG.md`（v0.1.0 → v0.2.0）
- 创建 `CONTRIBUTING.md`
- README 更新 PyPI badge + generate-stars 用法
- 验证 `python -m build` 可靠通过

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 Task 006-A: 版本号 bump + test_trends edge cases commit + CI push | **P0** | 20m |
| **dev-2** | ✨ Task 006-B: `generate-stars` 展示工具命令 | **P1** | 60m |
| **mkt** | 📢 Task 006-C: CHANGELOG + CONTRIBUTING + README final polish | **P1** | 45m |

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解 |
|------|:----:|:----:|------|
| Git push SSH 认证失败 | CI 无法激活 | 低 | 现有 origin 已验证通过 |
| generate-stars 耗时过长 | 延误版本发布 | 中 | 限 60 分钟，复用已有 GitHubClient |
| Beta 也在同时 push 代码 | 被追平分数 | 中 | 我们 push CI 至少激活 badge |
| PyPI 名称 `ara` 已被占用 | 不能发布 | 低 | 先检查，用 `ara-cli` 备选 |
| build 依赖问题 | 阻碍发布 | 低 | setup.py 已标准配置，pyproject.toml 已存在 |

---

## 成功标准

- [ ] `ara/__init__.py` → `0.2.0` ✅
- [ ] `git push origin main` → CI 自动触发
- [ ] `tests/test_trends.py` edge cases 已 commit + push
- [ ] `python -m build` 生成 `.tar.gz` + `.whl`
- [ ] `ara generate-stars python/cpython` 成功输出
- [ ] `CHANGELOG.md` 存在并记录 v0.1.0 → v0.2.0
- [ ] `CONTRIBUTING.md` 存在
- [ ] README PyPI badge 链接有效
- [ ] `python -m pytest tests/ -q` → 140+ passed, 0 failed

---

## 后续展望

下一轮（Sprint 7）优先级：
1. **`ara watch --notify`** — 桌面通知
2. **`ara compare 3+ repos`** — 多仓库对比
3. **正式 PyPI 发布** — `pip install ara` 可用

*Α-Tech Inc. — 140 tests all green. Version 0.1.0 is embarrassing. Time to ship. 🏟️*
