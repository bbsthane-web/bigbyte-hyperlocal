"""
Generate soothing, realistic Indian female sales narration using edge-tts (en-IN-NeerjaExpressiveNeural).
100% Free, zero API cost.
"""

import asyncio
import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent / "assets" / "audio" / "vsd_v2"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-IN-NeerjaExpressiveNeural"  # Expressive, warm, highly natural Indian female sales voice

SCRIPTS = [
    {
        "file": "scene1_hook.mp3",
        "text": "Every day across Thane and Mumbai, high-paying clients search Google Maps, Instagram, and local search for trusted professionals. But if your phone rings busy, your website is sluggish, or competitors have three times your reviews, those clients vanish in seconds. At BigByte Systems, we stop this customer drop permanently and plug your revenue drain completely."
    },
    {
        "file": "scene2_pillars.mp3",
        "text": "We provide a complete, three-hundred-and-sixty degree growth engine across five distinct pillars. First, our twenty-four-seven WhatsApp and Voice AI captures every missed call within three seconds. Second, our automated review multiplier propels your profile into the Google three-pack. Third, we build sub-second mobile websites that convert visitors into paying clients. Fourth, our hyperlocal SEO and AI search schemas get you recommended on ChatGPT and Google. And fifth, our social media management keeps your brand visible across Instagram Reels, Facebook, and Google updates."
    },
    {
        "file": "scene3_niches.mp3",
        "text": "Whether you are a dental clinic, an interior designer, a civil contractor, a real estate agency, or a luxury salon, our system customizes to your exact client ticket size and service workflow. You don't manage complicated tools; we deliver booked consultations straight to your phone."
    },
    {
        "file": "scene4_pricing.mp3",
        "text": "Our pricing is transparent and designed for pure profit. A one-time setup to build and launch your entire digital infrastructure, plus an affordable monthly retainer to keep your SEO, reviews, and lead flows growing on autopilot. If we recover just one or two high-ticket clients, your investment is completely recovered."
    },
    {
        "file": "scene5_cta.mp3",
        "text": "Ready to turn your business into a client magnet across Thane and Mumbai? Tap the WhatsApp button below to get your free forty-eight hour audit and custom preview today."
    }
]


async def generate_vsd_voice():
    print("🎙️ Synthesizing soothing expressive Indian sales voice (en-IN-NeerjaExpressiveNeural)...")
    for item in SCRIPTS:
        out_path = AUDIO_DIR / item["file"]
        communicate = edge_tts.Communicate(item["text"], VOICE, rate="+1%", pitch="+0Hz")
        await communicate.save(str(out_path))
        print(f"   ✅ Saved {item['file']} ({out_path.stat().st_size} bytes)")
    print("🎉 All VSD v2.0 narration tracks generated successfully!")


if __name__ == "__main__":
    asyncio.run(generate_vsd_voice())
