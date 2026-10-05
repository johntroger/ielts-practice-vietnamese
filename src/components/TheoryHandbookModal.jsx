import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Bookmark, Plus, Trash2, X, Sparkles, 
  Layers, BarChart2, FileText, AlertTriangle, Edit3, Calendar,
  ChevronRight, Lightbulb, CheckCircle2, Copy, Check, Headphones,
  BookMarked, PenTool, Volume2, Mic, Compass, HelpCircle, CheckCheck,
  ExternalLink, Monitor
} from 'lucide-react';
import { THEORY_HANDBOOK } from '../data/theoryHandbook';
import { GITBOOK_DOCS_BASE_URL } from '../core/featureRegistry';

// Helper to render bold, italic, code and inline highlights
function renderInlineText(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;
  let safety = 0;

  while (remaining.length > 0 && safety++ < 2000) {
    // Check for inline code `...`
    const codeMatch = remaining.match(/^\`([^\`]+)\`/);
    if (codeMatch) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-slate-100 text-red-600 font-mono text-[12px] font-semibold border border-slate-200">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for bold **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={key++} className="font-bold text-slate-900">
          {renderInlineText(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for italic *...*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={key++} className="italic text-slate-800 font-medium">
          {renderInlineText(italicMatch[1])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Regular character or unmatched syntax
    const nextSpecial = remaining.search(/[`*]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

// MarkdownRenderer component parses headings, tables, blockquotes, lists, and paragraphs
function MarkdownRenderer({ content, accentColor = 'red' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  const getAccentBarClass = () => {
    switch (accentColor) {
      case 'blue': return 'bg-blue-600';
      case 'emerald': return 'bg-emerald-600';
      case 'purple': return 'bg-purple-600';
      case 'teal': return 'bg-teal-600';
      default: return 'bg-red-600';
    }
  };

  const getNumberBadgeClass = () => {
    switch (accentColor) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'emerald': return 'bg-emerald-100 text-emerald-700';
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'teal': return 'bg-teal-100 text-teal-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const getBulletClass = () => {
    switch (accentColor) {
      case 'blue': return 'bg-blue-500';
      case 'emerald': return 'bg-emerald-500';
      case 'purple': return 'bg-purple-500';
      case 'teal': return 'bg-teal-500';
      default: return 'bg-red-500';
    }
  };

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // Heading 3: ### ...
    if (line.startsWith('### ')) {
      elements.push(
        <div key={`h3-${i}`} className="pt-3 pb-1 border-b border-slate-100 flex items-center gap-2">
          <div className={`w-1.5 h-4 rounded-full ${getAccentBarClass()}`}></div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {renderInlineText(line.replace('### ', ''))}
          </h4>
        </div>
      );
      i++;
      continue;
    }

    // Table detection: line contains '|' and next line is table separator
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const rows = tableLines.slice(2).map(r => 
          r.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        );

        elements.push(
          <div key={`table-${i}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  {headerRow.map((h, colIdx) => (
                    <th key={colIdx} className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] text-slate-700">
                      {renderInlineText(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3.5 py-2.5 text-slate-700 font-sans leading-relaxed align-top">
                        {renderInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Numbered list: 1. ...
    if (/^\d+\.\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-2.5 pl-1 text-xs sm:text-sm text-slate-700 font-sans">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className={`flex items-center justify-center w-5 h-5 rounded-full ${getNumberBadgeClass()} text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs`}>
                {idx + 1}
              </span>
              <span className="leading-relaxed flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list: - ... or * ...
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-2.5 text-xs sm:text-sm text-slate-700 font-sans">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getBulletClass()} shrink-0 mt-2`}></span>
              <span className="leading-relaxed flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Quote or tip block if starts with >
    if (line.startsWith('>')) {
      elements.push(
        <div key={`quote-${i}`} className="my-2 p-3 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{renderInlineText(line.replace(/^>\s*/, ''))}</div>
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed my-1.5">
        {renderInlineText(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-3">{elements}</div>;
}

export default function TheoryHandbookModal({ 
  isOpen, 
  onClose, 
  activeSkill = 'writing',
  personalNotes = [], 
  onSavePersonalNote, 
  onDeletePersonalNote 
}) {
  if (!isOpen) return null;

  // Selected skill tab: 'writing' | 'reading' | 'listening' | 'speaking' | 'grammar-vocab' | 'personal'
  const [selectedSkill, setSelectedSkill] = useState(() => {
    if (activeSkill === 'reading' || activeSkill === 'listening' || activeSkill === 'speaking' || activeSkill === 'grammar-vocab') return activeSkill;
    return 'writing';
  });

  // When opening or prop changes, sync selectedSkill if user hasn't explicitly picked one
  useEffect(() => {
    if (activeSkill === 'reading' || activeSkill === 'listening' || activeSkill === 'speaking' || activeSkill === 'grammar-vocab' || activeSkill === 'writing') {
      setSelectedSkill(activeSkill);
    }
  }, [activeSkill, isOpen]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubType, setActiveSubType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Note creation & editing state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Writing');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('Writing');

  // Handle skill tab change
  const handleSkillTabChange = (skillKey) => {
    setSelectedSkill(skillKey);
    setActiveCategory('all');
    setActiveSubType('all');
    setSearchQuery('');
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveSubType('all');
  };

  const handleCopy = (item) => {
    const textToCopy = `${item.title}\n${item.summary}\n\n${item.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Skill tabs configuration
  const skillTabs = [
    { 
      id: 'writing', 
      label: 'IELTS Writing', 
      count: THEORY_HANDBOOK.filter(i => i.skill === 'writing').length, 
      icon: PenTool,
      color: 'red'
    },
    { 
      id: 'reading', 
      label: 'IELTS Reading', 
      count: THEORY_HANDBOOK.filter(i => i.skill === 'reading').length, 
      icon: BookMarked,
      color: 'blue'
    },
    { 
      id: 'listening', 
      label: 'IELTS Listening', 
      count: THEORY_HANDBOOK.filter(i => i.skill === 'listening').length, 
      icon: Headphones,
      color: 'emerald'
    },
    { 
      id: 'speaking', 
      label: 'IELTS Speaking', 
      count: THEORY_HANDBOOK.filter(i => i.skill === 'speaking').length, 
      icon: Mic,
      color: 'purple'
    },
    { 
      id: 'grammar-vocab', 
      label: 'Ngữ Pháp & Từ Vựng', 
      count: THEORY_HANDBOOK.filter(i => i.skill === 'grammar-vocab').length, 
      icon: Sparkles,
      color: 'teal'
    },
    { 
      id: 'personal', 
      label: 'Ghi Chú Của Bạn', 
      count: personalNotes.length, 
      icon: Bookmark,
      color: 'amber'
    },
  ];

  // Dynamic categories per skill
  const writingCategories = [
    { id: 'all', label: 'Tất Cả Writing', icon: Layers },
    { id: 'general', label: 'Tiêu Chí & Điểm Số', icon: BookOpen },
    { id: 'task1', label: 'Cẩm Nang Task 1', icon: BarChart2 },
    { id: 'task2', label: 'Cẩm Nang Task 2', icon: FileText },
    { id: 'strategy', label: 'Chiến Thuật 7.5+ & Hedging', icon: Compass },
    { id: 'mistakes', label: 'Lỗi Sai Cần Tránh', icon: AlertTriangle },
    { id: 'exam-skills', label: 'Thi Máy CDI & OSR', icon: Monitor },
  ];

  const readingCategories = [
    { id: 'all', label: 'Tất Cả Reading', icon: Layers },
    { id: 'reading-strategy', label: 'Chiến Thuật & Paraphrase', icon: Compass },
    { id: 'reading-types', label: '14 Dạng Câu Hỏi Thường Gặp', icon: BookMarked },
    { id: 'exam-skills', label: 'Kỹ Thuật Thi Máy CDI', icon: Monitor },
  ];

  const listeningCategories = [
    { id: 'all', label: 'Tất Cả Listening', icon: Layers },
    { id: 'listening-strategy', label: 'Format, Điểm & Âm Học', icon: Volume2 },
    { id: 'listening-parts', label: 'Chiến Thuật 4 Parts', icon: Headphones },
    { id: 'exam-skills', label: 'Kỹ Năng Thi Máy CDI', icon: Monitor },
  ];

  const speakingCategories = [
    { id: 'all', label: 'Tất Cả Speaking', icon: Layers },
    { id: 'general', label: 'Tiêu Chí & Lộ Trình', icon: BookOpen },
    { id: 'part1', label: 'Chiến Thuật Part 1', icon: Mic },
    { id: 'part2', label: 'Part 2 & Pacing', icon: FileText },
    { id: 'part3', label: 'Part 3 & Phản Biện', icon: Compass },
    { id: 'pronunciation-strategy', label: 'Phát Âm & Ngữ Điệu', icon: Volume2 },
    { id: 'exam-skills', label: 'Tâm Lý Phòng Thi', icon: AlertTriangle },
  ];

  const grammarVocabCategories = [
    { id: 'all', label: 'Tất Cả Ngữ Pháp & Từ Vựng', icon: Layers },
    { id: 'grammar', label: 'Ngữ Pháp Trọng Tâm (A1 - A7)', icon: BookOpen },
    { id: 'vocab', label: 'Từ Vựng & Sổ Tay Lỗi (B1 - B6)', icon: Sparkles },
  ];

  const currentCategories = selectedSkill === 'reading' 
    ? readingCategories 
    : selectedSkill === 'listening' 
    ? listeningCategories 
    : selectedSkill === 'speaking'
    ? speakingCategories
    : selectedSkill === 'grammar-vocab'
    ? grammarVocabCategories
    : writingCategories;

  // Subtype filters
  const writingGeneralSubTypes = [
    { id: 'all', label: 'Tất cả tiêu chí' },
    { id: 'progression-5-75', label: '⭐ Lộ Trình Nâng Band 5.0 -> 7.5' },
    { id: 'descriptors', label: 'Band Descriptors 2026' },
    { id: 'strategy', label: 'Bí Quyết 5.5 - 6.0 & 7.5+' },
  ];

  const writingTask1SubTypes = [
    { id: 'all', label: 'Tất cả Task 1' },
    { id: 'line', label: 'Line Graph (Đường)' },
    { id: 'bar', label: 'Bar Chart (Cột)' },
    { id: 'pie', label: 'Pie Chart (Tròn)' },
    { id: 'table', label: 'Table (Bảng)' },
    { id: 'process', label: 'Process (Quy trình)' },
    { id: 'map', label: 'Map (Bản đồ)' },
    { id: 'mixed', label: 'Mixed (Kết hợp)' },
    { id: 'proportions', label: 'Tỷ Lệ Xấp Xỉ & Biến Động' },
    { id: 'future-projections', label: 'Dự Báo Tương Lai (2030-2050)' },
  ];

  const writingTask2SubTypes = [
    { id: 'all', label: 'Tất cả Task 2' },
    { id: 'progression-5-75', label: '⭐ Lộ Trình Nâng Band 5.0 -> 7.5' },
    { id: 'opinion', label: 'Agree / Disagree' },
    { id: 'discussion', label: 'Discuss Both Views' },
    { id: 'advantages', label: 'Advantages vs Disadvantages' },
    { id: 'problem-solution', label: 'Problem & Solution' },
    { id: 'two-part', label: 'Two-Part Question' },
    { id: 'counter-argument', label: 'Phản Biện & Bác Bỏ (8.0+)' },
    { id: 'grammar-8', label: 'Ngữ Pháp 8.0+ Đắt Giá' },
    { id: 'collocations', label: 'Academic Collocations' },
    { id: 'ideation', label: 'Tìm Ý Tưởng (PESTLE)' },
    { id: 'coherence-8', label: 'Liên Kết Ẩn CC (8.0+)' },
    { id: 'intro-thesis', label: 'Paraphrase Mở Bài & Thesis' },
  ];

  const writingMistakesSubTypes = [
    { id: 'all', label: 'Tất cả lỗi sai' },
    { id: 'checklist', label: '10 Lỗi Mất Điểm' },
    { id: 'punctuation', label: 'Dấu Câu & Comma Splice' },
  ];

  const readingSubTypes = [
    { id: 'all', label: 'Tất cả dạng bài' },
    { id: 'progression-5-75', label: '⭐ Lộ Trình 5.0 -> 7.5 (Số Câu Đúng)' },
    { id: 'overview', label: '15-20-25m & Thang Điểm' },
    { id: 'tfng', label: 'True / False / Not Given' },
    { id: 'headings', label: 'Matching Headings' },
    { id: 'mcq', label: 'Multiple Choice' },
    { id: 'matching', label: 'Matching Info / Features' },
    { id: 'completion', label: 'Điền từ / Summary' },
    { id: 'summary-box', label: 'Summary Điền Từ Khung' },
    { id: 'diagram-flow', label: 'Diagram & Flow-Chart' },
    { id: 'passage3-stance', label: 'Passage 3: Quan Điểm Tác Giả' },
    { id: 'chunking-speed', label: 'Đọc Cụm Nghĩa (300+ WPM)' },
    { id: 'time-management', label: 'Quy Tắc 90s & Bỏ Cuộc' },
    { id: 'paraphrase', label: '5 Quy Tắc Paraphrase' },
    { id: 'guessing', label: 'Đoán Nghĩa & Gốc Từ' },
    { id: 'synonyms', label: '50 Cặp Paraphrase Cam' },
    { id: 'emergency', label: 'Cấp Cứu 5 Phút Cuối' },
  ];

  const listeningSubTypes = [
    { id: 'all', label: 'Tất cả dạng bài' },
    { id: 'progression-5-75', label: '⭐ Lộ Trình 5.0 -> 7.5 (Part 1-4)' },
    { id: 'overview', label: 'Format & CD-IELTS' },
    { id: 'part1', label: 'Part 1: Đánh Vần, Số & Postcode' },
    { id: 'part2', label: 'Part 2: Bản Đồ & Định Hướng' },
    { id: 'part3', label: 'Part 3: Trắc Nghiệm Học Thuật' },
    { id: 'tone-attitude', label: 'Thái Độ & Ngữ Điệu Part 3' },
    { id: 'part4', label: 'Part 4: Dàn Bài & Signposting' },
    { id: 'prediction', label: '30s Đọc Trước Đề Thi' },
    { id: 'dictation-shadowing', label: 'Chép Chính Tả & Shadowing' },
    { id: 'phonetics', label: 'Nối Âm, Nuốt Âm & Schwa' },
    { id: 'spelling', label: '80 Từ Dễ Sai Chính Tả' },
    { id: 'plurals', label: 'Phán Đoán Đuôi -s' },
    { id: 'units', label: 'Bẫy Đơn Vị & Tiền Tệ' },
    { id: 'accents', label: 'Accent Vùng Miền' },
    { id: 'cd-hacks', label: 'Phím Tắt & Mẹo Thi Máy' },
  ];

  const speakingSubTypes = [
    { id: 'all', label: 'Tất cả chủ đề' },
    { id: 'progression-5-75', label: '⭐ Lộ Trình 5.0 -> 7.5 (Makeover Câu)' },
    { id: 'criteria', label: '4 Tiêu Chí & Làm Tròn' },
    { id: 'strategy', label: 'Công Thức A.R.E.A & PPF' },
    { id: 'pacing', label: 'Căn Giờ 2 Phút Part 2' },
    { id: 'archetypes', label: '5 Cốt Truyện Vạn Năng Part 2' },
    { id: 'comparisons', label: 'Ma Trận So Sánh Part 3' },
    { id: 'fluency', label: '50+ Câu Đệm Câu Giờ' },
    { id: 'naturalness', label: 'Né Bẫy Học Thuộc Lòng' },
    { id: 'idioms', label: '35+ Thành Ngữ Band 8.0+' },
    { id: 'pronunciation', label: 'Âm Đuôi, Trọng Âm & Ngữ Điệu' },
    { id: 'mindset', label: 'Tâm Lý & Giám Khảo Ngắt Lời' },
  ];

  const grammarVocabSubTypes = [
    { id: 'all', label: 'Tất cả chuyên đề' },
    { id: 'grammar-sentence-structures', label: 'A1. Câu Đơn, Ghép, Phức & Quan Hệ' },
    { id: 'grammar-tenses-by-task', label: 'A2. Chọn Thì Đúng Cho Từng Task' },
    { id: 'grammar-passive-voice', label: 'A3. Câu Bị Động & Bị Động Khách Quan' },
    { id: 'grammar-conditionals', label: 'A4. Câu Điều Kiện Toàn Diện' },
    { id: 'grammar-comparison-structures', label: 'A5. Cấu Trúc So Sánh Đa Dạng' },
    { id: 'grammar-advanced-structures', label: 'A6. Đảo Ngữ, Câu Chẻ & Danh Từ Hóa' },
    { id: 'grammar-common-errors-vietnamese', label: 'A7. Lỗi Ngữ Pháp Người Việt' },
    { id: 'vocab-linking-devices', label: 'B1. Từ Nối Cohesive Devices' },
    { id: 'vocab-task1-data-language', label: 'B2. Ngôn Ngữ Số Liệu Task 1' },
    { id: 'vocab-topic-collocations', label: 'B3. Academic Collocations 8 Chủ Đề' },
    { id: 'vocab-academic-word-families', label: 'B4. Họ Từ AWL & Paraphrase' },
    { id: 'vocab-speaking-functional-language', label: 'B5. Ngôn Ngữ Chức Năng Speaking' },
    { id: 'error-log-and-paraphrase-journal', label: 'B6. Sổ Tay Quản Trị Lỗi Sai' },
  ];

  // Filter handbook by selected skill, category, subtype, and search query
  const filteredHandbook = THEORY_HANDBOOK.filter(item => {
    if (selectedSkill !== 'personal' && item.skill !== selectedSkill) return false;
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSubType = activeSubType === 'all' || item.subType === activeSubType;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSubType && matchesSearch;
  });

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    onSavePersonalNote({
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tag: newNoteTag,
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const startEditNote = (n) => {
    setEditingNoteId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
    setEditTag(n.tag || 'Writing');
  };

  const handleSaveEdit = (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    const updated = {
      id,
      title: editTitle.trim(),
      content: editContent.trim(),
      tag: editTag,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' (đã sửa)'
    };
    onDeletePersonalNote(id);
    onSavePersonalNote(updated);
    setEditingNoteId(null);
  };

  // Header meta configuration based on selected skill
  const getHeaderMeta = () => {
    switch (selectedSkill) {
      case 'reading':
        return {
          title: 'Cẩm Nang Chiến Lược & Kỹ Thuật IELTS Reading',
          subtitle: 'Phân bổ thời gian 15-20-25 phút, phá bẫy True/False/Not Given, Matching Headings & 5 quy tắc Paraphrasing',
          badge: 'Reading Studio',
          icon: BookMarked,
          accent: 'blue',
          headerBg: 'from-blue-900 via-slate-900 to-slate-900',
          iconBg: 'bg-blue-600/30 text-blue-400 border-blue-500/30'
        };
      case 'listening':
        return {
          title: 'Cẩm Nang Chiến Thuật & Âm Học IELTS Listening',
          subtitle: 'Quy tắc 4 Parts, bẫy đánh vần, số điện thoại, bản đồ không gian, signposting và nối/nuốt âm tự nhiên',
          badge: 'Listening Studio',
          icon: Headphones,
          accent: 'emerald',
          headerBg: 'from-emerald-950 via-slate-900 to-slate-900',
          iconBg: 'bg-emerald-600/30 text-emerald-400 border-emerald-500/30'
        };
      case 'speaking':
        return {
          title: 'Cẩm Nang Chiến Lược & Phản Xạ IELTS Speaking',
          subtitle: 'Công thức A.R.E.A Part 1, kể chuyện PPF Part 2, tư duy phản biện PEEL Part 3 & 50+ cụm từ câu giờ',
          badge: 'Speaking Studio',
          icon: Mic,
          accent: 'purple',
          headerBg: 'from-purple-950 via-slate-900 to-slate-900',
          iconBg: 'bg-purple-600/30 text-purple-400 border-purple-500/30'
        };
      case 'grammar-vocab':
        return {
          title: 'Ngữ Pháp & Từ Vựng Trọng Tâm IELTS (A1 – A7 & B1 – B6)',
          subtitle: 'Hệ thống cấu trúc câu, thì, câu bị động, đảo ngữ, họ từ AWL, collocations và sổ tay quản trị lỗi sai',
          badge: 'Grammar & Vocab Hub',
          icon: Sparkles,
          accent: 'teal',
          headerBg: 'from-teal-950 via-slate-900 to-slate-900',
          iconBg: 'bg-teal-600/30 text-teal-400 border-teal-500/30'
        };
      case 'personal':
        return {
          title: 'Sổ Tay Ghi Chú & Mẹo Học Riêng Của Bạn',
          subtitle: 'Lưu trữ các câu mẫu, từ vựng đắt giá, template và checklist cá nhân hoá cho kỳ thi IELTS',
          badge: 'Personal Notes',
          icon: Bookmark,
          accent: 'amber',
          headerBg: 'from-amber-950 via-slate-900 to-slate-900',
          iconBg: 'bg-amber-600/30 text-amber-400 border-amber-500/30'
        };
      default:
        return {
          title: 'Cẩm Nang Lý Thuyết & Chiến Thuật IELTS Writing',
          subtitle: 'Tra cứu công thức câu Overview Task 1, mô hình PEEL Task 2, từ nối liên kết và checklist tránh mất điểm',
          badge: 'Writing Studio',
          icon: PenTool,
          accent: 'red',
          headerBg: 'from-red-950 via-slate-900 to-slate-900',
          iconBg: 'bg-red-600/30 text-red-400 border-red-500/30'
        };
    }
  };

  const headerMeta = getHeaderMeta();
  const HeaderIcon = headerMeta.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className={`bg-gradient-to-r ${headerMeta.headerBg} text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${headerMeta.iconBg} border shrink-0`}>
              <HeaderIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-200 border border-white/10">
                  {headerMeta.badge}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• Thư viện chiến thuật chuẩn khảo thí Cambridge</span>
              </div>
              <h2 className="text-sm sm:text-lg lg:text-xl font-bold mt-0.5 truncate">{headerMeta.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-1">{headerMeta.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 ml-2">
            {/* GitBook Docs Portal (Fallback: vneconomics.gitbook.io via VITE_GITBOOK_URL) */}
            <a
              href={GITBOOK_DOCS_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-500/25 hover:bg-sky-500/35 text-sky-200 hover:text-white text-xs font-bold border border-sky-400/40 transition-all cursor-pointer shrink-0 shadow-xs"
              title="Mở cẩm nang trực tuyến trên trang web riêng (giao diện sách điện tử toàn màn hình, mục lục đầy đủ & chế độ ban đêm)"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Mở Bản Web Đầy Đủ</span>
              <span className="sm:hidden">Bản Web</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            <button 
              onClick={onClose} 
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Đóng cẩm nang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level 1 Navigation: Skill Switcher Bar */}
        <div className="bg-slate-900/95 px-4 pt-2.5 pb-0 border-b border-slate-800">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {skillTabs.map(tab => {
              const TabIcon = tab.icon;
              const isSelected = selectedSkill === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSkillTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? tab.color === 'red'
                        ? 'bg-red-600 text-white shadow-md'
                        : tab.color === 'blue'
                        ? 'bg-blue-600 text-white shadow-md'
                        : tab.color === 'emerald'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : tab.color === 'purple'
                        ? 'bg-purple-600 text-white shadow-md'
                        : tab.color === 'teal'
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 2 Navigation: Search & Category Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  selectedSkill === 'reading'
                    ? "Tìm kiếm lý thuyết Reading (vd: T/F/NG, headings, scanning, 15-20-25m, paraphrase...)"
                    : selectedSkill === 'listening'
                    ? "Tìm kiếm lý thuyết Listening (vd: part 1, số điện thoại, bản đồ, signpost, nối âm, schwa...)"
                    : selectedSkill === 'speaking'
                    ? "Tìm kiếm lý thuyết Speaking (vd: A.R.E.A, PPF storytelling, PEEL, buying time, phát âm...)"
                    : selectedSkill === 'grammar-vocab'
                    ? "Tìm kiếm Ngữ Pháp & Từ Vựng (vd: câu điều kiện, bị động, đảo ngữ, collocations, AWL, error log...)"
                    : selectedSkill === 'personal'
                    ? "Tìm kiếm trong sổ tay ghi chú của bạn..."
                    : "Tìm kiếm lý thuyết Writing (vd: line graph, overview, PEEL, opinion, map, bị động...)"
                }
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 bg-white"
              />
            </div>

            {selectedSkill === 'personal' && (
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingNote ? 'Đóng Trình Tạo' : 'Tạo Ghi Chú Mới'}</span>
              </button>
            )}
          </div>

          {/* Categories for Handbook Skills */}
          {selectedSkill !== 'personal' && (
            <div className="space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {currentCategories.map(c => {
                  const Icon = c.icon;
                  const isActive = activeCategory === c.id;
                  const activeColorClass = 
                    selectedSkill === 'reading'
                      ? 'bg-blue-600 text-white'
                      : selectedSkill === 'listening'
                      ? 'bg-emerald-600 text-white'
                      : selectedSkill === 'speaking'
                      ? 'bg-purple-600 text-white'
                      : selectedSkill === 'grammar-vocab'
                      ? 'bg-teal-600 text-white'
                      : 'bg-red-600 text-white';

                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        isActive 
                          ? `${activeColorClass} shadow-2xs` 
                          : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Filters for Writing General */}
              {selectedSkill === 'writing' && activeCategory === 'general' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Tiêu chí & Lộ trình:</span>
                  {writingGeneralSubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-red-100 text-red-800 border border-red-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Writing Task 1 */}
              {selectedSkill === 'writing' && activeCategory === 'task1' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Dạng biểu đồ:</span>
                  {writingTask1SubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-red-100 text-red-800 border border-red-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Writing Task 2 */}
              {selectedSkill === 'writing' && activeCategory === 'task2' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Dạng câu hỏi:</span>
                  {writingTask2SubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-red-100 text-red-800 border border-red-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Writing Mistakes */}
              {selectedSkill === 'writing' && activeCategory === 'mistakes' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Phân loại lỗi:</span>
                  {writingMistakesSubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-red-100 text-red-800 border border-red-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Reading */}
              {selectedSkill === 'reading' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-blue-500 font-semibold whitespace-nowrap mr-1">Dạng bài:</span>
                  {readingSubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Listening */}
              {selectedSkill === 'listening' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-emerald-600 font-semibold whitespace-nowrap mr-1">Phần thi & Âm học:</span>
                  {listeningSubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Speaking */}
              {selectedSkill === 'speaking' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-purple-600 font-semibold whitespace-nowrap mr-1">Chủ đề & Kỹ thuật:</span>
                  {speakingSubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-purple-100 text-purple-800 border border-purple-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Filters for Grammar & Vocab */}
              {selectedSkill === 'grammar-vocab' && (
                <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
                  <span className="text-teal-700 font-semibold whitespace-nowrap mr-1">Chuyên đề A & B:</span>
                  {grammarVocabSubTypes.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setActiveSubType(st.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeSubType === st.id
                          ? 'bg-teal-100 text-teal-800 border border-teal-300 font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* PERSONAL NOTES VIEW */}
          {selectedSkill === 'personal' ? (
            <div className="space-y-4">
              {/* Add Note Form */}
              {isAddingNote && (
                <form onSubmit={handleAddNoteSubmit} className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Biên soạn mẹo / ghi chú mới
                    </span>
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-amber-200 font-medium text-slate-700 focus:outline-none"
                    >
                      <option value="Writing">IELTS Writing</option>
                      <option value="Reading">IELTS Reading</option>
                      <option value="Listening">IELTS Listening</option>
                      <option value="Speaking">IELTS Speaking</option>
                      <option value="Vocabulary">Từ Vựng & Collocation</option>
                      <option value="Grammar">Cấu Trúc Ngữ Pháp</option>
                      <option value="General">Mẹo Chung & Chiến Thuật</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Tiêu đề ghi chú (vd: Công thức câu Overview của thầy Simon hoặc bẫy T/F/NG cần nhớ)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white font-semibold"
                  />
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Nội dung ghi chú chi tiết... (hỗ trợ dán template, cấu trúc câu, từ vựng hoặc checklist của riêng bạn)"
                    rows={5}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white resize-none font-sans"
                  />
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-2xs cursor-pointer"
                    >
                      Lưu Ghi Chú
                    </button>
                  </div>
                </form>
              )}

              {/* Note List */}
              {personalNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalNotes.map(n => (
                    <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
                      {editingNoteId === n.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-sans resize-none"
                          />
                          <div className="flex items-center justify-between">
                            <select
                              value={editTag}
                              onChange={(e) => setEditTag(e.target.value)}
                              className="text-[11px] px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600"
                            >
                              <option value="Writing">Writing</option>
                              <option value="Reading">Reading</option>
                              <option value="Listening">Listening</option>
                              <option value="Vocabulary">Vocabulary</option>
                              <option value="Grammar">Grammar</option>
                              <option value="General">General</option>
                            </select>
                            <div className="flex space-x-1.5">
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-2.5 py-1 rounded text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => handleSaveEdit(n.id)}
                                className="px-3 py-1 rounded bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer"
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                              <div>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
                                  {n.tag || 'Ghi Chú'}
                                </span>
                                <h4 className="font-bold text-sm text-slate-900 leading-snug">{n.title}</h4>
                              </div>
                              <div className="flex items-center space-x-1 shrink-0">
                                <button
                                  onClick={() => startEditNote(n)}
                                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                  title="Chỉnh sửa ghi chú"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeletePersonalNote(n.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Xóa ghi chú này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="pt-1">
                              <MarkdownRenderer content={n.content} accentColor="amber" />
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {n.createdAt}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Chưa có ghi chú cá nhân nào</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Hãy bấm nút <strong className="text-amber-600">"Tạo Ghi Chú Mới"</strong> ở góc trên để ghi lại các câu mẫu, từ vựng đắt giá hoặc mẹo học riêng của bạn! Dữ liệu được lưu an toàn trong trình duyệt.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* STANDARD HANDBOOK VIEW */
            <div className="space-y-6">
              {/* Quick web reader callout banner */}
              <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 border border-sky-100 text-xs text-sky-950 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Đọc Thoải Mái Hơn Trên Trang Web Riêng?</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-200 text-sky-800">E-Book</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-none">
                      Xem đầy đủ 113 chuyên đề với thanh mục lục bên trái, tìm kiếm nhanh và chế độ đọc toàn màn hình.
                    </p>
                  </div>
                </div>
                <a
                  href={GITBOOK_DOCS_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs ml-2 cursor-pointer"
                  title="Mở cẩm nang trên trang web riêng"
                >
                  <span className="hidden sm:inline">Mở Bản Web</span>
                  <span className="sm:hidden">Mở</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {filteredHandbook.length > 0 ? (
                filteredHandbook.map(item => {
                  const isCopied = copiedId === item.id;
                  const itemColor = 
                    item.skill === 'reading' 
                      ? 'blue' 
                      : item.skill === 'listening' 
                      ? 'emerald' 
                      : item.skill === 'speaking'
                      ? 'purple'
                      : item.skill === 'grammar-vocab'
                      ? 'teal'
                      : 'red';

                  return (
                    <div 
                      key={item.id} 
                      className={`p-6 rounded-2xl border bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-4 ${
                        itemColor === 'blue' 
                          ? 'border-blue-100 hover:border-blue-200' 
                          : itemColor === 'emerald'
                          ? 'border-emerald-100 hover:border-emerald-200'
                          : itemColor === 'purple'
                          ? 'border-purple-100 hover:border-purple-200'
                          : itemColor === 'teal'
                          ? 'border-teal-100 hover:border-teal-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              itemColor === 'blue'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : itemColor === 'emerald'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : itemColor === 'purple'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : itemColor === 'teal'
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {item.skill === 'reading' 
                                ? 'IELTS Reading' 
                                : item.skill === 'listening' 
                                ? 'IELTS Listening' 
                                : item.skill === 'speaking'
                                ? 'IELTS Speaking'
                                : item.skill === 'grammar-vocab'
                                ? (item.category === 'grammar' ? 'Ngữ Pháp Trọng Tâm' : 'Từ Vựng & Sổ Tay')
                                : (item.category === 'task1' ? 'IELTS Task 1' : item.category === 'task2' ? 'IELTS Task 2' : item.category === 'mistakes' ? 'Cảnh Báo Lỗi' : item.category === 'exam-skills' ? 'Thi Máy CDI' : 'Chiến Lược & Tiêu Chí')}
                            </span>
                            {item.stage && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
                                {item.stage}
                              </span>
                            )}
                            {item.subType === 'progression-5-75' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white shadow-2xs flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-200" />
                                <span>Lộ Trình Band 5.0 - 7.5</span>
                              </span>
                            )}
                          </div>
                          <h3 className={`font-bold text-base sm:text-lg leading-snug ${
                            itemColor === 'blue'
                              ? 'text-blue-900'
                              : itemColor === 'emerald'
                              ? 'text-emerald-900'
                              : itemColor === 'purple'
                              ? 'text-purple-900'
                              : itemColor === 'teal'
                              ? 'text-teal-900'
                              : 'text-slate-900'
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.summary}</p>
                        </div>

                        {/* Copy & GitBook Deep Link Buttons */}
                        <div className="flex items-center space-x-1.5 shrink-0 flex-wrap gap-1">
                          {item.gitbookSlug && (
                            <a
                              href={`${GITBOOK_DOCS_BASE_URL}/${item.gitbookSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-sky-200/90 bg-sky-50/70 hover:bg-sky-100 text-sky-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
                              title={`Đọc bài "${item.title}" trực tiếp trên GitBook`}
                            >
                              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                              <span className="hidden sm:inline">Bản Web</span>
                              <ExternalLink className="w-3 h-3 text-sky-500" />
                            </a>
                          )}
                          <button
                            onClick={() => handleCopy(item)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                            title="Sao chép toàn bộ bài viết này"
                          >
                            {isCopied ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Đã chép!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-1">
                        <MarkdownRenderer content={item.content} accentColor={itemColor} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                  <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Không tìm thấy bài cẩm nang nào phù hợp với bộ lọc hoặc từ khóa "${searchQuery}".</p>
                  <button 
                    onClick={() => { setActiveCategory('all'); setActiveSubType('all'); setSearchQuery(''); }}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Xóa bộ lọc để xem tất cả
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
