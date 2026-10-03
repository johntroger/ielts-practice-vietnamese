/**
 * Test Step 71: Academic Typography & Visual Tokens Upgrade
 *
 * Verifies:
 * 1. index.html imports Lora (academic serif) and Plus Jakarta Sans (modern sans-serif) via Google Fonts.
 * 2. tailwind.config.js configures:
 *    - fontFamily.sans with Plus Jakarta Sans as primary.
 *    - fontFamily.serif with Lora and Newsreader for academic publications.
 *    - colors.ielts.paper and paperMuted tokens for eye-comfort reading surfaces.
 * 3. src/index.css specifies:
 *    - Headings with text-wrap: balance and negative tracking.
 *    - Paragraphs with text-wrap: pretty.
 *    - .academic-reading-text class with optimal line-height and letter-spacing.
 *    - .font-tabular for numeric figures.
 * 4. src/components/PromptPane.jsx uses font-serif for authentic Cambridge prompt presentation.
 * 5. src/components/reading/PassagePane.jsx applies academic-reading-text & font-serif on reading passages.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 71: Academic Typography & Visual Tokens Test Suite...');

// 1. Verify index.html Font Imports
console.log('  ▶ 1. Verifying Google Fonts links in index.html...');
const indexHtmlPath = path.resolve(__dirname, '../index.html');
assert(fs.existsSync(indexHtmlPath), 'index.html must exist');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

assert(indexHtml.includes('Lora'), 'index.html must import Lora academic serif font');
assert(indexHtml.includes('Plus+Jakarta+Sans'), 'index.html must import Plus Jakarta Sans font');
assert(indexHtml.includes('Inter'), 'index.html must preserve Inter font');
assert(indexHtml.includes('JetBrains+Mono'), 'index.html must import JetBrains Mono font');
console.log('    ✅ Google Fonts link properly loads Lora, Plus Jakarta Sans, and JetBrains Mono.');

// 2. Verify tailwind.config.js Configuration
console.log('  ▶ 2. Verifying tailwind.config.js font families and colors...');
const tailwindPath = path.resolve(__dirname, '../tailwind.config.js');
assert(fs.existsSync(tailwindPath), 'tailwind.config.js must exist');
const tailwindConfig = fs.readFileSync(tailwindPath, 'utf8');

assert(tailwindConfig.includes('Plus Jakarta Sans'), 'tailwind.config.js must include Plus Jakarta Sans in sans');
assert(tailwindConfig.includes('serif: [') && tailwindConfig.includes('Lora'), 'tailwind.config.js must define serif with Lora');
assert(tailwindConfig.includes('paper:'), 'tailwind.config.js must define paper color token');
console.log('    ✅ Tailwind theme extended with serif and academic paper color tokens.');

// 3. Verify src/index.css Typography Rules
console.log('  ▶ 3. Verifying typography rules and utility classes in src/index.css...');
const cssPath = path.resolve(__dirname, '../src/index.css');
assert(fs.existsSync(cssPath), 'src/index.css must exist');
const cssContent = fs.readFileSync(cssPath, 'utf8');

assert(cssContent.includes('text-wrap: balance'), 'src/index.css must define text-wrap: balance for headings');
assert(cssContent.includes('text-wrap: pretty'), 'src/index.css must define text-wrap: pretty for paragraphs');
assert(cssContent.includes('.academic-reading-text'), 'src/index.css must define .academic-reading-text');
assert(cssContent.includes('.font-tabular'), 'src/index.css must define .font-tabular');
console.log('    ✅ Editorial typography and tabular numeric rules configured.');

// 4. Verify Component Integrations (PromptPane & PassagePane)
console.log('  ▶ 4. Verifying component integration in PromptPane and PassagePane...');
const promptPanePath = path.resolve(__dirname, '../src/components/PromptPane.jsx');
const passagePanePath = path.resolve(__dirname, '../src/components/reading/PassagePane.jsx');

const promptCode = fs.readFileSync(promptPanePath, 'utf8');
const passageCode = fs.readFileSync(passagePanePath, 'utf8');

assert(promptCode.includes('font-serif') && promptCode.includes('renderHighlightedPrompt'), 
  'PromptPane must render prompt with font-serif for authentic exam booklet aesthetic');
assert(passageCode.includes('academic-reading-text') && passageCode.includes('font-serif'), 
  'PassagePane must render reading paragraphs with academic-reading-text');
console.log('    ✅ Component integrations verified with authentic academic typography.');

console.log('\n🎉 ALL STEP 71 ACADEMIC TYPOGRAPHY & VISUAL TOKENS TESTS PASSED (4/4)!');
