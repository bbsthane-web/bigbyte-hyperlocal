import sys
import os
import asyncio
from pathlib import Path

# Ensure UTF-8 console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import edge_tts

# High-fidelity, soothing neural Indian English voices
VOICE_NEERJA = "en-IN-NeerjaExpressiveNeural"   # Warm, pleasant, professional Indian female voice
VOICE_PRABHAT = "en-IN-PrabhatNeural"           # Clear, authoritative Indian male voice

async def synthesize_neural(text: str, output_path: str, voice: str = VOICE_NEERJA):
    clean_text = text.strip()
    if not clean_text:
        raise ValueError("Empty text provided for TTS")

    # Edge TTS generates natural neural audio
    communicator = edge_tts.Communicate(text=clean_text, voice=voice, rate="+0%", pitch="+0Hz")
    await communicator.save(output_path)

def main():
    if len(sys.argv) < 3:
        print("Usage: python neural_tts.py <text_or_file> <output_path> [voice]")
        sys.exit(1)

    input_data = sys.argv[1]
    output_path = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else VOICE_NEERJA

    # Read from file if file exists, else use raw string
    if os.path.exists(input_data):
        with open(input_data, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        text = input_data

    asyncio.run(synthesize_neural(text, output_path, voice))
    print(f"✅ [NEURAL TTS SUCCESS] Generated: {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == "__main__":
    main()
