import React from 'react';

/**
 * Sagittal Cross-Section Mouth & Tongue Articulation Diagram (SVG)
 * Visually demonstrates tongue position, lip shape, jaw opening, airflow, and vocal cord voicing
 * for all 44 Cambridge IPA phonemes.
 */

const POSTURE_MAP = {
  // Dental fricatives
  '/θ/': { type: 'dental', voiced: false, lips: 'neutral', jaw: 1, airflow: 'oral' },
  '/ð/': { type: 'dental', voiced: true, lips: 'neutral', jaw: 1, airflow: 'oral' },
  // Bilabial
  '/p/': { type: 'bilabial', voiced: false, lips: 'closed', jaw: 0, airflow: 'burst' },
  '/b/': { type: 'bilabial', voiced: true, lips: 'closed', jaw: 0, airflow: 'burst' },
  '/m/': { type: 'bilabial', voiced: true, lips: 'closed', jaw: 0, airflow: 'nasal' },
  // Labiodental
  '/f/': { type: 'labiodental', voiced: false, lips: 'bite', jaw: 1, airflow: 'oral' },
  '/v/': { type: 'labiodental', voiced: true, lips: 'bite', jaw: 1, airflow: 'oral' },
  // Alveolar
  '/t/': { type: 'alveolar', voiced: false, lips: 'neutral', jaw: 1, airflow: 'burst' },
  '/d/': { type: 'alveolar', voiced: true, lips: 'neutral', jaw: 1, airflow: 'burst' },
  '/s/': { type: 'alveolar_fricative', voiced: false, lips: 'spread', jaw: 1, airflow: 'oral' },
  '/z/': { type: 'alveolar_fricative', voiced: true, lips: 'spread', jaw: 1, airflow: 'oral' },
  '/n/': { type: 'alveolar', voiced: true, lips: 'neutral', jaw: 1, airflow: 'nasal' },
  '/l/': { type: 'alveolar', voiced: true, lips: 'neutral', jaw: 2, airflow: 'oral' },
  // Postalveolar & Retroflex
  '/tʃ/': { type: 'postalveolar', voiced: false, lips: 'round', jaw: 1, airflow: 'burst' },
  '/dʒ/': { type: 'postalveolar', voiced: true, lips: 'round', jaw: 1, airflow: 'burst' },
  '/ʃ/': { type: 'postalveolar', voiced: false, lips: 'round', jaw: 1, airflow: 'oral' },
  '/ʒ/': { type: 'postalveolar', voiced: true, lips: 'round', jaw: 1, airflow: 'oral' },
  '/r/': { type: 'retroflex', voiced: true, lips: 'round', jaw: 2, airflow: 'oral' },
  // Velar
  '/k/': { type: 'velar', voiced: false, lips: 'neutral', jaw: 2, airflow: 'burst' },
  '/ɡ/': { type: 'velar', voiced: true, lips: 'neutral', jaw: 2, airflow: 'burst' },
  '/ŋ/': { type: 'velar', voiced: true, lips: 'neutral', jaw: 2, airflow: 'nasal' },
  // Glottal & Glides
  '/h/': { type: 'glottal', voiced: false, lips: 'neutral', jaw: 2, airflow: 'oral' },
  '/w/': { type: 'glide_w', voiced: true, lips: 'round', jaw: 1, airflow: 'oral' },
  '/j/': { type: 'glide_j', voiced: true, lips: 'spread', jaw: 1, airflow: 'oral' },
  // Monophthongs
  '/iː/': { type: 'vowel_front_high', voiced: true, lips: 'spread', jaw: 1, airflow: 'oral' },
  '/ɪ/': { type: 'vowel_front_high', voiced: true, lips: 'neutral', jaw: 1, airflow: 'oral' },
  '/e/': { type: 'vowel_front_mid', voiced: true, lips: 'spread', jaw: 2, airflow: 'oral' },
  '/æ/': { type: 'vowel_front_low', voiced: true, lips: 'spread', jaw: 3, airflow: 'oral' },
  '/ə/': { type: 'vowel_central', voiced: true, lips: 'neutral', jaw: 2, airflow: 'oral' },
  '/ɜː/': { type: 'vowel_central', voiced: true, lips: 'neutral', jaw: 2, airflow: 'oral' },
  '/ʌ/': { type: 'vowel_central', voiced: true, lips: 'neutral', jaw: 3, airflow: 'oral' },
  '/uː/': { type: 'vowel_back_high', voiced: true, lips: 'round', jaw: 1, airflow: 'oral' },
  '/ʊ/': { type: 'vowel_back_high', voiced: true, lips: 'round', jaw: 1, airflow: 'oral' },
  '/ɔː/': { type: 'vowel_back_mid', voiced: true, lips: 'round', jaw: 2, airflow: 'oral' },
  '/ɒ/': { type: 'vowel_back_low', voiced: true, lips: 'round', jaw: 3, airflow: 'oral' },
  '/ɑː/': { type: 'vowel_back_low', voiced: true, lips: 'neutral', jaw: 3, airflow: 'oral' },
  // Diphthongs
  '/ɪə/': { type: 'diphthong_center', voiced: true, lips: 'neutral', jaw: 2, airflow: 'oral' },
  '/eɪ/': { type: 'diphthong_front', voiced: true, lips: 'spread', jaw: 2, airflow: 'oral' },
  '/ʊə/': { type: 'diphthong_center', voiced: true, lips: 'round', jaw: 2, airflow: 'oral' },
  '/ɔɪ/': { type: 'diphthong_front', voiced: true, lips: 'round', jaw: 2, airflow: 'oral' },
  '/əʊ/': { type: 'diphthong_back', voiced: true, lips: 'round', jaw: 2, airflow: 'oral' },
  '/eə/': { type: 'diphthong_center', voiced: true, lips: 'neutral', jaw: 2, airflow: 'oral' },
  '/aɪ/': { type: 'diphthong_front', voiced: true, lips: 'spread', jaw: 3, airflow: 'oral' },
  '/aʊ/': { type: 'diphthong_back', voiced: true, lips: 'round', jaw: 3, airflow: 'oral' }
};

function getTonguePath(type, jawOffset) {
  switch (type) {
    case 'dental':
      return `M 146,${114 + jawOffset} Q 112,${82} 76,${83} Q 54,${84} 42,${83} Q 54,${94} 78,${98} Q 108,${104} 126,${126 + jawOffset} Z`;
    case 'bilabial':
      return `M 146,${112} Q 114,${86} 78,${90} Q 60,${92} 54,${93} Q 72,${104} 112,${110} L 128,${124} Z`;
    case 'labiodental':
      return `M 146,${114} Q 112,${86} 76,${90} Q 58,${92} 52,${94} Q 72,${104} 112,${110} L 128,${124} Z`;
    case 'alveolar':
      return `M 146,${114 + jawOffset} Q 114,${78} 82,${68} Q 64,${62} 57,${62} Q 68,${78} 96,${96} L 128,${126 + jawOffset} Z`;
    case 'alveolar_fricative':
      return `M 146,${114 + jawOffset} Q 114,${80} 82,${71} Q 64,${66} 57,${68} Q 68,${82} 96,${98} L 128,${126 + jawOffset} Z`;
    case 'postalveolar':
      return `M 146,${114 + jawOffset} Q 118,${74} 90,${62} Q 72,${58} 64,${64} Q 76,${82} 102,${98} L 128,${126 + jawOffset} Z`;
    case 'retroflex':
      return `M 146,${114 + jawOffset} Q 116,${78} 92,${66} Q 78,${56} 72,${60} Q 84,${84} 106,${100} L 128,${126 + jawOffset} Z`;
    case 'velar':
      return `M 146,${112 + jawOffset} Q 134,${64} 110,${56} Q 88,${64} 66,${94} Q 86,${102} 112,${110} L 128,${126 + jawOffset} Z`;
    case 'glottal':
      return `M 146,${116 + jawOffset} Q 116,${92} 84,${94} Q 64,${96} 56,${98} Q 76,${108} 112,${114} L 128,${126 + jawOffset} Z`;
    case 'glide_w':
    case 'vowel_back_high':
      return `M 146,${114 + jawOffset} Q 128,${64} 106,${62} Q 84,${72} 64,${94} Q 86,${102} 112,${110} L 128,${126 + jawOffset} Z`;
    case 'glide_j':
    case 'vowel_front_high':
      return `M 146,${114 + jawOffset} Q 116,${72} 84,${62} Q 64,${66} 56,${82} Q 76,${94} 108,${104} L 128,${126 + jawOffset} Z`;
    case 'vowel_front_mid':
      return `M 146,${116 + jawOffset} Q 114,${80} 82,${76} Q 62,${80} 55,${90} Q 76,${100} 108,${108} L 128,${126 + jawOffset} Z`;
    case 'vowel_front_low':
      return `M 146,${118 + jawOffset} Q 114,${92} 82,${92} Q 62,${94} 54,${100} Q 76,${108} 108,${114} L 128,${128 + jawOffset} Z`;
    case 'vowel_back_mid':
    case 'diphthong_back':
      return `M 146,${116 + jawOffset} Q 128,${76} 104,${76} Q 82,${84} 64,${98} Q 86,${106} 112,${114} L 128,${126 + jawOffset} Z`;
    case 'vowel_back_low':
      return `M 146,${118 + jawOffset} Q 130,${90} 108,${92} Q 84,${98} 64,${104} Q 86,${112} 112,${116} L 128,${128 + jawOffset} Z`;
    case 'diphthong_front':
    case 'diphthong_center':
    case 'vowel_central':
    default:
      return `M 146,${114 + jawOffset} Q 116,${82} 88,${80} Q 68,${82} 58,${90} Q 78,${102} 110,${110} L 128,${126 + jawOffset} Z`;
  }
}

export default function IpaArticulationDiagram({ ipaSymbol = '/iː/', ipaGroup = 'monophthongs', isEn = false }) {
  const spec = POSTURE_MAP[ipaSymbol] || {
    type: 'vowel_central',
    voiced: true,
    lips: 'neutral',
    jaw: 2,
    airflow: 'oral'
  };

  const jawOffset = spec.jaw * 3;
  const tonguePath = getTonguePath(spec.type, jawOffset);
  const isDiphthong = ipaGroup === 'diphthongs' || spec.type.startsWith('diphthong');
  const isConsonant = ipaGroup === 'consonants';

  const voicingLabel = !isConsonant
    ? isEn ? 'Vowel (Vocal cords vibrate)' : 'Nguyên âm (Rung dây thanh)'
    : spec.voiced
    ? isEn ? 'Voiced (Throat vibrates)' : 'Hữu thanh (Rung cổ họng)'
    : isEn ? 'Voiceless (Air only)' : 'Vô thanh (Chỉ bật hơi)';

  const lipLabel =
    spec.lips === 'round'
      ? isEn ? 'Lips: Rounded' : 'Môi: Chu tròn'
      : spec.lips === 'spread'
      ? isEn ? 'Lips: Spread' : 'Môi: Căng ngang'
      : spec.lips === 'closed'
      ? isEn ? 'Lips: Pressed together' : 'Môi: Mím khít'
      : spec.lips === 'bite'
      ? isEn ? 'Teeth on lower lip' : 'Răng trên chạm môi dưới'
      : isEn ? 'Lips: Relaxed' : 'Môi: Thả lỏng';

  return (
    <div className="p-2.5 rounded-2xl bg-slate-900/95 border border-emerald-500/25 flex items-center gap-3">
      <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-hidden relative">
        <svg viewBox="0 0 180 145" className="w-full h-full" aria-label={`Mouth diagram for ${ipaSymbol}`}>
          {/* Head & Nasal Cavity Outline */}
          <path
            d="M 52,18 Q 105,12 145,40 Q 165,65 162,135 L 126,135 L 126,110 Q 134,80 128,55 Q 100,45 55,54 L 46,62 L 46,50 Q 42,35 52,18 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Hard & Soft Palate Roof */}
          <path
            d="M 55,54 Q 88,46 118,54 Q 134,60 138,76"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Upper Lip */}
          <path
            d={
              spec.lips === 'round'
                ? 'M 46,50 Q 34,54 38,63 Q 45,65 50,60'
                : spec.lips === 'closed'
                ? 'M 46,52 Q 37,58 41,69 Q 47,70 50,64'
                : 'M 46,50 Q 38,54 42,62 Q 48,64 51,58'
            }
            fill="#fb7185"
            opacity="0.85"
          />

          {/* Upper Front Teeth */}
          <path d="M 49,58 L 54,58 L 53,73 L 49,73 Z" fill="#f8fafc" />

          {/* Lower Jaw & Chin */}
          <path
            d={`M 48,${90 + jawOffset} L 42,${112 + jawOffset} Q 54,${132 + jawOffset} 112,${134} L 126,134`}
            fill="none"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Lower Front Teeth */}
          <path
            d={
              spec.lips === 'bite'
                ? `M 52,${82} L 56,${82} L 56,${95} L 52,${95} Z`
                : `M 49,${84 + jawOffset} L 54,${84 + jawOffset} L 53,${97 + jawOffset} L 49,${97 + jawOffset} Z`
            }
            fill="#f8fafc"
          />

          {/* Lower Lip */}
          <path
            d={
              spec.lips === 'bite'
                ? 'M 48,74 Q 40,78 44,88 Q 51,88 53,80'
                : spec.lips === 'round'
                ? `M 46,${82 + jawOffset} Q 34,${79 + jawOffset} 38,${70 + jawOffset} Q 45,${70 + jawOffset} 50,${76 + jawOffset}`
                : spec.lips === 'closed'
                ? 'M 46,82 Q 37,77 41,68 Q 47,68 50,74'
                : `M 46,${86 + jawOffset} Q 38,${82 + jawOffset} 42,${74 + jawOffset} Q 48,${74 + jawOffset} 51,${80 + jawOffset}`
            }
            fill="#fb7185"
            opacity="0.85"
          />

          {/* Tongue Body & Tip */}
          <path d={tonguePath} fill="#f43f5e" fillOpacity="0.72" stroke="#fda4af" strokeWidth="1.5" />

          {/* Airflow / Nasal Arrows */}
          {spec.airflow === 'nasal' ? (
            <path
              d="M 134,88 Q 126,44 74,36 L 44,40 M 49,35 L 42,40 L 50,44"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="3 2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d={
                spec.airflow === 'burst'
                  ? `M 120,76 Q 82,70 28,${72 + Math.floor(jawOffset / 2)} M 34,${67 + Math.floor(jawOffset / 2)} L 25,${72 + Math.floor(jawOffset / 2)} L 34,${77 + Math.floor(jawOffset / 2)}`
                  : `M 126,80 Q 82,74 32,${73 + Math.floor(jawOffset / 2)} M 38,${69 + Math.floor(jawOffset / 2)} L 30,${73 + Math.floor(jawOffset / 2)} L 38,${77 + Math.floor(jawOffset / 2)}`
              }
              fill="none"
              stroke="#34d399"
              strokeWidth="1.8"
              strokeDasharray={spec.airflow === 'burst' ? 'none' : '4 2'}
              strokeLinecap="round"
            />
          )}

          {/* Diphthong Glide Indicator */}
          {isDiphthong && (
            <path
              d="M 74,84 Q 90,72 104,78 M 100,73 L 106,79 L 98,81"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Vocal Cords Vibration Indicator in Throat */}
          {spec.voiced ? (
            <g stroke="#fbbf24" strokeWidth="1.8" fill="none">
              <path d="M 134,114 Q 139,118 134,122 Q 139,126 134,130" />
              <path d="M 141,114 Q 146,118 141,122 Q 146,126 141,130" />
            </g>
          ) : (
            <line x1="138" y1="115" x2="138" y2="131" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />
          )}
        </svg>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${
              spec.voiced
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {voicingLabel}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            {lipLabel}
          </span>
          {spec.airflow === 'nasal' && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {isEn ? 'Nasal Airflow' : 'Luồng hơi qua mũi'}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          {isEn
            ? 'Watch the red tongue tip/body position, lip shape, and yellow vocal cord wave in the throat.'
            : 'Quan sát vị trí lưỡi (đỏ), khẩu hình môi và sóng rung dây thanh quản (vàng) ở cổ họng.'}
        </p>
      </div>
    </div>
  );
}
