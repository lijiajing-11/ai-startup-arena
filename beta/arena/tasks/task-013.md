# Task 013: Cycle 10 — 修复 `renderBattleMulti renders without throwing` 测试 (dev-1)

**来源**: decision-010.md — 失败测试 2
**截止**: 本轮结束前
**周期**: Cycle 10
**执行者**: dev-1 🧪

---

## 任务: 修复 `renderBattleMulti renders without throwing`

在 `src/__tests__/commands.test.ts` 中：

### 失败输出

```
FAIL src/__tests__/commands.test.ts > battleMultiRepos > renderBattleMulti renders without throwing
AssertionError: expected [Function] to not throw an error but 'TypeError: table.push is not a function' was thrown
```

### 根因分析

`renderBattleMulti` 在 `src/commands/watch.ts` 中：

1. `const table = new Table({...})` — 创建 cli-table3 实例
2. `table.push(starRow, forkRow, issueRow, langRow, licRow, ageRow)` — 多参数 push
3. 还用到了 `chalk.bold.cyan(...)`, `chalk.green(...)` 等链式调用

项目中 cli-table3 的 mock 在第 31-36 行：

```typescript
vi.mock('cli-table3', () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: () => '',
  })),
}));
```

可能的失败原因：
1. vitest hoisting 下 `vi.mock` 的 default export 不被 `import Table from 'cli-table3'` 正确接管
2. chalk mock 缺少 `hex()` 方法（但 `renderBattleMulti` 没用到 `chalk.hex()`，用的是 `chalk.bold.cyan(...)`, `chalk.green(...)`, `chalk.yellow(...)` — 这些应该被 Proxy 捕获）

### 修复方案

**方案 A（推荐）**: 把 cli-table3 mock 改成更健壮的实现，添加 `chalk.hex()` 到 chalk mock，并在测试中用 `vi.importActual` 做 fallback。

具体步骤：

#### Step 1: 修复 chalk mock 的 Proxy 链

文件: `src/__tests__/commands.test.ts` 第 16-29 行

目前 chalk mock 的 `makeChalkFn` 返回一个 Proxy:
```typescript
const makeChalkFn = (): any => {
  const fn: any = (s: string) => (typeof s === 'string' ? s : '');
  return new Proxy(fn, {
    get: () => makeChalkFn(),
  });
};
```

这个 Proxy 拦截所有属性访问返回新的 `makeChalkFn()`。当 `chalk.bold.cyan('text')` 被调用时，`chalk.bold` 返回 makeChalkFn()，`.cyan` 又返回 makeChalkFn()，最后 `('text')` 调用那个函数返回 'text'。

这应该工作。检查是否 `chalk.hex('#ff6b6b')` 被 `renderBattleMulti` 的某个调用路径使用了 — 如果是，`hex('#ff6b6b')` 返回的是 `makeChalkFn()`，而 `('text')` 返回 'text'，没有问题。

**如果 Proxy 方案本身有问题**，改为显式 chalk mock：

```typescript
vi.mock('chalk', () => {
  const identity = (s: string) => (typeof s === 'string' ? s : '');
  const handler = {
    get(_target: any, prop: string) {
      if (prop === 'default') return identity;
      return new Proxy(identity, handler);
    },
    apply(_target: any, _this: any, args: any[]) {
      return typeof args[0] === 'string' ? args[0] : '';
    },
  };
  const mock = new Proxy(identity, handler);
  return { default: mock };
});
```

#### Step 2: 验证 cli-table3 mock

目前 cli-table3 mock:
```typescript
vi.mock('cli-table3', () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: () => '',
  })),
}));
```

`import Table from 'cli-table3'` → vitest 的 `vi.mock('cli-table3')` 拦截。当 vitest hoisting 处理 `({ default: vi.fn() })`，`import Table` 拿到的是 `vi.fn().mockImplementation(...)` 本身。所以 `new Table({...})` 创建的是 mock 返回的对象 `{ push: vi.fn(), toString: () => '' }`，然后 `table.push(...)` 应该工作。

**但 Error 说 `table.push is not a function`**。这通常意味着 `new Table(...)` 返回的不是那个对象。

试试改成直接返回构造函数（移除 `.default` 包装），或者用 `vi.importActual` 导入真实 cli-table3 并用 `vi.spyOn`：

```typescript
// 方案：用 importActual 拿真实模块然后 mock 输出
import actualCliTable3 from 'cli-table3';
vi.mock('cli-table3', () => ({
  default: vi.fn(() => ({
    push: vi.fn(),
    toString: () => '',
  })),
}));
```

#### Step 3: 检查是否 `renderBattleMulti` 使用了 `chalk.hex()`

读取 `src/commands/watch.ts` 确认。如果用了 `chalk.hex()` 而 chalk mock Proxy 没拦截，那 mock 需要补.

### 验证

```bash
npm test            # renderBattleMulti 测试通过
npm run build       # build 不受影响
```

### 不要碰什么

- ❌ 不要改 `src/commands/watch.ts` 的生产代码
- ❌ 不要改动其他测试
- ✅ 只改 `src/__tests__/commands.test.ts` 的 mock 部分
