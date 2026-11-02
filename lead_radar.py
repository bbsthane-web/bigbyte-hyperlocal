"""
Hyperlocal Lead Radar - Multi-Agent Swarm Coordinator
Integrates Harvester, Auditor, Pitch Strategist, and Courier into a unified autonomous pipeline.
"""

import argparse
import os
import sys
import webbrowser
from pathlib import Path

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure project root is in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import config
from agents.harvester import HarvesterAgent
from agents.auditor import AuditorAgent
from agents.strategist import PitchStrategistAgent
from agents.courier import CourierAgent


def run_pipeline(query: str, depth: int = 1, from_file: str = None, auto_open: bool = False):
    print("=" * 65)
    print("🚀  BIGBYTE HYPERLOCAL LEAD RADAR - AGENT SWARM ACTIVATED")
    print("=" * 65)
    print(f"🎯 Target Query  : {query}")
    print(f"📱 User WhatsApp : +{config.USER_PHONE}")
    print(f"⚙️  Depth Setting : {depth}")
    print("-" * 65)

    # 1. Initialize Agents
    harvester = HarvesterAgent()
    auditor = AuditorAgent()
    strategist = PitchStrategistAgent()
    courier = CourierAgent()

    # 2. Agent 1: Harvest Raw Leads
    if from_file and Path(from_file).exists():
        print(f"[Coordinator] 📂 Loading pre-harvested data from: {from_file}")
        raw_leads = harvester.parse_results(Path(from_file))
    else:
        print(f"[Coordinator] 🌐 Agent 1 (Harvester) crawling Google Maps...")
        raw_leads = harvester.harvest([query], depth=depth)

    if not raw_leads:
        print("[Coordinator] ❌ No leads found for this query. Try a broader search term.")
        return

    print(f"[Coordinator] ✅ Agent 1 collected {len(raw_leads)} raw business listings.")

    # 3. Agent 2: Audit Digital Gaps & Score Opportunities
    print("[Coordinator] 🔍 Agent 2 (Auditor) diagnosing digital gaps & calculating opportunity scores...")
    audited_leads = auditor.audit_batch(raw_leads)

    # 4. Agent 3: Craft Consultative WhatsApp Pitches & 1-Click wa.me Links
    print("[Coordinator] ✍️ Agent 3 (Strategist) drafting compliant consultative pitches & wa.me links...")
    strategized_leads = strategist.strategize_batch(audited_leads)

    # 5. Agent 4: Generate WhatsApp Digest & Interactive Dashboard
    print("[Coordinator] 📦 Agent 4 (Courier) assembling WhatsApp digest and HTML dashboard...")
    
    # Generate Digest Text
    digest_text = courier.build_whatsapp_digest(strategized_leads, location=query)
    digest_path = config.REPORTS_DIR / "whatsapp_digest.txt"
    config.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(digest_path, "w", encoding="utf-8") as f:
        f.write(digest_text)

    # Generate 1-Click WhatsApp Launcher
    launcher_path = BASE_DIR / "Send-To-My-WhatsApp.bat"
    courier.generate_delivery_batch_script(digest_text, launcher_path)

    # Generate Glassmorphic HTML Dashboard
    dashboard_path = BASE_DIR / "dashboard.html"
    courier.generate_html_dashboard(strategized_leads, query_name=query, output_path=dashboard_path)

    print("=" * 65)
    print("🎉 PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 65)
    print(f"📊 Interactive Dashboard : {dashboard_path}")
    print(f"📲 1-Click WhatsApp Send : {launcher_path}")
    print(f"📄 Text Digest Saved At  : {digest_path}")
    print("\n--- SAMPLE CURATED DIGEST PREVIEW ---")
    print(digest_text[:600] + "...\n(digest continues)")
    print("=" * 65)

    if auto_open:
        webbrowser.open(f"file:///{dashboard_path.as_posix()}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hyperlocal Lead Radar Swarm")
    parser.add_argument("-q", "--query", type=str, default="Dentists in Thane West", help="Search query")
    parser.add_argument("-d", "--depth", type=int, default=1, help="Pagination depth (default: 1)")
    parser.add_argument("-f", "--from-file", type=str, default=None, help="Process existing JSON results file")
    parser.add_argument("-o", "--open", action="store_true", help="Automatically open HTML dashboard in browser")

    args = parser.parse_args()
    run_pipeline(query=args.query, depth=args.depth, from_file=args.from_file, auto_open=args.open)
