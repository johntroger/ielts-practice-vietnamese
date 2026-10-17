/**
 * src/data/arenaQuestionBank.js
 * 
 * Comprehensive 4-Tier Question Bank for Atlas English Arena.
 * 
 * Features:
 * - 4 IELTS Band Tiers: easy (4.0-5.0), medium (5.5-6.5), hard (7.0-8.0), nightmare (8.5-9.0)
 * - 8 Academic IELTS Topics: environment, technology, education, health, urbanization, economy, culture, science
 * - Rich Multimedia Support: Text, Audio (TTS), and Visual Assets (Charts, Maps, Process Diagrams)
 * - Authentic Cambridge Examination Style distractors and detailed examiner rationale
 */

import { ARENA_BATCH_1_QUESTIONS } from './arenaQuestionsBatch1.js';
import { ARENA_BATCH_2_QUESTIONS } from './arenaQuestionsBatch2.js';
import { ARENA_QUESTION_TRANSLATIONS } from './arenaQuestionTranslations.js';
import { ARENA_101_READING_QUESTIONS } from './arenaQuestions101Reading.js';

export const ARENA_BASE_QUESTION_BANK = [
  // ==========================================
  // MICRO VISUAL DATA & RAPID MAP/CHART DECODER
  // ==========================================
  {
    id: 'visual_map_village_bypass_01',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'visual_data',
    type: 'visual_data',
    prompt: 'Based on the proposed road development map, which landmark will be bypassed by the new dual carriageway?',
    context: 'Examine the proposed infrastructure blueprint: The existing A42 route cuts directly through Highbridge Market Square, whereas the new bypass arcs north between the Industrial Park and North Meadow.',
    media: {
      type: 'map',
      caption: 'Cambridge Map: Proposed Northern Bypass for Highbridge Village',
      svg: '<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-950/80 p-2"><rect width="400" height="200" fill="#0f172a" rx="8"/><g transform="translate(360, 30)"><circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#475569" stroke-width="1.5"/><path d="M0 -12 L4 2 L0 0 L-4 2 Z" fill="#ef4444"/><path d="M0 12 L4 0 L0 0 L-4 0 Z" fill="#94a3b8"/><text x="0" y="-14" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">N</text></g><path d="M 20 110 Q 150 115 200 110 T 380 110" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round"/><path d="M 50 110 Q 200 25 350 110" fill="none" stroke="#6366f1" stroke-width="5" stroke-dasharray="6,4" stroke-linecap="round"/><rect x="160" y="90" width="80" height="40" fill="#334155" stroke="#f59e0b" stroke-width="2" rx="4"/><text x="200" y="112" fill="#fde68a" font-size="10" font-weight="bold" text-anchor="middle">Market Square</text><text x="200" y="124" fill="#94a3b8" font-size="8" text-anchor="middle">(Highbridge Village)</text><rect x="140" y="40" width="120" height="22" fill="#064e3b" stroke="#10b981" stroke-width="1" rx="4"/><text x="200" y="55" fill="#a7f3d0" font-size="9" font-weight="bold" text-anchor="middle">North Meadow Reservoir</text><rect x="40" y="55" width="80" height="25" fill="#1e293b" stroke="#64748b" stroke-width="1" rx="4"/><text x="80" y="71" fill="#cbd5e1" font-size="8.5" font-weight="bold" text-anchor="middle">Industrial Park</text><line x1="30" y1="175" x2="60" y2="175" stroke="#64748b" stroke-width="4"/><text x="65" y="178" fill="#94a3b8" font-size="8.5">Existing A42</text><line x1="160" y1="175" x2="190" y2="175" stroke="#6366f1" stroke-width="3" stroke-dasharray="4,3"/><text x="195" y="178" fill="#818cf8" font-size="8.5">Proposed Bypass</text></svg>'
    },
    options: ['Highbridge Market Square', 'Industrial Park', 'North Meadow Reservoir', 'Railway Station Junction'],
    correctIndex: 0,
    correctAnswer: 'Highbridge Market Square',
    explanation: 'The new bypass diverts heavy transit traffic away from Highbridge Market Square by skirting northward around the settlement.'
  },
  {
    id: 'visual_process_water_filtration_02',
    difficulty: 'hard',
    topic: 'science',
    skillCategory: 'visual_data',
    type: 'visual_data',
    prompt: 'At which stage in the purification sequence is chemical disinfectant introduced?',
    context: 'Diagram shows: Stage 1 (Screening coarse debris) -> Stage 2 (Sedimentation Tank) -> Stage 3 (Sand & Carbon Filtration) -> Stage 4 (Chlorination Chamber) -> Stage 5 (Storage & Distribution).',
    media: {
      type: 'diagram',
      caption: 'Cambridge Process: Multi-Stage Water Filtration Plant',
      svg: '<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-950/80 p-2"><rect width="460" height="180" fill="#0f172a" rx="8"/><rect x="15" y="55" width="70" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" rx="6"/><text x="50" y="78" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">Stage 1</text><text x="50" y="95" fill="#e2e8f0" font-size="8" text-anchor="middle">Coarse Screen</text><path d="M 88 85 L 102 85" stroke="#64748b" stroke-width="2"/><rect x="105" y="55" width="70" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" rx="6"/><text x="140" y="78" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">Stage 2</text><text x="140" y="95" fill="#e2e8f0" font-size="8" text-anchor="middle">Sedimentation</text><path d="M 178 85 L 192 85" stroke="#64748b" stroke-width="2"/><rect x="195" y="55" width="70" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" rx="6"/><text x="230" y="78" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">Stage 3</text><text x="230" y="95" fill="#e2e8f0" font-size="8" text-anchor="middle">Sand & Carbon</text><path d="M 268 85 L 282 85" stroke="#64748b" stroke-width="2"/><rect x="285" y="50" width="75" height="70" fill="#431407" stroke="#f97316" stroke-width="2.5" rx="6"/><text x="322" y="74" fill="#fb923c" font-size="9.5" font-weight="black" text-anchor="middle">Stage 4 ⚠️</text><text x="322" y="90" fill="#ffedd5" font-size="8" font-weight="bold" text-anchor="middle">Chlorination</text><text x="322" y="104" fill="#fdba74" font-size="7.5" text-anchor="middle">(Disinfectant)</text><path d="M 363 85 L 377 85" stroke="#64748b" stroke-width="2"/><rect x="380" y="55" width="65" height="60" fill="#1e293b" stroke="#10b981" stroke-width="1.5" rx="6"/><text x="412" y="78" fill="#34d399" font-size="9" font-weight="bold" text-anchor="middle">Stage 5</text><text x="412" y="95" fill="#e2e8f0" font-size="8" text-anchor="middle">Distribution</text></svg>'
    },
    options: ['Stage 4 (Chlorination Chamber)', 'Stage 2 (Sedimentation Tank)', 'Stage 3 (Sand & Carbon Filtration)', 'Stage 1 (Coarse Screening)'],
    correctIndex: 0,
    correctAnswer: 'Stage 4 (Chlorination Chamber)',
    explanation: 'Chemical disinfectant (chlorine) is injected during Stage 4 immediately following fine sand and activated carbon filtration.'
  },
  {
    id: 'visual_chart_renewable_energy_03',
    difficulty: 'medium',
    topic: 'environment',
    skillCategory: 'visual_data',
    type: 'visual_data',
    prompt: 'According to the comparative bar chart, which clean energy sector experienced the highest percentage-point increase?',
    context: 'Solar PV expanded from 4% to 28% (+24%), Wind energy rose from 12% to 26% (+14%), Hydro remained stable at 15% to 16% (+1%), and Biomass grew from 5% to 8% (+3%).',
    media: {
      type: 'chart',
      caption: 'Task 1 Trend: Renewable Energy Share in Grid (2010 vs 2025)',
      svg: '<svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-950/80 p-2"><rect width="420" height="190" fill="#0f172a" rx="8"/><line x1="50" y1="140" x2="390" y2="140" stroke="#334155" stroke-width="1"/><line x1="50" y1="100" x2="390" y2="100" stroke="#1e293b" stroke-dasharray="3,3"/><line x1="50" y1="60" x2="390" y2="60" stroke="#1e293b" stroke-dasharray="3,3"/><text x="42" y="144" fill="#64748b" font-size="8" text-anchor="end">0%</text><text x="42" y="104" fill="#64748b" font-size="8" text-anchor="end">15%</text><text x="42" y="64" fill="#64748b" font-size="8" text-anchor="end">30%</text><rect x="70" y="129" width="22" height="11" fill="#64748b" rx="2"/><rect x="96" y="65" width="22" height="75" fill="#f59e0b" rx="2"/><text x="94" y="58" fill="#fde68a" font-size="9" font-weight="bold" text-anchor="middle">28%</text><text x="94" y="156" fill="#cbd5e1" font-size="8" font-weight="bold" text-anchor="middle">Solar PV</text><rect x="150" y="108" width="22" height="32" fill="#64748b" rx="2"/><rect x="176" y="71" width="22" height="69" fill="#06b6d4" rx="2"/><text x="174" y="156" fill="#cbd5e1" font-size="8" font-weight="bold" text-anchor="middle">Wind</text><rect x="230" y="100" width="22" height="40" fill="#64748b" rx="2"/><rect x="256" y="97" width="22" height="43" fill="#3b82f6" rx="2"/><text x="254" y="156" fill="#cbd5e1" font-size="8" font-weight="bold" text-anchor="middle">Hydro</text><rect x="310" y="127" width="22" height="13" fill="#64748b" rx="2"/><rect x="336" y="119" width="22" height="21" fill="#10b981" rx="2"/><text x="334" y="156" fill="#cbd5e1" font-size="8" font-weight="bold" text-anchor="middle">Biomass</text><rect x="140" y="15" width="14" height="8" fill="#64748b" rx="1"/><text x="158" y="22" fill="#94a3b8" font-size="8.5">2010</text><rect x="220" y="15" width="14" height="8" fill="#f59e0b" rx="1"/><text x="238" y="22" fill="#fde68a" font-size="8.5">2025</text></svg>'
    },
    options: ['Solar Photovoltaic', 'Wind Turbines', 'Hydroelectric Power', 'Biomass'],
    correctIndex: 0,
    correctAnswer: 'Solar Photovoltaic',
    explanation: 'Solar PV surged by 24 percentage points (from 4% to 28%), significantly outpacing wind (+14%) and hydro (+1%).'
  },
  {
    id: 'visual_map_harbor_quayside_04',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'visual_data',
    type: 'visual_data',
    prompt: 'Looking at the quayside layout, where has the new Pedestrian Footbridge been constructed relative to the Old Customs House?',
    context: 'The Old Customs House sits at the eastern end of Pier 1. The newly constructed swing footbridge links the south pier directly to the Promenade on the opposite bank.',
    media: {
      type: 'map',
      caption: 'Listening Section 2: Portfield Quayside Redevelopment',
      svg: '<svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-950/80 p-2"><rect width="420" height="190" fill="#0f172a" rx="8"/><rect x="20" y="70" width="380" height="55" fill="#0c4a6e" stroke="#0284c7" stroke-width="1.5" rx="4"/><text x="210" y="102" fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle">Inner Harbor Channel</text><rect x="20" y="20" width="380" height="45" fill="#1e293b" stroke="#475569" stroke-width="1" rx="4"/><rect x="280" y="26" width="105" height="32" fill="#312e81" stroke="#818cf8" stroke-width="1.5" rx="3"/><text x="332" y="46" fill="#e0e7ff" font-size="9" font-weight="bold" text-anchor="middle">Old Customs House</text><rect x="20" y="130" width="380" height="45" fill="#1e293b" stroke="#475569" stroke-width="1" rx="4"/><text x="100" y="158" fill="#94a3b8" font-size="9" font-weight="bold">South Promenade</text><rect x="315" y="65" width="34" height="65" fill="#b45309" stroke="#fbbf24" stroke-width="2" rx="3"/><text x="332" y="100" fill="#fef3c7" font-size="7.5" font-weight="black" text-anchor="middle">Footbridge</text><circle cx="55" cy="42" r="14" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/><text x="55" y="45" fill="#fef3c7" font-size="8" font-weight="bold" text-anchor="middle">Lighthouse</text></svg>'
    },
    options: ['Immediately south of the Old Customs House', 'Directly north of the Lighthouse', 'Western boundary of the Cargo Terminal', 'At the entrance of the Fish Market'],
    correctIndex: 0,
    correctAnswer: 'Immediately south of the Old Customs House',
    explanation: 'The pedestrian footbridge spans across the southern channel directly opposite and south of the Old Customs House.'
  },

  // ==========================================
  // TIER 1: EASY (Band 4.0 - 5.0) - Base XP: 12
  // ==========================================
  {
    id: 'easy_env_01',
    difficulty: 'easy',
    topic: 'environment',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Which word correctly completes the sentence about nature conservation?',
    context: 'Many rare animal species are at risk of _____ due to deforestation.',
    options: ['extinction', 'extincting', 'extinctance', 'extinctive'],
    correctIndex: 0,
    correctAnswer: 'extinction',
    explanation: 'The noun "extinction" is standard after the preposition "of" (at risk of extinction).'
  },
  {
    id: 'easy_tech_02',
    difficulty: 'easy',
    topic: 'technology',
    skillCategory: 'vocab',
    type: 'spelling',
    prompt: 'Identify the authentic English spelling for computerized machinery:',
    context: 'Modern factories rely heavily on computerized _____ to assemble electronics.',
    options: ['equipment', 'equiptment', 'equipement', 'equipmant'],
    correctIndex: 0,
    correctAnswer: 'equipment',
    explanation: '"Equipment" is spelled with single \'p\' and is an uncountable noun in English.'
  },
  {
    id: 'easy_edu_03',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'reading',
    type: 'tfng',
    prompt: 'According to the passage, is the statement TRUE, FALSE, or NOT GIVEN?',
    context: 'Universities in Canada offer both full-time and part-time degree courses. Tuition fees are generally lower for domestic students than for overseas candidates.\n\nStatement: "Domestic students pay less tuition than international students."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctIndex: 0,
    correctAnswer: 'TRUE',
    explanation: 'The text states tuition fees are "lower for domestic students than for overseas candidates", making the statement TRUE.'
  },
  {
    id: 'easy_health_04',
    difficulty: 'easy',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen and identify the doctor\'s appointment time:',
    context: 'I was hoping for a 10:15 appointment, but the receptionist told me the earliest available slot is at eleven thirty in the morning.',
    audioText: 'I was hoping for a 10:15 appointment, but the receptionist told me the earliest available slot is at eleven thirty in the morning.',
    options: ['10:15 AM', '11:30 AM', '10:30 AM', '11:15 AM'],
    correctIndex: 1,
    correctAnswer: '11:30 AM',
    explanation: 'The speaker wanted 10:15, but the actual appointment slot was "eleven thirty" (11:30 AM).'
  },
  {
    id: 'easy_chart_05',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'visual_data',
    type: 'chart_reading',
    prompt: 'Based on the sales report chart, which sector recorded the HIGHEST revenue in 2024?',
    context: 'Annual revenue by sector: Agriculture ($12M), Manufacturing ($38M), Renewable Energy ($54M), Tourism ($26M).',
    media: {
      type: 'chart',
      caption: 'Annual Revenue by Industrial Sector (2024)',
      alt: 'Bar chart showing Renewable Energy leading at $54M',
      svg: '<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-900 border border-slate-800 p-2"><rect x="30" y="130" width="60" height="40" fill="#38bdf8"/><text x="40" y="120" fill="#94a3b8" font-size="12">$12M</text><text x="35" y="190" fill="#cbd5e1" font-size="11">Agri</text><rect x="120" y="80" width="60" height="90" fill="#818cf8"/><text x="130" y="70" fill="#94a3b8" font-size="12">$38M</text><text x="125" y="190" fill="#cbd5e1" font-size="11">Mfg</text><rect x="210" y="40" width="60" height="130" fill="#34d399"/><text x="220" y="30" fill="#34d399" font-weight="bold" font-size="12">$54M</text><text x="215" y="190" fill="#cbd5e1" font-size="11">Clean Energy</text><rect x="300" y="100" width="60" height="70" fill="#fbbf24"/><text x="310" y="90" fill="#94a3b8" font-size="12">$26M</text><text x="310" y="190" fill="#cbd5e1" font-size="11">Tourism</text></svg>'
    },
    options: ['Agriculture', 'Manufacturing', 'Renewable Energy', 'Tourism'],
    correctIndex: 2,
    correctAnswer: 'Renewable Energy',
    explanation: 'Renewable Energy generated $54M, surpassing all other sectors shown on the bar chart.'
  },
  {
    id: 'easy_urban_06',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'vocab',
    type: 'synonym',
    prompt: 'Choose the correct synonym for "convenient" in urban transport:',
    context: 'Subway trains provide a convenient way for commuters to reach the city center.',
    options: ['easy and accessible', 'expensive and noisy', 'isolated and slow', 'crowded and hazardous'],
    correctIndex: 0,
    correctAnswer: 'easy and accessible',
    explanation: '"Convenient" means fitting in well with a person\'s needs or activities; easy and accessible.'
  },
  {
    id: 'easy_culture_07',
    difficulty: 'easy',
    topic: 'culture',
    skillCategory: 'reading',
    type: 'tfng',
    prompt: 'Does the statement agree with the information given? (TRUE / FALSE / NOT GIVEN)',
    context: 'The city art gallery was founded in 1920. Admission has always remained free to the public, although voluntary donations are welcomed.\n\nStatement: "Visitors must pay an entrance fee to see the art exhibition."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctIndex: 1,
    correctAnswer: 'FALSE',
    explanation: 'The text specifies "admission has always remained free", directly contradicting that visitors must pay.'
  },

  // ==========================================
  // TIER 2: MEDIUM (Band 5.5 - 6.5) - Base XP: 20
  // ==========================================
  {
    id: 'med_env_01',
    difficulty: 'medium',
    topic: 'environment',
    skillCategory: 'reading',
    type: 'tfng',
    prompt: 'Determine whether the statement is TRUE, FALSE, or NOT GIVEN:',
    context: 'While offshore wind turbines generate substantial electricity, marine biologists argue their construction noise disrupts the echolocation of cetaceans such as dolphins.\n\nStatement: "Offshore wind turbines have no negative environmental consequences."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctIndex: 1,
    correctAnswer: 'FALSE',
    explanation: 'The passage explicitly points out disruption to marine life echolocation, proving negative environmental impacts exist.'
  },
  {
    id: 'med_tech_02',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'vocab',
    type: 'synonym',
    prompt: 'Select the academic paraphrase for "rapidly accelerated":',
    context: 'The adoption of artificial intelligence tools has rapidly accelerated across global financial institutions.',
    options: ['proliferated exponentially', 'declined precipitously', 'stagnated noticeably', 'oscillated marginally'],
    correctIndex: 0,
    correctAnswer: 'proliferated exponentially',
    explanation: '"Proliferated exponentially" is a Band 6.5+ academic equivalent for growing/accelerating rapidly.'
  },
  {
    id: 'med_edu_03',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the advisor and select the student\'s final elective module:',
    context: 'I had initially enrolled in Macroeconomics, but upon reflection, I switched over to International Marketing because the syllabus fits my career plan much better.',
    audioText: 'I had initially enrolled in Macroeconomics, but upon reflection, I switched over to International Marketing because the syllabus fits my career plan much better.',
    options: ['Macroeconomics', 'International Marketing', 'Financial Accounting', 'Business Statistics'],
    correctIndex: 1,
    correctAnswer: 'International Marketing',
    explanation: 'The speaker used a classic Cambridge self-correction trap: initially enrolled in Macroeconomics, but "switched over to International Marketing".'
  },
  {
    id: 'med_map_04',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'visual_data',
    type: 'map_reading',
    prompt: 'According to the campus plan, where is the Student Health Center situated?',
    context: 'The Health Center is located directly opposite the Main Library and adjacent to the Sports Pavilion on North Avenue.',
    media: {
      type: 'map',
      caption: 'University Campus Ground Plan (Zone B)',
      alt: 'Map layout showing North Avenue with Library, Health Center and Sports Pavilion',
      svg: '<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-900 border border-slate-800 p-2"><rect x="40" y="30" width="130" height="60" fill="#334155" stroke="#64748b" rx="6"/><text x="60" y="65" fill="#f8fafc" font-size="12" font-weight="bold">Main Library</text><line x1="20" y1="110" x2="380" y2="110" stroke="#475569" stroke-dasharray="6,4" stroke-width="2"/><text x="160" y="105" fill="#94a3b8" font-size="11">North Avenue</text><rect x="40" y="130" width="130" height="60" fill="#065f46" stroke="#10b981" rx="6"/><text x="45" y="165" fill="#34d399" font-size="12" font-weight="bold">Health Center [X]</text><rect x="220" y="130" width="130" height="60" fill="#334155" stroke="#64748b" rx="6"/><text x="235" y="165" fill="#f8fafc" font-size="12">Sports Pavilion</text></svg>'
    },
    options: ['Opposite the Main Library, next to Sports Pavilion', 'Behind the Sports Pavilion, facing East Gate', 'Inside the Main Library complex', 'At the South Ring Road intersection'],
    correctIndex: 0,
    correctAnswer: 'Opposite the Main Library, next to Sports Pavilion',
    explanation: 'The map shows the Health Center directly across North Avenue from the Library and beside the Sports Pavilion.'
  },
  {
    id: 'med_health_05',
    difficulty: 'medium',
    topic: 'health',
    skillCategory: 'vocab',
    type: 'spelling',
    prompt: 'Which spelling error trap is correctly identified?',
    context: 'Regular physical activity plays an _____ role in cardiovascular well-being.',
    options: ['indispensable', 'indispensible', 'indespensible', 'indespensable'],
    correctIndex: 0,
    correctAnswer: 'indispensable',
    explanation: '"Indispensable" ends in "-able" (not "-ible"), a prominent Cambridge spelling demon.'
  },
  {
    id: 'med_econ_06',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'reading',
    type: 'tfng',
    prompt: 'What can be deduced from the trade report?',
    context: 'Tariffs on electric vehicles were reduced by 15% in the third quarter. Consequently, import volumes witnessed a moderate uptick, although domestic producers maintained a 60% market share.\n\nStatement: "Domestic vehicle manufacturers lost their market dominance after the tariff reduction."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctIndex: 1,
    correctAnswer: 'FALSE',
    explanation: 'Domestic manufacturers still retained a 60% market share, which represents a clear majority dominance.'
  },
  {
    id: 'med_science_07',
    difficulty: 'medium',
    topic: 'science',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Select the academic collocation for "scientific investigation":',
    context: 'Researchers must conduct a _____ investigation into climate anomalies before publishing findings.',
    options: ['rigorous and methodical', 'casual and brief', 'noisy and sudden', 'hesitant and rough'],
    correctIndex: 0,
    correctAnswer: 'rigorous and methodical',
    explanation: '"Rigorous and methodical investigation" is a natural Band 6.5 - 7.0 academic collocation.'
  },

  // ==========================================
  // TIER 3: HARD (Band 7.0 - 8.0) - Base XP: 32
  // ==========================================
  {
    id: 'hard_env_01',
    difficulty: 'hard',
    topic: 'environment',
    skillCategory: 'reading',
    type: 'mcq',
    prompt: 'Analyze the implicit claim in the academic excerpt:',
    context: 'Proponents of geoengineering herald solar radiation management as a panacea for anthropogenic warming. However, atmospheric physicists caution that aerosol injection could disrupt monsoonal precipitation patterns across the Global South, creating an irreversible ecological asymmetry.\n\nQuestion: The author implies that solar radiation management:',
    options: [
      'Poses disproportionate risks to agricultural rainfall in developing regions',
      'Is universally endorsed as a safe and reliable solution',
      'Has already been successfully deployed on a planetary scale',
      'Will completely eliminate global greenhouse gas emissions'
    ],
    correctIndex: 0,
    correctAnswer: 'Poses disproportionate risks to agricultural rainfall in developing regions',
    explanation: 'Disrupting "monsoonal precipitation across the Global South" implies severe risks for developing equatorial regions dependent on monsoon rainfall.'
  },
  {
    id: 'hard_tech_02',
    difficulty: 'hard',
    topic: 'technology',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Which word provides the most sophisticated Band 8.0 substitution for "omnipresent / everywhere"?',
    context: 'Algorithmic surveillance has become _____ in contemporary urban environments.',
    options: ['ubiquitous', 'copious', 'precocious', 'auspicious'],
    correctIndex: 0,
    correctAnswer: 'ubiquitous',
    explanation: '"Ubiquitous" means present, appearing, or found everywhere (a core Band 8.0+ lexical item).'
  },
  {
    id: 'hard_chart_03',
    difficulty: 'hard',
    topic: 'economy',
    skillCategory: 'visual_data',
    type: 'chart_reading',
    prompt: 'Analyze the multi-year GDP trend graph and identify the accurate deduction:',
    context: 'Figure 1 illustrates GDP growth rates for Country A and Country B between 2018 and 2024. In 2020, Country A experienced a sharp contraction (-4.2%) followed by a rapid V-shaped recovery to +6.1% in 2021, whereas Country B maintained positive but decelerating growth (+1.1%).',
    media: {
      type: 'chart',
      caption: 'Comparative GDP Annual Fluctuations (2018 - 2024)',
      alt: 'Line graph showing Country A volatile swing vs Country B moderate deceleration',
      svg: '<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-900 border border-slate-800 p-2"><path d="M 40 110 L 100 100 L 160 170 L 220 50 L 280 80 L 340 90 L 390 85" stroke="#f43f5e" stroke-width="3" fill="none"/><path d="M 40 90 L 100 95 L 160 105 L 220 110 L 280 120 L 340 125 L 390 130" stroke="#38bdf8" stroke-width="3" stroke-dasharray="5,5" fill="none"/><text x="45" y="40" fill="#f43f5e" font-size="11">Country A (Volatile V-Shape)</text><text x="240" y="40" fill="#38bdf8" font-size="11">Country B (Stable Decline)</text><line x1="30" y1="110" x2="400" y2="110" stroke="#475569" stroke-width="1"/><text x="15" y="114" fill="#94a3b8" font-size="10">0%</text></svg>'
    },
    options: [
      'Country A displayed higher volatility than Country B throughout the economic shock',
      'Country B suffered negative economic growth during 2020',
      'Both nations recorded identical growth trajectories throughout all years',
      'Country A failed to recover to pre-pandemic growth levels by 2021'
    ],
    correctIndex: 0,
    correctAnswer: 'Country A displayed higher volatility than Country B throughout the economic shock',
    explanation: 'Country A swung dramatically (-4.2% to +6.1%), exhibiting high volatility compared to Country B\'s steady line.'
  },
  {
    id: 'hard_listen_04',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the urban planner\'s lecture and identify the primary catalyst for suburban sprawl:',
    context: 'While developer incentives played a peripheral role, our empirical research substantiates that the expansion of arterial commuter rail lines served as the paramount catalyst for metropolitan decentralization.',
    audioText: 'While developer incentives played a peripheral role, our empirical research substantiates that the expansion of arterial commuter rail lines served as the paramount catalyst for metropolitan decentralization.',
    options: [
      'Expansion of arterial commuter rail networks',
      'Commercial tax subsidies for suburban developers',
      'Shortage of potable water in the inner core',
      'Zoning restrictions against multi-family dwellings'
    ],
    correctIndex: 0,
    correctAnswer: 'Expansion of arterial commuter rail networks',
    explanation: 'The speaker explicitly highlights "arterial commuter rail lines" as the "paramount catalyst", dismissing developer incentives as merely peripheral.'
  },
  {
    id: 'hard_culture_05',
    difficulty: 'hard',
    topic: 'culture',
    skillCategory: 'reading',
    type: 'tfng',
    prompt: 'Determine whether the statement is TRUE, FALSE, or NOT GIVEN:',
    context: 'Linguistic anthropologists emphasize that indigenous languages encapsulate unique taxonomies of medicinal botanical knowledge. When such languages go extinct, centuries of empirical ethnobotanical pharmacology vanish without documentation.\n\nStatement: "Language loss directly impedes pharmaceutical discovery derived from traditional ethnobotany."',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctIndex: 0,
    correctAnswer: 'TRUE',
    explanation: 'The text notes that when languages go extinct, centuries of empirical pharmacological knowledge vanish, logically impeding pharmaceutical discovery.'
  },
  {
    id: 'hard_science_06',
    difficulty: 'hard',
    topic: 'science',
    skillCategory: 'vocab',
    type: 'spelling',
    prompt: 'Select the authentic Cambridge spelling for an essential academic research premise:',
    context: 'The experimental design was predicated on an unverified scientific _____.',
    options: ['hypothesis', 'hypothesus', 'hipothesis', 'hypothisis'],
    correctIndex: 0,
    correctAnswer: 'hypothesis',
    explanation: '"Hypothesis" (plural: hypotheses) is spelled with \'y\' and \'e-s-i-s\'.'
  },
  {
    id: 'hard_edu_07',
    difficulty: 'hard',
    topic: 'education',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Choose the most precise academic verb for "reducing or easing severe disadvantages":',
    context: 'Targeted scholarship endowments aim to _____ educational inequality for disadvantaged cohorts.',
    options: ['mitigate', 'aggravate', 'exacerbate', 'proliferate'],
    correctIndex: 0,
    correctAnswer: 'mitigate',
    explanation: '"Mitigate" means to make less severe or serious (antonym of exacerbate/aggravate).'
  },

  // ==========================================
  // TIER 4: NIGHTMARE / MASTER (Band 8.5 - 9.0) - Base XP: 50
  // ==========================================
  {
    id: 'nm_env_01',
    difficulty: 'nightmare',
    topic: 'environment',
    skillCategory: 'reading',
    type: 'mcq',
    prompt: 'Dissect the nuanced logic in this peer-reviewed environmental treatise:',
    context: 'Far from demonstrating that carbon sequestration technologies are entirely futile, the IPCC syntheses suggest that their efficacy is conditional upon concurrent decarbonization of heavy industrial grids. To assert that sequestering carbon is inherently counterproductive conflates transitional operational limitations with fundamental physical impossibility.\n\nQuestion: Which statement best encapsulates the author\'s thesis?',
    options: [
      'Carbon capture is not fundamentally unviable, but requires systemic energy grid overhaul to succeed',
      'Carbon sequestration has been unequivocally proven as a futile expenditure of capital',
      'Industrial grids can decarbonize completely without any need for atmospheric sequestration',
      'Physical laws render all terrestrial carbon capture mechanisms impossible'
    ],
    correctIndex: 0,
    correctAnswer: 'Carbon capture is not fundamentally unviable, but requires systemic energy grid overhaul to succeed',
    explanation: 'The author uses a double negative ("Far from demonstrating... futile") and clarifies that efficacy depends on grid decarbonization, refuting the claim of physical impossibility.'
  },
  {
    id: 'nm_tech_02',
    difficulty: 'nightmare',
    topic: 'technology',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Select the Band 9.0 erudite term denoting "causing harm or damage in an insidious, gradual manner":',
    context: 'The subtle algorithmic polarization of civil discourse exerts a _____ influence on democratic cohesion.',
    options: ['deleterious', 'salubrious', 'ephemeral', 'magnanimous'],
    correctIndex: 0,
    correctAnswer: 'deleterious',
    explanation: '"Deleterious" is an elite academic adjective meaning causing harm or damage.'
  },
  {
    id: 'nm_map_03',
    difficulty: 'nightmare',
    topic: 'urbanization',
    skillCategory: 'visual_data',
    type: 'map_reading',
    prompt: 'Examine the historical topological harbor map and decipher the navigational hazard:',
    context: 'Navigational Chart (1885): Vessels entering the estuary during ebb tide must circumvent the Submerged Sandbar situated southwest of the Lighthouse reef to avoid grounding.',
    media: {
      type: 'map',
      caption: 'Harbor Estuary Nautical Survey Chart',
      alt: 'Nautical chart showing Lighthouse reef, sandbar, deep channel and fairway',
      svg: '<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-h-48 rounded-lg bg-slate-900 border border-slate-800 p-2"><circle cx="280" cy="70" r="16" fill="#f59e0b"/><text x="260" y="50" fill="#fbbf24" font-size="11" font-weight="bold">Lighthouse Reef</text><ellipse cx="180" cy="140" rx="45" ry="22" fill="#dc2626" fill-opacity="0.4" stroke="#ef4444" stroke-width="2"/><text x="145" y="145" fill="#fca5a5" font-size="11" font-weight="bold">Sandbar [Hazard]</text><path d="M 40 190 Q 200 80 380 180" stroke="#06b6d4" stroke-width="4" stroke-dasharray="8,4" fill="none"/><text x="50" y="210" fill="#67e8f9" font-size="11">Deep Water Fairway</text><polygon points="360,30 370,55 350,55" fill="#e2e8f0"/><text x="355" y="70" fill="#94a3b8" font-size="11">N</text></svg>'
    },
    options: [
      'The submerged sandbar southwest of the Lighthouse reef',
      'The deep water fairway running across the southern estuary',
      'The northern anchorage basin adjacent to the breakwater',
      'The lighthouse beacon situated on the open rocky promontory'
    ],
    correctIndex: 0,
    correctAnswer: 'The submerged sandbar southwest of the Lighthouse reef',
    explanation: 'The chart distinctly indicates the hazardous sandbar positioned southwest of the Lighthouse reef.'
  },
  {
    id: 'nm_listen_04',
    difficulty: 'nightmare',
    topic: 'science',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the astrophysicist and identify the unresolved anomaly in the cosmic microwave data:',
    context: 'While standard inflation anticipates near-perfect spatial isotropy, our interferometric synthesis reveals a statistically recalcitrant multipole asymmetry—the so-called Cold Spot—which eludes reconciliation within the standard Lambda-CDM cosmological paradigm.',
    audioText: 'While standard inflation anticipates near-perfect spatial isotropy, our interferometric synthesis reveals a statistically recalcitrant multipole asymmetry—the so-called Cold Spot—which eludes reconciliation within the standard Lambda-CDM cosmological paradigm.',
    options: [
      'A persistent multipole temperature asymmetry known as the Cold Spot',
      'The complete absence of cosmic microwave background radiation',
      'The verified acceleration of the local interstellar medium',
      'The failure of satellite spectrometers to calibrate terrestrial interference'
    ],
    correctIndex: 0,
    correctAnswer: 'A persistent multipole temperature asymmetry known as the Cold Spot',
    explanation: 'The speaker singles out the "statistically recalcitrant multipole asymmetry—the so-called Cold Spot" as defying reconciliation.'
  },
  {
    id: 'nm_econ_05',
    difficulty: 'nightmare',
    topic: 'economy',
    skillCategory: 'vocab',
    type: 'spelling',
    prompt: 'Identify the exact Cambridge spelling for a mandatory institutional fiscal audit:',
    context: 'The multinational consortium underwent a _____ investigation by antitrust regulators.',
    options: ['forensic', 'forenzik', 'phaurensic', 'forencic'],
    correctIndex: 0,
    correctAnswer: 'forensic',
    explanation: '"Forensic" (pertaining to legal and scientific audit/investigation) is spelled with \'f-o-r-e-n-s-i-c\'.'
  },
  {
    id: 'nm_edu_06',
    difficulty: 'nightmare',
    topic: 'education',
    skillCategory: 'reading',
    type: 'mcq',
    prompt: 'Evaluate the epistemological premise of the text:',
    context: 'Pedagogical constructivism asserts that cognitive schemas cannot be mechanically transplanted from instructor to pupil; rather, knowledge is actively synthesized through discursive conflict and cognitive dissonance.\n\nQuestion: According to the passage, academic mastery is primarily achieved through:',
    options: [
      'Active internal synthesis triggered by cognitive challenge',
      'Passive absorption of lecture monologues delivered by authority',
      'Mechanical memorization of standardized lexicographical definitions',
      'Isolation from dissenting academic perspectives'
    ],
    correctIndex: 0,
    correctAnswer: 'Active internal synthesis triggered by cognitive challenge',
    explanation: 'Constructivism posits knowledge is "actively synthesized through discursive conflict and cognitive dissonance", perfectly matching option 1.'
  },
  {
    id: 'nm_culture_07',
    difficulty: 'nightmare',
    topic: 'culture',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Select the Band 9.0 noun signifying "an official or sacred code of principles":',
    context: 'Adherence to the ethical _____ of research integrity is non-negotiable for doctoral candidates.',
    options: ['tenets', 'tenants', 'tensions', 'tendencies'],
    correctIndex: 0,
    correctAnswer: 'tenets',
    explanation: '"Tenet" (plural: tenets) means a principle or belief, especially one of the main principles of a religion or philosophy (distinct from "tenant" = renter).'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 2 FLAT INSPECTIONS
  // ==========================================
  {
    id: 'easy_lis_flat_01',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen and identify the total number of bathrooms/toilets in Flat 1:',
    context: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet, in addition to the main bathroom and toilet.',
    audioText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet, in addition to the main bathroom and toilet.',
    options: ['1 bathroom & toilet', '2 bathrooms & toilets', '3 bathrooms & toilets', 'None'],
    correctIndex: 1,
    correctAnswer: '2 bathrooms & toilets',
    explanation: 'Bẫy số lượng: Căn hộ 1 có 1 phòng tắm khép kín (en-suite) CỘNG THÊM 1 phòng tắm chính (in addition to the main bathroom), vậy tổng cộng là 2 phòng tắm và 2 toilet.',
    explanationEn: 'Addition arithmetic: Flat 1 features one en-suite bathroom in the master bedroom in addition to the main bathroom, giving a total of two bathrooms and toilets.'
  },
  {
    id: 'med_lis_flat_02',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the property agent: How many bedrooms does Flat 2 CURRENTLY have?',
    context: 'There are two double bedrooms, one bathroom, a newly fitted kitchen, a living room, and a separate dining room which could be turned into a third bedroom.',
    audioText: 'There are two double bedrooms, one bathroom, a newly fitted kitchen, a living room, and a separate dining room which could be turned into a third bedroom.',
    options: ['2 bedrooms', '3 bedrooms', '1 bedroom', '4 bedrooms'],
    correctIndex: 0,
    correctAnswer: '2 bedrooms',
    explanation: 'Bẫy thông tin tiềm năng: Người nói nói phòng ăn có thể sửa thành phòng ngủ thứ 3 ("could be turned into a third bedroom"), nhưng hiện tại chỉ có 2 phòng ngủ đôi ("two double bedrooms").',
    explanationEn: 'Current status vs Potential modification: The speaker states the dining room could be converted in future, but currently Flat 2 has exactly two double bedrooms.'
  },
  {
    id: 'hard_lis_flat_03',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen carefully: Which floor levels does Flat 3 occupy?',
    context: "The flat is on two levels; there's a first floor and a second floor above a separate ground floor flat.",
    audioText: "The flat is on two levels; there's a first floor and a second floor above a separate ground floor flat.",
    options: ['First and second floor only', 'Ground floor and first floor', 'Ground floor only', 'Second floor only'],
    correctIndex: 0,
    correctAnswer: 'First and second floor only',
    explanation: 'Bẫy từ gây nhiễu "ground floor": Căn hộ tầng trệt là của người khác ("above a separate ground floor flat"). Căn số 3 gồm 2 tầng là tầng 1 và tầng 2.',
    explanationEn: 'Distractor trap (\'ground floor\'): The ground floor flat is completely separate; Flat 3 occupies the first and second floors only.'
  },
  {
    id: 'med_vocab_flat_04',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'In UK housing advertisements, an "en-suite" bathroom specifically denotes:',
    context: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet.',
    options: [
      'A private bathroom directly accessible from inside the bedroom',
      'A communal washroom situated at the end of the corridor',
      'An auxiliary outdoor shower adjacent to the garden',
      'A guest toilet located near the front entrance'
    ],
    correctIndex: 0,
    correctAnswer: 'A private bathroom directly accessible from inside the bedroom',
    explanation: '"En-suite" (mượn từ tiếng Pháp) trong bất động sản Anh chỉ phòng tắm hoặc WC nối liền trực tiếp, khép kín bên trong phòng ngủ riêng.',
    explanationEn: 'Property terminology: An \'en-suite\' bathroom is a private bathroom accessed directly from inside a bedroom.'
  },
  {
    id: 'hard_paraphrase_flat_05',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'reading',
    type: 'vocab',
    prompt: 'Select the Band 8.0 academic synonym closest in meaning to "well kept" in property valuation:',
    context: 'The flat needs some modernization, but it is very well kept and would be an excellent family home.',
    options: ['meticulously maintained', 'severely dilapidated', 'sparsely furnished', 'structurally compromised'],
    correctIndex: 0,
    correctAnswer: 'meticulously maintained',
    explanation: '"Well kept" (được bảo dưỡng, gìn giữ cẩn thận) đồng nghĩa với "meticulously maintained". Các từ còn lại: dilapidated (xập xệ), sparsely furnished (ít nội thất), compromised (bị hư hại kết cấu).',
    explanationEn: 'Academic synonym: \'Well kept\' in property appraisal corresponds directly to \'meticulously maintained\'.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 3 PROPERTY ENQUIRY
  // ==========================================
  {
    id: 'easy_lis_addr_01',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the caller spelling the street name: What is the correct street name?',
    context: 'Sorry, did you say Church Mill Road? - No, Church Hill Road. C-H-U-R-C-H H-I-double L.',
    audioText: 'Sorry, did you say Church Mill Road? - No, Church Hill Road. C-H-U-R-C-H H-I-double L.',
    options: ['Church Hill Road', 'Church Mill Road', 'Church Dale Road', 'Church Well Road'],
    correctIndex: 0,
    correctAnswer: 'Church Hill Road',
    explanation: 'Bẫy âm Mill vs Hill: Môi giới nghe nhầm thành "Church Mill Road", nhưng người gọi đính chính là "Church Hill Road" (H-I-double L).',
    explanationEn: 'Acoustic distractor (Mill vs Hill): The estate agent mishears the address, but the caller clarifies \'Church Hill Road\' (H-I-double L).'
  },
  {
    id: 'med_lis_appt_02',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen and identify the finalized viewing appointment time:',
    context: "I'm free tomorrow morning. Is 11:00 okay? - Oh no, I'm sorry, I'm busy then. - How about 1:00 then, or 1:45? - 1:00 would be best for me.",
    audioText: "I'm free tomorrow morning. Is 11:00 okay? - Oh no, I'm sorry, I'm busy then. - How about 1:00 then, or 1:45? - 1:00 would be best for me.",
    options: ['1:00 PM', '11:00 AM', '1:45 PM', 'Tomorrow afternoon at 2:00 PM'],
    correctIndex: 0,
    correctAnswer: '1:00 PM',
    explanation: 'Bẫy đổi lịch hẹn (Schedule shift trap): Khách hỏi 11:00 (môi giới bận), sau đó gợi ý 1:00 hoặc 1:45. Hai người chốt giờ tốt nhất là 1:00 PM.',
    explanationEn: 'Appointment negotiation: The morning slot (11:00 AM) is unavailable; the parties agree that 1:00 PM is the best viewing time.'
  },
  {
    id: 'med_lis_spell_03',
    difficulty: 'medium',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'spelling',
    prompt: "Listen carefully: What is the accurate spelling of the estate agent's surname?",
    context: 'Is that with 2 Ls? No, E-L-I-O-T.',
    audioText: 'Is that with 2 Ls? No, E-L-I-O-T.',
    options: ['Elliot', 'Elliott', 'Eliott', 'Eliot'],
    correctIndex: 0,
    correctAnswer: 'Elliot',
    explanation: 'Bẫy chính tả tên riêng: Người hỏi thắc mắc có phải "two Ls" không, nhưng ông ấy trả lời "No" và đánh vần Elliot (E-L-I-O-T).',
    explanationEn: "Spelling clarification: The caller clarifies whether the surname contains two Ls, and the agent responds 'No', spelling E-L-I-O-T."
  },
  {
    id: 'hard_lis_appliances_04',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Will the prospective buyer need to purchase a cooker or dishwasher for this property?',
    context: "What about the kitchen? It's fully fitted, so it includes a cooker and a dishwasher and all the other things you'd expect in a kitchen.",
    audioText: "What about the kitchen? It's fully fitted, so it includes a cooker and a dishwasher and all the other things you'd expect in a kitchen.",
    options: [
      'No, both appliances are already installed in the fully fitted kitchen',
      'Yes, she must purchase both appliances prior to moving in',
      'Only the cooker is included, the dishwasher must be purchased',
      'Only the dishwasher is included, the cooker is missing'
    ],
    correctIndex: 0,
    correctAnswer: 'No, both appliances are already installed in the fully fitted kitchen',
    explanation: 'Nhà bếp lắp sẵn đầy đủ (fully fitted) bao gồm cả bếp nấu và máy rửa bát, người mua không cần phải tự mua ("Not having to buy a cooker and dishwasher").',
    explanationEn: 'Fitted kitchen inclusions: Because the kitchen is fully fitted with a cooker and dishwasher, the buyer does not need to purchase either appliance.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 4 NUMBERS & CODES
  // ==========================================
  {
    id: 'easy_lis_b_vs_d_01',
    difficulty: 'easy',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'spelling',
    prompt: 'Listen to the membership code clarification: What is the correct membership ID?',
    context: "What's your membership number? It's B-1074. Sorry, did you say D-1074? No, B-1074.",
    audioText: "What's your membership number? It's B-1074. Sorry, did you say D-1074? No, B-1074.",
    options: ['B1074', 'D1074', 'P1074', 'B1047'],
    correctIndex: 0,
    correctAnswer: 'B1074',
    explanation: 'Bẫy âm chữ cái tương đồng B vs D: Nhân viên hỏi lại D-1074, khách hàng khẳng định là B-1074.',
    explanationEn: "Phonetic similarity trap: The assistant asks if the code begins with 'D', but the caller clarifies that it begins with 'B-1074'."
  },
  {
    id: 'easy_lis_price_02',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the shop cashier: What is the accurate total amount due?',
    context: "How much is that altogether? That's 53 pounds 72 please. Sorry, did you say 43 pounds 72? No, 53 pounds 72.",
    audioText: "How much is that altogether? That's 53 pounds 72 please. Sorry, did you say 43 pounds 72? No, 53 pounds 72.",
    options: ['£53.72', '£43.72', '£35.72', '£53.27'],
    correctIndex: 0,
    correctAnswer: '£53.72',
    explanation: 'Bẫy phát âm số đếm 43 vs 53: Giá tiền chuẩn là £53.72.',
    explanationEn: 'Number pronunciation distractor (43 vs 53): The cashier explicitly confirms the total amount is £53.72.'
  },
  {
    id: 'med_lis_phone_03',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the phone message: What is the real phone number for Mr. Hemmings to call back?',
    context: 'Did you say 01857 629 730? - No, it\'s 01897 625 730.',
    audioText: 'Did you say 01857 629 730? - No, it\'s 01897 625 730.',
    options: ['01897 625 730', '01857 629 730', '01897 629 730', '01857 625 730'],
    correctIndex: 0,
    correctAnswer: '01897 625 730',
    explanation: 'Bẫy số kép: 897 (thay vì 857) và 625 (thay vì 629).',
    explanationEn: 'Double digit reversal trap: The speaker corrects both middle numbers from 857/629 to 01897 625 730.'
  },
  {
    id: 'hard_lis_dim_04',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the width of the football field mentioned in the conversation?',
    context: 'It\'s 110 meters by 55 meters. - 110 meters long and 55 meters wide?',
    audioText: 'It\'s 110 meters by 55 meters. - 110 meters long and 55 meters wide?',
    options: ['55 meters', '110 meters', '165 meters', '50 meters'],
    correctIndex: 0,
    correctAnswer: '55 meters',
    explanation: 'Bẫy kích thước Dài vs Rộng (Length vs Width): 110m là chiều dài, 55m là chiều rộng.',
    explanationEn: 'Length vs Width distractor: 110 meters refers to length, while 55 meters is specifically the width.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 5 HOUSE TOUR & DIMENSIONS
  // ==========================================
  {
    id: 'easy_lis_decision_offer',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What does Caroline explicitly decide to do at the end of the house viewing?',
    context: 'So, would you like to put in an offer? - Yes, please! This is the best property I\'ve seen so far.',
    audioText: 'So, would you like to put in an offer? - Yes, please! This is the best property I\'ve seen so far.',
    options: ['Put in an offer to buy the house', 'View the property a second time tomorrow', 'Check other houses in the same neighborhood', 'Decline the purchase due to price'],
    correctIndex: 0,
    correctAnswer: 'Put in an offer to buy the house',
    explanation: 'Bà Caroline đồng ý trả giá mua ngay ("Yes, please! This is the best property I\'ve seen so far").',
    explanationEn: "Direct buyer decision: Caroline confirms her choice immediately with 'Yes, please! This is the best property I have seen so far.'"
  },
  {
    id: 'med_lis_asking_price_trap',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the actual current asking price stated by the estate agent?',
    context: "If I remember rightly, it's 340,000 pounds? Actually, it's 350,000 pounds at the moment, but we can discuss that later if you like.",
    audioText: "If I remember rightly, it's 340,000 pounds? Actually, it's 350,000 pounds at the moment, but we can discuss that later if you like.",
    options: ['£350,000', '£340,000', '£345,000', '£360,000'],
    correctIndex: 0,
    correctAnswer: '£350,000',
    explanation: 'Bẫy giá nhớ nhầm: Khách nhớ là £340,000 nhưng môi giới đính chính giá hiện tại là £350,000.',
    explanationEn: 'Misremembered price distractor: The buyer recalls £340,000, but the estate agent clarifies the current asking price is £350,000.'
  },
  {
    id: 'med_lis_bath_fixture_trap',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Does the en-suite bathroom in the master bedroom contain a full-sized bathtub?',
    context: '...though it only has a shower unit and not a big bath like the main bathroom.',
    audioText: '...though it only has a shower unit and not a big bath like the main bathroom.',
    options: [
      'No, it only has a shower unit',
      'Yes, it features both a jacuzzi and bathtub',
      'Yes, identical to the main family bathroom',
      'No, it only contains a washbasin with no shower'
    ],
    correctIndex: 0,
    correctAnswer: 'No, it only has a shower unit',
    explanation: 'Phòng tắm khép kín (en-suite) chỉ có buồng tắm vòi sen (shower unit), không có bồn tắm lớn.',
    explanationEn: 'En-suite specification: The agent confirms the en-suite only has a shower unit, unlike the main family bathroom with a full bath.'
  },
  {
    id: 'hard_lis_dim_correction_trap',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the corrected length of the main master bedroom?',
    context: "Here's the main bedroom. It's 4.91 meters by 3.95 meters. Perfect for a large double bed. Oh sorry that's 4.9 metres long and 3.95 metres wide.",
    audioText: "Here's the main bedroom. It's 4.91 meters by 3.95 meters. Perfect for a large double bed. Oh sorry that's 4.9 metres long and 3.95 metres wide.",
    options: ['4.9 meters', '4.91 meters', '3.95 meters', '4.2 meters'],
    correctIndex: 0,
    correctAnswer: '4.9 meters',
    explanation: 'Bẫy số thập phân tự đính chính: Môi giới đọc nhầm 4.91m rồi xin lỗi sửa lại thành 4.9m.',
    explanationEn: 'Self-correction distractor: The agent first says 4.91 meters, then immediately corrects to 4.9 meters long.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 6 PURCHASE OFFER & FINANCE
  // ==========================================
  {
    id: 'easy_lis_postcode_ke7',
    difficulty: 'easy',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'spelling',
    prompt: 'Listen to the caller stating her postcode: What is the correct alphanumeric postcode?',
    context: 'The postcode is KE7 8UD.',
    audioText: 'The postcode is KE7 8UD.',
    options: ['KE7 8UD', 'KA7 8UD', 'KE7 8UT', 'KE8 7UD'],
    correctIndex: 0,
    correctAnswer: 'KE7 8UD',
    explanation: 'Mã bưu chính chuẩn là KE7 8UD.',
    explanationEn: 'Alphanumeric postcode transcription: The caller clearly dictates KE7 8UD.'
  },
  {
    id: 'med_lis_current_stay',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is the buyer ready to move in immediately without waiting to sell a home?',
    context: 'No, we sold it a couple of months ago and we\'re staying with relatives...',
    audioText: 'No, we sold it a couple of months ago and we\'re staying with relatives...',
    options: [
      'They already sold their previous house and are currently staying with relatives',
      'They are renting a flat on Church Hill Road',
      'They own multiple homes in the riverside area',
      'Their bank purchased their previous property'
    ],
    correctIndex: 0,
    correctAnswer: 'They already sold their previous house and are currently staying with relatives',
    explanation: 'Gia đình đã bán nhà cách đây vài tháng và hiện đang ở nhờ người thân nên không phải chờ bán nhà cũ.',
    explanationEn: 'Relocation readiness: The family already sold their house months ago and are currently staying with relatives, allowing an immediate move.'
  },
  {
    id: 'med_lis_main_worry',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is Caroline\'s MAIN motivation for wanting the sale completed before the end of summer?',
    context: 'It\'s not easy living a long time with relatives, and my husband has a long journey to get to work. But those aren\'t the things I\'m really worried about. If we can move in before the end of the summer, it\'ll be much easier for the children to go to their new school.',
    audioText: 'It\'s not easy living a long time with relatives, and my husband has a long journey to get to work. But those aren\'t the things I\'m really worried about. If we can move in before the end of the summer, it\'ll be much easier for the children to go to their new school.',
    options: [
      'Helping her children settle smoothly into their new school',
      'Avoiding the daily commute to her husband\'s workplace',
      'Ending the uncomfortable stay with her relatives',
      'Preventing interest rate increases on the mortgage'
    ],
    correctIndex: 0,
    correctAnswer: 'Helping her children settle smoothly into their new school',
    explanation: 'Bẫy ưu tiên: Bà nói việc đi làm và ở nhờ không phải là điều bà lo nhất ("those aren\'t the things I\'m really worried about"), lý do cốt lõi là việc nhập học trường mới của các con.',
    explanationEn: 'Core priority trap: Caroline notes that while commuting and living with relatives are inconvenient, her primary worry is helping her children settle into their new school.'
  },
  {
    id: 'hard_lis_deposit_cash',
    difficulty: 'hard',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What percentage of cash deposit does Caroline\'s family currently hold in their bank account?',
    context: 'We also have a 15% deposit in our bank account, about £52,000...',
    audioText: 'We also have a 15% deposit in our bank account, about £52,000...',
    options: ['15%', '10%', '20%', '50%'],
    correctIndex: 0,
    correctAnswer: '15%',
    explanation: 'Tiền mặt đặt cọc có sẵn là 15% (tương đương khoảng 52,000 bảng Anh).',
    explanationEn: 'Financial reserve figure: The buyer holds a 15% cash deposit in their bank account (around £52,000).'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 7 EN-SUITE & ROUTINES
  // ==========================================
  {
    id: 'easy_lis_ensuite_routine',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to the buyer, when will the extra en-suite bathroom be most beneficial?',
    context: 'That would come in very useful when we all get up to get ready for school or work.',
    audioText: 'That would come in very useful when we all get up to get ready for school or work.',
    options: [
      'In the morning when family members get ready for school or work',
      'During evening weekends when hosting guests',
      'When doing laundry and washing clothes',
      'Only during summer holidays'
    ],
    correctIndex: 0,
    correctAnswer: 'In the morning when family members get ready for school or work',
    explanation: 'Phòng tắm phụ giúp giải tỏa ùn tắc buổi sáng khi cả nhà cùng thức dậy chuẩn bị đi làm hoặc đi học.',
    explanationEn: 'Daily morning routine: The extra en-suite bathroom is most useful in the morning when the family gets ready for school and work.'
  },
  {
    id: 'med_lis_idiom_useful',
    difficulty: 'medium',
    topic: 'culture',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'In conversational British English, what does the idiom "come in very useful" mean?',
    context: 'That would come in very useful when we all get up to get ready for school or work.',
    options: [
      'Prove exceptionally handy, convenient, or practical',
      'Be quite costly and difficult to maintain',
      'Require additional building permits',
      'Take a long time to construct'
    ],
    correctIndex: 0,
    correctAnswer: 'Prove exceptionally handy, convenient, or practical',
    explanation: '"Come in useful" (hoặc "come in handy") là thành ngữ chỉ một vật/tiện nghi tỏ ra rất hữu dụng, tiện lợi trong một tình huống cụ thể.',
    explanationEn: "Idiomatic usage: 'Come in useful' (or 'come in handy') means to prove especially practical, convenient, or helpful in a particular situation."
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 8 STUDENT HOUSING & SHOPPING
  // ==========================================
  {
    id: 'easy_lis_commute_t8',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How long does it take the student to commute from her shared house to school?',
    context: 'Our house is in the city centre, about 5 minutes\' walk from the train station... and our school is about a 20-minute bus ride from my house.',
    audioText: 'Our house is in the city centre, about 5 minutes\' walk from the train station... and our school is about a 20-minute bus ride from my house.',
    options: [
      'About a 20-minute bus ride',
      'A 5-minute walk',
      'A 40-minute train journey',
      'Under 10 minutes on foot'
    ],
    correctIndex: 0,
    correctAnswer: 'About a 20-minute bus ride',
    explanation: 'Bẫy số liệu và phương tiện: 5 phút là khoảng cách đi bộ ra ga tàu (train station), còn đến trường là khoảng 20 phút đi xe buýt (20-minute bus ride).',
    explanationEn: 'Distractor trap: 5 minutes refers to walking to the train station, whereas school is a 20-minute bus journey.'
  },
  {
    id: 'med_lis_nationality_t8',
    difficulty: 'medium',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the nationality of the student being interviewed?',
    context: 'One of them is from China and the other is from India. I\'m from Romania, so I think we live in a pretty international house.',
    audioText: 'One of them is from China and the other is from India. I\'m from Romania, so I think we live in a pretty international house.',
    options: ['Romanian', 'Chinese', 'Indian', 'British'],
    correctIndex: 0,
    correctAnswer: 'Romanian',
    explanation: 'Bẫy quốc tịch: Người nói nhắc tới bạn cùng nhà từ Trung Quốc (China) và Ấn Độ (India), nhưng bản thân người nói là từ Romania (I\'m from Romania).',
    explanationEn: 'Nationality identification: The student mentions housemates from China and India, but she explicitly clarifies "I\'m from Romania".'
  },
  {
    id: 'med_lis_mall_feature_t8',
    difficulty: 'medium',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Besides retail shops, restaurants, and a cinema, what leisure facility is available at City Gate?',
    context: 'There is also a cinema and ice rink, so people go there not just to shop, but to hang out with their friends as well.',
    audioText: 'There is also a cinema and ice rink, so people go there not just to shop, but to hang out with their friends as well.',
    options: ['An ice rink', 'A bowling alley', 'An indoor water park', 'A tennis court'],
    correctIndex: 0,
    correctAnswer: 'An ice rink',
    explanation: 'Khu mua sắm City Gate có rạp chiếu phim và sân trượt băng (ice rink) để giới trẻ tụ tập bạn bè.',
    explanationEn: 'Leisure amenity: City Gate features an ice rink in addition to its cinema, shops, and dining establishments.'
  },
  {
    id: 'hard_lis_market_reason_t8',
    difficulty: 'hard',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why does the student personally avoid shopping at the traditional local market?',
    context: 'the local market is more for older people who just want to go and buy some cheaper food or clothes, and the styles and brands on sale at the market are a bit old-fashioned for me personally.',
    audioText: 'the local market is more for older people who just want to go and buy some cheaper food or clothes, and the styles and brands on sale at the market are a bit old-fashioned for me personally.',
    options: [
      'The fashion styles and brands sold there feel old-fashioned to her',
      'Fresh groceries and clothes are substantially more expensive',
      'The market is situated too far from the train station',
      'Public transport to the market is suspended at weekends'
    ],
    correctIndex: 0,
    correctAnswer: 'The fashion styles and brands sold there feel old-fashioned to her',
    explanation: 'Bẫy lý do: Chợ địa phương tuy bán đồ ăn rẻ hơn nhưng phù hợp với người lớn tuổi hơn, còn với người nói thì mẫu mã và thương hiệu ở đó bị xem là lỗi thời (a bit old-fashioned).',
    explanationEn: 'Attitude and evaluation: Despite cheaper prices, the student finds market brands and styles too old-fashioned for her personal taste.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 9 HOMETOWN & URBAN LEXIS
  // ==========================================
  {
    id: 'easy_lis_inhabitants_t9',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to the speaker, why are the inhabitants of their hometown characterized as easygoing?',
    context: 'The inhabitants of my hometown are pretty easygoing as we live in a place with good weather.',
    audioText: 'The inhabitants of my hometown are pretty easygoing as we live in a place with good weather.',
    options: [
      'Because they reside in a region blessed with good weather',
      'Because living costs and taxes are remarkably low',
      'Because working hours are flexible and stress-free',
      'Because outdoor markets offer free organic produce'
    ],
    correctIndex: 0,
    correctAnswer: 'Because they reside in a region blessed with good weather',
    explanation: 'Lý do cư dân sống cởi mở, dễ chịu (easygoing) là do sống ở vùng có thời tiết thuận lợi, dễ chịu (good weather).',
    explanationEn: 'Causal link: Inhabitants are easygoing specifically because they live in an area with pleasant, good weather.'
  },
  {
    id: 'med_lis_architecture_t9',
    difficulty: 'medium',
    topic: 'culture',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Which advanced adjective does the speaker use to express great fascination with their hometown\'s architecture?',
    context: 'The architecture in my hometown is fascinating.',
    audioText: 'The architecture in my hometown is fascinating.',
    options: ['Fascinating', 'Ordinary', 'Conventional', 'Monotonous'],
    correctIndex: 0,
    correctAnswer: 'Fascinating',
    explanation: '"Fascinating" có nghĩa là cực kỳ lôi cuốn, quyến rũ, hấp dẫn trí tò mò.',
    explanationEn: "Lexical choice: 'Fascinating' signifies extremely captivating, intriguing, or delightful to observe."
  },
  {
    id: 'med_lis_residential_dull_t9',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why are residential areas considered the most boring parts of the speaker\'s hometown?',
    context: 'The most boring places in my hometown are the residential areas as there are no shops there.',
    audioText: 'The most boring places in my hometown are the residential areas as there are no shops there.',
    options: [
      'Because there are no retail shops or commercial outlets there',
      'Because public buses stop running after midday',
      'Because the architecture of the houses is repetitive',
      'Because streets are narrow and difficult to navigate'
    ],
    correctIndex: 0,
    correctAnswer: 'Because there are no retail shops or commercial outlets there',
    explanation: 'Khu dân cư (residential areas) bị coi là chán nhất bởi vì hoàn toàn không có cửa hàng mua bán nào (no shops there).',
    explanationEn: 'Lack of amenities: Residential zones are deemed dull precisely because they lack shops and commercial venues.'
  },
  {
    id: 'hard_lis_traffic_env_t9',
    difficulty: 'hard',
    topic: 'environment',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What primary factor does the speaker hold responsible for environmental degradation in their hometown?',
    context: 'I\'d say that due to the traffic in my hometown, the environment there is getting worse.',
    audioText: 'I\'d say that due to the traffic in my hometown, the environment there is getting worse.',
    options: [
      'Heavy vehicular traffic congestion',
      'Industrial chemical pollutants from local factories',
      'Uncollected household refuse in residential quarters',
      'Excessive energy consumption by multi-storey malls'
    ],
    correctIndex: 0,
    correctAnswer: 'Heavy vehicular traffic congestion',
    explanation: 'Chất lượng môi trường giảm sút được người nói quy trực tiếp cho lưu lượng và ách tắc giao thông (due to the traffic).',
    explanationEn: 'Environmental impact: The speaker directly attributes the deteriorating local environment to traffic.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 10 WORD STRESS & PRONUNCIATION
  // ==========================================
  {
    id: 'easy_lis_stress_accommodation_t10',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the word "accommodation". On which syllable does the PRIMARY stress fall?',
    context: '2. Accommodation',
    audioText: 'Accommodation',
    options: [
      'The fourth syllable (ac-com-mo-DA-tion)',
      'The second syllable (ac-COM-mo-da-tion)',
      'The first syllable (AC-com-mo-da-tion)',
      'The third syllable (ac-com-MO-da-tion)'
    ],
    correctIndex: 0,
    correctAnswer: 'The fourth syllable (ac-com-mo-DA-tion)',
    explanation: 'Từ "accommodation" (/əˌkɒm.əˈdeɪ.ʃən/) có trọng âm chính rơi vào âm tiết thứ tư (DA), ngay trước hậu tố -tion.',
    explanationEn: "Syllable stress rule: In 'accommodation' (/əˌkɒm.əˈdeɪ.ʃən/), the primary stress falls on the fourth syllable immediately preceding the suffix -tion."
  },
  {
    id: 'med_lis_silent_env_t10',
    difficulty: 'medium',
    topic: 'environment',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In the spoken word "environment", which consonant letter is often silent or elided before "m"?',
    context: '12. Environment',
    audioText: 'Environment',
    options: [
      'The letter "n" (en-vi-ro[n]-ment)',
      'The letter "v" (en-[v]i-ron-ment)',
      'The letter "r" (en-vi-[r]on-ment)',
      'The letter "t" (en-vi-ron-men[t])'
    ],
    correctIndex: 0,
    correctAnswer: 'The letter "n" (en-vi-ro[n]-ment)',
    explanation: 'Bẫy chính tả & phát âm: Người bản xứ thường phát âm /ɪnˈvaɪ.rən.mənt/ hoặc nuốt nhẹ chữ "n" trước "m", khiến nhiều thí sinh viết sai chính tả thiếu chữ "n".',
    explanationEn: "Acoustic elision: The letter 'n' before 'ment' is frequently suppressed or softened in native speech, making it a classic IELTS spelling trap."
  },
  {
    id: 'med_lis_stress_geography_t10',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'vocab',
    type: 'vocab',
    prompt: 'Listen to the word "geography". Where does the primary stress fall?',
    context: '13. Geography',
    audioText: 'Geography',
    options: [
      'The second syllable (ge-OG-ra-phy)',
      'The first syllable (GE-o-gra-phy)',
      'The third syllable (ge-o-GRA-phy)',
      'The fourth syllable (ge-o-gra-PHY)'
    ],
    correctIndex: 0,
    correctAnswer: 'The second syllable (ge-OG-ra-phy)',
    explanation: 'Các từ kết thúc bằng hậu tố "-graphy" luôn có trọng âm rơi vào âm tiết đứng ngay trước nó: ge-OG-ra-phy (/dʒiˈɒɡ.rə.fi/).',
    explanationEn: "Stress pattern: Words terminating in '-graphy' consistently place primary stress on the antepenultimate syllable (ge-OG-ra-phy)."
  },
  {
    id: 'hard_lis_spell_scenery_t10',
    difficulty: 'hard',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to Item 16. What is the correct orthographic spelling of this landscape noun?',
    context: '16. Scenery',
    audioText: 'Scenery',
    options: ['Scenery', 'Seanery', 'Senery', 'Scenary'],
    correctIndex: 0,
    correctAnswer: 'Scenery',
    explanation: 'Từ "scenery" (/ˈsiː.nər.i/) có chữ "c" câm đứng sau "s", và kết thúc bằng đuôi "-ery", không phải "-ary" hay "sea-".',
    explanationEn: "Orthographic trap: 'Scenery' features a silent 'c' after 's' and terminates in '-ery'."
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 11 MAP & ROAD DIRECTIONS
  // ==========================================
  {
    id: 'easy_lis_lane_t11',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Directive 1, which lane must motorists maintain to cross over the motorway?',
    context: '1. Stay in the middle lane so that you can go over the motorway.',
    audioText: 'Stay in the middle lane so that you can go over the motorway.',
    options: [
      'The middle lane',
      'The left-hand slip road',
      'The right-hand fast lane',
      'The emergency hard shoulder'
    ],
    correctIndex: 0,
    correctAnswer: 'The middle lane',
    explanation: 'Chỉ dẫn nêu rõ phải giữ xe ở làn giữa ("Stay in the middle lane") để đi qua đường cao tốc.',
    explanationEn: 'Direction clarity: The speaker directly specifies staying in the middle lane to cross over the motorway.'
  },
  {
    id: 'med_lis_roundabout_t11',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Directive 3, which exit must the driver take upon entering the roundabout?',
    context: '3. Go round and take the third exit on the right.',
    audioText: 'Go round and take the third exit on the right.',
    options: [
      'The third exit on the right',
      'The first exit on the left',
      'The second exit straight ahead',
      'The final exit before the bridge'
    ],
    correctIndex: 0,
    correctAnswer: 'The third exit on the right',
    explanation: 'Khi đi vào bùng binh ("Go round"), lái xe phải rẽ vào lối ra thứ 3 ở bên phải ("third exit on the right").',
    explanationEn: 'Roundabout navigation: The instruction requires going round and taking the third exit on the right.'
  },
  {
    id: 'med_lis_bend_t11',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is the driver advised to decelerate in Directive 4?',
    context: '4. Slow down here because it goes to the left quite sharply.',
    audioText: 'Slow down here because it goes to the left quite sharply.',
    options: [
      'Because the road bends sharply to the left',
      'Because an automated speed camera is operating',
      'Because the road surface is under construction',
      'Because school children are crossing ahead'
    ],
    correctIndex: 0,
    correctAnswer: 'Because the road bends sharply to the left',
    explanation: 'Yêu cầu giảm tốc ("Slow down") do khúc cua ngoặt gấp về bên trái ("goes to the left quite sharply").',
    explanationEn: 'Hazard warning: Deceleration is required because the road turns sharply to the left.'
  },
  {
    id: 'hard_lis_junction_t11',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What driving manoeuvre is prescribed upon reaching the end of the road in Directive 6?',
    context: '6. When you get to the end of this road, take the left turn.',
    audioText: 'When you get to the end of this road, take the left turn.',
    options: [
      'Take the left turn',
      'Make a sharp right turn',
      'Perform a U-turn at the lights',
      'Drive straight into the car park'
    ],
    correctIndex: 0,
    correctAnswer: 'Take the left turn',
    explanation: 'Khi đến cuối đường (ngã ba), chỉ dẫn yêu cầu rẽ trái ("take the left turn").',
    explanationEn: 'T-junction directive: Reaching the end of the road mandates taking the left turn.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 12 SPORTS COMPETITION MAP & RELOCATION
  // ==========================================
  {
    id: 'easy_lis_flood_damage_t12',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why was the inter-college sports competition relocated from South Henton Sports Centre?',
    context: 'We can\'t have the competition at the centre because of the flooding last week after all the rain. It damaged a lot of our equipment, and also the floors in some of the rooms.',
    audioText: 'We can\'t have the competition at the centre because of the flooding last week after all the rain. It damaged a lot of our equipment, and also the floors in some of the rooms.',
    options: [
      'Flooding following heavy rain damaged equipment and room floors',
      'The venue was double-booked for an international athletic meet',
      'The building is undergoing scheduled electrical renovations',
      'Local transport strikes prevented access to South Henton'
    ],
    correctIndex: 0,
    correctAnswer: 'Flooding following heavy rain damaged equipment and room floors',
    explanation: 'Lý do đổi địa điểm là do mưa lớn gây ngập lụt (flooding), làm hỏng hóc nhiều thiết bị và sàn nhà tại một số phòng.',
    explanationEn: 'Event disruption: Heavy flooding damaged sports gear and flooring, necessitating an urgent venue relocation.'
  },
  {
    id: 'med_lis_meeting_time_t12',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'When are student preparation volunteers instructed to assemble at North Henton Sports Centre?',
    context: 'You\'ll need to meet the others there next Tuesday at about 9:00 to get the centre ready.',
    audioText: 'You\'ll need to meet the others there next Tuesday at about 9:00 to get the centre ready.',
    options: [
      'Next Tuesday at approximately 9:00 am',
      'Next Monday afternoon at 2:00 pm',
      'Next Wednesday morning at 8:30 am',
      'This Friday evening at 6:00 pm'
    ],
    correctIndex: 0,
    correctAnswer: 'Next Tuesday at approximately 9:00 am',
    explanation: 'Thời gian tập trung để chuẩn bị trung tâm là vào thứ Ba tuần tới lúc 9:00 sáng ("next Tuesday at about 9:00").',
    explanationEn: 'Schedule timing: Preparation helpers must meet next Tuesday at approximately 9:00 am.'
  },
  {
    id: 'med_lis_bramley_turn_t12',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'After descending from the motorway flyover, what turn should motorists take at the Bramley Road junction?',
    context: 'After the flyover, you come to the junction with Bramley Road. This is where you go left, because that takes you round the town to the sports centre.',
    audioText: 'After the flyover, you come to the junction with Bramley Road. This is where you go left, because that takes you round the town to the sports centre.',
    options: [
      'Turn left to navigate around the town perimeter',
      'Turn right to enter the busy shopping district',
      'Go straight ahead onto the northbound dual carriageway',
      'Make a U-turn under the bridge'
    ],
    correctIndex: 0,
    correctAnswer: 'Turn left to navigate around the town perimeter',
    explanation: 'Tại nút giao với đường Bramley, lái xe phải rẽ trái ("go left") để đi vòng quanh thị trấn đến khu thể thao.',
    explanationEn: 'Route navigation: Drivers turn left at Bramley Road junction to skirt around town.'
  },
  {
    id: 'hard_lis_landmark_final_t12',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Which prominent landmark indicates that North Henton Sports Centre is immediately ahead on Green Lane?',
    context: 'The sports centre is on Green Lane, which is just past the Woodland Hotel on the right. You can\'t miss it.',
    audioText: 'The sports centre is on Green Lane, which is just past the Woodland Hotel on the right. You can\'t miss it.',
    options: [
      'The Woodland Hotel on the right-hand side',
      'The central railway station on the left',
      'A large Texaco petrol station',
      'The municipal town hall and clock tower'
    ],
    correctIndex: 0,
    correctAnswer: 'The Woodland Hotel on the right-hand side',
    explanation: 'Dấu mốc định vị cuối cùng là đi qua Khách sạn Woodland (Woodland Hotel) ở bên tay phải.',
    explanationEn: 'Final landmark: North Henton Sports Centre is located on Green Lane directly past the Woodland Hotel on the right.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 13 SPORTS & PHYSICAL REQUIREMENTS
  // ==========================================
  {
    id: 'easy_lis_shuttlecock_t13',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What distinguishes the projectile used in the first sport (badminton) from that of tennis?',
    context: 'The playing area is smaller and people hit a shuttlecock, a light object with feathers, instead of a ball.',
    audioText: 'The playing area is smaller and people hit a shuttlecock, a light object with feathers, instead of a ball.',
    options: [
      'A light feathered shuttlecock is used rather than a ball',
      'A heavier rubber ball is used with greater racket tension',
      'A hollow plastic sphere with aerodynamic holes is hit',
      'A specialized felt disc designed for indoor wooden courts'
    ],
    correctIndex: 0,
    correctAnswer: 'A light feathered shuttlecock is used rather than a ball',
    explanation: 'Người chơi đánh quả cầu lông (shuttlecock) – một vật thể nhẹ có gắn lông vũ – thay vì quả bóng thông thường.',
    explanationEn: 'Equipment identification: Badminton utilizes a feathered shuttlecock rather than a conventional ball.'
  },
  {
    id: 'med_lis_gymnastics_t13',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to description 2, what physical combination is mandatory for the athlete?',
    context: 'You have to be very strong in your arms and legs, but also light and flexible to do this sport, because you use your whole body all the time.',
    audioText: 'You have to be very strong in your arms and legs, but also light and flexible to do this sport, because you use your whole body all the time.',
    options: [
      'Extreme limb strength combined with lightness and flexibility',
      'Tall stature and maximum muscle mass',
      'Heavy bodyweight to maintain equilibrium on apparatus',
      'Fast sprinting ability over long outdoor distances'
    ],
    correctIndex: 0,
    correctAnswer: 'Extreme limb strength combined with lightness and flexibility',
    explanation: 'Vận động viên cần kết hợp cả cơ bắp tay chân rất khỏe ("very strong in your arms and legs") lẫn thân hình nhẹ và dẻo dai ("light and flexible").',
    explanationEn: 'Physical requirements: Gymnastics demands simultaneous limb power, light weight, and body flexibility.'
  },
  {
    id: 'med_lis_tabletennis_t13',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why must participants in the third sport (table tennis) move their arms with high speed and precision?',
    context: 'You need to think very fast, and move your arms quickly and accurately, because the playing area is so small, and the ball is so light.',
    audioText: 'You need to think very fast, and move your arms quickly and accurately, because the playing area is so small, and the ball is so light.',
    options: [
      'Because the playing area is extremely compact and the ball is very light',
      'Because opponents stand far apart across a windy court',
      'Because the racket is unusually heavy and unwieldy',
      'Because players are required to sprint across the hall constantly'
    ],
    correctIndex: 0,
    correctAnswer: 'Because the playing area is extremely compact and the ball is very light',
    explanation: 'Lý do cánh tay phải phản xạ vừa nhanh vừa chuẩn xác là vì diện tích bàn đấu rất nhỏ và quả bóng rất nhẹ.',
    explanationEn: 'Reflex demands: The miniature playing surface and lightweight ball mandate rapid, accurate arm movement.'
  },
  {
    id: 'hard_lis_weightlifting_t13',
    difficulty: 'hard',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What key mobility characteristic sets the fourth sport (weightlifting) apart from dynamic ball games?',
    context: 'You also need to have very strong legs to support yourself, but you don\'t move around to do it.',
    audioText: 'You also need to have very strong legs to support yourself, but you don\'t move around to do it.',
    options: [
      'The athlete remains stationary and does not move around the floor',
      'The athlete must continuously change directions at high velocity',
      'The athlete relies solely on arm power without leg involvement',
      'The athlete must leap vertically into the air repeatedly'
    ],
    correctIndex: 0,
    correctAnswer: 'The athlete remains stationary and does not move around the floor',
    explanation: 'Điểm đặc trưng là người tập giữ vị trí cố định, không di chuyển vòng quanh ("you don\'t move around to do it"), dùng chân làm bệ đỡ cơ thể.',
    explanationEn: 'Mobility constraint: Unlike mobile sports, weightlifting is performed statically without moving around.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 14 SPORTS ROOM SCHEDULING & LOGISTICS
  // ==========================================
  {
    id: 'easy_lis_storeroom_key_t14',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'From which department or counter can volunteers collect the storeroom key?',
    context: 'There\'s a big storeroom with all the equipment in it. You should be able to get the key from reception. They\'ll be there waiting for us.',
    audioText: 'There\'s a big storeroom with all the equipment in it. You should be able to get the key from reception. They\'ll be there waiting for us.',
    options: [
      'The reception desk',
      'The security control booth at the gate',
      'The sports coordinator\'s private office',
      'The college equipment supervisor'
    ],
    correctIndex: 0,
    correctAnswer: 'The reception desk',
    explanation: 'Tình nguyện viên lấy chìa khóa nhà kho từ quầy lễ tân ("get the key from reception").',
    explanationEn: 'Logistics: The storeroom key is retrieved from reception where staff are expecting them.'
  },
  {
    id: 'med_lis_dean_morning_t14',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How many badminton courts must be prepared in the Dean Room for the morning competition?',
    context: 'The Dean Room is for the badminton competition. There are two courts in there, so you\'ll have to set up both of them.',
    audioText: 'The Dean Room is for the badminton competition. There are two courts in there, so you\'ll have to set up both of them.',
    options: [
      'Two full courts',
      'Only one single practice court',
      'Three championship courts',
      'Four half-size training courts'
    ],
    correctIndex: 0,
    correctAnswer: 'Two full courts',
    explanation: 'Có hai sân cầu lông trong phòng Dean và người phụ trách yêu cầu dựng cả 2 sân ("set up both of them").',
    explanationEn: 'Court setup: Volunteers must assemble both of the two badminton courts in the Dean Room.'
  },
  {
    id: 'med_lis_correction_trap_t14',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In the afternoon, which sport will ACTUALLY be played in the Dean Room following Geoff\'s self-correction?',
    context: 'Now, in the afternoon, the table tennis is taking place in the Dean Room, so you\'ll need to... Oh, wait a minute! We had to change that because there are no basketball nets in the Carsley Room, so actually, the basketball will be in the Dean Room...',
    audioText: 'Now, in the afternoon, the table tennis is taking place in the Dean Room, so you\'ll need to... Oh, wait a minute! We had to change that because there are no basketball nets in the Carsley Room, so actually, the basketball will be in the Dean Room...',
    options: [
      'Basketball',
      'Table tennis',
      'Weightlifting',
      'Gymnastics'
    ],
    correctIndex: 0,
    correctAnswer: 'Basketball',
    explanation: 'Bẫy tự đính chính kinh điển: Ban đầu Geoff nói table tennis ở Dean Room, nhưng ngay sau đó đổi ý ("Oh, wait a minute! ... actually, the basketball will be in the Dean Room").',
    explanationEn: 'Self-correction trap: Although table tennis was initially mentioned, basketball was finalized for the Dean Room.'
  },
  {
    id: 'hard_lis_carsley_swap_t14',
    difficulty: 'hard',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is there a considerable amount of work required in the Carsley Room during the lunchtime changeover?',
    context: 'That means the table tennis will be taking place in the Carsley Room in the afternoon, so you\'ll have to make sure all the equipment is in there, as there will be a lot to do to change the room around.',
    audioText: 'That means the table tennis will be taking place in the Carsley Room in the afternoon, so you\'ll have to make sure all the equipment is in there, as there will be a lot to do to change the room around.',
    options: [
      'Gymnastics apparatus from the morning must be cleared away and replaced with table tennis tables',
      'The floor needs to be thoroughly mopped and polished for badminton',
      'Weightlifting mats must be unbolted from the foundation',
      'Temporary spectator stands have to be constructed'
    ],
    correctIndex: 0,
    correctAnswer: 'Gymnastics apparatus from the morning must be cleared away and replaced with table tennis tables',
    explanation: 'Phòng Carsley buổi sáng tổ chức thể dục dụng cụ (rất nhiều dụng cụ cồng kềnh), buổi chiều chuyển sang bóng bàn nên cần rất nhiều công sức để dọn dẹp và sắp xếp lại phòng ("a lot to do to change the room around").',
    explanationEn: 'Changeover workload: Transitioning Carsley Room from morning gymnastics to afternoon table tennis entails extensive equipment swap.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 15 SPORTS EQUIPMENT & LOGISTICS
  // ==========================================
  {
    id: 'easy_lis_geoff_arrival_t15',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'At what time does Geoff anticipate reaching North Henton Sports Centre?',
    context: 'I\'ll be there at about 10:00, as I have an appointment first thing, so you should be ready by then.',
    audioText: 'I\'ll be there at about 10:00, as I have an appointment first thing, so you should be ready by then.',
    options: [
      'Around 10:00 am',
      'At 9:00 am sharp',
      'At 8:30 am before doors open',
      'During the 12:30 pm lunch break'
    ],
    correctIndex: 0,
    correctAnswer: 'Around 10:00 am',
    explanation: 'Geoff cho biết sẽ có mặt vào khoảng 10:00 sáng ("at about 10:00") do bận cuộc hẹn đầu giờ.',
    explanationEn: 'Staff arrival: Geoff will reach the sports centre around 10:00 am after completing an early appointment.'
  },
  {
    id: 'med_lis_gymnastics_mats_t15',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How should the landing and safety mats be arranged around the vaulting horse?',
    context: 'That means bringing in the vaulting horse and putting it in the middle. Put one mat in front and another behind the horse, and have some other mats ready for the floor exercises.',
    audioText: 'That means bringing in the vaulting horse and putting it in the middle. Put one mat in front and another behind the horse, and have some other mats ready for the floor exercises.',
    options: [
      'One mat positioned in front and another placed behind the horse',
      'Mats placed exclusively on the left and right sides',
      'A single circular mat directly underneath the apparatus',
      'Double-stacked mats piled only at the rear dismount zone'
    ],
    correctIndex: 0,
    correctAnswer: 'One mat positioned in front and another placed behind the horse',
    explanation: 'Vị trí đặt thảm: Một tấm ở phía trước và một tấm khác ở phía sau con ngựa nhảy ("one mat in front and another behind the horse").',
    explanationEn: 'Apparatus layout: Safety mats must be situated both directly in front of and behind the vaulting horse.'
  },
  {
    id: 'med_lis_tabletennis_storage_t15',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why are volunteers advised to bring table tennis tables into the Carsley Room during the morning?',
    context: 'It\'s also a good idea to bring in the tables and nets for the table tennis at the same time. There\'s enough room to leave them folded while the gymnastics is going on, but you\'ll be able to set them up more quickly later.',
    audioText: 'It\'s also a good idea to bring in the tables and nets for the table tennis at the same time. There\'s enough room to leave them folded while the gymnastics is going on, but you\'ll be able to set them up more quickly later.',
    options: [
      'They can be kept folded safely without obstructing gymnastics and speed up afternoon transition',
      'The storeroom needs to be completely locked down after 9:30 am',
      'Table tennis umpires want to inspect the table surfaces early',
      'The folding wheels will be needed for moving the gymnastics bars'
    ],
    correctIndex: 0,
    correctAnswer: 'They can be kept folded safely without obstructing gymnastics and speed up afternoon transition',
    explanation: 'Mang bàn bóng bàn vào sớm để gọn (ở trạng thái gấp - folded) để buổi chiều mở ra nhanh chóng hơn ("set them up more quickly later").',
    explanationEn: 'Strategic preparation: Storing folded table tennis tables along the wall facilitates a rapid afternoon changeover.'
  },
  {
    id: 'hard_lis_chalk_stand_t15',
    difficulty: 'hard',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Which specific accessory MUST volunteers transport into the Forster Room for the weightlifters?',
    context: 'The bench for the bench press should be in there already, so check that it is when you arrive. But you\'ll need to bring in the stand with the chalk for the lifters to put on their hands.',
    audioText: 'The bench for the bench press should be in there already, so check that it is when you arrive. But you\'ll need to bring in the stand with the chalk for the lifters to put on their hands.',
    options: [
      'The stand containing powdered chalk for athletes\' hands',
      'The heavy bench press structure itself',
      'Electronic scoreboards and timers'
    ],
    correctIndex: 0,
    correctAnswer: 'The stand containing powdered chalk for athletes\' hands',
    explanation: 'Bẫy phân biệt: Ghế tập (bench press) đã có sẵn trong phòng; thứ bắt buộc phải mang vào từ kho là giá đựng bột phấn ("stand with the chalk for the lifters to put on their hands").',
    explanationEn: 'Equipment distinction: The bench is pre-installed, but helpers must transport the chalk stand into the room.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 16 TOURNAMENT DUTY ALLOCATIONS
  // ==========================================
  {
    id: 'easy_lis_geoff_absence_t16',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is Geoff unable to be present at the start of the inter-college sports tournament?',
    context: "I'll be there at about 10 o'clock, as I have an appointment first thing. So you should be ready by then.",
    audioText: "I'll be there at about 10 o'clock, as I have an appointment first thing. So you should be ready by then.",
    options: [
      'He has an unavoidable morning appointment first thing',
      'He was caught in severe morning traffic around the town centre',
      'He had to fetch replacement equipment from South Henton',
      'He was held up inspecting the flooded gym floor'
    ],
    correctIndex: 0,
    correctAnswer: 'He has an unavoidable morning appointment first thing',
    explanation: 'Geoff nêu rõ nguyên nhân vắng mặt đầu buổi (đến khoảng 10h) là do có một cuộc hẹn vào sáng sớm ("an appointment first thing").',
    explanationEn: 'Geoff explains he will arrive late at about 10 o\'clock because he has an appointment first thing in the morning.'
  },
  {
    id: 'med_lis_amanda_badminton_t16',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'For what reason is Amanda assigned to organize the badminton event rather than gymnastics?',
    context: 'Amanda, if I remember rightly, you also once did some training in the rules of badminton, so it might be best if you take that on, rather than the gymnastics. It will be useful to have you there to help with judging line calls and so on.',
    audioText: 'Amanda, if I remember rightly, you also once did some training in the rules of badminton, so it might be best if you take that on, rather than the gymnastics. It will be useful to have you there to help with judging line calls and so on.',
    options: [
      'She previously completed formal training in the rules of the sport',
      'She is the only volunteer who currently plays competitive badminton',
      'Gymnastics already had too many volunteer coordinators assigned',
      'Her physical fitness is best suited for judging active line calls'
    ],
    correctIndex: 0,
    correctAnswer: 'She previously completed formal training in the rules of the sport',
    explanation: 'Amanda được chọn cho cầu lông vì từng được đào tạo về luật thi đấu ("did some training in the rules of badminton") và có thể bắt lỗi vạch sân ("judging line calls").',
    explanationEn: 'Amanda is selected for badminton because of her previous training in the rules of badminton, enabling her to assist with line calls.'
  },
  {
    id: 'med_lis_basketball_reversal_t16',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Following Geoff\'s on-the-spot reconsideration, which volunteer is definitively given charge of afternoon basketball?',
    context: 'But Malik, you\'re already doing the weightlifting, so perhaps Amanda, you can do the basketball. Actually, no. I\'ve just thought: I\'m pretty certain I\'ll be in for the afternoon... How about you do the basketball, Malik?',
    audioText: 'But Malik, you\'re already doing the weightlifting, so perhaps Amanda, you can do the basketball. Actually, no. I\'ve just thought: I\'m pretty certain I\'ll be in for the afternoon... How about you do the basketball, Malik?',
    options: [
      'Malik',
      'Amanda',
      'Steve',
      'Geoff'
    ],
    correctIndex: 0,
    correctAnswer: 'Malik',
    explanation: 'Bẫy tự đính chính: Geoff ban đầu đề xuất Amanda, nhưng lập tức tự phủ nhận ("Actually, no. I\'ve just thought...") và chốt giao bóng rổ cho Malik ("How about you do the basketball, Malik?").',
    explanationEn: 'Self-correction trap: Geoff initially suggested Amanda, but changed his mind ("Actually, no") and ultimately assigned basketball to Malik.'
  },
  {
    id: 'hard_lis_steve_reserve_t16',
    difficulty: 'hard',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What contingency responsibility is Steve assigned if Geoff experiences an unexpected delay in the early afternoon?',
    context: 'Steve, you can be available to help wherever you\'re needed in the afternoon. And if something happens and I can\'t make it in the early afternoon, you can take care of the weightlifting till I arrive...',
    audioText: 'Steve, you can be available to help wherever you\'re needed in the afternoon. And if something happens and I can\'t make it in the early afternoon, you can take care of the weightlifting till I arrive...',
    options: [
      'Supervising weightlifting until Geoff arrives at the sports centre',
      'Officiating table tennis matches alongside Amanda',
      'Managing the reception storeroom and visitor registration',
      'Coordinating line judges for the basketball tournament'
    ],
    correctIndex: 0,
    correctAnswer: 'Supervising weightlifting until Geoff arrives at the sports centre',
    explanation: 'Nhiệm vụ dự phòng: Mặc dù vai trò chính của Steve là hỗ trợ linh hoạt, nhưng nếu Geoff đến muộn thì Steve sẽ trông coi môn cử tạ cho đến khi Geoff tới ("take care of the weightlifting till I arrive").',
    explanationEn: 'Contingency duty: Although Steve is a flexible helper, he must oversee weightlifting if Geoff is delayed early in the afternoon.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 17 ATHLETIC MOTIVATIONS & BENEFITS
  // ==========================================
  {
    id: 'easy_lis_rowing_health_t17',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to the first speaker, what makes rowing a particularly commendable sport?',
    context: 'I think that rowing is a great sport if you want to stay fit and healthy.',
    audioText: 'I think that rowing is a great sport if you want to stay fit and healthy.',
    options: [
      'It provides an effective means to maintain physical fitness and sound health',
      'It offers intense competitive pressure when racing against friends',
      'It is an inexpensive outdoor recreational pastime',
      'It focuses exclusively on upper body muscular strength'
    ],
    correctIndex: 0,
    correctAnswer: 'It provides an effective means to maintain physical fitness and sound health',
    explanation: 'Người nói số 1 nêu rõ rowing là môn thể thao tuyệt vời nếu muốn giữ vóc dáng và sức khỏe tốt ("stay fit and healthy").',
    explanationEn: 'Speaker 1 affirms that rowing is a great sport for staying fit and healthy.'
  },
  {
    id: 'med_lis_tennis_competitive_t17',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What specific factor drives the second speaker\'s enjoyment of tennis?',
    context: 'I often enjoy tennis, as it is very competitive, and I like to beat my friends.',
    audioText: 'I often enjoy tennis, as it is very competitive, and I like to beat my friends.',
    options: [
      'The fierce competitive nature and the pleasure of defeating friends',
      'The requirement to develop endurance on open water',
      'The social atmosphere among non-competitive club members',
      'The physical conditioning that keeps players lean and fit'
    ],
    correctIndex: 0,
    correctAnswer: 'The fierce competitive nature and the pleasure of defeating friends',
    explanation: 'Người nói số 2 thích tennis vì tính cạnh tranh cao và cảm giác đánh bại bạn bè ("as it is very competitive, and I like to beat my friends").',
    explanationEn: 'Speaker 2 enjoys tennis specifically because of its competitiveness and the thrill of beating friends.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 18 SPORTING ACHIEVEMENTS & ATHLETIC FEATS
  // ==========================================
  {
    id: 'easy_lis_olympics_t18',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to statement two, which country finished in second place on the London 2012 medals table?',
    context: 'At London 2012, the United States was top of the medals table, followed by China, then Great Britain and Northern Ireland.',
    audioText: 'At London 2012, the United States was top of the medals table, followed by China, then Great Britain and Northern Ireland.',
    options: [
      'China',
      'The United States',
      'Great Britain and Northern Ireland',
      'Russia'
    ],
    correctIndex: 0,
    correctAnswer: 'China',
    explanation: 'Bảng xếp hạng nêu rõ Hoa Kỳ đứng đầu ("top"), theo sau bởi Trung Quốc ở vị trí thứ hai ("followed by China"), rồi mới tới Vương quốc Anh và Bắc Ireland ("then Great Britain and Northern Ireland").',
    explanationEn: 'Ranking sequence: The United States was top, followed immediately by China in second place, and Great Britain and Northern Ireland in third.'
  },
  {
    id: 'med_lis_jordan_record_t18',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What does statement four confirm about Michael Jordan\'s NBA playoff record?',
    context: 'Michael Jordan is the number one all-time point scorer in the NBA playoffs, although LeBron James is catching up.',
    audioText: 'Michael Jordan is the number one all-time point scorer in the NBA playoffs, although LeBron James is catching up.',
    options: [
      'He currently holds the number one all-time playoff scoring position, but LeBron James is closing the gap',
      'His all-time scoring record has already been surpassed by LeBron James',
      'He retired as second behind LeBron James in overall tournament scoring',
      'He and LeBron James share an exact tie for the highest playoff points'
    ],
    correctIndex: 0,
    correctAnswer: 'He currently holds the number one all-time playoff scoring position, but LeBron James is closing the gap',
    explanation: 'Michael Jordan hiện vẫn giữ vị trí dẫn đầu ghi điểm vòng playoff ("number one all-time point scorer"), dù LeBron James đang theo sát phía sau ("is catching up") chứ chưa vượt qua.',
    explanationEn: 'Record status: Michael Jordan remains the number one all-time playoff scorer, with LeBron James actively catching up but not having overtaken him yet.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 19 SPORTS PREFERENCES & LIFESTYLE CONSTRAINTS
  // ==========================================
  {
    id: 'easy_lis_hockey_t19',
    difficulty: 'easy',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to the first speaker, what is their favorite sporting activity?',
    context: 'My favorite sport is hockey. It\'s amazing.',
    audioText: 'My favorite sport is hockey. It\'s amazing.',
    options: ['Hockey', 'Football', 'Tennis', 'Badminton'],
    correctIndex: 0,
    correctAnswer: 'Hockey',
    explanation: 'Người nói thứ nhất khẳng định rõ ràng môn thể thao yêu thích của mình là khúc côn cầu ("My favorite sport is hockey").',
    explanationEn: 'Favorite sport identification: The first speaker explicitly states that hockey is their favorite sport.'
  },
  {
    id: 'med_lis_swimming_wish_t19',
    difficulty: 'medium',
    topic: 'sports',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What local issue does the second speaker express frustration about regarding swimming?',
    context: 'I like swimming, but I wish there were more places to swim where I live.',
    audioText: 'I like swimming, but I wish there were more places to swim where I live.',
    options: [
      'There is a shortage of swimming venues in their residential area',
      'Admission tickets to local swimming pools have become too expensive',
      'Indoor pools in the area are frequently overcrowded during weekends',
      'Water hygiene and maintenance standards are below expectations'
    ],
    correctIndex: 0,
    correctAnswer: 'There is a shortage of swimming venues in their residential area',
    explanation: 'Cấu trúc câu ước "I wish there were more places to swim where I live" cho thấy vấn đề là khu vực sinh sống thiếu địa điểm bơi lội.',
    explanationEn: 'Wish clause analysis: The speaker desires "more places to swim where I live", confirming an inadequate number of local swimming facilities.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 20 TOPICAL DISCUSSIONS ON POLITICS, CINEMA & ROBOTICS
  // ==========================================
  {
    id: 'easy_lis_election_economy_t20',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to the first speaker in Discussion 1, why are citizens experiencing severe economic strain?',
    context: 'People are already finding it difficult to live with prices going up and salaries staying the same.',
    audioText: 'People are already finding it difficult to live with prices going up and salaries staying the same.',
    options: [
      'Prices are escalating while personal salaries remain unchanged',
      'High taxation on luxury imports has burdened local businesses',
      'Mortgage interest rates have tripled over the last five years',
      'Unemployment figures have surged after manufacturing shutdowns'
    ],
    correctIndex: 0,
    correctAnswer: 'Prices are escalating while personal salaries remain unchanged',
    explanation: 'Nguyên nhân trực tiếp được người nói nêu ra là giá cả leo thang trong khi tiền lương không đổi ("with prices going up and salaries staying the same").',
    explanationEn: 'Direct cause identification: The speaker explicitly attributes living difficulty to prices going up while salaries stay the same.'
  },
  {
    id: 'med_lis_robot_football_messi_t20',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Discussion 3, how does the male speaker praise the winning goal in the robotic soccer match?',
    context: 'And that winning goal was like Messi scoring.',
    audioText: 'And that winning goal was like Messi scoring.',
    options: [
      'By likening its brilliance to a goal scored by Lionel Messi',
      'By noting it was an accidental rebound caused by a sensory glitch',
      'By comparing the robot\'s movement speed to an Olympic sprinter',
      'By praising the goalkeeper robot for an impossible acrobatic dive'
    ],
    correctIndex: 0,
    correctAnswer: 'By likening its brilliance to a goal scored by Lionel Messi',
    explanation: 'Người nam khen ngợi bàn thắng quyết định bằng cách ví von nó đỉnh cao như một pha lập công của Lionel Messi ("was like Messi scoring").',
    explanationEn: 'Figurative comparison: The man praises the winning goal by comparing it to a strike by Lionel Messi.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 21 PUBLIC OPINIONS ON MODERN ART & CLIMATE CHANGE
  // ==========================================
  {
    id: 'easy_lis_modern_art_takeleave_t21',
    difficulty: 'easy',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'vocab',
    prompt: 'In Topic 1, what does the colloquial idiom "I can take it or leave it" express about Speaker 1\'s stance on modern art?',
    context: 'Personally, I like some of it, but I\'m not really bothered. I can take it or leave it.',
    audioText: 'Personally, I like some of it, but I\'m not really bothered. I can take it or leave it.',
    options: [
      'Mild indifference without intense emotional attachment either way',
      'Extreme indignation towards contemporary abstract sculptures',
      'An obsessive passion to purchase and exhibit modern paintings',
      'Complete inability to comprehend the artwork\'s visual composition'
    ],
    correctIndex: 0,
    correctAnswer: 'Mild indifference without intense emotional attachment either way',
    explanation: 'Thành ngữ "take it or leave it" thể hiện tâm lý thờ ơ, không mặn mà nhưng cũng không căm ghét (thế nào cũng được).',
    explanationEn: 'Idiomatic meaning: "Take it or leave it" conveys mild indifference or a neutral attitude without strong attachment.'
  },
  {
    id: 'med_lis_climate_action_oilgas_t21',
    difficulty: 'medium',
    topic: 'environment',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Topic 2, what strategic change does Speaker 1 urge society to execute to combat climate change?',
    context: 'The government should be supporting renewable forms of energy, and we really need to reduce our dependence on oil and gas.',
    audioText: 'The government should be supporting renewable forms of energy, and we really need to reduce our dependence on oil and gas.',
    options: [
      'Support renewable energy and significantly reduce reliance on oil and gas',
      'Construct high-capacity nuclear reactors in municipal residential zones',
      'Impose immediate penalties on households failing to compost organic waste',
      'Halt all technological research until international climate consensus is reached'
    ],
    correctIndex: 0,
    correctAnswer: 'Support renewable energy and significantly reduce reliance on oil and gas',
    explanation: 'Người nói chủ trương chính phủ phải thúc đẩy năng lượng tái tạo và giảm thiểu phụ thuộc vào dầu mỏ và khí đốt ("reduce our dependence on oil and gas").',
    explanationEn: 'Strategic priority: Speaker 1 urges supporting renewable energy while reducing dependence on oil and gas.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 22 SPACE EXPEDITION RESEARCH PROJECTS TUTORIAL
  // ==========================================
  {
    id: 'easy_lis_mars_desert_camp_t22',
    difficulty: 'easy',
    topic: 'science',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Where has the six-month Mars simulation camp been constructed according to Simon?',
    context: 'They\'ve built a sort of camp in the desert in Arizona. There are 10 people living there for six months...',
    audioText: 'They\'ve built a sort of camp in the desert in Arizona. There are 10 people living there for six months...',
    options: [
      'In the desert in Arizona',
      'In an underground bunker in Texas',
      'In an Arctic research outpost in Alaska',
      'On an uninhabited volcanic island in Hawaii'
    ],
    correctIndex: 0,
    correctAnswer: 'In the desert in Arizona',
    explanation: 'Simon xác nhận khu trại mô phỏng môi trường Sao Hỏa được xây dựng tại vùng sa mạc thuộc bang Arizona ("in the desert in Arizona").',
    explanationEn: 'Location identification: Simon confirms the simulation camp is located in the desert in Arizona.'
  },
  {
    id: 'med_lis_space_project_outline_t22',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What concrete assignment must Maria and Simon hand in to Dr. Thornton next Wednesday?',
    context: 'We\'ll meet again next Wednesday and you can give me your project outline.',
    audioText: 'We\'ll meet again next Wednesday and you can give me your project outline.',
    options: [
      'A preliminary project outline',
      'The full statistical results of the Arizona trial',
      'A signed ethics approval letter from the university department',
      'A 20-page comprehensive literature review'
    ],
    correctIndex: 0,
    correctAnswer: 'A preliminary project outline',
    explanation: 'Giảng viên hướng dẫn Dr. Thornton yêu cầu hai sinh viên nộp dàn ý đề tài ("give me your project outline") vào thứ Tư tuần sau.',
    explanationEn: 'Task assignment: Dr. Thornton asks the students to bring their project outline to the meeting next Wednesday.'
  }
];

const R2_BASE = 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev';

const R2_AUDIO_METADATA_BY_ID = {
  // Track 2: Flat Descriptions
  easy_lis_flat_01: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 11.6, clipEnd: 18.9, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions' },
  med_lis_flat_02: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 44.3, clipEnd: 54.3, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions' },
  hard_lis_flat_03: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 71.7, clipEnd: 79.8, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions' },
  med_vocab_flat_04: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 11.6, clipEnd: 16.4, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions', audioText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet.' },
  hard_paraphrase_flat_05: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 56.4, clipEnd: 62.8, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions', audioText: 'The flat needs some modernization, but it is very well kept and would be an excellent family home.' },
  // Track 3: Property Enquiry
  easy_lis_addr_01: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 13.4, clipEnd: 25.4, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  med_lis_appt_02: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 121.1, clipEnd: 135.7, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  med_lis_spell_03: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 151.2, clipEnd: 156.8, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  hard_lis_appliances_04: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 78.2, clipEnd: 86.3, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  // Track 4: Numbers & Measurements
  easy_lis_b_vs_d_01: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 87.6, clipEnd: 97.2, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  easy_lis_price_02: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 4.5, clipEnd: 17.4, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  med_lis_phone_03: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 48.9, clipEnd: 62.3, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  hard_lis_dim_04: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 68.6, clipEnd: 77, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  // Track 5: Property Viewing
  easy_lis_decision_offer: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 213.3, clipEnd: 221.4, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  med_lis_asking_price_trap: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 15.0, clipEnd: 25.3, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  med_lis_bath_fixture_trap: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 153.4, clipEnd: 159.1, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  hard_lis_dim_correction_trap: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 135.2, clipEnd: 151.0, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  // Track 6: Offer & Sale Process
  easy_lis_postcode_ke7: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 35.2, clipEnd: 37.4, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  med_lis_current_stay: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 118.4, clipEnd: 123.7, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  med_lis_main_worry: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 192.4, clipEnd: 211.4, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  hard_lis_deposit_cash: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 101.9, clipEnd: 109.9, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  // Track 7: En-Suite Clip
  easy_lis_ensuite_routine: { audioUrl: `${R2_BASE}/ielts-listening-track7-ensuite-bathroom-clip.mp3`, clipStart: 10.3, clipEnd: 15.4, isR2Audio: true, trackLabel: 'Track 7 • En-suite Routine' },
  med_lis_idiom_useful: { audioUrl: `${R2_BASE}/ielts-listening-track7-ensuite-bathroom-clip.mp3`, clipStart: 10.3, clipEnd: 15.4, isR2Audio: true, trackLabel: 'Track 7 • En-suite Routine', audioText: 'That would come in very useful when we all get up to get ready for school or work.' },
  // Track 8: Student Accommodation & Shopping
  easy_lis_commute_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 30, clipEnd: 44.1, isR2Audio: true, trackLabel: 'Track 8 • Commute & School' },
  med_lis_nationality_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 60.8, clipEnd: 71.4, isR2Audio: true, trackLabel: 'Track 8 • International House' },
  med_lis_mall_feature_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 109, clipEnd: 117.9, isR2Audio: true, trackLabel: 'Track 8 • City Gate Amenities' },
  hard_lis_market_reason_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 172.4, clipEnd: 186.5, isR2Audio: true, trackLabel: 'Track 8 • Local Market Opinion' },
  // Track 9: Hometown Descriptions & Urban Living
  easy_lis_inhabitants_t9: { audioUrl: `${R2_BASE}/ielts-listening-track9-hometown-architecture-and-living.mp3`, clipStart: 69.9, clipEnd: 76.9, isR2Audio: true, trackLabel: 'Track 9 • Inhabitants & Weather' },
  med_lis_architecture_t9: { audioUrl: `${R2_BASE}/ielts-listening-track9-hometown-architecture-and-living.mp3`, clipStart: 28, clipEnd: 32, isR2Audio: true, trackLabel: 'Track 9 • Architecture Vocab' },
  med_lis_residential_dull_t9: { audioUrl: `${R2_BASE}/ielts-listening-track9-hometown-architecture-and-living.mp3`, clipStart: 115.2, clipEnd: 122.4, isR2Audio: true, trackLabel: 'Track 9 • Residential Areas' },
  hard_lis_traffic_env_t9: { audioUrl: `${R2_BASE}/ielts-listening-track9-hometown-architecture-and-living.mp3`, clipStart: 164.9, clipEnd: 170.4, isR2Audio: true, trackLabel: 'Track 9 • Traffic & Environment' },
  // Track 10: Word Stress & Pronunciation Lab
  easy_lis_stress_accommodation_t10: { audioUrl: `${R2_BASE}/ielts-listening-track10-word-stress-and-pronunciation.mp3`, clipStart: 7.6, clipEnd: 11.1, isR2Audio: true, trackLabel: 'Track 10 • Stress: Accommodation' },
  med_lis_silent_env_t10: { audioUrl: `${R2_BASE}/ielts-listening-track10-word-stress-and-pronunciation.mp3`, clipStart: 53.4, clipEnd: 54.4, isR2Audio: true, trackLabel: 'Track 10 • Spelling: Environment' },
  med_lis_stress_geography_t10: { audioUrl: `${R2_BASE}/ielts-listening-track10-word-stress-and-pronunciation.mp3`, clipStart: 57.6, clipEnd: 59.4, isR2Audio: true, trackLabel: 'Track 10 • Stress: Geography' },
  hard_lis_spell_scenery_t10: { audioUrl: `${R2_BASE}/ielts-listening-track10-word-stress-and-pronunciation.mp3`, clipStart: 72.1, clipEnd: 72.9, isR2Audio: true, trackLabel: 'Track 10 • Spelling: Scenery' },
  // Track 11: Map & Road Directions
  easy_lis_lane_t11: { audioUrl: `${R2_BASE}/ielts-listening-track11-map-directions-and-navigation.mp3`, clipStart: 3.4, clipEnd: 8, isR2Audio: true, trackLabel: 'Track 11 • Motorway Lane' },
  med_lis_roundabout_t11: { audioUrl: `${R2_BASE}/ielts-listening-track11-map-directions-and-navigation.mp3`, clipStart: 17.3, clipEnd: 21.9, isR2Audio: true, trackLabel: 'Track 11 • Roundabout Exit' },
  med_lis_bend_t11: { audioUrl: `${R2_BASE}/ielts-listening-track11-map-directions-and-navigation.mp3`, clipStart: 23.7, clipEnd: 28, isR2Audio: true, trackLabel: 'Track 11 • Sharp Turn' },
  hard_lis_junction_t11: { audioUrl: `${R2_BASE}/ielts-listening-track11-map-directions-and-navigation.mp3`, clipStart: 36.8, clipEnd: 40.9, isR2Audio: true, trackLabel: 'Track 11 • End of Road' },
  // Track 12: Sports Centre Relocation & Road Navigation
  easy_lis_flood_damage_t12: { audioUrl: `${R2_BASE}/ielts-listening-track12-sports-centre-relocation-and-map.mp3`, clipStart: 13.7, clipEnd: 23.4, isR2Audio: true, trackLabel: 'Track 12 • Flooding Damage' },
  med_lis_meeting_time_t12: { audioUrl: `${R2_BASE}/ielts-listening-track12-sports-centre-relocation-and-map.mp3`, clipStart: 37.6, clipEnd: 42.8, isR2Audio: true, trackLabel: 'Track 12 • Meeting Time' },
  med_lis_bramley_turn_t12: { audioUrl: `${R2_BASE}/ielts-listening-track12-sports-centre-relocation-and-map.mp3`, clipStart: 84.7, clipEnd: 93.9, isR2Audio: true, trackLabel: 'Track 12 • Bramley Road Junction' },
  hard_lis_landmark_final_t12: { audioUrl: `${R2_BASE}/ielts-listening-track12-sports-centre-relocation-and-map.mp3`, clipStart: 112.7, clipEnd: 120.3, isR2Audio: true, trackLabel: 'Track 12 • Woodland Hotel Landmark' },
  // Track 13: Sports & Athletic Requirements
  easy_lis_shuttlecock_t13: { audioUrl: `${R2_BASE}/ielts-listening-track13-sports-and-physical-skills.mp3`, clipStart: 10.3, clipEnd: 18.1, isR2Audio: true, trackLabel: 'Track 13 • Badminton Shuttlecock' },
  med_lis_gymnastics_t13: { audioUrl: `${R2_BASE}/ielts-listening-track13-sports-and-physical-skills.mp3`, clipStart: 23.8, clipEnd: 33.8, isR2Audio: true, trackLabel: 'Track 13 • Gymnastics Flexibility' },
  med_lis_tabletennis_t13: { audioUrl: `${R2_BASE}/ielts-listening-track13-sports-and-physical-skills.mp3`, clipStart: 39.9, clipEnd: 50.6, isR2Audio: true, trackLabel: 'Track 13 • Table Tennis Precision' },
  hard_lis_weightlifting_t13: { audioUrl: `${R2_BASE}/ielts-listening-track13-sports-and-physical-skills.mp3`, clipStart: 59.3, clipEnd: 66.2, isR2Audio: true, trackLabel: 'Track 13 • Weightlifting Stance' },
  // Track 14: Sports Room Scheduling & Logistics
  easy_lis_storeroom_key_t14: { audioUrl: `${R2_BASE}/ielts-listening-track14-sports-centre-room-schedule.mp3`, clipStart: 15.8, clipEnd: 23.4, isR2Audio: true, trackLabel: 'Track 14 • Storeroom Key' },
  med_lis_dean_morning_t14: { audioUrl: `${R2_BASE}/ielts-listening-track14-sports-centre-room-schedule.mp3`, clipStart: 36.5, clipEnd: 44.1, isR2Audio: true, trackLabel: 'Track 14 • Dean Room Morning' },
  med_lis_correction_trap_t14: { audioUrl: `${R2_BASE}/ielts-listening-track14-sports-centre-room-schedule.mp3`, clipStart: 63.9, clipEnd: 79.4, isR2Audio: true, trackLabel: 'Track 14 • Basketball Self-Correction' },
  hard_lis_carsley_swap_t14: { audioUrl: `${R2_BASE}/ielts-listening-track14-sports-centre-room-schedule.mp3`, clipStart: 83, clipEnd: 93, isR2Audio: true, trackLabel: 'Track 14 • Carsley Afternoon Swap' },
  // Track 15: Sports Equipment & Logistics
  easy_lis_geoff_arrival_t15: { audioUrl: `${R2_BASE}/ielts-listening-track15-sports-equipment-and-preparation.mp3`, clipStart: 102, clipEnd: 108.8, isR2Audio: true, trackLabel: 'Track 15 • Geoff Arrival 10:00' },
  med_lis_gymnastics_mats_t15: { audioUrl: `${R2_BASE}/ielts-listening-track15-sports-equipment-and-preparation.mp3`, clipStart: 38.2, clipEnd: 49, isR2Audio: true, trackLabel: 'Track 15 • Vaulting Horse & Mats' },
  med_lis_tabletennis_storage_t15: { audioUrl: `${R2_BASE}/ielts-listening-track15-sports-equipment-and-preparation.mp3`, clipStart: 63.6, clipEnd: 76.6, isR2Audio: true, trackLabel: 'Track 15 • Folded Tables' },
  hard_lis_chalk_stand_t15: { audioUrl: `${R2_BASE}/ielts-listening-track15-sports-equipment-and-preparation.mp3`, clipStart: 91.7, clipEnd: 101.9, isR2Audio: true, trackLabel: 'Track 15 • Chalk Stand' },
  // Track 16: Competition Staff Duty Allocations
  easy_lis_geoff_absence_t16: { audioUrl: `${R2_BASE}/ielts-listening-track15-sports-equipment-and-preparation.mp3`, clipStart: 102.2, clipEnd: 108.4, isR2Audio: true, trackLabel: 'Track 15 • Geoff Absence / Appointment' },
  med_lis_amanda_badminton_t16: { audioUrl: `${R2_BASE}/ielts-listening-track16-sports-event-organizers-duty.mp3`, clipStart: 42.5, clipEnd: 57.3, isR2Audio: true, trackLabel: 'Track 16 • Badminton Rules' },
  med_lis_basketball_reversal_t16: { audioUrl: `${R2_BASE}/ielts-listening-track16-sports-event-organizers-duty.mp3`, clipStart: 92.5, clipEnd: 106, isR2Audio: true, trackLabel: 'Track 16 • Basketball Reversal' },
  hard_lis_steve_reserve_t16: { audioUrl: `${R2_BASE}/ielts-listening-track16-sports-event-organizers-duty.mp3`, clipStart: 128.3, clipEnd: 139.4, isR2Audio: true, trackLabel: 'Track 16 • Steve Contingency' },
  // Track 17: Athletic Motivations & Benefits
  easy_lis_rowing_health_t17: { audioUrl: `${R2_BASE}/ielts-listening-track17-sports-benefits-and-opinions.mp3`, clipStart: 3.6, clipEnd: 9.9, isR2Audio: true, trackLabel: 'Track 17 • Rowing Benefits' },
  med_lis_tennis_competitive_t17: { audioUrl: `${R2_BASE}/ielts-listening-track17-sports-benefits-and-opinions.mp3`, clipStart: 11.4, clipEnd: 18.1, isR2Audio: true, trackLabel: 'Track 17 • Tennis Motivation' },
  // Track 18: Sporting Achievements & Athletic Feats
  easy_lis_olympics_t18: { audioUrl: `${R2_BASE}/ielts-listening-track18-sports-facts-and-achievements.mp3`, clipStart: 12.4, clipEnd: 22.4, isR2Audio: true, trackLabel: 'Track 18 • Olympic Rankings' },
  med_lis_jordan_record_t18: { audioUrl: `${R2_BASE}/ielts-listening-track18-sports-facts-and-achievements.mp3`, clipStart: 33, clipEnd: 41.8, isR2Audio: true, trackLabel: 'Track 18 • NBA Playoff Record' },
  // Track 19: Sports Preferences & Lifestyle Constraints
  easy_lis_hockey_t19: { audioUrl: `${R2_BASE}/ielts-listening-track19-sports-preferences-and-hobbies.mp3`, clipStart: 4.1, clipEnd: 8.2, isR2Audio: true, trackLabel: 'Track 19 • Favorite Sport Hockey' },
  med_lis_swimming_wish_t19: { audioUrl: `${R2_BASE}/ielts-listening-track19-sports-preferences-and-hobbies.mp3`, clipStart: 16.3, clipEnd: 21, isR2Audio: true, trackLabel: 'Track 19 • Swimming Facility Shortage' },
  // Track 20: Topical Discussions on Politics, Cinema & Robotics
  easy_lis_election_economy_t20: { audioUrl: `${R2_BASE}/ielts-listening-track20-discussions-politics-film-robotics.mp3`, clipStart: 15.4, clipEnd: 21.4, isR2Audio: true, trackLabel: 'Track 20 • Election Economic Strain' },
  med_lis_robot_football_messi_t20: { audioUrl: `${R2_BASE}/ielts-listening-track20-discussions-politics-film-robotics.mp3`, clipStart: 92, clipEnd: 95.1, isR2Audio: true, trackLabel: 'Track 20 • Robot Football Messi Goal' },
  // Track 21: Public Opinions on Modern Art & Climate Change
  easy_lis_modern_art_takeleave_t21: { audioUrl: `${R2_BASE}/ielts-listening-track21-opinions-modern-art-climate-change.mp3`, clipStart: 19.8, clipEnd: 27.3, isR2Audio: true, trackLabel: 'Track 21 • Modern Art Idiom' },
  med_lis_climate_action_oilgas_t21: { audioUrl: `${R2_BASE}/ielts-listening-track21-opinions-modern-art-climate-change.mp3`, clipStart: 100.6, clipEnd: 108.5, isR2Audio: true, trackLabel: 'Track 21 • Renewable Energy Action' },
  // Track 22: Space Expedition Research Projects Tutorial
  easy_lis_mars_desert_camp_t22: { audioUrl: `${R2_BASE}/ielts-listening-track22-space-expedition-project-meeting.mp3`, clipStart: 84.6, clipEnd: 91.6, isR2Audio: true, trackLabel: 'Track 22 • Arizona Mars Habitat' },
  med_lis_space_project_outline_t22: { audioUrl: `${R2_BASE}/ielts-listening-track22-space-expedition-project-meeting.mp3`, clipStart: 201.3, clipEnd: 206.9, isR2Audio: true, trackLabel: 'Track 22 • Project Outline Deadline' }
};

export const ARENA_QUESTION_BANK = [
  ...ARENA_BASE_QUESTION_BANK,
  ...ARENA_BATCH_1_QUESTIONS,
  ...ARENA_BATCH_2_QUESTIONS,
  ...ARENA_101_READING_QUESTIONS
].map(q => {
  const r2Meta = R2_AUDIO_METADATA_BY_ID[q.id] || {};
  const merged = { ...q, ...r2Meta };
  const trans = ARENA_QUESTION_TRANSLATIONS[merged.id];
  if (!trans) return merged;
  return {
    ...merged,
    promptVi: merged.prompt,
    contextVi: merged.context,
    explanationVi: merged.explanation,
    promptEn: trans.promptEn || merged.prompt,
    contextEn: trans.contextEn || merged.context,
    explanationEn: trans.explanationEn || merged.explanation
  };
});

/**
 * Filter questions by difficulty and optional topic.
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' | 'nightmare'
 * @param {string} [topic=null] - optional topic filter
 * @returns {Array<Object>}
 */
export function getQuestionsByTierAndTopic(difficulty = 'medium', topic = null) {
  let pool = ARENA_QUESTION_BANK.filter(q => q.difficulty === difficulty);
  if (pool.length === 0) {
    pool = ARENA_QUESTION_BANK.filter(q => q.difficulty === 'medium');
  }
  if (topic) {
    const topicPool = pool.filter(q => q.topic === topic);
    if (topicPool.length > 0) {
      return topicPool;
    }
  }
  return pool;
}
