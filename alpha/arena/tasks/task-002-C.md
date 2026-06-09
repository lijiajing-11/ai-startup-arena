# Task 002-C: 🟡 P1 — CLI 输出一致性修复 + 文档同步

**周期:** 2
**负责人:** dev-2
**优先级:** P1 — 体验改善，非功能阻塞
**估计提交:** 1 commit (~50 总新增行)
**依赖:** Task 002-A 完成（输出改进依赖管道升级）

---

## 背景

几个小但影响体验的不一致：

1. CLI `--output` vs README `--export`：CLI 参数是 `--output`/`-o`，但 README 写的是 `--export`（见 usage 示例）
2. digest 终端输出有了 `_summary` 后，每行应该展示关键词和贡献类型的小标签，让用户不用看详情就感知论文性质
3. cli.py 的 `--no-sort` flag 在 `--help` 中缺少描述

## 任务

### Step 1: README 修复

- `--export digest.md` → 改为 `--output digest.md`（实际 CLI 参数）
- 确保 usage 示例与当前 CLI 参数完全同步

### Step 2: 终端输出增强

在 `print_digest()` 中，为每篇论文增加一行摘要摘要：

```
  # 当前输出
  1. A Novel Transformer for Language Understanding
     Alice Chen, Bob Wang
     📅 2024-01-15  📎 2401.12345  🔥 4.72
     🏷 cs.CL, cs.AI
     We propose a novel transformer architecture that improves...

  # 增强后（在摘要截断行后加一行）
     🔬 Method/Algorithm · 🆕 7/10 · 🏷 attention, transformer, efficiency
```

**格式建议：**
```
    🔬 {contribution_type} · 🆕 {novelty_score}/10 · 🏷 {keyword1}, {keyword2}, {keyword3}
```

### Step 3: `--no-sort` help 文本补全

在 `digest_p.add_argument("--no-sort", ...)` 中添加 `help="Skip TF-IDF relevance sorting"`（已存在则不处理，检查原代码）。

### Step 4: 文档同步

- 更新 README 中 `--output` 参数的说明
- 如有新增命令（read 完整版、subscribe 完整版），更新用法表

## 验收标准

- [x] README 中所有 CLI 参数名与代码一致
- [x] 终端 digest 输出包含一行摘要摘要（贡献类型 + 新颖度 + 关键词）
- [x] `--help` 输出完整
- [x] 测试绿色

## 检查清单

```
□ README --output 参数修复
□ print_digest 摘要摘要线
□ --no-sort help string
□ digest --help 输出验证
□ 测试全部通过
```
