/**
 * Cambridge Distractor Trap Decoder Service
 * Deep pedagogical analysis of IELTS Reading & Listening traps.
 * Deconstructs why candidates get lured into wrong answers and prescribes 3-second reflex rules.
 */

export const TRAP_ARCHETYPES = {
  LISTENING_PIVOT: {
    id: 'LISTENING_PIVOT',
    titleVi: 'Bẫy Bẻ Lái 180 Độ & Tự Đính Chính (Turnaround Pivot)',
    titleEn: '180-Degree Turnaround & Self-Correction Trap',
    category: 'listening',
    badgeColor: 'rose',
    icon: 'RotateCcw',
    severity: 'critical',
    whyYouChoseThis: 'Tai bạn bắt được thông tin ban đầu phát âm rất to và rõ ràng, khiến bạn vội vàng ghi ngay vào giấy mà không ngờ người nói sẽ tự sửa sai ngay câu kế tiếp.',
    examinerBlueprint: 'Giám khảo cố ý đưa ra phương án A (dự định cũ / phương án chưa giảm giá), sau đó dùng liên từ bẻ lái ("Actually", "Wait a second", "On second thought", "However") để chốt phương án B.',
    reflexActionTip: 'Khi nghe thấy các từ tín hiệu bẻ lái (Actually, However, Instead, But, Sorry), hãy dừng bút 2 giây! Luôn ưu tiên thông tin cuối cùng được xác nhận.',
    signposts: ['actually', 'in fact', 'wait', 'hold on', 'sorry', 'however', 'instead', 'initially', 'used to', 'planned to', 'on second thought', 'changed my mind']
  },

  FALSE_SYNONYM: {
    id: 'FALSE_SYNONYM',
    titleVi: 'Bẫy Trùng Từ / Đồng Nghĩa Giả (Word-Spotting Trap)',
    titleEn: 'False Synonym & Exact Word-Match Trap',
    category: 'reading',
    badgeColor: 'amber',
    icon: 'FileSearch',
    severity: 'high',
    whyYouChoseThis: 'Mắt bạn quét thấy từ ngữ trong câu hỏi xuất hiện y hệt 100% trong đoạn văn (Word Match), tạo cảm giác an tâm giả tạo khiến bạn chọn ngay đáp án này.',
    examinerBlueprint: 'Giám khảo cố tình sao chép nguyên xi từ khóa từ đề bài vào một câu trong bài đọc nhưng ngữ cảnh bị phủ định, thuộc về chủ thể khác, hoặc bị giới hạn điều kiện.',
    reflexActionTip: 'Quy tắc vàng Cambridge: "Từ nào giống hệt 100% bài đọc thường là bẫy mồi nhử. Đáp án đúng hầu như luôn được PARAPHRASE bằng từ đồng nghĩa hoặc đổi dạng từ."',
    signposts: ['identical word', 'exact match', 'word spotting']
  },

  OVER_GENERALIZATION: {
    id: 'OVER_GENERALIZATION',
    titleVi: 'Bẫy Khái Quát Hóa & Suy Diễn Quá Mức (NOT GIVEN Trap)',
    titleEn: 'Over-Generalization & Scope Creep Trap',
    category: 'reading',
    badgeColor: 'indigo',
    icon: 'HelpCircle',
    severity: 'high',
    whyYouChoseThis: 'Bạn dùng kiến thức thực tế bên ngoài hoặc suy diễn logic cá nhân để khẳng định điều bài đọc không đề cập, dẫn tới nhầm lẫn kinh điển giữa FALSE và NOT GIVEN.',
    examinerBlueprint: 'Đoạn văn chỉ khẳng định phạm vi hẹp ("some", "often", "partially", "likely"), nhưng câu hỏi lại đẩy lên mức tuyệt đối hoặc suy luận một bước xa hơn mà tác giả không hề viết.',
    reflexActionTip: 'Nếu câu hỏi nói nhiều hơn hoặc khẳng định điều bài đọc "không nhắc đến cũng không phủ nhận", hãy mạnh dạn chọn NOT GIVEN. Không bao giờ suy đoán ngoài trang giấy!',
    signposts: ['not given', 'false vs not given', 'scope creep', 'over-extrapolation']
  },

  EXTREME_ABSOLUTE: {
    id: 'EXTREME_ABSOLUTE',
    titleVi: 'Bẫy Từ Tuyệt Đối Hóa (Extreme Modifiers Trap)',
    titleEn: 'Extreme Absolute Modifiers Trap',
    category: 'reading',
    badgeColor: 'purple',
    icon: 'AlertTriangle',
    severity: 'medium',
    whyYouChoseThis: 'Bạn bị lừa bởi các phương án có chứa từ ngữ khẳng định mạnh mẽ, tưởng rằng đó là điểm mấu chốt của tác giả.',
    examinerBlueprint: 'Giám khảo cài các từ tuyệt đối ("all", "always", "only", "never", "completely", "impossible", "proven") vào phương án sai. Trong văn phong học thuật, tác giả luôn dùng ngôn ngữ thận trọng (Hedging).',
    reflexActionTip: 'Gặp các từ tuyệt đối như ONLY, ALWAYS, ALL, IMPOSSIBLE trong trắc nghiệm hay T/F/NG, 90% khả năng đó là phương án SAI. Hãy tìm các sắc thái dè dặt (tend to, may, largely).',
    signposts: ['only', 'always', 'all', 'never', 'completely', 'impossible', 'entirely', 'solely']
  },

  NUMERICAL_DISTRACTOR: {
    id: 'NUMERICAL_DISTRACTOR',
    titleVi: 'Bẫy Số Liệu & Đơn Vị Nhiễu (Multi-Number Distractor)',
    titleEn: 'Numerical & Unit Distractor Trap',
    category: 'both',
    badgeColor: 'emerald',
    icon: 'Hash',
    severity: 'high',
    whyYouChoseThis: 'Có quá nhiều con số (giá cả, ngày tháng, thời gian, số lượng) xuất hiện liên tiếp trong cùng một đoạn, khiến bạn ghi lại con số đầu tiên mà không chú ý đơn vị hoặc điều kiện đi kèm.',
    examinerBlueprint: 'Người nói nhắc tới giá người lớn và trẻ em, hoặc giá gốc và giá sau khi giảm voucher (£20 vs £15), hoặc ngày dự kiến vs ngày thực tế xuất phát.',
    reflexActionTip: 'Khoanh tròn câu hỏi hỏi về: "Per person hay total?", "Discounted price hay standard rate?", "Departure time hay arrival time?". Xác định đúng đối tượng số trước khi chốt đáp án!',
    signposts: ['prices', 'dates', 'times', 'discounts', 'units', 'currency']
  },

  OPPOSITE_MEANING: {
    id: 'OPPOSITE_MEANING',
    titleVi: 'Bẫy Phủ Định Ẩn & Ngược Nghĩa (Negative Inversion)',
    titleEn: 'Negative Inversion & Hidden Negation Trap',
    category: 'both',
    badgeColor: 'rose',
    icon: 'ShieldAlert',
    severity: 'high',
    whyYouChoseThis: 'Bài đọc sử dụng các từ mang nghĩa phủ định ẩn (seldom, barely, rarely, fail to, lack of, dispute) khiến bạn hiểu lầm câu đó đang khẳng định tích cực.',
    examinerBlueprint: 'Thay vì dùng "not", đề thi dùng tiền tố phủ định (un-, in-, dis-) hoặc phó từ bán phủ định (scarcely, hardly) để làm lu mờ ý nghĩa trái ngược.',
    reflexActionTip: 'Chú ý các tiền tố (inaccurate, misunderstand) và động từ tranh chấp (refute, deny, contest). Đừng chỉ nhìn vào danh từ chính mà bỏ qua sắc thái đảo ngược của vị ngữ!',
    signposts: ['barely', 'rarely', 'hardly', 'scarcely', 'fail to', 'lack of', 'refute', 'dispute']
  }
};

/**
 * Intelligent Algorithmic Trap Analyzer for IELTS Reading & Listening
 * Runs 100% offline and instantly pinpoints the exact Cambridge distractor pattern.
 */
export function analyzeDistractorTrap({
  question = {},
  userAnswer = '',
  correctAnswer = '',
  passageText = '',
  evidenceQuote = '',
  skill = 'reading'
}) {
  const user = String(userAnswer || '').trim().toLowerCase();
  const correct = String(correctAnswer || question.answer || '').trim().toLowerCase();
  const qText = String(question.questionText || '').toLowerCase();
  const quote = String(evidenceQuote || question.evidenceQuote || '').toLowerCase();
  const qType = String(question.type || '').toUpperCase();
  const combinedContext = `${qText} ${quote} ${passageText || ''}`.toLowerCase();

  // 1. Listening Turnaround Pivot detection
  if (skill === 'listening' || question.evidenceTimestamp !== undefined) {
    const hasPivotSignpost = TRAP_ARCHETYPES.LISTENING_PIVOT.signposts.some(sp => 
      quote.includes(sp) || combinedContext.includes(sp)
    );
    if (hasPivotSignpost) {
      return {
        ...TRAP_ARCHETYPES.LISTENING_PIVOT,
        matchedSignpost: TRAP_ARCHETYPES.LISTENING_PIVOT.signposts.find(sp => quote.includes(sp) || combinedContext.includes(sp))
      };
    }
  }

  // 2. Numerical / Measurement / Unit Trap detection
  const hasNumbers = /\b\d+(\.\d+)?\b/.test(correct) || /[\$£€%]/.test(correct) || /[\$£€%]/.test(user);
  const multipleNumbersInContext = (quote.match(/\b\d+\b/g) || []).length >= 2;
  if (hasNumbers || multipleNumbersInContext) {
    return TRAP_ARCHETYPES.NUMERICAL_DISTRACTOR;
  }

  // 3. True/False/Not Given - Over-generalization / Scope Creep Trap
  const isTFNG = qType.includes('TFNG') || qType.includes('TRUE') || qType.includes('NOT GIVEN') || qType.includes('YES/NO');
  if (isTFNG) {
    if (correct.includes('not given') && (user.includes('false') || user.includes('no') || user.includes('true') || user.includes('yes'))) {
      return TRAP_ARCHETYPES.OVER_GENERALIZATION;
    }
    if (user.includes('not given') && (correct.includes('false') || correct.includes('no'))) {
      return TRAP_ARCHETYPES.OPPOSITE_MEANING;
    }
    if ((user.includes('true') || user.includes('yes')) && (correct.includes('false') || correct.includes('no'))) {
      return TRAP_ARCHETYPES.OPPOSITE_MEANING;
    }
  }

  // 4. Extreme Absolute Modifiers Trap detection
  const hasExtremeInQuestion = TRAP_ARCHETYPES.EXTREME_ABSOLUTE.signposts.some(word => 
    qText.split(/\s+/).includes(word)
  );
  if (hasExtremeInQuestion) {
    return TRAP_ARCHETYPES.EXTREME_ABSOLUTE;
  }

  // 5. Negative Inversion / Hidden Negation detection
  const hasNegativeSignposts = TRAP_ARCHETYPES.OPPOSITE_MEANING.signposts.some(neg => 
    quote.includes(neg) || qText.includes(neg)
  );
  if (hasNegativeSignposts) {
    return TRAP_ARCHETYPES.OPPOSITE_MEANING;
  }

  // 6. False Synonym / Word Match Trap (Default for Reading when words repeat)
  if (skill === 'reading') {
    // Check if question words appear verbatim in quote
    const qWords = qText.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 5);
    const verbatimHits = qWords.filter(w => quote.includes(w));
    if (verbatimHits.length >= 2) {
      return {
        ...TRAP_ARCHETYPES.FALSE_SYNONYM,
        repeatedKeywords: verbatimHits.slice(0, 3)
      };
    }
    return TRAP_ARCHETYPES.FALSE_SYNONYM;
  }

  // Fallback for listening
  if (skill === 'listening') {
    return TRAP_ARCHETYPES.LISTENING_PIVOT;
  }

  // Default fallback
  return TRAP_ARCHETYPES.FALSE_SYNONYM;
}
