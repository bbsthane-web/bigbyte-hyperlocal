"""
Generate high-fidelity neural voiceover narration for the Video Sales Presentation using edge-tts.
100% Free, zero API cost.
"""

import asyncio
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent / "assets" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-IN-PrabhatNeural"  # Professional, confident Indian English neural voice

SCENES = [
    {
        "id": "scene1",
        "file": "scene1_the_invisible_leak.mp3",
        "text": "Every single day, local businesses in your city are bleeding high-paying customers without even realizing it. Imagine a customer searching on Google Maps for a clinic or designer. They find your listing, tap the call button, but your clinic is closed or your staff is busy. The phone rings out. In less than ten seconds, that customer taps the back button, goes to your competitor, and books with them instead. That single missed call just cost you twelve thousand to fifty thousand rupees."
    },
    {
        "id": "scene2",
        "file": "scene2_the_google_trap.mp3",
        "text": "Why does this happen? Because modern customers no longer leave voicemails, and they hate filling out long website forms. If you have fewer than 35 reviews, no website, or no instant messaging option, you are practically invisible in the Google 3-Pack. Your competitors with 200 reviews and instant WhatsApp booking are vacuuming up over 70% of the entire neighbourhood's search traffic."
    },
    {
        "id": "scene3",
        "file": "scene3_the_solution.mp3",
        "text": "This is where BigByte Lead Radar transforms your business. We deploy an autonomous, 24/7 WhatsApp Lead Capture Gateway directly onto your Google Maps and local listings. When a prospect views your profile, one tap opens an instant WhatsApp chat. Our smart assistant greets them in three seconds, answers their questions, and books their appointment directly into your calendar, even while you sleep."
    },
    {
        "id": "scene4",
        "file": "scene4_the_review_multiplier.mp3",
        "text": "Next, we solve your visibility problem. The moment a client finishes their appointment, our system automatically triggers a gentle, personalized WhatsApp review prompt. Within 60 days, your reviews jump from 20 to over 150 five-star ratings, pushing you directly into the coveted Google Top 3 Local Pack."
    },
    {
        "id": "scene5",
        "file": "scene5_the_roi_math.mp3",
        "text": "Let's look at the real math. If our system captures just two or three missed inquiries every month, that is thirty thousand to one lakh rupees in additional net revenue directly into your bank account. A complete no-brainer return on investment that pays for itself in the first 7 days."
    },
    {
        "id": "scene6",
        "file": "scene6_the_call_to_action.mp3",
        "text": "You don't need expensive software, you don't need technical skills, and you don't pay any recurring fees. We build and launch your custom 1-tap WhatsApp booking engine in 48 hours. Tap the button below to claim your free 30-second live demo for your business today."
    }
]


async def generate_all():
    print("🎙️ Generating lifelike neural voiceover tracks with edge-tts...")
    for idx, scene in enumerate(SCENES, 1):
        out_path = AUDIO_DIR / scene["file"]
        print(f"[{idx}/{len(SCENES)}] Synthesizing {scene['file']}...")
        communicate = edge_tts.Communicate(scene["text"], VOICE, rate="+3%")
        await communicate.save(str(out_path))
        print(f"   ✅ Saved {out_path.name} ({out_path.stat().st_size} bytes)")
    print("\n🎉 All 6 narration tracks generated successfully!")


if __name__ == "__main__":
    asyncio.run(generate_all())
