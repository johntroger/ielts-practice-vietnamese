import React, { useState } from 'react';
import { FileUp, Sparkles, CheckCircle2, AlertCircle, X, Loader2, ArrowRight } from 'lucide-react';
import { parseDocumentToTask } from '../services/geminiService';

export default function DocumentIngestModal({ isOpen, onClose, onTaskImported, apiKey, model }) {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setRawText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessDocument = async () => {
    if (!apiKey) {
      setErrorMsg('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }
    if (!rawText.trim() || rawText.trim().length < 30) {
      setErrorMsg('Vui lòng dán nội dung tài liệu (tối thiểu 30 ký tự).');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      const parsedTask = await parseDocumentToTask({
        rawText,
        apiKey,
        model
      });
      onTaskImported(parsedTask);
      alert(`Đã trích xuất thành công: "${parsedTask.title}"! Đề thi đã được thêm vào Thư viện cá nhân của bạn.`);
      setRawText('');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi trích xuất tài liệu bằng AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs">
              <FileUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Nạp Tài Liệu Nhanh Bằng AI (Smart Ingestion)</h2>
              <p className="text-xs text-slate-400">Dán bất kỳ đoạn văn bản thô từ sách Cambridge, file Word hoặc bài giảng của thầy cô</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950">
            <strong className="block font-bold mb-0.5">AI sẽ tự động làm gì?</strong>
            <span>Gemini sẽ tự đọc văn bản của bạn, nhận diện đâu là Đề bài, Task mấy, Dạng bài gì, trích xuất Bài mẫu Band 8.5+ và tạo danh sách Collocations hay mà không cần bạn phải copy/paste thủ công từng ô!</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Dán nội dung hoặc chọn tệp (.txt, .md):</label>
              <label className="cursor-pointer text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1">
                <span>📁 Tải tệp từ máy</span>
                <input
                  type="file"
                  accept=".txt,.md,.doc,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={9}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Dán toàn bộ bài đọc, đề bài hoặc bài mẫu bạn có vào đây (Ví dụ: Cambridge 18 Test 3 Writing Task 2... Some people argue that... Sample Answer: In the contemporary era...)"
              className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Độ dài ký tự: {rawText.length}
            </span>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleProcessDocument}
                disabled={isProcessing || !rawText.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Đang Phân Tích & Phân Loại...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI Trích Xuất & Lưu Đề</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
