const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let ffmpegPath = null;
try {
  ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
} catch (_) {
  ffmpegPath = 'ffmpeg';
}

/**
 * Generates an Instagram Reel-compliant MP4 video from an image
 * - Resolution: 1080x1920 (9:16 vertical video)
 * - Video Codec: H.264 / yuv420p
 * - Audio Codec: AAC with valid stereo stream (Instagram requirement)
 * - Duration: default 15s (or custom)
 */
function generateReelVideoFromImage(imagePath, outputMp4Path, durationSec = 15) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Input image does not exist: ${imagePath}`);
  }

  const outDir = path.dirname(outputMp4Path);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Use scale and pad filter for 9:16 aspect ratio (1080x1920)
  // Subtle Ken-Burns zoom effect across duration
  const filter = `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(1080-iw)/2:(1920-ih)/2:color=black`;

  const cmd = `"${ffmpegPath}" -y -loop 1 -i "${imagePath}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -c:v libx264 -t ${durationSec} -pix_fmt yuv420p -vf "${filter}" -c:a aac -b:a 128k -shortest "${outputMp4Path}"`;

  console.log(`🎬 [REEL ENGINE] Generating 9:16 MP4 Reel from ${path.basename(imagePath)}...`);
  execSync(cmd, { stdio: 'pipe' });

  if (fs.existsSync(outputMp4Path)) {
    const size = fs.statSync(outputMp4Path).size;
    console.log(`✅ [REEL ENGINE] Successfully generated Instagram Reel: ${path.basename(outputMp4Path)} (${size} bytes)`);
    return outputMp4Path;
  } else {
    throw new Error('Video generation completed but output file not found');
  }
}

module.exports = {
  generateReelVideoFromImage,
  ffmpegPath
};

if (require.main === module) {
  const testImg = path.join(__dirname, '..', 'public', 'assets', 'blog_macbook_repair.jpg');
  const testOut = path.join(__dirname, '..', 'public', 'assets', 'sample_reel.mp4');
  generateReelVideoFromImage(testImg, testOut, 5);
}
