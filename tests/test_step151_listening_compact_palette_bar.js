import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("▶ Running: Step 151: Listening Compact Palette Bar & Viewport Optimization Audit ...");

const paletteBarPath = path.resolve('src/components/listening/ListeningPaletteBar.jsx');
const questionPanePath = path.resolve('src/components/listening/ListeningQuestionPane.jsx');
const workspacePath = path.resolve('src/components/listening/ListeningWorkspace.jsx');

const paletteCode = fs.readFileSync(paletteBarPath, 'utf8');
const questionPaneCode = fs.readFileSync(questionPanePath, 'utf8');
const workspaceCode = fs.readFileSync(workspacePath, 'utf8');

// 1. Verify single-row layout on sm and up
assert(paletteCode.includes('hidden sm:flex items-center justify-between gap-2.5'), 'PaletteBar must use a single-row flex layout on sm: and up');
assert(paletteCode.includes('py-1.5 sm:py-2'), 'PaletteBar must use compact vertical padding (py-1.5 sm:py-2)');

// 2. Verify compact question pills
assert(paletteCode.includes('min-w-[26px] h-6 sm:h-6.5'), 'Question pills must be compact (min-w-[26px] h-6 sm:h-6.5)');
assert(paletteCode.includes('no-scrollbar') || paletteCode.includes('scrollbar-none'), 'Question strip must conceal bulky scrollbars');

// 3. Verify mobile layout
assert(paletteCode.includes('sm:hidden flex flex-col gap-1.5'), 'PaletteBar must provide a streamlined 2-tier micro-strip on mobile');

// 4. Verify question pane bottom padding reduced from pb-28 (112px) to pb-16 (64px)
assert(questionPaneCode.includes('pb-16'), 'ListeningQuestionPane must use pb-16 instead of pb-28');
assert(!questionPaneCode.includes('pb-28'), 'ListeningQuestionPane must no longer have pb-28');

// 5. Verify workspace wiring
assert(workspaceCode.includes('handleSelectPart(pNum)'), 'ListeningWorkspace must synchronize audio and question on part selection in footer');

// 6. Verify all key controls exist
assert(paletteCode.includes('Review') || paletteCode.includes('Xem lại'), 'Must have Review toggle');
assert(paletteCode.includes('Previous'), 'Must have Previous navigation');
assert(paletteCode.includes('Next'), 'Must have Next navigation');
assert(paletteCode.includes('Submit') || paletteCode.includes('Nộp'), 'Must have Submit button');

console.log("✅ PASSED: Step 151 Listening Compact Palette Bar Verified Cleanly!");
