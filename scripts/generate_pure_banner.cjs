const fs = require('fs');
const path = require('path');

const qrBase64 = fs.readFileSync(path.join(__dirname, '../public/banners/qr-base64.txt'), 'utf8').trim();

const pureHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Banner Canvas 1080x1080</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0a1128;
    }
    #banner-canvas {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: radial-gradient(circle at 85% 15%, #1e3a8a 0%, #0a1128 55%, #050814 100%);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 68px;
    }
    .glow-circle-1 {
      position: absolute;
      top: -120px;
      right: -120px;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, rgba(37, 99, 235, 0) 70%);
      filter: blur(40px);
      pointer-events: none;
    }
    .glow-circle-2 {
      position: absolute;
      bottom: -150px;
      left: -100px;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .top-bar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-badge {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
      font-size: 24px;
    }
    .brand-name {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #ffffff;
      text-transform: uppercase;
    }
    .brand-name span { color: #fbbf24; }
    .tag-free {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(251, 191, 36, 0.12);
      border: 1px solid rgba(251, 191, 36, 0.35);
      color: #fde68a;
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(251, 191, 36, 0.15);
    }
    .dot-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fbbf24;
      box-shadow: 0 0 10px #fbbf24;
    }
    .main-content {
      position: relative;
      z-index: 10;
      margin: 30px 0;
    }
    .mission-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 18px;
    }
    .headline {
      font-size: 48px;
      line-height: 1.18;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
      margin-bottom: 18px;
    }
    .headline .highlight {
      background: linear-gradient(135deg, #fbbf24 0%, #fef08a 50%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subhead {
      font-size: 17px;
      line-height: 1.55;
      color: #cbd5e1;
      max-width: 880px;
      font-weight: 400;
      margin-bottom: 30px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      max-width: 944px;
    }
    .feature-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      backdrop-filter: blur(12px);
    }
    .feature-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(37, 99, 235, 0.2);
      border: 1px solid rgba(37, 99, 235, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .feature-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 3px;
    }
    .feature-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.35;
    }
    .bottom-row {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 24px;
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 20px;
      padding: 22px 28px;
      backdrop-filter: blur(16px);
    }
    .qr-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .qr-image {
      width: 130px;
      height: 130px;
      display: block;
    }
    .cta-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
    }
    .cta-eyebrow {
      font-size: 13px;
      font-weight: 700;
      color: #fbbf24;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cta-heading {
      font-size: 21px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4px;
      line-height: 1.25;
    }
    .cta-url {
      font-size: 14px;
      font-weight: 600;
      color: #93c5fd;
      font-family: monospace;
      letter-spacing: -0.2px;
      margin-bottom: 12px;
    }
    .founder-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .founder-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #d97706);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      color: #0f172a;
      box-shadow: 0 4px 10px rgba(251, 191, 36, 0.3);
    }
    .founder-info {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.35;
    }
    .founder-name { font-weight: 700; color: #ffffff; }
    .founder-title { color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div id="banner-canvas">
    <div class="glow-circle-1"></div>
    <div class="glow-circle-2"></div>
    <div class="grid-pattern"></div>
    <div class="top-bar">
      <div class="brand-logo">
        <div class="logo-badge">🎓</div>
        <div class="brand-name">IELTS Practice <span>Vietnamese</span></div>
      </div>
      <div class="tag-free">
        <div class="dot-pulse"></div>
        <span>100% Miễn Phí • Chuẩn Cambridge</span>
      </div>
    </div>
    <div class="main-content">
      <div class="mission-pill">
        <span>🚀 Sứ Mệnh Vì Cộng Đồng Học Tiếng Anh Việt Nam</span>
      </div>
      <h1 class="headline">
        Luyện Thi IELTS Chuẩn Quốc Tế<br>
        <span class="highlight">Đột Phá Với Trợ Lực AI</span>
      </h1>
      <p class="subhead">
        Hệ thống ôn luyện toàn diện 4 kỹ năng (Writing – Reading – Listening – Speaking) kết hợp cẩm nang chiến thuật chuyên sâu và đấu trường tương tác 180s thời gian thực.
      </p>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-wrap">📝</div>
          <div>
            <div class="feature-title">Đề Thi Chuẩn Cambridge</div>
            <div class="feature-desc">Mô phỏng 100% cấu trúc, thời gian & áp lực phòng thi thật</div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrap">🤖</div>
          <div>
            <div class="feature-title">AI Chữa Bài Chi Tiết</div>
            <div class="feature-desc">Phân tích ngữ pháp, từ vựng và chấm điểm theo 4 tiêu chí</div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrap">🖥️</div>
          <div>
            <div class="feature-title">Phòng Thi Máy CDI</div>
            <div class="feature-desc">Highlight, split-screen & chiến thuật One Skill Retake 2026</div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrap">⚔️</div>
          <div>
            <div class="feature-title">Đấu Trường Atlas Arena</div>
            <div class="feature-desc">Sprint 180s phản xạ kịch tính, bẻ bẫy đề thi & bảng xếp hạng</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-row">
      <div class="qr-card">
        <img class="qr-image" src="data:image/png;base64,${qrBase64}" alt="QR Code About Project">
      </div>
      <div class="cta-content">
        <div class="cta-eyebrow">
          <span>🔍 Quét mã QR để tìm hiểu thêm</span>
        </div>
        <div class="cta-heading">Khám phá sứ mệnh & câu chuyện dự án</div>
        <div class="cta-url">ielts-practice-vietnamese.vercel.app/about</div>
        <div class="founder-badge">
          <div class="founder-avatar">TT</div>
          <div class="founder-info">
            <div class="founder-name">Mr. Tung Tran</div>
            <div class="founder-title">Founder, VNEconomics Academy • Người phát triển dự án</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../public/banners/banner-pure-1080x1080.html'), pureHtml, 'utf8');
console.log('Successfully created public/banners/banner-pure-1080x1080.html');
