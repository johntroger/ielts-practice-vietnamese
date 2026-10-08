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
import { useTranslation } from '../../i18n';

export { UNIVERSAL_STORY_ARCHETYPES };

const getLocalizedArchetype = (arch, isEn) => {
  if (!isEn || !arch) return arch;
  const enData = {
    'archetype-1': {
      title: 'The Inspirational Mentor',
      summary: 'A literature teacher, an entrepreneurial cousin, or a beloved grandparent.',
      pivotStrategy: 'Whether prompted about an elderly person, successful entrepreneur, someone who taught you something useful, or someone you enjoy spending time with: Focus on the profound life lessons and critical thinking skills they imparted.',
      quadrantSuggestions: [
        'Q1 (Who & Bond): A high school mentor or entrepreneurial cousin (a pivotal mentor).',
        'Q2 (When & Where): Roughly three years ago during an academic research project or turning point.',
        'Q3 (What they taught/did): Instilling intellectual resilience and tenacity in the face of setbacks.',
        'Q4 (Impact & Feeling): Fostered an adult worldview with profound gratitude.'
      ]
    },
    'archetype-2': {
      title: 'The Tranquil Retreat',
      summary: 'A serene mountainous town or a quiet suburban garden retreat.',
      pivotStrategy: 'Whether prompted about a relaxing place, memorable journey, scenic natural wonder, or historic landmark: Steer toward this peaceful sanctuary, contrasting it with urban pressures.',
      quadrantSuggestions: [
        'Q1 (Where): A wooden retreat nestled on a misty hillside (insulated from urban noise).',
        'Q2 (When & Who): A summer retreat following intense examinations, solo or with a close confidant.',
        'Q3 (What happened/seen): Early morning walks amidst mist, reading beside a warm cup of coffee.',
        'Q4 (Why special): Therapeutic solace that completely recharged mental batteries.'
      ]
    },
    'archetype-3': {
      title: 'The Indispensable Gadget',
      summary: 'A noise-cancelling headset, an ultralight laptop, or an e-reader.',
      pivotStrategy: 'Whether prompted about a valuable gift, useful electronic device, something saving your time, or an item you bought recently: Focus on how this tool elevated productivity and preserved focus.',
      quadrantSuggestions: [
        'Q1 (What & Brand): An active noise-cancelling headset or ultralight workstation laptop.',
        'Q2 (When acquired): Purchased with personal savings prior to a demanding academic semester.',
        'Q3 (How used): Deep work sessions, listening to scholarly lectures, tuning out ambient distractions.',
        'Q4 (Why indispensable): An invaluable productivity catalyst that revolutionised daily workflow.'
      ]
    },
    'archetype-4': {
      title: 'The Hard-won Triumph (Turning Point)',
      summary: 'Delivering a high-stakes presentation, completing a marathon, or overcoming stage fright.',
      pivotStrategy: 'Whether prompted about a difficult decision, challenging experience, personal achievement, or proud milestone: Emphasise moving past self-doubt through disciplined preparation.',
      quadrantSuggestions: [
        'Q1 (What milestone): Delivering an impromptu English keynote or conquering a 21km endurance run.',
        'Q2 (Preparation & Obstacle): Grueling preparation, battling imposter syndrome and fatigue.',
        'Q3 (The crucial moment): Stepping up despite anxiety, executing with calm composure under pressure.',
        'Q4 (Growth & Takeaway): Realised self-imposed limits are psychological constructs, boosting confidence.'
      ]
    },
    'archetype-5': {
      title: 'The Serendipitous Encounter (Deep Bond)',
      summary: 'Volunteering with underprivileged children, organizing a charity campaign, or helping a stranger.',
      pivotStrategy: 'Whether prompted about teamwork, a conversation with a stranger, an act of kindness, or community service: Focus on social empathy and mutual human connection.',
      quadrantSuggestions: [
        'Q1 (Event & Context): Community volunteering initiative at a suburban educational shelter.',
        'Q2 (Encounter): Working alongside dedicated peers to support disadvantaged youths.',
        'Q3 (Core action): Organizing interactive workshops, witnessing tangible community empowerment.',
        'Q4 (Emotional resonance): Developed profound altruistic empathy and enduring social consciousness.'
      ]
    }
  };
  const extra = enData[arch.id];
  return extra ? { ...arch, ...extra } : arch;
};

export default function UniversalStoryArchetypesModal({
  isOpen,
  onClose,
  currentCueCard,
  onInsertToNotes
}) {
  if (!isOpen) return null;

  const { t, isEn } = useTranslation();
  const [selectedArchetypeId, setSelectedArchetypeId] = useState('archetype-1');
  const [copiedNote, setCopiedNote] = useState(null);

  const rawActiveArchetype = UNIVERSAL_STORY_ARCHETYPES.find(a => a.id === selectedArchetypeId) || UNIVERSAL_STORY_ARCHETYPES[0];
  const activeArchetype = getLocalizedArchetype(rawActiveArchetype, isEn);

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
                  {isEn ? '5 Universal Part 2 Archetypes' : '5 Cốt Truyện Vạn Năng (Universal Part 2 Archetypes)'}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {isEn ? 'Master 60+ Topics' : 'Lấy Bất Biến Ứng Vạn Biến'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEn 
                  ? 'Master strategy: Navigate 60+ Part 2 forecast prompts using only 5 core story frameworks' 
                  : 'Chiến thuật bảo bối ứng phó với hơn 60 đề Forecast Part 2 chỉ với 5 câu chuyện cốt lõi'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={gitbookArchetypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title={isEn ? 'Read original strategy on GitBook' : 'Đọc chiến thuật gốc trên GitBook'}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>{isEn ? 'Archetypes Guide' : 'Cẩm Nang Archetypes'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label={isEn ? 'Close modal' : 'Đóng modal'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Cue Card Banner */}
        {currentCueCard && (
          <div className="p-3 px-5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-purple-400 shrink-0">
                {isEn ? 'Active Cue Card:' : 'Cue Card hiện tại:'}
              </span>
              <span className="text-slate-200 font-semibold truncate">{currentCueCard.title}</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline shrink-0">
              {isEn 
                ? 'Select one of the 5 archetypes below to pivot onto this topic ⤵' 
                : 'Chọn 1 trong 5 cốt truyện dưới đây để bẻ lái về đề này ⤵'}
            </span>
          </div>
        )}

        {/* Archetypes Selector Tabs */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {UNIVERSAL_STORY_ARCHETYPES.map((arch) => {
              const isSelected = arch.id === selectedArchetypeId;
              const tabLabel = isEn 
                ? (arch.title.match(/\((.*?)\)/)?.[1] || arch.title)
                : arch.title.split('(')[0].trim();
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
                  <span>{tabLabel}</span>
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
                  {isEn ? `Archetype #${activeArchetype.number}` : `Cốt Truyện #${activeArchetype.number}`}
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
                <span>{isEn ? 'Pivot Strategy (Topic Adaptation):' : 'Kỹ Thuật Bẻ Lái (Pivot Strategy):'}</span>
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
                <span>{isEn ? '4 Quadrant Preparation Mindmap (Quadrant Notes):' : 'Gợi ý chia 4 ô nháp chuẩn bị (Quadrant Notes):'}</span>
              </span>

              {onInsertToNotes && (
                <button
                  type="button"
                  onClick={() => handleInsertAllQuadrants(activeArchetype.quadrantSuggestions)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  title={isEn ? 'Replace Part 2 notes with this archetype outline' : 'Thay thế 4 ô nháp Part 2 bằng dàn ý cốt truyện này'}
                >
                  {copiedNote === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{isEn ? 'Loaded into 4 Quadrants!' : 'Đã Nạp Vào 4 Ô Nháp!'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Load All 4 Quadrants to Notes' : 'Nạp Cả 4 Ô Vào Giấy Nháp'}</span>
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
                    title={isEn ? 'Copy quadrant notes' : 'Sao chép nội dung ô này'}
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
              {isEn ? 'High-Band C1/C2 Collocations & Idioms for This Archetype:' : 'Bộ Từ Vựng & Collocations C1/C2 Đặc Thù Cho Cốt Truyện Này:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {activeArchetype.collocations.map((colloc, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => handleCopyText(colloc, `colloc-${cIdx}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-purple-500/60 hover:text-purple-300 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  title={isEn ? 'Click to copy collocation' : 'Bấm để sao chép từ vựng này'}
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
              {isEn 
                ? <><strong>Examiner Tip:</strong> Rehearse these 5 core story archetypes until your delivery is completely spontaneous without looking at notes. When facing any unfamiliar exam prompt, take just 5 seconds to pivot toward your prepared archetype!</>
                : <><strong>Lời khuyên:</strong> Hãy tập kể nhuần nhuyễn 5 cốt truyện này đến mức nói tự nhiên không cần nhìn giấy. Khi gặp bất kỳ đề thi lạ nào, bạn chỉ mất 5 giây để bẻ lái về 1 trong 5 câu chuyện tủ!</>}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer text-xs"
          >
            {isEn ? 'Close Archetypes' : 'Đóng Cốt Truyện'}
          </button>
        </div>

      </div>
    </div>
  );
}
