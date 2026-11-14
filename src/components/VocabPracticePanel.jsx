import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Volume2, Check, X, PenLine, ListChecks, Headphones, RotateCw,
  Shuffle as ShuffleIcon, ArrowLeftRight, Link2, Lightbulb, Flame, Timer
} from 'lucide-react';
import {
  buildSession, buildMatchBoard, filterPool, firstLetterHint, normalizeAnswer,
  loadPracticeStats, recordPracticeRound
} from '../utils/vocabPractice';
import { calculateNextReview, SRS_GRADES } from '../utils/srsService';
import { computeDictationDiff } from '../utils/dictationDiff';
import { speakText, stopSpeech } from '../utils/speechAudio';
import { playArenaSfx } from '../utils/audioHelper';
import { getLocalizedVocabMeaning } from '../utils/vocabLocalization';
import { IELTS_TOPICS } from '../data/topics';

const MATCH_BOARD_SIZE = 6;

const MODES = [
  { id: 'cloze', icon: PenLine, minPool: 1, minVault: 1,
    titleEn: 'Fill in the blank', titleVi: 'Điền từ vào chỗ trống',
    descEn: 'Type the missing word from your saved example sentence.',
    descVi: 'Gõ từ còn thiếu trong câu ví dụ bạn đã lưu.' },
  { id: 'choice', icon: ListChecks, minPool: 1, minVault: 2,
    titleEn: 'Meaning → Word', titleVi: 'Nghĩa → Từ',
    descEn: 'Pick the correct word for the meaning shown.',
    descVi: 'Chọn từ đúng với nghĩa được hiển thị.' },
  { id: 'reverse', icon: ArrowLeftRight, minPool: 1, minVault: 2,
    titleEn: 'Word → Meaning', titleVi: 'Từ → Nghĩa',
    descEn: 'See the word, choose the right meaning.',
    descVi: 'Nhìn từ tiếng Anh, chọn nghĩa đúng.' },
  { id: 'scramble', icon: ShuffleIcon, minPool: 1, minVault: 1,
    titleEn: 'Unscramble', titleVi: 'Sắp xếp lại',
    descEn: 'Rebuild the word or phrase from scrambled pieces.',
    descVi: 'Ghép lại từ hoặc cụm từ từ các mảnh bị xáo trộn.' },
  { id: 'dictation', icon: Headphones, minPool: 1, minVault: 1,
    titleEn: 'Listen & type', titleVi: 'Nghe và gõ lại',
    descEn: 'Listen to the word and spell it correctly.',
    descVi: 'Nghe phát âm và gõ lại từ đúng chính tả.' },
  { id: 'match', icon: Link2, minPool: 3, minVault: 3,
    titleEn: 'Match pairs', titleVi: 'Nối cặp',
    descEn: `Race the clock: match ${MATCH_BOARD_SIZE} words to their meanings.`,
    descVi: `Đua với thời gian: nối ${MATCH_BOARD_SIZE} từ với nghĩa tương ứng.` }
];

const SCOPES = [
  { id: 'all', en: 'All words', vi: 'Tất cả từ' },
  { id: 'due', en: 'Due today', vi: 'Đến hạn ôn hôm nay' },
  { id: 'weak', en: 'Weak words', vi: 'Từ hay quên' },
  { id: 'new', en: 'New words', vi: 'Từ mới' }
];

const LENGTHS = [10, 20, 30, 50];
const ALL_CAP = 100; // 'All' is capped so a huge vault stays playable
const ALL_VALUE = 0;

export default function VocabPracticePanel({ vocabList, isEn, onUpdateVocab }) {
  // setup
  const [scope, setScope] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [length, setLength] = useState(10);
  const [stats, setStats] = useState(loadPracticeStats);

  // session
  const [mode, setMode] = useState(null);
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [hinted, setHinted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [missed, setMissed] = useState([]);
  const [finished, setFinished] = useState(false);

  // match mode
  const [board, setBoard] = useState(null);
  const [selLeft, setSelLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null); // { l, r }
  const [matchMistakes, setMatchMistakes] = useState([]);
  const [seconds, setSeconds] = useState(0);

  const inputRef = useRef(null);
  const question = session[index];

  const pool = useMemo(
    () => filterPool(vocabList, { scope, topic: topicFilter }),
    [vocabList, scope, topicFilter]
  );

  const topicOptions = useMemo(() => {
    const ids = [...new Set(vocabList.map(v => v.topic).filter(Boolean))];
    return ids.map(id => {
      const t = IELTS_TOPICS.find(x => x.id === id);
      return { id, label: t ? (isEn ? t.name : (t.vi || t.name)) : id };
    });
  }, [vocabList, isEn]);

  useEffect(() => {
    if (mode && mode !== 'match' && question && !result) {
      if (mode === 'dictation') speakText(question.answer, { rate: 0.85 });
      inputRef.current?.focus();
    }
  }, [mode, index, result, question]);

  useEffect(() => () => stopSpeech(), []);

  // Match timer
  useEffect(() => {
    if (mode !== 'match' || finished || !board) return undefined;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [mode, finished, board]);

  const resetRunState = () => {
    setIndex(0); setInput(''); setResult(null); setHinted(false);
    setScore(0); setCombo(0); setBestCombo(0); setMissed([]); setFinished(false);
    setBoard(null); setSelLeft(null); setMatched([]); setFlash(null);
    setMatchMistakes([]); setSeconds(0);
  };

  const start = (m, poolOverride) => {
    const usePool = poolOverride || pool;
    resetRunState();
    setMode(m);
    if (m === 'match') {
      setBoard(buildMatchBoard(usePool, { size: MATCH_BOARD_SIZE, isEn }));
      setSession([]);
      return;
    }
    const size = poolOverride ? poolOverride.length : (length === ALL_VALUE ? ALL_CAP : length);
    const built = buildSession(usePool, m, { size, isEn, distractorSource: vocabList });
    if (built.length === 0) {
      setMode(null); // not enough distinct data for this mode
      return;
    }
    setSession(built);
  };

  const exit = () => {
    stopSpeech();
    resetRunState();
    setMode(null);
    setSession([]);
  };

  const finishRound = (answered, correct, best) => {
    setStats(recordPracticeRound({ answered, correct, bestCombo: best }));
    setFinished(true);
    playArenaSfx('victory');
  };

  const applySrs = (item, grade) => {
    if (onUpdateVocab) onUpdateVocab(calculateNextReview(item, grade));
  };

  // ---------- Typing / choice answers ----------
  const submit = (value) => {
    if (!question || result) return;
    const answer = value ?? input;
    let correct;
    let diff = null;
    if (question.mode === 'dictation') {
      diff = computeDictationDiff(question.answer, answer);
      correct = diff.isExactMatch;
    } else {
      correct = normalizeAnswer(answer) === normalizeAnswer(question.answer);
    }
    if (correct) {
      const nextCombo = combo + 1;
      setScore(s => s + 1);
      setCombo(nextCombo);
      setBestCombo(b => Math.max(b, nextCombo));
      playArenaSfx('correct', nextCombo);
    } else {
      setCombo(0);
      setMissed(m => [...m, question.item]);
      playArenaSfx('wrong');
    }
    setResult({ correct, diff, given: answer });
    applySrs(question.item, correct ? (hinted ? SRS_GRADES.HARD : SRS_GRADES.GOOD) : SRS_GRADES.AGAIN);
  };

  const next = () => {
    if (index >= session.length - 1) {
      finishRound(session.length, score, bestCombo);
      return;
    }
    setIndex(i => i + 1);
    setInput('');
    setResult(null);
    setHinted(false);
  };

  // ---------- Match answers ----------
  const pickLeft = (idx) => {
    if (matched.includes(idx) || flash) return;
    playArenaSfx('tap');
    setSelLeft(idx);
    const item = board.pairs[idx].item;
    speakText(item.phrase, { rate: 0.95 });
  };

  const pickRight = (idx) => {
    if (selLeft === null || matched.includes(idx) || flash) return;
    if (idx === selLeft) {
      const nextMatched = [...matched, idx];
      setMatched(nextMatched);
      setSelLeft(null);
      playArenaSfx('correct', nextMatched.length);
      if (nextMatched.length === board.pairs.length) {
        const mistakeSet = new Set(matchMistakes);
        const miss = board.pairs.filter((_, i) => mistakeSet.has(i)).map(p => p.item);
        board.pairs.forEach((p, i) => applySrs(p.item, mistakeSet.has(i) ? SRS_GRADES.AGAIN : SRS_GRADES.GOOD));
        setMissed(miss);
        setScore(board.pairs.length - miss.length);
        finishRound(board.pairs.length, board.pairs.length - miss.length, 0);
      }
    } else {
      playArenaSfx('wrong');
      setFlash({ l: selLeft, r: idx });
      setMatchMistakes(m => (m.includes(selLeft) ? m : [...m, selLeft]));
      setTimeout(() => { setFlash(null); setSelLeft(null); }, 600);
    }
  };

  const uniqueCount = (list) =>
    new Set(list.map(v => normalizeAnswer(getLocalizedVocabMeaning(v, isEn))).filter(Boolean)).size;
  const poolMeanings = useMemo(() => uniqueCount(pool), [pool, isEn]); // eslint-disable-line react-hooks/exhaustive-deps
  const vaultMeanings = useMemo(() => uniqueCount(vocabList), [vocabList, isEn]); // eslint-disable-line react-hooks/exhaustive-deps
  const vaultPhrases = useMemo(
    () => new Set(vocabList.map(v => normalizeAnswer(v.phrase)).filter(Boolean)).size,
    [vocabList]
  );

  const modeEligibility = MODES.map(m => {
    let ok = pool.length >= m.minPool && vocabList.length >= m.minVault;
    if (m.id === 'choice') ok = ok && vaultPhrases >= 2;
    if (m.id === 'reverse') ok = ok && vaultMeanings >= 2;
    if (m.id === 'match') ok = ok && poolMeanings >= 3;
    return { ...m, ok };
  });

  // Round-length choices adapt to the user's pool size
  const lengthOptions = LENGTHS.filter(n => n < pool.length);
  const effectiveLength = length === ALL_VALUE || length >= pool.length ? Math.min(pool.length, ALL_CAP) : length;
  const scopeEmptyHint = {
    due: isEn ? 'No words are due right now. Try "All words".' : 'Hiện chưa có từ nào đến hạn ôn. Hãy thử "Tất cả từ".',
    weak: isEn ? 'No weak words yet — they appear after you review and miss some.' : 'Chưa có từ hay quên — chúng xuất hiện sau khi bạn ôn và trả lời sai một số từ.',
    new: isEn ? 'No new words left. Try "All words".' : 'Không còn từ mới. Hãy thử "Tất cả từ".',
    all: ''
  }[scope];

  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  // ================= SETUP =================
  if (!mode) {
    return (
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isEn ? 'Active Recall Practice' : 'Luyện Tập Chủ Động'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                {isEn
                  ? 'Correct answers lengthen your review interval; wrong ones bring the word back sooner.'
                  : 'Trả lời đúng sẽ kéo dài chu kỳ ôn, trả lời sai từ sẽ quay lại sớm hơn.'}
              </p>
            </div>
            {stats.rounds > 0 && (
              <div className="text-[11px] text-slate-500 font-semibold bg-slate-100 rounded-xl px-3 py-2 space-y-0.5">
                <div>{isEn ? `Rounds: ${stats.rounds}` : `Số lượt: ${stats.rounds}`}</div>
                <div>{isEn ? `Accuracy: ${accuracy}%` : `Độ chính xác: ${accuracy}%`}</div>
                <div>{isEn ? `Best combo: ${stats.bestCombo}` : `Combo cao nhất: ${stats.bestCombo}`}</div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="text-[11px] font-bold text-slate-500 space-y-1">
              <span>{isEn ? 'Word set' : 'Nhóm từ'}</span>
              <select value={scope} onChange={e => setScope(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium cursor-pointer">
                {SCOPES.map(s => <option key={s.id} value={s.id}>{isEn ? s.en : s.vi}</option>)}
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500 space-y-1">
              <span>{isEn ? 'Topic' : 'Chủ đề'}</span>
              <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium cursor-pointer">
                <option value="all">{isEn ? 'All topics' : 'Tất cả chủ đề'}</option>
                {topicOptions.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500 space-y-1">
              <span>{isEn ? 'Words per round' : 'Số từ mỗi lượt'}</span>
              <select value={length} onChange={e => setLength(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium cursor-pointer">
                {lengthOptions.map(n => <option key={n} value={n}>{n}</option>)}
                <option value={ALL_VALUE}>
                  {isEn
                    ? `All (${Math.min(pool.length, ALL_CAP)})`
                    : `Tất cả (${Math.min(pool.length, ALL_CAP)})`}
                </option>
              </select>
            </label>
          </div>
          <div className="text-xs text-slate-500">
            {pool.length === 0
              ? (scopeEmptyHint || (isEn ? 'No words match your selection.' : 'Không có từ nào phù hợp với lựa chọn.'))
              : (isEn
                ? `${pool.length} word(s) match · this round: ${effectiveLength}`
                : `${pool.length} từ phù hợp · lượt này: ${effectiveLength} từ`)}
          </div>

          {vocabList.length === 0 && (
            <div className="text-xs text-slate-400 py-4 text-center">
              {isEn ? 'Add some words to your vault first.' : 'Hãy thêm vài từ vào sổ tay trước.'}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modeEligibility.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => start(m.id)}
                  disabled={!m.ok}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-white text-left hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0"><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{isEn ? m.titleEn : m.titleVi}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{isEn ? m.descEn : m.descVi}</div>
                    {!m.ok && vocabList.length > 0 && (
                      <div className="text-[11px] text-amber-600 mt-1">
                        {isEn
                          ? `Needs at least ${Math.max(m.minPool, 1)} matching word(s) and ${m.minVault} in the vault`
                          : `Cần ít nhất ${Math.max(m.minPool, 1)} từ phù hợp và ${m.minVault} từ trong sổ`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ================= SUMMARY =================
  if (finished) {
    const total = mode === 'match' ? board.pairs.length : session.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-4xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
          <h3 className="text-lg font-bold text-slate-800">{score} / {total} ({pct}%)</h3>
          <div className="flex justify-center gap-4 text-xs text-slate-500 font-semibold">
            {mode === 'match'
              ? <span className="inline-flex items-center gap-1"><Timer className="w-3.5 h-3.5" />{mm}:{ss}</span>
              : <span className="inline-flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{isEn ? `Best combo ${bestCombo}` : `Combo cao nhất ${bestCombo}`}</span>}
          </div>

          {missed.length > 0 && (
            <div className="text-left grid gap-2 lg:grid-cols-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider lg:col-span-2">
                {isEn ? 'Words to review' : 'Từ cần ôn lại'}
              </div>
              {missed.map((it, i) => (
                <div key={`${it.id || it.phrase}-${i}`} className="flex items-start justify-between gap-2 p-3 rounded-xl border border-red-100 bg-red-50/50">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800">{it.phrase}</div>
                    <div className="text-xs text-slate-600">{getLocalizedVocabMeaning(it, isEn)}</div>
                    {it.example && <div className="text-[11px] italic text-slate-500 mt-0.5">"{it.example}"</div>}
                  </div>
                  <button onClick={() => speakText(it.phrase)} className="p-1.5 text-slate-400 hover:text-amber-600 cursor-pointer shrink-0"
                    aria-label={isEn ? 'Listen' : 'Nghe phát âm'}>
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {missed.length > 0 && mode !== 'match' && (
              <button onClick={() => start(mode, missed)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 cursor-pointer">
                {isEn ? `Retry missed (${missed.length})` : `Làm lại từ sai (${missed.length})`}
              </button>
            )}
            <button onClick={() => start(mode)} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 cursor-pointer inline-flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />{isEn ? 'Another round' : 'Lượt mới'}
            </button>
            <button onClick={exit} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer">
              {isEn ? 'Change mode' : 'Đổi chế độ'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MATCH BOARD =================
  if (mode === 'match' && board) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    const cell = (side, c) => {
      const isMatched = matched.includes(c.idx);
      const isSel = side === 'l' && selLeft === c.idx;
      const isWrong = flash && ((side === 'l' && flash.l === c.idx) || (side === 'r' && flash.r === c.idx));
      let cls = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400';
      if (isMatched) cls = 'bg-emerald-50 border-emerald-300 text-emerald-700 opacity-70';
      else if (isWrong) cls = 'bg-red-50 border-red-400 text-red-700';
      else if (isSel) cls = 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-300';
      return (
        <button
          key={`${side}-${c.idx}`}
          onClick={() => (side === 'l' ? pickLeft(c.idx) : pickRight(c.idx))}
          disabled={isMatched}
          className={`w-full px-3 py-3 lg:px-5 lg:py-5 rounded-xl border text-xs lg:text-base font-semibold text-left transition-all cursor-pointer disabled:cursor-default ${cls}`}
        >
          {c.text}
        </button>
      );
    };
    return (
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <button onClick={exit} className="hover:text-slate-800 cursor-pointer">← {isEn ? 'Modes' : 'Chế độ'}</button>
            <span className="inline-flex items-center gap-1"><Timer className="w-3.5 h-3.5" />{mm}:{ss}</span>
            <span className="text-emerald-600">{matched.length} / {board.pairs.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            {isEn ? 'Tap a word, then tap its meaning.' : 'Chạm vào một từ, sau đó chạm vào nghĩa của nó.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">{board.left.map(c => cell('l', c))}</div>
            <div className="space-y-2">{board.right.map(c => cell('r', c))}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  // ================= QUESTION =================
  const isChoice = question.mode === 'choice' || question.mode === 'reverse';
  const canHint = (question.mode === 'cloze' || question.mode === 'scramble' || question.mode === 'dictation') && !result;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 flex flex-col">
      <div className="w-full max-w-6xl mx-auto space-y-5 my-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <button onClick={exit} className="hover:text-slate-800 cursor-pointer">← {isEn ? 'Modes' : 'Chế độ'}</button>
          <span>{isEn ? `Question ${index + 1} / ${session.length}` : `Câu ${index + 1} / ${session.length}`}</span>
          <span className="inline-flex items-center gap-2">
            {combo >= 2 && (
              <span className="inline-flex items-center gap-0.5 text-orange-500"><Flame className="w-3.5 h-3.5" />{combo}</span>
            )}
            <span className="text-emerald-600">{isEn ? `Score ${score}` : `Điểm ${score}`}</span>
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all" style={{ width: `${((index + (result ? 1 : 0)) / session.length) * 100}%` }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-8">
        <div className="p-6 lg:p-10 rounded-2xl bg-slate-900 text-white text-center space-y-3 lg:space-y-5 min-h-[140px] lg:min-h-[360px] flex flex-col items-center justify-center">
          {question.mode === 'dictation' ? (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {isEn ? 'Listen and type the word' : 'Nghe và gõ lại từ'}
              </div>
              <button onClick={() => speakText(question.answer, { rate: 0.85 })}
                className="p-4 rounded-full bg-amber-500 hover:bg-amber-600 cursor-pointer"
                aria-label={isEn ? 'Play again' : 'Nghe lại'}>
                <Volume2 className="w-6 h-6" />
              </button>
              <div className="text-[11px] text-slate-400">{getLocalizedVocabMeaning(question.item, isEn)}</div>
            </>
          ) : question.mode === 'choice' ? (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{isEn ? 'Which word means…' : 'Từ nào có nghĩa…'}</div>
              <div className="text-lg lg:text-3xl font-bold">{question.prompt}</div>
            </>
          ) : question.mode === 'reverse' ? (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{isEn ? 'What does this mean?' : 'Từ này có nghĩa là gì?'}</div>
              <div className="text-2xl lg:text-5xl font-black tracking-wide">{question.prompt}</div>
              <button onClick={() => speakText(question.prompt)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 cursor-pointer"
                aria-label={isEn ? 'Listen' : 'Nghe phát âm'}>
                <Volume2 className="w-4 h-4" />
              </button>
            </>
          ) : question.mode === 'scramble' ? (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{isEn ? 'Unscramble for' : 'Sắp xếp lại cho nghĩa'}</div>
              <div className="text-sm text-slate-200">{question.prompt}</div>
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {question.scrambledUnits.map((u, i) => (
                  <span key={i} className="px-2.5 py-1 lg:px-4 lg:py-2 rounded-lg bg-white/10 border border-white/20 text-base lg:text-3xl font-bold tracking-wider">{u}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {question.isMeaningFallback
                  ? (isEn ? 'Type the English word for' : 'Gõ từ tiếng Anh có nghĩa')
                  : (isEn ? 'Complete the sentence' : 'Hoàn thành câu')}
              </div>
              <div className="text-base lg:text-2xl font-semibold leading-relaxed">{question.prompt}</div>
              {question.hint && <div className="text-xs text-slate-400">💡 {question.hint}</div>}
            </>
          )}
        </div>

        <div className="space-y-4 lg:flex lg:flex-col lg:justify-center lg:space-y-0 lg:gap-4">
        {isChoice ? (
          <div className="grid gap-2 lg:gap-3">
            {question.options.map(opt => {
              const isAnswer = normalizeAnswer(opt) === normalizeAnswer(question.answer);
              const isPicked = result && normalizeAnswer(result.given) === normalizeAnswer(opt);
              let cls = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400';
              if (result && isAnswer) cls = 'bg-emerald-50 border-emerald-400 text-emerald-800';
              else if (result && isPicked) cls = 'bg-red-50 border-red-400 text-red-700';
              return (
                <button key={opt} onClick={() => submit(opt)} disabled={Boolean(result)}
                  className={`px-4 py-3 lg:px-6 lg:py-5 rounded-xl border text-sm lg:text-lg font-semibold text-left transition-all cursor-pointer disabled:cursor-default ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); result ? next() : submit(); }} className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={Boolean(result)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={isEn ? 'Type your answer…' : 'Gõ câu trả lời…'}
              className="w-full px-4 py-3 lg:px-6 lg:py-5 rounded-xl border border-slate-300 text-sm lg:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:bg-slate-50"
            />
            {hinted && !result && (
              <div className="text-center text-sm font-mono tracking-widest text-amber-600">{firstLetterHint(question.answer)}</div>
            )}
            {!result && (
              <div className="flex gap-2">
                {canHint && !hinted && (
                  <button type="button" onClick={() => setHinted(true)}
                    className="px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />{isEn ? 'Hint' : 'Gợi ý'}
                  </button>
                )}
                <button type="submit" disabled={!input.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  {isEn ? 'Check' : 'Kiểm tra'}
                </button>
              </div>
            )}
          </form>
        )}

        {result && (
          <div className={`p-4 rounded-xl border text-sm space-y-1 ${result.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="font-bold inline-flex items-center gap-1.5">
              {result.correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {result.correct ? (isEn ? 'Correct!' : 'Chính xác!') : (isEn ? 'Not quite' : 'Chưa đúng')}
            </div>
            {!result.correct && (
              <div className="text-xs">
                {isEn ? 'Answer: ' : 'Đáp án: '}<span className="font-bold">{question.answer}</span>
                {question.mode === 'reverse' && <span className="opacity-70"> ({question.item.phrase})</span>}
              </div>
            )}
            {question.item.example && <div className="text-xs italic opacity-80">"{question.item.example}"</div>}
          </div>
        )}

        {result && (
          <div className="flex gap-2">
            <button onClick={() => speakText(question.item.phrase, { rate: 0.85 })}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
              aria-label={isEn ? 'Listen' : 'Nghe phát âm'}>
              <Volume2 className="w-4 h-4" />
            </button>
            <button onClick={next} className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer">
              {index >= session.length - 1 ? (isEn ? 'Finish' : 'Hoàn thành') : (isEn ? 'Next' : 'Tiếp theo')}
            </button>
          </div>
        )}
        </div>
        </div>
      </div>
    </div>
  );
}
