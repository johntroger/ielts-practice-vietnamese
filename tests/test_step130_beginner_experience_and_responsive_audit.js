import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- Step 130: Beginner Foundation Experience & Cross-Device Responsive Display Audit ---');

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// 1. BeginnerGuideModal.jsx
it('BeginnerGuideModal.jsx exists and has zero-overwhelm 4-step roadmap', () => {
  const filePath = path.join(rootDir, 'src', 'components', 'BeginnerGuideModal.jsx');
  assert.ok(fs.existsSync(filePath), 'BeginnerGuideModal.jsx must exist');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('export default function BeginnerGuideModal'), 'Must export BeginnerGuideModal');
  assert.ok(content.includes('Atlas English Arena'), 'Must introduce Atlas Arena in step 1');
  assert.ok(content.includes('Micro-Drills Studio'), 'Must introduce Micro-Drills in step 2');
  assert.ok(content.includes('Band Placement Quiz') || content.includes('Định Vị Trình Độ'), 'Must introduce Diagnostic test in step 3');
  assert.ok(content.includes('Strategy Handbook') || content.includes('Cẩm Nang Chiến Thuật'), 'Must introduce Strategy Handbook in step 4');
  assert.ok(content.includes('PEEL Formula') || content.includes('PEEL'), 'Must decode PEEL in jargon tab');
  assert.ok(content.includes('5.0') && content.includes('5.5'), 'Must allow setting starter band 5.0 and 5.5');
});

// 2. modalStore.js registration
it('modalStore.js registers beginnerGuide in initial modal state', () => {
  const filePath = path.join(rootDir, 'src', 'core', 'modalStore.js');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('beginnerGuide: false'), 'Must have beginnerGuide flag in initial state');
});

// 3. AppModalHost.jsx wiring
it('AppModalHost.jsx lazy imports and renders BeginnerGuideModal', () => {
  const filePath = path.join(rootDir, 'src', 'components', 'modals', 'AppModalHost.jsx');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('const BeginnerGuideModal = React.lazy'), 'Must lazy import BeginnerGuideModal');
  assert.ok(content.includes('<BeginnerGuideModal'), 'Must render BeginnerGuideModal component');
  assert.ok(content.includes('modals.beginnerGuide'), 'Must check modals.beginnerGuide');
});

// 4. App.jsx viewport and banner
it('App.jsx clamps speaking workspace and renders beginner welcome banner', () => {
  const filePath = path.join(rootDir, 'src', 'App.jsx');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(
    content.includes("activeSkill === 'speaking'") && content.includes('h-[100dvh] overflow-hidden'),
    'Must include speaking in h-[100dvh] overflow-hidden viewport clamp'
  );
  assert.ok(content.includes('isBeginnerBannerDismissed'), 'Must manage isBeginnerBannerDismissed state');
  assert.ok(content.includes("openModal('beginnerGuide')"), 'Must trigger beginnerGuide modal');
});

// 5. Navbar.jsx desktop and mobile access
it('Navbar.jsx includes beginner guide trigger on top bar and mobile drawer', () => {
  const filePath = path.join(rootDir, 'src', 'components', 'Navbar.jsx');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes("openModal('beginnerGuide')"), 'Must trigger openModal beginnerGuide in Navbar');
  assert.ok(content.includes('🌱'), 'Must include friendly sprout icon');
  assert.ok(content.includes('New to IELTS? Start Here') || content.includes('Chưa Có Nền Tảng? Bắt Đầu Từ Đây'), 'Must have drawer beginner card');
});

// 6. recommendationService.js beginner rule
it('recommendationService.js prioritizes beginner foundation recommendation for new users', async () => {
  const { getSmartDailyRecommendations } = await import('../src/services/recommendationService.js');
  const recs = getSmartDailyRecommendations({
    submissions: [],
    mistakes: [],
    vocabList: [],
    targetBand: '6.5',
    allTasks: [],
    isEn: false
  });
  const beginnerRec = recs.find(r => r.id === 'rec-beginner-foundation');
  assert.ok(beginnerRec, 'Must generate rec-beginner-foundation for new user with 0 submissions');
  assert.strictEqual(beginnerRec.actionPayload, 'beginnerGuide', 'Must open beginnerGuide modal');
});

// 7. PromptPane.jsx beginner prompt explainer
it('PromptPane.jsx renders beginner prompt explainer with basic structure & vocabulary', () => {
  const filePath = path.join(rootDir, 'src', 'components', 'PromptPane.jsx');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('showBeginnerHelp'), 'Must have showBeginnerHelp state');
  assert.ok(content.includes('Beginner Guide: Prompt Goal & Basic Structure') || content.includes('Dành cho người mới: Dịch nghĩa & Hướng dẫn cơ bản'), 'Must have beginner explainer button');
  assert.ok(content.includes('Recommended 4-Paragraph Structure') || content.includes('Gợi ý cấu trúc 4 đoạn cơ bản'), 'Must display 4-paragraph breakdown');
});

// 8. OnboardingModal.jsx starter band
it('OnboardingModal.jsx includes Band 5.0 starter foundation band', () => {
  const filePath = path.join(rootDir, 'src', 'components', 'OnboardingModal.jsx');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes("band: '5.0'"), 'Must include band 5.0 in TARGET_BANDS');
  assert.ok(content.includes('Starter / Foundation'), 'Must label band 5.0 as Starter / Foundation');
});

// 9. featureRegistry.js registration
it('featureRegistry.js includes feat-beginner-foundation-hub with bilingual metadata', async () => {
  const { FEATURE_REGISTRY, getLocalizedFeature } = await import('../src/core/featureRegistry.js');
  const feat = FEATURE_REGISTRY.find(f => f.id === 'feat-beginner-foundation-hub');
  assert.ok(feat, 'Must register feat-beginner-foundation-hub in FEATURE_REGISTRY');
  assert.strictEqual(feat.quickAction.target, 'beginnerGuide', 'Must target beginnerGuide modal');

  const enFeat = getLocalizedFeature(feat, true);
  assert.ok(enFeat.title.includes('Beginner Foundation Hub'), 'Must have localized title in English');
});

console.log(`\nStep 130 Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL STEP 130 CHECKS PASSED CLEANLY!\n');
}
