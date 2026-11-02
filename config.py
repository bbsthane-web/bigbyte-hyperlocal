"""
Configuration for Hyperlocal Lead Radar Multi-Agent Swarm
Frugal, Zero-SaaS, 100% Local Intelligence.
"""

from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent
BIN_DIR = BASE_DIR / "bin"
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
QUERIES_DIR = DATA_DIR / "queries"
REPORTS_DIR = BASE_DIR / "reports"

# Scraper Executable
SCRAPER_EXE = BIN_DIR / "gmaps_scraper.exe"

# Target User Contact
USER_PHONE = "919167463807"  # With India country code 91 (9167463807)
USER_NAME = "BBS Growth Partner"

# Hyperlocal Target Settings
DEFAULT_LOCALITIES = [
    "Thane West",
    "Naupada Thane",
    "Majiwada Thane",
    "Ghodbunder Road Thane",
    "Panch Pakhadi Thane",
    "Vasant Vihar Thane",
    "Mulund West"
]

DEFAULT_NICHES = [
    "Dentists",
    "Dermatologists",
    "Interior Designers",
    "Chartered Accountants",
    "Diagnostic Centres",
    "Luxury Hair Salons",
    "Physiotherapy Clinics",
    "Architects"
]

# Audit & Scoring Weights (0 - 100 scale)
AUDIT_RULES = {
    "missing_website_weight": 35,       # High gap: no website to capture traffic
    "low_reviews_weight": 30,          # Under 35 reviews = losing 3-pack ranking
    "missing_whatsapp_weight": 25,     # No direct WhatsApp consultation hook
    "has_phone_number_bonus": 10,      # Essential for instant outreach
    "low_reviews_threshold": 35,       # Reviews count threshold
    "subpar_rating_threshold": 4.2     # Rating threshold needing reputation rescue
}

# AI Settings (Powered by Antigravity CLI - Gemini 3.8 Flash)
AI_CONFIG = {
    "enabled": True,
    "model": "gemini-3.8-flash",
    "timeout_sec": 30
}

# Delivery Settings
MAX_CURATED_LEADS = 8  # Keep WhatsApp digests tight, actionable, and distraction-free
