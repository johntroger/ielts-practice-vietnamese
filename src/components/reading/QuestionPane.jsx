import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Info, 
  Flag,
  Bookmark,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { explainReadingQuestion } from '../../services/geminiService';

export default function QuestionPane({
  passageTitle = '',
  passageParagraphs = [],
  questionGroups = [],
  userAnswers = {},
  flaggedQuestions = {},
  onToggleFlag,
  onAnswerChange,
  isSubmitted = false,
  showExplanationFor = null,
  onToggleExplanation,
  onLocateEvidence,
  fontSize = 'base',
  apiKey,
  model,
  onOpenSettings,
  onSaveToVocabNotebook
}) {
  const [aiExplanations, setAiExplanations] = useState({}); // { [order]: data }
  const [loadingAiFor, setLoadingAiFor] = useState(null); // order
  const [aiErrorFor, setAiErrorFor] = useState({}); // { [order]: string }
  const [savedVocabIds, setSavedVocabIds] = useState({}); // { [word]: boolean }

  const handleRequestAiExplanation = async (q) => {
    if (!apiKey) {
      if (onOpenSettings) onOpenSettings();
      return;
    }

    setLoadingAiFor(q.order);
    setAiErrorFor(prev => ({ ...prev, [q.order]: null }));

    try {
      // Find paragraph text
      const paraObj = passageParagraphs.find(p => p.id === q.evidenceParagraph);
      const paragraphText = paraObj ? paraObj.text : '';

      const explanation = await explainReadingQuestion({
        passageTitle,
        paragraphText,
        question: q,
        userAnswer: userAnswers[q.order],
        apiKey,
        model
      });

      setAiExplanations(prev => ({
        ...prev,
        [q.order]: explanation
      }));
    } catch (err) {
      console.error('Lỗi khi tải giải thích AI:', err);
      setAiErrorFor(prev => ({
        ...prev,
        [q.order]: err.message || 'Không thể tạo giải thích AI vào lúc này.'
      }));
    } finally {
      setLoadingAiFor(null);
    }
  };

  const handleSaveWord = (vocab) => {
    if (!onSaveToVocabNotebook) return;
    onSaveToVocabNotebook({
      id: `vocab-${Date.now()}-${Math.random()}`,
      phrase: vocab.word,
      meaningVi: `${vocab.meaningVi} ${vocab.collocation ? `(Cụm: ${vocab.collocation})` : ''}`,
      example: vocab.collocation || `Từ vựng trong bài đọc ${passageTitle}`,
      topic: 'general',
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    setSavedVocabIds(prev => ({ ...prev, [vocab.word]: true }));
  };
  const renderFlagButton = (order) => {
    if (isSubmitted) return null;
    const isFlagged = !!flaggedQuestions[order];
    return (
      <button
        onClick={() => onToggleFlag && onToggleFlag(order)}
        title={isFlagged ? "Bỏ cắm cờ xem lại" : "Cắm cờ để xem lại sau (Review flag)"}
        className={`p-1 rounded-md transition-colors ${
          isFlagged 
            ? 'text-amber-500 bg-amber-50 border border-amber-300 shadow-2xs' 
            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400' : ''}`} />
      </button>
    );
  };
  const renderTFNGGroup = (group) => {
    const isYesNo = group.type === 'yes_no_not_given';
    const options = isYesNo ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'];

    return (
      <div className="space-y-4">
        {group.questions.map(q => {
          const currentAns = userAnswers[q.order] || '';
          const isCorrect = isSubmitted && currentAns.trim().toUpperCase() === q.answer.trim().toUpperCase();
          const isWrong = isSubmitted && currentAns && !isCorrect;

          return (
            <div 
              key={q.order}
              id={`question-card-${q.order}`}
              className={`p-4 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {q.order}
                  </span>
                  {renderFlagButton(q.order)}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Segmented Button Choice */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {options.map(opt => {
                      const isSelected = currentAns.toUpperCase() === opt;
                      return (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => onAnswerChange(q.order, opt)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-200'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {renderExplanationCard(q)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMultipleChoiceGroup = (group) => {
    return (
      <div className="space-y-4">
        {group.questions.map(q => {
          const currentAns = userAnswers[q.order] || '';
          const isCorrect = isSubmitted && currentAns.trim().toUpperCase() === q.answer.trim().toUpperCase();

          return (
            <div 
              key={q.order}
              id={`question-card-${q.order}`}
              className={`p-4 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {q.order}
                  </span>
                  {renderFlagButton(q.order)}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="space-y-2 pt-1">
                    {q.options?.map(opt => {
                      const isSelected = currentAns.toUpperCase() === opt.letter.toUpperCase();
                      const isKey = isSubmitted && q.answer.toUpperCase() === opt.letter.toUpperCase();

                      return (
                        <button
                          key={opt.letter}
                          disabled={isSubmitted}
                          onClick={() => onAnswerChange(q.order, opt.letter)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 border ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 border-blue-400 ring-2 ring-blue-100 font-semibold'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          } ${isKey ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-950 font-bold' : ''}`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {opt.letter}
                          </span>
                          <span className="leading-snug pt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {renderExplanationCard(q)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMultiSelectGroup = (group) => {
    return (
      <div className="space-y-4">
        {group.questions.map(q => {
          const currentAns = userAnswers[q.order] || [];
          const selectedArray = Array.isArray(currentAns) ? currentAns : (currentAns ? currentAns.split(',') : []);

          const toggleOption = (letter) => {
            if (isSubmitted) return;
            const limit = q.maxSelect || 2;
            let updated;
            if (selectedArray.includes(letter)) {
              updated = selectedArray.filter(l => l !== letter);
            } else {
              if (selectedArray.length >= limit) {
                updated = [...selectedArray.slice(1), letter];
              } else {
                updated = [...selectedArray, letter];
              }
            }
            onAnswerChange(q.order, updated);
          };

          return (
            <div 
              key={q.order}
              id={`question-card-${q.order}`}
              className="p-4 rounded-xl border bg-white border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {q.order}
                </span>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>
                  <div className="text-xs text-blue-600 font-medium">
                    (Chọn {q.maxSelect || 2} phương án. Đã chọn: {selectedArray.join(', ') || 'Chưa chọn'})
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options?.map(opt => {
                      const isSelected = selectedArray.includes(opt.letter);
                      return (
                        <button
                          key={opt.letter}
                          disabled={isSubmitted}
                          onClick={() => toggleOption(opt.letter)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 border ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-900 border-indigo-400 ring-2 ring-indigo-100 font-semibold'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {opt.letter}
                          </span>
                          <span className="leading-snug pt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {renderExplanationCard(q)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCompletionGroup = (group) => {
    return (
      <div className="space-y-4">
        {/* Summary Passage / Context Box if available */}
        {group.summaryText && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed font-serif">
            <span className="text-xs font-bold font-sans text-blue-700 block mb-2 uppercase tracking-wide">
              Đoạn tóm tắt (Summary Context):
            </span>
            <p className="whitespace-pre-line">
              {group.summaryText}
            </p>
          </div>
        )}

        {/* Word Bank if available */}
        {group.wordBank && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Hộp Từ Vựng Tham Khảo:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {group.wordBank.map(item => (
                <div key={item.key} className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                  <span className="font-bold text-blue-700">{item.key}.</span>
                  <span className="text-slate-800 truncate" title={item.text}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {group.questions.map(q => {
          const currentAns = userAnswers[q.order] || '';
          const isCorrect = isSubmitted && (
            q.answer.toLowerCase() === currentAns.trim().toLowerCase() ||
            (q.acceptableAnswers && q.acceptableAnswers.some(a => a.toLowerCase() === currentAns.trim().toLowerCase()))
          );

          return (
            <div 
              key={q.order}
              id={`question-card-${q.order}`}
              className={`p-4 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {q.order}
                  </span>
                  {renderFlagButton(q.order)}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="pt-1">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={currentAns}
                      onChange={(e) => onAnswerChange(q.order, e.target.value)}
                      placeholder={group.wordBank ? "Nhập chữ cái đại diện (ví dụ: A, B...)" : "Nhập câu trả lời..."}
                      className={`w-full sm:max-w-md px-3.5 py-2 rounded-xl text-sm border focus:outline-hidden focus:ring-2 transition-all ${
                        isSubmitted
                          ? isCorrect 
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400' 
                            : 'bg-rose-100 text-rose-950 border-rose-400'
                          : 'bg-slate-50 focus:bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                  </div>

                  {renderExplanationCard(q)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatchingGroup = (group) => {
    return (
      <div className="space-y-4">
        {/* Headings or Features Reference Box */}
        {(group.headings || group.features) && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              {group.headings ? 'Danh Sách Tiêu Đề (List of Headings):' : 'Danh Sách Đối Tượng (List of Features):'}
            </span>
            <div className="space-y-1 text-xs">
              {(group.headings || group.features).map(item => (
                <div key={item.id || item.letter} className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs">
                  <span className="font-bold text-blue-700 shrink-0">{item.id || item.letter}.</span>
                  <span className="text-slate-800 leading-tight">{item.text || item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {group.questions.map(q => {
          const currentAns = userAnswers[q.order] || '';
          const isCorrect = isSubmitted && currentAns.trim().toUpperCase() === q.answer.trim().toUpperCase();

          const optionsList = group.headings 
            ? group.headings.map(h => h.id) 
            : group.features 
              ? group.features.map(f => f.letter) 
              : [];

          return (
            <div 
              key={q.order}
              id={`question-card-${q.order}`}
              className={`p-4 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {q.order}
                  </span>
                  {renderFlagButton(q.order)}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {q.questionText}
                    </p>
                  </div>

                  {/* Dropdown / Segmented selector */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {optionsList.map(opt => {
                      const isSelected = currentAns.toUpperCase() === opt.toUpperCase();
                      return (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => onAnswerChange(q.order, opt)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {renderExplanationCard(q)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExplanationCard = (q) => {
    if (!isSubmitted) return null;

    const isExpanded = showExplanationFor === q.order;

    return (
      <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Đáp án đúng:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black">
              {q.answer}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {q.evidenceParagraph && (
              <button
                onClick={() => onLocateEvidence && onLocateEvidence(q.evidenceParagraph)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md border border-blue-200 transition-colors"
                title="Cuộn tới đoạn văn chứa đáp án"
              >
                <Eye className="w-3 h-3" />
                <span>Xem đoạn {q.evidenceParagraph}</span>
              </button>
            )}

            <button
              onClick={() => onToggleExplanation && onToggleExplanation(q.order)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-slate-500" />
              <span>{isExpanded ? 'Thu gọn giải thích' : 'Giải thích chi tiết'}</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3 animate-fadeIn">
            {q.evidenceQuote && (
              <div className="space-y-1">
                <span className="font-bold text-amber-900 block text-[11px]">Trích dẫn bằng chứng trong bài:</span>
                <p className="italic text-amber-950 font-serif bg-white/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed text-xs">
                  "{q.evidenceQuote}"
                </p>
              </div>
            )}
            <div className="space-y-1">
              <span className="font-bold text-amber-900 block text-[11px]">Phân tích Paraphrasing & Lời giải Cambridge:</span>
              <p className="text-slate-700 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-amber-100 text-xs">
                {q.explanation}
              </p>
            </div>

            {/* AI On-Demand Explanation Section */}
            <div className="pt-2 border-t border-amber-200/80">
              {!aiExplanations[q.order] ? (
                <button
                  disabled={loadingAiFor === q.order}
                  onClick={() => handleRequestAiExplanation(q)}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-70"
                >
                  {loadingAiFor === q.order ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini đang mổ xẻ bẫy & lập bản đồ Paraphrase...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Mổ xẻ bẫy & Từ vựng chuyên sâu bằng Gemini AI</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phân Tích Chuyên Sâu Của Giám Khảo AI:</span>
                    </span>
                    <button
                      onClick={() => handleRequestAiExplanation(q)}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Phân tích lại</span>
                    </button>
                  </div>

                  {/* 1. Mổ xẻ bẫy đề thi (Trap Analysis) */}
                  {aiExplanations[q.order].trapAnalysis && (
                    <div className="bg-rose-50/80 border border-rose-200 p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-rose-900 block text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Mổ xẻ bẫy đề thi (Trap Analysis):</span>
                      </span>
                      <p className="text-rose-950 text-xs leading-relaxed">
                        {aiExplanations[q.order].trapAnalysis}
                      </p>
                    </div>
                  )}

                  {/* 2. Lập luận từng bước */}
                  {aiExplanations[q.order].stepByStepReasoning && (
                    <div className="bg-white/80 border border-amber-200 p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-slate-800 block text-[11px]">Lập luận từng bước vì sao chọn đáp án này:</span>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {aiExplanations[q.order].stepByStepReasoning}
                      </p>
                    </div>
                  )}

                  {/* 3. Bản đồ Paraphrase Map */}
                  {aiExplanations[q.order].paraphraseMap && aiExplanations[q.order].paraphraseMap.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-amber-900 block text-[11px]">Bản đồ biến đổi từ khóa (Paraphrase Map):</span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {aiExplanations[q.order].paraphraseMap.map((pMap, idx) => (
                          <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between text-xs gap-2">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {pMap.questionKeyword}
                            </span>
                            <ArrowRight className="w-3 h-3 text-blue-500 shrink-0" />
                            <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                              {pMap.passageEquivalent}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Dịch song ngữ câu bằng chứng */}
                  {aiExplanations[q.order].bilingualTranslation && (
                    <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-blue-900 block text-[11px]">Dịch nghĩa tiếng Việt câu bằng chứng:</span>
                      <p className="text-blue-950 text-xs leading-relaxed italic">
                        "{aiExplanations[q.order].bilingualTranslation}"
                      </p>
                    </div>
                  )}

                  {/* 5. Từ vựng C1/C2 & Nút 1-chạm lưu Sổ tay */}
                  {aiExplanations[q.order].keyVocabulary && aiExplanations[q.order].keyVocabulary.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-amber-900 block text-[11px]">Từ vựng học thuật quan trọng:</span>
                      <div className="space-y-1.5">
                        {aiExplanations[q.order].keyVocabulary.map((vItem, vIdx) => {
                          const isSaved = savedVocabIds[vItem.word];
                          return (
                            <div key={vIdx} className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs">
                              <div>
                                <span className="font-bold text-slate-900">{vItem.word}</span>
                                {vItem.ipa && <span className="text-slate-400 font-mono text-[11px] ml-1.5">[{vItem.ipa}]</span>}
                                <p className="text-slate-600 text-[11px] mt-0.5">{vItem.meaningVi}</p>
                              </div>
                              <button
                                onClick={() => handleSaveWord(vItem)}
                                disabled={isSaved}
                                className={`shrink-0 p-1.5 rounded-md border text-[11px] font-bold flex items-center gap-1 transition-all ${
                                  isSaved
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:scale-102'
                                }`}
                                title={isSaved ? "Đã lưu vào sổ tay" : "Lưu từ này vào Sổ tay từ vựng C1/C2"}
                              >
                                {isSaved ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Đã lưu</span>
                                  </>
                                ) : (
                                  <>
                                    <Bookmark className="w-3 h-3 text-amber-600" />
                                    <span>Lưu từ</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {aiErrorFor[q.order] && (
                <div className="mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {aiErrorFor[q.order]}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    );
  };

  const questionFontSizeClasses = {
    sm: 'text-[13px]',
    base: 'text-[14px]',
    lg: 'text-[16px]'
  };

  return (
    <div className={`h-full flex flex-col bg-slate-50/50 overflow-y-auto px-4 sm:px-6 py-6 space-y-8 transition-all duration-150 ${questionFontSizeClasses[fontSize] || questionFontSizeClasses.base}`}>
      {questionGroups.map((group, idx) => (
        <div key={group.id || idx} className="space-y-4">
          {/* Group Header Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                Questions {group.questions[0]?.order} - {group.questions[group.questions.length - 1]?.order}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {group.questions.length} câu hỏi
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 whitespace-pre-line leading-snug">
              {group.instruction || group.instructions}
            </h4>
            {group.extraNotes && (
              <p className="text-xs text-slate-500 italic">
                {group.extraNotes}
              </p>
            )}
          </div>

          {/* Render by Question Group Type */}
          {(group.type === 'true_false_not_given' || group.type === 'yes_no_not_given') && renderTFNGGroup(group)}
          {group.type === 'multiple_choice_single' && renderMultipleChoiceGroup(group)}
          {group.type === 'multiple_choice_multi' && renderMultiSelectGroup(group)}
          {(group.type === 'summary_completion' || group.type === 'sentence_completion') && renderCompletionGroup(group)}
          {(group.type === 'matching_headings' || group.type === 'matching_features') && renderMatchingGroup(group)}
        </div>
      ))}
    </div>
  );
}