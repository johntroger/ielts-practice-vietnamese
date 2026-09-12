/**
 * listeningTestAssembler.js - Engine for assembling, re-indexing, and randomizing 4-Part Full IELTS Listening Tests (40 questions, ~32 minutes)
 * Compliant with Cambridge Assessment English standards.
 */

export const cleanListeningTitle = (rawTitle) => {
  return (rawTitle || '')
    .replace(/^(✨|🎧|📚|🧩)s*/, '')
    .replace(/^[(AI|Full Test|Cambridge)[^]]*]s*/i, '')
    .replace(/(Part d)/gi, '')
    .trim();
};

/**
 * Extract all available Parts from existing listening tests (Curated Cambridge + AI Generated)
 */
export const extractListeningPartBank = (allListeningTests = []) => {
  const list = [];
  allListeningTests.forEach(t => {
    if (t.parts && Array.isArray(t.parts)) {
      t.parts.forEach(p => {
        const qCount = p.questionGroups?.reduce((acc, g) => acc + (g.questions?.length || 0), 0) || 0;
        const pNum = Number(p.partNumber) || Number(t.targetPart) || 1;
        list.push({
          partKey: `${t.id}-p${pNum}-${p.title || 'part'}`,
          testId: t.id,
          testTitle: t.title,
          testIsCustom: !!t.isCustom,
          audioUrl: p.audioUrl || t.audioUrl,
          fallbackAudioUrl: p.fallbackAudioUrl || t.fallbackAudioUrl,
          part: p,
          partNumber: pNum,
          qCount: qCount || 10
        });
      });
    }
  });
  return list;
};

/**
 * Re-indexes a single listening part to fit into a 4-part 40-question sequence
 */
export const reindexListeningPart = (originalPart, targetPartNum, startOrder) => {
  let curOrder = startOrder;
  const newGroups = (originalPart.questionGroups || []).map((g, gIdx) => {
    const newQuestions = (g.questions || []).map((q) => {
      const updatedQ = {
        ...q,
        order: curOrder,
        id: `p${targetPartNum}-q-${curOrder}`
      };
      curOrder++;
      return updatedQ;
    });

    const firstQ = newQuestions[0]?.order;
    const lastQ = newQuestions[newQuestions.length - 1]?.order;
    const updatedTitle = firstQ && lastQ 
      ? (firstQ === lastQ ? `Question ${firstQ}` : `Questions ${firstQ}–${lastQ}`)
      : g.title;

    let updatedInstruction = g.instruction || '';
    if (firstQ && lastQ && updatedInstruction) {
      updatedInstruction = updatedInstruction.replace(/Questions d+[–-]d+/gi, `Questions ${firstQ}–${lastQ}`);
      updatedInstruction = updatedInstruction.replace(/câu d+[–-]d+/gi, `câu ${firstQ}–${lastQ}`);
    }

    return {
      ...g,
      id: `qg-listening-p${targetPartNum}-${gIdx + 1}`,
      title: updatedTitle,
      instruction: updatedInstruction,
      questions: newQuestions
    };
  });

  return {
    ...originalPart,
    partNumber: targetPartNum,
    id: `p${targetPartNum}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    audioUrl: originalPart.audioUrl,
    questionGroups: newGroups
  };
};

/**
 * Assembles 4 individual parts into a single, cohesive 40-question IELTS Listening Full Test
 */
export const assembleFullListeningTest = ({
  builderP1,
  builderP2,
  builderP3,
  builderP4,
  customTitle = '',
  userEmail = 'Thành viên'
}) => {
  if (!builderP1 || !builderP2 || !builderP3 || !builderP4) return null;

  // Reindex Part 1: starts at 1 (1 to 10)
  const newP1 = reindexListeningPart(builderP1.part, 1, 1);
  const qCount1 = newP1.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  // Reindex Part 2: starts at qCount1 + 1 (11 to 20)
  const newP2 = reindexListeningPart(builderP2.part, 2, qCount1 + 1);
  const qCount2 = newP2.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  // Reindex Part 3: starts at qCount1 + qCount2 + 1 (21 to 30)
  const newP3 = reindexListeningPart(builderP3.part, 3, qCount1 + qCount2 + 1);
  const qCount3 = newP3.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  // Reindex Part 4: starts at qCount1 + qCount2 + qCount3 + 1 (31 to 40)
  const newP4 = reindexListeningPart(builderP4.part, 4, qCount1 + qCount2 + qCount3 + 1);
  const qCount4 = newP4.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  const totalQuestions = qCount1 + qCount2 + qCount3 + qCount4;

  const defaultTitle = `🧩 [Full Test 40 Câu] ${cleanListeningTitle(builderP1.part.title || builderP1.testTitle)} • ${cleanListeningTitle(builderP4.part.title || builderP4.testTitle)}`;
  const finalTitle = customTitle.trim() || defaultTitle;

  return {
    id: `assembled-listening-${Date.now()}`,
    title: finalTitle,
    description: `Đề thi IELTS Listening Full 4 Parts (40 câu) được ghép từ: P1 (${cleanListeningTitle(builderP1.part.title)}), P2 (${cleanListeningTitle(builderP2.part.title)}), P3 (${cleanListeningTitle(builderP3.part.title)}), P4 (${cleanListeningTitle(builderP4.part.title)}). Thời gian chuẩn thi thật ~32 phút.`,
    audioUrl: newP1.audioUrl || builderP1.audioUrl,
    fallbackAudioUrl: newP1.fallbackAudioUrl || builderP1.fallbackAudioUrl,
    totalQuestions,
    timeLimitMinutes: 32,
    isCustom: true,
    isAssembled: true,
    isSinglePart: false,
    creatorEmail: userEmail,
    createdAt: new Date().toISOString(),
    parts: [newP1, newP2, newP3, newP4]
  };
};

/**
 * 1-Click Auto Random Assembler from Part Bank
 */
export const createRandomFullListeningTest = ({ allListeningTests = [], userEmail = 'Thành viên' }) => {
  const bank = extractListeningPartBank(allListeningTests);
  if (bank.length < 4) return null;

  const p1Pool = bank.filter(item => item.partNumber === 1);
  const p2Pool = bank.filter(item => item.partNumber === 2);
  const p3Pool = bank.filter(item => item.partNumber === 3);
  const p4Pool = bank.filter(item => item.partNumber === 4);

  const pickRandom = (pool, fallbackPool) => {
    const src = pool.length > 0 ? pool : fallbackPool;
    if (src.length === 0) return null;
    const idx = Math.floor(Math.random() * src.length);
    return src[idx];
  };

  const chosen1 = pickRandom(p1Pool, bank);
  const chosen2 = pickRandom(p2Pool.filter(i => i.partKey !== chosen1?.partKey), bank);
  const chosen3 = pickRandom(p3Pool.filter(i => i.partKey !== chosen1?.partKey && i.partKey !== chosen2?.partKey), bank);
  const chosen4 = pickRandom(p4Pool.filter(i => i.partKey !== chosen1?.partKey && i.partKey !== chosen2?.partKey && i.partKey !== chosen3?.partKey), bank);

  if (!chosen1 || !chosen2 || !chosen3 || !chosen4) return null;

  return assembleFullListeningTest({
    builderP1: chosen1,
    builderP2: chosen2,
    builderP3: chosen3,
    builderP4: chosen4,
    userEmail
  });
};
