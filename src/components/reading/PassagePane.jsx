import React, { useState } from 'react';
import { 
  Highlighter, 
  Trash2, 
  Check
} from 'lucide-react';

const HIGHLIGHT_COLORS = [
  { id: 'yellow', bg: 'bg-yellow-200/90 text-yellow-950', label: 'Vàng' },
  { id: 'cyan', bg: 'bg-cyan-200/90 text-cyan-950', label: 'Xanh lam' },
  { id: 'rose', bg: 'bg-rose-200/90 text-rose-950', label: 'Hồng' },
];

export default function PassagePane({
  passage,
  activeEvidencePara,
  fontSize = 'base',
  onFontSizeChange
}) {
  const [activeColor, setActiveColor] = useState('yellow');
  const [highlights, setHighlights] = useState({}); // { [paraId]: [ { text, color } ] }

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

    selection.removeAllRanges();
  };

  const handleClearHighlights = () => {
    setHighlights({});
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
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose'
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden select-text">
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
        </div>

        {/* Font Size & Meta */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onFontSizeChange && onFontSizeChange('sm')}
              className={`px-2 py-0.5 rounded font-bold ${fontSize === 'sm' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
              title="Cỡ chữ nhỏ (A-)"
            >
              A-
            </button>
            <button
              onClick={() => onFontSizeChange && onFontSizeChange('base')}
              className={`px-2 py-0.5 rounded font-bold ${fontSize === 'base' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
              title="Cỡ chữ chuẩn (A)"
            >
              A
            </button>
            <button
              onClick={() => onFontSizeChange && onFontSizeChange('lg')}
              className={`px-2 py-0.5 rounded font-bold ${fontSize === 'lg' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
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
        <div className={`space-y-6 text-slate-800 ${fontSizeClasses[fontSize] || fontSizeClasses.base}`}>
          {passage?.paragraphs?.map(para => {
            const isTargetEvidence = activeEvidencePara === para.id;
            return (
              <div
                key={para.id}
                id={`passage-para-${para.id}`}
                onMouseUp={() => handleApplyHighlight(para.id)}
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
                <p className="text-justify font-serif text-[15px] sm:text-[16px] leading-relaxed">
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
    </div>
  );
}