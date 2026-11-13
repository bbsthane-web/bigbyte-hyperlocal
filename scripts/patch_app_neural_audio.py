#!/usr/bin/env python3
import sys

with open('social_studio_app/public/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace drawReelFrame badge & warning header
old_badge_chunk = """  // 3. Top Header Branding Badge
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(16, 26, 96, 22, 11);
  else ctx.rect(16, 26, 96, 22);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillText('⚡ 4K LAB REEL', 26, 41);"""

new_badge_chunk = """  // 3. Top Header Branding Badge (Dynamic Niche Badge)
  const c = state.currentClient || { name: 'Big Byte Systems', niche: 'Hardware' };
  let reelCategory = '4K LAB REEL';
  let warningHeader = '⚠️ CRITICAL THANE WARNING';
  let headerColor = '#f59e0b';
  let badgeColor = '#ef4444';

  if (c.niche && c.niche.includes('Dental')) {
    reelCategory = '4K CLINICAL REEL';
    warningHeader = '🦷 ORAL HEALTH ALERT';
    headerColor = '#10b981';
    badgeColor = '#059669';
  } else if (c.niche && c.niche.includes('Cafe')) {
    reelCategory = '4K ARTISAN REEL';
    warningHeader = '☕ SPECIALTY COFFEE TIP';
    headerColor = '#f59e0b';
    badgeColor = '#d97706';
  } else if (c.niche && (c.niche.includes('Hair') || c.niche.includes('Skin') || c.niche.includes('Aesthetics'))) {
    reelCategory = '4K ATELIER REEL';
    warningHeader = '✨ HAIR COUTURE SECRETS';
    headerColor = '#f43f5e';
    badgeColor = '#e11d48';
  }

  ctx.fillStyle = badgeColor;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(16, 26, 126, 22, 11);
  else ctx.rect(16, 26, 126, 22);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillText(`⚡ ${reelCategory}`, 24, 41);"""

assert old_badge_chunk in code, "old_badge_chunk not found"
code = code.replace(old_badge_chunk, new_badge_chunk)

# Replace Warning Badge text
old_warning_chunk = """    // Warning Badge
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(24, 76, 175, 24, 12);
    else ctx.rect(24, 76, 175, 24);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 11px Inter, sans-serif';
    ctx.fillText('⚠️ CRITICAL THANE WARNING', 32, 92);"""

new_warning_chunk = """    // Warning Badge (Dynamic Niche Header)
    ctx.fillStyle = headerColor;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(24, 76, 195, 24, 12);
    else ctx.rect(24, 76, 195, 24);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 11px Inter, sans-serif';
    ctx.fillText(warningHeader, 32, 92);"""

assert old_warning_chunk in code, "old_warning_chunk not found"
code = code.replace(old_warning_chunk, new_warning_chunk)

# Replace playReel
old_play_func = """function playReel() {
  if (!reelPlayerState.activePost) return;
  reelPlayerState.isPlaying = true;
  reelPlayerState.lastTimestamp = performance.now();

  const icon = document.getElementById('playIcon');
  const text = document.getElementById('playText');
  if (icon) icon.textContent = '⏸';
  if (text) text.textContent = 'Pause Reel';

  // Native Browser Speech Synthesis (100% Free Human-Like Studio Voiceover)
  if (reelPlayerState.isVoiceover && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const p = reelPlayerState.activePost;
    const textToSpeak = `${p.videoHook || ''}. ${p.script || p.content.substring(0, 180)}`;
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    
    // Voice tuning values from state
    utter.rate = state.voiceRate || 1.05;
    utter.pitch = state.voicePitch || 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const char = state.voiceCharacter || 'male_in';

    let matchedVoice = null;
    if (char === 'male_in') {
      matchedVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('prabhat')) && v.name.toLowerCase().includes('male')) ||
                     voices.find(v => v.lang === 'en-IN') ||
                     voices.find(v => v.lang.includes('en-GB'));
    } else if (char === 'female_in') {
      matchedVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('priya') || v.name.toLowerCase().includes('heera')) && (v.name.toLowerCase().includes('female') || !v.name.toLowerCase().includes('male'))) ||
                     voices.find(v => v.lang === 'en-IN');
    } else if (char === 'male_uk') {
      matchedVoice = voices.find(v => v.lang === 'en-GB' && (v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('oliver') || v.name.toLowerCase().includes('male'))) ||
                     voices.find(v => v.lang === 'en-GB');
    } else if (char === 'female_us') {
      matchedVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && (v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('female'))) ||
                     voices.find(v => v.lang.startsWith('en'));
    } else if (char === 'hindi') {
      matchedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant'));
    } else if (char === 'marathi') {
      matchedVoice = voices.find(v => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi')) ||
                     voices.find(v => v.lang.startsWith('hi'));
    } else if (char === 'spanish') {
      matchedVoice = voices.find(v => v.lang.startsWith('es'));
    } else if (char === 'german') {
      matchedVoice = voices.find(v => v.lang.startsWith('de'));
    } else if (char === 'french') {
      matchedVoice = voices.find(v => v.lang.startsWith('fr'));
    } else if (char === 'arabic') {
      matchedVoice = voices.find(v => v.lang.startsWith('ar'));
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
    }
    if (matchedVoice) utter.voice = matchedVoice;

    window.speechSynthesis.speak(utter);
    reelPlayerState.speechUtterance = utter;
  }

  function loop(now) {
    if (!reelPlayerState.isPlaying) return;
    const dt = (now - reelPlayerState.lastTimestamp) / 1000;
    reelPlayerState.lastTimestamp = now;

    reelPlayerState.currentTime += dt;
    if (reelPlayerState.currentTime >= reelPlayerState.duration) {
      reelPlayerState.currentTime = 0;
      pauseReel();
      drawReelFrame();
      updateProgressUI(0);
      return;
    }

    drawReelFrame();
    updateProgressUI(reelPlayerState.currentTime);
    reelPlayerState.animationFrameId = requestAnimationFrame(loop);
  }

  reelPlayerState.animationFrameId = requestAnimationFrame(loop);
}"""

new_play_func = """function playReel() {
  if (!reelPlayerState.activePost) return;
  reelPlayerState.isPlaying = true;
  reelPlayerState.lastTimestamp = performance.now();

  const icon = document.getElementById('playIcon');
  const text = document.getElementById('playText');
  if (icon) icon.textContent = '⏸';
  if (text) text.textContent = 'Pause Reel';

  // Play True Broadcast -14 LUFS Neural Voiceover
  if (reelPlayerState.isVoiceover && reelPlayerState.audioElement && reelPlayerState.audioElement.src) {
    reelPlayerState.audioElement.currentTime = reelPlayerState.currentTime;
    reelPlayerState.audioElement.play().catch(e => console.log('Audio autoplay interaction notice:', e));
  }

  function loop(now) {
    if (!reelPlayerState.isPlaying) return;

    // Time is locked to real broadcast audio clock if available
    if (reelPlayerState.audioElement && !reelPlayerState.audioElement.paused && reelPlayerState.audioElement.duration) {
      reelPlayerState.currentTime = reelPlayerState.audioElement.currentTime;
      reelPlayerState.duration = reelPlayerState.audioElement.duration || 30;
    } else {
      const dt = (now - reelPlayerState.lastTimestamp) / 1000;
      reelPlayerState.currentTime += dt;
    }
    reelPlayerState.lastTimestamp = now;

    if (reelPlayerState.currentTime >= reelPlayerState.duration) {
      reelPlayerState.currentTime = 0;
      pauseReel();
      drawReelFrame();
      updateProgressUI(0);
      return;
    }

    drawReelFrame();
    updateProgressUI(reelPlayerState.currentTime);
    reelPlayerState.animationFrameId = requestAnimationFrame(loop);
  }

  reelPlayerState.animationFrameId = requestAnimationFrame(loop);
}"""

assert old_play_func in code, "old_play_func not found"
code = code.replace(old_play_func, new_play_func)

# Replace pauseReel
old_pause_func = """function pauseReel() {
  reelPlayerState.isPlaying = false;
  if (reelPlayerState.animationFrameId) {
    cancelAnimationFrame(reelPlayerState.animationFrameId);
    reelPlayerState.animationFrameId = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const icon = document.getElementById('playIcon');
  const text = document.getElementById('playText');
  if (icon) icon.textContent = '▶';
  if (text) text.textContent = 'Play Reel Video';
}"""

new_pause_func = """function pauseReel() {
  reelPlayerState.isPlaying = false;
  if (reelPlayerState.animationFrameId) {
    cancelAnimationFrame(reelPlayerState.animationFrameId);
    reelPlayerState.animationFrameId = null;
  }
  if (reelPlayerState.audioElement) {
    reelPlayerState.audioElement.pause();
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const icon = document.getElementById('playIcon');
  const text = document.getElementById('playText');
  if (icon) icon.textContent = '▶';
  if (text) text.textContent = 'Play Reel Video';
}"""

assert old_pause_func in code, "old_pause_func not found"
code = code.replace(old_pause_func, new_pause_func)

# Update handleVoiceCharacterChange
old_voice_handler = """function handleVoiceCharacterChange(charKey) {
  state.voiceCharacter = charKey;
  showToast(`Voice character selected: ${charKey}`);
}"""

new_voice_handler = """function handleVoiceCharacterChange(charKey) {
  state.voiceCharacter = charKey;
  if (reelPlayerState.activePost) {
    loadNeuralAudio(reelPlayerState.activePost, charKey);
  }
  showToast(`Voice switched to broadcast neural: ${charKey}`);
}"""

if old_voice_handler in code:
    code = code.replace(old_voice_handler, new_voice_handler)

# Dynamic renderStudioCanvas
old_canvas_brand = """  // Right Card: Big Byte Systems Lab (Emerald Victory)
  const rightX = leftX + cardWidth + 30;
  ctx.fillStyle = '#064e3b';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(rightX, splitY, cardWidth, cardHeight, 14);
  else ctx.rect(rightX, splitY, cardWidth, cardHeight);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '900 13px Inter, sans-serif';
  ctx.fillText('✅ BIG BYTE SYSTEMS LAB (THANE)', rightX + 36, splitY + 48);"""

new_canvas_brand = """  // Right Card: Dynamic Active Client (Emerald Victory)
  const c = state.currentClient || { name: 'Big Byte Systems', address: 'Manpada, Thane West' };
  let leftHeader = '❌ UNAUTHORIZED / LOCAL DESK';
  if (c.niche && c.niche.includes('Dental')) {
    leftHeader = '❌ DELAYED TRIAGE / HOME REMEDIES';
  } else if (c.niche && c.niche.includes('Cafe')) {
    leftHeader = '❌ COMMERCIAL BURNT ROAST';
  } else if (c.niche && (c.niche.includes('Hair') || c.niche.includes('Skin') || c.niche.includes('Aesthetics'))) {
    leftHeader = '❌ CHEMICAL DAMAGE / FORMALDEHYDE';
  }

  const rightX = leftX + cardWidth + 30;
  ctx.fillStyle = '#064e3b';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(rightX, splitY, cardWidth, cardHeight, 14);
  else ctx.rect(rightX, splitY, cardWidth, cardHeight);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '900 13px Inter, sans-serif';
  ctx.fillText(`✅ ${c.name.toUpperCase()} (THANE)`, rightX + 36, splitY + 48);"""

if old_canvas_brand in code:
    code = code.replace(old_canvas_brand, new_canvas_brand)

with open('social_studio_app/public/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully patched app.js with Neural Audio and dynamic context switching!")
