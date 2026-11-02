"""
Agent 2: Digital Gap Auditor Agent
Diagnoses conversion leaks, review deficiencies, and missing mobile assets for local businesses.
Assigns opportunity scores (0-100) and priority tiers.
"""

from typing import Dict, Any, List
import config


class AuditorAgent:
    def __init__(self, rules: Dict[str, Any] = config.AUDIT_RULES):
        self.rules = rules

    def audit_lead(self, lead: Dict[str, Any]) -> Dict[str, Any]:
        """
        Audits an individual business lead and identifies high-value digital gaps.
        """
        gaps: List[str] = []
        score = 0

        reviews = lead.get("reviews_count", 0)
        rating = lead.get("rating", 0.0)
        website = lead.get("website", "").strip().lower()
        has_phone = bool(lead.get("phone"))
        is_mobile = lead.get("is_mobile", False)

        # 1. Website Audit
        if not website:
            score += self.rules["missing_website_weight"]
            gaps.append("Missing Website / Mobile Landing Asset")
        elif any(domain in website for domain in ["sites.google.com", "justdial.com", "facebook.com", "instagram.com"]):
            score += 20
            gaps.append("Unbranded / Third-Party Free Hosting")
        elif website.startswith("http://"):
            score += 10
            gaps.append("Insecure HTTP Website (SSL Warning)")

        # 2. Reviews & Social Proof Audit
        if reviews == 0:
            score += self.rules["low_reviews_weight"] + 5
            gaps.append("Zero Reviews (Severe Trust Deficit)")
        elif reviews < self.rules["low_reviews_threshold"]:
            score += self.rules["low_reviews_weight"]
            gaps.append(f"Low Review Count ({reviews} reviews vs 100+ competitor avg)")
        elif rating > 0 and rating < self.rules["subpar_rating_threshold"]:
            score += 15
            gaps.append(f"Subpar Rating ({rating}★ hurting local conversions)")

        # 3. WhatsApp Direct Booking Gap
        # Standard local business websites lack direct WhatsApp chat widgets
        score += self.rules["missing_whatsapp_weight"]
        gaps.append("No 1-Tap WhatsApp Appointment/Chat Flow")

        # 4. Actionability Bonus
        if is_mobile:
            score += self.rules["has_phone_number_bonus"]
        elif has_phone:
            score += 5

        # Normalize score
        final_score = min(max(score, 0), 100)

        # Priority tier
        if final_score >= 75:
            tier = "HOT"
            priority = 1
        elif final_score >= 55:
            tier = "WARM"
            priority = 2
        else:
            tier = "COOL"
            priority = 3

        return {
            **lead,
            "opportunity_score": final_score,
            "priority_tier": tier,
            "priority": priority,
            "digital_gaps": gaps,
            "primary_gap": gaps[0] if gaps else "General Digital Optimization"
        }

    def audit_batch(self, leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Audits a batch of leads and sorts them by opportunity score descending."""
        audited = [self.audit_lead(lead) for lead in leads]
        audited.sort(key=lambda x: (x["priority"], -x["opportunity_score"]))
        print(f"[AuditorAgent] 🔍 Audited {len(audited)} leads. Hot: {sum(1 for l in audited if l['priority_tier']=='HOT')}, Warm: {sum(1 for l in audited if l['priority_tier']=='WARM')}")
        return audited
