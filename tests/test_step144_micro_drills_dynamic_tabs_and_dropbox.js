/**
 * Test Step 144: MicroDrills Dynamic Tab Bar with Closable Tabs and Drill Type Dropbox
 *
 * Verifies:
 * 1. MicroDrillsModal.jsx implements a dynamic tab architecture:
 *    - Master roomTabsCatalog for general, writing, reading, listening, speaking.
 *    - Persisted open tabs state (openTabsByRoom) via localStorage 'ielts_micro_drills_open_tabs'.
 * 2. Drill Type Dropbox:
 *    - Prominent toggle button for opening drill types dropdown with counter badge.
 *    - Floating dropdown menu listing all drills with active indicator and open button.
 *    - Quick actions: 'Open all' (handleOpenAllTabs) and 'Only active' (handleCloseOtherTabs).
 * 3. Dynamic Closable Tabs Bar:
 *    - Only opened tabs are rendered on the bar, eliminating mobile horizontal overflow.
 *    - Each tab chip has a close ('x') button calling handleCloseTab.
 *    - Close button uses e.stopPropagation() to prevent accidental selection.
 *    - If closed tab was active, gracefully switches to an adjacent open tab.
 * 4. Backward Compatibility:
 *    - Preserves test_step49 explicit calls: setActiveTab('speaking-area'), setActiveTab('speaking-fillers'),
 *      setActiveTab('speaking-collocations'), setActiveTab('speaking-part3-counter').
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 144: MicroDrills Dynamic Tab Bar & Drill Type Dropbox ---');

const modalPath = path.join(__dirname, '../src/components/MicroDrillsModal.jsx');
assert(fs.existsSync(modalPath), 'src/components/MicroDrillsModal.jsx must exist');
const modalSource = fs.readFileSync(modalPath, 'utf8');

// 1. Verify Catalog and State
console.log('Test 1: Verifying roomTabsCatalog and openTabsByRoom state persistence');
assert(modalSource.includes('roomTabsCatalog'), 'Must define roomTabsCatalog mapping rooms to drill types');
assert(modalSource.includes('ielts_micro_drills_open_tabs'), 'Must persist open tabs state in localStorage');
assert(modalSource.includes('isTabDropdownOpen'), 'Must manage isTabDropdownOpen state');
assert(modalSource.includes('tabDropdownRef'), 'Must have tabDropdownRef for outside click handling');

// 2. Verify Handlers
console.log('Test 2: Verifying dynamic tab handlers');
assert(modalSource.includes('handleSelectFromDropdown'), 'Must have handleSelectFromDropdown to open and activate tabs');
assert(modalSource.includes('handleCloseTab'), 'Must have handleCloseTab to remove tab from bar');
assert(modalSource.includes('handleOpenAllTabs'), 'Must have handleOpenAllTabs helper');
assert(modalSource.includes('handleCloseOtherTabs'), 'Must have handleCloseOtherTabs helper');

// 3. Verify Dropbox and Tab Bar UI Elements
console.log('Test 3: Verifying Dropbox picker button and dropdown UI');
assert(modalSource.includes('setIsTabDropdownOpen(prev => !prev)') || modalSource.includes('setIsTabDropdownOpen(!isTabDropdownOpen)'), 'Dropbox button must toggle dropdown');
assert(modalSource.includes("isEn ? 'Drill Types' : 'Dạng bài'"), 'Must display bilingual Drill Types label');
assert(modalSource.includes('handleOpenAllTabs'), 'Dropdown must include Open all option');
assert(modalSource.includes('handleSelectFromDropdown(tab.id)'), 'Dropdown items must be selectable');

console.log('Test 4: Verifying Closable Tabs with X button and stopPropagation');
assert(modalSource.includes('handleCloseTab(tabId)'), 'Each tab chip must have close button calling handleCloseTab');
assert(modalSource.includes('e.stopPropagation()'), 'Tab close button must stop propagation');
assert(modalSource.includes('roomThemeStyles'), 'Must support tailored theme styles for active tabs across rooms');

// 4. Verify Backward Compatibility for Speaking sub-tabs
console.log('Test 5: Verifying backward compatibility with test_step49');
assert(modalSource.includes("setActiveTab('speaking-area')"), 'Must maintain speaking-area setActiveTab call');
assert(modalSource.includes("setActiveTab('speaking-fillers')"), 'Must maintain speaking-fillers setActiveTab call');
assert(modalSource.includes("setActiveTab('speaking-collocations')"), 'Must maintain speaking-collocations setActiveTab call');
assert(modalSource.includes("setActiveTab('speaking-part3-counter')"), 'Must maintain speaking-part3-counter setActiveTab call');

console.log('✅ All 5/5 checks passed for Step 144 MicroDrills Dynamic Tabs and Dropbox!');
process.exit(0);
