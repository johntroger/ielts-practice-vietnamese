import React from 'react';
import {
  Mic,
  VolumeX,
  Volume2,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Loader2,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  Target,
  Split
} from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * SpeakingDrillRoom
 * Manages Fluency & Reflex Speaking micro-drills:
 * 1. A.R.E.A Formula (Answer, Reason, Example, Alternative)
 * 2. Natural Fillers & Thinking Time
 * 3. Collocations Reflex Speed Training
 * 4. Part 3 Counter-Argument & Synthesis
 */
export default function SpeakingDrillRoom({
  activeTab,
  currentArea,
  userAreaNotes,
  setUserAreaNotes,
  isRecordingArea,
  setIsRecordingArea,
  showAreaModel,
  setShowAreaModel,
  currentFiller,
  userFillerChoice,
  setUserFillerChoice,
  showFillerResult,
  setShowFillerResult,
  currentSpeakingColloc,
  userSpeakingCollocChoice,
  setUserSpeakingCollocChoice,
  showSpeakingCollocResult,
  setShowSpeakingCollocResult,
  currentPart3,
  userPart3SpokenText,
  setUserPart3SpokenText,
  isRecordingPart3,
  setIsRecordingPart3,
  showPart3Model,
  setShowPart3Model,
  handlePlaySpeakingAudio,
  playingAudioId,
  handleToggleVoiceDictation,
  handleEvaluateCurrentSpeaking,
  isEvaluatingSpeaking,
  speakingEvaluation
}) {
  const { t, language, isEn } = useTranslation();

  return (
    <div className="space-y-5">
              {/* 1. CÔNG THỨC MỞ RỘNG Ý TƯỞNG A.R.E.A */}
              {activeTab === 'speaking-area' && currentArea && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {currentArea.part || 'Speaking'} • {currentArea.difficulty || 'Band 7.0 - 8.5'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200">
                          {currentArea.topic}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5">{currentArea.title}</h3>
                    </div>
                  </div>

                  {/* Examiner Question Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-md border border-emerald-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        <Mic className="w-4 h-4 text-emerald-400" />
                        <span>{isEn ? 'Examiner Prompt:' : 'Giám Khảo Hỏi (Examiner Prompt):'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlaySpeakingAudio(currentArea.question, `area-q-${currentArea.id}`, 'en-GB')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                          playingAudioId === `area-q-${currentArea.id}`
                            ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/50'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title={isEn ? 'Listen to examiner prompt in British accent' : 'Nghe giọng giám khảo đọc chuẩn British Accent'}
                      >
                        {playingAudioId === `area-q-${currentArea.id}` ? (
                          <>
                            <VolumeX className="w-4 h-4 animate-pulse" />
                            <span>{isEn ? 'Stop' : 'Dừng Đọc'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>{isEn ? 'Listen to Examiner' : 'Nghe Giám Khảo'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-white font-serif leading-snug">
                      "{currentArea.question}"
                    </div>

                    {currentArea.tip && (
                      <div className="text-xs text-emerald-200/90 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span><strong>{isEn ? 'Reflex tip:' : 'Mẹo phản xạ:'}</strong> {currentArea.tip}</span>
                      </div>
                    )}
                  </div>

                  {/* 4-Step A.R.E.A Formula Builder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>{isEn ? '4-Step A.R.E.A Framework (Enter ideas or click keyword suggestions):' : 'Khung Trả Lời 4 Bước A.R.E.A (Nhập ý tưởng hoặc bấm từ gợi ý):'}</span>
                      </span>
                      <span className="text-slate-500 font-normal hidden sm:inline">{isEn ? 'Cambridge Speaking Standard' : 'Chuẩn Cambridge Speaking'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Step 1: Answer */}
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-2 hover:border-emerald-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">A</span>
                            <span>{currentArea.formula.answer.label}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{currentArea.formula.answer.prompt}</p>
                        
                        {/* Keyword suggestions */}
                        <div className="flex flex-wrap gap-1.5">
                          {currentArea.formula.answer.keywords.map((kw, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setUserAreaNotes(prev => ({
                                ...prev,
                                answer: prev.answer ? `${prev.answer} ${kw}` : kw
                              }))}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium border border-emerald-200 transition-colors cursor-pointer"
                              title={isEn ? 'Click to insert into your answer' : 'Bấm để chèn từ này vào câu trả lời'}
                            >
                              + {kw}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={userAreaNotes.answer}
                          onChange={(e) => setUserAreaNotes(prev => ({ ...prev, answer: e.target.value }))}
                          placeholder={isEn ? 'Type or click keywords above to complete your Answer...' : 'Gõ hoặc bấm từ khóa bên trên để hoàn thiện Answer...'}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-sans"
                        />
                      </div>

                      {/* Step 2: Reason */}
                      <div className="p-3.5 rounded-xl bg-white border border-blue-200/80 shadow-2xs space-y-2 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">R</span>
                            <span>{currentArea.formula.reason.label}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{currentArea.formula.reason.prompt}</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {currentArea.formula.reason.keywords.map((kw, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setUserAreaNotes(prev => ({
                                ...prev,
                                reason: prev.reason ? `${prev.reason} ${kw}` : kw
                              }))}
                              className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-medium border border-blue-200 transition-colors cursor-pointer"
                              title={isEn ? 'Click to insert into your answer' : 'Bấm để chèn từ này vào câu trả lời'}
                            >
                              + {kw}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={userAreaNotes.reason}
                          onChange={(e) => setUserAreaNotes(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder={isEn ? 'Type or click keywords above to explain your Reason...' : 'Gõ hoặc bấm từ khóa bên trên để giải thích Reason...'}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-sans"
                        />
                      </div>

                      {/* Step 3: Example */}
                      <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-2 hover:border-amber-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">E</span>
                            <span>{currentArea.formula.example.label}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{currentArea.formula.example.prompt}</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {currentArea.formula.example.keywords.map((kw, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setUserAreaNotes(prev => ({
                                ...prev,
                                example: prev.example ? `${prev.example} ${kw}` : kw
                              }))}
                              className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-medium border border-amber-200 transition-colors cursor-pointer"
                              title={isEn ? 'Click to insert into your answer' : 'Bấm để chèn từ này vào câu trả lời'}
                            >
                              + {kw}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={userAreaNotes.example}
                          onChange={(e) => setUserAreaNotes(prev => ({ ...prev, example: e.target.value }))}
                          placeholder={isEn ? 'Type or give a specific Example...' : 'Gõ hoặc kể một ví dụ cụ thể Example...'}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-sans"
                        />
                      </div>

                      {/* Step 4: Alternative */}
                      <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-2 hover:border-purple-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-purple-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] font-black flex items-center justify-center">A</span>
                            <span>{currentArea.formula.alternative.label}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{currentArea.formula.alternative.prompt}</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {currentArea.formula.alternative.keywords.map((kw, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setUserAreaNotes(prev => ({
                                ...prev,
                                alternative: prev.alternative ? `${prev.alternative} ${kw}` : kw
                              }))}
                              className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-medium border border-purple-200 transition-colors cursor-pointer"
                              title={isEn ? 'Click to insert into your answer' : 'Bấm để chèn từ này vào câu trả lời'}
                            >
                              + {kw}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={userAreaNotes.alternative}
                          onChange={(e) => setUserAreaNotes(prev => ({ ...prev, alternative: e.target.value }))}
                          placeholder={isEn ? 'Provide a contrasting point or Alternative...' : 'Nêu trường hợp đối chiếu hoặc ngoại lệ Alternative...'}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
                    <div className="flex items-center space-x-2">
                      {/* Voice Dictation Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleVoiceDictation(
                          (txt) => setUserAreaNotes(prev => ({
                            ...prev,
                            answer: prev.answer ? `${prev.answer} ${txt}` : txt
                          })),
                          setIsRecordingArea,
                          isRecordingArea
                        )}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                          isRecordingArea
                            ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400 animate-pulse'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                        title={isEn ? 'Click to speak directly; speech will be transcribed into Answer' : 'Bấm để nói trực tiếp, hệ thống sẽ tự động chép lời của bạn vào Answer'}
                      >
                        <Mic className="w-3.5 h-3.5 text-rose-500" />
                        <span>{isRecordingArea ? (isEn ? 'Recording (Speak now...)' : 'Đang Thu Âm (Nói đi...)') : (isEn ? 'Voice Dictation' : 'Nói Qua Mic (Voice)')}</span>
                      </button>

                      {/* Reset Button */}
                      <button
                        type="button"
                        onClick={() => setUserAreaNotes({ answer: '', reason: '', example: '', alternative: '' })}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center space-x-1 transition-colors cursor-pointer"
                        title={isEn ? 'Clear all notes to start over' : 'Xóa trắng các ô ghi chú để làm lại từ đầu'}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Clear' : 'Xóa làm lại'}</span>
                      </button>

                      {/* Fill Sample Button */}
                      <button
                        type="button"
                        onClick={() => setUserAreaNotes({
                          answer: currentArea.formula.answer.sample,
                          reason: currentArea.formula.reason.sample,
                          example: currentArea.formula.example.sample,
                          alternative: currentArea.formula.alternative.sample
                        })}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 flex items-center space-x-1 transition-colors cursor-pointer"
                        title={isEn ? 'Load model suggestions for reference' : 'Nạp nhanh các câu mẫu gợi ý để tham khảo văn phong'}
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isEn ? 'Load Samples' : 'Nạp gợi ý chuẩn'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* AI Evaluation Button */}
                      <button
                        type="button"
                        onClick={handleEvaluateCurrentSpeaking}
                        disabled={isEvaluatingSpeaking}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                        title={isEn ? 'Ask AI to evaluate A.R.E.A reflex and estimate Band Score' : 'Nhờ AI thẩm định phản xạ A.R.E.A và ước tính Band Score'}
                      >
                        {isEvaluatingSpeaking ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{isEn ? 'AI Evaluating...' : 'AI Đang Phân Tích...'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isEn ? 'AI A.R.E.A Assessment' : 'AI Đánh Giá A.R.E.A'}</span>
                          </>
                        )}
                      </button>

                      {/* Model Answer Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowAreaModel(prev => !prev)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs border ${
                          showAreaModel 
                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{showAreaModel ? (isEn ? 'Hide Band 8.5 Model' : 'Ẩn Bài Mẫu Band 8.5') : (isEn ? 'View Band 8.5 Model' : 'Xem Mẫu Band 8.5')}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Evaluation Result Card */}
                  {speakingEvaluation && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-300 shadow-sm space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-bold text-slate-900 text-sm">{isEn ? 'AI Speaking Evaluation Results:' : 'Kết Quả Phân Tích Speaking Từ AI:'}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
                          {speakingEvaluation.bandEstimate || 'Band 7.5 - 8.0'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                          <span className="font-bold text-emerald-800 block mb-1">🌊 Fluency & Coherence:</span>
                          <p className="text-slate-600">{speakingEvaluation.fluencyFeedback || (isEn ? 'Fluent reflex, excellent use of A.R.E.A framework.' : 'Phản xạ trôi chảy, sử dụng tốt khung A.R.E.A.')}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                          <span className="font-bold text-emerald-800 block mb-1">💎 Lexical Resource:</span>
                          <p className="text-slate-600">{speakingEvaluation.lexicalFeedback || (isEn ? 'Natural and accurate collocation usage.' : 'Sử dụng collocations tự nhiên và chính xác.')}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                          <span className="font-bold text-emerald-800 block mb-1">⚖️ Grammatical Range:</span>
                          <p className="text-slate-600">{speakingEvaluation.grammarFeedback || (isEn ? 'Varied sentence structures with conditional clauses.' : 'Cấu trúc câu đa dạng, kết hợp mệnh đề điều kiện.')}</p>
                        </div>
                      </div>

                      {speakingEvaluation.upgradedResponse && (
                        <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1">
                          <span className="font-bold text-emerald-900 block">{isEn ? '⭐ Upgraded Band 8.5+ Response:' : '⭐ Bản Trả Lời Nâng Cấp Band 8.5+:'}</span>
                          <p className="font-serif italic text-slate-800 leading-relaxed">
                            "{speakingEvaluation.upgradedResponse}"
                          </p>
                        </div>
                      )}

                      {speakingEvaluation.recommendations && (
                        <p className="text-xs text-emerald-900 bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-200">
                          💡 <strong>{isEn ? 'Exam advice:' : 'Lời khuyên phòng thi:'}</strong> {speakingEvaluation.recommendations}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Model Answer Band 8.5 Card */}
                  {showAreaModel && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-amber-600" />
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {isEn ? 'Band 8.5 Cambridge Model Response' : 'Bài Mẫu Chuẩn Band 8.5 (Cambridge Model Response)'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlaySpeakingAudio(currentArea.modelAnswerBand8, `area-model-${currentArea.id}`, 'en-GB')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                            playingAudioId === `area-model-${currentArea.id}`
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                          title={isEn ? 'Listen to authentic Band 8.5 model response' : 'Nghe phát âm chuẩn toàn bộ bài mẫu Band 8.5'}
                        >
                          {playingAudioId === `area-model-${currentArea.id}` ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                              <span>{isEn ? 'Stop' : 'Dừng'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Listen to Model' : 'Nghe Bài Mẫu'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-2xs">
                        <p className="text-sm font-serif leading-relaxed text-slate-800">
                          {currentArea.modelAnswerBand8}
                        </p>
                      </div>

                      {currentArea.lexicalHighlights && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-amber-900 block">
                            {isEn ? '🔑 High-Scoring Vocabulary & Collocations:' : '🔑 Từ vựng & Collocations ăn điểm cao:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentArea.lexicalHighlights.map((w, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 shadow-2xs"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. TỪ ĐỆM & MUA THỜI GIAN TỰ NHIÊN (SPEAKING FILLERS) */}
              {activeTab === 'speaking-fillers' && currentFiller && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold uppercase">
                      {currentFiller.category || (isEn ? 'Natural Fillers' : 'Từ Đệm Tự Nhiên')} • {isEn ? 'Buying Time Reflex' : 'Phản xạ câu giờ tự nhiên'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {currentFiller.title}
                    </h3>
                  </div>

                  {/* Question & Situation Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{isEn ? 'Exam Situation:' : 'Tình huống phòng thi:'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlaySpeakingAudio(currentFiller.question, `filler-q-${currentFiller.id}`, 'en-GB')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                          playingAudioId === `filler-q-${currentFiller.id}`
                            ? 'bg-rose-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                        title={isEn ? 'Listen to examiner question' : 'Nghe câu hỏi giám khảo'}
                      >
                        {playingAudioId === `filler-q-${currentFiller.id}` ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                            <span>{isEn ? 'Stop' : 'Dừng'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Listen to Question' : 'Nghe Câu Hỏi'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                      💡 <strong>{isEn ? 'Context:' : 'Ngữ cảnh:'}</strong> {currentFiller.situation}
                    </div>

                    <div className="text-base sm:text-lg font-bold text-white font-serif">
                      "{currentFiller.question}"
                    </div>
                  </div>

                  {/* Task Prompt */}
                  <div className="text-xs font-bold text-slate-700 px-1">
                    {currentFiller.taskPrompt || (isEn ? 'Choose the most natural filler phrase to buy thinking time:' : 'Chọn cụm từ đệm tự nhiên nhất để mở đầu câu trả lời:')}
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2.5">
                    {currentFiller.options.map((opt, idx) => {
                      const isSelected = userFillerChoice === idx;
                      let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';

                      if (showFillerResult) {
                        if (opt.isCorrect) {
                          cardStyle = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30';
                        } else if (isSelected && !opt.isCorrect) {
                          cardStyle = 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/30';
                        }
                      } else if (isSelected) {
                        cardStyle = 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20';
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (!showFillerResult) {
                              setUserFillerChoice(idx);
                              setShowFillerResult(true);
                            }
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${cardStyle}`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <div className="flex-1 space-y-1">
                              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                "{opt.text}"
                              </p>
                              {showFillerResult && (
                                <p className={`text-xs mt-1.5 leading-relaxed pt-1.5 border-t ${
                                  opt.isCorrect ? 'border-emerald-200 text-emerald-800 font-medium' : 'border-rose-200 text-rose-700'
                                }`}>
                                  {opt.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Result & Sample Continuation Card */}
                  {showFillerResult && (
                    <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between font-bold">
                          {currentFiller.options[userFillerChoice]?.isCorrect ? (
                            <span className="text-emerald-700 flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 inline" />
                              <span>{isEn ? 'EXCELLENT! Highly natural, native-like filler phrase.' : 'XUẤT SẮC! Cụm từ đệm tự nhiên chuẩn người bản xứ.'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center space-x-1.5">
                              <XCircle className="w-4 h-4 inline" />
                              <span>{isEn ? 'NOT NATURAL! Check the correct green option above.' : 'CHƯA TỰ NHIÊN! Xem phân tích đáp án chuẩn màu xanh phía trên.'}</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setUserFillerChoice(null);
                              setShowFillerResult(false);
                            }}
                            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Retry this question' : 'Làm lại câu này'}</span>
                          </button>
                        </div>

                        {currentFiller.sampleContinuation && (
                          <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 block">
                                {isEn ? '🎙️ Full Model Utterance with Natural Filler:' : '🎙️ Câu Nói Mẫu Hoàn Chỉnh Khi Áp Dụng Từ Đệm:'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handlePlaySpeakingAudio(currentFiller.sampleContinuation, `filler-sample-${currentFiller.id}`, 'en-GB')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Listen to Model' : 'Nghe Câu Mẫu'}</span>
                              </button>
                            </div>
                            <p className="font-serif italic text-slate-800 text-xs sm:text-sm leading-relaxed">
                              "{currentFiller.sampleContinuation}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. COLLOCATIONS & IDIOMS GIAO TIẾP TỰ NHIÊN */}
              {activeTab === 'speaking-collocations' && currentSpeakingColloc && (
                <div className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold uppercase">
                      {currentSpeakingColloc.category || 'Lexical Resource'} • {isEn ? 'Idiom & Collocation Reflex' : 'Phản xạ thành ngữ & Collocation'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {currentSpeakingColloc.title}
                    </h3>
                  </div>

                  {/* Context & Question Prompt Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950 text-white shadow-md border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-300 uppercase tracking-wider">
                      <span className="flex items-center space-x-1.5">
                        <Flame className="w-4 h-4 text-rose-400" />
                        <span>{isEn ? 'Communicative Context:' : 'Ngữ Cảnh Giao Tiếp:'}</span>
                      </span>
                    </div>

                    {currentSpeakingColloc.context && (
                      <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                        {currentSpeakingColloc.context}
                      </div>
                    )}

                    <div className="text-sm sm:text-base font-semibold text-rose-200">
                      {currentSpeakingColloc.prompt}
                    </div>

                    <div className="text-base sm:text-lg font-bold text-white font-serif p-3 rounded-xl bg-white/10 border border-white/20">
                      "{currentSpeakingColloc.questionSentence}"
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentSpeakingColloc.options.map((opt, idx) => {
                      const isSelected = userSpeakingCollocChoice === idx;
                      let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';

                      if (showSpeakingCollocResult) {
                        if (opt.isCorrect) {
                          cardStyle = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30';
                        } else if (isSelected && !opt.isCorrect) {
                          cardStyle = 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/30';
                        }
                      } else if (isSelected) {
                        cardStyle = 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20';
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (!showSpeakingCollocResult) {
                              setUserSpeakingCollocChoice(idx);
                              setShowSpeakingCollocResult(true);
                            }
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${cardStyle}`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <div className="flex-1 space-y-1">
                              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                {opt.text}
                              </p>
                              {showSpeakingCollocResult && (
                                <p className={`text-xs mt-1.5 leading-relaxed pt-1.5 border-t ${
                                  opt.isCorrect ? 'border-emerald-200 text-emerald-800 font-medium' : 'border-rose-200 text-rose-700'
                                }`}>
                                  {opt.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Result & Idiom Meaning */}
                  {showSpeakingCollocResult && (
                    <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between font-bold">
                          {currentSpeakingColloc.options[userSpeakingCollocChoice]?.isCorrect ? (
                            <span className="text-emerald-700 flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 inline" />
                              <span>{isEn ? 'CORRECT! You mastered this natural idiom.' : 'CHÍNH XÁC! Bạn đã nắm vững thành ngữ tự nhiên này.'}</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center space-x-1.5">
                              <XCircle className="w-4 h-4 inline" />
                              <span>{isEn ? 'NEEDS REVIEW! Check the explanation and exact definition below.' : 'CẦN ÔN LẠI! Xem giải thích và nghĩa cụ thể bên dưới.'}</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setUserSpeakingCollocChoice(null);
                              setShowSpeakingCollocResult(false);
                            }}
                            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Retry' : 'Làm lại'}</span>
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                          <div className="font-bold text-slate-800">
                            📖 <strong>{isEn ? 'Academic Meaning:' : 'Ý nghĩa học thuật:'}</strong> <span className="text-rose-700">{currentSpeakingColloc.idiom}</span> = {currentSpeakingColloc.meaning}
                          </div>
                          
                          {currentSpeakingColloc.speakingExample && (
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 block">{isEn ? 'Speaking Band 8.0+ Example:' : 'Ví dụ Speaking Band 8.0+:'}</span>
                                <p className="font-serif italic text-slate-800">
                                  "{currentSpeakingColloc.speakingExample}"
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handlePlaySpeakingAudio(currentSpeakingColloc.speakingExample, `colloc-sample-${currentSpeakingColloc.id}`, 'en-GB')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer shrink-0 ml-3"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Listen' : 'Nghe'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. PHẢN BIỆN ĐA CHIỀU PART 3 (TWO-SIDED ANALYTICAL REFLEX) */}
              {activeTab === 'speaking-part3-counter' && currentPart3 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-xs font-bold">
                          {isEn ? 'Part 3 Analytical Debate' : 'Tranh Biện Đa Chiều Part 3'} • {currentPart3.difficulty || 'Band 7.5 - 8.5'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                          {currentPart3.topic}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5">{currentPart3.title}</h3>
                    </div>
                  </div>

                  {/* Part 3 Question Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-md border border-teal-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
                        <Target className="w-4 h-4 text-teal-400" />
                        <span>{isEn ? 'Part 3 Analytical Prompt:' : 'Đề Bài Tranh Biện Part 3:'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlaySpeakingAudio(currentPart3.question, `part3-q-${currentPart3.id}`, 'en-GB')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                          playingAudioId === `part3-q-${currentPart3.id}`
                            ? 'bg-rose-600 text-white'
                            : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                        title={isEn ? 'Listen to Part 3 prompt' : 'Nghe giám khảo hỏi Part 3'}
                      >
                        {playingAudioId === `part3-q-${currentPart3.id}` ? (
                          <>
                            <VolumeX className="w-4 h-4 animate-pulse" />
                            <span>{isEn ? 'Stop' : 'Dừng'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>{isEn ? 'Listen to Examiner' : 'Nghe Giám Khảo'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-white font-serif leading-snug">
                      "{currentPart3.question}"
                    </div>

                    {currentPart3.tip && (
                      <div className="text-xs text-teal-200/90 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span><strong>{isEn ? 'Analytical tip:' : 'Mẹo phản biện:'}</strong> {currentPart3.tip}</span>
                      </div>
                    )}
                  </div>

                  {/* 3 Two-Sided Analytical Cards */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700 px-1 flex items-center space-x-1.5">
                      <Split className="w-4 h-4 text-teal-600" />
                      <span>{isEn ? 'Two-Sided Argumentation Structure:' : 'Cấu Trúc Lập Luận Hai Chiều (Two-Sided Argumentation Structure):'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Side A Card */}
                      <div className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-800">
                          <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
                          <span>{isEn ? 'Perspective 1 (Side A)' : 'Góc Nhìn 1 (Side A)'}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-rose-700">{currentPart3.sideA.perspective}</p>
                        <p className="text-xs text-slate-600 bg-rose-50/50 p-2 rounded-lg border border-rose-100 font-sans">
                          <em>"{currentPart3.sideA.starter}"</em> {currentPart3.sideA.points}
                        </p>
                      </div>

                      {/* Side B Card */}
                      <div className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-800">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
                          <span>{isEn ? 'Perspective 2 (Side B)' : 'Góc Nhìn 2 (Side B)'}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-blue-700">{currentPart3.sideB.perspective}</p>
                        <p className="text-xs text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100 font-sans">
                          <em>"{currentPart3.sideB.starter}"</em> {currentPart3.sideB.points}
                        </p>
                      </div>

                      {/* Synthesis Card */}
                      <div className="p-3.5 rounded-xl bg-white border border-teal-200 shadow-2xs space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-800">
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
                          <span>{isEn ? 'Synthesis / Multi-Angle' : 'Tổng Hợp / Đa Chiều'}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-teal-700">{isEn ? 'Balanced Synthesis' : 'Điểm cân bằng (Synthesis)'}</p>
                        <p className="text-xs text-slate-600 bg-teal-50/50 p-2 rounded-lg border border-teal-100 font-sans">
                          <em>"{currentPart3.synthesis.starter}"</em> {currentPart3.synthesis.conclusion}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Practice Studio: Mic Dictation / Typing Response */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <Mic className="w-4 h-4 text-teal-600" />
                        <span>{isEn ? 'Practice Speaking or Typing Your Answer:' : 'Thực Hành Nói Hoặc Gõ Câu Trả Lời Của Bạn:'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVoiceDictation(
                          (txt) => setUserPart3SpokenText(prev => prev ? `${prev} ${txt}` : txt),
                          setIsRecordingPart3,
                          isRecordingPart3
                        )}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                          isRecordingPart3
                            ? 'bg-rose-600 text-white ring-2 ring-rose-400 animate-pulse'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-rose-500" />
                        <span>{isRecordingPart3 ? (isEn ? 'Recording...' : 'Đang Thu Âm...') : (isEn ? 'Voice Dictation' : 'Nói Qua Mic')}</span>
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={userPart3SpokenText}
                      onChange={(e) => setUserPart3SpokenText(e.target.value)}
                      placeholder={isEn ? 'Type or record your analytical answer synthesizing both perspectives...' : 'Gõ hoặc thu âm câu trả lời phản biện của bạn kết hợp cả 2 góc nhìn...'}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none font-sans"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setUserPart3SpokenText('')}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Clear' : 'Xóa chữ'}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        {/* AI Evaluation Button */}
                        <button
                          type="button"
                          onClick={handleEvaluateCurrentSpeaking}
                          disabled={isEvaluatingSpeaking}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                        >
                          {isEvaluatingSpeaking ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isEn ? 'AI Assessing...' : 'AI Đang Đánh Giá...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isEn ? 'AI Argument Analysis' : 'AI Thẩm Định Lập Luận'}</span>
                            </>
                          )}
                        </button>

                        {/* Model Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setShowPart3Model(prev => !prev)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs border ${
                            showPart3Model 
                              ? 'bg-amber-100 text-amber-900 border-amber-300' 
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>{showPart3Model ? (isEn ? 'Hide Band 8.5 Model' : 'Ẩn Mẫu Band 8.5') : (isEn ? 'View Band 8.5 Model' : 'Xem Mẫu Band 8.5')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Evaluation Card */}
                  {speakingEvaluation && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50 via-indigo-50 to-white border border-teal-300 shadow-sm space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-teal-200 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-teal-600" />
                          <h4 className="font-bold text-slate-900 text-sm">{isEn ? 'AI Part 3 Argument Diagnostics:' : 'AI Chẩn Đoán Lập Luận Part 3:'}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-black shadow-xs">
                          {speakingEvaluation.bandEstimate || 'Band 7.5 - 8.0'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-teal-100 shadow-2xs">
                          <span className="font-bold text-teal-800 block mb-1">{isEn ? '⚖️ Two-Sided Critical Thinking:' : '⚖️ Tư duy phản biện 2 chiều:'}</span>
                          <p className="text-slate-600">{speakingEvaluation.fluencyFeedback || (isEn ? 'Balanced and logical argumentation.' : 'Lập luận cân bằng và logic.')}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-teal-100 shadow-2xs">
                          <span className="font-bold text-teal-800 block mb-1">{isEn ? '💎 Academic Lexical Resource:' : '💎 Vốn từ học thuật:'}</span>
                          <p className="text-slate-600">{speakingEvaluation.lexicalFeedback || (isEn ? 'Strong analytical vocabulary usage.' : 'Sử dụng từ vựng phân tích tốt.')}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-teal-100 shadow-2xs">
                          <span className="font-bold text-teal-800 block mb-1">{isEn ? '🧩 Grammatical Accuracy:' : '🧩 Độ chính xác ngữ pháp:'}</span>
                          <p className="text-slate-600">{speakingEvaluation.grammarFeedback || (isEn ? 'Complex structures maintained accurately.' : 'Các cấu trúc phức được duy trì chuẩn xác.')}</p>
                        </div>
                      </div>

                      {speakingEvaluation.upgradedResponse && (
                        <div className="p-3 rounded-xl bg-white border border-teal-200 text-xs space-y-1">
                          <span className="font-bold text-teal-900 block">{isEn ? '⭐ Upgraded Band 8.5+ Response:' : '⭐ Bản Trả Lời Nâng Cấp Band 8.5+:'}</span>
                          <p className="font-serif italic text-slate-800 leading-relaxed">
                            "{speakingEvaluation.upgradedResponse}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Model Answer Band 8.5 Card */}
                  {showPart3Model && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-amber-600" />
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {isEn ? 'Band 8.5 Part 3 Analytical Model Response' : 'Bài Mẫu Tranh Luận Part 3 Band 8.5'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlaySpeakingAudio(currentPart3.modelAnswerBand8, `part3-model-${currentPart3.id}`, 'en-GB')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
                            playingAudioId === `part3-model-${currentPart3.id}`
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          {playingAudioId === `part3-model-${currentPart3.id}` ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                              <span>{isEn ? 'Stop' : 'Dừng'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Listen to Model' : 'Nghe Bài Mẫu'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-2xs">
                        <p className="text-sm font-serif leading-relaxed text-slate-800">
                          {currentPart3.modelAnswerBand8}
                        </p>
                      </div>

                      {currentPart3.highBandVocab && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-amber-900 block">
                            {isEn ? '🔑 Academic Vocabulary & Transition Signposts:' : '🔑 Từ vựng học thuật & cụm từ chuyển mạch:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentPart3.highBandVocab.map((w, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 shadow-2xs"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
    </div>
  );
}
