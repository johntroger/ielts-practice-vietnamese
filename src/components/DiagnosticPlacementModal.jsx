import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Download, 
  RotateCcw, 
  ListTodo,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { 
  DIAGNOSTIC_QUESTIONS, 
  evaluateDiagnosticTest, 
  generate30DayStudyPlan 
} from '../utils/diagnosticPlacementEngine';
import { idbSet, idbGet, STORES } from '../utils/indexedDbStorage';
import { safeGet, safeSet } from '../utils/storageService';

export default function DiagnosticPlacementModal({
  isOpen,
  onClose,
  targetBand = '6.5',
  onApplyTargetBand,
  onOpenSkill
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 mins = 900s
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [studyPlan, setStudyPlan] = useState([]);
  const [selectedPlanWeek, setSelectedPlanWeek] = useState(1);
  const [completedDays, setCompletedDays] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  // Load existing saved diagnostic test or study plan on mount
  useEffect(() => {
    async function loadSavedPlan() {
      try {
        const savedResult = await idbGet(STORES.KEYVAL, 'ielts_latest_diagnostic_result', null) 
          || safeGet('ielts_latest_diagnostic_result', null);
        
        const savedPlan = await idbGet(STORES.KEYVAL, 'ielts_30_day_study_plan', null)
          || safeGet('ielts_30_day_study_plan', null);

        const savedCompleted = await idbGet(STORES.KEYVAL, 'ielts_study_plan_completed_days', {})
          || safeGet('ielts_study_plan_completed_days', {});

        if (savedResult) {
          setEvaluationResult(savedResult);
          setIsTestSubmitted(true);
        }
        if (savedPlan && Array.isArray(savedPlan)) {
          setStudyPlan(savedPlan);
        }
        if (savedCompleted) {
          setCompletedDays(savedCompleted);
        }
      } catch (e) {
        console.warn('Could not load saved diagnostic plan:', e);
      }
    }

    if (isOpen) {
      loadSavedPlan();
    }
  }, [isOpen]);

  // 15-minute countdown timer
  useEffect(() => {
    let timer = null;
    if (isOpen && !isTestSubmitted && isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isTestSubmitted, isTimerRunning, timeRemaining]);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (questionId, optionKey) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmitTest = async () => {
    setIsTimerRunning(false);
    const result = evaluateDiagnosticTest(userAnswers);
    const generatedPlan = generate30DayStudyPlan(result.estimatedOverallBand, targetBand, result.weaknesses);
    
    setEvaluationResult(result);
    setStudyPlan(generatedPlan);
    setIsTestSubmitted(true);

    // Save to IndexedDB and LocalStorage fallback
    try {
      await idbSet(STORES.KEYVAL, 'ielts_latest_diagnostic_result', result);
      await idbSet(STORES.KEYVAL, 'ielts_30_day_study_plan', generatedPlan);
      await idbSet(STORES.DIAGNOSTIC_RECORDS, `diag-${Date.now()}`, result);
    } catch (e) {}

    safeSet('ielts_latest_diagnostic_result', result);
    safeSet('ielts_30_day_study_plan', generatedPlan);
  };

  const handleRetakeTest = () => {
    if (!window.confirm('Bạn có chắc chắn muốn làm lại bài test định vị từ đầu?')) return;
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(15 * 60);
    setIsTimerRunning(true);
    setIsTestSubmitted(false);
    setEvaluationResult(null);
  };

  const handleToggleDayComplete = async (dayNumber) => {
    const updated = {
      ...completedDays,
      [dayNumber]: !completedDays[dayNumber]
    };
    setCompletedDays(updated);
    try {
      await idbSet(STORES.KEYVAL, 'ielts_study_plan_completed_days', updated);
    } catch (e) {}
    safeSet('ielts_study_plan_completed_days', updated);
  };

  const handleExportPlanJson = () => {
    const dataToExport = {
      diagnosticResult: evaluationResult,
      studyPlan,
      completedDays,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IELTS_30_Day_Study_Plan_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Filter plan by selected week
  const weekPlan = useMemo(() => {
    return studyPlan.filter(p => p.week === selectedPlanWeek);
  }, [studyPlan, selectedPlanWeek]);

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const planProgressPercent = Math.round((completedCount / 30) * 100);

  const getSkillIcon = (skill) => {
    switch (skill) {
      case 'reading': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'listening': return <Headphones className="w-4 h-4 text-emerald-600" />;
      case 'writing': return <PenTool className="w-4 h-4 text-purple-600" />;
      case 'speaking': return <Mic className="w-4 h-4 text-amber-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 lg:p-3 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[98vw] 2xl:max-w-[1600px] h-[96dvh] max-h-[96dvh] flex flex-col overflow-hidden overscroll-contain">
        
        {/* HEADER */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-purple-50/70 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                <span>Kiểm Tra Định Vị 15 Phút & Lộ Trình 30 Ngày</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Cambridge Diagnostic
                </span>
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Định vị Band năng lực đầu vào • Chẩn đoán bẫy lỗi • Thiết kế lộ trình 30 ngày cá nhân hóa
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Timer Display (During Test) */}
            {!isTestSubmitted && (
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border transition-colors ${
                timeRemaining <= 180 
                  ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                  : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* =============================================================== */}
          {/* MODE 1: TEST TAKING VIEW                                        */}
          {/* =============================================================== */}
          {!isTestSubmitted ? (
            <div className="space-y-4 max-w-5xl mx-auto">
              {/* Question Navigation & Progress Bar */}
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    {getSkillIcon(currentQ.skill)}
                    <span className="font-bold text-slate-800">{currentQ.skillLabel}</span>
                    <span className="text-slate-400">•</span>
                    <span>Câu {currentQuestionIndex + 1} / {totalQuestions}</span>
                  </div>
                  <span className="text-blue-600 font-bold">
                    Đã làm: {answeredCount}/{totalQuestions} câu
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>

                {/* Quick Question Selector Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5">
                  {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-xs'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={`Chuyển tới câu ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      {currentQ.skill.toUpperCase()}
                    </span>
                    <span>{currentQ.title}</span>
                  </h3>
                </div>

                {/* Passage / Context Box */}
                {currentQ.passage && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                    {currentQ.passage}
                  </div>
                )}

                {/* Question Prompt */}
                <div className="text-xs sm:text-sm font-bold text-slate-800 pt-1">
                  {currentQ.question}
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-1">
                  {currentQ.options.map(opt => {
                    const isSelected = userAnswers[currentQ.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                        className={`w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start space-x-3 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}>
                          {opt.key.length <= 2 ? opt.key : opt.key[0]}
                        </span>
                        <span className="flex-1 leading-normal">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Next / Back Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                      className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Câu tiếp</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitTest}
                      className="flex items-center space-x-1 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-colors animate-pulse"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hoàn Thành & Chấm Điểm</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Submit Warning if not all answered */}
              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Bài test gồm 16 câu hỏi chuẩn Cambridge giúp định vị chính xác điểm mạnh và bẫy lỗi.</span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300 font-bold rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  Nộp bài ngay
                </button>
              </div>
            </div>
          ) : (
            /* =============================================================== */
            /* MODE 2: DIAGNOSTIC RESULTS & 30-DAY ADAPTIVE STUDY PLAN         */
            /* =============================================================== */
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* 1. Score Summary Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                    <Award className="w-4 h-4" />
                    <span>Kết Quả Đánh Giá Năng Lực Đầu Vào</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    Band Điểm Ước Tính: Band {evaluationResult?.estimatedOverallBand.toFixed(1)}
                  </h3>
                  <p className="text-xs text-blue-100 max-w-md leading-relaxed">
                    Bạn trả lời chính xác <span className="font-bold text-white">{evaluationResult?.totalCorrect}/{evaluationResult?.totalQuestions} câu</span> ({evaluationResult?.overallPercentage}%). Hệ thống đã tự động phân tích và tạo Lộ trình 30 ngày để nâng Band lên mục tiêu {targetBand}!
                  </p>
                </div>

                {/* Sub-bands Cards */}
                <div className="grid grid-cols-4 gap-2 w-full md:w-auto shrink-0">
                  {['reading', 'listening', 'writing', 'speaking'].map(sKey => {
                    const s = evaluationResult?.skillStats[sKey];
                    return (
                      <div key={sKey} className="bg-white/10 backdrop-blur-xs border border-white/20 p-2.5 rounded-xl text-center">
                        <div className="text-[10px] text-blue-100 uppercase font-bold">{s?.label}</div>
                        <div className="text-base sm:text-lg font-black">{s?.band.toFixed(1)}</div>
                        <div className="text-[10px] text-blue-200">{s?.correct}/4 đúng</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Weakness Diagnosis & Actionable Insights */}
              {evaluationResult?.weaknesses && evaluationResult.weaknesses.length > 0 && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Các Điểm Yếu Cần Tập Trung Khắc Phục (Priority Deficiencies)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {evaluationResult.weaknesses.map((w, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1">
                          <span>⚠️ {w.title}</span>
                        </div>
                        <p className="text-amber-800 leading-relaxed text-[11px]">{w.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. 30-Day Adaptive Study Plan Section */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Lộ Trình Học Tập Cá Nhân Hóa 30 Ngày</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Tiến độ: Hoàn thành {completedCount}/30 ngày ({planProgressPercent}%)
                    </p>
                  </div>

                  {/* Export and Retake Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleExportPlanJson}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-2xs"
                      title="Xuất file JSON lưu trữ lộ trình"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Xuất Lộ Trình</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRetakeTest}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                      title="Làm lại bài test định vị 15 phút"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm Lại</span>
                    </button>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${planProgressPercent}%` }}
                  />
                </div>

                {/* Week Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-xl">
                  {[1, 2, 3, 4].map(wNum => {
                    const isSelected = selectedPlanWeek === wNum;
                    const weekDays = studyPlan.filter(p => p.week === wNum);
                    const weekDone = weekDays.filter(d => completedDays[d.day]).length;
                    return (
                      <button
                        key={wNum}
                        type="button"
                        onClick={() => setSelectedPlanWeek(wNum)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-white text-blue-700 shadow-2xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <div>Tuần {wNum}</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          {weekDone}/{weekDays.length} ngày
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Daily Task List for Selected Week */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {weekPlan.map(item => {
                    const isDone = !!completedDays[item.day];
                    return (
                      <div
                        key={item.day}
                        className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                          isDone 
                            ? 'bg-emerald-50/50 border-emerald-200 opacity-90' 
                            : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                        }`}
                      >
                        {/* Interactive Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleDayComplete(item.day)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border cursor-pointer transition-colors shrink-0 ${
                            isDone 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                          title={isDone ? "Bấm để bỏ đánh dấu hoàn thành" : "Bấm để đánh dấu đã hoàn thành ngày này"}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                Ngày {item.day}: {item.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-[11px]">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                                ⏱️ {item.duration}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {item.taskDescription}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Detailed Question Review Accordion */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <span>Xem Lại Chi Tiết 16 Câu Hỏi Định Vị & Giải Thích Barem</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {evaluationResult?.detailedQuestions?.map((dq, idx) => (
                    <div 
                      key={dq.id} 
                      className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                        dq.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{dq.isCorrect ? '✅' : '❌'} {dq.title}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{dq.explanation}</p>
                      </div>
                      <div className="text-right shrink-0 font-bold">
                        <span className={dq.isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                          Đáp án: {dq.correctAnswer}
                        </span>
                        {dq.userAnswer && !dq.isCorrect && (
                          <div className="text-slate-400 text-[10px]">Bạn chọn: {dq.userAnswer}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dữ liệu lưu trữ tự động trên IndexedDB (vượt giới hạn 5MB của trình duyệt)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
