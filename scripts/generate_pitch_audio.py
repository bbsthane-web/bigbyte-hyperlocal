"""
Pitch Audio Generator — Big Byte Social Studio
Synthesizes professional, soothing Desi female neural narration (en-IN-NeerjaNeural)
Mastered to broadcast standard -14 LUFS for the client explainer presentation.
"""

import os
import asyncio
import subprocess
import edge_tts

VOICE = "en-IN-NeerjaNeural"

SLIDES = [
    {
        "id": "slide1",
        "title": "The Hidden Problem",
        "text": "Namaste! Did you know that every month... over ten thousand people in Thane search Google for trusted local doctors, dentists, salons, and repair specialists? Yet, over ninety percent of local businesses remain completely invisible. Traditional marketing agencies charge twenty thousand rupees a month for boring, generic graphics... while your business misses out on high-paying walk-in clients every single day."
    },
    {
        "id": "slide2",
        "title": "The Solution",
        "text": "Meet Big Byte Social Studio... Thane's first fully autonomous, hyperlocal AI growth engine. We create high-definition 4K video reels with natural voiceovers, eye-catching thumbnails, and exact Google Map local optimization... tailored specifically to your neighborhood, whether you are in Manpada, Hiranandani Estate, Meadows, or Majiwada."
    },
    {
        "id": "slide3",
        "title": "How It Works",
        "text": "Here is the best part: you do not need a laptop, or any technical knowledge. Every morning at ten thirty, our system prepares your customized video reel and sends a preview straight to your WhatsApp. You simply tap one button on your phone to publish... or let our cloud system run on one hundred percent autopilot. Zero effort. Zero stress."
    },
    {
        "id": "slide4",
        "title": "Proven Results",
        "text": "Look at Dr. Sharma's Advanced Dental Care in Thane West. Before joining us, they struggled with just three patient inquiries a month. Within thirty days of our daily reels and Google Map search optimization, their clinic received over forty-two new patient consultations... with zero money spent on paid ads."
    },
    {
        "id": "slide5",
        "title": "Transparent Pricing",
        "text": "We believe in honest, transparent pricing with zero lock-in contracts. Our Solo Pro plan starts at just fourteen ninety-nine rupees a month. For full four-platform coverage including daily video reels and custom thumbnails, our Agency Growth plan is just thirty-nine ninety-nine rupees a month. That is less than the cost of a single dinner."
    },
    {
        "id": "slide6",
        "title": "Get Started Free",
        "text": "Ready to dominate local search and turn nearby Thane residents into loyal customers? Tap the button below to activate your three-day free test drive. We will create your first custom video reel and Google audit completely free. Let us grow your business together!"
    }
]

async def synthesize_all():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "pitch", "audio")
    os.makedirs(out_dir, exist_ok=True)

    print("🎙️ Synthesizing Desi Lady Audio (en-IN-NeerjaNeural) for all 6 slides...")
    for s in SLIDES:
        raw_mp3 = os.path.join(out_dir, f"{s['id']}_raw.mp3")
        final_mp3 = os.path.join(out_dir, f"{s['id']}.mp3")

        print(f"  Generating {s['id']}: {s['title']}...")
        # Generate with retry to avoid Bing 503 handshake throttling
        for attempt in range(4):
            try:
                comm = edge_tts.Communicate(s["text"], voice=VOICE, rate="-6%", pitch="+0Hz")
                await comm.save(raw_mp3)
                break
            except Exception as e:
                if attempt == 3:
                    print(f"    ❌ Synthesis failed after 3 retries: {e}")
                    raise
                print(f"    ⚠️ Retrying {s['id']} (attempt {attempt+1}/3)...")
                await asyncio.sleep(2)
        
        await asyncio.sleep(1)

        # Master to -14 LUFS standard via ffmpeg loudnorm
        cmd = [
            "ffmpeg", "-y", "-i", raw_mp3,
            "-af", "loudnorm=I=-14:LRA=7:TP=-1.5",
            "-ar", "44100", "-ac", "2",
            final_mp3
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode != 0 and os.path.exists(raw_mp3):
            os.replace(raw_mp3, final_mp3)
        elif os.path.exists(raw_mp3):
            try:
                os.remove(raw_mp3)
            except Exception:
                pass

        print(f"  ✅ Saved: {final_mp3} ({os.path.getsize(final_mp3)} bytes)")

    print("\n✨ All pitch slide voiceovers synthesized successfully!")

if __name__ == "__main__":
    asyncio.run(synthesize_all())
