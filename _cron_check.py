#!/usr/bin/env python3
"""Cron job: check GitHub repos for AI Startup Arena progress report."""
import urllib.request, json, os, sys, subprocess
from datetime import datetime

TOKEN = '***'
USER = 'li1050109098'
HEADERS = {'Authorization': f'token {TOKEN}', 'User-Agent': 'HermesArenaBot'}

results = {}

for repo in ['alpha-project-arena', 'beta-project-arena']:
    rinfo = {'name': repo, 'stars': 0, 'forks': 0, 'exists': False, 'commit': None}
    
    # Get repo info
    url = f'https://api.github.com/repos/{USER}/{repo}'
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        resp = urllib.request.urlopen(req, timeout=10)
        d = json.loads(resp.read())
        rinfo['exists'] = True
        rinfo['stars'] = d.get('stargazers_count', 0)
        rinfo['forks'] = d.get('forks_count', 0)
        rinfo['created_at'] = d.get('created_at', '?')
    except Exception as e:
        rinfo['error'] = str(e)
    
    # Get latest commit
    if rinfo['exists']:
        url2 = f'https://api.github.com/repos/{USER}/{repo}/commits?per_page=1'
        try:
            req2 = urllib.request.Request(url2, headers=HEADERS)
            resp2 = urllib.request.urlopen(req2, timeout=10)
            commits = json.loads(resp2.read())
            if commits:
                c = commits[0]
                rinfo['commit'] = {
                    'sha': c['sha'][:8],
                    'message': c['commit']['message'].split('\n')[0],
                    'author': c['commit']['author']['name'],
                    'date': c['commit']['author']['date']
                }
        except Exception as e:
            rinfo['commit_error'] = str(e)
    
    results[repo] = rinfo

# Print results as JSON for easy parsing
print(json.dumps(results, indent=2))
