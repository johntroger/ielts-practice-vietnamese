import React, { useEffect, useMemo } from 'react';
import { Swords, Flame, Trophy, Play, RotateCcw, X, ShieldAlert } from 'lucide-react';
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
 * Completely decoupled from the 30-Min Adaptive Sprint Coach.
 */
export default function AtlasEnglishArenaModal({
  isOpen = false,
  onClose,
  currentUser = null
}) {
  const { t } = useTranslation();
  const { isMuted, toggleMute, playChime, speak, unlockAudio } = useArenaAudio();

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[560px]"
        onClick={unlockAudio}
      >
        {/* State 1: IDLE / Lobby Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.IDLE && (
          <div className="p-6 md:p-8 flex flex-col gap-6 my-auto">
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-100">
                    {t('arena.title')}
                  </h1>
                  <p className="text-xs text-slate-400">
                    {t('arena.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{streak}d</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid: Start Action + Relative Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Hero Card */}
              <div className="flex flex-col gap-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>7 Questions • 90 Seconds • 5 Shields</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 leading-snug">
                  Fast-Paced Micro-Sprint Against Cambridge Traps
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Eliminate spelling demons, tackle distractor audio traps, and climb the relative leaderboard ladder.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playChime();
                    sprint.startSprint();
                  }}
                  className="mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t('arena.startSprint')}</span>
                </button>
              </div>

              {/* Right: Relative Leaderboard Slice */}
              <ArenaRelativeLeaderboard
                rivals={rivalsData.rivalsSlice}
                currentUserId={currentUser?.id}
                leagueTier={currentTier}
              />
            </div>
          </div>
        )}

        {/* State 2 & 3: ACTIVE & REVIEWING_ANSWER Screens */}
        {(sprint.phase === ARENA_SPRINT_PHASES.ACTIVE || sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) && (
          <div className="flex flex-col flex-1">
            <ArenaHeaderBar
              timeRemaining={sprint.timeRemaining}
              remainingShields={sprint.shieldState.remainingShields}
              combo={sprint.combo}
              currentIndex={sprint.currentIndex}
              totalQuestions={sprint.questions.length}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onClose={onClose}
            />
            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
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
        )}

        {/* State 4: DEFEATED Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.DEFEATED && (
          <div className="p-8 my-auto flex flex-col items-center text-center gap-5 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100">
                All 5 Shields Shattered!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                You made too many critical mistakes under pressure.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              {!sprint.shieldState.retryUsed ? (
                <button
                  type="button"
                  onClick={sprint.retrySprint}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-xl shadow-lg transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('arena.retrySprint')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  {t('common.close')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* State 5: COMPLETED Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.COMPLETED && (
          <div className="p-6 md:p-8 my-auto flex items-center justify-center">
            <ArenaSprintSummaryModal
              summary={sprint.summary}
              onPlayAgain={() => {
                playChime();
                sprint.startSprint();
              }}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
