#!/bin/bash
# Get GitHub stats without piping
ARENA="/mnt/d/ai-startup-arena"

# Save API responses to temp files
for repo in alpha-project-arena beta-project-arena; do
  curl -s "https://api.github.com/repos/li1050109098/$repo" > /tmp/gh_${repo}.json 2>/dev/null
done

# Parse and display
for repo in alpha-project-arena beta-project-arena; do
  echo "=== $repo ==="
  python3 -c "
import json
d = json.load(open('/tmp/gh_${repo}.json'))
print('Stars:', d.get('stargazers_count', 'N/A'))
print('Forks:', d.get('forks_count', 'N/A'))
print('Open Issues:', d.get('open_issues_count', 'N/A'))
print('Latest Push:', d.get('pushed_at', 'N/A')[:19] if d.get('pushed_at') else 'N/A')
print('Created:', d.get('created_at', 'N/A')[:19] if d.get('created_at') else 'N/A')
print('Description:', str(d.get('description', 'N/A'))[:100])
print('Language:', d.get('language', 'N/A'))
print('Default Branch:', d.get('default_branch', 'N/A'))
  "
  echo ""
done

# Get latest commits
for repo in alpha-project-arena beta-project-arena; do
  curl -s "https://api.github.com/repos/li1050109098/$repo/commits?per_page=1" > /tmp/gh_${repo}_commits.json 2>/dev/null
  echo "=== $repo Latest Commit ==="
  python3 -c "
import json
d = json.load(open('/tmp/gh_${repo}_commits.json'))
if isinstance(d, list) and len(d) > 0:
  c = d[0]
  print('SHA:', c.get('sha','')[:10])
  print('Author:', c.get('commit',{}).get('author',{}).get('name',''))
  print('Date:', c.get('commit',{}).get('author',{}).get('date','')[:19])
  print('Message:', c.get('commit',{}).get('message','').split('\n')[0])
elif isinstance(d, dict):
  print('Error:', d.get('message','Unknown'))
  print('Documentation URL:', d.get('documentation_url',''))
  # Check if 404
  if 'Not Found' in str(d):
    print('REPO_NOT_FOUND')
  "
  echo ""
done
