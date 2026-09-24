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

export default function SentenceHeatmapModal({
  isOpen,
  onClose,
  analysisData,
  onInsertTemplate
}) {
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

  const GOLDEN_GRA_TEMPLATES = [
    {
      title: 'Mệnh đề nhượng bộ tương phản (Concessive Clause)',
      band: 'Band 7.0+',
      template: 'Although many argue that [Quan điểm A], it is undeniable that [Quan điểm B].',
      example: 'Although many argue that higher education should be free, it is undeniable that funding constraints often compromise teaching quality.'
    },
    {
      title: 'Mệnh đề quan hệ chỉ hệ quả (Relative Clause of Result)',
      band: 'Band 7.5+',
      template: '[Mệnh đề chính], which in turn exerts a detrimental impact on [Đối tượng].',
      example: 'Fossil fuel combustion generates massive carbon emissions, which in turn exerts a detrimental impact on global climate stability.'
    },
    {
      title: 'Đảo ngữ nhấn mạnh (Negative Inversion)',
      band: 'Band 8.0+',
      template: 'Not only does/do [Chủ ngữ] [Động từ nguyên mẫu], but it also [Hành động phụ].',
      example: 'Not only does public transport alleviate urban gridlock, but it also fosters sustainable socioeconomic development.'
    },
    {
      title: 'Mệnh đề phân từ rút gọn (Participial Clause)',
      band: 'Band 8.0+',
      template: 'Given the rapid pace of [Hiện tượng], governments should [Hành động giải pháp].',
      example: 'Given the rapid pace of technological automation, governments should provide comprehensive reskilling programs for the workforce.'
    }
  ];

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
                  Bản Đồ Nhiệt Cấu Trúc Câu (GRA Heatmap)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Cambridge GRA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Kiểm định phổ cấu trúc ngữ pháp thời gian thực: Câu Đơn, Câu Ghép & Câu Phức
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Đóng (Esc)"
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
                  Đánh giá tiêu chí Grammatical Range & Accuracy:
                </span>
                <div className="text-lg sm:text-xl font-black text-white flex items-center space-x-2 mt-0.5">
                  <span>Dự phóng Band:</span>
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
                  Tổng: <strong className="text-white">{totalSentences}</strong> câu
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                  Phức: <strong>{complexCount}</strong> ({complexPercentage}%)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-800/80">
                  Ghép: <strong>{compoundCount}</strong> ({compoundPercentage}%)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  Đơn: <strong>{simpleCount}</strong> ({simplePercentage}%)
                </span>
              </div>
            </div>

            {/* 3-Color Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Tỷ trọng phân bố loại câu trong bài</span>
                <span className="text-emerald-400 font-semibold">Mục tiêu Band 7.0+: Câu phức &ge; 50%, Câu đơn &le; 35%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                {complexPercentage > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                    style={{ width: `${complexPercentage}%` }}
                    title={`Câu Phức: ${complexPercentage}%`}
                  />
                )}
                {compoundPercentage > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-500" 
                    style={{ width: `${compoundPercentage}%` }}
                    title={`Câu Ghép: ${compoundPercentage}%`}
                  />
                )}
                {simplePercentage > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500" 
                    style={{ width: `${simplePercentage}%` }}
                    title={`Câu Đơn: ${simplePercentage}%`}
                  />
                )}
              </div>
              <div className="flex items-center space-x-4 text-[10px] sm:text-[11px] font-bold text-slate-300 pt-0.5">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Câu Phức: {complexPercentage}%</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span>Câu Ghép: {compoundPercentage}%</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Câu Đơn: {simplePercentage}%</span>
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
              {feedbackMessage}
            </div>
          </div>

          {/* 2. INTERACTIVE SENTENCE INSPECTOR */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Chi Tiết Từng Câu Trong Bài Viết ({filteredSentences.length}/{totalSentences})
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
                  Tất cả ({totalSentences})
                </button>
                <button
                  onClick={() => setActiveFilter('complex')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    activeFilter === 'complex'
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : 'text-emerald-700 hover:bg-emerald-100/60'
                  }`}
                >
                  <span>🟢 Phức</span>
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
                  <span>🔵 Ghép</span>
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
                  <span>🟡 Đơn</span>
                  <span>({simpleCount})</span>
                </button>
              </div>
            </div>

            {/* Sentences List */}
            {filteredSentences.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                Không tìm thấy câu nào theo bộ lọc đã chọn.
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
                          {item.type === 'complex' ? 'Câu Phức' : item.type === 'compound' ? 'Câu Ghép' : 'Câu Đơn'}
                        </span>
                        {item.isCompoundComplex && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            Phức - Ghép
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {item.wordCount} từ
                        </span>
                      </div>

                      {item.type === 'simple' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                          Nên nâng cấp ⚡
                        </span>
                      )}
                    </div>

                    <p className="font-serif sm:font-sans text-[13px] text-slate-800 leading-relaxed font-normal">
                      "{item.text}"
                    </p>

                    <div className="text-[11px] text-slate-500 font-medium">
                      💡 {item.explanation}
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
              <h3>Cẩm Nang 4 Mẫu Câu Vàng Nâng Bứt Phá Band 7.5 - 8.0+ GRA</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOLDEN_GRA_TEMPLATES.map((tmpl, index) => (
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
                    VD: "{tmpl.example}"
                  </p>

                  <button
                    onClick={() => handleCopyTemplate(tmpl.template, index)}
                    className="w-full py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-indigo-700 font-bold text-[11px] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    {copiedId === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã Sao Chép!</span>
                      </>
                    ) : (
                      <>
                        <span>Sao Chép Mẫu Câu</span>
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
            <span>Thuật toán phân tích cú pháp chạy 100% ngoại tuyến (Offline-First)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng Lại
          </button>
        </div>

      </div>
    </div>
  );
}
