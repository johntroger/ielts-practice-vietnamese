import React from 'react';
import { ArrowRight, MapPin, Layers, GitCommit, Compass, Sparkles } from 'lucide-react';

export default function ProcessMapRenderer({ task }) {
  if (!task) return null;

  const isProcess = task.type === 'process' || !!task.processSteps;
  const isMap = task.type === 'map' || !!task.mapChanges;

  if (isProcess && task.processSteps) {
    return (
      <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Sơ Đồ Quy Trình Tuần Tự (Process Flowchart)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            {task.processSteps.length} giai đoạn liên hoàn
          </span>
        </div>

        {/* Sequential Steps Cards */}
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

        {/* Quick Process Linking Words Helper */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-2">
          <strong className="text-slate-700">Từ nối thứ tự quy trình:</strong>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Initially</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Following this</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Subsequently</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">Prior to being...</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">The culmination involves</span>
        </div>
      </div>
    );
  }

  if (isMap && task.mapChanges) {
    return (
      <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Đối Chiếu Bản Đồ Biến Đổi Đô Thị (Map Transformations)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            {task.mapChanges.length} khu vực quy hoạch chính
          </span>
        </div>

        {/* Map Differences Comparison Grid */}
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

        {/* Quick Map Directions & Verbs Helper */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-2">
          <strong className="text-slate-700">Động từ miêu tả bản đồ:</strong>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">demolished to make way for</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">converted into</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">erected / constructed</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">expanded southward</span>
        </div>
      </div>
    );
  }

  return null;
}
