import { STOPWORDS } from './evaluationRuleCatalogs.js';
import { ACADEMIC_THESAURUS, lookupSynonyms } from '../../data/academicThesaurus.js';
import {
  sanitizeWords,
  roundToCambridgeBand,
  extractTask1RawDataPoints
} from './task1AndTask2Analyzers.js';

/**
 * Word Overuse & Repetition Analyzer
 * Detects frequent, repetitive use of non-stopword academic & everyday terms (>= 4 times)
 * and provides C1/C2 academic alternative suggestions from ACADEMIC_THESAURUS.
 *
 * @param {string[]} rawWords - Array of lowercase words from the essay
 * @param {Set<string>} stopwords - Stopwords to ignore
 * @returns {Object} Overuse diagnostics
 */
export function analyzeWordOveruse(rawWords, stopwords = STOPWORDS) {
  if (!Array.isArray(rawWords) || rawWords.length === 0) {
    return {
      hasOveruse: false,
      overusedWords: [],
      overuseCount: 0,
      suggestions: []
    };
  }

  const frequencyMap = {};
  rawWords.forEach(word => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    const isThesaurusWord = Boolean(ACADEMIC_THESAURUS[clean]);
    if (clean.length >= 4 && (!stopwords.has(clean) || isThesaurusWord)) {
      frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
    }
  });

  const overusedWords = [];
  const suggestions = [];

  // Sort by frequency descending
  const sortedWords = Object.entries(frequencyMap)
    .filter(([_, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1]);

  for (const [word, count] of sortedWords) {
    const thesaurusMatches = lookupSynonyms(word);
    overusedWords.push({
      word,
      count,
      hasThesaurus: thesaurusMatches.length > 0
    });

    if (thesaurusMatches.length > 0 && suggestions.length < 5) {
      suggestions.push({
        word,
        count,
        alternatives: thesaurusMatches.slice(0, 4)
      });
    }
  }

  return {
    hasOveruse: overusedWords.length > 0,
    overusedWords,
    overuseCount: overusedWords.length,
    suggestions
  };
}

/**
 * Analyzes sentences for Comma Splices (two independent clauses joined only with a comma).
 * Cambridge GRA Standard: Band 8.0 requires 0 comma splices;
 * >= 2 comma splices caps GRA at max 6.0; >= 4 caps at max 5.0.
 */
export function analyzeCommaSplices(sentences) {
  if (!Array.isArray(sentences) || sentences.length === 0) {
    return { commaSpliceCount: 0, commaSpliceDetails: [] };
  }

  const SUBORDINATOR_START = /^(although|even though|though|while|whereas|because|since|if|unless|when|whenever|after|before|once|as long as|provided that|given that|despite the fact that|as [a-z]+ed\b)/i;

  const FINITE_VERB_REGEX = /\b(is|are|was|were|has|have|had|do|does|did|can|cannot|can't|could|will|won't|would|should|must|may|might|become|becomes|became|remain|remains|remained|seem|seems|seemed|appear|appears|appeared|serves?|served|brings?|brought|provides?|provided|creates?|created|leads?|led|helps?|helped|causes?|caused|aims?|aimed|tends?|tended|makes?|made|allows?|allowed|enables?|enabled|means?|meant|gives?|gave|given|wants?|wanted|needs?|needed|requires?|required|demands?|demanded|faces?|faced|destroys?|destroyed|harms?|harmed|damages?|damaged|plays?|played|struggles?|struggled|fails?|failed|costs?|results?|resulted|stems?|stemmed|produces?|produced|generates?|generated|works?|worked|lives?|lived|believes?|believed|thinks?|thought|argues?|argued|suggests?|suggested|shows?|showed|shown|lacks?|lacked|suffers?|suffered|spends?|spent|chooses?|chose|chosen|loses?|lost|finds?|found|sees?|saw|seen|takes?|took|taken|builds?|built|grows?|grew|grown|knows?|knew|known|falls?|fell|fallen|rises?|rose|risen|pays?|paid|offers?|offered|gains?|gained|solves?|solved|improves?|improved|increases?|increased|decreases?|decreased|declines?|declined|develops?|developed|affects?|affected|impacts?|impacted|influences?|influenced|secures?|secured|obtains?|obtained|encounters?|encountered|experiences?|experienced|undergoes?|underwent|boosts?|boosted|enhances?|enhanced|tackles?|tackled|addresses?|addressed|invests?|invested|funds?|funded|imposes?|imposed|implements?|implemented|adopts?|adopted|introduces?|introduced|establishes?|established|relies?|relied|depends?|depended|promotes?|promoted|prevents?|prevented|reduces?|reduced|limits?|limited|expands?|expanded|surpasses?|surpassed|exceeds?|exceeded|outstrips?|outstripped|demonstrates?|demonstrated|indicates?|indicated|proves?|proved|proven|reveals?|revealed|illustrates?|illustrated|claims?|claimed|asserts?|asserted|contends?|contended|maintains?|maintained|emphasizes?|emphasized|highlights?|highlighted|prefers?|preferred)\b/i;

  const isIntroductoryPhrase = (clause) => {
    if (/^(compared\s+to|given\s+that|having\s+[a-z]+ed)\b/i.test(clause)) return true;
    if (/^to\s+[a-z]+\b/i.test(clause) && !/\b(is|are|was|were|will|can|should|must)\b/i.test(clause)) return true;
    if (/^[a-z]+ing\b/i.test(clause) && !FINITE_VERB_REGEX.test(clause.replace(/^[a-z]+ing\b/i, ''))) return true;
    return false;
  };

  // Pattern 1: Conjunctive adverbs incorrectly joined with comma
  const CONJUNCTIVE_ADVERB_REGEX = /,\s*(however|therefore|furthermore|moreover|consequently|nevertheless|nonetheless)(?:,\s*|\s+)([a-z]+)\b/gi;

  // Pattern 2: Pronoun / Demonstrative subject + finite verb
  const PRONOUN_SPLICE_REGEX = /,\s*(it|they|this|these|he|she|we)\s+(?:(often|always|also|now|simply|currently|greatly|directly|rarely|seldom)\s+)?(is|are|was|were|has|have|had|will|would|can|cannot|can't|could|should|must|may|might|brings?|provides?|creates?|leads?|helps?|causes?|aims?|tends?|makes?|allows?|enables?|means?|gives?|wants?|needs?|faces?|destroys?|harms?|plays?|struggles?|fails?|costs?|results?|stems?|produces?|generates?|requires?)\b/gi;

  // Pattern 3: Existential there is/are
  const EXISTENTIAL_SPLICE_REGEX = /,\s*(there\s+(is|are|was|were|will\s+be|has\s+been|have\s+been))\b/gi;

  // Pattern 4: Common IELTS plural / institutional subjects + modal/aux/verb
  const NOUN_SPLICE_REGEX = /,\s*(students|people|governments|citizens|parents|children|individuals|companies|workers|consumers|universities|schools|colleges|institutions)\s+(?:(often|always|also|now|simply|currently)\s+)?(can|cannot|can't|could|will|won't|would|should|must|have|has|had|are|were|tend\s+to|need\s+to|face|struggle\s+with|suffer\s+from|play|invest)\b/gi;

  const details = [];

  sentences.forEach((sentence, sIdx) => {
    const s = sentence.trim();
    if (!s || s.length < 25) return;

    // Subordinate clause at sentence start -> main clause following comma is valid!
    if (SUBORDINATOR_START.test(s)) return;

    // Check Pattern 1: Conjunctive Adverb Splice
    CONJUNCTIVE_ADVERB_REGEX.lastIndex = 0;
    let match;
    while ((match = CONJUNCTIVE_ADVERB_REGEX.exec(s)) !== null) {
      const matchIndex = match.index;
      const preComma = s.substring(0, matchIndex).trim();
      const adverb = match[1];
      const nextWord = match[2];

      // Pre-comma must have a finite verb and not be an introductory phrase
      if (preComma.split(/\s+/).length >= 3 &&
          FINITE_VERB_REGEX.test(preComma) &&
          !isIntroductoryPhrase(preComma)) {

        // Ensure post-adverb has a subject/verb (not a parenthetical adverb like "This, however, is...")
        const postAdverbText = s.substring(matchIndex + match[0].length).trim();
        if (FINITE_VERB_REGEX.test(postAdverbText)) {
          const capitalizedAdverb = adverb.charAt(0).toUpperCase() + adverb.slice(1);
          const suggestionOption1 = s.replace(match[0], `; ${adverb}, ${nextWord}`);
          const suggestionOption2 = s.replace(match[0], `. ${capitalizedAdverb}, ${nextWord}`);

          details.push({
            sentenceIndex: sIdx,
            original: s,
            commaFragment: match[0].trim(),
            suggestion: `${suggestionOption1} (hoặc: ${suggestionOption2})`,
            explanation: `Lỗi Comma Splice với trạng từ liên kết ('${adverb}'): Trong văn phong học thuật, các trạng từ liên kết ('however', 'therefore', 'furthermore'...) nối hai mệnh đề độc lập bắt buộc phải dùng dấu chấm phẩy (; ${adverb},) hoặc tách thành câu mới (. ${capitalizedAdverb},), không được chỉ dùng dấu phẩy.`
          });
          return;
        }
      }
    }

    // Helper to test patterns 2, 3, 4
    const checkSplicePattern = (regex, type) => {
      regex.lastIndex = 0;
      let pMatch;
      while ((pMatch = regex.exec(s)) !== null) {
        const matchIndex = pMatch.index;
        const preComma = s.substring(0, matchIndex).trim();

        // Safeguard checks on preComma
        if (preComma.split(/\s+/).length < 3) continue;
        if (!FINITE_VERB_REGEX.test(preComma)) continue;
        if (isIntroductoryPhrase(preComma)) continue;

        // Check if preComma has internal commas and examine the immediate preceding clause
        const preParts = preComma.split(',');
        const immediatePre = preParts[preParts.length - 1].trim();
        if (!FINITE_VERB_REGEX.test(immediatePre) && preParts.length > 1) {
          const previousPart = preParts[preParts.length - 2].trim();
          if (!FINITE_VERB_REGEX.test(previousPart)) continue;
        }

        const matchedText = pMatch[0]; // e.g. ", it brings" or ", students cannot"
        const cleanMatched = matchedText.replace(/^,\s*/, '');

        let suggestion = '';
        if (type === 'pronoun') {
          const pronoun = pMatch[1].toLowerCase();
          const adv = pMatch[2] ? pMatch[2] + ' ' : '';
          const verb = pMatch[3];
          if (pronoun === 'it' || pronoun === 'this') {
            suggestion = s.replace(matchedText, `, which ${adv}${verb}`);
          } else {
            suggestion = s.replace(matchedText, `, and ${cleanMatched}`);
          }
        } else if (type === 'existential') {
          suggestion = s.replace(matchedText, `; ${cleanMatched}`);
        } else {
          suggestion = s.replace(matchedText, `, and ${cleanMatched}`);
        }

        details.push({
          sentenceIndex: sIdx,
          original: s,
          commaFragment: matchedText.trim(),
          suggestion: `${suggestion} (hoặc tách câu bằng dấu chấm)`,
          explanation: `Lỗi Comma Splice (ghép hai mệnh đề độc lập S+V bằng dấu phẩy): Mệnh đề '${cleanMatched}...' là một mệnh đề hoàn chỉnh, không thể nối với mệnh đề trước chỉ bằng dấu phẩy. Cách khắc phục chuẩn Cambridge: (1) Thêm liên từ kết hợp (', and ${cleanMatched}...'), (2) Dùng mệnh đề quan hệ (', which...'), hoặc (3) Tách bằng dấu chấm hoặc chấm phẩy.`
        });
        return true;
      }
      return false;
    };

    if (checkSplicePattern(PRONOUN_SPLICE_REGEX, 'pronoun')) return;
    if (checkSplicePattern(EXISTENTIAL_SPLICE_REGEX, 'existential')) return;
    if (checkSplicePattern(NOUN_SPLICE_REGEX, 'noun')) return;
  });

  return {
    commaSpliceCount: details.length,
    commaSpliceDetails: details
  };
}

// Academic Hedging & Overgeneralisation Constants (Cambridge Task 2 Band 6 vs 7-9 Standard)
export const HEDGING_PATTERNS = [
  { regex: /\b(may|might|could)\s+(?:well\s+)?(be|lead|contribute|cause|result|stem|play|affect|impact|enhance|provide|offer|help|induce|foster|mitigate|diminish|disrupt)\b/gi, label: 'tentative modal' },
  { regex: /\b(tends?|tended|tendency)\s+to\b/gi, label: 'tendency verb' },
  { regex: /\b(appears?|appeared|seems?|seemed)\s+to\b/gi, label: 'appearance verb' },
  { regex: /\b(is|are|was|were|become|becomes)\s+(?:more\s+|less\s+)?(likely|unlikely|inclined|prone|susceptible)\s+to\b/gi, label: 'probability adjective' },
  { regex: /\b(arguably|potentially|conceivably|plausibly|predominantly|largely|frequently)\b/gi, label: 'epistemic adverb' },
  { regex: /\b(evidence|research|studies|empirical\s+data)\s+(suggests?|indicates?|demonstrates?|implies?)\s+that\b/gi, label: 'evidentiary framing' },
  { regex: /\b(it\s+can\s+be\s+argued\s+that|it\s+is\s+often\s+asserted\s+that|to\s+a\s+certain\s+extent|in\s+many\s+instances|in\s+numerous\s+cases|under\s+certain\s+circumstances)\b/gi, label: 'impersonal qualification' }
];

export const OVERGENERALISATION_PATTERNS = [
  { regex: /\b(everyone|everybody)\s+(always|never|knows\s+that|believes\s+that|must|will)\b/gi, fix: 'many individuals tend to', label: 'Quy chụp toàn thể (everyone)' },
  { regex: /\b(all\s+people|all\s+citizens|all\s+students|all\s+children|all\s+parents|all\s+governments)\s+(always|never|will\s+definitely|must\s+always|are\s+all)\b/gi, fix: 'a significant proportion of individuals often', label: 'Quy chụp nhóm đối tượng (all people)' },
  { regex: /\b(no\s+one|nobody)\s+(can\s+deny\s+that|ever\s+thinks|can\s+ever|will\s+ever)\b/gi, fix: 'few observers would dispute that', label: 'Quy chụp phủ định tuyệt đối (no one)' },
  { regex: /\b(will\s+definitely|will\s+certainly|is\s+definitely|is\s+certainly)\s+(destroy|ruin|fail|succeed|lead\s+to|cause|eliminate|solve)\b/gi, fix: 'is likely to severely impact', label: 'Khẳng định tương lai tuyệt đối (definitely/certainly)' },
  { regex: /\b(100%|one\s+hundred\s+percent)\b/gi, fix: 'the overwhelming majority of', label: 'Số liệu tuyệt đối hóa (100%)' },
  { regex: /\b(always\s+leads?\s+to|always\s+causes?|always\s+results?\s+in)\b/gi, fix: 'frequently contributes to', label: 'Quy luật nhân quả tuyệt đối (always leads to)' },
  { regex: /\b(never\s+leads?\s+to|never\s+causes?|never\s+results?\s+in)\b/gi, fix: 'is unlikely to result in', label: 'Nhân quả phủ định tuyệt đối (never leads to)' },
  { regex: /\b(an\s+absolute\s+truth|without\s+any\s+doubt|there\s+is\s+no\s+doubt\s+whatsoever)\b/gi, fix: 'it is widely acknowledged that', label: 'Khẳng định chân lý tuyệt đối' },
  { regex: /\bthe\s+only\s+(?:solution|way|measure|method)\s+(?:(?:to|for)\s+[^,\.]{1,40}?\s+)?(?:is|would\s+be)\b|\bthe\s+only\s+way\s+to\s+(?:solve|tackle|address|eliminate|reduce|curb|stop|prevent)\b/gi, fix: 'one of the most viable solutions is', label: 'Khẳng định giải pháp duy nhất' }
];

/**
 * Analyzes academic hedging (tentative language) and penalizes dogmatic overgeneralisations.
 * Cambridge Standard:
 * - Band 7.0+ Task Response requires balanced, tentative, and well-supported ideas.
 * - Band 6.0 Task Response: "may tend to overgeneralise".
 * - >= 2 Overgeneralisations: Cap Task Response at Band 6.0 max.
 * - >= 3 Hedging structures + 0 Overgeneralisations: Reward academic maturity (+0.5 TR nuance).
 */
export function analyzeHedgingAndOvergeneralisation(paragraphs, sentences, isTask1 = false) {
  if (isTask1 || !Array.isArray(sentences) || sentences.length === 0) {
    return {
      hedgingCount: 0,
      matchedHedging: [],
      overgeneralisationCount: 0,
      overgeneralisedStatements: []
    };
  }

  const isNegativelyQualified = (sentence, matchIndex) => {
    const preceding = sentence.substring(Math.max(0, matchIndex - 35), matchIndex).toLowerCase().trim();
    if (/\b(not|never|hardly|scarcely|does\s+not\s+mean\s+that|cannot\s+say\s+that)\b/i.test(preceding)) return true;
    const surrounding = sentence.substring(Math.max(0, matchIndex - 10), matchIndex + 15);
    if (/\bnot\s+all\b/i.test(surrounding)) return true;
    return false;
  };

  const matchedHedging = [];
  const overgeneralisedStatements = [];
  const seenHedgeFragments = new Set();
  const seenOvergenFragments = new Set();

  sentences.forEach((sentence, sIdx) => {
    const s = sentence.trim();
    if (!s || s.length < 15) return;

    // Check Hedging
    HEDGING_PATTERNS.forEach(pat => {
      pat.regex.lastIndex = 0;
      let hMatch;
      while ((hMatch = pat.regex.exec(s)) !== null) {
        const text = hMatch[0].trim();
        const key = `${sIdx}-${text.toLowerCase()}`;
        if (!seenHedgeFragments.has(key)) {
          seenHedgeFragments.add(key);
          matchedHedging.push({
            pattern: pat.label,
            match: text,
            sentenceIndex: sIdx,
            sentence: s
          });
        }
      }
    });

    // Check Overgeneralisation
    OVERGENERALISATION_PATTERNS.forEach(pat => {
      pat.regex.lastIndex = 0;
      let oMatch;
      while ((oMatch = pat.regex.exec(s)) !== null) {
        if (isNegativelyQualified(s, oMatch.index)) continue;
        const text = oMatch[0].trim();
        const key = `${sIdx}-${text.toLowerCase()}`;
        if (!seenOvergenFragments.has(key)) {
          seenOvergenFragments.add(key);
          const suggestion = s.replace(oMatch[0], pat.fix);
          overgeneralisedStatements.push({
            label: pat.label,
            match: text,
            sentenceIndex: sIdx,
            sentence: s,
            suggestion: `${suggestion} (Thay bằng ngôn ngữ cẩn trọng Hedging)`,
            explanation: `Lỗi Quy chụp tuyệt đối (Overgeneralisation): Cụm từ '${text}' mang tính khẳng định tuyệt đối hóa, thiếu tính khách quan khoa học. Tiêu chí Cambridge Band 6.0 Task Response chỉ rõ 'may tend to overgeneralise'. Barem Band 7.0+ đòi hỏi ngôn ngữ cẩn trọng (Hedging) như '${pat.fix}' để thể hiện lập luận chín chắn, đa chiều.`
          });
        }
      }
    });
  });

  return {
    hedgingCount: matchedHedging.length,
    matchedHedging,
    overgeneralisationCount: overgeneralisedStatements.length,
    overgeneralisedStatements
  };
}

/**
 * Deep Paragraph-by-Paragraph Examiner Diagnostics
 * Analyzes Introduction, Body Paragraphs, and Conclusion structure according to P.E.E.L and Cambridge standards.
 */
export function analyzeParagraphsDeeply(paragraphs, isTask1, task, task1OverviewCheck = null, task1Subtype = 'chart_graph') {
  if (!paragraphs || paragraphs.length === 0) return [];

  const results = [];

  // 1. Introduction Analysis
  if (paragraphs.length >= 1) {
    const introText = paragraphs[0];
    const introLower = introText.toLowerCase();
    const hasCliché = /\b(in this modern (era|world|society)|in today s (world|society)|nowadays|since the dawn of (time|humanity)|a hot debate|a controversial issue|every coin has two sides|a double-edged sword)\b/i.test(introLower);
    const hasThesis = /\b(i firmly (believe|agree|disagree|argue|contend)|in my (opinion|view)|this essay will (examine|discuss|argue)|i will discuss|my view is that|i completely agree|i completely disagree)\b/i.test(introLower);
    const introWords = sanitizeWords(introText).length;

    results.push({
      paragraphIndex: 1,
      name: 'Đoạn 1: Mở Bài (Introduction)',
      wordCount: introWords,
      verdict: isTask1
        ? (task1Subtype === 'map'
            ? 'Mở bài cần giới thiệu ngắn gọn các bản đồ và khung thời gian so sánh (Paraphrase đề bài) trong 1-2 câu súc tích.'
            : task1Subtype === 'process'
            ? 'Mở bài cần giới thiệu ngắn gọn quy trình sản xuất hoặc vòng đời tự nhiên (Paraphrase đề bài) trong 1-2 câu súc tích.'
            : 'Mở bài cần giới thiệu lại ngắn gọn biểu đồ (Paraphrase đề bài) trong 1-2 câu súc tích.')
        : (hasThesis
            ? 'Rất tốt: Mở bài đã nêu rõ quan điểm cá nhân (Thesis statement rõ ràng, không nước đôi).'
            : 'CẢNH BÁO GIÁM KHẢO: Mở bài chưa nêu rõ lập trường cá nhân (Missing Thesis Statement). Barem Cambridge yêu cầu lập trường rõ ràng ngay từ Mở bài để mở khóa Band 7.0+ TR.'),
      clicheWarning: hasCliché ? 'Phát hiện câu mở đầu sáo rỗng/rập khuôn ("In this modern era / Nowadays / Every coin has two sides"). Hãy bỏ những mẫu câu khuôn sáo này để mở bài trang trọng, tự nhiên.' : null,
      recommendation: isTask1
        ? (task1Subtype === 'map'
            ? 'Công thức mở bài Map chuẩn: "The provided maps illustrate the urban and infrastructural transformations that occurred in [Địa điểm] between [Năm 1] and [Năm 2]."'
            : task1Subtype === 'process'
            ? 'Công thức mở bài Process chuẩn: "The diagram delineates the sequential stages involved in the production of [Sản phẩm] from raw constituents."'
            : 'Công thức mở bài Task 1 chuẩn: "The provided visual data delineates [Đối tượng] in [Địa điểm] across the [Thời gian]."')
        : 'Công thức mở bài 2 câu chuẩn 8.0: Câu 1 - Paraphrase đề bài khách quan. Câu 2 - Khẳng định lập trường dứt khoát ("While some argue that [View A], I firmly adhere to the view that [View B] due to [Lý do]").'
    });
  }

  // 2. Paragraph Analysis (Task 1 Overview vs Detailed Body / Task 2 P.E.E.L)
  if (isTask1) {
    let detailBodyCounter = 1;
    for (let i = 1; i < paragraphs.length; i++) {
      const pText = paragraphs[i];
      const pWords = sanitizeWords(pText).length;
      const isOverviewPara = task1OverviewCheck && task1OverviewCheck.overviewIndex === i;

      if (isOverviewPara) {
        let overviewVerdict = 'Rất tốt: Đoạn Overview đạt chuẩn giám khảo Cambridge — khái quát rõ ràng các xu hướng và đặc điểm nổi bật mà không bị sa đà vào số liệu chi tiết.';
        let overviewRec = 'Quy tắc vàng viết Overview Task 1: 1-2 câu tóm tắt 2 đặc điểm nổi bật nhất. Tuyệt đối không đưa bất kỳ con số cụ thể nào.';
        if (task1Subtype === 'map') {
          overviewVerdict = task1OverviewCheck.hasRawData
            ? `CẢNH BÁO BẪY SỐ LIỆU ĐOẠN TỔNG QUAN: Phát hiện đoạn Overview chứa số liệu chi tiết (${task1OverviewCheck.rawDataList.join(', ')}). Đoạn Overview của bài Map chỉ nên khái quát sự thay đổi diện mạo/quy hoạch tổng thể.`
            : 'Rất tốt: Đoạn Overview đạt chuẩn giám khảo Cambridge cho bài Map — nêu bật xu hướng chuyển đổi không gian và hiện đại hóa tổng thể mà không vướng bẫy liệt kê chi tiết.';
          overviewRec = 'Quy tắc vàng viết Overview dạng Map: Tóm tắt 1-2 sự thay đổi diện mạo lớn nhất (ví dụ: chuyển đổi từ khu nông nghiệp sang đô thị hiện đại, mở rộng giao thông).';
        } else if (task1Subtype === 'process') {
          overviewVerdict = task1OverviewCheck.hasRawData
            ? `CẢNH BÁO BẪY SỐ LIỆU ĐOẠN TỔNG QUAN: Phát hiện đoạn Overview chứa số liệu chi tiết (${task1OverviewCheck.rawDataList.join(', ')}). Đoạn Overview của bài Process chỉ nên nêu tổng số bước và hai điểm đầu - cuối.`
            : 'Rất tốt: Đoạn Overview đạt chuẩn giám khảo Cambridge cho bài Process — tóm tắt rõ ràng tổng số giai đoạn và hai điểm bắt đầu - kết thúc.';
          overviewRec = 'Quy tắc vàng viết Overview dạng Process: Tóm tắt tổng số bước từ khâu nguyên liệu đầu tiên đến sản phẩm hoàn thiện cuối cùng (hoặc tính chất chu kỳ lặp lại).';
        } else if (task1OverviewCheck.hasRawData) {
          overviewVerdict = `CẢNH BÁO BẪY SỐ LIỆU ĐOẠN TỔNG QUAN: Phát hiện đoạn Overview chứa số liệu chi tiết cụ thể (${task1OverviewCheck.rawDataList.join(', ')}). Theo tiêu chuẩn giám khảo Cambridge IELTS Task 1, Overview chỉ được khái quát xu hướng lớn (tăng/giảm, biến động, phân kỳ), TUYỆT ĐỐI KHÔNG đưa số liệu chi tiết. Lỗi này khiến điểm Task Achievement bị khống chế tối đa Band 5.5.`;
        }

        results.push({
          paragraphIndex: i + 1,
          name: `Đoạn ${i + 1}: Tổng Quan (Overview)`,
          wordCount: pWords,
          verdict: overviewVerdict,
          clicheWarning: task1OverviewCheck.hasRawData
            ? `Bẫy số liệu: Các số liệu (${task1OverviewCheck.rawDataList.join(', ')}) cần được chuyển xuống các đoạn Thân bài chi tiết bên dưới.`
            : null,
          recommendation: overviewRec
        });
      } else {
        if (task1Subtype === 'map') {
          const compassMatches = pText.match(/\b(north|south|east|west|north-?west|north-?east|south-?west|south-?east|northern|southern|eastern|western|northward|southward)\b/gi) || [];
          const transformMatches = pText.match(/\b(demolished|knocked\s+down|converted\s+into|transformed\s+into|replaced\s+by|made\s+way\s+for|erected|constructed|built|widened|expanded|relocated|redeveloped|eradicated|dismantled)\b/gi) || [];
          const prepMatches = pText.match(/\b(adjacent\s+to|opposite(?:\s+to)?|across\s+from|parallel\s+to|bordered\s+by|surrounding|in\s+close\s+proximity\s+to|flanked\s+by|situated|located)\b/gi) || [];
          const spatialTotal = compassMatches.length + prepMatches.length;

          results.push({
            paragraphIndex: i + 1,
            name: `Đoạn ${i + 1}: Thân Bài Miêu Tả Bản Đồ ${detailBodyCounter} (Map Body Paragraph ${detailBodyCounter})`,
            wordCount: pWords,
            verdict: pWords < 35
              ? `Đoạn thân bài quá ngắn (${pWords} từ), chưa mô tả đầy đủ các biến đổi không gian.`
              : (transformMatches.length >= 2 && spatialTotal >= 1
                  ? `Đoạn thân bài phát triển rất tốt: Kết hợp chuẩn xác động từ quy hoạch (${transformMatches.slice(0, 2).join(', ')}) và định vị vị trí không gian (${[...compassMatches, ...prepMatches].slice(0, 2).join(', ')}).`
                  : (transformMatches.length === 0
                      ? 'CẢNH BÁO THIẾU ĐỘNG TỪ BIẾN ĐỔI: Đoạn thân bài thiếu các động từ chuyển đổi hạ tầng (như \'demolished\', \'converted into\', \'replaced by\').'
                      : 'CẢNH BÁO THIẾU ĐỊNH VỊ: Đoạn thân bài cần bổ sung thêm phương hướng la bàn (North, South...) hoặc giới từ vị trí (adjacent to, opposite).')),
            anecdoteWarning: null,
            recommendation: 'Áp dụng ngôn ngữ Map Band 7+: [Công trình cũ] was demolished to make way for [Công trình mới], situated to the [Phương hướng] of [Địa điểm lân cận].'
          });
          detailBodyCounter++;
        } else if (task1Subtype === 'process') {
          const seqMatches = pText.match(/\b(initially|firstly|first\s+stage|initial\s+stage|subsequently|following\s+(?:this|that)|after\s+that|then|next|finally|culminates|concludes)\b/gi) || [];
          const passiveMatches = pText.match(/\b(?:is|are|was|were|being|been)\s+(?:crushed|mixed|heated|cooled|filtered|purified|extracted|transported|fed|poured|stored|packaged|distributed|pulverised|pulverized|melted|moulded)\b/gi) || [];

          results.push({
            paragraphIndex: i + 1,
            name: `Đoạn ${i + 1}: Thân Bài Miêu Tả Quy Trình ${detailBodyCounter} (Process Body Paragraph ${detailBodyCounter})`,
            wordCount: pWords,
            verdict: pWords < 35
              ? `Đoạn thân bài quá ngắn (${pWords} từ), chưa miêu tả trọn vẹn các bước của quy trình.`
              : (seqMatches.length >= 1 && passiveMatches.length >= 1
                  ? `Đoạn thân bài đạt chuẩn: Liên kết mạch lạc các bước (${seqMatches.slice(0, 2).join(', ')}) và vận dụng chính xác thể bị động (${passiveMatches.slice(0, 2).join(', ')}).`
                  : (seqMatches.length === 0
                      ? 'CẢNH BÁO THIẾU LIÊN TỪ: Đoạn thân bài thiếu các liên từ chỉ thứ tự các bước (như \'subsequently\', \'following this\', \'after that\').'
                      : 'CẢNH BÁO THIẾU THỂ BỊ ĐỘNG: Cần chuyển các thao tác kỹ thuật sang thể bị động (\'is heated\', \'are transported\') để duy trì tính khách quan học thuật.')),
            anecdoteWarning: null,
            recommendation: 'Áp dụng công thức miêu tả bước chuẩn Band 7+: In the subsequent phase, [nguyên liệu] is [quá trình bị động], prior to being transferred to [bước kế tiếp].'
          });
          detailBodyCounter++;
        } else {
          const pData = extractTask1RawDataPoints(pText);
          const hasComparison = /\b(higher|lower|more|less|fewer|than|as\s+\w+\s+as|compared\s+(?:to|with)|in\s+comparison\s+(?:to|with)|whereas|while|whilst|conversely|in\s+contrast)\b/i.test(pText);

          results.push({
            paragraphIndex: i + 1,
            name: `Đoạn ${i + 1}: Thân Bài Chi Tiết ${detailBodyCounter} (Detailed Body Paragraph ${detailBodyCounter})`,
            wordCount: pWords,
            verdict: pWords < 35
              ? `Đoạn thân bài quá ngắn (${pWords} từ), chưa mô tả đầy đủ các nhóm số liệu của biểu đồ.`
              : (pData.length >= 2
                  ? `Đoạn thân bài chi tiết phát triển tốt, có dẫn chứng số liệu cụ thể (${pData.join(', ')})${hasComparison ? ' và có cấu trúc so sánh đối chiếu.' : '.'}`
                  : `CẢNH BÁO THIẾU DẪN CHỨNG: Đoạn thân bài chi tiết này chỉ có ${pData.length} số liệu. Thân bài Task 1 cần lựa chọn và đưa ra số liệu/mốc thời gian cụ thể để làm dẫn chứng.`),
            anecdoteWarning: null,
            recommendation: hasComparison
              ? 'Duy trì kết hợp nêu số liệu đi kèm cấu trúc so sánh đối chiếu để làm nổi bật sự khác biệt giữa các nhóm đối tượng.'
              : 'Bổ sung các cấu trúc so sánh đối chiếu (ví dụ: "...was twice as high as...", "in contrast to...", "followed by...") để đạt tiêu chí Task Achievement Band 7+.'
          });
          detailBodyCounter++;
        }
      }
    }
  } else {
    // Task 2 Body Paragraphs Analysis (P.E.E.L Model)
    const bodyParas = paragraphs.slice(1, -1);
    bodyParas.forEach((bodyText, idx) => {
      const bodyWords = sanitizeWords(bodyText).length;
      const bodyLower = bodyText.toLowerCase();
      const hasAnecdote = /\b(my friend|my father|my mother|my family|my brother|my sister|when i was|in my country)\b/i.test(bodyLower);
      const hasExplanation = /\b(because|since|as a consequence|this is because|in other words|leads to|results in|owing to|due to)\b/i.test(bodyLower);
      const hasExample = /\b(for example|for instance|such as|to illustrate|a prime example|evidence shows|studies show|empirical data)\b/i.test(bodyLower);

      results.push({
        paragraphIndex: idx + 2,
        name: `Đoạn ${idx + 2}: Thân Bài ${idx + 1} (Body Paragraph ${idx + 1})`,
        wordCount: bodyWords,
        verdict: bodyWords < 40
          ? `Đoạn thân bài quá ngắn (${bodyWords} từ). Luận điểm chỉ mới nêu ra dạng gạch đầu dòng mà chưa có câu giải thích 'Vì sao' hoặc dẫn chứng cụ thể.`
          : (hasExplanation && hasExample
              ? 'Đoạn văn phát triển cân đối và chặt chẽ theo mô hình chuẩn P.E.E.L (Luận điểm - Giải thích cơ chế - Dẫn chứng).'
              : 'Cần củng cố chiều sâu: Hãy bổ sung thêm câu giải thích cơ chế nguyên nhân - hệ quả hoặc số liệu/dẫn chứng cụ thể.'),
        anecdoteWarning: hasAnecdote ? 'CẢNH BÁO BẪY VÍ DỤ CÁ NHÂN: Phát hiện dẫn chứng dựa trên trải nghiệm cá nhân ("my friend / my family / when I was"). Văn phong IELTS Academic đòi hỏi ví dụ mang tính quy luật chung của xã hội, số liệu nghiên cứu hoặc chính sách chính phủ.' : null,
        recommendation: 'Áp dụng công thức P.E.E.L: (1) Point - Câu chủ đề định hướng ý; (2) Explanation - Phân tích cơ chế tác động; (3) Evidence - Dẫn chứng thực tế xã hội; (4) Link - Câu chốt liên kết ngược lại đề bài.'
      });
    });

    // Task 2 Conclusion Analysis
    if (paragraphs.length >= 2) {
      const lastText = paragraphs[paragraphs.length - 1];
      const lastLower = lastText.toLowerCase();
      const hasConcluMarker = /\b(in conclusion|to conclude|to summarize|in summary)\b/i.test(lastLower);
      const concluWords = sanitizeWords(lastText).length;

      results.push({
        paragraphIndex: paragraphs.length,
        name: `Đoạn ${paragraphs.length}: Kết Bài (Conclusion)`,
        wordCount: concluWords,
        verdict: hasConcluMarker
          ? 'Kết bài chuẩn mực: Có từ nối quy ước ("In conclusion"), tóm lược lại quan điểm xuyên suốt.'
          : 'CẢNH BÁO: Kết bài thiếu từ nối quy ước ("In conclusion"). Giám khảo cần thấy rõ tín hiệu kết thúc bài thi.',
        clicheWarning: concluWords < 20 ? `Đoạn kết bài hơi vội vã (${concluWords} từ), chưa tóm lược đầy đủ các góc nhìn đã trình bày ở thân bài.` : null,
        recommendation: 'Kết bài chuẩn 1-2 câu: Tóm lược lại các luận điểm cốt lõi và tái khẳng định lập trường cuối cùng mà tuyệt đối không đưa thêm ý tưởng mới nào.'
      });
    }
  }

  return results;
}

/**
 * Generates an Actionable Prescription Roadmap to boost candidate's band score.
 */
export function generateExaminerActionPlan(trBand, ccBand, lrBand, graBand, svErrorCount, wordCount, targetMinWords, isTask1, task1OverviewCheck = null, task1ComparisonCheck = null, task2Fulfillment = null, topicData = null, wordOveruse = null, bareNounErrorCount = 0, commaSpliceCount = 0, overgeneralisationCount = 0, task1Subtype = 'chart_graph', task1MapCheck = null, task1ProcessCheck = null) {
  const plan = {
    priority1: '',
    priority2: '',
    priority3: '',
    estimatedBandTarget: ''
  };

  // Priority 1: Most Fatal Barrier
  if (wordCount < targetMinWords) {
    plan.priority1 = `Khắc phục dung lượng khẩn cấp: Bài viết hiện thiếu ${targetMinWords - wordCount} từ. Bắt buộc phải viết đủ tối thiểu ${targetMinWords} từ để thoát khỏi khung điểm liệt Task Response.`;
  } else if (isTask1 && task1OverviewCheck?.hasRawData) {
    plan.priority1 = `Khắc phục bẫy số liệu đoạn Overview: Phát hiện ${task1OverviewCheck.rawDataList.length} số liệu chi tiết (${task1OverviewCheck.rawDataList.slice(0, 3).join(', ')}) trong Overview. Đoạn Tổng quan chỉ được khái quát xu hướng lớn (tăng/giảm, biến động), tuyệt đối không đưa số liệu cụ thể để thoát khỏi mức khống chế Band 5.5 Task Achievement.`;
  } else if (isTask1 && task1Subtype === 'map' && task1MapCheck && (task1MapCheck.transformationCount === 0 || task1MapCheck.cardinalCount + task1MapCheck.prepositionCount === 0)) {
    plan.priority1 = 'Bổ sung động từ quy hoạch và phương hướng la bàn (Map): Thân bài bài Map cần tối thiểu 3 động từ chuyển đổi hạ tầng (như: demolished, converted into, replaced by) và từ định vị không gian (như: in the northern quadrant, adjacent to) để mở khóa Band 7.0+ Task Achievement.';
  } else if (isTask1 && task1Subtype === 'process' && task1ProcessCheck && (task1ProcessCheck.totalSequentialCount === 0 || task1ProcessCheck.passiveVoiceCount === 0)) {
    plan.priority1 = 'Làm chủ liên từ chỉ thứ tự và thể bị động (Process): Thân bài bài Process cần tối thiểu 3 liên từ chuyển bước (như: subsequently, following this, prior to) và các động từ ở thể bị động (như: is crushed, are transported) để mở khóa Band 7.0+ Task Achievement.';
  } else if (isTask1 && (!task1Subtype || task1Subtype === 'chart_graph') && task1ComparisonCheck && task1ComparisonCheck.totalComparisons === 0) {
    plan.priority1 = 'Thoát khỏi bẫy liệt kê số liệu cơ học (Mechanical Listing): Thân bài có đưa ra số liệu nhưng thiếu hẳn các cấu trúc so sánh đối chiếu. Hãy sử dụng tối thiểu 3 cấu trúc so sánh tương quan (như: \'twice as high as\', \'whereas\', \'outstripped\', \'compared with\') để mở khóa Band 7.0+ Task Achievement.';
  } else if (!isTask1 && task2Fulfillment && !task2Fulfillment.isBalanced) {
    plan.priority1 = `Khắc phục lỗi bỏ sót yêu cầu đề bài: ${task2Fulfillment.missingPartDescription ? 'Bạn chưa trả lời ' + task2Fulfillment.missingPartDescription + '.' : ''} Dành riêng 1 đoạn thân bài độc lập cho mỗi câu hỏi của đề bài để thoát khỏi mức khống chế Band 5.0 Task Response.`;
  } else if (svErrorCount >= 3) {
    plan.priority1 = `Chấm dứt lỗi chia động từ cơ bản: Phát hiện ${svErrorCount} lỗi hòa hợp Chủ ngữ - Động từ và Danh từ số nhiều. Hãy dành 3 phút cuối giờ rà soát lại thì và đuôi -s/-es của mọi động từ.`;
  } else if (bareNounErrorCount >= 4) {
    plan.priority1 = `Chấm dứt lỗi danh từ trơ trọi & mạo từ: Phát hiện ${bareNounErrorCount} lỗi danh từ đếm được số ít đứng một mình hoặc thiếu mạo từ (a/an/the) (như: 'student should', 'plays important role'). Quy tắc bắt buộc: Danh từ đếm được số ít không bao giờ đứng độc lập. Hãy thêm mạo từ hoặc chuyển sang số nhiều (-s/-es) để mở khóa Band 7.0+ GRA.`;
  } else if (commaSpliceCount >= 4) {
    plan.priority1 = `Chấm dứt lỗi ngắt câu Comma Splice nghiêm trọng: Phát hiện ${commaSpliceCount} câu nối hai mệnh đề độc lập chỉ bằng dấu phẩy. Đây là lỗi hệ thống ranh giới câu khống chế GRA ở Band 5.0. Hãy tách thành 2 câu riêng biệt bằng dấu chấm hoặc dùng liên từ kết hợp (', and / but...') hoặc đại từ quan hệ (', which...').`;
  } else if (overgeneralisationCount >= 4) {
    plan.priority1 = `Chấm dứt lối hành văn quy chụp tuyệt đối: Phát hiện ${overgeneralisationCount} khẳng định cực đoan (như: 'everyone always...', '100%...', 'will definitely destroy...'). Đây là bẫy Overgeneralisation khống chế Task Response ở Band 6.0. Hãy áp dụng ngôn ngữ cẩn trọng Hedging ('is likely to', 'tends to', 'evidence suggests that') để bài thi đạt chuẩn lập luận Band 7.0+.`;
  } else if (trBand < 6.0) {
    plan.priority1 = isTask1
      ? (task1Subtype === 'map'
          ? 'Bắt buộc phải có đoạn Overview nêu bật 1-2 biến đổi không gian lớn nhất (ví dụ: chuyển từ vùng nông nghiệp sang đô thị/dịch vụ thương mại).'
          : task1Subtype === 'process'
          ? 'Bắt buộc phải có đoạn Overview nêu rõ tổng số bước và giai đoạn bắt đầu - kết thúc của quy trình.'
          : 'Bắt buộc phải có đoạn Overview nêu bật 2 đặc điểm lớn nhất của biểu đồ (không đưa số liệu chi tiết vào Overview).')
      : 'Phát triển luận điểm đa chiều: Dành riêng 1 đoạn cho mỗi góc nhìn trong đề bài, trả lời trọn vẹn câu hỏi.';
  } else {
    plan.priority1 = 'Phát triển chiều sâu lập luận: Đào sâu cơ chế "Vì sao dẫn đến kết quả đó" thay vì chỉ liệt kê ý tưởng bề mặt.';
  }

  // Priority 2: Cohesion, Grammar, Hedging & Article/Noun/Splice Control
  if (overgeneralisationCount >= 2) {
    plan.priority2 = `Khắc phục bẫy quy chụp tuyệt đối (Overgeneralisation): Phát hiện ${overgeneralisationCount} khẳng định mang tính phán xét cực đoan. Hãy thay thế bằng ngôn ngữ cẩn trọng (Hedging) như 'is likely to', 'tends to', 'in many instances' để mở khóa Band 7.0+ Task Response.`;
  } else if (commaSpliceCount >= 1) {
    plan.priority2 = `Khắc phục lỗi Comma Splice (nối câu bằng dấu phẩy): Phát hiện ${commaSpliceCount} câu ghép hai mệnh đề độc lập S+V bằng dấu phẩy mà không có liên từ kết hợp. Hãy chuyển mệnh đề phụ thành mệnh đề quan hệ (', which...'), thêm liên từ (', and / but'), hoặc dùng dấu chấm phẩy để đạt chuẩn Band 7.0+ GRA.`;
  } else if (bareNounErrorCount >= 2) {
    plan.priority2 = `Khắc phục triệt để lỗi mạo từ & danh từ trơ trọi: Phát hiện ${bareNounErrorCount} lỗi thiếu mạo từ (a/an/the) hoặc dùng danh từ đếm được số ít đứng một mình. Hãy luôn chuyển sang danh từ số nhiều (-s/-es) hoặc thêm 'a/an/the'.`;
  } else if (ccBand < 6.0) {
    plan.priority2 = 'Cải thiện mạch văn: Chia bài viết thành các đoạn cân đối. Hạn chế nhồi nhét "First, Second, Moreover", hãy luyện tập dùng đại từ thay thế (This trend, Such measures) và liên kết ẩn.';
  } else if (graBand < 6.5) {
    plan.priority2 = 'Bổ sung câu phức nâng cao: Lồng ghép tối thiểu 3 câu có mệnh đề quan hệ (which/who), mệnh đề nhượng bộ (Although/While) hoặc câu điều kiện (If).';
  } else {
    plan.priority2 = 'Tăng cường tính liên kết ẩn (Thematic progression): Kết nối các câu bằng mạch ý liền mạch, tránh để giám khảo cảm thấy câu văn bị ngắt quãng.';
  }

  // Priority 3: Lexical Precision & Dynamic Topic Collocations
  const topicName = topicData?.topicNameVi || 'học thuật';
  const topicCollocations = topicData?.collocations || [];
  const collocationsSample = topicCollocations.slice(0, 2).map(v => `'${v.phrase}'`).join(', ');

  if (wordOveruse?.hasOveruse && wordOveruse.overusedWords.some(w => w.count >= 5)) {
    const topOverused = wordOveruse.overusedWords.filter(w => w.count >= 5).slice(0, 2).map(w => `'${w.word}' (${w.count} lần)`).join(', ');
    plan.priority3 = `Khắc phục lỗi lặp từ nghiêm trọng: Đa dạng hóa các từ đang bị lặp lại quá nhiều (${topOverused}) bằng các từ đồng nghĩa học thuật C1/C2 theo chủ đề '${topicName}'.`;
  } else if (lrBand < 6.0) {
    plan.priority3 = `Nâng cấp từ vựng học thuật: Thay thế các từ giao tiếp cơ bản bằng thuật ngữ C1/C2 theo chủ đề '${topicName}'. Tích lũy các cụm từ đắt giá để nâng điểm Lexical Resource.`;
  } else {
    plan.priority3 = `Tích lũy các cụm Collocations đắt giá theo chủ đề '${topicName}'${collocationsSample ? ` (như: ${collocationsSample})` : ''} để chạm mốc Band 7.5+ LR.`;
  }

  const currentOverall = (trBand + ccBand + lrBand + graBand) / 4.0;
  const currentBand = roundToCambridgeBand(currentOverall);
  const nextTarget = Math.min(9.0, currentBand + 0.5);
  plan.estimatedBandTarget = `Lộ trình mục tiêu: Nâng từ Band ${currentBand.toFixed(1)} lên Band ${nextTarget.toFixed(1)} khi bạn thực hiện triệt để 3 ưu tiên trên.`;

  return plan;
}
