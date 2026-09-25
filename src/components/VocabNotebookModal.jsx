import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  Search, 
  X, 
  Sparkles, 
  BookOpen, 
  Brain, 
  RotateCw, 
  Check, 
  Clock, 
  Award,
  Layers
} from 'lucide-react';
import { IELTS_TOPICS } from '../data/topics';
import { 
  getDueItems, 
  calculateNextReview, 
  initSrsItem, 
  SRS_GRADES 
} from '../utils/srsService';

export default function VocabNotebookModal({
  isOpen,
  onClose,
  vocabList = [],
  onAddVocab,
  onDeleteVocab,
  onClearAll,
  onUpdateVocab
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'srs'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [phrase, setPhrase] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [example, setExample] = useState('');
  const [topic, setTopic] = useState('tech');

  // Flashcard SRS State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedSessionCount, setReviewedSessionCount] = useState(0);

  // Compute due cards
  const dueItems = getDueItems(vocabList);
  const currentCard = dueItems[currentCardIndex] || null;

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
    const newVocab = initSrsItem({
      id: `vocab-${Date.now()}`,
      phrase: phrase.trim(),
      meaningVi: meaningVi.trim(),
      example: example.trim(),
      topic,
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    onAddVocab(newVocab);
    setPhrase('');
    setMeaningVi('');
    setExample('');
    setIsAdding(false);
  };

  const handleRateCard = (grade) => {
    if (!currentCard) return;
    const updated = calculateNextReview(currentCard, grade);
    if (onUpdateVocab) {
      onUpdateVocab(updated);
    } else if (onAddVocab) {
      // Fallback update if onUpdateVocab not explicitly provided
      onAddVocab(updated);
    }
    setReviewedSessionCount(prev => prev + 1);
    setIsFlipped(false);
    if (currentCardIndex >= dueItems.length - 1) {
      setCurrentCardIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-xl font-bold truncate">Sổ Tay Từ Vựng Vàng (Vocab Vault)</h2>
                {dueItems.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse shrink-0">
                    {dueItems.length} cần ôn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Hệ thống lặp lại ngắt quãng (Spaced Repetition SM-2) bồi dưỡng từ vựng C1/C2</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (List vs Flashcard SRS) */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100 px-3 sm:px-5 pt-2 shrink-0 space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 border-t-2 border-amber-500 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Danh Sách Từ Vựng ({vocabList.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('srs');
              setIsFlipped(false);
              setCurrentCardIndex(0);
            }}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'srs'
                ? 'bg-white text-red-600 border-t-2 border-red-500 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-red-500" />
            <span>Ôn Luyện Flashcard SM-2</span>
            {dueItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-black">
                {dueItems.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: TRUYỀN THỐNG (LIST VIEW) */}
        {activeTab === 'list' && (
          <>
            {/* Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
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
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả chủ đề</option>
                  {IELTS_TOPICS.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAdding ? 'Đóng' : 'Thêm Từ'}</span>
                </button>
              </div>
            </div>

            {/* Vocab List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {isAdding && (
                <form onSubmit={handleCreateVocab} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 shadow-2xs mb-4">
                  <div className="font-bold text-xs text-amber-900">Thêm Từ Vựng Mới Vào Sổ Tay</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Cụm từ tiếng Anh (Collocation)..."
                      value={phrase}
                      onChange={e => setPhrase(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Nghĩa tiếng Việt..."
                      value={meaningVi}
                      onChange={e => setMeaningVi(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Ví dụ trong ngữ cảnh bài viết IELTS..."
                    value={example}
                    onChange={e => setExample(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-amber-200 text-xs bg-white text-slate-700"
                    >
                      {IELTS_TOPICS.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Lưu Từ Vựng
                    </button>
                  </div>
                </form>
              )}

              {filteredVocabs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredVocabs.map((v, idx) => (
                    <div key={v.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5 group hover:border-amber-300 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                          {v.phrase}
                        </span>
                        <div className="flex items-center space-x-1">
                          {v.intervalDays > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-bold" title={`Chu kỳ ôn: ${v.intervalDays} ngày`}>
                              {v.intervalDays}d
                            </span>
                          )}
                          <button
                            onClick={() => onDeleteVocab(v.id || idx)}
                            className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
                            title="Xóa từ này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
          </>
        )}

        {/* TAB 2: CHẾ ĐỘ ÔN TẬP FLASHCARD SM-2 */}
        {activeTab === 'srs' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center space-y-6">
            {dueItems.length > 0 && currentCard ? (
              <div className="w-full max-w-md space-y-5">
                
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Thẻ ôn tập {currentCardIndex + 1} / {dueItems.length}</span>
                  <span className="text-emerald-600 font-bold">Đã ôn phiên này: {reviewedSessionCount}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all"
                    style={{ width: `${((currentCardIndex + 1) / dueItems.length) * 100}%` }}
                  />
                </div>

                {/* Flashcard Box */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[220px] p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl flex flex-col items-center justify-center text-center cursor-pointer border border-slate-700 hover:border-amber-500/50 transition-all select-none space-y-3 relative group"
                >
                  <div className="absolute top-3 right-3 text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                    <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                    <span>Nhấp để lật</span>
                  </div>

                  {!isFlipped ? (
                    <>
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        Collocation / Thuật Ngữ
                      </div>
                      <div className="text-2xl font-black text-white tracking-wide px-4">
                        {currentCard.phrase}
                      </div>
                      <p className="text-xs text-slate-400 pt-2">
                        (Thử nhớ nghĩa tiếng Việt và cách dùng trong IELTS...)
                      </p>
                    </>
                  ) : (
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                        Ý Nghĩa & Ngữ Cảnh
                      </div>
                      <div className="text-xl font-bold text-amber-300">
                        {currentCard.meaningVi}
                      </div>
                      {currentCard.example && (
                        <div className="text-xs text-slate-300 italic bg-white/10 p-2.5 rounded-xl border border-white/10 max-w-sm">
                          "{currentCard.example}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* SRS Rating Actions (Only visible when card is flipped) */}
                {isFlipped ? (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Đánh giá mức độ ghi nhớ của bạn:
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleRateCard(SRS_GRADES.AGAIN)}
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-center transition-all cursor-pointer font-bold text-xs"
                      >
                        <span className="block text-sm">🔴</span>
                        <span>Quên</span>
                        <span className="block text-[9px] text-red-500 font-normal">1 ngày</span>
                      </button>

                      <button
                        onClick={() => handleRateCard(SRS_GRADES.HARD)}
                        className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-center transition-all cursor-pointer font-bold text-xs"
                      >
                        <span className="block text-sm">🟡</span>
                        <span>Khó</span>
                        <span className="block text-[9px] text-amber-500 font-normal">2-3 ngày</span>
                      </button>

                      <button
                        onClick={() => handleRateCard(SRS_GRADES.GOOD)}
                        className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-center transition-all cursor-pointer font-bold text-xs"
                      >
                        <span className="block text-sm">🟢</span>
                        <span>Tốt</span>
                        <span className="block text-[9px] text-emerald-500 font-normal">4-7 ngày</span>
                      </button>

                      <button
                        onClick={() => handleRateCard(SRS_GRADES.EASY)}
                        className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-center transition-all cursor-pointer font-bold text-xs"
                      >
                        <span className="block text-sm">🔵</span>
                        <span>Rất Dễ</span>
                        <span className="block text-[9px] text-blue-500 font-normal">10+ ngày</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400">
                    Bấm vào thẻ bài ở trên để xem đáp án trước khi đánh giá mức độ nhớ.
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-10 space-y-3 max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  🎉
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Hoàn Thành Ôn Tập Hôm Nay!
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tất cả {vocabList.length} từ vựng trong sổ tay đều đã được xếp lịch ôn tập khoa học. Hãy quay lại vào ngày mai theo chu kỳ Spaced Repetition!
                </p>
                <button
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Xem Danh Sách Từ Vựng
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
