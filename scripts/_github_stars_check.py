#!/usr/bin/env python3
"""Check GitHub repos for AI Startup Arena."""
import urllib.request, json, os, sys

# Read token from env file
env_file = "/mnt/d/ai-startup-arena/arena.env"
token = None
with open(env_file) as f:
    for line in f:
        line = line.strip()
        if line.startswith("GITHUB_TOKEN="):
            raw = line.split("=", 1)[1].strip().strip('"').strip("'")
            if raw != "***" and raw:
                token = raw
            break

if not token:
    print('{"error":"No valid token found"}')
    sys.exit(1)

HEADERS = {'Authorization': f'token {token}', 'User-Agent': 'HermesArenaBot'}
results = {}

for repo in ['alpha-project-arena', 'beta-project-arena']:
    label = repo.replace('-project-arena', '').upper()
    rinfo = {'label': label, 'stars': 0, 'forks': 0, 'exists': False, 'commit': None}
    
    # Repo info
    for user in ['li1050109098', 'lijiajing-11']:
        url = f'https://api.github.com/repos/{user}/{repo}'
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            resp = urllib.request.urlopen(req, timeout=10)
            d = json.loads(resp.read())
            if d.get('id'):
                rinfo['exists'] = True
                rinfo['stars'] = d.get('stargazers_count', 0)
                rinfo['forks'] = d.get('forks_count', 0)
                rinfo['user'] = user
                rinfo['lang'] = d.get('language', 'N/A')
                rinfo['created'] = d.get('created_at', '?')
                rinfo['pushed'] = d.get('pushed_at', '?')
                rinfo['desc'] = (d.get('description') or 'N/A')[:80]
                break
            elif d.get('message'):
                rinfo['error'] = d['message']
        except Exception as e:
            rinfo['error'] = str(e)
    
    # Latest commit
    if rinfo['exists'] and rinfo.get('user'):
        url2 = f'https://api.github.com/repos/{rinfo["user"]}/{repo}/commits?per_page=1'
        try:
            req2 = urllib.request.Request(url2, headers=HEADERS)
            resp2 = urllib.request.urlopen(req2, timeout=10)
            commits = json.loads(resp2.read())
            if commits:
                c = commits[0]
                rinfo['commit'] = {
                    'sha': c['sha'][:8],
                    'message': c['commit']['message'].split('\n')[0][:80],
                    'author': c['commit']['author']['name'],
                    'date': c['commit']['author']['date']
                }
        except Exception as e:
            rinfo['commit_error'] = str(e)
    
    results[repo] = rinfo

print(json.dumps(results, indent=2))
