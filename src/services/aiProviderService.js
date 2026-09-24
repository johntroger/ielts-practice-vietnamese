/**
 * Multi-Model AI Provider Adapter Service
 * Provides a unified abstraction layer over Google Gemini, OpenAI, DeepSeek,
 * Anthropic Claude, and Local / Custom OpenAI-compatible endpoints (Ollama, Groq, OpenRouter).
 * Includes automatic fallback and connection testing capabilities.
 */

export const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Nhanh, chi phí tối ưu, mặc định của hệ thống',
    defaultModel: 'gemini-2.5-flash',
    popularModels: ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash-lite'],
    baseUrl: 'https://generativelanguage.googleapis.com',
    authHeader: 'x-goog-api-key'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Mô hình suy luận sâu, ngữ pháp & lập luận rất chuẩn, chi phí cực rẻ',
    defaultModel: 'deepseek-chat',
    popularModels: ['deepseek-chat', 'deepseek-reasoner'],
    baseUrl: 'https://api.deepseek.com/v1',
    authHeader: 'Authorization'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Chuẩn công nghiệp, phản hồi học thuật toàn diện (GPT-4o, GPT-4o-mini)',
    defaultModel: 'gpt-4o-mini',
    popularModels: ['gpt-4o-mini', 'gpt-4o', 'o3-mini'],
    baseUrl: 'https://api.openai.com/v1',
    authHeader: 'Authorization'
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Văn phong tự nhiên nhất, chấm thi viết IELTS chuẩn giám khảo bản ngữ',
    defaultModel: 'claude-3-5-sonnet-20241022',
    popularModels: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    baseUrl: 'https://api.anthropic.com/v1',
    authHeader: 'x-api-key'
  },
  {
    id: 'custom',
    name: 'Custom Endpoint / Local Ollama',
    description: 'Tự cấu hình máy chủ cục bộ (Ollama, LM Studio) hoặc OpenRouter, Groq',
    defaultModel: 'llama3.2',
    popularModels: ['llama3.2', 'mistral', 'qwen2.5'],
    baseUrl: 'http://localhost:11434/v1',
    authHeader: 'Authorization'
  }
];

const CONFIG_STORAGE_KEY = 'ielts_ai_provider_config';

/**
 * Get active AI Provider configuration with safe defaults
 */
export function getAiProviderConfig() {
  const defaultConfig = {
    provider: 'gemini',
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash',
    deepseekApiKey: '',
    deepseekModel: 'deepseek-chat',
    deepseekBaseUrl: 'https://api.deepseek.com/v1',
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    openaiBaseUrl: 'https://api.openai.com/v1',
    claudeApiKey: '',
    claudeModel: 'claude-3-5-sonnet-20241022',
    customApiKey: '',
    customModel: 'llama3.2',
    customBaseUrl: 'http://localhost:11434/v1',
    autoFallback: true
  };

  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultConfig, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to parse AI provider config:', e);
  }

  return defaultConfig;
}

/**
 * Save AI Provider configuration to localStorage
 */
export function saveAiProviderConfig(config) {
  try {
    const current = getAiProviderConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save AI provider config:', e);
    return config;
  }
}

/**
 * Build endpoint URL and headers for a given provider
 */
export function buildProviderRequest(providerId, config) {
  const provider = AI_PROVIDERS.find(p => p.id === providerId) || AI_PROVIDERS[0];

  switch (providerId) {
    case 'deepseek':
      return {
        url: `${(config.deepseekBaseUrl || provider.baseUrl).replace(/\/+$/, '')}/chat/completions`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.deepseekApiKey || ''}`
        },
        model: config.deepseekModel || provider.defaultModel,
        type: 'openai_compatible'
      };

    case 'openai':
      return {
        url: `${(config.openaiBaseUrl || provider.baseUrl).replace(/\/+$/, '')}/chat/completions`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey || ''}`
        },
        model: config.openaiModel || provider.defaultModel,
        type: 'openai_compatible'
      };

    case 'claude':
      return {
        url: `${provider.baseUrl}/messages`,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.claudeApiKey || '',
          'anthropic-version': '2023-06-01'
        },
        model: config.claudeModel || provider.defaultModel,
        type: 'anthropic'
      };

    case 'custom':
      return {
        url: `${(config.customBaseUrl || provider.baseUrl).replace(/\/+$/, '')}/chat/completions`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.customApiKey || ''}`
        },
        model: config.customModel || provider.defaultModel,
        type: 'openai_compatible'
      };

    case 'gemini':
    default:
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel || 'gemini-2.5-flash'}:generateContent?key=${config.geminiApiKey || ''}`,
        headers: {
          'Content-Type': 'application/json'
        },
        model: config.geminiModel || 'gemini-2.5-flash',
        type: 'gemini'
      };
  }
}

/**
 * Format universal payload into provider-specific request body
 */
export function formatPayload(reqType, model, { prompt, systemPrompt, temperature = 0.7, maxTokens = 2048, jsonMode = false }) {
  if (reqType === 'openai_compatible') {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const body = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    };
    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }
    return body;
  }

  if (reqType === 'anthropic') {
    const body = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }]
    };
    if (systemPrompt) {
      body.system = systemPrompt;
    }
    return body;
  }

  // Gemini format
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens
    }
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }
  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }
  return body;
}

/**
 * Extract clean string response from provider response body
 */
export function extractTextResponse(reqType, responseData) {
  if (!responseData) return '';

  if (reqType === 'openai_compatible') {
    return responseData.choices?.[0]?.message?.content || '';
  }

  if (reqType === 'anthropic') {
    const textBlock = (responseData.content || []).find(b => b.type === 'text');
    return textBlock ? textBlock.text : '';
  }

  // Gemini format
  const candidate = responseData.candidates?.[0];
  const part = candidate?.content?.parts?.[0];
  return part?.text || '';
}

/**
 * Universal LLM invocation with automatic multi-provider fallback
 */
export async function callUniversalLlm({
  prompt,
  systemPrompt = '',
  temperature = 0.7,
  maxTokens = 2048,
  jsonMode = false
}) {
  const config = getAiProviderConfig();
  const primaryProvider = config.provider || 'gemini';
  const req = buildProviderRequest(primaryProvider, config);

  try {
    const body = formatPayload(req.type, req.model, {
      prompt,
      systemPrompt,
      temperature,
      maxTokens,
      jsonMode
    });

    const res = await fetch(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Provider ${primaryProvider} failed [HTTP ${res.status}]: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const resultText = extractTextResponse(req.type, data);
    return {
      text: resultText,
      provider: primaryProvider,
      model: req.model,
      fallbackUsed: false
    };
  } catch (err) {
    console.warn(`Primary provider ${primaryProvider} encountered error:`, err.message);

    // If autoFallback enabled and primary wasn't Gemini, try Gemini fallback
    if (config.autoFallback && primaryProvider !== 'gemini' && config.geminiApiKey) {
      try {
        const fallbackReq = buildProviderRequest('gemini', config);
        const fallbackBody = formatPayload(fallbackReq.type, fallbackReq.model, {
          prompt,
          systemPrompt,
          temperature,
          maxTokens,
          jsonMode
        });
        const res = await fetch(fallbackReq.url, {
          method: 'POST',
          headers: fallbackReq.headers,
          body: JSON.stringify(fallbackBody)
        });
        if (res.ok) {
          const data = await res.json();
          return {
            text: extractTextResponse(fallbackReq.type, data),
            provider: 'gemini',
            model: fallbackReq.model,
            fallbackUsed: true,
            originalError: err.message
          };
        }
      } catch (fallbackErr) {
        console.warn('Fallback provider also failed:', fallbackErr.message);
      }
    }

    throw err;
  }
}

/**
 * Test connectivity for a specific provider configuration
 */
export async function testProviderConnection(providerId, config) {
  const req = buildProviderRequest(providerId, config);
  const startTime = Date.now();

  const testBody = formatPayload(req.type, req.model, {
    prompt: 'Reply with "OK" in 1 word.',
    temperature: 0.1,
    maxTokens: 10
  });

  try {
    const res = await fetch(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(testBody)
    });

    const elapsed = Date.now() - startTime;
    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        latencyMs: elapsed,
        error: `HTTP ${res.status}: ${errText.slice(0, 150)}`
      };
    }

    const data = await res.json();
    const text = extractTextResponse(req.type, data);
    return {
      success: true,
      latencyMs: elapsed,
      response: text.trim()
    };
  } catch (err) {
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      error: err.message
    };
  }
}
