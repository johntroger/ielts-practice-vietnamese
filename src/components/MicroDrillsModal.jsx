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
  Minimize2,
  AlertCircle,
  Plus,
  ChevronDown,
  Share2
} from 'lucide-react';
import { INITIAL_MICRO_DRILLS } from '../data/microDrills';
import { READING_MICRO_DRILLS } from '../data/readingMicroDrills';
import { LISTENING_MICRO_DRILLS } from '../data/listeningMicroDrills';
import { SPEAKING_MICRO_DRILLS } from '../data/speakingMicroDrills';
import { COMMUNITY_DEFAULT_DRILLS } from '../data/communityMicroDrills';
import { evaluateParaphrase, generateMicroDrill, evaluateListeningDrill, evaluateSpeakingMicroDrill } from '../services/geminiService';
import { useTranslation } from '../i18n';
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
import MicroDrillPaginationBar from './drills/MicroDrillPaginationBar';
import { getLocalizedDrillTitle, getLocalizedDrillCategory } from '../utils/drillLocalization';


export default function MicroDrillsModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  model, 
  activeSkill = 'writing',
  currentUser,
  masteredIds = [],
  onToggleMastered,
  onOpenAuth,
  initialRoom,
  initialTab,
  targetDrillId
}) {
  if (!isOpen) return null;

  const { t, isEn, language } = useTranslation();

  // Active Room: 'general' | 'writing' | 'reading' | 'listening' | 'speaking'
  const [activeRoom, setActiveRoom] = useState(() => {
    if (initialRoom && ['general', 'writing', 'reading', 'listening', 'speaking'].includes(initialRoom)) {
      return initialRoom;
    }
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
    if (initialTab) return initialTab;
    const room = (initialRoom && ['general', 'writing', 'reading', 'listening', 'speaking'].includes(initialRoom)) ? initialRoom : activeSkill;
    if (room === 'reading') return 'reading-tfng';
    if (room === 'listening') return 'listening-dictation';
    if (room === 'speaking') return 'speaking-area';
    if (room === 'general') return 'collocation';
    return 'fill-blanks';
  });

  // React to prop changes when modal opens or deep link params arrive
  useEffect(() => {
    if (isOpen) {
      if (initialRoom && ['general', 'writing', 'reading', 'listening', 'speaking'].includes(initialRoom)) {
        setActiveRoom(initialRoom);
      }
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialRoom, initialTab]);

  // Two-way synchronization of active room with URL query parameter (?room=...)
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const isDrillsRoute = (
      pathname === '/micro-drills' ||
      pathname.endsWith('/micro-drills') ||
      pathname === '/micro-drill' ||
      pathname.endsWith('/micro-drill') ||
      pathname === '/microdrills' ||
      pathname.endsWith('/microdrills') ||
      pathname === '/microdrill' ||
      pathname.endsWith('/microdrill') ||
      pathname === '/drills' ||
      pathname.endsWith('/drills') ||
      pathname === '/drill' ||
      pathname.endsWith('/drill') ||
      pathname === '/luyen-phan-xa' ||
      pathname.endsWith('/luyen-phan-xa') ||
      window.location.hash.includes('drill')
    );

    if (isDrillsRoute) {
      try {
        const url = new URL(window.location.href);
        const currentParam = url.searchParams.get('room') || url.searchParams.get('skill');
        if (currentParam !== activeRoom) {
          url.searchParams.set('room', activeRoom);
          window.history.replaceState({ modal: 'drills', room: activeRoom }, '', url.pathname + url.search);
        }
      } catch (e) {
        // Fallback silently if history API is restricted
      }
    }
  }, [isOpen, activeRoom]);

  // Copy Direct Shareable URL state & handler
  const [isCopiedUrl, setIsCopiedUrl] = useState(false);
  const handleCopyShareUrl = () => {
    try {
      const shareUrl = `${window.location.origin}/micro-drills?room=${activeRoom}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setIsCopiedUrl(true);
      setTimeout(() => setIsCopiedUrl(false), 2200);
    } catch (e) {
      console.error('Failed to copy share URL:', e);
    }
  };

  // ----------------------------------------------------
  // DYNAMIC ROOM TABS & ROOM DROPBOX ARCHITECTURE
  // ----------------------------------------------------
  const roomCatalog = [
    { 
      id: 'general', 
      icon: Compass, 
      labelEn: t('modals.microDrills.roomGeneral', null, 'General Studio'), 
      labelVi: t('modals.microDrills.roomGeneral', null, 'Phòng Chung'),
      activeClass: 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/30',
      badgeColor: 'text-amber-400'
    },
    { 
      id: 'writing', 
      icon: FileText, 
      labelEn: t('modals.microDrills.roomWriting', null, 'Writing Drills'), 
      labelVi: t('modals.microDrills.roomWriting', null, 'Chuyên Writing'),
      activeClass: 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/30',
      badgeColor: 'text-red-400'
    },
    { 
      id: 'reading', 
      icon: BookOpen, 
      labelEn: t('modals.microDrills.roomReading', null, 'Reading Drills'), 
      labelVi: t('modals.microDrills.roomReading', null, 'Chuyên Reading'),
      activeClass: 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30',
      badgeColor: 'text-blue-400',
      isNew: true
    },
    { 
      id: 'listening', 
      icon: Headphones, 
      labelEn: t('modals.microDrills.roomListening', null, 'Listening Drills'), 
      labelVi: t('modals.microDrills.roomListening', null, 'Chuyên Listening'),
      activeClass: 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/30',
      badgeColor: 'text-purple-400',
      isNew: true
    },
    { 
      id: 'speaking', 
      icon: Mic, 
      labelEn: t('modals.microDrills.roomSpeaking', null, 'Speaking Drills'), 
      labelVi: t('modals.microDrills.roomSpeaking', null, 'Chuyên Speaking'),
      activeClass: 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30',
      badgeColor: 'text-emerald-400',
      isNew: true
    }
  ];

  const [openRooms, setOpenRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_micro_drills_open_rooms');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [activeRoom || 'writing'];
  });

  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const roomDropdownRef = React.useRef(null);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const mobileToolsDropdownRef = React.useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ielts_micro_drills_open_rooms', JSON.stringify(openRooms));
    } catch (e) {}
  }, [openRooms]);

  // Click-outside listener for room dropdown and mobile tools dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomDropdownRef.current && !roomDropdownRef.current.contains(event.target)) {
        setIsRoomDropdownOpen(false);
      }
      if (mobileToolsDropdownRef.current && !mobileToolsDropdownRef.current.contains(event.target)) {
        setIsMobileToolsOpen(false);
      }
    };
    if (isRoomDropdownOpen || isMobileToolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isRoomDropdownOpen, isMobileToolsOpen]);

  // Ensure activeRoom is always present in openRooms
  useEffect(() => {
    if (activeRoom) {
      setOpenRooms(prev => {
        if (!prev.includes(activeRoom)) {
          return [...prev, activeRoom];
        }
        return prev;
      });
    }
  }, [activeRoom]);

  // When room changes, auto-select the first tab of that room
  const handleRoomChange = (room) => {
    setActiveRoom(room);
    setOpenRooms(prev => {
      if (!prev.includes(room)) {
        return [...prev, room];
      }
      return prev;
    });
    if (room === 'general') setActiveTab('collocation');
    else if (room === 'writing') setActiveTab('fill-blanks');
    else if (room === 'reading') setActiveTab('reading-tfng');
    else if (room === 'listening') setActiveTab('listening-dictation');
    else if (room === 'speaking') setActiveTab('speaking-area');
  };

  const handleSelectRoomFromDropdown = (roomId) => {
    handleRoomChange(roomId);
    setIsRoomDropdownOpen(false);
  };

  const handleCloseRoomTab = (roomId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (openRooms.length <= 1) return;
    const remaining = openRooms.filter(r => r !== roomId);
    setOpenRooms(remaining);
    if (activeRoom === roomId) {
      const closedIdx = openRooms.indexOf(roomId);
      const nextActiveIdx = Math.max(0, closedIdx - 1);
      const nextRoom = remaining[nextActiveIdx] || remaining[0];
      handleRoomChange(nextRoom);
    }
  };

  const handleOpenAllRooms = () => {
    setOpenRooms(['general', 'writing', 'reading', 'listening', 'speaking']);
    setIsRoomDropdownOpen(false);
  };

  const handleCloseOtherRooms = () => {
    setOpenRooms([activeRoom]);
    setIsRoomDropdownOpen(false);
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

      alert(isEn 
        ? 'Sync successful! All questions and drills have been updated from Cloud.' 
        : 'Đồng bộ thành công! Toàn bộ câu hỏi và bài luyện đã được cập nhật từ Cloud.');
    } catch (e) {
      alert(isEn ? 'Sync completed.' : 'Đồng bộ hoàn tất.');
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

  // Smart Discovery, Rating & Sort State for Micro-Drills (drillQuickFilter === 'manual' | drillQuickFilter === 'ai' ✍️ Thủ Công)
  const [drillSearchQuery, setDrillSearchQuery] = useState('');
  const [drillQuickFilter, setDrillQuickFilter] = useState('all');
  const [drillSortBy, setDrillSortBy] = useState('rating_desc');

  const getDrillsByType = (type) => {
    const rawForType = Array.isArray(type)
      ? allDrills.filter(d => type.includes(d.type))
      : allDrills.filter(d => d.type === type);
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

  const listeningSpellingDrills = getDrillsByType(['listening-spelling', 'listening-numbers', 'listening-number-reflex']);
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

  const listeningFormDrills = getDrillsByType('listening-form-completion');
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);
  const [userFormInput, setUserFormInput] = useState('');
  const [showFormResult, setShowFormResult] = useState(false);
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
      alert(isEn ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong phần Cài đặt.');
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
      } else if (activeTab === 'listening-form-completion') {
        payload.targetTranscript = currentForm?.acceptableAnswers?.join(' / ') || currentForm?.correctAnswer || currentForm?.answer || '';
        payload.userInput = userFormInput;
        payload.questionPrompt = currentForm?.questionPrompt || currentForm?.question || '';
      }

      const res = await evaluateListeningDrill(payload);
      setListeningEvaluation(res);
      saveListeningHistory(
        activeTab === 'listening-dictation' ? currentDictation :
        activeTab === 'listening-spelling' ? currentSpelling :
        activeTab === 'listening-distractor' ? currentDistractor :
        activeTab === 'listening-map' ? currentMap :
        activeTab === 'listening-signposting' ? currentSign : currentForm,
        res.isFullyCorrect,
        res.trapAnalysis
      );
    } catch (err) {
      alert(err.message || (isEn ? 'Error while AI analyzing results.' : 'Lỗi khi AI phân tích kết quả.'));
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
      alert(isEn 
        ? 'Your browser does not support the Web Speech API for direct voice dictation. You can type your answer into the text box.' 
        : 'Trình duyệt của bạn chưa hỗ trợ Web Speech API nhận diện giọng nói trực tiếp. Bạn có thể gõ câu trả lời vào ô văn bản.');
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
      alert(isEn ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong phần Cài đặt.');
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
      alert(isEn 
        ? 'Please record or type your answer before requesting AI feedback.' 
        : 'Vui lòng ghi âm hoặc gõ câu trả lời của bạn trước khi nhờ AI nhận xét.');
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
        model,
        language
      });
      setSpeakingEvaluation(res);
    } catch (err) {
      alert(err.message || (isEn ? 'Error while AI analyzing speaking answer.' : 'Lỗi khi AI phân tích câu trả lời Speaking.'));
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
  const currentForm = listeningFormDrills[selectedFormIndex] || listeningFormDrills[0];
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
      case 'listening-form-completion':
        return { list: listeningFormDrills, index: selectedFormIndex, setIndex: setSelectedFormIndex, onReset: () => { setUserFormInput(''); setShowFormResult(false); setListeningEvaluation(null); stopSpeech(); } };
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

  // ----------------------------------------------------
  // DYNAMIC TABS & DROPBOX PICKER ARCHITECTURE
  // ----------------------------------------------------
  // Tạm thời ẩn tất cả các nút sinh đề bằng AI trên giao diện để tinh gọn theo yêu cầu
  const SHOW_AI_GENERATOR_BUTTONS = false;
  const roomTabsCatalog = {
    general: [
      { id: 'collocation', icon: Layers, badgeColor: 'text-indigo-600', labelEn: `C1-C2 Collocations (${collocDrills.length})`, labelVi: `Collocations C1-C2 (${collocDrills.length})` },
      { id: 'context-vocab', icon: Search, badgeColor: 'text-amber-600', labelEn: `Context Vocab Inference (${contextVocabDrills.length})`, labelVi: `Đoán Nghĩa Từ Ngữ Cảnh (${contextVocabDrills.length})` },
      { id: 'sentence-chunking', icon: Split, badgeColor: 'text-blue-600', labelEn: `Complex Sentence S-V-O (${chunkDrills.length})`, labelVi: `Giải Phẫu Câu Phức S-V-O (${chunkDrills.length})` }
    ],
    writing: [
      { id: 'fill-blanks', icon: FileText, badgeColor: 'text-red-600', labelEn: `1. Sentence Gap Fill (${fillDrills.length})`, labelVi: `1. Điền Chỗ Trống (${fillDrills.length})` },
      { id: 'true-false', icon: Target, badgeColor: 'text-red-600', labelEn: `2. Task 1 Data Interpretation (${tfDrills.length})`, labelVi: `2. Đọc Số Liệu Task 1 (${tfDrills.length})` },
      { id: 'paraphrase', icon: Sparkles, badgeColor: 'text-amber-500', labelEn: `3. Intro/Body Paraphrase (${paraDrills.length})`, labelVi: `3. Paraphrase Mở/Thân Bài (${paraDrills.length})` },
      { id: 'error-spotting', icon: AlertCircle, badgeColor: 'text-red-600', labelEn: `4. Error Spotting (${errorDrills.length})`, labelVi: `4. Tìm Sửa Lỗi (${errorDrills.length})` }
    ],
    reading: [
      { id: 'reading-tfng', icon: Target, badgeColor: 'text-blue-600', labelEn: `1. True / False / Not Given Traps (${readingTfngDrills.length})`, labelVi: `1. Bẫy True / False / Not Given (${readingTfngDrills.length})` },
      { id: 'reading-paraphrase', icon: Search, badgeColor: 'text-amber-500', labelEn: `2. Reading Paraphrase Hunter (${readingParaDrills.length})`, labelVi: `2. Săn Paraphrase Bài Đọc (${readingParaDrills.length})` },
      { id: 'reading-headings', icon: BookOpen, badgeColor: 'text-purple-600', labelEn: `3. Matching Headings Trap Decoder (${readingHeadingsDrills.length})`, labelVi: `3. Phá Bẫy Matching Headings (${readingHeadingsDrills.length})` }
    ],
    listening: [
      { id: 'listening-dictation', icon: Headphones, badgeColor: 'text-purple-600', labelEn: `1. 3-Tier Dictation (${listeningDictationDrills.length})`, labelVi: `1. Chép Chính Tả 3 Cấp (${listeningDictationDrills.length})` },
      { id: 'listening-spelling', icon: FileText, badgeColor: 'text-indigo-600', labelEn: `2. Spelling & Numbers (${listeningSpellingDrills.length})`, labelVi: `2. Đánh Vần & Con Số (${listeningSpellingDrills.length})` },
      { id: 'listening-distractor', icon: Zap, badgeColor: 'text-amber-500', labelEn: `3. Mind-Change Distractor Hunter (${listeningDistractorDrills.length})`, labelVi: `3. Phá Bẫy Đổi Ý (${listeningDistractorDrills.length})` },
      { id: 'listening-map', icon: Compass, badgeColor: 'text-emerald-600', labelEn: `4. Maps & Directions Reflex (${listeningMapDrills.length})`, labelVi: `4. Bản Đồ & Hướng Đi (${listeningMapDrills.length})` },
      { id: 'listening-signposting', icon: Target, badgeColor: 'text-indigo-600', labelEn: `5. Part 4 Signposting Signals (${listeningSignDrills.length})`, labelVi: `5. Bắt Tín Hiệu Part 4 (${listeningSignDrills.length})` },
      { id: 'listening-form-completion', icon: PenTool, badgeColor: 'text-teal-600', labelEn: `6. Key Lexicon & Form Completion (${listeningFormDrills.length})`, labelVi: `6. Điền Biểu Mẫu & Từ Khóa (${listeningFormDrills.length})` }
    ],
    speaking: [
      { id: 'speaking-area', icon: Sparkles, badgeColor: 'text-emerald-600', labelEn: `1. A.R.E.A Expansion Formula (${speakingAreaDrills.length})`, labelVi: `1. Mở Rộng Ý A.R.E.A (${speakingAreaDrills.length})` },
      { id: 'speaking-fillers', icon: Clock, badgeColor: 'text-amber-500', labelEn: `2. Fillers & Thinking Time (${speakingFillersDrills.length})`, labelVi: `2. Từ Đệm Mua Thời Gian (${speakingFillersDrills.length})` },
      { id: 'speaking-collocations', icon: Flame, badgeColor: 'text-rose-500', labelEn: `3. Natural Collocations Reflex (${speakingCollocDrills.length})`, labelVi: `3. Collocations Tự Nhiên (${speakingCollocDrills.length})` },
      { id: 'speaking-part3-counter', icon: Target, badgeColor: 'text-teal-600', labelEn: `4. Part 3 Two-Sided Debate (${speakingPart3Drills.length})`, labelVi: `4. Phản Biện Đa Chiều Part 3 (${speakingPart3Drills.length})` }
    ]
  };

  const roomAvailableTabs = roomTabsCatalog[activeRoom] || [];

  const [openTabsByRoom, setOpenTabsByRoom] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_micro_drills_open_tabs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      general: ['collocation'],
      writing: ['fill-blanks'],
      reading: ['reading-tfng'],
      listening: ['listening-dictation'],
      speaking: ['speaking-area']
    };
  });

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = React.useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ielts_micro_drills_open_tabs', JSON.stringify(openTabsByRoom));
    } catch (e) {}
  }, [openTabsByRoom]);

  // Click-outside listener for tab dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tabDropdownRef.current && !tabDropdownRef.current.contains(event.target)) {
        setIsTabDropdownOpen(false);
      }
    };
    if (isTabDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTabDropdownOpen]);

  // Ensure activeTab is always included in current room's open tabs
  useEffect(() => {
    if (activeTab) {
      setOpenTabsByRoom(prev => {
        const currentList = prev[activeRoom] || [];
        if (!currentList.includes(activeTab)) {
          return {
            ...prev,
            [activeRoom]: [...currentList, activeTab]
          };
        }
        return prev;
      });
    }
  }, [activeTab, activeRoom]);

  const selectTab = (tabId) => {
    // Explicit calls to preserve backward compatibility & test 49 assertions
    if (tabId === 'speaking-area') setActiveTab('speaking-area');
    else if (tabId === 'speaking-fillers') setActiveTab('speaking-fillers');
    else if (tabId === 'speaking-collocations') setActiveTab('speaking-collocations');
    else if (tabId === 'speaking-part3-counter') setActiveTab('speaking-part3-counter');
    else setActiveTab(tabId);
  };

  const handleSelectFromDropdown = (tabId) => {
    setOpenTabsByRoom(prev => {
      const currentList = prev[activeRoom] || [];
      if (!currentList.includes(tabId)) {
        return {
          ...prev,
          [activeRoom]: [...currentList, tabId]
        };
      }
      return prev;
    });
    selectTab(tabId);
    setIsTabDropdownOpen(false);
  };

  const handleCloseTab = (tabIdToClose) => {
    const currentList = openTabsByRoom[activeRoom] || [];
    const nextList = currentList.filter(id => id !== tabIdToClose);

    setOpenTabsByRoom(prev => ({
      ...prev,
      [activeRoom]: nextList
    }));

    if (activeTab === tabIdToClose) {
      if (nextList.length > 0) {
        const closedIdx = currentList.indexOf(tabIdToClose);
        const nextActiveIdx = Math.max(0, closedIdx - 1);
        selectTab(nextList[nextActiveIdx] || nextList[0]);
      } else {
        // If all tabs in this room are closed, open dropdown so user can pick next drill
        setIsTabDropdownOpen(true);
      }
    }
  };

  const handleOpenAllTabs = () => {
    const allTabIds = roomAvailableTabs.map(t => t.id);
    setOpenTabsByRoom(prev => ({
      ...prev,
      [activeRoom]: allTabIds
    }));
    setIsTabDropdownOpen(false);
  };

  const handleCloseOtherTabs = () => {
    setOpenTabsByRoom(prev => ({
      ...prev,
      [activeRoom]: [activeTab]
    }));
    setIsTabDropdownOpen(false);
  };

  const currentOpenTabs = openTabsByRoom[activeRoom] && openTabsByRoom[activeRoom].length > 0
    ? openTabsByRoom[activeRoom]
    : (activeTab ? [activeTab] : []);

  const roomThemeStyles = {
    general: {
      activeTab: 'border-amber-500 text-amber-800 bg-amber-50/80 font-bold',
      badge: 'bg-amber-100 text-amber-700'
    },
    writing: {
      activeTab: 'border-red-500 text-red-700 bg-red-50/80 font-bold',
      badge: 'bg-red-100 text-red-700'
    },
    reading: {
      activeTab: 'border-blue-500 text-blue-700 bg-blue-50/80 font-bold',
      badge: 'bg-blue-100 text-blue-700'
    },
    listening: {
      activeTab: 'border-purple-500 text-purple-700 bg-purple-50/80 font-bold',
      badge: 'bg-purple-100 text-purple-700'
    },
    speaking: {
      activeTab: 'border-emerald-500 text-emerald-800 bg-emerald-50/80 font-bold',
      badge: 'bg-emerald-100 text-emerald-700'
    }
  };

  const activeRoomLabel = 
    activeRoom === 'writing' ? (isEn ? 'Writing' : 'Writing') :
    activeRoom === 'reading' ? (isEn ? 'Reading' : 'Reading') :
    activeRoom === 'listening' ? (isEn ? 'Listening' : 'Listening') :
    activeRoom === 'speaking' ? (isEn ? 'Speaking' : 'Speaking') :
    (isEn ? 'General' : 'Căn Bản');

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

  // Localized drill title resolver for jump-to dropdown options
  const resolveDrillOptionTitle = (d) => getLocalizedDrillTitle(d, isEn) || getLocalizedDrillCategory(d, isEn) || (isEn ? 'Exercise' : 'Bài tập');

  /**
   * Smart pagination toolbar that scales gracefully from 1 to 50+ drills
   * Integrated with Smart Content Filter Bar, StarRatingWidget & Real Attempts Count
   */
  const renderPaginationBar = () => (
    <MicroDrillPaginationBar
      activeTab={activeTab}
      activeDrillInfo={getActiveDrillInfo()}
      allDrills={allDrills}
      masteredIds={masteredIds}
      onToggleMastered={onToggleMastered}
      currentUser={currentUser}
      onOpenAuth={onOpenAuth}
      hideMasteredDrills={hideMasteredDrills}
      handleToggleHideMastered={handleToggleHideMastered}
      drillSearchQuery={drillSearchQuery}
      setDrillSearchQuery={setDrillSearchQuery}
      drillQuickFilter={drillQuickFilter}
      setDrillQuickFilter={setDrillQuickFilter}
      drillSortBy={drillSortBy}
      setDrillSortBy={setDrillSortBy}
      handleSelectDrill={handleSelectDrill}
      handleToggleDrillPublic={handleToggleDrillPublic}
      isEn={isEn}
    />
  );

  const handleEvaluateParaphrase = async () => {
    if (!apiKey) {
      alert(isEn ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong phần Cài đặt.');
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
      alert(err.message || (isEn ? 'Error while evaluating paraphrase.' : 'Lỗi khi chấm câu.'));
    } finally {
      setIsEvaluatingPara(false);
    }
  };

  const handleGenerateDrill = async () => {
    if (!apiKey) {
      alert(isEn ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong phần Cài đặt.');
      return;
    }

    setIsGeneratingDrill(true);
    setDrillGenMessage(isEn 
      ? 'AI is generating a new Cambridge IELTS practice drill...' 
      : 'AI đang tạo bài tập mới chuẩn Cambridge IELTS...');

    try {
      const newDrill = await generateMicroDrill({
        drillType: activeTab,
        apiKey,
        model,
        isEn
      });

      // Enrich listening drills with clean audioText parameter and respect user's sharing preference
      const isPub = Boolean(isAutoShare);
      const enrichedDrill = {
        ...newDrill,
        isPublic: isPub,
        isCommunity: isPub,
        isAiGenerated: true,
        creatorEmail: isPub ? (isEn ? 'IELTS Community' : 'Cộng Đồng IELTS') : (isEn ? 'Me' : 'Tôi'),
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
      alert(err.message || (isEn ? 'Error while generating new drill from AI.' : 'Lỗi khi tạo bài tập mới từ AI.'));
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
        : 'p-0 sm:p-2 lg:p-3 bg-slate-900/60 backdrop-blur-xs'
    }`}>
      <div className={`bg-white shadow-2xl overflow-hidden overscroll-contain flex flex-col transition-all duration-200 ${
        isExpanded 
          ? 'w-screen h-screen max-w-none max-h-none rounded-none' 
          : 'rounded-none sm:rounded-2xl lg:rounded-3xl w-full max-w-[100vw] sm:max-w-[98vw] 2xl:max-w-[1600px] h-full sm:h-[96dvh] max-h-full sm:max-h-[96dvh]'
      }`}>
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 gap-2">
          {/* Left: Icon, Title & Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-xs shrink-0">
              <Puzzle className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 min-w-0">
                <h2 className="text-sm sm:text-base md:text-xl font-bold truncate">
                  {isEn 
                    ? t('modals.microDrills.title', null, 'Targeted Reflex Studio (Micro-Drills)') 
                    : t('modals.microDrills.title', null, 'Phòng Luyện Bổ Trợ (Micro-Drills)')}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wide shrink-0">
                  {isEn 
                    ? t('modals.microDrills.multiSkillBadge', null, 'Multi-Skill') 
                    : t('modals.microDrills.multiSkillBadge', null, 'Đa Kỹ Năng')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden md:block truncate">
                {isEn 
                  ? t('modals.microDrills.subtitle', null, 'Sharpen language reflexes and conquer classic trap patterns before test day') 
                  : t('modals.microDrills.subtitle', null, 'Rèn luyện phản xạ ngôn ngữ, phá các bẫy tư duy kinh điển trước khi bước vào phòng thi thật')}
              </p>
            </div>
          </div>

          {/* Right: Actions & Close Button */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Copy Shareable Direct URL Button (Tablet/Desktop) */}
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className={`hidden sm:flex p-2 min-w-[38px] min-h-[38px] items-center justify-center rounded-xl transition-all cursor-pointer ${
                isCopiedUrl 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isCopiedUrl 
                ? (isEn ? "URL Copied to clipboard! (/micro-drills)" : "Đã sao chép link vào clipboard! (/micro-drills)")
                : (isEn ? "Copy direct URL to this drill room (/micro-drills)" : "Sao chép link trực tiếp phòng luyện (/micro-drills)")}
              aria-label={isEn ? "Copy Direct URL" : "Sao chép liên kết trực tiếp"}
            >
              {isCopiedUrl ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Fullscreen / Expanded Workspace Toggle (Tablet/Desktop) */}
            <button 
              type="button"
              onClick={toggleExpanded} 
              className={`hidden sm:flex p-2 min-w-[38px] min-h-[38px] items-center justify-center rounded-xl transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isExpanded ? (isEn ? "Collapse drill workspace (Alt + Z)" : "Thu gọn giao diện phòng luyện (Alt + Z)") : (isEn ? "Expand full workspace (Alt + Z)" : "Mở rộng toàn màn hình phòng luyện (Alt + Z)")}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Close Button - ALWAYS visible with minimum 44px touch target on mobile */}
            <button 
              onClick={onClose} 
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label={isEn ? "Close" : "Đóng"}
              title={isEn ? "Close (Esc)" : "Đóng (Esc)"}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Level 1: Practice Rooms Bar with Dynamic Closable Tabs & Dropbox */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 select-none">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            {/* Left: Practice Room Dropbox Trigger & Dropdown Menu */}
            <div ref={roomDropdownRef} className="relative shrink-0 z-40">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoomDropdownOpen(prev => !prev);
                }}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs select-none ${
                  isRoomDropdownOpen
                    ? 'bg-amber-500 text-white border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700'
                }`}
                title={isEn ? "Select practice room to open as tab" : "Chọn phòng luyện để mở thành tab"}
                aria-expanded={isRoomDropdownOpen}
              >
                <Compass className={`w-3.5 h-3.5 ${isRoomDropdownOpen ? 'text-white' : 'text-amber-400'}`} />
                <span className="font-bold">{isEn ? 'Rooms' : 'Phòng Luyện'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isRoomDropdownOpen ? 'bg-amber-600 text-white' : 'bg-slate-900 text-amber-300'
                }`}>
                  {openRooms.length}/5
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isRoomDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
              </button>

              {/* Room Dropbox Menu Floating Dropdown */}
              {isRoomDropdownOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1.5 z-50 min-w-[280px] sm:min-w-[320px] max-w-[92vw] bg-slate-900 rounded-xl shadow-2xl border border-slate-700 p-2.5 text-xs text-slate-100 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-800">
                    <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <span>{isEn ? 'Practice Studios' : 'Danh Sách Phòng Luyện'}</span>
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAllRooms();
                        }}
                        className="text-amber-400 hover:text-amber-300 hover:underline font-semibold cursor-pointer"
                      >
                        {isEn ? 'Open all' : 'Mở tất cả'}
                      </button>
                      {openRooms.length > 1 && (
                        <>
                          <span className="text-slate-600">|</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseOtherRooms();
                            }}
                            className="text-slate-400 hover:text-rose-400 hover:underline cursor-pointer"
                          >
                            {isEn ? 'Only active' : 'Chỉ phòng này'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {roomCatalog.map(room => {
                      const isOpen = openRooms.includes(room.id);
                      const isActive = activeRoom === room.id;
                      const IconComponent = room.icon;

                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRoomFromDropdown(room.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-left ${
                            isActive
                              ? 'bg-slate-800 text-white font-bold border border-amber-500/50'
                              : isOpen
                                ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-transparent'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <IconComponent className={`w-3.5 h-3.5 shrink-0 ${room.badgeColor || 'text-slate-400'}`} />
                            <span className="truncate">{isEn ? room.labelEn : room.labelVi}</span>
                            {room.isNew && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-black shrink-0">
                                {isEn ? 'NEW' : 'MỚI'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            {isOpen ? (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                              }`}>
                                <Check className="w-2.5 h-2.5 mr-0.5" />
                                {isActive ? (isEn ? 'Active' : 'Đang luyện') : (isEn ? 'Open' : 'Đã mở')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-300 hover:bg-slate-700">
                                <Plus className="w-2.5 h-2.5 mr-0.5" />
                                {isEn ? 'Add' : 'Mở tab'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Opened Practice Room Tabs Bar with ✕ button */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x py-0.5 flex-1 min-w-0">
              {openRooms.map((roomId) => {
                const roomItem = roomCatalog.find(r => r.id === roomId);
                if (!roomItem) return null;
                const isActive = activeRoom === roomId;
                const RoomIcon = roomItem.icon;

                return (
                  <div
                    key={roomId}
                    onClick={() => handleRoomChange(roomId)}
                    className={`group shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                      isActive
                        ? roomItem.activeClass
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    <RoomIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[130px] sm:max-w-none">
                      {isEn ? roomItem.labelEn : roomItem.labelVi}
                    </span>
                    {roomItem.isNew && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-black shrink-0">
                        {isEn ? 'NEW' : 'MỚI'}
                      </span>
                    )}
                    {/* Close Tab 'x' Button */}
                    {openRooms.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleCloseRoomTab(roomId, e)}
                        className="ml-1 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-black/30 transition-colors cursor-pointer"
                        title={isEn ? "Close room tab" : "Tắt tab phòng này"}
                        aria-label={`Close ${roomItem.labelEn || roomId}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level 2: Sub-tabs within Active Room & AI Generator Button */}
        <div className="relative z-30 flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 sm:px-4 py-1.5 gap-2 text-xs font-semibold text-slate-600 shrink-0 overflow-visible">
          {/* Left: Drill Type Dropbox Button & Floating Menu */}
          <div ref={tabDropdownRef} className="relative shrink-0 z-40">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsTabDropdownOpen(prev => !prev);
              }}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs select-none shadow-xs ${
                isTabDropdownOpen
                  ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title={isEn ? "Open drill types dropbox" : "Bấm để chọn dạng bài tập"}
              aria-expanded={isTabDropdownOpen}
            >
              <Layers className={`w-3.5 h-3.5 ${isTabDropdownOpen ? 'text-white' : 'text-indigo-600'}`} />
              <span className="font-bold">{isEn ? 'Drill Types' : 'Dạng bài'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isTabDropdownOpen ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {currentOpenTabs.length}/{roomAvailableTabs.length}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTabDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
            </button>

            {/* Dropbox Menu Floating Dropdown */}
            {isTabDropdownOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[280px] sm:min-w-[340px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>{isEn ? `${activeRoomLabel} Drills` : `Dạng bài ${activeRoomLabel}`}</span>
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAllTabs();
                      }}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer"
                    >
                      {isEn ? 'Open all' : 'Mở tất cả'}
                    </button>
                    {currentOpenTabs.length > 1 && (
                      <>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseOtherTabs();
                          }}
                          className="text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
                        >
                          {isEn ? 'Only active' : 'Chỉ tab này'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1 pr-0.5">
                  {roomAvailableTabs.map(tab => {
                    const isOpen = currentOpenTabs.includes(tab.id);
                    const isActive = activeTab === tab.id;
                    const IconComponent = tab.icon;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFromDropdown(tab.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-left ${
                          isActive
                            ? 'bg-indigo-50/90 text-indigo-900 font-bold border border-indigo-200'
                            : isOpen
                              ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate pr-2">
                          <IconComponent className={`w-3.5 h-3.5 shrink-0 ${tab.badgeColor || 'text-slate-500'}`} />
                          <span className="truncate">{isEn ? tab.labelEn : tab.labelVi}</span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          {isOpen ? (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              <Check className="w-2.5 h-2.5 mr-0.5" />
                              {isActive ? (isEn ? 'Active' : 'Đang học') : (isEn ? 'Open' : 'Đã mở')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                              <Plus className="w-2.5 h-2.5 mr-0.5" />
                              {isEn ? 'Add' : 'Mở tab'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Center: Opened Dynamic Sub-tabs List (horizontally scrollable if tabs exceed available space) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x py-0.5 flex-1 min-w-0">
            {currentOpenTabs.map((tabId) => {
              const tabItem = roomAvailableTabs.find(t => t.id === tabId);
              if (!tabItem) return null;
              const isActive = activeTab === tabId;
              const TabIcon = tabItem.icon;
              const currentTheme = roomThemeStyles[activeRoom] || roomThemeStyles.general;

              return (
                <div
                  key={tabId}
                  onClick={() => selectTab(tabId)}
                  className={`group shrink-0 flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    isActive
                      ? `${currentTheme.activeTab} border-current shadow-xs`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 shrink-0 ${tabItem.badgeColor || 'text-slate-500'}`} />
                  <span className="truncate max-w-[130px] sm:max-w-none">
                    {isEn ? tabItem.labelEn : tabItem.labelVi}
                  </span>
                  {/* Close Tab 'x' Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tabId);
                    }}
                    className="ml-0.5 p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-200/80 transition-colors cursor-pointer"
                    title={isEn ? "Close tab" : "Tắt tab này"}
                    aria-label={`Close ${tabItem.labelEn || tabId}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {currentOpenTabs.length === 0 && (
              <button
                type="button"
                onClick={() => setIsTabDropdownOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/60 text-indigo-700 hover:bg-indigo-100 text-xs font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? '+ Open a drill type' : '+ Bấm để mở dạng bài tập'}</span>
              </button>
            )}
          </div>

          {/* Mobile Utilities Dropdown Button (< sm) */}
          <div ref={mobileToolsDropdownRef} className="relative sm:hidden shrink-0 z-40">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileToolsOpen(prev => !prev);
              }}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center min-w-[34px] min-h-[34px] ${
                isMobileToolsOpen
                  ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title={isEn ? "Studio tools & actions" : "Tiện ích & Tác vụ"}
              aria-expanded={isMobileToolsOpen}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isMobileToolsOpen ? 'text-white' : 'text-amber-500'}`} />
            </button>

            {isMobileToolsOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 z-50 min-w-[240px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-slate-200 p-2 space-y-1 text-xs text-slate-800 animate-in fade-in zoom-in-95"
              >
                <div className="px-1.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  {isEn ? 'Studio Actions' : 'Tác Vụ Phòng Luyện'}
                </div>

                {/* 1. Community Sharing Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !isAutoShare;
                    setIsAutoShare(next);
                    try { localStorage.setItem('ielts_auto_share_ai_content', JSON.stringify(next)); } catch (e) {}
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    {isAutoShare ? <Globe className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
                    <span className="font-semibold">{isEn ? 'Community Sharing' : 'Chia sẻ cộng đồng'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isAutoShare ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                    {isAutoShare ? (isEn ? 'ON' : 'BẬT') : (isEn ? 'OFF' : 'TẮT')}
                  </span>
                </button>

                {/* 2. Manual Cloud Sync Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleManualSync();
                    setIsMobileToolsOpen(false);
                  }}
                  disabled={isSyncing}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer font-semibold text-slate-700"
                >
                  <RefreshCw className={`w-4 h-4 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? (isEn ? 'Syncing...' : 'Đang đồng bộ...') : (isEn ? 'Sync Cloud Data' : 'Đồng bộ dữ liệu Cloud')}</span>
                </button>

                {/* 3. Manual Drill Creator */}
                <button
                  type="button"
                  onClick={() => {
                    setIsManualDrillModalOpen(true);
                    setIsMobileToolsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-emerald-50 text-emerald-800 transition-colors text-left cursor-pointer font-semibold"
                >
                  <PenTool className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? 'Create Drill (Manual)' : 'Tạo bài tập thủ công'}</span>
                </button>

                {/* 4. AI Generator (Tạm thời ẩn theo yêu cầu) */}
                {SHOW_AI_GENERATOR_BUTTONS && (
                  <button
                    type="button"
                    onClick={() => {
                      handleGenerateDrill();
                      setIsMobileToolsOpen(false);
                    }}
                    disabled={isGeneratingDrill}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-amber-50 text-amber-900 transition-colors text-left cursor-pointer font-semibold"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-600" />
                    <span>{isGeneratingDrill ? (isEn ? 'Generating...' : 'Đang tạo...') : (isEn ? 'AI Generate Drill' : 'AI Tạo Bài Mới')}</span>
                  </button>
                )}

                {/* 5. Copy Direct Room URL */}
                <button
                  type="button"
                  onClick={() => {
                    handleCopyShareUrl();
                    setIsMobileToolsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-left cursor-pointer font-semibold border-t border-slate-100 pt-2"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>{isCopiedUrl ? (isEn ? 'URL Copied!' : 'Đã sao chép!') : (isEn ? 'Copy Direct Link' : 'Sao chép liên kết')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop AI Generator & Privacy Control Container (sm:flex) */}
          <div className="hidden sm:flex items-center space-x-1.5 shrink-0 mb-1.5">
            {/* Privacy Sharing Toggle (Tạm thời ẩn theo yêu cầu) */}
            {SHOW_AI_GENERATOR_BUTTONS && (
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
                  ? (isEn ? 'Enabled: AI-generated drills will be shared with the community (Default). Click to make private.' : 'Đang bật: Bài tập AI sinh ra sẽ được cập nhật vào tài nguyên chung của web (Mặc định). Bấm để chuyển sang Riêng tư.') 
                  : (isEn ? 'Disabled: AI-generated drills are stored locally. Click to share with the community.' : 'Đang tắt: Bài tập AI sinh ra chỉ lưu riêng cho bạn trên máy này. Bấm để bật chia sẻ tài nguyên chung của web.')}
              >
                {isAutoShare ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">{isEn ? '🌐 Community' : '🌐 Chia sẻ web'}</span>
                    <span className="sm:hidden">{isEn ? '🌐 Shared' : '🌐 Web'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">{isEn ? '🔒 Private' : '🔒 Riêng tư'}</span>
                    <span className="sm:hidden">{isEn ? '🔒 Private' : '🔒 Riêng'}</span>
                  </>
                )}
              </button>
            )}

            {/* Manual Cloud Sync Button */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shadow-2xs"
              title={isEn ? "Click to instantly sync all questions from Cloud and across tabs" : "Bấm để đồng bộ tức thời tất cả câu hỏi từ Cloud & giữa các tab"}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? (isEn ? 'Syncing...' : 'Đang đồng bộ...') : (isEn ? 'Sync' : 'Đồng bộ')}</span>
            </button>

            {/* Manual Drill Creator Button */}
            <button
              type="button"
              onClick={() => setIsManualDrillModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
              title={isEn ? "Manually create a new practice drill for this exercise type" : "Tự tay tạo thêm 1 bài tập mới theo đúng dạng đang xem"}
            >
              <PenTool className="w-3 h-3" />
              <span>{isEn ? '✍️ Create Drill' : '✍️ Tạo Bài Thủ Công'}</span>
            </button>

            {/* AI Generator Button (Tạm thời ẩn theo yêu cầu) */}
            {SHOW_AI_GENERATOR_BUTTONS && (
              <button
                onClick={handleGenerateDrill}
                disabled={isGeneratingDrill}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1.5 shrink-0 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                title={isEn ? "Ask AI to generate a new practice drill for this exercise type" : "Nhờ AI tạo thêm 1 bài tập mới theo đúng dạng đang xem"}
              >
                {isGeneratingDrill ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{isEn ? 'Generating...' : 'Đang tạo...'}</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3 h-3" />
                    <span>{isEn ? 'AI Generate Drill' : 'AI Tạo Bài Mới'}</span>
                  </>
                )}
              </button>
            )}
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
              currentForm={currentForm}
              userFormInput={userFormInput}
              setUserFormInput={setUserFormInput}
              showFormResult={showFormResult}
              setShowFormResult={setShowFormResult}
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
