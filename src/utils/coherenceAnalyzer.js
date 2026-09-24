/**
 * Cambridge IELTS Task 2 Argument Flow & Paragraph Coherence Engine
 * Evaluates essay macro-structure, paragraph functional anatomy (PEEL),
 * thesis presence, evidence grounding, academic hedging, and overall progression.
 * Aligned with official Cambridge Band Descriptors for Task Response (TR) and Coherence & Cohesion (CC).
 */

// Heuristic pattern catalogs for Task 2 discourse analysis
const THESIS_PATTERNS = [
  {
    regex: /\b(?:in my (?:opinion|view)|from my perspective|I (?:strongly|firmly|completely|totally|wholeheartedly)?\s*(?:agree|disagree|believe|argue|contend|maintain|hold the view|am convinced))\b/i,
    label: 'Personal Direct Stance',
    type: 'direct_stance'
  },
  {
    regex: /\bthis essay (?:will|aims to)?\s*(?:argue|demonstrate|examine|explore|present|analyze|shed light on|contend)\b/i,
    label: 'Essay Declaration',
    type: 'declaration'
  },
  {
    regex: /\b(?:while|although|despite the fact that)\s+[^,.]{8,50},?\s*I (?:believe|contend|maintain|argue|favor|support)\b/i,
    label: 'Nuanced Balanced Thesis',
    type: 'balanced'
  },
  {
    regex: /\b(?:the (?:benefits|advantages|drawbacks|disadvantages) (?:clearly|substantially)?\s*outweigh|do(?:es)? more harm than good|a positive development overall)\b/i,
    label: 'Comparative Evaluative Thesis',
    type: 'evaluative'
  }
];

const TOPIC_SENTENCE_MARKERS = [
  /\b(?:first(?:ly)?|first and foremost|to begin with|in the first place)\b/i,
  /\b(?:the primary|a major|one significant|one prominent|one key|a crucial)\s+(?:reason|factor|advantage|benefit|drawback|cause|argument|merit)\b/i,
  /\b(?:on the one hand|on the other hand)\b/i,
  /\b(?:another|a second|furthermore|moreover|in addition|equally important)\s*(?:compelling|significant|vital)?\s*(?:point|factor|argument|benefit|aspect)\b/i,
  /\b(?:turning to|with regard to|regarding|in terms of)\b/i
];

const EXPLANATION_MARKERS = [
  /\b(?:this is because|in other words|that is to say|the rationale behind|this means that|meaning that)\b/i,
  /\b(?:due to|owing to|as a consequence|consequently|as a result of|leads to|results in|paves the way for)\b/i,
  /\b(?:serves to|implies that|in doing so|by doing so|underpins|fuels|exacerbates|facilitates)\b/i,
  /\b(?:specifically|to be more precise|more specifically)\b/i
];

const EXAMPLE_MARKERS = [
  /\b(?:for example|for instance|to illustrate|as an illustration)\b/i,
  /\b(?:a (?:pertinent|prime|clear|telling|notable|compelling|vivid) example (?:of this )?is)\b/i,
  /\b(?:take (?:for example )?[A-Z][a-z]+|take\s+[\w\s]{3,30}\s+as an example)\b/i,
  /\b(?:a case in point is|such as|evidence (?:shows|demonstrates|suggests) that)\b/i,
  /\b(?:in countries such as|in cities like)\b/i
];

const HEDGING_COUNTER_MARKERS = [
  /\b(?:however|nevertheless|nonetheless|yet)\b/i,
  /\b(?:although|even though|while it is true that|while acknowledging that)\b/i,
  /\b(?:admittedly|despite|in spite of|on the contrary)\b/i,
  /\b(?:it could be argued that|opponents may argue|critics often point out|some might contend)\b/i,
  /\b(?:tends to|is prone to|in many cases|under certain circumstances|to a certain extent)\b/i
];

const CONCLUDING_LINK_MARKERS = [
  /\b(?:therefore|thus|hence|consequently|as a result|accordingly)\b/i,
  /\b(?:in this regard|for this reason|ultimately|in light of this)\b/i
];

const CONCLUSION_PARAGRAPH_MARKERS = [
  /\b(?:in conclusion|to conclude|to summarize|in summary|to sum up|overall|in a nutshell|all things considered)\b/i
];

/**
 * Split text into distinct sentences with robust punctuation boundary handling
 */
export function splitSentences(text) {
  if (!text || typeof text !== 'string') return [];
  // Match end of sentence followed by space and capital or end of string
  const raw = text.replace(/([.?!])\s*(?=[A-Z0-9"']|$)/g, '$1|---SPLIT---|').split('|---SPLIT---|');
  return raw.map(s => s.trim()).filter(s => s.length > 4);
}

/**
 * Classify a sentence's rhetorical function in a paragraph
 */
export function classifySentenceRole(sentence, sentenceIndex, totalSentencesInPara, paraRole) {
  const s = sentence.trim();
  const lower = s.toLowerCase();

  // In Introduction
  if (paraRole === 'intro') {
    for (const pat of THESIS_PATTERNS) {
      if (pat.regex.test(s)) {
        return {
          role: 'thesis',
          roleLabel: 'Luận điểm chính (Thesis Statement)',
          badgeColor: 'indigo',
          confidence: 'high',
          matchedType: pat.type
        };
      }
    }
    if (sentenceIndex === 0) {
      return {
        role: 'background',
        roleLabel: 'Bối cảnh / Diễn giải đề (Background / Paraphrase)',
        badgeColor: 'sky',
        confidence: 'high'
      };
    }
    return {
      role: 'intro_supporting',
      roleLabel: 'Dẫn nhập bổ trợ',
      badgeColor: 'slate',
      confidence: 'medium'
    };
  }

  // In Conclusion
  if (paraRole === 'conclusion') {
    if (CONCLUSION_PARAGRAPH_MARKERS.some(r => r.test(s))) {
      return {
        role: 'conclusion_signal',
        roleLabel: 'Tín hiệu kết bài & Tái khẳng định lập trường',
        badgeColor: 'emerald',
        confidence: 'high'
      };
    }
    return {
      role: 'conclusion_summary',
      roleLabel: 'Tóm lược luận điểm & Triển vọng tương lai',
      badgeColor: 'teal',
      confidence: 'medium'
    };
  }

  // In Body Paragraph
  // 1. Example check (High specificity)
  if (EXAMPLE_MARKERS.some(r => r.test(s))) {
    return {
      role: 'example',
      roleLabel: 'Dẫn chứng thực tế (Example / Evidence)',
      badgeColor: 'purple',
      confidence: 'high'
    };
  }

  // 2. Hedging & Counter-argument
  if (HEDGING_COUNTER_MARKERS.some(r => r.test(s))) {
    return {
      role: 'hedging',
      roleLabel: 'Thận trọng & Phản biện (Hedging / Nuance)',
      badgeColor: 'amber',
      confidence: 'high'
    };
  }

  // 3. Topic Sentence (usually sentence 0 or 1)
  if (sentenceIndex <= 1 && (TOPIC_SENTENCE_MARKERS.some(r => r.test(s)) || sentenceIndex === 0)) {
    return {
      role: 'topic',
      roleLabel: 'Câu chủ đề (Topic Sentence / Point)',
      badgeColor: 'blue',
      confidence: sentenceIndex === 0 ? 'high' : 'medium'
    };
  }

  // 4. Concluding / Linking Sentence (Last sentence)
  if (sentenceIndex === totalSentencesInPara - 1 && CONCLUDING_LINK_MARKERS.some(r => r.test(s))) {
    return {
      role: 'linking',
      roleLabel: 'Chốt đoạn & Móc nối (Link / Mini-conclusion)',
      badgeColor: 'rose',
      confidence: 'high'
    };
  }

  // 5. Explanation / Elaboration
  if (EXPLANATION_MARKERS.some(r => r.test(s))) {
    return {
      role: 'explanation',
      roleLabel: 'Giải thích chiều sâu (Explanation / Elaboration)',
      badgeColor: 'emerald',
      confidence: 'high'
    };
  }

  // Fallback for Body
  return {
    role: 'explanation',
    roleLabel: 'Phát triển ý / Diễn giải',
    badgeColor: 'emerald',
    confidence: 'medium'
  };
}

/**
 * Main Coherence & Argument Flow Analyzer for IELTS Task 2
 */
export function analyzeTask2Coherence(essayText, promptText = '') {
  if (!essayText || typeof essayText !== 'string' || !essayText.trim()) {
    return {
      totalWords: 0,
      paragraphCount: 0,
      paragraphs: [],
      thesis: { hasThesis: false, thesisSentence: '', quality: 'missing', feedback: 'Chưa có nội dung bài viết.' },
      conclusion: { hasConclusion: false, feedback: 'Chưa có kết bài.' },
      overallScore: 0,
      bandEstimate: '0.0',
      progression: 'none',
      status: 'empty',
      statusLabel: 'Chưa có bài viết',
      strengths: [],
      warnings: ['Vui lòng bắt đầu gõ bài luận để phân tích cấu trúc lập luận.'],
      recommendations: []
    };
  }

  // Split into raw paragraphs
  const rawParagraphs = essayText
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const paragraphCount = rawParagraphs.length;
  const wordTokens = essayText.match(/\b[\w'-]+\b/g) || [];
  const totalWords = wordTokens.length;

  const paragraphs = [];
  let detectedThesis = null;
  let detectedConclusion = null;
  let totalExamples = 0;
  let totalHedging = 0;
  let totalTopicSentences = 0;

  rawParagraphs.forEach((paraText, pIdx) => {
    const pWords = (paraText.match(/\b[\w'-]+\b/g) || []).length;
    let role = 'body';
    let label = `Thân bài ${pIdx} (Body)`;

    if (pIdx === 0) {
      role = 'intro';
      label = 'Mở bài (Introduction)';
    } else if (pIdx === paragraphCount - 1 && paragraphCount >= 3) {
      role = 'conclusion';
      label = 'Kết bài (Conclusion)';
    }

    const sentences = splitSentences(paraText);
    const analyzedSentences = sentences.map((sent, sIdx) => {
      const classification = classifySentenceRole(sent, sIdx, sentences.length, role);
      if (classification.role === 'thesis' && !detectedThesis) {
        detectedThesis = {
          sentence: sent,
          index: sIdx,
          type: classification.matchedType
        };
      }
      if (classification.role === 'example') totalExamples++;
      if (classification.role === 'hedging') totalHedging++;
      if (classification.role === 'topic') totalTopicSentences++;

      return {
        sentenceIndex: sIdx,
        text: sent,
        ...classification
      };
    });

    // Paragraph-specific diagnostics
    const hasTopic = analyzedSentences.some(s => s.role === 'topic');
    const hasExplanation = analyzedSentences.some(s => s.role === 'explanation');
    const hasExample = analyzedSentences.some(s => s.role === 'example');
    const hasHedging = analyzedSentences.some(s => s.role === 'hedging');
    const hasThesisInPara = analyzedSentences.some(s => s.role === 'thesis');

    const paraRecommendations = [];
    if (role === 'body') {
      if (!hasTopic) paraRecommendations.push('Thêm câu chủ đề (Topic Sentence) ở đầu đoạn để định hướng rõ nội dung.');
      if (!hasExample) paraRecommendations.push('Cần bổ sung ví dụ thực tế (For instance, Such as...) để minh họa cụ thể cho luận điểm.');
      if (!hasHedging) paraRecommendations.push('Có thể bổ sung yếu tố phản biện/thận trọng học thuật (However, Although...) để nâng tính thuyết phục.');
    } else if (role === 'intro') {
      if (!hasThesisInPara) paraRecommendations.push('Thiếu câu Thesis Statement nêu rõ quan điểm cá nhân.');
    }

    paragraphs.push({
      index: pIdx,
      role,
      label,
      text: paraText,
      wordCount: pWords,
      sentenceCount: sentences.length,
      sentences: analyzedSentences,
      health: {
        hasTopic,
        hasExplanation,
        hasExample,
        hasHedging,
        hasThesis: hasThesisInPara
      },
      recommendations: paraRecommendations
    });
  });

  // Evaluate Thesis Statement
  const introPara = paragraphs[0];
  const hasThesis = !!detectedThesis;
  let thesisQuality = 'missing';
  let thesisFeedback = '';

  if (hasThesis) {
    thesisQuality = 'strong';
    thesisFeedback = '✅ Đã xác định câu Thesis Statement nêu rõ lập trường ở Mở bài (đáp ứng tiêu chí Band 7.0+ TR: "presents a clear position throughout").';
  } else {
    thesisQuality = 'missing';
    thesisFeedback = '⚠️ Mở bài chưa có câu thể hiện lập trường cá nhân rõ ràng (Thesis Statement). Giám khảo Cambridge sẽ khống chế Task Response ở mức tối đa Band 6.0!';
  }

  // Evaluate Conclusion
  const conclusionPara = paragraphCount >= 3 ? paragraphs[paragraphs.length - 1] : null;
  let hasConclusionSignal = false;
  let conclusionFeedback = '';

  if (conclusionPara) {
    hasConclusionSignal = CONCLUSION_PARAGRAPH_MARKERS.some(r => r.test(conclusionPara.text));
    if (hasConclusionSignal) {
      conclusionFeedback = '✅ Kết bài có từ tín hiệu rõ ràng và khép lại bài viết mạch lạc.';
    } else {
      conclusionFeedback = '⚠️ Kết bài thiếu cụm từ tín hiệu tiêu chuẩn (In conclusion, To summarize...) để đánh dấu kết thúc bài viết.';
    }
  } else {
    conclusionFeedback = '⚠️ Bài viết chưa có đoạn Kết bài riêng biệt! Nguy cơ mất điểm lớn về cấu trúc (CC và TR khống chế Band 5.0 - 6.0).';
  }

  // Assess Structural Progression
  const isStandardParagraphing = paragraphCount === 4 || paragraphCount === 5;
  const strengths = [];
  const warnings = [];
  const recommendations = [];

  if (isStandardParagraphing) {
    strengths.push(`Cấu trúc ${paragraphCount} đoạn chuẩn Cambridge (Mở bài - ${paragraphCount - 2} Thân bài - Kết bài).`);
  } else if (paragraphCount < 3) {
    warnings.push(`Bài viết hiện mới có ${paragraphCount} đoạn. Mô hình chuẩn Task 2 cần 4-5 đoạn riêng biệt.`);
    recommendations.push('Tách bài viết thành 4 đoạn: Mở bài, Thân bài 1, Thân bài 2 và Kết bài.');
  } else if (paragraphCount > 5) {
    warnings.push(`Bài viết có tới ${paragraphCount} đoạn nhỏ lẻ. Tránh chia đoạn vụn vặt gây mất tính gắn kết.`);
  }

  if (hasThesis) {
    strengths.push('Mở bài có Thesis Statement rõ ràng, giữ vững lập trường từ đầu bài.');
  } else {
    warnings.push('Chưa tìm thấy Thesis Statement ở Mở bài.');
    recommendations.push('Bổ sung 1 câu thể hiện quan điểm cá nhân trực tiếp ở cuối đoạn Mở bài.');
  }

  if (totalExamples >= 2) {
    strengths.push(`Có ${totalExamples} dẫn chứng thực tế minh họa trong các đoạn thân bài.`);
  } else {
    warnings.push(`Mới có ${totalExamples} dẫn chứng thực tế trong thân bài (khuyến nghị: tối thiểu 2 ví dụ).`);
    recommendations.push('Đưa thêm ví dụ cụ thể (For example, A prime example is...) để làm luận điểm sâu sắc hơn.');
  }

  if (totalHedging >= 1) {
    strengths.push('Có sử dụng ngôn ngữ phản đề / thận trọng học thuật (Hedging).');
  }

  // Calculate Algorithmic CC/TR Band Estimate
  let baseBand = 5.0;
  if (totalWords >= 250) baseBand += 0.5;
  if (isStandardParagraphing) baseBand += 0.5;
  if (hasThesis) baseBand += 0.5;
  if (hasConclusionSignal) baseBand += 0.5;
  if (totalExamples >= 2) baseBand += 0.5;
  if (totalHedging >= 1) baseBand += 0.5;
  if (paragraphs.filter(p => p.role === 'body').every(p => p.health.hasTopic && p.health.hasExplanation)) {
    baseBand += 0.5;
  }

  // Cap at 8.5 for heuristic
  const calculatedBand = Math.min(8.5, Math.max(4.0, baseBand)).toFixed(1);

  let statusLabel = 'Đạt chuẩn ✓';
  let status = 'optimal';
  if (paragraphCount < 3) {
    statusLabel = 'Chưa đủ đoạn';
    status = 'critical';
  } else if (!hasThesis) {
    statusLabel = 'Thiếu Thesis ⚠️';
    status = 'needs_work';
  } else if (totalExamples === 0) {
    statusLabel = 'Thiếu ví dụ ⚠️';
    status = 'needs_work';
  } else if (totalWords < 200) {
    statusLabel = 'Chưa đủ từ ⚠️';
    status = 'needs_work';
  }

  return {
    totalWords,
    paragraphCount,
    isStandardParagraphing,
    paragraphs,
    thesis: {
      hasThesis,
      thesisSentence: detectedThesis ? detectedThesis.sentence : '',
      quality: thesisQuality,
      feedback: thesisFeedback
    },
    conclusion: {
      hasConclusion: !!conclusionPara,
      hasSignal: hasConclusionSignal,
      feedback: conclusionFeedback
    },
    metrics: {
      totalExamples,
      totalHedging,
      totalTopicSentences,
      bodyParagraphCount: paragraphs.filter(p => p.role === 'body').length
    },
    overallScore: Math.round((parseFloat(calculatedBand) / 9.0) * 100),
    bandEstimate: calculatedBand,
    status,
    statusLabel,
    strengths,
    warnings,
    recommendations,
    sampleTemplates: {
      opinionAgree: 'In my opinion, I completely agree with this view because [Lý do chính 1], and [Lý do chính 2].',
      opinionDisagree: 'From my perspective, I firmly disagree with this statement since [Lý do phản bác 1], and [Lý do phản bác 2].',
      bothViews: 'While it is true that [Quan điểm A có cơ sở nhất định], I am convinced that [Quan điểm B có sức thuyết phục hơn nhiều].',
      peelExample: 'For instance, in countries such as Singapore, [mô tả trường hợp thực tế mang tính chứng minh].',
      conclusionSignal: 'In conclusion, while [thừa nhận ngắn gọn khía cạnh đối lập], I strongly reaffirm that [khẳng định lại lập trường chính của bạn].'
    }
  };
}
