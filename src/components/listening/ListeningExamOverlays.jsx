import React from 'react';
import {
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Square,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  Award,
  FileText,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Minimize2,
  MapPin,
  Search,
  Lock
} from 'lucide-react';
import { formatTestTitle, formatTestDescription } from '../../utils/testLocalizationHelper';

/**
 * 1. Authentic CD-IELTS Header Bar for Strict Exam Mode
 */
export function ListeningStrictHeaderBar({
  candidateName,
  candidateId,
  currentTest,
  audioEngine,
  bandResult,
  setIsResultModalOpen,
  setContrastTheme,
  setFontSizeMode,
  onOpenTheory,
  setExamMode,
  toggleSlimHeader,
  isSlimHeader,
  isEn,
  t
}) {
  return (
    <div className="bg-slate-950 text-white px-3 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0 text-xs select-none">
      {/* Candidate ID & Number */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
        <span className="font-mono font-bold tracking-wider truncate">
          {candidateName} (ID: {candidateId})
        </span>
        <span className="hidden md:inline text-slate-400">|</span>
        <span className="hidden md:inline text-slate-400 font-semibold">{currentTest.title}</span>
      </div>

      {/* Center: Headphone Volume Control */}
      <div className="hidden sm:flex items-center space-x-2">
        <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={audioEngine.volume}
          onChange={(e) => audioEngine.changeVolume(parseFloat(e.target.value))}
          className="w-20 sm:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          title={isEn ? "Headphone volume" : "Âm lượng tai nghe"}
        />
      </div>

      {/* Right: Accessibility Controls, Report & Countdown Timer */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {bandResult && (
          <button
            onClick={() => setIsResultModalOpen(true)}
            className="px-2 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] sm:text-xs flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
            title={isEn ? "Review latest test result" : "Xem lại kết quả bài thi lần gần nhất"}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Band </span>
            <span>{bandResult.band.toFixed(1)}</span>
          </button>
        )}

        <button
          onClick={() => setContrastTheme(prev => prev === 'standard' ? 'dark' : prev === 'dark' ? 'yellowOnBlack' : 'standard')}
          className="hidden sm:inline-block px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
          title={isEn ? "Toggle color contrast" : "Đổi độ tương phản màu"}
        >
          Theme
        </button>
        <button
          onClick={() => setFontSizeMode(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal')}
          className="hidden sm:inline-block px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
          title={isEn ? "Toggle font size" : "Đổi cỡ chữ"}
        >
          {isEn ? 'Font' : 'Cỡ chữ'}
        </button>
        {onOpenTheory && (
          <button
            onClick={onOpenTheory}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold border border-slate-700 cursor-pointer flex items-center space-x-1 shrink-0"
            title={isEn ? "Open Listening Theory & Strategies Guide" : "Mở Cẩm Nang Lý Thuyết & Chiến Thuật Listening"}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">{t('listening.theoryHandbook', 'Cẩm Nang')}</span>
          </button>
        )}
        <button
          onClick={() => {
            if (window.confirm(isEn ? 'Do you want to exit Strict Exam Mode and return to Practice Mode?' : 'Bạn có muốn thoát khỏi Chế độ Thi Thử (Strict Mode) để quay về Chế độ Luyện Tập tự do không?')) {
              setExamMode('practice');
            }
          }}
          className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 cursor-pointer shrink-0"
          title={isEn ? "Return to Practice Mode" : "Quay về chế độ luyện tập"}
        >
          {t('listening.exitExam', 'Thoát Thi')}
        </button>

        {/* Workspace Expansion Toggle in Strict Mode (Alt + Z) */}
        {toggleSlimHeader && (
          <button
            type="button"
            onClick={toggleSlimHeader}
            className={`px-2 py-1 rounded-md border text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
              isSlimHeader
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isSlimHeader ? (isEn ? "Collapse workspace, show navbar (Alt + Z)" : "Thu gọn chế độ mở rộng, hiện lại thanh menu website (Alt + Z)") : (isEn ? "Expand workspace, hide navbar (Alt + Z)" : "Mở rộng tối đa phòng thi Listening, ẩn thanh menu trên (Alt + Z)")}
          >
            {isSlimHeader ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSlimHeader ? t('listening.collapseWorkspace', 'Thu gọn') : t('listening.expandWorkspace', 'Mở rộng')}</span>
          </button>
        )}
        <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold text-xs sm:text-sm shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {Math.max(0, Math.floor((audioEngine.duration - audioEngine.currentTime) / 60))}:
            {Math.max(0, Math.floor((audioEngine.duration - audioEngine.currentTime) % 60)).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Crash Recovery, Soft-Quarantine Audio Error & 30s Prep Countdown Banners
 */
export function ListeningStatusBanners({
  resumePrompt,
  hasStartedExam,
  handleResumeExam,
  handleDiscardResume,
  audioEngine,
  currentTest,
  setIsTranscriptOpen,
  setIsLibraryOpen,
  isPrepActive,
  setIsPrepActive,
  activePart,
  prepTimeRemaining,
  isEn
}) {
  return (
    <>
      {/* Crash Recovery / Resume Notification Banner */}
      {resumePrompt && !hasStartedExam && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-semibold border-b border-amber-600 shrink-0">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              {isEn ? (
                <>Unfinished test session detected at <strong>{Math.floor(resumePrompt.savedTime / 60)}m {Math.floor(resumePrompt.savedTime % 60)}s</strong> (Part {resumePrompt.activePart || 1}).</>
              ) : (
                <>Phát hiện bài làm chưa hoàn tất tại thời điểm <strong>{Math.floor(resumePrompt.savedTime / 60)} phút {Math.floor(resumePrompt.savedTime % 60)} giây</strong> (Part {resumePrompt.activePart || 1}).</>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleResumeExam}
              className="px-2.5 py-1 rounded-md bg-slate-950 text-white hover:bg-slate-900 text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Resume Test' : 'Tiếp Tục Làm Bài'}
            </button>
            <button
              onClick={handleDiscardResume}
              className="p-1 hover:bg-amber-600 rounded-md transition-colors cursor-pointer"
              title={isEn ? "Discard previous test session" : "Bỏ qua phiên làm bài cũ"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Soft-Quarantine Safe-Box Banner (when audio fails or has CORS/network error) */}
      {audioEngine.audioState === 'error' && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-3 shadow-xs shrink-0 animate-in fade-in">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    {isEn ? 'Soft-Quarantine Protection: Audio Stream Interrupted' : 'Cơ Chế Bảo Vệ Soft-Quarantine: Gián Đoạn Luồng Âm Thanh'}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                    {isEn ? 'Data Protected' : 'An Toàn Dữ Liệu'}
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  {isEn ? (
                    <>Original audio link unresponsive (CORS or network error). <strong>Your progress and answers are 100% preserved.</strong> You can retry connecting, open Transcripts, or switch to another test.</>
                  ) : (
                    <>Link âm thanh gốc không phản hồi (CORS hoặc lỗi mạng). <strong>Tiến trình và câu trả lời của bạn được bảo toàn 100%.</strong> Bạn có thể thử kết nối lại, mở Lời Thoại để làm tiếp hoặc đổi đề khác.</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => audioEngine.loadAudio(currentTest.audioUrl || currentTest.fallbackAudioUrl)}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
                title={isEn ? "Retry loading audio" : "Thử tải lại âm thanh"}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Retry' : 'Thử Lại'}</span>
              </button>
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                title={isEn ? "Open transcripts to continue" : "Mở gỡ băng lời thoại để làm bài"}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isEn ? 'View Transcript' : 'Xem Lời Thoại'}</span>
              </button>
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                title={isEn ? "Choose another test from library" : "Chọn bộ đề khác từ thư viện"}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isEn ? 'Test Library' : 'Kho Đề'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 30s Preparation Countdown Banner */}
      {isPrepActive && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md shrink-0 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 animate-spin shrink-0" />
            <span>
              {isEn 
                ? `PREPARATION TIME (PART ${activePart}): You have ${prepTimeRemaining}s to quickly scan questions and underline keywords.`
                : `THỜI GIAN ĐỌC ĐỀ & CHUẨN BỊ (PART ${activePart}): Bạn có ${prepTimeRemaining}s để quét nhanh câu hỏi và gạch chân từ khóa.`}
            </span>
          </div>
          <button
            onClick={() => setIsPrepActive(false)}
            className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[11px] font-normal transition-colors cursor-pointer"
          >
            {isEn ? 'Skip countdown' : 'Bỏ qua đếm ngược'}
          </button>
        </div>
      )}
    </>
  );
}

/**
 * 3. Pre-Exam Welcome & Soundcheck Gate Screen
 */
export function ListeningWelcomeGate({
  currentTest,
  isEn,
  setIsSoundcheckOpen,
  handleStartExam
}) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 relative">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-xl mb-5">
          <Headphones className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          CD-IELTS Simulation Engine
        </span>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          {formatTestTitle(currentTest.title, isEn, currentTest)}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mb-6 leading-relaxed">
          {formatTestDescription(currentTest.description, isEn, currentTest)}
        </p>

        {/* Instruction Checklist */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-6 text-left shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'CD-IELTS Guidelines' : 'Quy chế thi máy (CD-IELTS Guidelines)'}</span>
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>
                {isEn ? (
                  <>Audio will play <strong>only once</strong> throughout 4 Parts without pausing (in Strict Exam Mode).</>
                ) : (
                  <>Audio sẽ chỉ phát <strong>01 lần duy nhất</strong> xuyên suốt 4 Part không tạm dừng (trong chế độ Thi Thử).</>
                )}
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>{isEn ? 'You have 30 seconds of prep time before each part and 2 minutes to check answers at the end.' : 'Có 30 giây chuẩn bị trước mỗi phần và 2 phút kiểm tra lại đáp án ở cuối bài.'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>
                {isEn ? (
                  <>Use the <strong>Tab</strong> key on keyboard to quickly switch between fill-in blanks.</>
                ) : (
                  <>Dùng phím <strong>Tab</strong> trên bàn phím để chuyển nhanh giữa các ô điền từ.</>
                )}
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>
                {isEn ? (
                  <>Select any text to reveal the <strong>Highlight (3 colors)</strong> and <strong>Notes</strong> toolbar.</>
                ) : (
                  <>Bôi đen chữ bất kỳ để mở thanh <strong>Tô màu (Highlight 3 màu)</strong> và <strong>Ghi chú</strong>.</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
          <button
            onClick={() => setIsSoundcheckOpen(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>{isEn ? 'Check Audio (Soundcheck)' : 'Kiểm Tra Loa / Tai Nghe'}</span>
          </button>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isEn ? 'Start Test Now' : 'Bắt Đầu Làm Bài Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 4. Left-Pane Sub-Tools (Part Tips Card, Scratchpad View, Synced Transcript View)
 */
export function ListeningPartTipsCard({ activePart, isEn }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>{isEn ? 'Key Tips for Part ' + activePart : 'Mẹo nghe trọng tâm Part ' + activePart}</span>
      </h4>
      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
        {activePart === 1 && (
          <>
            <li>{isEn ? 'Focus on names, numbers, dates, addresses, and postcodes.' : 'Tập trung nghe tên riêng, số điện thoại, ngày tháng, địa chỉ và mã bưu điện.'}</li>
            <li>{isEn ? 'Double check spelling of tricky English consonants (J/G, A/E/I, B/P).' : 'Kiểm tra kỹ các cặp âm dễ nhầm (J/G, A/E/I, B/P).'}</li>
          </>
        )}
        {activePart === 2 && (
          <>
            <li>{isEn ? 'Follow speaker signposts (First, moving on to, on your left, opposite).' : 'Bám sát từ định hướng chỉ dẫn (First, moving on to, on your left, opposite).'}</li>
            <li>{isEn ? 'Beware of distractors where the speaker changes their mind.' : 'Cảnh giác bẫy đổi ý (distractor): người nói đổi thông tin ở câu tiếp theo.'}</li>
          </>
        )}
        {activePart === 3 && (
          <>
            <li>{isEn ? 'Identify agreement vs disagreement between the two speakers.' : 'Phân biệt ý kiến đồng tình và phản bác giữa hai người nói.'}</li>
            <li>{isEn ? 'Focus on the final decision reached by both students/tutors.' : 'Chú ý kết luận/quyết định cuối cùng được cả hai thống nhất.'}</li>
          </>
        )}
        {activePart === 4 && (
          <>
            <li>{isEn ? 'Academic lecture: listen for headings and bullet sub-points.' : 'Bài giảng học thuật: bám theo tiêu đề và các dấu đầu dòng của ghi chú.'}</li>
            <li>{isEn ? 'Only 1 word per blank in most Cambridge Part 4 questions.' : 'Hầu hết Part 4 chỉ cho phép điền DUY NHẤT 1 TỪ, chú ý số lượng từ.'}</li>
          </>
        )}
      </ul>
    </div>
  );
}

export function ListeningScratchpadPane({ scratchpadText, handleScratchpadChange, isEn }) {
  return (
    <div className="space-y-3 h-full flex flex-col text-left">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>{isEn ? 'Listening Scratchpad (Autosaved)' : 'Bản Nháp Nghe (Tự Động Lưu)'}</span>
        </label>
        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          {isEn ? 'Auto-saved' : 'Tự động lưu'}
        </span>
      </div>

      <p className="text-xs text-slate-500">
        {isEn
          ? 'Quickly jot down numbers, name spellings, suspicious keywords, and distractor traps while listening without leaving your workspace.'
          : 'Ghi nhanh số liệu, đánh vần tên riêng, từ khóa nghi vấn và bẫy nghe (distractor) ngay khi nghe mà không cần rời phòng thi.'}
      </p>

      <textarea
        value={scratchpadText}
        onChange={(e) => handleScratchpadChange(e.target.value)}
        placeholder={isEn ? "Type quick notes, numbers, spellings, keywords..." : "Ghi chú nhanh số điện thoại, đánh vần tên riêng, từ khóa..."}
        rows={14}
        className="w-full flex-1 p-3.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed resize-none bg-amber-50/20 shadow-inner"
      />

      <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
        <span>{isEn ? `${scratchpadText.trim() ? scratchpadText.trim().split(/\s+/).length : 0} words` : `${scratchpadText.trim() ? scratchpadText.trim().split(/\s+/).length : 0} từ`}</span>
        <button
          type="button"
          onClick={() => handleScratchpadChange('')}
          className="text-slate-500 hover:text-red-600 transition-colors cursor-pointer text-[10px] font-bold"
        >
          {isEn ? 'Clear notes' : 'Xóa nội dung'}
        </button>
      </div>
    </div>
  );
}

export function ListeningInlineTranscriptPane({
  examMode,
  isSubmitted,
  setExamMode,
  transcriptSearch,
  setTranscriptSearch,
  setIsTranscriptOpen,
  currentPartData,
  audioEngine,
  isEn
}) {
  return (
    <div className="space-y-3 text-left">
      {examMode === 'strict' && !isSubmitted ? (
        <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
          <Lock className="w-10 h-10 text-amber-600 mx-auto" />
          <h4 className="font-bold text-sm text-amber-950">
            {isEn ? 'Transcript Locked in Exam Mode' : 'Lời Thoại Khóa Trong Chế Độ Thi Thử'}
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto">
            {isEn
              ? 'To ensure authentic Cambridge exam conditions, transcripts unlock after test submission to review mistakes, or when practicing in Practice Mode.'
              : 'Để đảm bảo tính nghiêm túc chuẩn Cambridge, lời thoại sẽ tự động mở khóa sau khi nộp bài để tra cứu câu sai, hoặc khi làm trong Chế độ Luyện Tập.'}
          </p>
          <button
            type="button"
            onClick={() => setExamMode('practice')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {isEn ? 'Switch to Practice Mode' : 'Chuyển sang Chế độ Luyện Tập'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                placeholder={isEn ? "Search transcript lines or keywords..." : "Tìm từ khóa trong lời thoại..."}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsTranscriptOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
              title="Open Fullscreen Karaoke Modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Fullscreen' : 'Phóng to'}</span>
            </button>
          </div>

          {/* Real-time Synced Transcript Sentences */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {(currentPartData.transcripts || [])
              .filter(s => !transcriptSearch || s.text.toLowerCase().includes(transcriptSearch.toLowerCase()) || (s.speaker && s.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())))
              .map((s, idx) => {
                const isSentenceActive = audioEngine.currentTime >= s.start && audioEngine.currentTime < s.end;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      audioEngine.seek(s.start);
                      if (!audioEngine.isPlaying) audioEngine.play();
                    }}
                    className={`p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                      isSentenceActive
                        ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                      <span className="font-bold text-slate-700">{s.speaker || `Speaker`}</span>
                      <span className={isSentenceActive ? 'text-purple-700 font-bold' : 'text-slate-400'}>
                        {Math.floor(s.start / 60)}:{String(Math.floor(s.start % 60)).padStart(2, '0')}
                      </span>
                    </div>
                    <p className={isSentenceActive ? 'text-purple-950 font-medium' : 'text-slate-700'}>
                      {s.text}
                    </p>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 5. Soundcheck Modal Content, Fullscreen Map Modal & Confirm Submit Modal
 */
export function ListeningSoundcheckModalContent({
  isSoundchecking,
  soundcheckVolume,
  handlePlaySoundcheck,
  handleStopSoundcheck,
  handleSoundcheckVolumeChange,
  setIsSoundcheckOpen,
  isEn
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-slate-900 text-base">
                {isEn ? 'Audio Check (Soundcheck)' : 'Kiểm Tra Âm Thanh (Soundcheck)'}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                CD-IELTS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isEn ? 'Test headphones & audio clarity before beginning test' : 'Kiểm tra tai nghe & độ to rõ trước khi bắt đầu bài thi'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            handleStopSoundcheck();
            setIsSoundcheckOpen(false);
          }}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title={isEn ? "Close window" : "Đóng cửa sổ"}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sound Wave Indicator & State Banner */}
      <div className={`p-4 rounded-xl border mb-4 text-center transition-all ${
        isSoundchecking 
          ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200 shadow-inner' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-center space-x-1 mb-2">
          <div className={`w-1 rounded-full transition-all ${isSoundchecking ? 'bg-emerald-500 h-5 animate-pulse' : 'bg-slate-300 h-2'}`} />
          <div className={`w-1 rounded-full transition-all ${isSoundchecking ? 'bg-emerald-500 h-7 animate-bounce' : 'bg-slate-300 h-2'}`} style={{ animationDelay: '100ms' }} />
          <div className={`w-1 rounded-full transition-all ${isSoundchecking ? 'bg-emerald-500 h-4 animate-pulse' : 'bg-slate-300 h-2'}`} style={{ animationDelay: '200ms' }} />
          <div className={`w-1 rounded-full transition-all ${isSoundchecking ? 'bg-emerald-500 h-6 animate-bounce' : 'bg-slate-300 h-2'}`} style={{ animationDelay: '300ms' }} />
          <div className={`w-1 rounded-full transition-all ${isSoundchecking ? 'bg-emerald-500 h-3 animate-pulse' : 'bg-slate-300 h-2'}`} style={{ animationDelay: '150ms' }} />
        </div>
        <p className={`text-xs font-bold ${isSoundchecking ? 'text-emerald-800' : 'text-slate-700'}`}>
          {isSoundchecking 
            ? (isEn ? '🔔 Playing Harmonic Chime & IELTS Soundcheck Speech...' : '🔔 Đang phát chuông Harmonic Chime & Giọng đọc kiểm tra IELTS...') 
            : (isEn ? 'Click "Play Chime & Voice Sample" below to test headphones/speakers.' : 'Bấm nút "Phát Chuông & Giọng Mẫu" bên dưới để kiểm tra loa / tai nghe.')}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {isEn ? 'Audio rendered instantly via Web Audio API, 100% network-fault tolerant.' : 'Âm thanh được phát tức thì qua Web Audio API 100% không lo lỗi mạng.'}
        </p>
      </div>

      {/* Volume Slider Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 mb-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span className="flex items-center space-x-1.5">
            {soundcheckVolume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{isEn ? 'Adjust headphone volume:' : 'Điều chỉnh âm lượng tai nghe:'}</span>
          </span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
            {Math.round(soundcheckVolume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={soundcheckVolume}
          onChange={(e) => handleSoundcheckVolumeChange(e.target.value)}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>{isEn ? '0% (Muted)' : '0% (Tắt tiếng)'}</span>
          <span>{isEn ? '50% (Medium)' : '50% (Vừa)'}</span>
          <span>{isEn ? '100% (Max)' : '100% (Tối đa)'}</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-5 text-[11px] text-slate-600 space-y-1.5">
        <div className="flex items-start space-x-2">
          <span className="text-emerald-600 font-bold">✓</span>
          <span>{isEn ? 'Put on headphones and verify audio is clear and balanced in both ears.' : 'Hãy đeo tai nghe và kiểm tra xem cả hai bên tai có nghe rõ và đều nhau không.'}</span>
        </div>
        <div className="flex items-start space-x-2">
          <span className="text-emerald-600 font-bold">✓</span>
          <span>{isEn ? 'Once exam starts, audio will play continuously across all 4 Parts.' : 'Sau khi bắt đầu bài thi thật, âm thanh sẽ phát liên tục suốt 4 Parts.'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {isSoundchecking ? (
          <button
            type="button"
            onClick={handleStopSoundcheck}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{isEn ? 'Stop Audio' : 'Dừng Âm Thanh'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlaySoundcheck}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isEn ? 'Play Chime & Voice Sample' : 'Phát Chuông & Giọng Mẫu'}</span>
          </button>
        )}

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              handleStopSoundcheck();
              setIsSoundcheckOpen(false);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
          <button
            type="button"
            onClick={() => {
              handleStopSoundcheck();
              setIsSoundcheckOpen(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Audio Is Clear' : 'Tôi Đã Nghe Rõ'}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export function ListeningFullscreenMapModal({ isOpen, mapGroup, onClose, isEn }) {
  if (!isOpen || !mapGroup) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between text-white mb-2">
        <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{isEn ? 'Detailed Map / Diagram View' : 'Bản Đồ / Sơ Đồ Toàn Cảnh'}</span>
        </h3>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>{isEn ? 'Close' : 'Đóng'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-2">
        <img
          src={mapGroup.mapImageUrl}
          alt="IELTS Listening Map Large"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
}

export function ListeningConfirmSubmitModal({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
  isEn
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEn ? 'Confirm Exam Submission' : 'Xác Nhận Nộp Bài Thi'}
            </h3>
            <p className="text-xs text-slate-500">IELTS Listening Simulation Check</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{isEn ? 'Completed questions:' : 'Số câu đã hoàn thành:'}</span>
            <span className="font-bold text-slate-900">
              {isEn ? `${answeredCount} / ${totalQuestions} questions` : `${answeredCount} / ${totalQuestions} câu`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{isEn ? 'Unanswered questions:' : 'Số câu chưa điền:'}</span>
            <span className={"font-bold " + (totalQuestions - answeredCount > 0 ? 'text-amber-600' : 'text-emerald-600')}>
              {isEn ? `${totalQuestions - answeredCount} questions` : `${totalQuestions - answeredCount} câu`}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          {isEn 
            ? 'Upon submission, your test will be evaluated against official Cambridge Band Score standards, unlocking Audio Evidence Locator and detailed explanations.'
            : 'Sau khi nộp bài, hệ thống sẽ tự động chấm điểm theo thang điểm Cambridge Official Band Score, mở khóa Audio Evidence Locator và bản dịch phân tích chi tiết.'}
        </p>

        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {isEn ? 'Continue Test' : 'Tiếp Tục Làm Bài'}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Confirm Submit' : 'Xác Nhận Nộp Bài'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
