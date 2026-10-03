import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  X, 
  RotateCcw, 
  BookOpen, 
  Award, 
  Loader2, 
  PlusCircle, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  Headphones,
  Mic,
  Compass,
  FileText,
  Target,
  Search, 
  Split,
  Volume2,
  Play,
  Lightbulb,
  Clock,
  Flame,
  Zap,
  Globe,
  Lock,
  RefreshCw,
  GraduationCap,
  Eye,
  EyeOff,
  VolumeX,
  PenTool,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { INITIAL_MICRO_DRILLS } from '../data/microDrills';
import { READING_MICRO_DRILLS } from '../data/readingMicroDrills';
import { LISTENING_MICRO_DRILLS } from '../data/listeningMicroDrills';
import { SPEAKING_MICRO_DRILLS } from '../data/speakingMicroDrills';
import { COMMUNITY_DEFAULT_DRILLS } from '../data/communityMicroDrills';
import { evaluateParaphrase, generateMicroDrill, evaluateListeningDrill, evaluateSpeakingMicroDrill } from '../services/geminiService';
import { fetchPublicDrills, savePublicDrill, deletePublicDrill } from '../services/dataSyncService';
import { speakText, stopSpeech, playChimeTone } from '../utils/speechAudio';
import MicroDrillAudioBar from './listening/MicroDrillAudioBar';
import StarRatingWidget from './common/StarRatingWidget';
import { recordAttempt, applySmartFilterAndSort } from '../services/ratingPopularityService';
import ManualMicroDrillModal from './ManualMicroDrillModal';
import {
  ReadingDrillRoom,
  GeneralDrillRoom,
  WritingDrillRoom,
  ListeningDrillRoom,
  SpeakingDrillRoom
} from './drills';


export default function MicroDrillsModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  model, 
  activeSkill = 'writing',
  currentUser,
  masteredIds = [],
  onToggleMastered,
  onOpenAuth
}) {
  if (!isOpen) return null;

  // Active Room: 'general' | 'writing' | 'reading' | 'listening' | 'speaking'
  const [activeRoom, setActiveRoom] = useState(() => {
    if (activeSkill === 'reading') return 'reading';
    if (activeSkill === 'listening') return 'listening';
    if (activeSkill === 'speaking') return 'speaking';
    return 'writing';
  });

  // Active Tab within each room
  // General: 'collocation' | 'context-vocab' | 'sentence-chunking'
  // Writing: 'fill-blanks' | 'true-false' | 'paraphrase' | 'error-spotting'
  // Reading: 'reading-tfng' | 'reading-paraphrase' | 'reading-headings'
  // Listening: 'listening-dictation' | 'listening-spelling' | 'listening-distractor' | 'listening-map' | 'listening-signposting'
  // Speaking: 'speaking-area' | 'speaking-fillers' | 'speaking-collocations' | 'speaking-part3-counter'
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSkill === 'reading') return 'reading-tfng';
    if (activeSkill === 'listening') return 'listening-dictation';
    if (activeSkill === 'speaking') return 'speaking-area';
    return 'fill-blanks';
  });

  // When room changes, auto-select the first tab of that room
  const handleRoomChange = (room) => {
    setActiveRoom(room);
    if (room === 'general') setActiveTab('collocation');
    else if (room === 'writing') setActiveTab('fill-blanks');
    else if (room === 'reading') setActiveTab('reading-tfng');
    else if (room === 'listening') setActiveTab('listening-dictation');
    else if (room === 'speaking') setActiveTab('speaking-area');
  };

  // Fullscreen / Expanded Workspace Mode
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      return localStorage.getItem('ielts_micro_drills_expanded') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleExpanded = () => {
    setIsExpanded(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ielts_micro_drills_expanded', String(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleExpanded();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sharing & Privacy State: Defaults to true (Public community resource) with user toggle
  const [isAutoShare, setIsAutoShare] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // Filter scope: 'all' | 'community' | 'mine'
  const [drillScope, setDrillScope] = useState('all');
  const [isManualDrillModalOpen, setIsManualDrillModalOpen] = useState(false);

  // Drills stored in LocalStorage combined with defaults and community drills
  const [allDrills, setAllDrills] = useState(() => {
    const combinedDefaults = [
      ...INITIAL_MICRO_DRILLS.map(d => ({ ...d, isPublic: true })), 
      ...READING_MICRO_DRILLS.map(d => ({ ...d, isPublic: true })), 
      ...LISTENING_MICRO_DRILLS.map(d => ({ ...d, isPublic: true })),
      ...SPEAKING_MICRO_DRILLS.map(d => ({ ...d, isPublic: true })),
      ...COMMUNITY_DEFAULT_DRILLS
    ];
    try {
      const savedCustom = localStorage.getItem('ielts_custom_micro_drills');
      const savedCommunity = localStorage.getItem('ielts_community_micro_drills');
      const customDrills = savedCustom ? JSON.parse(savedCustom) : [];
      const communityDrills = savedCommunity ? JSON.parse(savedCommunity) : [];

      const drillMap = new Map();
      combinedDefaults.forEach(d => drillMap.set(d.id, d));
      communityDrills.forEach(d => drillMap.set(d.id, { ...d, isPublic: true, isCommunity: true }));
      customDrills.forEach(d => drillMap.set(d.id, d));
      return Array.from(drillMap.values());
    } catch (e) {
      console.error('Error loading custom drills:', e);
    }
    return combinedDefaults;
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Cross-Tab Broadcast Channel (Instant 0ms sync between open tabs/windows on same device)
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('ielts_micro_drills_realtime');
        bc.onmessage = (event) => {
          const { type, drill, drillId, nextPub } = event.data || {};
          if (type === 'NEW_DRILL' && drill) {
            setAllDrills(prev => {
              if (prev.some(d => d.id === drill.id)) return prev;
              return [...prev, drill];
            });
          } else if (type === 'TOGGLE_PUBLIC' && drillId) {
            setAllDrills(prev => prev.map(d => d.id === drillId ? { ...d, isPublic: nextPub, isCommunity: nextPub } : d));
          } else if (type === 'SYNC_ALL') {
            reloadFromCloud();
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
    return () => {
      if (bc) bc.close();
    };
  }, []);

  // Function to pull latest public drills from Supabase Cloud
  const reloadFromCloud = React.useCallback(async () => {
    try {
      const cloudDrills = await fetchPublicDrills();
      if (cloudDrills && cloudDrills.length > 0) {
        setAllDrills(prev => {
          const drillMap = new Map();
          prev.forEach(d => drillMap.set(d.id, d));
          cloudDrills.forEach(d => {
            drillMap.set(d.id, { ...d, isPublic: true, isCommunity: true });
          });
          const merged = Array.from(drillMap.values());
          try {
            const commOnly = merged.filter(d => d.isAiGenerated && d.isPublic);
            localStorage.setItem('ielts_community_micro_drills', JSON.stringify(commOnly));
          } catch (e) {}
          return merged;
        });
      }
    } catch (err) {
      console.warn('Cloud reload notice:', err);
    }
  }, []);

  // Sync community drills with Supabase Cloud on mount & auto-migrate existing local custom drills
  useEffect(() => {
    // 1. Initial Cloud Pull
    reloadFromCloud();

    // 2. Auto-migrate ALL local custom drills that are AI generated to Supabase Cloud
    try {
      const savedCustom = localStorage.getItem('ielts_custom_micro_drills');
      const savedCommunity = localStorage.getItem('ielts_community_micro_drills');
      const customList = savedCustom ? JSON.parse(savedCustom) : [];
      const commList = savedCommunity ? JSON.parse(savedCommunity) : [];
      const combinedLocal = [...commList, ...customList];
      
      const seen = new Set();
      combinedLocal.forEach(drill => {
        if (drill.id && !seen.has(drill.id)) {
          seen.add(drill.id);
          savePublicDrill({ ...drill, isPublic: true, isCommunity: true });
        }
      });
    } catch (e) {
      console.warn('Auto-sync local community drills failed:', e);
    }

    // 3. Window Focus Event: Refresh whenever user switches back to this tab/window
    const handleFocus = () => {
      reloadFromCloud();
    };
    window.addEventListener('focus', handleFocus);

    // 4. Polling heartbeat every 4 seconds to guarantee sync across different windows/devices
    const pollInterval = setInterval(() => {
      reloadFromCloud();
    }, 4000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, [reloadFromCloud]);

  // Manual 1-click Cloud Sync Handler
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      // Push any unsaved local drills
      const savedCustom = localStorage.getItem('ielts_custom_micro_drills');
      const savedCommunity = localStorage.getItem('ielts_community_micro_drills');
      const customList = savedCustom ? JSON.parse(savedCustom) : [];
      const commList = savedCommunity ? JSON.parse(savedCommunity) : [];
      const combinedLocal = [...commList, ...customList];
      for (const drill of combinedLocal) {
        if (drill.id) await savePublicDrill({ ...drill, isPublic: true, isCommunity: true });
      }

      // Pull latest from Cloud
      await reloadFromCloud();

      // Notify other tabs via BroadcastChannel
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('ielts_micro_drills_realtime');
          bc.postMessage({ type: 'SYNC_ALL' });
          bc.close();
        }
      } catch (e) {}

      alert('Đồng bộ thành công! Toàn bộ câu hỏi và bài luyện đã được cập nhật từ Cloud.');
    } catch (e) {
      alert('Đồng bộ hoàn tất.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handler to toggle publicity of an AI custom drill
  const handleToggleDrillPublic = (drillId) => {
    setAllDrills(prev => {
      const targetDrill = prev.find(d => d.id === drillId);
      const nextPub = targetDrill ? !targetDrill.isPublic : true;

      const updated = prev.map(d => {
        if (d.id === drillId) {
          return { ...d, isPublic: nextPub, isCommunity: nextPub };
        }
        return d;
      });
      try {
        const customOnly = updated.filter(d => d.isAiGenerated);
        localStorage.setItem('ielts_custom_micro_drills', JSON.stringify(customOnly));
        const commOnly = updated.filter(d => d.isAiGenerated && d.isPublic);
        localStorage.setItem('ielts_community_micro_drills', JSON.stringify(commOnly));
      } catch (e) {}

      // Sync changes to Supabase Cloud & BroadcastChannel
      if (targetDrill) {
        if (nextPub) {
          savePublicDrill({ ...targetDrill, isPublic: true, isCommunity: true });
        } else {
          deletePublicDrill(drillId);
        }
      }

      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('ielts_micro_drills_realtime');
          bc.postMessage({ type: 'TOGGLE_PUBLIC', drillId, nextPub });
          bc.close();
        }
      } catch (e) {}

      return updated;
    });
  };

  // AI Generating state
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);
  const [drillGenMessage, setDrillGenMessage] = useState('');

  // Mastered Drills Visibility Toggle
  const [hideMasteredDrills, setHideMasteredDrills] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_hide_mastered_drills');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const handleToggleHideMastered = (val) => {
    setHideMasteredDrills(val);
    try {
      localStorage.setItem('ielts_hide_mastered_drills', JSON.stringify(val));
    } catch (e) {}
  };

  // Smart Discovery, Rating & Sort State for Micro-Drills
  const [drillSearchQuery, setDrillSearchQuery] = useState('');
  const [drillQuickFilter, setDrillQuickFilter] = useState('all');
  const [drillSortBy, setDrillSortBy] = useState('rating_desc');

  const getDrillsByType = (type) => {
    const rawForType = allDrills.filter(d => d.type === type);
    return applySmartFilterAndSort(rawForType, {
      searchQuery: drillSearchQuery,
      quickFilter: drillQuickFilter,
      sortBy: drillSortBy,
      masteredIds,
      hideMastered: hideMasteredDrills && currentUser
    });
  };

  // ----------------------------------------------------
  // WRITING DRILLS STATE
  // ----------------------------------------------------
  const fillDrills = getDrillsByType('fill-blanks');
  const [selectedFillIndex, setSelectedFillIndex] = useState(0);
  const [userFillAnswers, setUserFillAnswers] = useState({});
  const [showFillResults, setShowFillResults] = useState(false);

  const tfDrills = getDrillsByType('true-false');
  const [selectedTfIndex, setSelectedTfIndex] = useState(0);
  const [userTfAnswers, setUserTfAnswers] = useState({});
  const [showTfResults, setShowTfResults] = useState(false);

  const paraDrills = getDrillsByType('paraphrase');
  const [selectedParaIndex, setSelectedParaIndex] = useState(0);
  const [candidateParaText, setCandidateParaText] = useState('');
  const [isEvaluatingPara, setIsEvaluatingPara] = useState(false);
  const [paraEvaluation, setParaEvaluation] = useState(null);

  const errorDrills = getDrillsByType('error-spotting');
  const [selectedErrorIndex, setSelectedErrorIndex] = useState(0);
  const [userCorrectionText, setUserCorrectionText] = useState('');
  const [showErrorAnswer, setShowErrorAnswer] = useState(false);

  // ----------------------------------------------------
  // GENERAL CORE FOUNDATION STATE
  // ----------------------------------------------------
  const collocDrills = getDrillsByType('collocation');
  const [selectedCollocIndex, setSelectedCollocIndex] = useState(0);
  const [userCollocAnswers, setUserCollocAnswers] = useState({});
  const [showCollocResults, setShowCollocResults] = useState(false);

  const contextVocabDrills = getDrillsByType('context-vocab');
  const [selectedVocabIndex, setSelectedVocabIndex] = useState(0);
  const [userVocabChoice, setUserVocabChoice] = useState(null);
  const [showVocabResult, setShowVocabResult] = useState(false);

  const chunkDrills = getDrillsByType('sentence-chunking');
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);
  const [showChunkAnalysis, setShowChunkAnalysis] = useState(false);

  // ----------------------------------------------------
  // READING DRILLS STATE
  // ----------------------------------------------------
  const readingTfngDrills = getDrillsByType('reading-tfng');
  const [selectedTfngIndex, setSelectedTfngIndex] = useState(0);
  const [userTfngChoice, setUserTfngChoice] = useState(null);
  const [showTfngResult, setShowTfngResult] = useState(false);

  const readingParaDrills = getDrillsByType('reading-paraphrase');
  const [selectedReadingParaIndex, setSelectedReadingParaIndex] = useState(0);
  const [showReadingParaAnalysis, setShowReadingParaAnalysis] = useState(false);

  const readingHeadingsDrills = getDrillsByType('reading-headings');
  const [selectedHeadingsIndex, setSelectedHeadingsIndex] = useState(0);
  const [userHeadingChoice, setUserHeadingChoice] = useState(null);
  const [showHeadingsResult, setShowHeadingsResult] = useState(false);

  // ----------------------------------------------------
  // LISTENING DRILLS STATE
  // ----------------------------------------------------
  const listeningDictationDrills = getDrillsByType('listening-dictation');
  const [selectedDictationIndex, setSelectedDictationIndex] = useState(0);
  const [userDictationInput, setUserDictationInput] = useState('');
  const [showDictationFeedback, setShowDictationFeedback] = useState(false);

  const listeningSpellingDrills = getDrillsByType('listening-spelling');
  const [selectedSpellingIndex, setSelectedSpellingIndex] = useState(0);
  const [userSpellingInput, setUserSpellingInput] = useState('');
  const [showSpellingResult, setShowSpellingResult] = useState(false);

  const listeningDistractorDrills = getDrillsByType('listening-distractor');
  const [selectedDistractorIndex, setSelectedDistractorIndex] = useState(0);
  const [userDistractorChoice, setUserDistractorChoice] = useState(null);
  const [showDistractorResult, setShowDistractorResult] = useState(false);

  const listeningMapDrills = getDrillsByType('listening-map');
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const [userMapChoice, setUserMapChoice] = useState(null);
  const [showMapResult, setShowMapResult] = useState(false);

  const listeningSignDrills = getDrillsByType('listening-signposting');
  const [selectedSignIndex, setSelectedSignIndex] = useState(0);
  const [userSignChoice, setUserSignChoice] = useState(null);
  const [showSignResult, setShowSignResult] = useState(false);
  const [showListeningTranscript, setShowListeningTranscript] = useState(false);

  // AI Evaluation State for Listening Micro-Drills
  const [isEvaluatingListening, setIsEvaluatingListening] = useState(false);
  const [listeningEvaluation, setListeningEvaluation] = useState(null);

  // Function to save lightweight learning history (Trap Diary) without audio files
  const saveListeningHistory = (drillItem, isCorrect, note = '') => {
    try {
      const historyKey = 'ielts_listening_trap_diary';
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const newEntry = {
        id: `entry-${Date.now()}`,
        drillId: drillItem.id,
        drillType: drillItem.type,
        title: drillItem.title,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString(),
        note: note || drillItem.trapNote || drillItem.distractorMechanism || ''
      };
      // Keep latest 50 entries
      const updated = [newEntry, ...existing.slice(0, 49)];
      localStorage.setItem(historyKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save trap diary:', e);
    }
  };

  const handleEvaluateCurrentListening = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
      return;
    }

    setIsEvaluatingListening(true);
    setListeningEvaluation(null);

    try {
      let payload = { drillType: activeTab, apiKey, model };
      if (activeTab === 'listening-dictation') {
        payload.targetTranscript = currentDictation.targetTranscript;
        payload.userInput = userDictationInput;
      } else if (activeTab === 'listening-spelling') {
        payload.targetTranscript = currentSpelling.correctAnswer;
        payload.userInput = userSpellingInput;
        payload.questionPrompt = currentSpelling.questionPrompt;
      } else if (activeTab === 'listening-distractor') {
        payload.questionPrompt = currentDistractor.question;
        payload.correctOption = currentDistractor.correctOption;
        payload.userChoice = userDistractorChoice;
        payload.options = currentDistractor.options;
      } else if (activeTab === 'listening-map') {
        payload.questionPrompt = currentMap.question;
        payload.correctOption = currentMap.correctOption;
        payload.userChoice = userMapChoice;
        payload.options = currentMap.options;
      } else if (activeTab === 'listening-signposting') {
        payload.questionPrompt = currentSign.question;
        payload.correctOption = currentSign.correctOption;
        payload.userChoice = userSignChoice;
        payload.options = currentSign.options;
      }

      const res = await evaluateListeningDrill(payload);
      setListeningEvaluation(res);
      saveListeningHistory(
        activeTab === 'listening-dictation' ? currentDictation :
        activeTab === 'listening-spelling' ? currentSpelling :
        activeTab === 'listening-distractor' ? currentDistractor :
        activeTab === 'listening-map' ? currentMap : currentSign,
        res.isFullyCorrect,
        res.trapAnalysis
      );
    } catch (err) {
      alert(err.message || 'Lỗi khi AI phân tích kết quả.');
    } finally {
      setIsEvaluatingListening(false);
    }
  };

  // ----------------------------------------------------
  // SPEAKING DRILLS STATE & HANDLERS
  // ----------------------------------------------------
  const speakingAreaDrills = getDrillsByType('speaking-area');
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [userAreaNotes, setUserAreaNotes] = useState({ answer: '', reason: '', example: '', alternative: '' });
  const [showAreaModel, setShowAreaModel] = useState(false);
  const [isRecordingArea, setIsRecordingArea] = useState(false);

  const speakingFillersDrills = getDrillsByType('speaking-fillers');
  const [selectedFillerIndex, setSelectedFillerIndex] = useState(0);
  const [userFillerChoice, setUserFillerChoice] = useState(null);
  const [showFillerResult, setShowFillerResult] = useState(false);

  const speakingCollocDrills = getDrillsByType('speaking-collocations');
  const [selectedSpeakingCollocIndex, setSelectedSpeakingCollocIndex] = useState(0);
  const [userSpeakingCollocChoice, setUserSpeakingCollocChoice] = useState(null);
  const [showSpeakingCollocResult, setShowSpeakingCollocResult] = useState(false);

  const speakingPart3Drills = getDrillsByType('speaking-part3-counter');
  const [selectedPart3Index, setSelectedPart3Index] = useState(0);
  const [showPart3Model, setShowPart3Model] = useState(false);
  const [userPart3SpokenText, setUserPart3SpokenText] = useState('');
  const [isRecordingPart3, setIsRecordingPart3] = useState(false);
  const [speakingEvaluation, setSpeakingEvaluation] = useState(null);
  const [isEvaluatingSpeaking, setIsEvaluatingSpeaking] = useState(false);

  // Helper for voice recognition input
  const handleToggleVoiceDictation = (onTranscript, setIsRecording, currentRecordingState) => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API nhận diện giọng nói trực tiếp. Bạn có thể gõ câu trả lời vào ô văn bản.');
      return;
    }

    if (currentRecordingState) {
      if (window._microDrillRecognition) {
        window._microDrillRecognition.stop();
        window._microDrillRecognition = null;
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        playChimeTone(440, 0.1);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onTranscript(transcript.trim());
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition notice:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      window._microDrillRecognition = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  const handleEvaluateCurrentSpeaking = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
      return;
    }

    let questionText = '';
    let userResponseText = '';
    let modelAns = '';

    if (activeTab === 'speaking-area') {
      questionText = currentArea?.question || '';
      userResponseText = Object.values(userAreaNotes).filter(Boolean).join(' ');
      modelAns = currentArea?.modelAnswerBand8 || '';
    } else if (activeTab === 'speaking-part3-counter') {
      questionText = currentPart3?.question || '';
      userResponseText = userPart3SpokenText;
      modelAns = currentPart3?.modelAnswerBand8 || '';
    }

    if (!userResponseText.trim()) {
      alert('Vui lòng ghi âm hoặc gõ câu trả lời của bạn trước khi nhờ AI nhận xét.');
      return;
    }

    setIsEvaluatingSpeaking(true);
    setSpeakingEvaluation(null);

    try {
      const res = await evaluateSpeakingMicroDrill({
        drillType: activeTab,
        question: questionText,
        userInput: userResponseText,
        modelAnswer: modelAns,
        apiKey,
        model
      });
      setSpeakingEvaluation(res);
    } catch (err) {
      alert(err.message || 'Lỗi khi AI phân tích câu trả lời Speaking.');
    } finally {
      setIsEvaluatingSpeaking(false);
    }
  };

  const [playingAudioId, setPlayingAudioId] = useState(null);

  const handlePlaySpeakingAudio = (text, audioId, accent = 'en-GB') => {
    if (!text) return;
    if (playingAudioId === audioId) {
      stopSpeech();
      setPlayingAudioId(null);
    } else {
      stopSpeech();
      setPlayingAudioId(audioId);
      speakText(text, {
        lang: accent,
        playChimeFirst: true,
        rate: 0.95,
        onEnd: () => setPlayingAudioId(null),
        onError: () => setPlayingAudioId(null)
      });
    }
  };

  // Sync room and tab when modal opens or activeSkill prop changes
  useEffect(() => {
    if (isOpen) {
      if (activeSkill === 'reading') {
        setActiveRoom('reading');
        setActiveTab('reading-tfng');
      } else if (activeSkill === 'listening') {
        setActiveRoom('listening');
        setActiveTab('listening-dictation');
      } else if (activeSkill === 'speaking') {
        setActiveRoom('speaking');
        setActiveTab('speaking-area');
      } else {
        setActiveRoom('writing');
        setActiveTab('fill-blanks');
      }
    }
  }, [isOpen, activeSkill]);

  // Stop any active speech on tab change or room change
  useEffect(() => {
    stopSpeech();
    setPlayingAudioId(null);
  }, [activeTab, activeRoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      setPlayingAudioId(null);
    };
  }, []);

  // Current items
  const currentFill = fillDrills[selectedFillIndex] || fillDrills[0];
  const currentTf = tfDrills[selectedTfIndex] || tfDrills[0];
  const currentPara = paraDrills[selectedParaIndex] || paraDrills[0];
  const currentError = errorDrills[selectedErrorIndex] || errorDrills[0];
  const currentColloc = collocDrills[selectedCollocIndex] || collocDrills[0];
  const currentVocab = contextVocabDrills[selectedVocabIndex] || contextVocabDrills[0];
  const currentChunk = chunkDrills[selectedChunkIndex] || chunkDrills[0];
  const currentTfng = readingTfngDrills[selectedTfngIndex] || readingTfngDrills[0];
  const currentReadingPara = readingParaDrills[selectedReadingParaIndex] || readingParaDrills[0];
  const currentHeadings = readingHeadingsDrills[selectedHeadingsIndex] || readingHeadingsDrills[0];
  const currentDictation = listeningDictationDrills[selectedDictationIndex] || listeningDictationDrills[0];
  const currentSpelling = listeningSpellingDrills[selectedSpellingIndex] || listeningSpellingDrills[0];
  const currentDistractor = listeningDistractorDrills[selectedDistractorIndex] || listeningDistractorDrills[0];
  const currentMap = listeningMapDrills[selectedMapIndex] || listeningMapDrills[0];
  const currentSign = listeningSignDrills[selectedSignIndex] || listeningSignDrills[0];
  const currentArea = speakingAreaDrills[selectedAreaIndex] || speakingAreaDrills[0];
  const currentFiller = speakingFillersDrills[selectedFillerIndex] || speakingFillersDrills[0];
  const currentSpeakingColloc = speakingCollocDrills[selectedSpeakingCollocIndex] || speakingCollocDrills[0];
  const currentPart3 = speakingPart3Drills[selectedPart3Index] || speakingPart3Drills[0];

  // Current active drills list and active index based on activeTab
  const getActiveDrillInfo = () => {
    switch (activeTab) {
      // Writing
      case 'fill-blanks':
        return { list: fillDrills, index: selectedFillIndex, setIndex: setSelectedFillIndex, onReset: () => { setUserFillAnswers({}); setShowFillResults(false); } };
      case 'true-false':
        return { list: tfDrills, index: selectedTfIndex, setIndex: setSelectedTfIndex, onReset: () => { setUserTfAnswers({}); setShowTfResults(false); } };
      case 'paraphrase':
        return { list: paraDrills, index: selectedParaIndex, setIndex: setSelectedParaIndex, onReset: () => { setCandidateParaText(''); setParaEvaluation(null); } };
      case 'error-spotting':
        return { list: errorDrills, index: selectedErrorIndex, setIndex: setSelectedErrorIndex, onReset: () => { setUserCorrectionText(''); setShowErrorAnswer(false); } };
      // General
      case 'collocation':
        return { list: collocDrills, index: selectedCollocIndex, setIndex: setSelectedCollocIndex, onReset: () => { setUserCollocAnswers({}); setShowCollocResults(false); } };
      case 'context-vocab':
        return { list: contextVocabDrills, index: selectedVocabIndex, setIndex: setSelectedVocabIndex, onReset: () => { setUserVocabChoice(null); setShowVocabResult(false); } };
      case 'sentence-chunking':
        return { list: chunkDrills, index: selectedChunkIndex, setIndex: setSelectedChunkIndex, onReset: () => { setShowChunkAnalysis(false); } };
      // Reading
      case 'reading-tfng':
        return { list: readingTfngDrills, index: selectedTfngIndex, setIndex: setSelectedTfngIndex, onReset: () => { setUserTfngChoice(null); setShowTfngResult(false); } };
      case 'reading-paraphrase':
        return { list: readingParaDrills, index: selectedReadingParaIndex, setIndex: setSelectedReadingParaIndex, onReset: () => { setShowReadingParaAnalysis(false); } };
      case 'reading-headings':
        return { list: readingHeadingsDrills, index: selectedHeadingsIndex, setIndex: setSelectedHeadingsIndex, onReset: () => { setUserHeadingChoice(null); setShowHeadingsResult(false); } };
      // Listening
      case 'listening-dictation':
        return { list: listeningDictationDrills, index: selectedDictationIndex, setIndex: setSelectedDictationIndex, onReset: () => { setUserDictationInput(''); setShowDictationFeedback(false); setListeningEvaluation(null); stopSpeech(); } };
      case 'listening-spelling':
        return { list: listeningSpellingDrills, index: selectedSpellingIndex, setIndex: setSelectedSpellingIndex, onReset: () => { setUserSpellingInput(''); setShowSpellingResult(false); setListeningEvaluation(null); stopSpeech(); } };
      case 'listening-distractor':
        return { list: listeningDistractorDrills, index: selectedDistractorIndex, setIndex: setSelectedDistractorIndex, onReset: () => { setUserDistractorChoice(null); setShowDistractorResult(false); setShowListeningTranscript(false); setListeningEvaluation(null); stopSpeech(); } };
      case 'listening-map':
        return { list: listeningMapDrills, index: selectedMapIndex, setIndex: setSelectedMapIndex, onReset: () => { setUserMapChoice(null); setShowMapResult(false); setShowListeningTranscript(false); setListeningEvaluation(null); stopSpeech(); } };
      case 'listening-signposting':
        return { list: listeningSignDrills, index: selectedSignIndex, setIndex: setSelectedSignIndex, onReset: () => { setUserSignChoice(null); setShowSignResult(false); setShowListeningTranscript(false); setListeningEvaluation(null); stopSpeech(); } };
      // Speaking
      case 'speaking-area':
        return { 
          list: speakingAreaDrills, 
          index: selectedAreaIndex, 
          setIndex: setSelectedAreaIndex, 
          onReset: () => { 
            setUserAreaNotes({ answer: '', reason: '', example: '', alternative: '' }); 
            setShowAreaModel(false); 
            setIsRecordingArea(false); 
            setSpeakingEvaluation(null); 
            stopSpeech(); 
          } 
        };
      case 'speaking-fillers':
        return { 
          list: speakingFillersDrills, 
          index: selectedFillerIndex, 
          setIndex: setSelectedFillerIndex, 
          onReset: () => { 
            setUserFillerChoice(null); 
            setShowFillerResult(false); 
            stopSpeech(); 
          } 
        };
      case 'speaking-collocations':
        return { 
          list: speakingCollocDrills, 
          index: selectedSpeakingCollocIndex, 
          setIndex: setSelectedSpeakingCollocIndex, 
          onReset: () => { 
            setUserSpeakingCollocChoice(null); 
            setShowSpeakingCollocResult(false); 
            stopSpeech(); 
          } 
        };
      case 'speaking-part3-counter':
        return { 
          list: speakingPart3Drills, 
          index: selectedPart3Index, 
          setIndex: setSelectedPart3Index, 
          onReset: () => { 
            setShowPart3Model(false); 
            setUserPart3SpokenText(''); 
            setIsRecordingPart3(false); 
            setSpeakingEvaluation(null); 
            stopSpeech(); 
          } 
        };
      default:
        return { list: [], index: 0, setIndex: () => {}, onReset: () => {} };
    }
  };

  const handleSelectDrill = (newIdx) => {
    const { list, setIndex, onReset } = getActiveDrillInfo();
    if (newIdx >= 0 && newIdx < list.length) {
      setIndex(newIdx);
      onReset();
      if (list[newIdx]?.id) {
        recordAttempt(list[newIdx].id);
      }
    }
  };

  /**
   * Smart pagination toolbar that scales gracefully from 1 to 50+ drills
   * Integrated with Smart Content Filter Bar, StarRatingWidget & Real Attempts Count
   */
  const renderPaginationBar = () => {
    const { list, index } = getActiveDrillInfo();
    const currentItem = list[index];
    const total = list.length;
    const totalMasteredInThisTab = allDrills.filter(d => d.type === activeTab && masteredIds.includes(d.id)).length;

    if (total === 0) {
      if (currentUser && hideMasteredDrills && totalMasteredInThisTab > 0) {
        return (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-emerald-800 font-bold">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>Tuyệt vời! Bạn đã đánh dấu "Đã thuộc" toàn bộ {totalMasteredInThisTab} bài tập trong dạng này.</span>
            </div>
            <p className="text-xs text-emerald-700">
              Các bài đã thuộc được tự động ẩn khỏi danh sách luyện tập. Bạn có thể bấm nút bên dưới để ôn tập lại bất kỳ lúc nào.
            </p>
            <button
              type="button"
              onClick={() => handleToggleHideMastered(false)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hiện lại tất cả bài đã thuộc để ôn tập</span>
            </button>
          </div>
        );
      }
      if (drillSearchQuery || drillQuickFilter !== 'all') {
        return (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 text-xs">
            <p className="text-slate-600 font-semibold">
              Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={() => {
                setDrillSearchQuery('');
                setDrillQuickFilter('all');
                setDrillSortBy('rating_desc');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800 transition"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
        {/* ROW 1: Smart Filter Controls (Search, Quick Chips, Sort) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Instant Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={drillSearchQuery}
              onChange={(e) => {
                setDrillSearchQuery(e.target.value);
                const { setIndex, onReset } = getActiveDrillInfo();
                setIndex(0);
                onReset();
              }}
              placeholder="Tìm bài tập, chủ đề..."
              className="pl-8 pr-7 py-1 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 w-40 sm:w-52 font-medium text-slate-800 shadow-2xs placeholder:text-slate-400"
            />
            {drillSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setDrillSearchQuery('');
                  const { setIndex, onReset } = getActiveDrillInfo();
                  setIndex(0);
                  onReset();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Quick Filter Chips */}
            <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setDrillQuickFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  drillQuickFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setDrillQuickFilter('top_rated')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  drillQuickFilter === 'top_rated' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Đánh giá từ 4.8★ trở lên"
              >
                ⭐ 4.8★+
              </button>
              <button
                type="button"
                onClick={() => setDrillQuickFilter('trending')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  drillQuickFilter === 'trending' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Nhiều lượt luyện tập nhất"
              >
                🔥 Hot
              </button>
              <button
                type="button"
                onClick={() => setDrillQuickFilter('manual')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                  drillQuickFilter === 'manual' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Chỉ hiển thị bài tập tạo thủ công"
              >
                <PenTool className="w-2.5 h-2.5" />
                <span>✍️ Thủ công</span>
              </button>
              <button
                type="button"
                onClick={() => setDrillQuickFilter('ai')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                  drillQuickFilter === 'ai' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Chỉ hiển thị bài tập do AI sinh"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>🤖 AI sinh</span>
              </button>
            </div>

            {/* Sort Select */}
            <select
              value={drillSortBy}
              onChange={(e) => setDrillSortBy(e.target.value)}
              className="px-2 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-2xs cursor-pointer"
            >
              <option value="rating_desc">⭐ Rating cao nhất</option>
              <option value="attempts_desc">🔥 Luyện nhiều nhất</option>
              <option value="difficulty_desc">💎 Độ khó cao</option>
              <option value="difficulty_asc">🌱 Độ khó cơ bản</option>
              <option value="title_asc">🔤 Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* ROW 2: Navigation, Attempts, Star Rating & Mastered Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">
              Bài tập: <span className="text-red-600 font-extrabold text-sm">{index + 1}</span> / {total}
            </span>
            {total > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleSelectDrill(index - 1)}
                  disabled={index === 0}
                  className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs cursor-pointer"
                  title="Bài trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDrill(index + 1)}
                  disabled={index === total - 1}
                  className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs cursor-pointer"
                  title="Bài tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hide Mastered Checkbox */}
            {currentUser && totalMasteredInThisTab > 0 && (
              <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={hideMasteredDrills}
                  onChange={(e) => handleToggleHideMastered(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="font-semibold text-emerald-800 text-[11px]">Ẩn câu đã thuộc ({totalMasteredInThisTab})</span>
              </label>
            )}
          </div>

          {/* Current Drill Star Rating, Publicity Badge & Mastered Action */}
          {currentItem && (
            <div className="flex items-center flex-wrap gap-1.5">
              {/* Interactive 5-Star Rating & Real Attempts Count */}
              <StarRatingWidget
                itemId={currentItem.id}
                size="xs"
                showAttempts={true}
              />

              {/* Mastered / Đã Thuộc Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    alert('Tính năng "Đã thuộc" giúp ẩn bài tập đã thuần thục khỏi danh sách luyện tập. Vui lòng đăng nhập để lưu tiến trình!');
                    onOpenAuth?.();
                    return;
                  }
                  onToggleMastered?.(currentItem.id);
                }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center space-x-1 transition-all cursor-pointer shadow-2xs ${
                  masteredIds.includes(currentItem.id)
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                }`}
                title={masteredIds.includes(currentItem.id)
                  ? "Bài này đã thuộc. Bấm để bỏ đánh dấu (Ôn tập lại)"
                  : "Đánh dấu 'Đã thuộc' (Sẽ ẩn khỏi danh sách luyện tập nếu bạn bật 'Ẩn câu đã thuộc')"}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>{masteredIds.includes(currentItem.id) ? 'Đã thuộc' : 'Thuộc bài'}</span>
              </button>

              {currentItem.isCommunity || currentItem.isPublic ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  <span>🌐 Cộng Đồng</span>
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-300 flex items-center gap-1 shadow-2xs">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>🔒 Riêng tư</span>
                </span>
              )}
              {(currentItem.isManual || (currentItem.isCustom && !currentItem.isAiGenerated)) && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <PenTool className="w-3 h-3 text-emerald-700" />
                  <span>✍️ Thủ Công</span>
                </span>
              )}
              {currentItem.isAiGenerated && (
                <button
                  type="button"
                  onClick={() => handleToggleDrillPublic(currentItem.id)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                  title={currentItem.isPublic ? 'Chuyển bài tập này sang Riêng tư' : 'Chia sẻ bài tập này thành tài nguyên chung của web'}
                >
                  {currentItem.isPublic ? 'Khóa riêng' : 'Mở chia sẻ'}
                </button>
              )}
            </div>
          )}

          {/* Quick Jump Dropdown / Pill Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
            {total > 12 ? (
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium whitespace-nowrap">Chuyển nhanh:</span>
                <select
                  value={index}
                  onChange={(e) => handleSelectDrill(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs"
                >
                  {list.map((d, i) => (
                    <option key={d.id || i} value={i}>
                      Bài {i + 1}: {d.title || d.category || `Bài tập ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center space-x-1 overflow-x-auto py-0.5 max-w-md">
                {list.map((d, i) => (
                  <button
                    key={d.id || i}
                    onClick={() => handleSelectDrill(i)}
                    className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      index === i
                        ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/20 scale-105'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleEvaluateParaphrase = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
      return;
    }
    if (!candidateParaText.trim()) return;

    setIsEvaluatingPara(true);
    setParaEvaluation(null);
    try {
      if (currentPara?.id) {
        recordAttempt(currentPara.id);
      }
      const res = await evaluateParaphrase({
        originalSentence: currentPara.originalSentence,
        candidateSentence: candidateParaText,
        apiKey,
        model
      });
      setParaEvaluation(res);
    } catch (err) {
      alert(err.message || 'Lỗi khi chấm câu.');
    } finally {
      setIsEvaluatingPara(false);
    }
  };

  const handleGenerateDrill = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
      return;
    }

    setIsGeneratingDrill(true);
    setDrillGenMessage('AI đang tạo bài tập mới chuẩn Cambridge IELTS...');

    try {
      const newDrill = await generateMicroDrill({
        drillType: activeTab,
        apiKey,
        model
      });

      // Enrich listening drills with clean audioText parameter and respect user's sharing preference
      const isPub = Boolean(isAutoShare);
      const enrichedDrill = {
        ...newDrill,
        isPublic: isPub,
        isCommunity: isPub,
        isAiGenerated: true,
        creatorEmail: isPub ? 'Cộng Đồng IELTS' : 'Tôi',
        audioText: newDrill.audioText || newDrill.ttsText || newDrill.promptAudioText || newDrill.audioSnippetText || newDrill.audioDirectionsText || ''
      };

      // Update state and persist to LocalStorage
      const updated = [...allDrills, enrichedDrill];
      setAllDrills(updated);

      try {
        const customOnly = updated.filter(d => d.isAiGenerated);
        localStorage.setItem('ielts_custom_micro_drills', JSON.stringify(customOnly));
        if (isPub) {
          const commOnly = updated.filter(d => d.isAiGenerated && d.isPublic);
          localStorage.setItem('ielts_community_micro_drills', JSON.stringify(commOnly));
          // Save to Supabase Cloud for all visitors
          savePublicDrill(enrichedDrill);
          try {
            if ('BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_micro_drills_realtime');
              bc.postMessage({ type: 'NEW_DRILL', drill: enrichedDrill });
              bc.close();
            }
          } catch (e) {}
        }
      } catch (e) {
        console.error('Failed to persist drills to localStorage:', e);
      }

      // Automatically switch to the newly created drill
      const targetList = updated.filter(d => d.type === activeTab);
      const newIdx = targetList.length - 1;
      const { setIndex, onReset } = getActiveDrillInfo();
      setIndex(newIdx);
      onReset();
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo bài tập mới từ AI.');
    } finally {
      setIsGeneratingDrill(false);
      setDrillGenMessage('');
    }
  };

  const handleManualDrillCreated = (newDrill, isPub) => {
    const updated = [...allDrills, newDrill];
    setAllDrills(updated);
    try {
      const customOnly = updated.filter(d => d.isCustom || d.isManual);
      localStorage.setItem('ielts_custom_micro_drills', JSON.stringify(customOnly));
      if (isPub) {
        const commOnly = updated.filter(d => (d.isCustom || d.isManual) && d.isPublic);
        localStorage.setItem('ielts_community_micro_drills', JSON.stringify(commOnly));
        savePublicDrill(newDrill);
        try {
          if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('ielts_micro_drills_realtime');
            bc.postMessage({ type: 'NEW_DRILL', drill: newDrill });
            bc.close();
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Failed to persist manual drill:', e);
    }

    // Automatically switch to the newly created drill
    const targetList = updated.filter(d => d.type === activeTab);
    const newIdx = targetList.length - 1;
    const { setIndex, onReset } = getActiveDrillInfo();
    setIndex(newIdx);
    onReset();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-200 ${
      isExpanded 
        ? 'p-0 bg-slate-950' 
        : 'p-1 sm:p-2 lg:p-3 bg-slate-900/60 backdrop-blur-xs'
    }`}>
      <div className={`bg-white shadow-2xl overflow-hidden overscroll-contain flex flex-col transition-all duration-200 ${
        isExpanded 
          ? 'w-screen h-screen max-w-none max-h-none rounded-none' 
          : 'rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] h-[96dvh] max-h-[96dvh]'
      }`}>
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-xs">
              <Puzzle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-xl font-bold truncate">Phòng Luyện Bổ Trợ (Micro-Drills)</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wide shrink-0">
                  Đa Kỹ Năng
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block truncate">
                Rèn luyện phản xạ ngôn ngữ, phá các bẫy tư duy kinh điển trước khi bước vào phòng thi thật
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Fullscreen / Expanded Workspace Toggle */}
            <button 
              type="button"
              onClick={toggleExpanded} 
              className={`p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isExpanded ? "Thu gọn giao diện phòng luyện (Alt + Z)" : "Mở rộng toàn màn hình phòng luyện (Alt + Z)"}
              aria-label={isExpanded ? "Thu gọn phòng luyện" : "Mở rộng phòng luyện"}
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <button 
              onClick={onClose} 
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng phòng luyện"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level 1: Room Selector Bar (Phòng Chuyên Môn) */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar touch-pan-x shrink-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
              Phòng Luyện:
            </span>

            {/* Room 1: Chung */}
            <button
              onClick={() => handleRoomChange('general')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'general'
                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Phòng Chung</span>
            </button>

            {/* Room 2: Chuyên Writing */}
            <button
              onClick={() => handleRoomChange('writing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'writing'
                  ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chuyên Writing</span>
            </button>

            {/* Room 3: Chuyên Reading */}
            <button
              onClick={() => handleRoomChange('reading')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'reading'
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chuyên Reading</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-black">
                MỚI
              </span>
            </button>

            {/* Room 4: Chuyên Listening */}
            <button
              onClick={() => handleRoomChange('listening')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'listening'
                  ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Chuyên Listening</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-400 text-slate-900 text-[9px] font-black">
                MỚI
              </span>
            </button>

            {/* Room 5: Chuyên Speaking */}
            <button
              onClick={() => handleRoomChange('speaking')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'speaking'
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Chuyên Speaking</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-900 text-[9px] font-black">
                MỚI
              </span>
            </button>
          </div>
        </div>

        {/* Level 2: Sub-tabs within Active Room & AI Generator Button */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 sm:px-4 pt-2 gap-2 overflow-x-auto no-scrollbar touch-pan-x text-xs font-semibold text-slate-600 shrink-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
              {/* SUB-TABS FOR GENERAL */}
              {activeRoom === 'general' && (
                <>
                  <button
                    onClick={() => setActiveTab('collocation')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'collocation' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Collocations C1-C2 ({collocDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('context-vocab')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'context-vocab' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đoán Nghĩa Từ Ngữ Cảnh ({contextVocabDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sentence-chunking')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'sentence-chunking' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5 text-blue-600" />
                    <span>Giải Phẫu Câu Phức S-V-O ({chunkDrills.length})</span>
                  </button>
                </>
              )}

              {/* SUB-TABS FOR WRITING */}
              {activeRoom === 'writing' && (
                <>
                  <button
                    onClick={() => setActiveTab('fill-blanks')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                      activeTab === 'fill-blanks' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    1. Điền Chỗ Trống ({fillDrills.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('true-false')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                      activeTab === 'true-false' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    2. Đọc Số Liệu Task 1 ({tfDrills.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('paraphrase')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'paraphrase' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <span>3. Paraphrase Mở/Thân Bài ({paraDrills.length})</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </button>
                  <button
                    onClick={() => setActiveTab('error-spotting')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                      activeTab === 'error-spotting' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    4. Tìm Sửa Lỗi ({errorDrills.length})
                  </button>
                </>
              )}

              {/* SUB-TABS FOR READING */}
              {activeRoom === 'reading' && (
                <>
                  <button
                    onClick={() => setActiveTab('reading-tfng')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'reading-tfng' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <span>1. Bẫy True / False / Not Given ({readingTfngDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reading-paraphrase')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'reading-paraphrase' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-amber-500" />
                    <span>2. Săn Paraphrase Bài Đọc ({readingParaDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reading-headings')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'reading-headings' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>3. Phá Bẫy Matching Headings ({readingHeadingsDrills.length})</span>
                  </button>
                </>
              )}

              {/* SUB-TABS FOR LISTENING */}
              {activeRoom === 'listening' && (
                <>
                  <button
                    onClick={() => setActiveTab('listening-dictation')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'listening-dictation' ? 'border-purple-600 text-purple-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5 text-purple-600" />
                    <span>1. Chép Chính Tả 3 Cấp ({listeningDictationDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('listening-spelling')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'listening-spelling' ? 'border-purple-600 text-purple-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. Đánh Vần & Con Số ({listeningSpellingDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('listening-distractor')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'listening-distractor' ? 'border-purple-600 text-purple-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>3. Phá Bẫy Đổi Ý ({listeningDistractorDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('listening-map')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'listening-map' ? 'border-purple-600 text-purple-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4. Bản Đồ & Hướng Đi ({listeningMapDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('listening-signposting')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'listening-signposting' ? 'border-purple-600 text-purple-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>5. Bắt Tín Hiệu Part 4 ({listeningSignDrills.length})</span>
                  </button>
                </>
              )}

              {/* SUB-TABS FOR SPEAKING */}
              {activeRoom === 'speaking' && (
                <>
                  <button
                    onClick={() => setActiveTab('speaking-area')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'speaking-area' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Mở Rộng Ý A.R.E.A ({speakingAreaDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('speaking-fillers')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'speaking-fillers' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>2. Từ Đệm Mua Thời Gian ({speakingFillersDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('speaking-collocations')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'speaking-collocations' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>3. Collocations Tự Nhiên ({speakingCollocDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('speaking-part3-counter')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'speaking-part3-counter' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-teal-600" />
                    <span>4. Phản Biện Đa Chiều Part 3 ({speakingPart3Drills.length})</span>
                  </button>
                </>
              )}
            </div>

            {/* AI Generator & Privacy Control Container */}
            <div className="flex items-center space-x-1.5 shrink-0 mb-1.5">
              {/* Privacy Sharing Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !isAutoShare;
                  setIsAutoShare(next);
                  try { localStorage.setItem('ielts_auto_share_ai_content', JSON.stringify(next)); } catch (e) {}
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 border transition-all cursor-pointer ${
                  isAutoShare 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
                title={isAutoShare 
                  ? 'Đang bật: Bài tập AI sinh ra sẽ được cập nhật vào tài nguyên chung của web (Mặc định). Bấm để chuyển sang Riêng tư.' 
                  : 'Đang tắt: Bài tập AI sinh ra chỉ lưu riêng cho bạn trên máy này. Bấm để bật chia sẻ tài nguyên chung của web.'}
              >
                {isAutoShare ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">🌐 Chia sẻ web</span>
                    <span className="sm:hidden">🌐 Web</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">🔒 Riêng tư</span>
                    <span className="sm:hidden">🔒 Riêng</span>
                  </>
                )}
              </button>

              {/* Manual Cloud Sync Button */}
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shadow-2xs"
                title="Bấm để đồng bộ tức thời tất cả câu hỏi từ Cloud & giữa các tab"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}</span>
              </button>

              {/* Manual Drill Creator Button */}
              <button
                type="button"
                onClick={() => setIsManualDrillModalOpen(true)}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
                title="Tự tay tạo thêm 1 bài tập mới theo đúng dạng đang xem"
              >
                <PenTool className="w-3 h-3" />
                <span>✍️ Tạo Bài Thủ Công</span>
              </button>

              {/* AI Generator Button */}
              <button
                onClick={handleGenerateDrill}
                disabled={isGeneratingDrill}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1.5 shrink-0 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                title="Nhờ AI tạo thêm 1 bài tập mới theo đúng dạng đang xem"
              >
                {isGeneratingDrill ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3 h-3" />
                    <span>AI Tạo Bài Mới</span>
                  </>
                )}
              </button>
            </div>
          </div>

        {drillGenMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between">
            <span>{drillGenMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 sm:pb-8 space-y-4">
          
          {/* Render Pagination Bar if not in Roadmap rooms */}
          {activeRoom !== 'listening' && renderPaginationBar()}


          {/* ============================================================ */}
          {/* DOMAIN SUB-ROOMS MODULAR ARCHITECTURE                        */}
          {/* English standardization references:                          */}
          {/* "Your Selection:", "1. Exam Question:", "2. Passage Excerpt:"*/}
          {/* ============================================================ */}
          {activeRoom === 'reading' && (
            <ReadingDrillRoom
              activeTab={activeTab}
              currentTfng={currentTfng}
              userTfngChoice={userTfngChoice}
              setUserTfngChoice={setUserTfngChoice}
              showTfngResult={showTfngResult}
              setShowTfngResult={setShowTfngResult}
              currentReadingPara={currentReadingPara}
              showReadingParaAnalysis={showReadingParaAnalysis}
              setShowReadingParaAnalysis={setShowReadingParaAnalysis}
              currentHeadings={currentHeadings}
              userHeadingChoice={userHeadingChoice}
              setUserHeadingChoice={setUserHeadingChoice}
              showHeadingsResult={showHeadingsResult}
              setShowHeadingsResult={setShowHeadingsResult}
            />
          )}

          {activeRoom === 'general' && (
            <GeneralDrillRoom
              activeTab={activeTab}
              currentVocab={currentVocab}
              userVocabChoice={userVocabChoice}
              setUserVocabChoice={setUserVocabChoice}
              showVocabResult={showVocabResult}
              setShowVocabResult={setShowVocabResult}
              currentChunk={currentChunk}
              showChunkAnalysis={showChunkAnalysis}
              setShowChunkAnalysis={setShowChunkAnalysis}
              currentColloc={currentColloc}
              userCollocAnswers={userCollocAnswers}
              setUserCollocAnswers={setUserCollocAnswers}
              showCollocResults={showCollocResults}
              setShowCollocResults={setShowCollocResults}
            />
          )}

          {activeRoom === 'writing' && (
            <WritingDrillRoom
              activeTab={activeTab}
              currentFill={currentFill}
              userFillAnswers={userFillAnswers}
              setUserFillAnswers={setUserFillAnswers}
              showFillResults={showFillResults}
              setShowFillResults={setShowFillResults}
              currentTf={currentTf}
              userTfAnswers={userTfAnswers}
              setUserTfAnswers={setUserTfAnswers}
              showTfResults={showTfResults}
              setShowTfResults={setShowTfResults}
              currentPara={currentPara}
              candidateParaText={candidateParaText}
              setCandidateParaText={setCandidateParaText}
              paraEvaluation={paraEvaluation}
              setParaEvaluation={setParaEvaluation}
              isEvaluatingPara={isEvaluatingPara}
              handleEvaluateParaphrase={handleEvaluateParaphrase}
              currentError={currentError}
              userCorrectionText={userCorrectionText}
              setUserCorrectionText={setUserCorrectionText}
              showErrorAnswer={showErrorAnswer}
              setShowErrorAnswer={setShowErrorAnswer}
            />
          )}

          {activeRoom === 'listening' && (
            <ListeningDrillRoom
              activeTab={activeTab}
              renderPaginationBar={renderPaginationBar}
              currentDictation={currentDictation}
              userDictationInput={userDictationInput}
              setUserDictationInput={setUserDictationInput}
              showDictationFeedback={showDictationFeedback}
              setShowDictationFeedback={setShowDictationFeedback}
              currentSpelling={currentSpelling}
              userSpellingInput={userSpellingInput}
              setUserSpellingInput={setUserSpellingInput}
              showSpellingResult={showSpellingResult}
              setShowSpellingResult={setShowSpellingResult}
              currentDistractor={currentDistractor}
              userDistractorChoice={userDistractorChoice}
              setUserDistractorChoice={setUserDistractorChoice}
              showDistractorResult={showDistractorResult}
              setShowDistractorResult={setShowDistractorResult}
              showListeningTranscript={showListeningTranscript}
              setShowListeningTranscript={setShowListeningTranscript}
              currentMap={currentMap}
              userMapChoice={userMapChoice}
              setUserMapChoice={setUserMapChoice}
              showMapResult={showMapResult}
              setShowMapResult={setShowMapResult}
              currentSign={currentSign}
              userSignChoice={userSignChoice}
              setUserSignChoice={setUserSignChoice}
              showSignResult={showSignResult}
              setShowSignResult={setShowSignResult}
              saveListeningHistory={saveListeningHistory}
              handleEvaluateCurrentListening={handleEvaluateCurrentListening}
              isEvaluatingListening={isEvaluatingListening}
              listeningEvaluation={listeningEvaluation}
            />
          )}

          {activeRoom === 'speaking' && (
            <SpeakingDrillRoom
              activeTab={activeTab}
              currentArea={currentArea}
              userAreaNotes={userAreaNotes}
              setUserAreaNotes={setUserAreaNotes}
              isRecordingArea={isRecordingArea}
              setIsRecordingArea={setIsRecordingArea}
              showAreaModel={showAreaModel}
              setShowAreaModel={setShowAreaModel}
              currentFiller={currentFiller}
              userFillerChoice={userFillerChoice}
              setUserFillerChoice={setUserFillerChoice}
              showFillerResult={showFillerResult}
              setShowFillerResult={setShowFillerResult}
              currentSpeakingColloc={currentSpeakingColloc}
              userSpeakingCollocChoice={userSpeakingCollocChoice}
              setUserSpeakingCollocChoice={setUserSpeakingCollocChoice}
              showSpeakingCollocResult={showSpeakingCollocResult}
              setShowSpeakingCollocResult={setShowSpeakingCollocResult}
              currentPart3={currentPart3}
              userPart3SpokenText={userPart3SpokenText}
              setUserPart3SpokenText={setUserPart3SpokenText}
              isRecordingPart3={isRecordingPart3}
              setIsRecordingPart3={setIsRecordingPart3}
              showPart3Model={showPart3Model}
              setShowPart3Model={setShowPart3Model}
              handlePlaySpeakingAudio={handlePlaySpeakingAudio}
              playingAudioId={playingAudioId}
              handleToggleVoiceDictation={handleToggleVoiceDictation}
              handleEvaluateCurrentSpeaking={handleEvaluateCurrentSpeaking}
              isEvaluatingSpeaking={isEvaluatingSpeaking}
              speakingEvaluation={speakingEvaluation}
            />
          )}


        </div>

        {/* MANUAL DRILL CREATOR MODAL */}
        <ManualMicroDrillModal
          isOpen={isManualDrillModalOpen}
          onClose={() => setIsManualDrillModalOpen(false)}
          activeRoom={activeRoom}
          activeTab={activeTab}
          onDrillCreated={handleManualDrillCreated}
          currentUser={currentUser}
        />

      </div>
    </div>
  );
}
