import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Sparkles, 
  X, 
  FileText, 
  CheckCircle2,
  Globe,
  Lock,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function ReadingLibraryModal({
  isOpen,
  onClose,
  allReadingTests = [],
  currentTestId,
  onSelectTest,
  onDeleteTest,
  onTogglePublic,
  user
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cambridge' | 'ai' | 'ingest' | 'public'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = allReadingTests.filter(test => {
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'cambridge') {
      matchesTab = !test.isCustom;
    } else if (activeTab === 'ai') {
      matchesTab = test.isCustom && (test.id.startsWith('custom-test-') && !test.description?.includes('trích xuất từ bài báo'));
    } else if (activeTab === 'ingest') {
      matchesTab = test.isCustom && (test.description?.includes('trích xuất từ bài báo') || test.title?.includes('📰'));
    } else if (activeTab === 'public') {
      matchesTab = Boolean(test.isPublic);
    }

    // Search filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      test.title?.toLowerCase().includes(q) ||
      test.description?.toLowerCase().includes(q) ||
      test.passages?.some(p => p.title?.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: allReadingTests.length,
    cambridge: allReadingTests.filter(t => !t.isCustom).length,
    ai: allReadingTests.filter(t => t.isCustom && !t.description?.includes('trích xuất từ bài báo')).length,
    ingest: allReadingTests.filter(t => t.isCustom && (t.description?.includes('trích xuất từ bài báo') || t.title?.includes('📰'))).length,
    public: allReadingTests.filter(t => t.isPublic).length
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Kho Đề Thi IELTS Reading
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  {stats.total} Đề thi
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý thư viện đề chuẩn Cambridge, đề AI tự sinh theo Passage và đề nạp từ báo
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Tab Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-slate-200/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('cambridge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'cambridge' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Cambridge ({stats.cambridge})
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'ai' 
                  ? 'bg-white text-purple-700 shadow-xs' 
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              ✨ AI Sinh ({stats.ai})
            </button>
            <button
              onClick={() => setActiveTab('ingest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'ingest' 
                  ? 'bg-white text-amber-700 shadow-xs' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              📰 Nạp Từ Báo ({stats.ingest})
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'public' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              🌐 Cộng đồng ({stats.public})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Test Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 divide-y divide-slate-100">
          {filteredTests.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-600">Không tìm thấy bài đọc nào phù hợp</p>
              <p className="text-xs text-slate-400 mt-1">Hãy thử tìm từ khóa khác hoặc chuyển sang tab bộ lọc khác.</p>
            </div>
          ) : (
            filteredTests.map((test) => {
              const isSelected = test.id === currentTestId;
              const passageCount = test.passages?.length || 1;
              const passageNum = test.passages?.[0]?.passageNumber || 1;
              const totalQ = test.totalQuestions || test.passages?.reduce((acc, p) => 
                acc + (p.questionGroups?.reduce((gAcc, g) => gAcc + (g.questions?.length || 0), 0) || 0), 0) || 0;

              return (
                <div
                  key={test.id}
                  className={`pt-3.5 first:pt-0 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border ${
                    isSelected 
                      ? 'bg-blue-50/50 border-blue-300 shadow-2xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  {/* Test Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Passage Tag */}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        passageCount > 1 
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : passageNum === 1
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : passageNum === 2
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {passageCount > 1 ? `Full Test (${passageCount} Passages)` : `Passage ${passageNum}`}
                      </span>

                      {/* Source Badge */}
                      {!test.isCustom ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          Cambridge Academic
                        </span>
                      ) : test.description?.includes('trích xuất từ bài báo') || test.title?.includes('📰') ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          📰 Nạp bài báo
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          ✨ AI Sinh
                        </span>
                      )}

                      {/* Public/Private Badge for Custom */}
                      {test.isCustom && (
                        <button
                          type="button"
                          onClick={() => onTogglePublic && onTogglePublic(test.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-colors ${
                            test.isPublic 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Bấm để chuyển đổi trạng thái Công khai / Riêng tư"
                        >
                          {test.isPublic ? (
                            <>
                              <Globe className="w-3 h-3 text-emerald-600" />
                              <span>Cộng đồng</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-slate-500" />
                              <span>Riêng tư</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Current Active Badge */}
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Đang chọn
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {test.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {test.description || 'Đề thi trắc nghiệm và điền từ theo chuẩn IELTS Reading.'}
                    </p>

                    {/* Metadata: Questions & Time */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        {totalQ} câu hỏi
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {test.timeLimitMinutes || (passageCount > 1 ? 60 : 20)} phút
                      </span>
                      {test.creatorEmail && (
                        <span className="text-slate-400">
                          Tạo bởi: <span className="text-slate-600">{test.creatorEmail}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {test.isCustom && onDeleteTest && (
                      <button
                        onClick={() => onDeleteTest(test.id)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa đề thi này khỏi danh sách cá nhân"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectTest(test.id);
                        onClose();
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                      }`}
                    >
                      {isSelected ? 'Đang làm bài' : 'Làm đề này'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            💡 Mẹo: Bạn có thể bấm <strong className="text-blue-600">"Sinh Đề Mới"</strong> để AI tạo thêm các Passage 1, 2, 3 tùy chỉnh theo 12 chủ đề.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
