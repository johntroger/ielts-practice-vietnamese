import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertTriangle, Radio, Volume2, Square, Play, RotateCcw, ArrowRight, 
  Clock, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, 
  HelpCircle, ChevronRight, MessageSquare, X, Pause, LogOut
} from 'lucide-react';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';
import SpeakingDigitalNotepad from './SpeakingDigitalNotepad';
import { speakingSoundEffects } from '../../utils/speakingSoundEffects';

/**
 * SpeakingExaminerRoom.jsx
 * The Core Stage for Step 4 (AI Mock Test Room).
 * Features:
 * 1. 100dvh Zero Viewport Overflow Theater Mode.
 * 2. 4 Exam Phases:
 *    - Phase 0: Greeting & Candidate Identity Verification (Administrative, non-scored)
 *    - Phase 1: Part 1 Interview (3-4 questions)
 *    - Phase 2: Part 2 Cue Card (60s Prep with 4-Quadrant Notepad -> 2-min Speaking with Auto-Docked notes)
 *    - Phase 3: Part 3 Discussion & Follow-ups (Abstract societal analysis)
 * 3. Dynamic Presence Aura: Glow breathes when examiner speaks, shifts to candidate when speaking.
 * 4. Hands-Free Controls: [ Space ] Push-to-Talk, [ Enter ] Next, [ P ] Repeat question.
 * 5. SessionStorage transcript auto-save resilience.
 */
export default function SpeakingExaminerRoom({
  examiner,
  mockPack,
  part1Topic,
  part2Card,
  part3Set,
  speechEngine,
  onFinishExam,
  onExitRoom
}) {
  // 1. Stage Phase State
  // 'greeting' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'finishing'
  const [currentStage, setCurrentStage] = useState('greeting');
  
  // Question Navigation Indexes
  const [p1Index, setP1Index] = useState(0);
  const [p3Index, setP3Index] = useState(0);

  // Digital Notepad State for Part 2
  const [part2Notes, setPart2Notes] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [isNotepadDocked, setIsNotepadDocked] = useState(false);

  // Timers: Part 2 Prep (60s), Part 2 Speak (120s), Total Session Duration
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(60);
  const [part2SpeakSeconds, setPart2SpeakSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Transcript Record: Accumulated dialogue between Examiner & Candidate
  // [ { speaker: 'examiner'|'candidate', stage: 'greeting'|'part1'|..., text: string, time: string } ]
  const [dialogueHistory, setDialogueHistory] = useState(() => {
    const saved = sessionStorage.getItem('ielts_speaking_session_transcript');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Current prompt displayed in center stage
  // Local Mic Active state synchronized with speechEngine for instant, glitch-free UI response
  const [isMicActive, setIsMicActive] = useState(speechEngine.isListening);
  useEffect(() => {
    setIsMicActive(speechEngine.isListening);
  }, [speechEngine.isListening]);

  const handleToggleMic = useCallback(async () => {
    if (isMicActive || speechEngine.isListening) {
      setIsMicActive(false);
      speechEngine.stopListening();
    } else {
      setIsMicActive(true);
      setIsAwaitingCandidateMic(false);
      try {
        const clipToStart = nextClipIdRef.current || ('turn_' + Date.now());
        await speechEngine.startListening(clipToStart);
      } catch (err) {
        console.warn('Mic toggle error:', err);
        setIsMicActive(false);
      }
    }
  }, [isMicActive, speechEngine]);

    // Intermission State: Examiner has finished asking -> Prompt candidate to open mic
  const [isAwaitingCandidateMic, setIsAwaitingCandidateMic] = useState(false);
  const nextClipIdRef = useRef('p1_q0');

  const triggerCandidateTurn = useCallback((clipId) => {
    nextClipIdRef.current = clipId;
    setIsAwaitingCandidateMic(true);
    speakingSoundEffects.playReadyToSpeakChime();
  }, []);

  const [activePromptText, setActivePromptText] = useState('');
  const [candidateResponseBuffer, setCandidateResponseBuffer] = useState('');
  const [hasInterruptedCandidate, setHasInterruptedCandidate] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  // Autosave to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('ielts_speaking_session_transcript', JSON.stringify(dialogueHistory));
  }, [dialogueHistory]);

  // Overall session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // GREETING STAGE INITIALIZATION
  // =========================================================================
  const hasSpokenGreetingRef = useRef(false);

  useEffect(() => {
    if (currentStage === 'greeting' && !hasSpokenGreetingRef.current) {
      hasSpokenGreetingRef.current = true;
      const greetingPrompt = `Good afternoon. My name is ${examiner.name}. Could you please state your full name and show me your identification?`;
      setActivePromptText(greetingPrompt);
      
      const timer = setTimeout(() => {
        speechEngine.speak(greetingPrompt, { examinerId: examiner.id }, () => {
          setDialogueHistory(prev => [
            ...prev,
            { speaker: 'examiner', stage: 'greeting', text: greetingPrompt, timestamp: new Date().toISOString() }
          ]);
          triggerCandidateTurn('greeting_candidate');
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentStage, examiner, speechEngine]);

  // =========================================================================
  // PART 2 PREPARATION (60s) COUNTDOWN
  // =========================================================================
  useEffect(() => {
    let prepTimer = null;
    if (currentStage === 'part2_prep') {
      setIsNotepadDocked(false);
      prepTimer = setInterval(() => {
        setPrepSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(prepTimer);
            // End 60s prep: play pleasant double chime
            speakingSoundEffects.playPrepTimeEndChime();
            // Automatically switch to speaking phase & auto-dock notepad
            handleStartPart2Speaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (prepTimer) clearInterval(prepTimer);
    };
  }, [currentStage]);

  // =========================================================================
  // PART 2 SPEAKING (120s) TIMER & POLITE INTERRUPTION
  // =========================================================================
  useEffect(() => {
    let speakTimer = null;
    if (currentStage === 'part2_speak') {
      speakTimer = setInterval(() => {
        setPart2SpeakSeconds(prev => {
          const next = prev + 1;
          // When candidate speaks past 120s (2 minutes), examiner politely intervenes
          if (next >= 120 && !hasInterruptedCandidate) {
            setHasInterruptedCandidate(true);
            const politeInterruption = 'Thank you very much. You may stop speaking now. We will now proceed to Part 3.';
            speechEngine.stopListening();
            speechEngine.speak(politeInterruption, { examinerId: examiner.id }, () => {
              handleMoveToPart3();
            });
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (speakTimer) clearInterval(speakTimer);
    };
  }, [currentStage, hasInterruptedCandidate, examiner, speechEngine]);

  // =========================================================================
  // NAVIGATION & STAGE PROGRESSION
  // =========================================================================

  // Move from Greeting -> Part 1
  const handleProceedToPart1 = () => {
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine.isListening) speechEngine.stopListening();

    setCurrentStage('part1');
    setP1Index(0);
    const firstQ = part1Topic.questions[0]?.question || 'Can you tell me about your hometown?';
    const transitionPrompt = `Thank you. Now, in this first part, I would like to ask you some questions about yourself. Let's talk about ${part1Topic.title}. ${firstQ}`;
    setActivePromptText(firstQ);

    setTimeout(() => {
      speechEngine.speak(transitionPrompt, { examinerId: examiner.id }, () => {
        setDialogueHistory(prev => [
          ...prev,
          { speaker: 'examiner', stage: 'part1', text: firstQ, timestamp: new Date().toISOString() }
        ]);
        speechEngine.resetTranscript();
        triggerCandidateTurn('p1_q0');
      });
    }, 400);
  };

  // Next Question in Part 1
  const handleNextPart1Question = () => {
    // Commit current candidate answer to transcript history
    const currentAnswer = speechEngine.transcript || speechEngine.interimTranscript || '(Candidate answered orally)';
    setDialogueHistory(prev => [
      ...prev,
      { 
        speaker: 'candidate', 
        stage: 'part1', 
        questionText: part1Topic.questions[p1Index]?.question,
        text: currentAnswer, 
        timestamp: new Date().toISOString() 
      }
    ]);
    speechEngine.stopListening();
    speechEngine.resetTranscript();

    const nextIndex = p1Index + 1;
    if (nextIndex < part1Topic.questions.length) {
      setP1Index(nextIndex);
      const nextQ = part1Topic.questions[nextIndex].question;
      setActivePromptText(nextQ);
      speechEngine.speak(nextQ, { examinerId: examiner.id }, () => {
        setDialogueHistory(prev => [
          ...prev,
          { speaker: 'examiner', stage: 'part1', text: nextQ, timestamp: new Date().toISOString() }
        ]);
        speechEngine.resetTranscript();
        triggerCandidateTurn(`p1_q${nextIndex}`);
      });
    } else {
      // Transition to Part 2
      handleMoveToPart2Prep();
    }
  };

  // Move to Part 2 Prep (60s)
  const handleMoveToPart2Prep = () => {
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine.isListening) speechEngine.stopListening();

    setCurrentStage('part2_prep');
    setPrepSecondsLeft(60);
    setIsNotepadDocked(false);

    const cueCardIntro = `Now, I'm going to give you a topic and I'd like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. You can make some notes if you wish. Here is your topic.`;
    setActivePromptText(cueCardIntro);

    speechEngine.speak(cueCardIntro, { examinerId: examiner.id }, () => {
      setDialogueHistory(prev => [
        ...prev,
        { speaker: 'examiner', stage: 'part2_prep', text: cueCardIntro, timestamp: new Date().toISOString() }
      ]);
    });
  };

  // Start Part 2 Speaking (User can also click skip prep)
  const handleStartPart2Speaking = () => {
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    setCurrentStage('part2_speak');
    setIsNotepadDocked(true); // Auto-dock notepad to bottom-right
    setPart2SpeakSeconds(0);

    const startPrompt = `All right? Remember, you have one to two minutes for this, so don't worry if I stop you. I'll tell you when the time is up. Can you begin speaking now, please?`;
    setActivePromptText(startPrompt);

    speechEngine.speak(startPrompt, { examinerId: examiner.id }, () => {
      setDialogueHistory(prev => [
        ...prev,
        { speaker: 'examiner', stage: 'part2_speak', text: startPrompt, timestamp: new Date().toISOString() }
      ]);
      speechEngine.resetTranscript();
      triggerCandidateTurn('p2_monologue');
    });
  };

  // Move from Part 2 -> Part 3
  const handleMoveToPart3 = () => {
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine.isListening) speechEngine.stopListening();

    // Commit Part 2 Candidate speech
    const currentP2Speech = speechEngine.transcript || speechEngine.interimTranscript || '(Candidate delivered 2-minute speech)';
    setDialogueHistory(prev => [
      ...prev,
      { 
        speaker: 'candidate', 
        stage: 'part2_speak', 
        cueCardTitle: part2Card.title,
        notes: part2Notes,
        text: currentP2Speech, 
        durationSec: part2SpeakSeconds,
        timestamp: new Date().toISOString() 
      }
    ]);

    setCurrentStage('part3');
    setP3Index(0);

    const firstP3Q = part3Set.questions[0]?.question || 'How has technology influenced communication?';
    const p3Intro = `We've been talking about ${part2Card.title}, and I'd like to discuss with you one or two more general questions related to this. Let's consider ${part3Set.topic}. ${firstP3Q}`;
    setActivePromptText(firstP3Q);

    setTimeout(() => {
      speechEngine.speak(p3Intro, { examinerId: examiner.id }, () => {
        setDialogueHistory(prev => [
          ...prev,
          { speaker: 'examiner', stage: 'part3', text: firstP3Q, timestamp: new Date().toISOString() }
        ]);
        speechEngine.resetTranscript();
        triggerCandidateTurn('p3_q0');
      });
    }, 400);
  };

  // Next Question in Part 3
  const handleNextPart3Question = () => {
    const currentAnswer = speechEngine.transcript || speechEngine.interimTranscript || '(Candidate answered)';
    setDialogueHistory(prev => [
      ...prev,
      { 
        speaker: 'candidate', 
        stage: 'part3', 
        questionText: part3Set.questions[p3Index]?.question,
        text: currentAnswer, 
        timestamp: new Date().toISOString() 
      }
    ]);
    speechEngine.stopListening();
    speechEngine.resetTranscript();

    const nextIndex = p3Index + 1;
    if (nextIndex < part3Set.questions.length) {
      setP3Index(nextIndex);
      const nextQ = part3Set.questions[nextIndex].question;
      setActivePromptText(nextQ);
      speechEngine.speak(nextQ, { examinerId: examiner.id }, () => {
        setDialogueHistory(prev => [
          ...prev,
          { speaker: 'examiner', stage: 'part3', text: nextQ, timestamp: new Date().toISOString() }
        ]);
        speechEngine.resetTranscript();
        triggerCandidateTurn(`p3_q${nextIndex}`);
      });
    } else {
      // Conclude Entire Exam
      handleConcludeExam();
    }
  };

  // Conclude Exam & Move to Step 5 (Diagnostic Assessment)
  const handleConcludeExam = () => {
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine.isListening) speechEngine.stopListening();

    setCurrentStage('finishing');
    const farewellPrompt = 'Thank you very much. That is the end of the speaking test. Your answers have been recorded for Cambridge Assessment.';
    setActivePromptText(farewellPrompt);

    speakingSoundEffects.playCompletionChime();

    speechEngine.speak(farewellPrompt, { examinerId: examiner.id }, () => {
      const finalTranscript = [
        ...dialogueHistory,
        { speaker: 'examiner', stage: 'conclusion', text: farewellPrompt, timestamp: new Date().toISOString() }
      ];
      setDialogueHistory(finalTranscript);
      setIsExamCompleted(true);
      if (onFinishExam) {
        onFinishExam(finalTranscript, {
          mockPack,
          examiner,
          totalDurationSec: totalSeconds
        });
      }
    });
  };

  // =========================================================================
  // HANDS-FREE KEYBOARD SHORTCUTS
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts if user is typing notes inside textarea
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
        return;
      }

      // [ Spacebar ]: Toggle Mic
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleMic();
      }

      // [ P ]: Could you please repeat that?
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        speechEngine.repeatLastQuestion();
      }

      // [ Enter ]: Submit / Next Question
      if (e.code === 'Enter') {
        e.preventDefault();
        if (currentStage === 'greeting') {
          handleProceedToPart1();
        } else if (currentStage === 'part1') {
          handleNextPart1Question();
        } else if (currentStage === 'part2_prep') {
          handleStartPart2Speaking();
        } else if (currentStage === 'part2_speak') {
          handleMoveToPart3();
        } else if (currentStage === 'part3') {
          handleNextPart3Question();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStage, p1Index, p3Index, speechEngine, handleToggleMic]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* 1. TOP STATUS BAR (Exam Stage, Timer, Controls) */}
      <div className="h-14 px-2.5 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 backdrop-blur-md gap-2">
        
        {/* Left: Exam Mode & Stage Indicator */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-rose-400 shrink-0">
              <span className="hidden sm:inline">Phòng Thi </span>Live
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800 shrink-0" />
          <span className="text-xs font-bold text-slate-300 truncate max-w-[130px] sm:max-w-none">
            {currentStage === 'greeting' && 'Thủ tục: Chào hỏi & ID'}
            {currentStage === 'part1' && `Part 1 (${p1Index + 1}/${part1Topic.questions.length})`}
            {currentStage === 'part2_prep' && 'Part 2: Nháp (60s)'}
            {currentStage === 'part2_speak' && 'Part 2: Nói (2 phút)'}
            {currentStage === 'part3' && `Part 3 (${p3Index + 1}/${part3Set.questions.length})`}
            {currentStage === 'finishing' && 'Hoàn thành'}
          </span>
        </div>

        {/* Center: Stage Duration Clock */}
        <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
          <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span><span className="hidden sm:inline">Thời gian: </span>{formatTime(totalSeconds)}</span>
        </div>

        {/* Right: Exit / Conclude */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={() => {
              if (window.confirm('Bạn có muốn kết thúc bài thi ngay bây giờ để chuyển sang phần chấm điểm không?')) {
                handleConcludeExam();
              }
            }}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-colors cursor-pointer"
            title="Nộp bài và chấm điểm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            <span className="hidden sm:inline">Nộp bài & Chấm điểm</span>
          </button>

          <button
            onClick={onExitRoom}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer shrink-0"
            title="Thoát phòng thi"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Rời phòng</span>
          </button>
        </div>
      </div>

      {/* 2. THE 3D VIRTUAL STAGE (100dvh Zero Viewport Overflow) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        
        {/* Dynamic Presence Aura: Glow breathes behind Examiner Avatar */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Breathing Aura Rings */}
          <div className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            speechEngine.isSpeaking
              ? 'bg-purple-600/35 scale-110 animate-pulse'
              : speechEngine.isListening
              ? 'bg-emerald-600/25 scale-100'
              : 'bg-indigo-600/15 scale-90'
          }`} />

          {/* Examiner Avatar */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-slate-900 to-purple-950 border-2 border-purple-500/50 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl">
            {examiner.avatar}
            {speechEngine.isSpeaking && (
              <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider animate-bounce shadow-md">
                Đang nói
              </span>
            )}
          </div>

          <div className="mt-3 text-center z-10">
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">{examiner.name}</h3>
            <p className="text-[11px] text-purple-300 font-semibold">{examiner.role} • {examiner.accent}</p>
          </div>
        </div>

        {/* Main Examiner Question / Cue Card Stage */}
        <div className="w-full max-w-2xl mt-5 z-10">
          
          {/* PART 2 CUE CARD SPECIAL DISPLAY */}
          {(currentStage === 'part2_prep' || currentStage === 'part2_speak') ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  IELTS Speaking Part 2: Candidate Cue Card
                </span>
                {currentStage === 'part2_prep' ? (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/40 animate-pulse">
                    Thời gian nháp còn: {prepSecondsLeft}s
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                    Đã nói: {part2SpeakSeconds}s / 120s
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                {part2Card.title}
              </h2>

              <p className="text-xs text-slate-300 font-medium">You should say:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-1">
                {part2Card.prompts.map((p, idx) => (
                  <li key={idx} className="leading-relaxed">{p}</li>
                ))}
              </ul>

              {/* In Part 2 Prep: Embed Full Interactive 4-Quadrant Notepad */}
              {currentStage === 'part2_prep' && (
                <div className="pt-2">
                  <SpeakingDigitalNotepad
                    notes={part2Notes}
                    onChangeNotes={setPart2Notes}
                    isDocked={false}
                    isPrepPhase={true}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleStartPart2Speaking}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
                    >
                      <span>Bỏ qua đếm ngược & Bắt đầu nói ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STANDARD QUESTION STAGE (Greeting, Part 1, Part 3) */
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md text-center space-y-3">
              <p className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
                "{activePromptText || 'Preparing prompt...'}"
              </p>

              {/* Examiner Repeat Question Action (Cambridge Protocol) */}
              <div className="flex items-center justify-center space-x-2 pt-1">
                <button
                  onClick={() => speechEngine.repeatLastQuestion()}
                  disabled={speechEngine.isSpeaking}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-bold border border-purple-500/30 flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Nhờ Giám khảo nhắc lại câu hỏi (Phím tắt P)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>"Could you please repeat that?" [ P ]</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Live Candidate Speech Recognition Feedback & Intermission Notice */}
        <div className="w-full max-w-xl mt-3 z-10 space-y-2">
          {/* INTERMISSION CALLOUT: Ready to Answer Notice */}
          {isAwaitingCandidateMic && !isMicActive && !speechEngine.isSpeaking && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                        Giám khảo đã hỏi xong • Đến lượt bạn
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-snug">
                      Nhấn <strong>[ Phím Spacebar ]</strong> hoặc nút Micro đỏ bên dưới để bắt đầu trả lời. Hệ thống sẽ ghi âm & chấm điểm trực tiếp.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleMic}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shrink-0 transition-all cursor-pointer shadow-lg shadow-emerald-900/40 flex items-center space-x-1.5 hover:scale-105"
                >
                  <Mic className="w-4 h-4" />
                  <span>BẬT MIC NGAY</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Automatic Speech-to-Text Transcript Display */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center min-h-16 flex flex-col items-center justify-center shadow-lg backdrop-blur-sm transition-all">
            {speechEngine.transcript || speechEngine.interimTranscript ? (
              <div className="space-y-1 w-full text-left sm:text-center px-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-slate-800/60 mb-1">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Transcript Tự Động (AI Nhận Diện)</span>
                  </span>
                  {isMicActive && (
                    <span className="text-rose-400 font-mono text-[10px] flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>Live REC</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-100 font-medium">{speechEngine.transcript} </span>
                  {speechEngine.interimTranscript && (
                    <span className="text-emerald-400 italic opacity-85">{speechEngine.interimTranscript}</span>
                  )}
                </p>
              </div>
            ) : isMicActive ? (
              <div className="flex flex-col items-center space-y-1">
                <p className="text-xs text-rose-300 flex items-center gap-1.5 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Đang thu âm trực tiếp... Hãy bắt đầu nói câu trả lời của bạn</span>
                </p>
                <span className="text-[10px] text-slate-400 font-medium">
                  Hệ thống tự động chuyển đổi giọng nói thành văn bản (STT) và lưu vào hồ sơ bài thi
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                <span>Nhấn</span>
                <strong className="text-slate-300 font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">[ Phím Spacebar ]</strong>
                <span>hoặc nút Micro bên dưới để bắt đầu nói</span>
              </p>
            )}
          </div>
        </div>

      </div>

      {/* 3. DOCKED NOTEPAD IN PART 2 SPEAKING (Bottom Right Floating) */}
      {currentStage === 'part2_speak' && (
        <SpeakingDigitalNotepad
          notes={part2Notes}
          onChangeNotes={setPart2Notes}
          isDocked={isNotepadDocked}
          onToggleDock={() => setIsNotepadDocked(!isNotepadDocked)}
          isPrepPhase={false}
        />
      )}

      {/* 4. BOTTOM INTERACTION BAR (Microphone, Waveform, Next Question) */}
      <div className="h-24 px-2.5 sm:px-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0 z-30 gap-2">
        
        {/* Left: Waveform Visualizer */}
        <div className="w-16 xs:w-28 sm:w-56 h-12 flex items-center shrink-0">
          <SpeechWaveVisualizer 
            analyserNode={speechEngine.analyserNode}
            mode={isMicActive ? 'candidate_speaking' : speechEngine.isSpeaking ? 'examiner_speaking' : 'idle'}
            className="w-full h-12"
          />
        </div>

        {/* Center: Push-to-Talk Mic Master Button (High Contrast Crimson Red REC vs Dark Slate) */}
        <div className="flex flex-col items-center relative shrink-0">
          {/* Permission warning banner if microphone blocked */}
          {speechEngine.speechError === 'not-allowed' && (
            <div className="absolute -top-12 bg-rose-950/95 text-rose-300 border border-rose-600/80 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 shadow-xl animate-bounce z-40 whitespace-nowrap">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Trình duyệt đang chặn Micro! Bấm biểu tượng 🔒 trên thanh URL để BẬT</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-2xl font-bold active:scale-95 ${
              isMicActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/60 ring-4 ring-rose-500/40 animate-pulse scale-105 border-2 border-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-2 border-slate-700 shadow-slate-950/50'
            }`}
            title="Bật/Tắt Micro"
            aria-label="Bật hoặc tắt micro"
          >
            {isMicActive ? (
              <div className="relative flex items-center justify-center">
                <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-rose-600" />
              </div>
            ) : (
              <MicOff className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
            )}
          </button>
          <div className="flex items-center space-x-1 sm:space-x-1.5 mt-1.5">
            <span className={`w-2 h-2 rounded-full ${isMicActive ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
            <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
              isMicActive ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {isMicActive ? 'ĐANG THU ÂM' : 'MICRO TẮT'}<span className="hidden sm:inline"> [SPACE]</span>
            </span>
          </div>
        </div>

        {/* Right: Next / Submit Step Button */}
        <div className="flex items-center space-x-2">
          {currentStage === 'greeting' && (
            <button
              onClick={handleProceedToPart1}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-purple-900/40"
            >
              <span>Vào Part 1 [Enter]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStage === 'part1' && (
            <button
              onClick={handleNextPart1Question}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-purple-900/40"
            >
              <span>{p1Index + 1 >= part1Topic.questions.length ? 'Chuyển sang Part 2 [Enter]' : 'Câu tiếp theo [Enter]'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStage === 'part2_prep' && (
            <button
              onClick={handleStartPart2Speaking}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg"
            >
              <span>Xong nháp $\rightarrow$ Bắt đầu nói</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStage === 'part2_speak' && (
            <button
              onClick={handleMoveToPart3}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-purple-900/40"
            >
              <span>Xong Part 2 $\rightarrow$ Sang Part 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStage === 'part3' && (
            <button
              onClick={handleNextPart3Question}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg"
            >
              <span>{p3Index + 1 >= part3Set.questions.length ? 'Hoàn Thành Bài Thi [Enter]' : 'Câu tiếp theo [Enter]'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
