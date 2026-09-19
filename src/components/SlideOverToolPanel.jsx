import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  Lightbulb, 
  X, 
  Search, 
  Copy, 
  Check, 
  Plus, 
  ArrowRight, 
  BookMarked,
  Layers
} from 'lucide-react';
import { lookupSynonyms, ACADEMIC_THESAURUS } from '../data/academicThesaurus';
import { IELTS_TOPICS } from '../data/topics';

export default function SlideOverToolPanel({
  isOpen,
  onClose,
  initialTab = 'paraphrase',
  vocabList = [],
  onInsertText,
  onSaveToNotebook,
  promptText = '',
  onAddVocab
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('important');
  const [copiedWord, setCopiedWord] = useState('');
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isAddingVocab, setIsAddingVocab] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

  const synonyms = lookupSynonyms(searchTerm);
  const commonWords = Object.keys(ACADEMIC_THESAURUS);

  const handleCopy = (word) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(''), 1800);
  };

  const handleInsert = (text) => {
    if (onInsertText) {
      onInsertText(text);
    }
  };

  const filteredVocabs = vocabList.filter(v => {
    const matchesTopic = selectedTopic === 'all' || v.topic === selectedTopic;
    const matchesSearch = !vocabSearch ||
      v.phrase?.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      v.meaningVi?.toLowerCase().includes(vocabSearch.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newPhrase.trim() || !newMeaning.trim()) return;
    if (onAddVocab) {
      onAddVocab({
        id: `vocab-${Date.now()}`,
        phrase: newPhrase.trim(),
        meaningVi: newMeaning.trim(),
        example: '',
        topic: 'tech',
        createdAt: new Date().toLocaleDateString('vi-VN')
      });
    }
    setNewPhrase('');
    setNewMeaning('');
    setIsAddingVocab(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-slate-200">
          
          {/* Top Panel Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Trợ Lý Viết Cạnh Bài (Side Panel)</h3>
                <p className="text-[11px] text-slate-400">Tra cứu từ vựng & paraphrase không làm ngắt quãng bài viết</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng bảng công cụ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-200 bg-slate-100 px-3 pt-2 shrink-0 space-x-1">
            <button
              onClick={() => setActiveTab('paraphrase')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'paraphrase'
                  ? 'bg-white text-red-600 border-t-2 border-red-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Paraphrase</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'vocab'
                  ? 'bg-white text-amber-600 border-t-2 border-amber-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Sổ Từ Vựng ({vocabList.length})</span>
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* TAB 1: PARAPHRASE */}
            {activeTab === 'paraphrase' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Gõ từ cần tìm (vd: important, increase, problem)..."
                    className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
                  />
                </div>

                {/* Quick pills */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-slate-400">Gợi ý nhanh:</span>
                  {commonWords.slice(0, 8).map(w => (
                    <button
                      key={w}
                      onClick={() => setSearchTerm(w)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        searchTerm.toLowerCase() === w
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                {/* Synonyms list */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Từ Đồng Nghĩa Học Thuật Band 7.5+ Cho "{searchTerm}"
                  </div>

                  {synonyms.length > 0 ? (
                    <div className="space-y-2">
                      {synonyms.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all space-y-1.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-slate-900">{item.word}</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                {item.band || 'Band 7.5+'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => handleCopy(item.word)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1"
                                title="Sao chép từ"
                              >
                                {copiedWord === item.word ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[10px] text-emerald-600">Đã chép</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-[10px]">Chép</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleInsert(item.word)}
                                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                                title="Chèn trực tiếp từ này vào cuối bài viết"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span className="text-[10px]">Chèn vào bài</span>
                              </button>
                            </div>
                          </div>
                          {item.meaningVi && (
                            <div className="text-xs text-slate-600 font-medium">{item.meaningVi}</div>
                          )}
                          {item.collocation && (
                            <div className="text-[11px] text-slate-500 italic bg-slate-100/70 p-1.5 rounded-lg">
                              Ví dụ: "{item.collocation}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      Chưa có từ đồng nghĩa nâng cao cho từ này. Thử tìm từ khác như: <span className="font-semibold text-slate-600">improve, reduce, increase, danger, solution</span>.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: VOCAB NOTEBOOK */}
            {activeTab === 'vocab' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 mr-2">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={vocabSearch}
                      onChange={(e) => setVocabSearch(e.target.value)}
                      placeholder="Tìm trong sổ từ..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => setIsAddingVocab(!isAddingVocab)}
                    className="px-2.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-2xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Từ</span>
                  </button>
                </div>

                {isAddingVocab && (
                  <form onSubmit={handleQuickAdd} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <input
                      type="text"
                      value={newPhrase}
                      onChange={(e) => setNewPhrase(e.target.value)}
                      placeholder="Cụm từ tiếng Anh..."
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs bg-white font-semibold"
                    />
                    <input
                      type="text"
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      placeholder="Nghĩa tiếng Việt..."
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs bg-white"
                    />
                    <div className="flex justify-end space-x-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingVocab(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  </form>
                )}

                {/* Filter by topic */}
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar text-xs">
                  <button
                    onClick={() => setSelectedTopic('all')}
                    className={`px-2 py-0.5 rounded-lg font-bold shrink-0 cursor-pointer ${
                      selectedTopic === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  {Object.entries(IELTS_TOPICS).slice(0, 5).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTopic(key)}
                      className={`px-2 py-0.5 rounded-lg font-bold shrink-0 cursor-pointer ${
                        selectedTopic === key ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {val.name}
                    </button>
                  ))}
                </div>

                {/* Vocab cards list */}
                <div className="space-y-2">
                  {filteredVocabs.length > 0 ? (
                    filteredVocabs.map((v, idx) => (
                      <div
                        key={v.id || idx}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-all space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{v.phrase}</span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleCopy(v.phrase)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                              title="Sao chép cụm từ"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleInsert(v.phrase)}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 cursor-pointer flex items-center space-x-1"
                              title="Chèn cụm từ vào bài"
                            >
                              <ArrowRight className="w-3 h-3" />
                              <span>Chèn</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-600">{v.meaningVi}</div>
                        {v.example && (
                          <div className="text-[10px] text-slate-400 italic">Ví dụ: {v.example}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      Chưa có từ vựng nào trong danh mục này. Hãy thêm từ vựng mới hoặc lưu từ bài chấm điểm!
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Footer status */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 shrink-0">
            Bấm <strong>"Chèn vào bài"</strong> để tự động chèn cụm từ học thuật vào bài viết dở dang của bạn.
          </div>

        </div>
      </div>
    </div>
  );
}
