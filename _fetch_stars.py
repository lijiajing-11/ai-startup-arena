#!/usr/bin/env python3
"""Fetch GitHub repo stats for both teams."""
import json, subprocess

TOKEN = "***"

for repo_name, label in [("alpha-project-arena", "Alpha"), ("beta-project-arena", "Beta")]:
    # Try both usernames
    for user in ["li1050109098", "lijiajing-11"]:
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
                desc = (d.get("description") or "N/A")[:60]
                print(f"{label} ({user}): ⭐{stars} 🍴{forks} Lang={lang} Pushed={pushed}")
                print(f"  Desc: {desc}")
                break
            elif d.get("message"):
                if d["message"] == "Not Found":
                    continue  # Try next username
                print(f"{label} ({user}): API Error - {d['message']}")
                break
        except Exception as e:
            print(f"{label} ({user}): Parse error - {e}")
    else:
        print(f"{label}: ❌ 仓库未找到 (checked both li1050109098 and lijiajing-11)")
