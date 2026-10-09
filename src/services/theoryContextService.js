import { getGitBookBaseUrl } from '../core/featureRegistry.js';
import { openModal } from '../core/modalStore.js';
import { getLanguage } from '../i18n/i18nService.js';

/**
 * theoryContextService.js - Contextual Strategy & GitBook Deep-Linking Engine
 * 
 * Maps live practicing contexts (Writing task types, Reading question archetypes,
 * Listening sections, Speaking parts, Distractor traps) to exact authoritative
 * guides in the 113-topic Cambridge & GitBook Curriculum.
 */

// Mapping matrix for all practicing scenarios
export const CONTEXT_THEORY_MAP = {
  writing: {
    task1: {
      map: {
        topicId: 'task1-map',
        category: 'task1',
        subType: 'map',
        title: 'Task 1: Tuyệt Chiêu Xử Lý Bản Đồ Quy Hoạch (Map)',
        badge: 'Cẩm Nang Dạng Bản Đồ (Map)',
        tip: 'Chia bố cục theo 2 mốc năm hoặc 2 khu vực địa lý; sử dụng triệt để câu bị động và giới từ không gian (to the north of, replaced by).',
        gitbookSlug: 'writing/task1-map'
      },
      process: {
        topicId: 'task1-process',
        category: 'task1',
        subType: 'process',
        title: 'Task 1: Process Diagram (Quy Trình Tự Nhiên & Sản Xuất)',
        badge: 'Cẩm Nang Quy Trình (Process)',
        tip: 'Xác định rõ quy trình tuyến tính (linear) hay tuần hoàn (cyclical); dùng thì hiện tại đơn thể bị động và từ nối tuần tự (initially, subsequently, in the final stage).',
        gitbookSlug: 'writing/task1-process'
      },
      line: {
        topicId: 'task1-line-graph',
        category: 'task1',
        subType: 'line',
        title: 'Task 1: Line Graph (Biểu Đồ Đường - Dynamic)',
        badge: 'Cẩm Nang Biểu Đồ Đường (Line Graph)',
        tip: 'Nhóm các đường có cùng xu hướng tăng/giảm; miêu tả điểm bắt đầu, điểm cực đại/cực tiểu và điểm kết thúc.',
        gitbookSlug: 'writing/task1-line-graph'
      },
      bar: {
        topicId: 'task1-bar-chart',
        category: 'task1',
        subType: 'bar',
        title: 'Task 1: Bar Chart (Biểu Đồ Cột - Dynamic vs Static)',
        badge: 'Cẩm Nang Biểu Đồ Cột (Bar Chart)',
        tip: 'Phân biệt rõ bài có yếu tố thời gian (dynamic) hay so sánh tĩnh tại 1 mốc thời gian (static) để chọn động từ phù hợp.',
        gitbookSlug: 'writing/task1-bar-chart'
      },
      pie: {
        topicId: 'task1-pie-chart',
        category: 'task1',
        subType: 'pie',
        title: 'Task 1: Pie Chart (Biểu Đồ Tròn - Tỷ Trọng & Cơ Cấu)',
        badge: 'Cẩm Nang Biểu Đồ Tròn (Pie Chart)',
        tip: 'Tập trung vào tỷ trọng chiếm phần lớn nhất (account for the lion\'s share) và đối tượng có sự dịch chuyển mạnh nhất.',
        gitbookSlug: 'writing/task1-pie-chart'
      },
      table: {
        topicId: 'task1-table',
        category: 'task1',
        subType: 'table',
        title: 'Task 1: Table (Bảng Số Liệu Phức Tạp)',
        badge: 'Cẩm Nang Bảng Số Liệu (Table)',
        tip: 'Tìm giá trị cao nhất, thấp nhất theo từng hàng/cột; không bao giờ liệt kê tất cả các con số mà phải nhóm dữ liệu logic.',
        gitbookSlug: 'writing/task1-table'
      },
      mixed: {
        topicId: 'task1-mixed',
        category: 'task1',
        subType: 'mixed',
        title: 'Task 1: Tuyệt Chiêu Xử Lý Biểu Đồ Kết Hợp (Multiple Charts)',
        badge: 'Cẩm Nang Biểu Đồ Kết Hợp (Mixed)',
        tip: 'Mỗi biểu đồ phân tích thành 1 đoạn thân bài độc lập; câu Overview phải tổng kết xu hướng của cả hai biểu đồ.',
        gitbookSlug: 'writing/task1-mixed'
      },
      default: {
        topicId: 'task1-mastery',
        category: 'task1',
        subType: 'all',
        title: 'Master Chiến Lược Toàn Diện IELTS Writing Task 1',
        badge: 'Cẩm Nang Toàn Diện Task 1',
        tip: 'Overview 2 câu là linh hồn của Task 1. Không có Overview = Tối đa Band 5.0 Task Achievement.',
        gitbookSlug: 'writing/task1-mastery'
      }
    },
    task2: {
      opinion: {
        topicId: 'task2-opinion',
        category: 'task2',
        subType: 'opinion',
        title: 'Task 2: Opinion / Agree or Disagree',
        badge: 'Cẩm Nang Agree or Disagree',
        tip: 'Nêu rõ lập trường (Clear Position) ngay từ mở bài và bảo vệ xuyên suốt 2 đoạn thân bài mà không tự mâu thuẫn.',
        gitbookSlug: 'writing/task2-opinion'
      },
      discussion: {
        topicId: 'task2-discussion',
        category: 'task2',
        subType: 'discussion',
        title: 'Task 2: Discussion (Discuss Both Views and Give Your Opinion)',
        badge: 'Cẩm Nang Discuss Both Views',
        tip: 'Dành 1 đoạn phân tích góc nhìn 1, 1 đoạn phân tích góc nhìn 2 và nêu rõ quan điểm cá nhân ủng hộ phía nào.',
        gitbookSlug: 'writing/task2-discussion'
      },
      problem_solution: {
        topicId: 'task2-problem-solution',
        category: 'task2',
        subType: 'problem-solution',
        title: 'Task 2: Dạng Bài Problem & Solution',
        badge: 'Cẩm Nang Problem & Solution',
        tip: 'Thân bài 1 nêu 2 nguyên nhân cốt lõi; Thân bài 2 đưa ra 2 giải pháp trực diện tương ứng giải quyết nguyên nhân đó.',
        gitbookSlug: 'writing/task2-problem-solution'
      },
      advantages_disadvantages: {
        topicId: 'task2-advantages-disadvantages',
        category: 'task2',
        subType: 'advantages',
        title: 'Task 2: Dạng Bài Advantages and Disadvantages',
        badge: 'Cẩm Nang Advantages & Disadvantages',
        tip: 'Phân tích công bằng cả 2 mặt và kết luận xem mặt tích cực có thực sự vượt trội mặt tiêu cực hay không (outweigh).',
        gitbookSlug: 'writing/task2-advantages-disadvantages'
      },
      two_part: {
        topicId: 'task2-two-part',
        category: 'task2',
        subType: 'two-part',
        title: 'Task 2: Two-Part / Double Question',
        badge: 'Cẩm Nang Two-Part Question',
        tip: 'Mỗi câu hỏi của đề bài bắt buộc phải được trả lời triệt để trong 1 đoạn thân bài riêng biệt.',
        gitbookSlug: 'writing/task2-two-part'
      },
      peel: {
        topicId: 'task2-peel-structure',
        category: 'task2',
        subType: 'all',
        title: 'Cấu Trúc Đoạn Văn PEEL & Dàn Bài Toàn Diện Task 2',
        badge: 'Khung Lập Luận PEEL (Band 7.0+)',
        tip: 'Point (Luận điểm) -> Explanation (Giải thích cơ chế) -> Example (Minh họa thực tế) -> Link (Chốt câu hoặc phản biện).',
        gitbookSlug: 'writing/task2-peel-structure'
      },
      hedging: {
        topicId: 'academic-hedging',
        category: 'strategy',
        subType: 'strategy',
        title: 'Academic Hedging & Bộ Cấu Trúc Ngữ Pháp 8.0+',
        badge: 'Academic Hedging (Band 8.0+)',
        tip: 'Tránh các khẳng định tuyệt đối (always, definitely, impossible); dùng cautious language (tend to, arguably, likely).',
        gitbookSlug: 'writing/academic-hedging'
      },
      default: {
        topicId: 'task2-peel-structure',
        category: 'task2',
        subType: 'all',
        title: 'Cấu Trúc Đoạn Văn PEEL & Dàn Bài Toàn Diện Task 2',
        badge: 'Cẩm Nang Toàn Diện Task 2',
        tip: 'Đảm bảo mỗi đoạn thân bài phát triển trọn vẹn 1 ý tưởng trung tâm theo chuẩn Cambridge TR & CC.',
        gitbookSlug: 'writing/task2-peel-structure'
      }
    }
  },
  reading: {
    true_false_not_given: {
      topicId: 'true-false-not-given',
      category: 'reading-types',
      subType: 'tfng',
      title: 'Phá Bẫy True / False / Not Given & Yes / No / Not Given',
      badge: 'Bí Kíp Bẻ Bẫy T/F/NG',
      tip: 'TRUE khi trùng 100% ngữ nghĩa; FALSE khi có bằng chứng trực tiếp mâu thuẫn; NOT GIVEN khi bài không đủ thông tin.',
      gitbookSlug: 'reading/true-false-not-given'
    },
    matching_headings: {
      topicId: 'matching-headings',
      category: 'reading-types',
      subType: 'headings',
      title: 'Tuyệt Chiêu Xử Lý Matching Headings (Nối Tiêu Đề Đoạn)',
      badge: 'Bí Kíp Matching Headings',
      tip: 'Đọc lướt nắm ý chính toàn đoạn, tránh đọc từng từ; cẩn thận bẫy trùng từ đơn lẻ ở câu đầu nhưng lạc đề.',
      gitbookSlug: 'reading/matching-headings'
    },
    multiple_choice: {
      topicId: 'reading-multiple-choice',
      category: 'reading-types',
      subType: 'all',
      title: 'Tuyệt Chiêu Xử Lý Dạng Bài Multiple Choice & Pick Two',
      badge: 'Bí Kíp Multiple Choice',
      tip: 'Dùng phương pháp loại trừ 3 đáp án nhiễu (Quá rộng, Quá hẹp, Trái ngược, Hoặc Không có trong bài).',
      gitbookSlug: 'reading/reading-multiple-choice'
    },
    summary_completion: {
      topicId: 'reading-summary-box-options',
      category: 'reading-types',
      subType: 'all',
      title: 'Tuyệt Chiêu Xử Lý Dạng Summary Completion',
      badge: 'Bí Kíp Summary Completion',
      tip: 'Dự đoán loại từ (danh từ, tính từ, động từ) và dạng số ít/số nhiều trước khi tìm quét từ khóa trong bài.',
      gitbookSlug: 'reading/reading-summary-box-options'
    },
    matching_info: {
      topicId: 'reading-matching-info-features',
      category: 'reading-types',
      subType: 'all',
      title: 'Tuyệt Chiêu Xử Lý Dạng Bài Matching Information to Paragraphs',
      badge: 'Bí Kíp Matching Info',
      tip: 'Làm dạng này sau cùng khi đã định vị và hiểu rõ cấu trúc của toàn bài đọc.',
      gitbookSlug: 'reading/reading-matching-info-features'
    },
    default: {
      topicId: 'time-management',
      category: 'reading-strategy',
      subType: 'overview',
      title: 'Quản Trị Thời Gian Vàng 15 - 20 - 25 Phút (Reading)',
      badge: 'Chiến Thuật Phân Bổ Thời Gian Reading',
      tip: 'Áp dụng quy tắc 15-20-25 phút cho 3 Passage; không bao giờ dừng lại quá 90 giây ở một câu chưa tìm ra đáp án.',
      gitbookSlug: 'reading/time-management'
    }
  },
  listening: {
    map: {
      topicId: 'map-and-signposting',
      category: 'listening-parts',
      subType: 'all',
      title: 'Bản Đồ Map Labelling & Tín Hiệu Chuyển Ý Signposting',
      badge: 'Bí Kíp Bản Đồ (Map Labelling)',
      tip: 'Xác định điểm xuất phát (starting point) và định hướng các hướng Đông-Tây-Nam-Bắc trước khi audio bắt đầu.',
      gitbookSlug: 'listening/map-and-signposting'
    },
    section1: {
      topicId: 'listening-part1-spelling-numbers',
      category: 'listening-parts',
      subType: 'all',
      title: 'Chiến Thuật Part 1: Bẫy Đánh Vần Tên Riêng, Con Số & Địa Chỉ',
      badge: 'Chiến Thuật Listening Part 1',
      tip: 'Cẩn thận bẫy tự sửa (Self-correction: "Oh sorry, actually...") và phân biệt rõ đuôi -teen vs -ty.',
      gitbookSlug: 'listening/listening-part1-spelling-numbers'
    },
    section2: {
      topicId: 'listening-part2-map-directions',
      category: 'listening-parts',
      subType: 'all',
      title: 'Chiến Thuật Part 2: Phá Bẫy Bản Đồ & Độc Thoại Đời Sống',
      badge: 'Chiến Thuật Listening Part 2',
      tip: 'Theo sát các từ chỉ phương hướng và mốc chuyển tiếp trong bài độc thoại hướng dẫn đời sống.',
      gitbookSlug: 'listening/listening-part2-map-directions'
    },
    section3: {
      topicId: 'listening-part3-academic-discussion',
      category: 'listening-parts',
      subType: 'all',
      title: 'Chiến Thuật Part 3: Trắc Nghiệm Học Thuật & Bẫy Đồng Thuận Ảo',
      badge: 'Chiến Thuật Listening Part 3',
      tip: 'Lắng nghe xem hai sinh viên có thực sự đồng ý với nhau hay có sự bác bỏ ngầm (disagreement in disguise).',
      gitbookSlug: 'listening/listening-part3-academic-discussion'
    },
    section4: {
      topicId: 'listening-part4-lecture-signposting',
      category: 'listening-parts',
      subType: 'all',
      title: 'Chiến Thuật Part 4: Bắt Tín Hiệu Chuyển Ý Bài Giảng Học Thuật',
      badge: 'Chiến Thuật Listening Part 4',
      tip: 'Bám chắc tín hiệu chuyển ý (Signposting words) vì bài giảng phát liên tục 1 mạch không có thời gian nghỉ giữa chừng.',
      gitbookSlug: 'listening/listening-part4-lecture-signposting'
    },
    distractors: {
      topicId: 'distractor-traps',
      category: 'listening-strategy',
      subType: 'all',
      title: 'Bẫy Distractor & Đổi Ý Trong IELTS Listening: Chiến Lược Bẻ Bẫy',
      badge: 'Bí Kíp Bẻ Bẫy Distractor Listening',
      tip: 'Tuyệt đối không vội chép đáp án đầu tiên nghe được; người nói thường đổi ý ngay sau từ "but / however / actually".',
      gitbookSlug: 'listening/distractor-traps'
    },
    default: {
      topicId: 'distractor-traps',
      category: 'listening-strategy',
      subType: 'all',
      title: 'Bẫy Distractor & Đổi Ý Trong IELTS Listening: Chiến Lược Bẻ Bẫy',
      badge: 'Chiến Thuật Toàn Diện Listening',
      tip: 'Đọc trước câu hỏi 30 giây và gạch chân từ khóa cố định (tên riêng, số liệu, thuật ngữ) để đón đầu thông tin.',
      gitbookSlug: 'listening/distractor-traps'
    }
  },
  speaking: {
    part1: {
      topicId: 'area-framework-part1',
      category: 'part1',
      subType: 'area',
      title: 'Khung A.R.E.A - Trả Lời Tự Nhiên & Chuẩn Độ Dài Part 1',
      badge: 'Khung Phản Xạ A.R.E.A (Part 1)',
      tip: 'Quy tắc 3 câu vàng: Answer (Trả lời trực diện) -> Reason (Lý do) -> Example / Alternative (Ví dụ mở rộng).',
      gitbookSlug: 'speaking/area-framework-part1'
    },
    part2: {
      topicId: 'storytelling-part2',
      category: 'part2',
      subType: 'storytelling',
      title: 'Kỹ Thuật Storytelling Dòng Thời Gian PPF (Part 2)',
      badge: 'Chiến Thuật Storytelling PPF 2 Phút',
      tip: 'Chia 120s thành 3 chặng: 45s Past (Bối cảnh ban đầu) -> 45s Present (Diễn biến cốt lõi) -> 30s Future (Ý nghĩa & đúc kết).',
      gitbookSlug: 'speaking/storytelling-part2'
    },
    part3: {
      topicId: 'critical-thinking-part3',
      category: 'part3',
      subType: 'critical-thinking',
      title: 'Tư Duy Phản Biện & Ma Trận PEEL Trong Part 3',
      badge: 'Khung Tư Duy Xã Hội P.E.E.L (Part 3)',
      tip: 'Mở rộng góc nhìn từ cá nhân sang tầm vĩ mô xã hội: Point -> Explanation -> Example -> Link to broader society.',
      gitbookSlug: 'speaking/critical-thinking-part3'
    },
    default: {
      topicId: 'speaking-criteria-descriptors',
      category: 'general',
      subType: 'descriptors',
      title: 'Bản Đồ 4 Tiêu Chí Chấm Điểm IELTS Speaking & Ma Trận Thăng Hạng',
      badge: 'Tiêu Chí & Lộ Trình Speaking',
      tip: 'Giám khảo đánh giá Fluency (Độ trôi chảy) cao hơn độ phức tạp từ vựng; duy trì mạch nói tự nhiên và ngữ điệu tự tin.',
      gitbookSlug: 'speaking/speaking-criteria-descriptors'
    }
  },
  'grammar-vocab': {
    complex_sentences: {
      topicId: 'grammar-sentence-structures',
      category: 'grammar',
      subType: 'sentence-structures',
      title: 'A1. Câu Đơn, Câu Ghép, Câu Phức & Mệnh Đề Quan Hệ',
      badge: 'Ngữ Pháp Câu Phức A1',
      tip: 'Kết hợp linh hoạt mệnh đề quan hệ rút gọn và liên từ phụ thuộc để tối ưu điểm GRA Band 7.0+.',
      gitbookSlug: 'grammar-vocab/grammar-sentence-structures'
    },
    conditionals: {
      topicId: 'grammar-conditionals',
      category: 'grammar',
      subType: 'conditionals',
      title: 'A4. Câu Điều Kiện (Conditionals) & Đảo Ngữ Học Thuật',
      badge: 'Ngữ Pháp Điều Kiện A4',
      tip: 'Sử dụng cấu trúc điều kiện loại 2, 3 và đảo ngữ (Were it not for, Had they implemented) để nâng band GRA.',
      gitbookSlug: 'grammar-vocab/grammar-conditionals'
    },
    collocations: {
      topicId: 'vocab-topic-collocations',
      category: 'vocab',
      subType: 'collocations',
      title: 'B3. Academic Collocations Theo 8 Chủ Đề Trọng Tâm',
      badge: 'Từ Vựng Collocations B3',
      tip: 'Học từ theo cụm thay vì từ đơn lẻ để tránh lỗi ghép từ gượng gạo không tự nhiên.',
      gitbookSlug: 'grammar-vocab/vocab-topic-collocations'
    },
    default: {
      topicId: 'grammar-sentence-structures',
      category: 'grammar',
      subType: 'sentence-structures',
      title: 'A1. Câu Đơn, Câu Ghép, Câu Phức & Mệnh Đề Quan Hệ',
      badge: 'Ngữ Pháp & Từ Vựng Trọng Tâm',
      tip: 'Làm chủ 7 chuyên đề ngữ pháp then chốt và 6 chủ điểm từ vựng học thuật để bứt phá lên Band 7.5+.',
      gitbookSlug: 'grammar-vocab/grammar-sentence-structures'
    }
  }
};

export const THEORY_I18N_EN = {
  'task1-map': {
    badge: 'Map Strategy Guide',
    title: 'Task 1: Urban & Layout Map Strategy',
    tip: 'Organize by two time periods or zones; use passive voice and spatial prepositions (to the north of, replaced by).'
  },
  'task1-process': {
    badge: 'Process Diagram Guide',
    title: 'Task 1: Natural & Manufacturing Process Diagrams',
    tip: 'Distinguish between linear and cyclical processes; utilize passive present simple and sequential transitions (initially, subsequently, in the final stage).'
  },
  'task1-line-graph': {
    badge: 'Line Graph Strategy Guide',
    title: 'Task 1: Line Graph (Dynamic Trends)',
    tip: 'Group lines by parallel trends; highlight starting points, extremes, and final positions with academic lexis.'
  },
  'task1-bar-chart': {
    badge: 'Bar Chart Strategy Guide',
    title: 'Task 1: Bar Chart (Dynamic vs Static)',
    tip: 'Distinguish between time-series trends (dynamic) and categorical comparisons (static) to select appropriate lexis and tenses.'
  },
  'task1-pie-chart': {
    badge: 'Pie Chart Strategy Guide',
    title: 'Task 1: Pie Chart (Proportions & Shares)',
    tip: 'Focus on dominating segments (account for the lion\'s share) and significant structural shifts.'
  },
  'task1-table': {
    badge: 'Data Table Strategy Guide',
    title: 'Task 1: Complex Numerical Table Analysis',
    tip: 'Identify maximum and minimum figures; group data logically rather than transcribing every individual number.'
  },
  'task1-mixed': {
    badge: 'Mixed Charts Strategy Guide',
    title: 'Task 1: Multi-Chart Synthesis (Combined Data)',
    tip: 'Dedicate separate body paragraphs to each visualization; the Overview must synthesize primary takeaways from both.'
  },
  'task1-mastery': {
    badge: 'Task 1 Mastery Blueprint',
    title: 'Master Comprehensive IELTS Writing Task 1 Strategy',
    tip: 'A 2-sentence Overview is the heart of Task 1. Omitting it caps Task Achievement at Band 5.0.'
  },
  'task2-opinion': {
    badge: 'Opinion / Agree-Disagree Guide',
    title: 'Task 2: Opinion / Agree or Disagree',
    tip: 'Present a clear position throughout the essay from the introduction without contradiction.'
  },
  'task2-discussion': {
    badge: 'Discussion Essay Guide',
    title: 'Task 2: Discussion (Discuss Both Views and Give Opinion)',
    tip: 'Examine both perspectives objectively; place your supported stance in Body 2 for coherent thesis progression.'
  },
  'task2-problem-solution': {
    badge: 'Problem & Solution Guide',
    title: 'Task 2: Problem & Solution / Causes & Solutions',
    tip: 'Body 1 presents 2 root causes; Body 2 introduces directly corresponding countermeasures.'
  },
  'task2-advantages-disadvantages': {
    badge: 'Advantages & Disadvantages Guide',
    title: 'Task 2: Advantages and Disadvantages / Outweigh',
    tip: 'Analyze both sides objectively and state a decisive stance on whether positive aspects outweigh drawbacks.'
  },
  'task2-two-part': {
    badge: 'Two-Part Question Guide',
    title: 'Task 2: Two-Part / Double Direct Questions',
    tip: 'Address each prompt question in a dedicated body paragraph with direct topic sentences.'
  },
  'task2-peel-structure': {
    badge: 'PEEL Argument Framework',
    title: 'PEEL Paragraph Structure & Task 2 Argument Master',
    tip: 'Point -> Explanation -> Example -> Link guarantees high-level Coherence and Task Response.'
  },
  'academic-hedging': {
    badge: 'Academic Hedging Guide',
    title: 'Academic Hedging & Band 8.0+ Cautious Language',
    tip: 'Avoid absolute assertions (always, definitely, impossible); employ cautious language (tend to, arguably, likely).'
  },
  'true-false-not-given': {
    badge: 'T/F/NG Trap Decoder',
    title: 'True / False / Not Given & Yes / No / Not Given Trap Mastery',
    tip: 'TRUE when meaning matches 100%; FALSE when direct contradiction exists; NOT GIVEN when text lacks sufficient information.'
  },
  'matching-headings': {
    badge: 'Matching Headings Guide',
    title: 'Master Matching Headings to Paragraphs',
    tip: 'Skim for central paragraph gist; beware single-word keyword traps in opening sentences.'
  },
  'reading-multiple-choice': {
    badge: 'Multiple Choice Guide',
    title: 'Multiple Choice & Pick Two Elimination Strategies',
    tip: 'Use process of elimination for distractor options (Too broad, Too narrow, Contradictory, or Not mentioned).'
  },
  'reading-summary-box-options': {
    badge: 'Summary Completion Guide',
    title: 'Summary & Sentence Completion Strategies',
    tip: 'Predict part of speech (noun, adjective, verb) and singular/plural before scanning text keywords.'
  },
  'reading-matching-info-features': {
    badge: 'Matching Information Guide',
    title: 'Matching Information to Paragraphs Strategy',
    tip: 'Complete this question type last once you are thoroughly familiar with the passage layout.'
  },
  'time-management': {
    badge: 'Reading Time Management Guide',
    title: '15 - 20 - 25 Minute Golden Time Management Rule',
    tip: 'Follow the 15-20-25 minute pacing across the 3 Passages; never stall on any single question for over 90 seconds.'
  },
  'map-and-signposting': {
    badge: 'Map Labelling & Signposting Guide',
    title: 'Map Labelling & Audio Signposting Markers',
    tip: 'Locate the starting point and identify directional orientation (North, South, East, West) before audio begins.'
  },
  'listening-part1-spelling-numbers': {
    badge: 'Part 1 Spelling & Numbers Guide',
    title: 'Part 1: Personal Names, Numbers & Address Spelling Traps',
    tip: 'Watch out for speaker self-corrections ("Oh sorry, actually...") and distinguish -teen vs -ty endings.'
  },
  'listening-part2-map-directions': {
    badge: 'Part 2 Maps & Monologue Guide',
    title: 'Part 2: Map Directions & Daily Monologue Traps',
    tip: 'Track directional signals and sequential transition markers throughout the daily informative talk.'
  },
  'listening-part3-academic-discussion': {
    badge: 'Part 3 Academic Discussion Guide',
    title: 'Part 3: Academic Discussion & Pseudo-Consensus Traps',
    tip: 'Listen carefully to see whether speakers genuinely concur or if there is disagreement in disguise.'
  },
  'listening-part4-lecture-signposting': {
    badge: 'Part 4 Lecture Signposting Guide',
    title: 'Part 4: Academic Lecture Signposting Markers',
    tip: 'Follow signposting markers closely as the academic lecture plays continuously without mid-section breaks.'
  },
  'distractor-traps': {
    badge: 'Listening Distractor Trap Decoder',
    title: 'Distractor Traps & Mind-Change in IELTS Listening',
    tip: 'Never rush to write the first heard option; speakers frequently change their mind after "but / however / actually".'
  },
  'area-framework-part1': {
    badge: 'A.R.E.A Reflex Framework (Part 1)',
    title: 'A.R.E.A Framework: Natural & Structured Part 1 Responses',
    tip: 'The 3-sentence formula: Answer (Direct answer) -> Reason (Why) -> Example / Alternative.'
  },
  'storytelling-part2': {
    badge: 'PPF Storytelling Framework (Part 2)',
    title: 'PPF Timeline Storytelling Technique (Part 2)',
    tip: 'Divide 120s into 3 stages: 45s Past context -> 45s Present core actions -> 30s Future reflection.'
  },
  'critical-thinking-part3': {
    badge: 'PEEL Discursive Matrix (Part 3)',
    title: 'Critical Thinking & PEEL Matrix in Part 3',
    tip: 'Broaden perspective from personal experience to societal scale: Point -> Explanation -> Example -> Societal impact.'
  },
  'speaking-criteria-descriptors': {
    badge: 'Speaking Descriptors & Band Matrix',
    title: 'IELTS Speaking 4 Criteria Descriptors & Band Ascent Roadmap',
    tip: 'Examiners prioritize Fluency and Coherence over lexical complexity; maintain natural conversational flow.'
  },
  'grammar-sentence-structures': {
    badge: 'Complex Sentence Grammar A1',
    title: 'A1. Simple, Compound, Complex Sentences & Relative Clauses',
    tip: 'Seamlessly combine reduced relative clauses and subordinating conjunctions to maximize GRA Band 7.0+.'
  },
  'grammar-conditionals': {
    badge: 'Conditional Sentences Grammar A4',
    title: 'A4. Conditionals & Academic Inversion Structures',
    tip: 'Deploy second/third conditionals and inversion (Were it not for, Had they implemented) to boost GRA.'
  },
  'vocab-topic-collocations': {
    badge: 'Topic Collocations B3',
    title: 'B3. Academic Collocations Across 8 Core Topics',
    tip: 'Acquire collocations in natural clusters rather than isolated words to avoid awkward, unnatural phrasing.'
  }
};

function formatTheoryContextResult(matched, skill, isEn) {
  const enMeta = isEn ? THEORY_I18N_EN[matched?.topicId] : null;
  return {
    ...matched,
    skill,
    title: (enMeta && enMeta.title) ? enMeta.title : matched.title,
    badge: (enMeta && enMeta.badge) ? enMeta.badge : matched.badge,
    tip: (enMeta && enMeta.tip) ? enMeta.tip : matched.tip,
    gitbookUrl: getGitBookTopicUrl(matched.gitbookSlug),
    actionLabel: isEn ? 'View Strategy Guide' : (
      skill === 'reading' ? 'Xem Bí Kíp Bẻ Bẫy' :
      skill === 'listening' ? 'Xem Chiến Thuật Nghe' :
      skill === 'speaking' ? 'Xem Cẩm Nang Nói' :
      skill === 'grammar-vocab' ? 'Xem Cẩm Nang Ngữ Pháp' : 'Xem Cẩm Nang Dạng Bài'
    )
  };
}

/**
 * Sinh URL trực tiếp trên GitBook từ slug bài viết
 * @param {string} slug - slug của bài (vd: 'writing/task1-map')
 * @returns {string} URL đầy đủ
 */
export function getGitBookTopicUrl(slug) {
  if (!slug) return getGitBookBaseUrl();
  const cleanSlug = String(slug).replace(/^\/+/, '');
  return `${getGitBookBaseUrl()}/${cleanSlug}`;
}

/**
 * Suy diễn cẩm nang lý thuyết phù hợp nhất theo ngữ cảnh bài học hiện tại
 * @param {object} params
 * @param {string} params.skill - 'writing' | 'reading' | 'listening' | 'speaking' | 'grammar-vocab'
 * @param {number|string} [params.taskNumber] - 1 hoặc 2 (Writing)
 * @param {string} [params.taskType] - Loại bài (map, process, line, bar, opinion, discussion, tfng...)
 * @param {string} [params.prompt] - Văn bản đề bài để quét từ khóa
 * @param {number|string} [params.section] - Phần thi (1, 2, 3, 4)
 * @param {string} [params.questionType] - Loại câu hỏi (true_false_not_given, matching_headings...)
 * @param {boolean} [params.isEn] - Chế độ tiếng Anh
 * @returns {object} Context object đầy đủ thông tin cẩm nang và deep link
 */
export function getTheoryContext({
  skill = 'writing',
  taskNumber = null,
  taskType = '',
  prompt = '',
  section = null,
  questionType = '',
  isEn = null
} = {}) {
  const effectiveIsEn = isEn !== null ? Boolean(isEn) : (typeof window !== 'undefined' ? getLanguage() === 'en' : false);
  const normSkill = String(skill).toLowerCase().trim();
  const normType = String(taskType).toLowerCase().trim();
  const normPrompt = String(prompt).toLowerCase();
  const normQType = String(questionType).toLowerCase().trim();

  // 1. WRITING CONTEXT
  if (normSkill === 'writing') {
    const isTask1 = Number(taskNumber) === 1 || normType.includes('task 1') || normType.includes('chart') || normType.includes('graph');
    const isTask2 = Number(taskNumber) === 2 || normType.includes('task 2') || normType.includes('essay');

    if (isTask1 || (!isTask2 && (normType.includes('line') || normType.includes('bar') || normType.includes('pie') || normType.includes('table') || normType.includes('map') || normType.includes('process')))) {
      const task1Map = CONTEXT_THEORY_MAP.writing.task1;
      let matched = task1Map.default;

      if (normType.includes('map') || normPrompt.includes('map') || normPrompt.includes('plan')) {
        matched = task1Map.map;
      } else if (normType.includes('process') || normType.includes('diagram') || normPrompt.includes('process') || normPrompt.includes('stage') || normPrompt.includes('cycle')) {
        matched = task1Map.process;
      } else if (normType.includes('line') || normPrompt.includes('line graph')) {
        matched = task1Map.line;
      } else if (normType.includes('bar') || normPrompt.includes('bar chart')) {
        matched = task1Map.bar;
      } else if (normType.includes('pie') || normPrompt.includes('pie chart')) {
        matched = task1Map.pie;
      } else if (normType.includes('table') || normPrompt.includes('table')) {
        matched = task1Map.table;
      } else if (normType.includes('mix') || normType.includes('combo') || normType.includes('multiple')) {
        matched = task1Map.mixed;
      }

      return formatTheoryContextResult(matched, 'writing', effectiveIsEn);
    }

    // Task 2
    const task2Map = CONTEXT_THEORY_MAP.writing.task2;
    let matched = task2Map.default;

    if (normType.includes('opinion') || normType.includes('agree') || normPrompt.includes('to what extent do you agree') || normPrompt.includes('agree or disagree')) {
      matched = task2Map.opinion;
    } else if (normType.includes('discuss') || normPrompt.includes('discuss both views')) {
      matched = task2Map.discussion;
    } else if (normType.includes('problem') || normType.includes('cause') || normType.includes('solution') || normPrompt.includes('problems and solutions')) {
      matched = task2Map.problem_solution;
    } else if (normType.includes('advantage') || normType.includes('outweigh') || normPrompt.includes('advantages and disadvantages')) {
      matched = task2Map.advantages_disadvantages;
    } else if (normType.includes('two_part') || normType.includes('double') || normType.includes('direct')) {
      matched = task2Map.two_part;
    }

    return formatTheoryContextResult(matched, 'writing', effectiveIsEn);
  }

  // 2. READING CONTEXT
  if (normSkill === 'reading') {
    const readingMap = CONTEXT_THEORY_MAP.reading;
    let matched = readingMap.default;

    if (normQType.includes('true_false') || normQType.includes('tfng') || normQType.includes('yes_no') || normType.includes('tfng')) {
      matched = readingMap.true_false_not_given;
    } else if (normQType.includes('heading') || normType.includes('heading')) {
      matched = readingMap.matching_headings;
    } else if (normQType.includes('multiple_choice') || normType.includes('choice')) {
      matched = readingMap.multiple_choice;
    } else if (normQType.includes('summary') || normQType.includes('sentence_completion') || normType.includes('completion')) {
      matched = readingMap.summary_completion;
    } else if (normQType.includes('matching_features') || normQType.includes('matching_info')) {
      matched = readingMap.matching_info;
    }

    return formatTheoryContextResult(matched, 'reading', effectiveIsEn);
  }

  // 3. LISTENING CONTEXT
  if (normSkill === 'listening') {
    const listeningMap = CONTEXT_THEORY_MAP.listening;
    const sec = Number(section);
    let matched = listeningMap.default;

    if (normQType.includes('map') || normType.includes('map') || normPrompt.includes('map')) {
      matched = listeningMap.map;
    } else if (sec === 1 || normType.includes('part 1') || normType.includes('form') || normType.includes('spelling')) {
      matched = listeningMap.section1;
    } else if (sec === 2 || normType.includes('part 2')) {
      matched = listeningMap.section2;
    } else if (sec === 3 || normType.includes('part 3')) {
      matched = listeningMap.section3;
    } else if (sec === 4 || normType.includes('part 4') || normType.includes('lecture')) {
      matched = listeningMap.section4;
    }

    return formatTheoryContextResult(matched, 'listening', effectiveIsEn);
  }

  // 4. SPEAKING CONTEXT
  if (normSkill === 'speaking') {
    const speakingMap = CONTEXT_THEORY_MAP.speaking;
    let matched = speakingMap.default;

    if (normType.includes('part 1') || normType.includes('p1') || Number(section) === 1) {
      matched = speakingMap.part1;
    } else if (normType.includes('part 2') || normType.includes('p2') || normType.includes('cue') || Number(section) === 2) {
      matched = speakingMap.part2;
    } else if (normType.includes('part 3') || normType.includes('p3') || Number(section) === 3) {
      matched = speakingMap.part3;
    }

    return formatTheoryContextResult(matched, 'speaking', effectiveIsEn);
  }

  // 5. GRAMMAR & VOCAB
  const gvMap = CONTEXT_THEORY_MAP['grammar-vocab'];
  const matched = gvMap.default;
  return formatTheoryContextResult(matched, 'grammar-vocab', effectiveIsEn);
}

/**
 * Kích hoạt mở modal TheoryHandbookModal theo đúng ngữ cảnh bài học
 * @param {object} context - kết quả từ getTheoryContext()
 */
export function openTheoryModalWithContext(context) {
  if (!context) {
    openModal('theory');
    return;
  }

  openModal('theory', {
    skill: context.skill || 'writing',
    category: context.category || 'all',
    subType: context.subType || 'all',
    topicId: context.topicId || null,
    searchQuery: context.title || ''
  });
}
