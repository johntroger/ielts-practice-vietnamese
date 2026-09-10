/**
 * Curated Dataset of IELTS Listening Micro-Drills
 * 4 Specialized Training Rooms:
 * 1. listening-dictation: Dictation with Color-Coded Feedback (Basic -> Battle-tested -> Academic)
 * 2. listening-spelling: Spelling & Number/Code/Date Reflex Drill
 * 3. listening-distractor: Distractor Trap Buster (Self-correction, condition shifts, misleading numbers)
 * 4. listening-map: Map Direction & Spatial Navigation Trainer
 */

export const LISTENING_MICRO_DRILLS = [
  // ==========================================
  // 1. DICTATION CHÉP CHÍNH TẢ 3 CẤP ĐỘ
  // ==========================================
  {
    id: 'ldrill-dict-1',
    type: 'listening-dictation',
    level: 'basic', // 'basic' | 'intermediate' | 'advanced'
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
    id: 'ldrill-dict-3',
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
    acceptableAnswers: ['75', 'seventy-five', 'seventy five'],
    trapNote: 'Bẫy số 95 (giá chuẩn), 15 (ngày hết hạn), 10 (tiền cọc). Giá vé sớm thực tế là £75.',
    explanation: 'Giá vé đăng ký sớm là 75 bảng (£75).'
  },

  // ==========================================
  // 3. PHÁ BẪY DISTRACTORS (THÔNG TIN THAY ĐỔI)
  // ==========================================
  {
    id: 'ldrill-dist-1',
    type: 'listening-distractor',
    title: 'Bẫy tự đính chính (Self-Correction Trap): Thời gian khởi hành xe buýt',
    category: 'Transport Schedule',
    audioSnippetText: 'We originally scheduled the charter coach for eight fifteen in the morning, but the driver called to say there is heavy roadwork, so we have pushed it back to eight forty-five. Actually, make that nine o\'clock sharp to allow everyone time for breakfast.',
    question: 'At what time will the charter coach actually depart?',
    options: [
      { id: 'A', text: '8:15 AM (Thời gian dự kiến ban đầu)' },
      { id: 'B', text: '8:45 AM (Thời gian điều chỉnh lần 1)' },
      { id: 'C', text: '9:00 AM (Thời gian chốt cuối cùng)' }
    ],
    correctOption: 'C',
    distractorMechanism: 'Người nói đưa ra 3 mốc giờ liên tiếp: 8:15 -> 8:45 -> 9:00 ("Actually, make that nine o\'clock sharp"). Thí sinh vội vàng sẽ ghi ngay đáp án A hoặc B.',
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
  }
];
