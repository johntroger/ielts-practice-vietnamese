import React, { useState } from 'react';
import {
  Compass,
  Copy,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Bookmark,
  Volume2,
  Sparkles,
  Grid,
  Maximize2
} from 'lucide-react';

export default function CambridgeSynonymsStage({
  isEn,
  pair,
  allPairs = [],
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  onSelectIndex,
  isMastered,
  onToggleMastered,
  onSaveToNotebook
}) {
  const [viewMode, setViewMode] = useState('spotlight'); // 'spotlight' or 'grid'
  const [copied, setCopied] = useState(false);

  if (!pair) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f7f5ef] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-5">
        {/* HERO BANNER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#004646]">
                {isEn ? '50 CAMBRIDGE READING PARAPHRASE PAIRS' : '50 CẶP PARAPHRASE CAMBRIDGE READING'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {pair.category || 'Reading Hunter'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#004646] mt-1">
              {pair.questionStem}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {isEn ? 'Keyword Transformation in Academic Reading Passages' : 'Bí kíp bắt bẫy Paraphrase trong bài đọc IELTS Reading'}
            </p>
          </div>

          {/* Mode Switcher: Spotlight vs Grid */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#d9e3e4] shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('spotlight')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'spotlight' ? 'bg-[#004646] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🎯 {isEn ? 'Focus View' : 'Tiêu điểm'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#004646] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-3.5 h-3.5 inline mr-1" />
              {isEn ? 'All 50 Pairs' : 'Xem toàn bộ 50 cặp'}
            </button>
          </div>
        </div>

        {/* SPOTLIGHT VIEW */}
        {viewMode === 'spotlight' ? (
          <div className="bg-white rounded-3xl border border-[#d9e3e4] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase text-[#004646]">
                Pair #{currentIndex + 1} • {pair.category}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleCopy(`${pair.questionStem} <=> ${pair.passageMatch}`)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? (isEn ? 'Copied!' : 'Đã sao chép!') : (isEn ? 'Copy' : 'Sao chép')}</span>
                </button>
                {onSaveToNotebook && (
                  <button
                    type="button"
                    onClick={() => onSaveToNotebook({
                      word: pair.questionStem,
                      meaning: `Paraphrase: ${pair.passageMatch}`,
                      tag: 'Cambridge Paraphrase'
                    })}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition cursor-pointer"
                    title="Save to notebook"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onToggleMastered(pair.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isMastered ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isMastered ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Mark Mastered' : 'Chưa thuộc')}</span>
                </button>
              </div>
            </div>

            {/* SIDE-BY-SIDE TRANSFORMATION BOX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question Stem Side */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {isEn ? 'KEYWORD IN QUESTION STEM' : 'TỪ KHÓA TRONG ĐỀ BÀI (QUESTION STEM)'}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  "{pair.questionStem}"
                </p>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(pair.questionStem)}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold pt-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Listen' : 'Nghe phát âm'}</span>
                </button>
              </div>

              {/* Passage Match Side */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center space-x-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{isEn ? 'ORIGINAL PASSAGE TEXT EQUIVALENT' : 'TỪ ĐỒNG NGHĨA TRONG BÀI ĐỌC'}</span>
                </span>
                <p className="text-base sm:text-lg font-bold text-purple-950 font-serif">
                  "{pair.passageMatch}"
                </p>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(pair.passageMatch)}
                  className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-900 font-semibold pt-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Listen' : 'Nghe phát âm'}</span>
                </button>
              </div>
            </div>

            {/* STRATEGY NOTE */}
            <div className="p-4 rounded-2xl bg-[#e6f5f3] border border-[#27c4b5] text-xs text-[#003838] leading-relaxed">
              <b className="font-extrabold">{isEn ? 'Examiner Reading Trap: ' : 'Mẹo khảo thí Reading: '}</b>
              {isEn
                ? 'Cambridge IELTS test makers never use the exact same words between question stems and reading passages. Mastering this specific equivalent pair guarantees instant identification of the evidence paragraph.'
                : 'Giám khảo khảo thí Cambridge không bao giờ dùng nguyên văn từ khóa trong bài đọc. Việc nắm vững cặp từ tương đương này giúp bạn định vị đoạn văn chứa bằng chứng chỉ trong vài giây.'}
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-1">
            {allPairs.map((p, pIdx) => (
              <div
                key={p.id || pIdx}
                onClick={() => {
                  onSelectIndex(pIdx);
                  setViewMode('spotlight');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  pIdx === currentIndex
                    ? 'bg-[#e6f5f3] border-[#27c4b5] shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-purple-700 border-b border-slate-100 pb-1.5 mb-2">
                  <span>#{pIdx + 1} {p.category}</span>
                  <span className="text-slate-400">{isEn ? 'Click to inspect' : 'Bấm để xem'}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {p.questionStem}
                </p>
                <p className="text-xs font-semibold text-purple-900 truncate mt-1 flex items-center space-x-1">
                  <ArrowRight className="w-3 h-3 shrink-0 text-purple-500" />
                  <span className="truncate">{p.passageMatch}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="max-w-3xl mx-auto w-full pt-6 mt-4 border-t border-[#d9e3e4] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-[#d9e3e4] text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Previous' : 'Cặp trước'}</span>
        </button>

        <div className="text-xs font-bold text-slate-500 hidden sm:block">
          {currentIndex + 1} / {totalItems}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#004646] hover:bg-[#003838] text-white text-xs font-extrabold transition cursor-pointer shadow-sm"
        >
          <span>{isEn ? 'Next Pair' : 'Cặp tiếp theo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
