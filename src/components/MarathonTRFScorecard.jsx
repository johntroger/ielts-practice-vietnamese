import React, { useState, useMemo } from 'react';
import { 
  Award, 
  User, 
  Calendar, 
  Headphones, 
  BookOpen, 
  FileText, 
  Mic, 
  Trophy, 
  CheckCheck, 
  ChevronRight, 
  Sparkles,
  Printer 
} from 'lucide-react';
import { generateTrfData } from '../services/trfExportService.js';
import TRFSimulatorModal from './TRFSimulatorModal.jsx';

/**
 * MarathonTRFScorecard - Official Cambridge Test Report Form (Simulation) Component
 * Displays 4-skill band scores (Listening, Reading, Writing, Speaking) + Overall Band
 * calculated with Cambridge Grand Rounding algorithm.
 */
export default function MarathonTRFScorecard({
  currentUser,
  validBands = [],
  listeningBand,
  readingBand,
  writingBand,
  speakingBand,
  latestListening,
  latestReading,
  latestWriting,
  latestSpeaking,
  calculatedOverallBand,
  cefrEvaluation = { level: 'N/A', title: '', desc: '' },
  onClose,
  setActiveMockTab
}) {
  const [isTrfModalOpen, setIsTrfModalOpen] = useState(false);

  const trfData = useMemo(() => {
    return generateTrfData({
      candidateName: currentUser?.name || currentUser?.email?.split('@')[0] || 'CANDIDATE',
      candidateNumber: currentUser?.id ? String(currentUser.id).slice(0, 6) : null,
      listeningBand: listeningBand || 6.0,
      readingBand: readingBand || 6.0,
      writingBand: writingBand || 6.0,
      speakingBand: speakingBand || 6.0,
      examinerFeedback: `Candidate demonstrated ${cefrEvaluation?.title || 'solid linguistic operational competence'} across communicative modules.`
    });
  }, [currentUser, listeningBand, readingBand, writingBand, speakingBand, cefrEvaluation]);

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-xl space-y-6 relative">
      {/* Watermark Logo background */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              CAMBRIDGE TEST REPORT FORM (SIMULATION)
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Chứng chỉ đánh giá năng lực ngôn ngữ dựa trên kết quả thi gần nhất
          </p>
        </div>

        {/* Candidate Quick Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900">
              {currentUser?.name || currentUser?.email?.split('@')[0] || 'Thí sinh IELTS Web'}
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            validBands.length === 4 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {validBands.length === 4 ? 'Đủ 4 Kỹ Năng' : `Đã có ${validBands.length}/4 Kỹ Năng`}
          </span>
        </div>
      </div>

      {/* 5-Column Score Grid: 4 Skills + Overall */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* 1. Listening */}
        <div className="p-4 rounded-2xl border-2 border-purple-100 bg-purple-50/50 hover:bg-purple-50/80 transition-all space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-purple-900">
              <span className="text-[11px] font-black uppercase tracking-wider flex items-center space-x-1">
                <Headphones className="w-3.5 h-3.5 text-purple-600" />
                <span>Listening</span>
              </span>
              {listeningBand && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </div>
            <div className="mt-2 text-center py-2">
              <span className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight">
                {listeningBand ? listeningBand.toFixed(1) : '--'}
              </span>
            </div>
            <div className="text-[11px] text-center text-purple-800 space-y-0.5">
              {latestListening ? (
                <>
                  <div className="font-semibold">
                    {latestListening.correctCount !== undefined 
                      ? `${latestListening.correctCount}/40 câu đúng` 
                      : (latestListening.accuracyPercent ? `${latestListening.accuracyPercent}% chính xác` : 'Đã hoàn thành')}
                  </div>
                  <div className="text-[10px] text-purple-600">{latestListening.date || 'Gần đây'}</div>
                </>
              ) : (
                <div className="text-slate-400 italic">Chưa có bài thi</div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              onClose?.();
              onSelectSkill?.('listening');
            }}
            className="w-full mt-2 py-1.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>{listeningBand ? 'Thi Lại' : 'Thi Ngay'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 2. Reading */}
        <div className="p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-50/80 transition-all space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-900">
              <span className="text-[11px] font-black uppercase tracking-wider flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Reading</span>
              </span>
              {readingBand && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </div>
            <div className="mt-2 text-center py-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                {readingBand ? readingBand.toFixed(1) : '--'}
              </span>
            </div>
            <div className="text-[11px] text-center text-blue-800 space-y-0.5">
              {latestReading ? (
                <>
                  <div className="font-semibold">
                    {latestReading.correctAnswers !== undefined 
                      ? `${latestReading.correctAnswers}/40 câu đúng` 
                      : (latestReading.accuracyPercent ? `${latestReading.accuracyPercent}% chính xác` : 'Đã hoàn thành')}
                  </div>
                  <div className="text-[10px] text-blue-600">{latestReading.date || 'Gần đây'}</div>
                </>
              ) : (
                <div className="text-slate-400 italic">Chưa có bài thi</div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveMockTab?.('reading')}
            className="w-full mt-2 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>{readingBand ? 'Chọn Đề Thi' : 'Thi 3 Passages'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 3. Writing */}
        <div className="p-4 rounded-2xl border-2 border-red-100 bg-red-50/50 hover:bg-red-50/80 transition-all space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-red-900">
              <span className="text-[11px] font-black uppercase tracking-wider flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>Writing</span>
              </span>
              {writingBand && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </div>
            <div className="mt-2 text-center py-2">
              <span className="text-3xl sm:text-4xl font-black text-red-950 tracking-tight">
                {writingBand ? writingBand.toFixed(1) : '--'}
              </span>
            </div>
            <div className="text-[11px] text-center text-red-800 space-y-0.5">
              {latestWriting ? (
                <>
                  <div className="font-semibold">
                    {latestWriting.task?.taskNumber 
                      ? `Task ${latestWriting.task.taskNumber}` 
                      : 'Bài thi Writing'}
                  </div>
                  <div className="text-[10px] text-red-600">{latestWriting.date || 'Gần đây'}</div>
                </>
              ) : (
                <div className="text-slate-400 italic">Chưa có bài thi</div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveMockTab?.('writing')}
            className="w-full mt-2 py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>{writingBand ? 'Thi 60 Phút' : 'Làm Đề Viết'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4. Speaking */}
        <div className="p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50/80 transition-all space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-900">
              <span className="text-[11px] font-black uppercase tracking-wider flex items-center space-x-1">
                <Mic className="w-3.5 h-3.5 text-emerald-600" />
                <span>Speaking</span>
              </span>
              {speakingBand && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </div>
            <div className="mt-2 text-center py-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                {speakingBand ? speakingBand.toFixed(1) : '--'}
              </span>
            </div>
            <div className="text-[11px] text-center text-emerald-800 space-y-0.5">
              {latestSpeaking ? (
                <>
                  <div className="font-semibold">
                    {latestSpeaking.evaluation?.wpm 
                      ? `Tốc độ: ~${latestSpeaking.evaluation.wpm} WPM` 
                      : '3 Parts Live AI'}
                  </div>
                  <div className="text-[10px] text-emerald-600">{latestSpeaking.date || 'Gần đây'}</div>
                </>
              ) : (
                <div className="text-slate-400 italic">Chưa có bài thi</div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              onClose?.();
              onSelectSkill?.('speaking');
            }}
            className="w-full mt-2 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>{speakingBand ? 'Gặp Giám Khảo' : 'Thi Nói AI'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 5. OVERALL BAND (Cambridge Grand Rounding) */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg border-2 border-amber-300 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-950 flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5 fill-current" />
                <span>OVERALL</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 text-[9px] font-black">
                {cefrEvaluation.level}
              </span>
            </div>
            <div className="mt-2 text-center py-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {calculatedOverallBand ? calculatedOverallBand : '--'}
              </span>
            </div>
            <div className="text-[11px] text-center text-slate-900 font-bold leading-tight">
              {cefrEvaluation.title}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-950/10 text-center text-[10px] text-slate-800 font-medium">
            {validBands.length === 4 ? (
              <span className="text-emerald-950 font-bold flex items-center justify-center space-x-1">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Chứng chỉ hoàn tất</span>
              </span>
            ) : (
              <span>Đạt {validBands.length}/4 kỹ năng</span>
            )}
          </div>
        </div>
      </div>

      {/* Cambridge Formula Explanation & Diagnostics */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Quy chuẩn khảo thí Cambridge Assessment English:</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Điểm Overall = Trung bình cộng (Listening + Reading + Writing + Speaking). Phần thập phân &ge; 0.75 làm tròn lên 1.0; từ 0.25 đến 0.74 làm tròn thành 0.5; nhỏ hơn 0.25 làm tròn xuống số nguyên.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-800 shadow-2xs inline-block">
            {cefrEvaluation.desc}
          </span>
        </div>
      </div>

      {/* TRF Export Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
        <div className="flex items-center space-x-2.5">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm">Xuất Phiếu Điểm Chuẩn Khảo Thí (IELTS TRF)</span>
            <span className="text-slate-400">Xem trước chứng chỉ chính thức, mã bảo mật QR và in / tải file PDF</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTrfModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 cursor-pointer min-h-[40px] shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Xem & Tải Phiếu Điểm (PDF)</span>
        </button>
      </div>

      {/* TRF Simulator Modal */}
      <TRFSimulatorModal
        isOpen={isTrfModalOpen}
        onClose={() => setIsTrfModalOpen(false)}
        trfData={trfData}
      />
    </div>
  );
}
