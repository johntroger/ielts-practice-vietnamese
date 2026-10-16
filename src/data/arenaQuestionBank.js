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
    context: 'Is that with two Ls? - No, one. E-L-I-O-T.',
    audioText: 'Is that with two Ls? - No, one. E-L-I-O-T.',
    options: ['Elliot', 'Elliott', 'Eliott', 'Eliot'],
    correctIndex: 0,
    correctAnswer: 'Elliot',
    explanation: 'Bẫy chính tả tên riêng: Người hỏi thắc mắc có phải "two Ls" không, nhưng ông ấy trả lời "No, one" -> Elliot (E-L-I-O-T).',
    explanationEn: "Spelling clarification: The caller clarifies whether the surname contains two Ls, and the agent responds 'No, one', spelling E-L-I-O-T."
  },
  {
    id: 'hard_lis_appliances_04',
    difficulty: 'hard',
    topic: 'urbanization',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Will the prospective buyer need to purchase a cooker or dishwasher for this property?',
    context: "It's fully fitted, so it includes a cooker and a dishwasher and all the other things you'd expect in a kitchen. - That sounds great! Not having to buy a cooker and dishwasher.",
    audioText: "It's fully fitted, so it includes a cooker and a dishwasher and all the other things you'd expect in a kitchen. - That sounds great! Not having to buy a cooker and dishwasher.",
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
    context: 'What\'s your membership number? - It\'s B1074. - Sorry, did you say D1074? - No, B1074.',
    audioText: 'What\'s your membership number? - It\'s B1074. - Sorry, did you say D1074? - No, B1074.',
    options: ['B1074', 'D1074', 'P1074', 'B1047'],
    correctIndex: 0,
    correctAnswer: 'B1074',
    explanation: 'Bẫy âm chữ cái tương đồng B vs D: Nhân viên hỏi lại D1074, khách hàng khẳng định là B1074.',
    explanationEn: "Phonetic similarity trap: The assistant asks if the code begins with 'D', but the caller clarifies that it begins with 'B1074'."
  },
  {
    id: 'easy_lis_price_02',
    difficulty: 'easy',
    topic: 'economy',
    skillCategory: 'listening',
    type: 'listening_trap',
    prompt: 'Listen to the shop cashier: What is the accurate total amount due?',
    context: 'That\'s £53.72 please. - Sorry, did you say £43.72? - No, £53.72.',
    audioText: 'That\'s £53.72 please. - Sorry, did you say £43.72? - No, £53.72.',
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
    context: 'If I remember rightly, it\'s £340,000? - Actually, it\'s £350,000 at the moment...',
    audioText: 'If I remember rightly, it\'s £340,000? - Actually, it\'s £350,000 at the moment...',
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
    context: 'It\'s 4.91 meters by 3.95 meters... Oh sorry, that\'s 4.9 meters long and 3.95 meters wide.',
    audioText: 'It\'s 4.91 meters by 3.95 meters... Oh sorry, that\'s 4.9 meters long and 3.95 meters wide.',
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
  }
];

const R2_BASE = 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev';

const R2_AUDIO_METADATA_BY_ID = {
  // Track 2: Flat Descriptions
  easy_lis_flat_01: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 8, clipEnd: 20, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions' },
  med_lis_flat_02: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 36, clipEnd: 52, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions' },
  hard_lis_flat_03: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 88, clipEnd: 101, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions' },
  med_vocab_flat_04: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 8, clipEnd: 20, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions', audioText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet.' },
  hard_paraphrase_flat_05: { audioUrl: `${R2_BASE}/ielts-listening-track2-flat-descriptions.mp3`, clipStart: 70, clipEnd: 82, isR2Audio: true, trackLabel: 'Track 2 • Flat Descriptions', audioText: 'The flat needs some modernization, but it is very well kept and would be an excellent family home.' },
  // Track 3: Property Enquiry
  easy_lis_addr_01: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 8, clipEnd: 23, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  med_lis_appt_02: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 120, clipEnd: 142, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  med_lis_spell_03: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 162, clipEnd: 175, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  hard_lis_appliances_04: { audioUrl: `${R2_BASE}/ielts-listening-track3-property-enquiry.mp3`, clipStart: 62, clipEnd: 78, isR2Audio: true, trackLabel: 'Track 3 • Property Enquiry' },
  // Track 4: Numbers & Measurements
  easy_lis_b_vs_d_01: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 2, clipEnd: 12, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  easy_lis_price_02: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 35, clipEnd: 45, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  med_lis_phone_03: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 88, clipEnd: 102, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  hard_lis_dim_04: { audioUrl: `${R2_BASE}/ielts-listening-track4-numbers-measurements.mp3`, clipStart: 62, clipEnd: 74, isR2Audio: true, trackLabel: 'Track 4 • Numbers & Codes' },
  // Track 5: Property Viewing
  easy_lis_decision_offer: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 120, clipEnd: 136, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  med_lis_asking_price_trap: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 105, clipEnd: 120, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  med_lis_bath_fixture_trap: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 25, clipEnd: 40, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  hard_lis_dim_correction_trap: { audioUrl: `${R2_BASE}/ielts-listening-track5-property-viewing.mp3`, clipStart: 8, clipEnd: 24, isR2Audio: true, trackLabel: 'Track 5 • Property Viewing' },
  // Track 6: Offer & Sale Process
  easy_lis_postcode_ke7: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 30, clipEnd: 42, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  med_lis_current_stay: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 50, clipEnd: 65, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  med_lis_main_worry: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 65, clipEnd: 88, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  hard_lis_deposit_cash: { audioUrl: `${R2_BASE}/ielts-listening-track6-offer-and-sale-process.mp3`, clipStart: 100, clipEnd: 118, isR2Audio: true, trackLabel: 'Track 6 • Offer Process' },
  // Track 7: En-Suite Clip
  easy_lis_ensuite_routine: { audioUrl: `${R2_BASE}/ielts-listening-track7-ensuite-bathroom-clip.mp3`, clipStart: 0, clipEnd: 12, isR2Audio: true, trackLabel: 'Track 7 • En-suite Routine' },
  med_lis_idiom_useful: { audioUrl: `${R2_BASE}/ielts-listening-track7-ensuite-bathroom-clip.mp3`, clipStart: 0, clipEnd: 12, isR2Audio: true, trackLabel: 'Track 7 • En-suite Routine', audioText: 'That would come in very useful when we all get up to get ready for school or work.' },
  // Track 8: Student Accommodation & Shopping
  easy_lis_commute_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 28, clipEnd: 46, isR2Audio: true, trackLabel: 'Track 8 • Commute & School' },
  med_lis_nationality_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 52, clipEnd: 71, isR2Audio: true, trackLabel: 'Track 8 • International House' },
  med_lis_mall_feature_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 100, clipEnd: 118, isR2Audio: true, trackLabel: 'Track 8 • City Gate Amenities' },
  hard_lis_market_reason_t8: { audioUrl: `${R2_BASE}/ielts-listening-track8-student-accommodation-and-shopping.mp3`, clipStart: 167, clipEnd: 193, isR2Audio: true, trackLabel: 'Track 8 • Local Market Opinion' }
};

export const ARENA_QUESTION_BANK = [
  ...ARENA_BASE_QUESTION_BANK,
  ...ARENA_BATCH_1_QUESTIONS,
  ...ARENA_BATCH_2_QUESTIONS
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
