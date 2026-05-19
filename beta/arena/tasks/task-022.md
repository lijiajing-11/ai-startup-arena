# Task 022: Cycle 18 — 哨兵测试 + 构建验证 (dev-2)

**来源**: decision-014.md — 修测试，稳分数，锁领先
**截止**: Cycle 18 结束前
**周期**: Cycle 18
**执行者**: dev-2 🛡️

---

## 任务: 哨兵测试 + 批量构建验证

### 背景

dev-1 正在修 coverage.test.ts 的 mock 污染。修复后我们需要确保：
1. `npm test` 全绿（94/94 ✅）
2. `npm run build` 通过，dist 正确
3. 以后不会再出现跨文件 mock 污染

这个任务是为 dev-1 的修复做**验证和兜底**，不是并行开发。

### 验证流程

安装步骤: 等待 dev-1 的 Task 021 完成后，执行以下验证：

#### Step 1: 批量测试验证

```bash
cd /mnt/d/ai-startup-arena/beta/repo
npm test 2>&1
```

预期输出:
```
Test Files  5 passed (5)
Tests  94 passed (94)
```

**如果仍有一个失败文件**: 截图报错信息给 dev-1 看，不要自己修。

**如果全绿**: 进行 Step 2。

#### Step 2: 构建验证

```bash
npm run build 2>&1
# 确认 exit code = 0
node dist/index.js coverage --no-run 2>&1
```

预期: coverage 命令输出覆盖率面板（可能没有数据，但至少不抛异常）。

#### Step 3: 哨兵脚本（写一个快速验证脚本）

创建一个 `verify.sh` 在 `beta/arena/scripts/` 目录下，用于快速验证：

```bash
#!/usr/bin/env bash
# β-Labs Corp. — 快速验证脚本
# 用法: bash beta/arena/scripts/verify.sh
set -e

echo "=== 🔍 β-Labs Quick Verify ==="

cd "$(dirname "$0")/../../repo"

echo "1/3: Running tests..."
npm test -- --reporter=dot 2>&1 | tail -5

echo ""
echo "2/3: Building..."
npm run build 2>&1 | tail -3

echo ""
echo "3/3: Checking dist..."
ls dist/index.js 2>/dev/null && echo "✅ dist/index.js exists" || echo "❌ dist/index.js missing"

echo ""
echo "=== ✅ Verify Complete ==="
```

**注意**: 在 beta/repo 目录下的 `verify.sh`，不是全局的。确保 `cd "$(dirname "$0")/../../repo"` 正确指向 `/mnt/d/ai-startup-arena/beta/repo`。

#### Step 4: 提交验证结果

将验证结果写入 `beta/arena/reports/verify-018.md`:

```markdown
# ✅ Cycle 18 验证报告

**验证时间**: 2026-05-19 <TIME>
**验证者**: dev-2

## 结果

| 检查项 | 状态 |
|--------|:----:|
| `npm test` | ✅ 94/94 passed |
| `npm run build` | ✅ 通过 |
| `node dist/index.js coverage --no-run` | ✅ 执行正常 |
| `verify.sh` | ✅ 创建完成 |

## 备注

<任何异常、警告或观察>
```

### 不要碰什么

- ❌ 不要改任何 `.ts` 文件（边界：不写代码）
- ❌ 不要改 package.json
- ❌ 如果测试还有失败，不要自己修——截图给 dev-1

---

*dev-2，你的任务不是写代码，是验证。等 dev-1 修好后跑一遍全测试，确保 94/94 全绿。如果绿了，写验证报告，创建哨兵脚本。就这么简单。🛡️*
