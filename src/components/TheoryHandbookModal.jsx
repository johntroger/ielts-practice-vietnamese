import React, { useState } from 'react';
import { 
  BookOpen, Search, Bookmark, Plus, Trash2, X, Sparkles, 
  Layers, BarChart2, FileText, AlertTriangle, Edit3, Calendar,
  ChevronRight, Lightbulb, CheckCircle2, Copy, Check
} from 'lucide-react';
import { THEORY_HANDBOOK } from '../data/theoryHandbook';

// Helper to render bold, italic, code and arrow highlights inline
function renderInlineText(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;
  let safety = 0;

  while (remaining.length > 0 && safety++ < 2000) {
    // Check for inline code `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
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
      // Unmatched single ` or * -> consume 1 character to avoid infinite loop
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
function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

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
          <div className="w-1.5 h-4 rounded-full bg-red-600"></div>
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
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs">
                {idx + 1}
              </span>
              <span className="leading-relaxed flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list: - ...
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
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></span>
              <span className="leading-relaxed flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Quote or tip block if starts with > or Note
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

export default function TheoryHandbookModal({ isOpen, onClose, personalNotes = [], onSavePersonalNote, onDeletePersonalNote }) {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubType, setActiveSubType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note creation & editing state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Task 1');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('Task 1');

  const categories = [
    { id: 'all', label: 'Tất Cả', icon: Layers },
    { id: 'general', label: 'Tiêu Chí & Điểm Số', icon: BookOpen },
    { id: 'task1', label: 'Cẩm Nang Task 1', icon: BarChart2 },
    { id: 'task2', label: 'Cẩm Nang Task 2', icon: FileText },
    { id: 'mistakes', label: 'Lỗi Sai Cần Tránh', icon: AlertTriangle },
    { id: 'personal', label: `Ghi Chú Của Bạn (${personalNotes.length})`, icon: Bookmark },
  ];

  const task1SubTypes = [
    { id: 'all', label: 'Tất cả Task 1' },
    { id: 'line', label: 'Line Graph (Đường)' },
    { id: 'bar', label: 'Bar Chart (Cột)' },
    { id: 'pie', label: 'Pie Chart (Tròn)' },
    { id: 'table', label: 'Table (Bảng)' },
    { id: 'process', label: 'Process (Quy trình)' },
    { id: 'map', label: 'Map (Bản đồ)' },
    { id: 'mixed', label: 'Mixed (Kết hợp)' },
  ];

  const task2SubTypes = [
    { id: 'all', label: 'Tất cả Task 2' },
    { id: 'opinion', label: 'Agree / Disagree' },
    { id: 'discussion', label: 'Discuss Both Views' },
    { id: 'advantages', label: 'Advantages vs Disadvantages' },
    { id: 'problem-solution', label: 'Problem & Solution' },
    { id: 'two-part', label: 'Two-Part Question' },
  ];

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveSubType('all');
  };

  const filteredHandbook = THEORY_HANDBOOK.filter(item => {
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
    setEditTag(n.tag || 'Task 1');
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Cẩm Nang Lý Thuyết & Chiến Thuật IELTS Writing</h2>
              <p className="text-xs text-slate-400">Tra cứu nhanh công thức câu Overview, quy tắc PEEL, từ nối và bí quyết Band 8.0+</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm lý thuyết (vd: line graph, overview, PEEL, opinion, map, table, bị động...)"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
              />
            </div>
            {activeCategory === 'personal' && (
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingNote ? 'Đóng Trình Tạo' : 'Tạo Ghi Chú Mới'}</span>
              </button>
            )}
          </div>

          {/* Main Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === c.id 
                      ? 'bg-red-600 text-white shadow-2xs' 
                      : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Filters for Task 1 */}
          {activeCategory === 'task1' && (
            <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
              <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Dạng biểu đồ:</span>
              {task1SubTypes.map(st => (
                <button
                  key={st.id}
                  onClick={() => setActiveSubType(st.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
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

          {/* Sub-Filters for Task 2 */}
          {activeCategory === 'task2' && (
            <div className="pt-2 flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] border-t border-slate-200/70">
              <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Dạng câu hỏi:</span>
              {task2SubTypes.map(st => (
                <button
                  key={st.id}
                  onClick={() => setActiveSubType(st.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
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
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* PERSONAL NOTES VIEW */}
          {activeCategory === 'personal' ? (
            <div className="space-y-4">
              {/* Add Note Form */}
              {isAddingNote && (
                <form onSubmit={handleAddNoteSubmit} className="p-5 rounded-2xl border-2 border-red-200 bg-red-50/40 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
                    <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-red-600" />
                      Biên soạn mẹo / ghi chú mới
                    </span>
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-red-200 font-medium text-slate-700 focus:outline-none"
                    >
                      <option value="Task 1">Dạng Task 1</option>
                      <option value="Task 2">Dạng Task 2</option>
                      <option value="Vocabulary">Từ Vựng & Collocation</option>
                      <option value="Grammar">Cấu Trúc Ngữ Pháp</option>
                      <option value="General">Mẹo Chung & Chiến Thuật</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Tiêu đề ghi chú (vd: Công thức câu Overview của thầy Simon)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white font-semibold"
                  />
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Nội dung ghi chú chi tiết... (hỗ trợ dán template, cấu trúc câu, từ vựng hoặc checklist của riêng bạn)"
                    rows={5}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white resize-none font-sans"
                  />
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-2xs"
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
                              <option value="Task 1">Task 1</option>
                              <option value="Task 2">Task 2</option>
                              <option value="Vocabulary">Vocabulary</option>
                              <option value="Grammar">Grammar</option>
                              <option value="General">General</option>
                            </select>
                            <div className="flex space-x-1.5">
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-2.5 py-1 rounded text-xs text-slate-500 hover:bg-slate-100"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => handleSaveEdit(n.id)}
                                className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
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
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 mb-1">
                                  {n.tag || 'Ghi Chú'}
                                </span>
                                <h4 className="font-bold text-sm text-slate-900 leading-snug">{n.title}</h4>
                              </div>
                              <div className="flex items-center space-x-1 shrink-0">
                                <button
                                  onClick={() => startEditNote(n)}
                                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                                  title="Chỉnh sửa ghi chú"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeletePersonalNote(n.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                  title="Xóa ghi chú này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="pt-1">
                              <MarkdownRenderer content={n.content} />
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
                  <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Chưa có ghi chú cá nhân nào</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Hãy bấm nút <strong className="text-red-600">"Tạo Ghi Chú Mới"</strong> ở góc trên để ghi lại các câu mẫu, từ vựng đắt giá hoặc mẹo học riêng của bạn! Dữ liệu được lưu an toàn trong trình duyệt.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* STANDARD HANDBOOK VIEW */
            <div className="space-y-6">
              {filteredHandbook.length > 0 ? (
                filteredHandbook.map(item => (
                  <div key={item.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                            {item.category === 'task1' ? 'IELTS Task 1' : item.category === 'task2' ? 'IELTS Task 2' : item.category === 'mistakes' ? 'Cảnh Báo Lỗi' : 'Chiến Lược & Tiêu Chí'}
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug text-red-700">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 sm:text-right max-w-sm">{item.summary}</p>
                    </div>

                    <div className="pt-1">
                      <MarkdownRenderer content={item.content} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Không tìm thấy kết quả phù hợp với từ khóa "{searchQuery}".
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
