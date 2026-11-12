"""
High-Craft Technical Diagnostic Graphic Generator — Big Byte Systems
Generates 100% deterministic, high-resolution 1080x1920 (9:16) & 1080x1080 (1:1) graphic plates.
Zero AI Slop: Authentic dark lab theme, crisp typography, technical telemetry, GPS anchors.
"""

import sys
import os
import json
from PIL import Image, ImageDraw, ImageFont

FONTS = {
    "title": r"C:\Windows\Fonts\segoeuib.ttf",
    "bold": r"C:\Windows\Fonts\segoeuib.ttf",
    "regular": r"C:\Windows\Fonts\segoeui.ttf",
    "mono": r"C:\Windows\Fonts\consola.ttf",
}

THEMES = {
    "thermal": {
        "accent": (56, 189, 248),      # Cyan
        "accent_bg": (14, 50, 75),
        "tag": "❄️ THERMAL LAB TRIAGE",
        "badge_color": (34, 197, 94),   # Emerald
        "compare_bad": "Factory Paste: 94°C (Throttling)",
        "compare_good": "Arctic MX-4 Lab: 58°C (Whisper-Quiet)"
    },
    "macbook": {
        "accent": (245, 158, 11),     # Amber
        "accent_bg": (65, 42, 10),
        "tag": "🔬 CHIP-LEVEL MICRO-SOLDERING",
        "badge_color": (56, 189, 248),
        "compare_bad": "Authorized Swap: ₹45,000+ (Wait 14 Days)",
        "compare_good": "Logic Board Triage: Save ₹30,000+ (90-Day Warranty)"
    },
    "data_recovery": {
        "accent": (239, 68, 68),      # Red/Coral
        "accent_bg": (60, 20, 20),
        "tag": "💾 CLEANROOM DATA EXTRACTION",
        "badge_color": (34, 197, 94),
        "compare_bad": "Repeated Power-On: Heads Scrape Platters",
        "compare_good": "Clean-Bench Triage: Bit-Level Cloning"
    },
    "hinge": {
        "accent": (168, 85, 247),     # Purple
        "accent_bg": (45, 20, 65),
        "tag": "🔧 CHASSIS STRUCTURAL RECONSTRUCTION",
        "badge_color": (56, 189, 248),
        "compare_bad": "Broken Brass Inserts: Cracked Display",
        "compare_good": "Metal Pin + Dual-Epoxy: Factory Strength"
    },
    "printer": {
        "accent": (16, 185, 129),     # Emerald
        "accent_bg": (10, 50, 35),
        "tag": "🖨️ ECOTANK & LASER MAINTENANCE",
        "badge_color": (245, 158, 11),
        "compare_bad": "Waste Pad Saturated: Motherboard Short Risk",
        "compare_good": "Fresh Absorbers + EEPROM Reset: Same-Day"
    },
    "vhs": {
        "accent": (236, 72, 153),     # Pink
        "accent_bg": (60, 15, 40),
        "tag": "📼 VINTAGE TAPE 4K AI DIGITIZATION",
        "badge_color": (56, 189, 248),
        "compare_bad": "Tape Fungus & Degradation: Lost Memories",
        "compare_good": "Chemical De-mold + 4K MP4: Preserved Forever"
    },
    "custom_pc": {
        "accent": (59, 130, 246),     # Blue
        "accent_bg": (15, 35, 70),
        "tag": "🎮 CUSTOM WORKSTATION & RIG TUNING",
        "badge_color": (168, 85, 247),
        "compare_bad": "Restricted Airflow & Tangled Cables",
        "compare_good": "Positive Pressure + Custom Fan Curves"
    },
    "ssd": {
        "accent": (20, 184, 166),     # Teal
        "accent_bg": (10, 50, 45),
        "tag": "⚡ ZERO DATA-LOSS NVMe SSD CLONING",
        "badge_color": (34, 197, 94),
        "compare_bad": "Mechanical HDD: 100% Disk Usage Crawl",
        "compare_good": "Gen4 NVMe: 3500MB/s Instant Boot"
    }
}

def get_font(font_key, size):
    font_path = FONTS.get(font_key, FONTS["regular"])
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_graphic(output_path, title, bullets, theme_key="thermal", is_vertical=True, platform="generic"):
    width = 1080
    height = 1920 if is_vertical else 1080
    theme = THEMES.get(theme_key, THEMES["thermal"])

    img = Image.new("RGB", (width, height), color=(10, 15, 29)) # Dark lab slate
    draw = ImageDraw.Draw(img)

    # 1. Subtle Background Grid (Tech Vibe)
    grid_color = (18, 25, 42)
    step = 60
    for x in range(0, width, step):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, step):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # 2. Glowing Accent Border / Top Header
    draw.rectangle([(0, 0), (width, 8)], fill=theme["accent"])

    # 3. Official Lab Header Card
    top_y = 60 if is_vertical else 40
    draw_rounded_rect(draw, [50, top_y, width - 50, top_y + 110], 16, fill=(16, 23, 41), outline=(30, 41, 59), width=2)
    
    font_brand = get_font("bold", 34)
    font_sub = get_font("regular", 22)
    font_badge = get_font("bold", 20)

    draw.text((80, top_y + 20), "BIG BYTE SYSTEMS", fill=(255, 255, 255), font=font_brand)
    draw.text((80, top_y + 64), "Component-Level Diagnostic Lab • Thane West", fill=(148, 163, 184), font=font_sub)

    # Platform badge on top right
    platform_labels = {
        "youtube": ("▶ YOUTUBE SHORTS", (239, 68, 68)),
        "instagram": ("📸 INSTAGRAM REEL", (236, 72, 153)),
        "facebook": ("👍 FACEBOOK LAB", (59, 130, 246)),
        "gmb": ("📍 GOOGLE VERIFIED", (34, 197, 94)),
        "linkedin": ("💼 ENTERPRISE B2B", (20, 184, 166))
    }
    p_text, p_color = platform_labels.get(platform, ("⭐ 4.9★ LAB RATED", (245, 158, 11)))

    draw_rounded_rect(draw, [width - 340, top_y + 25, width - 80, top_y + 85], 12, fill=(30, 41, 59), outline=p_color, width=1)
    draw.text((width - 325, top_y + 42), p_text, fill=p_color, font=font_badge)

    # 4. Service Category Pill Badge
    badge_y = top_y + 140 if is_vertical else top_y + 130
    draw_rounded_rect(draw, [50, badge_y, 520, badge_y + 55], 28, fill=theme["accent_bg"], outline=theme["accent"], width=2)
    draw.text((75, badge_y + 15), theme["tag"], fill=theme["accent"], font=get_font("bold", 22))

    # 5. Main Diagnostic Title (Multi-line wrap)
    title_y = badge_y + 80
    font_title = get_font("bold", 54 if is_vertical else 44)

    # Simple word wrap for title
    words = title.split()
    lines = []
    cur_line = []
    for w in words:
        test_line = " ".join(cur_line + [w])
        bbox = draw.textbbox((0, 0), test_line, font=font_title)
        if bbox[2] - bbox[0] > (width - 120):
            lines.append(" ".join(cur_line))
            cur_line = [w]
        else:
            cur_line.append(w)
    if cur_line:
        lines.append(" ".join(cur_line))

    for line in lines[:3]:
        draw.text((60, title_y), line, fill=(255, 255, 255), font=font_title)
        title_y += 70 if is_vertical else 55

    # 6. Technical Telemetry Comparison Card
    tele_y = title_y + (40 if is_vertical else 20)
    card_h = 230 if is_vertical else 180
    draw_rounded_rect(draw, [50, tele_y, width - 50, tele_y + card_h], 20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    
    # Left: Bad outcome
    draw_rounded_rect(draw, [80, tele_y + 25, width - 80, tele_y + (card_h // 2) - 10], 12, fill=(45, 18, 20), outline=(239, 68, 68), width=1)
    draw.text((105, tele_y + 40), f"❌  {theme['compare_bad']}", fill=(248, 113, 113), font=get_font("bold", 24 if is_vertical else 20))

    # Right: Lab outcome
    draw_rounded_rect(draw, [80, tele_y + (card_h // 2) + 10, width - 80, tele_y + card_h - 25], 12, fill=(16, 42, 28), outline=(34, 197, 94), width=1)
    draw.text((105, tele_y + (card_h // 2) + 25), f"✅  {theme['compare_good']}", fill=(74, 222, 128), font=get_font("bold", 24 if is_vertical else 20))

    # 7. Actionable Diagnostic Bullet Points Card
    bullet_y = tele_y + card_h + (40 if is_vertical else 20)
    b_card_h = (len(bullets) * 110 + 60) if is_vertical else (len(bullets) * 75 + 40)
    draw_rounded_rect(draw, [50, bullet_y, width - 50, bullet_y + b_card_h], 20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

    draw.text((80, bullet_y + 25), "DIAGNOSTIC PROTOCOL & LAB PROCEDURE:", fill=theme["accent"], font=get_font("bold", 22))
    
    by = bullet_y + 70 if is_vertical else bullet_y + 55
    for idx, b in enumerate(bullets[:4]):
        # Bullet circle
        draw.ellipse([80, by + 4, 108, by + 32], fill=theme["accent_bg"], outline=theme["accent"], width=2)
        draw.text((88, by + 6), str(idx + 1), fill=(255, 255, 255), font=get_font("bold", 18))
        
        # Bullet text wrap
        font_b = get_font("regular", 26 if is_vertical else 20)
        draw.text((125, by + 4), b, fill=(226, 232, 240), font=font_b)
        by += 105 if is_vertical else 70

    # 8. GPS & Location Footer Bar (Strict GMB rule respected)
    foot_y = height - (200 if is_vertical else 140)
    draw_rounded_rect(draw, [50, foot_y, width - 50, height - (40 if is_vertical else 30)], 16, fill=(16, 24, 40), outline=(30, 41, 59), width=2)

    font_foot_bold = get_font("bold", 22 if is_vertical else 18)
    font_foot_reg = get_font("regular", 20 if is_vertical else 16)

    draw.text((80, foot_y + 20), "📍 Shop No 1, Khewra Cir Marg, Manpada, Thane West 400607", fill=(255, 255, 255), font=font_foot_bold)
    draw.text((80, foot_y + 55), "🧭 GPS: 19.2372° N, 72.9781° E • Opposite D-Mart Manpada", fill=(148, 163, 184), font=font_foot_reg)

    if platform == 'gmb':
        # GMB Rule 2: Strictly ZERO phone numbers or URLs in visual text!
        draw.text((80, foot_y + 90), "👉 Tap the 'Call now' button on this post for immediate technician dispatch.", fill=theme["accent"], font=font_foot_bold)
    else:
        draw.text((80, foot_y + 90), "📞 Hotline: 090547 90592  •  💬 WhatsApp: bigbytesystems.co.in/chat", fill=theme["accent"], font=font_foot_bold)

    # Save to disk
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "JPEG", quality=95)
    print(f"Generated: {output_path} ({width}x{height})")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Read from json config passed as argument
        cfg_file = sys.argv[1]
        with open(cfg_file, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        platform = cfg.get("platform", "generic")
        generate_graphic(
            cfg["output_path"],
            cfg["title"],
            cfg["bullets"],
            cfg.get("theme", "thermal"),
            cfg.get("is_vertical", True),
            platform=platform
        )
    else:
        # Test run
        out_test = r"social_studio_app\public\assets\generated\test_plate_vertical.jpg"
        generate_graphic(
            out_test,
            "Thermal Mud & Dust Heatsink Overhaul",
            [
                "Ultrasonic heatsink fin declogging under 40kHz solvent bath",
                "Complete removal of baked factory silicone thermal paste",
                "Application of authentic Arctic MX-4 high-conductivity compound",
                "Full thermal stress test drop: 94°C down to 58°C"
            ],
            theme_key="thermal",
            is_vertical=True,
            is_gmb=False
        )
