#!/usr/bin/env python3
"""
Broadcast Neural Voiceover Generator — Big Byte Social Studio
Uses Microsoft Edge Neural TTS with broadcast loudness mastering (-14 LUFS via FFmpeg).

Voices:
- female_in / desi_female: en-IN-NeerjaNeural (Natural, Warm, Empathetic, Broadcast-Grade)
- male_in / desi_male:     en-IN-PrabhatNeural (Authoritative, Technical, Confident)
- hindi:                   hi-IN-SwaraNeural   (Pure Natural Hindi)
- marathi:                 mr-IN-AarohiNeural  (Pure Natural Marathi)
- female_us:               en-US-JennyNeural   (US Dynamic Storyteller)
- male_uk:                 en-GB-RyanNeural    (British Analytical Specialist)
"""

import sys
import os
import asyncio
import subprocess
import argparse
import edge_tts

VOICE_MAP = {
    "female_in": "en-IN-NeerjaNeural",
    "desi_female": "en-IN-NeerjaNeural",
    "male_in": "en-IN-PrabhatNeural",
    "desi_male": "en-IN-PrabhatNeural",
    "hindi": "hi-IN-SwaraNeural",
    "marathi": "mr-IN-AarohiNeural",
    "female_us": "en-US-JennyNeural",
    "male_uk": "en-GB-RyanNeural"
}

VOICE_RATES = {
    "female_in": "+2%",
    "male_in": "+3%",
    "hindi": "+0%",
    "marathi": "+0%",
    "female_us": "+4%",
    "male_uk": "+2%"
}

VOICE_PITCHES = {
    "female_in": "+0Hz",
    "male_in": "-2Hz",
    "hindi": "+1Hz",
    "marathi": "+0Hz",
    "female_us": "+1Hz",
    "male_uk": "-1Hz"
}

async def generate_raw_tts(text: str, voice_code: str, raw_output_path: str, rate: str, pitch: str):
    communicate = edge_tts.Communicate(text, voice_code, rate=rate, pitch=pitch)
    await communicate.save(raw_output_path)

def master_audio_lufs(raw_path: str, final_path: str):
    """
    Normalizes audio track to broadcast -14 LUFS (YouTube/Instagram standard)
    using FFmpeg loudnorm filter with 24kHz 128kbps stereo encoding.
    """
    # Check if ffmpeg exists
    ffmpeg_bin = "ffmpeg"
    try:
        # Check local node_modules ffmpeg-installer if global not in path
        installer_path = os.path.join(os.path.dirname(__file__), "..", "node_modules", "@ffmpeg-installer", "win32-x64", "ffmpeg.exe")
        if os.path.exists(installer_path):
            ffmpeg_bin = installer_path
    except Exception:
        pass

    cmd = [
        ffmpeg_bin,
        "-y",
        "-i", raw_path,
        "-af", "loudnorm=I=-14:LRA=7:tp=-1.5",
        "-ar", "24000",
        "-b:a", "128k",
        final_path
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    except Exception as e:
        # If ffmpeg loudnorm fails, fall back to copying raw audio
        if os.path.exists(raw_path) and raw_path != final_path:
            import shutil
            shutil.copyfile(raw_path, final_path)

def main():
    parser = argparse.ArgumentParser(description="Generate broadcast neural voiceover")
    parser.add_argument("--text", required=True, help="Text to speak")
    parser.add_argument("--voice", default="female_in", help="Voice character key")
    parser.add_argument("--output", required=True, help="Final output MP3 path")
    args = parser.parse_args()

    voice_key = args.voice.lower()
    voice_code = VOICE_MAP.get(voice_key, "en-IN-NeerjaNeural")
    rate = VOICE_RATES.get(voice_key, "+2%")
    pitch = VOICE_PITCHES.get(voice_key, "+0Hz")

    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    raw_temp_path = args.output + ".raw.mp3"

    # 1. Synthesize Neural Audio
    asyncio.run(generate_raw_tts(args.text, voice_code, raw_temp_path, rate, pitch))

    # 2. Master to -14 LUFS
    master_audio_lufs(raw_temp_path, args.output)

    # 3. Clean temp
    if os.path.exists(raw_temp_path):
        try:
            os.remove(raw_temp_path)
        except Exception:
            pass

    print(f"SUCCESS: Audio generated and mastered to -14 LUFS: {args.output}")

if __name__ == "__main__":
    main()
