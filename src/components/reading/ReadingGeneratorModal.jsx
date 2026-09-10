import React, { useState } from 'react';
import { 
  Sparkles, 
  BookMarked, 
  X, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Globe,
  Lock
} from 'lucide-react';
import { generateReadingPassage } from '../../services/geminiService';

const READING_TOPICS = [
  { id: 'tech', label: 'Công nghệ, AI & Tương lai kỹ thuật số', en: 'Technology & AI' },
  { id: 'env', label: 'Môi trường, Sinh thái & Biến đổi khí hậu', en: 'Environment & Climate Change' },
  { id: 'bio', label: 'Sinh học, Động vật hoang dã & Tiến hóa', en: 'Biology & Wildlife' },
  { id: 'hist', label: 'Lịch sử, Khảo cổ & Nền văn minh cổ đại', en: 'History & Archaeology' },
  { id: 'health', label: 'Y học, Sức khỏe cộng đồng & Dinh dưỡng', en: 'Medicine & Public Health' },
  { id: 'econ', label: 'Kinh tế, Thương mại & Toàn cầu hóa', en: 'Economics & Globalization' },
  { id: 'urban', label: 'Kiến trúc & Đô thị tương lai', en: 'Urban Planning & Architecture' },
  { id: 'space', label: 'Thiên văn học & Thám hiểm vũ trụ', en: 'Astronomy & Space Exploration' },
  { id: 'ling', label: 'Ngôn ngữ học & Giao tiếp nhân loại', en: 'Linguistics & Human Communication' }
];

const PASSAGE_OPTIONS = [
  { 
    passageNum: 1, 
    difficulty: 'Easy', 
    label: 'Passage 1 (Band 5.5 - 6.5)', 
    qRange: 'Câu 1 – 13',
    timeGuide: '17–20 phút',
    desc: 'Từ vựng thực tế & khoa học thường thức, câu đơn/ghép, lập luận dễ nắm bắt' 
  },
  { 
    passageNum: 2, 
    difficulty: 'Medium', 
    label: 'Passage 2 (Band 6.5 - 7.5)', 
    qRange: 'Câu 14 – 26',
    timeGuide: '20 phút',
    desc: 'Văn phong học thuật xã hội & công nghệ, câu phức, cấu trúc paraphrase biến hóa' 
  },
  { 
    passageNum: 3, 
    difficulty: 'Hard', 
    label: 'Passage 3 (Band 7.5 - 9.0)', 
    qRange: 'Câu 27 – 40',
    timeGuide: '23 phút',
    desc: 'Chủ đề học thuật trừu tượng, bẫy distractors tinh vi, thuật ngữ chuyên sâu' 
  }
];

export default function ReadingGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model,
  onPassageGenerated,
  onOpenSettings
}) {
  if (!isOpen) return null;

  const [selectedTopic, setSelectedTopic] = useState(READING_TOPICS[0].en);
  const [selectedPassageNum, setSelectedPassageNum] = useState(1);
  const [isPublic, setIsPublic] = useState(false); // Toggle chia sẻ cộng đồng
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedOpt = PASSAGE_OPTIONS.find(p => p.passageNum === selectedPassageNum) || PASSAGE_OPTIONS[0];

  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMsg('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const generatedPassage = await generateReadingPassage({
        topic: selectedTopic,
        difficulty: selectedOpt.difficulty,
        targetPassageNum: selectedPassageNum,
        apiKey,
        model
      });

      if (onPassageGenerated) {
        onPassageGenerated(generatedPassage, isPublic);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi khi sinh đề đọc:', err);
      setErrorMsg(err.message || 'Lỗi khi sinh bài đọc bằng AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Sinh Đề Thi IELTS Reading Bằng AI</h3>
              <p className="text-[11px] text-blue-200">Chuẩn hóa cấu trúc Cambridge Academic với bằng chứng & giải thích</p>
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
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
          
          {/* Topic Select */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              1. Chọn Chủ Đề Học Thuật (12 IELTS Academic Domains):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {READING_TOPICS.map(topic => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.en)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedTopic === topic.en
                      ? 'bg-blue-50 text-blue-900 border-blue-400 ring-2 ring-blue-100 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="leading-snug">{topic.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal mt-1">{topic.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Passage & Difficulty Level Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                2. Chọn Passage Mục Tiêu & Độ Khó (Cambridge Standards):
              </label>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Chuẩn thi thật 3 bài đọc
              </span>
            </div>
            <div className="space-y-2">
              {PASSAGE_OPTIONS.map(opt => (
                <button
                  key={opt.passageNum}
                  type="button"
                  onClick={() => setSelectedPassageNum(opt.passageNum)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                    selectedPassageNum === opt.passageNum
                      ? 'bg-blue-50 text-blue-900 border-blue-400 ring-2 ring-blue-100 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="space-y-1 flex-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        selectedPassageNum === opt.passageNum ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Passage {opt.passageNum}
                      </span>
                      <span className="font-bold text-xs">{opt.label}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({opt.qRange} • Gợi ý: {opt.timeGuide})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal leading-relaxed">
                      {opt.desc}
                    </div>
                  </div>
                  {selectedPassageNum === opt.passageNum && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quyền riêng tư & Chia sẻ cộng đồng */}
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
                    className="text-blue-600 underline font-bold"
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
            disabled={isGenerating}
            onClick={handleGenerate}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini đang soạn bài đọc...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Bắt Đầu Sinh Đề Thi</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
