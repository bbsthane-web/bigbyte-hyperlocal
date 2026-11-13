#!/usr/bin/env python3
"""
Targeted Batch Neural Voiceover Pre-Generator
Prioritizes non-tech niches (Dr. Sharma, Urban Roast, Aura Luxe) + top Big Byte posts.
"""

import sys
import os
import json
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(SCRIPT_DIR)
POSTS_FILE = os.path.join(APP_DIR, "data", "posts.json")
OUTPUT_DIR = os.path.join(APP_DIR, "public", "assets", "audio", "reels")
GEN_SCRIPT = os.path.join(SCRIPT_DIR, "generate_neural_reel_audio.py")

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(POSTS_FILE, "r", encoding="utf-8") as f:
    posts = json.load(f)

# Priority 1: Niche clients (all video posts)
niche_posts = [p for p in posts if p.get("clientId") in ["client_drsharma", "client_urbanroast", "client_aura_luxe"] and (p.get("platform") in ["youtube", "instagram"] or p.get("videoHook"))]

# Priority 2: Top 3 Big Byte posts
bb_posts = [p for p in posts if p.get("clientId") == "client_bigbyte" and p.get("id") in ["post_bb_01", "post_bb_02", "post_bb_03"]]

target_posts = niche_posts + bb_posts
print(f"Total targeted posts to generate: {len(target_posts)}")

for post in target_posts:
    cid = post.get("clientId")
    pid = post.get("id")
    
    text = f"{post.get('videoHook', '')}. {post.get('script') or post.get('content', '')[:160]}"
    if not text.strip():
        continue

    # Generate both female_in (Neerja) and male_in (Prabhat)
    for voice in ["female_in", "male_in"]:
        out_file = os.path.join(OUTPUT_DIR, f"reel_{pid}_{voice}.mp3")
        if os.path.exists(out_file) and os.path.getsize(out_file) > 10000:
            print(f"Already exists: {os.path.basename(out_file)}")
            continue

        print(f"Generating: [{cid}] {pid} ({voice})...")
        cmd = [
            sys.executable,
            GEN_SCRIPT,
            "--text", text,
            "--voice", voice,
            "--output", out_file
        ]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print(f" -> Completed: {os.path.basename(out_file)}")
        except Exception as e:
            print(f" -> Error on {pid}: {e}")

print("Targeted neural audio batch finished successfully!")
