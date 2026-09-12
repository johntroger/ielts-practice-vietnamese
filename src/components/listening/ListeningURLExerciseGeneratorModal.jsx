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
  ChevronUp
} from 'lucide-react';
import { 
  generateListeningTestFromAudio, 
  analyzeAudioAndSuggestParts,
  discoverListeningAudioSources 
} from '../../services/geminiService';
import { CURATED_LISTENING_AUDIO_SOURCES } from '../../data/listening/curatedAudioSources';

export default function ListeningURLExerciseGeneratorModal({
  isOpen,
  onClose,
  apiKey,
  model = 'gemini-2.5-flash',
  onTestGenerated,
  onOpenSettings
}) {
  if (!isOpen) return null;

  // Active Tab: 'curated' (browse & AI discover) | 'custom' (enter URL manually)
  const [activeTab, setActiveTab] = useState('curated');

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

  // Custom URL AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Generator states
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioTestStatus, setAudioTestStatus] = useState(null); // 'testing' | 'valid' | 'invalid'

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
      setErrorMessage('Vui lòng cấu hình Gemini API Key trước khi sử dụng AI tìm kiếm nguồn.');
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
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (newSources.length === 0) {
        setErrorMessage('AI không tìm thấy thêm nguồn mới phù hợp. Hãy thử thay đổi từ khóa chủ đề.');
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
      console.error('Lỗi khi AI tìm nguồn âm thanh:', err);
      setErrorMessage(err.message || 'Lỗi khi AI tìm kiếm nguồn âm thanh. Vui lòng thử lại.');
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
      setErrorMessage('Vui lòng nhập đường dẫn URL tệp âm thanh.');
      return;
    }
    setAudioTestStatus('testing');
    setErrorMessage('');

    const testAudio = new Audio();
    testAudio.src = audioUrl.trim();

    const timer = setTimeout(() => {
      setAudioTestStatus('invalid');
      setErrorMessage('URL phản hồi chậm hoặc không hỗ trợ phát trực tiếp qua CORS. Bạn vẫn có thể tiếp tục nếu link chạy được trên trình duyệt.');
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
      setErrorMessage('Không thể phát âm thanh từ link này. Vui lòng kiểm tra lại định dạng tệp (hỗ trợ .mp3, .m4a, .ogg) hoặc quyền truy cập.');
    };
  };

  // Analyze Custom URL or Topic with AI
  const handleAnalyzeCustomInput = async () => {
    if (!apiKey) {
      setErrorMessage('Vui lòng cấu hình Gemini API Key trước khi sử dụng AI.');
      return;
    }
    if (!audioUrl.trim() && !topicDescription.trim() && !testTitle.trim()) {
      setErrorMessage('Vui lòng nhập URL âm thanh hoặc nhập tiêu đề/bối cảnh đề thi để AI phân tích.');
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
      console.error('Lỗi khi AI phân tích nguồn:', err);
      setErrorMessage(err.message || 'Không thể phân tích âm thanh. Vui lòng thử lại.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Single-Part Listening Test
  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMessage('Vui lòng cấu hình Gemini API Key trước khi sử dụng AI.');
      return;
    }

    if (!audioUrl.trim()) {
      setErrorMessage('Vui lòng chọn 1 nguồn âm thanh hoặc nhập URL tệp âm thanh.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const generated = await generateListeningTestFromAudio({
        audioUrl: audioUrl.trim(),
        fallbackAudioUrl: fallbackAudioUrl.trim(),
        testTitle: testTitle.trim() || `IELTS Listening Part ${selectedPart} Practice`,
        topicDescription: topicDescription.trim(),
        transcriptText: transcriptText.trim(),
        targetPart: selectedPart,
        apiKey,
        model
      });

      const fullCustomTest = {
        ...generated,
        id: `custom-listening-${Date.now()}`,
        isCustom: true,
        isSinglePart: true,
        targetPart: selectedPart,
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

  // Part specifications metadata
  const PART_SPECS = [
    {
      num: 1,
      title: 'Part 1: Hội Thoại Đời Thường',
      tag: '2 người • Điền từ / số',
      desc: 'Hỏi đáp dịch vụ, đặt vé, bảo hiểm, thuê nhà (Note/Form completion).'
    },
    {
      num: 2,
      title: 'Part 2: Độc Thoại Hướng Dẫn',
      tag: '1 người • Trắc nghiệm / Bản đồ',
      desc: 'Giới thiệu bảo tàng, nông trại, tiện ích công cộng (Multiple Choice/Map).'
    },
    {
      num: 3,
      title: 'Part 3: Thảo Luận Học Thuật',
      tag: '2-4 người • Trắc nghiệm / Matching',
      desc: 'Sinh viên & giảng viên trao đổi đề tài nghiên cứu, phản biện đề cương.'
    },
    {
      num: 4,
      title: 'Part 4: Bài Giảng Đại Học',
      tag: '1 người • ONE WORD ONLY',
      desc: 'Bài giảng học thuật chuyên sâu về khoa học, địa lý, lịch sử, sinh thái.'
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
                  Sinh Đề Nghe IELTS Bằng AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
                  Single-Part Mode (10 Câu)
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ⚡ 5-8s
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Chọn nguồn audio & click bất kỳ Part nào để AI sinh đề độc lập chuẩn Cambridge
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
                📚 Kho Audio & AI Gợi Ý ({allSources.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-white text-purple-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔗 Nhập Link URL Tự Có
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
                  title="Bỏ chọn"
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
                    placeholder="Tìm nhanh theo chủ đề (Du lịch, Phỏng vấn, Sinh học...)"
                    className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-white border border-purple-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {/* Filter Part Pills with Counts */}
                <div className="flex items-center space-x-1 shrink-0 overflow-x-auto scrollbar-none py-0.5">
                  {[
                    { key: 'all', label: `Tất cả (${partCounts.all})` },
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
                  title="Để AI quét tìm thêm các nguồn audio hội thoại mới trên mạng"
                >
                  {isDiscovering ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Đang quét...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>✨ AI Tìm Nguồn Mới</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Banner when AI returned results */}
              {lastDiscoveryResult && !isDiscovering && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AI đã nạp thêm <strong>{lastDiscoveryResult.count}</strong> nguồn mới lúc {lastDiscoveryResult.timeStr}.</span>
                  </div>
                  <span className="text-[11px] text-emerald-700">Đã xếp lên đầu danh sách ↓</span>
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
                    <span>AI đang tìm kiếm & phân loại nguồn âm thanh mới... Vui lòng đợi ~3-5 giây</span>
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
                          title={isPreviewing ? 'Tạm dừng nghe thử' : 'Nghe thử 5-10s'}
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
                                Mới Tìm
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
                            Gợi ý: Part {src.suggestedParts.join(', ')}
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
                          title={isSelectedSource ? 'Nhấn để bỏ chọn nguồn này' : 'Chọn nguồn âm thanh này'}
                        >
                          {isSelectedSource ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Đang chọn</span>
                            </>
                          ) : (
                            <span>Chọn nguồn</span>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: CUSTOM URL INPUT */}
          {activeTab === 'custom' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Dán đường dẫn URL tệp âm thanh (MP3, M4A, OGG):</span>
                </span>
                {audioTestStatus === 'valid' && (
                  <span className="text-emerald-600 font-bold flex items-center space-x-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Link nghe tốt!</span>
                  </span>
                )}
              </label>

              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={audioUrl}
                  onChange={(e) => {
                    setAudioUrl(e.target.value);
                    setSelectedSource(null);
                    setAudioTestStatus(null);
                  }}
                  placeholder="https://example.com/audio/conversation_or_lecture.mp3"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />

                <button
                  type="button"
                  onClick={handleTestAudioUrl}
                  disabled={audioTestStatus === 'testing' || !audioUrl.trim()}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs shrink-0 flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test link</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeCustomInput}
                  disabled={isAnalyzing || !audioUrl.trim()}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs shrink-0 flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                  title="AI phân tích URL này phù hợp nhất với Part nào"
                >
                  {isAnalyzing ? (
                    <div className="w-3 h-3 border-2 border-purple-800/40 border-t-purple-800 rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-purple-700" />
                  )}
                  <span>AI Phân Tích Part</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ULTRA-COMPACT 4-PART SEGMENTED SELECTOR */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                <span>Chọn Part Để Sinh Đề (Chỉ chọn 1 Part để tối ưu tốc độ & chất lượng):</span>
              </label>
              <span className="text-[11px] text-purple-700 font-bold">
                10 Câu • ~10 Phút
              </span>
            </div>

            {/* 4 Segmented Part Tabs with Radio Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PART_SPECS.map(p => {
                const isSelected = selectedPart === p.num;
                const isRecommendedForAudio = selectedSource?.suggestedParts?.includes(p.num);

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
                          AI khuyên dùng
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
              <label className="text-[11px] font-bold text-slate-700">Tên bài luyện nghe:</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder={`IELTS Listening Part ${selectedPart} Practice`}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[11px] font-bold text-slate-700">Bối cảnh âm thanh:</label>
              <input
                type="text"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder="Ví dụ: Hội thoại hỏi đáp dịch vụ, du lịch, bài giảng sinh học..."
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
              <span>{showAdvancedOptions ? '▾ Thu gọn tùy chọn nâng cao' : '▸ Tùy chọn nâng cao (Link mirror dự phòng, Lời thoại transcript)'}</span>
            </button>

            {showAdvancedOptions && (
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-slate-600">Link dự phòng (Fallback URL):</label>
                  <input
                    type="url"
                    value={fallbackAudioUrl}
                    onChange={(e) => setFallbackAudioUrl(e.target.value)}
                    placeholder="Link mirror dự phòng nếu link chính bị chặn (CORS/404)"
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-slate-600">Lời thoại (Transcript có sẵn nếu có):</label>
                  <textarea
                    rows={2}
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="Dán một phần hoặc toàn bộ lời thoại nếu có sẵn..."
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
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
              Sinh đề Part {selectedPart} (10 câu) • Tiết kiệm 100% tài nguyên
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !audioUrl.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Gemini Đang Sinh Part {selectedPart} (5-8s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Đề Part {selectedPart} (10 Câu)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
