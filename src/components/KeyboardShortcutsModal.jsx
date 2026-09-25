import React from 'react';
import { 
  X, 
  Keyboard, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Send, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  PenTool, 
  CheckCircle2,
  Command
} from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modifierKey = isMac ? '⌘ Cmd' : 'Ctrl';

  const shortcutGroups = [
    {
      title: '🎯 Điều Hướng & Trải Nghiệm Tập Trung',
      shortcuts: [
        {
          keys: ['Alt', 'F'],
          desc: 'Bật / Tắt Chế độ Tập Trung (Focus Mode)',
          badge: 'Khuyên dùng'
        },
        {
          keys: ['Alt', 'K'],
          desc: 'Mở nhanh Kho Đề / Thư viện đề thi',
        },
        {
          keys: ['Alt', 'M'],
          desc: 'Đánh dấu hoặc Bỏ đánh dấu "Đã thuộc" đề hiện tại',
        },
        {
          keys: ['Alt', 'T'],
          desc: 'Mở Cẩm Nang Lý Thuyết & Chiến Thuật',
        },
        {
          keys: ['?'],
          desc: 'Mở bảng tra cứu Phím Tắt Nhanh (Shortcut Guide)',
        },
        {
          keys: ['Esc'],
          desc: 'Thoát Chế độ Tập Trung / Đóng các cửa sổ Modal',
        }
      ]
    },
    {
      title: '✍️ Kỹ Năng IELTS Writing',
      shortcuts: [
        {
          keys: [modifierKey, 'Enter'],
          desc: 'Nộp bài & Yêu cầu Giám khảo AI Chấm Điểm 4 tiêu chí',
          badge: 'Tức thì'
        },
        {
          keys: ['Alt', 'P'],
          desc: 'Mở công cụ Tra Cứu Từ Đồng Nghĩa (Quick Paraphrase)',
        },
        {
          keys: ['Alt', 'I'],
          desc: 'Mở Ma Trận Phát Triển Ý Tưởng (Idea Matrix)',
        },
        {
          keys: ['Tab'],
          desc: 'Chuyển đổi giữa Soạn thảo bài viết và Dàn ý PEEL',
        }
      ]
    },
    {
      title: '📖 & 🎧 Reading / Listening (CDI Simulation)',
      shortcuts: [
        {
          keys: ['Alt', 'H'],
          desc: 'Bật / Tắt chế độ Tô Màu (Highlight) đoạn văn bản',
        },
        {
          keys: ['Alt', 'N'],
          desc: 'Thêm Ghi Chú (Notes) cho từ vựng hoặc đoạn đọc',
        },
        {
          keys: ['Space'],
          desc: 'Tạm dừng / Tiếp tục phát Audio Listening',
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white min-w-0 gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Keyboard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h3 className="font-extrabold text-sm sm:text-lg text-white truncate">
                  Phím Tắt Nhanh (Shortcuts)
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30 shrink-0">
                  CDI Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate hidden sm:block">
                Thao tác thần tốc không cần rời tay khỏi bàn phím, chuẩn công thái học thi máy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Đóng (Esc)"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                <span>{group.title}</span>
              </h4>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                {group.shortcuts.map((item, sIdx) => (
                  <div 
                    key={sIdx}
                    className="p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {item.desc}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-indigo-100 text-indigo-700">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {item.keys.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300/90 text-slate-800 font-mono text-[11px] sm:text-xs font-extrabold shadow-2xs">
                            {k}
                          </kbd>
                          {kIdx < item.keys.length - 1 && (
                            <span className="text-slate-400 text-xs font-bold">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Nhấn phím bất kỳ hoặc bấm nút bên dưới để đóng bảng phím tắt.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Đã Hiểu
          </button>
        </div>

      </div>
    </div>
  );
}
