#!/usr/bin/env python3
import json, subprocess, sys

token = "***"

for repo_name, label in [("alpha-project-arena", "Alpha"), ("beta-project-arena", "Beta")]:
    url = f"https://api.github.com/repos/li1050109098/{repo_name}"
    cmd = f'curl -s -H "Authorization: token {token}" "{url}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
        if data.get("message") and data["message"] == "Not Found":
            print(f"{label}: ❌ 仓库不存在或不可访问")
            continue
        stars = data.get("stargazers_count", 0)
        forks = data.get("forks_count", 0)
        open_issues = data.get("open_issues_count", 0)
        watchers = data.get("subscribers_count", 0)
        language = data.get("language", "N/A")
        created = data.get("created_at", "N/A")
        pushed = data.get("pushed_at", "N/A")
        print(f"{label}: ⭐{stars} 🍴{forks} 👀{watchers} 🐛{open_issues} Lang={language}")
        print(f"  Created: {created}")
        print(f"  Pushed: {pushed}")
    except json.JSONDecodeError:
        print(f"{label}: Failed to parse API response - {result.stdout[:200]}")
