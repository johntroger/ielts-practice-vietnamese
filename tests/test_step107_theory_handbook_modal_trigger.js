import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { openModal, closeModal, getModalState } from '../src/core/modalStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Test Step 107: Theory Handbook Modal Trigger & Wiring Verification...');

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

// 1. Verify App.jsx doesn't have dangling setIsTheoryOpen / setIsSettingsOpen
it('App.jsx has no dangling setIsTheoryOpen or setIsSettingsOpen calls', () => {
  const appPath = path.resolve(__dirname, '../src/App.jsx');
  const appCode = fs.readFileSync(appPath, 'utf-8');

  assert.strictEqual(
    appCode.includes('setIsTheoryOpen'),
    false,
    'App.jsx must not contain undefined setIsTheoryOpen'
  );
  assert.strictEqual(
    appCode.includes('setIsSettingsOpen'),
    false,
    'App.jsx must not contain undefined setIsSettingsOpen'
  );
});

// 2. Verify ReadingWorkspace in App.jsx connects onOpenTheory to openModal('theory')
it('App.jsx passes openModal("theory") with reading skill to ReadingWorkspace', () => {
  const appPath = path.resolve(__dirname, '../src/App.jsx');
  const appCode = fs.readFileSync(appPath, 'utf-8');

  const readingWorkspaceSection = appCode.slice(
    appCode.indexOf('<ReadingWorkspace'),
    appCode.indexOf('/>', appCode.indexOf('<ReadingWorkspace'))
  );

  assert.ok(
    readingWorkspaceSection.includes("openModal('theory'") || readingWorkspaceSection.includes('openModal("theory"'),
    'ReadingWorkspace must receive onOpenTheory hooked up to openModal("theory")'
  );
  assert.ok(
    readingWorkspaceSection.includes("'reading'") || readingWorkspaceSection.includes('"reading"'),
    'ReadingWorkspace onOpenTheory must include reading skill context'
  );
  assert.ok(
    readingWorkspaceSection.includes("openModal('settings'") || readingWorkspaceSection.includes('openModal("settings"'),
    'ReadingWorkspace must receive onOpenSettings hooked up to openModal("settings")'
  );
});

// 3. Verify modalStore can store theory payload with skill: 'reading'
it('modalStore opens theory modal with reading skill payload', () => {
  closeModal('theory');
  assert.strictEqual(getModalState().theory, false);

  openModal('theory', { skill: 'reading' });
  const theoryState = getModalState().theory;
  assert.ok(theoryState, 'theory modal should be open');
  assert.strictEqual(typeof theoryState, 'object');
  assert.strictEqual(theoryState.skill, 'reading');

  closeModal('theory');
  assert.strictEqual(getModalState().theory, false);
});

// 4. Verify ReadingWorkspace.jsx has onOpenTheory buttons in desktop and mobile tools menus
it('ReadingWorkspace.jsx triggers onOpenTheory in desktop and mobile Tools dropdowns', () => {
  const rwPath = path.resolve(__dirname, '../src/components/reading/ReadingWorkspace.jsx');
  const rwCode = fs.readFileSync(rwPath, 'utf-8');

  const theoryCalls = rwCode.match(/onOpenTheory\(\)/g) || [];
  assert.ok(theoryCalls.length >= 2, 'ReadingWorkspace must call onOpenTheory() in both desktop and mobile dropdowns');
});

// 5. Verify AppModalHost.jsx feeds theory payload into TheoryHandbookModal
it('AppModalHost.jsx forwards modals.theory payload into TheoryHandbookModal props', () => {
  const hostPath = path.resolve(__dirname, '../src/components/modals/AppModalHost.jsx');
  const hostCode = fs.readFileSync(hostPath, 'utf-8');

  assert.ok(hostCode.includes('<TheoryHandbookModal'));
  assert.ok(hostCode.includes('activeSkill={typeof modals.theory === \'object\' && modals.theory?.skill ? modals.theory.skill : activeSkill}'));
  assert.ok(hostCode.includes('initialCategory={typeof modals.theory === \'object\' && modals.theory?.category ? modals.theory.category : \'all\'}'));
});

console.log(`\nResults: ${passed}/${total} assertions passed.`);
if (passed !== total) {
  process.exit(1);
}
