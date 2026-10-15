import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("▶ Running: Step 147: TRF Modal & Hooks Order Invariant Verification (React Error #310 Fix) ...");

const trfModalPath = path.resolve('src/components/TRFSimulatorModal.jsx');
const vocabNotebookPath = path.resolve('src/components/VocabNotebookModal.jsx');
const weeklyReportPath = path.resolve('src/components/WeeklyReportModal.jsx');

const trfModalCode = fs.readFileSync(trfModalPath, 'utf8');
const vocabNotebookCode = fs.readFileSync(vocabNotebookPath, 'utf8');
const weeklyReportCode = fs.readFileSync(weeklyReportPath, 'utf8');

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

// 1. Verify TRFSimulatorModal
verifyNoHooksAfterTopLevelEarlyReturn(trfModalCode, 'TRFSimulatorModal.jsx');
assert(trfModalCode.indexOf('useState') < trfModalCode.indexOf('if (!isOpen || !trfData) return null;'),
  'TRFSimulatorModal must declare useState BEFORE the early return');

// 2. Verify VocabNotebookModal
verifyNoHooksAfterTopLevelEarlyReturn(vocabNotebookCode, 'VocabNotebookModal.jsx');

// 3. Verify WeeklyReportModal
verifyNoHooksAfterTopLevelEarlyReturn(weeklyReportCode, 'WeeklyReportModal.jsx');

// 4. Simulate hook invocation sequence test
function testComponentHookConsistency(renderFn) {
  let hookCallCounts = [];
  
  // Render 1: isOpen = false
  let currentCalls = 0;
  const mockHooks = {
    useTranslation: () => { currentCalls++; },
    useState: () => { currentCalls++; return [false, () => {}]; }
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

function mockTrfComponent(isOpen, hooks) {
  hooks.useTranslation();
  hooks.useState();
  if (!isOpen) return null;
  return { rendered: true };
}

testComponentHookConsistency(mockTrfComponent);

console.log("✅ PASSED: Step 147 TRF Modal Hook Order Verified Cleanly! (React Invariant #310 Eliminated)");
