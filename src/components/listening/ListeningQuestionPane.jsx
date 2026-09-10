import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Flag,
  Highlighter,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Volume2,
  X,
  MapPin,
  ArrowDown
} from 'lucide-react';

// Color definitions for highlighter
const HIGHLIGHT_COLORS = [
  { id: 'yellow', bg: 'bg-yellow-200/90', border: 'border-yellow-400', label: 'Vàng' },
  { id: 'green', bg: 'bg-emerald-200/90', border: 'border-emerald-400', label: 'Xanh lá' },
  { id: 'pink', bg: 'bg-pink-200/90', border: 'border-pink-400', label: 'Hồng' }
];

// Helper: Parse instruction for word limits
function parseWordLimit(instruction) {
  if (!instruction) return null;
  const upper = instruction.toUpperCase();
  if (upper.includes('ONE WORD ONLY')) return { maxWords: 1, text: 'Tối đa 1 từ duy nhất' };
  if (upper.includes('ONE WORD AND/OR A NUMBER')) return { maxWords: 1, text: 'Tối đa 1 từ và/hoặc 1 số' };
  if (upper.includes('NO MORE THAN TWO WORDS')) return { maxWords: 2, text: 'Tối đa không quá 2 từ' };
  if (upper.includes('NO MORE THAN THREE WORDS')) return { maxWords: 3, text: 'Tối đa không quá 3 từ' };
  if (upper.includes('NO MORE THAN ONE WORD')) return { maxWords: 1, text: 'Tối đa không quá 1 từ' };
  return null;
}

// Helper: Format seconds to MM:SS
function formatTimestamp(sec) {
  if (typeof sec !== 'number') return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ListeningQuestionPane({
  testId = 'cambridge-18-test-1',
  partData = null,
  userAnswers = {},
  onAnswerChange,
  flaggedQuestions = {},
  onToggleFlag,
  activeQuestionOrder = 1,
  onSelectQuestion,
  isSubmitted = false,
  fontSizeMode = 'normal',
  contrastTheme = 'standard',
  onSeekAudio = null
}) {
  const [selectedText, setSelectedText] = useState('');
  const [highlightMenuPos, setHighlightMenuPos] = useState(null);
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem(`ielts_listening_highlights_${testId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeNoteModal, setActiveNoteModal] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const [mapZoom, setMapZoom] = useState(1);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const questionRefs = useRef({});

  useEffect(() => {
    try {
      localStorage.setItem(`ielts_listening_highlights_${testId}`, JSON.stringify(highlights));
    } catch (e) {}
  }, [highlights, testId]);

  useEffect(() => {
    if (activeQuestionOrder && questionRefs.current[activeQuestionOrder]) {
      questionRefs.current[activeQuestionOrder].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeQuestionOrder]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setHighlightMenuPos(null);
      setSelectedText('');
      return;
    }
    const text = selection.toString().trim();
    if (text.length > 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setHighlightMenuPos({
        top: Math.max(10, rect.top + window.scrollY - 45),
        left: Math.max(10, rect.left + window.scrollX + rect.width / 2 - 80)
      });
    } else {
      setHighlightMenuPos(null);
    }
  };

  const addHighlight = (color) => {
    if (!selectedText) return;
    const newHighlight = {
      id: `hl-${Date.now()}`,
      text: selectedText,
      color,
      note: ''
    };
    setHighlights(prev => [...prev.filter(h => h.text !== selectedText), newHighlight]);
    setHighlightMenuPos(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleSaveNote = () => {
    if (!activeNoteModal) return;
    setHighlights(prev =>
      prev.map(h => (h.id === activeNoteModal.id ? { ...h, note: noteInput.trim() } : h))
    );
    setActiveNoteModal(null);
    setNoteInput('');
  };

  const fontSizeClasses = useMemo(() => {
    switch (fontSizeMode) {
      case 'large':
        return {
          body: 'text-base sm:text-lg',
          heading: 'text-lg sm:text-xl',
          input: 'text-base py-2 px-3'
        };
      case 'xlarge':
        return {
          body: 'text-lg sm:text-xl',
          heading: 'text-xl sm:text-2xl',
          input: 'text-lg py-2.5 px-4'
        };
      default:
        return {
          body: 'text-xs sm:text-sm',
          heading: 'text-sm sm:text-base',
          input: 'text-xs sm:text-sm py-1.5 px-3'
        };
    }
  }, [fontSizeMode]);

  const checkAnswerStatus = (q) => {
    const uAns = (userAnswers[q.order] || '').toString().trim().toLowerCase();
    if (!uAns) return { isCorrect: false, isEmpty: true };
    const correctAns = (q.answer || '').toString().trim().toLowerCase();
    const acceptable = (q.acceptableAnswers || []).map(a => a.toString().trim().toLowerCase());
    const isCorrect = uAns === correctAns || acceptable.includes(uAns);
    return { isCorrect, isEmpty: false };
  };

  const getWordLimitAlert = (value, instruction) => {
    const limit = parseWordLimit(instruction);
    if (!limit || !value || typeof value !== 'string') return null;
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length > limit.maxWords) {
      return {
        wordCount: words.length,
        maxWords: limit.maxWords,
        message: `⚠️ Đã gõ ${words.length} từ (Yêu cầu: ${limit.text})`
      };
    }
    return null;
  };

  if (!partData) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Không có dữ liệu câu hỏi cho phần thi này.
      </div>
    );
  }

  const mapGroup = partData.questionGroups?.find(g => g.type === 'map_labelling' && g.mapImageUrl);

  return (
    <div
      onMouseUp={handleMouseUp}
      className={`relative max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 transition-colors ${
        contrastTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Floating Highlight Toolbar */}
      {highlightMenuPos && (
        <div
          style={{ top: `${highlightMenuPos.top}px`, left: `${highlightMenuPos.left}px` }}
          className="fixed z-50 flex items-center space-x-1.5 bg-slate-900 text-white px-2.5 py-1.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-150"
        >
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center">
            <Highlighter className="w-3 h-3 mr-1" /> Tô màu:
          </span>
          {HIGHLIGHT_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => addHighlight(c.id)}
              className={`w-5 h-5 rounded-full ${c.bg} border-2 ${c.border} hover:scale-110 transition-transform`}
              title={`Tô màu ${c.label}`}
            />
          ))}
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={() => setHighlightMenuPos(null)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Part Header Card */}
      <div
        className={`rounded-xl border p-4 sm:p-5 mb-5 shadow-2xs ${
          contrastTheme === 'dark'
            ? 'bg-slate-900 border-slate-800'
            : contrastTheme === 'yellowOnBlack'
            ? 'bg-black border-yellow-500 text-yellow-300'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-black uppercase tracking-wider">
            Part {partData.partNumber} / 4
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Audio: {formatTimestamp(partData.audioTimestampStart)} – {formatTimestamp(partData.audioTimestampEnd)}
          </span>
        </div>
        <h3 className={`font-bold text-slate-900 mb-1 ${fontSizeClasses.heading} ${contrastTheme === 'dark' ? 'text-white' : ''}`}>
          {partData.title}
        </h3>
        <p className={`text-slate-600 mb-3 ${fontSizeClasses.body} ${contrastTheme === 'dark' ? 'text-slate-300' : ''}`}>
          {partData.context}
        </p>

        {/* Speakers */}
        <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Giọng đọc:</span>
          {partData.speakers?.map((s, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                contrastTheme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {s.name} ({s.accent} {s.gender})
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Mini-Map Button on Mobile/Tablet when map exists */}
      {mapGroup && (
        <div className="sticky top-16 z-30 mb-4 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Sơ đồ / Bản đồ cho câu hỏi 15–20</span>
          </div>
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mở Bản Đồ To</span>
          </button>
        </div>
      )}

      {/* QUESTION GROUPS */}
      <div className="space-y-6">
        {partData.questionGroups?.map((group) => {
          const wordLimit = parseWordLimit(group.instruction);

          return (
            <div
              key={group.id}
              className={`rounded-xl border p-4 sm:p-6 shadow-2xs transition-colors ${
                contrastTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800'
                  : contrastTheme === 'yellowOnBlack'
                  ? 'bg-black border-yellow-500 text-yellow-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Group Header & Instructions */}
              <div className="mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-bold text-slate-900 ${fontSizeClasses.heading} ${contrastTheme === 'dark' ? 'text-white' : ''}`}>
                    {group.title}
                  </h4>
                  {wordLimit && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                      {wordLimit.text}
                    </span>
                  )}
                </div>

                <p className={`mt-1.5 whitespace-pre-line font-serif italic text-slate-600 ${fontSizeClasses.body} ${contrastTheme === 'dark' ? 'text-slate-300' : ''}`}>
                  {group.instruction}
                </p>

                {group.headerTitle && (
                  <div className="mt-3 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-black tracking-wider uppercase inline-block border border-red-200">
                    {group.headerTitle}
                  </div>
                )}
              </div>

              {/* TYPE 1: NOTE / FORM / SENTENCE / SUMMARY COMPLETION */}
              {(group.type === 'note_completion' ||
                group.type === 'form_completion' ||
                group.type === 'sentence_completion' ||
                group.type === 'summary_completion') && (
                <div className="space-y-3">
                  {group.questions?.map((q) => {
                    const status = checkAnswerStatus(q);
                    const userVal = userAnswers[q.order] || '';
                    const wordLimitAlert = getWordLimitAlert(userVal, group.instruction);
                    const isFlagged = !!flaggedQuestions[q.order];
                    const isActive = activeQuestionOrder === q.order;

                    return (
                      <div
                        key={q.id}
                        id={`listening-q-${q.order}`}
                        ref={el => (questionRefs.current[q.order] = el)}
                        onClick={() => onSelectQuestion && onSelectQuestion(q.order)}
                        className={`p-3 sm:p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/30'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                              {q.order}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              Điền vào chỗ trống
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {!isSubmitted && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFlag && onToggleFlag(q.order);
                                }}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  isFlagged
                                    ? 'text-amber-500 bg-amber-50 border border-amber-300'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                                title={isFlagged ? 'Bỏ cắm cờ' : 'Cắm cờ xem lại'}
                              >
                                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                              </button>
                            )}

                            {isSubmitted && (
                              <span className="flex items-center space-x-1 text-xs font-bold">
                                {status.isCorrect ? (
                                  <span className="text-emerald-600 flex items-center space-x-1">
                                    <CheckCircle2 className="w-4 h-4" /> <span>Đúng</span>
                                  </span>
                                ) : (
                                  <span className="text-rose-600 flex items-center space-x-1">
                                    <XCircle className="w-4 h-4" /> <span>Sai</span>
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Question Text with inline Blank Input */}
                        <div className={`leading-relaxed ${fontSizeClasses.body} text-slate-800`}>
                          {q.prefixText && <span>{q.prefixText} </span>}

                          <div className="inline-block my-1 mx-1.5 relative">
                            <input
                              type="text"
                              value={userVal}
                              disabled={isSubmitted}
                              tabIndex={100 + q.order}
                              onChange={(e) => onAnswerChange && onAnswerChange(q.order, e.target.value)}
                              onFocus={(e) => {
                                onSelectQuestion && onSelectQuestion(q.order);
                                e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
                              }}
                              placeholder={`[${q.order}]`}
                              className={`px-3 py-1.5 rounded-lg border font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all min-w-[140px] sm:min-w-[180px] ${
                                isSubmitted
                                  ? status.isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                    : 'bg-rose-50 border-rose-400 text-rose-900'
                                  : 'bg-white border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              } ${fontSizeClasses.input}`}
                            />

                            {wordLimitAlert && !isSubmitted && (
                              <div className="absolute left-0 -bottom-7 z-20 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap animate-bounce">
                                {wordLimitAlert.message}
                              </div>
                            )}
                          </div>

                          {q.suffixText && <span> {q.suffixText}</span>}
                        </div>

                        {/* Submission Details: Evidence & Explanation */}
                        {isSubmitted && (
                          <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-1.5 bg-white/80 p-3 rounded-lg">
                            <div className="flex items-baseline space-x-2">
                              <span className="font-bold text-slate-600">Đáp án chuẩn:</span>
                              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {q.answer}
                              </span>
                              {q.acceptableAnswers && q.acceptableAnswers.length > 1 && (
                                <span className="text-[11px] text-slate-500">
                                  (Chấp nhận: {q.acceptableAnswers.join(', ')})
                                </span>
                              )}
                            </div>

                            {q.evidenceQuote && (
                              <div className="text-slate-700">
                                <span className="font-bold text-slate-600">Trích dẫn audio: </span>
                                <span className="italic font-serif">"{q.evidenceQuote}"</span>
                              </div>
                            )}

                            {q.explanation && (
                              <div className="text-slate-600">
                                <span className="font-bold text-slate-600">Giải thích: </span>
                                <span>{q.explanation}</span>
                              </div>
                            )}

                            {q.evidenceTimestamp !== undefined && onSeekAudio && (
                              <button
                                onClick={() => onSeekAudio(q.evidenceTimestamp)}
                                className="mt-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>Nghe lại đoạn này ({formatTimestamp(q.evidenceTimestamp)})</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TYPE 2: MULTIPLE CHOICE (Choose 1 of 3: A, B, C) */}
              {group.type === 'multiple_choice' && (
                <div className="space-y-4">
                  {group.questions?.map((q) => {
                    const status = checkAnswerStatus(q);
                    const userVal = userAnswers[q.order] || '';
                    const isFlagged = !!flaggedQuestions[q.order];
                    const isActive = activeQuestionOrder === q.order;

                    return (
                      <div
                        key={q.id}
                        id={`listening-q-${q.order}`}
                        ref={el => (questionRefs.current[q.order] = el)}
                        onClick={() => onSelectQuestion && onSelectQuestion(q.order)}
                        className={`p-3 sm:p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/30'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-baseline space-x-2">
                            <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                              {q.order}
                            </span>
                            <span className={`font-bold text-slate-900 ${fontSizeClasses.body}`}>
                              {q.questionText}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {!isSubmitted && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFlag && onToggleFlag(q.order);
                                }}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  isFlagged
                                    ? 'text-amber-500 bg-amber-50 border border-amber-300'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                                title={isFlagged ? 'Bỏ cắm cờ' : 'Cắm cờ xem lại'}
                              >
                                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                              </button>
                            )}

                            {isSubmitted && (
                              <span className="flex items-center space-x-1 text-xs font-bold">
                                {status.isCorrect ? (
                                  <span className="text-emerald-600 flex items-center space-x-1">
                                    <CheckCircle2 className="w-4 h-4" /> <span>Đúng</span>
                                  </span>
                                ) : (
                                  <span className="text-rose-600 flex items-center space-x-1">
                                    <XCircle className="w-4 h-4" /> <span>Sai</span>
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2 mt-3 pl-2 sm:pl-9">
                          {q.options?.map((opt) => {
                            const isSelected = userVal === opt.key;
                            const isCorrectOpt = q.answer === opt.key;

                            let optStyle = 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800';
                            if (isSubmitted) {
                              if (isCorrectOpt) {
                                optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400';
                              } else if (isSelected && !status.isCorrect) {
                                optStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                              }
                            } else if (isSelected) {
                              optStyle = 'border-red-600 bg-red-50/80 text-red-950 font-bold ring-2 ring-red-300';
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                disabled={isSubmitted}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectQuestion && onSelectQuestion(q.order);
                                  onAnswerChange && onAnswerChange(q.order, opt.key);
                                }}
                                className={`w-full text-left p-2.5 sm:p-3 rounded-xl border flex items-start space-x-3 transition-all cursor-pointer ${optStyle}`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                    isSelected
                                      ? 'bg-red-600 text-white'
                                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <span className={`flex-1 leading-snug ${fontSizeClasses.body}`}>
                                  {opt.text}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {isSubmitted && (
                          <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-1.5 bg-white/80 p-3 rounded-lg pl-2 sm:pl-9">
                            <div className="flex items-baseline space-x-2">
                              <span className="font-bold text-slate-600">Đáp án chuẩn:</span>
                              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {q.answer}
                              </span>
                            </div>
                            {q.evidenceQuote && (
                              <div className="text-slate-700">
                                <span className="font-bold text-slate-600">Trích dẫn audio: </span>
                                <span className="italic font-serif">"{q.evidenceQuote}"</span>
                              </div>
                            )}
                            {q.explanation && (
                              <div className="text-slate-600">
                                <span className="font-bold text-slate-600">Giải thích: </span>
                                <span>{q.explanation}</span>
                              </div>
                            )}
                            {q.evidenceTimestamp !== undefined && onSeekAudio && (
                              <button
                                onClick={() => onSeekAudio(q.evidenceTimestamp)}
                                className="mt-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>Nghe lại đoạn này ({formatTimestamp(q.evidenceTimestamp)})</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TYPE 3: PICK MULTIPLE (e.g. Choose TWO letters, A-E) */}
              {group.type === 'pick_multiple' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                      Lựa chọn (Chọn tối đa {group.maxSelections || 2} phương án):
                    </div>
                    <div className="space-y-2">
                      {group.options?.map((opt) => {
                        const isSelected = group.questions?.some(
                          q => (userAnswers[q.order] || '').toUpperCase() === opt.key
                        );

                        return (
                          <div
                            key={opt.key}
                            onClick={() => {
                              if (isSubmitted) return;
                              const currentSelectedOrders = group.questions.filter(
                                q => (userAnswers[q.order] || '').toUpperCase() === opt.key
                              );

                              if (currentSelectedOrders.length > 0) {
                                currentSelectedOrders.forEach(q => onAnswerChange(q.order, ''));
                              } else {
                                const emptySlot = group.questions.find(
                                  q => !(userAnswers[q.order] || '').trim()
                                );
                                if (emptySlot) {
                                  onAnswerChange(emptySlot.order, opt.key);
                                } else {
                                  const lastSlot = group.questions[group.questions.length - 1];
                                  onAnswerChange(lastSlot.order, opt.key);
                                }
                              }
                            }}
                            className={`p-2.5 rounded-xl border flex items-start space-x-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-red-50 border-red-500 font-bold text-red-950 ring-1 ring-red-300'
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="mt-0.5 w-4 h-4 rounded-sm border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                            />
                            <span className="font-bold text-xs shrink-0 w-4">{opt.key}.</span>
                            <span className={`flex-1 leading-snug ${fontSizeClasses.body}`}>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.questions?.map((q) => {
                      const status = checkAnswerStatus(q);
                      const userVal = userAnswers[q.order] || '';

                      return (
                        <div
                          key={q.id}
                          id={`listening-q-${q.order}`}
                          ref={el => (questionRefs.current[q.order] = el)}
                          className={`p-3 rounded-xl border ${
                            isSubmitted
                              ? status.isCorrect
                                ? 'bg-emerald-50 border-emerald-400'
                                : 'bg-rose-50 border-rose-400'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="w-6 h-6 rounded-md bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                              {q.order}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              Lựa chọn: {userVal || '(Chưa chọn)'}
                            </span>
                            {isSubmitted && (
                              <span>
                                {status.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                )}
                              </span>
                            )}
                          </div>
                          {isSubmitted && (
                            <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                              <div>
                                <span className="font-bold">Đáp án: </span>
                                <span className="font-bold text-emerald-700">
                                  {q.acceptableAnswers?.join(' hoặc ') || q.answer}
                                </span>
                              </div>
                              {q.evidenceQuote && (
                                <div className="italic font-serif">"{q.evidenceQuote}"</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE 4: MATCHING INFORMATION (Choose A–F from box) */}
              {group.type === 'matching' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                      Danh Sách Lựa Chọn (Options Box):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.options?.map(opt => (
                        <div
                          key={opt.key}
                          className="p-2 rounded-lg bg-white border border-slate-200 text-xs flex items-start space-x-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {opt.key}
                          </span>
                          <span className="text-slate-800 font-medium">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {group.questions?.map((q) => {
                      const status = checkAnswerStatus(q);
                      const userVal = userAnswers[q.order] || '';
                      const isFlagged = !!flaggedQuestions[q.order];
                      const isActive = activeQuestionOrder === q.order;

                      return (
                        <div
                          key={q.id}
                          id={`listening-q-${q.order}`}
                          ref={el => (questionRefs.current[q.order] = el)}
                          onClick={() => onSelectQuestion && onSelectQuestion(q.order)}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isActive
                              ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/30'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 flex-1">
                            <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                              {q.order}
                            </span>
                            <span className={`font-semibold text-slate-900 ${fontSizeClasses.body}`}>
                              {q.questionText}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <select
                              value={userVal}
                              disabled={isSubmitted}
                              tabIndex={100 + q.order}
                              onChange={(e) => onAnswerChange && onAnswerChange(q.order, e.target.value)}
                              onFocus={(e) => {
                                onSelectQuestion && onSelectQuestion(q.order);
                                e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
                              }}
                              className={`px-3 py-1.5 rounded-lg border font-bold text-xs cursor-pointer focus:outline-hidden transition-all ${
                                isSubmitted
                                  ? status.isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                    : 'bg-rose-50 border-rose-400 text-rose-900'
                                  : 'bg-white border-slate-300 text-slate-800 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              }`}
                            >
                              <option value="">-- Chọn A–{group.options ? group.options[group.options.length - 1]?.key : 'F'} --</option>
                              {group.options?.map(opt => (
                                <option key={opt.key} value={opt.key}>
                                  {opt.key}: {opt.text.substring(0, 40)}...
                                </option>
                              ))}
                            </select>

                            {!isSubmitted && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFlag && onToggleFlag(q.order);
                                }}
                                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                  isFlagged
                                    ? 'text-amber-500 bg-amber-50 border border-amber-300'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                              </button>
                            )}

                            {isSubmitted && (
                              <span>
                                {status.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm text-xs">
                                      {q.answer}
                                    </span>
                                  </div>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE 5: MAP / PLAN / DIAGRAM LABELLING */}
              {group.type === 'map_labelling' && (
                <div className="space-y-4">
                  {group.mapImageUrl && (
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 relative">
                      <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 bg-slate-900/80 backdrop-blur-xs p-1 rounded-lg border border-slate-700 text-white">
                        <button
                          onClick={() => setMapZoom(prev => Math.min(prev + 0.25, 2.5))}
                          className="p-1.5 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                          title="Phóng to"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setMapZoom(prev => Math.max(prev - 0.25, 0.75))}
                          className="p-1.5 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                          title="Thu nhỏ"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setMapZoom(1)}
                          className="px-1.5 py-0.5 text-[10px] font-bold hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                          title="Cỡ chuẩn"
                        >
                          100%
                        </button>
                        <button
                          onClick={() => setIsMapModalOpen(true)}
                          className="p-1.5 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                          title="Mở toàn màn hình"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="overflow-auto max-h-[400px] flex items-center justify-center p-2 bg-slate-950">
                        <img
                          src={group.mapImageUrl}
                          alt="IELTS Listening Map"
                          style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
                          className="max-w-full h-auto transition-transform duration-150 rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.questions?.map((q) => {
                      const status = checkAnswerStatus(q);
                      const userVal = userAnswers[q.order] || '';
                      const isFlagged = !!flaggedQuestions[q.order];
                      const isActive = activeQuestionOrder === q.order;

                      return (
                        <div
                          key={q.id}
                          id={`listening-q-${q.order}`}
                          ref={el => (questionRefs.current[q.order] = el)}
                          onClick={() => onSelectQuestion && onSelectQuestion(q.order)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            isActive
                              ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/30'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                              {q.order}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              {q.questionText}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <input
                              type="text"
                              maxLength={2}
                              value={userVal}
                              disabled={isSubmitted}
                              tabIndex={100 + q.order}
                              onChange={(e) => onAnswerChange && onAnswerChange(q.order, e.target.value.toUpperCase())}
                              onFocus={(e) => {
                                onSelectQuestion && onSelectQuestion(q.order);
                                e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
                              }}
                              placeholder="A–H"
                              className={`w-14 text-center py-1 rounded-lg border font-bold text-xs uppercase transition-all ${
                                isSubmitted
                                  ? status.isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                    : 'bg-rose-50 border-rose-400 text-rose-900'
                                  : 'bg-white border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              }`}
                            />

                            {isSubmitted && (
                              <span>
                                {status.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm text-xs">
                                    {q.answer}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE 6: FLOW-CHART COMPLETION */}
              {group.type === 'flow_chart' && (
                <div className="space-y-3">
                  {group.questions?.map((q, idx) => {
                    const status = checkAnswerStatus(q);
                    const userVal = userAnswers[q.order] || '';
                    const wordLimitAlert = getWordLimitAlert(userVal, group.instruction);
                    const isLast = idx === group.questions.length - 1;

                    return (
                      <React.Fragment key={q.id}>
                        <div
                          id={`listening-q-${q.order}`}
                          ref={el => (questionRefs.current[q.order] = el)}
                          onClick={() => onSelectQuestion && onSelectQuestion(q.order)}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                              Bước {idx + 1} (Câu {q.order})
                            </span>
                            {isSubmitted && (
                              <span>
                                {status.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                )}
                              </span>
                            )}
                          </div>

                          <div className={`leading-relaxed text-slate-800 ${fontSizeClasses.body}`}>
                            {q.prefixText && <span>{q.prefixText} </span>}

                            <div className="inline-block my-1 mx-1.5 relative">
                              <input
                                type="text"
                                value={userVal}
                                disabled={isSubmitted}
                                tabIndex={100 + q.order}
                                onChange={(e) => onAnswerChange && onAnswerChange(q.order, e.target.value)}
                                onFocus={(e) => {
                                  onSelectQuestion && onSelectQuestion(q.order);
                                  e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
                                }}
                                placeholder={`[${q.order}]`}
                                className={`px-3 py-1.5 rounded-lg border font-medium text-slate-900 focus:outline-hidden transition-all min-w-[140px] sm:min-w-[180px] ${
                                  isSubmitted
                                    ? status.isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                      : 'bg-rose-50 border-rose-400 text-rose-900'
                                    : 'bg-white border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                } ${fontSizeClasses.input}`}
                              />

                              {wordLimitAlert && !isSubmitted && (
                                <div className="absolute left-0 -bottom-7 z-20 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap animate-bounce">
                                  {wordLimitAlert.message}
                                </div>
                              )}
                            </div>

                            {q.suffixText && <span> {q.suffixText}</span>}
                          </div>

                          {isSubmitted && (
                            <div className="mt-2 text-xs text-slate-600">
                              <span className="font-bold">Đáp án: </span>
                              <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                                {q.answer}
                              </span>
                            </div>
                          )}
                        </div>

                        {!isLast && (
                          <div className="flex justify-center my-1 text-slate-400">
                            <ArrowDown className="w-5 h-5 animate-pulse" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* TYPE 7: TABLE COMPLETION */}
              {group.type === 'table_completion' && (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    {group.tableHeaders && (
                      <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-xs border-b border-slate-200">
                        <tr>
                          {group.tableHeaders.map((h, i) => (
                            <th key={i} className="px-3 py-2 sm:px-4 sm:py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {group.questions?.map((q) => {
                        const status = checkAnswerStatus(q);
                        const userVal = userAnswers[q.order] || '';

                        return (
                          <tr key={q.id} id={`listening-q-${q.order}`}>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-bold text-slate-500 w-12">
                              #{q.order}
                            </td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 text-slate-800">
                              {q.questionText}
                            </td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                              <input
                                type="text"
                                value={userVal}
                                disabled={isSubmitted}
                                tabIndex={100 + q.order}
                                onChange={(e) => onAnswerChange && onAnswerChange(q.order, e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full max-w-[200px]"
                                placeholder="Nhập đáp án..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TYPE 8: SHORT ANSWER QUESTIONS */}
              {group.type === 'short_answer' && (
                <div className="space-y-3">
                  {group.questions?.map((q) => {
                    const status = checkAnswerStatus(q);
                    const userVal = userAnswers[q.order] || '';

                    return (
                      <div
                        key={q.id}
                        id={`listening-q-${q.order}`}
                        ref={el => (questionRefs.current[q.order] = el)}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-md bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                            {q.order}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {q.questionText}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={userVal}
                          disabled={isSubmitted}
                          tabIndex={100 + q.order}
                          onChange={(e) => onAnswerChange && onAnswerChange(q.order, e.target.value)}
                          placeholder="Nhập câu trả lời ngắn..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Fullscreen Map Modal */}
      {isMapModalOpen && mapGroup && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4">
          <div className="flex items-center justify-between text-white mb-2">
            <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Sơ đồ / Bản đồ chi tiết</span>
            </h3>
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-2">
            <img
              src={mapGroup.mapImageUrl}
              alt="IELTS Listening Map Large"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Note Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-2 mb-3 text-slate-900 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Thêm ghi chú cho cụm từ đã chọn</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-600 italic border border-slate-200 mb-3">
              "{activeNoteModal.text}"
            </div>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Nhập ghi chú cá nhân của bạn..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden mb-3"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setActiveNoteModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
