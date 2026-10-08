import React, { useState, useMemo } from 'react';
import { 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  FileDown, 
  Printer, 
  BookMarked, 
  TrendingUp, 
  X,
  Layers,
  Check,
  RefreshCw,
  Zap,
  Target,
  ShieldAlert,
  Edit3,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { openTheoryModalWithContext } from '../services/theoryContextService';
import { useTranslation } from '../i18n';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { exportToWord, printFormattedReport } from '../services/exportService';
import { scoreUserRewrite } from '../utils/rewriteScorer';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function FeedbackModal({
  isOpen,
  onClose,
  evaluation,
  task,
  essayText,
  stats,
  onSaveToMistakeLog,
  onSaveToVocabNotebook,
  onOpenRevision,
  onReEvaluateWithAI
}) {
  if (!isOpen || !evaluation) return null;

  const { t, isEn } = useTranslation();
  const [activeTab, setActiveTab] = useState('criteria'); // 'criteria' | 'corrections' | 'rewrite' | 'vocab'
  const [savedVocabs, setSavedVocabs] = useState({});
  const [savedMistakes, setSavedMistakes] = useState({});
  const [expandedRewrites, setExpandedRewrites] = useState({});
  const [userRewrites, setUserRewrites] = useState({});
  const [rewriteResults, setRewriteResults] = useState({});
  // ZPD Adaptive Pedagogical Focus State: 'all' | 'foundation' | 'advanced'
  const [pedagogicalFocus, setPedagogicalFocus] = useState('all');
  // Band Stepping Rewrite Mode: '6.5' | '8.5'
  const [selectedRewriteBand, setSelectedRewriteBand] = useState('8.5');

  const filteredCorrections = useMemo(() => {
    const list = evaluation.corrections || [];
    if (pedagogicalFocus === 'all') return list;
    if (pedagogicalFocus === 'foundation') {
      // Prioritize foundational grammar, punctuation, sentence fragments, spelling
      return [...list].sort((a, b) => {
        const isAGrammar = /grammar|spelling|punctuation|verb|tense/i.test(a.type || '');
        const isBGrammar = /grammar|spelling|punctuation|verb|tense/i.test(b.type || '');
        if (isAGrammar && !isBGrammar) return -1;
        if (!isAGrammar && isBGrammar) return 1;
        return 0;
      });
    }
    if (pedagogicalFocus === 'advanced') {
      // Prioritize vocabulary, style, hedging, cohesion
      return [...list].sort((a, b) => {
        const isAAdv = /vocab|lexical|style|cohesion|tone|hedging/i.test(a.type || '');
        const isBAdv = /vocab|lexical|style|cohesion|tone|hedging/i.test(b.type || '');
        if (isAAdv && !isBAdv) return -1;
        if (!isAAdv && isBAdv) return 1;
        return 0;
      });
    }
    return list;
  }, [evaluation.corrections, pedagogicalFocus]);

  // Compute 3-Second Action Takeaway (High-Impact Quick Wins for Fast +0.5 Band Leap)
  const actionTakeaway = useMemo(() => {
    let p1 = evaluation.actionPlan?.priority1;
    let p2 = evaluation.actionPlan?.priority2;
    let p3 = evaluation.actionPlan?.priority3;
    let targetBand = evaluation.actionPlan?.estimatedBandTarget;

    const criteriaEntries = Object.entries(evaluation.criteria || {});
    const sortedCriteria = [...criteriaEntries].sort((a, b) => (a[1]?.band || 0) - (b[1]?.band || 0));
    const weakest = sortedCriteria[0];
    const secondWeakest = sortedCriteria[1];

    if (!p1) {
      if (task?.taskNumber === 1 && evaluation.task1OverviewStats && !evaluation.task1OverviewStats.hasOverview) {
        p1 = isEn
          ? 'Add an Overview sentence starting with "Overall, it is clear that...". Missing an overview caps Task Achievement at Band 5.0.'
          : 'Bổ sung ngay câu Overview tổng quan mở đầu bằng "Overall, it is clear that...". Thiếu Overview sẽ bị khống chế tối đa Band 5.0 Task Achievement.';
      } else if (task?.taskNumber === 2 && evaluation.hedgingStats?.hasOvergeneralisation) {
        p1 = isEn
          ? 'Eliminate absolute overgeneralisations (always, undeniable...). Use academic hedging (tends to, appears to) to surpass Band 6.0.'
          : 'Loại bỏ các phát ngôn khẳng định tuyệt đối (always, undeniable...). Thay bằng ngôn ngữ dè dặt học thuật (tends to, appears to) để thoát trần Band 6.0.';
      } else if (weakest && weakest[1]?.improvements?.[0]) {
        const name = weakest[0] === 'tr' ? 'Task Response' : weakest[0] === 'cc' ? 'Coherence & Cohesion' : weakest[0] === 'lr' ? 'Lexical Resource' : 'Grammar';
        p1 = isEn
          ? `Upgrade bottleneck ${name} (currently Band ${weakest[1]?.band?.toFixed(1) || '6.0'}): ${weakest[1]?.improvements[0]}`
          : `Nâng cấp điểm nghẽn ${name} (hiện Band ${weakest[1]?.band?.toFixed(1) || '6.0'}): ${weakest[1]?.improvements[0]}`;
      } else {
        p1 = isEn
          ? 'Correct foundational grammar and verb tense errors to ensure overall sentence accuracy.'
          : 'Khắc phục các lỗi ngữ pháp và chia động từ cơ bản để đảm bảo độ chuẩn xác toàn bài.';
      }
    }

    if (!p2) {
      if (secondWeakest && secondWeakest[1]?.improvements?.[0]) {
        const name = secondWeakest[0] === 'tr' ? 'Task Response' : secondWeakest[0] === 'cc' ? 'Coherence & Cohesion' : secondWeakest[0] === 'lr' ? 'Lexical Resource' : 'Grammar';
        p2 = isEn
          ? `Improve ${name}: ${secondWeakest[1]?.improvements[0]}`
          : `Cải thiện tiêu chí ${name}: ${secondWeakest[1]?.improvements[0]}`;
      } else if (evaluation.corrections && evaluation.corrections.length > 0) {
        p2 = isEn
          ? `Fix ${Math.min(3, evaluation.corrections.length)} prominent word choice and grammatical slips in your essay.`
          : `Sửa ${Math.min(3, evaluation.corrections.length)} lỗi dùng từ / cấu trúc nổi cộm trong bài viết.`;
      } else {
        p2 = isEn
          ? 'Diversify academic vocabulary by topic and incorporate natural collocations.'
          : 'Đa dạng hóa vốn từ vựng học thuật theo chủ đề và sử dụng collocations tự nhiên.';
      }
    }

    if (!p3) {
      p3 = isEn
        ? 'Reinforce paragraph cohesion following the P.E.E.L framework (Point - Explain - Example - Link).'
        : 'Rèn luyện liên kết ý giữa các đoạn văn mạch lạc theo cấu trúc P.E.E.L (Point - Explain - Example - Link).';
    }

    const currentOverall = evaluation.overallBand || 6.5;
    const potentialBand = Math.min(9.0, Math.round((currentOverall + 0.5) * 2) / 2);
    if (!targetBand) {
      targetBand = isEn
        ? `Target roadmap: Boost from Band ${currentOverall.toFixed(1)} to Band ${potentialBand.toFixed(1)} - ${(potentialBand + 0.5).toFixed(1)} once these 3 areas are addressed.`
        : `Lộ trình mục tiêu: Tăng từ Band ${currentOverall.toFixed(1)} lên Band ${potentialBand.toFixed(1)} - ${(potentialBand + 0.5).toFixed(1)} khi khắc phục triệt để 3 điểm trên.`;
    }

    return {
      priority1: p1,
      priority2: p2,
      priority3: p3,
      targetBand,
      currentOverall,
      potentialBand
    };
  }, [evaluation, task, isEn]);

  const trBand = evaluation.criteria?.tr?.band || 6.0;
  const ccBand = evaluation.criteria?.cc?.band || 6.0;
  const lrBand = evaluation.criteria?.lr?.band || 6.0;
  const graBand = evaluation.criteria?.gra?.band || 6.0;

  // Radar Chart Data
  const radarData = {
    labels: ['Task Response (TR)', 'Coherence & Cohesion (CC)', 'Lexical Resource (LR)', 'Grammar Range & Acc (GRA)'],
    datasets: [
      {
        label: isEn ? 'Your Band Score' : 'Band Score của bạn',
        data: [trBand, ccBand, lrBand, graBand],
        backgroundColor: 'rgba(217, 26, 42, 0.2)',
        borderColor: '#D91A2A',
        pointBackgroundColor: '#D91A2A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#D91A2A'
      },
      {
        label: isEn ? 'Band 8.0 Target' : 'Mục tiêu Band 8.0',
        data: [8, 8, 8, 8],
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderDash: [4, 4],
        pointRadius: 0
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 9,
        ticks: { stepSize: 1.5, font: { size: 10 } },
        pointLabels: { font: { size: 11, weight: 'bold' }, color: '#334155' }
      }
    },
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
    }
  };

  const handleSaveVocab = (v, idx) => {
    onSaveToVocabNotebook({
      phrase: v.phrase || v.word,
      meaningVi: v.meaningVi || v.meaning,
      example: v.example || `Used in Task: ${task.title}`,
      topic: task.topic || 'General'
    });
    setSavedVocabs(prev => ({ ...prev, [idx]: true }));
  };

  const handleSaveMistake = (c, idx) => {
    onSaveToMistakeLog({
      original: c.original,
      corrected: c.corrected,
      type: c.type,
      explanation: c.explanation,
      taskTitle: task.title,
      date: new Date().toISOString()
    });
    setSavedMistakes(prev => ({ ...prev, [idx]: true }));
  };

  const handleToggleRewrite = (idx) => {
    setExpandedRewrites(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleRewriteChange = (idx, text) => {
    setUserRewrites(prev => ({ ...prev, [idx]: text }));
  };

  const handleCheckRewrite = (c, idx) => {
    const text = userRewrites[idx] || '';
    const res = scoreUserRewrite(text, c.original, c.corrected);
    setRewriteResults(prev => ({ ...prev, [idx]: res }));
  };

  const handleCopySuggestion = (c, idx) => {
    setUserRewrites(prev => ({ ...prev, [idx]: c.corrected }));
    const res = scoreUserRewrite(c.corrected, c.original, c.corrected);
    setRewriteResults(prev => ({ ...prev, [idx]: res }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold truncate">
                  {isEn ? 'Assessment & Diagnostic Report' : 'Báo Cáo Đánh Giá Bài Thi'}
                  <span className="hidden sm:inline font-normal text-slate-400 text-xs ml-1.5">(Cambridge Rubric)</span>
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shrink-0">
                  BAND {evaluation.overallBand ? evaluation.overallBand.toFixed(1) : '7.0'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  Task {task.taskNumber}: {task.title} • {stats?.wordCount || 0} {isEn ? 'words' : 'từ'} • {isEn ? 'Time' : 'Thời gian'}: {stats?.timeSpent || 'N/A'}
                </p>
                {evaluation.evaluationMethod === 'algorithmic' ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-[11px] font-semibold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{isEn ? 'Algorithmic Engine (Cambridge Standard)' : 'Chấm Bằng Máy (Cambridge Algorithm)'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] sm:text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>{isEn ? 'Cambridge AI Examiner' : 'Chấm Bởi Giám Khảo AI'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800 overflow-x-auto no-scrollbar">
            {/* Re-evaluate with AI button if currently graded by algorithm */}
            {evaluation.evaluationMethod === 'algorithmic' && onReEvaluateWithAI && (
              <button
                onClick={onReEvaluateWithAI}
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                title={isEn ? "Re-evaluate with Cambridge AI" : "Chấm lại bài viết này bằng Trí tuệ nhân tạo AI"}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="sm:hidden">{isEn ? 'AI Regrade' : 'Chấm Lại AI'}</span>
                <span className="hidden sm:inline">{isEn ? 'Re-Evaluate with AI' : 'Chấm Lại Bằng AI'}</span>
              </button>
            )}

            {/* Version 2 Rewrite Trigger Button */}
            {onOpenRevision && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRevision();
                }}
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                title={isEn ? "Second-draft revision to boost band" : "Luyện viết lại lần 2 để nâng band"}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('feedback.actions.rewriteV2', null, 'Viết Lại v2')}</span>
              </button>
            )}

            <button
              onClick={() => exportToWord({ task, essayText, evaluation, stats })}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
              title={isEn ? "Export to Word (.doc)" : "Xuất bài ra file Word .doc"}
            >
              <FileDown className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{t('feedback.actions.exportWord', null, 'Xuất Word')}</span>
            </button>
            <button
              onClick={printFormattedReport}
              className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0 cursor-pointer"
              title={isEn ? "Print / Save as PDF" : "In / Lưu thành PDF"}
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title={isEn ? "Close results" : "Đóng bảng kết quả"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Fallback Notice Banner */}
        {evaluation.fallbackNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{evaluation.fallbackNotice}</span>
            </div>
            {onReEvaluateWithAI && (
              <button
                onClick={onReEvaluateWithAI}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors"
              >
                {t('feedback.actions.retryAi', null, 'Thử lại AI')}
              </button>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'criteria' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t('feedback.tabs.criteria', null, '4 Tiêu Chí & Lộ Trình')}
          </button>
          <button
            onClick={() => setActiveTab('paragraphs')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
              activeTab === 'paragraphs' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>{t('feedback.tabs.paragraphs', null, 'Mổ Xẻ Từng Đoạn')}</span>
            {evaluation.paragraphAnalysis && evaluation.paragraphAnalysis.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                {evaluation.paragraphAnalysis.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
              activeTab === 'corrections' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>{t('feedback.tabs.corrections', null, 'Soi Lỗi Từng Câu')}</span>
            {evaluation.corrections && evaluation.corrections.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px]">
                {evaluation.corrections.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rewrite')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'rewrite' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t('feedback.tabs.rewrites', null, 'Bản Nâng Cấp Band 8.5+')}
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'vocab' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t('feedback.tabs.vocab', null, 'Từ Vựng Vàng Trích Xuất')}
          </button>
        </div>

        {/* ZPD Pedagogical Adaptive Focus Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-700 font-semibold shrink-0">
            <Target className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{t('feedback.zpd.title', null, 'Mục tiêu sư phạm (ZPD):')}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setPedagogicalFocus('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                pedagogicalFocus === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {t('feedback.zpd.all', null, 'Toàn diện (Tất cả)')}
            </button>
            <button
              type="button"
              onClick={() => setPedagogicalFocus('foundation')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                pedagogicalFocus === 'foundation'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span>{t('feedback.zpd.foundation', null, '🎯 Nền tảng (Band 5.5 - 6.5)')}</span>
            </button>
            <button
              type="button"
              onClick={() => setPedagogicalFocus('advanced')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                pedagogicalFocus === 'advanced'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200'
              }`}
            >
              <span>{t('feedback.zpd.advanced', null, '🚀 Bứt phá (Band 7.5+)')}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: 4 CRITERIA & 3-SECOND ACTIONABLE FEEDBACK */}
          {activeTab === 'criteria' && (
            <div className="space-y-6">
              
              {/* ========================================================================= */}
              {/* 1. HERO TAKEAWAY: 3-SECOND SKIMMABLE ACTION PLAN                         */}
              {/* ========================================================================= */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-indigo-900/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 shrink-0">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base lg:text-lg tracking-wide text-white">
                          {isEn ? '3-Second Action Plan' : 'Kế Hoạch Hành Động 3 Giây (3-Second Action Plan)'}
                        </h3>
                        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                          {isEn ? 'Band Upgrade Strategy' : 'Chiến Lược Tăng Band'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-normal">
                        {isEn ? '3 pivotal bottlenecks to fix immediately for a +0.5 to 1.0 Band leap' : '3 điểm mấu chốt cần sửa ngay để nâng từ +0.5 đến 1.0 Band điểm'}
                      </p>
                    </div>
                  </div>

                  {/* Band Leap Progress Pill */}
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shrink-0 self-start sm:self-auto">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-medium">{isEn ? 'Current' : 'Hiện tại'}</span>
                      <strong className="text-xs sm:text-sm text-white font-extrabold">Band {actionTakeaway.currentOverall.toFixed(1)}</strong>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-400 block font-medium">{isEn ? 'Target Potential' : 'Tiềm năng'}</span>
                      <strong className="text-xs sm:text-sm text-emerald-300 font-extrabold">
                        Band {actionTakeaway.potentialBand.toFixed(1)} - {(actionTakeaway.potentialBand + 0.5).toFixed(1)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 3 Prioritized Action Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Card 1: Critical Bottleneck */}
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex flex-col justify-between space-y-2.5 transition-all hover:bg-red-950/60">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider">
                          {isEn ? 'PRIORITY 1 • SCORE CEILING BOTTLENECK' : 'ƯU TIÊN 1 • CHẶN TRẦN ĐIỂM'}
                        </span>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {actionTakeaway.priority1}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('corrections')}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-300 hover:text-white transition-colors cursor-pointer pt-1"
                    >
                      <span>{isEn ? 'Inspect error breakdown' : 'Xem lỗi cần sửa'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Card 2: High Leverage */}
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 flex flex-col justify-between space-y-2.5 transition-all hover:bg-amber-950/60">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-black text-[9px] uppercase tracking-wider">
                          {isEn ? 'PRIORITY 2 • COHESION & VOCABULARY' : 'ƯU TIÊN 2 • MẠCH LẠC & TỪ VỰNG'}
                        </span>
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {actionTakeaway.priority2}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('rewrite')}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors cursor-pointer pt-1"
                    >
                      <span>{isEn ? 'Study Band 8.5+ model' : 'Học bài mẫu 8.5+'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Card 3: Academic Polish */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex flex-col justify-between space-y-2.5 transition-all hover:bg-emerald-950/60">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider">
                          {isEn ? 'PRIORITY 3 • ADVANCED SYNTAX REFINEMENT' : 'ƯU TIÊN 3 • TINH TẾ HÓA CÂU'}
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {actionTakeaway.priority3}
                      </p>
                    </div>
                    {onOpenRevision ? (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenRevision();
                        }}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer pt-1"
                      >
                        <span>{isEn ? 'Write version 2 draft' : 'Viết lại bản v2'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab('rewrite')}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer pt-1"
                      >
                        <span>{isEn ? 'View side-by-side comparison' : 'Xem đối chiếu bản sửa'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Quick-Action CTAs Bar */}
                <div className="pt-2 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-300 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{actionTakeaway.targetBand}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveTab('corrections')}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      {isEn ? `🔍 Inspect ${evaluation.corrections?.length || 0} Line Errors` : `🔍 Soi ${evaluation.corrections?.length || 0} Lỗi Chi Tiết`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('rewrite')}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      {isEn ? '📖 Read Band 8.5+ Model' : '📖 Đọc Bài Mẫu Band 8.5+'}
                    </button>
                    {onOpenRevision && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenRevision();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{isEn ? 'Draft Revision v2' : 'Viết Lại Bản v2'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 2. 4 CRITERIA BENTO GRID WITH BAND PROGRESS BARS                           */}
              {/* ========================================================================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <Award className="w-4 h-4 text-red-600" />
                    <span>{isEn ? 'Detailed Cambridge Assessment Breakdown:' : 'Chi Tiết 4 Tiêu Chí Chấm Khảo Thí Cambridge:'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    {isEn ? 'Band scale 0 - 9.0 • Standard benchmarks at 6.0 & 7.0' : 'Thang điểm tối đa 9.0 • Vạch mốc chuẩn 6.0 & 7.0'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(evaluation.criteria || {}).map(([key, data]) => {
                    const band = typeof data.band === 'number' ? data.band : 6.0;
                    const progressPercent = Math.min(100, Math.max(12, (band / 9) * 100));
                    const isHighBand = band >= 7.0;
                    const isMidBand = band >= 6.0 && band < 7.0;

                    return (
                      <div 
                        key={key} 
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div className="space-y-2">
                          {/* Criteria Header */}
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                              {key === 'tr' ? 'Task Response (TR)' :
                               key === 'cc' ? 'Coherence & Cohesion (CC)' :
                               key === 'lr' ? 'Lexical Resource (LR)' : 'Grammar Range & Accuracy (GRA)'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full font-black text-xs border ${
                              isHighBand ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              isMidBand ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              'bg-rose-50 text-rose-800 border-rose-200'
                            }`}>
                              Band {band.toFixed(1)}
                            </span>
                          </div>

                          {/* Visual Band Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isHighBand ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                  isMidBand ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                  'bg-gradient-to-r from-rose-500 to-amber-500'
                                }`} 
                                style={{ width: `${progressPercent}%` }} 
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                              <span>0.0</span>
                              <span className="text-slate-500">{isEn ? 'Band 6.0' : 'Mốc 6.0'}</span>
                              <span className="text-slate-500">{isEn ? 'Band 7.0' : 'Mốc 7.0'}</span>
                              <span>9.0</span>
                            </div>
                          </div>

                          {/* Examiner Feedback */}
                          <p className="text-xs text-slate-600 leading-relaxed pt-1">
                            {data.feedback}
                          </p>
                        </div>

                        {/* Improvements Bullet Points */}
                        {data.improvements && data.improvements.length > 0 && (
                          <div className="pt-2.5 border-t border-slate-100 text-[11px] space-y-1.5 bg-slate-50/60 p-2.5 rounded-lg">
                            <span className="font-bold block text-slate-800 flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3 text-amber-600" />
                              <span>{isEn ? 'Key areas for band growth:' : 'Điểm cần hoàn thiện để lên band:'}</span>
                            </span>
                            <ul className="space-y-1 text-slate-600">
                              {data.improvements.map((imp, i) => (
                                <li key={i} className="flex items-start space-x-1.5">
                                  <span className="text-amber-600 font-bold shrink-0">•</span>
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {(() => {
                          const getCriteriaGuide = (cKey) => {
                            if (cKey === 'tr') {
                              return task?.taskNumber === 1
                                ? { topicId: 'task1-mastery', skill: 'writing', category: 'task1', title: 'Master Toàn Diện Task 1 (Overview & Band Descriptors)', label: 'Cẩm Nang Overview & TA', labelEn: 'Overview & TA Handbook' }
                                : { topicId: 'task2-peel-structure', skill: 'writing', category: 'task2', title: 'Cấu Trúc Đoạn Văn PEEL & Dàn Bài Toàn Diện Task 2', label: 'Cẩm Nang Lập Luận TR', labelEn: 'TR Argumentation Handbook' };
                            }
                            if (cKey === 'cc') return { topicId: 'writing-cc-thematic-progression', skill: 'writing', category: 'strategy', title: 'Tiêu Chí Coherence & Cohesion 8.0+', label: 'Cẩm Nang Liên Kết CC 8.0+', labelEn: 'Cohesion 8.0+ Handbook' };
                            if (cKey === 'lr') return { topicId: 'writing-academic-collocations-topics', skill: 'writing', category: 'strategy', title: 'Top 60 Academic Collocations "Ăn Điểm"', label: 'Cẩm Nang Collocations LR', labelEn: 'Collocations Handbook' };
                            if (cKey === 'gra') return { topicId: 'academic-hedging', skill: 'writing', category: 'strategy', title: 'Academic Hedging & Bộ Cấu Trúc Ngữ Pháp 8.0+', label: 'Cẩm Nang Ngữ Pháp GRA 8.0+', labelEn: 'Grammar 8.0+ Handbook' };
                            return null;
                          };
                          const guide = getCriteriaGuide(key);
                          if (!guide) return null;
                          return (
                            <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => openTheoryModalWithContext(guide)}
                                className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                                title={isEn ? "View deep strategy handbook for this criterion" : "Xem cẩm nang chuyên sâu khắc phục điểm nghẽn tiêu chí này"}
                              >
                                <BookOpen className="w-3 h-3 text-blue-600 shrink-0" />
                                <span>{isEn ? `Band boost handbook: ${guide.labelEn || guide.label} ➔` : `Bí kíp nâng band: ${guide.label} ➔`}</span>
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 3. DIAGNOSTIC GATEKEEPER INSPECTORS (Task 1 & Task 2)                    */}
              {/* ========================================================================= */}

              {/* Task 1: Cambridge Overview Gatekeeper Inspector */}
              {task?.taskNumber === 1 && evaluation.task1OverviewStats && (
                <div className={`p-4 rounded-xl border transition-all ${
                  !evaluation.task1OverviewStats.hasOverview
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : evaluation.task1OverviewStats.hasRawData
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                    <div className="flex items-center space-x-2">
                      {!evaluation.task1OverviewStats.hasOverview ? (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                      ) : evaluation.task1OverviewStats.hasRawData ? (
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-bold text-sm">
                        {!evaluation.task1OverviewStats.hasOverview
                          ? (isEn ? 'CAMBRIDGE RUBRIC WARNING: MISSING OVERVIEW' : 'CẢNH BÁO BAREM CAMBRIDGE: THIẾU ĐOẠN TỔNG QUAN (OVERVIEW)')
                          : evaluation.task1OverviewStats.hasRawData
                          ? (isEn ? 'DATA TRAP IN OVERVIEW: BAND 5.5 - 6.0 CEILING' : 'BẪY SỐ LIỆU ĐOẠN OVERVIEW: KHỐNG CHẾ TRẦN BAND 5.5 - 6.0')
                          : (isEn ? 'STANDARD CAMBRIDGE OVERVIEW (BAND 7.0+)' : 'ĐOẠN TỔNG QUAN (OVERVIEW) ĐẠT CHUẨN KHẢO THÍ (BAND 7.0+)')}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold ${
                      !evaluation.task1OverviewStats.hasOverview
                        ? 'bg-red-200 text-red-900'
                        : evaluation.task1OverviewStats.hasRawData
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {!evaluation.task1OverviewStats.hasOverview 
                        ? (isEn ? 'Max Band 5.0' : 'Tối đa Band 5.0') 
                        : evaluation.task1OverviewStats.hasRawData 
                        ? (isEn ? 'Max Band 6.0' : 'Tối đa Band 6.0') 
                        : 'Band 7.0+'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {!evaluation.task1OverviewStats.hasOverview
                      ? (isEn 
                          ? 'Per official Cambridge Task 1 criteria, essays with no clear Overview are capped at Band 5.0 Task Achievement ("Presents no overview"). Always begin the overview with "Overall, it is clear that..." and highlight 2 key prominent features.' 
                          : 'Theo quy định chính thức của Cambridge IELTS Task 1, bài viết không có câu hoặc đoạn Overview rõ ràng sẽ bị khống chế điểm Task Achievement ở mức tối đa Band 5.0 (Presents no overview). Hãy luôn mở đầu đoạn tổng quan bằng "Overall, it is clear that..." và nêu 2 đặc điểm cốt lõi nhất.')
                      : evaluation.task1OverviewStats.hasRawData
                      ? (isEn 
                          ? `An overview was identified but includes specific data figures (${evaluation.task1OverviewStats.rawDataList?.slice(0, 3).join(', ')}). Cambridge rubrics mandate that overviews only summarize overarching trends or contrasts without granular statistics, capping Task Achievement at Band 5.5 - 6.0.` 
                          : `Đoạn Overview đã được nhận diện nhưng có chứa số liệu chi tiết cụ thể (${evaluation.task1OverviewStats.rawDataList?.slice(0, 3).join(', ')}). Barem Cambridge quy định Overview chỉ được khái quát xu hướng/điểm đối lập, TUYỆT ĐỐI KHÔNG ĐƯA SỐ LIỆU VỤN VẶT khiến điểm Task Achievement bị chặn ở Band 5.5 - 6.0.`)
                      : (isEn 
                          ? 'Exemplary Overview: Effectively summarizes major trends and key features without getting bogged down in granular data, meeting Band 7.0+ Task Achievement standards.' 
                          : 'Đoạn Overview được viết chuẩn mực: Khái quát thành công các xu hướng và đặc điểm chủ đạo của biểu đồ mà không bị sa đà vào số liệu vụn vặt, đáp ứng hoàn hảo tiêu chí Task Achievement Band 7.0+.')}
                  </p>
                </div>
              )}

              {/* Task 2: Academic Hedging & Tentative Language Inspector */}
              {task?.taskNumber === 2 && evaluation.hedgingStats && (
                <div className={`p-4 rounded-xl border transition-all ${
                  evaluation.hedgingStats.hasOvergeneralisation
                    ? 'bg-red-50/80 border-red-200 text-red-950'
                    : evaluation.hedgingStats.hedgingCount >= 3
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="font-bold text-sm">
                        {isEn ? 'Academic Hedging & Tentative Language Meter' : 'Thước Đo Văn Phong Cẩn Trọng Học Thuật (Academic Hedging)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-semibold">
                      <span className="px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-800">
                        {isEn ? 'Hedging expressions:' : 'Ngôn ngữ dè dặt:'} <strong>{evaluation.hedgingStats.hedgingCount}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        evaluation.hedgingStats.hasOvergeneralisation 
                          ? 'bg-red-100 border-red-300 text-red-800' 
                          : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      }`}>
                        {isEn ? 'Overgeneralisations:' : 'Quy chụp tuyệt đối:'} <strong>{evaluation.hedgingStats.overgeneralisationCount}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-xs space-y-1.5 leading-relaxed">
                    {evaluation.hedgingStats.hasOvergeneralisation ? (
                      <div>
                        <p className="font-semibold text-red-900">
                          {isEn ? '⚠️ Overgeneralisation Trap Warning (Band 6.0 Ceiling):' : '⚠️ Cảnh báo bẫy quy chụp cực đoan (Overgeneralisation - Band 6.0 Ceiling):'}
                        </p>
                        <p className="text-red-800">
                          {isEn 
                            ? `Essay contains absolute generalisations (e.g., ${evaluation.hedgingStats.overgeneralisedStatements?.slice(0, 2).map(s => `'${s}'`).join(', ')}). Cambridge examiners prize academic hedging and nuanced perspective. Instead of 'always', 'never', 'undeniable', adopt tentative constructions like 'tends to', 'appears to', 'is arguably the case that'.` 
                            : `Bài viết có phát ngôn khẳng định tuyệt đối (ví dụ: ${evaluation.hedgingStats.overgeneralisedStatements?.slice(0, 2).map(s => `'${s}'`).join(', ')}). Trong văn cảnh học thuật quốc tế, giám khảo đánh giá cao tư duy đa chiều và ngôn ngữ dè dặt. Thay vì dùng always, never, undeniable, hãy chuyển sang cấu trúc tends to, appears to, is arguably the case that.`}
                        </p>
                      </div>
                    ) : evaluation.hedgingStats.hedgingCount >= 3 ? (
                      <p className="text-emerald-900">
                        ✨ <strong>{isEn ? 'Mature Academic Register (Band 7.5+):' : 'Văn phong học thuật chín chắn (Band 7.5+):'}</strong> {isEn 
                          ? `You skillfully applied objective hedging language (${evaluation.hedgingStats.matchedHedging?.slice(0, 3).map(h => `'${h}'`).join(', ')}), avoiding subjective Band 6.0 assertions.` 
                          : `Bạn đã sử dụng thành thạo ngôn ngữ dè dặt khách quan (${evaluation.hedgingStats.matchedHedging?.slice(0, 3).map(h => `'${h}'`).join(', ')}), tránh được bẫy khẳng định chủ quan của Band 6.0.`}
                      </p>
                    ) : (
                      <p className="text-indigo-900">
                        💡 <strong>{isEn ? 'Recommendation for Band 7.5+:' : 'Khuyến nghị nâng cấp Band 7.5+:'}</strong> {isEn 
                          ? 'Arguments are slightly direct. Incorporate 2-3 tentative phrases like "evidence suggests that", "is likely to result in", or "tend to be" to heighten academic authority.' 
                          : 'Các câu lập luận còn hơi trực diện. Hãy lồng ghép thêm 2-3 cấu trúc cẩn trọng như "evidence suggests that", "is likely to result in" hoặc "tend to be" để tăng sức thuyết phục học thuật.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4. RADAR PROFILE & QUICK SCORE STATS                                      */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="h-60 w-full flex items-center justify-center">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span>{isEn ? 'Overall Cambridge Band Score Breakdown:' : 'Tổng quan Band Score theo Cambridge:'}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Task Response</span>
                      <strong className="text-base text-slate-900">Band {trBand.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Coherence & Cohesion</span>
                      <strong className="text-base text-slate-900">Band {ccBand.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Lexical Resource</span>
                      <strong className="text-base text-slate-900">Band {lrBand.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Grammar Range</span>
                      <strong className="text-base text-slate-900">Band {graBand.toFixed(1)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* ZPD Coaching Callout Banner */}
              {pedagogicalFocus === 'foundation' && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1 shadow-2xs">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{isEn ? 'Core Pathway for Band 5.5 - 6.5: Standardize Grammar & Eliminate Careless Errors' : 'Lộ trình trọng tâm Band 5.5 - 6.5: Chuẩn hóa ngữ pháp & tránh mất điểm oan'}</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {isEn 
                      ? 'Priority #1 is grammatical accuracy (GRA): correct tenses, subject-verb agreement, avoid run-ons and sentence fragments. Focus on clear, robust sentence structures before attempting C2 vocabulary.' 
                      : 'Ưu tiên số 1 của bạn là độ chuẩn xác ngữ pháp (GRA): Chia thì chuẩn, chia động từ số ít/nhiều ăn khớp chủ ngữ, tránh lỗi ngắt câu (run-on/fragments). Tuyệt đối không nhồi nhét từ C2 khi chưa rõ collocation, hãy viết câu rõ nghĩa trước tiên!'}
                  </p>
                </div>
              )}

              {pedagogicalFocus === 'advanced' && (
                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-1 shadow-2xs">
                  <div className="font-bold flex items-center space-x-1.5 text-indigo-900">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{isEn ? 'Advanced Pathway for Band 7.5+: Sophisticated Argumentation & Natural Cohesion' : 'Lộ trình bứt phá Band 7.5+: Tinh tế hóa lập luận & liên kết tự nhiên'}</span>
                  </div>
                  <p className="text-indigo-800 leading-relaxed">
                    {isEn 
                      ? 'To advance from 7.0 to 8.0+, master academic hedging (tends to, arguably, indicates that), avoid mechanical template linkers (Furthermore, In conclusion), and deploy idiomatic C1-C2 collocations.' 
                      : 'Để vượt ngưỡng 7.0 lên 8.0+, hãy rèn luyện văn phong dè dặt học thuật (academic hedging: tends to, arguably, indicates that), hạn chế từ nối cơ học rập khuôn (như Furthermore, In conclusion), và đẩy mạnh cụm từ cố định tự nhiên (collocations C1-C2).'}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB: PARAGRAPH-BY-PARAGRAPH ANALYSIS */}
          {activeTab === 'paragraphs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900 shadow-xs">
                <div className="flex items-center space-x-2 mb-1">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-sm">
                    {isEn ? 'Cambridge Structural Paragraph Diagnostics' : 'Chẩn Đoán Cấu Trúc Khảo Thí Cambridge'}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn 
                    ? 'Deconstruct each paragraph against Cambridge benchmarks: detect cliches, anecdotal traps, and evaluate topic sentence and idea progression under the P.E.E.L model.' 
                    : 'Mổ xẻ từng đoạn văn theo tiêu chuẩn khảo thí Cambridge: Rà soát phát hiện câu mở bài sáo rỗng (Cliche), bẫy dẫn chứng trải nghiệm cá nhân (Anecdotes) và đánh giá độ sâu phát triển ý theo mô hình chuẩn P.E.E.L.'}
                </p>
              </div>

              {evaluation.paragraphAnalysis && evaluation.paragraphAnalysis.length > 0 ? (
                evaluation.paragraphAnalysis.map((p, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                          {p.paragraphIndex || idx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-900">
                          {p.name}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {p.wordCount} {isEn ? 'words' : 'từ'}
                      </span>
                    </div>

                    {/* Verdict */}
                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 font-semibold block mb-1">
                        {isEn ? 'Examiner Verdict:' : 'Đánh giá của Giám khảo:'}
                      </strong>
                      {p.verdict}
                    </div>

                    {/* Cliche Warning */}
                    {p.clicheWarning && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-red-700 block">
                            {isEn ? 'CLICHE & FORMULAIC TRAP WARNING:' : 'CẢNH BÁO BẪY CÂU SÁO RỖNG:'}
                          </strong>
                          <span>{p.clicheWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Anecdote Warning */}
                    {p.anecdoteWarning && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-amber-800 block">
                            {isEn ? 'PERSONAL ANECDOTE TRAP WARNING:' : 'CẢNH BÁO DẪN CHỨNG CÁ NHÂN:'}
                          </strong>
                          <span>{p.anecdoteWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    {p.recommendation && (
                      <div className="text-xs text-indigo-900 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100">
                        <strong className="font-semibold text-indigo-950 block mb-0.5">
                          {isEn ? 'Development Recommendation:' : 'Khuyến nghị phát triển:'}
                        </strong>
                        {p.recommendation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  {isEn ? 'No paragraph analysis data available.' : 'Chưa có dữ liệu phân tích từng đoạn văn.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LINE-BY-LINE CORRECTIONS */}
          {activeTab === 'corrections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {pedagogicalFocus === 'foundation' ? (
                    <span>🎯 {isEn ? 'Prioritizing ' : 'Ưu tiên hiển thị '}<strong>{isEn ? 'Foundational Grammar & Sentence Structure errors' : 'lỗi Ngữ pháp & Cấu trúc nền tảng'}</strong> ({filteredCorrections.length} {isEn ? 'suggestions' : 'gợi ý'}):</span>
                  ) : pedagogicalFocus === 'advanced' ? (
                    <span>🚀 {isEn ? 'Prioritizing ' : 'Ưu tiên hiển thị '}<strong>{isEn ? 'Academic Style & C1-C2 Lexical refinements' : 'tinh chỉnh Học thuật & Từ vựng C1-C2'}</strong> ({filteredCorrections.length} {isEn ? 'suggestions' : 'gợi ý'}):</span>
                  ) : (
                    <span>{isEn ? 'Identified ' : 'Tìm thấy '}<strong>{filteredCorrections.length}</strong> {isEn ? 'sentence improvements across grammar & vocabulary:' : 'vị trí có thể cải thiện ngữ pháp & từ vựng:'}</span>
                  )}
                </span>
              </div>

              {filteredCorrections && filteredCorrections.length > 0 ? (
                filteredCorrections.map((c, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                        {c.type || 'Grammar'}
                      </span>
                      {onSaveToMistakeLog && (
                        <button
                          onClick={() => handleSaveMistake(c, idx)}
                          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-600 font-medium transition-colors"
                        >
                          {savedMistakes[idx] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">{isEn ? 'Saved' : 'Đã lưu lỗi'}</span>
                            </>
                          ) : (
                            <>
                              <BookMarked className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Save to Mistake Log' : 'Lưu vào Sổ tay lỗi sai'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="p-2 rounded bg-red-50/60 border border-red-100 text-red-900">
                        <span className="font-bold text-red-700">{isEn ? 'Original: ' : 'Câu gốc: '}</span>
                        <strike>{c.original}</strike>
                      </div>
                      <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100 text-emerald-900">
                        <span className="font-bold text-emerald-700">{isEn ? 'Suggested revision: ' : 'Gợi ý sửa: '}</span>
                        <strong>{c.corrected}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>{isEn ? 'Explanation:' : 'Giải thích:'}</strong> {c.explanation}
                    </p>

                    {/* Interactive Inline Rewrite & Instant Re-score */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleRewrite(idx)}
                          className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{expandedRewrites[idx] ? (isEn ? 'Close interactive rewrite' : 'Đóng hộp thử viết lại') : (isEn ? '✍️ Practice rewriting this sentence (Instant AI Score)' : '✍️ Thử viết lại câu này (Chấm điểm ngay)')}</span>
                        </button>
                      </div>

                      {expandedRewrites[idx] && (
                        <div className="mt-2.5 p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2.5 text-xs">
                          <label className="block text-slate-700 font-medium">
                            {isEn ? 'Rewrite your sentence for automated instant scoring:' : 'Viết lại câu của bạn để hệ thống tự động kiểm tra và chấm điểm tức thì:'}
                          </label>
                          <textarea
                            rows={2}
                            value={userRewrites[idx] || ''}
                            onChange={(e) => handleRewriteChange(idx, e.target.value)}
                            placeholder={isEn ? "Enter your revised sentence here..." : "Nhập phiên bản viết lại của bạn vào đây..."}
                            className="w-full px-3 py-2 text-xs text-slate-800 bg-white rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden resize-y"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleCheckRewrite(c, idx)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center space-x-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Check Rewrite' : 'Kiểm tra viết lại'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopySuggestion(c, idx)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                              >
                                {isEn ? 'Insert model' : 'Điền gợi ý mẫu'}
                              </button>
                            </div>
                            {rewriteResults[idx] && rewriteResults[idx].score > 0 && (
                              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                                rewriteResults[idx].score >= 9 ? 'bg-emerald-100 text-emerald-800' :
                                rewriteResults[idx].score >= 7 ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {isEn ? 'Score' : 'Điểm'}: {rewriteResults[idx].score}/10
                              </span>
                            )}
                          </div>

                          {/* Result Feedback Alert */}
                          {rewriteResults[idx] && (
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed border ${
                              rewriteResults[idx].color === 'emerald' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                              rewriteResults[idx].color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                              rewriteResults[idx].color === 'red' ? 'bg-red-50 border-red-200 text-red-900' :
                              'bg-amber-50 border-amber-200 text-amber-900'
                            }`}>
                              <p className="font-semibold">{rewriteResults[idx].message}</p>
                              {rewriteResults[idx].similarity > 0 && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                  {isEn ? 'Academic structural similarity' : 'Độ tương đồng cấu trúc học thuật'}: {rewriteResults[idx].similarity}%
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  {isEn ? 'No major errors detected. Your essay demonstrates excellent accuracy!' : 'Không phát hiện lỗi nghiêm trọng nào. Bài viết của bạn rất chính xác!'}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BAND 8.5+ REWRITE */}
          {activeTab === 'rewrite' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold block text-emerald-900 mb-0.5">
                    {isEn ? 'Band 8.5+ Side-by-Side Model Upgrade:' : 'Đặc điểm của bản viết lại Band 8.5+ (Side-by-Side Comparison):'}
                  </span>
                  <p>
                    {isEn 
                      ? 'Preserves 100% of your original thesis and viewpoints, while elevating complex clause syntax, relative clauses, and C1/C2 academic collocations.' 
                      : 'Giữ nguyên 100% quan điểm và hướng lập luận ban đầu của bạn, nhưng nâng tầm cấu trúc câu phức, mệnh đề quan hệ và các collocations học thuật đắt giá theo chuẩn C1/C2.'}
                  </p>
                </div>
                {onOpenRevision && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRevision();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center space-x-1 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Open Revision Studio (v1 ➔ v2)' : 'Mở Phòng Viết Lại (v1 ➔ v2)'}</span>
                  </button>
                )}
              </div>

              {/* Side-by-side 2-column view */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Original Essay */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      {isEn ? `Your Original Essay (${stats?.wordCount || 0} words)` : `Bài viết gốc của bạn (${stats?.wordCount || 0} từ)`}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Band {evaluation.overallBand ? evaluation.overallBand.toFixed(1) : '6.5'}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-serif academic-reading-text shadow-2xs h-full max-h-[60vh] overflow-y-auto">
                    {essayText || (isEn ? 'No essay submitted.' : 'Không có bài làm.')}
                  </div>
                </div>

                {/* Band Stepping Rewrite Column */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 flex-wrap gap-1.5">
                    {/* Band Selection Buttons */}
                    <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setSelectedRewriteBand('6.5')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedRewriteBand === '6.5'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={isEn ? "Band 6.5 - 7.0 Model: Standardized grammar, clear sentence structure, accessible for Band 5.0 - 6.0 candidates" : "Bản mẫu Band 6.5 - 7.0: Ngữ pháp chuẩn hóa, câu cú rõ ràng, dễ áp dụng cho học viên đang ở band 5.0 - 6.0"}
                      >
                        {isEn ? '🌟 Band 6.5 - 7.0 (Accessible)' : '🌟 Band 6.5 - 7.0 (Vừa sức)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRewriteBand('8.5')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          selectedRewriteBand === '8.5'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={isEn ? "Band 8.5+ Model: Advanced C1/C2 vocabulary, complex syntax, nuanced academic tone" : "Bản mẫu Band 8.5+: Nâng cấp từ vựng học thuật C1/C2, ngữ pháp phức hợp, sắc thái nghĩa tinh tế"}
                      >
                        {isEn ? '💎 Band 8.5+ (Advanced)' : '💎 Band 8.5+ (Nâng cao)'}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const targetText = selectedRewriteBand === '6.5' 
                          ? (evaluation.band65Rewrite || evaluation.band8Rewrite)
                          : (evaluation.band8Rewrite || evaluation.band65Rewrite);
                        if (targetText) {
                          navigator.clipboard.writeText(targetText);
                          alert(isEn ? `Copied Band ${selectedRewriteBand === '6.5' ? '6.5 - 7.0' : '8.5+'} model essay to clipboard!` : `Đã sao chép bản nâng cấp Band ${selectedRewriteBand === '6.5' ? '6.5 - 7.0' : '8.5+'} vào clipboard!`);
                        }
                      }}
                      className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{isEn ? 'Copy' : 'Sao chép'}</span>
                    </button>
                  </div>

                  {/* Pedagogical Commentary Banner */}
                  <div className={`px-3 py-1.5 rounded-xl text-[11px] border font-medium transition-all ${
                    selectedRewriteBand === '6.5'
                      ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  }`}>
                    <span>
                      {selectedRewriteBand === '6.5'
                        ? (isEn 
                            ? '💡 Band 6.5 Model: 100% accurate grammar, lucid paragraphing, natural compound & complex sentences, immediately applicable.' 
                            : '💡 Bản mẫu 6.5: Chuẩn hóa 100% ngữ pháp, phân đoạn rõ ràng, sử dụng câu ghép & câu phức thông dụng, dễ học và áp dụng ngay.')
                        : (isEn 
                            ? '💡 Band 8.5+ Model: Elevated C1/C2 Academic Word List vocabulary, sophisticated syntactic range, nuanced tone, and agile cohesive flow.' 
                            : '💡 Bản mẫu 8.5+: Nâng cấp từ vựng học thuật C1/C2 (AWL), ngữ pháp phức hợp, kiểm soát sắc thái nghĩa và cấu trúc câu linh hoạt.')}
                    </span>
                  </div>

                  <div className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm whitespace-pre-line leading-relaxed font-serif academic-reading-text shadow-2xs h-full max-h-[55vh] overflow-y-auto transition-colors ${
                    selectedRewriteBand === '6.5'
                      ? 'bg-blue-50/30 border-blue-200 text-slate-900'
                      : 'bg-emerald-50/30 border-emerald-200 text-slate-900'
                  }`}>
                    {selectedRewriteBand === '6.5'
                      ? (evaluation.band65Rewrite || evaluation.band8Rewrite || (isEn ? 'Model essay is being generated...' : 'Đang cập nhật bài viết lại...'))
                      : (evaluation.band8Rewrite || evaluation.band65Rewrite || (isEn ? 'Model essay is being generated...' : 'Đang cập nhật bài viết lại...'))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXTRACTED KEY VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              {evaluation.detectedTopic && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 gap-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-indigo-950">
                      {isEn ? 'Detected Topic Area:' : 'Chủ đề bài thi nhận diện:'}
                    </span>
                    <span className="text-xs font-bold text-indigo-700">
                      {isEn ? (evaluation.detectedTopic.topicNameEn || evaluation.detectedTopic.topicNameVi) : evaluation.detectedTopic.topicNameVi}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 w-fit">
                    Cambridge C1/C2 Collocations
                  </span>
                </div>
              )}

              {/* Word Overuse & Thesaurus Replacement Suggestions */}
              {evaluation.wordOveruseStats?.hasOveruse && evaluation.wordOveruseStats.suggestions?.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <h5 className="text-xs font-bold text-amber-950">
                      {isEn ? 'Word Repetition Warning & Academic Thesaurus' : 'Cảnh Báo Lặp Từ & Gợi Ý Thay Thế Học Thuật (Academic Thesaurus)'}
                    </h5>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {isEn 
                      ? 'The following words are frequently repeated. Cambridge Lexical Resource rewards lexical variety. Replace them with advanced C1/C2 synonyms:' 
                      : 'Bài viết lặp lại nhiều lần các từ dưới đây. Tiêu chuẩn Cambridge Lexical Resource đòi hỏi sự linh hoạt và biến hóa từ vựng. Bạn hãy thay thế bằng các từ đồng nghĩa học thuật C1/C2:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {evaluation.wordOveruseStats.suggestions.map((sug, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-lg bg-white border border-amber-200/80 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                          <span className="text-xs font-bold text-red-700">
                            {isEn ? 'Original word: ' : 'Từ gốc: '}<span className="underline font-mono">'{sug.word}'</span> ({sug.count} {isEn ? 'times' : 'lần'})
                          </span>
                          <span className="text-[10px] text-amber-700 font-semibold">{isEn ? 'C1/C2 Alternatives:' : 'Gợi ý C1/C2:'}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sug.alternatives.map((alt, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium leading-tight"
                              title={`${isEn ? (alt.meaningEn || alt.meaningVi) : alt.meaningVi} (${alt.type || 'adj/verb/noun'})${alt.example ? ' | Ex: ' + alt.example : ''}`}
                            >
                              <strong>{alt.word}</strong> <span className="text-[10px] text-slate-500 font-normal">({isEn ? (alt.meaningEn || alt.meaningVi) : alt.meaningVi})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-xs text-slate-500 block">
                {isEn ? 'Key topic-specific Academic Collocations:' : 'Các cụm từ vựng học thuật (Collocations) trọng điểm theo chủ đề:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {evaluation.keyVocabulary && evaluation.keyVocabulary.length > 0 ? (
                  evaluation.keyVocabulary.map((v, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {v.phrase || v.word}
                        </span>
                        <button
                          onClick={() => handleSaveVocab(v, idx)}
                          className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
                          title={isEn ? "Save to Vocab Notebook" : "Lưu vào sổ từ vựng"}
                        >
                          {savedVocabs[idx] ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <BookMarked className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">
                        {isEn ? (v.meaningEn || v.meaningVi || v.meaning) : (v.meaningVi || v.meaning)}
                      </p>
                      {v.example && (
                        <p className="text-[11px] text-slate-400 italic">
                          "{v.example}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                    {isEn ? 'No additional vocabulary available.' : 'Không có danh sách từ vựng bổ sung.'}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
