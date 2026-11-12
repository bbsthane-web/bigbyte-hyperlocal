/**
 * Big Byte Systems - Cryptographic Media Vault & Deduplication Sentinel
 * Ensures zero repeated images, reels, or video hooks across all platforms.
 * Enforces a strict 90-day anti-repetition window.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const VAULT_FILE = path.join(DATA_DIR, 'media_vault.json');

// Ensure vault file exists
function loadVault() {
  if (!fs.existsSync(VAULT_FILE)) {
    fs.writeFileSync(VAULT_FILE, JSON.stringify({ version: "1.0", assets: {}, hooks: {} }, null, 2), 'utf8');
  }
  try {
    return JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));
  } catch (_) {
    return { version: "1.0", assets: {}, hooks: {} };
  }
}

function saveVault(vault) {
  fs.writeFileSync(VAULT_FILE, JSON.stringify(vault, null, 2), 'utf8');
}

/**
 * Computes SHA-256 fingerprint for a physical file on disk
 */
function computeFileHash(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Normalizes and fingerprints video hook / opening sentence
 */
function computeHookFingerprint(text) {
  if (!text) return null;
  const clean = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 10)
    .join(' ');
  return crypto.createHash('sha256').update(clean).digest('hex');
}

/**
 * Resolves local file path from URL or relative path
 */
function resolveLocalPath(assetUri) {
  if (!assetUri) return null;
  const clean = assetUri.split('?')[0].replace(/^\/+/, '');
  const p1 = path.join(__dirname, '..', 'public', clean);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(__dirname, '..', 'public', 'assets', path.basename(clean));
  if (fs.existsSync(p2)) return p2;
  return null;
}

/**
 * Checks whether an asset or hook has been published in the past lookbackDays
 */
function checkDuplicate(assetUri, hookText, lookbackDays = 90) {
  const vault = loadVault();
  const now = Date.now();
  const maxAgeMs = lookbackDays * 24 * 60 * 60 * 1000;

  // 1. Check File Hash
  const localFile = resolveLocalPath(assetUri);
  if (localFile) {
    const fileHash = computeFileHash(localFile);
    if (fileHash && vault.assets[fileHash]) {
      const record = vault.assets[fileHash];
      const ageMs = now - new Date(record.lastPublished).getTime();
      if (ageMs < maxAgeMs) {
        return {
          isDuplicate: true,
          type: 'MEDIA_ASSET_COLLISION',
          message: `Asset "${path.basename(localFile)}" was already published on ${record.platform} on ${record.date} (Post ID: ${record.postId})`,
          hash: fileHash
        };
      }
    }
  }

  // 2. Check Hook Fingerprint
  if (hookText) {
    const hookHash = computeHookFingerprint(hookText);
    if (hookHash && vault.hooks[hookHash]) {
      const record = vault.hooks[hookHash];
      const ageMs = now - new Date(record.lastPublished).getTime();
      if (ageMs < maxAgeMs) {
        return {
          isDuplicate: true,
          type: 'HOOK_TEXT_COLLISION',
          message: `Opening hook was already used on ${record.platform} on ${record.date} (Post ID: ${record.postId})`,
          hash: hookHash
        };
      }
    }
  }

  return { isDuplicate: false };
}

/**
 * Registers a published or scheduled post into the vault
 */
function recordAsset(post) {
  if (!post) return;
  const vault = loadVault();
  const nowIso = new Date().toISOString();
  const dateStr = post.date || nowIso.split('T')[0];

  const localFile = resolveLocalPath(post.image || post.mediaUrl);
  if (localFile) {
    const fileHash = computeFileHash(localFile);
    if (fileHash) {
      vault.assets[fileHash] = {
        postId: post.id,
        platform: post.platform,
        fileName: path.basename(localFile),
        date: dateStr,
        lastPublished: nowIso
      };
    }
  }

  const hook = post.videoHook || post.title;
  if (hook) {
    const hookHash = computeHookFingerprint(hook);
    if (hookHash) {
      vault.hooks[hookHash] = {
        postId: post.id,
        platform: post.platform,
        snippet: hook.substring(0, 60),
        date: dateStr,
        lastPublished: nowIso
      };
    }
  }

  saveVault(vault);
}

module.exports = {
  computeFileHash,
  computeHookFingerprint,
  resolveLocalPath,
  checkDuplicate,
  recordAsset,
  loadVault
};
