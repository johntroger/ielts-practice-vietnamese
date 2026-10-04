import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  getTheme, 
  setTheme, 
  toggleTheme, 
  initTheme, 
  subscribeTheme 
} from '../src/utils/themeService.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

/**
 * Test Suite Step 87: Comprehensive Dark Mode Theme System Verification
 * 
 * Verifies:
 * 1. tailwind.config.js configures darkMode: 'class'
 * 2. themeService.js functions (getTheme, setTheme, toggleTheme, subscribeTheme)
 * 3. src/index.css comprehensive dark theme styles
 * 4. Navbar.jsx theme toggle button & mobile drawer integration
 * 5. SettingsModal.jsx theme selection cards
 * 6. App.jsx startup initialization
 * 7. Feature Registry declarative registration
 */

console.log('🌙 Testing Step 87: Comprehensive Dark Mode Theme System...');

// 1. Verify tailwind.config.js
console.log('  ▶ 1. Verifying Tailwind CSS darkMode: "class" configuration...');
const tailwindConfigPath = path.resolve('tailwind.config.js');
assert.ok(fs.existsSync(tailwindConfigPath), 'tailwind.config.js must exist');
const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
assert.ok(tailwindConfig.includes("darkMode: 'class'") || tailwindConfig.includes('darkMode: "class"'), 'tailwind.config.js must have darkMode: class');
console.log('    ✅ tailwind.config.js darkMode class configuration verified.');

// 2. Verify themeService.js
console.log('  ▶ 2. Verifying themeService.js functions & reactivity...');
assert.strictEqual(typeof getTheme, 'function', 'getTheme must be a function');
assert.strictEqual(typeof setTheme, 'function', 'setTheme must be a function');
assert.strictEqual(typeof toggleTheme, 'function', 'toggleTheme must be a function');
assert.strictEqual(typeof subscribeTheme, 'function', 'subscribeTheme must be a function');

// Test subscriber notifications
let notifiedTheme = null;
const unsubscribe = subscribeTheme((theme) => {
  notifiedTheme = theme;
});

setTheme('dark');
assert.strictEqual(notifiedTheme, 'dark', 'Subscriber must receive dark theme update');

setTheme('light');
assert.strictEqual(notifiedTheme, 'light', 'Subscriber must receive light theme update');

toggleTheme();
assert.strictEqual(notifiedTheme, 'dark', 'toggleTheme must switch from light to dark');

unsubscribe();
console.log('    ✅ themeService.js state management and subscriber reactivity verified.');

// 3. Verify src/index.css Dark Theme rules
console.log('  ▶ 3. Verifying src/index.css dark theme styling rules...');
const cssPath = path.resolve('src/index.css');
assert.ok(fs.existsSync(cssPath), 'src/index.css must exist');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert.ok(cssContent.includes('html.dark body'), 'index.css must style html.dark body');
assert.ok(cssContent.includes('html.dark header'), 'index.css must style html.dark header');
assert.ok(cssContent.includes('html.dark .bg-white'), 'index.css must style html.dark .bg-white');
assert.ok(cssContent.includes('html.dark .text-slate-900'), 'index.css must style html.dark .text-slate-900');
assert.ok(cssContent.includes('html.dark textarea'), 'index.css must style html.dark textarea');
console.log('    ✅ Comprehensive dark theme styling rules confirmed in index.css.');

// 4. Verify Navbar.jsx Theme Toggle
console.log('  ▶ 4. Verifying Navbar.jsx Theme Toggle integration...');
const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');
assert.ok(navbarCode.includes('import { getTheme, toggleTheme, subscribeTheme }'), 'Navbar must import themeService');
assert.ok(navbarCode.includes('currentTheme === \'dark\''), 'Navbar must handle dark/light state');
assert.ok(navbarCode.includes('Moon') && navbarCode.includes('Sun'), 'Navbar must render Moon/Sun icons');
assert.ok(navbarCode.includes('Chuyển đổi giao diện Sáng / Tối'), 'Navbar must have accessible aria-label');
assert.ok(navbarCode.includes('Giao Diện Ban Đêm (Dark Mode)'), 'Mobile drawer must include Dark Mode toggle');
console.log('    ✅ Navbar desktop & mobile drawer theme toggle verified.');

// 5. Verify SettingsModal.jsx Theme Section
console.log('  ▶ 5. Verifying SettingsModal.jsx Theme settings section...');
const settingsPath = path.resolve('src/components/SettingsModal.jsx');
const settingsCode = fs.readFileSync(settingsPath, 'utf8');
assert.ok(settingsCode.includes('Chế Độ Giao Diện (Theme & Appearance)'), 'SettingsModal must have Theme section');
assert.ok(settingsCode.includes('Giao Diện Sáng (Light)'), 'SettingsModal must offer Light mode option');
assert.ok(settingsCode.includes('Giao Diện Tối (Dark)'), 'SettingsModal must offer Dark mode option');
console.log('    ✅ SettingsModal.jsx theme selection cards verified.');

// 6. Verify App.jsx Initialization
console.log('  ▶ 6. Verifying App.jsx initTheme call on mount...');
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');
assert.ok(appCode.includes('import { initTheme }'), 'App.jsx must import initTheme');
assert.ok(appCode.includes('initTheme();'), 'App.jsx must call initTheme on mount');
console.log('    ✅ App.jsx theme initialization on mount verified.');

// 7. Verify Feature Registry
console.log('  ▶ 7. Verifying featureRegistry.js entry...');
const feat = getFeatureById('feat-dark-mode-theme');
assert.ok(feat, 'feat-dark-mode-theme must be registered');
assert.strictEqual(feat.category, 'shortcuts_ux', 'Category must be shortcuts_ux');
assert.strictEqual(feat.icon, 'Moon', 'Icon must be Moon');
console.log('    ✅ featureRegistry.js entry verified.');

console.log('🎉 Step 87 Test Suite PASSED: Comprehensive Dark Mode Theme System 100% VERIFIED!\n');
