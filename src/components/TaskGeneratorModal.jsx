import React, { useState } from 'react';
import { 
  Sparkles, 
  BarChart2, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Loader2, 
  Clock, 
  Globe, 
  Lock,
  PenTool,
  Wand2,
  BookOpen,
  FileCheck,
  Check
} from 'lucide-react';
import { IELTS_TOPICS, TASK1_TYPES, TASK2_TYPES, TIME_FRAME_TYPES } from '../data/topics';
import { generateNewTask } from '../services/geminiService';
import TaskImageUploader from './TaskImageUploader';
import { isOwnerUser, OWNER_MEDIA_RESTRICTION_MESSAGE, OWNER_EMAIL } from '../utils/userPermissions';
import { useTranslation } from '../i18n';

const getQuickManualTemplates = (isEn) => ({
  task1: [
    {
      label: isEn ? 'Line Graph: Clean Water Consumption (2000–2025)' : 'Line Graph: Mức tiêu thụ nước sạch (2000–2025)',
      type: 'line',
      timeFrame: 'dynamic',
      title: 'Water Consumption Trends in Three Continents (2000–2025)',
      prompt: 'The graph below shows the changes in clean water consumption (in millions of cubic meters) across North America, Europe, and Asia-Pacific between 2000 and 2025, with projections to 2030.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      sampleAnswer: 'The line graph illustrates clean water consumption across three distinct global regions from 2000 to 2025, alongside projected figures up to 2030.\n\nOverall, water consumption in all three regions experienced an upward trajectory over the entire timeframe, with North America consistently registering the highest figures, while Asia-Pacific recorded the most dramatic growth.\n\nIn 2000, North America consumed approximately 450 million cubic meters of water, followed by Europe at 320 million and Asia-Pacific at roughly 200 million. Over the next two decades, demand in North America climbed steadily to reach 580 million cubic meters in 2025. Projections indicate a continuation of this trend, peaking at around 620 million by 2030.\n\nConversely, Asia-Pacific underwent a steep acceleration, overtaking Europe around 2018 and achieving parity with North America by 2025 at nearly 570 million cubic meters. Europe exhibited a much more moderate climb, leveling off near 390 million cubic meters towards 2030.'
    },
    {
      label: isEn ? 'Process: Production & Packaging of Export Coffee' : 'Process: Quy trình sản xuất & đóng gói cà phê xuất khẩu',
      type: 'process',
      timeFrame: 'any',
      title: 'The Industrial Production and Packaging of Coffee Beans',
      prompt: 'The diagram illustrates the stages in the industrial production, processing, and packaging of organic coffee beans for international export.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      sampleAnswer: 'The flow chart outlines the comprehensive sequence of operations involved in the commercial manufacturing and global distribution of organic coffee beans.\n\nOverall, the industrial process consists of seven sequential stages, beginning with the cultivation and manual harvesting of ripe coffee cherries, progressing through fermentation, roasting, and quality inspection, and culminating in airtight vacuum packaging for export.\n\nInitially, mature coffee berries are harvested by hand and subjected to mechanical wet-processing to separate the pulp from the beans. Following this, the beans undergo a 48-hour fermentation cycle before being sun-dried on elevated raised beds. Once the moisture level is stabilized below 12%, the outer husk is removed through milling.\n\nIn the final phases, the raw green beans are roasted at temperatures exceeding 220°C to unlock their characteristic aroma. After rapid cooling and optical sorting to discard defective items, the beans are sealed in vacuum foil bags and dispatched to maritime shipping containers.'
    },
    {
      label: isEn ? 'Map: Town Center Redevelopment (2015 vs Present)' : 'Map: Chuyển đổi trung tâm thị trấn (2015 vs Hiện nay)',
      type: 'map',
      timeFrame: 'dynamic',
      title: 'Town Center Redevelopment and Pedestrianization',
      prompt: 'The two maps below show the town of Greendale in 2015 and after modern redevelopment projects in the present day.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      sampleAnswer: 'The two maps delineate the infrastructural and commercial transformations that have taken place in the center of Greendale from 2015 to the present day.\n\nOverall, the town center has evolved from a vehicle-dominated thoroughfare into a modern, pedestrian-oriented urban hub with significantly augmented green spaces and recreational amenities.\n\nIn 2015, Main Street bisected the center, accommodating heavy two-way vehicular transit with an adjacent open-air car park in the northwest corner. In contrast, the current layout shows that Main Street has been entirely pedestrianized, prohibiting motorized vehicles and introducing dedicated bicycle corridors.\n\nThe former car park has been replaced by a modern multi-story shopping complex featuring subterranean parking. Moreover, the old derelict warehouse on the eastern edge has been demolished to make way for a community botanical park and outdoor amphitheater.'
    }
  ],
  task2: [
    {
      label: isEn ? 'Opinion: Artificial Intelligence (AI) in the Labor Market' : 'Opinion: Trí tuệ nhân tạo (AI) trong thị trường lao động',
      type: 'opinion',
      topic: 'tech',
      title: 'Impact of Artificial Intelligence on Future Employment',
      prompt: 'Some people believe that artificial intelligence and automation will lead to widespread joblessness and economic instability, while others argue that AI will generate novel industries and elevate human productivity.\n\nTo what extent do you agree or disagree with the view that AI poses an existential threat to workers?',
      sampleAnswer: 'The advent of artificial intelligence (AI) has sparked vigorous debates concerning its ramifications on global employment. While alarmists contend that autonomous algorithms will displace human labor on an unprecedented scale, I firmly believe that AI acts primarily as an augmenting catalyst that will ultimately foster more sophisticated employment opportunities rather than trigger irreversible mass unemployment.\n\nUndeniably, automated technologies have demonstrated superior efficiency in executing repetitive, rule-based operations. Factory assembly lines, standardized bookkeeping, and basic customer service inquiries are increasingly mediated by intelligent software agents. However, historical precedents such as the Industrial and Digital Revolutions illustrate that automation consistently dismantles archaic manual positions while simultaneously giving birth to burgeoning sectors requiring higher-order cognitive competencies.\n\nFurthermore, essential professional domains inherently depend upon human empathy, ethical discernment, and strategic creativity—attributes that probabilistic algorithmic models cannot genuinely replicate. In healthcare, education, and legal governance, AI functions as a diagnostic and preparatory instrument, empowering professionals to make more informed decisions without eliminating human oversight.\n\nIn conclusion, while transient frictional unemployment is inevitable, AI should be regarded as a transformative tool that refines the workplace rather than an existential threat to human employment.'
    },
    {
      label: isEn ? 'Discussion: Online Learning vs Traditional Lecture Hall' : 'Discussion: Học trực tuyến so với Học trên giảng đường',
      type: 'discussion',
      topic: 'edu',
      title: 'Online Learning Platforms vs Traditional Classrooms',
      prompt: 'Some educators advocate that virtual and remote learning models will completely supplant conventional universities, while others maintain that physical classroom interaction remains indispensable.\n\nDiscuss both views and give your own opinion.',
      sampleAnswer: 'The proliferation of digital education platforms has ignited discussion over whether virtual learning will render brick-and-mortar universities obsolete. While digital learning offers unparalleled convenience and egalitarian access to knowledge, I maintain that traditional physical campuses provide crucial interpersonal development that online modalities cannot duplicate.\n\nOn the one hand, proponents of online education emphasize geographical and economic accessibility. Students in developing regions can now enroll in premier lecture courses from elite institutions without incurring relocation costs or exorbitant campus fees. Furthermore, asynchronous study schedules empower working professionals to upskill at their self-determined pace, making lifelong education genuinely democratized.\n\nOn the other hand, traditional academic campuses foster spontaneous dialectical exchanges, collaborative lab investigations, and non-verbal socialization. The subtle social dynamics developed through face-to-face debates, extracurricular teamwork, and direct mentorship are integral to holistic character formation. Relying solely on video conferences often induces cognitive fatigue and diminishes sustained student engagement.\n\nIn conclusion, while virtual platforms are indispensable supplements for disseminating technical curricula, traditional classrooms will persist as the cornerstone of transformative tertiary education.'
    },
    {
      label: isEn ? 'Problem & Solution: Traffic Congestion & Urban Pollution' : 'Problem & Solution: Ùn tắc giao thông & Ô nhiễm đô thị',
      type: 'problem_solution',
      topic: 'environment',
      title: 'Urban Traffic Congestion and Atmospheric Pollution',
      prompt: 'In many contemporary metropolitan areas, chronic traffic congestion and deteriorating air quality have become critical crises.\n\nWhat are the primary causes of this phenomenon, and what pragmatic solutions can municipal authorities implement to mitigate these issues?',
      sampleAnswer: 'In modern metropolises worldwide, deteriorating air quality and pervasive traffic paralysis represent severe threats to public health and economic vigor. This essay will examine rapid suburban sprawl and inadequate public transit infrastructure as principal drivers of this dilemma before proposing viable countermeasures centered on green mass transit and urban congestion pricing.\n\nThe core origin of urban congestion lies in poorly coordinated municipal planning and car-dependent urban design. Over recent decades, burgeoning population growth in peripheral suburbs has forced millions of daily commuters to rely on personal combustion-engine automobiles. Compounding this issue is the underfunding of public transportation networks, which frequently leaves subway and bus lines overcrowded, erratic, and unappealing to the middle class.\n\nTo remediate this environmental and infrastructural impasse, municipal administrations must deploy a synchronized twofold strategy. First, governments should invest decisively in expanding clean electric rail systems and dedicated bus rapid transit (BRT) routes, ensuring seamless, affordable transit between peripheral residential districts and central commercial hubs. Second, cities should enact strict congestion toll zones, as successfully demonstrated in London and Singapore, while earmarking collected revenues toward subsidizing pedestrian corridors and zero-emission vehicles.\n\nIn conclusion, combating urban traffic bottlenecks requires shifting public priorities away from private car usage toward robust, clean, and accessible public mass transit systems.'
    }
  ]
});

export const QUICK_MANUAL_TEMPLATES = getQuickManualTemplates(false);

const getTask1TypeLabel = (t, isEn) => {
  if (!isEn) return `${t.label} (${t.desc})`;
  const enLabels = {
    line: 'Line Graph (Trend over time)',
    bar: 'Bar Chart (Comparative / Trends)',
    pie: 'Pie Chart (Proportions & Shares)',
    table: 'Data Table (Statistical Breakdown)',
    mixed: 'Combined Charts (Multi-chart Synthesis)',
    process: 'Process Diagram (Stages & Operations)',
    map: 'Map / Spatial Layout (Development & Changes)'
  };
  return enLabels[t.id] || t.label;
};

const getTimeFrameLabel = (tf, isEn) => {
  if (!isEn) return `${tf.label} — ${tf.desc}`;
  const enLabels = {
    any: 'Automatic (AI Decision) — Optimal timeframe for selected visual',
    dynamic: 'Dynamic (Changes over time) — Trend description across 2+ periods',
    static: 'Static (Single point in time) — Relative comparison & proportions'
  };
  return enLabels[tf.id] || tf.label;
};

export default function TaskGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model,
  user,
  tasks = [],
  onTaskCreated,
  onOpenSettings,
  initialMode = 'ai'
}) {
  if (!isOpen) return null;

  const { t, isEn } = useTranslation();
  const quickManualTemplates = getQuickManualTemplates(isEn);

  // Mode Switcher: 'ai' (AI Sinh Tự Động) | 'manual' (Nạp Đề Thủ Công)
  const [generatorMode, setGeneratorMode] = useState(initialMode);

  // Common Task State
  const [taskNumber, setTaskNumber] = useState(2); // 1 or 2
  const [task1Type, setTask1Type] = useState('line');
  const [timeFrame, setTimeFrame] = useState('any'); // any, dynamic, static
  const [task2Type, setTask2Type] = useState('opinion');
  const [selectedTopic, setSelectedTopic] = useState('tech');

  // Manual Creation Fields
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrompt, setManualPrompt] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [manualSampleAnswer, setManualSampleAnswer] = useState('');
  const [manualMinWords, setManualMinWords] = useState(taskNumber === 1 ? 150 : 250);
  const [manualTimeLimit, setManualTimeLimit] = useState(taskNumber === 1 ? 20 : 40);

  // Privacy & Auto-share Toggle
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

  // Handle Quick Pre-fill Template
  const handleApplyTemplate = (tpl) => {
    setManualTitle(tpl.title);
    setManualPrompt(tpl.prompt);
    setManualSampleAnswer(tpl.sampleAnswer || '');
    if (taskNumber === 1) {
      if (tpl.type) setTask1Type(tpl.type);
      if (tpl.timeFrame) setTimeFrame(tpl.timeFrame);
      setManualMinWords(150);
      setManualTimeLimit(20);
    } else {
      if (tpl.type) setTask2Type(tpl.type);
      if (tpl.topic) setSelectedTopic(tpl.topic);
      setManualMinWords(250);
      setManualTimeLimit(40);
    }
  };

  // Switch task number
  const handleSelectTaskNumber = (num) => {
    setTaskNumber(num);
    if (generatorMode === 'manual') {
      setManualMinWords(num === 1 ? 150 : 250);
      setManualTimeLimit(num === 1 ? 20 : 40);
    }
  };

  // AI Generation Handler
  const handleGenerateAI = async () => {
    if (!apiKey) {
      setErrorMsg(isEn ? 'Please configure your AI API Key before generating tasks.' : 'Vui lòng cài đặt AI API Key trước khi sinh đề.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    try {
      const topicObj = IELTS_TOPICS.find(t => t.id === selectedTopic);

      // Collect existing prompt titles to strictly avoid duplicates
      const relevantExistingTitles = (tasks || [])
        .filter(t => Number(t.taskNumber) === Number(taskNumber))
        .map(t => t.title || t.prompt)
        .filter(Boolean)
        .slice(0, 15);

      const newTask = await generateNewTask({
        taskNumber,
        type: taskNumber === 1 ? task1Type : task2Type,
        timeFrame: taskNumber === 1 ? timeFrame : 'any',
        topic: topicObj?.name || 'General',
        existingTitles: relevantExistingTitles,
        apiKey,
        model
      });

      newTask.isPublic = isPublic;
      newTask.creatorEmail = user?.email || (isEn ? 'Member' : 'Thành viên');
      newTask.isCustom = true;
      newTask.isAiGenerated = true;
      newTask.isManual = false;
      newTask.source = 'ai';

      onTaskCreated(newTask, isPublic);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || (isEn ? 'Error while generating task from AI. Please check your API Key.' : 'Lỗi khi sinh đề từ AI. Vui lòng kiểm tra API Key.'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Manual Creation Submit Handler
  const handleSaveManual = (e) => {
    if (e) e.preventDefault();

    if (!manualPrompt.trim()) {
      setErrorMsg(isEn ? 'Please enter task prompt content.' : 'Vui lòng điền nội dung đề bài (Prompt).');
      return;
    }

    // Media Guard: Restrict images to the owner (tranthanhtung37@gmail.com)
    if (Number(taskNumber) === 1 && manualImageUrl.trim() && !isOwnerUser(user)) {
      setErrorMsg(OWNER_MEDIA_RESTRICTION_MESSAGE);
      return;
    }

    const t1Obj = TASK1_TYPES.find(t => t.id === task1Type);
    const t1TitleLabel = isEn ? (t1Obj ? t1Obj.label.replace(/\s*\([^)]*\)/g, '') : 'Report') : (t1Obj?.label || 'Report');
    const t2Obj = TASK2_TYPES.find(t => t.id === task2Type);

    const defaultTitle = taskNumber === 1 
      ? (isEn 
          ? `Task 1: ${t1TitleLabel} Report` 
          : `Task 1: Biểu đồ ${t1Obj?.label || 'Report'}`)
      : (isEn 
          ? `Task 2: ${t2Obj?.label || 'Essay'} Essay` 
          : `Task 2: Bài luận ${t2Obj?.label || 'Essay'}`);

    const newTask = {
      id: `manual-task-${Date.now()}`,
      taskNumber: Number(taskNumber),
      type: taskNumber === 1 ? task1Type : task2Type,
      timeFrame: taskNumber === 1 ? timeFrame : 'any',
      title: manualTitle.trim() || defaultTitle,
      prompt: manualPrompt.trim(),
      imageUrl: taskNumber === 1 ? manualImageUrl.trim() : '',
      sampleAnswer: manualSampleAnswer.trim(),
      minWords: Number(manualMinWords) || (taskNumber === 1 ? 150 : 250),
      timeLimit: Number(manualTimeLimit) || (taskNumber === 1 ? 20 : 40),
      isCustom: true,
      isManual: true,
      isAiGenerated: false,
      source: 'manual',
      isPublic: Boolean(isPublic),
      creatorEmail: user?.email || (isEn ? 'Member' : 'Thành viên'),
      createdAt: new Date().toISOString()
    };

    onTaskCreated(newTask, isPublic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[94dvh] border border-slate-200">
        
        {/* Fixed Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl text-white shadow-xs ${
              generatorMode === 'manual' 
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600' 
                : 'bg-gradient-to-tr from-red-600 to-rose-600'
            }`}>
              {generatorMode === 'manual' ? (
                <PenTool className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                  {generatorMode === 'manual' 
                    ? (isEn ? 'Manual Writing Task Entry' : 'Nạp Đề Writing Thủ Công') 
                    : (isEn ? 'AI Automatic Task Generator' : 'AI Sinh Đề Mới Tự Động')}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  generatorMode === 'manual'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {generatorMode === 'manual' ? (isEn ? '✍️ Manual' : '✍️ Thủ công') : (isEn ? '🤖 AI Engine' : '🤖 AI Engine')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {generatorMode === 'manual'
                  ? (isEn ? 'Input tasks from Cambridge books, actual exam photos, or personal study materials' : 'Tự nạp đề từ sách Cambridge, ảnh chụp đề thi thật hoặc tài liệu cá nhân')
                  : (isEn ? 'Up-to-date IELTS Writing 2025–2026 test trends with dynamic interactive charts' : 'Cập nhật xu hướng thi thật IELTS Writing 2025–2026 với biểu đồ sống')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={isEn ? "Close (Esc)" : "Đóng (Esc)"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="bg-slate-100/90 p-1.5 border-b border-slate-200/80 flex items-center justify-center shrink-0">
          <div className="grid grid-cols-2 gap-1.5 w-full max-w-md bg-white p-1 rounded-xl shadow-2xs border border-slate-200">
            <button
              type="button"
              onClick={() => { setGeneratorMode('ai'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                generatorMode === 'ai'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? '🤖 AI Auto Generate' : '🤖 AI Sinh Tự Động'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setGeneratorMode('manual'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                generatorMode === 'manual'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isEn ? '✍️ Manual Entry' : '✍️ Nạp Đề Thủ Công'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
          
          {/* API Key Alert if not configured and in AI mode */}
          {generatorMode === 'ai' && !apiKey && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isEn ? 'AI API Key not configured.' : 'Chưa cài đặt AI API Key.'}</span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-red-600 font-bold hover:underline cursor-pointer"
              >
                {isEn ? 'Configure now →' : 'Cài đặt ngay →'}
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
            <label className="text-xs font-bold text-slate-700">
              {isEn ? 'Select IELTS Writing Task:' : 'Chọn phần thi IELTS Writing:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectTaskNumber(1)}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all cursor-pointer ${
                  taskNumber === 1
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BarChart2 className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-xs block">Task 1 (Report)</span>
                  <span className="text-[10px] text-slate-500 block">
                    {generatorMode === 'manual' 
                      ? (isEn ? 'Import prompt with chart / process diagram' : 'Nạp đề kèm ảnh biểu đồ / quy trình') 
                      : (isEn ? 'Generate dynamic data & live charts' : 'Sinh số liệu & vẽ biểu đồ sống')}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTaskNumber(2)}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all cursor-pointer ${
                  taskNumber === 2
                    ? 'border-red-500 bg-red-50/70 text-red-900 ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileText className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold text-xs block">Task 2 (Essay)</span>
                  <span className="text-[10px] text-slate-500 block">
                    {generatorMode === 'manual' 
                      ? (isEn ? 'Import essay question from Cambridge or past exams' : 'Nạp câu hỏi luận từ sách hoặc thi thật') 
                      : (isEn ? '2025–2026 trending exam prompts' : 'Đề thi xu hướng 2025–2026')}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MODE: 🤖 AI GENERATOR SETTINGS                           */}
          {/* ======================================================== */}
          {generatorMode === 'ai' && (
            <>
              {/* Sub-type Selection for AI */}
              {taskNumber === 1 ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isEn ? 'Task 1 Chart Type (7 Cambridge Standards):' : 'Dạng Đề Task 1 (7 dạng chuẩn Cambridge):'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TASK1_TYPES.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTask1Type(t.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            task1Type === t.id
                              ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20 shadow-2xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block font-bold">{t.label}</span>
                          <span className="block text-[10px] text-slate-400 font-normal truncate">{isEn ? t.label : t.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Process & Map Banner */}
                  {(task1Type === 'process' || task1Type === 'map') && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 text-amber-950 flex items-start space-x-2.5 shadow-2xs animate-in fade-in duration-150">
                      <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 text-base shadow-xs select-none">
                        🍌
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center space-x-1.5">
                          <strong className="text-amber-950 font-black">
                            {isEn ? 'Generate Authentic Visuals with Google Banana (AI Image):' : 'Tạo hình trực tiếp bằng Google Banana (AI Image):'}
                          </strong>
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-200 text-amber-900">AI Image</span>
                        </div>
                        <span className="text-[11px] text-amber-900 block mt-0.5 leading-relaxed">
                          {task1Type === 'process' 
                            ? (isEn 
                                ? 'Google Banana AI will generate an authentic, unique process / lifecycle diagram calibrated for IELTS.' 
                                : 'Google Banana AI sẽ vẽ trực tiếp sơ đồ quy trình / vòng đời độc bản chân thực, không bao giờ bị trùng lặp.') 
                            : (isEn 
                                ? 'Google Banana AI will generate authentic comparative dual-period maps matching real exam conditions.' 
                                : 'Google Banana AI sẽ vẽ trực tiếp bản đồ kép đối chiếu 2 thời kỳ chân thực, sống động chuẩn bài thi thật.')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Time-Frame Selection */}
                  {task1Type !== 'process' && task1Type !== 'map' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <label className="text-xs font-bold text-slate-700">
                          {isEn ? 'Time Frame (Dynamic vs Static):' : 'Khung thời gian (Dynamic vs Static):'}
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {TIME_FRAME_TYPES.map(tf => (
                          <button
                            key={tf.id}
                            type="button"
                            onClick={() => setTimeFrame(tf.id)}
                            className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                              timeFrame === tf.id
                                ? 'border-blue-500 bg-white font-bold text-blue-900 ring-2 ring-blue-500/20 shadow-2xs'
                                : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                            }`}
                          >
                            <span className="block font-semibold">{tf.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isEn ? 'Task 2 Essay Type:' : 'Dạng Bài Luận Task 2:'}
                  </label>
                  <select
                    value={task2Type}
                    onChange={(e) => setTask2Type(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white cursor-pointer"
                  >
                    {TASK2_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label} ({isEn ? t.label : t.vi})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Topic Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isEn ? 'Topic Category:' : 'Chủ Đề (Topic Category):'}
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white cursor-pointer"
                >
                  {IELTS_TOPICS.map(t => (
                    <option key={t.id} value={t.id}>{t.name} {isEn ? '' : `— ${t.vi}`}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* MODE: ✍️ MANUAL TASK CREATOR                             */}
          {/* ======================================================== */}
          {generatorMode === 'manual' && (
            <div className="space-y-4">
              
              {/* Quick Template Picker */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEn ? 'Cambridge Standard Quick-Fill Templates:' : 'Nạp Nhanh Mẫu Đề Chuẩn Cambridge:'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {isEn ? 'Click to auto-populate prompt & model answer' : 'Bấm để tự động điền cấu trúc'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(taskNumber === 1 ? quickManualTemplates.task1 : quickManualTemplates.task2).map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 text-[11px] font-semibold border border-emerald-300 shadow-2xs transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Sub-Type & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {taskNumber === 1 
                      ? (isEn ? 'Task 1 Visual Type:' : 'Dạng Đề Task 1:') 
                      : (isEn ? 'Task 2 Essay Type:' : 'Dạng Bài Task 2:')}
                  </label>
                  {taskNumber === 1 ? (
                    <select
                      value={task1Type}
                      onChange={(e) => setTask1Type(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    >
                      {TASK1_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{getTask1TypeLabel(t, isEn)}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={task2Type}
                      onChange={(e) => setTask2Type(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    >
                      {TASK2_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.label} {isEn ? '' : `(${t.vi})`}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {taskNumber === 1 
                      ? (isEn ? 'Time Horizon:' : 'Khung Thời Gian:') 
                      : (isEn ? 'Topic Category:' : 'Chủ Đề (Topic):')}
                  </label>
                  {taskNumber === 1 ? (
                    <select
                      value={timeFrame}
                      onChange={(e) => setTimeFrame(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    >
                      {TIME_FRAME_TYPES.map(tf => (
                        <option key={tf.id} value={tf.id}>{getTimeFrameLabel(tf, isEn)}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    >
                      {IELTS_TOPICS.map(t => (
                        <option key={t.id} value={t.id}>{t.name} {isEn ? '' : `— ${t.vi}`}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Task 1 Image Uploader */}
              {taskNumber === 1 && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                  <TaskImageUploader
                    imageUrl={manualImageUrl}
                    onImageChange={setManualImageUrl}
                    label={isEn ? "Task 1 Chart / Map / Process Diagram Image (Optional):" : "Hình ảnh biểu đồ / Bản đồ / Quy trình Task 1 (Tùy chọn):"}
                    user={user}
                  />
                  {manualImageUrl && (
                    <p className="text-[11px] text-blue-800 font-medium mt-1.5 flex items-center gap-1">
                      <span>{isEn ? '✓ Image loaded successfully. It will be displayed during your writing session.' : '✓ Đã nạp ảnh thành công. Ảnh sẽ được hiển thị trực tiếp khi bạn làm bài thi.'}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Task Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Task Title:' : 'Tiêu Đề Đề Bài (Task Title):'}
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder={taskNumber === 1 ? (isEn ? "e.g. Cambridge 18 Test 2 Task 1: Water Consumption" : "Ví dụ: Cambridge 18 Test 2 Task 1: Water Consumption") : (isEn ? "e.g. Cambridge 19 Test 1 Task 2: Artificial Intelligence" : "Ví dụ: Cambridge 19 Test 1 Task 2: Artificial Intelligence")}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white font-medium"
                />
              </div>

              {/* Task Prompt (Required) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isEn ? 'Exam Question Prompt' : 'Nội dung câu hỏi đề thi (Prompt)'} <span className="text-red-500">*</span>:
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {isEn ? 'Paste authentic IELTS exam prompt' : 'Dán nguyên văn đề thi IELTS thật'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder={isEn ? "Paste the complete prompt here... e.g., The chart below shows... Summarise the information by selecting and reporting the main features..." : "Dán toàn bộ đề bài ở đây... Ví dụ: The chart below shows... Summarise the information by selecting and reporting the main features..."}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white font-sans leading-relaxed resize-y"
                  required
                />
              </div>

              {/* Word Targets & Timing */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {isEn ? 'Minimum words:' : 'Số từ tối thiểu:'}
                  </label>
                  <input
                    type="number"
                    value={manualMinWords}
                    onChange={(e) => setManualMinWords(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {isEn ? 'Recommended time (minutes):' : 'Thời gian gợi ý (phút):'}
                  </label>
                  <input
                    type="number"
                    value={manualTimeLimit}
                    onChange={(e) => setManualTimeLimit(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Sample Band 8.0+ Model Answer (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEn ? 'Band 8.0+ Model Reference Answer (Optional):' : 'Bài mẫu tham khảo Band 8.0+ (Tùy chọn):'}</span>
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {isEn ? 'Useful for post-writing benchmark and vocabulary review' : 'Giúp đối chiếu và học từ vựng'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={manualSampleAnswer}
                  onChange={(e) => setManualSampleAnswer(e.target.value)}
                  placeholder={isEn ? "Paste high-band model answer here to review and contrast after completing your essay..." : "Dán bài văn mẫu Band 8.0+ từ sách hoặc giảng viên nếu có để tiện đối chiếu sau khi viết xong..."}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white font-sans leading-relaxed resize-y"
                />
              </div>

            </div>
          )}

          {/* Quyền riêng tư & Tự động chia sẻ tài nguyên cộng đồng */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 pr-2">
              <div className={`p-2 rounded-lg shrink-0 ${isPublic ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>
                    {isPublic 
                      ? (isEn ? 'Share with Global Community Library' : 'Tự động chia sẻ lên Thư viện Cộng đồng') 
                      : (isEn ? 'Save Privately in Your Account' : 'Chỉ lưu riêng tư trong tài khoản')}
                  </span>
                  {isPublic && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                      {isEn ? 'Public Resource' : 'Tài nguyên chung'}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                  {isPublic 
                    ? (isEn ? 'The task will be automatically contributed to the community library for all learners. Toggle off to keep it private.' : 'Đề thi sẽ tự động góp vào kho đề chung cho mọi người cùng luyện. Tắt nếu bạn muốn giữ riêng.') 
                    : (isEn ? 'Only visible and accessible within your personal account.' : 'Chỉ riêng tài khoản của bạn mới thấy và làm bài thi này.')}
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
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

        </div>

        {/* Fixed Footer: Always visible, never overflow */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isEn ? 'Cancel' : 'Hủy bỏ'}
          </button>
          
          {generatorMode === 'manual' ? (
            <button
              type="button"
              onClick={handleSaveManual}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>{isEn ? 'Save Custom Task & Start Practice' : 'Lưu Đề Thủ Công & Luyện Ngay'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || !apiKey}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {taskNumber === 1 && (task1Type === 'process' || task1Type === 'map')
                      ? (isEn ? 'Google Banana Generating Diagram...' : 'Google Banana Đang Vẽ Ảnh Minh Họa...')
                      : (isEn ? 'AI Generating Prompt & Visual Data...' : 'AI Đang Soạn Đề & Vẽ Biểu Đồ...')}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? 'Generate Task with AI' : 'Sinh Đề Mới Ngay'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
