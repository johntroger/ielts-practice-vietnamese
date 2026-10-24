import React from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Check, Sparkles, SkipForward } from 'lucide-react';
import { useTranslation } from '../../i18n';
import ArenaMediaViewer from './ArenaMediaViewer.jsx';
import ArenaTextInputCard from './ArenaTextInputCard.jsx';
import { ARENA_DIFFICULTY_CONFIG, ARENA_IELTS_TOPICS } from '../../utils/arenaStorageKeys.js';
import { getLocalizedArenaQuestion } from '../../data/arenaQuestionTranslations.js';
import { triggerHaptic } from '../../utils/hapticHelper.js';
import { getPerkById } from '../../services/gamification/tacticalPerksService.js';

/**
 * Renders question prompt with distinct bold styling for statements, quotes, and target terms.
 * Formats statements prominently in bold to distinguish from question instructions.
 */
function renderPromptWithFormattedStatement(prompt) {
  if (!prompt || typeof prompt !== 'string') return prompt;

  const quoteRegex = /"([^"]+)"|“([^”]+)”|'([^']+)'|‘([^’]+)’/g;
  if (!quoteRegex.test(prompt)) {
    return <span className="text-white font-bold">{prompt}</span>;
  }

  quoteRegex.lastIndex = 0;
  const tokens = [];
  let lastIdx = 0;
  let match;
  let count = 0;

  while ((match = quoteRegex.exec(prompt)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(
        <span key={`text-${count++}`} className="text-slate-200 font-semibold">
          {prompt.slice(lastIdx, match.index)}
        </span>
      );
    }
    const quotedStatement = match[1] || match[2] || match[3] || match[4] || match[0];
    tokens.push(
      <strong
        key={`statement-${count++}`}
        className="font-black text-amber-200 bg-amber-950/70 border-2 border-amber-500/60 px-2.5 sm:px-3 py-0.5 rounded-lg inline-block mx-1 shadow-md tracking-wide text-lg sm:text-xl md:text-2xl"
      >
        "{quotedStatement}"
      </strong>
    );
    lastIdx = quoteRegex.lastIndex;
  }

  if (lastIdx < prompt.length) {
    tokens.push(
      <span key={`text-${count++}`} className="text-slate-200 font-semibold">
        {prompt.slice(lastIdx)}
      </span>
    );
  }

  return <span>{tokens}</span>;
}

/**
 * Renders context with explicit distinction between Reading Passage, Statement to evaluate,
 * Category pills, and Bracketed spelling cues.
 */
function renderFormattedContext(activeContext, isEn) {
  if (!activeContext || typeof activeContext !== 'string') return activeContext;

  // 1. Category metadata context (e.g. "Category: Clarity & Perception")
  if (/^Category:\s*/i.test(activeContext) || /^Chủ đề:\s*/i.test(activeContext)) {
    const categoryName = activeContext.replace(/^(?:Category|Chủ đề):\s*/i, '').trim();
    return (
      <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/50 border border-indigo-700/50 px-3 py-1 rounded-lg w-fit font-medium shadow-xs">
        <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
          📁 {isEn ? 'Category / Domain:' : 'Chủ đề từ vựng:'}
        </span>
        <span className="font-bold text-indigo-200 text-xs sm:text-sm">{categoryName}</span>
      </div>
    );
  }

  // 2. Reading TFNG: Passage followed by Statement
  const statementRegex = /(?:Statement|Nhận định):\s*["“]?([^"”\r\n]+)["”]?/i;
  const statementMatch = activeContext.match(statementRegex);

  if (statementMatch) {
    const rawStatement = statementMatch[1].trim();
    const passageText = activeContext.replace(/(?:\r?\n\r?\n|\r?\n)?(?:Statement|Nhận định):\s*["“]?[^"”\r\n]+["”]?/i, '').trim();

    return (
      <div className="flex flex-col gap-2.5">
        {passageText && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-slate-200 font-serif leading-relaxed max-h-40 overflow-y-auto shadow-inner">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 mb-1.5 font-sans">
              <span>📖</span>
              <span>{isEn ? 'Reading Passage:' : 'Đoạn Văn Đọc Hiểu:'}</span>
            </span>
            <p>{passageText}</p>
          </div>
        )}

        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/50 border-2 border-amber-500/70 shadow-lg flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
            <span>📌</span>
            <span>{isEn ? 'Statement to Evaluate (In Đậm):' : 'Nhận Định Cần Đánh Giá (Statement - In Đậm):'}</span>
          </div>
          <p className="text-base sm:text-lg md:text-xl font-black text-amber-100 font-sans tracking-wide leading-snug">
            "{rawStatement}"
          </p>
        </div>
      </div>
    );
  }

  // 3. Bracketed cues [Wenesday] in Spelling / Vocabulary sentence
  // Note: activeContext.split(/(\[[^\]]+\])/g) is preserved for testing suite compatibility
  if (activeContext.includes('[') && activeContext.includes(']')) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-slate-200 font-serif leading-relaxed max-h-48 overflow-y-auto">
        <span>
          {activeContext.split(/(\[[^\]]+\])/g).map((part, idx) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              return (
                <span
                  key={idx}
                  className="mx-1 px-2.5 py-1 rounded-lg bg-rose-950/80 border-2 border-rose-500 text-rose-200 font-mono font-black text-base sm:text-lg inline-flex items-center gap-1.5 shadow-md"
                >
                  <span className="text-xs">⚠️</span>
                  <span className="line-through">{part}</span>
                </span>
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </span>
      </div>
    );
  }

  // 4. Default reading or context snippet
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-slate-200 font-serif leading-relaxed max-h-48 overflow-y-auto">
      {activeContext}
    </div>
  );
}

/**
 * src/components/arena/ArenaQuestionCard.jsx
 * 
 * High-Speed Reflex Question Card for Atlas English Arena.
 * Features:
 * - Expanded widescreen viewport (max-w-2xl sm:max-w-3xl lg:max-w-5xl)
 * - Enlarged, highly legible typography for speed reading
 * - Bold, high-contrast statements to clearly distinguish from question instructions
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
  equippedPerk = 'none',
  isPerkUsed = false,
  eliminatedOptions = [],
  onActivatePerk,
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
  const perkInfo = getPerkById(equippedPerk);

  return (
    <div className={`w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl mx-auto flex flex-col gap-2 sm:gap-2.5 py-0.5 transition-all duration-300 ${
      question.isBossQuestion ? 'rounded-2xl p-2 sm:p-2.5 bg-gradient-to-b from-amber-950/20 via-slate-900/40 to-purple-950/25 border-2 border-amber-500/40 shadow-xl shadow-amber-950/30 ring-1 ring-amber-400/30' : ''
    }`}>
      {/* Category Pill, Topic, Difficulty & Audio Button */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className={`text-xs font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg border shadow-xs ${categoryColor}`}>
            {localizedQ.skillCategory?.toUpperCase() || 'PRACTICE'}
          </span>

          {diffConfig && (
            <span className={`text-xs font-extrabold tracking-wider px-2.5 py-1 rounded-lg border shadow-xs ${diffConfig.badgeClass}`}>
              {diffConfig.targetBand}
            </span>
          )}

          {topicObj && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-1.5 shadow-xs">
              <span className="text-xs sm:text-sm">{topicObj.icon}</span>
              <span>{isEn ? topicObj.nameEn : topicObj.nameVi}</span>
            </span>
          )}

          {equippedPerk && equippedPerk !== 'none' && (
            <span className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-lg border shadow-xs flex items-center gap-1.5 ${perkInfo.badgeColor}`}>
              <span>{perkInfo.icon}</span>
              <span>{isEn ? perkInfo.nameEn : perkInfo.nameVi}</span>
              {isPerkUsed && <span className="opacity-60 text-[10px]">({isEn ? 'Used' : 'Đã dùng'})</span>}
            </span>
          )}

          {question.isBossQuestion && (
            <span className="text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-amber-500/30 text-amber-300 border border-amber-400/60 flex items-center gap-1.5 shadow-sm shadow-amber-500/20 animate-pulse">
              <span>👑</span>
              <span>{t('arena.bossClimaxBadge') || (isEn ? 'CAMBRIDGE BOSS CLIMAX (x2 XP)' : 'TRÙM CUỐI CAMBRIDGE (x2 XP)')}</span>
            </span>
          )}

          {(question.isR2Audio || question.audioUrl) && (
            <span className="text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 flex items-center gap-1.5 shadow-xs">
              <span>🎧</span>
              <span>{question.trackLabel || (isEn ? 'CAMBRIDGE STUDIO AUDIO' : 'AUDIO THỰC CHIẾN CAMBRIDGE')}</span>
            </span>
          )}

          {question.isRevengeQuestion && (
            <span className="text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 animate-pulse shadow-xs">
              <span>⚡</span>
              <span>{isEn ? 'REVENGE (+5 XP)' : 'CÂU PHỤC THÙ (+5 XP)'}</span>
            </span>
          )}
        </div>

        {(localizedQ.audioText || question.audioUrl) && (
          <button
            type="button"
            onClick={() => onPlayAudio?.(localizedQ.audioText, question)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/35 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('arena.playAudio') || (isEn ? 'Play Audio (Space)' : 'Nghe Audio (Phím cách)')}</span>
          </button>
        )}
      </div>

      {/* Main Prompt with Highlighted Statements */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 leading-snug tracking-tight">
        {renderPromptWithFormattedStatement(promptText || question.prompt)}
      </h2>

      {/* Context, Reading Passage, or Statement Section: Hidden for Listening questions while answering to prevent transcript spoiler */}
      {question.context && !isListening && (
        <div className="w-full">
          {renderFormattedContext(activeContext, isEn)}
        </div>
      )}

      {/* Listening Note/Form Completion snippet */}
      {isListening && (question.formStem || localizedQ.formStem) && (
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3 text-sm sm:text-base font-mono text-amber-200 flex items-center gap-2 shadow-md">
          <span className="text-amber-400 font-bold text-base sm:text-lg">📋 Note:</span>
          <span className="font-bold">{isEn ? (question.formStem || localizedQ.formStem) : (question.formStemVi || localizedQ.formStemVi || question.formStem)}</span>
        </div>
      )}

      {/* Listening Audio Prompt Helper Banner (When answering listening questions) */}
      {isListening && !isAnswerChecked && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-amber-200/90 shadow-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-medium">
              {question.audioUrl
                ? (isEn ? '🎧 Cloudflare R2 Studio Audio: Listen carefully to the recording clip to answer.' : '🎧 Audio Thực Chiến (Cloudflare R2): Hãy lắng nghe đoạn băng gốc để chọn đáp án.')
                : (isEn ? '🎧 Listening Task: Focus on the audio track to find the answer.' : '🎧 Bài nghe: Hãy chú ý lắng nghe đoạn băng để chọn đáp án đúng.')}
            </span>
          </div>
          {(question.audioText || question.audioUrl) && (
            <button
              type="button"
              onClick={() => onPlayAudio?.(question.audioText, question)}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-md font-bold text-xs transition-colors cursor-pointer shrink-0"
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
        <div className={`grid gap-2 sm:gap-2.5 ${
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
            const isEliminated = Array.isArray(eliminatedOptions) && eliminatedOptions.includes(idx);
            
            let btnStyle = 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-100 hover:border-slate-500 cursor-pointer shadow-[0_3px_0_0_#1e293b] active:shadow-none active:translate-y-[2px]';
            if (isEliminated) {
              btnStyle = 'opacity-35 line-through bg-slate-950/70 border-slate-800 text-slate-500 cursor-not-allowed pointer-events-none shadow-none';
            } else if (isSelected && !isAnswerChecked) {
              btnStyle = 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-500/50 cursor-pointer shadow-[0_3px_0_0_#4338ca] translate-y-[1px]';
            } else if (isAnswerChecked) {
              if (isOptionCorrect) {
                btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/50 font-bold cursor-default shadow-[0_3px_0_0_#059669] translate-y-[1px]';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-red-600/30 border-red-400 text-red-100 ring-2 ring-red-500/50 cursor-default shadow-[0_3px_0_0_#dc2626] translate-y-[1px]';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-50 cursor-default shadow-none';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerChecked || isEliminated}
                onClick={() => {
                  triggerHaptic('chipTap');
                  onSelectOption?.(idx);
                }}
                className={`group flex items-center justify-between py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border text-left transition-all active:scale-[0.99] select-none ${btnStyle}`}
              >
                <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-700/60 group-hover:bg-slate-700 flex items-center justify-center text-xs sm:text-sm font-mono font-black text-slate-200 shrink-0 transition-colors shadow-xs">
                    {idx + 1}
                  </span>
                  <span className={`text-sm sm:text-base md:text-lg font-semibold leading-normal break-words ${isSpelling ? 'font-mono tracking-wide' : ''}`}>
                    {optText}
                  </span>
                </div>

                {isEliminated && (
                  <span className="text-[10px] sm:text-xs font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/80 shrink-0 ml-2">
                    🚫 {isEn ? 'TRAP REMOVED' : 'ĐÃ TRIỆT TIÊU'}
                  </span>
                )}
                {isAnswerChecked && isOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 ml-2 animate-in zoom-in-75 duration-200" />
                )}
                {isAnswerChecked && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0 ml-2 animate-in zoom-in-75 duration-200" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Explanation Box */}
      {isAnswerChecked && (
        <div className={`p-4 sm:p-4.5 rounded-xl border text-xs sm:text-sm leading-relaxed shadow-md ${
          isSkipped
            ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
            : isCorrect 
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' 
              : 'bg-red-950/30 border-red-800/50 text-red-300'
        }`}>
          <div className="font-extrabold text-sm sm:text-base flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              {isSkipped ? (
                <>
                  <SkipForward className="w-4 h-4 text-amber-400" />
                  <span>{t('arena.questionSkipped') || (isEn ? 'Question Skipped' : 'Đã Bỏ Qua Câu Hỏi')}</span>
                </>
              ) : isCorrect ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t('arena.correct') || (isEn ? 'Correct!' : 'Chính xác!')}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>{t('arena.incorrect') || (isEn ? 'Incorrect' : 'Chưa chính xác')}</span>
                </>
              )}
            </div>
            {isCorrect && question.isBossQuestion && (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-amber-500/30 text-amber-300 text-[11px] font-black border border-amber-400/60 shadow-xs flex items-center gap-1 animate-bounce">
                👑 {t('arena.bossSlayerTitle') || (isEn ? 'BOSS SLAYER! (x2 XP)' : 'DIỆT TRÙM THÀNH CÔNG! (x2 XP)')}
              </span>
            )}
            {isCorrect && question.isRevengeQuestion && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/40 animate-pulse">
                ⚡ {isEn ? 'Revenge Cleared! (+5 XP)' : 'Phục Thù Thành Công! (+5 XP)'}
              </span>
            )}
          </div>

          {/* Reveal Audio Transcript only on Review/Explanation phase */}
          {isListening && (question.context || question.audioText) && (
            <div className="my-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-200 font-sans leading-relaxed">
              <span className="font-bold text-amber-300 block mb-0.5">🎧 {isEn ? 'Audio Transcript:' : 'Lời thoại đoạn nghe:'}</span>
              <p className="italic text-slate-300">"{activeContext || localizedQ.audioText || question.audioText}"</p>
            </div>
          )}

          <p className="text-slate-300 text-xs mt-1 leading-relaxed">{localizedQ.explanation}</p>
        </div>
      )}

      {/* 2-Step Action CTA & Skip Button & Active Perk Trigger */}
      <div className="mt-1 sm:mt-1.5 flex flex-wrap items-center justify-between gap-2.5">
        {!isAnswerChecked ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => (onSkipQuestion || onSkip)?.()}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer select-none active:scale-95 shadow-xs"
                title={isEn ? "Don't know this answer? Skip to reveal explanation (Esc)" : "Không biết câu này? Bỏ qua để xem đáp án (Esc)"}
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                <span>{t('arena.skipQuestion') || (isEn ? 'Skip (Esc)' : 'Bỏ Qua (Esc)')}</span>
              </button>

              {/* Active Perk Trigger Button */}
              {equippedPerk && equippedPerk !== 'none' && equippedPerk !== 'titan_armor' && !isPerkUsed && !(equippedPerk === 'oracle_insight' && isTextInput) && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('combo');
                    onActivatePerk?.();
                  }}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer select-none active:scale-95 shadow-md ${
                    equippedPerk === 'chronos_freeze'
                      ? 'border-amber-400/80 bg-gradient-to-r from-amber-600/30 to-amber-500/20 text-amber-200 hover:bg-amber-500/30 ring-1 ring-amber-400/50 animate-pulse'
                      : 'border-purple-400/80 bg-gradient-to-r from-purple-600/30 to-indigo-500/20 text-purple-200 hover:bg-purple-500/30 ring-1 ring-purple-400/50 animate-pulse'
                  }`}
                  title={isEn ? perkInfo.descEn : perkInfo.descVi}
                >
                  <span>{perkInfo.icon}</span>
                  <span>
                    {equippedPerk === 'chronos_freeze'
                      ? (isEn ? 'Freeze (+15s)' : 'Đóng Băng (+15s)')
                      : (isEn ? 'Eliminate Trap' : 'Triệt Tiêu Bẫy')}
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={isTextInput ? !userInputText?.trim() : selectedOption === null}
              onClick={() => handleCheck?.()}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed cursor-pointer text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all select-none w-full sm:w-auto sm:ml-auto active:scale-95"
            >
              <span>{t('arena.checkAnswer') || (isEn ? 'Check Answer' : 'Kiểm Tra Đáp Án')} (Enter)</span>
            </button>
          </>
        ) : (
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => onNextQuestion?.()}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all select-none w-full sm:w-auto active:scale-95"
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
