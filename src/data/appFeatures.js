/**
 * FEATURES_CHANGELOG
 * Danh mục các tính năng & nhật ký cập nhật của IELTS Writing Master Studio.
 * File này hoạt động như một Single Source of Truth: Mỗi khi thêm tính năng mới,
 * chỉ cần bổ sung vào danh sách này, giao diện Modal Giới Thiệu Tính Năng trên web 
 * sẽ tự động cập nhật ngay lập tức mà không cần sửa giao diện!
 */

export const SKILL_DEFINITIONS = {
  writing: {
    id: 'writing',
    name: 'Writing',
    label: 'IELTS Writing',
    color: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
    icon: 'PenTool',
    desc: 'Bổ trợ trực tiếp kỹ năng Viết (Task 1 & Task 2), phát triển ý tưởng, cấu trúc bài và ngữ pháp nâng cao.'
  },
  reading: {
    id: 'reading',
    name: 'Reading',
    label: 'IELTS Reading',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
    icon: 'BookOpen',
    desc: 'Bổ trợ kỹ năng Đọc hiểu thông qua phân tích đề, đọc bài mẫu Band 8.5+, tài liệu học thuật và cẩm nang lý thuyết.'
  },
  speaking: {
    id: 'speaking',
    name: 'Speaking',
    label: 'IELTS Speaking',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    icon: 'Mic',
    desc: 'Bổ trợ kỹ năng Nói qua việc tích lũy collocations C1-C2, ngân hàng ý tưởng (Idea Bank) và cấu trúc lập luận phản biện.'
  },
  listening: {
    id: 'listening',
    name: 'Listening',
    label: 'IELTS Listening',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    icon: 'Headphones',
    desc: 'Bổ trợ kỹ năng Nghe qua việc làm quen với dạng bài thực tế, từ vựng theo ngữ cảnh học thuật và chính tả chuẩn xác.'
  }
};

export const APP_FEATURES = [
  {
    id: 'feat-task1-image-upload',
    version: 'v2.5',
    badge: 'Mới Ra Mắt',
    category: 'community',
    targetSkills: ['writing', 'reading'],
    title: 'Upload & Dán Ảnh Đề Bài Thực Tế Cho IELTS Writing Task 1',
    shortDesc: 'Hỗ trợ tải lên hoặc bấm Ctrl+V để dán trực tiếp ảnh chụp biểu đồ, bản đồ, quy trình từ sách Cambridge hoặc đề thi thật.',
    icon: 'Image',
    highlights: [
      'Dán ảnh 1 chạm (Ctrl+V): Chụp màn hình đề bài (Win+Shift+S) rồi dán trực tiếp mà không cần lưu ra file.',
      'Tự động tối ưu dung lượng: Nén và resize chuẩn nét cao, an toàn khi lưu trữ trên đám mây Supabase và LocalStorage.',
      'Khu vực hiển thị ảnh chuyên nghiệp: Xem ảnh ngay trên cột Đề bài, có chế độ Phóng to chi tiết (Zoom Modal) để soi rõ từng con số.',
      'Gemini Vision AI: Giám khảo AI đọc trực quan hình ảnh đính kèm để đối chiếu số liệu và chấm điểm Task Achievement cực kỳ chính xác.'
    ],
    usageGuide: 'Vào "Kho Đề Thi" -> "Nạp Đề Cá Nhân Mới" (chọn Task 1) hoặc vào "Nạp Đề & Bài Mẫu Thô" -> Kéo thả hoặc dán ảnh (Ctrl+V) vào ô upload.'
  },
  {
    id: 'feat-dual-task-management',
    version: 'v2.4',
    badge: 'Hot',
    category: 'community',
    targetSkills: ['writing', 'reading'],
    title: 'Hệ Thống Đề Thi Cá Nhân & Thư Viện Cộng Đồng (Phương án C)',
    shortDesc: 'Tự do lưu trữ đề thi cá nhân riêng tư hoặc chia sẻ 1 chạm lên thư viện chung cho toàn bộ cộng đồng IELTS cùng luyện tập.',
    icon: 'Users',
    highlights: [
      'Lưu trữ đám mây Supabase: Đề bạn tạo sẽ tự động đồng bộ khi đăng nhập trên điện thoại hay laptop.',
      'Nút chuyển đổi quyền riêng tư: Tùy chọn giữ đề cho riêng mình hoặc bấm "Chia Sẻ" để đóng góp vào Thư viện Cộng đồng.',
      'Khám phá đề thi từ cộng đồng: Duyệt hàng trăm đề thi thực chiến hay do các sĩ tử khác sinh từ AI khắp nơi.'
    ],
    usageGuide: 'Vào "Sinh Đề Thi Mới Bằng AI" -> Bật/tắt công tắc "Chia sẻ lên Thư viện Cộng đồng". Hoặc vào "Kho Đề Thi" -> bấm tab "Cộng Đồng Chia Sẻ".'
  },
  {
    id: 'feat-mobile-responsive-v2',
    version: 'v2.3',
    badge: 'Tối Ưu Mobile',
    category: 'ux',
    targetSkills: ['writing'],
    title: 'Giao Diện Mobile 2 Dòng & Chế Độ "Soạn Bài Rộng Rãi"',
    shortDesc: 'Bố cục thanh điều hướng 2 dòng chống che khuất và tab chuyển đổi giúp vùng gõ bài trên điện thoại rộng thênh thang.',
    icon: 'Smartphone',
    highlights: [
      'Navbar 2 dòng: Dòng 1 gồm Logo, API Key, Menu Hamburger; Dòng 2 chứa tên đề thi và nút mở nhanh Cẩm nang lý thuyết.',
      'Chế độ "Soạn Bài Rộng Rãi": Ẩn tạm thời phần đề bài để dành 100% diện tích màn hình cho ô gõ bài, bàn phím ảo không che mất chữ.',
      'Khay điều hướng Bottom-Sheet: Trượt từ dưới lên phong cách ứng dụng native mượt mà.'
    ],
    usageGuide: 'Trên điện thoại, nhìn dưới thanh Menu bạn sẽ thấy 3 nút: "Đề & Bài Viết", "Soạn Bài Rộng Rãi" và "Xem Đề Bài".'
  },
  {
    id: 'feat-byok-gemini-ai',
    version: 'v2.2',
    badge: 'Bảo Mật Cao',
    category: 'ai',
    targetSkills: ['writing'],
    title: 'Mô Hình BYOK (Bring Your Own Key) & Trí Tuệ Nhân Tạo Gemini',
    shortDesc: 'Chấm điểm chuẩn Cambridge bằng API Key cá nhân miễn phí từ Google AI Studio, bảo mật tuyệt đối 100%.',
    icon: 'ShieldCheck',
    highlights: [
      'Bảo mật client-side: API Key của bạn chỉ lưu trong trình duyệt của bạn, không gửi về bất kỳ máy chủ trung gian nào.',
      'Hỗ trợ đa dạng model AI: Gemini 3.6 Flash (siêu tốc), Gemini 2.5 Flash, Gemini 2.5 Pro (phân tích sâu Band 8.5+).',
      'Đèn báo và công cụ Test Key: Dễ dàng kiểm tra key còn hoạt động tốt hay không chỉ với 1 click.'
    ],
    usageGuide: 'Bấm nút "API Key" góc trên thanh điều hướng -> Dán key lấy từ aistudio.google.com -> Bấm "Kiểm Tra Key".'
  },
  {
    id: 'feat-cambridge-evaluation',
    version: 'v2.1',
    badge: 'Cốt Lõi',
    category: 'evaluation',
    targetSkills: ['writing', 'reading', 'speaking'],
    title: 'Giám Khảo AI Chấm Điểm 4 Tiêu Chí Chuẩn Cambridge',
    shortDesc: 'Chấm điểm chi tiết Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy kèm biểu đồ Radar.',
    icon: 'Award',
    highlights: [
      'Biểu đồ mạng nhện (Radar Chart): Trực quan hóa điểm mạnh và điểm yếu của từng tiêu chí.',
      'Sửa lỗi từng câu (Inline Corrections): Chỉ ra câu gốc sai chỗ nào, sửa lại chuẩn Band 8.0 kèm giải thích ngữ pháp.',
      'Gợi ý viết lại bài luận (Band 8.5+ Rewrite): Cung cấp bài viết mẫu nâng cấp từ chính ý tưởng của bạn (học collocations đắt giá bổ trợ cho cả Speaking & Writing).',
      'Xuất báo cáo Word (.docx) & In ấn: Tải kết quả chấm điểm chuyên nghiệp chỉ với 1 click.'
    ],
    usageGuide: 'Sau khi viết bài xong ở cột bên phải, bấm nút đỏ "Nộp Bài & Chấm Điểm AI" ở thanh công cụ dưới đáy màn hình.'
  },
  {
    id: 'feat-supabase-cloud-sync',
    version: 'v2.0',
    badge: 'Đám Mây',
    category: 'cloud',
    targetSkills: ['writing'],
    title: 'Tài Khoản Đa Nền Tảng & Đồng Bộ Đám Mây (Supabase)',
    shortDesc: 'Đăng ký nhanh bằng Google 1-click hoặc Email. Toàn bộ lịch sử bài thi và sổ tay từ vựng được sao lưu an toàn.',
    icon: 'Cloud',
    highlights: [
      'Đăng nhập Google OAuth 1-Click: Tiện lợi, không cần nhớ mật khẩu.',
      'Bảo mật cấp dòng (Row Level Security): Dữ liệu của bạn được cô lập hoàn toàn, chỉ tài khoản của bạn mới có quyền đọc/ghi.',
      'Đồng bộ 2 chiều: Tự động tải về bài làm cũ khi đổi máy tính hoặc dùng điện thoại.'
    ],
    usageGuide: 'Bấm nút "Tài Khoản" trên thanh điều hướng -> Chọn "Tiếp tục với Google" hoặc điền Email.'
  },
  {
    id: 'feat-theory-handbook',
    version: 'v1.8',
    badge: 'Học Thuật',
    category: 'theory',
    targetSkills: ['writing', 'reading'],
    title: 'Cẩm Nang Lý Thuyết & Chiến Thuật 7 Dạng Task 1 + 5 Dạng Task 2',
    shortDesc: 'Trọn bộ bí kíp bứt phá từ Band 6.0 lên 7.5+, phân tích cấu trúc bài, checklist 10 lỗi cấm kỵ và sổ tay ghi chú cá nhân.',
    icon: 'BookOpen',
    highlights: [
      'Đầy đủ 7 dạng Task 1: Line, Bar, Pie, Table, Mixed, Process và Map Comparison.',
      'Chiến thuật 5 dạng Task 2: Opinion, Discussion, Advantages/Disadvantages, Causes/Solutions, Two-Part Question.',
      'Đọc phân tích cấu trúc & từ nối: Giúp nâng cao khả năng phân tích logic tương tự các bài đọc IELTS Reading.',
      'Ghi chú cá nhân (Personal Notes): Cho phép bạn tự thêm, sửa, xóa các mẹo học của riêng mình ngay trong cẩm nang.'
    ],
    usageGuide: 'Bấm nút "📖 Lý Thuyết" trên thanh điều hướng hoặc trong Menu Hamburger bất cứ lúc nào.'
  },
  {
    id: 'feat-micro-drills-vocab',
    version: 'v1.5',
    badge: 'Luyện Bổ Trợ',
    category: 'practice',
    targetSkills: ['writing', 'speaking', 'reading'],
    title: 'Phòng Luyện Bổ Trợ: Micro-Drills, Vocab C1-C2 & Lỗi Sai Thường Gặp',
    shortDesc: 'Hệ sinh thái bài tập nhỏ giúp tăng phản xạ viết câu phức, ghép từ nối học thuật và ghi nhớ lỗi ngữ pháp.',
    icon: 'Puzzle',
    highlights: [
      'Micro-Drills: Luyện viết câu đơn thành câu phức, paraphrase đề bài, nối ý bằng danh từ hóa.',
      'Flashcard Vocab & Grammar: Hàng trăm cụm collocations đắt giá theo chủ đề cùng bẫy lỗi hay gặp (áp dụng mượt mà vào cả IELTS Speaking Part 3).',
      'Sổ tay lỗi sai & Sổ tay từ vựng: Tự động gom các lỗi sai từ bài chấm của AI vào sổ để ôn tập lại.'
    ],
    usageGuide: 'Mở Menu -> Chọn mục trong phần "Học & Luyện Thi" (Micro-Drills, Vocab & Lỗi Sai, Sổ tay từ vựng).'
  },
  {
    id: 'feat-mock-test-timer',
    version: 'v1.0',
    badge: 'Thực Chiến',
    category: 'exam',
    targetSkills: ['writing', 'reading'],
    title: 'Thi Thử 60 Phút Thực Chiến (Full Mock Test)',
    shortDesc: 'Mô phỏng 100% áp lực phòng thi IELTS trên máy tính với đồng hồ đếm ngược và kiểm soát số từ thời gian thực.',
    icon: 'Clock',
    highlights: [
      'Làm trọn gói Task 1 (20 phút) + Task 2 (40 phút) liên tục không ngắt quãng.',
      'Rèn luyện kỹ năng đọc - phân tích đề nhanh (Skimming/Scanning) và quản lý thời gian thi chuẩn Cambridge.',
      'Bộ đếm từ và chỉ số TTR (Độ phong phú từ vựng), tốc độ gõ phím WPM thời gian thực.',
      'Chế độ Practice vs Exam: Bật/tắt kiểm tra chính tả linh hoạt theo nhu cầu ôn luyện.'
    ],
    usageGuide: 'Vào Menu -> Bấm "Thi Thử 60 Phút Thực Chiến" để bắt đầu bài thi trọn gói.'
  }
];
