/**
 * Daily Error Prescription & Spaced Repetition Service (SRS)
 * 
 * Automatically synthesizes mistakes from Writing submissions & Speaking feedback
 * into targeted daily 3-minute mini-quizzes to eliminate recurring errors.
 */

// Classic Vietnamese IELTS Common Traps (Used as golden baseline or when student has few logged mistakes)
export const DEFAULT_IELTS_TRAPS = [
  {
    id: 'trap-article-sing-count',
    category: 'grammar',
    type: 'Mạo từ (Articles)',
    title: 'Thiếu mạo từ trước danh từ đếm được số ít',
    sentence: 'Government should allocate more budget to renewable energy.',
    errorSample: 'Government should allocate more budget to renewable energy.',
    correctSentence: 'The government should allocate more budget to renewable energy.',
    correctSample: 'The government should allocate more budget to renewable energy.',
    options: [
      'Government should allocate more budget to renewable energy.',
      'The government should allocate more budget to renewable energy.',
      'A governments should allocate more budget to renewable energy.'
    ],
    correctIndex: 1,
    quiz: {
      question: 'Thiếu mạo từ trước danh từ đếm được số ít',
      options: [
        'Government should allocate more budget to renewable energy.',
        'The government should allocate more budget to renewable energy.',
        'A governments should allocate more budget to renewable energy.'
      ],
      correctIndex: 1,
      tip: 'Quy tắc: Không bao giờ để danh từ đếm được số ít (singular countable noun) đứng một mình mà không có a / an / the / my / this.'
    },
    explanation: 'Trong tiếng Anh học thuật, danh từ đếm được số ít "government" không được đứng trơ trọi. Phải dùng mạo từ xác định "The government" hoặc danh từ số nhiều "Governments".',
    ruleTip: 'Quy tắc: Không bao giờ để danh từ đếm được số ít (singular countable noun) đứng một mình mà không có a / an / the / my / this.'
  },
  {
    id: 'trap-past-tense-task1',
    category: 'grammar',
    type: 'Thì động từ (Tense Consistency)',
    title: 'Nhầm lẫn thì hiện tại khi miêu tả dữ liệu quá khứ (Task 1)',
    sentence: 'Between 2010 and 2020, the proportion of car owners increases significantly.',
    errorSample: 'Between 2010 and 2020, the proportion of car owners increases significantly.',
    correctSentence: 'Between 2010 and 2020, the proportion of car owners increased significantly.',
    correctSample: 'Between 2010 and 2020, the proportion of car owners increased significantly.',
    options: [
      'Between 2010 and 2020, the proportion of car owners increases significantly.',
      'Between 2010 and 2020, the proportion of car owners was increasing significantly.',
      'Between 2010 and 2020, the proportion of car owners increased significantly.'
    ],
    correctIndex: 2,
    quiz: {
      question: 'Nhầm lẫn thì hiện tại khi miêu tả dữ liệu quá khứ (Task 1)',
      options: [
        'Between 2010 and 2020, the proportion of car owners increases significantly.',
        'Between 2010 and 2020, the proportion of car owners was increasing significantly.',
        'Between 2010 and 2020, the proportion of car owners increased significantly.'
      ],
      correctIndex: 2,
      tip: 'Quy tắc Task 1: Luôn kiểm tra mốc thời gian trên biểu đồ. Nếu năm trong quá khứ, 100% động từ miêu tả xu hướng phải ở quá khứ đơn.'
    },
    explanation: 'Mốc thời gian "Between 2010 and 2020" là sự kiện đã kết thúc hoàn toàn trong quá khứ, bắt buộc phải dùng thì Quá khứ đơn (Past Simple: increased).',
    ruleTip: 'Quy tắc Task 1: Luôn kiểm tra mốc thời gian trên biểu đồ. Nếu năm trong quá khứ, 100% động từ miêu tả xu hướng phải ở quá khứ đơn.'
  },
  {
    id: 'trap-subject-verb-everyone',
    category: 'grammar',
    type: 'Hòa hợp Chủ - Vị (Subject-Verb Agreement)',
    title: 'Chia sai động từ với đại từ bất định (Everyone / Everybody)',
    sentence: 'Everyone in modern society have the right to access clean water.',
    errorSample: 'Everyone in modern society have the right to access clean water.',
    correctSentence: 'Everyone in modern society has the right to access clean water.',
    correctSample: 'Everyone in modern society has the right to access clean water.',
    options: [
      'Everyone in modern society have the right to access clean water.',
      'Everyone in modern society has the right to access clean water.',
      'Everyone in modern societies have the right to access clean water.'
    ],
    correctIndex: 1,
    quiz: {
      question: 'Chia sai động từ với đại từ bất định (Everyone / Everybody)',
      options: [
        'Everyone in modern society have the right to access clean water.',
        'Everyone in modern society has the right to access clean water.',
        'Everyone in modern societies have the right to access clean water.'
      ],
      correctIndex: 1,
      tip: 'Quy tắc: Everyone, Everybody, Nobody, Someone, Each + Danh từ đều luôn đi với động từ số ít.'
    },
    explanation: '"Everyone / Everybody / Each person" là đại từ số ít theo ngữ pháp tiếng Anh, do đó động từ chính phải chia số ít: "has", không dùng "have".',
    ruleTip: 'Quy tắc: Everyone, Everybody, Nobody, Someone, Each + Danh từ đều luôn đi với động từ số ít.'
  },
  {
    id: 'trap-although-but-redundancy',
    category: 'syntax',
    type: 'Dư thừa liên từ (Conjunction Redundancy)',
    title: 'Dùng đồng thời "Although" và "But" trong cùng một câu',
    sentence: 'Although public transport is cheap, but many citizens still prefer private cars.',
    errorSample: 'Although public transport is cheap, but many citizens still prefer private cars.',
    correctSentence: 'Although public transport is cheap, many citizens still prefer private cars.',
    correctSample: 'Although public transport is cheap, many citizens still prefer private cars.',
    options: [
      'Although public transport is cheap, but many citizens still prefer private cars.',
      'Although public transport is cheap, many citizens still prefer private cars.',
      'Even though public transport is cheap, but many citizens still prefer private cars.'
    ],
    correctIndex: 1,
    quiz: {
      question: 'Dùng đồng thời "Although" và "But" trong cùng một câu',
      options: [
        'Although public transport is cheap, but many citizens still prefer private cars.',
        'Although public transport is cheap, many citizens still prefer private cars.',
        'Even though public transport is cheap, but many citizens still prefer private cars.'
      ],
      correctIndex: 1,
      tip: 'Quy tắc: Chỉ chọn 1 trong 2: Hoặc dùng "Although A, B" hoặc dùng "A, but B". Không bao giờ đi chung.'
    },
    explanation: 'Tiếng Việt thường quen nói "Mặc dù... nhưng...". Tuy nhiên trong tiếng Anh, nếu đã dùng liên từ phụ thuộc "Although/Even though" thì mệnh đề chính KHÔNG ĐƯỢC dùng "but".',
    ruleTip: 'Quy tắc: Chỉ chọn 1 trong 2: Hoặc dùng "Although A, B" hoặc dùng "A, but B". Không bao giờ đi chung.'
  },
  {
    id: 'trap-collocation-preposition',
    category: 'vocabulary',
    type: 'Giới từ đi kèm (Dependent Prepositions)',
    title: 'Sai giới từ trong Academic Collocation phổ biến',
    sentence: 'The economic prosperity of a nation depends in the education of its youth.',
    errorSample: 'The economic prosperity of a nation depends in the education of its youth.',
    correctSentence: 'The economic prosperity of a nation depends on the education of its youth.',
    correctSample: 'The economic prosperity of a nation depends on the education of its youth.',
    options: [
      'The economic prosperity of a nation depends in the education of its youth.',
      'The economic prosperity of a nation depends on the education of its youth.',
      'The economic prosperity of a nation depends with the education of its youth.'
    ],
    correctIndex: 1,
    quiz: {
      question: 'Sai giới từ trong Academic Collocation phổ biến',
      options: [
        'The economic prosperity of a nation depends in the education of its youth.',
        'The economic prosperity of a nation depends on the education of its youth.',
        'The economic prosperity of a nation depends with the education of its youth.'
      ],
      correctIndex: 1,
      tip: 'Quy tắc: Nhớ theo cụm: depend on, rely on, focus on, contribute to, attribute to, result in.'
    },
    explanation: 'Động từ "depend" bắt buộc đi với giới từ "on" hoặc "upon" (depend on sth), không dùng "depend in" hay "depend with".',
    ruleTip: 'Quy tắc: Nhớ theo cụm: depend on, rely on, focus on, contribute to, attribute to, result in.'
  }
];

export const VIETNAMESE_IELTS_TRAPS = DEFAULT_IELTS_TRAPS;

/**
 * Generates the daily personalized error prescription for the user.
 * Combines user-logged mistakes with high-yield Cambridge traps.
 * @param {Array} userMistakes - Array of mistake objects from mistakeLog
 * @param {Array} submissions - Writing/Speaking submissions history
 * @returns {object} Daily prescription package with 3-5 curated questions
 */
export function generateDailyPrescription(userMistakes = [], submissions = []) {
  const todayDateStr = new Date().toISOString().slice(0, 10);
  
  // 1. Transform user mistakes into quiz items
  const customItems = (userMistakes || [])
    .filter(m => m.original && m.corrected && m.original !== m.corrected)
    .slice(0, 3)
    .map((m, index) => {
      const original = m.original.trim();
      const corrected = m.corrected.trim();
      const distractor = original.endsWith('.') ? original.slice(0, -1) + ' (incorrect).' : `${original} (incorrect)`;

      const rawOptions = [original, corrected, distractor];
      // Deterministic order with correct answer present
      const uniqueOptions = Array.from(new Set(rawOptions));
      while (uniqueOptions.length < 3) {
        uniqueOptions.push(`In fact, ${original}`);
      }

      const options = uniqueOptions.slice(0, 3);
      const correctIndex = options.indexOf(corrected) >= 0 ? options.indexOf(corrected) : 0;

      const rule = m.rule || m.explanation || `Câu đúng chuẩn ngữ pháp Cambridge: "${corrected}".`;

      return {
        id: `user-mistake-${m.id || index}-${Date.now()}`,
        category: m.category || m.type || 'grammar',
        type: m.category ? `${m.category.toUpperCase()}` : 'Lỗi từ bài viết của bạn',
        title: `Sửa lỗi sai từ bài viết: "${original.slice(0, 45)}..."`,
        sentence: original,
        errorSample: original,
        correctSentence: corrected,
        correctSample: corrected,
        options,
        correctIndex,
        quiz: {
          question: `Sửa lỗi sai: "${original.slice(0, 50)}"`,
          options,
          correctIndex,
          tip: rule
        },
        explanation: rule,
        ruleTip: 'Hãy ghi nhớ lỗi sai này để không lặp lại trong các bài thi thử tiếp theo.'
      };
    });

  // 2. Extract weaknesses from recent submissions if user has fewer than 2 mistakes
  const submissionItems = [];
  if (customItems.length < 2 && Array.isArray(submissions) && submissions.length > 0) {
    for (const sub of submissions) {
      const weaknesses = sub?.evaluation?.gra?.weaknesses || sub?.evaluation?.lr?.weaknesses || [];
      for (const w of weaknesses) {
        if (typeof w === 'string' && w.length > 10 && submissionItems.length < 2) {
          submissionItems.push({
            id: `sub-weakness-${submissionItems.length}`,
            category: 'grammar',
            type: 'Điểm yếu ghi nhận từ bài chấm AI',
            title: `Khắc phục điểm yếu: ${w.slice(0, 45)}...`,
            sentence: w,
            errorSample: w,
            correctSentence: 'Apply varied clause structures and accurate punctuation according to Cambridge Band 7.5+ criteria.',
            correctSample: 'Apply varied clause structures and accurate punctuation according to Cambridge Band 7.5+ criteria.',
            options: [
              'Continue relying on simple sentence structures without revision.',
              'Apply varied clause structures and accurate punctuation according to Cambridge Band 7.5+ criteria.',
              'Ignore punctuation rules in fast exam conditions.'
            ],
            correctIndex: 1,
            quiz: {
              question: `Khắc phục điểm yếu: ${w.slice(0, 50)}`,
              options: [
                'Continue relying on simple sentence structures without revision.',
                'Apply varied clause structures and accurate punctuation according to Cambridge Band 7.5+ criteria.',
                'Ignore punctuation rules in fast exam conditions.'
              ],
              correctIndex: 1,
              tip: w
            },
            explanation: w,
            ruleTip: 'Được ghi nhận từ bài chấm chi tiết gần đây của bạn.'
          });
        }
      }
    }
  }

  // Combine items
  const combinedItems = [...customItems, ...submissionItems];
  
  for (const trap of DEFAULT_IELTS_TRAPS) {
    if (combinedItems.length >= 5) break;
    if (!combinedItems.some(i => i.id === trap.id)) {
      combinedItems.push(trap);
    }
  }

  // Calculate mastery stats
  let totalMastered = 0;
  try {
    if (typeof localStorage !== 'undefined') {
      const rawSaved = localStorage.getItem('ielts_prescription_history');
      if (rawSaved) {
        const history = JSON.parse(rawSaved);
        totalMastered = Object.values(history).filter(h => h.completed).length;
      }
    }
  } catch (e) {}

  const isPersonalized = customItems.length > 0 || submissionItems.length > 0;

  return {
    id: `rx-${todayDateStr}`,
    date: todayDateStr,
    totalItems: combinedItems.length,
    totalQuestions: combinedItems.length,
    estimatedMinutes: 3,
    isPersonalized,
    items: combinedItems,
    questions: combinedItems,
    totalMastered,
    summaryAdvice: isPersonalized
      ? `Đơn thuốc hôm nay kết hợp ${customItems.length + submissionItems.length} lỗi sai thực tế từ bài làm gần đây của bạn và các bẫy ngữ pháp Cambridge kinh điển.`
      : 'Đơn thuốc khởi động: 5 bẫy ngữ pháp kinh điển học viên Việt Nam hay mất điểm nhất trong phòng thi IELTS.'
  };
}

/**
 * Saves a completed daily prescription record into localStorage.
 * @param {string} dateStr 
 * @param {number} score 
 * @param {number} total 
 */
export function recordPrescriptionCompletion(dateStr, score, total) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('ielts_prescription_history');
      const history = raw ? JSON.parse(raw) : {};
      history[dateStr] = {
        completed: true,
        score,
        total,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('ielts_prescription_history', JSON.stringify(history));
    }
  } catch (e) {}
}
