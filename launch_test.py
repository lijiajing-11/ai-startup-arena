#!/usr/bin/env python3
"""Launch a mini arena test: arbitrator + alpha team (CEO, Dev-1, Mkt)"""
import subprocess, os, sys, time

ARENA_ROOT = "/mnt/d/ai-startup-arena"
SESSION = "arena-test"
PROJECT_DIR_ALPHA = os.path.join(ARENA_ROOT, "alpha", "repo")
ARENA_DIR = os.path.join(ARENA_ROOT, "arena")
DEEPSEEK_KEY = "sk-2d8169fc026c4abf97e92eba9ec754a3"
GITHUB_TOKEN = "***"

now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() + 8*3600))

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
    if r.returncode != 0 and "already exists" not in r.stderr and "kill" not in cmd:
        print(f"  [{cmd[:50]}...] rc={r.returncode}: {r.stderr[:100]}")
    return r.stdout.strip()

# Kill old session
run(f"tmux kill-session -t {SESSION} 2>/dev/null")
time.sleep(0.5)

# Create session with arbitrator window
run(f"""tmux new-session -d -s {SESSION} -n arbitrator""")
run(f"""tmux send-keys -t {SESSION}:0 "cd {ARENA_DIR}" Enter""")

arb_prompt = f"""你叫 Hermes Arbitrator（仲裁者），负责监控 AI Startup Arena 战斗中的 Alpha 队。
你是 Independent - Arbitrator，负责公正的第三方裁判和进度的监控。
当前阶段: Phase 1/3 - 产品开发 (5分钟)
环境时间: {now}
Alpha 仓库: git@github.com:lijiajing-11/alpha-project-arena.git
请开始执行你的使命，先观察当前情况写入日志。"""

# Escape single quotes for shell
arb_prompt = arb_prompt.replace("'", "'\\\\''")
run(f"""tmux send-keys -t {SESSION}:0 "hermes profile arbitrator --prompt '{arb_prompt}' -Q --silent 2>/dev/null &" Enter""")
print("  Arbitrator (window 0) launched")

# Alpha CEO
ceo_prompt = f"""你是 Alpha 团队的首席执行官（CEO）。带领 Alpha 在 AI Startup Arena 中获胜。
Phase 1/3: 产品开发 (5分钟)
目标：开发一个能工作的 MVP 产品并提交到仓库
仓库: git@github.com:lijiajing-11/alpha-project-arena.git
时间: {now}
请分析本次目标，制定产品策略，开始行动！"""
ceo_prompt = ceo_prompt.replace("'", "'\\\\''")

run(f"tmux new-window -t {SESSION} -n alpha-ceo")
run(f"""tmux send-keys -t {SESSION}:1 "cd {PROJECT_DIR_ALPHA}" Enter""")
run(f"""tmux send-keys -t {SESSION}:1 "hermes profile alpha-ceo --prompt '{ceo_prompt}' -Q --silent 2>/dev/null &" Enter""")
print("  Alpha CEO (window 1) launched")

# Alpha Dev-1
dev_prompt = f"""你是 Alpha 团队的 Dev-1（首席开发者）。实现 Alpha CEO 分配的任务。
Phase 1/3: 产品开发 (5分钟)
仓库: git@github.com:lijiajing-11/alpha-project-arena.git
时间: {now}
请等待并检查 CEO 分配的任务后开始编码。"""
dev_prompt = dev_prompt.replace("'", "'\\\\''")

run(f"tmux new-window -t {SESSION} -n alpha-dev-1")
run(f"""tmux send-keys -t {SESSION}:2 "cd {PROJECT_DIR_ALPHA}" Enter""")
run(f"""tmux send-keys -t {SESSION}:2 "hermes profile alpha-dev-1 --prompt '{dev_prompt}' -Q --silent 2>/dev/null &" Enter""")
print("  Alpha Dev-1 (window 2) launched")

# Alpha Mkt
mkt_prompt = f"""你是 Alpha 团队的 Mkt（市场负责人）。让 Alpha 的产品获得最多 GitHub Stars。
Phase 1/3: 产品开发 (5分钟)
仓库: git@github.com:lijiajing-11/alpha-project-arena.git
时间: {now}
请检查 CEO 分配的任务后开始你的工作。"""
mkt_prompt = mkt_prompt.replace("'", "'\\\\''")

run(f"tmux new-window -t {SESSION} -n alpha-mkt")
run(f"""tmux send-keys -t {SESSION}:3 "cd {PROJECT_DIR_ALPHA}" Enter""")
run(f"""tmux send-keys -t {SESSION}:3 "hermes profile alpha-mkt --prompt '{mkt_prompt}' -Q --silent 2>/dev/null &" Enter""")
print("  Alpha Mkt (window 3) launched")

print(f"\n--- All 4 agents launched in tmux session '{SESSION}' ---")
print("Windows: 0=arbitrator, 1=alpha-ceo, 2=alpha-dev-1, 3=alpha-mkt")
print(f"Attach: tmux attach -t {SESSION}")
print(f"View journal: cat {ARENA_DIR}/journal.md")
