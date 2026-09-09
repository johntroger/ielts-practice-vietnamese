import React, { useState, useEffect } from 'react';
import { 
  Settings, Key, CheckCircle, AlertCircle, ExternalLink, X, Shield, 
  RefreshCw, Cpu, Eye, EyeOff, Trash2, HelpCircle, Check, Copy
} from 'lucide-react';
import { testApiKey, fetchAvailableModels, POPULAR_GEMINI_MODELS } from '../services/geminiService';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
  onClearAllLocalData
}) {
  if (!isOpen) return null;

  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    const deprecated = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.0-pro', 'gemini-pro'];
    if (!model || deprecated.includes(model) || model.startsWith('gemini-1.') || model.startsWith('gemini-2.0')) {
      return 'gemini-2.5-flash';
    }
    return model;
  });
  const [customModel, setCustomModel] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [availableModels, setAvailableModels] = useState(POPULAR_GEMINI_MODELS);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'error' | null
  const [testMessage, setTestMessage] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setInputKey(apiKey || '');
    setTestStatus(null);
    setTestMessage('');
  }, [apiKey, isOpen]);

  useEffect(() => {
    if (inputKey.trim()) {
      setIsLoadingModels(true);
      fetchAvailableModels(inputKey.trim())
        .then(models => {
          if (models && models.length > 0) {
            setAvailableModels(models);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingModels(false));
    }
  }, [inputKey]);

  const handleSave = () => {
    const finalModel = isCustom && customModel.trim() ? customModel.trim() : selectedModel;
    const finalKey = inputKey.trim();
    setApiKey(finalKey);
    setModel(finalModel);
    onClose();
  };

  const handleRemoveKey = () => {
    if (window.confirm('Bạn có chắc muốn xóa API Key khỏi thiết bị này? Bạn sẽ cần nhập lại để sử dụng AI.')) {
      setInputKey('');
      setApiKey('');
      setTestStatus(null);
      setTestMessage('');
    }
  };

  const handleTestConnection = async () => {
    if (!inputKey.trim()) {
      setTestStatus('error');
      setTestMessage('Vui lòng nhập API Key trước khi kiểm tra.');
      return;
    }
    const targetModel = isCustom && customModel.trim() ? customModel.trim() : selectedModel;
    setTestStatus('testing');
    setTestMessage(`Đang kết nối thử nghiệm với Google AI...`);

    try {
      await testApiKey(inputKey.trim(), targetModel);
      setTestStatus('success');
      setTestMessage(`Khóa API hợp lệ! Model [${targetModel}] phản hồi tốt.`);
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err.message || 'Không thể kết nối. Vui lòng kiểm tra lại Key hoặc hạn ngạch Google.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://aistudio.google.com/app/apikey');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 space-y-4 p-5 sm:p-6 my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cài Đặt Gemini API Key Cá Nhân</h3>
              <p className="text-xs text-slate-500">Mô hình BYOK (Bring Your Own Key) - Bảo mật 100%</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {/* Security Guarantee Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-2.5 leading-relaxed">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-emerald-900 mb-0.5">Cam Kết Quyền Riêng Tư & An Toàn:</strong>
              API Key của bạn <strong>chỉ lưu trên trình duyệt của máy bạn</strong> (LocalStorage). 
              Mỗi khi chấm bài, web kết nối trực tiếp đến Google AI. Chúng tôi <strong>tuyệt đối không thu thập hoặc lưu trữ</strong> mã của bạn.
            </div>
          </div>

          {/* Gemini API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-red-600" />
                <span>Mã Google Gemini API Key:</span>
              </label>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showGuide ? 'Ẩn hướng dẫn' : 'Cách lấy key miễn phí?'}</span>
              </button>
            </div>

            {/* Quick Guide Popup/Accordion */}
            {showGuide && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 animate-in fade-in duration-150">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>3 Bước Lấy Key Miễn Phí (Mất 30 giây):</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Đã copy link' : 'Copy link'}</span>
                  </button>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-red-600 font-semibold underline inline-flex items-center gap-0.5">Google AI Studio <ExternalLink className="w-2.5 h-2.5 inline" /></a> bằng tài khoản Gmail của bạn.</li>
                  <li>Bấm vào nút màu xanh <strong>"Create API key"</strong>.</li>
                  <li>Copy mã bắt đầu bằng <code>AIzaSy...</code> và dán vào ô bên dưới.</li>
                </ol>
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                  * Miễn phí hoàn toàn hạn ngạch từ Google cho nhu cầu học và luyện viết cá nhân.
                </p>
              </div>
            )}

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setTestStatus(null);
                }}
                placeholder="Dán mã AIzaSy... của bạn vào đây"
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title={showKey ? 'Ẩn mã key' : 'Hiện mã key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {inputKey && (
                  <button
                    type="button"
                    onClick={handleRemoveKey}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Xóa key khỏi máy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Test Connection Button & Result Banner */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing' || !inputKey.trim()}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  !inputKey.trim() 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin text-red-600' : ''}`} />
                <span>{testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra kết nối (Test Key)'}</span>
              </button>

              {inputKey.trim() && (
                <span className="text-[11px] text-slate-400">
                  {apiKey && apiKey === inputKey.trim() ? 'Đã lưu trên máy' : 'Chưa lưu'}
                </span>
              )}
            </div>

            {testStatus && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 animate-in fade-in duration-200 ${
                testStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' :
                testStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                {testStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                <span className="flex-1 leading-snug">{testMessage}</span>
              </div>
            )}
          </div>

          {/* Model Selector */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mô hình AI chấm điểm:</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-[11px] text-indigo-600 hover:underline font-semibold"
              >
                {isCustom ? '← Chọn từ danh sách có sẵn' : '✏️ Tự nhập model'}
              </button>
            </div>

            {!isCustom ? (
              <div>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoadingModels}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.id}
                    </option>
                  ))}
                </select>
                {isLoadingModels ? (
                  <p className="text-[11px] text-slate-400 mt-1">Đang tải danh sách model Google cấp phép...</p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Đã tự động loại bỏ các model cũ đã ngừng hỗ trợ (Gemini 1.0, 1.5, 2.0).</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Nhập mã model (vd: gemini-2.5-flash, gemini-2.5-pro, ...)"
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-indigo-50/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu ứng dụng về mặc định?')) {
                onClearAllLocalData();
                onClose();
              }
            }}
            className="text-xs text-slate-400 hover:text-red-600 transition-colors"
          >
            Khôi phục mặc định
          </button>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Lưu Cài Đặt
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

