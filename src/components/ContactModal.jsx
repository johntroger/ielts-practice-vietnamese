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
  Handshake,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('feedback');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Trạng thái gửi
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

  if (!isOpen) return null;

  const contactEmail = 'info.vneconomics@gmail.com';
  const contactPerson = 'Mr. Tung Tran';
  const WEB3FORMS_ACCESS_KEY = '4d259276-713e-43c0-aef6-d19e1ec2a714';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendViaWeb3Forms = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setSendError('Vui lòng nhập nội dung chi tiết.');
      return;
    }

    setIsSending(true);
    setSendError('');

    const categoryLabels = {
      feedback: 'Góp ý chung',
      bug: 'Báo lỗi hệ thống',
      feature: 'Đề xuất tính năng mới',
      partnership: 'Hợp tác học thuật / Hỏi đáp',
      other: 'Liên hệ chung'
    };

    const catLabel = categoryLabels[category] || 'Góp ý';
    const finalSubject = `[IELTS Web] [${catLabel}] ${subject.trim() || 'Thư gửi từ người dùng'}`;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: senderName.trim() || 'Người dùng IELTS Studio',
          email: senderEmail.trim() || 'no-reply@ielts-studio.com',
          subject: finalSubject,
          category: catLabel,
          message: message.trim(),
          from_name: 'IELTS Practice Vietnamese Studio'
        })
      });

      const result = await response.json();

      if (result.success) {
        setSendSuccess(true);
        setMessage('');
        setSubject('');
        setTimeout(() => {
          setSendSuccess(false);
          onClose();
        }, 3000);
      } else {
        setSendError(result.message || 'Gửi thất bại. Bạn có thể dùng nút mở Email client bên dưới.');
      }
    } catch (err) {
      console.error('Error sending feedback:', err);
      setSendError('Không thể kết nối đến máy chủ thư. Bạn vui lòng thử lại hoặc dùng nút Mở email client bên dưới.');
    } finally {
      setIsSending(false);
    }
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
                <p className="text-xs text-red-100 font-medium mt-0.5">Chúng tôi luôn lắng nghe để hoàn thiện trải nghiệm học IELTS của bạn</p>
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

          {/* Success Banner */}
          {sendSuccess ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Gửi Ý Kiến Phản Hồi Thành Công!</h4>
              <p className="text-xs text-emerald-700">
                Thư của bạn đã được chuyển thẳng tới hộp thư của <b>Mr. Tung Tran</b> ({contactEmail}). Chúng tôi sẽ phản hồi lại bạn sớm nhất có thể.
              </p>
            </div>
          ) : (
            /* Quick Contact Form */
            <form onSubmit={handleSendViaWeb3Forms} className="space-y-3.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gửi thư trực tiếp ngay trên Web</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Tự động chuyển tiếp Gmail
                </span>
              </div>

              {/* Category pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'feedback', label: 'Góp ý chung', icon: MessageSquareHeart },
                  { id: 'feature', label: 'Tính năng mới', icon: Lightbulb },
                  { id: 'bug', label: 'Báo lỗi web', icon: Bug },
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

              {/* User Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tên của bạn <span className="text-slate-400 font-normal">(tuỳ chọn)</span>
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email của bạn <span className="text-slate-400 font-normal">(để nhận phản hồi)</span>
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="VD: emailcuaban@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>
              </div>

              {/* Subject input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="VD: Góp ý thêm bài đọc Task 1 band 8.0..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                />
              </div>

              {/* Message textarea */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập ý kiến đóng góp, mô tả lỗi hoặc nội dung bạn cần hỗ trợ..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white resize-none"
                />
              </div>

              {/* Error message */}
              {sendError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                  title="Mở ứng dụng email mặc định trên máy của bạn"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở app Email</span>
                </a>

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Gửi Thư...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Đến Mr. Tung Tran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2 text-[11px] text-slate-500">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Thư góp ý sẽ được chuyển thẳng đến hộp thư cá nhân của Mr. Tung Tran. Hệ thống cam kết bảo mật thông tin và phản hồi trong 24 giờ.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
