"""
BigByte Systems - Podcast Video Sync Utility
Automatically locates podcast videos from Downloads and places them into assets/video/
"""

import os
import sys
import shutil
import zipfile
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
VIDEO_DEST_DIR = BASE_DIR / "assets" / "video"
VIDEO_DEST_DIR.mkdir(parents=True, exist_ok=True)

USER_DOWNLOADS = Path.home() / "Downloads"

SEARCH_LOCATIONS = [
    USER_DOWNLOADS,
    BASE_DIR,
    Path.home() / "Desktop"
]

def sync_podcast_videos():
    print("=" * 65)
    print("🎬 BigByte Systems: Podcast Video Importer & Sync")
    print(f"📁 Destination Folder: {VIDEO_DEST_DIR}")
    print("=" * 65)

    imported_ananya = False
    imported_vikram = False

    # 1. Search for bundled zip file first
    for folder in SEARCH_LOCATIONS:
        if not folder.exists():
            continue
        zip_path = folder / "podcast_videos.zip"
        if zip_path.exists():
            print(f"📦 Found archive: {zip_path}")
            try:
                with zipfile.ZipFile(zip_path, 'r') as zf:
                    for name in zf.namelist():
                        if "ananya" in name.lower() and name.endswith(".mp4"):
                            zf.extract(name, VIDEO_DEST_DIR)
                            extracted = VIDEO_DEST_DIR / name
                            target = VIDEO_DEST_DIR / "ananya_podcast.mp4"
                            if extracted != target:
                                shutil.move(extracted, target)
                            print(f"   ✅ Extracted: ananya_podcast.mp4 ({target.stat().st_size:,} bytes)")
                            imported_ananya = True
                        elif "vikram" in name.lower() and name.endswith(".mp4"):
                            zf.extract(name, VIDEO_DEST_DIR)
                            extracted = VIDEO_DEST_DIR / name
                            target = VIDEO_DEST_DIR / "vikram_podcast.mp4"
                            if extracted != target:
                                shutil.move(extracted, target)
                            print(f"   ✅ Extracted: vikram_podcast.mp4 ({target.stat().st_size:,} bytes)")
                            imported_vikram = True
            except Exception as e:
                print(f"   ⚠️ Could not read zip: {e}")

    # 2. Search for standalone MP4 files
    for folder in SEARCH_LOCATIONS:
        if not folder.exists():
            continue
        for file in folder.glob("*.mp4"):
            fname = file.name.lower()
            if "ananya" in fname and not imported_ananya:
                target = VIDEO_DEST_DIR / "ananya_podcast.mp4"
                shutil.copy2(file, target)
                print(f"✅ Imported Ananya video from {file} ({target.stat().st_size:,} bytes)")
                imported_ananya = True
            elif "vikram" in fname and not imported_vikram:
                target = VIDEO_DEST_DIR / "vikram_podcast.mp4"
                shutil.copy2(file, target)
                print(f"✅ Imported Vikram video from {file} ({target.stat().st_size:,} bytes)")
                imported_vikram = True

    # 3. Check current state in assets/video
    ananya_final = VIDEO_DEST_DIR / "ananya_podcast.mp4"
    vikram_final = VIDEO_DEST_DIR / "vikram_podcast.mp4"

    print("\n[Current Status in assets/video/]")
    print(f" • ananya_podcast.mp4: {'✅ Present (' + str(ananya_final.stat().st_size) + ' bytes)' if ananya_final.exists() else '❌ Missing'}")
    print(f" • vikram_podcast.mp4: {'✅ Present (' + str(vikram_final.stat().st_size) + ' bytes)' if vikram_final.exists() else '❌ Missing'}")

    if ananya_final.exists() and vikram_final.exists():
        print("\n🎉 Both avatar videos are ready! Launching studio_interview_vsl.html...")
        vsl_file = BASE_DIR / "studio_interview_vsl.html"
        if sys.platform == "win32":
            os.system(f'start "" "{vsl_file}"')
        return True
    else:
        print("\n⏳ Video files are not yet in your Downloads folder.")
        print("👉 Please run the Google Colab notebook and ensure 'podcast_videos.zip' finishes downloading.")
        return False

if __name__ == "__main__":
    sync_podcast_videos()
