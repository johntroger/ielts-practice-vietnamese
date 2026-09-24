import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { 
  splitSentences, 
  classifySentence, 
  analyzeSentenceStructures 
} from '../src/services/sentenceAnalyzer.js';
import { FEATURE_REGISTRY } from '../src/core/featureRegistry.js';

console.log('🧪 Testing Step 26: Cambridge GRA Sentence Structure Heatmap & Analyzer');

// 1. Test Sentence Splitting & Edge Cases (Decimals, Abbreviations)
const textWithDecimals = 'In 2022, inflation reached 8.5% across Europe. This led to serious financial strain for households.';
const splitDecimals = splitSentences(textWithDecimals);
assert.equal(splitDecimals.length, 2, 'Should not split on decimal numbers like 8.5%');

const textWithAbbr = 'Various developed nations, e.g. Japan and South Korea, face demographic decline. They must attract immigrants.';
const splitAbbr = splitSentences(textWithAbbr);
assert.equal(splitAbbr.length, 2, 'Should not split on abbreviations like e.g.');

console.log('  ✅ 1. splitSentences handles decimals, percentages and abbreviations accurately');

// 2. Test Complex Sentence Recognition
const complex1 = 'Although many people advocate for remote working, it can diminish interpersonal collaboration.';
assert.equal(classifySentence(complex1).type, 'complex', 'Should identify "Although" concessive clause as complex');

const complex2 = 'The municipal council implemented congestion charges, which significantly alleviated downtown traffic jams.';
assert.equal(classifySentence(complex2).type, 'complex', 'Should identify non-restrictive relative clause ", which" as complex');

const complex3 = 'If authorities subsidize electric vehicles, carbon emissions from private transport will decrease.';
assert.equal(classifySentence(complex3).type, 'complex', 'Should identify conditional "If" clause as complex');

const complex4 = 'Not only does education enhance career prospects, but it also fosters critical thinking skills.';
assert.equal(classifySentence(complex4).type, 'complex', 'Should identify negative inversion "Not only... but also" as complex');

const complex5 = 'Given the alarming rate of global deforestation, international treaties are desperately needed.';
assert.equal(classifySentence(complex5).type, 'complex', 'Should identify participial clause "Given the..." as complex');

console.log('  ✅ 2. classifySentence accurately detects Cambridge complex structures (concession, relatives, conditionals, inversions, participles)');

// 3. Test Compound Sentence Recognition
const compound1 = 'Solar power reduces greenhouse gas emissions, and it provides a reliable source of decentralized energy.';
assert.equal(classifySentence(compound1).type, 'compound', 'Should identify comma + FANBOYS linking clauses as compound');

const compound2 = 'The construction costs were exorbitant; however, the long-term economic returns justified the investment.';
assert.equal(classifySentence(compound2).type, 'compound', 'Should identify semicolon with conjunctive adverb as compound');

console.log('  ✅ 3. classifySentence accurately identifies compound sentences (FANBOYS and semicolons)');

// 4. Test Simple Sentence Recognition
const simple1 = 'The local government should build more public parks for city residents.';
assert.equal(classifySentence(simple1).type, 'simple', 'Should classify single independent clause as simple');

const simple2 = 'Both teachers and parents play a vital role in child development.';
assert.equal(classifySentence(simple2).type, 'simple', 'Compound subject with single predicate remains simple sentence');

console.log('  ✅ 4. classifySentence correctly categorizes single independent clauses as simple sentences');

// 5. Test Live Essay Analysis & Cambridge Band GRA Calibration
const band7Essay = `
Although technological advancement has modernized daily communication, it has created unprecedented privacy challenges.
Many social platforms harvest user data without explicit consent, and they sell these profiles to third-party advertisers.
If strict legislative frameworks are not enacted, individual liberties will be severely compromised.
Furthermore, artificial intelligence algorithms can manipulate consumer behavior, which undermines democratic processes.
Therefore, governments must intervene to safeguard citizens.
`;

const band7Analysis = analyzeSentenceStructures(band7Essay);
assert.equal(band7Analysis.totalSentences, 5, 'Should count 5 total sentences');
assert.ok(band7Analysis.complexPercentage >= 50, `Complex sentence percentage should be >= 50% (got ${band7Analysis.complexPercentage}%)`);
assert.equal(band7Analysis.status, 'optimal', 'High complex ratio should yield optimal status');
assert.ok(band7Analysis.graBandEstimate.includes('7') || band7Analysis.graBandEstimate.includes('8'), 'Should estimate Band 7.0+ for high syntactic diversity');

console.log('  ✅ 5. analyzeSentenceStructures awards Band 7.0+ GRA for high complex variety');

// 6. Test Warning on Simple Sentence Overuse
const band5Essay = `
The city is very big. People live in small apartments. Traffic is always crowded. 
Cars make a lot of smoke. Trees are cut down every year. The air becomes dirty.
`;
const band5Analysis = analyzeSentenceStructures(band5Essay);
assert.ok(band5Analysis.simplePercentage > 50, `Simple sentence percentage should be > 50% (got ${band5Analysis.simplePercentage}%)`);
assert.equal(band5Analysis.status, 'needs_improvement', 'Excessive simple sentences must trigger needs_improvement status');
assert.ok(band5Analysis.feedbackMessage.includes('Cảnh báo GRA'), 'Feedback must warn about simple sentence penalty');

console.log('  ✅ 6. analyzeSentenceStructures detects limited range penalty when simple sentences exceed threshold');

// 7. Verify UI Component Integration
const editorPath = path.resolve('src/components/EditorPane.jsx');
const editorCode = fs.readFileSync(editorPath, 'utf8');
assert.ok(editorCode.includes('SentenceHeatmapModal'), 'EditorPane.jsx must import SentenceHeatmapModal');
assert.ok(editorCode.includes('analyzeSentenceStructures'), 'EditorPane.jsx must use analyzeSentenceStructures');
assert.ok(editorCode.includes('Cấu Trúc GRA'), 'EditorPane toolbar must expose Cấu Trúc GRA button');

const modalPath = path.resolve('src/components/SentenceHeatmapModal.jsx');
assert.ok(fs.existsSync(modalPath), 'SentenceHeatmapModal.jsx must exist');
const modalCode = fs.readFileSync(modalPath, 'utf8');
assert.ok(modalCode.includes('Bản Đồ Nhiệt Cấu Trúc Câu'), 'Modal must render header title');
assert.ok(modalCode.includes('GOLDEN_GRA_TEMPLATES'), 'Modal must provide Golden GRA sentence templates');

console.log('  ✅ 7. EditorPane and SentenceHeatmapModal successfully wired together');

// 8. Verify Feature Registry Documentation
const registered = FEATURE_REGISTRY.find(f => f.id === 'feat-sentence-structure-heatmap');
assert.ok(registered, 'Feature Registry must document feat-sentence-structure-heatmap');
assert.equal(registered.category, 'ai_evaluation', 'Registered in valid category');

console.log('  ✅ 8. Feature Registry documents GRA Heatmap for automatic Help Center discovery');

console.log('\n🎉 Step 26: Cambridge GRA Sentence Structure Heatmap & Analyzer tests PASSED 100%!\n');
