#!/usr/bin/env python3
import json, sys, subprocess, os

# Source env
env_file = "/mnt/d/ai-startup-arena/arena.env"
token = None
with open(env_file) as f:
    for line in f:
        line = line.strip()
        if line.startswith("GITHUB_TOKEN="):
            token = line.split("=", 1)[1].strip().strip('"').strip("'")
            # Remove ** mask if it's actually the value
            if token == "***":
                token = None

if not token:
    # Try the actual mask from arena.env
    token = os.environ.get("GITHUB_TOKEN", "")

for repo in ["alpha-project-arena", "beta-project-arena"]:
    cmd = f'curl -s -H "Authorization: token {token}" "https://api.github.com/repos/li1050109098/{repo}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
        name = repo.replace("-project-arena", "").upper()
        stars = data.get("stargazers_count", 0)
        forks = data.get("forks_count", 0)
        exists = data.get("id") is not None
        desc = data.get("description", "N/A")[:60]
        print(f"{name}: exists={exists}, stars={stars}, forks={forks}, desc={desc}")
        if data.get("message"):
            print(f"  ERROR: {data['message']}")
    except:
        print(f"{repo}: API call failed - {result.stdout[:200]}")
