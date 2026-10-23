import React from 'react';
import {
  Layers, Sparkles, PenTool, Clock, Play, GraduationCap,
  Volume2, ShieldCheck, Info, ChevronRight
} from 'lucide-react';

export default function SpeakingMockHero({
  isEn,
  isChrome,
  isEdge,
  allMockPacks = [],
  activeMockPack,
  activeExaminer,
  selectedMockId,
  setSelectedMockId,
  filteredMockPacks = [],
  currentPackIndex = 0,
  mockFilter,
  setMockFilter,
  mockPackCounts = {},
  mockP1,
  mockP2,
  mockP3,
  masteredIds = [],
  onToggleMastered,
  handlePrevPack,
  handleNextPack,
  handleDeleteCustomPack,
  handleEnterExamRoom,
  handleReadQuestion,
  speechEngine,
  setIsMockLibraryOpen,
  setIsGeneratorOpen,
  setGeneratorInitialMode,
  setIsSoundcheckOpen
}) {
  // Tạm thời ẩn tất cả các nút sinh đề bằng AI trên giao diện để tinh gọn theo yêu cầu
  const SHOW_AI_GENERATOR_BUTTONS = false;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* Top Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {isEn ? '100% IDP / BC Exam Simulation' : 'Mô Phỏng 100% Khảo Thí IDP / BC'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">• {isEn ? '11 – 14 Min Standard' : '11 – 14 Phút Chuẩn Mực'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isEn ? 'IELTS Speaking Mock Exam Room with AI Examiner' : 'Phòng Thi Thử IELTS Speaking Với Giám Khảo AI'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed hidden sm:block">
              {isEn
                ? 'Live 1-on-1 voice interaction with AI Examiner: Part 1 interview, 60s Part 2 cue card scratchpad, and deep analytical follow-up questions in Part 3.'
                : 'Trải nghiệm tương tác giọng nói 1-on-1 trực tiếp với Giám khảo AI: hỏi đáp Part 1, 60s nháp ghi chú Part 2, và câu hỏi follow-up phản biện chuyên sâu ở Part 3.'}
            </p>

            {/* Persistent Browser Advice Box */}
            <div className={`mt-3 p-2.5 rounded-xl border text-xs hidden sm:flex items-center space-x-2.5 ${
              isChrome 
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200' 
                : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
            }`}>
              <span className="text-base">{isChrome ? '🚀' : '💡'}</span>
              <div className="leading-snug">
                {isChrome ? (
                  <span><strong>{isEn ? 'Optimal browser:' : 'Trình duyệt tối ưu:'}</strong> {isEn ? 'You are using Google Chrome, fully optimized for Web Speech & Audio.' : 'Bạn đang dùng Google Chrome chuẩn 100% cho Web Speech & Audio.'}</span>
                ) : (
                  <span>
                    <strong>{isEn ? 'Google Chrome recommended:' : 'Khuyên dùng Google Chrome:'}</strong> {isEn ? `If you are using ${isEdge ? 'Microsoft Edge' : 'another browser'} and do not hear examiner audio, please open in ` : `Nếu bạn đang dùng ${isEdge ? 'Microsoft Edge' : 'trình duyệt khác'} và không nghe thấy tiếng Giám khảo đọc, vui lòng mở trang này trên `}<strong>Google Chrome</strong>{isEn ? ' for the most stable experience.' : ' để chạy ổn định nhất.'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Examiner Card with Voice Test & Instant Enter Button */}
          <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-2xl shrink-0">
                {activeExaminer.avatar}
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  {isEn ? 'Exam Examiner' : 'Giám Khảo Khảo Thí'}
                </span>
                <span className="font-extrabold text-sm text-white block">{activeExaminer.name}</span>
                <button
                  onClick={() => handleReadQuestion(`Good morning. I am ${activeExaminer.name}. Welcome to your IELTS Speaking test.`)}
                  className="text-[11px] text-purple-300 hover:text-purple-200 font-bold flex items-center space-x-1 mt-0.5 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{speechEngine?.isSpeaking ? (isEn ? 'Speaking...' : 'Đang đọc...') : (isEn ? 'Voice sample' : 'Nghe giọng đọc')}</span>
                </button>
              </div>
            </div>

            {/* Primary Enter Mock Test CTA */}
            <button
              onClick={handleEnterExamRoom}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-950/70 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
              title={isEn ? 'Start live mock exam with AI examiner' : 'Bắt đầu buổi thi thử trực tiếp với Giám khảo AI'}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isEn ? 'Start Mock Exam' : 'Bắt Đầu Thi Thử'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Mock Test Pack - Representative Card + Quick Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{isEn ? 'Selected Mock Test Pack (Representative)' : 'Bộ Đề Thi Thử Đang Chọn (Đại Diện)'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {allMockPacks.length} {isEn ? 'Test Packs (Cambridge Standard, Manual & AI Generated)' : 'Gói đề thi (Chuẩn Cambridge, Thủ công & AI Tự Sinh)'} • {isEn ? 'Showing active test pack to maximize workspace space' : 'Chỉ hiển thị đề thi đại diện để tối ưu không gian toàn màn hình'}
            </span>
          </div>

          {/* ACTION BUTTONS: KHO ĐỀ MODAL + GENERATOR */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMockLibraryOpen(true)}
              className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/50 font-bold text-xs shadow-md shadow-purple-950/40 flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-[1.02] shrink-0"
              title={isEn ? 'View all test packs in full library modal' : 'Mở toàn bộ kho đề thi trong cửa sổ riêng để tiết kiệm diện tích'}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>📚 {isEn ? `Open Test Library (${allMockPacks.length})` : `Kho Đề Speaking (${allMockPacks.length} Đề)`}</span>
            </button>

            <button
              onClick={() => {
                setGeneratorInitialMode('manual');
                setIsGeneratorOpen(true);
              }}
              className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-[1.02] shrink-0"
              title={isEn ? 'Create custom Speaking test pack manually' : 'Tự tay tạo bộ đề Speaking mới theo chủ đề mong muốn'}
            >
              <PenTool className="w-4 h-4" />
              <span>{isEn ? '✍️ Create Manually' : '✍️ Tạo Đề Thủ Công'}</span>
            </button>

            {/* AI Generator Button (Tạm thời ẩn theo yêu cầu) */}
            {SHOW_AI_GENERATOR_BUTTONS && (
              <button
                onClick={() => {
                  setGeneratorInitialMode('ai');
                  setIsGeneratorOpen(true);
                }}
                className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/40 flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-[1.02] shrink-0"
                title={isEn ? 'Use AI to generate new Speaking test pack' : 'Dùng AI để tạo bộ đề thi Speaking mới theo chủ đề mong muốn'}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEn ? 'Generate Pack (AI)' : 'Sinh Bộ Đề Mới (AI)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* FILTER PILLS & SWITCHER */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* On Mobile: Compact Filter Dropdown */}
          <div className="flex sm:hidden items-center space-x-1.5 flex-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">{isEn ? 'Filter:' : 'Lọc:'}</span>
            <select
              value={mockFilter}
              onChange={(e) => setMockFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-purple-300 font-bold focus:outline-hidden focus:border-purple-500 flex-1 truncate cursor-pointer"
            >
              <option value="all">{isEn ? `All Tests (${mockPackCounts.all})` : `Tất Cả (${mockPackCounts.all})`}</option>
              <option value="cambridge">🏛️ {isEn ? `Cambridge Standard (${mockPackCounts.cambridge})` : `Chuẩn Cam (${mockPackCounts.cambridge})`}</option>
              <option value="manual">✍️ {isEn ? `Manual Custom (${mockPackCounts.manual})` : `Thủ Công (${mockPackCounts.manual})`}</option>
              <option value="ai">🤖 {isEn ? `AI Generated (${mockPackCounts.ai})` : `AI Sinh (${mockPackCounts.ai})`}</option>
            </select>
          </div>

          {/* On Desktop: Full Pills */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMockFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mockFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'All' : 'Tất Cả'} ({mockPackCounts.all})
            </button>
            <button
              type="button"
              onClick={() => setMockFilter('cambridge')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'cambridge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>🏛️ {isEn ? 'Cambridge Standard' : 'Chuẩn Cambridge'} ({mockPackCounts.cambridge})</span>
            </button>
            <button
              type="button"
              onClick={() => setMockFilter('manual')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'manual'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>✍️ {isEn ? 'Manual' : 'Thủ Công'} ({mockPackCounts.manual})</span>
            </button>
            <button
              type="button"
              onClick={() => setMockFilter('ai')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'ai'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-purple-300 hover:text-purple-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>🤖 {isEn ? 'AI Generated' : 'AI Sinh'} ({mockPackCounts.ai})</span>
            </button>
          </div>

          {/* Quick Switcher Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold hidden md:inline">
              {isEn ? 'Switch pack:' : 'Chuyển đề:'}
            </span>
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={handlePrevPack}
                disabled={filteredMockPacks.length <= 1}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title={isEn ? "Previous test pack" : "Bộ đề phía trước"}
              >
                ◀
              </button>
              <span className="px-2 text-xs font-black text-purple-300 min-w-[60px] text-center">
                {filteredMockPacks.length > 0 ? `${currentPackIndex + 1} / ${filteredMockPacks.length}` : '0 / 0'}
              </span>
              <button
                type="button"
                onClick={handleNextPack}
                disabled={filteredMockPacks.length <= 1}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title={isEn ? "Next test pack" : "Bộ đề tiếp theo"}
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* REPRESENTATIVE SELECTED PACK CARD */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-purple-500/60 shadow-xl shadow-purple-950/40 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Badges & Switcher Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {activeMockPack.difficulty} • Target {activeMockPack.targetBand}
              </span>

              {masteredIds.includes(activeMockPack.id) && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                </span>
              )}

              {(activeMockPack.isCambridge || !activeMockPack.isCustom) && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  🏛️ {activeMockPack.cambridgeBook ? (isEn ? `Cam ${activeMockPack.cambridgeBook}` : `Chuẩn Cam ${activeMockPack.cambridgeBook}`) : 'Cambridge Standard'}
                </span>
              )}

              {(activeMockPack.isManual || (activeMockPack.isCustom && !activeMockPack.isAiGenerated)) && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <PenTool className="w-3 h-3" />
                  <span>{isEn ? '✍️ Manual' : '✍️ Thủ Công'}</span>
                </span>
              )}

              {activeMockPack.isAiGenerated && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{isEn ? 'AI Gen' : 'AI Sinh'}</span>
                </span>
              )}

              <span className="text-xs text-slate-400 font-bold flex items-center space-x-1 pl-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeMockPack.estTime || '11 – 14 Mins'}</span>
              </span>
            </div>

            {/* Direct Dropdown Switcher */}
            <div className="flex items-center space-x-2 shrink-0">
              <select
                value={selectedMockId}
                onChange={(e) => setSelectedMockId(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-hidden focus:border-purple-500 max-w-[240px] sm:max-w-[280px] truncate cursor-pointer"
              >
                {filteredMockPacks.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsMockLibraryOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-1 cursor-pointer transition-colors"
                title={isEn ? "Open full mock library" : "Mở toàn bộ kho đề"}
              >
                <span>{isEn ? 'All Packs' : 'Tất cả đề'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Summary */}
          <div className="space-y-1.5 relative z-10">
            <h4 className="text-lg sm:text-xl font-black text-white leading-snug">
              {activeMockPack.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeMockPack.summary}
            </p>
          </div>

          {/* Footer Info & Controls */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                {isEn ? 'Parts 1, 2, 3 included' : 'Đầy đủ Part 1, 2, 3'}
              </span>
              <span className="text-[11px] text-slate-500">
                • {isEn ? 'Full Mock Simulation' : 'Khảo Thí Hoàn Chỉnh'}
              </span>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto">
              {onToggleMastered && (
                <button
                  type="button"
                  onClick={() => onToggleMastered(activeMockPack.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer ${
                    masteredIds.includes(activeMockPack.id)
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? (masteredIds.includes(activeMockPack.id) ? 'Mastered' : 'Master') : (masteredIds.includes(activeMockPack.id) ? 'Đã thuộc đề' : 'Thuộc đề')}</span>
                </button>
              )}

              {activeMockPack.isCustom && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteCustomPack(activeMockPack.id, e)}
                  className="text-slate-500 hover:text-rose-400 px-2 py-1 rounded-lg transition-colors text-xs font-bold cursor-pointer"
                  title={isEn ? 'Delete this generated pack' : 'Xóa bộ đề tự sinh này'}
                >
                  {isEn ? 'Delete' : 'Xóa đề'}
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsMockLibraryOpen(true)}
                className="px-3 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 text-xs font-bold border border-purple-500/30 flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <span>{isEn ? 'Change Pack' : 'Đổi đề khác'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Details Breakdown (Part 1, 2, 3 Overview) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>{isEn ? 'Detailed Structure of Selected Pack' : 'Cấu Trúc Chi Tiết Của Gói Đề Đang Chọn'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Part 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400">
              <span>{isEn ? 'PART 1: Interview' : 'PART 1: Phỏng Vấn'}</span>
              <span>{isEn ? '4 - 5 mins' : '4 - 5 phút'}</span>
            </div>
            <h5 className="text-xs font-bold text-slate-200">{mockP1.title}</h5>
            <p className="text-[11px] text-slate-400">{mockP1.questions?.length || 3} {isEn ? 'questions on daily habits & personal perspectives' : 'câu hỏi về thói quen, góc nhìn cá nhân'}</p>
          </div>

          {/* Part 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400">
              <span>{isEn ? 'PART 2: Cue Card' : 'PART 2: Cue Card'}</span>
              <span>{isEn ? '3 - 4 mins' : '3 - 4 phút'}</span>
            </div>
            <h5 className="text-xs font-bold text-slate-200 line-clamp-1">{mockP2.title}</h5>
            <p className="text-[11px] text-slate-400">{isEn ? '1 min 4-box matrix scratchpad + 2 mins continuous speaking' : '1 phút nháp 4 ô ma trận + 2 phút nói liên tục'}</p>
          </div>

          {/* Part 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400">
              <span>{isEn ? 'PART 3: Discussion' : 'PART 3: Thảo Luận'}</span>
              <span>{isEn ? '4 - 5 mins' : '4 - 5 phút'}</span>
            </div>
            <h5 className="text-xs font-bold text-slate-200">{mockP3.topic}</h5>
            <p className="text-[11px] text-slate-400">{mockP3.questions?.length || 3} {isEn ? 'analytical & follow-up questions' : 'câu hỏi phản biện & câu hỏi follow-up'}</p>
          </div>
        </div>

        {/* Ready Action Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-800/50 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3.5 sm:gap-4 overflow-hidden">
          <div className="text-xs text-slate-300 text-left min-w-0 flex-1 space-y-1">
            <span className="font-bold text-white block text-sm sm:text-base leading-snug">
              {isEn ? 'Ready to test with: ' : 'Sẵn sàng thi với gói: '}<span className="text-purple-300 font-extrabold">{activeMockPack.title}</span>?
            </span>
            <span className="text-slate-400 text-xs block leading-relaxed">
              {isEn
                ? `Examiner ${activeExaminer.name} (${activeExaminer.accent}) • 11 – 14 mins • Full 3 Parts Cambridge standard`
                : `Giám khảo ${activeExaminer.name} (${activeExaminer.accent}) • 11 – 14 phút • Đầy đủ 3 Parts chuẩn Cambridge`}
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-start sm:justify-end gap-2 sm:gap-2.5 w-full xl:w-auto shrink-0 pt-2.5 xl:pt-0 border-t border-purple-800/30 xl:border-t-0">
            {onToggleMastered && (
              <button
                type="button"
                onClick={() => onToggleMastered(selectedMockId)}
                className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs border flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
                  masteredIds.includes(selectedMockId)
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                }`}
                title={
                  masteredIds.includes(selectedMockId)
                    ? (isEn ? 'Mastered pack (Click to unmark)' : 'Đã thuộc gói đề này (Bấm để bỏ đánh dấu)')
                    : (isEn ? 'Mark this pack as mastered' : 'Đánh dấu đã thuộc gói đề này')
                }
              >
                <GraduationCap
                  className={`w-4 h-4 ${
                    masteredIds.includes(selectedMockId) ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span>{isEn ? (masteredIds.includes(selectedMockId) ? 'Mastered' : 'Master') : (masteredIds.includes(selectedMockId) ? 'Đã Thuộc' : 'Thuộc Đề')}</span>
              </button>
            )}

            <button
              onClick={() => setIsSoundcheckOpen(true)}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white font-bold text-xs border border-purple-500/30 flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
              title={isEn ? 'Check speakers and microphone before testing' : 'Kiểm tra loa và mic trước khi vào thi'}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isEn ? 'Check Equipment' : 'Kiểm Tra Thiết Bị'}</span>
            </button>

            <button
              onClick={handleEnterExamRoom}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
              title={isEn ? 'Start selected mock test' : 'Bắt đầu làm gói đề thi đang chọn'}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isEn ? 'Start This Test' : 'Vào Thi Đề Này'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
