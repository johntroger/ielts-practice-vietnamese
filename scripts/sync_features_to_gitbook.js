/**
 * scripts/sync_features_to_gitbook.js
 * 
 * ENGINE TỰ ĐỘNG ĐỒNG BỘ TÍNH NĂNG TỪ CODEBASE LÊN GITBOOK
 * Single Source of Truth (SSOT): src/core/featureRegistry.js
 * 
 * Chức năng:
 * 1. Đọc FEATURE_REGISTRY, FEATURE_CATEGORIES, SKILL_DEFINITIONS
 * 2. Tự động sinh docs/features/README.md (Feature Matrix & Hub)
 * 3. Tự động sinh các trang chuyên đề chi tiết theo danh mục (docs/features/*.md)
 * 4. Tự động cập nhật docs/SUMMARY.md (Mục lục GitBook Sidebar)
 * 5. Tự động cập nhật docs/README.md (Trang chủ chào mừng)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FEATURE_REGISTRY, FEATURE_CATEGORIES, SKILL_DEFINITIONS } from '../src/core/featureRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(ROOT_DIR, 'docs');
const FEATURES_DIR = path.resolve(DOCS_DIR, 'features');

// Đảm bảo thư mục docs/features tồn tại
if (!fs.existsSync(FEATURES_DIR)) {
  fs.mkdirSync(FEATURES_DIR, { recursive: true });
}

// Bảng ánh xạ ID danh mục sang tên file Markdown và tiêu đề trang trọng
const CATEGORY_FILE_MAP = {
  ai_evaluation: {
    fileName: 'ai-evaluation.md',
    title: 'Phân Hệ AI & Hệ Thống Chấm Điểm Kép Chuẩn Cambridge',
    icon: '🤖',
    lead: 'Tổng hợp các công cụ trí tuệ nhân tạo và bộ chấm thuật toán máy tính 0.02ms, phân tích 4 tiêu chí Cambridge (TR/TA, CC, LR, GRA, FC, PR).'
  },
  practice_tools: {
    fileName: 'practice-tools.md',
    title: 'Kho Đề Thi & Bộ Công Cụ Luyện Tập 4 Kỹ Năng',
    icon: '🛠️',
    lead: 'Bộ sưu tập công cụ hỗ trợ người học: nạp đề từ ảnh chụp Task 1 (OCR), ma trận phát triển ý tưởng, từ điển đồng nghĩa và phân tầng trình độ.'
  },
  exam_simulation: {
    fileName: 'exam-simulation.md',
    title: 'Phòng Thi Thử Chuẩn CDI & Chế Độ Marathon 3 Kỹ Năng',
    icon: '⏱️',
    lead: 'Không gian mô phỏng phòng thi máy tính thực tế (Computer-Delivered IELTS) của IDP/British Council với giao diện chuẩn mực và phím tắt thi thật.'
  },
  theory_vocab: {
    fileName: 'theory-vocab.md',
    title: 'Cẩm Nang Lý Thuyết & Sổ Tay Từ Vựng Ngữ Cảnh',
    icon: '📖',
    lead: 'Hệ thống bài giảng, cẩm nang chiến thuật 4 kỹ năng và sổ tay từ vựng học thuật chia theo dải điểm từ Band 5.0 đến 8.0+.'
  },
  analytics_profile: {
    fileName: 'analytics-profile.md',
    title: 'Theo Dõi Tiến Độ, Hồ Sơ Cá Nhân & Bảng Điểm TRF',
    icon: '📊',
    lead: 'Phân tích dữ liệu học tập cá nhân hóa, biểu đồ radar 4 kỹ năng, lịch sử bài làm và cơ chế xuất phiếu điểm Test Report Form (TRF) chuẩn quốc tế.'
  },
  shortcuts_ux: {
    fileName: 'shortcuts-ux.md',
    title: 'Giao Diện Tập Trung & Bảng Phím Tắt Toàn Năng',
    icon: '⌨️',
    lead: 'Tối ưu hóa trải nghiệm làm bài với chế độ tập trung (Focus Mode), bảng phím tắt thao tác nhanh chuẩn phòng thi máy tính.'
  }
};

/**
 * Format danh sách kỹ năng thành huy hiệu hiển thị
 */
function formatSkillsBadge(targetSkills = []) {
  if (!targetSkills || targetSkills.length === 0) return 'Toàn Hệ Thống';
  return targetSkills.map(s => {
    const def = SKILL_DEFINITIONS[s];
    return def ? `**${def.name}**` : s.toUpperCase();
  }).join(' • ');
}

/**
 * 1. SINH TRANG CHỦ FEATURES: docs/features/README.md
 */
function generateFeaturesHub() {
  const totalFeatures = FEATURE_REGISTRY.length;
  const shortcutsList = FEATURE_REGISTRY.filter(f => f.shortcut);
  const newFeatures = FEATURE_REGISTRY.filter(f => f.status === 'new' || f.badge === 'Mới Ra Mắt');

  let md = `# 🚀 Trung Tâm Hướng Dẫn & Tính Năng Nền Tảng (Feature Matrix)

> **Cập nhật tự động**: Trang tài liệu này được đồng bộ trực tiếp từ Codebase (\`src/core/featureRegistry.js\`).  
> **Tổng số tính năng hiện có**: **${totalFeatures} tính năng chuyên sâu** | **Phiên bản mới nhất**: \`v3.0 (2026 Edition)\`

---

## 📌 Tổng Quan Hệ Sinh Thái IELTS Practice

Hệ thống **IELTS Practice Vietnamese** được thiết kế theo tiêu chuẩn phòng thi máy tính **Computer-Delivered IELTS (CDI)** của Cambridge, IDP và British Council. Toàn bộ nền tảng vận hành trên kiến trúc **Local-First**, bảo vệ quyền riêng tư người học và hỗ trợ chấm điểm linh hoạt (kết hợp chấm máy siêu tốc 0.02ms và Giám khảo Trí tuệ Nhân tạo).

### 📊 Thống Kê Phân Hệ & Tính Năng

| Chuyên Mục Tính Năng | Số Lượng | Trạng Thái Nổi Bật | Xem Tài Liệu |
| :--- | :---: | :--- | :--- |
`;

  Object.entries(CATEGORY_FILE_MAP).forEach(([catId, meta]) => {
    const count = FEATURE_REGISTRY.filter(f => f.category === catId).length;
    md += `| ${meta.icon} **${meta.title.split('&')[0].trim()}** | **${count}** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](${meta.fileName}) |\n`;
  });

  md += `
---

## ⚡ Bảng Tra Cứu Phím Tắt Thi Máy Chuẩn Quốc Tế

Hệ thống tích hợp toàn bộ các phím tắt tiêu chuẩn quốc tế giúp bạn thao tác với tốc độ tối đa trong phòng thi máy:

| Phím Tắt | Chức Năng | Tính Năng Liên Kết |
| :--- | :--- | :--- |
`;

  shortcutsList.forEach(item => {
    md += `| \`${item.shortcut}\` | ${item.title} | [Chi tiết ↗](${CATEGORY_FILE_MAP[item.category]?.fileName || 'README.md'}#${item.id}) |\n`;
  });

  md += `
---

## 🌟 Các Tính Năng Mới Cập Nhật (Release 2026)

Dưới đây là các tính năng học thuật mới nhất được nâng cấp trên hệ thống:

`;

  newFeatures.forEach(feat => {
    md += `### ✦ [${feat.title}](${CATEGORY_FILE_MAP[feat.category]?.fileName || 'README.md'}#${feat.id})
- **Phiên bản**: \`${feat.version}\` | **Kỹ năng**: ${formatSkillsBadge(feat.targetSkills)}
- **Tóm tắt**: ${feat.shortDesc}
- **Cách dùng nhanh**: ${feat.usageGuide}

`;
  });

  md += `---
*Tài liệu tự động đồng bộ qua GitBook Sync Pipeline. Mọi thay đổi trong source code sẽ tự động cập nhật lên đây.*
`;

  const targetPath = path.join(FEATURES_DIR, 'README.md');
  fs.writeFileSync(targetPath, md.trim() + '\n', 'utf8');
  console.log('✅ Đã sinh thành công: docs/features/README.md');
}

/**
 * 2. SINH CÁC TRANG TÍNH NĂNG CHI TIẾT THEO DANH MỤC
 */
function generateCategoryPages() {
  Object.entries(CATEGORY_FILE_MAP).forEach(([catId, meta]) => {
    const features = FEATURE_REGISTRY.filter(f => f.category === catId);

    let md = `# ${meta.icon} ${meta.title}

> **Chuyên mục**: \`${catId}\` | **Số lượng**: **${features.length} tính năng**  
> **Tổng quan**: ${meta.lead}

[← Quay lại Trung Tâm Tính Năng](README.md)

---

`;

    features.forEach((feat, index) => {
      md += `<a id="${feat.id}"></a>\n\n`;
      md += `## ${index + 1}. ${feat.title}\n\n`;

      const badgeStr = feat.badge ? `\`${feat.badge}\`` : '`Chuẩn`';
      const shortcutStr = feat.shortcut ? `\`${feat.shortcut}\`` : '_Không có_';

      md += `> **Phiên bản**: \`${feat.version}\` | **Huy hiệu**: ${badgeStr} | **Kỹ năng**: ${formatSkillsBadge(feat.targetSkills)} | **Phím tắt**: ${shortcutStr}\n\n`;
      md += `### 📝 Mô Tả Tính Năng\n${feat.shortDesc}\n\n`;

      if (feat.highlights && feat.highlights.length > 0) {
        md += `### 💎 Điểm Nổi Bật & Giá Trị Học Thuật\n`;
        feat.highlights.forEach(h => {
          md += `- ${h}\n`;
        });
        md += `\n`;
      }

      if (feat.usageGuide) {
        md += `### 🎯 Hướng Dẫn Thao Tác Từng Bước\n`;
        md += `\`\`\`text\n${feat.usageGuide}\n\`\`\`\n\n`;
      }

      if (feat.quickAction) {
        md += `> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"${feat.quickAction.label}"** trong giao diện làm bài.\n\n`;
      }

      md += `---\n\n`;
    });

    md += `*Tài liệu tự động đồng bộ từ \`src/core/featureRegistry.js\` qua GitHub & GitBook.*
`;

    const targetPath = path.join(FEATURES_DIR, meta.fileName);
    fs.writeFileSync(targetPath, md.trim() + '\n', 'utf8');
    console.log(`✅ Đã sinh thành công: docs/features/${meta.fileName} (${features.length} tính năng)`);
  });
}

/**
 * 3. TỰ ĐỘNG CẬP NHẬT docs/SUMMARY.md
 */
function updateSummary() {
  const summaryPath = path.join(DOCS_DIR, 'SUMMARY.md');
  if (!fs.existsSync(summaryPath)) {
    console.warn('⚠️ Không tìm thấy docs/SUMMARY.md');
    return;
  }

  let summaryContent = fs.readFileSync(summaryPath, 'utf8');

  // Khối nội dung mục lục tính năng chuẩn GitBook
  const featuresSummaryBlock = `## 🚀 Hướng Dẫn Sử Dụng & Tính Năng Hệ Thống
* [Tổng Quan Tính Năng Nền Tảng](features/README.md)
* [Phân Hệ AI & Chấm Điểm Chuẩn Cambridge](features/ai-evaluation.md)
* [Kho Đề & Công Cụ Luyện Tập 4 Kỹ Năng](features/practice-tools.md)
* [Phòng Thi Thử Chuẩn CDI & Marathon](features/exam-simulation.md)
* [Cẩm Nang Lý Thuyết & Sổ Tay Từ Vựng](features/theory-vocab.md)
* [Theo Dõi Tiến Độ, Hồ Sơ & Bảng Điểm TRF](features/analytics-profile.md)
* [Bảng Tra Cứu Phím Tắt Toàn Năng](features/shortcuts-ux.md)`;

  const marker = '## 🚀 Hướng Dẫn Sử Dụng & Tính Năng Hệ Thống';

  if (summaryContent.includes(marker)) {
    // Nếu đã có, thay thế đoạn từ marker đến hết hoặc đến header cấp 2 tiếp theo
    const parts = summaryContent.split(marker);
    const before = parts[0];
    const after = parts[1];
    const nextHeaderIndex = after.indexOf('\n## ');

    if (nextHeaderIndex !== -1) {
      summaryContent = before + featuresSummaryBlock + after.substring(nextHeaderIndex);
    } else {
      summaryContent = before + featuresSummaryBlock + '\n';
    }
  } else {
    // Nếu chưa có, thêm vào cuối SUMMARY.md
    summaryContent = summaryContent.trim() + '\n\n---\n\n' + featuresSummaryBlock + '\n';
  }

  fs.writeFileSync(summaryPath, summaryContent, 'utf8');
  console.log('✅ Đã cập nhật docs/SUMMARY.md với danh mục Hướng Dẫn Tính Năng');
}

/**
 * CHẠY QUY TRÌNH ĐỒNG BỘ
 */
export function runSync() {
  console.log('🔄 BẮT ĐẦU ĐỒNG BỘ TÍNH NĂNG TỪ CODEBASE SANG GITBOOK...');
  console.log(`📦 Nguồn: src/core/featureRegistry.js (${FEATURE_REGISTRY.length} tính năng)`);
  
  generateFeaturesHub();
  generateCategoryPages();
  updateSummary();

  console.log('✨ HOÀN TẤT ĐỒNG BỘ GITBOOK THÀNH CÔNG 100%!\n');
}

// Chạy trực tiếp từ CLI nếu gọi script
if (process.argv[1] && process.argv[1].endsWith('sync_features_to_gitbook.js')) {
  runSync();
}
