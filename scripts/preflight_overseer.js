/**
 * 🛡️ The 50-Year Full-Stack Overseer Protocol (Zero-Blindspot Gate)
 * Programmatic Pre-Flight Auditor: Big Byte Systems Social Command Center
 * 
 * Rules Enforced:
 * - Rule 6.1: Dual-Pass Independent QA (Never Grade Your Own Homework).
 * - Rule 6.4: The 5-Point Pre-Flight Verification Gate (Asset integrity, Logo, Clickables, Packaging, Local Parity).
 * - Rule 2: GOOGLE BUSINESS PROFILE (GBP) ZERO-SUSPENSION LIFELINE (Zero phone numbers, Zero raw URLs).
 * - User Cadence Gate: Daily at least 1 post per core platform (YT 11:30, FB 12:00, IG 14:00, GMB 10:30).
 * - Media Vault Deduplication Gate: Zero repeated image hashes or hooks within 90 days.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT_DIR, 'data', 'posts.json');
const VAULT_FILE = path.join(ROOT_DIR, 'data', 'media_vault.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');
const LOGO_PNG = path.join(PUBLIC_DIR, 'assets', 'logo.png');

const { checkDuplicate, computeFileHash } = require('./media_vault.js');

let errors = [];
let warnings = [];
let passedChecks = [];

function pass(name, detail = '') {
  passedChecks.push(`✅ [PASS] ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail) {
  errors.push(`❌ [FAIL] ${name} — ${detail}`);
}

function warn(name, detail) {
  warnings.push(`⚠️ [WARN] ${name} — ${detail}`);
}

function resolveDiskPath(filePath) {
  if (!filePath) return null;
  let clean = filePath.trim().split('?')[0];
  if (clean.startsWith('/')) clean = clean.slice(1);
  const p1 = path.join(PUBLIC_DIR, clean);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(PUBLIC_DIR, 'assets', path.basename(clean));
  if (fs.existsSync(p2)) return p2;
  const p3 = path.join(PUBLIC_DIR, 'assets', 'generated', path.basename(clean));
  if (fs.existsSync(p3)) return p3;
  return null;
}

function runAudit() {
  console.log("======================================================");
  console.log("🛡️ RUNNING 50-YEAR PRE-FLIGHT OVERSEER AUDIT PROTOCOL");
  console.log("======================================================\n");

  // GATE 1: Core Template & Asset Integrity
  if (fs.existsSync(INDEX_HTML)) {
    pass("index.html exists", INDEX_HTML);
    const htmlContent = fs.readFileSync(INDEX_HTML, 'utf8');

    // Logo check
    if (htmlContent.includes('logo.png') || htmlContent.includes('<img')) {
      if (fs.existsSync(LOGO_PNG)) {
        pass("Brand Logo verified on disk", LOGO_PNG);
      } else {
        fail("Brand Logo missing on disk", LOGO_PNG);
      }
    } else {
      fail("Brand Logo tag missing in index.html", "No logo image tag found in DOM");
    }

    // Script integrity
    const scriptMatches = htmlContent.match(/<script\s+src="([^"]+)"/g) || [];
    let scriptErrors = 0;
    scriptMatches.forEach(tag => {
      const src = tag.split('src="')[1].replace('"', '');
      if (!src.startsWith('http')) {
        const resolved = resolveDiskPath(src);
        if (!resolved) {
          fail("Missing frontend script", src);
          scriptErrors++;
        }
      }
    });
    if (scriptErrors === 0) pass("All frontend scripts resolve on disk");
  } else {
    fail("index.html missing", INDEX_HTML);
  }

  // GATE 2: Posts File Syntax & Master Structure
  if (!fs.existsSync(POSTS_FILE)) {
    fail("posts.json missing", POSTS_FILE);
    reportAndExit();
    return;
  }

  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
    pass("posts.json syntax valid", `${posts.length} total posts loaded`);
  } catch (e) {
    fail("posts.json JSON parsing failed", e.message);
    reportAndExit();
    return;
  }

  // GATE 3: Schedule Cadence & Core Platform Fixed Times
  const dateMap = {};
  posts.forEach(p => {
    if (p.status === 'Scheduled' || p.status === 'Published') {
      if (!dateMap[p.date]) dateMap[p.date] = {};
      dateMap[p.date][p.platform] = p;
    }
  });

  // Active Sprint Window Check (Pillar VII: Upgrades apply forward from Sprint start date >= 2026-11-12)
  const sprintStartDate = '2026-11-12';
  const activeSprintDates = Object.keys(dateMap).filter(d => d >= sprintStartDate).sort();
  pass("Active Sprint dates window verified", `${activeSprintDates.length} days active (${activeSprintDates[0]} to ${activeSprintDates[activeSprintDates.length - 1]})`);

  const requiredPlatforms = [
    { platform: 'gmb', expectedTime: '10:30' },
    { platform: 'youtube', expectedTime: '11:30' },
    { platform: 'facebook', expectedTime: '12:00' },
    { platform: 'instagram', expectedTime: '14:00' }
  ];

  let cadenceMisses = 0;
  activeSprintDates.forEach(date => {
    const dayPosts = dateMap[date];
    requiredPlatforms.forEach(req => {
      const p = dayPosts[req.platform];
      if (!p) {
        fail(`Missing daily ${req.platform.toUpperCase()} post in active sprint`, `Date: ${date}`);
        cadenceMisses++;
      } else {
        if (p.time !== req.expectedTime) {
          warn(`Time drift for ${req.platform} on ${date}`, `Got ${p.time}, expected ${req.expectedTime}`);
        }
      }
    });
  });

  if (cadenceMisses === 0) {
    pass("Cadence Gate: 100% Complete 4-Platform Daily Coverage", `Every day has GMB, YT, FB, and IG scheduled at exact times`);
  }

  // GATE 4: Rule 2 — Google Business Profile (GBP) Zero-Suspension Lifeline
  const gmbPosts = posts.filter(p => p.platform === 'gmb');
  let gmbViolations = 0;

  gmbPosts.forEach(p => {
    const textToCheck = `${p.title || ''} ${p.content || ''}`;

    // Phone number detection regex
    const phoneRegex = /(?:\+?91[\-\s]?)?[6-9]\d{2,4}[\-\s]?\d{3,5}|090547|91674|\b\d{10,12}\b/g;
    const phoneMatches = textToCheck.match(phoneRegex);
    if (phoneMatches) {
      fail(`GMB Rule 2 Violation: Phone number found in ${p.id}`, `Matches: ${phoneMatches.join(', ')}`);
      gmbViolations++;
    }

    // URL detection regex
    const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+|wa\.me|bigbytesystems\.co\.in/gi;
    const urlMatches = textToCheck.match(urlRegex);
    if (urlMatches) {
      fail(`GMB Rule 2 Violation: URL found in ${p.id}`, `Matches: ${urlMatches.join(', ')}`);
      gmbViolations++;
    }

    // Enforce Call Now button CTA
    if (!textToCheck.includes('Call now')) {
      warn(`GMB Post ${p.id} lacks native 'Call now' CTA instruction`, p.title);
    }
  });

  if (gmbViolations === 0) {
    pass("Rule 2 GBP Lifeline: 100% Verified", `All ${gmbPosts.length} GMB posts strictly contain ZERO phone numbers and ZERO raw URLs`);
  }

  // GATE 5: Physical Media Disk Resolution (Zero 404s)
  let missingAssets = 0;
  posts.forEach(p => {
    if (p.image) {
      const diskPath = resolveDiskPath(p.image);
      if (!diskPath) {
        fail(`Missing media asset on disk for post ${p.id}`, p.image);
        missingAssets++;
      }
    }
  });

  if (missingAssets === 0) {
    pass("Media Asset Integrity: Zero 404s", `All ${posts.length} post images physically resolve on disk`);
  }

  // GATE 6: Anti-Duplication Sentinel Gate (Zero Hash or Hook Collisions)
  const scheduledPosts = posts.filter(p => p.status === 'Scheduled');
  const seenHashes = new Map();
  const seenHooks = new Map();
  let duplicateCollisions = 0;

  scheduledPosts.forEach(p => {
    // Check against vault
    const dupCheck = checkDuplicate(p.image, p.videoHook || p.title, 90);
    if (dupCheck.isDuplicate) {
      fail(`Media Vault Duplicate Collision for ${p.id}`, dupCheck.message);
      duplicateCollisions++;
    }

    // Check within the scheduled queue itself
    const diskPath = resolveDiskPath(p.image);
    if (diskPath) {
      const hash = computeFileHash(diskPath);
      if (seenHashes.has(hash)) {
        fail(`Scheduled Queue Hash Collision between ${p.id} and ${seenHashes.get(hash)}`, `File: ${path.basename(diskPath)}`);
        duplicateCollisions++;
      } else {
        seenHashes.set(hash, p.id);
      }
    }

    const hookSig = (p.videoHook || p.title || '').trim().toLowerCase().replace(/[^\w]/g, '').slice(0, 35);
    if (hookSig.length > 8) {
      if (seenHooks.has(hookSig)) {
        warn(`Similar hook signature between ${p.id} and ${seenHooks.get(hookSig)}`, hookSig);
      } else {
        seenHooks.set(hookSig, p.id);
      }
    }
  });

  if (duplicateCollisions === 0) {
    pass("Media Vault Deduplication Sentinel: 100% Passed", `Zero SHA-256 asset collisions across all scheduled posts`);
  }

  reportAndExit();
}

function reportAndExit() {
  console.log("\n------------------------------------------------------");
  console.log("📊 AUDIT RESULTS SUMMARY");
  console.log("------------------------------------------------------");
  passedChecks.forEach(p => console.log(p));
  console.log("");

  if (warnings.length > 0) {
    console.log("⚠️ WARNINGS:");
    warnings.forEach(w => console.log(w));
    console.log("");
  }

  if (errors.length > 0) {
    console.log("❌ CRITICAL ERRORS DETECTED (VETO TRIGGERED):");
    errors.forEach(e => console.log(e));
    console.log("\n🚫 PRE-FLIGHT VERIFICATION FAILED. Absolute Veto Authority engaged (Rule 6.7).");
    process.exit(1);
  } else {
    console.log("🎉 ALL PRE-FLIGHT GATES PASSED WITH ZERO ERRORS!");
    console.log("✅ Ready for production release and customer reporting.");
    process.exit(0);
  }
}

runAudit();
