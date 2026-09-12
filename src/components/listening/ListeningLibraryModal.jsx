import React, { useState, useMemo } from 'react';
import { 
  Headphones, 
  Search, 
  Trash2, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Play, 
  AlertTriangle,
  Radio,
  Globe,
  Lock,
  Volume2,
  Bookmark
} from 'lucide-react';

export default function ListeningLibraryModal({
  isOpen,
  onClose,
  allListeningTests = [],
  currentTestId,
  onSelectTest,
  onDeleteTest,
  onOpenGenerator,
  user
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cambridge' | 'ai' | 'community'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = useMemo(() => {
    return allListeningTests.filter(test => {
      // 1. Tab filter
      let matchesTab = true;
      if (activeTab === 'cambridge') {
        matchesTab = !test.isCustom;
      } else if (activeTab === 'ai') {
        matchesTab = Boolean(test.isCustom);
      } else if (activeTab === 'community') {
        matchesTab = Boolean(test.isPublic);
      }

      // 2. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        test.title?.toLowerCase().includes(q) ||
        test.description?.toLowerCase().includes(q) ||
        test.parts?.some(p => 
          p.title?.toLowerCase().includes(q) || 
          p.context?.toLowerCase().includes(q) ||
          p.speakers?.some(s => s.name?.toLowerCase().includes(q) || s.accent?.toLowerCase().includes(q))
        );

      return matchesTab && matchesSearch;
    });
  }, [allListeningTests, activeTab, searchQuery]);

  const stats = {
    total: allListeningTests.length,
    cambridge: allListeningTests.filter(t => !t.isCustom).length,
    ai: allListeningTests.filter(t => t.isCustom).length
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Kho Đề Thi IELTS Listening
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
                  {stats.total} Bộ Đề Sẵn Sàng
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Đề thi chính thức Cambridge & đề hội thoại bản xứ sinh bằng AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Tabs, Search, and Create Button */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Tất Cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('cambridge')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'cambridge' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              📚 Cambridge ({stats.cambridge})
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'ai' ? 'bg-white text-purple-700 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              ✨ AI & URL ({stats.ai})
            </button>
          </div>

          {/* Search and AI Generator Trigger */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên đề, Part, accent giọng đọc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
              />
            </div>

            {onOpenGenerator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGenerator();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sinh Đề Từ URL</span>
                <span className="sm:hidden">Tạo Đề</span>
              </button>
            )}
          </div>

        </div>

        {/* Tests List Grid */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          {filteredTests.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Headphones className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
              <p className="text-sm font-semibold text-slate-600">Không tìm thấy bộ đề nghe nào phù hợp.</p>
              <p className="text-xs text-slate-400">Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút "Sinh Đề Từ URL" để tạo đề mới.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTests.map((test) => {
                const isCurrent = currentTestId === test.id;
                const partCount = test.parts?.length || 4;

                return (
                  <div
                    key={test.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between bg-white relative ${
                      isCurrent
                        ? 'border-purple-500 ring-2 ring-purple-400/30 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Badge Top Line */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            test.isCustom 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {test.isCustom ? '✨ AI Audio Test' : '📚 Cambridge Official'}
                          </span>

                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold">
                              Đang Luyện
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>~{test.timeLimitMinutes || 32} phút</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-2">
                        {test.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                        {test.description}
                      </p>

                      {/* Parts Peek */}
                      <div className="space-y-1.5 mb-4">
                        {test.parts?.slice(0, 3).map((p) => (
                          <div key={p.partNumber} className="text-[11px] text-slate-600 flex items-center space-x-1.5 truncate">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {p.partNumber}
                            </span>
                            <span className="font-medium text-slate-700 truncate">{p.title}</span>
                          </div>
                        ))}
                        {partCount > 3 && (
                          <div className="text-[10px] text-slate-400 pl-5">
                            + thêm {partCount - 3} phần khác (tổng {test.totalQuestions || 40} câu hỏi)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-[11px] font-mono font-semibold">Zero-Storage URL</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {test.isCustom && onDeleteTest && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn xóa đề nghe "${test.title}" không?`)) {
                                onDeleteTest(test.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa đề này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onSelectTest(test);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xs active:scale-95'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tiếp Tục Làm</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Chọn Đề Này</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hỗ trợ URL âm thanh trực tiếp từ Archive.org, BBC, TED, Podcasts • Tự động cách ly nếu link chết
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
