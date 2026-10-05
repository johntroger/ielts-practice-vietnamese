import React from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  Trash2, 
  Volume2, 
  Plus, 
  Loader2, 
  Square, 
  Mic,
  BookOpen
} from 'lucide-react';
import SpeechWaveVisualizer from '../SpeechWaveVisualizer';
import { openTheoryModalWithContext } from '../../../services/theoryContextService';

/**
 * SpeakingPart3Room Sub-component
 * Encapsulates Cambridge In-depth Two-Way Discussion (Part 3) workflow:
 * - Topic discussion selection & AI set generator button
 * - In-depth questions with PEEL strategy guidance
 * - Per-question recording controls, waveform, transcript & AI evaluation
 * - Quick add custom question button
 */
export default function SpeakingPart3Room({
  currentP3Set,
  part3Sets = [],
  selectedP3Id,
  setSelectedP3Id,
  hideMastered,
  masteredIds = [],
  onToggleMastered,
  onDeleteP3Set,
  onOpenTopicModal,
  handleReadText,
  onDeleteP3Question,
  handleTogglePracticeRecord,
  isMicConnecting,
  activeRecordClipKey,
  speechEngine,
  micErrorDetail,
  handleRequestMicPermissionDirectly,
  renderAudioPlayback,
  onOpenQuickAddQ
}) {
  if (!currentP3Set) return null;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in duration-150 shadow-xl">
      
      {/* Header & Topic Selector */}
      <div className="space-y-3 border-b border-slate-800 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Part 3: Thảo Luận Hai Chiều (Chuyên Sâu)
            </span>
            <span className="text-xs font-bold text-slate-300">{currentP3Set.topic}</span>
            {onToggleMastered && (currentP3Set.linkedPart2Id || currentP3Set.id) && (
              <button
                type="button"
                onClick={() => onToggleMastered(currentP3Set.linkedPart2Id || currentP3Set.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer border ${
                  masteredIds.includes(currentP3Set.linkedPart2Id || currentP3Set.id)
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
                title={
                  masteredIds.includes(currentP3Set.linkedPart2Id || currentP3Set.id)
                    ? 'Đã thuộc bộ thảo luận này (Bấm để bỏ đánh dấu)'
                    : 'Đánh dấu đã thuộc bộ thảo luận này'
                }
              >
                <GraduationCap className="w-3 h-3" />
                <span>
                  {masteredIds.includes(currentP3Set.linkedPart2Id || currentP3Set.id)
                    ? 'Đã thuộc'
                    : 'Thuộc bộ câu hỏi'}
                </span>
              </button>
            )}
            {currentP3Set.isCustom && onDeleteP3Set && (
              <button
                onClick={() => {
                  if (window.confirm(`Bạn có chắc muốn xóa bộ thảo luận "${currentP3Set.topic}"?`)) {
                    onDeleteP3Set(currentP3Set.linkedPart2Id || currentP3Set.id);
                  }
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Xóa bộ thảo luận tự tạo này"
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
                category: 'part3',
                subType: 'critical-thinking',
                topicId: 'critical-thinking-part3',
                title: 'Tư Duy Phản Biện & Ma Trận PEEL Trong Part 3'
              })}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 text-xs font-bold border border-purple-800/60 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              title="Mở cẩm nang khung tư duy phản biện PEEL mở rộng tầm xã hội cho Speaking Part 3"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Cẩm Nang PEEL Part 3</span>
            </button>

            {/* ADD PART 3 TOPIC BUTTON */}
            <button
              onClick={() => onOpenTopicModal && onOpenTopicModal(3)}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-purple-900/30 cursor-pointer shrink-0 transition-transform active:scale-95"
              title="Thêm bộ câu hỏi thảo luận Part 3 mới bằng AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>+ Sinh Bộ Thảo Luận Bằng AI</span>
            </button>
          </div>
        </div>

        {/* Topic Selection Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
          <div className="flex-1 min-w-0 pr-0 sm:pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chủ đề thảo luận Part 3:</span>
            <h3 className="text-sm sm:text-base font-black text-white truncate" title={currentP3Set.topic}>
              {currentP3Set.topic}
            </h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Đổi chủ đề:</span>
            <select
              value={selectedP3Id}
              onChange={(e) => setSelectedP3Id(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-purple-500 cursor-pointer w-full sm:w-auto max-w-full sm:max-w-xs truncate"
            >
              {(hideMastered ? part3Sets.filter(s => !masteredIds.includes(s.linkedPart2Id || s.id)) : part3Sets).map((s, idx) => (
                <option key={s.linkedPart2Id || s.id || idx} value={s.linkedPart2Id || s.id || idx}>
                  {masteredIds.includes(s.linkedPart2Id || s.id) ? '🎓 ' : ''}{s.topic} {s.isCommunity || (s.isPublic && s.isCustom) ? '(🌐 Cộng Đồng)' : s.isCustom ? '(🔒 Riêng)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currentP3Set.questions?.map((q, idx) => {
          const clipKey = `p3_${q.qId || idx}`;
          return (
            <div key={q.qId || idx} className="p-3.5 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                  Câu hỏi {idx + 1} ({q.analysisType || 'Thảo luận'})
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleReadText(q.question)}
                    className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe đọc</span>
                  </button>
                  {(q.qId?.includes('user') || currentP3Set.isCustom || (currentP3Set.questions && currentP3Set.questions.length > 1)) && onDeleteP3Question && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc muốn xóa câu hỏi thảo luận này?`)) {
                          const targetQId = q.qId || q.id;
                          onDeleteP3Question(currentP3Set.linkedPart2Id || currentP3Set.id, targetQId);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                      title="Xóa câu hỏi thảo luận này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                "{q.question}"
              </h4>
              <p className="text-xs text-slate-400 italic">
                💡 Chiến lược PEEL: {q.strategy}
              </p>

              {/* Micro recorder for this Part 3 question */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
                <span className="text-[11px] text-slate-500">
                  Cấu trúc PEEL: Point → Explanation → Example → Link
                </span>
                <button
                  onClick={() => handleTogglePracticeRecord(clipKey)}
                  disabled={isMicConnecting}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95 w-full sm:w-auto ${
                    isMicConnecting && activeRecordClipKey === clipKey
                      ? 'bg-amber-600 text-white animate-pulse cursor-wait ring-2 ring-amber-400'
                      : speechEngine.isListening && (activeRecordClipKey === clipKey || !activeRecordClipKey)
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30 shadow-rose-900/40' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                  }`}
                >
                  {isMicConnecting && activeRecordClipKey === clipKey ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Đang Kết Nối Micro...</span>
                    </>
                  ) : speechEngine.isListening && (activeRecordClipKey === clipKey || !activeRecordClipKey) ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current text-white" />
                      <span>🔴 Dừng Thu Âm Câu Này</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Luyện Nói Câu Này</span>
                    </>
                  )}
                </button>
              </div>

              {/* Part 3 Mic Error Banner */}
              {micErrorDetail && activeRecordClipKey === clipKey && (
                <div className="p-3 rounded-xl bg-rose-950/95 border border-rose-500 text-rose-200 text-xs flex items-center justify-between shadow-lg">
                  <span className="font-bold">{micErrorDetail}</span>
                  <button
                    onClick={handleRequestMicPermissionDirectly}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shrink-0 ml-2"
                  >
                    Cấp Lại Quyền
                  </button>
                </div>
              )}

              {/* Realtime Live Wave & Transcript when recording this specific question */}
              {speechEngine.isListening && (activeRecordClipKey === clipKey || !activeRecordClipKey) && (
                <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-rose-500/40 ring-1 ring-rose-500/30 animate-in fade-in duration-150">
                  <div className="h-10 rounded-lg bg-slate-950 overflow-hidden">
                    <SpeechWaveVisualizer
                      mode="candidate_speaking"
                      analyserNode={speechEngine.analyserNode}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs italic text-slate-200">
                    {speechEngine.transcript || speechEngine.interimTranscript ? (
                      <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                    ) : (
                      <span className="text-emerald-400 animate-pulse">🎤 Đang nghe giọng bạn... Hãy trả lời bằng tiếng Anh</span>
                    )}
                  </p>
                </div>
              )}

              {/* Audio Playback & AI Evaluation for this question */}
              {renderAudioPlayback && renderAudioPlayback(clipKey, q.question, currentP3Set.topic, 3)}
            </div>
          );
        })}
      </div>

      {/* Quick Add Question to Part 3 set */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onOpenQuickAddQ}
          className="px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Thêm Câu Hỏi Vào Bộ Thảo Luận Này</span>
        </button>
      </div>

    </div>
  );
}
