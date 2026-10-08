import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Smartphone, 
  Share2,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { useTranslation } from '../i18n';

export const WEBSITE_URL = 'https://ielts-practice-vietnamese.vercel.app/';

export default function WebsiteQRCodeModal({ isOpen, onClose }) {
  const { t, isEn } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Generate high-resolution QR Code
    QRCode.toDataURL(
      WEBSITE_URL,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a', // Slate 900
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );

    // Also draw to canvas if available
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        WEBSITE_URL,
        {
          width: 260,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(WEBSITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = WEBSITE_URL;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'ielts-practice-vietnamese-qr.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 text-slate-800 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon - Sticky at top */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-4 sm:p-5 text-white relative shrink-0 sticky top-0 z-10 shadow-xs">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-xs border border-white/30">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {isEn ? 'Quick Access QR Code' : 'Mã QR Truy Cập Nhanh'}
              </span>
              <h3 className="text-lg font-black tracking-tight leading-tight">
                IELTS Studio Academic AI
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-4 sm:p-6 text-center space-y-4 overflow-y-auto flex-1 overscroll-contain">
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isEn 
              ? 'Scan this QR code with your phone Camera or browser to open the app instantly without typing the domain.'
              : 'Quét mã QR bằng ứng dụng Camera, Zalo hoặc trình duyệt trên điện thoại để mở ngay website mà không cần gõ tên miền.'}
          </p>

          {/* QR Code Container */}
          <div className="relative inline-block p-4 rounded-3xl bg-slate-50 border-2 border-dashed border-red-200 shadow-inner group">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="IELTS Practice QR Code" 
                className="w-56 h-56 sm:w-60 sm:h-60 mx-auto rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-102"
              />
            ) : (
              <div className="w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}

            {/* Central Badge Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-lg border-2 border-white flex items-center justify-center text-white font-black text-[11px] tracking-wider">
                IELTS
              </div>
            </div>
          </div>

          {/* URL Pill Display */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <span className="font-mono text-slate-600 truncate text-[11px] select-all font-semibold">
              {WEBSITE_URL}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{isEn ? 'Copied!' : 'Đã chép!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isEn ? 'Copy' : 'Sao chép'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Guidance Box */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-start space-x-2.5">
              <Smartphone className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isEn ? 'Mobile / Tablet' : 'Điện thoại / Tablet'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isEn ? 'Open Camera or browser to scan and launch' : 'Bật Camera hoặc Zalo hướng vào mã để mở ngay'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 flex items-start space-x-2.5">
              <Share2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isEn ? 'Share with Others' : 'Chia sẻ học tập'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isEn ? 'Save QR code or send link to students & peers' : 'Lưu ảnh mã QR hoặc gửi link cho bạn bè, học sinh'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Download QR Code' : 'Tải Ảnh Mã QR'}</span>
            </button>

            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isEn ? 'Open New Tab' : 'Mở Tab Mới'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
