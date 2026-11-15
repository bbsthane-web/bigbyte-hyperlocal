#!/usr/bin/env python3
"""
Kimi Eastern Horizon Scout & Token Watchdog — Big Byte Systems
Scouts Asian open-source repositories (Gitee, Bilibili, Chinese AI repos)
with strict token rate-limiting to maximize the 15 RMB free voucher over 60+ days.
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime

CONFIG_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "kimi_config.json")
LEDGER_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "kimi_usage_ledger.json")
SCOUT_CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "scouted_arsenal_candidates.json")

# Default Config & Budget Limits
DEFAULT_CONFIG = {
    "api_key": "",
    "base_url": "https://api.moonshot.ai/v1",
    "model": "moonshot-v1-8k",  # 8k model uses minimal tokens (0.012 RMB / 1k tokens)
    "daily_token_cap": 25000,   # Ensures 15 RMB grant lasts 60+ days
    "initial_free_grant_rmb": 15.0
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return {**DEFAULT_CONFIG, **json.load(f)}
        except Exception:
            pass
    return DEFAULT_CONFIG

def save_config(cfg):
    os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        try:
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "total_tokens_used": 0,
        "total_cost_rmb": 0.0,
        "daily_usage": {},
        "query_history": []
    }

def save_ledger(ledger):
    os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=2)

def check_daily_budget(cfg, ledger):
    today = datetime.now().strftime("%Y-%m-%d")
    today_tokens = ledger["daily_usage"].get(today, 0)
    cap = cfg["daily_token_cap"]
    remaining_today = max(0, cap - today_tokens)
    
    # Calculate estimated remaining days from free grant
    cost_per_token = 0.000012 # for moonshot-v1-8k
    spent_rmb = ledger["total_cost_rmb"]
    remaining_grant_rmb = max(0.0, cfg["initial_free_grant_rmb"] - spent_rmb)
    remaining_total_tokens = int(remaining_grant_rmb / cost_per_token)
    days_left = round(remaining_total_tokens / cap, 1)

    return {
        "today": today,
        "today_tokens": today_tokens,
        "daily_cap": cap,
        "remaining_today": remaining_today,
        "remaining_grant_rmb": round(remaining_grant_rmb, 2),
        "estimated_days_runway": days_left,
        "can_query": remaining_today > 1000
    }

def run_scout(query, force=False):
    cfg = load_config()
    ledger = load_ledger()
    budget = check_daily_budget(cfg, ledger)

    print("==================================================================")
    print("🛰️  BIG BYTE KIMI EASTERN HORIZON REPO SCOUT")
    print(f"📊  Today: {budget['today_tokens']:,} / {budget['daily_cap']:,} tokens (Remaining Today: {budget['remaining_today']:,})")
    print(f"💰  Free Grant Left: ~¥{budget['remaining_grant_rmb']:.2f} RMB (~{budget['estimated_days_runway']} days runway at current rate)")
    print("==================================================================")

    if not budget["can_query"] and not force:
        print(f"\n🛑 [KIMI TOKEN GUARD HALT] Daily budget cap ({budget['daily_cap']:,} tokens) reached!")
        print("To protect your 60-day free runway, querying is paused until midnight.")
        print("Use --force if this is an urgent high-alpha query.\n")
        return None

    api_key = cfg.get("api_key") or os.environ.get("MOONSHOT_API_KEY") or os.environ.get("KIMI_API_KEY")
    if not api_key:
        print("\n⚠️  No API Key found!")
        print(f"Please set your key in {CONFIG_FILE} or export MOONSHOT_API_KEY=sk-xxxx")
        print("Get your free trial grant at https://platform.kimi.ai/\n")
        return None

    # Check cache to avoid duplicate token burning
    if os.path.exists(SCOUT_CACHE_FILE):
        try:
            with open(SCOUT_CACHE_FILE, "r", encoding="utf-8") as f:
                cache = json.load(f)
                if query in cache:
                    print(f"\n⚡ [CACHE HIT] Returning saved intelligence (0 tokens spent):\n")
                    print(cache[query])
                    return cache[query]
        except Exception:
            pass

    import urllib.request
    import urllib.error

    system_prompt = (
        "You are an Elite Asian Open-Source Intelligence Scout for Big Byte Systems. "
        "Your mission is to discover high-alpha, un-hyped open-source repositories from Gitee, Bilibili, and Chinese dev communities. "
        "Strict Requirements: "
        "1. Prioritize tools with high star velocity, MIT/Apache licenses, and zero subscription cost. "
        "2. Deliver ONLY dense, actionable Markdown comparison tables: "
        "| Tool Name | Repo URL | Stars | Category | Core Competitive Advantage | "
        "3. Provide exact 1-sentence technical differentiator. Zero conversational filler."
    )

    payload = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Scout Asian open-source repos for: {query}"}
        ],
        "temperature": 0.3
    }

    req = urllib.request.Request(
        f"{cfg['base_url'].rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    )

    print(f"\n📡 Transmitting scout probe to Moonshot Kimi: '{query}'...")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})
            total_tokens = usage.get("total_tokens", 1500)
            
            # Record in Ledger
            today = budget["today"]
            ledger["total_tokens_used"] += total_tokens
            cost = total_tokens * 0.000012
            ledger["total_cost_rmb"] += cost
            ledger["daily_usage"][today] = ledger["daily_usage"].get(today, 0) + total_tokens
            ledger["query_history"].append({
                "time": datetime.now().isoformat(),
                "query": query,
                "tokens": total_tokens,
                "cost_rmb": round(cost, 6)
            })
            save_ledger(ledger)

            # Save in Cache
            os.makedirs(os.path.dirname(SCOUT_CACHE_FILE), exist_ok=True)
            cache_data = {}
            if os.path.exists(SCOUT_CACHE_FILE):
                try:
                    with open(SCOUT_CACHE_FILE, "r", encoding="utf-8") as f:
                        cache_data = json.load(f)
                except Exception:
                    pass
            cache_data[query] = content
            with open(SCOUT_CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(cache_data, f, indent=2)

            print(f"\n✅ Scout Report Received ({total_tokens:,} tokens spent • ¥{cost:.4f} RMB):\n")
            print(content)
            return content

    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        print(f"\n❌ Moonshot API Error {e.code}: {err_body}")
        return None
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kimi Eastern Horizon Scout")
    parser.add_argument("query", nargs="?", default="trending open source video lip sync and face animation on gitee", help="Search query")
    parser.add_argument("--set-key", help="Save API key to config")
    parser.add_argument("--status", action="store_true", help="View token budget and runway status")
    parser.add_argument("--force", action="store_true", help="Bypass daily limit")

    args = parser.parse_args()

    if args.set_key:
        cfg = load_config()
        cfg["api_key"] = args.set_key.strip()
        save_config(cfg)
        print(f"✅ Moonshot API key saved to {CONFIG_FILE}")
        sys.exit(0)

    if args.status:
        cfg = load_config()
        ledger = load_ledger()
        b = check_daily_budget(cfg, ledger)
        print("==================================================================")
        print("🛰️  BIG BYTE KIMI REPO SCOUT STATUS & RUNWAY")
        print(f"💰  Total Free Grant: ¥{cfg['initial_free_grant_rmb']:.2f} RMB")
        print(f"📉  Total Spent: ¥{ledger['total_cost_rmb']:.4f} RMB ({ledger['total_tokens_used']:,} tokens)")
        print(f"💵  Grant Remaining: ¥{b['remaining_grant_rmb']:.2f} RMB")
        print(f"📅  Daily Cap: {b['daily_cap']:,} tokens/day")
        print(f"⏳  Estimated Runway: {b['estimated_days_runway']} Days of Daily Scouting Remaining")
        print("==================================================================")
        sys.exit(0)

    run_scout(args.query, force=args.force)
