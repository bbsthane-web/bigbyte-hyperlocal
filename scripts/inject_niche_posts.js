/**
 * Injects 9 High-Craft Scheduled Posts for Non-Tech Clients:
 * - 3 for Dr. Sharma Advanced Dental Care (client_drsharma)
 * - 3 for Urban Roast Artisan Cafe (client_urbanroast)
 * - 3 for Aura Luxe Hair & Skin Atelier (client_aura_luxe)
 */

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');

const NEW_NICHE_POSTS = [
  // 1. DR. SHARMA ADVANCED DENTAL CARE
  {
    id: "post_ds_01",
    clientId: "client_drsharma",
    clientName: "Dr. Sharma Advanced Dental Care",
    platform: "youtube",
    status: "Scheduled",
    date: "2026-11-20",
    time: "11:30",
    title: "🦷 Why Teeth Bleeding While Brushing is NOT Normal (Early Periodontitis Warning)",
    videoHook: "If you spit pink foam when brushing your teeth, stop ignoring it. Here is what is happening under your gumline.",
    visualStoryboard: [
      "[0:00 - 0:03] Extreme macro close-up of toothbrush with pink foam; digital split showing healthy vs inflamed gum pocket.",
      "[0:03 - 0:09] 3D animated cross-section of dental plaque hardening into subgingival calculus within 48 hours.",
      "[0:09 - 0:17] Ultrasonic piezo scaler vibrating at 32kHz effortlessly shattering black tartar without touching enamel.",
      "[0:17 - 0:24] Subgingival diode laser decontamination eliminating 99.8% anaerobic bacteria in 3 minutes.",
      "[0:24 - 0:30] Re-attachment: Clean pink firm gums, healthy papilla, zero bleeding probe test."
    ],
    script: "Spitting pink foam is not from brushing too hard—it is stage 1 gum infection called gingivitis. In coastal areas and hard water zones, mineralized saliva turns soft plaque into hard calculus in just 48 hours. Routine ultrasonic scaling preserves your bone support. Dr. Sharma Dental, Panch Pakhadi, Thane West.",
    content: "Spitting pink foam when brushing? That isn't normal wear—it is an early warning of subgingival calculus and gingivitis. Ultrasonic scaling and diode laser decontamination restore healthy gums in a single gentle session.\n\n📍 Dr. Sharma Advanced Dental Care — Sunrise Arcade, Panch Pakhadi, Thane West 400602\n📞 Appointments: 098200 12345\n💬 WhatsApp: https://wa.me/919820012345\n\n#Shorts #DentalHealth #OralCare #GumDisease #UltrasonicScaling #Periodontics #ThaneDentist #PanchPakhadi #Naupada #ThaneWest",
    hashtags: {
      tier1_macro: ["#Shorts", "#DentalHealth", "#OralCare", "#DentalTips"],
      tier2_niche: ["#GumDisease", "#UltrasonicScaling", "#Periodontics", "#BleedingGumsFix"],
      tier3_hyperlocal: ["#ThaneDentist", "#PanchPakhadi", "#Naupada", "#ThaneWest", "#DentalCareThane"]
    },
    seoKeywords: [
      "dentist in panch pakhadi thane",
      "bleeding gums treatment thane west",
      "ultrasonic teeth scaling cost thane",
      "painless dental clinic near naupada",
      "best periodontist in thane"
    ],
    image: "/assets/generated/plate_drsharma_01_scaling.jpg",
    mediaUrl: "/assets/generated/plate_drsharma_01_scaling.jpg"
  },
  {
    id: "post_ds_02",
    clientId: "client_drsharma",
    clientName: "Dr. Sharma Advanced Dental Care",
    platform: "instagram",
    status: "Scheduled",
    date: "2026-11-22",
    time: "14:00",
    title: "✨ Invisible Aligners vs Metal Braces: 6-Month Real Smile Transformation",
    videoHook: "Thinking of fixing crooked teeth at 25 or 35? You don't need ugly metal wires anymore.",
    visualStoryboard: [
      "[0:00 - 0:03] Patient popping off completely invisible clear aligner tray with a seamless snap; smooth front teeth look unaltered.",
      "[0:03 - 0:08] 3D iTero optical intraoral scanner moving along dental arch, live digital rendering on touchscreen in 60s.",
      "[0:08 - 0:16] Time-lapse ClinCheck simulation showing anterior crowding straightening step-by-step from Tray 1 to Tray 18.",
      "[0:16 - 0:24] Split comparison: Braces mouth ulcers & stuck food vs Aligners eating anything with zero wire breakage.",
      "[0:24 - 0:30] Finished smile: Radiant symmetrical smile alignment, patient confident in mirror."
    ],
    script: "Gone are the days when straightening crooked teeth meant two years of painful metal brackets, ulcers, and broken wires. With 3D digital intraoral scanning and custom clear aligners, your teeth shift smoothly and invisibly while you eat whatever you like. Book a 3D smile scan consultation. Dr. Sharma Dental, Panch Pakhadi.",
    content: "Straighten your smile discreetly without wires or brackets! See how 3D digital intraoral scanning crafts custom invisible aligners that fit your lifestyle seamlessly.\n\n📍 Sunrise Arcade, Panch Pakhadi, Thane West 400602\n👉 Tap link in bio (@drsharmadental) to book your complimentary 3D Smile Assessment!\n\n#SmileMakeover #ClearAligners #Orthodontics #Invisalign #TeethStraightening #AdultBraces #3DIntraoralScan #AestheticDentistry #DentistThane #PanchPakhadiThane #TalaoPali #ThaneWest",
    hashtags: {
      tier1_macro: ["#SmileMakeover", "#ClearAligners", "#Orthodontics", "#Invisalign"],
      tier2_niche: ["#TeethStraightening", "#AdultBraces", "#3DIntraoralScan", "#AestheticDentistry"],
      tier3_hyperlocal: ["#DentistThane", "#PanchPakhadiThane", "#TalaoPali", "#ThaneWest", "#ThaneSmileClinic"]
    },
    seoKeywords: [
      "clear aligners thane west",
      "invisalign cost in thane",
      "best orthodontist in panch pakhadi",
      "invisible braces for adults thane",
      "3d smile scan thane"
    ],
    image: "/assets/generated/plate_drsharma_02_aligners.jpg",
    mediaUrl: "/assets/generated/plate_drsharma_02_aligners.jpg"
  },
  {
    id: "post_ds_03",
    clientId: "client_drsharma",
    clientName: "Dr. Sharma Advanced Dental Care",
    platform: "gmb",
    status: "Scheduled",
    date: "2026-11-24",
    time: "10:30",
    title: "⚡ Single-Sitting Laser Root Canal: Zero Pain & Same-Day Dental Crown",
    videoHook: "Terrified of root canal pain? Modern rotary endodontics changed everything.",
    visualStoryboard: [
      "[0:00 - 0:03] Digital RVG X-ray reveals deep pulpitis infection reaching root apex under severe toothache.",
      "[0:03 - 0:09] Computerized painless local anesthesia delivery; patient relaxed and comfortable in ergonomic dental chair.",
      "[0:09 - 0:17] Rotary nickel-titanium flexible files gently cleaning root canal canals under dental loupe magnification.",
      "[0:17 - 0:24] 980nm laser canal disinfection eradicating bacteria followed by bio-ceramic hermetic sealing.",
      "[0:24 - 0:30] CAD/CAM precision zirconia monolithic crown placed seamlessly in single session. Zero post-op sensitivity."
    ],
    script: "Modern root canal therapy is virtually painless. Utilizing computerized local anesthesia, flexible rotary NiTi instruments, and laser canal sterilization, we eliminate infection and preserve your natural tooth in a single 45-minute sitting. Tap Call Now on this post to schedule immediate pain-relief triage at Dr. Sharma Dental, Panch Pakhadi.",
    content: "Experiencing sharp tooth pain or cold sensitivity? Single-visit rotary endodontics combined with diode laser canal sterilization delivers immediate relief while preserving your natural tooth structure. Finished with high-strength monolithic zirconia crown in the same appointment.\n\n📍 Dr. Sharma Advanced Dental Care — Sunrise Arcade, Panch Pakhadi, Thane West (Opposite Post Office, near Talao Pali).\n👉 Tap the 'Call now' button on this post to schedule immediate dental consultation.\n\n#RootCanal #PainlessDentistry #LaserRCT #SingleVisitRCT #ZirconiaCrown #PanchPakhadi #ThaneWest #NaupadaDentist",
    hashtags: {
      tier1_macro: ["#RootCanal", "#PainlessDentistry", "#EmergencyDentist", "#DentalHealth"],
      tier2_niche: ["#LaserRCT", "#SingleVisitRCT", "#ZirconiaCrown", "#RotaryEndodontics"],
      tier3_hyperlocal: ["#PanchPakhadi", "#ThaneWest", "#NaupadaDentist", "#Charai", "#ThaneDoctors"]
    },
    seoKeywords: [
      "painless root canal thane west",
      "single sitting rct cost thane",
      "emergency dental clinic panch pakhadi",
      "zirconia crown thane",
      "laser dentist near me thane"
    ],
    image: "/assets/generated/plate_drsharma_03_rct.jpg",
    mediaUrl: "/assets/generated/plate_drsharma_03_rct.jpg"
  },

  // 2. URBAN ROAST ARTISAN CAFE
  {
    id: "post_ur_01",
    clientId: "client_urbanroast",
    clientName: "Urban Roast Artisan Cafe",
    platform: "youtube",
    status: "Scheduled",
    date: "2026-11-21",
    time: "11:30",
    title: "☕ Why Your Espresso Tastes Bitter: The 9-Bar Extraction Ratio Secret",
    videoHook: "If your espresso tastes sour or brutally bitter, your coffee shop is committing this 1 fatal mistake.",
    visualStoryboard: [
      "[0:00 - 0:03] Bottomless naked portafilter exploding with rich tiger-striped hazelnut crema flowing into heated glass.",
      "[0:03 - 0:08] Precision digital micro-scale measuring 18.2g of single-origin Chikmagalur Arabica beans.",
      "[0:08 - 0:16] WDT needle distribution de-clumping coffee bed, followed by 30-lb calibrated level tamp.",
      "[0:16 - 0:24] Pressure gauge locked at optimal 9-bar pre-infusion, yielding a sweet 36g nectar shot in 28.5 seconds.",
      "[0:24 - 0:30] Barista pouring velvety micro-foam into intricate 8-tier swan latte art; guest sipping with pure delight."
    ],
    script: "Bitter, harsh espresso comes from channeling and over-extraction. At Urban Roast, every shot is weighed to 0.1 gram precision, de-clumped with acupuncture distribution, and pulled at exact 9-bar pressure. Experience notes of dark cocoa, toasted hazelnut, and wild honey. Urban Roast, The Walk, Hiranandani Estate, Thane West.",
    content: "Why does standard espresso taste burnt or acidic? Micro-channeling ruins coffee. Watch how acupuncture WDT distribution, 9-bar saturated groupheads, and single-origin Chikmagalur Arabica create velvet hazelnut crema.\n\n📍 Urban Roast Artisan Cafe — Unit 12, The Walk High Street, Hiranandani Estate, Thane West 400607\n📞 Table Reservations: 098190 54321\n💬 WhatsApp: https://wa.me/919819054321\n\n#Shorts #CoffeeLovers #Espresso #BaristaLife #SpecialtyCoffee #ThirdWaveCoffee #NakedPortafilter #LatteArt #HiranandaniEstate #TheWalkThane #ThaneCafes #GhodbunderRoad",
    hashtags: {
      tier1_macro: ["#Shorts", "#CoffeeLovers", "#Espresso", "#BaristaLife", "#SpecialtyCoffee"],
      tier2_niche: ["#ThirdWaveCoffee", "#NakedPortafilter", "#LatteArt", "#PourOverCoffee"],
      tier3_hyperlocal: ["#HiranandaniEstate", "#TheWalkThane", "#ThaneCafes", "#GhodbunderRoad", "#ThaneFoodie"]
    },
    seoKeywords: [
      "specialty coffee thane west",
      "best cafes in hiranandani estate",
      "artisan roastery the walk thane",
      "co-working cafe ghodbunder road",
      "espresso bar thane"
    ],
    image: "/assets/generated/plate_urbanroast_01_espresso.jpg",
    mediaUrl: "/assets/generated/plate_urbanroast_01_espresso.jpg"
  },
  {
    id: "post_ur_02",
    clientId: "client_urbanroast",
    clientName: "Urban Roast Artisan Cafe",
    platform: "instagram",
    status: "Scheduled",
    date: "2026-11-23",
    time: "14:00",
    title: "🥐 72-Hour Fermented Butter Sourdough Croissant: The Ultimate Flake Test",
    videoHook: "Hear this crunch. This is what real French laminated butter pastry sounds like.",
    visualStoryboard: [
      "[0:00 - 0:03] Slow-motion tear of golden baked croissant with crisp crackle audio; honeycomb cross-section revealed.",
      "[0:03 - 0:09] Pastry chef sheeting French Elle & Vire unsalted 84% butter sheets between sourdough dough folds.",
      "[0:09 - 0:17] 72-hour cold retard chamber fermentation enhancing deep aromatic sourdough complexity.",
      "[0:17 - 0:24] Deck oven baking at 195°C; pastry puffing into airy 27 caramelized butter layers.",
      "[0:24 - 0:30] Served warm on matte stone plate alongside signature Iced Spanish Latte under ambient cafe lighting."
    ],
    script: "Real croissants cannot be rushed. We ferment our wild sourdough starter for 72 cold hours, laminating French 84% butter into 27 delicate micro-layers for that unbeatable honeycomb crumb and shattering exterior. Freshly baked every morning at 8 AM. Urban Roast, The Walk, Hiranandani Estate.",
    content: "Listen to that shatter! 🥐 Hand-laminated with 84% churned French butter and fermented for 72 cold hours to achieve the iconic honeycomb crumb. Fresh out of the stone oven every morning at 8:00 AM.\n\n📍 Unit 12, The Walk High Street, Hiranandani Estate, Thane West\n👉 Tap link in bio (@urbanroastthane) for our daily artisan bakery menu and table reservations!\n\n#Croissant #ArtisanBakery #Sourdough #PastryLove #HoneycombStructure #FrenchLamination #SpecialtyRoastery #TheWalkHiranandani #HiranandaniEstateThane #ThaneFoodBlogger #Ghodbunder #ThaneWest",
    hashtags: {
      tier1_macro: ["#Croissant", "#ArtisanBakery", "#Sourdough", "#PastryLove"],
      tier2_niche: ["#HoneycombStructure", "#FrenchLamination", "#SpecialtyRoastery", "#CroissantLovers"],
      tier3_hyperlocal: ["#TheWalkHiranandani", "#HiranandaniEstateThane", "#ThaneFoodBlogger", "#Ghodbunder", "#ThaneWest"]
    },
    seoKeywords: [
      "best croissants in thane",
      "artisan bakery hiranandani estate",
      "breakfast cafe the walk thane",
      "french pastry shop thane west",
      "sourdough bakery near me thane"
    ],
    image: "/assets/generated/plate_urbanroast_02_croissant.jpg",
    mediaUrl: "/assets/generated/plate_urbanroast_02_croissant.jpg"
  },
  {
    id: "post_ur_03",
    clientId: "client_urbanroast",
    clientName: "Urban Roast Artisan Cafe",
    platform: "facebook",
    status: "Scheduled",
    date: "2026-11-25",
    time: "12:00",
    title: "🌿 Slow Drip Japanese Kyoto Cold Brew: 18-Hour Single-Origin Extraction",
    videoHook: "Why our cold brew takes 18 hours per batch: zero acidity, pure dark chocolate notes.",
    visualStoryboard: [
      "[0:00 - 0:03] Elegant multi-tier Japanese glass Kyoto tower slowly releasing 1 crystal clear cold water drop every 3 seconds.",
      "[0:03 - 0:09] Water seeping through coarse-ground anaerobic fermented Coorg micro-lot Arabica beans.",
      "[0:09 - 0:17] Slow gravitational filtration capturing delicate stone fruit and dark chocolate floral esters without bitter tannins.",
      "[0:17 - 0:24] Cold-extracted elixir poured over crystal clear ice rock in heavy crystal tumbler.",
      "[0:24 - 0:30] Finished glass served with dehydrated orange wheel slice; customer working on MacBook in sunlit cafe patio."
    ],
    script: "Unlike hot-brewed coffee chilled with ice, traditional Kyoto cold drip extracts coffee drop-by-drop over 18 hours using ice-melt water. The result is an ultra-smooth, naturally sweet brew with 60% less acidity and distinct notes of dark chocolate and orange zest. Try it on tap today at Urban Roast Artisan Cafe, The Walk, Hiranandani Estate, Thane West.",
    content: "Patience creates perfection. Our Japanese Kyoto cold drip tower brews one drop every 3 seconds over 18 continuous hours using anaerobic micro-lot Arabica beans. 60% less acidity, zero bitterness, and a velvety dark chocolate finish.\n\n📍 Unit 12, The Walk High Street, Hiranandani Estate, Thane West 400607\n📞 Table Reservations: 098190 54321\n💬 WhatsApp: https://wa.me/919819054321\n\n#ColdBrew #KyotoDrip #CoffeeCulture #ArtisanCoffee #SingleOriginCoffee #LowAcidityCoffee #NitroBrew #HiranandaniEstate #TheWalkThane #ThaneCafes #Patlipada #GhodbunderRoadThane",
    hashtags: {
      tier1_macro: ["#ColdBrew", "#KyotoDrip", "#CoffeeCulture", "#ArtisanCoffee"],
      tier2_niche: ["#SingleOriginCoffee", "#LowAcidityCoffee", "#NitroBrew", "#CoffeeRoaster"],
      tier3_hyperlocal: ["#HiranandaniEstate", "#TheWalkThane", "#ThaneCafes", "#Patlipada", "#GhodbunderRoadThane"]
    },
    seoKeywords: [
      "cold brew coffee thane",
      "kyoto drip coffee thane west",
      "aesthetic work cafe hiranandani estate",
      "roastery cafe near me thane",
      "the walk thane restaurants"
    ],
    image: "/assets/generated/plate_urbanroast_03_coldbrew.jpg",
    mediaUrl: "/assets/generated/plate_urbanroast_03_coldbrew.jpg"
  },

  // 3. AURA LUXE HAIR & SKIN ATELIER
  {
    id: "post_al_01",
    clientId: "client_aura_luxe",
    clientName: "Aura Luxe Hair & Skin Atelier",
    platform: "youtube",
    status: "Scheduled",
    date: "2026-11-21",
    time: "11:30",
    title: "✨ Frizzy Damaged Hair? Nanoplasty vs Keratin: The True Scientific Difference",
    videoHook: "Stop burning your hair with formaldehyde keratin. Here is the 100% organic secret to liquid glass hair.",
    visualStoryboard: [
      "[0:00 - 0:03] High-speed camera glide over unruly frizzy bleached hair transforming into reflective liquid mirror silk.",
      "[0:03 - 0:08] Digital microscope showing broken cortex disulfide bonds before organic amino acid infusion.",
      "[0:08 - 0:16] Master stylist applying bio-compatible plant keratin and nano-amino complex with zero chemical fumes or tears.",
      "[0:16 - 0:24] Titanium flat iron sealing nutrients at 190°C, real-time steam evaporative moisture lock.",
      "[0:24 - 0:30] Dramatic slow-motion hair toss: 100% frizz-free, weightless movement, blinding high-gloss finish."
    ],
    script: "Traditional keratin treatments rely on harsh aldehydes that coat hair superficially and break down in 4 weeks. Japanese Organic Nanoplasty uses nano-sized plant amino acids that penetrate deep into the hair cortex, restructuring damaged bonds from the inside out for 6 months of effortless liquid silk shine. Experience hair couture at Aura Luxe Atelier, Gladys Alwares Road, Opposite Hiranandani Meadows.",
    content: "Frizzy, rebellious hair in coastal Thane humidity? Discover Japanese Organic Nanoplasty: 100% formaldehyde-free amino acid reconstruction that restores broken cortex bonds and delivers 6 months of liquid silk shine.\n\n📍 Aura Luxe Hair & Skin Atelier — Suite 102, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West 400610\n📞 Atelier Concierge: 098210 99888\n💬 WhatsApp: https://wa.me/919821099888\n\n#Shorts #HairTransformation #GlassHair #Nanoplasty #HairGoals #FormaldehydeFree #JapaneseHairBotox #DamageRepair #HairCouture #HiranandaniMeadows #VasantViharThane #GladysAlwaresRoad #ThaneSalon #LuxurySalonThane",
    hashtags: {
      tier1_macro: ["#Shorts", "#HairTransformation", "#GlassHair", "#Nanoplasty", "#HairGoals"],
      tier2_niche: ["#FormaldehydeFree", "#JapaneseHairBotox", "#DamageRepair", "#HairCouture"],
      tier3_hyperlocal: ["#HiranandaniMeadows", "#VasantViharThane", "#GladysAlwaresRoad", "#ThaneSalon", "#LuxurySalonThane"]
    },
    seoKeywords: [
      "nanoplasty hair treatment thane west",
      "best luxury salon in hiranandani meadows",
      "hair botox cost thane",
      "organic hair spa near vasant vihar",
      "top hair stylist in thane"
    ],
    image: "/assets/generated/plate_auraluxe_01_nanoplasty.jpg",
    mediaUrl: "/assets/generated/plate_auraluxe_01_nanoplasty.jpg"
  },
  {
    id: "post_al_02",
    clientId: "client_aura_luxe",
    clientName: "Aura Luxe Hair & Skin Atelier",
    platform: "instagram",
    status: "Scheduled",
    date: "2026-11-23",
    time: "14:00",
    title: "💎 Medical HydraFacial MD: 4-Step Vortex Deep Pore Extraction & Glow",
    videoHook: "Watch what actually comes out of your pores after 1 session of clinical vortex extraction.",
    visualStoryboard: [
      "[0:00 - 0:03] Close-up of transparent medical waste gunk canister filling with cloudy sebum, blackheads, and dead skin.",
      "[0:03 - 0:08] Patented Hydropeel spiral tip exfoliating stratum corneum while infusing salicylic & glycolic acid.",
      "[0:08 - 0:16] Gentle vortex suction clearing congested pores on T-zone and nose without redness or manual squeezing.",
      "[0:16 - 0:24] Deep pneumatic infusion of hyaluronic acid, peptide complex, and botanical antioxidants into dermal layer.",
      "[0:24 - 0:30] Client side-profile skin check: Translucent Korean glass skin reflection, zero pore texture, lit-from-within glow."
    ],
    script: "Manual blackhead extractions cause skin bruising and enlarged pores. Authentic HydraFacial MD utilizes 4-in-1 vortex vacuum technology to simultaneously vacuum out stubborn congested impurities while saturating your skin with medical-grade peptides and hyaluronic acid. Walk out with zero downtime and instant glass-skin radiance. Tap link in bio to book at Aura Luxe Atelier, Meadows, Thane.",
    content: "The ultimate skin detox! ✨ Watch our patented 4-in-1 Vortex Hydropeel technology vacuum away stubborn impurities, blackheads, and environmental buildup while drenching your dermal barrier with potent peptides and hyaluronic acid. Zero downtime, instant mirror glow.\n\n📍 Suite 102, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West\n👉 Tap link in bio (@auraluxethane) to reserve your bespoke clinical facial experience!\n\n#HydraFacial #GlassSkin #SkincareRoutine #GlowUp #AestheticClinic #VortexExtraction #HyaluronicAcid #SkinRejuvenation #PoreCleansing #ThaneAesthetics #HiranandaniMeadows #PokhranRoad #VasantVihar #ThaneSkincare",
    hashtags: {
      tier1_macro: ["#HydraFacial", "#GlassSkin", "#SkincareRoutine", "#GlowUp", "#AestheticClinic"],
      tier2_niche: ["#VortexExtraction", "#HyaluronicAcid", "#SkinRejuvenation", "#PoreCleansing"],
      tier3_hyperlocal: ["#ThaneAesthetics", "#HiranandaniMeadows", "#PokhranRoad", "#VasantVihar", "#ThaneSkincare"]
    },
    seoKeywords: [
      "hydrafacial in thane west",
      "skin clinic hiranandani meadows",
      "best dermatologist salon thane",
      "korean glass skin treatment thane",
      "deep pore extraction clinic thane"
    ],
    image: "/assets/generated/plate_auraluxe_02_hydrafacial.jpg",
    mediaUrl: "/assets/generated/plate_auraluxe_02_hydrafacial.jpg"
  },
  {
    id: "post_al_03",
    clientId: "client_aura_luxe",
    clientName: "Aura Luxe Hair & Skin Atelier",
    platform: "facebook",
    status: "Scheduled",
    date: "2026-11-25",
    time: "12:00",
    title: "🎨 French Balayage & Silk Gloss: Custom Dimensional Hair Color Contouring",
    videoHook: "Why foil highlights look like zebra stripes: the art of bespoke freehand French balayage.",
    visualStoryboard: [
      "[0:00 - 0:03] Model walking into natural sunlight; hair cascading with seamless golden caramel dimensional ribbons.",
      "[0:03 - 0:08] Master colorist sweeping clay-based lightener with artist brush freehand onto mid-lengths and face-framing pieces.",
      "[0:08 - 0:16] L'Oréal Metal DX pre-treatment neutralizing copper particles inside hair fibers to prevent breakage.",
      "[0:16 - 0:24] Acidic Demi-Permanent gloss toning bath sealing cuticles and boosting light reflection.",
      "[0:24 - 0:30] Dyson Supersonic blowout revealing seamless, grown-out root graduation with zero harsh line demarcation."
    ],
    script: "Traditional foil highlights often leave harsh horizontal lines that look unnatural as your hair grows. French Balayage is an artisanal hand-painting technique that creates customized sun-kissed dimension and effortless root graduation tailored to your skin undertone and bone structure. Includes Bond-repair infusion and acid gloss sealing. Aura Luxe Atelier, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West.",
    content: "Tired of zebra-striped foil highlights? French Balayage is bespoke freehand hair contouring that enhances your cheekbones and jawline with seamless, sun-kissed dimension. Paired with L'Oréal Metal DX bond protection and an acid gloss toning bath for incandescent shine.\n\n📍 Aura Luxe Hair & Skin Atelier — Suite 102, Gladys Alwares Road, Opp Hiranandani Meadows, Thane West 400610\n📞 Appointments: 098210 99888\n💬 WhatsApp: https://wa.me/919821099888\n\n#Balayage #HairColor #SunKissedHair #BlondeBalayage #FrenchBalayage #CaramelBalayage #ColorMelt #HairGlossing #MeadowsThane #HiranandaniMeadows #ThaneWestSalon #PokhranRoad2 #ThaneWomen",
    hashtags: {
      tier1_macro: ["#Balayage", "#HairColor", "#SunKissedHair", "#BlondeBalayage"],
      tier2_niche: ["#FrenchBalayage", "#CaramelBalayage", "#ColorMelt", "#HairGlossing"],
      tier3_hyperlocal: ["#MeadowsThane", "#HiranandaniMeadows", "#ThaneWestSalon", "#PokhranRoad2", "#ThaneWomen"]
    },
    seoKeywords: [
      "balayage hair color thane west",
      "luxury hair salon hiranandani meadows",
      "best hair stylist thane",
      "hair coloring studio pokhran road",
      "french balayage specialist thane"
    ],
    image: "/assets/generated/plate_auraluxe_03_balayage.jpg",
    mediaUrl: "/assets/generated/plate_auraluxe_03_balayage.jpg"
  }
];

function injectPosts() {
  const currentPosts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  const newIds = new Set(NEW_NICHE_POSTS.map(p => p.id));
  
  // Filter out any existing versions of these 9 IDs to maintain idempotency
  const preservedPosts = currentPosts.filter(p => !newIds.has(p.id));

  // Append new posts
  const updatedPosts = [...preservedPosts, ...NEW_NICHE_POSTS];

  fs.writeFileSync(POSTS_FILE, JSON.stringify(updatedPosts, null, 2), 'utf8');
  console.log(`Successfully injected 9 posts! Total posts now: ${updatedPosts.length} (was ${currentPosts.length})`);
}

injectPosts();
