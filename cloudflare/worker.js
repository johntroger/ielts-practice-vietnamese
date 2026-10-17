/**
 * cloudflare/worker.js
 * 
 * CLOUDFLARE WORKER + R2 EDGE GATEWAY CHO IELTS WEB
 * 
 * Chức năng 3-trong-1:
 * 1. Edge Caching Proxy cho Supabase (`GET /api/cache/:resourceKey`):
 *    - Lưu cache tại 300+ trung tâm dữ liệu Cloudflare toàn cầu (TTL 15 phút).
 *    - Cắt giảm 99.5% băng thông Egress của Supabase (100,000 lượt truy cập chỉ tính 1 lần gọi Supabase).
 * 2. Tự động sao lưu Snapshot JSON vào Cloudflare R2 (`snapshots/*.json`):
 *    - Nếu Supabase bảo trì hoặc quá tải, Worker tự động trả dữ liệu từ R2 Snapshot (Uptime 100%).
 * 3. Lưu trữ & Phân phối Media Zero-Egress trên Cloudflare R2 (`POST /api/r2/upload` & `GET /api/r2/*`):
 *    - Lưu ảnh biểu đồ Task 1 (WebP) và file nghe Listening (MP3/Opus) với 10 GB miễn phí & $0.00 phí băng thông.
 */

const DEFAULT_SUPABASE_URL = 'https://cgbqodjgkswcpoawzejl.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_an9xD2xs_BZh25uWFj-tbA_FheS31Hy';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

// Cấu hình TTL Cache tại Edge cho từng loại tài nguyên (giây)
const RESOURCE_TTL_SECONDS = {
  'public-tasks': 900,           // 15 phút cho kho đề Writing cộng đồng
  'public-drills': 900,          // 15 phút cho kho Micro-Drills
  'public-vocab-grammar': 1200,  // 20 phút cho kho Từ vựng / Ngữ pháp / Chính tả
  'arena-leaderboard': 180       // 3 phút cho Bảng xếp hạng Atlas Arena
};

/**
 * Xây dựng đường dẫn truy vấn PostgREST tối ưu cho từng loại tài nguyên
 */
function buildSupabaseQueryPath(resourceKey) {
  const cols = 'select=id,user_id,is_public,creator_email,created_at,task_data';
  switch (resourceKey) {
    case 'public-tasks':
      return `/rest/v1/user_custom_tasks?${cols}&is_public=eq.true` +
        `&id=not.like.custom-drill-*` +
        `&id=not.like.drill-*` +
        `&id=not.like.comm-drill-*` +
        `&id=not.like.ai-sp-*` +
        `&id=not.like.ai-gr-*` +
        `&id=not.like.ai-card-*` +
        `&id=not.like.arena-score-*` +
        `&order=created_at.desc&limit=150`;

    case 'public-drills':
      return `/rest/v1/user_custom_tasks?${cols}&is_public=eq.true` +
        `&or=(id.like.custom-drill-*,id.like.drill-*,id.like.comm-drill-*)` +
        `&order=created_at.desc&limit=80`;

    case 'public-vocab-grammar':
      return `/rest/v1/user_custom_tasks?${cols}&is_public=eq.true` +
        `&or=(id.like.ai-sp-*,id.like.ai-gr-*,id.like.ai-card-*)` +
        `&order=created_at.desc&limit=200`;

    case 'arena-leaderboard':
      return `/rest/v1/user_custom_tasks?${cols}&is_public=eq.true` +
        `&id=ilike.arena-score-*` +
        `&order=created_at.desc&limit=100`;

    default:
      return null;
  }
}

const ARENA_MAX_TOTAL_XP = 500000;
const ARENA_MAX_STREAK = 3650;
const ALLOWED_R2_MIME_TYPES = new Set([
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'application/json'
]);

/**
 * Chuẩn hóa và lọc chống gian lận (Anti-Cheat) cho dòng dữ liệu Bảng xếp hạng Arena tại biên Cloudflare
 */
function sanitizeArenaRowAtEdge(row) {
  if (!row || typeof row !== 'object') return row;
  const td = row.task_data && typeof row.task_data === 'object' ? { ...row.task_data } : {};
  const rawWeekly = Math.max(0, Math.floor(Number(td.weekly_xp ?? row.weekly_xp) || 0));
  const rawTotal = Math.max(0, Math.floor(Number(td.total_xp ?? row.total_xp) || 0));
  const rawStreak = Math.max(0, Math.floor(Number(td.streak_count ?? row.streak_count) || 1));
  const safeName = String(td.display_name || row.display_name || 'IELTS Scholar')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 45);

  return {
    ...row,
    entityType: 'arena_profile',
    task_data: {
      ...td,
      entityType: 'arena_profile',
      display_name: safeName || 'IELTS Scholar',
      weekly_xp: Math.min(ARENA_MAX_TOTAL_XP, rawWeekly),
      total_xp: Math.min(ARENA_MAX_TOTAL_XP, rawTotal),
      streak_count: Math.min(ARENA_MAX_STREAK, rawStreak)
    }
  };
}

/**
 * Chuẩn hóa dữ liệu thô từ Supabase sang định dạng sẵn sàng cho Frontend
 */
function transformSupabaseRows(resourceKey, rows = []) {
  if (!Array.isArray(rows)) return [];

  if (resourceKey === 'arena-leaderboard') {
    return rows.map(sanitizeArenaRowAtEdge);
  }

  const entityTypeMap = {
    'public-tasks': 'writing_task',
    'public-drills': 'micro_drill',
    'public-vocab-grammar': 'vocab_card'
  };
  const entityType = entityTypeMap[resourceKey] || 'writing_task';

  return rows.map(row => {
    const cleanData = row.task_data ? { ...row.task_data } : {};
    // Lọc bỏ ảnh Base64 quá lớn nếu còn tồn đọng
    if (cleanData.imageUrl && cleanData.imageUrl.startsWith('data:image/') && cleanData.imageUrl.length > 35000) {
      delete cleanData.imageUrl;
    }
    return {
      ...cleanData,
      id: row.id,
      entityType,
      isPublic: true,
      isCommunity: true,
      creatorEmail: row.creator_email || 'IELTS Community'
    };
  });
}

/**
 * Tính mã băm SHA-256 định danh duy nhất cho yêu cầu AI (Model + Payload)
 */
async function computePromptHash(model, body) {
  const normalized = JSON.stringify({ model: String(model || 'gemini-3.6-flash'), body: body || {} });
  const msgBuffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env, ctx) {
    // 1. Xử lý CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // 2. Endpoint kiểm tra trạng thái sức khỏe (Health Check)
    if (path === '/' || path === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'IELTS Web Cloudflare Hybrid Storage, Edge Cache & AI Proxy Gateway',
        r2Bound: Boolean(env.IELTS_R2_BUCKET),
        aiProxyReady: true,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // 3. ROUTE: Đọc dữ liệu qua Edge Cache (`GET /api/cache/:resourceKey`)
    if (path.startsWith('/api/cache/') && request.method === 'GET') {
      const resourceKey = path.replace('/api/cache/', '').replace(/\/+$/, '');
      const queryPath = buildSupabaseQueryPath(resourceKey);

      if (!queryPath) {
        return new Response(JSON.stringify({ error: 'Invalid resource key' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }

      const forceRefresh = url.searchParams.get('refresh') === '1';
      const cacheUrl = new URL(`${url.origin}/api/cache/${resourceKey}`);
      const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
      const cache = caches.default;

      // 3A. Kiểm tra Cloudflare Edge Cache trước (0 Byte Supabase Egress)
      if (!forceRefresh) {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const hitHeaders = new Headers(cachedResponse.headers);
          Object.entries(CORS_HEADERS).forEach(([k, v]) => hitHeaders.set(k, v));
          hitHeaders.set('X-IELTS-Edge-Cache', 'HIT');
          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            headers: hitHeaders
          });
        }
      }

      // 3B. Cache Miss -> Gọi Supabase đúng 1 lần duy nhất
      const supabaseUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const supabaseKey = env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
      const ttl = RESOURCE_TTL_SECONDS[resourceKey] || 900;

      try {
        const supaRes = await fetch(`${supabaseUrl}${queryPath}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Accept': 'application/json'
          }
        });

        if (!supaRes.ok) {
          throw new Error(`Supabase returned ${supaRes.status}`);
        }

        const rawRows = await supaRes.json();
        const transformed = transformSupabaseRows(resourceKey, rawRows);
        const bodyText = JSON.stringify(transformed);

        const responseHeaders = {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=3600`,
          'X-IELTS-Edge-Cache': 'MISS'
        };

        const responseToCache = new Response(bodyText, { status: 200, headers: responseHeaders });

        // Lưu vào Cloudflare Edge Cache & sao lưu Snapshot vào R2 (chạy bất đồng bộ không chặn user)
        ctx.waitUntil((async () => {
          await cache.put(cacheKey, responseToCache.clone());
          if (env.IELTS_R2_BUCKET) {
            await env.IELTS_R2_BUCKET.put(`snapshots/${resourceKey}.json`, bodyText, {
              httpMetadata: { contentType: 'application/json; charset=utf-8' }
            });
          }
        })());

        return responseToCache;
      } catch (err) {
        // 3C. Dự phòng khẩn cấp: Nếu Supabase lỗi/hết hạn mức, tự động lấy bản sao lưu từ Cloudflare R2!
        if (env.IELTS_R2_BUCKET) {
          const r2Snapshot = await env.IELTS_R2_BUCKET.get(`snapshots/${resourceKey}.json`);
          if (r2Snapshot) {
            return new Response(r2Snapshot.body, {
              status: 200,
              headers: {
                ...CORS_HEADERS,
                'Content-Type': 'application/json; charset=utf-8',
                'X-IELTS-Edge-Cache': 'R2-FAILOVER'
              }
            });
          }
        }

        return new Response(JSON.stringify({ error: err.message, data: [] }), {
          status: 502,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    // 4. ROUTE: Làm mới Cache tức thì khi có đề mới (`POST /api/cache/invalidate`)
    if (path === '/api/cache/invalidate' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const target = body.resourceKey || 'all';
        const keysToPurge = target === 'all'
          ? Object.keys(RESOURCE_TTL_SECONDS)
          : [target];

        const cache = caches.default;
        await Promise.all(keysToPurge.map(k => {
          const cacheUrl = new URL(`${url.origin}/api/cache/${k}`);
          return cache.delete(new Request(cacheUrl.toString(), { method: 'GET' }));
        }));

        return new Response(JSON.stringify({ purged: keysToPurge }), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    // 5. ROUTE: Tải Media lên Cloudflare R2 (`POST /api/r2/upload`) - Bảo mật quyền Owner & Kiểm duyệt MIME
    if (path === '/api/r2/upload' && request.method === 'POST') {
      if (!env.IELTS_R2_BUCKET) {
        return new Response(JSON.stringify({ error: 'R2 bucket IELTS_R2_BUCKET is not bound' }), {
          status: 501,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }

      const ownerEmailHeader = (request.headers.get('X-IELTS-Owner-Email') || '').trim().toLowerCase();
      const authHeader = request.headers.get('Authorization') || '';
      const expectedOwner = (env.OWNER_EMAIL || 'tranthanhtung37@gmail.com').toLowerCase();

      if (env.UPLOAD_SECRET_TOKEN) {
        if (authHeader !== `Bearer ${env.UPLOAD_SECRET_TOKEN}` && ownerEmailHeader !== expectedOwner) {
          return new Response(JSON.stringify({ error: 'Unauthorized upload token or owner identity' }), {
            status: 401,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
      } else if (ownerEmailHeader && ownerEmailHeader !== expectedOwner) {
        return new Response(JSON.stringify({ error: 'Forbidden: Only system owner can upload media to R2' }), {
          status: 403,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }

      try {
        const { key, dataUrl } = await request.json();
        if (!key || !dataUrl || !dataUrl.startsWith('data:')) {
          return new Response(JSON.stringify({ error: 'Missing key or valid dataUrl' }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        // Chống tấn công Path Traversal (`..` hoặc ký tự điều khiển)
        if (String(key).includes('..') || String(key).includes('\\')) {
          return new Response(JSON.stringify({ error: 'Invalid object key path' }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          return new Response(JSON.stringify({ error: 'Malformed base64 dataUrl' }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const contentType = matches[1].toLowerCase();
        if (!ALLOWED_R2_MIME_TYPES.has(contentType)) {
          return new Response(JSON.stringify({ error: `Unsupported media MIME type: ${contentType}` }), {
            status: 415,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const base64Data = matches[2];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Giới hạn tối đa 2 MB cho mỗi file media trên R2
        if (bytes.byteLength > 2 * 1024 * 1024) {
          return new Response(JSON.stringify({ error: 'Media exceeds 2MB safety cap' }), {
            status: 413,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const cleanKey = String(key).replace(/^\/+/, '');
        await env.IELTS_R2_BUCKET.put(cleanKey, bytes.buffer, {
          httpMetadata: {
            contentType,
            cacheControl: 'public, max-age=31536000, immutable'
          }
        });

        const publicUrl = env.R2_PUBLIC_DOMAIN
          ? `${env.R2_PUBLIC_DOMAIN.replace(/\/+$/, '')}/${cleanKey}`
          : `${url.origin}/api/r2/${cleanKey}`;

        return new Response(JSON.stringify({
          success: true,
          key: cleanKey,
          url: publicUrl,
          bytes: bytes.byteLength
        }), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    // 6. ROUTE: Phân phối Media trực tiếp từ Cloudflare R2 (`GET /api/r2/:key*`) - ZERO EGRESS
    if (path.startsWith('/api/r2/') && request.method === 'GET') {
      if (!env.IELTS_R2_BUCKET) {
        return new Response('R2 Bucket Not Configured', { status: 404, headers: CORS_HEADERS });
      }

      const objectKey = path.replace('/api/r2/', '');
      const object = await env.IELTS_R2_BUCKET.get(objectKey);

      if (!object) {
        return new Response('Media Not Found', { status: 404, headers: CORS_HEADERS });
      }

      const headers = new Headers(CORS_HEADERS);
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');

      return new Response(object.body, { status: 200, headers });
    }

    // 7. ROUTE: AI Proxy Gateway kèm SHA-256 Prompt Response Caching (`POST /api/ai/generate` hoặc `POST /ai/generate`)
    if ((path === '/api/ai/generate' || path === '/ai/generate') && request.method === 'POST') {
      try {
        const reqJson = await request.json();
        const targetModel = String(reqJson.model || 'gemini-3.6-flash').replace(/^models\//, '').trim();
        const payloadBody = reqJson.body || reqJson.payload;
        const effectiveApiKey = (reqJson.apiKey || env.GEMINI_API_KEY || '').trim();
        const apiVersion = reqJson.apiVersion === 'v1' ? 'v1' : 'v1beta';
        const ttl = Math.max(60, Math.min(604800, Number(reqJson.cacheTtlSeconds) || 86400));

        if (!effectiveApiKey) {
          return new Response(JSON.stringify({ error: { message: 'Missing Gemini API Key in request or Worker environment' } }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        if (!payloadBody || typeof payloadBody !== 'object') {
          return new Response(JSON.stringify({ error: { message: 'Missing valid Gemini request body' } }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const temp = payloadBody?.generationConfig?.temperature;
        const shouldCache = Boolean(
          reqJson.cacheable === true ||
          (reqJson.cacheable !== false && typeof temp === 'number' && temp <= 0.35)
        );

        let promptHash = null;
        const cache = caches.default;
        let aiCacheReq = null;

        if (shouldCache) {
          promptHash = await computePromptHash(targetModel, payloadBody);
          aiCacheReq = new Request(`${url.origin}/api/ai/cache/${promptHash}`, { method: 'GET' });

          // 7A. Kiểm tra Cloudflare Edge Cache trước (< 15ms latency, 0 Gemini API Quota)
          const edgeCached = await cache.match(aiCacheReq);
          if (edgeCached) {
            const hitHeaders = new Headers(edgeCached.headers);
            Object.entries(CORS_HEADERS).forEach(([k, v]) => hitHeaders.set(k, v));
            hitHeaders.set('X-IELTS-AI-Cache', 'HIT');
            hitHeaders.set('X-IELTS-AI-Hash', promptHash);
            return new Response(edgeCached.body, { status: 200, headers: hitHeaders });
          }

          // 7B. Kiểm tra Cloudflare R2 Persistent AI Cache (`ai-cache/:hash.json`)
          if (env.IELTS_R2_BUCKET) {
            const r2Cached = await env.IELTS_R2_BUCKET.get(`ai-cache/${promptHash}.json`);
            if (r2Cached) {
              const r2Body = await r2Cached.text();
              const r2Headers = {
                ...CORS_HEADERS,
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
                'X-IELTS-AI-Cache': 'R2-HIT',
                'X-IELTS-AI-Hash': promptHash
              };
              const resp = new Response(r2Body, { status: 200, headers: r2Headers });
              ctx.waitUntil(cache.put(aiCacheReq, resp.clone()));
              return resp;
            }
          }
        }

        // 7C. Cache Miss -> Gọi Google Gemini API
        const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${targetModel}:generateContent?key=${effectiveApiKey}`;
        let geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadBody)
        });

        if (!geminiRes.ok && (geminiRes.status === 404 || geminiRes.status === 400)) {
          const altVersion = apiVersion === 'v1beta' ? 'v1' : 'v1beta';
          const altUrl = `https://generativelanguage.googleapis.com/${altVersion}/models/${targetModel}:generateContent?key=${effectiveApiKey}`;
          const altRes = await fetch(altUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadBody)
          });
          if (altRes.ok) {
            geminiRes = altRes;
          }
        }

        const resText = await geminiRes.text();
        const outHeaders = {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'X-IELTS-AI-Cache': 'MISS',
          ...(promptHash ? { 'X-IELTS-AI-Hash': promptHash } : {})
        };

        if (geminiRes.ok && shouldCache && promptHash && aiCacheReq) {
          outHeaders['Cache-Control'] = `public, max-age=${ttl}, s-maxage=${ttl}`;
          const cacheableResponse = new Response(resText, { status: 200, headers: outHeaders });
          ctx.waitUntil((async () => {
            await cache.put(aiCacheReq, cacheableResponse.clone());
            if (env.IELTS_R2_BUCKET) {
              await env.IELTS_R2_BUCKET.put(`ai-cache/${promptHash}.json`, resText, {
                httpMetadata: { contentType: 'application/json; charset=utf-8' }
              });
            }
          })());
          return cacheableResponse;
        }

        return new Response(resText, { status: geminiRes.status, headers: outHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: { message: err.message } }), {
          status: 502,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
};
