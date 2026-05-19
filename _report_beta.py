#!/usr/bin/env python3
import json, sys, os, urllib.request
token = open('/tmp/gh_token.txt').read().strip()
req = urllib.request.Request("https://api.github.com/repos/li1050109098/beta-project-arena")
req.add_header("Authorization", f"token {token}")
try:
    resp = urllib.request.urlopen(req, timeout=10)
    d = json.loads(resp.read())
    print("exists: true")
    print("stars:", d.get("stargazers_count", 0))
    print("updated:", d.get("pushed_at", "N/A"))
    print("desc:", d.get("description", "N/A"))
    print("forks:", d.get("forks_count", 0))
except Exception as e:
    print("exists: false")
    print("error:", str(e))
