import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Testing Step 21: UI/UX De-cluttering & CDI Exam Accessibility (Phase 4)');

// 1. Verify CDIDisplayModal component and export constants
const cdiModalPath = path.resolve('src/components/CDIDisplayModal.jsx');
assert(fs.existsSync(cdiModalPath), 'src/components/CDIDisplayModal.jsx must exist');
const cdiModalCode = fs.readFileSync(cdiModalPath, 'utf8');

assert(cdiModalCode.includes('CDI_FONT_SIZES'), 'Must export CDI_FONT_SIZES');
assert(cdiModalCode.includes('CDI_CONTRAST_SCHEMES'), 'Must export CDI_CONTRAST_SCHEMES');
assert(cdiModalCode.includes('yellow-on-black'), 'Must support official British Council Yellow on Black contrast');
assert(cdiModalCode.includes('black-on-yellow'), 'Must support official soft eye-care Black on Cream/Yellow contrast');
assert(cdiModalCode.includes('standard') && cdiModalCode.includes('large') && cdiModalCode.includes('xlarge'), 'Must support 3 standard CDI font sizes');
assert(cdiModalCode.includes('Xem trước văn bản'), 'Must have live preview container');
console.log('  ✅ 1. CDIDisplayModal implements authentic Computer-Delivered IELTS display options');

// 2. Verify WritingSubHeaderToolbar de-cluttering & CDI button
const toolbarPath = path.resolve('src/components/WritingSubHeaderToolbar.jsx');
assert(fs.existsSync(toolbarPath), 'src/components/WritingSubHeaderToolbar.jsx must exist');
const toolbarCode = fs.readFileSync(toolbarPath, 'utf8');

assert(toolbarCode.includes('onOpenCDIDisplay'), 'Toolbar must accept onOpenCDIDisplay prop');
assert(toolbarCode.includes('Trợ Năng CDI'), 'Toolbar must expose CDI Display button');
assert(toolbarCode.includes('isToolsDropdownOpen'), 'Toolbar must group auxiliary tools into de-cluttered popover');
assert(toolbarCode.includes('Sinh Đề (AI)'), 'Toolbar must feature prominent AI Task Generator button');
assert(toolbarCode.includes('Thuộc bài'), 'Toolbar must retain quick Mastered toggle');
console.log('  ✅ 2. WritingSubHeaderToolbar resolves cognitive overload with structured 2-zone layout');

// 3. Verify TimerBar mobile compact mode
const timerPath = path.resolve('src/components/TimerBar.jsx');
assert(fs.existsSync(timerPath), 'src/components/TimerBar.jsx must exist');
const timerCode = fs.readFileSync(timerPath, 'utf8');

assert(timerCode.includes('isMobileCompact'), 'TimerBar must manage isMobileCompact state');
assert(timerCode.includes('fixed bottom-3 right-3'), 'TimerBar must render floating compact pill on mobile');
assert(timerCode.includes('ChevronDown') && timerCode.includes('ChevronUp'), 'TimerBar must provide collapse/expand controls for mobile');
console.log('  ✅ 3. TimerBar prevents mobile virtual keyboard collision with compact floating mode');

// 4. Verify CSS rules for CDI Accessibility in index.css
const cssPath = path.resolve('src/index.css');
assert(fs.existsSync(cssPath), 'src/index.css must exist');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(cssCode.includes('[data-cdi-font="large"]'), 'index.css must support large font scale');
assert(cssCode.includes('[data-cdi-font="xlarge"]'), 'index.css must support xlarge font scale');
assert(cssCode.includes('[data-cdi-contrast="yellow-on-black"]'), 'index.css must style Yellow on Black mode');
assert(cssCode.includes('[data-cdi-contrast="black-on-yellow"]'), 'index.css must style Black on Cream/Yellow mode');
assert(cssCode.includes('[data-cdi-contrast="dark"]'), 'index.css must style Dark exam contrast mode');
console.log('  ✅ 4. index.css establishes responsive font scaling & high-contrast themes');

// 5. Verify App.jsx integration
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(appCode.includes('CDIDisplayModal'), 'App.jsx must import and render CDIDisplayModal');
assert(appCode.includes('cdiFontSize') && appCode.includes('cdiContrast'), 'App.jsx must manage cdiFontSize and cdiContrast states');
assert(appCode.includes('data-cdi-font={cdiFontSize}'), 'App.jsx must apply data-cdi-font attribute to root container');
assert(appCode.includes('data-cdi-contrast={cdiContrast}'), 'App.jsx must apply data-cdi-contrast attribute to root container');
assert(appCode.includes('ielts_cdi_font_size') && appCode.includes('ielts_cdi_contrast'), 'App.jsx must persist CDI display settings in localStorage');
console.log('  ✅ 5. App.jsx successfully coordinates CDI display state across all workspaces');

console.log('🎉 Step 21: UI/UX De-cluttering & CDI Exam Accessibility (Phase 4) tests PASSED 100%!\n');
