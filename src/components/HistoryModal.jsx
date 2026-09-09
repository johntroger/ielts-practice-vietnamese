import React from 'react';
import { History, Award, Trash2, FileDown, Eye, X, Calendar, Clock, BookOpen } from 'lucide-react';
import { exportToWord } from '../services/exportService';

export default function HistoryModal({
  isOpen,
  onClose,
  submissions = [],
  onViewSubmission,
  onDeleteSubmission,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/30">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Lịch Sử Bài Viết & Tiến Bộ</h2>
              <p className="text-xs text-slate-400">Xem lại các bài đã nộp, bảng điểm và nhận xét của giám khảo AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {submissions.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-slate-400 hover:text-red-400 font-medium px-2 py-1 rounded"
              >
                Xóa lịch sử
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {submissions.length > 0 ? (
            submissions.map((sub, idx) => (
              <div 
                key={sub.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sub.task?.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Task {sub.task?.taskNumber || 2}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{sub.date || new Date().toLocaleDateString('vi-VN')}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{sub.stats?.timeSpent || '20m'}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {sub.task?.title || 'Bài tập IELTS'}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1 italic">
                    "{sub.essayText?.slice(0, 120)}..."
                  </p>

                  <div className="text-[11px] text-slate-500 space-x-3">
                    <span>Số từ: <strong>{sub.stats?.wordCount || 0} từ</strong></span>
                    {sub.evaluation?.overallBand && (
                      <span>• Điểm ước tính: <strong className="text-red-600 font-bold">Band {sub.evaluation.overallBand.toFixed(1)}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onViewSubmission(sub);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Xem Bài & Điểm</span>
                  </button>

                  <button
                    onClick={() => exportToWord({
                      task: sub.task,
                      essayText: sub.essayText,
                      evaluation: sub.evaluation,
                      stats: sub.stats
                    })}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Xuất bài ra Word .doc"
                  >
                    <FileDown className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    onClick={() => onDeleteSubmission(sub.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Xóa bài này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Bạn chưa có bài nộp nào. Hãy hoàn thành và nộp một bài viết để lưu lại lịch sử!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
