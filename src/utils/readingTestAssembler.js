/**
 * Shared utility for assembling, re-indexing, and randomizing 3-Passage Full Reading Tests (40 questions, 60 minutes)
 */

export const cleanTitle = (rawTitle) => {
  return (rawTitle || '')
    .replace(/^(✨|📰|📚)\s*/, '')
    .replace(/^\[(AI|Báo chí|Full Test)[^\]]*\]\s*/i, '')
    .replace(/^#\d+\s*:\s*/, '')
    .trim();
};

export const extractPassageBank = (allReadingTests = []) => {
  const list = [];
  allReadingTests.forEach(t => {
    if (t.passages && Array.isArray(t.passages)) {
      t.passages.forEach(p => {
        const qCount = p.questionGroups?.reduce((acc, g) => acc + (g.questions?.length || 0), 0) || 0;
        list.push({
          passageKey: `${t.id}-${p.id || p.passageNumber}-${p.title}`,
          testId: t.id,
          testTitle: t.title,
          testIsCustom: t.isCustom,
          passage: p,
          originalPassageNum: p.passageNumber || 1,
          qCount
        });
      });
    }
  });
  return list;
};

export const reindexPassage = (originalPassage, targetPassageNum, startOrder) => {
  let curOrder = startOrder;
  const newGroups = (originalPassage.questionGroups || []).map((g, gIdx) => {
    const newQuestions = (g.questions || []).map((q) => {
      const updatedQ = {
        ...q,
        order: curOrder,
        id: `p${targetPassageNum}-q-${curOrder}`
      };
      curOrder++;
      return updatedQ;
    });

    // Update group title Questions X–Y
    const firstQ = newQuestions[0]?.order;
    const lastQ = newQuestions[newQuestions.length - 1]?.order;
    const updatedTitle = firstQ && lastQ 
      ? (firstQ === lastQ ? `Question ${firstQ}` : `Questions ${firstQ}–${lastQ}`)
      : g.title;

    // Update instruction if it mentions boxes/questions range
    let updatedInstruction = g.instruction || '';
    if (firstQ && lastQ && updatedInstruction) {
      updatedInstruction = updatedInstruction.replace(/boxes \d+[–-]\d+/gi, `boxes ${firstQ}–${lastQ}`);
      updatedInstruction = updatedInstruction.replace(/Questions \d+[–-]\d+/gi, `Questions ${firstQ}–${lastQ}`);
    }

    return {
      ...g,
      id: `qg-${targetPassageNum}-${gIdx + 1}`,
      title: updatedTitle,
      instruction: updatedInstruction,
      questions: newQuestions
    };
  });

  return {
    ...originalPassage,
    passageNumber: targetPassageNum,
    id: `p${targetPassageNum}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    questionGroups: newGroups
  };
};

export const generateFullTestTitle = (p1Item, p2Item, p3Item, fullTestCount = 1) => {
  const seq = String(fullTestCount).padStart(2, '0');
  const t1 = cleanTitle(p1Item?.passage?.title) || 'Passage 1';
  const t2 = cleanTitle(p2Item?.passage?.title) || 'Passage 2';
  const t3 = cleanTitle(p3Item?.passage?.title) || 'Passage 3';
  return `📚 [Full Test #${seq}] ${t1} • ${t2} • ${t3}`;
};

export const assembleFullTest = ({ builderP1, builderP2, builderP3, customTitle, userEmail, fullTestCount = 1 }) => {
  if (!builderP1 || !builderP2 || !builderP3) return null;

  // Reindex passage 1 (Starts at 1)
  const newP1 = reindexPassage(builderP1.passage, 1, 1);
  const qCount1 = newP1.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  // Reindex passage 2 (Starts at qCount1 + 1)
  const newP2 = reindexPassage(builderP2.passage, 2, qCount1 + 1);
  const qCount2 = newP2.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  // Reindex passage 3 (Starts at qCount1 + qCount2 + 1)
  const newP3 = reindexPassage(builderP3.passage, 3, qCount1 + qCount2 + 1);
  const qCount3 = newP3.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

  const totalQ = qCount1 + qCount2 + qCount3;
  const finalTitle = customTitle?.trim() || generateFullTestTitle(builderP1, builderP2, builderP3, fullTestCount);

  return {
    id: `custom-test-full-${Date.now()}`,
    title: finalTitle,
    description: `Bộ đề thi thử 3 Passages tự lắp ghép từ ngân hàng đề (${cleanTitle(builderP1.passage.title)} + ${cleanTitle(builderP2.passage.title)} + ${cleanTitle(builderP3.passage.title)}). Chuẩn thi thật 60 phút.`,
    totalQuestions: totalQ,
    timeLimitMinutes: 60,
    isCustom: true,
    isPublic: false,
    creatorEmail: userEmail || 'Thành viên',
    passages: [newP1, newP2, newP3]
  };
};

export const createRandomFullTest = ({ allReadingTests = [], userEmail = 'Thành viên' }) => {
  const passageBank = extractPassageBank(allReadingTests);
  if (passageBank.length < 3) return null;

  const p1Pool = passageBank.filter(item => item.originalPassageNum === 1);
  const p2Pool = passageBank.filter(item => item.originalPassageNum === 2);
  const p3Pool = passageBank.filter(item => item.originalPassageNum === 3);

  const pickRandom = (pool, fallbackPool) => {
    const source = pool.length > 0 ? pool : fallbackPool;
    if (source.length === 0) return null;
    const idx = Math.floor(Math.random() * source.length);
    return source[idx];
  };

  const chosen1 = pickRandom(p1Pool, passageBank);
  const remFor2 = passageBank.filter(item => item.passageKey !== chosen1?.passageKey);
  const chosen2 = pickRandom(p2Pool.filter(item => item.passageKey !== chosen1?.passageKey), remFor2);
  const remFor3 = passageBank.filter(item => item.passageKey !== chosen1?.passageKey && item.passageKey !== chosen2?.passageKey);
  const chosen3 = pickRandom(p3Pool.filter(item => item.passageKey !== chosen1?.passageKey && item.passageKey !== chosen2?.passageKey), remFor3);

  if (!chosen1 || !chosen2 || !chosen3) return null;

  const fullTestCount = allReadingTests.filter(t => (t.passages?.length || 1) > 1).length + 1;
  return assembleFullTest({
    builderP1: chosen1,
    builderP2: chosen2,
    builderP3: chosen3,
    userEmail,
    fullTestCount
  });
};
