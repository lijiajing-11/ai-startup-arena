#!/usr/bin/env python3
"""Check GitHub repo stats for AI Startup Arena."""
import urllib.request, json, sys

TOKEN = '***'
USER = 'li1050109098'
HEADERS = {'Authorization': f'token {TOKEN}', 'User-Agent': 'HermesArenaBot'}

for repo, label in [('alpha-project-arena', 'ALPHA'), ('beta-project-arena', 'BETA')]:
    print(f'=== {label} ===')
    # Repo info
    url = f'https://api.github.com/repos/{USER}/{repo}'
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        resp = urllib.request.urlopen(req, timeout=10)
        d = json.loads(resp.read())
        if d.get('id'):
            print(f'EXISTS=1')
            print(f'STARS={d.get("stargazers_count", 0)}')
            print(f'FORKS={d.get("forks_count", 0)}')
            print(f'OPEN_ISSUES={d.get("open_issues_count", 0)}')
            print(f'LANGUAGE={d.get("language", "N/A")}')
            print(f'PUSHED={d.get("pushed_at", "N/A")}')
            print(f'CREATED={d.get("created_at", "N/A")}')
        else:
            print(f'EXISTS=0')
            print(f'ERROR={d.get("message", "unknown")}')
    except urllib.error.HTTPError as e:
        print(f'EXISTS=0')
        print(f'ERROR=HTTP {e.code}: {e.reason}')
    except Exception as e:
        print(f'EXISTS=0')
        print(f'ERROR={e}')

    # Latest commit
    url2 = f'https://api.github.com/repos/{USER}/{repo}/commits?per_page=1'
    try:
        req2 = urllib.request.Request(url2, headers=HEADERS)
        resp2 = urllib.request.urlopen(req2, timeout=10)
        commits = json.loads(resp2.read())
        if commits:
            c = commits[0]
            print(f'HAS_COMMIT=1')
            print(f'COMMIT_SHA={c["sha"][:8]}')
            print(f'COMMIT_MSG={c["commit"]["message"].split(chr(10))[0]}')
            print(f'COMMIT_AUTHOR={c["commit"]["author"]["name"]}')
            print(f'COMMIT_DATE={c["commit"]["author"]["date"]}')
        else:
            print(f'HAS_COMMIT=0')
    except Exception as e:
        print(f'HAS_COMMIT=0')
        print(f'COMMIT_ERROR={e}')
    print('---')
