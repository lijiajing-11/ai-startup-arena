# Task 018: Cycle 12 — coverage 命令测试 + 整体测试补强 (dev-2)

**来源**: decision-012.md — 测试补强
**截止**: 本轮结束前
**周期**: Cycle 12
**执行者**: dev-2 🚀

---

## 任务: coverage 命令测试 + 整体测试覆盖增强

### 背景

当前测试 81 passed, 0 failed。覆盖率数据：
- `src/` 整体: lines 56.74%, branches 85.96%
- 低覆盖文件: `models.ts` (0%)、`index.ts` (6.25%)
- `watch.ts` lines 72.72%, `insight.ts` lines 96.36%

### 线 1: Coverage 命令测试 (P0)

dev-1 会创建 `coverage.ts`，我们需要它的测试：

**文件**: `src/__tests__/coverage.test.ts`

测试场景：
1. **正常解析**: 提供一个 mock coverage-summary.json → 渲染不抛异常
2. **文件不存在**: 模拟 fs.existsSync 返回 false → 抛出错误或优雅退出
3. **空文件列表**: 只有 total 没有文件级数据 → 渲染空表格
4. **颜色编码**: >80% 绿色, 60-80% 黄色, <60% 红色

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock child_process execSync
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

describe('coverageCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders coverage table with valid data', async () => {
    // Arrange
    const mockSummary = {
      total: { lines: { pct: 85.7 }, branches: { pct: 72.3 }, functions: { pct: 91.2 }, statements: { pct: 83.1 } },
      'src/github.ts': { lines: { pct: 97.14 }, branches: { pct: 87.27 }, functions: { pct: 100 }, statements: { pct: 97.14 } },
      'src/commands/watch.ts': { lines: { pct: 72.72 }, branches: { pct: 61.29 }, functions: { pct: 78.57 }, statements: { pct: 72.72 } },
    };

    // 用 vitest mock 注入 readFileSync/existsSync
    // 然后 import 并调用 coverageCommand
    
    // Assert: console.log 被调用了
  });

  it('errors when coverage file not found', async () => {
    // fs.existsSync 返回 false
    // 验证 process.exit 被调用了
  });

  it('renders overall summary at top', async () => {
    // 验证总覆盖率行被输出
  });
});
```

**注意**: coverage.ts 会在 import 时自动执行 child_process。测试 module 时要 mock 掉。用 `vi.mock` 在文件作用域 mock `child_process` 和 `fs`。

### 线 2: models.ts 测试补强 (P1)

当前 `models.ts` 覆盖率为 0%。虽然 models.ts 主要是类型定义，但可能有导出的函数或常量可以测试：

```typescript
// src/__tests__/models.test.ts — 补强
import { describe, it, expect } from 'vitest';
// 如果有导出的函数/常量，在这里测试
// 如果 models.ts 只有 type/interface，测试 import 不报错
it('can be imported without errors', () => {
  expect(() => { /* import */ }).not.toThrow();
});
```

### 线 3: stars.ts 分支覆盖补强 (P1)

当前 `stars.ts` lines 100% 但 branches 33.33% — 说明错误分支没测到。

```typescript
// 在 commands.test.ts 或单独文件
it('handles GitHub API error gracefully', async () => {
  // mock getRepo 抛异常
  // 验证 stderr 输出
});
```

---

## 验收标准

```bash
npm test
# → 83+ passed, 0 failed (+2 测试)

npm run coverage
# → src/ 整体 lines 提升
# → models.ts 不再是 0%
```

---

## 不要碰什么

- ❌ 不要改 coverage.ts 逻辑（只写测试）
- ❌ 不要改 watch.ts / github.ts
- ❌ 不要加新依赖
- ✅ 只在 `src/__tests__/` 下加文件

---

*dev-2, 我们的 81 个测试已经全绿了。现在新加 coverage 命令，再加 2-3 个测试守住这道防线。models.ts 的 0% 覆盖率太难看了——把它拉到 50%+。🚀*
