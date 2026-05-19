# Task 002: 修复测试基础设施 + 补齐渲染测试

**来源**: decision-002.md
**截止**: 本轮结束前

## 给 dev-1: Mock 修复 + renderDashboard 测试

### 1. 修复 chalk mock

**文件**: `src/__tests__/commands.test.ts`

当前 chalk mock 只处理了一级调用（`chalk.cyan('text')`），不支持链式（`chalk.bold.cyan('text')`）。

改成 Proxy 递归模式：

```typescript
vi.mock('chalk', () => {
  const identity = (s: string) => s;
  identity.bold = identity;
  identity.cyan = identity;
  identity.red = identity;
  identity.green = identity;
  identity.yellow = identity;
  identity.gray = identity;
  identity.white = identity;
  identity.magenta = identity;
  identity.blue = identity;

  const handler: ProxyHandler<typeof identity> = {
    get: (target, prop) => {
      if (prop in target) return (target as any)[prop];
      // For arbitrary chained calls like chalk.bold.cyan('text') → chalk.cyan.bold(...)
      return identity;
    },
    apply: (target, thisArg, args) => {
      if (typeof args[0] === 'string') return args[0];
      return '';
    },
  };

  return new Proxy(identity, handler);
});
```

⚠️ 注意：`multi-watch.test.ts` 和 `commands.test.ts` 都有各自的 chalk mock —— **dev-2 会统一提取**，但你先修好 `commands.test.ts` 里的，确保 `renderBattle` 测试通过。

### 2. 修复 index.ts mock

**文件**: `src/__tests__/commands.test.ts`

当前 `vi.mock('../index.js', () => ({}))` 把 `run` 导出去掉了。

改为用 `importOriginal`：

```typescript
vi.mock('../index.js', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../index.js')>();
  return { ...mod, run: mod.run };
});
```

或者在不需要 mock index.ts 的地方直接去掉这个 mock（因为 index.ts 被 import 时自动调用 `run()` —— 但这个调用在 vitest 里会被拦截，因为 `run()` 内部没有异步逻辑需要长时间阻塞）。

> 更简单方案：直接用 `vi.mock('../index.js')` 不传 factory，让 vitest 自动 mock 所有导出为 spy。

### 3. renderDashboard 渲染测试

**文件**: `src/__tests__/commands.test.ts`（或者新建 `src/__tests__/watch.test.ts`）

需要加的测试：

```typescript
describe('renderDashboard', () => {
  const makeRepo = (overrides: Partial<RepoData> = {}): RepoData => ({
    owner: 'facebook',
    name: 'react',
    fullName: 'facebook/react',
    description: 'A UI library',
    language: 'TypeScript',
    license: 'MIT',
    stars: 100000,
    forks: 10000,
    openIssues: 500,
    createdAt: '2013-05-29T21:18:12Z',
    updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z',
    topics: [],
    homepage: null,
    defaultBranch: 'main',
    ...overrides,
  });

  it('renders dashboard without previous (initial state)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const snapshot: RepoSnapshot = { repo: makeRepo(), timestamp: new Date() };
    renderDashboard(snapshot);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('renders dashboard with delta display', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const current: RepoSnapshot = {
      repo: makeRepo({ stars: 100010 }),
      timestamp: new Date(),
    };
    const previous: RepoSnapshot = {
      repo: makeRepo({ stars: 100000 }),
      timestamp: new Date(Date.now() - 30000),
    };
    renderDashboard(current, previous);
    expect(logSpy).toHaveBeenCalled();
    // Verify delta was rendered (console.log called with delta content)
    logSpy.mockRestore();
  });

  it('handles null description/license/language', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const snapshot: RepoSnapshot = {
      repo: makeRepo({
        description: null,
        language: null,
        license: null,
      }),
      timestamp: new Date(),
    };
    expect(() => renderDashboard(snapshot)).not.toThrow();
    logSpy.mockRestore();
  });
});
```

### 4. 修复 renderBattle 的渲染测试（顺带）

确保 `renderBattle` 两个测试现在在 chalk mock 修复后可以通过。

## 给 dev-2: 共享 Mock + watchMultiRepos 修复 + withRetry 测试

### 1. 共享 chalk mock

**新建**: `src/__tests__/__mocks__/chalk.ts`

```typescript
import { vi } from 'vitest';

const identity = (s: string) => s;

// 支持 chalk.cyan, chalk.bold.cyan, chalk.bold.cyan.underline 等任意链式
const handler: ProxyHandler<typeof identity> = {
  get: (target, prop) => {
    if (prop === 'then' || prop === 'catch') return undefined; // not a Promise
    if (typeof prop === 'string' && prop in target) return (target as any)[prop];
    // For any chained property, return identity
    return identity;
  },
  apply: (target, thisArg, args) => {
    if (typeof args[0] === 'string') return args[0];
    return '';
  },
};

const chalk = new Proxy(identity, handler);
(chalk as any).default = chalk;

export default chalk;
export { chalk };
```

然后在各个测试文件中统一引用这个共享 mock。如果 vitest 不自动识别 `__mocks__/`，可以在 `vitest.config.ts` 里配 `setupFiles`。

### 2. 修复 watchMultiRepos 超时

**文件**: `src/__tests__/multi-watch.test.ts`

超时根因：`watchMultiRepos` 内部调用了 `renderMultiDashboard`，而 `renderMultiDashboard` 用了 `chalk.bold.cyan` —— 因为 chalk mock 不完整，这个调用抛异常了，导致内部 Promise 链不 resolve。

修复方法：
- 在 `multi-watch.test.ts` 里也把 chalk mock 升级到 Proxy 递归模式
- 或者等 dev-1 的共享 chalk mock 出来后引用

测试本身在 10000ms 超时是因为 `watchMultiRepos` 内部 `tick()` 抛出异常但没有 catch，导致 `setInterval` 的回调崩溃，外层的 `Promise` 永远不 resolve。

验证修复后这两个测试应该在 500ms 内通过。

### 3. renderMultiDashboard 渲染测试

**文件**: `src/__tests__/multi-watch.test.ts` 追加

```typescript
describe('renderMultiDashboard', () => {
  const makeRepo = (name: string, stars: number): RepoData => ({
    owner: 'test',
    name,
    fullName: `test/${name}`,
    description: null,
    language: 'TypeScript',
    license: 'MIT',
    stars,
    forks: Math.floor(stars / 10),
    openIssues: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z',
    topics: [],
    homepage: null,
    defaultBranch: 'main',
  });

  it('renders multi-dashboard without crashing', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const repos = [makeRepo('repo1', 1000), makeRepo('repo2', 500)];
    const { watchMultiRepos } = await import('../commands/watch.js');
    const abort = new AbortController();
    const promise = watchMultiRepos(['test/repo1', 'test/repo2'], 9999, false, abort.signal);
    await new Promise(r => setTimeout(r, 50));
    abort.abort();
    await promise;
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  }, 5000);
});
```

### 4. withRetry 独立测试

**文件**: `src/__tests__/github.test.ts` 追加

```typescript
describe('withRetry', () => {
  it('succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn, { maxAttempts: 3 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on retryable error then succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error('Rate limited'), { status: 429 }))
      .mockRejectedValueOnce(Object.assign(new Error('Server error'), { status: 500 }))
      .mockResolvedValueOnce('finally success');
    const result = await withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 });
    expect(result).toBe('finally success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('exhausts retries on persistent errors', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Server Error'), { status: 500 }));
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })).rejects.toThrow('Server Error');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry on non-retryable error (403)', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Forbidden'), { status: 403 }));
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })).rejects.toThrow('Forbidden');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 404', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Not Found'), { status: 404 }));
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })).rejects.toThrow('Not Found');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

⚠️ 注意：需要 `import { withRetry } from '../github.js'` —— `withRetry` 已经是导出的。

## 验收标准

1. `npm test` 全部通过，0 failed
2. 新增至少 8 个测试：renderDashboard(3) + renderMultiDashboard(1) + withRetry(5)
3. chalk mock 支持任意链式调用（chalk.red.bold, chalk.bold.cyan.bgGray 等）
4. index.ts 的 `run` 导出可被测试 import
