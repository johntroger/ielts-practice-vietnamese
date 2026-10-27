import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Keyboard,
  ExternalLink
} from 'lucide-react';
import StarRatingWidget from '../common/StarRatingWidget';
import { getGitBookBaseUrl } from '../../core/featureRegistry';

export default function SpellingDemonStage({
  isEn,
  trap,
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  isMastered,
  onToggleMastered,
  onSaveToNotebook,
  onRecordAttempt
}) {
  if (!trap) return null;

  // Mode: 'quiz' (A/B/C/D) or 'dictation' (type it out)
  const [drillMode, setDrillMode] = useState('quiz');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [dictationInput, setDictationInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Shuffle options on trap change
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setSelectedChoice(null);
    setDictationInput('');
    setIsChecked(false);

    const allChoices = [trap.correct, ...(trap.distractors || [])];
    // Deterministic shuffle
    const shuffled = [...allChoices].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  }, [trap.id]);

  // Audio Playback
  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(trap.correct);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      setIsAudioPlaying(true);
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsAudioPlaying(false);
    }
  };

  // Keyboard navigation handler (1, 2, 3, 4, Enter, Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Enter') {
          handleCheckAnswer();
        }
        return;
      }

      if (e.key === '1' && options[0]) setSelectedChoice(options[0]);
      if (e.key === '2' && options[1]) setSelectedChoice(options[1]);
      if (e.key === '3' && options[2]) setSelectedChoice(options[2]);
      if (e.key === '4' && options[3]) setSelectedChoice(options[3]);
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handlePlayAudio();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isChecked) {
          handleCheckAnswer();
        } else {
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, selectedChoice, isChecked, dictationInput]);

  const handleCheckAnswer = () => {
    if (drillMode === 'quiz' && !selectedChoice) return;
    if (drillMode === 'dictation' && !dictationInput.trim()) return;

    setIsChecked(true);
    const isCorrect = drillMode === 'quiz'
      ? selectedChoice === trap.correct
      : dictationInput.trim().toLowerCase() === trap.correct.toLowerCase();

    if (onRecordAttempt) {
      onRecordAttempt(trap.id, isCorrect);
    }
  };

  const isAnswerCorrect = drillMode === 'quiz'
    ? selectedChoice === trap.correct
    : dictationInput.trim().toLowerCase() === trap.correct.toLowerCase();

  return (
    <div className="flex-1 overflow-y-auto bg-[#f7f5ef] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-5">
        {/* HERO UNIT HEADER (ForumFlash style) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#27c4b5]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#004646]">
                {isEn ? '100 LISTENING SPELLING DEMONS' : '100 BẪY CHÍNH TẢ LISTENING'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Band {trap.bandLevel || '6.5'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#004646] mt-1">
              Unit {currentIndex + 1}: <span className="font-mono text-slate-800">{trap.correct}</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {isEn ? `Trap focus: ${trap.category || 'Cambridge Core'}` : `Nhóm bẫy: ${trap.category || 'Trọng tâm Cambridge'}`}
            </p>
          </div>

          {/* Quick Actions (Audio, Notebook, Mastered) */}
          <div className="flex items-center space-x-2">
            {/* Audio Button */}
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer shadow-2xs ${
                isAudioPlaying
                  ? 'bg-[#27c4b5] text-[#003838] border-[#27c4b5] animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-[#d9e3e4]'
              }`}
              title={isEn ? "Listen to British pronunciation (Space)" : "Phát âm giọng Anh - Anh (Phím Space)"}
            >
              <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'animate-bounce' : 'text-[#004646]'}`} />
              <span className="hidden sm:inline">{isEn ? 'Listen UK' : 'Phát âm'}</span>
            </button>

            {/* Save to Notebook */}
            {onSaveToNotebook && (
              <button
                type="button"
                onClick={() => onSaveToNotebook({
                  word: trap.correct,
                  meaning: trap.explanation || trap.rule,
                  tag: 'Spelling Trap'
                })}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#d9e3e4] text-slate-600 hover:text-amber-600 transition-colors cursor-pointer shadow-2xs"
                title={isEn ? "Save word to Vocabulary Notebook" : "Lưu từ vào Sổ tay từ vựng"}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            {/* Mastered Button */}
            <button
              type="button"
              onClick={() => onToggleMastered(trap.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer shadow-2xs ${
                isMastered
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-[#d9e3e4]'
              }`}
              title={isEn ? "Toggle mastered status (M)" : "Đánh dấu đã thuộc từ này (Phím M)"}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isMastered ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Mark Mastered' : 'Chưa thuộc')}</span>
            </button>
          </div>
        </div>

        {/* DRILL MODE SELECTOR (Quiz Mode vs Dictation Exam Simulator) */}
        <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-[#d9e3e4] shadow-2xs">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => { setDrillMode('quiz'); setIsChecked(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                drillMode === 'quiz'
                  ? 'bg-[#004646] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🎯 {isEn ? 'Recognition Quiz' : 'Trắc nghiệm nhận diện'}
            </button>
            <button
              type="button"
              onClick={() => { setDrillMode('dictation'); setIsChecked(false); handlePlayAudio(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                drillMode === 'dictation'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🎧 {isEn ? 'Exam Dictation Simulator' : 'Chép chính tả phòng thi'}
            </button>
          </div>

          <a
            href={`${getGitBookBaseUrl()}/listening/listening-spelling-demons-100`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 text-[11px] font-bold text-[#004646] hover:text-[#27c4b5] transition-colors"
          >
            <span>{isEn ? '100 Demons Handbook' : 'Cẩm nang 100 từ'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* MAIN INTERACTIVE CARD */}
        <div className="bg-white rounded-3xl border border-[#d9e3e4] p-5 sm:p-7 shadow-xs space-y-5">
          {/* Context Sentence */}
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              {isEn ? 'CAMBRIDGE LISTENING CONTEXT' : 'NGỮ CẢNH ĐỀ THI CAMBRIDGE'}
            </span>
            <div className="mt-1.5 p-4 rounded-2xl bg-[#f7f5ef] border border-[#d9e3e4] text-slate-800 font-serif text-base sm:text-lg leading-relaxed">
              {trap.contextSentence ? (
                trap.contextSentence.split('________').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{part}</span>
                    {i < arr.length - 1 && (
                      <span className="inline-block mx-1.5 px-3 py-0.5 rounded-lg border-2 border-dashed border-[#004646] bg-white font-mono font-bold text-[#004646]">
                        {isChecked ? trap.correct : '________'}
                      </span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p>{isEn ? `Listen and choose the accurate Cambridge spelling for: ` : `Nghe và chọn cách viết chính xác theo chuẩn Cambridge:`}</p>
              )}
            </div>
          </div>

          {/* MODE 1: RECOGNITION QUIZ (A, B, C, D) */}
          {drillMode === 'quiz' && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-500">
                {isEn ? 'Select the single correct spelling (Keys 1-4):' : 'Chọn một từ có chính tả chính xác duy nhất (Phím 1-4):'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {options.map((opt, idx) => {
                  const isSelected = selectedChoice === opt;
                  const isThisCorrect = opt === trap.correct;

                  let cardStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                  if (isChecked) {
                    if (isThisCorrect) {
                      cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/30 font-black';
                    } else if (isSelected && !isThisCorrect) {
                      cardStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400/30 line-through';
                    } else {
                      cardStyle = 'opacity-40 border-slate-200';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-[#e6f5f3] border-[#27c4b5] text-[#004646] ring-2 ring-[#27c4b5]/30 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isChecked}
                      onClick={() => setSelectedChoice(opt)}
                      className={`p-3.5 rounded-2xl border text-left font-mono text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer shadow-2xs ${cardStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-sans font-bold text-xs text-slate-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isChecked && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isChecked && isSelected && !isThisCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: DICTATION EXAM SIMULATOR */}
          {drillMode === 'dictation' && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1.5">
                <Keyboard className="w-3.5 h-3.5" />
                <span>{isEn ? 'Listen to the audio and type the exact word:' : 'Nghe phát âm và tự gõ chính xác toàn bộ chữ cái:'}</span>
              </span>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  autoFocus
                  disabled={isChecked}
                  value={dictationInput}
                  onChange={(e) => setDictationInput(e.target.value)}
                  placeholder={isEn ? 'Type the word here...' : 'Gõ từ vào đây...'}
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-[#004646] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="p-3.5 rounded-2xl bg-[#004646] text-white hover:bg-[#003838] transition-colors cursor-pointer"
                  title="Replay audio (Space)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* CHECK BUTTON (When not checked) */}
          {!isChecked && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={drillMode === 'quiz' ? !selectedChoice : !dictationInput.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#004646] hover:bg-[#003838] disabled:opacity-40 text-white font-extrabold text-sm transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
              >
                <span>{isEn ? 'Check Answer' : 'Kiểm tra đáp án'}</span>
                <span className="text-[11px] opacity-75 font-normal hidden sm:inline">(Enter)</span>
              </button>
            </div>
          )}

          {/* EXAMINER EXPLANATION & MNEMONIC CARD (After Checked) */}
          {isChecked && (
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
              isAnswerCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div className="flex items-center space-x-2">
                {isAnswerCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <h4 className={`font-black text-sm ${isAnswerCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {isAnswerCorrect
                    ? (isEn ? 'Brilliant! Accurate Cambridge Spelling' : 'Chính xác! Chuẩn chính tả Cambridge')
                    : (isEn ? `Distractor Alert! The correct word is: "${trap.correct}"` : `Cảnh báo bẫy! Đáp án đúng là: "${trap.correct}"`)}
                </h4>
              </div>

              {/* Mnemonic Rule */}
              {trap.rule && (
                <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-700">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Examiner Mnemonic Trick:' : 'Mẹo ghi nhớ của giám khảo:'}</span>
                  </div>
                  <p className="leading-relaxed">{trap.rule}</p>
                </div>
              )}

              {/* Deep Explanation */}
              {trap.explanation && (
                <p className="text-xs text-slate-700 leading-relaxed">
                  <b className="text-slate-900">{isEn ? 'Analysis: ' : 'Phân tích gốc từ: '}</b>
                  {trap.explanation}
                </p>
              )}
            </div>
          )}
        </div>
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
          <span>{isEn ? 'Previous' : 'Câu trước'}</span>
        </button>

        <div className="text-xs font-bold text-slate-500 hidden sm:block">
          {currentIndex + 1} / {totalItems}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#004646] hover:bg-[#003838] text-white text-xs font-extrabold transition cursor-pointer shadow-sm"
        >
          <span>{isEn ? 'Next Trap' : 'Câu tiếp theo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
