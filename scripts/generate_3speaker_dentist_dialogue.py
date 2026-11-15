#!/usr/bin/env python3
"""
3-Speaker Conversational Dialogue Generator for Dental Practice
Speakers:
1. Pooja Varma — Big Byte Healthcare Growth Advisor (en-IN-NeerjaExpressiveNeural)
2. Dr. R. K. Sharma — Senior Implantologist, Panch Pakhadi (en-IN-PrabhatNeural)
3. Dr. Ananya Rao — Aesthetic Dentist & Aligners Specialist (en-IN-NeerjaNeural, pitch +3Hz)
"""

import os
import sys
import asyncio
import subprocess
import edge_tts

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(APP_DIR, "public", "dentist", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

DIALOGUE_LINES = [
    {
        "id": "line_1_pooja",
        "speaker": "Pooja (Big Byte Advisor)",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "text": "Namaste Doctor Sharma! Over ten thousand patients in Thane search Google Maps and Instagram every single month for dental implants, root canals, and smile makeovers. But where are they actually booking?"
    },
    {
        "id": "line_2_sharma",
        "speaker": "Dr. Sharma (Senior Implantologist)",
        "voice": "en-IN-PrabhatNeural",
        "rate": "+1%",
        "pitch": "-2Hz",
        "text": "They're walking straight into the big corporate chains on Ghodbunder Road. We have fifteen years of surgical trust here in Panch Pakhadi, but our website barely converts five patient calls a week. Patients think all dental clinics are the same."
    },
    {
        "id": "line_3_ananya",
        "speaker": "Dr. Ananya (Aesthetic Dentist)",
        "voice": "en-IN-NeerjaNeural",
        "rate": "+4%",
        "pitch": "+3Hz",
        "text": "Because patients today don't read text websites! When people have tooth pain or want invisible aligners, they want thirty-second video answers from real doctors explaining the painless procedure, transparent pricing, and real patient smiles."
    },
    {
        "id": "line_4_pooja",
        "speaker": "Pooja (Big Byte Advisor)",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "text": "Exactly! That is what the Big Byte Autonomous Clinic Growth Suite automates for Dr. Sharma Dental Clinic. Daily studio-quality 4K clinical reels, one-tap WhatsApp patient booking, and top Google Three-Pack local ranking."
    },
    {
        "id": "line_5_sharma",
        "speaker": "Dr. Sharma (Senior Implantologist)",
        "voice": "en-IN-PrabhatNeural",
        "rate": "+1%",
        "pitch": "-2Hz",
        "text": "What is our daily routine, and will other dental clinics in Thane get our exact same reels?"
    },
    {
        "id": "line_6_pooja",
        "speaker": "Pooja (Big Byte Advisor)",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "text": "Zero duplicate templates. Every reel features your clinic branding, your team, and your Panch Pakhadi location. Your daily routine? Exactly thirty seconds: we send today's reel preview to your WhatsApp at ten a.m. You review it, reply 'One' to approve, and our system publishes it everywhere while you treat patients. Tap the WhatsApp button to activate your three-day pilot at zero cost."
    }
]

async def synthesize_all():
    generated_files = []
    print("--- Synthesizing 3-Speaker Desi Neural Dialogue ---")
    for item in DIALOGUE_LINES:
        out_mp3 = os.path.join(AUDIO_DIR, f"{item['id']}.mp3")
        print(f"Generating [{item['speaker']}]: {item['id']}...")
        comm = edge_tts.Communicate(item['text'], item['voice'], rate=item['rate'], pitch=item['pitch'])
        await comm.save(out_mp3)
        generated_files.append(out_mp3)
        print(f" -> Saved {os.path.basename(out_mp3)} ({os.path.getsize(out_mp3)} bytes)")

    # Measure exact durations using ffprobe
    concat_list_file = os.path.join(AUDIO_DIR, "concat_dialogue.txt")
    timing_manifest = []
    current_time = 0.0

    with open(concat_list_file, "w", encoding="utf-8") as f:
        for idx, mp3 in enumerate(generated_files):
            cmd = [
                "ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1", mp3
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            dur = float(res.stdout.strip())
            timing_manifest.append({
                "id": DIALOGUE_LINES[idx]["id"],
                "speaker": DIALOGUE_LINES[idx]["speaker"],
                "start": round(current_time, 2),
                "duration": round(dur, 2),
                "end": round(current_time + dur, 2)
            })
            current_time += dur
            f.write(f"file '{os.path.basename(mp3)}'\n")

    # Concatenate all lines into one master raw track
    raw_master = os.path.join(AUDIO_DIR, "dialogue_raw_master.mp3")
    concat_cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_file, "-c", "copy", raw_master
    ]
    subprocess.run(concat_cmd, check=True)

    # Master to broadcast -14 LUFS with slight room ambience
    final_master = os.path.join(AUDIO_DIR, "dentist_dialogue_3speaker_master.mp3")
    lufs_cmd = [
        "ffmpeg", "-y", "-i", raw_master,
        "-af", "loudnorm=I=-14:LRA=7:TP=-1.5",
        "-ar", "44100", "-b:a", "192k", final_master
    ]
    subprocess.run(lufs_cmd, check=True)
    print(f"\n Master Track Created: {final_master} ({round(current_time, 2)}s total duration)")

    # Save timings to JSON for the video compositor
    import json
    timing_file = os.path.join(AUDIO_DIR, "dialogue_timings.json")
    with open(timing_file, "w", encoding="utf-8") as f:
        json.dump({
            "total_duration": round(current_time, 2),
            "scenes": timing_manifest
        }, f, indent=2)
    print(f" Timings Manifest Saved: {timing_file}")

if __name__ == "__main__":
    asyncio.run(synthesize_all())
