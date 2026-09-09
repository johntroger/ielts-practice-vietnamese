import React, { useState } from 'react';
import {
  RefreshCw,
  Award,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  X,
  Sparkles,
  FileText,
  CheckSquare,
  Square,
  AlertTriangle,
  Lightbulb,
  Copy,
  ChevronRight,
  Layers,
  BarChart2
} from 'lucide-react';
import { evaluateRevisionComparison } from '../services/geminiService';
import { countWords } from '../utils/textAnalytics';

export default function RevisionModal({
  isOpen,
  onClose,
  task,
  v1Essay,
  v1Evaluation,
  onSaveV2Submission,
  apiKey,
  model
}) {
  if (!isOpen || !task) return null;

  const [v2Text, setV2Text] = useState(v1Essay || '');
  const [isSubmittingV2, setIsSubmittingV2] = useState(false);
  const [v2Evaluation, setV2Evaluation] = useState(null);

  // Checkbox state for error correction checklist
  const [checkedFixes, setCheckedFixes] = useState({});

  const wordCount = countWords(v2Text);
  const v1Band = Number(v1Evaluation?.overallBand || 6.0);

  const toggleCheck = (index) => {
    setCheckedFixes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleApplyFix = (correctedText) => {
    if (!correctedText) return;
    navigator.clipboard.writeText(correctedText);
  };

  const handleGradeV2 = async () => {
    if (!apiKey) {
      alert('Vui lòng vào phần Cài đặt để cấu hình Gemini API Key trước.');
      return;
    }
    if (wordCount < 20) {
      alert('Vui lòng viết ít nhất 20 từ để giám khảo chấm điểm.');
      return;
    }

    setIsSubmittingV2(true);
    try {
      const evaluation = await evaluateRevisionComparison({
        task,
        v1Text: v1Essay,
        v1Evaluation,
        v2Text,
        apiKey,
        model
      });

      setV2Evaluation(evaluation);

      if (onSaveV2Submission) {
        onSaveV2Submission({
          id: `sub-v2-${Date.now()}`,
          task,
          essayText: v2Text,
          evaluation,
          stats: { wordCount, version: 2 },
          date: new Date().toLocaleDateString('vi-VN')
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Lỗi khi so sánh và chấm bản v2.');
    } finally {
      setIsSubmittingV2(false);
    }
  };

  const v2Band = v2Evaluation?.overallBand;
  const bandDiff = v2Band !== undefined ? (Number(v2Band) - v1Band).toFixed(1) : null;
  const isImproved = Number(bandDiff) > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">Phòng Viết Lại Nâng Band (Revision Studio v1 ➔ v2)</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Task {task.taskNumber}: {task.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Đối chiếu trực tiếp bản v1 với v2, sửa từng lỗi sai để bứt phá mục tiêu Band 6.0 – 7.5+
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPARISON SCOREBOARD BANNER (When V2 is Evaluated) */}
        {v2Evaluation && (
          <div className={`p-4 border-b shrink-0 transition-all animate-in slide-in-from-top-2 ${
            isImproved ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-blue-50 border-blue-200 text-blue-950'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-sm ${
                  isImproved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm sm:text-base font-black">
                      Bản v1: Band {v1Band.toFixed(1)} ➔ Bản v2: Band {Number(v2Band).toFixed(1)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                      isImproved ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {Number(bandDiff) > 0 ? `+${bandDiff} Band 🚀` : `${bandDiff} Band`}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 text-slate-600 font-medium">
                    {v2Evaluation.examinerVerdict || 'Bạn đã có sự cải thiện rõ rệt so với bản viết đầu tiên!'}
                  </p>
                </div>
              </div>

              {/* 4 Criteria Delta Tags */}
              {v2Evaluation.criteria && (
                <div className="flex items-center space-x-2 text-xs font-bold">
                  <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    TR: <strong className="text-slate-900">{v2Evaluation.criteria.tr?.band}</strong>
                    <span className="ml-1 text-emerald-600">{v2Evaluation.criteria.tr?.delta}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    CC: <strong className="text-slate-900">{v2Evaluation.criteria.cc?.band}</strong>
                    <span className="ml-1 text-emerald-600">{v2Evaluation.criteria.cc?.delta}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    LR: <strong className="text-slate-900">{v2Evaluation.criteria.lr?.band}</strong>
                    <span className="ml-1 text-emerald-600">{v2Evaluation.criteria.lr?.delta}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    GRA: <strong className="text-slate-900">{v2Evaluation.criteria.gra?.band}</strong>
                    <span className="ml-1 text-emerald-600">{v2Evaluation.criteria.gra?.delta}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed vs Remaining Quick Badges */}
            {(v2Evaluation.fixedItems || v2Evaluation.remainingIssues) && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {v2Evaluation.fixedItems && v2Evaluation.fixedItems.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Các điểm đã sửa thành công:</span>
                    </span>
                    <ul className="list-disc list-inside text-emerald-900 space-y-0.5">
                      {v2Evaluation.fixedItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {v2Evaluation.remainingIssues && v2Evaluation.remainingIssues.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-amber-800 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Điểm cần tiếp tục cải thiện:</span>
                    </span>
                    <ul className="list-disc list-inside text-amber-900 space-y-0.5">
                      {v2Evaluation.remainingIssues.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DUAL SPLIT WORKSPACE */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* LEFT PANE: V1 INSPECTOR & CORRECTION CHECKLIST */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/60">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Bản gốc v1 (Band {v1Band.toFixed(1)}) & Checklist Cần Sửa</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Đã sửa: {Object.values(checkedFixes).filter(Boolean).length} / {v1Evaluation?.corrections?.length || 0}
              </span>
            </div>

            {/* Error Correction Checklist with 1-Click Copy */}
            {v1Evaluation?.corrections && v1Evaluation.corrections.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                    Danh sách câu cần tinh chỉnh trong bản v2:
                  </span>
                  <span className="text-[11px] text-slate-400">Bấm ô vuông để đánh dấu khi đã sửa</span>
                </div>

                {v1Evaluation.corrections.map((c, i) => {
                  const isChecked = !!checkedFixes[i];
                  return (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                        isChecked 
                          ? 'bg-emerald-50/50 border-emerald-200 opacity-70' 
                          : 'bg-white border-red-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button 
                          onClick={() => toggleCheck(i)}
                          className="flex items-center space-x-1.5 text-slate-700 hover:text-slate-900 font-medium text-left"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={isChecked ? 'line-through text-slate-400' : 'text-red-900 font-semibold'}>
                            "{c.original}"
                          </span>
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-950 flex items-center justify-between gap-2">
                        <div className="font-bold">
                          ➔ Sửa thành: <span className="font-serif font-bold text-emerald-900">"{c.corrected}"</span>
                        </div>
                        <button
                          onClick={() => handleApplyFix(c.corrected)}
                          title="Sao chép câu gợi ý"
                          className="p-1 rounded bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 italic pl-1">
                        💡 {c.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 text-center">
                Không tìm thấy danh sách lỗi cụ thể từ bản chấm trước. Bạn có thể tự do viết lại để tối ưu hóa từ vựng và câu văn.
              </div>
            )}

            {/* Original V1 Full Text View */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Toàn văn bản viết v1 ({countWords(v1Essay)} từ):
              </span>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed select-text">
                {v1Essay}
              </div>
            </div>
          </div>

          {/* RIGHT PANE: V2 INTERACTIVE REVISION EDITOR */}
          <div className="p-4 sm:p-5 overflow-y-auto flex flex-col space-y-3 bg-white">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Khung Soạn Thảo Bản v2</span>
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-slate-700">{wordCount} từ</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  wordCount >= task.minWords ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  (Tối thiểu: {task.minWords} từ)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Mẹo: Giữ nguyên cấu trúc luận điểm của bản v1, tập trung thay thế các từ vựng lặp, sửa lỗi chia thì và áp dụng các cấu trúc câu ghép/phân từ mượt mà hơn.
            </p>

            <textarea
              value={v2Text}
              onChange={(e) => setV2Text(e.target.value)}
              placeholder="Chỉnh sửa hoặc gõ lại bài viết hoàn chỉnh bản v2 tại đây..."
              className="flex-1 w-full p-4 rounded-xl border border-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none min-h-[380px]"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setV2Text(v1Essay)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                title="Khôi phục lại nội dung bản v1 ban đầu"
              >
                Khôi phục lại bản v1
              </button>

              <button
                onClick={handleGradeV2}
                disabled={isSubmittingV2}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmittingV2 ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini Đang So Sánh v1 & v2...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Chấm Bản v2 & Đo Mức Tăng Band</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
