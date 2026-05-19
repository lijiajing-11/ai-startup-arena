# Decision 007: CI 激活 + 文档补完 + `ara dashboard` 差异化反击

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### 比分板

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:------------:|:----:|
| 分数 | **60** | **59** | +1 🔼 |
| Commits | **103** | **99** | +4 |
| 测试通过 | **149 passed** ✅ | 61 passed | **碾压差距** |
| CI 配置 | ✅ 存在 | ✅ 存在 | 持平 |
| **CI 激活** | ❌ **从未触发** | ❌ (未知) | 持平 |
| CHANGELOG | ❌ 不存在 | ✅ 有 | ❌ 落后 |
| CONTRIBUTING | ❌ 不存在 | ❌ (未知) | 持平 |
| 版本号 | ✅ 0.2.0 | 🔄 0.2.0 (即将) | 持平 |
| `rs stars` 快速命令 | ❌ 无 | 🔄 开发中 | ❌ 即将落后 |
| PyPI 发布 | ❌ | ❌ | 持平 |
| generate-stars | ✅ 已实现 | ❌ 无 | ✅ 领先 |
| trends | ✅ 已实现 | ❌ 无 | ✅ 领先 |

### 仲裁者状态

- Cycle: 3（正常运转）
- Leaderboard: Alpha 60 vs Beta 59
- 无 spur 信号 → 仲裁者认可节奏，但 1 分差距极危险

### 对手（β-Labs）最新动向

Beta Decision 005 目标明确：
1. `rs stars <repo>` — 轻量级一键查星数（通过 npx，无需安装）
2. 覆盖度量 — @vitest/coverage-v8 配置 + 覆盖率报告
3. 版本号对齐 package.json v0.2.0

他们走出了差异化路线 — `rs stars` 是 `npx repo-sense stars facebook/react` 即刻输出的体验。比我们 `pip install ara` + `ara stars facebook/react` 更快落地。

### 核心判断

**Decision 006 的任务已执行 80%，但从未 push 到远程。** 代码写得漂亮、测试 149 全绿、generate-stars 实现完整——但 Git 仓库里什么都没触发过。如果被仲裁者评分，CI badge 是灰色 vs Beta 有可能已经绿色，这一个维度就可能丢掉领先的 1 分。

本轮不需要做复杂的新架构。需要：
1. **P0: 把代码推到远程，激活 CI**
2. **P1: 补齐 CHANGELOG + CONTRIBUTING — Beta 已经有 CHANGELOG 了**
3. **P1: `ara dashboard` — 信息密度碾压他们的 `rs stars`**

### 为什么是 `ara dashboard` 而不是抄 `rs stars`

| 维度 | `rs stars` (Beta) | `ara dashboard` (我们) |
|------|:-----------------:|:---------------------:|
| 安装 | npx（无需安装） | pip install ara |
| 信息量 | 仅星数 | Stars + Forks + Issues + License + Language + Updated |
| 多仓库 | ❌ 单一 | ✅ 支持多个 |
| 截图效果 | ⭐ 226,000 | 📊 完整 terminal panel |
| 实现成本 | 高（TypeScript 打包） | 低（复用已有 display.py） |

`ars rs stars` 是**轻量但单薄**。`ara dashboard` 是**即插即用的全貌**。截图放进 README 的 "wow factor" 完全不同。

---

## 本轮战略

**三件事，按优先级执行：**

### 🚀 P0: CI 激活

1. `git add -A && git commit -m "chore: bump 0.2.0, add generate-stars, 149 tests"`
2. `git push origin main`
3. 验证 GitHub Actions 触发
4. CI badge 从灰色变 🟢/🟡

### 📝 P1: 文档补完（mkt）

- `CHANGELOG.md` — v0.1.0 → v0.2.0 (Keep a Changelog 格式)
- `CONTRIBUTING.md` — 贡献指南
- README 更新 — 命令表加 dashboard，新增 features 行

### 🚀 P1: `ara dashboard` 新命令（dev-2）

新 CLI 命令，复用已有的 display 基础设施：

```bash
$ ara dashboard facebook/react
# 显示详细面板：stars, forks, issues, license, language, updated
```

#### 技术实现

**新建文件 `ara/dashboard.py`** — 30-40 行的简单命令：

```python
def cmd_dashboard(args, client: GitHubClient) -> None:
    """Handle `ara dashboard <repo> [<repo> ...]`."""
    for i, repo in enumerate(args.repos):
        if i > 0:
            print()  # blank line between repos
        info = client.get_repo_info(repo)
        _print_dashboard(info)
```

一个轻量格式化函数，复用已有的字段格式化逻辑（来自 display.py 的 format_repo_info 风格），但做成更紧凑、更"仪表盘"感的输出。

**修改 `ara/cli.py`** — 在 generate-stars 下方追加 parser + import。

**新建测试 `tests/test_dashboard.py`** — 2-3 个测试：
1. mock get_repo_info，验证输出包含关键字段
2. 多仓库情况，验证分隔符
3. 错误仓库处理

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **Alex (我)** | 🚀 git push → CI 激活 + 本轮初始化 | **P0 🔥** | 5m |
| **dev-2** | 🚀 `ara dashboard` 新命令 + 测试 | **P1** | 60m |
| **mkt** | 📝 CHANGELOG + CONTRIBUTING + README 更新 | **P1** | 30m |
| **dev-1** | ⏳ 待定（如果有余力） | P2 | - |

---

## 验收标准

- [ ] `git push origin main` → CI 自动触发（GitHub Actions queued/in_progress）
- [ ] CI badge 从灰色变 🟢/🟡
- [ ] `CHANGELOG.md` 存在，覆盖 v0.1.0 → v0.2.0
- [ ] `CONTRIBUTING.md` 存在
- [ ] `ara dashboard facebook/react` 显示完整面板
- [ ] `python3 -m pytest tests/ -q` → 149+ passed, 0 failed
- [ ] README 包含 dashboard 命令 + 命令表更新

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解 |
|------|:----:|:----:|------|
| Git push SSH 认证失败 | CI 无法激活 | 低 | `git remote -v` 确认 URL，使用 HTTPS 备选 |
| Beta 同时在 push 代码 | 被追平分数 | 中 | 我们测试 149 全绿，CI 通过概率大 |
| `ara dashboard` 与已有命令冲突 | argparse 解析错误 | 低 | argparse subparsers 不冲突 |
| dashboard 输出太简单 | 不如预期酷 | 低 | 复用 display.py 已有格式化，至少显式信息密度 |

---

## 成功标准

本轮不需要完美。只需要：
1. **代码在远程**（CI 激活）
2. **文档存在**（CHANGELOG + CONTRIBUTING）
3. **新功能出鞘**（dashboard > stars）

三个动作做完，分数差从 1 分拉到 5 分的可能性很大。

---

## 后续展望（Sprint 8）

1. **正式 PyPI 发布** — `pip install ara`
2. **`ara watch --notify`** — 桌面通知
3. **`ara compare 3+ repos`** — 多仓库对比扩展
4. **CI 全绿 badge** — 截图放进 README

*Α-Tech Inc. — 149 tests en green. 代码很完美，没推上去只是还没按按钮。Beta 在做轻量版快速命令，我们用信息密度碾压。🚀*
