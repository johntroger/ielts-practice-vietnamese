import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  X, 
  MessageSquareHeart, 
  Sparkles, 
  ExternalLink,
  HelpCircle,
  Bug,
  Lightbulb,
  Handshake
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const contactEmail = 'info.vneconomics@gmail.com';
  const contactPerson = 'Mr. Tung Tran';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const categoryLabels = {
      feedback: '[Góp ý]',
      bug: '[Báo lỗi]',
      feature: '[Đề xuất tính năng]',
      partnership: '[Hợp tác học thuật]',
      other: '[Liên hệ]'
    };

    const prefix = categoryLabels[category] || '[Liên hệ]';
    const emailSubject = encodeURIComponent(`${prefix} ${subject.trim() || 'IELTS Writing Master Studio'}`);
    const emailBody = encodeURIComponent(
      `Chào ${contactPerson},\n\n` +
      `Tôi gửi liên hệ từ nền tảng IELTS Writing Master Studio:\n\n` +
      `[Nội dung]:\n${message}\n\n` +
      `---\n` +
      `Gửi từ: IELTS Writing Practice Web`
    );

    window.location.href = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs shadow-inner">
                <MessageSquareHeart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white">Liên Hệ & Đóng Góp Ý Kiến</h3>
                <p className="text-xs text-red-100 font-medium mt-0.5">Chúng tôi luôn trân trọng mọi góp ý để hoàn thiện sản phẩm</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Contact Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-red-50/40 border border-slate-200/80 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Người Phụ Trách & Tiếp Nhận</div>
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>{contactPerson}</span>
                  <span className="text-[11px] font-medium text-red-600 bg-red-100/70 px-2 py-0.5 rounded-full">Lead Developer</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                  <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="font-semibold text-slate-800 select-all">{contactEmail}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title="Sao chép địa chỉ email"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Contact / Feedback Form */}
          <form onSubmit={handleSendEmail} className="space-y-3.5">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gửi thư góp ý hoặc phản hồi nhanh</span>
            </div>

            {/* Category pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'feedback', label: 'Góp ý chung', icon: MessageSquareHeart },
                { id: 'feature', label: 'Đề xuất tính năng', icon: Lightbulb },
                { id: 'bug', label: 'Báo lỗi hệ thống', icon: Bug },
                { id: 'partnership', label: 'Hợp tác / Hỏi đáp', icon: Handshake },
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                      isSelected 
                        ? 'bg-red-50 border-red-300 text-red-700 shadow-2xs' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Subject input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tiêu đề thư
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="VD: Ý tưởng thêm kho tài liệu IELTS Task 1..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
              />
            </div>

            {/* Message textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nội dung chi tiết
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập ý kiến đóng góp, mô tả lỗi gặp phải hoặc thắc mắc của bạn tại đây..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`mailto:${contactEmail}`}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                title="Mở ứng dụng email mặc định"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở email client</span>
              </a>

              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Thư Đến Mr. Tung Tran</span>
              </button>
            </div>
          </form>

          {/* Additional note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2 text-[11px] text-slate-500">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Mọi tin nhắn và phản hồi thường được Mr. Tung Tran phản hồi trong vòng 24 giờ. Cảm ơn bạn đã đồng hành và xây dựng cộng đồng học IELTS Writing chất lượng cao!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
