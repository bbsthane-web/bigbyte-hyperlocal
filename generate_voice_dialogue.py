"""
Generate high-quality dual-speaker dialogues for Voice-Enabled AI Receptionist Demo.
Uses edge-tts (Maya: en-IN-NeerjaNeural, Caller: en-IN-PrabhatNeural).
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

AUDIO_DIR = Path(__file__).resolve().parent / "assets" / "audio" / "voice_agent"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VOICE_MAYA = "en-IN-NeerjaNeural"    # Warm, professional Indian female voice
VOICE_CALLER = "en-IN-PrabhatNeural"  # Natural Indian male caller voice

DIALOGUES = [
    # Dental Clinic Scenario
    {
        "file": "dental_1_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "Hello! Thank you for calling Dr. Vora's Smiles and Beyond in Naupada. I am Maya, the clinic's automated assistant. How may I help you this evening?"
    },
    {
        "file": "dental_2_caller.mp3",
        "voice": VOICE_CALLER,
        "text": "Hi Maya, I have severe pain in my lower molar since yesterday. Can I see Dr. Vora tomorrow morning?"
    },
    {
        "file": "dental_3_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "I'm so sorry to hear you're in pain! Dr. Vora has emergency consultation slots available tomorrow at 10:30 AM and 11:45 AM. Which time works best for you?"
    },
    {
        "file": "dental_4_caller.mp3",
        "voice": VOICE_CALLER,
        "text": "10:30 AM works perfectly for me."
    },
    {
        "file": "dental_5_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "Great, 10:30 AM is reserved for your molar consultation. May I please have your full name?"
    },
    {
        "file": "dental_6_caller.mp3",
        "voice": VOICE_CALLER,
        "text": "Sure, it is Rajesh Sharma."
    },
    {
        "file": "dental_7_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "Thank you, Mr. Sharma! Your appointment with Dr. Vora is locked in for tomorrow at 10:30 AM. I have just sent your booking confirmation and clinic directions to your WhatsApp. Have a restful night!"
    },
    
    # Interior Designer Scenario
    {
        "file": "interior_1_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "Hello! Welcome to Majiwada Interior Studio. I am Rhea, your automated design assistant. Are you looking for a residential or commercial renovation consultation?"
    },
    {
        "file": "interior_2_caller.mp3",
        "voice": VOICE_CALLER,
        "text": "Hi, I just bought a new 3BHK in Majiwada. We need complete turnkey interiors starting next month. Can someone visit our flat for site measurements?"
    },
    {
        "file": "interior_3_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "Congratulations on your new home! Our senior interior architect can visit your flat this Saturday at 2:00 PM for a free 3D layout consultation. Shall I schedule that for you?"
    },
    {
        "file": "interior_4_caller.mp3",
        "voice": VOICE_CALLER,
        "text": "Yes please, Saturday at 2 PM is great."
    },
    {
        "file": "interior_5_maya.mp3",
        "voice": VOICE_MAYA,
        "text": "Wonderful! Saturday 2:00 PM is confirmed. I've sent our portfolio catalog and designer contact details to your WhatsApp. We look forward to creating your dream space!"
    }
]


async def generate_dialogues():
    print("🎙️ Synthesizing Voice Agent Demo audio files...")
    for item in DIALOGUES:
        out_path = AUDIO_DIR / item["file"]
        communicate = edge_tts.Communicate(item["text"], item["voice"], rate="+2%")
        await communicate.save(str(out_path))
        print(f"   ✅ Saved {item['file']}")
    print("🎉 All Voice Agent audio files created successfully!")


if __name__ == "__main__":
    asyncio.run(generate_dialogues())
