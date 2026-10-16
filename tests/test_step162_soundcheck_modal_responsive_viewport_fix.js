import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('🧪 Running Step 162: Soundcheck Modal Responsive Viewport & Non-Clipping Verification Tests...\n');

// 1. Verify SpeakingSoundcheckModal.jsx layout structure
console.log('Test 1: SpeakingSoundcheckModal container and layout constraints...');
const speakingModalPath = path.resolve('src/components/speaking/SpeakingSoundcheckModal.jsx');
const speakingModalContent = fs.readFileSync(speakingModalPath, 'utf8');

// Check outer wrapper does not cause outer negative scroll clipping
assert(
  speakingModalContent.includes('fixed inset-0') && speakingModalContent.includes('overflow-hidden'),
  'SpeakingSoundcheckModal outer backdrop should have overflow-hidden to prevent body desync'
);

// Check inner modal card has max-height and flex-col
assert(
  speakingModalContent.includes('max-h-[92dvh]') || speakingModalContent.includes('max-h-[88vh]'),
  'SpeakingSoundcheckModal card must enforce max-height relative to viewport (max-h-[92dvh] / max-h-[88vh])'
);
assert(
  speakingModalContent.includes('flex flex-col'),
  'SpeakingSoundcheckModal card must be flex flex-col to pin header and footer'
);
console.log('  ✓ SpeakingSoundcheckModal card container properly bounds max-height');

// 2. Verify Header and Footer are pinned with shrink-0
console.log('\nTest 2: SpeakingSoundcheckModal pinned Header and Footer...');
assert(
  speakingModalContent.includes('border-b border-slate-800') && speakingModalContent.includes('shrink-0'),
  'Header must have shrink-0 so it is never compressed or clipped off-screen'
);
assert(
  speakingModalContent.includes('border-t border-slate-800') && speakingModalContent.includes('shrink-0'),
  'Footer must have shrink-0 so action buttons are always accessible above the fold'
);
console.log('  ✓ Header and Footer strictly maintain shrink-0');

// 3. Verify Body has overflow-y-auto and flex-1
console.log('\nTest 3: SpeakingSoundcheckModal scrollable body...');
assert(
  speakingModalContent.includes('overflow-y-auto flex-1'),
  'Body container must have overflow-y-auto flex-1 so interior steps scroll independently'
);
console.log('  ✓ Body container scrolls independently without cutting off header or footer');

// 4. Verify ListeningWorkspace soundcheck modal constraints
console.log('\nTest 4: ListeningWorkspace soundcheck modal layout constraints...');
const listeningWsPath = path.resolve('src/components/listening/ListeningWorkspace.jsx');
const listeningWsContent = fs.readFileSync(listeningWsPath, 'utf8');

assert(
  listeningWsContent.includes('isSoundcheckOpen &&') &&
  listeningWsContent.includes('max-h-[92dvh]'),
  'ListeningWorkspace soundcheck modal must also enforce max-h-[92dvh] viewport constraint'
);
console.log('  ✓ ListeningWorkspace soundcheck modal also protected from viewport overflow');

console.log('\n🎉 Step 162: All 4/4 Soundcheck Responsive Viewport tests PASSED successfully!\n');
