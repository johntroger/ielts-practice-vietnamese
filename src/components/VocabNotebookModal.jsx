import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, Search, X, Sparkles, BookOpen } from 'lucide-react';
import { IELTS_TOPICS } from '../data/topics';

export default function VocabNotebookModal({
  isOpen,
  onClose,
  vocabList = [],
  onAddVocab,
  onDeleteVocab,
  onClearAll
}) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [phrase, setPhrase] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [example, setExample] = useState('');
  const [topic, setTopic] = useState('tech');

  const filteredVocabs = vocabList.filter(v => {
    const matchesTopic = selectedTopic === 'all' || v.topic === selectedTopic;
    const matchesSearch = !searchQuery ||
      v.phrase?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaningVi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.example?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleCreateVocab = (e) => {
    e.preventDefault();
    if (!phrase.trim() || !meaningVi.trim()) return;
    onAddVocab({
      id: `vocab-${Date.now()}`,
      phrase: phrase.trim(),
      meaningVi: meaningVi.trim(),
      example: example.trim(),
      topic,
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    setPhrase('');
    setMeaningVi('');
    setExample('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Sổ Tay Từ Vựng Vàng (Vocabulary Notebook)</h2>
              <p className="text-xs text-slate-400">Tích lũy các Collocations & Cụm từ học thuật C1/C2 qua từng bài viết</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm từ vựng hoặc nghĩa tiếng Việt..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Tất cả chủ đề</option>
              {IELTS_TOPICS.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Đóng' : 'Thêm Từ'}</span>
            </button>
          </div>
        </div>

        {/* Vocab List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          
          {/* Add Manual Form */}
          {isAdding && (
            <form onSubmit={handleCreateVocab} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3 mb-4">
              <h4 className="font-bold text-xs text-amber-900">Thêm Từ Vựng / Cụm Từ Mới:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="Cụm từ tiếng Anh (vd: catalyze novel industries)"
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={meaningVi}
                  onChange={(e) => setMeaningVi(e.target.value)}
                  placeholder="Ý nghĩa tiếng Việt (vd: thúc đẩy các ngành mới)"
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Câu ví dụ áp dụng vào bài thi (tùy chọn)..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
                >
                  Lưu Vào Sổ
                </button>
              </div>
            </form>
          )}

          {/* Cards */}
          {filteredVocabs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredVocabs.map((v, idx) => (
                <div key={v.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {v.phrase}
                    </span>
                    <button
                      onClick={() => onDeleteVocab(v.id || idx)}
                      className="p-1 text-slate-300 hover:text-red-600 transition-colors"
                      title="Xóa từ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {v.meaningVi}
                  </p>

                  {v.example && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                      "{v.example}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có từ vựng nào trong sổ. Hãy tra từ điển Paraphrase hoặc bấm lưu từ bài mẫu và nhận xét của giám khảo AI!
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
