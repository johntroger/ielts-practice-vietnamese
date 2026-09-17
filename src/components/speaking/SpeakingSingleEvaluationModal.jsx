import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  TrendingUp, 
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function SpeakingSingleEvaluationModal({
  isOpen,
  onClose,
  evaluation,
  questionText = '',
  topicTitle = '',
  candidateTranscript = '',
  part = 1,
  onSaveToHistoryAndCleanVoice
}) {
  if (!isOpen || !evaluation) return null;

  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const criteria = evaluation.criteria || {};
  const overallBand = evaluation.overallBand || 6.5;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSaveAndClean = () => {
    if (onSaveToHistoryAndCleanVoice) {
      onSaveToHistoryAndCleanVoice();
    }
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  Đánh Giá Câu Trả Lời • Part {part}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Cambridge Benchmark
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{topicTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* 1. OVERALL BAND BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/40 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                Điểm Đánh Giá Dự Kiến
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-black text-white">Band {overallBand.toFixed(1)}</span>
                <span className="text-xs text-slate-400">/ 9.0 (Cambridge Scale)</span>
              </div>
            </div>
            <div className="text-right max-w-xs">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                "{evaluation.examinerComment || 'Câu trả lời thể hiện tư duy tốt, phản xạ tự nhiên.'}"
              </p>
            </div>
          </div>

          {/* 2. QUESTION & CANDIDATE TRANSCRIPT */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Câu Hỏi Đã Luyện Tập:
              </span>
              <p className="text-xs font-bold text-white mt-0.5">{questionText}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                Nội Dung Bạn Vừa Trả Lời:
              </span>
              <p className="text-xs text-slate-200 mt-0.5 italic">"{candidateTranscript}"</p>
            </div>
          </div>

          {/* 3. FOUR CAMBRIDGE CRITERIA BREAKDOWN */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Phân Tích 4 Tiêu Chí Khảo Thí:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* FC */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-300">Fluency & Coherence</span>
                  <span className="font-black text-xs text-white bg-purple-900/60 px-2 py-0.5 rounded">
                    Band {criteria.fc?.band || overallBand}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{criteria.fc?.feedback || 'Tốc độ nói ổn định, mạch lạc.'}</p>
              </div>

              {/* LR */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-300">Lexical Resource</span>
                  <span className="font-black text-xs text-white bg-indigo-900/60 px-2 py-0.5 rounded">
                    Band {criteria.lr?.band || overallBand}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{criteria.lr?.feedback || 'Từ vựng diễn đạt đúng trọng tâm.'}</p>
              </div>

              {/* GRA */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-300">Grammatical Accuracy</span>
                  <span className="font-black text-xs text-white bg-blue-900/60 px-2 py-0.5 rounded">
                    Band {criteria.gra?.band || overallBand}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{criteria.gra?.feedback || 'Kiểm soát tốt thì và mệnh đề chính.'}</p>
              </div>

              {/* PR */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-300">Pronunciation</span>
                  <span className="font-black text-xs text-white bg-emerald-900/60 px-2 py-0.5 rounded">
                    Band {criteria.pr?.band || overallBand}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{criteria.pr?.feedback || 'Phát âm rõ âm, nhịp thở tự nhiên.'}</p>
              </div>

            </div>
          </div>

          {/* 4. SENTENCE CORRECTIONS */}
          {evaluation.corrections && evaluation.corrections.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Sửa Lỗi & Nâng Cấp Câu Trực Tiếp:
              </span>
              <div className="space-y-2">
                {evaluation.corrections.map((corr, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-rose-400 text-[11px] line-through">"{corr.original}"</div>
                    <div className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      <span>"{corr.corrected}"</span>
                    </div>
                    {corr.explanation && (
                      <p className="text-[11px] text-slate-400 pt-0.5">{corr.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. BAND 8.5+ UPGRADE */}
          {evaluation.upgradedBand8 && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-700/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Phiên Bản Viết Lại Chuẩn Bản Xứ Band 8.5+:</span>
                </span>
                <button
                  onClick={() => handleCopy(evaluation.upgradedBand8, 'b8')}
                  className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedIdx === 'b8' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === 'b8' ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium italic">
                "{evaluation.upgradedBand8}"
              </p>
            </div>
          )}

          {/* 6. GOLDEN COLLOCATIONS */}
          {evaluation.goldenCollocations && evaluation.goldenCollocations.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Collocations Đắt Giá Nên Ghi Nhớ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.goldenCollocations.map((col, idx) => {
                  const phrase = typeof col === 'string' ? col : col.phrase;
                  const meaning = typeof col === 'object' ? col.meaningVi : '';
                  return (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-purple-300 font-medium flex items-center space-x-1"
                    >
                      <span className="font-bold text-white">{phrase}</span>
                      {meaning && <span className="text-slate-400">({meaning})</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* ZERO VOICE STORAGE REMINDER */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Bảo mật giọng nói:</strong> Khi bấm lưu lịch sử bên dưới, đoạn ghi âm tạm thời trong RAM sẽ bị hủy bỏ vĩnh viễn và chỉ lưu lại bản đánh giá chữ.
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            onClick={handleSaveAndClean}
            disabled={isSaved}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-75"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã Lưu Vào Lịch Sử & Xóa Voice!</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Đánh Giá Vào Lịch Sử & Xóa Voice</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
