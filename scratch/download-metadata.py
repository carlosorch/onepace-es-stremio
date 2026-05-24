# scratch/download-metadata.py
import urllib.request
import json
import os

urls = [
    ("ladyisatis_main_arcs", "https://raw.githubusercontent.com/ladyisatis/one-pace-metadata/main/arcs.json"),
    ("ladyisatis_master_arcs", "https://raw.githubusercontent.com/ladyisatis/one-pace-metadata/master/arcs.json"),
    ("jasanpreet_main_arcs", "https://raw.githubusercontent.com/jasanpreetn9/onepace-metadata/main/arcs.json"),
    ("jasanpreet_master_arcs", "https://raw.githubusercontent.com/jasanpreetn9/onepace-metadata/master/arcs.json"),
    ("jasanpreet_main_eps", "https://raw.githubusercontent.com/jasanpreetn9/onepace-metadata/main/episodes.json"),
    ("jasanpreet_master_eps", "https://raw.githubusercontent.com/jasanpreetn9/onepace-metadata/master/episodes.json"),
]

print("Testing raw GitHub URLs for One Pace metadata...")
for label, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = response.read()
                # Try parsing as JSON to verify
                parsed = json.loads(data.decode('utf-8'))
                print(f"[SUCCESS] {label} works! URL: {url}")
                print(f"  Parsed JSON successfully. Type: {type(parsed)}")
                if isinstance(parsed, list):
                    print(f"  Length: {len(parsed)} items")
                    if len(parsed) > 0:
                        print(f"  Sample item key(s): {list(parsed[0].keys())}")
                elif isinstance(parsed, dict):
                    print(f"  Keys: {list(parsed.keys())}")
            else:
                print(f"[FAILED] {label} returned status: {response.status}")
    except Exception as e:
        print(f"[FAILED] {label} errored: {str(e)}")
