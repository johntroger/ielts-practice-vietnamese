import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  X, 
  Loader2, 
  BookOpen, 
  Layers, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Compass,
  Globe,
  Lock
} from 'lucide-react';
import { generateSpeakingPracticeTopic } from '../../services/geminiService';
import { useTranslation } from '../../i18n';

const TRENDING_SUGGESTIONS = [
  'Artificial Intelligence & Future Jobs',
  'Sustainable Tourism & Eco Travel',
  'Mental Well-being & Work-Life Balance',
  'Electric Vehicles & Green Transport',
  'Remote Working & Digital Nomads',
  'Social Media Influencers & Youth Culture',
  'Traditional Craftsmanship in Modern World',
  'Online Education vs Traditional University'
];

export default function SpeakingPracticeTopicModal({
  isOpen,
  onClose,
  part = 1,
  apiKey,
  model,
  existingTopics = [],
  existingQuestions = [],
  onTopicCreated
}) {
  if (!isOpen) return null;

  const { t, isEn } = useTranslation();

  const [mode, setMode] = useState('ai'); // 'ai' | 'manual'
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Sharing & Privacy State: Defaults to true (Public community resource) with user toggle
  const [isPublic, setIsPublic] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // AI Form State
  const [aiTopicInput, setAiTopicInput] = useState('');

  // Manual Form State - Part 1
  const [mP1Title, setMP1Title] = useState('');
  const [mP1Questions, setMP1Questions] = useState(() => [
    { question: '', strategy: isEn ? 'Direct answer + reason (A.R.E.A)' : 'Nêu trực tiếp câu trả lời + lý do (A.R.E.A)' },
    { question: '', strategy: isEn ? 'Detailed explanation with personal example' : 'Giải thích chi tiết kèm ví dụ cá nhân' },
    { question: '', strategy: isEn ? 'Compare past vs present or look ahead' : 'So sánh quá khứ vs hiện tại hoặc nhìn về tương lai' }
  ]);

  // Manual Form State - Part 2
  const [mP2Title, setMP2Title] = useState('');
  const [mP2Prompt, setMP2Prompt] = useState('');
  const [mP2Bullets, setMP2Bullets] = useState([
    'What it is',
    'When and where it occurred',
    'Who was involved',
    'And explain why it was meaningful to you'
  ]);

  // Manual Form State - Part 3
  const [mP3Topic, setMP3Topic] = useState('');
  const [mP3Questions, setMP3Questions] = useState(() => [
    { question: '', analysisType: isEn ? 'Social Impact' : 'Tác động xã hội', strategy: 'Point -> Explanation -> Example -> Link' },
    { question: '', analysisType: isEn ? 'Contrast & Compare' : 'So sánh đối lập', strategy: isEn ? 'Compare two perspectives or demographics' : 'So sánh hai nhóm đối tượng hoặc hai xu hướng' },
    { question: '', analysisType: isEn ? 'Future Projection' : 'Dự đoán tương lai', strategy: isEn ? 'Forecast trends over the next 10-20 years' : 'Dự đoán chiều hướng thay đổi trong 10-20 năm tới' }
  ]);

  // Handle AI Generation
  const handleGenerateAi = async () => {
    const topicToUse = aiTopicInput.trim() || 'Modern Technology & Daily Habits';
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const generated = await generateSpeakingPracticeTopic({
        part,
        topic: topicToUse,
        existingTopics,
        existingQuestions,
        apiKey,
        model
      });

      if (generated) {
        const enriched = {
          ...generated,
          isPublic: Boolean(isPublic),
          isCommunity: Boolean(isPublic),
          isAiGenerated: true,
          creatorEmail: isPublic ? (isEn ? 'IELTS Community' : 'Cộng Đồng IELTS') : (isEn ? 'Me' : 'Tôi')
        };
        onTopicCreated(enriched);
        onClose();
      }
    } catch (err) {
      console.error('Error generating practice topic:', err);
      setErrorMessage(err.message || (isEn ? 'Could not generate topic. Please check API Key and try again.' : 'Không thể sinh chủ đề. Vui lòng kiểm tra API Key và thử lại.'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Manual Save
  const handleSaveManual = () => {
    setErrorMessage('');

    if (part === 1) {
      if (!mP1Title.trim()) {
        setErrorMessage(isEn ? 'Please enter a Part 1 topic title.' : 'Vui lòng nhập tên chủ đề Part 1.');
        return;
      }
      const validQuestions = mP1Questions.filter(q => q.question.trim());
      if (validQuestions.length === 0) {
        setErrorMessage(isEn ? 'Please enter at least 1 question.' : 'Vui lòng nhập ít nhất 1 câu hỏi.');
        return;
      }

      const newTopic = {
        id: `p1-custom-${Date.now()}`,
        title: mP1Title.trim(),
        category: isEn ? 'Custom Topic' : 'Chủ đề tự tạo',
        tag: isEn ? 'Custom' : 'Tự tạo',
        isCustom: true,
        isPublic: Boolean(isPublic),
        isCommunity: Boolean(isPublic),
        isAiGenerated: false,
        creatorEmail: isPublic ? (isEn ? 'IELTS Community' : 'Cộng Đồng IELTS') : (isEn ? 'Me' : 'Tôi'),
        questions: validQuestions.map((q, idx) => ({
          qId: `p1-cust-q-${idx + 1}`,
          question: q.question.trim(),
          focus: isEn ? `Question ${idx + 1}` : `Câu ${idx + 1}`,
          strategy: q.strategy.trim() || 'A.R.E.A Framework',
          vocabHints: [],
          sampleAnswer: ''
        }))
      };

      onTopicCreated(newTopic);
      onClose();
    } else if (part === 2) {
      if (!mP2Title.trim()) {
        setErrorMessage(isEn ? 'Please enter a Part 2 Cue Card title.' : 'Vui lòng nhập tiêu đề Cue Card Part 2.');
        return;
      }
      const newCard = {
        id: `p2-custom-${Date.now()}`,
        title: mP2Title.trim(),
        category: isEn ? 'Custom Cue Card' : 'Cue Card Tự Tạo',
        isCustom: true,
        isPublic: Boolean(isPublic),
        isCommunity: Boolean(isPublic),
        isAiGenerated: false,
        creatorEmail: isPublic ? (isEn ? 'IELTS Community' : 'Cộng Đồng IELTS') : (isEn ? 'Me' : 'Tôi'),
        cueCard: {
          intro: mP2Prompt.trim() || `Describe ${mP2Title.toLowerCase()}. You should say:`,
          bullets: mP2Bullets.filter(b => b.trim())
        },
        mindmapNotes: isEn ? [
          'Branch 1: Context & Core definition',
          'Branch 2: Time, setting & people involved',
          'Branch 3: Detailed chronological events',
          'Branch 4: Emotions & Key takeaway'
        ] : [
          'Ô 1: Bối cảnh & Khái niệm chính',
          'Ô 2: Thời gian, địa điểm & Nhân vật',
          'Ô 3: Diễn biến hành động chi tiết',
          'Ô 4: Cảm xúc & Ý nghĩa cốt lõi'
        ],
        sampleAnswer: ''
      };

      onTopicCreated(newCard);
      onClose();
    } else {
      // Part 3
      if (!mP3Topic.trim()) {
        setErrorMessage(isEn ? 'Please enter a Part 3 discussion topic.' : 'Vui lòng nhập chủ đề thảo luận Part 3.');
        return;
      }
      const validQuestions = mP3Questions.filter(q => q.question.trim());
      if (validQuestions.length === 0) {
        setErrorMessage(isEn ? 'Please enter at least 1 discussion question.' : 'Vui lòng nhập ít nhất 1 câu hỏi thảo luận.');
        return;
      }

      const newSet = {
        linkedPart2Id: `p3-custom-${Date.now()}`,
        topic: mP3Topic.trim(),
        isCustom: true,
        isPublic: Boolean(isPublic),
        isCommunity: Boolean(isPublic),
        isAiGenerated: false,
        creatorEmail: isPublic ? (isEn ? 'IELTS Community' : 'Cộng Đồng IELTS') : (isEn ? 'Me' : 'Tôi'),
        questions: validQuestions.map((q, idx) => ({
          qId: `p3-cust-q-${idx + 1}`,
          question: q.question.trim(),
          analysisType: q.analysisType || (isEn ? 'Deep Discussion' : 'Thảo Luận Sâu'),
          strategy: q.strategy.trim() || 'PEEL Framework',
          sampleAnswer: ''
        }))
      };

      onTopicCreated(newSet);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  {isEn ? `Add Practice Topic • Part ${part}` : `Thêm Chủ Đề Luyện Tập • Part ${part}`}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Speaking Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {part === 1 
                  ? (isEn ? 'A.R.E.A Interview' : 'Phỏng vấn A.R.E.A') 
                  : part === 2 
                    ? (isEn ? '2-Minute Cue Card' : 'Cue Card 2 phút') 
                    : (isEn ? 'PEEL In-Depth Discussion' : 'Thảo luận chuyên sâu PEEL')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-1.5"
            aria-label={isEn ? "Close speaking topic modal" : "Đóng chủ đề speaking"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE SWITCHER TABS */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-center space-x-2 shrink-0">
          <button
            onClick={() => setMode('ai')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'ai'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>{isEn ? 'Generate with AI' : 'Sinh Bằng AI'}</span>
          </button>

          <button
            onClick={() => setMode('manual')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? 'Manual Entry' : 'Tự Nhập Thủ Công'}</span>
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: AI GENERATION */}
          {mode === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-2">
                <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Cambridge Prompt Engine</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isEn 
                    ? 'Enter any topic or keyword you want to practice. AI will automatically generate exam-standard questions, Band 8+ collocations, answering strategies, and model responses.' 
                    : 'Nhập bất kỳ chủ đề hoặc từ khóa nào bạn muốn luyện tập. AI sẽ tự động kiến tạo bộ câu hỏi khảo thí, gợi ý collocations Band 8+, chiến lược trả lời và bài mẫu chuẩn mực.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {isEn ? 'Practice Topic / Keyword (English or Vietnamese):' : 'Chủ Đề Mong Muốn Luyện Tập (Tiếng Anh hoặc Tiếng Việt):'}
                </label>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder={isEn ? "E.g., AI & Robotics, Climate Change, Food Delivery Apps..." : "Ví dụ: AI & Robotics, Climate Change, Food Delivery Apps..."}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  disabled={isGenerating}
                />
              </div>

              {/* Suggestions Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">
                  {isEn ? "Trending topics this season:" : "Gợi ý chủ đề thịnh hành quý này:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => setAiTopicInput(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-900/60 hover:text-purple-200 border border-slate-700 text-[11px] text-slate-300 transition-colors cursor-pointer text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL FORM */}
          {mode === 'manual' && (
            <div className="space-y-4">
              {/* Part 1 Form */}
              {part === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? 'Part 1 Topic Name:' : 'Tên Chủ Đề Part 1:'}
                    </label>
                    <input
                      type="text"
                      value={mP1Title}
                      onChange={(e) => setMP1Title(e.target.value)}
                      placeholder={isEn ? "E.g., Daily Hobbies & Sports" : "Ví dụ: Daily Hobbies & Sports"}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? 'Interview Questions (1 - 3 questions):' : 'Danh Sách Câu Hỏi Phỏng Vấn (1 - 3 câu):'}
                    </label>
                    {mP1Questions.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">
                          {isEn ? `Question ${idx + 1}:` : `Câu hỏi ${idx + 1}:`}
                        </span>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...mP1Questions];
                            updated[idx].question = e.target.value;
                            setMP1Questions(updated);
                          }}
                          placeholder={isEn ? `Enter English question ${idx + 1}...` : `Nhập câu hỏi tiếng Anh ${idx + 1}...`}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={q.strategy}
                          onChange={(e) => {
                            const updated = [...mP1Questions];
                            updated[idx].strategy = e.target.value;
                            setMP1Questions(updated);
                          }}
                          placeholder={isEn ? "Answering tip (e.g., A.R.E.A / personal example)..." : "Mẹo trả lời (ví dụ: A.R.E.A / ví dụ cá nhân)..."}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Part 2 Form */}
              {part === 2 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? 'Part 2 Cue Card Title:' : 'Tiêu Đề Cue Card Part 2:'}
                    </label>
                    <input
                      type="text"
                      value={mP2Title}
                      onChange={(e) => setMP2Title(e.target.value)}
                      placeholder={isEn ? "E.g., A memorable trip with your friends" : "Ví dụ: A memorable trip with your friends"}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? 'Examiner Prompt Intro:' : 'Lời dẫn khảo thí (Prompt intro):'}
                    </label>
                    <input
                      type="text"
                      value={mP2Prompt}
                      onChange={(e) => setMP2Prompt(e.target.value)}
                      placeholder="Describe a memorable trip you took. You should say: ..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? '4 Cue Bullets:' : '4 Gợi Ý Điểm Nói (Cue Bullets):'}
                    </label>
                    {mP2Bullets.map((b, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...mP2Bullets];
                          updated[idx] = e.target.value;
                          setMP2Bullets(updated);
                        }}
                        placeholder={`Bullet ${idx + 1}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Part 3 Form */}
              {part === 3 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? 'Part 3 Discussion Topic:' : 'Chủ Đề Thảo Luận Part 3:'}
                    </label>
                    <input
                      type="text"
                      value={mP3Topic}
                      onChange={(e) => setMP3Topic(e.target.value)}
                      placeholder={isEn ? "E.g., Environmental Sustainability & Government Role" : "Ví dụ: Environmental Sustainability & Government Role"}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      {isEn ? '3 In-Depth Discussion Questions (PEEL Framework):' : '3 Câu Hỏi Thảo Luận Sâu (PEEL Framework):'}
                    </label>
                    {mP3Questions.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-400 uppercase">
                            {isEn ? `Question ${idx + 1}:` : `Câu hỏi ${idx + 1}:`}
                          </span>
                          <input
                            type="text"
                            value={q.analysisType}
                            onChange={(e) => {
                              const updated = [...mP3Questions];
                              updated[idx].analysisType = e.target.value;
                              setMP3Questions(updated);
                            }}
                            placeholder={isEn ? "Analysis type..." : "Dạng phân tích..."}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-purple-300"
                          />
                        </div>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...mP3Questions];
                            updated[idx].question = e.target.value;
                            setMP3Questions(updated);
                          }}
                          placeholder={isEn ? `Enter English discussion question ${idx + 1}...` : `Nhập câu hỏi thảo luận tiếng Anh ${idx + 1}...`}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={q.strategy}
                          onChange={(e) => {
                            const updated = [...mP3Questions];
                            updated[idx].strategy = e.target.value;
                            setMP3Questions(updated);
                          }}
                          placeholder={isEn ? "PEEL tip (Point -> Explanation -> Example -> Link)..." : "Mẹo PEEL (Point -> Explanation -> Example -> Link)..."}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PRIVACY & COMMUNITY SHARING TOGGLE */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-2.5">
            {isPublic ? (
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-bold text-slate-200 block">
                {isPublic ? (isEn ? '🌐 Community Shared' : '🌐 Chia sẻ cộng đồng') : (isEn ? '🔒 Private' : '🔒 Lưu riêng tư')}
              </span>
              <p className="text-[11px] text-slate-400">
                {isPublic
                  ? (isEn 
                      ? 'Automatically shares this topic with the community library so all learners can practice.' 
                      : 'Tự động bổ sung câu hỏi vào tài nguyên chung của web để mọi người cùng luyện tập.')
                  : (isEn 
                      ? 'Saved only on this device (private mode).' 
                      : 'Chỉ lưu trên thiết bị của bạn (tùy chọn không chia sẻ).')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !isPublic;
              setIsPublic(next);
              try { localStorage.setItem('ielts_auto_share_ai_content', JSON.stringify(next)); } catch (e) {}
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer shrink-0 ${
              isPublic
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
            }`}
          >
            {isPublic ? (isEn ? 'Public' : 'Đang công khai') : (isEn ? 'Private' : 'Đang riêng tư')}
          </button>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEn ? 'Cancel' : 'Hủy Bỏ'}
          </button>

          {mode === 'ai' ? (
            <button
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/50 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'AI is Generating Prompt & Questions...' : 'AI Đang Soạn Đề & Câu Hỏi...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? 'Generate Practice Topic (AI)' : 'Sinh Bộ Đề Luyện Tập (AI)'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSaveManual}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-900/50 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEn ? 'Save Topic to Library' : 'Lưu Chủ Đề Vào Danh Sách'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
