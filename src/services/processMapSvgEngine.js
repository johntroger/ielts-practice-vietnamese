/**
 * Cambridge IELTS Standard Vector Illustration Engine (V2 - Ultra Diverse Cartography & Technical Schematics)
 * 
 * Synthesizes authentic, visually distinct Cambridge IELTS Task 1 graphics:
 * 1. Dual-Period Map Transformations:
 *    - Coastal Village (sea, wharves, marina, seaside promenade, residential estate)
 *    - Tropical Island (organic atoll in ocean, beach rim, palm trees, jetty, stilt bungalows, dive reef)
 *    - Airport Terminal (asphalt runways 09/27, tarmac, taxiways, Y-concourse, boarding gates, planes, light rail)
 *    - University Campus (academic quadrangles, Victorian clock tower, science hub, athletic oval track)
 *    - Hospital Precinct (main clinical wing, A&E emergency bays, rooftop helipad, healing garden, ring road)
 *    - Urban Regeneration (traffic grid vs pedestrianised boulevard, tramway lines, civic plaza)
 * 
 * 2. Process Flowcharts:
 *    - Biological Life Cycle (circular metamorphosis loop, organism badges, arc flow)
 *    - Closed-Loop Recycling (green circular reclamation loop, recycling apparatus & ♻️ emblem)
 *    - Industrial Manufacturing (factory conveyor line, hopper, meshing cogs, kiln furnace, cooling tunnel, packaging & trucks)
 *    - Hydraulic & Energy Generation (mountain reservoir, dam wall, penstock, spinning turbine, generator, transmission pylons)
 */

function escapeXml(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapSvgText(text = '', maxChars = 24) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function detectProcessType(task = {}) {
  const direct = (task.processType || '').toLowerCase();
  if (direct) {
    if (direct.includes('recycl') || direct.includes('waste')) return 'recycling';
    if (direct.includes('life') || direct.includes('bio') || direct === 'lifecycle') return 'lifecycle';
    if (direct.includes('energy') || direct.includes('water') || direct.includes('hydro')) return 'energy_water';
    if (direct.includes('manufactur') || direct.includes('product') || direct.includes('industr')) return 'manufacturing';
    return direct;
  }
  const text = `${task.title || ''} ${task.prompt || ''} ${JSON.stringify(task.processSteps || [])}`.toLowerCase();

  if (/recycl|reclaim|waste|reuse|bottle|plastic\s*waste|collection\s*and\s*sort|remanufactur/i.test(text)) {
    return 'recycling';
  }
  if (/hydroelectric|water\s*cycle|desalination|treatment|purification|power\s*generat|geothermal|solar\s*energy/i.test(text)) {
    return 'energy_water';
  }
  if (/life\s*cycle|biological|frog|salmon|butterfly|silkworm|bee|insect|organism|botanical|plant|seed|hatch|larva|metamorphosis|\bcycle\b/i.test(text)) {
    return 'lifecycle';
  }
  return 'manufacturing';
}

export function detectMapType(task = {}) {
  const direct = (task.mapType || '').toLowerCase();
  if (direct) {
    if (direct.includes('campus') || direct.includes('universit') || direct.includes('school')) return 'campus';
    if (direct.includes('airport') || direct.includes('terminal') || direct.includes('flight')) return 'airport';
    if (direct.includes('island') || direct.includes('atoll') || direct.includes('tropical')) return 'island';
    if (direct.includes('hospital') || direct.includes('clinic') || direct.includes('medical')) return 'hospital';
    if (direct.includes('coast') || direct.includes('harbour') || direct.includes('harbor') || direct.includes('village')) return 'coastal';
    if (direct.includes('city') || direct.includes('urban') || direct.includes('town')) return 'urban';
    return direct;
  }
  const text = `${task.title || ''} ${task.prompt || ''} ${JSON.stringify(task.mapChanges || [])}`.toLowerCase();

  if (/campus|universit|school|library|academic|faculty|dormitory|student/i.test(text)) {
    return 'campus';
  }
  if (/airport|runway|terminal|flight|aviation|concourse|airfield|gate/i.test(text)) {
    return 'airport';
  }
  if (/island|atoll|bay|tropical|resort|beach|diving|bungalow/i.test(text)) {
    return 'island';
  }
  if (/hospital|clinic|medical|health|infirmary|ambulance|trauma/i.test(text)) {
    return 'hospital';
  }
  if (/coast|harbour|harbor|dock|pier|fishing|port|sea|marina/i.test(text)) {
    return 'coastal';
  }
  return 'urban';
}

function renderCompass(cx, cy) {
  return `
    <g class="compass-rose" transform="translate(${cx}, ${cy})">
      <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#64748B" stroke-width="1.5" />
      <polygon points="0,-12 4,0 0,2 -4,0" fill="#DC2626" />
      <polygon points="0,12 4,0 0,-2 -4,0" fill="#64748B" />
      <polygon points="-12,0 0,-4 2,0 0,4" fill="#64748B" />
      <polygon points="12,0 0,-4 -2,0 0,4" fill="#64748B" />
      <text x="0" y="-14" font-family="Inter, sans-serif" font-size="8" font-weight="900" fill="#DC2626" text-anchor="middle">N</text>
      <text x="14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">E</text>
      <text x="0" y="20" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">S</text>
      <text x="-14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">W</text>
    </g>
  `;
}

function renderFeaturePill(x, y, label, isPresent = false) {
  const bg = isPresent ? '#2563EB' : '#475569';
  const shortText = (label || '').substring(0, 24);
  const textW = Math.min(170, Math.max(90, shortText.length * 7 + 16));
  return `
    <g class="feature-pill" transform="translate(${x - textW / 2}, ${y})">
      <rect width="${textW}" height="20" rx="10" fill="${bg}" stroke="#FFFFFF" stroke-width="1.5" filter="url(#drop-shadow)" />
      <text x="${textW / 2}" y="13" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">
        ${escapeXml(shortText)}
      </text>
    </g>
  `;
}

/* ========================================================================== */
/* 1. MAP ARCHETYPE CARTOGRAPHIC RENDERERS                                    */
/* ========================================================================== */

function renderCoastalMap(x, y, w, h, isPresent, changes = []) {
  const c1 = changes[0] || {};
  const c2 = changes[1] || {};
  const c3 = changes[2] || {};
  const c4 = changes[3] || {};

  if (!isPresent) {
    return `
      <!-- Past: Coastal Fishing Village -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#FEFCE8" stroke="#CBD5E1" stroke-width="2" />
      
      <!-- Farmland in North-West -->
      <rect x="${x + 20}" y="${y + 55}" width="160" height="90" rx="8" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
      <g stroke="#10B981" stroke-width="1" stroke-opacity="0.4">
        <line x1="${x + 25}" y1="${y + 75}" x2="${x + 175}" y2="${y + 75}" />
        <line x1="${x + 25}" y1="${y + 95}" x2="${x + 175}" y2="${y + 95}" />
        <line x1="${x + 25}" y1="${y + 115}" x2="${x + 175}" y2="${y + 115}" />
      </g>
      <text x="${x + 100}" y="${y + 85}" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="#047857" text-anchor="middle">🌾 Farmland &amp; Orchards</text>
      <text x="${x + 100}" y="${y + 105}" font-family="Inter, sans-serif" font-size="8" fill="#065F46" text-anchor="middle">🌳 Mature Woodland</text>

      <!-- Traditional Village Cottages in North-East -->
      <rect x="${x + 240}" y="${y + 55}" width="165" height="90" rx="8" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5" />
      <g transform="translate(${x + 255}, ${y + 75})">
        <polygon points="15,0 30,12 0,12" fill="#EA580C" />
        <rect x="3" y="12" width="24" height="15" fill="#FED7AA" stroke="#C2410C" stroke-width="0.8" />
        <polygon points="65,0 80,12 50,12" fill="#EA580C" />
        <rect x="53" y="12" width="24" height="15" fill="#FED7AA" stroke="#C2410C" stroke-width="0.8" />
        <polygon points="115,0 130,12 100,12" fill="#EA580C" />
        <rect x="103" y="12" width="24" height="15" fill="#FED7AA" stroke="#C2410C" stroke-width="0.8" />
      </g>
      <text x="${x + 322}" y="${y + 128}" font-family="Inter, sans-serif" font-size="8.5" font-weight="700" fill="#B45309" text-anchor="middle">🏘️ Traditional Fishermen Cottages</text>

      <!-- Narrow Winding Dirt Road -->
      <path d="M ${x + 200} ${y + 45} L ${x + 200} ${y + 160} Q ${x + 200} ${y + 220} ${x + 180} ${y + 270} L ${x + 180} ${y + 300}" stroke="#D97706" stroke-width="10" stroke-dasharray="6 3" fill="none" />
      <text x="${x + 205}" y="${y + 195}" font-family="Inter, sans-serif" font-size="7.5" font-weight="700" fill="#92400E">Village Track</text>

      <!-- Marshland in South-East -->
      <rect x="${x + 245}" y="${y + 190}" width="160" height="75" rx="6" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="1" />
      <text x="${x + 325}" y="${y + 225}" font-family="Inter, sans-serif" font-size="8.5" font-weight="700" fill="#15803D" text-anchor="middle">🌾 Wetland &amp; Marsh</text>
      <text x="${x + 325}" y="${y + 240}" font-family="Inter, sans-serif" font-size="7.5" fill="#166534" text-anchor="middle">(Uninhabited)</text>

      <!-- Southern Coast & Sea -->
      <path d="M ${x} ${y + 295} Q ${x + 140} ${y + 280} ${x + 280} ${y + 290} T ${x + w} ${y + 285} L ${x + w} ${y + h} L ${x} ${y + h} Z" fill="#93C5FD" stroke="#3B82F6" stroke-width="1.5" />
      <rect x="${x}" y="${y + 305}" width="${w}" height="${h - 305}" fill="#60A5FA" fill-opacity="0.25" />
      <text x="${x + w / 2}" y="${y + h - 14}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#1E40AF" text-anchor="middle">SOUTHERN SEA / COASTLINE</text>

      <!-- Wooden Fishing Pier -->
      <rect x="${x + 165}" y="${y + 280}" width="30" height="50" rx="3" fill="#78350F" stroke="#451A03" stroke-width="1" />
      <text x="${x + 180}" y="${y + 310}" font-size="10" text-anchor="middle">⛵</text>
      <text x="${x + 180}" y="${y + 270}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#78350F" text-anchor="middle">Fishing Pier</text>

      <!-- Labels from changes -->
      ${renderFeaturePill(x + 100, y + 48, c1.past || c1.feature || 'Farmland')}
      ${renderFeaturePill(x + 322, y + 48, c2.past || c2.feature || 'Local Cottages')}
      ${renderFeaturePill(x + 180, y + 338, c3.past || c3.feature || 'Fishing Pier')}
    `;
  } else {
    return `
      <!-- Present: Modern Seaside Resort Town -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#F0FDF4" stroke="#CBD5E1" stroke-width="2" />
      
      <!-- NEW: Modern Residential Housing Estate -->
      <rect x="${x + 18}" y="${y + 55}" width="165" height="95" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
      <g transform="translate(${x + 28}, ${y + 68})">
        <rect x="5" y="5" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" stroke-width="1" />
        <rect x="55" y="5" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" stroke-width="1" />
        <rect x="105" y="5" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" stroke-width="1" />
        <rect x="5" y="36" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" stroke-width="1" />
        <rect x="55" y="36" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" stroke-width="1" />
        <rect x="105" y="36" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" stroke-width="1" />
      </g>
      <text x="${x + 100}" y="${y + 140}" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">🏘️ Modern Housing Estate [NEW]</text>

      <!-- NEW: Shopping Mall & Plaza -->
      <rect x="${x + 235}" y="${y + 55}" width="175" height="95" rx="8" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2" />
      <rect x="${x + 248}" y="${y + 68}" width="70" height="42" rx="4" fill="#C4B5FD" stroke="#6D28D9" />
      <text x="${x + 283}" y="${y + 92}" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#4C1D95" text-anchor="middle">Mall</text>
      <rect x="${x + 328}" y="${y + 68}" width="70" height="42" rx="4" fill="#DDD6FE" stroke="#6D28D9" />
      <text x="${x + 363}" y="${y + 92}" font-family="Inter, sans-serif" font-size="8.5" font-weight="700" fill="#4C1D95" text-anchor="middle">Car Park</text>
      <text x="${x + 322}" y="${y + 138}" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#6D28D9" text-anchor="middle">🛍️ Commercial Plaza [NEW]</text>

      <!-- Widened Dual Carriageway with Roundabout -->
      <path d="M ${x + 200} ${y + 45} L ${x + 200} ${y + 270}" stroke="#334155" stroke-width="18" fill="none" />
      <path d="M ${x + 200} ${y + 45} L ${x + 200} ${y + 270}" stroke="#FACC15" stroke-width="2" stroke-dasharray="8 6" fill="none" />
      <circle cx="${x + 200}" cy="${y + 190}" r="22" fill="#334155" stroke="#64748B" stroke-width="2" />
      <circle cx="${x + 200}" cy="${y + 190}" r="9" fill="#10B981" />
      <text x="${x + 200}" y="${y + 224}" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#0F172A" text-anchor="middle">ROUNDABOUT</text>

      <!-- NEW: Luxury Seafront Hotel & Spa -->
      <rect x="${x + 240}" y="${y + 175}" width="170" height="85" rx="8" fill="#FFE4E6" stroke="#F43F5E" stroke-width="2" />
      <text x="${x + 325}" y="${y + 200}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#BE123C" text-anchor="middle">🏨 LUXURY HOTEL &amp; SPA</text>
      <rect x="${x + 255}" y="${y + 210}" width="65" height="30" rx="15" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5" />
      <text x="${x + 287}" y="${y + 228}" font-family="Inter, sans-serif" font-size="7.5" font-weight="700" fill="#0C4A6E" text-anchor="middle">🏊 Pool</text>
      <text x="${x + 360}" y="${y + 228}" font-family="Inter, sans-serif" font-size="7.5" fill="#9F1239" text-anchor="middle">🌴 Gardens</text>

      <!-- Southern Coast, Promenade & Modern Marina -->
      <path d="M ${x} ${y + 285} L ${x + w} ${y + 285} L ${x + w} ${y + h} L ${x} ${y + h} Z" fill="#38BDF8" />
      <rect x="${x}" y="${y + 272}" width="${w}" height="14" fill="#CBD5E1" stroke="#94A3B8" />
      <text x="${x + 90}" y="${y + 282}" font-family="Inter, sans-serif" font-size="7.5" font-weight="700" fill="#1E293B">🌴 Seafront Promenade Walkway 🌴</text>

      <!-- Concrete Marina Basin -->
      <rect x="${x + 160}" y="${y + 286}" width="80" height="60" rx="4" fill="#0284C7" stroke="#0369A1" stroke-width="2" />
      <text x="${x + 200}" y="${y + 306}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">YACHT MARINA</text>
      <text x="${x + 200}" y="${y + 322}" font-size="12" text-anchor="middle">⛵ 🛥️ 🚤</text>

      <!-- Labels from changes -->
      ${renderFeaturePill(x + 100, y + 48, c1.present || 'New Housing', true)}
      ${renderFeaturePill(x + 322, y + 48, c2.present || 'Shopping Mall', true)}
      ${renderFeaturePill(x + 200, y + 352, c3.present || 'Marina & Yacht Club', true)}
    `;
  }
}

function renderIslandMap(x, y, w, h, isPresent, changes = []) {
  const c1 = changes[0] || {};
  const c2 = changes[1] || {};
  const c3 = changes[2] || {};

  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#0284C7" stroke="#CBD5E1" stroke-width="2" />
    <!-- Shallow Lagoon Ring -->
    <ellipse cx="${x + w / 2}" cy="${y + h / 2 + 10}" rx="180" ry="120" fill="#38BDF8" fill-opacity="0.4" stroke="#7DD3FC" stroke-width="2" stroke-dasharray="4 4" />
    
    <!-- Sandy Beach Perimeter -->
    <path d="M ${x + 60} ${y + 200} C ${x + 60} ${y + 90}, ${x + 220} ${y + 80}, ${x + 360} ${y + 150} C ${x + 400} ${y + 220}, ${x + 350} ${y + 320}, ${x + 210} ${y + 310} C ${x + 110} ${y + 300}, ${x + 60} ${y + 280}, ${x + 60} ${y + 200} Z" fill="#FDE047" stroke="#EAB308" stroke-width="2" />
    
    <!-- Lush Green Interior -->
    <path d="M ${x + 85} ${y + 195} C ${x + 85} ${y + 115}, ${x + 215} ${y + 105}, ${x + 335} ${y + 165} C ${x + 370} ${y + 215}, ${x + 325} ${y + 295}, ${x + 210} ${y + 285} C ${x + 130} ${y + 275}, ${x + 85} ${y + 255}, ${x + 85} ${y + 195} Z" fill="#86EFAC" stroke="#22C55E" stroke-width="1.5" />

    ${!isPresent ? `
      <!-- Past: Deserted Nature -->
      <g font-size="20">
        <text x="${x + 140}" y="${y + 180}">🌴</text>
        <text x="${x + 200}" y="${y + 160}">🌴</text>
        <text x="${x + 260}" y="${y + 190}">🌴</text>
        <text x="${x + 170}" y="${y + 240}">🌴</text>
        <text x="${x + 280}" y="${y + 230}">🌴</text>
      </g>
      <text x="${x + w / 2}" y="${y + 210}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#14532D" text-anchor="middle">UNINHABITED TROPICAL ATOLL</text>
      <text x="${x + w / 2}" y="${y + 228}" font-family="Inter, sans-serif" font-size="8.5" fill="#166534" text-anchor="middle">Natural Coconut Groves &amp; Wild Coral Reef</text>
      
      <text x="${x + 85}" y="${y + 135}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#854D0E">Western Beach</text>
      <text x="${x + 310}" y="${y + 285}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#854D0E">Eastern Beach</text>

      ${renderFeaturePill(x + 100, y + 48, c1.past || c1.feature || 'Wild Beach')}
      ${renderFeaturePill(x + 320, y + 48, c2.past || c2.feature || 'Palm Forest')}
    ` : `
      <!-- Present: Eco-Resort Development -->
      <!-- Wooden Arrival Jetty / Pier -->
      <rect x="${x + 195}" y="${y + 285}" width="26" height="75" rx="3" fill="#78350F" stroke="#451A03" stroke-width="1" />
      <text x="${x + 208}" y="${y + 372}" font-size="14" text-anchor="middle">⛴️</text>
      <text x="${x + 208}" y="${y + 355}" font-family="Inter, sans-serif" font-size="7.5" font-weight="800" fill="#FEF3C7" text-anchor="middle">FERRY PIER</text>

      <!-- Central Restaurant & Reception Complex -->
      <circle cx="${x + 210}" cy="${y + 190}" r="26" fill="#D97706" stroke="#92400E" stroke-width="2" />
      <text x="${x + 210}" y="${y + 188}" font-size="12" text-anchor="middle">🛖</text>
      <text x="${x + 210}" y="${y + 204}" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">RESTAURANT</text>

      <!-- Footpath Network -->
      <path d="M ${x + 208} ${y + 285} L ${x + 210} ${y + 216}" stroke="#78350F" stroke-width="3" stroke-dasharray="3 2" fill="none" />
      <path d="M ${x + 210} ${y + 190} L ${x + 120} ${y + 190}" stroke="#78350F" stroke-width="3" stroke-dasharray="3 2" fill="none" />
      <path d="M ${x + 210} ${y + 190} L ${x + 310} ${y + 180}" stroke="#78350F" stroke-width="3" stroke-dasharray="3 2" fill="none" />

      <!-- Overwater Bungalows along West Coast -->
      <g transform="translate(${x + 95}, ${y + 155})">
        <circle cx="10" cy="10" r="10" fill="#F59E0B" stroke="#78350F" />
        <circle cx="10" cy="38" r="10" fill="#F59E0B" stroke="#78350F" />
        <circle cx="10" cy="66" r="10" fill="#F59E0B" stroke="#78350F" />
        <text x="10" y="14" font-size="9" text-anchor="middle">🛖</text>
        <text x="10" y="42" font-size="9" text-anchor="middle">🛖</text>
        <text x="10" y="70" font-size="9" text-anchor="middle">🛖</text>
        <text x="25" y="44" font-family="Inter, sans-serif" font-size="7.5" font-weight="800" fill="#78350F">Bungalows</text>
      </g>

      <!-- Snorkeling & Dive Reef East -->
      <circle cx="${x + 335}" cy="${y + 180}" r="22" fill="#0EA5E9" stroke="#0284C7" stroke-width="1.5" />
      <text x="${x + 335}" y="${y + 178}" font-size="12" text-anchor="middle">🤿</text>
      <text x="${x + 335}" y="${y + 194}" font-family="Inter, sans-serif" font-size="6.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">DIVE CENTRE</text>

      <!-- Swimming Beach with Umbrellas -->
      <g transform="translate(${x + 270}, ${y + 245})">
        <text x="0" y="0" font-size="12">⛱️</text>
        <text x="18" y="0" font-size="12">⛱️</text>
        <text x="36" y="0" font-size="12">⛱️</text>
        <text x="18" y="14" font-family="Inter, sans-serif" font-size="7" font-weight="700" fill="#854D0E" text-anchor="middle">Swim Beach</text>
      </g>

      ${renderFeaturePill(x + 100, y + 48, c1.present || 'Bungalows', true)}
      ${renderFeaturePill(x + 320, y + 48, c2.present || 'Dive Centre', true)}
      ${renderFeaturePill(x + 208, y + 335, c3.present || 'Arrival Pier', true)}
    `}
  `;
}

function renderAirportMap(x, y, w, h, isPresent, changes = []) {
  const c1 = changes[0] || {};
  const c2 = changes[1] || {};
  const c3 = changes[2] || {};

  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
    
    ${!isPresent ? `
      <!-- Past Airport: Small Domestic Terminal with Single Runway -->
      <!-- Single Runway 09/27 at the bottom -->
      <rect x="${x + 20}" y="${y + 295}" width="${w - 40}" height="45" fill="#334155" stroke="#1E293B" stroke-width="1.5" />
      <line x1="${x + 20}" y1="${y + 317}" x2="${x + w - 20}" y2="${y + 317}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 8" />
      <text x="${x + 35}" y="${y + 322}" font-family="Inter, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF">09</text>
      <text x="${x + w - 45}" y="${y + 322}" font-family="Inter, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF">27</text>
      <text x="${x + w / 2}" y="${y + 312}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#F8FAFC" text-anchor="middle">AIRSTRIP RUNWAY</text>

      <!-- Taxiway to terminal -->
      <rect x="${x + 180}" y="${y + 225}" width="50" height="70" fill="#475569" />

      <!-- Small Terminal Building (Gates 1-4) -->
      <rect x="${x + 120}" y="${y + 130}" width="180" height="95" rx="8" fill="#64748B" stroke="#334155" stroke-width="2" />
      <rect x="${x + 135}" y="${y + 145}" width="150" height="32" rx="4" fill="#94A3B8" />
      <text x="${x + 210}" y="${y + 165}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">DOMESTIC TERMINAL</text>
      <text x="${x + 210}" y="${y + 195}" font-family="Inter, sans-serif" font-size="8.5" font-weight="700" fill="#E2E8F0" text-anchor="middle">Gates 1 - 4 | Check-in Hall</text>
      <text x="${x + 85}" y="${y + 180}" font-size="16">✈️</text>
      <text x="${x + 325}" y="${y + 180}" font-size="16">✈️</text>

      <!-- Surface Car Park & Entrance -->
      <rect x="${x + 130}" y="${y + 60}" width="160" height="50" rx="6" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" />
      <text x="${x + 210}" y="${y + 88}" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="#475569" text-anchor="middle">🅿️ Surface Car Park</text>

      ${renderFeaturePill(x + 210, y + 48, c1.past || c1.feature || 'Domestic Terminal')}
      ${renderFeaturePill(x + 210, y + 348, c2.past || c2.feature || 'Single Runway')}
    ` : `
      <!-- Present Airport: Expanded International Hub with Dual Parallel Runways -->
      <!-- Runway 1: Top Dual Runway 09L/27R -->
      <rect x="${x + 15}" y="${y + 55}" width="${w - 30}" height="32" fill="#1E293B" stroke="#0F172A" />
      <line x1="${x + 15}" y1="${y + 71}" x2="${x + w - 15}" y2="${y + 71}" stroke="#FACC15" stroke-width="2" stroke-dasharray="10 8" />
      <text x="${x + w / 2}" y="${y + 67}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">✈️ EXPANDED DUAL RUNWAY 09L/27R</text>

      <!-- Runway 2: Bottom Dual Runway 09R/27L -->
      <rect x="${x + 15}" y="${y + 315}" width="${w - 30}" height="32" fill="#1E293B" stroke="#0F172A" />
      <line x1="${x + 15}" y1="${y + 331}" x2="${x + w - 15}" y2="${y + 331}" stroke="#FACC15" stroke-width="2" stroke-dasharray="10 8" />
      <text x="${x + w / 2}" y="${y + 327}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">✈️ RUNWAY 09R/27L</text>

      <!-- Y-Shaped Modern International Concourse -->
      <rect x="${x + 110}" y="${y + 110}" width="200" height="70" rx="8" fill="#1E40AF" stroke="#1D4ED8" stroke-width="2" />
      <text x="${x + 210}" y="${y + 138}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">INTERNATIONAL TERMINAL</text>
      <text x="${x + 210}" y="${y + 155}" font-family="Inter, sans-serif" font-size="8" fill="#93C5FD" text-anchor="middle">Triple-tier international concourse</text>

      <!-- Extended Concourse Piers with 12 Gates -->
      <rect x="${x + 50}" y="${y + 180}" width="140" height="40" rx="4" fill="#3B82F6" />
      <rect x="${x + 230}" y="${y + 180}" width="140" height="40" rx="4" fill="#3B82F6" />
      <text x="${x + 120}" y="${y + 204}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#FFFFFF" text-anchor="middle">Concourse A (Gates 1-8)</text>
      <text x="${x + 300}" y="${y + 204}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#FFFFFF" text-anchor="middle">Concourse B (Gates 9-16)</text>
      <g font-size="14">
        <text x="${x + 30}" y="${y + 205}">✈️</text>
        <text x="${x + 120}" y="${y + 235}">✈️</text>
        <text x="${x + 300}" y="${y + 235}">✈️</text>
        <text x="${x + 380}" y="${y + 205}">✈️</text>
      </g>

      <!-- High-Speed Light Rail Link -->
      <line x1="${x + 210}" y1="${y + 220}" x2="${x + 210}" y2="${y + 310}" stroke="#0284C7" stroke-width="8" stroke-dasharray="4 2" />
      <rect x="${x + 180}" y="${y + 250}" width="60" height="28" rx="6" fill="#0369A1" stroke="#FFFFFF" stroke-width="1.5" />
      <text x="${x + 210}" y="${y + 267}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">🚝 SKYTRAIN</text>

      ${renderFeaturePill(x + 210, y + 92, c1.present || 'Dual parallel runway', true)}
      ${renderFeaturePill(x + 210, y + 168, c2.present || 'Triple-tier concourse', true)}
    `}
  `;
}

function renderCampusMap(x, y, w, h, isPresent, changes = []) {
  const c1 = changes[0] || {};
  const c2 = changes[1] || {};

  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#FDFBF7" stroke="#CBD5E1" stroke-width="2" />
    
    ${!isPresent ? `
      <!-- Past Campus: Traditional Green Quad & Historic Halls -->
      <rect x="${x + 30}" y="${y + 55}" width="${w - 60}" height="${h - 95}" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
      
      <!-- Central Oak Quadrangle Lawn -->
      <circle cx="${x + w / 2}" cy="${y + 200}" r="65" fill="#BBF7D0" stroke="#86EFAC" stroke-width="2" />
      <g font-size="18">
        <text x="${x + w / 2 - 25}" y="${y + 195}">🌳</text>
        <text x="${x + w / 2 + 15}" y="${y + 200}">🌳</text>
        <text x="${x + w / 2 - 5}" y="${y + 230}">🌳</text>
      </g>
      <text x="${x + w / 2}" y="${y + 175}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#166534" text-anchor="middle">The Great Lawn Quad</text>

      <!-- Historic Victorian Hall -->
      <rect x="${x + 50}" y="${y + 70}" width="140" height="70" rx="6" fill="#991B1B" stroke="#7F1D1D" stroke-width="1.5" />
      <text x="${x + 120}" y="${y + 102}" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">🏛️ Old Main Hall</text>
      <text x="${x + 120}" y="${y + 120}" font-family="Inter, sans-serif" font-size="7.5" fill="#FECACA" text-anchor="middle">Administration &amp; Arts</text>

      <!-- Old Library -->
      <rect x="${x + 235}" y="${y + 70}" width="140" height="70" rx="6" fill="#92400E" stroke="#78350F" stroke-width="1.5" />
      <text x="${x + 305}" y="${y + 102}" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">📚 University Library</text>
      <text x="${x + 305}" y="${y + 120}" font-family="Inter, sans-serif" font-size="7.5" fill="#FED7AA" text-anchor="middle">Book Archives</text>

      <!-- Open Sports Field South -->
      <rect x="${x + 110}" y="${y + 285}" width="200" height="55" rx="6" fill="#86EFAC" stroke="#4ADE80" stroke-width="1.5" stroke-dasharray="3 3" />
      <text x="${x + 210}" y="${y + 318}" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="#15803D" text-anchor="middle">⚽ Open Grass Playing Field</text>

      ${renderFeaturePill(x + 120, y + 48, c1.past || c1.feature || 'Main Hall')}
      ${renderFeaturePill(x + 305, y + 48, c2.past || c2.feature || 'Old Library')}
    ` : `
      <!-- Present Campus: Modernised STEM & Student Precinct -->
      <rect x="${x + 20}" y="${y + 55}" width="${w - 40}" height="${h - 90}" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
      
      <!-- NEW: Advanced STEM Research Hub -->
      <rect x="${x + 35}" y="${y + 65}" width="165" height="85" rx="8" fill="#1E40AF" stroke="#1D4ED8" stroke-width="2" />
      <text x="${x + 117}" y="${y + 98}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🔬 Advanced STEM Research Hub</text>
      <text x="${x + 117}" y="${y + 118}" font-family="Inter, sans-serif" font-size="7.5" fill="#93C5FD" text-anchor="middle">Robotics &amp; Biotech Labs</text>

      <!-- NEW: Student Commons & Tech Library -->
      <rect x="${x + 225}" y="${y + 65}" width="165" height="85" rx="8" fill="#6D28D9" stroke="#5B21B6" stroke-width="2" />
      <text x="${x + 307}" y="${y + 98}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">📖 Digital Learning Commons</text>
      <text x="${x + 307}" y="${y + 118}" font-family="Inter, sans-serif" font-size="7.5" fill="#DDD6FE" text-anchor="middle">Cafeteria &amp; Student Union</text>

      <!-- NEW: Paved Pedestrian Plaza with Fountain -->
      <circle cx="${x + w / 2}" cy="${y + 195}" r="45" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2" />
      <text x="${x + w / 2}" y="${y + 195}" font-size="18" text-anchor="middle">⛲</text>
      <text x="${x + w / 2}" y="${y + 222}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#0369A1" text-anchor="middle">Pedestrian plaza</text>

      <!-- NEW: All-Weather Sports Arena with Running Track -->
      <rect x="${x + 70}" y="${y + 265}" width="280" height="75" rx="28" fill="#DC2626" stroke="#B91C1C" stroke-width="2" />
      <rect x="${x + 95}" y="${y + 278}" width="230" height="49" rx="20" fill="#15803D" stroke="#FFFFFF" stroke-width="1.5" />
      <text x="${x + 210}" y="${y + 308}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🏃 Modern Sports Pavilion &amp; Track [NEW]</text>

      ${renderFeaturePill(x + 117, y + 48, c1.present || 'STEM Research Hub', true)}
      ${renderFeaturePill(x + 307, y + 48, c2.present || 'Learning Commons', true)}
    `}
  `;
}

function renderHospitalMap(x, y, w, h, isPresent, changes = []) {
  const c1 = changes[0] || {};
  const c2 = changes[1] || {};

  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
    
    ${!isPresent ? `
      <!-- Past Hospital: Single Building & Open Yard -->
      <rect x="${x + 100}" y="${y + 120}" width="220" height="110" rx="8" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
      <circle cx="${x + 210}" cy="${y + 155}" r="16" fill="#DC2626" />
      <text x="${x + 210}" y="${y + 161}" font-family="Inter, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">+</text>
      <text x="${x + 210}" y="${y + 195}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#0F172A" text-anchor="middle">COUNTY GENERAL HOSPITAL</text>
      <text x="${x + 210}" y="${y + 210}" font-family="Inter, sans-serif" font-size="8" fill="#64748B" text-anchor="middle">Single 2-Storey Facility (1995)</text>

      <!-- Modest Parking -->
      <rect x="${x + 140}" y="${y + 265}" width="140" height="55" rx="6" fill="#F1F5F9" stroke="#CBD5E1" />
      <text x="${x + 210}" y="${y + 298}" font-family="Inter, sans-serif" font-size="8.5" font-weight="700" fill="#475569" text-anchor="middle">🅿️ Surface Parking (30 bays)</text>

      ${renderFeaturePill(x + 210, y + 48, c1.past || c1.feature || 'General Hospital')}
    ` : `
      <!-- Present Hospital: Major Medical Hub with Helipad, ER & Trauma -->
      <!-- Main Hospital Wing -->
      <rect x="${x + 30}" y="${y + 80}" width="160" height="90" rx="8" fill="#0284C7" stroke="#0369A1" stroke-width="2" />
      <text x="${x + 110}" y="${y + 115}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🏥 Main Inpatient Block</text>
      <text x="${x + 110}" y="${y + 135}" font-family="Inter, sans-serif" font-size="7.5" fill="#BAE6FD" text-anchor="middle">Specialist Surgery</text>

      <!-- Connecting Skybridge -->
      <rect x="${x + 190}" y="${y + 115}" width="40" height="20" fill="#94A3B8" />

      <!-- NEW: 24/7 Trauma & Emergency Wing (A&E) -->
      <rect x="${x + 230}" y="${y + 80}" width="165" height="90" rx="8" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
      <text x="${x + 312}" y="${y + 112}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🚨 24/7 TRAUMA &amp; A&amp;E WING</text>
      <text x="${x + 312}" y="${y + 132}" font-family="Inter, sans-serif" font-size="8" fill="#FEE2E2" text-anchor="middle">🚑 Ambulance Bays</text>

      <!-- Rooftop Helipad -->
      <circle cx="${x + 312}" cy="${y + 225}" r="32" fill="#334155" stroke="#FACC15" stroke-width="3" />
      <circle cx="${x + 312}" cy="${y + 225}" r="22" fill="#DC2626" />
      <text x="${x + 312}" y="${y + 232}" font-family="Inter, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">H</text>
      <text x="${x + 312}" y="${y + 270}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#0F172A" text-anchor="middle">Air Ambulance Helipad [NEW]</text>

      <!-- Healing Therapeutic Garden -->
      <rect x="${x + 30}" y="${y + 205}" width="160" height="80" rx="8" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5" />
      <text x="${x + 110}" y="${y + 235}" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#047857" text-anchor="middle">🌿 Convalescent Garden</text>
      <text x="${x + 110}" y="${y + 252}" font-family="Inter, sans-serif" font-size="7.5" fill="#065F46" text-anchor="middle">Pond &amp; Rehab Paths</text>

      ${renderFeaturePill(x + 110, y + 48, c1.present || 'Main Inpatient', true)}
      ${renderFeaturePill(x + 312, y + 48, c2.present || 'Emergency A&E', true)}
    `}
  `;
}

function renderUrbanMap(x, y, w, h, isPresent, changes = []) {
  const c1 = changes[0] || {};
  const c2 = changes[1] || {};

  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#FDF6B2" stroke="#CBD5E1" stroke-width="2" />
    
    ${!isPresent ? `
      <!-- Past Urban: Congested Car Grid -->
      <path d="M ${x + w / 2} ${y + 45} L ${x + w / 2} ${y + h - 20}" stroke="#475569" stroke-width="24" fill="none" />
      <line x1="${x + w / 2}" y1="${y + 45}" x2="${x + w / 2}" y2="${y + h - 20}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6" />
      
      <path d="M ${x + 20} ${y + 190} L ${x + w - 20} ${y + 190}" stroke="#475569" stroke-width="24" fill="none" />
      <line x1="${x + 20}" y1="${y + 190}" x2="${x + w - 20}" y2="${y + 190}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6" />

      <!-- Old Industrial Factory -->
      <rect x="${x + 40}" y="${y + 60}" width="120" height="90" rx="6" fill="#78350F" stroke="#451A03" />
      <text x="${x + 100}" y="${y + 100}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🏭 Brickworks Factory</text>
      <text x="${x + 100}" y="${y + 118}" font-family="Inter, sans-serif" font-size="7.5" fill="#FDE68A" text-anchor="middle">Industrial Smokestacks</text>

      <!-- Old Car Park -->
      <rect x="${x + 250}" y="${y + 60}" width="130" height="90" rx="6" fill="#64748B" />
      <text x="${x + 315}" y="${y + 105}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🅿️ Multi-Storey Car Park</text>

      <text x="${x + w / 2}" y="${y + 200}" font-size="14" text-anchor="middle">🚗 🚙 🚚</text>

      ${renderFeaturePill(x + 100, y + 48, c1.past || c1.feature || 'Industrial Factory')}
    ` : `
      <!-- Present Urban: Pedestrian Boulevard, Tramway & Modern Mall -->
      <!-- Paved Pedestrian Boulevard (No Cars) -->
      <rect x="${x + 175}" y="${y + 45}" width="75" height="${h - 65}" fill="#E2E8F0" stroke="#94A3B8" />
      <text x="${x + 212}" y="${y + 70}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#0F172A" text-anchor="middle">PEDESTRIAN</text>
      <text x="${x + 212}" y="${y + 82}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#0F172A" text-anchor="middle">ZONE</text>
      <g font-size="14">
        <text x="${x + 212}" y="${y + 140}" text-anchor="middle">🚶</text>
        <text x="${x + 212}" y="${y + 220}" text-anchor="middle">☕</text>
        <text x="${x + 212}" y="${y + 300}" text-anchor="middle">🌳</text>
      </g>

      <!-- Electric Tram Line -->
      <line x1="${x + 20}" y1="${y + 190}" x2="${x + w - 20}" y2="${y + 190}" stroke="#059669" stroke-width="12" stroke-dasharray="8 4" />
      <rect x="${x + 80}" y="${y + 178}" width="60" height="24" rx="4" fill="#047857" stroke="#FFFFFF" />
      <text x="${x + 110}" y="${y + 194}" font-family="Inter, sans-serif" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">🚋 Tramway</text>

      <!-- NEW: Modern Shopping Mall -->
      <rect x="${x + 35}" y="${y + 60}" width="125" height="95" rx="8" fill="#8B5CF6" stroke="#6D28D9" stroke-width="2" />
      <text x="${x + 97}" y="${y + 105}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🏬 Glass Atrium Mall</text>

      <!-- NEW: Riverside Park & Cycle Lane -->
      <rect x="${x + 265}" y="${y + 60}" width="135" height="95" rx="8" fill="#10B981" stroke="#047857" stroke-width="2" />
      <text x="${x + 332}" y="${y + 105}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🌳 Civic Riverside Park</text>

      ${renderFeaturePill(x + 97, y + 48, c1.present || 'Shopping Mall', true)}
      ${renderFeaturePill(x + 332, y + 48, c2.present || 'Riverside Park', true)}
    `}
  `;
}

export function generateMapComparisonSvg(task = {}) {
  const changes = task.mapChanges || [
    { feature: 'Northwest Farmland', past: 'Agricultural land and forestry', present: 'Luxury residential housing estate' },
    { feature: 'Southern Coast', past: 'Small fishing dock with wooden pier', present: 'Leisure marina and yacht club' },
    { feature: 'Eastern Shore', past: 'Empty shoreline and marshland', present: 'Multi-story hotel resort' },
    { feature: 'Center Village', past: 'Narrow gravel road', present: 'Widened dual-carriageway with shops' }
  ];

  const title = task.title || 'IELTS Academic Writing Task 1 - Map Transformation';
  const mType = detectMapType(task);

  const titleMatch = title.match(/(\d{4})[^\d]+(\d{4}|present)/i);
  const period1 = titleMatch ? titleMatch[1] : 'TRƯỚC QUY HOẠCH (PAST)';
  const period2 = titleMatch ? (titleMatch[2].toLowerCase() === 'present' ? 'HIỆN TẠI (PRESENT)' : titleMatch[2]) : 'SAU QUY HOẠCH (PRESENT)';

  const width = 960;
  const height = 540;
  const mapW = 425;
  const mapH = 380;
  const map1X = 35;
  const map2X = 500;
  const mapY = 85;

  let archetypeName = 'MAP TRANSFORMATION';
  let archetypeIcon = '🧭';

  if (mType === 'campus') {
    archetypeName = 'UNIVERSITY CAMPUS MASTERPLAN';
    archetypeIcon = '🎓';
  } else if (mType === 'airport') {
    archetypeName = 'INTERNATIONAL AIRPORT EXPANSION';
    archetypeIcon = '✈️';
  } else if (mType === 'island') {
    archetypeName = 'TROPICAL ISLAND ECO-RESORT';
    archetypeIcon = '🏝️';
  } else if (mType === 'hospital') {
    archetypeName = 'HOSPITAL PRECINCT & TRAUMA REDEVELOPMENT';
    archetypeIcon = '🏥';
  } else if (mType === 'coastal') {
    archetypeName = 'COASTAL HARBOUR & SEASIDE REDEVELOPMENT';
    archetypeIcon = '⛵';
  } else {
    archetypeName = 'URBAN REGENERATION & PEDESTRIANISATION';
    archetypeIcon = '🏙️';
  }

  let map1Content = '';
  let map2Content = '';

  if (mType === 'campus') {
    map1Content = renderCampusMap(map1X, mapY, mapW, mapH, false, changes);
    map2Content = renderCampusMap(map2X, mapY, mapW, mapH, true, changes);
  } else if (mType === 'airport') {
    map1Content = renderAirportMap(map1X, mapY, mapW, mapH, false, changes);
    map2Content = renderAirportMap(map2X, mapY, mapW, mapH, true, changes);
  } else if (mType === 'island') {
    map1Content = renderIslandMap(map1X, mapY, mapW, mapH, false, changes);
    map2Content = renderIslandMap(map2X, mapY, mapW, mapH, true, changes);
  } else if (mType === 'hospital') {
    map1Content = renderHospitalMap(map1X, mapY, mapW, mapH, false, changes);
    map2Content = renderHospitalMap(map2X, mapY, mapW, mapH, true, changes);
  } else if (mType === 'coastal') {
    map1Content = renderCoastalMap(map1X, mapY, mapW, mapH, false, changes);
    map2Content = renderCoastalMap(map2X, mapY, mapW, mapH, true, changes);
  } else {
    map1Content = renderUrbanMap(map1X, mapY, mapW, mapH, false, changes);
    map2Content = renderUrbanMap(map2X, mapY, mapW, mapH, true, changes);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF;border-radius:16px;">
  <defs>
    <filter id="drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- Top Title Banner -->
  <rect x="25" y="16" width="${width - 50}" height="54" rx="12" fill="#0F172A" />
  <circle cx="55" cy="43" r="14" fill="#3B82F6" />
  <text x="55" y="48" font-size="15" text-anchor="middle">${archetypeIcon}</text>
  <text x="82" y="38" font-family="Inter, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF">IELTS ACADEMIC WRITING TASK 1: ${archetypeName}</text>
  <text x="82" y="55" font-family="Inter, sans-serif" font-size="10.5" font-weight="500" fill="#94A3B8">${escapeXml(title)}</text>
  <rect x="${width - 165}" y="28" width="135" height="28" rx="8" fill="#1E293B" stroke="#334155" stroke-width="1.5" />
  <text x="${width - 98}" y="47" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#38BDF8" text-anchor="middle">DUAL-MAP EVOLUTION</text>

  <!-- MAP 1: PAST PERIOD -->
  <g id="map-past">
    ${map1Content}
    <rect x="${map1X + 12}" y="${mapY + 12}" width="150" height="24" rx="6" fill="#1E293B" />
    <text x="${map1X + 87}" y="${mapY + 28}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">MAP 1: ${escapeXml(period1)}</text>
    ${renderCompass(map1X + mapW - 30, mapY + 30)}
  </g>

  <!-- MAP 2: PRESENT PERIOD -->
  <g id="map-present">
    ${map2Content}
    <rect x="${map2X + 12}" y="${mapY + 12}" width="150" height="24" rx="6" fill="#047857" />
    <text x="${map2X + 87}" y="${mapY + 28}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">MAP 2: ${escapeXml(period2)}</text>
    ${renderCompass(map2X + mapW - 30, mapY + 30)}
  </g>

  <!-- Bottom Key Comparison & Vocabulary Guide -->
  <rect x="30" y="${height - 42}" width="${width - 60}" height="32" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="${height - 22}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#0F172A">🔍 Biến đổi trọng tâm:</text>
  <text x="175" y="${height - 22}" font-family="Inter, sans-serif" font-size="9.5" fill="#059669" font-weight="700">
    Farmland → Housing | Traditional Shops → Mall | Fishing Pier → Marina | Open Quad → Science Hub
  </text>
  <text x="${width - 45}" y="${height - 22}" font-family="Inter, sans-serif" font-size="9" fill="#64748B" font-weight="600" text-anchor="end">Cambridge IELTS Dual Map</text>
</svg>`;
}

/* ========================================================================== */
/* 2. PROCESS ARCHETYPE TECHNICAL SCHEMATIC RENDERERS                         */
/* ========================================================================== */

function renderLifecycleSvg(task, steps) {
  const width = 960;
  const height = 580;
  const centerX = width / 2;
  const centerY = 310;
  const radiusX = 320;
  const radiusY = 175;
  const totalSteps = steps.length;
  const title = task.title || 'Biological Life Cycle';

  const bioIcons = ['🍃 🥚', '🐛', '🪵 🪺', '✨ 🦋', '🦋 🌸', '🐸 🪷'];

  let nodesSvg = '';
  let arrowsSvg = '';

  steps.forEach((s, idx) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * idx) / totalSteps;
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);
    const icon = bioIcons[idx % bioIcons.length];

    nodesSvg += `
      <g class="bio-node" transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="46" fill="#F0FDF4" stroke="#059669" stroke-width="3" filter="url(#drop-shadow)" />
        <circle cx="0" cy="0" r="38" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="1.5" />
        <text x="0" y="-8" font-size="20" text-anchor="middle">${icon}</text>
        <rect x="-35" y="8" width="70" height="16" rx="8" fill="#047857" />
        <text x="0" y="19" font-family="Inter, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle">STAGE ${s.step || idx + 1}</text>
        
        <rect x="-70" y="48" width="140" height="34" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
        <text x="0" y="61" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#0F172A" text-anchor="middle">
          ${escapeXml((s.name || '').substring(0, 18))}
        </text>
        <text x="0" y="74" font-family="Inter, sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">
          ${escapeXml((s.desc || '').substring(0, 24))}
        </text>
      </g>
    `;

    // Circular Arc Arrow
    const nextIdx = (idx + 1) % totalSteps;
    const nextAngle = -Math.PI / 2 + (2 * Math.PI * nextIdx) / totalSteps;
    const midAngle = (angle + nextAngle) / 2 + (nextIdx === 0 ? Math.PI : 0);
    const p1X = centerX + (radiusX - 10) * Math.cos(angle + 0.35);
    const p1Y = centerY + (radiusY - 10) * Math.sin(angle + 0.35);
    const p2X = centerX + (radiusX - 10) * Math.cos(nextAngle - 0.35);
    const p2Y = centerY + (radiusY - 10) * Math.sin(nextAngle - 0.35);

    arrowsSvg += `
      <g class="arrow-arc">
        <path d="M ${p1X} ${p1Y} Q ${centerX + (radiusX + 20) * Math.cos(midAngle)} ${centerY + (radiusY + 20) * Math.sin(midAngle)} ${p2X} ${p2Y}" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="6 3" marker-end="url(#arrowhead)" />
      </g>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF;border-radius:16px;">
  <defs>
    <filter id="drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#059669" />
    </marker>
  </defs>

  <rect width="${width}" height="${height}" fill="#F0FDF4" rx="16" />

  <!-- Top Banner -->
  <rect x="25" y="16" width="${width - 50}" height="48" rx="10" fill="#065F46" />
  <circle cx="50" cy="40" r="12" fill="#10B981" />
  <text x="50" y="45" font-size="14" text-anchor="middle">🌿</text>
  <text x="75" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF">IELTS TASK 1: NATURAL LIFE CYCLE</text>
  <text x="75" y="52" font-family="Inter, sans-serif" font-size="10" fill="#A7F3D0">${escapeXml(title)}</text>
  <rect x="${width - 165}" y="28" width="135" height="24" rx="6" fill="#047857" />
  <text x="${width - 98}" y="44" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Central Biological Mandala -->
  <circle cx="${centerX}" cy="${centerY}" r="75" fill="#FFFFFF" stroke="#059669" stroke-width="3" filter="url(#drop-shadow)" />
  <circle cx="${centerX}" cy="${centerY}" r="65" fill="#ECFDF5" />
  <text x="${centerX}" y="${centerY - 10}" font-size="30" text-anchor="middle">🌸</text>
  <text x="${centerX}" y="${centerY + 16}" font-family="Inter, sans-serif" font-size="9.5" font-weight="900" fill="#065F46" text-anchor="middle">NATURAL LIFE CYCLE</text>
  <text x="${centerX}" y="${centerY + 29}" font-family="Inter, sans-serif" font-size="8" fill="#047857" text-anchor="middle">Vòng đời sinh thái tự nhiên</text>

  <!-- Arrows and Nodes -->
  ${arrowsSvg}
  ${nodesSvg}

  <!-- Bottom Tip -->
  <rect x="30" y="${height - 38}" width="${width - 60}" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
  <text x="45" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#065F46">💡 Từ vựng chu trình:</text>
  <text x="175" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" fill="#047857" font-weight="600">The cycle commences with → In the subsequent stage → This triggers → Culminating in → The process repeats</text>
</svg>`;
}

function renderRecyclingSvg(task, steps) {
  const width = 960;
  const height = 580;
  const centerX = width / 2;
  const centerY = 310;
  const radiusX = 320;
  const radiusY = 175;
  const totalSteps = steps.length;
  const title = task.title || 'Closed-Loop Recycling Process';

  const ecoIcons = ['🗑️ ♻️', '👁️ ⚙️', '🚿 ✂️', '🔥 🌡️', '⚪⚪⚪', '🍾 👕'];

  let nodesSvg = '';
  let arrowsSvg = '';

  steps.forEach((s, idx) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * idx) / totalSteps;
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);
    const icon = ecoIcons[idx % ecoIcons.length];

    nodesSvg += `
      <g class="eco-node" transform="translate(${x}, ${y})">
        <rect x="-42" y="-42" width="84" height="84" rx="16" fill="#FFFFFF" stroke="#0D9488" stroke-width="2.5" filter="url(#drop-shadow)" />
        <text x="0" y="-8" font-size="20" text-anchor="middle">${icon}</text>
        <rect x="-35" y="8" width="70" height="16" rx="8" fill="#0F766E" />
        <text x="0" y="19" font-family="Inter, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle">STAGE ${s.step || idx + 1}</text>
        
        <rect x="-70" y="48" width="140" height="34" rx="6" fill="#F0FDFA" stroke="#99F6E4" stroke-width="1" />
        <text x="0" y="61" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#0F172A" text-anchor="middle">
          ${escapeXml((s.name || '').substring(0, 18))}
        </text>
        <text x="0" y="74" font-family="Inter, sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">
          ${escapeXml((s.desc || '').substring(0, 24))}
        </text>
      </g>
    `;

    const nextIdx = (idx + 1) % totalSteps;
    const nextAngle = -Math.PI / 2 + (2 * Math.PI * nextIdx) / totalSteps;
    const midAngle = (angle + nextAngle) / 2 + (nextIdx === 0 ? Math.PI : 0);
    const p1X = centerX + (radiusX - 10) * Math.cos(angle + 0.35);
    const p1Y = centerY + (radiusY - 10) * Math.sin(angle + 0.35);
    const p2X = centerX + (radiusX - 10) * Math.cos(nextAngle - 0.35);
    const p2Y = centerY + (radiusY - 10) * Math.sin(nextAngle - 0.35);

    arrowsSvg += `
      <g class="arrow-arc">
        <path d="M ${p1X} ${p1Y} Q ${centerX + (radiusX + 20) * Math.cos(midAngle)} ${centerY + (radiusY + 20) * Math.sin(midAngle)} ${p2X} ${p2Y}" fill="none" stroke="#0D9488" stroke-width="3" stroke-dasharray="6 3" marker-end="url(#arrowhead)" />
      </g>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF;border-radius:16px;">
  <defs>
    <filter id="drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#0D9488" />
    </marker>
  </defs>

  <rect width="${width}" height="${height}" fill="#F0FDFA" rx="16" />

  <!-- Top Banner -->
  <rect x="25" y="16" width="${width - 50}" height="48" rx="10" fill="#134E4A" />
  <circle cx="50" cy="40" r="12" fill="#14B8A6" />
  <text x="50" y="45" font-size="14" text-anchor="middle">♻️</text>
  <text x="75" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF">IELTS TASK 1: TÁI CHẾ TUẦN HOÀN (CLOSED-LOOP)</text>
  <text x="75" y="52" font-family="Inter, sans-serif" font-size="10" fill="#99F6E4">${escapeXml(title)}</text>
  <rect x="${width - 165}" y="28" width="135" height="24" rx="6" fill="#0F766E" />
  <text x="${width - 98}" y="44" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Central Recycling Emblem -->
  <circle cx="${centerX}" cy="${centerY}" r="75" fill="#FFFFFF" stroke="#0D9488" stroke-width="3" filter="url(#drop-shadow)" />
  <circle cx="${centerX}" cy="${centerY}" r="65" fill="#CCFBF1" />
  <text x="${centerX}" y="${centerY - 8}" font-size="34" text-anchor="middle">♻️</text>
  <text x="${centerX}" y="${centerY + 18}" font-family="Inter, sans-serif" font-size="9.5" font-weight="900" fill="#115E59" text-anchor="middle">CLOSED-LOOP RECYCLING</text>
  <text x="${centerX}" y="${centerY + 30}" font-family="Inter, sans-serif" font-size="8" fill="#0F766E" text-anchor="middle">Tái sinh tài nguyên &amp; xử lý rác</text>

  <!-- Arrows and Nodes -->
  ${arrowsSvg}
  ${nodesSvg}

  <!-- Bottom Tip -->
  <rect x="30" y="${height - 38}" width="${width - 60}" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
  <text x="45" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#0F766E">💡 Cụm từ tái chế:</text>
  <text x="175" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" fill="#115E59" font-weight="600">Reclaimed waste is sorted → Undergoes thermal breakdown → Extruded into virgin pellets → Formed into new goods</text>
</svg>`;
}

function renderManufacturingSvg(task, steps) {
  const width = 960;
  const height = 540;
  const totalSteps = steps.length;
  const title = task.title || 'Industrial Manufacturing Process';

  const cols = Math.min(4, totalSteps);
  const rows = Math.ceil(totalSteps / cols);
  const cardW = 185;
  const cardH = 145;
  const startX = 60 + (width - 120 - (cols * cardW + (cols - 1) * 35)) / 2;

  const mfgIcons = ['🚜 🪨', '⚙️ ⚙️', '🧪 💧', '🔥 🌡️', '❄️ 🌀', '📦 🤖', '🚚 🛣️'];

  let cardsSvg = '';
  let flowSvg = '';

  steps.forEach((s, idx) => {
    let r = Math.floor(idx / cols);
    let c = idx % cols;
    if (r % 2 === 1) c = cols - 1 - c; // serpentine reverse row

    const x = startX + c * (cardW + 35);
    const y = 95 + r * (cardH + 75);
    const icon = mfgIcons[idx % mfgIcons.length];

    cardsSvg += `
      <g class="step-card" id="step-${idx + 1}" transform="translate(${x}, ${y})">
        <!-- Card Body -->
        <rect width="${cardW}" height="${cardH}" rx="12" fill="#FFFFFF" stroke="#334155" stroke-width="2" filter="url(#drop-shadow)" />
        
        <!-- Header -->
        <path d="M 0 10 Q 0 0 10 0 L ${cardW - 10} 0 Q ${cardW} 0 ${cardW} 10 L ${cardW} 32 L 0 32 Z" fill="#1E293B" />
        <circle cx="18" cy="16" r="10" fill="#3B82F6" />
        <text x="18" y="20" font-family="Inter, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle">${s.step || idx + 1}</text>
        <text x="35" y="20" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF">STAGE ${s.step || idx + 1}</text>
        
        <!-- Apparatus Graphic -->
        <rect x="15" y="40" width="${cardW - 30}" height="32" rx="6" fill="#F1F5F9" stroke="#E2E8F0" />
        <text x="${cardW / 2}" y="62" font-size="16" text-anchor="middle">${icon}</text>

        <!-- Title & Desc -->
        <text x="${cardW / 2}" y="88" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#0F172A" text-anchor="middle">
          ${escapeXml((s.name || '').substring(0, 20))}
        </text>
        <g font-family="Inter, sans-serif" font-size="8.5" fill="#475569" text-anchor="middle">
          ${wrapSvgText(s.desc || '', 22).slice(0, 3).map((l, li) => 
            `<text x="${cardW / 2}" y="${104 + li * 12}">${escapeXml(l)}</text>`
          ).join('')}
        </g>
      </g>
    `;

    // Connector Arrow
    if (idx < totalSteps - 1) {
      const nextR = Math.floor((idx + 1) / cols);
      if (r === nextR) {
        // Horizontal
        const arrowY = y + cardH / 2;
        const isRev = r % 2 === 1;
        const ax1 = isRev ? x - 4 : x + cardW + 4;
        const ax2 = isRev ? x - 31 : x + cardW + 31;
        flowSvg += `
          <line x1="${ax1}" y1="${arrowY}" x2="${ax2}" y2="${arrowY}" stroke="#2563EB" stroke-width="3" marker-end="url(#arrowhead)" />
        `;
      } else {
        // Vertical snake down
        const downX = x + cardW / 2;
        flowSvg += `
          <line x1="${downX}" y1="${y + cardH + 4}" x2="${downX}" y2="${y + cardH + 71}" stroke="#2563EB" stroke-width="3" marker-end="url(#arrowhead)" />
        `;
      }
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF;border-radius:16px;">
  <defs>
    <filter id="drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08" />
    </filter>
    <marker id="arrowhead-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2563EB" />
    </marker>
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2563EB" />
    </marker>
  </defs>

  <rect width="${width}" height="${height}" fill="#F8FAFC" rx="16" />

  <!-- Top Banner -->
  <rect x="25" y="16" width="${width - 50}" height="48" rx="10" fill="#0F172A" />
  <circle cx="50" cy="40" r="12" fill="#3B82F6" />
  <text x="50" y="45" font-size="14" text-anchor="middle">🏭</text>
  <text x="75" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF">QUY TRÌNH SẢN XUẤT CÔNG NGHIỆP</text>
  <text x="75" y="52" font-family="Inter, sans-serif" font-size="10" fill="#94A3B8">${escapeXml(title)}</text>
  <rect x="${width - 165}" y="28" width="135" height="24" rx="6" fill="#1E293B" />
  <text x="${width - 98}" y="44" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="#38BDF8" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Flow and Cards -->
  ${flowSvg}
  ${cardsSvg}

  <!-- Bottom Tip -->
  <rect x="30" y="${height - 38}" width="${width - 60}" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
  <text x="45" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#1E293B">💡 Cụm từ nối báo cáo:</text>
  <text x="175" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" fill="#2563EB" font-weight="600">Initially → Following this → Subsequently → Prior to being... → Finally</text>
  <text x="${width - 45}" y="${height - 21}" font-family="Inter, sans-serif" font-size="9" fill="#94A3B8" font-weight="600" text-anchor="end">Cambridge IELTS Standard Diagram</text>
</svg>`;
}

function renderEnergyWaterSvg(task, steps) {
  const width = 960;
  const height = 540;
  const totalSteps = steps.length;
  const title = task.title || 'Hydroelectric Power & Water Treatment Flow';

  const cols = Math.min(4, totalSteps);
  const cardW = 185;
  const cardH = 145;
  const startX = 60 + (width - 120 - (cols * cardW + (cols - 1) * 35)) / 2;

  const energyIcons = ['🏔️ 🌊', '🚪 ⬇️', '🌀 ⚙️', '⚡ 🧲', '🗼 ⚡', '🏙️ 💡'];

  let cardsSvg = '';
  let flowSvg = '';

  steps.forEach((s, idx) => {
    let r = Math.floor(idx / cols);
    let c = idx % cols;
    if (r % 2 === 1) c = cols - 1 - c;

    const x = startX + c * (cardW + 35);
    const y = 95 + r * (cardH + 75);
    const icon = energyIcons[idx % energyIcons.length];

    cardsSvg += `
      <g class="step-card" id="step-${idx + 1}" transform="translate(${x}, ${y})">
        <rect width="${cardW}" height="${cardH}" rx="12" fill="#FFFFFF" stroke="#0284C7" stroke-width="2" filter="url(#drop-shadow)" />
        
        <path d="M 0 10 Q 0 0 10 0 L ${cardW - 10} 0 Q ${cardW} 0 ${cardW} 10 L ${cardW} 32 L 0 32 Z" fill="#0369A1" />
        <circle cx="18" cy="16" r="10" fill="#38BDF8" />
        <text x="18" y="20" font-family="Inter, sans-serif" font-size="9" font-weight="900" fill="#0C4A6E" text-anchor="middle">${s.step || idx + 1}</text>
        <text x="35" y="20" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF">STAGE ${s.step || idx + 1}</text>
        
        <rect x="15" y="40" width="${cardW - 30}" height="32" rx="6" fill="#F0F9FF" stroke="#BAE6FD" />
        <text x="${cardW / 2}" y="62" font-size="16" text-anchor="middle">${icon}</text>

        <text x="${cardW / 2}" y="88" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#0F172A" text-anchor="middle">
          ${escapeXml((s.name || '').substring(0, 20))}
        </text>
        <g font-family="Inter, sans-serif" font-size="8.5" fill="#475569" text-anchor="middle">
          ${wrapSvgText(s.desc || '', 22).slice(0, 3).map((l, li) => 
            `<text x="${cardW / 2}" y="${104 + li * 12}">${escapeXml(l)}</text>`
          ).join('')}
        </g>
      </g>
    `;

    if (idx < totalSteps - 1) {
      const nextR = Math.floor((idx + 1) / cols);
      if (r === nextR) {
        const arrowY = y + cardH / 2;
        const isRev = r % 2 === 1;
        const ax1 = isRev ? x - 4 : x + cardW + 4;
        const ax2 = isRev ? x - 31 : x + cardW + 31;
        flowSvg += `
          <line x1="${ax1}" y1="${arrowY}" x2="${ax2}" y2="${arrowY}" stroke="#0284C7" stroke-width="3" marker-end="url(#arrowhead)" />
        `;
      } else {
        const downX = x + cardW / 2;
        flowSvg += `
          <line x1="${downX}" y1="${y + cardH + 4}" x2="${downX}" y2="${y + cardH + 71}" stroke="#0284C7" stroke-width="3" marker-end="url(#arrowhead)" />
        `;
      }
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF;border-radius:16px;">
  <defs>
    <filter id="drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08" />
    </filter>
    <marker id="arrowhead-cyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#0284C7" />
    </marker>
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#0284C7" />
    </marker>
  </defs>

  <rect width="${width}" height="${height}" fill="#F0F9FF" rx="16" />

  <!-- Top Banner -->
  <rect x="25" y="16" width="${width - 50}" height="48" rx="10" fill="#0C4A6E" />
  <circle cx="50" cy="40" r="12" fill="#38BDF8" />
  <text x="50" y="45" font-size="14" text-anchor="middle">⚡</text>
  <text x="75" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF">NĂNG LƯỢNG &amp; THỦY ĐIỆN HỆ THỐNG</text>
  <text x="75" y="52" font-family="Inter, sans-serif" font-size="10" fill="#BAE6FD">${escapeXml(title)}</text>
  <rect x="${width - 165}" y="28" width="135" height="24" rx="6" fill="#0369A1" />
  <text x="${width - 98}" y="44" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="#E0F2FE" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Flow and Cards -->
  ${flowSvg}
  ${cardsSvg}

  <!-- Bottom Tip -->
  <rect x="30" y="${height - 38}" width="${width - 60}" height="26" rx="6" fill="#FFFFFF" stroke="#BAE6FD" />
  <text x="45" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#0369A1">💡 Thuật ngữ thủy điện:</text>
  <text x="175" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" fill="#0284C7" font-weight="600">Elevated reservoir water → Channelled through penstock → Drives turbine rotor → Powers generator</text>
</svg>`;
}

export function generateProcessDiagramSvg(task = {}) {
  const steps = task.processSteps || [
    { step: 1, name: 'Collection', desc: 'Raw materials are collected and sorted' },
    { step: 2, name: 'Processing', desc: 'Materials undergo chemical or thermal treatment' },
    { step: 3, name: 'Refining', desc: 'Impurities are filtered out through stages' },
    { step: 4, name: 'Packaging', desc: 'Finished products are packaged and transported' }
  ];

  const pType = detectProcessType(task);

  if (pType === 'lifecycle') {
    return renderLifecycleSvg(task, steps);
  }
  if (pType === 'recycling') {
    return renderRecyclingSvg(task, steps);
  }
  if (pType === 'energy_water') {
    return renderEnergyWaterSvg(task, steps);
  }
  return renderManufacturingSvg(task, steps);
}

export function ensureTaskIllustration(task = {}) {
  if (!task || Number(task.taskNumber) !== 1) return task;

  const isProcess = task.type === 'process' || !!task.processSteps;
  const isMap = task.type === 'map' || !!task.mapChanges;

  if (!isProcess && !isMap) return task;

  // If task already has a valid non-empty imageUrl that is not a generic fallback, keep it
  if (task.imageUrl && typeof task.imageUrl === 'string' && task.imageUrl.length > 50) {
    return task;
  }

  if (task.svgIllustration && typeof task.svgIllustration === 'string' && task.svgIllustration.includes('<svg')) {
    const cleanSvg = task.svgIllustration.trim();
    return {
      ...task,
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`
    };
  }

  let svgContent = '';
  if (isProcess) {
    svgContent = generateProcessDiagramSvg(task);
  } else if (isMap) {
    svgContent = generateMapComparisonSvg(task);
  }

  if (svgContent) {
    return {
      ...task,
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`
    };
  }

  return task;
}
