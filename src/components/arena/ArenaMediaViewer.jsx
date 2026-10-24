/**
 * src/components/arena/ArenaMediaViewer.jsx
 * 
 * Rich Multimedia Viewer for Atlas English Arena Questions.
 * Supports:
 * - Responsive Vector SVG Charts, Maps & Process Diagrams
 * - Raster images (WebP/PNG) with lazy loading
 * - 1-Click "Zoom In" Lightbox Modal for detailed inspection
 */

import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, X, BarChart3, MapPin, Layers, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function ArenaMediaViewer({ media }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const { isEn } = useTranslation();

  // Close Lightbox on Escape key
  useEffect(() => {
    if (!isZoomed) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
        setZoomScale(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  if (!media) return null;

  const TypeIcon = {
    chart: BarChart3,
    map: MapPin,
    diagram: Layers
  }[media.type] || BarChart3;

  return (
    <div className="w-full flex flex-col gap-2 my-1">
      {/* Media Card Container */}
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/70 p-3 overflow-hidden shadow-lg group">
        {/* Caption & Type Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <TypeIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{media.caption || (isEn ? 'Illustration Diagram' : 'Hình Ảnh / Biểu Đồ Minh Họa')}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            title={isEn ? 'Zoom In' : 'Phóng to ảnh'}
          >
            <ZoomIn className="w-3 h-3" />
            <span className="hidden sm:inline">{isEn ? 'Zoom In' : 'Phóng To'}</span>
          </button>
        </div>

        {/* Content Render: SVG or IMG */}
        <div 
          onClick={() => setIsZoomed(true)}
          className="w-full flex items-center justify-center cursor-pointer transition-transform group-hover:scale-[1.01]"
        >
          {media.svg ? (
            <div 
              className="w-full max-h-48 sm:max-h-52 overflow-hidden flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: media.svg }}
            />
          ) : media.url ? (
            <img 
              src={media.url} 
              alt={media.alt || 'Arena question illustration'} 
              className="w-full max-h-48 sm:max-h-52 object-contain rounded-lg"
              loading="lazy"
            />
          ) : null}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TypeIcon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  {media.caption || (isEn ? 'Detailed View' : 'Xem Chi Tiết Hình Ảnh')}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setZoomScale(prev => Math.min(2.5, +(prev + 0.25).toFixed(2)))}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
                    title={isEn ? 'Zoom In' : 'Phóng to'}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(prev => Math.max(0.75, +(prev - 0.25).toFixed(2)))}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
                    title={isEn ? 'Zoom Out' : 'Thu nhỏ'}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(1)}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
                    title={isEn ? 'Reset Zoom' : 'Mặc định'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 px-1.5">
                    {Math.round(zoomScale * 100)}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    setZoomScale(1);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isEn ? 'Close' : 'Đóng (Esc)'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full flex items-center justify-center p-2 overflow-auto max-h-[65vh]">
              {media.svg ? (
                <div 
                  className="w-full max-h-[60vh] flex items-center justify-center transition-transform duration-200 my-4"
                  style={{ transform: `scale(${zoomScale})` }}
                  dangerouslySetInnerHTML={{ __html: media.svg }}
                />
              ) : media.url ? (
                <img 
                  src={media.url} 
                  alt={media.alt || 'Arena question illustration zoomed'} 
                  className="max-h-[60dvh] object-contain rounded-xl shadow-xl transition-transform duration-200"
                  style={{ transform: `scale(${zoomScale})` }}
                />
              ) : null}
            </div>

            <div className="text-center text-xs text-slate-400">
              {isEn ? 'Click anywhere outside or press Close to return to question' : 'Bấm ngoài vùng ảnh hoặc nút Đóng để quay lại câu hỏi'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
