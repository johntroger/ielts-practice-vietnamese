import React, { useState } from 'react';
import { Sparkles, Copy, Check, Search, BookMarked } from 'lucide-react';
import { lookupSynonyms, ACADEMIC_THESAURUS } from '../data/academicThesaurus';

export default function QuickParaphraseModal({ isOpen, onClose, initialWord, onSaveToNotebook }) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState(initialWord || 'increase');
  const [copiedWord, setCopiedWord] = useState('');

  const synonyms = lookupSynonyms(searchTerm);

  const handleCopy = (word) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(''), 2000);
  };

  const commonWords = Object.keys(ACADEMIC_THESAURUS);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Từ Điển Paraphrase Học Thuật</h3>
              <p className="text-xs text-slate-500">Tìm từ đồng nghĩa Band 7.5+ thay thế cho các từ thông dụng</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Gõ từ cần tìm (vd: increase, problem, important...)"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
          />
        </div>

        {/* Quick pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Gợi ý nhanh:</span>
          {commonWords.slice(0, 7).map(w => (
            <button
              key={w}
              onClick={() => setSearchTerm(w)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                searchTerm.toLowerCase() === w 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {synonyms.length > 0 ? (
            synonyms.map((s, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-red-200 transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                      {s.word}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-[10px] font-semibold text-slate-600 uppercase">
                      {s.type}
                    </span>
                    <span className="text-xs text-slate-500 italic">
                      — {s.meaningVi}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopy(s.word)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Copy từ này"
                    >
                      {copiedWord === s.word ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {onSaveToNotebook && (
                      <button
                        onClick={() => onSaveToNotebook({ phrase: s.word, meaningVi: s.meaningVi, example: s.example })}
                        className="p-1 text-slate-400 hover:text-amber-600 rounded transition-colors"
                        title="Lưu vào sổ từ vựng"
                      >
                        <BookMarked className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                  "{s.example}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Chưa có dữ liệu cho từ này. Thử chọn các từ gợi ý nhanh ở trên!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
