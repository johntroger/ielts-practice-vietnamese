import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Sparkles, Volume2 } from 'lucide-react';
import { analyzeFillerWords, NATURAL_BUYING_TIME_PHRASES } from '../../services/speakingFluencyService.js';

export default function SpeakingFillerTracker({
  transcript = '',
  durationSec = 30,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = analyzeFillerWords(transcript, durationSec);

  if (!transcript || data.totalWords < 5) return null;

  return (
    <div className={`p-2.5 sm:p-3 rounded-xl border text-xs transition-all ${
      data.status === 'high'
        ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
        : data.status === 'moderate'
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
    } ${className}`}>
      
      {/* Header Summary Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          {data.status === 'high' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
          ) : data.status === 'moderate' ? (
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}

          <div className="truncate">
            <span className="font-bold text-[11px] sm:text-xs">
              {data.statusLabel}:
            </span>
            <span className="ml-1.5 font-mono font-bold">
              {data.totalFillers} từ đệm
            </span>
            <span className="text-[10px] text-slate-400 ml-1">
              ({data.fillerRatePerMin}/phút • {data.fillerDensityPercent}%)
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700/50 cursor-pointer transition-colors shrink-0"
        >
          <span>{isExpanded ? 'Ẩn' : 'Chi tiết'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Warning message if high */}
      {data.warningMessage && !isExpanded && (
        <p className="mt-1 text-[11px] text-rose-300/90 leading-tight">
          ⚠️ {data.warningMessage}
        </p>
      )}

      {/* Expanded Breakdown & Advice */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-150">
          {/* Breakdown tags */}
          {data.totalFillers > 0 ? (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Các từ đệm đã phát hiện trong bài nói:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(data.fillerBreakdown).map(([word, count]) => (
                  <span 
                    key={word} 
                    className="px-2 py-0.5 rounded-md bg-slate-900 text-rose-300 border border-rose-800/60 text-[11px] font-mono font-bold"
                  >
                    "{word}": <span className="text-white">{count} lần</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-300">
              🎉 Không phát hiện từ đệm ngập ngừng nào. Bạn đang duy trì mạch nói rất tự tin và liền mạch!
            </p>
          )}

          {/* Natural Replacements table */}
          <div className="space-y-1.5 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gợi ý thay thế chuẩn Cambridge Band 7.5+ Fluency:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px]">
              {NATURAL_BUYING_TIME_PHRASES.slice(0, 4).map((p, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
                  <span className="text-rose-300 line-through mr-1 font-bold">{p.filler}</span>
                  <span className="text-emerald-400 font-bold">➔ {p.replacement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
