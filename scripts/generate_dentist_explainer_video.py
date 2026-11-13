#!/usr/bin/env python3
"""
Cinecode Programmatic Video Generator — Dentist Explainer Video
Renders a 1080x1920 9:16 vertical MP4 video with Neerja Neural voiceover.
"""

import sys
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(SCRIPT_DIR)
DENTIST_DIR = os.path.join(APP_DIR, "public", "dentist")
AUDIO_FILE = os.path.join(DENTIST_DIR, "audio", "full_dentist_explainer.mp3")
FINAL_MP4 = os.path.join(DENTIST_DIR, "dentist_explainer_video.mp4")
SLIDES_DIR = os.path.join(DENTIST_DIR, "slides")

os.makedirs(SLIDES_DIR, exist_ok=True)

# Generate 4 slide frames using PIL
W, H = 1080, 1920
font_path_title = r"C:\Windows\Fonts\ariblk.ttf" if os.name == 'nt' else "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_path_body = r"C:\Windows\Fonts\segoeuib.ttf" if os.name == 'nt' else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

font_hero = get_font(font_path_title, 64)
font_title = get_font(font_path_title, 48)
font_sub = get_font(font_path_body, 36)
font_badge = get_font(font_path_body, 28)
font_body = get_font(font_path_body, 32)

SLIDES_DATA = [
    {
        "badge": "🚨 CLINIC GROWTH CHALLENGE",
        "badge_color": (239, 68, 68),
        "title": "10,000+ PATIENTS IN THANE\nSEARCH FOR DENTAL CARE",
        "subtitle": "Are they finding your clinic or your competitor's?",
        "points": [
            "• Teeth Whitening, Aligners & Root Canals",
            "• Video answers get 5X more patient bookings",
            "• Traditional websites no longer convert"
        ],
        "bg_color": (9, 13, 22),
        "accent": (239, 68, 68)
    },
    {
        "badge": "✨ WHAT YOUR PRACTICE GETS",
        "badge_color": (16, 185, 129),
        "title": "THE 3 AUTOMATED\nGROWTH PILLARS",
        "subtitle": "Turn your clinic into the #1 authority in your enclave",
        "points": [
            "🎬 Daily 4K Clinical Video Reels & Shorts",
            "📍 Google Maps 3-Pack Rank (#1 in Thane)",
            "💬 Direct WhatsApp Patient Inquiries"
        ],
        "bg_color": (9, 13, 22),
        "accent": (16, 185, 129)
    },
    {
        "badge": "📲 ZERO TECH HEADACHE",
        "badge_color": (56, 189, 248),
        "title": "THE 30-SECOND\nDAILY ROUTINE",
        "subtitle": "No camera awkwardness. No video editing.",
        "points": [
            "⏰ 10:00 AM: Receive WhatsApp draft preview",
            "👆 Review in 30 seconds & reply '1' to approve",
            "🚀 Published across Instagram, YouTube & Google!"
        ],
        "bg_color": (9, 13, 22),
        "accent": (56, 189, 248)
    },
    {
        "badge": "🎁 ZERO RISK TRIAL",
        "badge_color": (245, 158, 11),
        "title": "ACTIVATE YOUR 3-DAY\nFREE DENTAL PILOT",
        "subtitle": "Zero setup fee. No contracts. Keep all patient leads.",
        "points": [
            "✅ 3 Full Days of Clinical Video Reels",
            "✅ Google Maps SEO Health Audit",
            "💬 WhatsApp: +91 91674 63807"
        ],
        "bg_color": (9, 13, 22),
        "accent": (245, 158, 11)
    }
]

rendered_slides = []
for i, slide in enumerate(SLIDES_DATA):
    img = Image.new("RGB", (W, H), slide["bg_color"])
    draw = ImageDraw.Draw(img)

    # Accent Top Glow
    draw.rectangle([0, 0, W, 20], fill=slide["accent"])

    # Top Badge
    draw.rounded_rectangle([70, 160, 520, 230], radius=35, fill=slide["badge_color"])
    draw.text((95, 178), slide["badge"], fill=(255, 255, 255), font=font_badge)

    # Title
    draw.text((70, 320), slide["title"], fill=(255, 255, 255), font=font_hero, spacing=14)

    # Subtitle
    draw.text((70, 540), slide["subtitle"], fill=slide["accent"], font=font_sub)

    # Card Box for Points
    draw.rounded_rectangle([70, 680, W - 70, 1380], radius=24, fill=(17, 24, 39), outline=slide["accent"], width=3)

    y = 750
    for p in slide["points"]:
        draw.text((110, y), p, fill=(241, 245, 249), font=font_title)
        y += 180

    # Lower Third Branding
    draw.rounded_rectangle([70, 1480, W - 70, 1740], radius=20, fill=(15, 23, 42), outline=(255, 255, 255, 40), width=2)
    draw.text((110, 1530), "🦷 DR. SHARMA DENTAL CLINIC", fill=(255, 255, 255), font=font_title)
    draw.text((110, 1620), "Panch Pakhadi, Thane West • Powered by Big Byte Systems", fill=(148, 163, 184), font=font_badge)

    out_path = os.path.join(SLIDES_DIR, f"slide_{i+1}.jpg")
    img.save(out_path, quality=95)
    rendered_slides.append(out_path)
    print(f"Rendered slide: {out_path}")

# Now render MP4 video with FFmpeg
ffmpeg_bin = "ffmpeg"
installer_path = os.path.join(APP_DIR, "node_modules", "@ffmpeg-installer", "win32-x64", "ffmpeg.exe")
if os.path.exists(installer_path):
    ffmpeg_bin = installer_path

# Create concat demuxer file
concat_txt = os.path.join(SLIDES_DIR, "concat.txt")
durations = [28, 30, 32, 22] # roughly matches audio scenes
with open(concat_txt, "w") as f:
    for i, slide in enumerate(rendered_slides):
        f.write(f"file '{os.path.abspath(slide)}'\n")
        f.write(f"duration {durations[i]}\n")
    f.write(f"file '{os.path.abspath(rendered_slides[-1])}'\n")

print("Rendering final MP4 video via FFmpeg...")
cmd = [
    ffmpeg_bin,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_txt,
    "-i", AUDIO_FILE,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    FINAL_MP4
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
if res.returncode == 0 and os.path.exists(FINAL_MP4):
    print(f"SUCCESS: MP4 video generated at {FINAL_MP4} ({os.path.getsize(FINAL_MP4)} bytes)")
else:
    print(f"FFmpeg Notice (code {res.returncode}): {res.stderr.decode('utf-8', errors='ignore')}")
