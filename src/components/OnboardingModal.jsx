import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  ExternalLink, 
  BookOpen, 
  PenTool, 
  Headphones, 
  Mic, 
  ShieldCheck, 
  Award,
  Zap
} from 'lucide-react';
import { testApiKey } from '../services/geminiService';

const TARGET_BANDS = [
  {
    band: '5.5',
    title: 'Modest / Foundation',
    desc: 'Củng cố ngữ pháp căn bản, tránh bẫy từ vựng, diễn đạt câu đơn - ghép rõ ràng.',
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-200',
    bg: 'bg-blue-50/60',
    badge: 'Mục tiêu: Du học nghề / Tốt nghiệp ĐH'
  },
  {
    band: '6.0',
    title: 'Competent User',
    desc: 'Phát triển câu phức, làm chủ cấu trúc Task 1 & 2, giảm thiểu lỗi chính tả và dấu câu.',
    color: 'from-teal-500 to-emerald-500',
    border: 'border-teal-200',
    bg: 'bg-teal-50/60',
    badge: 'Mục tiêu: Đại học quốc tế / Xét tuyển'
  },
  {
    band: '6.5',
    title: 'Good User (Phổ Biến Nhất)',
    desc: 'Lập luận mạch lạc (CC), từ vựng học thuật theo chủ đề (LR), đa dạng ngữ pháp (GRA).',
    color: 'from-amber-500 to-orange-500',
    border: 'border-amber-300',
    bg: 'bg-amber-50/80',
    badge: 'Khuyên Dùng • Phù hợp 80% thí sinh',
    popular: true
  },
  {
    band: '7.0',
    title: 'Advanced / Professional',
    desc: 'Kiểm soát tốt sắc thái nghĩa, collocations tự nhiên, phản xạ nói và làm bài đọc chuẩn Cambridge.',
    color: 'from-rose-500 to-red-500',
    border: 'border-rose-200',
    bg: 'bg-rose-50/60',
    badge: 'Mục tiêu: Học bổng / Định cư / Master'
  },
  {
    band: '7.5+',
    title: 'Mastery / Native-like',
    desc: 'Văn phong học thuật sắc sảo, tự nhiên, làm chủ các dạng đề khó và bẫy đề thi thực tế.',
    color: 'from-purple-500 to-indigo-600',
    border: 'border-purple-200',
    bg: 'bg-purple-50/60',
    badge: 'Mục tiêu: Giảng dạy IELTS / Tiến sĩ'
  }
];

export default function OnboardingModal({
  isOpen,
  onClose,
  initialTargetBand = '6.5',
  currentApiKey = '',
  onSaveConfig
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [selectedBand, setSelectedBand] = useState(initialTargetBand);
  const [inputKey, setInputKey] = useState(currentApiKey || '');
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState(currentApiKey ? 'success' : null); // null | 'testing' | 'success' | 'error'
  const [keyErrorMsg, setKeyErrorMsg] = useState('');

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setKeyStatus('error');
      setKeyErrorMsg('Vui lòng nhập API Key trước khi kiểm tra');
      return;
    }
    setIsVerifyingKey(true);
    setKeyStatus('testing');
    try {
      const res = await testApiKey(inputKey.trim());
      if (res.success) {
        setKeyStatus('success');
        setKeyErrorMsg('');
      } else {
        setKeyStatus('error');
        setKeyErrorMsg(res.message || 'Key không hợp lệ hoặc đã hết hạn ngạch.');
      }
    } catch (err) {
      setKeyStatus('error');
      setKeyErrorMsg(err.message || 'Lỗi kết nối kiểm tra Key.');
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleComplete = () => {
    onSaveConfig?.({
      targetBand: selectedBand,
      apiKey: inputKey.trim()
    });
    localStorage.setItem('ielts_target_band', selectedBand);
    if (inputKey.trim()) {
      localStorage.setItem('ielts_gemini_api_key', inputKey.trim());
    }
    localStorage.setItem('ielts_user_onboarded', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Progress Steps */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Đóng tour hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Chào mừng bạn đến với IELTS Academic Studio</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {step === 1 && '1. Khám Phá 4 Phòng Luyện Thi Chuẩn Cambridge'}
            {step === 2 && '2. Thiết Lập Trí Tuệ Nhân Tạo (Gemini AI)'}
            {step === 3 && '3. Thiết Lập Mục Tiêu Điểm Số (Target Band)'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            {step === 1 && 'Hệ sinh thái luyện thi toàn diện Writing, Reading, Listening & Speaking tích hợp AI.'}
            {step === 2 && 'Kết nối API Key cá nhân hoàn toàn miễn phí từ Google để chấm điểm 4 tiêu chí chuẩn xác.'}
            {step === 3 && 'AI sẽ tự động điều chỉnh độ khó bài tập, tiêu chí sửa bài và radar bẫy lỗi theo band này.'}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                onClick={() => setStep(s)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-red-500'
                    : s < step
                    ? 'w-4 bg-emerald-400'
                    : 'w-4 bg-slate-600'
                }`}
                title={`Chuyển tới Bước ${s}`}
              />
            ))}
            <span className="text-[11px] font-bold text-slate-400 ml-2">
              Bước {step} / 3
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* STEP 1: 4 STUDIOS SHOWCASE */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Writing */}
                <div className="p-4 rounded-2xl border border-red-100 bg-red-50/40 hover:bg-red-50/70 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5 text-red-700 font-black text-sm mb-1.5">
                      <div className="p-2 rounded-xl bg-red-100 text-red-600">
                        <PenTool className="w-4 h-4" />
                      </div>
                      <span>IELTS Writing Studio</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Luyện Task 1 & Task 2 với chế độ thi thật 60 phút, chấm điểm tức thì theo 4 tiêu chí Cambridge (TR/TA, CC, LR, GRA) kèm bài sửa chi tiết.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-[10px] font-bold text-red-600 space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Timer thi thật • Radar điểm • Sổ tay lỗi sai</span>
                  </div>
                </div>

                {/* Reading */}
                <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50/70 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5 text-blue-700 font-black text-sm mb-1.5">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span>IELTS Reading Studio</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      3 Passages chuẩn Cambridge, chia đôi màn hình làm bài mượt mà, tra từ vựng 1-click và phân tích vị trí bằng chứng (Evidence locator).
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-[10px] font-bold text-blue-600 space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tra từ 1 chạm • Giải thích đáp án • Gạch chân</span>
                  </div>
                </div>

                {/* Listening */}
                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5 text-emerald-700 font-black text-sm mb-1.5">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <span>IELTS Listening Studio</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Audio tương tác mô phỏng 4 Sections, tính năng Dictation nghe chép chính tả, luyện bẫy nhiễu số & tên riêng, đồng bộ Transcript.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-[10px] font-bold text-emerald-600 space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dictation chép chính tả • Luyện bẫy số • Audio</span>
                  </div>
                </div>

                {/* Speaking */}
                <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 hover:bg-purple-100/70 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5 text-purple-700 font-black text-sm mb-1.5">
                      <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                        <Mic className="w-4 h-4" />
                      </div>
                      <span>IELTS Speaking Studio</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Luyện nói với Giám khảo AI (British & American Accent), chuẩn bị Part 2 theo kim đồng hồ 1 phút, nhận feedback phát âm & độ trôi chảy.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-[10px] font-bold text-purple-600 space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hỏi đáp trực tiếp • Ghi âm • Chấm phát âm</span>
                  </div>
                </div>

              </div>

              {/* Bonus feature note */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Đặc quyền:</strong> Hệ thống bổ trợ gồm <em>Cẩm nang chiến thuật 4 kỹ năng (Band 5.0 - 7.5)</em>, Micro-Drills, Sổ tay từ vựng C1-C2 và Chẩn đoán lỗi sai thông minh.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: GEMINI API SETUP */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Google Gemini API Key
                    </span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <span>Lấy Key miễn phí tại Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setKeyStatus(null);
                      setKeyErrorMsg('');
                    }}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    * Key được lưu trữ hoàn toàn bảo mật trên trình duyệt cá nhân (localStorage) của bạn, không gửi về bất kỳ máy chủ trung gian nào.
                  </p>
                </div>

                {/* Test Key Button & State */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={isVerifyingKey || !inputKey.trim()}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      keyStatus === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-50'
                    }`}
                  >
                    {isVerifyingKey ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang kiểm tra kết nối...</span>
                      </>
                    ) : keyStatus === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Kết Nối Thành Công!</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Kiểm Tra Key</span>
                      </>
                    )}
                  </button>

                  {keyStatus === 'success' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                      <span>✓ API sẵn sàng hoạt động</span>
                    </span>
                  )}
                </div>

                {keyStatus === 'error' && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {keyErrorMsg}
                  </div>
                )}
              </div>

              {/* 3 Quick Steps to get API Key */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Cách lấy API Key trong 30 giây (100% Free):</span>
                </div>
                <ol className="text-xs text-amber-800 space-y-1 pl-4 list-decimal leading-relaxed">
                  <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-bold underline">Google AI Studio</a> và đăng nhập bằng tài khoản Gmail bất kỳ.</li>
                  <li>Bấm nút <strong>Create API Key</strong> màu xanh ở góc trên.</li>
                  <li>Sao chép mã Key bắt đầu bằng <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">AIzaSy...</code> và dán vào ô bên trên.</li>
                </ol>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE TARGET BAND */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-medium">
                Chọn mục tiêu điểm số của bạn. Bạn có thể thay đổi mục tiêu này bất kỳ lúc nào trên thanh điều hướng:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {TARGET_BANDS.map((item) => {
                  const isSelected = selectedBand === item.band;
                  return (
                    <div
                      key={item.band}
                      onClick={() => setSelectedBand(item.band)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? `${item.border} ${item.bg} shadow-md scale-[1.01]`
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white font-black text-base flex items-center justify-center shadow-sm shrink-0`}>
                          {item.band}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-900">{item.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate sm:whitespace-normal mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between shrink-0">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Bỏ qua lúc này
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-extrabold flex items-center space-x-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Target className="w-4 h-4" />
                <span>Hoàn Tất & Bắt Đầu Luyện ({selectedBand})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
