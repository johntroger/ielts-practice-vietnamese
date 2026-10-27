import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Keyboard,
  ExternalLink
} from 'lucide-react';
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

  const [drillMode, setDrillMode] = useState('quiz');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [dictationInput, setDictationInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setSelectedChoice(null);
    setDictationInput('');
    setIsChecked(false);

    const allChoices = [trap.correct, ...(trap.distractors || [])];
    const shuffled = [...allChoices].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  }, [trap.id]);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Enter') handleCheckAnswer();
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
        if (!isChecked) handleCheckAnswer();
        else onNext();
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

    if (onRecordAttempt) onRecordAttempt(trap.id, isCorrect);
  };

  const isAnswerCorrect = drillMode === 'quiz'
    ? selectedChoice === trap.correct
    : dictationInput.trim().toLowerCase() === trap.correct.toLowerCase();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* UNIT OVERVIEW BANNER (ForumFlash style) */}
        <div className="bg-white rounded-2xl border border-[#e5e9ea] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <span className="px-3 py-1.5 rounded-xl bg-[#004646] text-[#27c4b5] font-black text-xs tracking-wider">
              TRAP #{String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {trap.category || (isEn ? 'Spelling Trap' : 'Bẫy chính tả')}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Band {trap.bandLevel || '6.5'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEn ? `${totalItems} high-frequency Cambridge Listening demons` : `${totalItems} từ sát thủ trong Cambridge Listening`}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer shadow-2xs ${
                isAudioPlaying
                  ? 'bg-[#27c4b5] text-[#003838] border-[#27c4b5] animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-[#d9e3e4]'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#004646]" />
              <span className="hidden sm:inline">{isEn ? 'Listen UK' : 'Phát âm'}</span>
            </button>

            {onSaveToNotebook && (
              <button
                type="button"
                onClick={() => onSaveToNotebook({
                  word: trap.correct,
                  meaning: trap.explanation || trap.rule,
                  tag: 'Spelling Trap'
                })}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#d9e3e4] text-slate-600 hover:text-amber-600 transition cursor-pointer shadow-2xs"
                title={isEn ? "Save to notebook" : "Lưu vào sổ tay"}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleMastered(trap.id)}
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

        {/* MODE SWITCHER (Quiz vs Dictation) */}
        <div className="flex items-center justify-between bg-white p-1.5 rounded-2xl border border-[#e5e9ea] shadow-2xs">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => { setDrillMode('quiz'); setIsChecked(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                drillMode === 'dictation'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🎧 {isEn ? 'Exam Dictation' : 'Chép chính tả phòng thi'}
            </button>
          </div>

          <a
            href={`${getGitBookBaseUrl()}/listening/listening-spelling-demons-100`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 text-[11px] font-bold text-[#004646] hover:text-[#27c4b5] transition-colors pr-2"
          >
            <span>{isEn ? '100 Demons Guide' : 'Cẩm nang 100 từ'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* CONNECTED ROADMAP NODE + CARD */}
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex flex-col items-center shrink-0 pt-2">
            <div className="w-12 h-12 rounded-full border-2 border-[#27c4b5] bg-white flex flex-col items-center justify-center text-[#004646] shadow-xs">
              <span className="font-mono text-xs font-black">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#27c4b5]">
                {isEn ? 'TEST' : 'BÀI'}
              </span>
            </div>
            <div className="w-0.5 h-32 border-l-2 border-dashed border-[#27c4b5]/40 mt-2" />
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-[#e5e9ea] p-6 sm:p-8 shadow-xs space-y-6">
            {/* Context Sentence with Cloze */}
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                {isEn ? 'CAMBRIDGE LISTENING CONTEXT' : 'NGỮ CẢNH ĐỀ THI CAMBRIDGE'}
              </span>
              <div className="mt-2 p-4 rounded-2xl bg-[#f7f5ef] border border-[#e5e9ea] text-slate-800 font-serif text-base sm:text-lg leading-relaxed">
                {trap.contextSentence ? (
                  trap.contextSentence.split('________').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      <span>{part}</span>
                      {i < arr.length - 1 && (
                        <span className="inline-block mx-1 px-3 py-0.5 rounded-lg border-2 border-dashed border-[#004646] bg-white font-mono font-bold text-[#004646]">
                          {isChecked ? trap.correct : '________'}
                        </span>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <p>{isEn ? 'Listen and identify the exact spelling:' : 'Nghe và xác định cách viết chính xác:'}</p>
                )}
              </div>
            </div>

            {/* Mode 1: Recognition Quiz */}
            {drillMode === 'quiz' && (
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-slate-500">
                  {isEn ? 'Choose the single accurate spelling (Keys 1-4):' : 'Chọn cách viết đúng (Phím 1-4):'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {options.map((opt, idx) => {
                    const isSelected = selectedChoice === opt;
                    const isThisCorrect = opt === trap.correct;

                    let cardStyle = 'bg-white hover:bg-slate-50 border-[#e5e9ea] text-slate-800';
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

            {/* Mode 2: Dictation Typing */}
            {drillMode === 'dictation' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1.5">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Listen and type the full word:' : 'Nghe và tự gõ đầy đủ các chữ cái:'}</span>
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
                    className="p-3.5 rounded-2xl bg-[#004646] text-white hover:bg-[#003838] transition cursor-pointer"
                    title="Replay audio (Space)"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Check Button */}
            {!isChecked && (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={drillMode === 'quiz' ? !selectedChoice : !dictationInput.trim()}
                className="px-6 py-3 rounded-2xl bg-[#004646] hover:bg-[#003838] disabled:opacity-40 text-white font-extrabold text-sm transition cursor-pointer shadow-md flex items-center space-x-2"
              >
                <span>{isEn ? 'Check Answer' : 'Kiểm tra đáp án'}</span>
                <span className="text-[11px] opacity-75 font-normal hidden sm:inline">(Enter)</span>
              </button>
            )}

            {/* Explanation & Mnemonic Card */}
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
                      ? (isEn ? 'Accurate Cambridge Spelling!' : 'Chính xác! Chuẩn chính tả Cambridge')
                      : (isEn ? `The correct spelling is: "${trap.correct}"` : `Cách viết đúng là: "${trap.correct}"`)}
                  </h4>
                </div>

                {trap.rule && (
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-700">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Examiner Mnemonic Trick:' : 'Mẹo ghi nhớ của giám khảo:'}</span>
                    </div>
                    <p className="leading-relaxed">{trap.rule}</p>
                  </div>
                )}

                {trap.explanation && (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <b className="text-slate-900">{isEn ? 'Root Analysis: ' : 'Phân tích gốc từ: '}</b>
                    {trap.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
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
          <span>{isEn ? 'Previous' : 'Câu trước'}</span>
        </button>

        <div className="text-xs font-bold text-slate-400 hidden sm:block">
          {currentIndex + 1} / {totalItems}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#004646] hover:bg-[#003838] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
        >
          <span>{isEn ? 'Next Trap' : 'Câu tiếp theo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
