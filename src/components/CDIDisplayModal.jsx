import React from 'react';
import { SlidersHorizontal, X, Type, Sun, Moon, Check, RotateCcw, Monitor } from 'lucide-react';

export const CDI_FONT_SIZES = [
  { id: 'standard', label: 'Tiêu chuẩn', scale: '100%', desc: 'Kích thước chuẩn kỳ thi IDP/BC' },
  { id: 'large', label: 'Cỡ Lớn', scale: '112%', desc: 'Tăng 12% kích thước chữ' },
  { id: 'xlarge', label: 'Rất Lớn', scale: '125%', desc: 'Tăng 25% kích thước chữ' }
];

export const CDI_CONTRAST_SCHEMES = [
  {
    id: 'standard',
    name: 'Mặc Định (Light)',
    desc: 'Chữ đen trên nền trắng tiêu chuẩn',
    bg: 'bg-white',
    text: 'text-slate-900',
    border: 'border-slate-300'
  },
  {
    id: 'dark',
    name: 'Ban Đêm (Dark)',
    desc: 'Chữ trắng trên nền tối chống mỏi mắt',
    bg: 'bg-slate-900',
    text: 'text-slate-100',
    border: 'border-slate-700'
  },
  {
    id: 'yellow-on-black',
    name: 'Vàng trên Đen (British Council)',
    desc: 'Tương phản cao chuẩn IDP / British Council',
    bg: 'bg-black',
    text: 'text-yellow-300',
    border: 'border-yellow-600'
  },
  {
    id: 'black-on-yellow',
    name: 'Đen trên Nền Kem (Soft Eye-care)',
    desc: 'Nền kem nhạt ấm áp, êm dịu cho mắt',
    bg: 'bg-amber-50',
    text: 'text-amber-950',
    border: 'border-amber-300'
  }
];

export default function CDIDisplayModal({
  isOpen,
  onClose,
  cdiFontSize = 'standard',
  onChangeFontSize,
  cdiContrast = 'standard',
  onChangeContrast,
  onReset
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92dvh] sm:max-h-[88dvh] border border-slate-200">
        
        {/* Fixed Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10 gap-2 min-w-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">Tùy Chọn Hiển Thị Chuẩn CDI</h3>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">Mô phỏng trợ năng Computer-Delivered IELTS (IDP / BC)</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Đóng (Esc)"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs overscroll-contain">
          
          {/* Section 1: Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Type className="w-4 h-4 text-blue-600" />
                <span>Cỡ chữ hiển thị bài thi (Font Size):</span>
              </label>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {CDI_FONT_SIZES.find(f => f.id === cdiFontSize)?.scale || '100%'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CDI_FONT_SIZES.map(f => (
                <button
                  key={f.id}
                  onClick={() => onChangeFontSize?.(f.id)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    cdiFontSize === f.id
                      ? 'border-blue-500 bg-blue-50/80 text-blue-900 font-black ring-2 ring-blue-500/20 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="text-sm font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{f.scale}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Color Contrast Scheme */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Monitor className="w-4 h-4 text-purple-600" />
              <span>Chế độ tương phản màn hình (Screen Contrast):</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CDI_CONTRAST_SCHEMES.map(c => {
                const isSelected = cdiContrast === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onChangeContrast?.(c.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-black text-xs shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                        Aa
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight truncate">{c.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Live Preview Box */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Xem trước văn bản với thiết lập hiện tại:
            </span>
            <div 
              data-cdi-font={cdiFontSize}
              data-cdi-contrast={cdiContrast}
              className={`p-4 rounded-xl border transition-all ${
                cdiContrast === 'yellow-on-black'
                  ? 'bg-black text-yellow-300 border-yellow-700'
                  : cdiContrast === 'black-on-yellow'
                  ? 'bg-amber-50 text-amber-950 border-amber-300'
                  : cdiContrast === 'dark'
                  ? 'bg-slate-900 text-slate-100 border-slate-700'
                  : 'bg-white text-slate-800 border-slate-200'
              }`}
            >
              <div className="font-bold text-xs mb-1">IELTS Academic Reading & Writing Preview</div>
              <p className={`cdi-scalable-text leading-relaxed text-xs ${
                cdiFontSize === 'large' ? 'text-sm' : cdiFontSize === 'xlarge' ? 'text-base' : 'text-xs'
              }`}>
                "The line graph illustrates the proportion of renewable energy consumption in four distinct countries between 1990 and 2020. Overall, substantial growth was observed..."
              </p>
            </div>
          </div>

        </div>

        {/* Fixed Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 z-10">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Khôi phục thiết lập mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Đồng Ý & Áp Dụng
          </button>
        </div>

      </div>
    </div>
  );
}
