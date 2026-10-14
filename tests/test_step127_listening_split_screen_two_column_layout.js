/**
 * Test Step 127: IELTS Listening Split-Screen Two-Column Layout & Decluttered Header Verification
 * 
 * Verifies:
 * 1. ListeningWorkspace.jsx implements split-screen two-column architecture (splitWidth, isDragging, containerRef).
 * 2. ListeningWorkspace.jsx renders Left Column with AudioPlayerBar in split mode (inSplitPane={true}).
 * 3. ListeningWorkspace.jsx renders Left Column multi-tools (Map & Context Overview, Scratchpad, Karaoke Transcript).
 * 4. ListeningWorkspace.jsx renders resizable divider with double-click reset.
 * 5. ListeningWorkspace.jsx renders Right Column dedicated 100% to questions with hidePartHeader={true}.
 * 6. ListeningWorkspace.jsx declutters subheader into a compact row with consolidated Tools dropdown.
 * 7. ListeningQuestionPane.jsx supports hidePartHeader and utilizes wider layout without artificial squeezing.
 * 8. AudioPlayerBar.jsx supports inSplitPane compact rendering for left column embedding.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 127: Listening Split-Screen Two-Column Layout Test Suite...');

// 1. Verify ListeningWorkspace.jsx split-screen architecture
const listeningWsPath = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
assert.ok(fs.existsSync(listeningWsPath), 'ListeningWorkspace.jsx must exist');
const wsCode = fs.readFileSync(listeningWsPath, 'utf8');

assert.ok(wsCode.includes('splitWidth') && wsCode.includes('setSplitWidth'), 'ListeningWorkspace must declare splitWidth state');
assert.ok(wsCode.includes('isDragging') && wsCode.includes('setIsDragging'), 'ListeningWorkspace must declare isDragging state');
assert.ok(wsCode.includes('containerRef'), 'ListeningWorkspace must use containerRef for split pane calculation');
assert.ok(wsCode.includes('cursor-col-resize'), 'ListeningWorkspace must render draggable resize splitter');
assert.ok(wsCode.includes('onDoubleClick={() => setSplitWidth(48)}'), 'ListeningWorkspace must support double-click to reset split width');
assert.ok(wsCode.includes('leftPaneTab') && wsCode.includes('setLeftPaneTab'), 'ListeningWorkspace must declare leftPaneTab state');
assert.ok(wsCode.includes('inSplitPane={true}'), 'ListeningWorkspace must pass inSplitPane to AudioPlayerBar in Left Column');
assert.ok(wsCode.includes('hidePartHeader={true}'), 'ListeningWorkspace must pass hidePartHeader to ListeningQuestionPane in Right Column');
assert.ok(wsCode.includes('isToolsMenuOpen'), 'ListeningWorkspace must declare consolidated Tools dropdown menu');
console.log('  ✅ 1. ListeningWorkspace implements split-screen two-column layout and decluttered header');

// 2. Verify Left Column Tabs (Map & Context, Scratchpad, Transcript)
assert.ok(wsCode.includes("leftPaneTab === 'overview'"), 'ListeningWorkspace must support Overview / Map tab');
assert.ok(wsCode.includes("leftPaneTab === 'scratchpad'"), 'ListeningWorkspace must support Scratchpad tab');
assert.ok(wsCode.includes("leftPaneTab === 'transcript'"), 'ListeningWorkspace must support Synced Transcript tab');
assert.ok(wsCode.includes('mapGroup.mapImageUrl'), 'ListeningWorkspace must render Map image directly in Left Column when part has map');
assert.ok(wsCode.includes('mapZoom'), 'ListeningWorkspace must support Zoom controls for map in Left Column');
console.log('  ✅ 2. Left Column pins Map / Diagram, Scratchpad and Karaoke Transcript side-by-side with questions');

// 3. Verify ListeningQuestionPane.jsx
const questionPanePath = path.resolve(__dirname, '../src/components/listening/ListeningQuestionPane.jsx');
assert.ok(fs.existsSync(questionPanePath), 'ListeningQuestionPane.jsx must exist');
const qCode = fs.readFileSync(questionPanePath, 'utf8');

assert.ok(qCode.includes('hidePartHeader = false'), 'ListeningQuestionPane must accept hidePartHeader prop');
assert.ok(qCode.includes('!hidePartHeader &&'), 'ListeningQuestionPane must conditionally hide redundant Part Header Card');
assert.ok(qCode.includes('max-w-5xl mx-auto'), 'ListeningQuestionPane must expand question width in split mode');
console.log('  ✅ 3. ListeningQuestionPane adapts to full-height right column without header crowding');

// 4. Verify AudioPlayerBar.jsx
const audioBarPath = path.resolve(__dirname, '../src/components/listening/AudioPlayerBar.jsx');
assert.ok(fs.existsSync(audioBarPath), 'AudioPlayerBar.jsx must exist');
const audioCode = fs.readFileSync(audioBarPath, 'utf8');

assert.ok(audioCode.includes('inSplitPane = false'), 'AudioPlayerBar must accept inSplitPane prop');
assert.ok(audioCode.includes('if (inSplitPane) {'), 'AudioPlayerBar must have dedicated compact branch for split pane');
console.log('  ✅ 4. AudioPlayerBar provides compact left-pane controls');

console.log('🎉 Step 127: Listening Split-Screen Two-Column Layout Verified 100% Cleanly!');
