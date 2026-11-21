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
  ArrowLeftRight
} from 'lucide-react';
import SpeechWaveVisualizer from '../speaking/SpeechWaveVisualizer';
import { expandConversationalTokens } from '../../data/pronunciationData';
import { maskToKeywords } from '../../utils/speakingPracticeHelpers';

function ConversationTurnCard({
  turn,
  turnIndex,
  totalTurns,
  roleMeta,
  isUserTurn,
  status, // 'past_done' | 'active' | 'locked'
  isPartnerSpeakingNow,
  hasStudioAudio,
  showIntonation,
  keywordsOnly,
  playbackSpeed = 0.85,
  revealThisTurn,
  onToggleRevealThisTurn,
  onPlayPartnerLine,
  onPlayUserModel,
  // Active user turn props
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
  onSkipTurn,
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
  // 1. FUTURE LOCKED TURN
  if (status === 'locked') {
    return (
      <div
        className={`flex ${isUserTurn ? 'justify-end' : 'justify-start'} opacity-45 select-none`}
      >
        <div className="max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-semibold">
            {isEn
              ? `Turn ${turnIndex + 1} (${roleMeta?.nameEn || ''}) — Pass the current turn (≥${passThreshold}%) to unlock`
              : `Lượt ${turnIndex + 1} (${roleMeta?.nameVi || ''}) — Đạt chuẩn lượt hiện tại (≥${passThreshold}%) để mở khóa`}
          </span>
        </div>
      </div>
    );
  }

  // 2. PARTNER TURN (PAST OR CURRENTLY SPEAKING)
  if (!isUserTurn) {
    const isActivePartner = status === 'active';
    return (
      <div className="flex justify-start animate-in fade-in duration-200">
        <div
          className={`max-w-[92%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-2xl rounded-tl-sm border transition-all space-y-2 ${
            isActivePartner
              ? 'bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-base leading-none shrink-0">{roleMeta?.avatar || '🗣️'}</span>
              <span className="text-xs font-black text-indigo-300 truncate">
                {isEn ? roleMeta?.nameEn : roleMeta?.nameVi}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                #{turnIndex + 1}/{totalTurns}
              </span>
              {hasStudioAudio && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Studio Audio
                </span>
              )}
              {isActivePartner && isPartnerSpeakingNow && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white animate-pulse">
                  {isEn ? 'Speaking...' : 'Đang nói...'}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => onPlayPartnerLine(turn, null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                title={isEn ? `Replay partner line (${playbackSpeed}x)` : `Nghe lại câu này (${playbackSpeed}x)`}
              >
                <Volume2 className="w-3 h-3" />
                <span>{isEn ? `Listen (${playbackSpeed}x)` : `Nghe (${playbackSpeed}x)`}</span>
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {turn.text}
          </p>

          {showIntonation && turn.intonationText && (
            <p className="text-xs font-mono text-amber-200/90 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
              {turn.intonationText}
            </p>
          )}

          {(isEn ? turn.meaningEn : turn.meaningVi) && (
            <p className="text-[11px] text-slate-400">
              {isEn ? turn.meaningEn : turn.meaningVi}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. PAST COMPLETED USER TURN
  if (status === 'past_done') {
    const acc = evaluationResult?.overallAccuracy ?? 0;
    const isSkipped = Boolean(evaluationResult?.skipped);
    return (
      <div className="flex justify-end animate-in fade-in duration-150">
        <div className="max-w-[92%] sm:max-w-[82%] p-3.5 rounded-2xl rounded-tr-sm bg-emerald-950/35 border border-emerald-500/35 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm leading-none">{roleMeta?.avatar || '🎙️'}</span>
              <span className="text-xs font-black text-emerald-300">
                {isEn ? `${roleMeta?.nameEn} (You)` : `${roleMeta?.nameVi} (Bạn)`}
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
                  onClick={() => onReplayUserClip(turn.id)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                >
                  {isPlayingUserClip ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isEn ? 'Your Voice' : 'Giọng bạn'}</span>
                </button>
              )}
              {currentAudioClip?.url && onCompareAudio && (
                <button
                  type="button"
                  onClick={() => onCompareAudio(turn)}
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
                onClick={() => onPlayUserModel(turn, null)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isEn ? 'Model' : 'Mẫu'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
            {turn.text}
          </p>
        </div>
      </div>
    );
  }

  // 4. ACTIVE USER TURN (GATED SPOTLIGHT CARD)
  const displayScript =
    keywordsOnly && !revealThisTurn ? maskToKeywords(turn.text) : turn.text;

  // Live spoken word matching preview while speaking (supports numbers, contractions & UK/US forms)
  const spokenSet = new Set(expandConversationalTokens(liveSpokenText || ''));

  return (
    <div className="flex justify-end animate-in fade-in duration-200">
      <div
        className={`w-full sm:max-w-[92%] p-4 sm:p-5 rounded-3xl border transition-all space-y-3.5 shadow-xl ${
          isListening
            ? 'bg-slate-950 border-emerald-500/75 ring-2 ring-emerald-500/25 shadow-emerald-950/30'
            : evaluationResult?.isPassed
            ? 'bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-900 border-emerald-500/60'
            : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-amber-500/45'
        }`}
      >
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-base leading-none">{roleMeta?.avatar || '🎙️'}</span>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {isEn ? `Your Turn — ${roleMeta?.nameEn}` : `Lượt của Bạn — ${roleMeta?.nameVi}`}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {isEn ? `Need ≥ ${passThreshold}%` : `Cần ≥ ${passThreshold}%`}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {keywordsOnly && (
              <button
                type="button"
                onClick={onToggleRevealThisTurn}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
              >
                {revealThisTurn ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{revealThisTurn ? (isEn ? 'Hide Script' : 'Ẩn chữ') : (isEn ? 'Reveal' : 'Xem câu')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onPlayUserModel(turn, null)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/45 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
              title={isEn ? 'Hear model pronunciation at selected speed' : 'Nghe mẫu câu của bạn theo tốc độ đã chọn'}
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

        {/* Target Sentence with Live Word Highlight while Speaking */}
        <div className="space-y-2">
          {isListening && !keywordsOnly && liveSpokenText ? (
            <p className="text-lg sm:text-xl font-black leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
              {turn.text.split(/\s+/).map((w, idx) => {
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
            <p className="text-lg sm:text-xl font-black text-white leading-relaxed">
              {displayScript}
            </p>
          )}

          {showIntonation && turn.intonationText && (!keywordsOnly || revealThisTurn) && (
            <div className="px-3 py-2 rounded-xl bg-indigo-950/45 border border-indigo-500/30 text-xs sm:text-sm font-bold text-amber-200 leading-relaxed">
              {turn.intonationText}
            </div>
          )}

          {(isEn ? turn.meaningEn : turn.meaningVi) && (
            <p className="text-xs text-slate-400">
              {isEn ? turn.meaningEn : turn.meaningVi}
            </p>
          )}
        </div>

        {/* Waveform & Live STT Transcript */}
        <div className="h-12 sm:h-14 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative">
          <SpeechWaveVisualizer
            mode={isListening ? 'candidate_speaking' : 'idle'}
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
                <span>{isEn ? '🎙️ Mic is open — repeat now!' : '🎙️ Micro đang mở — hãy đọc lại ngay!'}</span>
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

        {/* Desktop Primary Speak / Stop Button */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleRecording}
            className={`flex-1 py-3 px-5 rounded-2xl text-sm font-black flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
              isListening
                ? evaluationResult && !evaluationResult.isPassed
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
            }`}
          >
            <Mic className="w-4 h-4 shrink-0" />
            <span>
              {isListening
                ? evaluationResult && !evaluationResult.isPassed
                  ? isEn
                    ? `Mic Listening — Try #${attemptCount + 1}`
                    : `Micro Đang Mở — Đọc Lại (Lần #${attemptCount + 1})`
                  : isAutoMode
                  ? isEn
                    ? 'Listening (Auto-Grade ON) • Tap to Stop'
                    : 'Đang Nghe (Tự Chấm) • Bấm Để Dừng'
                  : isEn
                  ? 'Stop & Score Pronunciation'
                  : 'Dừng & Chấm Điểm'
                : isEn
                ? 'Speak Your Line Now'
                : 'Bấm Bật Micro & Đọc Câu Thoại'}
            </span>
          </button>

          {currentAudioClip?.url && !isListening && (
            <>
              <button
                type="button"
                onClick={() => onReplayUserClip(turn.id)}
                className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                {isPlayingUserClip ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isEn ? 'Replay' : 'Nghe lại'}</span>
              </button>
              {onCompareAudio && (
                <button
                  type="button"
                  onClick={() => onCompareAudio(turn)}
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
                  onClick={() => onRunManualEvaluation(turn.text)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                >
                  {isEn ? '✓ I Spoke It Clearly' : '✓ Tôi đã đọc rõ theo mẫu'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualSpokenInput}
                onChange={(e) => onChangeManualSpokenInput(e.target.value)}
                placeholder={isEn ? 'Type what you pronounced...' : 'Nhập câu bạn vừa đọc...'}
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
                      ? `Passed (${evaluationResult.overallAccuracy}% • Band ${evaluationResult.estimatedBand})! Advancing...`
                      : `Đạt chuẩn (${evaluationResult.overallAccuracy}% • Band ${evaluationResult.estimatedBand})! Đang mở câu tiếp...`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onAdvanceAfterPass}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>{isEn ? 'Continue Now' : 'Tiếp tục ngay'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center space-x-2 text-xs font-bold text-amber-200">
                  <RotateCcw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    {isEn
                      ? `Locked (${evaluationResult.overallAccuracy}% — need ≥ ${passThreshold}% • Try #${evaluationResult.attemptNumber || 1}). Pronounce again to unlock next turn.`
                      : `Chưa mở khóa (${evaluationResult.overallAccuracy}% — cần ≥ ${passThreshold}% • Lần #${evaluationResult.attemptNumber || 1}). Hãy đọc lại để qua câu tiếp theo.`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onListenAndRetry}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center space-x-1 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Listen & Retry' : 'Nghe mẫu & Đọc lại'}</span>
                </button>
              </div>
            )}

            {/* Word-by-word chips (clickable to hear exact pronunciation) */}
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
                    onClick={() => onPlayUserModel({ text: wb.cleanWord || wb.word }, null)}
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
                    {isEn ? turn.mouthTipEn : turn.mouthTipVi}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSkipTurn}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold flex items-center space-x-1 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>{isEn ? 'Skip Turn (0 XP)' : 'Bỏ qua lượt (0 XP)'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ConversationTurnCard);
