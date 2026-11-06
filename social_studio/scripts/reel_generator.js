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
 * Synthesizes spoken audio from text using soothing Indian Neural TTS (Edge-TTS Neerja/Prabhat)
 * Falls back to System.Speech if offline.
 */
function synthesizeSpeech(text, outputWavPath) {
  try {
    const cleanText = text
      .replace(/[\r\n]+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, ' ')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    // Primary: Soothing Indian Neural TTS via Python edge-tts
    const ttsPy = path.join(__dirname, 'neural_tts.py');
    const tempTxt = path.join(path.dirname(outputWavPath), `tts_prompt_${Date.now()}.txt`);
    fs.writeFileSync(tempTxt, cleanText, 'utf8');

    try {
      execSync(`python "${ttsPy}" "${tempTxt}" "${outputWavPath}" en-IN-NeerjaExpressiveNeural`, { stdio: 'pipe', timeout: 25000 });
      if (fs.existsSync(outputWavPath) && fs.statSync(outputWavPath).size > 1000) {
        console.log(`🎙️ [NEURAL INDIAN TTS] Soothing human voice generated: ${path.basename(outputWavPath)} (${fs.statSync(outputWavPath).size} bytes)`);
        return true;
      }
    } catch (neuralErr) {
      console.warn(`⚠️ [NEURAL TTS NOTICE] Primary neural synthesis note: ${neuralErr.message}`);
    } finally {
      if (fs.existsSync(tempTxt)) try { fs.unlinkSync(tempTxt); } catch (_) {}
    }

    // Fallback: Windows System.Speech
    const safeWav = outputWavPath.replace(/\\/g, '/');
    const safeText = cleanText.substring(0, 500);
    const tempPs1 = path.join(path.dirname(outputWavPath), `tts_${Date.now()}.ps1`);
    const psScript = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.Rate = 0
$s.SetOutputToWaveFile('${safeWav}')
$s.Speak(@"
${safeText}
"@)
$s.Dispose()
`;
    fs.writeFileSync(tempPs1, psScript, 'utf8');
    try {
      execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPs1}"`, { stdio: 'pipe', timeout: 20000 });
    } finally {
      if (fs.existsSync(tempPs1)) fs.unlinkSync(tempPs1);
    }

    return fs.existsSync(outputWavPath) && fs.statSync(outputWavPath).size > 1000;
  } catch (err) {
    console.warn(`⚠️ [TTS ENGINE] Speech synthesis note: ${err.message}`);
    return false;
  }
}

/**
 * Generates an Instagram Reel / YouTube Shorts compliant 9:16 vertical MP4 video
 * - Resolution: 1080x1920 (9:16 vertical video)
 * - Video Codec: H.264 / yuv420p
 * - Audio Codec: AAC with high-clarity voiceover track (or fallback)
 * - Auto-duration matches voiceover narration length
 */
function generateReelVideoFromImage(imagePath, outputMp4Path, durationSec = 15, voiceScript = null) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Input image does not exist: ${imagePath}`);
  }

  const outDir = path.dirname(outputMp4Path);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filter = `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(1080-iw)/2:(1920-ih)/2:color=black`;
  
  let audioInput = `-f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t ${durationSec}`;
  const wavPath = path.join(outDir, `${path.basename(outputMp4Path, '.mp4')}_voice.wav`);

  if (voiceScript && synthesizeSpeech(voiceScript, wavPath)) {
    console.log(`🎙️ [VOICEOVER ENGINE] Spoken voiceover generated: ${path.basename(wavPath)} (${fs.statSync(wavPath).size} bytes)`);
    audioInput = `-i "${wavPath}"`;
  }

  const cmd = `"${ffmpegPath}" -y -loop 1 -i "${imagePath}" ${audioInput} -c:v libx264 -preset veryfast -pix_fmt yuv420p -vf "${filter}" -c:a aac -b:a 192k -ar 44100 -ac 2 -shortest "${outputMp4Path}"`;

  console.log(`🎬 [REEL ENGINE] Compiling 9:16 MP4 video Short with audio: ${path.basename(outputMp4Path)}...`);
  execSync(cmd, { stdio: 'pipe' });

  if (fs.existsSync(outputMp4Path)) {
    const size = fs.statSync(outputMp4Path).size;
    console.log(`✅ [REEL ENGINE] Successfully compiled Short with Audio: ${path.basename(outputMp4Path)} (${size} bytes)`);
    return outputMp4Path;
  } else {
    throw new Error('Video generation completed but output file not found');
  }
}

module.exports = {
  generateReelVideoFromImage,
  synthesizeSpeech,
  ffmpegPath
};
