import React, { useState } from 'react';
import { 
  BookMarked, 
  Clock, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Highlighter, 
  FileText, 
  HelpCircle,
  Maximize2,
  Minimize2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function ReadingWorkspace({
  apiKey,
  onOpenSettings,
  user
}) {
  const [selectedPassage, setSelectedPassage] = useState(1);
  const [examMode, setExamMode] = useState('practice'); // 'exam' | 'practice'

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* 1. Reading Sub-header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        
        {/* Left: Skill Badge & Passage Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200">
            <BookMarked className="w-3.5 h-3.5 text-blue-600" />
            <span>IELTS Academic Reading</span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => setSelectedPassage(num)}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                  selectedPassage === num 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Passage {num}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Mode & Timer Indicators */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <div className="flex items-center space-x-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Tổng thời gian:</span>
            <span className="font-bold">60:00 (40 câu)</span>
          </div>

          <button
            onClick={() => setExamMode(prev => prev === 'exam' ? 'practice' : 'exam')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
              examMode === 'exam'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {examMode === 'exam' ? '🛡️ Chế độ Thi Thử' : '📗 Chế độ Luyện Tập'}
          </button>
        </div>
      </div>

      {/* 2. Workspace Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-xl w-full p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
            <BookMarked className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900">Không Gian Luyện Thi IELTS Reading</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bạn đã chuyển đổi thành công sang phân hệ <b>IELTS Reading Studio</b>!
            </p>
          </div>

          {/* Checklist Milestone */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tiến độ triển khai IELTS Reading:</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bước 1: Khởi tạo Kiến trúc Module & Chuyển đổi Kỹ năng (Đang hoàn thành)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 p-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 ml-1 mr-2" />
                <span>Bước 2: Cấu trúc Dữ liệu Đề thi Reading & 40 câu hỏi mẫu chuẩn Cambridge</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 p-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 ml-1 mr-2" />
                <span>Bước 3: Giao diện chia đôi màn hình (Split-Screen) & 14 dạng câu hỏi</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 p-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 ml-1 mr-2" />
                <span>Bước 4: Đồng hồ 60 phút & Bộ chấm điểm tự động chuyển đổi Band Score</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Dữ liệu bài làm bên phân hệ <b>IELTS Writing</b> vẫn được bảo toàn nguyên vẹn 100%. Bạn có thể chuyển qua lại bất kỳ lúc nào trên Menu góc trái.
          </div>
        </div>
      </div>
    </div>
  );
}
