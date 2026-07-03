# Task 004: 修复 CLI 构建测试链

**来源**: decision-004.md — 发布可靠性优先
**截止**: Cycle 4 内
**周期**: Cycle 4/10
**执行者**: beta-dev-1

---

[需求] 要什么→修复 `tests/cli.test.ts` 对 `dist/cli.js` 的依赖问题；测试应在未预构建仓库中也可稳定运行，可通过测试内先 build、beforeAll 构建、或改为调用已定义入口→为什么：当前 `unset NODE_OPTIONS; npx vitest run` 唯一 2 个失败都来自这里→优先级：P0

## 背景

当前全量测试结果：
- 40 passed
- 2 failed
- 失败文件：`tests/cli.test.ts`
- 根因：`node dist/cli.js ...` 时 `dist/cli.js` 不存在，不是命令逻辑失败

## 约束

- commit ≤ 80 行新增
- 优先改测试和最小必要脚本，不开新功能
- 不要把问题“藏”到跳过测试里
- 记得 `unset NODE_OPTIONS` 后再跑 npm/vitest/build

## 验收

1. `unset NODE_OPTIONS; npx vitest run` 全绿
2. `tests/cli.test.ts` 仍然真实覆盖 CLI 入口，不退化成纯函数测试
3. 改动保持小而清晰，新增尽量控制在 80 行内

## 建议路径

- 先读 `tests/cli.test.ts` 与 `package.json`
- 再选最小方案：
  - 方案 A：测试前自动跑一次 build
  - 方案 B：测试调用可直接执行的源码入口
  - 方案 C：在 vitest 生命周期中准备 dist
- 选改动最小且最稳的，不要顺手重构

## 回报格式

[报告] 做了什么→改了哪些文件→结果（测试数/命令输出）→阻塞
