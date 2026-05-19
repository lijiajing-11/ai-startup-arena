#!/usr/bin/env python3
import json, sys, os, urllib.request
token = open('/tmp/gh_token.txt').read().strip()
req = urllib.request.Request("https://api.github.com/repos/li1050109098/alpha-project-arena/commits?per_page=1")
req.add_header("Authorization", f"token {token}")
try:
    resp = urllib.request.urlopen(req, timeout=10)
    data = json.loads(resp.read())
    if isinstance(data, list) and len(data) > 0:
        c = data[0]
        print("sha:", c.get("sha", "")[:8])
        print("message:", c.get("commit", {}).get("message", "N/A").split("\n")[0])
        print("author:", c.get("commit", {}).get("author", {}).get("name", "N/A"))
        print("date:", c.get("commit", {}).get("author", {}).get("date", "N/A"))
    else:
        print("commits: none")
except Exception as e:
    print("error:", str(e))
