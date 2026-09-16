import React from 'react';
import { 
  FileText, Clock, ChevronDown, ChevronUp, Sparkles, CheckCircle2, 
  HelpCircle, Minimize2, Maximize2, RotateCcw
} from 'lucide-react';

/**
 * SpeakingDigitalNotepad
 * 4-Quadrant Smart Notepad for IELTS Speaking Part 2
 * - Quadrants:
 *   1. Who / What (Core Target)
 *   2. When / Where (Context & Setting)
 *   3. Details / Climax (Key Action & Moments)
 *   4. Feelings & Reflection (Impression & Lesson)
 * - Docked state: Shrinks into bottom right corner during 2-minute speaking.
 */
export default function SpeakingDigitalNotepad({
  notes = { q1: '', q2: '', q3: '', q4: '' },
  onChangeNotes = () => {},
  isDocked = false,
  onToggleDock = () => {},
  prepTimeRemaining = 0,
  isPrepPhase = false
}) {
  const handleInputChange = (field, value) => {
    onChangeNotes({
      ...notes,
      [field]: value
    });
  };

  const handleClearAll = () => {
    onChangeNotes({ q1: '', q2: '', q3: '', q4: '' });
  };

  // If in docked view (minimized floating sticky on bottom-right)
  if (isDocked) {
    return (
      <div className="fixed bottom-4 right-4 z-40 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
        {/* Docked Header */}
        <div 
          onClick={onToggleDock}
          className="px-3.5 py-2.5 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-800/40 flex items-center justify-between cursor-pointer select-none hover:bg-slate-850"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Ghi chú Part 2 của bạn</span>
            </span>
          </div>
          <button 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Mở rộng bảng nháp"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Docked Body: 4-Quadrant Preview */}
        <div className="p-3 grid grid-cols-2 gap-2 text-[11px] max-h-48 overflow-y-auto">
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-purple-300 block text-[10px] uppercase">1. Who / What</span>
            <p className="text-slate-200 line-clamp-2 mt-0.5 whitespace-pre-wrap">{notes.q1 || <em className="text-slate-500">Chưa ghi</em>}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-indigo-300 block text-[10px] uppercase">2. When / Where</span>
            <p className="text-slate-200 line-clamp-2 mt-0.5 whitespace-pre-wrap">{notes.q2 || <em className="text-slate-500">Chưa ghi</em>}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-emerald-300 block text-[10px] uppercase">3. Details / Climax</span>
            <p className="text-slate-200 line-clamp-2 mt-0.5 whitespace-pre-wrap">{notes.q3 || <em className="text-slate-500">Chưa ghi</em>}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-amber-300 block text-[10px] uppercase">4. Feelings & Why</span>
            <p className="text-slate-200 line-clamp-2 mt-0.5 whitespace-pre-wrap">{notes.q4 || <em className="text-slate-500">Chưa ghi</em>}</p>
          </div>
        </div>
      </div>
    );
  }

  // Expanded View (Full interactive 4-Quadrant pad during 60s prep)
  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Bảng Nháp Part 2 Thông Minh (4 Ô Ma Trận)</span>
              {isPrepPhase && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  Đang trong 60s nháp
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              Ghi nhanh từ khóa (Keywords) thay vì viết cả câu. Hết 60s, bảng sẽ tự động thu nhỏ xuống góc màn hình.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearAll}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
            title="Xóa toàn bộ nháp"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {!isPrepPhase && (
            <button
              onClick={onToggleDock}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              title="Thu nhỏ xuống góc"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Quadrant 1: Who / What */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 focus-within:border-purple-500/60 transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-purple-900/60 text-purple-300 flex items-center justify-center text-[10px]">1</span>
              <span>Who / What (Đối tượng cốt lõi)</span>
            </span>
            <span className="text-[10px] text-slate-500">Ai, là cái gì, đặc điểm gì?</span>
          </div>
          <textarea
            value={notes.q1}
            onChange={(e) => handleInputChange('q1', e.target.value)}
            placeholder="VD: Sony noise-canceling headphones, matte black finish, lightweight..."
            rows={2}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Quadrant 2: When / Where */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 focus-within:border-indigo-500/60 transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center text-[10px]">2</span>
              <span>When / Where (Bối cảnh thời gian)</span>
            </span>
            <span className="text-[10px] text-slate-500">Xảy ra khi nào, ở đâu?</span>
          </div>
          <textarea
            value={notes.q2}
            onChange={(e) => handleInputChange('q2', e.target.value)}
            placeholder="VD: 2 years ago, university freshman, Tokyo electronic district..."
            rows={2}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Quadrant 3: Details / Climax */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 focus-within:border-emerald-500/60 transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-emerald-900/60 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
              <span>Core Details & Action (Điểm nhấn)</span>
            </span>
            <span className="text-[10px] text-slate-500">Chi tiết bạn đã làm/sử dụng</span>
          </div>
          <textarea
            value={notes.q3}
            onChange={(e) => handleInputChange('q3', e.target.value)}
            placeholder="VD: daily study in noisy coffee shops, blocks background chatter completely..."
            rows={2}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Quadrant 4: Feelings & Reflection */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 focus-within:border-amber-500/60 transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-amber-900/60 text-amber-300 flex items-center justify-center text-[10px]">4</span>
              <span>Feelings & Why (Cảm xúc & Bài học)</span>
            </span>
            <span className="text-[10px] text-slate-500">Tại sao lại đặc biệt với bạn?</span>
          </div>
          <textarea
            value={notes.q4}
            onChange={(e) => handleInputChange('q4', e.target.value)}
            placeholder="VD: indispensable productivity booster, worth every single penny..."
            rows={2}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
