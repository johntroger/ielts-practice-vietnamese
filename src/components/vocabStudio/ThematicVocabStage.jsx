import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  Check,
  RotateCw,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { getLocalizedCardMeaning } from '../../utils/vocabLocalization';

export default function ThematicVocabStage({
  isEn,
  deck,
  card,
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  isMastered,
  onToggleMastered,
  onSaveToNotebook,
  onRecordAttempt
}) {
  if (!card) return null;

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.term);
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

  const localizedMeaning = getLocalizedCardMeaning(card, isEn);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* UNIT OVERVIEW BANNER */}
        <div className="bg-white rounded-2xl border border-[#e5e9ea] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <span className="px-3 py-1.5 rounded-xl bg-[#004646] text-[#27c4b5] font-black text-xs tracking-wider">
              CARD #{String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {deck?.topicName || (isEn ? 'Thematic Deck' : 'Bộ thẻ theo chủ đề')}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Band {card.bandScore || card.bandLevel || '7.0'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEn ? `${totalItems} active recall cards in this thematic deck` : `${totalItems} thẻ từ vựng & collocation phản xạ`}
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
              <span className="hidden sm:inline">{isEn ? 'Listen' : 'Phát âm'}</span>
            </button>

            {onSaveToNotebook && (
              <button
                type="button"
                onClick={() => onSaveToNotebook({
                  word: card.term,
                  meaning: localizedMeaning,
                  collocations: card.collocations,
                  tag: 'Thematic Vocab'
                })}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#d9e3e4] text-slate-600 hover:text-amber-600 transition cursor-pointer shadow-2xs"
                title={isEn ? "Save to notebook" : "Lưu vào sổ tay"}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleMastered(card.id)}
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

        {/* 3D ACTIVE RECALL FLASHCARD */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-white rounded-3xl border border-[#e5e9ea] p-6 sm:p-8 shadow-xs cursor-pointer hover:border-[#27c4b5] transition-all duration-200 select-none min-h-[260px] flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span className="uppercase tracking-wider">
              {isFlipped
                ? (isEn ? 'CARD BACK • DEFINITION & COLLOCATIONS' : 'MẶT SAU • Ý NGHĨA & COLLOCATIONS')
                : (isEn ? 'CARD FRONT • ACTIVE RECALL' : 'MẶT TRƯỚC • PHẢN XẠ NHỚ')}
            </span>
            <span className="flex items-center space-x-1 text-[#27c4b5] group-hover:text-[#004646]">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Click to flip' : 'Bấm để lật thẻ'}</span>
            </span>
          </div>

          {!isFlipped ? (
            <div className="my-6 space-y-4 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-[#004646] tracking-tight">
                {card.term}
              </h2>
              <p className="text-sm font-mono text-slate-500">
                {card.phonetic}
              </p>
              {card.example && (
                <div className="p-4 rounded-2xl bg-[#f7f5ef] border border-[#e5e9ea] max-w-xl mx-auto text-xs sm:text-sm font-serif text-slate-700 italic">
                  "{card.example}"
                </div>
              )}
            </div>
          ) : (
            <div className="my-6 space-y-4">
              <div className="p-4 rounded-2xl bg-[#e6f5f3] border border-[#27c4b5] text-center space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#004646]">
                  {isEn ? 'ENGLISH DEFINITION' : 'Ý NGHĨA & ĐỊNH NGHĨA HỌC THUẬT'}
                </span>
                {card.meaningEn && !isEn && (
                  <p className="text-xs sm:text-sm font-semibold text-teal-900 italic">
                    "{card.meaningEn}"
                  </p>
                )}
                <p className="text-base sm:text-lg font-bold text-[#003838]">
                  {localizedMeaning}
                </p>
              </div>

              {card.exampleVi && !isEn && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic text-center">
                  Dịch câu ví dụ: "{card.exampleVi}"
                </div>
              )}

              {card.collocations && card.collocations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {isEn ? 'HIGH-BAND COLLOCATIONS (C1/C2)' : 'CỤM TỪ KẾT HỢP ĐIỂM CAO'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.collocations.map((col, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200"
                      >
                        ⚡ {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            {isEn ? 'Test your memory first, then flip to verify collocations.' : 'Tự nhớ nghĩa trong đầu trước, sau đó lật thẻ để kiểm tra collocations.'}
          </div>
        </div>

        {/* ACTIVE RECALL RATING BUTTONS */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              if (onRecordAttempt) onRecordAttempt(card.id, false);
              onNext();
            }}
            className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs transition cursor-pointer text-center"
          >
            ❌ {isEn ? 'Need Review' : 'Cần ôn lại'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onRecordAttempt) onRecordAttempt(card.id, true);
              onNext();
            }}
            className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs transition cursor-pointer text-center"
          >
            ⚡ {isEn ? 'Good Recall' : 'Tạm nhớ'}
          </button>
          <button
            type="button"
            onClick={() => {
              onToggleMastered(card.id);
              if (onRecordAttempt) onRecordAttempt(card.id, true);
              onNext();
            }}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition cursor-pointer text-center"
          >
            ✓ {isEn ? 'Fully Mastered' : 'Đã thuộc'}
          </button>
        </div>
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
          <span>{isEn ? 'Previous' : 'Thẻ trước'}</span>
        </button>

        <div className="text-xs font-bold text-slate-400 hidden sm:block">
          {currentIndex + 1} / {totalItems}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#004646] hover:bg-[#003838] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
        >
          <span>{isEn ? 'Next Card' : 'Thẻ tiếp theo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
