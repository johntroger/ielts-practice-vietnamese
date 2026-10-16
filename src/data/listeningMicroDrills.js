/**
 * Curated Dataset of IELTS Listening Micro-Drills
 * 5 Specialized Training Rooms:
 * 1. listening-dictation: Dictation with Color-Coded Feedback (Basic -> Battle-tested -> Academic)
 * 2. listening-spelling: Spelling & Number/Code/Date Reflex Drill
 * 3. listening-distractor: Distractor Trap Buster (Self-correction, condition shifts, misleading numbers)
 * 4. listening-map: Map Direction & Spatial Navigation Trainer
 * 5. listening-signposting: Academic Signposting & Lecture Milestone Catcher (Part 4)
 *
 * Each drill is equipped with:
 * - audioUrl & fallbackAudioUrl: HTML5 Audio streaming URLs matching Cambridge IELTS standards
 * - clipStart & clipEnd: Exact timestamp segment (seconds) for focused, high-repetition listening
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
    ttsText: 'Could you please confirm your email address and preferred arrival date for the double room reservation?',
    audioText: 'Could you please confirm your email address and preferred arrival date for the double room reservation?',
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
    ttsText: 'Undergraduate students may borrow up to eight books for a maximum period of three weeks.',
    audioText: 'Undergraduate students may borrow up to eight books for a maximum period of three weeks.',
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
    ttsText: 'The mechanic recommends changing the engine oil every six months to prevent sudden breakdowns.',
    audioText: 'The mechanic recommends changing the engine oil every six months to prevent sudden breakdowns.',
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
    ttsText: 'The local community initiated a rainwater harvesting program to alleviate severe droughts during the summer months.',
    audioText: 'The local community initiated a rainwater harvesting program to alleviate severe droughts during the summer months.',
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
    ttsText: 'Constructing dedicated cycling lanes substantially reduced peak hour traffic congestion in suburban neighborhoods.',
    audioText: 'Constructing dedicated cycling lanes substantially reduced peak hour traffic congestion in suburban neighborhoods.',
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
    ttsText: 'Recent radiometric dating of sediment layers suggests that metallurgical techniques were introduced far earlier than previously hypothesized.',
    audioText: 'Recent radiometric dating of sediment layers suggests that metallurgical techniques were introduced far earlier than previously hypothesized.',
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
    ttsText: 'Observational empirical evidence demonstrates that juvenile chimpanzees acquire tool use through meticulous emulation rather than explicit parental instruction.',
    audioText: 'Observational empirical evidence demonstrates that juvenile chimpanzees acquire tool use through meticulous emulation rather than explicit parental instruction.',
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
    audioText: 'The parcel should be delivered to twenty-four Ravensbourne Crescent, that is R-A-V-E-N-S-B-O-U-R-N-E Crescent.',
    spokenSpelling: 'R-A-V-E-N-S-B-O-U-R-N-E',
    correctAnswer: 'Ravensbourne',
    questionPrompt: 'Delivery address: 24 ......... Crescent',
    questionPromptVi: 'Địa chỉ giao nhận bưu phẩm: 24 ......... Crescent',
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
    audioText: 'Our office postcode is SW19 4TL, and the extension number is seven three four, not seven four three.',
    correctAnswer: 'SW19 4TL',
    questionPrompt: 'Office postcode: .........',
    questionPromptVi: 'Mã bưu chính văn phòng: .........',
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
    audioText: 'The standard conference ticket is ninety-five pounds, but if you register before the fifteenth of May, it is seventy-five pounds with a ten pound refundable deposit.',
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
    audioText: 'If you want to make an appointment with Doctor Jenkins, ring zero double-seven double-oh, nine one three, five double-two.',
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
    audioText: 'The guest lecturer is Professor MacIntyre, spelt M-A-C, capital I, N-T-Y-R-E.',
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
    audioText: 'The ferry departs on Wednesday the twenty-third of September at eight forty-five in the morning.',
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
    audioText: "We originally scheduled the charter coach for eight fifteen in the morning, but the driver called to say there is heavy roadwork, so we have pushed it back to eight forty-five. Actually, make that nine o'clock sharp to allow everyone time for breakfast.",
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
    audioText: 'You do not need to bring your own drafting paper or colored pencils as the studio supplies plenty. However, unlike last semester, aprons are no longer provided due to hygiene policies, so please ensure you bring your own.',
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
    audioText: 'Liam: How about we write our presentation on tidal power plants? It is really cutting-edge. - Chloe: Well, I thought so too at first, but Professor Davies explicitly warned that reliable data on tidal facilities is extremely limited. We would be much safer examining geothermal heating in Nordic houses. - Liam: Fair enough, let us go with that instead.',
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
    audioText: 'Our regional marketing branch used to be headquarted in Manchester for over a decade. Two years ago we briefly relocated operations to Birmingham, but since last December our permanent executive headquarters has been situated in central Leeds.',
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
    audioText: 'As you enter through the main southern entrance, head straight ahead past the fountain. When you reach the T-junction, take the path to your left. Keep walking past the pond, and you will see the Conference Center situated immediately on your right-hand side, directly opposite the bicycle racks.',
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
    audioText: 'Starting from the tourist kiosk at the bottom of your map, head due north along High Street until you arrive at the roundabout. Take the first exit heading eastward along River Lane. The historic Heritage Mill is the prominent brick building located on the northern bank, just before the footbridge.',
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
    audioText: 'Having surveyed the socio-economic backdrop of the late nineteenth century, let us now turn our attention to the primary catalyst for the industrial migration. Specifically, the innovation in steam-powered spinning machinery transformed regional labour markets.',
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
    audioText: 'Initial oceanographic models predicted a drastic decline in coral polyp reproduction under elevated temperatures. Surprisingly, however, recent deep-sea observational expeditions revealed that certain resilient colonies actually thrive by adapting their symbiotic algae.',
    question: 'Từ ngữ tín hiệu nào báo hiệu kết quả thực tế trái ngược với dự đoán ban đầu?',
    options: [
      { id: 'A', text: 'Initial oceanographic models predicted...' },
      { id: 'B', text: 'under elevated temperatures...' },
      { id: 'C', text: 'Surprisingly, however, recent deep-sea observational expeditions revealed...' }
    ],
    correctOption: 'C',
    signpostType: 'Contrast / Counter-expectation (Ý tương phản / phát hiện bất ngờ)',
    explanation: '"Surprisingly, however..." là từ nối báo hiệu kết quả đi ngược lại giả thuyết ban đầu (thường là mấu chốt để trả lời câu hỏi điền từ hoặc trắc nghiệm).'
  },
  {
    id: 'ldrill-dict-flat-1',
    type: 'listening-dictation',
    level: 'intermediate',
    title: 'Dictation Cấp 2: Miêu tả căn hộ và phòng tắm khép kín (Track 2)',
    category: 'Housing & Accommodation',
    ttsText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet, in addition to the main bathroom and toilet.',
    audioText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet, in addition to the main bathroom and toilet.',
    targetTranscript: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet, in addition to the main bathroom and toilet.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track2-flat-descriptions.mp3',
    clipStart: 12,
    clipEnd: 19,
    wordCount: 22,
    difficulty: 'Band 6.0 - 7.0',
    audioClipTip: 'Lưu ý từ ghép "en-suite" và cấu trúc nối tiếp "in addition to".'
  },
  {
    id: 'ldrill-dist-flat-2',
    type: 'listening-distractor',
    title: 'Bẫy khả năng chuyển đổi công năng (Potential vs Actual): Số phòng ngủ căn hộ',
    category: 'Housing & Accommodation',
    audioSnippetText: 'There are two double bedrooms, one bathroom, a newly fitted kitchen, a living room, and a separate dining room which could be turned into a third bedroom.',
    audioText: 'There are two double bedrooms, one bathroom, a newly fitted kitchen, a living room, and a separate dining room which could be turned into a third bedroom.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track2-flat-descriptions.mp3',
    clipStart: 44,
    clipEnd: 54,
    question: 'Hiện tại căn hộ số 2 có bao nhiêu phòng ngủ thực tế?',
    options: [
      { id: 'A', text: '3 phòng ngủ (đã tính cả phòng ăn)' },
      { id: 'B', text: '2 phòng ngủ (2 double bedrooms thực tế)' },
      { id: 'C', text: '1 phòng ngủ đôi duy nhất' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Người nói đề cập "could be turned into a third bedroom" (có thể cải tạo thành phòng ngủ thứ 3), khiến thí sinh nhầm lẫn giữa hiện trạng và tiềm năng.',
    explanation: 'Cụm từ "could be turned into..." diễn tả khả năng trong tương lai, hiện trạng chỉ có "two double bedrooms".'
  },
  {
    id: 'ldrill-spell-flat-3',
    type: 'listening-spelling',
    subType: 'spelling',
    title: 'Chính tả từ vựng nhà ở IELTS (UK Property Vocabulary)',
    category: 'Housing Vocabulary',
    promptAudioText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet.',
    audioText: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track2-flat-descriptions.mp3',
    clipStart: 12,
    clipEnd: 19,
    correctAnswer: 'en-suite',
    questionPrompt: 'Master bedroom feature: ......... bathroom',
    questionPromptVi: 'Đặc điểm phòng ngủ chính: phòng tắm .........',
    acceptableAnswers: ['en-suite', 'ensuite', 'en suite'],
    trapNote: 'Bẫy chính tả: Từ mượn gốc Pháp "en-suite" có dấu gạch nối hoặc viết liền "ensuite".',
    explanation: 'Từ chuẩn IELTS là "en-suite" (phòng tắm khép kín gắn liền phòng ngủ).'
  },
  {
    id: 'ldrill-dist-sched-1',
    type: 'listening-distractor',
    title: 'Bẫy đàm phán lịch hẹn (Scheduling Negotiation Trap): Lịch xem nhà',
    category: 'Appointment Scheduling',
    audioSnippetText: "I'm free tomorrow morning. Is 11:00 okay? - Oh no, I'm sorry, I'm busy then. - How about 1:00 then, or 1:45? - 1:00 would be best for me.",
    audioText: "I'm free tomorrow morning. Is 11:00 okay? - Oh no, I'm sorry, I'm busy then. - How about 1:00 then, or 1:45? - 1:00 would be best for me.",
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track3-property-enquiry.mp3',
    clipStart: 120,
    clipEnd: 136,
    question: 'Khách hàng và môi giới đã thống nhất gặp nhau vào lúc mấy giờ?',
    options: [
      { id: 'A', text: '11:00 AM (Giờ khách đề xuất ban đầu nhưng môi giới bận)' },
      { id: 'B', text: '1:00 PM (Giờ môi giới xác nhận là tốt nhất)' },
      { id: 'C', text: '1:45 PM (Một trong các lựa chọn dự phòng của khách)' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Người nói đưa ra liên tiếp 3 mốc giờ: 11:00 (bị từ chối vì bận) -> 1:00 hoặc 1:45 -> Chốt câu cuối: "1:00 would be best for me".',
    explanation: 'Thí sinh cần chú ý câu chốt xác nhận cuối cùng của người đối thoại ("1:00 would be best for me").'
  },
  {
    id: 'ldrill-spell-phone-1',
    type: 'listening-spelling',
    subType: 'numbers',
    title: 'Phản xạ ghi chép số điện thoại di động UK (Track 3)',
    category: 'Telephone Numbers',
    promptAudioText: 'My name is Caroline Prendergast. My number is 07945 872 310.',
    audioText: 'My name is Caroline Prendergast. My number is 07945 872 310.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track3-property-enquiry.mp3',
    clipStart: 138,
    clipEnd: 150,
    correctAnswer: '07945 872 310',
    questionPrompt: 'Caroline Prendergast\'s contact number: .........',
    questionPromptVi: 'Số điện thoại liên hệ của Caroline: .........',
    acceptableAnswers: ['07945 872 310', '07945872310', '07945 872310'],
    trapNote: 'Số 0 được đọc là "oh" (/oʊ/), nhịp ngắt số chuẩn UK: 07945 - 872 - 310.',
    explanation: 'Dãy số điện thoại chính xác là 07945 872 310.'
  },
  {
    id: 'ldrill-spell-code-b1074',
    type: 'listening-spelling',
    subType: 'spelling',
    title: 'Phân biệt chữ cái dễ nhầm B vs D & Mã thành viên (Track 4)',
    category: 'Membership Codes',
    promptAudioText: 'What\'s your membership number? - It\'s B1074. - Sorry, did you say D1074? - No, B1074.',
    audioText: 'What\'s your membership number? - It\'s B1074. - Sorry, did you say D1074? - No, B1074.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track4-numbers-measurements.mp3',
    clipStart: 81,
    clipEnd: 99,
    correctAnswer: 'B1074',
    questionPrompt: 'Course membership number: .........',
    questionPromptVi: 'Mã số hội viên đăng ký khóa học: .........',
    acceptableAnswers: ['B1074', 'b1074', 'B 1074'],
    trapNote: 'Bẫy âm chữ cái: Chữ B /biː/ và D /diː/ phát âm qua loa hoặc điện thoại rất dễ nhầm lẫn.',
    explanation: 'Khách hàng nhấn mạnh lại: "No, B1074" (chữ B, không phải D).'
  },
  {
    id: 'ldrill-dist-price-5372',
    type: 'listening-distractor',
    title: 'Bẫy số đếm hàng chục (Tens Trap): Giá tiền £43.72 vs £53.72',
    category: 'Shopping & Currency',
    audioSnippetText: 'How much is that all together? - That\'s £53.72 please. - Sorry, did you say £43.72? - No, £53.72.',
    audioText: 'How much is that all together? - That\'s £53.72 please. - Sorry, did you say £43.72? - No, £53.72.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track4-numbers-measurements.mp3',
    clipStart: 2,
    clipEnd: 17,
    question: 'Số tiền thực tế khách hàng phải thanh toán là bao nhiêu?',
    options: [
      { id: 'A', text: '£43.72 (Khách hàng nghe nhầm)' },
      { id: 'B', text: '£53.72 (Thu ngân xác nhận)' },
      { id: 'C', text: '£35.72' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Người mua hỏi lại số tiền sai (£43.72), thu ngân lập tức đính chính bằng từ phủ định "No, £53.72".',
    explanation: 'Đáp án chuẩn là £53.72.'
  },
  {
    id: 'ldrill-dist-price-350k',
    type: 'listening-distractor',
    title: 'Bẫy giá niêm yết bất động sản: £340,000 vs £350,000 (Track 5)',
    category: 'Property Valuation',
    audioSnippetText: 'If I remember rightly, it\'s £340,000? - Actually, it\'s £350,000 at the moment, but we can discuss that later if you like.',
    audioText: 'If I remember rightly, it\'s £340,000? - Actually, it\'s £350,000 at the moment, but we can discuss that later if you like.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track5-property-viewing.mp3',
    clipStart: 10,
    clipEnd: 25,
    question: 'Giá niêm yết chính thức hiện tại của ngôi nhà là bao nhiêu?',
    options: [
      { id: 'A', text: '£340,000 (Khách hàng nhớ nhầm ban đầu)' },
      { id: 'B', text: '£350,000 (Giá niêm yết hiện tại môi giới thông báo)' },
      { id: 'C', text: '£345,000' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Khách đưa ra con số ghi nhớ chủ quan (£340,000), môi giới đính chính bằng từ nối "Actually, it\'s £350,000 at the moment".',
    explanation: 'Từ nối đính chính "Actually..." chỉ ra giá bán thực tế hiện tại là £350,000.'
  },
  {
    id: 'ldrill-dist-dim-master-bed',
    type: 'listening-distractor',
    title: 'Bẫy số thập phân tự đính chính (Self-Correction): Kích thước phòng ngủ (Track 5)',
    category: 'Room Dimensions',
    audioSnippetText: 'Here\'s the main bedroom. It\'s 4.91 meters by 3.95 meters. Perfect for a large double bed. Oh sorry, that\'s 4.9 meters long and 3.95 meters wide.',
    audioText: 'Here\'s the main bedroom. It\'s 4.91 meters by 3.95 meters. Perfect for a large double bed. Oh sorry, that\'s 4.9 meters long and 3.95 meters wide.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track5-property-viewing.mp3',
    clipStart: 215,
    clipEnd: 231,
    question: 'Chiều dài đã được đính chính của phòng ngủ chính là bao nhiêu mét?',
    options: [
      { id: 'A', text: '4.91 mét (Số môi giới lỡ miệng đọc nhầm)' },
      { id: 'B', text: '4.9 mét (Số môi giới đính chính lại sau từ "Oh sorry")' },
      { id: 'C', text: '3.95 mét (Chiều rộng của phòng)' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Người nói đọc nhầm 4.91m, sau đó dùng cụm tự sửa "Oh sorry, that\'s 4.9 meters long".',
    explanation: 'Dấu hiệu nhận biết "Oh sorry..." cho biết con số 4.91m bị hủy bỏ và thay thế bằng 4.9m.'
  },
  {
    id: 'ldrill-spell-postcode-ke7',
    type: 'listening-spelling',
    subType: 'spelling',
    title: 'Phản xạ ghi chép mã bưu chính UK Postcode (Track 6)',
    category: 'Postcodes & Addresses',
    promptAudioText: 'The postcode is KE7 8UD.',
    audioText: 'The postcode is KE7 8UD.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track6-offer-and-sale-process.mp3',
    clipStart: 35,
    clipEnd: 42,
    correctAnswer: 'KE7 8UD',
    questionPrompt: 'Current residential postcode: .........',
    questionPromptVi: 'Mã bưu chính nơi ở hiện tại: .........',
    acceptableAnswers: ['KE7 8UD', 'ke7 8ud', 'KE78UD'],
    trapNote: 'Quy tắc Postcode Anh: Gồm 2 phần cách nhau bằng dấu cách, kết hợp chữ và số (ví dụ: KE7 8UD).',
    explanation: 'Mã bưu chính chuẩn là KE7 8UD.'
  },
  {
    id: 'ldrill-dist-motivation-school',
    type: 'listening-distractor',
    title: 'Bẫy ưu tiên hàng đầu (Primary Concern Trap): Lý do muốn dọn vào sớm (Track 6)',
    category: 'Relocation Priorities',
    audioSnippetText: 'It\'s not easy living a long time with relatives, and my husband has a long journey to get to work. But those aren\'t the things I\'m really worried about. If we can move in before the end of the summer, it\'ll be much easier for the children to go to their new school.',
    audioText: 'It\'s not easy living a long time with relatives, and my husband has a long journey to get to work. But those aren\'t the things I\'m really worried about. If we can move in before the end of the summer, it\'ll be much easier for the children to go to their new school.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track6-offer-and-sale-process.mp3',
    clipStart: 185,
    clipEnd: 215,
    question: 'Động lực cốt lõi khiến bà Caroline muốn hoàn tất mua nhà trước khi kết thúc mùa hè là gì?',
    options: [
      { id: 'A', text: 'Chấm dứt việc sống nhờ nhà người thân quá lâu' },
      { id: 'B', text: 'Rút ngắn quãng đường đi làm vất vả của chồng' },
      { id: 'C', text: 'Giúp các con kịp nhập học tại ngôi trường mới thuận lợi' }
    ],
    correctOption: 'C',
    distractorMechanism: 'Người nói liệt kê 2 khó khăn (ở nhờ và chồng đi làm xa) nhưng lập tức phủ nhận ("But those aren\'t the things I\'m really worried about") và nhấn mạnh mục tiêu trường học cho con.',
    explanation: 'Cụm từ tương phản "But those aren\'t the things..." là tín hiệu loại trừ 2 phương án gây nhiễu A và B.'
  },
  {
    id: 'ldrill-dict-ensuite-full',
    type: 'listening-dictation',
    level: 'intermediate',
    title: 'Dictation Cấp 2: Miêu tả chi tiết buồng tắm En-suite (Track 7)',
    category: 'Housing & Home Routines',
    ttsText: 'And there\'s an en-suite bathroom here, though it only has a shower unit, and not a big bath like the main bathroom.',
    audioText: 'And there\'s an en-suite bathroom here, though it only has a shower unit, and not a big bath like the main bathroom.',
    targetTranscript: 'And there\'s an en-suite bathroom here, though it only has a shower unit, and not a big bath like the main bathroom.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track7-ensuite-bathroom-clip.mp3',
    clipStart: 2,
    clipEnd: 10,
    wordCount: 22,
    difficulty: 'Band 6.0 - 7.0',
    audioClipTip: 'Chú ý phát âm nối âm "there\'s an" và liên từ nhượng bộ "though it only has".'
  },
  {
    id: 'ldrill-num-track8-commute',
    type: 'listening-numbers',
    subType: 'numbers',
    title: 'Phản xạ ghi chép thời gian & phương tiện đi lại (Track 8)',
    category: 'Commute & Travel Times',
    promptAudioText: 'Our school is about a 20-minute bus ride from my house.',
    audioText: 'Our house is in the city centre, about 5 minutes\' walk from the train station... and our school is about a 20-minute bus ride from my house.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track8-student-accommodation-and-shopping.mp3',
    clipStart: 28,
    clipEnd: 46,
    correctAnswer: '20 minutes',
    questionPrompt: 'Travel duration to school by bus: .........',
    questionPromptVi: 'Thời gian đi xe buýt đến trường: .........',
    acceptableAnswers: ['20 minutes', '20-minute', '20 mins', '20 min', 'twenty minutes', '20-minute bus ride'],
    trapNote: 'Bẫy số 5 phút: 5 phút là khoảng cách đi bộ ra ga tàu (train station), còn đến trường học là 20 phút bằng xe buýt (20-minute bus ride).',
    explanation: 'Thời gian đi lại từ nhà đến trường là 20 phút bằng xe buýt.'
  },
  {
    id: 'ldrill-dist-track8-market',
    type: 'listening-distractor',
    title: 'Bẫy nhận diện quan điểm: Lý do không đi chợ truyền thống (Track 8)',
    category: 'Consumer & Retail Preferences',
    audioSnippetText: 'the local market is more for older people who just want to go and buy some cheaper food or clothes, and the styles and brands on sale at the market are a bit old-fashioned for me personally.',
    audioText: 'the local market is more for older people who just want to go and buy some cheaper food or clothes, and the styles and brands on sale at the market are a bit old-fashioned for me personally.',
    audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track8-student-accommodation-and-shopping.mp3',
    clipStart: 167,
    clipEnd: 193,
    question: 'Lý do chính khiến người nói không muốn đi mua sắm tại khu chợ truyền thống địa phương là gì?',
    options: [
      { id: 'A', text: 'Đồ ăn và quần áo ở chợ có mức giá quá đắt' },
      { id: 'B', text: 'Các mẫu mã và thương hiệu ở chợ có phần lỗi thời so với bạn ấy' },
      { id: 'C', text: 'Khu chợ nằm cách quá xa bến xe buýt và ga tàu' }
    ],
    correctOption: 'B',
    distractorMechanism: 'Người nói có đề cập chợ bán đồ ăn giá rẻ hơn ("cheaper food or clothes"), nhưng đó là lý do người lớn tuổi thích, còn lý do người nói từ chối là vì mẫu mã lỗi thời ("a bit old-fashioned for me personally").',
    explanation: 'Đáp án chính xác là B. Cần chú ý phân biệt giữa ưu điểm của đối tượng khác (người già thích giá rẻ) và quan điểm cá nhân của người nói (chê lỗi thời).'
  }
];
