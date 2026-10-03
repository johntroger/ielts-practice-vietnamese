/**
 * Test Step 61: Speaking Mock Room ReferenceError Fix (Bước 1)
 * 
 * Verifies:
 * 1. SpeakingExaminerRoom.jsx does NOT contain any undefined variable references to 'stageTimerSeconds'.
 * 2. SpeakingExaminerRoom.jsx declares turnDurationSec state and turnStartTimeRef.
 * 3. SpeakingExaminerRoom.jsx computes elapsed speaking duration on mic toggle.
 * 4. SpeakingFillerTracker receives durationSec dynamically (part2SpeakSeconds in Part 2 or turnDurationSec in Part 1/3).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 61: Speaking Mock Room Error Fix Test Suite...');

// 1. Verify SpeakingExaminerRoom.jsx implementation
const examinerRoomFile = path.resolve(__dirname, '../src/components/speaking/SpeakingExaminerRoom.jsx');
assert(fs.existsSync(examinerRoomFile), 'SpeakingExaminerRoom.jsx must exist');
const examinerCode = fs.readFileSync(examinerRoomFile, 'utf8');

// 1.1 Verify no undefined stageTimerSeconds exists
assert(
  !examinerCode.includes('stageTimerSeconds'),
  'SpeakingExaminerRoom must NOT reference undefined variable "stageTimerSeconds"'
);
console.log('  ✅ 1. Undefined variable stageTimerSeconds completely eliminated');

// 1.2 Verify turnDurationSec and turnStartTimeRef declaration
assert(
  examinerCode.includes('const [turnDurationSec, setTurnDurationSec] = useState('),
  'SpeakingExaminerRoom must declare turnDurationSec state'
);
assert(
  examinerCode.includes('const turnStartTimeRef = useRef('),
  'SpeakingExaminerRoom must declare turnStartTimeRef'
);
console.log('  ✅ 2. turnDurationSec state and turnStartTimeRef declared');

// 1.3 Verify elapsed speaking time calculation in handleToggleMic
assert(
  examinerCode.includes('turnStartTimeRef.current') && examinerCode.includes('setTurnDurationSec('),
  'SpeakingExaminerRoom must track speaking duration on mic toggle'
);
console.log('  ✅ 3. Speaking duration calculated dynamically upon mic toggling');

// 1.4 Verify SpeakingFillerTracker durationSec prop passing
assert(
  examinerCode.includes('<SpeakingFillerTracker') && 
  examinerCode.includes("durationSec={currentStage === 'part2_speak' ? (part2SpeakSeconds || 60) : (turnDurationSec || 30)}"),
  'SpeakingFillerTracker must receive safe durationSec prop depending on currentStage'
);
console.log('  ✅ 4. SpeakingFillerTracker receives safe and accurate durationSec');

console.log('🎉 Step 61: All tests passed successfully!');
