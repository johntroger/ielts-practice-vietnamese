import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="max-w-md w-full bg-slate-900 p-6 rounded-2xl border border-red-500/30 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
            <h2 className="text-lg font-bold text-white mb-2">Đã có lỗi giao diện xảy ra</h2>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">Hệ thống đã tự động ngăn chặn sập trang. Vui lòng bấm làm mới để đồng bộ lại dữ liệu phiên làm việc.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => { window.location.href = window.location.origin; }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
              >
                Làm Mới Ứng Dụng
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('ielts_latest_diagnostic_result');
                    localStorage.removeItem('ielts_30_day_study_plan');
                    localStorage.removeItem('ielts_study_plan_completed_days');
                  } catch (e) {}
                  window.location.reload();
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Khôi Phục Bộ Nhớ
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left text-[11px] text-red-300 bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-40 border border-slate-800">
                <summary className="cursor-pointer font-mono font-bold text-red-400">Chi tiết lỗi kỹ thuật</summary>
                <pre className="mt-2 whitespace-pre-wrap">{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>
);

