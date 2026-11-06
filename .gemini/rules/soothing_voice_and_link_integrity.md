---
description: Mandatory standards for human voice synthesis, landing page integrity, and 1000% factual reporting for Big Byte Systems
---

# BIG BYTE SYSTEMS CHIEF ARCHITECT MANDATORY RULES

## 1. Voice & Sound Synthesis Standards
- **Zero Mechanical/Robotic Audio**: Never use default Windows desktop SAPI 5 speech (`System.Speech.Synthesis`) for production reels, shorts, or customer-facing media.
- **Mandatory Neural Indian Voice**: Always synthesize voiceovers using **Microsoft Edge Neural Indian English** (`en-IN-NeerjaExpressiveNeural` for pleasant, warm Indian female tone; `en-IN-PrabhatNeural` for authoritative Indian male tone) via `scripts/neural_tts.py`.
- **Audio Engineering Standards**: All videos must encode stereo AAC at 44.1 kHz, 192 kbps, with peak volume normalized between -3.0 dB and -6.5 dB to ensure crystal-clear audibility on smartphones without distortion.

## 2. Production Landing Page & Link Integrity
- **Zero 404 Pages**: Any masked vanity link used in social copy (e.g., `https://bigbytesystems.co.in/chat`) MUST resolve to a live, authoritative mobile-first triage conversion page (`chat/index.html`).
- **Required Conversion Architecture for `/chat`**:
  - Friendly Desi Lady Technical Coordinator badge (Ananya Sharma).
  - Welcoming voice greeting note (`/assets/audio/ananya_greeting.mp3`).
  - 6-Niche capability infographic cards (Chip-Level Logic Board, EcoTank & Laser Lab, Cleanroom Data Recovery, 20-Min SSD Speed Upgrade, VHS Digitization, Structural Epoxy Hinge Rebuild).
  - Prominent 1-tap WhatsApp button (`wa.me/919167463807`), Hotline Call button (`09054790592`), and Google Maps Navigation link (`https://share.google/qoQk9AHu9lm7UxlAH`).
  - Strict trailing slash & query parameter preservation in `.htaccess` (so `?fbclid=...` and Google UTM parameters never cause a 404).

## 3. Google Business Profile (GMB) Truth & Relay Protocol
- **Zero False Positives**: Never report a post as "live on Google Maps" solely because a webhook returned HTTP 200. Always distinguish between:
  1. Webhook accepted by Make.com relay.
  2. Google Business Profile API quota status (custom GCP projects require approved GBP API access; default quota is 0).
  3. Active Make.com scenario execution.
- Maintain strict Anti-Suspension Compliance (zero plain phone numbers, zero external URLs in GMB description body, relying exclusively on Google's native CALL button).

## 4. 1000% Factual Operational Accountability
- Every operational update must provide verifiable, clickable direct URLs (direct YouTube Shorts URL, Facebook post ID, Instagram media ID).
- Never report simulated or local mock states as public live deployments. Always verify against production endpoints.
