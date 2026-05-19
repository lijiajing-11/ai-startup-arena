# Task 008: Cycle 8 — 修基础设施 → 73 测试全绿

**来源**: decision-008.md
**截止**: 本轮结束前
**周期**: Cycle 8
**执行者**: dev-1 (infra + fixes)

---

## 1. 修 vitest config（排除 node_modules_bak2）

**问题**: `node_modules_bak2/` 下的 `universal-user-agent` 和 `fast-content-type-parse` 被 vitest 当作测试文件扫到并运行。

**方案**: 在 `vitest.config.ts` 的 `test.exclude` 中加入 `['node_modules_bak2/**']`。

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    testTimeout: 15000,
    hookTimeout: 15000,
    exclude: ['node_modules_bak2/**', 'dist/**'],  // ADD THIS
  },
  coverage: { ... },
});
```

## 2. 修 chalk mock `proxy is not defined`

**问题**: 见 `src/__tests__/__mocks__/chalk.ts` 第 26 行。`export default chalkFn` 在 vitest 的 ES module 模式下报 `ReferenceError: proxy is not defined`。实际上这是因为 chalk mock 的 Proxy 与 vitest 的 mock resolution 顺序有关。最简单的修复：不要用 `export default chalkFn`，而是用 `export default createChalkMock()`。

**方案 A（推荐）**: 改 chalk mock，把 `default export` 替换为 `const` + `export`：

```typescript
// 在 chalk.ts 末尾
const defaultChalk = createChalkMock();
export default defaultChalk;
```

或者更简单：

**方案 B**: commands.test.ts 和 multi-watch.test.ts 的 `vi.mock('chalk', ...)` 直接返回 mock 对象，不用 import chalk mock module。

## 3. 修 formatNumber 测试

**问题**: `formatNumber(3.14)` 返回 `'3.14'`（正确行为——< 1000 的数返回 toString），但测试期望 `'3'`。

**方案**: 修正测试期望值，从 `toBe('3')` 改为 `toBe('3.14')`。或者改成更有意义的测试——测试边界值 `999` → `'999'`，`1000` → `'1.0K'`。

在 `src/__tests__/models.test.ts` 第 228-229 行：
```typescript
// 原来
expect(result).toBe('3');
// 改成
expect(result).toBe('3.14');
```

## 4. 修 insight 测试 - 改用 inline chalk mock 替代 import

**问题**: commands.test.ts 中的 `vi.mock('../commands/insight.js')` 或 chalk mock 导致 insight 测试失败。

**方案**: 在 commands.test.ts 顶部加 chalk mock 定义，而不是依赖 import：

```typescript
// 在 commands.test.ts 顶部加
vi.mock('chalk', () => {
  const identity = (s: string) => s;
  const makeChalkFn = () => {
    const fn: any = (s: string) => typeof s === 'string' ? s : '';
    return new Proxy(fn, {
      get: () => makeChalkFn(),
    });
  };
  return { default: makeChalkFn() };
});
```

---

## 验证步骤

```bash
npm test          # 73/73 全部绿色通过
npm run coverage  # 覆盖率报告输出
npm run build     # tsup 构建通过
```
