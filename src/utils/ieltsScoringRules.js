/**
 * IELTS Scoring Rules & Cambridge Hard Band Capping Engine
 * Strictly enforces Cambridge IELTS official Band Descriptors across both Algorithmic & AI evaluations.
 */

import {
  analyzeTask1Overview,
  analyzeTask2Fulfillment,
  sanitizeWords,
  getParagraphs,
  roundToCambridgeBand
} from '../services/algorithmicEvaluationService.js';

/**
 * Applies Cambridge official band ceiling rules to prevent score inflation and enforce pedagogical integrity.
 *
 * Rules:
 * 1. Task 1: Missing clear Overview -> Hard cap Task Achievement (TR) <= Band 5.0.
 * 2. Task 1: Overview containing specific raw data points -> Hard cap Task Achievement <= Band 5.5.
 * 3. Underlength Penalty:
 *    - Task 1 (<100 words -> max 4.0; <130 words -> max 4.5; <150 words -> max 5.0)
 *    - Task 2 (<120 words -> max 3.0; <160 words -> max 4.0; <200 words -> max 5.0; <240 words -> max 5.5)
 * 4. Task 2: Multi-part prompt with omitted part -> Hard cap Task Response <= Band 5.0.
 *
 * @param {Object} params
 * @param {Object} params.task - The task metadata
 * @param {string} params.essayText - The candidate's essay text
 * @param {Object} params.evaluation - The evaluation result to calibrate
 * @returns {Object} Calibrated evaluation with applied hard caps
 */
export function applyCambridgeWritingHardCaps({ task, essayText, evaluation }) {
  if (!evaluation || !evaluation.criteria) return evaluation;

  const cloned = JSON.parse(JSON.stringify(evaluation));
  const isTask1 = task?.taskNumber === 1 || Boolean(task?.isTask1);
  const words = sanitizeWords(essayText || '');
  const wordCount = words.length;
  const paragraphs = getParagraphs(essayText || '');

  const appliedHardCaps = [];

  // 1. Task 1 Hard Band Caps (Overview Requirement)
  if (isTask1) {
    const overviewAnalysis = analyzeTask1Overview(paragraphs);

    if (!overviewAnalysis.hasOverview) {
      const originalTr = cloned.criteria.tr?.band || 5.0;
      if (originalTr > 5.0) {
        cloned.criteria.tr.band = 5.0;
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_1_MISSING_OVERVIEW',
          originalScore: originalTr,
          cappedScore: 5.0,
          reason: 'Theo Cambridge Band Descriptors, bài viết không có Overview rõ ràng bị chặn trần Band 5 TA.'
        });

        const warningMsg = 'Theo Barem khảo thí chính thức của Cambridge IELTS Band Descriptors, bài viết Task 1 hoàn toàn thiếu Overview rõ ràng bị chặn trần Band 5 TA (Presents, but inadequately covers, key features; there may be no overview granted).';
        if (Array.isArray(cloned.criteria.tr.improvements)) {
          cloned.criteria.tr.improvements.unshift(warningMsg);
        }
        if (cloned.criteria.tr.feedback) {
          cloned.criteria.tr.feedback = `[CHẶN TRẦN CAMBRIDGE - BAND 5.0 TA]: ${warningMsg}\n\n${cloned.criteria.tr.feedback}`;
        }
      }
    } else if (overviewAnalysis.hasOverview && overviewAnalysis.hasRawData) {
      const originalTr = cloned.criteria.tr?.band || 5.5;
      if (originalTr > 5.5) {
        cloned.criteria.tr.band = 5.5;
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_1_OVERVIEW_RAW_DATA',
          originalScore: originalTr,
          cappedScore: 5.5,
          reason: 'Đoạn Overview chứa số liệu cụ thể. Theo tiêu chuẩn khảo thí Cambridge Task 1, Overview chỉ được nêu xu hướng chung, việc đưa số liệu chi tiết bị khống chế tối đa Band 5.5.'
        });

        const warningMsg = `CẢNH BÁO SỐ LIỆU ĐOẠN OVERVIEW: Đoạn Overview chứa số liệu chi tiết (${overviewAnalysis.rawDataList.slice(0, 3).join(', ')}). Barem Cambridge quy định Overview chỉ được khái quát xu hướng, đưa số liệu khiến TA bị khống chế tối đa Band 5.5.`;
        if (Array.isArray(cloned.criteria.tr.improvements)) {
          cloned.criteria.tr.improvements.unshift(warningMsg);
        }
      }
    }
  }

  // 2. Word Count Underlength Penalties
  if (isTask1) {
    if (wordCount < 100) {
      if (cloned.criteria.tr?.band > 4.0) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_1_SEVERE_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 4.0,
          reason: `Bài viết Task 1 chỉ có ${wordCount}/150 từ (dưới 100 từ). Điểm TA bị khống chế tối đa Band 4.0.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 4.0);
      }
    } else if (wordCount < 130) {
      if (cloned.criteria.tr?.band > 4.5) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_1_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 4.5,
          reason: `Bài viết Task 1 chỉ có ${wordCount}/150 từ. Điểm TA bị khống chế tối đa Band 4.5.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 4.5);
      }
    } else if (wordCount < 150) {
      if (cloned.criteria.tr?.band > 5.0) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_1_SLIGHT_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 5.0,
          reason: `Bài viết Task 1 chỉ có ${wordCount}/150 từ (chưa đạt mốc tối thiểu 150 từ). Điểm TA bị khống chế tối đa Band 5.0.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 5.0);
      }
    }
  } else {
    // Task 2
    if (wordCount < 120) {
      if (cloned.criteria.tr?.band > 3.0) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_2_CRITICAL_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 3.0,
          reason: `Bài viết Task 2 chỉ có ${wordCount}/250 từ. Điểm TR bị khống chế tối đa Band 3.0.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 3.0);
      }
    } else if (wordCount < 160) {
      if (cloned.criteria.tr?.band > 4.0) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_2_SEVERE_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 4.0,
          reason: `Bài viết Task 2 chỉ có ${wordCount}/250 từ. Điểm TR bị khống chế tối đa Band 4.0.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 4.0);
      }
    } else if (wordCount < 200) {
      if (cloned.criteria.tr?.band > 5.0) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_2_SUBSTANTIAL_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 5.0,
          reason: `Bài viết Task 2 chỉ có ${wordCount}/250 từ. Điểm TR bị khống chế tối đa Band 5.0.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 5.0);
      }
    } else if (wordCount < 240) {
      if (cloned.criteria.tr?.band > 5.5) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_2_UNDERLENGTH',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 5.5,
          reason: `Bài viết Task 2 chỉ có ${wordCount}/250 từ. Điểm TR bị khống chế tối đa Band 5.5.`
        });
        cloned.criteria.tr.band = Math.min(cloned.criteria.tr.band, 5.5);
      }
    }

    // 3. Task 2 Question Fulfillment
    const fulfillment = analyzeTask2Fulfillment(task?.prompt, paragraphs);
    if (fulfillment && !fulfillment.isBalanced) {
      if (cloned.criteria.tr?.band > 5.0) {
        appliedHardCaps.push({
          criterion: 'tr',
          rule: 'TASK_2_UNFULFILLED_PART',
          originalScore: cloned.criteria.tr.band,
          cappedScore: 5.0,
          reason: fulfillment.warning || 'Bài viết bỏ sót một vế câu hỏi của đề bài.'
        });
        cloned.criteria.tr.band = 5.0;
        if (Array.isArray(cloned.criteria.tr.improvements)) {
          cloned.criteria.tr.improvements.unshift(fulfillment.warning);
        }
      }
    }
  }

  // 4. Recalculate Overall Band if any caps were applied
  const tr = cloned.criteria.tr?.band || 5.0;
  const cc = cloned.criteria.cc?.band || 5.0;
  const lr = cloned.criteria.lr?.band || 5.0;
  const gra = cloned.criteria.gra?.band || 5.0;

  const rawOverall = (tr + cc + lr + gra) / 4.0;
  cloned.overallBand = roundToCambridgeBand(rawOverall);
  cloned.appliedHardCaps = appliedHardCaps;

  return cloned;
}
