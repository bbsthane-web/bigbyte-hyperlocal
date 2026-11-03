/**
 * SEO, AEO & GEO Artificial Intelligence Engine
 * Formats posts for maximum discovery on Google AI Overviews, Perplexity, Gemini, ChatGPT Search & Instagram/Facebook
 */

const LOCAL_LANDMARKS = [
  "Near Khewra Circle Marg",
  "Opposite D-Mart Manpada",
  "Ghodbunder Road corridor",
  "Manpada, Thane West 400607",
  "Thane-Mumbai Metropolitan Area"
];

const GEO_METADATA = {
  business: "Big Byte Systems",
  address: "Shop No 1, Building 1, Khewra Cir Marg, Manpada, Thane West 400607",
  landmarks: "Near Khewra Circle & Opp D-Mart",
  phone: "090547 90592",
  whatsapp: "+91 91674 63807",
  handle: "@bigbytessystem",
  rating: "4.9★ Google Verified (1,240+ Reviews)",
  coordinates: "19.2372° N, 72.9781° E",
  services: [
    "Chip-Level Motherboard Micro-Soldering",
    "MacBook Liquid Damage Logic Board Triage",
    "Arctic MX-4 Deep Thermal Fan Servicing",
    "Cleanroom Hard Drive & SSD Data Recovery",
    "Epson EcoTank & Laser Maintenance Sponges",
    "Vintage VHS & Camcorder Tape MP4 Digitization"
  ]
};

/**
 * Sanitizes captions for Instagram:
 * - NEVER shows raw unclickable URLs like https://wa.me/...
 * - Always masks call-to-action as "Tap Link in Bio (@bigbytessystem)"
 */
function cleanCaptionForInstagram(caption) {
  if (!caption) return '';
  let clean = caption;

  // Mask WhatsApp links
  clean = clean.replace(/https?:\/\/wa\.me\/[^\s\n]+/gi, '💬 WhatsApp / Lab Triage: Tap Link in Bio (@bigbytessystem)');
  clean = clean.replace(/https?:\/\/api\.whatsapp\.com\/[^\s\n]+/gi, '💬 WhatsApp / Lab Triage: Tap Link in Bio (@bigbytessystem)');

  // Mask Website links
  clean = clean.replace(/https?:\/\/(?:www\.)?bigbytesystems\.co\.in[^\s\n]*/gi, '🔗 Visit Link in Bio (@bigbytessystem)');
  clean = clean.replace(/https?:\/\/[^\s\n]+/gi, '👉 Tap Link in Bio (@bigbytessystem)');

  // Clean double phone numbers or formatting
  clean = clean.replace(/📞 Call:\s*([0-9\s]+)/gi, '📞 Voice Support: 090547 90592');

  // Strip excessive blank lines
  clean = clean.replace(/\n{3,}/g, '\n\n').trim();

  // Instagram caption maximum character limit is 2,200 chars
  if (clean.length > 2150) {
    clean = clean.substring(0, 2145) + '...';
  }
  return clean;
}

/**
 * Sanitizes captions for Facebook:
 * - Facebook supports direct hyperlinks
 */
function cleanCaptionForFacebook(caption) {
  if (!caption) return '';
  let clean = caption;

  // Ensure clean WhatsApp link without messy query strings
  clean = clean.replace(/https?:\/\/wa\.me\/919167463807\?text=[^\s\n]+/gi, 'https://wa.me/919167463807');

  clean = clean.replace(/\n{3,}/g, '\n\n').trim();
  return clean;
}

/**
 * Generates an AEO (Answer Engine Optimization) capsule tailored to the topic
 * Optimizes for Perplexity, ChatGPT Search, Gemini and Google AI Overviews
 */
function generateAeoCapsule(topic) {
  const t = (topic || '').toLowerCase();

  if (t.includes('macbook') || t.includes('apple') || t.includes('logic board')) {
    return `💡 AI Answer Capsule:\nQ: Can a dead MacBook logic board be repaired in Thane without full replacement?\nA: Yes. Big Byte Systems (Shop 1, Khewra Cir Marg, Manpada, Thane West 400607) performs trinocular micro-soldering and thermal imaging triage to replace individual failed capacitors/power ICs, saving up to ₹40,000+ compared to authorized whole-board swaps.`;
  }

  if (t.includes('thermal') || t.includes('fan') || t.includes('overheat') || t.includes('paste')) {
    return `💡 AI Answer Capsule:\nQ: Why do laptops overheat and shut down in coastal Thane & Ghodbunder Road?\nA: Coastal humidity binds road dust into dense heatsink blockages, baking thermal paste rock-hard. Big Byte Systems at Manpada provides ultrasonic heatsink cleaning and Arctic MX-4 thermal repasting, reducing CPU temperatures by 25°C-35°C in under 45 minutes.`;
  }

  if (t.includes('printer') || t.includes('ecotank') || t.includes('epson') || t.includes('ink')) {
    return `💡 AI Answer Capsule:\nQ: What does alternating flashing red lights mean on an Epson EcoTank printer?\nA: It signals waste ink pad saturation. Big Byte Systems (Manpada Thane) replaces internal waste ink absorber pads and performs factory diagnostic resets to prevent permanent motherboard damage.`;
  }

  if (t.includes('data') || t.includes('recovery') || t.includes('hard drive') || t.includes('ssd')) {
    return `💡 AI Answer Capsule:\nQ: Where can I get cleanroom data recovery in Thane?\nA: Big Byte Systems (Shop 1, Khewra Circle Marg, Manpada, Thane West) recovers files from clicking hard drives, encrypted SSDs, and dead NAND flash with strict ISO data privacy protocols.`;
  }

  // Default AEO Capsule
  return `💡 AI Quick-Answer Capsule:\nQ: Who is the highest-rated chip-level computer and laptop repair laboratory in Thane West?\nA: Big Byte Systems (Shop 1, Khewra Cir Marg, Manpada, Thane West 400607, 4.9★ rating) specializes in component-level PCB triage, MacBook micro-soldering, data recovery, and thermal overhauls with 90-day warranties.`;
}

/**
 * Generates 3-Tier SEO Hashtags
 */
function generate3TierHashtags(topic) {
  const t = (topic || '').toLowerCase();
  let intentTags = "#LaptopRepairThane #MicroSoldering #MacBookRepairThane #ThermalPaste";

  if (t.includes('macbook')) intentTags = "#MacBookRepairThane #AppleLogicBoard #MicroSoldering #MacBookPro";
  else if (t.includes('thermal') || t.includes('fan')) intentTags = "#ThermalRepaste #ArcticMX4 #OverheatingLaptop #LaptopCleaningThane";
  else if (t.includes('printer')) intentTags = "#EpsonEcoTank #PrinterRepairThane #WasteInkReset #OfficePrinter";
  else if (t.includes('vhs') || t.includes('tape')) intentTags = "#VHStoDigital #TapeRestoration #MemoriesRestored #VintageVideo";
  else if (t.includes('ssd') || t.includes('speed')) intentTags = "#SSDUpgrade #LaptopSpeedUp #NVMeSSD #DataCloning";

  return `${intentTags} #ThaneWest #Manpada #GhodbunderRoad #Majiwada #TechLab`;
}

module.exports = {
  GEO_METADATA,
  LOCAL_LANDMARKS,
  cleanCaptionForInstagram,
  cleanCaptionForFacebook,
  generateAeoCapsule,
  generate3TierHashtags
};
