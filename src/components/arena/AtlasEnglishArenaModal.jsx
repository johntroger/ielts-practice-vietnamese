import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Swords, Flame, Trophy, Play, RotateCcw, X, ShieldAlert, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useArenaSprintEngine, ARENA_SPRINT_PHASES } from '../../hooks/useArenaSprintEngine.js';
import { useArenaAudio } from '../../hooks/useArenaAudio.js';
import { setupKeyboardNavigation } from '../../utils/keyboardNavigator.js';
import { getIsoWeekKey } from '../../utils/dateHelper.js';
import { getUnifiedStreakCount } from '../../services/gamification/leagueEngine.js';
import { 
  fetchRealLeaderboard, 
  reconcileRealLeaderboard, 
  submitRealSprintScore 
} from '../../services/gamification/realLeaderboardService.js';
import { calculateLevelFromXp, getLevelTierInfo } from '../../services/gamification/levelEngine.js';
import ArenaHeaderBar from './ArenaHeaderBar.jsx';
import ArenaQuestionCard from './ArenaQuestionCard.jsx';
import ArenaRelativeLeaderboard from './ArenaRelativeLeaderboard.jsx';
import ArenaSprintSummaryModal from './ArenaSprintSummaryModal.jsx';
import PublicLearnerProfileModal from './PublicLearnerProfileModal.jsx';
import LevelUpCelebrationModal from './LevelUpCelebrationModal.jsx';
import ArenaDifficultySelector from './ArenaDifficultySelector.jsx';
import { 
  ARENA_STORAGE_KEYS, 
  ARENA_DIFFICULTY_LEVELS, 
  ARENA_DIFFICULTY_CONFIG, 
  ARENA_IELTS_TOPICS 
} from '../../utils/arenaStorageKeys.js';
import { safeGet, safeSet } from '../../utils/storageService.js';
import { 
  getUnresolvedMistakeCount, 
  generateRevengeSprintQuestions 
} from '../../services/gamification/mistakeVaultService.js';

/**
 * src/components/arena/AtlasEnglishArenaModal.jsx
 * 
 * Standalone Fast-Paced eSports Sprint Modal for Atlas English Arena.
 * Delivers an immersive full-screen eSports experience with HTML5 Fullscreen support.
 * 100% Real-User Leaderboard: completely eliminates fake bot rivals and highlights real users (e.g. tranthanhtung37).
 */
export default function AtlasEnglishArenaModal({
  isOpen = false,
  onClose,
  currentUser = null
}) {
  const { t } = useTranslation();
  const { isMuted, toggleMute, playChime, speak, unlockAudio } = useArenaAudio();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State for real-user leaderboard data
  const [leaderboardData, setLeaderboardData] = useState(() => 
    reconcileRealLeaderboard([], currentUser)
  );
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);

  // Difficulty & Topic States
  const [selectedDifficulty, setSelectedDifficulty] = useState(() => 
    safeGet(ARENA_STORAGE_KEYS.LAST_DIFFICULTY, ARENA_DIFFICULTY_LEVELS.MEDIUM)
  );

  const [currentTopic, setCurrentTopic] = useState(() => {
    const idx = Math.floor(Math.random() * ARENA_IELTS_TOPICS.length);
    return ARENA_IELTS_TOPICS[idx] || ARENA_IELTS_TOPICS[0];
  });

  const handleDifficultyChange = useCallback((diff) => {
    setSelectedDifficulty(diff);
    safeSet(ARENA_STORAGE_KEYS.LAST_DIFFICULTY, diff);
  }, []);

  const streak = useMemo(() => getUnifiedStreakCount(), []);

  // Fetch real users from Supabase / cache whenever modal opens or user auth changes
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchRealLeaderboard(currentUser).then(res => {
      if (isMounted && res) {
        setLeaderboardData(res);
      }
    });
    return () => { isMounted = false; };
  }, [isOpen, currentUser]);

  const sprint = useArenaSprintEngine({
    user: currentUser,
    onSprintEnd: async (summary) => {
      if (summary && summary.finalXp > 0) {
        // Calculate old and new level to detect Level-Up
        const currentTotalXp = leaderboardData.userWeeklyXp || 0;
        const oldLevel = calculateLevelFromXp(currentTotalXp);
        const newLevel = calculateLevelFromXp(currentTotalXp + summary.finalXp);

        await submitRealSprintScore({
          currentUser,
          deltaXp: summary.finalXp,
          streakCount: streak + 1
        });
        const updated = await fetchRealLeaderboard(currentUser);
        setLeaderboardData(updated);

        if (newLevel > oldLevel) {
          playChime();
          setLevelUpData({
            oldLevel,
            newLevel,
            tier: getLevelTierInfo(newLevel)
          });
        }
      }
    }
  });

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

  const handleReturnToLobby = useCallback(() => {
    sprint.resetSprint();
    fetchRealLeaderboard(currentUser).then(res => {
      if (res) setLeaderboardData(res);
    }).catch(() => {});
  }, [sprint, currentUser]);

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
      <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
        {/* State 1: IDLE / Full-Screen Lobby Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.IDLE && (
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            {/* Top Navigation Bar */}
            <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                    {t('arena.title')}
                  </h1>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    {t('arena.subtitle')}
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-bold">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>{streak} {t('arena.daysStreak')}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                  title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                  title="Thoát Đấu Trường"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Main Fullscreen Lobby Body */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left: Hero Banner & Rules */}
                <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-900/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
                    <Trophy className="w-4 h-4" />
                    <span>7 Câu Hỏi Phản Xạ • 180 Giây (3 Phút) • 5 Khiên Bảo Vệ</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 leading-tight">
                    Đấu Trường Anh Ngữ Nhịp Độ Cao Triệt Tiêu Bẫy Cambridge
                  </h2>

                  <p className="text-sm text-slate-300/90 leading-relaxed font-sans">
                    Rèn luyện phản xạ học thuật tức thì: tiêu diệt bẫy chính tả khó, bẫy từ đồng nghĩa học thuật, bẫy đọc True/False/Not Given và bẫy âm thanh tự sửa trong bài thi Listening. Bảng xếp hạng cập nhật điểm người học thật trực tiếp trên hệ thống.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-base sm:text-lg font-black text-indigo-300">180s</div>
                      <div className="text-[11px] text-slate-400 font-medium">Thời Gian (3p)</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-base sm:text-lg font-black text-emerald-300">5 Khiên</div>
                      <div className="text-[11px] text-slate-400 font-medium">Bảo Vệ</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-base sm:text-lg font-black text-amber-300">
                        ~{ARENA_DIFFICULTY_CONFIG[selectedDifficulty]?.maxSprintXp || 200} XP
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">Thưởng Tối Đa</div>
                    </div>
                  </div>

                  {/* 4-Tier Difficulty Selector & Topic Preview */}
                  <ArenaDifficultySelector
                    selectedDifficulty={selectedDifficulty}
                    onSelectDifficulty={handleDifficultyChange}
                    currentTopic={currentTopic}
                  />

                  <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        playChime();
                        const nextTopic = ARENA_IELTS_TOPICS[Math.floor(Math.random() * ARENA_IELTS_TOPICS.length)];
                        setCurrentTopic(nextTopic);
                        sprint.startSprint(null, selectedDifficulty);
                      }}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base py-4 px-8 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.99]"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>{t('arena.startSprint')}</span>
                    </button>

                    {getUnresolvedMistakeCount() > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          playChime();
                          const revengeQuestions = generateRevengeSprintQuestions({ count: 10 });
                          if (revengeQuestions.length > 0) {
                            sprint.startSprint(revengeQuestions, selectedDifficulty);
                          }
                        }}
                        className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-rose-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.99]"
                        title="Vào vòng đấu giải cứu các câu bạn đã làm sai"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>⚡ Đấu Phục Thù ({getUnresolvedMistakeCount()})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Real Learner Leaderboard */}
                <div className="lg:col-span-6 xl:col-span-5 w-full">
                  <ArenaRelativeLeaderboard
                    rivals={leaderboardData.leaderboard}
                    currentUserId={currentUser?.id}
                    currentUserEmail={currentUser?.email}
                    userWeeklyXp={leaderboardData.userWeeklyXp}
                    leagueTier={leaderboardData.leagueTier}
                    onSelectLearner={setSelectedLearner}
                  />
                </div>
              </div>
            </main>
          </div>
        )}

        {/* State 2 & 3: ACTIVE & REVIEWING_ANSWER Screens */}
        {(sprint.phase === ARENA_SPRINT_PHASES.ACTIVE || sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) && (
          <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
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
              onClose={handleReturnToLobby}
            />
            <div className="px-4 py-4 sm:px-6 sm:py-5 flex-1 min-h-0 flex flex-col items-center justify-start overflow-y-auto">
              <div className="w-full max-w-2xl pb-16">
                {currentQ && (
                  <ArenaQuestionCard
                    question={currentQ}
                    selectedOption={sprint.selectedOption}
                    isAnswerChecked={sprint.isAnswerChecked}
                    isCorrect={sprint.isCorrect}
                    onSelectOption={sprint.selectOption}
                    onCheckAnswer={sprint.checkAnswer}
                    onSubmitAnswer={sprint.checkAnswer}
                    onNextQuestion={sprint.nextQuestion}
                    onPlayAudio={(text) => speak(text)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* State 4: DEFEATED Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.DEFEATED && (
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            <header className="w-full bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Hết Khiên Bảo Vệ</span>
              </div>
              <button
                type="button"
                onClick={handleReturnToLobby}
                className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Quay lại Bảng Xếp Hạng"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 animate-bounce">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Đấu Trường Tạm Dừng</h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Bạn đã dùng hết 5 khiên bảo vệ trong vòng đấu này. Hãy sử dụng quyền hồi sinh khiên cấp cứu (1 lần duy nhất) để tiếp tục!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={sprint.retrySprint}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Hồi Sinh +2 Khiên</span>
                </button>
                <button
                  type="button"
                  onClick={() => sprint.startSprint()}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 px-6 rounded-xl transition-colors cursor-pointer border border-slate-700"
                >
                  Đấu Lại Từ Đầu
                </button>
              </div>
            </main>
          </div>
        )}

        {/* State 5: COMPLETED Screen / Summary Modal */}
        {sprint.phase === ARENA_SPRINT_PHASES.COMPLETED && sprint.summary && (
          <div className="flex flex-col flex-1 min-h-full items-center justify-center p-4">
            <ArenaSprintSummaryModal
              summary={sprint.summary}
              onPlayAgain={() => sprint.startSprint()}
              onClose={handleReturnToLobby}
            />
          </div>
        )}

        {/* Public Learner Profile Modal (Peer Profile Viewer) */}
        {selectedLearner && (
          <PublicLearnerProfileModal
            isOpen={Boolean(selectedLearner)}
            learner={selectedLearner}
            onClose={() => setSelectedLearner(null)}
            onChallengeSprint={() => {
              setSelectedLearner(null);
              playChime();
              sprint.startSprint();
            }}
          />
        )}

        {/* Level-Up Celebration Modal (High-Octane Fanfare) */}
        {levelUpData && (
          <LevelUpCelebrationModal
            isOpen={Boolean(levelUpData)}
            oldLevel={levelUpData.oldLevel}
            newLevel={levelUpData.newLevel}
            tier={levelUpData.tier}
            onClose={() => setLevelUpData(null)}
            onContinue={() => {
              setLevelUpData(null);
              sprint.startSprint();
            }}
          />
        )}
      </div>
    </div>
  );
}
