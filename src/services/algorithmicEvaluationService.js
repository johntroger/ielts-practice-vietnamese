/**
 * Cambridge Algorithmic Evaluator Service (Deep Linguistic Heuristic Engine v4)
 * Independent high-precision IELTS Writing evaluation engine.
 * Graded strictly against official Cambridge Band Descriptors (TR/TA, CC, LR, GRA).
 *
 * Modular Architecture (Phase 3):
 * - Rule Catalogs & Knowledge Bases -> ./evaluation/evaluationRuleCatalogs.js
 * - Task 1 & Task 2 Linguistic Analyzers -> ./evaluation/task1AndTask2Analyzers.js
 * - Lexical, Grammar & Paragraph Analyzers -> ./evaluation/lexicalAndGrammarAnalyzers.js
 */

import { lookupTopicCollocations } from '../data/academicThesaurus.js';
import { IELTS_SPELLING_TRAPS } from '../data/vocabGrammarSpellingData.js';

import {
  STOPWORDS,
  ACADEMIC_LEXICON,
  ACADEMIC_COLLOCATIONS,
  COHESIVE_DEVICES,
  REFERENCING_PATTERNS,
  OVERVIEW_INDICATORS,
  INFORMAL_WORDS,
  SUBJECT_VERB_TRAPS,
  NOUN_AGREEMENT_TRAPS,
  PREPOSITION_COLLOCATION_TRAPS,
  COMPARATIVE_AND_WORD_FORM_TRAPS,
  UNCOUNTABLE_NOUN_TRAPS,
  BARE_NOUN_AND_ARTICLE_TRAPS,
  COMMON_GRAMMAR_PATTERNS
} from './evaluation/evaluationRuleCatalogs.js';

import {
  sanitizeWords,
  getSentences,
  getParagraphs,
  roundToCambridgeBand,
  calculateOverallWritingBand,
  analyzePromptVerbatimCopying,
  analyzePromptSemanticRelevance,
  extractTask1RawDataPoints,
  analyzeTask1Overview,
  analyzeTask1DataDensity,
  TASK1_COMPARATIVE_PATTERNS,
  analyzeTask1Comparisons,
  detectTask1Subtype,
  MAP_SPATIAL_PATTERNS,
  PROCESS_SEQUENTIAL_PATTERNS,
  analyzeTask1MapFeatures,
  analyzeTask1ProcessFeatures,
  analyzeTask2Fulfillment
} from './evaluation/task1AndTask2Analyzers.js';

import {
  analyzeWordOveruse,
  analyzeCommaSplices,
  HEDGING_PATTERNS,
  OVERGENERALISATION_PATTERNS,
  analyzeHedgingAndOvergeneralisation,
  analyzeParagraphsDeeply,
  generateExaminerActionPlan
} from './evaluation/lexicalAndGrammarAnalyzers.js';

// Re-export all public analyzers & constants for backward compatibility across tests and components
export {
  sanitizeWords,
  getSentences,
  getParagraphs,
  roundToCambridgeBand,
  calculateOverallWritingBand,
  extractTask1RawDataPoints,
  analyzeTask1Overview,
  analyzeTask1DataDensity,
  TASK1_COMPARATIVE_PATTERNS,
  analyzeTask1Comparisons,
  detectTask1Subtype,
  MAP_SPATIAL_PATTERNS,
  PROCESS_SEQUENTIAL_PATTERNS,
  analyzeTask1MapFeatures,
  analyzeTask1ProcessFeatures,
  analyzeTask2Fulfillment,
  analyzeWordOveruse,
  analyzeCommaSplices,
  HEDGING_PATTERNS,
  OVERGENERALISATION_PATTERNS,
  analyzeHedgingAndOvergeneralisation
};

// -------------------------------------------------------------
// CORE ALGORITHM EVALUATOR ENGINE (v4 CHIEF EXAMINER STRICT STANDARD)
// -------------------------------------------------------------

/**
 * Evaluates essay algorithmically following official Cambridge IELTS Band Descriptors (Band 1.0 to 9.0).
 *
 * @param {Object} params
 * @param {Object} params.task - IELTS Task object (taskNumber, type, prompt, minWords, topic)
 * @param {string} params.essayText - Candidate's written essay
 * @returns {Object} Full structured evaluation matching Gemini Data Contract
 */
export function evaluateEssayAlgorithmically({ task, essayText }) {
  if (!essayText || typeof essayText !== 'string' || essayText.trim().length === 0) {
    throw new Error('Vui lòng nhập bài viết để giám khảo chấm điểm.');
  }

  const rawWords = sanitizeWords(essayText);
  const rawWordCount = rawWords.length;
  const isTask1 = task?.taskNumber === 1;
  const task1Subtype = isTask1 ? detectTask1Subtype(task, essayText) : null;
  const targetMinWords = task?.minWords || (isTask1 ? 150 : 250);
  const sentences = getSentences(essayText);
  const paragraphs = getParagraphs(essayText);

  // 1. Prompt Verbatim Copying Deduction (Official Cambridge Regulation)
  const promptCopying = analyzePromptVerbatimCopying(task?.prompt, essayText);
  const copiedWordCount = promptCopying.totalCopiedWords;
  const wordCount = Math.max(0, rawWordCount - copiedWordCount); // Effective Word Count

  // Band 1.0 Non-user Immediate Handling (< 35 effective words)
  if (wordCount < 35) {
    const feedbackMsg = `Theo khung chuẩn khảo thí Cambridge IELTS Band Descriptors, bài viết dưới 35 từ hợp lệ (đạt ${wordCount}/${targetMinWords} từ${copiedWordCount > 0 ? `, đã trừ ${copiedWordCount} từ sao chép đề bài` : ''}) thuộc khung "Band 1.0 - Non-user" (Không thể sử dụng ngôn ngữ ngoài một vài từ đơn lẻ). Thí sinh không cung cấp đủ ngữ liệu để giám khảo đánh giá các tiêu chí ngữ pháp và lập luận.`;
    return {
      overallBand: 1.0,
      evaluationMethod: 'algorithmic',
      engineName: 'Cambridge Deep Linguistic Evaluator v4 (Chief Examiner Strict Standard)',
      dateGraded: new Date().toISOString(),
      criteria: {
        tr: {
          band: 1.0,
          feedback: feedbackMsg,
          strengths: [],
          improvements: [`Bài viết quá ngắn (${wordCount}/${targetMinWords} từ). Bắt buộc phải viết đủ tối thiểu ${targetMinWords} từ để bài thi có thể được đánh giá theo barem chuẩn Cambridge.`]
        },
        cc: {
          band: 1.0,
          feedback: 'Không thể đánh giá tính mạch lạc do văn bản chưa đủ dung lượng cấu thành đoạn văn hoàn chỉnh.',
          strengths: [],
          improvements: ['Cần viết thành các câu hoàn chỉnh và chia thành tối thiểu 4 đoạn văn (Mở bài - 2 Thân bài - Kết bài).']
        },
        lr: {
          band: 1.0,
          feedback: 'Vốn từ vựng chỉ gồm vài từ đơn lẻ, không thể hiện được khả năng diễn đạt học thuật.',
          strengths: [],
          improvements: ['Tích lũy từ vựng cơ bản và các mẫu câu thông dụng trước khi làm bài.']
        },
        gra: {
          band: 1.0,
          feedback: 'Chưa đủ cấu trúc câu để đánh giá độ chính xác ngữ pháp.',
          strengths: [],
          improvements: ['Luyện tập viết các câu đơn đúng ngữ pháp (S + V + O) trước khi bước vào luyện viết luận.']
        }
      },
      corrections: [],
      band8Rewrite: isTask1
        ? `The provided visual illustration delineates notable patterns and fluctuations pertinent to ${task?.title || 'the subject matter'} over the surveyed timeframe.\n\nOverall, it is immediately discernible that significant shifts transpired throughout the period. While certain figures exhibited an upward trajectory, others experienced marked declines or plateaued after initial volatility.\n\nIn terms of the predominant categories, initial figures commenced at moderate levels before undergoing consistent expansion, ultimately culminating in peak metrics. Conversely, alternative components demonstrated a steady descent, reflecting clear divergence across segments.\n\nRegarding the remaining parameters, comparative analysis underscores a high degree of correlation with general trends, with the disparity narrowing considerably towards the end of the recording timeline.`
        : `It is widely argued that ${task?.prompt?.slice(0, 100) || 'this topic'} has ignited profound debate in contemporary society. While some individuals contend that traditional perspectives remain paramount, I firmly adhere to the view that progressive methodologies offer far superior societal advantages.\n\nOn the one hand, proponents of conventional approaches frequently cite proven reliability as their core justification. From this standpoint, established paradigms mitigate unforeseen socioeconomic hazards and preserve foundational stability. For instance, empirical evidence highlights how standardized frameworks cultivate structural discipline across institutions.\n\nOn the other hand, the compelling benefits of embracing modernization are indisputable. Firstly, adapting to technological and sociological evolutions fosters unprecedented productivity and unlocks innovative solutions to pressing issues. Furthermore, prioritizing contemporary strategies empowers future generations to navigate increasingly complex global challenges effectively.\n\nIn conclusion, although conventional practices provide undeniable initial safeguards, the multifaceted benefits of forward-looking alternatives are far more substantial. Consequently, proactive adoption should be championed across all societal sectors.`,
      keyVocabulary: [
        { phrase: 'exert a profound impact on', meaningVi: 'tạo ra tác động sâu sắc lên đối tượng nào đó', example: 'Technological advancements exert a profound impact on contemporary communication.' },
        { phrase: 'play an indispensable role in', meaningVi: 'đóng một vai trò không thể thiếu trong', example: 'Early childhood education plays an indispensable role in cognitive development.' },
        { phrase: 'a viable alternative to', meaningVi: 'một giải pháp thay thế khả thi cho', example: 'Solar power is increasingly seen as a viable alternative to fossil fuels.' }
      ],
      paragraphAnalysis: [
        {
          paragraphIndex: 1,
          name: 'Toàn bài (Chưa phân đoạn)',
          wordCount,
          verdict: `Bài viết chỉ có ${wordCount} từ, quá ngắn để tạo thành một đoạn văn hoàn chỉnh.`,
          clicheWarning: null,
          anecdoteWarning: null,
          recommendation: `Bắt buộc phải mở rộng dung lượng lên tối thiểu ${targetMinWords} từ theo mô hình chuẩn 4 đoạn (Mở bài - 2 Thân bài - Kết bài).`
        }
      ],
      actionPlan: {
        priority1: `Khắc phục dung lượng khẩn cấp: Bài viết chỉ có ${wordCount}/${targetMinWords} từ. Bắt buộc phải viết đủ tối thiểu ${targetMinWords} từ để thoát khỏi điểm liệt Band 1.0.`,
        priority2: 'Xây dựng cấu trúc bài viết chuẩn: Học cấu trúc 4 đoạn (Mở bài - Thân bài 1 - Thân bài 2 - Kết bài).',
        priority3: 'Luyện câu đơn cơ bản: Rèn luyện viết câu chuẩn ngữ pháp (Chủ ngữ + Động từ + Tân ngữ) không sai thì.',
        estimatedBandTarget: `Lộ trình mục tiêu: Nâng từ Band 1.0 lên Band 3.5 - 4.0 khi bạn viết đủ ${targetMinWords} từ và chia đoạn rõ ràng.`
      },
      wordStats: {
        rawWordCount,
        copiedWordCount,
        effectiveWordCount: wordCount,
        copiedChunks: promptCopying.copiedChunks
      },
      task1Subtype
    };
  }

  // Corrections array initialized early for cross-referencing
  const corrections = [];

  // ===========================================================
  // A. TASK RESPONSE / TASK ACHIEVEMENT (TR/TA) v4 (STRICT EXAMINER)
  // ===========================================================
  // Base score for standard structure: 5.5
  let trScore = 5.5;
  const trStrengths = [];
  const trImprovements = [];

  // Prompt Verbatim Copying Penalty (Cambridge Regulation: Copied words receive zero credit)
  if (copiedWordCount >= 4) {
    if (copiedWordCount >= 16) {
      trScore = Math.max(1.0, trScore - 1.0);
    } else if (copiedWordCount >= 8) {
      trScore = Math.max(1.0, trScore - 0.5);
    }
    const sampleChunks = promptCopying.copiedChunks.map(c => `"${c.phrase}" (${c.wordCount} từ)`).slice(0, 2).join(', ');
    trImprovements.push(`CẢNH BÁO SAO CHÉP ĐỀ BÀI: Phát hiện ${copiedWordCount} từ sao chép nguyên văn từ câu hỏi đề bài mà không paraphrase (${sampleChunks}). Theo quy chế khảo thí chính thức của Cambridge IELTS, các từ sao chép nguyên văn sẽ bị GẠCH BỎ KHỎI TỔNG SỐ TỪ TÍNH ĐIỂM (Dung lượng thực tế hợp lệ: ${wordCount}/${targetMinWords} từ).`);
  }

  // 1. Strict Underlength Penalties (Cambridge Exam Regulations)
  if (isTask1) {
    if (wordCount < 50) {
      trScore = Math.min(trScore, 2.0);
      trImprovements.push(`Bài viết quá ngắn (${wordCount}/150 từ). Theo quy chế Cambridge, bài viết dưới 50 từ thuộc Band 2.0 (Intermittent user).`);
    } else if (wordCount < 80) {
      trScore = Math.min(trScore, 3.0);
      trImprovements.push(`Bài viết thiếu từ nghiêm trọng (${wordCount}/150 từ). Điểm Task Achievement bị giới hạn ở Band 3.0.`);
    } else if (wordCount < 110) {
      trScore = Math.min(trScore, 4.0);
      trImprovements.push(`Bài viết quá ngắn (${wordCount}/150 từ, thiếu ${150 - wordCount} từ). Task Achievement bị giới hạn ở Band 4.0.`);
    } else if (wordCount < 135) {
      trScore = Math.min(trScore, 4.5);
      trImprovements.push(`Bài viết thiếu từ đáng kể (${wordCount}/150 từ). Điểm Task Achievement bị giới hạn tối đa Band 4.5.`);
    } else if (wordCount < 150) {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push(`Bài viết chưa đạt dung lượng tối thiểu (${wordCount}/150 từ). Bạn bị trừ điểm do không hoàn thành yêu cầu cơ bản.`);
    } else if (wordCount >= 170 && paragraphs.length >= 3) {
      trScore += 0.5;
      trStrengths.push(`Dung lượng bài viết đạt chuẩn và phát triển tốt (${wordCount}/150 từ).`);
    } else {
      trStrengths.push(`Đạt yêu cầu tối thiểu về dung lượng bài viết (${wordCount}/150 từ).`);
    }
  } else {
    // Task 2: Minimum 250 words
    if (wordCount < 75) {
      trScore = Math.min(trScore, 2.0);
      trImprovements.push(`CẢNH BÁO THIẾU TỪ TRẦM TRỌNG: Bài viết chỉ có ${wordCount}/250 từ. Theo Cambridge Band Descriptors, thí sinh thuộc khung Band 2.0 (Intermittent user) do không diễn đạt được thông điệp hoàn chỉnh.`);
    } else if (wordCount < 120) {
      trScore = Math.min(trScore, 3.0);
      trImprovements.push(`CẢNH BÁO THIẾU TỪ NGHIÊM TRỌNG: Bài viết chỉ có ${wordCount}/250 từ (thiếu ${250 - wordCount} từ). Theo Cambridge, bài viết dưới 120 từ bị khống chế tối đa Band 3.0.`);
    } else if (wordCount < 160) {
      trScore = Math.min(trScore, 4.0);
      trImprovements.push(`CẢNH BÁO THIẾU TỪ ĐÁNG KỂ: Bài viết chỉ có ${wordCount}/250 từ (thiếu ${250 - wordCount} từ). Ý tưởng chưa được giải thích và minh chứng đầy đủ, điểm Task Response bị khống chế tối đa Band 4.0.`);
    } else if (wordCount < 200) {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push(`Bài viết thiếu từ đáng kể (${wordCount}/250 từ). Luận điểm còn sơ sài, điểm Task Response bị giới hạn tối đa Band 5.0.`);
    } else if (wordCount < 240) {
      trScore = Math.min(trScore, 5.5);
      trImprovements.push(`Bài viết hơi ngắn (${wordCount}/250 từ). Cần mở rộng thêm luận cứ và ví dụ minh họa để chạm mốc tối thiểu 250 từ.`);
    } else if (wordCount >= 250 && paragraphs.length >= 4) {
      trScore = 6.0; // Meets baseline standard
      if (wordCount >= 280) {
        trScore = 6.5;
        trStrengths.push(`Dung lượng bài viết lý tưởng (${wordCount} từ), phát triển ý sâu sắc.`);
      } else {
        trStrengths.push(`Đạt yêu cầu tối thiểu về dung lượng bài viết (${wordCount}/250 từ).`);
      }
    }
  }

  // 2. Paragraph Structure & Body Development Depth
  const minParagraphs = isTask1 ? 3 : 4;
  if (paragraphs.length >= minParagraphs) {
    trStrengths.push(`Bố cục bài viết gồm ${paragraphs.length} đoạn phân định rõ ràng (Mở bài, Thân bài, ${isTask1 ? 'Tổng quan' : 'Kết luận'}).`);

    // Check body paragraphs depth (undeveloped paragraphs penalty)
    const bodyParagraphs = paragraphs.slice(1, isTask1 ? undefined : -1);
    if (bodyParagraphs.length > 0) {
      const avgBodyWords = bodyParagraphs.reduce((acc, p) => acc + sanitizeWords(p).length, 0) / bodyParagraphs.length;
      if (avgBodyWords < 35 && wordCount < 220) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push(`Các đoạn thân bài quá ngắn (trung bình chỉ ${Math.round(avgBodyWords)} từ/đoạn). Bạn cần giải thích cơ chế 'Vì sao' và đưa ví dụ cụ thể thay vì chỉ liệt kê ý.`);
      }
    }
  } else {
    trScore = Math.min(trScore, 5.0);
    trImprovements.push(`Cấu trúc bài viết chưa tối ưu (${paragraphs.length} đoạn). Bạn cần chia tối thiểu ${minParagraphs} đoạn độc lập để đạt cấu trúc chuẩn.`);
  }

  // 3. Prompt-Essay Semantic Relevance (PESR) & Off-Topic Check
  const relevance = analyzePromptSemanticRelevance(task?.prompt, essayText);
  if (relevance.score < 0.15 && wordCount >= 80) {
    trScore = Math.min(trScore, 2.5);
    trImprovements.push(`LẠC ĐỀ HOÀN TOÀN: Bài viết hầu như không đề cập đến các từ khóa hay chủ đề trọng tâm của đề thi (điểm tương đồng PESR chỉ đạt ${Math.round(relevance.score * 100)}%). Theo Cambridge Band Descriptors, bài lạc đề hoàn toàn bị khống chế tối đa Band 2.0 - 2.5.`);
  } else if (relevance.score < 0.28 && wordCount >= 100) {
    trScore = Math.min(trScore, 3.5);
    trImprovements.push(`LỆCH ĐỀ NGHIÊM TRỌNG: Bài viết đi chệch khỏi yêu cầu cốt lõi của đề thi (chỉ khớp ${relevance.matchedKeywords.length}/${relevance.totalKeywords} từ khóa). Điểm Task Response bị giới hạn tối đa Band 3.5.`);
  } else if (relevance.isOffTopic) {
    trScore = Math.min(trScore, 4.5); // Strict Cambridge off-topic penalty
    trImprovements.push(`CẢNH BÁO LỆCH ĐỀ (Off-Topic): Bài viết chỉ đề cập ${relevance.matchedKeywords.length}/${relevance.totalKeywords} từ khóa trọng tâm của đề bài. Giám khảo khảo thí Cambridge sẽ giới hạn điểm Task Response tối đa Band 4.5.`);
  } else if (relevance.score >= 0.55 && wordCount >= (isTask1 ? 150 : 250)) {
    trScore += 0.5;
    trStrengths.push("Bài viết bám sát các từ khóa trọng tâm của đề thi, thể hiện sự hiểu đề thấu đáo.");
  }

  // 4. Task 1 & Task 2 Specific Checks
  let task1OverviewCheck = null;
  let task1ComparisonCheck = null;
  let task1MapCheck = null;
  let task1ProcessCheck = null;
  let task2Fulfillment = null;

  if (isTask1) {
    task1OverviewCheck = analyzeTask1Overview(paragraphs);

    if (task1OverviewCheck.hasOverview) {
      if (task1OverviewCheck.hasRawData) {
        trScore = Math.min(trScore, 5.5);
        trImprovements.push(
          `BẪY SỐ LIỆU ĐOẠN TỔNG QUAN (Task 1): Phát hiện đoạn Overview chứa số liệu chi tiết cụ thể (${task1OverviewCheck.rawDataList.join(', ')}). Theo tiêu chuẩn giám khảo khảo thí Cambridge IELTS Task 1, đoạn Overview CHỈ ĐƯỢC NÊU XU HƯỚNG TỔNG THỂ (tăng/giảm, biến động, phân kỳ), TUYỆT ĐỐI KHÔNG ĐƯỢC ĐƯA SỐ LIỆU CHI TIẾT. Việc đưa số liệu vào Overview khiến điểm Task Achievement bị khống chế tối đa Band 5.5.`
        );
      } else {
        if (wordCount >= 150) trScore += 0.5;
        if (task1Subtype === 'map') {
          trStrengths.push("Đoạn Tổng quan (Overview) dạng Bản đồ chuẩn mực: Nêu bật sự biến đổi không gian và hiện đại hóa tổng thể mà không bị sa đà vào chi tiết lẻ tẻ.");
        } else if (task1Subtype === 'process') {
          trStrengths.push("Đoạn Tổng quan (Overview) dạng Quy trình chuẩn mực: Khái quát trọn vẹn số lượng các giai đoạn và điểm bắt đầu - kết thúc rõ ràng.");
        } else {
          trStrengths.push("Đoạn Tổng quan (Overview) chuẩn mực: Nêu bật các xu hướng chính và đặc điểm nổi bật mà không bị vướng bẫy đưa số liệu chi tiết.");
        }
      }
    } else {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push("QUAN TRỌNG: Bài viết Task 1 thiếu đoạn Tổng quan (Overview). Barem Cambridge quy định điểm Task Achievement KHÔNG ĐƯỢC VƯỢT QUÁ Band 5.0.");
    }

    if (task1Subtype === 'map') {
      task1MapCheck = analyzeTask1MapFeatures(paragraphs, task1OverviewCheck?.overviewIndex);

      if (task1MapCheck.transformationCount === 0) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push("QUAN TRỌNG (Dạng bài Map): Thân bài hoàn toàn thiếu các động từ biến đổi hạ tầng / quy hoạch (như: 'demolished', 'erected', 'converted into', 'replaced by'). Tiêu chuẩn Cambridge Task 1 Map đòi hỏi miêu tả rõ sự chuyển đổi giữa các mốc thời gian.");
      } else if (task1MapCheck.transformationCount < 3) {
        trScore = Math.min(trScore, 6.0);
        trImprovements.push(`CẦN MỞ RỘNG TỪ VỰNG QUY HOẠCH: Thân bài mới có ${task1MapCheck.transformationCount} động từ chuyển đổi. Hãy sử dụng đa dạng các cấu trúc như 'made way for', 'was converted into', 'was erected' để nâng điểm Task Achievement lên Band 7.0+.`);
      }

      if (task1MapCheck.cardinalCount + task1MapCheck.prepositionCount === 0) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push("QUAN TRỌNG (Dạng bài Map): Thân bài hoàn toàn thiếu phương hướng la bàn (North, South, East, West) và giới từ định vị không gian (adjacent to, opposite to, situated in). Người đọc không thể xác định vị trí các công trình trên bản đồ.");
      } else if (task1MapCheck.cardinalCount + task1MapCheck.prepositionCount < 3) {
        trScore = Math.min(trScore, 6.0);
        trImprovements.push(`CẦN BỔ SUNG ĐỊNH VỊ KHÔNG GIAN: Thân bài mới có ${task1MapCheck.cardinalCount + task1MapCheck.prepositionCount} cụm từ chỉ vị trí/phương hướng. Tiêu chí Band 7.0+ đòi hỏi xác định chính xác góc phần tư ('in the northwestern quadrant', 'to the south of') và vị trí tương quan.`);
      } else if (task1MapCheck.transformationCount >= 3 && (task1MapCheck.cardinalCount + task1MapCheck.prepositionCount) >= 3) {
        if (wordCount >= 150 && trScore >= 6.0) trScore += 0.5;
        if (task1MapCheck.transformationCount >= 5 && (task1MapCheck.cardinalCount + task1MapCheck.prepositionCount) >= 4) {
          trScore = Math.min(9.0, trScore + 0.5);
        }
        trStrengths.push(`Sử dụng ngôn ngữ miêu tả bản đồ (Map) xuất sắc: Kết hợp nhuần nhuyễn phương hướng địa lý (${task1MapCheck.cardinalCount} lần), vị trí không gian (${task1MapCheck.prepositionCount} lần) và động từ chuyển đổi hạ tầng (${task1MapCheck.transformationCount} lần).`);
      }
    } else if (task1Subtype === 'process') {
      task1ProcessCheck = analyzeTask1ProcessFeatures(paragraphs, task1OverviewCheck?.overviewIndex);

      if (task1ProcessCheck.totalSequentialCount === 0) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push("QUAN TRỌNG (Dạng bài Process): Thân bài hoàn toàn thiếu các liên từ chỉ thứ tự các bước (như: 'initially', 'subsequently', 'following this', 'finally'). Bài quy trình bắt buộc phải dẫn dắt người đọc qua từng giai đoạn logic.");
      } else if (task1ProcessCheck.totalSequentialCount < 3) {
        trScore = Math.min(trScore, 6.0);
        trImprovements.push(`CẦN BỔ SUNG LIÊN TỪ CHUYỂN BƯỚC: Thân bài mới có ${task1ProcessCheck.totalSequentialCount} từ nối các bước. Cần bổ sung thêm các liên từ đa dạng như 'subsequently', 'prior to entering', 'after which' để đạt Band 7.0+ Task Achievement.`);
      }

      if (task1ProcessCheck.passiveVoiceCount === 0) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push("QUAN TRỌNG (Dạng bài Process): Thân bài hoàn toàn thiếu cấu trúc thể bị động (passive voice - ví dụ: 'is crushed', 'is heated', 'are transported'). Trong văn phong học thuật IELTS, quy trình sản xuất bắt buộc phải dùng thể bị động để duy trì tính khách quan.");
      } else if (task1ProcessCheck.passiveVoiceCount < 2) {
        trScore = Math.min(trScore, 6.0);
        trImprovements.push(`CẦN TĂNG CƯỜNG THỂ BỊ ĐỘNG: Thân bài mới có ${task1ProcessCheck.passiveVoiceCount} động từ bị động. Hãy chuyển các thao tác kỹ thuật sang thể bị động (như: 'is poured into', 'is filtered') thay vì dùng câu chủ động.`);
      } else if (task1ProcessCheck.totalSequentialCount >= 3 && task1ProcessCheck.passiveVoiceCount >= 2) {
        if (wordCount >= 150 && trScore >= 6.0) trScore += 0.5;
        if (task1ProcessCheck.totalSequentialCount >= 4 && task1ProcessCheck.passiveVoiceCount >= 2) {
          trScore = Math.min(9.0, trScore + 0.5);
        }
        trStrengths.push(`Miêu tả quy trình (Process) xuất sắc: Dẫn dắt trình tự các giai đoạn mượt mà (${task1ProcessCheck.totalSequentialCount} từ nối) và vận dụng chính xác các cấu trúc bị động học thuật (${task1ProcessCheck.passiveVoiceCount} động từ).`);
      }
    } else {
      // Standard Chart/Graph
      task1ComparisonCheck = analyzeTask1Comparisons(paragraphs, task1OverviewCheck?.overviewIndex);
      const dataCheck = analyzeTask1DataDensity(paragraphs, task1OverviewCheck.overviewIndex);
      if (!dataCheck.hasAdequateData) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push("QUAN TRỌNG: Các đoạn thân bài Task 1 thiếu số liệu hoặc dẫn chứng cụ thể (phát hiện chỉ có " + dataCheck.bodyDataCount + " số liệu). Theo chuẩn Cambridge, bài phân tích không có số liệu dẫn chứng bị giới hạn ở Band 5.0.");
      } else {
        trStrengths.push(`Dẫn chứng số liệu trong thân bài đầy đủ (${dataCheck.bodyDataCount} mốc số liệu/thời gian cụ thể).`);
      }

      // 4c. Comparative & Contrasting Language Check (Mandatory "make comparisons where relevant")
      if (dataCheck.bodyDataCount >= 2) {
        if (task1ComparisonCheck.totalComparisons === 0) {
          trScore = Math.min(trScore, 5.5);
          trImprovements.push(
            "BẪY LIỆT KÊ SỐ LIỆU CƠ HỌC (Mechanical Data Listing): Thân bài có đưa số liệu nhưng hoàn toàn KHÔNG có cấu trúc so sánh đối chiếu giữa các đối tượng hoặc các mốc thời gian. Yêu cầu bắt buộc của Cambridge IELTS Task 1 là 'make comparisons where relevant'. Việc chỉ mô tả số liệu đơn lẻ từng năm/từng đối tượng khiến Task Achievement bị khống chế tối đa Band 5.5. Hãy bổ sung các cấu trúc so sánh: hơn/kém ('significantly higher than', 'outstripped'), so sánh bội số ('twice as high as', 'doubled'), hoặc liên từ đối chiếu ('whereas', 'in stark contrast to', 'compared with')."
          );
        } else if (task1ComparisonCheck.totalComparisons < 3) {
          trScore = Math.min(trScore, 6.0);
          trImprovements.push(
            `CẦN ĐA DẠNG HÓA SO SÁNH: Thân bài mới chỉ có ${task1ComparisonCheck.totalComparisons} cấu trúc so sánh đối chiếu (${task1ComparisonCheck.matchedComparisons.slice(0, 2).join(', ')}). Barem Cambridge Band 7.0+ Task Achievement yêu cầu liên tục lồng ghép so sánh tương quan giữa các nhóm số liệu thay vì chỉ mô tả xu hướng một chiều.`
          );
        } else {
          if (wordCount >= 150 && trScore >= 6.0) trScore += 0.5;
          trStrengths.push(
            `Kỹ năng so sánh đối chiếu số liệu phong phú (${task1ComparisonCheck.totalComparisons} cấu trúc: ${task1ComparisonCheck.matchedComparisons.slice(0, 4).join(', ')}), đáp ứng xuất sắc tiêu chí 'make comparisons where relevant' của đề thi.`
          );
        }
      }
    }
  } else {
    // 5. Task 2 Specific Checks (Conclusion + Question Type Balance)
    const lastPara = paragraphs[paragraphs.length - 1]?.toLowerCase() || '';
    const hasConclusion = OVERVIEW_INDICATORS.slice(0, 4).some(ind => lastPara.includes(ind)) || lastPara.includes('conclu');
    if (hasConclusion) {
      if (wordCount >= 250) trScore += 0.5;
      trStrengths.push("Có đoạn Kết luận rõ ràng, khẳng định lại lập trường xuyên suốt bài viết.");
    } else {
      trScore = Math.min(trScore, 5.5);
      trImprovements.push("Thiếu đoạn Kết luận độc lập. Nên kết bài bằng 'In conclusion' để tóm tắt quan điểm của bạn. Điểm TR bị giới hạn tối đa Band 5.5.");
    }

    task2Fulfillment = analyzeTask2Fulfillment(task?.prompt, paragraphs);
    if (!task2Fulfillment.isBalanced) {
      // Hard cap Band 5.0 for omitting a question/part of task per Cambridge Band Descriptors
      trScore = Math.min(trScore, 5.0);
      trImprovements.push(`QUAN TRỌNG: ${task2Fulfillment.warning}`);
    } else if (task2Fulfillment.type !== 'OPINION' && task2Fulfillment.type !== 'GENERAL') {
      if (wordCount >= 250 && trScore >= 6.0) trScore += 0.5;
      trStrengths.push(`Phát triển luận điểm đa chiều và cân xứng: Đáp ứng trọn vẹn yêu cầu dạng đề (${task2Fulfillment.taskDescription}) qua các đoạn thân bài riêng biệt.`);
    }
  }

  // 6. Academic Hedging & Overgeneralisation Engine (Task 2 Cambridge Band 6 vs 7+ Criteria)
  const hedgingAnalysis = analyzeHedgingAndOvergeneralisation(paragraphs, sentences, isTask1);
  const { hedgingCount, overgeneralisationCount, overgeneralisedStatements, matchedHedging } = hedgingAnalysis;

  if (overgeneralisationCount >= 2) {
    trScore = Math.min(trScore, 6.0);
    trImprovements.push(
      `BẪY QUY CHỤP TUYỆT ĐỐI / KHÁI QUÁT HÓA THÁI QUÁ (Overgeneralisation Trap): Phát hiện ${overgeneralisationCount} phát ngôn mang tính khẳng định tuyệt đối hoặc quy chụp cực đoan (ví dụ: ${overgeneralisedStatements.slice(0, 2).map(s => `'${s.match}'`).join(', ')}). Tiêu chí Cambridge Band 7.0+ Task Response đòi hỏi tư duy học thuật đa chiều và ngôn ngữ cẩn trọng (Hedging/Tentative language). Việc quy chụp thái quá khiến điểm Task Response bị khống chế tối đa Band 6.0.`
    );
  } else if (hedgingCount >= 3 && overgeneralisationCount === 0 && wordCount >= 250) {
    if (trScore >= 6.5) trScore = Math.min(9.0, trScore + 0.5);
    trStrengths.push(
      `Văn phong học thuật cẩn trọng và chín chắn (Academic Hedging): Sử dụng thành thạo ngôn ngữ dè dặt khách quan (${hedgingCount} cấu trúc: ${matchedHedging.slice(0, 3).map(h => `'${h.match}'`).join(', ')}), tránh được bẫy quy chụp cực đoan của Band 6.0.`
    );
  } else if (hedgingCount === 0 && wordCount >= 250 && trScore >= 7.0 && !isTask1) {
    trImprovements.push(
      "Cần bổ sung ngôn ngữ cẩn trọng (Hedging): Lập luận còn hơi trực diện. Hãy sử dụng các cụm từ như 'tends to', 'is likely to', 'evidence suggests that' để nâng tầm văn phong học thuật lên Band 7.5+."
    );
  }

  // Push overgeneralisation corrections into corrections table
  overgeneralisedStatements.forEach(item => {
    if (corrections.length < 20) {
      corrections.push({
        original: item.sentence,
        corrected: item.suggestion,
        type: 'style',
        explanation: item.explanation
      });
    }
  });

  const trBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, trScore)));

  // ===========================================================
  // B. COHERENCE & COHESION (CC) v4 (STRICT EXAMINER)
  // ===========================================================
  let ccScore = 5.5;
  const ccStrengths = [];
  const ccImprovements = [];
  const essayLower = essayText.toLowerCase();

  // 1. Structural Coherence Baseline
  const underlength40 = isTask1 ? (wordCount < 110 || paragraphs.length < 3) : (wordCount < 160 || paragraphs.length < 3);
  if (paragraphs.length === 1 && wordCount >= 60) {
    ccScore = Math.min(ccScore, 3.5);
    ccImprovements.push("VI PHẠM BỐ CỤC ĐOẠN VĂN: Toàn bộ bài viết là một khối duy nhất không xuống dòng phân chia đoạn. Barem Cambridge quy định bài không chia đoạn văn bị khống chế Coherence & Cohesion tối đa Band 3.5.");
  } else if (wordCount < (isTask1 ? 50 : 75)) {
    ccScore = Math.min(ccScore, 2.0);
    ccImprovements.push("Bài viết quá ngắn để tổ chức tính liên kết đoạn văn, giới hạn tối đa ở Band 2.0.");
  } else if (wordCount < (isTask1 ? 80 : 120)) {
    ccScore = Math.min(ccScore, 3.0);
    ccImprovements.push("Đoạn văn quá ngắn và thiếu liên kết logic giữa các ý, giới hạn ở Band 3.0.");
  } else if (underlength40) {
    ccScore = Math.min(ccScore, 4.0);
    ccImprovements.push("Đoạn văn quá ngắn hoặc chưa phân chia đoạn rõ ràng, ảnh hưởng nghiêm trọng đến tính mạch lạc.");
  } else if (paragraphs.length === 3 && !isTask1) {
    ccScore = 5.0;
    ccImprovements.push("Bài viết Task 2 nên chia tối thiểu 4 đoạn (Mở bài, 2 Thân bài, Kết bài) để tạo mạch ý cân đối.");
  }

  // 2. Cohesive Devices Count & Category Diversity
  let totalCohesiveHits = 0;
  let categoriesUsedCount = 0;

  Object.entries(COHESIVE_DEVICES).forEach(([catName, terms]) => {
    let catHits = 0;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = essayLower.match(re);
      if (matches) catHits += matches.length;
    });
    if (catHits > 0) {
      categoriesUsedCount++;
      totalCohesiveHits += catHits;
    }
  });

  const cohesiveDensityPer100 = (totalCohesiveHits / wordCount) * 100;

  // 3. Referencing & Anaphoric Cohesion Analysis (Cambridge Band 7-8 Hallmark)
  let referencingCount = 0;
  REFERENCING_PATTERNS.forEach(pat => {
    const matches = essayText.match(pat);
    if (matches) referencingCount += matches.length;
  });

  // Check Mechanical Linking Device frequency
  const mechanicalCount = (essayLower.match(/\b(firstly|secondly|thirdly|first|second|moreover|furthermore|in addition|in conclusion|on the one hand|on the other hand)\b/gi) || []).length;

  // 4. Calibrated Cambridge CC Grading Matrix
  const minWordsForHighCC = isTask1 ? 150 : 240;
  const minWordsForMidCC = isTask1 ? 135 : 200;
  const minReferencingForHighCC = isTask1 ? 1 : 2;

  if (referencingCount >= minReferencingForHighCC && paragraphs.length >= (isTask1 ? 3 : 4) && wordCount >= minWordsForHighCC && (categoriesUsedCount >= 3 || (isTask1 && totalCohesiveHits >= 3))) {
    ccScore = 7.0; // True Band 7 CC (Clear progression, natural referencing)
    if ((referencingCount >= 2 || (isTask1 && referencingCount >= 1)) && mechanicalCount <= 5 && wordCount >= (isTask1 ? 160 : 260)) {
      ccScore = 7.5;
    }
    ccStrengths.push(`Sử dụng đại từ tham chiếu và liên kết ngữ nghĩa xuất sắc (${referencingCount} cụm 'this/such + Noun', 'the former/the latter'). Mạch văn chuyển ý tự nhiên.`);
  } else if (paragraphs.length >= (isTask1 ? 3 : 4) && (mechanicalCount >= 2 || totalCohesiveHits >= 3) && wordCount >= minWordsForMidCC) {
    // Standard Band 6.0
    ccScore = 6.0;
    ccStrengths.push(`Bố cục gồm ${paragraphs.length} đoạn văn, có sử dụng liên từ nối cơ bản.`);
    if (mechanicalCount >= 3) {
      ccImprovements.push("Có dấu hiệu sử dụng từ nối cơ học (Mechanical linkers: First, Second, Moreover). Để đạt Band 7.0+ CC, hãy kết hợp thêm đại từ thay thế (this problem, such measures) và mệnh đề quan hệ.");
    }
  } else if (cohesiveDensityPer100 < 1.5 && referencingCount < 1) {
    ccScore = 5.0;
    ccImprovements.push("Mạch văn rời rạc, thiếu các phương tiện liên kết giữa các câu. Hãy bổ sung liên từ chuyển ý phù hợp.");
  } else if (cohesiveDensityPer100 > 8.0 && referencingCount < 1) {
    ccScore = 5.5;
    ccImprovements.push("Lạm dụng từ nối cơ học ở đầu mọi câu khiến bài viết thiếu tự nhiên.");
  }

  const ccBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, ccScore)));

  // ===========================================================
  // C. LEXICAL RESOURCE (LR) v4 (STRICT EXAMINER)
  // ===========================================================
  let lrScore = 5.0;
  const lrStrengths = [];
  const lrImprovements = [];

  // 1. Type-Token Ratio (Normalized: only awarded if essay has adequate length)
  const uniqueWords = new Set(rawWords);
  const ttr = uniqueWords.size / wordCount;

  // 2. Academic Word List (AWL) Density
  let awlCount = 0;
  rawWords.forEach(w => {
    if (ACADEMIC_LEXICON.has(w)) awlCount++;
  });
  const awlPercentage = (awlCount / wordCount) * 100;

  // 3. Academic Collocations Scanner (800+ Corpus)
  let collocationHits = 0;
  const matchedCollocations = [];
  ACADEMIC_COLLOCATIONS.forEach(col => {
    const colRegex = new RegExp(`\\b${col.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = essayText.match(colRegex);
    if (matches) {
      collocationHits += matches.length;
      matchedCollocations.push(col);
    }
  });

  // 4. Informal Words Detection
  let informalCount = 0;
  INFORMAL_WORDS.forEach(item => {
    const matches = essayText.match(item.match);
    if (matches) informalCount += matches.length;
  });

  // 5. Underlength hard caps for LR
  if (wordCount < (isTask1 ? 50 : 75)) {
    lrScore = Math.min(lrScore, 2.0);
  } else if (wordCount < (isTask1 ? 80 : 120)) {
    lrScore = Math.min(lrScore, 3.0);
  } else if (wordCount < (isTask1 ? 110 : 160)) {
    lrScore = Math.min(lrScore, 4.0);
  }

  // 6. Calibrated Cambridge LR Matrix
  const minWordsForHighLR = isTask1 ? 150 : 240;
  const minWordsForMidLR = isTask1 ? 135 : 220;
  const domainBonus = (isTask1 && (task1Subtype === 'map' || task1Subtype === 'process'))
    ? ((task1MapCheck?.uniquePatternsCount || 0) + (task1ProcessCheck?.uniquePatternsCount || 0))
    : 0;

  if ((awlPercentage >= 7.5 || (awlPercentage >= 4.0 && domainBonus >= 4)) && (collocationHits >= 3 || domainBonus >= 3) && wordCount >= minWordsForHighLR && informalCount === 0) {
    lrScore = 8.0;
    lrStrengths.push(`Vốn từ vựng học thuật C1/C2 đỉnh cao (${awlPercentage.toFixed(1)}% AWL, ${collocationHits} cụm collocations tự nhiên${domainBonus > 0 ? `, ${domainBonus} thuật ngữ chuyên biệt dạng bài` : ''}).`);
  } else if ((awlPercentage >= 6.0 || (awlPercentage >= 3.0 && domainBonus >= 3)) && (collocationHits >= 2 || domainBonus >= 2) && wordCount >= minWordsForMidLR && informalCount <= 1) {
    lrScore = 7.0;
    lrStrengths.push(`Sở hữu vốn từ học thuật phong phú (${awlPercentage.toFixed(1)}% AWL) và có ý thức dùng collocations chuẩn xác (${matchedCollocations.slice(0, 2).join(', ')}).`);
  } else if (awlPercentage >= 5.0 || (awlPercentage >= 2.5 && domainBonus >= 2) || (ttr >= 0.50 && wordCount >= minWordsForMidLR)) {
    lrScore = 6.5;
    lrStrengths.push(`Vốn từ vựng tương đối đa dạng (${awlPercentage.toFixed(1)}% AWL), đáp ứng tốt yêu cầu bài thi.`);
  } else if (awlPercentage >= 4.0 || collocationHits >= 1 || domainBonus >= 1) {
    lrScore = 6.0;
    lrStrengths.push("Vốn từ vựng ở mức vừa đủ hoàn thành bài viết, có sử dụng một số thuật ngữ liên quan đến chủ đề.");
    lrImprovements.push("Cần bổ sung thêm các cụm từ học thuật C1/C2 và Collocations nâng cao để vượt ngưỡng Band 6.0.");
  } else if (wordCount >= (isTask1 ? 140 : 160)) {
    // Basic A2/B1 vocabulary
    lrScore = 5.0;
    lrImprovements.push("Vốn từ vựng còn khá cơ bản (chỉ đạt " + awlPercentage.toFixed(1) + "% từ vựng học thuật AWL, thiếu các cụm Collocations chuẩn). Bạn cần tích lũy thêm từ vựng chuyên sâu theo chủ đề.");
  }

  if (informalCount >= 2) {
    lrScore = Math.max(1.0, lrScore - 0.5);
    lrImprovements.push(`Phát hiện ${informalCount} từ/cụm từ mang văn phong giao tiếp thường ngày (như 'a lot of', 'kids', 'stuff'). Hãy đổi sang văn phong học thuật trang trọng.`);
  }

  // Prompt Copying Penalty for LR (Candidate lacks vocabulary to paraphrase)
  if (copiedWordCount >= 4) {
    if (copiedWordCount >= 16) {
      lrScore = Math.max(1.0, lrScore - 1.0);
    } else if (copiedWordCount >= 8) {
      lrScore = Math.max(1.0, lrScore - 0.5);
    }
    trImprovements.push(`CẢNH BÁO TỪ VỰNG (Prompt Copying): Bài viết sao chép ${copiedWordCount} từ nguyên xi từ đề bài. Để đạt điểm cao ở tiêu chí Lexical Resource, thí sinh bắt buộc phải thể hiện khả năng Paraphrase (dùng từ đồng nghĩa, chuyển đổi từ loại hoặc cấu trúc câu) ngay từ câu mở đầu.`);
  }

  // 7. Word Overuse & Repetition Diagnostics (Band 6.0 cap for severe overuse)
  const wordOveruse = analyzeWordOveruse(rawWords);
  if (wordOveruse.hasOveruse) {
    const severeOveruse = wordOveruse.overusedWords.filter(w => w.count >= 5);
    if (severeOveruse.length >= 2) {
      if (lrScore > 6.0) lrScore = 6.0;
      lrImprovements.push(
        `LỖI LẶP TỪ NGHIÊM TRỌNG (Word Overuse): Bài viết lặp lại quá nhiều lần các từ đơn điệu (${severeOveruse.map(o => `'${o.word}' (${o.count} lần)`).join(', ')}). Barem Cambridge Band 7.0+ Lexical Resource đòi hỏi tính linh hoạt và đa dạng từ vựng. Điểm LR bị khống chế tối đa Band 6.0. Hãy tham khảo mục 'Gợi ý từ vựng thay thế' bên dưới để đa dạng hóa văn phong.`
      );
    } else if (wordOveruse.overusedWords.length >= 2 || severeOveruse.length >= 1) {
      const topWords = wordOveruse.overusedWords.slice(0, 3).map(o => `'${o.word}' (${o.count} lần)`).join(', ');
      lrImprovements.push(
        `CẢNH BÁO LẶP TỪ: Phát hiện các từ lặp lại nhiều lần trong bài: ${topWords}. Hãy sử dụng các từ đồng nghĩa học thuật C1/C2 để nâng cao tiêu chí Lexical Resource.`
      );
    }
  }

  const lrBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, lrScore)));

  // ===========================================================
  // D. SPECIFIC ERROR GENERATOR (SENTENCE-LEVEL) v3
  // ===========================================================
  const erroneousSentenceIndices = new Set();
  let svErrorCount = 0;

  // 1. Subject-Verb Agreement Traps (S-V errors)
  SUBJECT_VERB_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        if (!trap.filter || trap.filter(s, s)) {
          erroneousSentenceIndices.add(sIdx);
          svErrorCount++;
          corrections.push({
            original: s,
            corrected: `${s} (Xem lưu ý chia động từ)`,
            type: 'grammar',
            explanation: trap.fix
          });
        }
      }
    });
  });

  // 2. Quantifier & Noun Number Traps
  NOUN_AGREEMENT_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        svErrorCount++;
        corrections.push({
          original: s,
          corrected: `${s} (Kiểm tra lại số ít / số nhiều)`,
          type: 'grammar',
          explanation: trap.fix
        });
      }
    });
  });

  // 3. Preposition & Collocation Traps
  PREPOSITION_COLLOCATION_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        corrections.push({
          original: s,
          corrected: `${s} (Sửa giới từ)`,
          type: 'vocabulary',
          explanation: trap.fix
        });
      }
    });
  });

  // 4. Double Comparative & Word Form Traps
  COMPARATIVE_AND_WORD_FORM_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        corrections.push({
          original: s,
          corrected: `${s} (Sửa dạng từ)`,
          type: 'grammar',
          explanation: trap.fix
        });
      }
    });
  });

  // 5. Uncountable Noun Traps
  UNCOUNTABLE_NOUN_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.wrong.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        const fixed = s.replace(trap.wrong, trap.correct);
        corrections.push({
          original: s,
          corrected: fixed,
          type: 'grammar',
          explanation: trap.reason
        });
      }
    });
  });

  // 6. Spelling Traps from IELTS_SPELLING_TRAPS
  if (Array.isArray(IELTS_SPELLING_TRAPS)) {
    IELTS_SPELLING_TRAPS.forEach(trap => {
      if (trap?.distractors && Array.isArray(trap.distractors)) {
        trap.distractors.forEach(dist => {
          const reg = new RegExp(`\\b${dist}\\b`, 'gi');
          sentences.forEach((s, sIdx) => {
            if (reg.test(s) && corrections.length < 12) {
              erroneousSentenceIndices.add(sIdx);
              const fixed = s.replace(reg, trap.correct);
              corrections.push({
                original: s,
                corrected: fixed,
                type: 'vocabulary',
                explanation: `Lỗi chính tả phổ biến: '${dist}' phải viết đúng là '${trap.correct}'. ${trap.rule || ''}`
              });
            }
          });
        });
      }
    });
  }

  // 7. Informal Words Replacement
  INFORMAL_WORDS.forEach(inf => {
    sentences.forEach((s, sIdx) => {
      if (inf.match.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        const primaryRepl = inf.replace.split('/')[0].trim();
        const fixed = s.replace(inf.match, primaryRepl);
        corrections.push({
          original: s,
          corrected: fixed,
          type: 'vocabulary',
          explanation: inf.note
        });
      }
    });
  });

  // 8. Grammar Patterns (Because... so, Although... but, S-V agreement)
  COMMON_GRAMMAR_PATTERNS.forEach(pat => {
    sentences.forEach((s, sIdx) => {
      if (pat.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        svErrorCount++;
        corrections.push({
          original: s,
          corrected: `${s.replace(pat.regex, '$1')} (Đã tinh chỉnh liên từ)`,
          type: 'grammar',
          explanation: `${pat.fix} Ví dụ: ${pat.example}`
        });
      }
    });
  });

  // 9. Bare Singular Countable Nouns & Article Traps (Cambridge Band 5-6 Red Flags)
  let bareNounErrorCount = 0;
  BARE_NOUN_AND_ARTICLE_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      trap.regex.lastIndex = 0;
      if (trap.regex.test(s) && corrections.length < 15) {
        erroneousSentenceIndices.add(sIdx);
        bareNounErrorCount++;
        trap.regex.lastIndex = 0;
        const correctedSentence = trap.suggest
          ? s.replace(trap.regex, trap.suggest)
          : `${s} (Kiểm tra lại mạo từ/danh từ số nhiều)`;
        corrections.push({
          original: s,
          corrected: correctedSentence,
          type: 'grammar',
          explanation: trap.fix
        });
      }
    });
  });

  // 10. Comma Splices & Run-on Sentences (Cambridge GRA Band 5-6 Red Flags)
  const commaSpliceAnalysis = analyzeCommaSplices(sentences);
  const commaSpliceCount = commaSpliceAnalysis.commaSpliceCount;
  commaSpliceAnalysis.commaSpliceDetails.forEach(detail => {
    erroneousSentenceIndices.add(detail.sentenceIndex);
    if (corrections.length < 18) {
      corrections.push({
        original: detail.original,
        corrected: detail.suggestion,
        type: 'grammar',
        explanation: detail.explanation
      });
    }
  });

  // ===========================================================
  // E. GRAMMATICAL RANGE & ACCURACY (GRA) v3 (CALIBRATED)
  // ===========================================================
  let graScore = 5.0;
  const graStrengths = [];
  const graImprovements = [];

  // 1. Error-Free Sentence Ratio (EFSR)
  const totalSentences = Math.max(1, sentences.length);
  const errorFreeCount = totalSentences - erroneousSentenceIndices.size;
  const efsrRatio = (errorFreeCount / totalSentences) * 100;

  // 2. Syntactic Variety & Complex Structures (Range Check)
  let complexCount = 0;
  const complexMarkers = [
    /\b(although|even though|though|whereas|while|whilst)\b/i,
    /\b(which|who|whom|whose|that|whereby|in which)\b/i,
    /\b(because|since|as long as|provided that|in order that)\b/i,
    /\b(if|unless|had [a-z]+ [a-z]+ed|were [a-z]+ to)\b/i, // Conditionals & Inversions
    /\b(not only\s+(did|does|do|can|is|are|have|has))\b/i, // Negative Inversions
    /\b(having\s+[a-z]+ed|compared\s+to|given\s+that|accompanied\s+by|flanked\s+by|followed\s+by|complemented\s+by|surrounded\s+by)\b/i,   // Participle Clauses
    /\b(?:prior\s+to|before|after|once)\s+[a-z]+ing\b/i // Gerundial time clauses
  ];

  sentences.forEach(s => {
    const isComplex = complexMarkers.some(regex => regex.test(s));
    if (isComplex) complexCount++;
  });

  const complexRatio = complexCount / totalSentences;
  const minSentencesForBand8 = isTask1 ? 5 : 8;

  // 3. Calibrated Cambridge GRA Matrix (Accuracy + Range Dual Gate)
  if (svErrorCount === 0 && bareNounErrorCount === 0 && commaSpliceCount === 0 && efsrRatio >= 80 && complexRatio >= 0.40 && totalSentences >= minSentencesForBand8) {
    graScore = 8.0;
    graStrengths.push(`Khả năng kiểm soát ngữ pháp xuất sắc: ${Math.round(efsrRatio)}% câu hoàn toàn không lỗi, kết hợp nhuần nhuyễn câu phức và mệnh đề nâng cao (${Math.round(complexRatio * 100)}%).`);
  } else if (svErrorCount <= 1 && bareNounErrorCount <= 1 && commaSpliceCount <= 1 && efsrRatio >= 65 && complexRatio >= 0.30) {
    graScore = 7.0;
    graStrengths.push(`Tỷ lệ câu không lỗi đạt mức tốt (${Math.round(efsrRatio)}%), sử dụng thành thạo nhiều dạng câu phức.`);
  } else if (svErrorCount <= 2 && bareNounErrorCount <= 2 && commaSpliceCount <= 2 && efsrRatio >= 40) {
    graScore = 6.0;
    graStrengths.push(`Có sự kết hợp giữa câu đơn và câu phức, truyền tải được thông điệp dù còn một số lỗi ngữ pháp.`);
    if (complexRatio < 0.25) {
      graImprovements.push("Cấu trúc câu còn đơn điệu (chủ yếu là câu đơn). Cần bổ sung thêm mệnh đề quan hệ (which/who) và mệnh đề nhượng bộ (Although/While).");
    }
  } else {
    // Systematic errors or very low EFSR
    graScore = 5.0;
    graImprovements.push(`Mắc lỗi ngữ pháp cơ bản lặp đi lặp lại (${svErrorCount} lỗi hòa hợp chủ ngữ-động từ/danh từ số nhiều, ${bareNounErrorCount} lỗi danh từ trơ trọi/mạo từ, ${commaSpliceCount} lỗi comma splice). Theo tiêu chí Cambridge, lỗi hệ thống giới hạn điểm GRA ở Band 5.0.`);
  }

  // Underlength hard caps for GRA
  if (wordCount < (isTask1 ? 50 : 75)) {
    graScore = Math.min(graScore, 2.0);
  } else if (wordCount < (isTask1 ? 80 : 120)) {
    graScore = Math.min(graScore, 3.0);
  } else if (wordCount < (isTask1 ? 110 : 160)) {
    graScore = Math.min(graScore, 4.0);
  }

  // Hard Cap: Systematic elementary S-V errors
  if (svErrorCount >= 6) {
    graScore = Math.min(graScore, 3.0);
    graImprovements.push(`Mắc lỗi ngữ pháp cơ bản dày đặc (${svErrorCount} lỗi hòa hợp chủ vị / số nhiều / liên từ). Theo tiêu chí Cambridge, điểm GRA bị khống chế tối đa Band 3.0.`);
  } else if (svErrorCount >= 4) {
    graScore = Math.min(graScore, 4.0);
    graImprovements.push(`Lỗi ngữ pháp cơ bản xảy ra thường xuyên (${svErrorCount} lỗi). Theo tiêu chí Cambridge, lỗi hệ thống cơ bản giới hạn GRA tối đa Band 4.0.`);
  } else if (svErrorCount >= 3) {
    graScore = Math.min(graScore, 4.5);
    graImprovements.push(`Phát hiện ${svErrorCount} lỗi hòa hợp chủ ngữ-động từ/danh từ số nhiều. GRA bị khống chế ở Band 4.5.`);
  } else if (svErrorCount >= 2) {
    graScore = Math.min(graScore, 5.5);
  }

  // Hard Cap: Bare Singular Countable Nouns & Systematic Article Omission
  if (bareNounErrorCount >= 5) {
    if (graScore > 5.0) graScore = 5.0;
    graImprovements.push(`LỖI NGỮ PHÁP HỆ THỐNG NGHIÊM TRỌNG (Bare Noun / Article Trap): Phát hiện ${bareNounErrorCount} lỗi danh từ đếm được số ít đứng trơ trọi hoặc thiếu mạo từ (a/an/the) lặp lại liên tục. Barem Cambridge Band 5.0 GRA quy định các lỗi ngữ pháp hệ thống khống chế điểm tối đa Band 5.0.`);
  } else if (bareNounErrorCount >= 3) {
    if (graScore > 6.0) graScore = 6.0;
    graImprovements.push(`LỖI HỆ THỐNG DANH TỪ & MẠO TỪ (Bare Nouns / Articles): Phát hiện ${bareNounErrorCount} lỗi danh từ đếm được số ít đứng trơ trọi hoặc thiếu mạo từ (như: 'student should', 'plays important role', 'in big city'). Barem Cambridge Band 7.0+ GRA đòi hỏi tỷ lệ câu không lỗi cao và kiểm soát tốt hình thái danh từ. Lỗi này khống chế điểm Ngữ pháp tối đa Band 6.0. Hãy xem bảng Lỗi sai để sửa triệt để.`);
  }

  // Hard Cap: Comma Splices & Sentence Boundary Defects
  if (commaSpliceCount >= 4) {
    if (graScore > 5.0) graScore = 5.0;
    graImprovements.push(`LỖI HỆ THỐNG PHÂN TÁCH CÂU (Comma Splices / Run-on): Phát hiện ${commaSpliceCount} lỗi nối hai mệnh đề độc lập bằng dấu phẩy không có liên từ (như: 'S+V, S+V'). Lỗi ngắt câu và phân tách ranh giới mệnh đề là lỗi ngữ pháp hệ thống nghiêm trọng, khống chế điểm Ngữ pháp tối đa Band 5.0 theo barem Cambridge.`);
  } else if (commaSpliceCount >= 2) {
    if (graScore > 6.0) graScore = 6.0;
    graImprovements.push(`LỖI PHÂN TÁCH MỆNH ĐỀ (Comma Splices): Phát hiện ${commaSpliceCount} câu ghép hai mệnh đề độc lập S+V chỉ bằng dấu phẩy (như: 'Technology develops rapidly, it brings...'). Tiêu chí Cambridge Band 7.0+ GRA đòi hỏi kiểm soát tốt dấu câu và liên kết mệnh đề. Lỗi này khống chế điểm GRA tối đa Band 6.0. Hãy dùng liên từ kết hợp (, and / , but), mệnh đề quan hệ (, which), hoặc tách bằng dấu chấm/chấm phẩy.`);
  }

  // Sentence Length Diagnostics (Run-on detection)
  const sentenceWordCounts = sentences.map(s => s.split(/\s+/).length);
  const runOnSentences = sentenceWordCounts.filter(cnt => cnt > 42).length;
  if (runOnSentences > 1) {
    graScore = Math.max(1.0, graScore - 0.5);
    graImprovements.push(`Có ${runOnSentences} câu quá dài (>42 từ) dễ gây rối nghĩa hoặc lỗi ngắt câu (run-on). Nên tách thành các câu mạch lạc.`);
  }

  const graBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, graScore)));

  // ===========================================================
  // F. OVERALL BAND COMPUTATION & DEEP EXAMINER DIAGNOSTICS
  // ===========================================================
  const rawAverage = (trBand + ccBand + lrBand + graBand) / 4.0;
  const overallBand = roundToCambridgeBand(rawAverage);

  // Dynamic Topic Collocations Recommendation
  const contextForTopic = `${task?.title || ''} ${task?.prompt || ''} ${essayText.slice(0, 600)}`;
  const topicData = lookupTopicCollocations(contextForTopic);
  const keyVocabulary = topicData.collocations;

  // Generate In-Depth Paragraph Analysis & Examiner Action Plan
  const paragraphAnalysis = analyzeParagraphsDeeply(paragraphs, isTask1, task, task1OverviewCheck, task1Subtype);
  const actionPlan = generateExaminerActionPlan(trBand, ccBand, lrBand, graBand, svErrorCount, wordCount, targetMinWords, isTask1, task1OverviewCheck, task1ComparisonCheck, task2Fulfillment, topicData, wordOveruse, bareNounErrorCount, commaSpliceCount, overgeneralisationCount, task1Subtype, task1MapCheck, task1ProcessCheck);

  // Band 8 Model Rewrite
  let band8Rewrite = '';
  if (task?.modelAnswer && typeof task.modelAnswer === 'string' && task.modelAnswer.trim().length > 50) {
    band8Rewrite = task.modelAnswer;
  } else {
    band8Rewrite = isTask1
      ? (task1Subtype === 'map'
          ? `The two maps illustrate the urban and infrastructural transformations that transpired in ${task?.title || 'the area'} over the surveyed timeframe.\n\nOverall, it is readily observable that the vicinity underwent extensive modernization, evolving from a largely rural settlement into a developed commercial and residential zone, with key agricultural features being eradicated to accommodate modern amenities.\n\nIn the northern and western quadrants, earlier green spaces and farmland were completely replaced by residential housing complexes and newly constructed transport links. Concurrently, the central thoroughfare was substantially widened to facilitate increased traffic flow.\n\nRegarding the southern perimeter, traditional industrial facilities were dismantled to make way for recreational venues and maritime infrastructure, with pedestrian walkways established along the waterfront.`
          : task1Subtype === 'process'
          ? `The diagram delineates the sequential stages involved in the production and manufacturing cycle of ${task?.title || 'the specified commodity'}.\n\nOverall, the entire procedure comprises several distinct phases, commencing with the collection and preparation of raw materials, progressing through mechanical and thermal treatment, and culminating in the packaging and distribution of the finished product.\n\nIn the initial stage, raw constituents are gathered and fed into specialized processing equipment where they are crushed and thoroughly blended. Subsequently, the mixture undergoes intense heating within a temperature-controlled chamber before being filtered to remove residual impurities.\n\nFollowing this purification phase, the refined compound is cooled and molded into standard dimensions. Finally, the end products are packaged into containers and transported to commercial distribution centers.`
          : `The provided visual illustration delineates notable patterns and fluctuations pertinent to ${task?.title || 'the subject matter'} over the surveyed timeframe.\n\nOverall, it is immediately discernible that significant shifts transpired throughout the period. While certain figures exhibited an upward trajectory, others experienced marked declines or plateaued after initial volatility.\n\nIn terms of the predominant categories, initial figures commenced at moderate levels before undergoing consistent expansion, ultimately culminating in peak metrics. Conversely, alternative components demonstrated a steady descent, reflecting clear divergence across segments.\n\nRegarding the remaining parameters, comparative analysis underscores a high degree of correlation with general trends, with the disparity narrowing considerably towards the end of the recording timeline.`)
      : `It is widely argued that ${task?.prompt?.slice(0, 100) || 'this topic'} has ignited profound debate in contemporary society. While some individuals contend that traditional perspectives remain paramount, I firmly adhere to the view that progressive methodologies offer far superior societal advantages.\n\nOn the one hand, proponents of conventional approaches frequently cite proven reliability as their core justification. From this standpoint, established paradigms mitigate unforeseen socioeconomic hazards and preserve foundational stability. For instance, empirical evidence highlights how standardized frameworks cultivate structural discipline across institutions.\n\nOn the other hand, the compelling benefits of embracing modernization are indisputable. Firstly, adapting to technological and sociological evolutions fosters unprecedented productivity and unlocks innovative solutions to pressing issues. Furthermore, prioritizing contemporary strategies empowers future generations to navigate increasingly complex global challenges effectively.\n\nIn conclusion, although conventional practices provide undeniable initial safeguards, the multifaceted benefits of forward-looking alternatives are far more substantial. Consequently, proactive adoption should be championed across all societal sectors.`;
  }

  // Band 6.5 Model Rewrite (Accessible, clean sentence variety, direct linkage)
  let band65Rewrite = isTask1
    ? `The provided chart presents information regarding ${task?.title || 'the given topic'} during the period shown.\n\nOverall, it is clear that there were significant changes over the period. While some figures increased, others experienced a downward trend.\n\nLooking at the main categories in more detail, the initial numbers started at a moderate level and then rose steadily. In contrast, other figures decreased gradually over time.\n\nIn summary, the data illustrates clear differences between the different groups, with the gap between them changing noticeably by the end of the period.`
    : `Nowadays, there is a common debate about ${task?.prompt?.slice(0, 100) || 'this issue'}. While some people believe that traditional approaches are better, I agree that modern methods provide greater benefits.\n\nOn the one hand, traditional approaches have clear advantages. They have been tested over time and provide security and stability for individuals and organizations. For example, traditional education methods help students focus better in structured environments.\n\nOn the other hand, adopting new methods is essential for continuous progress. Firstly, modern technology and flexible approaches increase efficiency and help solve everyday problems much faster. Secondly, they prepare people better for future challenges in a changing world.\n\nIn conclusion, although traditional methods still hold value, I believe that adopting modern solutions is more beneficial overall.`;

  return {
    overallBand,
    evaluationMethod: 'algorithmic',
    engineName: 'Cambridge Deep Linguistic Evaluator v4 (Chief Examiner Strict Standard)',
    dateGraded: new Date().toISOString(),
    criteria: {
      tr: {
        band: trBand,
        feedback: `Đánh giá mức độ hoàn thành nhiệm vụ (Task ${isTask1 ? 'Achievement' : 'Response'}): ${trBand >= 7.0 ? 'Ý tưởng phát triển toàn diện, lập luận chặt chẽ và bám sát đề thi.' : trBand <= 3.5 ? 'Chưa đáp ứng yêu cầu cơ bản của đề thi, dung lượng thiếu hụt nghiêm trọng hoặc chưa phát triển được luận điểm rõ ràng.' : 'Cần chú ý mở rộng chiều sâu luận điểm, dẫn chứng và dung lượng từ.'}`,
        strengths: trStrengths.length > 0 ? trStrengths : ['Bài viết thể hiện nỗ lực trả lời câu hỏi đề thi.'],
        improvements: trImprovements.length > 0 ? trImprovements : ['Tiếp tục duy trì tính nhất quán và dẫn chứng cụ thể.']
      },
      cc: {
        band: ccBand,
        feedback: `Đánh giá tính mạch lạc và liên kết (Coherence & Cohesion): ${ccBand >= 7.0 ? 'Mạch bài trôi chảy, sử dụng liên từ và đại từ thay thế tự nhiên.' : ccBand <= 3.5 ? 'Bố cục chưa phân đoạn hoặc các câu rời rạc, thiếu tính liên kết logic giữa các ý.' : 'Cần củng cố sự liên kết giữa các câu và phân đoạn ý rõ ràng hơn.'}`,
        strengths: ccStrengths.length > 0 ? ccStrengths : ['Có cố gắng sắp xếp trật tự các câu.'],
        improvements: ccImprovements.length > 0 ? ccImprovements : ['Bổ sung thêm các phương tiện liên kết logic giữa các câu.']
      },
      lr: {
        band: lrBand,
        feedback: `Đánh giá vốn từ vựng (Lexical Resource): ${lrBand >= 7.0 ? 'Vốn từ học thuật phong phú, sử dụng đúng ngữ cảnh và collocations chuẩn xác.' : lrBand <= 3.5 ? 'Vốn từ rất hạn chế, phụ thuộc vào các từ ngữ giao tiếp đơn giản và lặp từ nhiều.' : 'Cần nâng cấp từ vựng cơ bản lên chuẩn học thuật Academic Word List (AWL).'}`,
        strengths: lrStrengths.length > 0 ? lrStrengths : ['Sử dụng được một số từ vựng đúng chủ đề.'],
        improvements: lrImprovements.length > 0 ? lrImprovements : ['Hạn chế dùng từ lặp lại hoặc từ ngữ văn nói thông thường.']
      },
      gra: {
        band: graBand,
        feedback: `Đánh giá ngữ pháp và độ chính xác (Grammar Range & Accuracy): ${graBand >= 7.0 ? `Cấu trúc câu phong phú, tỷ lệ câu không lỗi (EFSR) đạt ${Math.round(efsrRatio)}%.` : graBand <= 3.5 ? `Nhiều lỗi ngữ pháp cơ bản (chia động từ, mạo từ, danh từ số nhiều), tỷ lệ câu không lỗi rất thấp (${Math.round(efsrRatio)}%).` : `Cần kiểm soát lỗi sai cơ bản để nâng tỷ lệ câu không lỗi (EFSR hiện tại: ${Math.round(efsrRatio)}%).`}`,
        strengths: graStrengths.length > 0 ? graStrengths : ['Cấu trúc câu đảm bảo người đọc hiểu được thông điệp.'],
        improvements: graImprovements.length > 0 ? graImprovements : ['Đa dạng hóa các dạng câu phức và kiểm tra kỹ lỗi ngữ pháp.']
      }
    },
    corrections,
    band65Rewrite,
    band8Rewrite,
    keyVocabulary,
    paragraphAnalysis,
    actionPlan,
    wordStats: {
      rawWordCount,
      copiedWordCount,
      effectiveWordCount: wordCount,
      copiedChunks: promptCopying.copiedChunks
    },
    task1Subtype: isTask1 ? task1Subtype : null,
    task1OverviewStats: isTask1 ? {
      hasOverview: task1OverviewCheck?.hasOverview || false,
      hasRawData: task1OverviewCheck?.hasRawData || false,
      rawDataList: task1OverviewCheck?.rawDataList || [],
      overviewIndex: task1OverviewCheck?.overviewIndex ?? -1
    } : null,
    task1ComparisonStats: (isTask1 && task1Subtype === 'chart_graph') ? {
      totalComparisons: task1ComparisonCheck?.totalComparisons || 0,
      uniqueComparisonsCount: task1ComparisonCheck?.uniqueComparisonsCount || 0,
      matchedComparisons: task1ComparisonCheck?.matchedComparisons || [],
      isMechanicalListing: (task1ComparisonCheck?.totalComparisons === 0)
    } : null,
    task1MapStats: (isTask1 && task1Subtype === 'map') ? task1MapCheck : null,
    task1ProcessStats: (isTask1 && task1Subtype === 'process') ? task1ProcessCheck : null,
    task2FulfillmentStats: !isTask1 ? {
      type: task2Fulfillment?.type || 'OPINION',
      isBalanced: task2Fulfillment?.isBalanced ?? true,
      severity: task2Fulfillment?.severity || 'none',
      taskDescription: task2Fulfillment?.taskDescription || '',
      missingPartDescription: task2Fulfillment?.missingPartDescription || null,
      warning: task2Fulfillment?.warning || null
    } : null,
    detectedTopic: {
      topicKey: topicData.topicKey,
      topicNameVi: topicData.topicNameVi
    },
    wordOveruseStats: {
      hasOveruse: wordOveruse.hasOveruse,
      overuseCount: wordOveruse.overuseCount,
      overusedWords: wordOveruse.overusedWords,
      suggestions: wordOveruse.suggestions
    },
    bareNounStats: {
      hasBareNounErrors: bareNounErrorCount > 0,
      bareNounErrorCount
    },
    commaSpliceStats: {
      hasCommaSplices: commaSpliceCount > 0,
      commaSpliceCount,
      details: commaSpliceAnalysis.commaSpliceDetails
    },
    hedgingStats: {
      hasOvergeneralisation: overgeneralisationCount > 0,
      overgeneralisationCount,
      hedgingCount,
      matchedHedging: matchedHedging.map(h => h.match),
      overgeneralisedStatements: overgeneralisedStatements.map(s => s.match)
    }
  };
}

/**
 * Evaluates a complete 60-minute IELTS Writing Mock Exam (Task 1 + Task 2)
 * Produces comprehensive Cambridge diagnostic reports for both tasks
 * and calculates the official Cambridge weighted Overall Writing Band.
 *
 * @param {Object} params
 * @param {Object} params.task1 - Task 1 prompt metadata
 * @param {string} params.task1Text - Candidate response for Task 1
 * @param {Object} params.task2 - Task 2 prompt metadata
 * @param {string} params.task2Text - Candidate response for Task 2
 * @param {number} [params.timeSpentSeconds=3600] - Total time taken in seconds
 * @returns {Object} Mock exam evaluation report
 */
export function evaluateWritingMockExam({
  task1,
  task1Text = '',
  task2,
  task2Text = '',
  timeSpentSeconds = 3600
}) {
  const cleanT1Text = typeof task1Text === 'string' ? task1Text.trim() : '';
  const cleanT2Text = typeof task2Text === 'string' ? task2Text.trim() : '';

  const eval1 = evaluateEssayAlgorithmically({
    task: task1,
    essayText: cleanT1Text || 'No response provided for Task 1.'
  });

  const eval2 = evaluateEssayAlgorithmically({
    task: task2,
    essayText: cleanT2Text || 'No response provided for Task 2.'
  });

  // Calculate official Cambridge weighted Overall Band
  const overall = calculateOverallWritingBand(eval1.overallBand, eval2.overallBand);

  const countWordsSafe = (txt) => {
    if (!txt || typeof txt !== 'string') return 0;
    return (txt.trim().match(/\S+/g) || []).length;
  };

  const t1Words = eval1.wordStats?.rawWordCount ?? eval1.wordStats?.effectiveWordCount ?? countWordsSafe(cleanT1Text);
  const t2Words = eval2.wordStats?.rawWordCount ?? eval2.wordStats?.effectiveWordCount ?? countWordsSafe(cleanT2Text);
  const totalWords = t1Words + t2Words;

  // Pacing Diagnostics
  const minutesSpent = Math.round(timeSpentSeconds / 60);
  let pacingFeedback = '';
  if (minutesSpent < 35 && totalWords < 350) {
    pacingFeedback = 'Thời gian nộp bài quá sớm so với tiêu chuẩn 60 phút và dung lượng chưa đạt chuẩn. Trong kỳ thi thật, hãy tận dụng trọn vẹn 60 phút để phát triển ý và rà soát bài.';
  } else if (t1Words < 150 && t2Words >= 250) {
    pacingFeedback = 'Bạn đã phân bổ thời gian quá nhiều cho Task 2 dẫn đến Task 1 bị thiếu từ (<150 từ). Tỷ lệ lý tưởng là 20 phút cho Task 1 và 40 phút cho Task 2.';
  } else if (t1Words >= 150 && t2Words < 250) {
    pacingFeedback = 'Bạn đã dành quá nhiều thời gian cho Task 1 dẫn đến Task 2 thiếu từ (<250 từ). Lưu ý Task 2 chiếm 2/3 tổng số điểm Writing!';
  } else if (t1Words >= 150 && t2Words >= 250) {
    pacingFeedback = 'Quản lý thời gian và dung lượng xuất sắc! Cả Task 1 và Task 2 đều vượt ngưỡng số từ tối thiểu quy định.';
  } else {
    pacingFeedback = 'Cả hai bài viết đều chưa đạt dung lượng tối thiểu (Task 1: 150 từ, Task 2: 250 từ). Cần rèn luyện tốc độ gõ phím và phản xạ lập dàn ý.';
  }

  // Executive summary
  const strongerTask = eval1.overallBand > eval2.overallBand ? 'Task 1' : eval2.overallBand > eval1.overallBand ? 'Task 2' : 'Cả hai đồng đều';
  const executiveSummary = {
    strongerTask,
    t1LengthStatus: t1Words >= 150 ? 'Đạt chuẩn (150+ từ)' : `Thiếu ${150 - t1Words} từ`,
    t2LengthStatus: t2Words >= 250 ? 'Đạt chuẩn (250+ từ)' : `Thiếu ${250 - t2Words} từ`,
    combinedAdvice: eval2.overallBand < eval1.overallBand
      ? 'Task 2 là trọng số quyết định (chiếm 66.7% điểm). Hãy tập trung nâng cao cấu trúc lập luận và tính cân bằng của Task 2 để kéo điểm Overall lên mạnh mẽ.'
      : 'Task 1 hoàn thành tốt vai trò. Duy trì phong độ Task 2 và tiếp tục đa dạng hóa liên từ so sánh cho Task 1.'
  };

  return {
    date: new Date().toLocaleDateString('vi-VN'),
    t1Band: overall.t1Band,
    t2Band: overall.t2Band,
    rawWeighted: overall.rawWeighted,
    finalOverall: overall.overallBand,
    cefrLevel: overall.cefrLevel,
    weightingFormula: overall.weightingFormula,
    timeSpentSeconds,
    minutesSpent,
    t1Words,
    t2Words,
    totalWords,
    pacingFeedback,
    executiveSummary,
    eval1,
    eval2
  };
}
