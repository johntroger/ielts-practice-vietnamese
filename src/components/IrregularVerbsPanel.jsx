import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Volume2, Plus, Check, Dumbbell, BookOpen, RotateCw, Flame, X } from 'lucide-react';
import { IRREGULAR_VERBS } from '../data/irregularVerbsData';
import { shuffle, normalizeAnswer } from '../utils/vocabPractice';
import { normalizeVocabPhrase } from '../utils/vocabDuplicate';
import { initSrsItem } from '../utils/srsService';
import { speakText, stopSpeech } from '../utils/speechAudio';
import { playArenaSfx } from '../utils/audioHelper';

const PAGE_SIZE = 24;

const PATTERN_META = {
  AAA: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    en: 'AAA · All 3 same',
    vi: 'AAA · 3 dạng giống nhau'
  },
  ABB: {
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    en: 'ABB · V2 = V3',
    vi: 'ABB · V2 = V3'
  },
  ABA: {
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    en: 'ABA · V1 = V3',
    vi: 'ABA · V1 = V3'
  },
  ABC: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    en: 'ABC · All 3 distinct',
    vi: 'ABC · 3 dạng khác nhau'
  }
};

function matchesForm(expected, given) {
  const g = normalizeAnswer(given);
  if (!g) return false;
  const variants = String(expected || '').split('/').map(s => normalizeAnswer(s));
  return variants.includes(g);
}

export default function IrregularVerbsPanel({ vocabList = [], isEn, onAddVocab }) {
  const [subMode, setSubMode] = useState('browse'); // 'browse' | 'quiz'

  // Browse state
  const [query, setQuery] = useState('');
  const [pattern, setPattern] = useState('all'); // 'all' | 'AAA' | 'ABB' | 'ABA' | 'ABC'
  const [ieltsOnly, setIeltsOnly] = useState(false);
  const [sortAz, setSortAz] = useState(true);
  const [page, setPage] = useState(1);

  // Quiz state
  const [quizRunning, setQuizRunning] = useState(false);
  const [quizSize, setQuizSize] = useState(10);
  const [quizItems, setQuizItems] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [v2Input, setV2Input] = useState('');
  const [v3Input, setV3Input] = useState('');
  const [qResult, setQResult] = useState(null); // { v2Ok, v3Ok, bothOk }
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [missed, setMissed] = useState([]);
  const [finished, setFinished] = useState(false);

  const v2Ref = useRef(null);
  const savedSet = useMemo(
    () => new Set(vocabList.map(v => normalizeVocabPhrase(v?.phrase))),
    [vocabList]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = IRREGULAR_VERBS.filter(item => {
      if (pattern !== 'all' && item.pattern !== pattern) return false;
      if (ieltsOnly && !item.ielts) return false;
      if (q) {
        const hit =
          item.v1.toLowerCase().includes(q) ||
          item.v2.toLowerCase().includes(q) ||
          item.v3.toLowerCase().includes(q) ||
          item.meaningVi.toLowerCase().includes(q) ||
          item.meaningEn.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
    if (sortAz) {
      return [...list].sort((a, b) => a.v1.localeCompare(b.v1, 'en'));
    }
    return list;
  }, [query, pattern, ieltsOnly, sortAz]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    if (quizRunning && !finished && !qResult) {
      v2Ref.current?.focus();
    }
  }, [quizRunning, finished, qIdx, qResult]);

  // Enter advances to next question after checking
  useEffect(() => {
    if (!quizRunning || finished || !qResult) return undefined;
    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextQuestion();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const makePhrase = (v) => `${v.v1} – ${v.v2} – ${v.v3}`;

  const handleSaveVerb = (v) => {
    if (!onAddVocab) return;
    const item = initSrsItem({
      id: `vocab-irreg-${v.v1}-${Date.now()}`,
      phrase: makePhrase(v),
      meaningVi: v.meaningVi,
      meaningEn: v.meaningEn,
      example: v.example,
      topic: 'general',
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    onAddVocab(item);
  };

  const startQuiz = (customPool) => {
    const source = customPool || (filtered.length > 0 ? filtered : IRREGULAR_VERBS);
    const picked = shuffle(source).slice(0, customPool ? customPool.length : Math.min(quizSize, source.length));
    setQuizItems(picked);
    setQIdx(0);
    setV2Input('');
    setV3Input('');
    setQResult(null);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setMissed([]);
    setFinished(false);
    setQuizRunning(true);
    setSubMode('quiz');
  };

  const currentQ = quizItems[qIdx];

  const submitAnswer = (e) => {
    e?.preventDefault();
    if (!currentQ || qResult) return;
    const v2Ok = matchesForm(currentQ.v2, v2Input);
    const v3Ok = matchesForm(currentQ.v3, v3Input);
    const bothOk = v2Ok && v3Ok;
    if (bothOk) {
      const nextCombo = combo + 1;
      setScore(s => s + 1);
      setCombo(nextCombo);
      setBestCombo(b => Math.max(b, nextCombo));
      playArenaSfx('correct', nextCombo);
    } else {
      setCombo(0);
      setMissed(m => [...m, currentQ]);
      playArenaSfx('wrong');
    }
    setQResult({ v2Ok, v3Ok, bothOk });
  };

  const nextQuestion = () => {
    if (qIdx >= quizItems.length - 1) {
      setFinished(true);
      playArenaSfx('victory');
      return;
    }
    setQIdx(i => i + 1);
    setV2Input('');
    setV3Input('');
    setQResult(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-header Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setSubMode('browse'); setQuizRunning(false); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              subMode === 'browse'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEn ? `Reference (${IRREGULAR_VERBS.length})` : `Bảng tra cứu (${IRREGULAR_VERBS.length})`}</span>
          </button>
          <button
            onClick={() => { setSubMode('quiz'); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              subMode === 'quiz'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{isEn ? 'V1–V2–V3 Quiz' : 'Luyện V1–V2–V3'}</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          {isEn ? 'Open to all learners · Grouped by pattern' : 'Mở cho tất cả học viên · Phân nhóm theo quy luật'}
        </span>
      </div>

      {/* === BROWSE MODE === */}
      {subMode === 'browse' && (
        <>
          <div className="p-3 sm:p-4 bg-white border-b border-slate-200 space-y-2.5 shrink-0">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder={isEn ? 'Search V1, V2, V3 or meaning...' : 'Tìm V1, V2, V3 hoặc nghĩa...'}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setIeltsOnly(v => !v); setPage(1); }}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    ieltsOnly
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isEn ? '★ IELTS Core' : '★ Trọng tâm IELTS'}
                </button>
                <button
                  onClick={() => setSortAz(s => !s)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {sortAz ? 'A → Z' : (isEn ? 'By pattern' : 'Theo nhóm')}
                </button>
                <button
                  onClick={() => startQuiz()}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Quiz filtered' : 'Luyện nhóm này'}</span>
                </button>
              </div>
            </div>

            {/* Pattern pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { setPattern('all'); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                  pattern === 'all' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isEn ? `All (${IRREGULAR_VERBS.length})` : `Tất cả (${IRREGULAR_VERBS.length})`}
              </button>
              {Object.entries(PATTERN_META).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => { setPattern(key); setPage(1); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                    pattern === key ? 'bg-slate-900 border-slate-900 text-white' : `${meta.badge} opacity-85 hover:opacity-100`
                  }`}
                >
                  {isEn ? meta.en : meta.vi}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {paged.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                {isEn ? 'No irregular verbs match your filter.' : 'Không tìm thấy động từ bất quy tắc phù hợp.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {paged.map((v) => {
                  const isSaved = savedSet.has(normalizeVocabPhrase(makePhrase(v)));
                  const meta = PATTERN_META[v.pattern];
                  return (
                    <div key={v.v1} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-indigo-300 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${meta.badge}`}>{v.pattern}</span>
                          {v.ielts && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              IELTS
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => speakText(`${v.v1}, ${v.v2}, ${v.v3}`, { rate: 0.9 })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                            title={isEn ? 'Listen V1–V2–V3' : 'Nghe V1–V2–V3'}
                            aria-label={isEn ? 'Listen V1–V2–V3' : 'Nghe V1–V2–V3'}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {onAddVocab && (
                            <button
                              onClick={() => handleSaveVerb(v)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer border transition-colors ${
                                isSaved
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700'
                              }`}
                              title={isEn ? 'Save to personal vault' : 'Lưu vào sổ tay cá nhân'}
                            >
                              {isSaved ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              <span>{isSaved ? (isEn ? 'Saved' : 'Đã lưu') : (isEn ? 'Save' : 'Lưu')}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">V1</div>
                          <div className="text-xs font-black text-slate-900">{v.v1}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">V2</div>
                          <div className="text-xs font-bold text-indigo-700">{v.v2}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">V3</div>
                          <div className="text-xs font-bold text-emerald-700">{v.v3}</div>
                        </div>
                      </div>

                      <div className="text-xs font-medium text-slate-700">
                        {isEn ? v.meaningEn : v.meaningVi}
                      </div>
                      {v.example && (
                        <div className="text-[11px] italic text-slate-500">"{v.example}"</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {filtered.length > PAGE_SIZE && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isEn
                    ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`
                    : `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} / ${filtered.length} động từ`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    {isEn ? 'Prev' : 'Trước'}
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    {isEn ? 'Next' : 'Sau'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* === QUIZ MODE === */}
      {subMode === 'quiz' && !quizRunning && (
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEn ? 'Irregular Verbs V2 & V3 Drill' : 'Luyện Tập Chia Động Từ V2 & V3'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? 'See the base form (V1) and meaning, then type Past Simple (V2) and Past Participle (V3).'
                  : 'Nhìn động từ nguyên mẫu (V1) và nghĩa, sau đó gõ dạng Quá khứ đơn (V2) và Phân từ 2 (V3).'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] font-bold text-slate-500 space-y-1">
                <span>{isEn ? 'Pattern group' : 'Nhóm quy luật'}</span>
                <select
                  value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium"
                >
                  <option value="all">{isEn ? 'All patterns' : 'Tất cả nhóm'}</option>
                  {Object.entries(PATTERN_META).map(([k, m]) => (
                    <option key={k} value={k}>{isEn ? m.en : m.vi}</option>
                  ))}
                </select>
              </label>

              <label className="text-[11px] font-bold text-slate-500 space-y-1">
                <span>{isEn ? 'Questions' : 'Số câu'}</span>
                <select
                  value={quizSize}
                  onChange={e => setQuizSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium"
                >
                  {[10, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={ieltsOnly}
                onChange={e => setIeltsOnly(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>{isEn ? 'Focus on IELTS Core verbs only' : 'Chỉ luyện các động từ trọng tâm IELTS'}</span>
            </label>

            <button
              onClick={() => startQuiz()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              {isEn ? `Start Quiz (${Math.min(quizSize, filtered.length || IRREGULAR_VERBS.length)} verbs)` : `Bắt đầu (${Math.min(quizSize, filtered.length || IRREGULAR_VERBS.length)} từ)`}
            </button>
          </div>
        </div>
      )}

      {subMode === 'quiz' && quizRunning && finished && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="text-4xl">{score / quizItems.length >= 0.8 ? '🏆' : '💪'}</div>
            <h3 className="text-lg font-bold text-slate-900">
              {score} / {quizItems.length} ({Math.round((score / quizItems.length) * 100)}%)
            </h3>
            <div className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {isEn ? `Best combo: ${bestCombo}` : `Combo cao nhất: ${bestCombo}`}
            </div>

            {missed.length > 0 && (
              <div className="text-left grid sm:grid-cols-2 gap-2 pt-2">
                {missed.map(v => (
                  <div key={v.v1} className="p-3 rounded-xl border border-red-100 bg-red-50/50 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{v.v1} → {v.v2} → {v.v3}</div>
                      <div className="text-xs text-slate-600">{isEn ? v.meaningEn : v.meaningVi}</div>
                    </div>
                    <button
                      onClick={() => speakText(`${v.v1}, ${v.v2}, ${v.v3}`, { rate: 0.9 })}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                      aria-label={isEn ? 'Listen' : 'Nghe'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {missed.length > 0 && (
                <button
                  onClick={() => startQuiz(missed)}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  {isEn ? `Retry missed (${missed.length})` : `Làm lại từ sai (${missed.length})`}
                </button>
              )}
              <button
                onClick={() => startQuiz()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {isEn ? 'New round' : 'Lượt mới'}
              </button>
              <button
                onClick={() => setQuizRunning(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Settings' : 'Cài đặt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {subMode === 'quiz' && quizRunning && !finished && currentQ && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col">
          <div className="w-full max-w-4xl mx-auto my-auto space-y-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <button onClick={() => setQuizRunning(false)} className="hover:text-slate-800 cursor-pointer">
                ← {isEn ? 'Back' : 'Quay lại'}
              </button>
              <span>{isEn ? `Verb ${qIdx + 1} / ${quizItems.length}` : `Từ ${qIdx + 1} / ${quizItems.length}`}</span>
              <span className="inline-flex items-center gap-2">
                {combo >= 2 && <span className="inline-flex items-center gap-0.5 text-orange-500"><Flame className="w-3.5 h-3.5" />{combo}</span>}
                <span className="text-emerald-600">{isEn ? `Score ${score}` : `Điểm ${score}`}</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all" style={{ width: `${((qIdx + (qResult ? 1 : 0)) / quizItems.length) * 100}%` }} />
            </div>

            <div className="grid lg:grid-cols-2 gap-5 lg:gap-8">
              <div className="p-6 lg:p-10 rounded-2xl bg-slate-900 text-white text-center space-y-3 min-h-[160px] lg:min-h-[300px] flex flex-col items-center justify-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${PATTERN_META[currentQ.pattern].badge}`}>
                  {currentQ.pattern}
                </span>
                <div className="text-3xl lg:text-5xl font-black tracking-wide">{currentQ.v1}</div>
                <div className="text-sm lg:text-base text-slate-300">
                  {isEn ? currentQ.meaningEn : currentQ.meaningVi}
                </div>
                <button
                  onClick={() => speakText(currentQ.v1, { rate: 0.9 })}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-indigo-300 cursor-pointer"
                  aria-label={isEn ? 'Listen' : 'Nghe'}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 lg:flex lg:flex-col lg:justify-center">
                <form onSubmit={submitAnswer} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      {isEn ? 'Past Simple (V2)' : 'Quá khứ đơn (V2)'}
                    </label>
                    <input
                      ref={v2Ref}
                      type="text"
                      value={v2Input}
                      onChange={e => setV2Input(e.target.value)}
                      disabled={Boolean(qResult)}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder={isEn ? 'Type V2...' : 'Nhập V2...'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        qResult
                          ? (qResult.v2Ok ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-red-50 border-red-400 text-red-700')
                          : 'border-slate-300 bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      {isEn ? 'Past Participle (V3)' : 'Quá khứ phân từ (V3)'}
                    </label>
                    <input
                      type="text"
                      value={v3Input}
                      onChange={e => setV3Input(e.target.value)}
                      disabled={Boolean(qResult)}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder={isEn ? 'Type V3...' : 'Nhập V3...'}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        qResult
                          ? (qResult.v3Ok ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-red-50 border-red-400 text-red-700')
                          : 'border-slate-300 bg-white'
                      }`}
                    />
                  </div>
                  {!qResult && (
                    <button
                      type="submit"
                      disabled={!v2Input.trim() || !v3Input.trim()}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isEn ? 'Check' : 'Kiểm tra'}
                    </button>
                  )}
                </form>

                {qResult && (
                  <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${qResult.bothOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="font-bold inline-flex items-center gap-1.5 text-sm">
                      {qResult.bothOk ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {qResult.bothOk ? (isEn ? 'Exact match!' : 'Chính xác!') : `${currentQ.v1} – ${currentQ.v2} – ${currentQ.v3}`}
                    </div>
                    {currentQ.example && <div className="italic opacity-85">"{currentQ.example}"</div>}
                  </div>
                )}

                {qResult && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakText(`${currentQ.v1}, ${currentQ.v2}, ${currentQ.v3}`, { rate: 0.9 })}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                      aria-label={isEn ? 'Listen' : 'Nghe'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextQuestion}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                    >
                      {qIdx >= quizItems.length - 1 ? (isEn ? 'Finish' : 'Hoàn thành') : (isEn ? 'Next' : 'Tiếp theo')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
