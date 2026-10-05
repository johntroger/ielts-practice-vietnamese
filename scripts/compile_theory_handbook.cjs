/**
 * scripts/compile_theory_handbook.cjs
 * Compiles all 113 comprehensive master guides from docs/ and docs/SUMMARY.md
 * into src/data/theoryHandbook.js with full metadata, categories, subTypes, and GitBook slugs.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const SUMMARY_PATH = path.join(DOCS_DIR, 'SUMMARY.md');
const TARGET_PATH = path.join(ROOT_DIR, 'src/data/theoryHandbook.js');

// Helper to parse a markdown doc
function parseDoc(filePath, fallbackTitle, stageName) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split('\n');
  let title = '';
  let summary = '';
  let introParas = [];
  let contentStartIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('# ') && !title) {
      title = lines[i].replace('# ', '').trim();
      contentStartIdx = i + 1;
      break;
    }
  }

  if (!title) title = fallbackTitle;

  let i = contentStartIdx;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('>')) {
      const clean = line.replace(/^>\s*/, '').trim();
      if (clean.includes('Tóm tắt:')) {
        summary = clean.replace(/.*\*\*Tóm tắt\*\*:\s*/, '').replace(/.*Tóm tắt:\s*/, '').trim();
      } else if (!summary && !clean.includes('Kỹ năng') && !clean.includes('Chuyên mục') && !clean.includes('Tiêu chí') && !clean.includes('Trình độ') && !clean.includes('Dùng ở')) {
        summary = clean.replace(/\*\*[^*]+\*\*:\s*/, '').trim();
      }
    } else if (line.startsWith('[← Về trang') || line.startsWith('<!--')) {
      // skip nav links
    } else if (line === '---' || line.startsWith('## ')) {
      break;
    } else if (line.length > 20 && !summary) {
      introParas.push(line);
    }
    i++;
  }

  if (!summary && introParas.length > 0) {
    summary = introParas[0].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
    if (summary.length > 180) summary = summary.slice(0, 177) + '...';
  }

  if (!summary) {
    summary = `Cẩm nang chuyên sâu: ${title}. Hướng dẫn chi tiết chiến thuật thực chiến chuẩn Cambridge.`;
  }

  let bodyLines = lines.slice(contentStartIdx);
  const firstHeadingOrSep = bodyLines.findIndex(l => l.trim() === '---' || l.startsWith('## '));
  if (firstHeadingOrSep !== -1) {
    bodyLines = bodyLines.slice(firstHeadingOrSep);
    if (bodyLines[0].trim() === '---') bodyLines = bodyLines.slice(1);
  }

  let content = bodyLines.join('\n').trim();
  content = content.replace(/\n---\n\*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master.*\*/s, '').trim();
  content = content.replace(/\[← Về trang Ngữ Pháp & Từ Vựng\]\(README\.md\)\s*/g, '').trim();

  return { title, summary, content };
}

// Helper to determine skill
function getSkill(sectionName, relPath) {
  if (sectionName.includes('Writing') || relPath.startsWith('writing/')) return 'writing';
  if (sectionName.includes('Reading') || relPath.startsWith('reading/')) return 'reading';
  if (sectionName.includes('Listening') || relPath.startsWith('listening/')) return 'listening';
  if (sectionName.includes('Speaking') || relPath.startsWith('speaking/')) return 'speaking';
  if (sectionName.includes('Ngữ Pháp') || relPath.startsWith('grammar-vocab/')) return 'grammar-vocab';
  return 'writing';
}

// Helper to determine category
function getCategory(skill, stageName, fileName) {
  const fn = fileName.toLowerCase();
  const st = (stageName || '').toLowerCase();

  if (skill === 'grammar-vocab') {
    if (fn.startsWith('grammar-') || fn === 'readme') return 'grammar';
    return 'vocab';
  }

  if (skill === 'writing') {
    if (st.includes('chặng 4') || fn.includes('cdi')) return 'exam-skills';
    if (fn.includes('comma-splice') || fn.includes('common-mistakes')) return 'mistakes';
    if (fn.includes('task1') || fn.includes('floor-plans') || fn.includes('line-graph') || fn.includes('bar-chart') || fn.includes('pie-chart') || fn.includes('table') || fn.includes('process') || fn.includes('map') || fn.includes('mixed')) {
      return 'task1';
    }
    if (fn.includes('task2') || fn.includes('peel') || fn.includes('paraphrase-thesis') || fn.includes('counter-argument') || fn.includes('pestle') || fn.includes('thematic-progression') || fn.includes('comparative-superlative')) {
      return 'task2';
    }
    if (fn.includes('academic-hedging') || fn.includes('examiner-insights') || fn.includes('band-7plus')) {
      return 'strategy';
    }
    return 'general';
  }

  if (skill === 'reading') {
    if (st.includes('chặng 4') || fn.includes('computer') || fn.includes('cdi')) return 'exam-skills';
    if (fn.includes('true-false') || fn.includes('tfng') || fn.includes('matching-headings') || fn.includes('matching-names') || fn.includes('multiple-choice') || fn.includes('matching-info') || fn.includes('summary-box') || fn.includes('diagram') || fn.includes('short-answer') || fn.includes('completion-forms')) {
      return 'reading-types';
    }
    return 'reading-strategy';
  }

  if (skill === 'listening') {
    if (st.includes('chặng 4') || fn.includes('cd-ielts') || fn.includes('cdi')) return 'exam-skills';
    if (fn.includes('part') || fn.includes('map') || fn.includes('consensus-traps') || fn.includes('academic-discussion') || fn.includes('tone-attitude') || fn.includes('lecture-signposting')) {
      return 'listening-parts';
    }
    return 'listening-strategy';
  }

  if (skill === 'speaking') {
    if (st.includes('chặng 4') || fn.includes('interruption') || fn.includes('emergency')) return 'exam-skills';
    if (fn.includes('pronunciation') || fn.includes('intonation')) return 'pronunciation-strategy';
    if (fn.includes('part1') || fn.includes('area-framework')) return 'part1';
    if (fn.includes('part2') || fn.includes('storytelling') || fn.includes('pacing') || fn.includes('archetypes') || fn.includes('natural-fillers') || fn.includes('star-storytelling')) {
      return 'part2';
    }
    if (fn.includes('part3') || fn.includes('critical-thinking') || fn.includes('macro') || fn.includes('comparison') || fn.includes('collocations') || fn.includes('idiomatic')) {
      return 'part3';
    }
    return 'general';
  }

  return 'general';
}

// Helper to determine subType
function getSubType(fileName, category) {
  const fn = fileName.toLowerCase().replace('.md', '');
  if (fn.includes('line-graph')) return 'line';
  if (fn.includes('bar-chart')) return 'bar';
  if (fn.includes('pie-chart')) return 'pie';
  if (fn.includes('table')) return 'table';
  if (fn.includes('process')) return 'process';
  if (fn.includes('map')) return 'map';
  if (fn.includes('mixed')) return 'mixed';
  if (fn.includes('proportions')) return 'proportions';
  if (fn.includes('future-projections')) return 'future-projections';
  if (fn.includes('progression-50-to-75')) return 'progression-5-75';
  if (fn.includes('peel')) return 'peel';
  if (fn.includes('opinion')) return 'opinion';
  if (fn.includes('discussion')) return 'discussion';
  if (fn.includes('advantages')) return 'advantages';
  if (fn.includes('problem-solution')) return 'problem-solution';
  if (fn.includes('two-part')) return 'two-part';
  if (fn.includes('counter-argument')) return 'counter-argument';
  if (fn.includes('grammar') && fn.includes('band8')) return 'grammar-8';
  if (fn.includes('pestle')) return 'pestle';
  if (fn.includes('collocations')) return 'collocations';
  if (fn.includes('comma-splice')) return 'comma-splice';
  if (fn.includes('cdi') || fn.includes('computer')) return 'cdi-exam';
  if (fn.includes('hedging')) return 'hedging';
  return fn;
}

// Main compiler
function compile() {
  console.log('🔄 Bắt đầu biên dịch Cẩm Nang Lý Thuyết từ GitBook docs/ sang theoryHandbook.js...');

  const summaryRaw = fs.readFileSync(SUMMARY_PATH, 'utf8');
  const lines = summaryRaw.split('\n');

  let currentSection = '';
  let currentStage = '';
  const lessons = [];

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      currentStage = '';
      continue;
    }
    if (line.startsWith('### ')) {
      currentStage = line.replace('### ', '').trim();
      continue;
    }
    const match = line.match(/^\*\s*\[(.*?)\]\((.*?\.md)\)/);
    if (match) {
      const linkTitle = match[1].trim();
      const relPath = match[2].trim();
      if (relPath === 'README.md' || relPath === 'four-skills-overview.md' || relPath.startsWith('features/')) {
        continue;
      }
      lessons.push({
        section: currentSection,
        stage: currentStage,
        linkTitle,
        relPath
      });
    }
  }

  console.log(`📑 Tìm thấy ${lessons.length} bài học trong SUMMARY.md`);

  const compiledHandbook = [];
  const idSet = new Set();

  lessons.forEach((lesson, index) => {
    const fullPath = path.join(DOCS_DIR, lesson.relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File không tồn tại: ${lesson.relPath}`);
      return;
    }

    const fileName = path.basename(lesson.relPath, '.md');
    const skill = getSkill(lesson.section, lesson.relPath);
    const category = getCategory(skill, lesson.stage, fileName);
    const subType = getSubType(fileName, category);

    const parsed = parseDoc(fullPath, lesson.linkTitle, lesson.stage);

    let id = fileName;
    if (idSet.has(id)) {
      id = `${skill}-${id}`;
    }
    idSet.add(id);

    compiledHandbook.push({
      id: id,
      skill: skill,
      stage: lesson.stage || '',
      title: parsed.title,
      category: category,
      subType: subType,
      summary: parsed.summary,
      content: parsed.content,
      gitbookSlug: lesson.relPath.replace(/\.md$/, '')
    });
  });

  console.log(`✅ Đã trích xuất và xử lý hoàn tất ${compiledHandbook.length} bài cẩm nang!`);

  const fileContent = [
    '/**',
    ' * theoryHandbook.js - Master Theory & Exam Strategy Handbook',
    ' * Toàn bộ 113 chuyên đề lý thuyết & chiến lược thực chiến từ Cambridge Assessment & GitBook Docs.',
    ' * Phân bố:',
    ` * - Writing: ${compiledHandbook.filter(i => i.skill === 'writing').length} chuyên đề`,
    ` * - Reading: ${compiledHandbook.filter(i => i.skill === 'reading').length} chuyên đề`,
    ` * - Listening: ${compiledHandbook.filter(i => i.skill === 'listening').length} chuyên đề`,
    ` * - Speaking: ${compiledHandbook.filter(i => i.skill === 'speaking').length} chuyên đề`,
    ` * - Ngữ Pháp & Từ Vựng: ${compiledHandbook.filter(i => i.skill === 'grammar-vocab').length} chuyên đề`,
    ' */',
    '',
    `export const THEORY_HANDBOOK = ${JSON.stringify(compiledHandbook, null, 2)};`,
    ''
  ].join('\n');

  fs.writeFileSync(TARGET_PATH, fileContent, 'utf8');
  console.log(`🎉 Đã lưu thành công vào ${TARGET_PATH} (${(fileContent.length / 1024).toFixed(1)} KB)`);
}

compile();
