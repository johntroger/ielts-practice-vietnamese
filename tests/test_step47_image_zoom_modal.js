/**
 * Step 47: Interactive Image Viewer & Zoom In / Zoom Out Controls Test Suite
 * Validates ImageViewerModal implementation, scale range (50% - 400%),
 * pan/drag navigation, and integration across ProcessMapRenderer, PromptPane, and TaskImageUploader.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('🧪 Starting Step 47 Test Suite: Interactive Image Viewer & Zoom Controls...\n');

let testsPassed = 0;

// Test 1: Verify ImageViewerModal Component File & Exports
console.log('Test 1: Verify ImageViewerModal component exists and has required features...');
const modalPath = path.resolve('src/components/ImageViewerModal.jsx');
assert(fs.existsSync(modalPath), 'ImageViewerModal.jsx must exist');
const modalCode = fs.readFileSync(modalPath, 'utf-8');

assert(modalCode.includes('export default function ImageViewerModal'), 'Must export default ImageViewerModal');
assert(modalCode.includes('handleZoomIn') && modalCode.includes('handleZoomOut'), 'Must have handleZoomIn and handleZoomOut');
assert(modalCode.includes('handleReset'), 'Must have handleReset to 100%');
assert(modalCode.includes('scale'), 'Must manage zoom scale state');
assert(modalCode.includes('Math.min(4'), 'Must support zoom up to 400% (4x)');
assert(modalCode.includes('Math.max(0.5'), 'Must support zoom down to 50% (0.5x)');
assert(modalCode.includes('ZoomIn') && modalCode.includes('ZoomOut'), 'Must render ZoomIn and ZoomOut buttons');

testsPassed++;
console.log('  ✅ Test 1 Passed: ImageViewerModal component verified with Zoom + and Zoom - features.');

// Test 2: Keyboard and Mouse Navigation Support
console.log('Test 2: Verify keyboard shortcuts and drag-to-pan navigation...');
assert(modalCode.includes('handleWheel'), 'Must support mouse wheel zooming');
assert(modalCode.includes('handleMouseDown') && modalCode.includes('handleMouseMove'), 'Must support drag-to-pan');
assert(modalCode.includes("e.key === '+'") || modalCode.includes("e.key === '='"), 'Must support + key to zoom in');
assert(modalCode.includes("e.key === '-'"), 'Must support - key to zoom out');
assert(modalCode.includes("e.key === '0'"), 'Must support 0 key to reset');
assert(modalCode.includes("e.key === 'Escape'"), 'Must support Escape key to close');

testsPassed++;
console.log('  ✅ Test 2 Passed: Mouse wheel, drag-to-pan, and keyboard shortcuts verified.');

// Test 3: Integration in ProcessMapRenderer
console.log('Test 3: Verify ProcessMapRenderer uses ImageViewerModal for Task 1 Process & Map diagrams...');
const rendererPath = path.resolve('src/components/ProcessMapRenderer.jsx');
const rendererCode = fs.readFileSync(rendererPath, 'utf-8');

assert(rendererCode.includes("import ImageViewerModal from './ImageViewerModal"), 'ProcessMapRenderer must import ImageViewerModal');
assert(rendererCode.includes('<ImageViewerModal'), 'ProcessMapRenderer must render ImageViewerModal');
assert(!rendererCode.includes('<img\n                src={effectiveTask.imageUrl}\n                alt={task.title}\n                className="max-h-[80vh]'), 'Static zoom modal in ProcessMapRenderer must be replaced');

testsPassed++;
console.log('  ✅ Test 3 Passed: ProcessMapRenderer successfully integrated with ImageViewerModal.');

// Test 4: Integration in PromptPane (General Task 1 Charts)
console.log('Test 4: Verify PromptPane uses ImageViewerModal for Task 1 exam charts...');
const promptPanePath = path.resolve('src/components/PromptPane.jsx');
const promptPaneCode = fs.readFileSync(promptPanePath, 'utf-8');

assert(promptPaneCode.includes("import ImageViewerModal from './ImageViewerModal'"), 'PromptPane must import ImageViewerModal');
assert(promptPaneCode.includes('<ImageViewerModal'), 'PromptPane must render ImageViewerModal');

testsPassed++;
console.log('  ✅ Test 4 Passed: PromptPane successfully integrated with ImageViewerModal.');

// Test 5: Integration in TaskImageUploader (User Attached & Uploaded Images)
console.log('Test 5: Verify TaskImageUploader uses ImageViewerModal...');
const uploaderPath = path.resolve('src/components/TaskImageUploader.jsx');
const uploaderCode = fs.readFileSync(uploaderPath, 'utf-8');

assert(uploaderCode.includes("import ImageViewerModal from './ImageViewerModal'"), 'TaskImageUploader must import ImageViewerModal');
assert(uploaderCode.includes('<ImageViewerModal'), 'TaskImageUploader must render ImageViewerModal');

testsPassed++;
console.log('  ✅ Test 5 Passed: TaskImageUploader successfully integrated with ImageViewerModal.');

console.log('\n===============================================================');
console.log(`🎉 All ${testsPassed}/${testsPassed} tests passed cleanly in Step 47!`);
console.log('===============================================================\n');
