import React, { useState } from 'react';
import { 
  Sparkles, 
  Mic, 
  X, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Loader2,
  Wand2,
  Target,
  Globe,
  Lock
} from 'lucide-react';
import { generateSpeakingMockPack } from '../../services/geminiService';

const TRENDING_SPEAKING_TOPICS = [
  { id: 'ai-careers', label: 'AI, Tự Động Hóa & Tương Lai Nghề Nghiệp', en: 'Artificial Intelligence, Automation & Future Careers' },
  { id: 'green-living', label: 'Lối Sống Xanh, Tái Chế & Môi Trường Bền Vững', en: 'Sustainable Living, Eco-friendly Habits & Green Innovation' },
  { id: 'remote-nomad', label: 'Làm Việc Từ Xa & Xu Hướng Du Mục Kỹ Thuật Số', en: 'Remote Work, Digital Nomadism & Work-Life Dynamics' },
  { id: 'social-media', label: 'Mạng Xã Hội, Influencers & Sức Khỏe Tinh Thần', en: 'Social Media Culture, Influencers & Psychological Well-being' },
  { id: 'smart-cities', label: 'Đô Thị Thông Minh & Giao Thông Tương Lai', en: 'Smart Cities, Urban Architecture & Future Transportation' },
  { id: 'cultural-heritage', label: 'Bảo Tồn Bản Sắc Văn Hóa Trong Thời Kỳ Toàn Cầu Hóa', en: 'Preserving Cultural Identity & Traditional Arts in Global Era' }
];

const DIFFICULTY_PRESETS = [
  { id: 'standard', label: 'Chuẩn Mực (Band 6.5 - 7.5)', target: '6.5 - 7.5', difficulty: 'Medium', desc: 'Từ vựng C1 vừa phải, câu hỏi phản biện thực tế' },
  { id: 'advanced', label: 'Nâng Cao (Band 7.5 - 8.5+)', target: '7.5 - 8.5', difficulty: 'Medium - Hard', desc: 'Câu hỏi trừu tượng chuyên sâu, bẫy tư duy phản biện cao' }
];

export default function SpeakingGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model,
  onPackGenerated,
  onOpenSettings
}) {
  if (!isOpen) return null;

  const [customTopic, setCustomTopic] = useState(TRENDING_SPEAKING_TOPICS[0].en);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_PRESETS[1]);
  const [isPublic, setIsPublic] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMsg('Vui lòng cài đặt Gemini API Key trong phần Cài đặt trước khi sinh đề.');
      return;
    }

    if (!customTopic.trim()) {
      setErrorMsg('Vui lòng nhập hoặc chọn một chủ đề cho bộ đề thi.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const packData = await generateSpeakingMockPack({
        topic: customTopic.trim(),
        difficulty: selectedDifficulty.difficulty,
        targetBand: selectedDifficulty.target,
        apiKey,
        model
      });

      const newMockPack = {
        id: `mock-spk-custom-${Date.now()}`,
        title: packData.title || `Full Mock Test: ${customTopic}`,
        difficulty: packData.difficulty || selectedDifficulty.difficulty,
        targetBand: packData.targetBand || selectedDifficulty.target,
        estTime: packData.estTime || '11 - 14 phút',
        summary: packData.summary || 'Bộ đề thi thử Speaking do Gemini AI thiết kế riêng theo chuẩn Cambridge.',
        isCustom: true,
        isPublic: Boolean(isPublic),
        createdAt: new Date().toISOString(),
        customPart1: {
          id: `p1-custom-${Date.now()}`,
          title: packData.part1Topic?.title || customTopic,
          category: packData.part1Topic?.category || 'AI Generated Topic',
          tag: 'AI Forecast',
          questions: packData.part1Topic?.questions || []
        },
        customPart2: {
          id: `p2-custom-${Date.now()}`,
          title: packData.part2Card?.title || customTopic,
          category: packData.part2Card?.category || 'AI Generated Cue Card',
          prompt: packData.part2Card?.prompt || '',
          cueBullets: packData.part2Card?.cueBullets || [],
          prepGuide4Quadrants: packData.part2Card?.prepGuide4Quadrants || {},
          vocabHints: packData.part2Card?.vocabHints || [],
          sampleAnswer: packData.part2Card?.sampleAnswer || ''
        },
        customPart3: {
          linkedPart2Id: `p2-custom-${Date.now()}`,
          topic: packData.part3Set?.topic || customTopic,
          questions: packData.part3Set?.questions || []
        }
      };

      if (onPackGenerated) {
        onPackGenerated(newMockPack);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi khi sinh bộ đề Speaking:', err);
      setErrorMsg(err.message || 'Lỗi khi AI sinh bộ đề Speaking. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  Sinh Bộ Đề IELTS Speaking Mới (AI)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Full 3 Parts
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tạo trọn vẹn Part 1 phỏng vấn, Part 2 Cue Card & Part 3 phản biện chuẩn Cambridge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API KEY WARNING IF MISSING */}
        {!apiKey && (
          <div className="m-5 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Chưa cấu hình Gemini API Key. Vui lòng cài đặt để dùng tính năng sinh đề.</span>
            </div>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                Cài đặt ngay
              </button>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-700/50 text-rose-200 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM BODY */}
        <div className="p-5 space-y-5">
          
          {/* 1. TOPIC SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Chủ Đề Thi Thử (Topic)</span>
              <span className="text-[11px] text-purple-400 font-medium">Nhập hoặc chọn gợi ý bên dưới</span>
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="VD: Smart Cities, Social Media, Sustainable Living..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />

            {/* Quick Topic Chips */}
            <div className="pt-1.5 flex flex-wrap gap-1.5">
              {TRENDING_SPEAKING_TOPICS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCustomTopic(item.en)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    customTopic === item.en
                      ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. DIFFICULTY & TARGET BAND */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Mục Tiêu & Độ Khó Của Bộ Đề
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DIFFICULTY_PRESETS.map((preset) => {
                const isSelected = selectedDifficulty.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedDifficulty(preset)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{preset.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{preset.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. GENERATION PREVIEW NOTE */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 font-bold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Bộ đề AI sinh ra sẽ bao gồm đầy đủ:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400 pl-1">
              <li><strong>Part 1:</strong> 3 câu hỏi phỏng vấn thói quen, góc nhìn + gợi ý từ vựng Band 8.5</li>
              <li><strong>Part 2:</strong> 1 Cue Card hoàn chỉnh + 4 ô nháp ma trận 60 giây + bài nói mẫu</li>
              <li><strong>Part 3:</strong> 3 câu hỏi phản biện chuyên sâu gắn kết logic với Part 2</li>
            </ul>
          </div>

          {/* Privacy & Auto-Sharing */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3 pr-2">
              <div className={`p-2 rounded-xl shrink-0 ${isPublic ? 'bg-purple-900/50 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span>{isPublic ? 'Tự động chia sẻ lên Thư viện Cộng đồng' : 'Chỉ lưu riêng tư trong tài khoản'}</span>
                  {isPublic && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">Tài nguyên chung</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  {isPublic 
                    ? 'Bộ câu hỏi Speaking sẽ tự động góp vào kho đề chung cho mọi người cùng luyện. Tắt nếu bạn muốn giữ riêng.' 
                    : 'Chỉ riêng tài khoản của bạn mới thấy và luyện bộ đề này.'}
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !apiKey}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/50 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Đang Thiết Kế Bộ Đề...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Sinh Bộ Đề Ngay</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
