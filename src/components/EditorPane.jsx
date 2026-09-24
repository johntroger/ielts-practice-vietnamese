import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  SpellCheck, 
  Gauge, 
  Sparkles, 
  FileText, 
  Layers, 
  Save, 
  BarChart2, 
  ChevronDown,
  Info,
  Bookmark,
  ArrowRight,
  Plus,
  Check,
  RotateCcw,
  ListOrdered
} from 'lucide-react';
import { analyzeParagraphs, analyzeLexicalDiversity, calculateWpm } from '../utils/textAnalytics';
import Task1DataCoverageModal from './Task1DataCoverageModal';
import { analyzeTask1Overview } from '../services/algorithmicEvaluationService';

export default function EditorPane({
  essayText,
  setEssayText,
  outlineText,
  setOutlineText,
  task,
  mode,
  timeElapsed,
  lastSaved,
  onOpenParaphrase,
  onOpenSlideOver,
  onSubmitEssay
}) {
  const [spellcheckEnabled, setSpellcheckEnabled] = useState(mode === 'practice');
  const [activeTab, setActiveTab] = useState('essay'); // 'essay' | 'outline'
  const [showParagraphDetails, setShowParagraphDetails] = useState(false);
  const [outlineMode, setOutlineMode] = useState('scaffold'); // 'scaffold' | 'raw'
  const isTask1 = task?.taskNumber === 1 || task?.isTask1;
  const [isTask1CoverageOpen, setIsTask1CoverageOpen] = useState(false);
  const [scaffold, setScaffold] = useState({
    intro: '',
    overviewOrThesis: '',
    body1: '',
    body2: '',
    conclusion: ''
  });
  const [scaffoldInserted, setScaffoldInserted] = useState(false);

  const handleScaffoldChange = (field, val) => {
    setScaffold(prev => ({ ...prev, [field]: val }));
  };

  const handleInsertOutlineIntoEssay = () => {
    const parts = [];
    if (scaffold.intro.trim()) parts.push(scaffold.intro.trim());
    if (scaffold.overviewOrThesis.trim()) parts.push(scaffold.overviewOrThesis.trim());
    if (scaffold.body1.trim()) parts.push(scaffold.body1.trim());
    if (scaffold.body2.trim()) parts.push(scaffold.body2.trim());
    if (!isTask1 && scaffold.conclusion.trim()) parts.push(scaffold.conclusion.trim());

    if (parts.length === 0) {
      alert('Vui lòng nhập ít nhất 1 ý trong khung dàn ý trước khi chèn vào bài viết.');
      return;
    }

    const generatedText = parts.join('\n\n');
    if (!essayText.trim()) {
      setEssayText(generatedText);
    } else {
      setEssayText(prev => prev + '\n\n' + generatedText);
    }
    setScaffoldInserted(true);
    setTimeout(() => setScaffoldInserted(false), 2500);
    setActiveTab('essay');
  };

  // Compute live analytics
  const paragraphs = analyzeParagraphs(essayText, task.taskNumber);
  const totalWords = paragraphs.reduce((acc, p) => acc + p.words, 0);
  const lexicalData = analyzeLexicalDiversity(essayText);
  const currentWpm = calculateWpm(totalWords, timeElapsed);

  const isWordCountMet = totalWords >= task.minWords;
  const wordDiff = task.minWords - totalWords;

  const task1OverviewCheck = React.useMemo(() => {
    if (!isTask1) return null;
    const rawParas = paragraphs.map(p => p.text).filter(Boolean);
    return analyzeTask1Overview(rawParas);
  }, [isTask1, paragraphs]);

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-16 sm:pb-6">
      
      {/* Top Editor Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        
        {/* Left: Tab Switcher (Essay vs Scratchpad) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('essay')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'essay' 
                ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span className="sm:hidden">Bài Viết</span>
            <span className="hidden sm:inline">Bài Viết Chính</span>
          </button>
          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'outline' 
                ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="sm:hidden">Dàn Ý</span>
            <span className="hidden sm:inline">Bản Nháp / Dàn Ý</span>
          </button>
        </div>

        {/* Right: Live Metrics Indicators */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          
          {/* Word Count Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-bold border transition-colors ${
            isWordCountMet 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isWordCountMet ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span>{totalWords} / {task.minWords} từ</span>
            {!isWordCountMet && (
              <span className="text-[10px] text-amber-600 font-normal hidden sm:inline">
                (thiếu {wordDiff})
              </span>
            )}
          </div>

          {/* Lexical Diversity (TTR) */}
          <div 
            className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium cursor-help"
            title="Type-Token Ratio: Tỷ lệ từ vựng phong phú, không lặp lại (Mục tiêu: > 50%)"
          >
            <span className="text-slate-400 font-bold">TTR:</span>
            <span className={`font-bold ${lexicalData.ttr >= 50 ? 'text-emerald-700' : 'text-slate-700'}`}>
              {lexicalData.ttr}%
            </span>
          </div>

          {/* WPM */}
          <div 
            className="hidden md:flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium cursor-help"
            title="Tốc độ gõ phím hiện tại (Words Per Minute)"
          >
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentWpm} WPM</span>
          </div>

          {/* Quick Paraphrase & Side Panel Helper */}
          <button
            onClick={() => onOpenSlideOver ? onOpenSlideOver('paraphrase') : onOpenParaphrase?.()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            title="Mở bảng tra cứu Paraphrase cạnh bài viết"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Tra Paraphrase</span>
          </button>

          <button
            onClick={() => onOpenSlideOver ? onOpenSlideOver('vocab') : null}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            title="Mở Sổ từ vựng cạnh bài viết"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Sổ Từ Vựng</span>
          </button>

          {/* Task 1 Cambridge Data & Overview Live Inspector */}
          {isTask1 && (
            <button
              onClick={() => setIsTask1CoverageOpen(true)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                task1OverviewCheck?.hasOverview && !task1OverviewCheck?.hasRawData
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title="Kiểm tra mức độ bao phủ số liệu & đoạn Overview Task 1 theo chuẩn Cambridge"
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Phủ Số Liệu Task 1</span>
              <span className={`text-[10px] px-1 rounded font-black ${
                task1OverviewCheck?.hasOverview && !task1OverviewCheck?.hasRawData
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-amber-200 text-amber-900'
              }`}>
                {task1OverviewCheck?.hasOverview ? (task1OverviewCheck?.hasRawData ? 'Dính số liệu' : 'OV Đạt ✓') : 'Thiếu OV ⚠️'}
              </span>
            </button>
          )}

          {/* Spellcheck Toggle */}
          <button
            onClick={() => setSpellcheckEnabled(!spellcheckEnabled)}
            className={`p-1.5 rounded-lg border transition-colors ${
              spellcheckEnabled 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : 'bg-slate-100 text-slate-400 border-transparent hover:text-slate-600'
            }`}
            title={`Kiểm tra chính tả: ${spellcheckEnabled ? 'Đang BẬT' : 'Đang TẮT (Chuẩn thi thật)'}`}
          >
            <SpellCheck className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Main Textarea Area */}
      <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col min-h-[380px] sm:min-h-[600px] lg:min-h-[660px] xl:min-h-[740px] relative">
        {activeTab === 'essay' ? (
          <div className="flex-1 flex flex-col h-full min-h-[350px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[700px] bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden relative focus-within:border-slate-300 transition-colors">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (onSubmitEssay) onSubmitEssay();
                }
              }}
              spellCheck={spellcheckEnabled}
              placeholder="Bắt đầu viết bài luận của bạn tại đây... (Nhấn Enter hai lần để sang đoạn mới • Nhấn Ctrl+Enter để nộp bài)"
              className="flex-1 w-full min-h-[350px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[700px] p-3.5 sm:p-6 lg:p-7 resize-none focus:outline-none text-slate-850 font-sans text-[15px] sm:text-[16.5px] leading-[1.8] tracking-wide selection:bg-red-100 selection:text-red-900 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[700px] bg-white rounded-xl border border-indigo-200 shadow-2xs overflow-hidden p-3.5 sm:p-5 space-y-3">
            {/* Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Khung Dàn Ý Tương Tác & Bản Nháp
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isTask1 ? 'Dàn ý Task 1: Mở bài, Overview xu hướng & Thân bài đối chiếu' : 'Dàn ý Task 2: Mô hình P.E.E.L & Thesis Statement chuẩn Cambridge'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setOutlineMode('scaffold')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                    outlineMode === 'scaffold'
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Khung PEEL chuẩn</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOutlineMode('raw')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                    outlineMode === 'raw'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Ghi chú tự do</span>
                </button>
              </div>
            </div>

            {outlineMode === 'scaffold' ? (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {/* 1. Introduction */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      1. Mở bài (Introduction)
                    </label>
                    <span className="text-[10px] text-slate-400">Paraphrase đề bài</span>
                  </div>
                  <textarea
                    rows={2}
                    value={scaffold.intro}
                    onChange={(e) => handleScaffoldChange('intro', e.target.value)}
                    placeholder={isTask1 ? "Ví dụ: The provided line graph illustrates the consumption of three types of fast food in the UK from 1990 to 2010..." : "Ví dụ: It is often argued that universities should focus on practical career skills rather than theoretical knowledge..."}
                    className="w-full text-xs text-slate-800 p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                {/* 2. Overview (Task 1) or Thesis Statement (Task 2) */}
                <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-indigo-950">
                      {isTask1 ? '2. Đoạn Tổng Quan (Overview - Bắt buộc Band 7.0+)' : '2. Luận Điểm Cốt Lõi (Thesis Statement)'}
                    </label>
                    <span className="text-[10px] text-indigo-600 font-medium">
                      {isTask1 ? 'Không đưa số liệu chi tiết' : 'Lập trường xuyên suốt'}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={scaffold.overviewOrThesis}
                    onChange={(e) => handleScaffoldChange('overviewOrThesis', e.target.value)}
                    placeholder={isTask1 ? "Bắt đầu bằng: 'Overall, it is clear that pizza experienced a marked upward trend, whereas fish and chips saw a dramatic decline...'" : "Ví dụ: While academic theory has certain merits, I firmly agree that modern education must prioritize vocational readiness..."}
                    className="w-full text-xs text-slate-800 p-2.5 rounded-lg border border-indigo-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                {/* 3. Body 1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      {isTask1 ? '3. Thân bài 1: Nhóm đối tượng / số liệu thứ nhất' : '3. Thân bài 1 (Mô hình P.E.E.L)'}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {isTask1 ? 'Chọn lọc đặc điểm & so sánh' : 'Point -> Explain -> Example'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={scaffold.body1}
                    onChange={(e) => handleScaffoldChange('body1', e.target.value)}
                    placeholder={isTask1 ? "Tập trung phân tích các số liệu cao nhất, mốc khởi đầu, đỉnh điểm và lồng ghép so sánh tương quan..." : "P: Luận điểm thứ nhất...\nE: Giải thích cơ chế vì sao...\nE: Dẫn chứng hoặc ví dụ cụ thể..."}
                    className="w-full text-xs text-slate-800 p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                {/* 4. Body 2 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      {isTask1 ? '4. Thân bài 2: Nhóm đối tượng / số liệu thứ hai' : '4. Thân bài 2 (Mô hình P.E.E.L)'}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {isTask1 ? 'Phân tích các đối tượng còn lại' : 'Point -> Explain -> Example'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={scaffold.body2}
                    onChange={(e) => handleScaffoldChange('body2', e.target.value)}
                    placeholder={isTask1 ? "Phân tích các xu hướng đối lập hoặc các nhóm số liệu còn lại với liên từ so sánh (in contrast, conversely)..." : "P: Luận điểm phản biện hoặc khía cạnh thứ hai...\nE: Giải thích sâu hơn...\nE: Dẫn chứng hoặc hệ quả..."}
                    className="w-full text-xs text-slate-800 p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                {/* 5. Conclusion (Task 2 only) */}
                {!isTask1 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        5. Kết bài (Conclusion)
                      </label>
                      <span className="text-[10px] text-slate-400">Đúc kết lập trường</span>
                    </div>
                    <textarea
                      rows={2}
                      value={scaffold.conclusion}
                      onChange={(e) => handleScaffoldChange('conclusion', e.target.value)}
                      placeholder="Bắt đầu bằng: 'In conclusion, although theoretical studies maintain importance, practical training ultimately provides greater societal benefits...'"
                      className="w-full text-xs text-slate-800 p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                )}

                {/* Scaffold Action Bar */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    💡 Dàn ý rõ ràng giúp đạt tối thiểu <strong>Band 7.0 Task Response</strong>.
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleInsertOutlineIntoEssay}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      {scaffoldInserted ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Đã chèn vào bài!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Chèn dàn ý vào Bài Viết</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-2">
                <textarea
                  value={outlineText}
                  onChange={(e) => setOutlineText(e.target.value)}
                  placeholder="Ghi nhanh các ý tưởng, từ vựng hay hoặc dàn ý tự do trước khi viết bài chính..."
                  className="flex-1 w-full min-h-[380px] p-3 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed rounded-lg border border-slate-200"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t">
                  <span>Ghi chú tự do không tính vào bài nộp chính thức</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!outlineText.trim()) return;
                      setEssayText(prev => prev ? prev + '\n\n' + outlineText : outlineText);
                      setActiveTab('essay');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Chèn nội dung nháp vào bài viết →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overused Words Warning Bar */}
      {lexicalData.overusedWords && lexicalData.overusedWords.length > 0 && (
        <div className="mx-4 sm:mx-6 mb-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-1.5 truncate">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold">Cảnh báo lặp từ:</span>
            <span className="text-amber-800 truncate">
              Bạn đang dùng {lexicalData.overusedWords.map(w => `"${w.word}" (${w.count}x)`).join(', ')}.
            </span>
          </div>
          <button
            onClick={onOpenParaphrase}
            className="text-[11px] font-bold text-amber-900 hover:underline shrink-0 ml-2"
          >
            Tìm từ thay thế →
          </button>
        </div>
      )}

      {/* Paragraph Counter & Auto-save Status Footer */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        
        {/* Paragraph Breakdown Trigger */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowParagraphDetails(!showParagraphDetails)}
            className="flex items-center space-x-1 font-semibold text-slate-700 hover:text-red-600 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Phân bổ {paragraphs.length} đoạn văn</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showParagraphDetails ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick inline badges */}
          <div className="hidden sm:flex items-center space-x-1.5 pl-2 border-l border-slate-200">
            {paragraphs.map((p, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-600">
                Đ{i + 1}: <strong>{p.words}w</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Auto-save timestamp */}
        <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
          <Save className="w-3 h-3" />
          <span>Tự động lưu: {lastSaved ? lastSaved.toLocaleTimeString('vi-VN') : 'Đang đồng bộ...'}</span>
        </div>

      </div>

      {/* Detailed Paragraph Breakdown Drawer */}
      {showParagraphDetails && (
        <div className="bg-slate-100 border-t border-slate-200 p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in slide-in-from-bottom-2 duration-150">
          {paragraphs.map((p, idx) => (
            <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
              <span className="font-bold text-slate-800 block truncate">{p.label}</span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Thực tế:</span>
                <span className="font-bold text-red-600">{p.words} từ</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Khuyên dùng:</span>
                <span>{p.recommended}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task 1 Cambridge Live Coverage Modal */}
      {isTask1 && (
        <Task1DataCoverageModal
          isOpen={isTask1CoverageOpen}
          onClose={() => setIsTask1CoverageOpen(false)}
          paragraphs={paragraphs}
          onInsertOverview={(sentence) => {
            setEssayText(prev => prev ? `${sentence}\n\n${prev}` : sentence);
            setIsTask1CoverageOpen(false);
          }}
        />
      )}

    </div>
  );
}
