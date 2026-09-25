import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  X, 
  Check, 
  Copy, 
  ShieldCheck, 
  FileText, 
  Download,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { printTrfDocument } from '../services/trfExportService';

export default function TRFSimulatorModal({
  isOpen,
  onClose,
  trfData
}) {
  if (!isOpen || !trfData) return null;

  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyValidationCode = () => {
    if (trfData.validationCode) {
      navigator.clipboard.writeText(trfData.validationCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePrint = () => {
    printTrfDocument(trfData);
  };

  const {
    candidateName,
    candidateNumber,
    centreNumber,
    testDate,
    testType,
    scores,
    cefrLevel,
    examinerFeedback,
    validationCode
  } = trfData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Action Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center space-x-1.5">
                <span>IELTS Official Test Report Form (TRF)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/30 text-red-400 font-extrabold uppercase">
                  Simulator
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Phiếu điểm chuẩn khảo thí Cambridge • British Council • IDP
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md min-h-[38px]"
              title="Xuất file hoặc in ấn phiếu điểm PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In / Xuất PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Đóng bảng điểm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Visual representation of TRF) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-slate-900 shadow-md p-5 sm:p-7 relative overflow-hidden">
            
            {/* Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-25deg] text-slate-950 font-black text-5xl sm:text-7xl">
              IELTS OFFICIAL
            </div>

            {/* TRF Top Header */}
            <div className="flex items-start justify-between border-b-2 border-red-600 pb-3 mb-4">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-wider">IELTS</span>
                <span className="block text-[11px] font-semibold text-slate-500">
                  English for International Opportunity
                </span>
              </div>
              <div className="text-right">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase">Test Report Form</h4>
                <span className="text-[11px] font-medium text-slate-500 block">Academic Module Simulator</span>
              </div>
            </div>

            {/* Candidate & Test Centre Meta */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="col-span-2 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold w-24">Thí sinh:</span>
                  <span className="font-bold text-slate-900 truncate">{candidateName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold w-24">Mã thí sinh:</span>
                  <span className="font-mono font-bold text-slate-900">{candidateNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold w-24">Hội đồng thi:</span>
                  <span className="font-medium text-slate-700">{centreNumber} (IDP / BC Test Centre)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold w-24">Ngày thi:</span>
                  <span className="font-medium text-slate-700">{testDate}</span>
                </div>
              </div>

              {/* Photo Box */}
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg bg-slate-100 text-[10px] text-slate-400 p-2 text-center">
                <ShieldCheck className="w-6 h-6 text-slate-400 mb-1" />
                <span>Verified Photo</span>
              </div>
            </div>

            {/* 4 Skills Scores Table */}
            <div className="border border-slate-900 rounded-xl overflow-hidden mb-4 shadow-2xs">
              <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wide flex items-center justify-between">
                <span>Điểm Thi 4 Kỹ Năng & Overall</span>
                <span className="text-red-400 font-extrabold">Quy chuẩn Cambridge</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-200 text-center bg-white">
                <div className="p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Listening</div>
                  <div className="text-lg font-black text-slate-900">{scores.listening.toFixed(1)}</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Reading</div>
                  <div className="text-lg font-black text-slate-900">{scores.reading.toFixed(1)}</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Writing</div>
                  <div className="text-lg font-black text-slate-900">{scores.writing.toFixed(1)}</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Speaking</div>
                  <div className="text-lg font-black text-slate-900">{scores.speaking.toFixed(1)}</div>
                </div>
                <div className="p-3 bg-red-50 col-span-2 sm:col-span-1 border-t sm:border-t-0">
                  <div className="text-[10px] uppercase font-extrabold text-red-700 mb-1">Overall</div>
                  <div className="text-2xl font-black text-red-600">{scores.overall.toFixed(1)}</div>
                </div>
                <div className="p-3 bg-slate-900 text-white col-span-2 sm:col-span-1 border-t sm:border-t-0 flex flex-col justify-center items-center">
                  <div className="text-[10px] uppercase font-bold text-slate-300 mb-0.5">CEFR</div>
                  <div className="text-base font-black px-2 py-0.5 rounded bg-white text-slate-950">{cefrLevel}</div>
                </div>
              </div>
            </div>

            {/* General Assessment Statement */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-5 leading-relaxed italic">
              <strong>Nhận xét chuyên môn từ Hội đồng Giám khảo:</strong> "{examinerFeedback}"
            </div>

            {/* Bottom Security Verification Code & Stamp */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">Mã bảo mật xác thực (Validation Code):</span>
                <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  <span className="font-bold text-slate-800">{validationCode}</span>
                  <button
                    onClick={handleCopyValidationCode}
                    className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                    title="Sao chép mã xác thực"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-400 flex flex-col items-center justify-center text-[9px] font-black text-red-500 uppercase tracking-tighter text-center leading-tight">
                <span>OFFICIAL</span>
                <span>CENTRE</span>
                <span>STAMP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            Phiếu điểm được tính theo chuẩn làm tròn khảo thí Cambridge Assessment English.
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs min-h-[40px]"
            >
              <Printer className="w-4 h-4" />
              <span>In / Xuất PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer min-h-[40px]"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
