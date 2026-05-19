#!/usr/bin/env python3
import json, subprocess

token = "***"

# Try different username patterns
for username in ["li1050109098", "lijiajing-11"]:
    for repo_prefix in ["alpha-project-arena", "beta-project-arena"]:
        url = f"https://api.github.com/repos/{username}/{repo_prefix}"
        cmd = f'curl -s -H "Authorization: token {token}" "{url}"'
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        try:
            data = json.loads(result.stdout)
            if data.get("message"):
                print(f"{username}/{repo_prefix}: {data['message']}")
            else:
                stars = data.get("stargazers_count", 0)
                forks = data.get("forks_count", 0)
                pushed = data.get("pushed_at", "N/A")
                lang = data.get("language", "N/A")
                default_branch = data.get("default_branch", "N/A")
                print(f"{username}/{repo_prefix}: ⭐{stars} 🍴{forks} Lang={lang} Branch={default_branch} Pushed={pushed}")
        except Exception as e:
            print(f"{username}/{repo_prefix}: Error - {e}")
