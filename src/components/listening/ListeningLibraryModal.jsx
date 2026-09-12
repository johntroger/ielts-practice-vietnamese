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
  Bookmark,
  Puzzle,
  Dices,
  ChevronRight
} from 'lucide-react';
import { 
  extractListeningPartBank, 
  assembleFullListeningTest, 
  createRandomFullListeningTest 
} from '../../utils/listeningTestAssembler';

export default function ListeningLibraryModal({
  isOpen,
  onClose,
  allListeningTests = [],
  currentTestId,
  onSelectTest,
  onDeleteTest,
  onAddCustomTest,
  onOpenGenerator,
  user
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cambridge' | 'ai' | 'assembled' | 'part1' | 'part2' | 'part3' | 'part4'
  const [searchQuery, setSearchQuery] = useState('');

  // Exam Assembler States
  const [isAssemblerOpen, setIsAssemblerOpen] = useState(false);
  const [selectedP1Key, setSelectedP1Key] = useState('');
  const [selectedP2Key, setSelectedP2Key] = useState('');
  const [selectedP3Key, setSelectedP3Key] = useState('');
  const [selectedP4Key, setSelectedP4Key] = useState('');
  const [assembledTitle, setAssembledTitle] = useState('');
  const [assemblerError, setAssemblerError] = useState('');

  // Bank of available Parts across all tests
  const partBank = useMemo(() => {
    return extractListeningPartBank(allListeningTests);
  }, [allListeningTests]);

  const p1List = useMemo(() => partBank.filter(p => p.partNumber === 1), [partBank]);
  const p2List = useMemo(() => partBank.filter(p => p.partNumber === 2), [partBank]);
  const p3List = useMemo(() => partBank.filter(p => p.partNumber === 3), [partBank]);
  const p4List = useMemo(() => partBank.filter(p => p.partNumber === 4), [partBank]);

  // Handlers for Assembler
  const handleManualAssemble = () => {
    setAssemblerError('');
    if (!selectedP1Key || !selectedP2Key || !selectedP3Key || !selectedP4Key) {
      setAssemblerError('Vui lòng chọn đủ 4 phần (Part 1, Part 2, Part 3, Part 4) để ghép đề hoàn chỉnh.');
      return;
    }

    const b1 = partBank.find(p => p.partKey === selectedP1Key);
    const b2 = partBank.find(p => p.partKey === selectedP2Key);
    const b3 = partBank.find(p => p.partKey === selectedP3Key);
    const b4 = partBank.find(p => p.partKey === selectedP4Key);

    const assembled = assembleFullListeningTest({
      builderP1: b1,
      builderP2: b2,
      builderP3: b3,
      builderP4: b4,
      customTitle: assembledTitle,
      userEmail: user?.email
    });

    if (assembled) {
      if (onAddCustomTest) {
        onAddCustomTest(assembled);
      } else {
        onSelectTest(assembled);
      }
      setIsAssemblerOpen(false);
      onClose();
    }
  };

  const handleRandomAssemble = () => {
    setAssemblerError('');
    const randomTest = createRandomFullListeningTest({
      allListeningTests,
      userEmail: user?.email
    });

    if (!randomTest) {
      setAssemblerError('Không đủ dữ liệu Part để ghép ngẫu nhiên. Cần tối thiểu ít nhất 1 bài cho mỗi Part (1, 2, 3, 4).');
      return;
    }

    if (onAddCustomTest) {
      onAddCustomTest(randomTest);
    } else {
      onSelectTest(randomTest);
    }
    setIsAssemblerOpen(false);
    onClose();
  };

  const filteredTests = useMemo(() => {
    return allListeningTests.filter(test => {
      // 1. Tab filter
      let matchesTab = true;
      if (activeTab === 'cambridge') {
        matchesTab = !test.isCustom;
      } else if (activeTab === 'ai') {
        matchesTab = Boolean(test.isCustom) && !test.isAssembled;
      } else if (activeTab === 'assembled') {
        matchesTab = Boolean(test.isAssembled);
      } else if (activeTab === 'part1') {
        matchesTab = test.targetPart === 1 || test.parts?.[0]?.partNumber === 1;
      } else if (activeTab === 'part2') {
        matchesTab = test.targetPart === 2 || test.parts?.[0]?.partNumber === 2;
      } else if (activeTab === 'part3') {
        matchesTab = test.targetPart === 3 || test.parts?.[0]?.partNumber === 3;
      } else if (activeTab === 'part4') {
        matchesTab = test.targetPart === 4 || test.parts?.[0]?.partNumber === 4;
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
    ai: allListeningTests.filter(t => t.isCustom && !t.isAssembled).length,
    assembled: allListeningTests.filter(t => t.isAssembled).length,
    p1: allListeningTests.filter(t => t.targetPart === 1 || t.parts?.[0]?.partNumber === 1).length,
    p2: allListeningTests.filter(t => t.targetPart === 2 || t.parts?.[0]?.partNumber === 2).length,
    p3: allListeningTests.filter(t => t.targetPart === 3 || t.parts?.[0]?.partNumber === 3).length,
    p4: allListeningTests.filter(t => t.targetPart === 4 || t.parts?.[0]?.partNumber === 4).length,
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
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto scrollbar-none max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Tất Cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('cambridge')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'cambridge' ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              📚 Cambridge ({stats.cambridge})
            </button>
            <button
              onClick={() => setActiveTab('assembled')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'assembled' ? 'bg-white text-purple-900 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              🧩 Đã Ghép ({stats.assembled})
            </button>
            <button
              onClick={() => setActiveTab('part1')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'part1' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Part 1 ({stats.p1})
            </button>
            <button
              onClick={() => setActiveTab('part2')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'part2' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Part 2 ({stats.p2})
            </button>
            <button
              onClick={() => setActiveTab('part3')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'part3' ? 'bg-white text-purple-700 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Part 3 ({stats.p3})
            </button>
            <button
              onClick={() => setActiveTab('part4')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'part4' ? 'bg-white text-amber-800 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Part 4 ({stats.p4})
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

            {/* 1-Click Auto Random Mix */}
            <button
              onClick={handleRandomAssemble}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all cursor-pointer shrink-0 shadow-2xs"
              title="Tự động chọn ngẫu nhiên 4 Part để tạo 1 đề thi thử Full 40 câu hoàn chỉnh"
            >
              <Dices className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">🎲 Ghép Nhanh 1 Đề</span>
            </button>

            {/* Manual Assembler Toggle */}
            <button
              onClick={() => setIsAssemblerOpen(!isAssemblerOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 shadow-2xs ${
                isAssemblerOpen 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
              }`}
              title="Tự chọn 4 Part từ ngân hàng đề để lắp ráp thành 1 đề thi 40 câu"
            >
              <Puzzle className="w-3.5 h-3.5 text-purple-600" />
              <span>🧩 Ghép Đề 4 Part</span>
            </button>

            {onOpenGenerator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGenerator();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sinh Đề Mới</span>
                <span className="sm:hidden">Tạo Đề</span>
              </button>
            )}
          </div>

        </div>

        {/* EXAM ASSEMBLER PANEL IF OPEN */}
        {isAssemblerOpen && (
          <div className="px-5 py-3.5 bg-gradient-to-r from-purple-50/90 to-indigo-50/90 border-b border-purple-200 animate-in fade-in space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Puzzle className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wide">
                  Lắp Ghép Đề Thi Full 4 Parts (40 Câu • ~32 Phút)
                </h4>
              </div>
              <span className="text-[11px] text-purple-700 font-medium">
                Chọn 1 bài cho mỗi Part từ ngân hàng đề của bạn:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Part 1 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Part 1 (Hội thoại)</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p1List.length} bài</span>
                </label>
                <select
                  value={selectedP1Key}
                  onChange={(e) => setSelectedP1Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">-- Chọn bài Part 1 --</option>
                  {p1List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Part 2 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Part 2 (Độc thoại)</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p2List.length} bài</span>
                </label>
                <select
                  value={selectedP2Key}
                  onChange={(e) => setSelectedP2Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">-- Chọn bài Part 2 --</option>
                  {p2List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Part 3 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Part 3 (Thảo luận)</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p3List.length} bài</span>
                </label>
                <select
                  value={selectedP3Key}
                  onChange={(e) => setSelectedP3Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">-- Chọn bài Part 3 --</option>
                  {p3List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Part 4 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Part 4 (Bài giảng)</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p4List.length} bài</span>
                </label>
                <select
                  value={selectedP4Key}
                  onChange={(e) => setSelectedP4Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">-- Chọn bài Part 4 --</option>
                  {p4List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom title & Confirm Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <input
                type="text"
                placeholder="Tên đề thi tùy chỉnh (Ví dụ: Cambridge Practice Full Test 01)..."
                value={assembledTitle}
                onChange={(e) => setAssembledTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setIsAssemblerOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  onClick={handleManualAssemble}
                  disabled={!selectedP1Key || !selectedP2Key || !selectedP3Key || !selectedP4Key}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>Hoàn Tất Ghép Đề (40 Câu)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {assemblerError && (
              <p className="text-[11px] font-bold text-rose-600 animate-in fade-in">
                ⚠️ {assemblerError}
              </p>
            )}
          </div>
        )}

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
