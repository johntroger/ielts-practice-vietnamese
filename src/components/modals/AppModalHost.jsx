import React from 'react';
import WorkspaceErrorBoundary from '../common/WorkspaceErrorBoundary';
import { useModalStore } from '../../core/modalStore';
import { useAppStore } from '../../core/appStore';
import { countWords } from '../../utils/textAnalytics';
import { useTranslation } from '../../i18n';

// ==========================================
// LAZY-LOADED MODAL CHUNKS (CODE-SPLIT)
// ==========================================

// 1. Exam & Marathon Cluster
const MockTestModal = React.lazy(() => import('../MockTestModal'));
const DiagnosticPlacementModal = React.lazy(() => import('../DiagnosticPlacementModal'));
const CDIDisplayModal = React.lazy(() => import('../CDIDisplayModal'));

// 2. Learning & Practice Cluster
const FeedbackModal = React.lazy(() => import('../FeedbackModal'));
const TaskGeneratorModal = React.lazy(() => import('../TaskGeneratorModal'));
const TaskLibraryModal = React.lazy(() => import('../TaskLibraryModal'));
const VocabNotebookModal = React.lazy(() => import('../VocabNotebookModal'));
const MistakeLogModal = React.lazy(() => import('../MistakeLogModal'));
const HistoryModal = React.lazy(() => import('../HistoryModal'));
const TheoryHandbookModal = React.lazy(() => import('../TheoryHandbookModal'));
const MicroDrillsModal = React.lazy(() => import('../MicroDrillsModal'));
const VocabGrammarSpellingModal = React.lazy(() => import('../VocabGrammarSpellingModal'));
const DailyErrorPrescriptionModal = React.lazy(() => import('../DailyErrorPrescriptionModal'));
const GrowthAnalyticsModal = React.lazy(() => import('../GrowthAnalyticsModal'));
const WeeklyReportModal = React.lazy(() => import('../WeeklyReportModal'));
const DocumentIngestModal = React.lazy(() => import('../DocumentIngestModal'));
const IdeaMatrixModal = React.lazy(() => import('../IdeaMatrixModal'));
const RevisionModal = React.lazy(() => import('../RevisionModal'));
const QuickParaphraseModal = React.lazy(() => import('../QuickParaphraseModal'));
const SpeakingResultModal = React.lazy(() => import('../speaking/SpeakingResultModal'));
const AdaptiveSprintModal = React.lazy(() => import('../AdaptiveSprintModal'));
const AtlasEnglishArenaModal = React.lazy(() => import('../arena/AtlasEnglishArenaModal'));

// 3. System & Profile Cluster
const SettingsModal = React.lazy(() => import('../SettingsModal'));
const AuthModal = React.lazy(() => import('../AuthModal'));
const UserProfileModal = React.lazy(() => import('../UserProfileModal'));
const FeaturesGuideModal = React.lazy(() => import('../FeaturesGuideModal'));
const ContactModal = React.lazy(() => import('../ContactModal'));
const KeyboardShortcutsModal = React.lazy(() => import('../KeyboardShortcutsModal'));
const OnboardingModal = React.lazy(() => import('../OnboardingModal'));
const AIEvaluationProgressModal = React.lazy(() => import('../AIEvaluationProgressModal'));
const BeginnerGuideModal = React.lazy(() => import('../BeginnerGuideModal'));

/**
 * AppModalHost - Centralized Modal Container for IELTS Web Platform
 * 
 * Consolidates all 28 modal dialogs into structured clusters:
 * - Exam & Marathon Cluster
 * - Learning & Practice Cluster
 * - System & Profile Cluster
 * 
 * Replaces ~550 lines of duplicate modal JSX and ~25 local useState flags in App.jsx.
 * Managed centrally via useModalStore Pub/Sub.
 */
export default function AppModalHost({
  // Global / User props
  currentUser,
  setCurrentUser,
  apiKey,
  setApiKey,
  model,
  setModel,
  targetBand,
  setTargetBand,
  activeSkill,
  setActiveSkill,
  masteredIds,
  onToggleMastered,

  // Writing / Essay Task props
  currentTask,
  currentTaskId,
  setCurrentTaskId,
  allTasks,
  setAllTasks,
  communityTasks,
  setCommunityTasks,
  currentEssay,
  currentOutline,
  setOutlines,
  timeElapsed,
  isSubmitting,
  currentEvaluation,
  setCurrentEvaluation,
  onSubmitEssay,

  // History & Submissions props
  submissions,
  setSubmissions,
  readingHistory,
  listeningHistory,
  speakingHistory,
  selectedHistorySpeakingSub,
  setSelectedHistorySpeakingSub,
  onDeleteWritingSubmission,
  onClearWritingHistory,
  onDeleteReadingSubmission,
  onClearReadingHistory,
  onDeleteListeningSubmission,
  onClearListeningHistory,
  onDeleteSpeakingSubmission,
  onClearSpeakingHistory,
  onClearAllHistory,

  // Notebook / Mistakes / Notes props
  vocabList,
  setVocabList,
  mistakes,
  setMistakes,
  personalNotes,
  setPersonalNotes,
  streakCount,
  setStreakCount,

  // Marathon & CDI exam props
  marathonSession,
  onStartMarathon,
  onCancelMarathon,
  onStartReadingMockExam,
  cdiFontSize,
  onChangeCdiFontSize,
  cdiContrast,
  onChangeCdiContrast,
  onResetCDIDisplay,

  // Handlers for task mutations & cloud sync
  onAddNewCustomTask,
  onTogglePublic,
  onDeleteTask,
  onSaveMockResult,
  onSaveV2Submission,
  onTaskImported,
  onSaveUserVocab,
  onDeleteUserVocab,
  onSignOut,

  // Storage & Export props
  onClearAllLocalData,
  onExportAllData,
  onImportData
}) {
  const { isEn } = useTranslation();
  const { modals, openModal, closeModal } = useModalStore();
  const appStore = useAppStore();

  const resolvedActiveSkill = activeSkill ?? appStore.activeSkill;
  const resolvedSetActiveSkill = setActiveSkill ?? appStore.setActiveSkill;
  const resolvedMasteredIds = masteredIds ?? appStore.masteredItemIds;
  const resolvedToggleMastered = onToggleMastered ?? appStore.toggleMasteredItem;
  const resolvedCdiFontSize = cdiFontSize ?? appStore.cdiFontSize;
  const resolvedChangeCdiFontSize = onChangeCdiFontSize ?? appStore.setCdiFontSize;
  const resolvedCdiContrast = cdiContrast ?? appStore.cdiContrast;
  const resolvedChangeCdiContrast = onChangeCdiContrast ?? appStore.setCdiContrast;

  return (
    <React.Suspense fallback={null}>
      {/* ========================================================= */}
      {/* CLUSTER 1: EXAM & MARATHON CLUSTER                        */}
      {/* ========================================================= */}

      {/* 1.1 Mock Test Modal (Single Skill & Full Marathon) */}
      <WorkspaceErrorBoundary skillName="IELTS Mock Exam">
        {Boolean(modals.mockTest) && (
          <MockTestModal
            isOpen={Boolean(modals.mockTest)}
            onClose={() => closeModal('mockTest')}
            allTasks={allTasks}
            submissions={submissions}
            readingHistory={readingHistory}
            listeningHistory={listeningHistory}
            speakingHistory={speakingHistory}
            onSaveMockResult={onSaveMockResult}
            apiKey={apiKey}
            model={model}
            activeSkill={resolvedActiveSkill}
            onSelectSkill={(skill) => resolvedSetActiveSkill(skill)}
            onStartReadingMockExam={onStartReadingMockExam}
            currentUser={currentUser}
            marathonSession={marathonSession}
            onStartMarathon={onStartMarathon}
            onCancelMarathon={onCancelMarathon}
          />
        )}
      </WorkspaceErrorBoundary>

      {/* 1.2 Diagnostic Placement & Study Plan */}
      <WorkspaceErrorBoundary skillName="Diagnostic Placement & Study Plan">
        {Boolean(modals.diagnostic) && (
          <DiagnosticPlacementModal
            isOpen={Boolean(modals.diagnostic)}
            onClose={() => closeModal('diagnostic')}
            targetBand={targetBand}
            onApplyTargetBand={(newBand) => setTargetBand(newBand)}
            onOpenSkill={(skill) => resolvedSetActiveSkill(skill)}
          />
        )}
      </WorkspaceErrorBoundary>

      {/* 1.3 CDI Display & Accessibility (Font Size & Contrast) */}
      {Boolean(modals.cdiDisplay) && (
        <CDIDisplayModal
          isOpen={Boolean(modals.cdiDisplay)}
          onClose={() => closeModal('cdiDisplay')}
          cdiFontSize={resolvedCdiFontSize}
          onChangeFontSize={resolvedChangeCdiFontSize}
          cdiContrast={resolvedCdiContrast}
          onChangeContrast={resolvedChangeCdiContrast}
          onReset={onResetCDIDisplay}
        />
      )}

      {/* ========================================================= */}
      {/* CLUSTER 2: LEARNING & PRACTICE CLUSTER                    */}
      {/* ========================================================= */}

      {/* 2.1 Vocab, Grammar & Spelling (GRA & LR Practice) */}
      {Boolean(modals.vocabGrammar) && (
        <WorkspaceErrorBoundary skillName="IELTS Vocab, Grammar & Spelling">
          <VocabGrammarSpellingModal
            isOpen={Boolean(modals.vocabGrammar)}
            initialOptions={typeof modals.vocabGrammar === 'object' && modals.vocabGrammar !== null ? modals.vocabGrammar : null}
            onClose={() => closeModal('vocabGrammar')}
            apiKey={apiKey}
            model={model}
            onSaveToNotebook={(v) => {
              setVocabList(prev => [v, ...prev]);
              if (onSaveUserVocab) onSaveUserVocab(v);
            }}
            currentUser={currentUser}
            masteredIds={resolvedMasteredIds}
            onToggleMastered={resolvedToggleMastered}
            onOpenAuth={() => openModal('auth')}
          />
        </WorkspaceErrorBoundary>
      )}

      {/* 2.2 Micro Drills Studio (Task 1 & Task 2) */}
      {Boolean(modals.drills) && (
        <MicroDrillsModal
          isOpen={Boolean(modals.drills)}
          onClose={() => closeModal('drills')}
          apiKey={apiKey}
          model={model}
          activeSkill={activeSkill}
          currentUser={currentUser}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          onOpenAuth={() => openModal('auth')}
          initialRoom={typeof modals.drills === 'object' && modals.drills !== null ? (modals.drills.room || modals.drills.skill) : undefined}
          initialTab={typeof modals.drills === 'object' && modals.drills !== null ? modals.drills.tab : undefined}
          targetDrillId={typeof modals.drills === 'object' && modals.drills !== null ? (modals.drills.drillId || modals.drills.id) : undefined}
        />
      )}

      {/* 2.3 Weekly Report Modal */}
      {Boolean(modals.weeklyReport) && (
        <WeeklyReportModal
          isOpen={Boolean(modals.weeklyReport)}
          onClose={() => closeModal('weeklyReport')}
          submissions={submissions}
          readingHistory={readingHistory}
          listeningHistory={listeningHistory}
          speakingHistory={speakingHistory}
          mistakes={mistakes}
          apiKey={apiKey}
          model={model}
        />
      )}

      {/* 2.4 Document Ingest (PDF / Past Papers Ingestion) */}
      {Boolean(modals.ingest) && (
        <DocumentIngestModal
          isOpen={Boolean(modals.ingest)}
          onClose={() => closeModal('ingest')}
          user={currentUser}
          onTaskImported={onTaskImported}
          apiKey={apiKey}
          model={model}
        />
      )}

      {/* 2.5 Idea Matrix Modal */}
      {Boolean(modals.ideaMatrix) && (
        <IdeaMatrixModal
          isOpen={Boolean(modals.ideaMatrix)}
          onClose={() => closeModal('ideaMatrix')}
          promptText={currentTask?.prompt || ''}
          onInsertToOutline={(idea) => {
            setOutlines(prev => ({
              ...prev,
              [currentTaskId]: (prev[currentTaskId] || '') + `\n- [${isEn ? 'Idea' : 'Ý tưởng'}]: ${idea}`
            }));
          }}
          apiKey={apiKey}
          model={model}
        />
      )}

      {/* 2.6 Revision Modal (V1 vs V2 Comparison) */}
      {Boolean(modals.revision) && (
        <RevisionModal
          isOpen={Boolean(modals.revision)}
          onClose={() => closeModal('revision')}
          task={currentTask}
          v1Essay={currentEssay}
          v1Evaluation={currentEvaluation}
          onSaveV2Submission={onSaveV2Submission}
          apiKey={apiKey}
          model={model}
        />
      )}

      {/* 2.7 AI Essay Feedback Modal */}
      {Boolean(modals.feedback) && (
        <FeedbackModal
          isOpen={Boolean(modals.feedback)}
          onClose={() => closeModal('feedback')}
          evaluation={currentEvaluation}
          task={currentTask}
          essayText={currentEssay}
          stats={{
            wordCount: countWords(currentEssay),
            timeSpent: `${Math.floor(timeElapsed / 60)}p ${timeElapsed % 60}s`
          }}
          onSaveToMistakeLog={(m) => setMistakes(prev => [m, ...prev])}
          onSaveToVocabNotebook={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (onSaveUserVocab) onSaveUserVocab(v);
          }}
          onOpenRevision={() => openModal('revision')}
          onReEvaluateWithAI={() => {
            closeModal('feedback');
            if (onSubmitEssay) onSubmitEssay('ai');
          }}
        />
      )}

      {/* 2.8 Task Generator Modal */}
      {Boolean(modals.generator) && (
        <TaskGeneratorModal
          isOpen={Boolean(modals.generator)}
          onClose={() => closeModal('generator')}
          apiKey={apiKey}
          model={model}
          user={currentUser}
          tasks={allTasks}
          onTaskCreated={onAddNewCustomTask}
          onOpenSettings={() => {
            closeModal('generator');
            openModal('settings');
          }}
        />
      )}

      {/* 2.9 Task Library Modal */}
      {Boolean(modals.library) && (
        <TaskLibraryModal
          isOpen={Boolean(modals.library)}
          onClose={() => closeModal('library')}
          allTasks={allTasks}
          communityTasks={communityTasks}
          user={currentUser}
          submissions={submissions}
          currentTaskId={currentTaskId}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          onOpenAuth={() => openModal('auth')}
          onSelectTask={(t) => {
            setAllTasks(prev => {
              if (prev.some(existing => existing.id === t.id)) return prev;
              return [t, ...prev];
            });
            setCurrentTaskId(t.id);
          }}
          onAddNewCustomTask={onAddNewCustomTask}
          onTogglePublic={onTogglePublic}
          onDeleteTask={onDeleteTask}
          onExportAllData={onExportAllData}
          onImportData={onImportData}
        />
      )}

      {/* 2.10 Vocab Notebook Modal */}
      {Boolean(modals.notebook) && (
        <VocabNotebookModal
          isOpen={Boolean(modals.notebook)}
          onClose={() => closeModal('notebook')}
          vocabList={vocabList}
          onAddVocab={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (onSaveUserVocab) onSaveUserVocab(v);
          }}
          onDeleteVocab={(id) => {
            setVocabList(prev => prev.filter((v, i) => (v.id || i) !== id));
            if (onDeleteUserVocab) onDeleteUserVocab(id);
          }}
          onClearAll={() => setVocabList([])}
        />
      )}

      {/* 2.11 Mistake Log Modal */}
      {Boolean(modals.mistakeLog) && (
        <MistakeLogModal
          isOpen={Boolean(modals.mistakeLog)}
          onClose={() => closeModal('mistakeLog')}
          mistakes={mistakes}
          onDeleteMistake={(idx) => setMistakes(prev => prev.filter((_, i) => i !== idx))}
          onClearAll={() => setMistakes([])}
        />
      )}

      {/* 2.12 Comprehensive Practice History Modal */}
      {Boolean(modals.history) && (
        <HistoryModal
          isOpen={Boolean(modals.history)}
          onClose={() => closeModal('history')}
          submissions={submissions}
          readingHistory={readingHistory}
          listeningHistory={listeningHistory}
          speakingHistory={speakingHistory}
          activeSkill={activeSkill}
          onViewSubmission={(sub) => {
            setCurrentTaskId(sub.task.id);
            setCurrentEvaluation(sub.evaluation);
            openModal('feedback');
          }}
          onDeleteSubmission={onDeleteWritingSubmission}
          onClearHistory={onClearWritingHistory}
          onDeleteReadingSubmission={onDeleteReadingSubmission}
          onClearReadingHistory={onClearReadingHistory}
          onDeleteListeningSubmission={onDeleteListeningSubmission}
          onClearListeningHistory={onClearListeningHistory}
          onDeleteSpeakingSubmission={onDeleteSpeakingSubmission}
          onClearSpeakingHistory={onClearSpeakingHistory}
          onClearAllHistory={onClearAllHistory}
          onViewSpeakingSubmission={(sub) => setSelectedHistorySpeakingSub(sub)}
          masteredIds={masteredIds}
        />
      )}

      {/* 2.13 Cambridge Theory Handbook Modal */}
      {Boolean(modals.theory) && (
        <TheoryHandbookModal
          isOpen={Boolean(modals.theory)}
          onClose={() => closeModal('theory')}
          activeSkill={typeof modals.theory === 'object' && modals.theory?.skill ? modals.theory.skill : activeSkill}
          initialCategory={typeof modals.theory === 'object' && modals.theory?.category ? modals.theory.category : 'all'}
          initialSubType={typeof modals.theory === 'object' && modals.theory?.subType ? modals.theory.subType : 'all'}
          initialTopicId={typeof modals.theory === 'object' && modals.theory?.topicId ? modals.theory.topicId : null}
          initialSearchQuery={typeof modals.theory === 'object' && modals.theory?.searchQuery ? modals.theory.searchQuery : ''}
          personalNotes={personalNotes}
          onSavePersonalNote={(note) => setPersonalNotes(prev => [note, ...prev])}
          onDeletePersonalNote={(id) => setPersonalNotes(prev => prev.filter(n => n.id !== id))}
        />
      )}

      {/* 2.14 Quick Paraphrase Assistant */}
      {Boolean(modals.paraphrase) && (
        <QuickParaphraseModal
          isOpen={Boolean(modals.paraphrase)}
          onClose={() => closeModal('paraphrase')}
          onSaveToNotebook={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (onSaveUserVocab) onSaveUserVocab(v);
          }}
        />
      )}

      {/* 2.15 Speaking Result Modal (History Detail View) */}
      {selectedHistorySpeakingSub && (
        <SpeakingResultModal
          isOpen={Boolean(selectedHistorySpeakingSub)}
          onClose={() => setSelectedHistorySpeakingSub(null)}
          evaluation={selectedHistorySpeakingSub.evaluation}
          dialogueHistory={selectedHistorySpeakingSub.dialogueHistory}
          mockPack={selectedHistorySpeakingSub.mockPack}
          examiner={selectedHistorySpeakingSub.examiner}
          totalDurationSec={selectedHistorySpeakingSub.durationSec}
          onSaveToVocabNotebook={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (onSaveUserVocab) onSaveUserVocab(v);
          }}
          onSaveMistake={(m) => setMistakes(prev => [m, ...prev])}
        />
      )}

      {/* 2.16 Daily Error Prescription (Spaced Repetition) */}
      {Boolean(modals.prescription) && (
        <DailyErrorPrescriptionModal
          isOpen={Boolean(modals.prescription)}
          onClose={() => closeModal('prescription')}
          mistakes={mistakes}
          submissions={submissions}
        />
      )}

      {/* 2.16b Adaptive 30-Min Sprint Coach */}
      {Boolean(modals.adaptiveSprint) && (
        <AdaptiveSprintModal
          isOpen={Boolean(modals.adaptiveSprint)}
          onClose={() => closeModal('adaptiveSprint')}
          submissions={submissions}
          mistakes={mistakes}
          vocabList={vocabList}
          targetBand={targetBand}
          onSaveToVocabNotebook={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (onSaveUserVocab) onSaveUserVocab(v);
          }}
        />
      )}

      {/* 2.16c Atlas English Arena Fast Sprint */}
      {Boolean(modals.atlasArena) && (
        <AtlasEnglishArenaModal
          isOpen={Boolean(modals.atlasArena)}
          onClose={() => closeModal('atlasArena')}
          currentUser={currentUser}
        />
      )}

      {/* 2.17 Cambridge Growth Analytics & Prediction */}
      {Boolean(modals.growthAnalytics) && (
        <GrowthAnalyticsModal
          isOpen={Boolean(modals.growthAnalytics)}
          onClose={() => closeModal('growthAnalytics')}
          initialTargetBand={Number(targetBand) || 7.0}
          userScores={{
            listening: 6.5,
            reading: 6.5,
            writing: 6.0,
            speaking: 6.0,
            overall: 6.5
          }}
          onNavigateSkill={(skill) => {
            setActiveSkill(skill);
            closeModal('growthAnalytics');
          }}
        />
      )}

      {/* ========================================================= */}
      {/* CLUSTER 3: SYSTEM & PROFILE CLUSTER                       */}
      {/* ========================================================= */}

      {/* 3.1 AI Evaluation Progress Overlay */}
      {(isSubmitting || Boolean(modals.evaluationProgress)) && (
        <AIEvaluationProgressModal
          isOpen={isSubmitting || Boolean(modals.evaluationProgress)}
          taskNumber={currentTask?.taskNumber || 2}
          skill="writing"
        />
      )}

      {/* 3.2 System Settings & API Key Config */}
      {Boolean(modals.settings) && (
        <SettingsModal
          isOpen={Boolean(modals.settings)}
          onClose={() => closeModal('settings')}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          onClearAllLocalData={onClearAllLocalData}
        />
      )}

      {/* 3.3 Supabase Authentication Modal */}
      {Boolean(modals.auth) && (
        <AuthModal
          isOpen={Boolean(modals.auth)}
          onClose={() => closeModal('auth')}
          user={currentUser}
          onAuthSuccess={(user) => setCurrentUser(user)}
        />
      )}

      {/* 3.4 User Profile & Synchronization Hub */}
      {Boolean(modals.profile) && (
        <UserProfileModal
          isOpen={Boolean(modals.profile)}
          onClose={() => closeModal('profile')}
          user={currentUser}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          submissions={submissions}
          readingHistory={readingHistory}
          listeningHistory={listeningHistory}
          speakingHistory={speakingHistory}
          vocabList={vocabList}
          mistakes={mistakes}
          streakCount={streakCount}
          allTasks={allTasks}
          onSelectTask={(t) => setCurrentTaskId(t.id)}
          onTogglePublic={onTogglePublic}
          onDeleteTask={onDeleteTask}
          onViewSubmission={(sub) => {
            setCurrentTaskId(sub.task.id);
            setCurrentEvaluation(sub.evaluation);
            openModal('feedback');
          }}
          onDeleteSubmission={onDeleteWritingSubmission}
          onClearHistory={onClearWritingHistory}
          onDeleteReadingSubmission={onDeleteReadingSubmission}
          onClearReadingHistory={onClearReadingHistory}
          onDeleteListeningSubmission={onDeleteListeningSubmission}
          onClearListeningHistory={onClearListeningHistory}
          onDeleteSpeakingSubmission={onDeleteSpeakingSubmission}
          onClearSpeakingHistory={onClearSpeakingHistory}
          onClearAllHistory={onClearAllHistory}
          onSaveToVocabNotebook={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (onSaveUserVocab) onSaveUserVocab(v);
          }}
          onSaveMistake={(m) => setMistakes(prev => [m, ...prev])}
          onSignOut={onSignOut}
          onOpenAuth={() => openModal('auth')}
          onOpenIngest={() => { closeModal('profile'); openModal('ingest'); }}
          onOpenGenerator={() => { closeModal('profile'); openModal('generator'); }}
          onOpenLibrary={() => { closeModal('profile'); openModal('library'); }}
          onOpenPrescription={() => { closeModal('profile'); openModal('prescription'); }}
          onExportAllData={onExportAllData}
          onImportData={onImportData}
        />
      )}

      {/* 3.5 Help Center, Search & Features Guide */}
      {Boolean(modals.featuresGuide) && (
        <FeaturesGuideModal
          isOpen={Boolean(modals.featuresGuide)}
          onClose={() => closeModal('featuresGuide')}
          initialSkill={activeSkill}
          onNavigateWorkspace={(skill) => setActiveSkill(skill)}
          onOpenModal={(modalName) => openModal(modalName)}
        />
      )}

      {/* 3.6 Contact, Feedback & Academic Advisory */}
      {Boolean(modals.contact) && (
        <ContactModal
          isOpen={Boolean(modals.contact)}
          onClose={() => closeModal('contact')}
        />
      )}

      {/* 3.7 Global Keyboard Shortcuts Reference */}
      {Boolean(modals.shortcuts) && (
        <KeyboardShortcutsModal
          isOpen={Boolean(modals.shortcuts)}
          onClose={() => closeModal('shortcuts')}
        />
      )}

      {/* 3.8 Onboarding 3-Step Guided Tour */}
      {Boolean(modals.onboarding) && (
        <OnboardingModal
          isOpen={Boolean(modals.onboarding)}
          onClose={() => closeModal('onboarding')}
          initialTargetBand={targetBand}
          currentApiKey={apiKey}
          onSaveConfig={({ targetBand: newBand, apiKey: newKey }) => {
            if (newBand) setTargetBand(newBand);
            if (newKey) setApiKey(newKey);
          }}
        />
      )}

      {/* 3.9 Beginner Foundation Hub & Zero-Overwhelm Guide */}
      {Boolean(modals.beginnerGuide) && (
        <BeginnerGuideModal
          isOpen={Boolean(modals.beginnerGuide)}
          onClose={() => closeModal('beginnerGuide')}
          targetBand={targetBand}
          onApplyTargetBand={(band) => setTargetBand(band)}
          onOpenArena={() => openModal('atlasArena')}
          onOpenDrills={() => openModal('drills')}
          onOpenDiagnostic={() => openModal('diagnostic')}
          onOpenTheory={() => openModal('theory')}
        />
      )}
    </React.Suspense>
  );
}
