"""
Agent 3: Pitch Strategist Agent
Crafts hyper-personalized, zero-risk, consultative WhatsApp hooks tailored for Indian local business owners.
Generates 1-click wa.me action links.
"""

import urllib.parse
from typing import Dict, Any, List
import subprocess
import config


class PitchStrategistAgent:
    def __init__(self, use_ai: bool = False):
        self.use_ai = use_ai

    def create_pitch(self, lead: Dict[str, Any]) -> str:
        """
        Builds a consultative 3-stage WhatsApp outreach message.
        Stage 1: Respectful recognition & locality relevance.
        Stage 2: Identified conversion leak / digital gap.
        Stage 3: Zero-risk, helpful call-to-action (30-sec demo).
        """
        title = lead.get("title", "Doctor/Owner")
        category = lead.get("category", "Local Service")
        rating = lead.get("rating", 0.0)
        reviews = lead.get("reviews_count", 0)
        website = lead.get("website", "").strip()
        address = lead.get("address", "")
        
        # Extract locality keyword (e.g. Naupada, Majiwada, Thane)
        locality = "Thane"
        for loc in ["Naupada", "Majiwada", "Ghodbunder", "Panch Pakhadi", "Vasant Vihar", "Mulund"]:
            if loc.lower() in address.lower() or loc.lower() in title.lower():
                locality = loc
                break

        # Pitch Formula
        lines = []
        
        # 1. Opening
        if "clinic" in title.lower() or "dental" in title.lower() or "dr" in title.lower():
            lines.append(f"Hello Dr. / Team {title},")
        else:
            lines.append(f"Hello Team {title},")

        # 2. Observation & Social Proof
        if rating >= 4.5 and reviews > 0:
            lines.append(f"I came across your {rating}★ profile in {locality} – really impressive patient feedback.")
        elif reviews > 0:
            lines.append(f"I was researching top-rated {category.lower()} practices across {locality}.")
        else:
            lines.append(f"I came across your newly listed business profile in {locality}.")

        # 3. Gap Analysis
        if not website:
            lines.append(f"I noticed patients searching on mobile Maps don't have an official site or direct WhatsApp booking link to confirm slots immediately, which usually leads to missed inquiries during busy clinic hours.")
        elif reviews < 35:
            lines.append(f"While your service quality is top notch, your profile only has {reviews} reviews compared to competitors nearby with 100+, which pushes you down in Google Maps 3-Pack rankings.")
        else:
            lines.append(f"I noticed mobile visitors viewing your profile don't have a 1-tap WhatsApp consultation button to ask quick questions, causing potential inquiries to drop off.")

        # 4. Zero-Friction Offer (No hardcoded pricing, zero commitment)
        lines.append(f"We set up a simple 1-tap WhatsApp automated booking system for {locality} practices that captures inquiries 24/7 without changing your current setup.")
        lines.append("Can I send you a quick 30-second preview of how it looks?")

        return "\n\n".join(lines)

    def generate_wa_link(self, phone: str, message: str) -> str:
        """Creates a clickable WhatsApp web/app link."""
        clean = "".join(ch for ch in str(phone) if ch.isdigit())
        if not clean:
            return ""
        if len(clean) == 10:
            clean = f"91{clean}"
        elif len(clean) == 11 and clean.startswith("0"):
            clean = f"91{clean[1:]}"
            
        encoded = urllib.parse.quote(message)
        return f"https://wa.me/{clean}?text={encoded}"

    def strategize_lead(self, lead: Dict[str, Any]) -> Dict[str, Any]:
        """Enriches the lead with pitch text and 1-click wa.me link."""
        pitch = self.create_pitch(lead)
        phone = lead.get("clean_phone") or lead.get("phone") or ""
        wa_link = self.generate_wa_link(phone, pitch) if phone else ""

        return {
            **lead,
            "pitch_message": pitch,
            "wa_outreach_link": wa_link
        }

    def strategize_batch(self, leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Applies pitch strategy to a list of leads."""
        strategized = [self.strategize_lead(lead) for lead in leads]
        print(f"[PitchStrategistAgent] ✍️ Crafted consultative pitches and wa.me links for {len(strategized)} leads.")
        return strategized
