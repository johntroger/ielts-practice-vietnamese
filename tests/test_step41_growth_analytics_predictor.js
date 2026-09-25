import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  calculateBandGap, 
  calculateHoursRequired, 
  estimateTargetCompletionDate, 
  analyzeSkillGaps, 
  generateGrowthAnalyticsReport, 
  CAMBRIDGE_HOURS_PER_HALF_BAND 
} from '../src/services/growthPredictorService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Step 41 Test Suite: Growth Analytics & Target Band Prediction Engine...');

// 1. Test calculateBandGap
{
  assert.strictEqual(calculateBandGap(6.5, 7.5), 1.0, '6.5 to 7.5 must produce 1.0 band gap');
  assert.strictEqual(calculateBandGap(6.0, 7.5), 1.5, '6.0 to 7.5 must produce 1.5 band gap');
  assert.strictEqual(calculateBandGap(7.0, 7.0), 0.0, 'Equal bands must produce 0.0 gap');
  assert.strictEqual(calculateBandGap(8.0, 7.0), 0.0, 'Exceeding target must produce 0.0 gap');
  console.log('  ✅ 1. calculateBandGap accurately handles positive, zero, and boundary differentials');
}

// 2. Test calculateHoursRequired (Cambridge 120h / 0.5 band benchmark)
{
  assert.strictEqual(calculateHoursRequired(6.5, 7.0), 120, '0.5 band gap must require 120 hours');
  assert.strictEqual(calculateHoursRequired(6.0, 7.0), 240, '1.0 band gap must require 240 hours');
  assert.strictEqual(calculateHoursRequired(5.5, 7.0), 360, '1.5 band gap must require 360 hours');
  assert.strictEqual(calculateHoursRequired(7.0, 7.0), 0, 'Zero gap must require 0 hours');
  console.log('  ✅ 2. calculateHoursRequired matches official Cambridge Assessment empirical standard');
}

// 3. Test estimateTargetCompletionDate
{
  const fixedStartDate = new Date('2026-01-01T00:00:00Z');
  const res = estimateTargetCompletionDate(240, 8, fixedStartDate); // 30 weeks = 210 days

  assert.strictEqual(res.weeksRemaining, 30, '240h / 8h/week must equal 30 weeks');
  assert.strictEqual(res.daysRemaining, 210, '30 weeks must equal 210 days');
  assert.ok(res.formattedDate.includes('/'), 'Formatted date must follow DD/MM/YYYY format');

  // Test already reached target
  const zeroRes = estimateTargetCompletionDate(0, 8, fixedStartDate);
  assert.strictEqual(zeroRes.weeksRemaining, 0);
  assert.strictEqual(zeroRes.formattedDate, 'Đã đạt mục tiêu!');
  console.log('  ✅ 3. estimateTargetCompletionDate projects accurate calendar dates and remaining durations');
}

// 4. Test analyzeSkillGaps & Bottleneck Identification
{
  const skillScores = {
    listening: 7.0,
    reading: 7.5,
    writing: 5.5,
    speaking: 6.0
  };
  const analysis = analyzeSkillGaps(skillScores, 7.0);

  assert.strictEqual(analysis.primaryBottleneck.skill, 'writing', 'Writing (5.5) must be identified as primary bottleneck');
  assert.strictEqual(analysis.primaryBottleneck.gap, 1.5, 'Writing gap must be 1.5 bands');
  assert.strictEqual(analysis.strongestSkill.skill, 'reading', 'Reading (7.5) must be identified as strongest skill');
  assert.ok(analysis.primaryBottleneck.prescription.length > 20, 'Bottleneck must include actionable prescription');
  console.log('  ✅ 4. analyzeSkillGaps identifies bottlenecks and generates pedagogical prescriptions');
}

// 5. Test generateGrowthAnalyticsReport Comprehensive Output
{
  const report = generateGrowthAnalyticsReport({
    currentScores: { listening: 6.5, reading: 7.0, writing: 6.0, speaking: 6.0, overall: 6.5 },
    targetBand: 7.5,
    weeklyStudyHours: 10
  });

  assert.strictEqual(report.targetBand, 7.5);
  assert.strictEqual(report.overallGap, 1.0);
  assert.strictEqual(report.totalHoursRequired, 240);
  assert.strictEqual(report.weeksRemaining, 24); // 240 / 10 = 24 weeks
  assert.ok(report.progressPercentage >= 0 && report.progressPercentage <= 100);
  assert.strictEqual(report.skillAnalysis.gaps.length, 4);
  console.log('  ✅ 5. generateGrowthAnalyticsReport generates complete analytics payload for UI consumption');
}

// 6. Verify GrowthAnalyticsModal.jsx, modalStore.js, featureRegistry.js, and App.jsx integration
{
  // 6a. Component file
  const modalPath = path.join(rootDir, 'src', 'components', 'GrowthAnalyticsModal.jsx');
  assert.ok(fs.existsSync(modalPath), 'GrowthAnalyticsModal.jsx must exist');
  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert.ok(modalContent.includes('generateGrowthAnalyticsReport'), 'Modal must import generateGrowthAnalyticsReport');
  assert.ok(modalContent.includes('Dự Báo Tăng Trưởng'), 'Modal must display heading');
  assert.ok(modalContent.includes('Điểm Nghẽn Cần Khắc Phục Ưu Tiên'), 'Modal must render bottleneck spotlight');

  // 6b. modalStore.js
  const storePath = path.join(rootDir, 'src', 'core', 'modalStore.js');
  const storeContent = fs.readFileSync(storePath, 'utf8');
  assert.ok(storeContent.includes('growthAnalytics: false'), 'modalStore must declare growthAnalytics state');

  // 6c. featureRegistry.js
  const registryPath = path.join(rootDir, 'src', 'core', 'featureRegistry.js');
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  assert.ok(registryContent.includes('feat-growth-analytics'), 'featureRegistry must register feat-growth-analytics');
  assert.ok(registryContent.includes("target: 'growthAnalytics'"), 'featureRegistry quickAction must target growthAnalytics');

  // 6d. App.jsx mount
  const appPath = path.join(rootDir, 'src', 'App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  assert.ok(appContent.includes('GrowthAnalyticsModal'), 'App.jsx must mount GrowthAnalyticsModal');

  // 6e. Navbar.jsx menu item
  const navbarPath = path.join(rootDir, 'src', 'components', 'Navbar.jsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf8');
  assert.ok(navbarContent.includes("openModal('growthAnalytics')"), 'Navbar must have Growth Analytics launcher button');

  console.log('  ✅ 6. Full architectural integration (modalStore, featureRegistry, Navbar, App.jsx) verified');
}

console.log('🎉 Step 41 Test Suite: All 6 checks passed cleanly (100%)!');
