/**
 * High-Quality Curated AI-Generated Micro-Drills Bank
 * Default community resources available to all visitors (including unauthenticated guests).
 * Covers core skills: Writing Cohesion & Data, Reading TFNG & Paraphrase, Listening Dictation & Traps, Academic Collocations.
 */

export const COMMUNITY_DEFAULT_DRILLS = [
  // 1. WRITING: FILL-IN-THE-BLANKS (COHESION & TRANSITIONS)
  {
    id: 'comm-drill-fill-ai-automation',
    type: 'fill-blanks',
    title: '✨ [AI Cộng Đồng] Từ nối lập luận: Trí tuệ nhân tạo & Lao động',
    category: 'Task 2 Cohesion',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    passage: 'Artificial intelligence is rapidly restructuring the global labor market. ___, routine cognitive tasks in administrative sectors are being automated at unprecedented speed. ___, novel occupations requiring multidisciplinary creativity and emotional intelligence are emerging simultaneously. ___, governments must overhaul tertiary curricula to equip graduates with adaptive competencies. ___, widespread technological unemployment could trigger severe socioeconomic polarization.',
    blanks: [
      { index: 0, answer: 'On the one hand', options: ['On the one hand', 'In conclusion', 'For example', 'Nevertheless'], explanation: "'On the one hand' mở đầu vế thứ nhất của lập luận so sánh hai mặt của AI." },
      { index: 1, answer: 'Conversely', options: ['Conversely', 'Likewise', 'Therefore', 'Namely'], explanation: "'Conversely' (ngược lại) giới thiệu khía cạnh tích cực: các công việc mới xuất hiện." },
      { index: 2, answer: 'Consequently', options: ['Consequently', 'Although', 'Despite', 'Similarly'], explanation: "'Consequently' (do đó) đưa ra kết quả/hành động chính phủ cần làm." },
      { index: 3, answer: 'Otherwise', options: ['Otherwise', 'Furthermore', 'Moreover', 'Besides'], explanation: "'Otherwise' (nếu không thì) cảnh báo hậu quả bất ổn xã hội nếu không đổi mới giáo dục." }
    ]
  },
  {
    id: 'comm-drill-fill-urbanization',
    type: 'fill-blanks',
    title: '✨ [AI Cộng Đồng] Giới từ số liệu Task 1: Xu hướng đô thị hóa',
    category: 'Task 1 Grammar',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    passage: 'The proportion of urban residents in East Asia stood ___ 38% in 2000. Over the following twenty years, it climbed dramatically ___ 24 percentage points to settle ___ 62% in 2020. Meanwhile, the rural demographic declined ___ an average rate of 1.2% per annum, accounting ___ less than forty percent of the total population.',
    blanks: [
      { index: 0, answer: 'at', options: ['at', 'in', 'on', 'by'], explanation: "'stood at + [số liệu]' diễn tả mốc dữ liệu ban đầu." },
      { index: 1, answer: 'by', options: ['by', 'to', 'from', 'with'], explanation: "'climbed by + [khoảng tăng]' diễn tả biên độ gia tăng." },
      { index: 2, answer: 'at', options: ['at', 'in', 'to', 'for'], explanation: "'settle at + [mức]' diễn tả mốc ổn định sau cùng." },
      { index: 3, answer: 'at', options: ['at', 'by', 'with', 'in'], explanation: "'declined at a rate of': giảm với tốc độ bao nhiêu." },
      { index: 4, answer: 'for', options: ['for', 'of', 'in', 'to'], explanation: "'accounting for + [tỷ lệ]': chiếm bao nhiêu phần trăm." }
    ]
  },

  // 2. WRITING: TRUE/FALSE DATA & COHERENCE
  {
    id: 'comm-drill-tf-clean-energy',
    type: 'true-false',
    title: '✨ [AI Cộng Đồng] Phân tích số liệu biểu đồ Task 1: Năng lượng tái tạo',
    category: 'Task 1 Data Accuracy',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    context: 'Dữ liệu phát điện sạch 2025: Solar (Đức: 42%, Úc: 38%, Nhật: 21%), Wind (Đức: 35%, Úc: 24%, Nhật: 12%), Hydro (Đức: 6%, Úc: 11%, Nhật: 19%).',
    questions: [
      {
        id: 'q1',
        statement: 'Solar energy was the leading source of clean electricity in both Germany and Australia in 2025.',
        isTrue: true,
        explanation: 'Đúng (True). Tại Đức điện mặt trời đạt 42% (cao nhất), tại Úc đạt 38% (cũng cao nhất).'
      },
      {
        id: 'q2',
        statement: 'Japan generated a higher proportion of electricity from wind than from hydroelectric dams.',
        isTrue: false,
        explanation: 'Sai (False). Nhật Bản tạo ra 19% từ thủy điện (Hydro), cao hơn điện gió (Wind - 12%).'
      },
      {
        id: 'q3',
        statement: 'Germany had the lowest proportion of hydroelectric power generation among the three nations.',
        isTrue: true,
        explanation: 'Đúng (True). Đức chỉ có 6% thủy điện, thấp hơn Úc (11%) và Nhật Bản (19%).'
      }
    ]
  },

  // 3. WRITING: PARAPHRASE BAND 8.5
  {
    id: 'comm-drill-para-climate',
    type: 'paraphrase',
    title: '✨ [AI Cộng Đồng] Viết lại câu mở bài Task 2: Giảm thải Carbon',
    category: 'Task 2 Introduction Paraphrase',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    originalSentence: 'Governments should impose heavy taxes on polluting companies to protect the natural environment.',
    targetBand: 'Band 8.5+',
    keyVocabulary: ['levy punitive environmental taxes', 'fiscal penalties', 'carbon-intensive enterprises', 'ecological preservation'],
    sampleParaphrase: 'Imposing stringent environmental levies on carbon-intensive corporations is advocated as an efficacious fiscal mechanism to safeguard fragile ecological systems.'
  },

  // 4. READING: TRUE / FALSE / NOT GIVEN TRAP BUSTER
  {
    id: 'comm-drill-rtfng-generative-ai',
    type: 'reading-tfng',
    title: '✨ [AI Cộng Đồng] Bẫy suy diễn Not Given vs False: AI trong chẩn đoán y khoa',
    category: 'Technology & Healthcare',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    passage: 'Deep convolutional neural networks trained on millions of retinal scans have achieved diagnostic accuracy rates rivaling senior ophthalmologists in detecting diabetic retinopathy. Despite these breakthroughs, clinical deployment has encountered regulatory friction due to algorithmic opacity, commonly described as the "black-box problem". Hospital ethics boards insist that until AI models can produce interpretable diagnostic rationales, automated systems must strictly function as secondary assistive tools rather than autonomous clinical arbiters.',
    statement: 'Medical ethics committees have completely prohibited healthcare practitioners from using deep learning algorithms in eye examinations.',
    answer: 'FALSE',
    trapType: 'Extreme Keyword Trap (Bẫy từ ngữ cực đoan: completely prohibited)',
    explanation: 'Đáp án là FALSE. Đoạn văn chỉ rõ ủy ban đạo đức bệnh viện yêu cầu AI chỉ được hoạt động như "công cụ hỗ trợ thứ cấp" (secondary assistive tools), chứ KHÔNG HỀ cấm hoàn toàn (completely prohibited).',
    evidence: '...automated systems must strictly function as secondary assistive tools rather than autonomous clinical arbiters.'
  },
  {
    id: 'comm-drill-rtfng-biomimicry',
    type: 'reading-tfng',
    title: '✨ [AI Cộng Đồng] Bẫy suy diễn Not Given vs True: Kiến trúc phỏng sinh học',
    category: 'Architecture & Nature',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    passage: 'The Eastgate Centre, a mid-rise shopping and office complex in Harare, Zimbabwe, employs an innovative passive cooling system inspired by the architecture of indigenous termite mounds. By constantly opening and closing subterranean air vents in synchrony with thermal cycles, the structure regulates its internal temperature throughout the year without conventional air conditioning, consuming 35% less energy than comparable conventional buildings.',
    statement: 'The construction expenses of the Eastgate Centre were substantially higher than those of traditional office blocks in Harare.',
    answer: 'NOT GIVEN',
    trapType: 'Missing Economic Information (Bẫy thông tin chi phí không tồn tại)',
    explanation: 'Đáp án là NOT GIVEN. Bài đọc chỉ cung cấp số liệu về mức tiêu thụ năng lượng giảm 35% ("consuming 35% less energy"), hoàn toàn KHÔNG ĐỀ CẬP tới chi phí xây dựng ban đầu (construction expenses) cao hơn hay thấp hơn.',
    evidence: 'Đoạn văn chỉ nói về cơ chế làm mát và mức tiết kiệm năng lượng 35%, không nhắc đến chi phí xây dựng.'
  },

  // 5. READING: PARAPHRASE MATCHING
  {
    id: 'comm-drill-rpara-renewable',
    type: 'reading-paraphrase',
    title: '✨ [AI Cộng Đồng] Bắt cặp từ đồng nghĩa học thuật: Pin năng lượng mặt trời Perovskite',
    category: 'Materials Science',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    originalSnippet: 'Next-generation perovskite photovoltaic cells have demonstrated an astonishing capacity to harvest broader spectra of ambient light, outperforming traditional silicon wafers in energy conversion efficiency while drastically slashing manufacturing expenses.',
    options: [
      { text: 'Perovskite solar devices convert sunlight into electricity more efficiently and cost-effectively than conventional silicon panels.', isCorrect: true },
      { text: 'Silicon wafers have officially been rendered obsolete across all global solar farm installations.', isCorrect: false },
      { text: 'Perovskite cells require intense direct sunlight and are incapable of operating under diffuse ambient conditions.', isCorrect: false }
    ],
    analysis: 'Cụm "outperforming traditional silicon wafers in energy conversion efficiency while drastically slashing manufacturing expenses" được paraphrase hoàn hảo thành "convert sunlight into electricity more efficiently and cost-effectively".'
  },

  // 6. LISTENING: ACADEMIC DICTATION
  {
    id: 'comm-drill-ldict-lecture',
    type: 'listening-dictation',
    level: 'advanced',
    title: '✨ [AI Cộng Đồng] Dictation Học Thuật: Vi khí hậu đô thị & Hiệu ứng đảo nhiệt',
    category: 'Urban Ecology Lecture',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    ttsText: 'Metropolitan authorities must incorporate green corridors to mitigate the severe thermal absorption of asphalt surfaces.',
    audioText: 'Metropolitan authorities must incorporate green corridors to mitigate the severe thermal absorption of asphalt surfaces.',
    targetTranscript: 'Metropolitan authorities must incorporate green corridors to mitigate the severe thermal absorption of asphalt surfaces.',
    wordCount: 15,
    difficulty: 'Band 7.5 - 8.5',
    audioClipTip: 'Chú ý các thuật ngữ học thuật: "Metropolitan authorities", "green corridors", "mitigate", "thermal absorption".'
  },

  // 7. LISTENING: DISTRACTOR TRAP BUSTER
  {
    id: 'comm-drill-ldist-membership',
    type: 'listening-distractor',
    title: '✨ [AI Cộng Đồng] Bẫy sửa miệng (Self-Correction Trap): Phí hội viên trung tâm thể thao',
    category: 'Customer Service & Booking',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    ttsText: 'The standard annual gym membership is usually two hundred and forty pounds. However, with our current student discount, it was reduced to one hundred and eighty pounds. Wait, apologies, that promotional offer expired yesterday, so the actual price you need to pay today is two hundred and ten pounds.',
    audioText: 'The standard annual gym membership is usually two hundred and forty pounds. However, with our current student discount, it was reduced to one hundred and eighty pounds. Wait, apologies, that promotional offer expired yesterday, so the actual price you need to pay today is two hundred and ten pounds.',
    question: 'How much does the customer have to pay for the annual membership today?',
    correctOption: '£210',
    options: ['£240', '£180', '£210', '£195'],
    explanation: 'Bẫy sửa miệng kinh điển: Ban đầu người nói nêu £240, sau đó nói giảm còn £180, nhưng ngay sau đó đính chính ("Wait, apologies, that promotional offer expired yesterday") và chốt giá cuối cùng cần trả hôm nay là £210.'
  },

  // 8. FOUNDATION: ACADEMIC COLLOCATIONS
  {
    id: 'comm-drill-colloc-socioeconomic',
    type: 'collocation',
    title: '✨ [AI Cộng Đồng] Collocation C1-C2: Kinh tế xã hội & Đổi mới sáng tạo',
    category: 'Academic Writing & Speaking C1-C2',
    isPublic: true,
    isCommunity: true,
    isAiGenerated: true,
    creatorEmail: 'AI Community Generator',
    sentence: 'The government unveiled a comprehensive policy designed to ___ sustained economic growth and ___ social cohesion across rural regions.',
    blanks: [
      {
        index: 0,
        answer: 'foster',
        options: ['foster', 'make', 'do', 'force'],
        explanation: "'foster sustained economic growth': nuôi dưỡng/thúc đẩy tăng trưởng kinh tế bền vững."
      },
      {
        index: 1,
        answer: 'enhance',
        options: ['enhance', 'enlarge', 'inflate', 'lengthen'],
        explanation: "'enhance social cohesion': củng cố/nâng cao sự gắn kết xã hội."
      }
    ]
  }
];
