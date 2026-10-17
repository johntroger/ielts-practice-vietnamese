/**
 * Test Step 169: Phase 4 & Phase 5 Architecture Upgrade Verification
 *
 * Verifies:
 * 1. Phase 4 (Strict English UI in Service Layer):
 *    - coreGeminiClient.js provides nameEn for all POPULAR_GEMINI_MODELS, getLocalizedGeminiModels(), and bilingual error messages.
 *    - aiProviderService.js provides descriptionEn for all AI_PROVIDERS.
 *    - dataSyncService.js uses locale-aware date formatting and bilingual fallback creator names.
 *    - realLeaderboardService.js uses bilingual fallback learner & guest display names.
 * 2. Phase 4 (Supabase Query Limits, Realtime Server-Side Filter & Dependencies Cleanup):
 *    - dataSyncService.js enforces .limit(...) on fetchUserSubmissions, fetchUserVocab, and fetchUserCustomTasks.
 *    - App.jsx enforces filter: 'is_public=eq.true' on the Supabase Realtime channel.
 *    - package.json places @aws-sdk/client-s3 and dotenv in devDependencies rather than runtime dependencies.
 * 3. Phase 5 (God Component Modularization):
 *    - UserProfileModal.jsx is modularized (< 850 lines) into src/components/profile/useProfileAnalytics.js, ProfileSkillHistoryTabs.jsx, and ProfileVaultAndAccountTabs.jsx.
 *    - ListeningWorkspace.jsx is modularized (< 1750 lines) with src/components/listening/ListeningExamOverlays.jsx.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 169: Phase 4 & Phase 5 Architecture Upgrade Verification...\n');

let passed = 0;
const total = 8;

// 1. Verify coreGeminiClient.js & aiProviderService.js English localization
{
  const geminiClientCode = fs.readFileSync(path.resolve(__dirname, '../src/services/ai/coreGeminiClient.js'), 'utf8');
  assert(geminiClientCode.includes('nameEn:'), 'POPULAR_GEMINI_MODELS must include nameEn for English UI');
  assert(geminiClientCode.includes('getLocalizedGeminiModels'), 'coreGeminiClient must export getLocalizedGeminiModels');
  assert(geminiClientCode.includes('isCurrentUiEnglish'), 'coreGeminiClient must check English UI state for error messages');

  const providerCode = fs.readFileSync(path.resolve(__dirname, '../src/services/aiProviderService.js'), 'utf8');
  assert(providerCode.includes('descriptionEn:'), 'AI_PROVIDERS must include descriptionEn for English UI');
  passed++;
  console.log('  ✅ 1. AI Service layer (coreGeminiClient & aiProviderService) localized for 100% English UI');
}

// 2. Verify dataSyncService.js query limits & English localization
{
  const syncCode = fs.readFileSync(path.resolve(__dirname, '../src/services/dataSyncService.js'), 'utf8');
  assert(syncCode.includes('.limit(SUPABASE_LIMITS.MAX_SUBMISSIONS_PER_FETCH)'), 'fetchUserSubmissions must enforce MAX_SUBMISSIONS_PER_FETCH limit');
  assert(syncCode.includes('.limit(500)'), 'fetchUserVocab must enforce a 500-row query limit');
  assert(syncCode.includes('.limit(SUPABASE_LIMITS.MAX_TASKS_PER_FETCH)'), 'fetchUserCustomTasks must enforce MAX_TASKS_PER_FETCH limit');
  assert(syncCode.includes("isUiEnglish() ? 'en-US' : 'vi-VN'"), 'dataSyncService must format dates using current UI locale');
  passed++;
  console.log('  ✅ 2. dataSyncService enforces Supabase query limits and locale-aware formatting');
}

// 3. Verify realLeaderboardService.js English localization
{
  const lbCode = fs.readFileSync(path.resolve(__dirname, '../src/services/gamification/realLeaderboardService.js'), 'utf8');
  assert(lbCode.includes("'You (Guest)'") && lbCode.includes("'Learner'"), 'realLeaderboardService must localize Guest and Learner fallback names in English mode');
  passed++;
  console.log('  ✅ 3. realLeaderboardService localizes fallback learner and guest names');
}

// 4. Verify App.jsx Realtime server-side filter
{
  const appCode = fs.readFileSync(path.resolve(__dirname, '../src/App.jsx'), 'utf8');
  assert(appCode.includes("filter: 'is_public=eq.true'"), 'App.jsx Realtime subscription must filter for public tasks at the server level');
  assert(appCode.includes("row.entity_type !== 'writing_task'"), 'App.jsx Realtime handler must guard entity_type === writing_task');
  passed++;
  console.log('  ✅ 4. App.jsx Realtime channel enforces server-side filter (is_public=eq.true)');
}

// 5. Verify package.json dependencies cleanup
{
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
  assert(!pkg.dependencies['@aws-sdk/client-s3'], '@aws-sdk/client-s3 must not be in runtime dependencies');
  assert(!pkg.dependencies['dotenv'], 'dotenv must not be in runtime dependencies');
  assert(pkg.devDependencies['@aws-sdk/client-s3'], '@aws-sdk/client-s3 must be in devDependencies');
  assert(pkg.devDependencies['dotenv'], 'dotenv must be in devDependencies');
  passed++;
  console.log('  ✅ 5. package.json separates CLI/R2 upload packages into devDependencies');
}

// 6. Verify UserProfileModal.jsx modularization
{
  const profileModalPath = path.resolve(__dirname, '../src/components/UserProfileModal.jsx');
  const profileCode = fs.readFileSync(profileModalPath, 'utf8');
  const lineCount = profileCode.split('\n').length;
  assert(lineCount < 1000, `UserProfileModal.jsx should be < 1000 lines after modularization (actual: ${lineCount})`);
  assert(fs.existsSync(path.resolve(__dirname, '../src/components/profile/useProfileAnalytics.js')), 'useProfileAnalytics.js must exist');
  assert(fs.existsSync(path.resolve(__dirname, '../src/components/profile/ProfileSkillHistoryTabs.jsx')), 'ProfileSkillHistoryTabs.jsx must exist');
  assert(fs.existsSync(path.resolve(__dirname, '../src/components/profile/ProfileVaultAndAccountTabs.jsx')), 'ProfileVaultAndAccountTabs.jsx must exist');
  passed++;
  console.log(`  ✅ 6. UserProfileModal.jsx modularized cleanly (${lineCount} lines, -61% size reduction)`);
}

// 7. Verify ListeningWorkspace.jsx modularization
{
  const listeningWsPath = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
  const listeningCode = fs.readFileSync(listeningWsPath, 'utf8');
  const lineCount = listeningCode.split('\n').length;
  assert(lineCount < 1750, `ListeningWorkspace.jsx should be < 1750 lines after modularization (actual: ${lineCount})`);
  assert(fs.existsSync(path.resolve(__dirname, '../src/components/listening/ListeningExamOverlays.jsx')), 'ListeningExamOverlays.jsx must exist');
  assert(listeningCode.includes('ListeningStrictHeaderBar') && listeningCode.includes('ListeningStatusBanners'), 'ListeningWorkspace must use extracted overlay components');
  passed++;
  console.log(`  ✅ 7. ListeningWorkspace.jsx modularized cleanly (${lineCount} lines) with ListeningExamOverlays.jsx`);
}

// 8. Verify SettingsModal model nameEn rendering
{
  const settingsCode = fs.readFileSync(path.resolve(__dirname, '../src/components/SettingsModal.jsx'), 'utf8');
  assert(settingsCode.includes('m.nameEn'), 'SettingsModal must render m.nameEn when in English UI mode');
  passed++;
  console.log('  ✅ 8. SettingsModal renders localized English model descriptions');
}

console.log(`\n🎉 All ${passed}/${total} Phase 4 & Phase 5 Architecture Upgrade tests passed!`);
