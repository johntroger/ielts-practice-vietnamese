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

export const POPULAR_GEMINI_MODELS = [
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Khuyên dùng - Thế hệ mới nhất GA, phản hồi siêu tốc & tối ưu token)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Tiêu chuẩn - Ổn định cao, chấm điểm Cambridge chuẩn xác)' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite (Siêu nhẹ - Tiết kiệm tối đa hạn ngạch API 15 RPM)' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview (Chuyên sâu - Khảo thí nâng cao, lập luận Band 8.5+)' }
];

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
 * Parses raw Gemini error response into friendly Vietnamese message with guidance.
 */
export function formatFriendlyGeminiError(errorData, statusCode) {
  const rawMsg = errorData?.error?.message || '';
  const status = errorData?.error?.status || '';

  if (statusCode === 429 || status === 'RESOURCE_EXHAUSTED' || /quota|exhausted|rate limit/i.test(rawMsg)) {
    return 'Hạn ngạch Google Gemini API tạm thời bị giới hạn (Quá nhiều yêu cầu cùng lúc - Quota 429). Hệ thống đã thử chuyển sang mô hình dự phòng nhưng tất cả đều đang bận. Vui lòng đợi 30 - 60 giây và thử lại!';
  }

  if (statusCode === 400 && /API_KEY_INVALID|invalid api key/i.test(rawMsg)) {
    return 'Google Gemini API Key không hợp lệ hoặc đã bị vô hiệu hóa. Vui lòng kiểm tra lại Key trong mục Cài đặt.';
  }

  if (statusCode === 403 || /permission|unregistered/i.test(rawMsg)) {
    return 'API Key không có quyền truy cập mô hình này hoặc quốc gia của bạn bị hạn chế. Vui lòng kiểm tra lại tài khoản Google AI Studio.';
  }

  if (statusCode === 503 || statusCode === 500 || /overloaded/i.test(rawMsg)) {
    return 'Máy chủ Google Gemini đang quá tải tạm thời (503 Service Unavailable). Vui lòng thử lại sau giây lát.';
  }

  return rawMsg || `Lỗi từ máy chủ Google Gemini (${statusCode || 'Mạng'})`;
}

/**
 * Universal Gemini API caller with automatic fallback across models & API versions:
 * 1. Automatic version switch (v1beta <-> v1) on 404/400
 * 2. Automatic model fallback on 429 Quota Exceeded (RESOURCE_EXHAUSTED) or 503 Overloaded
 * 3. Short backoff pause before retrying
 */
export async function callGeminiApi({ model, apiKey, body, apiVersion = 'v1beta' }) {
  const initialModel = cleanModelName(model);

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
      console.warn(`[Gemini API] Tự động fallback sang mô hình dự phòng: ${currentModel} do mô hình trước bị giới hạn ngạch.`);
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
          return fallbackResponse;
        }
        response = fallbackResponse;
      }

      // If call succeeds, return immediately
      if (response.ok) {
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
      throw new Error('Dữ liệu AI trả về bị ngắt quãng hoặc không đúng định dạng JSON. Vui lòng thử lại.');
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
          return matched || { id: rawId, name: rawId };
        });
      return supported.length > 0 ? supported : POPULAR_GEMINI_MODELS;
    }
  } catch (e) {
    console.warn('Không thể tự động tải danh sách models:', e);
  }
  return POPULAR_GEMINI_MODELS;
}

export async function testApiKey(apiKey, model = DEFAULT_MODEL) {
  if (!apiKey) throw new Error('Vui lòng nhập AI API Key');
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

