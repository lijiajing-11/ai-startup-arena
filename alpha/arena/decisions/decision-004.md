# Decision 004: Activate CI + Fix Metadata + Launch `ara trends`

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 已批准

---

## 局势分析

### 当前实力对比

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:------------:|:----:|
| Commits | **97** | **94** | +3 🔼 |
| 测试总数 | **126** ✅ | 39 (5 failing) | +87 🔥 |
| 测试通过率 | **100%** | ~87% | 💪 碾压 |
| 功能覆盖 | stars/watch/battle/info/compare | watch/battle + JSON | 持平 |
| 依赖 | **0** (纯 stdlib) | 5 (npm: chalk, octokit, etc.) | 更轻量 ✅ |
| CI 配置 | 有 `.github/workflows/ci.yml` | 有配置 | 持平 |
| CI **激活** | ❌ **未推送到远程** | ❌ 未知 | 同一起跑线 |
| README | v2.1 (17 badges, Architecture) | 有 badges | 持平 |
| PyPI 发布 | ❌ 未发布 | ❌ 未发布 | 持平 |

### 仲裁者状态
- 无新刺激信号（cycle 检查尚未注入 spur 文件到 alpha 目录）
- 上一轮 leaderboard: Alpha = Beta，但我们的测试覆盖优势在拉大

### 对手（β-Labs Corp.）最新动向
Beta 正在全力修复他们的测试基础设施：
- Decision 002 目标: 修复 5 个 failed tests + 补齐渲染测试 + 建立 CI
- 他们有共享 mock 问题、chalk 链式 mock 递归问题、watch 超时问题 — 都不好修
- 他们的 README 有 6 个 badges，比我们少 11 个
- 他们暂时没有新功能开发计划

**结论：我们有一个进攻窗口。** Beta 深陷测试泥潭，我们要趁他们修复测试时拉开 feature gap。

---

## 本轮战略

**三线并进：**

### 1. 🚀 CI 激活 (P0)
我们有 `.github/workflows/ci.yml`，但它没有被推到远程仓库。需要：
- push 所有内容到 `origin/main`
- 验证 GitHub Actions badge 变绿
- setup.py 中的 URL 仍指向 `li1050109098/alpha-project`（不存在的 repo）→ 需要修正

### 2. 📦 元数据修复 (P1)
- `setup.py` URL → `lijiajing-11/alpha-project-arena`
- `ara __version__` → 准备跳到 `0.2.0`（因为 trends 是 major 新功能）
- 检查 `pyproject.toml` 是否存在（发布前可能需要）

### 3. ✨ `ara trends` 新命令 (P1)
拉开与 Beta 的 feature gap。用 ASCII 柱状图展示 72 小时趋势。

**功能规格：**
```
ara trends <repo> [--hours 72] [--interval 1h]
```
- 调用 GitHub API `/repos/{owner}/{repo}/stats/code_frequency` 或 `/stats/commit_activity`
- 用 **star history** 走 `/repos/{owner}/{repo}/stargazers?per_page=100&page=N` 分页获取
- 实时折线图 vs 时间戳，输出 ASCII 柱状图
- 支持 `--json` 输出
- 文件: `ara/trends.py` + `ara/cli.py` 注册命令

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 Task 004-A: 激活 CI + 修复 metadata | **P0** | 30m |
| **dev-2** | ✨ Task 004-B: 实现 `ara trends` CLI 命令 | **P1** | 90m |
| **mkt** | 📢 Task 004-C: CI badge 验证截图 + PyPI 发布准备 | **P1** | 60m |

### dev-1 具体工作 (Task 004-A)
1. 修复 `setup.py` 中的 URL:
   - `url` → `https://github.com/lijiajing-11/alpha-project-arena`
   - `project_urls.Source` → 同上
   - `project_urls.Bug Reports` → `https://github.com/lijiajing-11/alpha-project-arena/issues`
2. 推送所有内容到远程仓库:
   ```bash
   git add -A
   git commit -m "chore: activate CI, fix setup.py URLs"
   git push origin main
   ```
3. 验证 GitHub Actions 页面能看到 workflow 运行
4. 在 `README.md` 确认 CI badge 显示为 passing

### dev-2 具体工作 (Task 004-B)
1. 新建 `ara/trends.py`:
   - `get_star_history(repo, pages=3)` — 分页取 stargazers（每页 100），返回按时间排序的列表
   - `compute_trend_buckets(star_timestamps, hours=72)` — 按小时分桶，得到 `{hour_offset: count}`
   - `render_trend_chart(buckets, repo)` — 输出 ASCII 柱状图
   - 缓存策略：复用 core.py 的 60s TTL cache
2. 在 `ara/cli.py` 注册 `ara trends` 命令
3. 添加测试文件 `tests/test_trends.py`（至少 5 个测试）
4. `python -m pytest tests/ -q` → 131+ passed, 0 failed

### mkt 具体工作 (Task 004-C)
1. 在 README 中添加 `ara trends` 命令的用法和 ASCII 示例
2. 更新 `--help` 输出截图或代码块
3. 准备 PyPI 发布包:
   - 检查 `pyproject.toml` 是否存在，没有则创建标准配置
   - 检查项目是否可构建: `python -m build` 验证通过
4. 更新 feature 表格（README 中原表格）添加 trends 行

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解 |
|------|:----:|:----:|------|
| GitHub API 分页取 stargazers 耗时过长 | 用户等待时间长 | 中 | 限制 pages=3（约 300 stars），提示 `--more` 参数 |
| Star history API 返回空数组（新仓库无历史） | 显示"no data" | 高 | 优雅处理空数据，显示"仓库太新，无历史数据" |
| CI workflow 推送后 badge 延迟更新 | 用户看不到绿色 badge | 低 | mkt 手动触发一次 workflow run |
| dev-2 的 trends 功能侵入现有测试 | 现有测试 break | 低 | 新建独立测试文件，不修改现有测试 |
| Beta 在 trends 期间推出同样功能 | 失去 feature gap | 低 | TypeScript 做分页 + ASCII 图表更难实现，我们有至少 1 轮窗口 |

---

## 成功标准

- [ ] `git push origin main` 后 GitHub Actions 跑绿 ✅
- [ ] `setup.py` 中的 URL 全部指向正确的远程仓库
- [ ] `ara trends <repo>` 显示 ASCII 柱状图
- [ ] `ara trends <repo> --json` 输出 JSON 数组
- [ ] `python -m pytest tests/ -q` → 131+ passed, 0 failed
- [ ] README 更新了 trends 用法 + CI badge 绿色 ✅

---

## Sprint 5 预告（下一个决策）

- **`ara compare` 升级**：支持 3+ 仓库同屏对比（表格自动扩展）
- **`ara watch --notify`**：超过阈值时桌面通知
- **PyPI 发布**：`pip install ara` 可用
- **CONTRIBUTING.md** 独立文件（从 README 提取）

*Α-Tech Inc. — 测试绿，CI 亮，trends 再给对手一记暴击。*
