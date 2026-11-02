"""
Agent 4: Courier & Command Center Agent
Curates high-impact digests, produces interactive HTML dashboards,
and provisions 1-click WhatsApp delivery to the user's phone (9167463807).
"""

import json
import urllib.parse
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
import config


class CourierAgent:
    def __init__(self, user_phone: str = config.USER_PHONE):
        self.user_phone = user_phone

    def build_whatsapp_digest(self, leads: List[Dict[str, Any]], location: str = "Thane West", max_leads: int = config.MAX_CURATED_LEADS) -> str:
        """
        Formats a clean, punchy WhatsApp digest message for the user.
        """
        curated = leads[:max_leads]
        date_str = datetime.now().strftime("%d %b %Y")

        lines = [
            f"🎯 *BIGBYTE LEAD RADAR* | {location}",
            f"📅 *Date:* {date_str} | *Top Targets:* {len(curated)}",
            "━━━━━━━━━━━━━━━━━━━━━"
        ]

        for idx, lead in enumerate(curated, 1):
            title = lead.get("title", "Local Business")
            rating = lead.get("rating", 0.0)
            reviews = lead.get("reviews_count", 0)
            score = lead.get("opportunity_score", 0)
            primary_gap = lead.get("primary_gap", "Digital Gap")
            phone = lead.get("phone", "N/A")
            wa_link = lead.get("wa_outreach_link", "")

            tier_badge = "🔥 HOT" if score >= 75 else "⚡ WARM"

            lead_block = [
                f"*{idx}. {title}* ({tier_badge} - {score}/100)",
                f"⭐ {rating}★ ({reviews} reviews) | 📞 {phone}",
                f"⚠️ *Gap:* {primary_gap}",
            ]
            if wa_link:
                lead_block.append(f"📲 *1-Tap Outreach:* {wa_link}")
            else:
                lead_block.append("📲 *Action:* Phone outreach needed (Landline)")

            lines.append("\n".join(lead_block))
            lines.append("─────────────────────")

        lines.append("💡 *Tip:* Tap any outreach link to send the pre-written consultative pitch!")
        return "\n".join(lines)

    def generate_html_dashboard(self, leads: List[Dict[str, Any]], query_name: str, output_path: Path) -> Path:
        """
        Generates a state-of-the-art dark-mode glassmorphic lead management dashboard.
        """
        leads_json = json.dumps(leads, ensure_ascii=False)
        total_leads = len(leads)
        hot_leads = sum(1 for l in leads if l.get("priority_tier") == "HOT")
        missing_web = sum(1 for l in leads if not l.get("website"))
        low_rev = sum(1 for l in leads if l.get("reviews_count", 0) < 35)

        digest_text = self.build_whatsapp_digest(leads, location=query_name)
        digest_wa_link = f"https://wa.me/{self.user_phone}?text={urllib.parse.quote(digest_text)}"

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hyperlocal Lead Radar | {query_name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #090d16;
            --surface: #111827;
            --surface-hover: #1e293b;
            --border: rgba(255, 255, 255, 0.08);
            --primary: #3b82f6;
            --primary-glow: rgba(59, 130, 246, 0.25);
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --wa-green: #25d366;
            --wa-green-glow: rgba(37, 211, 102, 0.25);
        }}
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }}
        body {{
            background: radial-gradient(circle at top right, #1e1b4b 0%, var(--bg) 60%);
            color: var(--text-main);
            min-height: 100vh;
            padding: 24px;
        }}
        header {{
            max-width: 1400px;
            margin: 0 auto 24px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
        }}
        .brand h1 {{
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 700;
            background: linear-gradient(135deg, #60a5fa, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        .brand p {{
            color: var(--text-muted);
            font-size: 14px;
            margin-top: 4px;
        }}
        .actions {{
            display: flex;
            gap: 12px;
            align-items: center;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
            border: none;
        }}
        .btn-whatsapp {{
            background: var(--wa-green);
            color: #0b2413;
            box-shadow: 0 4px 14px var(--wa-green-glow);
        }}
        .btn-whatsapp:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }}
        .stats-grid {{
            max-width: 1400px;
            margin: 0 auto 24px auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
        }}
        .stat-card {{
            background: rgba(17, 24, 39, 0.75);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            padding: 18px;
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }}
        .stat-label {{
            color: var(--text-muted);
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .stat-val {{
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 700;
            margin-top: 6px;
        }}
        .controls {{
            max-width: 1400px;
            margin: 0 auto 24px auto;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }}
        .search-box {{
            flex: 1;
            min-width: 280px;
            background: rgba(17, 24, 39, 0.8);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 16px;
            color: white;
            font-size: 14px;
            outline: none;
        }}
        .search-box:focus {{
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }}
        .filter-select {{
            background: rgba(17, 24, 39, 0.8);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 16px;
            color: white;
            font-size: 14px;
            outline: none;
            cursor: pointer;
        }}
        .leads-grid {{
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 20px;
        }}
        .lead-card {{
            background: rgba(17, 24, 39, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 22px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }}
        .lead-card:hover {{
            transform: translateY(-4px);
            border-color: rgba(99, 102, 241, 0.4);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }}
        .card-top {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
        }}
        .lead-title {{
            font-family: 'Outfit', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            line-height: 1.3;
        }}
        .badge {{
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            flex-shrink: 0;
        }}
        .badge-hot {{
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }}
        .badge-warm {{
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }}
        .meta-row {{
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
            font-size: 13px;
            color: var(--text-muted);
        }}
        .rating-badge {{
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(251, 191, 36, 0.12);
            color: #f59e0b;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 600;
        }}
        .gaps-container {{
            margin: 12px 0 18px 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }}
        .gap-pill {{
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 12px;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            gap: 6px;
        }}
        .card-actions {{
            display: flex;
            gap: 8px;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid var(--border);
        }}
        .btn-card {{
            flex: 1;
            text-align: center;
            justify-content: center;
            font-size: 13px;
            padding: 8px 12px;
        }}
        .btn-secondary {{
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-main);
            border: 1px solid var(--border);
        }}
        .btn-secondary:hover {{
            background: rgba(255, 255, 255, 0.12);
        }}
        .toast {{
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--surface);
            border: 1px solid var(--success);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 14px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            display: none;
            z-index: 1000;
        }}
    </style>
</head>
<body>

    <header>
        <div class="brand">
            <h1>📡 BigByte Hyperlocal Lead Radar</h1>
            <p>Target: <strong>{query_name}</strong> | Autonomous Multi-Agent Lead Intelligence</p>
        </div>
        <div class="actions">
            <a href="video_pitch_demo.html" class="btn" style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #c084fc;">
                🎬 Watch Video Pitch Demo
            </a>
            <a href="{digest_wa_link}" target="_blank" class="btn btn-whatsapp">
                📲 Send Digest to My WhatsApp
            </a>
        </div>
    </header>

    <section class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Total Harvested</div>
            <div class="stat-val" style="color: #60a5fa;">{total_leads}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Hot Opportunities</div>
            <div class="stat-val" style="color: #f87171;">{hot_leads}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Missing Website</div>
            <div class="stat-val" style="color: #fbbf24;">{missing_web}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Low Reviews (< 35)</div>
            <div class="stat-val" style="color: #a78bfa;">{low_rev}</div>
        </div>
    </section>

    <div class="controls">
        <input type="text" id="searchBox" class="search-box" placeholder="🔍 Search business by name, street, or gap..." oninput="filterCards()">
        <select id="tierFilter" class="filter-select" onchange="filterCards()">
            <option value="ALL">All Opportunities</option>
            <option value="HOT">🔥 HOT Leads (Score >= 75)</option>
            <option value="WARM">⚡ WARM Leads (Score >= 55)</option>
        </select>
        <select id="webFilter" class="filter-select" onchange="filterCards()">
            <option value="ALL">All Web Status</option>
            <option value="NO_WEB">❌ Missing Website Only</option>
            <option value="HAS_WEB">🌐 Has Website</option>
        </select>
    </div>

    <div class="leads-grid" id="leadsGrid"></div>

    <div id="toast" class="toast">✅ Pitch copied to clipboard!</div>

    <script>
        const leads = {leads_json};

        function renderLeads(list) {{
            const grid = document.getElementById('leadsGrid');
            if (list.length === 0) {{
                grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px;">No leads matching filters.</p>';
                return;
            }}

            grid.innerHTML = list.map((lead, idx) => {{
                const isHot = lead.opportunity_score >= 75;
                const badgeClass = isHot ? 'badge-hot' : 'badge-warm';
                const badgeText = isHot ? `🔥 HOT (${{lead.opportunity_score}})` : `⚡ WARM (${{lead.opportunity_score}})`;
                const gapsHtml = (lead.digital_gaps || []).map(g => `<div class="gap-pill">⚠️ ${{g}}</div>`).join('');
                
                const waBtn = lead.wa_outreach_link 
                    ? `<a href="${{lead.wa_outreach_link}}" target="_blank" class="btn btn-card btn-whatsapp">📲 Open Pitch</a>`
                    : `<span class="btn btn-card btn-secondary" style="opacity:0.6; cursor:not-allowed;">No Mobile</span>`;

                return `
                    <div class="lead-card">
                        <div>
                            <div class="card-top">
                                <h3 class="lead-title">${{lead.title}}</h3>
                                <span class="badge ${{badgeClass}}">${{badgeText}}</span>
                            </div>
                            <div class="meta-row">
                                <span class="rating-badge">⭐ ${{lead.rating || '0.0'}}</span>
                                <span>💬 ${{lead.reviews_count || 0}} reviews</span>
                                <span>📞 ${{lead.phone || 'No phone'}}</span>
                            </div>
                            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
                                📍 ${{lead.address || 'Local Area'}}
                            </p>
                            <div class="gaps-container">
                                ${{gapsHtml}}
                            </div>
                        </div>
                        <div class="card-actions">
                            ${{waBtn}}
                            <button class="btn btn-card btn-secondary" onclick="copyPitch(${{idx}})">📋 Copy Pitch</button>
                        </div>
                    </div>
                `;
            }}).join('');
        }}

        function filterCards() {{
            const search = document.getElementById('searchBox').value.toLowerCase();
            const tier = document.getElementById('tierFilter').value;
            const web = document.getElementById('webFilter').value;

            const filtered = leads.filter(l => {{
                const matchSearch = (l.title || '').toLowerCase().includes(search) ||
                                    (l.address || '').toLowerCase().includes(search) ||
                                    (l.digital_gaps || []).some(g => g.toLowerCase().includes(search));
                
                const matchTier = tier === 'ALL' || l.priority_tier === tier;
                
                let matchWeb = true;
                if (web === 'NO_WEB') matchWeb = !l.website;
                if (web === 'HAS_WEB') matchWeb = !!l.website;

                return matchSearch && matchTier && matchWeb;
            }});

            renderLeads(filtered);
        }}

        function copyPitch(index) {{
            const lead = leads[index];
            if (lead && lead.pitch_message) {{
                navigator.clipboard.writeText(lead.pitch_message).then(() => {{
                    showToast();
                }});
            }}
        }}

        function showToast() {{
            const t = document.getElementById('toast');
            t.style.display = 'block';
            setTimeout(() => {{ t.style.display = 'none'; }}, 2500);
        }}

        // Initial render
        renderLeads(leads);
    </script>
</body>
</html>
"""
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"[CourierAgent] 📊 Interactive Lead Dashboard generated at: {output_path}")
        return output_path

    def generate_delivery_batch_script(self, digest_text: str, script_path: Path) -> Path:
        """
        Creates a 1-click Windows batch launcher to send the digest directly to the user's WhatsApp.
        """
        encoded_text = urllib.parse.quote(digest_text)
        wa_url = f"https://wa.me/{self.user_phone}?text={encoded_text}"

        bat_content = f"""@echo off
echo ====================================================
echo  🚀 Dispatching Curated Lead Digest to Your WhatsApp
echo  Recipient: +{self.user_phone}
echo ====================================================
start "" "{wa_url}"
echo Done! WhatsApp will open with your pre-filled digest.
"""
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(bat_content)

        return script_path
