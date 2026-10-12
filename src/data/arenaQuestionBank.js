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

export const ARENA_BASE_QUESTION_BANK = [
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
  }
];

export const ARENA_QUESTION_BANK = [
  ...ARENA_BASE_QUESTION_BANK,
  ...ARENA_BATCH_1_QUESTIONS,
  ...ARENA_BATCH_2_QUESTIONS
];

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
