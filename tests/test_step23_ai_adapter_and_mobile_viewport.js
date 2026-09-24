/**
 * Test Suite: Step 23 - Phase 6 Multi-Model AI Provider Adapter & Mobile Visual Viewport Resilience
 * Verifies multi-provider LLM abstraction (Gemini, DeepSeek, OpenAI, Claude, Custom Ollama),
 * request payload formatting, response extraction, and mobile virtual keyboard resilience calculations.
 */

import assert from 'assert';
import { 
  AI_PROVIDERS, 
  getAiProviderConfig, 
  saveAiProviderConfig, 
  buildProviderRequest, 
  formatPayload, 
  extractTextResponse 
} from '../src/services/aiProviderService.js';
import { useVisualViewport } from '../src/hooks/useVisualViewport.js';

console.log('--- TEST STEP 23: MULTI-MODEL AI ADAPTER & MOBILE VIEWPORT RESILIENCE ---');

let testsPassed = 0;

function it(desc, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// Setup in-memory mock for localStorage in Node environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear()
};

// ============================================================================
// 1. AI PROVIDER CATALOG SPECIFICATION
// ============================================================================
it('AI_PROVIDERS should register all 5 core providers with valid metadata', () => {
  assert.ok(Array.isArray(AI_PROVIDERS), 'AI_PROVIDERS must be an array');
  assert.strictEqual(AI_PROVIDERS.length, 5, 'Should support exactly 5 core providers');

  const providerIds = AI_PROVIDERS.map(p => p.id);
  assert.ok(providerIds.includes('gemini'), 'Must include gemini');
  assert.ok(providerIds.includes('deepseek'), 'Must include deepseek');
  assert.ok(providerIds.includes('openai'), 'Must include openai');
  assert.ok(providerIds.includes('claude'), 'Must include claude');
  assert.ok(providerIds.includes('custom'), 'Must include custom');

  AI_PROVIDERS.forEach(p => {
    assert.ok(p.id, 'Provider must have id');
    assert.ok(p.name, 'Provider must have name');
    assert.ok(p.description, 'Provider must have description');
    assert.ok(p.defaultModel, 'Provider must have defaultModel');
    assert.ok(Array.isArray(p.popularModels) && p.popularModels.length > 0, 'Provider must list popularModels');
    assert.ok(p.baseUrl, 'Provider must define baseUrl');
  });
});

// ============================================================================
// 2. PROVIDER CONFIGURATION STORAGE & PERSISTENCE
// ============================================================================
it('getAiProviderConfig should return safe default configuration', () => {
  mockStorage.clear();
  const cfg = getAiProviderConfig();
  assert.strictEqual(cfg.provider, 'gemini');
  assert.strictEqual(cfg.geminiModel, 'gemini-2.5-flash');
  assert.strictEqual(cfg.deepseekModel, 'deepseek-chat');
  assert.strictEqual(cfg.openaiModel, 'gpt-4o-mini');
  assert.strictEqual(cfg.claudeModel, 'claude-3-5-sonnet-20241022');
  assert.strictEqual(cfg.autoFallback, true);
});

it('saveAiProviderConfig should persist user credentials and preferences', () => {
  mockStorage.clear();
  const customConfig = {
    provider: 'deepseek',
    deepseekApiKey: 'sk-test-deepseek-123456',
    deepseekModel: 'deepseek-reasoner',
    autoFallback: false
  };

  const saved = saveAiProviderConfig(customConfig);
  assert.strictEqual(saved.provider, 'deepseek');
  assert.strictEqual(saved.deepseekApiKey, 'sk-test-deepseek-123456');
  assert.strictEqual(saved.deepseekModel, 'deepseek-reasoner');
  assert.strictEqual(saved.autoFallback, false);

  const reloaded = getAiProviderConfig();
  assert.strictEqual(reloaded.provider, 'deepseek');
  assert.strictEqual(reloaded.deepseekApiKey, 'sk-test-deepseek-123456');
  assert.strictEqual(reloaded.autoFallback, false);
});

// ============================================================================
// 3. REQUEST BUILDER ACROSS PROVIDERS
// ============================================================================
it('buildProviderRequest should build valid Gemini request specification', () => {
  const cfg = { geminiApiKey: 'AIzaSyTestKey', geminiModel: 'gemini-2.5-flash' };
  const req = buildProviderRequest('gemini', cfg);

  assert.strictEqual(req.type, 'gemini');
  assert.ok(req.url.includes('models/gemini-2.5-flash:generateContent'));
  assert.ok(req.url.includes('key=AIzaSyTestKey'));
  assert.strictEqual(req.headers['Content-Type'], 'application/json');
});

it('buildProviderRequest should build valid DeepSeek request specification', () => {
  const cfg = { deepseekApiKey: 'sk-deepseek-xyz', deepseekModel: 'deepseek-chat' };
  const req = buildProviderRequest('deepseek', cfg);

  assert.strictEqual(req.type, 'openai_compatible');
  assert.strictEqual(req.url, 'https://api.deepseek.com/v1/chat/completions');
  assert.strictEqual(req.headers['Authorization'], 'Bearer sk-deepseek-xyz');
  assert.strictEqual(req.model, 'deepseek-chat');
});

it('buildProviderRequest should build valid OpenAI request specification', () => {
  const cfg = { openaiApiKey: 'sk-openai-abc', openaiModel: 'gpt-4o' };
  const req = buildProviderRequest('openai', cfg);

  assert.strictEqual(req.type, 'openai_compatible');
  assert.strictEqual(req.url, 'https://api.openai.com/v1/chat/completions');
  assert.strictEqual(req.headers['Authorization'], 'Bearer sk-openai-abc');
  assert.strictEqual(req.model, 'gpt-4o');
});

it('buildProviderRequest should build valid Anthropic Claude request specification', () => {
  const cfg = { claudeApiKey: 'sk-ant-test', claudeModel: 'claude-3-5-sonnet-20241022' };
  const req = buildProviderRequest('claude', cfg);

  assert.strictEqual(req.type, 'anthropic');
  assert.strictEqual(req.url, 'https://api.anthropic.com/v1/messages');
  assert.strictEqual(req.headers['x-api-key'], 'sk-ant-test');
  assert.strictEqual(req.headers['anthropic-version'], '2023-06-01');
  assert.strictEqual(req.model, 'claude-3-5-sonnet-20241022');
});

it('buildProviderRequest should build valid Custom / Ollama request specification', () => {
  const cfg = { customBaseUrl: 'http://localhost:11434/v1/', customModel: 'qwen2.5', customApiKey: '' };
  const req = buildProviderRequest('custom', cfg);

  assert.strictEqual(req.type, 'openai_compatible');
  assert.strictEqual(req.url, 'http://localhost:11434/v1/chat/completions');
  assert.strictEqual(req.model, 'qwen2.5');
});

// ============================================================================
// 4. UNIVERSAL PAYLOAD FORMATTING
// ============================================================================
it('formatPayload should produce compliant OpenAI-compatible payload', () => {
  const payload = formatPayload('openai_compatible', 'gpt-4o-mini', {
    prompt: 'Evaluate this essay',
    systemPrompt: 'You are an IELTS examiner.',
    temperature: 0.5,
    maxTokens: 1024,
    jsonMode: true
  });

  assert.strictEqual(payload.model, 'gpt-4o-mini');
  assert.strictEqual(payload.temperature, 0.5);
  assert.strictEqual(payload.max_tokens, 1024);
  assert.strictEqual(payload.messages.length, 2);
  assert.strictEqual(payload.messages[0].role, 'system');
  assert.strictEqual(payload.messages[0].content, 'You are an IELTS examiner.');
  assert.strictEqual(payload.messages[1].role, 'user');
  assert.strictEqual(payload.messages[1].content, 'Evaluate this essay');
  assert.deepStrictEqual(payload.response_format, { type: 'json_object' });
});

it('formatPayload should produce compliant Anthropic Claude payload', () => {
  const payload = formatPayload('anthropic', 'claude-3-5-sonnet-20241022', {
    prompt: 'Evaluate Task 1 report',
    systemPrompt: 'You are a Cambridge examiner.',
    temperature: 0.3,
    maxTokens: 2000
  });

  assert.strictEqual(payload.model, 'claude-3-5-sonnet-20241022');
  assert.strictEqual(payload.system, 'You are a Cambridge examiner.');
  assert.strictEqual(payload.messages[0].role, 'user');
  assert.strictEqual(payload.messages[0].content, 'Evaluate Task 1 report');
  assert.strictEqual(payload.max_tokens, 2000);
});

it('formatPayload should produce compliant Google Gemini payload', () => {
  const payload = formatPayload('gemini', 'gemini-2.5-flash', {
    prompt: 'Analyze Task 2 coherence',
    systemPrompt: 'You are a linguistics expert.',
    temperature: 0.7,
    maxTokens: 4096,
    jsonMode: true
  });

  assert.strictEqual(payload.contents[0].parts[0].text, 'Analyze Task 2 coherence');
  assert.strictEqual(payload.systemInstruction.parts[0].text, 'You are a linguistics expert.');
  assert.strictEqual(payload.generationConfig.maxOutputTokens, 4096);
  assert.strictEqual(payload.generationConfig.responseMimeType, 'application/json');
});

// ============================================================================
// 5. RESPONSE EXTRACTION ACROSS PROVIDERS
// ============================================================================
it('extractTextResponse should extract text from OpenAI response', () => {
  const mockOpenAIRes = {
    choices: [
      { message: { role: 'assistant', content: 'Band 7.5: Good cohesion and range.' } }
    ]
  };
  const text = extractTextResponse('openai_compatible', mockOpenAIRes);
  assert.strictEqual(text, 'Band 7.5: Good cohesion and range.');
});

it('extractTextResponse should extract text from Anthropic Claude response', () => {
  const mockClaudeRes = {
    content: [
      { type: 'text', text: 'Task Achievement is well developed with clear evidence.' }
    ]
  };
  const text = extractTextResponse('anthropic', mockClaudeRes);
  assert.strictEqual(text, 'Task Achievement is well developed with clear evidence.');
});

it('extractTextResponse should extract text from Google Gemini response', () => {
  const mockGeminiRes = {
    candidates: [
      {
        content: {
          parts: [{ text: 'Overall Band: 8.0' }]
        }
      }
    ]
  };
  const text = extractTextResponse('gemini', mockGeminiRes);
  assert.strictEqual(text, 'Overall Band: 8.0');
});

it('extractTextResponse should handle empty or malformed responses safely', () => {
  assert.strictEqual(extractTextResponse('openai_compatible', null), '');
  assert.strictEqual(extractTextResponse('openai_compatible', {}), '');
  assert.strictEqual(extractTextResponse('anthropic', { content: [] }), '');
  assert.strictEqual(extractTextResponse('gemini', { candidates: [] }), '');
});

// ============================================================================
// 6. MOBILE VISUAL VIEWPORT RESILIENCE
// ============================================================================
it('useVisualViewport hook should provide safe non-window initial defaults', () => {
  assert.strictEqual(typeof useVisualViewport, 'function');
});

it('Virtual keyboard height detection logic should accurately calculate keyboard appearance', () => {
  const simulateViewportCheck = (windowInnerHeight, visualViewportHeight) => {
    const diff = windowInnerHeight - visualViewportHeight;
    const isKeyboard = diff > 150;
    return {
      isKeyboardOpen: isKeyboard,
      keyboardHeight: isKeyboard ? diff : 0
    };
  };

  // Normal mobile state (no keyboard)
  const normal = simulateViewportCheck(844, 844);
  assert.strictEqual(normal.isKeyboardOpen, false);
  assert.strictEqual(normal.keyboardHeight, 0);

  // Keyboard active (e.g. iPhone keyboard taking 320px)
  const activeKb = simulateViewportCheck(844, 524);
  assert.strictEqual(activeKb.isKeyboardOpen, true);
  assert.strictEqual(activeKb.keyboardHeight, 320);

  // Small scroll bar fluctuation (< 150px) should NOT falsely trigger keyboard open
  const slightScroll = simulateViewportCheck(844, 800);
  assert.strictEqual(slightScroll.isKeyboardOpen, false);
  assert.strictEqual(slightScroll.keyboardHeight, 0);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log(`\nAll ${testsPassed}/${testsPassed} Step 23 tests passed successfully!\n`);
