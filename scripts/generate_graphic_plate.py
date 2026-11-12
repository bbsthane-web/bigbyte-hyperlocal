"""
High-Craft Technical Diagnostic Graphic & High-CTR Thumbnail Generator — Big Byte Systems
Generates 100% deterministic, high-contrast, high-CTR visual assets:
- 16:9 Landscape (1280x720): Dedicated High-CTR YouTube Custom Thumbnails
- 9:16 Vertical (1080x1920): YouTube Shorts, Instagram Reels & Stories Video Plates
- 1:1 Square (1080x1080): Facebook & Instagram Feed, Google Business Profile Plates

Zero AI Slop: Authentic dark lab theme, crisp typography (Segoe UI Bold & Arial Black),
scientific telemetry boxes, problem vs. solution badges, and strict GPS hyperlocal anchors.
"""

import sys
import os
import json
from PIL import Image, ImageDraw, ImageFont

FONTS = {
    "ariblk": r"C:\Windows\Fonts\ariblk.ttf",
    "impact": r"C:\Windows\Fonts\impact.ttf",
    "bold": r"C:\Windows\Fonts\segoeuib.ttf",
    "regular": r"C:\Windows\Fonts\segoeui.ttf",
    "mono": r"C:\Windows\Fonts\consola.ttf",
}

THEMES = {
    "thermal": {
        "accent": (56, 189, 248),        # Cyan #38BDF8
        "accent_bg": (14, 50, 75),
        "tag": "❄️ THERMAL LAB TRIAGE",
        "badge_color": (34, 197, 94),     # Emerald
        "compare_bad": "Factory Paste: 94°C (Severe Throttling)",
        "compare_good": "Arctic MX-4 Lab: 58°C (Whisper-Quiet)"
    },
    "macbook": {
        "accent": (245, 158, 11),       # Amber #F59E0B
        "accent_bg": (65, 42, 10),
        "tag": "🔬 CHIP-LEVEL MICRO-SOLDERING",
        "badge_color": (56, 189, 248),
        "compare_bad": "Authorized Swap: ₹45,000+ (14-Day Wait)",
        "compare_good": "Board Micro-Soldering: Save ₹35K+ (90-Day Warranty)"
    },
    "data_recovery": {
        "accent": (239, 68, 68),        # Red #EF4444
        "accent_bg": (60, 20, 20),
        "tag": "💾 CLEANROOM DATA EXTRACTION",
        "badge_color": (34, 197, 94),
        "compare_bad": "Repeated Power-On: Heads Scrape Platters",
        "compare_good": "Clean-Bench Triage: Bit-Level Cloning"
    },
    "hinge": {
        "accent": (168, 85, 247),       # Purple #A855F7
        "accent_bg": (45, 20, 65),
        "tag": "🔧 CHASSIS STRUCTURAL RECONSTRUCTION",
        "badge_color": (56, 189, 248),
        "compare_bad": "Broken Brass Inserts: Cracked Display Glass",
        "compare_good": "Metal Pin + Dual-Epoxy: Factory Strength"
    },
    "printer": {
        "accent": (16, 185, 129),       # Emerald #10B981
        "accent_bg": (10, 50, 35),
        "tag": "🖨️ ECOTANK & LASER MAINTENANCE",
        "badge_color": (245, 158, 11),
        "compare_bad": "Waste Pad Saturated: Motherboard Short Risk",
        "compare_good": "Fresh Absorbers + EEPROM Reset: Same-Day"
    },
    "vhs": {
        "accent": (236, 72, 153),       # Pink #EC4899
        "accent_bg": (60, 15, 40),
        "tag": "📼 VINTAGE TAPE 4K AI DIGITIZATION",
        "badge_color": (56, 189, 248),
        "compare_bad": "Tape Fungus & Demagnetizing: Permanent Loss",
        "compare_good": "Chemical De-mold + 4K AI: Preserved Forever"
    },
    "custom_pc": {
        "accent": (59, 130, 246),       # Blue #3B82F6
        "accent_bg": (15, 35, 70),
        "tag": "🎮 CUSTOM WORKSTATION & RIG TUNING",
        "badge_color": (168, 85, 247),
        "compare_bad": "Restricted Airflow & Tangled Cables",
        "compare_good": "Positive Pressure + Custom Fan Curves"
    },
    "ssd": {
        "accent": (20, 184, 166),       # Teal #14B8A6
        "accent_bg": (10, 50, 45),
        "tag": "⚡ ZERO DATA-LOSS NVMe SSD CLONING",
        "badge_color": (34, 197, 94),
        "compare_bad": "Mechanical HDD: 100% Disk Usage Crawl",
        "compare_good": "Gen4 NVMe: 3500MB/s Instant 8s Boot"
    },
    "liquid_damage": {
        "accent": (56, 189, 248),
        "accent_bg": (14, 50, 75),
        "tag": "💧 LIQUID SPILL ULTRASONIC SALVAGE",
        "badge_color": (34, 197, 94),
        "compare_bad": "Rice Trick: Electrolytic Corrosion Kills Chips",
        "compare_good": "Ultrasonic Bath + Chemical Deox: Board Revived"
    }
}

def get_font(font_key, size):
    font_path = FONTS.get(font_key, FONTS.get("regular", ""))
    if not os.path.exists(font_path):
        font_path = FONTS.get("bold", font_path)
    if not os.path.exists(font_path):
        font_path = FONTS.get("regular", font_path)
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    cur = []
    for w in words:
        test = " ".join(cur + [w])
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width:
            if cur:
                lines.append(" ".join(cur))
                cur = [w]
            else:
                lines.append(w)
                cur = []
        else:
            cur.append(w)
    if cur:
        lines.append(" ".join(cur))
    return lines

def generate_graphic_16x9(output_path, title, bullets, theme, platform="generic"):
    """
    Dedicated 1280x720 High-CTR YouTube Custom Thumbnail
    Optimized for massive readability at small preview scales (mobile YouTube / feed previews)
    """
    width, height = 1280, 720
    img = Image.new("RGB", (width, height), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)

    # 1. Background Grid
    for x in range(0, width, 50):
        draw.line([(x, 0), (x, height)], fill=(18, 25, 42), width=1)
    for y in range(0, height, 50):
        draw.line([(0, y), (width, y)], fill=(18, 25, 42), width=1)

    # 2. Glowing Accent Border Top
    draw.rectangle([(0, 0), (width, 8)], fill=theme["accent"])

    # 3. Top Header Bar
    draw_rounded_rect(draw, [30, 20, width - 30, 80], 12, fill=(16, 23, 41), outline=(30, 41, 59), width=2)
    font_brand = get_font("ariblk", 26)
    font_sub = get_font("bold", 17)
    font_badge = get_font("bold", 17)

    draw.text((50, 32), "BIG BYTE SYSTEMS", fill=(255, 255, 255), font=font_brand)
    draw.text((345, 36), "•  Component-Level Diagnostic Lab  •  Thane West", fill=(148, 163, 184), font=font_sub)

    # Top Right Verified Badge
    draw_rounded_rect(draw, [width - 340, 28, width - 45, 72], 10, fill=(30, 41, 59), outline=(245, 158, 11), width=1)
    draw.text((width - 325, 38), "⭐ 4.9★ GOOGLE VERIFIED (1.2K+)", fill=(245, 158, 11), font=font_badge)

    # 4. Service Category Tag Pill
    draw_rounded_rect(draw, [30, 96, 480, 140], 20, fill=theme["accent_bg"], outline=theme["accent"], width=2)
    draw.text((50, 107), theme["tag"], fill=theme["accent"], font=get_font("bold", 19))

    # 5. Massive High-CTR Headline (Arial Black)
    font_title = get_font("ariblk", 48)
    title_lines = wrap_text(draw, title.upper(), font_title, width - 90)
    ty = 155
    for line in title_lines[:2]:
        # Drop shadow for punchiness
        draw.text((33, ty + 3), line, fill=(0, 0, 0), font=font_title)
        draw.text((30, ty), line, fill=(255, 255, 255), font=font_title)
        ty += 56

    # 6. Side-by-Side Telemetry Comparison Cards
    box_y = 275
    box_h = 220
    half_w = (width - 80) // 2

    # Left: Bad (Red)
    draw_rounded_rect(draw, [30, box_y, 30 + half_w, box_y + box_h], 16, fill=(45, 15, 20), outline=(239, 68, 68), width=2)
    draw.text((50, box_y + 18), "❌  THE UNRESOLVED RISK / DEFECT:", fill=(248, 113, 113), font=get_font("bold", 18))
    bad_lines = wrap_text(draw, theme["compare_bad"], get_font("ariblk", 24), half_w - 40)
    bty = box_y + 55
    for l in bad_lines[:3]:
        draw.text((50, bty), l, fill=(254, 202, 202), font=get_font("ariblk", 24))
        bty += 34

    # Right: Good (Green)
    rx = 30 + half_w + 20
    draw_rounded_rect(draw, [rx, box_y, rx + half_w, box_y + box_h], 16, fill=(12, 45, 28), outline=(34, 197, 94), width=2)
    draw.text((rx + 20, box_y + 18), "✅  VERIFIED LAB PROTOCOL FIX:", fill=(74, 222, 128), font=get_font("bold", 18))
    good_lines = wrap_text(draw, theme["compare_good"], get_font("ariblk", 24), half_w - 40)
    gty = box_y + 55
    for l in good_lines[:3]:
        draw.text((rx + 20, gty), l, fill=(187, 247, 208), font=get_font("ariblk", 24))
        gty += 34

    # 7. Hyperlocal Footer Bar
    foot_y = 515
    draw_rounded_rect(draw, [30, foot_y, width - 30, height - 25], 16, fill=(16, 24, 40), outline=(51, 65, 85), width=2)
    draw.text((50, foot_y + 16), "📍 Shop No 1, Khewra Cir Marg, Manpada, Thane West 400607 • Opposite D-Mart Manpada", fill=(255, 255, 255), font=get_font("bold", 21))
    draw.text((50, foot_y + 52), "🧭 GPS: 19.2372° N, 72.9781° E • Serving Hiranandani Estate, Meadows, Ghodbunder Rd, Majiwada, Vasant Vihar", fill=(148, 163, 184), font=get_font("regular", 17))
    
    if platform == "gmb":
        draw.text((50, foot_y + 92), "👉 Tap 'Call now' button on this post for immediate technician consultation.", fill=theme["accent"], font=get_font("bold", 20))
    else:
        draw.text((50, foot_y + 92), "📞 Direct Lab Hotline: 090547 90592  •  💬 WhatsApp Dispatch: bigbytesystems.co.in/chat", fill=theme["accent"], font=get_font("bold", 20))

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    img.save(output_path, "JPEG", quality=95)
    print(f"Generated 16:9 Thumbnail: {output_path} (1280x720)")
    return output_path

def generate_graphic_9x16(output_path, title, bullets, theme, platform="generic"):
    """
    Dedicated 1080x1920 Vertical Video Plate / Story / Reel Graphic
    High contrast, massive headers, clearly numbered diagnostic protocol
    """
    width, height = 1080, 1920
    img = Image.new("RGB", (width, height), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)

    # 1. Background Grid
    for x in range(0, width, 60):
        draw.line([(x, 0), (x, height)], fill=(18, 25, 42), width=1)
    for y in range(0, height, 60):
        draw.line([(0, y), (width, y)], fill=(18, 25, 42), width=1)

    # 2. Glowing Accent Border Top
    draw.rectangle([(0, 0), (width, 10)], fill=theme["accent"])

    # 3. Lab Header Card
    top_y = 60
    draw_rounded_rect(draw, [50, top_y, width - 50, top_y + 120], 18, fill=(16, 23, 41), outline=(30, 41, 59), width=2)
    font_brand = get_font("ariblk", 36)
    font_sub = get_font("regular", 22)

    draw.text((80, top_y + 22), "BIG BYTE SYSTEMS", fill=(255, 255, 255), font=font_brand)
    draw.text((80, top_y + 72), "Component-Level Diagnostic Lab • Thane West", fill=(148, 163, 184), font=font_sub)

    # Platform badge
    platform_labels = {
        "youtube": ("▶ YOUTUBE SHORTS", (239, 68, 68)),
        "instagram": ("📸 INSTAGRAM REEL", (236, 72, 153)),
        "facebook": ("👍 FACEBOOK LAB", (59, 130, 246)),
        "gmb": ("📍 GOOGLE VERIFIED", (34, 197, 94)),
        "linkedin": ("💼 ENTERPRISE B2B", (20, 184, 166))
    }
    p_text, p_color = platform_labels.get(platform, ("⭐ 4.9★ LAB RATED", (245, 158, 11)))
    draw_rounded_rect(draw, [width - 360, top_y + 28, width - 75, top_y + 92], 14, fill=(30, 41, 59), outline=p_color, width=2)
    draw.text((width - 340, top_y + 46), p_text, fill=p_color, font=get_font("bold", 22))

    # 4. Service Category Pill Badge
    badge_y = top_y + 145
    draw_rounded_rect(draw, [50, badge_y, 560, badge_y + 60], 30, fill=theme["accent_bg"], outline=theme["accent"], width=2)
    draw.text((75, badge_y + 16), theme["tag"], fill=theme["accent"], font=get_font("bold", 24))

    # 5. Massive High-CTR Title (Arial Black)
    title_y = badge_y + 85
    font_title = get_font("ariblk", 58)
    title_lines = wrap_text(draw, title.upper(), font_title, width - 110)
    for line in title_lines[:3]:
        draw.text((54, title_y + 3), line, fill=(0, 0, 0), font=font_title)
        draw.text((50, title_y), line, fill=(255, 255, 255), font=font_title)
        title_y += 72

    # 6. Telemetry Comparison Card (High Contrast)
    tele_y = title_y + 30
    card_h = 240
    draw_rounded_rect(draw, [50, tele_y, width - 50, tele_y + card_h], 20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

    # Bad
    draw_rounded_rect(draw, [75, tele_y + 20, width - 75, tele_y + (card_h // 2) - 10], 14, fill=(45, 18, 20), outline=(239, 68, 68), width=2)
    draw.text((95, tele_y + 35), f"❌  {theme['compare_bad']}", fill=(254, 202, 202), font=get_font("ariblk", 24))

    # Good
    draw_rounded_rect(draw, [75, tele_y + (card_h // 2) + 10, width - 75, tele_y + card_h - 20], 14, fill=(16, 42, 28), outline=(34, 197, 94), width=2)
    draw.text((95, tele_y + (card_h // 2) + 26), f"✅  {theme['compare_good']}", fill=(187, 247, 208), font=get_font("ariblk", 24))

    # 7. Actionable Diagnostic Bullet Points Card
    bullet_y = tele_y + card_h + 35
    b_card_h = len(bullets[:4]) * 125 + 70
    draw_rounded_rect(draw, [50, bullet_y, width - 50, bullet_y + b_card_h], 20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

    draw.text((80, bullet_y + 25), "DIAGNOSTIC PROTOCOL & LAB PROCEDURE:", fill=theme["accent"], font=get_font("bold", 24))

    by = bullet_y + 80
    for idx, b in enumerate(bullets[:4]):
        # Circle badge
        draw.ellipse([80, by + 4, 114, by + 38], fill=theme["accent_bg"], outline=theme["accent"], width=2)
        draw.text((91, by + 6), str(idx + 1), fill=(255, 255, 255), font=get_font("ariblk", 22))

        # Text with wrap
        b_lines = wrap_text(draw, b, get_font("bold", 26), width - 210)
        line_y = by + 4
        for bl in b_lines[:2]:
            draw.text((135, line_y), bl, fill=(241, 245, 249), font=get_font("bold", 26))
            line_y += 34
        by += 125

    # 8. GPS & Location Footer Bar
    foot_y = height - 210
    draw_rounded_rect(draw, [50, foot_y, width - 50, height - 40], 18, fill=(16, 24, 40), outline=(51, 65, 85), width=2)
    draw.text((80, foot_y + 22), "📍 Shop No 1, Khewra Cir Marg, Manpada, Thane West 400607", fill=(255, 255, 255), font=get_font("bold", 24))
    draw.text((80, foot_y + 62), "🧭 GPS: 19.2372° N, 72.9781° E • Opposite D-Mart Manpada", fill=(148, 163, 184), font=get_font("regular", 21))

    if platform == "gmb":
        draw.text((80, foot_y + 104), "👉 Tap the 'Call now' button on this post for immediate technician dispatch.", fill=theme["accent"], font=get_font("bold", 22))
    else:
        draw.text((80, foot_y + 104), "📞 Hotline: 090547 90592  •  💬 WhatsApp: bigbytesystems.co.in/chat", fill=theme["accent"], font=get_font("bold", 22))

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    img.save(output_path, "JPEG", quality=95)
    print(f"Generated 9:16 Plate: {output_path} (1080x1920)")
    return output_path

def generate_graphic_1x1(output_path, title, bullets, theme, platform="generic"):
    """
    Dedicated 1080x1080 Square Graphic Plate for Facebook, GMB & Instagram Feed
    """
    width, height = 1080, 1080
    img = Image.new("RGB", (width, height), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)

    # 1. Grid
    for x in range(0, width, 55):
        draw.line([(x, 0), (x, height)], fill=(18, 25, 42), width=1)
    for y in range(0, height, 55):
        draw.line([(0, y), (width, y)], fill=(18, 25, 42), width=1)

    draw.rectangle([(0, 0), (width, 8)], fill=theme["accent"])

    # Top Bar
    draw_rounded_rect(draw, [40, 30, width - 40, 110], 14, fill=(16, 23, 41), outline=(30, 41, 59), width=2)
    draw.text((65, 45), "BIG BYTE SYSTEMS", fill=(255, 255, 255), font=get_font("ariblk", 28))
    draw.text((380, 52), "•  Diagnostic Lab • Thane West", fill=(148, 163, 184), font=get_font("bold", 20))
    draw_rounded_rect(draw, [width - 320, 42, width - 55, 96], 10, fill=(30, 41, 59), outline=(245, 158, 11), width=1)
    draw.text((width - 305, 55), "⭐ 4.9★ VERIFIED", fill=(245, 158, 11), font=get_font("bold", 18))

    # Category Pill
    draw_rounded_rect(draw, [40, 125, 520, 175], 24, fill=theme["accent_bg"], outline=theme["accent"], width=2)
    draw.text((65, 137), theme["tag"], fill=theme["accent"], font=get_font("bold", 21))

    # Headline
    font_title = get_font("ariblk", 46)
    title_lines = wrap_text(draw, title.upper(), font_title, width - 90)
    ty = 195
    for line in title_lines[:2]:
        draw.text((43, ty + 2), line, fill=(0, 0, 0), font=font_title)
        draw.text((40, ty), line, fill=(255, 255, 255), font=font_title)
        ty += 54

    # Comparison Box
    tele_y = ty + 15
    draw_rounded_rect(draw, [40, tele_y, width - 40, tele_y + 175], 16, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    draw_rounded_rect(draw, [60, tele_y + 15, width - 60, tele_y + 80], 10, fill=(45, 18, 20), outline=(239, 68, 68), width=1)
    draw.text((80, tele_y + 32), f"❌  {theme['compare_bad']}", fill=(254, 202, 202), font=get_font("ariblk", 21))

    draw_rounded_rect(draw, [60, tele_y + 95, width - 60, tele_y + 160], 10, fill=(16, 42, 28), outline=(34, 197, 94), width=1)
    draw.text((80, tele_y + 112), f"✅  {theme['compare_good']}", fill=(187, 247, 208), font=get_font("ariblk", 21))

    # Protocol Bullets
    b_y = tele_y + 195
    draw_rounded_rect(draw, [40, b_y, width - 40, b_y + 240], 16, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    draw.text((65, b_y + 16), "DIAGNOSTIC PROTOCOL & LAB PROCEDURE:", fill=theme["accent"], font=get_font("bold", 19))
    
    cur_by = b_y + 55
    for idx, b in enumerate(bullets[:3]):
        draw.ellipse([65, cur_by + 2, 95, cur_by + 32], fill=theme["accent_bg"], outline=theme["accent"], width=2)
        draw.text((75, cur_by + 4), str(idx + 1), fill=(255, 255, 255), font=get_font("ariblk", 18))
        draw.text((110, cur_by + 3), b[:75] + ("..." if len(b) > 75 else ""), fill=(226, 232, 240), font=get_font("bold", 20))
        cur_by += 58

    # Footer
    foot_y = height - 145
    draw_rounded_rect(draw, [40, foot_y, width - 40, height - 25], 14, fill=(16, 24, 40), outline=(51, 65, 85), width=2)
    draw.text((65, foot_y + 15), "📍 Shop No 1, Khewra Cir Marg, Manpada, Thane West 400607 • Opp D-Mart", fill=(255, 255, 255), font=get_font("bold", 20))
    draw.text((65, foot_y + 46), "🧭 GPS: 19.2372° N, 72.9781° E • Serving Hiranandani Estate, Meadows, Ghodbunder Rd", fill=(148, 163, 184), font=get_font("regular", 16))

    if platform == "gmb":
        draw.text((65, foot_y + 78), "👉 Tap 'Call now' button on this post for immediate technician consultation.", fill=theme["accent"], font=get_font("bold", 18))
    else:
        draw.text((65, foot_y + 78), "📞 Hotline: 090547 90592  •  💬 WhatsApp: bigbytesystems.co.in/chat", fill=theme["accent"], font=get_font("bold", 18))

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    img.save(output_path, "JPEG", quality=95)
    print(f"Generated 1:1 Plate: {output_path} (1080x1080)")
    return output_path

def generate_graphic(output_path, title, bullets, theme_key="thermal", aspect_ratio="9:16", platform="generic"):
    theme = THEMES.get(theme_key, THEMES["thermal"])
    
    # Handle boolean is_vertical backward compatibility
    if aspect_ratio is True:
        aspect_ratio = "9:16"
    elif aspect_ratio is False:
        aspect_ratio = "1:1"

    if aspect_ratio == "16:9":
        return generate_graphic_16x9(output_path, title, bullets, theme, platform)
    elif aspect_ratio == "1:1":
        return generate_graphic_1x1(output_path, title, bullets, theme, platform)
    else:
        return generate_graphic_9x16(output_path, title, bullets, theme, platform)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cfg_file = sys.argv[1]
        with open(cfg_file, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        platform = cfg.get("platform", "generic")
        aspect = cfg.get("aspect_ratio", None)
        if aspect is None:
            aspect = "9:16" if cfg.get("is_vertical", True) else "1:1"
        generate_graphic(
            cfg["output_path"],
            cfg["title"],
            cfg["bullets"],
            cfg.get("theme", "thermal"),
            aspect_ratio=aspect,
            platform=platform
        )
    else:
        # Self-test all three formats
        generate_graphic("test_16x9.jpg", "Coastal Thane Humidity Thermal Mud", ["Ultrasonic fin cleaning", "Arctic MX-4 paste"], "thermal", "16:9")
        generate_graphic("test_9x16.jpg", "Coastal Thane Humidity Thermal Mud", ["Ultrasonic fin cleaning", "Arctic MX-4 paste"], "thermal", "9:16")
        generate_graphic("test_1x1.jpg", "Coastal Thane Humidity Thermal Mud", ["Ultrasonic fin cleaning", "Arctic MX-4 paste"], "thermal", "1:1")
        print("Self-test complete!")
