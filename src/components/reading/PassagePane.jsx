import React, { useState, useRef, useEffect } from 'react';
import { 
  Highlighter, 
  Trash2, 
  Check, 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  X, 
  Volume2, 
  Search,
  RefreshCw
} from 'lucide-react';
import { lookupReadingWord } from '../../services/geminiService';

const HIGHLIGHT_COLORS = [
  { id: 'yellow', bg: 'bg-yellow-200/90 text-yellow-950', label: 'Vàng' },
  { id: 'cyan', bg: 'bg-cyan-200/90 text-cyan-950', label: 'Xanh lam' },
  { id: 'rose', bg: 'bg-rose-200/90 text-rose-950', label: 'Hồng' },
];

export default function PassagePane({
  passage,
  activeEvidencePara,
  fontSize = 'base',
  onFontSizeChange,
  apiKey,
  model = 'gemini-2.5-flash',
  onOpenSettings,
  onSaveToVocabNotebook
}) {
  const [activeColor, setActiveColor] = useState('yellow');
  const [highlights, setHighlights] = useState({}); // { [paraId]: [ { text, color } ] }

  // Double-Click / Selection Dictionary Tooltip State
  const [tooltip, setTooltip] = useState(null); // { word, context, x, y, loading, data, error, saved }
  const paneRef = useRef(null);

  const handleApplyHighlight = (paraId) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const selectedText = selection.toString().trim();
    if (!selectedText || selectedText.length < 2) return;

    setHighlights(prev => {
      const currentList = prev[paraId] || [];
      if (currentList.some(item => item.text === selectedText)) return prev;
      return {
        ...prev,
        [paraId]: [...currentList, { text: selectedText, color: activeColor }]
      };
    });
  };

  const handleClearHighlights = () => {
    setHighlights({});
  };

  // Double-click word lookup handler
  const handleDoubleClick = async (e, paraText) => {
    const selection = window.getSelection();
    if (!selection) return;
    const rawWord = selection.toString().trim();
    const cleanWord = rawWord.replace(/^[^\w]+|[^\w]+$/g, '');

    if (!cleanWord || cleanWord.length < 2 || cleanWord.includes(' ')) {
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const paneRect = paneRef.current ? paneRef.current.getBoundingClientRect() : { top: 0, left: 0 };

    const posX = Math.max(10, Math.min(window.innerWidth - 320, rect.left));
    const posY = Math.max(10, rect.bottom + 8);

    setTooltip({
      word: cleanWord,
      context: paraText,
      x: posX,
      y: posY,
      loading: !!apiKey,
      data: null,
      error: apiKey ? null : 'Vui lòng cấu hình Gemini API Key để tra từ điển tự động.',
      saved: false
    });

    if (!apiKey) return;

    try {
      const result = await lookupReadingWord({
        word: cleanWord,
        contextSentence: paraText,
        apiKey,
        model
      });
      setTooltip(prev => (prev && prev.word === cleanWord ? {
        ...prev,
        loading: false,
        data: result
      } : prev));
    } catch (err) {
      setTooltip(prev => (prev && prev.word === cleanWord ? {
        ...prev,
        loading: false,
        error: 'Không thể tra từ lúc này.'
      } : prev));
    }
  };

  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltip && !e.target.closest('#reading-dict-tooltip')) {
        setTooltip(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [tooltip]);

  const handleSaveToNotebookFromTooltip = () => {
    if (!tooltip?.data || !onSaveToVocabNotebook) return;
    onSaveToVocabNotebook({
      id: `vocab-${Date.now()}-${Math.random()}`,
      phrase: tooltip.data.word,
      meaningVi: `${tooltip.data.vietnameseMeaning} (${tooltip.data.partOfSpeech || 'từ vựng'})`,
      example: tooltip.data.academicExample || tooltip.context || '',
      topic: 'general',
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    setTooltip(prev => ({ ...prev, saved: true }));
  };

  const renderParagraphContent = (para) => {
    const paraHighlights = highlights[para.id] || [];
    if (paraHighlights.length === 0) {
      return para.text;
    }

    let parts = [para.text];
    paraHighlights.forEach(({ text, color }) => {
      const colorDef = HIGHLIGHT_COLORS.find(c => c.id === color) || HIGHLIGHT_COLORS[0];
      const newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string' && part.includes(text)) {
          const splits = part.split(text);
          for (let i = 0; i < splits.length; i++) {
            if (splits[i]) newParts.push(splits[i]);
            if (i < splits.length - 1) {
              newParts.push(
                <mark
                  key={`${para.id}-${text}-${i}`}
                  className={`${colorDef.bg} px-1 py-0.5 rounded-sm shadow-2xs font-medium cursor-pointer`}
                  title="Đã đánh dấu"
                >
                  {text}
                </mark>
              );
            }
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  const fontSizeClasses = {
    sm: 'text-[14px] leading-relaxed',
    base: 'text-[16px] leading-[1.8]',
    lg: 'text-[19px] leading-[2.0]'
  };

  return (
    <div ref={paneRef} className="h-full flex flex-col bg-white overflow-hidden select-text relative">
      {/* Passage Top Control Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        {/* Highlighter Tool Palette */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 font-semibold text-slate-600 mr-1">
            <Highlighter className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Dạ quang:</span>
          </div>

          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            {HIGHLIGHT_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveColor(c.id)}
                title={`Bút dạ quang ${c.label}`}
                className={`w-5 h-5 rounded-full transition-transform flex items-center justify-center ${
                  c.id === 'yellow' ? 'bg-amber-300' : c.id === 'cyan' ? 'bg-cyan-300' : 'bg-rose-300'
                } ${activeColor === c.id ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
              >
                {activeColor === c.id && <Check className="w-3 h-3 text-slate-900" />}
              </button>
            ))}
          </div>

          {Object.keys(highlights).length > 0 && (
            <button
              onClick={handleClearHighlights}
              title="Xóa tất cả highlight"
              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden lg:flex items-center space-x-1 text-[11px] text-slate-400 border-l border-slate-200 pl-2">
            <span>💡 Nhấp đúp vào từ để tra từ điển</span>
          </div>
        </div>

        {/* Font Size & Meta */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onFontSizeChange && onFontSizeChange('sm')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                fontSize === 'sm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Cỡ chữ nhỏ (A-)"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange && onFontSizeChange('base')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                fontSize === 'base' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Cỡ chữ chuẩn (A)"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange && onFontSizeChange('lg')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                fontSize === 'lg' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Cỡ chữ lớn (A+)"
            >
              A+
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-1 text-slate-500 text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200">
            <span>{passage?.wordCount || 800} từ</span>
          </div>
        </div>
      </div>

      {/* Passage Content Body */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
        {/* Title Header */}
        <div className="border-b border-slate-100 pb-4 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            <span>READING PASSAGE {passage?.passageNumber || 1}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {passage?.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Độ khó:</span>
            <span>{passage?.difficulty}</span>
          </div>
        </div>

        {/* Paragraphs */}
        <div className="space-y-6 text-slate-800">
          {passage?.paragraphs?.map(para => {
            const isTargetEvidence = activeEvidencePara === para.id;
            return (
              <div
                key={para.id}
                id={`passage-para-${para.id}`}
                onMouseUp={() => handleApplyHighlight(para.id)}
                onDoubleClick={(e) => handleDoubleClick(e, para.text)}
                className={`relative pl-7 sm:pl-9 transition-all rounded-xl p-3 ${
                  isTargetEvidence 
                    ? 'bg-amber-50/80 ring-2 ring-amber-400/80 shadow-md' 
                    : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Paragraph Label Badge (A, B, C...) */}
                <div 
                  className={`absolute left-1 top-3.5 w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs transition-colors select-none ${
                    isTargetEvidence
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white'
                  }`}
                  title={`Đoạn ${para.id}`}
                >
                  {para.id}
                </div>

                {/* Paragraph Content */}
                <p className={`text-justify font-serif cursor-text transition-all duration-150 ${fontSizeClasses[fontSize] || fontSizeClasses.base}`}>
                  {renderParagraphContent(para)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-8 pb-4 text-center text-xs text-slate-400 border-t border-slate-100">
          --- HẾT BÀI ĐỌC PASSAGE {passage?.passageNumber || 1} ---
        </div>
      </div>

      {/* Double Click Dictionary Tooltip Floating Popover */}
      {tooltip && (
        <div 
          id="reading-dict-tooltip"
          style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }}
          className="fixed z-50 w-72 sm:w-80 bg-slate-900 text-white rounded-xl shadow-2xl p-3.5 text-xs border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <div>
              <span className="font-bold text-sm text-blue-400">{tooltip.word}</span>
              {tooltip.data?.ipa && (
                <span className="text-slate-400 font-mono text-xs ml-2">[{tooltip.data.ipa}]</span>
              )}
              {tooltip.data?.partOfSpeech && (
                <span className="text-[10px] text-amber-300 italic ml-1.5 font-semibold">({tooltip.data.partOfSpeech})</span>
              )}
            </div>
            <button 
              onClick={() => setTooltip(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {tooltip.loading ? (
            <div className="flex items-center space-x-2 text-slate-400 py-3 justify-center">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Đang tra cứu từ điển học thuật...</span>
            </div>
          ) : tooltip.error ? (
            <div className="space-y-2 py-1">
              <p className="text-rose-400 text-xs">{tooltip.error}</p>
              {!apiKey && (
                <button
                  onClick={() => {
                    setTooltip(null);
                    if (onOpenSettings) onOpenSettings();
                  }}
                  className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px]"
                >
                  Cài đặt API Key
                </button>
              )}
            </div>
          ) : tooltip.data ? (
            <div className="space-y-2">
              <div className="text-emerald-300 font-semibold text-xs leading-snug">
                {tooltip.data.vietnameseMeaning}
              </div>

              {tooltip.data.englishDefinition && (
                <p className="text-slate-300 text-[11px] leading-relaxed italic border-l-2 border-slate-700 pl-2">
                  "{tooltip.data.englishDefinition}"
                </p>
              )}

              {tooltip.data.synonyms && tooltip.data.synonyms.length > 0 && (
                <div className="text-[11px] text-slate-400">
                  <span>Đồng nghĩa: </span>
                  <span className="text-slate-200 font-medium">{tooltip.data.synonyms.join(', ')}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleSaveToNotebookFromTooltip}
                  disabled={tooltip.saved}
                  className={`w-full py-1 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    tooltip.saved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                  }`}
                >
                  {tooltip.saved ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Đã lưu vào Sổ tay</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3" />
                      <span>Lưu vào Sổ tay từ vựng C1/C2</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
