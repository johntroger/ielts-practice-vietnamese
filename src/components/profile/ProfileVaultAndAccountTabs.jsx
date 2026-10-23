import React from 'react';
import {
  Sparkles,
  BookOpen,
  Globe,
  Lock,
  Image as ImageIcon,
  PenTool,
  Trash2,
  GraduationCap,
  Headphones,
  Mic,
  ChevronRight,
  Bookmark,
  ShieldCheck,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { getLocalizedVocabMeaning } from '../../utils/vocabLocalization';

/**
 * Renders the 4 Resource, Repertoire, Vocab, and Account tabs
 * ('resources', 'mastered', 'vocab', 'account') inside UserProfileModal.
 */
export default function ProfileVaultAndAccountTabs({
  activeTab,
  isEn,
  user,
  allTasks = [],
  userCustomTasks = [],
  filteredCustomTasks = [],
  resourceFilter,
  setResourceFilter,
  allMasteredItems = [],
  filteredMasteredItems = [],
  masteredSkillFilter,
  setMasteredSkillFilter,
  vocabList = [],
  mistakes = [],
  onSelectTask,
  onTogglePublic,
  onDeleteTask,
  onToggleMastered,
  onOpenIngest,
  onOpenGenerator,
  onExportAllData,
  onImportData,
  handleFileUpload,
  onSignOut,
  onClose
}) {
  // Tạm thời ẩn tất cả các nút sinh đề bằng AI trên giao diện để tinh gọn theo yêu cầu
  const SHOW_AI_GENERATOR_BUTTONS = false;

  return (
    <>
      {/* ========================================================================= */}
      {/* TAB: MY UPLOADED CUSTOM TASKS & RESOURCES */}
      {/* ========================================================================= */}
      {activeTab === 'resources' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isEn ? 'Task Library & Sharing Settings' : 'Quản Lý Đề Thi & Chế Độ Chia Sẻ'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'User-authored or AI-ingested tasks, with toggleable public sharing permissions'
                  : 'Đề bài do bạn tự tạo hoặc nạp bằng AI, kèm quyền bật/tắt chia sẻ công khai'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setResourceFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    resourceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isEn ? `All (${userCustomTasks.length})` : `Tất cả (${userCustomTasks.length})`}
                </button>
                <button
                  onClick={() => setResourceFilter('public')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    resourceFilter === 'public' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isEn
                    ? `🌐 Public (${userCustomTasks.filter(t => t.isPublic).length})`
                    : `🌐 Công khai (${userCustomTasks.filter(t => t.isPublic).length})`}
                </button>
                <button
                  onClick={() => setResourceFilter('private')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    resourceFilter === 'private' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isEn
                    ? `🔒 Private (${userCustomTasks.filter(t => !t.isPublic).length})`
                    : `🔒 Riêng tư (${userCustomTasks.filter(t => !t.isPublic).length})`}
                </button>
              </div>

              {onOpenIngest && (
                <button
                  onClick={onOpenIngest}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Ingest Task with AI' : 'Nạp Đề Mới Bằng AI'}</span>
                </button>
              )}
            </div>
          </div>

          {filteredCustomTasks.length === 0 ? (
            <div className="space-y-4">
              <div className="p-6 sm:p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    {isEn ? 'Your custom task vault is currently empty' : 'Kho đề cá nhân của bạn hiện chưa có đề tự tạo'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    {isEn
                      ? 'Use AI to ingest tasks from Cambridge tests (with Task 1 charts) or generate brand new tasks to practice and share with the community.'
                      : 'Bạn có thể dùng AI để nạp nhanh đề từ tài liệu/sách Cambridge (có ảnh Task 1) hoặc sinh đề mới để luyện thi và chia sẻ cùng cộng đồng.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {onOpenIngest && (
                    <button
                      onClick={onOpenIngest}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Ingest with AI (Smart Ingest)' : 'Nạp Đề Bằng AI (Smart Ingest)'}</span>
                    </button>
                  )}
                  {/* Sinh Đề Mới Bằng AI (Tạm thời ẩn theo yêu cầu) */}
                  {SHOW_AI_GENERATOR_BUTTONS && onOpenGenerator && (
                    <button
                      onClick={onOpenGenerator}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
                    >
                      <span>{isEn ? '➕ Generate New Task with AI' : '➕ Sinh Đề Mới Bằng AI'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {isEn ? 'Featured System Tasks (Ready to Practice)' : 'Đề Thi Tiêu Biểu Trong Hệ Thống (Có Thể Làm Ngay)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isEn ? '15 Cambridge official tasks' : '15 đề chuẩn Cambridge'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(allTasks || []).slice(0, 4).map(t => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black uppercase mr-1.5 ${
                            t.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          Task {t.taskNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{t.title}</span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectTask?.(t);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-red-700 text-xs font-bold border border-slate-200 shrink-0 shadow-2xs transition-colors"
                      >
                        {isEn ? 'Write now →' : 'Viết ngay →'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomTasks.map(t => (
                <div
                  key={t.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col justify-between space-y-3 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          t.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        Task {t.taskNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {t.type || 'Academic'}
                      </span>
                    </div>

                    <button
                      onClick={() => onTogglePublic?.(t.id, !t.isPublic)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-2xs border ${
                        t.isPublic
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={
                        t.isPublic
                          ? isEn
                            ? 'Publicly shared! Click to make Private'
                            : 'Đang chia sẻ công khai! Nhấn để chuyển về Riêng tư'
                          : isEn
                          ? 'Currently private! Click to share publicly'
                          : 'Đang để riêng tư! Nhấn để chia sẻ công khai cho cộng đồng'
                      }
                    >
                      {t.isPublic ? (
                        <>
                          <Globe className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isEn ? 'Public' : 'Công Khai'}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{isEn ? 'Private' : 'Riêng Tư'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{t.prompt}</p>
                  </div>

                  {t.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
                      <img src={t.imageUrl} alt="Task 1 attachment" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3 text-cyan-400" />
                        <span>{isEn ? 'Attached Task 1 Graphic' : 'Đính kèm hình ảnh Task 1'}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {t.timeLimit || 40} {isEn ? 'mins' : 'phút'} • {t.minWords || 250} {isEn ? 'words' : 'từ'}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onSelectTask?.(t);
                          onClose();
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Practice Now' : 'Làm Bài Ngay'}</span>
                      </button>

                      {onDeleteTask && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                isEn
                                  ? `Are you sure you want to delete task "${t.title}" from your account?`
                                  : `Bạn có chắc muốn xóa đề "${t.title}" khỏi tài khoản?`
                              )
                            ) {
                              onDeleteTask(t.id);
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title={isEn ? 'Delete this task' : 'Xóa đề này'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MASTERED TASKS & DRILLS (ĐÃ THUỘC) */}
      {/* ========================================================================= */}
      {activeTab === 'mastered' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {isEn ? 'Mastered Question Bank & Repertoire' : 'Đề Thi & Bài Luyện Đã Thuần Thục'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 text-emerald-700" />
                  <span>
                    {allMasteredItems.length} {isEn ? 'items' : 'đề'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEn
                  ? 'Mastered tasks are automatically hidden from daily practice to focus on new ones, but all submission records and band scores are safely archived here.'
                  : 'Các đề thi bạn đã thuộc sẽ tự động ẩn khỏi danh sách luyện tập để tập trung vào đề mới, nhưng lịch sử làm bài và điểm số luôn được lưu giữ đầy đủ tại đây.'}
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setMasteredSkillFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  masteredSkillFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'hover:text-slate-900'
                }`}
              >
                {isEn ? `All (${allMasteredItems.length})` : `Tất Cả (${allMasteredItems.length})`}
              </button>
              <button
                onClick={() => setMasteredSkillFilter('writing')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  masteredSkillFilter === 'writing' ? 'bg-white text-red-700 shadow-2xs font-black' : 'hover:text-slate-900'
                }`}
              >
                ✍️ Writing ({allMasteredItems.filter(i => i.skill === 'writing').length})
              </button>
              <button
                onClick={() => setMasteredSkillFilter('reading')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  masteredSkillFilter === 'reading' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'hover:text-slate-900'
                }`}
              >
                📖 Reading ({allMasteredItems.filter(i => i.skill === 'reading').length})
              </button>
              <button
                onClick={() => setMasteredSkillFilter('listening')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  masteredSkillFilter === 'listening' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'hover:text-slate-900'
                }`}
              >
                🎧 Listening ({allMasteredItems.filter(i => i.skill === 'listening').length})
              </button>
              <button
                onClick={() => setMasteredSkillFilter('speaking')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  masteredSkillFilter === 'speaking' ? 'bg-white text-purple-700 shadow-2xs font-black' : 'hover:text-slate-900'
                }`}
              >
                🎙️ Speaking ({allMasteredItems.filter(i => i.skill === 'speaking').length})
              </button>
            </div>
          </div>

          {filteredMasteredItems.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-50/70 border border-slate-200/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                {masteredSkillFilter === 'all'
                  ? isEn
                    ? 'No tasks in "Mastered" repertoire yet'
                    : 'Chưa có đề thi nào trong danh sách "Đã thuộc"'
                  : isEn
                  ? `No mastered tasks for ${masteredSkillFilter.toUpperCase()}`
                  : `Chưa có bài nào thuộc kỹ năng ${masteredSkillFilter.toUpperCase()}`}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isEn ? (
                  <>
                    When in <strong>Writing</strong>, <strong>Reading</strong>, <strong>Listening</strong>, or <strong>Speaking</strong>, click <strong>🎓 Mastered</strong> on any task card to hide it from daily practice.
                  </>
                ) : (
                  <>
                    Khi vào <strong>Writing</strong>, <strong>Reading</strong>, <strong>Listening</strong>, hoặc <strong>Speaking</strong>, bấm vào nút <strong>🎓 Đã thuộc</strong> ở bất kỳ đề bài nào để ẩn đề đó khỏi danh sách luyện tập hàng ngày.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredMasteredItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border flex items-center space-x-1 ${item.skillBadgeColor}`}>
                        {item.skill === 'writing' && <PenTool className="w-3 h-3 text-red-600" />}
                        {item.skill === 'reading' && <BookOpen className="w-3 h-3 text-emerald-600" />}
                        {item.skill === 'listening' && <Headphones className="w-3 h-3 text-indigo-600" />}
                        {item.skill === 'speaking' && <Mic className="w-3 h-3 text-purple-600" />}
                        <span>{item.skillLabel}</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.typeBadgeColor}`}>
                        {item.typeBadge}
                      </span>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-1">
                        <GraduationCap className="w-3 h-3 text-emerald-700" />
                        <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                      </span>

                      {item.category && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.category}</span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h4>

                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {item.description}
                      </p>
                    )}

                    {item.statText && (
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                        <span>{item.statText}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {item.skill === 'writing' && item.rawItem ? (
                      <button
                        onClick={() => {
                          onSelectTask?.(item.rawItem);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                        title={isEn ? 'Select this task and return to writing studio' : 'Chọn đề này và quay lại phòng viết'}
                      >
                        <span>{isEn ? 'Practice this task' : 'Luyện đề này'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">ID: {item.id}</span>
                    )}

                    <button
                      onClick={() => onToggleMastered?.(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-300 hover:border-red-200 text-xs font-bold transition-colors cursor-pointer"
                      title={isEn ? 'Unmark "Mastered" to restore into daily practice library' : 'Bỏ đánh dấu "Đã thuộc" để hiện lại trong thư viện luyện tập'}
                    >
                      {isEn ? 'Unmaster (Practice again)' : 'Bỏ thuộc (Ôn tập lại)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: VOCABULARY & MISTAKES NOTEBOOK */}
      {/* ========================================================================= */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isEn ? 'Personal Lexicon & Error Log Journal' : 'Sổ Tay Từ Vựng & Lỗi Sai Thường Gặp'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'C1/C2 academic vocabulary and recurring grammar slips saved during practice'
                  : 'Kho từ vựng C1/C2 và các bẫy ngữ pháp bạn đã lưu trong quá trình luyện viết'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                {vocabList.length} {isEn ? 'Vocabulary' : 'Từ vựng'}
              </span>
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                {mistakes.length} {isEn ? 'Errors' : 'Lỗi sai'}
              </span>
            </div>
          </div>

          {vocabList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-amber-400" />
              <h4 className="text-sm font-bold text-slate-800">
                {isEn ? 'Vocabulary notebook is currently empty' : 'Sổ tay từ vựng hiện đang trống'}
              </h4>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'While writing or reviewing sample essays, click to bookmark any advanced vocabulary here.'
                  : 'Trong lúc viết bài hoặc xem bài mẫu, bạn có thể bấm lưu bất kỳ từ vựng nào vào đây.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vocabList.map((item, i) => (
                <div key={item.id || i} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{item.phrase}</strong>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold uppercase">
                      {item.topic || 'General'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{getLocalizedVocabMeaning(item, isEn)}</p>
                  {item.example && (
                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">"{item.example}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: ACCOUNT & BACKUP SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'account' && (
        <div className="space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3">
              {isEn ? 'Account Information & Cloud Sync' : 'Thông Tin Tài Khoản & Đồng Bộ Đám Mây'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">{isEn ? 'Registered Email' : 'Email đăng ký'}</span>
                <strong className="text-slate-800 text-sm font-bold">{user?.email || (isEn ? 'Guest' : 'Chưa đăng nhập')}</strong>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">{isEn ? 'Sync Status' : 'Trạng thái đồng bộ'}</span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isEn ? 'Supabase Cloud Sync: Active' : 'Supabase Cloud Sync: Đang Bật'}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">{isEn ? 'User ID' : 'User ID (Mã định danh)'}</span>
                <span className="font-mono text-slate-600 text-[11px] bg-slate-100 px-2 py-1 rounded block truncate">
                  {user?.id || 'anonymous-local'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">{isEn ? 'Privacy Policy' : 'Chính sách bảo mật'}</span>
                <span className="text-slate-600">
                  {isEn
                    ? 'Row Level Security (RLS) protects 100% of your personal study data'
                    : 'Row Level Security (RLS) bảo vệ 100% dữ liệu cá nhân'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isEn ? 'Backup & Migrate Study Data (JSON)' : 'Sao Lưu & Di Chuyển Dữ Liệu Học Tập (JSON)'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isEn
                    ? 'Seamlessly export or import all your submissions, vocabulary, and notes across devices or browsers'
                    : 'Giúp bạn chuyển toàn bộ bài làm, từ vựng và ghi chú từ thiết bị khác hoặc localhost sang đây'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onExportAllData && (
                <button
                  onClick={onExportAllData}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Export Data File (.JSON)' : 'Xuất Tệp Dữ Liệu (.JSON)'}</span>
                </button>
              )}

              {onImportData && (
                <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-all shadow-2xs flex items-center space-x-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Import Data File (.JSON) Into Account' : 'Nhập Tệp Dữ Liệu (.JSON) Vào Tài Khoản'}</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {user && (
            <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200/80 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-red-900">
                  {isEn ? 'Sign Out of Account' : 'Đăng Xuất Khỏi Tài Khoản'}
                </h4>
                <p className="text-[11px] text-red-700">
                  {isEn
                    ? 'Your local progress is safely preserved in the cloud for your next login.'
                    : 'Dữ liệu trên máy của bạn sẽ được lưu an toàn trên Cloud cho lần đăng nhập sau.'}
                </p>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>{isEn ? 'Sign Out' : 'Đăng Xuất'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
