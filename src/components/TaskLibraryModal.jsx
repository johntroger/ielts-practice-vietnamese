import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { TASK1_TYPES, TASK2_TYPES } from '../data/topics';

export default function TaskLibraryModal({
  isOpen,
  onClose,
  allTasks,
  currentTaskId,
  onSelectTask,
  onAddNewCustomTask,
  onDeleteTask,
  onExportAllData,
  onImportData
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'custom' | 'ai'
  const [filterTaskNum, setFilterTaskNum] = useState('all'); // 'all' | 1 | 2
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualTaskNum, setManualTaskNum] = useState(2);
  const [manualType, setManualType] = useState('opinion');
  const [manualPrompt, setManualPrompt] = useState('');
  const [manualModelAnswer, setManualModelAnswer] = useState('');

  const filteredTasks = allTasks.filter(t => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'custom' && t.isCustom) || 
      (activeTab === 'ai' && t.isAiGenerated);

    const matchesTaskNum = 
      filterTaskNum === 'all' || t.taskNumber === Number(filterTaskNum);

    const matchesSearch = 
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesTaskNum && matchesSearch;
  });

  const handleCreateManual = (e) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualPrompt.trim()) return;

    const newTask = {
      id: `custom-${Date.now()}`,
      taskNumber: Number(manualTaskNum),
      type: manualType,
      title: manualTitle.trim(),
      prompt: manualPrompt.trim(),
      modelAnswer: manualModelAnswer.trim(),
      minWords: Number(manualTaskNum) === 1 ? 150 : 250,
      timeLimit: Number(manualTaskNum) === 1 ? 20 : 40,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onAddNewCustomTask(newTask);
    setManualTitle('');
    setManualPrompt('');
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
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
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm đề bài theo tiêu đề hoặc từ khóa..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
              />
            </div>

            {/* Add Manual Button */}
            <button
              onClick={() => setIsAddingManual(!isAddingManual)}
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingManual ? 'Đóng Form' : 'Nạp Đề Cá Nhân Mới'}</span>
            </button>
          </div>

          {/* Tab Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'all' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tất cả ({allTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'custom' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tài liệu của bạn
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
                  activeTab === 'ai' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Do AI sinh ra</span>
              </button>
            </div>

            {/* Filter Task 1 / 2 */}
            <div className="flex gap-1">
              <button
                onClick={() => setFilterTaskNum('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  filterTaskNum === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cả 2 Task
              </button>
              <button
                onClick={() => setFilterTaskNum(1)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  filterTaskNum === 1 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Task 1
              </button>
              <button
                onClick={() => setFilterTaskNum(2)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  filterTaskNum === 2 ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Task 2
              </button>
            </div>
          </div>
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
          <div className="grid grid-cols-1 gap-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(t => {
                const isActive = t.id === currentTaskId;
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isActive 
                        ? 'border-red-500 bg-red-50/30 ring-2 ring-red-500/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
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
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {t.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {t.prompt}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      {isActive ? (
                        <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đang Chọn</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectTask(t);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Chọn Làm Bài
                        </button>
                      )}

                      {(t.isCustom || t.isAiGenerated) && (
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Xóa đề này"
                        >
                          <Trash2 className="w-4 h-4" />
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
