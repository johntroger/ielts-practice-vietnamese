import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  X, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen,
  HelpCircle,
  Globe,
  Lock
} from 'lucide-react';
import { ingestArticleToReadingPassage } from '../../services/geminiService';

export default function ReadingIngestModal({
  isOpen,
  onClose,
  apiKey,
  model,
  onPassageIngested,
  onOpenSettings
}) {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false); // Toggle chia sẻ cộng đồng
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
        if (!customTitle) {
          setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleIngest = async () => {
    if (!apiKey) {
      setErrorMsg('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }
    if (!rawText.trim() || rawText.trim().length < 80) {
      setErrorMsg('Vui lòng dán văn bản bài báo (tối thiểu 80 ký tự).');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const ingestedPassage = await ingestArticleToReadingPassage({
        rawArticleText: rawText,
        customTitle: customTitle.trim(),
        apiKey,
        model
      });

      if (onPassageIngested) {
        onPassageIngested(ingestedPassage, isPublic);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi khi nạp bài báo:', err);
      setErrorMsg(err.message || 'Lỗi khi chuyển đổi bài báo thành đề IELTS bằng AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <FileUp className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Nạp Bài Báo Thô Tạo Đề IELTS Reading</h3>
              <p className="text-[11px] text-purple-200">Copy bài báo từ BBC, Nature, The Economist để AI tự soạn đề</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
          
          {/* Custom Title Input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Tiêu đề bài đọc (tùy chọn):
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="VD: The Future of Renewable Clean Energy in Cities"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800"
            />
          </div>

          {/* Raw Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">
                Dán nội dung bài báo tiếng Anh thô:
              </label>
              <label className="cursor-pointer text-purple-600 hover:text-purple-800 font-bold text-[11px] flex items-center gap-1">
                <FileUp className="w-3.5 h-3.5" />
                <span>Nạp file .txt</span>
                <input 
                  type="file" 
                  accept=".txt,.md" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Dán toàn bộ đoạn văn hoặc bài báo tiếng Anh vào đây. Gemini AI sẽ tự động phân chia đoạn văn A, B, C, D... và biên soạn các câu hỏi trắc nghiệm, True/False/Not Given, trích dẫn bằng chứng và lời giải chi tiết..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800 leading-relaxed"
            />
            <div className="text-[11px] text-slate-400 text-right">
              {rawText.trim().split(/\s+/).filter(Boolean).length} từ đã nhập
            </div>
          </div>

          {/* Quyền riêng tư & Chia sẻ cộng đồng */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-lg ${isPublic ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'}`}>
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
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{errorMsg}</p>
                {!apiKey && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="text-purple-600 underline font-bold"
                  >
                    Mở Cài đặt để nhập API Key
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleIngest}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI đang cấu trúc hóa bài đọc...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Chuyển Đổi Thành Đề Thi</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
