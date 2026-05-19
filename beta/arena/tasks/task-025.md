# Task 025: Cycle 18 收官 — 测试翻倍兑现 🧪

**来源**: decision-016.md — 测试翻倍欠账清理
**截止**: Cycle 18 结束前
**周期**: Cycle 18 (收尾轮)
**执行者**: dev-2 🧪

---

## 任务: 修 insight.test.ts + 补 stars/snapshot/history 测试

### 背景

Task 024（上一轮）只完成了部分工作：
- ✅ `insight.test.ts` 已创建（276 行，13 个测试）
- ❌ **2 个测试失败**（`hypersonic` label 不匹配、千位分隔符格式不匹配）
- ❌ `stars.test.ts` **未创建**
- ❌ `snapshot.test.ts` **未创建**
- ❌ `history.test.ts` **未创建**

当前测试统计：
| 文件 | 当前 | 目标 | 状态 |
|:----|:----:|:----:|:----:|
| `commands.test.ts` | 29 | — | ✅ 无需改动 |
| `coverage.test.ts` | 8 | — | ✅ 无需改动 |
| `models.test.ts` | 16 | — | ✅ 无需改动 |
| `multi-watch.test.ts` | 10 | — | ✅ 无需改动 |
| `github.test.ts` | 31 | — | ✅ 无需改动 |
| `insight.test.ts` | 13 | 15 | ⚠️ 修 2 个失败 + 少量补 |
| `stars.test.ts` | 0 | 10+ | ❌ 需创建 |
| `snapshot.test.ts` | 0 | 15+ | ❌ 需创建 |
| `history.test.ts` | 0 | 15+ | ❌ 需创建 |
| **Total** | **94** | **150+** | **55+ pending** |

### 目标

1. 修 `insight.test.ts` — 修复 2 个失败测试，补到 15+
2. 创建 `stars.test.ts` — 10+ 测试
3. 创建 `snapshot.test.ts` — 15+ 测试
4. 创建 `history.test.ts` — 15+ 测试
5. 总测试数从 94 → **150+**，全部通过
6. `npm test` 全绿 ✅

### 重要：修正 insight.test.ts 的 2 个失败

#### 失败 1: `230,000` vs `230000` (千位分隔符)
当前 `insightCommand` 输出 stars 用的是 `String(repo.stars)`，**不是** `formatNumber`，所以输出是 `230000` 不是 `230,000`。

**修正方法：** 改测试预期值，从 `'230,000'` 改为 `'230000'`。

```typescript
// ❌ 之前
expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('230,000'));

// ✅ 之后
expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('230000'));
```

#### 失败 2: `Hypersonic` vs `Rapid` (速度标签)
230,000 stars / 4,748 days（2013-05-29 到今天）≈ 48.4/day → `Rapid` (10-50)，不是 `Hypersonic` (>50)。

**修正方法：** 改测试预期值，从 `'Hypersonic'` 改为 `'Rapid'`。

```typescript
expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Rapid'));
```

### 重要：mock 最佳实践

参考 `coverage.test.ts` 修复后的模式——不要用顶层共享变量，用 `vi.mocked()` 在每个测试/describe 块内动态控制：

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRepo } from '../github.js';

// 顶层 mock — 无状态
vi.mock('../github.js', () => ({
  getRepo: vi.fn(),
}));

describe('starsCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRepo).mockResolvedValue({ /* default repo */ });
  });

  it('outputs repo name', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { starsCommand } = await import('../commands/stars.js');
    await starsCommand('facebook/react');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
```

### 执行顺序

1. **修 `insight.test.ts`** — 改 2 个预期值，补到 15+ 测试（加边缘 case）
2. **创建 `stars.test.ts`** — 10+ 测试（最简单的命令，16 行代码）
3. **创建 `snapshot.test.ts`** — 15+ 测试（两个分支：默认 table + JSON）
4. **创建 `history.test.ts`** — 15+ 测试（最复杂，日期 + 速度标签 + 里程碑）
5. **全量验证** — `npx vitest run` → 150+ passed ✅

### 验证

```bash
npx vitest run            # → 150+ passed, 0 failed ✅
npx vitest run --reporter=verbose  # 验证每个测试都跑通了
```

### 不要碰什么

- ❌ 不要改 `src/commands/*.ts` 中的逻辑代码
- ❌ 不要改已有的测试文件（commands.test.ts、coverage.test.ts、models.test.ts、github.test.ts、multi-watch.test.ts）
- ❌ 不要改 package.json
- ❌ 不要删任何现有测试

### Git 提醒

当前 `src/` 目录处于 git untracked 状态（上次 git 索引损坏修复后未重新 commit）。测试验收后需要：
```bash
git add -f src/
git commit -m "dev-2: 测试翻倍 — 94→150+ 全绿 ✅"
```

---

*dev-2，这次不画饼。4 个文件 + 修 2 个失败的测试，从 94 拉到 150+。Alpha 在 276 但他们卡 PyPI token。insight --compare 我们已经有了（dev-1 跑完了）。这轮的目标很清晰：把欠账清掉，让仲裁者看到 150+ 全绿的结果。按顺序来，每完成一个就跑全测试，确保无污染。🚀*
