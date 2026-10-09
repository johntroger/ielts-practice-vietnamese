import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Test Step 109: React Hook Order & Mock Test Modal Integrity Verification...');

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

// 1. Verify MockTestModal has if (!isOpen) return null at the very top before any hooks
it('MockTestModal places if (!isOpen) return null before any hooks', () => {
  const modalPath = path.resolve(__dirname, '../src/components/MockTestModal.jsx');
  const code = fs.readFileSync(modalPath, 'utf-8');

  const returnIdx = code.indexOf('if (!isOpen) return null;');
  const translationIdx = code.indexOf('useTranslation()');

  assert.ok(returnIdx > 0, 'MockTestModal must check if (!isOpen) return null');
  assert.ok(returnIdx < translationIdx, 'if (!isOpen) return null must be placed BEFORE useTranslation()');
});

// 2. Verify AppModalHost mounts MockTestModal conditionally
it('AppModalHost conditionally mounts MockTestModal with Boolean(modals.mockTest)', () => {
  const hostPath = path.resolve(__dirname, '../src/components/modals/AppModalHost.jsx');
  const code = fs.readFileSync(hostPath, 'utf-8');

  assert.ok(
    code.includes('{Boolean(modals.mockTest) && (') || code.includes('modals.mockTest && ('),
    'AppModalHost must mount MockTestModal conditionally when modals.mockTest is open'
  );
});

// 3. Scan all components in src/ for hook order violations
it('No component has hooks called before if (!isOpen) return null while other hooks exist after', () => {
  function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const returnIdx = lines.findIndex(l => {
      return (l.startsWith('  if (!isOpen) return null') || l.startsWith('  if (!isOpen) return null;')) &&
        !l.includes('useMemo') && !l.includes('useEffect');
    });
    if (returnIdx === -1) return;

    const beforeHooks = lines.slice(0, returnIdx).filter(l => /use[A-Z]\w+\(/.test(l));
    const afterHooks = lines.slice(returnIdx + 1).filter(l => /use[A-Z]\w+\(/.test(l));

    assert.strictEqual(
      beforeHooks.length > 0 && afterHooks.length > 0,
      false,
      `Component ${filePath} violates Rules of Hooks: has hooks split across early return: before=[${beforeHooks.join(', ')}] after=[${afterHooks.join(', ')}]`
    );
  }

  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (full.endsWith('.jsx')) checkFile(full);
    }
  }

  walk(path.resolve(__dirname, '../src/components'));
});

console.log(`\nResults: ${passed}/${total} assertions passed.`);
if (passed !== total) {
  process.exit(1);
}
