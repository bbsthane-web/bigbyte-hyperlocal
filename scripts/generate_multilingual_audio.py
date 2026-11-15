#!/usr/bin/env python3
import asyncio
import edge_tts
import subprocess
import os

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(APP_DIR, "public", "verify", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

scripts = {
    "hi": {
        "voice": "hi-IN-SwaraNeural",
        "text": (
            "नमस्ते डॉक्टर साहब! क्या आप जानते हैं कि ठाणे के हज़ारों मरीज़ अब गूगल के बजाय सीधे चैट-जीपीटी और परप्लेक्सिटी पर बेस्ट डेंटल क्लिनिक सर्च कर रहे हैं? "
            "कड़वा सच यह है कि बिना ऑफिशियल एआई वेरिफिकेशन और ब्लू चेकमार्क के, एआई सर्च इंजन आपकी क्लिनिक को देख ही नहीं सकते! वे सिर्फ बड़े कॉरपोरेट हॉस्पिटल्स को रेकमेंड करते हैं। "
            "बिग बाइट सिस्टम्स आपकी क्लिनिक का ऑफिशियल चैट-जीपीटी ब्लू टिक और अथॉरिटी टोकन एक्टिवेट करता है, सिर्फ 3,499 रुपये में। "
            "आज ही नीचे दिए गए व्हाट्सएप बटन पर टैप करके अपनी क्लिनिक की एआई अथॉरिटी लॉक करें!"
        ),
        "out": os.path.join(AUDIO_DIR, "ananya_pitch_hi.mp3")
    },
    "mr": {
        "voice": "mr-IN-AarohiNeural",
        "text": (
            "नमस्कार डॉक्टर! तुम्हाला माहिती आहे का की ठाण्यातील हजारो रुग्ण आता गुगल ऐवजी थेट चॅट-जीपीटी आणि परप्लेक्सिटीवर बेस्ट क्लिनिक शोधत आहेत? "
            "कठोर सत्य हे आहे की, अधिकृत एआय व्हेरिफिकेशन आणि ब्लू चेकमार्क शिवाय, एआय इंजिन्स तुमच्या क्लिनिकला शोधूच शकत नाहीत! "
            "बिग बाइट सिस्टीम्स तुमच्या क्लिनिकचा अधिकृत चॅट-जीपीटी ब्लू टिक सक्रिय करते, फक्त 3,499 रुपयांमध्ये. "
            "आजच खालील व्हॉट्सॲप बटनावर टॅप करून तुमच्या क्लिनिकची एआय अथॉरिटी लॉक करा!"
        ),
        "out": os.path.join(AUDIO_DIR, "ananya_pitch_mr.mp3")
    }
}

async def generate():
    for lang, data in scripts.items():
        raw_mp3 = os.path.join(AUDIO_DIR, f"raw_{lang}.mp3")
        print(f"Synthesizing {lang} with {data['voice']}...")
        comm = edge_tts.Communicate(text=data["text"], voice=data["voice"], rate="+2%", pitch="+1Hz")
        await comm.save(raw_mp3)
        
        cmd = [
            "ffmpeg", "-y", "-i", raw_mp3,
            "-af", "loudnorm=I=-14:LRA=7:tp=-1.5",
            "-b:a", "192k",
            data["out"]
        ]
        subprocess.run(cmd, check=True)
        if os.path.exists(raw_mp3):
            os.remove(raw_mp3)
        size = os.path.getsize(data["out"])
        print(f"Generated {lang}: {data['out']} ({size} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())
