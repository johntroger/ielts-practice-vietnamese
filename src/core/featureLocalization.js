/**
 * src/core/featureLocalization.js
 * 
 * Comprehensive Bilingual (English / Vietnamese) Localization Adapter for Feature Registry.
 * Ensures 100% of feature titles, descriptions, badges, highlights, usage guides, and action labels
 * are available in academic Cambridge-standard English.
 */

export const BADGE_LOCALIZATION_EN = {
  'Mới Ra Mắt': 'New Release',
  'Nâng Cấp': 'Upgrade',
  'Học Thuật': 'Academic',
  'Hot': 'Hot',
  'Cốt Lõi': 'Core',
  'Cambridge 4 Tiêu Chí': 'Cambridge 4 Criteria',
  'AI Pro': 'AI Pro',
  'Tư Duy': 'Critical Thinking',
  'Từ Vựng': 'Vocabulary',
  'Bài Tập Nhanh': 'Micro-Drills',
  'Thực Chiến': 'Exam Simulation',
  'Lý Thuyết': 'Theory',
  'Từ Vựng & Ngữ Pháp': 'Vocab & Grammar',
  'Khắc Phục Lỗi': 'Error Fixing',
  'Đánh Giá Đầu Vào': 'Diagnostic',
  'Phân Tích': 'Analytics',
  'Bảo Mật': 'Security',
  'Phím Tắt': 'Shortcuts',
  'Trợ Giúp': 'Help Center',
  'CDI Chuẩn': 'CDI Standard',
  'Đám Mây': 'Cloud Sync',
  'Hồ Sơ': 'User Profile',
  'Ghi Chú': 'Notebook',
  'Ôn Tập': 'Revision',
  'Nạp Đề Nhanh': 'Quick Ingest',
  'Lịch Sử': 'History',
  'Hỗ Trợ': 'Support',
  'Đơn Thuốc Lỗi': 'Error Prescription',
  'Đột Phá 2.0': 'Breakthrough 2.0',
  'Chứng Chỉ TRF': 'TRF Certificate',
  'Dự Báo ETA': 'ETA Forecast',
  'Định Hướng AI': 'AI Roadmap',
  'Theme Sang Trọng': 'Dark Theme',
  'Chuẩn TR & CC 7.0+': 'TR & CC 7.0+ Standard'
};

export const FEATURE_LOCALIZATION_EN = {
  'feat-adaptive-30min-sprint': {
    title: 'Adaptive 30-Min Sprint Coach',
    shortDesc: 'Smart 3-stage, 30-minute high-yield practice sprint diagnosing individual bottlenecks (Grammar, Speaking reflex, Writing argumentation) for daily band breakthroughs.',
    badge: 'New Release',
    highlights: [
      'Automated Bottleneck Diagnostics: AI inspects your Mistake Log, recent test submissions, and Target Band to pinpoint the single most urgent deficiency.',
      'Brain-Optimized 3-Stage Circuit: Stage 1 (7m) Trap Elimination ➔ Stage 2 (15m) Speaking/Writing High-Yield Sprint ➔ Stage 3 (8m) C1/C2 Lexical Consolidation.',
      'Real-Time Stage Stopwatch: Embedded precision timers for each stage with 1-click stage progression and completion celebration.',
      'Daily Sprint Streak Engine: Reinforce consistent study discipline with daily streak tracking and persistent practice logs.'
    ],
    usageGuide: 'From the Navbar "Practice" menu or homepage banner, click "30-Min Sprint Coach" to launch today\'s sprint session.',
    quickActionLabel: 'Launch 30-Min Sprint'
  },
  'feat-speaking-pacing-bar': {
    title: 'Speaking Part 2 Pacing Bar (2-Minute Cadence Guide)',
    shortDesc: '4 Golden Timing Zones (0-30s Context, 30-75s Narrative, 75-105s Climax, 105-120s Reflection) ensuring a fluent 1:50 - 2:00 response without rushing or trailing off.',
    badge: 'New Release',
    highlights: [
      '4 Cambridge Golden Timing Zones: Divides 120 seconds into 4 distinct phases: Context Setup, Core Details, Emotional Climax, and Takeaway/Reflection.',
      'Live Pedagogical Coaching Prompts: Dynamically displays real-time advice tailored to each speaking second to keep delivery structured and confident.',
      'Fluency Risk Thresholds: Warns against premature stops (< 1:15 risks Band 5.0 cap), marks the safe zone (1:15 - 1:45), and highlights the mastery zone (1:45 - 2:00 Band 7.5 - 8.5+).',
      '15-Second Final Countdown: Gentle pulsing countdown reminding test-takers to conclude gracefully before examiner interruption.'
    ],
    usageGuide: 'In Speaking Practice or Examiner Room, upon transitioning to Part 2, the Pacing Bar automatically synchronizes with your recording timer.',
    quickActionLabel: 'Open Speaking Studio'
  },
  'feat-distractor-trap-decoder': {
    title: 'Distractor Trap Decoder (Cambridge Exam Traps)',
    shortDesc: 'Automatically detects 6 classic Cambridge test traps (False Synonym, Scope Creep NOT GIVEN, Turnaround Pivot...) with cognitive error analysis and 3-second reflex rules.',
    badge: 'New Release',
    highlights: [
      '6 Cambridge Exam Trap Archetypes: False Synonym Trap, Extrapolation NOT GIVEN Trap, Last-Minute Turnaround Pivot (Listening), Distractor Figures & Units, Absolute Language Trap, and Implicit Negation.',
      'Cognitive Psychology Diagnostics: Explains exactly why your eyes or ears were drawn to the incorrect distractor rather than merely showing right/wrong.',
      '3-Second Reflex Rules: Actionable Cambridge examiner heuristics designed to inoculate against recurring trap vulnerabilities.',
      '100% Offline-First with 1-Click Error Logging: Works instantly without external API keys and allows 1-click saving to your Personal Mistake Log.'
    ],
    usageGuide: 'After submitting a Reading or Listening test, any incorrect answers will display a "Cambridge Distractor Trap" card with deep-dive analysis and reflex strategies.',
    quickActionLabel: 'Open Reading Studio'
  },
  'feat-in-situ-lexical-upgrader': {
    title: 'In-situ Lexical Upgrader (1-Click Vocabulary Upgrade)',
    shortDesc: 'Instantly replace generic B1/B2 vocabulary and repetitive words with authentic Cambridge C1/C2 academic collocations with a single click.',
    badge: 'New Release',
    highlights: [
      '1-Click Replacement: Highlight any word or click repetitive word badges to view 3-5 authentic C1/C2 collocations with definitions and IELTS example sentences.',
      'Instant In-Place Swapping: Seamlessly swaps words directly in your essay editor without losing cursor focus or requiring manual copy-pasting.',
      'Integrated Repetition Warning (Lexical Resource Band 7.0-8.5): Transforms repetitive words into interactive chips to eliminate vocabulary redundancy.',
      '1-Click Save to Notebook: Save newly discovered collocations directly to your Personal Vocabulary Notebook for spaced repetition review.'
    ],
    usageGuide: 'In IELTS Writing, highlight any text or click highlighted repetitive words, then select "Replace with Collocation" to apply instantly.',
    quickActionLabel: 'Open Writing Studio'
  },
  'feat-minimal-focus-view': {
    title: 'Minimal Focus View (Distraction-Free Practice)',
    shortDesc: '1-click toggle between Zero Distraction Minimal Mode and Pro Studio, reducing cognitive load while streamlining analytical metrics.',
    badge: 'New Release',
    highlights: [
      'Flexible 1-Click Toggle: Effortlessly switch between Minimal View and Pro Studio on the subheader toolbar or Utilities menu.',
      'Cognitive Decluttering: Conceals weekly progress bars and consolidates TTR, GRA, Coherence, and Paraphrase metrics into a tidy popover.',
      'Maximized Writing Immersion: Preserves prompt, typing canvas, word counter, timer, and submission controls without visual noise.',
      'Automatic State Persistence: Remembers your display preference in local storage for seamless subsequent sessions.'
    ],
    usageGuide: 'In IELTS Writing, click the "✨ Minimal" button on the subheader or open the Utilities menu to toggle modes.',
    quickActionLabel: 'Open Writing Studio'
  },
  'feat-speaking-filler-tracker': {
    title: 'Speaking Fluency Studio (Filler Word Counter & Waveform)',
    shortDesc: 'Real-time detection of hesitation filler words (uh, um, like, you know) with frequency alerts and 60 FPS multi-layer organic audio waveforms.',
    badge: 'New Release',
    highlights: [
      'Real-Time Filler Word Filter: Automatically tallies hesitation tokens ("uh", "um", "like", "you know", "actually", "basically").',
      'Cambridge Fluency & Coherence Alerts: Triggers immediate alerts when frequency exceeds 5 fillers/min (preventing drops below Band 6.0).',
      'Authentic Buying-Time Alternatives: Recommends natural discourse markers such as "Well, to be perfectly candid...", "That is an intriguing question...".',
      'Organic 60 FPS Audio Waveform: Visualizes real-time audio amplitude to help maintain steady vocal volume and speech cadence.'
    ],
    usageGuide: 'In Speaking Practice or Examiner Room, speech analysis displays filler statistics right below your audio transcript.',
    quickActionLabel: 'Open Speaking Studio'
  },
  'feat-sentence-structure-heatmap': {
    title: 'GRA Sentence Structure Heatmap (Syntax Analyzer)',
    shortDesc: 'Real-time syntax parsing calculating Simple, Compound & Complex sentence ratios aligned with official Cambridge Grammatical Range & Accuracy (GRA) descriptors.',
    badge: 'New Release',
    highlights: [
      '3-Tier Syntax Classification: 🟢 Complex Sentences (Subordinating / Relative / Inversion), 🔵 Compound Sentences (FANBOYS), 🟡 Simple Sentences.',
      '3-Color Heat Gauge & GRA Band Projection: Alerts when simple sentence ratio exceeds 40% (risk of being capped at Band 5.5-6.0).',
      'Per-Sentence Syntax Inspector: Detailed breakdown of each sentence structure with concrete recommendations for compounding and subordination.',
      '4 Golden Sentence Templates: Concession clauses, resultative relative clauses, negative inversion, and participle clauses for Band 7.5 - 8.0+ GRA.'
    ],
    usageGuide: 'In Writing workspace, click "GRA Structure" on the editor toolbar to open the syntax heatmap and real-time analysis.',
    quickActionLabel: 'Open Syntax Heatmap'
  },
  'feat-speaking-dual-engine': {
    title: 'Dual-Engine Speaking Assessment (⚡ Algorithmic & 🤖 AI)',
    shortDesc: 'Flexible dual-mode scoring between 0.02ms ultra-fast algorithmic engine (Cambridge Algorithmic Scorer) and contextual AI Examiner evaluation.',
    badge: 'New Release',
    highlights: [
      '⚡ 0.02ms Cambridge Algorithmic Scorer: Evaluates Fluency, Lexical Resource, Grammar, and Pronunciation via WPM, TTR diversity, clause structures, and phonetic complexity in milliseconds.',
      '🤖 In-Depth AI Examiner: Contextual grammatical assessment, per-word pronunciation remediation, and Band 8.0+ native rephrasing suggestions.',
      'Resilience Fallback Architecture: Seamlessly falls back to Algorithmic Engine during network loss, quota exhaustion, or offline practice.',
      'Configurable Default Engine: Switch default engine in Settings (⚙️) and track scoring method badging (⚡ Algorithmic / 🤖 AI) in Submission History.'
    ],
    usageGuide: 'In Speaking room or Examiner Room, after recording audio click "⚡ Fast Score (Algorithm)" for instant feedback or "🤖 AI Evaluation" for full diagnostic.',
    quickActionLabel: 'Open Speaking Studio'
  },
  'feat-speaking-mock-examiner': {
    title: 'Simulated Cambridge Examiner Room (Full Mock Speaking)',
    shortDesc: 'Experience a complete 1:1 3-part interview (11-14 minutes) with a virtual examiner faithfully replicating British Council / IDP test protocols.',
    badge: 'New Release',
    highlights: [
      'Part 1: 4-5 introduction and personal interest questions with conversational pacing timer.',
      'Part 2: Official Cue Card delivery, 1-minute prep timer with digital notepad, followed by 2 minutes uninterrupted recording.',
      'Part 3: 4-5 abstract academic follow-up discussion questions probing analytical depth.',
      'Flexible "Finish Early & Score" button: Submit anytime for instant dual-engine diagnostic feedback.'
    ],
    usageGuide: 'Navigate to Speaking workspace -> Click "🎓 Examiner Room" tab -> Select a test prompt and click "Start Mock Test".',
    quickActionLabel: 'Enter Examiner Room'
  },
  'feat-mastered-4skills': {
    title: 'Cross-Skill Mastery Tagging ("Mastered" Across 4 Skills)',
    shortDesc: 'Mark mastered topics, prompts, and cue cards to filter out completed items and dedicate practice time to challenging areas.',
    badge: 'Upgrade',
    highlights: [
      'Comprehensive 4-Skill Coverage: Tag Writing prompts, Reading passages, Listening sections, and Speaking Part 1/2/3 topics.',
      '"Hide Mastered" Smart Filter: Keep question lists tidy by displaying only pending or unpracticed items.',
      'Profile Mastery Showcase: The "Mastered Vault" tab in User Profile displays total mastered count broken down by skill.',
      'Full Guest Mode Support: Safely persisted in browser storage and seamlessly synchronized to cloud upon account sign-in.'
    ],
    usageGuide: 'Click the graduation cap "Mastered" icon (🎓) on any question toolbar or within the Task Library.',
    quickActionLabel: 'View Mastered Items'
  },
  'feat-band-55-60-expansion': {
    title: 'Band Tier Expansion: Band 5.5 - 6.0 Foundation Path',
    shortDesc: 'Comprehensive foundation-building curriculum for the 5.5 - 6.0 band range, closing essential gaps for a secure leap to 6.5+.',
    badge: 'Academic',
    highlights: [
      '4 Distinct Tier Classifications: All Levels (5.5 - 7.5+), Band 5.5-6.0 (Foundation), Band 6.0-6.5 (Core), and Band 7.0-7.5 (Advanced).',
      'Academic Title Badge: Unlock "IELTS Foundation Builder (Band 5.5 - 6.0)" ranking in User Profile.',
      'High-Frequency Trap Drills: Eliminate spelling traps (until, convenient, technology) and eradicate comma splice sentence faults.',
      'Tier-Aware AI Generator: Tailor prompts, vocabulary drills, and grammar scaffolding to your exact target tier.'
    ],
    usageGuide: 'Open "Vocab & Grammar" -> Select "📗 Band 5.5 - 6.0" tab, or browse Theory Handbook for the 5 Fatal Errors guide.',
    quickActionLabel: 'Open Band 5.5 - 6.0 Notebook'
  },
  'feat-task1-image-upload': {
    title: 'Task 1 Visual Ingest & Direct Paste (Ctrl + V)',
    shortDesc: 'Directly paste charts, maps, and process diagrams from clipboard (Win+Shift+S ➔ Ctrl+V) for AI multimodal verification.',
    badge: 'Hot',
    highlights: [
      '1-Touch Clipboard Paste (Ctrl + V): No need to save image files locally—take a screenshot and paste directly.',
      'Smart Client-Side Compression: Optimizes image payload while preserving high fidelity, stored across Supabase & IndexedDB.',
      'Interactive Zoom Modal: Inspect granular data points, trend axes, and legends while typing.',
      'Multimodal Vision AI: AI examiner visually parses charts to provide laser-accurate Task Achievement data verification.'
    ],
    usageGuide: 'In Task Library -> Click "Upload Custom Task (Task 1)" -> Paste image (Ctrl+V) into the visual ingest dropzone.',
    quickActionLabel: 'Open Task Library'
  },
  'feat-writing-cdi-workspace': {
    title: 'Cambridge CDI Writing Room & Full Focus Mode',
    shortDesc: 'Dedicated typing workspace faithfully mirroring IDP/BC Computer-Delivered IELTS interfaces with live word counts and exam shortcuts.',
    badge: 'Core',
    highlights: [
      'Split-Screen CDI Architecture: Question prompt on the left, standardized typing canvas on the right.',
      'Focus Mode (Alt + F): Strips away all navigation headers to ensure 100% immersive writing concentration.',
      'Anti-Loss Auto-Save Engine: Automatically archives drafts every 5 seconds to local browser storage.',
      'Real-Time Word Counter: Warns if essay is below 150 words (Task 1) or below 250 words (Task 2).'
    ],
    usageGuide: 'Select "Writing" on the Navbar. Press Alt + F to toggle full-screen Focus Mode.',
    quickActionLabel: 'Enter Writing Room'
  },
  'feat-reading-cdi-workspace': {
    title: 'CDI Reading Room: 1-Touch Vocab & Distractor Analysis',
    shortDesc: 'Practice 3 academic passages with text highlighting, 1-touch vocabulary lookup, and full support for Academic and General Training.',
    badge: 'Core',
    highlights: [
      'Independent Split-Pane Scrolling: Effortlessly scroll text and question forms independently without losing reading position.',
      'Full Question Type Coverage: True/False/Not Given, Yes/No/Not Given, Matching Headings, Multiple Choice, and Summary Completion.',
      'Automated Scoring & Detailed Explanations: Deep-dive anatomical breakdown of distractor traps in the passage.',
      'Official Cambridge Score Conversion: Accurate band conversion for both Academic and General Training formats.'
    ],
    usageGuide: 'Select "Reading" on Navbar -> Choose a passage from the Test Bank and click "Start Test".'
    ,quickActionLabel: 'Enter Reading Room'
  },
  'feat-listening-cdi-workspace': {
    title: 'CDI Listening Room: Multi-Speed Audio & Segmented Transcript',
    shortDesc: 'Simulates 4 official IELTS listening sections with stutter-free audio streaming, 0.8x-1.5x speed controls, and timestamped transcripts.',
    badge: 'Core',
    highlights: [
      'Audio Chunking Architecture: Instant, lag-free playback streaming across varying network conditions.',
      'Variable Playback Speed (0.8x - 1.5x): Train from foundational pacing up to high-speed native reflex conditioning.',
      'Rigorous Strict-Match Scoring: Strictly validates word limits, singular/plural agreement, and spelling accuracy.',
      'Post-Submission Transcript Inspection: Review pinpointed audio timestamps directly attached to question answers.'
    ],
    usageGuide: 'Select "Listening" on Navbar -> Choose a test and press Space to toggle audio playback.',
    quickActionLabel: 'Enter Listening Room'
  },
  'feat-ai-task2-grading': {
    title: 'Cambridge 4-Criteria AI Writing Examiner & Radar Chart',
    shortDesc: 'Granular assessment across TR, CC, LR, and GRA accompanied by criteria radar charts and Band 8.5+ native model essay rewrites.',
    badge: 'Cambridge 4 Criteria',
    highlights: [
      'Visual Spider/Radar Chart: Instant visual benchmark across all 4 criteria to quickly spot scoring bottlenecks.',
      'Sentence-Level Inline Corrections: Line-by-line comparison of original vs. academic alternatives with grammatical explanations.',
      'Band 8.5+ Personalized Model Essay: Tailored essay rewriting built upon your exact ideas and paragraph structure.',
      'Professional Export: Print or download comprehensive evaluation reports in Word (.docx) format.'
    ],
    usageGuide: 'After drafting your essay in Writing room, click "Submit & AI Evaluation" or press Ctrl + Enter.',
    quickActionLabel: 'Evaluate Writing Essay'
  },
  'feat-ai-generator-pro': {
    title: 'AI Prompt & Task Generator Pro',
    shortDesc: 'Generate unlimited fresh Cambridge-standard prompts across trending topics (Technology, Environment, Education, Society...).',
    badge: 'AI Pro',
    highlights: [
      'Cambridge-Calibrated Task Generation: Customize topics, question archetypes (Opinion, Discussion, Process, Map, Cue Cards...).',
      'Integrated Band 8.0+ Model Answers: Delivered with structural outlines and curated C1-C2 lexical lists.',
      '1-Click Community Sharing: Option to publish generated prompts to the Shared Community Bank in one click.'
    ],
    usageGuide: 'Click "AI Generator" in the top navigation or Tools Menu to generate fresh test prompts.',
    quickActionLabel: 'Generate New Prompt'
  },
  'feat-idea-matrix': {
    title: 'Idea Matrix & Critical Thinking Bank',
    shortDesc: 'Idea repository organized across 12 major academic themes to completely eliminate writer\'s block on unfamiliar topics.',
    badge: 'Critical Thinking',
    highlights: [
      'Bilingual Argument Repository: Contains pro/con arguments, counter-arguments, and concrete real-world evidence.',
      'P.E.E.L. Architecture: Structured Point - Explanation - Example - Link blueprints optimized for Task 2 and Speaking Part 3.',
      'Instant Keyword Search: Rapidly lookup relevant arguments by searching prompt keywords.'
    ],
    usageGuide: 'Click "Idea Matrix" in top navigation or Practice Menu whenever you need inspiration for essay brainstorming.',
    quickActionLabel: 'Open Idea Matrix'
  },
  'feat-paraphrase-helper': {
    title: 'Academic Paraphrase Rewriter (C1-C2 Lexical Assistant)',
    shortDesc: 'Multi-style sentence transformation assistant suggesting academic synonyms and inverted structures to boost band scores.',
    badge: 'Vocabulary',
    highlights: [
      '3 Tiered Expressions: Natural Fluency, Academic Standard (Band 7.0), and Advanced Mastery (Band 8.0+).',
      'Grammatical Shift Analysis: Explains structural tense alterations and clause transformations.',
      'Semantic Equivalence Scoring: Ensures transformed sentences preserve original prompt fidelity without distortion.'
    ],
    usageGuide: 'Open "Paraphrase Helper" from the Tools Menu or click the pen icon in the subheader toolbar.',
    quickActionLabel: 'Open Paraphrase Assistant'
  },
  'feat-micro-drills-studio': {
    title: 'Targeted Reflex Studio (Micro-Drills Studio)',
    shortDesc: 'Bite-sized 3-5 minute drills: True/False traps, C1/C2 collocations, discourse markers, and complex sentence combining.',
    badge: 'Micro-Drills',
    highlights: [
      'Multi-Skill Micro Rooms: Targeted drills categorized by specific skill deficits.',
      'Instant Feedback: Immediate right/wrong validation with detailed grammatical rationales after every question.',
      'Sentence Chunking Conditioning: Trains the eye to dissect multi-clause compound-complex structures effortlessly.'
    ],
    usageGuide: 'Click "Micro-Drills" on the Navbar -> Choose the drill category you wish to practice.',
    quickActionLabel: 'Enter Micro-Drills Studio'
  },
  'feat-mock-test-vault': {
    title: 'High-Pressure Mock Test Vault (Timed 60-Min & Grand Mock)',
    shortDesc: 'Full exam simulation under strict continuous timers with disabled hints and Cambridge-standard composite scorecards.',
    badge: 'Exam Simulation',
    highlights: [
      '60-Min Writing Mock: Back-to-back Task 1 & Task 2 under authentic rigorous time constraints.',
      '60-Min Reading Mock: Complete 3 passages (40 questions) with random draw or Cambridge past paper selection.',
      'All-In-One Grand Mock (~2h45m): Comprehensive multi-skill simulation projecting your estimated Overall TRF band score.'
    ],
    usageGuide: 'Open Practice Menu -> Click "60-Min Mock Test" to choose your desired simulation room.',
    quickActionLabel: 'Open Mock Test Vault'
  },
  'feat-theory-compendium': {
    title: 'Cambridge Strategy Compendium (7 Task 1 + 5 Task 2 Types)',
    shortDesc: 'Complete methodological strategies, structural templates, and personal note-taking across all IELTS task archetypes.',
    badge: 'Theory',
    highlights: [
      'All 7 Task 1 Archetypes: Line Graph, Bar Chart, Pie Chart, Table, Mixed Chart, Process Diagram, and Map Comparison.',
      '5 Task 2 Strategy Blueprints: Opinion, Discussion, Advantages & Disadvantages, Causes & Solutions, Two-Part Questions.',
      'Personal Strategy Notebook: Jot down your own custom tips and reflections directly within handbook articles.'
    ],
    usageGuide: 'Click "Theory" on top navigation or in the Hamburger Menu to browse strategy articles.',
    quickActionLabel: 'Open Theory Handbook'
  },
  'feat-vocab-grammar-bank': {
    title: 'Academic Vocabulary & Grammar Vault (Spaced Repetition)',
    shortDesc: 'Thematic C1-C2 vocabulary bank powered by the SuperMemo SM-2 spaced repetition algorithm for permanent retention.',
    badge: 'Vocab & Grammar',
    highlights: [
      'Band-Tiered Organization: Separated into Band 5.5-6.0, 6.0-6.5, and 7.0-7.5+ tiers.',
      'Interactive Flashcards & Collocation Tester: Train active recall with interactive flip cards.',
      'SM-2 Spaced Repetition Algorithm: Automatically schedules reviews right before items fade from memory.'
    ],
    usageGuide: 'Open "Vocab & Grammar" from the Navbar to search words or launch daily flashcard reviews.',
    quickActionLabel: 'Open Vocab & Grammar Studio'
  },
  'feat-mistake-logbook': {
    title: 'Automated Mistake Log & Anti-Pattern Tracker',
    shortDesc: 'Automatically records and categorizes recurrent grammatical, spelling, and cohesion errors from evaluated submissions.',
    badge: 'Error Fixing',
    highlights: [
      'Intelligent Error Clustering: Articles (a/an/the), subject-verb agreement, verb tenses, and punctuation faults.',
      'Frequency Analytics: Pinpoints chronic vulnerability areas to eliminate before official exam day.'
    ],
    usageGuide: 'Open Practice Menu -> Click "Mistake Log" to inspect and review recorded error entries.',
    quickActionLabel: 'Open Mistake Log'
  },
  'feat-diagnostic-test': {
    title: '15-Min Diagnostic Placement & 30-Day Personalized Roadmap',
    shortDesc: 'Concise placement test assessing baseline band scores and formulating an adaptive 30-day study roadmap.',
    badge: 'Diagnostic',
    highlights: [
      'Multi-Skill Competency Diagnosis in just 15-20 minutes.',
      'Baseline Band Estimation and distance gap calculation toward your target score.'
    ],
    usageGuide: 'Click your profile avatar -> Select "Take 15-Min Diagnostic Placement".',
    quickActionLabel: 'Take Diagnostic Test'
  },
  'feat-weekly-progress-report': {
    title: 'Weekly Diagnostic Progress Report',
    shortDesc: 'Synthesizes study hours, completed tests, score trend graphs, and daily study streak continuity.',
    badge: 'Analytics',
    highlights: [
      'Visual Productivity Analytics: Compare weekly output and skill allocation.',
      'Daily Streak Tracking: Maintain motivation with ongoing practice streaks.',
      'Actionable Weekly Recommendations tailored to your lowest-scoring skill.'
    ],
    usageGuide: 'Click "Progress" on the navigation bar to inspect this week\'s analytics report.',
    quickActionLabel: 'View Weekly Report'
  },
  'feat-byok-security': {
    title: 'BYOK Security (Bring Your Own Key) & Multi-Model Engine',
    shortDesc: 'Bring your own free API keys from top AI providers (Google AI, DeepSeek, OpenAI, Claude). Securely stored on your device.',
    badge: 'Security',
    highlights: [
      '100% Client-Side Encryption: Keys remain strictly in local browser storage without routing through third-party servers.',
      'One-Click Key Verification: Validate key connectivity and latency with a single test ping.',
      'Offline Algorithmic Mode: Full practice capability available without entering any API keys.'
    ],
    usageGuide: 'Click "API Key" or "Settings (⚙️)" on the Navbar -> Paste your key and click "Save Settings".',
    quickActionLabel: 'Open API Key Settings'
  },
  'feat-keyboard-shortcuts-hub': {
    title: 'Global Keyboard Shortcuts Hub',
    shortDesc: 'High-speed keyboard-driven workflow: Help Guide (F1), Focus Mode (Alt+F), Quick Submit (Ctrl+Enter), Audio Toggle (Space).',
    badge: 'Shortcuts',
    highlights: [
      'F1 or Alt + H: Instantly open this Help Center & Feature Guide.',
      'Alt + F: Toggle full-screen distraction-free Focus Mode.',
      'Ctrl + Enter: Instant submission and automated scoring trigger.',
      'Space: Play or pause audio in the Listening practice room.',
      'Ctrl + V: Paste chart images directly from clipboard for Task 1.'
    ],
    usageGuide: 'Press F1 anywhere on the platform to view the complete shortcuts index.',
    quickActionLabel: 'View Keyboard Shortcuts'
  },
  'feat-help-center-hub': {
    title: 'Universal Help Center & Feature Reference Manual',
    shortDesc: 'Instant search across all platform capabilities, shortcuts, user manuals, and version changelogs with F1.',
    badge: 'Help Center',
    highlights: [
      'Real-time Spotlight search supporting bilingual English and Vietnamese queries.',
      '1-Click Action Launcher: Directly launch practice tools from search results.',
      'Release changelog archive with step-by-step feature usage walkthroughs.'
    ],
    usageGuide: 'Press F1 or click the Help icon on the Navbar to open the feature hub.',
    quickActionLabel: 'Open Help Center'
  },
  'feat-cdi-display-settings': {
    title: 'CDI Official Display & Contrast Settings',
    shortDesc: 'Configure font sizing (Standard, Large, Extra Large) and official contrast palettes matching British Council / IDP CDI workstations.',
    badge: 'CDI Standard',
    highlights: [
      '3 Standard Font Scales: Standard, Large, and Extra Large.',
      '4 CDI Contrast Modes: Black on White, White on Black, and Yellow on Blue for eye fatigue prevention.',
      'System-Wide Synchronization across all computer-delivered exam rooms.'
    ],
    usageGuide: 'Click "CDI Display" on the top toolbar or settings menu to customize display options.',
    quickActionLabel: 'Open CDI Display Settings'
  },
  'feat-supabase-cloud-account': {
    title: 'Cloud Sync & Multi-Platform Authentication (Supabase Auth)',
    shortDesc: '1-click sign-in via Google or Email. Automatically synchronize submission logs, custom tasks, and vocabulary across all devices.',
    badge: 'Cloud Sync',
    highlights: [
      'Google 1-Click Authentication: Effortless, enterprise-grade identity management.',
      'Row Level Security (RLS): Your test submissions and private data are fully encrypted.',
      'Instant Multi-Device Sync: Start an essay on your laptop and review it on your mobile device.'
    ],
    usageGuide: 'Click "Account" on the Navbar to sign in or create an account.',
    quickActionLabel: 'Sign In / Register'
  },
  'feat-user-profile-center': {
    title: 'Academic Profile Center & Title Ranking System',
    shortDesc: 'Manage study goals, track Cambridge rank progression, review mastered question vaults, and inspect historical performance.',
    badge: 'User Profile',
    highlights: [
      'Dynamic Academic Titles: Advance from "IELTS Foundation Builder" to "Cambridge Grandmaster".',
      '4-Skill Mastered Vault: Inspect comprehensive tallies of mastered materials.',
      'Detailed Test History with full criterion-by-criterion assessment logs.'
    ],
    usageGuide: 'Click your profile avatar in the top-right corner of the navigation bar.',
    quickActionLabel: 'Open User Profile'
  },
  'feat-notebook-notes': {
    title: 'Academic Notebook (Smart Notes & Essay Plans)',
    shortDesc: 'Private study notepad to preserve strategy tips, favorite outline skeletons, and examiner feedback throughout your prep.',
    badge: 'Notebook',
    highlights: [
      'Instant Note-Taking without having to leave the active test room.',
      'Structured Tagging by skill and task archetype for rapid retrieval.'
    ],
    usageGuide: 'Open Practice Menu -> Click "Academic Notebook" to manage notes.',
    quickActionLabel: 'Open Notebook'
  },
  'feat-revision-spaced-repetition': {
    title: 'Smart Revision & Rewrite Studio',
    shortDesc: 'Rewrite previous essay submissions guided by AI suggestions to empirically benchmark improvement from Band 6.0 to 7.5+.',
    badge: 'Revision',
    highlights: [
      'Side-by-side comparison between initial draft and revised submission.',
      'Track measurable leaps in academic lexical density and grammatical range.'
    ],
    usageGuide: 'In Submission History -> Select a previous essay and click "Rewrite This Essay".',
    quickActionLabel: 'Open Revision Studio'
  },
  'feat-raw-task-ingest': {
    title: 'Bulk Raw Task Ingest & Model Essay Importer',
    shortDesc: 'Directly paste raw prompts or model essays from PDF/Word documents for automated structure parsing and library ingestion.',
    badge: 'Quick Ingest',
    highlights: [
      'Intelligent Prompt Parsing: Automatically isolates prompt title, charts, questions, and model answers.',
      'Reduces custom prompt creation time by 90% compared to manual form entry.'
    ],
    usageGuide: 'Open Tools Menu -> Select "Raw Task Ingest" -> Paste content and click "Auto-Parse".',
    quickActionLabel: 'Open Task Ingest Tool'
  },
  'feat-history-evaluation-vault': {
    title: 'Multi-Skill Test History & Evaluation Archive',
    shortDesc: 'Searchable archive of past essays, speaking recordings, 4-criteria scorecards, and scoring engine filters (⚡ Algorithmic / 🤖 AI).',
    badge: 'History',
    highlights: [
      'Comprehensive 4-skill archiving with precise timestamps and scores.',
      'Engine Method Badging (⚡ Algorithmic / 🤖 AI) for clear diagnostic comparison.',
      'Reprint or re-export previous test evaluations at any time.'
    ],
    usageGuide: 'Click "History" on the navigation bar or within the Profile Menu.',
    quickActionLabel: 'View Test History'
  },
  'feat-user-feedback-support': {
    title: 'Direct User Feedback & Academic Advisory Channel',
    shortDesc: 'Submit feature suggestions, report bugs, or reach out directly to the IELTS Studio academic advisory team.',
    badge: 'Support',
    highlights: [
      'Swift 30-second submission flow.',
      'Attach technical diagnostics to facilitate rapid bug troubleshooting.'
    ],
    usageGuide: 'Click "Feedback & Support" in the footer or Hamburger Menu.',
    quickActionLabel: 'Submit Feedback'
  },
  'feat-daily-error-prescription': {
    title: 'Daily Error Prescription (Spaced Repetition Micro-Drills)',
    shortDesc: 'Personalized 3-min/day loop converting authentic mistakes from your essays and chronic grammar traps into quick reflex quizzes.',
    badge: 'Error Prescription',
    highlights: [
      '100% Personalized: Aggregates authentic errors directly from your writing and speaking submissions.',
      '5 Classic Vulnerability Traps: Prepositional phrases, articles, past tense inflection, countable/uncountable nouns, conditionals.',
      'Official Cambridge Explanations: Understand exactly why marks were deducted and how to write like a Band 7.5+ candidate.',
      '100% Offline-First: Practice anywhere, anytime without internet connectivity or API keys.'
    ],
    usageGuide: 'In Writing toolbar -> Click "Utilities" -> Select "Error Prescription", or open from your User Profile.',
    quickActionLabel: 'Open Error Prescription'
  },
  'feat-smart-filters-social-proof': {
    title: 'Multi-Dimensional Smart Discovery & Rating System',
    shortDesc: 'Pinpoint ideal tests and exercises in 3 seconds using multi-criteria filters, interactive 5★ ratings, and authentic attempt counts.',
    badge: 'Breakthrough 2.0',
    highlights: [
      '1-Touch Smart Filters: All, Top Rated 4.8★+, Trending >500 attempts, Unattempted, Mastered, Band 7.5+.',
      'Interactive 5-Star Rating with responsive micro-bounce animations and real-time average score updates.',
      'Real-Time Attempt Counters delivering authentic community social proof.',
      'Multi-Faceted Sorting: By rating, popularity, band difficulty, and newest releases.',
      'Platform-Wide Coverage: Writing, Reading, and Listening test banks, Micro-Drills, and Vocab/Grammar.'
    ],
    usageGuide: 'Open Task Library, Micro-Drills, or Vocab Studio. Use filter chips or search bar. Click stars on cards to rate.',
    quickActionLabel: 'Open Task Library'
  },
  'feat-trf-simulator': {
    title: 'Official Cambridge IELTS TRF Simulator (PDF Test Report Form)',
    shortDesc: 'Simulates official British Council / IDP / Cambridge Test Report Forms with authentic overall rounding, verification QR, and PDF export.',
    badge: 'TRF Certificate',
    highlights: [
      '4-Skill Scorecard for Listening, Reading, Writing, Speaking, and official Overall Band calculation.',
      'Cambridge Rounding Algorithm: .25 rounds up to .5, .75 rounds up to next whole band, alongside CEFR mapping (B2, C1, C2).',
      'Security Verification Code, official examiner stamp, and subtle anti-counterfeiting watermark.',
      '1-Click High-Resolution A4 PDF Generation and printing.'
    ],
    usageGuide: 'Navigate to "🏆 TRF Scorecard" tab in Mock Test Vault -> Click "View & Download Scorecard (PDF)".',
    quickActionLabel: 'Open TRF Scorecard'
  },
  'feat-growth-analytics': {
    title: 'Growth Analytics & Target Band Timeline',
    shortDesc: 'Machine learning ETA forecast calibrated against Cambridge benchmarks (~120 active study hours / +0.5 band) and 4-skill gap analysis.',
    badge: 'ETA Forecast',
    highlights: [
      'Projected Target Band completion date (ETA) dynamically adapting to weekly study intensity.',
      'Identifies your #1 Priority Bottleneck Skill pulling down your Overall Band.',
      'Calculates required study hours based on Cambridge Assessment statistical standards.',
      'Strategic action advice customized for each skill gap to maximize score gains.'
    ],
    usageGuide: 'Open User Profile or Help Center -> Click "Target Band Timeline".',
    quickActionLabel: 'View Growth Analytics'
  },
  'feat-smart-recommendation-engine': {
    title: 'Smart Daily Recommendation Engine',
    shortDesc: 'Analyzes test logs, error notebooks, and target band goals to recommend today\'s highest-leverage exercise, preventing procrastination.',
    badge: 'AI Roadmap',
    highlights: [
      'Auto-balances Task 1 vs Task 2 practice frequency to reflect 33% and 66% score weighting.',
      'Detects grammar and vocabulary errors in your logbook to trigger 3-minute spaced repetition drills.',
      'Recommends micro-drills and C1/C2 collocations matching your target band.',
      'Supports compact 1-line view and 1-click "Shuffle Recommendation".'
    ],
    usageGuide: 'Recommendation card sits at the top of the Writing workspace. Click "Practice Now" to launch.',
    quickActionLabel: 'View Daily Recommendation'
  },
  'feat-dark-mode-theme': {
    title: 'System-Wide Dark Mode Theme',
    shortDesc: 'Protects eyesight during late-night practice sessions with a refined dark-tech aesthetic across all 4 skills, navigation, and modals.',
    badge: 'Dark Theme',
    highlights: [
      '1-click toggle between Light Mode and Dark Mode in the Navbar or Mobile Drawer.',
      'Prevents eye strain during prolonged mock exam simulations at night.',
      'Persists user preference in local storage and synchronizes instantly across open tabs.',
      'Optimized academic typography contrast while preserving vivid badge and chart accents.'
    ],
    usageGuide: 'Click the Moon/Sun icon on the top Navbar or visit System Settings -> Interface Theme.',
    quickActionLabel: 'Open Theme Settings'
  },
  'feat-peel-argument-checker': {
    title: 'PEEL Argument Coherence Checker (Task 2 Cambridge TR & CC)',
    shortDesc: 'Validates Task 2 body paragraphs against Cambridge standards: Point ➔ Explanation ➔ Evidence ➔ Link, flagging unsupported claims.',
    badge: 'TR & CC 7.0+ Standard',
    highlights: [
      'Anatomical Analysis of 4 Core Components: Point, Explanation mechanism, Concrete Evidence, Link back to prompt.',
      'Calculates PEEL Completeness Score (0 - 100%) and projects Task Response / Coherence band score in real time.',
      'Intelligent Warning against unsupported generalizations and overly personal anecdotes.',
      'Suggests a polished Band 8.5+ academic rewrite modeled on your original ideas with 1-click copy.'
    ],
    usageGuide: 'In Writing Task 2 room, click "Check PEEL Paragraph (AI)" in the prompt column or open the Argument modal.',
    quickActionLabel: 'Open Task 2 Writing Room'
  }
};

/**
 * Helper to get a localized badge string
 * @param {string} badge 
 * @param {boolean} isEn 
 * @returns {string}
 */
export function getLocalizedBadge(badge, isEn) {
  if (!badge) return '';
  if (!isEn) return badge;
  return BADGE_LOCALIZATION_EN[badge] || badge;
}

/**
 * Returns a clone of the feature with all user-facing text translated if isEn === true
 * @param {object} feature 
 * @param {boolean} isEn 
 * @returns {object}
 */
export function getLocalizedFeature(feature, isEn) {
  if (!feature) return feature;
  if (!isEn) return feature;

  const loc = FEATURE_LOCALIZATION_EN[feature.id];
  if (!loc) {
    return {
      ...feature,
      badge: getLocalizedBadge(feature.badge, isEn)
    };
  }

  return {
    ...feature,
    title: loc.title || feature.title,
    shortDesc: loc.shortDesc || feature.shortDesc,
    badge: loc.badge || getLocalizedBadge(feature.badge, isEn),
    highlights: loc.highlights || feature.highlights,
    usageGuide: loc.usageGuide || feature.usageGuide,
    quickAction: feature.quickAction ? {
      ...feature.quickAction,
      label: loc.quickActionLabel || feature.quickAction.labelEn || feature.quickAction.label
    } : null
  };
}

/**
 * Localize an array of features
 * @param {Array} features 
 * @param {boolean} isEn 
 * @returns {Array}
 */
export function getLocalizedFeatures(features, isEn) {
  if (!Array.isArray(features)) return [];
  if (!isEn) return features;
  return features.map(f => getLocalizedFeature(f, isEn));
}
