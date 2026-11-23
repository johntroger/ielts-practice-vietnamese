import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakText } from '../utils/speechAudio';
import { tokenizePhraseWords } from '../utils/ipaService';

/**
 * Renders IPA + split word-by-word audio pills for a vocabulary phrase.
 */
export function PhrasePronunciationBar({ phrase, ipa, getWordIpa, isEn, dark = false }) {
  const words = tokenizePhraseWords(phrase);
  if (!ipa && words.length <= 1) return null;

  return (
    <div className="space-y-1.5">
      {ipa && (
        <div className={`text-[11px] font-mono tracking-wide ${dark ? 'text-amber-300/90' : 'text-indigo-600'}`}>
          {ipa}
        </div>
      )}
      {words.length > 1 && (
        <div className={`flex flex-wrap gap-1 ${dark ? 'justify-center' : ''}`}>
          {words.map((w, i) => {
            const wIpa = getWordIpa ? getWordIpa(w) : '';
            return (
              <button
                key={`${w}-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(w, { rate: 0.85 });
                }}
                title={wIpa ? `${w} ${wIpa}` : (isEn ? `Listen "${w}"` : `Nghe "${w}"`)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors cursor-pointer ${
                  dark
                    ? 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700'
                }`}
              >
                <Volume2 className="w-2.5 h-2.5 opacity-75 shrink-0" />
                <span>{w}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Renders an example sentence with its own dedicated listen button.
 */
export function ExampleWithAudio({ example, isEn, dark = false }) {
  if (!example) return null;
  return (
    <div
      className={`flex items-start justify-between gap-2 p-2 rounded border text-[11px] italic ${
        dark
          ? 'bg-white/10 border-white/10 text-slate-200 text-left'
          : 'bg-slate-50 border-slate-100 text-slate-500'
      }`}
    >
      <span className="flex-1 leading-relaxed">"{example}"</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          speakText(example, { rate: 0.92 });
        }}
        title={isEn ? 'Listen to example' : 'Nghe câu ví dụ'}
        aria-label={isEn ? 'Listen to example' : 'Nghe câu ví dụ'}
        className={`p-1 rounded shrink-0 transition-colors cursor-pointer ${
          dark
            ? 'text-amber-300 hover:bg-white/15'
            : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
