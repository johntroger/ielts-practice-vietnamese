import React, { useState, useMemo } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Volume2, 
  ExternalLink, 
  X, 
  BarChart3, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Printer,
  ChevronRight,
  Headphones,
  FileText,
  ShieldCheck,
  Zap,
  Info,
  Compass,
  Target,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Lightbulb,
  CheckCheck
} from 'lucide-react';
import { generateListeningDiagnosticEvaluation } from '../../services/geminiService';

export default function ListeningResultModal({
  isOpen,
  onClose,
  bandResult,
  testTitle = 'Cambridge Practice Test 18',
  apiKey,
  model = 'gemini-2.5-flash',
  onResetExam,
  onJumpToQuestion,
  onSeekAudio
}) {
  if (!isOpen || !bandResult) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'parts' | 'questions' | 'types' | 'ai_review'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'correct' | 'wrong' | 'plural' | 'spelling'

  // AI Diagnostic & Practice Roadmap State
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleFetchAiEvaluation = async () => {
    if (!apiKey) {
      setAiError('Vui lòng cấu hình Gemini API Key tại phần Cài đặt góc trên để kích hoạt Giám khảo AI.');
      return;
    }
    setIsGeneratingAi(true);
    setAiError('');
    try {
      const res = await generateListeningDiagnosticEvaluation({
        bandResult,
        testTitle,
        apiKey,
        model
      });
      setAiEvaluation(res);
    } catch (err) {
      console.error('Lỗi khi AI phân tích kết quả:', err);
      setAiError(err.message || 'Không thể kết nối đến Gemini AI. Vui lòng kiểm tra lại kết nối và thử lại.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const {
    correctCount,
    totalQuestions,
    band,
    accuracyPercent,
    timeSpentSeconds = 0,
    errorBreakdown = {},
    partStats = [],
    typeStats = [],
    questionsBreakdown = []
  } = bandResult;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = Math.floor(secs % 60);
    return mins + " phút " + (remainderSecs < 10 ? '0' : '') + remainderSecs + " giây";
  };

  const formatTimestamp = (sec) => {
    if (typeof sec !== 'number') return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  };

  const filteredQuestions = useMemo(() => {
    if (filterType === 'correct') return questionsBreakdown.filter(q => q.isCorrect);
    if (filterType === 'wrong') return questionsBreakdown.filter(q => !q.isCorrect);
    if (filterType === 'plural') return questionsBreakdown.filter(q => q.status === 'PLURAL_ERROR');
    if (filterType === 'spelling') return questionsBreakdown.filter(q => q.status === 'SPELLING_ERROR');
    return questionsBreakdown;
  }, [questionsBreakdown, filterType]);

  const getBandBadge = (score) => {
    if (score >= 8.0) return { bg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-300', level: 'Xuất sắc (Very Good / Expert User)' };
    if (score >= 7.0) return { bg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-300', level: 'Tốt (Good User - Chuẩn du học / định cư)' };
    if (score >= 6.0) return { bg: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-300', level: 'Khá (Competent User)' };
    return { bg: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-300', level: 'Cần củng cố thêm (Modest User)' };
  };

  const badgeInfo = getBandBadge(band);

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'note_completion': return 'Form / Note Completion';
      case 'form_completion': return 'Form Completion';
      case 'table_completion': return 'Table Completion';
      case 'flow_chart': return 'Flow-chart Completion';
      case 'summary_completion': return 'Summary Completion';
      case 'sentence_completion': return 'Sentence Completion';
      case 'multiple_choice': return 'Multiple Choice';
      case 'pick_multiple': return 'Pick Multiple (A-E)';
      case 'matching': return 'Matching Information';
      case 'map_labelling': return 'Map / Diagram Labelling';
      case 'short_answer': return 'Short Answer';
      default: return type;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Báo Cáo Điểm Khảo Thí</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300">{testTitle}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                IELTS Listening Test Report
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Đóng bảng kết quả"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-5 sm:px-8 border-b border-slate-200 bg-slate-50/80 shrink-0 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={"py-3 px-3.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer " + (activeTab === 'overview' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-600 hover:text-slate-900')}
          >
            Tổng Quan Band Score
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={"py-3 px-3.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer " + (activeTab === 'parts' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-600 hover:text-slate-900')}
          >
            Phân Tích 4 Parts
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className={"py-3 px-3.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer " + (activeTab === 'types' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-600 hover:text-slate-900')}
          >
            Hiệu Suất Dạng Bài
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={"py-3 px-3.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer " + (activeTab === 'questions' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-600 hover:text-slate-900')}
          >
            Chi Tiết & Audio Bằng Chứng (40 Câu)
          </button>
          <button
            onClick={() => {
              setActiveTab('ai_review');
              if (!aiEvaluation && !isGeneratingAi && apiKey) {
                handleFetchAiEvaluation();
              }
            }}
            className={"py-3 px-3.5 border-b-2 font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer " + (activeTab === 'ai_review' ? 'border-purple-600 text-purple-700' : 'border-transparent text-purple-600 hover:text-purple-800')}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Nhận Xét & Lộ Trình Luyện Tập</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">NEW</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Band Score Hero Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Estimated Band Score
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 my-2">
                    {band.toFixed(1)}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mt-1">
                    {badgeInfo.level}
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-emerald-800">
                      <span className="text-xs font-bold">Số Câu Trả Lời Đúng</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-2">
                      {correctCount} <span className="text-sm font-semibold text-emerald-700">/ {totalQuestions}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                      Đạt tỷ lệ chính xác {accuracyPercent}%
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-indigo-800">
                      <span className="text-xs font-bold">Thời Lượng Làm Bài</span>
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-indigo-900 mt-2">
                      {formatTime(timeSpentSeconds || 1920)}
                    </div>
                    <div className="text-[11px] text-indigo-700 mt-1 font-medium">
                      Audio 30:00 + 2:00 kiểm tra lại bài
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-amber-800">
                      <span className="text-xs font-bold">Lỗi Âm Đuôi & Bẫy Đề</span>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-900 mt-2">
                      {(errorBreakdown.PLURAL_ERROR || 0) + (errorBreakdown.STEM_REPETITION_ERROR || 0)} <span className="text-xs font-normal">câu</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-1 font-medium">
                      Lỗi số nhiều -s ({errorBreakdown.PLURAL_ERROR || 0}), Lặp từ ({errorBreakdown.STEM_REPETITION_ERROR || 0})
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-rose-800">
                      <span className="text-xs font-bold">Lỗi Chính Tả (Spelling)</span>
                      <XCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-2xl font-black text-rose-900 mt-2">
                      {errorBreakdown.SPELLING_ERROR || 0} <span className="text-xs font-normal">câu</span>
                    </div>
                    <div className="text-[11px] text-rose-700 mt-1 font-medium">
                      Sai lệch 1-2 ký tự so với đáp án gốc
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Layer Diagnostic System Highlights */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Chẩn Đoán 4 Tầng Lỗi Sai Khảo Thí (Diagnostic Breakdown)</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">Chuẩn Cambridge Official</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-center">
                    <div className="text-lg font-black text-emerald-800">{errorBreakdown.CORRECT || 0}</div>
                    <div className="text-[11px] font-semibold text-emerald-700">Đúng Tuyệt Đối</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-center">
                    <div className="text-lg font-black text-amber-800">{errorBreakdown.PLURAL_ERROR || 0}</div>
                    <div className="text-[11px] font-semibold text-amber-700">Lỗi Âm Đuôi (-s)</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-100/70 border border-purple-300 text-center">
                    <div className="text-lg font-black text-purple-800">{errorBreakdown.STEM_REPETITION_ERROR || 0}</div>
                    <div className="text-[11px] font-semibold text-purple-700">Bẫy Lặp Từ Đề</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-100/70 border border-rose-300 text-center">
                    <div className="text-lg font-black text-rose-800">{errorBreakdown.SPELLING_ERROR || 0}</div>
                    <div className="text-[11px] font-semibold text-rose-700">Sai Chính Tả</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-red-100/70 border border-red-300 text-center">
                    <div className="text-lg font-black text-red-800">{errorBreakdown.WRONG_ANSWER || 0}</div>
                    <div className="text-[11px] font-semibold text-red-700">Sai Thông Tin</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-200/70 border border-slate-300 text-center">
                    <div className="text-lg font-black text-slate-800">{errorBreakdown.UNANSWERED || 0}</div>
                    <div className="text-[11px] font-semibold text-slate-600">Chưa Điền</div>
                  </div>
                </div>
              </div>

              {/* Part 1-4 Mini Bars */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-red-600" />
                  <span>Tiến Độ Đúng Từng Part</span>
                </h3>

                <div className="space-y-3">
                  {partStats.map(p => (
                    <div key={p.partNumber} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800">Part {p.partNumber}: {p.title}</span>
                        <span className="text-slate-600 font-mono">{p.correct} / {p.total} câu ({p.percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
                          style={{ width: p.percent + '%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Coaching Action Banner in Overview */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                      IELTS Listening Master Coach
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Nhận Phân Tích Chuyên Sâu & Lộ Trình Nâng Band Cùng AI
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    AI sẽ phân tích nguyên nhân các bẫy đề bạn gặp phải, chỉ ra bài tập bổ trợ chính xác và xây dựng lộ trình luyện tập 3 giai đoạn để bứt phá lên Band cao hơn.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ai_review');
                    if (!aiEvaluation && !isGeneratingAi && apiKey) {
                      handleFetchAiEvaluation();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Xem Nhận Xét & Lộ Trình AI</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PARTS BREAKDOWN */}
          {activeTab === 'parts' && (
            <div className="space-y-4">
              {partStats.map(p => {
                const partQuestions = questionsBreakdown.filter(q => q.partNumber === p.partNumber);

                return (
                  <div key={p.partNumber} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider">
                          Part {p.partNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{p.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900">{p.correct} / {p.total}</div>
                        <div className="text-xs text-emerald-600 font-semibold">{p.percent}% chính xác</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {partQuestions.map(q => (
                        <div
                          key={q.order}
                          className={"p-2 rounded-xl border flex items-center justify-between text-xs " + (q.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900')}
                        >
                          <span className="font-bold">#{q.order}</span>
                          <span className="truncate max-w-[80px] font-mono text-[11px]">{q.userAnswer || '(Trống)'}</span>
                          {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: QUESTION TYPES */}
          {activeTab === 'types' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                Thống kê giúp bạn xác định dạng bài sở trường và dạng bài cần luyện thêm nhiều hơn trong <strong>Phòng Luyện Bổ Trợ (Micro-Drills)</strong>.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {typeStats.map(ts => (
                  <div key={ts.type} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">{getQuestionTypeLabel(ts.type)}</span>
                      <span className="font-bold text-xs text-slate-600">{ts.correct}/{ts.total} ({ts.accuracy}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={"h-full rounded-full " + (ts.accuracy >= 80 ? 'bg-emerald-500' : ts.accuracy >= 60 ? 'bg-indigo-500' : 'bg-rose-500')}
                        style={{ width: ts.accuracy + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUESTIONS DETAIL WITH AUDIO EVIDENCE */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={"px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer " + (filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                >
                  Tất cả (40)
                </button>
                <button
                  onClick={() => setFilterType('correct')}
                  className={"px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer " + (filterType === 'correct' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100')}
                >
                  ✓ Đúng ({errorBreakdown.CORRECT || 0})
                </button>
                <button
                  onClick={() => setFilterType('wrong')}
                  className={"px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer " + (filterType === 'wrong' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100')}
                >
                  ✗ Sai ({totalQuestions - (errorBreakdown.CORRECT || 0)})
                </button>
                <button
                  onClick={() => setFilterType('plural')}
                  className={"px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer " + (filterType === 'plural' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100')}
                >
                  ⚠️ Lỗi âm đuôi -s ({errorBreakdown.PLURAL_ERROR || 0})
                </button>
                <button
                  onClick={() => setFilterType('spelling')}
                  className={"px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer " + (filterType === 'spelling' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800 hover:bg-purple-100')}
                >
                  ✍️ Sai chính tả ({errorBreakdown.SPELLING_ERROR || 0})
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.map(q => (
                  <div
                    key={q.order}
                    className={"p-4 rounded-xl border space-y-2 transition-all " + (q.isCorrect ? 'bg-white border-slate-200 hover:border-emerald-300' : 'bg-rose-50/40 border-rose-200')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold font-mono text-xs flex items-center justify-center">
                          {q.order}
                        </span>
                        <span className={"px-2 py-0.5 rounded-md text-[11px] font-bold border " + q.badgeColor}>
                          {q.badgeLabel}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">Part {q.partNumber}</span>
                      </div>

                      {/* Action buttons: Jump to question on exam & Listen Audio */}
                      <div className="flex items-center space-x-1.5">
                        {q.evidenceTimestamp !== undefined && onSeekAudio && (
                          <button
                            onClick={() => onSeekAudio(q.evidenceTimestamp)}
                            className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                            title="Nghe đúng đoạn audio chứa đáp án"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Nghe lại ({formatTimestamp(q.evidenceTimestamp)})</span>
                          </button>
                        )}
                        {onJumpToQuestion && (
                          <button
                            onClick={() => {
                              onClose();
                              onJumpToQuestion(q.order);
                            }}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                            title="Đến vị trí câu này trong đề"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      {q.questionTitle}
                    </div>

                    {/* Answer comparison */}
                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 font-medium">Bạn chọn: </span>
                        <span className={"font-bold " + (q.isCorrect ? 'text-emerald-700' : 'text-rose-700')}>
                          {q.userAnswer || '(Để trống)'}
                        </span>
                      </div>
                      <div className="text-slate-300">|</div>
                      <div>
                        <span className="text-slate-500 font-medium">Đáp án chuẩn: </span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">
                          {q.correctAnswer}
                        </span>
                        {q.acceptableAnswers && q.acceptableAnswers.length > 1 && (
                          <span className="text-[11px] text-slate-400 ml-1">
                            (Chấp nhận: {q.acceptableAnswers.join(', ')})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Diagnostic message */}
                    {q.diagnosticMessage && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                        {q.diagnosticMessage}
                      </div>
                    )}

                    {/* Audio quote */}
                    {q.evidenceQuote && (
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-500">Trích dẫn audio: </span>
                        <span className="italic font-serif text-slate-800">"{q.evidenceQuote}"</span>
                      </div>
                    )}

                    {/* Vietnamese explanation */}
                    {q.explanation && (
                      <div className="text-xs text-slate-500">
                        <span className="font-bold">Giải thích: </span>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI REVIEW & ACTIONABLE PRACTICE ROADMAP */}
          {activeTab === 'ai_review' && (
            <div className="space-y-6">
              
              {/* Header Box with Trigger Button */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-white border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span>Đánh Giá Giám Khảo & Lộ Trình Luyện Tập Cá Nhân Hóa</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                        Band {band.toFixed(1)} Focus
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                      Hệ thống kết hợp dữ liệu 40 câu hỏi, thời gian nghe và 4 tầng lỗi sai để đưa ra chẩn đoán nguyên nhân gốc rễ (phát âm nối âm, bẫy distractors, hay thiếu vốn từ học thuật) và các bài tập khắc phục tức thì.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFetchAiEvaluation}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'AI Đang Phân Tích...' : aiEvaluation ? 'Phân Tích Lại' : 'Bắt Đầu Nhận Xét AI'}</span>
                </button>
              </div>

              {/* Error Notification */}
              {aiError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{aiError}</div>
                </div>
              )}

              {/* Loading State */}
              {isGeneratingAi && (
                <div className="p-12 text-center space-y-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                  <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Giám khảo AI đang đối chiếu bài làm với chuẩn Cambridge...</h4>
                    <p className="text-xs text-slate-500 mt-1">Đang phân tích các tầng lỗi phát âm nối âm, bẫy tự sửa và thiết kế bài tập bổ trợ (khoảng 3-5 giây)...</p>
                  </div>
                </div>
              )}

              {/* Empty state before trigger */}
              {!isGeneratingAi && !aiEvaluation && !aiError && (
                <div className="p-12 text-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/20 space-y-3">
                  <Lightbulb className="w-10 h-10 text-purple-400 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">Chưa có dữ liệu nhận xét AI cho bài thi này</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Bấm nút <strong>"Bắt Đầu Nhận Xét AI"</strong> ở trên để Gemini tổng hợp hiệu suất làm bài và đưa ra kế hoạch cải thiện điểm số chi tiết.
                  </p>
                  <button
                    type="button"
                    onClick={handleFetchAiEvaluation}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Bắt Đầu Phân Tích Ngay
                  </button>
                </div>
              )}

              {/* AI Evaluation Content */}
              {!isGeneratingAi && aiEvaluation && (
                <div className="space-y-5 animate-in fade-in">
                  
                  {/* 1. Overall Summary Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <h4 className="font-bold text-slate-900 text-sm">Đánh Giá Tổng Quan Năng Lực Phản Xạ Âm Thanh</h4>
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                      {aiEvaluation.overallSummary}
                    </div>
                  </div>

                  {/* 2. Strengths & Critical Weaknesses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Strengths */}
                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCheck className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">Điểm Mạnh Nổi Bật</h4>
                      </div>
                      <ul className="space-y-2">
                        {aiEvaluation.strengths && aiEvaluation.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-emerald-900 flex items-start space-x-2 leading-relaxed">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Critical Weaknesses */}
                    <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-rose-700" />
                        <h4 className="font-bold text-rose-950 text-xs sm:text-sm">Lỗ Hổng Cốt Lõi Cần Khắc Phục</h4>
                      </div>
                      <div className="space-y-2.5">
                        {aiEvaluation.criticalWeaknesses && aiEvaluation.criticalWeaknesses.map((w, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white border border-rose-200 text-xs space-y-1">
                            <div className="font-bold text-rose-900">{w.issue}</div>
                            {w.example && (
                              <div className="text-[11px] text-slate-600 italic">
                                Ví dụ bài làm: "{w.example}"
                              </div>
                            )}
                            {w.solution && (
                              <div className="text-[11px] text-slate-800 font-semibold">
                                👉 Giải pháp: {w.solution}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* 3. Actionable 3-Phase Practice Roadmap */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Compass className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-black text-sm sm:text-base text-white">
                          Lộ Trình Luyện Tập 3 Giai Đoạn Nâng Band (Actionable Practice Roadmap)
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                        Chiến Lược Tối Ưu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      
                      {/* Phase 1 */}
                      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
                          <span>Giai đoạn 1 (48 Giờ Đầu)</span>
                        </div>
                        <div className="text-xs font-bold text-white">Khắc Phục Thói Quen Lỗi</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {aiEvaluation.actionablePracticePlan?.phase1_ImmediateFix}
                        </p>
                      </div>

                      {/* Phase 2 */}
                      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider">
                          <span>Giai đoạn 2 (2–3 Tuần)</span>
                        </div>
                        <div className="text-xs font-bold text-white">Xây Dựng Phản Xạ Nghe Sâu</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {aiEvaluation.actionablePracticePlan?.phase2_SkillBuilding}
                        </p>
                      </div>

                      {/* Phase 3 */}
                      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <div className="flex items-center space-x-1.5 text-purple-400 text-xs font-black uppercase tracking-wider">
                          <span>Giai đoạn 3 (Bứt Phá Band)</span>
                        </div>
                        <div className="text-xs font-bold text-white">Làm Chủ Đề Thi Cambridge</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {aiEvaluation.actionablePracticePlan?.phase3_ExamMastery}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* 4. Recommended Drills (Bài tập bổ trợ thiết thực) */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <h4 className="font-bold text-slate-900 text-sm">Bài Tập Bổ Trợ Khuyên Dùng Ngay Hôm Nay</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiEvaluation.recommendedDrills && aiEvaluation.recommendedDrills.map((drill, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                            <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span>{drill.drillName}</span>
                          </div>
                          {drill.purpose && (
                            <p className="text-[11px] text-purple-800 font-medium">
                              🎯 <strong>Mục đích:</strong> {drill.purpose}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            📝 <strong>Cách thực hiện:</strong> {drill.stepByStep}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Motivational Advice Footer Banner */}
                  {aiEvaluation.motivationalAdvice && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100 border border-purple-200 text-purple-950 text-xs flex items-center space-x-3">
                      <Award className="w-5 h-5 text-purple-700 shrink-0" />
                      <div className="leading-relaxed italic font-medium">
                        "{aiEvaluation.motivationalAdvice}"
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>In / Xuất Báo Cáo</span>
            </button>

            {onResetExam && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn làm lại đề này từ đầu không?')) {
                    onResetExam();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Làm Lại Đề Này</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Xem Lại Đề Bài & Lời Thoại (Review View)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
