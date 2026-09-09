import React, { useState } from 'react';
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
  ZoomIn
} from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import ProcessMapRenderer from './ProcessMapRenderer';

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
  const [highlights, setHighlights] = useState([]);

  // Simple prompt highlighter helper
  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selectedText = selection.toString().trim();
    if (selectedText.length > 2 && !highlights.includes(selectedText)) {
      setHighlights(prev => [...prev, selectedText]);
    }
  };

  const removeHighlight = (text) => {
    setHighlights(prev => prev.filter(h => h !== text));
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
          onMouseUp={handleHighlightSelection}
          className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 font-sans text-sm sm:text-base leading-relaxed relative select-text"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5" />
              <span>Đề bài chính thức (Bôi đen để highlight)</span>
            </span>
            {highlights.length > 0 && (
              <button 
                onClick={() => setHighlights([])}
                className="text-[11px] text-red-600 hover:underline"
              >
                Xóa highlights ({highlights.length})
              </button>
            )}
          </div>

          <p className="whitespace-pre-line text-slate-900 font-medium">
            {task.prompt}
          </p>

          {/* Highlighted badges */}
          {highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-1.5">
              {highlights.map((h, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-xs font-semibold"
                >
                  <span>{h}</span>
                  <button onClick={() => removeHighlight(h)} className="text-amber-700 hover:text-amber-950 font-bold ml-1">×</button>
                </span>
              ))}
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
