/**
 * Curated Dataset of IELTS Listening Micro-Drills
 * 5 Specialized Training Rooms:
 * 1. listening-dictation: Dictation with Color-Coded Feedback (Basic -> Battle-tested -> Academic)
 * 2. listening-spelling: Spelling & Number/Code/Date Reflex Drill
 * 3. listening-distractor: Distractor Trap Buster (Self-correction, condition shifts, misleading numbers)
 * 4. listening-map: Map Direction & Spatial Navigation Trainer
 * 5. listening-signposting: Academic Signposting & Lecture Milestone Catcher (Part 4)
 */

export const LISTENING_MICRO_DRILLS = [
  // ==========================================
  // 1. DICTATION CHÉP CHÍNH TẢ ĐA TẦNG
  // ==========================================
  {
    id: 'ldrill-dict-1',
    type: 'listening-dictation',
    level: 'basic',
    title: 'Dictation Cấp 1 (Cơ bản): Đăng ký thông tin lưu trú khách sạn',
    category: 'Daily Conversation & Travel',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'Could you please confirm your email address and preferred arrival date for the double room reservation?',
    targetTranscript: 'Could you please confirm your email address and preferred arrival date for the double room reservation?',
    wordCount: 16,
    difficulty: 'Band 5.0 - 6.0',
    audioClipTip: 'Chú ý nối âm: "confirm your" /kənˈfɜːm jɔːr/ và "arrival date".'
  },
  {
    id: 'ldrill-dict-2',
    type: 'listening-dictation',
    level: 'basic',
    title: 'Dictation Cấp 1 (Cơ bản): Mượn tài liệu thư viện trường',
    category: 'Campus Services',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'Undergraduate students may borrow up to eight books for a maximum period of three weeks.',
    targetTranscript: 'Undergraduate students may borrow up to eight books for a maximum period of three weeks.',
    wordCount: 16,
    difficulty: 'Band 5.0 - 6.0',
    audioClipTip: 'Chú ý từ ghép "Undergraduate" và âm đuôi số nhiều "books", "weeks".'
  },
  {
    id: 'ldrill-dict-3',
    type: 'listening-dictation',
    level: 'basic',
    title: 'Dictation Cấp 1 (Cơ bản): Lịch bảo dưỡng xe định kỳ',
    category: 'Customer Service',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'The mechanic recommends changing the engine oil every six months to prevent sudden breakdowns.',
    targetTranscript: 'The mechanic recommends changing the engine oil every six months to prevent sudden breakdowns.',
    wordCount: 15,
    difficulty: 'Band 5.5 - 6.0',
    audioClipTip: 'Chú ý âm đuôi động cơ "engine oil" và số nhiều "six months", "breakdowns".'
  },
  {
    id: 'ldrill-dict-4',
    type: 'listening-dictation',
    level: 'intermediate',
    title: 'Dictation Cấp 2 (Thực chiến): Thảo luận về dự án bảo tồn nguồn nước',
    category: 'Environmental Science',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'The local community initiated a rainwater harvesting program to alleviate severe droughts during the summer months.',
    targetTranscript: 'The local community initiated a rainwater harvesting program to alleviate severe droughts during the summer months.',
    wordCount: 16,
    difficulty: 'Band 6.5 - 7.5',
    audioClipTip: 'Chú ý nuốt âm và âm đuôi: "initiated" /ɪˈnɪʃieɪtɪd/, "harvesting program", "severe droughts".'
  },
  {
    id: 'ldrill-dict-5',
    type: 'listening-dictation',
    level: 'intermediate',
    title: 'Dictation Cấp 2 (Thực chiến): Phân tích chiến lược phát triển đô thị',
    category: 'Urban Planning',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'Constructing dedicated cycling lanes substantially reduced peak hour traffic congestion in suburban neighborhoods.',
    targetTranscript: 'Constructing dedicated cycling lanes substantially reduced peak hour traffic congestion in suburban neighborhoods.',
    wordCount: 13,
    difficulty: 'Band 6.5 - 7.5',
    audioClipTip: 'Chú ý trạng từ chỉ mức độ "substantially" và cụm "traffic congestion".'
  },
  {
    id: 'ldrill-dict-6',
    type: 'listening-dictation',
    level: 'advanced',
    title: 'Dictation Cấp 3 (Học thuật): Thuyết trình khảo cổ học thời kỳ đồ đồng',
    category: 'Academic Lecture & Archaeology',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'Recent radiometric dating of sediment layers suggests that metallurgical techniques were introduced far earlier than previously hypothesized.',
    targetTranscript: 'Recent radiometric dating of sediment layers suggests that metallurgical techniques were introduced far earlier than previously hypothesized.',
    wordCount: 17,
    difficulty: 'Band 8.0 - 9.0',
    audioClipTip: 'Chú ý các thuật ngữ học thuật phức tạp: "radiometric", "metallurgical", "hypothesized".'
  },
  {
    id: 'ldrill-dict-7',
    type: 'listening-dictation',
    level: 'advanced',
    title: 'Dictation Cấp 3 (Học thuật): Nghiên cứu tiến hóa hành vi linh trưởng',
    category: 'Evolutionary Biology',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    ttsText: 'Observational empirical evidence demonstrates that juvenile chimpanzees acquire tool use through meticulous emulation rather than explicit parental instruction.',
    targetTranscript: 'Observational empirical evidence demonstrates that juvenile chimpanzees acquire tool use through meticulous emulation rather than explicit parental instruction.',
    wordCount: 18,
    difficulty: 'Band 8.0 - 9.0',
    audioClipTip: 'Thuật ngữ học thuật C1-C2: "empirical evidence", "meticulous emulation", "explicit instruction".'
  },

  // ==========================================
  // 2. PHẢN XẠ ĐÁNH VẦN, TÊN RIÊNG & CON SỐ
  // ==========================================
  {
    id: 'ldrill-spell-1',
    type: 'listening-spelling',
    subType: 'spelling',
    title: 'Đánh vần tên đường phố dễ nhầm lẫn (British Accent)',
    category: 'Personal Names & Addresses',
    promptAudioText: 'The parcel should be delivered to twenty-four Ravensbourne Crescent, that is R-A-V-E-N-S-B-O-U-R-N-E Crescent.',
    spokenSpelling: 'R-A-V-E-N-S-B-O-U-R-N-E',
    correctAnswer: 'Ravensbourne',
    acceptableAnswers: ['Ravensbourne', 'ravensbourne', 'RAVENSBOURNE'],
    trapNote: 'Bẫy âm dễ nhầm: Chữ cái V /viː/ và B /biː/, chữ R /ɑːr/ câm trong giọng Anh.',
    explanation: 'Người nói đánh vần rõ: R-A-V-E-N-S-B-O-U-R-N-E (Ravensbourne Crescent).'
  },
  {
    id: 'ldrill-spell-2',
    type: 'listening-spelling',
    subType: 'numbers',
    title: 'Phân biệt đuôi -teen vs -ty và mã bưu chính (Postcode)',
    category: 'Numbers & Postcodes',
    promptAudioText: 'Our office postcode is SW19 4TL, and the extension number is seven three four, not seven four three.',
    correctAnswer: 'SW19 4TL',
    acceptableAnswers: ['SW19 4TL', 'SW194TL', 'sw19 4tl'],
    trapNote: 'Bẫy số đảo ngược: "seven three four, not seven four three". Postcode UK luôn có cấu trúc chữ - số - khoảng cách.',
    explanation: 'Mã bưu chính chuẩn xác là SW19 4TL. Người nói cố tình chỉnh lại số máy nhánh để đánh lạc hướng.'
  },
  {
    id: 'ldrill-spell-3',
    type: 'listening-spelling',
    subType: 'currency-date',
    title: 'Ngày tháng & Số tiền có phí đặt cọc hoàn lại',
    category: 'Dates & Currency',
    promptAudioText: 'The standard conference ticket is ninety-five pounds, but if you register before the fifteenth of May, it is seventy-five pounds with a ten pound refundable deposit.',
    correctAnswer: '75',
    questionPrompt: 'Early bird conference ticket fee (excluding deposit): £ .........',
    acceptableAnswers: ['75', 'seventy-five', 'seventy five', '£75'],
    trapNote: 'Bẫy số 95 (giá chuẩn), 15 (ngày hết hạn), 10 (tiền cọc). Giá vé sớm thực tế là £75.',
    explanation: 'Giá vé đăng ký sớm là 75 bảng (£75).'
  },
  {
    id: 'ldrill-spell-4',
    type: 'listening-spelling',
    subType: 'numbers',
    title: 'Bẫy số lặp & Số không trong số điện thoại (Double numbers)',
    category: 'Phone Numbers',
    promptAudioText: 'If you want to make an appointment with Doctor Jenkins, ring zero double-seven double-oh, nine one three, five double-two.',
    correctAnswer: '07700 913522',
    questionPrompt: 'Doctor appointment telephone number: .........',
    acceptableAnswers: ['07700 913522', '07700913522', '07700 913 522'],
    trapNote: 'Cách đọc đặc trưng UK: "double-seven double-oh" = 7700, "five double-two" = 522.',
    explanation: 'Dãy số chuẩn là 07700 913522.'
  },
  {
    id: 'ldrill-spell-5',
    type: 'listening-spelling',
    subType: 'spelling',
    title: 'Đánh vần họ tên người Scotland / Ireland (Mac / Mc)',
    category: 'Personal Names',
    promptAudioText: 'The guest lecturer is Professor MacIntyre, spelt M-A-C, capital I, N-T-Y-R-E.',
    correctAnswer: 'MacIntyre',
    questionPrompt: 'Name of guest lecturer: Professor .........',
    acceptableAnswers: ['MacIntyre', 'macintyre', 'Macintyre'],
    trapNote: 'Bẫy viết hoa chữ I ở giữa (MacIntyre) và phân biệt Y với I.',
    explanation: 'Giáo viên đánh vần M-A-C-I-N-T-Y-R-E (MacIntyre).'
  },
  {
    id: 'ldrill-spell-6',
    type: 'listening-spelling',
    subType: 'currency-date',
    title: 'Ngày thi khởi hành (Departure date & time)',
    category: 'Travel Schedule',
    promptAudioText: 'The ferry departs on Wednesday the twenty-third of September at eight forty-five in the morning.',
    correctAnswer: '23 September',
    questionPrompt: 'Ferry departure date: .........',
    acceptableAnswers: ['23 September', '23rd September', 'September 23', '23rd of September'],
    trapNote: 'Không điền ngày trong tuần (Wednesday) hoặc giờ (8:45) nếu đề chỉ hỏi ngày khởi hành.',
    explanation: 'Ngày xuất bến là 23 September (hoặc 23rd September).'
  },

  // ==========================================
  // 3. PHÁ BẪY DISTRACTORS (THÔNG TIN THAY ĐỔI)
  // ==========================================
  {
    id: 'ldrill-dist-1',
    type: 'listening-distractor',
    title: 'Bẫy tự đính chính (Self-Correction Trap): Thời gian khởi hành xe buýt',
    category: 'Transport Schedule',
    audioSnippetText: "We originally scheduled the charter coach for eight fifteen in the morning, but the driver called to say there is heavy roadwork, so we have pushed it back to eight forty-five. Actually, make that nine o'clock sharp to allow everyone time for breakfast.",
    question: 'At what time will the charter coach actually depart?',
    options: [
      { id: 'A', text: '8:15 AM (Thời gian dự kiến ban đầu)' },
      { id: 'B', text: '8:45 AM (Thời gian điều chỉnh lần 1)' },
      { id: 'C', text: '9:00 AM (Thời gian chốt cuối cùng)' }
    ],
    correctOption: 'C',
    distractorMechanism: "Người nói đưa ra 3 mốc giờ liên tiếp: 8:15 -> 8:45 -> 9:00 (\"Actually, make that nine o'clock sharp\"). Thí sinh vội vàng sẽ ghi ngay đáp án A hoặc B.",
    explanation: 'Từ nối đổi ý "Actually, make that..." là dấu hiệu chốt thông tin cuối cùng: xe khởi hành lúc 9:00 AM.'
  },
  {
    id: 'ldrill-dist-2',
    type: 'listening-distractor',
    title: 'Bẫy phủ định ngầm (Implicit Negation): Đồ dùng được ban tổ chức chuẩn bị sẵn',
    category: 'Workshops & Equipment',
    audioSnippetText: 'You do not need to bring your own drafting paper or colored pencils as the studio supplies plenty. However, unlike last semester, aprons are no longer provided due to hygiene policies, so please ensure you bring your own.',
    question: 'Which item MUST the participant bring themselves?',
    options: [
      { id: 'A', text: 'Drafting paper' },
      { id: 'B', text: 'Colored pencils' },
      { id: 'C', text: 'An apron' }
    ],
    correctOption: 'C',
    distractorMechanism: 'Bẫy dùng cụm "You do not need to bring..." cho drafting paper và pencils, nhưng đảo ngược lại với "unlike last semester, aprons are no longer provided".',
    explanation: 'Giấy vẽ và bút màu đã có sẵn; chỉ có tạp dề (apron) là không còn được cấp, người tham gia bắt buộc phải tự mang theo.'
  },
  {
    id: 'ldrill-dist-3',
    type: 'listening-distractor',
    title: 'Bẫy Người thứ 2 phản bác (Disagreement Trap): Đề tài bài tập nhóm',
    category: 'Academic Discussion',
    audioSnippetText: 'Liam: How about we write our presentation on tidal power plants? It is really cutting-edge. - Chloe: Well, I thought so too at first, but Professor Davies explicitly warned that reliable data on tidal facilities is extremely limited. We would be much safer examining geothermal heating in Nordic houses. - Liam: Fair enough, let us go with that instead.',
    question: 'What topic did the students ultimately choose for their presentation?',
    options: [
      { id: 'A', text: 'Tidal power plants' },
      { id: 'B', text: 'Geothermal heating' },
      { id: 'C', text: 'Solar panel efficiency' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Liam đề xuất A (Tidal power), nhưng Chloe phản bác do thiếu dữ liệu và đề xuất B (Geothermal). Liam đồng ý với "Fair enough, let us go with that".',
    explanation: 'Đề tài cuối cùng được hai sinh viên thống nhất chọn là Geothermal heating (Đáp án B).'
  },
  {
    id: 'ldrill-dist-4',
    type: 'listening-distractor',
    title: 'Bẫy Quá khứ vs Hiện tại (Temporal Shift Trap): Cơ cấu tổ chức công ty',
    category: 'Business & Management',
    audioSnippetText: 'Our regional marketing branch used to be headquarted in Manchester for over a decade. Two years ago we briefly relocated operations to Birmingham, but since last December our permanent executive headquarters has been situated in central Leeds.',
    question: 'Where is the executive headquarters currently located?',
    options: [
      { id: 'A', text: 'Manchester' },
      { id: 'B', text: 'Birmingham' },
      { id: 'C', text: 'Leeds' }
    ],
    correctOption: 'C',
    distractorMechanism: 'Dùng cấu trúc "used to be" cho Manchester, "briefly relocated" cho Birmingham, và chốt hiện tại với "since last December... in Leeds".',
    explanation: 'Trụ sở hiện tại của công ty nằm ở Leeds (Đáp án C).'
  },

  // ==========================================
  // 4. BẢN ĐỒ & ĐỊNH HƯỚNG PHƯƠNG HƯỚNG (MAP & DIRECTIONS)
  // ==========================================
  {
    id: 'ldrill-map-1',
    type: 'listening-map',
    title: 'Định hướng ngã ba & Lối rẽ: Tìm Phòng Hội Nghị Trung Tâm',
    category: 'Campus & Facility Layout',
    audioDirectionsText: 'As you enter through the main southern entrance, head straight ahead past the fountain. When you reach the T-junction, take the path to your left. Keep walking past the pond, and you will see the Conference Center situated immediately on your right-hand side, directly opposite the bicycle racks.',
    question: 'Where is the Conference Center situated?',
    options: [
      { id: 'A', text: 'Next to the main entrance fountain' },
      { id: 'B', text: 'On the right-hand side of the path past the pond, opposite the bike racks' },
      { id: 'C', text: 'At the end of the right-hand path at the T-junction' }
    ],
    correctOption: 'B',
    spatialClues: ['South entrance -> straight past fountain', 'T-junction -> turn left', 'Past the pond -> on the right-hand side', 'Opposite bike racks'],
    explanation: 'Theo lộ trình: Cổng nam -> đi thẳng qua đài phun nước -> ngã ba rẽ trái -> đi qua hồ nước -> Phòng hội nghị nằm ngay bên tay phải, đối diện bãi đậu xe đạp.'
  },
  {
    id: 'ldrill-map-2',
    type: 'listening-map',
    title: 'Định hướng La bàn & Vòng xuyến (Roundabout & Compass Points)',
    category: 'Town & Park Navigation',
    audioDirectionsText: 'Starting from the tourist kiosk at the bottom of your map, head due north along High Street until you arrive at the roundabout. Take the first exit heading eastward along River Lane. The historic Heritage Mill is the prominent brick building located on the northern bank, just before the footbridge.',
    question: 'Which location correctly describes the Heritage Mill?',
    options: [
      { id: 'A', text: 'On High Street just south of the tourist kiosk' },
      { id: 'B', text: 'On the northern bank of River Lane, east of the roundabout before the footbridge' },
      { id: 'C', text: 'Across the footbridge heading towards the western boundary' }
    ],
    correctOption: 'B',
    spatialClues: ['Kiosk -> head north along High Street', 'Roundabout -> take first exit eastward (River Lane)', 'Heritage Mill: northern bank, before footbridge'],
    explanation: 'Từ quầy du lịch đi về hướng Bắc đến vòng xuyến -> rẽ lối đầu tiên về phía Đông dọc đường River Lane -> cối xay cổ nằm ở bờ phía Bắc, ngay trước cây cầu bộ hành.'
  },

  // ==========================================
  // 5. BẮT TÍN HIỆU CHUYỂN Ý HỌC THUẬT (SIGNPOSTING PART 4)
  // ==========================================
  {
    id: 'ldrill-sign-1',
    type: 'listening-signposting',
    title: 'Tín hiệu Chuyển Luận Điểm: Từ bối cảnh lịch sử sang Nguyên nhân cốt lõi',
    category: 'Academic Signposting (Part 4)',
    audioSnippetText: 'Having surveyed the socio-economic backdrop of the late nineteenth century, let us now turn our attention to the primary catalyst for the industrial migration. Specifically, the innovation in steam-powered spinning machinery transformed regional labour markets.',
    question: 'Cụm từ nào báo hiệu người nói đang chuyển sang phân tích Nguyên nhân (Primary catalyst)?',
    options: [
      { id: 'A', text: 'Having surveyed the socio-economic backdrop...' },
      { id: 'B', text: 'let us now turn our attention to the primary catalyst...' },
      { id: 'C', text: 'Specifically, the innovation in steam-powered spinning...' }
    ],
    correctOption: 'B',
    signpostType: 'Transition to New Key Point (Chuyển sang luận điểm mới)',
    explanation: 'Cụm "let us now turn our attention to [X]..." là tín hiệu chuyển ý kinh điển trong Part 4 giúp thí sinh biết bài nói chuẩn bị trả lời cho câu hỏi tiếp theo trong đề thi.'
  },
  {
    id: 'ldrill-sign-2',
    type: 'listening-signposting',
    title: 'Tín hiệu Phản biện & Bất ngờ (Contrasting & Counter-intuitive Evidence)',
    category: 'Marine Biology Lecture',
    audioSnippetText: 'Initial oceanographic models predicted a drastic decline in coral polyp reproduction under elevated temperatures. Surprisingly, however, recent deep-sea observational expeditions revealed that certain resilient colonies actually thrive by adapting their symbiotic algae.',
    question: 'Từ ngữ tín hiệu nào báo hiệu kết quả thực tế trái ngược với dự đoán ban đầu?',
    options: [
      { id: 'A', text: 'Initial oceanographic models predicted...' },
      { id: 'B', text: 'under elevated temperatures...' },
      { id: 'C', text: 'Surprisingly, however, recent deep-sea observational expeditions revealed...' }
    ],
    correctOption: 'C',
    signpostType: 'Contrast / Counter-expectation (Ý tương phản / phát hiện bất ngờ)',
    explanation: '"Surprisingly, however..." là từ nối báo hiệu kết quả đi ngược lại giả thuyết ban đầu (thường là mấu chốt để trả lời câu hỏi điền từ hoặc trắc nghiệm).'
  }
];
