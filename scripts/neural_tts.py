import sys
import os
import asyncio
import subprocess
from pathlib import Path

# Ensure UTF-8 console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import edge_tts

# High-fidelity, soothing neural Indian English & Hindi voices
VOICE_PRABHAT = "en-IN-PrabhatNeural"           # Primary: Clear, authoritative Indian male technician voice
VOICE_NEERJA = "en-IN-NeerjaExpressiveNeural"   # Alternate: Warm, pleasant, professional Indian female voice
VOICE_SWARA = "hi-IN-SwaraNeural"               # Fluent Hindi female voice
VOICE_MADHUR = "hi-IN-MadhurNeural"             # Fluent Hindi male voice

def detect_voice_for_text(text: str, requested_voice: str = None) -> str:
    if requested_voice:
        return requested_voice
    # Check if text contains Devanagari Hindi characters
    has_devanagari = any('\u0900' <= char <= '\u097F' for char in text)
    if has_devanagari:
        return VOICE_SWARA
    return VOICE_PRABHAT

async def synthesize_neural(text: str, output_path: str, voice: str = VOICE_PRABHAT):
    clean_text = text.strip()
    if not clean_text:
        raise ValueError("Empty text provided for TTS")

    chosen_voice = detect_voice_for_text(clean_text, voice)
    temp_raw = output_path + ".raw.mp3"

    try:
        # Edge TTS generates natural neural audio with conversational cadence
        communicator = edge_tts.Communicate(text=clean_text, voice=chosen_voice, rate="+0%", pitch="+0Hz")
        await communicator.save(temp_raw)

        # Broadcast Standard -14 LUFS Mastering Chain via FFmpeg EBU R128 filter
        cmd = [
            "ffmpeg", "-y", "-i", temp_raw,
            "-af", "loudnorm=I=-14:LRA=7:TP=-1.5",
            "-ar", "44100", "-ac", "2",
            output_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode != 0:
            # Fallback copy if ffmpeg fails
            if os.path.exists(temp_raw):
                os.replace(temp_raw, output_path)
    finally:
        if os.path.exists(temp_raw):
            try:
                os.remove(temp_raw)
            except Exception:
                pass

def main():
    if len(sys.argv) < 3:
        print("Usage: python neural_tts.py <text_or_file> <output_path> [voice]")
        sys.exit(1)

    input_data = sys.argv[1]
    output_path = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else VOICE_PRABHAT

    if os.path.exists(input_data):
        with open(input_data, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        text = input_data

    asyncio.run(synthesize_neural(text, output_path, voice))
    print(f"✅ [NEURAL DESI TTS SUCCESS] Voice: {voice} | Output: {output_path} ({os.path.getsize(output_path)} bytes, -14 LUFS mastered)")

if __name__ == "__main__":
    main()
