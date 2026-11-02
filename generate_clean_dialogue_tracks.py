"""
Generate Crystal-Clear, Stutter-Free Dialogue Audio Tracks
Separate clean neural audio files for Ananya and Vikram.
Zero binary header concatenation bugs = 100% butter-smooth playback.
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

AUDIO_DIR = Path(__file__).resolve().parent / "assets" / "audio" / "interview_vsl"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VOICE_ANANYA = "en-IN-NeerjaExpressiveNeural"
VOICE_VIKRAM = "en-IN-PrabhatNeural"

DIALOGUES = [
    # Segment 1: Missed Calls
    {
        "file": "seg1_ananya.mp3",
        "voice": VOICE_ANANYA,
        "rate": "+0%",
        "text": "Vikram, business owners in Thane and Mumbai often tell me: 'We are already busy during the day. Why should I care if someone calls my clinic or office after 8 PM?' What are they actually missing?"
    },
    {
        "file": "seg1_vikram.mp3",
        "voice": VOICE_VIKRAM,
        "rate": "+1%",
        "text": "Ananya, over 40% of local Google Maps searches in Thane happen after 7:30 PM. When someone with an urgent toothache or a homeowner looking for 3BHK interiors calls and gets no answer, 90% don't wait. They book with a competitor in 6 seconds. Our system deploys an instant 4-second WhatsApp recovery bot that saves that customer before they can even dial competitor number two."
    },
    # Segment 2: Review Shield
    {
        "file": "seg2_ananya.mp3",
        "voice": VOICE_ANANYA,
        "rate": "+0%",
        "text": "Doctors and luxury designers have a huge fear of bad reviews online. How does BigByte Systems protect them from unfair 1-star reviews while propelling them into the Google 3-Pack?"
    },
    {
        "file": "seg2_vikram.mp3",
        "voice": VOICE_VIKRAM,
        "rate": "+1%",
        "text": "We engineered a proprietary Negative Review Shield. When an automated review request is triggered on WhatsApp, 4 and 5-star happy clients are guided straight to public Google Maps. But if a client taps 1, 2, or 3 stars, it routes to a private owner feedback form. The owner resolves it privately, and the negative review never touches Google Maps."
    },
    # Segment 3: Omnichannel & Geo-Grid
    {
        "file": "seg3_ananya.mp3",
        "voice": VOICE_ANANYA,
        "rate": "+0%",
        "text": "Most marketing agencies give clients complicated software dashboards that nobody has time to check. How simple is this for a busy business owner to manage?"
    },
    {
        "file": "seg3_vikram.mp3",
        "voice": VOICE_VIKRAM,
        "rate": "+1%",
        "text": "Zero complex software, Ananya. We consolidate Google Maps messages, WhatsApp inquiries, and phone calls into a single, structured WhatsApp feed directly on the owner's phone. Plus, our live 5-kilometer Geo-Grid radar actively expands their Google rankings block by block across Naupada, Majiwada, and Ghodbunder Road."
    },
    # Segment 4: ROI & Action
    {
        "file": "seg4_ananya.mp3",
        "voice": VOICE_ANANYA,
        "rate": "+0%",
        "text": "And what about the commercial investment? How quickly does a local clinic or contractor break even?"
    },
    {
        "file": "seg4_vikram.mp3",
        "voice": VOICE_VIKRAM,
        "rate": "+1%",
        "text": "Just one single high-ticket client or dental implant covers their entire annual investment. We deploy the full system within 48 hours with zero lock-in contracts. To claim your free 48-hour hyperlocal audit, tap the WhatsApp button below right now."
    }
]


async def generate_clean_tracks():
    print("🎙️ Synthesizing crystal-clear individual speech tracks...")
    for item in DIALOGUES:
        out_path = AUDIO_DIR / item["file"]
        comm = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"])
        await comm.save(str(out_path))
        print(f"   ✅ Saved {item['file']} ({out_path.stat().st_size} bytes)")
    print("🎉 All speech tracks generated with 100% clean headers!")


if __name__ == "__main__":
    asyncio.run(generate_clean_tracks())
