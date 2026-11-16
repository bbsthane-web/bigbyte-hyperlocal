# 🔒 Client Privacy & Exact Link Integrity Mandate (Zero Personal Data Exposure & Zero Assumptions)

Whenever scraping, auditing, generating Schema.org JSON-LD, building `llms.txt`, or publishing contact details for ANY client or external business across Big Byte Systems projects:

## 1. Masked Link Respect (Anti-Doxxing Invariant)
- If a client website uses a masked link, custom shortlink (e.g., `wa.link/*`, `bit.ly/*`, `linktr.ee/*`), or proxy contact button rather than displaying a raw, plaintext telephone number, the system, agent, and scrapers **MUST NEVER** unmask, reverse-engineer, or leak their raw personal phone number into public code, public Schema, or search directories.
- A masked link indicates intentional privacy protection against scrapers and spam bots. Unmasking it violates client privacy and trust.

## 2. Verbatim Link Preservation
- The exact URL as published by the client (e.g., `https://wa.link/z24yu5`) MUST be preserved verbatim in `sameAs`, contact actions, anchor tags, and `llms.txt`.
- NEVER synthesize artificial links (such as forceful `https://wa.me/<unmasked_number>`) when the client chose to use a masked shortlink.

## 3. Zero Synthetic Assumptions Law
- Never synthesize, assume, or hallucinate NAP (Name, Address, Phone, Hours) details.
- If a data point is missing from the client site, mark it as unlisted/missing and flag it in the diagnostic audit.
- Injecting placeholder fallbacks (like fake phone numbers, dummy addresses, or stock hours) is strictly prohibited.
