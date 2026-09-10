import React, { useState, useMemo } from 'react';
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
  HelpCircle,
  Shuffle,
  PlusCircle,
  ArrowRight,
  Check
} from 'lucide-react';

export default function ReadingLibraryModal({
  isOpen,
  onClose,
  allReadingTests = [],
  currentTestId,
  onSelectTest,
  onDeleteTest,
  onTogglePublic,
  onCreateFullTest,
  user
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cambridge' | 'ai' | 'ingest' | 'public' | 'custom_builder'
  const [searchQuery, setSearchQuery] = useState('');

  // Builder state for selecting 3 passages
  const [builderP1, setBuilderP1] = useState(null); // { testId, passage }
  const [builderP2, setBuilderP2] = useState(null);
  const [builderP3, setBuilderP3] = useState(null);
  const [customTestTitle, setCustomTestTitle] = useState('');

  // Extract all single passages available in the bank
  const passageBank = useMemo(() => {
    const list = [];
    allReadingTests.forEach(t => {
      if (t.passages && t.passages.length > 0) {
        t.passages.forEach(p => {
          const qCount = p.questionGroups?.reduce((acc, g) => acc + (g.questions?.length || 0), 0) || 0;
          list.push({
            passageKey: `${t.id}-${p.id || p.passageNumber}-${p.title}`,
            testId: t.id,
            testTitle: t.title,
            testIsCustom: t.isCustom,
            passage: p,
            originalPassageNum: p.passageNumber || 1,
            qCount
          });
        });
      }
    });
    return list;
  }, [allReadingTests]);

  // Pool of passages categorized by ideal position or overall
  const p1Pool = useMemo(() => passageBank.filter(item => item.originalPassageNum === 1), [passageBank]);
  const p2Pool = useMemo(() => passageBank.filter(item => item.originalPassageNum === 2), [passageBank]);
  const p3Pool = useMemo(() => passageBank.filter(item => item.originalPassageNum === 3), [passageBank]);

  // Helper to re-index questions for a passage
  const reindexPassage = (originalPassage, targetPassageNum, startOrder) => {
    let curOrder = startOrder;
    const newGroups = (originalPassage.questionGroups || []).map((g, gIdx) => {
      const newQuestions = (g.questions || []).map((q, qIdx) => {
        const updatedQ = {
          ...q,
          order: curOrder,
          id: `p${targetPassageNum}-q-${curOrder}`
        };
        curOrder++;
        return updatedQ;
      });

      // Update group title Questions X–Y
      const firstQ = newQuestions[0]?.order;
      const lastQ = newQuestions[newQuestions.length - 1]?.order;
      const updatedTitle = firstQ && lastQ 
        ? (firstQ === lastQ ? `Question ${firstQ}` : `Questions ${firstQ}–${lastQ}`)
        : g.title;

      // Update instruction if it mentions boxes/questions range
      let updatedInstruction = g.instruction || '';
      if (firstQ && lastQ && updatedInstruction) {
        updatedInstruction = updatedInstruction.replace(/boxes \d+[–-]\d+/gi, `boxes ${firstQ}–${lastQ}`);
        updatedInstruction = updatedInstruction.replace(/Questions \d+[–-]\d+/gi, `Questions ${firstQ}–${lastQ}`);
      }

      return {
        ...g,
        id: `qg-${targetPassageNum}-${gIdx + 1}`,
        title: updatedTitle,
        instruction: updatedInstruction,
        questions: newQuestions
      };
    });

    return {
      ...originalPassage,
      passageNumber: targetPassageNum,
      id: `p${targetPassageNum}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      questionGroups: newGroups
    };
  };

  // Handler: Randomize 3 passages
  const handleRandomize3Passages = () => {
    const pickRandom = (pool, fallbackPool) => {
      const source = pool.length > 0 ? pool : fallbackPool;
      if (source.length === 0) return null;
      const idx = Math.floor(Math.random() * source.length);
      return source[idx];
    };

    const chosen1 = pickRandom(p1Pool, passageBank);
    const remFor2 = passageBank.filter(item => item.passageKey !== chosen1?.passageKey);
    const chosen2 = pickRandom(p2Pool.filter(item => item.passageKey !== chosen1?.passageKey), remFor2);
    const remFor3 = passageBank.filter(item => item.passageKey !== chosen1?.passageKey && item.passageKey !== chosen2?.passageKey);
    const chosen3 = pickRandom(p3Pool.filter(item => item.passageKey !== chosen1?.passageKey && item.passageKey !== chosen2?.passageKey), remFor3);

    setBuilderP1(chosen1);
    setBuilderP2(chosen2);
    setBuilderP3(chosen3);
    setCustomTestTitle(`IELTS Full Reading Test: ${new Date().toLocaleDateString('vi-VN')} (Ngẫu Nhiên)`);
  };

  // Handler: Assemble and build the full test
  const handleAssembleTest = () => {
    if (!builderP1 || !builderP2 || !builderP3) {
      alert('Vui lòng chọn đủ 3 Passages (Passage 1, Passage 2 và Passage 3) hoặc bấm nút "🎲 Chọn Ngẫu Nhiên"!');
      return;
    }

    // Reindex passage 1 (Starts at 1)
    const newP1 = reindexPassage(builderP1.passage, 1, 1);
    const qCount1 = newP1.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

    // Reindex passage 2 (Starts at qCount1 + 1)
    const newP2 = reindexPassage(builderP2.passage, 2, qCount1 + 1);
    const qCount2 = newP2.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

    // Reindex passage 3 (Starts at qCount1 + qCount2 + 1)
    const newP3 = reindexPassage(builderP3.passage, 3, qCount1 + qCount2 + 1);
    const qCount3 = newP3.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);

    const totalQ = qCount1 + qCount2 + qCount3;

    const fullTest = {
      id: `custom-test-full-${Date.now()}`,
      title: customTestTitle.trim() || `IELTS Academic Reading Full Test (${totalQ} câu)`,
      description: `Bộ đề thi thử 3 Passages tự lắp ghép từ ngân hàng đề (${builderP1.passage.title} + ${builderP2.passage.title} + ${builderP3.passage.title}). Chuẩn thi thật 60 phút.`,
      totalQuestions: totalQ,
      timeLimitMinutes: 60,
      isCustom: true,
      isPublic: false,
      creatorEmail: user?.email || 'Thành viên',
      passages: [newP1, newP2, newP3]
    };

    if (onCreateFullTest) {
      onCreateFullTest(fullTest);
    }
    onClose();
  };

  const filteredTests = allReadingTests.filter(test => {
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
    public: allReadingTests.filter(t => t.isPublic).length,
    totalPassages: passageBank.length
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
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
                  {stats.total} Đề thi • {stats.totalPassages} Bài đọc
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý thư viện đề chuẩn Cambridge, AI sinh & Lắp ghép đề thi 3 Passages hoàn chỉnh
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

        {/* Toolbar: Navigation Tabs & Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
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
              onClick={() => setActiveTab('custom_builder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'custom_builder' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' 
                  : 'text-blue-700 hover:bg-blue-100/60 font-extrabold'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>🎲 Ghép Đề 3 Passages</span>
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
          {activeTab !== 'custom_builder' && (
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
          )}
        </div>

        {/* TAB CONTENT: 3-PASSAGES BUILDER */}
        {activeTab === 'custom_builder' ? (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Intro Banner with Random Button */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Tự Do Ghép 3 Passages Thành Đề Thi Thử Chuẩn 60 Phút
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Bạn có thể chọn 3 bài đọc bất kỳ từ ngân hàng đề để ghép thành một bài thi hoàn chỉnh (40 câu, tự động đánh lại số thứ tự câu hỏi từ 1 đến 40), hoặc bấm <strong>"Chọn Ngẫu Nhiên"</strong> để hệ thống tự động bốc 3 bài phù hợp cho bạn!
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRandomize3Passages}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>🎲 Chọn Ngẫu Nhiên 3 Passages</span>
                </button>
              </div>
            </div>

            {/* Test Title Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Tên bài thi ghép (Tùy chọn):
              </label>
              <input
                type="text"
                placeholder="VD: Đề Luyện Tập Tổng Hợp 3 Passages - Cambridge & AI..."
                value={customTestTitle}
                onChange={(e) => setCustomTestTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              />
            </div>

            {/* 3 Passages Selection Slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Slot 1: Passage 1 */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                builderP1 ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs' : 'bg-slate-50 border-dashed border-slate-300'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Passage 1 (Câu 1–13)
                    </span>
                    {builderP1 && (
                      <button
                        onClick={() => setBuilderP1(null)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Bỏ chọn passage này"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Chọn bài đọc cho Passage 1:
                    </label>
                    <select
                      value={builderP1?.passageKey || ''}
                      onChange={(e) => {
                        const found = passageBank.find(p => p.passageKey === e.target.value);
                        setBuilderP1(found || null);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 truncate"
                    >
                      <option value="">-- Bấm chọn bài đọc --</option>
                      {passageBank.map(item => (
                        <option key={item.passageKey} value={item.passageKey}>
                          [{item.testIsCustom ? 'Tự tạo' : 'Cambridge'}] {item.passage.title} ({item.qCount} câu)
                        </option>
                      ))}
                    </select>
                  </div>

                  {builderP1 ? (
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1 text-xs">
                      <p className="font-bold text-slate-900 leading-snug">{builderP1.passage.title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2">
                        {builderP1.passage.paragraphs?.[0]?.text?.substring(0, 100)}...
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                        <span>{builderP1.qCount} câu hỏi</span>
                        <span className="text-slate-400">Từ: {builderP1.testTitle}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs italic">
                      Chưa chọn bài đọc cho Passage 1
                    </div>
                  )}
                </div>
              </div>

              {/* Slot 2: Passage 2 */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                builderP2 ? 'bg-amber-50/50 border-amber-300 shadow-2xs' : 'bg-slate-50 border-dashed border-slate-300'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                      Passage 2 (Câu 14–26)
                    </span>
                    {builderP2 && (
                      <button
                        onClick={() => setBuilderP2(null)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Bỏ chọn passage này"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Chọn bài đọc cho Passage 2:
                    </label>
                    <select
                      value={builderP2?.passageKey || ''}
                      onChange={(e) => {
                        const found = passageBank.find(p => p.passageKey === e.target.value);
                        setBuilderP2(found || null);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 truncate"
                    >
                      <option value="">-- Bấm chọn bài đọc --</option>
                      {passageBank.map(item => (
                        <option key={item.passageKey} value={item.passageKey}>
                          [{item.testIsCustom ? 'Tự tạo' : 'Cambridge'}] {item.passage.title} ({item.qCount} câu)
                        </option>
                      ))}
                    </select>
                  </div>

                  {builderP2 ? (
                    <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 text-xs">
                      <p className="font-bold text-slate-900 leading-snug">{builderP2.passage.title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2">
                        {builderP2.passage.paragraphs?.[0]?.text?.substring(0, 100)}...
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
                        <span>{builderP2.qCount} câu hỏi</span>
                        <span className="text-slate-400">Từ: {builderP2.testTitle}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs italic">
                      Chưa chọn bài đọc cho Passage 2
                    </div>
                  )}
                </div>
              </div>

              {/* Slot 3: Passage 3 */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                builderP3 ? 'bg-rose-50/50 border-rose-300 shadow-2xs' : 'bg-slate-50 border-dashed border-slate-300'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300">
                      Passage 3 (Câu 27–40)
                    </span>
                    {builderP3 && (
                      <button
                        onClick={() => setBuilderP3(null)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Bỏ chọn passage này"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Chọn bài đọc cho Passage 3:
                    </label>
                    <select
                      value={builderP3?.passageKey || ''}
                      onChange={(e) => {
                        const found = passageBank.find(p => p.passageKey === e.target.value);
                        setBuilderP3(found || null);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 truncate"
                    >
                      <option value="">-- Bấm chọn bài đọc --</option>
                      {passageBank.map(item => (
                        <option key={item.passageKey} value={item.passageKey}>
                          [{item.testIsCustom ? 'Tự tạo' : 'Cambridge'}] {item.passage.title} ({item.qCount} câu)
                        </option>
                      ))}
                    </select>
                  </div>

                  {builderP3 ? (
                    <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1 text-xs">
                      <p className="font-bold text-slate-900 leading-snug">{builderP3.passage.title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2">
                        {builderP3.passage.paragraphs?.[0]?.text?.substring(0, 100)}...
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-rose-700 font-semibold">
                        <span>{builderP3.qCount} câu hỏi</span>
                        <span className="text-slate-400">Từ: {builderP3.testTitle}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs italic">
                      Chưa chọn bài đọc cho Passage 3
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Assemble Action Area */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${builderP1 && builderP2 && builderP3 ? 'text-emerald-400' : 'text-slate-500'}`} />
                  Tình trạng lắp ghép: {builderP1 && builderP2 && builderP3 ? 'Đã đủ 3 Passages' : 'Cần chọn đủ 3 Passages'}
                </h4>
                <p className="text-xs text-slate-400">
                  Hệ thống sẽ chuẩn hóa dải câu hỏi từ 1–40 và gán thời gian làm bài chuẩn 60 phút.
                </p>
              </div>

              <button
                type="button"
                disabled={!builderP1 || !builderP2 || !builderP3}
                onClick={handleAssembleTest}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  builderP1 && builderP2 && builderP3
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg hover:shadow-emerald-500/25 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Tạo & Bắt Đầu Làm Bài Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* REGULAR TEST LIST */
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
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            💡 Mẹo: Chuyển sang tab <strong className="text-indigo-600">"🎲 Ghép Đề 3 Passages"</strong> để tạo bài thi thử 60 phút từ ngân hàng bài đọc của bạn.
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
