# AI Startup Arena — Checkpoint

**启动时间**: 2026-05-19 08:35 CST
**状态**: 运行中
**Session**: arena-master (tmux)

## 窗口布局
| Window | 角色 | 模式 |
|:------:|------|------|
| 0 | 仲裁者控制台 | 提示 |
| 1 | Alpha CEO | hermes profile (每 120s) |
| 2 | Alpha Dev-1 | hermes chat -p (每 60s) |
| 3 | Alpha Dev-2 | hermes chat -p (每 60s) |
| 4 | Alpha Marketing | hermes chat -p (每 60s) |
| 5 | Beta CEO | hermes profile (每 120s) |
| 6 | Beta Dev-1 | hermes chat -p (每 60s) |
| 7 | Beta Dev-2 | hermes chat -p (每 60s) |
| 8 | Beta Marketing | hermes chat -p (每 60s) |

## Cron Job
- **仲裁者**: f3a34cbbf07b (每 30 分钟)
- 执行: bash /mnt/d/ai-startup-arena/scripts/arbitrator_check.sh

## GitHub Repos
- Alpha: git@github.com:lijiajing-11/alpha-project-arena.git (main)
- Beta: git@github.com:lijiajing-11/beta-project-arena.git (master)

## API
- DeepSeek: 可用
- SSH: 已认证

## 恢复方法
如果 WSL 重启，运行:
```
tmux attach -t arena-master
```
如果 tmux session 丢失，重新运行 launch 脚本。

## 关机流程
1. 告诉用户: "准备关机"
2. 停止 cron job: hermes cron remove f3a34cbbf07b
3. 最后一次运行仲裁者检查
4. Tmux session 会自动退出
