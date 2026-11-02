"""
Agent 1: Harvester Agent
Dispatches headless queries to Google Maps and streams back structured raw listings.
100% Free, Zero-API-Cost.
"""

import json
import subprocess
import time
import sys
from pathlib import Path
from typing import List, Dict, Any

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import config


class HarvesterAgent:
    def __init__(self, scraper_path: Path = config.SCRAPER_EXE):
        self.scraper_path = scraper_path
        if not self.scraper_path.exists():
            raise FileNotFoundError(f"Scraper binary not found at: {self.scraper_path}")

    def prepare_query_file(self, queries: List[str], filename: str = "active_batch.txt") -> Path:
        """Saves search queries into an input text file for the scraper."""
        config.QUERIES_DIR.mkdir(parents=True, exist_ok=True)
        query_file = config.QUERIES_DIR / filename
        with open(query_file, "w", encoding="utf-8") as f:
            for q in queries:
                cleaned = q.strip()
                if cleaned:
                    f.write(f"{cleaned}\n")
        return query_file

    def harvest(self, queries: List[str], depth: int = 1, timeout_sec: int = 180) -> List[Dict[str, Any]]:
        """
        Executes Google Maps Scraper binary against queries and collects JSON output.
        """
        timestamp = int(time.time())
        query_file = self.prepare_query_file(queries, f"batch_{timestamp}.txt")
        config.RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
        output_file = config.RAW_DATA_DIR / f"raw_leads_{timestamp}.json"

        cmd = [
            str(self.scraper_path),
            "-input", str(query_file),
            "-results", str(output_file),
            "-json",
            "-depth", str(depth),
            "-exit-on-inactivity", "1m",
            "-c", "1"
        ]

        print(f"[HarvesterAgent] 🛰️ Launching harvest for {len(queries)} query/queries (Depth: {depth})...")
        try:
            # Execute scraper synchronously with timeout and UTF-8 safe decoding
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout_sec
            )
        except subprocess.TimeoutExpired:
            print("[HarvesterAgent] ⚠️ Harvest process reached timeout, collecting partial results...")

        return self.parse_results(output_file)

    def parse_results(self, output_file: Path) -> List[Dict[str, Any]]:
        """Parses JSON or JSONL results emitted by gmaps_scraper."""
        if not output_file.exists():
            print(f"[HarvesterAgent] ⚠️ No output file produced at {output_file}")
            return []

        leads = []
        with open(output_file, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read().strip()
            if not content:
                return []

            # Try parsing as JSON array
            try:
                data = json.loads(content)
                if isinstance(data, list):
                    for item in data:
                        leads.append(self._normalize(item))
                    return leads
            except json.JSONDecodeError:
                pass

            # Otherwise parse as line-delimited JSON (JSONL)
            for line in content.splitlines():
                line = line.strip()
                if not line:
                    continue
                try:
                    item = json.loads(line)
                    leads.append(self._normalize(item))
                except json.JSONDecodeError:
                    continue

        print(f"[HarvesterAgent] 🎯 Harvested {len(leads)} raw local listings.")
        return leads

    def _normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizes diverse scraper fields into a clean standard lead format."""
        # Phone cleanup & Indian mobile detection
        raw_phone = raw.get("phone") or raw.get("phone_number") or ""
        digits_only = "".join(ch for ch in str(raw_phone) if ch.isdigit())
        
        # Indian mobile format handler (e.g. 09821970746 -> 919821970746, 9821970746 -> 919821970746)
        clean_phone = ""
        is_mobile = False
        if len(digits_only) == 10 and digits_only[0] in "6789":
            clean_phone = f"91{digits_only}"
            is_mobile = True
        elif len(digits_only) == 11 and digits_only.startswith("0") and digits_only[1] in "6789":
            clean_phone = f"91{digits_only[1:]}"
            is_mobile = True
        elif len(digits_only) == 12 and digits_only.startswith("91") and digits_only[2] in "6789":
            clean_phone = digits_only
            is_mobile = True
        else:
            clean_phone = digits_only

        # Review count
        raw_reviews = raw.get("review_count") or raw.get("reviews") or raw.get("reviews_count") or 0
        try:
            reviews_count = int(raw_reviews)
        except (ValueError, TypeError):
            reviews_count = 0

        # Rating
        raw_rating = raw.get("review_rating") or raw.get("rating") or raw.get("total_score") or 0.0
        try:
            rating = float(raw_rating)
        except (ValueError, TypeError):
            rating = 0.0

        website = (raw.get("web_site") or raw.get("website") or raw.get("web_page") or "").strip()

        # Complete address formatting
        addr_dict = raw.get("complete_address")
        if isinstance(addr_dict, dict):
            borough = addr_dict.get("borough", "")
            street = addr_dict.get("street", "")
            city = addr_dict.get("city", "")
            address = f"{street}, {borough}, {city}".strip(", ")
        else:
            address = str(raw.get("address") or "")

        return {
            "title": raw.get("title") or raw.get("name") or "Local Business",
            "category": raw.get("category") or raw.get("main_category") or "Local Service",
            "address": address,
            "phone": raw_phone,
            "clean_phone": clean_phone,
            "is_mobile": is_mobile,
            "website": website,
            "rating": rating,
            "reviews_count": reviews_count,
            "latitude": raw.get("latitude"),
            "longitude": raw.get("longtitude") or raw.get("longitude"),
            "link": raw.get("link") or raw.get("url") or "",
            "cid": raw.get("cid") or "",
            "place_id": raw.get("place_id") or "",
            "raw": raw
        }
