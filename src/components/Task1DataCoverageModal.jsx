import React from 'react';
import { 
  X, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Info,
  Copy,
  Plus
} from 'lucide-react';
import { 
  analyzeTask1Overview, 
  analyzeTask1DataDensity, 
  analyzeTask1Comparisons 
} from '../services/algorithmicEvaluationService';

export default function Task1DataCoverageModal({ 
  isOpen, 
  onClose, 
  paragraphs = [], 
  onInsertOverview 
}) {
  if (!isOpen) return null;

  const rawParas = paragraphs.map(p => p.text || p).filter(Boolean);
  const overviewCheck = analyzeTask1Overview(rawParas);
  const dataCheck = analyzeTask1DataDensity(rawParas, overviewCheck.overviewIndex);
  const compCheck = analyzeTask1Comparisons(rawParas, overviewCheck.overviewIndex);

  const sampleOverviewSentence = 'Overall, it is clear that while [Hạng mục A] experienced an upward trend over the period, the reverse was true for [Hạng mục B]. Additionally, [Hạng mục C] consistently remained the highest figure throughout.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Kiểm Tra Data Coverage & Overview</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Task 1 Cambridge
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Tiêu chuẩn giám khảo: Overview khái quát + Số liệu chứng minh thân bài + Ngôn ngữ so sánh
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Overview Card */}
            <div className={`p-3.5 rounded-xl border ${
              !overviewCheck.hasOverview 
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : overviewCheck.hasRawData
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Đoạn Overview</span>
                {!overviewCheck.hasOverview ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : overviewCheck.hasRawData ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="text-base font-black">
                {!overviewCheck.hasOverview ? 'Chưa Có' : overviewCheck.hasRawData ? 'Dính Số Liệu' : 'Đạt Chuẩn ✓'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {!overviewCheck.hasOverview 
                  ? 'Bị trần Band 5.0 TA' 
                  : overviewCheck.hasRawData 
                    ? 'Bị trần Band 5.5 TA' 
                    : 'Không dính số liệu thô'}
              </div>
            </div>

            {/* Data Density Card */}
            <div className={`p-3.5 rounded-xl border ${
              dataCheck.hasAdequateData 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Số Liệu Thân Bài</span>
                {dataCheck.hasAdequateData ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="text-base font-black">
                {dataCheck.bodyDataCount} điểm số liệu
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {dataCheck.hasAdequateData ? 'Đủ chứng minh (>= 3)' : 'Cần bổ sung số liệu'}
              </div>
            </div>

            {/* Comparative Structures Card */}
            <div className={`p-3.5 rounded-xl border ${
              compCheck.totalComparisons >= 2 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Ngôn Ngữ So Sánh</span>
                {compCheck.totalComparisons >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="text-base font-black">
                {compCheck.totalComparisons} cấu trúc
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {compCheck.totalComparisons >= 2 ? 'So sánh phong phú' : 'Dễ dính bẫy liệt kê'}
              </div>
            </div>
          </div>

          {/* Section 1: Overview Diagnosis */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  1. Chẩn Đoán Đoạn Tổng Quan (Overview Paragraph)
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                !overviewCheck.hasOverview 
                  ? 'bg-rose-100 text-rose-800' 
                  : overviewCheck.hasRawData 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
              }`}>
                {!overviewCheck.hasOverview ? 'Báo Động Đỏ' : overviewCheck.hasRawData ? 'Cần Khắc Phục' : 'Rất Tốt'}
              </span>
            </div>

            {overviewCheck.hasOverview ? (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 italic border-l-4 border-l-indigo-500">
                  "{overviewCheck.overviewText}"
                </div>
                {overviewCheck.hasRawData ? (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                    <p className="font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Phát hiện số liệu chi tiết trong Overview: ({overviewCheck.rawDataList.join(', ')})</span>
                    </p>
                    <p className="text-[11px] text-amber-700">
                      Barem Cambridge quy định Overview chỉ được khái quát xu hướng lớn (tăng/giảm, biến động, hạng mục cao nhất). Đưa số liệu chi tiết vào đây khiến điểm Task Achievement bị khống chế tối đa <strong>Band 5.5</strong>. Hãy chuyển các con số này xuống thân bài!
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">
                    ✅ Rất tốt! Đoạn Overview khái quát xu hướng rõ ràng và không bị sa đà vào các con số chi tiết.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
                  <p className="font-bold flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Bài viết chưa có đoạn Overview rõ ràng!</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Theo Barem khảo thí chính thức của Cambridge IELTS Band Descriptors, bài viết Task 1 hoàn toàn thiếu Overview rõ ràng sẽ bị <strong>khống chế tối đa Band 5.0 Task Achievement</strong> (Presents, but inadequately covers, key features; there may be no overview granted).
                  </p>
                </div>

                {onInsertOverview && (
                  <button
                    onClick={() => onInsertOverview(sampleOverviewSentence)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chèn Câu Overview Khung Mẫu Vào Bài</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Data Points in Body */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  2. Độ Phủ Số Liệu Trong Thân Bài (Data Evidence)
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                dataCheck.hasAdequateData ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {dataCheck.bodyDataCount} Điểm Dữ Liệu
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Cambridge yêu cầu: <em>"Presents key features with clearly supported data"</em>. Các đoạn thân bài (Body 1 & Body 2) phải trích xuất các con số tiêu biểu từ biểu đồ (số lượng, tỷ lệ %, năm, đơn vị đo) để làm bằng chứng cho từng luận điểm.
            </p>

            {!dataCheck.hasAdequateData && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                ⚠️ Hiện thân bài mới có <strong>{dataCheck.bodyDataCount}</strong> điểm số liệu (khuyến nghị tối thiểu: 3-5 số liệu chính) để đạt Band 7.0+ Task Achievement.
              </div>
            )}
          </div>

          {/* Section 3: Comparative Language */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  3. Ngôn Ngữ So Sánh & Tránh Bẫy Liệt Kê (Comparisons)
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                compCheck.totalComparisons >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {compCheck.totalComparisons} Cụm So Sánh
              </span>
            </div>

            {compCheck.foundPatterns && compCheck.foundPatterns.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600">Các mẫu câu so sánh đã phát hiện:</span>
                <div className="flex flex-wrap gap-1.5">
                  {compCheck.foundPatterns.map((pat, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-700"
                    >
                      ✓ {pat}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                <p className="font-bold">⚠️ Chưa phát hiện liên từ hoặc cấu trúc so sánh rõ rệt</p>
                <p className="text-[11px] text-amber-700">
                  Hãy sử dụng các cấu trúc: <code>higher than</code>, <code>twice as much as</code>, <code>whereas</code>, <code>in contrast to</code>, <code>the highest figure</code> để tránh bẫy liệt kê máy móc (Mechanical Data Listing).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
            <Info className="w-3.5 h-3.5" />
            <span>Phân tích cập nhật tức thì theo nội dung bài viết</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng Kiểm Tra
          </button>
        </div>
      </div>
    </div>
  );
}
