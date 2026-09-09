import React, { useState } from 'react';
import { 
  X, Mail, Lock, LogIn, UserPlus, LogOut, CheckCircle2, 
  AlertCircle, ShieldCheck, User, Sparkles, RefreshCw
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu cần có tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data?.user && data?.session) {
          setSuccessMsg('Đăng ký tài khoản thành công!');
          if (onAuthSuccess) onAuthSuccess(data.user);
          setTimeout(() => onClose(), 1200);
        } else {
          setSuccessMsg('Đăng ký thành công! Hãy kiểm tra hộp thư email của bạn để xác thực (hoặc đăng nhập ngay nếu không yêu cầu xác nhận).');
          setTimeout(() => setMode('login'), 2000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        setSuccessMsg('Đăng nhập thành công!');
        if (onAuthSuccess) onAuthSuccess(data.user);
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      console.error('Supabase Auth error:', err);
      let msg = err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Email hoặc mật khẩu không chính xác.';
      } else if (msg.includes('User already registered')) {
        msg = 'Email này đã được đăng ký trước đó. Vui lòng đăng nhập.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google login error:', err);
      setErrorMsg(err.message || 'Chưa thể kết nối Google Login. Vui lòng kiểm tra cài đặt Google Provider trên Supabase.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      if (onAuthSuccess) onAuthSuccess(null);
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-red-600/30 text-red-400 border border-red-500/30 flex items-center justify-center shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {user ? 'Tài Khoản Của Bạn' : mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {user ? user.email : 'Lưu trữ tiến độ học & lịch sử chấm thi'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* LOGGED IN VIEW */}
          {user ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 text-base">{user.email}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Đã kích hoạt đồng bộ đám mây Supabase an toàn.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 text-left space-y-1.5">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Quyền lợi tài khoản:</span>
                </div>
                <p>• Tự động đồng bộ bài viết và lịch sử chấm điểm khi đổi máy tính.</p>
                <p>• Lưu trữ sổ tay từ vựng & checklist lỗi sai cá nhân bền vững.</p>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{loading ? 'Đang thoát...' : 'Đăng Xuất'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOGIN / REGISTER FORM */
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              
              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google 1-Click Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-xs font-bold shadow-2xs flex items-center justify-center space-x-2.5 transition-all bg-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{mode === 'login' ? 'Đăng nhập nhanh với Google' : 'Đăng ký nhanh với Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-bold tracking-wider absolute">
                  Hoặc bằng Email
                </span>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Mật khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-red-600/10 flex items-center justify-center space-x-1.5 transition-all mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng Nhập</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Tạo Tài Khoản</span>
                  </>
                )}
              </button>

              {/* Toggle Mode Switcher */}
              <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                {mode === 'login' ? (
                  <span>
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('register')}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Đăng ký ngay
                    </button>
                  </span>
                ) : (
                  <span>
                    Đã có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Đăng nhập
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
