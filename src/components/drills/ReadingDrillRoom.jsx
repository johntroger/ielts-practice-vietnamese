import React from 'react';
import { RotateCcw, CheckCircle2, XCircle, Search, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { getLocalizedDrillTitle } from '../../utils/drillLocalization';

/**
 * ReadingDrillRoom
 * Manages 3 specialized Reading micro-drills:
 * 1. TRUE / FALSE / NOT GIVEN Trap-Breaker (includes English labels: "Your Selection:")
 * 2. Reading Paraphrase Hunter (includes English labels: "1. Exam Question:", "2. Passage Excerpt:")
 * 3. Matching Headings Trap-Breaker
 */
export default function ReadingDrillRoom({
  activeTab,
  currentTfng,
  userTfngChoice,
  setUserTfngChoice,
  showTfngResult,
  setShowTfngResult,
  currentReadingPara,
  showReadingParaAnalysis,
  setShowReadingParaAnalysis,
  currentHeadings,
  userHeadingChoice,
  setUserHeadingChoice,
  showHeadingsResult,
  setShowHeadingsResult
}) {
  const { isEn } = useTranslation();

  return (
    <div className="space-y-4">
      {/* ============================================================ */}
      {/* READING ROOM: 1. TRUE / FALSE / NOT GIVEN TRAP-BREAKER        */}
      {/* ============================================================ */}
      {activeTab === 'reading-tfng' && currentTfng && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                {currentTfng.category}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">
                {getLocalizedDrillTitle(currentTfng, isEn)}
              </h3>
            </div>
          </div>

          {/* Passage Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isEn ? 'Reading Excerpt:' : 'Đoạn trích bài đọc (Reading Excerpt):'}
            </span>
            <p className="text-sm font-serif leading-relaxed text-slate-800">
              {currentTfng.passage}
            </p>
          </div>

          {/* Statement Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              {isEn ? 'Statement to Verify:' : 'Phát biểu cần xác thực (Statement):'}
            </span>
            <p className="text-sm sm:text-base font-semibold text-blue-950">
              "{currentTfng.statement}"
            </p>
          </div>

          {/* Interactive 3 Choice Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              {isEn ? 'Your Selection:' : 'Lựa chọn của bạn (Your Selection):'}
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {[
                { 
                  val: 'TRUE', 
                  label: 'TRUE', 
                  desc: isEn ? 'Passage agrees with statement' : 'Bài đọc đồng ý với phát biểu', 
                  color: 'emerald' 
                },
                { 
                  val: 'FALSE', 
                  label: 'FALSE', 
                  desc: isEn ? 'Passage contradicts statement' : 'Bài đọc mâu thuẫn với phát biểu', 
                  color: 'rose' 
                },
                { 
                  val: 'NOT GIVEN', 
                  label: 'NOT GIVEN', 
                  desc: isEn ? 'No info / impossible to tell' : 'Không có thông tin / không thể biết', 
                  color: 'amber' 
                }
              ].map(opt => {
                const isSelected = userTfngChoice === opt.val;
                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                
                if (isSelected) {
                  if (opt.val === 'TRUE') btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30';
                  else if (opt.val === 'FALSE') btnStyle = 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30';
                  else btnStyle = 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-400/30';
                }

                return (
                  <button
                    key={opt.val}
                    onClick={() => setUserTfngChoice(opt.val)}
                    disabled={showTfngResult}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${btnStyle}`}
                  >
                    <span className="text-sm sm:text-base font-black tracking-wide">{opt.label}</span>
                    <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setUserTfngChoice(null);
                setShowTfngResult(false);
              }}
              className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Try this again' : 'Làm lại câu này'}</span>
            </button>

            <button
              onClick={() => {
                if (!userTfngChoice) {
                  alert(isEn 
                    ? 'Please select TRUE, FALSE or NOT GIVEN before checking.' 
                    : 'Vui lòng chọn TRUE, FALSE hoặc NOT GIVEN trước khi kiểm tra.');
                  return;
                }
                setShowTfngResult(true);
              }}
              disabled={!userTfngChoice}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isEn ? 'Check Answer & Trap Analysis' : 'Kiểm Tra Đáp Án & Mổ Xẻ Bẫy'}
            </button>
          </div>

          {/* In-depth Result & Trap Breakdown */}
          {showTfngResult && (
            <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
              userTfngChoice === currentTfng.answer
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {userTfngChoice === currentTfng.answer ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className={`font-bold text-sm ${
                    userTfngChoice === currentTfng.answer ? 'text-emerald-900' : 'text-rose-900'
                  }`}>
                    {userTfngChoice === currentTfng.answer
                      ? (isEn ? 'EXACT! You successfully avoided the trap.' : 'CHÍNH XÁC! Bạn đã phá bẫy thành công.')
                      : (isEn ? `INCORRECT! Correct answer is: ${currentTfng.answer}` : `CHƯA ĐÚNG! Đáp án chuẩn là: ${currentTfng.answer}`)}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[11px] font-bold">
                  {currentTfng.trapType}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {currentTfng.explanation}
              </p>

              {currentTfng.evidence && (
                <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700">
                  <strong>{isEn ? 'Reading Evidence:' : 'Manh mối bài đọc:'}</strong> <span className="italic font-serif">"{currentTfng.evidence}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* READING ROOM: 2. READING PARAPHRASE HUNTER                   */}
      {/* ============================================================ */}
      {activeTab === 'reading-paraphrase' && currentReadingPara && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                {currentReadingPara.category}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">
                {getLocalizedDrillTitle(currentReadingPara, isEn)}
              </h3>
            </div>
          </div>

          {/* Question vs Excerpt Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                1. Exam Question:
              </span>
              <p className="text-xs sm:text-sm font-medium text-blue-950 font-sans leading-relaxed">
                "{currentReadingPara.questionText}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                2. Passage Excerpt:
              </span>
              <p className="text-xs sm:text-sm font-serif text-emerald-950 leading-relaxed">
                "{currentReadingPara.passageExcerpt}"
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setShowReadingParaAnalysis(!showReadingParaAnalysis)}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>
                {showReadingParaAnalysis 
                  ? (isEn ? 'Hide Analysis' : 'Ẩn Phân Tích') 
                  : (isEn ? 'Explore Synonymous Pairs' : 'Khám Phá Các Cặp Từ Đồng Nghĩa')}
              </span>
            </button>
          </div>

          {/* Synonymous Pairs Table */}
          {showReadingParaAnalysis && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  {isEn ? 'Synonym Mapping Table:' : 'Bảng Đối Sánh Paraphrase (Synonym Mapping Table):'}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentReadingPara.pairs.map((pair, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 font-sans">{pair.questionWord}</span>
                      <span className="text-slate-400 font-bold">↔</span>
                      <span className="font-bold text-emerald-600 font-serif">{pair.passageWord}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                      👉 {isEn ? 'Meaning:' : 'Nghĩa:'} {pair.meaning}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                {isEn 
                  ? '💡 Band 8+ Reading Tip: In the actual exam, underline these keyword chunks to locate answers quickly instead of scanning for identical words!' 
                  : '💡 Bí kíp Reading Band 8+: Khi làm bài thi thật, hãy gạch chân các cụm từ này để xác định vị trí đáp án thay vì đi tìm từ khóa y hệt!'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* READING ROOM: 3. MATCHING HEADINGS TRAP-BREAKER              */}
      {/* ============================================================ */}
      {activeTab === 'reading-headings' && currentHeadings && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
                {currentHeadings.category}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">
                {getLocalizedDrillTitle(currentHeadings, isEn)}
              </h3>
            </div>
          </div>

          {/* Paragraph Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isEn ? 'Paragraph to Head:' : 'Đoạn văn cần đặt tiêu đề (Paragraph):'}
            </span>
            <p className="text-sm font-serif leading-relaxed text-slate-800">
              {currentHeadings.paragraph}
            </p>
          </div>

          {/* Headings List Choice */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">
              {isEn 
                ? 'Choose the most suitable heading for the paragraph above:' 
                : 'Chọn Tiêu Đề phù hợp nhất cho đoạn văn trên:'}
            </label>
            {currentHeadings.headings.map((h, idx) => {
              const isSelected = userHeadingChoice === idx;
              let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';
              
              if (showHeadingsResult) {
                if (h.isCorrect) {
                  cardStyle = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30';
                } else if (isSelected && !h.isCorrect) {
                  cardStyle = 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/30';
                }
              } else if (isSelected) {
                cardStyle = 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20';
              }

              return (
                <div
                  key={h.id || idx}
                  onClick={() => !showHeadingsResult && setUserHeadingChoice(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${cardStyle}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {h.text}
                      </p>
                      {showHeadingsResult && (
                        <div className="text-xs pt-1.5 border-t border-slate-200/60 space-y-1">
                          <span className={`font-bold ${h.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {h.isCorrect 
                              ? (isEn ? '✓ CORRECT HEADING:' : '✓ TIÊU ĐỀ ĐÚNG:') 
                              : `⚠️ ${h.type}:`}
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {h.analysis}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setUserHeadingChoice(null);
                setShowHeadingsResult(false);
              }}
              className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Try this again' : 'Làm lại câu này'}</span>
            </button>

            <button
              onClick={() => {
                if (userHeadingChoice === null) {
                  alert(isEn 
                    ? 'Please select a heading before checking.' 
                    : 'Vui lòng chọn một Tiêu đề trước khi kiểm tra.');
                  return;
                }
                setShowHeadingsResult(true);
              }}
              disabled={userHeadingChoice === null}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isEn ? 'Check & Analyze Heading Traps' : 'Kiểm Tra & Phân Tích Bẫy Tiêu Đề'}
            </button>
          </div>

          {/* Topic Sentence Highlight */}
          {showHeadingsResult && currentHeadings.topicSentence && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <strong>{isEn ? 'Core Topic Sentence:' : 'Câu chủ đề cốt lõi (Topic Sentence):'}</strong>
              <p className="italic font-serif">"{currentHeadings.topicSentence}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
