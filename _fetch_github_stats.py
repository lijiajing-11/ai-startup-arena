#!/usr/bin/env python3
import json, urllib.request
# Alpha repo check
req = urllib.request.Request("https://api.github.com/repos/li1050109098/alpha-project-arena")
resp = urllib.request.urlopen(req, timeout=10)
d = json.loads(resp.read())
print("=== ALPHA ===")
print("exists:", "id" in d and d.get("message") != "Not Found")
print("stars:", d.get("stargazers_count", "N/A"))
print("forks:", d.get("forks_count", "N/A"))
print("pushed:", d.get("pushed_at", "N/A"))
print("lang:", d.get("language", "N/A"))

# Beta repo check
req2 = urllib.request.Request("https://api.github.com/repos/li1050109098/beta-project-arena")
resp2 = urllib.request.urlopen(req2, timeout=10)
d2 = json.loads(resp2.read())
print("=== BETA ===")
print("exists:", "id" in d2 and d2.get("message") != "Not Found")
print("stars:", d2.get("stargazers_count", "N/A"))
print("forks:", d2.get("forks_count", "N/A"))
print("pushed:", d2.get("pushed_at", "N/A"))
print("lang:", d2.get("language", "N/A"))
