import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Plus, 
  X, 
  Bookmark, 
  BookOpen, 
  Zap, 
  Copy,
  Lightbulb
} from 'lucide-react';
import { findLexicalUpgrades } from '../data/academicThesaurus';

/**
 * In-Situ Lexical Upgrader Component
 * Floating/Docked real-time widget for instant C1/C2 academic vocabulary replacement.
 * Empowers students to replace common/overused words with native academic collocations in 1 click.
 */
export default function InSituLexicalUpgrader({
  selectedWord = '',
  onReplaceText,
  onSaveToNotebook,
  onClose,
  inline = false
}) {
  const [copiedWord, setCopiedWord] = useState('');
  const [savedWord, setSavedWord] = useState('');
  const [replacedWord, setReplacedWord] = useState('');

  if (!selectedWord) return null;

  const upgradeData = findLexicalUpgrades(selectedWord);
  const suggestions = upgradeData?.suggestions || [];

  const handleApplyReplacement = (newWord) => {
    if (onReplaceText) {
      onReplaceText(selectedWord, newWord);
      setReplacedWord(newWord);
      setTimeout(() => {
        setReplacedWord('');
        if (onClose) onClose();
      }, 900);
    }
  };

  const handleSaveNotebook = (item) => {
    if (onSaveToNotebook) {
      onSaveToNotebook({
        id: `vocab-${Date.now()}`,
        phrase: item.word,
        meaningVi: item.meaningVi,
        example: item.example,
        topic: 'writing-upgrade',
        createdAt: new Date().toLocaleDateString('vi-VN')
      });
      setSavedWord(item.word);
      setTimeout(() => setSavedWord(''), 1800);
    }
  };

  const handleCopy = (word) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(''), 1500);
  };

  return (
    <div className={`rounded-xl border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left ${
      inline 
        ? 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border-amber-300 p-3' 
        : 'bg-white border-indigo-200 p-3.5 max-w-md w-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-amber-100 text-amber-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Nâng cấp từ vựng C1/C2:
              </span>
              <span className="text-xs font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                "{selectedWord}"
              </span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng bảng gợi ý"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content Area */}
      {suggestions.length > 0 ? (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Chọn để thay thế trực tiếp vào bài (1-Click Replace):
          </span>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-300 transition-all text-xs flex flex-col space-y-1 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-indigo-950 group-hover:text-amber-900 text-xs sm:text-[13px]">
                      {item.word}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-indigo-100/70 text-indigo-700 border border-indigo-200/50">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* 1-Click Replace Button */}
                    <button
                      onClick={() => handleApplyReplacement(item.word)}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs ${
                        replacedWord === item.word
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                      }`}
                      title={`Thay thế "${selectedWord}" bằng "${item.word}"`}
                    >
                      {replacedWord === item.word ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>Đã thay!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>Thay từ này</span>
                        </>
                      )}
                    </button>

                    {/* Save to Notebook Button */}
                    {onSaveToNotebook && (
                      <button
                        onClick={() => handleSaveNotebook(item)}
                        className="p-1 rounded-md border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50 text-slate-500 hover:text-amber-800 transition-colors cursor-pointer"
                        title="Lưu vào Sổ tay Từ Vựng"
                      >
                        {savedWord === item.word ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Bookmark className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(item.word)}
                      className="p-1 rounded-md border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Sao chép từ này"
                    >
                      {copiedWord === item.word ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Meaning in Vietnamese */}
                <p className="text-[11px] text-slate-700 font-medium">
                  {item.meaningVi}
                </p>

                {/* IELTS Example Sentence */}
                {item.example && (
                  <p className="text-[10px] text-slate-500 font-serif italic pt-0.5 border-t border-slate-200/50">
                    "{item.example}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 text-center space-y-1.5 bg-slate-50 rounded-lg text-xs text-slate-600">
          <p>
            Chưa tìm thấy từ đồng nghĩa C1/C2 có sẵn cho từ <strong>"{selectedWord}"</strong>.
          </p>
          <p className="text-[11px] text-slate-400">
            Mẹo: Hãy thử bôi đen các từ gốc phổ biến như: <em>important, problem, increase, decrease, crime, technology, money, solve, good, bad</em>...
          </p>
        </div>
      )}
    </div>
  );
}
