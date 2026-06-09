# Task 002: 测试基建 + vitest 就绪 🧪

**来源:** decision-001.md — 闪电 MVP
**执行者:** dev-2 🧪
**周期:** Cycle 1
**优先级:** P1

---

## 目标

搭建 vitest 测试框架，为核心模块编写测试骨架，确保 `npm test` 全绿。

---

## 子任务

### 1. 安装 vitest
```bash
npm install --save-dev vitest @types/node
```

更新 `package.json` 的 test script:
```json
"test": "vitest run",
"test:watch": "vitest"
```

添加 vitest config（或直接在 package.json 中配置）。

### 2. 测试目录结构
```
tests/
├── setup.ts              (全局 setup: chalk level = 0, 清理缓存)
├── cache.test.ts         (测试本地缓存: 存/取/过期/清理)
├── arxiv.test.ts         (mock fetch, 测试 retry 逻辑 + XML 解析)
├── summarizer.test.ts    (测试规则摘要: 标题提取、关键词提取)
├── renderer.test.ts      (测试 chalk 卡片: --no-color 模式)
├── export.test.ts        (测试 Markdown 导出格式)
└── cli.test.ts           (集成测试: CLI 参数解析)
```

### 3. 模块 mock 策略
- `arxiv.test.ts`: 用 `vi.mock('node-fetch')` mock HTTP 请求
- `cache.test.ts`: 用 `temp` 目录测试缓存 I/O
- `renderer.test.ts`: chalk.level = 0 避免颜色干扰
- `summarizer.test.ts`: 纯函数，不需要 mock

### 4. 测试覆盖要求
| 模块 | 测试数 | 覆盖点 |
|:----|:-----:|:-------|
| cache.test.ts | 6+ | 存、取、不存在、过期返回 null、清理、并发安全 |
| arxiv.test.ts | 4+ | mock fetch 成功、fetch 失败 retry、XML 解析、空结果 |
| summarizer.test.ts | 4+ | 完整 abstract、短 abstract、空 abstract、关键词提取 |
| renderer.test.ts | 3+ | 单卡片渲染、多卡片列表、--no-color 无 ANSI |
| export.test.ts | 3+ | Markdown 头、论文卡片 Markdown、文件写入 |
| cli.test.ts | 2+ | --help 输出、参数解析 |

**总计：22+ 测试，覆盖 ≥60% 行覆盖率**

---

## 验收标准

```bash
npm test                    # vitest run → all green ✅
npx vitest run --coverage   # line coverage ≥ 60%
```

## 约束
- ❌ 不要测试网络（全部 mock fetch）
- ❌ 不要改 `src/` 下的逻辑代码
- ❌ 不要使用顶层共享的 mock 变量（用 `vi.mocked()` + `beforeEach`）
- ✅ 用 chalk.level = 0 避免终端颜色干扰
- ✅ 每个测试独立 beforeEach 清理状态

## 重要：vitest 配置
vitest 用 CJS 模式 (tsconfig module: commonjs)，确保：

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

或直接写在 package.json 里。
