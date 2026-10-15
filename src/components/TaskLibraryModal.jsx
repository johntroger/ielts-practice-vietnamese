import React, { useState, useMemo, useEffect } from 'react';
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
  Award,
  PenTool,
  ChevronDown,
  Layers,
  Check
} from 'lucide-react';
import { TASK1_TYPES, TASK2_TYPES } from '../data/topics';
import TaskImageUploader from './TaskImageUploader';
import StarRatingWidget from './common/StarRatingWidget';
import SmartContentFilterBar from './common/SmartContentFilterBar';
import { applySmartFilterAndSort, recordAttempt } from '../services/ratingPopularityService';
import { isOwnerUser, OWNER_MEDIA_RESTRICTION_MESSAGE, OWNER_EMAIL } from '../utils/userPermissions';
import { useTranslation } from '../i18n';

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

  const { t, isEn } = useTranslation();
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
      alert(isEn ? 'Copied prompt share link! You can paste it into any incognito tab or share with friends to open it directly.' : 'Đã sao chép liên kết chia sẻ đề thi! Bạn có thể dán liên kết này vào bất kỳ tab ẩn danh hoặc gửi bạn bè để mở bài luyện ngay.');
    } catch (e) {
      console.error(e);
      alert(isEn ? 'Failed to generate share link.' : 'Không thể tạo liên kết chia sẻ.');
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

  const taskCounts = useMemo(() => {
    const existingIds = new Set(allTasks.map(t => t.id));
    const fullPool = [...allTasks];
    for (const ct of communityTasks) {
      if (!existingIds.has(ct.id)) {
        fullPool.push(ct);
        existingIds.add(ct.id);
      }
    }
    return {
      all: fullPool.length,
      manual: fullPool.filter(t => t.isManual || (t.isCustom && !t.isAiGenerated)).length,
      ai: fullPool.filter(t => t.isAiGenerated).length,
      cambridge: fullPool.filter(t => t.isCambridge || (!t.isCustom && !t.isAiGenerated)).length,
      community: communityTasks.length,
      mastered: allTasks.filter(t => masteredIds.includes(t.id)).length
    };
  }, [allTasks, communityTasks, masteredIds]);

  const allCount = taskCounts.all;
  const masteredCount = taskCounts.mastered;

  const [hideMastered, setHideMastered] = useState(true);

  // ----------------------------------------------------
  // DYNAMIC TABS & DROPBOX PICKER ARCHITECTURE
  // ----------------------------------------------------
  const taskTabsCatalog = useMemo(() => [
    {
      id: 'all',
      icon: BookOpen,
      label: `${t('modals.library.tabAll', null, 'Tất cả')} (${taskCounts.all})`,
      shortLabel: t('modals.library.tabAll', null, 'Tất cả'),
      count: taskCounts.all,
      activeTheme: 'bg-red-600 text-white border-red-600 shadow-2xs font-bold',
      iconColor: 'text-red-500'
    },
    {
      id: 'manual',
      icon: PenTool,
      label: `${t('modals.library.tabManual', null, '✍️ Thủ Công')} (${taskCounts.manual})`,
      shortLabel: t('modals.library.tabManual', null, '✍️ Thủ Công'),
      count: taskCounts.manual,
      activeTheme: 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'ai',
      icon: Sparkles,
      label: `${t('modals.library.tabAi', null, '🤖 AI Sinh')} (${taskCounts.ai})`,
      shortLabel: t('modals.library.tabAi', null, '🤖 AI Sinh'),
      count: taskCounts.ai,
      activeTheme: 'bg-purple-600 text-white border-purple-600 shadow-2xs font-bold',
      iconColor: 'text-amber-500'
    },
    {
      id: 'cambridge',
      icon: BookOpen,
      label: `${t('modals.library.tabCambridge', null, '🏛️ Cambridge')} (${taskCounts.cambridge})`,
      shortLabel: t('modals.library.tabCambridge', null, '🏛️ Cambridge'),
      count: taskCounts.cambridge,
      activeTheme: 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold',
      iconColor: 'text-blue-500'
    },
    {
      id: 'community',
      icon: Users,
      label: `${t('modals.library.tabCommunity', null, 'Cộng Đồng')} (${taskCounts.community})`,
      shortLabel: t('modals.library.tabCommunity', null, 'Cộng Đồng'),
      count: taskCounts.community,
      activeTheme: 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold',
      iconColor: 'text-indigo-500'
    },
    ...(user ? [{
      id: 'mastered',
      icon: GraduationCap,
      label: `${t('modals.library.tabMastered', null, 'Đã Thuộc')} (${taskCounts.mastered})`,
      shortLabel: t('modals.library.tabMastered', null, 'Đã Thuộc'),
      count: taskCounts.mastered,
      activeTheme: 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold',
      iconColor: 'text-emerald-600'
    }] : [])
  ], [taskCounts, t, user]);

  const [openTabs, setOpenTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_task_lib_open_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['all', 'manual', 'ai', 'cambridge', 'community'];
  });

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = React.useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ielts_task_lib_open_tabs', JSON.stringify(openTabs));
    } catch (e) {}
  }, [openTabs]);

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tabDropdownRef.current && !tabDropdownRef.current.contains(event.target)) {
        setIsTabDropdownOpen(false);
      }
    };
    if (isTabDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTabDropdownOpen]);

  // Ensure activeTab is always in openTabs
  useEffect(() => {
    if (activeTab && !openTabs.includes(activeTab)) {
      setOpenTabs(prev => [...prev, activeTab]);
    }
  }, [activeTab, openTabs]);

  const handleSelectFromDropdown = (tabId) => {
    if (!openTabs.includes(tabId)) {
      setOpenTabs(prev => [...prev, tabId]);
    }
    setActiveTab(tabId);
    setIsTabDropdownOpen(false);
  };

  const handleCloseTab = (tabIdToClose) => {
    const nextList = openTabs.filter(id => id !== tabIdToClose);
    setOpenTabs(nextList);

    if (activeTab === tabIdToClose) {
      if (nextList.length > 0) {
        const closedIdx = openTabs.indexOf(tabIdToClose);
        const nextActiveIdx = Math.max(0, closedIdx - 1);
        setActiveTab(nextList[nextActiveIdx] || nextList[0]);
      } else {
        setIsTabDropdownOpen(true);
      }
    }
  };

  const handleOpenAllTabs = () => {
    setOpenTabs(taskTabsCatalog.map(t => t.id));
    setIsTabDropdownOpen(false);
  };

  const handleCloseOtherTabs = () => {
    setOpenTabs([activeTab]);
    setIsTabDropdownOpen(false);
  };

  const currentOpenTabs = openTabs.length > 0 ? openTabs : (activeTab ? [activeTab] : []);

  const attemptedIds = useMemo(() => {
    return (submissions || []).map(s => s.task?.id).filter(Boolean);
  }, [submissions]);

  const getTask1TypeLabel = (typeId, isEnglish) => {
    const map = {
      line: isEnglish ? 'Line Graph' : 'Line Graph (Đường)',
      bar: isEnglish ? 'Bar Chart' : 'Bar Chart (Cột)',
      pie: isEnglish ? 'Pie Chart' : 'Pie Chart (Tròn)',
      table: isEnglish ? 'Table' : 'Table (Bảng số liệu)',
      mixed: isEnglish ? 'Mixed / Combo' : 'Mixed / Combo (Hỗn hợp)',
      process: isEnglish ? 'Process' : 'Process (Quy trình)',
      map: isEnglish ? 'Map' : 'Map (Bản đồ biến đổi)'
    };
    return map[typeId] || typeId;
  };

  const getTask2TypeLabel = (typeId, isEnglish) => {
    const map = {
      opinion: isEnglish ? 'Agree or Disagree' : 'Đồng ý hay Không đồng ý (Opinion)',
      discussion: isEnglish ? 'Discuss Both Views' : 'Bàn luận 2 quan điểm (Discussion)',
      advantages: isEnglish ? 'Advantages vs Disadvantages' : 'Ưu điểm & Nhược điểm (Advantages)',
      problems: isEnglish ? 'Causes & Solutions' : 'Nguyên nhân & Giải pháp (Problems)',
      twopart: isEnglish ? 'Two-part Direct Question' : 'Câu hỏi 2 phần (Two-part Direct)'
    };
    return map[typeId] || typeId;
  };

  const categoryOptions = useMemo(() => {
    if (filterTaskNum === 1) {
      return TASK1_TYPES.map(t => ({ value: t.id, label: `Task 1: ${getTask1TypeLabel(t.id, isEn)}` }));
    }
    if (filterTaskNum === 2) {
      return TASK2_TYPES.map(t => ({ value: t.id, label: `Task 2: ${getTask2TypeLabel(t.id, isEn)}` }));
    }
    return [
      ...TASK1_TYPES.map(t => ({ value: t.id, label: `Task 1: ${getTask1TypeLabel(t.id, isEn)}` })),
      ...TASK2_TYPES.map(t => ({ value: t.id, label: `Task 2: ${getTask2TypeLabel(t.id, isEn)}` }))
    ];
  }, [filterTaskNum, isEn]);

  const filteredTasks = useMemo(() => {
    let base = taskSource;

    // 1. Tab filter
    if (activeTab === 'mastered') {
      base = base.filter(t => masteredIds.includes(t.id));
    } else {
      if (activeTab === 'manual' || activeTab === 'custom') {
        base = base.filter(t => t.isManual || (t.isCustom && !t.isAiGenerated));
      } else if (activeTab === 'ai') {
        base = base.filter(t => t.isAiGenerated);
      } else if (activeTab === 'cambridge') {
        base = base.filter(t => t.isCambridge || (!t.isCustom && !t.isAiGenerated));
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

    // Media Guard: Restrict images to Owner (tranthanhtung37@gmail.com)
    if (Number(manualTaskNum) === 1 && manualImageUrl.trim() && !isOwnerUser(user)) {
      alert(OWNER_MEDIA_RESTRICTION_MESSAGE);
      return;
    }

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
      isManual: true,
      isAiGenerated: false,
      source: 'manual',
      sampleAnswer: manualModelAnswer.trim(),
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
        if (!isOwnerUser(user)) {
          let strippedMedia = false;
          const sanitizeItem = (item) => {
            if (item && (item.imageUrl || item.audioUrl || item.audioBase64)) {
              strippedMedia = true;
              const copy = { ...item };
              delete copy.imageUrl;
              delete copy.audioUrl;
              delete copy.audioBase64;
              return copy;
            }
            return item;
          };

          if (Array.isArray(json)) {
            const sanitized = json.map(sanitizeItem);
            if (strippedMedia) {
              alert(isEn ? 'Note: Due to website storage limits, some images/audio in the JSON file were automatically omitted (media import is reserved for Administrator tranthanhtung37@gmail.com). All text prompts were fully imported.' : 'Lưu ý: Do dung lượng website giới hạn, một số hình ảnh/âm thanh trong tệp JSON đã được tự động lược bỏ (tính năng nạp đề chứa hình ảnh/âm thanh hiện chỉ dành riêng cho Quản trị viên tranthanhtung37@gmail.com). Toàn bộ nội dung đề văn bản vẫn được nạp đầy đủ.');
            }
            onImportData(sanitized);
            return;
          } else if (json && typeof json === 'object') {
            if (json.tasks && Array.isArray(json.tasks)) {
              json.tasks = json.tasks.map(sanitizeItem);
            }
            if (strippedMedia) {
              alert(isEn ? 'Note: Due to website storage limits, some images/audio in the JSON file were automatically omitted (media import is reserved for Administrator tranthanhtung37@gmail.com). All text prompts were fully imported.' : 'Lưu ý: Do dung lượng website giới hạn, một số hình ảnh/âm thanh trong tệp JSON đã được tự động lược bỏ (tính năng nạp đề chứa hình ảnh/âm thanh hiện chỉ dành riêng cho Quản trị viên tranthanhtung37@gmail.com). Toàn bộ nội dung đề văn bản vẫn được nạp đầy đủ.');
            }
          }
        }
        onImportData(json);
      } catch (err) {
        alert(isEn ? 'Invalid JSON file.' : 'File JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 mr-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/30 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold truncate">
                {t('modals.library.title', null, 'Kho Đề Thi & Quản Lý Tài Liệu')}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                {t('modals.library.subtitle', null, 'Chọn đề làm bài, nạp thêm tài liệu cá nhân hoặc sao lưu kho đề')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={onExportAllData}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              title={isEn ? "Backup all tasks and submissions as JSON" : "Xuất toàn bộ đề & bài làm ra file JSON"}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? "Backup JSON" : "Sao lưu JSON"}</span>
            </button>

            <label className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? "Import JSON" : "Nạp JSON"}</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button 
              onClick={onClose} 
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 space-y-2.5">
          {/* Top Row: Tabs, Task 1/2, Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Left: Dropbox Picker Button & Dynamic Closable Tabs Bar */}
            <div className="relative z-30 flex items-center gap-1.5 min-w-0 flex-1 overflow-visible">
              {/* Dropbox Picker Button */}
              <div ref={tabDropdownRef} className="relative shrink-0 z-40">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTabDropdownOpen(prev => !prev);
                  }}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs select-none shadow-xs ${
                    isTabDropdownOpen
                      ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200'
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                  title={isEn ? "Open task types dropbox" : "Bấm để chọn nguồn đề bài"}
                  aria-expanded={isTabDropdownOpen}
                >
                  <Layers className={`w-3.5 h-3.5 ${isTabDropdownOpen ? 'text-white' : 'text-indigo-600'}`} />
                  <span className="font-bold">{isEn ? 'Sources' : 'Nguồn đề'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isTabDropdownOpen ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentOpenTabs.length}/{taskTabsCatalog.length}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTabDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                </button>

                {/* Dropbox Menu Floating Dropdown */}
                {isTabDropdownOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-1.5 z-50 min-w-[260px] sm:min-w-[300px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                        <span>{isEn ? 'Task Sources' : 'Phân loại đề thi'}</span>
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAllTabs();
                          }}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer"
                        >
                          {isEn ? 'Open all' : 'Mở tất cả'}
                        </button>
                        {currentOpenTabs.length > 1 && (
                          <>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloseOtherTabs();
                              }}
                              className="text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
                            >
                              {isEn ? 'Only active' : 'Chỉ tab này'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-1 pr-0.5">
                      {taskTabsCatalog.map(tab => {
                        const isOpen = currentOpenTabs.includes(tab.id);
                        const isActive = activeTab === tab.id;
                        const IconComponent = tab.icon;

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectFromDropdown(tab.id);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-left ${
                              isActive
                                ? 'bg-indigo-50/90 text-indigo-900 font-bold border border-indigo-200'
                                : isOpen
                                  ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate pr-2">
                              <IconComponent className={`w-3.5 h-3.5 shrink-0 ${tab.iconColor || 'text-slate-500'}`} />
                              <span className="truncate">{tab.shortLabel}</span>
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                {tab.count}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 shrink-0">
                              {isOpen ? (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  <Check className="w-2.5 h-2.5 mr-0.5" />
                                  {isActive ? (isEn ? 'Active' : 'Đang xem') : (isEn ? 'Open' : 'Đã mở')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                                  <Plus className="w-2.5 h-2.5 mr-0.5" />
                                  {isEn ? 'Add' : 'Mở tab'}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Opened Dynamic Tabs List */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x py-0.5 flex-1 min-w-0">
                {currentOpenTabs.map((tabId) => {
                  const tabItem = taskTabsCatalog.find(t => t.id === tabId);
                  if (!tabItem) return null;
                  const isActive = activeTab === tabId;
                  const TabIcon = tabItem.icon;

                  return (
                    <div
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      className={`group shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        isActive
                          ? `${tabItem.activeTheme}`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[130px] sm:max-w-none">
                        {tabItem.shortLabel}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tabItem.count}
                      </span>
                      {/* Close Tab 'x' Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tabId);
                        }}
                        className={`ml-0.5 p-0.5 rounded-full transition-colors cursor-pointer ${
                          isActive 
                            ? 'text-white/70 hover:text-white hover:bg-white/20' 
                            : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200/80'
                        }`}
                        title={isEn ? "Close tab" : "Tắt tab này"}
                        aria-label={`Close ${tabItem.shortLabel || tabId}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                {currentOpenTabs.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsTabDropdownOpen(true)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/60 text-indigo-700 hover:bg-indigo-100 text-xs font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? '+ Open a source' : '+ Bấm để mở nguồn đề'}</span>
                  </button>
                )}
              </div>
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
                  <span className="font-semibold text-emerald-800 text-[11px]">{t('modals.library.hideMastered', null, 'Ẩn đã thuộc')} ({masteredCount})</span>
                </label>
              )}
              <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFilterTaskNum('all')}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    filterTaskNum === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t('modals.library.bothTasks', null, 'Cả 2 Task')}
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
                <span>{isAddingManual ? (isEn ? 'Close' : 'Đóng') : (isEn ? '+ Import Prompt' : '+ Nạp Đề')}</span>
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
            placeholder={isEn ? "Search prompts by title, keyword, Cambridge topic..." : "Tìm đề bài theo tiêu đề, từ khóa, chủ đề Cambridge..."}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 lg:p-6 space-y-4">
          
          {/* MANUAL ADD FORM */}
          {isAddingManual && (
            <form onSubmit={handleCreateManual} className="p-5 rounded-2xl border border-red-200 bg-red-50/40 space-y-3 mb-4">
              <h4 className="font-bold text-sm text-red-900 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-red-600" />
                <span>{isEn ? 'Add Custom Task from Your Own Materials:' : 'Nạp Đề Mới Từ Tài Liệu Riêng Của Bạn:'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Task Title:' : 'Tiêu đề đề bài:'}</label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder={isEn ? "E.g. Cambridge 18 Test 2 - Remote Working" : "Vd: Cambridge 18 Test 2 - Remote Working"}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Exam Section:' : 'Phần thi:'}</label>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Specific Question Type:' : 'Dạng bài cụ thể:'}</label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  {manualTaskNum === 1 ? (
                    TASK1_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{getTask1TypeLabel(t.id, isEn)}</option>
                    ))
                  ) : (
                    TASK2_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{getTask2TypeLabel(t.id, isEn)}</option>
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
                    label={isEn ? "Task 1 Visual Image (Chart / Map / Process):" : "Ảnh Đề Bài Task 1 (Biểu đồ / Bản đồ / Quy trình):"}
                    user={user}
                  />
                  {manualImageUrl && (
                    <p className="text-[11px] text-amber-800 font-medium mt-1.5 flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <span>🔒</span>
                      <span>{isEn ? "Uploaded personal image is stored privately for your account and will not be shared publicly." : "Ảnh cá nhân tải lên được lưu riêng tư cho tài khoản của bạn, không chia sẻ lên kho đề chung."}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Exact Prompt Text:' : 'Nội dung đề bài chính xác (Prompt):'}</label>
                <textarea
                  required
                  rows={3}
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder={isEn ? "Paste full exam prompt here..." : "Dán toàn bộ đề bài ở đây..."}
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Model Answer (Optional):' : 'Bài mẫu tham khảo (Nếu có):'}</label>
                <textarea
                  rows={3}
                  value={manualModelAnswer}
                  onChange={(e) => setManualModelAnswer(e.target.value)}
                  placeholder={isEn ? "Paste Band 8.0+ model answer here (optional)..." : "Dán bài mẫu Band 8.0+ từ sách hoặc tài liệu của bạn (tùy chọn)..."}
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingManual(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-2xs cursor-pointer"
                >
                  {isEn ? 'Save Prompt to Library' : 'Lưu Đề Vào Kho'}
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
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center space-x-1 font-semibold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{isEn ? 'AI Gen' : 'AI Sinh'}</span>
                          </span>
                        )}
                        {(t.isManual || (t.isCustom && !t.isAiGenerated)) && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300 font-bold flex items-center space-x-1 shadow-2xs">
                            <PenTool className="w-3 h-3 text-emerald-600" />
                            <span>✍️ {isEn ? 'Manual' : 'Thủ Công'}</span>
                          </span>
                        )}
                        {(t.isCambridge || (!t.isCustom && !t.isAiGenerated)) && (
                          <span className="text-[10px] text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-bold flex items-center space-x-1 shadow-2xs">
                            <span>🏛️ {t.cambridgeBook ? (isEn ? `Cambridge (Cam ${t.cambridgeBook})` : `Chuẩn Cambridge (Cam ${t.cambridgeBook})`) : (isEn ? 'Cambridge Official' : 'Chuẩn Cambridge')}</span>
                          </span>
                        )}
                        {t.imageUrl && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold flex items-center space-x-1">
                            <span>📷 {isEn ? 'With Image' : 'Có Ảnh'}</span>
                          </span>
                        )}
                        {t.isPublic && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>{isEn ? 'Public' : 'Công Khai'}</span>
                          </span>
                        )}
                        {t.isCommunity && t.creatorEmail && (
                          <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-medium">
                            {isEn ? 'By: ' : 'Từ: '}{t.creatorEmail.split('@')[0]}
                          </span>
                        )}
                        {masteredIds.includes(t.id) && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold flex items-center space-x-1 shadow-2xs">
                            <GraduationCap className="w-3 h-3 text-emerald-700" />
                            <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                          </span>
                        )}
                        {attemptedIds.includes(t.id) && (
                          <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>{isEn ? 'Attempted' : 'Đã làm'}</span>
                          </span>
                        )}
                        {t._metrics?.isHot && (
                          <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-bold flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                            <span>{isEn ? 'Trending' : 'Thịnh Hành'}</span>
                          </span>
                        )}
                        {t._metrics?.isTopRated && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                            <span>{isEn ? 'Top Pick' : 'Top Đề'}</span>
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
                                alert(isEn ? 'This prompt contains a private uploaded image. For privacy and storage policies, personal images remain private to your account and cannot be publicly shared.' : 'Đề thi này có hình ảnh tải lên từ thiết bị cá nhân. Theo chính sách bảo mật & tiết kiệm dung lượng, hình ảnh tự tải lên được giữ riêng tư cho tài khoản của bạn, không thể chia sẻ công khai.');
                                return;
                              }
                              onTogglePublic(t.id, !t.isPublic);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors ${
                              t.isPublic 
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={t.isPublic ? (isEn ? "Sharing publicly. Click to make private" : "Đang chia sẻ công khai cho mọi người. Bấm để chuyển về riêng tư") : (isEn ? "Click to share this prompt to Community Library" : "Bấm để chia sẻ đề này vào Thư viện Cộng đồng")}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Copy Instant Share Link Button */}
                        <button
                          onClick={() => handleCopyShareLink(t)}
                          className="p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
                          title={isEn ? "Copy prompt share link" : "Sao chép liên kết đề thi (Dán trực tiếp vào Tab ẩn danh hoặc gửi bạn bè để mở ngay)"}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                        </button>

                        {/* Mastered / Đã Thuộc Toggle Button */}
                        <button
                          onClick={() => {
                            if (!user) {
                              alert(isEn ? '"Mastered" feature helps hide mastered prompts from your practice list. Please log in to save your progress!' : 'Tính năng "Đã thuộc" giúp ẩn đề đã thuần thục khỏi danh sách luyện tập. Vui lòng đăng nhập để lưu tiến trình!');
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
                            ? (isEn ? "Mastered. Click to unmark" : "Đề này đã thuộc. Bấm để bỏ đánh dấu (Ôn tập lại)") 
                            : (isEn ? "Mark as 'Mastered' (Hides from daily practice list)" : "Đánh dấu 'Đã thuộc' (Sẽ ẩn khỏi danh sách luyện tập hàng ngày của bạn)")}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          {masteredIds.includes(t.id) && <span className="text-[10px]">{isEn ? 'Mastered' : 'Đã thuộc'}</span>}
                        </button>

                        {(t.isCustom || t.isAiGenerated || t.isOwnTask || t.id?.startsWith('custom-') || t.id?.startsWith('ai-gen-') || t.id?.startsWith('task-user')) && (
                          <button
                            onClick={() => {
                              if (window.confirm(isEn ? `Are you sure you want to delete prompt "${t.title}" from library?` : `Bạn có chắc chắn muốn xóa đề "${t.title}" khỏi kho đề?`)) {
                                onDeleteTask(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title={isEn ? "Delete this prompt" : "Xóa đề này"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {isActive ? (
                        <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Selected' : 'Đang Chọn'}</span>
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
                          {isEn ? 'Practice' : 'Làm Bài'}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                {isEn ? 'No tasks found matching your filters.' : 'Không tìm thấy đề thi phù hợp với bộ lọc.'}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
