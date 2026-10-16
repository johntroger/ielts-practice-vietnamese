import React, { useMemo } from 'react';
import { Swords, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { evaluateGhostDuelProgress } from '../../services/gamification/ghostDuelService.js';

/**
 * src/components/arena/ArenaGhostDuelBar.jsx
 * 
 * High-intensity, low-profile Pacing Comparison Bar for 1-on-1 Async Ghost Duels.
 * Renders at the top/center of the active sprint when challenging a peer:
 * - Live Ghost pacing simulation via evaluateGhostDuelProgress
 * - Relative lead comparison (Ahead / Tied / Behind)
 * - Zero-layout-shift compact footprint
 */
export default function ArenaGhostDuelBar({
  duel,
  elapsedSeconds = 0,
  userScore = 0,
  userQuestionIndex = 0,
  totalQuestions = 7,
  isEn = false
}) {
  const ghostProgress = useMemo(() => {
    return evaluateGhostDuelProgress(duel, elapsedSeconds);
  }, [duel, elapsedSeconds]);

  if (!duel) return null;

  const userProgressPercent = Math.min(100, Math.round(((userQuestionIndex + 1) / totalQuestions) * 100));
  const leadDiff = userScore - ghostProgress.ghostScore;

  let leadStatusText = '';
  let leadStatusClass = '';

  if (leadDiff > 0) {
    leadStatusText = isEn ? `Leading by +${leadDiff}` : `Đang dẫn trước +${leadDiff}`;
    leadStatusClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (leadDiff === 0) {
    leadStatusText = isEn ? 'Tied Score' : 'Hòa điểm';
    leadStatusClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else {
    leadStatusText = isEn ? `Behind by ${Math.abs(leadDiff)}` : `Bị dẫn -${Math.abs(leadDiff)}`;
    leadStatusClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-indigo-500/30 rounded-xl shadow-md flex items-center justify-between gap-3 text-xs">
      {/* You Column */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-[10px] font-black text-indigo-300 shrink-0">
          YOU
        </div>
        <div className="truncate">
          <div className="flex items-center gap-1 font-bold text-slate-200">
            <span>{isEn ? 'You' : 'Bạn'}</span>
            <span className="text-amber-400 font-black">({userScore})</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Q{Math.min(totalQuestions, userQuestionIndex + 1)}/{totalQuestions}
          </div>
        </div>
      </div>

      {/* Middle Lead Pill & Pacing Track */}
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${leadStatusClass}`}>
          <Swords className="w-2.5 h-2.5" />
          <span>{leadStatusText}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden flex relative">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${userProgressPercent}%` }}
          />
          <div 
            className="bg-rose-500/70 h-full transition-all duration-500 absolute top-0"
            style={{ 
              width: `${ghostProgress.ghostProgressPercent}%`,
              opacity: 0.6
            }}
          />
        </div>
      </div>

      {/* Ghost Rival Column */}
      <div className="flex items-center gap-2 min-w-0 justify-end text-right">
        <div className="truncate">
          <div className="flex items-center justify-end gap-1 font-bold text-slate-300 truncate">
            <span className="truncate max-w-[90px] sm:max-w-[120px]">{duel.rivalName}</span>
            <span className="text-rose-400 font-black">({ghostProgress.ghostScore})</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Q{Math.min(totalQuestions, ghostProgress.ghostQuestionIndex + 1)}/{totalQuestions}
          </div>
        </div>
        <img 
          src={duel.rivalAvatar} 
          alt={duel.rivalName}
          className="w-6 h-6 rounded-full border border-rose-500/40 object-cover shrink-0"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}
