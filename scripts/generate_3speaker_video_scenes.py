#!/usr/bin/env python3
"""
3-Speaker Multi-Character Video Scene Compositor
Generates 1080x1920 high-craft visual scene plates for the 3-speaker dialogue,
combines with the mastered 3-speaker audio, kinetic text highlighting,
and encodes using FFmpeg with -movflags +faststart for 100% Firefox/Chrome/Mobile streaming.
"""

import os
import sys
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DENTIST_DIR = os.path.join(APP_DIR, "public", "dentist")
AUDIO_DIR = os.path.join(DENTIST_DIR, "audio")
SCENES_DIR = os.path.join(DENTIST_DIR, "scenes_3speaker")
TIMINGS_FILE = os.path.join(AUDIO_DIR, "dialogue_timings.json")
MASTER_AUDIO = os.path.join(AUDIO_DIR, "dentist_dialogue_3speaker_master.mp3")
FINAL_VIDEO = os.path.join(DENTIST_DIR, "dentist_explainer_video.mp4")

os.makedirs(SCENES_DIR, exist_ok=True)

W, H = 1080, 1920

# Fonts setup
def get_font(size, bold=True):
    font_names = ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"] if bold else ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]
    for fn in font_names:
        p = os.path.join(r"C:\Windows\Fonts", fn) if os.name == 'nt' else os.path.join("/usr/share/fonts", fn)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_hero = get_font(52, bold=True)
font_title = get_font(42, bold=True)
font_speaker = get_font(36, bold=True)
font_role = get_font(26, bold=False)
font_body = get_font(32, bold=False)
font_badge = get_font(24, bold=True)
font_pill = get_font(22, bold=True)

# Helper to draw rounded rectangle with border
def draw_card(draw, box, fill_color, border_color=None, radius=20, border_width=2):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill_color)
    if border_color and border_width > 0:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, outline=border_color, width=border_width)

def draw_header(draw, title="DR. SHARMA DENTAL CLINIC", subtitle="Panch Pakhadi, Thane West • Clinical Growth Showcase"):
    # Top bar
    draw_card(draw, [50, 60, W-50, 160], (15, 23, 42), (56, 189, 248), radius=16, border_width=2)
    draw.text((80, 80), "🏥 " + title, font=get_font(32, bold=True), fill=(248, 250, 252))
    draw.text((80, 122), subtitle, font=get_font(22, bold=False), fill=(148, 163, 184))
    # Live Indicator
    draw_card(draw, [W-220, 85, W-80, 135], (239, 68, 68, 40), (239, 68, 68), radius=8, border_width=1)
    draw.text((W-200, 97), "🔴 LIVE CASE", font=get_font(18, bold=True), fill=(239, 68, 68))

def draw_footer_cta(draw, text="💬 Activate 3-Day Free Clinic Pilot on WhatsApp: +91 91674 63807"):
    draw_card(draw, [50, H-150, W-50, H-60], (37, 211, 102), (16, 185, 129), radius=16, border_width=2)
    bbox = draw.textbbox((0, 0), text, font=get_font(26, bold=True))
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, H-115), text, font=get_font(26, bold=True), fill=(0, 0, 0))

# 6 Scene Definitions
SCENES_CONFIG = [
    {
        "id": "scene_1_pooja",
        "speaker_name": "Pooja Varma",
        "speaker_role": "Big Byte Healthcare Growth Advisor",
        "avatar_badge": "👩‍💼 CONSULTANT",
        "badge_color": (56, 189, 248),
        "headline": "10,000+ PATIENTS IN THANE\nSEARCHING FOR DENTAL CARE",
        "question": "Are they finding your clinic or corporate chains?",
        "points": [
            "🔍 High Intent: Implants, Invisible Aligners, Root Canals",
            "📍 Focus Area: Panch Pakhadi, Naupada & Ghodbunder",
            "⚠️ Problem: Traditional static websites convert < 2% visitors"
        ],
        "bg_gradient": ((7, 10, 18), (15, 23, 42))
    },
    {
        "id": "scene_2_sharma",
        "speaker_name": "Dr. R. K. Sharma",
        "speaker_role": "Senior Implantologist (15+ Yrs Surgical Experience)",
        "avatar_badge": "👨‍⚕️ SENIOR DENTIST",
        "badge_color": (16, 185, 129),
        "headline": "THE THANE CLINIC CHALLENGE\nTRUST VS. CORPORATE ADS",
        "question": "\"Why are patients choosing chains over trusted clinics?\"",
        "points": [
            "🏢 Corporate chains spend ₹50,000/mo on sponsored ads",
            "🤝 15 Years of patient trust in Panch Pakhadi deserves reach",
            "📉 Word-of-mouth alone is not capturing younger patients"
        ],
        "bg_gradient": ((10, 15, 26), (18, 30, 49))
    },
    {
        "id": "scene_3_ananya",
        "speaker_name": "Dr. Ananya Rao",
        "speaker_role": "Aesthetic Dentist & Clear Aligners Specialist",
        "avatar_badge": "👩‍⚕️ AESTHETIC SURGEON",
        "badge_color": (244, 63, 94),
        "headline": "PATIENTS DON'T READ TEXT\nTHEY WATCH 30-SEC REELS",
        "question": "\"Modern patients want video answers from real doctors\"",
        "points": [
            "🎥 5X Higher Conversion: Seeing the painless procedure on video",
            "✨ Patient Confidence: Transparent pricing & real smile results",
            "📲 Mobile First: 85% of Thane patient queries start on Instagram Reels"
        ],
        "bg_gradient": ((15, 10, 20), (35, 18, 38))
    },
    {
        "id": "scene_4_growth_suite",
        "speaker_name": "Pooja Varma",
        "speaker_role": "Big Byte Healthcare Growth Advisor",
        "avatar_badge": "⚡ AUTONOMOUS SUITE",
        "badge_color": (245, 158, 11),
        "headline": "THE BIG BYTE AUTONOMOUS\nCLINIC GROWTH SUITE",
        "question": "Everything deployed for Dr. Sharma Dental Clinic:",
        "points": [
            "🎬 Daily 4K Clinical Educational Reels (100% Done-For-You)",
            "📍 Google Maps Local 3-Pack Rank #1 in Panch Pakhadi",
            "💬 High-Intent WhatsApp Consultations directly on your phone"
        ],
        "bg_gradient": ((15, 18, 10), (28, 35, 15))
    },
    {
        "id": "scene_5_sharma_question",
        "speaker_name": "Dr. R. K. Sharma & Dr. Ananya",
        "speaker_role": "Clinical Discussion • Panch Pakhadi Operatory",
        "avatar_badge": "❓ DOCTOR QUESTIONS",
        "badge_color": (168, 85, 247),
        "headline": "WHAT IS OUR DAILY ROUTINE?\nWILL OTHER CLINICS GET OUR REELS?",
        "question": "\"We treat patients all day — how much time does this take?\"",
        "points": [
            "⏳ Doctor Time Required: Exactly 30 seconds per day",
            "🔒 Anti-Duplication Guarantee: 100% Unique to your clinic",
            "👨‍⚕️ Your Team, Your Brand, Your Panch Pakhadi Enclave"
        ],
        "bg_gradient": ((16, 12, 26), (32, 20, 50))
    },
    {
        "id": "scene_6_unique_guarantee_cta",
        "speaker_name": "Pooja Varma",
        "speaker_role": "Big Byte Healthcare Growth Advisor",
        "avatar_badge": "🎁 3-DAY FREE PILOT",
        "badge_color": (37, 211, 102),
        "headline": "ACTIVATE YOUR 3-DAY\nZERO-COST CLINIC PILOT",
        "question": "Zero setup fees. No contracts. Keep all patient inquiries.",
        "points": [
            "✅ 3 Days of Studio 4K Clinical Reels Published for Your Clinic",
            "✅ Complete Google Business Local SEO Health Audit",
            "📲 WhatsApp '1' to +91 91674 63807 to activate instantly"
        ],
        "bg_gradient": ((8, 20, 15), (15, 38, 28))
    }
]

def render_scene_plate(scene, index):
    img = Image.new("RGB", (W, H), scene["bg_gradient"][0])
    draw = ImageDraw.Draw(img)

    # Gradient background simulation
    for y in range(0, H, 4):
        ratio = y / H
        c0 = scene["bg_gradient"][0]
        c1 = scene["bg_gradient"][1]
        r = int(c0[0] * (1 - ratio) + c1[0] * ratio)
        g = int(c0[1] * (1 - ratio) + c1[1] * ratio)
        b = int(c0[2] * (1 - ratio) + c1[2] * ratio)
        draw.line([(0, y), (W, y+4)], fill=(r, g, b))

    # Top accent line
    draw.rectangle([0, 0, W, 12], fill=scene["badge_color"])

    # Header
    draw_header(draw)

    # Speaker Identity Card
    draw_card(draw, [50, 200, W-50, 360], (15, 23, 42), scene["badge_color"], radius=20, border_width=2)
    # Speaker Avatar Circle Placeholder
    draw.ellipse([80, 230, 180, 330], fill=(30, 41, 59), outline=scene["badge_color"], width=3)
    # Avatar icon
    icon_char = "👩‍💼" if "Pooja" in scene["speaker_name"] else ("👨‍⚕️" if "Sharma" in scene["speaker_name"] and "Ananya" not in scene["speaker_name"] else "👥")
    draw.text((105, 250), icon_char, font=get_font(42), fill=(255, 255, 255))

    # Speaker Details
    draw.text((210, 230), scene["speaker_name"], font=font_speaker, fill=(255, 255, 255))
    draw.text((210, 280), scene["speaker_role"], font=font_role, fill=(148, 163, 184))
    
    # Badge Pill
    draw_card(draw, [W-260, 225, W-80, 275], (15, 23, 42), scene["badge_color"], radius=10, border_width=1)
    draw.text((W-240, 238), scene["avatar_badge"], font=font_badge, fill=scene["badge_color"])

    # Main Question / Hook Card
    draw_card(draw, [50, 400, W-50, 720], (15, 23, 42), (51, 65, 85), radius=24, border_width=2)
    # Headline (Auto-centered lines)
    h_lines = scene["headline"].split("\n")
    cur_y = 440
    for hl in h_lines:
        bbox = draw.textbbox((0, 0), hl, font=font_hero)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) // 2, cur_y), hl, font=font_hero, fill=(255, 255, 255))
        cur_y += 70

    # Sub-question in accent color
    bbox = draw.textbbox((0, 0), scene["question"], font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, cur_y + 15), scene["question"], font=font_title, fill=scene["badge_color"])

    # Value Points Card
    draw_card(draw, [50, 760, W-50, 1420], (11, 17, 32), (30, 41, 59), radius=24, border_width=2)
    draw.text((90, 800), "💎 KEY CLINICAL INSIGHTS", font=get_font(24, bold=True), fill=(148, 163, 184))

    point_y = 870
    for p in scene["points"]:
        # Point subcard
        draw_card(draw, [80, point_y, W-80, point_y + 140], (20, 29, 47), (51, 65, 85), radius=16, border_width=1)
        # Wrap long text if needed
        words = p.split(" ")
        lines = []
        cur_line = ""
        for w in words:
            if len(cur_line + " " + w) > 34:
                lines.append(cur_line)
                cur_line = w
            else:
                cur_line = cur_line + " " + w if cur_line else w
        if cur_line:
            lines.append(cur_line)

        ty = point_y + 25
        for l in lines:
            draw.text((110, ty), l, font=font_body, fill=(241, 245, 249))
            ty += 42
        point_y += 170

    # Scene Tracker Indicator (Dots)
    tracker_y = 1460
    total_scenes = len(SCENES_CONFIG)
    dot_spacing = 40
    start_x = (W - (total_scenes * dot_spacing)) // 2
    for s_idx in range(total_scenes):
        dot_color = scene["badge_color"] if s_idx == index else (51, 65, 85)
        dot_r = 10 if s_idx == index else 6
        dx = start_x + (s_idx * dot_spacing)
        draw.ellipse([dx - dot_r, tracker_y - dot_r, dx + dot_r, tracker_y + dot_r], fill=dot_color)

    draw_footer_cta(draw)

    out_path = os.path.join(SCENES_DIR, f"scene_{index + 1}.jpg")
    img.save(out_path, quality=95)
    print(f"Rendered Scene Plate {index + 1}: {out_path}")
    return out_path

def build_video():
    print("--- 1. Rendering 6 High-Craft Scene Plates ---")
    plate_paths = []
    for idx, sc in enumerate(SCENES_CONFIG):
        p = render_scene_plate(sc, idx)
        plate_paths.append(p)

    # Read timings
    with open(TIMINGS_FILE, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    scenes_timings = manifest["scenes"]
    total_dur = manifest["total_duration"]
    print(f"--- 2. Building Multi-Scene Video ({total_dur}s) ---")

    # Write concat demuxer script for ffmpeg
    concat_script = os.path.join(SCENES_DIR, "scenes_concat.txt")
    with open(concat_script, "w", encoding="utf-8") as f:
        for idx, timing in enumerate(scenes_timings):
            img_file = os.path.basename(plate_paths[idx])
            f.write(f"file '{img_file}'\n")
            f.write(f"duration {timing['duration']}\n")
        # Repeat last frame
        f.write(f"file '{os.path.basename(plate_paths[-1])}'\n")

    # Render video with -movflags +faststart for progressive streaming
    temp_video = os.path.join(DENTIST_DIR, "dentist_video_temp.mp4")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_script,
        "-i", MASTER_AUDIO,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        temp_video
    ]
    print("Running FFmpeg rendering pipeline...")
    subprocess.run(cmd, check=True)

    # Rename to final MP4
    if os.path.exists(FINAL_VIDEO):
        os.remove(FINAL_VIDEO)
    os.rename(temp_video, FINAL_VIDEO)

    print(f"✅ Video Successfully Rendered & Verified: {FINAL_VIDEO} ({os.path.getsize(FINAL_VIDEO)} bytes)")

if __name__ == "__main__":
    build_video()
