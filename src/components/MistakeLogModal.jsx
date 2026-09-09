import React, { useState } from 'react';
import { AlertTriangle, Trash2, Search, X, CheckCircle, BookOpen } from 'lucide-react';

export default function MistakeLogModal({ isOpen, onClose, mistakes = [], onDeleteMistake, onClearAll }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredMistakes = mistakes.filter(m => {
    const matchesType = selectedType === 'all' || m.type?.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch = !searchQuery ||
      m.original?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.corrected?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.explanation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Sổ Tay Lỗi Sai Thường Gặp (Mistake Log)</h2>
              <p className="text-xs text-slate-400">Ghi nhận các lỗi ngữ pháp & chính tả lặp lại để ôn luyện, tránh tái diễn khi thi thật</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm lỗi sai theo câu hoặc từ..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Tất cả dạng lỗi</option>
              <option value="grammar">Ngữ pháp (Grammar)</option>
              <option value="vocabulary">Từ vựng (Vocabulary)</option>
              <option value="collocation">Cụm từ (Collocation)</option>
              <option value="punctuation">Dấu câu (Punctuation)</option>
            </select>

            {mistakes.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:underline shrink-0 font-medium"
              >
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Mistake Cards */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredMistakes.length > 0 ? (
            filteredMistakes.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                      {m.type || 'Grammar'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Bài: {m.taskTitle || 'IELTS Task'}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteMistake(idx)}
                    className="p-1 text-slate-300 hover:text-red-600 transition-colors"
                    title="Xóa lỗi này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="p-2 rounded bg-red-50/60 border border-red-100 text-red-900">
                    <span className="font-bold text-red-700">Lỗi viết: </span>
                    <strike>{m.original}</strike>
                  </div>
                  <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100 text-emerald-900">
                    <span className="font-bold text-emerald-700">Đã sửa: </span>
                    <strong>{m.corrected}</strong>
                  </div>
                </div>

                {m.explanation && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <em>Giải thích:</em> {m.explanation}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có lỗi sai nào được lưu. Khi giám khảo AI chấm bài, bấm "Lưu vào Sổ tay lỗi sai" ở mỗi câu cần sửa để ghi nhớ!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
