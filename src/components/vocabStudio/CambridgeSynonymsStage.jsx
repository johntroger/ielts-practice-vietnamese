import React, { useState } from 'react';
import {
  Copy,
  ArrowRight,
  ArrowLeft,
  Check,
  Bookmark,
  Volume2,
  Sparkles,
  Grid,
  Lightbulb
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
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* UNIT OVERVIEW BANNER (ForumFlash style) */}
        <div className="bg-white rounded-2xl border border-[#e5e9ea] p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center space-x-3 min-w-0">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-[#004646] text-[#27c4b5] font-black text-[11px] sm:text-xs tracking-wider shrink-0 mt-0.5 sm:mt-0">
              PAIR #{String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                {pair.category || (isEn ? 'Cambridge Paraphrase' : 'Chuyên đề Paraphrase')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                {isEn ? `${totalItems} Cambridge keyword transformations` : `${totalItems} cặp biến đổi từ khóa Reading`}
              </p>
            </div>
          </div>

          {/* Quick Actions & View Switcher */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(`${pair.questionStem} <=> ${pair.passageMatch}`)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer border border-[#d9e3e4]"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? (isEn ? 'Copied!' : 'Đã chép!') : (isEn ? 'Copy' : 'Sao chép')}</span>
            </button>

            {onSaveToNotebook && (
              <button
                type="button"
                onClick={() => onSaveToNotebook({
                  word: pair.questionStem,
                  meaning: `Paraphrase: ${pair.passageMatch}`,
                  tag: 'Cambridge Paraphrase'
                })}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-[#d9e3e4] transition cursor-pointer"
                title={isEn ? "Save to notebook" : "Lưu vào sổ tay"}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleMastered(pair.id)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isMastered
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-[#d9e3e4]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isMastered ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Mark Mastered' : 'Chưa thuộc')}</span>
            </button>
          </div>
        </div>

        {/* ROADMAP CONNECTED STEP: (01 HỌC) ------> MAIN CARD */}
        {viewMode === 'spotlight' ? (
          <div className="flex items-start gap-4">
            {/* Step Circle Node (ForumFlash style) */}
            <div className="hidden sm:flex flex-col items-center shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full border-2 border-[#27c4b5] bg-white flex flex-col items-center justify-center text-[#004646] shadow-xs">
                <span className="font-mono text-xs font-black">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#27c4b5]">
                  {isEn ? 'PAIR' : 'CẶP'}
                </span>
              </div>
              <div className="w-0.5 h-32 border-l-2 border-dashed border-[#27c4b5]/40 mt-2" />
            </div>

            {/* Main Clean Card */}
            <div className="flex-1 bg-white rounded-3xl border border-[#e5e9ea] p-6 sm:p-8 shadow-xs space-y-6">
              {/* Question Stem Section */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isEn ? '01 • KEYWORD IN QUESTION STEM' : '01 • TỪ KHÓA TRONG ĐỀ BÀI (QUESTION STEM)'}
                </span>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f7f5ef] border border-[#e5e9ea]">
                  <p className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                    "{pair.questionStem}"
                  </p>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(pair.questionStem)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 transition cursor-pointer border border-[#d9e3e4] shrink-0 ml-3"
                    title={isEn ? "Listen UK pronunciation" : "Nghe phát âm"}
                  >
                    <Volume2 className="w-4 h-4 text-[#004646]" />
                  </button>
                </div>
              </div>

              {/* Connecting Transformation Indicator */}
              <div className="flex items-center justify-center text-xs font-bold text-[#004646] space-x-2 py-1">
                <span className="h-px bg-[#d9e3e4] flex-1" />
                <span className="px-3 py-1 rounded-full bg-[#e6f5f3] border border-[#27c4b5]/40 text-[#004646] font-extrabold text-[11px]">
                  {isEn ? 'Transforms into Reading Passage as:' : 'Biến đổi trong bài đọc thành:'}
                </span>
                <span className="h-px bg-[#d9e3e4] flex-1" />
              </div>

              {/* Passage Match Section */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#004646]">
                  {isEn ? '02 • ORIGINAL PASSAGE EQUIVALENT' : '02 • TỪ TƯƠNG ĐƯƠNG TRONG BÀI ĐỌC (PASSAGE MATCH)'}
                </span>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#e6f5f3] border border-[#27c4b5]">
                  <p className="text-lg sm:text-xl font-black text-[#003838] font-serif">
                    "{pair.passageMatch}"
                  </p>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(pair.passageMatch)}
                    className="p-2 rounded-xl bg-white hover:bg-teal-50 text-[#004646] transition cursor-pointer border border-[#27c4b5]/40 shrink-0 ml-3"
                    title={isEn ? "Listen UK pronunciation" : "Nghe phát âm"}
                  >
                    <Volume2 className="w-4 h-4 text-[#004646]" />
                  </button>
                </div>
              </div>

              {/* Strategy Insight */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-950 leading-relaxed">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">{isEn ? 'Examiner Reading Trap Secret:' : 'Bí mật bẫy khảo thí Reading:'}</p>
                  <p className="mt-0.5 text-amber-900/90">
                    {isEn
                      ? 'Test makers intentionally disguise the keyword in the passage. Once you scan and spot this equivalent phrase, you have pinned down the exact answer sentence.'
                      : 'Giám khảo luôn ngụy trang từ khóa trong bài đọc. Khi bạn nắm chắc cặp từ này, bạn sẽ định vị ngay câu chứa đáp án mà không cần dịch toàn bộ bài.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {allPairs.map((p, pIdx) => (
              <div
                key={p.id || pIdx}
                onClick={() => {
                  onSelectIndex(pIdx);
                  setViewMode('spotlight');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  pIdx === currentIndex
                    ? 'bg-[#e6f5f3] border-[#27c4b5] shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-[#e5e9ea]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-[#004646] pb-1">
                  <span>#{pIdx + 1} {p.category}</span>
                  <span className="text-[#27c4b5]">{isEn ? 'Select' : 'Xem'}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {p.questionStem}
                </p>
                <p className="text-xs font-semibold text-teal-900 truncate mt-1 flex items-center space-x-1">
                  <ArrowRight className="w-3 h-3 text-[#27c4b5] shrink-0" />
                  <span className="truncate">{p.passageMatch}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="max-w-3xl mx-auto w-full pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-[#e5e9ea] flex items-center justify-between gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-[#d9e3e4] text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Previous' : 'Trước'}</span>
        </button>

        <div className="text-xs font-bold text-slate-500 px-2.5 py-1 rounded-lg bg-white border border-[#e5e9ea]">
          {currentIndex + 1} / {totalItems}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-1.5 sm:space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#004646] hover:bg-[#003838] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
        >
          <span>{isEn ? 'Next Pair' : 'Cặp tiếp'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
