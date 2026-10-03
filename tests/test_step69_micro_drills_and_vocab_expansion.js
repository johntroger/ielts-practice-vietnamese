/**
 * Test Step 69: Workspace Expansion for MicroDrillsModal and VocabGrammarSpellingModal
 * 
 * Verifies:
 * 1. MicroDrillsModal.jsx implements isExpanded state, Alt+Z keyboard shortcut, and Maximize2/Minimize2 toggle button.
 * 2. MicroDrillsModal.jsx applies full-canvas classes (w-screen h-screen max-w-none rounded-none) when expanded.
 * 3. VocabGrammarSpellingModal.jsx implements isExpanded state, Alt+Z shortcut, and Maximize2/Minimize2 toggle button.
 * 4. VocabGrammarSpellingModal.jsx applies full-canvas classes when expanded.
 * 5. Both modals preserve expansion preference in localStorage.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 69: Micro-Drills and Vocab/Grammar Workspace Expansion Test Suite...');

// 1. Verify MicroDrillsModal.jsx
const microDrillsFile = path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx');
assert(fs.existsSync(microDrillsFile), 'MicroDrillsModal.jsx must exist');
const microDrillsCode = fs.readFileSync(microDrillsFile, 'utf8');

assert(
  microDrillsCode.includes('const [isExpanded, setIsExpanded] = useState('),
  'MicroDrillsModal must declare isExpanded state'
);
assert(
  microDrillsCode.includes('ielts_micro_drills_expanded'),
  'MicroDrillsModal must persist expansion state in localStorage'
);
assert(
  microDrillsCode.includes('e.altKey && (e.key === \'z\' || e.key === \'Z\')'),
  'MicroDrillsModal must support Alt+Z shortcut to toggle expansion'
);
assert(
  microDrillsCode.includes('isExpanded ? <Minimize2') && microDrillsCode.includes(': <Maximize2'),
  'MicroDrillsModal must render Minimize2/Maximize2 toggle button'
);
assert(
  microDrillsCode.includes('w-screen h-screen max-w-none max-h-none rounded-none'),
  'MicroDrillsModal must expand to edge-to-edge canvas when isExpanded is true'
);
console.log('  ✅ 1. MicroDrillsModal successfully implements edge-to-edge expansion and Alt+Z toggle');

// 2. Verify VocabGrammarSpellingModal.jsx
const vocabModalFile = path.resolve(__dirname, '../src/components/VocabGrammarSpellingModal.jsx');
assert(fs.existsSync(vocabModalFile), 'VocabGrammarSpellingModal.jsx must exist');
const vocabModalCode = fs.readFileSync(vocabModalFile, 'utf8');

assert(
  vocabModalCode.includes('const [isExpanded, setIsExpanded] = useState('),
  'VocabGrammarSpellingModal must declare isExpanded state'
);
assert(
  vocabModalCode.includes('ielts_vocab_grammar_expanded'),
  'VocabGrammarSpellingModal must persist expansion state in localStorage'
);
assert(
  vocabModalCode.includes('e.altKey && (e.key === \'z\' || e.key === \'Z\')'),
  'VocabGrammarSpellingModal must support Alt+Z shortcut to toggle expansion'
);
assert(
  vocabModalCode.includes('isExpanded ? <Minimize2') && vocabModalCode.includes(': <Maximize2'),
  'VocabGrammarSpellingModal must render Minimize2/Maximize2 toggle button'
);
assert(
  vocabModalCode.includes('w-screen h-screen max-w-none max-h-none rounded-none'),
  'VocabGrammarSpellingModal must expand to edge-to-edge canvas when isExpanded is true'
);
console.log('  ✅ 2. VocabGrammarSpellingModal successfully implements edge-to-edge expansion and Alt+Z toggle');

console.log('🎉 Step 69: Micro-drills and Vocab/Grammar expansion passed 100% cleanly!');
