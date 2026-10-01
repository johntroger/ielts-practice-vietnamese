/**
 * Test Step 52: Owner Media Permission Guard (Images & Audio Upload Restriction)
 * 
 * Verifies that:
 * 1. Only the Owner (tranthanhtung37@gmail.com) can generate/upload manual tasks containing images or audio files.
 * 2. Other users and guests are blocked from media uploads due to website quota limitations.
 * 3. Text-only tasks can be generated and uploaded by ANY user without restriction.
 * 4. Proper explanation notices are provided guiding users about quota and administrator access.
 */

import {
  OWNER_EMAIL,
  isOwnerUser,
  validateManualMediaPermission,
  sanitizeTaskForStorage,
  OWNER_MEDIA_RESTRICTION_MESSAGE,
  OWNER_AUDIO_RESTRICTION_MESSAGE
} from '../src/utils/userPermissions.js';
import fs from 'fs';
import path from 'path';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

console.log('🧪 Step 52: Owner Media Permission Guard & Quota Restriction Tests');

// ==============================================================================
// 1. Owner Email Verification
// ==============================================================================
console.log('\n--- 1. Owner Identification & Email Matching ---');

assert(OWNER_EMAIL === 'tranthanhtung37@gmail.com', 'Owner email must strictly be tranthanhtung37@gmail.com');

assert(isOwnerUser({ email: 'tranthanhtung37@gmail.com' }) === true, 'Exact owner email matches');
assert(isOwnerUser({ email: 'TranThanhTung37@gmail.com' }) === true, 'Case-insensitive owner email matches');
assert(isOwnerUser({ email: ' tranthanhtung37@gmail.com ' }) === true, 'Trimmed owner email matches');
assert(isOwnerUser({ user_metadata: { email: 'tranthanhtung37@gmail.com' } }) === true, 'Matches email in user_metadata');

assert(isOwnerUser({ email: 'student@example.com' }) === false, 'Non-owner email rejected');
assert(isOwnerUser({ email: 'tungtran@gmail.com' }) === false, 'Different email rejected');
assert(isOwnerUser(null) === false, 'Null user rejected');
assert(isOwnerUser(undefined) === false, 'Undefined user rejected');
assert(isOwnerUser({}) === false, 'Empty user object rejected');
assert(isOwnerUser({ email: '' }) === false, 'Empty email string rejected');

// ==============================================================================
// 2. Permission Validation: Text-Only vs Media Tasks
// ==============================================================================
console.log('\n--- 2. Media Permission Validation ---');

const textOnlyTask = {
  title: 'Task 2: Academic Essay on Automation',
  prompt: 'Some people think that robots will replace workers...',
  sampleAnswer: 'While technological advancements have accelerated...',
  minWords: 250
};

// Text-only is ALWAYS allowed for everyone
assert(validateManualMediaPermission(textOnlyTask, null).allowed === true, 'Text-only task allowed for guest (null user)');
assert(validateManualMediaPermission(textOnlyTask, { email: 'guest@student.vn' }).allowed === true, 'Text-only task allowed for normal user');
assert(validateManualMediaPermission(textOnlyTask, { email: 'tranthanhtung37@gmail.com' }).allowed === true, 'Text-only task allowed for Owner');

const imageTask = {
  title: 'Task 1: Process of Coffee Production',
  prompt: 'The diagram illustrates how coffee beans are processed...',
  imageUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
};

// Image task: Allowed ONLY for Owner
const guestValidation = validateManualMediaPermission(imageTask, null);
assert(guestValidation.allowed === false, 'Image task blocked for guest');
assert(guestValidation.message.includes('tranthanhtung37@gmail.com'), 'Message specifies owner email');
assert(guestValidation.message.includes('dung lượng website giới hạn'), 'Message explains quota limitation');

const userValidation = validateManualMediaPermission(imageTask, { email: 'learner@gmail.com' });
assert(userValidation.allowed === false, 'Image task blocked for regular registered user');

const ownerValidation = validateManualMediaPermission(imageTask, { email: 'tranthanhtung37@gmail.com' });
assert(ownerValidation.allowed === true, 'Image task allowed for Owner');

// Audio task: Allowed ONLY for Owner
const audioTask = {
  title: 'Listening Part 1: Hotel Booking',
  audioBase64: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  isUploadedFile: true
};

assert(validateManualMediaPermission(audioTask, { email: 'regular@gmail.com' }).allowed === false, 'Audio upload blocked for non-owner');
assert(validateManualMediaPermission(audioTask, { email: 'tranthanhtung37@gmail.com' }).allowed === true, 'Audio upload allowed for Owner');

// ==============================================================================
// 3. Sanitizing Tasks for Non-Owner Safe Storage
// ==============================================================================
console.log('\n--- 3. Task Sanitization for Quota Protection ---');

const sanitizedForGuest = sanitizeTaskForStorage(imageTask, null);
assert(!sanitizedForGuest.imageUrl, 'Image URL stripped from guest task');
assert(sanitizedForGuest.title === imageTask.title, 'Task title preserved during sanitization');
assert(sanitizedForGuest.prompt === imageTask.prompt, 'Task prompt preserved during sanitization');

const sanitizedForOwner = sanitizeTaskForStorage(imageTask, { email: 'tranthanhtung37@gmail.com' });
assert(sanitizedForOwner.imageUrl === imageTask.imageUrl, 'Owner task retains image attachment intact');

// ==============================================================================
// 4. Codebase Integration Checks
// ==============================================================================
console.log('\n--- 4. Codebase Audit for Owner Media Restrictions ---');

const taskImageUploaderSrc = fs.readFileSync(path.resolve('src/components/TaskImageUploader.jsx'), 'utf8');
assert(taskImageUploaderSrc.includes('isOwnerUser'), 'TaskImageUploader imports and checks isOwnerUser');
assert(taskImageUploaderSrc.includes('OWNER_EMAIL'), 'TaskImageUploader references OWNER_EMAIL');
assert(taskImageUploaderSrc.includes('OWNER_MEDIA_RESTRICTION_MESSAGE'), 'TaskImageUploader uses standard quota restriction message');
assert(taskImageUploaderSrc.includes('Tính năng nạp hình ảnh/âm thanh đề bài chỉ dành riêng cho Quản trị viên'), 'TaskImageUploader displays explicit admin-only notification banner');

const taskGeneratorModalSrc = fs.readFileSync(path.resolve('src/components/TaskGeneratorModal.jsx'), 'utf8');
assert(taskGeneratorModalSrc.includes('isOwnerUser(user)'), 'TaskGeneratorModal checks owner permission before saving manual tasks with images');

const taskLibraryModalSrc = fs.readFileSync(path.resolve('src/components/TaskLibraryModal.jsx'), 'utf8');
assert(taskLibraryModalSrc.includes('isOwnerUser(user)'), 'TaskLibraryModal checks owner permission before saving manual tasks with images');

const documentIngestModalSrc = fs.readFileSync(path.resolve('src/components/DocumentIngestModal.jsx'), 'utf8');
assert(documentIngestModalSrc.includes('isOwnerUser(user)'), 'DocumentIngestModal checks owner permission for imported tasks');

const listeningModalSrc = fs.readFileSync(path.resolve('src/components/listening/ListeningURLExerciseGeneratorModal.jsx'), 'utf8');
assert(listeningModalSrc.includes('isOwnerUser'), 'ListeningURLExerciseGeneratorModal imports isOwnerUser');
assert(listeningModalSrc.includes('OWNER_AUDIO_RESTRICTION_MESSAGE'), 'Listening modal includes audio quota restriction message');

const microDrillAudioBarSrc = fs.readFileSync(path.resolve('src/components/listening/MicroDrillAudioBar.jsx'), 'utf8');
assert(microDrillAudioBarSrc.includes('isOwnerUser'), 'MicroDrillAudioBar enforces owner check for custom audio uploads');

console.log(`\n===============================================================`);
console.log(`✅ STEP 52 ALL ${passedTests}/${totalTests} TESTS PASSED!`);
console.log(`===============================================================`);
