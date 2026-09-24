import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  Download, 
  Upload, 
  Sparkles, 
  X, 
  FileText, 
  BarChart2, 
  CheckCircle2,
  Globe,
  Lock,
  Share2,
  Users,
  Link as LinkIcon,
  GraduationCap,
  Star,
  Flame,
  Award
} from 'lucide-react';
import { TASK1_TYPES, TASK2_TYPES } from '../data/topics';
import TaskImageUploader from './TaskImageUploader';
import StarRatingWidget from './common/StarRatingWidget';
import SmartContentFilterBar from './common/SmartContentFilterBar';
import { applySmartFilterAndSort, recordAttempt } from '../services/ratingPopularityService';

export default function TaskLibraryModal({
  isOpen,
  onClose,
  allTasks,
  currentTaskId,
  onSelectTask,
  onAddNewCustomTask,
  onDeleteTask,
  onTogglePublic,
  user,
  communityTasks = [],
  onExportAllData,
  onImportData,
  masteredIds = [],
  onToggleMastered,
  onOpenAuth,
  submissions = []
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'custom' | 'ai' | 'community'
  const [filterTaskNum, setFilterTaskNum] = useState('all'); // 'all' | 1 | 2
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualTaskNum, setManualTaskNum] = useState(2);
  const [manualType, setManualType] = useState('opinion');
  const [manualPrompt, setManualPrompt] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [manualModelAnswer, setManualModelAnswer] = useState('');

  const handleCopyShareLink = (task) => {
    try {
      const shareData = {
        id: task.id,
        taskNumber: task.taskNumber || (task.taskNum || 2),
        taskNum: task.taskNumber || (task.taskNum || 2),
        type: task.type || 'opinion',
        title: task.title || 'Đề bài IELTS',
        prompt: task.prompt || '',
        sampleAnswer: task.sampleAnswer || '',
        imageUrl: (task.imageUrl && !task.imageUrl.startsWith('data:') && !task.imageUrl.startsWith('blob:')) ? task.imageUrl : '',
        creatorEmail: task.creatorEmail || (user?.email ? user.email.split('@')[0] : 'Cộng đồng')
      };
      const jsonStr = JSON.stringify(shareData);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#shared-task=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Đã sao chép liên kết chia sẻ đề thi! Bạn có thể dán liên kết này vào bất kỳ tab ẩn danh hoặc gửi bạn bè để mở bài luyện ngay.');
    } catch (e) {
      console.error(e);
      alert('Không thể tạo liên kết chia sẻ.');
    }
  };

  // Source list depending on activeTab (Tất cả bao gồm cả đề cộng đồng công khai)
  const taskSource = useMemo(() => {
    if (activeTab === 'community') return communityTasks;
    const combined = [...allTasks];
    const existingIds = new Set(allTasks.map(t => t.id));
    for (const ct of communityTasks) {
      if (!existingIds.has(ct.id)) {
        combined.push(ct);
        existingIds.add(ct.id);
      }
    }
    return combined;
  }, [activeTab, allTasks, communityTasks]);

  const [hideMastered, setHideMastered] = useState(true);

  const masteredCount = useMemo(() => {
    return allTasks.filter(t => masteredIds.includes(t.id)).length;
  }, [allTasks, masteredIds]);

  const attemptedIds = useMemo(() => {
    return (submissions || []).map(s => s.task?.id).filter(Boolean);
  }, [submissions]);

  const categoryOptions = useMemo(() => {
    if (filterTaskNum === 1) {
      return TASK1_TYPES.map(t => ({ value: t.id, label: `Task 1: ${t.label}` }));
    }
    if (filterTaskNum === 2) {
      return TASK2_TYPES.map(t => ({ value: t.id, label: `Task 2: ${t.label}` }));
    }
    return [
      ...TASK1_TYPES.map(t => ({ value: t.id, label: `Task 1: ${t.label}` })),
      ...TASK2_TYPES.map(t => ({ value: t.id, label: `Task 2: ${t.label}` }))
    ];
  }, [filterTaskNum]);

  const filteredTasks = useMemo(() => {
    let base = taskSource;

    // 1. Tab filter
    if (activeTab === 'mastered') {
      base = base.filter(t => masteredIds.includes(t.id));
    } else {
      if (activeTab === 'custom') {
        base = base.filter(t => t.isCustom && !t.isAiGenerated);
      } else if (activeTab === 'ai') {
        base = base.filter(t => t.isAiGenerated);
      } else if (activeTab === 'community') {
        base = base.filter(t => t.isCommunity);
      }

      // Hide mastered from general practice list if toggled
      if (hideMastered && user) {
        base = base.filter(t => !masteredIds.includes(t.id));
      }
    }

    // 2. Task 1 / 2 filter
    if (filterTaskNum !== 'all') {
      base = base.filter(t => (t.taskNumber || t.taskNum) === Number(filterTaskNum));
    }

    // 3. Smart Search, Faceted Category, Quick Filter, and Multi-Dimensional Sort
    return applySmartFilterAndSort(base, {
      searchQuery,
      quickFilter,
      categoryFilter,
      sortBy,
      masteredIds,
      attemptedIds
    });
  }, [taskSource, activeTab, filterTaskNum, hideMastered, user, masteredIds, searchQuery, quickFilter, categoryFilter, sortBy, attemptedIds]);

  const handleCreateManual = (e) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualPrompt.trim()) return;

    const newTask = {
      id: `custom-${Date.now()}`,
      taskNumber: Number(manualTaskNum),
      type: manualType,
      title: manualTitle.trim(),
      prompt: manualPrompt.trim(),
      imageUrl: Number(manualTaskNum) === 1 ? manualImageUrl.trim() : '',
      modelAnswer: manualModelAnswer.trim(),
      minWords: Number(manualTaskNum) === 1 ? 150 : 250,
      timeLimit: Number(manualTaskNum) === 1 ? 20 : 40,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onAddNewCustomTask(newTask);
    setManualTitle('');
    setManualPrompt('');
    setManualImageUrl('');
    setManualModelAnswer('');
    setIsAddingManual(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        onImportData(json);
      } catch (err) {
        alert('File JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Kho Đề Thi & Quản Lý Tài Liệu</h2>
              <p className="text-xs text-slate-400">Chọn đề làm bài, nạp thêm tài liệu cá nhân hoặc sao lưu kho đề</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportAllData}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              title="Xuất toàn bộ đề & bài làm ra file JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sao lưu JSON</span>
            </button>

            <label className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nạp JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 space-y-2.5">
          {/* Top Row: Tabs, Task 1/2, Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'bg-red-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tất cả ({allTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  activeTab === 'custom' ? 'bg-red-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tài liệu của bạn
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeTab === 'ai' ? 'bg-red-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI của bạn</span>
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'community' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Cộng Đồng ({communityTasks.length})</span>
              </button>
              {user && (
                <button
                  onClick={() => setActiveTab('mastered')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'mastered' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Đã Thuộc ({masteredCount})</span>
                </button>
              )}
            </div>

            {/* Filter Task 1 / 2 & Add Manual Button */}
            <div className="flex items-center gap-2">
              {user && activeTab !== 'mastered' && masteredCount > 0 && (
                <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={hideMastered}
                    onChange={(e) => setHideMastered(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-semibold text-emerald-800 text-[11px]">Ẩn đã thuộc ({masteredCount})</span>
                </label>
              )}
              <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFilterTaskNum('all')}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    filterTaskNum === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cả 2 Task
                </button>
                <button
                  onClick={() => setFilterTaskNum(1)}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    filterTaskNum === 1 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Task 1
                </button>
                <button
                  onClick={() => setFilterTaskNum(2)}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    filterTaskNum === 2 ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Task 2
                </button>
              </div>

              {/* Add Manual Button */}
              <button
                onClick={() => setIsAddingManual(!isAddingManual)}
                className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingManual ? 'Đóng' : 'Nạp Đề'}</span>
              </button>
            </div>
          </div>

          {/* Smart Content Filter & Sorting Bar */}
          <SmartContentFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categoryOptions={categoryOptions}
            totalCount={taskSource.length}
            filteredCount={filteredTasks.length}
            onResetFilters={() => {
              setSearchQuery('');
              setQuickFilter('all');
              setCategoryFilter('all');
              setSortBy('rating_desc');
            }}
            placeholder="Tìm đề bài theo tiêu đề, từ khóa, chủ đề Cambridge..."
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* MANUAL ADD FORM */}
          {isAddingManual && (
            <form onSubmit={handleCreateManual} className="p-5 rounded-2xl border border-red-200 bg-red-50/40 space-y-3 mb-4">
              <h4 className="font-bold text-sm text-red-900 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-red-600" />
                <span>Nạp Đề Mới Từ Tài Liệu Riêng Của Bạn:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề đề bài:</label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Vd: Cambridge 18 Test 2 - Remote Working"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phần thi:</label>
                  <select
                    value={manualTaskNum}
                    onChange={(e) => setManualTaskNum(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                  >
                    <option value={1}>Task 1 (Report - 150w)</option>
                    <option value={2}>Task 2 (Essay - 250w)</option>
                  </select>
                </div>
              </div>

              {/* Dạng bài chi tiết */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dạng bài cụ thể:</label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  {manualTaskNum === 1 ? (
                    TASK1_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))
                  ) : (
                    TASK2_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label} ({t.vi})</option>
                    ))
                  )}
                </select>
              </div>

              {/* TASK 1: Upload / Dán Ảnh Cho Đề Bài */}
              {manualTaskNum === 1 && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                  <TaskImageUploader
                    imageUrl={manualImageUrl}
                    onImageChange={setManualImageUrl}
                    label="Ảnh Đề Bài Task 1 (Biểu đồ / Bản đồ / Quy trình):"
                  />
                  {manualImageUrl && (
                    <p className="text-[11px] text-amber-800 font-medium mt-1.5 flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <span>🔒</span>
                      <span>Ảnh cá nhân tải lên được lưu riêng tư cho tài khoản của bạn, không chia sẻ lên kho đề chung.</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung đề bài chính xác (Prompt):</label>
                <textarea
                  required
                  rows={3}
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder="Dán toàn bộ đề bài ở đây..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bài mẫu tham khảo (Nếu có):</label>
                <textarea
                  rows={3}
                  value={manualModelAnswer}
                  onChange={(e) => setManualModelAnswer(e.target.value)}
                  placeholder="Dán bài mẫu Band 8.0+ từ sách hoặc tài liệu của bạn (tùy chọn)..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingManual(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-2xs"
                >
                  Lưu Đề Vào Kho
                </button>
              </div>
            </form>
          )}

          {/* TASK CARDS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(t => {
                const isActive = t.id === currentTaskId;
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isActive 
                        ? 'border-red-500 bg-red-50/30 ring-2 ring-red-500/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Task {t.taskNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                          {t.type}
                        </span>
                        {t.isAiGenerated && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Sinh</span>
                          </span>
                        )}
                        {t.isCustom && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                            Tự Nạp
                          </span>
                        )}
                        {t.imageUrl && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold flex items-center space-x-1">
                            <span>📷 Có Ảnh</span>
                          </span>
                        )}
                        {t.isPublic && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>Công Khai</span>
                          </span>
                        )}
                        {t.isCommunity && t.creatorEmail && (
                          <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-medium">
                            Từ: {t.creatorEmail.split('@')[0]}
                          </span>
                        )}
                        {masteredIds.includes(t.id) && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold flex items-center space-x-1 shadow-2xs">
                            <GraduationCap className="w-3 h-3 text-emerald-700" />
                            <span>Đã thuộc</span>
                          </span>
                        )}
                        {attemptedIds.includes(t.id) && (
                          <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>Đã làm</span>
                          </span>
                        )}
                        {t._metrics?.isHot && (
                          <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-bold flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                            <span>Thịnh Hành</span>
                          </span>
                        )}
                        {t._metrics?.isTopRated && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                            <span>Top Đề</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {t.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {t.prompt}
                      </p>

                      {/* Social Proof: 5-Star Interactive Rating & Attempt Counter */}
                      <div className="pt-1.5 flex items-center justify-between">
                        <StarRatingWidget
                          itemId={t.id}
                          initialRating={t._metrics?.rating}
                          initialRatingCount={t._metrics?.ratingCount}
                          initialUserRating={t._metrics?.userRating}
                          attemptsCount={t._metrics?.attemptsCount}
                          showAttempts={true}
                          size="xs"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        {/* Share / Unshare Toggle for own tasks */}
                        {(t.isOwnTask || t.isAiGenerated || t.isCustom) && onTogglePublic && (
                          <button
                            onClick={() => {
                              if (!t.isPublic && t.imageUrl && (t.imageUrl.startsWith('data:') || t.imageUrl.startsWith('blob:'))) {
                                alert('Đề thi này có hình ảnh tải lên từ thiết bị cá nhân. Theo chính sách bảo mật & tiết kiệm dung lượng, hình ảnh tự tải lên được giữ riêng tư cho tài khoản của bạn, không thể chia sẻ công khai.');
                                return;
                              }
                              onTogglePublic(t.id, !t.isPublic);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors ${
                              t.isPublic 
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={t.isPublic ? "Đang chia sẻ công khai cho mọi người. Bấm để chuyển về riêng tư" : "Bấm để chia sẻ đề này vào Thư viện Cộng đồng"}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Copy Instant Share Link Button */}
                        <button
                          onClick={() => handleCopyShareLink(t)}
                          className="p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-blue-600"
                          title="Sao chép liên kết đề thi (Dán trực tiếp vào Tab ẩn danh hoặc gửi bạn bè để mở ngay)"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                        </button>

                        {/* Mastered / Đã Thuộc Toggle Button */}
                        <button
                          onClick={() => {
                            if (!user) {
                              alert('Tính năng "Đã thuộc" giúp ẩn đề đã thuần thục khỏi danh sách luyện tập. Vui lòng đăng nhập để lưu tiến trình!');
                              onOpenAuth?.();
                              return;
                            }
                            onToggleMastered?.(t.id);
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                            masteredIds.includes(t.id)
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                          title={masteredIds.includes(t.id) 
                            ? "Đề này đã thuộc. Bấm để bỏ đánh dấu (Ôn tập lại)" 
                            : "Đánh dấu 'Đã thuộc' (Sẽ ẩn khỏi danh sách luyện tập hàng ngày của bạn)"}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          {masteredIds.includes(t.id) && <span className="text-[10px]">Đã thuộc</span>}
                        </button>

                        {(t.isCustom || t.isAiGenerated) && (
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Xóa đề này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {isActive ? (
                        <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đang Chọn</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            recordAttempt(t.id);
                            onSelectTask(t);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
                        >
                          Làm Bài
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Không tìm thấy đề thi phù hợp với bộ lọc.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
