import React from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  Trash2, 
  Volume2, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  RotateCcw, 
  Square, 
  Mic, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import SpeechWaveVisualizer from '../SpeechWaveVisualizer';
import SpeakingPacingBar from '../SpeakingPacingBar';
import SpeakingFillerTracker from '../SpeakingFillerTracker';
import { openTheoryModalWithContext } from '../../../services/theoryContextService';


/**
 * SpeakingPart2Room Sub-component
 * Encapsulates Cambridge Long Turn (Part 2) practice workflow:
 * - Cue card selection & header actions
 * - 60s note-taking prep timer & 4-quadrant mindmap notes
 * - Real-time 2-minute 4-stage SpeakingPacingBar
 * - Audio visualizer, live transcript, AI refinement & playback
 * - Band 8.5 model answers
 */
export default function SpeakingPart2Room({
  activeP2Card,
  part2Cards = [],
  selectedP2CueCardId,
  setSelectedP2CueCardId,
  hideMastered,
  masteredIds = [],
  onToggleMastered,
  onDeleteP2Card,
  onOpenTopicModal,
  handleReadText,
  prepSecondsRemaining,
  isPrepping,
  handleStartPart2Prep,
  speakSecondsElapsed,
  isPart2Speaking,
  speechEngine,
  handleRefineTranscriptWithAI,
  isRefiningTranscript,
  refiningClipKey,
  refinedClips = {},
  part2PacingSeconds,
  handleTogglePart2Speaking,
  isMicConnecting,
  micErrorDetail,
  handleRequestMicPermissionDirectly,
  setMicErrorDetail,
  renderAudioPlayback,
  showSampleAnswer,
  setShowSampleAnswer,
  setIsPart2Speaking,
  setIsPrepping,
  setSpeakSecondsElapsed
}) {
  if (!activeP2Card) return null;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150 shadow-xl">
      
      {/* Header & Cue Card Selector */}
      <div className="space-y-3 border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Part 2 Long Turn (2 Phút Nói)
            </span>
            <span className="text-xs text-slate-400 font-semibold">{activeP2Card.category}</span>
            {onToggleMastered && activeP2Card.id && (
              <button
                type="button"
                onClick={() => onToggleMastered(activeP2Card.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer border ${
                  masteredIds.includes(activeP2Card.id)
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
                title={
                  masteredIds.includes(activeP2Card.id)
                    ? 'Đã thuộc Cue Card này (Bấm để bỏ đánh dấu)'
                    : 'Đánh dấu đã thuộc Cue Card này'
                }
              >
                <GraduationCap className="w-3 h-3" />
                <span>{masteredIds.includes(activeP2Card.id) ? 'Đã thuộc' : 'Thuộc Card'}</span>
              </button>
            )}
            {activeP2Card.isCustom && onDeleteP2Card && (
              <button
                onClick={() => {
                  if (window.confirm(`Bạn có chắc muốn xóa Cue Card "${activeP2Card.title}"?`)) {
                    onDeleteP2Card(activeP2Card.id);
                  }
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Xóa Cue Card tự tạo này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openTheoryModalWithContext({
                skill: 'speaking',
                category: 'part2',
                subType: 'storytelling',
                topicId: 'storytelling-part2',
                title: 'Kỹ Thuật Storytelling Dòng Thời Gian PPF (Part 2)'
              })}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 text-xs font-bold border border-purple-800/60 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              title="Mở cẩm nang chiến thuật căn nhịp 2 phút và phân bổ thì Past - Present - Future"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Cẩm Nang Pacing 2P</span>
            </button>

            {/* ADD CUE CARD BUTTON (AI / MANUAL) */}
            <button
              onClick={() => onOpenTopicModal && onOpenTopicModal(2)}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-900/30 cursor-pointer shrink-0 transition-transform active:scale-95"
              title="Thêm Cue Card luyện tập Part 2 mới bằng AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>+ Sinh Cue Card Bằng AI</span>
            </button>
          </div>
        </div>

        {/* Cue Card Selection Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
          <div className="flex-1 min-w-0 pr-0 sm:pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chủ đề Cue Card đang chọn:</span>
            <h3 className="text-sm sm:text-base font-black text-white truncate" title={activeP2Card.title}>
              {activeP2Card.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Đổi chủ đề:</span>
            <select
              value={selectedP2CueCardId}
              onChange={(e) => {
                setSelectedP2CueCardId(e.target.value);
                setShowSampleAnswer(false);
                setSpeakSecondsElapsed(0);
                setIsPart2Speaking(false);
                setIsPrepping(false);
                speechEngine.resetTranscript();
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-purple-500 cursor-pointer w-full sm:w-auto max-w-full sm:max-w-xs truncate"
            >
              {(hideMastered ? part2Cards.filter(c => !masteredIds.includes(c.id)) : part2Cards).map(c => (
                <option key={c.id} value={c.id}>
                  {masteredIds.includes(c.id) ? '🎓 ' : ''}{c.title} {c.isCommunity || (c.isPublic && c.isCustom) ? '(🌐 Cộng Đồng)' : c.isCustom ? '(🔒 Riêng)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cue Card Frame */}
      <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/40 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">{activeP2Card.cueCard?.intro}</span>
          <button
            onClick={() => handleReadText(`${activeP2Card.title}. ${activeP2Card.cueCard?.bullets.join('. ')}`)}
            className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Nghe đọc đề</span>
          </button>
        </div>
        <ul className="space-y-2 pl-4 list-disc text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {activeP2Card.cueCard?.bullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>

      {/* 60s PREPARATION TIMER & 4-QUADRANT MINDMAP */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Giai đoạn 1: Chuẩn bị 1 Phút (60s Note-taking)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-mono font-black ${
              prepSecondsRemaining <= 10 && prepSecondsRemaining > 0 ? 'text-rose-400 animate-ping' : 'text-emerald-400'
            }`}>
              00:{prepSecondsRemaining.toString().padStart(2, '0')}
            </span>
            <button
              onClick={handleStartPart2Prep}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isPrepping 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isPrepping ? 'Dừng Nháp' : 'Bắt Đầu Đếm 60s Nháp'}
            </button>
          </div>
        </div>

        {/* 4-Quadrant Mindmap Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeP2Card.mindmapNotes?.map((note, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-purple-400 mr-1.5">Ô {idx + 1}:</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-MINUTE PACING BAR & LIVE RECORDER */}
      <div className={`p-5 rounded-2xl border space-y-4 transition-all ${
        isPart2Speaking || speechEngine.isListening
          ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30'
          : 'bg-slate-950 border-slate-800'
      }`}>
        
        {/* Advanced Cambridge 4-Phase Pacing Bar */}
        <SpeakingPacingBar
          secondsElapsed={speakSecondsElapsed}
          isActive={isPart2Speaking}
          showStrategyTip={true}
          theme="dark"
        />

        {/* Waveform */}
        <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
          {SpeechWaveVisualizer && (
            <SpeechWaveVisualizer
              mode={isPart2Speaking || speechEngine.isListening ? 'candidate_speaking' : 'idle'}
              analyserNode={speechEngine.analyserNode}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Live Transcript */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs min-h-[50px] text-slate-200 flex items-center justify-between">
          <p className="italic leading-relaxed flex-1">
            {speechEngine.transcript || speechEngine.interimTranscript ? (
              <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
            ) : (
              <span className="text-slate-500">Bấm nút "Bắt Đầu Nói 2 Phút" bên dưới khi bạn đã sẵn sàng...</span>
            )}
          </p>
          <div className="flex items-center space-x-1.5 ml-2 shrink-0">
            {speechEngine.audioClips?.[`p2_${activeP2Card.id}`]?.blob && !speechEngine.isListening && (
              <button
                onClick={() => handleRefineTranscriptWithAI(`p2_${activeP2Card.id}`)}
                disabled={isRefiningTranscript}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer transition-all border ${
                  refinedClips[`p2_${activeP2Card.id}`]
                    ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700/60'
                    : 'bg-indigo-950/90 hover:bg-indigo-900 text-indigo-200 hover:text-white border-indigo-600/60 shadow-sm shadow-indigo-950/50'
                }`}
                title="AI nghe trực tiếp file ghi âm để phiên âm chuẩn xác 98%+"
              >
                {isRefiningTranscript && refiningClipKey === `p2_${activeP2Card.id}` ? (
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                ) : refinedClips[`p2_${activeP2Card.id}`] ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-300" />
                )}
                <span className="hidden sm:inline">
                  {refinedClips[`p2_${activeP2Card.id}`] ? 'Đã Chuẩn Hóa AI' : 'AI Chuẩn Hóa'}
                </span>
                {!refinedClips[`p2_${activeP2Card.id}`] && (
                  <span className="hidden md:inline text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30">
                    Khuyên Dùng
                  </span>
                )}
              </button>
            )}
            {speechEngine.transcript && !speechEngine.isListening && (
              <button
                onClick={() => {
                  speechEngine.resetTranscript();
                  const key = `p2_${activeP2Card.id}`;
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
        {speechEngine.transcript && !speechEngine.isListening && (
          <SpeakingFillerTracker 
            transcript={speechEngine.transcript}
            durationSec={speechEngine.audioClips?.[`p2_${activeP2Card.id}`]?.duration || (120 - part2PacingSeconds)}
          />
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <span className="text-[11px] text-slate-400">
            {speechEngine.transcript ? (
              <span className="text-purple-300 font-semibold">Đã nói: {speechEngine.transcript.split(' ').filter(Boolean).length} từ</span>
            ) : (
              <span>
                <span className="hidden sm:inline">Phím tắt: [Space] bật/tắt</span>
                <span className="sm:hidden">💡 Chạm nút bên dưới để bắt đầu nói 2 phút</span>
              </span>
            )}
          </span>

          <button
            onClick={handleTogglePart2Speaking}
            disabled={isMicConnecting}
            className={`px-6 py-3 sm:py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 w-full sm:w-auto ${
              isMicConnecting
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 ring-4 ring-amber-400/40 animate-pulse cursor-wait'
                : isPart2Speaking || speechEngine.isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-4 ring-rose-500/40 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
            }`}
          >
            {isMicConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>ĐANG KẾT NỐI MICRO...</span>
              </>
            ) : isPart2Speaking || speechEngine.isListening ? (
              <>
                <Square className="w-4 h-4 fill-current text-white" />
                <span>🔴 DỪNG NÓI PART 2</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>BẮT ĐẦU NÓI 2 PHÚT</span>
              </>
            )}
          </button>
        </div>

        {/* Part 2 Microphone Error / Permission Alert Banner */}
        {micErrorDetail && (
          <div className="p-3.5 rounded-xl bg-rose-950/95 border-2 border-rose-500/80 text-rose-200 text-xs flex items-start space-x-2.5 shadow-xl animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <p className="font-bold text-white text-xs leading-snug">{micErrorDetail}</p>
              <button
                onClick={handleRequestMicPermissionDirectly}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Cấp Lại Quyền Micro</span>
              </button>
            </div>
            <button
              onClick={() => setMicErrorDetail(null)}
              className="text-rose-400 hover:text-white text-xs font-bold p-1 rounded bg-rose-900/60 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Playback Box & AI Evaluation */}
        {renderAudioPlayback && renderAudioPlayback(
          `p2_${activeP2Card.id}`,
          activeP2Card.cueCard?.intro || activeP2Card.title,
          activeP2Card.title,
          2
        )}

      </div>

      {/* Sample Answer Band 8.5 */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowSampleAnswer(!showSampleAnswer)}
            className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 cursor-pointer transition-colors"
          >
            {showSampleAnswer ? 'Ẩn Bài Mẫu Band 8.5' : 'Xem & Nghe Bài Mẫu Band 8.5 Cho Part 2'}
          </button>

          {showSampleAnswer && (
            <button
              onClick={() => handleReadText(activeP2Card.sampleAnswer)}
              className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe Giám khảo đọc toàn bộ bài mẫu</span>
            </button>
          )}
        </div>

        {showSampleAnswer && activeP2Card.sampleAnswer && (
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3 animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line italic">
              {activeP2Card.sampleAnswer}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
