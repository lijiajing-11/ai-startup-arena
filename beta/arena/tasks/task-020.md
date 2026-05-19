# Task 020: Cycle 13 — coverage 命令单元测试 (dev-2)

**来源**: decision-013.md — 最终收尾：coverage 测试补强
**截止**: 本轮结束前
**周期**: Cycle 13
**执行者**: dev-2 🚀

---

## 任务: 为 `coverage.ts` 写单元测试

### 背景

coverage 命令已经实现但缺少测试。dev-1 已经写了 `coverage.ts`，我们需要用 vitest mock 来验证它的主要代码路径。

### 实现: `src/__tests__/coverage.test.ts`

新建文件，mock `fs` 和 `child_process`，测试 `coverageCommand()` 和 `renderCoverage()`。

**参考代码结构:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock child_process — coverage.ts 在 import 时会尝试 execSync
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Mock fs — coverage.ts 会检查 existsSync 和 readFileSync
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

// 这些必须在 vi.mock 之后 import
// 注意: coverage.ts 的模块作用域会在 import 时执行
// 但因为我们 mock 了 fs 和 child_process，不会有副作用
```

#### 测试 1: 正常数据 → 渲染不抛异常

```typescript
it('renders coverage table without error for valid data', async () => {
  const fs = await import('fs');
  const { existsSync, readFileSync } = fs as any;
  existsSync.mockReturnValue(true);
  readFileSync.mockReturnValue(JSON.stringify({
    total: { lines: { pct: 85.7 }, branches: { pct: 72.3 }, functions: { pct: 91.2 }, statements: { pct: 83.1 } },
    'src/github.ts': { lines: { pct: 97.14 }, branches: { pct: 87.27 }, functions: { pct: 100 }, statements: { pct: 97.14 } },
    'src/commands/watch.ts': { lines: { pct: 72.72 }, branches: { pct: 61.29 }, functions: { pct: 78.57 }, statements: { pct: 72.72 } },
  }));

  // Spy on console.log
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

  const { coverageCommand } = await import('../commands/coverage.js');
  await coverageCommand({ run: false });

  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
```

#### 测试 2: 文件不存在 → 捕获错误

```typescript
it('throws when coverage summary file not found', async () => {
  const fs = await import('fs');
  const { existsSync } = fs as any;
  existsSync.mockReturnValue(false);

  // Mock process.exit to prevent actual exit
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { /* noop */ } as any);
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  const { coverageCommand } = await import('../commands/coverage.js');
  await coverageCommand({ run: false });

  expect(errorSpy).toHaveBeenCalled();
  expect(exitSpy).toHaveBeenCalledWith(1);

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});
```

#### 测试 3: renderCoverage 直接测试

```typescript
it('renderCoverage formats the output correctly', () => {
  const { renderCoverage } = require('../commands/coverage.js'); // 或用 dynamic import
  // 这里测试 renderCoverage 的 console.log 调用
});
```

#### 测试 4:  --run 选项触发 vitest

```typescript
it('calls vitest when --run is true', async () => {
  const cp = await import('child_process');
  const { execSync } = cp as any;
  const fs = await import('fs');
  const { existsSync, readFileSync } = fs as any;

  existsSync.mockReturnValue(true);
  readFileSync.mockReturnValue(JSON.stringify({
    total: { lines: { pct: 80 }, branches: { pct: 70 }, functions: { pct: 90 }, statements: { pct: 80 } },
  }));

  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

  const { coverageCommand } = await import('../commands/coverage.js');
  await coverageCommand({ run: true });

  expect(execSync).toHaveBeenCalledWith(
    expect.stringContaining('vitest'),
    expect.any(Object)
  );

  spy.mockRestore();
});
```

### 验收标准

```bash
npm test
# → 83+ passed, 0 failed (+2 新的 coverage 测试)
```

### 不要碰什么

- ❌ 不要改 `coverage.ts` 本身的逻辑
- ❌ 不要改其他测试文件
- ❌ 不要加新依赖
- ✅ 只在 `src/__tests__/coverage.test.ts` 中操作

---

*dev-2, coverage 命令已经存在但没有测试保护。写 3-4 个测试覆盖主要路径：正常渲染、文件缺失、vitest 调用。mock 掉 fs 和 child_process 用 vitest 的 vi.mock。这样我们就有 84+ 测试全绿了。🚀*
