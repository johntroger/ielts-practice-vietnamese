import React from 'react';
import { RotateCcw, Sparkles, Loader2, Award } from 'lucide-react';

/**
 * WritingDrillRoom
 * Manages Writing micro-drills:
 * 1. Fill in Blanks (Task 1 / Task 2 Trend & Signpost words)
 * 2. True / False Data Accuracy
 * 3. Sentence Paraphrase AI Grader
 * 4. Error Spotting & Grammar Correction
 */
export default function WritingDrillRoom({
  activeTab,
  currentFill,
  userFillAnswers,
  setUserFillAnswers,
  showFillResults,
  setShowFillResults,
  currentTf,
  userTfAnswers,
  setUserTfAnswers,
  showTfResults,
  setShowTfResults,
  currentPara,
  candidateParaText,
  setCandidateParaText,
  paraEvaluation,
  setParaEvaluation,
  isEvaluatingPara,
  handleEvaluateParaphrase,
  currentError,
  userCorrectionText,
  setUserCorrectionText,
  showErrorAnswer,
  setShowErrorAnswer
}) {
  return (
    <div className="space-y-4">
          {activeTab === 'fill-blanks' && currentFill && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                    {currentFill.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">{currentFill.title}</h3>
                </div>
              </div>

              {/* Passage with blank pills */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-loose font-sans">
                {currentFill.passage.split('___').map((segment, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{segment}</span>
                    {idx < arr.length - 1 && (
                      <span className="inline-block mx-1.5 align-middle">
                        <select
                          value={userFillAnswers[idx] || ''}
                          onChange={(e) => setUserFillAnswers({ ...userFillAnswers, [idx]: e.target.value })}
                          disabled={showFillResults}
                          className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${
                            showFillResults
                              ? userFillAnswers[idx]?.toLowerCase() === currentFill.blanks[idx]?.answer.toLowerCase()
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                : 'bg-red-100 text-red-900 border-red-400'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="">[Chọn từ]</option>
                          {currentFill.blanks[idx]?.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserFillAnswers({});
                    setShowFillResults(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài này</span>
                </button>

                <button
                  onClick={() => setShowFillResults(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án
                </button>
              </div>

              {/* Detailed Explanations */}
              {showFillResults && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800">Giải thích chi tiết từng vị trí:</h4>
                  {currentFill.blanks.map((b, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <strong className="text-red-600 shrink-0">Vị trí {i + 1} ({b.answer}):</strong>
                      <span className="text-slate-600">{b.explanation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* WRITING ROOM: 2. TRUE / FALSE DATA ACCURACY                  */}
          {/* ============================================================ */}
          {activeTab === 'true-false' && currentTf && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                    {currentTf.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentTf.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-mono">
                📊 <strong>Dữ liệu cho trước:</strong> {currentTf.context}
              </div>

              <div className="space-y-3">
                {currentTf.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {idx + 1}. {q.statement}
                      </p>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => setUserTfAnswers({ ...userTfAnswers, [q.id]: true })}
                          disabled={showTfResults}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                            userTfAnswers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          TRUE
                        </button>
                        <button
                          onClick={() => setUserTfAnswers({ ...userTfAnswers, [q.id]: false })}
                          disabled={showTfResults}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                            userTfAnswers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          FALSE
                        </button>
                      </div>
                    </div>

                    {showTfResults && (
                      <div className={`p-2.5 rounded-lg text-xs ${
                        userTfAnswers[q.id] === q.isTrue ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}>
                        <span className="font-bold">
                          {q.isTrue ? '✓ Đúng (TRUE):' : '✕ Sai (FALSE):'}
                        </span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserTfAnswers({});
                    setShowTfResults(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài này</span>
                </button>

                <button
                  onClick={() => setShowTfResults(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* WRITING ROOM: 3. PARAPHRASE EVALUATOR                        */}
          {/* ============================================================ */}
          {activeTab === 'paraphrase' && currentPara && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
                    {currentPara.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentPara.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                  Mục tiêu: {currentPara.targetBand}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                <span className="text-[11px] font-bold text-purple-700 block">Câu gốc (Band 5.5 - 6.0):</span>
                <p className="text-sm font-semibold text-purple-950 font-serif">
                  "{currentPara.originalSentence}"
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">💡 Gợi ý nâng cấp:</span>
                <div className="flex flex-wrap gap-2">
                  {currentPara.hints.map((h, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Câu bạn viết lại (Band 7.5+):</label>
                <textarea
                  rows={3}
                  value={candidateParaText}
                  onChange={(e) => setCandidateParaText(e.target.value)}
                  placeholder="Nhập câu paraphrase của bạn..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setCandidateParaText('');
                    setParaEvaluation(null);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Viết lại từ đầu</span>
                </button>

                <button
                  onClick={handleEvaluateParaphrase}
                  disabled={isEvaluatingPara || !candidateParaText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
                >
                  {isEvaluatingPara ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Đang Chấm Câu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Chấm Điểm Câu Bằng AI</span>
                    </>
                  )}
                </button>
              </div>

              {paraEvaluation && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-sm text-emerald-900">
                        Đánh giá câu: BAND {paraEvaluation.band ? paraEvaluation.band.toFixed(1) : '7.0'}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-800">
                      {paraEvaluation.isAccurateMeaning ? '✓ Giữ đúng 100% ngữ nghĩa' : '⚠️ Có sai lệch ngữ nghĩa'}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-950 leading-relaxed font-sans">
                    {paraEvaluation.feedback}
                  </p>

                  {paraEvaluation.alternatives && (
                    <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
                      <span className="font-bold text-xs text-emerald-900 block">
                        Phương án viết lại Band 8.5+ gợi ý:
                      </span>
                      {paraEvaluation.alternatives.map((alt, i) => (
                        <div key={i} className="p-2 rounded bg-white text-xs text-slate-800 border border-emerald-100 font-sans italic">
                          • {alt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* WRITING ROOM: 4. ERROR SPOTTING                              */}
          {/* ============================================================ */}
          {activeTab === 'error-spotting' && currentError && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold">
                    {currentError.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentError.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-1">
                <span className="text-[11px] font-bold text-red-700 block">Câu chứa lỗi sai:</span>
                <p className="text-sm font-semibold text-red-950">
                  "{currentError.sentenceWithErrors}"
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Câu bạn sửa lại:</label>
                <input
                  type="text"
                  value={userCorrectionText}
                  onChange={(e) => setUserCorrectionText(e.target.value)}
                  placeholder="Gõ lại câu đúng..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorAnswer(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                >
                  Xem Câu Đúng & Giải Thích
                </button>
              </div>

              {showErrorAnswer && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-2">
                  <div className="text-emerald-800 font-bold">
                    ✓ Câu chuẩn: "{currentError.targetCorrection}"
                  </div>
                  <p className="text-slate-600">
                    <strong>Giải thích ngữ pháp:</strong> {currentError.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
    </div>
  );
}
