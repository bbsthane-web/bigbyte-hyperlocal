/**
 * 24/7 Autonomous Zero-Expense Cloud Dispatcher
 * Runs via GitHub Actions Cron (or cPanel Linux Cron)
 * 100% Free, Zero Hosting Cost, 100% Laptop-Off / Sleep-Proof
 * Direct Native Meta Graph API & Instagram Reels Video Publishing
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'data', 'config.json');
const POSTS_FILE = path.join(ROOT_DIR, 'data', 'posts.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const { uploadToFreeCdn } = require('./cdn_relay.js');
const { generateReelVideoFromImage } = require('./reel_generator.js');
const { cleanCaptionForInstagram, cleanCaptionForFacebook } = require('./seo_aeo_geo_engine.js');

function readJson(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (_) {}
  return fallback;
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to write ${file}: ${err.message}`);
  }
}

function resolveAsset(imagePath) {
  if (!imagePath) return null;
  let clean = imagePath.trim().split('?')[0];
  if (clean.startsWith('/')) clean = clean.slice(1);
  const p1 = path.join(ROOT_DIR, 'public', clean);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(ROOT_DIR, 'public', 'assets', path.basename(clean));
  if (fs.existsSync(p2)) return p2;
  return null;
}

// Direct Facebook Page Dispatcher
function dispatchFacebook(post, pageId, token, imageUrl, caption) {
  return new Promise((resolve) => {
    const localFile = resolveAsset(imageUrl || post.image);
    const cleanCaption = cleanCaptionForFacebook(caption);

    // Direct Multipart Buffer
    if (localFile && fs.existsSync(localFile)) {
      console.log(`📦 [CLOUD FB] Direct uploading local file: ${path.basename(localFile)}`);
      const boundary = '----NodeFormBoundary' + Math.random().toString(36).substring(2);
      const crlf = '\r\n';
      const fileBuf = fs.readFileSync(localFile);
      const filename = path.basename(localFile);

      const parts = [
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="message"${crlf}${crlf}${cleanCaption}${crlf}`),
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="access_token"${crlf}${crlf}${token}${crlf}`),
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="source"; filename="${filename}"${crlf}Content-Type: image/jpeg${crlf}${crlf}`),
        fileBuf,
        Buffer.from(crlf),
        Buffer.from(`--${boundary}--${crlf}`)
      ];
      const payload = Buffer.concat(parts);

      const req = https.request({
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/v26.0/${encodeURIComponent(pageId)}/photos`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=' + boundary,
          'Content-Length': payload.length
        }
      }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.id || parsed.post_id) {
              console.log(`🚀 [CLOUD FB SUCCESS] Post published! Post ID: ${parsed.post_id || parsed.id}`);
              return resolve({ success: true, id: parsed.post_id || parsed.id });
            }
            resolve({ success: false, error: parsed.error?.message || body });
          } catch (e) {
            resolve({ success: false, error: e.message });
          }
        });
      });
      req.on('error', e => resolve({ success: false, error: e.message }));
      req.write(payload);
      req.end();
      return;
    }

    // Remote URL fallback
    const photoPayload = new URLSearchParams({
      url: imageUrl || 'https://bigbytesystems.co.in/assets/hero.jpg',
      message: cleanCaption,
      access_token: token
    }).toString();

    const req = https.request({
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/v26.0/${encodeURIComponent(pageId)}/photos`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(photoPayload)
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.id || parsed.post_id) {
            console.log(`🚀 [CLOUD FB SUCCESS] Post ID: ${parsed.post_id || parsed.id}`);
            return resolve({ success: true, id: parsed.post_id || parsed.id });
          }
          resolve({ success: false, error: parsed.error?.message || body });
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });
    req.on('error', e => resolve({ success: false, error: e.message }));
    req.write(photoPayload);
    req.end();
  });
}

// Direct Instagram Reel Video Dispatcher
function dispatchInstagram(post, igAccountId, token, imageUrl, caption) {
  return new Promise(async (resolve) => {
    let targetMediaUrl = null;
    let localFile = resolveAsset(imageUrl || post.image);
    let filename = localFile ? path.basename(localFile) : '';

    // Convert any image into a true 9:16 vertical MP4 video with stereo AAC audio track
    let isVideo = Boolean(
      (localFile && (localFile.endsWith('.mp4') || localFile.endsWith('.webm'))) ||
      (post.image && (post.image.endsWith('.mp4') || post.image.endsWith('.webm'))) ||
      post.mediaFormat === 'VIDEO' ||
      post.mediaFormat === 'REELS' ||
      true // Instagram always defaults to Interactive Video Reel
    );

    if (localFile && (localFile.endsWith('.jpg') || localFile.endsWith('.jpeg') || localFile.endsWith('.png'))) {
      try {
        const reelDir = path.join(ROOT_DIR, 'public', 'assets', 'reels');
        if (!fs.existsSync(reelDir)) fs.mkdirSync(reelDir, { recursive: true });
        const cleanBase = path.basename(localFile, path.extname(localFile));
        const reelVideoPath = path.join(reelDir, `reel_${cleanBase}.mp4`);
        if (!fs.existsSync(reelVideoPath) || fs.statSync(reelVideoPath).size < 1000) {
          console.log(`🎬 [CLOUD IG] Converting "${filename}" to interactive 9:16 vertical Reel MP4 video via FFmpeg...`);
          generateReelVideoFromImage(localFile, reelVideoPath, 15);
        }
        localFile = reelVideoPath;
        filename = path.basename(localFile);
        isVideo = true;
      } catch (err) {
        console.warn(`⚠️ [CLOUD IG REEL NOTICE] Video compilation skipped: ${err.message}. Proceeding with photo.`);
        isVideo = false;
      }
    }

    if (localFile && fs.existsSync(localFile)) {
      console.log(`🌐 [CLOUD IG] Uploading local ${isVideo ? 'video Reel' : 'graphic'} "${filename}" to zero-cost fast CDN relay...`);
      targetMediaUrl = await uploadToFreeCdn(localFile);
    }

    if (!targetMediaUrl) {
      console.error(`❌ [CLOUD IG ERROR] Failed to upload media to free CDN relay.`);
      return resolve({ success: false, error: 'Could not upload media to free CDN relay.' });
    }

    // STRICT SANITIZATION: Never leak raw WhatsApp URLs on Instagram! Mask as "Tap Link in Bio"
    const rawCaption = (caption || post.content || post.title || '').trim();
    const safeCaption = cleanCaptionForInstagram(rawCaption);

    console.log(`📸 [CLOUD IG] Initiating ${isVideo ? 'REEL VIDEO' : 'PHOTO POST'} container (URL: ${targetMediaUrl}, Caption: ${safeCaption.length} chars)`);

    const containerParams = { caption: safeCaption, access_token: token };
    if (isVideo) {
      containerParams.media_type = 'REELS';
      containerParams.video_url = targetMediaUrl;
      containerParams.share_to_feed = 'true';
    } else {
      containerParams.image_url = targetMediaUrl;
    }

    const payload = new URLSearchParams(containerParams).toString();

    const req = https.request({
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/v26.0/${encodeURIComponent(igAccountId)}/media`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed.id) {
            console.error(`❌ [CLOUD IG CONTAINER ERROR]`, parsed.error ? parsed.error.message : body);
            return resolve({ success: false, error: parsed.error?.message || body });
          }

          const containerId = parsed.id;
          console.log(`📸 [CLOUD IG] Container created (${containerId}). Checking processing status...`);

          // Polling helper
          const executePublish = () => {
            const pubPayload = new URLSearchParams({
              creation_id: containerId,
              access_token: token
            }).toString();

            const pubReq = https.request({
              hostname: 'graph.facebook.com',
              port: 443,
              path: `/v26.0/${encodeURIComponent(igAccountId)}/media_publish`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(pubPayload)
              }
            }, (pubRes) => {
              let pBody = '';
              pubRes.on('data', d => pBody += d);
              pubRes.on('end', () => {
                try {
                  const pubParsed = JSON.parse(pBody);
                  if (pubParsed.id) {
                    console.log(`🚀 [CLOUD IG SUCCESS] "${post.title}" published live to Instagram! (${isVideo ? 'Interactive Reel' : 'Photo Post'} Media ID: ${pubParsed.id})`);
                    return resolve({ success: true, id: pubParsed.id, isVideo });
                  }
                  resolve({ success: false, error: pubParsed.error?.message || pBody });
                } catch (e) {
                  resolve({ success: false, error: e.message });
                }
              });
            });
            pubReq.on('error', e => resolve({ success: false, error: e.message }));
            pubReq.write(pubPayload);
            pubReq.end();
          };

          if (isVideo) {
            let attempts = 0;
            const maxAttempts = 10;
            const statusInterval = setInterval(() => {
              attempts++;
              const statusReq = https.get(`https://graph.facebook.com/v26.0/${encodeURIComponent(containerId)}?fields=status_code&access_token=${encodeURIComponent(token)}`, (sRes) => {
                let sBody = '';
                sRes.on('data', d => sBody += d);
                sRes.on('end', () => {
                  try {
                    const sParsed = JSON.parse(sBody);
                    const statusCode = sParsed.status_code;
                    console.log(`⏳ [CLOUD REEL STATUS] Attempt ${attempts}/${maxAttempts}: ${statusCode}`);

                    if (statusCode === 'FINISHED') {
                      clearInterval(statusInterval);
                      executePublish();
                    } else if (statusCode === 'ERROR' || attempts >= maxAttempts) {
                      clearInterval(statusInterval);
                      if (statusCode === 'ERROR') {
                        resolve({ success: false, error: 'Instagram Reel video processing error on Meta servers' });
                      } else {
                        executePublish();
                      }
                    }
                  } catch (e) {
                    if (attempts >= maxAttempts) {
                      clearInterval(statusInterval);
                      executePublish();
                    }
                  }
                });
              });
              statusReq.on('error', () => {
                if (attempts >= maxAttempts) {
                  clearInterval(statusInterval);
                  executePublish();
                }
              });
            }, 3000);
          } else {
            setTimeout(executePublish, 3500);
          }

        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });
    req.on('error', e => resolve({ success: false, error: e.message }));
    req.write(payload);
    req.end();
  });
}

// Main Execution Loop

// YouTube Direct Shorts Publisher for Cloud Dispatcher
async function getYouTubeAccessToken(clientId, clientSecret, refreshToken) {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await res.json();
  if (data.access_token) return data.access_token;
  throw new Error(data.error_description || data.error || 'Failed to refresh YouTube access token');
}

function dispatchYouTube(post, ytConfig, publicImageUrl, caption) {
  return new Promise(async (resolve) => {
    try {
      const accessToken = await getYouTubeAccessToken(ytConfig.clientId, ytConfig.clientSecret, ytConfig.refreshToken);

      let shortTitle = (post.title || "Big Byte Systems Diagnostic Lab").trim();
      if (!shortTitle.toLowerCase().includes('#shorts')) shortTitle = `${shortTitle} #Shorts`;
      if (shortTitle.length > 100) shortTitle = shortTitle.substring(0, 92) + " #Shorts";

      const tags = [
        "Shorts", "Laptop Repair Thane", "MacBook Repair Thane", "Computer Repair Near Me",
        "Big Byte Systems", "Thane West", "Ghodbunder Road Laptop Repair", "Chip Level Motherboard Repair",
        "Micro Soldering", "Laptop Screen Replacement Thane", "Data Recovery Thane", "Epson Printer Repair Thane"
      ];

      const scriptContent = (post.script || post.content || caption || "").trim();
      const description = `⚡ ${shortTitle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 LABORATORY CASE STUDY | BIG BYTE SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${scriptContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 HYPERLOCAL LAB LOCATION & CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 Laboratory: Big Byte Systems
📍 Address: Shop No 1, Building No 1, Khewra Cir Marg, Manpada, Thane West, Maharashtra 400607
📞 Direct Hotline: 090547 90592
💬 Direct WhatsApp: https://wa.me/919167463807
🌐 Official Website: https://bigbytesystems.co.in

#Shorts #BigByteSystems #LaptopRepairThane #MacBookRepair #ThaneWest #TechLaboratory #ComputerRepairNearMe`;

      // Resolve video file or fallback
      let videoFile = resolveAsset(publicImageUrl || post.image);
      if (!videoFile || !fs.existsSync(videoFile) || !videoFile.endsWith('.mp4')) {
        // Fallback to precompiled reel
        const reelDir = path.join(PUBLIC_DIR, 'assets', 'reels');
        const fallbackReel = path.join(reelDir, 'reel_macbook_soldering.mp4');
        if (fs.existsSync(fallbackReel)) videoFile = fallbackReel;
      }

      if (!videoFile || !fs.existsSync(videoFile)) {
        console.warn('⚠️ [YOUTUBE NOTICE] No MP4 video asset found for Short upload.');
        return resolve({ success: false, error: 'No MP4 video asset available for YouTube Short' });
      }

      const fileSize = fs.statSync(videoFile).size;

      const metadata = JSON.stringify({
        snippet: {
          title: shortTitle,
          description: description,
          tags: tags,
          categoryId: "28",
          defaultLanguage: "en",
          defaultAudioLanguage: "en"
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false
        }
      });

      const https = require('https');
      const initReq = https.request({
        hostname: 'www.googleapis.com',
        path: '/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Length': Buffer.byteLength(metadata),
          'X-Upload-Content-Type': 'video/mp4',
          'X-Upload-Content-Length': fileSize
        }
      }, (res) => {
        const uploadLocation = res.headers['location'];
        if (!uploadLocation) return resolve({ success: false, error: 'Failed to create resumable upload location' });

        const locUrl = new URL(uploadLocation);
        const videoStream = fs.createReadStream(videoFile);

        const putReq = https.request({
          protocol: locUrl.protocol,
          hostname: locUrl.hostname,
          port: locUrl.port || 443,
          path: locUrl.pathname + locUrl.search,
          method: 'PUT',
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Length': fileSize
          }
        }, (putRes) => {
          let putBody = '';
          putRes.on('data', d => putBody += d);
          putRes.on('end', () => {
            try {
              const vidData = JSON.parse(putBody);
              if (vidData.id) {
                console.log(`🚀 [CLOUD YOUTUBE] Video live at https://youtube.com/shorts/${vidData.id}`);
                resolve({ success: true, id: vidData.id, url: `https://youtube.com/shorts/${vidData.id}` });
              } else {
                resolve({ success: false, error: putBody });
              }
            } catch (e) {
              resolve({ success: false, error: e.message });
            }
          });
        });

        putReq.on('error', e => resolve({ success: false, error: e.message }));
        videoStream.pipe(putReq);
      });

      initReq.on('error', e => resolve({ success: false, error: e.message }));
      initReq.write(metadata);
      initReq.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

async function runCloudCycle() {
  console.log(`\n======================================================`);
  console.log(`🕒 [24/7 CLOUD AUTOPILOT] Cycle start at: ${new Date().toISOString()}`);
  console.log(`======================================================`);

  const config = readJson(CONFIG_FILE, {});
  const posts = readJson(POSTS_FILE, []);

  const pageId = process.env.META_PAGE_ID || config.facebookPageId;
  const igAccountId = process.env.META_IG_ACCOUNT_ID || config.instagramAccountId;
  const token = process.env.META_ACCESS_TOKEN || config.facebookPageAccessToken || config.metaSystemUserToken;

  if (!token) {
    console.warn(`⚠️ [CLOUD AUTOPILOT NOTICE] Meta Access Token not detected in environment or config. Meta posts will be skipped until configured.`);
  }

  const now = new Date();
  let dispatchedCount = 0;

  for (const p of posts) {
    if (p.status === 'Scheduled' && p.date && p.time) {
      const [year, month, day] = p.date.split('-').map(Number);
      const [h, m] = p.time.split(':').map(Number);
      const postTime = new Date(year, month - 1, day, h || 10, m || 0).getTime();

      // If scheduled time has arrived
      if (now.getTime() >= postTime) {
        console.log(`🎯 [TIME MATCH] Dispatching post: "${p.title}" [${p.platform.toUpperCase()}]`);

        const caption = (p.title && !p.content?.startsWith(p.title))
          ? `${p.title}\n\n${p.content || ''}`
          : (p.content || p.title || '');

        let result = null;
        const ytClientId = process.env.YOUTUBE_CLIENT_ID || config.youtubeClientId;
        const ytClientSecret = process.env.YOUTUBE_CLIENT_SECRET || config.youtubeClientSecret;
        const ytRefreshToken = process.env.YOUTUBE_REFRESH_TOKEN || config.youtubeRefreshToken;

        if (p.platform === 'facebook' && pageId) {
          result = await dispatchFacebook(p, pageId, token, p.image, caption);
        } else if (p.platform === 'instagram' && igAccountId) {
          result = await dispatchInstagram(p, igAccountId, token, p.image, caption);
        } else if (p.platform === 'youtube' && ytClientId && ytClientSecret && ytRefreshToken) {
          result = await dispatchYouTube(p, { clientId: ytClientId, clientSecret: ytClientSecret, refreshToken: ytRefreshToken }, p.image, caption);
        } else {
          console.log(`ℹ️ Platform ${p.platform} handled via direct API or fallback.`);
        }

        if (result && result.success) {
          p.status = 'Published';
          p.publishedAt = now.toISOString();
          p.cloudDispatched = true;
          dispatchedCount++;
        }
      }
    }
  }

  if (dispatchedCount > 0) {
    writeJson(POSTS_FILE, posts);
    console.log(`✅ [CLOUD AUTOPILOT] Successfully published ${dispatchedCount} scheduled post(s)! Database updated.`);
  } else {
    console.log(`💤 [CLOUD AUTOPILOT] No pending posts scheduled for the current timestamp window.`);
  }

  console.log(`======================================================\n`);
}

if (require.main === module) {
  runCloudCycle();
}

module.exports = {
  dispatchFacebook,
  dispatchInstagram,
  runCloudCycle
};
