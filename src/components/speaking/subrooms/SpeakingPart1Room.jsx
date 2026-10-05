import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Trash2,
  Plus,
  Volume2,
  Mic,
  MicOff,
  Loader2,
  Square,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import SpeechWaveVisualizer from '../SpeechWaveVisualizer';
import SpeakingFillerTracker from '../SpeakingFillerTracker';
import { openTheoryModalWithContext } from '../../../services/theoryContextService';

/**
 * SpeakingPart1Room Sub-component
 * Encapsulates Cambridge IELTS Speaking Part 1 (Introduction & Interview):
 * - Topic control bar, filter mastered topics, AI topic generator trigger
 * - Topic selector pills (Community vs Custom badges, Mastered flags)
 * - Current question card, examiner audio reading, delete question
 * - Interactive microphone recorder, real-time wave visualizer, transcript & AI audio refinement
 * - Speaking filler words tracker (Fluency metric)
 * - Vocabulary Band 7+ hints with notebook saving
 * - Band 8.5+ sample answers (A.R.E.A framework)
 * - Question navigation (Next/Prev)
 */
export default function SpeakingPart1Room({
  part1Topics = [],
  selectedP1TopicId,
  setSelectedP1TopicId,
  activeP1QuestionIndex = 0,
  setActiveP1QuestionIndex,
  activeP1Topic,
  currentP1Question,
  hideMastered,
  handleToggleHideMastered,
  masteredIds = [],
  onToggleMastered,
  onDeleteP1Topic,
  onDeleteP1Question,
  onOpenTopicModal,
  onOpenQuickAddQ,
  showVocabHints,
  setShowVocabHints,
  showSampleAnswer,
  setShowSampleAnswer,
  handleReadText,
  speechEngine,
  isMicConnecting,
  handleTogglePracticeRecord,
  micErrorDetail,
  handleRequestMicPermissionDirectly,
  setMicErrorDetail,
  refinedClips = {},
  isRefiningTranscript,
  refiningClipKey,
  handleRefineTranscriptWithAI,
  onSaveToVocabNotebook,
  renderAudioPlayback
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Part 1 Topic Control Bar with AI Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2.5 flex-wrap">
          <span className="text-xs font-bold text-slate-200">Chủ đề phỏng vấn:</span>
          <span className="text-[11px] text-purple-300 font-semibold bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/40">
            {part1Topics.length} chủ đề
          </span>

          {/* Ẩn chủ đề đã thuộc Checkbox */}
          <label className="flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer select-none px-2 py-0.5 rounded-lg hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              checked={hideMastered}
              onChange={handleToggleHideMastered}
              className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span className="whitespace-nowrap font-medium text-[11px]">Ẩn chủ đề đã thuộc</span>
          </label>
        </div>

        <button
          onClick={() => onOpenTopicModal && onOpenTopicModal(1)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center justify-center space-x-1.5 shadow-md shadow-purple-900/40 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>+ Sinh Chủ Đề & Câu Hỏi Part 1 Bằng AI</span>
        </button>
      </div>

      {/* Topic Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {/* Front AI button */}
        <button
          onClick={() => onOpenTopicModal && onOpenTopicModal(1)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-600/50 text-xs font-bold whitespace-nowrap flex items-center space-x-1 cursor-pointer shrink-0"
          title="Sinh chủ đề luyện tập Part 1 mới bằng AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>+ Tạo Mới (AI)</span>
        </button>

        {(hideMastered ? part1Topics.filter(t => !masteredIds.includes(t.id)) : part1Topics).map(topic => (
          <div key={topic.id} className="relative group shrink-0">
            <button
              onClick={() => {
                setSelectedP1TopicId(topic.id);
                setActiveP1QuestionIndex(0);
                setShowSampleAnswer(false);
                if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedP1TopicId === topic.id
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{topic.title}</span>
              {masteredIds.includes(topic.id) && (
                <GraduationCap className="w-3 h-3 text-emerald-400 shrink-0" title="Chủ đề đã thuộc" />
              )}
              {topic.isCommunity || (topic.isPublic && topic.isCustom) ? (
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/80 rounded text-emerald-300 border border-emerald-500/40">
                  🌐 Cộng Đồng
                </span>
              ) : topic.isCustom ? (
                <span className="text-[9px] px-1.5 py-0.2 bg-amber-950/80 rounded text-amber-300 border border-amber-500/40">
                  🔒 Riêng
                </span>
              ) : null}
            </button>
          </div>
        ))}
      </div>

      {/* Question Card */}
      {currentP1Question && activeP1Topic && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Câu {activeP1QuestionIndex + 1} / {activeP1Topic.questions?.length || 1}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{activeP1Topic.title}</span>
              {onToggleMastered && activeP1Topic.id && (
                <button
                  type="button"
                  onClick={() => onToggleMastered(activeP1Topic.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer border ${
                    masteredIds.includes(activeP1Topic.id)
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                  }`}
                  title={
                    masteredIds.includes(activeP1Topic.id)
                      ? 'Đã thuộc chủ đề này (Bấm để bỏ đánh dấu)'
                      : 'Đánh dấu đã thuộc chủ đề này'
                  }
                >
                  <GraduationCap className="w-3 h-3" />
                  <span>{masteredIds.includes(activeP1Topic.id) ? 'Đã thuộc' : 'Thuộc chủ đề'}</span>
                </button>
              )}
              {activeP1Topic.isCustom && onDeleteP1Topic && (
                <button
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc muốn xóa chủ đề "${activeP1Topic.title}"?`)) {
                      onDeleteP1Topic(activeP1Topic.id);
                    }
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                  title="Xóa chủ đề tự tạo này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onOpenQuickAddQ && onOpenQuickAddQ()}
                className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 transition-colors cursor-pointer flex items-center space-x-1"
                title="Thêm câu hỏi mới vào chủ đề hiện tại"
              >
                <Plus className="w-3 h-3" />
                <span>+ Thêm Câu Hỏi</span>
              </button>
              <button
                onClick={() => setShowVocabHints(!showVocabHints)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                {showVocabHints ? 'Ẩn Gợi Ý Từ Vựng' : 'Hiện Từ Vựng Band 7+'}
              </button>
              <button
                onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 transition-colors cursor-pointer"
              >
                {showSampleAnswer ? 'Ẩn Bài Mẫu' : 'Xem Bài Mẫu 8.5'}
              </button>
              <button
                type="button"
                onClick={() => openTheoryModalWithContext({
                  skill: 'speaking',
                  category: 'part1',
                  subType: 'area',
                  topicId: 'area-framework-part1',
                  title: 'Khung A.R.E.A - Trả Lời Tự Nhiên & Chuẩn Độ Dài Part 1'
                })}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold border border-indigo-700/50 transition-colors cursor-pointer flex items-center space-x-1"
                title="Mở cẩm nang khung phản xạ 3 câu A.R.E.A Part 1"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Cẩm Nang A.R.E.A</span>
                <span className="sm:hidden">A.R.E.A</span>
              </button>
            </div>
          </div>

          {/* The Question Text with Examiner Voice */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Câu hỏi khảo thí:</span>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleReadText && handleReadText(currentP1Question.question)}
                  className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{speechEngine?.isSpeaking ? 'Đang đọc...' : 'Nghe Giám khảo đọc câu hỏi'}</span>
                </button>
                {(currentP1Question?.qId?.includes('user') || activeP1Topic.isCustom || (activeP1Topic.questions && activeP1Topic.questions.length > 1)) && onDeleteP1Question && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc muốn xóa câu hỏi này khỏi chủ đề ("${(currentP1Question.question || '').substring(0, 45)}...")?`)) {
                        const targetQId = currentP1Question.qId || currentP1Question.id;
                        onDeleteP1Question(activeP1Topic.id, targetQId);
                        setActiveP1QuestionIndex(prev => Math.max(0, prev - 1));
                      }
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                    title="Xóa câu hỏi này khỏi chủ đề"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed">
              "{currentP1Question.question}"
            </h2>
            {currentP1Question.strategy && (
              <p className="text-xs text-slate-400 italic">
                💡 {currentP1Question.strategy}
              </p>
            )}
          </div>

          {/* Interactive Recorder Box */}
          <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
            speechEngine?.isListening 
              ? 'bg-slate-950 border-rose-500/60 shadow-xl shadow-rose-950/40 ring-2 ring-rose-500/30' 
              : isMicConnecting
              ? 'bg-slate-950 border-amber-500/60 shadow-xl shadow-amber-950/40 ring-2 ring-amber-500/30'
              : 'bg-slate-950 border-slate-800/90'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  speechEngine?.isListening 
                    ? 'bg-rose-950 text-rose-400 border-rose-500/50 animate-pulse' 
                    : isMicConnecting
                    ? 'bg-amber-950 text-amber-400 border-amber-500/50 animate-spin'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {speechEngine?.isListening ? <Mic className="w-4 h-4" /> : isMicConnecting ? <Loader2 className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block text-white">
                    {speechEngine?.isListening ? '🔴 Đang Thu Âm Trả Lời' : isMicConnecting ? '⏳ Đang Kích Hoạt Micro...' : 'Luyện Nói Cho Câu Này'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {speechEngine?.isListening 
                      ? 'Giọng bạn đang được phân tích trực tiếp' 
                      : isMicConnecting
                      ? 'Vui lòng bấm Cho Phép nếu trình duyệt yêu cầu'
                      : 'Bấm nút "Bật Micro Luyện Nói" bên dưới để trả lời'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {speechEngine?.isListening ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-black animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>REC<span className="hidden sm:inline"> • MICRO ĐANG BẬT</span></span>
                  </span>
                ) : isMicConnecting ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>ĐANG KẾT NỐI</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold">
                    <span>ĐÃ TẮT MIC</span>
                  </span>
                )}
                {speechEngine?.isListening && (
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">
                    {speechEngine.micLevel}%
                  </span>
                )}
              </div>
            </div>

            <div className={`h-16 rounded-xl border overflow-hidden transition-all ${
              speechEngine?.isListening 
                ? 'bg-slate-900 border-rose-500/40 ring-2 ring-rose-500/20' 
                : isMicConnecting
                ? 'bg-slate-900 border-amber-500/40 ring-2 ring-amber-500/20'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <SpeechWaveVisualizer
                mode={speechEngine?.isListening ? 'candidate_speaking' : speechEngine?.isSpeaking ? 'examiner_speaking' : 'idle'}
                analyserNode={speechEngine?.analyserNode}
                className="w-full h-full"
              />
            </div>

            {/* Realtime Live Transcript */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs min-h-[50px] flex items-center justify-between">
              <p className="italic leading-relaxed text-slate-200">
                {speechEngine?.transcript || speechEngine?.interimTranscript ? (
                  <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                ) : isMicConnecting ? (
                  <span className="text-amber-400">Đang bật micro... Vui lòng chuẩn bị nói.</span>
                ) : (
                  <span className="text-slate-500">Bấm nút "Bật Micro Luyện Nói" bên dưới và bắt đầu trả lời bằng tiếng Anh...</span>
                )}
              </p>
              <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                {speechEngine?.audioClips?.[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`]?.blob && !speechEngine?.isListening && (
                  <button
                    onClick={() => handleRefineTranscriptWithAI && handleRefineTranscriptWithAI(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`)}
                    disabled={isRefiningTranscript}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer transition-all border ${
                      refinedClips[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`]
                        ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700/60'
                        : 'bg-indigo-950/90 hover:bg-indigo-900 text-indigo-200 hover:text-white border-indigo-600/60 shadow-sm shadow-indigo-950/50'
                    }`}
                    title="AI nghe trực tiếp file ghi âm để phiên âm chuẩn xác 98%+"
                  >
                    {isRefiningTranscript && refiningClipKey === `p1_${activeP1Topic.id}_${activeP1QuestionIndex}` ? (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                    ) : refinedClips[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`] ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    )}
                    <span className="hidden sm:inline">
                      {refinedClips[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`] ? 'Đã Chuẩn Hóa AI' : 'AI Chuẩn Hóa'}
                    </span>
                    {!refinedClips[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`] && (
                      <span className="hidden md:inline text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30">
                        Khuyên Dùng
                      </span>
                    )}
                  </button>
                )}
                {speechEngine?.transcript && !speechEngine?.isListening && (
                  <button
                    onClick={() => {
                      speechEngine.resetTranscript();
                      const key = `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`;
                      if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(key);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Xóa làm lại câu này"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Speaking Fluency & Filler Words Live Alert */}
            {speechEngine?.transcript && !speechEngine?.isListening && (
              <SpeakingFillerTracker 
                transcript={speechEngine.transcript}
                durationSec={speechEngine.audioClips?.[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`]?.duration || 30}
              />
            )}

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <span className="text-[11px] text-slate-400">
                {speechEngine?.transcript ? (
                  <span className="text-purple-300 font-semibold">Đã nói: {speechEngine.transcript.split(' ').filter(Boolean).length} từ</span>
                ) : (
                  <span>
                    <span className="hidden sm:inline">💡 Mẹo: Nhấn phím Space để bật/tắt mic nhanh</span>
                    <span className="sm:hidden">💡 Chạm nút bên dưới để bật/tắt micro luyện nói</span>
                  </span>
                )}
              </span>

              <button
                onClick={() => handleTogglePracticeRecord && handleTogglePracticeRecord(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`)}
                disabled={isMicConnecting}
                className={`px-5 py-3 sm:py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 w-full sm:w-auto ${
                  isMicConnecting
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 ring-4 ring-amber-400/40 animate-pulse cursor-wait'
                    : speechEngine?.isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-4 ring-rose-500/40 animate-pulse' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                {isMicConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>ĐANG KẾT NỐI MICRO...</span>
                  </>
                ) : speechEngine?.isListening ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current text-white" />
                    <span>🔴 DỪNG THU ÂM (HOÀN TẤT)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>BẬT MICRO LUYỆN NÓI</span>
                  </>
                )}
              </button>
            </div>

            {/* Microphone Error / Permission Alert Banner */}
            {micErrorDetail && (
              <div className="p-3.5 rounded-xl bg-rose-950/95 border-2 border-rose-500/80 text-rose-200 text-xs flex items-start space-x-2.5 shadow-xl animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <p className="font-bold text-white text-xs leading-snug">{micErrorDetail}</p>
                  <div className="text-[11px] text-rose-300 leading-relaxed bg-rose-900/40 p-2 rounded-lg border border-rose-800/50 space-y-1">
                    <p><strong>👉 Cách cấp quyền Micro trên trình duyệt:</strong></p>
                    <p>1. Bấm vào biểu tượng <strong>Ổ khóa (🔒)</strong> hoặc <strong>Cài đặt trang web</strong> ở đầu thanh địa chỉ URL.</p>
                    <p>2. Chuyển mục <strong>Microphone</strong> sang <strong>Cho phép (Allow)</strong>.</p>
                    <p>3. Bấm nút <strong>"Kích Hoạt Lại Micro"</strong> bên dưới hoặc tải lại trang (F5).</p>
                  </div>
                  <button
                    onClick={handleRequestMicPermissionDirectly}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Kích Hoạt Lại Micro Ngay</span>
                  </button>
                </div>
                <button
                  onClick={() => setMicErrorDetail && setMicErrorDetail(null)}
                  className="text-rose-400 hover:text-white text-xs font-bold p-1 rounded bg-rose-900/60 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Playback Box & AI Evaluation */}
            {renderAudioPlayback && renderAudioPlayback(
              `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`,
              currentP1Question.question,
              activeP1Topic.title,
              1
            )}
          </div>

          {/* Vocab Hints */}
          {showVocabHints && currentP1Question.vocabHints?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Gợi ý Collocations & Idioms Band 7.5+:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentP1Question.vocabHints.map((v, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs flex items-center space-x-1">
                    <span className="font-bold text-purple-300">{v.phrase}</span>
                    <span className="text-slate-400 text-[11px]">({v.meaningVi})</span>
                    {onSaveToVocabNotebook && (
                      <button
                        onClick={() => onSaveToVocabNotebook({
                          id: `v-spk-${Date.now()}-${idx}`,
                          phrase: v.phrase,
                          meaningVi: v.meaningVi,
                          example: currentP1Question.sampleAnswer,
                          topic: 'speaking'
                        })}
                        className="ml-1 text-[10px] text-purple-400 hover:text-purple-200 cursor-pointer font-bold"
                        title="Lưu vào Sổ tay từ vựng"
                      >
                        +Lưu
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Answer */}
          {showSampleAnswer && currentP1Question.sampleAnswer && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Câu trả lời mẫu Band 8.5+ (Theo công thức A.R.E.A):
                </span>
                <button
                  onClick={() => handleReadText && handleReadText(currentP1Question.sampleAnswer)}
                  className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Nghe đọc mẫu</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{currentP1Question.sampleAnswer}"
              </p>
            </div>
          )}

          {/* Question Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              disabled={activeP1QuestionIndex === 0}
              onClick={() => {
                if (speechEngine?.isListening) speechEngine.stopListening();
                setActiveP1QuestionIndex(prev => prev - 1);
                setShowSampleAnswer(false);
                if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Câu Trước
            </button>
            <button
              disabled={activeP1QuestionIndex >= (activeP1Topic.questions?.length || 1) - 1}
              onClick={() => {
                if (speechEngine?.isListening) speechEngine.stopListening();
                setActiveP1QuestionIndex(prev => prev + 1);
                setShowSampleAnswer(false);
                if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Câu Kế Tiếp →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
