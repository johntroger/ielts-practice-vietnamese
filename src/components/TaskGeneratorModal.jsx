import React, { useState } from 'react';
import { Sparkles, BarChart2, FileText, CheckCircle, AlertCircle, X, Loader2, Clock, Globe, Lock } from 'lucide-react';
import { IELTS_TOPICS, TASK1_TYPES, TASK2_TYPES, TIME_FRAME_TYPES } from '../data/topics';
import { generateNewTask } from '../services/geminiService';

export default function TaskGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model,
  user,
  onTaskCreated,
  onOpenSettings
}) {
  if (!isOpen) return null;

  const [taskNumber, setTaskNumber] = useState(2); // 1 or 2
  const [task1Type, setTask1Type] = useState('line');
  const [timeFrame, setTimeFrame] = useState('any'); // any, dynamic, static
  const [task2Type, setTask2Type] = useState('opinion');
  const [selectedTopic, setSelectedTopic] = useState('tech');
  const [isPublic, setIsPublic] = useState(false); // Phương án C: toggle chia sẻ cộng đồng
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMsg('Vui lòng cài đặt Gemini API Key trước khi sinh đề.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    try {
      const topicObj = IELTS_TOPICS.find(t => t.id === selectedTopic);
      const newTask = await generateNewTask({
        taskNumber,
        type: taskNumber === 1 ? task1Type : task2Type,
        timeFrame: taskNumber === 1 ? timeFrame : 'any',
        topic: topicObj?.name || 'General',
        apiKey,
        model
      });

      newTask.isPublic = isPublic;
      newTask.creatorEmail = user?.email || 'Thành viên';
      newTask.isCustom = true;

      onTaskCreated(newTask, isPublic);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi sinh đề từ AI. Vui lòng kiểm tra API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 space-y-4 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Gemini Sinh Đề Mới Tự Động</h3>
              <p className="text-xs text-slate-500">Cập nhật xu hướng thi thật IELTS 2025–2026</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Alert if not configured */}
        {!apiKey && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Chưa cấu hình Gemini API Key.</span>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-red-600 font-bold hover:underline"
            >
              Cài đặt ngay →
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Task Choice (Task 1 vs Task 2) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Chọn phần thi IELTS:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTaskNumber(1)}
              className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                taskNumber === 1
                  ? 'border-blue-500 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <BarChart2 className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-xs block">Task 1 (Report)</span>
                <span className="text-[10px] text-slate-500 block">Sinh số liệu & vẽ biểu đồ sống</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTaskNumber(2)}
              className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                taskNumber === 2
                  ? 'border-red-500 bg-red-50/50 text-red-900 ring-2 ring-red-500/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <span className="font-bold text-xs block">Task 2 (Essay)</span>
                <span className="text-[10px] text-slate-500 block">Đề thi xu hướng 2025–2026</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sub-type Selection */}
        {taskNumber === 1 ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Dạng Đề Task 1 (7 dạng chuẩn Cambridge):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TASK1_TYPES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTask1Type(t.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      task1Type === t.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">{t.label}</span>
                    <span className="block text-[10px] text-slate-400 font-normal truncate">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time-Frame Selection (Dynamic vs Static) */}
            {task1Type !== 'process' && task1Type !== 'map' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <label className="text-xs font-bold text-slate-700">Khung thời gian (Dynamic vs Static):</label>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_FRAME_TYPES.map(tf => (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setTimeFrame(tf.id)}
                      className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                        timeFrame === tf.id
                          ? 'border-blue-500 bg-white font-bold text-blue-900 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className="block font-semibold">{tf.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  {TIME_FRAME_TYPES.find(tf => tf.id === timeFrame)?.desc}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Dạng Bài Luận Task 2:</label>
            <select
              value={task2Type}
              onChange={(e) => setTask2Type(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
            >
              {TASK2_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label} ({t.vi})</option>
              ))}
            </select>
          </div>
        )}

        {/* Topic Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Chủ Đề (Topic Category):</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
          >
            {IELTS_TOPICS.map(t => (
              <option key={t.id} value={t.id}>{t.name} — {t.vi}</option>
            ))}
          </select>
        </div>

        {/* Phương án C: Quyền riêng tư & Chia sẻ cộng đồng */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg ${isPublic ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
              {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {isPublic ? 'Chia sẻ lên Thư viện Cộng đồng' : 'Chỉ lưu riêng tư trong tài khoản của bạn'}
              </div>
              <div className="text-[10px] text-slate-500">
                {isPublic ? 'Mọi người dùng trên web đều có thể xem và luyện tập đề này' : 'Chỉ có bạn mới thấy và làm bài thi này'}
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !apiKey}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Đang Soạn Đề & Vẽ Biểu Đồ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sinh Đề Mới Ngay</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
