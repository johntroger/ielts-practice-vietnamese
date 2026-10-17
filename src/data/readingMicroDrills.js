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
    id: 'drill-tfng-101-1',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy False vs Not Given: Thiết kế cung điện Ducal của Palladio',
    titleEn: 'False vs Not Given Trap: Palladio Ducal Palace Design',
    category: 'Architecture & History',
    categoryEn: 'Architecture & History',
    passage: 'After a fire at the Ducal Palace, Palladio offered an alternative design which bears an uncanny resemblance to the Banqueting House in Whitehall in London. Since it was designed by Inigo Jones, Palladio\'s first foreign disciple, this is not as surprising as it sounds.',
    statement: 'Palladio\'s alternative design for the Ducal Palace in Venice was based on an English building.',
    answer: 'FALSE',
    trapType: 'Chronological & Directional Reversal Trap (Bẫy đảo chiều nguyên nhân - hệ quả)',
    trapTypeEn: 'Chronological & Directional Reversal Trap',
    explanation: 'Đáp án là FALSE. Đoạn văn chỉ ra chính kiến trúc sư người Anh Inigo Jones học theo phong cách của thầy mình là Palladio (Palladio\'s first foreign disciple), chứ không phải Palladio đi sao chép tòa nhà ở Anh.',
    explanationEn: 'The answer is FALSE. Inigo Jones in London was Palladio\'s disciple who modeled his building on Palladio, directly contradicting the claim that Palladio based his work on an English building.',
    evidence: 'Since it was designed by Inigo Jones, Palladio\'s first foreign disciple, this is not as surprising as it sounds.',
    evidenceEn: 'Since it was designed by Inigo Jones, Palladio\'s first foreign disciple, this is not as surprising as it sounds.'
  },
  {
    id: 'drill-ynng-101-2',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy No vs Yes: Nguyên nhân Trái Đất không thể sinh sống',
    titleEn: 'No vs Yes Trap: Causes of Uninhabitable Earth',
    category: 'Earth & Planetary Science',
    categoryEn: 'Earth & Planetary Science',
    passage: 'The Earth is indeed an uncertain place, in an uncertain universe, but with average luck, it should do us well enough. If the world does become inhospitable in the next few thousand or million years, then it will probably be our own fault. In short, despite the underlying uncertainty, our own future and that of our fellow creatures is very much in our own hands.',
    statement: 'If the world becomes uninhabitable, it is most likely to be as a result of a natural disaster.',
    answer: 'NO',
    trapType: 'Direct Contradiction Trap (Mâu thuẫn trực tiếp với tác giả)',
    trapTypeEn: 'Direct Contradiction Trap',
    explanation: 'Đáp án là NO. Tác giả khẳng định rõ ràng nếu Trái Đất trở nên khắc nghiệt không sống được thì đó là lỗi do chính con người tạo ra ("it will probably be our own fault"), mâu thuẫn hoàn toàn với khẳng định do thiên tai (natural disaster).',
    explanationEn: 'The answer is NO. The author states that if the world becomes inhospitable, "it will probably be our own fault", directly contradicting the statement that it would be due to a natural disaster.',
    evidence: 'If the world does become inhospitable in the next few thousand or million years, then it will probably be our own fault.',
    evidenceEn: 'If the world does become inhospitable in the next few thousand or million years, then it will probably be our own fault.'
  },
  {
    id: 'drill-tfng-101-t2-1',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy False vs Not Given: Ưu tiên nghiên cứu truyền hình',
    titleEn: 'False vs Not Given Trap: Priority of Scientific TV Inquiries',
    category: 'Media Psychology',
    categoryEn: 'Media Psychology',
    passage: 'Scientists have studied television viewing habits for decades, but the priority for scientific inquiry has historically centered on the content of programming (such as violence or gender stereotypes) rather than the physical medium itself. However, the experience of viewing itself produces marked physiological and psychological reactions that are independent of what is being watched.',
    statement: 'Information medium as TV has always been the priority for scientific research.',
    answer: 'FALSE',
    trapType: 'Direct Contradiction (Mâu thuẫn trực tiếp đối tượng nghiên cứu)',
    trapTypeEn: 'Direct Contradiction Trap (Inverted Priority)',
    explanation: 'Đáp án là FALSE. Đoạn văn khẳng định ưu tiên nghiên cứu lịch sử tập trung vào nội dung chương trình ("centered on the content of programming... rather than the physical medium itself"), trái ngược hoàn toàn với phát biểu rằng bản thân phương tiện TV luôn là ưu tiên nghiên cứu.',
    explanationEn: 'The answer is FALSE. The passage explicitly states that scientific priority "has historically centered on the content of programming... rather than the physical medium itself", directly contradicting the statement.',
    evidence: '...the priority for scientific inquiry has historically centered on the content of programming... rather than the physical medium itself.',
    evidenceEn: '...the priority for scientific inquiry has historically centered on the content of programming... rather than the physical medium itself.'
  },
  {
    id: 'drill-tfng-101-t2-2',
    type: 'reading-tfng',
    title: 'Phân biệt bẫy False vs Not Given: Lý do rùa biển dạt vào bờ',
    titleEn: 'False vs Not Given Trap: Why Sea Turtles Stray Across the Atlantic',
    category: 'Marine Biology & Ecology',
    categoryEn: 'Marine Biology & Ecology',
    passage: 'During the past month, four turtles have washed up along Irish coasts from Wexford to Kerry. These turtles are more typical of warmer waters and only occur in Irish waters when they stray off course. Severe storms in the western Atlantic could be to blame for blowing the turtles across the ocean, where they were carried towards Europe on the Gulf Stream.',
    statement: 'Scientists have conclusively proven that hurricanes are the sole reason sea turtles wash ashore in Ireland.',
    answer: 'FALSE',
    trapType: 'Absolute vs Qualified (Bẫy từ ngữ tuyệt đối hóa: "sole reason" vs "could be to blame")',
    trapTypeEn: 'Absolute vs Qualified Trap (Over-Generalization)',
    explanation: 'Đáp án là FALSE. Bài đọc dùng động từ khuyết thiếu giả định "could be to blame" (có thể là nguyên nhân), không hề khẳng định chắc chắn là nguyên nhân duy nhất ("conclusively proven as sole reason").',
    explanationEn: 'The answer is FALSE. The text uses the tentative modal phrase "could be to blame", directly contradicting the assertion that storms are "conclusively proven" to be the "sole reason".',
    evidence: 'Severe storms in the western Atlantic could be to blame for blowing the turtles across the ocean...',
    evidenceEn: 'Severe storms in the western Atlantic could be to blame for blowing the turtles across the ocean...'
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
  },

  // ==========================================
  // 6. 101 PAST PAPERS BATCH 1 DRILLS (Tests 3, 4, 5)
  // ==========================================
  {
    id: 'drill-101-batch1-tfng-1',
    type: 'reading-tfng',
    title: 'Bẫy Phân Định Not Given: Sự Tuyệt Chủng Của Khủng Long (Test 5)',
    titleEn: 'Not Given Trap: Dinosaur Extinction Dynamics (Test 5)',
    category: 'Paleontology & Geology',
    categoryEn: 'Paleontology & Geology',
    passage: 'The toe-to-heel length of the foot of a meat eater from the Jurassic period was on average 20 percent longer than its Triassic ancestor. Larger feet can carry bigger bodies; the scientists infer the dinosaurs doubled in weight, eventually evolving into fearsome velociraptors, Tyrannosaurus rex and other large carnivorous dinosaurs.',
    statement: 'Tyrannosaurus rex was larger in body size than other carnivorous dinosaurs.',
    answer: 'NOT GIVEN',
    trapType: 'Comparative Trap (Bẫy so sánh hơn không có trong bài)',
    trapTypeEn: 'Comparative Trap (Unsubstantiated superlative/comparative)',
    explanation: 'Đáp án là NOT GIVEN. Dù bài đọc liệt kê T. rex cùng với velociraptor và các loài ăn thịt lớn ("Tyrannosaurus rex and other large carnivorous dinosaurs"), tác giả không hề so sánh liệu kích thước của T. rex có lớn hơn tất cả các loài ăn thịt khác hay không.',
    explanationEn: 'The answer is NOT GIVEN. Although the text mentions T. rex alongside other large carnivores ("Tyrannosaurus rex and other large carnivorous dinosaurs"), it never compares whether T. rex was larger in body size than the other carnivorous dinosaurs.',
    evidence: '...eventually evolving into fearsome velociraptors, Tyrannosaurus rex and other large carnivorous dinosaurs.',
    evidenceEn: '...eventually evolving into fearsome velociraptors, Tyrannosaurus rex and other large carnivorous dinosaurs.'
  },
  {
    id: 'drill-101-batch1-para-2',
    type: 'reading-paraphrase',
    title: 'Cặp Paraphrase Khảo Thí: Giấy & Máy Tính Văn Phòng (Test 4)',
    titleEn: 'Cambridge Paraphrase Pair: Paper vs Computer (Test 4)',
    category: 'Information Technology',
    categoryEn: 'Information Technology',
    passage: 'Paper allows spontaneous, tactile collaboration during face-to-face meetings, allowing documents to be rapidly tailorable to personal workflows, whereas digital monitors frequently isolate individual participants behind screens.',
    question: 'Trong câu trên, từ nào đồng nghĩa chuẩn khảo thí với "modifiable and adaptable to personal requirements"?',
    questionEn: 'In the passage above, which word is the exact exam paraphrase for "modifiable and adaptable to personal requirements"?',
    correctAnswer: 'tailorable',
    options: ['tailorable', 'spontaneous', 'tactile', 'frequently'],
    optionsEn: ['tailorable', 'spontaneous', 'tactile', 'frequently'],
    explanation: '"Tailorable" (có thể tùy chỉnh theo nhu cầu riêng) chính là paraphrase của "modifiable / adaptable to personal requirements". Đây là đáp án chính thức câu 35 Test 4.',
    explanationEn: '"Tailorable" means able to be adapted or modified to suit specific personal requirements. This matches official Question 35 in Test 4.'
  },
  {
    id: 'drill-101-batch1-para-3',
    type: 'reading-paraphrase',
    title: 'Cặp Paraphrase Khảo Thí: Kỷ Băng Hà & Hươu Khổng Lồ Ireland (Test 3)',
    titleEn: 'Cambridge Paraphrase Pair: Irish Elk & Glaciation (Test 3)',
    category: 'Evolutionary Biology',
    categoryEn: 'Evolutionary Biology',
    passage: 'Fossil evidence reveals that the giant deer survived through repeated cold glacial oscillations, taking shelter in forested refugia during warmer intervals between ice advances, before abrupt climate shifts decimated its feeding grounds.',
    question: 'Cụm từ nào trong đoạn văn trên diễn đạt tương đương với "forest shelter during warm phases"?',
    questionEn: 'Which phrase in the text above corresponds to "forest shelter during warm phases"?',
    correctAnswer: 'wooded interglacials',
    options: ['wooded interglacials', 'cold glacial oscillations', 'abrupt climate shifts', 'repeated ice advances'],
    optionsEn: ['wooded interglacials', 'cold glacial oscillations', 'abrupt climate shifts', 'repeated ice advances'],
    explanation: '"Wooded interglacials" (các thời kỳ gian băng rợp bóng rừng) là từ khóa chính thức câu 31 Test 3, diễn đạt việc loài hươu sinh sống trong các thời kỳ ấm giữa hai kỷ băng hà.',
    explanationEn: '"Wooded interglacials" refers to forested warm phases between glacial advances, matching official Question 31 in Test 3.'
  },

  // ==========================================
  // 7. 101 PAST PAPERS BATCH 2 DRILLS (Tests 6, 7, 8, 9)
  // ==========================================
  {
    id: 'drill-101-batch2-tfng-4',
    type: 'reading-tfng',
    title: 'Bẫy Phân Định Not Given: Sự Bùng Nổ Của Khủng Long (Test 7)',
    titleEn: 'Not Given Trap: Dinosaur Boom & Asteroids (Test 7)',
    category: 'Paleontology & Geology',
    categoryEn: 'Paleontology & Geology',
    passage: 'Dinosaurs first appear in the fossil record 230m years ago during the Triassic. They shared the earth with lots of other reptiles until the Jurassic period, when they turned into the monsters depicted in the book and movie Jurassic Park. Actually, though, the dinosaurs that appeared on screen were from the still more recent Cretaceous period.',
    statement: 'Books and movies like Jurassic Park often exaggerate the physical dimensions and body weight of dinosaurs.',
    answer: 'NOT GIVEN',
    trapType: 'Extrapolation Trap (Bẫy suy diễn ngoài văn bản)',
    trapTypeEn: 'Extrapolation Trap (Unsubstantiated speculation beyond text)',
    explanation: 'Đáp án là NOT GIVEN. Mặc dù bài đọc nhắc đến bộ phim "Jurassic Park" và đính chính rằng khủng long trên màn ảnh thực chất thuộc kỷ Phấn trắng, tác giả không hề bàn luận xem phim có phóng đại (exaggerate) kích thước hay trọng lượng của khủng long hay không.',
    explanationEn: 'The answer is NOT GIVEN. While the text mentions "Jurassic Park" and clarifies that the dinosaurs on screen were actually from the Cretaceous period, it never mentions whether movies or books exaggerated their physical dimensions or weight.',
    evidence: '...the monsters depicted in the book and movie Jurassic Park. (Actually, though, the dinosaurs that appeared on screen were from the still more recent Cretaceous period.)',
    evidenceEn: '...the monsters depicted in the book and movie Jurassic Park. (Actually, though, the dinosaurs that appeared on screen were from the still more recent Cretaceous period.)'
  },
  {
    id: 'drill-101-batch2-para-5',
    type: 'reading-paraphrase',
    title: 'Cặp Paraphrase Khảo Thí: Tiến Hóa Mỏ Chim Sẻ (Test 8)',
    titleEn: 'Cambridge Paraphrase Pair: Finch Evolution & Human Impact (Test 8)',
    category: 'Evolutionary Biology',
    categoryEn: 'Evolutionary Biology',
    passage: 'On Santa Cruz island, scientists documented a distinct reversal in finch evolution, where intermediate-billed birds thrived due to the expanding human population introducing non-native plants and table scraps.',
    question: 'Cụm từ nào trong bài thể hiện nguyên nhân gốc rễ thúc đẩy sự biến đổi đặc điểm sinh học của chim sẻ?',
    questionEn: 'Which phrase in the text indicates the root cause driving the biological shift in the finches?',
    correctAnswer: 'expanding human population',
    options: ['expanding human population', 'distinct reversal', 'intermediate-billed birds', 'table scraps'],
    optionsEn: ['expanding human population', 'distinct reversal', 'intermediate-billed birds', 'table scraps'],
    explanation: '"Expanding human population" (dân số con người ngày càng gia tăng) là nguyên nhân cốt lõi dẫn đến việc xuất hiện thức ăn nhân tạo và làm đảo ngược hướng chọn lọc tự nhiên của chim sẻ.',
    explanationEn: '"Expanding human population" is the root cause introducing alien seeds and human food that reversed the natural selection process of finch bills.'
  },
  {
    id: 'drill-101-batch2-tfng-6',
    type: 'reading-tfng',
    title: 'Bẫy True / False: Lịch Sử Tên Lửa Cổ Đại Trung Hoa (Test 9)',
    titleEn: 'True / False Trap: Ancient Chinese Rocketry (Test 9)',
    category: 'History of Technology',
    categoryEn: 'History of Technology',
    passage: 'Rocket technology has progressed considerably since the days of "fire arrows" first used in China around 500 BC, and, during the Sung Dynasty, deployed to repel Mongol invaders at the battle of Kaifeng in AD 1232.',
    statement: 'Ancient China had already deployed rockets for military purposes as early as 500 years ago.',
    answer: 'FALSE',
    trapType: 'Numerical Chronology Trap (Bẫy mốc thời gian lịch sử)',
    trapTypeEn: 'Numerical Chronology Trap (Contradictory timeline calculation)',
    explanation: 'Đáp án là FALSE. Trận Khai Phong diễn ra vào năm 1232 SCN (hơn 700 - 800 năm trước), do đó phát biểu rằng Trung Quốc chỉ mới dùng tên lửa cho mục đích quân sự cách đây 500 năm là mâu thuẫn trực tiếp với văn bản.',
    explanationEn: 'The answer is FALSE. Rockets were deployed in the battle of Kaifeng in AD 1232 (over 700-800 years ago). Stating they were deployed "as early as 500 years ago" directly contradicts the historical date in the text.',
    evidence: '...and, during the Sung Dynasty, to repel Mongol invaders at the battle of Kaifeng in AD 1232.',
    evidenceEn: '...and, during the Sung Dynasty, to repel Mongol invaders at the battle of Kaifeng in AD 1232.'
  },
  {
    id: 'drill-101-batch2-para-7',
    type: 'reading-paraphrase',
    title: 'Cặp Paraphrase Khảo Thí: Bột Talc Công Nghiệp (Test 6)',
    titleEn: 'Cambridge Paraphrase Pair: Industrial Talc Applications (Test 6)',
    category: 'Material Science',
    categoryEn: 'Material Science',
    passage: 'In the manufacture of chewing gum, micronised talc powder is dusted across product sheets to prevent tackiness during the lamination and packing process.',
    question: 'Từ "tackiness" trong câu trên đồng nghĩa với khái niệm nào trong bài đọc?',
    questionEn: 'In the passage above, "tackiness" is the exact paraphrase for which operational challenge?',
    correctAnswer: 'sticking',
    options: ['sticking', 'lamination', 'micronised', 'packing'],
    optionsEn: ['sticking', 'lamination', 'micronised', 'packing'],
    explanation: '"Tackiness" (độ dính/bám dính) đồng nghĩa với "sticking". Bột talc được rắc để kẹo cao su không bị dính trong quá trình dát mỏng và đóng gói.',
    explanationEn: '"Tackiness" means stickiness. Talc prevents chewing gum from sticking during the lamination and packaging operations.'
  },

  // ==========================================
  // 8. 101 PAST PAPERS BATCH 3 DRILLS (Tests 10, 11, 12, 13)
  // ==========================================
  {
    id: 'drill-101-batch3-tfng-10',
    type: 'reading-tfng',
    title: 'Bẫy Phân Định Not Given: Bệnh Truyền Nhiễm Ở Koala (Test 10)',
    titleEn: 'Not Given Trap: Koala Disease Transmission (Test 10)',
    category: 'Zoology & Conservation',
    categoryEn: 'Zoology & Conservation',
    passage: 'Australian zoos charge visitors to hug koalas. But people may not realise how cruel this is: because of the koala\'s delicate disposition, constant handling can push an already precariously balanced physiology over the edge.',
    statement: 'Koalas are easily infected with human contagious disease via cuddling.',
    answer: 'NOT GIVEN',
    trapType: 'Assumed Mechanism Trap (Bẫy giả định nguyên nhân chưa có trong văn bản)',
    trapTypeEn: 'Assumed Mechanism Trap (Unsubstantiated causal link)',
    explanation: 'Đáp án là NOT GIVEN. Mặc dù bài đọc nêu rõ việc ôm ấp (cuddling) gây căng thẳng sinh lý trầm trọng cho koala, văn bản không hề nhắc đến việc chúng bị lây các bệnh truyền nhiễm từ con người.',
    explanationEn: 'The answer is NOT GIVEN. Although the text states that cuddling causes physiological distress, it never mentions whether koalas contract contagious diseases from human contact.',
    evidence: '...because of the koala\'s delicate disposition, constant handling can push an already precariously balanced physiology over the edge.',
    evidenceEn: '...because of the koala\'s delicate disposition, constant handling can push an already precariously balanced physiology over the edge.'
  },
  {
    id: 'drill-101-batch3-tfng-11',
    type: 'reading-tfng',
    title: 'Bẫy Phân Định False: Khả Năng Diễn Đạt Của Chữ Hình Nêm (Test 11)',
    titleEn: 'False Trap: Expressive Capacity of Cuneiform (Test 11)',
    category: 'Ancient History & Linguistics',
    categoryEn: 'Ancient History & Linguistics',
    passage: 'The Rebus principle led to cuneiform becoming a form of logo-syllabic writing. Only when syllabic writing was introduced into cuneiform did it become possible to write prose such as myths and royal propaganda.',
    statement: 'Cuneiform could not express abstract concepts at all.',
    answer: 'FALSE',
    trapType: 'Absolute Negation Trap (Bẫy phủ định tuyệt đối "not at all")',
    trapTypeEn: 'Absolute Negation Trap (Extreme negative contradicted by text)',
    explanation: 'Đáp án là FALSE. Nhờ sự ra đời của nguyên lý rebus và lối viết ghi âm tiết (syllabic writing), chữ cuneiform đã có thể viết văn xuôi, thần thoại và các ý niệm trừu tượng, mâu thuẫn với "could not express at all".',
    explanationEn: 'The answer is FALSE. Syllabic signs allowed cuneiform to write prose, myths, and abstract concepts, directly contradicting "could not express abstract concepts at all".',
    evidence: 'Only when syllabic writing was introduced into cuneiform did it become possible to write prose such as myths and royal propaganda.',
    evidenceEn: 'Only when syllabic writing was introduced into cuneiform did it become possible to write prose such as myths and royal propaganda.'
  },
  {
    id: 'drill-101-batch3-para-12',
    type: 'reading-paraphrase',
    title: 'Cặp Paraphrase Khảo Thí: Dây Chuyền ECME Tự Động (Test 12)',
    titleEn: 'Cambridge Paraphrase Pair: Sargrove ECME Automation (Test 12)',
    category: 'Industrial Engineering',
    categoryEn: 'Industrial Engineering',
    passage: 'Between them, these two ECME lines did what a thousand assembly workers would otherwise have done. Human hands were needed only to feed the raw material in at one end and plug the valves into their sockets at the other.',
    question: 'Trong câu trên, từ nào biểu thị chuẩn xác bộ phận nối tiếp nhận linh kiện điện tử?',
    questionEn: 'In the passage above, which word designates the specific component connector fitted onto circuit boards?',
    correctAnswer: 'sockets',
    options: ['sockets', 'valves', 'assembly', 'circuits'],
    optionsEn: ['sockets', 'valves', 'assembly', 'circuits'],
    explanation: '"Sockets" là các ổ cắm gắn trên bảng mạch Bakelite để lắp bóng đèn chân không (valves) và loa. Đây là đáp án chính thức câu 5 Test 12.',
    explanationEn: '"Sockets" were the connectors fitted by robot hands to receive vacuum tubes/valves and loudspeakers (Question 5, Test 12).'
  },
  {
    id: 'drill-101-batch3-tfng-13',
    type: 'reading-tfng',
    title: 'Bẫy Phân Định False: Tên Gọi Bãi Biển Bondi (Test 13)',
    titleEn: 'False Trap: Bondi Beach Etymology (Test 13)',
    category: 'Cultural Geography',
    categoryEn: 'Cultural Geography',
    passage: '"Bondi" or "Boondi" is an Aboriginal word meaning water breaking over rocks or the sound of breaking waves. The Australian Museum records that Bondi means place where a flight of nullas took place.',
    statement: 'The name of the Bondi beach is first called by the British settlers.',
    answer: 'FALSE',
    trapType: 'Origin / Etymology Trap (Bẫy nguồn gốc tên gọi)',
    trapTypeEn: 'Origin / Etymology Trap (Attributing indigenous name to settlers)',
    explanation: 'Đáp án là FALSE. "Bondi" vốn là từ của thổ dân Úc (Aboriginal word) từ ngàn xưa, không phải do người định cư Anh (British settlers) đặt ra.',
    explanationEn: 'The answer is FALSE. Bondi is an indigenous Aboriginal word, directly contradicting the claim that it was first named by British settlers.',
    evidence: '"Bondi" or "Boondi" is an Aboriginal word meaning water breaking over rocks...',
    evidenceEn: '"Bondi" or "Boondi" is an Aboriginal word meaning water breaking over rocks...'
  }
];

