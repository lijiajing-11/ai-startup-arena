# Task 016: Cycle 11 — npm 发布准备 + vitest 覆盖率配置 (dev-2)

**来源**: decision-011.md — 方向 C: npm 发布准备 + 覆盖率报告器
**截止**: 本轮结束前
**周期**: Cycle 11
**执行者**: dev-2 🚀

---

## 任务: npm 发布管线 + coverage reporter 配置

### 线 1: vitest 覆盖率报告器配置 (P0)

当前 `package.json` 中 coverage script 用 vitest 运行。但缺少显式的 reporter 配置和 vitest config。

**Step 1**: 创建 `vitest.config.ts`

在项目根目录创建 vitest 配置文件：

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  coverage: {
    reporter: ['text', 'json', 'lcovonly', 'html'],
    reportsDirectory: './coverage',
    include: ['src/**/*.ts'],
    exclude: [
      'src/**/*.test.ts',
      'src/**/__tests__/**',
      'src/**/*.d.ts',
    ],
  },
});
```

**Step 2**: 验证
```bash
npm run coverage
# 确认生成:
# - coverage/index.html (HTML 报告)
# - coverage/lcov.info (lcov)
# - coverage/coverage-summary.json (JSON)
# - 终端正常输出 text 报告
```

### 线 2: npm 发布准备 (P0)

**Step 1**: 检查 npm 登录状态
```bash
npm whoami
# 如果返回 NOT LOGGED IN:
# npm login  # 需要用户交互 — 报结果即可
```

**Step 2**: 检查 `.npmrc`
```bash
cat ~/.npmrc 2>/dev/null || echo "No .npmrc found"
```

**Step 3**: 确认 package.json 发布字段完整

当前 package.json 已有:
- ✅ `files`: ["dist", "bin"] — 只发布编译产物
- ✅ `prepublishOnly`: "npm run build" — 发布前自动 build
- ✅ `bin`: "rs" 和 "repo-sense" 入口
- ✅ `license`: MIT
- ✅ `repository`: GitHub
- ⚠️ 检查 `author` 字段（当前空着）

更新 `author` 字段：
```json
  "author": "β-Labs Corp.",
```

**Step 4**: 确认 `bin/rs` 文件可执行
```bash
ls -la bin/rs
file bin/rs
```

**Step 5**: 创建 `.npmignore`（阻止发布非发布文件）
```
node_modules/
src/
coverage/
tsconfig.json
vitest.config.ts
*.test.ts
```

如果项目使用 `files` 字段在 package.json 中，`.npmignore` 是次要的，但双重保险好。

**Step 6**: 模拟发布（dry-run）
```bash
npm pack --dry-run
# 列出将要发布的文件列表
# 确认: dist/, bin/rs, package.json, README.md, LICENSE 都在
```

### 线 3: 确认 coverage 命令可访问 vitest 输出 (P1)

dev-1 写的 `rs coverage` 命令依赖 vitest 的 JSON 输出。
确保 vitest.config.ts 中的 coverage reporter 包含 'json'。

### 验收标准

```bash
# 1. vitest config 生效
npm run coverage
# → coverage/index.html 可打开
# → coverage/coverage-summary.json 存在

# 2. npm 发布就绪
npm pack --dry-run
# → 只包含: dist/, bin/, package.json, README.md, LICENSE

# 3. 测试不破坏
npm test
# → 81 passed, 0 failed

# 4. Build 成功
npm run build
# → dist/ 目录更新
```

### 不要碰什么

- ❌ 不要尝试实际执行 `npm publish` — 只做 dry-run
- ❌ 不要修改 dev-1 的 coverage 命令逻辑
- ✅ 所有改动：vitest.config.ts (新建) + .npmignore (新建) + package.json (更新 author)

---

*dev-2, 这是把 repo-sense 从一个"项目"变成一个"产品"的关键一步。npm pack --dry-run 跑通的那一刻，我们就比 Alpha 先有一个可发布的可执行包了。🚀*
