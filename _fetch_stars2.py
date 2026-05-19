#!/usr/bin/env python3
"""Fetch GitHub repo stats - try unauthenticated first, then with token."""
import json, subprocess

TOKEN = "***"

for repo_name, label in [("alpha-project-arena", "Alpha"), ("beta-project-arena", "Beta")]:
    for user in ["lijiajing-11", "li1050109098"]:
        # Try without token first (public repos)
        url = f"https://api.github.com/repos/{user}/{repo_name}"
        cmd = f'curl -s "{url}"'
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        try:
            d = json.loads(r.stdout)
            if d.get("id"):
                stars = d.get("stargazers_count", 0)
                forks = d.get("forks_count", 0)
                pushed = d.get("pushed_at", "N/A")
                lang = d.get("language", "N/A")
                desc = (d.get("description") or "N/A")[:60]
                print(f"{label} ({user}): ⭐{stars} 🍴{forks} Lang={lang} Pushed={pushed}")
                print(f"  Desc: {desc}")
                break
            elif d.get("message") and d["message"] != "Not Found":
                print(f"{label} ({user}): {d['message']}")
            # If Not Found, try next user
        except Exception as e:
            print(f"{label} ({user}): Error - {e}")
    else:
        # Try with token as last resort
        for user in ["lijiajing-11", "li1050109098"]:
            url = f"https://api.github.com/repos/{user}/{repo_name}"
            cmd = f'curl -s -H "Authorization: token {TOKEN}" "{url}"'
            r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            try:
                d = json.loads(r.stdout)
                if d.get("id"):
                    stars = d.get("stargazers_count", 0)
                    forks = d.get("forks_count", 0)
                    pushed = d.get("pushed_at", "N/A")
                    lang = d.get("language", "N/A")
                    print(f"{label} ({user}) [auth]: ⭐{stars} 🍴{forks} Lang={lang} Pushed={pushed}")
                    break
                elif d.get("message"):
                    print(f"{label} ({user}) [auth]: {d['message']}")
            except:
                pass
        else:
            print(f"{label}: ❌ 无法访问仓库")
