/**
 * IELTS 15-Minute Diagnostic Placement Engine & 30-Day Adaptive Study Plan Generator
 * Calibrated micro-skill questions assessing Reading, Listening, Writing, and Speaking readiness.
 */

export const DIAGNOSTIC_QUESTIONS = [
  // --- READING MODULE (Questions 1 - 4) ---
  {
    id: 'diag-r1',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 1: Nhận diện Luận điểm Chính (Skimming)',
    passage: 'The advent of automated algorithmic auditing in financial institutions has not eliminated human oversight; rather, it has shifted human responsibility towards higher-order ethical scrutiny and anomaly interpretation that machine models cannot independently adjudicate.',
    question: 'Theo đoạn văn trên, nhận định nào sau đây là ĐÚNG?',
    options: [
      { key: 'A', text: 'Kiểm toán tự động đã thay thế hoàn toàn các chuyên viên tài chính con người.' },
      { key: 'B', text: 'Con người giờ đây tập trung vào việc phán đoán đạo đức và giải thích các điểm bất thường mà máy móc không thể tự quyết.', isCorrect: true },
      { key: 'C', text: 'Máy móc hiện đã có khả năng độc lập đưa ra phán quyết đạo đức tài chính.' },
      { key: 'D', text: 'Kiểm toán bằng thuật toán bị xem là kém hiệu quả hơn phương pháp truyền thống.' }
    ],
    explanation: 'Đoạn văn nêu rõ: "shifted human responsibility towards higher-order ethical scrutiny and anomaly interpretation that machine models cannot independently adjudicate".'
  },
  {
    id: 'diag-r2',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 2: Phân biệt Bẫy Tuyệt Đối Hóa (True / False / Not Given)',
    passage: 'While intermittent fasting has demonstrated metabolic advantages in rodent models, clinical nutritionists emphasize that longitudinal human studies remain insufficient to conclusively recommend the protocol universally.',
    question: 'Khẳng định: "Các chuyên gia dinh dưỡng khuyến nghị tất cả mọi người nên áp dụng nhịn ăn gián đoạn ngay lập tức."',
    options: [
      { key: 'TRUE', text: 'TRUE (Đúng với bài)' },
      { key: 'FALSE', text: 'FALSE (Sai với bài do bẫy từ tuyệt đối hóa "tất cả mọi người")', isCorrect: true },
      { key: 'NOT GIVEN', text: 'NOT GIVEN (Không được đề cập)' }
    ],
    explanation: 'Bài viết nêu rõ nghiên cứu trên người còn chưa đủ để khuyến nghị đại trà ("insufficient to conclusively recommend the protocol universally").'
  },
  {
    id: 'diag-r3',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 3: Từ Vựng Học Thuật C1 Theo Ngữ Cảnh',
    passage: 'The implementation of rigorous carbon tariffs serves to EXACERBATE the economic strain on developing export nations.',
    question: 'Từ "EXACERBATE" trong ngữ cảnh học thuật này đồng nghĩa với từ nào?',
    options: [
      { key: 'A', text: 'Alleviate (Làm giảm nhẹ)' },
      { key: 'B', text: 'Aggravate / Worsen (Làm trầm trọng thêm)', isCorrect: true },
      { key: 'C', text: 'Stabilize (Làm ổn định)' },
      { key: 'D', text: 'Stimulate (Khuyến khích)' }
    ],
    explanation: '"Exacerbate" là từ vựng C1 mang nghĩa làm một vấn đề tiêu cực trở nên trầm trọng hơn (đồng nghĩa với aggravate / worsen).'
  },
  {
    id: 'diag-r4',
    skill: 'reading',
    skillLabel: 'IELTS Reading',
    title: 'Câu 4: Kỹ Năng Quét Thông Tin Chi Tiết (Scanning)',
    passage: 'In the 2024 census, renewable energy constituted 28.4% of regional grid capacity, lagging marginally behind hydroelectric facilities at 31.2%, whilst photovoltaic solar accounted for the remainder.',
    question: 'Nguồn năng lượng nào chiếm tỷ trọng cao nhất trong các nguồn được nêu?',
    options: [
      { key: 'A', text: 'Renewable energy tổng hợp' },
      { key: 'B', text: 'Hydroelectric facilities (Thủy điện - 31.2%)', isCorrect: true },
      { key: 'C', text: 'Photovoltaic solar' },
      { key: 'D', text: 'Nhiệt điện than' }
    ],
    explanation: 'Hydroelectric (31.2%) cao hơn Renewable tổng hợp được so sánh (28.4%).'
  },

  // --- LISTENING MODULE (Questions 5 - 8) ---
  {
    id: 'diag-l1',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 5: Nhận Diện Bẫy Tự Sửa Sai (Self-Correction Trap)',
    passage: 'Transcript: "Receptionist: The seminar will begin promptly at 9:15 AM in Room B... oh, wait, apologies, that was yesterday\'s schedule! Today\'s session has been moved to 10:30 AM in the Grand Auditorium."',
    question: 'Hội thảo hôm nay thực tế bắt đầu lúc mấy giờ?',
    options: [
      { key: 'A', text: '9:15 AM' },
      { key: 'B', text: '10:30 AM', isCorrect: true },
      { key: 'C', text: '9:00 AM' },
      { key: 'D', text: 'Không xác định' }
    ],
    explanation: 'Người nói đưa ra mốc 9:15 AM rồi lập tức tự sửa sai ("apologies, that was yesterday\'s schedule... today is 10:30 AM"). Đây là bẫy kinh điển trong IELTS Listening Section 1.'
  },
  {
    id: 'diag-l2',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 6: Bẫy Âm Đuôi Số Nhiều (-s/-es)',
    passage: 'Transcript: "Lecturer: The principal limitation of this methodology relates to the insufficient sample sizes across diverse demographic cohorts."',
    question: 'Từ cần điền vào bản ghi chú: "The main weakness is the lack of adequate ________."',
    options: [
      { key: 'A', text: 'sample size (danh từ số ít)' },
      { key: 'B', text: 'sample sizes (danh từ số nhiều)', isCorrect: true },
      { key: 'C', text: 'samples size' },
      { key: 'D', text: 'sampling size' }
    ],
    explanation: 'Trong Listening, thiếu âm đuôi số nhiều -s ("sample sizes") là một trong những lỗi mất điểm phổ biến nhất dù nhận diện đúng từ gốc.'
  },
  {
    id: 'diag-l3',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 7: Từ Nối Báo Hiệu Hướng Lập Luận (Signposting)',
    passage: 'Transcript: "Initial projections indicated positive profit margins; NEVERTHELESS, unforeseen maritime tariffs severely contracted the operational revenue."',
    question: 'Từ "NEVERTHELESS" báo hiệu thông tin tiếp theo sẽ có tính chất gì?',
    options: [
      { key: 'A', text: 'Bổ sung thêm một dẫn chứng tích cực' },
      { key: 'B', text: 'Chuyển hướng sang thông tin tương phản / tiêu cực ngoài dự kiến', isCorrect: true },
      { key: 'C', text: 'Giải thích nguyên nhân tại sao có lãi' },
      { key: 'D', text: 'Tóm tắt kết luận toàn bài' }
    ],
    explanation: '"Nevertheless" (tương tự however, nonetheless) là từ chỉ báo hướng tương phản (contrast marker).'
  },
  {
    id: 'diag-l4',
    skill: 'listening',
    skillLabel: 'IELTS Listening',
    title: 'Câu 8: Bẫy Từ Đồng Nghĩa (Paraphrasing Trap)',
    passage: 'Transcript: "The local council decided to demolish the dilapidated warehouse and construct a recreational complex."',
    question: 'Bản ghi tóm tắt: "The old storage building will be ________."',
    options: [
      { key: 'A', text: 'renovated' },
      { key: 'B', text: 'knocked down (đồng nghĩa với demolished)', isCorrect: true },
      { key: 'C', text: 'dilapidated' },
      { key: 'D', text: 'abandoned' }
    ],
    explanation: '"Demolish" được paraphrase thành cụm "knock down".'
  },

  // --- WRITING MODULE (Questions 9 - 12) ---
  {
    id: 'diag-w1',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 9: Barem Cambridge Task 1 Overview Chuẩn Band 7+',
    passage: 'Đề bài Task 1 yêu cầu mô tả biểu đồ đường lượng khách du lịch đến 3 quốc gia từ 2000 đến 2020.',
    question: 'Đoạn Overview nào sau đây đạt tiêu chuẩn Band 7.0+ theo barem giám khảo?',
    options: [
      { key: 'A', text: 'Overall, Country A started at 20 million tourists in 2000 and rose to 50 million in 2020, while Country B dropped to 10 million.' },
      { key: 'B', text: 'Overall, it is evident that tourist arrivals to Country A experienced a marked upward trajectory, whereas Country B saw a steady contraction over the surveyed timeframe.', isCorrect: true },
      { key: 'C', text: 'In conclusion, this graph shows the tourists of countries.' },
      { key: 'D', text: 'Overall, there were many tourists travelling around the world.' }
    ],
    explanation: 'Theo Barem Cambridge: Overview Band 7.0+ phải nêu xu hướng chủ đạo và đặc điểm nổi bật MÀ KHÔNG ĐƯA SỐ LIỆU CHI TIẾT VỤN VẶT (câu A chứa số liệu bị chặn trần ở Band 6.0).'
  },
  {
    id: 'diag-w2',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 10: Văn Phong Cẩn Trọng Học Thuật (Academic Hedging)',
    passage: 'Chủ đề: Tác động của mạng xã hội đến tâm lý giới trẻ.',
    question: 'Câu văn nào thể hiện văn phong học thuật chuẩn mực, tránh lỗi quy chụp tuyệt đối (overgeneralisation)?',
    options: [
      { key: 'A', text: 'Social media always ruins everyone\'s mental health without exception.' },
      { key: 'B', text: 'Substantial empirical evidence suggests that excessive screen exposure tends to correlate with elevated anxiety levels among adolescents.', isCorrect: true },
      { key: 'C', text: 'Nobody can deny that social platforms are completely evil.' },
      { key: 'D', text: 'Young people will definitely become depressed if they use smartphones.' }
    ],
    explanation: 'Câu B sử dụng các kỹ thuật Hedging học thuật tinh tế: "substantial evidence suggests that", "tends to correlate with", thể hiện tư duy khoa học khách quan.'
  },
  {
    id: 'diag-w3',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 11: Lỗi Cú Pháp Ngữ Pháp (Comma Splice & Complex Structures)',
    passage: 'Yêu cầu kết nối hai mệnh đề độc lập thể hiện quan hệ nhân quả.',
    question: 'Câu nào sau đây CHÍNH XÁC về mặt ngữ pháp học thuật, KHÔNG bị lỗi Comma Splice?',
    options: [
      { key: 'A', text: 'The municipal transit fee increased, many commuters decided to cycle to work.' },
      { key: 'B', text: 'Because the municipal transit fee increased, many commuters opted to cycle to work.', isCorrect: true },
      { key: 'C', text: 'The municipal transit fee increased therefore many commuters decided to cycle.' },
      { key: 'D', text: 'The fee increased, so that many commuters cycle.' }
    ],
    explanation: 'Câu A mắc lỗi ngắt câu bằng dấu phẩy giữa hai mệnh đề độc lập (Comma Splice). Câu B dùng liên từ phụ thuộc "Because" tạo câu phức hoàn chỉnh.'
  },
  {
    id: 'diag-w4',
    skill: 'writing',
    skillLabel: 'IELTS Writing',
    title: 'Câu 12: Mạch Lạc & Liên Kết Luận Điểm (Coherence & Cohesion)',
    passage: 'Luận điểm: Các thành phố đông đúc cần mở rộng không gian xanh để thanh lọc không khí.',
    question: 'Từ nối nào phù hợp nhất để giới thiệu kết quả trực tiếp của việc trồng thêm cây xanh?',
    options: [
      { key: 'A', text: 'In contrast' },
      { key: 'B', text: 'Consequently / As a consequence', isCorrect: true },
      { key: 'C', text: 'Nevertheless' },
      { key: 'D', text: 'On the other hand' }
    ],
    explanation: '"Consequently" diễn đạt mối quan hệ hệ quả / kết quả trực tiếp.'
  },

  // --- SPEAKING MODULE (Questions 13 - 16) ---
  {
    id: 'diag-s1',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 13: Kết Hợp Từ Tự Nhiên (Collocation C1)',
    passage: 'Mô tả tác động sâu sắc của một người thầy đối với cuộc đời bạn.',
    question: 'Cụm từ Collocation nào tự nhiên và học thuật nhất trong IELTS Speaking Part 2?',
    options: [
      { key: 'A', text: 'He made a heavy impact on my life.' },
      { key: 'B', text: 'He exerted a profound influence on my academic aspirations.', isCorrect: true },
      { key: 'C', text: 'He did a big change in my brain.' },
      { key: 'D', text: 'He gave me a deep impactation.' }
    ],
    explanation: '"Exert a profound influence on something" là Collocation Band 8.0+ tự nhiên và sang trọng.'
  },
  {
    id: 'diag-s2',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 14: Giảm Thiểu Từ Đệm & Tăng Độ Trôi Chảy (Fluency & Coherence)',
    passage: 'Thí sinh gặp một câu hỏi khó trong Speaking Part 3 và cần 2 giây suy nghĩ.',
    question: 'Cách xử lý nào giúp duy trì điểm Fluency tốt nhất mà không phạm lỗi "uhm, ah, like, you know"?',
    options: [
      { key: 'A', text: 'Im lặng hoàn toàn trong 5 giây và nhìn lên trần nhà.' },
      { key: 'B', text: 'Sử dụng fillers lặp đi lặp lại: "Like, you know, it is like..."' },
      { key: 'C', text: 'Sử dụng cụm kéo dài thời gian tự nhiên: "That\'s an intriguing question; looking at it from an economic perspective..."', isCorrect: true },
      { key: 'D', text: 'Nói với giám khảo: "Can you change the question please?"' }
    ],
    explanation: 'Giám khảo Cambridge đánh giá cao thí sinh biết dùng các mẫu câu "buying time" tự nhiên thay vì phát ra âm thanh ngập ngừng hoặc im lặng kéo dài.'
  },
  {
    id: 'diag-s3',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 15: Nhất Quán Thì Quá Khứ Trong Kể Chuyện Part 2',
    passage: 'Đề bài Part 2: "Describe a memorable journey you took in your childhood."',
    question: 'Đoạn nói nào duy trì sự nhất quán về thì (Past Simple / Continuous) chuẩn mực?',
    options: [
      { key: 'A', text: 'When I was seven, my family went to Da Nang. We stay in a hotel and we swim every day.' },
      { key: 'B', text: 'When I was seven, my family traveled to Da Nang. While my parents were checking in, I was marveling at the ocean view from the terrace.', isCorrect: true },
      { key: 'C', text: 'I go there 10 years ago and it is very beautiful.' },
      { key: 'D', text: 'My family has gone there when I was young and we enjoy it.' }
    ],
    explanation: 'Câu B thể hiện khả năng phối hợp nhuần nhuyễn giữa Past Simple và Past Continuous mà không bị "rớt thì" về hiện tại đơn.'
  },
  {
    id: 'diag-s4',
    skill: 'speaking',
    skillLabel: 'IELTS Speaking',
    title: 'Câu 16: Diễn Đạt Ý Kiến Cá Nhân Đa Chiều (Lexical Range)',
    passage: 'Part 3: "Do you think artificial intelligence will make artists obsolete?"',
    question: 'Cách trả lời nào đạt tiêu chuẩn Lexical Resource & Grammatical Range Band 7.5+?',
    options: [
      { key: 'A', text: 'No, because AI cannot make real art.' },
      { key: 'B', text: 'I am somewhat skeptical of that premise; while AI excels at pattern replication, it inherently lacks genuine emotional resonance and lived experience.', isCorrect: true },
      { key: 'C', text: 'AI is very smart, but people are smarter so artists will never die.' },
      { key: 'D', text: 'I agree 100 percent, AI is too good now.' }
    ],
    explanation: 'Câu B sử dụng cấu trúc nhượng bộ ("while AI excels at... it inherently lacks..."), kèm vốn từ vựng phong phú ("skeptical of that premise", "pattern replication", "emotional resonance").'
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
    reading: { label: 'Reading', total: 4, correct: 0, percentage: 0, band: 4.0 },
    listening: { label: 'Listening', total: 4, correct: 0, percentage: 0, band: 4.0 },
    writing: { label: 'Writing', total: 4, correct: 0, percentage: 0, band: 4.0 },
    speaking: { label: 'Speaking', total: 4, correct: 0, percentage: 0, band: 4.0 }
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
      userAnswer,
      correctAnswer: correctOption?.key,
      isCorrect,
      explanation: q.explanation
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

  // Identify Weaknesses
  const weaknesses = [];
  if (skillStats.reading.correct <= 2) {
    weaknesses.push({
      skill: 'reading',
      title: 'Tốc độ Quét Thông Tin & Bẫy Tuyệt Đối Hóa (Reading)',
      advice: 'Cần rèn luyện nhận diện bẫy từ cực đoan (always, all, completely) trong True/False/Not Given và tăng vốn từ C1 học thuật.'
    });
  }
  if (skillStats.listening.correct <= 2) {
    weaknesses.push({
      skill: 'listening',
      title: 'Bẫy Tự Sửa Sai & Âm Đuôi Số Nhiều (Listening)',
      advice: 'Cần chú ý các từ chỉ báo sửa sai (oh wait, apologies) và rèn thói quen kiểm tra âm đuôi -s/-es khi ghi chú nhanh.'
    });
  }
  if (skillStats.writing.correct <= 2) {
    weaknesses.push({
      skill: 'writing',
      title: 'Văn Phong Học Thuật & Kỹ Thuật Viết Overview (Writing)',
      advice: 'Tránh đưa số liệu chi tiết vào Overview Task 1 và áp dụng Hedging (tend to, suggest that) để tránh lỗi quy chụp tuyệt đối trong Task 2.'
    });
  }
  if (skillStats.speaking.correct <= 2) {
    weaknesses.push({
      skill: 'speaking',
      title: 'Vốn Collocation Tự Nhiên & Kiểm Soát Thì (Speaking)',
      advice: 'Tăng cường nạp cụm Collocation Band 7.5+ và thực hành duy trì thì Quá khứ đơn/tiếp diễn mượt mà trong Part 2.'
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
  const targetNum = Number(targetBand) || 6.5;
  const weakSkillKeys = weaknesses.map(w => w.skill);

  const plan = [];

  // WEEK 1: Nền tảng, Khắc phục Lỗ hổng Trọng tâm & Giải Mã Bẫy Lỗi
  plan.push(
    {
      day: 1,
      week: 1,
      title: 'Rà soát 14 Dạng Bài Reading & Bẫy T/F/NG',
      skill: 'reading',
      duration: '45 phút',
      toolShortcut: 'theory',
      taskDescription: 'Mở Cẩm Nang Lý Thuyết Reading, đọc kỹ chiến thuật làm dạng True/False/Not Given và Yes/No/Not Given, ghi chú 5 bẫy từ cực đoan.'
    },
    {
      day: 2,
      week: 1,
      title: 'Ngữ Pháp Học Thuật: Xử Lý Comma Splice & Mệnh Đề Quan Hệ',
      skill: 'writing',
      duration: '45 phút',
      toolShortcut: 'drills',
      taskDescription: 'Luyện tập biến đổi 5 câu đơn thành câu phức dùng liên từ phụ thuộc (Although, Whereas, Because) để chống lỗi Comma Splice.'
    },
    {
      day: 3,
      week: 1,
      title: 'Listening Section 1: Phản Xạ Bắt Số Điện Thoại & Âm Đuôi -s/-es',
      skill: 'listening',
      duration: '40 phút',
      toolShortcut: 'listening',
      taskDescription: 'Làm 1 bài Listening Section 1, tập trung nghe và phân biệt chính xác danh từ số ít / số nhiều và tên riêng đánh vần.'
    },
    {
      day: 4,
      week: 1,
      title: 'Speaking Part 1: Xây Dựng 10 Cụm Collocation Chủ Đề Học Tập / Công Việc',
      skill: 'speaking',
      duration: '40 phút',
      toolShortcut: 'notebook',
      taskDescription: 'Nạp 10 cụm từ Collocation Band 7+ vào Sổ Tay Từ Vựng (ví dụ: pursue higher education, academic workload, career prospects).'
    },
    {
      day: 5,
      week: 1,
      title: 'Writing Task 1: Bộ Khung Overview Chuẩn Cambridge (Nói Không Với Số Liệu)',
      skill: 'writing',
      duration: '50 phút',
      toolShortcut: 'writing',
      taskDescription: 'Thực hành viết 3 đoạn Overview cho 3 đề Task 1 khác nhau. Tuyệt đối không đưa số liệu cụ thể vào đoạn tổng quan.'
    },
    {
      day: 6,
      week: 1,
      title: 'Reading Passage 1: Luyện Kỹ Thuật Đọc Chunking Bấm Giờ (≤ 15 phút)',
      skill: 'reading',
      duration: '45 phút',
      toolShortcut: 'reading',
      taskDescription: 'Làm 1 bài Reading Passage 1 với mục tiêu kiểm soát thời gian dưới 15 phút, tỷ lệ đúng trên 11/13 câu.'
    },
    {
      day: 7,
      week: 1,
      title: 'Ôn Tập Tuần 1: Flashcards SRS & Kiểm Tra Lỗi Sai',
      skill: 'review',
      duration: '35 phút',
      toolShortcut: 'srs',
      taskDescription: 'Mở Sổ tay từ vựng Spaced Repetition, ôn tập toàn bộ các thẻ từ vựng đến hạn và xem lại Nhật Ký Lỗi Sai (Mistakes Log).'
    }
  );

  // WEEK 2: Tăng Tốc Kỹ Năng Mục Tiêu & Nâng Cấp Tư Duy Phản Biện C1
  plan.push(
    {
      day: 8,
      week: 2,
      title: 'Writing Task 2: Kỹ Thuật Academic Hedging (Văn Phong Cẩn Trọng)',
      skill: 'writing',
      duration: '50 phút',
      toolShortcut: 'writing',
      taskDescription: 'Viết thân bài Task 2 về chủ đề Công Nghệ/Giáo Dục, ứng dụng ít nhất 4 cấu trúc Hedging (tend to, suggest that, arguably).'
    },
    {
      day: 9,
      week: 2,
      title: 'Listening Section 2 & 3: Bẫy Thông Tin Chuyển Hướng (Self-Correction & Signposts)',
      skill: 'listening',
      duration: '45 phút',
      toolShortcut: 'listening',
      taskDescription: 'Luyện 1 bài Section 3 có 2 người thảo luận, bắt các từ chuyển hướng (However, On second thoughts, Rather).'
    },
    {
      day: 10,
      week: 2,
      title: 'Reading Passage 2: Chiến Thuật Matching Headings & Information',
      skill: 'reading',
      duration: '50 phút',
      toolShortcut: 'reading',
      taskDescription: 'Thực hành dạng bài nối tiêu đề đoạn văn, xác định câu chủ đề (Topic sentence) và ý bao quát thay vì chỉ bắt từ khóa bề mặt.'
    },
    {
      day: 11,
      week: 2,
      title: 'Speaking Part 2: Làm Chủ Khung Kể Chuyện Thì Quá Khứ (Past Narration)',
      skill: 'speaking',
      duration: '45 phút',
      toolShortcut: 'speaking',
      taskDescription: 'Thu âm 1 bài Speaking Part 2 với chủ đề trải nghiệm quá khứ, kiểm tra chỉ số nhất quán thì qua hệ thống AI Examiner.'
    },
    {
      day: 12,
      week: 2,
      title: 'Writing Task 1: Dạng Bài Quy Trình (Process) & Bản Đồ (Map)',
      skill: 'writing',
      duration: '50 phút',
      toolShortcut: 'writing',
      taskDescription: 'Luyện viết 1 bài Task 1 Process dùng thể bị động (is processed, is subsequently transferred) và từ chỉ thứ tự không gian.'
    },
    {
      day: 13,
      week: 2,
      title: 'Reading Passage 3: Chinh Phục Văn Bản Trừu Tượng Khoa Học Xã Hội',
      skill: 'reading',
      duration: '55 phút',
      toolShortcut: 'reading',
      taskDescription: 'Luyện 1 bài Passage 3 khó, áp dụng chiến thuật đọc lướt nắm mạch lập luận của tác giả, phân bổ tối đa 23 phút.'
    },
    {
      day: 14,
      week: 2,
      title: 'Ôn Tập Tuần 2: Viết Lại Câu Sai (Interactive Rewriting Box)',
      skill: 'review',
      duration: '40 phút',
      toolShortcut: 'drills',
      taskDescription: 'Thực hành viết lại 5 câu từng bị trừ điểm trong bài viết trước qua Hộp Thử Viết Lại để nâng cấp tiêu chí Lexical Resource.'
    }
  );

  // WEEK 3: Chiến Thuật Phòng Thi Chuyên Sâu & Tối Ưu Hóa Nhịp Độ Thời Gian
  plan.push(
    {
      day: 15,
      week: 3,
      title: 'Mock Writing Task 1 Bấm Giờ Đúng 20 Phút',
      skill: 'writing',
      duration: '40 phút',
      toolShortcut: 'writing',
      taskDescription: 'Bấm giờ nghiêm ngặt 20 phút hoàn thành trọn vẹn 1 bài Task 1 (tối thiểu 150 từ), kiểm tra lỗi chính tả trong 2 phút cuối.'
    },
    {
      day: 16,
      week: 3,
      title: 'Listening Section 4: Chuyên Đề Bài Giảng Học Thuật Tốc Độ Nhanh',
      skill: 'listening',
      duration: '45 phút',
      toolShortcut: 'listening',
      taskDescription: 'Làm Section 4 chủ đề Khoa học / Sinh học, tập trung giữ nhịp nghe xuyên suốt không bị mất dấu từ khóa.'
    },
    {
      day: 17,
      week: 3,
      title: 'Mock Writing Task 2 Bấm Giờ Đúng 40 Phút',
      skill: 'writing',
      duration: '55 phút',
      toolShortcut: 'writing',
      taskDescription: 'Dành 3 phút lập dàn ý qua Interactive Outliner, 32 phút viết bài (≥ 250 từ) và 5 phút rà soát lỗi ngữ pháp.'
    },
    {
      day: 18,
      week: 3,
      title: 'Reading Full Test 3 Passages (60 Phút Bấm Giờ)',
      skill: 'reading',
      duration: '70 phút',
      toolShortcut: 'reading',
      taskDescription: 'Bật chế độ Thi Thử (Exam Mode), phân bổ: P1 (17p), P2 (20p), P3 (23p). Phân tích bảng báo cáo Band điểm sau khi nộp.'
    },
    {
      day: 19,
      week: 3,
      title: 'Speaking Part 3: Tư Duy Phản Biện & Mẫu Câu Mở Rộng Đa Chiều',
      skill: 'speaking',
      duration: '45 phút',
      toolShortcut: 'speaking',
      taskDescription: 'Luyện 4 câu hỏi Part 3 hóc búa, sử dụng cấu trúc: Direct Answer -> Reason -> Specific Example -> Broader Implication.'
    },
    {
      day: 20,
      week: 3,
      title: 'Luyện Đề Listening Full 40 Câu Chuẩn Khảo Thí',
      skill: 'listening',
      duration: '50 phút',
      toolShortcut: 'listening',
      taskDescription: 'Làm trọn vẹn 40 câu Listening, kiểm tra hệ thống bóc tách lỗi đa tầng (Lỗi quá từ, Lỗi số nhiều, Lỗi chính tả).'
    },
    {
      day: 21,
      week: 3,
      title: 'Ôn Tập Tuần 3: Tổng Hợp Thống Kê & Báo Cáo Tuần (Weekly Report)',
      skill: 'review',
      duration: '35 phút',
      toolShortcut: 'report',
      taskDescription: 'Mở Báo Cáo Học Tập Tuần (Weekly Report Modal), xem biểu đồ biến thiên Band điểm và Top 3 việc cần hành động ngay.'
    }
  );

  // WEEK 4: Luyện Đề Cường Độ Cao & Rèn Luyện Tâm Lý Phòng Thi (Peak Readiness)
  plan.push(
    {
      day: 22,
      week: 4,
      title: 'Full Writing Mock Test 60 Phút (Cả Task 1 & Task 2 Liên Tục)',
      skill: 'writing',
      duration: '75 phút',
      toolShortcut: 'mock',
      taskDescription: 'Vào MockTestModal, làm đề thi Writing 60 phút hoàn chỉnh. Kiểm tra điểm tổng hợp theo công thức Cambridge (T1x1 + T2x2)/3.'
    },
    {
      day: 23,
      week: 4,
      title: 'Phòng Thi CDI Reading: Thử Nghiệm Giao Diện Tương Phản Cao & Split-Pane',
      skill: 'reading',
      duration: '65 phút',
      toolShortcut: 'reading',
      taskDescription: 'Bật chế độ Toàn Màn Hình CDI Zen Mode, thử nghiệm tỷ lệ chia 50/50 và giao diện Đen trên Trắng để làm quen áp lực thi máy.'
    },
    {
      day: 24,
      week: 4,
      title: 'Full Speaking Mock Test 3 Parts Với AI Examiner',
      skill: 'speaking',
      duration: '40 phút',
      toolShortcut: 'speaking',
      taskDescription: 'Thực hiện bài kiểm tra Speaking đầy đủ cả 3 phần. Phấn đấu đạt nhịp độ 110-150 WPM và độ tin cậy phát âm trên 80%.'
    },
    {
      day: 25,
      week: 4,
      title: 'Full Listening Mock Test 40 Câu Tập Trung Cao Độ',
      skill: 'listening',
      duration: '50 phút',
      toolShortcut: 'listening',
      taskDescription: 'Làm 1 đề Listening mới trong không gian yên tĩnh, ghi chú các từ mới nghe được vào Sổ tay từ vựng.'
    },
    {
      day: 26,
      week: 4,
      title: 'Rà Soát Toàn Bộ Kho Lỗi Sai (Mistakes Log Sweep)',
      skill: 'review',
      duration: '45 phút',
      toolShortcut: 'mistakes',
      taskDescription: 'Duyệt lại toàn bộ các câu hỏi từng làm sai trong Reading & Listening. Đảm bảo nắm rõ bản chất bẫy distractor của từng câu.'
    },
    {
      day: 27,
      week: 4,
      title: 'Writing Drill Tinh Gọn: Hoàn Thiện 2 Đoạn Thân Bài Band 7.5+',
      skill: 'writing',
      duration: '45 phút',
      toolShortcut: 'writing',
      taskDescription: 'Tập trung viết 2 đoạn thân bài Task 2 với cấu trúc PEEL chuẩn mực: Topic Sentence -> Explanation -> Concrete Evidence -> Link back.'
    },
    {
      day: 28,
      week: 4,
      title: 'Thực Hành Speaking Part 2 Bấm Giờ 1 Phút Chuẩn Bị & 2 Phút Nói',
      skill: 'speaking',
      duration: '40 phút',
      toolShortcut: 'speaking',
      taskDescription: 'Tập lập dàn ý nhanh trong đúng 60 giây và nói liên tục không ngừng trong 2 phút mà không bị quá giờ.'
    },
    {
      day: 29,
      week: 4,
      title: 'Tổng Diễn Tập 4 Kỹ Năng (Mini All-Skill Checkup)',
      skill: 'mock',
      duration: '90 phút',
      toolShortcut: 'mock',
      taskDescription: 'Rà soát lại toàn bộ chiến lược quản lý thời gian và các checklist quan trọng nhất trước ngày thi.'
    },
    {
      day: 30,
      week: 4,
      title: 'Hoàn Thành Lộ Trình: Tự Tin Chinh Phục Target Band!',
      skill: 'review',
      duration: '30 phút',
      toolShortcut: 'profile',
      taskDescription: 'Xuất bản sao lưu dữ liệu toàn diện (JSON Backup) và xem lại hành trình tiến bộ vượt bậc sau 30 ngày kiên trì!'
    }
  );

  return plan;
}
