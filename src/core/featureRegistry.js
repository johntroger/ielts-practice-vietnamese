/**
 * FEATURE_REGISTRY (Single Source of Truth)
 * Tổng kho siêu dữ liệu tính năng, hướng dẫn & nhật ký cập nhật của IELTS Web Platform.
 * 
 * Kiến trúc tự động hóa:
 * - Khai báo tập trung (Declarative Schema) cho 100% tính năng 4 kỹ năng & công cụ.
 * - Liên kết trực tiếp (1-Click Action Launcher) tới modalStore & router phân hệ.
 * - Tự động đồng bộ với Help Center Modal, Spotlight Search và Changelog Timeline.
 * - Được bảo vệ bằng bộ kiểm thử tự động (tests/test_step25_help_registry.js).
 */

export const SKILL_DEFINITIONS = {
  writing: {
    id: 'writing',
    name: 'Writing',
    label: 'IELTS Writing',
    color: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
    icon: 'PenTool',
    desc: 'Phòng viết chuẩn CDI, chấm điểm AI 4 tiêu chí Cambridge, ma trận ý tưởng, paraphrase & nạp ảnh Task 1.'
  },
  reading: {
    id: 'reading',
    name: 'Reading',
    label: 'IELTS Reading',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
    icon: 'BookOpen',
    desc: 'Phòng thi đọc CDI chia đôi màn hình, tra từ vựng 1 chạm, bẫy True/False/Not Given & chấm điểm tự động.'
  },
  listening: {
    id: 'listening',
    name: 'Listening',
    label: 'IELTS Listening',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    icon: 'Headphones',
    desc: 'Phòng luyện nghe âm thanh phân đoạn, tua đa tốc độ (0.8x-1.5x), transcript bôi đậm đáp án & đếm từ chuẩn.'
  },
  speaking: {
    id: 'speaking',
    name: 'Speaking',
    label: 'IELTS Speaking',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    icon: 'Mic',
    desc: 'Phòng luyện nói chấm kép (⚡ Chấm Máy 0.02ms & 🤖 Chấm AI), phòng thi Giám khảo mô phỏng Cambridge 15 phút.'
  }
};

export const FEATURE_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Danh Mục', icon: 'Compass' },
  { id: 'ai_evaluation', label: 'AI & Chấm Điểm Chuẩn Cambridge', icon: 'Zap' },
  { id: 'practice_tools', label: 'Kho Đề & Công Cụ Luyện Tập', icon: 'Puzzle' },
  { id: 'exam_simulation', label: 'Phòng Thi Thử Chuẩn CDI', icon: 'Clock' },
  { id: 'theory_vocab', label: 'Cẩm Nang & Sổ Tay Từ Vựng', icon: 'BookOpen' },
  { id: 'analytics_profile', label: 'Tiến Độ & Hồ Sơ Cá Nhân', icon: 'Award' },
  { id: 'shortcuts_ux', label: 'Giao Diện & Phím Tắt', icon: 'Smartphone' }
];

export const FEATURE_REGISTRY = [
  // --- NHÓM 1: CÁC TÍNH NĂNG MỚI NHẤT (PHASE 2026 RELEASES) ---
  {
    id: 'feat-speaking-dual-engine',
    version: 'v2.8',
    status: 'new',
    badge: 'Mới Ra Mắt',
    category: 'ai_evaluation',
    targetSkills: ['speaking'],
    title: 'Hệ Thống Chấm Điểm Speaking Kép (⚡ Chấm Máy & 🤖 Chấm AI)',
    shortDesc: 'Tùy chọn linh hoạt giữa chấm bằng máy tính siêu tốc 0.02ms (Cambridge Algorithmic Scorer) và chấm bằng Trí Tuệ Nhân Tạo (Gemini AI).',
    icon: 'Zap',
    shortcut: 'Alt + S',
    updatedAt: '2026-09-24',
    highlights: [
      '⚡ Chấm Máy Thuật Toán Cambridge: Phân tích 4 tiêu chí (Fluency, Lexical Resource, Grammatical Accuracy, Pronunciation) dựa trên WPM, độ đa dạng từ vựng TTR, cấu trúc mệnh đề và âm tiết khó trong 0.02ms.',
      '🤖 Chấm AI Chuyên Sâu: Giám khảo AI nhận xét ngữ pháp theo ngữ cảnh, sửa phát âm từng từ và gợi ý diễn đạt band 8.0+.',
      'Cơ chế tự động chuyển đổi phòng hộ (Resilience Fallback): Tự động dùng Chấm Máy khi không có mạng, hết quota hoặc chưa nhập API Key.',
      'Tùy chỉnh động cơ mặc định trong Cài Đặt (⚙️) và hiển thị huy hiệu phương thức (⚡ Máy / 🤖 AI) trong Lịch Sử Thi.'
    ],
    usageGuide: 'Tại phòng Luyện Speaking hoặc Phòng Thi Giám Khảo, sau khi ghi âm bấm nút "⚡ Chấm Máy (Thuật toán)" để nhận điểm tức thì hoặc "🤖 Chấm AI" để xem phân tích chi tiết.',
    quickAction: {
      type: 'navigate_workspace',
      target: 'speaking',
      label: 'Vào Phòng Luyện Speaking'
    }
  },
  {
    id: 'feat-speaking-mock-examiner',
    version: 'v2.8',
    status: 'new',
    badge: 'Mới Ra Mắt',
    category: 'exam_simulation',
    targetSkills: ['speaking'],
    title: 'Phòng Thi Nói Giám Khảo Mô Phỏng Cambridge (Examiner Room)',
    shortDesc: 'Trải nghiệm thi vấn đáp 1:1 trọn vẹn 3 Parts (11-14 phút) với Giám khảo ảo mô phỏng đúng quy trình thi thực tế của British Council / IDP.',
    icon: 'Mic',
    shortcut: null,
    updatedAt: '2026-09-24',
    highlights: [
      'Part 1: Phỏng vấn 4-5 câu hỏi giới thiệu và sở thích cá nhân, tính giờ phản xạ tự nhiên.',
      'Part 2: Phát thẻ đề (Cue Card), đồng hồ 1 phút chuẩn bị tự động kèm giấy nháp ảo (Notepad) và 2 phút ghi âm liên tục.',
      'Part 3: Thảo luận chuyên sâu 4-5 câu hỏi trừu tượng mang tính học thuật cao.',
      'Nút "Kết Thúc Sớm & Xem Điểm" linh hoạt khi cần nộp bài sớm để chấm điểm tức thì.'
    ],
    usageGuide: 'Vào phân hệ "Speaking" -> Bấm tab "🎓 Phòng Thi Giám Khảo" -> Chọn bộ đề thi mẫu và bấm "Bắt Đầu Thi Thử".',
    quickAction: {
      type: 'navigate_workspace',
      target: 'speaking',
      label: 'Vào Phòng Thi Giám Khảo'
    }
  },
  {
    id: 'feat-mastered-4skills',
    version: 'v2.7',
    status: 'updated',
    badge: 'Nâng Cấp',
    category: 'analytics_profile',
    targetSkills: ['writing', 'reading', 'speaking', 'listening'],
    title: 'Hệ Thống Đánh Dấu "Đã Thuộc" (Mastered) Cả 4 Kỹ Năng',
    shortDesc: 'Đánh dấu các đề bài, chủ đề, cue card đã thuần thục để lọc bớt và tập trung thời gian cho những dạng bài còn yếu.',
    icon: 'Award',
    shortcut: null,
    updatedAt: '2026-09-23',
    highlights: [
      'Phủ sóng 4 kỹ năng: Đánh dấu đề Writing, bài đọc Reading, bài nghe Listening và các chủ đề Part 1/2/3 Speaking.',
      'Bộ lọc "Ẩn Đề Đã Thuộc": Giúp danh sách đề luôn tinh gọn, chỉ hiển thị bài chưa làm hoặc cần ôn tập lại.',
      'Tổng hợp tại Trang Cá Nhân (User Profile): Tab "Kho Đã Thuộc" hiển thị chi tiết số lượng và danh mục đề đã master theo từng kỹ năng.',
      'Hỗ trợ chế độ Khách (Guest Mode): Lưu an toàn trên thiết bị và tự động đồng bộ lên Đám Mây khi đăng nhập tài khoản.'
    ],
    usageGuide: 'Nhấn nút "Đã Thuộc" hình chiếc mũ cử nhân (🎓) trên thanh công cụ của đề bài hoặc trong Thư viện đề.',
    quickAction: {
      type: 'open_modal',
      target: 'profile',
      label: 'Xem Đề Đã Thuộc'
    }
  },
  {
    id: 'feat-band-55-60-expansion',
    version: 'v2.6',
    status: 'updated',
    badge: 'Học Thuật',
    category: 'practice_tools',
    targetSkills: ['writing', 'reading', 'speaking'],
    title: 'Mở Rộng Phân Tầng Trình Độ: Dải Điểm Band 5.5 - 6.0',
    shortDesc: 'Hệ sinh thái luyện tập toàn diện cho dải điểm 5.5 - 6.0 giúp học viên xây nền tảng vững chắc và bứt phá lên 6.5+.',
    icon: 'Target',
    shortcut: null,
    updatedAt: '2026-09-22',
    highlights: [
      'Phân loại 4 dải điểm rõ ràng: Toàn bộ (5.5 - 7.5+), Band 5.5-6.0 (Nền tảng), Band 6.0-6.5 (Cốt lõi) và Band 7.0-7.5 (Bứt phá).',
      'Huy hiệu Học thuật mới: Tích hợp thứ hạng "IELTS Foundation Builder (Band 5.5 - 6.0)" tại Trang Cá Nhân.',
      'Bộ bài tập chống mất điểm sơ đẳng: Luyện chính tả hay sai (until, convenient, technology) và cấu trúc câu chống lỗi comma splice.',
      'Sinh đề AI thông minh theo dải điểm: Hỗ trợ sinh từ vựng và ngữ pháp trọng tâm theo đúng mức điểm mong muốn.'
    ],
    usageGuide: 'Mở "Vocab & Lỗi Sai" -> Chọn tab "📗 Band 5.5 - 6.0" hoặc mở "Cẩm Nang Lý Thuyết" để đọc chuyên đề xóa 5 lỗi chí mạng.',
    quickAction: {
      type: 'open_modal',
      target: 'vocabGrammar',
      label: 'Mở Sổ Tay Band 5.5 - 6.0'
    }
  },
  {
    id: 'feat-task1-image-upload',
    version: 'v2.5',
    status: 'hot',
    badge: 'Hot',
    category: 'practice_tools',
    targetSkills: ['writing'],
    title: 'Tải Lên & Dán Trực Tiếp Ảnh Biểu Đồ Writing Task 1 (Ctrl + V)',
    shortDesc: 'Dán trực tiếp ảnh chụp màn hình biểu đồ, bản đồ, quy trình (Win+Shift+S -> Ctrl+V) để giám khảo AI chấm điểm đối chiếu số liệu.',
    icon: 'Image',
    shortcut: 'Ctrl + V',
    updatedAt: '2026-09-20',
    highlights: [
      'Dán ảnh 1 chạm (Ctrl + V): Không cần lưu ảnh ra file máy tính, chụp màn hình là dán được ngay.',
      'Tự động nén thông minh: Tối ưu dung lượng hình ảnh giữ nét cao, lưu trữ bền vững trên Supabase Storage & IndexedDB.',
      'Chế độ soi ảnh chi tiết (Zoom Modal): Phóng to số liệu để người viết dễ quan sát xu hướng khi đang gõ bài.',
      'Gemini Vision AI: Giám khảo AI trực quan đọc biểu đồ để chấm Task Achievement cực kỳ chuẩn xác.'
    ],
    usageGuide: 'Vào "Kho Đề Thi" -> Bấm "Nạp Đề Cá Nhân Mới (Task 1)" -> Dán ảnh (Ctrl+V) vào khung tải ảnh đề bài.',
    quickAction: {
      type: 'open_modal',
      target: 'library',
      label: 'Mở Kho Đề Nạp Ảnh'
    }
  },

  // --- NHÓM 2: 4 WORKSPACE PHÒNG THI CHUẨN CDI (COMPUTER-DELIVERED IELTS) ---
  {
    id: 'feat-writing-cdi-workspace',
    version: 'v2.4',
    status: 'core',
    badge: 'Cốt Lõi',
    category: 'exam_simulation',
    targetSkills: ['writing'],
    title: 'Phòng Viết Chuẩn Cambridge CDI & Chế Độ Tập Trung (Focus Mode)',
    shortDesc: 'Không gian soạn thảo mô phỏng 100% giao diện thi máy tính thực tế của IDP/BC với bộ đếm từ tự động và phím tắt thi thật.',
    icon: 'PenTool',
    shortcut: 'Alt + F',
    updatedAt: '2026-09-15',
    highlights: [
      'Giao diện chia đôi màn hình chuẩn CDI: Cột đề bài bên trái, trình soạn thảo chuẩn hóa bên phải.',
      'Chế độ Focus Mode (Alt + F): Ẩn toàn bộ thanh điều hướng để tập trung 100% tinh thần cho bài viết.',
      'Chống gian lận & mất chữ tự động (Auto-Save): Tự động lưu bản nháp mỗi 5 giây vào LocalStorage.',
      'Bộ đếm từ thời gian thực: Tự động cảnh báo khi dưới 150 từ (Task 1) hoặc dưới 250 từ (Task 2).'
    ],
    usageGuide: 'Chuyển sang tab "Writing" trên thanh Navbar. Nhấn Alt + F để bật/tắt chế độ toàn màn hình tập trung.',
    quickAction: {
      type: 'navigate_workspace',
      target: 'writing',
      label: 'Vào Phòng Luyện Writing'
    }
  },
  {
    id: 'feat-reading-cdi-workspace',
    version: 'v2.4',
    status: 'core',
    badge: 'Cốt Lõi',
    category: 'exam_simulation',
    targetSkills: ['reading'],
    title: 'Phòng Thi Đọc CDI Trực Quan: Tra Từ & Phá Bẫy Distractor',
    shortDesc: 'Luyện đọc 3 Passages với tính năng Highlight từ vựng, tra nghĩa tức thì, hỗ trợ cả 2 hệ Academic (AC) và General Training (GT).',
    icon: 'BookOpen',
    shortcut: null,
    updatedAt: '2026-09-15',
    highlights: [
      'Chia đôi bài đọc và câu hỏi độc lập: Cuộn mượt mà không bị trôi bài đọc.',
      'Hỗ trợ đầy đủ dạng câu hỏi: True/False/Not Given, Yes/No/Not Given, Matching Headings, Multiple Choice, Summary Completion.',
      'Chấm điểm tự động và giải thích chi tiết: Giải phẫu vị trí bẫy gây nhiễu (Distractor Traps) trong bài đọc.',
      'Bảng quy đổi Band điểm Cambridge chuẩn xác cho cả Academic và General Training.'
    ],
    usageGuide: 'Chọn kỹ năng "Reading" trên Navbar -> Chọn đề bài từ Thư viện và bấm "Bắt Đầu Làm Bài".',
    quickAction: {
      type: 'navigate_workspace',
      target: 'reading',
      label: 'Vào Phòng Luyện Reading'
    }
  },
  {
    id: 'feat-listening-cdi-workspace',
    version: 'v2.4',
    status: 'core',
    badge: 'Cốt Lõi',
    category: 'exam_simulation',
    targetSkills: ['listening'],
    title: 'Phòng Luyện Nghe Đa Tốc Độ & Audioscript Phân Đoạn Thông Minh',
    shortDesc: 'Mô phỏng 4 Sections đề nghe IELTS với trình phát audio chống giật, tua chậm 0.8x-1.5x và audioscript định vị đáp án.',
    icon: 'Headphones',
    shortcut: 'Space (Play/Pause)',
    updatedAt: '2026-09-15',
    highlights: [
      'Công nghệ Audio Chunking: Tải nhanh âm thanh mượt mà không bị cắt tiếng trên mọi đường truyền mạng.',
      'Kiểm soát tốc độ (0.8x - 1.5x): Hỗ trợ luyện nghe từ cơ bản đến nâng cao phản xạ tốc độ cao.',
      'Chấm điểm từ ngữ nghiêm ngặt: Kiểm tra chặt chẽ giới hạn số từ (Word Limit) và chính tả số nhiều/số ít.',
      'Audioscript đối soát: Sau khi nộp bài, xem lại vị trí phát âm đáp án trong bài nghe.'
    ],
    usageGuide: 'Chọn kỹ năng "Listening" trên Navbar -> Chọn bài nghe và nhấn phím Space để bật/tắt audio.',
    quickAction: {
      type: 'navigate_workspace',
      target: 'listening',
      label: 'Vào Phòng Luyện Listening'
    }
  },

  // --- NHÓM 3: CÔNG CỤ TRỢ THỦ AI & KHO BÀI TẬP BỔ TRỢ ---
  {
    id: 'feat-ai-task2-grading',
    version: 'v2.3',
    status: 'core',
    badge: 'Cambridge 4 Tiêu Chí',
    category: 'ai_evaluation',
    targetSkills: ['writing'],
    title: 'Giám Khảo AI Chấm Điểm Writing 4 Tiêu Chí Kèm Radar Chart',
    shortDesc: 'Chấm điểm chi tiết Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy kèm bài viết mẫu nâng cấp Band 8.5+.',
    icon: 'Award',
    shortcut: 'Ctrl + Enter',
    updatedAt: '2026-09-10',
    highlights: [
      'Biểu đồ mạng nhện (Radar Chart): Trực quan hóa điểm số từng tiêu chí giúp nhận ra ngay điểm nghẽn.',
      'Sửa lỗi từng câu (Inline Corrections): Đối chiếu câu gốc và câu sửa chuẩn học thuật kèm giải thích lỗi sai.',
      'Bài mẫu Band 8.5+ nâng cấp từ ý của bạn: Giúp học collocations đắt giá từ chính bài làm của mình.',
      'Xuất báo cáo kết quả: In hoặc tải file Word (.docx) kết quả chấm điểm chuyên nghiệp.'
    ],
    usageGuide: 'Sau khi viết xong bài trong phòng Writing, nhấn nút "Nộp Bài & Chấm Điểm AI" hoặc nhấn Ctrl + Enter.',
    quickAction: {
      type: 'navigate_workspace',
      target: 'writing',
      label: 'Thử Chấm Điểm Writing'
    }
  },
  {
    id: 'feat-ai-generator-pro',
    version: 'v2.2',
    status: 'hot',
    badge: 'AI Pro',
    category: 'practice_tools',
    targetSkills: ['writing', 'reading', 'speaking'],
    title: 'Trình Sinh Đề & Bài Mẫu AI (AI Prompt & Task Generator)',
    shortDesc: 'Sinh không giới hạn đề thi mới bám sát xu hướng ra đề thực tế theo chủ đề tùy chọn (Technology, Environment, Education...).',
    icon: 'Sparkles',
    shortcut: null,
    updatedAt: '2026-09-08',
    highlights: [
      'Sinh đề chuẩn Cambridge: Tùy chỉnh chủ đề, dạng bài (Opinion, Discussion, Process, Map, Cue Cards...).',
      'Sinh kèm bài mẫu Band 8.0+: Đi kèm dàn ý chi tiết và danh sách từ vựng C1-C2 then chốt.',
      'Đóng góp vào cộng đồng: Tùy chọn chia sẻ đề bạn vừa sinh lên Thư Viện Chung chỉ với 1 click.'
    ],
    usageGuide: 'Bấm nút "Sinh Đề (AI)" trên thanh điều hướng hoặc trong Menu Công Cụ để tạo đề thi mới.',
    quickAction: {
      type: 'open_modal',
      target: 'generator',
      label: 'Sinh Đề Mới Bằng AI'
    }
  },
  {
    id: 'feat-idea-matrix',
    version: 'v2.1',
    status: 'stable',
    badge: 'Tư Duy',
    category: 'practice_tools',
    targetSkills: ['writing', 'speaking'],
    title: 'Ma Trận Phát Triển Ý Tưởng (Idea Matrix & Critical Thinking)',
    shortDesc: 'Kho ngân hàng ý tưởng phân loại theo 12 chủ đề lớn giúp xóa bỏ hoàn toàn tình trạng bí ý tưởng khi gặp đề khó.',
    icon: 'Layers',
    shortcut: null,
    updatedAt: '2026-09-05',
    highlights: [
      'Ngân hàng ý tưởng song ngữ: Bao gồm luận điểm thuận, luận điểm chống và ví dụ thực tế minh họa.',
      'Phát triển theo cấu trúc P.E.E.L (Point - Explanation - Example - Link): Tối ưu cho cả Task 2 và Speaking Part 3.',
      'Tìm kiếm ý tưởng nhanh theo từ khóa đề thi.'
    ],
    usageGuide: 'Bấm nút "Ma Trận Ý" trên thanh điều hướng hoặc trong Menu Luyện Tập khi cần gợi ý ý tưởng.',
    quickAction: {
      type: 'open_modal',
      target: 'ideaMatrix',
      label: 'Mở Ma Trận Ý Tưởng'
    }
  },
  {
    id: 'feat-paraphrase-helper',
    version: 'v2.1',
    status: 'stable',
    badge: 'Từ Vựng',
    category: 'practice_tools',
    targetSkills: ['writing', 'speaking', 'reading'],
    title: 'Trợ Thủ Paraphrase Học Thuật C1-C2 (Academic Rewriter)',
    shortDesc: 'Công cụ biến đổi câu văn đa phong cách, gợi ý các cụm từ đồng nghĩa học thuật và cấu trúc câu đảo ngữ nâng band.',
    icon: 'PenTool',
    shortcut: null,
    updatedAt: '2026-09-05',
    highlights: [
      'Gợi ý 3 cấp độ diễn đạt: Tự nhiên (Natural), Học thuật chuẩn (Academic 7.0), Bứt phá chuyên sâu (Advanced 8.0+).',
      'Phân tích ngữ pháp: Giải thích sự thay đổi thì và cấu trúc ngữ pháp giữa câu gốc và câu mới.',
      'Chấm điểm mức độ tương đương ngữ nghĩa để bảo đảm không bị đổi nghĩa gốc của đề.'
    ],
    usageGuide: 'Nhấn vào "Trợ Thủ Paraphrase" trong Menu Công Cụ hoặc bấm vào biểu tượng bút viết trên thanh Sub-header.',
    quickAction: {
      type: 'open_modal',
      target: 'paraphrase',
      label: 'Mở Trợ Thủ Paraphrase'
    }
  },
  {
    id: 'feat-micro-drills-studio',
    version: 'v2.0',
    status: 'stable',
    badge: 'Bài Tập Nhanh',
    category: 'practice_tools',
    targetSkills: ['writing', 'reading', 'speaking', 'listening'],
    title: 'Phòng Luyện Phản Xạ Vi Mô (Micro-Drills Studio)',
    shortDesc: 'Tập hợp các bài tập ngắn 3-5 phút: Phá bẫy True/False/Not Given, Collocation C1-C2, Săn từ nối và Ghép câu phức.',
    icon: 'Puzzle',
    shortcut: null,
    updatedAt: '2026-09-01',
    highlights: [
      'Phòng luyện 4 kỹ năng: Phân loại theo mục tiêu cải thiện cụ thể.',
      'Phản hồi tức thì: Biết ngay đáp án đúng/sai kèm giải thích cặn kẽ sau mỗi câu làm.',
      'Học ngắt nhịp câu dài (Chunking): Rèn luyện tư duy nhận diện chủ ngữ - vị ngữ - bổ ngữ phức tạp.'
    ],
    usageGuide: 'Bấm nút "Phòng Luyện" trên Navbar -> Chọn dạng bài tập bạn muốn làm nhanh trong vài phút.',
    quickAction: {
      type: 'open_modal',
      target: 'drills',
      label: 'Vào Phòng Luyện Micro-Drills'
    }
  },
  {
    id: 'feat-mock-test-vault',
    version: 'v2.0',
    status: 'core',
    badge: 'Thực Chiến',
    category: 'exam_simulation',
    targetSkills: ['writing', 'reading', 'listening', 'speaking'],
    title: 'Phòng Thi Thử Áp Lực Cao (Mock Test Vault) 60 Phút & Đại Thi Thử',
    shortDesc: 'Mô phỏng áp lực phòng thi thật với đồng hồ đếm ngược liên tục, khóa gợi ý và cấp bảng điểm tổng thể chuẩn Cambridge.',
    icon: 'Clock',
    shortcut: null,
    updatedAt: '2026-09-01',
    highlights: [
      'Thi Thử Writing 60 Phút: Làm bài liên hoàn Task 1 & Task 2 trong điều kiện thời gian ngặt nghèo.',
      'Thi Thử Reading 60 Phút: Đọc trọn vẹn 3 Passages (40 câu), hỗ trợ bốc đề ngẫu nhiên hoặc chọn bộ đề Cambridge.',
      'Đại Thi Thử 4 Kỹ Năng (All-In-One Grand Mock ~2h45p): Dự đoán Bảng Điểm Tổng TRF ước tính.'
    ],
    usageGuide: 'Vào Menu Luyện Tập -> Bấm "Thi Thử 60 Phút" để chọn phân hệ thi mong muốn.',
    quickAction: {
      type: 'open_modal',
      target: 'mockTest',
      label: 'Mở Phòng Thi Thử'
    }
  },

  // --- NHÓM 4: CẨM NANG, LỖI SAI & TÀI LIỆU HỌC TẬP ---
  {
    id: 'feat-theory-compendium',
    version: 'v2.0',
    status: 'stable',
    badge: 'Lý Thuyết',
    category: 'theory_vocab',
    targetSkills: ['writing', 'reading'],
    title: 'Cẩm Nang Lý Thuyết & Chiến Thuật 7 Dạng Task 1 + 5 Dạng Task 2',
    shortDesc: 'Trọn bộ cẩm nang chiến thuật bứt phá điểm số, bộ khung dàn ý chuẩn mực và sổ tay ghi chú cá nhân.',
    icon: 'BookOpen',
    shortcut: null,
    updatedAt: '2026-08-25',
    highlights: [
      'Đầy đủ 7 dạng Task 1: Line, Bar, Pie, Table, Mixed, Process và Map Comparison.',
      'Chiến lược 5 dạng Task 2: Opinion, Discussion, Advantages/Disadvantages, Causes/Solutions, Two-Part.',
      'Sổ tay ghi chú cá nhân (Personal Notes): Cho phép bạn ghi lại mẹo học tập của riêng mình ngay trong cẩm nang.'
    ],
    usageGuide: 'Bấm nút "Lý Thuyết" trên thanh điều hướng hoặc trong Menu Hamburger.',
    quickAction: {
      type: 'open_modal',
      target: 'theory',
      label: 'Mở Cẩm Nang Lý Thuyết'
    }
  },
  {
    id: 'feat-vocab-grammar-bank',
    version: 'v2.0',
    status: 'stable',
    badge: 'Từ Vựng & Ngữ Pháp',
    category: 'theory_vocab',
    targetSkills: ['writing', 'speaking'],
    title: 'Sổ Tay Từ Vựng Học Thuật & Ngữ Pháp Cốt Lõi (Spaced Repetition)',
    shortDesc: 'Kho từ vựng C1-C2 phân theo chủ đề và hệ thống lặp lại ngắt quãng (SM-2 SRS) giúp ghi nhớ từ vựng vĩnh viễn.',
    icon: 'BookOpen',
    shortcut: null,
    updatedAt: '2026-08-25',
    highlights: [
      'Phân chia từ vựng theo dải điểm: Band 5.5-6.0, 6.0-6.5 và 7.0-7.5+.',
      'Thẻ ghi nhớ Flashcards & Collocation Tester: Ôn tập từ vựng chủ động.',
      'Luyện tập theo thuật toán SM-2: Tự động nhắc nhở từ vựng sắp quên.'
    ],
    usageGuide: 'Mở "Vocab & Lỗi Sai" trên thanh điều hướng để tra cứu hoặc ôn tập flashcards.',
    quickAction: {
      type: 'open_modal',
      target: 'vocabGrammar',
      label: 'Mở Sổ Tay Vocab & Ngữ Pháp'
    }
  },
  {
    id: 'feat-mistake-logbook',
    version: 'v2.0',
    status: 'stable',
    badge: 'Khắc Phục Lỗi',
    category: 'theory_vocab',
    targetSkills: ['writing', 'speaking'],
    title: 'Nhật Ký Lỗi Sai Tự Động (Mistake Log & Anti-Pattern Tracker)',
    shortDesc: 'Tự động ghi nhận và gom nhóm các lỗi ngữ pháp, chính tả bạn đã từng mắc phải từ các bài nộp chấm điểm.',
    icon: 'ShieldCheck',
    shortcut: null,
    updatedAt: '2026-08-25',
    highlights: [
      'Gom nhóm lỗi thông minh: Lỗi mạo từ (a/an/the), hòa hợp chủ vị, thì động từ, dấu câu.',
      'Thống kê tần suất mắc lỗi: Giúp học viên nhận biết điểm yếu cố hữu để khắc phục trước kỳ thi thật.'
    ],
    usageGuide: 'Vào Menu Luyện Tập -> Bấm "Nhật Ký Lỗi Sai" để xem danh sách lỗi đã lưu.',
    quickAction: {
      type: 'open_modal',
      target: 'mistakeLog',
      label: 'Mở Nhật Ký Lỗi Sai'
    }
  },
  {
    id: 'feat-diagnostic-test',
    version: 'v2.0',
    status: 'stable',
    badge: 'Đánh Giá Đầu Vào',
    category: 'analytics_profile',
    targetSkills: ['writing', 'reading', 'listening', 'speaking'],
    title: 'Bài Test Chẩn Đoán Trình Độ & Đề Xuất Lộ Trình (Diagnostic Placement)',
    shortDesc: 'Bài kiểm tra ngắn xác định chính xác trình độ hiện tại của bạn và đề xuất kế hoạch học tập tối ưu hóa thời gian.',
    icon: 'Target',
    shortcut: null,
    updatedAt: '2026-08-20',
    highlights: [
      'Chẩn đoán năng lực 4 kỹ năng chỉ trong 15-20 phút.',
      'Dự báo dải điểm hiện tại (Current Band) và khoảng cách tới mục tiêu (Target Band).'
    ],
    usageGuide: 'Bấm vào avatar cá nhân -> Chọn "Làm Bài Test Phân Lớp Đầu Vào".',
    quickAction: {
      type: 'open_modal',
      target: 'diagnostic',
      label: 'Làm Bài Test Phân Lớp'
    }
  },
  {
    id: 'feat-weekly-progress-report',
    version: 'v2.0',
    status: 'stable',
    badge: 'Phân Tích',
    category: 'analytics_profile',
    targetSkills: ['writing', 'reading', 'listening', 'speaking'],
    title: 'Báo Cáo Tiến Độ Học Tập Hàng Tuần (Weekly Analytics Report)',
    shortDesc: 'Tổng kết thời lượng học, số lượng đề đã luyện, biểu đồ biến thiên điểm số và chuỗi ngày học liên tục (Streak).',
    icon: 'BarChart3',
    shortcut: null,
    updatedAt: '2026-08-20',
    highlights: [
      'Biểu đồ tiến độ trực quan: So sánh năng suất giữa các tuần học.',
      'Theo dõi chuỗi Streak: Giữ vững động lực học tập mỗi ngày.',
      'Khuyến nghị trọng tâm cho tuần mới dựa trên kỹ năng còn thấp điểm nhất.'
    ],
    usageGuide: 'Bấm nút "Tiến Độ" trên thanh điều hướng để xem báo cáo học tập tuần này.',
    quickAction: {
      type: 'open_modal',
      target: 'weeklyReport',
      label: 'Xem Báo Cáo Tuần'
    }
  },

  // --- NHÓM 5: HỆ THỐNG, BẢO MẬT & PHÍM TẮT ---
  {
    id: 'feat-byok-security',
    version: 'v2.2',
    status: 'core',
    badge: 'Bảo Mật',
    category: 'shortcuts_ux',
    targetSkills: ['writing', 'speaking'],
    title: 'Mô Hình BYOK (Bring Your Own Key) & Quản Lý Đa Mô Hình AI',
    shortDesc: 'Sử dụng API Key cá nhân miễn phí từ Google AI Studio. Hỗ trợ đa mô hình (Gemini 2.5 Flash, 2.5 Pro, 3.6 Flash) và lưu an toàn trên máy.',
    icon: 'ShieldCheck',
    shortcut: null,
    updatedAt: '2026-08-15',
    highlights: [
      'Bảo mật 100% Client-Side: Key chỉ lưu trong trình duyệt của bạn, không gửi qua bất kỳ máy chủ trung gian nào.',
      'Công cụ Kiểm Tra Key (Test Key): Kiểm tra key còn hoạt động và đo tốc độ phản hồi chỉ với 1 click.',
      'Hỗ trợ chế độ Chấm Máy ngoại tuyến: Vẫn học tốt ngay cả khi chưa có Key.'
    ],
    usageGuide: 'Bấm vào nút "API Key" hoặc "Cài Đặt (⚙️)" trên Navbar -> Dán key và bấm "Lưu Cài Đặt".',
    quickAction: {
      type: 'open_modal',
      target: 'settings',
      label: 'Mở Cài Đặt API Key'
    }
  },
  {
    id: 'feat-keyboard-shortcuts-hub',
    version: 'v2.5',
    status: 'stable',
    badge: 'Phím Tắt',
    category: 'shortcuts_ux',
    targetSkills: ['writing', 'reading', 'speaking', 'listening'],
    title: 'Hệ Thống Phím Tắt Toàn Cục Tối Ưu Tốc Độ Thao Tác',
    shortDesc: 'Thao tác cực nhanh không cần chuột: Mở trợ giúp (F1), chế độ tập trung (Alt+F), nộp bài (Ctrl+Enter) và phát âm (Space).',
    icon: 'Keyboard',
    shortcut: 'F1 / Alt + H',
    updatedAt: '2026-09-24',
    highlights: [
      'F1 hoặc Alt + H: Mở ngay Trung Tâm Trợ Giúp & Hướng Dẫn Tính Năng này.',
      'Alt + F: Bật/tắt chế độ viết toàn màn hình (Focus Mode).',
      'Ctrl + Enter: Nộp bài và kích hoạt chấm điểm tức thì.',
      'Space: Tạm dừng / tiếp tục phát audio trong phòng luyện nghe.',
      'Ctrl + V: Dán ảnh đề bài trực tiếp cho Task 1.'
    ],
    usageGuide: 'Nhấn F1 tại bất kỳ đâu để xem danh sách phím tắt đầy đủ.',
    quickAction: {
      type: 'open_modal',
      target: 'featuresGuide',
      label: 'Xem Danh Sách Phím Tắt'
    }
  },
  {
    id: 'feat-supabase-cloud-account',
    version: 'v2.0',
    status: 'stable',
    badge: 'Đám Mây',
    category: 'analytics_profile',
    targetSkills: ['writing', 'reading', 'listening', 'speaking'],
    title: 'Tài Khoản Đa Nền Tảng & Đồng Bộ Đám Mây (Supabase Auth)',
    shortDesc: 'Đăng nhập 1-click bằng Google hoặc Email. Tự động đồng bộ lịch sử bài thi, đề tự tạo và từ vựng trên mọi thiết bị.',
    icon: 'Cloud',
    shortcut: null,
    updatedAt: '2026-08-10',
    highlights: [
      'Google 1-Click Login: Tiện lợi, bảo mật cấp doanh nghiệp.',
      'Bảo mật cấp dòng (Row Level Security): Dữ liệu bài làm của bạn được bảo vệ tuyệt đối.',
      'Đồng bộ tức thì: Viết bài trên máy tính và mở lại trên điện thoại dễ dàng.'
    ],
    usageGuide: 'Bấm nút "Tài Khoản" trên thanh điều hướng để đăng nhập.',
    quickAction: {
      type: 'open_modal',
      target: 'auth',
      label: 'Đăng Nhập / Đăng Ký'
    }
  },
  {
    id: 'feat-user-profile-center',
    version: 'v2.7',
    status: 'updated',
    badge: 'Hồ Sơ',
    category: 'analytics_profile',
    targetSkills: ['writing', 'reading', 'listening', 'speaking'],
    title: 'Trung Tâm Hồ Sơ Cá Nhân & Danh Hiệu Học Thuật (User Profile)',
    shortDesc: 'Quản lý thông tin học tập, bảng xếp hạng thứ hạng Cambridge, kho đề đã master và lịch sử điểm số tổng thể.',
    icon: 'Award',
    shortcut: null,
    updatedAt: '2026-09-23',
    highlights: [
      'Thứ hạng học thuật động: Từ "IELTS Foundation Builder" đến "Cambridge Grandmaster".',
      'Kho Đã Thuộc 4 kỹ năng: Xem tổng hợp số đề đã thành thạo.',
      'Lịch sử bài thi chi tiết kèm bảng tiêu chí chấm điểm.'
    ],
    usageGuide: 'Bấm vào ảnh đại diện hoặc tên tài khoản ở góc trên bên phải thanh Navbar.',
    quickAction: {
      type: 'open_modal',
      target: 'profile',
      label: 'Mở Trang Cá Nhân'
    }
  },
  {
    id: 'feat-notebook-notes',
    version: 'v2.0',
    status: 'stable',
    badge: 'Ghi Chú',
    category: 'theory_vocab',
    targetSkills: ['writing', 'speaking'],
    title: 'Sổ Tay Ghi Chú Cá Nhân Thông Minh (Academic Notebook)',
    shortDesc: 'Không gian ghi lại chiến thuật, dàn ý yêu thích và những lưu ý của giáo viên trong suốt quá trình ôn luyện.',
    icon: 'BookOpen',
    shortcut: null,
    updatedAt: '2026-08-15',
    highlights: [
      'Ghi chép nhanh không cần rời phòng luyện thi.',
      'Phân loại ghi chú theo từng dạng bài và từng kỹ năng.'
    ],
    usageGuide: 'Vào Menu Luyện Tập -> Bấm "Sổ Tay Ghi Chú" để mở sổ tay cá nhân.',
    quickAction: {
      type: 'open_modal',
      target: 'notebook',
      label: 'Mở Sổ Tay Ghi Chú'
    }
  },
  {
    id: 'feat-revision-spaced-repetition',
    version: 'v2.2',
    status: 'stable',
    badge: 'Ôn Tập',
    category: 'theory_vocab',
    targetSkills: ['writing', 'reading'],
    title: 'Không Gian Ôn Tập Bài Viết Cũ (Smart Revision & Rewrite Studio)',
    shortDesc: 'Viết lại các bài thi cũ theo gợi ý của AI để đo lường mức độ tiến bộ từ Band 6.0 lên Band 7.5+.',
    icon: 'Layers',
    shortcut: null,
    updatedAt: '2026-08-30',
    highlights: [
      'So sánh trực quan bài viết lần 1 và bài viết viết lại lần 2.',
      'Đo lường tiến bộ chỉ số từ vựng học thuật và độ chính xác ngữ pháp.'
    ],
    usageGuide: 'Trong Lịch Sử Bài Thi -> Bấm vào bài cũ và chọn "Viết Lại Bài Này (Rewrite)".',
    quickAction: {
      type: 'open_modal',
      target: 'revision',
      label: 'Mở Không Gian Ôn Tập'
    }
  },
  {
    id: 'feat-raw-task-ingest',
    version: 'v2.3',
    status: 'stable',
    badge: 'Nạp Đề Nhanh',
    category: 'practice_tools',
    targetSkills: ['writing', 'reading'],
    title: 'Công Cụ Nạp Đề & Bài Mẫu Thô Hàng Loạt (Raw Task Ingest)',
    shortDesc: 'Dán trực tiếp văn bản đề thi hoặc bài mẫu từ tài liệu PDF/Word để hệ thống tự động bóc tách cấu trúc và nạp vào thư viện.',
    icon: 'FileText',
    shortcut: null,
    updatedAt: '2026-09-02',
    highlights: [
      'Tự động phân tích dạng bài: Tách riêng đề bài, biểu đồ, câu hỏi và bài mẫu.',
      'Tiết kiệm 90% thời gian tạo đề so với việc nhập liệu thủ công.'
    ],
    usageGuide: 'Mở Menu Công Cụ -> Chọn "Nạp Đề & Bài Mẫu Thô" -> Dán nội dung và bấm "Bóc Tách Tự Động".',
    quickAction: {
      type: 'open_modal',
      target: 'ingest',
      label: 'Mở Công Cụ Nạp Đề Thô'
    }
  },
  {
    id: 'feat-history-evaluation-vault',
    version: 'v2.8',
    status: 'updated',
    badge: 'Lịch Sử',
    category: 'analytics_profile',
    targetSkills: ['writing', 'speaking', 'reading', 'listening'],
    title: 'Kho Lưu Trữ & Tra Cứu Lịch Sử Bài Làm Đa Kỹ Năng',
    shortDesc: 'Xem lại toàn bộ bài viết, đoạn ghi âm nói, bảng điểm 4 tiêu chí và bộ lọc theo phương thức chấm (⚡ Máy / 🤖 AI).',
    icon: 'Clock',
    shortcut: null,
    updatedAt: '2026-09-24',
    highlights: [
      'Lưu trữ toàn diện bài làm của cả 4 kỹ năng kèm thời gian chi tiết.',
      'Huy hiệu phân loại phương thức chấm Speaking (⚡ Chấm Máy / 🤖 Chấm AI) giúp dễ dàng đối chiếu.',
      'Xuất bản và in ấn lại bài chấm bất kỳ lúc nào.'
    ],
    usageGuide: 'Bấm vào nút "Lịch Sử" trên thanh điều hướng hoặc trong Menu Cá Nhân.',
    quickAction: {
      type: 'open_modal',
      target: 'history',
      label: 'Xem Lịch Sử Bài Làm'
    }
  },
  {
    id: 'feat-user-feedback-support',
    version: 'v2.0',
    status: 'stable',
    badge: 'Hỗ Trợ',
    category: 'shortcuts_ux',
    targetSkills: ['writing', 'reading', 'speaking', 'listening'],
    title: 'Kênh Góp Ý Tính Năng & Hỗ Trợ Kỹ Thuật Trực Tiếp',
    shortDesc: 'Gửi phản hồi đóng góp phát triển tính năng, báo cáo lỗi hoặc liên hệ với ban cố vấn học thuật IELTS Studio.',
    icon: 'Compass',
    shortcut: null,
    updatedAt: '2026-08-01',
    highlights: [
      'Gửi phản hồi nhanh chỉ trong 30 giây.',
      'Đính kèm thông tin chẩn đoán kỹ thuật để đội ngũ xử lý lỗi ngay lập tức.'
    ],
    usageGuide: 'Bấm nút "Góp Ý & Báo Lỗi" ở dưới chân trang hoặc trong Menu Hamburger.',
    quickAction: {
      type: 'open_modal',
      target: 'feedback',
      label: 'Gửi Góp Ý & Phản Hồi'
    }
  }
];

// --- CÁC HÀM TIỆN ÍCH TRUY VẤN VÀ TÌM KIẾM (HIGH-PERFORMANCE REGISTRY HELPERS) ---

/**
 * Lấy toàn bộ danh sách tính năng
 */
export function getAllFeatures() {
  return FEATURE_REGISTRY;
}

/**
 * Tìm tính năng theo ID
 */
export function getFeatureById(id) {
  return FEATURE_REGISTRY.find(f => f.id === id) || null;
}

/**
 * Tìm kiếm tính năng siêu tốc (Instant Spotlight Search)
 * Tìm kiếm theo từ khóa tiếng Việt (không dấu & có dấu), tiếng Anh, phím tắt hoặc kỹ năng.
 */
export function searchFeatures(query, options = {}) {
  const { category = 'all', skill = 'all' } = options;
  const cleanQuery = (query || '').trim().toLowerCase();

  return FEATURE_REGISTRY.filter(feature => {
    // 1. Lọc theo Danh mục
    if (category !== 'all' && feature.category !== category) {
      return false;
    }

    // 2. Lọc theo Kỹ năng
    if (skill !== 'all') {
      if (!feature.targetSkills || !feature.targetSkills.includes(skill)) {
        return false;
      }
    }

    // 3. Nếu không có từ khóa tìm kiếm -> thỏa mãn
    if (!cleanQuery) return true;

    // 4. Tìm kiếm từ khóa trong các trường siêu dữ liệu
    const titleMatch = feature.title?.toLowerCase().includes(cleanQuery);
    const descMatch = feature.shortDesc?.toLowerCase().includes(cleanQuery);
    const badgeMatch = feature.badge?.toLowerCase().includes(cleanQuery);
    const shortcutMatch = feature.shortcut?.toLowerCase().includes(cleanQuery);
    const highlightsMatch = feature.highlights?.some(h => h.toLowerCase().includes(cleanQuery));
    const usageMatch = feature.usageGuide?.toLowerCase().includes(cleanQuery);
    const skillMatch = feature.targetSkills?.some(s => s.toLowerCase().includes(cleanQuery));

    return Boolean(
      titleMatch || 
      descMatch || 
      badgeMatch || 
      shortcutMatch || 
      highlightsMatch || 
      usageMatch || 
      skillMatch
    );
  });
}

/**
 * Lấy danh sách tính năng theo kỹ năng cụ thể
 */
export function getFeaturesBySkill(skillId) {
  if (!skillId || skillId === 'all') return FEATURE_REGISTRY;
  return FEATURE_REGISTRY.filter(f => f.targetSkills && f.targetSkills.includes(skillId));
}

/**
 * Lấy danh sách tính năng theo chuyên đề/danh mục cụ thể
 */
export function getFeaturesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return FEATURE_REGISTRY;
  return FEATURE_REGISTRY.filter(f => f.category === categoryId);
}

/**
 * Lấy danh sách tính năng mới nhất để làm Nhật ký cập nhật (Changelog)
 * Sắp xếp giảm dần theo ngày cập nhật updatedAt
 */
export function getRecentChangelog(limit = 10) {
  return [...FEATURE_REGISTRY]
    .sort((a, b) => new Date(b.updatedAt || '2026-01-01') - new Date(a.updatedAt || '2026-01-01'))
    .slice(0, limit);
}

/**
 * Nhận diện tính năng gợi ý theo ngữ cảnh màn hình hiện tại (Context-Aware Recommendation)
 * @param {string} currentSkill - 'writing' | 'reading' | 'speaking' | 'listening'
 * @returns {Array} Danh sách tính năng ưu tiên hàng đầu cho ngữ cảnh đó
 */
export function getContextualFeatures(currentSkill) {
  if (!currentSkill) return FEATURE_REGISTRY;
  return FEATURE_REGISTRY.filter(f => f.targetSkills && f.targetSkills.includes(currentSkill));
}

/**
 * Bộ điều phối hành động 1-Click Action Launcher
 * Nhận action từ tính năng và thực thi mở modal hoặc chuyển workspace
 * @param {object} quickAction - { type: 'open_modal' | 'navigate_workspace', target: string }
 * @param {object} handlers - { openModal: Function, switchSkill: Function, closeModal: Function }
 */
export function dispatchFeatureAction(quickAction, handlers = {}) {
  if (!quickAction || !quickAction.target) return false;

  const { type, target } = quickAction;
  const { openModal, switchSkill, closeModal } = handlers;

  // Đóng modal Help nếu được cung cấp
  if (typeof closeModal === 'function') {
    closeModal();
  }

  if (type === 'navigate_workspace' && typeof switchSkill === 'function') {
    switchSkill(target);
    return true;
  }

  if (type === 'open_modal' && typeof openModal === 'function') {
    openModal(target);
    return true;
  }

  return false;
}
