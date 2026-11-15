"""
Render EchoMimic Talking-Face Videos via Hugging Face Token
"""
import os
import sys
import time
import shutil
import gradio_client

TOKEN = os.environ.get("HF_TOKEN", "")
SPACE = "fffiloni/EchoMimic"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "verify"))
PORTRAIT_PATH = os.path.join(BASE_DIR, "ananya_pitch_plate.jpg")

TASKS = [
    {
        "lang": "en",
        "audio": os.path.join(BASE_DIR, "audio", "ananya_pitch_master.mp3"),
        "output": os.path.join(BASE_DIR, "ananya_pitch_video.mp4")
    },
    {
        "lang": "hi",
        "audio": os.path.join(BASE_DIR, "audio", "ananya_pitch_hi.mp3"),
        "output": os.path.join(BASE_DIR, "ananya_pitch_video_hi.mp4")
    },
    {
        "lang": "mr",
        "audio": os.path.join(BASE_DIR, "audio", "ananya_pitch_mr.mp3"),
        "output": os.path.join(BASE_DIR, "ananya_pitch_video_mr.mp4")
    }
]

def main():
    print(f"Connecting to {SPACE} with provided HF Token...")
    client = gradio_client.Client(SPACE, token=TOKEN)
    print("Connected successfully!")
    
    for item in TASKS:
        lang = item["lang"]
        audio_file = item["audio"]
        out_file = item["output"]
        
        print(f"\n==========================================")
        print(f"Rendering EchoMimic video for [{lang.upper()}]...")
        print(f"Audio: {audio_file}")
        
        try:
            # We predict using EchoMimic
            res = client.predict(
                uploaded_img=gradio_client.handle_file(PORTRAIT_PATH),
                uploaded_audio=gradio_client.handle_file(audio_file),
                width=512,
                height=512,
                length=1200,
                seed=42,
                facemask_dilation_ratio=0.1,
                facecrop_dilation_ratio=0.5,
                context_frames=12,
                context_overlap=3,
                cfg=2.5,
                steps=20,
                sample_rate=16000,
                fps=24,
                device="cuda",
                api_name="/generate_video"
            )
            print(f"[{lang.upper()}] Rendered file received: {res}")
            if os.path.exists(res):
                # Copy to target output
                shutil.copyfile(res, out_file)
                size = os.path.getsize(out_file)
                print(f"[{lang.upper()}] Successfully saved to: {out_file} ({size:,} bytes)")
        except Exception as e:
            print(f"[{lang.upper()}] Generation error: {e}")

if __name__ == "__main__":
    main()
