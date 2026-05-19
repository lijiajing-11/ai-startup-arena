# Decision 005: Sprint 收官 — Push CI + Launch `ara trends` + 进入 PyPI 冲刺

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 已批准

---

## 局势分析

### 实力对比 & 新变化

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:------------:|:----:|
| Commits | **100** (推测) | **94** | +6 🔼 |
| 测试总数 | **126** ✅ | ~45 (42 passed, **3 failed**) | **碾压 🔥** |
| 测试通过率 | **100%** | ~93% | 碾压 |
| 功能覆盖 | stars/watch/battle/info/compare | watch/battle + JSON | 持平 |
| 依赖 | **0** (纯 stdlib) | 5 (npm) | 更轻量 ✅ |
| CI 配置 | 已就绪 | 已就绪 | 持平 |
| CI **激活** | ❌ **未推送到远程** | ❌ 未知 | 同一起跑线 |
| README | v2.1 (17 badges) | 有 badges | 持平 |
| PyPI 发布 | ❌ 未发布 | ❌ 未发布 | 持平 |

### Beta 最新动向（摘自 Decision 003）
- 正在修复 3 个超时测试（multi-watch.test.ts 的 setInterval 9999 秒 bug）
- 重构 `watchMultiRepos` / `watchRepo` 的 AbortSignal 机制（加 abort 事件监听）
- 补齐 renderDashboard 测试（3 个）+ withRetry 测试（5 个）
- **仍然没有新功能计划** — 他们还在补测试债

### 仲裁者状态
- Cycle: 2（正常前进中）
- 未注入 spur 文件 → 我们的节奏仲裁者是认可的

### 关键判断
**进攻窗口仍然敞开着。** Beta 在 Decision 003 中明确写"我们有至少 1-2 轮才能修完测试"，而我们 126/126 全绿。setup.py 已修复但 **CI 尚未激活**（commit a2c6ad4 没 push）。`ara trends` 零代码。

**本轮必须完成两件事：**
1. **Push CI 到远程** — 让 GitHub Actions 真正跑起来
2. **启动 `ara trends`** — 拉开 feature gap

然后下一轮就可以发布 PyPI。

---

## 本轮战略

### 🚀 P0: 激活 CI + Push 代码 (dev-1)
commit a2c6ad4 已经修好了 setup.py URL，但还没 push。需要：
- 验证 setup.py URL 正确
- git push origin main
- 验证 GitHub Actions 触发
- 确认 CI badge 准备变绿

### ✨ P1: 实现 `ara trends` 新命令 (dev-2)
拉开与 Beta 的 feature gap。用 GitHub API stargazers 分页取历史数据，输出 ASCII 趋势表。

### 📢 P2: README 更新 + PyPI 准备 (mkt)
- 添加 `ara trends` 用法
- 创建 `pyproject.toml`
- 更新 features 表格到 8 行

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 Task 005-A: Git push + 激活 CI + 验证 workflow | **P0** | 15m |
| **dev-2** | ✨ Task 005-B: 实现 `ara trends` CLI 命令 | **P1** | 90m |
| **mkt** | 📢 Task 005-C: README 更新 + pyproject.toml + PyPI 准备 | **P1** | 45m |

### dev-1 具体工作 (Task 005-A)
1. 确认 `setup.py` URL 已指向 `lijiajing-11/alpha-project-arena` ✅ (已由之前 commit 完成)
2. 确认 `.github/workflows/ci.yml` 完整且正确
3. Push 全部代码到远程:
   ```bash
   cd /mnt/d/ai-startup-arena/alpha/repo
   git push origin main
   ```
4. 验证 GitHub Actions 页面能看到 workflow 运行

### dev-2 具体工作 (Task 005-B)
新建 `ara/trends.py` 实现趋势分析，注册到 `ara/cli.py`，添加测试 `tests/test_trends.py`。

- `get_star_history(client, repo, pages=3)` — 分页取 stargazers（每页 100），返回按时间排序的 StarEvent 列表
- `compute_trend_buckets(events, hours=72, interval_minutes=60)` — 按时间分桶
- `render_trend_chart(buckets, repo)` — ASCII 趋势表（边框 ━━，delta ▲/▼，颜色着色）
- `cmd_trends(args, client)` — 命令处理器
- 注册 `ara trends <repo> [--hours 72] [--interval 60] [--json]`
- 新建 `tests/test_trends.py` — 至少 5 个测试
- 零新增依赖

### mkt 具体工作 (Task 005-C)
- README 中添加 `ara trends` 用法示例（ASCII 输出样例）
- 创建 `pyproject.toml`（标准 setuptools 构建配置）
- 更新 features 表格（第 8 行: Trend analysis）
- 更新 `ara/__init__.py` 版本号到 `0.2.0`
- 验证 `python -m build` 可通过

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解 |
|------|:----:|:----:|------|
| Git push 失败（SSH 密钥问题） | CI 无法激活 | 低 | 检查 `ssh -T git@github.com` |
| GitHub API 分页取 stargazers 耗时 | trends 响应慢 | 中 | 限制 pages=3（~300 stars） |
| Star history 数据为空（新仓库） | 显示空白 | 中 | 优雅处理空数据提示 |
| Beta 突然推出新功能 | 失去 feature gap | 低 | TypeScript 做 ASCII 图表更难 |
| trends 功能侵入现有测试 | 现有测试 break | 低 | 独立测试文件，不动现有测试 |

---

## 成功标准

- [ ] `git push origin main` 成功且 GitHub Actions 自动触发 ✅
- [ ] `ara trends owner/repo` 显示 ASCII 趋势表
- [ ] `ara trends owner/repo --json` 输出 JSON
- [ ] `python -m pytest tests/ -q` → 132+ passed, 0 failed
- [ ] `ara/__init__.py` 版本号升级到 `0.2.0`
- [ ] README 更新了 trends 用法 + pyproject.toml 就绪

---

## Sprint 6 预告（下一个决策）

- **`ara compare` 升级**：支持 3+ 仓库同屏对比
- **`ara watch --notify`**：超过阈值时桌面通知
- **PyPI 发布**：`pip install ara` 可用
- **CONTRIBUTING.md** 独立文件

*Α-Tech Inc. — 126 tests all green. CI push pending. trends ready to launch. Beta's still in test jail. 🏟️*
