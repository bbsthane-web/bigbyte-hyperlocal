# 🚀 Big Byte Social Studio & Agency Command Center
### Turnkey Multi-Platform Social Media Scheduler, Reel Creator & Multi-Client Side-Hustle Platform

---

## 🌟 What This Platform Does
1. **Single Command Center**: View all scheduled posts, calendars, and channels (Google Business Profile, YouTube Shorts, Instagram, Facebook, LinkedIn) in one unified dashboard.
2. **Built-in Reel & Graphic Creator**:
   - 1-Click proven laboratory topic presets (Overheating & Humidity, Dead MacBook Micro-Soldering, Epson Waste Pad Reset, Broken Hinge Fabrication, etc.).
   - Live Canvas Graphic Maker for 9:16 vertical Reel covers, 1:1 square posts, and 16:9 banners.
   - High-retention 0-3s hook generator, 3-scene visual storyboard cue generator, and compliance linter.
3. **Autonomous Background Scheduler Daemon**:
   - Runs 24/7 on your local PC or cPanel hosting.
   - Polling every 15 seconds, automatically dispatches scheduled posts to your Make.com webhook URL (`https://hook.eu1.make.com/3j97xsx8t9cd9xcjpnypqhjw9i1mumwo`).
4. **Multi-Client Agency Side Hustle Ready**:
   - Switch between clients with 1 click.
   - Add new client accounts (Dentists, Cafes, Law Firms, Gyms, Real Estate) with their custom hotline, address, and dedicated webhook URL.
   - Package and sell as a ₹5,000 - ₹25,000/month recurring social media retainer!

---

## 💻 Option 1: Running Locally on Your PC (Free Forever)
1. Double-click `launch_social_studio.bat` in your workspace or desktop shortcut.
2. The background server starts automatically on port 3000 and opens `http://localhost:3000` in your default browser.
3. Big Byte Systems is active with 30 pre-scheduled posts ready for autopilot.

---

## 🌐 Option 2: Hosting on Your Trusted cPanel Shared Hosting (For Side Hustle)
You can host this entire platform on your cPanel account (`https://social.yourdomain.com` or `https://yourdomain.com/social/`) with **ZERO Node.js setup needed**:

### Step-by-Step cPanel Deployment:
1. Open cPanel File Manager.
2. Create a folder (e.g. `public_html/studio` or subdomain `studio.bigbytesystems.co.in`).
3. Upload and extract `deploy_archive/bigbyte_social_studio_cpanel.zip`.
4. Ensure folder permissions for `data/` are set to `755` (writable).
5. Done! The included `api.php` handles all REST API calls and webhooks using standard PHP cURL.
6. To enable 24/7 autonomous scheduling on cPanel without Node, add a standard cPanel Cron Job:
   - Run every 15 minutes: `curl -s https://yourdomain.com/studio/api.php?cron=1 >/dev/null 2>&1`

---

## 💼 How to Sell This as an Agency Side Hustle
1. **Pitch**: "We automate high-engagement local reels, Google Business posts, and social updates on 100% autopilot."
2. **Add Client**: Click **Clients (Side Hustle)** tab -> **+ Add New Client Business**.
3. **Configure**: Enter their business name, niche, hotline, and free Make.com/Zapier webhook.
4. **Generate**: Click **Content & Reel Studio** -> pick a topic preset -> generate hook, script & canvas graphic -> click **Add to Schedule**.
5. **Retainer**: Collect monthly retainers while the system publishes hands-free!
