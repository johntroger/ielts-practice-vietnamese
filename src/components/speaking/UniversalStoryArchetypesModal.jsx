import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  BookOpen, 
  ExternalLink, 
  Check, 
  Copy, 
  Compass, 
  UserCheck, 
  MapPin, 
  Laptop, 
  Trophy, 
  HeartHandshake, 
  ArrowRight,
  Flame,
  Lightbulb
} from 'lucide-react';
import { getGitBookBaseUrl } from '../../core/featureRegistry';
import { UNIVERSAL_STORY_ARCHETYPES } from '../../data/speakingArchetypesData';

export { UNIVERSAL_STORY_ARCHETYPES };

export default function UniversalStoryArchetypesModal({
  isOpen,
  onClose,
  currentCueCard,
  onInsertToNotes
}) {
  if (!isOpen) return null;

  const [selectedArchetypeId, setSelectedArchetypeId] = useState('archetype-1');
  const [copiedNote, setCopiedNote] = useState(null);

  const activeArchetype = UNIVERSAL_STORY_ARCHETYPES.find(a => a.id === selectedArchetypeId) || UNIVERSAL_STORY_ARCHETYPES[0];

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(key);
    setTimeout(() => setCopiedNote(null), 2000);
  };

  const handleInsertAllQuadrants = (quadrants) => {
    if (onInsertToNotes) {
      onInsertToNotes(quadrants);
      setCopiedNote('all');
      setTimeout(() => setCopiedNote(null), 2000);
    }
  };

  const gitbookArchetypeUrl = `${getGitBookBaseUrl()}/speaking/speaking-5-universal-archetypes`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] max-h-[94dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  5 Cốt Truyện Vạn Năng (Universal Part 2 Archetypes)
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Lấy Bất Biến Ứng Vạn Biến
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chiến thuật bảo bối ứng phó với hơn 60 đề Forecast Part 2 chỉ với 5 câu chuyện cốt lõi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={gitbookArchetypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Đọc chiến thuật gốc trên GitBook"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Cẩm Nang Archetypes</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Cue Card Banner */}
        {currentCueCard && (
          <div className="p-3 px-5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-purple-400 shrink-0">Cue Card hiện tại:</span>
              <span className="text-slate-200 font-semibold truncate">{currentCueCard.title}</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline shrink-0">
              Chọn 1 trong 5 cốt truyện dưới đây để bẻ lái về đề này ⤵
            </span>
          </div>
        )}

        {/* Archetypes Selector Tabs */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {UNIVERSAL_STORY_ARCHETYPES.map((arch) => {
              const isSelected = arch.id === selectedArchetypeId;
              return (
                <button
                  key={arch.id}
                  onClick={() => setSelectedArchetypeId(arch.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-950/50'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isSelected ? 'bg-white text-purple-900' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {arch.number}
                  </span>
                  <span>{arch.title.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Archetype Detail */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Summary & Pivot Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${activeArchetype.borderColor} bg-slate-950/80 space-y-3`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${activeArchetype.bgBadge}`}>
                  Cốt Truyện #{activeArchetype.number}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {activeArchetype.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 italic">
                {activeArchetype.summary}
              </p>
            </div>

            {/* Pivot Strategy */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Kỹ Thuật Bẻ Lái (Pivot Strategy):</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeArchetype.pivotStrategy}
              </p>
            </div>
          </div>

          {/* 4 Quadrant Mindmap Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Gợi ý chia 4 ô nháp chuẩn bị (Quadrant Notes):</span>
              </span>

              {onInsertToNotes && (
                <button
                  type="button"
                  onClick={() => handleInsertAllQuadrants(activeArchetype.quadrantSuggestions)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  title="Thay thế 4 ô nháp Part 2 bằng dàn ý cốt truyện này"
                >
                  {copiedNote === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Đã Nạp Vào 4 Ô Nháp!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nạp Cả 4 Ô Vào Giấy Nháp</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeArchetype.quadrantSuggestions.map((quad, qIdx) => (
                <div
                  key={qIdx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2.5 hover:border-slate-700 transition-colors"
                >
                  <p className="text-xs text-slate-200 leading-relaxed flex-1">
                    {quad}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopyText(quad, `quad-${qIdx}`)}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Sao chép nội dung ô này"
                  >
                    {copiedNote === `quad-${qIdx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* C1/C2 Collocations & Idioms */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              Bộ Từ Vựng & Collocations C1/C2 Đặc Thù Cho Cốt Truyện Này:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeArchetype.collocations.map((colloc, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => handleCopyText(colloc, `colloc-${cIdx}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-purple-500/60 hover:text-purple-300 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  title="Bấm để sao chép từ vựng này"
                >
                  <span>{colloc}</span>
                  {copiedNote === `colloc-${cIdx}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Lời khuyên:</strong> Hãy tập kể nhuần nhuyễn 5 cốt truyện này đến mức nói tự nhiên không cần nhìn giấy. Khi gặp bất kỳ đề thi lạ nào, bạn chỉ mất 5 giây để bẻ lái về 1 trong 5 câu chuyện tủ!
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer text-xs"
          >
            Đóng Cốt Truyện
          </button>
        </div>

      </div>
    </div>
  );
}
