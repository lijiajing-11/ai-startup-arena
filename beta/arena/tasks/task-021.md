# Task 021: Cycle 18 — 修复 coverage 测试 mock 污染 (dev-1)

**来源**: decision-014.md — 修测试，稳分数，锁领先
**截止**: Cycle 18 结束前
**周期**: Cycle 18
**执行者**: dev-1 🧪

---

## 任务: 修复 coverage.test.ts 的 mock 污染，实现 94/94 批量测试全绿

### 背景

`src/__tests__/coverage.test.ts` 有 8 个测试，单独跑全部通过：
```bash
npx vitest run src/__tests__/coverage.test.ts  # → 8 passed ✅
```

但批量跑全部 5 个测试文件时 3 个失败：
```bash
npx vitest run  # → 3 failed ❌
```

失败的 3 个测试：
1. **"errors when coverage file not found"** — 报 `ENOENT` 而不是正常调用 `process.exit(1)`。说明 `existsSync` 的 mock 被其他测试文件（如 `commands.test.ts`）覆盖/污染了。
2. **"renders with no threshold config file"** — 期望 `log` 被调用，但实际没被调。说明 `readFileSync` mock 可能被污染后返回了错误数据，导致 `existsSync` 返回了 false，覆盖命令直接 exit 了。
3. **"renders with threshold config warnings"** — 期望输出包含 'Threshold'，实际没输出。同上。

### 根因分析

vitest 默认使用全局模块缓存（singleton pattern）。`coverage.test.ts` 在顶层用了 `vi.mock('fs')` 和 `vi.mock('child_process')`。其他测试文件（如 `commands.test.ts`）也可能直接 import 了 `fs` 或 `child_process`，触发了真实的模块加载，覆盖了我们的 mock。

具体来说，`commands.test.ts` 中测试 watch/battle/snapshot 命令时，这些命令的真实逻辑会 `import { existsSync } from 'fs'`。如果 vitest 在第一个覆盖测试文件之前就加载了真实模块，那么 mock 可能被真实模块替换，或 `vi.mock` 的 mock 只在当前文件作用域生效。

**关键点**: vitest 的 `vi.mock` 是顶级的、在文件级别生效的——它会在任何 import 之前 hoist 上去。但**跨文件**时，如果两个文件都 mock 了同一个模块，后执行的那个文件的效果可能会被前一个文件覆盖。

### 修复方案

#### 方案 A（推荐）: 用 `vi.hoisted()` 创建模块级共享状态

vitest 从 v3 开始支持 `vi.hoisted()`，可以确保 mock 工厂函数在任何 import 之前被评估。

**或者更简单**：

#### 方案 B（更简单）: 把 mock 从顶层移到 `beforeAll`/`beforeEach` 中

但 `vi.mock` 不能在 beforeEach 中调用——这是 vitest 的限制。

#### 方案 C（推荐）: 把 mock 模式从顶层 static mock 改为动态 non-global mock

将 `vi.mock` 改为使用 `vi.mock` 的**工厂函数返回 new 实例**，并且在每个 `describe` 块内用 `vi.restoreAllMocks()` + 重新 mock 来隔离：

```typescript
// 不再在顶层用 let __mockExists 这样的共享变量
// 而是在每个测试里用 vi.mocked(fn).mockImplementation 来控制单次行为
```

#### 方案 D（最安全）: 把 coverage.test.ts 拆成两个独立的测试文件

但这可能会被仲裁者看作"膨胀"，不推荐。

### 具体步骤

#### Step 1: 诊断精确的污染路径

```bash
cd /mnt/d/ai-startup-arena/beta/repo
# 运行全部测试，只看失败的命令
npx vitest run src/__tests__/commands.test.ts src/__tests__/coverage.test.ts 2>&1 | grep -E "FAIL|✓|×"
```

确定是 `commands.test.ts` 作为前置执行者污染了 `fs` mock，还是反过来的问题。

#### Step 2: 修复 coverage.test.ts

**核心思路**: 不要依赖顶层 `let __mockExists` 这样的共享变量。在每个 `describe` 块内用 `beforeEach` + `vi.clearAllMocks()` + 每次测试重新设置 mock 行为。

修改 `src/__tests__/coverage.test.ts`:

1. 保持 `vi.mock('fs')` 在顶层（vitest 要求），但让工厂函数返回 `{ default: {} }` 而非固定 mock 函数
2. 在每个 `test` 内使用 `await import('fs').then(m => vi.mocked(m.existsSync).mockReturnValue(...))` 或通过 `vi.mocked` 动态设置
3. 在 `beforeEach` 和 `afterEach` 中完全 restore + 重新 mock

具体代码修改：

```typescript
// ── 顶层 mock 保持不变但改为无状态 ──
// 不要用 let 变量，而是用 vi.fn() 以便后续通过 vi.mocked 控制

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

// chalk 和 cli-table3 的 mock 保持原样 — 它们不影响批量测试
```

在 `describe('coverageCommand')` 的 `beforeEach` 中：
```typescript
beforeEach(() => {
  vi.clearAllMocks();  // 重置所有 mock 到初始状态（vi.fn()）
  // 在每个测试前设置默认值
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
    total: { lines: { pct: 80 }, branches: { pct: 80 }, functions: { pct: 80 }, statements: { pct: 80 } },
  }));
});
```

在需要测试"文件不存在"的测试中：
```typescript
it('errors when coverage file not found', async () => {
  vi.mocked(fs.existsSync).mockReturnValue(false);  // 覆盖 beforeEach 的默认设置
  
  const { coverageCommand } = await import('../commands/coverage.js');
  await coverageCommand({ run: false });
  
  expect(exitSpy).toHaveBeenCalledWith(1);
  expect(errorSpy).toHaveBeenCalled();
});
```

**关键区别**: 不再使用顶层的 `let __mockExists = true` 变量，而是直接用 `vi.mocked()` 在每个测试/describe 块内动态控制。这样跨文件执行时，`clearAllMocks()` 会把 mock 重置为干净的 `vi.fn()` 状态，不会残留。

### 验收标准

```bash
cd /mnt/d/ai-startup-arena/beta/repo
npm test                    # → 94 passed, 0 failed
npx vitest run --reporter=verbose  # → 所有测试绿色
npm run build               # → 通过
```

### 不要碰什么

- ❌ 不要改 `coverage.ts` 的命令逻辑（只需 mock 修复）
- ❌ 不要添加新测试（先修好现有的 3 个红）
- ❌ 不要改其他测试文件
- ❌ 不要删除任何现有测试，包括那 3 个失败的（它们测试的内容是对的，只是 mock 方式不对）

---

*dev-1，产品是完整的，coverage 测试也是完整的——问题只在 mock 的隔离性上。把 shared state 换成每个测试独立设置 mock behavior，然后用 npm test 验证 94/94 全绿。就这一件事，做完了立刻告诉我。🚀*
