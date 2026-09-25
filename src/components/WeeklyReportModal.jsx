import React, { useState, useMemo } from 'react';
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
  ListTodo,
  PenTool,
  BookMarked,
  Headphones,
  Mic,
  Activity,
  Layers
} from 'lucide-react';
import { callGeminiApi } from '../services/geminiService';

export default function WeeklyReportModal({ 
  isOpen, 
  onClose, 
  submissions = [], 
  readingHistory = [],
  listeningHistory = [],
  speakingHistory = [],
  mistakes = [], 
  apiKey, 
  model 
}) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [checkedActions, setCheckedActions] = useState({});
  const [showDetailedCriteria, setShowDetailedCriteria] = useState(false);

  // 1. Writing Stats
  const recentWriting = submissions.slice(0, 7);
  const totalEssays = recentWriting.length;
  const avgWritingBand = totalEssays > 0 
    ? (recentWriting.reduce((acc, s) => acc + (s.evaluation?.overallBand || 6.0), 0) / totalEssays).toFixed(1)
    : null;
  const avgTR = totalEssays > 0
    ? (recentWriting.reduce((acc, s) => acc + (s.evaluation?.criteria?.tr?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';
  const avgCC = totalEssays > 0
    ? (recentWriting.reduce((acc, s) => acc + (s.evaluation?.criteria?.cc?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';
  const avgLR = totalEssays > 0
    ? (recentWriting.reduce((acc, s) => acc + (s.evaluation?.criteria?.lr?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';
  const avgGRA = totalEssays > 0
    ? (recentWriting.reduce((acc, s) => acc + (s.evaluation?.criteria?.gra?.band || 6.0), 0) / totalEssays).toFixed(1)
    : 'N/A';

  // 2. Reading Stats
  const recentReading = readingHistory.slice(0, 7);
  const totalReadingTests = recentReading.length;
  const avgReadingBand = totalReadingTests > 0
    ? (recentReading.reduce((acc, r) => acc + Number(r.band || 6.0), 0) / totalReadingTests).toFixed(1)
    : null;
  const avgReadingAccuracy = totalReadingTests > 0
    ? Math.round(recentReading.reduce((acc, r) => acc + (r.accuracyPercent || 0), 0) / totalReadingTests)
    : 0;

  // 3. Listening Stats
  const recentListening = listeningHistory.slice(0, 7);
  const totalListeningTests = recentListening.length;
  const avgListeningBand = totalListeningTests > 0
    ? (recentListening.reduce((acc, l) => acc + Number(l.band || 6.0), 0) / totalListeningTests).toFixed(1)
    : null;
  const avgListeningAccuracy = totalListeningTests > 0
    ? Math.round(recentListening.reduce((acc, l) => acc + (l.accuracyPercent || 0), 0) / totalListeningTests)
    : 0;

  // 4. Speaking Stats
  const recentSpeaking = speakingHistory.slice(0, 7);
  const totalSpeakingTests = recentSpeaking.length;
  const avgSpeakingBand = totalSpeakingTests > 0
    ? (recentSpeaking.reduce((acc, sp) => acc + Number(sp.evaluation?.overallBand || 6.0), 0) / totalSpeakingTests).toFixed(1)
    : null;
  const avgSpeakingWpm = totalSpeakingTests > 0
    ? Math.round(recentSpeaking.reduce((acc, sp) => acc + (sp.evaluation?.wpm || 110), 0) / totalSpeakingTests)
    : 0;

  // 5. Cambridge 4-Skill Overall Rounding Standard
  const activeBands = useMemo(() => {
    return [
      avgWritingBand ? Number(avgWritingBand) : null,
      avgReadingBand ? Number(avgReadingBand) : null,
      avgListeningBand ? Number(avgListeningBand) : null,
      avgSpeakingBand ? Number(avgSpeakingBand) : null
    ].filter(b => b !== null);
  }, [avgWritingBand, avgReadingBand, avgListeningBand, avgSpeakingBand]);

  const overallProjectedBand = useMemo(() => {
    if (activeBands.length === 0) return 'N/A';
    const rawAvg = activeBands.reduce((a, b) => a + b, 0) / activeBands.length;
    const intPart = Math.floor(rawAvg);
    const fraction = rawAvg - intPart;
    let rounded = intPart;
    if (fraction < 0.25) rounded = intPart;
    else if (fraction < 0.75) rounded = intPart + 0.5;
    else rounded = intPart + 1.0;
    return rounded.toFixed(1);
  }, [activeBands]);

  const totalActivities = totalEssays + totalReadingTests + totalListeningTests + totalSpeakingTests;

  // Smart Fallback Diagnosis (when offline or without API key)
  const generateFallbackDiagnosis = () => {
    return {
      summaryHeadline: totalActivities > 0 
        ? `Tuần này bạn đã hoàn thành ${totalActivities} bài tập trên ${activeBands.length} kỹ năng với dự phóng Overall Band đạt ${overallProjectedBand}. Phong độ tương đối ổn định và có chiều hướng tiến bộ rõ rệt.`
        : 'Bạn vừa bắt đầu chu kỳ tuần mới. Hãy hoàn thành ít nhất 1 bài tập ở mỗi kỹ năng để AI thiết lập bản đồ năng lực chính xác.',
      strengths: [
        totalEssays > 0 ? `Duy trì thói quen luyện viết Writing (${totalEssays} bài) với cấu trúc và tư duy lập luận ngày càng chặt chẽ.` : 'Tập trung cao độ vào việc xây dựng nền tảng học thuật.',
        (totalReadingTests > 0 || totalListeningTests > 0) ? `Kỹ năng tiếp nhận (Reading/Listening) thể hiện khả năng quét thông tin và xử lý từ đồng nghĩa (paraphrase) tốt.` : 'Ý thức rèn luyện phân bổ đều giữa các kỹ năng.',
        totalSpeakingTests > 0 ? `Chủ động phản xạ đàm thoại với Giám khảo AI (${totalSpeakingTests} lượt thi), kiểm soát tốc độ nói trung bình đạt ~${avgSpeakingWpm} WPM.` : 'Kế hoạch học tập bám sát chuẩn khảo thí Cambridge.'
      ],
      weaknesses: [
        mistakes.length > 0 ? `Còn lặp lại một số lỗi ngữ pháp trong Sổ tay lỗi sai (${mistakes.length} lỗi ghi nhận, chú ý mạo từ và chia thì).` : 'Cần trau dồi thêm các cụm từ vựng C1/C2 để bài viết và bài nói tự nhiên hơn.',
        avgWritingBand && Number(avgWritingBand) < 7.0 ? 'Writing Task 2 cần phát triển luận cứ sâu hơn theo khung PEEL, tránh liệt kê ý rời rạc.' : 'Reading Passage 3 cần căn chỉnh thời gian làm bài để không bị thiếu giờ.',
        avgSpeakingBand && Number(avgSpeakingBand) < 7.0 ? 'Speaking Part 2 cần bám sát bảng nháp 4 ô theo trục thời gian Past - Present - Future để nói đủ 2 phút trơn tru.' : 'Cần hạn chế tối đa các từ đệm vô nghĩa (uh, um, like).'
      ],
      actionPlan: [
        { task: 'Hoàn thành 1 bài viết Writing Task 2, rà soát lại toàn bộ lỗi ngữ pháp trước khi nộp', priority: 'Cao', targetSkill: 'Writing' },
        { task: 'Luyện 1 đề Reading trọn vẹn 60 phút, chú trọng phân tích bẫy dạng True/False/Not Given', priority: 'Cao', targetSkill: 'Reading' },
        { task: 'Thực hiện 1 buổi thi thử Speaking 3 Parts cùng Giám khảo AI, ứng dụng công thức A.R.E.A ở Part 1', priority: 'Trung bình', targetSkill: 'Speaking' },
        { task: 'Luyện 1 đề Listening Part 3 & Part 4, tập trung bắt bẫy từ gây nhiễu (distractors)', priority: 'Trung bình', targetSkill: 'Listening' }
      ]
    };
  };

  const handleGenerateWeeklyDiagnosis = async () => {
    if (!apiKey) {
      setReportData(generateFallbackDiagnosis());
      return;
    }

    setIsLoading(true);
    try {
      const summaryPayload = {
        totalActivities,
        overallProjectedBand,
        writing: {
          totalEssays,
          avgBand: avgWritingBand,
          criteriaAverages: { tr: avgTR, cc: avgCC, lr: avgLR, gra: avgGRA },
          tasksPracticed: recentWriting.map(s => `Task ${s.task?.taskNumber}: ${s.task?.title} (Band ${s.evaluation?.overallBand})`)
        },
        reading: {
          totalTests: totalReadingTests,
          avgBand: avgReadingBand,
          avgAccuracy: `${avgReadingAccuracy}%`
        },
        listening: {
          totalTests: totalListeningTests,
          avgBand: avgListeningBand,
          avgAccuracy: `${avgListeningAccuracy}%`
        },
        speaking: {
          totalTests: totalSpeakingTests,
          avgBand: avgSpeakingBand,
          avgWpm: avgSpeakingWpm
        },
        recentMistakes: mistakes.slice(0, 6).map(m => `${m.type}: "${m.original}" -> "${m.corrected}"`)
      };

      const prompt = `Act as an elite Cambridge IELTS Academic Director. Analyze this student's comprehensive 4-skill weekly practice portfolio (Writing, Reading, Listening, Speaking):
DATA:
${JSON.stringify(summaryPayload, null, 2)}

Provide a professional, motivating, and actionable weekly diagnostic report in Vietnamese:
1. summaryHeadline: Một câu nhận định đắt giá về phong độ 4 kỹ năng tuần này và dự phóng điểm thi.
2. 3 concrete strengths: Điểm mạnh nổi bật, ghi nhận nỗ lực qua số liệu thực tế.
3. 3 critical weaknesses / bottlenecks: Các điểm nghẽn lớn nhất đang kéo tụt Overall Band cần khắc phục ngay.
4. 4 specific actionable missions for the next 7 days: Kê đơn 4 nhiệm vụ hành động tương ứng cho các kỹ năng cần bứt phá.

Return ONLY raw parseable JSON with this exact schema:
{
  "summaryHeadline": "...",
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "actionPlan": [
    { "task": "Nhiệm vụ 1 cụ thể...", "priority": "Cao", "targetSkill": "Writing" },
    { "task": "Nhiệm vụ 2 cụ thể...", "priority": "Cao", "targetSkill": "Reading" },
    { "task": "Nhiệm vụ 3 cụ thể...", "priority": "Trung bình", "targetSkill": "Speaking" },
    { "task": "Nhiệm vụ 4 cụ thể...", "priority": "Trung bình", "targetSkill": "Listening" }
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
        throw new Error(`Lỗi API (${response.status})`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      setReportData(JSON.parse(cleaned));
    } catch (err) {
      console.warn('AI diagnosis fallback activated:', err.message);
      setReportData(generateFallbackDiagnosis());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAction = (idx) => {
    setCheckedActions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getSkillBadgeColor = (skill = '') => {
    const s = skill.toLowerCase();
    if (s.includes('writing')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s.includes('reading')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('listening')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (s.includes('speaking')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200 min-w-0">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex items-center justify-between shrink-0 gap-2 min-w-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-xs shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg lg:text-xl font-bold flex items-center space-x-1.5 sm:space-x-2 truncate">
                <span className="truncate">Chẩn Đoán Năng Lực Tuần & Lộ Trình 4 Kỹ Năng</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-red-300 border border-red-400/30 shrink-0">
                  Cambridge AI
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
                Tổng hợp đa chiều Writing, Reading, Listening, Speaking và kê đơn hành động 7 ngày tới
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Đóng bảng báo cáo"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly Stats Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Đã thực hiện: <strong className="text-slate-900">{totalActivities} bài tập & ca thi</strong></span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span>Dự phóng Overall tuần: <strong className="text-red-600 font-extrabold text-sm">
                {overallProjectedBand !== 'N/A' ? `BAND ${overallProjectedBand}` : 'Chưa đủ dữ liệu'}
              </strong></span>
            </div>
          </div>

          <button
            onClick={handleGenerateWeeklyDiagnosis}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'AI Đang Chẩn Đoán...' : 'Gemini Chẩn Đoán Tuần Này'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* 4-SKILL PORTFOLIO KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Card 1: Overall Band */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 shadow-2xs text-center space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-red-700 font-extrabold uppercase tracking-wider block">Overall (Cambridge)</span>
              <div className="text-xl font-black text-red-600">
                {overallProjectedBand !== 'N/A' ? `Band ${overallProjectedBand}` : '--'}
              </div>
              <span className="text-[10px] text-slate-500 block">4 kỹ năng quy tròn</span>
            </div>

            {/* Card 2: Writing */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-bold uppercase">
                <PenTool className="w-3 h-3 text-blue-500" />
                <span>Writing</span>
              </div>
              <div className="text-lg font-black text-blue-600">
                {avgWritingBand ? `Band ${avgWritingBand}` : '--'}
              </div>
              <span className="text-[10px] text-slate-500 block">{totalEssays} bài viết</span>
            </div>

            {/* Card 3: Reading */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-bold uppercase">
                <BookMarked className="w-3 h-3 text-emerald-500" />
                <span>Reading</span>
              </div>
              <div className="text-lg font-black text-emerald-600">
                {avgReadingBand ? `Band ${avgReadingBand}` : '--'}
              </div>
              <span className="text-[10px] text-slate-500 block">{totalReadingTests} đề thi</span>
            </div>

            {/* Card 4: Listening */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-bold uppercase">
                <Headphones className="w-3 h-3 text-amber-500" />
                <span>Listening</span>
              </div>
              <div className="text-lg font-black text-amber-600">
                {avgListeningBand ? `Band ${avgListeningBand}` : '--'}
              </div>
              <span className="text-[10px] text-slate-500 block">{totalListeningTests} đề thi</span>
            </div>

            {/* Card 5: Speaking */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-bold uppercase">
                <Mic className="w-3 h-3 text-purple-500" />
                <span>Speaking</span>
              </div>
              <div className="text-lg font-black text-purple-600">
                {avgSpeakingBand ? `Band ${avgSpeakingBand}` : '--'}
              </div>
              <span className="text-[10px] text-slate-500 block">{totalSpeakingTests} buổi thi</span>
            </div>
          </div>

          {/* Toggle Writing Criteria Details */}
          {totalEssays > 0 && (
            <div className="text-right">
              <button
                onClick={() => setShowDetailedCriteria(!showDetailedCriteria)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                {showDetailedCriteria ? '▲ Thu gọn tiêu chí Writing' : '▼ Xem chi tiết 4 tiêu chí Writing (TR, CC, LR, GRA)'}
              </button>
            </div>
          )}

          {showDetailedCriteria && totalEssays > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Task Response</span>
                <strong className="text-sm text-slate-800">Band {avgTR}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Coherence (CC)</span>
                <strong className="text-sm text-slate-800">Band {avgCC}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Lexical (LR)</span>
                <strong className="text-sm text-slate-800">Band {avgLR}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Grammar (GRA)</span>
                <strong className="text-sm text-slate-800">Band {avgGRA}</strong>
              </div>
            </div>
          )}

          {/* AI Diagnosis Section */}
          {reportData ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Summary Headline */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium leading-relaxed shadow-xs">
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
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
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
                        <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Plan Checklist */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs sm:text-sm">
                    <ListTodo className="w-4 h-4 text-red-600" />
                    <span>Lộ Trình Hành Động 7 Ngày Tới (Targeted Action Plan):</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Đã hoàn thành: {Object.values(checkedActions).filter(Boolean).length}/{reportData.actionPlan?.length || 0}
                  </span>
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
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          checkedActions[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {checkedActions[idx] && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={`text-xs font-semibold truncate sm:whitespace-normal ${checkedActions[idx] ? 'line-through' : ''}`}>
                          {plan.task}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {plan.targetSkill && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSkillBadgeColor(plan.targetSkill)}`}>
                            {plan.targetSkill}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          plan.priority === 'Cao' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {plan.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Target className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="max-w-md mx-auto">
                Bấm nút <strong>"Gemini Chẩn Đoán Tuần Này"</strong> ở trên để AI phân tích toàn bộ kết quả 4 kỹ năng (Writing, Reading, Listening, Speaking) và kê đơn lộ trình tối ưu cho bạn!
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
