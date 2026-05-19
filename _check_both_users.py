#!/usr/bin/env python3
"""Try both possible GitHub usernames for the repos."""
import urllib.request, json

with open("/mnt/d/ai-startup-arena/arena.env") as f:
    for line in f:
        line = line.strip()
        if line.startswith("GITHUB_TOKEN="):
            token = line.split("=", 1)[1].strip().strip('"').strip("'")
            if token == "***":
                token = None
            break

if not token:
    print("No token found")
    exit(1)

USERS = ["li1050109098", "lijiajing-11"]
REPOS = ["alpha-project-arena", "beta-project-arena"]
HEADERS = {"Authorization": f"token {token}", "User-Agent": "HermesArenaBot"}

for repo_name in REPOS:
    label = repo_name.replace("-project-arena", "").upper()
    found = False
    for user in USERS:
        url = f"https://api.github.com/repos/{user}/{repo_name}"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            d = json.loads(resp.read())
            if d.get("id"):
                print(f"{label}: ✅ found under user={user}")
                print(f"{label}: ⭐ stars={d.get('stargazers_count', 0)}")
                print(f"{label}: 🍴 forks={d.get('forks_count', 0)}")
                print(f"{label}: 🌐 language={d.get('language', 'N/A')}")
                print(f"{label}: 🔄 pushed={d.get('pushed_at', 'N/A')}")
                print(f"{label}: 📝 desc={(d.get('description') or 'N/A')[:80]}")
                
                # Get latest commit
                url2 = f"https://api.github.com/repos/{user}/{repo_name}/commits?per_page=1"
                req2 = urllib.request.Request(url2, headers=HEADERS)
                try:
                    resp2 = urllib.request.urlopen(req2, timeout=10)
                    commits = json.loads(resp2.read())
                    if commits:
                        c = commits[0]
                        print(f"{label}: 🔖 commit={c['sha'][:8]}")
                        msg = c['commit']['message'].split('\n')[0][:80]
                        print(f"{label}: 💬 msg={msg}")
                        print(f"{label}: 👤 author={c['commit']['author']['name']}")
                        print(f"{label}: 🕐 date={c['commit']['author']['date']}")
                    else:
                        print(f"{label}: 🔖 no commits")
                except Exception as e:
                    print(f"{label}: 🔖 commit_error={e}")
                
                found = True
                break
            elif "Not Found" in str(d.get("message", "")):
                continue
            else:
                print(f"{label} ({user}): {d.get('message')}")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                continue
            print(f"{label} ({user}): HTTP {e.code}")
        except Exception as e:
            print(f"{label} ({user}): {e}")
    
    if not found:
        print(f"{label}: ❌ Not found in any of {USERS}")
    print("---")
