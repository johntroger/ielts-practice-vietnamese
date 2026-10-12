import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Swords, Flame, Trophy, Play, RotateCcw, X, ShieldAlert, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useArenaSprintEngine, ARENA_SPRINT_PHASES } from '../../hooks/useArenaSprintEngine.js';
import { useArenaAudio } from '../../hooks/useArenaAudio.js';
import { setupKeyboardNavigation } from '../../utils/keyboardNavigator.js';
import { getIsoWeekKey } from '../../utils/dateHelper.js';
import { generateWeeklyRivals } from '../../services/gamification/offlineRivals.js';
import { getLeagueTier, getRelativeLeaderboardSlice, getUnifiedStreakCount } from '../../services/gamification/leagueEngine.js';
import ArenaHeaderBar from './ArenaHeaderBar.jsx';
import ArenaQuestionCard from './ArenaQuestionCard.jsx';
import ArenaRelativeLeaderboard from './ArenaRelativeLeaderboard.jsx';
import ArenaSprintSummaryModal from './ArenaSprintSummaryModal.jsx';

/**
 * src/components/arena/AtlasEnglishArenaModal.jsx
 * 
 * Standalone Fast-Paced eSports Sprint Modal for Atlas English Arena.
 * Delivers an immersive full-screen eSports experience with HTML5 Fullscreen support.
 */
export default function AtlasEnglishArenaModal({
  isOpen = false,
  onClose,
  currentUser = null
}) {
  const { t } = useTranslation();
  const { isMuted, toggleMute, playChime, speak, unlockAudio } = useArenaAudio();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sprint = useArenaSprintEngine({
    user: currentUser
  });

  const weekKey = useMemo(() => getIsoWeekKey(), []);
  const streak = useMemo(() => getUnifiedStreakCount(), []);
  const rivalsData = useMemo(() => {
    const rawRivals = generateWeeklyRivals(weekKey, 20);
    return getRelativeLeaderboardSlice(rawRivals, currentUser?.id || 'current_user');
  }, [weekKey, currentUser]);

  const currentTier = useMemo(() => getLeagueTier(rivalsData.userRank ? (2000 - rivalsData.userRank * 50) : 100), [rivalsData]);

  // Fullscreen toggle support
  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation wiring
  useEffect(() => {
    if (!isOpen) return;

    return setupKeyboardNavigation({
      isActive: isOpen,
      onSelectOption: (idx) => {
        if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE) {
          sprint.selectOption(idx);
        }
      },
      onSubmit: () => {
        if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE && sprint.selectedOption !== null) {
          sprint.checkAnswer();
        } else if (sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
          sprint.nextQuestion();
        }
      },
      onSkip: () => {
        if (sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
          sprint.nextQuestion();
        }
      },
      onSpaceAudio: () => {
        const curQ = sprint.questions[sprint.currentIndex];
        if (curQ?.audioText) {
          speak(curQ.audioText);
        }
      }
    });
  }, [isOpen, sprint, speak]);

  if (!isOpen) return null;

  const currentQ = sprint.questions[sprint.currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col w-screen h-screen overflow-hidden select-none animate-fade-in"
      onClick={unlockAudio}
    >
      <div className="w-full h-full flex flex-col overflow-y-auto bg-slate-950">
        {/* State 1: IDLE / Full-Screen Lobby Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.IDLE && (
          <div className="flex flex-col min-h-full">
            {/* Top Navigation Bar */}
            <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-100 tracking-tight">
                      {t('arena.title')}
                    </h1>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider">
                      eSPORTS ARENA
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('arena.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{streak} Ngày Streak</span>
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title={t('common.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Lobby Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-10 flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Hero Card */}
                <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
                    <Trophy className="w-4 h-4" />
                    <span>7 Câu Hỏi Phản Xạ • 90 Giây • 5 Khiên Bảo Vệ</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 leading-tight">
                    Đấu Trường Anh Ngữ Nhịp Độ Cao Triệt Tiêu Bẫy Cambridge
                  </h2>

                  <p className="text-sm text-slate-300/90 leading-relaxed font-sans">
                    Rèn luyện phản xạ học thuật tức thì: tiêu diệt bẫy chính tả khó, bẫy từ đồng nghĩa học thuật, bẫy đọc True/False/Not Given và bẫy âm thanh tự sửa trong bài thi Listening.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-base sm:text-lg font-black text-indigo-300">90s</div>
                      <div className="text-[11px] text-slate-400 font-medium">Thời Gian</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-base sm:text-lg font-black text-emerald-300">5 Khiên</div>
                      <div className="text-[11px] text-slate-400 font-medium">Bảo Vệ</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-base sm:text-lg font-black text-amber-300">200 XP</div>
                      <div className="text-[11px] text-slate-400 font-medium">Điểm Tối Đa</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playChime();
                      sprint.startSprint();
                    }}
                    className="mt-2 w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base py-4 px-8 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{t('arena.startSprint')}</span>
                  </button>
                </div>

                {/* Right: Leaderboard */}
                <div className="lg:col-span-6 xl:col-span-5 w-full">
                  <ArenaRelativeLeaderboard
                    rivals={rivalsData.rivalsSlice}
                    currentUserId={currentUser?.id}
                    leagueTier={currentTier}
                  />
                </div>
              </div>
            </main>
          </div>
        )}

        {/* State 2 & 3: ACTIVE & REVIEWING_ANSWER Screens */}
        {(sprint.phase === ARENA_SPRINT_PHASES.ACTIVE || sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) && (
          <div className="flex flex-col flex-1 min-h-full">
            <ArenaHeaderBar
              timeRemaining={sprint.timeRemaining}
              remainingShields={sprint.shieldState.remainingShields}
              combo={sprint.combo}
              currentIndex={sprint.currentIndex}
              totalQuestions={sprint.questions.length}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
              onClose={handleClose}
            />
            <div className="p-4 sm:p-8 flex-1 flex flex-col justify-center items-center overflow-y-auto">
              <div className="w-full max-w-3xl">
                <ArenaQuestionCard
                  question={currentQ}
                  selectedOption={sprint.selectedOption}
                  isAnswerChecked={sprint.isAnswerChecked}
                  isCorrect={sprint.isCorrect}
                  onSelectOption={sprint.selectOption}
                  onCheckAnswer={sprint.checkAnswer}
                  onNextQuestion={sprint.nextQuestion}
                  onPlayAudio={speak}
                />
              </div>
            </div>
          </div>
        )}

        {/* State 4: DEFEATED Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.DEFEATED && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-100">
                  Cả 5 Khiên Đã Vỡ!
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  Bạn đã phạm quá nhiều lỗi dưới áp lực thời gian của đấu trường.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full">
                {!sprint.shieldState.retryUsed ? (
                  <button
                    type="button"
                    onClick={sprint.retrySprint}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3.5 rounded-xl shadow-lg transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('arena.retrySprint')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
                  >
                    {t('common.close')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* State 5: COMPLETED Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.COMPLETED && (
          <div className="flex-1 flex items-center justify-center p-6">
            <ArenaSprintSummaryModal
              summary={sprint.summary}
              onPlayAgain={() => {
                playChime();
                sprint.startSprint();
              }}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
