import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Headphones, 
  X, 
  Link as LinkIcon, 
  FileText, 
  Play, 
  Pause, 
  CheckCircle2, 
  Search, 
  Check, 
  Volume2, 
  Info, 
  ArrowRight, 
  Wand2, 
  Compass, 
  Clock,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  FolderOpen,
  Globe,
  Lock,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { saveAudioBlob } from '../../utils/audioStorage';
import { 
  generateListeningTestFromAudio, 
  analyzeAudioAndSuggestParts,
  discoverListeningAudioSources 
} from '../../services/geminiService';
import { CURATED_LISTENING_AUDIO_SOURCES } from '../../data/listening/curatedAudioSources';
import { isOwnerUser, OWNER_AUDIO_RESTRICTION_MESSAGE, OWNER_EMAIL } from '../../utils/userPermissions';
import { useTranslation } from '../../i18n';

export default function ListeningURLExerciseGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model = 'gemini-2.5-flash',
  onTestGenerated,
  onOpenSettings,
  user = null
}) {
  if (!isOpen) return null;

  const { t, language } = useTranslation();
  const isEn = language === 'en';

  const isOwner = isOwnerUser(user);

  // Active Tab: default to curated for non-owners, upload for owner
  const [activeTab, setActiveTab] = useState(() => isOwner ? 'upload' : 'curated');

  // Form Fields
  const [audioUrl, setAudioUrl] = useState('');
  const [fallbackAudioUrl, setFallbackAudioUrl] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);
  
  // Single-Part Selection: strictly 1, 2, 3, or 4
  const [selectedPart, setSelectedPart] = useState(1);

  // Curated & Dynamic AI Sources
  const [discoveredSources, setDiscoveredSources] = useState([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryTopic, setDiscoveryTopic] = useState('');
  const [discoveryPartPref, setDiscoveryPartPref] = useState('all'); // 'all' | '1' | '2' | '3' | '4'
  const [lastDiscoveryResult, setLastDiscoveryResult] = useState(null); // { count, timeStr, topic }

  // Search & Filter in list
  const [partFilter, setPartFilter] = useState('all'); // 'all' | 1 | 2 | 3 | 4
  const [curatedSearch, setCuratedSearch] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Audio Preview state
  const [previewingId, setPreviewingId] = useState(null);
  const previewAudioRef = useRef(null);
  const cardsGridRef = useRef(null);

  // Uploaded Local File State
  const [uploadedAudioInfo, setUploadedAudioInfo] = useState(null); // { name, sizeMB, objectUrl, base64, mimeType, storageId }
  const fileInputRef = useRef(null);

  // Custom URL AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Generator states
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioTestStatus, setAudioTestStatus] = useState(null); // 'testing' | 'valid' | 'invalid'

  // Sharing & Privacy State: Defaults to true for AI/URL exercises, forced false for user uploaded audio
  const [isPublic, setIsPublic] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  // Combined sources: dynamically discovered by AI first, followed by curated
  const allSources = useMemo(() => {
    return [...discoveredSources, ...CURATED_LISTENING_AUDIO_SOURCES];
  }, [discoveredSources]);

  // Counts per part for quick filter badges
  const partCounts = useMemo(() => {
    const counts = { all: allSources.length, 1: 0, 2: 0, 3: 0, 4: 0 };
    allSources.forEach(src => {
      if (Array.isArray(src.suggestedParts)) {
        src.suggestedParts.forEach(p => {
          if (counts[p] !== undefined) counts[p]++;
        });
      }
    });
    return counts;
  }, [allSources]);

  // Filter curated and discovered sources
  const filteredSources = useMemo(() => {
    return allSources.filter(src => {
      if (partFilter !== 'all' && !src.suggestedParts.includes(Number(partFilter))) {
        return false;
      }
      if (curatedSearch.trim()) {
        const q = curatedSearch.toLowerCase();
        return (
          src.title.toLowerCase().includes(q) ||
          src.context.toLowerCase().includes(q) ||
          src.accent.toLowerCase().includes(q) ||
          src.aiReasoning.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allSources, partFilter, curatedSearch]);

  // Audio preview handler
  const handleTogglePreview = (sourceId, url) => {
    if (previewingId === sourceId) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewingId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      setPreviewingId(sourceId);
      audio.play().catch(e => {
        console.warn('Preview play error:', e);
        setPreviewingId(null);
      });
      audio.onended = () => setPreviewingId(null);
      audio.onerror = () => setPreviewingId(null);
    }
  };

  // Play subtle positive chime when results arrive
  const playPositiveChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  };

  // Dynamically trigger AI to search & discover new audio sources
  const handleDiscoverMoreSources = async (prefPart = null, topicOverride = null) => {
    if (!apiKey) {
      setErrorMessage(isEn ? 'Please configure your AI API Key before searching for sources.' : 'Vui lòng cấu hình AI API Key trước khi sử dụng AI tìm kiếm nguồn.');
      return;
    }

    setIsDiscovering(true);
    setErrorMessage('');

    try {
      const effectivePart = prefPart !== null 
        ? (prefPart === 'all' ? null : Number(prefPart))
        : (discoveryPartPref === 'all' ? null : Number(discoveryPartPref));

      const effectiveTopic = topicOverride !== null ? topicOverride : discoveryTopic;

      const newSources = await discoverListeningAudioSources({
        topicKeyword: effectiveTopic,
        targetPartPreference: effectivePart,
        apiKey,
        model
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString(isEn ? 'en-US' : 'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (newSources.length === 0) {
        setErrorMessage(isEn ? 'AI could not find suitable new sources. Try changing the topic keywords.' : 'AI không tìm thấy thêm nguồn mới phù hợp. Hãy thử thay đổi từ khóa chủ đề.');
      } else {
        const taggedSources = newSources.map(s => ({
          ...s,
          discoveredAt: Date.now(),
          discoveredTimeStr: timeStr
        }));

        setDiscoveredSources(prev => [...taggedSources, ...prev]);
        setLastDiscoveryResult({
          count: newSources.length,
          timeStr,
          topic: effectiveTopic
        });

        playPositiveChime();

        if (effectivePart) {
          setPartFilter(effectivePart);
        } else {
          setPartFilter('all');
        }

        setTimeout(() => {
          if (cardsGridRef.current) {
            cardsGridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
      }
    } catch (err) {
      console.error('Error in AI audio search:', err);
      setErrorMessage(err.message || (isEn ? 'Error searching for audio sources with AI. Please try again.' : 'Lỗi khi AI tìm kiếm nguồn âm thanh. Vui lòng thử lại.'));
    } finally {
      setIsDiscovering(false);
    }
  };

  // Select audio source (toggles deselect if clicked again)
  const handleSelectSource = (src) => {
    // If user clicked the already selected source -> Toggle Deselect!
    if (selectedSource?.id === src.id || (audioUrl === src.audioUrl && selectedSource)) {
      setSelectedSource(null);
      setAudioUrl('');
      setFallbackAudioUrl('');
      setTestTitle('');
      setTopicDescription('');
      setTranscriptText('');
      setAudioTestStatus(null);
      setAnalysisResult(null);
      setErrorMessage('');
      return;
    }

    // Keep current selectedPart if suitable, or adapt to source's primary suggestion
    let targetP = selectedPart;
    if (src.suggestedParts && src.suggestedParts.length > 0) {
      if (!src.suggestedParts.includes(selectedPart)) {
        targetP = src.suggestedParts[0];
      }
    }

    setSelectedSource(src);
    setAudioUrl(src.audioUrl);
    setFallbackAudioUrl(src.fallbackAudioUrl || '');
    setSelectedPart(targetP);
    setTestTitle(`${src.title} (Part ${targetP})`);
    setTopicDescription(src.context || '');
    if (src.sampleTranscriptSnippet) {
      setTranscriptText(src.sampleTranscriptSnippet);
    }
    setAudioTestStatus('valid');
    setErrorMessage('');

    setAnalysisResult({
      primaryPart: targetP,
      suggestedParts: src.suggestedParts,
      reasoning: src.aiReasoning,
      recommendedQuestionTypes: src.recommendedQuestionTypes,
      detectedContext: src.context,
      detectedSpeakers: src.speakers
    });
  };

  // Handle Uploading Local Audio File (.mp3, .m4a, .wav)
  const handleAudioFileUpload = async (file) => {
    if (!file) return;

    if (!isOwner) {
      setErrorMessage(OWNER_AUDIO_RESTRICTION_MESSAGE);
      alert(OWNER_AUDIO_RESTRICTION_MESSAGE);
      return;
    }

    setErrorMessage('');

    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a', 'audio/wav', 'audio/ogg'];
    const ext = file.name.split('.').pop().toLowerCase();
    const isValidExt = ['mp3', 'm4a', 'wav', 'ogg'].includes(ext);

    if (!validTypes.includes(file.type) && !isValidExt) {
      setErrorMessage(isEn ? 'Unsupported file format. Please select a .mp3, .m4a, .wav, or .ogg file.' : 'Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp .mp3, .m4a, .wav hoặc .ogg.');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage(isEn ? 'Audio file too large (max 30MB). Please compress or choose a smaller file.' : 'Tệp âm thanh quá lớn (tối đa 30MB). Vui lòng nén hoặc chọn file nhẹ hơn.');
      return;
    }

    try {
      const storageId = `local-audio-${Date.now()}`;
      await saveAudioBlob(storageId, file, { name: file.name });
      const objUrl = URL.createObjectURL(file);

      // Convert to base64 if <= 20MB for Gemini direct multimodal audio input
      let base64 = null;
      if (file.size <= 20 * 1024 * 1024) {
        base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const res = reader.result;
            const base64Data = typeof res === 'string' ? res.split(',')[1] : null;
            resolve(base64Data);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      }

      const mime = file.type || 'audio/mpeg';

      setUploadedAudioInfo({
        name: file.name,
        sizeMB,
        objectUrl: objUrl,
        base64,
        mimeType: mime,
        storageId
      });

      setAudioUrl(objUrl);
      setSelectedSource(null);
      setAudioTestStatus('valid');

      // Auto-set title from filename
      const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTestTitle(`${rawName} (Part ${selectedPart})`);
      setTopicDescription(isEn ? `Audio recording: ${file.name}` : `File ghi âm: ${file.name}`);

      // If Gemini API Key is available, automatically trigger AI to listen & analyze suitable Parts
      if (apiKey) {
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeAudioAndSuggestParts({
            audioUrl: objUrl,
            audioBase64: base64,
            audioMimeType: mime,
            topicOrTitle: file.name,
            transcriptSnippet: '',
            apiKey,
            model
          });
          setAnalysisResult(analysis);
          if (analysis.primaryPart) {
            handleSwitchPart(Number(analysis.primaryPart));
          } else if (Array.isArray(analysis.suggestedParts) && analysis.suggestedParts.length > 0) {
            handleSwitchPart(Number(analysis.suggestedParts[0]));
          }
        } catch (analysisErr) {
          console.warn('AI analysis on uploaded file non-fatal error:', analysisErr);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (err) {
      console.error('Error handling local audio upload:', err);
      setErrorMessage(isEn ? 'Could not read audio file from computer. Please try again.' : 'Không thể đọc file âm thanh từ máy tính. Vui lòng thử lại.');
    }
  };

  const handleClearUploadedAudio = () => {
    if (uploadedAudioInfo?.objectUrl) {
      try { URL.revokeObjectURL(uploadedAudioInfo.objectUrl); } catch (e) {}
    }
    setUploadedAudioInfo(null);
    setAudioUrl('');
    setTestTitle('');
    setTopicDescription('');
    setAudioTestStatus(null);
  };

  // Switch part selection for current source
  const handleSwitchPart = (pNum) => {
    setSelectedPart(pNum);
    if (selectedSource) {
      setTestTitle(`${selectedSource.title} (Part ${pNum})`);
    } else if (testTitle) {
      setTestTitle(prev => {
        if (/\(Part \d\)/i.test(prev)) {
          return prev.replace(/\(Part \d\)/i, `(Part ${pNum})`);
        }
        return `${prev} (Part ${pNum})`;
      });
    }
  };

  // Test URL reachability
  const handleTestAudioUrl = () => {
    if (!audioUrl.trim()) {
      setErrorMessage(isEn ? 'Please enter an audio file URL.' : 'Vui lòng nhập đường dẫn URL tệp âm thanh.');
      return;
    }
    setAudioTestStatus('testing');
    setErrorMessage('');

    const testAudio = new Audio();
    testAudio.src = audioUrl.trim();

    const timer = setTimeout(() => {
      setAudioTestStatus('invalid');
      setErrorMessage(isEn ? 'URL is slow to respond or does not support CORS direct streaming. You can still proceed if the link works in your browser.' : 'URL phản hồi chậm hoặc không hỗ trợ phát trực tiếp qua CORS. Bạn vẫn có thể tiếp tục nếu link chạy được trên trình duyệt.');
    }, 8000);

    testAudio.onloadedmetadata = () => {
      clearTimeout(timer);
      setAudioTestStatus('valid');
      testAudio.play().catch(() => {});
      setTimeout(() => {
        testAudio.pause();
      }, 4000);
    };

    testAudio.onerror = () => {
      clearTimeout(timer);
      setAudioTestStatus('invalid');
      setErrorMessage(isEn ? 'Cannot play audio from this link. Please check the file format (.mp3, .m4a, .ogg) or access permissions.' : 'Không thể phát âm thanh từ link này. Vui lòng kiểm tra lại định dạng tệp (hỗ trợ .mp3, .m4a, .ogg) hoặc quyền truy cập.');
    };
  };

  // Analyze Custom URL or Topic with AI
  const handleAnalyzeCustomInput = async () => {
    if (!apiKey) {
      setErrorMessage(isEn ? 'Please configure your AI API Key before using AI.' : 'Vui lòng cấu hình AI API Key trước khi sử dụng AI.');
      return;
    }
    if (!audioUrl.trim() && !topicDescription.trim() && !testTitle.trim()) {
      setErrorMessage(isEn ? 'Please enter an audio URL or title/topic description for AI analysis.' : 'Vui lòng nhập URL âm thanh hoặc nhập tiêu đề/bối cảnh đề thi để AI phân tích.');
      return;
    }
    setIsAnalyzing(true);
    setErrorMessage('');
    try {
      const res = await analyzeAudioAndSuggestParts({
        audioUrl: audioUrl.trim(),
        topicOrTitle: testTitle.trim() || topicDescription.trim(),
        transcriptSnippet: transcriptText.trim(),
        apiKey,
        model
      });
      setAnalysisResult(res);
      if (res.primaryPart) {
        handleSwitchPart(Number(res.primaryPart));
      }
    } catch (err) {
      console.error('Error in AI analysis of audio source:', err);
      setErrorMessage(err.message || (isEn ? 'Could not analyze audio. Please try again.' : 'Không thể phân tích âm thanh. Vui lòng thử lại.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Single-Part Listening Test
  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMessage(isEn ? 'Please configure your AI API Key before using AI.' : 'Vui lòng cấu hình AI API Key trước khi sử dụng AI.');
      return;
    }

    if (!audioUrl.trim()) {
      setErrorMessage(isEn ? 'Please select an audio source or enter an audio file URL.' : 'Vui lòng chọn 1 nguồn âm thanh hoặc nhập URL tệp âm thanh.');
      return;
    }

    if (uploadedAudioInfo && !isOwner) {
      setErrorMessage(OWNER_AUDIO_RESTRICTION_MESSAGE);
      alert(OWNER_AUDIO_RESTRICTION_MESSAGE);
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const generated = await generateListeningTestFromAudio({
        audioUrl: audioUrl.trim(),
        fallbackAudioUrl: fallbackAudioUrl.trim(),
        audioBase64: uploadedAudioInfo?.base64 || null,
        audioMimeType: uploadedAudioInfo?.mimeType || 'audio/mp3',
        testTitle: testTitle.trim() || `IELTS Listening Part ${selectedPart} Practice`,
        topicDescription: topicDescription.trim(),
        transcriptText: transcriptText.trim(),
        targetPart: selectedPart,
        apiKey,
        model
      });

      const isFromUploadedFile = Boolean(uploadedAudioInfo);

      const fullCustomTest = {
        ...generated,
        id: `custom-listening-${Date.now()}`,
        isCustom: true,
        isSinglePart: true,
        targetPart: selectedPart,
        isEphemeral: isFromUploadedFile, // Auto-deleted after exam submission to save website storage
        isUploadedFile: isFromUploadedFile,
        isPublic: isFromUploadedFile ? false : Boolean(isPublic), // User uploaded audio is strictly private (Zero-Storage), URL/AI is public by default
        audioStorageId: uploadedAudioInfo?.storageId || null,
        createdAt: new Date().toISOString()
      };

      if (onTestGenerated) {
        onTestGenerated(fullCustomTest);
      }
      onClose();
    } catch (err) {
      console.error('Error generating AI listening test:', err);
      setErrorMessage(err.message || (isEn ? 'System error while generating listening test. Please try again.' : 'Lỗi hệ thống khi sinh đề nghe. Vui lòng thử lại.'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Part specifications metadata
  const PART_SPECS = [
    {
      num: 1,
      title: isEn ? 'Part 1: Everyday Social Conversation' : 'Part 1: Hội Thoại Đời Thường',
      tag: isEn ? '2 speakers • Notes/Form completion' : '2 người • Điền từ / số',
      desc: isEn ? 'Enquiry, booking, insurance, renting (Note/Form completion).' : 'Hỏi đáp dịch vụ, đặt vé, bảo hiểm, thuê nhà (Note/Form completion).'
    },
    {
      num: 2,
      title: isEn ? 'Part 2: Informational Monologue' : 'Part 2: Độc Thoại Hướng Dẫn',
      tag: isEn ? '1 speaker • Multiple Choice / Map' : '1 người • Trắc nghiệm / Bản đồ',
      desc: isEn ? 'Guide to museum, park, community facilities (Multiple Choice/Map).' : 'Giới thiệu bảo tàng, nông trại, tiện ích công cộng (Multiple Choice/Map).'
    },
    {
      num: 3,
      title: isEn ? 'Part 3: Academic Discussion' : 'Part 3: Thảo Luận Học Thuật',
      tag: isEn ? '2-4 speakers • Multiple Choice / Matching' : '2-4 người • Trắc nghiệm / Matching',
      desc: isEn ? 'Students & tutor discussing research project, proposal review.' : 'Sinh viên & giảng viên trao đổi đề tài nghiên cứu, phản biện đề cương.'
    },
    {
      num: 4,
      title: isEn ? 'Part 4: University Lecture' : 'Part 4: Bài Giảng Đại Học',
      tag: isEn ? '1 speaker • ONE WORD ONLY' : '1 người • ONE WORD ONLY',
      desc: isEn ? 'In-depth academic lecture on science, history, ecology.' : 'Bài giảng học thuật chuyên sâu về khoa học, địa lý, lịch sử, sinh thái.'
    }
  ];

  const currentPartSpec = PART_SPECS.find(p => p.num === selectedPart) || PART_SPECS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* COMPACT MODAL HEADER */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-base">
                  {isEn ? 'AI IELTS Listening Test Generator' : 'Sinh Đề Nghe IELTS Bằng AI'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
                  {isEn ? 'Single-Part Mode (10 Questions)' : 'Single-Part Mode (10 Câu)'}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ⚡ 5-8s
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isEn ? 'Select an audio source and click any Part to generate an independent Cambridge-standard test' : 'Chọn nguồn audio & click bất kỳ Part nào để AI sinh đề độc lập chuẩn Cambridge'}
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

        {/* MODAL MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          
          {/* STEP 1: COMPACT MODE TABS (Browse & AI Discover vs Custom URL) */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('curated')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'curated'
                    ? 'bg-white text-purple-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? `📚 Curated Native Audio Library (${allSources.length})` : `📚 Kho Audio Bản Xứ Tuyển Chọn (${allSources.length})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-white text-purple-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{isEn ? '📁 Upload File from Computer' : '📁 Tải File Từ Máy Tính'}</span>
                {isOwner ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">Owner</span>
                ) : (
                  <Lock className="w-3 h-3 text-amber-500" />
                )}
              </button>
            </div>

            {/* Selection indicator badge */}
            {audioUrl && (
              <div className="flex items-center space-x-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px] sm:max-w-[320px]">
                  {selectedSource ? selectedSource.title : audioUrl}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSource(null);
                    setAudioUrl('');
                    setTestTitle('');
                  }}
                  className="text-slate-400 hover:text-rose-600 ml-1"
                  title={isEn ? 'Deselect' : 'Bỏ chọn'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* TAB CONTENT 1: COMPACT SOURCE BROWSER & AI DISCOVERY */}
          {activeTab === 'curated' && (
            <div className="space-y-2.5">
              
              {/* TOP ACTION BAR: Topic search + Part filter + AI Discovery Button */}
              <div className="flex flex-col sm:flex-row gap-1.5 items-stretch sm:items-center justify-between bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                
                {/* Search & Topic input */}
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-purple-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={discoveryTopic}
                    onChange={(e) => {
                      setDiscoveryTopic(e.target.value);
                      setCuratedSearch(e.target.value);
                    }}
                    placeholder={isEn ? 'Quick search by topic (Travel, Interview, Biology...)' : 'Tìm nhanh theo chủ đề (Du lịch, Phỏng vấn, Sinh học...)'}
                    className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-white border border-purple-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {/* Filter Part Pills with Counts */}
                <div className="flex items-center space-x-1 shrink-0 overflow-x-auto scrollbar-none py-0.5">
                  {[
                    { key: 'all', label: isEn ? `All (${partCounts.all})` : `Tất cả (${partCounts.all})` },
                    { key: 1, label: `P1 (${partCounts[1]})` },
                    { key: 2, label: `P2 (${partCounts[2]})` },
                    { key: 3, label: `P3 (${partCounts[3]})` },
                    { key: 4, label: `P4 (${partCounts[4]})` }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setPartFilter(tab.key)}
                      className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        partFilter === tab.key
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* AI Discover More Button */}
                <button
                  type="button"
                  onClick={() => handleDiscoverMoreSources()}
                  disabled={isDiscovering}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shrink-0 flex items-center justify-center space-x-1 shadow-xs cursor-pointer active:scale-95"
                  title={isEn ? 'Let AI search for more conversational audio sources online' : 'Để AI quét tìm thêm các nguồn audio hội thoại mới trên mạng'}
                >
                  {isDiscovering ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{isEn ? 'Scanning...' : 'Đang quét...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isEn ? '✨ AI Discover Sources' : '✨ AI Tìm Nguồn Mới'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Banner when AI returned results */}
              {lastDiscoveryResult && !isDiscovering && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isEn ? <>AI loaded <strong>{lastDiscoveryResult.count}</strong> new sources at {lastDiscoveryResult.timeStr}.</> : <>AI đã nạp thêm <strong>{lastDiscoveryResult.count}</strong> nguồn mới lúc {lastDiscoveryResult.timeStr}.</>}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700">{isEn ? 'Ranked to top of list ↓' : 'Đã xếp lên đầu danh sách ↓'}</span>
                </div>
              )}

              {/* COMPACT AUDIO SOURCE LIST */}
              <div 
                ref={cardsGridRef}
                className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 scroll-smooth"
              >
                {/* Skeleton during discovery */}
                {isDiscovering && (
                  <div className="p-2.5 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 flex items-center justify-center space-x-2 text-xs text-purple-800 font-bold animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <span>{isEn ? 'AI is discovering and classifying new audio sources... Please wait ~3-5s' : 'AI đang tìm kiếm & phân loại nguồn âm thanh mới... Vui lòng đợi ~3-5 giây'}</span>
                  </div>
                )}

                {filteredSources.map(src => {
                  const isPreviewing = previewingId === src.id;
                  const isSelectedSource = audioUrl === src.audioUrl;
                  const isNewlyDiscovered = src.isAIDiscovered && (Date.now() - (src.discoveredAt || 0) < 600000);

                  return (
                    <div
                      key={src.id}
                      onClick={() => handleSelectSource(src)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelectedSource 
                          ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-400/80 shadow-xs' 
                          : isNewlyDiscovered
                          ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400 hover:bg-emerald-50/40'
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Left: Play button, Title, Accent, Duration, Context */}
                      <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                        {/* Mini Audio Preview Play Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePreview(src.id, src.audioUrl);
                          }}
                          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs transition-colors cursor-pointer mt-0.5 ${
                            isPreviewing
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : 'bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700'
                          }`}
                          title={isPreviewing ? (isEn ? 'Pause preview' : 'Tạm dừng nghe thử') : (isEn ? 'Preview 5-10s' : 'Nghe thử 5-10s')}
                        >
                          {isPreviewing ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                            <h5 className="font-bold text-slate-900 text-xs truncate max-w-[260px] sm:max-w-[360px]" title={src.title}>
                              {src.title}
                            </h5>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                              {src.durationText}
                            </span>
                            <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-medium shrink-0">
                              {src.accent}
                            </span>
                            {isNewlyDiscovered && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-black uppercase shrink-0">
                                {isEn ? 'Newly Found' : 'Mới Tìm'}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-[11px] text-slate-500 truncate mt-0.5" title={src.context}>
                            {src.context}
                          </div>
                        </div>
                      </div>

                      {/* Right: AI Recommendation tag & Clean Single Select Button */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {src.suggestedParts && src.suggestedParts.length > 0 && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            {isEn ? `Suggested: Part ${src.suggestedParts.join(', ')}` : `Gợi ý: Part ${src.suggestedParts.join(', ')}`}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSource(src);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
                            isSelectedSource
                              ? 'bg-purple-600 text-white shadow-xs hover:bg-purple-700 ring-1 ring-purple-400'
                              : 'bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 border border-slate-200 hover:border-purple-300'
                          }`}
                          title={isSelectedSource ? (isEn ? 'Click to deselect this source' : 'Nhấn để bỏ chọn nguồn này') : (isEn ? 'Select this audio source' : 'Chọn nguồn âm thanh này')}
                        >
                          {isSelectedSource ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{isEn ? 'Selected' : 'Đang chọn'}</span>
                            </>
                          ) : (
                            <span>{isEn ? 'Select source' : 'Chọn nguồn'}</span>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: UPLOAD AUDIO FILE FROM COMPUTER */}
          {activeTab === 'upload' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              {!isOwner ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 sm:p-5 text-slate-800 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                          {isEn ? 'Upload Audio from Computer is restricted to Administrator' : 'Tính năng tải âm thanh từ máy tính chỉ dành riêng cho Quản trị viên'}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold font-mono">
                          {OWNER_EMAIL}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/90 leading-relaxed">
                        {isEn ? (
                          <>Due to website storage limitations, this feature is restricted to administrator. Please switch to the <strong>Curated Native Audio Library</strong> to practice immediately with over {allSources.length} Cambridge-standard tracks!</>
                        ) : (
                          <>Do dung lượng website giới hạn nên không hỗ trợ tính năng này khi user sử dụng. Bạn vui lòng chuyển sang tab <strong>Kho Audio Bản Xứ Tuyển Chọn</strong> để luyện tập ngay với hơn {allSources.length} bài nghe chuẩn Cambridge!</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                    <span className="text-[11px] text-amber-800">
                      {user?.email ? (isEn ? `Account: ${user.email}` : `Tài khoản: ${user.email}`) : (isEn ? 'Student account' : 'Tài khoản học viên')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('curated')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {isEn ? 'Switch to Curated Audio Library →' : 'Chuyển sang Kho Audio Tuyển Chọn →'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleAudioFileUpload(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-white rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-purple-50/20 flex flex-col items-center justify-center space-y-2"
                  >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAudioFileUpload(file);
                  }}
                  accept="audio/mp3,audio/mpeg,audio/m4a,audio/x-m4a,audio/wav,audio/ogg"
                  className="hidden"
                />

                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {isEn ? <>Drag & drop audio file here or <span className="text-purple-600 underline font-extrabold">browse from computer</span></> : <>Kéo thả file âm thanh vào đây hoặc <span className="text-purple-600 underline font-extrabold">chọn từ máy tính</span></>}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? 'Supports .mp3, .m4a, .wav, .ogg (Max 25MB). AI listens directly to the file!' : 'Hỗ trợ file .mp3, .m4a, .wav, .ogg (Tối đa 25MB). AI tự động nghe trực tiếp file!'}
                  </p>
                </div>
              </div>

              {/* Uploaded File Indicator Card */}
              {uploadedAudioInfo && (
                <div className="space-y-2 animate-in fade-in">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-2.5">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePreview('local-upload', uploadedAudioInfo.objectUrl)}
                        className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 cursor-pointer shadow-xs"
                        title={previewingId === 'local-upload' ? (isEn ? 'Stop preview' : 'Dừng nghe thử') : (isEn ? 'Preview audio' : 'Nghe thử âm thanh')}
                      >
                        {previewingId === 'local-upload' ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 text-xs truncate max-w-[280px]">
                            {uploadedAudioInfo.name}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-mono font-bold">
                            {uploadedAudioInfo.sizeMB} MB
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          {isEn ? '✓ Successfully loaded • AI is analyzing file to suggest optimal Part below' : '✓ Đã nạp thành công • AI đang nghe trực tiếp file để đề xuất Part phù hợp bên dưới'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (apiKey && uploadedAudioInfo) {
                            setIsAnalyzing(true);
                            analyzeAudioAndSuggestParts({
                              audioUrl: uploadedAudioInfo.objectUrl,
                              audioBase64: uploadedAudioInfo.base64,
                              audioMimeType: uploadedAudioInfo.mimeType,
                              topicOrTitle: uploadedAudioInfo.name,
                              transcriptSnippet: '',
                              apiKey,
                              model
                            }).then(res => {
                              setAnalysisResult(res);
                              if (res.primaryPart) handleSwitchPart(Number(res.primaryPart));
                            }).catch(e => console.warn(e))
                            .finally(() => setIsAnalyzing(false));
                          }
                        }}
                        disabled={isAnalyzing}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>{isAnalyzing ? (isEn ? 'Analyzing...' : 'Đang phân tích...') : (isEn ? 'Re-analyze' : 'Phân tích lại')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearUploadedAudio}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                        title={isEn ? 'Remove this file' : 'Xóa tệp này'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* AI Analysis Result Banner for Uploaded File */}
                  {isAnalyzing && (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-purple-700/40 border-t-purple-700 rounded-full animate-spin shrink-0" />
                      <span>{isEn ? 'AI is listening and analyzing audio content to suggest the best Part...' : 'AI đang nghe và phân tích nội dung audio để gợi ý Part phù hợp nhất...'}</span>
                    </div>
                  )}

                  {!isAnalyzing && analysisResult && (
                    <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950 text-xs space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center space-x-1.5 text-purple-900">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>{isEn ? 'AI Suggested Part:' : 'AI Gợi Ý Part Phù Hợp:'}</span>
                        </span>
                        <div className="flex items-center space-x-1">
                          {analysisResult.suggestedParts && analysisResult.suggestedParts.map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handleSwitchPart(p)}
                              className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] transition-all cursor-pointer ${
                                selectedPart === p
                                  ? 'bg-purple-700 text-white shadow-xs'
                                  : 'bg-white text-purple-800 border border-purple-300 hover:bg-purple-100'
                              }`}
                            >
                              Part {p} {selectedPart === p ? (isEn ? '✓ Selected' : '✓ Đang chọn') : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                      {analysisResult.reasoning && (
                        <p className="text-[11px] text-purple-800 leading-relaxed">
                          <strong>{isEn ? 'Reason:' : 'Lý do:'}</strong> {analysisResult.reasoning}
                        </p>
                      )}
                      {analysisResult.detectedSpeakers && (
                        <p className="text-[10px] text-slate-600">
                          <strong>{isEn ? 'Detected speakers:' : 'Người nói nhận diện được:'}</strong> {analysisResult.detectedSpeakers}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Storage Saver Notice */}
              <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  <strong>{isEn ? 'Zero-Storage Privacy Mode' : 'Chế độ tiết kiệm dung lượng'}</strong>: {isEn ? 'Audio file and exam will automatically be released from memory immediately after you submit. Detailed score report and analysis are safely retained.' : 'Tệp âm thanh và đề thi sẽ tự động được giải phóng bộ nhớ ngay sau khi bạn làm bài xong. Báo cáo kết quả và đánh giá chi tiết vẫn được lưu giữ an toàn.'}
                </span>
              </div>
            </>
          )}
        </div>
      )}

          {/* STEP 2: ULTRA-COMPACT 4-PART SEGMENTED SELECTOR */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                <span>{isEn ? 'Select Part to Generate (Choose 1 Part for optimal speed & quality):' : 'Chọn Part Để Sinh Đề (Chỉ chọn 1 Part để tối ưu tốc độ & chất lượng):'}</span>
              </label>
              <span className="text-[11px] text-purple-700 font-bold">
                {isEn ? '10 Questions • ~10 Mins' : '10 Câu • ~10 Phút'}
              </span>
            </div>

            {/* 4 Segmented Part Tabs with Radio Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PART_SPECS.map(p => {
                const isSelected = selectedPart === p.num;
                const isRecommendedForAudio = 
                  analysisResult?.suggestedParts?.includes(p.num) || 
                  analysisResult?.primaryPart === p.num || 
                  selectedSource?.suggestedParts?.includes(p.num);

                return (
                  <button
                    key={p.num}
                    type="button"
                    onClick={() => handleSwitchPart(p.num)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        {/* Radio Circle Indicator */}
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'border-purple-600 bg-purple-600 text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : null}
                        </span>
                        <span className={`text-xs font-black ${
                          isSelected ? 'text-purple-900' : 'text-slate-800'
                        }`}>
                          Part {p.num}
                        </span>
                      </div>

                      {/* Small subtle badge - purely informative, unselected parts stay neutral */}
                      {isRecommendedForAudio && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {isEn ? 'AI Recommended' : 'AI khuyên dùng'}
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] truncate ${
                      isSelected ? 'text-purple-700 font-semibold' : 'text-slate-500'
                    }`}>
                      {p.tag}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic context hint for selected part */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span><strong>{currentPartSpec.title}</strong>: {currentPartSpec.desc}</span>
              {analysisResult?.reasoning && (
                <span className="italic text-purple-800 hidden md:inline ml-2 truncate max-w-[360px]" title={analysisResult.reasoning}>
                  💡 {analysisResult.reasoning}
                </span>
              )}
            </div>
          </div>

          {/* STEP 3: TITLE & TOPIC (COMPACT 1-LINE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-[11px] font-bold text-slate-700">{isEn ? 'Test Title:' : 'Tên bài luyện nghe:'}</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder={`IELTS Listening Part ${selectedPart} Practice`}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[11px] font-bold text-slate-700">{isEn ? 'Audio Context / Topic:' : 'Bối cảnh âm thanh:'}</label>
              <input
                type="text"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder={isEn ? 'E.g.: Service enquiry conversation, travel, biology lecture...' : 'Ví dụ: Hội thoại hỏi đáp dịch vụ, du lịch, bài giảng sinh học...'}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* STEP 4: ADVANCED COLLAPSIBLE OPTIONS (Mirror URL & Transcript) */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
            >
              <span>{showAdvancedOptions ? (isEn ? '▾ Collapse advanced options' : '▾ Thu gọn tùy chọn nâng cao') : (isEn ? '▸ Advanced options (Fallback mirror URL, Transcript)' : '▸ Tùy chọn nâng cao (Link mirror dự phòng, Lời thoại transcript)')}</span>
            </button>

            {showAdvancedOptions && (
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-slate-600">{isEn ? 'Fallback Mirror URL:' : 'Link dự phòng (Fallback URL):'}</label>
                  <input
                    type="url"
                    value={fallbackAudioUrl}
                    onChange={(e) => setFallbackAudioUrl(e.target.value)}
                    placeholder={isEn ? 'Fallback mirror link if primary link is blocked (CORS/404)' : 'Link mirror dự phòng nếu link chính bị chặn (CORS/404)'}
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-slate-600">{isEn ? 'Transcript (if available):' : 'Lời thoại (Transcript có sẵn nếu có):'}</label>
                  <textarea
                    rows={2}
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder={isEn ? 'Paste partial or full transcript if available...' : 'Dán một phần hoặc toàn bộ lời thoại nếu có sẵn...'}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Privacy & Community Auto-Sharing */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 pr-2">
              <div className={`p-2 rounded-lg shrink-0 ${
                uploadedAudioInfo 
                  ? 'bg-amber-100 text-amber-700' 
                  : (isPublic ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700')
              }`}>
                {uploadedAudioInfo ? <Shield className="w-4 h-4" /> : (isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  {uploadedAudioInfo ? (
                    <>
                      <span>{isEn ? 'Personal Audio: 100% Private' : 'Âm thanh cá nhân: Bảo mật riêng tư 100%'}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">Zero-Storage</span>
                    </>
                  ) : (
                    <>
                      <span>{isPublic ? (isEn ? 'Auto-share to Community Library' : 'Tự động chia sẻ lên Thư viện Cộng đồng') : (isEn ? 'Save privately in your account' : 'Chỉ lưu riêng tư trong tài khoản')}</span>
                      {isPublic && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">{isEn ? 'Shared Resource' : 'Tài nguyên chung'}</span>
                      )}
                    </>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                  {uploadedAudioInfo ? (
                    isEn ? 'Audio file uploaded from your device is automatically purged after exam completion per privacy policy.' : 'Tệp âm thanh tải lên từ máy tính của bạn sẽ tự động hủy ngay sau khi thi xong theo chính sách bảo mật.'
                  ) : (
                    isPublic 
                      ? (isEn ? 'Exam generated from public URL is contributed to community library. Turn off if you wish to keep it private.' : 'Đề thi từ URL công khai sẽ tự động góp vào kho đề chung cho mọi người cùng luyện. Tắt nếu bạn muốn giữ riêng.')
                      : (isEn ? 'Only your account can view and practice this exam.' : 'Chỉ riêng tài khoản của bạn mới thấy và làm bài thi này.')
                  )}
                </div>
              </div>
            </div>

            <label className={`relative inline-flex items-center shrink-0 ${uploadedAudioInfo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <input 
                type="checkbox" 
                disabled={Boolean(uploadedAudioInfo)}
                checked={uploadedAudioInfo ? false : isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

        </div>

        {/* COMPACT MODAL FOOTER */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="hidden sm:inline">
              {isEn ? `Generate Part ${selectedPart} (10 questions) • 100% Resource-efficient` : `Sinh đề Part ${selectedPart} (10 câu) • Tiết kiệm 100% tài nguyên`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Hủy'}
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !audioUrl.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{isEn ? `AI Generating Part ${selectedPart} (5-8s)...` : `AI Đang Sinh Part ${selectedPart} (5-8s)...`}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? `Generate Part ${selectedPart} (10 Questions)` : `Tạo Đề Part ${selectedPart} (10 Câu)`}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
