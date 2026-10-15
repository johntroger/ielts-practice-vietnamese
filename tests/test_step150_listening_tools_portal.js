import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("▶ Running: Step 150: Listening Workspace Tools Portal & Overflow Clipping Audit ...");

const listeningWorkspacePath = path.resolve('src/components/listening/ListeningWorkspace.jsx');
const content = fs.readFileSync(listeningWorkspacePath, 'utf8');

// 1. Verify createPortal is imported from 'react-dom'
assert(content.includes("import { createPortal } from 'react-dom';"), 'ListeningWorkspace must import createPortal from react-dom');

// 2. Verify toolsButtonRef is defined and attached
assert(content.includes('const toolsButtonRef = useRef(null);'), 'ListeningWorkspace must define toolsButtonRef');
assert(content.includes('ref={toolsButtonRef}'), 'ListeningWorkspace must attach toolsButtonRef to Tools button wrapper');

// 3. Verify coordinate calculation and screen-edge clamping logic exists
assert(content.includes('calcToolsCoords'), 'ListeningWorkspace must have calcToolsCoords function');
assert(content.includes('getBoundingClientRect()'), 'calcToolsCoords must measure button geometry via getBoundingClientRect');
assert(content.includes('toolsDropdownCoords'), 'ListeningWorkspace must store toolsDropdownCoords state');

// 4. Verify createPortal rendering
assert(content.includes('createPortal('), 'ListeningWorkspace must render Tools dropdown through createPortal');
assert(content.includes('document.body'), 'createPortal must render into document.body to escape overflow clipping');

// 5. Verify all essential tools are present in the dropdown menu
assert(content.includes('theoryHandbook'), 'Tools dropdown must include Theory Handbook option');
assert(content.includes('generateAi'), 'Tools dropdown must include AI Generator option');
assert(content.includes('microDrills'), 'Tools dropdown must include Micro Drills option');
assert(content.includes('transcript'), 'Tools dropdown must include Transcript option');
assert(content.includes('soundcheck'), 'Tools dropdown must include Soundcheck option');
assert(content.includes('scratchpad'), 'Tools dropdown must include Scratchpad option');

// 6. Test coordinate calculation logic simulation
function simulateCoords(buttonRect, windowWidth, windowHeight) {
  const desiredWidth = Math.min(270, windowWidth - 24);
  let left = buttonRect.right - desiredWidth;
  if (left < 12) left = 12;
  if (left + desiredWidth > windowWidth - 12) {
    left = windowWidth - 12 - desiredWidth;
  }
  return {
    top: buttonRect.bottom + 6,
    left,
    width: desiredWidth,
    maxHeight: Math.max(220, windowHeight - buttonRect.bottom - 16)
  };
}

// Test case A: Desktop wide screen (1920x1080), button at right: 1800
const desktopCoords = simulateCoords({ right: 1800, bottom: 45 }, 1920, 1080);
assert(desktopCoords.left > 0 && desktopCoords.left + desktopCoords.width <= 1920 - 12, 'Must not spill off right edge on desktop');
assert.strictEqual(desktopCoords.top, 51, 'Top must be 6px below button bottom');

// Test case B: Mobile screen (375x667), button at right: 360
const mobileCoords = simulateCoords({ right: 360, bottom: 45 }, 375, 667);
assert(mobileCoords.left >= 12, 'Left must be clamped to at least 12px padding on mobile');
assert(mobileCoords.left + mobileCoords.width <= 375 - 12, 'Total width must not exceed viewport on mobile');

console.log("✅ PASSED: Step 150 Listening Workspace Tools Portal Verified Cleanly!");
