/**
 * src/core/projectWhitepaperData.js
 *
 * SINGLE SOURCE OF TRUTH (SSOT): HỒ SƠ TOÀN CẢNH DỰ ÁN, CÁCH VẬN HÀNH & LỘ TRÌNH PHÁT TRIỂN
 * (Living Project Whitepaper, Closed-Loop Operations, Hybrid Architecture & Live Roadmap)
 *
 * Được đồng bộ tự động tới:
 * 1. Trang chủ / Trang giới thiệu Website (src/pages/AboutPage.jsx - /about)
 * 2. Hệ thống tài liệu GitBook Tiếng Việt (docs/project-whitepaper.md)
 * 3. Hệ thống tài liệu GitBook Quốc tế (docs-en/project-whitepaper.md)
 */

import { FEATURE_REGISTRY } from './featureRegistry.js';

export const WHITEPAPER_METADATA = {
  version: 'v3.5 (2026 Living Edition)',
  lastUpdated: '2026-11-01',
  docFileName: 'project-whitepaper.md',
  wordFileName: 'Ho_So_Mo_Ta_Du_An_Va_Goi_Von_IELTS_Platform.docx'
};

export function getWhitepaperData(isEn = false) {
  const totalFeatures = FEATURE_REGISTRY.length;

  if (isEn) {
    return {
      meta: {
        ...WHITEPAPER_METADATA,
        totalFeatures,
        badge: `LIVING PROJECT WHITEPAPER • ${totalFeatures}+ SPECIALIZED FEATURES`,
        title: 'How the Platform Works & Project Whitepaper',
        subtitle:
          'A complete blueprint designed so anyone — even without prior IELTS or technical background — can understand our 5-step closed-loop learning journey, 0.02ms + AI dual-engine grading, and Local-First hybrid architecture.'
      },
      elevatorPitch: {
        title: 'One-Sentence Product Definition (Elevator Pitch)',
        content:
          'IELTS Studio is an all-in-one Computer-Delivered IELTS (CDI) simulation room, 4-skill practice studio, personalized 30-minute sprint coach, and gamified vocabulary arena running directly in the browser — combining a 0.02ms deterministic algorithmic scorer with a 4-criteria Cambridge AI Examiner.'
      },
      closedLoopSteps: [
        {
          stepNumber: '01',
          id: 'step-onboarding',
          title: 'Diagnostic & Onboarding',
          shortTitle: '1. Diagnostic',
          badge: 'Day 1 Entry',
          color: 'indigo',
          userAction:
            'Complete beginners click "🌱 Beginner Hub" for a gentle 4-step path (90s vocabulary game, IELTS jargon buster, 3-minute simple sentences). Intermediate learners take the 10-minute Diagnostic Placement Test.',
          systemEngine:
            'The Diagnostic Placement Engine evaluates grammar, lexical range, and reading comprehension to calculate current Band level and generate a personalized 30-Day Roadmap.',
          learnerValue:
            'Eliminates overwhelm on Day 1. Every learner knows immediately where to start according to their Target Band (5.0 to 8.0+).',
          actionType: 'modal',
          actionTarget: 'beginnerGuide',
          actionLabel: 'Open Beginner Hub'
        },
        {
          stepNumber: '02',
          id: 'step-sprint',
          title: 'Adaptive 30-Min Daily Sprint',
          shortTitle: '2. 30-Min Coach',
          badge: 'Daily Habit',
          color: 'emerald',
          userAction:
            'Open the "Adaptive 30-Min Sprint Coach" or click the "Smart Daily Recommendation" card at the top of the workspace.',
          systemEngine:
            'Scans personal Mistake Vault and recent submission history to divide 30 minutes into 3 brain-optimized stages: Stage 1 (7m Grammar Trap Clearing) ➔ Stage 2 (15m Core Speaking/Writing Sprint) ➔ Stage 3 (8m C1/C2 Lexical Boost).',
          learnerValue:
            'No more wondering what to study today. Turns 30 spare minutes into targeted daily band improvement with Streak tracking.',
          actionType: 'modal',
          actionTarget: 'adaptiveSprint',
          actionLabel: 'Launch 30-Min Coach'
        },
        {
          stepNumber: '03',
          id: 'step-workspaces',
          title: '4-Skill Authentic CDI Workspaces & Arena',
          shortTitle: '3. 4-Skill CDI',
          badge: 'Core Practice',
          color: 'purple',
          userAction:
            'Practice Writing, Speaking, Reading, and Listening on a 1:1 Computer-Delivered IELTS interface, or enter the 90-second Atlas English Arena.',
          systemEngine:
            'Runs real-time GRA sentence structure heatmaps, PEEL paragraph coherence checks, 1-click C1/C2 lexical upgrades, 60 FPS audio waveform & filler-word detection, and split-screen passage highlighting.',
          learnerValue:
            'Builds 100% familiarity with official IDP/British Council computer exam software while keeping daily practice engaging.',
          actionType: 'skill',
          actionTarget: 'writing',
          actionLabel: 'Enter CDI Workspace'
        },
        {
          stepNumber: '04',
          id: 'step-grading',
          title: 'Dual-Engine Grading & Trap Decoding',
          shortTitle: '4. Dual Grading',
          badge: '0.02ms + AI',
          color: 'amber',
          userAction:
            'Click "Submit" to choose between Instant Algorithmic Grading (0.02ms) or Deep 4-Criteria Cambridge AI Examiner Evaluation.',
          systemEngine:
            'Scores Task Response, Coherence, Lexical Resource, and Grammar with a 4-axis Radar Chart, provides Band 8.0+ model rewrites, and activates the Distractor Trap Decoder for wrong Reading/Listening answers.',
          learnerValue:
            'Instant feedback without waiting days for a tutor. Learners understand the exact psychological trap behind every mistake.',
          actionType: 'skill',
          actionTarget: 'speaking',
          actionLabel: 'Try Dual-Engine Studio'
        },
        {
          stepNumber: '05',
          id: 'step-mastery',
          title: 'SRS Mistake Prescription & TRF Exam',
          shortTitle: '5. SRS & TRF',
          badge: 'Mastery Loop',
          color: 'rose',
          userAction:
            'Complete the 3-minute "Daily Error Prescription" quiz the next day and take the 3-Skill Marathon Mock Test.',
          systemEngine:
            'Automatically converts yesterday’s real errors in the Mistake Vault into Spaced Repetition (SRS) reflex quizzes, generates an official-style PDF Test Report Form (TRF) with QR verification, and predicts the exact date of reaching Target Band.',
          learnerValue:
            'Ensures past mistakes are permanently cured before exam day and provides clear data on when to book the real IELTS test.',
          actionType: 'modal',
          actionTarget: 'mockTest',
          actionLabel: 'Open TRF & Mock Exam'
        }
      ],
      architectureLayers: [
        {
          layerBadge: 'LAYER 1 • 90% WORKLOAD ON USER DEVICE',
          title: 'Local-First Client Edge (Browser & IndexedDB)',
          subtitle: 'Zero server latency, offline resilience, and $0 marginal compute cost',
          highlights: [
            '⚡ 0.02ms Deterministic Algorithmic Scorer: Evaluates CEFR vocabulary density, GRA complex sentence ratios, linker variety, WPM speaking pace, and filler words directly in the browser.',
            '💾 Two-Tier Local Persistence (IndexedDB + LocalStorage): Auto-saves essays every millisecond and stores voice recordings locally. Even if Wi-Fi drops during a 3-hour marathon exam, zero work is lost.',
            '🎙️ 60 FPS Web Audio & Strict Bilingual Engine: Real-time acoustic waveform visualization and instant switching between 100% Vietnamese and 100% International English UI.'
          ]
        },
        {
          layerBadge: 'LAYER 2 • 10% HIGH-VALUE INTELLIGENCE & SYNC',
          title: 'Cloud & AI Examiner Layer (Supabase + Cloudflare + LLM)',
          subtitle: 'Deep semantic evaluation, real-time leaderboards, and cross-device backup',
          highlights: [
            '🤖 Deep 4-Criteria Cambridge AI Examiner: Activated on-demand for semantic argument grading, PEEL logic verification, sentence-by-sentence correction, and Band 8.0+ model rewrites.',
            '☁️ Supabase Real-Time Cloud & Guest Migration: Seamlessly migrates guest progress to cloud accounts, powers live Atlas Arena leaderboards, and syncs Streak Shields across devices.',
            '🛡️ Cloudflare Edge & Automated SSOT Pipeline: Delivers low-latency audio tracks globally and auto-synchronizes all feature documentation from a Single Source of Truth (featureRegistry.js).'
          ]
        }
      ],
      comparisonTable: {
        caption: 'Direct Comparison: Traditional Centers vs. Legacy Test Sites vs. IELTS Studio Platform',
        headers: ['Dimension', 'Traditional Offline Centers', 'Legacy Online Test Sites', 'IELTS Studio Platform (This Project)'],
        rows: [
          ['Cost to Learner', '$600 – $2,500 per course', 'Pay-per-essay or static free tests', 'Accessible Freemium (Unlimited 0.02ms grading + all-in-one tools)'],
          ['Writing & Speaking Grading Speed', '2 to 7 days waiting for teacher', '15 – 40 seconds API wait (often timeouts)', '0.02ms Instant Algorithmic Scorer + Deep 4-Criteria AI Examiner'],
          ['CDI Computer Exam Simulation', 'Mostly paper-based handouts', 'Standard blog-style web layout', '1:1 Authentic CDI Split-Screen, Highlight/Notes, Contrast & Shortcuts'],
          ['Reading & Listening Explanations', 'Manual classroom review', 'Only shows Correct/Wrong key', 'Distractor Trap Decoder explaining psychological traps & evidence'],
          ['Daily Retention & Gamification', 'Depends purely on willpower', 'High drop-off after 1–2 tests', 'Atlas Arena (90s Duels, Tower of Babel, Boss Raids, Leagues & Streaks)'],
          ['Server & AI Unit Economics', 'High rent & teacher payroll', 'High API token burn on every click', 'Saves 85–90% server/API cost via Local-First 90% client processing']
        ]
      },
      roadmapPhases: [
        {
          phase: 'Phase 1 (Completed & Live)',
          period: 'v1.0 – v3.5 (Current)',
          status: 'live',
          statusLabel: '100% Live in Production',
          title: 'Core 4-Skill CDI Studio, Dual-Engine Grading & Atlas Arena',
          items: [
            `${totalFeatures}+ specialized features across Writing, Speaking, Reading, and Listening.`,
            '0.02ms Algorithmic Scorer + 4-Criteria Cambridge AI Examiner with PEEL & GRA Heatmap.',
            '100-Level Atlas Titans Arena, Tower of Babel, Ghost Duels, and Streak Shield economy.',
            '100% Strict Global English UI & Bilingual GitBook auto-sync pipeline.'
          ]
        },
        {
          phase: 'Phase 2 (Ongoing Evolution)',
          period: 'Q4 2026 – Q1 2027',
          status: 'active',
          statusLabel: 'In Active Expansion',
          title: 'Cambridge Question Bank Expansion & Adaptive Personalization',
          items: [
            'Continuous quarterly addition of authentic Cambridge-calibrated Reading, Listening, Writing, and Speaking test sets.',
            'Enhanced Ebbinghaus 14-day memory decay tracking across Mistake Vault and SRS Vocabulary Studio.',
            'Deep diagnostic analytics and automated daily study prescriptions tailored to individual band bottlenecks.'
          ]
        },
        {
          phase: 'Phase 3 (Upcoming Milestone)',
          period: 'Q2 – Q3 2027',
          status: 'planned',
          statusLabel: 'Planned Roadmap',
          title: 'Classroom / Center Management Hub (B2B SaaS) & Multi-Accent AI',
          items: [
            'Teacher & Institution Dashboard enabling schools and IELTS centers to assign CDI mock exams and track class-wide error analytics.',
            'Multi-accent Speaking Examiner simulation (British, Australian, North American) with prosody coaching.',
            'Progressive Web App (PWA) & tablet optimization for computer lab deployments.'
          ]
        },
        {
          phase: 'Phase 4 (Long-Term Vision)',
          period: '2027 – 2028',
          status: 'vision',
          statusLabel: 'Global Scaling',
          title: 'Global EdTech Ecosystem & Multi-Certificate Expansion',
          items: [
            'Zero-friction international rollout across Southeast Asia, South Asia, and global EFL markets leveraging the 100% English UI engine.',
            'Cloning the Local-First Dual-Engine architecture to adjacent academic assessments (PTE Academic, TOEIC 4-Skills, SAT).'
          ]
        }
      ]
    };
  }

  // VIETNAMESE VERSION
  return {
    meta: {
      ...WHITEPAPER_METADATA,
      totalFeatures,
      badge: `HỒ SƠ TOÀN CẢNH DỰ ÁN • CẬP NHẬT LIÊN TỤC (${totalFeatures}+ TÍNH NĂNG)`,
      title: 'Cách Vận Hành Hệ Thống & Hồ Sơ Toàn Cảnh Dự Án',
      subtitle:
        'Bản thiết kế chi tiết giúp bất kỳ ai — kể cả người chưa từng thi IELTS hoặc không chuyên về công nghệ — đều hiểu rõ vòng lặp vận hành 5 bước khép kín, công nghệ chấm điểm kép 0.02ms + AI và lộ trình phát triển dài hạn của nền tảng.'
    },
    elevatorPitch: {
      title: 'Định Nghĩa Sản Phẩm Trong 1 Câu (Elevator Pitch)',
      content:
        'IELTS Studio là tổ hợp "Phòng thi máy tính quốc tế CDI + Phòng luyện 4 kỹ năng + Huấn luyện viên cá nhân 30 phút + Đấu trường từ vựng Atlas Arena" hoạt động trực tiếp trên trình duyệt — kết hợp giữa Động cơ chấm máy thuật toán siêu tốc (0.02 mili-giây) và Giám khảo Trí tuệ nhân tạo (AI Examiner) chuẩn 4 tiêu chí Cambridge.'
    },
    closedLoopSteps: [
      {
        stepNumber: '01',
        id: 'step-onboarding',
        title: 'Chẩn Đoán Năng Lực & Định Vị Lộ Trình',
        shortTitle: '1. Chẩn Đoán',
        badge: 'Bước Khởi Đầu',
        color: 'indigo',
        userAction:
          'Người mất gốc bấm vào "🌱 Người Mới" để vào lộ trình 4 bước nhẹ nhàng (chơi game 90s nạp từ, giải mã thuật ngữ IELTS dễ hiểu, tập viết câu đơn 3 phút). Người đã có nền tảng làm bài Kiểm tra Chẩn đoán Đầu vào 10 phút.',
        systemEngine:
          'Bộ máy Diagnostic Placement phân tích ngữ pháp, vốn từ và đọc hiểu để xác định Band điểm hiện tại, tự động lập Lộ trình 30 ngày cá nhân hóa theo Target Band (5.0 đến 8.0+).',
        learnerValue:
          'Xóa bỏ hoàn toàn cảm giác quá tải hay sợ hãi ngày đầu tiên. Biết chính xác hôm nay cần bắt đầu từ đâu.',
        actionType: 'modal',
        actionTarget: 'beginnerGuide',
        actionLabel: 'Mở Trung Tâm Người Mới'
      },
      {
        stepNumber: '02',
        id: 'step-sprint',
        title: 'Huấn Luyện Viên Nước Rút 30 Phút Hàng Ngày',
        shortTitle: '2. HLV 30 Phút',
        badge: 'Thói Quen Mỗi Ngày',
        color: 'emerald',
        userAction:
          'Mở "Huấn Luyện Viên 30P (Adaptive Sprint Coach)" hoặc bấm vào "Thẻ Gợi Ý Thông Minh Hàng Ngày" ngay đầu màn hình làm việc.',
        systemEngine:
          'Tự động quét Sổ tay lỗi sai và bài làm gần nhất để chia 30 phút thành 3 chặng tối ưu não bộ: Chặng 1 (7p Xóa bẫy ngữ pháp) ➔ Chặng 2 (15p Thực chiến Speaking/Writing) ➔ Chặng 3 (8p Nạp từ vựng C1/C2).',
        learnerValue:
          'Không còn bối rối "hôm nay học gì?". Biến 30 phút rảnh mỗi ngày thành bước tiến Band điểm thực chất kèm chuỗi ngày học Streak.',
        actionType: 'modal',
        actionTarget: 'adaptiveSprint',
        actionLabel: 'Mở Huấn Luyện Viên 30P'
      },
      {
        stepNumber: '03',
        id: 'step-workspaces',
        title: 'Thực Chiến 4 Phòng Luyện Chuẩn CDI & Đấu Trường Arena',
        shortTitle: '3. Phòng Thi CDI',
        badge: '4 Kỹ Năng & Game',
        color: 'purple',
        userAction:
          'Luyện tập Nghe – Nói – Đọc – Viết trên giao diện mô phỏng 1:1 phòng thi máy tính của IDP/British Council, hoặc vào Đấu trường phản xạ 90 giây Atlas Arena.',
        systemEngine:
          'Chạy thời gian thực Bản đồ nhiệt cấu trúc câu GRA, kiểm định đoạn văn PEEL, nâng cấp từ vựng C1/C2 1-chạm, sóng âm 60 FPS bắt từ đệm ngập ngừng (uh, um) và chia đôi màn hình tô sáng bài đọc.',
        learnerValue:
          'Quen tay 100% với thao tác phòng thi máy tính thực tế, không còn sốc tâm lý hay cháy giờ khi đi thi thật.',
        actionType: 'skill',
        actionTarget: 'writing',
        actionLabel: 'Vào Phòng Luyện CDI'
      },
      {
        stepNumber: '04',
        id: 'step-grading',
        title: 'Chấm Điểm Kép (0.02ms + AI) & Giải Mã Bẫy Khảo Thí',
        shortTitle: '4. Chấm Điểm Kép',
        badge: '0.02ms + AI',
        color: 'amber',
        userAction:
          'Bấm "Nộp Bài" và tùy chọn giữa ⚡ Chấm Máy Thuật Toán (0.02ms tức thì) hoặc 🤖 Chấm AI Giám Khảo Chuyên Sâu.',
        systemEngine:
          'Chấm chi tiết 4 tiêu chí Cambridge kèm biểu đồ Radar, viết lại bài mẫu nâng Band 8.0+, và kích hoạt Bộ Giải Mã Bẫy (Distractor Trap Decoder) chỉ rõ tâm lý bẫy ở từng câu Reading/Listening làm sai.',
        learnerValue:
          'Biết điểm và lỗi sai ngay lập tức mà không phải chờ giáo viên chấm cả tuần. Hiểu tận gốc vì sao mình bị lừa chọn đáp án nhiễu.',
        actionType: 'skill',
        actionTarget: 'speaking',
        actionLabel: 'Thử Phòng Chấm Kép'
      },
      {
        stepNumber: '05',
        id: 'step-mastery',
        title: 'Đơn Thuốc Sửa Lỗi SRS & Thi Thử Xuất Phiếu Điểm TRF',
        shortTitle: '5. Sửa Lỗi & TRF',
        badge: 'Về Đích',
        color: 'rose',
        userAction:
          'Làm "Đơn Thuốc Sửa Lỗi 3 Phút" vào ngày hôm sau và tham gia phòng thi liên hoàn Marathon 3 Kỹ Năng.',
        systemEngine:
          'Tự động gom mọi lỗi sai thực tế vào Mistake Vault để tạo câu đố lặp lại ngắt quãng (SRS) cho đến khi học viên hết hẳn lỗi; xuất Phiếu điểm TRF PDF có mã QR và dự báo chính xác ngày đạt Band mục tiêu.',
        learnerValue:
          'Khắc phục triệt để tật lặp lại lỗi cũ và nắm chắc thời điểm vàng để đăng ký thi thật với tỷ lệ đạt mục tiêu cao nhất.',
        actionType: 'modal',
        actionTarget: 'mockTest',
        actionLabel: 'Mở Phòng Thi & Phiếu TRF'
      }
    ],
    architectureLayers: [
      {
        layerBadge: 'TẦNG 1 • XỬ LÝ 90% TÁC VỤ NGAY TRÊN THIẾT BỊ NGƯỜI DÙNG',
        title: 'Kiến Trúc Local-First Tại Trình Duyệt (Client Edge & IndexedDB)',
        subtitle: 'Phản hồi 0 độ trễ, không bao giờ mất bài làm khi rớt mạng, chi phí máy chủ = 0đ',
        highlights: [
          '⚡ Động cơ Chấm Máy Thuật Toán 0.02ms: Phân tích mật độ từ vựng CEFR (B1–C2), tỷ lệ câu phức GRA, độ đa dạng từ nối, tốc độ nói WPM và từ đệm ngay trên máy học viên.',
          '💾 Lưu Trữ Cục Bộ 2 Tầng (IndexedDB + LocalStorage): Tự động lưu nháp bài viết từng mili-giây và lưu bản thu âm Speaking. Dù rớt mạng giữa bài thi 3 tiếng, bài làm vẫn an toàn 100%.',
          '🎙️ Sóng Âm 60 FPS & Song Ngữ Tuyệt Đối: Xử lý âm thanh trực tiếp trên trình duyệt và chuyển đổi tức thì giữa 100% Tiếng Việt và 100% Tiếng Anh chuẩn khảo thí quốc tế.'
        ]
      },
      {
        layerBadge: 'TẦNG 2 • 10% TÁC VỤ TRÍ TUỆ NHÂN TẠO & ĐỒNG BỘ ĐÁM MÂY',
        title: 'Tầng Đám Mây & Giám Khảo AI (Supabase + Cloudflare + LLM)',
        subtitle: 'Chấm sâu ngữ nghĩa học thuật, bảng xếp hạng thời gian thực và sao lưu đa thiết bị',
        highlights: [
          '🤖 Giám Khảo AI Chuyên Sâu 4 Tiêu Chí: Chỉ kích hoạt khi người học yêu cầu chấm sâu mạch lập luận, kiểm định PEEL và viết bài mẫu nâng Band ➔ Tiết kiệm 85–90% chi phí API AI.',
          '☁️ Đồng Bộ Đám Mây Supabase & Chuyển Giao Khách (Guest Migration): Học thử ngay không cần đăng ký; khi tạo tài khoản sẽ tự động đồng bộ toàn bộ điểm XP, Streak và lịch sử lên mây.',
          '🛡️ Mạng Biên Cloudflare & Tự Động Hóa Tài Liệu (SSOT): Phân phối học liệu âm thanh tốc độ cao và tự động cập nhật GitBook/Help Center từ một nguồn dữ liệu duy nhất (featureRegistry.js).'
        ]
      }
    ],
    comparisonTable: {
      caption: 'Bảng đối sánh trực diện giữa Trung tâm truyền thống, Web luyện đề cũ và IELTS Studio Platform',
      headers: ['Tiêu chí Đối sánh', 'Trung tâm IELTS Truyền thống', 'Web Luyện đề Thế hệ cũ', 'IELTS Studio Platform (Dự án này)'],
      rows: [
        ['Chi phí cho người học', 'Rất cao (15 – 60 triệu VNĐ / khóa)', 'Thu phí theo lượt chấm hoặc chỉ có trắc nghiệm tĩnh', 'Hoàn toàn tiếp cận (Chấm máy 0.02ms không giới hạn + Đầy đủ công cụ)'],
        ['Tốc độ chấm Writing & Speaking', 'Chờ giáo viên chấm từ 2 – 7 ngày', 'Chờ gọi API 15 – 40 giây, dễ nghẽn mạng', 'Chấm Máy 0.02 mili-giây tức thì + Chấm AI chuyên sâu 4 tiêu chí'],
        ['Mô phỏng phòng thi máy tính (CDI)', 'Học trên giấy và bảng truyền thống', 'Giao diện trang web đọc báo thông thường', 'Chuẩn 1:1 phòng thi máy IDP/BC (Chia đôi màn hình, Highlight, Contrast)'],
        ['Giải thích đáp án Reading & Listening', 'Giáo viên chữa miệng trên lớp, dễ quên', 'Chỉ báo Đúng/Sai hoặc hiện giải thích sơ sài', 'Bộ giải mã 6 loại Bẫy khảo thí (Distractor Trap Decoder) & dẫn chứng'],
        ['Cơ chế tạo động lực & Giữ chân', 'Phụ thuộc hoàn toàn vào ý chí cá nhân', 'Rất thấp (Làm 1–2 đề rồi bỏ vì ngợp)', 'Đấu trường Atlas Arena 100 cấp độ, Tháp Babel, Đấu Ma, Giải đấu & Streak'],
        ['Hiệu quả chi phí vận hành (Unit Cost)', 'Tốn chi phí mặt bằng & lương giáo viên lớn', 'Tốn phí API AI & Server trên mọi thao tác', 'Tiết kiệm 85–90% chi phí Server/API nhờ xử lý Local-First 90% tại máy khách']
      ]
    },
    roadmapPhases: [
      {
        phase: 'Giai đoạn 1 (Đã Hoàn Thiện & Vận Hành)',
        period: 'v1.0 – v3.5 (Hiện tại)',
        status: 'live',
        statusLabel: 'Đã Vận Hành 100%',
        title: 'Hoàn Thiện 4 Phòng Thi CDI, Chấm Điểm Kép 0.02ms + AI & Đấu Trường Atlas Arena',
        items: [
          `Vận hành mượt mà ${totalFeatures}+ tính năng chuyên sâu cho cả 4 kỹ năng Nghe – Nói – Đọc – Viết.`,
          'Tích hợp Động cơ chấm máy 0.02ms, Giám khảo AI 4 tiêu chí, kiểm định đoạn văn PEEL và Bản đồ nhiệt cấu trúc câu GRA.',
          'Ra mắt Đấu trường Atlas Arena 100 cấp độ, Tháp Babel, Đấu Ma (Ghost Duel), Boss Thế Giới và Ví thưởng Atlas.',
          'Hoàn thiện kiến trúc Song ngữ Anh – Việt tuyệt đối (Strict Global English UI) và đường ống đồng bộ GitBook tự động.'
        ]
      },
      {
        phase: 'Giai đoạn 2 (Đang Mở Rộng Liên Tục)',
        period: 'Q4/2026 – Q1/2027',
        status: 'active',
        statusLabel: 'Đang Cập Nhật Hàng Tuần',
        title: 'Mở Rộng Kho Đề Chuẩn Khảo Thí & Tối Ưu Hóa Cá Nhân Hóa Sâu',
        items: [
          'Bổ sung liên tục các bộ đề thi Reading, Listening (kèm Audio phân đoạn & Transcript chuẩn), Writing và Speaking mới nhất.',
          'Tinh chỉnh thuật toán đường cong quên lãng Ebbinghaus 14 ngày trong Kho lỗi sai (Mistake Vault) và Sổ tay từ vựng SRS.',
          'Nâng cấp Huấn luyện viên nước rút 30 phút (Adaptive Sprint Coach) và dự báo ngày đạt Band theo dữ liệu thực học.'
        ]
      },
      {
        phase: 'Giai đoạn 3 (Mốc Phát Triển Tiếp Theo)',
        period: 'Q2/2027 – Q3/2027',
        status: 'planned',
        statusLabel: 'Kế Hoạch Tiếp Theo',
        title: 'Hệ Thống Quản Trị Lớp Học Cho Trung Tâm/Trường Học (B2B Hub) & Giọng AI Đa Vùng Miền',
        items: [
          'Ra mắt Bảng điều khiển Giáo viên & Trung tâm (Teacher Dashboard) giúp giao bài thi thử CDI và thống kê lỗi sai toàn lớp.',
          'Mở rộng Giám khảo Speaking đa giọng đọc bản xứ (Anh-Anh, Anh-Úc, Anh-Mỹ) và chấm ngữ điệu chuyên sâu.',
          'Tối ưu hóa gói cài đặt PWA cho phòng máy tính bảng và phòng lab khảo thí tại các trường THPT/Đại học.'
        ]
      },
      {
        phase: 'Giai đoạn 4 (Tầm Nhìn Dài Hạn)',
        period: '2027 – 2028',
        status: 'vision',
        statusLabel: 'Mở Rộng Quốc Tế',
        title: 'Vươn Ra Thị Trường Đông Nam Á & Nhân Bản Lõi Công Nghệ Khảo Thí',
        items: [
          'Đẩy mạnh người dùng quốc tế tại Đông Nam Á và Châu Á nhờ hệ thống giao diện và giải thích 100% Tiếng Anh có sẵn.',
          'Nhân bản kiến trúc Local-First + Chấm điểm kép sang các bài thi chuẩn hóa quốc tế khác (PTE Academic, TOEIC 4 Kỹ năng, SAT).'
        ]
      }
    ]
  };
}
