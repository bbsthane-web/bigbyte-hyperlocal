"""
Generate Studio Podcast Interview Audio using edge-tts
Features:
- Ananya: en-IN-NeerjaExpressiveNeural (Investigative Host)
- Vikram: en-IN-PrabhatNeural (Growth Strategist)
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

SEGMENTS = [
    {
        "file": "seg1_missed_calls.mp3",
        "tracks": [
            {"speaker": "ananya", "voice": VOICE_ANANYA, "rate": "+1%", "text": "Vikram, business owners in Thane and Mumbai often tell me: 'We are already busy during the day. Why should I care if someone calls my clinic or office after 8 PM?' What are they actually missing?"},
            {"speaker": "vikram", "voice": VOICE_VIKRAM, "rate": "+2%", "text": "Ananya, over 40% of local Google Maps searches in Thane happen after 7:30 PM. When someone with an urgent toothache or a homeowner looking for 3BHK interiors calls and gets no answer, 90% don't wait—they book with a competitor in 6 seconds. Our system deploys an instant 4-second WhatsApp recovery bot that saves that customer before they can even dial competitor number two."}
        ]
    },
    {
        "file": "seg2_review_shield.mp3",
        "tracks": [
            {"speaker": "ananya", "voice": VOICE_ANANYA, "rate": "+1%", "text": "Doctors and luxury designers have a huge fear of bad reviews online. How does BigByte Systems protect them from unfair 1-star reviews while propelling them into the Google 3-Pack?"},
            {"speaker": "vikram", "voice": VOICE_VIKRAM, "rate": "+2%", "text": "We engineered a proprietary Negative Review Shield. When an automated review request is triggered on WhatsApp, 4 and 5-star happy clients are guided straight to public Google Maps. But if a client taps 1, 2, or 3 stars, it routes to a private owner feedback form. The owner resolves it privately, and the negative review never touches Google Maps."}
        ]
    },
    {
        "file": "seg3_omnichannel_geogrid.mp3",
        "tracks": [
            {"speaker": "ananya", "voice": VOICE_ANANYA, "rate": "+1%", "text": "Most marketing agencies give clients complicated software dashboards that nobody has time to check. How simple is this for a busy business owner to manage?"},
            {"speaker": "vikram", "voice": VOICE_VIKRAM, "rate": "+2%", "text": "Zero complex software, Ananya. We consolidate Google Maps messages, WhatsApp inquiries, and phone calls into a single, structured WhatsApp feed directly on the owner's phone. Plus, our live 5-kilometer Geo-Grid radar actively expands their Google rankings block by block across Naupada, Majiwada, and Ghodbunder Road."}
        ]
    },
    {
        "file": "seg4_roi_action.mp3",
        "tracks": [
            {"speaker": "ananya", "voice": VOICE_ANANYA, "rate": "+1%", "text": "And what about the commercial investment? How quickly does a local clinic or contractor break even?"},
            {"speaker": "vikram", "voice": VOICE_VIKRAM, "rate": "+2%", "text": "Just one single high-ticket client or dental implant covers their entire annual investment. We deploy the full system within 48 hours with zero lock-in contracts. To claim your free 48-hour hyperlocal audit, tap the WhatsApp button below right now."}
        ]
    }
]


async def generate_segment(segment):
    temp_files = []
    for idx, t in enumerate(segment["tracks"]):
        t_file = AUDIO_DIR / f"temp_{segment['file']}_{idx}.mp3"
        comm = edge_tts.Communicate(t["text"], t["voice"], rate=t["rate"])
        await comm.save(str(t_file))
        temp_files.append(t_file)
        
    out_file = AUDIO_DIR / segment["file"]
    # Concatenate temp audio files
    with open(out_file, "wb") as outfile:
        for tf in temp_files:
            with open(tf, "rb") as infile:
                outfile.write(infile.read())
            tf.unlink(missing_ok=True)
    print(f"✅ Generated {segment['file']} ({out_file.stat().st_size} bytes)")


async def main():
    print("🎙️ Generating Studio Interviewer VSL Audio (Ananya & Vikram)...")
    for seg in SEGMENTS:
        await generate_segment(seg)
    print("🎉 All Interview VSL audio segments synthesized successfully!")


if __name__ == "__main__":
    asyncio.run(main())
