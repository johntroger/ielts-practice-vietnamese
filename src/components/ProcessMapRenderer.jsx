import React, { useState } from 'react';
import { ArrowRight, MapPin, Layers, GitCommit, Compass, Sparkles, ZoomIn, X, Image as ImageIcon, ListOrdered } from 'lucide-react';
import { ensureTaskIllustration } from '../services/processMapSvgEngine.js';

export default function ProcessMapRenderer({ task }) {
  if (!task) return null;

  const isProcess = task.type === 'process' || !!task.processSteps;
  const isMap = task.type === 'map' || !!task.mapChanges;

  if (!isProcess && !isMap) return null;

  const effectiveTask = ensureTaskIllustration(task);
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'breakdown'
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-0">
      
      {/* Header with Switcher Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl text-white shadow-xs ${isProcess ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            {isProcess ? <GitCommit className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>{isProcess ? 'Sơ Đồ Quy Trình Tuần Tự (Process Flowchart)' : 'Đối Chiếu Bản Đồ Quy Hoạch (Map Transformations)'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold lowercase">cambridge</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {isProcess ? `${task.processSteps?.length || 4} giai đoạn liên hoàn` : `${task.mapChanges?.length || 4} khu vực biến đổi quy hoạch`}
            </p>
          </div>
        </div>

        {/* View Switcher: Diagram Image vs Step Cards */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'diagram'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Hình Ảnh Minh Họa</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chi Tiết Từng Bước</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* TAB 1: Visual Diagram Image */}
        {activeTab === 'diagram' && effectiveTask.imageUrl && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Bản vẽ vector tiêu chuẩn Cambridge (Bấm để phóng to full màn hình):</span>
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Phóng to</span>
              </button>
            </div>

            <div 
              onClick={() => setIsZoomed(true)}
              className="w-full bg-slate-50 rounded-xl border border-slate-200 p-2 sm:p-4 flex items-center justify-center cursor-zoom-in hover:border-blue-400 transition-all group relative overflow-hidden"
            >
              <img 
                src={effectiveTask.imageUrl} 
                alt={task.title || (isProcess ? 'Process Diagram' : 'Map Comparison')} 
                className="w-full max-h-[380px] sm:max-h-[440px] object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center space-x-1 shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" />
                <span>Nhấp để phóng to</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Breakdown Cards (Process Steps or Map Differences) */}
        {(activeTab === 'breakdown' || !effectiveTask.imageUrl) && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {isProcess && task.processSteps && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {task.processSteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 relative space-y-1 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                        {step.step || idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 uppercase">
                        {idx === 0 ? 'Bắt đầu' : idx === task.processSteps.length - 1 ? 'Thành phẩm' : 'Giai đoạn giữa'}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 pt-1">{step.name}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {isMap && task.mapChanges && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {task.mapChanges.map((change, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{change.feature}</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-950">
                        <strong>Thời kỳ trước: </strong> {change.past}
                      </div>
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-950">
                        <strong>Sau quy hoạch: </strong> {change.present}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Language Helpers */}
        {isProcess && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-2">
            <strong className="text-slate-800 font-bold">Từ nối thứ tự quy trình:</strong>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Initially</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Following this</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Subsequently</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Prior to being...</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">The culmination involves</span>
          </div>
        )}

        {isMap && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-2">
            <strong className="text-slate-800 font-bold">Động từ miêu tả bản đồ:</strong>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">demolished to make way for</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">converted into</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">erected / constructed</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">expanded southward</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">pedestrianized</span>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && effectiveTask.imageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span className="text-xs sm:text-sm font-bold truncate max-w-md sm:max-w-xl">
                  {task.title || (isProcess ? 'Sơ đồ quy trình' : 'Bản đồ đối chiếu')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-auto flex items-center justify-center bg-slate-100/70">
              <img
                src={effectiveTask.imageUrl}
                alt={task.title}
                className="max-h-[80vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
