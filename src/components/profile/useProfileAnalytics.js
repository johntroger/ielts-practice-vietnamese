import { useMemo } from 'react';
import { INITIAL_READING_TESTS } from '../../data/readingTasks';
import { INITIAL_LISTENING_TESTS } from '../../data/listeningTasks';
import {
  SPEAKING_PART1_TOPICS,
  SPEAKING_PART2_CUECARDS,
  SPEAKING_PART3_QUESTIONS,
  SPEAKING_MOCK_TEST_PACKS
} from '../../data/speakingTopics';
import { formatTestTitle, formatTestDescription } from '../../utils/testLocalizationHelper';
import { calculateLevelProgress } from '../../services/gamification/levelEngine';
import { safeGet } from '../../utils/storageService';
import { DEFAULT_OWNER_PROFILE } from '../../services/gamification/realLeaderboardService';

/**
 * Custom hook encapsulating all multi-skill statistics, Cambridge band projections,
 * Atlas Titan level progression, and mastered repertoire resolution for UserProfileModal.
 */
export function useProfileAnalytics({
  isOpen,
  isEn,
  user,
  allTasks = [],
  submissions = [],
  readingHistory = [],
  listeningHistory = [],
  speakingHistory = [],
  masteredIds = [],
  resourceFilter = 'all',
  masteredSkillFilter = 'all'
}) {
  // 1. Calculate Writing Learning Stats from Submissions
  const stats = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return {
        totalEssays: 0,
        task1Count: 0,
        task2Count: 0,
        avgBand: 0,
        avgTR: 0,
        avgCC: 0,
        avgLR: 0,
        avgGRA: 0,
        totalWords: 0,
        recentScores: []
      };
    }

    let totalTR = 0;
    let totalCC = 0;
    let totalLR = 0;
    let totalGRA = 0;
    let totalOverall = 0;
    let validBandCount = 0;
    let task1 = 0;
    let task2 = 0;
    let words = 0;
    const recentScores = [];

    submissions.forEach(sub => {
      if (sub.task?.taskNumber === 1) task1++;
      if (sub.task?.taskNumber === 2) task2++;

      if (sub.stats?.wordCount) {
        words += Number(sub.stats.wordCount) || 0;
      }

      if (sub.evaluation) {
        const ev = sub.evaluation;
        const tr = Number(ev.taskAchievement?.score || ev.taskResponse?.score || 0);
        const cc = Number(ev.coherenceCohesion?.score || 0);
        const lr = Number(ev.lexicalResource?.score || 0);
        const gra = Number(ev.grammarAccuracy?.score || 0);
        const overall = Number(ev.overallBand || 0);

        if (overall > 0) {
          totalTR += tr;
          totalCC += cc;
          totalLR += lr;
          totalGRA += gra;
          totalOverall += overall;
          validBandCount++;

          recentScores.push({
            date: sub.date || (isEn ? 'Recent' : 'Gần đây'),
            overall: overall,
            taskTitle: sub.task?.title || (isEn ? 'Essay' : 'Bài luận')
          });
        }
      }
    });

    return {
      totalEssays: submissions.length,
      task1Count: task1,
      task2Count: task2,
      avgBand: validBandCount > 0 ? (totalOverall / validBandCount).toFixed(1) : 0,
      avgTR: validBandCount > 0 ? (totalTR / validBandCount).toFixed(1) : 0,
      avgCC: validBandCount > 0 ? (totalCC / validBandCount).toFixed(1) : 0,
      avgLR: validBandCount > 0 ? (totalLR / validBandCount).toFixed(1) : 0,
      avgGRA: validBandCount > 0 ? (totalGRA / validBandCount).toFixed(1) : 0,
      totalWords: words,
      recentScores: recentScores.slice(0, 5).reverse()
    };
  }, [submissions, isEn]);

  // 2. Filter User's Uploaded / Custom Tasks & Mastered Tasks
  const userCustomTasks = useMemo(() => {
    return (allTasks || []).filter(
      t => t.isOwnTask || t.isCustom || t.isAiGenerated || t.id?.startsWith('task-') || t.id?.startsWith('custom-') || t.id?.startsWith('ai-gen-')
    );
  }, [allTasks]);

  const allReadingBank = useMemo(() => {
    let custom = [];
    try {
      const saved = localStorage.getItem('ielts_reading_custom_tests');
      if (saved) custom = JSON.parse(saved);
    } catch {}
    return [...INITIAL_READING_TESTS, ...(Array.isArray(custom) ? custom : [])];
  }, [isOpen]);

  const allListeningBank = useMemo(() => {
    let custom = [];
    try {
      const saved = localStorage.getItem('ielts_listening_custom_tests');
      if (saved) custom = JSON.parse(saved);
    } catch {}
    return [...INITIAL_LISTENING_TESTS, ...(Array.isArray(custom) ? custom : [])];
  }, [isOpen]);

  const allSpeakingBank = useMemo(() => {
    let customPacks = [];
    try {
      const saved = localStorage.getItem('ielts_speaking_custom_packs');
      if (saved) customPacks = JSON.parse(saved);
    } catch {}
    let customP1 = [];
    try {
      const saved = localStorage.getItem('ielts_speaking_custom_p1_topics') || localStorage.getItem('ielts_speaking_custom_p1');
      if (saved) customP1 = JSON.parse(saved);
    } catch {}
    let customP2 = [];
    try {
      const saved = localStorage.getItem('ielts_speaking_custom_p2_cards') || localStorage.getItem('ielts_speaking_custom_p2');
      if (saved) customP2 = JSON.parse(saved);
    } catch {}
    let customP3 = [];
    try {
      const saved = localStorage.getItem('ielts_speaking_custom_p3_sets') || localStorage.getItem('ielts_speaking_custom_p3');
      if (saved) customP3 = JSON.parse(saved);
    } catch {}

    return {
      packs: [...SPEAKING_MOCK_TEST_PACKS, ...(Array.isArray(customPacks) ? customPacks : [])],
      p1: [...SPEAKING_PART1_TOPICS, ...(Array.isArray(customP1) ? customP1 : [])],
      p2: [...SPEAKING_PART2_CUECARDS, ...(Array.isArray(customP2) ? customP2 : [])],
      p3: [...SPEAKING_PART3_QUESTIONS, ...(Array.isArray(customP3) ? customP3 : [])]
    };
  }, [isOpen]);

  const allMasteredItems = useMemo(() => {
    return masteredIds.map(id => {
      const writingTask = (allTasks || []).find(t => t.id === id);
      if (writingTask) {
        const taskSubs = (submissions || []).filter(s => s.task?.id === id);
        const bestBand = taskSubs.reduce((max, s) => Math.max(max, s.evaluation?.overallBand || 0), 0);
        return {
          id,
          skill: 'writing',
          skillLabel: 'Writing',
          skillBadgeColor: 'bg-red-50 text-red-700 border-red-200',
          typeBadge: `Task ${writingTask.taskNumber || 2}`,
          typeBadgeColor: writingTask.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800',
          category: writingTask.category || 'Academic Writing',
          title: writingTask.title,
          description: writingTask.prompt,
          statText: isEn
            ? `Submitted: ${taskSubs.length} time(s)${bestBand > 0 ? ` • Highest Band: ${bestBand.toFixed(1)}` : ''}`
            : `Đã viết: ${taskSubs.length} lần${bestBand > 0 ? ` • Band cao nhất: ${bestBand.toFixed(1)}` : ''}`,
          rawItem: writingTask
        };
      }

      const readingTest = allReadingBank.find(t => t.id === id);
      if (readingTest) {
        const rHistory = (readingHistory || []).filter(h => h.testId === id);
        const bestBand = rHistory.reduce((max, h) => Math.max(max, Number(h.band) || 0), 0);
        return {
          id,
          skill: 'reading',
          skillLabel: 'Reading',
          skillBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          typeBadge: readingTest.type === 'general' ? 'General Training' : 'Academic Reading',
          typeBadgeColor: 'bg-emerald-100 text-emerald-800',
          category: readingTest.isCustom ? (isEn ? 'Custom Test (AI)' : 'Đề tự tạo (AI)') : 'Cambridge Official',
          title: formatTestTitle(readingTest.title, isEn),
          description: formatTestDescription(readingTest.description, isEn, readingTest) || (readingTest.passages?.map(p => p.title).join(' • ') || ''),
          statText: isEn
            ? `Completed: ${rHistory.length} time(s)${bestBand > 0 ? ` • Highest Band: ${bestBand.toFixed(1)}` : ''}`
            : `Đã làm: ${rHistory.length} lần${bestBand > 0 ? ` • Band cao nhất: ${bestBand.toFixed(1)}` : ''}`,
          rawItem: readingTest
        };
      }

      const listeningTest = allListeningBank.find(t => t.id === id);
      if (listeningTest) {
        const lHistory = (listeningHistory || []).filter(h => h.testId === id);
        const bestBand = lHistory.reduce((max, h) => Math.max(max, Number(h.band) || 0), 0);
        return {
          id,
          skill: 'listening',
          skillLabel: 'Listening',
          skillBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          typeBadge: 'Listening Test',
          typeBadgeColor: 'bg-indigo-100 text-indigo-800',
          category: listeningTest.isCustom ? 'AI Audio' : 'Cambridge Official',
          title: formatTestTitle(listeningTest.title, isEn),
          description: formatTestDescription(listeningTest.description, isEn, listeningTest) || (isEn ? `${listeningTest.parts?.length || 4} audio parts` : `${listeningTest.parts?.length || 4} phần nghe`),
          statText: isEn
            ? `Completed: ${lHistory.length} time(s)${bestBand > 0 ? ` • Highest Band: ${bestBand.toFixed(1)}` : ''}`
            : `Đã làm: ${lHistory.length} lần${bestBand > 0 ? ` • Band cao nhất: ${bestBand.toFixed(1)}` : ''}`,
          rawItem: listeningTest
        };
      }

      const spkPack = allSpeakingBank.packs.find(p => p.id === id);
      if (spkPack) {
        const sHistory = (speakingHistory || []).filter(h => h.mockPackId === id);
        const bestBand = sHistory.reduce((max, h) => Math.max(max, Number(h.overallBand) || 0), 0);
        return {
          id,
          skill: 'speaking',
          skillLabel: 'Speaking Mock',
          skillBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          typeBadge: 'Full Mock Pack',
          typeBadgeColor: 'bg-purple-100 text-purple-800',
          category: spkPack.difficulty || ('Target ' + spkPack.targetBand),
          title: spkPack.title,
          description: spkPack.summary || (isEn ? 'Complete 3 Parts official Cambridge mock pack' : 'Trọn bộ 3 Parts chuẩn khảo thí Cambridge'),
          statText: isEn
            ? `Tested: ${sHistory.length} time(s)${bestBand > 0 ? ` • Highest Band: ${bestBand.toFixed(1)}` : ''}`
            : `Đã thi: ${sHistory.length} lần${bestBand > 0 ? ` • Band cao nhất: ${bestBand.toFixed(1)}` : ''}`,
          rawItem: spkPack
        };
      }

      const p1Topic = allSpeakingBank.p1.find(t => t.id === id);
      if (p1Topic) {
        return {
          id,
          skill: 'speaking',
          skillLabel: 'Speaking P1',
          skillBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          typeBadge: 'Part 1 Topic',
          typeBadgeColor: 'bg-purple-100 text-purple-800',
          category: p1Topic.isCustom ? 'AI Custom' : 'Cambridge',
          title: p1Topic.title,
          description: p1Topic.questions?.[0]?.question ? `"${p1Topic.questions[0].question}"` : (isEn ? 'Part 1 interview questions set' : 'Bộ câu hỏi phỏng vấn Part 1'),
          statText: isEn ? `${p1Topic.questions?.length || 3} questions` : `${p1Topic.questions?.length || 3} câu hỏi`,
          rawItem: p1Topic
        };
      }

      const p2Card = allSpeakingBank.p2.find(c => c.id === id);
      if (p2Card) {
        return {
          id,
          skill: 'speaking',
          skillLabel: 'Speaking P2',
          skillBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          typeBadge: 'Part 2 Cue Card',
          typeBadgeColor: 'bg-purple-100 text-purple-800',
          category: p2Card.category || 'Cue Card',
          title: p2Card.title,
          description: p2Card.cueCard?.intro || (p2Card.cueCard?.bullets?.slice(0, 2).join(' • ') || (isEn ? '2-minute speaking cue card' : 'Cue card 2 phút nói')),
          statText: isEn ? '2-Minute Long Turn' : 'Long Turn 2 Phút',
          rawItem: p2Card
        };
      }

      const p3Set = allSpeakingBank.p3.find(s => (s.linkedPart2Id || s.id) === id);
      if (p3Set) {
        return {
          id,
          skill: 'speaking',
          skillLabel: 'Speaking P3',
          skillBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          typeBadge: 'Part 3 Discussion',
          typeBadgeColor: 'bg-purple-100 text-purple-800',
          category: isEn ? 'In-depth Discussion' : 'Thảo luận chuyên sâu',
          title: p3Set.topic,
          description: p3Set.questions?.[0]?.question ? `"${p3Set.questions[0].question}"` : (isEn ? 'Part 3 follow-up discussion questions' : 'Bộ câu hỏi thảo luận follow-up'),
          statText: isEn ? `${p3Set.questions?.length || 3} PEEL questions` : `${p3Set.questions?.length || 3} câu hỏi PEEL`,
          rawItem: p3Set
        };
      }

      return {
        id,
        skill: 'other',
        skillLabel: isEn ? 'Other' : 'Khác',
        skillBadgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        typeBadge: isEn ? 'Mastered' : 'Đã thuộc',
        typeBadgeColor: 'bg-slate-100 text-slate-700',
        category: isEn ? 'Free Practice' : 'Đề tự do',
        title: id,
        description: isEn ? 'Item in your Mastered repertoire' : 'Mục trong danh sách Đã thuộc của bạn',
        statText: '',
        rawItem: null
      };
    });
  }, [masteredIds, allTasks, submissions, readingHistory, listeningHistory, speakingHistory, allReadingBank, allListeningBank, allSpeakingBank, isEn]);

  const filteredMasteredItems = useMemo(() => {
    if (masteredSkillFilter === 'all') return allMasteredItems;
    return allMasteredItems.filter(i => i.skill === masteredSkillFilter);
  }, [allMasteredItems, masteredSkillFilter]);

  const filteredCustomTasks = useMemo(() => {
    if (resourceFilter === 'public') return userCustomTasks.filter(t => t.isPublic);
    if (resourceFilter === 'private') return userCustomTasks.filter(t => !t.isPublic);
    return userCustomTasks;
  }, [userCustomTasks, resourceFilter]);

  // 3. Calculate Reading Stats
  const readingStats = useMemo(() => {
    if (!readingHistory || readingHistory.length === 0) {
      return { totalTests: 0, avgBand: 0, totalCorrect: 0, avgAccuracy: 0 };
    }
    let totalBand = 0;
    let totalCorrect = 0;
    let totalAcc = 0;
    readingHistory.forEach(r => {
      totalBand += Number(r.band || 0);
      totalCorrect += Number(r.correctCount || 0);
      totalAcc += Number(r.accuracyPercent || 0);
    });
    return {
      totalTests: readingHistory.length,
      avgBand: (totalBand / readingHistory.length).toFixed(1),
      totalCorrect,
      avgAccuracy: Math.round(totalAcc / readingHistory.length)
    };
  }, [readingHistory]);

  // 4. Calculate Listening Stats
  const listeningStats = useMemo(() => {
    if (!listeningHistory || listeningHistory.length === 0) {
      return { totalTests: 0, avgBand: 0, totalCorrect: 0, avgAccuracy: 0 };
    }
    let totalBand = 0;
    let totalCorrect = 0;
    let totalAcc = 0;
    listeningHistory.forEach(l => {
      totalBand += Number(l.band || 0);
      totalCorrect += Number(l.correctCount || 0);
      const acc = l.resultData?.accuracyPercent ?? Math.round(((l.correctCount || 0) / (l.totalQuestions || 40)) * 100);
      totalAcc += Number(acc || 0);
    });
    return {
      totalTests: listeningHistory.length,
      avgBand: (totalBand / listeningHistory.length).toFixed(1),
      totalCorrect,
      avgAccuracy: Math.round(totalAcc / listeningHistory.length)
    };
  }, [listeningHistory]);

  // 5. Calculate Speaking Stats
  const speakingStats = useMemo(() => {
    if (!speakingHistory || speakingHistory.length === 0) {
      return { totalTests: 0, avgBand: 0, avgFC: 0, avgLR: 0, avgGRA: 0, avgPR: 0 };
    }
    let totalBand = 0, totalFC = 0, totalLR = 0, totalGRA = 0, totalPR = 0;
    speakingHistory.forEach(s => {
      const evalData = s.evaluation || {};
      const crit = evalData.criteria || {};
      totalBand += Number(evalData.overallBand || s.band || 6.0);
      totalFC += Number(crit.fc?.band || 6.0);
      totalLR += Number(crit.lr?.band || 6.0);
      totalGRA += Number(crit.gra?.band || 6.0);
      totalPR += Number(crit.pr?.band || 6.0);
    });
    const len = speakingHistory.length;
    return {
      totalTests: len,
      avgBand: (totalBand / len).toFixed(1),
      avgFC: (totalFC / len).toFixed(1),
      avgLR: (totalLR / len).toFixed(1),
      avgGRA: (totalGRA / len).toFixed(1),
      avgPR: (totalPR / len).toFixed(1)
    };
  }, [speakingHistory]);

  // 6. Overall Projected Band across available skills
  const overallProjectedBand = useMemo(() => {
    const validBands = [];
    if (Number(stats.avgBand) > 0) validBands.push(Number(stats.avgBand));
    if (Number(readingStats.avgBand) > 0) validBands.push(Number(readingStats.avgBand));
    if (Number(listeningStats.avgBand) > 0) validBands.push(Number(listeningStats.avgBand));
    if (Number(speakingStats.avgBand) > 0) validBands.push(Number(speakingStats.avgBand));

    if (validBands.length === 0) return 0;
    const rawAvg = validBands.reduce((a, b) => a + b, 0) / validBands.length;
    const intPart = Math.floor(rawAvg);
    const fraction = rawAvg - intPart;
    let rounded = intPart;
    if (fraction < 0.25) rounded = intPart;
    else if (fraction < 0.75) rounded = intPart + 0.5;
    else rounded = intPart + 1.0;
    return rounded.toFixed(1);
  }, [stats.avgBand, readingStats.avgBand, listeningStats.avgBand, speakingStats.avgBand]);

  const getScholarRank = (band) => {
    const num = Number(band);
    if (num >= 8.0) return { title: 'IELTS Scholar', color: 'bg-amber-500 text-slate-950 font-black', badge: 'Band 8.0+ Elite' };
    if (num >= 7.0) return { title: 'Academic Master', color: 'bg-purple-600 text-white font-black', badge: 'Band 7.0 - 7.5' };
    if (num >= 6.0) return { title: 'IELTS Challenger', color: 'bg-blue-600 text-white font-black', badge: 'Band 6.0 - 6.5' };
    if (num >= 5.5) return { title: 'IELTS Foundation Builder', color: 'bg-teal-600 text-white font-black', badge: 'Band 5.5 - 6.0' };
    return { title: 'IELTS Trainee', color: 'bg-slate-700 text-slate-200 font-bold', badge: isEn ? 'Journey Starter' : 'Khởi đầu lộ trình' };
  };

  const rank = getScholarRank(overallProjectedBand || stats.avgBand);
  const isOwnerUser = user?.email === 'tranthanhtung37@gmail.com' || user?.user_metadata?.name === 'tranthanhtung37';

  const userLevelData = useMemo(() => {
    let xp = 0;
    if (user?.id) {
      const local = safeGet(`ielts_leaderboard_local_${user.id}`, {});
      if (isOwnerUser && (!local.version_v2 && (local.total_xp === 9400 || local.weekly_xp === 2850))) {
        xp = 0;
      } else {
        xp = Number(local.total_xp || local.weekly_xp || (isOwnerUser ? DEFAULT_OWNER_PROFILE.total_xp : 0));
      }
    } else if (isOwnerUser) {
      xp = Number(DEFAULT_OWNER_PROFILE.total_xp || 0);
    } else {
      const guest = safeGet('ielts_guest_arena_score_v1', {});
      xp = Number(guest.total_xp || guest.weekly_xp || 0);
    }
    const prog = calculateLevelProgress(xp);
    return {
      ...prog,
      totalXp: xp
    };
  }, [user, isOwnerUser]);

  return {
    stats,
    readingStats,
    listeningStats,
    speakingStats,
    overallProjectedBand,
    rank,
    isOwnerUser,
    userLevelData,
    userCustomTasks,
    filteredCustomTasks,
    allMasteredItems,
    filteredMasteredItems
  };
}
