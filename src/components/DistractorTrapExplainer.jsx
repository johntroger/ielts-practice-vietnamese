import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  FileSearch, 
  HelpCircle, 
  Hash, 
  ShieldAlert, 
  Zap, 
  Bookmark, 
  Check, 
  ChevronDown, 
  Lightbulb,
  Crosshair,
  BookOpen
} from 'lucide-react';
import { analyzeDistractorTrap } from '../services/trapAnalysisService';
import { openTheoryModalWithContext } from '../services/theoryContextService';

/**
 * Distractor Trap Explainer Component
 * Interactive Examiner-Grade Trap Decoder for Reading & Listening.
 * Deconstructs Cambridge distractor archetypes with 3-second reflex rules.
 */
export default function DistractorTrapExplainer({
  question = {},
  userAnswer = '',
  correctAnswer = '',
  evidenceQuote = '',
  skill = 'reading',
  onSaveMistake = null,
  initiallyExpanded = true
}) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isSaved, setIsSaved] = useState(false);

  // If user got the question right or didn't answer, don't show distractor trap unless requested
  const isCorrect = userAnswer && (
    String(userAnswer).trim().toLowerCase() === String(correctAnswer || question.answer).trim().toLowerCase() ||
    (question.acceptableAnswers && question.acceptableAnswers.some(a => String(a).trim().toLowerCase() === String(userAnswer).trim().toLowerCase()))
  );

  const trap = analyzeDistractorTrap({
    question,
    userAnswer,
    correctAnswer: correctAnswer || question.answer,
    evidenceQuote: evidenceQuote || question.evidenceQuote,
    skill
  });

  const colorStyles = {
    rose: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-200',
      headerBg: 'bg-rose-100/70',
      headerText: 'text-rose-950',
      badge: 'bg-rose-600 text-white',
      accent: 'text-rose-700',
      highlightBox: 'bg-white border-rose-200/80'
    },
    amber: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      headerBg: 'bg-amber-100/70',
      headerText: 'text-amber-950',
      badge: 'bg-amber-600 text-white',
      accent: 'text-amber-700',
      highlightBox: 'bg-white border-amber-200/80'
    },
    indigo: {
      bg: 'bg-indigo-50/80',
      border: 'border-indigo-200',
      headerBg: 'bg-indigo-100/70',
      headerText: 'text-indigo-950',
      badge: 'bg-indigo-600 text-white',
      accent: 'text-indigo-700',
      highlightBox: 'bg-white border-indigo-200/80'
    },
    purple: {
      bg: 'bg-purple-50/80',
      border: 'border-purple-200',
      headerBg: 'bg-purple-100/70',
      headerText: 'text-purple-950',
      badge: 'bg-purple-600 text-white',
      accent: 'text-purple-700',
      highlightBox: 'bg-white border-purple-200/80'
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200',
      headerBg: 'bg-emerald-100/70',
      headerText: 'text-emerald-950',
      badge: 'bg-emerald-600 text-white',
      accent: 'text-emerald-700',
      highlightBox: 'bg-white border-emerald-200/80'
    }
  };

  const style = colorStyles[trap.badgeColor] || colorStyles.amber;

  const handleSaveToMistakeLog = () => {
    if (onSaveMistake) {
      onSaveMistake({
        id: `mistake-${Date.now()}`,
        skill,
        questionOrder: question.order,
        questionText: question.questionText,
        userAnswer,
        correctAnswer: correctAnswer || question.answer,
        trapType: trap.titleVi,
        reflexTip: trap.reflexActionTip,
        date: new Date().toLocaleDateString('vi-VN')
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className={`mt-2.5 rounded-xl border ${style.border} ${style.bg} overflow-hidden shadow-2xs transition-all duration-200 text-left`}>
      {/* Trap Card Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none ${style.headerBg} border-b ${style.border}`}
      >
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-white shadow-2xs text-rose-600">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${style.badge}`}>
                Bẫy Khảo Thí Cambridge
              </span>
              <span className="text-xs font-black text-slate-900">
                {trap.titleVi}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {trap.titleEn}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Trap Content */}
      {isExpanded && (
        <div className="p-3.5 space-y-2.5 text-xs">
          
          {/* 1. Tâm lý thí sinh: Vì sao bạn chọn đáp án này */}
          <div className={`p-2.5 rounded-lg border ${style.highlightBox} space-y-1`}>
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
              <span className="text-xs">🧠</span>
              <span className="text-[11px] uppercase tracking-wide">Tại sao bạn bị thu hút vào đáp án này:</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-[12px]">
              {trap.whyYouChoseThis}
            </p>
          </div>

          {/* 2. Bản chất gài bẫy Cambridge */}
          <div className={`p-2.5 rounded-lg border ${style.highlightBox} space-y-1`}>
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
              <span className="text-xs">🎯</span>
              <span className="text-[11px] uppercase tracking-wide">Bản chất kỹ thuật đặt bẫy của Đề thi:</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-[12px]">
              {trap.examinerBlueprint}
            </p>
          </div>

          {/* 3. Chiến thuật phản xạ 3 giây phòng thi */}
          <div className="p-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-900 font-black">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
              <span className="text-[11px] uppercase tracking-wider">Chiến thuật phản xạ 3 giây (3-Second Reflex Rule):</span>
            </div>
            <p className="text-amber-950 font-semibold leading-relaxed text-[12px]">
              {trap.reflexActionTip}
            </p>
          </div>

          {/* Footer Action Bar */}
          <div className="pt-1 flex items-center justify-between text-[11px] flex-wrap gap-2">
            <span className="text-slate-500 italic">
              💡 Hiểu rõ cơ chế bẫy giúp giảm 80% lỗi sai lặp lại ở bài thi thật.
            </span>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={() => openTheoryModalWithContext({
                  skill: skill === 'listening' ? 'listening' : 'reading',
                  category: skill === 'listening' ? 'listening-strategy' : 'reading-types',
                  subType: 'all',
                  topicId: skill === 'listening' ? 'distractor-traps' : 'true-false-not-given',
                  title: skill === 'listening' 
                    ? 'Bẫy Distractor & Đổi Ý Trong IELTS Listening: Chiến Lược Bẻ Bẫy'
                    : 'Phá Bẫy True / False / Not Given & Yes / No / Not Given'
                })}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                title="Mở cẩm nang lý thuyết bẻ bẫy Cambridge"
              >
                <BookOpen className="w-3 h-3 text-sky-600" />
                <span>Đọc Cẩm Nang Bẫy</span>
              </button>

              {onSaveMistake && (
                <button
                  type="button"
                  onClick={handleSaveToMistakeLog}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                  title="Lưu dạng bẫy này vào Sổ Lỗi Sai để ôn tập"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Đã lưu sổ lỗi</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3 text-amber-600" />
                      <span>Lưu vào Sổ Lỗi Sai</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
