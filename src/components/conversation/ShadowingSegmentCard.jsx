import React from 'react';
import {
  Volume2,
  Mic,
  Lock,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Eye,
  EyeOff,
  Headphones,
  ArrowRight,
  SkipForward,
  AlertCircle,
  Zap,
  GraduationCap,
  ArrowLeftRight
} from 'lucide-react';
import SpeechWaveVisualizer from '../speaking/SpeechWaveVisualizer';
import { expandConversationalTokens } from '../../data/pronunciationData';
import { maskToKeywords } from '../../utils/speakingPracticeHelpers';

function ShadowingSegmentCard({
  segment,
  segmentIndex,
  totalSegments,
  status, // 'past_done' | 'active' | 'locked'
  phase, // 'idle' | 'machine_reading' | 'user_shadowing'
  isMachineSpeakingNow,
  showIntonation,
  keywordsOnly,
  playbackSpeed = 0.85,
  revealThisSeg,
  onToggleRevealThisSeg,
  onPlayModel,
  onSkipReadingToSpeak,
  // Active shadowing props
  isListening,
  isAutoMode,
  liveSpokenText,
  isWaitingForRetrySpeech,
  speechError,
  analyserNode,
  micLevel = 0,
  hasAnalyser = false,
  evaluationResult,
  attemptCount,
  passThreshold,
  currentAudioClip,
  isPlayingUserClip,
  isComparingAudio = false,
  onToggleRecording,
  onReplayUserClip,
  onCompareAudio,
  onListenAndRetry,
  onSkipSegment,
  onAdvanceAfterPass,
  showManualFallback,
  onToggleManualFallback,
  manualSpokenInput,
  onChangeManualSpokenInput,
  onRunManualEvaluation,
  // Layer 2 AI Deep Check
  apiKey,
  isDeepAiGrading,
  deepAiError,
  onDeepAiAudioCheck,
  isEn
}) {
  const wordCount = String(segment?.text || '').trim().split(/\s+/).filter(Boolean).length;
  const isPromptCue = segment?.unitType === 'prompt_only';
  const isParagraph = segment?.unitType === 'paragraph';

  const unitBadgeLabel = isPromptCue
    ? isEn ? 'Examiner Prompt' : 'Câu hỏi Giám khảo'
    : isParagraph
    ? isEn ? `Paragraph • ${wordCount}w` : `Đoạn • ${wordCount} từ`
    : isEn ? `1 Sentence • ${wordCount}w` : `1 Câu • ${wordCount} từ`;

  // 1. FUTURE LOCKED SEGMENT
  if (status === 'locked') {
    return (
      <div className={`flex ${isPromptCue ? 'justify-start' : 'justify-end'} opacity-45 select-none`}>
        <div className="max-w-[90%] sm:max-w-[78%] px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-semibold">
            {isEn
              ? `#${segmentIndex + 1} (${unitBadgeLabel}) — Pass current segment (≥${passThreshold}%) to unlock`
              : `#${segmentIndex + 1} (${unitBadgeLabel}) — Đạt chuẩn đoạn hiện tại (≥${passThreshold}%) để mở khóa`}
          </span>
        </div>
      </div>
    );
  }

  // 2. EXAMINER PROMPT CUE (Machine reads to set context, auto-advances without requiring repeat)
  if (isPromptCue) {
    const isActivePrompt = status === 'active';
    return (
      <div className="flex justify-start animate-in fade-in duration-200">
        <div
          className={`max-w-[94%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-2xl rounded-tl-sm border transition-all space-y-2 ${
            isActivePrompt
              ? 'bg-indigo-950/65 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30'
              : 'bg-slate-900/85 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-black text-indigo-300 truncate">
                {isEn ? segment.phaseLabelEn || 'Examiner Prompt' : segment.phaseLabelVi || 'Câu hỏi Giám khảo'}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                #{segmentIndex + 1}/{totalSegments}
              </span>
              {isActivePrompt && isMachineSpeakingNow && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white animate-pulse">
                  {isEn ? 'Asking...' : 'Đang hỏi...'}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => onPlayModel(segment, null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                title={isEn ? `Listen (${playbackSpeed}x)` : `Nghe (${playbackSpeed}x)`}
              >
                <Volume2 className="w-3 h-3" />
                <span>{isEn ? `Listen (${playbackSpeed}x)` : `Nghe (${playbackSpeed}x)`}</span>
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {segment.text}
          </p>

          {showIntonation && segment.intonationText && (
            <p className="text-xs font-mono text-amber-200/90 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
              {segment.intonationText}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. PAST COMPLETED SHADOW SEGMENT
  if (status === 'past_done') {
    const acc = evaluationResult?.overallAccuracy ?? 0;
    const isSkipped = Boolean(evaluationResult?.skipped);
    return (
      <div className="flex justify-end animate-in fade-in duration-150">
        <div className="max-w-[94%] sm:max-w-[85%] p-3.5 rounded-2xl rounded-tr-sm bg-emerald-950/35 border border-emerald-500/35 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-bold">
                {unitBadgeLabel}
              </span>
              <span className="text-xs font-black text-emerald-300">
                {isEn ? segment.phaseLabelEn : segment.phaseLabelVi}
              </span>
              {isSkipped ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                  {isEn ? 'Skipped (0 XP)' : 'Đã bỏ qua (0 XP)'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{acc}% • Band {evaluationResult?.estimatedBand || '7.0'}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              {currentAudioClip?.url && (
                <button
                  type="button"
                  onClick={() => onReplayUserClip(segment.id)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                >
                  {isPlayingUserClip ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isEn ? 'Your Voice' : 'Giọng bạn'}</span>
                </button>
              )}
              {currentAudioClip?.url && onCompareAudio && (
                <button
                  type="button"
                  onClick={() => onCompareAudio(segment)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                    isComparingAudio
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                  }`}
                  title={isEn ? 'Play model then your voice back-to-back' : 'Nghe đối chiếu giọng mẫu nối tiếp giọng bạn'}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>{isComparingAudio ? (isEn ? 'Comparing...' : 'Đang đối chiếu...') : (isEn ? 'Compare' : 'So sánh')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onPlayModel(segment, null)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isEn ? 'Model' : 'Mẫu'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
            {segment.text}
          </p>
        </div>
      </div>
    );
  }

  // 4. ACTIVE SHADOWING SPOTLIGHT CARD
  const displayScript =
    keywordsOnly && !revealThisSeg ? maskToKeywords(segment.text) : segment.text;

  const spokenSet = new Set(expandConversationalTokens(liveSpokenText || ''));

  const isReadingPhase = phase === 'machine_reading' || isMachineSpeakingNow;

  return (
    <div className="flex justify-end animate-in fade-in duration-200">
      <div
        className={`w-full sm:max-w-[94%] p-4 sm:p-5 rounded-3xl border transition-all space-y-3.5 shadow-xl ${
          isReadingPhase
            ? 'bg-gradient-to-br from-cyan-950/60 via-slate-950 to-indigo-950/50 border-cyan-500/70 ring-2 ring-cyan-500/25'
            : isListening
            ? 'bg-slate-950 border-emerald-500/75 ring-2 ring-emerald-500/25 shadow-emerald-950/30'
            : evaluationResult?.isPassed
            ? 'bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-900 border-emerald-500/60'
            : 'bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/35 border-amber-500/45'
        }`}
      >
        {/* Top Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                isParagraph
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {unitBadgeLabel}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {isEn ? segment.phaseLabelEn : segment.phaseLabelVi}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {isEn ? `Pass ≥ ${passThreshold}%` : `Đạt ≥ ${passThreshold}%`}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {keywordsOnly && (
              <button
                type="button"
                onClick={onToggleRevealThisSeg}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
              >
                {revealThisSeg ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{revealThisSeg ? (isEn ? 'Hide' : 'Ẩn') : (isEn ? 'Reveal' : 'Xem')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onPlayModel(segment, null)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/45 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
              title={isEn ? 'Listen to model at selected speed' : 'Nghe mẫu theo tốc độ đã chọn'}
            >
              <Headphones className="w-3 h-3" />
              <span>{isEn ? `Hear Model (${playbackSpeed}x)` : `Nghe mẫu (${playbackSpeed}x)`}</span>
            </button>

            <button
              type="button"
              onClick={onToggleManualFallback}
              className="text-[11px] text-slate-400 hover:text-indigo-300 underline cursor-pointer px-1"
            >
              {isEn ? 'Text Test?' : 'Nhập thử?'}
            </button>
          </div>
        </div>

        {/* Listen vs Repeat Phase Banner */}
        {isReadingPhase ? (
          <div className="px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-cyan-200">
            <span className="flex items-center space-x-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              <span>
                {isEn
                  ? 'Listen carefully — Machine is reading this segment...'
                  : 'Hãy lắng nghe — Máy đang đọc mẫu đoạn này...'}
              </span>
            </span>
            <button
              type="button"
              onClick={onSkipReadingToSpeak}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black cursor-pointer"
            >
              {isEn ? 'Speak Now' : 'Đọc Ngay'}
            </button>
          </div>
        ) : phase === 'user_shadowing' && !evaluationResult?.isPassed ? (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] sm:text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isEn
                ? 'Your turn — Repeat this segment clearly to unlock the next part.'
                : 'Đến lượt bạn — Hãy lặp lại rõ ràng đoạn này để mở khóa phần tiếp theo.'}
            </span>
          </div>
        ) : null}

        {/* Target Script with Live Word Highlight while Shadowing */}
        <div className="space-y-2">
          {isListening && !keywordsOnly && liveSpokenText ? (
            <p className="text-base sm:text-xl font-black leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
              {segment.text.split(/\s+/).map((w, idx) => {
                const expandedTokens = expandConversationalTokens(w);
                const matched =
                  expandedTokens.length > 0 &&
                  (expandedTokens.every(tok => spokenSet.has(tok)) ||
                    (expandedTokens.length >= 2 && spokenSet.has(expandedTokens.join(''))));
                return (
                  <span
                    key={`${w}-${idx}`}
                    className={matched ? 'text-emerald-300 underline decoration-emerald-500/60' : 'text-white'}
                  >
                    {w}
                  </span>
                );
              })}
            </p>
          ) : (
            <p className="text-base sm:text-xl font-black text-white leading-relaxed">
              {displayScript}
            </p>
          )}

          {showIntonation && segment.intonationText && (!keywordsOnly || revealThisSeg) && (
            <div className="px-3 py-2 rounded-xl bg-indigo-950/45 border border-indigo-500/30 text-xs sm:text-sm font-bold text-amber-200 leading-relaxed">
              {segment.intonationText}
            </div>
          )}

          {(isEn ? segment.meaningEn : segment.meaningVi) && (
            <p className="text-xs text-slate-400">
              {isEn ? segment.meaningEn : segment.meaningVi}
            </p>
          )}

          {Array.isArray(segment.keyPhrases) && segment.keyPhrases.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {segment.keyPhrases.map((phrase) => (
                <span
                  key={phrase}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold"
                >
                  ★ {phrase}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Waveform & Live STT Transcript */}
        <div className="h-12 sm:h-14 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative">
          <SpeechWaveVisualizer
            mode={
              isReadingPhase
                ? 'examiner_speaking'
                : isListening
                ? 'candidate_speaking'
                : 'idle'
            }
            analyserNode={analyserNode}
            className="w-full h-full"
          />
          {liveSpokenText ? (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xs flex flex-col items-center justify-center px-3 text-center">
              <p className="text-xs sm:text-sm font-bold text-emerald-300 truncate max-w-full">
                "{liveSpokenText}"
              </p>
              {isAutoMode && isListening && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  {isEn ? '⚡ Auto-grading right after you finish...' : '⚡ Tự động chấm ngay khi bạn nói xong...'}
                </span>
              )}
            </div>
          ) : isListening && isWaitingForRetrySpeech ? (
            <div className="absolute inset-0 bg-amber-950/45 flex items-center justify-center px-3 text-center">
              <p className="text-xs font-extrabold text-amber-300 animate-pulse flex items-center gap-2">
                <span>{isEn ? '🎙️ Mic is open — repeat now!' : '🎙️ Micro đang mở — hãy lặp lại ngay!'}</span>
                {hasAnalyser && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-[10px] font-mono">
                    {micLevel}%
                  </span>
                )}
              </p>
            </div>
          ) : isListening ? (
            <div className="absolute inset-0 bg-emerald-950/35 flex items-center justify-center px-3 text-center">
              <p className="text-xs font-extrabold text-emerald-300 animate-pulse flex items-center gap-2">
                <span>
                  {hasAnalyser
                    ? isEn ? '🎙️ Listening...' : '🎙️ Đang nghe...'
                    : isEn ? '🎙️ Mic active — speak now!' : '🎙️ Micro đang bật — hãy nói ngay!'}
                </span>
                {hasAnalyser && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono">
                    Mic {micLevel}%
                  </span>
                )}
              </p>
            </div>
          ) : null}
        </div>

        {speechError && (
          <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              {speechError === 'not-allowed'
                ? isEn
                  ? 'Microphone permission is blocked. Allow Microphone access in browser site settings (🔒 icon).'
                  : 'Trình duyệt đang chặn quyền Micro. Hãy bấm biểu tượng 🔒 cạnh thanh địa chỉ để cho phép Micro.'
                : speechError === 'audio-capture'
                ? isEn
                  ? 'Could not capture audio from your microphone. Close other apps or tabs using the mic and try again.'
                  : 'Không thể thu âm từ Micro. Hãy đóng các ứng dụng hoặc tab khác đang dùng micro rồi thử lại.'
                : speechError === 'network'
                ? isEn
                  ? 'Speech recognition network error. Check your internet connection, retry, or use AI Deep Check / Text Test.'
                  : 'Lỗi mạng khi nhận diện giọng nói. Hãy kiểm tra kết nối, thử lại hoặc dùng AI Chấm Sâu / Nhập thử.'
                : isEn
                ? 'Speech recognition unavailable on this browser. Use Chrome/Safari HTTPS, AI Deep Check, or tap "Text Test?".'
                : 'Nhận diện giọng nói chưa khả dụng trên trình duyệt này. Hãy dùng Chrome/Safari HTTPS, AI Chấm Sâu hoặc bấm "Nhập thử?".'}
            </span>
          </div>
        )}

        {/* Desktop Speak / Stop Button (Hidden on < lg where sticky thumb-zone bar handles it) */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            type="button"
            onClick={isReadingPhase ? onSkipReadingToSpeak : onToggleRecording}
            className={`flex-1 py-3 px-5 rounded-2xl text-sm font-black flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
              isListening
                ? evaluationResult && !evaluationResult.isPassed
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : isReadingPhase
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
            }`}
          >
            <Mic className="w-4 h-4 shrink-0" />
            <span>
              {isReadingPhase
                ? isEn
                  ? 'Skip Reading & Repeat Now'
                  : 'Dừng Máy Đọc & Lặp Lại Ngay'
                : isListening
                ? evaluationResult && !evaluationResult.isPassed
                  ? isEn
                    ? `Mic Listening — Try #${attemptCount + 1}`
                    : `Micro Đang Mở — Đọc Lại (Lần #${attemptCount + 1})`
                  : isAutoMode
                  ? isEn
                    ? 'Listening (Auto-Grade ON) • Tap to Stop'
                    : 'Đang Nghe (Tự Chấm) • Bấm Để Dừng'
                  : isEn
                  ? 'Stop & Score Shadowing'
                  : 'Dừng & Chấm Điểm'
                : isEn
                ? 'Start Mic & Shadow Now'
                : 'Bấm Bật Micro & Lặp Lại'}
            </span>
          </button>

          {currentAudioClip?.url && !isListening && (
            <>
              <button
                type="button"
                onClick={() => onReplayUserClip(segment.id)}
                className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                {isPlayingUserClip ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isEn ? 'Replay' : 'Nghe lại'}</span>
              </button>
              {onCompareAudio && (
                <button
                  type="button"
                  onClick={() => onCompareAudio(segment)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                    isComparingAudio
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/40'
                  }`}
                  title={isEn ? 'Play native model then your recording back-to-back' : 'Nghe giọng mẫu nối tiếp giọng bạn để đối chiếu'}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{isComparingAudio ? (isEn ? 'Comparing...' : 'Đang đối chiếu...') : (isEn ? 'Compare' : 'So sánh')}</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Manual / Fallback Text Test Box */}
        {showManualFallback && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-300">
                {isEn ? 'Fallback Verification:' : 'Kiểm tra dự phòng (khi không dùng được Mic):'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {apiKey && currentAudioClip?.blob && !isListening && (
                  <button
                    type="button"
                    onClick={onDeepAiAudioCheck}
                    disabled={isDeepAiGrading}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/35 hover:bg-purple-600/55 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3 h-3 ${isDeepAiGrading ? 'animate-spin' : ''}`} />
                    <span>
                      {isDeepAiGrading
                        ? isEn ? 'AI Grading...' : 'AI đang chấm...'
                        : isEn ? 'Grade Recorded Voice with AI' : 'AI Nghe & Chấm File Ghi Âm'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRunManualEvaluation(segment.text)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                >
                  {isEn ? '✓ I Shadowed It Clearly' : '✓ Tôi đã lặp lại rõ theo mẫu'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualSpokenInput}
                onChange={(e) => onChangeManualSpokenInput(e.target.value)}
                placeholder={isEn ? 'Type what you shadowed...' : 'Nhập nội dung bạn vừa lặp lại...'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => onRunManualEvaluation(manualSpokenInput)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Score' : 'Chấm'}
              </button>
            </div>
          </div>
        )}

        {/* Evaluation Feedback & Word Breakdown */}
        {evaluationResult && (
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 animate-in fade-in duration-150 ${
              evaluationResult.isPassed
                ? 'bg-emerald-950/40 border-emerald-500/50'
                : 'bg-amber-950/35 border-amber-500/50'
            }`}
          >
            {evaluationResult.isPassed ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-black text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    {isEn
                      ? `Passed (${evaluationResult.overallAccuracy}% • Band ${evaluationResult.estimatedBand})! Unlocking next...`
                      : `Đạt chuẩn (${evaluationResult.overallAccuracy}% • Band ${evaluationResult.estimatedBand})! Đang mở đoạn tiếp...`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onAdvanceAfterPass}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>{isEn ? 'Next Segment' : 'Đoạn tiếp theo'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center space-x-2 text-xs font-bold text-amber-200">
                  <RotateCcw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    {isEn
                      ? `Locked (${evaluationResult.overallAccuracy}% — need ≥ ${passThreshold}% • Try #${evaluationResult.attemptNumber || 1}). Repeat cleanly to advance.`
                      : `Chưa qua (${evaluationResult.overallAccuracy}% — cần ≥ ${passThreshold}% • Lần #${evaluationResult.attemptNumber || 1}). Hãy lặp lại rõ hơn để mở đoạn tiếp.`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onListenAndRetry}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center space-x-1 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Listen & Repeat' : 'Nghe mẫu & Đọc lại'}</span>
                </button>
              </div>
            )}

            {/* Word-by-word interactive chips */}
            <div className="flex flex-wrap gap-1.5">
              {(evaluationResult.wordBreakdown || []).map((wb, i) => {
                const chipStyle =
                  wb.status === 'correct'
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/45 hover:bg-emerald-900'
                    : wb.status === 'near'
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/45 hover:bg-amber-900'
                    : 'bg-rose-950/90 text-rose-300 border-rose-500/45 hover:bg-rose-900';
                return (
                  <button
                    key={`${wb.word}-${i}`}
                    type="button"
                    onClick={() => onPlayModel({ text: wb.cleanWord || wb.word }, null)}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center space-x-1 cursor-pointer ${chipStyle}`}
                    title={isEn ? `Listen to "${wb.word}"` : `Nghe từ "${wb.word}"`}
                  >
                    <Volume2 className="w-2.5 h-2.5 opacity-75 shrink-0" />
                    <span>{wb.word}</span>
                    <span className="text-[9px] opacity-80 font-mono">{wb.similarity}%</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
              <span>{isEn ? evaluationResult.coachFeedbackEn : evaluationResult.coachFeedbackVi}</span>

              {apiKey && currentAudioClip?.blob && !isListening && evaluationResult.engineTier !== 'layer2_gemini_audio' && (
                <button
                  type="button"
                  onClick={onDeepAiAudioCheck}
                  disabled={isDeepAiGrading}
                  className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 ${isDeepAiGrading ? 'animate-spin' : ''}`} />
                  <span>
                    {isDeepAiGrading
                      ? isEn ? 'AI Listening...' : 'AI đang nghe...'
                      : isEn ? 'AI Deep Check' : 'AI Nghe & Chấm Sâu'}
                  </span>
                </button>
              )}
            </div>

            {deepAiError && (
              <div className="text-[11px] text-rose-400 font-semibold">{deepAiError}</div>
            )}

            {/* Auto-unlocked Mouth Tip & Anti-Frustration Skip after 3 failed attempts */}
            {!evaluationResult.isPassed && attemptCount >= 3 && (
              <div className="pt-2 border-t border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="text-amber-200/90 flex items-start space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{isEn ? 'Tip: ' : 'Mẹo khẩu hình: '}</strong>
                    {isEn ? segment.mouthTipEn : segment.mouthTipVi}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSkipSegment}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold flex items-center space-x-1 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>{isEn ? 'Skip Segment (0 XP)' : 'Bỏ qua đoạn (0 XP)'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ShadowingSegmentCard);
