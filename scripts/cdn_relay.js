/**
 * Zero-Cost Multi-Relay CDN Uploader
 * 100% Free, No API Keys, Instant Public HTTPS URLs
 * Primary: Uguu.se (Instant, High Speed)
 * Fallback: Tmpfiles.org (Instant, High Capacity)
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

function uploadToUguu(filePath) {
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
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="files[]"; filename="${filename}"${crlf}Content-Type: ${mime}${crlf}${crlf}`),
        fileBuf,
        Buffer.from(crlf),
        Buffer.from(`--${boundary}--${crlf}`)
      ];
      const payload = Buffer.concat(parts);

      const req = https.request({
        hostname: 'uguu.se',
        port: 443,
        path: '/upload.php',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=' + boundary,
          'Content-Length': payload.length,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.success && parsed.files && parsed.files[0] && parsed.files[0].url) {
              const url = parsed.files[0].url;
              console.log(`🌐 [UGUU CDN] ${filename} hosted at: ${url}`);
              resolve(url);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.setTimeout(15000, () => { req.destroy(); resolve(null); });
      req.write(payload);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

function uploadToTmpfiles(filePath) {
  return new Promise((resolve) => {
    try {
      const boundary = '----NodeFormBoundary' + Math.random().toString(36).substring(2);
      const crlf = '\r\n';
      const fileBuf = fs.readFileSync(filePath);
      const filename = path.basename(filePath);
      const ext = path.extname(filename).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.mp4') mime = 'video/mp4';
      else if (ext === '.png') mime = 'image/png';

      const parts = [
        Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${filename}"${crlf}Content-Type: ${mime}${crlf}${crlf}`),
        fileBuf,
        Buffer.from(crlf),
        Buffer.from(`--${boundary}--${crlf}`)
      ];
      const payload = Buffer.concat(parts);

      const req = https.request({
        hostname: 'tmpfiles.org',
        port: 443,
        path: '/api/v1/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=' + boundary,
          'Content-Length': payload.length,
          'User-Agent': 'BigByteStudio/2.0'
        }
      }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.status === 'success' && parsed.data && parsed.data.url) {
              // Convert https://tmpfiles.org/123/name to https://tmpfiles.org/dl/123/name for direct download
              const rawUrl = parsed.data.url;
              const directUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
              console.log(`🌐 [TMPFILES CDN] ${filename} hosted at: ${directUrl}`);
              resolve(directUrl);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.setTimeout(15000, () => { req.destroy(); resolve(null); });
      req.write(payload);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

async function uploadToFreeCdn(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [CDN RELAY] File not found: ${filePath}`);
    return null;
  }

  // Attempt 1: Uguu.se
  let url = await uploadToUguu(filePath);
  if (url) return url;

  console.warn(`⚠️ [CDN RELAY] Primary relay Uguu failed or timed out. Switching to Tmpfiles fallback...`);
  // Attempt 2: Tmpfiles.org
  url = await uploadToTmpfiles(filePath);
  if (url) return url;

  console.error(`❌ [CDN RELAY] All zero-cost relays failed for ${path.basename(filePath)}`);
  return null;
}

module.exports = {
  uploadToFreeCdn,
  uploadToUguu,
  uploadToTmpfiles
};
