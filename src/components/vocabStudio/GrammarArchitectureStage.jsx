import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { getLocalizedGrammarItem } from '../../utils/vocabLocalization';

export default function GrammarArchitectureStage({
  isEn,
  grammarItem,
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  isMastered,
  onToggleMastered,
  onSaveToNotebook,
  onRecordAttempt
}) {
  if (!grammarItem) return null;

  const loc = getLocalizedGrammarItem(grammarItem, isEn);

  const [activePhase, setActivePhase] = useState('blueprint');
  const [selectedDrillChoice, setSelectedDrillChoice] = useState(null);
  const [isDrillChecked, setIsDrillChecked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    setSelectedDrillChoice(null);
    setIsDrillChecked(false);
  }, [grammarItem.id]);

  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const sentenceToRead = loc.band8Sentence || loc.modelAnswer || loc.title;
      const utterance = new SpeechSynthesisUtterance(sentenceToRead);
      utterance.lang = 'en-GB';
      utterance.rate = 0.88;
      setIsAudioPlaying(true);
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsAudioPlaying(false);
    }
  };

  const handleCheckDrill = () => {
    if (selectedDrillChoice === null) return;
    setIsDrillChecked(true);
    const isCorrect = selectedDrillChoice === (grammarItem.drills?.[0]?.correctIndex ?? 0);
    if (onRecordAttempt) onRecordAttempt(grammarItem.id, isCorrect);
  };

  const currentDrill = grammarItem.drills?.[0] || null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* UNIT OVERVIEW BANNER */}
        <div className="bg-white rounded-2xl border border-[#e5e9ea] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <span className="px-3 py-1.5 rounded-xl bg-[#004646] text-[#27c4b5] font-black text-xs tracking-wider">
              RULE #{String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {loc.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {loc.bandTarget || `Band ${loc.bandLevel || '7.0+'}`}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEn ? `${totalItems} high-yield Cambridge grammar architectures` : `${totalItems} kiến trúc ngữ pháp ghi điểm Writing Task 2`}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer shadow-2xs ${
                isAudioPlaying
                  ? 'bg-[#27c4b5] text-[#003838] border-[#27c4b5] animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-[#d9e3e4]'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#004646]" />
              <span className="hidden sm:inline">{isEn ? 'Listen Model' : 'Phát âm'}</span>
            </button>

            {onSaveToNotebook && (
              <button
                type="button"
                onClick={() => onSaveToNotebook({
                  word: loc.title,
                  meaning: loc.rationale || loc.formula,
                  tag: 'Grammar Rule'
                })}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#d9e3e4] text-slate-600 hover:text-amber-600 transition cursor-pointer shadow-2xs"
                title={isEn ? "Save to notebook" : "Lưu vào sổ tay"}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleMastered(grammarItem.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer shadow-2xs ${
                isMastered
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-[#d9e3e4]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isMastered ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Mark Mastered' : 'Chưa thuộc')}</span>
            </button>
          </div>
        </div>

        {/* TWO-PHASE SELECTOR */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-[#e5e9ea] shadow-2xs">
          <button
            type="button"
            onClick={() => setActivePhase('blueprint')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-2 ${
              activePhase === 'blueprint'
                ? 'bg-[#004646] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>01</span>
            <span>{isEn ? 'Architecture Blueprint' : 'Kiến trúc công thức'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePhase('drill')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-2 ${
              activePhase === 'drill'
                ? 'bg-[#004646] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>02</span>
            <span>{isEn ? 'Sentence Transformation Drill' : 'Bài tập chuyển câu'}</span>
          </button>
        </div>

        {/* PHASE 1: BLUEPRINT */}
        {activePhase === 'blueprint' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#e5e9ea] p-6 sm:p-7 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                {isEn ? 'MATHEMATICAL GRAMMAR FORMULA' : 'CÔNG THỨC KIẾN TRÚC TOÁN HỌC'}
              </span>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 font-mono text-sm sm:text-base font-bold text-indigo-950">
                {loc.formula}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {loc.rationale}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {isEn ? 'Band 6.0 Basic Sentence' : 'Câu cơ bản Band 6.0'}
                </span>
                <p className="text-xs text-slate-700 font-serif leading-relaxed pt-1">
                  "{loc.basicSentence}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#e6f5f3] border border-[#27c4b5] shadow-2xs space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#004646] text-white">
                  {isEn ? 'Band 8.0+ Academic Upgrade' : 'Nâng cấp Band 8.0+'}
                </span>
                <p className="text-xs text-[#003838] font-serif font-bold leading-relaxed pt-1">
                  "{loc.band8Sentence || loc.modelAnswer}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: DRILL */}
        {activePhase === 'drill' && (
          <div className="bg-white rounded-3xl border border-[#e5e9ea] p-6 sm:p-7 shadow-xs space-y-5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#004646]">
              {isEn ? 'TASK 2 SENTENCE TRANSFORMATION' : 'BÀI TẬP CHUYỂN CÂU NÂNG BAND'}
            </span>

            {currentDrill ? (
              <div className="space-y-4">
                <p className="font-serif text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
                  {currentDrill.question || loc.prompt}
                </p>

                <div className="space-y-2.5">
                  {currentDrill.options?.map((opt, oIdx) => {
                    const isSelected = selectedDrillChoice === oIdx;
                    const isCorrect = oIdx === currentDrill.correctIndex;

                    let optStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                    if (isDrillChecked) {
                      if (isCorrect) {
                        optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/30 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400/30';
                      } else {
                        optStyle = 'opacity-40 border-slate-200';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-[#e6f5f3] border-[#27c4b5] text-[#004646] ring-2 ring-[#27c4b5]/30 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isDrillChecked}
                        onClick={() => setSelectedDrillChoice(oIdx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition cursor-pointer shadow-2xs flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isDrillChecked && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {isDrillChecked && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {!isDrillChecked ? (
                  <button
                    type="button"
                    onClick={handleCheckDrill}
                    disabled={selectedDrillChoice === null}
                    className="px-6 py-2.5 rounded-2xl bg-[#004646] hover:bg-[#003838] disabled:opacity-40 text-white font-extrabold text-xs transition cursor-pointer shadow-md"
                  >
                    {isEn ? 'Check Transformation' : 'Kiểm tra câu viết'}
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold">{isEn ? 'Examiner Rationale:' : 'Phân tích của giám khảo:'}</p>
                    <p>{currentDrill.explanation || loc.rationale}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#f7f5ef] border border-slate-200 text-center text-xs text-slate-600 space-y-2">
                <p className="font-bold">{loc.modelAnswer}</p>
                <p>{isEn ? 'Apply this sentence structure to your next Writing Task 2 essay.' : 'Áp dụng mẫu câu này vào bài viết Task 2 tiếp theo của bạn.'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="max-w-3xl mx-auto w-full pt-6 mt-4 border-t border-[#e5e9ea] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-[#d9e3e4] text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Previous' : 'Cấu trúc trước'}</span>
        </button>

        <div className="text-xs font-bold text-slate-400 hidden sm:block">
          {currentIndex + 1} / {totalItems}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#004646] hover:bg-[#003838] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
        >
          <span>{isEn ? 'Next Rule' : 'Cấu trúc tiếp theo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
