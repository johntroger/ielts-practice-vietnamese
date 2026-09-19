import React from 'react';
import { AlertTriangle, RotateCcw, Copy, Download, Check, LifeBuoy, RefreshCw } from 'lucide-react';

/**
 * WorkspaceErrorBoundary:
 * Catches runtime crashes within a specific IELTS skill workspace (Writing, Reading, Listening, Speaking).
 * Prevents full-application whiteouts and provides an emergency "Data Lifesaver Box" (Hộp Cứu Sinh Dữ Liệu)
 * allowing learners to rescue their essay drafts or exam progress before resetting.
 */
export default class WorkspaceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      copied: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[WorkspaceErrorBoundary] Error in ${this.props.skillName || 'Workspace'}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, copied: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleCopyEmergencyData = () => {
    const data = this.props.emergencyData;
    let textToCopy = '';

    if (typeof data === 'string') {
      textToCopy = data;
    } else if (data && typeof data === 'object') {
      textToCopy = JSON.stringify(data, null, 2);
    }

    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 3000);
      });
    }
  };

  handleDownloadEmergencyData = () => {
    const data = this.props.emergencyData;
    let content = '';

    if (typeof data === 'string') {
      content = data;
    } else if (data && typeof data === 'object') {
      content = JSON.stringify(data, null, 2);
    } else {
      content = `Emergency backup from IELTS Web (${this.props.skillName || 'Workspace'})\nTime: ${new Date().toISOString()}`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ielts_emergency_backup_${(this.props.skillName || 'workspace').toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      const skill = this.props.skillName || 'Phòng Thi';
      const hasDataToSave = Boolean(this.props.emergencyData);

      return (
        <div className="w-full min-h-[420px] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 rounded-2xl border border-rose-500/30 backdrop-blur-xs my-4">
          <div className="max-w-xl w-full bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-rose-500/40 shadow-2xl text-center space-y-5">
            
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto text-rose-400">
              <LifeBuoy className="w-7 h-7 animate-pulse" />
            </div>

            {/* Error Message */}
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
                Lá Chắn Bảo Vệ Khảo Thí (Error Boundary)
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white pt-1">
                Sự cố hiển thị tại không gian {skill}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Hệ thống phát hiện lỗi giao diện bất ngờ. Đừng lo lắng, toàn bộ tiến trình và dữ liệu khác của bạn vẫn an toàn và không bị mất trắng.
              </p>
            </div>

            {/* Emergency Data Lifesaver Box */}
            {hasDataToSave && (
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Hộp Cứu Sinh Dữ Liệu Khẩn Cấp:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Dữ liệu có sẵn</span>
                </div>

                <div className="max-h-28 overflow-y-auto p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 select-all border border-slate-800">
                  {typeof this.props.emergencyData === 'string'
                    ? this.props.emergencyData
                    : JSON.stringify(this.props.emergencyData, null, 2)}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={this.handleCopyEmergencyData}
                    className="flex-1 min-w-[130px] flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors"
                  >
                    {this.state.copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{this.state.copied ? 'Đã sao chép!' : 'Sao chép nội dung'}</span>
                  </button>

                  <button
                    onClick={this.handleDownloadEmergencyData}
                    className="flex-1 min-w-[130px] flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải bản sao lưu (.txt)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Detail (collapsed/technical) */}
            {this.state.error && (
              <details className="text-left text-[11px] text-slate-500 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                <summary className="cursor-pointer font-bold hover:text-slate-400">
                  Chi tiết mã lỗi kỹ thuật: {this.state.error.name || 'Error'}
                </summary>
                <div className="mt-1 font-mono break-all text-slate-400 pt-1 border-t border-slate-800">
                  {this.state.error.message || String(this.state.error)}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử Phục Hồi Lại Phòng {skill}</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tải lại trang</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
