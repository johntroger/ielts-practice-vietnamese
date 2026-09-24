/**
 * Cambridge IELTS Standard Vector Illustration Engine
 * 
 * Automatically synthesizes high-fidelity, scalable SVG diagrams and maps
 * for IELTS Writing Task 1 (Process Flowcharts & Dual-Period Map Transformations).
 * Ensures that 100% of AI-generated or library Process/Map tasks contain
 * an authentic visual illustration (imageUrl).
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
 * Generates an authentic Cambridge-style IELTS Process Diagram as an SVG string
 * @param {object} task { title, prompt, processSteps: [{ step, name, desc }] }
 * @returns {string} Raw SVG XML string
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
  
  // Dimensions
  const width = 960;
  const height = totalSteps <= 4 ? 400 : 540;
  
  // Grid layout: 1 row for <= 4 steps, 2 rows for 5-8 steps
  const isTwoRows = totalSteps > 4;
  const cols = isTwoRows ? Math.ceil(totalSteps / 2) : totalSteps;
  const cardWidth = Math.min(195, Math.floor((width - 80 - (cols - 1) * 35) / cols));
  const cardHeight = 150;

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
        // Snake layout: right to left for row 1
        col = cols - 1 - (idx - cols);
        isReversed = true;
      }
    }

    const startX = 50 + (width - 100 - (cols * cardWidth + (cols - 1) * 35)) / 2;
    const x = startX + col * (cardWidth + 35);
    const y = 90 + row * (cardHeight + 70);

    // Color theme per stage
    const isFirst = idx === 0;
    const isLast = idx === totalSteps - 1;
    const headerBg = isFirst ? '#2563EB' : isLast ? '#059669' : '#475569';
    const cardBorder = isFirst ? '#93C5FD' : isLast ? '#86EFAC' : '#CBD5E1';
    const cardBg = isFirst ? '#EFF6FF' : isLast ? '#F0FDF4' : '#F8FAFC';

    // Step Box
    svgElements += `
      <g id="step-${idx + 1}" class="step-card">
        <!-- Shadow & Card Body -->
        <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="12" fill="${cardBg}" stroke="${cardBorder}" stroke-width="2" filter="url(#drop-shadow)" />
        
        <!-- Header Banner -->
        <path d="M ${x} ${y + 12} Q ${x} ${y} ${x + 12} ${y} L ${x + cardWidth - 12} ${y} Q ${x + cardWidth} ${y} ${x + cardWidth} ${y + 12} L ${x + cardWidth} ${y + 36} L ${x} ${y + 36} Z" fill="${headerBg}" />
        <circle cx="${x + 20}" cy="${y + 18}" r="11" fill="#FFFFFF" />
        <text x="${x + 20}" y="${y + 22}" font-family="Inter, sans-serif" font-size="11" font-weight="900" fill="${headerBg}" text-anchor="middle">${s.step || idx + 1}</text>
        <text x="${x + 38}" y="${y + 22}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">STAGE ${s.step || idx + 1}</text>
        
        <!-- Step Title -->
        <text x="${x + cardWidth / 2}" y="${y + 58}" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#0F172A" text-anchor="middle">
          ${escapeXml((s.name || '').substring(0, 26))}
        </text>

        <!-- Divider line -->
        <line x1="${x + 15}" y1="${y + 68}" x2="${x + cardWidth - 15}" y2="${y + 68}" stroke="${cardBorder}" stroke-width="1" stroke-dasharray="2 2" />

        <!-- Step Description Lines -->
        <g font-family="Inter, sans-serif" font-size="10" fill="#475569" text-anchor="middle">
          ${wrapSvgText(s.desc || '', 24).slice(0, 4).map((line, lIdx) => 
            `<text x="${x + cardWidth / 2}" y="${y + 86 + lIdx * 14}">${escapeXml(line)}</text>`
          ).join('')}
        </g>
      </g>
    `;

    // Connecting Arrow to next step
    if (idx < totalSteps - 1) {
      if (!isTwoRows || (row === 0 && col < cols - 1) || (row === 1 && col > 0)) {
        // Horizontal arrow
        const arrowDir = isReversed ? -1 : 1;
        const arrowStartX = isReversed ? x - 4 : x + cardWidth + 4;
        const arrowEndX = isReversed ? x - 31 : x + cardWidth + 31;
        const arrowY = y + cardHeight / 2;

        svgElements += `
          <g class="arrow-h">
            <line x1="${arrowStartX}" y1="${arrowY}" x2="${arrowEndX}" y2="${arrowY}" stroke="#2563EB" stroke-width="2.5" marker-end="url(#arrowhead)" />
            <text x="${(arrowStartX + arrowEndX) / 2}" y="${arrowY - 6}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#3B82F6" text-anchor="middle">NEXT</text>
          </g>
        `;
      } else if (row === 0 && col === cols - 1) {
        // Curve Down arrow connecting row 0 to row 1
        const downX = x + cardWidth / 2;
        const downStartY = y + cardHeight + 4;
        const downEndY = y + cardHeight + 66;

        svgElements += `
          <g class="arrow-v">
            <path d="M ${downX} ${downStartY} L ${downX} ${downEndY}" stroke="#2563EB" stroke-width="2.5" marker-end="url(#arrowhead)" />
            <text x="${downX + 18}" y="${(downStartY + downEndY) / 2 + 3}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#3B82F6">SUBSEQUENT</text>
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
      <polygon points="0 0, 8 3, 0 6" fill="#2563EB" />
    </marker>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
  </defs>

  <!-- Canvas Background -->
  <rect width="${width}" height="${height}" fill="#FAFAFA" rx="16" />
  
  <!-- Subtle Blueprint Grid Pattern -->
  <g opacity="0.3">
    ${Array.from({ length: Math.floor(width / 30) }).map((_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="${height}" stroke="#E2E8F0" stroke-width="0.5" />`).join('')}
    ${Array.from({ length: Math.floor(height / 30) }).map((_, i) => `<line x1="0" y1="${i * 30}" x2="${width}" y2="${i * 30}" stroke="#E2E8F0" stroke-width="0.5" />`).join('')}
  </g>

  <!-- Top Title Banner -->
  <rect x="20" y="16" width="${width - 40}" height="48" rx="10" fill="url(#headerGrad)" />
  <circle cx="45" cy="40" r="12" fill="#38BDF8" fill-opacity="0.2" />
  <text x="45" y="44" font-family="Inter, sans-serif" font-size="12" font-weight="900" fill="#38BDF8" text-anchor="middle">⚙️</text>
  <text x="68" y="38" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">IELTS ACADEMIC TASK 1: PROCESS FLOWCHART</text>
  <text x="68" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#94A3B8">${escapeXml(title)}</text>
  <rect x="${width - 150}" y="28" width="115" height="24" rx="6" fill="#0EA5E9" fill-opacity="0.2" stroke="#38BDF8" stroke-width="1" />
  <text x="${width - 92}" y="44" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">${totalSteps} GIAI ĐOẠN TUẦN TỰ</text>

  <!-- Process Steps & Arrows -->
  ${svgElements}

  <!-- Bottom Legend / Sequence Helper Bar -->
  <rect x="30" y="${height - 40}" width="${width - 60}" height="28" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="${height - 22}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#475569">💡 Cụm từ nối báo cáo:</text>
  <text x="175" y="${height - 22}" font-family="Inter, sans-serif" font-size="10" fill="#2563EB" font-weight="600">Initially → Following this → Subsequently → Prior to being... → Finally</text>
  <text x="${width - 45}" y="${height - 22}" font-family="Inter, sans-serif" font-size="9" fill="#94A3B8" font-weight="600" text-anchor="end">Cambridge IELTS Standard Diagram</text>
</svg>`;
}

/**
 * Generates an authentic Cambridge-style IELTS Dual-Period Map Comparison as an SVG string
 * @param {object} task { title, prompt, mapChanges: [{ feature, past, present }] }
 * @returns {string} Raw SVG XML string
 */
export function generateMapComparisonSvg(task = {}) {
  const changes = task.mapChanges || [
    { feature: 'Northwest Farmland', past: 'Agricultural land and forestry', present: 'Luxury residential housing estate' },
    { feature: 'Southern Coast', past: 'Small fishing dock with wooden pier', present: 'Leisure marina and yacht club' },
    { feature: 'Eastern Shore', past: 'Empty shoreline and marshland', present: 'Multi-story hotel resort' },
    { feature: 'Center Village', past: 'Narrow gravel road', present: 'Widened dual-carriageway with shops' }
  ];

  const title = task.title || 'IELTS Academic Writing Task 1 - Map Transformation';
  
  // Extract periods (e.g. 1995 vs 2025 or Before vs After)
  const titleMatch = title.match(/(\d{4})[^\d]+(\d{4}|present)/i);
  const period1 = titleMatch ? titleMatch[1] : 'TRƯỚC QUY HOẠCH (PAST)';
  const period2 = titleMatch ? (titleMatch[2].toLowerCase() === 'present' ? 'HIỆN TẠI (PRESENT)' : titleMatch[2]) : 'SAU QUY HOẠCH (PRESENT)';

  const width = 960;
  const height = 520;
  const mapW = 425;
  const mapH = 370;

  const map1X = 35;
  const map2X = 500;
  const mapY = 85;

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
    <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5E1" stroke-width="1.5" />
    </pattern>
    <pattern id="waves" width="20" height="10" patternUnits="userSpaceOnUse">
      <path d="M 0 5 Q 5 0 10 5 T 20 5" fill="none" stroke="#60A5FA" stroke-width="1" opacity="0.6" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#F8FAFC" rx="16" />

  <!-- Top Title Bar -->
  <rect x="20" y="16" width="${width - 40}" height="50" rx="10" fill="url(#headerGradMap)" />
  <circle cx="45" cy="41" r="12" fill="#10B981" fill-opacity="0.2" />
  <text x="45" y="45" font-family="Inter, sans-serif" font-size="12" text-anchor="middle">🧭</text>
  <text x="68" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">IELTS ACADEMIC TASK 1: MAP COMPARISON</text>
  <text x="68" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#94A3B8">${escapeXml(title)}</text>
  
  <rect x="${width - 170}" y="28" width="135" height="24" rx="6" fill="#10B981" fill-opacity="0.2" stroke="#34D399" stroke-width="1" />
  <text x="${width - 102}" y="44" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#34D399" text-anchor="middle">ĐỐI CHIẾU 2 THỜI KỲ</text>

  <!-- ============================================================== -->
  <!-- MAP 1: PAST PERIOD                                             -->
  <!-- ============================================================== -->
  <g id="map-past">
    <!-- Map Outer Border & Background -->
    <rect x="${map1X}" y="${mapY}" width="${mapW}" height="${mapH}" rx="12" fill="#FEFCE8" stroke="#CBD5E1" stroke-width="2" filter="url(#map-shadow)" />

    <!-- Map Title Badge -->
    <rect x="${map1X + 12}" y="${mapY + 12}" width="160" height="26" rx="6" fill="#B45309" />
    <text x="${map1X + 92}" y="${mapY + 29}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">MAP 1: ${escapeXml(period1)}</text>

    <!-- Compass Rose -->
    <g transform="translate(${map1X + mapW - 36}, ${mapY + 36})">
      <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5" />
      <polygon points="0,-12 4,0 0,2 -4,0" fill="#DC2626" />
      <polygon points="0,12 4,0 0,-2 -4,0" fill="#64748B" />
      <text x="0" y="-14" font-family="Inter, sans-serif" font-size="8" font-weight="900" fill="#DC2626" text-anchor="middle">N</text>
      <text x="14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">E</text>
      <text x="0" y="20" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">S</text>
      <text x="-14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">W</text>
    </g>

    <!-- Sea / Waterfront in the South -->
    <path d="M ${map1X} ${mapY + mapH - 75} Q ${map1X + 150} ${mapY + mapH - 95} ${map1X + mapW} ${mapY + mapH - 70} L ${map1X + mapW} ${mapY + mapH} L ${map1X} ${mapY + mapH} Z" fill="#DBEAFE" stroke="#93C5FD" stroke-width="1.5" />
    <rect x="${map1X}" y="${mapY + mapH - 65}" width="${mapW}" height="65" fill="url(#waves)" />
    <text x="${map1X + mapW / 2}" y="${mapY + mapH - 18}" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#1E40AF" text-anchor="middle" font-style="italic">SOUTHERN COASTLINE / SEA</text>

    <!-- Northwest Farmland & Trees (Green) -->
    <rect x="${map1X + 16}" y="${mapY + 50}" width="165" height="110" rx="8" fill="#DCFCE7" stroke="#86EFAC" stroke-width="1.5" />
    <text x="${map1X + 98}" y="${mapY + 75}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#15803D" text-anchor="middle">FARMLAND &amp; WOODS</text>
    <text x="${map1X + 98}" y="${mapY + 92}" font-family="Inter, sans-serif" font-size="9" fill="#166534" text-anchor="middle">🌳 🌾 🌳 🌾 🌳</text>
    <text x="${map1X + 98}" y="${mapY + 110}" font-family="Inter, sans-serif" font-size="9" fill="#166534" text-anchor="middle">(Agricultural green space)</text>
    <text x="${map1X + 98}" y="${mapY + 128}" font-family="Inter, sans-serif" font-size="8" fill="#4B5563" text-anchor="middle">[Area marked for future housing]</text>

    <!-- Center Village / Traditional Shops -->
    <rect x="${map1X + 215}" y="${mapY + 50}" width="180" height="100" rx="8" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1.5" />
    <text x="${map1X + 305}" y="${mapY + 75}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#B45309" text-anchor="middle">TRADITIONAL VILLAGE SHOPS</text>
    <rect x="${map1X + 230}" y="${mapY + 88}" width="40" height="35" rx="4" fill="#FDE68A" stroke="#D97706" />
    <text x="${map1X + 250}" y="${mapY + 109}" font-size="8" font-family="Inter, sans-serif" text-anchor="middle" fill="#78350F">Bakery</text>
    <rect x="${map1X + 285}" y="${mapY + 88}" width="40" height="35" rx="4" fill="#FDE68A" stroke="#D97706" />
    <text x="${map1X + 305}" y="${mapY + 109}" font-size="8" font-family="Inter, sans-serif" text-anchor="middle" fill="#78350F">Market</text>
    <rect x="${map1X + 340}" y="${mapY + 88}" width="40" height="35" rx="4" fill="#FDE68A" stroke="#D97706" />
    <text x="${map1X + 360}" y="${mapY + 109}" font-size="8" font-family="Inter, sans-serif" text-anchor="middle" fill="#78350F">Post Off.</text>

    <!-- Main Road (Narrow, single lane) -->
    <path d="M ${map1X + 195} ${mapY + 45} L ${map1X + 195} ${mapY + mapH - 85}" stroke="#94A3B8" stroke-width="14" fill="none" />
    <path d="M ${map1X + 195} ${mapY + 45} L ${map1X + 195} ${mapY + mapH - 85}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6" fill="none" />
    <text x="${map1X + 178}" y="${mapY + 200}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#475569" transform="rotate(-90 ${map1X + 178},${mapY + 200})" text-anchor="middle">NARROW GRAVEL ROAD</text>

    <!-- Old Fishing Dock (Pier into Sea) -->
    <rect x="${map1X + 180}" y="${mapY + mapH - 95}" width="30" height="48" rx="3" fill="#92400E" stroke="#78350F" />
    <text x="${map1X + 195}" y="${mapY + mapH - 65}" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#FFFFFF" text-anchor="middle">DOCK</text>
    <text x="${map1X + 195}" y="${mapY + mapH - 52}" font-family="Inter, sans-serif" font-size="7" fill="#FDE68A" text-anchor="middle">(Timber pier)</text>

    <!-- Eastern Marshland (Unused wetland) -->
    <rect x="${map1X + 245}" y="${mapY + 180}" width="155" height="95" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-dasharray="4 3" />
    <text x="${map1X + 322}" y="${mapY + 215}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#64748B" text-anchor="middle">EMPTY MARSHLAND</text>
    <text x="${map1X + 322}" y="${mapY + 235}" font-family="Inter, sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">🌾 Undeveloped wetlands 🌾</text>
  </g>

  <!-- ============================================================== -->
  <!-- MAP 2: PRESENT PERIOD (REDEVELOPED)                            -->
  <!-- ============================================================== -->
  <g id="map-present">
    <!-- Map Outer Border & Background -->
    <rect x="${map2X}" y="${mapY}" width="${mapW}" height="${mapH}" rx="12" fill="#F0FDF4" stroke="#CBD5E1" stroke-width="2" filter="url(#map-shadow)" />

    <!-- Map Title Badge -->
    <rect x="${map2X + 12}" y="${mapY + 12}" width="160" height="26" rx="6" fill="#047857" />
    <text x="${map2X + 92}" y="${mapY + 29}" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">MAP 2: ${escapeXml(period2)}</text>

    <!-- Compass Rose -->
    <g transform="translate(${map2X + mapW - 36}, ${mapY + 36})">
      <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5" />
      <polygon points="0,-12 4,0 0,2 -4,0" fill="#DC2626" />
      <polygon points="0,12 4,0 0,-2 -4,0" fill="#64748B" />
      <text x="0" y="-14" font-family="Inter, sans-serif" font-size="8" font-weight="900" fill="#DC2626" text-anchor="middle">N</text>
      <text x="14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">E</text>
      <text x="0" y="20" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">S</text>
      <text x="-14" y="3" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#64748B" text-anchor="middle">W</text>
    </g>

    <!-- Sea / Waterfront in the South -->
    <path d="M ${map2X} ${mapY + mapH - 75} Q ${map2X + 150} ${mapY + mapH - 95} ${map2X + mapW} ${mapY + mapH - 70} L ${map2X + mapW} ${mapY + mapH} L ${map2X} ${mapY + mapH} Z" fill="#DBEAFE" stroke="#93C5FD" stroke-width="1.5" />
    <rect x="${map2X}" y="${mapY + mapH - 65}" width="${mapW}" height="65" fill="url(#waves)" />
    <text x="${map2X + mapW / 2}" y="${mapY + mapH - 18}" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#1E40AF" text-anchor="middle" font-style="italic">SOUTHERN COASTLINE / SEA</text>

    <!-- NEW: Residential Housing Estate (Replacing Farmland) -->
    <rect x="${map2X + 16}" y="${mapY + 50}" width="165" height="110" rx="8" fill="#F1F5F9" stroke="#3B82F6" stroke-width="2" />
    <text x="${map2X + 98}" y="${mapY + 70}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle">HOUSING ESTATE</text>
    <!-- Houses grid -->
    <g transform="translate(${map2X + 26}, ${mapY + 78})">
      <rect x="5" y="5" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" />
      <rect x="50" y="5" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" />
      <rect x="95" y="5" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" />
      <rect x="5" y="36" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" />
      <rect x="50" y="36" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" />
      <rect x="95" y="36" width="30" height="22" rx="3" fill="#93C5FD" stroke="#1E40AF" />
      <text x="72" y="72" font-family="Inter, sans-serif" font-size="8" fill="#1E3A8A" font-weight="600" text-anchor="middle">🏘️ Modern Residences</text>
    </g>

    <!-- NEW: Commercial Plaza & Pedestrian Walkway -->
    <rect x="${map2X + 225}" y="${mapY + 50}" width="175" height="100" rx="8" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2" />
    <text x="${map2X + 312}" y="${mapY + 72}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#6D28D9" text-anchor="middle">SHOPPING MALL &amp; PLAZA</text>
    <rect x="${map2X + 240}" y="${mapY + 82}" width="65" height="45" rx="4" fill="#DDD6FE" stroke="#7C3AED" />
    <text x="${map2X + 272}" y="${mapY + 108}" font-size="9" font-family="Inter, sans-serif" text-anchor="middle" fill="#5B21B6" font-weight="700">Mall</text>
    <rect x="${map2X + 320}" y="${mapY + 82}" width="65" height="45" rx="4" fill="#DDD6FE" stroke="#7C3AED" />
    <text x="${map2X + 352}" y="${mapY + 108}" font-size="9" font-family="Inter, sans-serif" text-anchor="middle" fill="#5B21B6" font-weight="700">Car Park</text>

    <!-- WIDENED DUAL CARRIAGEWAY & ROUNDABOUT -->
    <path d="M ${map2X + 195} ${mapY + 45} L ${map2X + 195} ${mapY + mapH - 85}" stroke="#475569" stroke-width="22" fill="none" />
    <path d="M ${map2X + 195} ${mapY + 45} L ${map2X + 195} ${mapY + mapH - 85}" stroke="#FACC15" stroke-width="2" fill="none" />
    <!-- Roundabout circle -->
    <circle cx="${map2X + 195}" cy="${mapY + 195}" r="22" fill="#475569" stroke="#64748B" stroke-width="3" />
    <circle cx="${map2X + 195}" cy="${mapY + 195}" r="9" fill="#10B981" />
    <text x="${map2X + 195}" y="${mapY + 228}" font-family="Inter, sans-serif" font-size="7" font-weight="800" fill="#334155" text-anchor="middle">ROUNDABOUT</text>

    <!-- NEW: Modern Marina & Yacht Club (Replaced Fishing Dock) -->
    <rect x="${map2X + 165}" y="${mapY + mapH - 95}" width="60" height="65" rx="6" fill="#0284C7" stroke="#0369A1" stroke-width="2" />
    <text x="${map2X + 195}" y="${mapY + mapH - 72}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">LEISURE</text>
    <text x="${map2X + 195}" y="${mapY + mapH - 58}" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">MARINA</text>
    <text x="${map2X + 195}" y="${mapY + mapH - 42}" font-family="Inter, sans-serif" font-size="8" fill="#BAE6FD" text-anchor="middle">⛵ Yachts</text>

    <!-- NEW: Luxury Seafront Hotel & Promenade (Replaced Marshland) -->
    <rect x="${map2X + 245}" y="${mapY + 180}" width="155" height="95" rx="8" fill="#FFE4E6" stroke="#F43F5E" stroke-width="2" />
    <text x="${map2X + 322}" y="${mapY + 205}" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">LUXURY HOTEL COMPLEX</text>
    <text x="${map2X + 322}" y="${mapY + 225}" font-family="Inter, sans-serif" font-size="9" fill="#E11D48" text-anchor="middle">🏨 Resort &amp; Spa</text>
    <path d="M ${map2X + 245} ${mapY + 258} L ${map2X + 400} ${mapY + 258}" stroke="#F43F5E" stroke-width="3" stroke-dasharray="4 2" />
    <text x="${map2X + 322}" y="${mapY + 252}" font-family="Inter, sans-serif" font-size="8" fill="#881337" font-weight="700" text-anchor="middle">Seafront Promenade</text>
  </g>

  <!-- Bottom Key Comparison & Vocabulary Guide -->
  <rect x="30" y="${height - 48}" width="${width - 60}" height="36" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="${height - 26}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#0F172A">🔍 Biến đổi trọng tâm:</text>
  <text x="175" y="${height - 26}" font-family="Inter, sans-serif" font-size="9.5" fill="#059669" font-weight="600">
    Farmland → Housing | Traditional Shops → Mall | Fishing Pier → Marina | Marshland → Hotel Resort
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
