#!/usr/bin/env python3
"""Check GitHub repo stars and commits for both teams."""
import urllib.request, json, sys

# Read token from env file
with open("/mnt/d/ai-startup-arena/arena.env") as f:
    for line in f:
        line = line.strip()
        if line.startswith("GITHUB_TOKEN="):
            token = line.split("=", 1)[1].strip().strip('"').strip("'")
            if token == "***":
                token = None
            break

if not token:
    print("Could not extract token from arena.env")
    sys.exit(1)

USER = "li1050109098"
HEADERS = {"Authorization": f"token {token}", "User-Agent": "HermesArenaBot"}

for repo_name in ["alpha-project-arena", "beta-project-arena"]:
    label = repo_name.replace("-project-arena", "").upper()
    
    # Check repo stats
    url = f"https://api.github.com/repos/{USER}/{repo_name}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        d = json.loads(resp.read())
        if d.get("id"):
            print(f"{label}: ✅ exists")
            print(f"{label}: ⭐ stars={d.get('stargazers_count', 0)}")
            print(f"{label}: 🍴 forks={d.get('forks_count', 0)}")
            print(f"{label}: 👁 watchers={d.get('subscribers_count', 0)}")
            print(f"{label}: 🌐 language={d.get('language', 'N/A')}")
            print(f"{label}: 📅 created={d.get('created_at', 'N/A')}")
            print(f"{label}: 🔄 pushed={d.get('pushed_at', 'N/A')}")
            print(f"{label}: 📝 desc={(d.get('description') or 'N/A')[:80]}")
            
            # Check latest commit
            url2 = f"https://api.github.com/repos/{USER}/{repo_name}/commits?per_page=1"
            req2 = urllib.request.Request(url2, headers=HEADERS)
            try:
                resp2 = urllib.request.urlopen(req2, timeout=10)
                commits = json.loads(resp2.read())
                if commits:
                    c = commits[0]
                    print(f"{label}: 🔖 latest_commit={c['sha'][:8]}")
                    print(f"{label}: 💬 msg={c['commit']['message'].split(chr(10))[0]}")
                    print(f"{label}: 👤 author={c['commit']['author']['name']}")
                    print(f"{label}: 🕐 date={c['commit']['author']['date']}")
                else:
                    print(f"{label}: 🔖 no commits yet")
            except Exception as e:
                print(f"{label}: 🔖 commit_error={e}")
        else:
            print(f"{label}: ❌ repo not found - {d.get('message', 'unknown')}")
    except urllib.error.HTTPError as e:
        print(f"{label}: ❌ HTTP {e.code} - {e.reason}")
    except Exception as e:
        print(f"{label}: ❌ error={e}")
    print("---")
