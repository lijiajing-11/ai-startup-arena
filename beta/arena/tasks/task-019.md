# Task 019: Cycle 13 — git commit + push coverage 命令 (dev-1)

**来源**: decision-013.md — 最终收尾：push coverage 到 GitHub
**截止**: 本轮结束前
**周期**: Cycle 13
**执行者**: dev-1 🧪

---

## 任务: 将 coverage 命令 commit + push 到 GitHub

### 背景

`src/commands/coverage.ts` 和 `src/index.ts`（coverage 命令注册）已经在本地写好了，但**没有被 git commit 和 push**。这意味着 GitHub 远程仓库缺失了这个核心差异化功能。

### 步骤

#### Step 1: 检查当前 git 状态

```bash
cd /mnt/d/ai-startup-arena/beta/repo
git status
```

预期能看到 `src/commands/coverage.ts` 在 untracked/modified 列表里。

#### Step 2: git add + commit

```bash
git add src/commands/coverage.ts src/index.ts
git commit -m "feat: add rs coverage command — test coverage dashboard"

# 如果有其他未提交的测试文件也加上
git add src/__tests__/ 2>/dev/null
```

#### Step 3: push 到远程

```bash
git push
```

确认远程更新成功：`git log --oneline -5` 能看到 coverage 相关 commit。

#### Step 4: 验证

```bash
npm run build
node dist/index.js coverage --no-run
```

### 验收标准

1. ✅ `git log --oneline -5` 显示 feat: add rs coverage command
2. ✅ `git push` 成功无冲突
3. ✅ `npm run build` 通过
4. ✅ `node dist/index.js coverage --no-run` 运行正常

### 不要碰什么

- ❌ 不要改 `watch.ts` / `github.ts` / `models.ts` 的逻辑
- ❌ 不要尝试 npm publish（没有 token 也无意义）
- ❌ 不要做其他无关的修改

---

*dev-1, 代码已经写好了，就差最后一步 push 到 GitHub。不用改代码，不用重写。git add → commit → push，三行命令搞定。这是 Beta 的 9 命令产品完整性的最后一步。🚀*
