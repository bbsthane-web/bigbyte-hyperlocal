/**
 * Big Byte Systems & Agency — Social Media Command Center
 * Client-side Single Page Application Logic
 */

// Application State
const state = {
  clients: [],
  currentClient: null,
  allPosts: [],
  filteredPosts: [],
  currentPlatform: 'all',
  searchQuery: '',
  currentView: 'pipeline',
  calendarDate: new Date(2026, 9, 1), // Default October 2026
  activeModalPost: null,
  canvasFormat: 'reel',
  canvasTheme: 'cyber',
  canvasHeadline: '⚠️ Coastal Thane Humidity Destroys Laptop Fans',
  canvasHook: 'If you live near Ghodbunder Road, your laptop cooling looks like THIS.',
  // Multi-Platform & SaaS Extensions
  platforms: [],
  plans: [],
  trial: { active: true, daysLeft: 12 },
  selectedCurrency: 'INR',
  currencyRates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044 },
  currencySymbols: { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' },
  selectedLanguage: 'en',
  activeCheckoutPlan: null,
  appliedCoupon: null,
  whitelabel: null,
  voiceCharacter: 'male_in',
  voiceRate: 1.05,
  voicePitch: 1.0
};

// Preset Topic Library for Instant Generation
const TOPIC_PRESETS = {
  humidity: {
    platform: 'youtube',
    title: '⚠️ Why Coastal Thane Humidity Destroys Laptop Fans & Thermal Paste',
    hook: 'If you live near Ghodbunder Road or Majiwada, your laptop fan looks like THIS right now.',
    script: 'Thane humidity combined with dust creates a thick thermal blanket over your laptop cooling vents. Thermal paste bakes hard into dry chalk, causing CPU throttling, sudden shutdowns, and motherboard warping. A 30-minute deep thermal servicing restores factory quiet cooling. Visit Big Byte Systems, Manpada.',
    storyboard: [
      '[0:00 - 0:03] Tech unscrews laptop bottom cover in front of customer, reveals dense felt-like grey lint cake.',
      '[0:03 - 0:10] Macro zoom on copper heatsink exhaust vents completely choked with coastal salt-air lint.',
      '[0:10 - 0:18] Tech lifts copper heatpipe showing rock-hard baked grey thermal paste that cracks like chalk.',
      '[0:18 - 0:25] Ultrasonically cleaned copper fin, Arctic MX-4 thermal paste applied in smooth diamond pattern.',
      '[0:25 - 0:30] Cinebench test: Fan runs whisper quiet, CPU temps drop from 98°C to 68°C!'
    ],
    content: "Hear that jet-engine noise from your laptop? In coastal Thane, humidity bakes dust into a solid airflow block. Here is how deep ultrasonic heatsink cleaning and Arctic MX-4 thermal repasting dropped temps by 30°C!\n\n📍 Shop No 1, Khewra Circle Marg, Manpada, Thane West.\n📞 Call: 090547 90592\n💬 WhatsApp: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #LaptopCleaning #OverheatingFix #GhodbunderRoad #ThaneWest #TechTips"
  },
  macbook: {
    platform: 'youtube',
    title: '🔥 Dead MacBook Pro Saved! No Logic Board Replacement Needed',
    hook: 'Client was told they had to replace this entire dead MacBook Pro logic board. Watch what was actually wrong.',
    script: 'Never assume a dead laptop means an expensive motherboard replacement! Authorized centers usually swap entire boards, but chip-level laboratory diagnostics can isolate a single shorted tiny capacitor. Save your hardware and data. Big Byte Systems, Manpada, Thane West.',
    storyboard: [
      '[0:00 - 0:03] Close-up of dead MacBook Pro screen connected to USB-C ammeter reading 0.00A.',
      '[0:03 - 0:10] Disassembly showing microscopic motherboard rail under digital microscope.',
      '[0:10 - 0:20] Thermal camera shows shorted 0402 ceramic capacitor glowing bright yellow on 19V rail.',
      '[0:20 - 0:26] Micro-soldering iron removes capacitor, clean pad replacement, thermal paste applied.',
      '[0:26 - 0:30] Power applied: ammeter jumps to 1.45A, famous Apple boot chime sounds!'
    ],
    content: "Dead MacBook Pro that wouldn't power on! Instead of replacing the entire expensive logic board, we traced a shorted capacitor on the 19V rail using thermal imaging and micro-soldering.\n\n📍 Big Byte Systems — Shop No 1, Building 1, Khewra Cir Marg, Manpada, Thane West.\n📞 Hotline: 090547 90592\n💬 WhatsApp Triage: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #MacBookRepair #LaptopRepairThane #MicroSoldering #ThaneWest #AppleRepair"
  },
  epson: {
    platform: 'gmb',
    title: '📍 Epson EcoTank Red Lights Alternately Blinking? Paper Jam vs Waste Pad Reset',
    hook: 'Red lights flashing alternately on your Epson printer? Stop shaking it—here is the real cause.',
    script: 'When your Epson EcoTank flashes red lights alternately, the printer has locked itself to prevent toxic waste ink overflow. Do not force paper through! We replace the internal absorber pads and recalibrate the firmware counters safely. Big Byte Systems, Thane West.',
    storyboard: [
      '[0:00 - 0:04] Epson L3150 printer with alternating flashing red ink and paper teardrop LEDs.',
      '[0:04 - 0:12] Tech opens rear maintenance compartment showing saturated waste ink sponge.',
      '[0:12 - 0:20] Explanation of waste ink counter saturation lock vs carriage sensor blockage.',
      '[0:20 - 0:26] Fresh high-absorbency sponge installed, optical sensor cleaned, internal counter serviced.',
      '[0:26 - 0:30] Test diagnostic print sheet rolls through with vibrant 100% nozzle check lines.'
    ],
    content: "Epson EcoTank red light alternate blinking error decoded! Don't let waste ink leak onto your furniture. We offer genuine sponge replacements and diagnostic counter resets.\n\n📍 Near Khewra Circle, Manpada, Thane West.\n\nTap the \"Call now\" button below to consult directly with our senior technicians."
  },
  hinge: {
    platform: 'youtube',
    title: '💥 Broken Laptop Hinge? Stop Forcing It Or Your Screen Will Shatter!',
    hook: 'Does your laptop lid pop open near the corner with a loud crack? Stop closing it immediately.',
    script: 'Laptop manufacturers overtighten metal hinges, and over time, leverage snaps the fragile plastic screw bosses inside your chassis. We rebuild chassis anchors with industrial-grade epoxy fabrication and recalibrate hinge tension for lifetime durability. Visit Big Byte Systems, Thane.',
    storyboard: [
      '[0:00 - 0:03] Customer demonstrates laptop corner popping open, plastic bezel flexing over LCD glass.',
      '[0:03 - 0:11] Tech reveals factory brass screw inserts ripped clean out of weak plastic palmrest mounts.',
      '[0:11 - 0:19] Loosening overtightened steel hinge tension nuts by 15% to restore smooth opening.',
      '[0:19 - 0:26] High-tensile structural epoxy reconstruction creating an anchor 3X stronger than factory plastic.',
      '[0:26 - 0:30] Smooth lid opening with zero bezel gap or screen wobble.'
    ],
    content: "Save your laptop display before a broken hinge cracks your expensive screen! We rebuild internal screw anchors with reinforced structural epoxy and calibrate hinge friction.\n\n📍 Shop 1, Building 1, Khewra Cir Marg, Manpada, Thane West.\n📞 Hotline: 090547 90592\n💬 Triage: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #LaptopHingeRepair #HardwareFix #ThaneCity #GhodbunderRoad #ComputerRepair"
  },
  spill: {
    platform: 'youtube',
    title: '☕ Chai Spilled On Your Laptop? The 3 Mistakes That Kill It Instantly',
    hook: 'If you just spilled water or chai on your laptop, do NOT put it in rice! Here is what actually saves it.',
    script: 'When tea or water enters your laptop, electric current flowing through mineral liquid causes instant galvanic corrosion that eats copper traces in minutes! Never plug it in, and never use rice. Disconnect the battery immediately and bring it to an electronics laboratory for ultrasonic decontamination. Big Byte Systems, Manpada, Thane West.',
    storyboard: [
      '[0:00 - 0:04] Sticky chai seeping between keyboard scissor switches and onto power rails.',
      '[0:04 - 0:11] Tech explains: Do NOT turn on, do NOT plug charger, and rice does NOT stop corrosion.',
      '[0:11 - 0:19] Microscopic look at active galvanic corrosion eating copper traces.',
      '[0:19 - 0:26] Rapid ultrasonic bath in 99.9% electronic solvent removing residues.',
      '[0:26 - 0:30] Fully restored laptop running diagnostics with clean keyboard action.'
    ],
    content: "Liquid spill emergency triage protocol! Rice won't neutralize acidic sugar deposits or mineral corrosion. Immediate power cut and laboratory ultrasonic cleaning is the only proven fix.\n\n📍 Big Byte Systems — Khewra Circle Marg, Manpada, Thane.\n📞 Emergency Desk: 090547 90592\n💬 Instant WhatsApp: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #LiquidSpillRepair #MacBookSpill #LaptopRepairThane #Manpada #TechEmergency"
  },
  ssd: {
    platform: 'youtube',
    title: '⚡ SSD vs Hard Drive: Transform Any 8-Year-Old Sluggish Laptop in 20 Mins',
    hook: 'Takes 6 minutes for your PC to boot Windows? Watch this 20-minute laboratory upgrade.',
    script: 'Old mechanical hard drives with spinning platters become agonizing bottlenecks on modern Windows. You do not need to buy a brand new machine! A high-speed Solid State Drive upgrade with exact 1-to-1 data cloning delivers up to 10X faster boot times while keeping every single file intact. Big Byte Systems, Manpada, Thane West.',
    storyboard: [
      '[0:00 - 0:04] Stopwatch beside laptop: spinning wheel of doom, hard drive at 100% disk usage.',
      '[0:04 - 0:12] Tech swaps mechanical 5400RPM HDD for high-speed Crucial NVMe/SATA SSD.',
      '[0:12 - 0:19] Byte-for-byte exact clone transfer preserving desktop, files, photos, and licensed software.',
      '[0:19 - 0:26] Restart test: Windows 11 boots to desktop in 8.4 seconds flat!',
      '[0:26 - 0:30] Customer opens Chrome with 25 tabs instantly with zero lag.'
    ],
    content: "Why spend large sums on a new laptop when an SSD speed boost makes your current machine boot in 8 seconds? Exact cloning means zero data loss.\n\n📍 Shop 1, Khewra Cir Marg, Manpada, Thane West.\n📞 Upgrade Hotline: 090547 90592\n💬 WhatsApp: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #SSDUpgrade #SpeedBoost #LaptopRepairThane #ThaneWest #TechUpgrade"
  },
  vhs: {
    platform: 'instagram',
    title: '📼 Rescuing 25-Year-Old Wedding VHS Tapes From Mould & Fungus',
    hook: 'White fuzzy fungus on your parents old 1998 wedding tape? Watch how we restore it to 1080p MP4.',
    script: 'Thane monsoon moisture creates magnetic tape mould that snaps old VHS and Hi8 tapes if played directly. Our precision laboratory cleaning safely de-moulds the ribbon and digitizes your priceless family memories into pristine 1080p MP4. Preserve your legacy before tapes demagnetize. Big Byte Systems, Manpada.',
    storyboard: [
      '[0:00 - 0:03] Close-up of VHS cassette window revealing white mould clinging to magnetic ribbon.',
      '[0:03 - 0:12] Manual spooling rig passing magnetic tape through isopropyl microfiber cleaning wipers.',
      '[0:12 - 0:20] Tape spooled safely into refurbished JVC S-VHS deck with Time Base Corrector (TBC).',
      '[0:20 - 0:26] Blackmagic Design capture card displaying crystal clear, jitter-free footage on PC.',
      '[0:26 - 0:30] Customer receives encrypted gold USB drive with high-bitrate MP4 files.'
    ],
    content: "Don't let humidity destroy your parents' 90s wedding and childhood home movies! We clean mouldy magnetic tape ribbons and transfer VHS, MiniDV & Hi8 to modern USB drives.\n\n📍 Big Byte Systems, Shop 1, Khewra Circle Marg, Manpada, Thane.\n📞 Inquiries: 090547 90592\n💬 Direct WhatsApp: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #VHStoDigital #MemoriesRestored #VintageVideo #ThaneWest #FamilyHistory"
  },
  cleanroom: {
    platform: 'youtube',
    title: '💾 Clicking Hard Drive? Stop Powering It On Before Data Is Lost Forever',
    hook: 'Hear that rhythmic clicking sound from your external hard disk? Disconnect it right now.',
    script: 'The dreaded click of death means mechanical read-write heads have collapsed and are physically grinding against fragile magnetic platters. Every second you leave it plugged in reduces the chance of recovering your family photos and financial accounts. Safe laboratory recovery in Thane West. Big Byte Systems.',
    storyboard: [
      '[0:00 - 0:04] Audio of rhythmic clicking as read-write heads slap against platter limiter.',
      '[0:04 - 0:12] Demonstration inside clean bench: magnetic heads deformed from physical drop.',
      '[0:12 - 0:20] Explanation: Repeated power cycles scrape magnetic film off platters.',
      '[0:20 - 0:26] Head stack replacement under stereomicroscope with donor drive parts.',
      '[0:26 - 0:30] Hardware imager extracting raw bitstream clone with 99.8% customer data recovery success.'
    ],
    content: "Hardware data recovery triage! If your external drive clicks, beeps, or isn't recognized, do not run consumer recovery software. Protect your platters and recover safely.\n\n📍 Shop 1, Khewra Cir Marg, Manpada, Thane West.\n📞 Recovery Lab: 090547 90592\n💬 Direct WhatsApp: https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems%2C%20I%20need%20diagnostic%20triage%20for%20my%20device.\n\n#Shorts #DataRecovery #HardDriveClicking #PhotoRecovery #ThaneWest #TechLaboratory"
  },
  amc: {
    platform: 'linkedin',
    title: '💼 Why Component-Level Diagnostics Save Corporate IT Budgets',
    hook: 'Enterprise IT managers in Thane: How component-level servicing cuts hardware budget waste by 60%.',
    script: 'For enterprise IT managers and business owners across Thane, unexpected hardware failures disrupt productivity and deplete procurement budgets. Chip-level diagnostics offer a strategic alternative that extends machine life cycles by 3 to 5 years. Big Byte Systems provides corporate IT servicing and SLA-backed maintenance.',
    storyboard: [
      '[0:00 - 0:05] Corporate office floor with 20+ desktop workstations.',
      '[0:05 - 0:15] Tech diagnosing workstation board in Big Byte laboratory under thermal camera.',
      '[0:15 - 0:25] Automated backup schedule verification on office NAS storage server.',
      '[0:25 - 0:30] Big Byte B2B engineer delivering certified repaired workstation with SLA warranty.'
    ],
    content: "For enterprise IT managers and business owners across Thane, unexpected hardware failures disrupt productivity and deplete procurement budgets.\n\nWhen vendor authorized centers recommend wholesale motherboard replacements, chip-level diagnostics offer a strategic, budget-conscious alternative. By isolating component-level shorts under microscopic inspection, hardware life cycles can be extended by 3 to 5 years with zero data migration downtime.\n\nBig Byte Systems provides corporate IT servicing, fleet overhauls, and SLA-backed maintenance for clinics, accounting firms, and enterprises in Thane West.\n\nInquire about business maintenance: 090547 90592\n📍 Khewra Cir Marg, Manpada, Thane West."
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Theme (Day / Night mode)
  initTheme();

  // Set default form date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = document.getElementById('newDate');
  if (dateInput) {
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Load clients, posts, platforms, plans, and whitelabel
  await loadClients();
  await loadPosts();
  await loadConfig();
  await loadPlatforms();
  await loadPlans();
  await loadWhiteLabelSettings();

  // Initialize Canvas Graphic Studio & Niche Suite
  initCanvas();
  initNicheSuite();

  // Handle URL hash routing on initial load
  const initialHash = (window.location.hash || '').replace('#', '').trim();
  if (initialHash && ['calendar', 'creator', 'niche', 'reels', 'channels', 'clients', 'pricing', 'whitelabel'].includes(initialHash)) {
    showTab(initialHash);
  }
});

window.addEventListener('hashchange', () => {
  const hash = (window.location.hash || '').replace('#', '').trim();
  if (hash && ['calendar', 'creator', 'niche', 'reels', 'channels', 'clients', 'pricing', 'whitelabel'].includes(hash)) {
    showTab(hash);
  }
});

// Load Clients from API
async function loadClients() {
  try {
    const res = await fetch('/api/clients');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      state.clients = data;
      // Default to Big Byte Systems (first client)
      state.currentClient = data[0];
      populateClientDropdown();
      updateClientUI();
      renderClientsManager();
    }
  } catch (err) {
    console.error('Failed to load clients:', err);
  }
}

// Populate Client Dropdown in Sidebar
function populateClientDropdown() {
  const sel = document.getElementById('clientSelector');
  if (!sel) return;
  sel.innerHTML = '';
  state.clients.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.avatar || '🏢'} ${c.name}`;
    if (c.id === state.currentClient?.id) opt.selected = true;
    sel.appendChild(opt);
  });
}

// Update Active Client UI Badges
function updateClientUI() {
  const c = state.currentClient;
  if (!c) return;

  const topAvatar = document.getElementById('topAvatar');
  const topName = document.getElementById('topClientName');
  const topStatus = document.getElementById('topClientStatus');
  const clientLoc = document.getElementById('clientLocation');
  const clientPhone = document.getElementById('clientPhone');

  if (topAvatar) topAvatar.textContent = c.avatar || '💻';
  if (topName) topName.textContent = c.name;
  if (topStatus) {
    const chCount = Object.keys(c.accounts || {}).length || 5;
    topStatus.textContent = `${chCount} Channels Connected`;
  }
  if (clientLoc) clientLoc.textContent = c.address || 'Manpada, Thane West';
  if (clientPhone) clientPhone.textContent = c.hotline || '090547 90592';

  // Update canvas branding with client name
  renderStudioCanvas();
}

// Switch Active Client
function handleClientChange(clientId) {
  const found = state.clients.find(c => c.id === clientId);
  if (found) {
    state.currentClient = found;
    updateClientUI();
    filterAndRenderPosts();
    renderCalendar();
    showToast(`Switched to active client: ${found.name}`);
  }
}

// Load Posts from API
async function loadPosts() {
  try {
    const res = await fetch('/api/posts');
    const data = await res.json();
    if (Array.isArray(data)) {
      state.allPosts = data;
      filterAndRenderPosts();
      renderCalendar();
      updatePlatformCounters();
      populateTargetPosts();
    }
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
}

// Filter and Render Posts in Pipeline Grid
function filterAndRenderPosts() {
  const cid = state.currentClient?.id || 'client_bigbyte';
  
  state.filteredPosts = state.allPosts.filter(p => {
    // Client match
    const matchClient = !p.clientId || p.clientId === cid;
    // Platform match
    const matchPlatform = state.currentPlatform === 'all' || p.platform === state.currentPlatform;
    // Search match
    let matchSearch = true;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      matchSearch = (p.title && p.title.toLowerCase().includes(q)) ||
                    (p.videoHook && p.videoHook.toLowerCase().includes(q)) ||
                    (p.content && p.content.toLowerCase().includes(q));
    }
    return matchClient && matchPlatform && matchSearch;
  });

  renderPostsGrid(state.filteredPosts);
  
  // Update badge count
  const badge = document.getElementById('postCountBadge');
  if (badge) badge.textContent = state.filteredPosts.length;
}

// Render Pipeline Cards Grid
function renderPostsGrid(posts) {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        <h3>No scheduled posts found</h3>
        <p>Switch platform filter or create a new post using the 1-Click Generator.</p>
        <button class="btn btn-primary" onclick="showTab('creator')">+ Create Content</button>
      </div>
    `;
    return;
  }

  container.innerHTML = posts.map(p => {
    const isYt = p.platform === 'youtube';
    const isGmb = p.platform === 'gmb';
    const isFb = p.platform === 'facebook';
    const isIg = p.platform === 'instagram';
    const isLi = p.platform === 'linkedin';

    let platformIcon = '📍';
    let platformLabel = 'Google Business';
    let chipClass = 'chip-gmb';

    if (isYt) { platformIcon = '🎬'; platformLabel = 'YouTube Shorts'; chipClass = 'chip-youtube'; }
    else if (isFb) { platformIcon = '📘'; platformLabel = 'Facebook Pages'; chipClass = 'chip-facebook'; }
    else if (isIg) { platformIcon = '📸'; platformLabel = 'Instagram / Meta'; chipClass = 'chip-instagram'; }
    else if (isLi) { platformIcon = '💼'; platformLabel = 'LinkedIn B2B'; chipClass = 'chip-linkedin'; }

    const isPublished = p.status === 'Published';
    const statusClass = isPublished ? 'status-published' : 'status-scheduled';
    const statusText = isPublished ? '✔ Published' : '📅 Scheduled';

    return `
      <div class="post-card ${isPublished ? 'card-published' : ''}" data-id="${p.id}">
        <div class="post-card-header">
          <div class="platform-badge-group">
            <span class="platform-chip ${chipClass}">${platformIcon} ${platformLabel}</span>
            <span class="status-pill ${statusClass}">${statusText}</span>
          </div>
          <div class="post-date-tag">
            <span>🕒 ${p.date || 'Day ' + (p.day || 1)} • ${p.time || '10:00'}</span>
          </div>
        </div>

        ${p.image ? `
          <div class="card-media-wrapper">
            <img class="post-card-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title || '')}" loading="lazy" onerror="this.src='/assets/reel_fan_cleaning.jpg'">
            <div class="card-media-overlay">
              ${(isYt || isIg) ? `
                <button class="btn-play-reel-overlay" onclick="openReelFromCard('${p.id}', event)">
                  <span>▶</span> Watch 9:16 Reel
                </button>
              ` : `
                <button class="btn-play-reel-overlay" style="background: rgba(59, 130, 246, 0.9);" onclick="openPostModal('${p.id}', event)">
                  <span>👁️</span> View Full Post
                </button>
              `}
            </div>
          </div>
        ` : ''}

        <div class="post-card-body">
          <h3 class="post-title" onclick="openPostModal('${p.id}')">${escapeHtml(p.title || '')}</h3>
          
          ${p.videoHook ? `
            <div class="hook-box">
              <span class="hook-tag">0-3s Hook:</span>
              <p class="hook-text">"${escapeHtml(p.videoHook)}"</p>
            </div>
          ` : ''}

          <p class="post-snippet">${escapeHtml((p.content || '').substring(0, 140))}...</p>
        </div>

        <div class="post-card-footer">
          <div class="action-btn-group">
            <button class="card-btn btn-view" onclick="openPostModal('${p.id}')" title="View Details">
              <span>👁️</span> Details
            </button>
            <button class="card-btn btn-canvas" onclick="loadIntoCanvas('${p.id}')" title="Open in Graphic Studio">
              <span>🎨</span> Graphic
            </button>
            <button class="card-btn btn-publish" onclick="publishPostDirectly('${p.id}')" title="Publish / Dispatch Now">
              <span>⚡</span> ${isPublished ? 'Re-fire' : 'Publish'}
            </button>
            <button class="card-btn btn-del" onclick="deletePost('${p.id}')" title="Delete">
              <span>🗑️</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Update Platform Counter Badges
function updatePlatformCounters() {
  const cid = state.currentClient?.id || 'client_bigbyte';
  const clientPosts = state.allPosts.filter(p => !p.clientId || p.clientId === cid);

  const counts = { all: clientPosts.length, youtube: 0, gmb: 0, facebook: 0, instagram: 0, linkedin: 0 };
  clientPosts.forEach(p => {
    if (counts[p.platform] !== undefined) counts[p.platform]++;
  });

  ['all', 'youtube', 'gmb', 'facebook', 'instagram', 'linkedin'].forEach(k => {
    const el = document.getElementById(`count-${k}`);
    if (el) el.textContent = counts[k];
  });
}

// Filter by Platform
function filterPlatform(platform) {
  state.currentPlatform = platform;
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-platform') === platform);
  });
  filterAndRenderPosts();
  renderCalendar();
}

// Search Posts
function handleSearch(q) {
  state.searchQuery = q.trim();
  filterAndRenderPosts();
}

// Switch between Pipeline and Month Calendar View
function switchView(view) {
  state.currentView = view;
  const btnPipe = document.getElementById('btnViewPipeline');
  const btnCal = document.getElementById('btnViewCalendar');
  const postsBox = document.getElementById('postsContainer');
  const calBox = document.getElementById('calendarViewContainer');

  if (view === 'calendar') {
    btnCal.classList.add('active');
    btnPipe.classList.remove('active');
    postsBox.style.display = 'none';
    calBox.style.display = 'block';
    renderCalendar();
  } else {
    btnPipe.classList.add('active');
    btnCal.classList.remove('active');
    calBox.style.display = 'none';
    postsBox.style.display = 'grid';
  }
}

// Month Calendar Rendering
function renderCalendar() {
  const grid = document.getElementById('calendarGridDays');
  const label = document.getElementById('currentMonthLabel');
  if (!grid || !label) return;

  const d = state.calendarDate;
  const year = d.getFullYear();
  const month = d.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  label.textContent = `${monthNames[month]} ${year}`;

  grid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other-month';
    cell.innerHTML = `<span class="cal-day-num">${daysInPrevMonth - i}</span>`;
    grid.appendChild(cell);
  }

  // Current month days
  const today = new Date();
  const cid = state.currentClient?.id || 'client_bigbyte';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'cal-day';

    if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) {
      cell.classList.add('today');
    }

    // Find posts on this date
    const dayPosts = state.allPosts.filter(p => {
      const matchClient = !p.clientId || p.clientId === cid;
      const matchPlatform = state.currentPlatform === 'all' || p.platform === state.currentPlatform;
      return matchClient && matchPlatform && p.date === dateStr;
    });

    let chipsHtml = '';
    if (dayPosts.length > 0) {
      chipsHtml = dayPosts.map(p => {
        let chipClass = 'chip-gmb';
        if (p.platform === 'youtube') chipClass = 'chip-youtube';
        else if (p.platform === 'instagram') chipClass = 'chip-instagram';
        else if (p.platform === 'linkedin') chipClass = 'chip-linkedin';

        return `<div class="cal-chip ${chipClass}" onclick="openPostModal('${p.id}')" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</div>`;
      }).join('');
    }

    cell.innerHTML = `
      <span class="cal-day-num">${day}</span>
      <div class="cal-day-events">${chipsHtml}</div>
    `;
    grid.appendChild(cell);
  }
}

// Navigate Calendar Months
function changeMonth(delta) {
  state.calendarDate.setMonth(state.calendarDate.getMonth() + delta);
  renderCalendar();
}

// Apply 1-Click Topic Preset
function applyTopicPreset(presetKey) {
  const p = TOPIC_PRESETS[presetKey];
  if (!p) return;

  const platformSelect = document.getElementById('newPlatform');
  const titleInput = document.getElementById('newTitle');
  const hookInput = document.getElementById('newVideoHook');
  const scriptInput = document.getElementById('newScript');
  const contentInput = document.getElementById('newContent');

  if (platformSelect) {
    platformSelect.value = p.platform;
    handlePlatformChange(p.platform);
  }
  if (titleInput) titleInput.value = p.title;
  if (hookInput) hookInput.value = p.hook || '';
  if (scriptInput) scriptInput.value = p.script || '';
  if (contentInput) contentInput.value = p.content;

  // Sync with Canvas
  state.canvasHeadline = p.title;
  state.canvasHook = p.hook || '';
  renderStudioCanvas();

  showToast(`Applied preset: ${p.title}`);
}

// Handle Platform Change in Creator
function handlePlatformChange(val) {
  const shortsBox = document.getElementById('shortsSpecificFields');
  if (shortsBox) {
    shortsBox.style.display = (val === 'youtube' || val === 'instagram') ? 'block' : 'none';
  }
}

// Auto-Generate AI Content
function generateInstantAIContent() {
  const title = document.getElementById('newTitle').value.trim();
  const platform = document.getElementById('newPlatform').value;
  const clientName = state.currentClient?.name || 'Big Byte Systems';
  const phone = state.currentClient?.hotline || '090547 90592';

  if (!title) {
    showToast('Please type a Post / Video Title first');
    return;
  }

  const hook = `Wait! Before you pay for an expensive replacement, here is what is ACTUALLY happening with your device.`;
  const script = `Most service centers don't bother diagnosing individual components. At ${clientName}, our laboratory isolates the exact faulty rail or component so you save money and retain your data.`;
  const aeoCapsule = `\n\n💡 AI Quick-Answer Capsule:\nQ: ${title}\nA: At ${clientName} (${state.currentClient?.address || 'Shop 1, Khewra Cir, Manpada, Thane West'}), technicians perform component-level diagnostic triage to resolve the issue with 90-day warranty.`;

  let content = '';
  if (platform === 'gmb') {
    content = `${title}\n\nTransparent diagnostics and component-level repairs in Thane.\n\n📍 Located at Shop No 1, Building 1, Khewra Cir Marg, Manpada, Thane West.\n\nTap the "Call now" button below to consult directly with our laboratory technicians.`;
  } else if (platform === 'instagram') {
    content = `${title}\n\nTransparent diagnostics and component-level repairs in Thane.${aeoCapsule}\n\n📍 ${clientName} — Shop 1, Khewra Cir Marg, Near D-Mart, Manpada, Thane West.\n📞 Voice Support: ${phone}\n💬 WhatsApp / Triage: Tap Link in Bio (@bigbytessystem)\n\n#TechTips #Diagnostics #LaptopRepairThane #ThaneWest #HardwareService #Manpada`;
  } else {
    content = `${title}\n\nTransparent diagnostics and component-level repairs in Thane.${aeoCapsule}\n\n📍 ${clientName} — Manpada, Thane West.\n📞 Hotline: ${phone}\n💬 Direct WhatsApp: https://wa.me/919167463807\n\n#TechTips #Diagnostics #ThaneWest #HardwareService`;
  }

  const hookInput = document.getElementById('newVideoHook');
  const scriptInput = document.getElementById('newScript');
  const contentInput = document.getElementById('newContent');

  if (hookInput) hookInput.value = hook;
  if (scriptInput) scriptInput.value = script;
  if (contentInput) contentInput.value = content;

  state.canvasHeadline = title;
  state.canvasHook = hook;
  renderStudioCanvas();

  showToast('Generated high-retention hook & compliant description!');
}

// Create & Schedule Post
async function handleCreatePost(e) {
  e.preventDefault();

  const newPost = {
    id: `post_${Date.now()}`,
    clientId: state.currentClient?.id || 'client_bigbyte',
    clientName: state.currentClient?.name || 'Big Byte Systems',
    platform: document.getElementById('newPlatform').value,
    date: document.getElementById('newDate').value,
    time: document.getElementById('newTime').value,
    title: document.getElementById('newTitle').value.trim(),
    videoHook: document.getElementById('newVideoHook')?.value.trim() || '',
    script: document.getElementById('newScript')?.value.trim() || '',
    content: document.getElementById('newContent').value.trim(),
    status: 'Scheduled',
    image: 'https://bigbytesystems.co.in/assets/hero.jpg'
  };

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
    const result = await res.json();
    if (result.success) {
      state.allPosts.unshift(newPost);
      filterAndRenderPosts();
      renderCalendar();
      updatePlatformCounters();
      showToast('Post successfully scheduled!');
      showTab('calendar');
    }
  } catch (err) {
    showToast('Failed to save post: ' + err.message);
  }
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// LIVE LABORATORY INFOGRAPHIC & REEL CANVAS STUDIO (HIGH CONVERTING)
// -------------------------------------------------------------
const INFOGRAPHIC_ASSETS = {
  macbook: '/assets/reel_macbook_soldering.jpg',
  fan: '/assets/reel_fan_cleaning.jpg',
  printer: '/assets/reel_printer_repair.jpg',
  data: '/assets/reel_data_recovery.jpg'
};
const bgImgCache = {};

function loadBgImage(src, callback) {
  if (!src) return callback(null);
  if (bgImgCache[src] && bgImgCache[src].complete) return callback(bgImgCache[src]);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => { bgImgCache[src] = img; callback(img); };
  img.onerror = () => callback(null);
  img.src = src;
}

function initCanvas() {
  const canvas = document.getElementById('studioCanvas');
  if (!canvas) return;
  updateCanvasFormat('square');
  populateTargetPosts();
}

function populateTargetPosts() {
  const sel = document.getElementById('targetPostForGraphic');
  if (!sel) return;
  const currentVal = sel.value;
  sel.innerHTML = '';
  (state.allPosts || []).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `[${(p.platform || 'post').toUpperCase()}] ${p.title.substring(0, 48)}...`;
    sel.appendChild(opt);
  });
  if (currentVal) sel.value = currentVal;
}

function updateCanvasFormat(fmt) {
  state.canvasFormat = fmt;
  const canvas = document.getElementById('studioCanvas');
  if (!canvas) return;

  if (fmt === 'reel') {
    canvas.width = 1080;
    canvas.height = 1920;
  } else if (fmt === 'square') {
    canvas.width = 1080;
    canvas.height = 1080;
  } else if (fmt === 'banner') {
    canvas.width = 1200;
    canvas.height = 675;
  }

  renderStudioCanvas();
}

function syncTitleToCanvas(val) {
  state.canvasHeadline = val || '🔥 Dead MacBook Pro Saved! No Board Replacement Needed';
  const customTitleInput = document.getElementById('canvasCustomTitle');
  if (customTitleInput) customTitleInput.value = state.canvasHeadline;
  renderStudioCanvas();
}

function syncHookToCanvas(val) {
  state.canvasHook = val || 'Client was told to replace entire logic board. Watch what was actually wrong.';
  renderStudioCanvas();
}

function renderStudioCanvas() {
  const canvas = document.getElementById('studioCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const template = document.getElementById('canvasTemplate')?.value || 'diagnostic';
  const bgPhotoKey = document.getElementById('canvasBgPhoto')?.value || 'macbook';
  const theme = document.getElementById('canvasTheme')?.value || 'cyber';
  const customTitle = document.getElementById('canvasCustomTitle')?.value || state.canvasHeadline || '🔥 Dead MacBook Pro Saved! No Board Replacement Needed';

  const client = state.currentClient || {
    name: 'Big Byte Systems',
    hotline: '090547 90592',
    address: 'Shop 1, Bldg 1, Khewra Cir, Manpada, Thane West 400607'
  };

  const bgUrl = INFOGRAPHIC_ASSETS[bgPhotoKey] || null;

  loadBgImage(bgUrl, (bgImg) => {
    // 1. Draw Background
    ctx.clearRect(0, 0, w, h);

    if (bgImg) {
      // Draw photo with cover aspect ratio
      const scale = Math.max(w / bgImg.width, h / bgImg.height);
      const nw = bgImg.width * scale;
      const nh = bgImg.height * scale;
      const ox = (w - nw) / 2;
      const oy = (h - nh) / 2;
      ctx.drawImage(bgImg, ox, oy, nw, nh);

      // Deep dark overlay to ensure maximum contrast and readability
      const scrim = ctx.createLinearGradient(0, 0, 0, h);
      scrim.addColorStop(0, 'rgba(6, 10, 20, 0.88)');
      scrim.addColorStop(0.5, 'rgba(11, 19, 43, 0.92)');
      scrim.addColorStop(1, 'rgba(2, 6, 15, 0.96)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, w, h);
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#060913');
      grad.addColorStop(0.5, '#0b1329');
      grad.addColorStop(1, '#021024');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Subtle Cyber Grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 2. Top Header Brand Bar
    const pad = 48;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, pad, pad, w - pad * 2, 76, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(client.name.toUpperCase(), pad + 24, pad + 48);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('⚡ CHIP-LEVEL HARDWARE CLINIC', w - pad - 340, pad + 47);

    // 3. Render Selected Template Layout
    if (template === 'diagnostic') {
      renderDiagnosticSplitTemplate(ctx, w, h, pad, customTitle, client);
    } else if (template === 'anatomy') {
      renderAnatomyTemplate(ctx, w, h, pad, customTitle, client);
    } else if (template === 'authority') {
      renderAuthorityTemplate(ctx, w, h, pad, customTitle, client);
    } else if (template === 'alert') {
      renderAlertTemplate(ctx, w, h, pad, customTitle, client);
    } else {
      renderClassicTemplate(ctx, w, h, pad, customTitle, client);
    }

    // 4. Bottom Footer Contact Bar
    const footerH = 88;
    const footerY = h - pad - footerH;
    ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, pad, footerY, w - pad * 2, footerH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`📞 Hotline: ${client.hotline || '090547 90592'}   |   💬 WhatsApp Lab Triage`, pad + 28, footerY + 38);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`📍 ${client.address || 'Manpada, Thane West 400607'}`, pad + 28, footerY + 68);
  });
}

// TEMPLATE 1: BEFORE/AFTER DIAGNOSTIC SPLIT (AUTHORIZED VS BIG BYTE LAB)
function renderDiagnosticSplitTemplate(ctx, w, h, pad, title, client) {
  // Main Headline
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, title, pad, pad + 140, w - pad * 2, 50);

  // Subtitle / Hook Pill
  const hookY = pad + 240;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, pad, hookY, w - pad * 2, 54, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('🎯 REAL TRIAGE OUTCOME: NEVER SWAP A LOGIC BOARD FOR A SHORTED CAPACITOR', pad + 20, hookY + 34);

  // Split Comparison Columns
  const splitY = hookY + 80;
  const splitH = h - splitY - 180;
  const cardW = (w - pad * 2 - 28) / 2;

  // Left Card: Authorised Service Center (Red Alert)
  const leftX = pad;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, leftX, splitY, cardW, splitH, 18);
  ctx.fill();
  ctx.stroke();

  // Left Header Pill
  ctx.fillStyle = '#ef4444';
  drawRoundedRect(ctx, leftX + 20, splitY + 20, cardW - 40, 44, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('❌ AUTHORISED SERVICE CENTER', leftX + 36, splitY + 48);

  const leftBullets = [
    '• Diagnosis: Full Motherboard Replacement',
    '• Quoted Cost: ₹42,000 to ₹55,000+',
    '• Waiting Time: 15 to 25 Business Days',
    '• Customer Data: 100% Wiped / Factory Reset',
    '• Zero Chip-Level Diagnostics Done'
  ];
  ctx.fillStyle = '#fca5a5';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  leftBullets.forEach((b, idx) => {
    ctx.fillText(b, leftX + 28, splitY + 110 + (idx * 52));
  });

  // Right Card: Big Byte Systems Lab (Emerald Victory)
  const rightX = pad + cardW + 28;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, rightX, splitY, cardW, splitH, 18);
  ctx.fill();
  ctx.stroke();

  // Right Header Pill
  ctx.fillStyle = '#10b981';
  drawRoundedRect(ctx, rightX + 20, splitY + 20, cardW - 40, 44, 8);
  ctx.fill();
  ctx.fillStyle = '#06261c';
  ctx.font = '900 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('✅ BIG BYTE SYSTEMS LAB (THANE)', rightX + 36, splitY + 48);

  const rightBullets = [
    '• Diagnosis: Single 0402 Capacitor Isolated',
    '• Actual Cost: ~₹3,500 (Saved ₹40,000+)',
    '• Turnaround: Same-Day / 24-Hr Express',
    '• Customer Data: 100% Intact & Untouched',
    '• Trinocular Micro-Soldering + Warranty'
  ];
  ctx.fillStyle = '#86efac';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  rightBullets.forEach((b, idx) => {
    ctx.fillText(b, rightX + 28, splitY + 110 + (idx * 52));
  });

  // Trust Seal Banner below split
  const sealY = splitY + splitH + 20;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, pad, sealY, w - pad * 2, 50, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 16px "JetBrains Mono", monospace';
  ctx.fillText('★ 4.9 GOOGLE RATING (1,240+ THANE REVIEWS) • 90-DAY LAB WARRANTY • ESD CLEANROOM', pad + 30, sealY + 32);
}

// TEMPLATE 2: MOTHERBOARD ANATOMY & SCHEMATIC CALLOUTS
function renderAnatomyTemplate(ctx, w, h, pad, title, client) {
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 18px "JetBrains Mono", monospace';
  ctx.fillText('🔬 HARDWARE SCHEMATIC & COMPONENT ANATOMY', pad, pad + 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, title, pad, pad + 175, w - pad * 2, 50);

  // 4 Schematic Point Boxes
  const points = [
    { title: '19.5V PPBUS_G3H MAIN POWER RAIL', desc: 'Dead short to ground detected (0.02Ω) pulling down all charging rails.', tag: 'CRITICAL FAULT' },
    { title: 'TRINOCULAR MICROSCOPE ISOLATION', desc: 'Single 0402 ceramic capacitor located with micro-thermal imaging chamber.', tag: 'DIAGNOSED' },
    { title: 'PRECISION MICRO-SOLDERING', desc: 'Desoldered at 380°C, clean ultrasonic pad restoration, factory joint leaded replacement.', tag: 'RESTORED' },
    { title: 'BENCH POWER DRAW: 1.45A NORMAL', desc: 'Full Apple chime sounds, screen illuminates, zero customer data touched.', tag: 'VERIFIED' }
  ];

  const startY = pad + 280;
  const boxH = 110;
  points.forEach((pt, idx) => {
    const y = startY + (idx * (boxH + 16));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, pad, y, w - pad * 2, boxH, 14);
    ctx.fill();
    ctx.stroke();

    // Neon indicator pip
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pad + 32, y + 36, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(pt.title, pad + 56, y + 42);

    // Tag
    ctx.fillStyle = '#0284c7';
    drawRoundedRect(ctx, w - pad - 180, y + 20, 150, 32, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillText(pt.tag, w - pad - 165, y + 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(pt.desc, pad + 56, y + 80);
  });
}

// TEMPLATE 3: AUTHORITY PROOF (4.9 STARS & 4 IRONCLAD GUARANTEES)
function renderAuthorityTemplate(ctx, w, h, pad, title, client) {
  // Giant Star Rating Badge
  const starY = pad + 120;
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('★★★★★ 4.9 / 5.0', pad, starY + 40);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 18px "JetBrains Mono", monospace';
  ctx.fillText('1,240+ VERIFIED THANE & MUMBAI GOOGLE REVIEWS', pad + 400, starY + 35);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, title, pad, starY + 110, w - pad * 2, 48);

  // 4 Ironclad Guarantee Grid
  const gridY = starY + 220;
  const colW = (w - pad * 2 - 24) / 2;
  const rowH = 150;

  const guarantees = [
    { icon: '🔒', title: '100% DATA PRIVACY GUARANTEE', desc: 'Your drives are kept locked. Zero OS wiping. Your personal memories and files remain untouched.' },
    { icon: '⚡', title: 'EXPRESS 60-MIN TRIAGE', desc: 'Ammeter & thermal diagnosis within 1 hour. Know the exact faulty micro-part before deciding.' },
    { icon: '🏷️', title: 'ZERO HIDDEN FEES', desc: 'Transparent component-level estimates. You only pay for what is actually replaced.' },
    { icon: '🛡️', title: '90-DAY LAB WARRANTY', desc: 'All chip-level soldering and component servicing covered by our unconditional laboratory guarantee.' }
  ];

  guarantees.forEach((g, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const gx = pad + col * (colW + 24);
    const gy = gridY + row * (rowH + 20);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, gx, gy, colW, rowH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = '32px sans-serif';
    ctx.fillText(g.icon, gx + 20, gy + 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(g.title, gx + 64, gy + 45);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    wrapText(ctx, g.desc, gx + 20, gy + 85, colW - 40, 22);
  });
}

// TEMPLATE 4: PREVENTIVE ALERT (COASTAL THANE HUMIDITY & DUST)
function renderAlertTemplate(ctx, w, h, pad, title, client) {
  // Caution Banner Header
  const alertBarY = pad + 110;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, pad, alertBarY, w - pad * 2, 60, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 20px "JetBrains Mono", monospace';
  ctx.fillText('⚠️ CRITICAL PREVENTIVE ALERT • COASTAL THANE WEST', pad + 24, alertBarY + 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, title, pad, alertBarY + 125, w - pad * 2, 50);

  // Big Central Callout Card
  const calloutY = alertBarY + 235;
  const calloutH = 340;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, pad, calloutY, w - pad * 2, calloutH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fca5a5';
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🛑 WHAT COASTAL SALT-AIR DOES TO YOUR LAPTOP:', pad + 32, calloutY + 54);

  const warnings = [
    '1. Ghodbunder & Majiwada humidity blends with dust into an airtight airflow block.',
    '2. Factory thermal paste hardens into dry brittle chalk within 14 months.',
    '3. CPU temps spike to 98°C causing motherboard warping and micro-crack solder fatigue.',
    '4. A 30-minute ultrasonic heatsink cleaning + Arctic MX-4 repaste drops temps by 30°C factory quiet!'
  ];

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  warnings.forEach((wLine, idx) => {
    wrapText(ctx, wLine, pad + 32, calloutY + 110 + (idx * 56), w - pad * 2 - 64, 26);
  });
}

// TEMPLATE 5: CLASSIC TECH CARD
function renderClassicTemplate(ctx, w, h, pad, title, client) {
  const cardY = h * 0.22;
  const cardH = h * 0.52;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, pad, cardY, w - pad * 2, cardH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 16px "JetBrains Mono", monospace';
  ctx.fillText('⚡ HARDWARE DIAGNOSTIC REPORT', pad + 32, cardY + 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, title, pad + 32, cardY + 115, w - pad * 2 - 64, 48);

  if (state.canvasHook) {
    const hookBoxY = cardY + cardH - 150;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, pad + 24, hookBoxY, w - pad * 2 - 48, 110, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 14px "JetBrains Mono", monospace';
    ctx.fillText('0-3s VIDEO HOOK / HIGH-RETENTION REVELATION:', pad + 40, hookBoxY + 34);

    ctx.fillStyle = '#fef3c7';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    wrapText(ctx, `"${state.canvasHook}"`, pad + 40, hookBoxY + 68, w - pad * 2 - 80, 26);
  }
}

// Download High-Res PNG
function downloadCanvasGraphic() {
  const canvas = document.getElementById('studioCanvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `bigbyte_infographic_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('📥 Ultra-sharp 1080p infographic PNG downloaded!');
}

// Attach Graphic to Selected Scheduled Post & Sync Directly to Server
async function attachGraphicAndSchedule() {
  const canvas = document.getElementById('studioCanvas');
  if (!canvas) return;
  const sel = document.getElementById('targetPostForGraphic');
  const postId = sel ? sel.value : null;

  const imageBase64 = canvas.toDataURL('image/png');
  showToast('💾 Saving infographic and attaching to post...');

  try {
    const res = await fetch('/api/posts/save-graphic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, imageBase64 })
    });
    const data = await res.json();
    if (data.success) {
      showToast('🎉 Infographic attached! Ready for direct Meta publishing with exact graphic.');
      await loadPosts();
    } else {
      showToast('Error saving graphic: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    showToast('Failed to attach graphic: ' + err.message);
  }
}

// Load Post into Canvas
function loadIntoCanvas(postId) {
  const p = state.allPosts.find(x => String(x.id) === String(postId));
  if (p) {
    state.canvasHeadline = p.title || '';
    state.canvasHook = p.videoHook || '';
    const customTitleInput = document.getElementById('canvasCustomTitle');
    if (customTitleInput) customTitleInput.value = p.title || '';
    const sel = document.getElementById('targetPostForGraphic');
    if (sel) sel.value = String(p.id);
    showTab('creator');
    renderStudioCanvas();
    showToast(`Loaded "${p.title.substring(0, 32)}..." into Infographic Studio`);
  }
}

// Helper Canvas Rounded Rect
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper Canvas Text Wrapping
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return;
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// -------------------------------------------------------------
// POST DETAILS MODAL
// -------------------------------------------------------------
function openPostModal(postId) {
  const p = state.allPosts.find(x => String(x.id) === String(postId));
  if (!p) return;

  state.activeModalPost = p;
  const modal = document.getElementById('postModal');
  if (!modal) return;

  document.getElementById('modalPostPlatform').textContent = (p.platform || 'post').toUpperCase();
  document.getElementById('modalPostTitle').textContent = p.title || 'Untitled Post';
  document.getElementById('modalPostDate').textContent = `${p.date || 'Day ' + (p.day || 1)} at ${p.time || '10:00'}`;
  
  const statusEl = document.getElementById('modalPostStatus');
  statusEl.textContent = p.status || 'Scheduled';
  statusEl.className = `status-chip ${p.status === 'Published' ? 'status-published' : 'status-scheduled'}`;

  // Video Hook
  const hookSection = document.getElementById('modalHookSection');
  if (p.videoHook) {
    hookSection.style.display = 'block';
    document.getElementById('modalPostHook').textContent = `"${p.videoHook}"`;
  } else {
    hookSection.style.display = 'none';
  }

  // Storyboard
  const sbSection = document.getElementById('modalStoryboardSection');
  const sbList = document.getElementById('modalPostStoryboard');
  if (Array.isArray(p.visualStoryboard) && p.visualStoryboard.length > 0) {
    sbSection.style.display = 'block';
    sbList.innerHTML = p.visualStoryboard.map(s => {
      return `<div class="storyboard-item">${escapeHtml(s)}</div>`;
    }).join('');
  } else {
    sbSection.style.display = 'none';
  }

  // Script
  const scSection = document.getElementById('modalScriptSection');
  if (p.script) {
    scSection.style.display = 'block';
    document.getElementById('modalPostScript').textContent = p.script;
  } else {
    scSection.style.display = 'none';
  }

  // Content / Caption
  document.getElementById('modalPostContent').textContent = p.content || '';

  modal.style.display = 'flex';
}

function closePostModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-close')) return;
  const modal = document.getElementById('postModal');
  if (modal) modal.style.display = 'none';
}

async function publishModalPost() {
  if (!state.activeModalPost) return;
  await publishPostDirectly(state.activeModalPost.id);
  closePostModal();
}

// 1-Click Instant Webhook Dispatch
async function publishPostDirectly(postId) {
  const p = state.allPosts.find(x => String(x.id) === String(postId));
  if (!p) return;

  showToast(`Dispatching "${p.title}" via Native Engine...`);

  try {
    const res = await fetch('/api/publish-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    const result = await res.json();
    if (result.success) {
      p.status = 'Published';
      filterAndRenderPosts();
      renderCalendar();
      showToast('✔ Dispatched successfully! Post published live on channel.');
    } else {
      showToast('❌ Publish failed: ' + (result.error || result.message || 'Check platform credentials'));
    }
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

// Delete Post
async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this scheduled post?')) return;

  try {
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      state.allPosts = state.allPosts.filter(p => String(p.id) !== String(postId));
      filterAndRenderPosts();
      renderCalendar();
      updatePlatformCounters();
      showToast('Post deleted');
    }
  } catch (err) {
    showToast('Failed to delete: ' + err.message);
  }
}

// -------------------------------------------------------------
// WEBHOOK SETTINGS & TEST MODAL
// -------------------------------------------------------------
async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    if (data.webhookUrl) {
      const input = document.getElementById('settingsWebhookUrl');
      if (input) input.value = data.webhookUrl;
    }
    if (data.facebookPageId) {
      const fbPageInput = document.getElementById('directFbPageId');
      if (fbPageInput) fbPageInput.value = data.facebookPageId;
    }
    if (data.instagramAccountId) {
      const igInput = document.getElementById('directIgAccountId');
      if (igInput) igInput.value = data.instagramAccountId;
    }
    if (data.facebookPageAccessToken) {
      const fbTokenInput = document.getElementById('directFbToken');
      if (fbTokenInput) fbTokenInput.value = data.facebookPageAccessToken;
    }
    const badge = document.getElementById('directApiStatusBadge');
    if (badge) {
      if (data.facebookPageId && data.facebookPageAccessToken) {
        badge.textContent = '🟢 Direct Meta API: Connected & Active';
        badge.className = 'compliance-pill pass';
      } else {
        badge.textContent = '⚪ Direct Meta API: Enter Credentials';
        badge.className = 'compliance-pill';
      }
    }

    // YouTube Status & Inputs
    if (data.youtubeClientId) {
      const ytIdEl = document.getElementById('ytClientId');
      if (ytIdEl) ytIdEl.value = data.youtubeClientId;
    }
    if (data.youtubeClientSecret) {
      const ytSecEl = document.getElementById('ytClientSecret');
      if (ytSecEl) ytSecEl.value = data.youtubeClientSecret;
    }
    if (data.youtubeRefreshToken) {
      const ytRefEl = document.getElementById('ytRefreshToken');
      if (ytRefEl) ytRefEl.value = data.youtubeRefreshToken;
    }
    const ytBadge = document.getElementById('ytDirectStatusBadge');
    const ytBanner = document.getElementById('ytConnectedBanner');
    if (ytBadge) {
      if (data.youtubeRefreshToken) {
        ytBadge.textContent = '🟢 YouTube: Connected & Active';
        ytBadge.className = 'compliance-pill pass';
        if (ytBanner) {
          ytBanner.style.display = 'block';
          const nameEl = document.getElementById('ytChannelNameDisplay');
          const idEl = document.getElementById('ytChannelIdDisplay');
          if (nameEl) nameEl.textContent = data.youtubeChannelTitle || 'Big Byte Systems';
          if (idEl) idEl.textContent = data.youtubeChannelId || 'Connected';
        }
      } else {
        ytBadge.textContent = '⚪ YouTube: Not Connected';
        ytBadge.className = 'compliance-pill';
        if (ytBanner) ytBanner.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Failed to load config:', err);
  }
}

async function saveDirectApiConfig() {
  const pageId = document.getElementById('directFbPageId').value.trim();
  const igAccountId = document.getElementById('directIgAccountId').value.trim();
  const token = document.getElementById('directFbToken').value.trim();

  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facebookPageId: pageId,
        instagramAccountId: igAccountId,
        facebookPageAccessToken: token,
        directApiEnabled: true
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast('✅ Direct Meta & Instagram credentials saved! Zero middleware active.');
      loadConfig();
    }
  } catch (err) {
    showToast('Failed to save Direct API config: ' + err.message);
  }
}

async function testDirectMetaGraphApi() {
  const pageId = document.getElementById('directFbPageId').value.trim();
  const token = document.getElementById('directFbToken').value.trim();

  if (!pageId || !token) {
    showToast('Please enter both Facebook Page ID and Page Access Token');
    return;
  }

  showToast('⚡ Connecting directly to Meta Graph API v19.0...');

  try {
    const res = await fetch('/api/platforms/test-direct-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, pageAccessToken: token })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`🎉 Verified! Post live on Facebook Page! Post ID: ${data.postId || data.id}`);
      loadConfig();
    } else {
      showToast(`❌ Meta API returned: ${data.error || 'Token invalid'}`);
    }
  } catch (err) {
    showToast('Direct test error: ' + err.message);
  }
}

async function testDirectInstagramApi() {
  const igAccountId = document.getElementById('directIgAccountId').value.trim();
  const token = document.getElementById('directFbToken').value.trim();

  if (!igAccountId || !token) {
    showToast('Please enter both Instagram Account ID and Access Token');
    return;
  }

  showToast('📸 Connecting directly to Instagram Media API v19.0...');

  try {
    const res = await fetch('/api/platforms/test-direct-instagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instagramAccountId: igAccountId, pageAccessToken: token })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`🎉 Verified! Published live on Instagram feed! Media ID: ${data.id}`);
      loadConfig();
    } else {
      showToast(`❌ Instagram API returned: ${data.error || 'Token invalid'}`);
    }
  } catch (err) {
    showToast('Instagram test error: ' + err.message);
  }
}

async function autoDiscoverMetaChannels() {
  const tokenInput = document.getElementById('metaDiscoveryToken');
  const resultsDiv = document.getElementById('metaDiscoveryResults');
  const token = tokenInput ? tokenInput.value.trim() : '';

  if (!token) {
    showToast('Please paste a Meta access token to auto-detect channels.');
    return;
  }

  showToast('🔍 Querying Meta Graph API for your Pages & Instagram...');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = '<span style="color: #38bdf8;">⏳ Contacting Meta Graph API v19.0...</span>';

  try {
    const res = await fetch('/api/platforms/discover-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();

    if (!data.success || !data.pages || data.pages.length === 0) {
      resultsDiv.innerHTML = `<span style="color: #f87171;">❌ ${data.error || 'No pages found for this token.'}</span>`;
      return;
    }

    let html = `<div style="font-weight: 700; color: #34d399; margin-bottom: 8px;">✅ Detected ${data.pages.length} Connected Account(s):</div>`;
    data.pages.forEach((p, idx) => {
      html += `
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <strong style="color: #fff; font-size: 13px;">${p.pageName || 'Facebook Page'}</strong>
            <div style="color: var(--text-muted); font-size: 11px;">
              Page ID: <code>${p.pageId}</code> 
              ${p.instagramAccountId ? `• Instagram: <b>@${p.instagramUsername || p.instagramAccountId}</b> (ID: <code>${p.instagramAccountId}</code>)` : '• <i>No linked Instagram business account</i>'}
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-primary" onclick="applyDiscoveredMeta(${idx})" style="background: #10b981; border: none; font-size: 11px; padding: 6px 12px;">
            ✔ Use This Channel
          </button>
        </div>
      `;
    });

    resultsDiv.innerHTML = html;
    window._discoveredMetaPages = data.pages;
    showToast(`✅ Discovered ${data.pages.length} Meta Page(s)!`);

  } catch (err) {
    resultsDiv.innerHTML = `<span style="color: #f87171;">❌ Auto-detection failed: ${err.message}</span>`;
    showToast('Auto-detection error: ' + err.message);
  }
}

window.applyDiscoveredMeta = function(idx) {
  if (!window._discoveredMetaPages || !window._discoveredMetaPages[idx]) return;
  const p = window._discoveredMetaPages[idx];

  const fbPageInput = document.getElementById('directFbPageId');
  const igInput = document.getElementById('directIgAccountId');
  const tokenInput = document.getElementById('directFbToken');

  if (fbPageInput) fbPageInput.value = p.pageId;
  if (igInput && p.instagramAccountId) igInput.value = p.instagramAccountId;
  if (tokenInput && p.pageAccessToken) tokenInput.value = p.pageAccessToken;

  saveDirectApiConfig();
  showToast(`🎉 Connected to "${p.pageName}" and auto-saved!`);
};

async function saveYouTubeConfig() {
  const clientId = document.getElementById('ytClientId')?.value.trim() || '';
  const clientSecret = document.getElementById('ytClientSecret')?.value.trim() || '';
  const refreshToken = document.getElementById('ytRefreshToken')?.value.trim() || '';

  try {
    const res = await fetch('/api/platforms/save-youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtubeClientId: clientId,
        youtubeClientSecret: clientSecret,
        youtubeRefreshToken: refreshToken
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast('💾 YouTube OAuth keys saved successfully!');
      loadConfig();
    }
  } catch (err) {
    showToast('Failed to save YouTube keys: ' + err.message);
  }
}

async function connectYouTubeChannel() {
  const clientId = document.getElementById('ytClientId')?.value.trim() || '';
  const clientSecret = document.getElementById('ytClientSecret')?.value.trim() || '';

  if (!clientId || !clientSecret) {
    showToast('Please enter both Google OAuth Client ID and Secret first.');
    return;
  }

  // Save keys first
  await fetch('/api/platforms/save-youtube', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ youtubeClientId: clientId, youtubeClientSecret: clientSecret })
  });

  showToast('🔗 Initiating Google OAuth authorization...');

  try {
    const res = await fetch('/api/platforms/youtube-auth-url');
    const data = await res.json();
    if (data.success && data.authUrl) {
      window.location.href = data.authUrl;
    } else {
      showToast('OAuth Error: ' + (data.error || 'Failed to generate auth URL'));
    }
  } catch (err) {
    showToast('Network error: ' + err.message);
  }
}

async function testDirectYouTubeApi() {
  showToast('⚡ Connecting directly to YouTube Data API v3...');
  try {
    const res = await fetch('/api/platforms/test-direct-youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.success && data.channel) {
      showToast(`🎉 Verified! Connected to "${data.channel.title}" (${data.channel.subscriberCount || 0} subs, ${data.channel.videoCount || 0} videos)`);
      loadConfig();
    } else {
      showToast('❌ YouTube API: ' + (data.error || 'Not connected'));
    }
  } catch (err) {
    showToast('YouTube verification error: ' + err.message);
  }
}

async function saveWebhookSettings() {
  const url = document.getElementById('settingsWebhookUrl').value.trim();
  if (!url) {
    showToast('Please enter a valid webhook URL');
    return;
  }

  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: url })
    });
    const result = await res.json();
    if (result.success) {
      showToast('Webhook target URL updated!');
    }
  } catch (err) {
    showToast('Failed to update config: ' + err.message);
  }
}

function openTestModal() {
  const modal = document.getElementById('testModal');
  const preview = document.getElementById('modalTestPayload');
  if (!modal || !preview) return;

  const headline = '⚡ Multi-Platform Webhook Test (GMB + Facebook + Socials)';
  const bodyText = `Live connectivity verification from Big Byte Systems Diagnostic Studio.\n📍 Shop 1, Khewra Cir Marg, Manpada, Thane West.\n📞 Hotline: ${state.currentClient?.hotline || '090547 90592'}\n💬 WhatsApp: https://wa.me/919167463807`;
  const fullText = `${headline}\n\n${bodyText}`;

  const testPayload = {
    test: true,
    clientId: state.currentClient?.id || 'client_bigbyte',
    clientName: state.currentClient?.name || 'Big Byte Systems',
    platform: 'facebook',
    title: headline,
    content: bodyText,
    description: fullText,
    caption: fullText,
    message: fullText,
    text: fullText,
    mediaUrl: 'https://bigbytesystems.co.in/assets/blog_macbook_repair.jpg',
    photoUrl: 'https://bigbytesystems.co.in/assets/blog_macbook_repair.jpg',
    publishedAt: new Date().toISOString()
  };

  preview.textContent = JSON.stringify(testPayload, null, 2);
  modal.style.display = 'flex';
}

function closeTestModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-close')) return;
  const modal = document.getElementById('testModal');
  if (modal) modal.style.display = 'none';
}

async function executeTestDispatch() {
  const btn = document.getElementById('btnFireTest');
  if (btn) btn.textContent = 'Sending...';

  const headline = '⚡ Multi-Platform Webhook Test (GMB + Facebook + Socials)';
  const bodyText = `Live connectivity verification from Big Byte Systems Diagnostic Studio.\n📍 Shop 1, Khewra Cir Marg, Manpada, Thane West.\n📞 Hotline: ${state.currentClient?.hotline || '090547 90592'}\n💬 WhatsApp: https://wa.me/919167463807`;
  const fullText = `${headline}\n\n${bodyText}`;

  const testPayload = {
    test: true,
    clientId: state.currentClient?.id || 'client_bigbyte',
    clientName: state.currentClient?.name || 'Big Byte Systems',
    platform: 'facebook',
    title: headline,
    content: bodyText,
    description: fullText,
    caption: fullText,
    message: fullText,
    text: fullText,
    mediaUrl: 'https://bigbytesystems.co.in/assets/blog_macbook_repair.jpg',
    photoUrl: 'https://bigbytesystems.co.in/assets/blog_macbook_repair.jpg',
    publishedAt: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/publish-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    const result = await res.json();
    if (result.success) {
      showToast('✔ Test payload successfully delivered to Make.com!');
      closeTestModal();
    } else {
      showToast('❌ Webhook test failed. Check Make.com scenario.');
    }
  } catch (err) {
    showToast('Error: ' + err.message);
  } finally {
    if (btn) btn.textContent = 'Fire Test Now';
  }
}

// -------------------------------------------------------------
// CLIENTS & SIDE HUSTLE AGENCY MANAGER
// -------------------------------------------------------------
function renderClientsManager() {
  const container = document.getElementById('clientsListContainer');
  const countBadge = document.getElementById('clientCountBadge');
  const metricCount = document.getElementById('metricClientCount');
  const metricPostCount = document.getElementById('metricPostCount');

  if (countBadge) countBadge.textContent = state.clients.length;
  if (metricCount) metricCount.textContent = state.clients.length;
  if (metricPostCount) metricPostCount.textContent = state.allPosts.length;

  if (!container) return;

  container.innerHTML = state.clients.map(c => {
    const isActive = c.id === state.currentClient?.id;
    const clientPosts = state.allPosts.filter(p => !p.clientId || p.clientId === c.id);

    return `
      <div class="client-agency-card ${isActive ? 'active-client' : ''}">
        <div class="client-card-top">
          <div class="client-avatar-large">${c.avatar || '🏢'}</div>
          <div class="client-info">
            <h3>${escapeHtml(c.name)}</h3>
            <p>${escapeHtml(c.niche || 'Business Account')}</p>
          </div>
        </div>

        <div class="client-meta-details">
          <div><strong>📍 Address:</strong> ${escapeHtml(c.address || 'Thane')}</div>
          <div><strong>📞 Hotline:</strong> ${escapeHtml(c.hotline || 'N/A')}</div>
          <div><strong>📊 Scheduled Posts:</strong> ${clientPosts.length} posts active</div>
          <div><strong>🔗 Webhook:</strong> <small style="word-break: break-all;">${c.webhookUrl ? 'Custom Webhook' : 'Default Master Webhook'}</small></div>
        </div>

        <div class="client-actions-row">
          <button class="btn ${isActive ? 'btn-secondary' : 'btn-primary'}" onclick="handleClientChange('${c.id}')">
            ${isActive ? '✔ Active Client' : 'Switch to Client'}
          </button>
          ${c.id !== 'client_bigbyte' ? `
            <button class="btn btn-secondary" onclick="deleteClient('${c.id}')" title="Delete Client">🗑️</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openAddClientModal() {
  const modal = document.getElementById('addClientModal');
  if (modal) modal.style.display = 'flex';
}

function closeAddClientModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-close')) return;
  const modal = document.getElementById('addClientModal');
  if (modal) modal.style.display = 'none';
}

async function handleAddClientSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('clientFormName').value.trim();
  const niche = document.getElementById('clientFormNiche').value.trim();
  const avatar = document.getElementById('clientFormAvatar').value.trim() || '🏢';
  const hotline = document.getElementById('clientFormHotline').value.trim();
  const address = document.getElementById('clientFormAddress').value.trim();
  const webhookUrl = document.getElementById('clientFormWebhook').value.trim();

  const newClient = {
    id: `client_${Date.now()}`,
    name,
    niche,
    avatar,
    hotline,
    address,
    webhookUrl: webhookUrl || undefined,
    color: '#0284c7',
    accounts: {
      gmb: { connected: true, handle: name },
      instagram: { connected: true, handle: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}` }
    }
  };

  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });
    const result = await res.json();
    if (result.success) {
      state.clients.push(newClient);
      state.currentClient = newClient;
      populateClientDropdown();
      updateClientUI();
      renderClientsManager();
      closeAddClientModal();
      showToast(`Added client "${name}" for agency side hustle!`);
    }
  } catch (err) {
    showToast('Failed to add client: ' + err.message);
  }
}

async function deleteClient(clientId) {
  if (!confirm('Are you sure you want to remove this client?')) return;
  try {
    const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      state.clients = state.clients.filter(c => c.id !== clientId);
      if (state.currentClient?.id === clientId) {
        state.currentClient = state.clients[0];
      }
      populateClientDropdown();
      updateClientUI();
      renderClientsManager();
      filterAndRenderPosts();
      showToast('Client removed');
    }
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

// -------------------------------------------------------------
// NAVIGATION TABS
// -------------------------------------------------------------
function showTab(tabName) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const pane = document.getElementById(`tab-${tabName}`);
  const navBtn = document.getElementById(`nav-${tabName}`);
  if (pane) pane.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  try {
    if (window.location.hash !== '#' + tabName) {
      history.replaceState(null, null, '#' + tabName);
    }
  } catch (_) {}

  const titleEl = document.getElementById('tabTitle');
  const subEl = document.getElementById('tabSubtitle');

  if (tabName === 'calendar') {
    if (titleEl) titleEl.textContent = 'Content Calendar & Pipeline';
    if (subEl) subEl.textContent = 'Scheduled posts ready to auto-publish across all connected channels';
  } else if (tabName === 'creator') {
    if (titleEl) titleEl.textContent = '🎨 Content & Infographic Studio';
    if (subEl) subEl.textContent = 'Pick a topic preset, generate video hooks & scripts, and render branded visual cards';
    renderStudioCanvas();
  } else if (tabName === 'niche') {
    if (titleEl) titleEl.textContent = '🎯 Universal Niche & SEO Intelligence Suite';
    if (subEl) subEl.textContent = 'Extract goldmine GSC customer search queries, generate 3-tier viral hashtags, and auto-convert FAQs into scheduled posts';
    renderNicheSuite();
  } else if (tabName === 'channels') {
    if (titleEl) titleEl.textContent = 'Channels & Webhook Automation';
    if (subEl) subEl.textContent = 'Manage connected social accounts and configure background daemon endpoints';
    loadPlatforms();
  } else if (tabName === 'clients') {
    if (titleEl) titleEl.textContent = 'Clients & Side Hustle Hub';
    if (subEl) subEl.textContent = 'Manage multiple client businesses, configure retainers, and add new agency accounts';
    renderClientsManager();
  } else if (tabName === 'reels') {
    if (titleEl) titleEl.textContent = '🎬 YouTube Shorts & Instagram Reels Studio';
    if (subEl) subEl.textContent = 'Interactive 9:16 smartphone player with kinetic hooks, Ken-Burns animations, and voiceover';
    renderReelsPlaylist();
  } else if (tabName === 'pricing') {
    if (titleEl) titleEl.textContent = '💎 Commercial SaaS Plans & Subscriptions';
    if (subEl) subEl.textContent = 'Multi-country currency rates, instant UPI QR / Card / PayPal gateways & coupon engine';
    loadPlans();
  } else if (tabName === 'whitelabel') {
    if (titleEl) titleEl.textContent = '🏷️ White-Label Agency Panel & Investor Deck';
    if (subEl) subEl.textContent = 'Custom agency rebranding, CNAME domain mapping, and market buyout valuations';
    loadWhiteLabelSettings();
  }
}

// Toast Notification Helper
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

// Escape HTML for Safety
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================
// REELS & SHORTS STUDIO PLAYER ENGINE (100% FREE IN-BROWSER)
// =============================================================
const reelPlayerState = {
  activePost: null,
  isPlaying: false,
  isVoiceover: true,
  currentTime: 0,
  duration: 30, // 30 seconds standard short
  animationFrameId: null,
  loadedImage: null,
  lastTimestamp: null,
  speechUtterance: null,
  mediaRecorder: null,
  recordedChunks: []
};

function renderReelsPlaylist() {
  const container = document.getElementById('reelsPlaylistContainer');
  if (!container) return;

  const cid = state.currentClient?.id || 'client_bigbyte';
  const reelPosts = state.allPosts.filter(p => {
    const matchClient = !p.clientId || p.clientId === cid;
    const isVideo = p.platform === 'youtube' || p.platform === 'instagram' || Boolean(p.videoHook);
    return matchClient && isVideo;
  });

  const countBadge = document.getElementById('reelsCountBadge');
  if (countBadge) countBadge.textContent = reelPosts.length;

  if (reelPosts.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No video reels found.</p>';
    return;
  }

  // If no reel active, select first
  if (!reelPlayerState.activePost || !reelPosts.find(p => p.id === reelPlayerState.activePost.id)) {
    reelPlayerState.activePost = reelPosts[0];
  }

  container.innerHTML = reelPosts.map(p => {
    const isActive = reelPlayerState.activePost?.id === p.id;
    return `
      <div class="reel-item-row ${isActive ? 'active' : ''}" onclick="selectReel('${p.id}')">
        <img class="reel-thumb-mini" src="${p.image || '/assets/reel_fan_cleaning.jpg'}" alt="Thumb" onerror="this.src='/assets/reel_fan_cleaning.jpg'">
        <div class="reel-info-col">
          <h4>${escapeHtml(p.title)}</h4>
          <p>🎯 "${escapeHtml(p.videoHook || 'Watch diagnostic')}"</p>
          <div class="reel-meta-tags">
            <span class="tag-badge ${p.platform === 'youtube' ? 'yt' : 'sec'}">${p.platform === 'youtube' ? 'YouTube Short' : 'Reel'}</span>
            <span class="tag-badge sec">⏱️ 0:30</span>
            <span class="tag-badge sec">9:16 Vertical</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (reelPlayerState.activePost) {
    updateReelPlayerUI(reelPlayerState.activePost);
    preloadReelImage(reelPlayerState.activePost.image, () => {
      drawReelFrame();
    });
  }
}

function selectReel(postId) {
  const found = state.allPosts.find(p => p.id === postId);
  if (!found) return;
  
  pauseReel();
  reelPlayerState.activePost = found;
  reelPlayerState.currentTime = 0;
  
  document.querySelectorAll('.reel-item-row').forEach(row => {
    row.classList.remove('active');
  });
  
  updateReelPlayerUI(found);
  preloadReelImage(found.image, () => {
    drawReelFrame();
  });
}

function openReelFromCard(postId, event) {
  if (event) event.stopPropagation();
  showTab('reels');
  selectReel(postId);
  setTimeout(() => {
    playReel();
  }, 350);
}

function updateReelPlayerUI(post) {
  const hookEl = document.getElementById('playerHookText');
  const subEl = document.getElementById('playerSubtitle');
  const brandEl = document.getElementById('playerBrandName');
  const locEl = document.getElementById('playerLocation');

  if (hookEl) hookEl.textContent = post.videoHook || post.title;
  if (subEl) subEl.textContent = post.script || post.content.substring(0, 120);
  if (brandEl) brandEl.textContent = state.currentClient?.name || "Big Byte Systems";
  if (locEl) locEl.textContent = state.currentClient?.address || "Shop No 1, Khewra Cir Marg, Manpada, Thane West";
  
  updateProgressUI(0);
}

function preloadReelImage(src, cb) {
  if (!src) src = '/assets/reel_fan_cleaning.jpg';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    reelPlayerState.loadedImage = img;
    if (cb) cb();
  };
  img.onerror = () => {
    const fallback = new Image();
    fallback.src = '/assets/reel_fan_cleaning.jpg';
    fallback.onload = () => {
      reelPlayerState.loadedImage = fallback;
      if (cb) cb();
    };
  };
  img.src = src;
}

function drawReelFrame() {
  const canvas = document.getElementById('reelVideoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Clear background
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, W, H);

  const t = reelPlayerState.currentTime;
  const dur = reelPlayerState.duration;
  const progress = Math.min(1, t / dur);

  // 1. Draw Image with smooth Ken-Burns Zoom & Pan
  if (reelPlayerState.loadedImage && reelPlayerState.loadedImage.complete) {
    ctx.save();
    const img = reelPlayerState.loadedImage;
    const scale = 1.05 + 0.18 * progress;
    const panY = -15 * progress;

    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2, -H / 2);

    const imgRatio = img.width / img.height;
    const canvasRatio = W / H;
    let dw, dh, dx, dy;

    if (imgRatio > canvasRatio) {
      dh = H;
      dw = H * imgRatio;
      dx = (W - dw) / 2;
      dy = 0;
    } else {
      dw = W;
      dh = W / imgRatio;
      dx = 0;
      dy = (H - dh) / 2;
    }

    ctx.drawImage(img, dx, dy + panY, dw, dh);
    ctx.restore();
  }

  // 2. Cinematic Vignettes
  const gradTop = ctx.createLinearGradient(0, 0, 0, 160);
  gradTop.addColorStop(0, 'rgba(0,0,0,0.85)');
  gradTop.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradTop;
  ctx.fillRect(0, 0, W, 160);

  const gradBottom = ctx.createLinearGradient(0, H - 240, 0, H);
  gradBottom.addColorStop(0, 'rgba(0,0,0,0)');
  gradBottom.addColorStop(0.5, 'rgba(0,0,0,0.8)');
  gradBottom.addColorStop(1, 'rgba(0,0,0,0.95)');
  ctx.fillStyle = gradBottom;
  ctx.fillRect(0, H - 240, 0, 240);

  // 3. Top Header Branding Badge
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(16, 26, 96, 22, 11);
  else ctx.rect(16, 26, 96, 22);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillText('⚡ 4K LAB REEL', 26, 41);

  // Sound Wave Indicator on Top Right
  if (reelPlayerState.isPlaying) {
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < 4; i++) {
      const bh = 4 + Math.sin((t * 6) + i) * 6;
      ctx.fillRect(W - 40 + (i * 5), 38 - bh, 3, bh);
    }
  }

  // 4. Kinetic 0-3s Hook Banner (0:00 - 0:04s)
  if (t < 4.0 && reelPlayerState.activePost) {
    ctx.save();
    const hook = reelPlayerState.activePost.videoHook || reelPlayerState.activePost.title;
    
    let popScale = 1.0;
    if (t < 0.4) {
      popScale = 0.8 + 0.2 * (t / 0.4);
    }
    
    ctx.translate(W / 2, 120);
    ctx.scale(popScale, popScale);
    ctx.translate(-W / 2, -120);

    // Warning Badge
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(24, 76, 175, 24, 12);
    else ctx.rect(24, 76, 175, 24);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 11px Inter, sans-serif';
    ctx.fillText('⚠️ CRITICAL THANE WARNING', 32, 92);

    // Hook Headline Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(20, 108, W - 40, 96, 12);
    else ctx.rect(20, 108, W - 40, 96);
    ctx.fill();
    ctx.stroke();

    // Hook Text
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 15px Outfit, Inter, sans-serif';
    wrapText(ctx, `"${hook}"`, 32, 136, W - 64, 22);

    ctx.restore();
  }

  // 5. Dynamic Subtitle Bar (0:04s - 0:30s)
  if (t >= 4.0 && reelPlayerState.activePost) {
    const script = reelPlayerState.activePost.script || reelPlayerState.activePost.content;
    const sentences = script.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
    const sentenceIndex = Math.min(sentences.length - 1, Math.floor(((t - 4.0) / (dur - 4.0)) * sentences.length));
    const currentSentence = sentences[sentenceIndex] || "";

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(20, H - 180, W - 40, 70, 10);
    else ctx.rect(20, H - 180, W - 40, 70);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    wrapText(ctx, currentSentence, 32, H - 155, W - 64, 18);
    ctx.restore();

    const subEl = document.getElementById('playerSubtitle');
    if (subEl) subEl.textContent = currentSentence;
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function updateProgressUI(t) {
  const bar = document.getElementById('reelProgressBar');
  const timer = document.getElementById('reelTimer');
  const dur = reelPlayerState.duration;

  if (bar) {
    const pct = Math.min(100, (t / dur) * 100);
    bar.style.width = `${pct}%`;
  }
  if (timer) {
    const sec = Math.floor(t);
    timer.textContent = `0:${String(sec).padStart(2, '0')} / 0:30`;
  }
}

function togglePlayReel() {
  if (reelPlayerState.isPlaying) {
    pauseReel();
  } else {
    playReel();
  }
}

function playReel() {
  if (!reelPlayerState.activePost) return;
  reelPlayerState.isPlaying = true;
  reelPlayerState.lastTimestamp = performance.now();

  const icon = document.getElementById('playIcon');
  const text = document.getElementById('playText');
  if (icon) icon.textContent = '⏸';
  if (text) text.textContent = 'Pause Reel';

  // Native Browser Speech Synthesis (100% Free Human-Like Studio Voiceover)
  if (reelPlayerState.isVoiceover && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const p = reelPlayerState.activePost;
    const textToSpeak = `${p.videoHook || ''}. ${p.script || p.content.substring(0, 180)}`;
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    
    // Voice tuning values from state
    utter.rate = state.voiceRate || 1.05;
    utter.pitch = state.voicePitch || 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const char = state.voiceCharacter || 'male_in';

    let matchedVoice = null;
    if (char === 'male_in') {
      matchedVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('prabhat')) && v.name.toLowerCase().includes('male')) ||
                     voices.find(v => v.lang === 'en-IN') ||
                     voices.find(v => v.lang.includes('en-GB'));
    } else if (char === 'female_in') {
      matchedVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('priya') || v.name.toLowerCase().includes('heera')) && (v.name.toLowerCase().includes('female') || !v.name.toLowerCase().includes('male'))) ||
                     voices.find(v => v.lang === 'en-IN');
    } else if (char === 'male_uk') {
      matchedVoice = voices.find(v => v.lang === 'en-GB' && (v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('oliver') || v.name.toLowerCase().includes('male'))) ||
                     voices.find(v => v.lang === 'en-GB');
    } else if (char === 'female_us') {
      matchedVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && (v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('female'))) ||
                     voices.find(v => v.lang.startsWith('en'));
    } else if (char === 'hindi') {
      matchedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant'));
    } else if (char === 'marathi') {
      matchedVoice = voices.find(v => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi')) ||
                     voices.find(v => v.lang.startsWith('hi'));
    } else if (char === 'spanish') {
      matchedVoice = voices.find(v => v.lang.startsWith('es'));
    } else if (char === 'german') {
      matchedVoice = voices.find(v => v.lang.startsWith('de'));
    } else if (char === 'french') {
      matchedVoice = voices.find(v => v.lang.startsWith('fr'));
    } else if (char === 'arabic') {
      matchedVoice = voices.find(v => v.lang.startsWith('ar'));
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
    }
    if (matchedVoice) utter.voice = matchedVoice;

    window.speechSynthesis.speak(utter);
    reelPlayerState.speechUtterance = utter;
  }

  function loop(now) {
    if (!reelPlayerState.isPlaying) return;
    const dt = (now - reelPlayerState.lastTimestamp) / 1000;
    reelPlayerState.lastTimestamp = now;

    reelPlayerState.currentTime += dt;
    if (reelPlayerState.currentTime >= reelPlayerState.duration) {
      reelPlayerState.currentTime = 0;
      pauseReel();
      drawReelFrame();
      updateProgressUI(0);
      return;
    }

    drawReelFrame();
    updateProgressUI(reelPlayerState.currentTime);
    reelPlayerState.animationFrameId = requestAnimationFrame(loop);
  }

  reelPlayerState.animationFrameId = requestAnimationFrame(loop);
}

function pauseReel() {
  reelPlayerState.isPlaying = false;
  if (reelPlayerState.animationFrameId) {
    cancelAnimationFrame(reelPlayerState.animationFrameId);
    reelPlayerState.animationFrameId = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const icon = document.getElementById('playIcon');
  const text = document.getElementById('playText');
  if (icon) icon.textContent = '▶';
  if (text) text.textContent = 'Play Reel Video';
}

function restartReel() {
  pauseReel();
  reelPlayerState.currentTime = 0;
  updateProgressUI(0);
  drawReelFrame();
  setTimeout(() => {
    playReel();
  }, 100);
}

function toggleVoiceover() {
  reelPlayerState.isVoiceover = !reelPlayerState.isVoiceover;
  const btn = document.getElementById('btnVoiceoverToggle');
  if (btn) {
    btn.innerHTML = reelPlayerState.isVoiceover ? '<span>🔊</span> Voiceover: ON' : '<span>🔇</span> Voiceover: OFF';
  }
  if (!reelPlayerState.isVoiceover && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// In-Browser Zero Cost Video Exporter
function exportAndDownloadReelVideo() {
  const canvas = document.getElementById('reelVideoCanvas');
  if (!canvas || !reelPlayerState.activePost) {
    showToast('Please select a reel to export');
    return;
  }

  showToast('🎬 Recording 30-second 9:16 Video Reel locally... please wait');
  pauseReel();
  reelPlayerState.currentTime = 0;

  const stream = canvas.captureStream(30);
  let recorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  } catch (e) {
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch (e2) {
      recorder = new MediaRecorder(stream);
    }
  }

  const chunks = [];
  recorder.ondataavailable = e => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BigByte_Reel_${reelPlayerState.activePost.id || Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('✅ High-Resolution Reel Video exported & downloaded!');
  };

  recorder.start();
  playReel();

  setTimeout(() => {
    if (recorder.state !== 'inactive') {
      recorder.stop();
      pauseReel();
    }
  }, (reelPlayerState.duration + 0.5) * 1000);
}

function publishActiveReel() {
  if (!reelPlayerState.activePost) return;
  publishPostDirectly(reelPlayerState.activePost.id);
}

// =============================================================
// AUTOPILOT ENGINE TRIGGER
// =============================================================
async function triggerAutopilotCycle() {
  const btn = document.getElementById('btnAutopilotCycle');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⚡</span> Generating & Dispatching Autopilot Post...';
  }

  try {
    const res = await fetch('/api/autopilot/cycle', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(`🚀 Autopilot posted: "${data.post.title}" [${data.post.platform.toUpperCase()}] with high-res photo!`);
      await loadPosts();
    } else {
      showToast('Autopilot notice: ' + (data.message || data.error));
    }
  } catch (err) {
    showToast('Autopilot dispatch error: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🚀</span> Run Autopilot Post Now';
    }
  }
}

// =============================================================
// PLATFORM ENABLE/DISABLE & COMPLIANCE REGISTRY
// =============================================================
async function loadPlatforms() {
  const container = document.getElementById('platformsGridList');
  if (!container) return;

  try {
    const res = await fetch('/api/platforms');
    const data = await res.json();
    if (Array.isArray(data)) {
      state.platforms = data;
      renderPlatformsGrid(data);
    }
  } catch (err) {
    console.error('Failed to load platforms:', err);
  }
}

function renderPlatformsGrid(platforms) {
  const container = document.getElementById('platformsGridList');
  if (!container) return;

  container.innerHTML = platforms.map(p => {
    return `
      <div class="platform-hub-card ${p.enabled ? 'platform-enabled' : 'platform-disabled'}">
        <div class="platform-hub-header">
          <div class="platform-name-col">
            <span class="platform-hub-icon">${p.icon}</span>
            <div>
              <h4>${escapeHtml(p.name)}</h4>
              <span class="platform-type-tag">${escapeHtml(p.format || 'Standard Feed')}</span>
            </div>
          </div>
          <label class="toggle-switch" title="Enable or Disable ${escapeHtml(p.name)} dispatches">
            <input type="checkbox" ${p.enabled ? 'checked' : ''} onchange="togglePlatform('${p.id}', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="platform-rules-box">
          <div class="rules-header">
            <span>🛡️ Anti-Ban Compliance Shield</span>
            <small>${p.charLimit ? p.charLimit + ' Chars Max' : 'Multi-Media'}</small>
          </div>
          <ul class="compliance-rules-list">
            ${(p.complianceRules || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        </div>

        <div class="platform-footer-status">
          <span class="status-indicator-dot ${p.enabled ? 'online' : 'paused'}"></span>
          <span>${p.enabled ? 'Active for Autopilot & Manual Dispatches' : 'Paused (Zero Dispatches)'}</span>
        </div>
      </div>
    `;
  }).join('');
}

async function togglePlatform(platformId, enabled) {
  try {
    const res = await fetch('/api/platforms/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platformId, enabled })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`${enabled ? '🟢 Enabled' : '⏸️ Paused'} ${platformId.toUpperCase()} dispatches!`);
      const item = state.platforms.find(x => x.id === platformId);
      if (item) item.enabled = enabled;
      renderPlatformsGrid(state.platforms);
    }
  } catch (err) {
    showToast('Platform update failed: ' + err.message);
  }
}

// =============================================================
// HUMAN-LIKE STUDIO VOICE TUNING & SAMPLE PLAYER
// =============================================================
function handleVoiceCharacterChange(val) {
  state.voiceCharacter = val;
  const select = document.getElementById('voiceCharacterSelect');
  const text = select ? select.options[select.selectedIndex]?.text : val;
  showToast(`🎙️ Voice set to: ${text}`);
}

function updateVoiceTuning() {
  const rateEl = document.getElementById('voiceRateSlider');
  const pitchEl = document.getElementById('voicePitchSlider');
  const lblRate = document.getElementById('lblVoiceRate');
  const lblPitch = document.getElementById('lblVoicePitch');

  if (rateEl && lblRate) {
    state.voiceRate = parseFloat(rateEl.value);
    lblRate.textContent = `${state.voiceRate.toFixed(2)}x`;
  }
  if (pitchEl && lblPitch) {
    state.voicePitch = parseFloat(pitchEl.value);
    lblPitch.textContent = `${state.voicePitch.toFixed(2)}x`;
  }
}

function testVoiceSample() {
  if (!('speechSynthesis' in window)) {
    showToast('Speech synthesis not supported in this browser');
    return;
  }

  window.speechSynthesis.cancel();
  const sampleSentences = {
    male_in: "Welcome to Big Byte Systems Thane. We diagnose and repair motherboards at chip-level with 100% precision.",
    female_in: "Protect your laptop from coastal Thane humidity with our professional ultrasonic cleaning and thermal servicing.",
    male_uk: "Authorized centres recommended logic board replacement, but our laboratory isolated the faulty capacitor in minutes.",
    female_us: "Transform your sluggish laptop in just 20 minutes with a high-speed SSD upgrade and zero data loss.",
    hindi: "बिग बाइट सिस्टम्स ठाणे में आपका स्वागत है। हम चिप-लेवल पर लैपटॉप और कंप्यूटर की सटीक डायग्नोस्टिक करते हैं।",
    marathi: "नमस्कार! बिग बाइट सिस्टीम्स ठाणे येथे आपले स्वागत आहे. आम्ही लॅपटॉप आणि प्रिंटरची दर्जेदार दुरुस्ती करतो.",
    spanish: "Bienvenido a Big Byte Systems. Reparación profesional de ordenadores y recuperación de datos garantizada."
  };

  const sampleText = sampleSentences[state.voiceCharacter] || sampleSentences.male_in;
  const utter = new SpeechSynthesisUtterance(sampleText);
  utter.rate = state.voiceRate || 1.05;
  utter.pitch = state.voicePitch || 1.0;

  const voices = window.speechSynthesis.getVoices();
  const char = state.voiceCharacter || 'male_in';

  let matchedVoice = null;
  if (char === 'hindi') {
    matchedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
  } else if (char === 'marathi') {
    matchedVoice = voices.find(v => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi')) ||
                   voices.find(v => v.lang.startsWith('hi'));
  } else if (char === 'spanish') {
    matchedVoice = voices.find(v => v.lang.startsWith('es'));
  } else if (char === 'female_in') {
    matchedVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india')) && (v.name.toLowerCase().includes('female') || !v.name.toLowerCase().includes('male'))) ||
                   voices.find(v => v.lang === 'en-IN');
  } else if (char === 'male_uk') {
    matchedVoice = voices.find(v => v.lang === 'en-GB');
  } else if (char === 'female_us') {
    matchedVoice = voices.find(v => v.lang.startsWith('en-US'));
  } else {
    matchedVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.includes('en'));
  }

  if (matchedVoice) utter.voice = matchedVoice;
  window.speechSynthesis.speak(utter);
  showToast('🔊 Playing voice character sample...');
}

// =============================================================
// MULTI-COUNTRY TRANSLATION & NATIVE VOICE ACCENT ENGINE
// =============================================================
const COUNTRY_PROFILES = {
  'in_en': { name: 'India (Indian English)', lang: 'en', voice: 'male_in', rate: 1.05, pitch: 1.0, currency: 'INR', flag: '🇮🇳' },
  'in_hi': { name: 'India (हिंदी / Hindi)', lang: 'hi', voice: 'hindi', rate: 1.0, pitch: 1.05, currency: 'INR', flag: '🇮🇳' },
  'in_mr': { name: 'India (मराठी / Marathi)', lang: 'mr', voice: 'marathi', rate: 1.0, pitch: 1.0, currency: 'INR', flag: '🇮🇳' },
  'us':    { name: 'United States (US Dynamic)', lang: 'en', voice: 'female_us', rate: 1.1, pitch: 1.05, currency: 'USD', flag: '🇺🇸' },
  'uk':    { name: 'United Kingdom (British Expert)', lang: 'en', voice: 'male_uk', rate: 1.0, pitch: 0.95, currency: 'GBP', flag: '🇬🇧' },
  'es':    { name: 'Spain / Latin America (Español)', lang: 'es', voice: 'spanish', rate: 1.05, pitch: 1.0, currency: 'EUR', flag: '🇪🇸' },
  'de':    { name: 'Germany (Deutsch)', lang: 'de', voice: 'german', rate: 1.0, pitch: 1.0, currency: 'EUR', flag: '🇩🇪' },
  'fr':    { name: 'France (Français)', lang: 'fr', voice: 'french', rate: 1.05, pitch: 1.0, currency: 'EUR', flag: '🇫🇷' },
  'ar':    { name: 'UAE & Gulf (العربية)', lang: 'ar', voice: 'arabic', rate: 1.0, pitch: 1.0, currency: 'AED', flag: '🇦🇪' }
};

function handleCountryMarketChange(countryKey) {
  const profile = COUNTRY_PROFILES[countryKey] || COUNTRY_PROFILES['in_en'];
  state.selectedCountry = countryKey;
  state.selectedLanguage = profile.lang;
  state.voiceCharacter = profile.voice;
  state.voiceRate = profile.rate;
  state.voicePitch = profile.pitch;

  // 1. Sync Reels Studio Voice Dropdown & Sliders
  const voiceSelect = document.getElementById('voiceCharacterSelect');
  if (voiceSelect) voiceSelect.value = profile.voice;

  const rateSlider = document.getElementById('voiceRateSlider');
  const rateLabel = document.getElementById('lblVoiceRate');
  if (rateSlider) rateSlider.value = profile.rate;
  if (rateLabel) rateLabel.textContent = `${profile.rate}x`;

  const pitchSlider = document.getElementById('voicePitchSlider');
  const pitchLabel = document.getElementById('lblVoicePitch');
  if (pitchSlider) pitchSlider.value = profile.pitch;
  if (pitchLabel) pitchLabel.textContent = `${profile.pitch}x`;

  // 2. Sync Global Currency
  const currSelect = document.getElementById('globalCurrencySelector');
  if (currSelect) currSelect.value = profile.currency;
  handleCurrencyChange(profile.currency);

  showToast(`🌍 Switched to ${profile.flag} ${profile.name}: Local voice, native accent & ${profile.currency} activated!`);

  // 3. Auto-translate current reel / post if language is not English
  if (profile.lang !== 'en') {
    triggerAutoTranslateCurrent();
  }
}

function handleLanguageChange(val) {
  handleCountryMarketChange(val);
}

async function triggerAutoTranslateCurrent() {
  const lang = state.selectedLanguage || 'hi';
  if (lang === 'en') {
    showToast('Active language is English. Select Hindi, Marathi, Spanish, etc. to translate!');
    return;
  }

  // Find target post: reel active post or first post in list
  const p = reelPlayerState.activePost || state.allPosts[0];
  if (!p) {
    showToast('No post available to translate.');
    return;
  }

  showToast(`Translating "${p.title.substring(0, 30)}..." to ${lang.toUpperCase()}...`);

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: p.content,
        title: p.title,
        videoHook: p.videoHook || '',
        targetLang: lang
      })
    });
    const data = await res.json();
    if (data.success) {
      p.title = data.translatedTitle || p.title;
      p.content = data.translatedContent || p.content;
      if (data.translatedHook) p.videoHook = data.translatedHook;

      // Update UI
      filterAndRenderPosts();
      if (reelPlayerState.activePost?.id === p.id) {
        updateReelPlayerUI(p);
        drawReelFrame();
      }
      showToast(`✅ Successfully translated post to ${lang.toUpperCase()}!`);
    } else {
      showToast('Translation notice: ' + data.error);
    }
  } catch (err) {
    showToast('Translation error: ' + err.message);
  }
}

// =============================================================
// MULTI-CURRENCY SAAS SUBSCRIPTIONS & PRICING
// =============================================================
function handleCurrencyChange(curr) {
  state.selectedCurrency = curr;
  renderPricingCards();
  showToast(`💱 Currency switched to: ${curr}`);
}

function formatPrice(amountInINR) {
  const curr = state.selectedCurrency || 'INR';
  const rate = state.currencyRates[curr] || 1;
  const sym = state.currencySymbols[curr] || '₹';
  const converted = Math.round(amountInINR * rate);

  if (curr === 'INR') {
    return `₹${amountInINR.toLocaleString('en-IN')}`;
  } else if (curr === 'USD') {
    return `$${converted.toLocaleString('en-US')}`;
  } else if (curr === 'EUR') {
    return `€${converted.toLocaleString('en-EU')}`;
  } else if (curr === 'GBP') {
    return `£${converted.toLocaleString('en-GB')}`;
  } else if (curr === 'AED') {
    return `AED ${converted.toLocaleString()}`;
  }
  return `${sym} ${converted}`;
}

async function loadPlans() {
  try {
    const res = await fetch('/api/plans');
    const data = await res.json();
    const plansList = data.tiers || data.plans || [];
    if (plansList.length > 0) {
      state.plans = plansList;
      if (data.currencies) {
        // Map rateFromUSD to INR base if needed
        state.currencyRates = {
          INR: 1,
          USD: 1 / 83.5,
          EUR: 0.92 / 83.5,
          GBP: 0.79 / 83.5,
          AED: 3.67 / 83.5
        };
      }
      if (data.trial) {
        const daysLeft = data.trial.daysRemaining || data.trial.daysLeft || 12;
        state.trial = { ...data.trial, daysLeft };
        const badge = document.getElementById('trialCountdownBadge');
        if (badge) badge.textContent = `Pro Trial: ${daysLeft} Days Left`;
        const bannerTitle = document.getElementById('trialBannerTitle');
        if (bannerTitle) bannerTitle.textContent = `Active Plan: 14-Day Free Trial (${daysLeft} Days Remaining)`;
      }
      renderPricingCards();
    }
  } catch (err) {
    console.error('Failed to load plans:', err);
  }
}

function renderPricingCards() {
  const container = document.getElementById('pricingCardsGrid');
  if (!container || !Array.isArray(state.plans)) return;

  container.innerHTML = state.plans.map(plan => {
    const isPopular = plan.popular || plan.isPopular;
    const isBuyout = plan.id === 'whitelabel_reseller' || (plan.billing && plan.billing.includes('one-time'));
    const formattedPrice = formatPrice(plan.priceINR);
    const desc = plan.tagline || plan.description || '';
    const billingText = plan.billing || plan.billingCycle || 'month';

    return `
      <div class="pricing-card ${isPopular ? 'popular-card' : ''} ${isBuyout ? 'whitelabel-license-card' : ''}">
        ${isPopular ? '<div class="popular-ribbon">⭐ MOST POPULAR AGENCY CHOICE</div>' : ''}
        ${isBuyout ? '<div class="popular-ribbon investor-ribbon">🏛️ INVESTOR BUYOUT LICENSE</div>' : ''}

        <div class="pricing-card-header">
          <h3>${escapeHtml(plan.name)}</h3>
          <p class="pricing-desc">${escapeHtml(desc)}</p>
          <div class="price-row">
            <span class="price-val">${formattedPrice}</span>
            <span class="price-period">/ ${escapeHtml(billingText)}</span>
          </div>
          <div class="trial-pill">🎁 14-Day Free Trial Included</div>
        </div>

        <ul class="plan-features-list">
          ${(plan.features || []).map(f => `<li><span class="chk">✔</span> ${escapeHtml(f)}</li>`).join('')}
        </ul>

        <div class="pricing-cta-row">
          <button class="btn ${isPopular || isBuyout ? 'btn-primary' : 'btn-secondary'} btn-block" onclick="openCheckout('${plan.id}')">
            ${isBuyout ? 'Buy White-Label License' : 'Upgrade to ' + escapeHtml(plan.name)}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================================
// MULTI-GATEWAY CHECKOUT MODAL (UPI QR, CARDS, PAYPAL, COUPONS)
// =============================================================
function openCheckout(planId) {
  const plan = state.plans.find(p => p.id === planId) || state.plans[1] || {
    id: 'agency_growth',
    name: 'Agency Growth Plan',
    priceINR: 3999,
    description: '5 Client Accounts • Video Reels Studio • Anti-Ban Shield'
  };

  state.activeCheckoutPlan = plan;
  state.appliedCoupon = null;

  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  document.getElementById('checkoutPlanTitle').textContent = `Upgrade to ${plan.name}`;
  document.getElementById('checkoutPlanSubtitle').textContent = plan.description;
  document.getElementById('summaryPlanName').textContent = plan.name;
  
  updateCheckoutAmounts();
  generateUpiQr(plan.priceINR);

  // Reset coupon input
  const couponInp = document.getElementById('couponInput');
  const couponMsg = document.getElementById('couponMessage');
  const discountLine = document.getElementById('discountLine');
  if (couponInp) couponInp.value = '';
  if (couponMsg) { couponMsg.textContent = ''; couponMsg.className = 'coupon-msg'; }
  if (discountLine) discountLine.style.display = 'none';

  modal.style.display = 'flex';
}

function closeCheckoutModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-close')) return;
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.style.display = 'none';
}

function switchPayTab(tab) {
  ['upi', 'card', 'paypal'].forEach(t => {
    const btn = document.getElementById(`tabPay${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const pane = document.getElementById(`payPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (pane) pane.style.display = (t === tab) ? 'block' : 'none';
  });
}

function updateCheckoutAmounts() {
  const plan = state.activeCheckoutPlan;
  if (!plan) return;

  let basePrice = plan.priceINR;
  let finalPrice = basePrice;
  let discountAmount = 0;

  if (state.appliedCoupon) {
    if (state.appliedCoupon.discountPercent === 100) {
      discountAmount = basePrice;
      finalPrice = 0;
    } else {
      discountAmount = Math.round(basePrice * (state.appliedCoupon.discountPercent / 100));
      finalPrice = Math.max(0, basePrice - discountAmount);
    }
  }

  const elPrice = document.getElementById('summaryPlanPrice');
  const elTotal = document.getElementById('summaryTotalPayable');
  const elDiscLine = document.getElementById('discountLine');
  const elDiscPct = document.getElementById('discountPercentText');
  const elDiscVal = document.getElementById('discountAmountText');

  if (elPrice) elPrice.textContent = formatPrice(basePrice);
  if (elTotal) elTotal.textContent = formatPrice(finalPrice);

  if (state.appliedCoupon && discountAmount > 0) {
    if (elDiscLine) elDiscLine.style.display = 'flex';
    if (elDiscPct) elDiscPct.textContent = `${state.appliedCoupon.discountPercent}%`;
    if (elDiscVal) elDiscVal.textContent = `-${formatPrice(discountAmount)}`;
  } else {
    if (elDiscLine) elDiscLine.style.display = 'none';
  }

  // Update dynamic QR Code for final payable amount
  generateUpiQr(finalPrice);
}

function generateUpiQr(amount) {
  const box = document.getElementById('qrCanvasBox');
  if (!box) return;

  const upiId = 'bigbyte.systems@oksbi';
  const payeeName = 'Big Byte Systems';
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=Social%20Studio%20Plan`;

  // Render SVG QR Code Simulation
  box.innerHTML = `
    <div style="background: #ffffff; padding: 14px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(0,0,0,0.25);">
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="180" fill="white"/>
        <!-- Corner Finder Patterns -->
        <rect x="14" y="14" width="46" height="46" rx="6" fill="#0f172a"/>
        <rect x="22" y="22" width="30" height="30" rx="3" fill="white"/>
        <rect x="29" y="29" width="16" height="16" rx="2" fill="#0284c7"/>
        
        <rect x="120" y="14" width="46" height="46" rx="6" fill="#0f172a"/>
        <rect x="128" y="22" width="30" height="30" rx="3" fill="white"/>
        <rect x="135" y="29" width="16" height="16" rx="2" fill="#0284c7"/>

        <rect x="14" y="120" width="46" height="46" rx="6" fill="#0f172a"/>
        <rect x="22" y="128" width="30" height="30" rx="3" fill="white"/>
        <rect x="29" y="135" width="16" height="16" rx="2" fill="#0284c7"/>

        <!-- Simulated QR Data Matrix -->
        <rect x="70" y="16" width="10" height="10" fill="#0f172a"/>
        <rect x="90" y="24" width="14" height="8" fill="#0f172a"/>
        <rect x="75" y="40" width="8" height="16" fill="#0f172a"/>
        <rect x="95" y="44" width="12" height="12" fill="#0f172a"/>
        <rect x="70" y="70" width="40" height="40" rx="8" fill="#0284c7"/>
        <circle cx="90" cy="90" r="12" fill="white"/>
        <text x="86" y="94" font-family="sans-serif" font-weight="900" font-size="12" fill="#0284c7">₹</text>
        <rect x="16" y="75" width="12" height="12" fill="#0f172a"/>
        <rect x="36" y="85" width="16" height="8" fill="#0f172a"/>
        <rect x="125" y="75" width="18" height="10" fill="#0f172a"/>
        <rect x="150" y="90" width="12" height="12" fill="#0f172a"/>
        <rect x="70" y="125" width="12" height="14" fill="#0f172a"/>
        <rect x="90" y="135" width="20" height="10" fill="#0f172a"/>
        <rect x="125" y="125" width="14" height="14" fill="#0f172a"/>
        <rect x="145" y="145" width="16" height="16" fill="#0f172a"/>
      </svg>
      <div style="font-size: 11px; font-weight: 700; color: #0f172a; text-align: center; margin-top: 4px;">
        Scan & Pay: ${formatPrice(amount)}
      </div>
    </div>
  `;
}

function copyUpiId() {
  const upiId = 'bigbyte.systems@oksbi';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(upiId);
  }
  showToast('📋 UPI ID copied: ' + upiId);
}

async function applyCouponCode() {
  const input = document.getElementById('couponInput');
  const msg = document.getElementById('couponMessage');
  if (!input || !msg) return;

  const code = input.value.trim();
  if (!code) {
    msg.textContent = 'Please type a promo code';
    msg.className = 'coupon-msg error';
    return;
  }

  try {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        planId: state.activeCheckoutPlan?.id
      })
    });
    const data = await res.json();
    if (data.valid) {
      const coupon = data.coupon || data;
      state.appliedCoupon = coupon;
      msg.textContent = `✔ Applied: ${coupon.description} (${coupon.discountPercent}% OFF)`;
      msg.className = 'coupon-msg success';
      updateCheckoutAmounts();
      showToast(`🎉 Coupon ${code} applied successfully!`);
    } else {
      state.appliedCoupon = null;
      msg.textContent = data.message || 'Invalid or expired code';
      msg.className = 'coupon-msg error';
      updateCheckoutAmounts();
    }
  } catch (err) {
    msg.textContent = 'Validation failed: ' + err.message;
    msg.className = 'coupon-msg error';
  }
}

async function completePaymentNow() {
  const plan = state.activeCheckoutPlan;
  if (!plan) return;

  const btn = document.getElementById('btnCompletePayment');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Verifying Transaction...';
  }

  try {
    const res = await fetch('/api/plans/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: plan.id,
        couponCode: state.appliedCoupon?.code || undefined,
        paymentMethod: 'UPI'
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`🎉 Subscription Active! Welcome to ${plan.name}!`);
      closeCheckoutModal();
      await loadPlans();
    } else {
      showToast('Payment notice: ' + result.message);
    }
  } catch (err) {
    showToast('Payment processing error: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Confirm & Activate Plan';
    }
  }
}

function simulatePaymentSuccess(gateway) {
  showToast(`✅ ${gateway} Payment Confirmed! Activating plan...`);
  setTimeout(() => {
    completePaymentNow();
  }, 600);
}

// =============================================================
// WHITE-LABEL SETTINGS & BRAND ENGINE
// =============================================================
async function loadWhiteLabelSettings() {
  try {
    const res = await fetch('/api/whitelabel');
    const data = await res.json();
    state.whitelabel = data;
    const b = data.branding || data;

    const inpName = document.getElementById('wlAgencyName');
    const inpShort = document.getElementById('wlShortName');
    const inpTag = document.getElementById('wlTagline');
    const inpLogo = document.getElementById('wlLogoUrl');
    const inpColor = document.getElementById('wlAccentColor');
    const inpDomain = document.getElementById('wlCustomDomain');

    if (inpName) inpName.value = b.agencyBrandName || b.agencyName || '';
    if (inpShort) inpShort.value = b.agencyShortName || b.shortName || '';
    if (inpTag) inpTag.value = b.agencyTagline || b.tagline || '';
    if (inpLogo) inpLogo.value = b.logoUrl || '';
    if (inpColor) inpColor.value = b.accentColor || '#0284c7';
    if (inpDomain) inpDomain.value = b.customDomain || '';

    updateAccentPreview(b.accentColor || '#0284c7');
  } catch (err) {
    console.error('Failed to load white-label settings:', err);
  }
}

function updateAccentPreview(color) {
  const lbl = document.getElementById('lblAccentColor');
  if (lbl) lbl.textContent = color;
  document.documentElement.style.setProperty('--primary', color);
}

async function saveWhiteLabelSettings() {
  const agencyName = document.getElementById('wlAgencyName')?.value.trim();
  const shortName = document.getElementById('wlShortName')?.value.trim();
  const tagline = document.getElementById('wlTagline')?.value.trim();
  const logoUrl = document.getElementById('wlLogoUrl')?.value.trim();
  const accentColor = document.getElementById('wlAccentColor')?.value.trim();
  const customDomain = document.getElementById('wlCustomDomain')?.value.trim();

  try {
    const res = await fetch('/api/whitelabel/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agencyName,
        shortName,
        tagline,
        logoUrl,
        accentColor,
        customDomain
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast('🏛️ White-Label branding saved & updated in real-time!');
      updateAccentPreview(accentColor);
    } else {
      showToast('Error saving settings: ' + result.error);
    }
  } catch (err) {
    showToast('Failed to save white-label settings: ' + err.message);
  }
}

// =============================================================
// DAY / NIGHT MODE (LIGHT / DARK THEME TOGGLE)
// =============================================================
function initTheme() {
  const saved = localStorage.getItem('socialStudioTheme') || 'dark';
  applyTheme(saved);
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-theme');
  const nextTheme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('socialStudioTheme', nextTheme);
  showToast(nextTheme === 'light' ? '☀️ Switched to Day Mode (Light)' : '🌙 Switched to Night Mode (Dark)');
}

function applyTheme(theme) {
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    if (icon) icon.textContent = '☀️';
    if (text) text.textContent = 'Day Mode';
  } else {
    document.body.classList.remove('light-theme');
    if (icon) icon.textContent = '🌙';
    if (text) text.textContent = 'Night Mode';
  }
}

// =============================================================
// UNIVERSAL NICHE & SEO INTELLIGENCE SUITE
// =============================================================
const NICHE_REGISTRY = {
  repair: {
    id: 'repair',
    name: 'Computer & Mobile Repair / Tech Lab',
    icon: '💻',
    category: 'Hardware & Diagnostics',
    broadTags: ['#TechTips', '#ComputerRepair', '#LaptopFix', '#HardwareTech', '#AppleTech', '#PCBuild', '#TechLife', '#GadgetRepair'],
    nicheTags: ['#MicroSoldering', '#LogicBoardRepair', '#MotherboardRepair', '#CleanroomDataRecovery', '#EpsonEcoTank', '#OverheatingFix', '#ChipLevel', '#ThermalRepasting'],
    defaultCity: 'Thane West, Manpada, Ghodbunder Road',
    geoSuffix: ['#ThaneWest', '#Manpada', '#GhodbunderRoad', '#ThaneCity', '#MumbaiTech'],
    blueprint: 'diagnostic',
    hookTemplate: 'Client was told they had to replace the entire logic board. Watch what our lab found under the microscope.',
    sampleQuestions: [
      'Can a dead water damaged MacBook motherboard be repaired without replacing it?',
      'Why is my laptop fan making a loud jet engine noise in coastal Thane?',
      'Why are Epson EcoTank red ink and paper lights blinking alternately?',
      'How much does SSD upgrade cost vs buying a new laptop?',
      'Is chip level micro-soldering safe for retaining customer data?'
    ]
  },
  dental: {
    id: 'dental',
    name: 'Dental Clinic & Orthodontics',
    icon: '🦷',
    category: 'Healthcare & Wellness',
    broadTags: ['#DentalCare', '#SmileMakeover', '#HealthyTeeth', '#OralHealth', '#Dentist', '#TeethWhitening', '#HealthySmile', '#DentalTips'],
    nicheTags: ['#InvisibleAligners', '#DentalImplants', '#PainlessRootCanal', '#CosmeticDentistry', '#DentalCrowns', '#TeethStraightening', '#ToothExtraction', '#ZirconiaCrowns'],
    defaultCity: 'Thane West, Hiranandani Estate',
    geoSuffix: ['#DentistInThane', '#ThaneWest', '#HiranandaniEstate', '#ThaneDentist', '#MumbaiDentistry'],
    blueprint: 'diagnostic',
    hookTemplate: 'Thinking about braces or implants? Here is what your dentist wishes you knew before paying.',
    sampleQuestions: [
      'Are invisible aligners as effective as traditional metal braces for adults?',
      'How long do titanium dental implants actually last?',
      'Is a single sitting root canal treatment completely painless?',
      'What is the cost difference between zirconia and porcelain dental crowns?',
      'How can you stop sudden severe tooth pain at night before an appointment?'
    ]
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate & Property Advisory',
    icon: '🏢',
    category: 'Property & Investment',
    broadTags: ['#RealEstate', '#PropertyInvestment', '#HomeBuying', '#NewHome', '#LuxuryLiving', '#DreamHome', '#Realtor', '#InteriorDesign'],
    nicheTags: ['#PreLaunchProjects', '#RERARegistered', '#GhodbunderRoadHomes', '#2BHKThane', '#RentalYield', '#RealEstateAdvisory', '#HighROI', '#PropertyAdvisory'],
    defaultCity: 'Ghodbunder Road, Thane West',
    geoSuffix: ['#ThaneRealEstate', '#GhodbunderRoad', '#ThaneWest', '#MumbaiProperties', '#Majiwada'],
    blueprint: 'authority',
    hookTemplate: 'Before you pay that property booking token, look closely at this one clause in the RERA draft.',
    sampleQuestions: [
      'What is the real difference between RERA carpet area and super built-up area?',
      'Is it safer to buy in pre-launch projects or ready-possession towers?',
      'What average rental yield can an investor expect on Ghodbunder Road?',
      'What documents must you independently verify before paying home booking advances?',
      'Why are resale property stamp duties lower than under-construction units?'
    ]
  },
  cafe: {
    id: 'cafe',
    name: 'Specialty Cafe & Artisan Bakery',
    icon: '☕',
    category: 'Food, Beverage & Hospitality',
    broadTags: ['#CafeLife', '#CoffeeLovers', '#CoffeeTime', '#Foodie', '#BrunchVibes', '#FreshBakes', '#DessertTime', '#CafeCulture'],
    nicheTags: ['#SpecialtyCoffee', '#ArabicaBeans', '#ColdBrewCoffee', '#SourdoughBread', '#ArtisanBakery', '#PourOverCoffee', '#CafeHopping', '#SingleOriginCoffee'],
    defaultCity: 'Meadows, Thane West',
    geoSuffix: ['#ThaneCafes', '#ThaneFoodie', '#ManpadaThane', '#CoffeeInThane', '#MumbaiCafes'],
    blueprint: 'classic',
    hookTemplate: 'Think all coffee beans are roasted equally? Watch how cold brewing changes acidity by 65%.',
    sampleQuestions: [
      'What is the actual difference between single-origin Arabica and commercial Robusta beans?',
      'Why does authentic fermented sourdough bread digest easier than regular bread?',
      'How does 18-hour cold brew extraction eliminate burnt coffee bitterness?',
      'What makes a flat white completely different from a standard latte?',
      'How should you store specialty coffee beans at home to preserve flavor notes?'
    ]
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness Gym & Personal Training',
    icon: '🏋️‍♂️',
    category: 'Fitness & Physical Performance',
    broadTags: ['#FitnessMotivation', '#GymLife', '#Workout', '#FitFam', '#WeightLoss', '#StrengthTraining', '#HealthAndFitness', '#BodyBuilding'],
    nicheTags: ['#BodyRecomposition', '#Hypertrophy', '#FatLossTips', '#PersonalTrainer', '#ProgressiveOverload', '#CleanNutrition', '#PostWorkout', '#CoreStrength'],
    defaultCity: 'Ghodbunder Road, Thane',
    geoSuffix: ['#GymsInThane', '#ThaneFitness', '#ThaneWest', '#PersonalTrainerThane', '#MumbaiFitness'],
    blueprint: 'alert',
    hookTemplate: 'Working out 5 days a week but the scale refuses to move? Stop doing this one common gym mistake.',
    sampleQuestions: [
      'Can you realistically build muscle and lose stubborn belly fat at the same time?',
      'Is it better to do cardio before or after heavy strength training?',
      'How much protein per kilogram of bodyweight do you actually need daily?',
      'Why has your weight loss stalled despite eating clean in a calorie deficit?',
      'What are the best exercises to correct rounded shoulders from desk jobs?'
    ]
  },
  autodetail: {
    id: 'autodetail',
    name: 'Auto Detailing & Ceramic Coating',
    icon: '🚗',
    category: 'Automotive Care & Preservation',
    broadTags: ['#CarCare', '#AutoDetailing', '#CarLovers', '#CarsOfInstagram', '#AutoSpa', '#CarPhotography', '#DetailingWorld', '#CleanCars'],
    nicheTags: ['#CeramicCoating', '#PPFInstallation', '#PaintCorrection', '#InteriorSteamDetailing', '#SwirlMarkRemoval', '#9HCoating', '#Hydrophobic', '#GrapheneCoating'],
    defaultCity: 'Wagle Estate, Thane West',
    geoSuffix: ['#CarDetailingThane', '#ThaneCars', '#WagleEstate', '#MumbaiDetailing', '#ThaneCity'],
    blueprint: 'diagnostic',
    hookTemplate: 'Before you let a dealership charge 40,000 for Teflon coating, see what genuine 9H ceramic coating does.',
    sampleQuestions: [
      'Is 9H ceramic coating better than Paint Protection Film (PPF) for daily highway driving?',
      'Can 2-stage machine paint correction remove 100% of car swirl marks and water spots?',
      'How long does a genuine ceramic coating hydrophobic layer last in heavy Indian monsoons?',
      'Does high-pressure steam detailing eliminate damp AC mold odors from car upholstery?',
      'How often should you wash a ceramic coated car to prevent mineral water spotting?'
    ]
  },
  legal: {
    id: 'legal',
    name: 'CA, GST & Financial Advisory',
    icon: '⚖️',
    category: 'Corporate Finance & Legal',
    broadTags: ['#TaxPlanning', '#FinanceTips', '#Accounting', '#SmallBusinessTips', '#WealthBuilding', '#BusinessGrowth', '#MoneyManagement', '#StartupLife'],
    nicheTags: ['#GSTFiling', '#IncomeTaxSaving', '#Section80C', '#CompanyRegistration', '#AuditCompliance', '#MSMERegistration', '#StartupIndia', '#Section44AD'],
    defaultCity: 'Thane West & Mumbai BKC',
    geoSuffix: ['#CAInThane', '#ThaneBusiness', '#ThaneWest', '#MumbaiAccountants', '#GSTAdvisory'],
    blueprint: 'authority',
    hookTemplate: 'Small business owners: If your revenue is under 2 Crore, this presumptive tax section cuts your bookkeeping by 80%.',
    sampleQuestions: [
      'What is the practical difference between Old and New Income Tax regimes for FY 2026?',
      'How can small business owners legally save taxes using Section 44AD presumptive taxation?',
      'What are the mandatory audit thresholds and late filing penalties for GSTR-9 returns?',
      'Is it more tax-efficient to register as an LLP or Private Limited for a bootstrap startup?',
      'What personal business expenses can be legally claimed as deductions against firm profits?'
    ]
  },
  custom: {
    id: 'custom',
    name: 'Custom / Type Any Business Niche',
    icon: '🛠️',
    category: 'Custom Industry',
    broadTags: ['#SmallBusiness', '#LocalBusiness', '#ProfessionalServices', '#BusinessOwner', '#QualityService', '#CustomerFirst', '#CommunityTrust'],
    nicheTags: ['#SpecialistService', '#CertifiedExpert', '#CustomerSatisfaction', '#ExperiencedTeam', '#HonestPricing', '#GuaranteedWork'],
    defaultCity: 'Thane West, Mumbai',
    geoSuffix: ['#LocalBusiness', '#ThaneWest', '#CityService', '#NearMe'],
    blueprint: 'authority',
    hookTemplate: 'Before you hire a service provider for this, ask these 3 questions to avoid getting overcharged.',
    sampleQuestions: [
      'What is the true cost of professional service vs DIY troubleshooting?',
      'How do you verify the credentials of an authorized service provider?',
      'What guarantees or warranties should always be included in writing?',
      'What are the top 3 signs that a provider is using sub-standard replacement parts?'
    ]
  }
};

const activeNicheState = {
  nicheKey: 'repair',
  targetCity: 'Thane West, Manpada, Mumbai'
};

function initNicheSuite() {
  renderNicheSuite();
}

function renderNicheSuite() {
  const current = NICHE_REGISTRY[activeNicheState.nicheKey] || NICHE_REGISTRY.repair;

  // 1. Render Visual Grid Picker Cards
  const grid = document.getElementById('nichePickerGrid');
  if (grid) {
    grid.innerHTML = Object.values(NICHE_REGISTRY).map(n => {
      const isActive = n.id === activeNicheState.nicheKey;
      return `
        <div class="niche-pill-btn ${isActive ? 'active' : ''}" onclick="handleNichePresetChange('${n.id}')">
          <span class="niche-pill-icon">${n.icon}</span>
          <span class="niche-pill-title">${escapeHtml(n.name)}</span>
          <span class="niche-pill-sub">${escapeHtml(n.category)}</span>
        </div>
      `;
    }).join('');
  }

  // 2. Update Dropdown and Label
  const dropdown = document.getElementById('nichePresetSelect');
  if (dropdown) dropdown.value = current.id;
  const tagLabel = document.getElementById('activeNicheTagLabel');
  if (tagLabel) tagLabel.textContent = current.name;

  // 3. Render 3-Tier Hashtags
  const bBox = document.getElementById('tierBroadTags');
  const nBox = document.getElementById('tierNicheTags');
  const gBox = document.getElementById('tierGeoTags');

  if (bBox) {
    bBox.innerHTML = current.broadTags.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('');
  }
  if (nBox) {
    nBox.innerHTML = current.nicheTags.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('');
  }
  if (gBox) {
    const geoTags = buildDynamicGeoTags(activeNicheState.targetCity, current.geoSuffix);
    gBox.innerHTML = geoTags.map(t => `<span class="tag-chip" style="color:#f59e0b;">${escapeHtml(t)}</span>`).join('');
  }

  // 4. Render Sample FAQ Chips
  const faqBox = document.getElementById('faqSampleChipsList');
  if (faqBox) {
    faqBox.innerHTML = `
      <span class="faq-sample-label">💡 High-Volume GSC Questions in this Niche:</span>
      ${current.sampleQuestions.map(q => `
        <button type="button" class="faq-chip-btn" onclick="applySampleFaq('${escapeHtml(q)}')">${escapeHtml(q)}</button>
      `).join('')}
    `;
  }
}

function buildDynamicGeoTags(cityString, defaultSuffix) {
  if (!cityString) return defaultSuffix;
  const parts = cityString.split(/[,/]+/).map(s => s.trim().replace(/[^a-zA-Z0-9]/g, '')).filter(Boolean);
  const dynamic = parts.map(p => `#${p}`);
  return Array.from(new Set([...dynamic, ...defaultSuffix]));
}

function handleNichePresetChange(nicheKey) {
  if (!NICHE_REGISTRY[nicheKey]) return;
  activeNicheState.nicheKey = nicheKey;
  renderNicheSuite();
  showToast(`🎯 Switched niche to: ${NICHE_REGISTRY[nicheKey].name}`);
}

function handleNicheGeoChange(cityVal) {
  activeNicheState.targetCity = cityVal.trim();
  renderNicheSuite();
}

function applySampleFaq(questionText) {
  const input = document.getElementById('faqQueryInput');
  if (input) input.value = questionText;
  convertFaqToScheduledPost(questionText);
}

function copyAllNicheTags() {
  const current = NICHE_REGISTRY[activeNicheState.nicheKey] || NICHE_REGISTRY.repair;
  const geoTags = buildDynamicGeoTags(activeNicheState.targetCity, current.geoSuffix);
  const all = [...current.broadTags, ...current.nicheTags, ...geoTags].join(' ');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(all);
  }
  showToast(`📋 Copied ${current.broadTags.length + current.nicheTags.length + geoTags.length} balanced viral hashtags!`);
}

function pushTagsToCreator() {
  const current = NICHE_REGISTRY[activeNicheState.nicheKey] || NICHE_REGISTRY.repair;
  const geoTags = buildDynamicGeoTags(activeNicheState.targetCity, current.geoSuffix);
  const tagBlock = '\n\n' + [...current.broadTags, ...current.nicheTags, ...geoTags].join(' ');

  const contentArea = document.getElementById('newContent');
  if (contentArea) {
    contentArea.value = (contentArea.value || '').trim() + tagBlock;
  }
  showTab('creator');
  showToast('✨ Pushed 3-tier hashtags into Content Studio!');
}

function copyGscRegex(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const regexStr = el.textContent.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(regexStr);
  }
  showToast(`📋 Copied GSC Regex! Paste in Search Console ➔ Performance ➔ Query ➔ Regex`);
}

function convertFaqToScheduledPost(customQuestion) {
  const input = document.getElementById('faqQueryInput');
  const question = (customQuestion || input?.value || '').trim();
  if (!question) {
    showToast('Please type or pick a search question first!');
    return;
  }

  const current = NICHE_REGISTRY[activeNicheState.nicheKey] || NICHE_REGISTRY.repair;
  const clientName = state.currentClient?.name || 'Big Byte Systems';
  const phone = state.currentClient?.hotline || '090547 90592';
  const address = state.currentClient?.address || 'Shop No 1, Khewra Cir Marg, Manpada, Thane West';

  const cleanQ = question.replace(/^[0-9.\s]+/, '').trim();
  const title = `🔬 Decoded: ${cleanQ}`;
  const hook = `Wait! Before you make an expensive decision about ${cleanQ.toLowerCase().replace(/^(can|why|how|what|is)\s+/i, '')}, here is what actually happens.`;
  const script = `Most general service providers don't give you transparent answers. In our laboratory at ${clientName}, we verify the exact cause with precision diagnostics before recommending any work. Here is the technical reality behind ${cleanQ}.`;

  const geoTags = buildDynamicGeoTags(activeNicheState.targetCity, current.geoSuffix);
  const tagsStr = [...current.broadTags.slice(0, 4), ...current.nicheTags.slice(0, 4), ...geoTags.slice(0, 3)].join(' ');

  const aeoBlock = `\n\n💡 AI Answer Capsule:\nQ: ${cleanQ}\nA: At ${clientName} (${address}), technicians isolate the exact fault before recommending any replacement. 4.9★ Google Verified.`;
  const content = `${cleanQ} — Decoded!\n\nWhen customers ask us this, the answer comes down to precision diagnostics rather than guess-work. We isolate the root cause transparently so you save money and retain original hardware.${aeoBlock}\n\n📍 ${clientName} — ${address}\n📞 Voice Support: ${phone}\n💬 WhatsApp / Triage: Tap Link in Bio (@bigbytessystem)\n\n${tagsStr}`;

  // Pre-fill Creator Form
  const titleInput = document.getElementById('newTitle');
  const hookInput = document.getElementById('newVideoHook');
  const scriptInput = document.getElementById('newScript');
  const contentInput = document.getElementById('newContent');
  const platformSel = document.getElementById('newPlatform');

  if (titleInput) titleInput.value = title;
  if (hookInput) hookInput.value = hook;
  if (scriptInput) scriptInput.value = script;
  if (contentInput) contentInput.value = content;
  if (platformSel) platformSel.value = 'instagram';

  // Apply Blueprint
  const bpSel = document.getElementById('infographicBlueprint');
  if (bpSel) {
    bpSel.value = current.blueprint || 'diagnostic';
    handleBlueprintChange(bpSel.value);
  }

  // Update Canvas Headline
  state.canvasHeadline = title;
  state.canvasHook = hook;
  renderStudioCanvas();

  // Switch to Creator Tab
  showTab('creator');
  showToast(`🚀 Converted GSC Question into Post & 1080p Infographic!`);
}

