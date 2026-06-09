# PyPI 发布 Playbook（Alpha 队 — 闭合第一轮失败）

> 第一轮 Alpha 卡在 twine token 没发成。这份 playbook 把流程固化，避免重蹈覆辙。

## 前置（一次性）
1. 注册 PyPI 账号 + 开启 2FA
2. 生成 API token：https://pypi.org/manage/account/token/  （scope 选整个账户或指定项目）
3. token 存进环境变量，**绝不硬编码进代码**：
   ```bash
   export TWINE_USERNAME=__token__
   export TWINE_PASSWORD=pypi-xxxxxxxx   # 你的 token
   ```

## 发布流程
```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python -m pip install --upgrade build twine
python -m build                      # 生成 dist/*.whl 和 *.tar.gz
python -m twine check dist/*         # 校验包元数据
python -m twine upload dist/*        # 上传（读环境变量里的 token）
```

## 验证
```bash
pip install paper-digest             # 新环境装一下
paper-digest --help                  # 能跑即成功
```

## 常见坑
- 包名冲突 → 改 `name`（如 `paper-digest-atech`）
- 版本号重复 → PyPI 不允许覆盖，每次发布 bump version
- README 渲染失败 → `twine check` 会报，修 long_description_content_type="text/markdown"
- token 权限不足 → 用账户级 token 或先发一次再加项目级
