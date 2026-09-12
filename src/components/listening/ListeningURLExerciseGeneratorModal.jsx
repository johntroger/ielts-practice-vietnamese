import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Headphones, 
  X, 
  Link as LinkIcon, 
  FileText, 
  HelpCircle, 
  AlertCircle, 
  Play, 
  Pause,
  CheckCircle2, 
  Layers,
  Globe,
  Radio,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  Check,
  Volume2,
  Info,
  ArrowRight,
  Wand2,
  Compass,
  BookOpen
} from 'lucide-react';
import { generateListeningTestFromAudio, analyzeAudioAndSuggestParts } from '../../services/geminiService';
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

  // Form Fields
  const [audioUrl, setAudioUrl] = useState('');
  const [fallbackAudioUrl, setFallbackAudioUrl] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  
  // Single-Part Selection: strictly 1, 2, 3, or 4
  const [selectedPart, setSelectedPart] = useState(1);

  // Curated & AI Suggestion Drawer States
  const [isSuggestDrawerOpen, setIsSuggestDrawerOpen] = useState(true);
  const [partFilter, setPartFilter] = useState('all'); // 'all' | 1 | 2 | 3 | 4
  const [curatedSearch, setCuratedSearch] = useState('');

  // Audio Preview state
  const [previewingId, setPreviewingId] = useState(null);
  const previewAudioRef = useRef(null);

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

  // Filter curated sources
  const filteredCuratedSources = useMemo(() => {
    return CURATED_LISTENING_AUDIO_SOURCES.filter(src => {
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
  }, [partFilter, curatedSearch]);

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

  // Select a curated source
  const handleApplyCuratedSource = (src, forcedPart = null) => {
    setAudioUrl(src.audioUrl);
    setFallbackAudioUrl(src.fallbackAudioUrl || '');
    setTestTitle(src.title);
    setTopicDescription(src.context || '');
    if (src.sampleTranscriptSnippet) {
      setTranscriptText(src.sampleTranscriptSnippet);
    }
    const partToSet = forcedPart || src.suggestedParts?.[0] || 1;
    setSelectedPart(partToSet);
    setAudioTestStatus('valid');
    setErrorMessage('');

    setAnalysisResult({
      primaryPart: partToSet,
      suggestedParts: src.suggestedParts,
      reasoning: src.aiReasoning,
      recommendedQuestionTypes: src.recommendedQuestionTypes,
      detectedContext: src.context,
      detectedSpeakers: src.speakers
    });
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
        setSelectedPart(Number(res.primaryPart));
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
      setErrorMessage('Vui lòng cung cấp link URL âm thanh hội thoại.');
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

  // Part metadata for visual selection cards
  const PART_INFO = [
    {
      partNumber: 1,
      name: 'Part 1: Hội Thoại Đời Thường',
      speakers: '2 người nói (Khách hàng & Tiếp tân / Nhân viên)',
      type: 'Note / Form Completion (10 câu)',
      description: 'Hỏi đáp thông tin, đặt phòng, vé lễ hội, bảo hiểm, thuê nhà.',
      focusNote: 'Đánh vần tên, số điện thoại, ngày tháng, giá tiền, địa chỉ.',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-800'
    },
    {
      partNumber: 2,
      name: 'Part 2: Độc Thoại Hướng Dẫn',
      speakers: '1 người nói (Hướng dẫn viên / Quản lý)',
      type: 'Multiple Choice / Bản Đồ Map (10 câu)',
      description: 'Giới thiệu bảo tàng, khu bảo tồn sinh thái, quy chế công cộng.',
      focusNote: 'Định vị bản đồ, phương hướng, giờ mở cửa, lưu ý an toàn.',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-800'
    },
    {
      partNumber: 3,
      name: 'Part 3: Thảo Luận Học Thuật',
      speakers: '2 - 4 người (Sinh viên & Giảng viên / Trợ lý)',
      type: 'Multiple Choice & Matching (10 câu)',
      description: 'Thảo luận đề cương thực địa, phương pháp luận, phản biện đề tài.',
      focusNote: 'Phân tích quan điểm đồng thuận/bác bỏ, giải pháp nghiên cứu.',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-200 text-purple-800'
    },
    {
      partNumber: 4,
      name: 'Part 4: Bài Giảng Đại Học',
      speakers: '1 người nói (Giáo sư / Nhà khoa học)',
      type: 'Note Completion ONE WORD ONLY (10 câu)',
      description: 'Bài giảng liên tục về địa lý, lịch sử vệ sinh, sinh thái học đô thị.',
      focusNote: 'Điền chính xác 1 từ duy nhất, từ vựng học thuật C1/C2.',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Sinh Đề Nghe IELTS Bằng AI Từ URL Ngoại Lai
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
                  Single-Part Mode
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                  Tốc độ 5-8s
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI tự động gợi ý Part phù hợp • Sinh 1 Part độc lập 10 câu hỏi để ghép bộ đề sau này
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* SECTION 1: AI SUGGESTION & CURATED SOURCES DRAWER */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/70 to-indigo-50/40 p-4 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span>AI Gợi Ý & Tìm Nguồn Audio Bản Xứ Phù Hợp</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold">
                      {CURATED_LISTENING_AUDIO_SOURCES.length} Nguồn Chuẩn Cambridge
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    AI phân tích sẵn giọng điệu, số người nói và gợi ý rõ Part phù hợp nhất để bạn chọn 1-chạm
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSuggestDrawerOpen(!isSuggestDrawerOpen)}
                className="p-1.5 rounded-lg bg-white/80 border border-purple-200 text-purple-700 hover:bg-purple-100/80 transition-colors text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>{isSuggestDrawerOpen ? 'Thu gọn' : 'Xem danh sách gợi ý'}</span>
                {isSuggestDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isSuggestDrawerOpen && (
              <div className="space-y-3 pt-2">
                {/* Search & Part Filter Tabs */}
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                  {/* Filter Pills */}
                  <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5">
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 1, label: '🎯 Gợi ý Part 1' },
                      { key: 2, label: '🎯 Gợi ý Part 2' },
                      { key: 3, label: '🎯 Gợi ý Part 3' },
                      { key: 4, label: '🎯 Gợi ý Part 4' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setPartFilter(tab.key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          partFilter === tab.key
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white/80 text-slate-600 hover:bg-white border border-purple-200/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={curatedSearch}
                      onChange={(e) => setCuratedSearch(e.target.value)}
                      placeholder="Tìm chủ đề, giọng nói, từ khóa..."
                      className="w-full pl-8 pr-3 py-1 rounded-xl bg-white border border-purple-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Curated Source Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredCuratedSources.map(src => {
                    const isPreviewing = previewingId === src.id;
                    const isSelectedSource = audioUrl === src.audioUrl;

                    return (
                      <div
                        key={src.id}
                        className={`p-3 rounded-xl border bg-white transition-all flex flex-col justify-between ${
                          isSelectedSource 
                            ? 'border-purple-500 ring-2 ring-purple-400/20 shadow-sm' 
                            : 'border-slate-200 hover:border-purple-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          {/* Card Header: Part Badges & Accent */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                              {src.suggestedParts.map(p => (
                                <span
                                  key={p}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                    p === 1 ? 'bg-blue-100 text-blue-800' :
                                    p === 2 ? 'bg-emerald-100 text-emerald-800' :
                                    p === 3 ? 'bg-purple-100 text-purple-800' :
                                    'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  Khuyên dùng Part {p}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {src.durationText}
                            </span>
                          </div>

                          {/* Title */}
                          <h5 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1" title={src.title}>
                            {src.title}
                          </h5>

                          {/* Accent & Speakers */}
                          <div className="text-[11px] text-slate-600 mb-1 flex items-center space-x-2">
                            <span className="font-medium text-purple-700">{src.accent}</span>
                            <span>•</span>
                            <span className="text-slate-500 truncate">{src.speakers}</span>
                          </div>

                          {/* AI Reasoning Callout Box */}
                          <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100 text-[11px] text-slate-700 leading-relaxed mb-2.5">
                            <div className="flex items-start space-x-1">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              <span className="italic font-medium">{src.aiReasoning}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          {/* Audio Preview Button */}
                          <button
                            type="button"
                            onClick={() => handleTogglePreview(src.id, src.audioUrl)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                              isPreviewing
                                ? 'bg-emerald-600 text-white animate-pulse'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="Nghe thử âm thanh trực tiếp"
                          >
                            {isPreviewing ? (
                              <>
                                <Pause className="w-3 h-3 fill-current" />
                                <span>Đang nghe thử...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>Nghe thử</span>
                              </>
                            )}
                          </button>

                          {/* Select & Apply Button */}
                          <button
                            type="button"
                            onClick={() => handleApplyCuratedSource(src)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                              isSelectedSource
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {isSelectedSource ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Đã Chọn Nguồn Này</span>
                              </>
                            ) : (
                              <>
                                <span>Chọn Nguồn & Đề Xuất Part</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: AUDIO URL INPUT & CUSTOM AI PART ANALYZER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Đường dẫn URL tệp âm thanh (MP3, M4A, OGG):</span>
              </label>

              {audioTestStatus === 'valid' && (
                <span className="text-emerald-600 font-bold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Link nghe tốt!</span>
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => {
                  setAudioUrl(e.target.value);
                  setAudioTestStatus(null);
                }}
                placeholder="https://example.com/audio/conversation_or_lecture.mp3"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />

              <button
                type="button"
                onClick={handleTestAudioUrl}
                disabled={audioTestStatus === 'testing' || !audioUrl.trim()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Kiểm tra link có phát được âm thanh không"
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

              <button
                type="button"
                onClick={handleAnalyzeCustomInput}
                disabled={isAnalyzing || (!audioUrl.trim() && !testTitle.trim() && !topicDescription.trim())}
                className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs shrink-0 flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Để AI phân tích URL/Chủ đề này phù hợp nhất với Part nào"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-purple-800/40 border-t-purple-800 rounded-full animate-spin" />
                    <span>AI Đang Phân Tích...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-purple-700" />
                    <span>AI Phân Tích Part</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Analysis Result Feedback Banner */}
          {analysisResult && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-xs text-slate-800 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold text-purple-900">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Kết Quả AI Phân Tích Độ Phù Hợp:</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold uppercase">
                  Đề xuất sinh Part {analysisResult.primaryPart}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {analysisResult.reasoning}
              </p>
              {analysisResult.recommendedQuestionTypes && (
                <div className="flex items-center space-x-1.5 pt-1 text-[11px] text-slate-600">
                  <span className="font-semibold text-purple-800">Dạng câu hỏi tối ưu:</span>
                  <span>{analysisResult.recommendedQuestionTypes.join(' • ')}</span>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: STRICT SINGLE-PART SELECTION (User chooses strictly 1 Part) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-purple-600" />
                <span>Chọn Duy Nhất 1 Part Để Sinh Đề (Chuẩn Cambridge Assessment):</span>
              </label>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                10 Câu Hỏi • ~10 Phút • Tốc độ sinh 5-8s
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Mỗi Part được sinh thành 1 bài luyện độc lập với 10 câu hỏi chuẩn xác, có timestamps & giải thích chi tiết, là nguồn dữ liệu chuẩn để sau này ghép thành full đề.
            </p>

            {/* 4 Interactive Part Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {PART_INFO.map((info) => {
                const isSelected = selectedPart === info.partNumber;

                return (
                  <button
                    key={info.partNumber}
                    type="button"
                    onClick={() => setSelectedPart(info.partNumber)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 ring-2 ring-purple-500/30 bg-gradient-to-br from-purple-50/80 to-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      {/* Top row: Part Name & Checkmark */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-extrabold flex items-center space-x-1.5 ${
                          isSelected ? 'text-purple-900' : 'text-slate-800'
                        }`}>
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black ${
                            isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {info.partNumber}
                          </span>
                          <span>{info.name}</span>
                        </span>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Question Format & Speaker */}
                      <div className="text-[11px] font-bold text-slate-700 mb-1">
                        {info.type}
                      </div>
                      <div className="text-[10px] text-slate-500 mb-1">
                        {info.speakers}
                      </div>

                      {/* Description & Focus */}
                      <div className="text-[11px] text-slate-600 leading-snug">
                        {info.description}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-800 font-semibold">
                      <span>{info.focusNote}</span>
                      <span className="font-mono font-bold">10 câu</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: TEST TITLE & TOPIC DESCRIPTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Tên bài luyện nghe:</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder={`Ví dụ: IELTS Listening Part ${selectedPart} - Festival Booking`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Bối cảnh & Chủ đề âm thanh:</label>
              <input
                type="text"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder="Ví dụ: Cuộc đàm thoại đặt vé, hỏi bãi đỗ xe, đề tài nghiên cứu địa lý..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* SECTION 5: FALLBACK URL & TRANSCRIPT SNIPPET (OPTIONAL) */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Link dự phòng (Fallback Mirror URL - Không bắt buộc):
              </label>
              <input
                type="url"
                value={fallbackAudioUrl}
                onChange={(e) => setFallbackAudioUrl(e.target.value)}
                placeholder="Link mirror dự phòng nếu link chính bị lỗi (404/CORS)"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Lời thoại / Ghi chú ngữ cảnh (Transcript nếu có):</span>
                </label>
                <span className="text-[11px] text-slate-400">Không bắt buộc</span>
              </div>
              <textarea
                rows={3}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Dán một đoạn hoặc toàn bộ lời thoại (nếu có trên trang nguồn). AI sẽ dựa vào đây để tạo câu hỏi cực kỳ chính xác khớp từng giây phát âm thanh..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="hidden sm:inline">
              Sinh duy nhất Part ${selectedPart} (10 câu) • Tiết kiệm 100% tài nguyên server
            </span>
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Gemini Đang Sinh Part ${selectedPart} (5-8s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Đề Luyện Part ${selectedPart} (10 Câu)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
