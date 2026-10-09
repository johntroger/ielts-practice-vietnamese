import React, { useState, useEffect, useRef } from 'react';
import { 
  Lightbulb, 
  Highlighter, 
  Maximize2, 
  Eye, 
  EyeOff, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Layers, 
  Compass, 
  Image as ImageIcon, 
  X, 
  ZoomIn,
  RotateCcw,
  SlidersHorizontal,
  Target,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Award,
  Check,
  Copy,
  RefreshCw,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import ProcessMapRenderer from './ProcessMapRenderer';
import ImageViewerModal from './ImageViewerModal';
import StarRatingWidget from './common/StarRatingWidget';
import { recordAttempt } from '../services/ratingPopularityService';
import { validateThesisStatement, validatePeelParagraph } from '../services/geminiService';
import { getTheoryContext, openTheoryModalWithContext } from '../services/theoryContextService';
import { useTranslation } from '../i18n/index.js';

// Helper to escape special characters for RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper to render prompt with persistent inline highlights
function renderHighlightedPrompt(promptText, highlights, onRemoveHighlight, isEn = false) {
  if (!promptText) return null;
  if (!highlights || highlights.length === 0) {
    return promptText;
  }

  // Filter valid highlight strings and sort by length descending to match longer phrases first
  const validHighlights = highlights
    .filter(h => typeof h === 'string' && h.trim().length > 0)
    .sort((a, b) => b.length - a.length);

  if (validHighlights.length === 0) return promptText;

  try {
    const pattern = new RegExp(`(${validHighlights.map(escapeRegExp).join('|')})`, 'gi');
    const parts = promptText.split(pattern);

    return parts.map((part, index) => {
      const isMatched = validHighlights.some(h => h.toLowerCase() === part.toLowerCase());
      if (isMatched) {
        return (
          <mark
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveHighlight(part);
            }}
            title={isEn ? "Click to remove this highlighted phrase" : "Nhấp vào để xóa highlight cụm từ này"}
            className="bg-amber-200 hover:bg-amber-300 text-amber-950 px-1 py-0.5 rounded font-semibold transition-all cursor-pointer inline shadow-2xs border-b-2 border-amber-400 group relative"
          >
            {part}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-[10px] text-amber-800 font-bold">
              ✕
            </span>
          </mark>
        );
      }
      return part;
    });
  } catch (err) {
    console.warn('Highlight regex error:', err);
    return promptText;
  }
}

export default function PromptPane({
  task,
  mode,
  onBrainstorm,
  isBrainstorming,
  brainstormResult,
  onOpenIdeaMatrix,
  apiKey,
  onOpenSettings,
  isMastered = false,
  onToggleMastered,
  onOpenLibrary,
  writingViewMode = 'pro'
}) {
  const { t, isEn } = useTranslation();
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Thesis Statement & Stance Validator States
  const [showThesisValidator, setShowThesisValidator] = useState(false);
  const [thesisInput, setThesisInput] = useState('');
  const [isValidatingThesis, setIsValidatingThesis] = useState(false);
  const [thesisResult, setThesisResult] = useState(null);
  const [copiedThesisIdx, setCopiedThesisIdx] = useState(null);

  // PEEL Argument Coherence Validator States (Task 2 Body Paragraphs)
  const [showPeelValidator, setShowPeelValidator] = useState(false);
  const [peelInput, setPeelInput] = useState('');
  const [isValidatingPeel, setIsValidatingPeel] = useState(false);
  const [peelResult, setPeelResult] = useState(null);
  const [copiedPeelUpgrade, setCopiedPeelUpgrade] = useState(false);

  // Reset validators when task changes
  useEffect(() => {
    setThesisResult(null);
    setThesisInput('');
    setShowThesisValidator(false);
    setPeelResult(null);
    setPeelInput('');
    setShowPeelValidator(false);
  }, [task?.id]);

  const handleValidateThesis = async () => {
    if (!thesisInput.trim()) {
      alert(isEn ? 'Please enter your Thesis Statement or introduction sentence.' : 'Vui lòng nhập câu Thesis Statement hoặc câu mở bài của bạn.');
      return;
    }
    setIsValidatingThesis(true);
    try {
      const res = await validateThesisStatement({
        task,
        thesisText: thesisInput,
        apiKey
      });
      setThesisResult(res);
    } catch (err) {
      alert(err.message || 'Lỗi kiểm tra câu luận đề.');
    } finally {
      setIsValidatingThesis(false);
    }
  };

  const handleValidatePeel = async () => {
    if (!peelInput.trim() || peelInput.trim().length < 15) {
      alert('Vui lòng nhập đoạn thân bài có ít nhất 15 ký tự để phân tích chuỗi lập luận PEEL.');
      return;
    }
    setIsValidatingPeel(true);
    try {
      const res = await validatePeelParagraph({
        task,
        paragraphText: peelInput,
        apiKey
      });
      setPeelResult(res);
    } catch (err) {
      alert(err.message || 'Lỗi thẩm định chuỗi lập luận đoạn văn PEEL.');
    } finally {
      setIsValidatingPeel(false);
    }
  };

  // Auto-record attempt count when user views/practices this task
  useEffect(() => {
    if (task?.id) {
      recordAttempt(task.id);
    }
  }, [task?.id]);

  // Persistent highlights per task ID
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem(`ielts_highlights_${task?.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const promptContainerRef = useRef(null);

  // Sync highlights when current task changes
  useEffect(() => {
    if (!task?.id) return;
    try {
      const saved = localStorage.getItem(`ielts_highlights_${task.id}`);
      setHighlights(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setHighlights([]);
    }
  }, [task?.id]);

  const updateHighlights = (newHighlights) => {
    setHighlights(newHighlights);
    if (task?.id) {
      try {
        localStorage.setItem(`ielts_highlights_${task.id}`, JSON.stringify(newHighlights));
      } catch (e) {}
    }
  };

  // Text selection highlighter handler
  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    // Ensure selection occurred within the prompt container
    if (promptContainerRef.current && !promptContainerRef.current.contains(selection.anchorNode)) {
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length >= 2) {
      const exists = highlights.some(h => h.toLowerCase() === selectedText.toLowerCase());
      if (!exists) {
        const updated = [...highlights, selectedText];
        updateHighlights(updated);
      }
      // Clear native selection so inline mark becomes immediately visible
      selection.removeAllRanges();
    }
  };

  const removeHighlight = (text) => {
    const updated = highlights.filter(h => h.toLowerCase() !== text.toLowerCase());
    updateHighlights(updated);
  };

  const clearAllHighlights = () => {
    updateHighlights([]);
  };

  const isChartTask = task.taskNumber === 1 && !!task.chartData;
  const isProcessOrMap = task.taskNumber === 1 && (task.type === 'process' || task.type === 'map' || !!task.processSteps || !!task.mapChanges);

  return (
    <div className="p-4 sm:p-6 pb-24 sm:pb-12 max-w-3xl mx-auto space-y-5">
      
      {/* Social Proof, Star Rating & Discovery Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border border-amber-200/70 shadow-2xs">
        <div className="flex items-center flex-wrap gap-2">
          {(task?.id || task?.title) && (
            <StarRatingWidget
              itemId={task.id || task.title}
              fallbackTitle={task.title}
              showAttempts={true}
              size="sm"
            />
          )}
        </div>

        {onOpenLibrary && (
          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer hover:border-slate-300 active:scale-95"
            title={isEn ? "Open task library to filter, view top-rated tasks & switch prompts" : "Mở Thư Viện Đề để Lọc thông minh, xem Đề Rating cao & Đổi đề thi khác"}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
            <span>{isEn ? "Task Bank & Filters" : "Kho Đề & Bộ Lọc"}</span>
          </button>
        )}
      </div>

      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            task.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            IELTS Writing Task {task.taskNumber}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium capitalize">
            {task.type}
          </span>
          {(() => {
            const theoryCtx = getTheoryContext({
              skill: 'writing',
              taskNumber: task.taskNumber,
              taskType: task.type,
              prompt: task.prompt,
              isEn
            });
            if (!theoryCtx) return null;
            return (
              <div className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 text-sky-900 text-[11px] font-semibold shadow-2xs">
                <button
                  type="button"
                  onClick={() => openTheoryModalWithContext(theoryCtx)}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 hover:bg-sky-100 transition-colors cursor-pointer rounded-l-md"
                  title={theoryCtx.tip}
                >
                  <BookOpen className="w-3 h-3 text-sky-600 shrink-0" />
                  <span className="hidden sm:inline">{theoryCtx.badge}</span>
                  <span className="sm:hidden">{isEn ? "Handbook" : "Cẩm Nang"}</span>
                </button>
                <a
                  href={theoryCtx.gitbookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-1.5 py-0.5 text-sky-700 hover:text-sky-950 hover:underline border-l border-sky-200 flex items-center shrink-0"
                  title={isEn ? "Read detailed handbook on GitBook" : "Đọc cẩm nang chi tiết trên GitBook"}
                >
                  <span className="hidden sm:inline">{isEn ? "Web Guide" : "Bản Web"}</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:ml-0.5 opacity-80" />
                </a>
              </div>
            );
          })()}
          {task.isAiGenerated && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-medium">
              <Sparkles className="w-3 h-3" />
              <span>AI Forecast</span>
            </span>
          )}
          {onToggleMastered && (
            <button
              onClick={onToggleMastered}
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer shadow-2xs border ${
                isMastered 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
              }`}
              title={isMastered 
                ? (isEn ? 'Task mastered. Click to unmark' : 'Đề thi này đã thuộc. Nhấp để bỏ đánh dấu') 
                : (isEn ? 'Mark this task as Mastered to track progress' : 'Đánh dấu đề thi này là "Đã thuộc" để ghi nhớ tiến trình')}
            >
              <CheckCircle2 className={`w-3 h-3 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isMastered ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Mark as Mastered' : 'Đánh dấu thuộc')}</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>{isEn ? 'Minimum:' : 'Tối thiểu:'} <strong className="text-slate-700">{task.minWords} {isEn ? 'words' : 'từ'}</strong></span>
          <span>•</span>
          <span>{isEn ? 'Suggested time:' : 'Thời gian gợi ý:'} <strong className="text-slate-700">{task.timeLimit} {isEn ? 'mins' : 'phút'}</strong></span>
        </div>
      </div>

      {/* Task Title & Prompt */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {task.title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <StarRatingWidget 
              itemId={task.id || task.title} 
              fallbackTitle={task.title} 
              size="sm" 
              showAttempts={true} 
            />
          </div>
        </div>

        {/* Prompt Card with text selection highlighter */}
        <div 
          ref={promptContainerRef}
          onMouseUp={handleHighlightSelection}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-sans text-sm sm:text-base leading-relaxed relative select-text shadow-2xs hover:border-slate-300 transition-all"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-lg">
              <Highlighter className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{isEn ? "Prompt Highlighter" : "Bút Highlight Đề Bài"}</span>
              <span className="text-[11px] font-normal text-amber-700 hidden sm:inline">{isEn ? "(Select any text to pin highlight)" : "(Bôi đen chữ bất kỳ để ghim đánh dấu)"}</span>
            </div>

            {highlights.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  {isEn ? `Pinned ${highlights.length} phrases` : `Đã ghim ${highlights.length} cụm từ`}
                </span>
                <button 
                  onClick={clearAllHighlights}
                  className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center space-x-0.5"
                >
                  <RotateCcw className="w-3 h-3 inline mr-0.5" />
                  <span>{isEn ? "Clear all" : "Xóa tất cả"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Render Prompt with Persistent Inline Highlights */}
          <p className="whitespace-pre-line text-slate-900 font-serif text-[15px] sm:text-[16px] leading-[1.8] tracking-wide">
            {renderHighlightedPrompt(task.prompt, highlights, removeHighlight, isEn)}
          </p>

          {/* Highlighted badges list */}
          {highlights.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                {isEn ? "Extracted key phrases:" : "Các từ khóa trọng tâm đã trích xuất:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {highlights.map((h, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-950 text-xs font-bold border border-amber-300/60 shadow-2xs"
                  >
                    <span>{h}</span>
                    <button 
                      onClick={() => removeHighlight(h)} 
                      className="text-amber-700 hover:text-amber-950 font-bold ml-1 hover:bg-amber-200 rounded p-0.5 transition-colors"
                      title={isEn ? "Remove this keyword" : "Xóa từ khóa này"}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task 1: Attached Image Visualizer (Biểu đồ số liệu từ đề thi thật) */}
      {task.imageUrl && !isProcessOrMap && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>{isEn ? "Authentic Exam Visual (Chart / Diagram):" : "Hình Ảnh Đề Bài Thực Tế (Visual Chart / Diagram):"}</span>
            </h3>
            <button
              onClick={() => setIsImageZoomed(true)}
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isEn ? "Zoom In" : "Phóng To Chi Tiết"}</span>
            </button>
          </div>

          <div 
            onClick={() => setIsImageZoomed(true)}
            className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-3 shadow-xs hover:border-blue-300 transition-all cursor-zoom-in group relative overflow-hidden"
          >
            <div className="flex items-center justify-center max-h-96 sm:max-h-[28rem] overflow-hidden rounded-xl bg-slate-50">
              <img
                src={task.imageUrl}
                alt={task.title || (isEn ? "Task 1 Chart" : "Hình ảnh Task 1")}
                className="max-h-96 sm:max-h-[28rem] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
            </div>
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center space-x-1 shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3 h-3" />
              <span>{isEn ? "Click to zoom" : "Nhấp để phóng to"}</span>
            </div>
          </div>

          {/* Zoom Modal with Zoom + / Zoom - and Pan */}
          <ImageViewerModal
            isOpen={isImageZoomed}
            onClose={() => setIsImageZoomed(false)}
            imageUrl={task.imageUrl}
            title={task.title || (isEn ? "Task 1 Prompt Visual" : "Hình ảnh đề bài Task 1")}
            touchTarget="min-w-[40px] min-h-[40px]"
          />
        </div>
      )}

      {/* Task 1: Table Data Display */}
      {task.tableData && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {isEn ? "Statistical Table Details" : "Bảng Số Liệu Chi Tiết (Statistical Table)"}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              {task.tableData.headers && (
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    {task.tableData.headers.map((h, idx) => (
                      <th key={idx} className="py-2.5 px-3 border-r border-slate-200 last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {task.tableData.rows && task.tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className={`py-2 px-3 border-r border-slate-100 last:border-r-0 ${cIdx === 0 ? 'font-medium text-slate-900 bg-slate-50/30' : 'text-slate-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task 1: Chart or Process/Map Visualizations */}
      {isChartTask && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {task.chartData.title || (task.secondChartData ? (isEn ? 'Chart 1' : 'Biểu Đồ 1 (Chart 1)') : (isEn ? 'Visual data chart' : 'Biểu đồ số liệu trực quan'))}
            </h3>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isZoomed ? (isEn ? 'Zoom out' : 'Thu nhỏ') : (isEn ? 'Zoom in' : 'Phóng to')}</span>
            </button>
          </div>
          <ChartRenderer chartData={task.chartData} />
        </div>
      )}

      {/* Task 1: Second Chart for Mixed/Combo Tasks */}
      {task.secondChartData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-bold">
              {task.secondChartData.title || (isEn ? 'Chart 2' : 'Biểu Đồ 2 (Chart 2)')}
            </h3>
          </div>
          <ChartRenderer chartData={task.secondChartData} />
        </div>
      )}

      {/* Task 1: Process and Map Visualizer */}
      {isProcessOrMap && (
        <div className="space-y-2">
          <ProcessMapRenderer task={task} />
        </div>
      )}

      {/* Keywords Breakdown */}
      {task.keywords && task.keywords.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{isEn ? "Key Terms" : "Từ khóa trọng tâm (Key Terms)"}</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {task.keywords.map((kw, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Writing Helpers & AI Diagnostic Tools (Brainstorming, Idea Matrix, Thesis & PEEL Checkers) */}
      <div className="pt-4 border-t border-slate-200 space-y-4">
          
          {/* Action Row */}
          <div className="flex flex-wrap gap-2">
            
            {/* Task 2: Stakeholder Idea Matrix Trigger */}
            {task.taskNumber === 2 && onOpenIdeaMatrix && (
              <button
                onClick={onOpenIdeaMatrix}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isEn ? "Multi-Perspective Idea Matrix" : "Ma Trận Ý Tưởng Đa Chiều"}</span>
              </button>
            )}

            {/* Outline Toggle */}
            {task.outline && (
              <button
                onClick={() => setShowOutline(!showOutline)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{showOutline ? (isEn ? 'Hide Outline' : 'Ẩn Dàn Ý Mẫu') : (isEn ? 'View Suggested Outline' : 'Xem Dàn Ý Gợi Ý')}</span>
              </button>
            )}

            {/* Model Answer Toggle */}
            {task.modelAnswer && (
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                {showModelAnswer ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{showModelAnswer ? (isEn ? 'Hide Model Answer' : 'Ẩn Bài Mẫu') : (isEn ? 'View Band 8.0+ Model Answer' : 'Xem Bài Mẫu Band 8.0+')}</span>
              </button>
            )}

            {/* AI Brainstorm button */}
            <button
              onClick={onBrainstorm}
              disabled={isBrainstorming}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{isBrainstorming ? (isEn ? 'AI Brainstorming...' : 'AI Đang Brainstorm...') : (isEn ? 'AI Argument Ideas' : 'AI Gợi Ý Luận Điểm')}</span>
            </button>

            {/* AI Thesis / Overview Validator Toggle */}
            <button
              onClick={() => setShowThesisValidator(!showThesisValidator)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                showThesisValidator 
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-900' 
                  : 'border-slate-200 bg-white hover:bg-indigo-50/60 text-slate-700 hover:text-indigo-900 shadow-2xs'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>{task?.taskNumber === 1 ? 'Check Overview (AI)' : 'Check Thesis Statement (AI)'}</span>
            </button>

            {/* AI PEEL Paragraph Coherence Checker Toggle (Task 2) */}
            {task?.taskNumber === 2 && (
              <button
                onClick={() => setShowPeelValidator(!showPeelValidator)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  showPeelValidator 
                    ? 'border-purple-400 bg-purple-50 text-purple-900' 
                    : 'border-slate-200 bg-white hover:bg-purple-50/60 text-slate-700 hover:text-purple-900 shadow-2xs'
                }`}
                title={isEn ? "Check body paragraph reasoning using Cambridge TR & CC Band 7.0+ PEEL framework" : "Kiểm tra chuỗi lập luận đoạn thân bài theo khung PEEL chuẩn Cambridge TR & CC Band 7.0+"}
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>{isEn ? "Check PEEL Paragraph (AI)" : "Check Đoạn PEEL (AI)"}</span>
              </button>
            )}
          </div>

          {/* AI Thesis Statement & Stance Validator Drawer */}
          {showThesisValidator && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between font-bold text-indigo-950">
                <span className="flex items-center space-x-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm">
                    {task?.taskNumber === 1 
                      ? (isEn ? 'Check Overview statement (Task 1)' : 'Kiểm tra câu Overview (Task 1)') 
                      : (isEn ? 'Check Thesis Statement & Stance (Task 2)' : 'Kiểm tra Thesis Statement & Lập trường (Task 2)')}
                  </span>
                </span>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded-full border border-indigo-200">
                  {isEn ? "Task Response Standard" : "Chuẩn chấm Task Response"}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {task?.taskNumber === 1
                  ? (isEn ? 'Enter 1-2 Overview sentences summarizing main trends and prominent features for AI generalisation assessment.' : 'Nhập 1-2 câu Overview tóm tắt xu hướng chính và đặc điểm nổi bật nhất của biểu đồ/quy trình để AI thẩm định độ khái quát.')
                  : (isEn ? 'Enter your Thesis statement to verify decisive stance (Clear Stance throughout) and prevent Task Response Band 7.0+ score loss.' : 'Nhập câu Luận đề (Thesis) của bạn để kiểm tra tính dứt khoát của lập trường (Clear Stance throughout), tránh lỗi mất điểm Task Response Band 7.0+.')}
              </p>

              <div className="space-y-2">
                <textarea
                  value={thesisInput}
                  onChange={(e) => setThesisInput(e.target.value)}
                  placeholder={task?.taskNumber === 1 
                    ? (isEn ? "Example: Overall, it is clear that while the proportion of car owners experienced a steady upward trend, the figure for public transport commuters witnessed a dramatic drop..." : "Ví dụ: Overall, it is clear that while the proportion of car owners experienced a steady upward trend, the figure for public transport commuters witnessed a dramatic drop...")
                    : (isEn ? "Example: In my opinion, while there are valid arguments in favor of traditional schooling, I firmly believe that digital education offers far greater flexibility and prepares students better for the modern economy." : "Ví dụ: In my opinion, while there are valid arguments in favor of traditional schooling, I firmly believe that digital education offers far greater flexibility and prepares students better for the modern economy.")}
                  rows={3}
                  className="w-full p-2.5 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800 text-xs leading-relaxed resize-y placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {thesisInput.trim().split(/\s+/).filter(Boolean).length} {isEn ? 'words' : 'từ'}
                  </span>
                  <div className="flex items-center space-x-2">
                    {thesisResult && (
                      <button
                        onClick={() => { setThesisResult(null); setThesisInput(''); }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isEn ? "Reset" : "Làm lại"}</span>
                      </button>
                    )}
                    <button
                      onClick={handleValidateThesis}
                      disabled={isValidatingThesis || !thesisInput.trim()}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      {isValidatingThesis ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{isEn ? "Evaluating..." : "Đang thẩm định..."}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isEn ? "Evaluate Now" : "Thẩm định ngay"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Result Area */}
              {thesisResult && (
                <div className="pt-2 border-t border-indigo-200/80 space-y-3">
                  {/* Status Banner */}
                  <div className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
                    thesisResult.isStanceClear
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    {thesisResult.isStanceClear ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs">
                          {thesisResult.isStanceClear
                            ? (isEn ? '✓ Clear & Decisive Stance (Clear Stance)' : '✓ Lập trường rõ ràng & Dứt khoát (Clear Stance)')
                            : (isEn ? '⚠️ Clarify Stance & Avoid Ambiguity (Ambiguous Stance)' : '⚠️ Cần làm rõ lập trường & Tránh mơ hồ (Ambiguous Stance)')}
                        </span>
                        {thesisResult.bandScoreEstimate && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            thesisResult.bandScoreEstimate.includes('8') || thesisResult.bandScoreEstimate.includes('7.5')
                              ? 'bg-emerald-200 text-emerald-800'
                              : 'bg-amber-200 text-amber-900'
                          }`}>
                            Est. {thesisResult.bandScoreEstimate}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {thesisResult.feedback}
                      </p>
                    </div>
                  </div>

                  {/* Criteria Checklist */}
                  {thesisResult.criteriaCheck && thesisResult.criteriaCheck.length > 0 && (
                    <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">{isEn ? "Examiner Criteria:" : "Tiêu chí Examiner chấm:"}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {thesisResult.criteriaCheck.map((crit, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-[11px]">
                            {crit.passed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            )}
                            <span className={crit.passed ? 'text-slate-700' : 'text-rose-700 font-medium'}>
                              {crit.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upgraded Suggestions */}
                  {thesisResult.suggestedRevisions && thesisResult.suggestedRevisions.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-indigo-900 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isEn ? "Band 8.0+ Upgraded Version Suggestions:" : "Phiên bản nâng cấp Band 8.0+ gợi ý:"}</span>
                      </span>
                      <div className="space-y-2">
                        {thesisResult.suggestedRevisions.map((rev, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 transition-all text-[11px] space-y-1 shadow-2xs group"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span className="font-semibold text-indigo-700">{rev.style || (isEn ? `Suggestion ${idx + 1}` : `Gợi ý ${idx + 1}`)}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(rev.text);
                                  setCopiedThesisIdx(idx);
                                  setTimeout(() => setCopiedThesisIdx(null), 2000);
                                }}
                                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                              >
                                {copiedThesisIdx === idx ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">{isEn ? "Copied" : "Đã sao chép"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>{isEn ? "Copy" : "Sao chép"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="font-serif italic text-slate-800 leading-relaxed select-all">
                              "{rev.text}"
                            </p>
                            {rev.note && (
                              <p className="text-[10px] text-slate-500">
                                💡 {rev.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI PEEL Argument Coherence Drawer (Task 2 Body Paragraphs) */}
          {showPeelValidator && task?.taskNumber === 2 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/90 via-indigo-50/60 to-slate-50 border border-purple-200 text-xs text-purple-950 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between font-bold text-purple-950 flex-wrap gap-2">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">{isEn ? "Check PEEL Reasoning Chain (Task 2 Body Paragraph)" : "Kiểm Tra Chuỗi Lập Luận PEEL (Thân Bài Task 2)"}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openTheoryModalWithContext({
                      skill: 'writing',
                      category: 'task2',
                      subType: 'all',
                      topicId: 'task2-peel-structure',
                      title: isEn ? 'PEEL Paragraph Structure & Comprehensive Task 2 Outlining' : 'Cấu Trúc Đoạn Văn PEEL & Dàn Bài Toàn Diện Task 2'
                    })}
                    className="inline-flex items-center space-x-1 text-purple-700 hover:text-purple-950 hover:underline font-semibold text-[11px] cursor-pointer"
                    title={isEn ? "Open detailed handbook on PEEL structure" : "Mở cẩm nang chi tiết về cấu trúc PEEL"}
                  >
                    <BookOpen className="w-3 h-3 text-purple-600" />
                    <span>{isEn ? "PEEL Handbook" : "Cẩm nang PEEL"}</span>
                  </button>
                  <span className="text-[11px] font-medium text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                    Task Response & Coherence 7.0+
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isEn ? "Enter or paste a body paragraph to audit the 4-step Cambridge reasoning chain: " : "Nhập hoặc dán 1 đoạn thân bài để AI kiểm định chuỗi lập luận 4 bước chuẩn Cambridge: "}
                <span className="font-semibold text-blue-700"> P (Point)</span> ➔ 
                <span className="font-semibold text-emerald-700"> E (Explanation)</span> ➔ 
                <span className="font-semibold text-purple-700"> E (Evidence)</span> ➔ 
                <span className="font-semibold text-rose-700"> L (Link)</span>{isEn ? ", and detect unsupported claims." : ", cảnh báo nhận định thiếu căn cứ (Unsupported claim)."}
              </p>

              <div className="space-y-2">
                <textarea
                  value={peelInput}
                  onChange={(e) => setPeelInput(e.target.value)}
                  placeholder={isEn 
                    ? "Paste your body paragraph here. E.g.: To begin with, digital technology significantly enhances educational accessibility. This is because online learning platforms eliminate geographical constraints, allowing underprivileged students to access top-tier university lectures. For instance, recent surveys in developing nations show that over 30% of remote learners gained professional certifications via digital portals. Consequently, investing in online infrastructure is pivotal to reducing educational inequality."
                    : "Dán đoạn thân bài của bạn vào đây. Ví dụ: To begin with, digital technology significantly enhances educational accessibility. This is because online learning platforms eliminate geographical constraints, allowing underprivileged students to access top-tier university lectures. For instance, recent surveys in developing nations show that over 30% of remote learners gained professional certifications via digital portals. Consequently, investing in online infrastructure is pivotal to reducing educational inequality."}
                  rows={4}
                  className="w-full p-2.5 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white text-slate-800 text-xs leading-relaxed resize-y placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {peelInput.trim() ? peelInput.trim().split(/\s+/).filter(Boolean).length : 0} {isEn ? 'words' : 'từ'}
                    {peelInput.trim().split(/\s+/).filter(Boolean).length > 0 && peelInput.trim().split(/\s+/).filter(Boolean).length < 70 && (
                      <span className="text-amber-600 ml-1.5">{isEn ? "(Recommended body paragraph: 80 - 130 words)" : "(Thân bài chuẩn nên từ 80 - 130 từ)"}</span>
                    )}
                  </span>
                  <div className="flex items-center space-x-2">
                    {peelResult && (
                      <button
                        onClick={() => { setPeelResult(null); setPeelInput(''); }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isEn ? "Reset" : "Làm lại"}</span>
                      </button>
                    )}
                    <button
                      onClick={handleValidatePeel}
                      disabled={isValidatingPeel || !peelInput.trim()}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      {isValidatingPeel ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{isEn ? "Evaluating PEEL..." : "Đang thẩm định PEEL..."}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isEn ? "Evaluate PEEL" : "Thẩm định PEEL"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* PEEL Validation Result Area */}
              {peelResult && (
                <div className="pt-3 border-t border-purple-200/80 space-y-3.5 animate-in fade-in">
                  {/* Status Banner */}
                  <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    peelResult.completenessScore >= 80
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                      : peelResult.completenessScore >= 60
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                        : 'bg-rose-50/90 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center space-x-2.5">
                      {peelResult.completenessScore >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : peelResult.completenessScore >= 60 ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-xs sm:text-sm">
                          {peelResult.completenessScore >= 80
                            ? (isEn ? 'Advanced Reasoning Chain' : 'Chuỗi Lập Luận Đạt Chuẩn Cao Cấp')
                            : peelResult.completenessScore >= 60
                              ? (isEn ? 'Good Structure - Additional Elements Needed' : 'Cấu Trúc Khá - Cần Bổ Sung Thành Phần')
                              : (isEn ? 'Needs Redevelopment to Meet PEEL Standards' : 'Chưa Đạt Chuẩn PEEL - Cần Phát Triển Lại')}
                        </div>
                        <div className="text-[11px] opacity-80">
                          {isEn ? 'Completeness:' : 'Độ hoàn thiện:'} <span className="font-black">{peelResult.completenessScore}%</span> • {peelResult.sentenceCount} {isEn ? 'sentences' : 'câu'} ({peelResult.wordCount} {isEn ? 'words' : 'từ'})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <span className="text-[10px] uppercase font-bold text-slate-500">{isEn ? 'Est. Band:' : 'Dự đoán Band:'}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-900 font-black text-xs shadow-2xs">
                        Band {peelResult.estimatedBand}
                      </span>
                    </div>
                  </div>

                  {/* 4 PEEL Component Status Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className={`p-2 rounded-lg border text-center ${
                      peelResult.hasPoint ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider">Point (P)</div>
                      <div className="text-xs font-black mt-0.5">
                        {peelResult.hasPoint ? (isEn ? 'Passed ✓' : 'Đạt ✓') : (isEn ? 'Missing ⚠️' : 'Thiếu ⚠️')}
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg border text-center ${
                      peelResult.hasExplanation ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider">Explain (E)</div>
                      <div className="text-xs font-black mt-0.5">
                        {peelResult.hasExplanation ? (isEn ? 'Passed ✓' : 'Đạt ✓') : (isEn ? 'Missing ⚠️' : 'Thiếu ⚠️')}
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg border text-center ${
                      peelResult.hasEvidence ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider">Evidence (E)</div>
                      <div className="text-xs font-black mt-0.5">
                        {peelResult.hasEvidence ? (isEn ? 'Passed ✓' : 'Đạt ✓') : (isEn ? 'Missing ⚠️' : 'Thiếu ⚠️')}
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg border text-center ${
                      peelResult.hasLink ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider">Link (L)</div>
                      <div className="text-xs font-black mt-0.5">
                        {peelResult.hasLink ? (isEn ? 'Passed ✓' : 'Đạt ✓') : (isEn ? 'Not Yet' : 'Chưa Có')}
                      </div>
                    </div>
                  </div>

                  {/* Unsupported Claims Warning */}
                  {peelResult.unsupportedClaims && peelResult.unsupportedClaims.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                      <div className="font-bold flex items-center space-x-1.5 text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{isEn ? "Unsupported Claims Warning:" : "Cảnh báo Nhận định Thiếu Cơ sở (Unsupported Claims):"}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800">
                        {peelResult.unsupportedClaims.map((uc, idx) => (
                          <li key={idx}>
                            <span className="italic">"{uc.sentence}"</span>: {uc.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cambridge Examiner Feedback */}
                  <div className="p-3 rounded-lg bg-white border border-purple-100 text-xs text-slate-700 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-purple-900 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isEn ? "Cambridge Examiner Feedback:" : "Nhận Xét Của Giám Khảo Cambridge:"}</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">
                      {peelResult.examinerFeedback}
                    </p>
                  </div>

                  {/* Sentence-by-sentence Breakdown */}
                  {peelResult.sentenceBreakdown && peelResult.sentenceBreakdown.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-purple-950 block">
                        {isEn ? "Sentence-by-sentence Functional Breakdown:" : "Giải phẫu chức năng từng câu (Functional Breakdown):"}
                      </span>
                      <div className="space-y-1.5">
                        {peelResult.sentenceBreakdown.map((item, idx) => {
                          const badgeColorMap = {
                            blue: 'bg-blue-100 text-blue-900 border-blue-200',
                            emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                            purple: 'bg-purple-100 text-purple-900 border-purple-200',
                            rose: 'bg-rose-100 text-rose-900 border-rose-200',
                            slate: 'bg-slate-100 text-slate-700 border-slate-200'
                          };
                          const bClass = badgeColorMap[item.color] || badgeColorMap.slate;

                          return (
                            <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bClass}`}>
                                  {isEn ? "Sentence" : "Câu"} {item.index}: {item.roleName}
                                </span>
                              </div>
                              <p className="text-slate-800 leading-relaxed font-serif">
                                "{item.text}"
                              </p>
                              {item.tip && (
                                <p className="text-[10px] text-slate-500">
                                  💡 {item.tip}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Band 8.5+ Exemplary Rewrite */}
                  {peelResult.exemplaryUpgrade?.text && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-900 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>{isEn ? "Band 8.5+ Exemplary Body Paragraph (Exemplary PEEL):" : "Đoạn Thân Bài Mẫu Nâng Cấp Band 8.5+ (Exemplary PEEL):"}</span>
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(peelResult.exemplaryUpgrade.text);
                            setCopiedPeelUpgrade(true);
                            setTimeout(() => setCopiedPeelUpgrade(false), 2000);
                          }}
                          className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          {copiedPeelUpgrade ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">{isEn ? "Copied" : "Đã sao chép"}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isEn ? "Copy exemplary paragraph" : "Sao chép đoạn mẫu"}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-purple-200 text-xs leading-relaxed font-serif text-slate-900 italic shadow-2xs">
                        "{peelResult.exemplaryUpgrade.text}"
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI Brainstorm result drawer */}
          {brainstormResult && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? "AI Argument & Collocation Suggestions:" : "Gợi ý Luận điểm & Collocation từ AI:"}</span>
                </span>
              </div>
              <div className="whitespace-pre-line leading-relaxed font-sans">
                {brainstormResult}
              </div>
            </div>
          )}

          {/* Predefined Outline Accordion */}
          {showOutline && task.outline && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
              <h4 className="font-bold text-blue-900 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{isEn ? "Proposed Essay Outline:" : "Cấu trúc Dàn bài đề xuất:"}</span>
              </h4>
              <div className="space-y-1.5 pl-2">
                {Object.entries(task.outline).map(([key, value]) => (
                  <p key={key} className="leading-relaxed">
                    <strong className="capitalize text-blue-900">{key}:</strong> {value}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Model Answer Drawer */}
          {showModelAnswer && task.modelAnswer && (
            <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? "Band 8.5+ Model Essay:" : "Bài Mẫu Band 8.5+ (Model Essay):"}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                  Cambridge Standard
                </span>
              </div>

              <div className="whitespace-pre-line text-sm leading-relaxed text-slate-800 bg-white/90 p-4 rounded-lg border border-emerald-100 font-sans">
                {task.modelAnswer}
              </div>

              {/* Model Vocabulary Highlights */}
              {task.vocabularyHighlights && task.vocabularyHighlights.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-200/60">
                  <span className="font-bold text-emerald-900 block text-xs">
                    {isEn ? "Valuable vocabulary in model essay:" : "Từ vựng đắt giá trong bài mẫu:"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {task.vocabularyHighlights.map((v, i) => (
                      <div key={i} className="bg-white p-2 rounded border border-emerald-100 text-xs">
                        <span className="font-bold text-emerald-800">{v.word}: </span>
                        <span className="text-slate-600">{v.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      {/* Zoom Modal for Chart */}
      {isZoomed && task.chartData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">{task.title}</h3>
              <button 
                onClick={() => setIsZoomed(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded"
              >
                {isEn ? "Close ✕" : "Đóng ✕"}
              </button>
            </div>
            <div className="h-96 w-full">
              <ChartRenderer chartData={task.chartData} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
