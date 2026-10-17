/**
 * Core Gemini API Client & Resilience Engine
 * Handles low-level HTTP requests, rate limiting, model fallback chains, and robust JSON parsing.
 */

const DEFAULT_MODEL = 'gemini-3.6-flash';

export const DEPRECATED_GEMINI_MODELS = [
  'gemini-2.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.0-pro',
  'gemini-1.0-pro-001',
  'gemini-pro',
  'gemini-pro-vision'
];

export function isCurrentUiEnglish(langOverride = null) {
  if (langOverride === 'en' || langOverride === true) return true;
  if (langOverride === 'vi' || langOverride === false) return false;
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('ielts_ui_language') === 'en';
    }
  } catch (e) {}
  return false;
}

export const POPULAR_GEMINI_MODELS = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash (Khuyên dùng - Thế hệ mới nhất GA, phản hồi siêu tốc & tối ưu token)',
    nameEn: 'Gemini 3.6 Flash (Recommended - Latest GA generation, ultra-fast & token-optimized)'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Tiêu chuẩn - Ổn định cao, chấm điểm Cambridge chuẩn xác)',
    nameEn: 'Gemini 2.5 Flash (Standard - High stability, accurate Cambridge band scoring)'
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite (Siêu nhẹ - Tiết kiệm tối đa hạn ngạch API 15 RPM)',
    nameEn: 'Gemini 2.5 Flash-Lite (Ultra-light - Maximizes 15 RPM free API quota)'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview (Chuyên sâu - Khảo thí nâng cao, lập luận Band 8.5+)',
    nameEn: 'Gemini 3.1 Pro Preview (Advanced - Deep examiner reasoning for Band 8.5+)'
  }
];

export function getLocalizedGeminiModels(isEn = isCurrentUiEnglish()) {
  return POPULAR_GEMINI_MODELS.map(m => ({
    ...m,
    displayName: isEn ? (m.nameEn || m.name) : m.name
  }));
}

function cleanModelName(model) {
  if (!model) return 'gemini-3.6-flash';
  const cleaned = model.replace(/^models\//, '').trim();
  const validSupported = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-pro-preview'];
  if (DEPRECATED_GEMINI_MODELS.includes(cleaned) || cleaned.startsWith('gemini-1.') || cleaned.startsWith('gemini-2.0')) {
    return 'gemini-3.6-flash';
  }
  return validSupported.includes(cleaned) ? cleaned : 'gemini-3.6-flash';
}

/**
 * Smart Fallback Chain when Quota (429 / RESOURCE_EXHAUSTED) or model availability error occurs.
 */
const MODEL_FALLBACK_CHAIN = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.1-pro-preview'
];

/**
 * Parses raw Gemini error response into friendly bilingual (EN/VI) message with guidance.
 */
export function formatFriendlyGeminiError(errorData, statusCode, lang = null) {
  const isEn = isCurrentUiEnglish(lang);
  const rawMsg = errorData?.error?.message || '';
  const status = errorData?.error?.status || '';

  if (statusCode === 429 || status === 'RESOURCE_EXHAUSTED' || /quota|exhausted|rate limit/i.test(rawMsg)) {
    return isEn
      ? 'Google Gemini API quota is temporarily rate-limited (Too many concurrent requests - HTTP 429). The system attempted fallback models, but all are currently busy. Please wait 30–60 seconds and try again!'
      : 'Hạn ngạch Google Gemini API tạm thời bị giới hạn (Quá nhiều yêu cầu cùng lúc - Quota 429). Hệ thống đã thử chuyển sang mô hình dự phòng nhưng tất cả đều đang bận. Vui lòng đợi 30 - 60 giây và thử lại!';
  }

  if (statusCode === 400 && /API_KEY_INVALID|invalid api key/i.test(rawMsg)) {
    return isEn
      ? 'Invalid or deactivated Google Gemini API Key. Please verify your API Key in Settings.'
      : 'Google Gemini API Key không hợp lệ hoặc đã bị vô hiệu hóa. Vui lòng kiểm tra lại Key trong mục Cài đặt.';
  }

  if (statusCode === 403 || /permission|unregistered/i.test(rawMsg)) {
    return isEn
      ? 'Your API Key does not have permission to access this model or your region is restricted. Please check your Google AI Studio account.'
      : 'API Key không có quyền truy cập mô hình này hoặc quốc gia của bạn bị hạn chế. Vui lòng kiểm tra lại tài khoản Google AI Studio.';
  }

  if (statusCode === 503 || statusCode === 500 || /overloaded/i.test(rawMsg)) {
    return isEn
      ? 'Google Gemini servers are temporarily overloaded (503 Service Unavailable). Please try again in a few moments.'
      : 'Máy chủ Google Gemini đang quá tải tạm thời (503 Service Unavailable). Vui lòng thử lại sau giây lát.';
  }

  return rawMsg || (isEn
    ? `Error from Google Gemini server (${statusCode || 'Network'})`
    : `Lỗi từ máy chủ Google Gemini (${statusCode || 'Mạng'})`);
}

const GEMINI_RESPONSE_CACHE = new Map();
const MAX_CLIENT_CACHE_ENTRIES = 60;

/**
 * Computes a fast deterministic hash for a Gemini request payload (model + body)
 * for client-side and Edge AI Proxy deduplication.
 */
export function computeClientPromptHash(model, body) {
  const cleanModel = cleanModelName(model);
  const raw = `${cleanModel}:${typeof body === 'string' ? body : JSON.stringify(body || {})}`;
  let h1 = 0xdeadbeef ^ raw.length;
  let h2 = 0x41c6ce57 ^ raw.length;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `ai_${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

export function getCachedGeminiResponse(promptHash) {
  if (!promptHash || !GEMINI_RESPONSE_CACHE.has(promptHash)) return null;
  const entry = GEMINI_RESPONSE_CACHE.get(promptHash);
  if (Date.now() > entry.expiresAt) {
    GEMINI_RESPONSE_CACHE.delete(promptHash);
    return null;
  }
  return entry.payload;
}

export function setCachedGeminiResponse(promptHash, payload, ttlMs = 3600 * 1000) {
  if (!promptHash || !payload) return;
  if (GEMINI_RESPONSE_CACHE.size >= MAX_CLIENT_CACHE_ENTRIES) {
    const oldestKey = GEMINI_RESPONSE_CACHE.keys().next().value;
    if (oldestKey) GEMINI_RESPONSE_CACHE.delete(oldestKey);
  }
  GEMINI_RESPONSE_CACHE.set(promptHash, {
    payload,
    expiresAt: Date.now() + ttlMs
  });
}

export function clearGeminiResponseCache() {
  GEMINI_RESPONSE_CACHE.clear();
}

export function resolveEdgeAiProxyUrl() {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_EDGE_AI_PROXY_URL) {
        return import.meta.env.VITE_EDGE_AI_PROXY_URL;
      }
      if (import.meta.env.VITE_R2_PUBLIC_BASE_URL) {
        return `${String(import.meta.env.VITE_R2_PUBLIC_BASE_URL).replace(/\/$/, '')}/api/ai/generate`;
      }
    }
  } catch (e) {}
  return '';
}

/**
 * Calls the Cloudflare Worker AI Proxy Gateway (/api/ai/generate) which provides
 * SHA-256 Edge + R2 prompt response caching and central API key fallback.
 */
export async function callGeminiViaEdgeProxy({
  proxyUrl,
  model,
  apiKey,
  body,
  apiVersion = 'v1beta',
  cacheable = false,
  cacheTtlSeconds = 86400
}) {
  const endpoint = proxyUrl || resolveEdgeAiProxyUrl();
  if (!endpoint) return null;

  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cleanModelName(model),
      apiKey,
      body,
      apiVersion,
      cacheable,
      cacheTtlSeconds
    })
  });
}

/**
 * Universal Gemini API caller with automatic fallback across models & API versions:
 * 1. Client-side & Cloudflare Edge AI Proxy SHA-256 response cache for deterministic requests
 * 2. Automatic version switch (v1beta <-> v1) on 404/400
 * 3. Automatic model fallback on 429 Quota Exceeded (RESOURCE_EXHAUSTED) or 503 Overloaded
 * 4. Short backoff pause before retrying
 */
export async function callGeminiApi({
  model,
  apiKey,
  body,
  apiVersion = 'v1beta',
  cacheable = false,
  useEdgeProxy = false,
  cacheTtlSeconds = 86400
}) {
  const initialModel = cleanModelName(model);
  const temperature = body?.generationConfig?.temperature;
  const isDeterministic = cacheable === true || (typeof temperature === 'number' && temperature <= 0.25);
  const promptHash = isDeterministic ? computeClientPromptHash(initialModel, body) : null;

  if (promptHash) {
    const cachedPayload = getCachedGeminiResponse(promptHash);
    if (cachedPayload) {
      return new Response(JSON.stringify(cachedPayload), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-IELTS-AI-Cache': 'CLIENT-HIT',
          'X-IELTS-AI-Hash': promptHash
        }
      });
    }
  }

  // Optional Cloudflare Worker Edge AI Proxy Gateway routing
  if (useEdgeProxy) {
    try {
      const proxyRes = await callGeminiViaEdgeProxy({
        model: initialModel,
        apiKey,
        body,
        apiVersion,
        cacheable: isDeterministic,
        cacheTtlSeconds
      });
      if (proxyRes && proxyRes.ok) {
        if (promptHash) {
          const cloneData = await proxyRes.clone().json().catch(() => null);
          if (cloneData) setCachedGeminiResponse(promptHash, cloneData, cacheTtlSeconds * 1000);
        }
        return proxyRes;
      }
    } catch (proxyErr) {
      console.warn('[Gemini API] Edge AI Proxy unreachable, falling back to direct Gemini endpoint:', proxyErr?.message || proxyErr);
    }
  }

  // Build candidate model order starting with the requested model
  const modelsToTry = [
    initialModel,
    ...MODEL_FALLBACK_CHAIN.filter(m => m !== initialModel)
  ];

  let lastResponse = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    const isFallback = i > 0;

    if (isFallback) {
      console.warn(`[Gemini API] Automatically falling back to backup model: ${currentModel} due to rate limit on previous model.`);
      // Short backoff before retry
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const primaryUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${currentModel}:generateContent?key=${apiKey}`;
    
    try {
      let response = await fetch(primaryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // If model is not found in v1beta, automatically fallback to v1 (or vice versa)
      if (!response.ok && (response.status === 404 || response.status === 400)) {
        const fallbackVersion = apiVersion === 'v1beta' ? 'v1' : 'v1beta';
        const fallbackUrl = `https://generativelanguage.googleapis.com/${fallbackVersion}/models/${currentModel}:generateContent?key=${apiKey}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (fallbackResponse.ok) {
          if (promptHash && typeof fallbackResponse.clone === 'function') {
            const cloneData = await fallbackResponse.clone().json().catch(() => null);
            if (cloneData) setCachedGeminiResponse(promptHash, cloneData, cacheTtlSeconds * 1000);
          }
          return fallbackResponse;
        }
        response = fallbackResponse;
      }

      // If call succeeds, cache if deterministic and return immediately
      if (response.ok) {
        if (promptHash && typeof response.clone === 'function') {
          const cloneData = await response.clone().json().catch(() => null);
          if (cloneData) setCachedGeminiResponse(promptHash, cloneData, cacheTtlSeconds * 1000);
        }
        return response;
      }

      lastResponse = response;

      // Check if it's a quota / rate limit (429) or overload (503), try next model in fallback chain
      if (response.status === 429 || response.status === 503) {
        continue;
      }

      // For client configuration errors like invalid key (400 / 403), do not burn through fallbacks
      if (response.status === 400 || response.status === 403) {
        break;
      }

    } catch (networkErr) {
      console.error(`[Gemini API] Network error on model ${currentModel}:`, networkErr);
      if (i === modelsToTry.length - 1) {
        throw networkErr;
      }
    }
  }

  return lastResponse;
}

/**
 * Robust JSON Extractor & Sanitizer for Gemini Responses
 * Prevents "Unterminated string in JSON" by stripping code fences,
 * fixing unescaped newlines/tabs inside strings, and extracting JSON block.
 */
export function robustJsonParse(rawText, fallback = null) {
  if (!rawText || typeof rawText !== 'string') return fallback;

  // 1. Remove markdown code fences and extraneous leading/trailing whitespace
  let clean = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // 2. Extract JSON boundary if model returned chat commentary before or after
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  let startIdx = -1;
  let isArray = false;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isArray = false;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isArray = true;
  }

  if (startIdx !== -1) {
    const endChar = isArray ? ']' : '}';
    const lastIdx = clean.lastIndexOf(endChar);
    if (lastIdx > startIdx) {
      clean = clean.substring(startIdx, lastIdx + 1);
    }
  }

  // 3. First attempt direct parse
  try {
    return JSON.parse(clean);
  } catch (err1) {
    // 4. Try sanitizing unescaped newlines and control characters inside double quotes
    try {
      let inString = false;
      let escaped = false;
      let fixed = '';
      for (let i = 0; i < clean.length; i++) {
        const ch = clean[i];
        if (ch === '"' && !escaped) {
          inString = !inString;
          fixed += ch;
        } else if (inString && ch === '\n') {
          fixed += '\\n';
        } else if (inString && ch === '\r') {
          fixed += '\\r';
        } else if (inString && ch === '\t') {
          fixed += '\\t';
        } else {
          fixed += ch;
        }
        escaped = (ch === '\\' && !escaped);
      }
      return JSON.parse(fixed);
    } catch (err2) {
      console.warn('robustJsonParse fallback parsing due to error:', err2.message);
      if (fallback !== null) return fallback;
      throw new Error(
        isCurrentUiEnglish()
          ? 'AI response was truncated or returned invalid JSON format. Please try again.'
          : 'Dữ liệu AI trả về bị ngắt quãng hoặc không đúng định dạng JSON. Vui lòng thử lại.'
      );
    }
  }
}

export async function fetchAvailableModels(apiKey) {
  if (!apiKey) return POPULAR_GEMINI_MODELS;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    let response = await fetch(url);
    if (!response.ok) {
      // Try v1
      response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    }
    if (!response.ok) return POPULAR_GEMINI_MODELS;
    const data = await response.json();
    if (data.models && Array.isArray(data.models)) {
      const supported = data.models
        .filter(m => {
          const rawId = m.name.replace('models/', '');
          const canGenerate = m.supportedGenerationMethods?.includes('generateContent');
          return canGenerate && ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-pro-preview'].includes(rawId);
        })
        .map(m => {
          const rawId = m.name.replace('models/', '');
          const matched = POPULAR_GEMINI_MODELS.find(p => p.id === rawId);
          return matched || { id: rawId, name: rawId, nameEn: rawId };
        });
      return supported.length > 0 ? supported : POPULAR_GEMINI_MODELS;
    }
  } catch (e) {
    console.warn('Failed to automatically fetch available models:', e);
  }
  return POPULAR_GEMINI_MODELS;
}

export async function testApiKey(apiKey, model = DEFAULT_MODEL) {
  if (!apiKey) {
    throw new Error(isCurrentUiEnglish() ? 'Please enter an AI API Key' : 'Vui lòng nhập AI API Key');
  }
  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: 'Reply with the single word "OK" if this connection is working.' }] }]
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  return true;
}

/**
 * Evaluates student essay according to Cambridge IELTS Band Descriptors (TR/TA, CC, LR, GRA)
 * Enforces strict Cambridge rules (missing Overview hard cap, length penalty).
 */

export function calculateLexicalOverlap(str1, str2) {
  if (!str1 || !str2) return 0;
  const words1 = new Set(str1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(str2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  if (words1.size === 0 || words2.size === 0) return 0;
  let intersection = 0;
  for (const w of words1) {
    if (words2.has(w)) intersection++;
  }
  return intersection / Math.min(words1.size, words2.size);
}

/**
 * Builds prompt for Google Banana (Gemini 2.5 Flash Image / Imagen 3) to generate authentic IELTS Task 1 Dual Map
 */

