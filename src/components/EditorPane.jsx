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
  Info
} from 'lucide-react';
import { analyzeParagraphs, analyzeLexicalDiversity, calculateWpm } from '../utils/textAnalytics';

export default function EditorPane({
  essayText,
  setEssayText,
  outlineText,
  setOutlineText,
  task,
  mode,
  timeElapsed,
  lastSaved,
  onOpenParaphrase
}) {
  const [spellcheckEnabled, setSpellcheckEnabled] = useState(mode === 'practice');
  const [activeTab, setActiveTab] = useState('essay'); // 'essay' | 'outline'
  const [showParagraphDetails, setShowParagraphDetails] = useState(false);

  // Compute live analytics
  const paragraphs = analyzeParagraphs(essayText, task.taskNumber);
  const totalWords = paragraphs.reduce((acc, p) => acc + p.words, 0);
  const lexicalData = analyzeLexicalDiversity(essayText);
  const currentWpm = calculateWpm(totalWords, timeElapsed);

  const isWordCountMet = totalWords >= task.minWords;
  const wordDiff = task.minWords - totalWords;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Top Editor Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        
        {/* Left: Tab Switcher (Essay vs Scratchpad) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('essay')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'essay' 
                ? 'bg-white text-slate-900 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span>Bài Viết Chính</span>
          </button>
          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'outline' 
                ? 'bg-white text-slate-900 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Bản Nháp / Dàn Ý</span>
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

          {/* Quick Paraphrase */}
          <button
            onClick={onOpenParaphrase}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            title="Mở từ điển Paraphrase nhanh"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden lg:inline">Tra Paraphrase</span>
          </button>

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
      <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-0 relative">
        {activeTab === 'essay' ? (
          <div className="flex-1 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden relative focus-within:border-slate-300 transition-colors">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              spellCheck={spellcheckEnabled}
              placeholder="Bắt đầu viết bài luận của bạn tại đây... (Nhấn Enter hai lần để sang đoạn mới)"
              className="flex-1 w-full p-4 sm:p-6 resize-none focus:outline-none text-slate-850 font-sans text-[15.5px] sm:text-[16.5px] leading-[1.75] tracking-wide selection:bg-red-100 selection:text-red-900 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full bg-white rounded-xl border border-blue-200 shadow-2xs overflow-hidden p-4 space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-blue-900 flex items-center space-x-1">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Bản Nháp & Dàn Ý Cá Nhân (Scratchpad)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Ghi chú không tính vào bài nộp chính thức
              </span>
            </div>
            <textarea
              value={outlineText}
              onChange={(e) => setOutlineText(e.target.value)}
              placeholder="Ghi nhanh các ý tưởng, từ vựng hay hoặc dàn ý PEEL trước khi viết bài chính..."
              className="flex-1 w-full p-3 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed"
            />
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

    </div>
  );
}
