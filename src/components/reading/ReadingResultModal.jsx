import React, { useState, useMemo } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  ExternalLink, 
  X, 
  BarChart3, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ReadingResultModal({
  isOpen,
  onClose,
  bandResult,
  testTitle = 'Cambridge Practice Test 01',
  onResetExam,
  onJumpToQuestion,
  onSelectPassage
}) {
  if (!isOpen || !bandResult) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'passages' | 'questions' | 'types'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'correct' | 'wrong'

  const {
    correctCount,
    totalQuestions,
    band,
    accuracyPercent,
    timeSpentSeconds,
    passageStats = [],
    questionsBreakdown = []
  } = bandResult;

  // Format time spent (MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins} phút ${remainderSecs < 10 ? '0' : ''}${remainderSecs} giây`;
  };

  // Group performance by question type
  const typeStats = useMemo(() => {
    const map = {};
    questionsBreakdown.forEach(q => {
      const type = q.questionType || 'Khác';
      if (!map[type]) {
        map[type] = { type, total: 0, correct: 0 };
      }
      map[type].total++;
      if (q.isCorrect) map[type].correct++;
    });
    return Object.values(map).map(item => ({
      ...item,
      accuracy: Math.round((item.correct / item.total) * 100)
    }));
  }, [questionsBreakdown]);

  // Filtered questions list
  const filteredQuestions = useMemo(() => {
    if (filterType === 'correct') return questionsBreakdown.filter(q => q.isCorrect);
    if (filterType === 'wrong') return questionsBreakdown.filter(q => !q.isCorrect);
    return questionsBreakdown;
  }, [questionsBreakdown, filterType]);

  // Band Score color & evaluation badge
  const getBandBadge = (score) => {
    if (score >= 8.0) return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-300', level: 'Xuất sắc (Expert User)' };
    if (score >= 7.0) return { bg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-300', level: 'Tốt (Good User)' };
    if (score >= 6.0) return { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-300', level: 'Khá (Competent User)' };
    return { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-300', level: 'Cần nỗ lực hơn (Modest)' };
  };

  const badgeInfo = getBandBadge(band);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Kết Quả Bài Thi Thử</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300">{testTitle}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                Báo Cáo Tổng Kết Điểm IELTS Reading
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Đóng bảng kết quả"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 sm:px-8 flex items-center space-x-2 sm:space-x-4 overflow-x-auto shrink-0 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tổng Quan & Band Score</span>
          </button>

          <button
            onClick={() => setActiveTab('passages')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'passages'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hiệu Suất 3 Passages</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'questions'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ma Trận 40 Câu Hỏi ({correctCount}/{totalQuestions})</span>
          </button>

          <button
            onClick={() => setActiveTab('types')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'types'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phân Tích Dạng Câu Hỏi</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Score Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Band Score Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">IELTS Reading Band</span>
                  <div className="flex items-baseline space-x-1 my-2">
                    <span className="text-5xl sm:text-6xl font-black text-slate-900">{band.toFixed(1)}</span>
                    <span className="text-sm font-bold text-slate-400">/ 9.0</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeInfo.bg} text-white`}>
                    {badgeInfo.level}
                  </span>
                </div>

                {/* Raw Score & Accuracy */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-center space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Số câu trả lời đúng:</span>
                    <span className="text-lg font-black text-slate-900">{correctCount} / {totalQuestions}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${accuracyPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Độ chính xác: <strong className="text-slate-800 font-bold">{accuracyPercent}%</strong></span>
                    <span>Số câu sai / bỏ: <strong className="text-rose-600 font-bold">{totalQuestions - correctCount}</strong></span>
                  </div>
                </div>

                {/* Time Spent */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-center space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Thời gian làm bài:</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">
                    {formatTime(timeSpentSeconds)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Tốc độ trung bình: <strong className="text-slate-800 font-bold">{Math.round((timeSpentSeconds / 40))}s / câu</strong>
                  </div>
                </div>
              </div>

              {/* Passage Quick Breakdown Cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Kết Quả Theo Từng Passage</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {passageStats.map(stat => (
                    <div 
                      key={stat.passageNumber}
                      className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-blue-800 uppercase">Passage {stat.passageNumber}</span>
                        <span className="text-xs font-bold text-slate-600">{stat.correct}/{stat.total} câu</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            stat.accuracy >= 75 ? 'bg-emerald-500' : stat.accuracy >= 50 ? 'bg-blue-600' : 'bg-rose-500'
                          }`}
                          style={{ width: `${stat.accuracy}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Chính xác: <strong>{stat.accuracy}%</strong></span>
                        <button
                          onClick={() => {
                            if (onSelectPassage) onSelectPassage(stat.passageNumber);
                            onClose();
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-0.5"
                        >
                          <span>Xem lại</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-950">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-blue-900">Chiến Lược Nâng Band Sau Bài Thi:</p>
                  <p className="text-blue-800 leading-relaxed">
                    Bấm vào nút <strong>"Xem Lại Bài Thi & Giải Thích"</strong> bên dưới để xem chi tiết vị trí câu bằng chứng (Evidence Locator) và bản dịch phân tích bẫy đề thi cho từng câu sai. Bạn cũng có thể xem giải thích câu hỏi ngay trên màn hình chia đôi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASSAGES BREAKDOWN */}
          {activeTab === 'passages' && (
            <div className="space-y-4">
              {passageStats.map(stat => {
                const passageQuestions = questionsBreakdown.filter(q => q.passageNumber === stat.passageNumber);
                return (
                  <div key={stat.passageNumber} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Passage {stat.passageNumber}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Số lượng: {stat.total} câu hỏi</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          {stat.correct}/{stat.total} đúng ({stat.accuracy}%)
                        </span>
                        <button
                          onClick={() => {
                            if (onSelectPassage) onSelectPassage(stat.passageNumber);
                            onClose();
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                        >
                          <span>Mở bài đọc</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Mini Grid for this passage */}
                    <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-2">
                      {passageQuestions.map(q => (
                        <button
                          key={q.order}
                          onClick={() => {
                            if (onSelectPassage) onSelectPassage(stat.passageNumber);
                            if (onJumpToQuestion) onJumpToQuestion(q.order);
                            onClose();
                          }}
                          className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-all hover:scale-105 ${
                            q.isCorrect
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                          }`}
                          title={`Câu ${q.order}: ${q.isCorrect ? 'Đúng' : 'Sai'}. Nhấp để xem lại`}
                        >
                          <span>{q.order}</span>
                          <span className="text-[10px] mt-0.5">
                            {q.isCorrect ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: 40 QUESTIONS MATRIX */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Filter Buttons */}
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterType === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  Tất cả (40)
                </button>
                <button
                  onClick={() => setFilterType('correct')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterType === 'correct' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                  }`}
                >
                  Đúng ({correctCount})
                </button>
                <button
                  onClick={() => setFilterType('wrong')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterType === 'wrong' ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                  }`}
                >
                  Sai / Bỏ qua ({totalQuestions - correctCount})
                </button>
              </div>

              {/* Detailed Questions List */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredQuestions.map(q => (
                  <div
                    key={q.order}
                    className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                      q.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black ${
                        q.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {q.order}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 line-clamp-2">
                          {q.questionText}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-slate-500">Đoạn văn: <strong>Passage {q.passageNumber} (Đoạn {q.evidenceParagraph || 'N/A'})</strong></span>
                          <span className="text-slate-400">•</span>
                          <span>Bạn chọn: <strong className={q.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{q.userAnswer ? String(q.userAnswer) : '(Chưa điền)'}</strong></span>
                          <span className="text-slate-400">•</span>
                          <span>Đáp án chuẩn: <strong className="text-emerald-700 font-bold">{String(q.correctAnswer)}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectPassage) onSelectPassage(q.passageNumber);
                        if (onJumpToQuestion) onJumpToQuestion(q.order);
                        onClose();
                      }}
                      className="self-end sm:self-center shrink-0 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-800 font-bold border border-slate-200 shadow-2xs flex items-center gap-1 transition-colors"
                    >
                      <span>Xem câu hỏi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUESTION TYPES BREAKDOWN */}
          {activeTab === 'types' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Thống kê tỷ lệ chính xác theo từng dạng bài IELTS Reading giúp nhận diện dạng bài bạn đang làm tốt hoặc cần rèn luyện thêm:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {typeStats.map(item => (
                  <div key={item.type} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-xs capitalize">{item.type.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-black text-slate-700">{item.correct} / {item.total} câu</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.accuracy >= 80 ? 'bg-emerald-500' : item.accuracy >= 50 ? 'bg-blue-600' : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Tỷ lệ làm đúng:</span>
                      <strong className={item.accuracy >= 80 ? 'text-emerald-600' : item.accuracy >= 50 ? 'text-blue-600' : 'text-rose-600'}>
                        {item.accuracy}%
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              if (onResetExam) onResetExam();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại đề thi</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-102"
            >
              <span>Xem lại bài thi & Giải thích</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
