import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Lock, 
  BookOpen, 
  Layers, 
  HelpCircle,
  Headphones,
  Mic,
  FileText,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { isOwnerUser, OWNER_EMAIL } from '../utils/userPermissions';
import { useTranslation } from '../i18n';

const getDrillPresets = (isEn) => ({
  'fill-blanks': {
    title: 'Academic Collocation in Task 2',
    category: 'Lexical Resource',
    sentence: 'The escalating volume of vehicular emissions has [blank] deteriorated the atmospheric quality in metropolitan centers.',
    options: ['significantly', 'trivial', 'accidentally', 'scarcely'],
    correctOption: 'significantly',
    explanation: isEn
      ? 'The adverb "significantly" naturally collocates with the verb "deteriorated", conveying severe degradation.'
      : 'Phó từ "significantly" (đáng kể) kết hợp tự nhiên với động từ "deteriorated" mang nghĩa suy giảm nghiêm trọng.'
  },
  'paraphrase': {
    title: 'Paraphrasing Complex Tertiary Education Prompts',
    category: 'Coherence & Cohesion',
    originalSentence: 'Many people think that university students should pay their own tuition fees.',
    targetParaphrase: 'A growing school of thought posits that tertiary students ought to finance their own higher education.',
    keywords: 'tertiary students, higher education, finance their own education, posits',
    explanation: isEn
      ? 'Replaces "many people think" with "a growing school of thought posits", and "university students" with "tertiary students".'
      : 'Thay thế "many people think" bằng "a growing school of thought posits", và "university students" bằng "tertiary students".'
  },
  'true-false': {
    title: 'Grammar Accuracy: Subject-Verb Agreement',
    category: 'GRA Standards',
    statement: 'A wide range of technological innovations has dramatically transformed modern agricultural methods.',
    isTrue: true,
    explanation: isEn
      ? 'The head noun is "A wide range", so the singular verb "has transformed" is grammatically accurate.'
      : 'Chủ ngữ chính là "A wide range", động từ chia số ít "has transformed" là hoàn toàn chuẩn xác theo ngữ pháp học thuật.'
  },
  'error-spotting': {
    title: 'Error Spotting: Dangling Participle Trap',
    category: 'GRA Accuracy',
    sentence: 'Walking through the university library, the historical archives caught my attention immediately.',
    correction: 'Walking through the university library, I immediately noticed the historical archives.',
    explanation: isEn
      ? 'The participial phrase "Walking through..." must refer to a human subject (I) rather than inanimate objects (archives).'
      : 'Mệnh đề phân từ "Walking through..." phải quy chiếu về cùng chủ ngữ là người (I) thay vì đồ vật (archives).'
  },
  'reading-tfng': {
    title: 'Renewable Energy Transition in Northern Europe',
    category: 'Energy & Climate',
    passage: 'In 2024, wind turbine generation supplied 58% of Denmark\'s total domestic electricity demand. However, neighboring countries with mountainous topography continue to rely predominantly on hydroelectric reservoirs.',
    statement: 'Denmark generated more than half of its electricity from wind turbines in 2024.',
    correctOption: 'TRUE',
    explanation: isEn
      ? '58% corresponds to "more than half", which strictly corroborates the assertion in the text.'
      : '58% tương đương với "more than half", thông tin trùng khớp hoàn toàn với khẳng định trong bài đọc.'
  },
  'reading-headings': {
    title: 'Subterranean Urban Agriculture',
    category: 'Urban Ecology',
    paragraphText: 'Beneath the bustling avenues of London, disused World War II air raid shelters have been repurposed into hydroponic farms. Utilizing LED lighting and closed-loop irrigation, these facilities cultivate salad greens year-round without pesticides or natural soil.',
    headings: [
      'Historical military defense infrastructure',
      'Innovative repurposing of underground spaces for sustainable farming',
      'The economic collapse of traditional rural agriculture',
      'Challenges in marketing pesticide-free produce'
    ],
    correctHeading: 'Innovative repurposing of underground spaces for sustainable farming',
    explanation: isEn
      ? 'The paragraph focuses on repurposing historic underground air-raid shelters into modern hydroponic farms.'
      : 'Đoạn văn tập trung vào việc tận dụng hầm ngầm quân sự cũ để làm nông trại thủy canh hiện đại.'
  },
  'speaking-area': {
    title: 'A.R.E.A: Remote Working Autonomy',
    category: 'Careers & Modern Work',
    question: 'Do you think remote working will become the primary working model in the future?',
    answer: 'Yes, I strongly believe that remote work will dominate modern knowledge-based industries.',
    reason: 'This is primarily because telecommuting eliminates grueling daily transit and offers unprecedented scheduling autonomy.',
    example: 'For instance, numerous global software firms reported a 25% surge in employee output after adopting flexible home-office policies.',
    alternative: 'If traditional corporations insist on compulsory office presence, they will inevitably face massive talent drain to agile remote startups.'
  },
  'speaking-fillers': {
    title: 'Buying Time for Abstract Philosophy Questions',
    category: 'Fluency Tactics',
    question: 'To what extent do cultural traditions constrain individual personal happiness?',
    fillerPhrase: 'That is an exceptionally multifaceted philosophical question, and if I reflect on it from a societal perspective...',
    modelResponse: 'That is an exceptionally multifaceted philosophical question, and if I reflect on it from a societal perspective, traditions provide a moral compass that fosters collective belonging; nevertheless, when archaic customs enforce conformity, they can inadvertently suppress individual creative expression.'
  },
  'speaking-collocations': {
    title: 'High-Scoring Academic Idiomatic Collocations',
    category: 'C1/C2 Lexis',
    sentence: 'The government\'s latest policy intervention was a [blank] step in addressing systemic income inequality.',
    options: ['decisive', 'casual', 'clumsy', 'random'],
    correctOption: 'decisive',
    explanation: isEn
      ? 'The phrase "a decisive step" carries a resolute tone appropriate for academic style.'
      : 'Cụm từ "a decisive step" mang sắc thái hành động kiên quyết, dứt khoát chuẩn văn phong học thuật.'
  },
  'speaking-part3-counter': {
    title: 'Counter-argument: Automation vs Human Labor',
    category: 'Technology & Society',
    question: 'Some experts claim that robotics will render human workers obsolete. What is your perspective?',
    counterArgument: 'While robots achieve unmatched mechanical precision, they lack subjective empathy and ethical discretion.',
    modelResponse: 'While it is undeniable that automated robots achieve unmatched efficiency in routine assembly, human discernment remains irreplaceable in high-stakes fields such as healthcare, jurisprudence, and artistic creation where empathy and ethical discretion are paramount.'
  },
  'listening-dictation': {
    title: 'Conservation Biology Lecture Transcript',
    category: 'Academic Listening',
    audioText: 'The conservation program successfully reintroduced twenty endangered lynx into the highland sanctuary.',
    trapNote: isEn
      ? 'Watch out for final consonant /d/ in "endangered" and the compound noun "highland sanctuary".'
      : 'Lưu ý âm đuôi /d/ trong từ "endangered" và danh từ ghép "highland sanctuary".'
  },
  'listening-spelling': {
    title: 'Booking Form: Surname & Reference Number',
    category: 'Daily Transaction',
    questionPrompt: 'Complete the booking form with the customer\'s surname:',
    audioText: 'My surname is Featherstonehaugh, that is F-E-A-T-H-E-R-S-T-O-N-E-H-A-U-G-H.',
    correctAnswer: 'Featherstonehaugh',
    trapNote: isEn
      ? 'Pay attention to consonant clusters th-r and the silent gh ending.'
      : 'Chú ý các cụm âm gió th-r và nhóm ký tự gh câm ở cuối từ.'
  }
});

export const DRILL_PRESETS = getDrillPresets(false);

export default function ManualMicroDrillModal({
  isOpen,
  onClose,
  activeRoom = 'writing',
  activeTab = 'fill-blanks',
  onDrillCreated,
  currentUser
}) {
  if (!isOpen) return null;

  const { t, language, isEn } = useTranslation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // Dynamic field states based on activeTab
  // 1. Blanks & Collocations
  const [sentenceWithBlank, setSentenceWithBlank] = useState('');
  const [optionsStr, setOptionsStr] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [explanation, setExplanation] = useState('');

  // 2. Paraphrase
  const [originalSentence, setOriginalSentence] = useState('');
  const [targetParaphrase, setTargetParaphrase] = useState('');
  const [keywords, setKeywords] = useState('');

  // 3. True / False
  const [tfStatement, setTfStatement] = useState('');
  const [tfAnswer, setTfAnswer] = useState('TRUE');

  // 4. Reading TFNG
  const [readingPassage, setReadingPassage] = useState('');
  const [readingStatement, setReadingStatement] = useState('');
  const [tfngAnswer, setTfngAnswer] = useState('TRUE');

  // 5. Speaking AREA
  const [speakingQuestion, setSpeakingQuestion] = useState('');
  const [areaAnswer, setAreaAnswer] = useState('');
  const [areaReason, setAreaReason] = useState('');
  const [areaExample, setAreaExample] = useState('');
  const [areaAlternative, setAreaAlternative] = useState('');

  // 6. Speaking Fillers
  const [fillerQuestion, setFillerQuestion] = useState('');
  const [fillerPhrase, setFillerPhrase] = useState('');
  const [fillerModelResponse, setFillerModelResponse] = useState('');

  // 7. Speaking Part 3 Counter
  const [part3Question, setPart3Question] = useState('');
  const [part3Counter, setPart3Counter] = useState('');
  const [part3Model, setPart3Model] = useState('');

  // 8. Listening Dictation & Spelling
  const [listeningAudioText, setListeningAudioText] = useState('');
  const [listeningTrapNote, setListeningTrapNote] = useState('');
  const [listeningAnswer, setListeningAnswer] = useState('');

  // Error validation message
  const [errorMsg, setErrorMsg] = useState('');

  // Apply Quick Preset
  const handleLoadPreset = () => {
    const presets = getDrillPresets(isEn);
    const preset = presets[activeTab] || presets['fill-blanks'];
    if (!preset) return;

    setTitle(preset.title || '');
    setCategory(preset.category || '');
    setExplanation(preset.explanation || '');

    if (activeTab === 'fill-blanks' || activeTab === 'collocation' || activeTab === 'speaking-collocations') {
      setSentenceWithBlank(preset.sentence || '');
      setOptionsStr(preset.options ? preset.options.join(', ') : '');
      setCorrectOption(preset.correctOption || '');
    } else if (activeTab === 'paraphrase') {
      setOriginalSentence(preset.originalSentence || '');
      setTargetParaphrase(preset.targetParaphrase || '');
      setKeywords(preset.keywords || '');
    } else if (activeTab === 'true-false') {
      setTfStatement(preset.statement || '');
      setTfAnswer(preset.isTrue ? 'TRUE' : 'FALSE');
    } else if (activeTab === 'reading-tfng') {
      setReadingPassage(preset.passage || '');
      setReadingStatement(preset.statement || '');
      setTfngAnswer(preset.correctOption || 'TRUE');
    } else if (activeTab === 'speaking-area') {
      setSpeakingQuestion(preset.question || '');
      setAreaAnswer(preset.answer || '');
      setAreaReason(preset.reason || '');
      setAreaExample(preset.example || '');
      setAreaAlternative(preset.alternative || '');
    } else if (activeTab === 'speaking-fillers') {
      setFillerQuestion(preset.question || '');
      setFillerPhrase(preset.fillerPhrase || '');
      setFillerModelResponse(preset.modelResponse || '');
    } else if (activeTab === 'speaking-part3-counter') {
      setPart3Question(preset.question || '');
      setPart3Counter(preset.counterArgument || '');
      setPart3Model(preset.modelResponse || '');
    } else if (activeTab === 'listening-dictation') {
      setListeningAudioText(preset.audioText || '');
      setListeningTrapNote(preset.trapNote || '');
    } else if (activeTab === 'listening-spelling') {
      setListeningAudioText(preset.audioText || '');
      setListeningAnswer(preset.correctAnswer || '');
      setListeningTrapNote(preset.trapNote || '');
    }
    setErrorMsg('');
  };

  // Submit Handler
  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const drillTitle = title.trim() || (isEn ? `Manual drill: ${activeTab}` : `Bài tập thủ công: ${activeTab}`);
    const drillCategory = category.trim() || (isEn ? 'Custom' : 'Tự nạp');

    let specificData = {};

    if (activeTab === 'fill-blanks' || activeTab === 'collocation' || activeTab === 'speaking-collocations') {
      if (!sentenceWithBlank.trim()) {
        setErrorMsg(isEn ? 'Please enter a sentence containing the [blank] placeholder.' : 'Vui lòng nhập câu có chứa vị trí trống [blank].');
        return;
      }
      const opts = optionsStr.split(',').map(s => s.trim()).filter(Boolean);
      if (opts.length < 2) {
        setErrorMsg(isEn ? 'Please enter at least 2 options (separated by commas).' : 'Vui lòng nhập ít nhất 2 đáp án lựa chọn (tách nhau bằng dấu phẩy).');
        return;
      }
      const answer = correctOption.trim() || opts[0];
      specificData = {
        sentence: sentenceWithBlank.trim(),
        options: opts,
        correctOption: answer,
        answer: answer,
        explanation: explanation.trim()
      };
    } else if (activeTab === 'paraphrase') {
      if (!originalSentence.trim() || !targetParaphrase.trim()) {
        setErrorMsg(isEn ? 'Please enter the original sentence and target Band 8+ paraphrase.' : 'Vui lòng nhập câu gốc và câu viết lại Band 8+ mục tiêu.');
        return;
      }
      specificData = {
        originalSentence: originalSentence.trim(),
        targetParaphrase: targetParaphrase.trim(),
        keywords: keywords ? keywords.split(',').map(s => s.trim()).filter(Boolean) : [],
        explanation: explanation.trim()
      };
    } else if (activeTab === 'true-false') {
      if (!tfStatement.trim()) {
        setErrorMsg(isEn ? 'Please enter the statement to test True/False accuracy.' : 'Vui lòng nhập câu khẳng định cần kiểm tra tính đúng/sai.');
        return;
      }
      specificData = {
        statement: tfStatement.trim(),
        isTrue: tfAnswer === 'TRUE',
        explanation: explanation.trim()
      };
    } else if (activeTab === 'reading-tfng') {
      if (!readingPassage.trim() || !readingStatement.trim()) {
        setErrorMsg(isEn ? 'Please enter both reading excerpt and verification statement.' : 'Vui lòng nhập đoạn trích bài đọc và câu khẳng định.');
        return;
      }
      specificData = {
        passage: readingPassage.trim(),
        statement: readingStatement.trim(),
        correctOption: tfngAnswer,
        explanation: explanation.trim()
      };
    } else if (activeTab === 'speaking-area') {
      if (!speakingQuestion.trim()) {
        setErrorMsg(isEn ? 'Please enter an interview question.' : 'Vui lòng nhập câu hỏi phỏng vấn.');
        return;
      }
      specificData = {
        question: speakingQuestion.trim(),
        modelAnswer: {
          answer: areaAnswer.trim(),
          reason: areaReason.trim(),
          example: areaExample.trim(),
          alternative: areaAlternative.trim()
        },
        answer: areaAnswer.trim(),
        reason: areaReason.trim(),
        example: areaExample.trim(),
        alternative: areaAlternative.trim()
      };
    } else if (activeTab === 'speaking-fillers') {
      if (!fillerQuestion.trim() || !fillerPhrase.trim()) {
        setErrorMsg(isEn ? 'Please enter the question and target filler phrase.' : 'Vui lòng nhập câu hỏi và cụm từ đệm chiến thuật.');
        return;
      }
      specificData = {
        question: fillerQuestion.trim(),
        targetFiller: fillerPhrase.trim(),
        fillerPhrase: fillerPhrase.trim(),
        modelResponse: fillerModelResponse.trim(),
        explanation: explanation.trim()
      };
    } else if (activeTab === 'speaking-part3-counter') {
      if (!part3Question.trim()) {
        setErrorMsg(isEn ? 'Please enter the Part 3 discussion question.' : 'Vui lòng nhập câu hỏi thảo luận Part 3.');
        return;
      }
      specificData = {
        question: part3Question.trim(),
        counterArgument: part3Counter.trim(),
        modelResponse: part3Model.trim(),
        explanation: explanation.trim()
      };
    } else if (activeTab === 'listening-dictation') {
      if (!listeningAudioText.trim()) {
        setErrorMsg(isEn ? 'Please enter the audio speech script.' : 'Vui lòng nhập văn bản phát âm/chép chính tả (Audio text).');
        return;
      }
      specificData = {
        audioText: listeningAudioText.trim(),
        targetTranscript: listeningAudioText.trim(),
        trapNote: listeningTrapNote.trim()
      };
    } else if (activeTab === 'listening-spelling') {
      if (!listeningAudioText.trim() || !listeningAnswer.trim()) {
        setErrorMsg(isEn ? 'Please enter the spelling text and exact answer.' : 'Vui lòng nhập âm đọc đánh vần và đáp án chính xác.');
        return;
      }
      specificData = {
        questionPrompt: isEn ? `Listen and transcribe accurately: ${title || 'Name/Number'}` : `Nghe và viết lại chính xác: ${title || 'Tên/Con số'}`,
        audioText: listeningAudioText.trim(),
        correctAnswer: listeningAnswer.trim(),
        trapNote: listeningTrapNote.trim()
      };
    } else {
      // Fallback
      specificData = {
        content: sentenceWithBlank.trim() || originalSentence.trim() || readingPassage.trim(),
        explanation: explanation.trim()
      };
    }

    const newDrill = {
      id: `drill-manual-${Date.now()}`,
      type: activeTab,
      room: activeRoom,
      title: drillTitle,
      category: drillCategory,
      isManual: true,
      isCustom: true,
      isAiGenerated: false,
      source: 'manual',
      isPublic: Boolean(isPublic),
      isCommunity: Boolean(isPublic),
      creatorEmail: isPublic 
        ? (currentUser?.email ? currentUser.email.split('@')[0] : (isEn ? 'IELTS Community' : 'Cộng Đồng IELTS')) 
        : (isEn ? 'Me' : 'Tôi'),
      createdAt: new Date().toISOString(),
      ...specificData
    };

    onDrillCreated(newDrill, isPublic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] border border-slate-200">
        
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xs">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                  {isEn ? 'Create Custom Micro-Drill' : 'Tạo Bài Luyện Bổ Trợ Thủ Công'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isEn ? '✍️ Custom' : '✍️ Thủ công'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isEn ? 'Room:' : 'Phòng luyện:'} <strong className="capitalize text-slate-700">{activeRoom}</strong> • {isEn ? 'Type:' : 'Dạng:'} <span className="font-mono text-emerald-700">{activeTab}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
          
          {/* Quick Preset Banner */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-900">
              <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-semibold text-xs">{isEn ? 'Want to quickly load a standard preset for this drill type?' : 'Bạn muốn tạo nhanh mẫu chuẩn dạng này?'}</span>
            </div>
            <button
              type="button"
              onClick={handleLoadPreset}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isEn ? 'Load Preset' : 'Nạp Mẫu Gợi Ý'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isEn ? 'Drill Title:' : 'Tiêu Đề Bài Luyện (Title):'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isEn ? 'e.g. C1 Collocations in Task 2' : 'VD: C1 Collocations in Task 2'}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isEn ? 'Category / Tag:' : 'Chuyên Mục / Nhãn (Category):'}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={isEn ? 'e.g. Lexical Resource, Fluency...' : 'VD: Lexical Resource, Fluency...'}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white font-medium"
              />
            </div>
          </div>

          {/* 1. DYNAMIC FORMS ACCORDING TO TAB */}

          {/* A. FILL BLANKS / COLLOCATIONS */}
          {(activeTab === 'fill-blanks' || activeTab === 'collocation' || activeTab === 'speaking-collocations') && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Sentence with [blank] placeholder:' : 'Câu Văn Bản Có Chứa Vị Trí Trống [blank]:'}
                </label>
                <textarea
                  rows={3}
                  value={sentenceWithBlank}
                  onChange={(e) => setSentenceWithBlank(e.target.value)}
                  placeholder={isEn ? 'e.g. The rapid expansion of cities has [blank] affected natural wildlife habitats.' : 'VD: The rapid expansion of cities has [blank] affected natural wildlife habitats.'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-sans leading-relaxed focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isEn ? 'Options (separated by commas):' : 'Các Lựa Chọn (Tách nhau bằng dấu phẩy):'}
                  </label>
                  <input
                    type="text"
                    value={optionsStr}
                    onChange={(e) => setOptionsStr(e.target.value)}
                    placeholder={isEn ? 'e.g. adversely, positively, gently, softly' : 'VD: adversely, positively, gently, softly'}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isEn ? 'Correct Answer:' : 'Đáp Án Chính Xác:'}
                  </label>
                  <input
                    type="text"
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    placeholder={isEn ? 'e.g. adversely' : 'VD: adversely'}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-bold text-emerald-800"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* B. PARAPHRASE */}
          {activeTab === 'paraphrase' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Original Sentence:' : 'Câu Gốc Cần Viết Lại (Original Sentence):'}
                </label>
                <textarea
                  rows={2}
                  value={originalSentence}
                  onChange={(e) => setOriginalSentence(e.target.value)}
                  placeholder={isEn ? 'e.g. Many people believe that space exploration wastes financial resources.' : 'VD: Many people believe that space exploration wastes financial resources.'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Target Band 8.0+ Model Paraphrase:' : 'Câu Paraphrase Band 8.0+ Mục Tiêu (Target Model):'}
                </label>
                <textarea
                  rows={2}
                  value={targetParaphrase}
                  onChange={(e) => setTargetParaphrase(e.target.value)}
                  placeholder={isEn ? 'e.g. A significant proportion of the public argues that interstellar missions squander public funds.' : 'VD: A significant proportion of the public argues that interstellar missions squander public funds.'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-emerald-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Suggested Keywords (separated by commas):' : 'Từ Khóa Gợi Ý (Keywords, cách nhau bằng dấu phẩy):'}
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder={isEn ? 'e.g. interstellar missions, squander public funds, proportion of the public' : 'VD: interstellar missions, squander public funds, proportion of the public'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                />
              </div>
            </div>
          )}

          {/* C. TRUE / FALSE */}
          {activeTab === 'true-false' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Statement:' : 'Câu Khẳng Định (Statement):'}
                </label>
                <textarea
                  rows={2}
                  value={tfStatement}
                  onChange={(e) => setTfStatement(e.target.value)}
                  placeholder={isEn ? "e.g. In formal academic essays, contractions like 'don't' or 'can't' are strictly acceptable." : "VD: In formal academic essays, contractions like 'don't' or 'can't' are strictly acceptable."}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Correct Answer:' : 'Đáp Án Đúng:'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTfAnswer('TRUE')}
                    className={`flex-1 py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                      tfAnswer === 'TRUE' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {isEn ? 'TRUE (Correct)' : 'TRUE (Đúng)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTfAnswer('FALSE')}
                    className={`flex-1 py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                      tfAnswer === 'FALSE' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {isEn ? 'FALSE (Incorrect)' : 'FALSE (Sai)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* D. READING TFNG */}
          {activeTab === 'reading-tfng' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Reading Excerpt:' : 'Đoạn Trích Bài Đọc (Reading Excerpt):'}
                </label>
                <textarea
                  rows={4}
                  value={readingPassage}
                  onChange={(e) => setReadingPassage(e.target.value)}
                  placeholder={isEn ? 'Paste academic reading passage excerpt here...' : 'Dán đoạn trích bài đọc học thuật tại đây...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-serif leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Verification Statement:' : 'Phát Biểu Cần Xác Thực (Statement):'}
                </label>
                <textarea
                  rows={2}
                  value={readingStatement}
                  onChange={(e) => setReadingStatement(e.target.value)}
                  placeholder={isEn ? 'Paste verification statement here...' : 'Dán phát biểu kiểm tra...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Correct Answer:' : 'Đáp Án Đúng:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((ans) => (
                    <button
                      key={ans}
                      type="button"
                      onClick={() => setTfngAnswer(ans)}
                      className={`py-2 rounded-lg font-bold border text-xs transition-all cursor-pointer ${
                        tfngAnswer === ans 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* E. SPEAKING A.R.E.A */}
          {activeTab === 'speaking-area' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Speaking Question:' : 'Câu Hỏi Phỏng Vấn (Speaking Question):'}
                </label>
                <input
                  type="text"
                  value={speakingQuestion}
                  onChange={(e) => setSpeakingQuestion(e.target.value)}
                  placeholder={isEn ? 'e.g. Do you enjoy cooking at home?' : 'VD: Do you enjoy cooking at home?'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                  required
                />
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">{isEn ? 'A - Answer (Direct answer):' : 'A - Answer (Trả lời trực tiếp):'}</span>
                  <input
                    type="text"
                    value={areaAnswer}
                    onChange={(e) => setAreaAnswer(e.target.value)}
                    placeholder={isEn ? 'e.g. Absolutely, I find preparing my own meals deeply rewarding...' : 'VD: Absolutely, I find preparing my own meals deeply rewarding...'}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-800 block mb-0.5">{isEn ? 'R - Reason (Core reason):' : 'R - Reason (Giải thích lý do cốt lõi):'}</span>
                  <input
                    type="text"
                    value={areaReason}
                    onChange={(e) => setAreaReason(e.target.value)}
                    placeholder={isEn ? 'e.g. It allows me to control ingredients and unwind after strenuous working hours...' : 'VD: It allows me to control ingredients and unwind after strenuous working hours...'}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 block mb-0.5">{isEn ? 'E - Example (Specific example):' : 'E - Example (Dẫn chứng cụ thể):'}</span>
                  <input
                    type="text"
                    value={areaExample}
                    onChange={(e) => setAreaExample(e.target.value)}
                    placeholder={isEn ? 'e.g. For instance, every Sunday I experiment with new Mediterranean recipes...' : 'VD: For instance, every Sunday I experiment with new Mediterranean recipes...'}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-800 block mb-0.5">{isEn ? 'A - Alternative/Impact (Contrast/Impact):' : 'A - Alternative/Impact (Hệ quả/Góc nhìn khác):'}</span>
                  <input
                    type="text"
                    value={areaAlternative}
                    onChange={(e) => setAreaAlternative(e.target.value)}
                    placeholder={isEn ? 'e.g. Without this culinary routine, I would rely excessively on greasy processed takeaways.' : 'VD: Without this culinary routine, I would rely excessively on greasy processed takeaways.'}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* F. SPEAKING FILLERS */}
          {activeTab === 'speaking-fillers' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Challenging / Abstract Question:' : 'Câu Hỏi Hóc Búa / Trừu Tượng:'}
                </label>
                <input
                  type="text"
                  value={fillerQuestion}
                  onChange={(e) => setFillerQuestion(e.target.value)}
                  placeholder={isEn ? 'e.g. How will quantum computing influence future financial institutions?' : 'VD: How will quantum computing influence future financial institutions?'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Target Tactical Filler (Buying Time):' : 'Cụm Từ Đệm Chiến Thuật Mua Thời Gian (Target Filler):'}
                </label>
                <input
                  type="text"
                  value={fillerPhrase}
                  onChange={(e) => setFillerPhrase(e.target.value)}
                  placeholder={isEn ? 'e.g. To be completely candid, that is an intriguing technical question...' : 'VD: To be completely candid, that is an intriguing technical question...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-bold text-emerald-800"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Complete Model Response:' : 'Câu Trả Lời Mẫu Hoàn Chỉnh (Model Response):'}
                </label>
                <textarea
                  rows={3}
                  value={fillerModelResponse}
                  onChange={(e) => setFillerModelResponse(e.target.value)}
                  placeholder={isEn ? 'Paste complete model response with filler...' : 'Dán câu trả lời mẫu có gắn kết cụm filler...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* G. SPEAKING PART 3 COUNTER */}
          {activeTab === 'speaking-part3-counter' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Part 3 Discussion Question:' : 'Câu Hỏi Phản Biện Part 3:'}
                </label>
                <input
                  type="text"
                  value={part3Question}
                  onChange={(e) => setPart3Question(e.target.value)}
                  placeholder={isEn ? 'e.g. Should university tuition be completely waived by the central government?' : 'VD: Should university tuition be completely waived by the central government?'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Counter-Argument / Critical Angle:' : 'Luận Điểm Đối Nghịch / Bẫy Tư Duy (Counter-argument):'}
                </label>
                <input
                  type="text"
                  value={part3Counter}
                  onChange={(e) => setPart3Counter(e.target.value)}
                  placeholder={isEn ? 'e.g. While free tertiary education fosters equality, it places enormous pressure on taxpayer revenues.' : 'VD: While free tertiary education fosters equality, it places enormous pressure on taxpayer revenues.'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Multi-Angle Model Response:' : 'Câu Trả Lời Đa Chiều Mẫu:'}
                </label>
                <textarea
                  rows={3}
                  value={part3Model}
                  onChange={(e) => setPart3Model(e.target.value)}
                  placeholder={isEn ? 'Paste multi-dimensional analytical response...' : 'Dán câu trả lời phân tích đa chiều...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* H. LISTENING DICTATION & SPELLING */}
          {(activeTab === 'listening-dictation' || activeTab === 'listening-spelling') && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Audio Speech Script:' : 'Văn Bản Phát Âm (Audio Speech Script):'}
                </label>
                <textarea
                  rows={3}
                  value={listeningAudioText}
                  onChange={(e) => setListeningAudioText(e.target.value)}
                  placeholder={isEn ? 'Enter dialogue excerpt or English sentence for dictation...' : 'Nhập đoạn thoại hoặc câu tiếng Anh cần phát âm cho học viên chép chính tả...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-sans leading-relaxed"
                  required
                />
              </div>

              {activeTab === 'listening-spelling' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isEn ? 'Correct Answer to Transcribe:' : 'Đáp Án Chính Xác Cần Điền:'}
                  </label>
                  <input
                    type="text"
                    value={listeningAnswer}
                    onChange={(e) => setListeningAnswer(e.target.value)}
                    placeholder="VD: Featherstonehaugh"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-bold text-purple-900"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Phonetic / Stress Trap Note:' : 'Ghi Chú Bẫy Phát Âm / Trọng Âm (Trap Note):'}
                </label>
                <input
                  type="text"
                  value={listeningTrapNote}
                  onChange={(e) => setListeningTrapNote(e.target.value)}
                  placeholder={isEn ? 'e.g. Watch out for linking sounds or silent consonants...' : 'VD: Cảnh giác nối âm liên từ hoặc âm câm...'}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>

              {/* Zero Storage Notice */}
              <div className="p-2.5 rounded-lg bg-purple-50/80 border border-purple-200/60 text-[11px] text-purple-900 flex items-start space-x-2">
                <span className="shrink-0 mt-0.5">ℹ️</span>
                <span>
                  <strong>{isEn ? 'Automated speech synthesis:' : 'Hệ thống phát âm tự động:'}</strong> {isEn ? `Custom listening drills synthesize native audio from text (Zero Storage). Direct audio uploads are restricted to Administrators (${OWNER_EMAIL}).` : `Bài tập nghe thủ công sử dụng văn bản để tạo giọng đọc bản ngữ trực tiếp (Zero Storage). Do dung lượng website giới hạn, việc tải lên tệp âm thanh trực tiếp hiện chỉ dành riêng cho Quản trị viên (${OWNER_EMAIL}).`}
                </span>
              </div>
            </div>
          )}

          {/* Universal Explanation Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isEn ? 'Detailed Explanation & Exam Tips:' : 'Giải Thích Chi Tiết & Mẹo Làm Bài (Explanation):'}
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={isEn ? 'Explain grammar, vocabulary, or exam strategies for students...' : 'Giải thích ngữ pháp, từ vựng hoặc mẹo thi cử để học viên ghi nhớ...'}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
            />
          </div>

          {/* Privacy & Auto-Sharing */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 pr-2">
              <div className={`p-2 rounded-lg shrink-0 ${isPublic ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{isPublic ? (isEn ? 'Automatically share to Community Library' : 'Tự động chia sẻ lên Thư viện Cộng đồng') : (isEn ? 'Save privately in your account' : 'Chỉ lưu riêng tư trong tài khoản')}</span>
                  {isPublic && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">{isEn ? 'Public Resource' : 'Tài nguyên chung'}</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                  {isPublic 
                    ? (isEn ? 'This drill will be contributed to the shared community library for all users to practice. Turn off to keep it private.' : 'Bài tập sẽ tự động góp vào kho bài tập chung cho mọi người cùng luyện. Tắt nếu bạn muốn giữ riêng.') 
                    : (isEn ? 'Only your account can view this drill.' : 'Chỉ riêng tài khoản của bạn mới thấy bài tập này.')}
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

          {/* Form Actions */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Hủy Bỏ'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
            >
              <PenTool className="w-4 h-4" />
              <span>{isEn ? 'Save Custom Drill' : 'Lưu Bài Tập Thủ Công'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
