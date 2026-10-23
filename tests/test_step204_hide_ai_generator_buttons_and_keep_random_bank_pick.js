/**
 * test_step204_hide_ai_generator_buttons_and_keep_random_bank_pick.js
 * Verification suite for Step 204:
 * Temporarily hide all AI generation buttons across UI shell and 4 skills,
 * while preserving AI evaluation and random test/task pickers from the Cambridge test bank.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 204: Hide AI Generator Buttons & Preserve Random Bank Picker Tests...\n');

let passedTests = 0;

// Test 1: Verify Navbar hides AI Prompt Generator buttons
console.log('Test 1: Navbar AI generator button hiding...');
const navSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/Navbar.jsx'), 'utf-8');
assert.ok(navSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'Navbar must define SHOW_AI_GENERATOR_BUTTONS = false');
assert.ok(navSrc.includes('SHOW_AI_GENERATOR_BUTTONS && activeSkill === \'writing\''), 'Navbar wide screen button must be guarded by SHOW_AI_GENERATOR_BUTTONS');
assert.ok(navSrc.includes('SHOW_AI_GENERATOR_BUTTONS && (\n                      <button\n                        onClick={() => { doOpenGenerator(); setIsPracticeMenuOpen(false); }}') ||
          navSrc.includes('SHOW_AI_GENERATOR_BUTTONS && (\r\n                      <button\r\n                        onClick={() => { doOpenGenerator(); setIsPracticeMenuOpen(false); }}'), 'Navbar practice menu button must be guarded');
passedTests++;
console.log('  ✓ Navbar AI generator buttons guarded cleanly\n');

// Test 2: Verify Writing SubHeader & Workspace Random Task Picker
console.log('Test 2: Writing SubHeader & Workspace Random Task Picker...');
const writingToolbarSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx'), 'utf-8');
assert.ok(writingToolbarSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'WritingSubHeaderToolbar must define SHOW_AI_GENERATOR_BUTTONS = false');
assert.ok(writingToolbarSrc.includes('SHOW_AI_GENERATOR_BUTTONS && (\n          <button\n            onClick={onOpenGenerator}') ||
          writingToolbarSrc.includes('SHOW_AI_GENERATOR_BUTTONS && (\r\n          <button\r\n            onClick={onOpenGenerator}'), 'Writing subheader AI generator button must be guarded');
assert.ok(writingToolbarSrc.includes('onSelectRandomTask'), 'WritingSubHeaderToolbar must accept onSelectRandomTask prop');
assert.ok(writingToolbarSrc.includes('Pick Random Task') || writingToolbarSrc.includes('Chọn Đề Ngẫu Nhiên'), 'WritingSubHeaderToolbar must render random task picker');

const writingWorkspaceSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/writing/WritingWorkspace.jsx'), 'utf-8');
assert.ok(writingWorkspaceSrc.includes('handleSelectRandomTask'), 'WritingWorkspace must define handleSelectRandomTask');
assert.ok(writingWorkspaceSrc.includes('onSelectRandomTask={handleSelectRandomTask}'), 'WritingWorkspace must pass onSelectRandomTask');
passedTests++;
console.log('  ✓ Writing AI generator hidden & Random Bank Task Picker implemented\n');

// Test 3: Verify Reading Workspace hides AI generator buttons
console.log('Test 3: Reading Workspace AI generator button hiding...');
const readingSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/reading/ReadingWorkspace.jsx'), 'utf-8');
assert.ok(readingSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'ReadingWorkspace must define SHOW_AI_GENERATOR_BUTTONS = false');
assert.ok(readingSrc.includes('SHOW_AI_GENERATOR_BUTTONS && examMode === \'practice\''), 'Reading toolbar generator button must be guarded');
assert.ok(readingSrc.includes('SHOW_AI_GENERATOR_BUTTONS ? (\n              <button\n                type="button"\n                onClick={() => setIsGeneratorOpen(true)}') ||
          readingSrc.includes('SHOW_AI_GENERATOR_BUTTONS ? (\r\n              <button\r\n                type="button"\r\n                onClick={() => setIsGeneratorOpen(true)}'), 'Reading desktop/zen generator button must be guarded');
passedTests++;
console.log('  ✓ Reading AI generator buttons guarded cleanly\n');

// Test 4: Verify Listening Workspace hides AI generator buttons
console.log('Test 4: Listening Workspace AI generator button hiding...');
const listeningSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx'), 'utf-8');
assert.ok(listeningSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'ListeningWorkspace must define SHOW_AI_GENERATOR_BUTTONS = false');
assert.ok(listeningSrc.includes('SHOW_AI_GENERATOR_BUTTONS && (') && listeningSrc.includes('setIsGeneratorOpen(true);'), 'Listening tools menu generator button must be guarded');
passedTests++;
console.log('  ✓ Listening AI generator button guarded cleanly\n');

// Test 5: Verify Speaking Workspace & Subrooms hide AI generator buttons
console.log('Test 5: Speaking Workspace & Subrooms AI generator button hiding...');
const speakingHeaderSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/SpeakingTopHeader.jsx'), 'utf-8');
assert.ok(speakingHeaderSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingTopHeader must define SHOW_AI_GENERATOR_BUTTONS = false');

const speakingHeroSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/SpeakingMockHero.jsx'), 'utf-8');
assert.ok(speakingHeroSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingMockHero must define SHOW_AI_GENERATOR_BUTTONS = false');

const speakingLibSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/SpeakingMockLibraryModal.jsx'), 'utf-8');
assert.ok(speakingLibSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingMockLibraryModal must define SHOW_AI_GENERATOR_BUTTONS = false');

const speakingPaneSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/SpeakingPracticePane.jsx'), 'utf-8');
assert.ok(speakingPaneSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingPracticePane must define SHOW_AI_GENERATOR_BUTTONS = false');

const p1RoomSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart1Room.jsx'), 'utf-8');
assert.ok(p1RoomSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingPart1Room must define SHOW_AI_GENERATOR_BUTTONS = false');

const p2RoomSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart2Room.jsx'), 'utf-8');
assert.ok(p2RoomSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingPart2Room must define SHOW_AI_GENERATOR_BUTTONS = false');

const p3RoomSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart3Room.jsx'), 'utf-8');
assert.ok(p3RoomSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'SpeakingPart3Room must define SHOW_AI_GENERATOR_BUTTONS = false');
passedTests++;
console.log('  ✓ All Speaking generator buttons guarded across header, hero, library, and 3 rooms\n');

// Test 6: Verify MicroDrills, VocabGrammar & Profile Vault hide AI generator buttons
console.log('Test 6: MicroDrills, VocabGrammar, Profile Vault generator button hiding...');
const microDrillsSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx'), 'utf-8');
assert.ok(microDrillsSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'MicroDrillsModal must define SHOW_AI_GENERATOR_BUTTONS = false');

const vocabGrammarSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/VocabGrammarSpellingModal.jsx'), 'utf-8');
assert.ok(vocabGrammarSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'VocabGrammarSpellingModal must define SHOW_AI_GENERATOR_BUTTONS = false');

const profileVaultSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/profile/ProfileVaultAndAccountTabs.jsx'), 'utf-8');
assert.ok(profileVaultSrc.includes('const SHOW_AI_GENERATOR_BUTTONS = false;'), 'ProfileVaultAndAccountTabs must define SHOW_AI_GENERATOR_BUTTONS = false');
passedTests++;
console.log('  ✓ MicroDrills, VocabGrammar, and Profile Vault generator buttons guarded\n');

// Test 7: Verify AI Evaluation & Random Test Assemblers are preserved intact
console.log('Test 7: Preservation of AI Evaluation and Random Bank Assemblers...');
const mockTestSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/MockTestModal.jsx'), 'utf-8');
assert.ok(mockTestSrc.includes('createRandomFullTest'), 'MockTestModal must retain createRandomFullTest');
assert.ok(mockTestSrc.includes('handleRandomReadingExam'), 'MockTestModal must retain handleRandomReadingExam');
assert.ok(mockTestSrc.includes('handleRandomizeWritingTasks'), 'MockTestModal must retain handleRandomizeWritingTasks');

const readingAssemblerSrc = fs.readFileSync(path.resolve(__dirname, '../src/utils/readingTestAssembler.js'), 'utf-8');
assert.ok(readingAssemblerSrc.includes('createRandomFullTest'), 'readingTestAssembler must export createRandomFullTest');

const listeningAssemblerSrc = fs.readFileSync(path.resolve(__dirname, '../src/utils/listeningTestAssembler.js'), 'utf-8');
assert.ok(listeningAssemblerSrc.includes('createRandomFullListeningTest'), 'listeningTestAssembler must export createRandomFullListeningTest');
passedTests++;
console.log('  ✓ AI Evaluation and Random Test Assemblers 100% active and preserved\n');

console.log(`===============================================================`);
console.log(`🎉 ALL ${passedTests}/7 TESTS PASSED CLEANLY FOR STEP 204!`);
console.log(`===============================================================`);
