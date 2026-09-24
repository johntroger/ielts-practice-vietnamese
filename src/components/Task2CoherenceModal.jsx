import React, { useState } from 'react';
import { 
  X, 
  GitCommit, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Copy, 
  BookOpen, 
  Layers, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { analyzeTask2Coherence } from '../utils/coherenceAnalyzer';

export default function Task2CoherenceModal({
  isOpen,
  onClose,
  essayText = '',
  onInsertText
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(0);

  if (!isOpen) return null;

  const analysis = analyzeTask2Coherence(essayText);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInsert = (text) => {
    if (onInsertText) {
      onInsertText(text);
    }
  };

  const activePara = analysis.paragraphs[selectedParagraphIndex] || analysis.paragraphs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Phân Tích Cấu Trúc Lập Luận & Mạch Lạc</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                  Task 2 Cambridge
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Tiêu chuẩn giám khảo: Macro-structure ➔ Luận điểm Thesis ➔ Cấu trúc PEEL từng đoạn thân bài
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Macro-structure */}
            <div className={`p-3 rounded-xl border ${
              analysis.isStandardParagraphing 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Bố Cục Đoạn</span>
                {analysis.isStandardParagraphing ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black">
                {analysis.paragraphCount} Đoạn
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.isStandardParagraphing ? 'Chuẩn 4-5 đoạn' : 'Nên chia 4 đoạn'}
              </div>
            </div>

            {/* Thesis Statement */}
            <div className={`p-3 rounded-xl border ${
              analysis.thesis.hasThesis 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Thesis (Mở Bài)</span>
                {analysis.thesis.hasThesis ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black truncate">
                {analysis.thesis.hasThesis ? 'Đã Có ✓' : 'Chưa Có ⚠️'}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.thesis.hasThesis ? 'Bảo đảm TR 7.0+' : 'Nguy cơ trần Band 6'}
              </div>
            </div>

            {/* PEEL Examples */}
            <div className={`p-3 rounded-xl border ${
              analysis.metrics.totalExamples >= 2 
                ? 'bg-purple-50 border-purple-200 text-purple-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Dẫn Chứng</span>
                {analysis.metrics.totalExamples >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black">
                {analysis.metrics.totalExamples} Ví Dụ
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.metrics.totalExamples >= 2 ? 'Đủ minh họa thực tế' : 'Cần thêm ví dụ'}
              </div>
            </div>

            {/* Hedging */}
            <div className={`p-3 rounded-xl border ${
              analysis.metrics.totalHedging >= 1 
                ? 'bg-teal-50 border-teal-200 text-teal-900' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Hedging & Phản Đề</span>
                {analysis.metrics.totalHedging >= 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black">
                {analysis.metrics.totalHedging} Vị Trí
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.metrics.totalHedging >= 1 ? 'Lập luận đa chiều' : 'Nên thêm phản biện'}
              </div>
            </div>
          </div>

          {/* Thesis Statement Diagnostic Banner */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            analysis.thesis.hasThesis 
              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Chẩn Đoán Thesis Statement (Mở Bài)</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                analysis.thesis.hasThesis ? 'bg-indigo-200 text-indigo-800' : 'bg-rose-200 text-rose-800'
              }`}>
                {analysis.thesis.hasThesis ? 'Band 7.0+ TR Ready' : 'Cần Bổ Sung Gấp'}
              </span>
            </div>

            <p className="text-xs leading-relaxed">
              {analysis.thesis.feedback}
            </p>

            {analysis.thesis.hasThesis && analysis.thesis.thesisSentence && (
              <div className="p-2.5 bg-white rounded-lg border border-indigo-200 text-xs italic text-indigo-950 font-medium">
                "{analysis.thesis.thesisSentence}"
              </div>
            )}

            {!analysis.thesis.hasThesis && onInsertText && (
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleInsert(analysis.sampleTemplates.opinionAgree)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chèn Thesis "Đồng Ý Hoàn Toàn"</span>
                </button>
                <button
                  onClick={() => handleInsert(analysis.sampleTemplates.bothViews)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chèn Thesis "Thảo Luận Cả 2 Mặt"</span>
                </button>
              </div>
            )}
          </div>

          {/* Paragraph Visual Flow Explorer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Giải Phẫu Chi Tiết Từng Đoạn (PEEL Functional Flow)</span>
              </h4>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Nhấp từng đoạn để kiểm tra chức năng từng câu
              </span>
            </div>

            {/* Paragraph Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
              {analysis.paragraphs.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedParagraphIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedParagraphIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{p.label}</span>
                  <span className="ml-1 text-[10px] opacity-75">({p.wordCount}t)</span>
                </button>
              ))}
            </div>

            {/* Active Paragraph Detail Card */}
            {activePara && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{activePara.label}</span>
                    <span className="text-[11px] text-slate-500">
                      • {activePara.wordCount} từ ({activePara.sentenceCount} câu)
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10px] font-bold">
                    {activePara.role === 'body' && (
                      <>
                        <span className={`px-2 py-0.5 rounded ${
                          activePara.health.hasTopic ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {activePara.health.hasTopic ? 'Topic Sentence ✓' : 'Thiếu Topic ⚠️'}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${
                          activePara.health.hasExample ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activePara.health.hasExample ? 'Dẫn chứng ✓' : 'Thiếu ví dụ ⚠️'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sentences Breakdown */}
                <div className="space-y-2">
                  {activePara.sentences.map((sent, sIdx) => {
                    const badgeStyles = {
                      indigo: 'bg-indigo-100 text-indigo-900 border-indigo-300',
                      blue: 'bg-blue-100 text-blue-900 border-blue-300',
                      purple: 'bg-purple-100 text-purple-900 border-purple-300',
                      emerald: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                      amber: 'bg-amber-100 text-amber-900 border-amber-300',
                      rose: 'bg-rose-100 text-rose-900 border-rose-300',
                      sky: 'bg-sky-100 text-sky-900 border-sky-300',
                      teal: 'bg-teal-100 text-teal-900 border-teal-300',
                      slate: 'bg-slate-100 text-slate-800 border-slate-300'
                    };

                    const bStyle = badgeStyles[sent.badgeColor] || badgeStyles.slate;

                    return (
                      <div 
                        key={sIdx}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1.5 text-xs text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${bStyle}`}>
                            Câu {sIdx + 1}: {sent.roleLabel}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-sans">
                          {sent.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendations for this paragraph */}
                {activePara.recommendations.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gợi ý cải thiện cho {activePara.label}:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                      {activePara.recommendations.map((rec, rIdx) => (
                        <li key={rIdx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Cambridge Template Samples */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Kho Khung Mẫu C1/C2 (Band 8.0+ Ready)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400">Sao chép hoặc chèn trực tiếp</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="text-[10px] font-bold text-amber-400 block">Ví dụ thực tế PEEL:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{analysis.sampleTemplates.peelExample}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleCopy(analysis.sampleTemplates.peelExample, 'ex')}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedKey === 'ex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {onInsertText && (
                    <button
                      onClick={() => handleInsert(analysis.sampleTemplates.peelExample)}
                      className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
                    >
                      Chèn
                    </button>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="text-[10px] font-bold text-teal-400 block">Tái khẳng định kết bài:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{analysis.sampleTemplates.conclusionSignal}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleCopy(analysis.sampleTemplates.conclusionSignal, 'conc')}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedKey === 'conc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {onInsertText && (
                    <button
                      onClick={() => handleInsert(analysis.sampleTemplates.conclusionSignal)}
                      className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
                    >
                      Chèn
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tiêu chuẩn khảo thí: Cambridge IELTS Band Descriptors (TR & CC)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
}
