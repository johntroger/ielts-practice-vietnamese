import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Headphones, 
  Volume2, 
  VolumeX,
  Play, 
  Square,
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  BarChart2, 
  Award, 
  FileText,
  BookOpen,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Puzzle,
  GraduationCap,
  Maximize2,
  Minimize2,
  MapPin,
  ZoomIn,
  ZoomOut,
  Search,
  Lock,
  ChevronDown,
  Sliders
} from 'lucide-react';
import AudioPlayerBar from './AudioPlayerBar';
import ListeningQuestionPane from './ListeningQuestionPane';
import ListeningPaletteBar from './ListeningPaletteBar';
import ListeningResultModal from './ListeningResultModal';
import ListeningTranscriptModal from './ListeningTranscriptModal';
import ListeningLibraryModal from './ListeningLibraryModal';
import ListeningURLExerciseGeneratorModal from './ListeningURLExerciseGeneratorModal';
import { playIELTSSoundcheck, stopIELTSSoundcheck } from '../../utils/soundcheckAudio';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { useListeningExam } from '../../hooks/useListeningExam';
import { useListeningShortcuts } from '../../hooks/useListeningShortcuts';
import { INITIAL_LISTENING_TESTS } from '../../data/listeningTasks';
import { calculateListeningBandScore } from '../../data/listeningTasks';
import { scoreListeningExam } from '../../utils/listeningScorer';
import { deleteAudioBlob } from '../../utils/audioStorage';
import { useTranslation } from '../../i18n';
import { getListeningTestDisplayInfo } from '../../utils/testLocalizationHelper';
import {
  ListeningStrictHeaderBar,
  ListeningStatusBanners,
  ListeningWelcomeGate,
  ListeningPartTipsCard,
  ListeningScratchpadPane,
  ListeningInlineTranscriptPane,
  ListeningSoundcheckModalContent,
  ListeningFullscreenMapModal,
  ListeningConfirmSubmitModal
} from './ListeningExamOverlays';

const SNAPSHOT_KEY_PREFIX = 'ielts_listening_snapshot_';
const CUSTOM_TESTS_STORAGE_KEY = 'ielts_listening_custom_tests';

export default function ListeningWorkspace({
  apiKey,
  model,
  onOpenSettings,
  onOpenTheory,
  user,
  onSaveToVocabNotebook,
  onListeningSubmitted,
  onOpenDrills,
  initialTestId = INITIAL_LISTENING_TESTS[0]?.id || 'track2-flat-descriptions',
  initialExamMode = 'practice',
  openGeneratorTrigger,
  openLibraryTrigger,
  masteredIds = [],
  onToggleMastered,
  isSlimHeader = false,
  toggleSlimHeader
}) {
  const { t, language } = useTranslation();
  const isEn = language === 'en';
  // 1. All Listening Tests (Preloaded + Custom from URL)
  const [allListeningTests, setAllListeningTests] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_TESTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...INITIAL_LISTENING_TESTS, ...parsed];
        }
      }
    } catch (e) {}
    return INITIAL_LISTENING_TESTS;
  });

  const [currentTestId, setCurrentTestId] = useState(initialTestId);
  const [examMode, setExamMode] = useState(initialExamMode); // 'strict' | 'practice'
  const [activePart, setActivePart] = useState(1);
  const [hasStartedExam, setHasStartedExam] = useState(true);
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Tạm thời ẩn tất cả các nút sinh đề bằng AI trên giao diện để tinh gọn theo yêu cầu
  const SHOW_AI_GENERATOR_BUTTONS = false;

  // Dynamic Open Listening Tabs state with localStorage persistence
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const testDropdownRef = useRef(null);

  const [openListeningTabs, setOpenListeningTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_listening_open_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const targetId = initialTestId || INITIAL_LISTENING_TESTS[0]?.id;
          if (targetId && !parsed.includes(targetId)) {
            return [targetId, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {}
    return [initialTestId || INITIAL_LISTENING_TESTS[0]?.id || 'ielts-listening-track47-business-structures-case-studies'];
  });

  // Persist open tabs whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ielts_listening_open_tabs', JSON.stringify(openListeningTabs));
    } catch (e) {}
  }, [openListeningTabs]);

  // Ensure currentTestId is always included in openListeningTabs
  useEffect(() => {
    if (currentTestId && !openListeningTabs.includes(currentTestId)) {
      setOpenListeningTabs(prev => [currentTestId, ...prev]);
    }
  }, [currentTestId]);

  // Outside click listener for test dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (testDropdownRef.current && !testDropdownRef.current.contains(e.target)) {
        setIsTestDropdownOpen(false);
      }
    };
    if (isTestDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTestDropdownOpen]);

  // Helper to switch test cleanly
  const handleSwitchTest = (testId) => {
    const selectedTest = allListeningTests.find(t => t.id === testId);
    if (!selectedTest) return;
    setCurrentTestId(testId);
    setActivePart(selectedTest.targetPart || selectedTest.parts?.[0]?.partNumber || 1);
    setHasStartedExam(true);
    exam.resetExam();
    setBandResult(null);
    if (selectedTest.audioUrl) {
      audioEngine.loadAudio(selectedTest.audioUrl || selectedTest.fallbackAudioUrl);
    }
  };

  const handleSelectTestFromDropdown = (testId) => {
    if (!openListeningTabs.includes(testId)) {
      setOpenListeningTabs(prev => [...prev, testId]);
    }
    handleSwitchTest(testId);
    setIsTestDropdownOpen(false);
  };

  const handleCloseTestTab = (testId, e) => {
    if (e) e.stopPropagation();
    const nextTabs = openListeningTabs.filter(id => id !== testId);
    if (nextTabs.length === 0) {
      const r2Tests = allListeningTests.filter(t => t.audioUrl?.includes('.r2.dev'));
      const fallbackId = r2Tests.find(t => t.id !== testId)?.id || allListeningTests[0]?.id;
      if (fallbackId) {
        setOpenListeningTabs([fallbackId]);
        handleSwitchTest(fallbackId);
      }
      return;
    }
    setOpenListeningTabs(nextTabs);
    if (currentTestId === testId) {
      const closedIdx = openListeningTabs.indexOf(testId);
      const newActiveId = nextTabs[Math.min(closedIdx, nextTabs.length - 1)];
      handleSwitchTest(newActiveId);
    }
  };

  const handleOpenAllTestTabs = () => {
    const r2Ids = allListeningTests.filter(t => t.audioUrl?.includes('.r2.dev')).map(t => t.id);
    setOpenListeningTabs(r2Ids);
    setIsTestDropdownOpen(false);
  };

  const handleCloseOtherTestTabs = () => {
    setOpenListeningTabs([currentTestId]);
    setIsTestDropdownOpen(false);
  };

  // Sync external generator trigger
  useEffect(() => {
    if (openGeneratorTrigger) {
      setIsGeneratorOpen(true);
    }
  }, [openGeneratorTrigger]);

  // Sync external library trigger
  useEffect(() => {
    if (openLibraryTrigger) {
      setIsLibraryOpen(true);
    }
  }, [openLibraryTrigger]);

  // Soundcheck State & Controls
  const [isSoundchecking, setIsSoundchecking] = useState(false);
  const [soundcheckVolume, setSoundcheckVolume] = useState(1.0);

  // Stop soundcheck if modal closes
  useEffect(() => {
    if (!isSoundcheckOpen) {
      stopIELTSSoundcheck();
      setIsSoundchecking(false);
    }
  }, [isSoundcheckOpen]);

  // Soundcheck Handlers
  const handlePlaySoundcheck = () => {
    setIsSoundchecking(true);
    playIELTSSoundcheck({
      volume: soundcheckVolume,
      onStart: () => setIsSoundchecking(true),
      onEnd: () => setIsSoundchecking(false)
    });
  };

  const handleStopSoundcheck = () => {
    stopIELTSSoundcheck();
    setIsSoundchecking(false);
  };

  const handleSoundcheckVolumeChange = (newVol) => {
    const vol = parseFloat(newVol);
    setSoundcheckVolume(vol);
    audioEngine.changeVolume(vol);
  };

  // Band Score Result State
  const [bandResult, setBandResult] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_listening_last_result_' + currentTestId);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  // Accessibility State: Font Size & Contrast
  const [fontSizeMode, setFontSizeMode] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [contrastTheme, setContrastTheme] = useState('standard'); // 'standard' | 'dark' | 'yellowOnBlack'
  
  // Split pane drag width (percentage for left pane)
  const [splitWidth, setSplitWidth] = useState(48);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [mobileTab, setMobileTab] = useState('questions'); // 'context' | 'questions'
  const [leftPaneTab, setLeftPaneTab] = useState('overview'); // 'overview' | 'scratchpad' | 'transcript'
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsButtonRef = useRef(null);
  const [toolsDropdownCoords, setToolsDropdownCoords] = useState(null);

  const calcToolsCoords = () => {
    if (!toolsButtonRef.current) return null;
    const rect = toolsButtonRef.current.getBoundingClientRect();
    const desiredWidth = Math.min(270, window.innerWidth - 24);
    
    // Default preferred alignment: right-aligned with the button
    let left = rect.right - desiredWidth;
    
    // Smart clamp: prevent spilling off the left edge (at least 12px padding)
    if (left < 12) {
      left = 12;
    }
    // Smart clamp: prevent spilling off the right edge (at least 12px padding)
    if (left + desiredWidth > window.innerWidth - 12) {
      left = window.innerWidth - 12 - desiredWidth;
    }

    const coords = {
      top: rect.bottom + 6,
      left,
      width: desiredWidth,
      maxHeight: Math.max(220, window.innerHeight - rect.bottom - 16)
    };
    setToolsDropdownCoords(coords);
    return coords;
  };

  const handleToggleToolsMenu = (e) => {
    if (e) e.stopPropagation();
    if (isToolsMenuOpen) {
      setIsToolsMenuOpen(false);
      setToolsDropdownCoords(null);
    } else {
      calcToolsCoords();
      setIsToolsMenuOpen(true);
    }
  };

  useEffect(() => {
    if (!isToolsMenuOpen) {
      setToolsDropdownCoords(null);
      return;
    }
    calcToolsCoords();
    const handleUpdate = () => calcToolsCoords();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isToolsMenuOpen]);
  const [mapZoom, setMapZoom] = useState(1);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [scratchpadText, setScratchpadText] = useState(() => {
    try {
      return localStorage.getItem('ielts_listening_scratchpad_' + initialTestId) || '';
    } catch (e) {
      return '';
    }
  });

  // Responsive state for screen width >= 1024px (Desktop & Tablet Landscape)
  const [isDesktopOrLandscape, setIsDesktopOrLandscape] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopOrLandscape(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Splitter dragging handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitWidth(Math.max(25, Math.min(75, newWidth)));
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !containerRef.current || !e.touches || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      setSplitWidth(Math.max(25, Math.min(75, newWidth)));
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Sync scratchpad text when test changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ielts_listening_scratchpad_' + currentTestId);
      setScratchpadText(saved || '');
    } catch (e) {}
  }, [currentTestId]);

  const handleScratchpadChange = (val) => {
    setScratchpadText(val);
    try {
      localStorage.setItem('ielts_listening_scratchpad_' + currentTestId, val);
    } catch (e) {}
  };

  // Preparation Timer (30s Prep cue at start of each part)
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(0);
  const [isPrepActive, setIsPrepActive] = useState(false);

  // Crash Recovery / Auto-Resume Snapshot
  const [resumePrompt, setResumePrompt] = useState(null);

  // Active Test Object
  const currentTest = useMemo(() => {
    return allListeningTests.find(t => t.id === currentTestId) || allListeningTests[0] || INITIAL_LISTENING_TESTS[0];
  }, [allListeningTests, currentTestId]);

  // Current Part Object
  const currentPartData = useMemo(() => {
    return currentTest.parts?.find(p => p.partNumber === activePart) || currentTest.parts?.[0] || INITIAL_LISTENING_TESTS[0].parts[0];
  }, [currentTest, activePart]);

  // Detected Map / Diagram Group if active part contains one
  const mapGroup = useMemo(() => {
    return currentPartData?.questionGroups?.find(g => g.type === 'map_labelling' && g.mapImageUrl);
  }, [currentPartData]);

  // Handler: Add newly generated listening test from URL or Upload
  const handleAddCustomTest = (newTest) => {
    setAllListeningTests(prev => {
      const updated = [newTest, ...prev];
      try {
        // Only persist non-ephemeral tests to localStorage (ephemeral tests are cleaned up after exam)
        const customOnly = updated.filter(t => t.isCustom && !t.isEphemeral);
        localStorage.setItem(CUSTOM_TESTS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
    setCurrentTestId(newTest.id);
    const startPart = newTest.targetPart || newTest.parts?.[0]?.partNumber || 1;
    setActivePart(startPart);
    setHasStartedExam(true);
    exam.resetExam();
    setBandResult(null);
    if (newTest.audioUrl) {
      audioEngine.loadAudio(newTest.audioUrl);
    }
  };

  // Handler: Delete custom listening test
  const handleDeleteCustomTest = (testIdToDelete) => {
    setAllListeningTests(prev => {
      const updated = prev.filter(t => t.id !== testIdToDelete);
      try {
        const customOnly = updated.filter(t => t.isCustom || t.id?.startsWith('custom-'));
        localStorage.setItem(CUSTOM_TESTS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch (e) {}
      if (currentTestId === testIdToDelete) {
        setCurrentTestId(INITIAL_LISTENING_TESTS[0]?.id || 'lis-cam18-t1');
        setActivePart(1);
      }
      return updated;
    });
  };

  // Real-time synchronization across browser tabs for Listening
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CUSTOM_TESTS_STORAGE_KEY) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setAllListeningTests(() => {
              const map = new Map();
              [...INITIAL_LISTENING_TESTS, ...updated].forEach(t => { if (t && t.id) map.set(t.id, t); });
              return Array.from(map.values());
            });
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handler: Toggle publicity of custom listening test
  const handleToggleListeningPublic = (testId) => {
    setAllListeningTests(prev => {
      const updated = prev.map(t => {
        if (t.id === testId) {
          return { ...t, isPublic: !t.isPublic };
        }
        return t;
      });
      try {
        const customOnly = updated.filter(t => t.isCustom && !t.isEphemeral);
        localStorage.setItem(CUSTOM_TESTS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
  };

  // Candidate ID & Name for authentic CD-IELTS header
  const candidateName = user?.email ? user.email.split('@')[0].toUpperCase() : 'CANDIDATE';
  const candidateId = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000);
  }, []);

  // 2. Audio Engine Hook
  const audioEngine = useAudioEngine({
    initialSrc: currentTest.audioUrl || currentTest.fallbackAudioUrl,
    fallbackSrc: currentTest.fallbackAudioUrl || '/audio/cam18_test1_audio.mp3',
    examMode,
    onEnded: () => {
      console.log('Audio track finished playing.');
    }
  });

  // 3. Exam State Hook (Answers, Flags, Submission, Shortcuts)
  const exam = useListeningExam({
    testId: currentTestId,
    audioEngine,
    examMode,
    questionsData: currentTest.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions))
  });

  // 4. Keyboard Shortcuts Hook for Listening Audio (Clean Architecture)
  useListeningShortcuts({
    audioEngine,
    examMode,
    isEnabled: hasStartedExam && !isConfirmSubmitOpen,
    isModalOpen: isResultModalOpen || isSoundcheckOpen || isTranscriptOpen || isLibraryOpen || isGeneratorOpen
  });

  // Check for prior interrupted session on mount
  useEffect(() => {
    try {
      const savedSnapshot = localStorage.getItem(SNAPSHOT_KEY_PREFIX + currentTestId);
      if (savedSnapshot) {
        const parsed = JSON.parse(savedSnapshot);
        if (parsed && parsed.savedTime > 0 && !parsed.isCompleted) {
          setResumePrompt(parsed);
        }
      }
    } catch (e) {}
  }, [currentTestId]);

  // Auto-Save Snapshot Engine every 2 seconds
  useEffect(() => {
    if (!hasStartedExam) return;
    const interval = setInterval(() => {
      try {
        const snapshot = {
          testId: currentTestId,
          activePart,
          savedTime: audioEngine.currentTime,
          examMode,
          timestamp: new Date().toISOString(),
          isCompleted: exam.isSubmitted
        };
        localStorage.setItem(SNAPSHOT_KEY_PREFIX + currentTestId, JSON.stringify(snapshot));
      } catch (e) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [hasStartedExam, currentTestId, activePart, audioEngine.currentTime, examMode, exam.isSubmitted]);

  // 30s Prep Timer countdown
  useEffect(() => {
    let timer = null;
    if (isPrepActive && prepTimeRemaining > 0) {
      timer = setInterval(() => {
        setPrepTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPrepActive(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPrepActive, prepTimeRemaining]);

  // Handle Autoplay unlock and begin exam with safe buffer pre-flight
  const handleStartExam = async () => {
    await audioEngine.unlockAudio();
    setHasStartedExam(true);
    setIsPrepActive(true);
    setPrepTimeRemaining(30);
    // Trigger buffer preloading if not ready
    if (!audioEngine.isBufferReady) {
      audioEngine.forcePreload();
    }
    audioEngine.play();
  };

  // Switch active Part and synchronize audio
  const handleSelectPart = (pNum) => {
    setActivePart(pNum);
    const targetPart = currentTest.parts?.find(p => p.partNumber === pNum);
    if (targetPart?.audioUrl && targetPart.audioUrl !== currentTest.audioUrl && audioEngine.src !== targetPart.audioUrl) {
      audioEngine.loadAudio(targetPart.audioUrl);
    } else if (examMode === 'practice' && targetPart && typeof targetPart.audioTimestampStart === 'number') {
      audioEngine.seek(targetPart.audioTimestampStart);
    }
  };

  // Resume interrupted exam
  const handleResumeExam = () => {
    if (resumePrompt) {
      setActivePart(resumePrompt.activePart || 1);
      audioEngine.seek(resumePrompt.savedTime || 0);
      setHasStartedExam(true);
      setResumePrompt(null);
      audioEngine.play();
    }
  };

  // Discard saved exam
  const handleDiscardResume = () => {
    try {
      localStorage.removeItem(SNAPSHOT_KEY_PREFIX + currentTestId);
    } catch (e) {}
    setResumePrompt(null);
  };

  // Handle Submit Exam with 4-layer diagnostic scoring
  const handleConfirmSubmit = () => {
    exam.submitExam();
    setIsConfirmSubmitOpen(false);
    audioEngine.pause();

    const scored = scoreListeningExam({
      testData: currentTest,
      userAnswers: exam.userAnswers,
      timeSpentSeconds: audioEngine.currentTime
    });

    setBandResult(scored);
    setIsResultModalOpen(true);

    try {
      localStorage.setItem('ielts_listening_last_result_' + currentTestId, JSON.stringify(scored));
    } catch (e) {}

    if (onListeningSubmitted) {
      onListeningSubmitted({
        testId: currentTestId,
        testTitle: currentTest.title,
        correctCount: scored.correctCount,
        totalQuestions: scored.totalQuestions,
        band: scored.band,
        userAnswers: exam.userAnswers,
        submittedAt: scored.submittedAt,
        resultData: scored
      });
    }

    // AUTO-CLEANUP: If test was generated from local uploaded audio, delete audio blob and test definition to save website storage
    if (currentTest.isEphemeral || currentTest.isUploadedFile) {
      const storageIdToDelete = currentTest.audioStorageId;
      if (storageIdToDelete) {
        deleteAudioBlob(storageIdToDelete).catch(() => {});
      }
      if (currentTest.audioUrl && currentTest.audioUrl.startsWith('blob:')) {
        try { URL.revokeObjectURL(currentTest.audioUrl); } catch (e) {}
      }
      setAllListeningTests(prev => {
        const updated = prev.filter(t => t.id !== currentTest.id);
        try {
          const customOnly = updated.filter(t => t.isCustom && !t.isEphemeral);
          localStorage.setItem(CUSTOM_TESTS_STORAGE_KEY, JSON.stringify(customOnly));
        } catch (e) {}
        return updated;
      });
      try {
        localStorage.removeItem(SNAPSHOT_KEY_PREFIX + currentTest.id);
      } catch (e) {}
    }
  };

  // Accessibility styling classes
  const fontClass = fontSizeMode === 'large' ? 'text-base' : fontSizeMode === 'xlarge' ? 'text-lg' : 'text-sm';
  const themeBg = contrastTheme === 'dark' 
    ? 'bg-slate-900 text-slate-100' 
    : contrastTheme === 'yellowOnBlack' 
    ? 'bg-black text-yellow-300' 
    : 'bg-slate-100 text-slate-900';

  return (
    <div className={"flex-1 flex flex-col min-h-0 h-full overflow-hidden " + themeBg + " " + fontClass}>
      
      {/* 1. Header: Authentic CD-IELTS Bar in Strict Mode (Mở rộng tối đa phòng thi Listening) OR Standard Bar in Practice Mode */}
      {examMode === 'strict' ? (
        <ListeningStrictHeaderBar
          candidateName={candidateName}
          candidateId={candidateId}
          currentTest={currentTest}
          audioEngine={audioEngine}
          bandResult={bandResult}
          setIsResultModalOpen={setIsResultModalOpen}
          setContrastTheme={setContrastTheme}
          setFontSizeMode={setFontSizeMode}
          onOpenTheory={onOpenTheory}
          setExamMode={setExamMode}
          toggleSlimHeader={toggleSlimHeader}
          isSlimHeader={isSlimHeader}
          isEn={isEn}
          t={t}
        />
      ) : (
        /* Standard Header in Practice Mode (Clean Single-Row Architecture) */
        <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 shrink-0 shadow-2xs">
          
          {/* LEFT: Test Info & Question Count */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <h2 className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[260px] xl:max-w-[360px]">
                    {currentTest.title}
                  </h2>
                  {currentTest?.audioUrl?.includes('.r2.dev') ? (
                    <span 
                      className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[10px] font-black border border-cyan-300 shrink-0 shadow-2xs select-none"
                      title={isEn ? 'Cloudflare R2 Studio Audio (Original MP3)' : 'Audio Thực Chiến Cloudflare R2 (MP3 Gốc)'}
                    >
                      ☁️ R2
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                      {t('listening.cambridgeOfficial', 'Cambridge Official')}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-slate-500 whitespace-nowrap shrink-0">
                  <span className="shrink-0 font-medium">{t('listening.questionsCount', { count: currentTest.totalQuestions })}</span>
                  <span>•</span>
                  <span className="text-indigo-600 font-semibold shrink-0">
                    {t('listening.answeredProgress', { answered: exam.answeredCount, total: currentTest.totalQuestions })}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Mode Switcher (compact) */}
            <div className="flex lg:hidden items-center space-x-1 shrink-0">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold shrink-0">
                <button
                  onClick={() => setExamMode('practice')}
                  className={"px-2 py-1 rounded-md transition-all cursor-pointer " + (examMode === 'practice' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900')}
                >
                  {t('listening.practiceMode', 'Luyện Tập')}
                </button>
                <button
                  onClick={() => setExamMode('strict')}
                  className={"px-2 py-1 rounded-md transition-all cursor-pointer " + (examMode === 'strict' ? 'bg-red-600 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900')}
                >
                  {t('listening.examMode', 'Thi Thử')}
                </button>
              </div>
            </div>
          </div>

          {/* CENTER: Part Quick Switcher Tabs (Desktop & Tablet) */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            {(currentTest.parts || [{ partNumber: 1 }, { partNumber: 2 }, { partNumber: 3 }, { partNumber: 4 }]).map((p) => (
              <button
                key={p.partNumber}
                type="button"
                onClick={() => handleSelectPart(p.partNumber)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePart === p.partNumber
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                Part {p.partNumber}
              </button>
            ))}
          </div>

          {/* RIGHT: Action Controls & Tools Dropdown */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5 shrink-0 max-w-full">

            {/* Kho Đề Nghe Button */}
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors shadow-2xs cursor-pointer shrink-0"
              title={isEn ? "Open full IELTS Listening test library" : "Mở thư viện toàn bộ đề thi IELTS Listening"}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('listening.testLibrary', 'Kho Đề')}</span>
              <span className="hidden sm:inline">({allListeningTests.length})</span>
            </button>

            {/* Đánh dấu Đã thuộc đề nghe hiện tại */}
            <button
              type="button"
              onClick={() => onToggleMastered && onToggleMastered(currentTestId)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold text-xs border transition-colors shadow-2xs cursor-pointer shrink-0 ${
                masteredIds.includes(currentTestId)
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title={
                masteredIds.includes(currentTestId)
                  ? (isEn ? 'Mastered this listening test (Click to unmark)' : 'Đã thuộc đề nghe này (Bấm để bỏ đánh dấu)')
                  : (isEn ? 'Mark this listening test as mastered' : 'Đánh dấu đã thuộc đề nghe này')
              }
            >
              <GraduationCap
                className={`w-3.5 h-3.5 ${
                  masteredIds.includes(currentTestId) ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <span className="hidden sm:inline">{masteredIds.includes(currentTestId) ? t('listening.mastered', 'Đã thuộc') : t('listening.markMastered', 'Thuộc đề')}</span>
            </button>

            {/* Desktop Mode Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold shrink-0">
              <button
                onClick={() => setExamMode('practice')}
                className={"px-2.5 py-1 rounded-md transition-all cursor-pointer " + (examMode === 'practice' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                📗 {t('listening.practiceMode', 'Luyện Tập')}
              </button>
              <button
                onClick={() => setExamMode('strict')}
                className={"px-2.5 py-1 rounded-md transition-all cursor-pointer " + (examMode === 'strict' ? 'bg-red-600 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                🛡️ {t('listening.examMode', 'Thi Thử')}
              </button>
            </div>

            {/* Previous or Current Result Report Button */}
            {bandResult && (
              <button
                onClick={() => setIsResultModalOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                title={isEn ? "Reopen latest test result report" : "Mở lại bảng báo cáo kết quả lần thi gần nhất"}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Band {bandResult.band.toFixed(1)}</span>
              </button>
            )}

            {/* Consolidated Study Tools Dropdown Menu */}
            <div className="relative shrink-0" ref={toolsButtonRef}>
              <button
                type="button"
                onClick={handleToggleToolsMenu}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isToolsMenuOpen 
                    ? 'bg-slate-200 text-slate-900 border-slate-300 ring-2 ring-slate-200' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isEn ? "Open study tools and utilities" : "Mở công cụ và tiện ích bổ trợ"}
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{isEn ? 'Tools' : 'Tiện ích'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsMenuOpen && toolsDropdownCoords && typeof document !== 'undefined' && createPortal(
                <>
                  <div 
                    className="fixed inset-0 z-50 bg-black/5" 
                    onClick={() => setIsToolsMenuOpen(false)} 
                  />
                  <div 
                    style={{
                      position: 'fixed',
                      top: `${toolsDropdownCoords.top}px`,
                      left: `${toolsDropdownCoords.left}px`,
                      width: `${toolsDropdownCoords.width}px`,
                      maxHeight: `${toolsDropdownCoords.maxHeight}px`,
                    }}
                    className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[60] overflow-y-auto animate-in fade-in zoom-in-95 duration-100 space-y-1 text-slate-800"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{isEn ? 'Listening Support Tools' : 'Tiện Ích & Công Cụ Bổ Trợ'}</span>
                      <Sliders className="w-3 h-3 text-slate-400" />
                    </div>

                    {onOpenTheory && (
                      <button
                        type="button"
                        onClick={() => { setIsToolsMenuOpen(false); onOpenTheory(); }}
                        className="w-full px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">{t('listening.theoryHandbook', 'Cẩm Nang Lý Thuyết')}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isEn ? 'Strategies for 4 listening parts' : 'Chiến thuật 4 phần thi Listening'}</div>
                        </div>
                      </button>
                    )}

                    {/* AI Generator Button - Tạm thời ẩn theo yêu cầu */}
                    {SHOW_AI_GENERATOR_BUTTONS && (
                      <button type="button" onClick={() => { setIsToolsMenuOpen(false); setIsGeneratorOpen(true); }} className="w-full px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors">
                        <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 shrink-0"><Sparkles className="w-4 h-4" /></div>
                        <div><div className="font-bold">{t('listening.generateAi', 'Sinh Đề Bằng AI')}</div><div className="text-[10px] text-slate-400 font-normal">{isEn ? 'Generate new audio scripts & questions' : 'Tự tạo đề nghe chuẩn Cambridge'}</div></div>
                      </button>
                    )}

                    {onOpenDrills && (
                      <button
                        type="button"
                        onClick={() => { setIsToolsMenuOpen(false); onOpenDrills(); }}
                        className="w-full px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                          <Puzzle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">{t('listening.microDrills', 'Luyện Phản Xạ Bổ Trợ')}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isEn ? 'Names, numbers, spelling demons' : 'Số liệu, tên riêng & distractor'}</div>
                        </div>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => { setIsToolsMenuOpen(false); setIsTranscriptOpen(true); }}
                      className="w-full px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{t('listening.transcript', 'Lời Thoại (Full Modal)')}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{isEn ? 'View entire audioscript with evidence' : 'Toàn bộ script có kèm dẫn chứng'}</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsToolsMenuOpen(false); setIsSoundcheckOpen(true); }}
                      className="w-full px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{t('listening.soundcheck', 'Kiểm Tra Âm Thanh')}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{isEn ? 'Soundcheck & volume calibration' : 'Căn chỉnh âm lượng tai nghe chuẩn'}</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        setLeftPaneTab('scratchpad');
                        if (!isDesktopOrLandscape) setMobileTab('context');
                      }}
                      className="w-full px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-900 rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{isEn ? 'Listening Scratchpad (CDI)' : 'Bản Nháp Nghe (CDI Scratchpad)'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{isEn ? 'Jot quick notes during listening' : 'Ghi chú số liệu, bẫy distractor'}</div>
                      </div>
                    </button>
                  </div>
                </>,
                document.body
              )}
            </div>

            {/* Workspace Expansion Toggle (Alt + Z) */}
            {toggleSlimHeader && (
              <button
                type="button"
                onClick={toggleSlimHeader}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-colors cursor-pointer shadow-2xs shrink-0 ${
                  isSlimHeader
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title={isSlimHeader ? (isEn ? "Collapse workspace, show navbar (Alt + Z)" : "Thu gọn chế độ mở rộng, hiện lại thanh menu website (Alt + Z)") : (isEn ? "Expand workspace, hide navbar (Alt + Z)" : "Mở rộng tối đa không gian làm bài nghe, ẩn thanh menu trên (Alt + Z)")}
              >
                {isSlimHeader ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">{t('listening.collapseWorkspace', 'Thu gọn')}</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">{t('listening.expandWorkspace', 'Mở rộng')}</span>
                  </>
                )}
              </button>
            )}

            {/* Reset Exam Button */}
            {exam.isSubmitted && (
              <button
                onClick={() => {
                  if (window.confirm(isEn ? 'Do you want to retake this test from the beginning?' : 'Bạn có muốn làm lại đề thi này từ đầu không?')) {
                    exam.resetExam();
                    audioEngine.seek(0);
                    setHasStartedExam(false);
                    setBandResult(null);
                    try {
                      localStorage.removeItem('ielts_listening_last_result_' + currentTestId);
                    } catch (e) {}
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? 'Retake' : 'Làm lại'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1.5 Dynamic Listening Test Tab Bar & Dropdown Switcher (Practice Mode) */}
      {examMode !== 'strict' && (
        <div className="bg-gradient-to-r from-cyan-50/90 via-sky-50/90 to-emerald-50/90 border-b border-cyan-200/80 px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 shrink-0 select-none">
          {/* Left: Dropdown Trigger to open any test as a tab */}
          <div className="relative shrink-0" ref={testDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTestDropdownOpen(prev => !prev)}
              className="px-2.5 py-1 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title={isEn ? "Select listening test to open as tab" : "Chọn đề thi để mở thành tab"}
            >
              <span>☁️ {isEn ? 'Tests' : 'Đề R2 Audio'}</span>
              <span className="text-[10px] bg-cyan-900/60 px-1.5 py-0.2 rounded-full font-semibold">
                {allListeningTests.filter(t => t.audioUrl?.includes('.r2.dev')).length}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isTestDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isTestDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-cyan-200 p-2 min-w-[300px] sm:min-w-[360px] max-h-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 space-y-1.5 text-slate-800">
                <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 pb-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {isEn ? 'Audio Tests Library' : 'Danh Sách Đề Nghe'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleOpenAllTestTabs}
                      className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 px-1.5 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 cursor-pointer"
                      title={isEn ? "Open all R2 tests as tabs" : "Mở tất cả đề R2 thành tab"}
                    >
                      {isEn ? 'Open all' : 'Mở hết'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseOtherTestTabs}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-700 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer"
                      title={isEn ? "Keep only active test" : "Chỉ giữ bài hiện tại"}
                    >
                      {isEn ? 'Only active' : 'Chỉ bài này'}
                    </button>
                  </div>
                </div>

                {/* Quick Search Filter */}
                <div className="relative px-1 shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    placeholder={isEn ? "Filter track (e.g. Track 40, transport)..." : "Lọc bài nghe (ví dụ Track 40, transport)..."}
                    className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-cyan-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-slate-50 text-slate-800"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="py-1 space-y-0.5 overflow-y-auto max-h-[300px]">
                  {allListeningTests
                    .filter((t) => {
                      if (!dropdownSearch.trim()) return true;
                      const q = dropdownSearch.toLowerCase().trim();
                      const info = getListeningTestDisplayInfo(t, isEn);
                      return t.title?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q) || info.trackBadge?.toLowerCase().includes(q) || info.shortTitle?.toLowerCase().includes(q);
                    })
                    .map((t) => {
                      const isSelected = currentTestId === t.id;
                      const isTabOpen = openListeningTabs.includes(t.id);
                      const isR2 = Boolean(t.audioUrl?.includes('.r2.dev'));
                      const { trackBadge, shortTitle, fullTitle } = getListeningTestDisplayInfo(t, isEn);

                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTestFromDropdown(t.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected ? 'bg-cyan-100 text-cyan-950 font-bold' : 'hover:bg-slate-100 text-slate-700 font-medium'
                          }`}
                          title={fullTitle}
                        >
                          <div className="flex items-center gap-1.5 truncate pr-2 min-w-0">
                            <span className="shrink-0">{isR2 ? '☁️' : t.isCustom ? '✨' : '🎧'}</span>
                            {trackBadge && (
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black shrink-0 ${isSelected ? 'bg-cyan-700 text-white' : 'bg-cyan-100 text-cyan-800'}`}>
                                {trackBadge}
                              </span>
                            )}
                            <span className="truncate">{shortTitle}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isTabOpen && <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-bold">{isEn ? 'Tab Open' : 'Đang mở'}</span>}
                            {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Dynamic Closable Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
            {openListeningTabs.map((tabId) => {
              const testItem = allListeningTests.find(t => t.id === tabId);
              if (!testItem) return null;
              const isSelected = currentTestId === testItem.id;
              const { trackBadge, shortTitle, fullTitle } = getListeningTestDisplayInfo(testItem, isEn);

              return (
                <div
                  key={testItem.id}
                  onClick={() => handleSwitchTest(testItem.id)}
                  className={`group px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border select-none ${
                    isSelected ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs ring-1 ring-cyan-400/40 font-bold' : 'bg-white/95 hover:bg-cyan-100/80 text-slate-700 hover:text-cyan-950 border-cyan-200/90 font-medium'
                  }`}
                  title={fullTitle}
                >
                  <span className="shrink-0">{testItem.audioUrl?.includes('.r2.dev') ? '☁️' : '🎧'}</span>
                  {trackBadge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black shrink-0 ${isSelected ? 'bg-cyan-900/80 text-cyan-200 ring-1 ring-cyan-400/30' : 'bg-cyan-100 text-cyan-800'}`}>
                      {trackBadge}
                    </span>
                  )}
                  <span className="max-w-[120px] sm:max-w-[160px] truncate">{shortTitle}</span>
                  <button
                    type="button"
                    onClick={(e) => handleCloseTestTab(testItem.id, e)}
                    className={`p-0.5 rounded-full hover:bg-black/15 transition-colors cursor-pointer shrink-0 ml-0.5 ${isSelected ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-red-500'}`}
                    title={isEn ? "Close tab" : "Đóng tab"}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Responsive Segmented Switcher on Mobile & Portrait Tablets */}
      {!isDesktopOrLandscape && (hasStartedExam || exam.isSubmitted) && (
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-1 p-0.5 bg-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setMobileTab('context')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'context' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              🎧 {mapGroup ? (isEn ? 'Map & Audio' : 'Bản Đồ & Audio') : (isEn ? 'Audio & Context' : 'Bối Cảnh & Audio')}
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('questions')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'questions' ? 'bg-white text-red-600 shadow-2xs' : 'text-slate-600'
              }`}
            >
              📝 {isEn ? 'Questions' : 'Câu Hỏi'}
            </button>
          </div>

          {/* Quick Part Pills on Mobile */}
          <div className="flex items-center space-x-1">
            {(currentTest.parts || [{ partNumber: 1 }, { partNumber: 2 }, { partNumber: 3 }, { partNumber: 4 }]).map((p) => (
              <button
                key={p.partNumber}
                type="button"
                onClick={() => handleSelectPart(p.partNumber)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activePart === p.partNumber ? 'bg-red-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {p.partNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3 & 4. Crash Recovery, Soft-Quarantine Audio Error & 30s Prep Countdown Banners */}
      <ListeningStatusBanners
        resumePrompt={resumePrompt}
        hasStartedExam={hasStartedExam}
        handleResumeExam={handleResumeExam}
        handleDiscardResume={handleDiscardResume}
        audioEngine={audioEngine}
        currentTest={currentTest}
        setIsTranscriptOpen={setIsTranscriptOpen}
        setIsLibraryOpen={setIsLibraryOpen}
        isPrepActive={isPrepActive}
        setIsPrepActive={setIsPrepActive}
        activePart={activePart}
        prepTimeRemaining={prepTimeRemaining}
        isEn={isEn}
      />

      {/* 5. Main Content Area */}
      {!hasStartedExam && !exam.isSubmitted ? (
        <ListeningWelcomeGate
          currentTest={currentTest}
          isEn={isEn}
          setIsSoundcheckOpen={setIsSoundcheckOpen}
          handleStartExam={handleStartExam}
        />
      ) : (
          /* Two-Column Split Screen Interactive Workspace */
          <div 
            ref={containerRef}
            className={`flex-1 flex overflow-hidden relative ${isDragging ? 'select-none cursor-col-resize' : ''}`}
          >
            {/* LEFT COLUMN: Audio Player & Overview / Map / Scratchpad / Transcript */}
            <div
              style={{ width: isDesktopOrLandscape ? `${splitWidth}%` : '100%' }}
              className={`h-full border-r border-slate-200 bg-slate-50/50 flex flex-col overflow-hidden shrink-0 ${
                !isDesktopOrLandscape && mobileTab !== 'context' ? 'hidden' : 'flex'
              }`}
            >
              {/* Compact Audio Player Bar at top of Left Column */}
              <AudioPlayerBar 
                audioEngine={audioEngine}
                examMode={examMode}
                activePart={activePart}
                onSelectPart={handleSelectPart}
                parts={currentTest.parts || []}
                inSplitPane={true}
              />

              {/* Left Column Tabs Header */}
              <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between shrink-0 shadow-2xs">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setLeftPaneTab('overview')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      leftPaneTab === 'overview'
                        ? 'bg-red-50 text-red-700 border border-red-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{mapGroup ? (isEn ? 'Map & Context' : 'Bản Đồ & Bối Cảnh') : (isEn ? 'Overview' : 'Bối Cảnh')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeftPaneTab('scratchpad')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      leftPaneTab === 'scratchpad'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Scratchpad' : 'Bản Nháp'}</span>
                    {scratchpadText.trim() && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeftPaneTab('transcript')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      leftPaneTab === 'transcript'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Transcript' : 'Lời Thoại'}</span>
                    {examMode === 'strict' && !exam.isSubmitted && <Lock className="w-3 h-3 text-slate-400 ml-0.5" />}
                  </button>
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-500 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px] uppercase text-slate-700">Part {activePart}/4</span>
                </div>
              </div>

              {/* Left Column Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {leftPaneTab === 'overview' && (
                  <div className="space-y-4 text-left">
                    {/* Part Overview Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                          Part {currentPartData.partNumber} / 4
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {isEn ? 'Audio' : 'Khung phát'}: {Math.floor((currentPartData.audioTimestampStart || 0) / 60)}:{String((currentPartData.audioTimestampStart || 0) % 60).padStart(2, '0')} – {Math.floor((currentPartData.audioTimestampEnd || 0) / 60)}:{String((currentPartData.audioTimestampEnd || 0) % 60).padStart(2, '0')}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
                          {currentPartData.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {currentPartData.context}
                        </p>
                      </div>

                      {/* Speakers */}
                      {currentPartData.speakers && currentPartData.speakers.length > 0 && (
                        <div className="pt-2.5 border-t border-slate-100">
                          <span className="text-slate-400 font-medium text-xs mr-2">{isEn ? 'Speakers:' : 'Nhân vật:'}</span>
                          <div className="inline-flex flex-wrap gap-1.5 mt-1">
                            {currentPartData.speakers.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {s.name} ({s.accent} {s.gender})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Map / Diagram Labelling (PINNED DIRECTLY ON LEFT) */}
                    {mapGroup && (
                      <div className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs sm:text-sm">
                            <MapPin className="w-4 h-4 text-indigo-600" />
                            <span>{isEn ? 'Map / Diagram Reference' : 'Bản Đồ / Sơ Đồ Tham Chiếu'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => setMapZoom(prev => Math.max(0.7, prev - 0.15))}
                              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer"
                              title={isEn ? "Zoom Out" : "Thu nhỏ"}
                            >
                              <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono font-bold px-1 text-slate-600">{Math.round(mapZoom * 100)}%</span>
                            <button
                              type="button"
                              onClick={() => setMapZoom(prev => Math.min(2.5, prev + 0.15))}
                              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer"
                              title={isEn ? "Zoom In" : "Phóng to"}
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsMapModalOpen(true)}
                              className="px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer flex items-center space-x-1 shadow-2xs"
                              title={isEn ? "Enlarge map" : "Mở toàn màn hình"}
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span className="hidden sm:inline">{isEn ? 'Full' : 'Toàn cảnh'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="overflow-auto max-h-[460px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                          <img
                            src={mapGroup.mapImageUrl}
                            alt="IELTS Listening Map"
                            style={{ transform: `scale(${mapZoom})`, transformOrigin: 'top center' }}
                            className="transition-transform duration-150 max-w-full rounded-lg shadow-xs"
                          />
                        </div>

                        <p className="text-[11px] text-slate-500 italic">
                          {isEn 
                            ? '💡 Observe letters (A-H) and landmarks on the map on the left while answering corresponding questions on the right.'
                            : '💡 Quan sát các ký tự (A-H) và mốc địa điểm trên bản đồ bên trái và chọn đáp án tương ứng bên phải.'}
                        </p>
                      </div>
                    )}

                    {/* Quick Listening Strategies & Signposting Tips */}
                    <ListeningPartTipsCard activePart={activePart} isEn={isEn} />
                  </div>
                )}

                {leftPaneTab === 'scratchpad' && (
                  <ListeningScratchpadPane
                    scratchpadText={scratchpadText}
                    handleScratchpadChange={handleScratchpadChange}
                    isEn={isEn}
                  />
                )}

                {leftPaneTab === 'transcript' && (
                  <ListeningInlineTranscriptPane
                    examMode={examMode}
                    isSubmitted={exam.isSubmitted}
                    setExamMode={setExamMode}
                    transcriptSearch={transcriptSearch}
                    setTranscriptSearch={setTranscriptSearch}
                    setIsTranscriptOpen={setIsTranscriptOpen}
                    currentPartData={currentPartData}
                    audioEngine={audioEngine}
                    isEn={isEn}
                  />
                )}
              </div>
            </div>

            {/* Resizable Splitter Bar (Desktop Only) */}
            <div
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onDoubleClick={() => setSplitWidth(48)}
              className="hidden lg:flex w-2 bg-slate-100 hover:bg-red-400 active:bg-red-600 cursor-col-resize items-center justify-center transition-colors group z-10 shrink-0"
              title={isEn ? "Drag to adjust split ratio (Double-click to reset 48/52)" : "Kéo thả để điều chỉnh tỷ lệ chia đôi màn hình (Nhấp đúp để đặt lại 48/52)"}
            >
              <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full" />
            </div>

            {/* RIGHT COLUMN: Questions Pane */}
            <div
              style={{ width: isDesktopOrLandscape ? `${100 - splitWidth}%` : '100%' }}
              className={`h-full bg-white flex flex-col overflow-hidden ${
                !isDesktopOrLandscape && mobileTab !== 'questions' ? 'hidden' : 'flex'
              }`}
            >
              {/* Sticky mini audio bar on mobile when viewing questions */}
              {!isDesktopOrLandscape && (
                <div className="bg-slate-950 text-white px-3 py-1.5 flex items-center justify-between border-b border-slate-800 shrink-0 select-none">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={audioEngine.togglePlay}
                      className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white"
                    >
                      {audioEngine.isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
                    </button>
                    <span className="font-mono text-xs text-emerald-400">
                      {Math.floor(audioEngine.currentTime / 60)}:{String(Math.floor(audioEngine.currentTime % 60)).padStart(2, '0')} / {Math.floor(audioEngine.duration / 60)}:{String(Math.floor(audioEngine.duration % 60)).padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileTab('context')}
                    className="text-xs text-slate-300 underline font-semibold"
                  >
                    {mapGroup ? (isEn ? 'View Map' : 'Xem Bản Đồ') : (isEn ? 'View Context' : 'Xem Bối Cảnh')}
                  </button>
                </div>
              )}

              {/* Scrollable Questions Area */}
              <div className="flex-1 overflow-y-auto">
                {exam.isSubmitted && (
                  <div className="w-full px-4 sm:px-6 pt-3 pb-0">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-emerald-950">
                          {isEn 
                            ? `You are reviewing test results ${bandResult ? `• Band ${bandResult.band.toFixed(1)} (${bandResult.correctCount}/${bandResult.totalQuestions} correct)` : ''}`
                            : `Bạn đang xem lại bài chấm ${bandResult ? `• Band ${bandResult.band.toFixed(1)} (${bandResult.correctCount}/${bandResult.totalQuestions} câu đúng)` : ''}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => setIsResultModalOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          {isEn ? 'Score Report' : 'Bảng Điểm Chi Tiết'}
                        </button>
                        <button
                          onClick={() => {
                            exam.resetExam();
                            audioEngine.seek(0);
                            setBandResult(null);
                            try {
                              localStorage.removeItem('ielts_listening_last_result_' + currentTestId);
                            } catch (e) {}
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Retake Test' : 'Làm Lại Đề Này'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <ListeningQuestionPane 
                  testId={currentTestId}
                  partData={currentPartData}
                  userAnswers={exam.userAnswers}
                  onAnswerChange={exam.setAnswer}
                  flaggedQuestions={exam.flaggedQuestions}
                  onToggleFlag={exam.toggleFlag}
                  activeQuestionOrder={exam.activeQuestionOrder}
                  onSelectQuestion={exam.setActiveQuestionOrder}
                  isSubmitted={exam.isSubmitted}
                  fontSizeMode={fontSizeMode}
                  contrastTheme={contrastTheme}
                  onSeekAudio={(timestamp) => {
                    audioEngine.seek(timestamp);
                    audioEngine.play();
                  }}
                  hidePartHeader={true}
                />
              </div>
            </div>
          </div>
        )}

      {/* Fullscreen Map Modal */}
      <ListeningFullscreenMapModal
        isOpen={isMapModalOpen}
        mapGroup={mapGroup}
        onClose={() => setIsMapModalOpen(false)}
        isEn={isEn}
      />

      {/* 6. CD-IELTS Bottom Palette Bar */}
      {(hasStartedExam || exam.isSubmitted) && (
        <ListeningPaletteBar 
          totalQuestions={currentTest.totalQuestions || 40}
          activePart={activePart}
          partsData={currentTest.parts}
          availableParts={currentTest.parts?.map(p => p.partNumber) || [1]}
          onSelectPart={(pNum) => {
            handleSelectPart(pNum);
            const targetPart = currentTest.parts?.find(p => p.partNumber === pNum);
            if (targetPart) {
              const qs = (targetPart.questionGroups || []).flatMap(g => g.questions || []);
              const firstQ = qs.map(q => q.order ?? q.number ?? q.questionNumber).filter(n => typeof n === 'number')[0];
              if (firstQ) {
                exam.setActiveQuestionOrder(firstQ);
                return;
              }
            }
            const startQ = (pNum - 1) * 10 + 1;
            exam.setActiveQuestionOrder(startQ);
          }}
          activeQuestionOrder={exam.activeQuestionOrder}
          onSelectQuestion={(order) => {
            exam.setActiveQuestionOrder(order);
            if (currentTest.parts && currentTest.parts.length > 1) {
              const targetPart = currentTest.parts.find(p => {
                const qs = (p.questionGroups || []).flatMap(g => g.questions || []);
                return qs.some(q => (q.order ?? q.number ?? q.questionNumber) === order);
              });
              if (targetPart && targetPart.partNumber !== activePart) {
                handleSelectPart(targetPart.partNumber);
              }
            }
          }}
          userAnswers={exam.userAnswers}
          flaggedQuestions={exam.flaggedQuestions}
          onToggleFlag={exam.toggleFlag}
          onSubmitExam={() => setIsConfirmSubmitOpen(true)}
          isSubmitted={exam.isSubmitted}
        />
      )}

      {/* 7. Enhanced CD-IELTS Soundcheck Modal */}
      {isSoundcheckOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto my-auto">
            <ListeningSoundcheckModalContent
              isSoundchecking={isSoundchecking}
              soundcheckVolume={soundcheckVolume}
              handlePlaySoundcheck={handlePlaySoundcheck}
              handleStopSoundcheck={handleStopSoundcheck}
              handleSoundcheckVolumeChange={handleSoundcheckVolumeChange}
              setIsSoundcheckOpen={setIsSoundcheckOpen}
              isEn={isEn}
            />
          </div>
        </div>
      )}

      {/* 8. Confirm Submit Modal ({currentTest.totalQuestions} câu) */}
      <ListeningConfirmSubmitModal
        isOpen={isConfirmSubmitOpen}
        onClose={() => setIsConfirmSubmitOpen(false)}
        onConfirm={handleConfirmSubmit}
        answeredCount={exam.answeredCount}
        totalQuestions={currentTest.totalQuestions}
        isEn={isEn}
      />

      {/* 9. Comprehensive Cambridge Test Report Modal */}
      {isResultModalOpen && (
        <ListeningResultModal
          isOpen={isResultModalOpen}
          onClose={() => {
            setIsResultModalOpen(false);
            if (!allListeningTests.some(t => t.id === currentTestId)) {
              const fallbackId = allListeningTests[0]?.id || INITIAL_LISTENING_TESTS[0].id;
              setCurrentTestId(fallbackId);
              setActivePart(1);
            }
          }}
          bandResult={bandResult}
          testTitle={currentTest?.title || bandResult?.testTitle}
          apiKey={apiKey}
          model={model}
          onResetExam={() => {
            exam.resetExam();
            audioEngine.seek(0);
            setHasStartedExam(false);
            setBandResult(null);
            try {
              localStorage.removeItem('ielts_listening_last_result_' + currentTestId);
            } catch (e) {}
          }}
          onJumpToQuestion={(order) => {
            exam.setActiveQuestionOrder(order);
            if (currentTest.parts && currentTest.parts.length > 1) {
              const targetPart = currentTest.parts.find(p => {
                const qs = (p.questionGroups || []).flatMap(g => g.questions || []);
                return qs.some(q => (q.order ?? q.number) === order);
              });
              if (targetPart && targetPart.partNumber !== activePart) {
                handleSelectPart(targetPart.partNumber);
              }
            }
          }}
          onSeekAudio={(timestamp) => {
            audioEngine.seek(timestamp);
            audioEngine.play();
          }}
          onOpenDrills={onOpenDrills}
        />
      )}

      {/* 10. Karaoke Interactive Transcript Modal */}
      {isTranscriptOpen && (
        <ListeningTranscriptModal
          isOpen={isTranscriptOpen}
          onClose={() => setIsTranscriptOpen(false)}
          currentTest={currentTest}
          audioEngine={audioEngine}
          activePart={activePart}
          onSelectPart={setActivePart}
          onSaveToVocabNotebook={onSaveToVocabNotebook}
        />
      )}

      {/* 11. Listening Library Modal (Browse Cambridge & AI generated tests) */}
      {isLibraryOpen && (
        <ListeningLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          allListeningTests={allListeningTests}
          currentTestId={currentTestId}
          onSelectTest={(selected) => {
            const testObj = typeof selected === 'object' ? selected : allListeningTests.find(t => t.id === selected);
            if (!testObj) return;
            setCurrentTestId(testObj.id);
            setIsLibraryOpen(false);
            const startPart = testObj.targetPart || testObj.parts?.[0]?.partNumber || 1;
            setActivePart(startPart);
            setHasStartedExam(true);
            exam.resetExam();
            setBandResult(null);
            if (testObj.audioUrl) {
              audioEngine.loadAudio(testObj.audioUrl);
            }
          }}
          onDeleteTest={handleDeleteCustomTest}
          onAddCustomTest={handleAddCustomTest}
          onTogglePublic={handleToggleListeningPublic}
          onOpenGenerator={() => {
            setIsLibraryOpen(false);
            setIsGeneratorOpen(true);
          }}
          user={user}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
        />
      )}

      {/* 12. Listening AI Test Generator from Audio URL Modal */}
      {isGeneratorOpen && (
        <ListeningURLExerciseGeneratorModal
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          apiKey={apiKey}
          model={model}
          user={user}
          onTestGenerated={handleAddCustomTest}
          onOpenSettings={onOpenSettings}
        />
      )}

    </div>
  );
}
