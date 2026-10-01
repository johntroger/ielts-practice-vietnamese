import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Clipboard, Trash2, ZoomIn, X, AlertCircle, Lock, ShieldCheck } from 'lucide-react';
import ImageViewerModal from './ImageViewerModal';
import { isOwnerUser, OWNER_EMAIL, OWNER_MEDIA_RESTRICTION_MESSAGE } from '../utils/userPermissions';

/**
 * TaskImageUploader
 * Hỗ trợ upload file ảnh (PNG, JPG, WEBP, SVG) hoặc Dán ảnh từ Clipboard (Ctrl+V)
 * Tự động tối ưu dung lượng và resize nếu ảnh quá lớn để lưu trữ an toàn trong LocalStorage/Supabase
 * 
 * LƯU Ý BẢO MẬT & QUOTA:
 * Chỉ có Quản trị viên (tranthanhtung37@gmail.com) mới được phép nạp/tải ảnh đề bài.
 * Các tài khoản khác sẽ bị khóa với thông báo giới hạn dung lượng website.
 */
export default function TaskImageUploader({ 
  imageUrl, 
  onImageChange, 
  label = "Hình ảnh đề bài Task 1 (Biểu đồ / Bản đồ / Quy trình):",
  user = null
}) {
  const isOwner = isOwnerUser(user);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Xử lý nén ảnh Base64 để tránh đầy dung lượng LocalStorage/Database
  const processAndSetImage = (file) => {
    if (!isOwner) {
      alert(OWNER_MEDIA_RESTRICTION_MESSAGE);
      return;
    }

    if (!file || !file.type || !file.type.startsWith('image/')) {
      alert('Vui lòng chọn hoặc dán tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Tối ưu kích thước tối đa 1400px chiều rộng/cao để giữ nét mà nhẹ dung lượng
        const maxDimension = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Nén chất lượng 0.85
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        onImageChange(optimizedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Bắt sự kiện Paste (Ctrl+V) khi người dùng đang tương tác với vùng upload
  useEffect(() => {
    if (!isOwner) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processAndSetImage(blob);
            break;
          }
        }
      }
    };

    const dropEl = dropAreaRef.current;
    if (dropEl) {
      dropEl.addEventListener('paste', handlePaste);
      return () => dropEl.removeEventListener('paste', handlePaste);
    }
  }, [isOwner]);

  const handleFileChange = (e) => {
    if (!isOwner) {
      alert(OWNER_MEDIA_RESTRICTION_MESSAGE);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovered(false);
    if (!isOwner) {
      alert(OWNER_MEDIA_RESTRICTION_MESSAGE);
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isOwner) {
      setIsHovered(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovered(false);
  };

  return (
    <div className="space-y-1.5" ref={dropAreaRef} tabIndex={0}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>{label}</span>
          {isOwner && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Owner ({OWNER_EMAIL})</span>
            </span>
          )}
        </label>
        {isOwner ? (
          <span className="text-[10px] text-slate-400 font-medium">
            Kéo thả, chọn file, hoặc bấm <strong>Ctrl + V</strong> để dán ảnh
          </span>
        ) : (
          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-600" />
            <span>Giới hạn dung lượng: Dành riêng Owner</span>
          </span>
        )}
      </div>

      {!isOwner && !imageUrl ? (
        /* Quota Restriction Notice for Non-Owners */
        <div className="rounded-xl border border-amber-200 bg-amber-50/85 p-3.5 sm:p-4 text-slate-800 space-y-2">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                <span className="text-xs font-bold text-amber-950">
                  Tính năng nạp hình ảnh/âm thanh đề bài chỉ dành riêng cho Quản trị viên
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/90 text-amber-900 font-extrabold font-mono">
                  {OWNER_EMAIL}
                </span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Do dung lượng website giới hạn nên không hỗ trợ tính năng này khi user sử dụng. Bạn vẫn có thể nạp nội dung đề bài dạng văn bản (prompt) để luyện tập bình thường.
              </p>
            </div>
          </div>
          
          <div className="text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-lg border border-amber-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>💡</span>
              <span>Gợi ý: Hãy nhập chi tiết mô tả biểu đồ hoặc số liệu vào ô <strong>Đề bài (Prompt)</strong> bên dưới.</span>
            </span>
            {user?.email && (
              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                Tài khoản: {user.email}
              </span>
            )}
          </div>
        </div>
      ) : imageUrl ? (
        <div className="relative rounded-xl border border-blue-200 bg-slate-900/5 p-2 group overflow-hidden">
          <div className="relative max-h-64 sm:max-h-72 flex items-center justify-center overflow-hidden rounded-lg bg-white border border-slate-200">
            <img 
              src={imageUrl} 
              alt="Task 1 Visual Chart" 
              className="max-h-64 sm:max-h-72 w-auto object-contain cursor-pointer"
              onClick={() => setIsZoomModalOpen(true)}
            />

            {/* Quick Action Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-800 text-xs font-bold flex items-center space-x-1 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Phóng To</span>
              </button>

              {isOwner && (
                <button
                  type="button"
                  onClick={() => onImageChange('')}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Ảnh</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              ✓ Đã có ảnh đề bài Task 1
            </span>
            {isOwner && (
              <button
                type="button"
                onClick={() => onImageChange('')}
                className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
              >
                Thay ảnh khác
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isHovered
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-white'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
          />

          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
            <Upload className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-700">
              <span className="text-blue-600 hover:underline">Tải tệp ảnh lên</span> hoặc kéo thả vào đây
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Clipboard className="w-3 h-3 text-slate-500" />
              <span>Chụp màn hình (Win+Shift+S) rồi bấm <strong>Ctrl+V</strong> để dán trực tiếp</span>
            </div>
          </div>
        </div>
      )}

      {/* Media Policy Notice */}
      <div className="text-[10px] text-slate-400 flex items-center space-x-1 pt-0.5">
        <span className="text-emerald-600 font-bold">🔒 Tiết kiệm dung lượng:</span>
        <span>Hình ảnh đề bài được kiểm soát dung lượng nghiêm ngặt để đảm bảo tốc độ tải trang cao nhất cho toàn bộ học viên.</span>
      </div>

      {/* Modal Zoom Preview with Zoom + / Zoom - and Pan */}
      <ImageViewerModal
        isOpen={isZoomModalOpen && !!imageUrl}
        onClose={() => setIsZoomModalOpen(false)}
        imageUrl={imageUrl}
        title="Xem chi tiết ảnh đề bài Task 1"
      />
    </div>
  );
}
