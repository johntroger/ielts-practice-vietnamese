/**
 * Curated Dataset of IELTS Reading & Core Foundation Micro-Drills
 * Categories:
 * 1. reading-tfng: True / False / Not Given Trap Master
 * 2. reading-paraphrase: Synonymous Pairs & Paraphrase Hunter
 * 3. reading-headings: Matching Headings & Distractor Analysis
 * 4. context-vocab: Guessing Meaning from Context Clues
 * 5. sentence-chunking: Complex Academic Sentence Deconstruction (Subject - Core Verb - Object)
 */

export const READING_MICRO_DRILLS = [
  // ==========================================
  // 1. TRUE / FALSE / NOT GIVEN DRILLS
  // ==========================================
  {
    id: 'drill-tfng-1',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy Not Given vs False: Thụ phấn nhân tạo',
    titleEn: 'Not Given vs False Trap: Artificial Pollination',
    category: 'Science & Ecology',
    categoryEn: 'Science & Ecology',
    passage: 'Over the past century, the global population of honeybees has declined at an unprecedented rate, predominantly attributable to pesticide overuse and habitat fragmentation. To mitigate this pollination deficit, researchers in Japan developed micro-drones equipped with ionic gel brushes capable of transporting pollen between flowering plants. While early laboratory trials demonstrated a remarkable 90% success rate in pollinating lilies, the technology remains prohibitively expensive for widespread commercial agricultural deployment.',
    statement: 'The Japanese miniature drones have replaced living bees in modern commercial agriculture.',
    answer: 'FALSE',
    trapType: 'Direct Contradiction (Mâu thuẫn trực tiếp)',
    trapTypeEn: 'Direct Contradiction Trap',
    explanation: 'Đáp án là FALSE. Bài đọc nói rõ "the technology remains prohibitively expensive for widespread commercial agricultural deployment" (công nghệ này vẫn quá đắt đỏ để triển khai thương mại rộng rãi), hoàn toàn trái ngược với phát biểu rằng drone đã thay thế ong sống trong nền nông nghiệp thương mại hiện đại.',
    explanationEn: 'The answer is FALSE. The passage explicitly states that "the technology remains prohibitively expensive for widespread commercial agricultural deployment", directly contradicting the statement that drones have replaced living bees in modern commercial agriculture.',
    evidence: '...the technology remains prohibitively expensive for widespread commercial agricultural deployment.',
    evidenceEn: '...the technology remains prohibitively expensive for widespread commercial agricultural deployment.'
  },
  {
    id: 'drill-tfng-2',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy Not Given vs False: Khảo cổ học nền văn minh Maya',
    titleEn: 'Not Given vs False Trap: Maya Civilization Archaeology',
    category: 'History & Archaeology',
    categoryEn: 'History & Archaeology',
    passage: 'Recent LiDAR aerial surveys over the Guatemalan jungle have penetrated dense tropical canopies, revealing tens of thousands of previously undetected Mayan structures, including raised highways, agricultural terracing, and defensive fortifications. Archaeologists estimate that the Maya lowlands supported a population of up to 15 million people during the Classic period, vastly surpassing earlier conservative projections of 5 million.',
    statement: 'Archaeologists believe that a prolonged drought was the principal catalyst for the eventual abandonment of Maya cities.',
    answer: 'NOT GIVEN',
    trapType: 'Assumption Trap (Bẫy kiến thức thực tế / Suy diễn vô căn cứ)',
    trapTypeEn: 'Assumption Trap (Extrapolating outside the passage)',
    explanation: 'Đáp án là NOT GIVEN. Dù trên thực tế nhiều tài liệu lịch sử có giả thuyết về hạn hán dẫn tới sự sụp đổ của người Maya, nhưng trong ĐOẠN VĂN ĐÃ CHO, tác giả hoàn toàn không nhắc tới nguyên nhân sụp đổ hay hạn hán, mà chỉ thảo luận về công nghệ LiDAR và ước tính dân số thời cực thịnh.',
    explanationEn: 'The answer is NOT GIVEN. While historical hypotheses exist regarding drought causing Maya collapse, in the GIVEN PASSAGE, the author never mentions causes of collapse or drought, only LiDAR technology and peak population estimates.',
    evidence: 'Đoạn văn chỉ tập trung vào khảo sát LiDAR và dân số 15 triệu người; hoàn toàn không có thông tin về lý do bỏ hoang thành phố.',
    evidenceEn: 'The excerpt focuses solely on LiDAR surveys and population figures; there is no mention of drought or abandonment catalysts.'
  },
  {
    id: 'drill-tfng-3',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy Not Given vs True: Nhiệt độ đại dương sâu',
    titleEn: 'Not Given vs True Trap: Deep-Sea Hydrothermal Temperatures',
    category: 'Environmental Science',
    categoryEn: 'Environmental Science',
    passage: 'Deep-sea hydrothermal vents, first identified in 1977 near the Galapagos Rift, support intricate biological ecosystems sustained entirely without sunlight. Mineral-rich superheated fluids spew from these chimneys at temperatures regularly exceeding 400 degrees Celsius, yet the crushing hydrostatic pressure prevents the water from turning into steam.',
    statement: 'Tremendous water pressure at hydrothermal vent depths stops the superheated liquid from boiling into gas.',
    answer: 'TRUE',
    trapType: 'Paraphrase Confirmation (Xác nhận thông tin qua paraphrase)',
    trapTypeEn: 'Paraphrase Confirmation Trap',
    explanation: 'Đáp án là TRUE. Bài đọc khẳng định "the crushing hydrostatic pressure prevents the water from turning into steam" (áp suất thủy tĩnh nghiền nát ngăn nước biến thành hơi nước), đồng nghĩa tuyệt đối với phát biểu "Tremendous water pressure... stops the superheated liquid from boiling into gas".',
    explanationEn: 'The answer is TRUE. The passage confirms "the crushing hydrostatic pressure prevents the water from turning into steam", perfectly synonymous with "Tremendous water pressure... stops the superheated liquid from boiling into gas".',
    evidence: '...the crushing hydrostatic pressure prevents the water from turning into steam.',
    evidenceEn: '...the crushing hydrostatic pressure prevents the water from turning into steam.'
  },
  {
    id: 'drill-tfng-4',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy Not Given vs False: Ngủ ngắn (Power Nap) & Năng suất',
    titleEn: 'Not Given vs False Trap: Power Naps & Productivity',
    category: 'Psychology & Physiology',
    categoryEn: 'Psychology & Physiology',
    passage: 'A 2023 meta-analysis conducted across tech enterprises revealed that a structured 20-minute midday nap significantly elevated cognitive focus and reduced afternoon fatigue. However, researchers noted that individuals who extended their nap duration beyond 45 minutes experienced persistent sleep inertia, feeling groggier than before.',
    statement: 'Taking a 20-minute nap during the workday improves employees\' productivity more than taking a cup of espresso.',
    answer: 'NOT GIVEN',
    trapType: 'Comparative Trap (Bẫy so sánh không tồn tại)',
    trapTypeEn: 'Comparative Trap (Non-existent comparison)',
    explanation: 'Đáp án là NOT GIVEN. Bài đọc chỉ đề cập giấc ngủ 20 phút giúp tăng khả năng tập trung ("significantly elevated cognitive focus"), nhưng KHÔNG HỀ SO SÁNH hiệu quả của giấc ngủ với việc uống cà phê espresso.',
    explanationEn: 'The answer is NOT GIVEN. The text only notes a 20-minute nap significantly elevates cognitive focus, but NEVER compares its effectiveness with drinking espresso.',
    evidence: 'Không có thông tin hay phép so sánh nào về "espresso" hoặc caffeine trong bài đọc.',
    evidenceEn: 'No mention or comparison regarding espresso or caffeine appears in the text.'
  },

  // ==========================================
  // 2. READING PARAPHRASE HUNTER DRILLS
  // ==========================================
  {
    id: 'drill-para-hunter-1',
    type: 'reading-paraphrase',
    title: 'Truy tìm Paraphrase: Năng lượng tái tạo & Chi phí sản xuất',
    titleEn: 'Paraphrase Hunter: Renewable Energy & Production Costs',
    category: 'Academic Reading Skills',
    categoryEn: 'Academic Reading Skills',
    questionText: 'The sharp decline in the manufacturing expenses of photovoltaic panels has accelerated the adoption of clean power.',
    passageExcerpt: 'A dramatic plunge in production expenditures for solar modules has precipitated an unprecedented boom in the uptake of sustainable electricity.',
    pairs: [
      { questionWord: 'sharp decline', passageWord: 'dramatic plunge', meaning: 'sự sụt giảm mạnh', meaningEn: 'a sharp decline / dramatic plunge' },
      { questionWord: 'manufacturing expenses', passageWord: 'production expenditures', meaning: 'chi phí sản xuất', meaningEn: 'manufacturing / production expenses' },
      { questionWord: 'photovoltaic panels', passageWord: 'solar modules', meaning: 'tấm pin năng lượng mặt trời', meaningEn: 'photovoltaic panels / solar modules' },
      { questionWord: 'accelerated', passageWord: 'precipitated', meaning: 'thúc đẩy, đẩy nhanh tốc độ', meaningEn: 'accelerated / precipitated' },
      { questionWord: 'adoption', passageWord: 'uptake', meaning: 'sự áp dụng, tiếp nhận', meaningEn: 'adoption / uptake' },
      { questionWord: 'clean power', passageWord: 'sustainable electricity', meaning: 'năng lượng sạch/bền vững', meaningEn: 'clean power / sustainable electricity' }
    ]
  },
  {
    id: 'drill-para-hunter-2',
    type: 'reading-paraphrase',
    title: 'Truy tìm Paraphrase: Trí nhớ & Giấc ngủ sâu',
    titleEn: 'Paraphrase Hunter: Memory & Deep Sleep',
    category: 'Cognitive Science',
    categoryEn: 'Cognitive Science',
    questionText: 'Chronic insomnia severely damages the consolidation of episodic memories in adolescent students.',
    passageExcerpt: 'Prolonged sleeplessness exerts a detrimental impact on the stabilization of autobiographical recollections among teenage learners.',
    pairs: [
      { questionWord: 'Chronic insomnia', passageWord: 'Prolonged sleeplessness', meaning: 'mất ngủ kéo dài/mãn tính', meaningEn: 'chronic insomnia / prolonged sleeplessness' },
      { questionWord: 'severely damages', passageWord: 'exerts a detrimental impact on', meaning: 'gây tác động tiêu cực nặng nề', meaningEn: 'severely damages / exerts a detrimental impact on' },
      { questionWord: 'consolidation', passageWord: 'stabilization', meaning: 'sự củng cố, ổn định', meaningEn: 'consolidation / stabilization' },
      { questionWord: 'episodic memories', passageWord: 'autobiographical recollections', meaning: 'kỷ niệm/ký ức theo sự kiện bản thân', meaningEn: 'episodic memories / autobiographical recollections' },
      { questionWord: 'adolescent students', passageWord: 'teenage learners', meaning: 'học sinh lứa tuổi thiếu niên', meaningEn: 'adolescent students / teenage learners' }
    ]
  },
  {
    id: 'drill-para-hunter-3',
    type: 'reading-paraphrase',
    title: 'Truy tìm Paraphrase: Tác động biến đổi khí hậu lên đô thị ven biển',
    titleEn: 'Paraphrase Hunter: Climate Change Impact on Coastal Cities',
    category: 'Urban Planning',
    categoryEn: 'Urban Planning',
    questionText: 'Rising sea levels threaten to submerge essential transit networks in coastal metropolises.',
    passageExcerpt: 'Encroaching oceanic waters jeopardize the operational integrity of critical transportation infrastructure throughout littoral cities.',
    pairs: [
      { questionWord: 'Rising sea levels', passageWord: 'Encroaching oceanic waters', meaning: 'mực nước biển dâng cao/xâm lấn', meaningEn: 'rising sea levels / encroaching oceanic waters' },
      { questionWord: 'threaten to', passageWord: 'jeopardize', meaning: 'đe dọa, đặt vào vòng nguy hiểm', meaningEn: 'threaten to / jeopardize' },
      { questionWord: 'submerge / damage', passageWord: 'the operational integrity', meaning: 'sự nguyên vẹn và khả năng vận hành', meaningEn: 'submerge / operational integrity' },
      { questionWord: 'essential transit networks', passageWord: 'critical transportation infrastructure', meaning: 'hạ tầng giao thông trọng yếu', meaningEn: 'essential transit networks / critical infrastructure' },
      { questionWord: 'coastal metropolises', passageWord: 'littoral cities', meaning: 'các thành phố ven biển', meaningEn: 'coastal metropolises / littoral cities' }
    ]
  },

  // ==========================================
  // 3. MATCHING HEADINGS TRAP-BREAKER DRILLS
  // ==========================================
  {
    id: 'drill-head-1',
    type: 'reading-headings',
    title: 'Phá bẫy Matching Headings: Hệ thống phòng thủ của rạn san hô',
    titleEn: 'Matching Headings Trap: Coral Reef Defense Mechanisms',
    category: 'Marine Biology',
    categoryEn: 'Marine Biology',
    paragraph: 'Far from being passive geological formations, coral reefs actively mitigate shoreline erosion by dissipating up to 97% of wave energy before it strikes inhabited coastal margins. Furthermore, their intricate calcareous labyrinths act as natural breakwaters that shelter low-lying communities from destructive storm surges. Computational simulations demonstrate that losing just one meter of vertical reef height would double the economic devastation wrought by frequent cyclones.',
    correctHeadingIndex: 0,
    headings: [
      {
        id: 'h1',
        text: 'The indispensable coastal protective function of coral reefs',
        isCorrect: true,
        type: 'CORRECT',
        typeEn: 'CORRECT HEADING',
        analysis: 'Đây là Heading chính xác vì bao quát toàn bộ đoạn văn: phân tích chức năng bảo vệ đê kè tự nhiên, giảm năng lượng sóng và ngăn ngừa bão lũ cho vùng ven biển.',
        analysisEn: 'This is the correct heading as it synthesizes the entire paragraph: natural breakwaters, wave energy dissipation, and coastline defense.'
      },
      {
        id: 'h2',
        text: 'The economic impact of computer simulations on marine biology',
        isCorrect: false,
        type: 'DETAIL_TRAP',
        typeEn: 'DETAIL TRAP',
        analysis: 'BẪY CHI TIẾT (Detail Trap): "Computational simulations" chỉ là một công cụ đo lường xuất hiện ở câu cuối để minh họa thiệt hại, không phải ý chính của toàn đoạn.',
        analysisEn: 'DETAIL TRAP: "Computational simulations" is merely an illustrative measurement mentioned in the final sentence, not the paragraph theme.'
      },
      {
        id: 'h3',
        text: 'The global commercial value of tropical fisheries and tourism',
        isCorrect: false,
        type: 'IRRELEVANT',
        typeEn: 'IRRELEVANT TRAP',
        analysis: 'BẪY LỆCH TRỌNG TÂM (Irrelevant / Off-topic): Đoạn văn không hề nhắc tới nghề cá (fisheries) hay du lịch (tourism).',
        analysisEn: 'IRRELEVANT TRAP: The paragraph does not mention fisheries or tourism at all.'
      },
      {
        id: 'h4',
        text: 'How climate change affects diverse marine species across the globe',
        isCorrect: false,
        type: 'TOO_GENERAL',
        typeEn: 'TOO GENERAL TRAP',
        analysis: 'BẪY QUÁ RỘNG (Too General): Đề cập đến toàn bộ sinh vật biển và biến đổi khí hậu nói chung, trong khi đoạn văn chỉ tập trung vào rạn san hô và cơ chế cản sóng ven bờ.',
        analysisEn: 'TOO GENERAL TRAP: Broadly mentions diverse marine species globally, whereas the excerpt is specifically centered on coral reefs and coastal protection.'
      }
    ],
    topicSentence: 'Far from being passive geological formations, coral reefs actively mitigate shoreline erosion by dissipating up to 97% of wave energy...'
  },
  {
    id: 'drill-head-2',
    type: 'reading-headings',
    title: 'Phá bẫy Matching Headings: Sự trỗi dậy của lao động từ xa',
    titleEn: 'Matching Headings Trap: The Rise of Remote Work',
    category: 'Workplace & Sociology',
    categoryEn: 'Workplace & Sociology',
    paragraph: 'While remote work was initially heralded as the ultimate liberation from tedious daily commutes and rigid office hierarchies, an emerging body of organizational research paints a far more ambiguous reality. Employees frequently report feelings of profound social alienation and find it increasingly arduous to disengage psychologically after official work hours. Furthermore, corporate managers observe that spontaneous interdepartmental serendipity and creative brainstorming sessions have noticeably diminished in virtualized environments.',
    correctHeadingIndex: 1,
    headings: [
      {
        id: 'h1',
        text: 'The complete elimination of physical office buildings by 2030',
        isCorrect: false,
        type: 'EXTREME_TRAP',
        typeEn: 'EXTREME STATEMENT TRAP',
        analysis: 'BẪY TUYỆT ĐỐI HÓA (Extreme Statement): Bài đọc không nói văn phòng sẽ biến mất hoàn toàn vào năm 2030.',
        analysisEn: 'EXTREME STATEMENT TRAP: The text never asserts that physical offices will completely vanish by 2030.'
      },
      {
        id: 'h2',
        text: 'Unanticipated drawbacks and hidden costs of remote employment',
        isCorrect: true,
        type: 'CORRECT',
        typeEn: 'CORRECT HEADING',
        analysis: 'CHÍNH XÁC: Toàn bộ đoạn văn phân tích các mặt trái không lường trước (alienation, inability to disengage, loss of serendipity) của làm việc từ xa.',
        analysisEn: 'CORRECT: The entire paragraph analyzes the unforeseen downsides (alienation, failure to disengage, loss of serendipity) of remote employment.'
      },
      {
        id: 'h3',
        text: 'Technological software tools facilitating virtual brainstorming',
        isCorrect: false,
        type: 'DETAIL_TRAP',
        typeEn: 'KEYWORD TRAP',
        analysis: 'BẪY TỪ KHÓA (Keyword Trap): Thấy chữ "brainstorming" trong bài nhưng đoạn văn đang nói về sự suy giảm sáng tạo chứ không giới thiệu phần mềm công nghệ.',
        analysisEn: 'KEYWORD TRAP: Contains "brainstorming", but the text laments the decline of creative sessions rather than promoting software tools.'
      },
      {
        id: 'h4',
        text: 'The environmental benefits of eliminating the daily commute',
        isCorrect: false,
        type: 'DISTRACTOR',
        typeEn: 'DISTRACTOR TRAP',
        analysis: 'BẪY GÂY NHIỄU: Việc không phải đi lại (commutes) chỉ được nhắc thoáng qua ở câu đầu tiên như một kỳ vọng ban đầu, không phải nội dung cốt lõi của đoạn.',
        analysisEn: 'DISTRACTOR TRAP: Commute reduction was only referenced as an initial expectation in sentence 1, not the paragraph core.'
      }
    ],
    topicSentence: 'While remote work was initially heralded as the ultimate liberation... an emerging body of organizational research paints a far more ambiguous reality.'
  },

  // ==========================================
  // 4. CONTEXTUAL VOCABULARY DECRYPTION DRILLS (Phòng Chung)
  // ==========================================
  {
    id: 'drill-vocab-1',
    type: 'context-vocab',
    title: 'Đoán nghĩa từ: "ephemeral"',
    titleEn: 'Context Vocab: "ephemeral"',
    category: 'Core Academic Vocabulary',
    categoryEn: 'Core Academic Vocabulary',
    sentence: 'Unlike perennial trees that endure decades of harsh winters, desert wildflowers possess an ephemeral existence, blooming vigorously for merely two days following rare flash floods before withering away.',
    targetWord: 'ephemeral',
    clueType: 'Contrast Clue ("Unlike...") & Definition by detail ("blooming for merely two days... before withering")',
    clueTypeEn: 'Contrast Clue ("Unlike...") & Detail Definition',
    options: [
      { text: 'lasting for a very short time; transient', isCorrect: true },
      { text: 'extremely resilient to toxic environments', isCorrect: false },
      { text: 'growing abundantly throughout the entire year', isCorrect: false },
      { text: 'poisonous to grazing herbivorous animals', isCorrect: false }
    ],
    explanation: 'Manh mối tương phản "Unlike perennial trees..." (khác với cây lâu năm sống qua nhiều thập kỷ) kết hợp với chi tiết "blooming for merely two days... before withering" (chỉ nở đúng 2 ngày trước khi tàn lụi) cho thấy từ "ephemeral" có nghĩa là ngắn ngủi, phù du, thoáng qua (transient).',
    explanationEn: 'The contrast clue "Unlike perennial trees..." combined with "blooming for merely two days... before withering" shows that "ephemeral" denotes short-lived, transient, or fleeting existence.'
  },
  {
    id: 'drill-vocab-2',
    type: 'context-vocab',
    title: 'Đoán nghĩa từ: "obfuscate"',
    titleEn: 'Context Vocab: "obfuscate"',
    category: 'Academic Discourse',
    categoryEn: 'Academic Discourse',
    sentence: 'Rather than delivering a candid explanation of the fiscal deficit, the corporate spokesperson used verbose jargon intentionally designed to obfuscate the company\'s impending bankruptcy.',
    targetWord: 'obfuscate',
    clueType: 'Contrast Clue ("Rather than delivering a candid explanation...")',
    clueTypeEn: 'Contrast Clue ("Rather than delivering a candid explanation...")',
    options: [
      { text: 'to make something obscure, unclear, or difficult to understand', isCorrect: true },
      { text: 'to publicize financial reports widely to the press', isCorrect: false },
      { text: 'to legally prevent shareholders from filing a lawsuit', isCorrect: false },
      { text: 'to resolve an internal monetary disagreement swiftly', isCorrect: false }
    ],
    explanation: 'Manh mối "Rather than delivering a candid explanation..." (Thay vì đưa ra lời giải thích thẳng thắn, rõ ràng) kết hợp với "used verbose jargon" (dùng biệt ngữ dài dòng) đối lập với sự minh bạch, suy ra "obfuscate" nghĩa là làm lu mờ, gây bối rối, đánh hỏa mù.',
    explanationEn: 'The contrast clue "Rather than delivering a candid explanation..." combined with "used verbose jargon" contrasts with transparency, showing that "obfuscate" means to make obscure, unclear, or difficult to understand.'
  },

  // ==========================================
  // 5. SENTENCE CHUNKING / DECONSTRUCTION DRILLS (Phòng Chung)
  // ==========================================
  {
    id: 'drill-chunk-1',
    type: 'sentence-chunking',
    title: 'Giải phẫu câu phức: Tác động của đô thị hóa lên nguồn nước ngầm',
    titleEn: 'Complex Sentence S-V-O: Impact of Urbanization on Groundwater',
    category: 'Academic Sentence Mastery',
    categoryEn: 'Academic Sentence Mastery',
    fullSentence: 'Urban expansion across sprawling alluvial plains, which systematically replaces permeable soil with impervious asphalt surfaces, severely inhibits natural rainwater infiltration into subterranean aquifers.',
    subject: 'Urban expansion across sprawling alluvial plains',
    subModifier: 'which systematically replaces permeable soil with impervious asphalt surfaces (Mệnh đề phụ quan hệ - bổ nghĩa giải thích)',
    subModifierEn: 'which systematically replaces permeable soil with impervious asphalt surfaces (Relative clause - explanatory modifier)',
    coreVerb: 'severely inhibits (làm cản trở/suy giảm nghiêm trọng)',
    coreVerbEn: 'severely inhibits (drastically obstructs/diminishes)',
    objectResult: 'natural rainwater infiltration into subterranean aquifers (sự thẩm thấu nước mưa vào các tầng ngậm nước ngầm)',
    objectResultEn: 'natural rainwater infiltration into subterranean aquifers',
    takeawayVietnamese: 'Mệnh đề cốt lõi chỉ đơn giản là: "Đô thị hóa làm cản trở nước mưa ngấm vào nguồn nước ngầm". Nhận diện nhanh S-V-O giúp loại bỏ 40% độ rối của câu trong phòng thi!',
    takeawayEn: 'Core S-V-O message: "Urbanization prevents rainwater from infiltrating groundwater." Isolating the core subject-verb-object strips 40% of reading complexity under exam pressure!'
  },
  {
    id: 'drill-chunk-2',
    type: 'sentence-chunking',
    title: 'Giải phẫu câu phức: Cơ chế tiến hóa của vi khuẩn kháng kháng sinh',
    titleEn: 'Complex Sentence S-V-O: Evolutionary Mechanisms of Antibiotic-Resistant Bacteria',
    category: 'Medical Science',
    categoryEn: 'Medical Science',
    fullSentence: 'The indiscriminate administration of broad-spectrum antimicrobials in modern industrial livestock farming, by eliminating susceptible microbial strains and leaving resilient mutants unscathed, inadvertently accelerates the evolution of multidrug-resistant superbugs.',
    subject: 'The indiscriminate administration of broad-spectrum antimicrobials in modern industrial livestock farming',
    subModifier: 'by eliminating susceptible microbial strains and leaving resilient mutants unscathed (Cụm trạng từ chỉ phương thức/cách thức)',
    subModifierEn: 'by eliminating susceptible microbial strains and leaving resilient mutants unscathed (Adverbial clause of manner)',
    coreVerb: 'inadvertently accelerates (vô tình làm tăng tốc/thúc đẩy)',
    coreVerbEn: 'inadvertently accelerates',
    objectResult: 'the evolution of multidrug-resistant superbugs (sự tiến hóa của các siêu vi khuẩn kháng đa thuốc)',
    objectResultEn: 'the evolution of multidrug-resistant superbugs',
    takeawayVietnamese: 'Thông điệp xương sống: "Việc lạm dụng thuốc kháng sinh trong chăn nuôi thúc đẩy sự tiến hóa của siêu vi khuẩn". Mọi chi tiết ở giữa chỉ là cách thức phụ.',
    takeawayEn: 'Backbone takeaway: "Overusing antibiotics in livestock drives the evolution of superbugs." All intervening clauses are subordinate modifiers.'
  }
];
