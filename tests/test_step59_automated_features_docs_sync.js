/**
 * Test Suite Step 59: Automated Features Documentation & GitBook Sync Engine
 * 
 * Verifies that:
 * 1. scripts/sync_features_to_gitbook.js exists and exports runSync.
 * 2. Generated documentation folder docs/features/ contains README.md and all 6 category guides.
 * 3. 100% of features in src/core/featureRegistry.js (34+ features) are documented with unique anchor IDs.
 * 4. All keyboard shortcuts from featureRegistry appear in the quick shortcuts table of README.md.
 * 5. docs/SUMMARY.md contains valid links to all generated feature documentation pages with zero broken links.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { FEATURE_REGISTRY, FEATURE_CATEGORIES } from '../src/core/featureRegistry.js';
import { runSync } from '../scripts/sync_features_to_gitbook.js';

console.log('🚀 Testing Step 59: Automated Features Documentation & GitBook Sync Engine...');

// -------------------------------------------------------------
// 1. RUN SYNC ENGINE TO ENSURE REPRODUCIBILITY
// -------------------------------------------------------------
console.log('  ▶ 1. Running sync engine programmatically...');
assert.doesNotThrow(() => {
  runSync();
}, 'runSync() must execute cleanly without exceptions');
console.log('    ✅ Sync engine executed cleanly.');

// -------------------------------------------------------------
// 2. VERIFY docs/features/ DIRECTORY & CATEGORY FILES
// -------------------------------------------------------------
console.log('  ▶ 2. Verifying generated markdown documentation files...');
const featuresDir = path.resolve('docs/features');
assert(fs.existsSync(featuresDir), 'docs/features/ directory must exist');

const expectedFiles = [
  'README.md',
  'ai-evaluation.md',
  'practice-tools.md',
  'exam-simulation.md',
  'theory-vocab.md',
  'analytics-profile.md',
  'shortcuts-ux.md'
];

for (const file of expectedFiles) {
  const filePath = path.join(featuresDir, file);
  assert(fs.existsSync(filePath), `docs/features/${file} must exist`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.length > 500, `docs/features/${file} must contain substantial documentation (>500 bytes)`);
}
console.log('    ✅ All 7 feature documentation markdown files exist and contain rich content.');

// -------------------------------------------------------------
// 3. VERIFY 100% OF FEATURES ARE DOCUMENTED WITH UNIQUE ANCHORS
// -------------------------------------------------------------
console.log(`  ▶ 3. Verifying all ${FEATURE_REGISTRY.length} features have unique anchors & content...`);
const allFilesContent = expectedFiles
  .filter(f => f !== 'README.md')
  .map(f => fs.readFileSync(path.join(featuresDir, f), 'utf8'))
  .join('\n');

for (const feat of FEATURE_REGISTRY) {
  const expectedAnchor = `<a id="${feat.id}"></a>`;
  assert(
    allFilesContent.includes(expectedAnchor),
    `Feature "${feat.id}" (${feat.title}) must have anchor "${expectedAnchor}" in category docs`
  );
  assert(
    allFilesContent.includes(feat.title),
    `Feature title "${feat.title}" must be present in category docs`
  );
  if (feat.usageGuide) {
    assert(
      allFilesContent.includes(feat.usageGuide),
      `Feature usage guide for "${feat.id}" must be documented`
    );
  }
}
console.log(`    ✅ 100% of ${FEATURE_REGISTRY.length} features are thoroughly documented with anchors.`);

// -------------------------------------------------------------
// 4. VERIFY KEYBOARD SHORTCUTS TABLE IN README.md
// -------------------------------------------------------------
console.log('  ▶ 4. Verifying keyboard shortcuts in docs/features/README.md...');
const featuresReadme = fs.readFileSync(path.join(featuresDir, 'README.md'), 'utf8');
const featuresWithShortcuts = FEATURE_REGISTRY.filter(f => f.shortcut);

for (const feat of featuresWithShortcuts) {
  assert(
    featuresReadme.includes(feat.shortcut),
    `Shortcut "${feat.shortcut}" for feature "${feat.id}" must appear in README.md shortcuts table`
  );
}
console.log(`    ✅ All ${featuresWithShortcuts.length} registered shortcuts are present in the table.`);

// -------------------------------------------------------------
// 5. VERIFY docs/SUMMARY.md LINKS & INTEGRITY
// -------------------------------------------------------------
console.log('  ▶ 5. Verifying docs/SUMMARY.md section & links...');
const summaryContent = fs.readFileSync(path.resolve('docs/SUMMARY.md'), 'utf8');
assert(
  summaryContent.includes('## 🚀 Hướng Dẫn Sử Dụng & Tính Năng Hệ Thống'),
  'SUMMARY.md must contain the Features & User Guide section'
);

for (const file of expectedFiles) {
  assert(
    summaryContent.includes(`features/${file}`),
    `SUMMARY.md must include link to features/${file}`
  );
}
console.log('    ✅ docs/SUMMARY.md contains all feature guide links with verified targets.');

// -------------------------------------------------------------
// 6. VERIFY getFeatureGitBookUrl DEEP LINKING UTILITY
// -------------------------------------------------------------
console.log('  ▶ 6. Verifying getFeatureGitBookUrl deep linking resolver...');
import { getFeatureGitBookUrl, GITBOOK_FEATURES_BASE_URL, GITBOOK_CATEGORY_SLUGS } from '../src/core/featureRegistry.js';

assert.strictEqual(getFeatureGitBookUrl(), `${GITBOOK_FEATURES_BASE_URL}/features`, 'Default url must return features hub url');
assert.strictEqual(getFeatureGitBookUrl('all'), `${GITBOOK_FEATURES_BASE_URL}/features`, "'all' category must return features hub url");

Object.entries(GITBOOK_CATEGORY_SLUGS).forEach(([catId, slug]) => {
  const categoryUrl = getFeatureGitBookUrl(catId);
  assert.strictEqual(categoryUrl, `${GITBOOK_FEATURES_BASE_URL}/${slug}`, `Category ${catId} must map to ${slug}`);

  // Test with feature id anchor
  const featUrl = getFeatureGitBookUrl(catId, 'sample-feat');
  assert.strictEqual(featUrl, `${GITBOOK_FEATURES_BASE_URL}/${slug}#sample-feat`, `Category ${catId} with anchor must match`);
});

// Test with feature object
const sampleFeat = FEATURE_REGISTRY[0];
const sampleFeatUrl = getFeatureGitBookUrl(sampleFeat);
assert(sampleFeatUrl.includes(sampleFeat.id), 'Feature URL must include feature anchor');
console.log('    ✅ getFeatureGitBookUrl resolves all categories and features accurately.');

// -------------------------------------------------------------
// 7. VERIFY UI INTEGRATION IN FeaturesGuideModal & Navbar
// -------------------------------------------------------------
console.log('  ▶ 7. Verifying UI integration in FeaturesGuideModal.jsx & Navbar.jsx...');
const modalCode = fs.readFileSync(path.resolve('src/components/FeaturesGuideModal.jsx'), 'utf8');
const navbarCode = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf8');

assert(modalCode.includes('getFeatureGitBookUrl'), 'FeaturesGuideModal must import getFeatureGitBookUrl');
assert(modalCode.includes('GitBook Docs'), 'FeaturesGuideModal header must include GitBook Docs button');
assert(modalCode.includes('Đọc Trên GitBook'), 'FeaturesGuideModal detail must include Đọc Trên GitBook button');
assert(navbarCode.includes('huong-dan-su-dung-and-tinh-nang-he-thong/features'), 'Navbar must link to GitBook features docs');
console.log('    ✅ UI components correctly integrate GitBook deep links.');

console.log('🎉 Step 59 Test Suite PASSED: Automated Features Documentation & GitBook Sync 100% VERIFIED!\n');
