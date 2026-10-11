import React from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaQuestionCard.jsx
 * 
 * High-Speed Reflex Question Card for Atlas English Arena.
 * Features:
 * - Keyboard badges 1-4 for instant answer selection
 * - Dual-color review state (Green for correct, Red for error)
 * - TTS Audio button for listening and spelling questions
 * - Clear Cambridge examiner reasoning explanation box
 */
export default function ArenaQuestionCard({
  question,
  selectedOption = null,
  isAnswerChecked = false,
  isCorrect = null,
  onSelectOption,
  onCheckAnswer,
  onNextQuestion,
  onPlayAudio
}) {
  const { t } = useTranslation();

  if (!question) return null;

  const categoryColor = {
    vocab: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    reading: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    listening: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  }[question.skillCategory] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 py-4">
      {/* Category Pill & Audio Button */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${categoryColor}`}>
          {question.skillCategory?.toUpperCase() || 'PRACTICE'}
        </span>

        {question.audioText && (
          <button
            type="button"
            onClick={() => onPlayAudio?.(question.audioText)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Play Audio (Space)</span>
          </button>
        )}
      </div>

      {/* Main Prompt */}
      <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
        {question.prompt}
      </h2>

      {/* Context or Reading Snippet */}
      {question.context && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-sm text-slate-300 font-serif leading-relaxed max-h-48 overflow-y-auto">
          {question.context}
        </div>
      )}

      {/* Option Cards */}
      <div className="grid grid-cols-1 gap-2.5">
        {question.options.map((optText, idx) => {
          const isSelected = selectedOption === idx;
          const isOptionCorrect = idx === question.correctIndex;
          
          let btnStyle = 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/70 text-slate-200';
          if (isSelected && !isAnswerChecked) {
            btnStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30';
          } else if (isAnswerChecked) {
            if (isOptionCorrect) {
              btnStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-red-600/20 border-red-500 text-red-200 ring-2 ring-red-500/30';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
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
                <span className="w-6 h-6 rounded-md bg-slate-700/60 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium">{optText}</span>
              </div>

              {isAnswerChecked && isOptionCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {isAnswerChecked && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswerChecked && (
        <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
          isCorrect 
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' 
            : 'bg-red-950/30 border-red-800/50 text-red-300'
        }`}>
          <div className="font-bold flex items-center gap-1.5 mb-1">
            {isCorrect ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{isCorrect ? t('arena.correct') : t('arena.incorrect')}</span>
          </div>
          <p className="text-slate-300 text-xs mt-1">{question.explanation}</p>
        </div>
      )}

      {/* 2-Step Action CTA */}
      <div className="mt-2 flex justify-end">
        {!isAnswerChecked ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={onCheckAnswer}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            <span>Check Answer (Enter)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextQuestion}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <span>{t('arena.nextQuestion')} (Enter)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
