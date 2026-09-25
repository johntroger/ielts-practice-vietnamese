import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 36: Distraction-Free Zen Typing Mode & Mobile Bottom Sheets ---');

// 1. EditorPane Zen Typing Mode
console.log('Test 1: Verifying EditorPane Zen Typing Mode & auto-dim auxiliary stats');
const editorPath = path.join(__dirname, '../src/components/EditorPane.jsx');
const editorSource = fs.readFileSync(editorPath, 'utf8');

assert(editorSource.includes('isActivelyTyping'), 'EditorPane must manage isActivelyTyping state');
assert(editorSource.includes('isToolbarHovered'), 'EditorPane must track isToolbarHovered');
assert(editorSource.includes('handleUserTyping'), 'EditorPane must define handleUserTyping timeout callback');
assert(editorSource.includes('opacity-35 hover:opacity-100'), 'Auxiliary metrics must auto-dim during active typing');
assert(editorSource.includes('transition-opacity duration-300'), 'Auto-dim metrics must use smooth transition');

// 2. CDIDisplayModal Mobile Bottom Sheet
console.log('Test 2: Verifying CDIDisplayModal mobile bottom sheet layout');
const cdiPath = path.join(__dirname, '../src/components/CDIDisplayModal.jsx');
const cdiSource = fs.readFileSync(cdiPath, 'utf8');

assert(cdiSource.includes('items-end sm:items-center'), 'CDIDisplayModal must use bottom sheet positioning on mobile');
assert(cdiSource.includes('rounded-t-3xl sm:rounded-3xl'), 'CDIDisplayModal must use rounded-t-3xl for bottom sheet');
assert(cdiSource.includes('w-12 h-1.5'), 'CDIDisplayModal must include mobile swipe grab handle');

// 3. KeyboardShortcutsModal Mobile Bottom Sheet
console.log('Test 3: Verifying KeyboardShortcutsModal mobile bottom sheet layout');
const shortcutsPath = path.join(__dirname, '../src/components/KeyboardShortcutsModal.jsx');
const shortcutsSource = fs.readFileSync(shortcutsPath, 'utf8');

assert(shortcutsSource.includes('items-end sm:items-center'), 'KeyboardShortcutsModal must use bottom sheet positioning on mobile');
assert(shortcutsSource.includes('rounded-t-3xl sm:rounded-3xl'), 'KeyboardShortcutsModal must use rounded-t-3xl for bottom sheet');
assert(shortcutsSource.includes('w-12 h-1.5'), 'KeyboardShortcutsModal must include mobile swipe grab handle');

// 4. MistakeLogModal Mobile Bottom Sheet
console.log('Test 4: Verifying MistakeLogModal mobile bottom sheet layout');
const mistakePath = path.join(__dirname, '../src/components/MistakeLogModal.jsx');
const mistakeSource = fs.readFileSync(mistakePath, 'utf8');

assert(mistakeSource.includes('items-end sm:items-center'), 'MistakeLogModal must use bottom sheet positioning on mobile');
assert(mistakeSource.includes('rounded-t-3xl sm:rounded-3xl'), 'MistakeLogModal must use rounded-t-3xl for bottom sheet');
assert(mistakeSource.includes('w-12 h-1.5'), 'MistakeLogModal must include mobile swipe grab handle');

// 5. VocabNotebookModal Mobile Bottom Sheet
console.log('Test 5: Verifying VocabNotebookModal mobile bottom sheet layout');
const vocabPath = path.join(__dirname, '../src/components/VocabNotebookModal.jsx');
const vocabSource = fs.readFileSync(vocabPath, 'utf8');

assert(vocabSource.includes('items-end sm:items-center'), 'VocabNotebookModal must use bottom sheet positioning on mobile');
assert(vocabSource.includes('rounded-t-3xl sm:rounded-3xl'), 'VocabNotebookModal must use rounded-t-3xl for bottom sheet');
assert(vocabSource.includes('w-12 h-1.5'), 'VocabNotebookModal must include mobile swipe grab handle');

console.log('Passed: 5/5 tests in Step 36');
console.log('✅ ALL TEST STEP 36 CHECKS PASSED SUCCESSFULLY!');
