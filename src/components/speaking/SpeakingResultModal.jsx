import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Printer,
  RotateCcw,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Volume2,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Mic,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { exportSpeakingReport } from '../../services/exportService';

export default function SpeakingResultModal({
  isOpen,
  onClose,
  evaluation,
  dialogueHistory = [],
  mockPack,
  examiner,
  totalDurationSec = 600,
  onRetryExam,
  onSaveToVocabNotebook,
  onSaveMistake,
  onReEvaluateWithAI,
  onReEvaluateAlgorithmically,
  apiKey
}) {
  if (!isOpen || !evaluation) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'transcript'
  const [expandedTurns, setExpandedTurns] = useState({ 0: true, 1: true });
  const [copiedIndex, setCopiedIndex] = useState(null);

  const criteria = evaluation.criteria || {};
  const overallBand = evaluation.overallBand || 6.0;
  const speechAnalytics = evaluation.speechAnalytics || {
    totalWords: 0,
    wordsPerMinute: 0,
    fillerWordsCount: 0
  };

  const getRankBadge = (band) => {
    if (band >= 8.0) return { title: 'Expert User', color: 'bg-amber-500 text-slate-950 font-black', desc: 'Thông thạo hoàn hảo' };
    if (band >= 7.0) return { title: 'Good User', color: 'bg-purple-600 text-white font-bold', desc: 'Lưu loát & Tự nhiên' };
    if (band >= 6.0) return { title: 'Competent User', color: 'bg-blue-600 text-white font-bold', desc: 'Hiệu quả, đôi chỗ còn lỗi' };
    if (band >= 5.0) return { title: 'Modest User', color: 'bg-emerald-600 text-white font-bold', desc: 'Giao tiếp cơ bản' };
    return { title: 'Developing User', color: 'bg-slate-700 text-slate-200', desc: 'Đang xây nền tảng' };
  };

  const rank = getRankBadge(overallBand);

  const toggleTurn = (idx) => {
    setExpandedTurns(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyCollocation = (phrase, idx) => {
    navigator.clipboard.writeText(phrase);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportWord = () => {
    exportSpeakingReport({
      mockPack,
      examiner,
      evaluation,
      dialogueHistory,
      totalDurationSec
    });
  };

  const isAlgorithmic = evaluation.evaluationMethod === 'algorithmic';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* TOP MODAL HEADER */}
        <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-b border-purple-800/40 p-4 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Báo Cáo Đánh Giá IELTS Speaking
                </h2>
                {isAlgorithmic ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                    <Zap className="w-3 h-3 text-amber-400" />
                    ⚡ Thuật Toán Máy Tính
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    ✨ AI Gemini
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {mockPack?.title || 'Mock Test'} • Giám khảo: {examiner?.name} ({examiner?.accent})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAlgorithmic && onReEvaluateWithAI && (
              <button
                onClick={onReEvaluateWithAI}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Chấm lại toàn bộ bài thi bằng mô hình AI Gemini"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Chấm Lại Bằng AI</span>
              </button>
            )}
            {!isAlgorithmic && onReEvaluateAlgorithmically && (
              <button
                onClick={onReEvaluateAlgorithmically}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Chấm lại ngay tức thì bằng Thuật toán chuẩn khảo thí Cambridge"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Chấm Thuật Toán</span>
              </button>
            )}
            <button
              onClick={handleExportWord}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Tải báo cáo Word (.doc)"
            >
              <FileDown className="w-4 h-4" />
              <span>Xuất Word (.doc)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Đóng báo cáo"
              aria-label="Đóng báo cáo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUB-NAV TABS */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-xs font-bold shrink-0">
          <div className="flex space-x-2 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tổng Quan 4 Tiêu Chí
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'transcript'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Kịch Bản & Sửa Lỗi Từng Câu
            </button>
          </div>

          {/* Quick Word Export for Mobile */}
          <button
            onClick={handleExportWord}
            className="sm:hidden flex items-center space-x-1 p-1.5 text-xs text-purple-300"
          >
            <FileDown className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-200">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 1. OVERALL HERO SCORECARD */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/70 border border-purple-800/40 relative overflow-hidden shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      IELTS Official Scale
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      Điểm Dự Phóng Overall
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                      {evaluation.examinerSummaryVerdict || 'Thí sinh đã hoàn thành buổi thi mô phỏng chuẩn xác IDP/BC.'}
                    </p>
                  </div>

                  {/* Band Score Circle */}
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-purple-950/80 border border-purple-700/60 shadow-2xl shrink-0 min-w-36 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-purple-300 tracking-wider">
                      BAND SCORE
                    </span>
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight my-0.5">
                      {overallBand.toFixed(1)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${rank.color} mt-1`}>
                      {rank.title}
                    </span>
                  </div>
                </div>

                {/* Speech Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-purple-900/40 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Tổng Số Từ</span>
                    <span className="text-base sm:text-lg font-black text-white">{speechAnalytics.totalWords} từ</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Tốc Độ Nói (Pace)</span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">{speechAnalytics.wordsPerMinute} wpm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Từ Đệm (Fillers)</span>
                    <span className="text-base sm:text-lg font-black text-amber-400">{speechAnalytics.fillerWordsCount} lần</span>
                  </div>
                </div>
              </div>

              {/* 2. 4 CRITERIA CARDS (FC, LR, GRA, PR) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Criteria 1: FC */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Tiêu chí 1</span>
                      <h4 className="text-sm font-black text-white">Fluency & Coherence (FC)</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-purple-600 text-white font-black text-sm">
                      {criteria.fc?.band?.toFixed(1) || '6.0'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p><strong className="text-emerald-400">✓ Điểm mạnh:</strong> {criteria.fc?.strengths}</p>
                    <p><strong className="text-rose-400">⚠️ Cần cải thiện:</strong> {criteria.fc?.weaknesses}</p>
                    {criteria.fc?.fillerAnalysis && (
                      <p className="text-[11px] text-slate-400 italic">💬 {criteria.fc.fillerAnalysis}</p>
                    )}
                  </div>
                </div>

                {/* Criteria 2: LR */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Tiêu chí 2</span>
                      <h4 className="text-sm font-black text-white">Lexical Resource (LR)</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-sm">
                      {criteria.lr?.band?.toFixed(1) || '6.0'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p><strong className="text-emerald-400">✓ Điểm mạnh:</strong> {criteria.lr?.strengths}</p>
                    <p><strong className="text-rose-400">⚠️ Cần cải thiện:</strong> {criteria.lr?.weaknesses}</p>
                    {criteria.lr?.advancedWordsUsed && criteria.lr.advancedWordsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="text-[10px] text-slate-400 mr-1">Từ tốt:</span>
                        {criteria.lr.advancedWordsUsed.map((w, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 text-[10px] font-bold">
                            {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Criteria 3: GRA */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Tiêu chí 3</span>
                      <h4 className="text-sm font-black text-white">Grammatical Range & Accuracy (GRA)</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-600 text-white font-black text-sm">
                      {criteria.gra?.band?.toFixed(1) || '6.0'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p><strong className="text-emerald-400">✓ Điểm mạnh:</strong> {criteria.gra?.strengths}</p>
                    <p><strong className="text-rose-400">⚠️ Cần cải thiện:</strong> {criteria.gra?.weaknesses}</p>
                    {criteria.gra?.frequentMistakes && criteria.gra.frequentMistakes.length > 0 && (
                      <p className="text-[11px] text-amber-300">
                        ⚡ Phát hiện {criteria.gra.frequentMistakes.length} lỗi ngữ pháp cụ thể (xem chi tiết ở Tab Kịch Bản).
                      </p>
                    )}
                  </div>
                </div>

                {/* Criteria 4: PR */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Tiêu chí 4</span>
                      <h4 className="text-sm font-black text-white">Pronunciation & Intonation (PR)</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-black text-sm">
                      {criteria.pr?.band?.toFixed(1) || '6.0'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p><strong className="text-emerald-400">✓ Điểm mạnh:</strong> {criteria.pr?.strengths}</p>
                    <p><strong className="text-rose-400">⚠️ Cần cải thiện:</strong> {criteria.pr?.weaknesses}</p>
                    {criteria.pr?.intonationAdvice && (
                      <p className="text-[11px] text-slate-400 italic">💡 {criteria.pr.intonationAdvice}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* 3. TOP 3 ACTIONABLE PRIORITIES (ROADMAP TO +0.5 BAND) */}
              {evaluation.topActionablePriorities && evaluation.topActionablePriorities.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-700/50 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-black text-white tracking-wide uppercase">
                      Top 3 Hành Động Cần Làm Để Tăng 0.5 Band
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {evaluation.topActionablePriorities.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-black text-purple-400 uppercase">Ưu tiên #{idx + 1}</span>
                        <p className="text-xs text-slate-200 leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. RECOMMENDED ADVANCED COLLOCATIONS */}
              {criteria.lr?.recommendedCollocations && criteria.lr.recommendedCollocations.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Cụm Collocations C1-C2 Đắt Giá Nên Dùng Cho Chủ Đề Này
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {criteria.lr.recommendedCollocations.map((col, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-purple-300">{col.phrase}</span>
                          <button
                            onClick={() => handleCopyCollocation(col.phrase, idx)}
                            className="text-[10px] text-slate-400 hover:text-white p-1"
                            title="Sao chép"
                          >
                            {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">{col.meaning}</p>
                        {col.example && (
                          <p className="text-[10px] text-slate-500 italic">"{col.example}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">
                  Xem lại toàn bộ câu trả lời, nhận xét chi tiết, phát hiện lỗi và câu mẫu Band 8.5+
                </span>
                <span className="text-xs font-bold text-purple-400">
                  {evaluation.turnEvaluations?.length || 0} lượt thoại
                </span>
              </div>

              {(evaluation.turnEvaluations || []).map((turn, idx) => {
                const isExpanded = !!expandedTurns[idx];
                return (
                  <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
                    {/* Turn Header */}
                    <div 
                      onClick={() => toggleTurn(idx)}
                      className="p-4 bg-slate-900 hover:bg-slate-800/80 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                          {turn.stage || `Câu ${idx + 1}`}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {turn.question}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        {turn.corrections && turn.corrections.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                            {turn.corrections.length} lỗi
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Turn Expanded Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-4 border-t border-slate-800/80 bg-slate-950/40 text-xs">
                        
                        {/* Candidate Spoken Text */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Câu trả lời của bạn:
                          </span>
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 italic leading-relaxed">
                            "{turn.candidateAnswer}"
                          </div>
                        </div>

                        {/* Inline Feedback */}
                        {turn.inlineFeedback && (
                          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 leading-relaxed">
                            <strong className="text-purple-300">Nhận xét Giám khảo:</strong> {turn.inlineFeedback}
                          </div>
                        )}

                        {/* Corrections */}
                        {turn.corrections && turn.corrections.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                              Sửa lỗi ngữ pháp & diễn đạt:
                            </span>
                            <div className="space-y-1.5">
                              {turn.corrections.map((corr, cIdx) => (
                                <div key={cIdx} className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 text-slate-300 space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-rose-400 line-through">"{corr.original}"</span>
                                    <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className="text-emerald-400 font-bold">"{corr.corrected}"</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400">{corr.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upgraded Band 8.5+ Model Response */}
                        {turn.upgradedBand8 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-emerald-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                Phiên Bản Nâng Cấp Band 8.5+ (Giữ nguyên ý tưởng của bạn):
                              </span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-100 font-medium leading-relaxed">
                              "{turn.upgradedBand8}"
                            </div>
                          </div>
                        )}

                        {/* Golden Collocations */}
                        {turn.goldenCollocations && turn.goldenCollocations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400 mr-1">Collocations hay:</span>
                            {turn.goldenCollocations.map((gc, gcIdx) => (
                              <span key={gcIdx} className="px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-800/60 text-purple-300 font-bold text-[10px]">
                                {gc}
                              </span>
                            ))}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* BOTTOM MODAL FOOTER */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Kết quả đã được tự động lưu vào Lịch Sử bài thi Speaking của bạn.
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {onRetryExam && (
              <button
                onClick={() => {
                  onClose();
                  onRetryExam();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thi Lại Bài Này</span>
              </button>
            )}

            <button
              onClick={handleExportWord}
              className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-purple-900/40"
            >
              Hoàn Thành & Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
