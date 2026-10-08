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
import { validatePeelParagraphAlgorithmically } from '../services/geminiService';
import { useTranslation } from '../i18n';

const getParagraphLabel = (p, isEn) => {
  if (!p) return '';
  if (!isEn) return p.label;
  if (p.role === 'intro') return 'Introduction';
  if (p.role === 'conclusion') return 'Conclusion';
  return `Body Paragraph ${p.index}`;
};

const getSentenceRoleLabel = (sent, isEn) => {
  if (!sent) return '';
  if (!isEn) return sent.roleLabel;
  const roleMap = {
    thesis: 'Thesis Statement',
    background: 'Background / Paraphrase',
    intro_supporting: 'Introductory Context',
    conclusion_signal: 'Concluding Signal & Stance Reaffirmation',
    conclusion_summary: 'Main Points Summary & Outlook',
    example: 'Concrete Evidence / Example',
    hedging: 'Hedging / Counter-argument',
    topic: 'Topic Sentence (Point)',
    linking: 'Linking Sentence / Mini-conclusion',
    explanation: 'Explanation / Elaboration'
  };
  return roleMap[sent.role] || sent.roleLabel;
};

const getRecommendationText = (rec, isEn) => {
  if (!isEn) return rec;
  if (rec.includes('Topic Sentence')) return 'Add a clear Topic Sentence at the beginning to establish the paragraph core.';
  if (rec.includes('ví dụ')) return 'Include concrete evidence or examples (e.g., For instance, Such as...) to substantiate arguments.';
  if (rec.includes('phản biện') || rec.includes('thận trọng')) return 'Consider introducing academic hedging or counter-perspectives (e.g., However, Although...) for nuanced balance.';
  if (rec.includes('Thesis Statement')) return 'Missing an explicit Thesis Statement declaring your direct stance or roadmap in the introduction.';
  return rec;
};

const getThesisFeedback = (thesis, isEn) => {
  if (!isEn) return thesis?.feedback;
  if (thesis?.hasThesis) {
    return 'Clear thesis statement identified in the introduction, outlining your perspective and directly addressing the prompt to satisfy Band 7.0+ TR requirements.';
  }
  return 'No thesis statement detected in the introduction. Add an explicit stance before the conclusion to prevent capping your Task Response band at 6.0.';
};

const getSampleTemplates = (templates, isEn) => {
  if (!isEn) return templates || {};
  return {
    opinionAgree: 'In my opinion, I completely agree with this view because [Primary Reason 1], and [Secondary Reason 2].',
    opinionDisagree: 'From my perspective, I firmly disagree with this statement since [Counter-argument 1], and [Counter-argument 2].',
    bothViews: 'While it is true that [Perspective A has valid grounds], I am convinced that [Perspective B carries far greater weight].',
    peelExample: 'For instance, empirical evidence from countries such as Singapore demonstrates that [concrete real-world case study].',
    conclusionSignal: 'In conclusion, while [briefly acknowledging the opposing facet], I firmly reaffirm that [restate your primary thesis statement].'
  };
};

export default function Task2CoherenceModal({
  isOpen,
  onClose,
  essayText = '',
  onInsertText
}) {
  const { t, isEn } = useTranslation();
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(0);

  // Unconditionally call useMemo hooks before any early return to strictly adhere to React Rules of Hooks
  const analysis = React.useMemo(() => {
    if (!isOpen) return null;
    return analyzeTask2Coherence(essayText);
  }, [isOpen, essayText]);

  const activePara = analysis?.paragraphs?.[selectedParagraphIndex] || analysis?.paragraphs?.[0] || null;

  // Reset selected paragraph index when essay paragraphs change
  React.useEffect(() => {
    if (analysis?.paragraphs && selectedParagraphIndex >= analysis.paragraphs.length) {
      setSelectedParagraphIndex(0);
    }
  }, [analysis, selectedParagraphIndex]);

  const activePeel = React.useMemo(() => {
    if (!isOpen || !activePara || activePara.role !== 'body' || !activePara.text) return null;
    return validatePeelParagraphAlgorithmically({ paragraphText: activePara.text });
  }, [isOpen, activePara]);

  const sampleTemplates = React.useMemo(() => getSampleTemplates(analysis?.sampleTemplates, isEn), [analysis?.sampleTemplates, isEn]);

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

  if (!isOpen || !analysis) return null;

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
                <span>{isEn ? 'Argument Structure & Coherence Flow' : 'Phân Tích Cấu Trúc Lập Luận & Mạch Lạc'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                  Task 2 Cambridge
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {isEn 
                  ? 'Examiner benchmark: Macro-structure ➔ Thesis Statement ➔ PEEL Paragraph Flow' 
                  : 'Tiêu chuẩn giám khảo: Macro-structure ➔ Luận điểm Thesis ➔ Cấu trúc PEEL từng đoạn thân bài'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'Đóng'}
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
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isEn ? 'Paragraphs' : 'Bố Cục Đoạn'}
                </span>
                {analysis.isStandardParagraphing ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black">
                {analysis.paragraphCount} {isEn ? (analysis.paragraphCount === 1 ? 'Paragraph' : 'Paragraphs') : 'Đoạn'}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.isStandardParagraphing 
                  ? (isEn ? 'Standard 4-5 paragraphs' : 'Chuẩn 4-5 đoạn') 
                  : (isEn ? '4-5 paragraphs advised' : 'Nên chia 4 đoạn')}
              </div>
            </div>

            {/* Thesis Statement */}
            <div className={`p-3 rounded-xl border ${
              analysis.thesis.hasThesis 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isEn ? 'Thesis (Intro)' : 'Thesis (Mở Bài)'}
                </span>
                {analysis.thesis.hasThesis ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black truncate">
                {analysis.thesis.hasThesis ? (isEn ? 'Present ✓' : 'Đã Có ✓') : (isEn ? 'Missing ⚠️' : 'Chưa Có ⚠️')}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.thesis.hasThesis 
                  ? (isEn ? 'TR 7.0+ Ready' : 'Bảo đảm TR 7.0+') 
                  : (isEn ? 'Risk Band 6 cap' : 'Nguy cơ trần Band 6')}
              </div>
            </div>

            {/* PEEL Examples */}
            <div className={`p-3 rounded-xl border ${
              analysis.metrics.totalExamples >= 2 
                ? 'bg-purple-50 border-purple-200 text-purple-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isEn ? 'Evidence / Examples' : 'Dẫn Chứng'}
                </span>
                {analysis.metrics.totalExamples >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black">
                {analysis.metrics.totalExamples} {isEn ? (analysis.metrics.totalExamples === 1 ? 'Example' : 'Examples') : 'Ví Dụ'}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.metrics.totalExamples >= 2 
                  ? (isEn ? 'Sufficient grounding' : 'Đủ minh họa thực tế') 
                  : (isEn ? 'More evidence needed' : 'Cần thêm ví dụ')}
              </div>
            </div>

            {/* Hedging */}
            <div className={`p-3 rounded-xl border ${
              analysis.metrics.totalHedging >= 1 
                ? 'bg-teal-50 border-teal-200 text-teal-900' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isEn ? 'Hedging & Nuance' : 'Hedging & Phản Đề'}
                </span>
                {analysis.metrics.totalHedging >= 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="text-sm sm:text-base font-black">
                {analysis.metrics.totalHedging} {isEn ? (analysis.metrics.totalHedging === 1 ? 'Instance' : 'Instances') : 'Vị Trí'}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {analysis.metrics.totalHedging >= 1 
                  ? (isEn ? 'Balanced argumentation' : 'Lập luận đa chiều') 
                  : (isEn ? 'Add counter-argument' : 'Nên thêm phản biện')}
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
                <span>{isEn ? 'Thesis Statement Diagnostic (Introduction)' : 'Chẩn Đoán Thesis Statement (Mở Bài)'}</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                analysis.thesis.hasThesis ? 'bg-indigo-200 text-indigo-800' : 'bg-rose-200 text-rose-800'
              }`}>
                {analysis.thesis.hasThesis ? 'Band 7.0+ TR Ready' : (isEn ? 'Urgent Revision Needed' : 'Cần Bổ Sung Gấp')}
              </span>
            </div>

            <p className="text-xs leading-relaxed">
              {getThesisFeedback(analysis.thesis, isEn)}
            </p>

            {analysis.thesis.hasThesis && analysis.thesis.thesisSentence && (
              <div className="p-2.5 bg-white rounded-lg border border-indigo-200 text-xs italic text-indigo-950 font-medium">
                "{analysis.thesis.thesisSentence}"
              </div>
            )}

            {!analysis.thesis.hasThesis && onInsertText && (
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleInsert(sampleTemplates.opinionAgree)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Insert "Strong Agree" Thesis' : 'Chèn Thesis "Đồng Ý Hoàn Toàn"'}</span>
                </button>
                <button
                  onClick={() => handleInsert(sampleTemplates.bothViews)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Insert "Balanced / Both Views" Thesis' : 'Chèn Thesis "Thảo Luận Cả 2 Mặt"'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Paragraph Visual Flow Explorer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{isEn ? 'Detailed Paragraph Functional Flow (PEEL Anatomy)' : 'Giải Phẫu Chi Tiết Từng Đoạn (PEEL Functional Flow)'}</span>
              </h4>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {isEn ? 'Click each paragraph to inspect sentence-by-sentence roles' : 'Nhấp từng đoạn để kiểm tra chức năng từng câu'}
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
                  <span>{getParagraphLabel(p, isEn)}</span>
                  <span className="ml-1 text-[10px] opacity-75">({p.wordCount}{isEn ? 'w' : 't'})</span>
                </button>
              ))}
            </div>

            {/* Active Paragraph Detail Card */}
            {activePara && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{getParagraphLabel(activePara, isEn)}</span>
                    <span className="text-[11px] text-slate-500">
                      • {activePara.wordCount} {isEn ? 'words' : 'từ'} ({activePara.sentenceCount} {isEn ? 'sentences' : 'câu'})
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10px] font-bold">
                    {activePara.role === 'body' && (
                      <>
                        {activePeel && (
                          <span className={`px-2 py-0.5 rounded font-black border ${
                            activePeel.completenessScore >= 80
                              ? 'bg-purple-100 text-purple-900 border-purple-200'
                              : 'bg-amber-100 text-amber-900 border-amber-200'
                          }`}>
                            PEEL: {activePeel.completenessScore}% (Band {activePeel.estimatedBand})
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded ${
                          activePara.health.hasTopic ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {activePara.health.hasTopic ? 'Topic Sentence ✓' : (isEn ? 'Missing Topic ⚠️' : 'Thiếu Topic ⚠️')}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${
                          activePara.health.hasExample ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activePara.health.hasExample ? (isEn ? 'Evidence ✓' : 'Dẫn chứng ✓') : (isEn ? 'Missing Example ⚠️' : 'Thiếu ví dụ ⚠️')}
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
                            {isEn ? 'Sentence' : 'Câu'} {sIdx + 1}: {getSentenceRoleLabel(sent, isEn)}
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
                      <span>{isEn ? `Improvement suggestions for ${getParagraphLabel(activePara, isEn)}:` : `Gợi ý cải thiện cho ${activePara.label}:`}</span>
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                      {activePara.recommendations.map((rec, rIdx) => (
                        <li key={rIdx}>{getRecommendationText(rec, isEn)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* PEEL Unsupported Claims Warning */}
                {activePeel && activePeel.unsupportedClaims && activePeel.unsupportedClaims.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                    <span className="font-bold flex items-center space-x-1 text-rose-800">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isEn ? 'Warning: Unsupported Claims Detected:' : 'Cảnh báo Lập luận Thiếu Căn cứ (Unsupported Claims):'}</span>
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800">
                      {activePeel.unsupportedClaims.map((uc, uIdx) => (
                        <li key={uIdx}>
                          <span className="italic">"{uc.sentence}"</span>: {uc.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* PEEL Exemplary Rewrite for Body Paragraph */}
                {activePeel && activePeel.exemplaryUpgrade?.text && (
                  <div className="p-3 rounded-lg bg-purple-50/80 border border-purple-200 text-xs text-purple-950 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center space-x-1 text-purple-900">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{isEn ? 'Exemplary Band 8.5+ PEEL Model Rewrite:' : 'Mẫu PEEL Viết Lại Band 8.5+:'}</span>
                      </span>
                      <button
                        onClick={() => handleCopy(activePeel.exemplaryUpgrade.text, `peel-upgrade-${selectedParagraphIndex}`)}
                        className="flex items-center space-x-1 text-purple-600 hover:text-purple-900 font-bold text-[10px] cursor-pointer"
                      >
                        {copiedKey === `peel-upgrade-${selectedParagraphIndex}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">{isEn ? 'Copied' : 'Đã chép'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isEn ? 'Copy' : 'Sao chép'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-serif italic text-slate-800 leading-relaxed text-[11px]">
                      "{activePeel.exemplaryUpgrade.text}"
                    </p>
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
                  {isEn ? 'C1/C2 Academic Framework Templates (Band 8.0+ Ready)' : 'Kho Khung Mẫu C1/C2 (Band 8.0+ Ready)'}
                </h4>
              </div>
              <span className="text-[10px] text-slate-400">{isEn ? 'Copy or insert directly into essay' : 'Sao chép hoặc chèn trực tiếp'}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="text-[10px] font-bold text-amber-400 block">{isEn ? 'Real-world PEEL Evidence:' : 'Ví dụ thực tế PEEL:'}</span>
                  <span className="text-slate-300 font-mono text-[11px]">{sampleTemplates.peelExample}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleCopy(sampleTemplates.peelExample, 'ex')}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isEn ? 'Copy' : 'Sao chép'}
                  >
                    {copiedKey === 'ex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {onInsertText && (
                    <button
                      onClick={() => handleInsert(sampleTemplates.peelExample)}
                      className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
                    >
                      {isEn ? 'Insert' : 'Chèn'}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="text-[10px] font-bold text-teal-400 block">{isEn ? 'Conclusion Stance Reaffirmation:' : 'Tái khẳng định kết bài:'}</span>
                  <span className="text-slate-300 font-mono text-[11px]">{sampleTemplates.conclusionSignal}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleCopy(sampleTemplates.conclusionSignal, 'conc')}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isEn ? 'Copy' : 'Sao chép'}
                  >
                    {copiedKey === 'conc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {onInsertText && (
                    <button
                      onClick={() => handleInsert(sampleTemplates.conclusionSignal)}
                      className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
                    >
                      {isEn ? 'Insert' : 'Chèn'}
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
            <span>{isEn ? 'Exam Benchmark: Cambridge IELTS Band Descriptors (TR & CC)' : 'Tiêu chuẩn khảo thí: Cambridge IELTS Band Descriptors (TR & CC)'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            {isEn ? 'Close Panel' : 'Đóng bảng'}
          </button>
        </div>
      </div>
    </div>
  );
}
