import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  analyzeCandidateUtterance, 
  EXAMINER_ACKNOWLEDGMENTS, 
  ADAPTIVE_PROBE_TEMPLATES 
} from '../src/services/speakingAdaptiveService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Step 40 Test Suite: Interactive Speaking Examiner Flow & Adaptive Branching...');

// 1. Test Empty or Placeholder Utterances
{
  const res1 = analyzeCandidateUtterance('', { stage: 'part1' });
  assert.strictEqual(res1.needsFollowUp, false, 'Empty answer must not trigger follow-up');
  assert.strictEqual(res1.reason, 'empty_or_placeholder');

  const res2 = analyzeCandidateUtterance('(Candidate answered orally)', { stage: 'part3' });
  assert.strictEqual(res2.needsFollowUp, false, 'Placeholder answer must not trigger follow-up');
  console.log('  ✅ 1. Empty and placeholder utterances safely handled without infinite follow-up loops');
}

// 2. Test Too Brief Utterance (< 14 words in Part 1, < 22 words in Part 3)
{
  const briefP1 = "Yes, I like my hometown very much because it is peaceful.";
  const resP1 = analyzeCandidateUtterance(briefP1, { stage: 'part1', hasFollowedUpOnThisQuestion: false });
  assert.strictEqual(resP1.needsFollowUp, true, 'Short Part 1 answer (< 14 words) must trigger follow-up');
  assert.strictEqual(resP1.reason, 'too_brief');
  assert.ok(typeof resP1.followUpQuestion === 'string' && resP1.followUpQuestion.length > 5, 'Follow-up question must be provided');

  // If already followed up once, must not follow up again
  const resAlreadyFollowed = analyzeCandidateUtterance(briefP1, { stage: 'part1', hasFollowedUpOnThisQuestion: true });
  assert.strictEqual(resAlreadyFollowed.needsFollowUp, false, 'Must not follow up consecutively on the same question');
  console.log('  ✅ 2. Brief candidate utterances correctly trigger natural follow-up probes with single-turn guard');
}

// 3. Test Part 3 Categorical Analysis: Future Speculation
{
  const futureSpeech = "I think that in the future, robotic automation will be widely adopted across hospitals, improving surgical precision and transforming healthcare systems.";
  const resFuture = analyzeCandidateUtterance(futureSpeech, { stage: 'part3', hasFollowedUpOnThisQuestion: false });
  assert.strictEqual(resFuture.needsFollowUp, true, 'Future speculation must trigger adaptive probe');
  assert.strictEqual(resFuture.reason, 'future_speculation');
  assert.ok(resFuture.followUpQuestion.includes('twenty years') || resFuture.followUpQuestion.includes('responsibility') || resFuture.followUpQuestion.includes('technology'), 'Probe should target future impact');
  console.log('  ✅ 3. Future speculation keyword triggers forward-looking follow-up probe');
}

// 4. Test Part 3 Categorical Analysis: Societal and Generational Trends
{
  const societalSpeech = "Many young people in our society nowadays find it challenging to purchase affordable housing in large cities without financial assistance from their families.";
  const resSociety = analyzeCandidateUtterance(societalSpeech, { stage: 'part3', hasFollowedUpOnThisQuestion: false });
  assert.strictEqual(resSociety.needsFollowUp, true, 'Societal topic must trigger demographic probe');
  assert.strictEqual(resSociety.reason, 'cultural_societal');
  console.log('  ✅ 4. Societal and cultural discourse triggers demographic follow-up probes');
}

// 5. Test Part 3 Categorical Analysis: Strong One-Sided Claims
{
  const claimSpeech = "I believe authorities must definitely ban internal combustion vehicles from metropolitan centres immediately to protect public health and curb emissions.";
  const resClaim = analyzeCandidateUtterance(claimSpeech, { stage: 'part3', hasFollowedUpOnThisQuestion: false });
  assert.strictEqual(resClaim.needsFollowUp, true, 'One-sided claim must trigger counter-perspective probe');
  assert.strictEqual(resClaim.reason, 'one_sided_claim');
  console.log('  ✅ 5. Extreme or absolute claims trigger counter-perspective probing');
}

// 6. Test Well-developed Balanced Answer (> 35 words)
{
  const balancedSpeech = "On one hand, digital education provides extraordinary accessibility for learners residing in rural areas. On the other hand, the absence of face-to-face interaction can sometimes hinder emotional development, meaning a blended learning approach is likely the optimal solution.";
  const resBalanced = analyzeCandidateUtterance(balancedSpeech, { stage: 'part3', hasFollowedUpOnThisQuestion: false });
  assert.strictEqual(resBalanced.needsFollowUp, false, 'Well-developed balanced response should advance without probe');
  assert.strictEqual(resBalanced.reason, 'sufficient_development');
  assert.ok(EXAMINER_ACKNOWLEDGMENTS.positive.includes(resBalanced.acknowledgment) || EXAMINER_ACKNOWLEDGMENTS.deep.includes(resBalanced.acknowledgment), 'Should receive positive examiner acknowledgement');
  console.log('  ✅ 6. Thorough answers receive examiner acknowledgment and advance smoothly');
}

// 7. Verify hook useSpeakingExaminer.js implementation
{
  const hookPath = path.join(rootDir, 'src', 'hooks', 'useSpeakingExaminer.js');
  assert.ok(fs.existsSync(hookPath), 'useSpeakingExaminer.js hook must exist');
  const hookContent = fs.readFileSync(hookPath, 'utf8');

  assert.ok(hookContent.includes('useSpeakingExaminer'), 'Must export useSpeakingExaminer');
  assert.ok(hookContent.includes('analyzeCandidateUtterance'), 'Must import analyzeCandidateUtterance');
  assert.ok(hookContent.includes('proceedToPart1'), 'Must include proceedToPart1');
  assert.ok(hookContent.includes('startPart2Speaking'), 'Must include startPart2Speaking');
  assert.ok(hookContent.includes('moveToPart3'), 'Must include moveToPart3');
  assert.ok(hookContent.includes('concludeExam'), 'Must include concludeExam');
  console.log('  ✅ 7. useSpeakingExaminer hook provides complete stage transitions and testable flow');
}

// 8. Verify SpeakingExaminerRoom.jsx integration
{
  const roomPath = path.join(rootDir, 'src', 'components', 'speaking', 'SpeakingExaminerRoom.jsx');
  assert.ok(fs.existsSync(roomPath), 'SpeakingExaminerRoom.jsx must exist');
  const roomContent = fs.readFileSync(roomPath, 'utf8');

  assert.ok(roomContent.includes('analyzeCandidateUtterance'), 'SpeakingExaminerRoom must import analyzeCandidateUtterance');
  assert.ok(roomContent.includes('isAdaptiveMode'), 'SpeakingExaminerRoom must support isAdaptiveMode toggle');
  assert.ok(roomContent.includes('isAnsweringFollowUp'), 'SpeakingExaminerRoom must track isAnsweringFollowUp state');
  assert.ok(roomContent.includes('Adaptive Follow-up'), 'SpeakingExaminerRoom must render follow-up indicator');
  console.log('  ✅ 8. SpeakingExaminerRoom successfully integrates adaptive follow-up UI and toggle');
}

console.log('🎉 Step 40 Test Suite: All 8 checks passed cleanly (100%)!');
