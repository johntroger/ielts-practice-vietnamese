import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  BookmarkPlus,
  BookOpen,
  ArrowRight,
  PenTool,
  Mic,
  AlertCircle
} from 'lucide-react';
import {
  generateDaily30MinSprint,
  getTodaySprintProgress,
  saveTodaySprintProgress,
  recordSprintCompletion,
  getSprintStats
} from '../services/sprintCoachService';
import { useTranslation } from '../i18n/LanguageContext';

export default function AdaptiveSprintModal({
  isOpen,
  onClose,
  submissions = [],
  mistakes = [],
  vocabList = [],
  targetBand = '7.0',
  onSaveToVocabNotebook
}) {
  const { t, isEn } = useTranslation();
  const [sprintPlan, setSprintPlan] = useState(null);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [stageProgress, setStageProgress] = useState(null);
  const [stats, setStats] = useState({ currentStreak: 0, totalSprintsCompleted: 0 });

  // Stage timer state
  const [secondsRemaining, setSecondsRemaining] = useState(7 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Interactive Quiz state (Stage 1)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  // Core drill practice text (Stage 2)
  const [stage2Text, setStage2Text] = useState('');

  // Vocab saved state (Stage 3)
  const [savedVocabIds, setSavedVocabIds] = useState({});

  // Celebration state
  const [isCelebrated, setIsCelebrated] = useState(false);

  // Initialize sprint plan on open
  useEffect(() => {
    if (isOpen) {
      const plan = generateDaily30MinSprint({
        submissions,
        mistakes,
        vocabList,
        targetBand
      });
      setSprintPlan(plan);

      const progress = getTodaySprintProgress();
      setStageProgress(progress);
      setCurrentStageIdx(progress.currentStageIndex || 0);
      setIsCelebrated(Boolean(progress.isCompleted));
      setStats(getSprintStats());

      // Set initial timer for the stage
      const currentStage = plan.stages[progress.currentStageIndex || 0];
      if (currentStage) {
        setSecondsRemaining(currentStage.durationSeconds);
      }
      setIsTimerRunning(false);
    }
  }, [isOpen, targetBand]);

  // Timer tick effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  if (!isOpen || !sprintPlan) return null;

  const currentStage = sprintPlan.stages[currentStageIdx] || sprintPlan.stages[0];

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSwitchStage = (idx) => {
    if (idx < 0 || idx >= sprintPlan.stages.length) return;
    setCurrentStageIdx(idx);
    const targetStage = sprintPlan.stages[idx];
    setSecondsRemaining(targetStage.durationSeconds);
    setIsTimerRunning(false);

    if (stageProgress) {
      const updated = { ...stageProgress, currentStageIndex: idx };
      setStageProgress(updated);
      saveTodaySprintProgress(updated);
    }
  };

  const handleCompleteCurrentStage = () => {
    if (!stageProgress) return;
    const completedArr = [...stageProgress.stageCompletedStatus];
    completedArr[currentStageIdx] = true;

    if (currentStageIdx < 2) {
      const nextIdx = currentStageIdx + 1;
      const updated = {
        ...stageProgress,
        currentStageIndex: nextIdx,
        stageCompletedStatus: completedArr
      };
      setStageProgress(updated);
      saveTodaySprintProgress(updated);
      handleSwitchStage(nextIdx);
    } else {
      // Completed full sprint
      recordSprintCompletion(sprintPlan);
      setStats(getSprintStats());
      setIsCelebrated(true);
    }
  };

  const handleSaveVocab = (v, idx) => {
    if (onSaveToVocabNotebook) {
      onSaveToVocabNotebook({
        id: `v-sprint-${Date.now()}-${idx}`,
        phrase: v.phrase,
        meaningVi: v.meaningVi,
        meaningEn: v.meaningEn || v.meaningVi,
        example: v.example,
        topic: 'Sprint C1'
      });
      setSavedVocabIds(prev => ({ ...prev, [idx]: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* ========================================================= */}
        {/* MODAL HEADER                                             */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-950/40">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {t('modals.sprint.title')}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {t('modals.sprint.badgeDaily', isEn ? 'Daily Sprint' : 'Sprint Hàng Ngày')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t('modals.sprint.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Streak Counter */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-600/50 text-amber-300 font-bold text-xs">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>
                {t(
                  'modals.sprint.streakLabel',
                  { count: stats.currentStreak },
                  isEn ? `Streak: ${stats.currentStreak} days` : `Streak: ${stats.currentStreak} ngày`
                )}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={t('modals.sprint.closeModal', isEn ? 'Close modal' : 'Đóng modal')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY (SCROLLABLE)                                   */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* CELEBRATION SCREEN IF COMPLETED */}
          {isCelebrated ? (
            <div className="py-8 px-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-950/60 ring-8 ring-emerald-500/20">
                <Award className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white">
                  {t(
                    'modals.sprint.celebrationTitle',
                    isEn 
                      ? "🎉 Excellent! You Completed Today's 30-Min Sprint!" 
                      : "🎉 Xuất Sắc! Bạn Đã Hoàn Thành Sprint 30 Phút Hôm Nay!"
                  )}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t(
                    'modals.sprint.celebrationDesc',
                    isEn
                      ? 'You eliminated error traps, practiced core skill mechanics, and consolidated C1 academic vocabulary.'
                      : 'Bạn đã triệt tiêu các bẫy lỗi sai, rèn luyện kỹ năng cốt lõi và nạp thêm từ vựng học thuật C1.'
                  )}
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    {t('modals.sprint.durationLabel', isEn ? 'Duration' : 'Thời lượng')}
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    {t('modals.sprint.durationValue', isEn ? '30 Mins' : '30 Phút')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    {t('modals.sprint.streakChainLabel', isEn ? 'Streak Chain' : 'Chuỗi Streak')}
                  </span>
                  <span className="text-xl font-black text-amber-400 flex items-center justify-center space-x-1">
                    <Flame className="w-4 h-4 fill-current inline" />
                    <span>
                      {t(
                        'modals.sprint.daysCount',
                        { count: stats.currentStreak },
                        isEn ? `${stats.currentStreak} days` : `${stats.currentStreak} ngày`
                      )}
                    </span>
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    {t('modals.sprint.totalSessionsLabel', isEn ? 'Total Sprints' : 'Tổng số phiên')}
                  </span>
                  <span className="text-xl font-black text-purple-400">
                    {t(
                      'modals.sprint.sessionsCount',
                      { count: stats.totalSprintsCompleted },
                      isEn ? `${stats.totalSprintsCompleted} sessions` : `${stats.totalSprintsCompleted} buổi`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-3">
                <button
                  onClick={() => setIsCelebrated(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {t('modals.sprint.reviewStages', isEn ? 'Review Stages' : 'Xem Lại Các Chặng')}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  {t('modals.sprint.completeAndClose', isEn ? 'Complete & Close' : 'Hoàn Tất & Đóng')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. AI COACH DIAGNOSIS BANNER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border border-purple-800/40 flex items-start space-x-3 shadow-lg">
                <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300 shrink-0 mt-0.5 border border-purple-500/40">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-purple-300 uppercase tracking-wider">
                      {t('modals.sprint.aiCoachDiagnosis', isEn ? 'AI Coach Diagnosis:' : 'Chẩn đoán Huấn luyện viên AI:')}
                    </span>
                    <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded-full font-bold border border-purple-700/40">
                      {t('modals.sprint.targetBandBadge', { band: targetBand }, isEn ? `Target Band ${targetBand}` : `Mục tiêu Band ${targetBand}`)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {isEn 
                      ? (sprintPlan.diagnosis?.diagnosisTextEn || sprintPlan.diagnosis?.diagnosisText) 
                      : sprintPlan.diagnosis?.diagnosisText}
                  </p>
                </div>
              </div>

              {/* 2. THREE-STAGE STEPPER */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {sprintPlan.stages.map((stg, idx) => {
                  const isActive = currentStageIdx === idx;
                  const isDone = stageProgress?.stageCompletedStatus?.[idx];

                  return (
                    <button
                      key={stg.id}
                      onClick={() => handleSwitchStage(idx)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-indigo-950/80 border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-2 ring-indigo-500/30'
                          : isDone
                          ? 'bg-slate-950/90 border-emerald-600/60 hover:bg-slate-800'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isDone 
                              ? 'bg-emerald-500 text-white' 
                              : isActive 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isDone ? '✓' : idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {isEn ? (stg.titleEn || stg.title) : stg.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block pl-7">
                          {t('modals.sprint.minsDuration', { mins: stg.durationMinutes }, isEn ? `⏱️ ${stg.durationMinutes} mins` : `⏱️ ${stg.durationMinutes} phút`)}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-indigo-400 rotate-90' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* 3. ACTIVE STAGE PRACTICE WORKSPACE */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 shadow-xl">
                
                {/* Stage Header & Timer Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {isEn ? (currentStage.badgeEn || currentStage.badge) : currentStage.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white">
                        {isEn ? (currentStage.titleEn || currentStage.title) : currentStage.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isEn ? (currentStage.subtitleEn || currentStage.subtitle) : currentStage.subtitle}
                    </p>
                  </div>

                  {/* Stopwatch / Countdown */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm font-black">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className={secondsRemaining <= 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                        {formatTimer(secondsRemaining)}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`p-2 rounded-xl text-white font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isTimerRunning
                          ? 'bg-amber-600 hover:bg-amber-500'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                      title={isTimerRunning ? t('modals.sprint.timerPause', isEn ? 'Pause stage timer' : 'Tạm dừng đếm giờ') : t('modals.sprint.timerStart', isEn ? 'Start stage timer' : 'Bắt đầu đếm giờ chặng')}
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setSecondsRemaining(currentStage.durationSeconds);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                      title={t('modals.sprint.timerReset', isEn ? 'Reset stage timer' : 'Đặt lại đồng hồ chặng')}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* STAGE 1 CONTENT: ERROR ELIMINATION QUIZ */}
                {currentStage.type === 'error_quiz' && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-300 block">
                      {t('modals.sprint.stage1Instruction', isEn ? '📝 Complete 3 error-correction quizzes to unlock the next stage:' : '📝 Hoàn thành 3 câu trắc nghiệm sửa lỗi bẫy để mở khóa chặng tiếp theo:')}
                    </span>
                    <div className="space-y-3.5">
                      {currentStage.questions.map((q, qIdx) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;
                        const isCorrect = selectedAnswers[q.id] === q.correctIndex;

                        return (
                          <div key={q.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-purple-300">
                                {t(
                                  'modals.sprint.stageQuestionHeader',
                                  { num: qIdx + 1, title: isEn ? (q.titleEn || q.title) : q.title },
                                  isEn ? `Question ${qIdx + 1}: ${q.titleEn || q.title}` : `Câu ${qIdx + 1}: ${q.title}`
                                )}
                              </span>
                              {isAnswered && (
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50' : 'bg-rose-950 text-rose-300 border border-rose-600/50'
                                }`}>
                                  {isCorrect 
                                    ? t('modals.sprint.stageCorrect', isEn ? '✓ Correct' : '✓ Đúng') 
                                    : t('modals.sprint.stageIncorrect', isEn ? '✗ Incorrect' : '✗ Sai')}
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-200 font-medium italic">
                              "{isEn ? (q.questionEn || q.question) : q.question}"
                            </p>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[q.id] === optIdx;
                                const isOptCorrect = q.correctIndex === optIdx;

                                let optStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300';
                                if (isAnswered) {
                                  if (isOptCorrect) {
                                    optStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-semibold';
                                  } else if (isSelected) {
                                    optStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                                      setShowExplanations(prev => ({ ...prev, [q.id]: true }));
                                    }}
                                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isAnswered && isOptCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {showExplanations[q.id] && (q.explanation || q.explanationEn) && (
                              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 space-y-1">
                                <span className="font-bold block">
                                  {t('modals.sprint.examinerExplanation', isEn ? '💡 Examiner Explanation:' : '💡 Giải thích của Giám khảo:')}
                                </span>
                                <p className="leading-relaxed">
                                  {isEn ? (q.explanationEn || q.explanation) : q.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STAGE 2 CONTENT: SPEAKING / WRITING INTENSIVE */}
                {currentStage.type === 'speaking_cuecard' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                          {t('modals.sprint.stage2SpeakingTitle', isEn ? 'Speaking Part 2 Sprint Cue Card:' : 'Đề thi Speaking Part 2 Nước Rút:')}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        "{currentStage.cueCard.topic}"
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-1">
                        {currentStage.cueCard.prompts.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 italic">
                        💡 {isEn ? (currentStage.cueCard.strategyEn || currentStage.cueCard.strategy) : currentStage.cueCard.strategy}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block">
                        {t('modals.sprint.stage2SpeakingNotesLabel', isEn ? '4-Box quick notes or reflex outline (Type quickly within 60s):' : 'Ghi chú 4 ô nhanh hoặc dàn ý phản xạ (Gõ nhanh trong 60 giây):')}
                      </label>
                      <textarea
                        value={stage2Text}
                        onChange={(e) => setStage2Text(e.target.value)}
                        placeholder={t('modals.sprint.stage2SpeakingNotesPlaceholder', isEn ? "1. Context: ...\n2. Action: ...\n3. Obstacles: ...\n4. Reflection/Outcome: ..." : "1. Bối cảnh: ...\n2. Hành động: ...\n3. Khó khăn: ...\n4. Cảm xúc/Hệ quả: ...")}
                        rows={4}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {currentStage.type === 'writing_paragraph' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2.5">
                      <div className="flex items-center space-x-2">
                        <PenTool className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                          {t('modals.sprint.stage2WritingTitle', isEn ? 'Writing Task 2 Prompt (Focus on PEEL Body Paragraph):' : 'Đề bài Writing Task 2 (Tập trung đoạn Thân bài PEEL):')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium">
                        "{currentStage.taskPrompt}"
                      </p>
                      <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <strong>{t('modals.sprint.suggestedFramework', isEn ? 'Suggested Framework:' : 'Khung gợi ý:')}</strong> {currentStage.suggestedTopicSentence}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">
                          {t('modals.sprint.stage2WritingLabel', isEn ? 'Drafting PEEL Body Paragraph:' : 'Khung soạn thảo đoạn Thân bài PEEL:')}
                        </label>
                        <span className="text-[11px] text-indigo-400 font-mono font-bold">
                          {t(
                            'modals.sprint.stage2WritingWordsTarget',
                            { count: stage2Text.split(/\s+/).filter(Boolean).length },
                            isEn 
                              ? `${stage2Text.split(/\s+/).filter(Boolean).length} words (Target: 70-95 words)` 
                              : `${stage2Text.split(/\s+/).filter(Boolean).length} từ (Mục tiêu: 70-95 từ)`
                          )}
                        </span>
                      </div>
                      <textarea
                        value={stage2Text}
                        onChange={(e) => setStage2Text(e.target.value)}
                        placeholder={t('modals.sprint.stage2WritingPlaceholder', isEn ? "Point: Begin with clear topic sentence...\nExplanation: Explain underlying mechanism...\nEvidence: Provide concrete example or data...\nLink: Reconnect back to prompt conclusion..." : "Point: Bắt đầu bằng câu chủ đề khẳng định luận điểm...\nExplanation: Giải thích cơ chế vì sao điều này xảy ra...\nEvidence: Đưa ra ví dụ cụ thể hoặc bằng chứng...\nLink: Móc nối hệ quả chốt lại đoạn văn...")}
                        rows={5}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* STAGE 3 CONTENT: LEXICAL CONSOLIDATION */}
                {currentStage.type === 'lexical_consolidation' && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-300 block">
                      {t('modals.sprint.stage3Instruction', isEn ? '💎 Save 3 academic C1/C2 collocations to your Notebook to complete the Sprint:' : '💎 Nạp 3 cụm từ vựng học thuật C1/C2 vào Sổ tay để hoàn thành Sprint:')}
                    </span>
                    <div className="space-y-3">
                      {currentStage.vocabItems.map((v, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-purple-300">{v.phrase}</span>
                              <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-800/40 font-bold">
                                Band {v.bandLevel}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {t('modals.sprint.meaningLabel', isEn ? 'Meaning:' : 'Nghĩa:')} <span className="text-slate-200">{isEn ? (v.meaningEn || v.meaningVi) : v.meaningVi}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 italic">
                              {t('modals.sprint.exampleLabel', isEn ? 'Example:' : 'Ví dụ:')} "{v.example}"
                            </p>
                          </div>

                          <button
                            onClick={() => handleSaveVocab(v, idx)}
                            disabled={savedVocabIds[idx]}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shrink-0 ${
                              savedVocabIds[idx]
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/50'
                            }`}
                          >
                            {savedVocabIds[idx] ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{t('modals.sprint.savedToNotebook', isEn ? 'Saved to Notebook' : 'Đã Lưu Sổ Tay')}</span>
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="w-3.5 h-3.5" />
                                <span>{t('modals.sprint.saveToNotebook', isEn ? 'Save to Notebook' : 'Lưu Vào Sổ Tay')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stage Bottom Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400">
                    {t(
                      'modals.sprint.stageProgressLabel',
                      { current: currentStageIdx + 1 },
                      isEn ? `Stage ${currentStageIdx + 1} / 3 • 30-Min Sprint` : `Chặng ${currentStageIdx + 1} / 3 • Sprint 30 Phút`
                    )}
                  </div>

                  <button
                    onClick={handleCompleteCurrentStage}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-950/50 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <span>
                      {currentStageIdx < 2 
                        ? t('modals.sprint.proceedNext', isEn ? 'Complete Stage & Proceed to Next' : 'Hoàn Thành Chặng & Sang Chặng Kế Tiếp') 
                        : t('modals.sprint.finishSprint', isEn ? "Complete Today's Sprint 🎉" : 'Hoàn Tất Sprint Hôm Nay 🎉')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
