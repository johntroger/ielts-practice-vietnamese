import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Search, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  Award, 
  Cloud, 
  BookOpen, 
  Puzzle, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Compass,
  Zap,
  Tag
} from 'lucide-react';
import { APP_FEATURES } from '../data/appFeatures';

const ICON_MAP = {
  Users: Users,
  Smartphone: Smartphone,
  ShieldCheck: ShieldCheck,
  Award: Award,
  Cloud: Cloud,
  BookOpen: BookOpen,
  Puzzle: Puzzle,
  Clock: Clock
};

export default function FeaturesGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFeatureId, setActiveFeatureId] = useState(APP_FEATURES[0].id);

  const categories = [
    { id: 'all', label: 'Tất Cả Tính Năng' },
    { id: 'community', label: 'Cộng Đồng & Đề Thi' },
    { id: 'ai', label: 'AI & Chấm Điểm' },
    { id: 'ux', label: 'Giao Diện & Mobile' },
    { id: 'practice', label: 'Luyện Tập & Lý Thuyết' }
  ];

  const filteredFeatures = APP_FEATURES.filter(f => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'community' && f.category === 'community') ||
      (selectedCategory === 'ai' && (f.category === 'ai' || f.category === 'evaluation')) ||
      (selectedCategory === 'ux' && (f.category === 'ux' || f.category === 'cloud')) ||
      (selectedCategory === 'practice' && (f.category === 'theory' || f.category === 'practice' || f.category === 'exam'));

    const matchesSearch = !searchQuery || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const activeFeature = APP_FEATURES.find(f => f.id === activeFeatureId) || filteredFeatures[0] || APP_FEATURES[0];
  const ActiveIcon = ICON_MAP[activeFeature.icon] || Sparkles;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">Khám Phá Tính Năng & Hướng Dẫn</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                  Tự Động Cập Nhật
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cẩm nang toàn diện giúp bạn khai thác tối đa sức mạnh của IELTS Writing Master Studio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tính năng (vd: chấm điểm, chia sẻ, mobile, API key)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
              />
            </div>

            {/* Total Features Count */}
            <div className="text-xs text-slate-500 font-semibold px-2 shrink-0 self-center">
              Hiện có <strong className="text-red-600 font-bold">{APP_FEATURES.length}</strong> tính năng nổi bật
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Split Master-Detail */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Left Column: Features List */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto p-3 sm:p-4 space-y-2 bg-slate-50/50 max-h-[35vh] md:max-h-full">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map(feat => {
                const IconComp = ICON_MAP[feat.icon] || Sparkles;
                const isSelected = activeFeature.id === feat.id;
                return (
                  <div
                    key={feat.id}
                    onClick={() => setActiveFeatureId(feat.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 text-left ${
                      isSelected
                        ? 'bg-white border-red-500 shadow-md ring-2 ring-red-500/10'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isSelected ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          {feat.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {feat.version}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold truncate ${
                        isSelected ? 'text-red-900' : 'text-slate-800'
                      }`}>
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {feat.shortDesc}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 self-center shrink-0 transition-transform ${
                      isSelected ? 'text-red-600 translate-x-0.5' : 'text-slate-300'
                    }`} />
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Không tìm thấy tính năng nào phù hợp với từ khóa.
              </div>
            )}
          </div>

          {/* Right Column: Detailed View */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-white">
            {activeFeature && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Feature Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shrink-0">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold uppercase">
                          {activeFeature.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Phiên bản {activeFeature.version}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                        {activeFeature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {activeFeature.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Các Điểm Nổi Bật Chính:</span>
                  </h4>
                  <div className="space-y-2">
                    {activeFeature.highlights.map((h, i) => (
                      <div key={i} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to use */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                    <span>💡</span>
                    <span>Cách Sử Dụng Nhanh:</span>
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed pl-5">
                    {activeFeature.usageGuide}
                  </p>
                </div>

                {/* Quick Start Tip */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold">Bạn đã sẵn sàng trải nghiệm?</div>
                    <div className="text-[11px] text-slate-400">
                      Đóng hướng dẫn này và bắt đầu luyện tập một đề IELTS ngay hôm nay!
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                  >
                    Bắt Đầu Học Ngay
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
