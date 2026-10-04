/**
 * Test Step 94: Speaking Part 2 Pacing Bar (Thanh Căn Nhịp Độ 2 Phút Speaking Part 2)
 *
 * Kiểm tra:
 * 1. PACING_PHASES cấu hình chuẩn 4 chặng Cambridge Golden Roadmap (0-30s, 30-75s, 75-105s, 105-120s).
 * 2. getActivePacingPhase(seconds) xác định đúng từng chặng.
 * 3. getFluencySafeZone(seconds) xác định chính xác các mốc an toàn Fluency (danger, warning, safe, mastery, over).
 * 4. Tệp component SpeakingPacingBar.jsx tồn tại và xuất các hàm trợ giúp chuẩn.
 * 5. Tích hợp trong SpeakingPracticePane.jsx.
 * 6. Tích hợp trong SpeakingExaminerRoom.jsx.
 * 7. Đăng ký tính năng feat-speaking-pacing-bar trong featureRegistry.js.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  PACING_PHASES, 
  getActivePacingPhase, 
  getFluencySafeZone 
} from '../src/services/speakingFluencyService.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function runStep94Tests() {
  console.log('\n--- BẮT ĐẦU TEST STEP 94: SPEAKING PART 2 PACING BAR ---');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // 1. Kiểm tra tồn tại file SpeakingPacingBar.jsx
  const pacingBarPath = path.join(rootDir, 'src', 'components', 'speaking', 'SpeakingPacingBar.jsx');
  assert(fs.existsSync(pacingBarPath), 'Tệp SpeakingPacingBar.jsx tồn tại');

  // 2. Kiểm tra PACING_PHASES
  assert(Array.isArray(PACING_PHASES) && PACING_PHASES.length === 4, 'PACING_PHASES có đúng 4 chặng thời gian vàng');
  
  // 3. Kiểm tra các mốc thời gian vàng trong PACING_PHASES
  const phase1 = PACING_PHASES.find(p => p.id === 'context');
  const phase2 = PACING_PHASES.find(p => p.id === 'narrative');
  const phase3 = PACING_PHASES.find(p => p.id === 'climax');
  const phase4 = PACING_PHASES.find(p => p.id === 'reflection');

  assert(phase1 && phase1.start === 0 && phase1.end === 30, 'Chặng 1: Bối cảnh (0-30s)');
  assert(phase2 && phase2.start === 30 && phase2.end === 75, 'Chặng 2: Diễn biến cốt lõi (30-75s)');
  assert(phase3 && phase3.start === 75 && phase3.end === 105, 'Chặng 3: Cao trào & Bước ngoặt (75-105s)');
  assert(phase4 && phase4.start === 105 && phase4.end === 120, 'Chặng 4: Bài học & Đúc kết (105-120s)');

  // 4. Kiểm tra hàm getActivePacingPhase
  assert(getActivePacingPhase(10).id === 'context', '10s -> Chặng 1 (context)');
  assert(getActivePacingPhase(45).id === 'narrative', '45s -> Chặng 2 (narrative)');
  assert(getActivePacingPhase(90).id === 'climax', '90s -> Chặng 3 (climax)');
  assert(getActivePacingPhase(115).id === 'reflection', '115s -> Chặng 4 (reflection)');
  assert(getActivePacingPhase(125).id === 'reflection', '125s (vượt ngưỡng) -> Chặng 4 (reflection)');

  // 5. Kiểm tra hàm getFluencySafeZone
  assert(getFluencySafeZone(20).isUnderDanger === true, '20s nằm trong vùng nguy cơ non giờ nghiêm trọng (danger)');
  assert(getFluencySafeZone(65).isUnderDanger === false && getFluencySafeZone(65).isSafe === false, '65s nằm trong vùng cảnh báo tiến gần an toàn (warning)');
  assert(getFluencySafeZone(80).isSafe === true, '80s đã qua mốc 1:15 (75s) - an toàn không bị trừ Fluency');
  assert(getFluencySafeZone(110).isSafe === true, '110s nằm trong vùng xuất sắc (105s-120s)');
  assert(getFluencySafeZone(122).isOver === true, '122s đã hết 2:00 (over)');

  // 6. Kiểm tra tích hợp trong SpeakingPracticePane.jsx hoặc subroom SpeakingPart2Room.jsx
  const practicePanePath = path.join(rootDir, 'src', 'components', 'speaking', 'SpeakingPracticePane.jsx');
  const practicePaneContent = fs.readFileSync(practicePanePath, 'utf8');
  const part2RoomPath = path.join(rootDir, 'src', 'components', 'speaking', 'subrooms', 'SpeakingPart2Room.jsx');
  const part2RoomContent = fs.existsSync(part2RoomPath) ? fs.readFileSync(part2RoomPath, 'utf8') : '';
  
  const hasPracticeIntegration = (practicePaneContent.includes('SpeakingPacingBar') && practicePaneContent.includes('<SpeakingPacingBar')) ||
                                 (practicePaneContent.includes('SpeakingPart2Room') && part2RoomContent.includes('<SpeakingPacingBar'));
  assert(hasPracticeIntegration, 'Speaking Practice (SpeakingPracticePane / SpeakingPart2Room) tích hợp SpeakingPacingBar');

  // 7. Kiểm tra tích hợp trong SpeakingExaminerRoom.jsx
  const examinerRoomPath = path.join(rootDir, 'src', 'components', 'speaking', 'SpeakingExaminerRoom.jsx');
  const examinerRoomContent = fs.readFileSync(examinerRoomPath, 'utf8');
  assert(examinerRoomContent.includes('SpeakingPacingBar'), 'SpeakingExaminerRoom.jsx đã import SpeakingPacingBar');
  assert(examinerRoomContent.includes('<SpeakingPacingBar'), 'SpeakingExaminerRoom.jsx render component SpeakingPacingBar trong Part 2');

  // 8. Kiểm tra đăng ký featureRegistry.js
  const feat = getFeatureById('feat-speaking-pacing-bar');
  assert(feat && feat.title.includes('Thanh Căn Nhịp Độ 2 Phút'), 'featureRegistry.js đã khai báo feat-speaking-pacing-bar chuẩn xác');

  console.log(`\nKết quả Step 94: ${passed}/${total} assertions PASSED`);
  return { passed, total };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runStep94Tests().then(({ passed, total }) => {
    if (passed !== total) process.exit(1);
  });
}
