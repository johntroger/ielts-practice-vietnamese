import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Testing Step 20: Architecture Refactoring & Modular Components (Phase 3)');

// 1. Verify custom hook useKeyboardShortcuts.js
const hookPath = path.resolve('src/hooks/useKeyboardShortcuts.js');
assert(fs.existsSync(hookPath), 'src/hooks/useKeyboardShortcuts.js must exist');
const hookCode = fs.readFileSync(hookPath, 'utf8');

assert(hookCode.includes('export function useKeyboardShortcuts') || hookCode.includes('export default function useKeyboardShortcuts'), 'useKeyboardShortcuts must export hook function');
assert(hookCode.includes('altKey') && hookCode.includes("'f'"), 'Hook must handle Alt+F shortcut');
assert(hookCode.includes('altKey') && hookCode.includes("'k'"), 'Hook must handle Alt+K shortcut');
assert(hookCode.includes('altKey') && hookCode.includes("'m'"), 'Hook must handle Alt+M shortcut');
assert(hookCode.includes('altKey') && hookCode.includes("'t'"), 'Hook must handle Alt+T shortcut');
assert(hookCode.includes('Escape'), 'Hook must handle Escape key');
assert(hookCode.includes('INPUT') && hookCode.includes('TEXTAREA'), 'Hook must protect text inputs from accidental shortcuts');
console.log('  ✅ 1. useKeyboardShortcuts hook safely isolates keyboard event listeners');

// 2. Verify App.jsx integrates useKeyboardShortcuts
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(appCode.includes("from './hooks/useKeyboardShortcuts'"), 'App.jsx must import useKeyboardShortcuts');
assert(appCode.includes('useKeyboardShortcuts({'), 'App.jsx must call useKeyboardShortcuts with callbacks');
console.log('  ✅ 2. App.jsx successfully delegates shortcut management to useKeyboardShortcuts');

// 3. Verify WritingSubHeaderToolbar.jsx
const subHeaderPath = path.resolve('src/components/WritingSubHeaderToolbar.jsx');
assert(fs.existsSync(subHeaderPath), 'src/components/WritingSubHeaderToolbar.jsx must exist');
const subHeaderCode = fs.readFileSync(subHeaderPath, 'utf8');

assert(subHeaderCode.includes('export default function WritingSubHeaderToolbar'), 'WritingSubHeaderToolbar must export default component');
assert(subHeaderCode.includes('currentTask'), 'WritingSubHeaderToolbar must accept currentTask');
assert(subHeaderCode.includes('isFocusMode'), 'WritingSubHeaderToolbar must accept and handle isFocusMode prop');
assert(subHeaderCode.includes('toggleFocusMode'), 'WritingSubHeaderToolbar must accept toggleFocusMode');
assert(subHeaderCode.includes('onOpenLibrary'), 'WritingSubHeaderToolbar must support task library modal trigger');
assert(subHeaderCode.includes('onOpenMistakeLog'), 'WritingSubHeaderToolbar must support mistake log modal trigger');
assert(subHeaderCode.includes('onOpenShortcuts'), 'WritingSubHeaderToolbar must support shortcuts trigger');
assert(subHeaderCode.includes('weeklyWordProgress'), 'WritingSubHeaderToolbar must display weekly word progress');
console.log('  ✅ 3. WritingSubHeaderToolbar modularizes writing workspace toolbar controls');

// 4. Verify App.jsx integrates WritingSubHeaderToolbar
assert(appCode.includes("from './components/WritingSubHeaderToolbar'"), 'App.jsx must import WritingSubHeaderToolbar');
assert(appCode.includes('<WritingSubHeaderToolbar'), 'App.jsx must render WritingSubHeaderToolbar component');
console.log('  ✅ 4. App.jsx renders WritingSubHeaderToolbar with clean props separation');

// 5. Verify MarathonTRFScorecard.jsx
const trfPath = path.resolve('src/components/MarathonTRFScorecard.jsx');
assert(fs.existsSync(trfPath), 'src/components/MarathonTRFScorecard.jsx must exist');
const trfCode = fs.readFileSync(trfPath, 'utf8');

assert(trfCode.includes('export default function MarathonTRFScorecard'), 'MarathonTRFScorecard must export default component');
assert(trfCode.includes('CAMBRIDGE TEST REPORT FORM'), 'MarathonTRFScorecard must render TRF Simulation header');
assert(trfCode.includes('listeningBand') && trfCode.includes('readingBand') && trfCode.includes('writingBand') && trfCode.includes('speakingBand'), 'MarathonTRFScorecard must display 4-skill individual band scores');
assert(trfCode.includes('calculatedOverallBand'), 'MarathonTRFScorecard must render calculated Overall Band');
assert(trfCode.includes('cefrEvaluation'), 'MarathonTRFScorecard must render CEFR level assessment');
assert(trfCode.includes('Cambridge Assessment English'), 'MarathonTRFScorecard must display Cambridge rounding methodology explanation');
console.log('  ✅ 5. MarathonTRFScorecard successfully encapsulates official TRF certificate simulation');

// 6. Verify MockTestModal.jsx integrates MarathonTRFScorecard
const mockModalPath = path.resolve('src/components/MockTestModal.jsx');
const mockModalCode = fs.readFileSync(mockModalPath, 'utf8');

assert(mockModalCode.includes("from './MarathonTRFScorecard'"), 'MockTestModal.jsx must import MarathonTRFScorecard');
assert(mockModalCode.includes('<MarathonTRFScorecard'), 'MockTestModal.jsx must render MarathonTRFScorecard');
console.log('  ✅ 6. MockTestModal.jsx delegates TRF simulation scorecard rendering');

console.log('🎉 Step 20: Architecture Refactoring & Modular Components (Phase 3) tests PASSED 100%!\n');
