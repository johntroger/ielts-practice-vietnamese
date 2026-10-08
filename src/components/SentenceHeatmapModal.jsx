import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  ChevronRight, 
  BookOpen, 
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';
import { useTranslation } from '../i18n';

const getGoldenGraTemplates = (isEn) => [
  {
    title: isEn ? 'Concessive Contrast Clause' : 'Mệnh đề nhượng bộ tương phản (Concessive Clause)',
    band: 'Band 7.0+',
    template: isEn 
      ? 'Although many argue that [Perspective A], it is undeniable that [Perspective B].'
      : 'Although many argue that [Quan điểm A], it is undeniable that [Quan điểm B].',
    example: 'Although many argue that higher education should be free, it is undeniable that funding constraints often compromise teaching quality.'
  },
  {
    title: isEn ? 'Relative Clause of Result' : 'Mệnh đề quan hệ chỉ hệ quả (Relative Clause of Result)',
    band: 'Band 7.5+',
    template: isEn
      ? '[Main clause], which in turn exerts a detrimental impact on [Subject/Target].'
      : '[Mệnh đề chính], which in turn exerts a detrimental impact on [Đối tượng].',
    example: 'Fossil fuel combustion generates massive carbon emissions, which in turn exerts a detrimental impact on global climate stability.'
  },
  {
    title: isEn ? 'Negative Inversion for Emphasis' : 'Đảo ngữ nhấn mạnh (Negative Inversion)',
    band: 'Band 8.0+',
    template: isEn
      ? 'Not only does/do [Subject] [Infinitive verb], but it also [Secondary action].'
      : 'Not only does/do [Chủ ngữ] [Động từ nguyên mẫu], but it also [Hành động phụ].',
    example: 'Not only does public transport alleviate urban gridlock, but it also fosters sustainable socioeconomic development.'
  },
  {
    title: isEn ? 'Participial Prepositional Clause' : 'Mệnh đề phân từ rút gọn (Participial Clause)',
    band: 'Band 8.0+',
    template: isEn
      ? 'Given the rapid pace of [Phenomenon], governments should [Strategic action].'
      : 'Given the rapid pace of [Hiện tượng], governments should [Hành động giải pháp].',
    example: 'Given the rapid pace of technological automation, governments should provide comprehensive reskilling programs for the workforce.'
  }
];

export const GOLDEN_GRA_TEMPLATES = getGoldenGraTemplates(false);

const getFeedbackMessage = (msg, status, isEn) => {
  if (!isEn || !msg) return msg;
  if (status === 'optimal') {
    return 'Outstanding grammatical variety! Your essay features an optimal proportion of complex and compound sentences with sustained academic syntax, meeting Band 7.5–8.5 GRA requirements.';
  }
  if (status === 'warning') {
    return 'Moderate syntactic variety. While compound sentences are present, consider upgrading simple sentences into complex structures (concessive clauses, inversion, relative pronouns) to reach Band 7.0+.';
  }
  return 'High density of simple sentences detected. Over-reliance on short clauses restricts your Grammatical Range & Accuracy to Band 5.5–6.0. Incorporate more subordinating conjunctions and complex links.';
};

const getSentenceExplanation = (expl, isEn) => {
  if (!isEn || !expl) return expl;
  if (expl.includes('phức') || expl.includes('subordinating')) {
    return 'Complex sentence with subordinating clause or relative marker.';
  }
  if (expl.includes('ghép') || expl.includes('coordinating')) {
    return 'Compound sentence joined with coordinating conjunction.';
  }
  if (expl.includes('đơn') || expl.includes('single')) {
    return 'Simple sentence with a single independent clause.';
  }
  return expl;
};

export default function SentenceHeatmapModal({
  isOpen,
  onClose,
  analysisData,
  onInsertTemplate
}) {
  const { t, isEn } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'complex' | 'compound' | 'simple'
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen || !analysisData) return null;

  const {
    totalSentences = 0,
    simpleCount = 0,
    compoundCount = 0,
    complexCount = 0,
    simplePercentage = 0,
    compoundPercentage = 0,
    complexPercentage = 0,
    graBandEstimate = 'N/A',
    status = 'neutral',
    feedbackMessage = '',
    sentences = []
  } = analysisData;

  const filteredSentences = sentences.filter(s => {
    if (activeFilter === 'all') return true;
    return s.type === activeFilter;
  });

  const goldenGraTemplates = getGoldenGraTemplates(isEn);

  const handleCopyTemplate = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onInsertTemplate) {
      onInsertTemplate(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92dvh] rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* ============================================================ */}
        {/* MODAL HEADER                                                */}
        {/* ============================================================ */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {isEn ? 'Sentence Structure Heatmap (GRA Spectrum)' : 'Bản Đồ Nhiệt Cấu Trúc Câu (GRA Heatmap)'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Cambridge GRA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isEn 
                  ? 'Real-time syntactic distribution audit: Simple, Compound & Complex Sentences' 
                  : 'Kiểm định phổ cấu trúc ngữ pháp thời gian thực: Câu Đơn, Câu Ghép & Câu Phức'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* MODAL SCROLLABLE BODY                                       */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. TOP DIAGNOSTIC BANNER & GRA BAND ESTIMATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {isEn ? 'Grammatical Range & Accuracy (GRA) Assessment:' : 'Đánh giá tiêu chí Grammatical Range & Accuracy:'}
                </span>
                <div className="text-lg sm:text-xl font-black text-white flex items-center space-x-2 mt-0.5">
                  <span>{isEn ? 'Projected Band:' : 'Dự phóng Band:'}</span>
                  <span className={`px-2.5 py-0.5 rounded-xl font-black text-sm sm:text-base ${
                    status === 'optimal' 
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-400/30' 
                      : status === 'warning'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-rose-500 text-white'
                  }`}>
                    Band {graBandEstimate}
                  </span>
                </div>
              </div>

              {/* Counts Badge Group */}
              <div className="flex items-center space-x-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                  {isEn ? 'Total:' : 'Tổng:'} <strong className="text-white">{totalSentences}</strong> {isEn ? (totalSentences === 1 ? 'sentence' : 'sentences') : 'câu'}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                  {isEn ? 'Complex:' : 'Phức:'} <strong>{complexCount}</strong> ({complexPercentage}%)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-800/80">
                  {isEn ? 'Compound:' : 'Ghép:'} <strong>{compoundCount}</strong> ({compoundPercentage}%)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  {isEn ? 'Simple:' : 'Đơn:'} <strong>{simpleCount}</strong> ({simplePercentage}%)
                </span>
              </div>
            </div>

            {/* 3-Color Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>{isEn ? 'Syntactic distribution across the essay' : 'Tỷ trọng phân bố loại câu trong bài'}</span>
                <span className="text-emerald-400 font-semibold">{isEn ? 'Band 7.0+ Target: Complex ≥ 50%, Simple ≤ 35%' : 'Mục tiêu Band 7.0+: Câu phức ≥ 50%, Câu đơn ≤ 35%'}</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                {complexPercentage > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                    style={{ width: `${complexPercentage}%` }}
                    title={isEn ? `Complex: ${complexPercentage}%` : `Câu Phức: ${complexPercentage}%`}
                  />
                )}
                {compoundPercentage > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-500" 
                    style={{ width: `${compoundPercentage}%` }}
                    title={isEn ? `Compound: ${compoundPercentage}%` : `Câu Ghép: ${compoundPercentage}%`}
                  />
                )}
                {simplePercentage > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500" 
                    style={{ width: `${simplePercentage}%` }}
                    title={isEn ? `Simple: ${simplePercentage}%` : `Câu Đơn: ${simplePercentage}%`}
                  />
                )}
              </div>
              <div className="flex items-center space-x-4 text-[10px] sm:text-[11px] font-bold text-slate-300 pt-0.5">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>{isEn ? 'Complex:' : 'Câu Phức:'} {complexPercentage}%</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span>{isEn ? 'Compound:' : 'Câu Ghép:'} {compoundPercentage}%</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>{isEn ? 'Simple:' : 'Câu Đơn:'} {simplePercentage}%</span>
                </span>
              </div>
            </div>

            {/* Diagnostic Message */}
            <div className={`p-3 rounded-xl text-xs font-medium leading-relaxed border ${
              status === 'optimal'
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
                : status === 'warning'
                  ? 'bg-amber-950/40 border-amber-600/40 text-amber-200'
                  : 'bg-rose-950/40 border-rose-600/40 text-rose-200'
            }`}>
              {getFeedbackMessage(feedbackMessage, status, isEn)}
            </div>
          </div>

          {/* 2. INTERACTIVE SENTENCE INSPECTOR */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isEn 
                    ? `Sentence-by-Sentence Breakdown (${filteredSentences.length}/${totalSentences})` 
                    : `Chi Tiết Từng Câu Trong Bài Viết (${filteredSentences.length}/${totalSentences})`}
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl text-xs self-start sm:self-auto">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isEn ? 'All' : 'Tất cả'} ({totalSentences})
                </button>
                <button
                  onClick={() => setActiveFilter('complex')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    activeFilter === 'complex'
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : 'text-emerald-700 hover:bg-emerald-100/60'
                  }`}
                >
                  <span>🟢 {isEn ? 'Complex' : 'Phức'}</span>
                  <span>({complexCount})</span>
                </button>
                <button
                  onClick={() => setActiveFilter('compound')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    activeFilter === 'compound'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-indigo-700 hover:bg-indigo-100/60'
                  }`}
                >
                  <span>🔵 {isEn ? 'Compound' : 'Ghép'}</span>
                  <span>({compoundCount})</span>
                </button>
                <button
                  onClick={() => setActiveFilter('simple')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    activeFilter === 'simple'
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'text-amber-800 hover:bg-amber-100/60'
                  }`}
                >
                  <span>🟡 {isEn ? 'Simple' : 'Đơn'}</span>
                  <span>({simpleCount})</span>
                </button>
              </div>
            </div>

            {/* Sentences List */}
            {filteredSentences.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                {isEn ? 'No sentences match the selected filter.' : 'Không tìm thấy câu nào theo bộ lọc đã chọn.'}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredSentences.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3.5 rounded-xl border text-xs transition-all space-y-1.5 ${
                      item.type === 'complex'
                        ? 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50'
                        : item.type === 'compound'
                          ? 'bg-indigo-50/50 border-indigo-200/80 hover:bg-indigo-50'
                          : 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-400 text-[10px]">
                          #{item.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-black text-[10px] uppercase tracking-wide ${
                          item.type === 'complex'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.type === 'compound'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.type === 'complex' ? (isEn ? 'Complex' : 'Câu Phức') : item.type === 'compound' ? (isEn ? 'Compound' : 'Câu Ghép') : (isEn ? 'Simple' : 'Câu Đơn')}
                        </span>
                        {item.isCompoundComplex && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {isEn ? 'Compound-Complex' : 'Phức - Ghép'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {item.wordCount} {isEn ? 'words' : 'từ'}
                        </span>
                      </div>

                      {item.type === 'simple' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                          {isEn ? 'Upgrade advised ⚡' : 'Nên nâng cấp ⚡'}
                        </span>
                      )}
                    </div>

                    <p className="font-serif sm:font-sans text-[13px] text-slate-800 leading-relaxed font-normal">
                      "{item.text}"
                    </p>

                    <div className="text-[11px] text-slate-500 font-medium">
                      💡 {getSentenceExplanation(item.explanation, isEn)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. GOLDEN SENTENCE TEMPLATES TO BOOST GRA */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3>{isEn ? '4 Golden Syntactic Structures for Band 7.5–8.0+ GRA' : 'Cẩm Nang 4 Mẫu Câu Vàng Nâng Bứt Phá Band 7.5 - 8.0+ GRA'}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goldenGraTemplates.map((tmpl, index) => (
                <div 
                  key={index}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {tmpl.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                      {tmpl.band}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-indigo-700">
                    {tmpl.template}
                  </div>

                  <p className="text-[11px] text-slate-600 italic">
                    {isEn ? 'e.g.' : 'VD:'} "{tmpl.example}"
                  </p>

                  <button
                    onClick={() => handleCopyTemplate(tmpl.template, index)}
                    className="w-full py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-indigo-700 font-bold text-[11px] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    {copiedId === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{isEn ? 'Copied!' : 'Đã Sao Chép!'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isEn ? 'Copy Structure' : 'Sao Chép Mẫu Câu'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* MODAL FOOTER                                                */}
        {/* ============================================================ */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isEn ? 'Syntactic parsing algorithm executes 100% offline (Offline-First)' : 'Thuật toán phân tích cú pháp chạy 100% ngoại tuyến (Offline-First)'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng Lại'}
          </button>
        </div>

      </div>
    </div>
  );
}
