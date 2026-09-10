import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Eye,
  Info,
  Flag
} from 'lucide-react';

export default function QuestionPane({
  questionGroups = [],
  userAnswers = {},
  flaggedQuestions = {},
  onToggleFlag,
  onAnswerChange,
  isSubmitted = false,
  showExplanationFor = null,
  onToggleExplanation,
  onLocateEvidence
}) {
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
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 animate-fadeIn">
            {q.evidenceQuote && (
              <div className="space-y-0.5">
                <span className="font-bold text-amber-900 block text-[11px]">Trích dẫn bằng chứng trong bài:</span>
                <p className="italic text-amber-950 font-serif bg-white/80 p-2 rounded-md border border-amber-200/60 leading-relaxed">
                  "{q.evidenceQuote}"
                </p>
              </div>
            )}
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 block text-[11px]">Phân tích Paraphrasing & Lời giải:</span>
              <p className="text-slate-700 leading-relaxed">
                {q.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50 overflow-y-auto px-4 sm:px-6 py-6 space-y-8">
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