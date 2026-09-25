/**
 * useSpeakingExaminer.js
 * Custom hook providing a resilient, testable state machine for the IELTS Speaking Examination stage.
 * Coordinates examiners, question sequences, countdown timers, adaptive dialogue branching,
 * and structured transcript logging.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { analyzeCandidateUtterance } from '../services/speakingAdaptiveService.js';
import { speakingSoundEffects } from '../utils/speakingSoundEffects.js';

export function useSpeakingExaminer({
  examiner = { id: 'rachel', name: 'Rachel Foster' },
  mockPack = {},
  part1Topic = { title: 'General', questions: [] },
  part2Card = { title: 'Describe an experience', cues: [] },
  part3Set = { topic: 'General Discussion', questions: [] },
  speechEngine = null,
  isAdaptiveMode = true,
  onFinishExam = null
} = {}) {
  // 1. Stage State: 'greeting' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'finishing' | 'completed'
  const [currentStage, setCurrentStage] = useState('greeting');

  // Question navigation indexes
  const [p1Index, setP1Index] = useState(0);
  const [p3Index, setP3Index] = useState(0);

  // Follow-up branching flags
  const [isAnsweringFollowUp, setIsAnsweringFollowUp] = useState(false);
  const [activeFollowUpPrompt, setActiveFollowUpPrompt] = useState(null);

  // Digital Notepad State for Part 2
  const [part2Notes, setPart2Notes] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [isNotepadDocked, setIsNotepadDocked] = useState(false);

  // Timers
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(60);
  const [part2SpeakSeconds, setPart2SpeakSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Interruption flag for Part 2
  const [hasInterruptedCandidate, setHasInterruptedCandidate] = useState(false);

  // Dialogue transcript
  const [dialogueHistory, setDialogueHistory] = useState(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const saved = window.sessionStorage.getItem('ielts_speaking_session_transcript');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  // Active prompt displayed on screen
  const [activePromptText, setActivePromptText] = useState('');
  const [isAwaitingCandidateMic, setIsAwaitingCandidateMic] = useState(false);
  const nextClipIdRef = useRef('p1_q0');

  // Sync dialogue to sessionStorage if browser environment
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('ielts_speaking_session_transcript', JSON.stringify(dialogueHistory));
    }
  }, [dialogueHistory]);

  // Overall session timer
  useEffect(() => {
    if (currentStage === 'completed' || currentStage === 'finishing') return;
    const timer = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStage]);

  const triggerCandidateTurn = useCallback((clipId) => {
    nextClipIdRef.current = clipId;
    setIsAwaitingCandidateMic(true);
    if (speakingSoundEffects?.playReadyToSpeakChime) {
      speakingSoundEffects.playReadyToSpeakChime();
    }
  }, []);

  // Safe speak helper
  const speakText = useCallback((text, onComplete) => {
    if (speechEngine?.speak) {
      speechEngine.speak(text, { examinerId: examiner.id }, onComplete);
    } else if (onComplete) {
      setTimeout(onComplete, 100);
    }
  }, [speechEngine, examiner.id]);

  // Helper to append message to history
  const appendDialogue = useCallback((entry) => {
    setDialogueHistory(prev => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        ...entry
      }
    ]);
  }, []);

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // ACTIONS & STATE TRANSITIONS
  // =========================================================================

  // Move from Greeting -> Part 1
  const proceedToPart1 = useCallback(() => {
    if (speechEngine?.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine?.isListening) speechEngine.stopListening();

    setCurrentStage('part1');
    setP1Index(0);
    setIsAnsweringFollowUp(false);

    const questions = part1Topic?.questions || [];
    const firstQ = questions[0]?.question || 'Can you tell me about your hometown?';
    const transitionPrompt = `Thank you. Now, in this first part, I would like to ask you some questions about yourself. Let's talk about ${part1Topic.title || 'your daily life'}. ${firstQ}`;
    setActivePromptText(firstQ);

    setTimeout(() => {
      speakText(transitionPrompt, () => {
        appendDialogue({ speaker: 'examiner', stage: 'part1', text: firstQ });
        if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
        triggerCandidateTurn('p1_q0');
      });
    }, 400);
  }, [speechEngine, part1Topic, speakText, appendDialogue, triggerCandidateTurn]);

  // Next Question in Part 1 (with optional adaptive probe for too brief answers)
  const nextPart1Question = useCallback((explicitAnswer = null) => {
    const currentAnswer = explicitAnswer ?? (speechEngine?.transcript || speechEngine?.interimTranscript || '(Candidate answered orally)');
    const currentQ = part1Topic.questions?.[p1Index]?.question || activePromptText;

    // Log candidate's response
    appendDialogue({
      speaker: 'candidate',
      stage: 'part1',
      questionText: isAnsweringFollowUp ? activeFollowUpPrompt : currentQ,
      text: currentAnswer
    });

    if (speechEngine?.stopListening) speechEngine.stopListening();
    if (speechEngine?.resetTranscript) speechEngine.resetTranscript();

    // Check if adaptive follow-up is warranted
    if (isAdaptiveMode && !isAnsweringFollowUp) {
      const analysis = analyzeCandidateUtterance(currentAnswer, { stage: 'part1', hasFollowedUpOnThisQuestion: false });
      if (analysis.needsFollowUp && analysis.followUpQuestion) {
        setIsAnsweringFollowUp(true);
        setActiveFollowUpPrompt(analysis.followUpQuestion);
        setActivePromptText(analysis.followUpQuestion);

        const promptText = `${analysis.acknowledgment} ${analysis.followUpQuestion}`;
        speakText(promptText, () => {
          appendDialogue({ speaker: 'examiner', stage: 'part1', text: analysis.followUpQuestion, isFollowUp: true });
          if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
          triggerCandidateTurn(`p1_q${p1Index}_followup`);
        });
        return;
      }
    }

    // Reset follow up and move to next question
    setIsAnsweringFollowUp(false);
    setActiveFollowUpPrompt(null);
    const nextIndex = p1Index + 1;
    const questions = part1Topic.questions || [];

    if (nextIndex < questions.length) {
      setP1Index(nextIndex);
      const nextQ = questions[nextIndex].question;
      setActivePromptText(nextQ);
      speakText(nextQ, () => {
        appendDialogue({ speaker: 'examiner', stage: 'part1', text: nextQ });
        if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
        triggerCandidateTurn(`p1_q${nextIndex}`);
      });
    } else {
      moveToPart2Prep();
    }
  }, [speechEngine, part1Topic, p1Index, activePromptText, isAdaptiveMode, isAnsweringFollowUp, activeFollowUpPrompt, appendDialogue, speakText, triggerCandidateTurn]);

  // Move to Part 2 Prep
  const moveToPart2Prep = useCallback(() => {
    if (speechEngine?.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine?.isListening) speechEngine.stopListening();

    setCurrentStage('part2_prep');
    setPrepSecondsLeft(60);
    setIsNotepadDocked(false);

    const cueCardIntro = `Now, I'm going to give you a topic and I'd like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. You can make some notes if you wish. Here is your topic.`;
    setActivePromptText(cueCardIntro);

    speakText(cueCardIntro, () => {
      appendDialogue({ speaker: 'examiner', stage: 'part2_prep', text: cueCardIntro });
    });
  }, [speechEngine, speakText, appendDialogue]);

  // Start Part 2 Speaking (from prep timer completion or candidate manual skip)
  const startPart2Speaking = useCallback(() => {
    if (speechEngine?.isSpeaking) speechEngine.stopSpeaking();
    setCurrentStage('part2_speak');
    setIsNotepadDocked(true);
    setPart2SpeakSeconds(0);

    const startPrompt = `All right? Remember, you have one to two minutes for this, so don't worry if I stop you. I'll tell you when the time is up. Can you begin speaking now, please?`;
    setActivePromptText(startPrompt);

    speakText(startPrompt, () => {
      appendDialogue({ speaker: 'examiner', stage: 'part2_speak', text: startPrompt });
      if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
      triggerCandidateTurn('p2_monologue');
    });
  }, [speechEngine, speakText, appendDialogue, triggerCandidateTurn]);

  // Move to Part 3
  const moveToPart3 = useCallback((explicitSpeech = null) => {
    if (speechEngine?.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine?.isListening) speechEngine.stopListening();

    const currentP2Speech = explicitSpeech ?? (speechEngine?.transcript || speechEngine?.interimTranscript || '(Candidate delivered 2-minute speech)');
    appendDialogue({
      speaker: 'candidate',
      stage: 'part2_speak',
      cueCardTitle: part2Card.title,
      notes: part2Notes,
      text: currentP2Speech,
      durationSec: part2SpeakSeconds
    });

    setCurrentStage('part3');
    setP3Index(0);
    setIsAnsweringFollowUp(false);

    const questions = part3Set.questions || [];
    const firstP3Q = questions[0]?.question || 'How has technology influenced communication?';
    const p3Intro = `We've been talking about ${part2Card.title}, and I'd like to discuss with you one or two more general questions related to this. Let's consider ${part3Set.topic}. ${firstP3Q}`;
    setActivePromptText(firstP3Q);

    setTimeout(() => {
      speakText(p3Intro, () => {
        appendDialogue({ speaker: 'examiner', stage: 'part3', text: firstP3Q });
        if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
        triggerCandidateTurn('p3_q0');
      });
    }, 400);
  }, [speechEngine, part2Card, part2Notes, part2SpeakSeconds, part3Set, appendDialogue, speakText, triggerCandidateTurn]);

  // Next Question in Part 3 (with adaptive follow-up probing)
  const nextPart3Question = useCallback((explicitAnswer = null) => {
    const currentAnswer = explicitAnswer ?? (speechEngine?.transcript || speechEngine?.interimTranscript || '(Candidate answered)');
    const currentQ = part3Set.questions?.[p3Index]?.question || activePromptText;

    appendDialogue({
      speaker: 'candidate',
      stage: 'part3',
      questionText: isAnsweringFollowUp ? activeFollowUpPrompt : currentQ,
      text: currentAnswer
    });

    if (speechEngine?.stopListening) speechEngine.stopListening();
    if (speechEngine?.resetTranscript) speechEngine.resetTranscript();

    // Check if adaptive follow-up is warranted
    if (isAdaptiveMode && !isAnsweringFollowUp) {
      const analysis = analyzeCandidateUtterance(currentAnswer, { stage: 'part3', hasFollowedUpOnThisQuestion: false });
      if (analysis.needsFollowUp && analysis.followUpQuestion) {
        setIsAnsweringFollowUp(true);
        setActiveFollowUpPrompt(analysis.followUpQuestion);
        setActivePromptText(analysis.followUpQuestion);

        const promptText = `${analysis.acknowledgment} ${analysis.followUpQuestion}`;
        speakText(promptText, () => {
          appendDialogue({ speaker: 'examiner', stage: 'part3', text: analysis.followUpQuestion, isFollowUp: true });
          if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
          triggerCandidateTurn(`p3_q${p3Index}_followup`);
        });
        return;
      }
    }

    // Reset follow-up and advance
    setIsAnsweringFollowUp(false);
    setActiveFollowUpPrompt(null);
    const nextIndex = p3Index + 1;
    const questions = part3Set.questions || [];

    if (nextIndex < questions.length) {
      setP3Index(nextIndex);
      const nextQ = questions[nextIndex].question;
      setActivePromptText(nextQ);
      speakText(nextQ, () => {
        appendDialogue({ speaker: 'examiner', stage: 'part3', text: nextQ });
        if (speechEngine?.resetTranscript) speechEngine.resetTranscript();
        triggerCandidateTurn(`p3_q${nextIndex}`);
      });
    } else {
      concludeExam();
    }
  }, [speechEngine, part3Set, p3Index, activePromptText, isAdaptiveMode, isAnsweringFollowUp, activeFollowUpPrompt, appendDialogue, speakText, triggerCandidateTurn]);

  // Conclude Exam
  const concludeExam = useCallback(() => {
    if (speechEngine?.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine?.isListening) speechEngine.stopListening();

    setCurrentStage('finishing');
    const farewellPrompt = 'Thank you very much. That is the end of the speaking test. Your answers have been recorded for Cambridge Assessment.';
    setActivePromptText(farewellPrompt);

    if (speakingSoundEffects?.playCompletionChime) {
      speakingSoundEffects.playCompletionChime();
    }

    speakText(farewellPrompt, () => {
      const finalTranscript = [
        ...dialogueHistory,
        { speaker: 'examiner', stage: 'conclusion', text: farewellPrompt, timestamp: new Date().toISOString() }
      ];
      setDialogueHistory(finalTranscript);
      setCurrentStage('completed');
      if (onFinishExam) {
        onFinishExam(finalTranscript, {
          mockPack,
          examiner,
          totalDurationSec: totalSeconds
        });
      }
    });
  }, [speechEngine, dialogueHistory, speakText, onFinishExam, mockPack, examiner, totalSeconds]);

  return {
    currentStage,
    setCurrentStage,
    p1Index,
    p3Index,
    isAnsweringFollowUp,
    activeFollowUpPrompt,
    part2Notes,
    setPart2Notes,
    isNotepadDocked,
    setIsNotepadDocked,
    prepSecondsLeft,
    setPrepSecondsLeft,
    part2SpeakSeconds,
    setPart2SpeakSeconds,
    totalSeconds,
    hasInterruptedCandidate,
    setHasInterruptedCandidate,
    dialogueHistory,
    setDialogueHistory,
    activePromptText,
    setActivePromptText,
    isAwaitingCandidateMic,
    setIsAwaitingCandidateMic,
    nextClipIdRef,
    triggerCandidateTurn,
    formatTime,
    proceedToPart1,
    nextPart1Question,
    moveToPart2Prep,
    startPart2Speaking,
    moveToPart3,
    nextPart3Question,
    concludeExam
  };
}
