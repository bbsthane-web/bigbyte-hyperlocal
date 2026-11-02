/**
 * 24/7 Autonomous Zero-Expense Cloud Dispatcher
 * Runs via GitHub Actions Cron (or cPanel Linux Cron)
 * 100% Free, Zero Hosting Cost, 100% Laptop-Off / Sleep-Proof
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'data', 'config.json');
const POSTS_FILE = path.join(ROOT_DIR, 'data', 'posts.json');

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

// 100% Free Zero-Cost Instant Fast CDN Relay (Catbox)
function uploadToFreeCdn(filePath) {
  return new Promise((resolve) => {
    try {
      const boundary = '----NodeFormBoundary' + Math.random().toString(36).substring(2);
      const crlf = '\r\n';
      const fileBuf = fs.readFileSync(filePath);
      const filename = path.basename(filePath);
      const ext = path.extname(filename).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.mp4') mime = 'video/mp4';
      else if (ext === '.webm') mime = 'video/webm';
      else if (ext === '.png') mime = 'image/png';

      const parts = [
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="reqtype"${crlf}${crlf}fileupload${crlf}`),
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="fileToUpload"; filename="${filename}"${crlf}Content-Type: ${mime}${crlf}${crlf}`),
        fileBuf,
        Buffer.from(crlf),
        Buffer.from(`--${boundary}--${crlf}`)
      ];
      const payload = Buffer.concat(parts);

      const req = https.request({
        hostname: 'catbox.moe',
        port: 443,
        path: '/user/api.php',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=' + boundary,
          'Content-Length': payload.length,
          'User-Agent': 'BigByteStudioCloud/2.0'
        }
      }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          const url = body.trim();
          if (url.startsWith('http')) {
            console.log(`🌐 [CLOUD CDN] ${filename} hosted at: ${url}`);
            resolve(url);
          } else {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.setTimeout(12000, () => { req.destroy(); resolve(null); });
      req.write(payload);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
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

    // Direct Multipart Buffer
    if (localFile && fs.existsSync(localFile)) {
      console.log(`📦 [CLOUD FB] Direct uploading local file: ${path.basename(localFile)}`);
      const boundary = '----NodeFormBoundary' + Math.random().toString(36).substring(2);
      const crlf = '\r\n';
      const fileBuf = fs.readFileSync(localFile);
      const filename = path.basename(localFile);

      const parts = [
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="message"${crlf}${crlf}${caption}${crlf}`),
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
      message: caption,
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

// Direct Instagram Dispatcher
function dispatchInstagram(post, igAccountId, token, imageUrl, caption) {
  return new Promise(async (resolve) => {
    let targetMediaUrl = null;
    const localFile = resolveAsset(imageUrl || post.image);
    const isVideo = Boolean(
      (localFile && (localFile.endsWith('.mp4') || localFile.endsWith('.webm'))) ||
      (post.image && (post.image.endsWith('.mp4') || post.image.endsWith('.webm'))) ||
      post.mediaFormat === 'VIDEO' || post.mediaFormat === 'REELS'
    );

    if (localFile && fs.existsSync(localFile)) {
      targetMediaUrl = await uploadToFreeCdn(localFile);
    }
    if (!targetMediaUrl) {
      targetMediaUrl = 'https://bigbytesystems.co.in/assets/hero.jpg';
    }

    let safeCaption = (caption || post.content || '').trim();
    if (safeCaption.length > 2150) safeCaption = safeCaption.substring(0, 2145) + '...';

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
            console.error(`❌ [CLOUD IG ERROR]`, parsed.error ? parsed.error.message : body);
            return resolve({ success: false, error: parsed.error?.message || body });
          }

          const containerId = parsed.id;
          console.log(`📸 [CLOUD IG] Container created (${containerId}). Waiting 3s for publish...`);

          setTimeout(() => {
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
                    console.log(`🚀 [CLOUD IG SUCCESS] Published! Media ID: ${pubParsed.id}`);
                    return resolve({ success: true, id: pubParsed.id });
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
          }, 3500);

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
    console.error(`❌ [CLOUD AUTOPILOT] No Meta Access Token configured!`);
    process.exit(1);
  }

  const now = new Date();
  let dispatchedCount = 0;

  for (const p of posts) {
    if (p.status === 'Scheduled' && p.date && p.time) {
      const [year, month, day] = p.date.split('-').map(Number);
      const [h, m] = p.time.split(':').map(Number);
      const postTime = new Date(year, month - 1, day, h || 10, m || 0).getTime();

      // If scheduled time has arrived (or is within past 2 hours)
      if (now.getTime() >= postTime) {
        console.log(`🎯 [TIME MATCH] Dispatching post: "${p.title}" [${p.platform.toUpperCase()}]`);

        const caption = (p.title && !p.content?.startsWith(p.title))
          ? `${p.title}\n\n${p.content || ''}`
          : (p.content || p.title || '');

        let result = null;
        if (p.platform === 'facebook' && pageId) {
          result = await dispatchFacebook(p, pageId, token, p.image, caption);
        } else if (p.platform === 'instagram' && igAccountId) {
          result = await dispatchInstagram(p, igAccountId, token, p.image, caption);
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

runCloudCycle();
