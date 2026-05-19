#!/usr/bin/env python3
"""Launch AI Startup Arena v4 - agents that actually git commit and push"""
import subprocess, time, os

ARENA_ROOT = "/mnt/d/ai-startup-arena"
SESSION = "arena-master"

def esc(s):
    return s.replace("'", "'\\''")

def run(cmd, timeout=10):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return r.stdout.strip()

now = time.strftime("%Y-%m-%d %H:%M:%S CST", time.localtime(time.time() + 8*3600))

# ──────────────────────────────────────────────
# PROMPTS — short, direct, with explicit git check
# ──────────────────────────────────────────────

ARB_PROMPT = f"""You are Hermes Arbitrator for AI Startup Arena.

Rules:
1. RUN: `git ls-remote git@github.com:lijiajing-11/alpha-project-arena.git HEAD`
2. RUN: `git ls-remote git@github.com:lijiajing-11/beta-project-arena.git HEAD`
3. Update /mnt/d/ai-startup-arena/arena/leaderboard.md with current Stars
4. Update /mnt/d/ai-startup-arena/arena/journal.md with phase progress

Time: {now}
Phase 1/3: Product Dev (4h)"""

CEO_PROMPT = """You are an AI Startup Arena CEO.

YOUR JOB (DO ALL 3):
1. RUN `git pull` — get latest code
2. Write a task file -> DIRECTORY arena/tasks/ (just create a .md file there)
3. Write a decision file -> arena/decisions/

EXAMPLE git commands (use these exact commands via bash):
  cd /mnt/d/ai-startup-arena/alpha/repo && git pull

FILES go to the COMMUNICATION DIR, NOT the repo dir:
  /mnt/d/ai-startup-arena/{team_dir}/arena/tasks/
  /mnt/d/ai-startup-arena/{team_dir}/arena/decisions/

You are {title}. Team: {team_str}. Product: {product}.
Start now!"""

DEV_PROMPT = """You are an AI Startup Arena Developer.

YOUR JOB — DO THIS EXACT SEQUENCE:
1. RUN `cd /mnt/d/ai-startup-arena/{team_dir}/repo && git pull`
2. RUN `ls /mnt/d/ai-startup-arena/{team_dir}/arena/tasks/` to find your task
3. READ the latest task file to know what to code
4. CODE something meaningful: add a feature, fix a bug, improve docs
5. RUN `cd /mnt/d/ai-startup-arena/{team_dir}/repo && git add -A && git commit -m 'dev: implement task feature' && git push`
6. Write report -> /mnt/d/ai-startup-arena/{team_dir}/arena/reports/

CRITICAL: Step 5 MUST succeed. If push fails, fix and retry.

You are {title}. Product: {product}.
Read your task, code something real, commit, push.
Start now!"""

MKT_PROMPT = """You are an AI Startup Arena Marketer.

YOUR JOB — DO THIS EXACT SEQUENCE:
1. RUN `cd /mnt/d/ai-startup-arena/{team_dir}/repo && git pull`
2. RUN `ls /mnt/d/ai-startup-arena/{team_dir}/arena/tasks/` to find your task
3. READ the latest task file
4. Improve README.md, add badges, write documentation, or create marketing content
5. RUN `cd /mnt/d/ai-startup-arena/{team_dir}/repo && git add -A && git commit -m 'mkt: improve docs/readme' && git push`
6. Write campaign report -> /mnt/d/ai-startup-arena/{team_dir}/arena/reports/

CRITICAL: Step 5 MUST succeed. If push fails, fix and retry.

You are {title}. Product: {product}.
Improve docs or marketing, commit, push.
Start now!"""

# ──────────────────────────────────────────────
# Build agent specs
# ──────────────────────────────────────────────

agents = []

# Arbitrator
agents.append(("arbitrator", ARENA_ROOT + "/arena", ARB_PROMPT, 360))

# Alpha team
agents.append(("alpha-ceo", ARENA_ROOT + "/alpha/repo",
    CEO_PROMPT.format(team_dir="alpha", title="Alpha CEO", team_str="alpha-dev-1, alpha-mkt",
        product="AI-powered GitHub Stars tracker (ara CLI)"), 300))

agents.append(("alpha-dev-1", ARENA_ROOT + "/alpha/repo",
    DEV_PROMPT.format(team_dir="alpha", title="Alpha Dev-1",
        product="GitHub Stars tracker (ara CLI)"), 180))

agents.append(("alpha-mkt", ARENA_ROOT + "/alpha/repo",
    MKT_PROMPT.format(team_dir="alpha", title="Alpha Mkt",
        product="GitHub Stars tracker (ara CLI)"), 240))

# Beta team
agents.append(("beta-ceo", ARENA_ROOT + "/beta/repo",
    CEO_PROMPT.format(team_dir="beta", title="Beta CEO", team_str="beta-dev-1, beta-mkt",
        product="GitHub repo analyzer (repo-sense CLI)"), 300))

agents.append(("beta-dev-1", ARENA_ROOT + "/beta/repo",
    DEV_PROMPT.format(team_dir="beta", title="Beta Dev-1",
        product="GitHub repo analyzer (repo-sense CLI)"), 180))

agents.append(("beta-mkt", ARENA_ROOT + "/beta/repo",
    MKT_PROMPT.format(team_dir="beta", title="Beta Mkt",
        product="GitHub repo analyzer (repo-sense CLI)"), 240))


# ──────────────────────────────────────────────
# Kill old session, launch fresh
# ──────────────────────────────────────────────

run(f"tmux kill-session -t {SESSION} 2>/dev/null")
time.sleep(0.5)

def make_loop(name, prompt, cwd, interval):
    p_esc = esc(prompt)
    return f"cd {cwd}\nwhile true; do\n  hermes profile {name} --prompt '{p_esc}' -Q --silent 2>/dev/null\n  echo '=== Round done, sleeping {interval}s ==='\n  sleep {interval}\ndone"

for i, (name, cwd, prompt, interval) in enumerate(agents):
    loop_cmd = make_loop(name, prompt, cwd, interval)
    if i == 0:
        run(f"tmux new-session -d -s {SESSION} -n {name}")
    else:
        run(f"tmux new-window -t {SESSION} -n {name}")
    run(f"tmux send-keys -t {SESSION}:{i} '{loop_cmd}' Enter")
    print(f"  Window {i}: {name} ({interval}s)")

print(f"\n=== Arena v4 launched: {SESSION} ===")
print("All 7 agents cycling with DIRECT git commit/push instructions")
print(f"Attach: tmux attach -t {SESSION}")
