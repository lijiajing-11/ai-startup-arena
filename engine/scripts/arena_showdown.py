#!/usr/bin/env python3
"""
AI Startup Arena — 终端巅峰对决
ARA (Alpha) vs repo-sense (Beta) · 左右分栏 · 真实CLI对战
"""
import subprocess, shutil, sys, os, time
from datetime import datetime

ARENA_ROOT = "/mnt/d/ai-startup-arena"
ALPHA_REPO = f"{ARENA_ROOT}/alpha/repo"
BETA_REPO = f"{ARENA_ROOT}/beta/repo"
W = shutil.get_terminal_size().columns

# 真实 GitHub repos（能跑出数据的）
BATTLES = [
    ("vuejs/core", "vercel/next.js", "Vue vs Next.js"),
    ("facebook/react", "sveltejs/svelte", "React vs Svelte"),
]

def run(cmd, cwd, timeout=8):
    try:
        r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True,
                          text=True, timeout=timeout)
        out = (r.stdout or "") + (r.stderr or "")
        return out.strip() or "(no output)"
    except subprocess.TimeoutExpired:
        return "⏱ timeout"
    except Exception as e:
        return f"⚠ {e}"

def side_by_side(left, right, lt="ALPHA · ara", rt="BETA · rs"):
    """左右分栏"""
    l = left.split("\n")
    r = right.split("\n")
    mx = max(len(l), len(r))
    half = (W - 3) // 2
    while len(l) < mx: l.append("")
    while len(r) < mx: r.append("")

    result = [f"\033[96m┌─ {lt}{'─' * (half-len(lt)-3)}┐     ┌─ {rt}{'─' * (half-len(rt)-3)}┐\033[0m"]
    for i in range(mx):
        a = l[i][:half].ljust(half)
        b = r[i][:half].ljust(half)
        result.append(f"\033[90m│\033[0m {a} \033[90m│\033[0m  \033[90m│\033[0m {b} \033[90m│\033[0m")
    result.append(f"\033[90m└{'─'*(half+1)}┘     └{'─'*(half+1)}┘\033[0m")
    return "\n".join(result)

def clear():
    os.system("clear" if os.name == "posix" else "cls")

def header():
    clear()
    print(f"""
\033[96m  ╔══════════════════════════════════════════════════════════╗
  ║         AI Startup Arena · 终端巅峰对决              ║
  ║    \033[92mARA\033[96m (Alpha · Python) vs \033[94mrepo-sense\033[96m (Beta · TypeScript)     ║
  ╚══════════════════════════════════════════════════════════╝\033[0m
""")

def show_cmd(cmd, desc):
    print(f"\n\033[93m  ⚡ {desc}\033[0m")
    time.sleep(0.5)

def show_career():
    """第一幕: 战队档案"""
    print(f"\n  \033[96m{'─'*W}\033[0m")
    print(f"  \033[93m  📋 战队档案\033[0m")
    print(f"  \033[96m{'─'*W}\033[0m")

    ac = run("git log --oneline | wc -l", ALPHA_REPO, 3).strip()
    bc = run("git log --oneline | wc -l", BETA_REPO, 3).strip()
    af = run("find ara -name '*.py' | wc -l", ALPHA_REPO, 3).strip()
    bf = run("find src -name '*.ts' | wc -l", BETA_REPO, 3).strip()

    L = f"""\033[92m  A-Tech Inc. (Alpha)\033[0m
  ─────────────────────
  技术栈  │ Python
  Commits │ {ac}
  命令数  │ 12
  测试    │ 276 ✅
  源文件  │ {af} .py
  发布    │ PyPI (卡token)"""

    R = f"""\033[94m  B-Labs Corp. (Beta)\033[0m
  ─────────────────────
  技术栈  │ TypeScript
  Commits │ {bc}
  命令数  │ 8+1
  测试    │ 94
  源文件  │ {bf} .ts
  发布    │ npm 0.2.1 ✅"""
    
    print(side_by_side(L, R, "", ""))
    time.sleep(2)

def show_round1():
    """第二幕: stars 命令对决"""
    print(f"\n  \033[96m{'═'*W}\033[0m")
    print(f"  \033[93m  🥊 ROUND 1 · stars 命令 — 谁更快？\033[0m")
    print(f"  \033[96m{'═'*W}\033[0m")

    repos = ["vuejs/core", "facebook/react", "vercel/next.js"]
    for r in repos:
        print(f"\n  \033[90m🎯 {r}\033[0m")
        t0 = time.time()
        a = run(f"ara stars {r}", ALPHA_REPO, 8)
        t1 = time.time()
        b = run(f"node dist/index.js stars {r}", BETA_REPO, 8)
        t2 = time.time()
        
        a_time = f"\033[92m{t1-t0:.1f}s\033[0m" if (t1-t0) < 5 else f"\033[91m{t1-t0:.1f}s\033[0m"
        b_time = f"\033[92m{t2-t1:.1f}s\033[0m" if (t2-t1) < 5 else f"\033[91m{t2-t1:.1f}s\033[0m"
        
        L = f"{a}\n  ⏱ {a_time}"
        R = f"{b}\n  ⏱ {b_time}"
        print(side_by_side(L, R, "ara stars", "rs stars"))
        time.sleep(1)

def show_round2():
    """第三幕: insight 深度洞察对决"""
    print(f"\n  \033[96m{'═'*W}\033[0m")
    print(f"  \033[93m  🥊 ROUND 2 · insight 命令 — 谁的洞察更深？\033[0m")
    print(f"  \033[96m{'═'*W}\033[0m")
    
    for r1, r2, desc in BATTLES:
        print(f"\n  \033[90m🎯 {desc}\033[0m")
        
        a = run(f"ara insight {r1}", ALPHA_REPO, 8)
        b = run(f"node dist/index.js insight {r1}", BETA_REPO, 8)
        print(side_by_side(a, b, f"ara insight {r1}", f"rs insight {r1}"))
        time.sleep(1)

def show_round3():
    """第四幕: battle 双人对决"""
    print(f"\n  \033[96m{'═'*W}\033[0m")
    print(f"  \033[93m  🥊 ROUND 3 · battle 命令 — 正面交锋！\033[0m")
    print(f"  \033[96m{'═'*W}\033[0m")

    for r1, r2, desc in BATTLES:
        print(f"\n  \033[90m🎯 {r1} vs {r2}\033[0m")
        a = run(f"ara battle {r1} {r2}", ALPHA_REPO, 8)
        b = run(f"node dist/index.js battle {r1} {r2}", BETA_REPO, 8)
        print(side_by_side(a, b, f"ara battle", f"rs battle"))
        time.sleep(1)

def show_finale():
    """终场: 回顾总结"""
    print(f"\n  \033[96m{'═'*W}\033[0m")
    print(f"  \033[93m  🏆 最终裁决\033[0m")
    print(f"  \033[96m{'═'*W}\033[0m")
    
    verdict = f"""
\033[92m  ╔══════════════════════════════════════════════════════════╗
  ║          AI Startup Arena 进化竞赛 · 完整收官           ║
  ╠══════════════════════════════════════════════════════════╣
  ║                                                          ║
  ║  仲裁者: 44:44 平局    Beta 自评: 56:54 领先            ║
  ║                                                          ║
  ║  ┌──────────────────────┬──────────────────────┐        ║
  ║  │  \033[96mAlpha (ARA)\033[92m              │  \033[94mBeta (repo-sense)\033[92m        │        ║
  ║  ├──────────────────────┼──────────────────────┤        ║
  ║  │  Python · 172 commits│  TypeScript · 170 c. │        ║
  ║  │  12 命令 · 276 tests │  8 命令 · 94 tests   │        ║
  ║  │  功能更丰富          │  代码更干净           │        ║
  ║  │  PyPI 卡token        │  npm 已上线 ✅        │        ║
  ║  │  ANSI 输出           │  chalk 彩色 UI 🥇    │        ║
  ║  └──────────────────────┴──────────────────────┘        ║
  ║                                                          ║
  ║  8 小时 · 330+ commits · 两个完整的 CLI 产品            ║
  ║  最终沉淀 \033[96mHermes 技能库\033[92m，下次更强 🚀              ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝\033[0m"""
    print(verdict)
    time.sleep(1)

def main():
    header()
    show_career()
    show_round1()
    show_round2()
    show_round3()
    show_finale()

if __name__ == "__main__":
    main()
