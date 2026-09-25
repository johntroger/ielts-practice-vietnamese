import React, { useState, useEffect, useRef } from 'react';
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
  ListOrdered,
  GitCommit,
  SlidersHorizontal
} from 'lucide-react';
import { analyzeParagraphs, analyzeLexicalDiversity, calculateWpm } from '../utils/textAnalytics';
import Task1DataCoverageModal from './Task1DataCoverageModal';
import Task2CoherenceModal from './Task2CoherenceModal';
import SentenceHeatmapModal from './SentenceHeatmapModal';
import { analyzeTask1Overview } from '../services/algorithmicEvaluationService';
import { analyzeTask2Coherence } from '../utils/coherenceAnalyzer';
import { analyzeSentenceStructures } from '../services/sentenceAnalyzer';

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
  onSubmitEssay,
  onEditorFocus
}) {
  const [spellcheckEnabled, setSpellcheckEnabled] = useState(mode === 'practice');
  const [activeTab, setActiveTab] = useState('essay'); // 'essay' | 'outline'
  const [showParagraphDetails, setShowParagraphDetails] = useState(false);
  const [outlineMode, setOutlineMode] = useState('scaffold'); // 'scaffold' | 'raw'
  const isTask1 = task?.taskNumber === 1 || task?.isTask1;
  const [isTask1CoverageOpen, setIsTask1CoverageOpen] = useState(false);
  const [isTask2CoherenceOpen, setIsTask2CoherenceOpen] = useState(false);
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

  const task2CoherenceCheck = React.useMemo(() => {
    if (isTask1) return null;
    return analyzeTask2Coherence(essayText);
  }, [isTask1, essayText]);

  const [isSentenceHeatmapOpen, setIsSentenceHeatmapOpen] = useState(false);
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);
  const moreToolsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreToolsRef.current && !moreToolsRef.current.contains(e.target)) {
        setIsMoreToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const sentenceAnalysis = React.useMemo(() => {
    return analyzeSentenceStructures(essayText);
  }, [essayText]);

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-16 sm:pb-6">
      
      {/* Top Editor Toolbar (Compact, Zero Overflow in Split-Screen) */}
      <div className="bg-white border-b border-slate-200 px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs shrink-0 overflow-x-auto">
        
        {/* Left: Tab Switcher (Essay vs Scratchpad) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 sm:p-1 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('essay')}
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'essay' 
                ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>Bài Viết</span>
          </button>
          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'outline' 
                ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Dàn Ý</span>
          </button>
        </div>

        {/* Right: Live Metrics & Helper Tools */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs shrink-0">
          
          {/* Word Count Badge */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-bold border transition-colors shrink-0 text-xs ${
            isWordCountMet 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isWordCountMet ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span>{totalWords}/{task.minWords} từ</span>
          </div>

          {/* Lexical Diversity (TTR) */}
          <div 
            className="flex items-center space-x-1 px-1.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium cursor-help shrink-0 text-xs"
            title="Type-Token Ratio: Tỷ lệ từ vựng phong phú, không lặp lại (Mục tiêu: > 50%)"
          >
            <span className="text-slate-400 font-bold">TTR:</span>
            <span className={`font-bold ${lexicalData.ttr >= 50 ? 'text-emerald-700' : 'text-slate-700'}`}>
              {lexicalData.ttr}%
            </span>
          </div>

          {/* Task 1 Cambridge Data & Overview Live Inspector */}
          {isTask1 && (
            <button
              onClick={() => setIsTask1CoverageOpen(true)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs shrink-0 ${
                task1OverviewCheck?.hasOverview && !task1OverviewCheck?.hasRawData
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title="Kiểm tra mức độ bao phủ số liệu & đoạn Overview Task 1 theo chuẩn Cambridge"
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden min-[1600px]:inline">Phủ Số Liệu Task 1</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-black ${
                task1OverviewCheck?.hasOverview && !task1OverviewCheck?.hasRawData
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-amber-200 text-amber-900'
              }`}>
                {task1OverviewCheck?.hasOverview ? (task1OverviewCheck?.hasRawData ? 'Dính số liệu' : 'OV Đạt ✓') : 'Thiếu OV ⚠️'}
              </span>
            </button>
          )}

          {/* Task 2 Cambridge Live Argument Flow & Coherence Inspector */}
          {!isTask1 && (
            <button
              onClick={() => setIsTask2CoherenceOpen(true)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs shrink-0 ${
                task2CoherenceCheck?.status === 'optimal'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100'
              }`}
              title="Phân tích cấu trúc lập luận, câu Thesis & tính mạch lạc từng đoạn Task 2 theo chuẩn Cambridge"
            >
              <GitCommit className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden min-[1600px]:inline">Lập Luận Task 2</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-black ${
                task2CoherenceCheck?.status === 'optimal'
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-indigo-200 text-indigo-900'
              }`}>
                {task2CoherenceCheck?.statusLabel || 'Kiểm tra'}
              </span>
            </button>
          )}

          {/* Cambridge GRA Sentence Structure Heatmap Inspector */}
          <button
            onClick={() => setIsSentenceHeatmapOpen(true)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs shrink-0 ${
              sentenceAnalysis.totalSentences > 0 && sentenceAnalysis.complexPercentage >= 45
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : sentenceAnalysis.totalSentences > 0 && sentenceAnalysis.simplePercentage > 45
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Mở Bản Đồ Nhiệt Cấu Trúc Câu (Phân tích tỷ lệ câu đơn, câu ghép và câu phức chuẩn Cambridge GRA)"
          >
            <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="hidden min-[1600px]:inline">Cấu Trúc GRA</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-black ${
              sentenceAnalysis.totalSentences > 0 && sentenceAnalysis.complexPercentage >= 45
                ? 'bg-emerald-200 text-emerald-900'
                : sentenceAnalysis.totalSentences > 0 && sentenceAnalysis.simplePercentage > 45
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-slate-200 text-slate-800'
            }`}>
              {sentenceAnalysis.totalSentences > 0 ? `${sentenceAnalysis.complexPercentage}% Phức` : 'GRA'}
            </span>
          </button>

          {/* Quick Paraphrase Helper */}
          <button
            onClick={() => onOpenSlideOver ? onOpenSlideOver('paraphrase') : onOpenParaphrase?.()}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer shrink-0 text-xs"
            title="Mở bảng tra cứu Paraphrase cạnh bài viết"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">Paraphrase</span>
          </button>

          {/* More Tools Menu: Vocab, WPM, Spellcheck */}
          <div className="relative shrink-0" ref={moreToolsRef}>
            <button
              onClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer text-xs"
              title="Mở rộng tiện ích: Sổ từ vựng, Tốc độ gõ WPM & Kiểm tra chính tả"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="hidden min-[1600px]:inline text-[11px]">Tiện ích</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isMoreToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreToolsOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-xs">
                {/* Sổ từ vựng */}
                <button
                  onClick={() => {
                    setIsMoreToolsOpen(false);
                    if (onOpenSlideOver) onOpenSlideOver('vocab');
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 text-left text-slate-700 font-semibold cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sổ Từ Vựng C1-C2</span>
                </button>

                {/* WPM Speed */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Tốc độ gõ:</span>
                  </div>
                  <span className="font-bold">{currentWpm} WPM</span>
                </div>

                {/* Spellcheck Toggle */}
                <button
                  onClick={() => {
                    setSpellcheckEnabled(!spellcheckEnabled);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                    spellcheckEnabled ? 'bg-red-50 text-red-700 font-bold' : 'hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SpellCheck className="w-4 h-4 shrink-0" />
                    <span>Kiểm tra chính tả</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                    {spellcheckEnabled ? 'BẬT' : 'TẮT'}
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Main Textarea Area */}
      <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col min-h-[380px] sm:min-h-[600px] lg:min-h-[660px] xl:min-h-[740px] relative">
        {activeTab === 'essay' ? (
          <div className="flex-1 flex flex-col h-full min-h-[350px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[700px] bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden relative focus-within:border-slate-300 transition-colors">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              onFocus={onEditorFocus}
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

      {/* Task 2 Cambridge Live Argument Flow & Coherence Modal */}
      {!isTask1 && (
        <Task2CoherenceModal
          isOpen={isTask2CoherenceOpen}
          onClose={() => setIsTask2CoherenceOpen(false)}
          essayText={essayText}
          onInsertText={(text) => {
            setEssayText(prev => prev ? `${prev}\n\n${text}` : text);
            setIsTask2CoherenceOpen(false);
          }}
        />
      )}

      {/* Cambridge GRA Sentence Structure Heatmap Modal */}
      <SentenceHeatmapModal
        isOpen={isSentenceHeatmapOpen}
        onClose={() => setIsSentenceHeatmapOpen(false)}
        analysisData={sentenceAnalysis}
        onInsertTemplate={(templateText) => {
          if (!essayText.trim()) {
            setEssayText(templateText);
          } else {
            setEssayText(prev => prev + '\n\n' + templateText);
          }
          setIsSentenceHeatmapOpen(false);
        }}
      />

    </div>
  );
}
