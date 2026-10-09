/**
 * IELTS 15-Minute Diagnostic Placement Engine & 30-Day Adaptive Study Plan Generator
 * Calibrated micro-skill questions assessing Reading, Listening, Writing, and Speaking readiness.
 * Fully localized with Vietnamese and English academic prompts and explanations.
 */

export const DIAGNOSTIC_QUESTIONS = [
  // --- READING MODULE (Questions 1 - 4) ---
  {
    id: 'diag-r1',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 1: Nhận diện Luận điểm Chính (Skimming)',
    titleEn: 'Question 1: Main Idea Identification (Skimming)',
    passage: 'The advent of automated algorithmic auditing in financial institutions has not eliminated human oversight; rather, it has shifted human responsibility towards higher-order ethical scrutiny and anomaly interpretation that machine models cannot independently adjudicate.',
    passageEn: 'The advent of automated algorithmic auditing in financial institutions has not eliminated human oversight; rather, it has shifted human responsibility towards higher-order ethical scrutiny and anomaly interpretation that machine models cannot independently adjudicate.',
    question: 'Theo đoạn văn trên, nhận định nào sau đây là ĐÚNG?',
    questionEn: 'According to the passage above, which of the following statements is TRUE?',
    options: [
      { key: 'A', text: 'Kiểm toán tự động đã thay thế hoàn toàn các chuyên viên tài chính con người.', textEn: 'Automated algorithmic auditing has completely replaced human financial professionals.' },
      { key: 'B', text: 'Con người giờ đây tập trung vào việc phán đoán đạo đức và giải thích các điểm bất thường mà máy móc không thể tự quyết.', textEn: 'Humans now focus on ethical scrutiny and anomaly interpretation that machines cannot independently judge.', isCorrect: true },
      { key: 'C', text: 'Máy móc hiện đã có khả năng độc lập đưa ra phán quyết đạo đức tài chính.', textEn: 'Machines now possess the capability to independently make financial ethical judgments.' },
      { key: 'D', text: 'Kiểm toán bằng thuật toán bị xem là kém hiệu quả hơn phương pháp truyền thống.', textEn: 'Algorithmic auditing is deemed less effective than traditional methodologies.' }
    ],
    explanation: 'Đoạn văn nêu rõ: "shifted human responsibility towards higher-order ethical scrutiny and anomaly interpretation that machine models cannot independently adjudicate".',
    explanationEn: 'The passage explicitly states human responsibility has "shifted towards higher-order ethical scrutiny and anomaly interpretation that machine models cannot independently adjudicate".'
  },
  {
    id: 'diag-r2',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 2: Phân biệt Bẫy Tuyệt Đối Hóa (True / False / Not Given)',
    titleEn: 'Question 2: Absolute Language Distractor Trap (True / False / Not Given)',
    passage: 'While intermittent fasting has demonstrated metabolic advantages in rodent models, clinical nutritionists emphasize that longitudinal human studies remain insufficient to conclusively recommend the protocol universally.',
    passageEn: 'While intermittent fasting has demonstrated metabolic advantages in rodent models, clinical nutritionists emphasize that longitudinal human studies remain insufficient to conclusively recommend the protocol universally.',
    question: 'Khẳng định: "Các chuyên gia dinh dưỡng khuyến nghị tất cả mọi người nên áp dụng nhịn ăn gián đoạn ngay lập tức."',
    questionEn: 'Statement: "Clinical nutritionists recommend that everyone should adopt intermittent fasting immediately."',
    options: [
      { key: 'TRUE', text: 'TRUE (Đúng với bài)', textEn: 'TRUE (Agrees with the passage)' },
      { key: 'FALSE', text: 'FALSE (Sai với bài do bẫy từ tuyệt đối hóa "tất cả mọi người")', textEn: 'FALSE (Contradicts the passage due to the absolute quantifier "everyone")', isCorrect: true },
      { key: 'NOT GIVEN', text: 'NOT GIVEN (Không được đề cập)', textEn: 'NOT GIVEN (Neither confirmed nor contradicted)' }
    ],
    explanation: 'Bài viết nêu rõ nghiên cứu trên người còn chưa đủ để khuyến nghị đại trà ("insufficient to conclusively recommend the protocol universally").',
    explanationEn: 'The passage explicitly states human longitudinal studies are "insufficient to conclusively recommend the protocol universally".'
  },
  {
    id: 'diag-r3',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 3: Từ Vựng Học Thuật C1 Theo Ngữ Cảnh',
    titleEn: 'Question 3: Academic C1 Vocabulary in Context',
    passage: 'The implementation of rigorous carbon tariffs serves to EXACERBATE the economic strain on developing export nations.',
    passageEn: 'The implementation of rigorous carbon tariffs serves to EXACERBATE the economic strain on developing export nations.',
    question: 'Từ "EXACERBATE" trong ngữ cảnh học thuật này đồng nghĩa với từ nào?',
    questionEn: 'Which word is closest in meaning to "EXACERBATE" in this academic context?',
    options: [
      { key: 'A', text: 'Alleviate (Làm giảm nhẹ)', textEn: 'Alleviate (To relieve or reduce)' },
      { key: 'B', text: 'Aggravate / Worsen (Làm trầm trọng thêm)', textEn: 'Aggravate / Worsen (To intensify or make worse)', isCorrect: true },
      { key: 'C', text: 'Stabilize (Làm ổn định)', textEn: 'Stabilize (To make steady)' },
      { key: 'D', text: 'Stimulate (Khuyến khích)', textEn: 'Stimulate (To encourage or prompt)' }
    ],
    explanation: '"Exacerbate" là từ vựng C1 mang nghĩa làm một vấn đề tiêu cực trở nên trầm trọng hơn (đồng nghĩa với aggravate / worsen).',
    explanationEn: '"Exacerbate" is a C1 academic verb meaning to make a negative situation more severe (synonymous with aggravate / worsen).'
  },
  {
    id: 'diag-r4',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 4: Kỹ Năng Quét Thông Tin Chi Tiết (Scanning)',
    titleEn: 'Question 4: Detailed Information Scanning Skill',
    passage: 'In the 2024 census, renewable energy constituted 28.4% of regional grid capacity, lagging marginally behind hydroelectric facilities at 31.2%, whilst photovoltaic solar accounted for the remainder.',
    passageEn: 'In the 2024 census, renewable energy constituted 28.4% of regional grid capacity, lagging marginally behind hydroelectric facilities at 31.2%, whilst photovoltaic solar accounted for the remainder.',
    question: 'Nguồn năng lượng nào chiếm tỷ trọng cao nhất trong các nguồn được nêu?',
    questionEn: 'Which energy source accounted for the highest share among those mentioned?',
    options: [
      { key: 'A', text: 'Renewable energy tổng hợp', textEn: 'Aggregated renewable energy' },
      { key: 'B', text: 'Hydroelectric facilities (Thủy điện - 31.2%)', textEn: 'Hydroelectric facilities (31.2%)', isCorrect: true },
      { key: 'C', text: 'Photovoltaic solar', textEn: 'Photovoltaic solar' },
      { key: 'D', text: 'Nhiệt điện than', textEn: 'Coal-fired power' }
    ],
    explanation: 'Hydroelectric (31.2%) cao hơn Renewable tổng hợp được so sánh (28.4%).',
    explanationEn: 'Hydroelectric capacity (31.2%) exceeded the compared aggregate renewable benchmark (28.4%).'
  },

  // --- LISTENING MODULE (Questions 5 - 8) ---
  {
    id: 'diag-l1',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 5: Nhận Diện Bẫy Tự Sửa Sai (Self-Correction Trap)',
    titleEn: 'Question 5: Self-Correction Distractor Trap',
    passage: 'Transcript: "Receptionist: The seminar will begin promptly at 9:15 AM in Room B... oh, wait, apologies, that was yesterday\'s schedule! Today\'s session has been moved to 10:30 AM in the Grand Auditorium."',
    passageEn: 'Transcript: "Receptionist: The seminar will begin promptly at 9:15 AM in Room B... oh, wait, apologies, that was yesterday\'s schedule! Today\'s session has been moved to 10:30 AM in the Grand Auditorium."',
    question: 'Hội thảo hôm nay thực tế bắt đầu lúc mấy giờ?',
    questionEn: 'What time does today\'s seminar actually begin?',
    options: [
      { key: 'A', text: '9:15 AM', textEn: '9:15 AM' },
      { key: 'B', text: '10:30 AM', textEn: '10:30 AM', isCorrect: true },
      { key: 'C', text: '9:00 AM', textEn: '9:00 AM' },
      { key: 'D', text: 'Không xác định', textEn: 'Undetermined' }
    ],
    explanation: 'Người nói đưa ra mốc 9:15 AM rồi lập tức tự sửa sai ("apologies, that was yesterday\'s schedule... today is 10:30 AM"). Đây là bẫy kinh điển trong IELTS Listening Section 1.',
    explanationEn: 'The speaker initially states 9:15 AM but immediately self-corrects ("apologies, that was yesterday\'s schedule... today is 10:30 AM"). This is a classic IELTS Listening Part 1 distractor.'
  },
  {
    id: 'diag-l2',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 6: Bẫy Âm Đuôi Số Nhiều (-s/-es)',
    titleEn: 'Question 6: Plural Endings Distractor Trap (-s/-es)',
    passage: 'Transcript: "Lecturer: The principal limitation of this methodology relates to the insufficient sample sizes across diverse demographic cohorts."',
    passageEn: 'Transcript: "Lecturer: The principal limitation of this methodology relates to the insufficient sample sizes across diverse demographic cohorts."',
    question: 'Từ cần điền vào bản ghi chú: "The main weakness is the lack of adequate ________."',
    questionEn: 'Note-completion: "The main weakness is the lack of adequate ________."',
    options: [
      { key: 'A', text: 'sample size (danh từ số ít)', textEn: 'sample size (singular noun)' },
      { key: 'B', text: 'sample sizes (danh từ số nhiều)', textEn: 'sample sizes (plural noun)', isCorrect: true },
      { key: 'C', text: 'samples size', textEn: 'samples size' },
      { key: 'D', text: 'sampling size', textEn: 'sampling size' }
    ],
    explanation: 'Trong Listening, thiếu âm đuôi số nhiều -s ("sample sizes") là một trong những lỗi mất điểm phổ biến nhất dù nhận diện đúng từ gốc.',
    explanationEn: 'In IELTS Listening, omitting the plural suffix -s ("sample sizes") is a common penalty trap even when the root word is correctly identified.'
  },
  {
    id: 'diag-l3',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 7: Từ Nối Báo Hiệu Hướng Lập Luận (Signposting)',
    titleEn: 'Question 7: Discourse Signposting Markers',
    passage: 'Transcript: "Initial projections indicated positive profit margins; NEVERTHELESS, unforeseen maritime tariffs severely contracted the operational revenue."',
    passageEn: 'Transcript: "Initial projections indicated positive profit margins; NEVERTHELESS, unforeseen maritime tariffs severely contracted the operational revenue."',
    question: 'Từ "NEVERTHELESS" báo hiệu thông tin tiếp theo sẽ có tính chất gì?',
    questionEn: 'What type of information does the signpost "NEVERTHELESS" signal in the following clause?',
    options: [
      { key: 'A', text: 'Bổ sung thêm một dẫn chứng tích cực', textEn: 'Additional supporting evidence for positive profit' },
      { key: 'B', text: 'Chuyển hướng sang thông tin tương phản / tiêu cực ngoài dự kiến', textEn: 'A shift towards contrasting / unforeseen adverse information', isCorrect: true },
      { key: 'C', text: 'Giải thích nguyên nhân tại sao có lãi', textEn: 'Causal explanation for profitability' },
      { key: 'D', text: 'Tóm tắt kết luận toàn bài', textEn: 'Concluding summary of the entire talk' }
    ],
    explanation: '"Nevertheless" (tương tự however, nonetheless) là từ chỉ báo hướng tương phản (contrast marker).',
    explanationEn: '"Nevertheless" (like however, nonetheless) is a formal contrast marker signaling an unexpected reversal or concession.'
  },
  {
    id: 'diag-l4',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 8: Bẫy Từ Đồng Nghĩa (Paraphrasing Trap)',
    titleEn: 'Question 8: Paraphrase Matching Trap',
    passage: 'Transcript: "The local council decided to demolish the dilapidated warehouse and construct a recreational complex."',
    passageEn: 'Transcript: "The local council decided to demolish the dilapidated warehouse and construct a recreational complex."',
    question: 'Bản ghi tóm tắt: "The old storage building will be ________."',
    questionEn: 'Summary note: "The old storage building will be ________."',
    options: [
      { key: 'A', text: 'renovated', textEn: 'renovated' },
      { key: 'B', text: 'knocked down (đồng nghĩa với demolished)', textEn: 'knocked down (paraphrase of demolished)', isCorrect: true },
      { key: 'C', text: 'dilapidated', textEn: 'dilapidated' },
      { key: 'D', text: 'abandoned', textEn: 'abandoned' }
    ],
    explanation: '"Demolish" được paraphrase thành cụm "knock down".',
    explanationEn: '"Demolish" is accurately paraphrased by the phrasal verb "knock down".'
  },

  // --- WRITING MODULE (Questions 9 - 12) ---
  {
    id: 'diag-w1',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 9: Barem Cambridge Task 1 Overview Chuẩn Band 7+',
    titleEn: 'Question 9: Cambridge Task 1 Overview Rubric (Band 7.0+)',
    passage: 'Đề bài Task 1 yêu cầu mô tả biểu đồ đường lượng khách du lịch đến 3 quốc gia từ 2000 đến 2020.',
    passageEn: 'Task 1 prompt: Describe a line graph showing tourist arrivals to 3 countries between 2000 and 2020.',
    question: 'Đoạn Overview nào sau đây đạt tiêu chuẩn Band 7.0+ theo barem giám khảo?',
    questionEn: 'Which overview paragraph meets Cambridge Band 7.0+ examiner criteria?',
    options: [
      { key: 'A', text: 'Overall, Country A started at 20 million tourists in 2000 and rose to 50 million in 2020, while Country B dropped to 10 million.', textEn: 'Overall, Country A started at 20 million tourists in 2000 and rose to 50 million in 2020, while Country B dropped to 10 million.' },
      { key: 'B', text: 'Overall, it is evident that tourist arrivals to Country A experienced a marked upward trajectory, whereas Country B saw a steady contraction over the surveyed timeframe.', textEn: 'Overall, it is evident that tourist arrivals to Country A experienced a marked upward trajectory, whereas Country B saw a steady contraction over the surveyed timeframe.', isCorrect: true },
      { key: 'C', text: 'In conclusion, this graph shows the tourists of countries.', textEn: 'In conclusion, this graph shows the tourists of countries.' },
      { key: 'D', text: 'Overall, there were many tourists travelling around the world.', textEn: 'Overall, there were many tourists travelling around the world.' }
    ],
    explanation: 'Theo Barem Cambridge: Overview Band 7.0+ phải nêu xu hướng chủ đạo và đặc điểm nổi bật MÀ KHÔNG ĐƯA SỐ LIỆU CHI TIẾT VỤN VẶT (câu A chứa số liệu bị chặn trần ở Band 6.0).',
    explanationEn: 'According to the official Cambridge rubric, a Band 7.0+ overview must highlight overall trends without cataloging specific data points (Option A lists raw figures, capping Task Achievement at Band 6.0).'
  },
  {
    id: 'diag-w2',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 10: Văn Phong Cẩn Trọng Học Thuật (Academic Hedging)',
    titleEn: 'Question 10: Academic Hedging & Nuance',
    passage: 'Chủ đề: Tác động của mạng xã hội đến tâm lý giới trẻ.',
    passageEn: 'Topic: The psychological impact of social media on adolescents.',
    question: 'Câu văn nào thể hiện văn phong học thuật chuẩn mực, tránh lỗi quy chụp tuyệt đối (overgeneralisation)?',
    questionEn: 'Which sentence exemplifies academic hedging, avoiding overgeneralisation?',
    options: [
      { key: 'A', text: 'Social media always ruins everyone\'s mental health without exception.', textEn: 'Social media always ruins everyone\'s mental health without exception.' },
      { key: 'B', text: 'Substantial empirical evidence suggests that excessive screen exposure tends to correlate with elevated anxiety levels among adolescents.', textEn: 'Substantial empirical evidence suggests that excessive screen exposure tends to correlate with elevated anxiety levels among adolescents.', isCorrect: true },
      { key: 'C', text: 'Nobody can deny that social platforms are completely evil.', textEn: 'Nobody can deny that social platforms are completely evil.' },
      { key: 'D', text: 'Young people will definitely become depressed if they use smartphones.', textEn: 'Young people will definitely become depressed if they use smartphones.' }
    ],
    explanation: 'Câu B sử dụng các kỹ thuật Hedging học thuật tinh tế: "substantial evidence suggests that", "tends to correlate with", thể hiện tư duy khoa học khách quan.',
    explanationEn: 'Option B utilizes nuanced hedging devices ("substantial evidence suggests that", "tends to correlate with"), demonstrating objective scholarly rigor.'
  },
  {
    id: 'diag-w3',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 11: Lỗi Cú Pháp Ngữ Pháp (Comma Splice & Complex Structures)',
    titleEn: 'Question 11: Grammatical Range & Comma Splice Avoidance',
    passage: 'Yêu cầu kết nối hai mệnh đề độc lập thể hiện quan hệ nhân quả.',
    passageEn: 'Requirement: Link two independent clauses expressing cause and effect.',
    question: 'Câu nào sau đây CHÍNH XÁC về mặt ngữ pháp học thuật, KHÔNG bị lỗi Comma Splice?',
    questionEn: 'Which sentence is grammatically sound in academic English, completely avoiding a comma splice?',
    options: [
      { key: 'A', text: 'The municipal transit fee increased, many commuters decided to cycle to work.', textEn: 'The municipal transit fee increased, many commuters decided to cycle to work.' },
      { key: 'B', text: 'Because the municipal transit fee increased, many commuters opted to cycle to work.', textEn: 'Because the municipal transit fee increased, many commuters opted to cycle to work.', isCorrect: true },
      { key: 'C', text: 'The municipal transit fee increased therefore many commuters decided to cycle.', textEn: 'The municipal transit fee increased therefore many commuters decided to cycle.' },
      { key: 'D', text: 'The fee increased, so that many commuters cycle.', textEn: 'The fee increased, so that many commuters cycle.' }
    ],
    explanation: 'Câu A mắc lỗi ngắt câu bằng dấu phẩy giữa hai mệnh đề độc lập (Comma Splice). Câu B dùng liên từ phụ thuộc "Because" tạo câu phức hoàn chỉnh.',
    explanationEn: 'Option A commits a comma splice between two independent clauses. Option B correctly uses the subordinating conjunction "Because" to form a complete complex sentence.'
  },
  {
    id: 'diag-w4',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 12: Mạch Lạc & Liên Kết Luận Điểm (Coherence & Cohesion)',
    titleEn: 'Question 12: Coherence & Cohesive Devices',
    passage: 'Luận điểm: Các thành phố đông đúc cần mở rộng không gian xanh để thanh lọc không khí.',
    passageEn: 'Argument: Densely populated cities need to expand urban green spaces to purify air.',
    question: 'Từ nối nào phù hợp nhất để giới thiệu kết quả trực tiếp của việc trồng thêm cây xanh?',
    questionEn: 'Which cohesive device is most appropriate to introduce the direct consequence of planting more trees?',
    options: [
      { key: 'A', text: 'In contrast', textEn: 'In contrast' },
      { key: 'B', text: 'Consequently / As a consequence', textEn: 'Consequently / As a consequence', isCorrect: true },
      { key: 'C', text: 'Nevertheless', textEn: 'Nevertheless' },
      { key: 'D', text: 'On the other hand', textEn: 'On the other hand' }
    ],
    explanation: '"Consequently" diễn đạt mối quan hệ hệ quả / kết quả trực tiếp.',
    explanationEn: '"Consequently" expresses a direct cause-and-effect relationship.'
  },

  // --- SPEAKING MODULE (Questions 13 - 16) ---
  {
    id: 'diag-s1',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 13: Kết Hợp Từ Tự Nhiên (Collocation C1)',
    titleEn: 'Question 13: Natural Collocation (C1 Lexical Range)',
    passage: 'Mô tả tác động sâu sắc của một người thầy đối với cuộc đời bạn.',
    passageEn: 'Describing the profound impact of a mentor on your life.',
    question: 'Cụm từ Collocation nào tự nhiên và học thuật nhất trong IELTS Speaking Part 2?',
    questionEn: 'Which collocation is most natural and idiomatic in IELTS Speaking Part 2?',
    options: [
      { key: 'A', text: 'He made a heavy impact on my life.', textEn: 'He made a heavy impact on my life.' },
      { key: 'B', text: 'He exerted a profound influence on my academic aspirations.', textEn: 'He exerted a profound influence on my academic aspirations.', isCorrect: true },
      { key: 'C', text: 'He did a big change in my brain.', textEn: 'He did a big change in my brain.' },
      { key: 'D', text: 'He gave me a deep impactation.', textEn: 'He gave me a deep impactation.' }
    ],
    explanation: '"Exert a profound influence on something" là Collocation Band 8.0+ tự nhiên và sang trọng.',
    explanationEn: '"Exert a profound influence on something" is a sophisticated Band 8.0+ collocation.'
  },
  {
    id: 'diag-s2',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 14: Giảm Thiểu Từ Đệm & Tăng Độ Trôi Chảy (Fluency & Coherence)',
    titleEn: 'Question 14: Fluency & Coherence (Managing Hesitation)',
    passage: 'Thí sinh gặp một câu hỏi khó trong Speaking Part 3 và cần 2 giây suy nghĩ.',
    passageEn: 'A candidate encounters a challenging Part 3 question and needs two seconds to formulate thoughts.',
    question: 'Cách xử lý nào giúp duy trì điểm Fluency tốt nhất mà không phạm lỗi "uhm, ah, like, you know"?',
    questionEn: 'Which strategy best preserves Fluency without relying on unnatural filler words ("uhm, like, you know")?',
    options: [
      { key: 'A', text: 'Im lặng hoàn toàn trong 5 giây và nhìn lên trần nhà.', textEn: 'Remaining completely silent for 5 seconds while staring at the ceiling.' },
      { key: 'B', text: 'Sử dụng fillers lặp đi lặp lại: "Like, you know, it is like..."', textEn: 'Repeating unnatural fillers: "Like, you know, it is like..."' },
      { key: 'C', text: 'Sử dụng cụm kéo dài thời gian tự nhiên: "That\'s an intriguing question; looking at it from an economic perspective..."', textEn: 'Using natural stalling phrases: "That\'s an intriguing question; looking at it from an economic perspective..."', isCorrect: true },
      { key: 'D', text: 'Nói với giám khảo: "Can you change the question please?"', textEn: 'Asking the examiner: "Can you change the question please?"' }
    ],
    explanation: 'Giám khảo Cambridge đánh giá cao thí sinh biết dùng các mẫu câu "buying time" tự nhiên thay vì phát ra âm thanh ngập ngừng hoặc im lặng kéo dài.',
    explanationEn: 'Examiners reward authentic delaying strategies that maintain discourse flow without awkward silence or repetitive verbal tics.'
  },
  {
    id: 'diag-s3',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 15: Nhất Quán Thì Quá Khứ Trong Kể Chuyện Part 2',
    titleEn: 'Question 15: Tense Consistency in Part 2 Narrative',
    passage: 'Đề bài Part 2: "Describe a memorable journey you took in your childhood."',
    passageEn: 'Part 2 prompt: "Describe a memorable journey you took in your childhood."',
    question: 'Đoạn nói nào duy trì sự nhất quán về thì (Past Simple / Continuous) chuẩn mực?',
    questionEn: 'Which response demonstrates consistent past narrative tenses (Past Simple / Continuous)?',
    options: [
      { key: 'A', text: 'When I was seven, my family went to Da Nang. We stay in a hotel and we swim every day.', textEn: 'When I was seven, my family went to Da Nang. We stay in a hotel and we swim every day.' },
      { key: 'B', text: 'When I was seven, my family traveled to Da Nang. While my parents were checking in, I was marveling at the ocean view from the terrace.', textEn: 'When I was seven, my family traveled to Da Nang. While my parents were checking in, I was marveling at the ocean view from the terrace.', isCorrect: true },
      { key: 'C', text: 'I go there 10 years ago and it is very beautiful.', textEn: 'I go there 10 years ago and it is very beautiful.' },
      { key: 'D', text: 'My family has gone there when I was young and we enjoy it.', textEn: 'My family has gone there when I was young and we enjoy it.' }
    ],
    explanation: 'Câu B thể hiện khả năng phối hợp nhuần nhuyễn giữa Past Simple và Past Continuous mà không bị "rớt thì" về hiện tại đơn.',
    explanationEn: 'Option B demonstrates seamless coordination between Past Simple and Past Continuous without accidentally slipping into present tense.'
  },
  {
    id: 'diag-s4',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 16: Diễn Đạt Ý Kiến Cá Nhân Đa Chiều (Lexical Range)',
    titleEn: 'Question 16: Nuanced Argumentation & Lexical Range',
    passage: 'Part 3: "Do you think artificial intelligence will make artists obsolete?"',
    passageEn: 'Part 3 prompt: "Do you think artificial intelligence will make artists obsolete?"',
    question: 'Cách trả lời nào đạt tiêu chuẩn Lexical Resource & Grammatical Range Band 7.5+?',
    questionEn: 'Which response satisfies Band 7.5+ Lexical Resource and Grammatical Range criteria?',
    options: [
      { key: 'A', text: 'No, because AI cannot make real art.', textEn: 'No, because AI cannot make real art.' },
      { key: 'B', text: 'I am somewhat skeptical of that premise; while AI excels at pattern replication, it inherently lacks genuine emotional resonance and lived experience.', textEn: 'I am somewhat skeptical of that premise; while AI excels at pattern replication, it inherently lacks genuine emotional resonance and lived experience.', isCorrect: true },
      { key: 'C', text: 'AI is very smart, but people are smarter so artists will never die.', textEn: 'AI is very smart, but people are smarter so artists will never die.' },
      { key: 'D', text: 'I agree 100 percent, AI is too good now.', textEn: 'I agree 100 percent, AI is too good now.' }
    ],
    explanation: 'Câu B sử dụng cấu trúc nhượng bộ ("while AI excels at... it inherently lacks..."), kèm vốn từ vựng phong phú ("skeptical of that premise", "pattern replication", "emotional resonance").',
    explanationEn: 'Option B employs concessive clauses ("while AI excels at... it inherently lacks...") accompanied by sophisticated lexis ("skeptical of that premise", "pattern replication", "emotional resonance").'
  }
];

/**
 * Evaluates candidate responses to the diagnostic test.
 * @param {Object} userAnswers - { [questionId]: selectedOptionKey }
 * @returns {Object} Diagnostic evaluation report
 */
export function evaluateDiagnosticTest(userAnswers = {}) {
  let totalCorrect = 0;
  const skillStats = {
    reading: { label: 'Reading', labelEn: 'Reading', total: 4, correct: 0, percentage: 0, band: 4.0 },
    listening: { label: 'Listening', labelEn: 'Listening', total: 4, correct: 0, percentage: 0, band: 4.0 },
    writing: { label: 'Writing', labelEn: 'Writing', total: 4, correct: 0, percentage: 0, band: 4.0 },
    speaking: { label: 'Speaking', labelEn: 'Speaking', total: 4, correct: 0, percentage: 0, band: 4.0 }
  };

  const detailedQuestions = DIAGNOSTIC_QUESTIONS.map(q => {
    const userAnswer = userAnswers[q.id] || null;
    const correctOption = q.options.find(o => o.isCorrect);
    const isCorrect = userAnswer === correctOption?.key;

    if (isCorrect) {
      totalCorrect++;
      if (skillStats[q.skill]) {
        skillStats[q.skill].correct++;
      }
    }

    return {
      id: q.id,
      skill: q.skill,
      title: q.title,
      titleEn: q.titleEn || q.title,
      userAnswer,
      correctAnswer: correctOption?.key,
      isCorrect,
      explanation: q.explanation,
      explanationEn: q.explanationEn || q.explanation
    };
  });

  // Calculate percentages and estimated sub-bands
  Object.keys(skillStats).forEach(sKey => {
    const s = skillStats[sKey];
    s.percentage = Math.round((s.correct / s.total) * 100);
    if (s.correct === 4) s.band = 8.0;
    else if (s.correct === 3) s.band = 6.5;
    else if (s.correct === 2) s.band = 5.5;
    else if (s.correct === 1) s.band = 4.5;
    else s.band = 3.5;
  });

  // Estimate Overall Band
  let estimatedOverallBand = 4.0;
  if (totalCorrect >= 15) estimatedOverallBand = 8.0;
  else if (totalCorrect >= 13) estimatedOverallBand = 7.5;
  else if (totalCorrect >= 11) estimatedOverallBand = 6.5;
  else if (totalCorrect >= 9) estimatedOverallBand = 6.0;
  else if (totalCorrect >= 7) estimatedOverallBand = 5.5;
  else if (totalCorrect >= 5) estimatedOverallBand = 5.0;
  else if (totalCorrect >= 3) estimatedOverallBand = 4.5;
  else estimatedOverallBand = 3.5;

  // Identify Weaknesses with bilingual titles and recommendations
  const weaknesses = [];
  if (skillStats.reading.correct <= 2) {
    weaknesses.push({
      skill: 'reading',
      title: 'Tốc độ Quét Thông Tin & Bẫy Tuyệt Đối Hóa (Reading)',
      titleEn: 'Scanning Speed & Absolute Quantifier Traps (Reading)',
      advice: 'Cần rèn luyện nhận diện bẫy từ cực đoan (always, all, completely) trong True/False/Not Given và tăng vốn từ C1 học thuật.',
      adviceEn: 'Practice identifying extreme qualifier traps (always, all, completely) in True/False/Not Given tasks and expand academic C1 lexis.'
    });
  }
  if (skillStats.listening.correct <= 2) {
    weaknesses.push({
      skill: 'listening',
      title: 'Bẫy Tự Sửa Sai & Âm Đuôi Số Nhiều (Listening)',
      titleEn: 'Self-Correction & Plural Endings Traps (Listening)',
      advice: 'Cần chú ý các từ chỉ báo sửa sai (oh wait, apologies) và rèn thói quen kiểm tra âm đuôi -s/-es khi ghi chú nhanh.',
      adviceEn: 'Focus on self-correction cues (oh wait, apologies) and develop the habit of verifying plural -s/-es suffixes in note-completion.'
    });
  }
  if (skillStats.writing.correct <= 2) {
    weaknesses.push({
      skill: 'writing',
      title: 'Văn Phong Học Thuật & Kỹ Thuật Viết Overview (Writing)',
      titleEn: 'Academic Register & Task 1 Overview Technique (Writing)',
      advice: 'Tránh đưa số liệu chi tiết vào Overview Task 1 và áp dụng Hedging (tend to, suggest that) để tránh lỗi quy chụp tuyệt đối trong Task 2.',
      adviceEn: 'Avoid raw figures in Task 1 overviews and incorporate hedging devices (tend to, suggest that) to prevent overgeneralisation in Task 2.'
    });
  }
  if (skillStats.speaking.correct <= 2) {
    weaknesses.push({
      skill: 'speaking',
      title: 'Vốn Collocation Tự Nhiên & Kiểm Soát Thì (Speaking)',
      titleEn: 'Idiomatic Collocation & Narrative Tense Control (Speaking)',
      advice: 'Tăng cường nạp cụm Collocation Band 7.5+ và thực hành duy trì thì Quá khứ đơn/tiếp diễn mượt mà trong Part 2.',
      adviceEn: 'Build Band 7.5+ collocations and practice smooth past narrative tense control in Speaking Part 2.'
    });
  }

  return {
    totalQuestions: DIAGNOSTIC_QUESTIONS.length,
    totalCorrect,
    overallPercentage: Math.round((totalCorrect / DIAGNOSTIC_QUESTIONS.length) * 100),
    estimatedOverallBand,
    skillStats,
    weaknesses,
    detailedQuestions,
    testedAt: new Date().toISOString()
  };
}

/**
 * Generates an adaptive 30-Day study roadmap tailored to current band, target band, and skill weaknesses.
 * @param {number} currentBand
 * @param {number|string} targetBand
 * @param {Array} weaknesses
 * @returns {Array} 30-Day task schedule
 */
export function generate30DayStudyPlan(currentBand = 5.5, targetBand = 6.5, weaknesses = []) {
  const plan = [];

  // WEEK 1: Foundation, Priority Traps & Core Mechanics
  plan.push(
    {
      day: 1,
      week: 1,
      title: 'Rà soát 14 Dạng Bài Reading & Bẫy T/F/NG',
      titleEn: 'Audit 14 Reading Question Types & T/F/NG Traps',
      skill: 'reading',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'theory',
      taskDescription: 'Mở Cẩm Nang Lý Thuyết Reading, đọc kỹ chiến thuật làm dạng True/False/Not Given và Yes/No/Not Given, ghi chú 5 bẫy từ cực đoan.',
      taskDescriptionEn: 'Open Reading Theory Handbook, review True/False/Not Given and Yes/No/Not Given strategies, and note 5 absolute qualifier traps.'
    },
    {
      day: 2,
      week: 1,
      title: 'Ngữ Pháp Học Thuật: Xử Lý Comma Splice & Mệnh Đề Quan Hệ',
      titleEn: 'Academic Grammar: Comma Splice Elimination & Relative Clauses',
      skill: 'writing',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'drills',
      taskDescription: 'Luyện tập biến đổi 5 câu đơn thành câu phức dùng liên từ phụ thuộc (Although, Whereas, Because) để chống lỗi Comma Splice.',
      taskDescriptionEn: 'Practice converting 5 simple sentences into complex structures using subordinating conjunctions (Although, Whereas, Because).'
    },
    {
      day: 3,
      week: 1,
      title: 'Listening Section 1: Phản Xạ Bắt Số Điện Thoại & Âm Đuôi -s/-es',
      titleEn: 'Listening Section 1: Form-Completion & Plural -s/-es Accuracy',
      skill: 'listening',
      duration: '40 phút',
      durationEn: '40 mins',
      toolShortcut: 'listening',
      taskDescription: 'Làm 1 bài Listening Section 1, tập trung nghe và phân biệt chính xác danh từ số ít / số nhiều và tên riêng đánh vần.',
      taskDescriptionEn: 'Complete 1 Listening Section 1 test, focusing on singular vs. plural nouns and names/alphanumeric spelling.'
    },
    {
      day: 4,
      week: 1,
      title: 'Speaking Part 1: Xây Dựng 10 Cụm Collocation Chủ Đề Học Tập / Công Việc',
      titleEn: 'Speaking Part 1: 10 C1 Collocations on Education & Work',
      skill: 'speaking',
      duration: '40 phút',
      durationEn: '40 mins',
      toolShortcut: 'notebook',
      taskDescription: 'Nạp 10 cụm từ Collocation Band 7+ vào Sổ Tay Từ Vựng (ví dụ: pursue higher education, academic workload, career prospects).',
      taskDescriptionEn: 'Save 10 Band 7+ collocations to your Vocab Notebook (e.g. pursue higher education, academic workload, career prospects).'
    },
    {
      day: 5,
      week: 1,
      title: 'Writing Task 1: Bộ Khung Overview Chuẩn Cambridge (Nói Không Với Số Liệu)',
      titleEn: 'Writing Task 1: Cambridge Overview Framework (Zero Data Clutter)',
      skill: 'writing',
      duration: '50 phút',
      durationEn: '50 mins',
      toolShortcut: 'writing',
      taskDescription: 'Thực hành viết 3 đoạn Overview cho 3 đề Task 1 khác nhau. Tuyệt đối không đưa số liệu cụ thể vào đoạn tổng quan.',
      taskDescriptionEn: 'Write 3 Overview paragraphs for different Task 1 prompts. Strictly avoid listing raw data points in the overview.'
    },
    {
      day: 6,
      week: 1,
      title: 'Reading Passage 1: Luyện Kỹ Thuật Đọc Chunking Bấm Giờ (≤ 15 phút)',
      titleEn: 'Reading Passage 1: Timed Chunking Technique (≤ 15 mins)',
      skill: 'reading',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'reading',
      taskDescription: 'Làm 1 bài Reading Passage 1 với mục tiêu kiểm soát thời gian dưới 15 phút, tỷ lệ đúng trên 11/13 câu.',
      taskDescriptionEn: 'Complete 1 Reading Passage 1 under 15 minutes, targeting at least 11/13 correct answers.'
    },
    {
      day: 7,
      week: 1,
      title: 'Ôn Tập Tuần 1: Flashcards SRS & Kiểm Tra Lỗi Sai',
      titleEn: 'Week 1 Review: SRS Flashcards & Mistakes Sweep',
      skill: 'review',
      duration: '35 phút',
      durationEn: '35 mins',
      toolShortcut: 'srs',
      taskDescription: 'Mở Sổ tay từ vựng Spaced Repetition, ôn tập toàn bộ các thẻ từ vựng đến hạn và xem lại Nhật Ký Lỗi Sai (Mistakes Log).',
      taskDescriptionEn: 'Open Spaced Repetition cards, review all due vocabulary flashcards, and inspect your Mistakes Log.'
    }
  );

  // WEEK 2: Target Skill Acceleration & C1 Critical Thinking
  plan.push(
    {
      day: 8,
      week: 2,
      title: 'Writing Task 2: Kỹ Thuật Academic Hedging (Văn Phong Cẩn Trọng)',
      titleEn: 'Writing Task 2: Academic Hedging & Stance Nuance',
      skill: 'writing',
      duration: '50 phút',
      durationEn: '50 mins',
      toolShortcut: 'writing',
      taskDescription: 'Viết thân bài Task 2 về chủ đề Công Nghệ/Giáo Dục, ứng dụng ít nhất 4 cấu trúc Hedging (tend to, suggest that, arguably).',
      taskDescriptionEn: 'Draft Task 2 body paragraphs on Tech/Education, embedding at least 4 hedging devices (tend to, suggest that, arguably).'
    },
    {
      day: 9,
      week: 2,
      title: 'Listening Section 2 & 3: Bẫy Thông Tin Chuyển Hướng (Self-Correction & Signposts)',
      titleEn: 'Listening Sections 2 & 3: Direction Reversal Traps & Signposts',
      skill: 'listening',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'listening',
      taskDescription: 'Luyện 1 bài Section 3 có 2 người thảo luận, bắt các từ chuyển hướng (However, On second thoughts, Rather).',
      taskDescriptionEn: 'Practice 1 Section 3 dialogue test, tracking discourse markers (However, On second thoughts, Rather).'
    },
    {
      day: 10,
      week: 2,
      title: 'Reading Passage 2: Chiến Thuật Matching Headings & Information',
      titleEn: 'Reading Passage 2: Matching Headings & Information Strategy',
      skill: 'reading',
      duration: '50 phút',
      durationEn: '50 mins',
      toolShortcut: 'reading',
      taskDescription: 'Thực hành dạng bài nối tiêu đề đoạn văn, xác định câu chủ đề (Topic sentence) và ý bao quát thay vì chỉ bắt từ khóa bề mặt.',
      taskDescriptionEn: 'Practice Matching Headings by identifying paragraph topic sentences and core arguments rather than keyword matching.'
    },
    {
      day: 11,
      week: 2,
      title: 'Speaking Part 2: Làm Chủ Khung Kể Chuyện Thì Quá Khứ (Past Narration)',
      titleEn: 'Speaking Part 2: Mastering Past Narrative Frameworks',
      skill: 'speaking',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'speaking',
      taskDescription: 'Thu âm 1 bài Speaking Part 2 với chủ đề trải nghiệm quá khứ, kiểm tra chỉ số nhất quán thì qua hệ thống AI Examiner.',
      taskDescriptionEn: 'Record 1 Speaking Part 2 response on a past memory, verifying tense consistency via AI Examiner feedback.'
    },
    {
      day: 12,
      week: 2,
      title: 'Writing Task 1: Dạng Bài Quy Trình (Process) & Bản Đồ (Map)',
      titleEn: 'Writing Task 1: Process Diagrams & Spatial Map Transitions',
      skill: 'writing',
      duration: '50 phút',
      durationEn: '50 mins',
      toolShortcut: 'writing',
      taskDescription: 'Luyện viết 1 bài Task 1 Process dùng thể bị động (is processed, is subsequently transferred) và từ chỉ thứ tự không gian.',
      taskDescriptionEn: 'Write 1 Task 1 Process response using passive voice (is processed, is transferred) and spatial sequence connectors.'
    },
    {
      day: 13,
      week: 2,
      title: 'Reading Passage 3: Chinh Phục Văn Bản Trừu Tượng Khoa Học Xã Hội',
      titleEn: 'Reading Passage 3: Conquering Abstract Social Science Articles',
      skill: 'reading',
      duration: '55 phút',
      durationEn: '55 mins',
      toolShortcut: 'reading',
      taskDescription: 'Luyện 1 bài Passage 3 khó, áp dụng chiến thuật đọc lướt nắm mạch lập luận của tác giả, phân bổ tối đa 23 phút.',
      taskDescriptionEn: 'Complete 1 difficult Passage 3 within 23 minutes, focusing on tracing authorial stance and subtle argumentative shifts.'
    },
    {
      day: 14,
      week: 2,
      title: 'Ôn Tập Tuần 2: Viết Lại Câu Sai (Interactive Rewriting Box)',
      titleEn: 'Week 2 Review: Sentence Rewriting & Lexical Upgrade',
      skill: 'review',
      duration: '40 phút',
      durationEn: '40 mins',
      toolShortcut: 'drills',
      taskDescription: 'Thực hành viết lại 5 câu từng bị trừ điểm trong bài viết trước qua Hộp Thử Viết Lại để nâng cấp tiêu chí Lexical Resource.',
      taskDescriptionEn: 'Rewrite 5 previously flagged sentences in the Interactive Rewriting Box to upgrade Lexical Resource.'
    }
  );

  // WEEK 3: High-Intensity Mock Exam Simulation & Pacing
  plan.push(
    {
      day: 15,
      week: 3,
      title: 'Mock Writing Task 1 Bấm Giờ Đúng 20 Phút',
      titleEn: 'Timed Mock Writing Task 1 (Strict 20-Min Pacing)',
      skill: 'writing',
      duration: '40 phút',
      durationEn: '40 mins',
      toolShortcut: 'writing',
      taskDescription: 'Bấm giờ nghiêm ngặt 20 phút hoàn thành trọn vẹn 1 bài Task 1 (tối thiểu 150 từ), kiểm tra lỗi chính tả trong 2 phút cuối.',
      taskDescriptionEn: 'Strictly time yourself for 20 minutes on Task 1 (≥ 150 words), reserving 2 minutes for error checking.'
    },
    {
      day: 16,
      week: 3,
      title: 'Listening Section 4: Chuyên Đề Bài Giảng Học Thuật Tốc Độ Nhanh',
      titleEn: 'Listening Section 4: High-Speed Academic Monologue Drills',
      skill: 'listening',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'listening',
      taskDescription: 'Làm Section 4 chủ đề Khoa học / Sinh học, tập trung giữ nhịp nghe xuyên suốt không bị mất dấu từ khóa.',
      taskDescriptionEn: 'Complete 1 Section 4 academic lecture on science/biology, sustaining continuous focus and keyword tracking.'
    },
    {
      day: 17,
      week: 3,
      title: 'Mock Writing Task 2 Bấm Giờ Đúng 40 Phút',
      titleEn: 'Timed Mock Writing Task 2 (Strict 40-Min Pacing)',
      skill: 'writing',
      duration: '55 phút',
      durationEn: '55 mins',
      toolShortcut: 'writing',
      taskDescription: 'Dành 3 phút lập dàn ý qua Interactive Outliner, 32 phút viết bài (≥ 250 từ) và 5 phút rà soát lỗi ngữ pháp.',
      taskDescriptionEn: 'Spend 3 mins outlining in Interactive Outliner, 32 mins writing (≥ 250 words), and 5 mins proofreading grammar.'
    },
    {
      day: 18,
      week: 3,
      title: 'Reading Full Test 3 Passages (60 Phút Bấm Giờ)',
      titleEn: 'Reading Full Test: 3 Passages (Strict 60 Mins)',
      skill: 'reading',
      duration: '70 phút',
      durationEn: '70 mins',
      toolShortcut: 'reading',
      taskDescription: 'Bật chế độ Thi Thử (Exam Mode), phân bổ: P1 (17p), P2 (20p), P3 (23p). Phân tích bảng báo cáo Band điểm sau khi nộp.',
      taskDescriptionEn: 'Enable Exam Mode and allocate: P1 (17m), P2 (20m), P3 (23m). Analyze your diagnostic error report upon submission.'
    },
    {
      day: 19,
      week: 3,
      title: 'Speaking Part 3: Tư Duy Phản Biện & Mẫu Câu Mở Rộng Đa Chiều',
      titleEn: 'Speaking Part 3: Multi-Perspective Critical Argumentation',
      skill: 'speaking',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'speaking',
      taskDescription: 'Luyện 4 câu hỏi Part 3 hóc búa, sử dụng cấu trúc: Direct Answer -> Reason -> Specific Example -> Broader Implication.',
      taskDescriptionEn: 'Tackle 4 challenging Part 3 prompts using: Direct Answer -> Reason -> Specific Example -> Broader Implication.'
    },
    {
      day: 20,
      week: 3,
      title: 'Luyện Đề Listening Full 40 Câu Chuẩn Khảo Thí',
      titleEn: 'Full 40-Question Cambridge Listening Exam Simulation',
      skill: 'listening',
      duration: '50 phút',
      durationEn: '50 mins',
      toolShortcut: 'listening',
      taskDescription: 'Làm trọn vẹn 40 câu Listening, kiểm tra hệ thống bóc tách lỗi đa tầng (Lỗi quá từ, Lỗi số nhiều, Lỗi chính tả).',
      taskDescriptionEn: 'Complete all 40 Listening questions, checking multi-layered diagnostics (word count, plural endings, spelling).'
    },
    {
      day: 21,
      week: 3,
      title: 'Ôn Tập Tuần 3: Tổng Hợp Thống Kê & Báo Cáo Tuần (Weekly Report)',
      titleEn: 'Week 3 Review: Weekly Diagnostic Report & Action Plan',
      skill: 'review',
      duration: '35 phút',
      durationEn: '35 mins',
      toolShortcut: 'report',
      taskDescription: 'Mở Báo Cáo Học Tập Tuần (Weekly Report Modal), xem biểu đồ biến thiên Band điểm và Top 3 việc cần hành động ngay.',
      taskDescriptionEn: 'Open Weekly Progress Report, analyze your Band trajectory chart, and execute top 3 prioritized action items.'
    }
  );

  // WEEK 4: Peak Exam Readiness, Refinement & Strategy Lockdown
  plan.push(
    {
      day: 22,
      week: 4,
      title: 'Full Writing Mock Test 60 Phút (Cả Task 1 & Task 2 Liên Tục)',
      titleEn: 'Full 60-Min Writing Mock Test (Task 1 & Task 2 Back-to-Back)',
      skill: 'writing',
      duration: '75 phút',
      durationEn: '75 mins',
      toolShortcut: 'mock',
      taskDescription: 'Vào MockTestModal, làm đề thi Writing 60 phút hoàn chỉnh. Kiểm tra điểm tổng hợp theo công thức Cambridge (T1x1 + T2x2)/3.',
      taskDescriptionEn: 'Open MockTestModal and complete a continuous 60-minute Writing mock test. Calculate your weighted Cambridge score.'
    },
    {
      day: 23,
      week: 4,
      title: 'Phòng Thi CDI Reading: Thử Nghiệm Giao Diện Tương Phản Cao & Split-Pane',
      titleEn: 'CDI Reading Mock Room: High-Contrast & Split-Pane Practice',
      skill: 'reading',
      duration: '65 phút',
      durationEn: '65 mins',
      toolShortcut: 'reading',
      taskDescription: 'Bật chế độ Toàn Màn Hình CDI Zen Mode, thử nghiệm tỷ lệ chia 50/50 và giao diện Đen trên Trắng để làm quen áp lực thi máy.',
      taskDescriptionEn: 'Turn on CDI Fullscreen Zen Mode, testing 50/50 split-pane and high-contrast themes under computer-delivered exam conditions.'
    },
    {
      day: 24,
      week: 4,
      title: 'Full Speaking Mock Test 3 Parts Với AI Examiner',
      titleEn: 'Full 3-Part Speaking Mock Test with AI Examiner',
      skill: 'speaking',
      duration: '40 phút',
      durationEn: '40 mins',
      toolShortcut: 'speaking',
      taskDescription: 'Thực hiện bài kiểm tra Speaking đầy đủ cả 3 phần. Phấn đấu đạt nhịp độ 110-150 WPM và độ tin cậy phát âm trên 80%.',
      taskDescriptionEn: 'Undertake an entire 3-part Speaking mock test with AI Examiner. Target 110-150 WPM and >80% pronunciation confidence.'
    },
    {
      day: 25,
      week: 4,
      title: 'Full Listening Mock Test 40 Câu Tập Trung Cao Độ',
      titleEn: 'High-Concentration 40-Question Listening Mock Test',
      skill: 'listening',
      duration: '50 phút',
      durationEn: '50 mins',
      toolShortcut: 'listening',
      taskDescription: 'Làm 1 đề Listening mới trong không gian yên tĩnh, ghi chú các từ mới nghe được vào Sổ tay từ vựng.',
      taskDescriptionEn: 'Attempt a fresh 40-question Listening test under quiet conditions, noting unfamiliar vocabulary in your notebook.'
    },
    {
      day: 26,
      week: 4,
      title: 'Rà Soát Toàn Bộ Kho Lỗi Sai (Mistakes Log Sweep)',
      titleEn: 'Comprehensive Mistakes Log Audit (Cognitive Bias Sweep)',
      skill: 'review',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'mistakes',
      taskDescription: 'Duyệt lại toàn bộ các câu hỏi từng làm sai trong Reading & Listening. Đảm bảo nắm rõ bản chất bẫy distractor của từng câu.',
      taskDescriptionEn: 'Review all historical mistakes in Reading and Listening to neutralize recurring distractor traps.'
    },
    {
      day: 27,
      week: 4,
      title: 'Writing Drill Tinh Gọn: Hoàn Thiện 2 Đoạn Thân Bài Band 7.5+',
      titleEn: 'Targeted Writing Drill: Craft 2 Band 7.5+ PEEL Body Paragraphs',
      skill: 'writing',
      duration: '45 phút',
      durationEn: '45 mins',
      toolShortcut: 'writing',
      taskDescription: 'Tập trung viết 2 đoạn thân bài Task 2 với cấu trúc PEEL chuẩn mực: Topic Sentence -> Explanation -> Concrete Evidence -> Link back.',
      taskDescriptionEn: 'Write 2 Task 2 body paragraphs using PEEL structure: Topic Sentence -> Explanation -> Concrete Evidence -> Link back.'
    },
    {
      day: 28,
      week: 4,
      title: 'Thực Hành Speaking Part 2 Bấm Giờ 1 Phút Chuẩn Bị & 2 Phút Nói',
      titleEn: 'Speaking Part 2 Timed Pacing: 1-Min Prep & 2-Min Delivery',
      skill: 'speaking',
      duration: '40 phút',
      durationEn: '40 mins',
      toolShortcut: 'speaking',
      taskDescription: 'Tập lập dàn ý nhanh trong đúng 60 giây và nói liên tục không ngừng trong 2 phút mà không bị quá giờ.',
      taskDescriptionEn: 'Practice outline note-taking in 60 seconds, followed by uninterrupted 2-minute speech delivery with the Pacing Bar.'
    },
    {
      day: 29,
      week: 4,
      title: 'Tổng Diễn Tập 4 Kỹ Năng (Mini All-Skill Checkup)',
      titleEn: 'All-Skill Strategy Dress Rehearsal & Exam Protocol Checklist',
      skill: 'mock',
      duration: '90 phút',
      durationEn: '90 mins',
      toolShortcut: 'mock',
      taskDescription: 'Rà soát lại toàn bộ chiến lược quản lý thời gian và các checklist quan trọng nhất trước ngày thi.',
      taskDescriptionEn: 'Review comprehensive timing strategies, exam day protocols, and essential pre-test checklists.'
    },
    {
      day: 30,
      week: 4,
      title: 'Hoàn Thành Lộ Trình: Tự Tin Chinh Phục Target Band!',
      titleEn: 'Roadmap Milestone Complete: Confident Target Band Mastery!',
      skill: 'review',
      duration: '30 phút',
      durationEn: '30 mins',
      toolShortcut: 'profile',
      taskDescription: 'Xuất bản sao lưu dữ liệu toàn diện (JSON Backup) và xem lại hành trình tiến bộ vượt bậc sau 30 ngày kiên trì!',
      taskDescriptionEn: 'Export your comprehensive JSON progress backup and review your 30-day transformative growth trajectory!'
    }
  );

  return plan;
}
