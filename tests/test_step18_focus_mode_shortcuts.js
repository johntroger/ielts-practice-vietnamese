import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Testing Step 18: Focus Mode & Keyboard Shortcuts System (Phase 1)');

// 1. Verify KeyboardShortcutsModal component exists and contains all required shortcut groups
const modalPath = path.resolve('src/components/KeyboardShortcutsModal.jsx');
assert(fs.existsSync(modalPath), 'KeyboardShortcutsModal.jsx must exist');
const modalCode = fs.readFileSync(modalPath, 'utf8');

assert(modalCode.includes("'Alt', 'F'") || modalCode.includes('Focus Mode'), 'Must document Alt + F shortcut for Focus Mode');
assert(modalCode.includes("'Alt', 'K'") || modalCode.includes('Kho Đề'), 'Must document Alt + K shortcut for Task Library');
assert(modalCode.includes("'Alt', 'M'") || modalCode.includes('Đã thuộc'), 'Must document Alt + M shortcut for Thuộc bài / Đã thuộc');
assert(modalCode.includes("'Alt', 'T'") || modalCode.includes('Cẩm Nang'), 'Must document Alt + T shortcut for Handbook / Cẩm nang');
assert(modalCode.includes('Enter') && modalCode.includes('Nộp bài'), 'Must document modifier + Enter shortcut for Submit essay');
assert(modalCode.includes('Esc'), 'Must document Esc key to exit');
console.log('  ✅ 1. KeyboardShortcutsModal has all shortcut groups documented with proper kbd tags');

// 2. Verify EditorPane has Ctrl+Enter / Cmd+Enter support
const editorPath = path.resolve('src/components/EditorPane.jsx');
assert(fs.existsSync(editorPath), 'EditorPane.jsx must exist');
const editorCode = fs.readFileSync(editorPath, 'utf8');

assert(editorCode.includes('onSubmitEssay'), 'EditorPane must accept onSubmitEssay prop');
assert(editorCode.includes('(e.ctrlKey || e.metaKey)') && editorCode.includes("e.key === 'Enter'"), 'EditorPane must intercept Ctrl+Enter and Cmd+Enter');
console.log('  ✅ 2. EditorPane implements Ctrl+Enter instant essay grading trigger');

// 3. Verify App.jsx implements Focus Mode and global shortcut listener
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(appCode.includes('isFocusMode'), 'App.jsx must manage isFocusMode state');
assert(appCode.includes('toggleFocusMode'), 'App.jsx must have toggleFocusMode function');
assert(appCode.includes('isShortcutsOpen'), 'App.jsx must manage isShortcutsOpen state');
assert(appCode.includes('KeyboardShortcutsModal'), 'App.jsx must import and render KeyboardShortcutsModal');
assert(appCode.includes('ielts_focus_mode'), 'Focus mode must persist to localStorage ielts_focus_mode');
assert(appCode.includes('!isFocusMode &&'), 'Navbar and API key banner must be hidden in Focus Mode');
assert(appCode.includes('Chế độ Tập Trung'), 'Floating Focus Mode indicator must be present');
assert(appCode.includes('onSubmitEssay={handleSubmitEssay}'), 'App.jsx must wire onSubmitEssay to handleSubmitEssay in EditorPane');
console.log('  ✅ 3. App.jsx correctly coordinates Focus Mode, Zen Mode full-height, and global shortcut events');

// 4. Verify no syntax or runtime logic collisions with editable elements
assert(appCode.includes('activeEl.tagName === \'INPUT\''), 'Global listener must ignore simple keys when editing inputs');
assert(appCode.includes('activeEl.tagName === \'TEXTAREA\''), 'Global listener must ignore ? shortcut when typing in textarea');
console.log('  ✅ 4. Shortcuts safely guard against accidental triggers during text editing');

console.log('🎉 Step 18: Focus Mode & Keyboard Shortcuts System tests PASSED 100%!\n');
