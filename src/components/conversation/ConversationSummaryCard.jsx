import React, { useState } from 'react';
import {
  Trophy,
  Play,
  Square,
  RotateCcw,
  ArrowLeftRight,
  Bookmark,
  ShieldAlert,
  Mic,
  Volume2,
  Check,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import SpeakingFillerTracker from '../speaking/SpeakingFillerTracker';

export default function ConversationSummaryCard({
  scenario,
  summary,
  mode = 'roleplay',
  combinedUserTranscript = '',
  totalSpeakingDurationSec = 30,
  isFullReplaying,
  replayTurnIdx,
  onToggleFullReplay,
  onRestart,
  onNextTask = null,
  onSwapRolesAndRestart,
  onPlayWord,
  onSaveWordToNotebook,
  onSaveWordToMistakes,
  onOpenInPronunciation,
  isEn
}) {
  const [savedVocabWords, setSavedVocabWords] = useState({});
  const [savedMistakeWords, setSavedMistakeWords] = useState({});

  if (!scenario || !summary) return null;

  const isShadowing = mode === 'shadowing';

  const handleSaveVocab = (w) => {
    onSaveWordToNotebook?.(w);
    setSavedVocabWords(prev => ({ ...prev, [w.cleanWord]: true }));
  };

  const handleSaveMistake = (w) => {
    onSaveWordToMistakes?.(w);
    setSavedMistakeWords(prev => ({ ...prev, [w.cleanWord]: true }));
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/45 shadow-2xl space-y-5 animate-in fade-in duration-300">
      {/* Header Celebration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {isShadowing
                ? isEn
                  ? 'Shadowing Completed!'
                  : 'Hoàn Thành Speech Shadowing!'
                : isEn
                ? 'Conversation Completed!'
                : 'Hoàn Thành Hội Thoại!'}
            </h3>
            <p className="text-xs text-slate-300">
              {isEn ? scenario.titleEn : scenario.titleVi}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleFullReplay}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
              isFullReplaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isFullReplaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>
              {isFullReplaying
                ? isEn
                  ? `Stop Replay (${isShadowing ? 'Seg' : 'Turn'} ${replayTurnIdx + 1})`
                  : `Dừng Phát (${isShadowing ? 'Đoạn' : 'Lượt'} ${replayTurnIdx + 1})`
                : isShadowing
                ? isEn
                  ? 'Replay Full Speech'
                  : 'Phát Lại Toàn Bộ Bài Nói'
                : isEn
                ? 'Replay Full Dialogue'
                : 'Phát Lại Trọn Đoạn Hội Thoại'}
            </span>
          </button>

          {!isShadowing && onSwapRolesAndRestart && (
            <button
              type="button"
              onClick={onSwapRolesAndRestart}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isEn ? 'Swap Roles & Retry' : 'Đổi Vai & Luyện Lại'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Practice Again' : 'Làm Lại'}</span>
          </button>

          {onNextTask && (
            <button
              type="button"
              onClick={onNextTask}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>{isEn ? 'Next Task' : 'Bài Kế Tiếp'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">
            {isEn ? 'Avg Accuracy' : 'Độ Chuẩn TB'}
          </div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            {summary.avgAccuracy}%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">
            {isEn ? 'Est. Band' : 'Band Ước Tính'}
          </div>
          <div className="text-xl font-black text-indigo-300 mt-0.5">
            Band {summary.estimatedBand}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">
            {isEn ? 'First-Try Pass' : 'Qua Ngay Lần Đầu'}
          </div>
          <div className="text-xl font-black text-cyan-300 mt-0.5">
            {summary.firstTryRate}%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">
            {isEn ? 'Total XP Earned' : 'Tổng XP Nhận'}
          </div>
          <div className="text-xl font-black text-amber-400 mt-0.5 flex items-center space-x-1">
            <Zap className="w-4 h-4 fill-current" />
            <span>+{summary.totalXp}</span>
          </div>
        </div>
      </div>

      {/* Fluency & Filler Words Analysis (reused from Speaking Studio) */}
      {combinedUserTranscript && (
        <SpeakingFillerTracker
          transcript={combinedUserTranscript}
          durationSec={Math.max(15, totalSpeakingDurationSec)}
        />
      )}

      {/* Struggled Words -> Save to Notebook / Mistake Log / Practice in Pronunciation */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-black text-white">
              {summary.struggledWords.length > 0
                ? isEn
                  ? `Words to Polish (${summary.struggledWords.length})`
                  : `Từ Cần Luyện Thêm (${summary.struggledWords.length})`
                : isEn
                ? 'Flawless Phonological Control!'
                : 'Kiểm Soát Ngữ Âm Hoàn Hảo!'}
            </h4>
          </div>
          {onOpenInPronunciation && (
            <button
              type="button"
              onClick={onOpenInPronunciation}
              className="px-2.5 py-1 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/45 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Mic className="w-3 h-3" />
              <span>{isEn ? 'Open /pronunciation' : 'Mở /pronunciation'}</span>
            </button>
          )}
        </div>

        {summary.struggledWords.length === 0 ? (
          <p className="text-xs text-emerald-300">
            {isShadowing
              ? isEn
                ? 'Every word across your segments scored ≥84%. Try Paragraph mode or raise the pass threshold!'
                : 'Mọi từ trong các đoạn vừa đọc đều đạt ≥84%. Hãy thử chế độ Theo đoạn hoặc nâng ngưỡng chuẩn lên 80–88%!'
              : isEn
              ? 'Every word across your turns scored ≥84%. Ready to swap roles or try a higher Band threshold!'
              : 'Mọi từ trong các lượt nói của bạn đều đạt ≥84%. Hãy thử đổi vai hoặc nâng ngưỡng chuẩn lên 80–88%!'}
          </p>
        ) : (
          <div className="space-y-2">
            {summary.struggledWords.slice(0, 8).map((w) => (
              <div
                key={w.cleanWord}
                className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onPlayWord(w.word)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white cursor-pointer"
                    title={isEn ? 'Listen' : 'Nghe'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-white">{w.word}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                      w.similarity >= 60
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {w.similarity}%
                  </span>
                  {w.missingCoda && (
                    <span className="text-[10px] text-amber-400">
                      {isEn ? '(weak ending)' : '(rơi âm đuôi)'}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  {onSaveWordToNotebook && (
                    <button
                      type="button"
                      onClick={() => handleSaveVocab(w)}
                      disabled={savedVocabWords[w.cleanWord]}
                      className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-60"
                    >
                      {savedVocabWords[w.cleanWord] ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                      <span>{savedVocabWords[w.cleanWord] ? (isEn ? 'Saved' : 'Đã lưu') : (isEn ? 'Vocab' : 'Sổ Tay')}</span>
                    </button>
                  )}
                  {onSaveWordToMistakes && (
                    <button
                      type="button"
                      onClick={() => handleSaveMistake(w)}
                      disabled={savedMistakeWords[w.cleanWord]}
                      className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-60"
                    >
                      {savedMistakeWords[w.cleanWord] ? <Check className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      <span>{savedMistakeWords[w.cleanWord] ? (isEn ? 'Logged' : 'Đã ghi') : (isEn ? 'Mistake Log' : 'Lỗi Sai')}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
