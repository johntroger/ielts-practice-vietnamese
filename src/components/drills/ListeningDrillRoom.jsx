import React from 'react';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  EyeOff,
  Eye
} from 'lucide-react';
import MicroDrillAudioBar from '../listening/MicroDrillAudioBar';
import { useTranslation } from '../../i18n';
import { getLocalizedDrillTitle } from '../../utils/drillLocalization';

/**
 * ListeningDrillRoom
 * Manages 5 specialized Listening micro-labs:
 * 1. Dictation (Chép chính tả 3 cấp độ)
 * 2. Spelling & Numbers (Đánh vần tên riêng & chữ số)
 * 3. Distractor Hunter (Bẫy nhiễu nghe hiểu)
 * 4. Map & Directions (Định vị bản đồ & phương hướng)
 * 5. Signposting Signals (Từ nối chuyển đoạn thuyết trình)
 */
export default function ListeningDrillRoom({
  activeTab,
  renderPaginationBar,
  currentDictation,
  userDictationInput,
  setUserDictationInput,
  showDictationFeedback,
  setShowDictationFeedback,
  currentSpelling,
  userSpellingInput,
  setUserSpellingInput,
  showSpellingResult,
  setShowSpellingResult,
  currentDistractor,
  userDistractorChoice,
  setUserDistractorChoice,
  showDistractorResult,
  setShowDistractorResult,
  showListeningTranscript,
  setShowListeningTranscript,
  currentMap,
  userMapChoice,
  setUserMapChoice,
  showMapResult,
  setShowMapResult,
  currentSign,
  userSignChoice,
  setUserSignChoice,
  showSignResult,
  setShowSignResult,
  saveListeningHistory,
  handleEvaluateCurrentListening,
  isEvaluatingListening,
  listeningEvaluation,
  currentUser = null
}) {
  const { isEn } = useTranslation();

  return (
    <div className="space-y-4">
              {renderPaginationBar()}

              {/* 1. DICTATION CHÉP CHÍNH TẢ 3 CẤP ĐỘ */}
              {activeTab === 'listening-dictation' && currentDictation && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-bold uppercase">
                      {currentDictation.category} • {currentDictation.difficulty}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {getLocalizedDrillTitle(currentDictation, isEn)}
                    </h3>
                  </div>

                  {/* Authentic CD-IELTS Style Audio Player Bar */}
                  <MicroDrillAudioBar
                    drillId={currentDictation.id}
                    audioText={currentDictation.audioText || currentDictation.ttsText}
                    title={`Dictation: ${getLocalizedDrillTitle(currentDictation, isEn)}`}
                    accent="en-GB"
                    currentUser={currentUser}
                  />

                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs text-purple-900 space-y-1">
                    <p className="font-bold flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isEn ? 'Practice Rules:' : 'Quy tắc luyện tập:'}</span>
                    </p>
                    <p className="text-slate-600">
                      {isEn 
                        ? 'Click the audio play button to listen. Type the exact words you hear in the box below. The system will compare word-by-word and provide color-coded visual feedback.'
                        : 'Bấm nút phát âm thanh để nghe câu đọc. Hãy gõ chính xác từng từ bạn nghe được vào ô bên dưới. Hệ thống sẽ so sánh từng từ và phản hồi trực quan bằng màu sắc.'}
                    </p>
                    {currentDictation.audioClipTip && (
                      <p className="text-purple-700 italic pt-1 border-t border-purple-200/50">
                        💡 {currentDictation.audioClipTip}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">{isEn ? 'Your transcribed sentence:' : 'Câu bạn chép lại:'}</label>
                    <textarea
                      rows={3}
                      value={userDictationInput}
                      onChange={(e) => setUserDictationInput(e.target.value)}
                      placeholder={isEn ? 'Type the complete English sentence you just heard...' : 'Gõ lại toàn bộ câu tiếng Anh bạn vừa nghe...'}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setUserDictationInput('');
                        setShowDictationFeedback(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 font-semibold"
                    >
                      {isEn ? 'Clear & Retry' : 'Xóa làm lại'}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleEvaluateCurrentListening}
                        disabled={isEvaluatingListening || !userDictationInput.trim()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
                        title={isEn ? 'Ask AI to analyze dropped sounds, pronunciation, and connected speech' : 'Nhờ AI phân tích lỗi nuốt âm, phát âm và nối từ'}
                      >
                        {isEvaluatingListening ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{isEn ? 'AI analyzing...' : 'AI đang phân tích...'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isEn ? 'AI Listening Diagnostic' : 'AI Chẩn Đoán Lỗi Nghe'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowDictationFeedback(true)}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                      >
                        {isEn ? 'Check Word-by-Word' : 'Kiểm Tra Chính Tả Từng Từ'}
                      </button>
                    </div>
                  </div>

                  {/* AI Evaluation Card if available */}
                  {listeningEvaluation && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-purple-950 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>{isEn ? 'Cambridge Phonetic AI Diagnostic:' : 'AI Chẩn Đoán Âm Học Cambridge:'}</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          listeningEvaluation.accuracyScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isEn ? 'Accuracy:' : 'Độ chính xác:'} {listeningEvaluation.accuracyScore}%
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>{isEn ? 'Phonetic & Listening Analysis:' : 'Phân tích ngữ âm & lỗi nghe:'}</strong> {listeningEvaluation.phoneticFeedback}
                      </p>
                      {listeningEvaluation.trapAnalysis && (
                        <p className="text-purple-900 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                          <strong>{isEn ? 'Identified Trap:' : 'Bẫy nhận diện:'}</strong> {listeningEvaluation.trapAnalysis}
                        </p>
                      )}
                      {listeningEvaluation.recommendedReflex && (
                        <p className="text-emerald-800 font-medium italic">
                          💡 <strong>{isEn ? 'Exam Reflex Tip:' : 'Mẹo phản xạ phòng thi:'}</strong> {listeningEvaluation.recommendedReflex}
                        </p>
                      )}
                    </div>
                  )}

                  {showDictationFeedback && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
                      <div className="font-bold text-xs text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
                        <span>{isEn ? 'Visual Comparison Breakdown:' : 'Phân tích đối chiếu trực quan:'}</span>
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="text-emerald-700 font-bold">{isEn ? '● Correct' : '● Đúng'}</span>
                          <span className="text-rose-700 font-bold">{isEn ? '● Misspelling / Extra words' : '● Sai chính tả / thừa từ'}</span>
                          <span className="text-slate-500">{isEn ? '● Missed words' : '● Nghe sót'}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm leading-relaxed space-y-2 font-mono">
                        <div>
                          <span className="text-[11px] font-sans text-slate-500 block font-bold">{isEn ? 'Official Cambridge sentence:' : 'Câu chuẩn Cambridge:'}</span>
                          <span className="text-emerald-800 font-semibold">{currentDictation.targetTranscript}</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-sans text-slate-500 block font-bold">{isEn ? 'Your transcript:' : 'Bản chép của bạn:'}</span>
                          <span className={userDictationInput.trim().toLowerCase() === currentDictation.targetTranscript.trim().toLowerCase() ? "text-emerald-600 font-bold" : "text-amber-800 font-medium"}>
                            {userDictationInput || (isEn ? '(No text entered yet)' : '(Chưa gõ câu nào)')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. ĐÁNH VẦN, TÊN RIÊNG & CON SỐ */}
              {activeTab === 'listening-spelling' && currentSpelling && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[11px] font-bold uppercase">
                      {currentSpelling.category} • {isEn ? 'Type' : 'Dạng'} {currentSpelling.subType}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {getLocalizedDrillTitle(currentSpelling, isEn)}
                    </h3>
                  </div>

                  {/* Authentic CD-IELTS Style Audio Player Bar */}
                  <MicroDrillAudioBar
                    drillId={currentSpelling.id}
                    audioText={currentSpelling.audioText || currentSpelling.promptAudioText}
                    title={isEn ? `Spelling / Number: ${getLocalizedDrillTitle(currentSpelling, isEn)}` : `Đánh vần / Số: ${currentSpelling.title}`}
                    accent="en-GB"
                    currentUser={currentUser}
                  />

                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                    <p className="font-bold">{isEn ? 'Task Prompt:' : 'Đề bài yêu cầu:'}</p>
                    <p className="text-slate-700">
                      {currentSpelling.questionPrompt || (isEn ? 'Listen to the native speaker and type the correct keyword or numbers into the box below.' : 'Nghe người bản xứ đọc / đánh vần và gõ lại đúng từ khóa hoặc con số vào ô bên dưới.')}
                    </p>
                    {currentSpelling.trapNote && (
                      <p className="text-indigo-700 font-medium pt-1 border-t border-indigo-200/60">
                        ⚠️ {isEn ? 'Caution:' : 'Cảnh giác:'} {currentSpelling.trapNote}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">{isEn ? 'Your answer:' : 'Đáp án bạn nghe được:'}</label>
                    <input
                      type="text"
                      value={userSpellingInput}
                      onChange={(e) => setUserSpellingInput(e.target.value)}
                      placeholder={isEn ? 'Type the word or number heard...' : 'Gõ từ hoặc con số nghe được...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setUserSpellingInput('');
                        setShowSpellingResult(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 font-semibold"
                    >
                      {isEn ? 'Clear & Retry' : 'Xóa làm lại'}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleEvaluateCurrentListening}
                        disabled={isEvaluatingListening || !userSpellingInput.trim()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
                        title={isEn ? 'Ask AI to analyze spelling mistakes and letter pronunciation traps' : 'Nhờ AI phân tích lỗi sai chính tả và bẫy phát âm chữ cái'}
                      >
                        {isEvaluatingListening ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{isEn ? 'AI analyzing...' : 'AI đang phân tích...'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isEn ? 'AI Spelling Diagnostic' : 'AI Chẩn Đoán Lỗi Đánh Vần'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setShowSpellingResult(true);
                          const isCorrect = currentSpelling.acceptableAnswers.map(a => a.toLowerCase()).includes(userSpellingInput.trim().toLowerCase());
                          saveListeningHistory(currentSpelling, isCorrect);
                        }}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                      >
                        {isEn ? 'Check Answer' : 'Kiểm Tra Đáp Án'}
                      </button>
                    </div>
                  </div>

                  {/* AI Evaluation Card if available */}
                  {listeningEvaluation && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-indigo-950 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>{isEn ? 'AI Spelling & Dictation Diagnostic:' : 'AI Chẩn Đoán Chính Tả & Đánh Vần:'}</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          listeningEvaluation.accuracyScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isEn ? 'Accuracy:' : 'Độ chính xác:'} {listeningEvaluation.accuracyScore}%
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>{isEn ? 'Letter & Phonetic Analysis:' : 'Phân tích ký tự & âm thanh:'}</strong> {listeningEvaluation.phoneticFeedback}
                      </p>
                      {listeningEvaluation.trapAnalysis && (
                        <p className="text-indigo-900 bg-white/80 p-2.5 rounded-lg border border-indigo-100">
                          <strong>{isEn ? 'Confusable Sound Trap:' : 'Bẫy âm thanh dễ nhầm:'}</strong> {listeningEvaluation.trapAnalysis}
                        </p>
                      )}
                      {listeningEvaluation.recommendedReflex && (
                        <p className="text-emerald-800 font-medium italic">
                          💡 <strong>{isEn ? 'Reflex Strategy:' : 'Chiến thuật phản xạ:'}</strong> {listeningEvaluation.recommendedReflex}
                        </p>
                      )}
                    </div>
                  )}

                  {showSpellingResult && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center space-x-2">
                        {currentSpelling.acceptableAnswers.map(a => a.toLowerCase()).includes(userSpellingInput.trim().toLowerCase()) ? (
                          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{isEn ? 'CORRECT! You nailed the exact word / number.' : 'CHÍNH XÁC! Bạn đã bắt trúng từ vựng / con số chuẩn.'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-rose-700 font-bold">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>{isEn ? 'INCORRECT! Correct answer is:' : 'CHƯA CHÍNH XÁC! Đáp án chuẩn là:'} <strong className="font-mono text-slate-900 underline ml-1">{currentSpelling.correctAnswer}</strong></span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                        <strong>{isEn ? 'Detailed Explanation:' : 'Giải thích chi tiết:'}</strong> {currentSpelling.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. PHÁ BẪY DISTRACTORS */}
              {activeTab === 'listening-distractor' && currentDistractor && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold uppercase">
                      {currentDistractor.category} • {isEn ? 'Distractor Trap' : 'Bẫy Distractor'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {getLocalizedDrillTitle(currentDistractor, isEn)}
                    </h3>
                  </div>

                  {/* Authentic CD-IELTS Style Audio Player Bar */}
                  <MicroDrillAudioBar
                    drillId={currentDistractor.id}
                    audioText={currentDistractor.audioText || currentDistractor.audioSnippetText}
                    title={isEn ? `Trap Dialogue: ${getLocalizedDrillTitle(currentDistractor, isEn)}` : `Hội thoại bẫy: ${currentDistractor.title}`}
                    accent="en-GB"
                    currentUser={currentUser}
                  />

                  {/* Collapsible Transcript: Hidden by default so user must practice listening first */}
                  <div className="rounded-xl border border-amber-200/90 bg-amber-50/40 overflow-hidden text-xs transition-all">
                    <button
                      type="button"
                      onClick={() => setShowListeningTranscript(prev => !prev)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-slate-700 hover:text-slate-900 hover:bg-amber-100/50 font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-800">{isEn ? 'Dialogue Transcript' : 'Đoạn hội thoại đã gỡ băng (Transcript)'}</span>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                          {showListeningTranscript ? (isEn ? 'Open' : 'Đang mở') : (isEn ? 'Hidden' : 'Đang ẩn')}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1">
                        {showListeningTranscript ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Hide transcript' : 'Ẩn gỡ băng'}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isEn ? 'View transcript' : 'Xem gỡ băng'}</span>
                          </>
                        )}
                      </span>
                    </button>

                    {showListeningTranscript && (
                      <div className="p-4 pt-2.5 border-t border-amber-200/70 bg-amber-50/90 text-xs space-y-1.5 animate-in fade-in duration-150">
                        <p className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                          {isEn ? 'Dialogue Content:' : 'Nội dung đoạn hội thoại:'}
                        </p>
                        <p className="text-slate-700 italic leading-relaxed">
                          "{currentDistractor.audioSnippetText}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">{currentDistractor.question}</p>
                    <div className="space-y-2">
                      {currentDistractor.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setUserDistractorChoice(opt.id);
                            setShowDistractorResult(true);
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-2.5 cursor-pointer ${
                            userDistractorChoice === opt.id 
                              ? 'bg-amber-100/80 border-amber-400 text-amber-950 ring-2 ring-amber-400/30 font-bold' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0 mt-0.5">
                            {opt.id}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {showDistractorResult && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex justify-end">
                        <button
                          onClick={handleEvaluateCurrentListening}
                          disabled={isEvaluatingListening}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
                          title={isEn ? 'Ask AI to dissect psychological traps and speaker mind-changes' : 'Nhờ AI mổ xẻ bẫy tâm lý và cách người nói thay đổi quyết định'}
                        >
                          {isEvaluatingListening ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isEn ? 'AI analyzing trap...' : 'AI đang phân tích bẫy...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isEn ? 'AI Distractor Trap Decoder' : 'AI Mổ Xẻ Bẫy Distractor'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {listeningEvaluation && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-amber-950 flex items-center space-x-1.5">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              <span>{isEn ? 'AI Analysis: Mind Changes & Distractor Traps:' : 'AI Phân Tích Bẫy Đổi Ý & Gây Nhiễu:'}</span>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              listeningEvaluation.accuracyScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {listeningEvaluation.accuracyScore >= 85 
                                ? (isEn ? '✓ Successfully avoided trap' : '✓ Vượt bẫy thành công') 
                                : (isEn ? '✕ Fell into camouflage trap' : '✕ Dính bẫy ngụy trang')}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            <strong>{isEn ? 'Dialogue context analysis:' : 'Phân tích ngữ cảnh hội thoại:'}</strong> {listeningEvaluation.phoneticFeedback}
                          </p>
                          {listeningEvaluation.trapAnalysis && (
                            <p className="text-amber-900 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                              <strong>{isEn ? 'Cambridge trap mechanism:' : 'Cơ chế gài bẫy Cambridge:'}</strong> {listeningEvaluation.trapAnalysis}
                            </p>
                          )}
                          {listeningEvaluation.recommendedReflex && (
                            <p className="text-emerald-800 font-medium italic">
                              💡 <strong>{isEn ? 'Exam alert tip:' : 'Mẹo cảnh giác phòng thi:'}</strong> {listeningEvaluation.recommendedReflex}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold">
                          {userDistractorChoice === currentDistractor.correctOption ? (
                            <span className="text-emerald-700 flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4 inline" />
                              <span>{isEn ? 'CORRECT! You avoided the speaker change-of-mind trap.' : 'CHÍNH XÁC! Bạn không bị dính bẫy lật kèo của người nói.'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center space-x-1">
                              <XCircle className="w-4 h-4 inline" />
                              <span>{isEn ? 'YOU FELL FOR THE TRAP! Final correct answer is:' : 'BẠN ĐÃ DÍNH BẪY! Đáp án đúng cuối cùng là:'} <strong>{currentDistractor.correctOption}</strong></span>
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-slate-600 pt-1 border-t border-slate-200">
                          <p><strong>{isEn ? 'Cambridge Trap Mechanism:' : 'Cơ chế bẫy của Cambridge:'}</strong> {currentDistractor.distractorMechanism}</p>
                          <p><strong>{isEn ? 'Explanation:' : 'Giải thích:'}</strong> {currentDistractor.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. BẢN ĐỒ & ĐỊNH HƯỚNG PHƯƠNG HƯỚNG */}
              {activeTab === 'listening-map' && currentMap && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
                      {currentMap.category} • {isEn ? 'Map Navigation Trainer' : 'Huấn luyện sơ đồ bản đồ'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {getLocalizedDrillTitle(currentMap, isEn)}
                    </h3>
                  </div>

                  {/* Authentic CD-IELTS Style Audio Player Bar */}
                  <MicroDrillAudioBar
                    drillId={currentMap.id}
                    audioText={currentMap.audioText || currentMap.audioDirectionsText}
                    title={isEn ? `Map Directions: ${getLocalizedDrillTitle(currentMap, isEn)}` : `Chỉ dẫn bản đồ: ${currentMap.title}`}
                    accent="en-GB"
                    currentUser={currentUser}
                  />

                  {/* Collapsible Spatial Direction Transcript: Hidden by default */}
                  <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 overflow-hidden text-xs transition-all">
                    <button
                      type="button"
                      onClick={() => setShowListeningTranscript(prev => !prev)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-slate-700 hover:text-slate-900 hover:bg-emerald-100/50 font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">{isEn ? 'Spatial Directions Transcript' : 'Lời chỉ dẫn không gian (Transcript)'}</span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          {showListeningTranscript ? (isEn ? 'Open' : 'Đang mở') : (isEn ? 'Hidden' : 'Đang ẩn')}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1">
                        {showListeningTranscript ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Hide directions' : 'Ẩn chỉ dẫn'}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isEn ? 'View directions' : 'Xem chỉ dẫn'}</span>
                          </>
                        )}
                      </span>
                    </button>

                    {showListeningTranscript && (
                      <div className="p-4 pt-2.5 border-t border-emerald-200/70 bg-emerald-50/90 text-xs space-y-2 animate-in fade-in duration-150">
                        <p className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                          {isEn ? 'Spatial Directions Content:' : 'Nội dung chỉ dẫn không gian:'}
                        </p>
                        <p className="text-slate-700 italic leading-relaxed">
                          "{currentMap.audioDirectionsText}"
                        </p>
                        {currentMap.spatialClues && currentMap.spatialClues.length > 0 && (
                          <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap gap-1.5">
                            {currentMap.spatialClues.map((clue, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 font-mono text-[10px] font-bold">
                                📍 {clue}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">{currentMap.question}</p>
                    <div className="space-y-2">
                      {currentMap.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setUserMapChoice(opt.id);
                            setShowMapResult(true);
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-2.5 cursor-pointer ${
                            userMapChoice === opt.id 
                              ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30 font-bold' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0 mt-0.5">
                            {opt.id}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {showMapResult && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex justify-end">
                        <button
                          onClick={handleEvaluateCurrentListening}
                          disabled={isEvaluatingListening}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
                          title={isEn ? 'Ask AI to explain landmarks and directional traps in detail' : 'Nhờ AI giải thích chi tiết mốc tọa độ và bẫy phương hướng'}
                        >
                          {isEvaluatingListening ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isEn ? 'AI analyzing map...' : 'AI đang phân tích sơ đồ...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isEn ? 'AI Map Diagnostic' : 'AI Chẩn Đoán Lỗi Bản Đồ'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {listeningEvaluation && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-emerald-950 flex items-center space-x-1.5">
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                              <span>{isEn ? 'AI Analysis: Spatial Orientation & Map Route:' : 'AI Phân Tích Định Vị & Lộ Trình Sơ Đồ:'}</span>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              listeningEvaluation.accuracyScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {listeningEvaluation.accuracyScore >= 85 
                                ? (isEn ? '✓ Accurate orientation' : '✓ Định vị chính xác') 
                                : (isEn ? '✕ Mistook coordinate landmark' : '✕ Nhầm mốc tọa độ')}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            <strong>{isEn ? 'Spatial directions analysis:' : 'Phân tích chỉ dẫn không gian:'}</strong> {listeningEvaluation.phoneticFeedback}
                          </p>
                          {listeningEvaluation.trapAnalysis && (
                            <p className="text-emerald-900 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                              <strong>{isEn ? 'Directional trap landmark:' : 'Mốc bẫy phương hướng:'}</strong> {listeningEvaluation.trapAnalysis}
                            </p>
                          )}
                          {listeningEvaluation.recommendedReflex && (
                            <p className="text-teal-800 font-medium italic">
                              💡 <strong>{isEn ? 'Pencil-tracking exam tip:' : 'Mẹo di chuyển bút trên sơ đồ:'}</strong> {listeningEvaluation.recommendedReflex}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold">
                          {userMapChoice === currentMap.correctOption ? (
                            <span className="text-emerald-700 flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4 inline" />
                              <span>{isEn ? 'EXCELLENT! You identified the exact location on the map.' : 'XUẤT SẮC! Bạn đã xác định chính xác vị trí trên sơ đồ.'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center space-x-1">
                              <XCircle className="w-4 h-4 inline" />
                              <span>{isEn ? 'INCORRECT! The correct location is:' : 'CHƯA ĐÚNG! Vị trí chuẩn là:'} <strong>{currentMap.correctOption}</strong></span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                          <strong>{isEn ? 'Detailed route:' : 'Lộ trình chi tiết:'}</strong> {currentMap.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. BẮT TÍN HIỆU CHUYỂN Ý HỌC THUẬT PART 4 */}
              {activeTab === 'listening-signposting' && currentSign && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase">
                      {currentSign.category} • Signposting Catcher
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {getLocalizedDrillTitle(currentSign, isEn)}
                    </h3>
                  </div>

                  {/* Authentic CD-IELTS Style Audio Player Bar */}
                  <MicroDrillAudioBar
                    drillId={currentSign.id}
                    audioText={currentSign.audioText || currentSign.audioSnippetText}
                    title={isEn ? `Part 4 Lecture: ${getLocalizedDrillTitle(currentSign, isEn)}` : `Bài giảng Part 4: ${currentSign.title}`}
                    accent="en-GB"
                    currentUser={currentUser}
                  />

                  {/* Collapsible Lecture Transcript: Hidden by default */}
                  <div className="rounded-xl border border-indigo-200/90 bg-indigo-50/40 overflow-hidden text-xs transition-all">
                    <button
                      type="button"
                      onClick={() => setShowListeningTranscript(prev => !prev)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-slate-700 hover:text-slate-900 hover:bg-indigo-100/50 font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-800">{isEn ? 'Part 4 Lecture Transcript' : 'Trích đoạn bài giảng Part 4 (Transcript)'}</span>
                        <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                          {showListeningTranscript ? (isEn ? 'Open' : 'Đang mở') : (isEn ? 'Hidden' : 'Đang ẩn')}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1">
                        {showListeningTranscript ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Hide lecture' : 'Ẩn bài giảng'}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isEn ? 'View lecture' : 'Xem bài giảng'}</span>
                          </>
                        )}
                      </span>
                    </button>

                    {showListeningTranscript && (
                      <div className="p-4 pt-2.5 border-t border-indigo-200/70 bg-indigo-50/90 text-xs space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-950 text-[11px] uppercase tracking-wider">{isEn ? 'Lecture Excerpt:' : 'Nội dung bài giảng:'}</span>
                          {currentSign.signpostType && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200/80 text-indigo-900">
                              🎯 {currentSign.signpostType}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 italic leading-relaxed pt-1">
                          "{currentSign.audioSnippetText}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">{currentSign.question}</p>
                    <div className="space-y-2">
                      {currentSign.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setUserSignChoice(opt.id);
                            setShowSignResult(true);
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-2.5 cursor-pointer ${
                            userSignChoice === opt.id 
                              ? 'bg-indigo-100/80 border-indigo-400 text-indigo-950 ring-2 ring-indigo-400/30 font-bold' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0 mt-0.5">
                            {opt.id}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {showSignResult && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex justify-end">
                        <button
                          onClick={handleEvaluateCurrentListening}
                          disabled={isEvaluatingListening}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
                          title={isEn ? 'Ask AI to dissect lecture discourse structure and logical signposts' : 'Nhờ AI mổ xẻ cấu trúc bài giảng học thuật và tín hiệu chuyển mạch logic'}
                        >
                          {isEvaluatingListening ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isEn ? 'AI analyzing signals...' : 'AI đang phân tích tín hiệu...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isEn ? 'AI Part 4 Signpost Diagnostic' : 'AI Chẩn Đoán Tín Hiệu Part 4'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {listeningEvaluation && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-xs space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-indigo-950 flex items-center space-x-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              <span>{isEn ? 'AI Analysis: Signposting & Discourse Structure:' : 'AI Phân Tích Mốc Chuyển Ý & Cấu Trúc Diễn Ngôn:'}</span>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              listeningEvaluation.accuracyScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {listeningEvaluation.accuracyScore >= 85 
                                ? (isEn ? '✓ Accurate recognition' : '✓ Nhận diện chuẩn xác') 
                                : (isEn ? '✕ Missed signpost signal' : '✕ Bỏ lỡ tín hiệu')}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            <strong>{isEn ? 'Lecture discourse analysis:' : 'Phân tích văn cảnh bài giảng:'}</strong> {listeningEvaluation.phoneticFeedback}
                          </p>
                          {listeningEvaluation.trapAnalysis && (
                            <p className="text-indigo-900 bg-white/80 p-2.5 rounded-lg border border-indigo-200">
                              <strong>{isEn ? 'Signposting orientation markers:' : 'Dấu mốc định hướng:'}</strong> {listeningEvaluation.trapAnalysis}
                            </p>
                          )}
                          {listeningEvaluation.recommendedReflex && (
                            <p className="text-emerald-800 font-medium italic">
                              💡 <strong>{isEn ? 'Part 4 listening reflex tip:' : 'Phản xạ bắt bài giảng Part 4:'}</strong> {listeningEvaluation.recommendedReflex}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold">
                          {userSignChoice === currentSign.correctOption ? (
                            <span className="text-emerald-700 flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4 inline" />
                              <span>{isEn ? 'CAUGHT THE SIGNPOST! You correctly recognized the lecture transition marker.' : 'BẮT TRÚNG TÍN HIỆU! Bạn đã nhận diện chính xác mốc chuyển ý của bài giảng.'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center space-x-1">
                              <XCircle className="w-4 h-4 inline" />
                              <span>{isEn ? 'INCORRECT! The correct signpost signal is:' : 'CHƯA CHÍNH XÁC! Tín hiệu chuyển ý chuẩn xác là:'} <strong>{currentSign.correctOption}</strong></span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                          <strong>{isEn ? 'Tactical analysis:' : 'Phân tích chiến thuật:'}</strong> {currentSign.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

    </div>
  );
}
