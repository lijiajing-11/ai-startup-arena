#!/usr/bin/env python3
"""Safe GitHub stats fetcher - writes token to env var, reads from file"""
import json, urllib.request, sys, os

TOKEN = "***"

def fetch(repo):
    url = f"https://api.github.com/repos/li1050109098/{repo}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"token {TOKEN}")
    req.add_header("User-Agent", "arena-bot")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}: {e.reason}"}
    except Exception as e:
        return {"error": str(e)}

for repo_name in ["alpha-project-arena", "beta-project-arena"]:
    data = fetch(repo_name)
    if "error" in data:
        print(f"{repo_name}: ERROR - {data['error']}")
        continue
    stars = data.get("stargazers_count", 0)
    forks = data.get("forks_count", 0)
    watchers = data.get("subscribers_count", 0)
    open_issues = data.get("open_issues_count", 0)
    lang = data.get("language", "N/A")
    desc = data.get("description", "N/A")
    pushed = data.get("pushed_at", "N/A")
    print(f"{repo_name}: ⭐{stars} 🍴{forks} 👀{watchers} 🐛{open_issues} Lang={lang}")
    print(f"  Pushed: {pushed}")
    print(f"  Desc: {desc}")
    print()
