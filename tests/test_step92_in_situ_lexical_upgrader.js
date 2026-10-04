import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { findLexicalUpgrades, ACADEMIC_THESAURUS } from '../src/data/academicThesaurus.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

/**
 * Test Suite Step 92: In-situ Lexical Upgrader Verification
 * 
 * Verifies:
 * 1. findLexicalUpgrades algorithm in academicThesaurus.js
 * 2. Morphological plural / form handling for query words
 * 3. InSituLexicalUpgrader.jsx component structure and functionality
 * 4. EditorPane.jsx seamless integration (selection listener, 1-click replace, overused words badges)
 * 5. WritingWorkspace.jsx prop threading (onAddVocab)
 * 6. Feature Registry registration for feat-in-situ-lexical-upgrader
 */

console.log('🏛️ Testing Step 92: In-situ Lexical Upgrader (Cambridge LR Band 7.0 - 8.5+)...');

// 1. Verify findLexicalUpgrades exported and works for common words
console.log('  ▶ 1. Verifying findLexicalUpgrades dictionary lookups...');
assert.strictEqual(typeof findLexicalUpgrades, 'function', 'findLexicalUpgrades must be a function');

const upgradeImportant = findLexicalUpgrades('important');
assert.ok(upgradeImportant, 'Must return result for "important"');
assert.strictEqual(upgradeImportant.found, true, 'Should find upgrades for "important"');
assert.ok(upgradeImportant.suggestions.length >= 3, 'Should provide at least 3 suggestions for "important"');
assert.ok(upgradeImportant.suggestions.some(s => s.word === 'vital' || s.word === 'paramount' || s.word === 'pivotal'), 'Should include vital/paramount/pivotal');
assert.ok(upgradeImportant.suggestions[0].meaningVi, 'Suggestions must include Vietnamese meaning');
assert.ok(upgradeImportant.suggestions[0].example, 'Suggestions must include IELTS example sentence');
console.log(`    ✅ "important" lookup verified: ${upgradeImportant.suggestions.length} suggestions.`);

// 2. Verify lookups for newly added writing words: crime, police, money, etc.
console.log('  ▶ 2. Verifying lookups for IELTS essay core words (crime, problem, decrease)...');
const upgradeCrime = findLexicalUpgrades('crime');
assert.strictEqual(upgradeCrime.found, true, 'Should find upgrades for "crime"');
assert.ok(upgradeCrime.suggestions.some(s => s.word.toLowerCase().includes('offence') || s.word.toLowerCase().includes('delinquency') || s.word.toLowerCase().includes('transgression')));

const upgradeProblems = findLexicalUpgrades('problems'); // Test plural handling
assert.strictEqual(upgradeProblems.found, true, 'Should resolve plural "problems" to "problem"');
assert.ok(upgradeProblems.suggestions.length > 0);

const upgradeUnknown = findLexicalUpgrades('supercalifragilistic');
assert.strictEqual(upgradeUnknown.found, false, 'Unknown word should return found: false');
assert.strictEqual(upgradeUnknown.suggestions.length, 0, 'Unknown word should return empty suggestions');
console.log('    ✅ Morphological handling and safety verified.');

// 3. Verify InSituLexicalUpgrader.jsx component file
console.log('  ▶ 3. Verifying InSituLexicalUpgrader.jsx component structure...');
const upgraderFilePath = path.resolve('src/components/InSituLexicalUpgrader.jsx');
assert.ok(fs.existsSync(upgraderFilePath), 'InSituLexicalUpgrader.jsx must exist');
const upgraderContent = fs.readFileSync(upgraderFilePath, 'utf8');

assert.ok(upgraderContent.includes('findLexicalUpgrades'), 'Must import findLexicalUpgrades');
assert.ok(upgraderContent.includes('onReplaceText'), 'Must support onReplaceText prop');
assert.ok(upgraderContent.includes('onSaveToNotebook'), 'Must support onSaveToNotebook prop');
assert.ok(upgraderContent.includes('handleApplyReplacement'), 'Must implement handleApplyReplacement');
assert.ok(upgraderContent.includes('handleSaveNotebook'), 'Must implement handleSaveNotebook');
assert.ok(upgraderContent.includes('handleCopy'), 'Must implement handleCopy');
console.log('    ✅ InSituLexicalUpgrader component verified.');

// 4. Verify EditorPane.jsx integration
console.log('  ▶ 4. Verifying EditorPane.jsx integration...');
const editorPanePath = path.resolve('src/components/EditorPane.jsx');
assert.ok(fs.existsSync(editorPanePath), 'EditorPane.jsx must exist');
const editorContent = fs.readFileSync(editorPanePath, 'utf8');

assert.ok(editorContent.includes('InSituLexicalUpgrader'), 'EditorPane must import InSituLexicalUpgrader');
assert.ok(editorContent.includes('lexicalUpgrader'), 'EditorPane must manage lexicalUpgrader state');
assert.ok(editorContent.includes('handleTextareaSelection'), 'EditorPane must have handleTextareaSelection');
assert.ok(editorContent.includes('handleApplyLexicalReplacement'), 'EditorPane must have handleApplyLexicalReplacement');
assert.ok(editorContent.includes('handleOpenUpgraderForWord'), 'EditorPane must have handleOpenUpgraderForWord');
assert.ok(editorContent.includes('onSelect={handleTextareaSelection}'), 'Textarea must listen to onSelect');
assert.ok(editorContent.includes('ref={textareaRef}'), 'Textarea must have ref attached');
assert.ok(editorContent.includes('Nâng Cấp C1/C2'), 'Toolbar must include Nâng Cấp C1/C2 button');
console.log('    ✅ EditorPane.jsx integration verified.');

// 5. Verify WritingWorkspace.jsx passes onAddVocab to EditorPane
console.log('  ▶ 5. Verifying WritingWorkspace.jsx prop threading...');
const workspacePath = path.resolve('src/components/writing/WritingWorkspace.jsx');
assert.ok(fs.existsSync(workspacePath), 'WritingWorkspace.jsx must exist');
const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
assert.ok(workspaceContent.includes('onAddVocab={onAddVocab}'), 'WritingWorkspace must pass onAddVocab to EditorPane');
console.log('    ✅ WritingWorkspace prop threading verified.');

// 6. Verify Feature Registry registration
console.log('  ▶ 6. Verifying Feature Registry registration...');
const feature = getFeatureById('feat-in-situ-lexical-upgrader');
assert.ok(feature, 'feat-in-situ-lexical-upgrader must be registered in FEATURE_REGISTRY');
assert.strictEqual(feature.status, 'new', 'Feature should be marked as new');
assert.ok(feature.title.includes('Nâng Cấp Từ Vựng Ngữ Cảnh 1-Chạm'), 'Title must match feature name');
assert.ok(feature.highlights.length >= 3, 'Must have detailed highlights');
console.log(`    ✅ Feature registered: "${feature.title}" (ID: ${feature.id})`);

console.log('🎉 Step 92 Test Suite PASSED 100%! All lexical upgrader requirements met.');
