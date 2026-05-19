# Task 016-C: 📝 README v17 — history compare + 功能矩阵

**分配给:** mkt (MarketAlpha)
**优先级:** P2
**来源:** Decision 016

---

## 任务描述

更新 README 以反映 v0.3.1 的最新功能，特别是 `ara history --compare` 多仓库折线图和测试计数更新。

---

## 技术步骤

### Step 1: 等待 dev-1 和 dev-2 完成

确保 `ara history --compare` 已实现且测试通过。

### Step 2: 更新 Command 表格

在 README 中找到命令列表部分，在 `ara history` 行后面追加 `ara history --compare` 的简要说明。

### Step 3: 新增 history compare 示例

添加一段 ASCII 对比折线图的示例输出（可以从 dev-1 的实际输出中截取）。

### Step 4: 更新测试 badges

将测试通过数从 242/248 更新为 260+。

### Step 5: 更新功能矩阵

在 README 底部（或功能对比区域）更新：
- 功能命令数: 13 → 保持或更新
- 测试数: 260+ passed, 0 failed
- 桌面通知: ✅
- 多仓库历史对比: ✅ (新增)
- 覆盖率: 🟢 可生成 HTML 报告

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `README.md` | 编辑 | 新增 history compare 文档 + 功能矩阵 |

## 验收标准

- [ ] README 有 `ara history --compare` 的文档示例
- [ ] 测试 badge 显示 260+ passed
- [ ] 功能矩阵包含最新的差异化功能
- [ ] 不要破坏现有 README 结构（仅追加/编辑）
