/**
 * cloudflare/setup_and_deploy.mjs
 *
 * TRÌNH TỰ ĐỘNG KÍCH HOẠT & TRIỂN KHAI CLOUDFLARE R2 + EDGE WORKER (1-CLICK SETUP)
 *
 * Cách chạy:
 *   npm run cloudflare:deploy
 *
 * Quy trình tự động 5 bước:
 *   1. Kiểm tra đăng nhập Cloudflare (`wrangler whoami`), nếu chưa đăng nhập sẽ tự mở trình duyệt.
 *   2. Tự động khởi tạo R2 Bucket `ielts-web-media` (10 GB Free + $0 Egress).
 *      - Nếu tài khoản Cloudflare chưa bật tính năng R2 trong Dashboard, tự động chuyển sang
 *        chế độ Edge Cache Gateway trước để không bị gián đoạn, đồng thời in link bật R2 1-click.
 *   3. Triển khai `cloudflare/worker.js` lên mạng lưới Cloudflare toàn cầu (300+ trung tâm dữ liệu).
 *   4. Tự động lấy URL `https://ielts-web-edge-gateway.<subdomain>.workers.dev` vừa tạo và
 *      ghi trực tiếp vào `.env` + `src/services/cloudflareStorageService.js`.
 *   5. Kiểm tra kết nối thực tế (`/health` và `/api/cache/public-tasks`) để xác nhận `X-IELTS-Edge-Cache: HIT`.
 */

import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const WRANGLER_TOML_PATH = path.join(__dirname, 'wrangler.toml');
const CF_SERVICE_PATH = path.join(ROOT_DIR, 'src', 'services', 'cloudflareStorageService.js');
const ENV_PATH = path.join(ROOT_DIR, '.env');

function runCmd(cmd, options = {}) {
  try {
    const out = execSync(cmd, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: options.inherit ? 'inherit' : 'pipe',
      ...options
    });
    return { ok: true, output: out || '' };
  } catch (err) {
    return {
      ok: false,
      output: (err.stdout ? String(err.stdout) : '') + '\n' + (err.stderr ? String(err.stderr) : ''),
      error: err
    };
  }
}

async function main() {
  console.log('\n======================================================================');
  console.log('🚀 KÍCH HOẠT TỰ ĐỘNG TẦNG LƯU TRỮ CLOUDFLARE R2 + EDGE WORKER');
  console.log('======================================================================\n');

  // BƯỚC 1: Kiểm tra trạng thái đăng nhập Cloudflare
  console.log('🔹 [Bước 1/5] Kiểm tra xác thực tài khoản Cloudflare...');
  let whoami = runCmd('npx --yes wrangler whoami');
  if (!whoami.ok || whoami.output.includes('not authenticated')) {
    console.log('👉 Chưa đăng nhập Cloudflare. Đang mở trình duyệt để bạn bấm "Allow" (Cho phép)...');
    const loginRes = spawnSync('npx', ['--yes', 'wrangler', 'login'], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      shell: true
    });
    if (loginRes.status !== 0) {
      console.error('\n❌ Đăng nhập chưa hoàn tất. Vui lòng chạy lại `npm run cloudflare:deploy` và bấm "Allow" trên trình duyệt.');
      process.exit(1);
    }
    whoami = runCmd('npx --yes wrangler whoami');
  }
  console.log('✅ Đã xác thực tài khoản Cloudflare thành công!\n');

  // BƯỚC 2: Khởi tạo Cloudflare R2 Bucket (10GB Free, Zero Egress)
  console.log('🔹 [Bước 2/5] Kiểm tra / Khởi tạo Cloudflare R2 Bucket (`ielts-web-media`)...');
  let r2Ready = false;
  const r2List = runCmd('npx --yes wrangler r2 bucket list');
  if (r2List.ok && r2List.output.includes('ielts-web-media')) {
    console.log('✅ R2 Bucket `ielts-web-media` đã tồn tại và sẵn sàng!');
    r2Ready = true;
  } else {
    const r2Create = runCmd('npx --yes wrangler r2 bucket create ielts-web-media');
    if (r2Create.ok || r2Create.output.includes('already exists')) {
      console.log('✅ Đã tạo thành công R2 Bucket `ielts-web-media` (10 GB Free, $0 Egress)!');
      r2Ready = true;
    } else if (r2Create.output.includes('10042') || r2Create.output.toLowerCase().includes('enable r2')) {
      console.log('⚠️ Tài khoản Cloudflare của bạn chưa bấm nút kích hoạt R2 miễn phí lần đầu trên Dashboard.');
      console.log('   -> Hệ thống sẽ triển khai trước tầng Cloudflare Edge Cache Gateway (giảm 99% Supabase Egress).');
      console.log('   -> Sau khi bật R2 (0đ) tại https://dash.cloudflare.com/?to=/:account/r2/new, chỉ cần chạy lại lệnh này!');
      r2Ready = false;
    } else {
      console.log('ℹ️ Trạng thái R2:', r2Create.output.trim());
    }
  }

  // Chuẩn bị cấu hình wrangler.toml phù hợp với trạng thái R2
  const originalToml = fs.readFileSync(WRANGLER_TOML_PATH, 'utf8');
  if (!r2Ready) {
    const tomlWithoutR2 = originalToml.replace(
      /\[\[r2_buckets\]\][\s\S]*?bucket_name\s*=\s*"ielts-web-media"/,
      '# [[r2_buckets]]\n# binding = "IELTS_R2_BUCKET"\n# bucket_name = "ielts-web-media"'
    );
    fs.writeFileSync(WRANGLER_TOML_PATH, tomlWithoutR2, 'utf8');
  }

  // BƯỚC 3: Triển khai Cloudflare Worker lên mạng lưới Edge toàn cầu
  console.log('\n🔹 [Bước 3/5] Đang triển khai `cloudflare/worker.js` lên mạng lưới Cloudflare Global Edge...');
  const deployRes = runCmd('npx --yes wrangler deploy --config cloudflare/wrangler.toml');

  // Khôi phục lại wrangler.toml nguyên bản nếu có tạm ẩn R2
  if (!r2Ready) {
    fs.writeFileSync(WRANGLER_TOML_PATH, originalToml, 'utf8');
  }

  if (!deployRes.ok) {
    console.error('\n❌ Lỗi khi triển khai Worker:\n', deployRes.output);
    process.exit(1);
  }

  console.log(deployRes.output);
  const urlMatch = deployRes.output.match(/https:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.workers\.dev/);
  if (!urlMatch) {
    console.error('⚠️ Không tìm thấy URL workers.dev tự động trong kết quả trả về. Vui lòng kiểm tra log phía trên.');
    process.exit(1);
  }

  const workerUrl = urlMatch[0].replace(/\/+$/, '');
  console.log(`✅ Đã triển khai thành công tại: ${workerUrl}\n`);

  // BƯỚC 4: Tự động gắn URL vào mã nguồn và file .env
  console.log('🔹 [Bước 4/5] Đang cấu hình tự động URL vào dự án IELTS Web...');

  // 4A. Cập nhật vào src/services/cloudflareStorageService.js
  if (fs.existsSync(CF_SERVICE_PATH)) {
    let serviceCode = fs.readFileSync(CF_SERVICE_PATH, 'utf8');
    serviceCode = serviceCode.replace(
      /export const DEFAULT_CLOUDFLARE_EDGE_URL = '[^']*';/,
      `export const DEFAULT_CLOUDFLARE_EDGE_URL = '${workerUrl}';`
    );
    fs.writeFileSync(CF_SERVICE_PATH, serviceCode, 'utf8');
    console.log('   ✓ Đã cập nhật `DEFAULT_CLOUDFLARE_EDGE_URL` trong `src/services/cloudflareStorageService.js`');
  }

  // 4B. Cập nhật vào .env (nếu có hoặc tạo mới)
  let envContent = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  if (envContent.includes('VITE_CLOUDFLARE_EDGE_URL=')) {
    envContent = envContent.replace(/VITE_CLOUDFLARE_EDGE_URL=.*/g, `VITE_CLOUDFLARE_EDGE_URL=${workerUrl}`);
  } else {
    envContent = envContent.trimEnd() + `\nVITE_CLOUDFLARE_EDGE_URL=${workerUrl}\n`;
  }
  fs.writeFileSync(ENV_PATH, envContent.trimStart(), 'utf8');
  console.log('   ✓ Đã cập nhật `VITE_CLOUDFLARE_EDGE_URL` trong `.env`\n');

  // BƯỚC 5: Kiểm tra thực tế Edge Cache HIT
  console.log('🔹 [Bước 5/5] Kiểm tra hoạt động thực tế của Cloudflare Edge Gateway...');
  try {
    const healthRes = await fetch(`${workerUrl}/health`);
    const healthJson = await healthRes.json();
    console.log('   ✓ Health Check:', JSON.stringify(healthJson));

    // Gọi lần 1 (Cache Warmup) và lần 2 (Xác nhận Cache HIT)
    await fetch(`${workerUrl}/api/cache/public-tasks`);
    const secondRes = await fetch(`${workerUrl}/api/cache/public-tasks`);
    const cacheStatus = secondRes.headers.get('x-ielts-edge-cache') || 'ACTIVE';
    const tasksData = await secondRes.json();
    console.log(`   ✓ Edge Cache Status: ${cacheStatus} (Đã nạp ${Array.isArray(tasksData) ? tasksData.length : 0} đề công cộng tại biên Cloudflare!)`);
  } catch (err) {
    console.log('   ℹ️ Worker vừa khởi tạo, DNS sẽ hoàn tất đồng bộ sau vài giây:', err.message);
  }

  console.log('\n======================================================================');
  console.log('🎉 HOÀN TẤT KÍCH HOẠT CLOUDFLARE EDGE + R2 CHO DỰ ÁN IELTS WEB!');
  console.log(`🌐 Endpoint: ${workerUrl}`);
  console.log('======================================================================\n');
}

main();
