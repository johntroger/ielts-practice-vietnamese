import React, { useState } from 'react';
import { 
  History, 
  Award, 
  Trash2, 
  FileDown, 
  Eye, 
  X, 
  Calendar, 
  Clock, 
  BookOpen,
  FileText,
  BookMarked,
  CheckCircle2,
  Headphones,
  Mic,
  Volume2
} from 'lucide-react';
import { exportToWord } from '../services/exportService';

export default function HistoryModal({
  isOpen,
  onClose,
  submissions = [],
  readingHistory = [],
  listeningHistory = [],
  speakingHistory = [],
  onViewSubmission,
  onDeleteSubmission,
  onClearHistory,
  onDeleteReadingSubmission,
  onClearReadingHistory,
  onDeleteListeningSubmission,
  onClearListeningHistory,
  onDeleteSpeakingSubmission,
  onClearSpeakingHistory,
  onClearAllHistory,
  onViewSpeakingSubmission,
  activeSkill = 'writing'
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(() => {
    if (activeSkill === 'reading') return 'reading';
    if (activeSkill === 'listening') return 'listening';
    if (activeSkill === 'speaking') return 'speaking';
    return 'writing';
  });

  const totalAllHistoryCount = submissions.length + readingHistory.length + listeningHistory.length + speakingHistory.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs shrink-0">
              <History className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold truncate">Lịch Sử Bài Làm 4 Kỹ Năng</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase shrink-0">
                  {totalAllHistoryCount} bài đã lưu
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">Writing, Reading, Listening & Speaking</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            {activeTab === 'writing' && submissions.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xóa toàn bộ bài nộp Writing"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Writing ({submissions.length})</span>
              </button>
            )}
            {activeTab === 'reading' && readingHistory.length > 0 && (
              <button
                onClick={onClearReadingHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xóa toàn bộ bài thi Reading"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Reading ({readingHistory.length})</span>
              </button>
            )}
            {activeTab === 'listening' && listeningHistory.length > 0 && (
              <button
                onClick={onClearListeningHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xóa toàn bộ bài thi Listening"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Listening ({listeningHistory.length})</span>
              </button>
            )}
            {activeTab === 'speaking' && speakingHistory.length > 0 && (
              <button
                onClick={onClearSpeakingHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xóa toàn bộ bài thi Speaking"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Speaking ({speakingHistory.length})</span>
              </button>
            )}
            {totalAllHistoryCount > 0 && onClearAllHistory && (
              <button
                onClick={onClearAllHistory}
                className="hidden lg:flex items-center space-x-1 text-[11px] sm:text-xs text-slate-400 hover:text-rose-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xóa sạch toàn bộ lịch sử của cả 4 kỹ năng"
              >
                <span>Xóa sạch 4 kỹ năng ({totalAllHistoryCount})</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher (4 Skills) */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-5 py-2.5 flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('writing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'writing'
                ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>✍️ Writing ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reading')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'reading'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Reading ({readingHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('listening')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'listening'
                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>🎧 Listening ({listeningHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('speaking')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'speaking'
                ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>🎙️ Speaking ({speakingHistory.length})</span>
          </button>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          
          {/* TAB 1: WRITING HISTORY */}
          {activeTab === 'writing' && (
            submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {submissions.map((sub, idx) => (
                  <div 
                    key={sub.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
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

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {sub.task?.title || 'Bài tập IELTS Writing'}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 italic">
                        "{sub.essayText?.slice(0, 120)}..."
                      </p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                        <span>{sub.stats?.wordCount || 0} từ</span>
                        {sub.evaluation?.overallBand && (
                          <span>• <strong className="text-red-600 font-bold">Band {sub.evaluation.overallBand.toFixed(1)}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => exportToWord({
                            task: sub.task,
                            essayText: sub.essayText,
                            evaluation: sub.evaluation,
                            stats: sub.stats
                          })}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Xuất bài ra Word .doc"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này khỏi lịch sử?')) {
                              onDeleteSubmission?.(sub.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa bài này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onViewSubmission(sub);
                          onClose();
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem Điểm</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Bạn chưa có bài nộp Writing nào. Hãy hoàn thành và nộp một bài viết để lưu lại lịch sử!</p>
              </div>
            )
          )}

          {/* TAB 2: READING HISTORY */}
          {activeTab === 'reading' && (
            readingHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {readingHistory.map((rec, idx) => (
                  <div 
                    key={rec.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          BAND {rec.band ? Number(rec.band).toFixed(1) : '5.0'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{rec.submittedAt || new Date().toLocaleDateString('vi-VN')}</span>
                        </span>
                        {rec.timeSpentSeconds && (
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(rec.timeSpentSeconds / 60)}p {rec.timeSpentSeconds % 60}s</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {rec.testTitle || 'Bài thi IELTS Reading'}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{rec.correctCount}/{rec.totalQuestions} câu đúng</span>
                        </span>
                        <span>• Độ chính xác: <strong>{rec.accuracyPercent || Math.round((rec.correctCount / rec.totalQuestions) * 100)}%</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa kết quả bài thi Reading này khỏi lịch sử?')) {
                            onDeleteReadingSubmission?.(rec.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa bài thi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Bạn chưa có bài thi Reading nào. Hãy hoàn thành và nộp một bài đọc để lưu lại lịch sử!</p>
              </div>
            )
          )}

          {/* TAB 3: LISTENING HISTORY */}
          {activeTab === 'listening' && (
            listeningHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {listeningHistory.map((rec, idx) => (
                  <div 
                    key={rec.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          BAND {rec.band ? Number(rec.band).toFixed(1) : '5.0'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString('vi-VN') : 'Gần đây'}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {rec.testTitle || 'Bài thi IELTS Listening'}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{rec.correctCount}/{rec.totalQuestions} câu đúng</span>
                        </span>
                        <span>• Độ chính xác: <strong>{rec.resultData?.accuracyPercent || Math.round(((rec.correctCount || 0) / (rec.totalQuestions || 40)) * 100)}%</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa kết quả bài thi Listening này khỏi lịch sử?')) {
                            onDeleteListeningSubmission?.(rec.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa bài thi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <Headphones className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Bạn chưa có bài thi Listening nào. Hãy hoàn thành và nộp một bài nghe để lưu lại lịch sử!</p>
              </div>
            )
          )}

          {/* TAB 4: SPEAKING HISTORY */}
          {activeTab === 'speaking' && (
            speakingHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {speakingHistory.map((rec, idx) => {
                  const evalData = rec.evaluation || {};
                  const criteriaData = evalData.criteria || {};
                  return (
                    <div 
                      key={rec.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                            BAND {evalData.overallBand ? Number(evalData.overallBand).toFixed(1) : '6.0'}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString('vi-VN') : 'Gần đây'}</span>
                          </span>
                          {rec.durationSec && (
                            <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{Math.round(rec.durationSec / 60)}p</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {rec.mockPack?.title || 'Buổi thi thử IELTS Speaking'}
                        </h4>

                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                            FC: {criteriaData.fc?.band || '6.0'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                            LR: {criteriaData.lr?.band || '6.0'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                            GRA: {criteriaData.gra?.band || '6.0'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            PR: {criteriaData.pr?.band || '6.0'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa kết quả bài thi Speaking này khỏi lịch sử?')) {
                              onDeleteSpeakingSubmission?.(rec.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa bài thi này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {onViewSpeakingSubmission && (
                          <button
                            onClick={() => onViewSpeakingSubmission(rec)}
                            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                            title="Xem lại báo cáo đánh giá chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Báo Cáo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <Mic className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Bạn chưa có bài thi Speaking nào. Hãy hoàn thành và nộp một bài nói để lưu lại lịch sử!</p>
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
}
