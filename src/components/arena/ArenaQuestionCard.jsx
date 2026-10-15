import React from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Check, Sparkles, SkipForward } from 'lucide-react';
import { useTranslation } from '../../i18n';
import ArenaMediaViewer from './ArenaMediaViewer.jsx';
import ArenaTextInputCard from './ArenaTextInputCard.jsx';
import { ARENA_DIFFICULTY_CONFIG, ARENA_IELTS_TOPICS } from '../../utils/arenaStorageKeys.js';
import { getLocalizedArenaQuestion } from '../../data/arenaQuestionTranslations.js';

/**
 * src/components/arena/ArenaQuestionCard.jsx
 * 
 * High-Speed Reflex Question Card for Atlas English Arena.
 * Features:
 * - Keyboard badges 1-4 for instant answer selection
 * - Dual-color review state (Green for correct, Red for error)
 * - TTS Audio button for listening and spelling questions
 * - Rich Multimedia Support: Charts, Maps, and Process Diagrams
 * - Type-in-the-word interactive exercise card with Cambridge validator diffing
 * - Skip button for graceful question surrender (Esc) with examiner learning review
 * - Clear Cambridge examiner reasoning explanation box
 */
export default function ArenaQuestionCard({
  question,
  selectedOption = null,
  userInputText = '',
  onUserInputChange,
  validationResult = null,
  isAnswerChecked = false,
  isCorrect = null,
  isSkipped = false,
  nearMissState = null,
  onSelectOption,
  onCheckAnswer,
  onSubmitAnswer,
  onSkipQuestion,
  onSkip,
  onNextQuestion,
  onPlayAudio
}) {
  const { t, isEn } = useTranslation();

  if (!question) return null;

  const localizedQ = getLocalizedArenaQuestion(question, isEn);
  const promptText = localizedQ?.prompt || question.prompt;
  const handleCheck = onCheckAnswer || onSubmitAnswer;

  const categoryColor = {
    vocab: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    reading: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    listening: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    visual_data: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  }[localizedQ.skillCategory] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  const diffConfig = ARENA_DIFFICULTY_CONFIG[localizedQ.difficulty] || ARENA_DIFFICULTY_CONFIG.medium;
  const topicObj = ARENA_IELTS_TOPICS.find(tp => tp.id === localizedQ.topic);
  const isListening = question.skillCategory === 'listening' || question.type === 'listening_trap' || Boolean(question.audioText);
  const activeContext = localizedQ.context || question.context;
  const isTextInput = question.interactionType === 'text_input';

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 py-1">
      {/* Category Pill, Topic, Difficulty & Audio Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${categoryColor}`}>
            {localizedQ.skillCategory?.toUpperCase() || 'PRACTICE'}
          </span>

          {diffConfig && (
            <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md border ${diffConfig.badgeClass}`}>
              {diffConfig.targetBand}
            </span>
          )}

          {topicObj && (
            <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-1">
              <span>{topicObj.icon}</span>
              <span>{isEn ? topicObj.nameEn : topicObj.nameVi}</span>
            </span>
          )}

          {question.isRevengeQuestion && (
            <span className="text-[11px] font-black tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 animate-pulse">
              <span>⚡</span>
              <span>{isEn ? 'REVENGE (+5 XP)' : 'CÂU PHỤC THÙ (+5 XP)'}</span>
            </span>
          )}
        </div>

        {localizedQ.audioText && (
          <button
            type="button"
            onClick={() => onPlayAudio?.(localizedQ.audioText)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('arena.playAudio') || (isEn ? 'Play Audio (Space)' : 'Nghe Audio (Phím cách)')}</span>
          </button>
        )}
      </div>

      {/* Main Prompt */}
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 leading-snug">
        {promptText || question.prompt}
      </h2>

      {/* Context or Reading Snippet: Hidden for Listening questions while answering to prevent transcript spoiler */}
      {question.context && !isListening && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-sm text-slate-300 font-serif leading-relaxed max-h-36 overflow-y-auto">
          {typeof activeContext === 'string' && activeContext.includes('[') && activeContext.includes(']') ? (
            <span>
              {activeContext.split(/(\[[^\]]+\])/g).map((part, idx) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  return (
                    <span
                      key={idx}
                      className="mx-1 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/60 text-rose-300 font-mono font-bold inline-flex items-center gap-1 shadow-xs"
                    >
                      <span className="text-xs">⚠️</span>
                      <span>{part}</span>
                    </span>
                  );
                }
                return <span key={idx}>{part}</span>;
              })}
            </span>
          ) : (
            activeContext
          )}
        </div>
      )}

      {/* Listening Note/Form Completion snippet */}
      {isListening && (question.formStem || localizedQ.formStem) && (
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3 text-sm font-mono text-amber-200 flex items-center gap-2">
          <span className="text-amber-400 font-bold">📋 Note:</span>
          <span>{isEn ? (question.formStem || localizedQ.formStem) : (question.formStemVi || localizedQ.formStemVi || question.formStem)}</span>
        </div>
      )}

      {/* Listening Audio Prompt Helper Banner (When answering listening questions) */}
      {isListening && !isAnswerChecked && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-amber-200/90">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>{isEn ? '🎧 Listening Task: Focus on the audio track to find the answer.' : '🎧 Bài nghe: Hãy chú ý lắng nghe đoạn băng để chọn đáp án đúng.'}</span>
          </div>
          {question.audioText && (
            <button
              type="button"
              onClick={() => onPlayAudio?.(question.audioText)}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-md font-medium text-[11px] transition-colors cursor-pointer"
            >
              {isEn ? 'Replay Audio' : 'Nghe lại'}
            </button>
          )}
        </div>
      )}

      {/* Rich Multimedia Asset (Chart, Map, Diagram) */}
      {question.media && (
        <ArenaMediaViewer media={question.media} />
      )}

      {/* Option Cards or Text Input Card */}
      {isTextInput ? (
        <ArenaTextInputCard
          question={question}
          userInputText={userInputText}
          onUserInputChange={onUserInputChange}
          isAnswerChecked={isAnswerChecked}
          isCorrect={isCorrect}
          isSkipped={isSkipped}
          nearMissState={nearMissState}
          validationResult={validationResult}
          onCheckAnswer={handleCheck}
          onSkip={onSkipQuestion || onSkip}
        />
      ) : (
        /* Option Cards: Adaptive Grid (3-column for TFNG / 3 options, 1-column or 2-column for others) */
        <div className={`grid gap-2.5 ${
          question.options.length === 3 
            ? 'grid-cols-1 sm:grid-cols-3' 
            : question.options.length === 2 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1'
        }`}>
          {question.options.map((optText, idx) => {
            const isSelected = selectedOption === idx;
            const isOptionCorrect = idx === question.correctIndex;
            const isSpelling = question.type === 'spelling' || question.skillCategory === 'spelling';
            
            let btnStyle = 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/70 text-slate-200 cursor-pointer';
            if (isSelected && !isAnswerChecked) {
              btnStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 cursor-pointer';
            } else if (isAnswerChecked) {
              if (isOptionCorrect) {
                btnStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30 font-semibold cursor-default';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-red-600/20 border-red-500 text-red-200 ring-2 ring-red-500/30 cursor-default';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60 cursor-default';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerChecked}
                onClick={() => onSelectOption?.(idx)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-700/60 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                    {idx + 1}
                  </span>
                  <span className={`text-sm font-medium ${isSpelling ? 'font-mono tracking-wide' : ''}`}>
                    {optText}
                  </span>
                </div>

                {isAnswerChecked && isOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswerChecked && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Explanation Box */}
      {isAnswerChecked && (
        <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
          isSkipped
            ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
            : isCorrect 
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' 
              : 'bg-red-950/30 border-red-800/50 text-red-300'
        }`}>
          <div className="font-bold flex items-center justify-between gap-1.5 mb-1">
            <div className="flex items-center gap-1.5">
              {isSkipped ? (
                <>
                  <SkipForward className="w-4 h-4 text-amber-400" />
                  <span>{t('arena.questionSkipped') || (isEn ? 'Question Skipped' : 'Đã Bỏ Qua Câu Hỏi')}</span>
                </>
              ) : isCorrect ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('arena.correct') || (isEn ? 'Correct!' : 'Chính xác!')}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>{t('arena.incorrect') || (isEn ? 'Incorrect' : 'Chưa chính xác')}</span>
                </>
              )}
            </div>
            {isCorrect && question.isRevengeQuestion && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/40 animate-pulse">
                ⚡ {isEn ? 'Revenge Cleared! (+5 XP)' : 'Phục Thù Thành Công! (+5 XP)'}
              </span>
            )}
          </div>

          {/* Reveal Audio Transcript only on Review/Explanation phase */}
          {isListening && (question.context || question.audioText) && (
            <div className="my-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-slate-200 font-sans leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-1">🎧 {isEn ? 'Audio Transcript:' : 'Lời thoại đoạn nghe:'}</span>
              <p className="italic text-slate-300">"{activeContext || localizedQ.audioText || question.audioText}"</p>
            </div>
          )}

          <p className="text-slate-300 text-xs mt-1">{localizedQ.explanation}</p>
        </div>
      )}

      {/* 2-Step Action CTA & Skip Button */}
      <div className="mt-2 flex items-center justify-between gap-3">
        {!isAnswerChecked ? (
          <>
            <button
              type="button"
              onClick={() => (onSkipQuestion || onSkip)?.()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none"
              title={isEn ? "Don't know this answer? Skip to reveal explanation (Esc)" : "Không biết câu này? Bỏ qua để xem đáp án (Esc)"}
            >
              <SkipForward className="w-4 h-4 text-slate-400" />
              <span>{t('arena.skipQuestion') || (isEn ? 'Skip (Esc)' : 'Bỏ Qua (Esc)')}</span>
            </button>

            <button
              type="button"
              disabled={isTextInput ? !userInputText?.trim() : selectedOption === null}
              onClick={() => handleCheck?.()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all select-none ml-auto"
            >
              <span>{t('arena.checkAnswer') || (isEn ? 'Check Answer' : 'Kiểm Tra Đáp Án')} (Enter)</span>
            </button>
          </>
        ) : (
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => onNextQuestion?.()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all select-none"
            >
              <span>{t('arena.nextQuestion') || (isEn ? 'Next Question' : 'Câu Tiếp Theo')} (Enter)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
