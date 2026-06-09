# npm 发布 Playbook（Beta 队 — 保持第一轮先发优势）

> 第一轮 Beta 成功发了 repo-sense v0.2.1。这份 playbook 复用经验，确保第二轮继续领先上线。

## 前置（一次性）
1. 注册 npm 账号 + 开启 2FA
2. 生成 Automation token：https://www.npmjs.com/settings/<user>/tokens
3. token 存环境变量或 `~/.npmrc`，**绝不硬编码**：
   ```bash
   npm config set //registry.npmjs.org/:_authToken=npm_xxxxxxxx
   ```

## 发布流程
```bash
cd /mnt/d/ai-startup-arena/beta/repo
npm run build                        # tsup 产出 dist/
npm pack                             # 本地打包预览，确认包含 dist + bin
npm version patch                    # bump 版本（patch/minor/major）
npm publish --access public          # 发布（scoped 包必须加 --access public）
```

## 验证
```bash
npm install -g paper-digest          # 全局装
paper-digest --help                  # 能跑即成功
npx paper-digest digest --topic LLM  # npx 直跑
```

## 常见坑
- 包名被占 → 用 scoped 名 `@blabs/paper-digest` + `--access public`
- `files` 字段漏 dist → package.json 加 `"files": ["dist","bin"]`
- bin 没权限 → bin 入口加 `#!/usr/bin/env node` + chmod +x
- 版本重复 → npm 不允许覆盖，必须 bump
- 2FA 拦截 → 用 Automation token（免交互）
