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
  Lock,
  PenTool,
  Plus,
  Trash2,
  BookOpen,
  FileText
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

const QUICK_SPEAKING_PACK_TEMPLATES = [
  {
    name: '🌿 Lối Sống Xanh & Bảo Tồn Môi Trường',
    title: 'Full Mock Test: Eco-friendly Habits & Urban Greenery',
    summary: 'Bộ đề thi chuẩn Cambridge kiểm tra vốn từ học thuật về bảo tồn thiên nhiên và biến đổi khí hậu.',
    targetBand: '7.5 - 8.5',
    difficulty: 'Medium - Hard',
    p1Title: 'Recycling and Waste Sorting',
    p1Category: 'Environment & Daily Habits',
    p1Questions: [
      'Do you recycle plastic bottles or paper at home?',
      'Did your school teach you about recycling when you were a child?',
      'What can municipal governments do to encourage people to sort household waste?'
    ],
    p2Title: 'Describe an environmental project or event you participated in',
    p2Prompt: 'You should say:\n- What the event or project was\n- Where and when it occurred\n- What specific activities you carried out\n- And explain how you felt about your contribution to the environment.',
    p2Bullets: [
      'What the event or project was',
      'Where and when it occurred',
      'What specific activities you carried out',
      'And explain how you felt about your contribution'
    ],
    p2VocabHints: 'biodegradable, carbon footprint, sustainability, grassroots initiative, civic responsibility',
    p2SampleAnswer: 'I would like to describe a community tree-planting drive that I took part in last spring in my local district. The initiative was spearheaded by an environmental youth coalition aimed at rehabilitating an urban buffer zone. Over the weekend, dozens of volunteers gathered to plant native saplings and install drip irrigation systems. Participating in this project gave me a profound sense of civic responsibility and illustrated how small grassroots initiatives can tangibly offset urban carbon emissions.',
    p3Topic: 'Environmental Responsibility and Global Policy',
    p3Questions: [
      'Should individuals or multinational corporations bear the greatest burden for combating pollution?',
      'How effective are monetary fines in stopping industrial enterprises from dumping untreated wastewater?',
      'Do you believe international climate summits produce tangible results or mere political rhetoric?'
    ]
  },
  {
    name: '🤖 Trí Tuệ Nhân Tạo & Thế Giới Việc Làm',
    title: 'Full Mock Test: Artificial Intelligence & Workforce Automation',
    summary: 'Bộ đề phản biện sâu về tác động của công nghệ tự động hóa lên các ngành nghề tương lai.',
    targetBand: '7.5 - 8.5',
    difficulty: 'Medium - Hard',
    p1Title: 'Technology in Routine Work',
    p1Category: 'Technology & Education',
    p1Questions: [
      'What technological device do you rely on most in your daily study or work?',
      'Do you think modern gadgets have made people more or less productive?',
      'Would you like to learn more about computer programming in the future?'
    ],
    p2Title: 'Describe an artificial intelligence tool or app that you find useful',
    p2Prompt: 'You should say:\n- What tool or application it is\n- How you discovered it\n- What tasks you use it for\n- And explain why you consider it advantageous or indispensable.',
    p2Bullets: [
      'What tool or application it is',
      'How you discovered it',
      'What tasks you use it for',
      'And explain why you consider it advantageous or indispensable'
    ],
    p2VocabHints: 'algorithmic efficiency, generative AI, streamlined workflow, productivity catalyst, cognitive load',
    p2SampleAnswer: 'I would like to talk about an AI-powered writing and research assistant that I incorporated into my daily academic workflow. I first encountered this software via a recommendation from an academic advisor. It assists me in synthesizing complex literature reviews, proofreading grammar nuances, and organizing structured outlines. By handling repetitive syntactic tasks, it frees up cognitive capacity, allowing me to focus on high-level analytical reasoning.',
    p3Topic: 'Artificial Intelligence and Society',
    p3Questions: [
      'Which professional sectors are most susceptible to technological displacement in the coming decade?',
      'Can computer algorithms truly replicate human empathy in healthcare and psychological counseling?',
      'What ethical guidelines should international governing bodies enforce on autonomous technologies?'
    ]
  }
];

export default function SpeakingGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model,
  onPackGenerated,
  onOpenSettings,
  initialMode = 'ai'
}) {
  if (!isOpen) return null;

  // Mode Switcher: 'ai' | 'manual'
  const [mode, setMode] = useState(initialMode);

  // Common Settings
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_PRESETS[1]);
  const [isPublic, setIsPublic] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // AI Generator State
  const [customTopic, setCustomTopic] = useState(TRENDING_SPEAKING_TOPICS[0].en);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Manual Pack State
  const [manualTitle, setManualTitle] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [manualEstTime, setManualEstTime] = useState('11 - 14 phút');

  // Part 1 Manual
  const [p1Title, setP1Title] = useState('Hometown & Daily Routine');
  const [p1Category, setP1Category] = useState('General Life');
  const [p1Questions, setP1Questions] = useState([
    'Where is your hometown located?',
    'What do you like most about living there?',
    'Has your hometown changed much since you were a child?'
  ]);

  // Part 2 Manual
  const [p2Title, setP2Title] = useState('Describe a memorable journey you took');
  const [p2Prompt, setP2Prompt] = useState('You should say:\n- Where you went\n- Who you went with\n- What you did there\n- And explain why this journey was particularly memorable.');
  const [p2Bullets, setP2Bullets] = useState([
    'Where you went',
    'Who you went with',
    'What you did there',
    'And explain why this journey was particularly memorable'
  ]);
  const [p2VocabHints, setP2VocabHints] = useState('breathtaking scenery, unforgettable experience, hospitality, picturesque');
  const [p2SampleAnswer, setP2SampleAnswer] = useState('');

  // Part 3 Manual
  const [p3Topic, setP3Topic] = useState('Tourism, Travel & Cultural Exchange');
  const [p3Questions, setP3Questions] = useState([
    'Why do many young people prefer traveling solo nowadays?',
    'How does international tourism affect indigenous cultures and traditions?',
    'Do you agree that traveling abroad broadens a person\'s worldview?'
  ]);

  // Handle Quick Template Loading for Manual Pack
  const handleApplyTemplate = (tpl) => {
    setManualTitle(tpl.title);
    setManualSummary(tpl.summary);
    if (tpl.targetBand) {
      const matched = DIFFICULTY_PRESETS.find(p => p.target === tpl.targetBand) || DIFFICULTY_PRESETS[1];
      setSelectedDifficulty(matched);
    }
    setP1Title(tpl.p1Title);
    setP1Category(tpl.p1Category);
    setP1Questions([...tpl.p1Questions]);

    setP2Title(tpl.p2Title);
    setP2Prompt(tpl.p2Prompt);
    setP2Bullets([...tpl.p2Bullets]);
    setP2VocabHints(tpl.p2VocabHints || '');
    setP2SampleAnswer(tpl.p2SampleAnswer || '');

    setP3Topic(tpl.p3Topic);
    setP3Questions([...tpl.p3Questions]);
  };

  // Helper to add question to P1
  const handleAddP1Question = () => {
    setP1Questions(prev => [...prev, '']);
  };
  const handleUpdateP1Question = (idx, val) => {
    setP1Questions(prev => prev.map((q, i) => i === idx ? val : q));
  };
  const handleRemoveP1Question = (idx) => {
    if (p1Questions.length <= 1) return;
    setP1Questions(prev => prev.filter((_, i) => i !== idx));
  };

  // Helper to add question to P3
  const handleAddP3Question = () => {
    setP3Questions(prev => [...prev, '']);
  };
  const handleUpdateP3Question = (idx, val) => {
    setP3Questions(prev => prev.map((q, i) => i === idx ? val : q));
  };
  const handleRemoveP3Question = (idx) => {
    if (p3Questions.length <= 1) return;
    setP3Questions(prev => prev.filter((_, i) => i !== idx));
  };

  // Helper for P2 bullets
  const handleUpdateP2Bullet = (idx, val) => {
    setP2Bullets(prev => prev.map((b, i) => i === idx ? val : b));
  };

  // AI GENERATION HANDLER
  const handleGenerateAI = async () => {
    if (!apiKey) {
      setErrorMsg('Vui lòng cài đặt AI API Key trong phần Cài đặt trước khi sinh đề.');
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
        summary: packData.summary || 'Bộ đề thi thử Speaking do AI thiết kế riêng theo chuẩn Cambridge.',
        isCustom: true,
        isAiGenerated: true,
        isManual: false,
        source: 'ai',
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

  // MANUAL PACK SUBMIT HANDLER
  const handleSaveManual = (e) => {
    if (e) e.preventDefault();

    const validP1Questions = p1Questions.filter(q => q.trim());
    if (validP1Questions.length === 0) {
      setErrorMsg('Vui lòng nhập ít nhất 1 câu hỏi cho Part 1.');
      return;
    }
    if (!p2Title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề Cue Card Part 2.');
      return;
    }
    const validP3Questions = p3Questions.filter(q => q.trim());
    if (validP3Questions.length === 0) {
      setErrorMsg('Vui lòng nhập ít nhất 1 câu hỏi phản biện cho Part 3.');
      return;
    }

    const packTitle = manualTitle.trim() || `Full Mock Test: ${p2Title.trim()}`;
    const p2Id = `p2-manual-${Date.now()}`;

    const newMockPack = {
      id: `mock-spk-manual-${Date.now()}`,
      title: packTitle,
      difficulty: selectedDifficulty.difficulty,
      targetBand: selectedDifficulty.target,
      estTime: manualEstTime || '11 - 14 phút',
      summary: manualSummary.trim() || `Bộ đề Speaking thủ công: Part 1 (${p1Title}), Part 2 (${p2Title}), Part 3 (${p3Topic}).`,
      isCustom: true,
      isManual: true,
      isAiGenerated: false,
      source: 'manual',
      isPublic: Boolean(isPublic),
      createdAt: new Date().toISOString(),
      customPart1: {
        id: `p1-manual-${Date.now()}`,
        title: p1Title.trim() || 'Part 1 Interview',
        category: p1Category.trim() || 'General Life',
        tag: '✍️ Thủ công',
        questions: validP1Questions.map((q, idx) => ({
          qId: `p1-mq-${idx + 1}`,
          question: q.trim(),
          subAngle: 'General Interview'
        }))
      },
      customPart2: {
        id: p2Id,
        title: p2Title.trim(),
        category: 'Speaking Part 2',
        prompt: p2Prompt.trim() || `Describe ${p2Title.trim()}`,
        cueBullets: p2Bullets.filter(b => b.trim()),
        vocabHints: p2VocabHints ? p2VocabHints.split(',').map(s => s.trim()).filter(Boolean) : [],
        sampleAnswer: p2SampleAnswer.trim(),
        prepGuide4Quadrants: {
          whoWhere: 'Bối cảnh, nhân vật & địa điểm',
          whatHappened: 'Diễn biến chính & hoạt động cốt lõi',
          whySpecial: 'Lý do nổi bật hoặc ấn tượng nhất',
          reflectionImpact: 'Bài học, cảm xúc & tác động cá nhân'
        }
      },
      customPart3: {
        linkedPart2Id: p2Id,
        topic: p3Topic.trim() || p1Title.trim() || 'Discussion Questions',
        questions: validP3Questions.map((q, idx) => ({
          qId: `p3-mq-${idx + 1}`,
          question: q.trim(),
          dimension: 'Analytical Discussion'
        }))
      }
    };

    if (onPackGenerated) {
      onPackGenerated(newMockPack);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[94dvh]">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${
              mode === 'manual' 
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-900/50' 
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-900/50'
            }`}>
              {mode === 'manual' ? <PenTool className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  {mode === 'manual' ? 'Tự Tạo Gói Đề Speaking Thủ Công' : 'Sinh Bộ Đề IELTS Speaking (AI)'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  mode === 'manual'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {mode === 'manual' ? '✍️ Thủ công' : 'Full 3 Parts'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'manual' 
                  ? 'Tự nạp đề từ sách Cambridge thật hoặc tự biên soạn cho đủ Part 1, 2, 3' 
                  : 'Tạo trọn vẹn Part 1 phỏng vấn, Part 2 Cue Card & Part 3 phản biện chuẩn Cambridge'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE SWITCHER PILL TABS */}
        <div className="bg-slate-950/70 p-2 border-b border-slate-800 flex items-center justify-center shrink-0">
          <div className="grid grid-cols-2 gap-1.5 w-full max-w-md bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('ai'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                mode === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🤖 AI Sinh Trọn Gói</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('manual'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                mode === 'manual'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>✍️ Tự Tạo Thủ Công</span>
            </button>
          </div>
        </div>

        {/* API KEY WARNING IF MISSING IN AI MODE */}
        {mode === 'ai' && !apiKey && (
          <div className="m-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Chưa cấu hình AI API Key. Vui lòng cài đặt để dùng tính năng sinh đề.</span>
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
          <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-700/50 text-rose-200 text-xs flex items-center space-x-2.5 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SCROLLABLE FORM BODY */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1 overscroll-contain">
          
          {/* ========================================================== */}
          {/* AI MODE                                                    */}
          {/* ========================================================== */}
          {mode === 'ai' && (
            <>
              {/* TOPIC SELECTION */}
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

              {/* DIFFICULTY & TARGET BAND */}
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

              {/* GENERATION PREVIEW NOTE */}
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
            </>
          )}

          {/* ========================================================== */}
          {/* MANUAL MODE                                                */}
          {/* ========================================================== */}
          {mode === 'manual' && (
            <div className="space-y-4">
              
              {/* Quick Template Picker */}
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nạp Nhanh Mẫu Gói Đề Chuẩn Cambridge:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">Điền tự động Full Part 1, 2, 3</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SPEAKING_PACK_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-900/60 text-emerald-200 text-xs font-semibold border border-emerald-500/40 shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pack Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tên Gói Đề (Mock Pack Title):</label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="VD: Cambridge 18 Test 3 Speaking Pack"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mục Tiêu & Độ Khó:</label>
                  <select
                    value={selectedDifficulty.id}
                    onChange={(e) => {
                      const matched = DIFFICULTY_PRESETS.find(p => p.id === e.target.value) || DIFFICULTY_PRESETS[0];
                      setSelectedDifficulty(matched);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {DIFFICULTY_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 1. PART 1 SECTION */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">1</span>
                    <span className="font-bold text-xs text-white">Part 1: Phỏng Vấn (Warm-up Interview)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddP1Question}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm Câu Hỏi</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={p1Title}
                    onChange={(e) => setP1Title(e.target.value)}
                    placeholder="Chủ đề Part 1 (VD: Accommodation)"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={p1Category}
                    onChange={(e) => setP1Category(e.target.value)}
                    placeholder="Phân loại (VD: Daily Life)"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  {p1Questions.map((q, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500 font-mono w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => handleUpdateP1Question(idx, e.target.value)}
                        placeholder={`Câu hỏi Part 1 số ${idx + 1}...`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                      {p1Questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveP1Question(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          title="Xóa câu hỏi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. PART 2 SECTION */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">2</span>
                  <span className="font-bold text-xs text-white">Part 2: Thuyết Trình Cue Card (60s Chuẩn Bị • 2 Phút Nói)</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Tiêu Đề Cue Card:</label>
                  <input
                    type="text"
                    value={p2Title}
                    onChange={(e) => setP2Title(e.target.value)}
                    placeholder="VD: Describe an energetic person you know"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">4 Điểm Gợi Ý (You should say:):</label>
                  <div className="space-y-1.5">
                    {p2Bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-[11px] text-amber-400 font-mono w-4">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleUpdateP2Bullet(idx, e.target.value)}
                          placeholder={`Gợi ý ý ${idx + 1}...`}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Từ Vựng Gợi Ý (Tách nhau bằng dấu phẩy):</label>
                  <input
                    type="text"
                    value={p2VocabHints}
                    onChange={(e) => setP2VocabHints(e.target.value)}
                    placeholder="VD: vivacious, dynamic, role model, infectious optimism"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Bài Nói Mẫu Band 8.5 (Tùy chọn):</label>
                  <textarea
                    rows={3}
                    value={p2SampleAnswer}
                    onChange={(e) => setP2SampleAnswer(e.target.value)}
                    placeholder="Dán bài nói mẫu tham khảo tại đây nếu có..."
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-sans leading-relaxed resize-y focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. PART 3 SECTION */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">3</span>
                    <span className="font-bold text-xs text-white">Part 3: Thảo Luận Chuyên Sâu & Phản Biện (Two-way Discussion)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddP3Question}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm Câu Hỏi</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Chủ Đề Thảo Luận Part 3:</label>
                  <input
                    type="text"
                    value={p3Topic}
                    onChange={(e) => setP3Topic(e.target.value)}
                    placeholder="VD: Personality Traits and Leadership in Modern Workplaces"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  {p3Questions.map((q, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500 font-mono w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => handleUpdateP3Question(idx, e.target.value)}
                        placeholder={`Câu hỏi thảo luận số ${idx + 1}...`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                      {p3Questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveP3Question(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          title="Xóa câu hỏi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

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
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          
          {mode === 'manual' ? (
            <button
              type="button"
              onClick={handleSaveManual}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/50 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Lưu Gói Đề Thủ Công & Luyện Ngay</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerateAI}
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
          )}
        </div>

      </div>
    </div>
  );
}
