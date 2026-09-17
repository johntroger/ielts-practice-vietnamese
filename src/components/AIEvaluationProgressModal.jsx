import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  BookOpen, 
  Target, 
  Layers, 
  FileText 
} from 'lucide-react';

const EVALUATION_STEPS = [
  {
    id: 'tr',
    title: 'Task Achievement / Task Response',
    desc: 'Đọc hiểu đề bài, rà soát lập trường Thesis & tính bao quát của Overview...',
    icon: Target,
    weight: '25%'
  },
  {
    id: 'cc',
    title: 'Coherence & Cohesion',
    desc: 'Phân tích liên kết ẩn Given-New, bọc khái niệm & mạch lạc giữa các đoạn...',
    icon: Layers,
    weight: '25%'
  },
  {
    id: 'lr',
    title: 'Lexical Resource',
    desc: 'Đo lường Collocations học thuật, từ vựng theo chủ đề & rà lỗi chính tả...',
    icon: BookOpen,
    weight: '25%'
  },
  {
    id: 'gra',
    title: 'Grammatical Range & Accuracy',
    desc: 'Quét câu phức, đảo ngữ, bị động & tính toán tỷ lệ câu không lỗi ngữ pháp...',
    icon: FileText,
    weight: '25%'
  }
];

const ROTATING_TIPS = [
  '💡 Mẹo Task 1: Luôn viết 2 câu Overview rõ ràng để không bị trảm điểm dưới Band 5.0!',
  '💡 Mẹo CC: Thay vì câu nào cũng nhét "Firstly, Secondly", hãy dùng "This socio-economic crisis..." để liên kết tự nhiên.',
  '💡 Mẹo LR: Collocations tự nhiên (metropolitan areas, alleviate congestion) ăn điểm hơn từ vựng cổ xưa tra từ điển.',
  '💡 Mẹo GRA: Giữ tỷ lệ câu không lỗi ngữ pháp trên 70% là chìa khóa vàng để bứt phá qua mốc Band 6.5.',
  '💡 Mẹo Task 2: Dành 5 phút lập dàn ý theo mô hình P.E.S.T.L.E giúp bạn không bao giờ bí ý tưởng giữa chừng.'
];

export default function AIEvaluationProgressModal({ isOpen, taskNumber = 2, skill = 'writing' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(12);
      setTipIndex(0);
      return;
    }

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        const inc = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + inc, 95);
      });
    }, 450);

    const stepTimer1 = setTimeout(() => setCurrentStepIndex(1), 1800);
    const stepTimer2 = setTimeout(() => setCurrentStepIndex(2), 3800);
    const stepTimer3 = setTimeout(() => setCurrentStepIndex(3), 5800);

    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % ROTATING_TIPS.length);
    }, 2800);

    return () => {
      clearInterval(progressTimer);
      clearInterval(tipTimer);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 sm:p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-7 h-7 text-amber-200" />
          </div>

          <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
            Giám Khảo AI Đang Chấm Điểm Bài Thi...
          </h3>
          <p className="text-xs sm:text-sm text-red-100/90 mt-1 font-medium">
            Phân tích chuyên sâu 4 tiêu chí chuẩn khảo thí Cambridge Assessment English
          </p>

          {/* Progress Bar */}
          <div className="mt-4 bg-black/20 rounded-full p-1 border border-white/20">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-white transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold text-red-100 mt-1.5 px-1">
            <span>Tiến trình khảo thí</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Evaluation Steps Body */}
        <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50">
          {EVALUATION_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border transition-all duration-300 flex items-start space-x-3.5 ${
                  isCurrent 
                    ? 'bg-white border-red-300 shadow-md ring-2 ring-red-500/10' 
                    : isDone
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-slate-800'
                    : 'bg-white/60 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                {/* Step Status Indicator */}
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-spin">
                      <Loader2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-red-900' : isDone ? 'text-emerald-950' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </h4>
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded shrink-0 ${
                      isCurrent ? 'bg-red-100 text-red-800' : isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step.weight}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rotating Academic Tip Card */}
        <div className="px-5 sm:px-6 pb-5 pt-1">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start space-x-2.5 transition-all">
            <span className="text-sm shrink-0">💡</span>
            <p className="text-xs text-amber-900 font-medium leading-relaxed animate-in fade-in duration-300">
              {ROTATING_TIPS[tipIndex]}
            </p>
          </div>
          <div className="text-center mt-3 text-[11px] text-slate-400 font-medium">
            Thời gian phản hồi trung bình: 6 – 9 giây • Vui lòng không đóng trang
          </div>
        </div>

      </div>
    </div>
  );
}
