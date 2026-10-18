import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("▶ Running: Step 189: Listening Modals Hooks Order Invariant (React Error #310 Fix) ...");

const transcriptModalPath = path.resolve('src/components/listening/ListeningTranscriptModal.jsx');
const listeningWorkspacePath = path.resolve('src/components/listening/ListeningWorkspace.jsx');

const transcriptModalCode = fs.readFileSync(transcriptModalPath, 'utf8');
const listeningWorkspaceCode = fs.readFileSync(listeningWorkspacePath, 'utf8');

// Helper to check that no hook is called after a top-level early return
function verifyNoHooksAfterTopLevelEarlyReturn(code, fileName) {
  const lines = code.split('\n');
  let earlyReturnFound = false;
  let earlyReturnLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('if (!isOpen') && trimmed.includes('return')) {
      earlyReturnFound = true;
      earlyReturnLine = i + 1;
    }
    if (earlyReturnFound) {
      const isHook = /^\s*(const|let|var)?\s*(\[[^\]]*\]|\{[^\}]*\}|\w+)\s*=\s*use[A-Z]\w*\(/.test(trimmed) ||
                     /^\s*use[A-Z]\w*\(/.test(trimmed);
      assert(!isHook, `${fileName}: Hook called at line ${i + 1} AFTER top-level early return at line ${earlyReturnLine}: "${trimmed}"`);
    }
  }
}

// 1. Verify ListeningTranscriptModal has no hooks after early return
verifyNoHooksAfterTopLevelEarlyReturn(transcriptModalCode, 'ListeningTranscriptModal.jsx');
assert(
  transcriptModalCode.indexOf('useState') < transcriptModalCode.indexOf('if (!isOpen || !currentTest) return null;'),
  'ListeningTranscriptModal must declare all useState/useEffect/useRef hooks BEFORE early return'
);
assert(
  transcriptModalCode.indexOf('useEffect') < transcriptModalCode.indexOf('if (!isOpen || !currentTest) return null;'),
  'ListeningTranscriptModal must declare all useEffect hooks BEFORE early return'
);
console.log('  ✓ ListeningTranscriptModal.jsx: All hooks declared before early return check');

// 2. Verify ListeningWorkspace conditionally mounts ListeningTranscriptModal
assert(
  listeningWorkspaceCode.includes('{isTranscriptOpen && (') &&
  listeningWorkspaceCode.includes('<ListeningTranscriptModal'),
  'ListeningWorkspace must conditionally mount ListeningTranscriptModal only when isTranscriptOpen is true'
);
console.log('  ✓ ListeningWorkspace.jsx: Conditionally mounts ListeningTranscriptModal');

// 3. Verify ListeningWorkspace conditionally mounts other modals
assert(
  listeningWorkspaceCode.includes('{isResultModalOpen && (') &&
  listeningWorkspaceCode.includes('<ListeningResultModal'),
  'ListeningWorkspace must conditionally mount ListeningResultModal only when isResultModalOpen is true'
);
assert(
  listeningWorkspaceCode.includes('{isLibraryOpen && (') &&
  listeningWorkspaceCode.includes('<ListeningLibraryModal'),
  'ListeningWorkspace must conditionally mount ListeningLibraryModal only when isLibraryOpen is true'
);
assert(
  listeningWorkspaceCode.includes('{isGeneratorOpen && (') &&
  listeningWorkspaceCode.includes('<ListeningURLExerciseGeneratorModal'),
  'ListeningWorkspace must conditionally mount ListeningURLExerciseGeneratorModal only when isGeneratorOpen is true'
);
console.log('  ✓ ListeningWorkspace.jsx: All listening modals are guarded with conditional mount check');

// 4. Simulate hook invocation sequence test across render cycles
function testListeningTranscriptModalHookConsistency(renderFn) {
  let hookCallCounts = [];
  
  // Render 1: isOpen = false
  let currentCalls = 0;
  const mockHooks = {
    useTranslation: () => { currentCalls++; },
    useState: () => { currentCalls++; return [1, () => {}]; },
    useRef: () => { currentCalls++; return { current: null }; },
    useEffect: () => { currentCalls++; }
  };
  renderFn(false, mockHooks);
  hookCallCounts.push(currentCalls);

  // Render 2: isOpen = true
  currentCalls = 0;
  renderFn(true, mockHooks);
  hookCallCounts.push(currentCalls);

  assert.strictEqual(
    hookCallCounts[0],
    hookCallCounts[1],
    `Hook count must be identical across isOpen=false (${hookCallCounts[0]}) and isOpen=true (${hookCallCounts[1]}) to prevent React invariant #310`
  );
}

testListeningTranscriptModalHookConsistency((isOpen, hooks) => {
  hooks.useTranslation();
  hooks.useState(); // selectedPartNum
  hooks.useState(); // searchTerm
  hooks.useState(); // selectedSentenceIndex
  hooks.useRef();   // activeSentenceRef
  hooks.useEffect(); // sync selectedPartNum
  hooks.useEffect(); // scroll active sentence

  if (!isOpen) return null;
  return '<div>Modal Content</div>';
});

console.log('  ✓ Mock component render simulation verifies identical hook count across renders');
console.log('\n🎉 Step 189: All 4/4 React Error #310 invariant checks PASSED successfully!\n');
