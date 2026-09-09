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
  RotateCcw
} from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import ProcessMapRenderer from './ProcessMapRenderer';

// Helper to escape special characters for RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper to render prompt with persistent inline highlights
function renderHighlightedPrompt(promptText, highlights, onRemoveHighlight) {
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
            title="Nhấp vào để xóa highlight cụm từ này"
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
  onOpenSettings
}) {
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

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
    <div className="p-5 sm:p-6 max-w-3xl mx-auto space-y-6">
      
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
          {task.isAiGenerated && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-medium">
              <Sparkles className="w-3 h-3" />
              <span>AI Forecast</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>Tối thiểu: <strong className="text-slate-700">{task.minWords} từ</strong></span>
          <span>•</span>
          <span>Thời gian gợi ý: <strong className="text-slate-700">{task.timeLimit} phút</strong></span>
        </div>
      </div>

      {/* Task Title & Prompt */}
      <div className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {task.title}
        </h2>

        {/* Prompt Card with text selection highlighter */}
        <div 
          ref={promptContainerRef}
          onMouseUp={handleHighlightSelection}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-sans text-sm sm:text-base leading-relaxed relative select-text shadow-2xs hover:border-slate-300 transition-all"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-lg">
              <Highlighter className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Bút Highlight Đề Bài</span>
              <span className="text-[11px] font-normal text-amber-700 hidden sm:inline">(Bôi đen chữ bất kỳ để ghim đánh dấu)</span>
            </div>

            {highlights.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  Đã ghim {highlights.length} cụm từ
                </span>
                <button 
                  onClick={clearAllHighlights}
                  className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center space-x-0.5"
                >
                  <RotateCcw className="w-3 h-3 inline mr-0.5" />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            )}
          </div>

          {/* Render Prompt with Persistent Inline Highlights */}
          <p className="whitespace-pre-line text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
            {renderHighlightedPrompt(task.prompt, highlights, removeHighlight)}
          </p>

          {/* Highlighted badges list */}
          {highlights.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Các từ khóa trọng tâm đã trích xuất:
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
                      title="Xóa từ khóa này"
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

      {/* Task 1: Attached Image Visualizer (Biểu đồ / Bản đồ / Quy trình từ đề thi thật) */}
      {task.imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Hình Ảnh Đề Bài Thực Tế (Visual Chart / Diagram):</span>
            </h3>
            <button
              onClick={() => setIsImageZoomed(true)}
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Phóng To Chi Tiết</span>
            </button>
          </div>

          <div 
            onClick={() => setIsImageZoomed(true)}
            className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-3 shadow-xs hover:border-blue-300 transition-all cursor-zoom-in group relative overflow-hidden"
          >
            <div className="flex items-center justify-center max-h-96 sm:max-h-[28rem] overflow-hidden rounded-xl bg-slate-50">
              <img
                src={task.imageUrl}
                alt={task.title || "Task 1 Chart"}
                className="max-h-96 sm:max-h-[28rem] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
            </div>
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center space-x-1 shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3 h-3" />
              <span>Nhấp để phóng to</span>
            </div>
          </div>

          {/* Zoom Modal */}
          {isImageZoomed && (
            <div 
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
              onClick={() => setIsImageZoomed(false)}
            >
              <div 
                className="relative bg-white rounded-3xl max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm font-bold truncate max-w-md sm:max-w-xl">
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsImageZoomed(false)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 overflow-auto flex items-center justify-center bg-slate-100/70">
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="max-h-[80vh] w-auto object-contain rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task 1: Table Data Display */}
      {task.tableData && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bảng Số Liệu Chi Tiết (Statistical Table)
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
              {task.chartData.title || (task.secondChartData ? 'Biểu Đồ 1 (Chart 1)' : 'Biểu đồ số liệu trực quan')}
            </h3>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isZoomed ? 'Thu nhỏ' : 'Phóng to'}</span>
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
              {task.secondChartData.title || 'Biểu Đồ 2 (Chart 2)'}
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
            <span>Từ khóa trọng tâm (Key Terms)</span>
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

      {/* Practice Mode Helpers (Brainstorming, Idea Matrix & Model Answer) */}
      {mode === 'practice' && (
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
                <span>Ma Trận Ý Tưởng Đa Chiều</span>
              </button>
            )}

            {/* Outline Toggle */}
            {task.outline && (
              <button
                onClick={() => setShowOutline(!showOutline)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{showOutline ? 'Ẩn Dàn Ý Mẫu' : 'Xem Dàn Ý Gợi Ý'}</span>
              </button>
            )}

            {/* Model Answer Toggle */}
            {task.modelAnswer && (
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                {showModelAnswer ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{showModelAnswer ? 'Ẩn Bài Mẫu' : 'Xem Bài Mẫu Band 8.0+'}</span>
              </button>
            )}

            {/* AI Brainstorm button */}
            <button
              onClick={onBrainstorm}
              disabled={isBrainstorming}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{isBrainstorming ? 'AI Đang Brainstorm...' : 'AI Gợi Ý Luận Điểm'}</span>
            </button>
          </div>

          {/* AI Brainstorm result drawer */}
          {brainstormResult && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Gợi ý Luận điểm & Collocation từ Gemini:</span>
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
                <span>Cấu trúc Dàn bài đề xuất:</span>
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
                  <span>Bài Mẫu Band 8.5+ (Model Essay):</span>
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
                    Từ vựng đắt giá trong bài mẫu:
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
      )}

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
                Đóng ✕
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
