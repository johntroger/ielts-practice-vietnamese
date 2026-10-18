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
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 23 PUBLIC POLICIES & SOCIAL OPINIONS
  // ==========================================
  {
    id: 'easy_lis_bus_fare_time_t23',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'At what time do discounted bus fares take effect according to the local broadcast?',
    context: 'They just said on the local news that the bus companies are planning to reduce fares for travel after 10:00 to get more people to come into town.',
    audioText: 'They just said on the local news that the bus companies are planning to reduce fares for travel after 10:00 to get more people to come into town.',
    options: [
      'After 10:00',
      'Before 08:30',
      'After 17:00',
      'Throughout the entire weekend'
    ],
    correctIndex: 0,
    correctAnswer: 'After 10:00',
    explanation: 'Bản tin địa phương thông báo các công ty xe buýt dự kiến giảm giá vé cho hành khách di chuyển sau 10:00 sáng ("after 10:00").',
    explanationEn: 'Time identification: The news report indicates that discounted fares apply to journeys after 10:00.'
  },
  {
    id: 'med_lis_tax_impact_t23',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What major economic consequence does the woman anticipate if taxes are increased?',
    context: "It looks like the government is going to raise taxes in the budget tomorrow. - Seriously? I really don't see how that could be a good idea. It'll reduce spending and affect the economy without a doubt.",
    audioText: "It looks like the government is going to raise taxes in the budget tomorrow. - Seriously? I really don't see how that could be a good idea. It'll reduce spending and affect the economy without a doubt.",
    options: [
      'It will reduce consumer spending and negatively impact the economy',
      'It will cause immediate widespread public sector redundancies',
      'It will lead to a drastic decrease in housing prices nationwide',
      'It will stimulate business investment and capital expenditure'
    ],
    correctIndex: 0,
    correctAnswer: 'It will reduce consumer spending and negatively impact the economy',
    explanation: 'Người phụ nữ nêu rõ việc tăng thuế sẽ giảm mức chi tiêu và tác động tiêu cực đến nền kinh tế ("reduce spending and affect the economy without a doubt").',
    explanationEn: 'Economic consequence: The woman argues that raising taxes will inevitably reduce spending and damage the wider economy.'
  },
  {
    id: 'med_lis_air_strike_train_t23',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: "Why does the impending air traffic controllers' strike cause no concern for the woman?",
    context: "Well, to be honest, I'm not really worried. I'm traveling by train for my holiday.",
    audioText: "Well, to be honest, I'm not really worried. I'm traveling by train for my holiday.",
    options: [
      'She is traveling by train for her holiday',
      'Her international flight departs from an unaffected private airfield',
      'Her vacation has been postponed until the following month',
      'She received written compensation guaranteeing her flight schedule'
    ],
    correctIndex: 0,
    correctAnswer: 'She is traveling by train for her holiday',
    explanation: 'Người phụ nữ không lo ngại cuộc đình công của kiểm soát viên không lưu vì cô ấy đi nghỉ bằng tàu hỏa ("I\'m traveling by train for my holiday").',
    explanationEn: 'Alternative transportation: The woman is unconcerned because she is taking the train rather than flying.'
  },
  {
    id: 'hard_lis_striker_valuation_t23',
    difficulty: 'hard',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is the man doubtful about the club paying £40 million for striker Reginaldo?',
    context: "That much? I can't seriously believe that. I really don't think he's as good as the experts say he is.",
    audioText: "That much? I can't seriously believe that. I really don't think he's as good as the experts say he is.",
    options: [
      "He believes the player's true abilities do not match the experts' exaggerated claims",
      'He is convinced Athletic have already exceeded their annual financial transfer cap',
      'He suspects the player has unresolved disciplinary and contract issues',
      'He believes the striker wants to transfer to an Italian championship team instead'
    ],
    correctIndex: 0,
    correctAnswer: "He believes the player's true abilities do not match the experts' exaggerated claims",
    explanation: 'Người đàn ông cho rằng cầu thủ không giỏi như các chuyên gia tán dương ("I really don\'t think he\'s as good as the experts say he is") nên mức giá 40 triệu bảng là không hợp lý.',
    explanationEn: 'Valuation skepticism: The man feels the player is overrated compared to media and expert claims.'
  },
  {
    id: 'easy_lis_dental_age_t23',
    difficulty: 'easy',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Which demographic group is offered free dental checkups in the newspaper report?',
    context: 'It says here in today\'s paper that the government is going to offer free dental checks to people over 60.',
    audioText: 'It says here in today\'s paper that the government is going to offer free dental checks to people over 60.',
    options: [
      'People aged 60 and above',
      'Primary school pupils under 12',
      'Full-time apprentice trainees',
      'All registered military veterans'
    ],
    correctIndex: 0,
    correctAnswer: 'People aged 60 and above',
    explanation: 'Báo chí đưa tin chính phủ sẽ cung cấp dịch vụ khám răng miễn phí cho người trên 60 tuổi ("people over 60").',
    explanationEn: 'Eligibility criterion: Free dental checks are specifically designated for individuals over 60 years old.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 24 COMPARING SPACE MISSIONS & PROJECT DECISIONS
  // ==========================================
  {
    id: 'easy_lis_mars_timeline_t24',
    difficulty: 'easy',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Dr. Thornton, why is the six-month timeline ideal for the students?',
    context: 'That would be ideal. Six months is just right for you. You could follow their progress and how the project develops.',
    audioText: 'That would be ideal. Six months is just right for you. You could follow their progress and how the project develops.',
    options: [
      'It allows them to track progress and observe how the project develops',
      'It coincides perfectly with their summer holiday break',
      'It is the shortest available project duration',
      'It guarantees immediate funding from the university'
    ],
    correctIndex: 0,
    correctAnswer: 'It allows them to track progress and observe how the project develops',
    explanation: 'Dr. Thornton nhận xét 6 tháng là lý tưởng vì sinh viên có thể theo dõi tiến độ và diễn biến của dự án ("follow their progress and how the project develops").',
    explanationEn: 'Duration justification: Six months enables students to observe continuous progress and project evolution.'
  },
  {
    id: 'med_lis_moon_mission_type_t24',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What key operational detail does the advisor clarify about the Chinese lunar expedition?',
    context: "I don't think they're sending any astronauts, I think it's just an expedition with robots and machines to find the best place to start a colony.",
    audioText: "I don't think they're sending any astronauts, I think it's just an expedition with robots and machines to find the best place to start a colony.",
    options: [
      'It is an unmanned robotic mission rather than a crewed flight',
      'It is a joint private venture with commercial space tourists',
      'It aims to retrieve samples of ice from deep lunar craters',
      'It has already completed its preliminary landing phase'
    ],
    correctIndex: 0,
    correctAnswer: 'It is an unmanned robotic mission rather than a crewed flight',
    explanation: 'Dr. Thornton giải thích nhiệm vụ không gửi phi hành gia mà là chuyến thám hiểm bằng robot và máy móc tự hành ("it\'s just an expedition with robots and machines").',
    explanationEn: 'Mission configuration: The Chinese lunar expedition operates autonomously using robots and machinery without human astronauts.'
  },
  {
    id: 'med_lis_lunar_colony_goal_t24',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the primary objective of the Chinese automated lunar expedition?',
    context: "I think it's just an expedition with robots and machines to find the best place to start a colony.",
    audioText: "I think it's just an expedition with robots and machines to find the best place to start a colony.",
    options: [
      'To locate the most viable site for establishing a future human settlement',
      'To salvage spare components from historic Apollo landing sites',
      'To install international deep-space solar telescope arrays',
      'To test high-speed magnetic train tracks in zero gravity'
    ],
    correctIndex: 0,
    correctAnswer: 'To locate the most viable site for establishing a future human settlement',
    explanation: 'Mục đích chính của nhiệm vụ là khảo sát tìm vị trí tối ưu để thành lập một khu định cư ("find the best place to start a colony").',
    explanationEn: 'Mission objective: Robotic equipment is tasked with identifying the optimum location to establish a colony.'
  },
  {
    id: 'hard_lis_advisor_arizona_priority_t24',
    difficulty: 'hard',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What specific research dimension does the advisor encourage the students to focus on?',
    context: "If you ask me, I'd prefer to see how a group of people get along living together in a difficult situation, like they'll be doing in Arizona in preparation for their trip.",
    audioText: "If you ask me, I'd prefer to see how a group of people get along living together in a difficult situation, like they'll be doing in Arizona in preparation for their trip.",
    options: [
      'How a team functions and coexists under stressful, isolated conditions',
      'The structural engineering of pressurized subterranean habitats',
      'The nutritional synthesis of artificial greenhouse food supplies',
      'The automated flight trajectory calculations for planetary transit'
    ],
    correctIndex: 0,
    correctAnswer: 'How a team functions and coexists under stressful, isolated conditions',
    explanation: 'Giảng viên khuyến khích sinh viên nghiên cứu cách một nhóm người sống chung hòa thuận trong hoàn cảnh khó khăn tại Arizona ("see how a group of people get along living together in a difficult situation").',
    explanationEn: 'Research priority: Dr. Thornton prioritizes the psychological and interpersonal dynamics of confined group cohabitation.'
  },
  {
    id: 'easy_lis_pluto_novelty_t24',
    difficulty: 'easy',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why does the student argue that Pluto represents a genuinely compelling research subject?',
    context: "I mean, no one has ever seen Pluto close up, and no one has tried to go to Mars, so I think they'd be more interesting expeditions to do.",
    audioText: "I mean, no one has ever seen Pluto close up, and no one has tried to go to Mars, so I think they'd be more interesting expeditions to do.",
    options: [
      'Humankind has never observed Pluto at close range before',
      'Pluto is confirmed to have active subterranean oceans',
      'It is the coldest planetary body known in the solar system',
      'The spacecraft travel time was completed in record time'
    ],
    correctIndex: 0,
    correctAnswer: 'Humankind has never observed Pluto at close range before',
    explanation: 'Nữ sinh lý giải sức hút của Pluto là bởi chưa ai từng được nhìn thấy hành tinh này ở cự ly gần ("no one has ever seen Pluto close up").',
    explanationEn: 'Scientific novelty: Pluto is unique because human probes have never observed it at close range.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 25 MARS SIMULATION CONTINGENCY PLAN
  // ==========================================
  {
    id: 'easy_lis_alfonso_role_t25',
    difficulty: 'easy',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What specific responsibility did Alfonso hold in the Arizona Mars habitat?',
    context: "Alfonso, the biologist. That means that they won't be able to monitor the plants they've been growing for food.",
    audioText: "Alfonso, the biologist. That means that they won't be able to monitor the plants they've been growing for food.",
    options: [
      'Serving as mission biologist overseeing food-producing crops',
      'Maintaining the high-pressure oxygen recirculation pumps',
      'Operating the radio telescope link to mission command',
      'Supervising rover trajectory calculations in the field'
    ],
    correctIndex: 0,
    correctAnswer: 'Serving as mission biologist overseeing food-producing crops',
    explanation: 'Dr. Thornton xác nhận Alfonso là nhà sinh vật học chịu trách nhiệm theo dõi các loại cây trồng phục vụ lương thực ("monitor the plants they\'ve been growing for food").',
    explanationEn: 'Mission responsibility: Alfonso was the dedicated biologist monitoring crops cultivated for food.'
  },
  {
    id: 'med_lis_simulation_no_entry_rule_t25',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What foundational protocol forbids dispatching a replacement into the Arizona habitat?',
    context: "Well, as you know, according to the rules of the project, no one else can come in once it's started, so they'll just have to make the best of it.",
    audioText: "Well, as you know, according to the rules of the project, no one else can come in once it's started, so they'll just have to make the best of it.",
    options: [
      'Simulation guidelines prohibit external arrivals once the trial begins',
      'Extreme desert dust storms have blocked access roads to the habitat',
      'The budget strictly caps astronaut personnel at nine members',
      'The local county sheriff restricted access to non-residents'
    ],
    correctIndex: 0,
    correctAnswer: 'Simulation guidelines prohibit external arrivals once the trial begins',
    explanation: 'Quy tắc của dự án cấm tuyệt đối người mới vào một khi nhiệm vụ đã bắt đầu ("no one else can come in once it\'s started").',
    explanationEn: 'Isolation protocol: The simulation strictly prohibits outside personnel once the mission is underway.'
  },
  {
    id: 'med_lis_carla_qualification_t25',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why does Maria argue that Carla is the most suitable participant to take over plant care?',
    context: "I think Carla would be the best person to take over. As chief medical officer, she's had training in biology.",
    audioText: "I think Carla would be the best person to take over. As chief medical officer, she's had training in biology.",
    options: [
      'She is the chief medical officer and has background training in biology',
      'She has the most free hours in her daily experiment roster',
      'She published several botanical papers prior to selection',
      'She volunteered immediately after Alfonso received the news'
    ],
    correctIndex: 0,
    correctAnswer: 'She is the chief medical officer and has background training in biology',
    explanation: 'Maria đề xuất Carla vì cô là bác sĩ trưởng ("chief medical officer") và từng được đào tạo về sinh học ("had training in biology").',
    explanationEn: 'Candidate credentials: Carla is chief medical officer and possesses academic training in biology.'
  },
  {
    id: 'hard_lis_cross_training_advantage_t25',
    difficulty: 'hard',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Dr. Thornton, what is the crucial strategic advantage of distributing the plant care duties across the entire crew?',
    context: "Maybe, but I personally think the best solution would be to share the work... they can make sure that if anything else happens to one of them, the others will have a good idea of what to do.",
    audioText: "Maybe, but I personally think the best solution would be to share the work... they can make sure that if anything else happens to one of them, the others will have a good idea of what to do.",
    options: [
      'It ensures operational redundancy so the crew can cope if another emergency strikes',
      'It frees Carla up to conduct daily psychological interviews',
      'It cuts daily required sleep cycles by thirty percent',
      'It allows all members to receive equal academic publication credit'
    ],
    correctIndex: 0,
    correctAnswer: 'It ensures operational redundancy so the crew can cope if another emergency strikes',
    explanation: 'Dr. Thornton lập luận việc chia sẻ công việc giúp toàn đội có năng lực ứng phó nếu một thành viên khác lại gặp sự cố bất ngờ ("if anything else happens to one of them, the others will have a good idea of what to do").',
    explanationEn: 'Operational redundancy: Cross-training guarantees collective contingency preparedness if another crew member is incapacitated.'
  },
  {
    id: 'easy_lis_simon_endorsement_t25',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What conclusion do the students and advisor ultimately converge upon regarding the vacant duties?',
    context: "Yeah, I agree with Dr. Thornton. That would be the best solution. But I'm sure they'll announce their plans later.",
    audioText: "Yeah, I agree with Dr. Thornton. That would be the best solution. But I'm sure they'll announce their plans later.",
    options: [
      'Simon explicitly endorses Dr. Thornton\'s recommendation to distribute the workload',
      'Maria persuades Dr. Thornton that Carla should lead the botanical lab alone',
      'The group agrees that an external supply drone must be requested',
      'Simon recommends postponing their student project until Alfonso returns'
    ],
    correctIndex: 0,
    correctAnswer: 'Simon explicitly endorses Dr. Thornton\'s recommendation to distribute the workload',
    explanation: 'Simon đồng tình hoàn toàn với Dr. Thornton rằng chia sẻ công việc là giải pháp tốt nhất ("Yeah, I agree with Dr. Thornton. That would be the best solution").',
    explanationEn: 'Consensus: Simon agrees that distributing the workload among the crew represents the optimal approach.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 26 MARS CREW PSYCHOLOGICAL CRISIS
  // ==========================================
  {
    id: 'easy_lis_joe_temperament_t26',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why does Maria find the news of Joe\'s aggressive conduct particularly astonishing?',
    context: "Really? But Joe's the quietest member of the crew. I can't believe he'd do that.",
    audioText: "Really? But Joe's the quietest member of the crew. I can't believe he'd do that.",
    options: [
      'He had earned the reputation of being the quietest member among the crew',
      'He had served as the conflict resolution mediator during pre-flight training',
      'He was scheduled to rotate back to Earth the following morning',
      'He had submitted a formal request for independent living quarters'
    ],
    correctIndex: 0,
    correctAnswer: 'He had earned the reputation of being the quietest member among the crew',
    explanation: 'Maria bất ngờ và không thể tin được vì Joe vốn là người trầm tính nhất trong cả đội ("Joe\'s the quietest member of the crew").',
    explanationEn: 'Unexpected aggression: Maria expresses disbelief because Joe was renowned as the quietest member of the crew.'
  },
  {
    id: 'med_lis_victim_martin_t26',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Who was the specific crew member targeted in the violent altercation inside the habitat?',
    context: "Did you hear about what happened on the Mars project in Arizona? Joe, the engineer, attacked Martin. It's on the news today.",
    audioText: "Did you hear about what happened on the Mars project in Arizona? Joe, the engineer, attacked Martin. It's on the news today.",
    options: [
      'Martin',
      'Alfonso',
      'Carla',
      'Dr. Thornton'
    ],
    correctIndex: 0,
    correctAnswer: 'Martin',
    explanation: 'Simon thông báo bản tin xác nhận Joe, kỹ sư, đã tấn công Martin ("Joe, the engineer, attacked Martin").',
    explanationEn: 'Altercation target: Simon explicitly mentions that Joe attacked Martin inside the Arizona habitat.'
  },
  {
    id: 'med_lis_root_cause_isolation_t26',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What underlying factor does Maria identify as the catalyst for the psychological crisis?',
    context: "Even though they'd practiced for an emergency, they couldn't prepare for the emotional problems that came from being in such a confined space for months.",
    audioText: "Even though they'd practiced for an emergency, they couldn't prepare for the emotional problems that came from being in such a confined space for months.",
    options: [
      'Emotional problems stemming from months of confinement in an isolated space',
      'Malfunction of the primary atmospheric oxygen recycling filters',
      'Irreconcilable disputes regarding daily geological workload allocation',
      'Contamination of the hydroponic water reservoir inside the dome'
    ],
    correctIndex: 0,
    correctAnswer: 'Emotional problems stemming from months of confinement in an isolated space',
    explanation: 'Maria chỉ ra nguyên nhân cốt lõi là các vấn đề cảm xúc và tâm lý khi bị giam cầm trong không gian chật hẹp suốt nhiều tháng ("emotional problems that came from being in such a confined space for months").',
    explanationEn: 'Underlying catalyst: Maria highlights emotional problems provoked by months of confinement in tight quarters.'
  },
  {
    id: 'hard_lis_inescapable_environment_t26',
    difficulty: 'hard',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Simon and Maria, why did the psychological tension escalate into a sudden explosion of violence?',
    context: "I suppose if you can't walk away from someone, tension builds up. Exactly. You can't escape, so you snap.",
    audioText: "I suppose if you can't walk away from someone, tension builds up. Exactly. You can't escape, so you snap.",
    options: [
      'Because participants cannot walk away or escape from one another, causing stress to accumulate until they snap',
      'Because mission directors refused to grant temporary communication blackouts with families',
      'Because emergency sedation supplies were depleted during the initial three weeks',
      'Because external media leaks created acute public pressure on the participants'
    ],
    correctIndex: 0,
    correctAnswer: 'Because participants cannot walk away or escape from one another, causing stress to accumulate until they snap',
    explanation: 'Hai bạn thảo luận rằng khi không thể rời đi hay trốn thoát khỏi người khác ("can\'t walk away", "can\'t escape"), căng thẳng sẽ tích tụ ("tension builds up") cho đến khi bùng nổ ("snap").',
    explanationEn: 'Escalation dynamics: Inability to walk away or escape causes interpersonal friction to compound until an individual snaps.'
  },
  {
    id: 'easy_lis_nature_of_attack_t26',
    difficulty: 'easy',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What specific role did Joe hold within the Arizona Mars research team?',
    context: "Joe, the engineer, attacked Martin. It's on the news today.",
    audioText: "Joe, the engineer, attacked Martin. It's on the news today.",
    options: [
      'The engineer',
      'The chief medical doctor',
      'The research botanist',
      'The mission commander'
    ],
    correctIndex: 0,
    correctAnswer: 'The engineer',
    explanation: 'Simon nêu rõ chức danh của Joe là kỹ sư ("Joe, the engineer").',
    explanationEn: 'Role identification: Simon specifies Joe\'s occupational role as "the engineer".'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 27 ENVIRONMENTAL ENGINEER & ISOLATION PSYCHOLOGY
  // ==========================================
  {
    id: 'easy_lis_tutor_role_t27',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What academic role and departmental affiliation does Dr. Thornton hold?',
    context: "Well, as a psychology tutor, I find that really interesting.",
    audioText: "Well, as a psychology tutor, I find that really interesting.",
    options: [
      'A psychology tutor',
      'An environmental engineer',
      'A planetary geologist',
      'An aerospace physician'
    ],
    correctIndex: 0,
    correctAnswer: 'A psychology tutor',
    explanation: 'Tiến sĩ Thornton xác nhận chức danh chuyên môn của mình là giảng viên tâm lý học ("as a psychology tutor").',
    explanationEn: 'Academic role identification: Dr. Thornton explicitly identifies herself as a psychology tutor.'
  },
  {
    id: 'med_lis_positive_three_months_t27',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why does Dr. Thornton consider the crew\'s emotional state relatively positive despite the recent conflict?',
    context: "In fact, this is the first time someone has got really angry in the first three months, so I think that's quite a positive thing.",
    audioText: "In fact, this is the first time someone has got really angry in the first three months, so I think that's quite a positive thing.",
    options: [
      'It is the first instance of severe anger during three full months of isolation',
      'The participants immediately volunteered to undergo group cognitive therapy',
      'The conflict resulted in zero physical damage to scientific laboratory hardware',
      'Both crew members agreed to swap their daily hydroponic cleaning shifts'
    ],
    correctIndex: 0,
    correctAnswer: 'It is the first instance of severe anger during three full months of isolation',
    explanation: 'Tiến sĩ Thornton nhận định đây là dấu hiệu tích cực vì phải sau 3 tháng đầu tiên mới có người thực sự tức giận ("first time someone has got really angry in the first three months").',
    explanationEn: 'Evaluation of progress: Dr. Thornton views the three-month delay before any severe anger flared as a positive milestone.'
  },
  {
    id: 'med_lis_joe_vital_responsibility_t27',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is it practically impossible to expel Joe from the Arizona Mars simulation?',
    context: "as the environmental engineer, Joe is an essential member of the team. If he left, then the whole environment of the building would go wrong.",
    audioText: "as the environmental engineer, Joe is an essential member of the team. If he left, then the whole environment of the building would go wrong.",
    options: [
      'As environmental engineer, the entire building ecosystem depends on him',
      'His departure would forfeit the project\'s university sponsorship grant',
      'He holds exclusive biometric authorization to open the outer habitat airlock',
      'No replacement personnel are allowed to enter the desert compound under any terms'
    ],
    correctIndex: 0,
    correctAnswer: 'As environmental engineer, the entire building ecosystem depends on him',
    explanation: 'Simon giải thích Joe là kỹ sư môi trường phụ trách vận hành tòa nhà, nếu anh đi thì toàn bộ môi trường trạm sẽ hỏng ("whole environment of the building would go wrong").',
    explanationEn: 'Critical operational dependency: Without Joe, the environmental engineer, the habitat life support system would fail.'
  },
  {
    id: 'hard_lis_ventilation_crisis_t27',
    difficulty: 'hard',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What critical mechanical crisis did Joe resolve during the previous month?',
    context: "Remember last month when the ventilation system broke down? They almost lost all their fresh air. He only had a couple of hours to fix it, and he managed to do it.",
    audioText: "Remember last month when the ventilation system broke down? They almost lost all their fresh air. He only had a couple of hours to fix it, and he managed to do it.",
    options: [
      'He repaired a failed ventilation system within a couple of hours, preventing total loss of fresh air',
      'He reprogrammed the hydroponic greenhouse watering schedule after an automated valve ruptured',
      'He restored external telecommunications before a severe desert sandstorm severed power cables'
    ],
    correctIndex: 0,
    correctAnswer: 'He repaired a failed ventilation system within a couple of hours, preventing total loss of fresh air',
    explanation: 'Tháng trước hệ thống thông gió hỏng và suýt làm mất sạch không khí tươi, Joe đã sửa thành công trong vòng vài giờ ("only had a couple of hours to fix it, and he managed to do it").',
    explanationEn: 'Past crisis resolution: Joe averted disaster by repairing the failed ventilation system in a couple of hours when fresh air was nearly depleted.'
  },
  {
    id: 'easy_lis_media_contrast_t27',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How does Maria distinguish their Mars research endeavor from entertainment media?',
    context: "we have to remember that this is a science project and not some soap opera or television series with lots of silly people locked up in a big house or something.",
    audioText: "we have to remember that this is a science project and not some soap opera or television series with lots of silly people locked up in a big house or something.",
    options: [
      'It is a genuine scientific investigation, not a commercial soap opera or reality television show',
      'It receives direct national funding rather than commercial network television advertising',
      'All dialogue inside the habitat is strictly confidential and exempt from public release'
    ],
    correctIndex: 0,
    correctAnswer: 'It is a genuine scientific investigation, not a commercial soap opera or reality television show',
    explanation: 'Maria nhấn mạnh dự án là một nghiên cứu khoa học ("science project") chứ không phải phim truyền hình hay chương trình thực tế giật gân ("not some soap opera or television series").',
    explanationEn: 'Project genre distinction: Maria insists the simulation is a scientific study rather than an entertainment drama or reality show.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 28 MARS SIMULATION PROJECT REVIEW
  // ==========================================
  {
    id: 'easy_lis_crew_completed_count_t28',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How many of the original ten participants successfully finished the full simulation project?',
    context: "Yes, I never thought that of the ten who started, only six would finish in the end, and it was really hard for them to get through the whole program.",
    audioText: "Yes, I never thought that of the ten who started, only six would finish in the end, and it was really hard for them to get through the whole program.",
    options: [
      'Six',
      'Ten',
      'Four',
      'Eight'
    ],
    correctIndex: 0,
    correctAnswer: 'Six',
    explanation: 'Maria cho biết trong số 10 người bắt đầu thì chỉ có 6 người hoàn tất chương trình ("of the ten who started, only six would finish in the end").',
    explanationEn: 'Direct factual retrieval: Maria confirms that only six participants out of ten completed the full project.'
  },
  {
    id: 'med_lis_budget_saving_t28',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What financial outcome was achieved relative to the original ten-million-dollar budget?',
    context: "Well, actually, it says here that the final cost was 9.5 million dollars, so they saved half a million in the end.",
    audioText: "Well, actually, it says here that the final cost was 9.5 million dollars, so they saved half a million in the end.",
    options: [
      'The project achieved a half-million-dollar savings, finishing at $9.5 million',
      'The budget suffered a two-million-dollar overrun due to emergency hardware fixes',
      'The total cost reached exactly twelve million dollars as Simon predicted',
      'The administration refunded five million dollars to commercial space investors'
    ],
    correctIndex: 0,
    correctAnswer: 'The project achieved a half-million-dollar savings, finishing at $9.5 million',
    explanation: 'Tiến sĩ Thornton xác nhận chi phí thực tế là 9,5 triệu đô la, tiết kiệm được nửa triệu USD ("saved half a million in the end").',
    explanationEn: 'Financial performance: Dr. Thornton reveals the final cost was $9.5 million, saving half a million dollars.'
  },
  {
    id: 'med_lis_simon_project_focus_t28',
    difficulty: 'medium',
    topic: 'technology',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the central focus of Simon\'s individual project report?',
    context: "Well, I've got lots of data on the environmental systems and life support, and that's the key focus of my project report, especially considering the events last week when the whole system came close to failing.",
    audioText: "Well, I've got lots of data on the environmental systems and life support, and that's the key focus of my project report, especially considering the events last week when the whole system came close to failing.",
    options: [
      'Environmental systems and life support data',
      'Nutritional biochemistry of hydroponic vegetables',
      'Satellite telemetry and planetary rover steering',
      'Legal arbitration protocols for space contractors'
    ],
    correctIndex: 0,
    correctAnswer: 'Environmental systems and life support data',
    explanation: 'Simon xác nhận trọng tâm báo cáo của mình là hệ thống môi trường và hỗ trợ sinh tồn ("environmental systems and life support").',
    explanationEn: 'Topic identification: Simon declares environmental systems and life support as his primary report focus.'
  },
  {
    id: 'hard_lis_future_trial_duration_t28',
    difficulty: 'hard',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What timeline duration are planners considering for the prospective follow-up isolation experiment?',
    context: "Depending on the results from this one, they're going to decide whether to have another one that will last a year.",
    audioText: "Depending on the results from this one, they're going to decide whether to have another one that will last a year.",
    options: [
      'A full year',
      'Six months',
      'Three years',
      'Eighteen months'
    ],
    correctIndex: 0,
    correctAnswer: 'A full year',
    explanation: 'Tiến sĩ Thornton thông báo ban tổ chức đang cân nhắc đợt thử nghiệm tiếp theo kéo dài trọn vẹn 1 năm ("last a year").',
    explanationEn: 'Prospective duration: Dr. Thornton mentions that the prospective follow-up trial will last a full year.'
  },
  {
    id: 'easy_lis_meeting_day_t28',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'On which day is the tutorial advisory session scheduled to convene next week?',
    context: "We can meet again next Wednesday, and I can help you structure it.",
    audioText: "We can meet again next Wednesday, and I can help you structure it.",
    options: [
      'Wednesday',
      'Friday',
      'Monday',
      'Thursday'
    ],
    correctIndex: 0,
    correctAnswer: 'Wednesday',
    explanation: 'Tiến sĩ Thornton hẹn gặp lại vào thứ Tư tuần sau ("next Wednesday").',
    explanationEn: 'Meeting schedule: Dr. Thornton arranges to meet next Wednesday.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 29 INTONATION, STRESS & SPEAKER ATTITUDE
  // ==========================================
  {
    id: 'easy_lis_mission_emotion_t29',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In item 1, which speaker conveys genuine awe and enthusiastic pride regarding the mission\'s success?',
    context: "1A: When the report came in to say the mission was a success, everyone felt that we'd seen something extraordinary.",
    audioText: "1A: When the report came in to say the mission was a success, everyone felt that we'd seen something extraordinary.",
    options: [
      'Speaker 1A',
      'Speaker 1B',
      'Both speakers convey equal emotional detachment',
      'Neither speaker expresses any positive evaluation'
    ],
    correctIndex: 0,
    correctAnswer: 'Speaker 1A',
    explanation: 'Người nói 1A sử dụng ngữ điệu luyến cao và nhấn mạnh biểu cảm vào "extraordinary", thể hiện sự khâm phục rõ ràng.',
    explanationEn: 'Prosodic analysis: Speaker 1A employs ascending pitch inflection and vowel stress on "extraordinary".'
  },
  {
    id: 'med_lis_disaster_gravity_t29',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In item 2, which speaker expresses profound sorrow and emotional gravity over the catastrophic loss of life?',
    context: "2B: The disaster was a dreadful tragedy, with a massive loss of life.",
    audioText: "2B: The disaster was a dreadful tragedy, with a massive loss of life.",
    options: [
      'Speaker 2B',
      'Speaker 2A',
      'Both speakers deliver an identical monotone reading',
      'Speaker 2A uses a lower, more mournful register'
    ],
    correctIndex: 0,
    correctAnswer: 'Speaker 2B',
    explanation: 'Người nói 2B kéo dài nguyên âm và ngắt nhịp chậm rãi trang nghiêm ở "dreadful tragedy" và "massive loss of life" để tạo cảm giác bi thương chân thật.',
    explanationEn: 'Emotive inflection: Speaker 2B uses lengthened vowels and low, somber resonance to communicate genuine mourning.'
  },
  {
    id: 'med_lis_anxiety_inflection_t29',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In item 3, what acoustic characteristic differentiates Speaker 3B\'s delivery from Speaker 3A?',
    context: "3B: I'm feeling pretty uncomfortable about the situation. I hope we can find a solution soon.",
    audioText: "3B: I'm feeling pretty uncomfortable about the situation. I hope we can find a solution soon.",
    options: [
      'A noticeable pitch peak and anxious inflection on "pretty uncomfortable"',
      'A completely silent pause between grammatical subject and verb',
      'An aggressive drop in vocal volume to an inaudible murmur',
      'A rhythmic clicking sound between adjective syllables'
    ],
    correctIndex: 0,
    correctAnswer: 'A noticeable pitch peak and anxious inflection on "pretty uncomfortable"',
    explanation: 'Người nói 3B có đỉnh cao độ vút lên ở "pretty uncomfortable", thể hiện sự lo âu và căng thẳng tâm lý.',
    explanationEn: 'Phonological feature: Speaker 3B displays an elevated pitch peak on "pretty uncomfortable" indicating acute anxiety.'
  },
  {
    id: 'hard_lis_stunning_admiration_t29',
    difficulty: 'hard',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In item 4, how does Speaker 4A signal authentic admiration compared to the indifferent delivery of 4B?',
    context: "4A: The results were stunning, and the team had done a marvelous job.",
    audioText: "4A: The results were stunning, and the team had done a marvelous job.",
    options: [
      'Through bright, ascending stress and energetic cadence across "stunning" and "marvelous"',
      'By whispering the closing noun phrase at low vocal amplitude',
      'By articulating the entire compound sentence at robotic monotone cadence',
      'By laughing sarcastically following the mention of the team'
    ],
    correctIndex: 0,
    correctAnswer: 'Through bright, ascending stress and energetic cadence across "stunning" and "marvelous"',
    explanation: 'Người nói 4A sử dụng ngữ điệu bừng sáng và nhấn âm cao vào "stunning" và "marvelous", thể hiện sự ngợi khen chân thành.',
    explanationEn: 'Acoustic feature: Speaker 4A employs bright, ascending pitch movement on evaluative adjectives "stunning" and "marvelous".'
  },
  {
    id: 'easy_lis_bizarre_emphasis_t29',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In item 6, which speaker uses dramatic stress and expressive pauses to communicate sheer incredulity?',
    context: "6B: This was such a bizarre event, and it's incredible that we haven't been able to find out what caused it.",
    audioText: "6B: This was such a bizarre event, and it's incredible that we haven't been able to find out what caused it.",
    options: [
      'Speaker 6B',
      'Speaker 6A',
      'Neither speaker',
      'Both speakers maintain neutral narration'
    ],
    correctIndex: 0,
    correctAnswer: 'Speaker 6B',
    explanation: 'Người nói 6B ngắt nhịp và nhấn rất mạnh vào "such a bizarre event" và "incredible" để diễn tả sự kinh ngạc trước bí ẩn.',
    explanationEn: 'Intonation contrast: Speaker 6B places prominent emphatic stress on "bizarre" and "incredible".'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 30 EVERYDAY TRANSPORT & TRAVEL CONVERSATIONS
  // ==========================================
  {
    id: 'easy_lis_bus_interval_t30',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Dialogue 1, what is the standard scheduled frequency of buses during this time of day?',
    promptVi: 'Theo Hội thoại 1, tần suất xe buýt chạy thông thường theo lịch trình là bao lâu một chuyến?',
    promptEn: 'According to Dialogue 1, what is the standard scheduled frequency of buses during this time of day?',
    context: 'Man: The buses are supposed to run every ten minutes, but I have already been waiting twenty minutes.',
    contextEn: 'Man: The buses are supposed to run every ten minutes, but I have already been waiting twenty minutes.',
    audioText: 'The buses are supposed to run every ten minutes, but I have already been waiting twenty minutes.',
    options: [
      'Every 10 minutes',
      'Every 20 minutes',
      'Every 30 minutes',
      'Every 15 minutes'
    ],
    optionsVi: [
      '10 phút một chuyến (Every 10 minutes)',
      '20 phút một chuyến (Every 20 minutes)',
      '30 phút một chuyến (Every 30 minutes)',
      '15 phút một chuyến (Every 15 minutes)'
    ],
    optionsEn: [
      'Every 10 minutes',
      'Every 20 minutes',
      'Every 30 minutes',
      'Every 15 minutes'
    ],
    correctIndex: 0,
    correctAnswer: 'Every 10 minutes',
    explanation: 'Bẫy thời gian: Xe buýt theo lịch trình chạy 10 phút một chuyến ("supposed to run every ten minutes"). Số 20 phút ("twenty minutes") là khoảng thời gian người đàn ông đã phải đứng chờ.',
    explanationEn: 'Distractor trap: Buses are scheduled to run every 10 minutes ("supposed to run every ten minutes"), whereas 20 minutes is how long the passenger has been waiting.'
  },
  {
    id: 'med_lis_train_replacement_bus_t30',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Dialogue 2, why are replacement buses being provided for passengers travelling to London?',
    promptVi: 'Trong Hội thoại 2, tại sao xe buýt thay thế được bố trí cho các hành khách đi London?',
    promptEn: 'In Dialogue 2, why are replacement buses being provided for passengers travelling to London?',
    context: 'Station Announcer: All trains to London have been cancelled due to an accident on the track. Replacement buses will be running from outside the station.',
    contextEn: 'Station Announcer: All trains to London have been cancelled due to an accident on the track. Replacement buses will be running from outside the station.',
    audioText: 'All trains to London have been cancelled due to an accident on the track. Replacement buses will be running from outside the station.',
    options: [
      'All rail services to London were cancelled following a track accident',
      'Severe fog across the southern counties forced rail operators to halt trains',
      'Scheduled weekend engineering maintenance closed the main rail line',
      'A power grid outage disabled the signaling equipment at the terminal'
    ],
    optionsVi: [
      'Tất cả tàu đi London bị hủy do xảy ra tai nạn trên đường ray',
      'Sương mù dày đặc ở các quận phía nam buộc nhà điều hành phải dừng tàu',
      'Đường ray chính phải đóng cửa để bảo trì kỹ thuật định kỳ cuối tuần',
      'Mất điện toàn lưới làm hỏng hệ thống thiết bị tín hiệu của ga'
    ],
    optionsEn: [
      'All rail services to London were cancelled following a track accident',
      'Severe fog across the southern counties forced rail operators to halt trains',
      'Scheduled weekend engineering maintenance closed the main rail line',
      'A power grid outage disabled the signaling equipment at the terminal'
    ],
    correctIndex: 0,
    correctAnswer: 'All rail services to London were cancelled following a track accident',
    explanation: 'Thông báo nhà ga nêu rõ các chuyến tàu đi London bị hủy do tai nạn trên đường ray ("due to an accident on the track"), do đó xe buýt thay thế được bố trí bên ngoài ga.',
    explanationEn: 'Direct factual retrieval: The station announcer clearly states that trains to London are cancelled due to a track accident, prompting the replacement bus service.'
  },
  {
    id: 'med_lis_bristol_motorway_fog_t30',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Dialogue 3, why did the speaker decide against driving to Bristol on the motorway?',
    promptVi: 'Trong Hội thoại 3, nguyên nhân người phụ nữ quyết định không lái ô tô đến Bristol qua đường cao tốc là gì?',
    promptEn: 'In Dialogue 3, why did the speaker decide against driving to Bristol on the motorway?',
    context: 'Woman: There was heavy fog and the radio reported huge jams on the M4, so I left the car at home and caught the train instead.',
    contextEn: 'Woman: There was heavy fog and the radio reported huge jams on the M4, so I left the car at home and caught the train instead.',
    audioText: 'There was heavy fog and the radio reported huge jams on the M4, so I left the car at home and caught the train instead.',
    options: [
      'Severe fog and massive traffic congestion on the M4 motorway',
      'Her personal car suffered unexpected engine trouble before departure',
      'The motorway toll charges were excessively expensive for a single trip',
      'Train ticket prices were heavily discounted for morning commuters'
    ],
    optionsVi: [
      'Sương mù dày đặc kết hợp ùn tắc giao thông nghiêm trọng trên cao tốc M4',
      'Ô tô cá nhân gặp trục trặc kỹ thuật động cơ đột xuất trước giờ khởi hành',
      'Mức phí trạm thu phí trên cao tốc quá đắt đỏ cho một chuyến đi lẻ',
      'Giá vé tàu hỏa vào buổi sáng được giảm giá sâu cho người đi làm'
    ],
    optionsEn: [
      'Severe fog and massive traffic congestion on the M4 motorway',
      'Her personal car suffered unexpected engine trouble before departure',
      'The motorway toll charges were excessively expensive for a single trip',
      'Train ticket prices were heavily discounted for morning commuters'
    ],
    correctIndex: 0,
    correctAnswer: 'Severe fog and massive traffic congestion on the M4 motorway',
    explanation: 'Người phụ nữ quyết định không lái xe vì có sương mù dày đặc và đài báo ùn tắc lớn trên cao tốc M4 ("heavy fog and the radio reported huge jams on the M4").',
    explanationEn: 'Causal reasoning: The speaker chose the train over driving because of heavy fog combined with massive traffic jams on the M4 motorway.'
  },
  {
    id: 'hard_lis_car_tomorrow_reason_t30',
    difficulty: 'hard',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Dialogue 4, why must the commuter take the car tomorrow instead of riding his bicycle?',
    promptVi: 'Trong Hội thoại 4, tại sao người đi làm lại phải lái ô tô vào ngày mai thay vì tiếp tục đạp xe?',
    promptEn: 'In Dialogue 4, why must the commuter take the car tomorrow instead of riding his bicycle?',
    context: 'Colleague: Cycling is great for fitness, but tomorrow I have to transport some heavy equipment, so I will definitely be driving.',
    contextEn: 'Colleague: Cycling is great for fitness, but tomorrow I have to transport some heavy equipment, so I will definitely be driving.',
    audioText: 'Cycling is great for fitness, but tomorrow I have to transport some heavy equipment, so I will definitely be driving.',
    options: [
      'He needs to transport heavy equipment that cannot be carried on a bicycle',
      'The weather forecast predicts intense rainstorms throughout the day',
      'His bicycle chain and gear mechanism require workshop servicing',
      'He has a medical appointment that leaves him too fatigued to cycle'
    ],
    optionsVi: [
      'Anh ấy cần vận chuyển một số thiết bị nặng không thể chở bằng xe đạp',
      'Dự báo thời tiết cảnh báo mưa dông dữ dội kéo dài suốt cả ngày',
      'Hệ thống xích và líp của chiếc xe đạp đang cần đem đi xưởng bảo dưỡng',
      'Anh ấy có lịch hẹn y tế khiến cơ thể quá kiệt sức để đạp xe'
    ],
    optionsEn: [
      'He needs to transport heavy equipment that cannot be carried on a bicycle',
      'The weather forecast predicts intense rainstorms throughout the day',
      'His bicycle chain and gear mechanism require workshop servicing',
      'He has a medical appointment that leaves him too fatigued to cycle'
    ],
    correctIndex: 0,
    correctAnswer: 'He needs to transport heavy equipment that cannot be carried on a bicycle',
    explanation: 'Người nói giải thích mặc dù đạp xe tốt cho sức khỏe nhưng ngày mai anh ấy phải chở thiết bị nặng ("transport some heavy equipment") nên buộc phải lái ô tô.',
    explanationEn: 'Specific condition check: Although he cycles today for fitness, tomorrow he must drive because he needs to transport heavy equipment.'
  },
  {
    id: 'easy_lis_motorbike_gap_t30',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Dialogue 5, what factor influenced the speaker to finally purchase a motorbike?',
    promptVi: 'Trong Hội thoại 5, yếu tố nào đã thúc đẩy người đàn ông quyết định mua một chiếc xe mô tô?',
    promptEn: 'In Dialogue 5, what factor influenced the speaker to finally purchase a motorbike?',
    context: 'Man: I had not ridden one for twenty years, but after retiring I decided to buy a vintage motorbike to tour the countryside.',
    contextEn: 'Man: I had not ridden one for twenty years, but after retiring I decided to buy a vintage motorbike to tour the countryside.',
    audioText: 'I had not ridden one for twenty years, but after retiring I decided to buy a vintage motorbike to tour the countryside.',
    options: [
      'Having more leisure time after retiring to tour the countryside',
      'Needing a faster vehicle to commute daily across heavy city traffic',
      'Inheriting a vintage motorcycle collection from a family relative',
      'Taking advantage of an urgent promotional clearance sale'
    ],
    optionsVi: [
      'Có nhiều thời gian thảnh thơi sau khi nghỉ hưu để đi phượt khám phá miền quê',
      'Cần một phương tiện di chuyển nhanh hơn qua các tuyến đường nội thành tắc nghẽn',
      'Được thừa kế bộ sưu tập xe máy cổ điển từ một người họ hàng trong gia đình',
      'Tận dụng chương trình giảm giá thanh lý đặc biệt tại cửa hàng đại lý xe'
    ],
    optionsEn: [
      'Having more leisure time after retiring to tour the countryside',
      'Needing a faster vehicle to commute daily across heavy city traffic',
      'Inheriting a vintage motorcycle collection from a family relative',
      'Taking advantage of an urgent promotional clearance sale'
    ],
    correctIndex: 0,
    correctAnswer: 'Having more leisure time after retiring to tour the countryside',
    explanation: 'Sau khi nghỉ hưu ("after retiring"), người đàn ông quyết định mua một chiếc xe mô tô cổ điển để đi phượt khám phá vùng quê.',
    explanationEn: 'Motivation identification: Retirement provided him with the opportunity and leisure time to buy a vintage motorbike and tour the countryside.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 31 TOWN TRANSPORT SYSTEM & PROJECT DISCUSSION
  // ==========================================
  {
    id: 'easy_lis_project_subject_t31',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Sophie, what is the principal subject of their collaborative student project?',
    promptVi: 'Theo Sophie, chủ đề chính của đề án hợp tác của hai sinh viên là gì?',
    promptEn: 'According to Sophie, what is the principal subject of their collaborative student project?',
    context: 'Sophie: So the main focus of the project is the transport system in the town.',
    contextEn: 'Sophie: So the main focus of the project is the transport system in the town.',
    audioText: 'So the main focus of the project is the transport system in the town.',
    options: [
      'The transport system in the town',
      'The architectural restoration of historic town monuments',
      'The construction of a suburban solar energy facility',
      'The water sanitation standards of municipal rivers'
    ],
    optionsVi: [
      'Hệ thống giao thông trong thị trấn',
      'Trùng tu kiến trúc các di tích lịch sử của thị trấn',
      'Xây dựng nhà máy năng lượng mặt trời ở ngoại ô',
      'Quy chuẩn vệ sinh nguồn nước sông ngòi đô thị'
    ],
    optionsEn: [
      'The transport system in the town',
      'The architectural restoration of historic town monuments',
      'The construction of a suburban solar energy facility',
      'The water sanitation standards of municipal rivers'
    ],
    correctIndex: 0,
    correctAnswer: 'The transport system in the town',
    explanation: 'Sophie mở đầu khẳng định rõ trọng tâm chính của đề án là hệ thống giao thông trong thị trấn ("the main focus of the project is the transport system in the town").',
    explanationEn: 'Direct statement identification: Sophie confirms at the outset that the main focus of their project is the transport system in the town.'
  },
  {
    id: 'med_lis_rail_budget_trouble_t31',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why is the railway operator considering downsizing staff and cutting service frequencies?',
    promptVi: 'Tại sao đơn vị vận hành đường sắt lại tính đến việc tinh giản nhân sự và giảm tần suất chuyến?',
    promptEn: 'Why is the railway operator considering downsizing staff and cutting service frequencies?',
    context: 'Male student: ...the rail company has been talking about reducing staff and services because of financial problems.',
    contextEn: 'Male student: ...the rail company has been talking about reducing staff and services because of financial problems.',
    audioText: '...the rail company has been talking about reducing staff and services because of financial problems.',
    options: [
      'Severe corporate financial problems and budget deficits',
      'A chronic shortage of qualified train locomotive engineers',
      'Protracted industrial union strikes shutting down maintenance depots',
      'Government regulatory caps prohibiting passenger transit expansion'
    ],
    optionsVi: [
      'Các vấn đề tài chính và thâm hụt ngân sách nghiêm trọng của công ty',
      'Tình trạng khan hiếm kéo dài các kỹ sư lái tàu hỏa có trình độ',
      'Các cuộc đình công kéo dài của công đoàn làm tê liệt xưởng bảo dưỡng',
      'Quy định hạn chế của chính phủ cấm mở rộng vận tải hành khách'
    ],
    optionsEn: [
      'Severe corporate financial problems and budget deficits',
      'A chronic shortage of qualified train locomotive engineers',
      'Protracted industrial union strikes shutting down maintenance depots',
      'Government regulatory caps prohibiting passenger transit expansion'
    ],
    correctIndex: 0,
    correctAnswer: 'Severe corporate financial problems and budget deficits',
    explanation: 'Nam sinh viên chỉ rõ lý do công ty đường sắt dự định cắt giảm là do các vấn đề tài chính ("because of financial problems").',
    explanationEn: 'Direct cause retrieval: The student explicitly identifies financial problems as the driver behind proposed rail staff and service cutbacks.'
  },
  {
    id: 'hard_lis_accident_paradox_t31',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What counter-intuitive factor explains the recent drop in the town’s road accident rate?',
    promptVi: 'Yếu tố nghịch lý nào giải thích cho sự sụt giảm tỷ lệ tai nạn giao thông đường bộ gần đây tại thị trấn?',
    promptEn: 'What counter-intuitive factor explains the recent drop in the town’s road accident rate?',
    context: 'Male student: True, but one good thing is that the road accident rate has been falling recently, partly due to the high volume of traffic on the roads. After all, when there\'s too much traffic, it moves more slowly, and fewer people, especially children, are in danger.',
    contextEn: 'Male student: True, but one good thing is that the road accident rate has been falling recently, partly due to the high volume of traffic on the roads. After all, when there\'s too much traffic, it moves more slowly, and fewer people, especially children, are in danger.',
    audioText: 'True, but one good thing is that the road accident rate has been falling recently, partly due to the high volume of traffic on the roads. After all, when there\'s too much traffic, it moves more slowly, and fewer people, especially children, are in danger.',
    options: [
      'Excessive traffic volume forces vehicles to crawl, thereby mitigating collision hazards',
      'New smart radar sensors along school zones immediately cite reckless drivers',
      'Mandatory defensive driving certification was imposed on commercial motorists',
      'Widespread adoption of automated pedestrian crosswalk safety gates'
    ],
    optionsVi: [
      'Lượng phương tiện quá đông buộc xe cộ phải bò chậm chạp, nhờ đó giảm nguy cơ va chạm',
      'Cảm biến radar thông minh mới quanh trường học xử phạt ngay tài xế bất cẩn',
      'Chứng chỉ lái xe phòng vệ bắt buộc được áp dụng cho tài xế thương mại',
      'Cổng chắn an toàn tự động dành cho người đi bộ qua đường được lắp đặt đại trà'
    ],
    optionsEn: [
      'Excessive traffic volume forces vehicles to crawl, thereby mitigating collision hazards',
      'New smart radar sensors along school zones immediately cite reckless drivers',
      'Mandatory defensive driving certification was imposed on commercial motorists',
      'Widespread adoption of automated pedestrian crosswalk safety gates'
    ],
    correctIndex: 0,
    correctAnswer: 'Excessive traffic volume forces vehicles to crawl, thereby mitigating collision hazards',
    explanation: 'Nghịch lý giao thông: Kẹt xe nghiêm trọng khiến tốc độ phương tiện chậm lại, dẫn đến ít người (nhất là trẻ em) gặp nguy hiểm va chạm hơn ("when there\'s too much traffic, it moves more slowly, and fewer people... are in danger").',
    explanationEn: 'Paradoxical causality: The student explains that excessive traffic congestion causes vehicles to travel slowly, thereby reducing danger to pedestrians and children.'
  },
  {
    id: 'med_lis_air_quality_illness_t31',
    difficulty: 'medium',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What respiratory illnesses does Sophie highlight when pointing out the consequences of degraded air quality?',
    promptVi: 'Những căn bệnh hô hấp nào được Sophie nêu bật khi chỉ ra hậu quả của việc chất lượng không khí suy thoái?',
    promptEn: 'What respiratory illnesses does Sophie highlight when pointing out the consequences of degraded air quality?',
    context: 'Sophie: I know children are safer, but the air quality is much worse. We don\'t want to have more medical problems like asthma and bronchitis, especially for children and older people.',
    contextEn: 'Sophie: I know children are safer, but the air quality is much worse. We don\'t want to have more medical problems like asthma and bronchitis, especially for children and older people.',
    audioText: 'I know children are safer, but the air quality is much worse. We don\'t want to have more medical problems like asthma and bronchitis, especially for children and older people.',
    options: [
      'Asthma and bronchitis among children and senior citizens',
      'Chronic allergic rhinitis and vocal cord nodules',
      'Pneumococcal infections and sudden middle-ear inflammation',
      'Occupational hypertension and circulatory thrombosis'
    ],
    optionsVi: [
      'Bệnh hen suyễn và viêm phế quản ở trẻ em và người cao tuổi',
      'Viêm mũi dị ứng mãn tính và hạt xơ dây thanh quản',
      'Nhiễm khuẩn phế cầu và viêm tai giữa cấp tính',
      'Cao huyết áp nghề nghiệp và huyết khối tuần hoàn'
    ],
    optionsEn: [
      'Asthma and bronchitis among children and senior citizens',
      'Chronic allergic rhinitis and vocal cord nodules',
      'Pneumococcal infections and sudden middle-ear inflammation',
      'Occupational hypertension and circulatory thrombosis'
    ],
    correctIndex: 0,
    correctAnswer: 'Asthma and bronchitis among children and senior citizens',
    explanation: 'Sophie cảnh báo nguy cơ ô nhiễm không khí gây ra bệnh hen suyễn và viêm phế quản ("medical problems like asthma and bronchitis, especially for children and older people").',
    explanationEn: 'Lexical medical detail: Sophie specifically cites asthma and bronchitis as the medical complications stemming from worsened air quality.'
  },
  {
    id: 'easy_lis_business_tardiness_t31',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In the male student’s concluding remarks, how does road gridlock directly affect local businesses?',
    promptVi: 'Trong nhận định kết luận của nam sinh viên, tình trạng ùn tắc giao thông ảnh hưởng trực tiếp đến các doanh nghiệp địa phương như thế nào?',
    promptEn: 'In the male student’s concluding remarks, how does road gridlock directly affect local businesses?',
    context: 'Male student: True. And when I think about it, I can see that the heavy traffic means that businesses lose money. People are late for work, and drivers get more stressed.',
    contextEn: 'Male student: True. And when I think about it, I can see that the heavy traffic means that businesses lose money. People are late for work, and drivers get more stressed.',
    audioText: 'True. And when I think about it, I can see that the heavy traffic means that businesses lose money. People are late for work, and drivers get more stressed.',
    options: [
      'They lose money because employees arrive late and workers suffer stress',
      'Corporate taxation rises sharply to fund emergency road widenings',
      'Customer parking spaces outside retail shops are eliminated',
      'Online ecommerce platforms dominate physical commercial storefronts'
    ],
    optionsVi: [
      'Họ bị thiệt hại tiền bạc vì nhân viên đi làm trễ và người lái xe bị căng thẳng',
      'Thuế doanh nghiệp tăng vọt để chi trả cho việc mở rộng đường khẩn cấp',
      'Chỗ đậu xe cho khách hàng bên ngoài các cửa hàng bán lẻ bị bãi bỏ',
      'Các nền tảng thương mại điện tử trực tuyến lấn át các mặt bằng vật lý'
    ],
    correctIndex: 0,
    correctAnswer: 'They lose money because employees arrive late and workers suffer stress',
    explanation: 'Nam sinh viên chỉ ra: "...heavy traffic means that businesses lose money. People are late for work, and drivers get more stressed."',
    explanationEn: 'Commercial impact: The student explicitly states that heavy traffic causes businesses to lose money due to tardy workers and driver stress.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 32 URBAN TRAFFIC HOTSPOTS & MAP ANALYSIS
  // ==========================================
  {
    id: 'easy_lis_town_hall_worst_t32',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to official statistics cited by Sophie, which site is identified as the single worst traffic area in town?',
    promptVi: 'Theo số liệu thống kê chính thức được Sophie trích dẫn, địa điểm nào là khu vực kẹt xe tồi tệ nhất trong thị trấn?',
    promptEn: 'According to official statistics cited by Sophie, which site is identified as the single worst traffic area in town?',
    context: 'Sophie: Statistics show that the worst place is by the Town Hall.',
    contextEn: 'Sophie: Statistics show that the worst place is by the Town Hall.',
    audioText: 'Statistics show that the worst place is by the Town Hall.',
    options: [
      'By the Town Hall',
      'By the Arts Centre',
      'At the main roundabout',
      'Outside the suburban railway station'
    ],
    optionsVi: [
      'Khu vực Tòa thị chính',
      'Khu vực Trung tâm Nghệ thuật',
      'Tại bùng binh vòng xuyến chính',
      'Bên ngoài nhà ga đường sắt ngoại ô'
    ],
    optionsEn: [
      'By the Town Hall',
      'By the Arts Centre',
      'At the main roundabout',
      'Outside the suburban railway station'
    ],
    correctIndex: 0,
    correctAnswer: 'By the Town Hall',
    explanation: 'Sophie chỉ ra: "Statistics show that the worst place is by the Town Hall."',
    explanationEn: 'Direct statistical confirmation: Sophie points out that statistics prove the Town Hall is the worst location.'
  },
  {
    id: 'med_lis_cinema_junction_t32',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'At which specific intersection is the Starview Cinema located according to Sophie?',
    promptVi: 'Theo Sophie, rạp chiếu phim Starview Cinema tọa lạc tại nút giao cụ thể nào?',
    promptEn: 'At which specific intersection is the Starview Cinema located according to Sophie?',
    context: 'Sophie: Well, in actual fact, it\'s by the junction of East Road and Station Road. That\'s where the traffic has been getting really bad...',
    contextEn: 'Sophie: Well, in actual fact, it\'s by the junction of East Road and Station Road. That\'s where the traffic has been getting really bad...',
    audioText: 'Well, in actual fact, it\'s by the junction of East Road and Station Road. That\'s where the traffic has been getting really bad...',
    options: [
      'At the junction of East Road and Station Road',
      'Directly circling the central town roundabout',
      'Next to the eastern bus terminal entrance gate',
      'On the corner of Scottsfield Avenue and High Street'
    ],
    optionsVi: [
      'Tại ngã tư giữa đường East Road và Station Road',
      'Trực tiếp bao quanh vòng xuyến trung tâm thị trấn',
      'Cạnh cổng vào của bến xe buýt phía đông',
      'Ở góc đường giữa đại lộ Scottsfield và High Street'
    ],
    optionsEn: [
      'At the junction of East Road and Station Road',
      'Directly circling the central town roundabout',
      'Next to the eastern bus terminal entrance gate',
      'On the corner of Scottsfield Avenue and High Street'
    ],
    correctIndex: 0,
    correctAnswer: 'At the junction of East Road and Station Road',
    explanation: 'Sophie khẳng định vị trí chính xác: "...in actual fact, it\'s by the junction of East Road and Station Road."',
    explanationEn: 'Spatial verification: Sophie clarifies that the cinema stands at the junction of East Road and Station Road.'
  },
  {
    id: 'hard_lis_bus_manoeuvre_issue_t32',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why do public buses coming from the railway station face severe morning delays?',
    promptVi: 'Tại sao xe buýt công cộng đi từ nhà ga xe lửa lại gặp tình trạng chậm trễ nghiêm trọng vào buổi sáng?',
    promptEn: 'Why do public buses coming from the railway station face severe morning delays?',
    context: 'Sophie: It\'s especially bad for the buses coming from the station, as they can\'t turn right into East Road to get to the center.',
    contextEn: 'Sophie: It\'s especially bad for the buses coming from the station, as they can\'t turn right into East Road to get to the center.',
    audioText: 'It\'s especially bad for the buses coming from the station, as they can\'t turn right into East Road to get to the center.',
    options: [
      'They are physically prevented from turning right into East Road to reach the center',
      'Their automated ticketing validation consoles fail frequently during morning moisture',
      'The rail station forecourt has been restricted to licensed taxicabs only',
      'Bridge weight restrictions prohibit double-decker buses from crossing the river'
    ],
    optionsVi: [
      'Xe buýt bị cản trở không thể rẽ phải vào đường East Road để tiến về trung tâm',
      'Đầu đọc vé tự động thường xuyên bị lỗi khi gặp độ ẩm buổi sáng',
      'Khuôn viên nhà ga chỉ giới hạn cho taxi có giấy phép ra vào',
      'Giới hạn tải trọng cầu cấm xe buýt hai tầng đi qua sông'
    ],
    optionsEn: [
      'They are physically prevented from turning right into East Road to reach the center',
      'Their automated ticketing validation consoles fail frequently during morning moisture',
      'The rail station forecourt has been restricted to licensed taxicabs only',
      'Bridge weight restrictions prohibit double-decker buses from crossing the river'
    ],
    correctIndex: 0,
    correctAnswer: 'They are physically prevented from turning right into East Road to reach the center',
    explanation: 'Sophie giải thích khó khăn thao tác: "...as they can\'t turn right into East Road to get to the center."',
    explanationEn: 'Manoeuvre bottleneck: Buses are unable to turn right into East Road to head into the town center.'
  },
  {
    id: 'med_lis_central_park_lorries_t32',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What factor makes the Town Hall side of Central Park notably more congested than the shopping centre side?',
    promptVi: 'Yếu tố nào khiến phía Tòa thị chính cạnh Central Park bị ùn tắc đáng kể hơn so với phía trung tâm mua sắm?',
    promptEn: 'What factor makes the Town Hall side of Central Park notably more congested than the shopping centre side?',
    context: 'Sophie: ...it\'s particularly bad on the Town Hall side, with all the heavy lorries coming into the center from the industrial estate on the west side of town. They usually make their deliveries in the morning rush hour.',
    contextEn: 'Sophie: ...it\'s particularly bad on the Town Hall side, with all the heavy lorries coming into the center from the industrial estate on the west side of town. They usually make their deliveries in the morning rush hour.',
    audioText: '...it\'s particularly bad on the Town Hall side, with all the heavy lorries coming into the center from the industrial estate on the west side of town. They usually make their deliveries in the morning rush hour.',
    options: [
      'Heavy freight lorries from the western industrial estate making morning rush-hour deliveries',
      'A high volume of student pedestrians crossing to the nearby municipal college',
      'Frequent parade processions and civic ceremonies closing primary road lanes',
      'Severe lack of traffic signals at the roundabout perimeter'
    ],
    optionsVi: [
      'Xe tải chở hàng hạng nặng từ khu công nghiệp phía tây giao hàng dồn dập trong giờ cao điểm sáng',
      'Lượng lớn sinh viên đi bộ băng qua đường để đến trường cao đẳng gần đó',
      'Các đoàn diễu hành và nghi lễ thường xuyên làm đóng các làn đường chính',
      'Thiếu hụt trầm trọng hệ thống đèn tín hiệu giao thông quanh vòng xuyến'
    ],
    optionsEn: [
      'Heavy freight lorries from the western industrial estate making morning rush-hour deliveries',
      'A high volume of student pedestrians crossing to the nearby municipal college',
      'Frequent parade processions and civic ceremonies closing primary road lanes',
      'Severe lack of traffic signals at the roundabout perimeter'
    ],
    correctIndex: 0,
    correctAnswer: 'Heavy freight lorries from the western industrial estate making morning rush-hour deliveries',
    explanation: 'Sophie chỉ ra nguyên nhân là xe tải hạng nặng đến từ khu công nghiệp phía tây giao hàng vào giờ cao điểm sáng.',
    explanationEn: 'Freight congestion trigger: Sophie specifies heavy lorries from the western industrial estate making morning rush hour deliveries.'
  },
  {
    id: 'easy_lis_lorry_restriction_solution_t32',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What proposal does Robert infer would effectively alleviate traffic around Central Park and the Town Hall?',
    promptVi: 'Robert suy luận đề xuất nào sẽ giúp giảm nhẹ hiệu quả tình trạng kẹt xe quanh Central Park và Tòa thị chính?',
    promptEn: 'What proposal does Robert infer would effectively alleviate traffic around Central Park and the Town Hall?',
    context: 'Robert: So you\'re saying that if we stop them coming in early to the area by Central Park where the Town Hall is, that would make the traffic a lot lighter? Sophie: I\'m sure it would.',
    contextEn: 'Robert: So you\'re saying that if we stop them coming in early to the area by Central Park where the Town Hall is, that would make the traffic a lot lighter? Sophie: I\'m sure it would.',
    audioText: 'So you\'re saying that if we stop them coming in early to the area by Central Park where the Town Hall is, that would make the traffic a lot lighter? Sophie: I\'m sure it would.',
    options: [
      'Restricting heavy delivery lorries from entering the Central Park and Town Hall area early in the morning',
      'Tearing down the older peripheral park wall to construct four wider express vehicle lanes',
      'Imposing a high congestion tax charge on all private diesel passenger motor cars',
      'Permanently closing down all manufacturing operations in the western industrial estate'
    ],
    optionsVi: [
      'Cấm các xe tải giao hàng nặng tiến vào khu vực Central Park và Tòa thị chính vào sáng sớm',
      'Phá bỏ tường rào công viên cũ để xây thêm bốn làn đường cao tốc rộng hơn',
      'Áp mức phí chống ùn tắc rất cao đối với mọi xe ô tô cá nhân chạy dầu diesel',
      'Đóng cửa vĩnh viễn toàn bộ hoạt động sản xuất trong khu công nghiệp phía tây'
    ],
    optionsEn: [
      'Restricting heavy delivery lorries from entering the Central Park and Town Hall area early in the morning',
      'Tearing down the older peripheral park wall to construct four wider express vehicle lanes',
      'Imposing a high congestion tax charge on all private diesel passenger motor cars',
      'Permanently closing down all manufacturing operations in the western industrial estate'
    ],
    correctIndex: 0,
    correctAnswer: 'Restricting heavy delivery lorries from entering the Central Park and Town Hall area early in the morning',
    explanation: 'Robert suy luận và Sophie đồng tình rằng nếu ngăn xe tải vào sớm quanh Central Park nơi có Tòa thị chính thì giao thông sẽ nhẹ nhàng hơn nhiều.',
    explanationEn: 'Solution deduction: Restricting early morning lorry access near Central Park and the Town Hall makes traffic much lighter.'
  },
  // ==========================================
  // LISTENING DRILLS: TRACK 33 TRANSPORT PROPOSALS & FEASIBILITY EVALUATION
  // ==========================================
  {
    id: 'easy_lis_bus_lane_displacement_t33',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Sophie, why can dedicated bus and cycle lanes inadvertently worsen local traffic?',
    promptVi: 'Theo Sophie, tại sao làn đường dành riêng cho xe buýt và xe đạp lại vô tình khiến giao thông địa phương tồi tệ hơn?',
    promptEn: 'According to Sophie, why can dedicated bus and cycle lanes inadvertently worsen local traffic?',
    context: 'Sophie: ...car traffic tends to go off into the areas around town where people live, and that causes more traffic in places where there haven\'t been problems before. Drivers think they can find emptier roads in residential areas, and it just sends the problem there instead.',
    contextEn: 'Sophie: ...car traffic tends to go off into the areas around town where people live, and that causes more traffic in places where there haven\'t been problems before. Drivers think they can find emptier roads in residential areas, and it just sends the problem there instead.',
    audioText: '...car traffic tends to go off into the areas around town where people live, and that causes more traffic in places where there haven\'t been problems before. Drivers think they can find emptier roads in residential areas, and it just sends the problem there instead.',
    options: [
      'Motorists divert into residential areas to seek emptier roads, creating new congestion',
      'Buses and bicycles frequently collide on narrow roadway shoulders',
      'Street sweepers cannot access segregated lanes during regular night shifts',
      'Emergency fire trucks cannot legally cross solid white bus-lane dividers'
    ],
    optionsVi: [
      'Người lái ô tô chuyển hướng vào các khu dân cư để tìm đường vắng hơn, tạo ra điểm nghẽn mới',
      'Xe buýt và xe đạp thường xuyên va chạm trên lề đường hẹp',
      'Xe quét đường không thể tiếp cận các làn đường tách biệt trong ca đêm',
      'Xe cứu hỏa không được phép vượt qua vạch phân cách trắng liền mạch của làn xe buýt'
    ],
    optionsEn: [
      'Motorists divert into residential areas to seek emptier roads, creating new congestion',
      'Buses and bicycles frequently collide on narrow roadway shoulders',
      'Street sweepers cannot access segregated lanes during regular night shifts',
      'Emergency fire trucks cannot legally cross solid white bus-lane dividers'
    ],
    correctIndex: 0,
    correctAnswer: 'Motorists divert into residential areas to seek emptier roads, creating new congestion',
    explanation: 'Sophie giải thích: ô tô sẽ chuyển hướng vào khu dân cư ("residential areas") để tìm đường thoáng hơn, làm phát sinh kẹt xe ở nơi trước giờ chưa từng có.',
    explanationEn: 'Traffic displacement: Drivers attempt to find emptier streets in residential areas, shifting congestion into previously quiet neighborhoods.'
  },
  {
    id: 'med_lis_park_ride_takeup_t33',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What principal shortcoming of park-and-ride schemes does Robert identify?',
    promptVi: 'Khuyết điểm chủ yếu của mô hình park-and-ride được Robert chỉ ra là gì?',
    promptEn: 'What principal shortcoming of park-and-ride schemes does Robert identify?',
    context: 'Robert: The main problem is lack of take-up. Drivers just don\'t use them. A lot of these car parks stay empty for a long time, and the buses are often less than half full.',
    contextEn: 'Robert: The main problem is lack of take-up. Drivers just don\'t use them. A lot of these car parks stay empty for a long time, and the buses are often less than half full.',
    audioText: 'The main problem is lack of take-up. Drivers just don\'t use them. A lot of these car parks stay empty for a long time, and the buses are often less than half full.',
    options: [
      'A lack of take-up, leaving car parks vacant and shuttle buses under-utilized',
      'Excessive commuter ticket prices charged by private transit subcontractors',
      'Vandalism and car theft occurring in remote edge-of-town parking lots',
      'A shortage of licensed shuttle bus drivers during weekend shopping hours'
    ],
    optionsVi: [
      'Tỷ lệ người dùng thấp, khiến bãi đỗ bị bỏ trống và xe buýt trung chuyển vắng khách',
      'Giá vé trung chuyển quá đắt đỏ do các nhà thầu tư nhân áp đặt',
      'Nạn phá hoại và trộm cắp ô tô xảy ra tại các bãi đỗ xe hẻo lánh ven đô',
      'Tình trạng thiếu hụt tài xế xe buýt có bằng lái vào các khung giờ mua sắm cuối tuần'
    ],
    optionsEn: [
      'A lack of take-up, leaving car parks vacant and shuttle buses under-utilized',
      'Excessive commuter ticket prices charged by private transit subcontractors',
      'Vandalism and car theft occurring in remote edge-of-town parking lots',
      'A shortage of licensed shuttle bus drivers during weekend shopping hours'
    ],
    correctIndex: 0,
    correctAnswer: 'A lack of take-up, leaving car parks vacant and shuttle buses under-utilized',
    explanation: 'Robert nhấn mạnh: "The main problem is lack of take-up. Drivers just don\'t use them. A lot of these car parks stay empty for a long time, and the buses are often less than half full."',
    explanationEn: 'Underutilization finding: Robert specifies that a lack of public take-up leaves car parks empty and buses running less than half full.'
  },
  {
    id: 'hard_lis_pedestrian_delivery_threat_t33',
    difficulty: 'hard',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why could fully pedestrianizing the town center shopping district drive some retailers out of business?',
    promptVi: 'Tại sao việc chuyển đổi hoàn toàn khu mua sắm trung tâm thị trấn thành phố đi bộ có thể khiến một số cửa hàng bị phá sản?',
    promptEn: 'Why could fully pedestrianizing the town center shopping district drive some retailers out of business?',
    context: 'Robert: ...the biggest problem would actually be with the shops themselves. It\'s fine to stop traffic around the shopping areas, but there would be huge problems with deliveries. Some shops could go out of business if they have difficulty getting lorries in with their goods.',
    contextEn: 'Robert: ...the biggest problem would actually be with the shops themselves. It\'s fine to stop traffic around the shopping areas, but there would be huge problems with deliveries. Some shops could go out of business if they have difficulty getting lorries in with their goods.',
    audioText: '...the biggest problem would actually be with the shops themselves. It\'s fine to stop traffic around the shopping areas, but there would be huge problems with deliveries. Some shops could go out of business if they have difficulty getting lorries in with their goods.',
    options: [
      'Severe freight delivery restrictions would prevent lorries from stocking shops with goods',
      'Shoppers will refuse to walk without motorized wheelchair shuttle carts',
      'Street musicians and unauthorized hawkers will crowd retail storefront entrances',
      'Retail property taxes will be quadrupled to finance pedestrian cobblestone paving'
    ],
    optionsVi: [
      'Hạn chế giao hàng nghiêm ngặt sẽ ngăn xe tải tiếp tế hàng hóa cho các cửa hàng',
      'Người mua sắm từ chối đi bộ nếu không có xe điện đưa đón',
      'Nghệ sĩ đường phố và người bán hàng rong sẽ tụ tập chắn kín cửa hàng',
      'Thuế bất động sản bán lẻ sẽ tăng gấp bốn lần để chi trả tiền lát đá vỉa hè'
    ],
    optionsEn: [
      'Severe freight delivery restrictions would prevent lorries from stocking shops with goods',
      'Shoppers will refuse to walk without motorized wheelchair shuttle carts',
      'Street musicians and unauthorized hawkers will crowd retail storefront entrances',
      'Retail property taxes will be quadrupled to finance pedestrian cobblestone paving'
    ],
    correctIndex: 0,
    correctAnswer: 'Severe freight delivery restrictions would prevent lorries from stocking shops with goods',
    explanation: 'Robert chỉ ra: cấm xe sẽ gây ra vấn đề lớn cho việc giao hàng của xe tải ("huge problems with deliveries"), khiến một số cửa hàng có thể phá sản ("go out of business").',
    explanationEn: 'Supply chain disruption: Robert warns that delivery lorries would face severe obstacles bringing in goods, threatening retailers\' commercial viability.'
  },
  {
    id: 'med_lis_tram_network_scope_t33',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What track layout does Sophie outline for the proposed municipal tram system?',
    promptVi: 'Quy hoạch tuyến ray nào được Sophie vạch ra cho hệ thống tàu điện tramway được đề xuất của thị trấn?',
    promptEn: 'What track layout does Sophie outline for the proposed municipal tram system?',
    context: 'Sophie: We\'ll have to lay down a new line through the center of town, and also from north to south. It\'s quite a popular solution to traffic problems.',
    contextEn: 'Sophie: We\'ll have to lay down a new line through the center of town, and also from north to south. It\'s quite a popular solution to traffic problems.',
    audioText: 'We\'ll have to lay down a new line through the center of town, and also from north to south. It\'s quite a popular solution to traffic problems.',
    options: [
      'A new rail line running through the town center and connecting from north to south',
      'A circular orbital loop encircling the outer edge of the residential suburbs',
      'A dedicated spur linking the industrial district directly to the maritime cargo port',
      'An underground subway line connecting the northern hills to the southern riverbank'
    ],
    optionsVi: [
      'Một tuyến đường ray mới chạy xuyên qua trung tâm thị trấn và kết nối thông suốt từ bắc xuống nam',
      'Một vòng cung khép kín bao quanh rìa ngoài các khu dân cư ngoại ô',
      'Một tuyến nhánh chuyên dụng nối khu công nghiệp thẳng đến cảng hàng hải',
      'Một tuyến tàu điện ngầm nối các ngọn đồi phía bắc với bờ sông phía nam'
    ],
    optionsEn: [
      'A new rail line running through the town center and connecting from north to south',
      'A circular orbital loop encircling the outer edge of the residential suburbs',
      'A dedicated spur linking the industrial district directly to the maritime cargo port',
      'An underground subway line connecting the northern hills to the southern riverbank'
    ],
    correctIndex: 0,
    correctAnswer: 'A new rail line running through the town center and connecting from north to south',
    explanation: 'Sophie nêu rõ: "We\'ll have to lay down a new line through the center of town, and also from north to south."',
    explanationEn: 'Route description: Sophie explains the tram line will run through the center of town and connect from north to south.'
  },
  {
    id: 'easy_lis_tram_council_budget_t33',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What financial conclusion does Robert reach regarding the viability of a new tram system?',
    promptVi: 'Robert đưa ra kết luận tài chính nào liên quan đến tính khả thi của hệ thống tàu điện tram mới?',
    promptEn: 'What financial conclusion does Robert reach regarding the viability of a new tram system?',
    context: 'Robert: ...the main problem with that kind of project is the expense. The initial financial requirements would be huge, and so would the maintenance expenses. It might well be far more than the council is prepared to spend on a solution.',
    contextEn: 'Robert: ...the main problem with that kind of project is the expense. The initial financial requirements would be huge, and so would the maintenance expenses. It might well be far more than the council is prepared to spend on a solution.',
    audioText: '...the main problem with that kind of project is the expense. The initial financial requirements would be huge, and so would the maintenance expenses. It might well be far more than the council is prepared to spend on a solution.',
    options: [
      'The combined capital installation and maintenance costs exceed the council\'s budget',
      'Ticket revenues will easily cover debt financing within three operating fiscal years',
      'Federal government grants will subsidize ninety percent of total civil engineering works',
      'Local businesses have offered to underwrite the annual maintenance deficit'
    ],
    optionsVi: [
      'Tổng chi phí đầu tư ban đầu và chi phí bảo trì vượt quá ngân sách hội đồng sẵn sàng chi',
      'Doanh thu bán vé sẽ dễ dàng bù đắp nợ vay trong vòng ba năm tài chính vận hành',
      'Trợ cấp chính phủ liên bang sẽ chi trả 90% tổng chi phí xây dựng hạ tầng kỹ thuật',
      'Các doanh nghiệp địa phương đã đề nghị bảo lãnh thâm hụt bảo trì hàng năm'
    ],
    optionsEn: [
      'The combined capital installation and maintenance costs exceed the council\'s budget',
      'Ticket revenues will easily cover debt financing within three operating fiscal years',
      'Federal government grants will subsidize ninety percent of total civil engineering works',
      'Local businesses have offered to underwrite the annual maintenance deficit'
    ],
    correctIndex: 0,
    correctAnswer: 'The combined capital installation and maintenance costs exceed the council\'s budget',
    explanation: 'Robert nhấn mạnh: chi phí ban đầu và bảo trì khổng lồ vượt xa những gì hội đồng thị trấn sẵn sàng chi trả ("far more than the council is prepared to spend").',
    explanationEn: 'Budget constraint: Robert notes that initial and maintenance expenses are likely far more than the council is prepared to spend.'
  },

  // ==========================================
  // LISTENING DRILLS: TRACK 34 TRANSPORT PROJECT COST ANALYSIS & BUDGET ESTIMATION
  // ==========================================
  {
    id: 'easy_lis_tram_max_cost_t34',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the maximum targeted expenditure cap for the entire new tram network?',
    promptVi: 'Mức trần chi phí mục tiêu tối đa cho toàn bộ mạng lưới tàu điện mới là bao nhiêu?',
    promptEn: 'What is the maximum targeted expenditure cap for the entire new tram network?',
    context: "Robert: And what does it all come to? Sophie: No less than 30 million pounds in the end. At least that's what they need to try to keep the cost down to.",
    contextEn: "Robert: And what does it all come to? Sophie: No less than 30 million pounds in the end. At least that's what they need to try to keep the cost down to.",
    audioText: "And what does it all come to? No less than 30 million pounds in the end. At least that's what they need to try to keep the cost down to.",
    options: [
      'No less than 30 million pounds',
      'Approximately 20 million pounds',
      'Between 12 and 15 million pounds',
      'Exactly 25 million pounds'
    ],
    optionsVi: [
      'Không dưới 30 triệu bảng',
      'Khoảng 20 triệu bảng',
      'Trong khoảng từ 12 đến 15 triệu bảng',
      'Chính xác 25 triệu bảng'
    ],
    optionsEn: [
      'No less than 30 million pounds',
      'Approximately 20 million pounds',
      'Between 12 and 15 million pounds',
      'Exactly 25 million pounds'
    ],
    correctIndex: 0,
    correctAnswer: 'No less than 30 million pounds',
    explanation: 'Sophie xác nhận: con số tổng kết của toàn bộ dự án tàu điện là không dưới 30 triệu bảng ("No less than 30 million pounds in the end").',
    explanationEn: 'Capital expenditure ceiling: Sophie states the tram project total will be "no less than 30 million pounds in the end".'
  },
  {
    id: 'med_lis_bus_lane_total_t34',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the overall projected cost of implementing the bus and cycle lanes scheme?',
    promptVi: 'Tổng chi phí dự kiến cho việc triển khai đề án làn xe buýt và xe đạp là bao nhiêu?',
    promptEn: 'What is the overall projected cost of implementing the bus and cycle lanes scheme?',
    context: "Sophie: They estimate around 8 million pounds to set up the signs, paint the roads, and so on, and at least another 2 million pounds or so to make other changes. Robert: So you're saying it's around 10 million pounds. That seems quite reasonable.",
    contextEn: "Sophie: They estimate around 8 million pounds to set up the signs, paint the roads, and so on, and at least another 2 million pounds or so to make other changes. Robert: So you're saying it's around 10 million pounds. That seems quite reasonable.",
    audioText: "They estimate around 8 million pounds to set up the signs, paint the roads, and so on, and at least another 2 million pounds or so to make other changes. So you're saying it's around 10 million pounds. That seems quite reasonable.",
    options: [
      'Around 10 million pounds',
      'Around 8 million pounds',
      'Around 2 million pounds',
      'Around 15 million pounds'
    ],
    optionsVi: [
      'Khoảng 10 triệu bảng',
      'Khoảng 8 triệu bảng',
      'Khoảng 2 triệu bảng',
      'Khoảng 15 triệu bảng'
    ],
    optionsEn: [
      'Around 10 million pounds',
      'Around 8 million pounds',
      'Around 2 million pounds',
      'Around 15 million pounds'
    ],
    correctIndex: 0,
    correctAnswer: 'Around 10 million pounds',
    explanation: 'Robert cộng 8 triệu bảng (biển báo & sơn đường) với 2 triệu bảng (thay đổi khác), chốt tổng số là khoảng 10 triệu bảng ("around 10 million pounds").',
    explanationEn: 'Cumulative sum: Robert calculates that £8m for signs and painting plus £2m for other modifications totals around 10 million pounds.'
  },
  {
    id: 'hard_lis_park_ride_component_t34',
    difficulty: 'hard',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How can municipal planners limit the shuttle bus expenditure for the park-and-ride facility to 3 million pounds?',
    promptVi: 'Các nhà quy hoạch thành phố có thể hạn chế chi phí xe buýt trung chuyển của bãi đỗ park-and-ride ở mức 3 triệu bảng bằng cách nào?',
    promptEn: 'How can municipal planners limit the shuttle bus expenditure for the park-and-ride facility to 3 million pounds?',
    context: "Sophie: And then get the buses. If they rent them, they could keep the cost down to around 3 million pounds.",
    contextEn: "Sophie: And then get the buses. If they rent them, they could keep the cost down to around 3 million pounds.",
    audioText: "And then get the buses. If they rent them, they could keep the cost down to around 3 million pounds.",
    options: [
      'By renting the shuttle bus fleet instead of purchasing them',
      'By purchasing second-hand diesel double-deckers from airport auctions',
      'By soliciting corporate sponsorships to display on bus exteriors',
      'By replacing standard buses with driverless autonomous electric shuttles'
    ],
    optionsVi: [
      'Bằng cách thuê đội xe buýt trung chuyển thay vì mua mới',
      'Bằng cách mua xe buýt hai tầng chạy dầu đã qua sử dụng từ đấu giá sân bay',
      'Bằng cách kêu gọi tài trợ từ các doanh nghiệp để dán quảng cáo trên thân xe',
      'Bằng cách thay thế xe buýt tiêu chuẩn bằng xe điện tự hành không người lái'
    ],
    optionsEn: [
      'By renting the shuttle bus fleet instead of purchasing them',
      'By purchasing second-hand diesel double-deckers from airport auctions',
      'By soliciting corporate sponsorships to display on bus exteriors',
      'By replacing standard buses with driverless autonomous electric shuttles'
    ],
    correctIndex: 0,
    correctAnswer: 'By renting the shuttle bus fleet instead of purchasing them',
    explanation: 'Sophie nêu rõ biện pháp tiết kiệm ngân sách: "If they rent them, they could keep the cost down to around 3 million pounds."',
    explanationEn: 'Procurement model: Sophie clarifies that renting the buses allows the municipality to contain the expenditure to approximately 3 million pounds.'
  },
  {
    id: 'med_lis_pedestrian_cyclist_safety_t34',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Within the pedestrian zone scheme, what specific work accounts for approximately 12 million pounds?',
    promptVi: 'Trong đề xuất khu phố đi bộ, hạng mục thi công cụ thể nào chiếm khoảng 12 triệu bảng?',
    promptEn: 'Within the pedestrian zone scheme, what specific work accounts for approximately 12 million pounds?',
    context: "Sophie: We'd have to reroute all the traffic while the works are done, then change the roads along the routes to make it safer for cyclists, which is around 12 million pounds.",
    contextEn: "Sophie: We'd have to reroute all the traffic while the works are done, then change the roads along the routes to make it safer for cyclists, which is around 12 million pounds.",
    audioText: "We'd have to reroute all the traffic while the works are done, then change the roads along the routes to make it safer for cyclists, which is around 12 million pounds.",
    options: [
      'Altering roadway layouts along the routes to make them safer for cyclists',
      'Erecting electronic variable-message display boards at peripheral junctions',
      'Resurfacing pedestrian malls with permeable decorative clay paving bricks',
      'Constructing overhead glass-covered skywalks above high-traffic intersections'
    ],
    optionsVi: [
      'Cải tạo quy hoạch mặt đường dọc các tuyến lộ trình để giúp người đi xe đạp an toàn hơn',
      'Dựng các bảng hiển thị thông điệp điện tử biến đổi tại các ngã tư ngoại vi',
      'Thảm lại mặt đường phố đi bộ bằng gạch đất sét trang trí có khả năng thoát nước',
      'Xây dựng các cầu đi bộ trên cao có mái che bằng kính bắc qua các giao lộ lớn'
    ],
    optionsEn: [
      'Altering roadway layouts along the routes to make them safer for cyclists',
      'Erecting electronic variable-message display boards at peripheral junctions',
      'Resurfacing pedestrian malls with permeable decorative clay paving bricks',
      'Constructing overhead glass-covered skywalks above high-traffic intersections'
    ],
    correctIndex: 0,
    correctAnswer: 'Altering roadway layouts along the routes to make them safer for cyclists',
    explanation: 'Sophie nói rõ: "...change the roads along the routes to make it safer for cyclists, which is around 12 million pounds."',
    explanationEn: 'Infrastructure upgrading: Sophie specifies that altering road design along diversion routes to protect cyclists accounts for 12 million pounds.'
  },
  {
    id: 'easy_lis_robert_math_error_t34',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What corrected total sum does Sophie provide for the pedestrian and one-way system?',
    promptVi: 'Con số tổng chi phí đã được Sophie đính chính lại cho hệ thống phố đi bộ và đường một chiều là bao nhiêu?',
    promptEn: 'What corrected total sum does Sophie provide for the pedestrian and one-way system?',
    context: "Robert: So that's around 23 million pounds. We might be able to manage that. Sophie: Actually, that's 25 million pounds, Robert. Robert: So it is! My mistake. Maths was never my strong point.",
    contextEn: "Robert: So that's around 23 million pounds. We might be able to manage that. Sophie: Actually, that's 25 million pounds, Robert. Robert: So it is! My mistake. Maths was never my strong point.",
    audioText: "So that's around 23 million pounds. We might be able to manage that. Sophie: Actually, that's 25 million pounds, Robert. Robert: So it is! My mistake. Maths was never my strong point.",
    options: [
      '25 million pounds',
      '23 million pounds',
      '30 million pounds',
      '15 million pounds'
    ],
    optionsVi: [
      '25 triệu bảng',
      '23 triệu bảng',
      '30 triệu bảng',
      '15 triệu bảng'
    ],
    optionsEn: [
      '25 million pounds',
      '23 million pounds',
      '30 million pounds',
      '15 million pounds'
    ],
    correctIndex: 0,
    correctAnswer: '25 million pounds',
    explanation: 'Robert cộng nhầm ra 23 triệu, Sophie lập tức đính chính: "Actually, that\'s 25 million pounds, Robert." Robert thừa nhận: "So it is! My mistake."',
    explanationEn: 'Budget verification: Robert miscalculates 23 million pounds, but Sophie corrects the sum to 25 million pounds (12m + 5m + 8m = 25m).'
  },
  {
    id: 'med_lis_transit_mode_winner_t35',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to Sophie and Robert. Which municipal scheme do they agree would improve public transport the most?',
    promptEn: 'Listen to Sophie and Robert. Which municipal scheme do they agree would improve public transport the most?',
    context: 'Sophie: "So which schemes would help the most with public transport? ... It would certainly be good to have the tram. The bus and cycle routes would help, but traffic would just be diverted through other streets."',
    contextEn: 'Sophie: "So which schemes would help the most with public transport? ... It would certainly be good to have the tram. The bus and cycle routes would help, but traffic would just be diverted through other streets."',
    audioText: "So which schemes would help the most with public transport? ... It would certainly be good to have the tram. The bus and cycle routes would help, but traffic would just be diverted through other streets.",
    options: [
      'Tram system',
      'Bus and cycle only routes',
      'Park-and-ride scheme',
      'Pedestrian area and one-way system'
    ],
    optionsVi: [
      'Hệ thống xe điện (Tram)',
      'Làn đường dành riêng cho xe buýt và xe đạp',
      'Bãi đỗ xe trung chuyển ngoại ô (Park-and-ride)',
      'Phố đi bộ và phân luồng một chiều'
    ],
    optionsEn: [
      'Tram system',
      'Bus and cycle only routes',
      'Park-and-ride scheme',
      'Pedestrian area and one-way system'
    ],
    correctIndex: 0,
    correctAnswer: 'Tram system',
    explanation: 'Sophie và Robert đồng thuận rằng xe điện (tram) mang lại lợi ích lớn nhất cho giao thông công cộng, trong khi làn xe buýt chỉ đẩy luồng xe sang các phố khác.',
    explanationEn: 'Modal consensus: Robert and Sophie agree that the tram system delivers genuine public transit improvements, whereas bus/cycle routes merely divert vehicular traffic elsewhere.'
  },
  {
    id: 'hard_lis_visitor_retail_rationale_t35',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Sophie, why does the pedestrian precinct encourage visitors even more than the tram system?',
    promptEn: 'According to Sophie, why does the pedestrian precinct encourage visitors even more than the tram system?',
    context: 'Sophie: "And people who are shopping like to be able to walk around without having to dodge cars and buses. That really encourages visitors. More than the tram? Yes, definitely."',
    contextEn: 'Sophie: "And people who are shopping like to be able to walk around without having to dodge cars and buses. That really encourages visitors. More than the tram? Yes, definitely."',
    audioText: "And people who are shopping like to be able to walk around without having to dodge cars and buses. That really encourages visitors. More than the tram? Yes, definitely.",
    options: [
      'Shoppers can stroll leisurely without having to evade traffic',
      'Trams cannot access the narrowest historical retail alleys',
      'Shops offer special discounts to pedestrians arriving on foot',
      'Parking fees in the city center are eliminated for shoppers'
    ],
    optionsVi: [
      'Khách mua sắm có thể tản bộ an nhàn mà không phải né tránh các phương tiện giao thông',
      'Xe điện không thể tiếp cận các ngõ phố bán lẻ lịch sử chật hẹp',
      'Các cửa hàng áp dụng chương trình giảm giá đặc biệt cho người đi bộ',
      'Phí đỗ xe ở khu trung tâm được miễn phí hoàn toàn cho khách mua sắm'
    ],
    optionsEn: [
      'Shoppers can stroll leisurely without having to evade traffic',
      'Trams cannot access the narrowest historical retail alleys',
      'Shops offer special discounts to pedestrians arriving on foot',
      'Parking fees in the city center are eliminated for shoppers'
    ],
    correctIndex: 0,
    correctAnswer: 'Shoppers can stroll leisurely without having to evade traffic',
    explanation: 'Sophie giải thích người mua sắm thích đi bộ tự do mà không phải né tránh xe ô tô hay xe buýt ("walk around without having to dodge cars and buses"), vượt trội hơn hẳn xe điện.',
    explanationEn: 'Pedestrian attraction rationale: Shoppers appreciate navigating the central retail zone without vehicular intimidation ("walk around without having to dodge cars and buses").'
  },
  {
    id: 'easy_lis_exercise_health_winner_t35',
    difficulty: 'easy',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'Which scheme is explicitly commended for getting people moving and exercising outdoors?',
    promptEn: 'Which scheme is explicitly commended for getting people moving and exercising outdoors?',
    context: 'Sophie: "And of course having more cycling routes would mean that more people will be getting some exercise." Robert: "Yes, definitely."',
    contextEn: 'Sophie: "And of course having more cycling routes would mean that more people will be getting some exercise." Robert: "Yes, definitely."',
    audioText: "And of course having more cycling routes would mean that more people will be getting some exercise. Yes, definitely.",
    options: [
      'Bus and cycle only routes',
      'Tram system',
      'Park-and-ride scheme',
      'Pedestrian area and one-way system'
    ],
    optionsVi: [
      'Làn đường dành riêng cho xe buýt và xe đạp',
      'Hệ thống xe điện (Tram)',
      'Bãi đỗ xe trung chuyển ngoại ô (Park-and-ride)',
      'Phố đi bộ và phân luồng một chiều'
    ],
    optionsEn: [
      'Bus and cycle only routes',
      'Tram system',
      'Park-and-ride scheme',
      'Pedestrian area and one-way system'
    ],
    correctIndex: 0,
    correctAnswer: 'Bus and cycle only routes',
    explanation: 'Sophie và Robert đều đồng ý rằng việc mở thêm các tuyến xe đạp (trong đề án Bus and cycle only routes) giúp thúc đẩy người dân vận động rèn luyện thân thể.',
    explanationEn: 'Health and active mobility: Having more dedicated cycling routes directly stimulates regular physical exercise among residents.'
  },
  {
    id: 'med_lis_pollution_park_ride_t35',
    difficulty: 'medium',
    topic: 'environment',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'Why does Robert argue that the park-and-ride scheme does the most to reduce city center pollution?',
    promptEn: 'Why does Robert argue that the park-and-ride scheme does the most to reduce city center pollution?',
    context: 'Robert: "The park-and-ride, I\'d say. Far fewer cars would be coming into the town centre, so you wouldn\'t get as much dirty air."',
    contextEn: 'Robert: "The park-and-ride, I\'d say. Far fewer cars would be coming into the town centre, so you wouldn\'t get as much dirty air."',
    audioText: "The park-and-ride, I'd say. Far fewer cars would be coming into the town centre, so you wouldn't get as much dirty air.",
    options: [
      'It drastically curtails the number of private motorcars penetrating the urban core',
      'It replaces older diesel buses with zero-emission electric shuttles',
      'It penalizes heavy goods vehicles entering residential areas with congestion taxes',
      'It mandates carpooling for all commuters driving into central business districts'
    ],
    optionsVi: [
      'Nó làm giảm mạnh lượng ô tô cá nhân di chuyển vào lõi trung tâm thành phố',
      'Nó thay thế xe buýt diesel cũ bằng đội xe buýt điện không phát thải',
      'Nó áp thuế tắc nghẽn đối với xe tải hạng nặng đi vào khu dân cư',
      'Nó bắt buộc đi chung xe đối với tất cả người đi làm vào khu trung tâm'
    ],
    optionsEn: [
      'It drastically curtails the number of private motorcars penetrating the urban core',
      'It replaces older diesel buses with zero-emission electric shuttles',
      'It penalizes heavy goods vehicles entering residential areas with congestion taxes',
      'It mandates carpooling for all commuters driving into central business districts'
    ],
    correctIndex: 0,
    correctAnswer: 'It drastically curtails the number of private motorcars penetrating the urban core',
    explanation: 'Robert chỉ rõ: "Far fewer cars would be coming into the town centre, so you wouldn\'t get as much dirty air." Bãi đỗ xe trung chuyển giúp giữ lượng lớn ô tô ở ngoài rìa thành phố.',
    explanationEn: 'Air quality mechanism: Retaining private vehicles in suburban perimeter lots prevents exhaust emissions inside the historic center.'
  },
  {
    id: 'hard_lis_safety_cyclist_blindspot_t35',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What safety hazard prompted Sophie and Robert to choose the pedestrian zone over cycle routes for safety?',
    promptEn: 'What safety hazard prompted Sophie and Robert to choose the pedestrian zone over cycle routes for safety?',
    context: 'Robert: "They still have to avoid cyclists, who don\'t always pay attention to pedestrians." Sophie: "And with the pedestrian area, they wouldn\'t have to deal with that because there aren\'t any cyclists there."',
    contextEn: 'Robert: "They still have to avoid cyclists, who don\'t always pay attention to pedestrians." Sophie: "And with the pedestrian area, they wouldn\'t have to deal with that because there aren\'t any cyclists there."',
    audioText: "They still have to avoid cyclists, who don't always pay attention to pedestrians. And with the pedestrian area, they wouldn't have to deal with that because there aren't any cyclists there.",
    options: [
      'Inattentive cyclists colliding with walkers on shared surfaces',
      'Buses speeding dangerously along segregated rapid corridors',
      'Delivery vans reversing blindly into alleyway pedestrian crossings',
      'Lack of adequate illumination along nocturnal commuter cycleways'
    ],
    optionsVi: [
      'Người đi xe đạp thiếu chú ý dễ đâm va vào người đi bộ trên cùng tuyến đường',
      'Xe buýt chạy quá tốc độ trên các hành lang ưu tiên riêng biệt',
      'Xe tải giao hàng lùi bất cẩn tại các điểm qua đường cho người đi bộ',
      'Thiếu hệ thống chiếu sáng ban đêm dọc các tuyến đường xe đạp'
    ],
    optionsEn: [
      'Inattentive cyclists colliding with walkers on shared surfaces',
      'Buses speeding dangerously along segregated rapid corridors',
      'Delivery vans reversing blindly into alleyway pedestrian crossings',
      'Lack of adequate illumination along nocturnal commuter cycleways'
    ],
    correctIndex: 0,
    correctAnswer: 'Inattentive cyclists colliding with walkers on shared surfaces',
    explanation: 'Robert lưu ý rằng người đi bộ vẫn phải né người đi xe đạp vốn thường không để ý ("don\'t always pay attention"), nên khu phố đi bộ cấm xe đạp là an toàn nhất.',
    explanationEn: 'Pedestrian safety distinction: Cyclists often neglect pedestrian safety on shared corridors, making completely car- and bike-free pedestrian areas the safest option.'
  },
  {
    id: 'easy_lis_discourse_hedge_t36',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'Listen to Statement 1. How does the speaker politely signal that Robert made an error?',
    promptEn: 'Listen to Statement 1. How does the speaker politely signal that Robert made an error?',
    context: 'Sophie: "Actually, Robert, that\'s not quite right."',
    contextEn: 'Sophie: "Actually, Robert, that\'s not quite right."',
    audioText: "Actually, Robert, that's not quite right.",
    options: [
      '"Actually, Robert, that\'s not quite right."',
      '"Robert, you are completely mistaken about everything."',
      '"I totally agree with your calculations, Robert."',
      '"Let\'s stop the discussion and take a short break."'
    ],
    optionsVi: [
      '"Actually, Robert, that\'s not quite right."',
      '"Robert, anh đã hoàn toàn nhầm lẫn về mọi thứ."',
      '"Tôi hoàn toàn đồng ý với các phép tính của anh, Robert."',
      '"Hãy dừng cuộc thảo luận và giải lao một lát."'
    ],
    optionsEn: [
      '"Actually, Robert, that\'s not quite right."',
      '"Robert, you are completely mistaken about everything."',
      '"I totally agree with your calculations, Robert."',
      '"Let\'s stop the discussion and take a short break."'
    ],
    correctIndex: 0,
    correctAnswer: '"Actually, Robert, that\'s not quite right."',
    explanation: 'Sophie sử dụng trạng từ "Actually" và cấu trúc nói giảm nói tránh "that\'s not quite right" để đính chính lỗi sai một cách nhã nhặn.',
    explanationEn: 'Sophie utilizes the conversational marker "Actually" paired with the hedge "that\'s not quite right" to offer a polite correction.'
  },
  {
    id: 'med_lis_concession_reality_t36',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to Statement 3. What is the speaker\'s real opinion of the proposed transport solution?',
    promptEn: 'Listen to Statement 3. What is the speaker\'s real opinion of the proposed transport solution?',
    context: 'Sophie: "On the face of it, yes, but in actual fact, it can make things worse."',
    contextEn: 'Sophie: "On the face of it, yes, but in actual fact, it can make things worse."',
    audioText: "On the face of it, yes, but in actual fact, it can make things worse.",
    options: [
      'While superficially attractive, in reality it may aggravate urban problems',
      'The proposal is overwhelmingly successful and has no drawbacks',
      'The municipality lacks the technical workforce to carry out roadworks',
      'She strongly recommends adopting the measure without modifications'
    ],
    optionsVi: [
      'Dù nhìn bề ngoài có vẻ hấp dẫn, trên thực tế nó có thể làm tình hình giao thông tồi tệ hơn',
      'Đề xuất cực kỳ thành công và hoàn toàn không có bất kỳ nhược điểm nào',
      'Chính quyền thành phố thiếu hụt lực lượng kỹ thuật để tiến hành sửa đường',
      'Cô ấy nhiệt liệt khuyến nghị áp dụng biện pháp mà không cần chỉnh sửa'
    ],
    optionsEn: [
      'While superficially attractive, in reality it may aggravate urban problems',
      'The proposal is overwhelmingly successful and has no drawbacks',
      'The municipality lacks the technical workforce to carry out roadworks',
      'She strongly recommends adopting the measure without modifications'
    ],
    correctIndex: 0,
    correctAnswer: 'While superficially attractive, in reality it may aggravate urban problems',
    explanation: 'Cụm "On the face of it, yes, but in actual fact, it can make things worse" biểu thị sự thừa nhận bề ngoài nhưng khẳng định thực tế nó gây hại nhiều hơn.',
    explanationEn: 'The utterance establishes a concession to surface appeal ("On the face of it, yes") followed by empirical refutation ("in actual fact, it can make things worse").'
  },
  {
    id: 'easy_lis_agenda_transition_t36',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'Listen to Statement 4. Which transport scheme does Robert introduce next for discussion?',
    promptEn: 'Listen to Statement 4. Which transport scheme does Robert introduce next for discussion?',
    context: 'Robert: "What about the second one? A park-and-ride scheme?"',
    contextEn: 'Robert: "What about the second one? A park-and-ride scheme?"',
    audioText: "What about the second one? A park-and-ride scheme?",
    options: [
      'A park-and-ride scheme',
      'A light tramway network',
      'A high-speed suburban railway',
      'A pedestrian precinct and one-way grid'
    ],
    optionsVi: [
      'Bãi đỗ xe trung chuyển ngoại ô (Park-and-ride)',
      'Mạng lưới tàu điện nhẹ (Tramway)',
      'Tuyến đường sắt ngoại ô tốc độ cao',
      'Khu phố đi bộ và mạng lưới một chiều'
    ],
    optionsEn: [
      'A park-and-ride scheme',
      'A light tramway network',
      'A high-speed suburban railway',
      'A pedestrian precinct and one-way grid'
    ],
    correctIndex: 0,
    correctAnswer: 'A park-and-ride scheme',
    explanation: 'Robert hỏi: "What about the second one? A park-and-ride scheme?" nhằm chuyển mạch thảo luận sang đề án số 2 (park-and-ride).',
    explanationEn: 'Robert transitions to the next item on the project agenda: "What about the second one? A park-and-ride scheme?".'
  },
  {
    id: 'hard_lis_persuasion_common_ground_t36',
    difficulty: 'hard',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to Statement 5. Which communicative strategy does Robert employ to win Sophie\'s agreement?',
    promptEn: 'Listen to Statement 5. Which communicative strategy does Robert employ to win Sophie\'s agreement?',
    context: 'Robert: "Up to a point, yes. But I\'m sure you\'d agree that encouraging people to do more cycling would help health far more."',
    contextEn: 'Robert: "Up to a point, yes. But I\'m sure you\'d agree that encouraging people to do more cycling would help health far more."',
    audioText: "Up to a point, yes. But I'm sure you'd agree that encouraging people to do more cycling would help health far more.",
    options: [
      'He concedes partially before presuming mutual consensus with "I\'m sure you\'d agree"',
      'He presents official hospital admission statistics regarding coronary illness',
      'He criticizes Sophie\'s lack of medical knowledge regarding cardiovascular fitness',
      'He suggests cycling routes should replace all existing municipal bus services'
    ],
    optionsVi: [
      'Anh ấy nhượng bộ một phần trước khi tạo lập điểm chung bằng "I\'m sure you\'d agree"',
      'Anh ấy đưa ra số liệu nhập viện chính thức về các bệnh tim mạch',
      'Anh ấy chỉ trích việc Sophie thiếu kiến thức y khoa về sức khỏe tim mạch',
      'Anh ấy đề xuất làn xe đạp nên thay thế toàn bộ dịch vụ xe buýt hiện tại'
    ],
    optionsEn: [
      'He concedes partially before presuming mutual consensus with "I\'m sure you\'d agree"',
      'He presents official hospital admission statistics regarding coronary illness',
      'He criticizes Sophie\'s lack of medical knowledge regarding cardiovascular fitness',
      'He suggests cycling routes should replace all existing municipal bus services'
    ],
    correctIndex: 0,
    correctAnswer: 'He concedes partially before presuming mutual consensus with "I\'m sure you\'d agree"',
    explanation: 'Robert sử dụng hai bước tu từ: nhượng bộ chừng mực ("Up to a point, yes") và định hướng đồng thuận ("But I\'m sure you\'d agree...").',
    explanationEn: 'Robert combines qualified concession ("Up to a point, yes") with assumed consensus ("But I\'m sure you\'d agree...") to persuasively introduce cycling health benefits.'
  },
  {
    id: 'med_lis_empirical_town_hall_t36',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'Listen to Statement 6. What empirical evidence does the speaker cite to challenge the assumption about pollution hotspots?',
    promptEn: 'Listen to Statement 6. What empirical evidence does the speaker cite to challenge the assumption about pollution hotspots?',
    context: 'Sophie: "I\'m not sure about that. Statistics show that the worst place is by the town hall."',
    contextEn: 'Sophie: "I\'m not sure about that. Statistics show that the worst place is by the town hall."',
    audioText: "I'm not sure about that. Statistics show that the worst place is by the town hall.",
    options: [
      'Statistical data demonstrating that the most severe pollution occurs beside the town hall',
      'Eyewitness complaints submitted by shopkeepers on High Street',
      'Satellite thermal imagery of urban heat island concentrations',
      'Traffic camera footage showing long vehicular delays outside the library'
    ],
    optionsVi: [
      'Dữ liệu thống kê chứng minh nơi ô nhiễm nghiêm trọng nhất nằm cạnh tòa thị chính',
      'Khiếu nại của các chủ cửa hàng trên phố High Street',
      'Hình ảnh nhiệt vệ tinh về hiện tượng đảo nhiệt đô thị',
      'Dữ liệu camera giao thông ghi nhận ùn tắc trước thư viện'
    ],
    optionsEn: [
      'Statistical data demonstrating that the most severe pollution occurs beside the town hall',
      'Eyewitness complaints submitted by shopkeepers on High Street',
      'Satellite thermal imagery of urban heat island concentrations',
      'Traffic camera footage showing long vehicular delays outside the library'
    ],
    correctIndex: 0,
    correctAnswer: 'Statistical data demonstrating that the most severe pollution occurs beside the town hall',
    explanation: 'Sophie phản bác bằng chứng cứ thực nghiệm rõ ràng: "Statistics show that the worst place is by the town hall."',
    explanationEn: 'Sophie supports her doubt by invoking empirical records: "Statistics show that the worst place is by the town hall."'
  },
  {
    id: 'med_lis_bus_destination_fall_t37',
    difficulty: 'medium',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Bill, why do fewer commuters in Ashtown use the public bus service nowadays?',
    promptEn: 'According to Bill, why do fewer commuters in Ashtown use the public bus service nowadays?',
    context: 'Bill: "A lot of people think it\'s because fares are higher, but that isn\'t true. In fact, the cost compared to average salaries is pretty much the same as 25 years ago. The fact is that the buses now just go to the most popular destinations, and as the city centre no longer allows vehicles, there are even fewer places where buses can go."',
    contextEn: 'Bill: "A lot of people think it\'s because fares are higher, but that isn\'t true. In fact, the cost compared to average salaries is pretty much the same as 25 years ago. The fact is that the buses now just go to the most popular destinations, and as the city centre no longer allows vehicles, there are even fewer places where buses can go."',
    audioText: "A lot of people think it's because fares are higher, but that isn't true. In fact, the cost compared to average salaries is pretty much the same as 25 years ago. The fact is that the buses now just go to the most popular destinations, and as the city centre no longer allows vehicles, there are even fewer places where buses can go.",
    options: [
      'Buses now exclusively serve popular corridors and are banned from the city center',
      'Ticket fares have surged significantly compared to average household salaries',
      'Modern replacement buses provide inferior comfort compared to vintage models',
      'Most commuters have transitioned entirely to private automotive travel'
    ],
    optionsVi: [
      'Xe buýt hiện chỉ phục vụ các tuyến hành lang phổ biến và bị cấm vào trung tâm',
      'Giá vé xe buýt tăng vọt đáng kể so với mức lương trung bình của hộ gia đình',
      'Xe buýt mới thay thế đem lại sự thoải mái kém hơn các dòng xe cũ',
      'Phần lớn người đi làm đã chuyển hoàn toàn sang đi xe ô tô cá nhân'
    ],
    optionsEn: [
      'Buses now exclusively serve popular corridors and are banned from the city center',
      'Ticket fares have surged significantly compared to average household salaries',
      'Modern replacement buses provide inferior comfort compared to vintage models',
      'Most commuters have transitioned entirely to private automotive travel'
    ],
    correctIndex: 0,
    correctAnswer: 'Buses now exclusively serve popular corridors and are banned from the city center',
    explanation: 'Bill phản bác giả định về giá vé và khẳng định nguyên nhân thực sự là mạng lưới tuyến bị thu hẹp và xe buýt bị cấm vào khu lõi trung tâm đi bộ.',
    explanationEn: 'Bill rejects fare inflation and highlights route rationalization to popular hubs and downtown vehicle prohibitions as the true determinants of reduced patronage.'
  },
  {
    id: 'easy_lis_bypass_unbuilt_status_t37',
    difficulty: 'easy',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'What happened to the planned municipal bypass around Ashtown town center?',
    promptEn: 'What happened to the planned municipal bypass around Ashtown town center?',
    context: 'Bill: "Five years ago, a bypass was supposed to be built, so that people could easily get from one side of the town to the other without going into the centre. But those plans still haven\'t happened."',
    contextEn: 'Bill: "Five years ago, a bypass was supposed to be built, so that people could easily get from one side of the town to the other without going into the centre. But those plans still haven\'t happened."',
    audioText: "Five years ago, a bypass was supposed to be built, so that people could easily get from one side of the town to the other without going into the centre. But those plans still haven't happened.",
    options: [
      'The construction plans have never materialized into reality',
      'It was completed successfully under the municipal budget ceiling',
      'It was rerouted through the historic town square to assist shoppers',
      'It was repurposed into a subterranean light transit corridor'
    ],
    optionsVi: [
      'Các kế hoạch xây dựng vẫn chưa bao giờ được hiện thực hóa',
      'Tuyến đường đã hoàn thành thành công trong hạn mức ngân sách',
      'Tuyến đường được đổi hướng qua quảng trường lịch sử để hỗ trợ người mua sắm',
      'Tuyến đường được chuyển đổi thành hành lang giao thông ngầm'
    ],
    optionsEn: [
      'The construction plans have never materialized into reality',
      'It was completed successfully under the municipal budget ceiling',
      'It was rerouted through the historic town square to assist shoppers',
      'It was repurposed into a subterranean light transit corridor'
    ],
    correctIndex: 0,
    correctAnswer: 'The construction plans have never materialized into reality',
    explanation: 'Bill khẳng định kế hoạch xây đường vành đai tránh trung tâm từ 5 năm trước vẫn chưa hề diễn ra ("those plans still haven\'t happened").',
    explanationEn: 'Bill confirms that the bypass conceived five years ago remains unconstructed ("those plans still haven\'t happened").'
  },
  {
    id: 'med_lis_education_job_growth_t37',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'According to Bill, which sector accounts for the largest concentration of employment in Ashtown today?',
    promptEn: 'According to Bill, which sector accounts for the largest concentration of employment in Ashtown today?',
    context: 'Bill: "Manufacturing is still important of course, and services such as accountancy firms and website developers employ a lot of people in the town, but you only have to see the number of universities and colleges that have opened in the town in the last 25 years to see that is where most of the jobs are now."',
    contextEn: 'Bill: "Manufacturing is still important of course, and services such as accountancy firms and website developers employ a lot of people in the town, but you only have to see the number of universities and colleges that have opened in the town in the last 25 years to see that is where most of the jobs are now."',
    audioText: "Manufacturing is still important of course, and services such as accountancy firms and website developers employ a lot of people in the town, but you only have to see the number of universities and colleges that have opened in the town in the last 25 years to see that is where most of the jobs are now.",
    options: [
      'Higher education institutions (universities and colleges)',
      'Professional business services such as accounting and IT firms',
      'Traditional manufacturing and product assembly plants',
      'Hospitality and cultural heritage tourist attractions'
    ],
    optionsVi: [
      'Các cơ sở giáo dục đại học (trường đại học và cao đẳng)',
      'Dịch vụ chuyên môn như các công ty kế toán và công nghệ thông tin',
      'Các nhà máy sản xuất truyền thống và lắp ráp sản phẩm',
      'Các điểm tham quan du lịch di sản văn hóa và khách sạn'
    ],
    optionsEn: [
      'Higher education institutions (universities and colleges)',
      'Professional business services such as accounting and IT firms',
      'Traditional manufacturing and product assembly plants',
      'Hospitality and cultural heritage tourist attractions'
    ],
    correctIndex: 0,
    correctAnswer: 'Higher education institutions (universities and colleges)',
    explanation: 'Bill nhấn mạnh rằng sự gia tăng nhanh chóng của các trường đại học và cao đẳng chính là nơi tập trung phần lớn việc làm hiện nay.',
    explanationEn: 'Bill identifies colleges and universities opened over the past quarter-century as the primary source of contemporary town employment.'
  },
  {
    id: 'easy_lis_cinema_relocation_t37',
    difficulty: 'easy',
    topic: 'culture',
    skillCategory: 'listening',
    type: 'listening_comprehension',
    prompt: 'What was the eventual fate of the Grand Cinema near the railway station?',
    promptEn: 'What was the eventual fate of the Grand Cinema near the railway station?',
    context: 'Bill: "The Grand Cinema used to be next to the railway station, but they rebuilt one exactly the same as the old one over in King Street."',
    contextEn: 'Bill: "The Grand Cinema used to be next to the railway station, but they rebuilt one exactly the same as the old one over in King Street."',
    audioText: "The Grand Cinema used to be next to the railway station, but they rebuilt one exactly the same as the old one over in King Street.",
    options: [
      'It was demolished and rebuilt identically at a new site in King Street',
      'It was converted into additional long-stay parking for rail passengers',
      'It was acquired by the municipal council as a performing arts stage',
      'It was permanently demolished without any replacement facility'
    ],
    optionsVi: [
      'Nó bị phá dỡ và được xây dựng lại nguyên mẫu tại địa điểm mới ở phố King Street',
      'Nó được chuyển đổi thành bãi đỗ xe dài hạn bổ sung cho hành khách đi tàu',
      'Nó được hội đồng thành phố mua lại làm sân khấu biểu diễn nghệ thuật',
      'Nó bị phá dỡ vĩnh viễn mà không có bất kỳ cơ sở thay thế nào'
    ],
    optionsEn: [
      'It was demolished and rebuilt identically at a new site in King Street',
      'It was converted into additional long-stay parking for rail passengers',
      'It was acquired by the municipal council as a performing arts stage',
      'It was permanently demolished without any replacement facility'
    ],
    correctIndex: 0,
    correctAnswer: 'It was demolished and rebuilt identically at a new site in King Street',
    explanation: 'Bill giải thích rạp Grand Cinema ban đầu cạnh ga tàu đã được xây dựng lại y hệt bản cũ nhưng đặt tại phố King Street.',
    explanationEn: 'The original theater beside the station was torn down and rebuilt in an identical architectural style on King Street.'
  },
  {
    id: 'hard_lis_art_college_surgery_t37',
    difficulty: 'hard',
    topic: 'health',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What unexpected adaptive reuse took place with Ashtown\'s former art college building?',
    promptEn: 'What unexpected adaptive reuse took place with Ashtown\'s former art college building?',
    context: 'Bill: "The thing that I found surprising was that although education has become more important to the economy of the town, there isn\'t an art college anymore. In fact, the art college is now used as a doctor\'s surgery."',
    contextEn: 'Bill: "The thing that I found surprising was that although education has become more important to the economy of the town, there isn\'t an art college anymore. In fact, the art college is now used as a doctor\'s surgery."',
    audioText: "The thing that I found surprising was that although education has become more important to the economy of the town, there isn't an art college anymore. In fact, the art college is now used as a doctor's surgery.",
    options: [
      'It was repurposed into a clinical healthcare facility (doctor\'s surgery)',
      'It was merged into the university central design academy',
      'It was transformed into a commercial retail indoor marketplace',
      'It was condemned by safety inspectors and marked for demolition'
    ],
    optionsVi: [
      'Nó được chuyển đổi công năng thành phòng khám bệnh của bác sĩ (doctor\'s surgery)',
      'Nó được sáp nhập vào học viện thiết kế trung tâm của trường đại học',
      'Nó được biến đổi thành khu chợ bán lẻ thương mại trong nhà',
      'Nó bị thanh tra an toàn kết luận không đạt chuẩn và chờ phá dỡ'
    ],
    optionsEn: [
      'It was repurposed into a clinical healthcare facility (doctor\'s surgery)',
      'It was merged into the university central design academy',
      'It was transformed into a commercial retail indoor marketplace',
      'It was condemned by safety inspectors and marked for demolition'
    ],
    correctIndex: 0,
    correctAnswer: 'It was repurposed into a clinical healthcare facility (doctor\'s surgery)',
    explanation: 'Bill bất ngờ vì dù giáo dục phát triển nhưng trường cao đẳng nghệ thuật đã không còn tồn tại mà trở thành một phòng khám bác sĩ ("doctor\'s surgery").',
    explanationEn: 'Bill finds it paradoxical that despite educational expansion, the historic art college was converted into a medical practice ("doctor\'s surgery").'
  },

  // ==========================================
  // TRACK 38: SPEAKING PART 2 EXAMINER PROMPT
  // ==========================================
  {
    id: 'easy_lis_prep_time_t38',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How much preparation time is officially granted to candidates before speaking in IELTS Speaking Part 2?',
    promptEn: 'How much preparation time is officially granted to candidates before speaking in IELTS Speaking Part 2?',
    context: 'Examiner: "You have 1 minute to think about your answer. Here\'s a piece of paper and a pencil for you to make some notes if you wish."',
    contextEn: 'Examiner: "You have 1 minute to think about your answer. Here\'s a piece of paper and a pencil for you to make some notes if you wish."',
    audioText: "You have 1 minute to think about your answer. Here's a piece of paper and a pencil for you to make some notes if you wish.",
    options: [
      'Exactly 1 minute',
      'Between 1 to 2 minutes depending on topic complexity',
      '30 seconds quick reflection',
      '3 minutes structured outlining'
    ],
    optionsVi: [
      'Chính xác 1 phút',
      'Từ 1 đến 2 phút tùy độ phức tạp của đề',
      '30 giây suy nghĩ nhanh',
      '3 phút lập dàn ý chi tiết'
    ],
    optionsEn: [
      'Exactly 1 minute',
      'Between 1 to 2 minutes depending on topic complexity',
      '30 seconds quick reflection',
      '3 minutes structured outlining'
    ],
    correctIndex: 0,
    correctAnswer: 'Exactly 1 minute',
    explanation: 'Giám khảo nêu rõ thời gian suy nghĩ: "You have 1 minute to think about your answer."',
    explanationEn: 'The examiner explicitly announces: "You have 1 minute to think about your answer."'
  },
  {
    id: 'easy_lis_paper_pencil_t38',
    difficulty: 'easy',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What items does the examiner hand over to the candidate for preparing notes?',
    promptEn: 'What items does the examiner hand over to the candidate for preparing notes?',
    context: 'Examiner: "Here\'s a piece of paper and a pencil for you to make some notes if you wish."',
    contextEn: 'Examiner: "Here\'s a piece of paper and a pencil for you to make some notes if you wish."',
    audioText: "Here's a piece of paper and a pencil for you to make some notes if you wish.",
    options: [
      'A piece of paper and a pencil',
      'A digital tablet and stylus',
      'A laminated whiteboard and dry-erase marker',
      'A ballpoint pen and printed cue booklet'
    ],
    optionsVi: [
      'Một tờ giấy và một cây bút chì',
      'Máy tính bảng kỹ thuật số và bút cảm ứng',
      'Bảng trắng ép nhựa và bút dạ xóa được',
      'Bút bi và tập sách in gợi ý'
    ],
    optionsEn: [
      'A piece of paper and a pencil',
      'A digital tablet and stylus',
      'A laminated whiteboard and dry-erase marker',
      'A ballpoint pen and printed cue booklet'
    ],
    correctIndex: 0,
    correctAnswer: 'A piece of paper and a pencil',
    explanation: 'Giám khảo đưa cho thí sinh một tờ giấy và bút chì ("a piece of paper and a pencil").',
    explanationEn: 'The examiner provides the candidate with "a piece of paper and a pencil".'
  },
  {
    id: 'med_lis_interruption_procedure_t38',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'How should the candidate react if the examiner cuts in and interrupts their monologue?',
    promptEn: 'How should the candidate react if the examiner cuts in and interrupts their monologue?',
    context: 'Examiner: "Remember you have 1 to 2 minutes for this, so don\'t worry if I stop you. I\'ll tell you when the time is up."',
    contextEn: 'Examiner: "Remember you have 1 to 2 minutes for this, so don\'t worry if I stop you. I\'ll tell you when the time is up."',
    audioText: "Remember you have 1 to 2 minutes for this, so don't worry if I stop you. I'll tell you when the time is up.",
    options: [
      'Remain calm without concern as examiner interruption is standard timed procedure',
      'Apologize immediately and request thirty seconds extra time',
      'Restart the cue card narrative from the introductory background',
      'Complain to the exam center supervisor regarding premature disruption'
    ],
    optionsVi: [
      'Giữ bình tĩnh không cần lo lắng vì ngắt lời là thủ tục quy chuẩn khi hết thời gian',
      'Xin lỗi ngay lập tức và xin thêm 30 giây',
      'Bắt đầu nói lại từ phần giới thiệu',
      'Khiếu nại giám thị trung tâm thi về việc bị ngắt lời sớm'
    ],
    optionsEn: [
      'Remain calm without concern as examiner interruption is standard timed procedure',
      'Apologize immediately and request thirty seconds extra time',
      'Restart the cue card narrative from the introductory background',
      'Complain to the exam center supervisor regarding premature disruption'
    ],
    correctIndex: 0,
    correctAnswer: 'Remain calm without concern as examiner interruption is standard timed procedure',
    explanation: 'Giám khảo trấn an: "don\'t worry if I stop you. I\'ll tell you when the time is up" - đây là quy trình kiểm soát thời gian tiêu chuẩn.',
    explanationEn: 'The examiner reassures: "don\'t worry if I stop you. I\'ll tell you when the time is up" as it is standard timing control.'
  },
  {
    id: 'med_lis_time_ceiling_t38',
    difficulty: 'medium',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What is the maximum target time ceiling for the candidate\'s monologue in Speaking Part 2?',
    promptEn: 'What is the maximum target time ceiling for the candidate\'s monologue in Speaking Part 2?',
    context: 'Examiner: "Now, I\'m going to give you a topic, and I\'d like you to talk about it for between 1 to 2 minutes... Remember you have 1 to 2 minutes for this..."',
    contextEn: 'Examiner: "Now, I\'m going to give you a topic, and I\'d like you to talk about it for between 1 to 2 minutes... Remember you have 1 to 2 minutes for this..."',
    audioText: "Now, I'm going to give you a topic, and I'd like you to talk about it for between 1 to 2 minutes... Remember you have 1 to 2 minutes for this...",
    options: [
      '2 minutes',
      '1 minute',
      '3 minutes',
      '90 seconds'
    ],
    optionsVi: [
      '2 phút',
      '1 phút',
      '3 phút',
      '90 giây'
    ],
    optionsEn: [
      '2 minutes',
      '1 minute',
      '3 minutes',
      '90 seconds'
    ],
    correctIndex: 0,
    correctAnswer: '2 minutes',
    explanation: 'Trần thời gian tối đa là 2 phút ("between 1 to 2 minutes").',
    explanationEn: 'The upper threshold limit is 2 minutes ("between 1 to 2 minutes").'
  },
  {
    id: 'hard_lis_cue_card_journey_t38',
    difficulty: 'hard',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What topic is the candidate required to elaborate on in this Cambridge IELTS Speaking Part 2 cue card?',
    promptEn: 'What topic is the candidate required to elaborate on in this Cambridge IELTS Speaking Part 2 cue card?',
    context: 'Examiner cue card instructions: "Describe a memorable journey that you made. You should say where you went, how you travelled, why you went there, and explain why that journey was memorable to you."',
    contextEn: 'Examiner cue card instructions: "Describe a memorable journey that you made. You should say where you went, how you travelled, why you went there, and explain why that journey was memorable to you."',
    audioText: "Describe a memorable journey that you made. You should say where you went, how you travelled, why you went there, and explain why that journey was memorable to you.",
    options: [
      'A memorable personal journey and reasons why it left a lasting impression',
      'A municipal public transport initiative to expand electric rail commuter lines',
      'An academic presentation evaluating urban highway construction environmental costs',
      'A childhood sports competition where team collaboration overcame equipment deficits'
    ],
    optionsVi: [
      'Một chuyến đi đáng nhớ của cá nhân và lý do tại sao chuyến đi để lại ấn tượng sâu đậm',
      'Sáng kiến giao thông công cộng đô thị nhằm mở rộng các tuyến đường sắt điện',
      'Bài thuyết trình học thuật đánh giá tác động môi trường của việc xây dựng đường cao tốc',
      'Một cuộc thi thể thao thời thơ ấu nơi tinh thần đồng đội vượt qua khó khăn thiếu thốn thiết bị'
    ],
    optionsEn: [
      'A memorable personal journey and reasons why it left a lasting impression',
      'A municipal public transport initiative to expand electric rail commuter lines',
      'An academic presentation evaluating urban highway construction environmental costs',
      'A childhood sports competition where team collaboration overcame equipment deficits'
    ],
    correctIndex: 0,
    correctAnswer: 'A memorable personal journey and reasons why it left a lasting impression',
    explanation: 'Chủ đề của Cue Card là "Describe a memorable journey that you made".',
    explanationEn: 'The target cue card theme is "Describe a memorable journey that you made".'
  },

  // ==========================================
  // TRACK 39: SPEAKING PART 2 CANDIDATE SAMPLE (PARIS JOURNEY)
  // ==========================================
  {
    id: 'easy_lis_paris_departure_t39',
    difficulty: 'easy',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'On which date did the candidate embark on their flight to Paris?',
    promptEn: 'On which date did the candidate embark on their flight to Paris?',
    context: 'Candidate: "I remember a trip I took last year, on the 12th of August, I believe. I boarded a plane to Paris, which was rather exciting as I\'d never done that before."',
    contextEn: 'Candidate: "I remember a trip I took last year, on the 12th of August, I believe. I boarded a plane to Paris, which was rather exciting as I\'d never done that before."',
    audioText: "I remember a trip I took last year, on the 12th of August, I believe. I boarded a plane to Paris, which was rather exciting as I'd never done that before.",
    options: [
      '12th of August',
      '20th of August',
      '2nd of August',
      '15th of August'
    ],
    optionsVi: [
      'Ngày 12 tháng 8',
      'Ngày 20 tháng 8',
      'Ngày 2 tháng 8',
      'Ngày 15 tháng 8'
    ],
    optionsEn: [
      '12th of August',
      '20th of August',
      '2nd of August',
      '15th of August'
    ],
    correctIndex: 0,
    correctAnswer: '12th of August',
    explanation: 'Thí sinh xác nhận ngày khởi hành: "on the 12th of August, I believe".',
    explanationEn: 'The candidate confirms: "on the 12th of August, I believe".'
  },
  {
    id: 'easy_lis_louvre_triangle_t39',
    difficulty: 'easy',
    topic: 'arts',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What prominent architectural landmark at the Louvre Museum entrance did the speaker describe?',
    promptEn: 'What prominent architectural landmark at the Louvre Museum entrance did the speaker describe?',
    context: 'Candidate: "when I got there, the first thing I did was go to the Louvre Museum, you know, where the big triangle is by the entrance, and took some pictures."',
    contextEn: 'Candidate: "when I got there, the first thing I did was go to the Louvre Museum, you know, where the big triangle is by the entrance, and took some pictures."',
    audioText: "when I got there, the first thing I did was go to the Louvre Museum, you know, where the big triangle is by the entrance, and took some pictures.",
    options: [
      'A large glass triangle (pyramid) structure',
      'A towering bronze obelisk',
      'A spiral stone staircase',
      'A classical triumphal marble arch'
    ],
    optionsVi: [
      'Cấu trúc hình tam giác (kim tự tháp) kính lớn',
      'Cột tháp đá đài bằng đồng cao chót vót',
      'Cầu thang xoắn ốc bằng đá',
      'Khải hoàn môn bằng đá cẩm thạch cổ điển'
    ],
    optionsEn: [
      'A large glass triangle (pyramid) structure',
      'A towering bronze obelisk',
      'A spiral stone staircase',
      'A classical triumphal marble arch'
    ],
    correctIndex: 0,
    correctAnswer: 'A large glass triangle (pyramid) structure',
    explanation: 'Người nói miêu tả: "where the big triangle is by the entrance".',
    explanationEn: 'The candidate highlights: "where the big triangle is by the entrance".'
  },
  {
    id: 'med_lis_julie_snow_globe_t39',
    difficulty: 'medium',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why did the candidate specifically purchase a souvenir snow globe on the Champs-Elysees?',
    promptEn: 'Why did the candidate specifically purchase a souvenir snow globe on the Champs-Elysees?',
    context: 'Candidate: "I even bought a souvenir snow globe for my friend Julie, as she collects them."',
    contextEn: 'Candidate: "I even bought a souvenir snow globe for my friend Julie, as she collects them."',
    audioText: "I even bought a souvenir snow globe for my friend Julie, as she collects them.",
    options: [
      'Her friend Julie has a personal hobby of collecting snow globes',
      'It was offered at a mandatory 50% boutique promotional discount',
      'It depicted the rare winter snowfall of the French Alps',
      'Her family tradition requires bringing home a musical ornament'
    ],
    optionsVi: [
      'Bạn của cô là Julie có sở thích sưu tầm các quả cầu tuyết',
      'Nó được giảm giá khuyến mãi bắt buộc 50% tại cửa hàng',
      'Nó mô tả cảnh tuyết rơi mùa đông hiếm có của dãy Alps nước Pháp',
      'Truyền thống gia đình yêu cầu mang về một món đồ trang trí phát nhạc'
    ],
    optionsEn: [
      'Her friend Julie has a personal hobby of collecting snow globes',
      'It was offered at a mandatory 50% boutique promotional discount',
      'It depicted the rare winter snowfall of the French Alps',
      'Her family tradition requires bringing home a musical ornament'
    ],
    correctIndex: 0,
    correctAnswer: 'Her friend Julie has a personal hobby of collecting snow globes',
    explanation: 'Lý do mua quả cầu tuyết: "for my friend Julie, as she collects them".',
    explanationEn: 'The rationale is stated directly: "for my friend Julie, as she collects them".'
  },
  {
    id: 'med_lis_tour_bus_camera_t39',
    difficulty: 'medium',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What happened to the candidate\'s camera on the open-top tour bus?',
    promptEn: 'What happened to the candidate\'s camera on the open-top tour bus?',
    context: 'Candidate: "However, when I got back on the tour bus and started taking pictures, I dropped my camera over the side, watching it break on the ground."',
    contextEn: 'Candidate: "However, when I got back on the tour bus and started taking pictures, I dropped my camera over the side, watching it break on the ground."',
    audioText: "However, when I got back on the tour bus and started taking pictures, I dropped my camera over the side, watching it break on the ground.",
    options: [
      'It slipped over the railing and smashed into pieces on the ground below',
      'The memory card malfunctioned due to severe heat exposure',
      'A passing cyclist accidentally snatched it from her hands',
      'It fell into the tour bus mechanical gear compartment'
    ],
    optionsVi: [
      'Nó trượt qua mạn xe buýt và vỡ nát trên mặt đất phía dưới',
      'Thẻ nhớ bị hỏng do tiếp xúc với nhiệt độ quá cao',
      'Một người đi xe đạp ngang qua vô tình giật mất khỏi tay',
      'Nó rơi vào khoang bánh răng cơ khí của xe buýt du lịch'
    ],
    optionsEn: [
      'It slipped over the railing and smashed into pieces on the ground below',
      'The memory card malfunctioned due to severe heat exposure',
      'A passing cyclist accidentally snatched it from her hands',
      'It fell into the tour bus mechanical gear compartment'
    ],
    correctIndex: 0,
    correctAnswer: 'It slipped over the railing and smashed into pieces on the ground below',
    explanation: 'Tai nạn rơi máy ảnh: "I dropped my camera over the side, watching it break on the ground."',
    explanationEn: 'The mishap is: "I dropped my camera over the side, watching it break on the ground."'
  },
  {
    id: 'hard_lis_french_study_reflection_t39',
    difficulty: 'hard',
    topic: 'education',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What strategic language preparation does the candidate resolve to undertake before travelling abroad in future?',
    promptEn: 'What strategic language preparation does the candidate resolve to undertake before travelling abroad in future?',
    context: 'Candidate: "It was a great experience, although next time, I think I should study some French before I go."',
    contextEn: 'Candidate: "It was a great experience, although next time, I think I should study some French before I go."',
    audioText: "It was a great experience, although next time, I think I should study some French before I go.",
    options: [
      'Acquire basic destination language proficiency (study French) before departure',
      'Hire a professional round-the-clock simultaneous interpreter',
      'Rely exclusively on international English-speaking hotel staff',
      'Download offline computer translation software onto their mobile device'
    ],
    optionsVi: [
      'Trau dồi năng lực ngôn ngữ cơ bản của điểm đến (học tiếng Pháp) trước khi khởi hành',
      'Thuê một thông dịch viên cabin chuyên nghiệp phục vụ suốt ngày đêm',
      'Chỉ dựa vào nhân viên khách sạn nói tiếng Anh quốc tế',
      'Tải phần mềm dịch thuật ngoại tuyến vào thiết bị di động'
    ],
    optionsEn: [
      'Acquire basic destination language proficiency (study French) before departure',
      'Hire a professional round-the-clock simultaneous interpreter',
      'Rely exclusively on international English-speaking hotel staff',
      'Download offline computer translation software onto their mobile device'
    ],
    correctIndex: 0,
    correctAnswer: 'Acquire basic destination language proficiency (study French) before departure',
    explanation: 'Lời tự nhủ và kinh nghiệm rút ra: "next time, I think I should study some French before I go."',
    explanationEn: 'The candidate reflects: "next time, I think I should study some French before I go."'
  },

  // ==========================================
  // TRACK 40: COMPLEX SENTENCES & CONNECTORS (GRA BAND 7.5 - 8.5)
  // ==========================================
  {
    id: 'easy_lis_sentential_which_t40',
    difficulty: 'easy',
    topic: 'grammar',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What grammatical function does the relative clause introduced by "which" perform in Sentence 1?',
    promptEn: 'What grammatical function does the relative clause introduced by "which" perform in Sentence 1?',
    context: 'Narrator: "I boarded a plane to Paris, which was rather exciting as I\'d never done that before."',
    contextEn: 'Narrator: "I boarded a plane to Paris, which was rather exciting as I\'d never done that before."',
    audioText: "I boarded a plane to Paris, which was rather exciting as I'd never done that before.",
    options: [
      'It provides an evaluative commentary modifying the entire preceding clause',
      'It defines the geographical airport location in Paris',
      'It introduces a hypothetical conditional circumstance',
      'It acts as an imperative instruction to flight personnel'
    ],
    optionsVi: [
      'Nó cung cấp lời bình luận đánh giá bổ nghĩa cho toàn bộ mệnh đề đi trước',
      'Nó xác định vị trí địa lý của sân bay tại Paris',
      'Nó giới thiệu một điều kiện giả định trong quá khứ',
      'Nó đóng vai trò như một câu mệnh lệnh cho tiếp viên hàng không'
    ],
    optionsEn: [
      'It provides an evaluative commentary modifying the entire preceding clause',
      'It defines the geographical airport location in Paris',
      'It introduces a hypothetical conditional circumstance',
      'It acts as an imperative instruction to flight personnel'
    ],
    correctIndex: 0,
    correctAnswer: 'It provides an evaluative commentary modifying the entire preceding clause',
    explanation: 'Mệnh đề "which was rather exciting" bổ nghĩa cho cả hành động đi máy bay đến Paris.',
    explanationEn: 'The non-defining relative clause "which was rather exciting" modifies the entire preceding event.'
  },
  {
    id: 'med_lis_causal_since_t40',
    difficulty: 'medium',
    topic: 'grammar',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Sentence 2, what semantic relationship does the subordinator "Since" establish?',
    promptEn: 'In Sentence 2, what semantic relationship does the subordinator "Since" establish?',
    context: 'Narrator: "Since I come from China, it took a long time to arrive, but when I got there, the first thing I did was go to the Louvre Museum."',
    contextEn: 'Narrator: "Since I come from China, it took a long time to arrive, but when I got there, the first thing I did was go to the Louvre Museum."',
    audioText: "Since I come from China, it took a long time to arrive, but when I got there, the first thing I did was go to the Louvre Museum.",
    options: [
      'A known causal background explaining why the journey was lengthy',
      'A chronological point in time beginning in a specific calendar year',
      'A concessive counter-argument contradicting the flight schedule',
      'An unexpected negative consequence of visiting France'
    ],
    optionsVi: [
      'Một bối cảnh nguyên nhân đã biết giải thích tại sao chuyến đi mất nhiều thời gian',
      'Một mốc thời gian tuần tự bắt đầu từ một năm cụ thể',
      'Một lập luận nhượng bộ mâu thuẫn với lịch trình bay',
      'Một hệ quả tiêu cực bất ngờ của chuyến thăm nước Pháp'
    ],
    optionsEn: [
      'A known causal background explaining why the journey was lengthy',
      'A chronological point in time beginning in a specific calendar year',
      'A concessive counter-argument contradicting the flight schedule',
      'An unexpected negative consequence of visiting France'
    ],
    correctIndex: 0,
    correctAnswer: 'A known causal background explaining why the journey was lengthy',
    explanation: '"Since I come from China" đóng vai trò là liên từ chỉ nguyên nhân/bối cảnh đã rõ.',
    explanationEn: '"Since I come from China" functions as a causal subordinator of established background.'
  },
  {
    id: 'easy_lis_reason_because_t40',
    difficulty: 'easy',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'According to Sentence 3, why did the speaker encounter trouble ordering food?',
    promptEn: 'According to Sentence 3, why did the speaker encounter trouble ordering food?',
    context: 'Narrator: "I had trouble ordering food, because I don\'t speak any French."',
    contextEn: 'Narrator: "I had trouble ordering food, because I don\'t speak any French."',
    audioText: "I had trouble ordering food, because I don't speak any French.",
    options: [
      'The speaker does not speak any French',
      'The restaurant had run out of printed menus',
      'The restaurant only accepted local cash currency',
      'The waiter refused to serve foreign tourists'
    ],
    optionsVi: [
      'Người nói hoàn toàn không thể nói được tiếng Pháp',
      'Nhà hàng đã hết thực đơn in sẵn',
      'Nhà hàng chỉ chấp nhận thanh toán bằng tiền mặt địa phương',
      'Bồi bàn từ chối phục vụ khách du lịch nước ngoài'
    ],
    optionsEn: [
      'The speaker does not speak any French',
      'The restaurant had run out of printed menus',
      'The restaurant only accepted local cash currency',
      'The waiter refused to serve foreign tourists'
    ],
    correctIndex: 0,
    correctAnswer: 'The speaker does not speak any French',
    explanation: 'Lý do được nêu rõ: "because I don\'t speak any French".',
    explanationEn: 'The direct cause is explicitly given: "because I don\'t speak any French".'
  },
  {
    id: 'med_lis_time_once_t40',
    difficulty: 'medium',
    topic: 'grammar',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Sentence 4, what is the role of the temporal subordinator "Once"?',
    promptEn: 'In Sentence 4, what is the role of the temporal subordinator "Once"?',
    context: 'Narrator: "Once I had eaten, I then took a tour bus to the Champs-Élysées, in order to do a bit of shopping."',
    contextEn: 'Narrator: "Once I had eaten, I then took a tour bus to the Champs-Elysees, in order to do a bit of shopping."',
    audioText: "Once I had eaten, I then took a tour bus to the Champs-Elysees, in order to do a bit of shopping.",
    options: [
      'Specifying that the bus boarding immediately followed the completed meal',
      'Indicating that the speaker had visited the Champs-Elysees only a single time',
      'Hypothesizing about an imaginary dining experience in Paris',
      'Explaining why shopping was prohibitively expensive on the avenue'
    ],
    optionsVi: [
      'Chỉ rõ việc lên xe buýt diễn ra ngay sau khi bữa ăn đã hoàn thành',
      'Chỉ ra rằng người nói chỉ mới đến Champs-Élysées đúng một lần duy nhất',
      'Giả định về một trải nghiệm ăn uống tưởng tượng ở Paris',
      'Giải thích tại sao việc mua sắm lại cực kỳ đắt đỏ trên đại lộ'
    ],
    optionsEn: [
      'Specifying that the bus boarding immediately followed the completed meal',
      'Indicating that the speaker had visited the Champs-Elysees only a single time',
      'Hypothesizing about an imaginary dining experience in Paris',
      'Explaining why shopping was prohibitively expensive on the avenue'
    ],
    correctIndex: 0,
    correctAnswer: 'Specifying that the bus boarding immediately followed the completed meal',
    explanation: '"Once I had eaten" diễn tả sự hoàn tất của một hành động trước khi hành động kế tiếp xảy ra.',
    explanationEn: '"Once I had eaten" establishes a completed condition precedent prior to taking the bus.'
  },
  {
    id: 'hard_lis_dropped_camera_t40',
    difficulty: 'hard',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'In Sentence 5, what mishap occurred while taking pictures from the tour bus?',
    promptEn: 'In Sentence 5, what mishap occurred while taking pictures from the tour bus?',
    context: 'Narrator: "When I got back on the tour bus and started taking pictures, I dropped my camera over the side."',
    contextEn: 'Narrator: "When I got back on the tour bus and started taking pictures, I dropped my camera over the side."',
    audioText: "When I got back on the tour bus and started taking pictures, I dropped my camera over the side.",
    options: [
      'The speaker dropped their camera over the side of the bus',
      'The camera battery overheated and ceased functioning',
      'The camera lens was scratched by tree branches along the avenue',
      'The memory card corrupted after recording video clips'
    ],
    optionsVi: [
      'Người nói đã làm rơi máy ảnh qua mạn xe buýt',
      'Pin máy ảnh bị quá nhiệt và ngừng hoạt động',
      'Ống kính máy ảnh bị trầy xước bởi cành cây dọc đại lộ',
      'Thẻ nhớ bị lỗi sau khi quay các đoạn video'
    ],
    optionsEn: [
      'The speaker dropped their camera over the side of the bus',
      'The camera battery overheated and ceased functioning',
      'The camera lens was scratched by tree branches along the avenue',
      'The memory card corrupted after recording video clips'
    ],
    correctIndex: 0,
    correctAnswer: 'The speaker dropped their camera over the side of the bus',
    explanation: 'Tai nạn được mô tả: "I dropped my camera over the side".',
    explanationEn: 'The incident is explicitly stated: "I dropped my camera over the side".'
  },
  // ==========================================
  // TRACK 41: TRAVEL EXPERIENCES & FOLLOW-UP QUESTIONS
  // ==========================================
  {
    id: 'easy_lis_tibet_memory_t41',
    difficulty: 'easy',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Which destination does Candidate A affirm he will always remember visiting?',
    promptEn: 'Which destination does Candidate A affirm he will always remember visiting?',
    context: 'Candidate A: "And it was a great experience. I think I\'ll always remember going to Tibet."',
    contextEn: 'Candidate A: "And it was a great experience. I think I\'ll always remember going to Tibet."',
    audioText: "And it was a great experience. I think I'll always remember going to Tibet.",
    options: [
      'Tibet',
      'Paris',
      'Rome',
      'London'
    ],
    optionsVi: [
      'Tây Tạng',
      'Paris',
      'Rome',
      'Luân Đôn'
    ],
    optionsEn: [
      'Tibet',
      'Paris',
      'Rome',
      'London'
    ],
    correctIndex: 0,
    correctAnswer: 'Tibet',
    explanation: 'Thí sinh A khẳng định: "I think I\'ll always remember going to Tibet."',
    explanationEn: 'Candidate A explicitly states: "I think I\'ll always remember going to Tibet."'
  },
  {
    id: 'med_lis_travel_value_t41',
    difficulty: 'medium',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why does Candidate A consider travelling to be of primary importance to his life?',
    promptEn: 'Why does Candidate A consider travelling to be of primary importance to his life?',
    context: 'Candidate A: "Yes, I would say I like to try new things, meet new people, so travelling is something that is very important to me."',
    contextEn: 'Candidate A: "Yes, I would say I like to try new things, meet new people, so travelling is something that is very important to me."',
    audioText: "Yes, I would say I like to try new things, meet new people, so travelling is something that is very important to me.",
    options: [
      'It lets him try new things and meet new people',
      'It allows him to earn professional international credentials',
      'It provides relief from demanding domestic employment',
      'It fulfills his academic research requirements'
    ],
    optionsVi: [
      'Giúp anh ấy thử nghiệm những điều mới và gặp gỡ nhiều người mới',
      'Cho phép anh đạt được các chứng chỉ quốc tế chuyên nghiệp',
      'Mang lại sự giải tỏa khỏi áp lực công việc bận rộn trong nước',
      'Đáp ứng các yêu cầu nghiên cứu học thuật của anh'
    ],
    optionsEn: [
      'It lets him try new things and meet new people',
      'It allows him to earn professional international credentials',
      'It provides relief from demanding domestic employment',
      'It fulfills his academic research requirements'
    ],
    correctIndex: 0,
    correctAnswer: 'It lets him try new things and meet new people',
    explanation: 'Thí sinh A trả lời: "I like to try new things, meet new people, so travelling is something that is very important to me."',
    explanationEn: 'Candidate A states: "I like to try new things, meet new people, so travelling is something that is very important to me."'
  },
  {
    id: 'easy_lis_paris_culture_t41',
    difficulty: 'easy',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What standout quality makes Paris one of the finest places on Earth according to Candidate B?',
    promptEn: 'What standout quality makes Paris one of the finest places on Earth according to Candidate B?',
    context: 'Candidate B: "And it was a great experience. I think Paris is one of the best places on Earth for culture."',
    contextEn: 'Candidate B: "And it was a great experience. I think Paris is one of the best places on Earth for culture."',
    audioText: "And it was a great experience. I think Paris is one of the best places on Earth for culture.",
    options: [
      'Its rich cultural heritage',
      'Its modern high-tech transport infrastructure',
      'Its affordable shopping boutiques',
      'Its subtropical sunny climate'
    ],
    optionsVi: [
      'Di sản và đời sống văn hóa phong phú',
      'Hạ tầng giao thông công nghệ cao hiện đại',
      'Các cửa hiệu mua sắm giá cả phải chăng',
      'Khí hậu cận nhiệt đới ngập tràn ánh nắng'
    ],
    optionsEn: [
      'Its rich cultural heritage',
      'Its modern high-tech transport infrastructure',
      'Its affordable shopping boutiques',
      'Its subtropical sunny climate'
    ],
    correctIndex: 0,
    correctAnswer: 'Its rich cultural heritage',
    explanation: 'Thí sinh B nhận định: "I think Paris is one of the best places on Earth for culture."',
    explanationEn: 'Candidate B notes: "I think Paris is one of the best places on Earth for culture."'
  },
  {
    id: 'med_lis_rome_opera_t41',
    difficulty: 'medium',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What two personal passions motivate Candidate B to place Rome next on her destination list?',
    promptEn: 'What two personal passions motivate Candidate B to place Rome next on her destination list?',
    context: 'Candidate B: "Yes, I\'ve always thought about going to Rome. I mean, I\'m a big fan of the opera and love Italian food, so it\'s next on my list of destinations."',
    contextEn: 'Candidate B: "Yes, I\'ve always thought about going to Rome. I mean, I\'m a big fan of the opera and love Italian food, so it\'s next on my list of destinations."',
    audioText: "Yes, I've always thought about going to Rome. I mean, I'm a big fan of the opera and love Italian food, so it's next on my list of destinations.",
    options: [
      'Her passion for opera and love of Italian food',
      'Her interest in ancient architecture and classical sculpture',
      'Her enthusiasm for fashion shopping and beach resorts',
      'Her research on Renaissance philosophy and literature'
    ],
    optionsVi: [
      'Niềm đam mê với opera và tình yêu ẩm thực Ý',
      'Sự quan tâm đến kiến trúc cổ đại và điêu khắc cổ điển',
      'Sự hào hứng với mua sắm thời trang và nghỉ dưỡng bãi biển',
      'Đề tài nghiên cứu về triết học và văn học thời kỳ Phục hưng'
    ],
    optionsEn: [
      'Her passion for opera and love of Italian food',
      'Her interest in ancient architecture and classical sculpture',
      'Her enthusiasm for fashion shopping and beach resorts',
      'Her research on Renaissance philosophy and literature'
    ],
    correctIndex: 0,
    correctAnswer: 'Her passion for opera and love of Italian food',
    explanation: 'Thí sinh B giải thích: "I\'m a big fan of the opera and love Italian food, so it\'s next on my list of destinations."',
    explanationEn: 'Candidate B explains: "I\'m a big fan of the opera and love Italian food, so it\'s next on my list of destinations."'
  },
  {
    id: 'hard_lis_london_umbrella_advice_t41',
    difficulty: 'hard',
    topic: 'travel',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Despite complaining about the bad weather, what is Candidate C\'s ultimate stance on recommending London?',
    promptEn: 'Despite complaining about the bad weather, what is Candidate C\'s ultimate stance on recommending London?',
    context: 'Candidate C: "Yes, definitely. But they would have to bring an umbrella. Everything else was wonderful though. I would definitely recommend it."',
    contextEn: 'Candidate C: "Yes, definitely. But they would have to bring an umbrella. Everything else was wonderful though. I would definitely recommend it."',
    audioText: "Yes, definitely. But they would have to bring an umbrella. Everything else was wonderful though. I would definitely recommend it.",
    options: [
      'He recommends it wholeheartedly but advises packing an umbrella',
      'He strongly discourages visiting due to relentless rainstorms',
      'He suggests visiting only during heatwaves in midsummer',
      'He remains indecisive until meteorological records improve'
    ],
    optionsVi: [
      'Nhiệt tình đề xuất điểm đến nhưng khuyên nên mang theo ô',
      'Kiên quyết khuyên không nên đến vì những cơn mưa tầm tã liên tục',
      'Đề xuất chỉ nên đến vào những đợt nắng nóng giữa mùa hè',
      'Vẫn do dự chưa quyết cho đến khi dữ liệu khí tượng có dấu hiệu cải thiện'
    ],
    optionsEn: [
      'He recommends it wholeheartedly but advises packing an umbrella',
      'He strongly discourages visiting due to relentless rainstorms',
      'He suggests visiting only during heatwaves in midsummer',
      'He remains indecisive until meteorological records improve'
    ],
    correctIndex: 0,
    correctAnswer: 'He recommends it wholeheartedly but advises packing an umbrella',
    explanation: 'Thí sinh C trả lời: "Yes, definitely. But they would have to bring an umbrella... Everything else was wonderful though. I would definitely recommend it."',
    explanationEn: 'Candidate C confirms: "Yes, definitely. But they would have to bring an umbrella... Everything else was wonderful though. I would definitely recommend it."'
  },
  // ==========================================
  // TRACK 42: UK BUSINESS STRUCTURES & SELF-EMPLOYMENT
  // ==========================================
  {
    id: 'easy_lis_companies_house_t42',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Which UK government agency is legally tasked with the registration of limited companies?',
    promptEn: 'Which UK government agency is legally tasked with the registration of limited companies?',
    context: 'Lecturer: "those wanting to set up a limited liability company have to legally register the company with Companies House, the government department responsible for businesses."',
    contextEn: 'Lecturer: "those wanting to set up a limited liability company have to legally register the company with Companies House, the government department responsible for businesses."',
    audioText: "those wanting to set up a limited liability company have to legally register the company with Companies House, the government department responsible for businesses.",
    options: [
      'Companies House',
      'HM Revenue and Customs',
      'The Bank of England',
      'The Department of Work and Pensions'
    ],
    optionsVi: [
      'Companies House (Cơ quan đăng ký kinh doanh)',
      'HM Revenue and Customs (Cơ quan Thuế & Hải quan)',
      'The Bank of England (Ngân hàng Trung ương Anh)',
      'The Department of Work and Pensions (Bộ Lao động & Lương hưu)'
    ],
    optionsEn: [
      'Companies House',
      'HM Revenue and Customs',
      'The Bank of England',
      'The Department of Work and Pensions'
    ],
    correctIndex: 0,
    correctAnswer: 'Companies House',
    explanation: 'Giảng viên nêu rõ cơ quan phụ trách là "Companies House, the government department responsible for businesses".',
    explanationEn: 'The lecturer explicitly identifies the agency: "Companies House, the government department responsible for businesses".'
  },
  {
    id: 'med_lis_limited_liability_loss_t42',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What constitutes the extent of financial loss for company owners under limited liability if the firm collapses?',
    promptEn: 'What constitutes the extent of financial loss for company owners under limited liability if the firm collapses?',
    context: 'Lecturer: "Limited liability means that if the business fails and the owners owe a lot of money, they only lose the money and goods which are in the business, and not their own personal money and goods."',
    contextEn: 'Lecturer: "Limited liability means that if the business fails and the owners owe a lot of money, they only lose the money and goods which are in the business, and not their own personal money and goods."',
    audioText: "Limited liability means that if the business fails and the owners owe a lot of money, they only lose the money and goods which are in the business, and not their own personal money and goods.",
    options: [
      'Only the money and goods held within the business',
      'Their private residential property and personal bank accounts',
      'An automatic fine equivalent to ten years of projected revenue',
      'All assets belonging to their immediate family members'
    ],
    optionsVi: [
      'Chỉ số tiền và hàng hóa thuộc quyền sở hữu của doanh nghiệp',
      'Bất động sản nhà ở riêng và tài khoản ngân hàng cá nhân',
      'Khoản tiền phạt tự động tương đương 10 năm doanh thu dự kiến',
      'Toàn bộ tài sản thuộc về các thành viên gia đình trực hệ'
    ],
    optionsEn: [
      'Only the money and goods held within the business',
      'Their private residential property and personal bank accounts',
      'An automatic fine equivalent to ten years of projected revenue',
      'All assets belonging to their immediate family members'
    ],
    correctIndex: 0,
    correctAnswer: 'Only the money and goods held within the business',
    explanation: 'Chế độ TNHH quy định chủ sở hữu chỉ chịu thiệt hại đối với tài sản thuộc công ty ("only lose the money and goods which are in the business").',
    explanationEn: 'Limited liability stipulates owners only lose business money and goods, keeping personal assets safe.'
  },
  {
    id: 'easy_lis_sole_trader_registration_t42',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What legal registration is required before a sole trader can start doing business in the UK?',
    promptEn: 'What legal registration is required before a sole trader can start doing business in the UK?',
    context: 'Lecturer: "On the other hand, a sole trader doesn\'t need to set up a company. He or she can simply start working without any legal registration."',
    contextEn: 'Lecturer: "On the other hand, a sole trader doesn\'t need to set up a company. He or she can simply start working without any legal registration."',
    audioText: "On the other hand, a sole trader doesn't need to set up a company. He or she can simply start working without any legal registration.",
    options: [
      'No legal registration is required to start working',
      'Compulsory registration with the High Court of Justice',
      'A corporate charter approved by Parliament',
      'A mandatory partnership deed registered at town hall'
    ],
    optionsVi: [
      'Không yêu cầu bất kỳ thủ tục đăng ký pháp lý nào để bắt đầu làm việc',
      'Đăng ký bắt buộc với Tòa án Công lý Tối cao',
      'Hiến chương doanh nghiệp được Quốc hội phê chuẩn',
      'Khế ước hợp danh bắt buộc được đăng ký tại tòa thị chính'
    ],
    optionsEn: [
      'No legal registration is required to start working',
      'Compulsory registration with the High Court of Justice',
      'A corporate charter approved by Parliament',
      'A mandatory partnership deed registered at town hall'
    ],
    correctIndex: 0,
    correctAnswer: 'No legal registration is required to start working',
    explanation: 'Giảng viên khẳng định hộ kinh doanh cá thể có thể bắt đầu làm việc mà không cần bất kỳ đăng ký pháp lý nào ("simply start working without any legal registration").',
    explanationEn: 'The lecturer affirms that a sole trader can commence operations without any legal registration.'
  },
  {
    id: 'med_lis_bank_loan_trust_t42',
    difficulty: 'medium',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Why do UK commercial banks generally exhibit greater willingness to lend to limited companies over sole traders?',
    promptEn: 'Why do UK commercial banks generally exhibit greater willingness to lend to limited companies over sole traders?',
    context: 'Lecturer: "For example, it might be difficult to borrow money from the bank if you\'re a sole trader, but easier if you have a limited company, as banks trust companies more."',
    contextEn: 'Lecturer: "For example, it might be difficult to borrow money from the bank if you\'re a sole trader, but easier if you have a limited company, as banks trust companies more."',
    audioText: "For example, it might be difficult to borrow money from the bank if you're a sole trader, but easier if you have a limited company, as banks trust companies more.",
    options: [
      'Banks place higher trust and confidence in corporate business structures',
      'Sole traders are barred from holding commercial bank accounts',
      'The central bank underwrites all debts incurred by limited companies',
      'Limited companies offer higher personal collateral from individual partners'
    ],
    optionsVi: [
      'Các ngân hàng đặt mức độ tín nhiệm và tin tưởng cao hơn vào mô hình công ty',
      'Hộ kinh doanh cá thể bị cấm mở tài khoản ngân hàng thương mại',
      'Ngân hàng trung ương bảo lãnh toàn bộ các khoản nợ của công ty TNHH',
      'Các công ty cung cấp tài sản thế chấp cá nhân cao hơn từ các cổ đông'
    ],
    optionsEn: [
      'Banks place higher trust and confidence in corporate business structures',
      'Sole traders are barred from holding commercial bank accounts',
      'The central bank underwrites all debts incurred by limited companies',
      'Limited companies offer higher personal collateral from individual partners'
    ],
    correctIndex: 0,
    correctAnswer: 'Banks place higher trust and confidence in corporate business structures',
    explanation: 'Ngân hàng tin tưởng công ty hơn cá nhân kinh doanh: "as banks trust companies more".',
    explanationEn: 'Commercial banks display greater willingness to lend to limited companies because they trust incorporated firms more.'
  },
  {
    id: 'hard_lis_corporation_vs_income_tax_t42',
    difficulty: 'hard',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'What fundamental tax distinction is highlighted between limited companies and sole traders/partnerships?',
    promptEn: 'What fundamental tax distinction is highlighted between limited companies and sole traders/partnerships?',
    context: 'Lecturer: "Regarding tax, limited companies pay corporation tax, which, unlike income tax, is a tax on business profits, not personal earnings... with sole traders and partnerships... the owners must pay income tax"',
    contextEn: 'Lecturer: "Regarding tax, limited companies pay corporation tax, which, unlike income tax, is a tax on business profits, not personal earnings... with sole traders and partnerships... the owners must pay income tax"',
    audioText: "Regarding tax, limited companies pay corporation tax, which, unlike income tax, is a tax on business profits, not personal earnings... with sole traders and partnerships... the owners must pay income tax",
    options: [
      'Limited companies pay corporation tax on profits, whereas sole traders and partners pay income tax',
      'Sole traders pay corporation tax whereas limited companies pay zero direct taxes',
      'Partnerships pay corporation tax on behalf of local municipal councils',
      'Limited companies pay income tax quarterly whereas sole traders pay annually'
    ],
    optionsVi: [
      'Công ty TNHH nộp thuế TNDN trên lợi nhuận, còn chủ hộ kinh doanh và hợp danh nộp thuế TNCN',
      'Hộ kinh doanh cá thể nộp thuế TNDN còn công ty TNHH không phải nộp thuế trực thu',
      'Các công ty hợp danh nộp thuế TNDN thay mặt cho hội đồng thành phố',
      'Công ty TNHH nộp thuế TNCN hàng quý trong khi hộ kinh doanh nộp theo năm'
    ],
    optionsEn: [
      'Limited companies pay corporation tax on profits, whereas sole traders and partners pay income tax',
      'Sole traders pay corporation tax whereas limited companies pay zero direct taxes',
      'Partnerships pay corporation tax on behalf of local municipal councils',
      'Limited companies pay income tax quarterly whereas sole traders pay annually'
    ],
    correctIndex: 0,
    correctAnswer: 'Limited companies pay corporation tax on profits, whereas sole traders and partners pay income tax',
    explanation: 'Công ty TNHH nộp corporation tax trên lợi nhuận, còn sole traders và partnerships nộp income tax trên thu nhập.',
    explanationEn: 'Limited companies are subject to corporation tax on profits, whereas sole traders and partnerships pay personal income tax.'
  }
];

const R2_BASE = 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev';

const R2_AUDIO_METADATA_BY_ID = {
  // Track 42: UK Business Structures & Self-Employment
  easy_lis_companies_house_t42: { audioUrl: `${R2_BASE}/ielts-listening-track42-uk-business-structures.mp3`, clipStart: 50.0, clipEnd: 63.0, isR2Audio: true, trackLabel: 'Track 42 • Companies House Registry' },
  med_lis_limited_liability_loss_t42: { audioUrl: `${R2_BASE}/ielts-listening-track42-uk-business-structures.mp3`, clipStart: 63.0, clipEnd: 76.0, isR2Audio: true, trackLabel: 'Track 42 • Limited Liability Scope' },
  easy_lis_sole_trader_registration_t42: { audioUrl: `${R2_BASE}/ielts-listening-track42-uk-business-structures.mp3`, clipStart: 80.0, clipEnd: 90.0, isR2Audio: true, trackLabel: 'Track 42 • Sole Trader Registration' },
  med_lis_bank_loan_trust_t42: { audioUrl: `${R2_BASE}/ielts-listening-track42-uk-business-structures.mp3`, clipStart: 138.0, clipEnd: 148.0, isR2Audio: true, trackLabel: 'Track 42 • Bank Loan Credibility' },
  hard_lis_corporation_vs_income_tax_t42: { audioUrl: `${R2_BASE}/ielts-listening-track42-uk-business-structures.mp3`, clipStart: 149.0, clipEnd: 175.0, isR2Audio: true, trackLabel: 'Track 42 • Corporate vs Income Tax' },

  // Track 41: Speaking Part 2 & 3 Travel Experiences & Follow-up Questions
  easy_lis_tibet_memory_t41: { audioUrl: `${R2_BASE}/ielts-listening-track41-speaking-followup-travel.mp3`, clipStart: 3.0, clipEnd: 10.0, isR2Audio: true, trackLabel: 'Track 41 • Tibet Memory' },
  med_lis_travel_value_t41: { audioUrl: `${R2_BASE}/ielts-listening-track41-speaking-followup-travel.mp3`, clipStart: 9.0, clipEnd: 21.0, isR2Audio: true, trackLabel: 'Track 41 • Value of Travelling' },
  easy_lis_paris_culture_t41: { audioUrl: `${R2_BASE}/ielts-listening-track41-speaking-followup-travel.mp3`, clipStart: 21.0, clipEnd: 30.0, isR2Audio: true, trackLabel: 'Track 41 • Paris Culture' },
  med_lis_rome_opera_t41: { audioUrl: `${R2_BASE}/ielts-listening-track41-speaking-followup-travel.mp3`, clipStart: 39.0, clipEnd: 54.0, isR2Audio: true, trackLabel: 'Track 41 • Rome Opera & Food' },
  hard_lis_london_umbrella_advice_t41: { audioUrl: `${R2_BASE}/ielts-listening-track41-speaking-followup-travel.mp3`, clipStart: 63.0, clipEnd: 91.0, isR2Audio: true, trackLabel: 'Track 41 • London Umbrella Advice' },

  // Track 40: Complex Sentences & Discourse Connectors
  easy_lis_sentential_which_t40: { audioUrl: `${R2_BASE}/ielts-listening-track40-complex-sentences-connectors.mp3`, clipStart: 2.0, clipEnd: 10.0, isR2Audio: true, trackLabel: 'Track 40 • Sentential Relative Clause' },
  med_lis_causal_since_t40: { audioUrl: `${R2_BASE}/ielts-listening-track40-complex-sentences-connectors.mp3`, clipStart: 10.0, clipEnd: 22.0, isR2Audio: true, trackLabel: 'Track 40 • Causal Subordinator Since' },
  easy_lis_reason_because_t40: { audioUrl: `${R2_BASE}/ielts-listening-track40-complex-sentences-connectors.mp3`, clipStart: 22.0, clipEnd: 28.5, isR2Audio: true, trackLabel: 'Track 40 • Food Ordering Barrier' },
  med_lis_time_once_t40: { audioUrl: `${R2_BASE}/ielts-listening-track40-complex-sentences-connectors.mp3`, clipStart: 29.0, clipEnd: 39.0, isR2Audio: true, trackLabel: 'Track 40 • Time Sequence Once' },
  hard_lis_dropped_camera_t40: { audioUrl: `${R2_BASE}/ielts-listening-track40-complex-sentences-connectors.mp3`, clipStart: 39.0, clipEnd: 49.0, isR2Audio: true, trackLabel: 'Track 40 • Tour Bus Dropped Camera' },

  // Track 39: Speaking Part 2 Candidate Sample (Paris Journey)
  easy_lis_paris_departure_t39: { audioUrl: `${R2_BASE}/ielts-listening-track39-speaking-part2-candidate-sample.mp3`, clipStart: 2.0, clipEnd: 13.5, isR2Audio: true, trackLabel: 'Track 39 • Departure Date to Paris' },
  easy_lis_louvre_triangle_t39: { audioUrl: `${R2_BASE}/ielts-listening-track39-speaking-part2-candidate-sample.mp3`, clipStart: 18.0, clipEnd: 28.0, isR2Audio: true, trackLabel: 'Track 39 • Louvre Triangle Entrance' },
  med_lis_julie_snow_globe_t39: { audioUrl: `${R2_BASE}/ielts-listening-track39-speaking-part2-candidate-sample.mp3`, clipStart: 53.0, clipEnd: 60.0, isR2Audio: true, trackLabel: 'Track 39 • Julie Souvenir Snow Globe' },
  med_lis_tour_bus_camera_t39: { audioUrl: `${R2_BASE}/ielts-listening-track39-speaking-part2-candidate-sample.mp3`, clipStart: 59.5, clipEnd: 69.5, isR2Audio: true, trackLabel: 'Track 39 • Dropped Camera Mishap' },
  hard_lis_french_study_reflection_t39: { audioUrl: `${R2_BASE}/ielts-listening-track39-speaking-part2-candidate-sample.mp3`, clipStart: 70.0, clipEnd: 82.5, isR2Audio: true, trackLabel: 'Track 39 • French Study Reflection' },

  // Track 38: Speaking Part 2 Examiner Prompt
  easy_lis_prep_time_t38: { audioUrl: `${R2_BASE}/ielts-listening-track38-speaking-part2-journey-prompt.mp3`, clipStart: 9.0, clipEnd: 12.0, isR2Audio: true, trackLabel: 'Track 38 • Speaking Part 2 Preparation Time' },
  easy_lis_paper_pencil_t38: { audioUrl: `${R2_BASE}/ielts-listening-track38-speaking-part2-journey-prompt.mp3`, clipStart: 12.0, clipEnd: 16.5, isR2Audio: true, trackLabel: 'Track 38 • Note-Taking Stationery' },
  med_lis_interruption_procedure_t38: { audioUrl: `${R2_BASE}/ielts-listening-track38-speaking-part2-journey-prompt.mp3`, clipStart: 16.0, clipEnd: 24.5, isR2Audio: true, trackLabel: 'Track 38 • Examiner Interruption Protocol' },
  med_lis_time_ceiling_t38: { audioUrl: `${R2_BASE}/ielts-listening-track38-speaking-part2-journey-prompt.mp3`, clipStart: 2.0, clipEnd: 9.0, isR2Audio: true, trackLabel: 'Track 38 • Speaking Delivery Ceiling' },
  hard_lis_cue_card_journey_t38: { audioUrl: `${R2_BASE}/ielts-listening-track38-speaking-part2-journey-prompt.mp3`, clipStart: 2.0, clipEnd: 28.0, isR2Audio: true, trackLabel: 'Track 38 • Memorable Journey Cue Card' },

  // Track 37: Ashtown 25-Year Urban Transformation & Survey Review
  med_lis_bus_destination_fall_t37: { audioUrl: `${R2_BASE}/ielts-listening-track37-ashtown-urban-transformation.mp3`, clipStart: 33.0, clipEnd: 58.0, isR2Audio: true, trackLabel: 'Track 37 • Bus Destination Constraints' },
  easy_lis_bypass_unbuilt_status_t37: { audioUrl: `${R2_BASE}/ielts-listening-track37-ashtown-urban-transformation.mp3`, clipStart: 63.5, clipEnd: 77.0, isR2Audio: true, trackLabel: 'Track 37 • Unrealized Bypass Scheme' },
  med_lis_education_job_growth_t37: { audioUrl: `${R2_BASE}/ielts-listening-track37-ashtown-urban-transformation.mp3`, clipStart: 104.0, clipEnd: 128.0, isR2Audio: true, trackLabel: 'Track 37 • Higher Education Employment' },
  easy_lis_cinema_relocation_t37: { audioUrl: `${R2_BASE}/ielts-listening-track37-ashtown-urban-transformation.mp3`, clipStart: 165.0, clipEnd: 177.0, isR2Audio: true, trackLabel: 'Track 37 • Grand Cinema King Street' },
  hard_lis_art_college_surgery_t37: { audioUrl: `${R2_BASE}/ielts-listening-track37-ashtown-urban-transformation.mp3`, clipStart: 265.0, clipEnd: 285.0, isR2Audio: true, trackLabel: 'Track 37 • Art College Doctor Surgery' },

  // Track 36: Agreement, Disagreement & Discourse Stance
  easy_lis_discourse_hedge_t36: { audioUrl: `${R2_BASE}/ielts-listening-track36-agreement-disagreement-intonation.mp3`, clipStart: 2.0, clipEnd: 7.0, isR2Audio: true, trackLabel: 'Track 36 • Polite Hedge Disagreement' },
  med_lis_concession_reality_t36: { audioUrl: `${R2_BASE}/ielts-listening-track36-agreement-disagreement-intonation.mp3`, clipStart: 12.0, clipEnd: 20.0, isR2Audio: true, trackLabel: 'Track 36 • Superficial Concession' },
  easy_lis_agenda_transition_t36: { audioUrl: `${R2_BASE}/ielts-listening-track36-agreement-disagreement-intonation.mp3`, clipStart: 21.0, clipEnd: 27.0, isR2Audio: true, trackLabel: 'Track 36 • Agenda Transition' },
  hard_lis_persuasion_common_ground_t36: { audioUrl: `${R2_BASE}/ielts-listening-track36-agreement-disagreement-intonation.mp3`, clipStart: 27.0, clipEnd: 36.5, isR2Audio: true, trackLabel: 'Track 36 • Persuasive Common Ground' },
  med_lis_empirical_town_hall_t36: { audioUrl: `${R2_BASE}/ielts-listening-track36-agreement-disagreement-intonation.mp3`, clipStart: 37.0, clipEnd: 46.5, isR2Audio: true, trackLabel: 'Track 36 • Empirical Town Hall Evidence' },

  // Track 35: Transport Scheme Benefits & Recommendations
  med_lis_transit_mode_winner_t35: { audioUrl: `${R2_BASE}/ielts-listening-track35-transport-benefits-recommendations.mp3`, clipStart: 33.0, clipEnd: 55.0, isR2Audio: true, trackLabel: 'Track 35 • Tramway Transit Superiority' },
  hard_lis_visitor_retail_rationale_t35: { audioUrl: `${R2_BASE}/ielts-listening-track35-transport-benefits-recommendations.mp3`, clipStart: 86.0, clipEnd: 103.0, isR2Audio: true, trackLabel: 'Track 35 • Pedestrian Precinct Footfall' },
  easy_lis_exercise_health_winner_t35: { audioUrl: `${R2_BASE}/ielts-listening-track35-transport-benefits-recommendations.mp3`, clipStart: 120.0, clipEnd: 136.0, isR2Audio: true, trackLabel: 'Track 35 • Cycling Exercise Benefits' },
  med_lis_pollution_park_ride_t35: { audioUrl: `${R2_BASE}/ielts-listening-track35-transport-benefits-recommendations.mp3`, clipStart: 154.0, clipEnd: 171.0, isR2Audio: true, trackLabel: 'Track 35 • Park & Ride Pollution Slash' },
  hard_lis_safety_cyclist_blindspot_t35: { audioUrl: `${R2_BASE}/ielts-listening-track35-transport-benefits-recommendations.mp3`, clipStart: 184.0, clipEnd: 207.0, isR2Audio: true, trackLabel: 'Track 35 • Shared Cyclist Hazard Resolution' },

  // Track 34: Transport Project Cost Analysis & Budget Estimation
  easy_lis_tram_max_cost_t34: { audioUrl: `${R2_BASE}/ielts-listening-track34-transport-project-cost-analysis.mp3`, clipStart: 22.0, clipEnd: 35.0, isR2Audio: true, trackLabel: 'Track 34 • Tram Budget Ceiling' },
  med_lis_bus_lane_total_t34: { audioUrl: `${R2_BASE}/ielts-listening-track34-transport-project-cost-analysis.mp3`, clipStart: 54.0, clipEnd: 71.0, isR2Audio: true, trackLabel: 'Track 34 • Bus Corridor Cost' },
  hard_lis_park_ride_component_t34: { audioUrl: `${R2_BASE}/ielts-listening-track34-transport-project-cost-analysis.mp3`, clipStart: 84.0, clipEnd: 102.0, isR2Audio: true, trackLabel: 'Track 34 • Shuttle Bus Rental' },
  med_lis_pedestrian_cyclist_safety_t34: { audioUrl: `${R2_BASE}/ielts-listening-track34-transport-project-cost-analysis.mp3`, clipStart: 112.0, clipEnd: 124.0, isR2Audio: true, trackLabel: 'Track 34 • Cyclist Road Safety' },
  easy_lis_robert_math_error_t34: { audioUrl: `${R2_BASE}/ielts-listening-track34-transport-project-cost-analysis.mp3`, clipStart: 133.0, clipEnd: 146.0, isR2Audio: true, trackLabel: 'Track 34 • Pedestrian Total Correction' },

  // Track 33: Transport Proposals & Feasibility Evaluation
  easy_lis_bus_lane_displacement_t33: { audioUrl: `${R2_BASE}/ielts-listening-track33-transport-solutions-evaluation.mp3`, clipStart: 26.0, clipEnd: 44.5, isR2Audio: true, trackLabel: 'Track 33 • Bus Lane Displacement' },
  med_lis_park_ride_takeup_t33: { audioUrl: `${R2_BASE}/ielts-listening-track33-transport-solutions-evaluation.mp3`, clipStart: 69.5, clipEnd: 89.0, isR2Audio: true, trackLabel: 'Track 33 • Park & Ride Take-up' },
  hard_lis_pedestrian_delivery_threat_t33: { audioUrl: `${R2_BASE}/ielts-listening-track33-transport-solutions-evaluation.mp3`, clipStart: 113.0, clipEnd: 127.5, isR2Audio: true, trackLabel: 'Track 33 • Pedestrian Delivery Threat' },
  med_lis_tram_network_scope_t33: { audioUrl: `${R2_BASE}/ielts-listening-track33-transport-solutions-evaluation.mp3`, clipStart: 131.5, clipEnd: 142.0, isR2Audio: true, trackLabel: 'Track 33 • Tram Network Scope' },
  easy_lis_tram_council_budget_t33: { audioUrl: `${R2_BASE}/ielts-listening-track33-transport-solutions-evaluation.mp3`, clipStart: 146.0, clipEnd: 157.0, isR2Audio: true, trackLabel: 'Track 33 • Tram Expense vs Council' },

  // Track 32: Urban Traffic Hotspots & Map Analysis
  easy_lis_town_hall_worst_t32: { audioUrl: `${R2_BASE}/ielts-listening-track32-urban-traffic-hotspots-mapping.mp3`, clipStart: 2.0, clipEnd: 15.0, isR2Audio: true, trackLabel: 'Track 32 • Town Hall Worst Spot' },
  med_lis_cinema_junction_t32: { audioUrl: `${R2_BASE}/ielts-listening-track32-urban-traffic-hotspots-mapping.mp3`, clipStart: 38.0, clipEnd: 50.0, isR2Audio: true, trackLabel: 'Track 32 • Starview Cinema Junction' },
  hard_lis_bus_manoeuvre_issue_t32: { audioUrl: `${R2_BASE}/ielts-listening-track32-urban-traffic-hotspots-mapping.mp3`, clipStart: 49.0, clipEnd: 58.0, isR2Audio: true, trackLabel: 'Track 32 • Bus Right Turn Issue' },
  med_lis_central_park_lorries_t32: { audioUrl: `${R2_BASE}/ielts-listening-track32-urban-traffic-hotspots-mapping.mp3`, clipStart: 119.0, clipEnd: 135.0, isR2Audio: true, trackLabel: 'Track 32 • Central Park Lorries' },
  easy_lis_lorry_restriction_solution_t32: { audioUrl: `${R2_BASE}/ielts-listening-track32-urban-traffic-hotspots-mapping.mp3`, clipStart: 135.0, clipEnd: 146.0, isR2Audio: true, trackLabel: 'Track 32 • Lorry Time Restriction' },

  // Track 31: Town Transport System & Project Discussion
  easy_lis_project_subject_t31: { audioUrl: `${R2_BASE}/ielts-listening-track31-urban-transport-project-discussion.mp3`, clipStart: 2.0, clipEnd: 15.0, isR2Audio: true, trackLabel: 'Track 31 • Project Scope' },
  med_lis_rail_budget_trouble_t31: { audioUrl: `${R2_BASE}/ielts-listening-track31-urban-transport-project-discussion.mp3`, clipStart: 53.0, clipEnd: 65.0, isR2Audio: true, trackLabel: 'Track 31 • Rail Financial Problems' },
  hard_lis_accident_paradox_t31: { audioUrl: `${R2_BASE}/ielts-listening-track31-urban-transport-project-discussion.mp3`, clipStart: 90.0, clipEnd: 105.0, isR2Audio: true, trackLabel: 'Track 31 • Accident Rate Paradox' },
  med_lis_air_quality_illness_t31: { audioUrl: `${R2_BASE}/ielts-listening-track31-urban-transport-project-discussion.mp3`, clipStart: 113.0, clipEnd: 124.0, isR2Audio: true, trackLabel: 'Track 31 • Air Quality & Asthma' },
  easy_lis_business_tardiness_t31: { audioUrl: `${R2_BASE}/ielts-listening-track31-urban-transport-project-discussion.mp3`, clipStart: 124.0, clipEnd: 136.0, isR2Audio: true, trackLabel: 'Track 31 • Business Financial Loss' },

  // Track 30: Everyday Transport & Travel Conversations
  easy_lis_bus_interval_t30: { audioUrl: `${R2_BASE}/ielts-listening-track30-transport-travel-conversations.mp3`, clipStart: 10.0, clipEnd: 20.0, isR2Audio: true, trackLabel: 'Track 30 • Dialogue 1 Bus Schedule' },
  med_lis_train_replacement_bus_t30: { audioUrl: `${R2_BASE}/ielts-listening-track30-transport-travel-conversations.mp3`, clipStart: 47.0, clipEnd: 58.0, isR2Audio: true, trackLabel: 'Track 30 • Dialogue 2 Train Replacement Bus' },
  med_lis_bristol_motorway_fog_t30: { audioUrl: `${R2_BASE}/ielts-listening-track30-transport-travel-conversations.mp3`, clipStart: 72.0, clipEnd: 83.0, isR2Audio: true, trackLabel: 'Track 30 • Dialogue 3 Fog & Jams' },
  hard_lis_car_tomorrow_reason_t30: { audioUrl: `${R2_BASE}/ielts-listening-track30-transport-travel-conversations.mp3`, clipStart: 125.0, clipEnd: 135.0, isR2Audio: true, trackLabel: 'Track 30 • Dialogue 4 Equipment Drive' },
  easy_lis_motorbike_gap_t30: { audioUrl: `${R2_BASE}/ielts-listening-track30-transport-travel-conversations.mp3`, clipStart: 154.0, clipEnd: 166.0, isR2Audio: true, trackLabel: 'Track 30 • Dialogue 5 Motorbike Tour' },

  // Track 29: Intonation, Sentence Stress & Speaker Attitude
  easy_lis_mission_emotion_t29: { audioUrl: `${R2_BASE}/ielts-listening-track29-intonation-stress-speaker-attitude.mp3`, clipStart: 2.0, clipEnd: 12.0, isR2Audio: true, trackLabel: 'Track 29 • Item 1A Extraordinary' },
  med_lis_disaster_gravity_t29: { audioUrl: `${R2_BASE}/ielts-listening-track29-intonation-stress-speaker-attitude.mp3`, clipStart: 28.0, clipEnd: 37.0, isR2Audio: true, trackLabel: 'Track 29 • Item 2B Dreadful Tragedy' },
  med_lis_anxiety_inflection_t29: { audioUrl: `${R2_BASE}/ielts-listening-track29-intonation-stress-speaker-attitude.mp3`, clipStart: 46.0, clipEnd: 55.0, isR2Audio: true, trackLabel: 'Track 29 • Item 3B Pretty Uncomfortable' },
  hard_lis_stunning_admiration_t29: { audioUrl: `${R2_BASE}/ielts-listening-track29-intonation-stress-speaker-attitude.mp3`, clipStart: 56.0, clipEnd: 65.0, isR2Audio: true, trackLabel: 'Track 29 • Item 4A Stunning Results' },
  easy_lis_bizarre_emphasis_t29: { audioUrl: `${R2_BASE}/ielts-listening-track29-intonation-stress-speaker-attitude.mp3`, clipStart: 98.0, clipEnd: 110.0, isR2Audio: true, trackLabel: 'Track 29 • Item 6B Bizarre Event' },

  // Track 28: Mars Simulation Project Review
  easy_lis_crew_completed_count_t28: { audioUrl: `${R2_BASE}/ielts-listening-track28-mars-simulation-project-review.mp3`, clipStart: 10.0, clipEnd: 21.0, isR2Audio: true, trackLabel: 'Track 28 • Six Finishers Ratio' },
  med_lis_budget_saving_t28: { audioUrl: `${R2_BASE}/ielts-listening-track28-mars-simulation-project-review.mp3`, clipStart: 239.0, clipEnd: 250.0, isR2Audio: true, trackLabel: 'Track 28 • Budget Surplus 9.5M' },
  med_lis_simon_project_focus_t28: { audioUrl: `${R2_BASE}/ielts-listening-track28-mars-simulation-project-review.mp3`, clipStart: 21.0, clipEnd: 36.0, isR2Audio: true, trackLabel: 'Track 28 • Life Support Report Focus' },
  hard_lis_future_trial_duration_t28: { audioUrl: `${R2_BASE}/ielts-listening-track28-mars-simulation-project-review.mp3`, clipStart: 275.0, clipEnd: 288.0, isR2Audio: true, trackLabel: 'Track 28 • One-Year Follow-Up Trial' },
  easy_lis_meeting_day_t28: { audioUrl: `${R2_BASE}/ielts-listening-track28-mars-simulation-project-review.mp3`, clipStart: 191.0, clipEnd: 200.0, isR2Audio: true, trackLabel: 'Track 28 • Next Wednesday Meeting' },

  // Track 27: Environmental Engineer & Isolation Psychology
  easy_lis_tutor_role_t27: { audioUrl: `${R2_BASE}/ielts-listening-track27-environmental-engineer-isolation.mp3`, clipStart: 2.0, clipEnd: 12.0, isR2Audio: true, trackLabel: 'Track 27 • Psychology Tutor Role' },
  med_lis_positive_three_months_t27: { audioUrl: `${R2_BASE}/ielts-listening-track27-environmental-engineer-isolation.mp3`, clipStart: 104.0, clipEnd: 114.0, isR2Audio: true, trackLabel: 'Track 27 • Three Months Milestone' },
  med_lis_joe_vital_responsibility_t27: { audioUrl: `${R2_BASE}/ielts-listening-track27-environmental-engineer-isolation.mp3`, clipStart: 117.0, clipEnd: 132.0, isR2Audio: true, trackLabel: 'Track 27 • Environmental Engineer Vital Role' },
  hard_lis_ventilation_crisis_t27: { audioUrl: `${R2_BASE}/ielts-listening-track27-environmental-engineer-isolation.mp3`, clipStart: 134.0, clipEnd: 145.0, isR2Audio: true, trackLabel: 'Track 27 • Ventilation System Emergency' },
  easy_lis_media_contrast_t27: { audioUrl: `${R2_BASE}/ielts-listening-track27-environmental-engineer-isolation.mp3`, clipStart: 45.0, clipEnd: 56.5, isR2Audio: true, trackLabel: 'Track 27 • Science vs Soap Opera' },

  // Track 26: Mars Crew Psychological Crisis
  easy_lis_joe_temperament_t26: { audioUrl: `${R2_BASE}/ielts-listening-track26-mars-crew-psychological-crisis.mp3`, clipStart: 2.0, clipEnd: 18.0, isR2Audio: true, trackLabel: 'Track 26 • Quiet Crew Member Contrast' },
  med_lis_victim_martin_t26: { audioUrl: `${R2_BASE}/ielts-listening-track26-mars-crew-psychological-crisis.mp3`, clipStart: 2.0, clipEnd: 14.0, isR2Audio: true, trackLabel: 'Track 26 • Altercation Victim Martin' },
  med_lis_root_cause_isolation_t26: { audioUrl: `${R2_BASE}/ielts-listening-track26-mars-crew-psychological-crisis.mp3`, clipStart: 25.0, clipEnd: 40.0, isR2Audio: true, trackLabel: 'Track 26 • Emotional Strain Isolation' },
  hard_lis_inescapable_environment_t26: { audioUrl: `${R2_BASE}/ielts-listening-track26-mars-crew-psychological-crisis.mp3`, clipStart: 42.0, clipEnd: 55.0, isR2Audio: true, trackLabel: 'Track 26 • Inescapable Stress Snapping' },
  easy_lis_nature_of_attack_t26: { audioUrl: `${R2_BASE}/ielts-listening-track26-mars-crew-psychological-crisis.mp3`, clipStart: 2.0, clipEnd: 13.0, isR2Audio: true, trackLabel: 'Track 26 • Engineer Role Identification' },

  // Track 25: Mars Simulation Contingency Plan
  easy_lis_alfonso_role_t25: { audioUrl: `${R2_BASE}/ielts-listening-track25-arizona-mars-contingency.mp3`, clipStart: 17.0, clipEnd: 25.0, isR2Audio: true, trackLabel: 'Track 25 • Biologist Food Crop Role' },
  med_lis_simulation_no_entry_rule_t25: { audioUrl: `${R2_BASE}/ielts-listening-track25-arizona-mars-contingency.mp3`, clipStart: 43.0, clipEnd: 57.0, isR2Audio: true, trackLabel: 'Track 25 • Isolation Protocol Rule' },
  med_lis_carla_qualification_t25: { audioUrl: `${R2_BASE}/ielts-listening-track25-arizona-mars-contingency.mp3`, clipStart: 58.0, clipEnd: 75.0, isR2Audio: true, trackLabel: 'Track 25 • Medical Officer Role' },
  hard_lis_cross_training_advantage_t25: { audioUrl: `${R2_BASE}/ielts-listening-track25-arizona-mars-contingency.mp3`, clipStart: 75.0, clipEnd: 93.0, isR2Audio: true, trackLabel: 'Track 25 • Cross-Training Redundancy' },
  easy_lis_simon_endorsement_t25: { audioUrl: `${R2_BASE}/ielts-listening-track25-arizona-mars-contingency.mp3`, clipStart: 91.0, clipEnd: 98.0, isR2Audio: true, trackLabel: 'Track 25 • Workload Sharing Consensus' },

  // Track 24: Comparing Space Missions & Project Decisions
  easy_lis_mars_timeline_t24: { audioUrl: `${R2_BASE}/ielts-listening-track24-space-missions-comparison.mp3`, clipStart: 2.0, clipEnd: 11.5, isR2Audio: true, trackLabel: 'Track 24 • Mars Project Duration' },
  med_lis_moon_mission_type_t24: { audioUrl: `${R2_BASE}/ielts-listening-track24-space-missions-comparison.mp3`, clipStart: 44.0, clipEnd: 60.0, isR2Audio: true, trackLabel: 'Track 24 • Robotic Lunar Mission' },
  med_lis_lunar_colony_goal_t24: { audioUrl: `${R2_BASE}/ielts-listening-track24-space-missions-comparison.mp3`, clipStart: 50.0, clipEnd: 61.0, isR2Audio: true, trackLabel: 'Track 24 • Lunar Colony Objective' },
  hard_lis_advisor_arizona_priority_t24: { audioUrl: `${R2_BASE}/ielts-listening-track24-space-missions-comparison.mp3`, clipStart: 78.0, clipEnd: 97.0, isR2Audio: true, trackLabel: 'Track 24 • Arizona Team Dynamics' },
  easy_lis_pluto_novelty_t24: { audioUrl: `${R2_BASE}/ielts-listening-track24-space-missions-comparison.mp3`, clipStart: 61.0, clipEnd: 74.0, isR2Audio: true, trackLabel: 'Track 24 • Pluto Close-Up Novelty' },


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
  med_lis_space_project_outline_t22: { audioUrl: `${R2_BASE}/ielts-listening-track22-space-expedition-project-meeting.mp3`, clipStart: 201.3, clipEnd: 206.9, isR2Audio: true, trackLabel: 'Track 22 • Project Outline Deadline' },
  // Track 23: Public Policies, Transport & Community Opinions
  easy_lis_bus_fare_time_t23: { audioUrl: `${R2_BASE}/ielts-listening-track23-public-policies-and-opinions.mp3`, clipStart: 19.0, clipEnd: 29.5, isR2Audio: true, trackLabel: 'Track 23 • Off-Peak Bus Fares' },
  med_lis_tax_impact_t23: { audioUrl: `${R2_BASE}/ielts-listening-track23-public-policies-and-opinions.mp3`, clipStart: 2.0, clipEnd: 16.8, isR2Audio: true, trackLabel: 'Track 23 • Budget Tax Hike Impact' },
  med_lis_air_strike_train_t23: { audioUrl: `${R2_BASE}/ielts-listening-track23-public-policies-and-opinions.mp3`, clipStart: 39.0, clipEnd: 55.5, isR2Audio: true, trackLabel: 'Track 23 • Air Strike & Train Travel' },
  hard_lis_striker_valuation_t23: { audioUrl: `${R2_BASE}/ielts-listening-track23-public-policies-and-opinions.mp3`, clipStart: 115.0, clipEnd: 133.0, isR2Audio: true, trackLabel: 'Track 23 • £40M Striker Valuation' },
  easy_lis_dental_age_t23: { audioUrl: `${R2_BASE}/ielts-listening-track23-public-policies-and-opinions.mp3`, clipStart: 58.0, clipEnd: 72.8, isR2Audio: true, trackLabel: 'Track 23 • Senior Dental Checkups' }
};

export function hydrateArenaQuestionsWithMetadata(rawQuestions = []) {
  return (rawQuestions || []).map(q => {
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
}

export const ARENA_QUESTION_BANK = hydrateArenaQuestionsWithMetadata([
  ...ARENA_BASE_QUESTION_BANK,
  ...ARENA_BATCH_1_QUESTIONS,
  ...ARENA_BATCH_2_QUESTIONS,
  ...ARENA_101_READING_QUESTIONS
]);

const _asyncBatchCache = new Map();

/**
 * Staged asynchronous loader for specific Arena question batches ('base' | 'batch1' | 'batch2' | 'reading101' | 'all')
 * Enables on-demand hydration without re-allocating arrays when called repeatedly.
 */
export async function loadArenaQuestionBatchAsync(batchName = 'all') {
  if (_asyncBatchCache.has(batchName)) {
    return _asyncBatchCache.get(batchName);
  }

  let hydrated = [];
  if (batchName === 'base') {
    hydrated = hydrateArenaQuestionsWithMetadata(ARENA_BASE_QUESTION_BANK);
  } else if (batchName === 'batch1') {
    hydrated = hydrateArenaQuestionsWithMetadata(ARENA_BATCH_1_QUESTIONS || []);
  } else if (batchName === 'batch2') {
    hydrated = hydrateArenaQuestionsWithMetadata(ARENA_BATCH_2_QUESTIONS || []);
  } else if (batchName === 'reading101') {
    hydrated = hydrateArenaQuestionsWithMetadata(ARENA_101_READING_QUESTIONS || []);
  } else {
    hydrated = ARENA_QUESTION_BANK;
  }

  _asyncBatchCache.set(batchName, hydrated);
  return hydrated;
}

/**
 * Schedules non-blocking background prefetch of all Arena batches during browser idle time.
 */
export function prefetchArenaQuestionBankInBackground() {
  const schedule = (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function')
    ? window.requestIdleCallback
    : (cb) => setTimeout(cb, 120);

  schedule(() => {
    loadArenaQuestionBatchAsync('all').catch(() => {});
  });
}

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
