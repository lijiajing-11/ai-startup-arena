#!/usr/bin/env python3
"""Launch AI Startup Arena - all 7 agents with git auto-commit"""
import subprocess, time

ARENA_ROOT = "/mnt/d/ai-startup-arena"
SESSION = "arena-master"

def esc(s):
    return s.replace("'", "'\\''")

def run(cmd, timeout=10):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return r.stdout.strip()

run(f"tmux kill-session -t {SESSION} 2>/dev/null")
time.sleep(0.5)

GIT_HELP = "Before working: git pull. After changes: git add -A && git commit -m msg && git push"
ARB_JOB = "check both repos (git ls-remote), update leaderboard.md and journal.md"

arb = """You are Hermes Arbitrator for AI Startup Arena.

{0}

Phase 1/3: Product Dev (4h). P1: 16:08-20:08 CST
Alpha repo: git@github.com:lijiajing-11/alpha-project-arena.git (branch: main)
Beta repo: git@github.com:lijiajing-11/beta-project-arena.git (branch: master)
Time: {1}

{2}
Start now!""".format(GIT_HELP, time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() + 8*3600)), ARB_JOB)

ceo_base = """You are an AI Startup Arena CEO.

{0}

Rules:
- git pull before work, git add/commit/push after
- Write tasks to arena/tasks/, reports to arena/reports/
- Team reads your task files to know what to do
- Your git push MUST succeed
""".format(GIT_HELP)

worker_base = """You are an AI Startup Arena team member.

{0}

Rules:
- git pull before work, git add/commit/push after
- Read tasks from arena/tasks/ directory
- Report progress to arena/reports/""".format(GIT_HELP)

alpha_ceo = ceo_base + """
You are Alpha CEO. Repo: /mnt/d/ai-startup-arena/alpha/repo (branch: main)
Team: alpha-dev-1, alpha-mkt. Comm: /mnt/d/ai-startup-arena/alpha/arena/
Product direction: Build AI-powered GitHub Stars tracker tool (extend ara CLI).
Or invent your own product. Start now! git pull first!"""

alpha_dev = worker_base + """
You are Alpha Dev-1. Repo: /mnt/d/ai-startup-arena/alpha/repo (branch: main)
Comm: /mnt/d/ai-startup-arena/alpha/arena/. Read latest task from /tasks/.
Start now! git pull, read tasks, code, commit, push!"""

alpha_mkt = worker_base + """
You are Alpha Mkt. Repo: /mnt/d/ai-startup-arena/alpha/repo (branch: main)
Comm: /mnt/d/ai-startup-arena/alpha/arena/. Read latest task from /tasks/.
Start now! git pull, read tasks, work, commit, push!"""

beta_ceo = ceo_base + """
You are Beta CEO. Repo: /mnt/d/ai-startup-arena/beta/repo (branch: master)
Team: beta-dev-1, beta-mkt. Comm: /mnt/d/ai-startup-arena/beta/arena/
Product direction: Build AI-powered GitHub repo analyzer (extend repo-sense CLI).
Or invent your own product. Start now! git pull first!"""

beta_dev = worker_base + """
You are Beta Dev-1. Repo: /mnt/d/ai-startup-arena/beta/repo (branch: master)
Comm: /mnt/d/ai-startup-arena/beta/arena/. Read latest task from /tasks/.
Start now! git pull, read tasks, code, commit, push!"""

beta_mkt = worker_base + """
You are Beta Mkt. Repo: /mnt/d/ai-startup-arena/beta/repo (branch: master)
Comm: /mnt/d/ai-startup-arena/beta/arena/. Read latest task from /tasks/.
Start now! git pull, read tasks, work, commit, push!"""

agents = [
    ("arbitrator", "/mnt/d/ai-startup-arena/arena", arb, 360),
    ("alpha-ceo", "/mnt/d/ai-startup-arena/alpha/repo", alpha_ceo, 300),
    ("alpha-dev-1", "/mnt/d/ai-startup-arena/alpha/repo", alpha_dev, 180),
    ("alpha-mkt", "/mnt/d/ai-startup-arena/alpha/repo", alpha_mkt, 240),
    ("beta-ceo", "/mnt/d/ai-startup-arena/beta/repo", beta_ceo, 300),
    ("beta-dev-1", "/mnt/d/ai-startup-arena/beta/repo", beta_dev, 180),
    ("beta-mkt", "/mnt/d/ai-startup-arena/beta/repo", beta_mkt, 240),
]

def make_loop(name, prompt, cwd, interval):
    p_esc = esc(prompt)
    return f'cd {cwd}\nwhile true; do\n  hermes profile {name} --prompt \'{p_esc}\' -Q --silent 2>/dev/null\n  sleep {interval}\ndone'

name, cwd, prompt, interval = agents[0]
loop_cmd = make_loop(name, prompt, cwd, interval)
run(f"tmux new-session -d -s {SESSION} -n {name}")
run(f"tmux send-keys -t {SESSION}:0 \"{loop_cmd}\" Enter")
print(f"  Window 0: {name} ({interval}s)")

for i, (name, cwd, prompt, interval) in enumerate(agents[1:], 1):
    loop_cmd = make_loop(name, prompt, cwd, interval)
    run(f"tmux new-window -t {SESSION} -n {name}")
    run(f"tmux send-keys -t {SESSION}:{i} \"{loop_cmd}\" Enter")
    print(f"  Window {i}: {name} ({interval}s)")

print(f"\n=== Arena launched: {SESSION} ===")
print("All 7 agents cycling - git pull/modify/commit/push each round")
print(f"Attach: tmux attach -t {SESSION}")
