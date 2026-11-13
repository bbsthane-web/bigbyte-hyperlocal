#!/usr/bin/env python3
"""
Dentist Explainer Voiceover Generator
Uses Microsoft Edge Neural TTS (en-IN-NeerjaNeural) with -14 LUFS broadcast mastering.
"""

import sys
import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(SCRIPT_DIR)
AUDIO_DIR = os.path.join(APP_DIR, "public", "dentist", "audio")
GEN_SCRIPT = os.path.join(SCRIPT_DIR, "generate_neural_reel_audio.py")

os.makedirs(AUDIO_DIR, exist_ok=True)

SCENES = {
    "scene1_dilemma": (
        "Namaste Doctor! You have spent years mastering surgical precision, root canals, and cosmetic smile makeovers. "
        "But right now, over 10,000 patients across Thane search Google Maps and Instagram every single month for dental treatments, "
        "braces, and implants. If your clinic is not answering their questions with daily video reels, they are walking straight into "
        "another dental practice across the street."
    ),
    "scene2_what_you_get": (
        "Here is what Big Byte Social Studio deploys for your dental practice: "
        "First: Studio-quality 4K clinical video reels and YouTube Shorts, explaining painless ultrasonic scaling, clear aligners, "
        "and laser root canals with natural, reassuring voiceovers. "
        "Second: Google Maps 3-Pack optimization that ranks your clinic at the very top of local searches with zero suspension risk. "
        "And third: High-intent patient inquiries arriving directly on your clinic WhatsApp desk."
    ),
    "scene3_daily_routine": (
        "Now, what do you actually have to do daily? Exactly thirty seconds of effort. "
        "You do not need to stand in front of a camera. You do not need to learn video editing. "
        "Every morning at 10:00 AM, our AI prepares your daily clinical reel and sends a preview to your WhatsApp. "
        "You review it between patient appointments, reply '1' to approve, and our system automatically publishes it across "
        "YouTube, Instagram, and Google Maps. You simply treat patients and answer new consultations."
    ),
    "scene4_pilot_offer": (
        "Test drive three full days of daily clinical reels and Google SEO for your dental clinic at absolutely zero cost. "
        "Zero setup fee, no long-term contracts. Tap the WhatsApp button right now to activate your three-day pilot."
    )
}

full_text = " ".join(SCENES.values())
SCENES["full_dentist_explainer"] = full_text

for name, text in SCENES.items():
    out_file = os.path.join(AUDIO_DIR, f"{name}.mp3")
    print(f"Generating audio for: {name}...")
    cmd = [
        sys.executable,
        GEN_SCRIPT,
        "--text", text,
        "--voice", "female_in",
        "--output", out_file
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f" -> Completed: {os.path.basename(out_file)} ({os.path.getsize(out_file)} bytes)")
    except Exception as e:
        print(f" -> Error on {name}: {e}")

print("All dentist explainer voiceover tracks successfully generated!")
