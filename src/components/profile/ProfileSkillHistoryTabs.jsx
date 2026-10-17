import React from 'react';
import {
  History,
  GraduationCap,
  Clock,
  ChevronRight,
  Trash2,
  BookMarked,
  Headphones,
  Mic,
  Zap,
  Sparkles,
  Eye
} from 'lucide-react';

/**
 * Renders the 4 Skill History Tabs (Writing Submissions, Reading History,
 * Listening History, and Speaking Mock Exam Records) inside UserProfileModal.
 */
export default function ProfileSkillHistoryTabs({
  activeTab,
  isEn,
  submissions = [],
  readingHistory = [],
  listeningHistory = [],
  speakingHistory = [],
  readingStats,
  listeningStats,
  speakingStats,
  masteredIds = [],
  onViewSubmission,
  onDeleteSubmission,
  onClearHistory,
  onDeleteReadingSubmission,
  onClearReadingHistory,
  onDeleteListeningSubmission,
  onClearListeningHistory,
  onDeleteSpeakingSubmission,
  onClearSpeakingHistory,
  setSelectedSpeakingSub,
  onClose
}) {
  return (
    <>
      {/* ========================================================================= */}
      {/* TAB: WRITING SUBMISSIONS HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isEn ? 'Writing Submissions & AI Evaluations' : 'Lịch Sử Bài Viết & Chấm Điểm AI'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'All submitted essays and Band 8.0+ Re-write model versions'
                  : 'Tất cả bài viết đã nộp và các phiên bản viết lại Band 8.0+ Re-write'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                {submissions.length} {isEn ? 'saved essays' : 'bài đã lưu'}
              </span>
              {submissions.length > 0 && onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={isEn ? 'Delete all writing history' : 'Xóa toàn bộ lịch sử Writing'}
                >
                  {isEn ? 'Clear all' : 'Xóa tất cả'}
                </button>
              )}
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <History className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{isEn ? 'No submissions yet' : 'Chưa có bài nộp nào'}</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isEn
                  ? 'After completing an essay and clicking "Submit & AI Grade", your essay and examiner feedback will automatically appear here.'
                  : 'Sau khi bạn hoàn thành bài luận và nhấn "Nộp Bài & Chấm Điểm AI", bài viết và nhận xét của giám khảo sẽ tự động lưu trữ tại đây.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          sub.task?.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        Task {sub.task?.taskNumber || 2}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {sub.task?.title || 'IELTS Writing Essay'}
                      </span>
                      {masteredIds.includes(sub.task?.id) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-1 shadow-2xs">
                          <GraduationCap className="w-3 h-3 text-emerald-700" />
                          <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {sub.essayText || (isEn ? 'Essay contents...' : 'Nội dung bài viết...')}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{sub.date || (isEn ? 'Recent' : 'Gần đây')}</span>
                      </span>
                      <span>•</span>
                      <span>
                        {sub.stats?.wordCount || 0} {isEn ? 'words' : 'từ'}
                      </span>
                      <span>•</span>
                      <span>
                        {isEn ? 'Time:' : 'Thời gian:'} {sub.stats?.timeSpent || (isEn ? 'Untimed' : 'Không tính giờ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    {sub.evaluation?.overallBand && (
                      <div className="text-center px-3 py-1.5 rounded-xl bg-red-50 border border-red-200">
                        <span className="text-[10px] text-red-600 block uppercase font-bold">Overall</span>
                        <span className="text-base font-black text-red-700">Band {sub.evaluation.overallBand}</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onViewSubmission?.(sub);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <span>{isEn ? 'View AI Review' : 'Xem Nhận Xét AI'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {onDeleteSubmission && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              isEn
                                ? `Are you sure you want to delete essay "${sub.task?.title || 'IELTS Writing'}" from history?`
                                : `Bạn có chắc muốn xóa bài viết "${sub.task?.title || 'IELTS Writing'}" khỏi lịch sử?`
                            )
                          ) {
                            onDeleteSubmission(sub.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title={isEn ? 'Delete this essay' : 'Xóa bài viết này'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: READING SUBMISSIONS & STATS */}
      {/* ========================================================================= */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isEn ? 'IELTS Reading Official Test Log & Analytics' : 'Lịch Sử Làm Đề & Phân Tích IELTS Reading'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'Cambridge official 3 Passages 40 Questions test records and estimated Reading Band'
                  : 'Kết quả làm đề 3 Passages 40 câu chuẩn Cambridge và dự phóng Band điểm Reading'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                {readingHistory.length} {isEn ? 'tests completed' : 'bài thi đã làm'}
              </span>
              {readingHistory.length > 0 && onClearReadingHistory && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        isEn
                          ? 'Are you sure you want to delete all Reading history?'
                          : 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi Reading?'
                      )
                    ) {
                      onClearReadingHistory();
                    }
                  }}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={isEn ? 'Clear all Reading history' : 'Xóa toàn bộ lịch sử Reading'}
                >
                  {isEn ? 'Clear all' : 'Xóa tất cả'}
                </button>
              )}
            </div>
          </div>

          {readingHistory.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Avg Reading Band' : 'Reading Band TB'}</span>
                <div className="text-xl font-black text-emerald-600 mt-0.5">Band {readingStats.avgBand}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Total Correct' : 'Tổng Câu Đúng'}</span>
                <div className="text-xl font-black text-slate-800 mt-0.5">
                  {readingStats.totalCorrect} <span className="text-xs font-normal text-slate-400">{isEn ? 'questions' : 'câu'}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Avg Accuracy' : 'Độ Chính Xác TB'}</span>
                <div className="text-xl font-black text-blue-600 mt-0.5">{readingStats.avgAccuracy}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Completed Tests' : 'Đề Đã Hoàn Thành'}</span>
                <div className="text-xl font-black text-purple-600 mt-0.5">
                  {readingStats.totalTests} <span className="text-xs font-normal text-slate-400">{isEn ? 'tests' : 'đề thi'}</span>
                </div>
              </div>
            </div>
          )}

          {readingHistory.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookMarked className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{isEn ? 'No Reading tests taken yet' : 'Chưa có bài thi Reading nào'}</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isEn ? (
                  <>
                    Switch to <strong>IELTS Reading Studio</strong> on the navigation menu to practice Cambridge 3-passage 60-minute mock tests with detailed AI explanations!
                  </>
                ) : (
                  <>
                    Hãy chuyển sang phân hệ <strong>IELTS Reading Studio</strong> trên thanh điều hướng kỹ năng để bắt đầu luyện đề 3 bài đọc chuẩn thi thật 60 phút và nhận giải thích chi tiết AI!
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {readingHistory.map((rec, idx) => (
                <div
                  key={rec.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        Reading Test
                      </span>
                      <span className="text-xs font-bold text-slate-800">{rec.testTitle || 'IELTS Reading Academic Test'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{rec.submittedAt || (isEn ? 'Recent' : 'Gần đây')}</span>
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {isEn ? 'Correct:' : 'Số câu đúng:'} <strong className="text-slate-800">{rec.correctCount}/{rec.totalQuestions || 40}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {isEn ? 'Accuracy:' : 'Độ chính xác:'} <strong className="text-emerald-700">{rec.accuracyPercent}%</strong>
                      </span>
                      {rec.timeSpentSeconds > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {isEn ? 'Time:' : 'Thời gian:'} {Math.floor(rec.timeSpentSeconds / 60)} {isEn ? 'mins' : 'phút'} {rec.timeSpentSeconds % 60} {isEn ? 'secs' : 'giây'}
                          </span>
                        </>
                      )}
                    </div>

                    {rec.passageStats && (
                      <div className="flex items-center space-x-2 pt-2">
                        {rec.passageStats.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            Passage {p.passageNumber}: {p.correct}/{p.total}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                    <div className="text-center px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] text-emerald-600 block uppercase font-bold">Estimated</span>
                      <span className="text-lg font-black text-emerald-700">Band {rec.band}</span>
                    </div>

                    {onDeleteReadingSubmission && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              isEn
                                ? `Are you sure you want to delete test "${rec.testTitle || 'IELTS Reading'}" from history?`
                                : `Bạn có chắc muốn xóa bài thi "${rec.testTitle || 'IELTS Reading'}" khỏi lịch sử?`
                            )
                          ) {
                            onDeleteReadingSubmission(rec.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title={isEn ? 'Delete this test' : 'Xóa bài thi này'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: LISTENING STUDIO HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'listening' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isEn ? 'IELTS Listening Test Log & Audioscript Analytics' : 'Lịch Sử Làm Đề & Thống Kê IELTS Listening'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'Full 4-section listening practice tests with native audio & transcripts'
                  : 'Các bài thi nghe mô phỏng 4 Sections thi thật với audio giọng bản xứ & transcript chi tiết'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                {listeningHistory.length} {isEn ? 'Tests' : 'Bài thi'}
              </span>
              {listeningHistory.length > 0 && onClearListeningHistory && (
                <button
                  onClick={onClearListeningHistory}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={isEn ? 'Clear all Listening history' : 'Xóa toàn bộ lịch sử Listening'}
                >
                  {isEn ? 'Clear all' : 'Xóa tất cả'}
                </button>
              )}
            </div>
          </div>

          {listeningHistory.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Avg Listening Band' : 'Listening Band TB'}</span>
                <div className="text-xl font-black text-amber-600 mt-0.5">
                  {listeningStats.avgBand > 0 ? `Band ${listeningStats.avgBand}` : '--'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Total Correct' : 'Tổng Câu Đúng'}</span>
                <div className="text-xl font-black text-slate-800 mt-0.5">
                  {listeningStats.totalCorrect} <span className="text-xs font-normal text-slate-400">{isEn ? 'questions' : 'câu'}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Avg Accuracy' : 'Độ Chính Xác TB'}</span>
                <div className="text-xl font-black text-blue-600 mt-0.5">{listeningStats.avgAccuracy}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Completed Tests' : 'Đề Đã Hoàn Thành'}</span>
                <div className="text-xl font-black text-purple-600 mt-0.5">
                  {listeningStats.totalTests} <span className="text-xs font-normal text-slate-400">{isEn ? 'tests' : 'đề thi'}</span>
                </div>
              </div>
            </div>
          )}

          {listeningHistory.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{isEn ? 'No Listening tests taken yet' : 'Chưa có bài thi Listening nào'}</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isEn ? (
                  <>
                    Switch to <strong>IELTS Listening Studio</strong> on the navigation menu to practice Cambridge 4-section tests with real exam audio and AI explanations!
                  </>
                ) : (
                  <>
                    Hãy chuyển sang phân hệ <strong>IELTS Listening Studio</strong> trên thanh điều hướng kỹ năng để bắt đầu luyện đề 4 Sections với audio chuẩn thi thật và giải thích chi tiết AI!
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {listeningHistory.map((rec, idx) => (
                <div
                  key={rec.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                        Listening Test
                      </span>
                      <span className="text-xs font-bold text-slate-800">{rec.testTitle || 'IELTS Listening Practice Test'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {rec.submittedAt
                            ? isEn
                              ? new Date(rec.submittedAt).toLocaleDateString('en-US')
                              : new Date(rec.submittedAt).toLocaleDateString('vi-VN')
                            : isEn
                            ? 'Recent'
                            : 'Gần đây'}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {isEn ? 'Correct:' : 'Số câu đúng:'} <strong className="text-slate-800">{rec.correctCount}/{rec.totalQuestions || 40}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {isEn ? 'Accuracy:' : 'Độ chính xác:'} <strong className="text-amber-700">{rec.accuracyPercent}%</strong>
                      </span>
                      {rec.timeSpentSeconds > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {isEn ? 'Time:' : 'Thời gian:'} {Math.floor(rec.timeSpentSeconds / 60)} {isEn ? 'mins' : 'phút'} {rec.timeSpentSeconds % 60} {isEn ? 'secs' : 'giây'}
                          </span>
                        </>
                      )}
                    </div>

                    {rec.sectionStats && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {rec.sectionStats.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            Part {s.sectionNumber || s.partNumber || sIdx + 1}: {s.correct}/{s.total}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                    <div className="text-center px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] text-amber-600 block uppercase font-bold">Estimated</span>
                      <span className="text-lg font-black text-amber-700">Band {rec.band}</span>
                    </div>

                    {onDeleteListeningSubmission && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              isEn
                                ? `Are you sure you want to delete test "${rec.testTitle || 'IELTS Listening'}" from history?`
                                : `Bạn có chắc muốn xóa bài thi "${rec.testTitle || 'IELTS Listening'}" khỏi lịch sử?`
                            )
                          ) {
                            onDeleteListeningSubmission(rec.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title={isEn ? 'Delete this test' : 'Xóa bài thi này'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SPEAKING STUDIO HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'speaking' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isEn ? 'IELTS Speaking Examiner Mock Test Records & Diagnostic' : 'Lịch Sử Thi Thử IELTS Speaking & Báo Cáo Chẩn Đoán'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? '1-on-1 interview mock tests with native Cambridge AI examiner across 3 Parts with 4-criteria rubric breakdown'
                  : 'Các buổi thi phỏng vấn 1-1 với Giám khảo AI bản ngữ chuẩn Cambridge 3 Parts kèm phân tích 4 tiêu chí'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                {speakingHistory.length} {isEn ? 'Mock tests' : 'Buổi thi'}
              </span>
              {speakingHistory.length > 0 && onClearSpeakingHistory && (
                <button
                  onClick={onClearSpeakingHistory}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={isEn ? 'Clear all Speaking history' : 'Xóa toàn bộ lịch sử Speaking'}
                >
                  {isEn ? 'Clear all' : 'Xóa tất cả'}
                </button>
              )}
            </div>
          </div>

          {speakingHistory.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Avg Speaking Band' : 'Speaking Band TB'}</span>
                <div className="text-xl font-black text-purple-600 mt-0.5">
                  {speakingStats.avgBand > 0 ? `Band ${speakingStats.avgBand}` : '--'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Total Tests Taken' : 'Tổng Số Lượt Thi'}</span>
                <div className="text-xl font-black text-slate-800 mt-0.5">
                  {speakingStats.totalTests} <span className="text-xs font-normal text-slate-400">{isEn ? 'tests' : 'buổi'}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Speaking Speed (WPM)' : 'Tốc Độ Nói (WPM)'}</span>
                <div className="text-xl font-black text-blue-600 mt-0.5">
                  {speakingStats.avgWpm > 0 ? `${speakingStats.avgWpm}` : '--'} <span className="text-xs font-normal text-slate-400">wpm</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{isEn ? 'Avg Filler Words' : 'Từ Đệm TB (Filler)'}</span>
                <div className="text-xl font-black text-amber-600 mt-0.5">
                  {speakingStats.avgFillerCount !== undefined ? `${speakingStats.avgFillerCount}` : '--'}{' '}
                  <span className="text-xs font-normal text-slate-400">{isEn ? 'words/test' : 'từ/buổi'}</span>
                </div>
              </div>
            </div>
          )}

          {speakingHistory.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{isEn ? 'No Speaking mock tests taken yet' : 'Chưa có bài thi Speaking nào'}</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isEn ? (
                  <>
                    Switch to <strong>IELTS Speaking Studio</strong> on the navigation menu to enter the virtual exam room for real-time dialogue with the AI examiner!
                  </>
                ) : (
                  <>
                    Hãy chuyển sang phân hệ <strong>IELTS Speaking Studio</strong> trên thanh điều hướng kỹ năng để bước vào phòng thi ảo đối thoại trực tiếp cùng Giám khảo AI chuẩn khảo thí!
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {speakingHistory.map((rec, idx) => {
                const evalData = rec.evaluation || {};
                const criteriaData = evalData.criteria || {};
                return (
                  <div
                    key={rec.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                          BAND {evalData.overallBand ? Number(evalData.overallBand).toFixed(1) : '6.0'}
                        </span>
                        {evalData.evaluationMethod === 'algorithmic' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                            <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500 inline" />
                            <span>{isEn ? 'Algorithmic (0.02ms)' : 'Máy Chấm (0.02ms)'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                            <Sparkles className="w-2.5 h-2.5 text-purple-500 inline" />
                            <span>{isEn ? 'AI Examiner' : 'AI Chấm'}</span>
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-800">
                          {rec.mockPack?.title || (isEn ? 'IELTS Speaking Mock Test' : 'Buổi thi thử IELTS Speaking')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {rec.submittedAt
                              ? isEn
                                ? new Date(rec.submittedAt).toLocaleDateString('en-US')
                                : new Date(rec.submittedAt).toLocaleDateString('vi-VN')
                              : isEn
                              ? 'Recent'
                              : 'Gần đây'}
                          </span>
                        </span>
                        {rec.durationSec && (
                          <>
                            <span>•</span>
                            <span>
                              {isEn ? 'Duration:' : 'Thời gian:'} {Math.round(rec.durationSec / 60)} {isEn ? 'mins' : 'phút'}
                            </span>
                          </>
                        )}
                        {rec.examiner?.name && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-slate-700">
                              {isEn ? 'Examiner:' : 'Giám khảo:'} {rec.examiner.name} ({rec.examiner.accent})
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-100">
                          FC: {criteriaData.fc?.band || '6.0'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-100">
                          LR: {criteriaData.lr?.band || '6.0'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-100">
                          GRA: {criteriaData.gra?.band || '6.0'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100">
                          PR: {criteriaData.pr?.band || '6.0'}
                        </span>
                        {evalData.wpm > 0 && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                            {evalData.wpm} WPM
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedSpeakingSub(rec)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-purple-200"
                        title={isEn ? 'View detailed diagnostic report' : 'Xem lại báo cáo chẩn đoán điểm chi tiết'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isEn ? 'View Report' : 'Xem Báo Cáo'}</span>
                      </button>

                      {onDeleteSpeakingSubmission && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                isEn
                                  ? 'Are you sure you want to delete this Speaking test from history?'
                                  : 'Bạn có chắc muốn xóa bài thi Speaking này khỏi lịch sử?'
                              )
                            ) {
                              onDeleteSpeakingSubmission(rec.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title={isEn ? 'Delete this test' : 'Xóa bài thi này'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
