/**
 * Cambridge IELTS Standard Vector Illustration Engine
 * 
 * Automatically synthesizes high-fidelity, scalable, and highly DIVERSE SVG diagrams and maps
 * for IELTS Writing Task 1 (Process Flowcharts & Dual-Period Map Transformations).
 * 
 * Diversity features:
 * - Dynamic Map Archetypes: University Campus, Regional Airport, Tropical Island, Hospital Zone, Coastal Village, Urban Town.
 * - Dynamic Zone Geometry: Places actual mapChanges into spatial compass coordinates (NW, NE, SW, SE, Center).
 * - Dynamic Process Archetypes: Biological Life Cycle (Circular Loop), Closed-Loop Recycling, Energy/Water Flow, Industrial Manufacturing.
 * - Dynamic Visual Themes & Glyphs: Contextual icons, colors, palettes, and connecting infrastructure.
 */

/**
 * Escapes XML/SVG special characters
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

/**
 * Wraps text into lines that fit within a max character length
 */
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

/**
 * Detects the process archetype to determine the optimal SVG layout & visual theme
 */
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

/**
 * Detects the map archetype to determine spatial terrain, landmarks, and styling
 */
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

/**
 * Generates an authentic Cambridge-style IELTS Process Diagram as an SVG string
 * Supports Circular Lifecycles, Recycling Loops, Energy Flows, and Industrial Workflows
 */
export function generateProcessDiagramSvg(task = {}) {
  const steps = task.processSteps || [
    { step: 1, name: 'Collection', desc: 'Raw materials are collected and sorted' },
    { step: 2, name: 'Processing', desc: 'Materials undergo chemical or thermal treatment' },
    { step: 3, name: 'Refining', desc: 'Impurities are filtered out through stages' },
    { step: 4, name: 'Packaging', desc: 'Finished products are packaged for distribution' }
  ];

  const title = task.title || 'IELTS Academic Writing Task 1 - Process Diagram';
  const totalSteps = steps.length;
  const pType = detectProcessType(task);

  // 1. CIRCULAR LOOP LAYOUT: For Biological Life Cycles & Closed-Loop Recycling
  if (pType === 'lifecycle' || pType === 'recycling') {
    const isEco = pType === 'recycling';
    const width = 960;
    const height = 580;
    const centerX = width / 2;
    const centerY = 310;
    const radiusX = 330;
    const radiusY = 175;

    const themeColor = isEco ? '#059669' : '#047857';
    const themeBg = isEco ? '#F0FDF4' : '#F0FDF4';
    const accentGradStart = isEco ? '#059669' : '#065F46';
    const accentGradEnd = isEco ? '#10B981' : '#0D9488';
    const centerEmoji = isEco ? '♻️' : '🌿';
    const centerTitle = isEco ? 'CLOSED-LOOP RECYCLING' : 'NATURAL LIFE CYCLE';
    const centerSub = isEco ? 'Quy trình tái chế tuần hoàn' : 'Vòng đời sinh thái tự nhiên';

    let cardsSvg = '';
    let arrowsSvg = '';

    const cardW = 160;
    const cardH = 115;

    steps.forEach((s, idx) => {
      // Angle: 12 o'clock = -PI/2, moving clockwise
      const angle = -Math.PI / 2 + (2 * Math.PI * idx) / totalSteps;
      const x = centerX + radiusX * Math.cos(angle) - cardW / 2;
      const y = centerY + radiusY * Math.sin(angle) - cardH / 2;

      const isFirst = idx === 0;
      const stepHeaderBg = isFirst ? '#2563EB' : isEco ? '#059669' : '#0D9488';

      cardsSvg += `
        <g id="step-${idx + 1}" class="step-card">
          <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="12" fill="#FFFFFF" stroke="${stepHeaderBg}" stroke-width="2" filter="url(#drop-shadow)" />
          <path d="M ${x} ${y + 10} Q ${x} ${y} ${x + 10} ${y} L ${x + cardW - 10} ${y} Q ${x + cardW} ${y} ${x + cardW} ${y + 10} L ${x + cardW} ${y + 28} L ${x} ${y + 28} Z" fill="${stepHeaderBg}" />
          <text x="${x + cardW / 2}" y="${y + 19}" font-family="Inter, sans-serif" font-size="10.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">STAGE ${s.step || idx + 1}</text>
          
          <text x="${x + cardW / 2}" y="${y + 46}" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">
            ${escapeXml((s.name || '').substring(0, 22))}
          </text>
          
          <line x1="${x + 12}" y1="${y + 54}" x2="${x + cardW - 12}" y2="${y + 54}" stroke="#E2E8F0" stroke-width="1" />
          
          <g font-family="Inter, sans-serif" font-size="9" fill="#475569" text-anchor="middle">
            ${wrapSvgText(s.desc || '', 20).slice(0, 3).map((line, lIdx) => 
              `<text x="${x + cardW / 2}" y="${y + 69 + lIdx * 13}">${escapeXml(line)}</text>`
            ).join('')}
          </g>
        </g>
      `;

      // Circular arc connecting arrow
      const nextIdx = (idx + 1) % totalSteps;
      const nextAngle = -Math.PI / 2 + (2 * Math.PI * nextIdx) / totalSteps;
      const midAngle = (angle + nextAngle) / 2 + (nextIdx === 0 ? Math.PI : 0);
      
      const p1X = centerX + (radiusX - 10) * Math.cos(angle + 0.35);
      const p1Y = centerY + (radiusY - 10) * Math.sin(angle + 0.35);
      const p2X = centerX + (radiusX - 10) * Math.cos(nextAngle - 0.35);
      const p2Y = centerY + (radiusY - 10) * Math.sin(nextAngle - 0.35);

      arrowsSvg += `
        <g class="arrow-arc">
          <path d="M ${p1X} ${p1Y} Q ${centerX + (radiusX + 15) * Math.cos(midAngle)} ${centerY + (radiusY + 15) * Math.sin(midAngle)} ${p2X} ${p2Y}" fill="none" stroke="${themeColor}" stroke-width="2.5" stroke-dasharray="5 3" marker-end="url(#arrowhead)" />
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
      <polygon points="0 0, 8 3, 0 6" fill="${themeColor}" />
    </marker>
    <linearGradient id="headerGradCirc" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentGradStart}" />
      <stop offset="100%" stop-color="${accentGradEnd}" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="${themeBg}" rx="16" />

  <!-- Top Title Banner -->
  <rect x="20" y="16" width="${width - 40}" height="48" rx="10" fill="url(#headerGradCirc)" />
  <circle cx="45" cy="40" r="12" fill="#FFFFFF" fill-opacity="0.25" />
  <text x="45" y="44" font-family="Inter, sans-serif" font-size="13" text-anchor="middle">${centerEmoji}</text>
  <text x="68" y="38" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">IELTS ACADEMIC TASK 1: ${centerTitle}</text>
  <text x="68" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#E2E8F0">${escapeXml(title)}</text>
  <rect x="${width - 150}" y="28" width="115" height="24" rx="6" fill="#FFFFFF" fill-opacity="0.2" stroke="#FFFFFF" stroke-width="1" />
  <text x="${width - 92}" y="44" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Central Thematic Emblem -->
  <circle cx="${centerX}" cy="${centerY}" r="64" fill="#FFFFFF" stroke="${themeColor}" stroke-width="3" filter="url(#drop-shadow)" />
  <circle cx="${centerX}" cy="${centerY}" r="56" fill="${themeBg}" />
  <text x="${centerX}" y="${centerY - 10}" font-size="28" text-anchor="middle">${centerEmoji}</text>
  <text x="${centerX}" y="${centerY + 16}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="${themeColor}" text-anchor="middle">${centerTitle}</text>
  <text x="${centerX}" y="${centerY + 28}" font-family="Inter, sans-serif" font-size="7.5" fill="#64748B" text-anchor="middle">${centerSub}</text>

  <!-- Arrows and Step Cards -->
  ${arrowsSvg}
  ${cardsSvg}

  <!-- Bottom Helper Bar -->
  <rect x="30" y="${height - 38}" width="${width - 60}" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#334155">💡 Từ vựng chu trình:</text>
  <text x="175" y="${height - 21}" font-family="Inter, sans-serif" font-size="9.5" fill="${themeColor}" font-weight="600">The cycle commences with → In the subsequent stage → This triggers → Culminating in → The process repeats</text>
  <text x="${width - 45}" y="${height - 21}" font-family="Inter, sans-serif" font-size="9" fill="#94A3B8" font-weight="600" text-anchor="end">Cambridge IELTS Cycle Diagram</text>
</svg>`;
  }

  // 2. LINEAR / TWO-ROW WORKFLOW (For Manufacturing & Energy/Water)
  const isEnergy = pType === 'energy_water';
  const width = 960;
  const height = totalSteps <= 4 ? 400 : 540;
  const isTwoRows = totalSteps > 4;
  const cols = isTwoRows ? Math.ceil(totalSteps / 2) : totalSteps;
  const cardWidth = Math.min(195, Math.floor((width - 80 - (cols - 1) * 35) / cols));
  const cardHeight = 150;

  const headerThemeGrad = isEnergy 
    ? 'linear-gradient(90deg, #0284C7 0%, #1E3A8A 100%)' 
    : 'linear-gradient(90deg, #1E293B 0%, #334155 100%)';

  const arrowStroke = isEnergy ? '#0284C7' : '#2563EB';

  let svgElements = '';

  steps.forEach((s, idx) => {
    let row = 0;
    let col = idx;
    let isReversed = false;

    if (isTwoRows) {
      if (idx < cols) {
        row = 0;
        col = idx;
      } else {
        row = 1;
        col = cols - 1 - (idx - cols);
        isReversed = true;
      }
    }

    const startX = 50 + (width - 100 - (cols * cardWidth + (cols - 1) * 35)) / 2;
    const x = startX + col * (cardWidth + 35);
    const y = 90 + row * (cardHeight + 70);

    const isFirst = idx === 0;
    const isLast = idx === totalSteps - 1;
    
    // Thematic visual cues
    let stageIcon = '⚙️';
    const sNameLower = (s.name || '').toLowerCase();
    if (/harvest|collect|intake|raw/i.test(sNameLower)) stageIcon = '📦';
    else if (/heat|furnace|roast|burn|thermal|bake|kiln/i.test(sNameLower)) stageIcon = '🔥';
    else if (/filter|purif|clean|screen|sift/i.test(sNameLower)) stageIcon = '🔬';
    else if (/crush|grind|mix|blend/i.test(sNameLower)) stageIcon = '⚡';
    else if (/cool|dry|freez/i.test(sNameLower)) stageIcon = '❄️';
    else if (/pack|ship|distribut|deliver/i.test(sNameLower)) stageIcon = '🚚';

    const headerBg = isFirst ? '#2563EB' : isLast ? '#059669' : isEnergy ? '#0284C7' : '#475569';
    const cardBorder = isFirst ? '#93C5FD' : isLast ? '#86EFAC' : '#CBD5E1';
    const cardBg = isFirst ? '#EFF6FF' : isLast ? '#F0FDF4' : '#F8FAFC';

    svgElements += `
      <g id="step-${idx + 1}" class="step-card">
        <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="2" filter="url(#drop-shadow)" />
        <path d="M ${x} ${y + 12} Q ${x} ${y} ${x + 12} ${y} L ${x + cardWidth - 12} ${y} Q ${x + cardWidth} ${y} ${x + cardWidth} ${y + 12} L ${x + cardWidth} ${y + 36} L ${x} ${y + 36} Z" fill="${headerBg}" />
        <circle cx="${x + 20}" cy="${y + 18}" r="11" fill="#FFFFFF" />
        <text x="${x + 20}" y="${y + 22}" font-family="Inter, sans-serif" font-size="11" font-weight="900" fill="${headerBg}" text-anchor="middle">${s.step || idx + 1}</text>
        <text x="${x + 38}" y="${y + 22}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">STAGE ${s.step || idx + 1}</text>
        <text x="${x + cardWidth - 16}" y="${y + 23}" font-size="12" text-anchor="middle">${stageIcon}</text>
        
        <text x="${x + cardWidth / 2}" y="${y + 58}" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#0F172A" text-anchor="middle">
          ${escapeXml((s.name || '').substring(0, 26))}
        </text>

        <line x1="${x + 15}" y1="${y + 68}" x2="${x + cardWidth - 15}" y2="${y + 68}" stroke="${cardBorder}" stroke-width="1" stroke-dasharray="2 2" />

        <g font-family="Inter, sans-serif" font-size="10" fill="#475569" text-anchor="middle">
          ${wrapSvgText(s.desc || '', 24).slice(0, 4).map((line, lIdx) => 
            `<text x="${x + cardWidth / 2}" y="${y + 86 + lIdx * 14}">${escapeXml(line)}</text>`
          ).join('')}
        </g>
      </g>
    `;

    // Connecting Arrow
    if (idx < totalSteps - 1) {
      if (!isTwoRows || (row === 0 && col < cols - 1) || (row === 1 && col > 0)) {
        const arrowStartX = isReversed ? x - 4 : x + cardWidth + 4;
        const arrowEndX = isReversed ? x - 31 : x + cardWidth + 31;
        const arrowY = y + cardHeight / 2;

        svgElements += `
          <g class="arrow-h">
            <line x1="${arrowStartX}" y1="${arrowY}" x2="${arrowEndX}" y2="${arrowY}" stroke="${arrowStroke}" stroke-width="2.5" marker-end="url(#arrowhead)" />
            <text x="${(arrowStartX + arrowEndX) / 2}" y="${arrowY - 6}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="${arrowStroke}" text-anchor="middle">NEXT</text>
          </g>
        `;
      } else if (row === 0 && col === cols - 1) {
        const downX = x + cardWidth / 2;
        const downStartY = y + cardHeight + 4;
        const downEndY = y + cardHeight + 66;

        svgElements += `
          <g class="arrow-v">
            <path d="M ${downX} ${downStartY} L ${downX} ${downEndY}" stroke="${arrowStroke}" stroke-width="2.5" marker-end="url(#arrowhead)" />
            <text x="${downX + 18}" y="${(downStartY + downEndY) / 2 + 3}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="${arrowStroke}">SUBSEQUENT</text>
          </g>
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
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="${arrowStroke}" />
    </marker>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${isEnergy ? '#0284C7' : '#1E293B'}" />
      <stop offset="100%" stop-color="${isEnergy ? '#1E3A8A' : '#334155'}" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="#FAFAFA" rx="16" />
  
  <g opacity="0.25">
    ${Array.from({ length: Math.floor(width / 30) }).map((_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="${height}" stroke="#E2E8F0" stroke-width="0.5" />`).join('')}
    ${Array.from({ length: Math.floor(height / 30) }).map((_, i) => `<line x1="0" y1="${i * 30}" x2="${width}" y2="${i * 30}" stroke="#E2E8F0" stroke-width="0.5" />`).join('')}
  </g>

  <!-- Top Title Banner -->
  <rect x="20" y="16" width="${width - 40}" height="48" rx="10" fill="url(#headerGrad)" />
  <circle cx="45" cy="40" r="12" fill="#38BDF8" fill-opacity="0.2" />
  <text x="45" y="44" font-family="Inter, sans-serif" font-size="12" font-weight="900" fill="#38BDF8" text-anchor="middle">${isEnergy ? '⚡' : '⚙️'}</text>
  <text x="68" y="38" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">IELTS ACADEMIC TASK 1: PROCESS FLOWCHART</text>
  <text x="68" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#94A3B8">${escapeXml(title)}</text>
  <rect x="${width - 150}" y="28" width="115" height="24" rx="6" fill="#0EA5E9" fill-opacity="0.2" stroke="#38BDF8" stroke-width="1" />
  <text x="${width - 92}" y="44" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Process Steps & Arrows -->
  ${svgElements}

  <!-- Bottom Legend -->
  <rect x="30" y="${height - 40}" width="${width - 60}" height="28" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="${height - 22}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#475569">💡 Cụm từ nối báo cáo:</text>
  <text x="175" y="${height - 22}" font-family="Inter, sans-serif" font-size="10" fill="#2563EB" font-weight="600">Initially → Following this → Subsequently → Prior to being... → Finally</text>
  <text x="${width - 45}" y="${height - 22}" font-family="Inter, sans-serif" font-size="9" fill="#94A3B8" font-weight="600" text-anchor="end">Cambridge IELTS Standard Diagram</text>
</svg>`;
}

/**
 * Generates an authentic Cambridge-style IELTS Dual-Period Map Comparison as an SVG string.
 * Completely dynamic: renders actual changes from task.mapChanges across diverse map archetypes.
 */
export function generateMapComparisonSvg(task = {}) {
  const changes = task.mapChanges || [
    { feature: 'Northwest Farmland', past: 'Agricultural land and forestry', present: 'Luxury residential housing estate' },
    { feature: 'Southern Coast', past: 'Small fishing dock with wooden pier', present: 'Leisure marina and yacht club' },
    { feature: 'Eastern Shore', past: 'Empty shoreline and marshland', present: 'Multi-story hotel resort' },
    { feature: 'Center Village', past: 'Narrow gravel road', present: 'Widened dual-carriageway with shops' }
  ];

  const title = task.title || 'IELTS Academic Writing Task 1 - Map Transformation';
  const mType = detectMapType(task);

  // Extract periods
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

  // Archetype themes & colors
  let archetypeIcon = '🧭';
  let archetypeName = 'MAP TRANSFORMATION';
  let map1Bg = '#FEFCE8'; // antique parchment
  let map2Bg = '#F0FDF4'; // modern green/slate

  if (mType === 'campus') {
    archetypeIcon = '🎓';
    archetypeName = 'UNIVERSITY CAMPUS DEVELOPMENT';
    map1Bg = '#FDFBF7';
    map2Bg = '#F0FDF4';
  } else if (mType === 'airport') {
    archetypeIcon = '✈️';
    archetypeName = 'AIRPORT TERMINAL EXPANSION';
    map1Bg = '#F8FAFC';
    map2Bg = '#F1F5F9';
  } else if (mType === 'island') {
    archetypeIcon = '🏝️';
    archetypeName = 'TROPICAL ISLAND ECO-TRANSFORMATION';
    map1Bg = '#FEF9C3';
    map2Bg = '#ECFEFF';
  } else if (mType === 'hospital') {
    archetypeIcon = '🏥';
    archetypeName = 'HEALTHCARE & HOSPITAL REDEVELOPMENT';
    map1Bg = '#F8FAFC';
    map2Bg = '#EFF6FF';
  } else if (mType === 'coastal') {
    archetypeIcon = '⛵';
    archetypeName = 'COASTAL TOWN & HARBOUR REDEVELOPMENT';
    map1Bg = '#FEFCE8';
    map2Bg = '#F0FDF4';
  } else {
    archetypeIcon = '🏙️';
    archetypeName = 'URBAN RE-PLANNING & INFRASTRUCTURE';
    map1Bg = '#FDF6B2';
    map2Bg = '#F0FDF4';
  }

  // Pre-configured 5 Spatial Zones for placing mapChanges
  // [0: North-West, 1: North-East, 2: Center, 3: South-West, 4: South-East]
  const zoneCoords = [
    { x: 16, y: 50, w: 180, h: 90, name: 'North-West' },
    { x: 228, y: 50, w: 180, h: 90, name: 'North-East' },
    { x: 122, y: 152, w: 180, h: 76, name: 'Central Area' },
    { x: 16, y: 240, w: 180, h: 95, name: 'South-West' },
    { x: 228, y: 240, w: 180, h: 95, name: 'South-East' }
  ];

  // Helper to render zone cards dynamically for Map 1 and Map 2
  let map1ZonesSvg = '';
  let map2ZonesSvg = '';

  const activeChanges = changes.slice(0, 5);

  activeChanges.forEach((ch, idx) => {
    const coord = zoneCoords[idx % zoneCoords.length];
    const featName = (ch.feature || ch.area || coord.name).substring(0, 26);
    const pastText = ch.past || 'Original undeveloped state';
    const presText = ch.present || 'Modern redeveloped facility';

    // Map 1 Zone (Historical / Past)
    const m1X = map1X + coord.x;
    const m1Y = mapY + coord.y;
    map1ZonesSvg += `
      <g class="zone-past-${idx + 1}">
        <rect x="${m1X}" y="${m1Y}" width="${coord.w}" height="${coord.h}" rx="8" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5" />
        <rect x="${m1X}" y="${m1Y}" width="${coord.w}" height="22" rx="8" fill="#D97706" />
        <text x="${m1X + coord.w / 2}" y="${m1Y + 15}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">
          ${escapeXml(featName)}
        </text>
        <g font-family="Inter, sans-serif" font-size="9" fill="#78350F" text-anchor="middle">
          ${wrapSvgText(pastText, 24).slice(0, 3).map((l, li) => 
            `<text x="${m1X + coord.w / 2}" y="${m1Y + 38 + li * 13}">${escapeXml(l)}</text>`
          ).join('')}
        </g>
      </g>
    `;

    // Map 2 Zone (Modern / Redeveloped)
    const m2X = map2X + coord.x;
    const m2Y = mapY + coord.y;
    // Vary modern hues per zone
    const modernColors = [
      { bg: '#DBEAFE', stroke: '#2563EB', header: '#1D4ED8', text: '#1E3A8A' },
      { bg: '#DCFCE7', stroke: '#059669', header: '#047857', text: '#14532D' },
      { bg: '#F3E8FF', stroke: '#7C3AED', header: '#6D28D9', text: '#581C87' },
      { bg: '#FFE4E6', stroke: '#E11D48', header: '#BE123C', text: '#881337' },
      { bg: '#FEF08A', stroke: '#CA8A04', header: '#A16207', text: '#713F12' }
    ];
    const cTheme = modernColors[idx % modernColors.length];

    map2ZonesSvg += `
      <g class="zone-present-${idx + 1}">
        <rect x="${m2X}" y="${m2Y}" width="${coord.w}" height="${coord.h}" rx="8" fill="${cTheme.bg}" stroke="${cTheme.stroke}" stroke-width="2" />
        <rect x="${m2X}" y="${m2Y}" width="${coord.w}" height="22" rx="8" fill="${cTheme.header}" />
        <text x="${m2X + coord.w / 2}" y="${m2Y + 15}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">
          ${escapeXml(featName)} [NEW]
        </text>
        <g font-family="Inter, sans-serif" font-size="9" fill="${cTheme.text}" font-weight="600" text-anchor="middle">
          ${wrapSvgText(presText, 24).slice(0, 3).map((l, li) => 
            `<text x="${m2X + coord.w / 2}" y="${m2Y + 38 + li * 13}">${escapeXml(l)}</text>`
          ).join('')}
        </g>
      </g>
    `;
  });

  // Archetype-specific environmental background elements
  let envMap1Svg = '';
  let envMap2Svg = '';

  if (mType === 'coastal' || mType === 'island') {
    // Water at the bottom
    envMap1Svg += `
      <path d="M ${map1X} ${mapY + mapH - 35} Q ${map1X + 150} ${mapY + mapH - 45} ${map1X + mapW} ${mapY + mapH - 35} L ${map1X + mapW} ${mapY + mapH} L ${map1X} ${mapY + mapH} Z" fill="#DBEAFE" stroke="#93C5FD" stroke-width="1.5" />
      <text x="${map1X + mapW / 2}" y="${mapY + mapH - 12}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#1D4ED8" text-anchor="middle">🌊 SEA / COASTLINE</text>
    `;
    envMap2Svg += `
      <path d="M ${map2X} ${mapY + mapH - 35} Q ${map2X + 150} ${mapY + mapH - 45} ${map2X + mapW} ${mapY + mapH - 35} L ${map2X + mapW} ${mapY + mapH} L ${map2X} ${mapY + mapH} Z" fill="#BAE6FD" stroke="#38BDF8" stroke-width="1.5" />
      <text x="${map2X + mapW / 2}" y="${mapY + mapH - 12}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#0284C7" text-anchor="middle">⛵ HARBOUR / MARINA RESORT</text>
    `;
  } else if (mType === 'airport') {
    // Tarmac runway crossing the bottom
    envMap1Svg += `
      <rect x="${map1X}" y="${mapY + mapH - 36}" width="${mapW}" height="36" fill="#475569" />
      <line x1="${map1X}" y1="${mapY + mapH - 18}" x2="${map1X + mapW}" y2="${mapY + mapH - 18}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="8 6" />
      <text x="${map1X + mapW / 2}" y="${mapY + mapH - 22}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">AIRSTRIP RUNWAY</text>
    `;
    envMap2Svg += `
      <rect x="${map2X}" y="${mapY + mapH - 42}" width="${mapW}" height="42" fill="#334155" />
      <line x1="${map2X}" y1="${mapY + mapH - 21}" x2="${map2X + mapW}" y2="${mapY + mapH - 21}" stroke="#FACC15" stroke-width="2.5" stroke-dasharray="10 8" />
      <text x="${map2X + mapW / 2}" y="${mapY + mapH - 25}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#F8FAFC" text-anchor="middle">✈️ EXPANDED DUAL RUNWAY 09L/27R</text>
    `;
  } else if (mType === 'campus') {
    // Green central avenue
    envMap1Svg += `
      <line x1="${map1X + mapW / 2}" y1="${mapY + 45}" x2="${map1X + mapW / 2}" y2="${mapY + mapH - 30}" stroke="#D1D5DB" stroke-width="10" stroke-dasharray="4 4" />
    `;
    envMap2Svg += `
      <line x1="${map2X + mapW / 2}" y1="${mapY + 45}" x2="${map2X + mapW / 2}" y2="${mapY + mapH - 30}" stroke="#10B981" stroke-width="14" stroke-opacity="0.4" />
      <circle cx="${map2X + mapW / 2}" cy="${mapY + 190}" r="14" fill="#059669" />
      <text x="${map2X + mapW / 2}" y="${mapY + 194}" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">🌲</text>
    `;
  } else {
    // Road crossing
    envMap1Svg += `
      <line x1="${map1X + mapW / 2}" y1="${mapY + 45}" x2="${map1X + mapW / 2}" y2="${mapY + mapH - 20}" stroke="#94A3B8" stroke-width="12" />
      <line x1="${map1X + mapW / 2}" y1="${mapY + 45}" x2="${map1X + mapW / 2}" y2="${mapY + mapH - 20}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6" />
    `;
    envMap2Svg += `
      <line x1="${map2X + mapW / 2}" y1="${mapY + 45}" x2="${map2X + mapW / 2}" y2="${mapY + mapH - 20}" stroke="#475569" stroke-width="20" />
      <line x1="${map2X + mapW / 2}" y1="${mapY + 45}" x2="${map2X + mapW / 2}" y2="${mapY + mapH - 20}" stroke="#FACC15" stroke-width="2" />
      <circle cx="${map2X + mapW / 2}" cy="${mapY + 190}" r="18" fill="#475569" stroke="#64748B" stroke-width="2" />
      <circle cx="${map2X + mapW / 2}" cy="${mapY + 190}" r="8" fill="#10B981" />
    `;
  }

  // Compass Generator
  function renderCompass(cx, cy) {
    return `
      <g class="compass-rose" transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5" />
        <polygon points="0,-12 4,0 0,2 -4,0" fill="#DC2626" />
        <polygon points="0,12 4,0 0,-2 -4,0" fill="#64748B" />
        <text x="0" y="-14" font-family="Inter, sans-serif" font-size="8" font-weight="900" fill="#DC2626" text-anchor="middle">N</text>
        <text x="14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">E</text>
        <text x="0" y="20" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">S</text>
        <text x="-14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">W</text>
      </g>
    `;
  }

  // Summary transformation text for bottom legend
  const summaryText = activeChanges
    .slice(0, 3)
    .map(c => `${c.feature || 'Khu vực'}: ${c.past || 'Cũ'} → ${c.present || 'Mới'}`)
    .join('  |  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF;border-radius:16px;">
  <defs>
    <filter id="map-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1" />
    </filter>
    <linearGradient id="headerGradMap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="#F8FAFC" rx="16" />

  <!-- Top Title Bar -->
  <rect x="20" y="16" width="${width - 40}" height="50" rx="10" fill="url(#headerGradMap)" />
  <circle cx="45" cy="41" r="12" fill="#10B981" fill-opacity="0.25" />
  <text x="45" y="45" font-family="Inter, sans-serif" font-size="13" text-anchor="middle">${archetypeIcon}</text>
  <text x="68" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">IELTS ACADEMIC TASK 1: ${archetypeName}</text>
  <text x="68" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#94A3B8">${escapeXml(title)}</text>
  
  <rect x="${width - 170}" y="28" width="135" height="24" rx="6" fill="#10B981" fill-opacity="0.2" stroke="#34D399" stroke-width="1" />
  <text x="${width - 102}" y="44" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#34D399" text-anchor="middle">ĐỐI CHIẾU 2 THỜI KỲ</text>

  <!-- ============================================================== -->
  <!-- MAP 1: PAST PERIOD                                             -->
  <!-- ============================================================== -->
  <g id="map-past">
    <rect x="${map1X}" y="${mapY}" width="${mapW}" height="${mapH}" rx="12" fill="${map1Bg}" stroke="#CBD5E1" stroke-width="2" filter="url(#map-shadow)" />
    
    <rect x="${map1X + 12}" y="${mapY + 12}" width="165" height="26" rx="6" fill="#B45309" />
    <text x="${map1X + 94}" y="${mapY + 29}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">MAP 1: ${escapeXml(period1)}</text>

    ${renderCompass(map1X + mapW - 36, mapY + 36)}
    ${envMap1Svg}
    ${map1ZonesSvg}
  </g>

  <!-- ============================================================== -->
  <!-- MAP 2: PRESENT PERIOD (REDEVELOPED)                            -->
  <!-- ============================================================== -->
  <g id="map-present">
    <rect x="${map2X}" y="${mapY}" width="${mapW}" height="${mapH}" rx="12" fill="${map2Bg}" stroke="#CBD5E1" stroke-width="2" filter="url(#map-shadow)" />

    <rect x="${map2X + 12}" y="${mapY + 12}" width="165" height="26" rx="6" fill="#047857" />
    <text x="${map2X + 94}" y="${mapY + 29}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">MAP 2: ${escapeXml(period2)}</text>

    ${renderCompass(map2X + mapW - 36, mapY + 36)}
    ${envMap2Svg}
    ${map2ZonesSvg}
  </g>

  <!-- Bottom Key Comparison & Vocabulary Guide -->
  <rect x="30" y="${height - 48}" width="${width - 60}" height="36" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="${height - 26}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#0F172A">🔍 Biến đổi trọng tâm:</text>
  <text x="175" y="${height - 26}" font-family="Inter, sans-serif" font-size="9" fill="#059669" font-weight="600">
    ${escapeXml(summaryText || 'Đô thị hóa, chuyển đổi không gian & mở rộng hạ tầng công cộng')}
  </text>
  <text x="${width - 45}" y="${height - 26}" font-family="Inter, sans-serif" font-size="9" fill="#64748B" font-weight="600" text-anchor="end">Cambridge IELTS Dual Map</text>
</svg>`;
}

/**
 * Ensures any task (AI generated or loaded from bank) of type 'process' or 'map'
 * has a high-resolution, valid SVG illustration in its imageUrl property.
 * @param {object} task 
 * @returns {object} updated task with guaranteed imageUrl
 */
export function ensureTaskIllustration(task = {}) {
  if (!task || Number(task.taskNumber) !== 1) return task;

  const isProcess = task.type === 'process' || !!task.processSteps;
  const isMap = task.type === 'map' || !!task.mapChanges;

  if (!isProcess && !isMap) return task;

  // If task already has a valid non-empty imageUrl, keep it
  if (task.imageUrl && typeof task.imageUrl === 'string' && task.imageUrl.length > 50) {
    return task;
  }

  // If task has raw svgIllustration from AI, convert to data URL
  if (task.svgIllustration && typeof task.svgIllustration === 'string' && task.svgIllustration.includes('<svg')) {
    const cleanSvg = task.svgIllustration.trim();
    return {
      ...task,
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`
    };
  }

  // Synthesize authentic Cambridge SVG diagram
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
