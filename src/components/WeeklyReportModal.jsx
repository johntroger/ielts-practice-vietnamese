import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  Calendar, 
  X,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { callGeminiApi } from '../services/geminiService';

export default function WeeklyReportModal({ isOpen, onClose, submissions = [], mistakes = [], apiKey, model }) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [checkedActions, setCheckedActions] = useState({});

  // Compute stats from local submissions
  const recentSubmissions = submissions.slice(0, 7);
  const totalEssays = recentSubmissions.length;
  
  const avgBand = totalEssays > 0 
    ? (recentSubmissions.reduce((acc, s) => acc + (s.evaluation?.overallBand || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';

  const avgTR = totalEssays > 0
    ? (recentSubmissions.reduce((acc, s) => acc + (s.evaluation?.criteria?.tr?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';

  const avgCC = totalEssays > 0
    ? (recentSubmissions.reduce((acc, s) => acc + (s.evaluation?.criteria?.cc?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';

  const avgLR = totalEssays > 0
    ? (recentSubmissions.reduce((acc, s) => acc + (s.evaluation?.criteria?.lr?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';

  const avgGRA = totalEssays > 0
    ? (recentSubmissions.reduce((acc, s) => acc + (s.evaluation?.criteria?.gra?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';

  const handleGenerateWeeklyDiagnosis = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }

    setIsLoading(true);
    try {
      const summaryPayload = {
        totalEssays,
        avgBand,
        criteriaAverages: { tr: avgTR, cc: avgCC, lr: avgLR, gra: avgGRA },
        recentMistakes: mistakes.slice(0, 5).map(m => `${m.type}: "${m.original}" -> "${m.corrected}"`),
        tasksPracticed: recentSubmissions.map(s => `Task ${s.task?.taskNumber}: ${s.task?.title} (Band ${s.evaluation?.overallBand})`)
      };

      const prompt = `Act as an expert Cambridge IELTS Academic Director. Analyze this student's weekly practice portfolio and provide a professional diagnosis:
DATA:
${JSON.stringify(summaryPayload, null, 2)}

Provide:
1. 3 concrete strengths (khen ngợi thành tích cụ thể).
2. 3 critical weaknesses / bottlenecks (chỉ ra các điểm nghẽn lớn nhất đang kéo tụt điểm).
3. 3 specific actionable missions for the next 7 days (kê đơn 3 nhiệm vụ trọng tâm để cải thiện).

Return ONLY raw parseable JSON in this schema:
{
  "summaryHeadline": "Tiêu đề ngắn gọn về phong độ tuần này...",
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "actionPlan": [
    { "task": "Nhiệm vụ 1 cụ thể...", "priority": "Cao", "targetSkill": "Task 1 Overview" },
    { "task": "Nhiệm vụ 2 cụ thể...", "priority": "Cao", "targetSkill": "Grammar Accuracy" },
    { "task": "Nhiệm vụ 3 cụ thể...", "priority": "Trung bình", "targetSkill": "Task 2 PEEL" }
  ]
}`;

      const response = await callGeminiApi({
        model,
        apiKey,
        body: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Lỗi API (${response.status})`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      setReportData(JSON.parse(cleaned));
    } catch (err) {
      alert(`Không thể tạo báo cáo chẩn đoán bằng AI: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAction = (idx) => {
    setCheckedActions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Chẩn Đoán Năng Lực & Kế Hoạch Tuần</h2>
              <p className="text-xs text-slate-400">Phân tích điểm mạnh, điểm yếu cốt tử và kê đơn nhiệm vụ cho 7 ngày tới</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly Stats Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Đã hoàn thành: <strong>{totalEssays} bài viết</strong></span>
            </div>
            <span>•</span>
            <div>
              <span>Band trung bình tuần: <strong className="text-red-600 font-extrabold text-sm">BAND {avgBand}</strong></span>
            </div>
          </div>

          <button
            onClick={handleGenerateWeeklyDiagnosis}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'AI Đang Chẩn Đoán...' : 'Gemini Chẩn Đoán Tuần Này'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Criteria Averages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Task Response</span>
              <strong className="text-lg text-slate-900">Band {avgTR}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Coherence (CC)</span>
              <strong className="text-lg text-slate-900">Band {avgCC}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Lexical (LR)</span>
              <strong className="text-lg text-slate-900">Band {avgLR}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Grammar (GRA)</span>
              <strong className="text-lg text-slate-900">Band {avgGRA}</strong>
            </div>
          </div>

          {/* AI Diagnosis Section */}
          {reportData ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Summary Headline */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium leading-relaxed">
                🎯 <strong>Nhận định tổng quan:</strong> {reportData.summaryHeadline}
              </div>

              {/* Strengths & Weaknesses 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs sm:text-sm border-b border-emerald-200/60 pb-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Điểm Mạnh Đã Đạt Được (Superpowers):</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-950 font-sans">
                    {reportData.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Weaknesses */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs sm:text-sm border-b border-amber-200/60 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Điểm Nghẽn Cốt Tử Cần Khắc Phục:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-950 font-sans">
                    {reportData.weaknesses?.map((w, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-600 font-bold">⚠️</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Plan Checklist */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs sm:text-sm border-b pb-2">
                  <ListTodo className="w-4 h-4 text-red-600" />
                  <span>Kế Hoạch Hành Động 7 Ngày Tới (Targeted Action Plan):</span>
                </div>

                <div className="space-y-2">
                  {reportData.actionPlan?.map((plan, idx) => (
                    <div 
                      key={idx}
                      onClick={() => toggleAction(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        checkedActions[idx] 
                          ? 'bg-slate-50 border-slate-200 text-slate-400' 
                          : 'bg-white border-slate-200 hover:border-red-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          checkedActions[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {checkedActions[idx] && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={`text-xs font-semibold ${checkedActions[idx] ? 'line-through' : ''}`}>
                          {plan.task}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        plan.priority === 'Cao' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Ưu tiên: {plan.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Target className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Bấm nút <strong>"Gemini Chẩn Đoán Tuần Này"</strong> ở trên để AI phân tích toàn bộ bài viết và lập lộ trình thích ứng cho bạn!</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
