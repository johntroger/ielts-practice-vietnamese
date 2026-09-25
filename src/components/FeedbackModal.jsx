import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState('criteria'); // 'criteria' | 'corrections' | 'rewrite' | 'vocab'
  const [savedVocabs, setSavedVocabs] = useState({});
  const [savedMistakes, setSavedMistakes] = useState({});
  const [expandedRewrites, setExpandedRewrites] = useState({});
  const [userRewrites, setUserRewrites] = useState({});
  const [rewriteResults, setRewriteResults] = useState({});

  const trBand = evaluation.criteria?.tr?.band || 6.0;
  const ccBand = evaluation.criteria?.cc?.band || 6.0;
  const lrBand = evaluation.criteria?.lr?.band || 6.0;
  const graBand = evaluation.criteria?.gra?.band || 6.0;

  // Radar Chart Data
  const radarData = {
    labels: ['Task Response (TR)', 'Coherence & Cohesion (CC)', 'Lexical Resource (LR)', 'Grammar Range & Acc (GRA)'],
    datasets: [
      {
        label: 'Band Score của bạn',
        data: [trBand, ccBand, lrBand, graBand],
        backgroundColor: 'rgba(217, 26, 42, 0.2)',
        borderColor: '#D91A2A',
        pointBackgroundColor: '#D91A2A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#D91A2A'
      },
      {
        label: 'Mục tiêu Band 8.0',
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
                  Báo Cáo Đánh Giá Bài Thi
                  <span className="hidden sm:inline font-normal text-slate-400 text-xs ml-1.5">(Cambridge Rubric)</span>
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shrink-0">
                  BAND {evaluation.overallBand ? evaluation.overallBand.toFixed(1) : '7.0'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  Task {task.taskNumber}: {task.title} • {stats?.wordCount || 0} từ • Thời gian: {stats?.timeSpent || 'N/A'}
                </p>
                {evaluation.evaluationMethod === 'algorithmic' ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-[11px] font-semibold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Chấm Bằng Máy (Cambridge Algorithm)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] sm:text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Chấm Bởi AI Gemini</span>
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
                title="Chấm lại bài viết này bằng Trí tuệ nhân tạo Gemini"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="sm:hidden">Chấm Lại AI</span>
                <span className="hidden sm:inline">Chấm Lại Bằng AI</span>
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
                title="Luyện viết lại lần 2 để nâng band"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Viết Lại v2</span>
              </button>
            )}

            <button
              onClick={() => exportToWord({ task, essayText, evaluation, stats })}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
              title="Xuất bài ra file Word .doc"
            >
              <FileDown className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Xuất Word</span>
            </button>
            <button
              onClick={printFormattedReport}
              className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0 cursor-pointer"
              title="In / Lưu thành PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Đóng bảng kết quả"
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
                Thử lại AI
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
            4 Tiêu Chí & Lộ Trình
          </button>
          <button
            onClick={() => setActiveTab('paragraphs')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
              activeTab === 'paragraphs' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Mổ Xẻ Từng Đoạn</span>
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
            <span>Soi Lỗi Từng Câu</span>
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
            Bản Nâng Cấp Band 8.5+
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'vocab' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Từ Vựng Vàng Trích Xuất
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: 4 CRITERIA & RADAR CHART */}
          {activeTab === 'criteria' && (
            <div className="space-y-6">
              
              {/* Radar Chart + Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="h-60 w-full flex items-center justify-center">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span>Tổng quan Band Score theo Cambridge:</span>
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

              {/* Examiner Action Plan (Đơn thuốc cải thiện điểm số) */}
              {evaluation.actionPlan && (
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/60 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-800/80 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-red-400" />
                      <h4 className="font-bold text-sm sm:text-base tracking-wide">
                        Đơn Thuốc Cải Thiện Điểm Số (Action Plan)
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] sm:text-[11px] font-semibold">
                      Chief Examiner Strategy
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {evaluation.actionPlan.priority1 && (
                      <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-red-950/40 border border-red-800/40">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] shrink-0 mt-0.5">
                          ƯU TIÊN 1
                        </span>
                        <p className="text-slate-200 leading-relaxed">
                          {evaluation.actionPlan.priority1}
                        </p>
                      </div>
                    )}

                    {evaluation.actionPlan.priority2 && (
                      <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40">
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px] shrink-0 mt-0.5">
                          ƯU TIÊN 2
                        </span>
                        <p className="text-slate-200 leading-relaxed">
                          {evaluation.actionPlan.priority2}
                        </p>
                      </div>
                    )}

                    {evaluation.actionPlan.priority3 && (
                      <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/40">
                        <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-extrabold text-[10px] shrink-0 mt-0.5">
                          ƯU TIÊN 3
                        </span>
                        <p className="text-slate-200 leading-relaxed">
                          {evaluation.actionPlan.priority3}
                        </p>
                      </div>
                    )}
                  </div>

                  {evaluation.actionPlan.estimatedBandTarget && (
                    <div className="pt-2 border-t border-indigo-800/80 flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{evaluation.actionPlan.estimatedBandTarget}</span>
                    </div>
                  )}
                </div>
              )}

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
                          ? 'CẢNH BÁO BAREM CAMBRIDGE: THIẾU ĐOẠN TỔNG QUAN (OVERVIEW)'
                          : evaluation.task1OverviewStats.hasRawData
                          ? 'BẪY SỐ LIỆU ĐOẠN OVERVIEW: KHỐNG CHẾ TRẦN BAND 5.5 - 6.0'
                          : 'ĐOẠN TỔNG QUAN (OVERVIEW) ĐẠT CHUẨN KHẢO THÍ (BAND 7.0+)'}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold ${
                      !evaluation.task1OverviewStats.hasOverview
                        ? 'bg-red-200 text-red-900'
                        : evaluation.task1OverviewStats.hasRawData
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {!evaluation.task1OverviewStats.hasOverview ? 'Tối đa Band 5.0' : evaluation.task1OverviewStats.hasRawData ? 'Tối đa Band 6.0' : 'Band 7.0+'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {!evaluation.task1OverviewStats.hasOverview
                      ? 'Theo quy định chính thức của Cambridge IELTS Task 1, bài viết không có câu hoặc đoạn Overview rõ ràng sẽ bị khống chế điểm Task Achievement ở mức tối đa Band 5.0 (Presents no overview). Hãy luôn mở đầu đoạn tổng quan bằng "Overall, it is clear that..." và nêu 2 đặc điểm cốt lõi nhất.'
                      : evaluation.task1OverviewStats.hasRawData
                      ? `Đoạn Overview đã được nhận diện nhưng có chứa số liệu chi tiết cụ thể (${evaluation.task1OverviewStats.rawDataList?.slice(0, 3).join(', ')}). Barem Cambridge quy định Overview chỉ được khái quát xu hướng/điểm đối lập, TUYỆT ĐỐI KHÔNG ĐƯA SỐ LIỆU VỤN VẶT khiến điểm Task Achievement bị chặn ở Band 5.5 - 6.0.`
                      : 'Đoạn Overview được viết chuẩn mực: Khái quát thành công các xu hướng và đặc điểm chủ đạo của biểu đồ mà không bị sa đà vào số liệu vụn vặt, đáp ứng hoàn hảo tiêu chí Task Achievement Band 7.0+.'}
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
                        Thước Đo Văn Phong Cẩn Trọng Học Thuật (Academic Hedging)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-semibold">
                      <span className="px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-800">
                        Ngôn ngữ dè dặt: <strong>{evaluation.hedgingStats.hedgingCount}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        evaluation.hedgingStats.hasOvergeneralisation 
                          ? 'bg-red-100 border-red-300 text-red-800' 
                          : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      }`}>
                        Quy chụp tuyệt đối: <strong>{evaluation.hedgingStats.overgeneralisationCount}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-xs space-y-1.5 leading-relaxed">
                    {evaluation.hedgingStats.hasOvergeneralisation ? (
                      <div>
                        <p className="font-semibold text-red-900">
                          ⚠️ Cảnh báo bẫy quy chụp cực đoan (Overgeneralisation - Band 6.0 Ceiling):
                        </p>
                        <p className="text-red-800">
                          Bài viết có phát ngôn khẳng định tuyệt đối (ví dụ: {evaluation.hedgingStats.overgeneralisedStatements?.slice(0, 2).map(s => `'${s}'`).join(', ')}). Trong văn cảnh học thuật quốc tế, giám khảo đánh giá cao tư duy đa chiều và ngôn ngữ dè dặt. Thay vì dùng <em>always, never, undeniable</em>, hãy chuyển sang cấu trúc <em>tends to, appears to, is arguably the case that</em>.
                        </p>
                      </div>
                    ) : evaluation.hedgingStats.hedgingCount >= 3 ? (
                      <p className="text-emerald-900">
                        ✨ <strong>Văn phong học thuật chín chắn (Band 7.5+):</strong> Bạn đã sử dụng thành thạo ngôn ngữ dè dặt khách quan ({evaluation.hedgingStats.matchedHedging?.slice(0, 3).map(h => `'${h}'`).join(', ')}), tránh được bẫy khẳng định chủ quan của Band 6.0.
                      </p>
                    ) : (
                      <p className="text-indigo-900">
                        💡 <strong>Khuyến nghị nâng cấp Band 7.5+:</strong> Các câu lập luận còn hơi trực diện. Hãy lồng ghép thêm 2-3 cấu trúc cẩn trọng như <em>"evidence suggests that"</em>, <em>"is likely to result in"</em> hoặc <em>"tend to be"</em> để tăng sức thuyết phục học thuật.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 4 Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(evaluation.criteria || {}).map(([key, data]) => (
                  <div key={key} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-sm text-slate-900 uppercase">
                        {key === 'tr' ? 'Task Response (TR)' :
                         key === 'cc' ? 'Coherence & Cohesion (CC)' :
                         key === 'lr' ? 'Lexical Resource (LR)' : 'Grammar Range (GRA)'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold text-xs">
                        Band {data.band ? data.band.toFixed(1) : 'N/A'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {data.feedback}
                    </p>

                    {data.improvements && data.improvements.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 space-y-1">
                        <span className="font-semibold block text-amber-950">Điểm cần cải thiện:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {data.improvements.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: PARAGRAPH-BY-PARAGRAPH ANALYSIS */}
          {activeTab === 'paragraphs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900 shadow-xs">
                <div className="flex items-center space-x-2 mb-1">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-sm">Chẩn Đoán Cấu Trúc Khảo Thí Cambridge</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mổ xẻ từng đoạn văn theo tiêu chuẩn khảo thí Cambridge: Rà soát phát hiện câu mở bài sáo rỗng (Cliche), bẫy dẫn chứng trải nghiệm cá nhân (Anecdotes) và đánh giá độ sâu phát triển ý theo mô hình chuẩn P.E.E.L.
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
                        {p.wordCount} từ
                      </span>
                    </div>

                    {/* Verdict */}
                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 font-semibold block mb-1">Đánh giá của Giám khảo:</strong>
                      {p.verdict}
                    </div>

                    {/* Cliche Warning */}
                    {p.clicheWarning && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-red-700 block">CẢNH BÁO BẪY CÂU SÁO RỖNG:</strong>
                          <span>{p.clicheWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Anecdote Warning */}
                    {p.anecdoteWarning && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-amber-800 block">CẢNH BÁO DẪN CHỨNG CÁ NHÂN:</strong>
                          <span>{p.anecdoteWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    {p.recommendation && (
                      <div className="text-xs text-indigo-900 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100">
                        <strong className="font-semibold text-indigo-950 block mb-0.5">Khuyến nghị phát triển:</strong>
                        {p.recommendation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Chưa có dữ liệu phân tích từng đoạn văn.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LINE-BY-LINE CORRECTIONS */}
          {activeTab === 'corrections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tìm thấy <strong>{evaluation.corrections?.length || 0}</strong> vị trí có thể cải thiện ngữ pháp & từ vựng:
                </span>
              </div>

              {evaluation.corrections && evaluation.corrections.length > 0 ? (
                evaluation.corrections.map((c, idx) => (
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
                              <span className="text-emerald-600">Đã lưu lỗi</span>
                            </>
                          ) : (
                            <>
                              <BookMarked className="w-3.5 h-3.5" />
                              <span>Lưu vào Sổ tay lỗi sai</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="p-2 rounded bg-red-50/60 border border-red-100 text-red-900">
                        <span className="font-bold text-red-700">Câu gốc: </span>
                        <strike>{c.original}</strike>
                      </div>
                      <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100 text-emerald-900">
                        <span className="font-bold text-emerald-700">Gợi ý sửa: </span>
                        <strong>{c.corrected}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>Giải thích:</strong> {c.explanation}
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
                          <span>{expandedRewrites[idx] ? 'Đóng hộp thử viết lại' : '✍️ Thử viết lại câu này (Chấm điểm ngay)'}</span>
                        </button>
                      </div>

                      {expandedRewrites[idx] && (
                        <div className="mt-2.5 p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2.5 text-xs">
                          <label className="block text-slate-700 font-medium">
                            Viết lại câu của bạn để hệ thống tự động kiểm tra và chấm điểm tức thì:
                          </label>
                          <textarea
                            rows={2}
                            value={userRewrites[idx] || ''}
                            onChange={(e) => handleRewriteChange(idx, e.target.value)}
                            placeholder="Nhập phiên bản viết lại của bạn vào đây..."
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
                                <span>Kiểm tra viết lại</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopySuggestion(c, idx)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                              >
                                Điền gợi ý mẫu
                              </button>
                            </div>
                            {rewriteResults[idx] && rewriteResults[idx].score > 0 && (
                              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                                rewriteResults[idx].score >= 9 ? 'bg-emerald-100 text-emerald-800' :
                                rewriteResults[idx].score >= 7 ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                Điểm: {rewriteResults[idx].score}/10
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
                                  Độ tương đồng cấu trúc học thuật: {rewriteResults[idx].similarity}%
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
                  Không phát hiện lỗi nghiêm trọng nào. Bài viết của bạn rất chính xác!
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
                    Đặc điểm của bản viết lại Band 8.5+ (Side-by-Side Comparison):
                  </span>
                  <p>
                    Giữ nguyên 100% quan điểm và hướng lập luận ban đầu của bạn, nhưng nâng tầm cấu trúc câu phức, mệnh đề quan hệ và các collocations học thuật đắt giá theo chuẩn C1/C2.
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
                    <span>Mở Phòng Viết Lại (v1 ➔ v2)</span>
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
                      Bài viết gốc của bạn ({stats?.wordCount || 0} từ)
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Band {evaluation.overallBand ? evaluation.overallBand.toFixed(1) : '6.5'}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans shadow-2xs h-full max-h-[60vh] overflow-y-auto">
                    {essayText || 'Không có bài làm.'}
                  </div>
                </div>

                {/* Band 8.5+ Rewrite */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Bản Nâng Cấp Band 8.5+
                    </span>
                    <button
                      onClick={() => {
                        if (evaluation.band8Rewrite) {
                          navigator.clipboard.writeText(evaluation.band8Rewrite);
                          alert('Đã sao chép bản nâng cấp Band 8.5+ vào clipboard!');
                        }
                      }}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Sao chép</span>
                    </button>
                  </div>
                  <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/30 border border-emerald-200 text-xs sm:text-sm text-slate-900 whitespace-pre-line leading-relaxed font-sans shadow-2xs h-full max-h-[60vh] overflow-y-auto">
                    {evaluation.band8Rewrite || 'Đang cập nhật bài viết lại...'}
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
                    <span className="text-xs font-semibold text-indigo-950">Chủ đề bài thi nhận diện:</span>
                    <span className="text-xs font-bold text-indigo-700">{evaluation.detectedTopic.topicNameVi}</span>
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
                      Cảnh Báo Lặp Từ & Gợi Ý Thay Thế Học Thuật (Academic Thesaurus)
                    </h5>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Bài viết lặp lại nhiều lần các từ dưới đây. Tiêu chuẩn Cambridge Lexical Resource đòi hỏi sự linh hoạt và biến hóa từ vựng. Bạn hãy thay thế bằng các từ đồng nghĩa học thuật C1/C2:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {evaluation.wordOveruseStats.suggestions.map((sug, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-lg bg-white border border-amber-200/80 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                          <span className="text-xs font-bold text-red-700">
                            Từ gốc: <span className="underline font-mono">'{sug.word}'</span> ({sug.count} lần)
                          </span>
                          <span className="text-[10px] text-amber-700 font-semibold">Gợi ý C1/C2:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sug.alternatives.map((alt, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium leading-tight"
                              title={`${alt.meaningVi} (${alt.type || 'adj/verb/noun'})${alt.example ? ' | VD: ' + alt.example : ''}`}
                            >
                              <strong>{alt.word}</strong> <span className="text-[10px] text-slate-500 font-normal">({alt.meaningVi})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-xs text-slate-500 block">
                Các cụm từ vựng học thuật (Collocations) trọng điểm theo chủ đề:
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
                          title="Lưu vào sổ từ vựng"
                        >
                          {savedVocabs[idx] ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <BookMarked className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">
                        {v.meaningVi || v.meaning}
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
                    Không có danh sách từ vựng bổ sung.
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
