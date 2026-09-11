import React, { useState } from 'react';
import { 
  Sparkles, 
  Headphones, 
  X, 
  Link as LinkIcon, 
  FileText, 
  HelpCircle, 
  AlertCircle, 
  Play, 
  CheckCircle2, 
  Layers,
  Globe,
  Radio
} from 'lucide-react';
import { generateListeningTestFromAudio } from '../../services/geminiService';

const PRESET_SAMPLE_AUDIOS = [
  {
    title: 'BBC 6-Minute English: Daily Lifestyle & Work Culture',
    url: 'https://dn720904.ca.archive.org/0/items/cambridge-15-ielts-listening-test-1/Cambridge%2015%20IELTS%20Listening%20Test%201.mp3',
    topic: 'British conversation about workplace habits, commuting and sports activities',
    partCount: 4
  },
  {
    title: 'TED Academic Talk: Environmental Science & Ecology',
    url: 'https://archive.org/download/cambridge-15-ielts-listening-test-1/Cambridge%2015%20IELTS%20Listening%20Test%201.mp3',
    topic: 'University lecture on environmental sustainability and ecological conservation',
    partCount: 1
  }
];

export default function ListeningURLExerciseGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model = 'gemini-2.5-flash',
  onTestGenerated,
  onOpenSettings
}) {
  if (!isOpen) return null;

  const [audioUrl, setAudioUrl] = useState('');
  const [fallbackAudioUrl, setFallbackAudioUrl] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [partCount, setPartCount] = useState(4); // 1 or 4
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioTestStatus, setAudioTestStatus] = useState(null); // 'testing' | 'valid' | 'invalid'

  // Test URL reachability
  const handleTestAudioUrl = () => {
    if (!audioUrl.trim()) {
      setErrorMessage('Vui lòng nhập đường dẫn URL tệp âm thanh.');
      return;
    }
    setAudioTestStatus('testing');
    setErrorMessage('');

    const testAudio = new Audio();
    testAudio.src = audioUrl.trim();

    const timer = setTimeout(() => {
      setAudioTestStatus('invalid');
      setErrorMessage('URL phản hồi chậm hoặc không hỗ trợ nghe trực tiếp (CORS). Bạn vẫn có thể tiếp tục nếu chắc chắn link hoạt động.');
    }, 8000);

    testAudio.onloadedmetadata = () => {
      clearTimeout(timer);
      setAudioTestStatus('valid');
      setIsTestingAudio(true);
      testAudio.play().catch(() => {});
      setTimeout(() => {
        testAudio.pause();
        setIsTestingAudio(false);
      }, 4000);
    };

    testAudio.onerror = () => {
      clearTimeout(timer);
      setAudioTestStatus('invalid');
      setErrorMessage('Không thể phát âm thanh từ link này. Vui lòng kiểm tra lại định dạng tệp (hỗ trợ .mp3, .m4a, .ogg) hoặc quyền truy cập.');
    };
  };

  const handleApplyPreset = (preset) => {
    setAudioUrl(preset.url);
    setTestTitle(preset.title);
    setTopicDescription(preset.topic);
    setPartCount(preset.partCount);
    setAudioTestStatus(null);
    setErrorMessage('');
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMessage('Vui lòng cấu hình Gemini API Key trước khi sử dụng AI.');
      return;
    }

    if (!audioUrl.trim()) {
      setErrorMessage('Vui lòng cung cấp link URL âm thanh hội thoại.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const generated = await generateListeningTestFromAudio({
        audioUrl: audioUrl.trim(),
        fallbackAudioUrl: fallbackAudioUrl.trim(),
        testTitle: testTitle.trim() || 'AI Generated IELTS Listening Practice Test',
        topicDescription: topicDescription.trim(),
        transcriptText: transcriptText.trim(),
        partCount,
        apiKey,
        model
      });

      const fullCustomTest = {
        ...generated,
        id: `custom-listening-${Date.now()}`,
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      if (onTestGenerated) {
        onTestGenerated(fullCustomTest);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi khi sinh đề nghe AI:', err);
      setErrorMessage(err.message || 'Lỗi hệ thống khi sinh đề nghe. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-base">
                  Sinh Đề Nghe IELTS Bằng AI Từ URL Ngoại Lai
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
                  Zero-Storage
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Lấy link audio có sẵn trên mạng • AI tự động tạo câu hỏi, timestamps & bằng chứng khảo thí
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Preset Samples */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              💡 Thử nhanh với nguồn âm thanh mẫu:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SAMPLE_AUDIOS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(item)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all cursor-pointer text-xs group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-purple-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.topic}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Audio URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Đường dẫn URL tệp âm thanh (MP3, M4A, OGG):</span>
              </span>
              {audioTestStatus === 'valid' && (
                <span className="text-emerald-600 font-bold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Link nghe tốt!</span>
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => {
                  setAudioUrl(e.target.value);
                  setAudioTestStatus(null);
                }}
                placeholder="https://example.com/audio/ielts_dialogue.mp3"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleTestAudioUrl}
                disabled={audioTestStatus === 'testing'}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                {audioTestStatus === 'testing' ? (
                  <span>Đang test...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Test link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Fallback Audio URL (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Link dự phòng (Fallback URL - Không bắt buộc):
            </label>
            <input
              type="url"
              value={fallbackAudioUrl}
              onChange={(e) => setFallbackAudioUrl(e.target.value)}
              placeholder="Link mirror dự phòng nếu link chính bị lỗi (404/CORS)"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Test Title & Part Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800">Tên bộ đề thi:</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Ví dụ: BBC 6-Minute English: Work Life Balance"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Cấu trúc đề:</label>
              <select
                value={partCount}
                onChange={(e) => setPartCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value={4}>Full Test 4 Parts (40 câu)</option>
                <option value={1}>1 Part Rút Gọn (10 câu)</option>
              </select>
            </div>
          </div>

          {/* Context & Topic */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Bối cảnh & Chủ đề âm thanh:</label>
            <input
              type="text"
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
              placeholder="Ví dụ: Cuộc đàm thoại về đặt phòng khách sạn, giao thông đô thị, nghiên cứu sinh học..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Transcript / Notes (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Nội dung lời thoại (Transcript có sẵn nếu có):</span>
              </label>
              <span className="text-[11px] text-slate-400">Không bắt buộc</span>
            </div>
            <textarea
              rows={4}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Dán toàn bộ lời thoại (nếu có sẵn trên bài viết nguồn). AI sẽ dựa vào đây để tạo câu hỏi cực kỳ chính xác khớp từng giây phát âm thanh..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="hidden sm:inline">Tiết kiệm 100% dung lượng server • Zero-Storage Architecture</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !audioUrl.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Gemini Đang Phân Tích & Sinh Đề...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Đề Thi IELTS Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
