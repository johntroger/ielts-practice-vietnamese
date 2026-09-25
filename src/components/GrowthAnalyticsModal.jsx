import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Calendar, Clock, AlertTriangle, CheckCircle2, 
  ChevronRight, Sparkles, Target, Zap, BookOpen, Mic, Headphones, PenTool, X, ShieldCheck
} from 'lucide-react';
import { 
  generateGrowthAnalyticsReport, 
  DEFAULT_WEEKLY_STUDY_HOURS 
} from '../services/growthPredictorService.js';

export default function GrowthAnalyticsModal({
  isOpen,
  onClose,
  initialTargetBand = 7.0,
  userScores = { listening: 6.5, reading: 6.5, writing: 6.0, speaking: 6.0, overall: 6.5 },
  onNavigateSkill
}) {
  const [targetBand, setTargetBand] = useState(initialTargetBand);
  const [weeklyHours, setWeeklyHours] = useState(DEFAULT_WEEKLY_STUDY_HOURS);

  const report = useMemo(() => {
    return generateGrowthAnalyticsReport({
      currentScores: userScores,
      targetBand,
      weeklyStudyHours: weeklyHours
    });
  }, [userScores, targetBand, weeklyHours]);

  if (!isOpen) return null;

  const skillIcons = {
    listening: <Headphones className="w-4 h-4 text-sky-400" />,
    reading: <BookOpen className="w-4 h-4 text-emerald-400" />,
    writing: <PenTool className="w-4 h-4 text-purple-400" />,
    speaking: <Mic className="w-4 h-4 text-amber-400" />
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="growth-analytics-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 id="growth-analytics-title" className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>Dự Báo Tăng Trưởng & Ngày Đạt Target Band</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Cambridge AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mô hình học máy dự báo dựa trên định mức khảo thí Cambridge (~120 giờ luyện tập chủ động / 0.5 band)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Target & Weekly Intensity Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>Mục tiêu Overall Band mong muốn:</span>
              </label>
              <div className="flex items-center space-x-2">
                {[6.5, 7.0, 7.5, 8.0, 8.5].map(b => (
                  <button
                    key={b}
                    onClick={() => setTargetBand(b)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      targetBand === b
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Band {b.toFixed(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Thời lượng học mỗi tuần:</span>
                </span>
                <span className="text-indigo-400 font-mono font-bold">{weeklyHours} giờ / tuần</span>
              </label>
              <div className="flex items-center space-x-2">
                {[4, 6, 8, 12, 16].map(h => (
                  <button
                    key={h}
                    onClick={() => setWeeklyHours(h)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      weeklyHours === h
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {h}h/tuần
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Prediction Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: ETA Date */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dự Kiến Cán Đích</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-200">
                  ETA
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {report.estimatedCompletionDate}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {report.weeksRemaining > 0 ? `Còn khoảng ${report.weeksRemaining} tuần (~${report.daysRemaining} ngày) nữa` : 'Bạn đã chạm hoặc vượt mốc mục tiêu!'}
                </p>
              </div>
            </div>

            {/* Card 2: Hours Needed */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Giờ Luyện Tập Cần</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-200">
                  Total
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-indigo-200 tracking-tight">
                  {report.totalHoursRequired} <span className="text-base font-normal text-slate-400">giờ</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Khoảng cách: +{report.overallGap} band (Hiện tại {report.currentScores.overall} → Target {report.targetBand})
                </p>
              </div>
            </div>

            {/* Card 3: Completion Progress */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tiến Trình Cán Đích</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-200">
                  {report.progressPercentage}%
                </span>
              </div>
              <div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(5, report.progressPercentage))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Dựa trên baseline điểm khởi đầu Band 4.0
                </p>
              </div>
            </div>
          </div>

          {/* Primary Bottleneck Spotlight */}
          {report.skillAnalysis.primaryBottleneck && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                    <span>Điểm Nghẽn Cần Khắc Phục Ưu Tiên Số 1</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                      Cần +{report.skillAnalysis.primaryBottleneck.gap} band
                    </span>
                  </h4>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {report.skillAnalysis.primaryBottleneck.label} (Đang ở Band {report.skillAnalysis.primaryBottleneck.currentBand.toFixed(1)})
                  </p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    💡 <strong className="text-amber-200">Lời khuyên Cambridge:</strong> {report.skillAnalysis.primaryBottleneck.prescription}
                  </p>
                </div>
              </div>

              {onNavigateSkill && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSkill(report.skillAnalysis.primaryBottleneck.skill);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <span>Luyện {report.skillAnalysis.primaryBottleneck.label.split(' ')[0]} ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* 4 Skills Gap Matrix */}
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Phân Tích Chi Tiết 4 Kỹ Năng (Skill Gaps Breakdown)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.skillAnalysis.gaps.map((item) => {
                const isReached = item.gap <= 0;
                return (
                  <div 
                    key={item.skill}
                    className={`p-4 rounded-2xl border transition-all ${
                      isReached 
                        ? 'bg-emerald-950/15 border-emerald-500/30' 
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {skillIcons[item.skill]}
                        <span className="font-bold text-sm text-white">{item.label}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        isReached 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {isReached ? 'Đã đạt' : `Thiếu ${item.gap} band (~${item.hoursNeeded}h)`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Hiện tại: <strong className="text-white">{item.currentBand.toFixed(1)}</strong></span>
                      <span>Mục tiêu: <strong className="text-purple-300">{item.targetBand.toFixed(1)}</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-2">
                      {item.prescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Định mức được hiệu chỉnh tự động khi bạn làm thêm bài test mới.</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Đã hiểu & Tiếp tục luyện thi
          </button>
        </div>
      </div>
    </div>
  );
}
