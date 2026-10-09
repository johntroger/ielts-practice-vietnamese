import React from 'react';
import { RotateCcw, Split } from 'lucide-react';
import { 
  getLocalizedDrillTitle, 
  getLocalizedDrillCategory, 
  getLocalizedDrillExplanation, 
  getLocalizedVocabOption 
} from '../../utils/drillLocalization';
import { getLocalizedVocabMeaning } from '../../utils/vocabLocalization';

/**
 * GeneralDrillRoom
 * Manages General Core Skills micro-drills:
 * 1. Contextual Vocabulary Decryption
 * 2. Sentence Chunking (S-V-O Core & Modifiers)
 * 3. Collocations C1-C2 Matching
 */
export default function GeneralDrillRoom({
  activeTab,
  currentVocab,
  userVocabChoice,
  setUserVocabChoice,
  showVocabResult,
  setShowVocabResult,
  currentChunk,
  showChunkAnalysis,
  setShowChunkAnalysis,
  currentColloc,
  userCollocAnswers,
  setUserCollocAnswers,
  showCollocResults,
  setShowCollocResults
}) {
  const { isEn } = useTranslation();

  return (
    <div className="space-y-4">
      {/* ============================================================ */}
      {/* GENERAL ROOM: 1. CONTEXT VOCABULARY                          */}
      {/* ============================================================ */}
      {activeTab === 'context-vocab' && currentVocab && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                {getLocalizedDrillCategory(currentVocab, isEn)}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">
                {getLocalizedDrillTitle(currentVocab, isEn)}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isEn ? 'Context Sentence:' : 'Câu chứa từ mới:'}
            </span>
            <p className="text-sm sm:text-base font-serif leading-relaxed text-slate-800">
              {currentVocab.sentence.split(currentVocab.targetWord).map((seg, i, arr) => (
                <React.Fragment key={i}>
                  <span>{seg}</span>
                  {i < arr.length - 1 && (
                    <span className="bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-300 font-sans mx-1">
                      {currentVocab.targetWord}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
            <div className="text-xs text-amber-800 pt-1">
              💡 <strong>{isEn ? 'Clue type:' : 'Gợi ý loại manh mối:'}</strong> {currentVocab.clueType}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              {isEn 
                ? `Based on context, what does "${currentVocab.targetWord}" mean?` 
                : `Dựa vào ngữ cảnh, từ "${currentVocab.targetWord}" có nghĩa là gì?`}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentVocab.options.map((opt, idx) => {
                const isSelected = userVocabChoice === idx;
                let style = 'border-slate-200 bg-white hover:border-slate-300';
                if (showVocabResult) {
                  if (opt.isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                  else if (isSelected) style = 'border-rose-500 bg-rose-50 text-rose-950';
                } else if (isSelected) {
                  style = 'border-amber-500 bg-amber-50 text-amber-900 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !showVocabResult && setUserVocabChoice(idx)}
                    className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start space-x-2 ${style}`}
                  >
                    <span className="font-bold opacity-60">{String.fromCharCode(65 + idx)}.</span>
                    <span>{getLocalizedVocabOption(opt, isEn)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setUserVocabChoice(null);
                setShowVocabResult(false);
              }}
              className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Try this again' : 'Làm lại câu này'}</span>
            </button>

            <button
              onClick={() => {
                if (userVocabChoice === null) {
                  alert(isEn ? 'Please select an option.' : 'Vui lòng chọn 1 đáp án.');
                  return;
                }
                setShowVocabResult(true);
              }}
              disabled={userVocabChoice === null}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isEn ? 'Check Meaning & Clues' : 'Kiểm Tra Nghĩa & Manh Mối'}
            </button>
          </div>

          {showVocabResult && (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-800">
                {isEn ? 'Context Clue Methodology Explanation:' : 'Giải thích phương pháp luận đoán:'}
              </h4>
              <p className="text-slate-600 leading-relaxed">{getLocalizedDrillExplanation(currentVocab, isEn)}</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* GENERAL ROOM: 2. SENTENCE CHUNKING (S-V-O)                   */}
      {/* ============================================================ */}
      {activeTab === 'sentence-chunking' && currentChunk && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                {getLocalizedDrillCategory(currentChunk, isEn)}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">
                {getLocalizedDrillTitle(currentChunk, isEn)}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isEn ? 'Complex Academic Sentence (40+ words):' : 'Câu học thuật phức dài (40+ từ):'}
            </span>
            <p className="text-sm sm:text-base font-serif leading-relaxed text-slate-900">
              "{currentChunk.fullSentence}"
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowChunkAnalysis(!showChunkAnalysis)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Split className="w-3.5 h-3.5" />
              <span>
                {showChunkAnalysis 
                  ? (isEn ? 'Hide Deconstruction' : 'Ẩn Giải Phẫu') 
                  : (isEn ? 'Deconstruct S-V-O Backbone' : 'Giải Phẫu Cấu Trúc Xương Sống (S-V-O)')}
              </span>
            </button>
          </div>

          {showChunkAnalysis && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-xs font-bold text-blue-800 block">
                    {isEn ? '1. Core Subject:' : '1. Chủ ngữ chính (Core Subject):'}
                  </span>
                  <p className="text-xs font-semibold text-blue-950 font-serif">
                    {currentChunk.subject}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 block">
                    {isEn ? '2. Core Verb:' : '2. Vị ngữ nòng cốt (Core Verb):'}
                  </span>
                  <p className="text-xs font-semibold text-emerald-950 font-serif">
                    {currentChunk.coreVerb}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                  <span className="text-xs font-bold text-purple-800 block">
                    {isEn ? '3. Object / Result:' : '3. Tân ngữ / Kết quả (Object / Result):'}
                  </span>
                  <p className="text-xs font-semibold text-purple-950 font-serif">
                    {currentChunk.objectResult}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">
                    {isEn ? '4. Modifiers & Subordinate Clauses:' : '4. Thành phần phụ (Modifiers):'}
                  </span>
                  <p className="text-xs text-slate-600 italic">
                    {currentChunk.subModifier}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                💡 <strong>{isEn ? 'Core takeaway:' : 'Bài học cốt lõi:'}</strong> {isEn && currentChunk.takeawayEn ? currentChunk.takeawayEn : (isEn ? getLocalizedDrillExplanation(currentChunk.takeawayVietnamese, true) : currentChunk.takeawayVietnamese)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* GENERAL ROOM: 3. COLLOCATIONS MATCHING                       */}
      {/* ============================================================ */}
      {activeTab === 'collocation' && currentColloc && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                {getLocalizedDrillCategory(currentColloc, isEn)}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">
                {getLocalizedDrillTitle(currentColloc, isEn)}
              </h3>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
            <strong>{isEn ? 'Task:' : 'Nhiệm vụ:'}</strong>{' '}
            {isEn 
              ? 'Match the Verb/Adjective on the left with the correct phrase on the right to build standard C1-C2 academic collocations.' 
              : 'Ghép cặp Động từ / Tính từ bên trái với Cụm từ bên phải để tạo thành Collocation học thuật chuẩn C1-C2.'}
          </div>

          <div className="space-y-2.5">
            {currentColloc.pairs.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{p.term} + ...</span>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={userCollocAnswers[p.term] || ''}
                    onChange={(e) => setUserCollocAnswers({ ...userCollocAnswers, [p.term]: e.target.value })}
                    disabled={showCollocResults}
                    className={`p-2 rounded-lg text-xs font-semibold border ${
                      showCollocResults
                        ? userCollocAnswers[p.term] === p.match
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : 'bg-red-100 text-red-900 border-red-400'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <option value="">{isEn ? '-- Select matching noun phrase --' : '-- Chọn cụm danh từ phù hợp --'}</option>
                    {currentColloc.pairs.map((optPair, oIdx) => (
                      <option key={oIdx} value={optPair.match}>
                        {optPair.match}
                      </option>
                    ))}
                  </select>
                </div>

                {showCollocResults && (
                  <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded sm:max-w-xs">
                    👉 <strong>{p.term} {p.match}</strong>: {isEn && p.meaningEn ? p.meaningEn : (isEn ? getLocalizedVocabMeaning(p, true) : p.meaning)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setUserCollocAnswers({});
                setShowCollocResults(false);
              }}
              className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset Exercise' : 'Làm lại bài này'}</span>
            </button>

            <button
              onClick={() => setShowCollocResults(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isEn ? 'Check Answers & Meanings' : 'Kiểm Tra Đáp Án & Nghĩa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
