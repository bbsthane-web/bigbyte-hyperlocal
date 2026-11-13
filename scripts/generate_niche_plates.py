"""
High-Craft Multi-Niche Visual Plate Generator — Big Byte Social Studio
Zero AI Slop: Deterministic, high-contrast visual plates for non-repair niches:
1. Dental / Healthcare (Dr. Sharma Advanced Dental Care)
2. Specialty Coffee / Roastery (Urban Roast Artisan Cafe)
3. Luxury Aesthetics / Salon (Aura Luxe Hair & Skin Atelier)

Supports:
- 9:16 Vertical (1080x1920): YouTube Shorts, Instagram Reels
- 1:1 Square (1080x1080): Google Business Profile, Facebook
- 16:9 Landscape (1280x720): YouTube Custom Thumbnails
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

FONTS = {
    "ariblk": r"C:\Windows\Fonts\ariblk.ttf",
    "impact": r"C:\Windows\Fonts\impact.ttf",
    "bold": r"C:\Windows\Fonts\segoeuib.ttf",
    "regular": r"C:\Windows\Fonts\segoeui.ttf",
    "georgia_bold": r"C:\Windows\Fonts\georgiab.ttf",
}

def get_font(font_key, size):
    font_path = FONTS.get(font_key, FONTS.get("bold", ""))
    if not os.path.exists(font_path):
        font_path = FONTS.get("bold", r"C:\Windows\Fonts\segoeuib.ttf")
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

# Configuration dictionary for each plate
PLATES_CONFIG = {
    # 1. DENTAL CLINIC
    "drsharma_01": {
        "client_name": "DR. SHARMA ADVANCED DENTAL CARE",
        "tagline": "Painless Laser & Implantology Center • Panch Pakhadi, Thane West",
        "verified_badge": "⭐ 4.9★ GOOGLE VERIFIED (420+ REVIEWS)",
        "pill_tag": "🦷 CLINICAL PERIODONTOLOGY & SCALING",
        "title": "TEETH BLEEDING WHILE BRUSHING? WHY IT'S NOT NORMAL",
        "aspect_ratio": "9:16",
        "output_filename": "plate_drsharma_01_scaling.jpg",
        "theme": {
            "bg": (8, 20, 32),
            "grid": (15, 34, 54),
            "accent": (16, 185, 129),         # Emerald / Mint
            "accent_bg": (10, 48, 36),
            "badge_color": (56, 189, 248),    # Cyan
            "compare_bad_title": "❌  STAGE 1 PERIODONTITIS RISK:",
            "compare_bad": "Subgingival Calculus Eats Bone (Loose Teeth Risk)",
            "compare_good_title": "✅  32kHz ULTRASONIC DECONTAMINATION:",
            "compare_good": "Painless Tartar Removal + Laser Gum Sterilization",
            "section_title": "CLINICAL TRIAGE & HYGIENE PROTOCOL:",
            "bullets": [
                "48-Hour Plaque Mineralization into Subgingival Calculus",
                "32kHz Piezo Cavitron effortlessly shatters calcified tartar",
                "980nm Diode Laser eliminates 99.8% anaerobic gum bacteria",
                "Re-attaches healthy pink tissue with zero bleeding on probe"
            ],
            "footer_address": "📍 Sunrise Arcade, Panch Pakhadi, Thane West 400602 • Opp Post Office",
            "footer_gps": "🧭 GPS: 19.1895° N, 72.9682° E • Serving Panch Pakhadi, Naupada, Talao Pali, Charai",
            "footer_cta": "📞 Appointments: 098200 12345 • 💬 WhatsApp: wa.me/919820012345"
        }
    },
    "drsharma_02": {
        "client_name": "DR. SHARMA ADVANCED DENTAL CARE",
        "tagline": "Digital Orthodontics & Aesthetic Smile Studio • Panch Pakhadi",
        "verified_badge": "⭐ 4.9★ GOOGLE VERIFIED (420+ REVIEWS)",
        "pill_tag": "✨ 3D DIGITAL INVISIBLE ALIGNERS",
        "title": "CLEAR ALIGNERS VS METAL BRACES: 6-MONTH SMILE REVEAL",
        "aspect_ratio": "9:16",
        "output_filename": "plate_drsharma_02_aligners.jpg",
        "theme": {
            "bg": (8, 22, 35),
            "grid": (14, 38, 60),
            "accent": (56, 189, 248),        # Sky Blue
            "accent_bg": (12, 45, 75),
            "badge_color": (16, 185, 129),   # Emerald
            "compare_bad_title": "❌  CONVENTIONAL METAL BRACES:",
            "compare_bad": "Painful Wire Pokes, Mouth Ulcers & Food Traps",
            "compare_good_title": "✅  DIGITAL CLEAR ALIGNERS:",
            "compare_good": "100% Invisible Trays, Zero Diet Limits & Painless",
            "section_title": "3D ORTHODONTIC SCANNING PROTOCOL:",
            "bullets": [
                "60-Second iTero Optical Intraoral 3D Digital Scan (No goop)",
                "ClinCheck AI Simulation displays final smile before starting",
                "Custom SmartTrack medical polymer trays shift teeth gently",
                "Remove anytime for dinners, meetings & effortless flossing"
            ],
            "footer_address": "📍 Sunrise Arcade, Panch Pakhadi, Thane West 400602 • Opp Post Office",
            "footer_gps": "🧭 GPS: 19.1895° N, 72.9682° E • Serving Panch Pakhadi, Naupada, Talao Pali, Charai",
            "footer_cta": "📸 Instagram: @drsharmadental • 💬 WhatsApp: wa.me/919820012345"
        }
    },
    "drsharma_03": {
        "client_name": "DR. SHARMA ADVANCED DENTAL CARE",
        "tagline": "Painless Single-Sitting Laser Endodontics • Panch Pakhadi, Thane",
        "verified_badge": "⭐ 4.9★ GOOGLE VERIFIED (420+ REVIEWS)",
        "pill_tag": "⚡ SINGLE-SITTING LASER ROOT CANAL",
        "title": "TOOTHACHE RELIEF: SINGLE-VISIT LASER ROOT CANAL",
        "aspect_ratio": "1:1",
        "output_filename": "plate_drsharma_03_rct.jpg",
        "platform": "gmb",
        "theme": {
            "bg": (8, 20, 32),
            "grid": (15, 34, 54),
            "accent": (16, 185, 129),
            "accent_bg": (10, 48, 36),
            "badge_color": (245, 158, 11),
            "compare_bad_title": "❌  UNRESOLVED PULPITIS INFECTION:",
            "compare_bad": "Severe Throbbing Nerve Pain & Root Abscess",
            "compare_good_title": "✅  LASER ROTARY ROOT CANAL:",
            "compare_good": "Computerized Anesthesia + Same-Day Zirconia Crown",
            "section_title": "CLINICAL ENDODONTIC PROTOCOL:",
            "bullets": [
                "Computerized micro-dose painless anesthesia",
                "Flexible rotary NiTi files clean curved root canals",
                "Laser sterilization & biocompatible hermetic seal"
            ],
            "footer_address": "📍 Sunrise Arcade, Panch Pakhadi, Thane West 400602 • Opp Post Office",
            "footer_gps": "🧭 GPS: 19.1895° N, 72.9682° E • Serving Panch Pakhadi, Naupada, Talao Pali",
            "footer_cta": "👉 Tap 'Call now' button on this post for immediate emergency appointment."
        }
    },

    # 2. URBAN ROAST ARTISAN CAFE
    "urbanroast_01": {
        "client_name": "URBAN ROAST ARTISAN CAFE",
        "tagline": "Specialty Coffee Roastery & Micro-Bakery • The Walk, Hiranandani",
        "verified_badge": "⭐ 4.8★ GOOGLE VERIFIED (680+ REVIEWS)",
        "pill_tag": "☕ SPECIALTY ESPRESSO EXTRACTION LAB",
        "title": "WHY YOUR ESPRESSO TASTES BITTER: THE 9-BAR EXTRACTION RULE",
        "aspect_ratio": "9:16",
        "output_filename": "plate_urbanroast_01_espresso.jpg",
        "theme": {
            "bg": (20, 16, 12),
            "grid": (36, 28, 20),
            "accent": (245, 158, 11),        # Warm Amber / Espresso Gold
            "accent_bg": (55, 35, 12),
            "badge_color": (217, 119, 6),
            "compare_bad_title": "❌  COMMERCIAL CANALIZED ESPRESSO:",
            "compare_bad": "Uneven Water Channeling = Harsh Burnt Bitter Crema",
            "compare_good_title": "✅  URBAN ROAST 9-BAR BALANCED EXTRACTION:",
            "compare_good": "18.2g In / 36g Out in 28s = Rich Hazelnut Silk Crema",
            "section_title": "THIRD-WAVE BREWING PROTOCOL & PARAMETERS:",
            "bullets": [
                "100% Single-Origin Arabica micro-lot from Chikmagalur estates",
                "Acupuncture WDT needle declumping for perfectly uniform puck",
                "Calibrated 30-lb precision tamp & soft 3-second pre-infusion",
                "Dual-boiler saturated grouphead locked at exact 93.5°C"
            ],
            "footer_address": "📍 Unit 12, The Walk High Street, Hiranandani Estate, Thane West 400607",
            "footer_gps": "🧭 GPS: 19.2558° N, 72.9772° E • Serving The Walk, Arcadia, Rodas, Patlipada",
            "footer_cta": "☕ Hotline: 098190 54321 • 💬 WhatsApp: wa.me/919819054321"
        }
    },
    "urbanroast_02": {
        "client_name": "URBAN ROAST ARTISAN CAFE",
        "tagline": "Wild Sourdough Viennoiserie & Coffee Atelier • Hiranandani Estate",
        "verified_badge": "⭐ 4.8★ GOOGLE VERIFIED (680+ REVIEWS)",
        "pill_tag": "🥐 72-HOUR SOURDOUGH CROISSANTERIE",
        "title": "FRENCH BUTTER CROISSANT: 27 CARAMELIZED HONEYCOMB LAYERS",
        "aspect_ratio": "9:16",
        "output_filename": "plate_urbanroast_02_croissant.jpg",
        "theme": {
            "bg": (22, 17, 13),
            "grid": (40, 30, 22),
            "accent": (251, 191, 36),        # Warm Honey
            "accent_bg": (60, 42, 15),
            "badge_color": (245, 158, 11),
            "compare_bad_title": "❌  COMMERCIAL MARGARINE PASTRY:",
            "compare_bad": "Heavy Hydrogenated Fat, Dense Dough & Zero Flake",
            "compare_good_title": "✅  FRENCH 84% BUTTER LAMINATION:",
            "compare_good": "72-Hr Slow Cold Ferment = Shattering Crisp Honeycomb",
            "section_title": "ARTISAN BAKERY CRAFT & TIMELINE:",
            "bullets": [
                "Cultured organic wild sourdough mother starter fed daily",
                "Imported French Elle & Vire 84% churned unsalted butter sheets",
                "72-hour controlled cold retarding for deep aromatic crumb",
                "Baked fresh at 8:00 AM daily in high-moisture stone deck ovens"
            ],
            "footer_address": "📍 Unit 12, The Walk High Street, Hiranandani Estate, Thane West 400607",
            "footer_gps": "🧭 GPS: 19.2558° N, 72.9772° E • Serving The Walk, Arcadia, Rodas Enclave",
            "footer_cta": "📸 Instagram: @urbanroastthane • 💬 WhatsApp: wa.me/919819054321"
        }
    },
    "urbanroast_03": {
        "client_name": "URBAN ROAST ARTISAN CAFE",
        "tagline": "Slow-Drip Kyoto Cold Brew & Artisan Micro-Roastery • Thane West",
        "verified_badge": "⭐ 4.8★ GOOGLE VERIFIED (680+ REVIEWS)",
        "pill_tag": "🌿 18-HOUR KYOTO SLOW-DRIP COLD BREW",
        "title": "KYOTO COLD BREW: ZERO ACIDITY & DARK CHOCOLATE SILK",
        "aspect_ratio": "1:1",
        "output_filename": "plate_urbanroast_03_coldbrew.jpg",
        "platform": "facebook",
        "theme": {
            "bg": (20, 16, 12),
            "grid": (36, 28, 20),
            "accent": (245, 158, 11),
            "accent_bg": (55, 35, 12),
            "badge_color": (34, 197, 94),
            "compare_bad_title": "❌  HOT COFFEE DUMPED OVER ICE:",
            "compare_bad": "Diluted Watery Body, Bitter Tannins & High Acid",
            "compare_good_title": "✅  18-HR GRAVITATIONAL ICE DRIP:",
            "compare_good": "Ultra-Smooth Body, 60% Less Acid & Floral Esters",
            "section_title": "KYOTO EXTRACTION PROTOCOL & NOTES:",
            "bullets": [
                "1 crystal cold water drop every 3 seconds via glass tower",
                "Anaerobic Coorg micro-lot beans roasted specifically for cold brew",
                "Served over clear rock ice with candied blood orange wheel"
            ],
            "footer_address": "📍 Unit 12, The Walk High Street, Hiranandani Estate, Thane West 400607",
            "footer_gps": "🧭 GPS: 19.2558° N, 72.9772° E • Opposite The Walk High Street",
            "footer_cta": "📞 Cafe Orders: 098190 54321 • 💬 WhatsApp: wa.me/919819054321"
        }
    },

    # 3. AURA LUXE HAIR & SKIN ATELIER
    "auraluxe_01": {
        "client_name": "AURA LUXE HAIR & SKIN ATELIER",
        "tagline": "Haute Coiffure & Medical Aesthetics • Hiranandani Meadows, Thane",
        "verified_badge": "⭐ 4.9★ GOOGLE VERIFIED (510+ REVIEWS)",
        "pill_tag": "✨ ORGANIC JAPANESE NANOPLASTY",
        "title": "FRIZZY DAMAGED HAIR? NANOPLASTY VS KERATIN SCIENCE",
        "aspect_ratio": "9:16",
        "output_filename": "plate_auraluxe_01_nanoplasty.jpg",
        "theme": {
            "bg": (22, 12, 24),
            "grid": (40, 20, 44),
            "accent": (244, 63, 94),        # Rose Quartz / Magenta
            "accent_bg": (65, 20, 45),
            "badge_color": (251, 191, 36),   # Champagne Gold
            "compare_bad_title": "❌  HARSH FORMALDEHYDE KERATIN:",
            "compare_bad": "Toxic Fumes, Outer Chemical Seal & Brittle Hair Breakage",
            "compare_good_title": "✅  ORGANIC AMINO ACID NANOPLASTY:",
            "compare_good": "Deep Cortex Bond Repair = Liquid Mirror Glass Hair for 6 Mos",
            "section_title": "ATELIER TRICHOLOGY PROTOCOL & PROCEDURE:",
            "bullets": [
                "100% Formaldehyde-Free plant keratin and bio-compatible peptides",
                "Nano-particles penetrate cuticle directly into core cortex bonds",
                "Titanium thermo-infusion at 190°C locks moisture permanently",
                "Weightless liquid silk movement with zero greasy residue"
            ],
            "footer_address": "📍 Suite 102, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West 400610",
            "footer_gps": "🧭 GPS: 19.2241° N, 72.9698° E • Serving Meadows, Vasant Vihar, Pokhran Rd 1 & 2",
            "footer_cta": "📞 Atelier Concierge: 098210 99888 • 💬 WhatsApp: wa.me/919821099888"
        }
    },
    "auraluxe_02": {
        "client_name": "AURA LUXE HAIR & SKIN ATELIER",
        "tagline": "Clinical Medical Aesthetics & Dermatology • Hiranandani Meadows",
        "verified_badge": "⭐ 4.9★ GOOGLE VERIFIED (510+ REVIEWS)",
        "pill_tag": "💎 CLINICAL HYDRAFACIAL MD VORTEX",
        "title": "CLINICAL HYDRAFACIAL MD: 4-STEP PORE DETOX & GLASS GLOW",
        "aspect_ratio": "9:16",
        "output_filename": "plate_auraluxe_02_hydrafacial.jpg",
        "theme": {
            "bg": (20, 10, 26),
            "grid": (42, 18, 50),
            "accent": (236, 72, 153),       # Pink
            "accent_bg": (60, 20, 50),
            "badge_color": (56, 189, 248),   # Cyan
            "compare_bad_title": "❌  MANUAL EXTRACTION BLACKHEAD SQUEEZE:",
            "compare_bad": "Capillary Bruising, Tissue Scarring & Enlarged Pores",
            "compare_good_title": "✅  4-IN-1 VORTEX VACUUM TECHNOLOGY:",
            "compare_good": "Painless Impurity Extraction + Peptide & Hyaluronic Drench",
            "section_title": "DERMAL HYDRATION & REJUVENATION STEPS:",
            "bullets": [
                "Vortex Hydropeel tip gently sloughs dull stratum corneum dead cells",
                "Salicylic & glycolic acid blend dissolves deep sebum plugs",
                "Painless negative pressure vacuum removes stubborn blackheads",
                "Antioxidant serum bath delivers instant Korean glass-skin radiance"
            ],
            "footer_address": "📍 Suite 102, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West 400610",
            "footer_gps": "🧭 GPS: 19.2241° N, 72.9698° E • Serving Meadows, Vasant Vihar, Pokhran Rd 1 & 2",
            "footer_cta": "📸 Instagram: @auraluxethane • 💬 WhatsApp: wa.me/919821099888"
        }
    },
    "auraluxe_03": {
        "client_name": "AURA LUXE HAIR & SKIN ATELIER",
        "tagline": "Bespoke French Color Artistry & Gloss Studio • Thane West",
        "verified_badge": "⭐ 4.9★ GOOGLE VERIFIED (510+ REVIEWS)",
        "pill_tag": "🎨 ARTISANAL BESPOKE FRENCH BALAYAGE",
        "title": "FRENCH BALAYAGE & SILK GLOSS: NATURAL SUN-KISSED GRADUATION",
        "aspect_ratio": "1:1",
        "output_filename": "plate_auraluxe_03_balayage.jpg",
        "platform": "facebook",
        "theme": {
            "bg": (22, 12, 24),
            "grid": (40, 20, 44),
            "accent": (244, 63, 94),
            "accent_bg": (65, 20, 45),
            "badge_color": (251, 191, 36),
            "compare_bad_title": "❌  HARSH FOIL HIGHLIGHT LINES:",
            "compare_bad": "Unnatural Zebra Stripes & Obvious Demarcation Roots",
            "compare_good_title": "✅  FREEHAND FRENCH BALAYAGE:",
            "compare_good": "Seamless Dimension, Face-Contour Light & Acid Gloss Seal",
            "section_title": "HAUTE COLORATION PROTOCOL:",
            "bullets": [
                "L'Oréal Metal DX pre-treatment neutralizes hair copper particles",
                "Custom freehand clay painting contouring cheekbones and jawline",
                "Acidic demi-permanent gloss toning bath closes cuticle permanently"
            ],
            "footer_address": "📍 Suite 102, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West 400610",
            "footer_gps": "🧭 GPS: 19.2241° N, 72.9698° E • Gladys Alwares Road",
            "footer_cta": "📞 Appointments: 098210 99888 • 💬 WhatsApp: wa.me/919821099888"
        }
    }
}

def render_plate_9x16(cfg, out_path):
    width, height = 1080, 1920
    t = cfg["theme"]
    img = Image.new("RGB", (width, height), color=t["bg"])
    draw = ImageDraw.Draw(img)

    # 1. Background Grid Lines
    for x in range(0, width, 60):
        draw.line([(x, 0), (x, height)], fill=t["grid"], width=1)
    for y in range(0, height, 60):
        draw.line([(0, y), (width, y)], fill=t["grid"], width=1)

    # 2. Glowing Accent Border Top
    draw.rectangle([(0, 0), (width, 12)], fill=t["accent"])

    # 3. Top Header Bar
    top_y = 60
    draw_rounded_rect(draw, [50, top_y, width - 50, top_y + 120], 18, fill=(16, 24, 38), outline=(35, 48, 68), width=2)
    font_brand = get_font("ariblk", 30)
    font_sub = get_font("regular", 20)

    draw.text((75, top_y + 22), cfg["client_name"], fill=(255, 255, 255), font=font_brand)
    draw.text((75, top_y + 70), cfg["tagline"], fill=(156, 163, 175), font=font_sub)

    # Verified Badge top right
    badge_w = 340
    draw_rounded_rect(draw, [width - 50 - badge_w, top_y + 28, width - 65, top_y + 92], 12, fill=(24, 32, 48), outline=t["badge_color"], width=1)
    draw.text((width - 40 - badge_w, top_y + 46), cfg["verified_badge"], fill=t["badge_color"], font=get_font("bold", 15))

    # 4. Service Category Pill Badge
    pill_y = top_y + 145
    draw_rounded_rect(draw, [50, pill_y, 620, pill_y + 60], 30, fill=t["accent_bg"], outline=t["accent"], width=2)
    draw.text((75, pill_y + 16), cfg["pill_tag"], fill=t["accent"], font=get_font("bold", 22))

    # 5. Headline (Arial Black)
    title_y = pill_y + 85
    font_title = get_font("ariblk", 54)
    title_lines = wrap_text(draw, cfg["title"].upper(), font_title, width - 110)
    for line in title_lines[:3]:
        draw.text((54, title_y + 3), line, fill=(0, 0, 0), font=font_title)
        draw.text((50, title_y), line, fill=(255, 255, 255), font=font_title)
        title_y += 68

    # 6. Comparison Card (Defect vs Protocol Fix)
    tele_y = title_y + 25
    card_h = 240
    draw_rounded_rect(draw, [50, tele_y, width - 50, tele_y + card_h], 20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

    # Bad
    draw_rounded_rect(draw, [70, tele_y + 18, width - 70, tele_y + (card_h // 2) - 10], 14, fill=(48, 16, 20), outline=(239, 68, 68), width=2)
    draw.text((90, tele_y + 32), t["compare_bad_title"], fill=(248, 113, 113), font=get_font("bold", 18))
    draw.text((90, tele_y + 62), t["compare_bad"], fill=(254, 202, 202), font=get_font("ariblk", 22))

    # Good
    draw_rounded_rect(draw, [70, tele_y + (card_h // 2) + 10, width - 70, tele_y + card_h - 18], 14, fill=(14, 45, 30), outline=(34, 197, 94), width=2)
    draw.text((90, tele_y + (card_h // 2) + 24), t["compare_good_title"], fill=(74, 222, 128), font=get_font("bold", 18))
    draw.text((90, tele_y + (card_h // 2) + 54), t["compare_good"], fill=(187, 247, 208), font=get_font("ariblk", 22))

    # 7. Protocol Bullets Card
    bullet_y = tele_y + card_h + 35
    bullets = t["bullets"]
    b_card_h = len(bullets[:4]) * 125 + 75
    draw_rounded_rect(draw, [50, bullet_y, width - 50, bullet_y + b_card_h], 20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)

    draw.text((80, bullet_y + 25), t["section_title"], fill=t["accent"], font=get_font("bold", 24))

    by = bullet_y + 80
    for idx, b in enumerate(bullets[:4]):
        # Number badge
        draw.ellipse([80, by + 4, 116, by + 40], fill=t["accent_bg"], outline=t["accent"], width=2)
        draw.text((92, by + 7), str(idx + 1), fill=(255, 255, 255), font=get_font("ariblk", 20))

        # Bullet text
        b_lines = wrap_text(draw, b, get_font("bold", 25), width - 210)
        line_y = by + 4
        for bl in b_lines[:2]:
            draw.text((135, line_y), bl, fill=(241, 245, 249), font=get_font("bold", 25))
            line_y += 34
        by += 125

    # 8. GPS & Location Footer Bar
    foot_y = height - 210
    draw_rounded_rect(draw, [50, foot_y, width - 50, height - 40], 18, fill=(16, 24, 40), outline=(51, 65, 85), width=2)
    draw.text((80, foot_y + 22), t["footer_address"], fill=(255, 255, 255), font=get_font("bold", 23))
    draw.text((80, foot_y + 62), t["footer_gps"], fill=(148, 163, 184), font=get_font("regular", 20))
    draw.text((80, foot_y + 104), t["footer_cta"], fill=t["accent"], font=get_font("bold", 22))

    img.save(out_path, "JPEG", quality=95)
    print(f"Generated 9:16 Plate: {out_path} (1080x1920)")

def render_plate_1x1(cfg, out_path):
    width, height = 1080, 1080
    t = cfg["theme"]
    img = Image.new("RGB", (width, height), color=t["bg"])
    draw = ImageDraw.Draw(img)

    # 1. Grid
    for x in range(0, width, 55):
        draw.line([(x, 0), (x, height)], fill=t["grid"], width=1)
    for y in range(0, height, 55):
        draw.line([(0, y), (width, y)], fill=t["grid"], width=1)

    draw.rectangle([(0, 0), (width, 10)], fill=t["accent"])

    # 2. Header Bar
    draw_rounded_rect(draw, [40, 30, width - 40, 110], 14, fill=(16, 24, 38), outline=(35, 48, 68), width=2)
    font_brand = get_font("ariblk", 25)
    font_sub = get_font("regular", 17)

    draw.text((65, 44), cfg["client_name"], fill=(255, 255, 255), font=font_brand)
    draw.text((65, 78), cfg["tagline"][:65] + ("..." if len(cfg["tagline"]) > 65 else ""), fill=(156, 163, 175), font=font_sub)

    badge_w = 310
    draw_rounded_rect(draw, [width - 45 - badge_w, 42, width - 55, 96], 10, fill=(24, 32, 48), outline=t["badge_color"], width=1)
    draw.text((width - 38 - badge_w, 56), cfg["verified_badge"], fill=t["badge_color"], font=get_font("bold", 14))

    # 3. Category Pill
    draw_rounded_rect(draw, [40, 125, 580, 175], 24, fill=t["accent_bg"], outline=t["accent"], width=2)
    draw.text((65, 137), cfg["pill_tag"], fill=t["accent"], font=get_font("bold", 20))

    # 4. Headline
    font_title = get_font("ariblk", 42)
    title_lines = wrap_text(draw, cfg["title"].upper(), font_title, width - 90)
    ty = 195
    for line in title_lines[:2]:
        draw.text((43, ty + 2), line, fill=(0, 0, 0), font=font_title)
        draw.text((40, ty), line, fill=(255, 255, 255), font=font_title)
        ty += 50

    # 5. Comparison Box
    tele_y = ty + 12
    draw_rounded_rect(draw, [40, tele_y, width - 40, tele_y + 175], 16, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    draw_rounded_rect(draw, [60, tele_y + 15, width - 60, tele_y + 80], 10, fill=(48, 16, 20), outline=(239, 68, 68), width=1)
    draw.text((80, tele_y + 32), f"❌  {t['compare_bad']}", fill=(254, 202, 202), font=get_font("ariblk", 20))

    draw_rounded_rect(draw, [60, tele_y + 95, width - 60, tele_y + 160], 10, fill=(14, 45, 30), outline=(34, 197, 94), width=1)
    draw.text((80, tele_y + 112), f"✅  {t['compare_good']}", fill=(187, 247, 208), font=get_font("ariblk", 20))

    # 6. Protocol Bullets
    b_y = tele_y + 195
    draw_rounded_rect(draw, [40, b_y, width - 40, b_y + 240], 16, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    draw.text((65, b_y + 16), t["section_title"], fill=t["accent"], font=get_font("bold", 19))

    cur_by = b_y + 55
    for idx, b in enumerate(t["bullets"][:3]):
        draw.ellipse([65, cur_by + 2, 95, cur_by + 32], fill=t["accent_bg"], outline=t["accent"], width=2)
        draw.text((75, cur_by + 4), str(idx + 1), fill=(255, 255, 255), font=get_font("ariblk", 18))
        draw.text((110, cur_by + 3), b[:75] + ("..." if len(b) > 75 else ""), fill=(226, 232, 240), font=get_font("bold", 20))
        cur_by += 58

    # 7. Footer
    foot_y = height - 150
    draw_rounded_rect(draw, [40, foot_y, width - 40, height - 25], 14, fill=(16, 24, 40), outline=(51, 65, 85), width=2)
    draw.text((65, foot_y + 14), t["footer_address"], fill=(255, 255, 255), font=get_font("bold", 19))
    draw.text((65, foot_y + 45), t["footer_gps"], fill=(148, 163, 184), font=get_font("regular", 16))
    draw.text((65, foot_y + 78), t["footer_cta"], fill=t["accent"], font=get_font("bold", 18))

    img.save(out_path, "JPEG", quality=95)
    print(f"Generated 1:1 Plate: {out_path} (1080x1080)")

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    generated_dir = os.path.join(root_dir, "public", "assets", "generated")
    os.makedirs(generated_dir, exist_ok=True)

    print(f"Generating 9 High-Craft Visual Plates into: {generated_dir}")
    for key, cfg in PLATES_CONFIG.items():
        out_file = os.path.join(generated_dir, cfg["output_filename"])
        if cfg["aspect_ratio"] == "1:1":
            render_plate_1x1(cfg, out_file)
        else:
            render_plate_9x16(cfg, out_file)
    print("All 9 Niche Plates generated successfully!")

if __name__ == "__main__":
    main()
