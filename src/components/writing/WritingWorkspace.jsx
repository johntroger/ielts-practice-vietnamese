import React, { useState, useEffect } from 'react';
import WritingSubHeaderToolbar from '../WritingSubHeaderToolbar';
import SplitPane from '../SplitPane';
import PromptPane from '../PromptPane';
import EditorPane from '../EditorPane';
import TimerBar from '../TimerBar';
import SlideOverToolPanel from '../SlideOverToolPanel';
import { countWords } from '../../utils/textAnalytics';
import { brainstormIdeas } from '../../services/geminiService';
import { safeGet, safeSet } from '../../utils/storageService';

/**
 * WritingWorkspace - Self-contained workspace for IELTS Writing (Task 1 & Task 2)
 * Encapsulates the SubHeader toolbar, SplitPane editor/prompt, TimerBar, and SlideOver panel.
 */
export default function WritingWorkspace({
  currentTask,
  currentEssay = '',
  onEssayChange,
  currentOutline = '',
  onOutlineChange,
  mode = 'practice',
  apiKey = '',
  model = 'gemini-2.5-flash',
  timeElapsed = 0,
  timeRemaining = 2400,
  isTimerRunning = false,
  onToggleTimer,
  onResetTimer,
  isSubmitting = false,
  onSubmitEssay,
  lastSaved,
  streakCount = 0,
  targetBand = 7.0,
  masteredIds = [],
  onToggleMastered,
  onOpenLibrary,
  onOpenGenerator,
  onOpenOnboarding,
  onOpenTheory,
  onOpenMistakeLog,
  onOpenPrescription,
  onOpenShortcuts,
  onOpenCDIDisplay,
  onOpenIdeaMatrix,
  onOpenSettings,
  mistakes = [],
  isFocusMode = false,
  toggleFocusMode,
  weeklyWordProgress = 0,
  currentWeekWords = 0,
  weeklyWordTarget = 2500,
  cdiFontSize = 'standard',
  cdiContrast = 'standard',
  isSlimHeader = false,
  toggleSlimHeader,
  setIsSlimHeader,
  vocabList = [],
  onAddVocab,
  currentUser
}) {
  // Phase 3 UI/UX: Minimal Focus View vs Pro Studio View Mode
  const [writingViewMode, setWritingViewMode] = useState(() => safeGet('ielts_writing_view_mode', 'pro'));

  const handleToggleWritingViewMode = (newMode) => {
    const next = newMode || (writingViewMode === 'minimal' ? 'pro' : 'minimal');
    setWritingViewMode(next);
    safeSet('ielts_writing_view_mode', next);
  };

  // Local state for Brainstorming AI
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [brainstormResult, setBrainstormResult] = useState('');

  // Local state for SlideOver tool panel (Paraphrase & Vocabulary)
  const [slideOverConfig, setSlideOverConfig] = useState({ isOpen: false, tab: 'paraphrase' });

  // Reset brainstorm when task changes
  useEffect(() => {
    setBrainstormResult('');
  }, [currentTask?.id]);

  // Handle Brainstorming with AI
  const handleBrainstorm = async () => {
    if (!apiKey) {
      onOpenSettings?.();
      return;
    }
    if (!currentTask?.prompt) return;

    setIsBrainstorming(true);
    try {
      const res = await brainstormIdeas({
        promptText: currentTask.prompt,
        apiKey,
        model
      });
      setBrainstormResult(res);
    } catch (err) {
      alert(err.message || 'Lỗi gợi ý ý tưởng.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  // Handle insertion from SlideOver panel into essay
  const handleInsertSlideOverText = (text) => {
    const current = currentEssay || '';
    const updated = current ? `${current.trim()} ${text} ` : `${text} `;
    onEssayChange?.(updated);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden" data-writing-view={writingViewMode}>
      {/* 1. Writing Workspace Sub-Header Toolbar */}
      <WritingSubHeaderToolbar
        currentTask={currentTask}
        streakCount={streakCount}
        targetBand={targetBand}
        masteredIds={masteredIds}
        onToggleMastered={onToggleMastered}
        onOpenLibrary={onOpenLibrary}
        onOpenGenerator={onOpenGenerator}
        onOpenOnboarding={onOpenOnboarding}
        onOpenTheory={onOpenTheory}
        onOpenMistakeLog={onOpenMistakeLog}
        onOpenPrescription={onOpenPrescription}
        mistakesCount={mistakes.length}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        onOpenShortcuts={onOpenShortcuts}
        weeklyWordProgress={weeklyWordProgress}
        currentWeekWords={currentWeekWords}
        weeklyWordTarget={weeklyWordTarget}
        onOpenCDIDisplay={onOpenCDIDisplay}
        cdiFontSize={cdiFontSize}
        cdiContrast={cdiContrast}
        isSlimHeader={isSlimHeader}
        toggleSlimHeader={toggleSlimHeader}
        writingViewMode={writingViewMode}
        onToggleWritingViewMode={handleToggleWritingViewMode}
        onOpenSlideOver={(tab) => setSlideOverConfig({ isOpen: true, tab })}
      />

      {/* 2. Writing SplitPane Workspace (Prompt + Editor) */}
      <SplitPane
        defaultSplit={46}
        leftPane={
          <PromptPane
            task={currentTask}
            mode={mode}
            onBrainstorm={handleBrainstorm}
            isBrainstorming={isBrainstorming}
            brainstormResult={brainstormResult}
            onOpenIdeaMatrix={onOpenIdeaMatrix}
            apiKey={apiKey}
            onOpenSettings={onOpenSettings}
            isMastered={masteredIds.includes(currentTask?.id)}
            onToggleMastered={() => onToggleMastered?.(currentTask?.id)}
            onOpenLibrary={onOpenLibrary}
            writingViewMode={writingViewMode}
          />
        }
        rightPane={
          <EditorPane
            essayText={currentEssay}
            setEssayText={onEssayChange}
            outlineText={currentOutline}
            setOutlineText={onOutlineChange}
            task={currentTask}
            mode={mode}
            timeElapsed={timeElapsed}
            lastSaved={lastSaved}
            onOpenParaphrase={() => setSlideOverConfig({ isOpen: true, tab: 'paraphrase' })}
            onOpenSlideOver={(tab) => setSlideOverConfig({ isOpen: true, tab })}
            onSubmitEssay={onSubmitEssay}
            onEditorFocus={() => {
              // Respect user manual control without forced resets
            }}
            writingViewMode={writingViewMode}
            onToggleWritingViewMode={handleToggleWritingViewMode}
          />
        }
      />

      {/* 3. Writing TimerBar */}
      <TimerBar
        timeRemaining={timeRemaining}
        totalTime={(currentTask?.timeLimit || 40) * 60}
        isRunning={isTimerRunning}
        onToggleTimer={onToggleTimer}
        onResetTimer={onResetTimer}
        onSubmitEssay={onSubmitEssay}
        isSubmitting={isSubmitting}
        wordCount={countWords(currentEssay)}
        minWords={currentTask?.minWords || (currentTask?.taskNumber === 1 ? 150 : 250)}
        apiKey={apiKey}
        onOpenSettings={onOpenSettings}
        essayText={currentEssay}
        currentTask={currentTask}
        mistakes={mistakes}
      />

      {/* 4. Slide-Over Panel for Vocabulary, Paraphrasing & Common Mistakes */}
      <SlideOverToolPanel
        isOpen={slideOverConfig.isOpen}
        onClose={() => setSlideOverConfig(prev => ({ ...prev, isOpen: false }))}
        initialTab={slideOverConfig.tab}
        vocabList={vocabList}
        mistakes={mistakes}
        onInsertText={handleInsertSlideOverText}
        onAddVocab={onAddVocab}
        promptText={currentTask?.prompt}
      />
    </div>
  );
}
