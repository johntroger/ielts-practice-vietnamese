import React, { useState, useEffect } from 'react';
import { 
  Settings, Key, CheckCircle, AlertCircle, ExternalLink, X, Shield, 
  RefreshCw, Cpu, Eye, EyeOff, Trash2, HelpCircle, Check, Copy,
  HardDrive, Download, Upload, Globe, Lock
} from 'lucide-react';
import { testApiKey, fetchAvailableModels, POPULAR_GEMINI_MODELS } from '../services/geminiService';
import { 
  getStorageMetrics, 
  pruneVolatileData, 
  exportBackupData, 
  importBackupData 
} from '../utils/storageService';
import { 
  AI_PROVIDERS, 
  getAiProviderConfig, 
  saveAiProviderConfig, 
  testProviderConnection 
} from '../services/aiProviderService';

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
    const validModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-pro-preview'];
    if (!model || !validModels.includes(model)) {
      return 'gemini-3.6-flash';
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

  // Storage resilience state
  const [storageMetrics, setStorageMetrics] = useState(() => getStorageMetrics());
  const [storageMessage, setStorageMessage] = useState('');

  // Multi-Model AI Provider State
  const [activeProvider, setActiveProvider] = useState(() => getAiProviderConfig().provider || 'gemini');
  const [deepseekKey, setDeepseekKey] = useState(() => getAiProviderConfig().deepseekApiKey || '');
  const [deepseekModel, setDeepseekModel] = useState(() => getAiProviderConfig().deepseekModel || 'deepseek-chat');
  const [openaiKey, setOpenaiKey] = useState(() => getAiProviderConfig().openaiApiKey || '');
  const [openaiModel, setOpenaiModel] = useState(() => getAiProviderConfig().openaiModel || 'gpt-4o-mini');
  const [claudeKey, setClaudeKey] = useState(() => getAiProviderConfig().claudeApiKey || '');
  const [claudeModel, setClaudeModel] = useState(() => getAiProviderConfig().claudeModel || 'claude-3-5-sonnet-20241022');
  const [customKey, setCustomKey] = useState(() => getAiProviderConfig().customApiKey || '');
  const [customModelName, setCustomModelName] = useState(() => getAiProviderConfig().customModel || 'llama3.2');
  const [customBaseUrl, setCustomBaseUrl] = useState(() => getAiProviderConfig().customBaseUrl || 'http://localhost:11434/v1');
  const [autoFallback, setAutoFallback] = useState(() => getAiProviderConfig().autoFallback ?? true);

  // AI Content Community Sharing Preference (Default: true)
  const [autoShareAi, setAutoShareAi] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    setInputKey(apiKey || '');
    setTestStatus(null);
    setTestMessage('');
    setStorageMetrics(getStorageMetrics());
    setStorageMessage('');
    const cfg = getAiProviderConfig();
    setActiveProvider(cfg.provider || 'gemini');
    setDeepseekKey(cfg.deepseekApiKey || '');
    setDeepseekModel(cfg.deepseekModel || 'deepseek-chat');
    setOpenaiKey(cfg.openaiApiKey || '');
    setOpenaiModel(cfg.openaiModel || 'gpt-4o-mini');
    setClaudeKey(cfg.claudeApiKey || '');
    setClaudeModel(cfg.claudeModel || 'claude-3-5-sonnet-20241022');
    setCustomKey(cfg.customApiKey || '');
    setCustomModelName(cfg.customModel || 'llama3.2');
    setCustomBaseUrl(cfg.customBaseUrl || 'http://localhost:11434/v1');
    setAutoFallback(cfg.autoFallback ?? true);
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      if (saved !== null) {
        setAutoShareAi(JSON.parse(saved));
      }
    } catch (e) {}
  }, [apiKey, isOpen]);

  const handleExportBackup = () => {
    try {
      const dataStr = exportBackupData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ielts_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStorageMessage('✅ Đã xuất bản sao lưu thành công!');
    } catch (e) {
      setStorageMessage(`❌ Lỗi xuất dữ liệu: ${e.message}`);
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        const res = importBackupData(content);
        if (res.success) {
          setStorageMessage(`✅ ${res.message}`);
          setStorageMetrics(getStorageMetrics());
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setStorageMessage(`❌ ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handlePruneStorage = () => {
    pruneVolatileData();
    const metrics = getStorageMetrics();
    setStorageMetrics(metrics);
    setStorageMessage('✅ Đã dọn dẹp các cache và lịch sử cũ để tối ưu bộ nhớ!');
  };

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

    saveAiProviderConfig({
      provider: activeProvider,
      geminiApiKey: finalKey,
      geminiModel: finalModel,
      deepseekApiKey: deepseekKey.trim(),
      deepseekModel,
      openaiApiKey: openaiKey.trim(),
      openaiModel,
      claudeApiKey: claudeKey.trim(),
      claudeModel,
      customApiKey: customKey.trim(),
      customModel: customModelName.trim(),
      customBaseUrl: customBaseUrl.trim(),
      autoFallback
    });

    if (activeProvider === 'gemini') {
      setApiKey(finalKey);
      setModel(finalModel);
    } else if (activeProvider === 'deepseek') {
      setApiKey(deepseekKey.trim() || finalKey);
      setModel(deepseekModel);
    } else if (activeProvider === 'openai') {
      setApiKey(openaiKey.trim() || finalKey);
      setModel(openaiModel);
    } else if (activeProvider === 'claude') {
      setApiKey(claudeKey.trim() || finalKey);
      setModel(claudeModel);
    } else {
      setApiKey(customKey.trim() || finalKey);
      setModel(customModelName.trim());
    }

    try {
      localStorage.setItem('ielts_auto_share_ai_content', JSON.stringify(autoShareAi));
    } catch (e) {}
    onClose();
  };

  const handleRemoveKey = () => {
    if (window.confirm('Bạn có chắc muốn xóa API Key khỏi thiết bị này? Bạn sẽ cần nhập lại để sử dụng AI.')) {
      if (activeProvider === 'gemini') {
        setInputKey('');
        setApiKey('');
      } else if (activeProvider === 'deepseek') {
        setDeepseekKey('');
      } else if (activeProvider === 'openai') {
        setOpenaiKey('');
      } else if (activeProvider === 'claude') {
        setClaudeKey('');
      } else {
        setCustomKey('');
      }
      setTestStatus(null);
      setTestMessage('');
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    const targetModel = isCustom && customModel.trim() ? customModel.trim() : selectedModel;

    if (activeProvider === 'gemini') {
      if (!inputKey.trim()) {
        setTestStatus('error');
        setTestMessage('Vui lòng nhập Gemini API Key trước khi kiểm tra.');
        return;
      }
      setTestMessage('Đang kết nối thử nghiệm với Google AI...');
      try {
        await testApiKey(inputKey.trim(), targetModel);
        setTestStatus('success');
        setTestMessage(`Khóa API hợp lệ! Model [${targetModel}] phản hồi tốt.`);
      } catch (err) {
        setTestStatus('error');
        setTestMessage(err.message || 'Không thể kết nối. Vui lòng kiểm tra lại Key hoặc hạn ngạch Google.');
      }
    } else {
      const cfg = {
        deepseekApiKey: deepseekKey.trim(),
        deepseekModel,
        openaiApiKey: openaiKey.trim(),
        openaiModel,
        claudeApiKey: claudeKey.trim(),
        claudeModel,
        customApiKey: customKey.trim(),
        customModel: customModelName.trim(),
        customBaseUrl: customBaseUrl.trim()
      };
      setTestMessage(`Đang kết nối thử nghiệm với ${activeProvider.toUpperCase()}...`);
      const res = await testProviderConnection(activeProvider, cfg);
      if (res.success) {
        setTestStatus('success');
        setTestMessage(`Kết nối ${activeProvider.toUpperCase()} thành công (${res.latencyMs}ms)! Phản hồi: "${res.response || 'OK'}"`);
      } else {
        setTestStatus('error');
        setTestMessage(res.error || `Không thể kết nối đến ${activeProvider}.`);
      }
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
              <h3 className="font-bold text-slate-900 text-base">Cài Đặt Nhà Cung Cấp AI & API Key</h3>
              <p className="text-xs text-slate-500">Mô hình BYOK (Bring Your Own Key) - Đa nền tảng & Bảo mật 100%</p>
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

          {/* Multi-Model Provider Selection Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Chọn Nhà Cung Cấp AI (AI Provider):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {AI_PROVIDERS.map((p) => {
                const isActive = activeProvider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveProvider(p.id);
                      setTestStatus(null);
                      setTestMessage('');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center truncate ${
                      isActive 
                        ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/60' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                    title={p.description}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              {AI_PROVIDERS.find(p => p.id === activeProvider)?.description}
            </p>
          </div>

          {/* Provider Panel: Google Gemini */}
          {activeProvider === 'gemini' && (
            <div className="space-y-3">
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

              {/* Gemini Model Selector */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mô hình Gemini:</span>
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
                        <span>Đã tự động lọc danh sách model hoạt động ổn định nhất.</span>
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
          )}

          {/* Provider Panel: DeepSeek */}
          {activeProvider === 'deepseek' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mã DeepSeek API Key:</span>
                  </label>
                  <a
                    href="https://platform.deepseek.com/api_keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-0.5"
                  >
                    <span>Lấy key tại DeepSeek</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={deepseekKey}
                    onChange={(e) => {
                      setDeepseekKey(e.target.value);
                      setTestStatus(null);
                    }}
                    placeholder="sk-..."
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {deepseekKey && (
                      <button
                        type="button"
                        onClick={handleRemoveKey}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mô hình DeepSeek:</span>
                </label>
                <select
                  value={deepseekModel}
                  onChange={(e) => setDeepseekModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="deepseek-chat">deepseek-chat (V3 - Đề xuất cho Writing & Đọc hiểu)</option>
                  <option value="deepseek-reasoner">deepseek-reasoner (R1 - Suy luận logic chuyên sâu)</option>
                </select>
              </div>
            </div>
          )}

          {/* Provider Panel: OpenAI */}
          {activeProvider === 'openai' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mã OpenAI API Key:</span>
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-0.5"
                  >
                    <span>Lấy key tại OpenAI</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => {
                      setOpenaiKey(e.target.value);
                      setTestStatus(null);
                    }}
                    placeholder="sk-proj-..."
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {openaiKey && (
                      <button
                        type="button"
                        onClick={handleRemoveKey}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mô hình OpenAI:</span>
                </label>
                <select
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Cực nhanh & chi phí tối ưu - Khuyên dùng)</option>
                  <option value="gpt-4o">gpt-4o (Thông minh và toàn diện nhất)</option>
                  <option value="o3-mini">o3-mini (Lý luận cao cấp mới)</option>
                </select>
              </div>
            </div>
          )}

          {/* Provider Panel: Anthropic Claude */}
          {activeProvider === 'claude' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mã Anthropic Claude API Key:</span>
                  </label>
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold flex items-center space-x-0.5"
                  >
                    <span>Lấy key tại Anthropic</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={claudeKey}
                    onChange={(e) => {
                      setClaudeKey(e.target.value);
                      setTestStatus(null);
                    }}
                    placeholder="sk-ant-..."
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {claudeKey && (
                      <button
                        type="button"
                        onClick={handleRemoveKey}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mô hình Claude:</span>
                </label>
                <select
                  value={claudeModel}
                  onChange={(e) => setClaudeModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet (Văn phong giám khảo tự nhiên nhất)</option>
                  <option value="claude-3-5-haiku-20241022">claude-3-5-haiku (Tốc độ cực nhanh)</option>
                </select>
              </div>
            </div>
          )}

          {/* Provider Panel: Custom / Local Ollama */}
          {activeProvider === 'custom' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  <span>Base URL Endpoint:</span>
                </label>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434/v1 hoặc https://openrouter.ai/api/v1"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-400">Chuẩn tương thích OpenAI API (Ollama, LM Studio, vLLM, OpenRouter, v.v.)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tên Model:</span>
                  </label>
                  <input
                    type="text"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    placeholder="llama3.2, mistral, deepseek-r1..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Key className="w-3.5 h-3.5 text-purple-600" />
                    <span>API Key (tùy chọn):</span>
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="Để trống nếu chạy local"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Connection Button & Result Banner */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={
                  testStatus === 'testing' ||
                  (activeProvider === 'gemini' ? !inputKey.trim() :
                   activeProvider === 'deepseek' ? !deepseekKey.trim() :
                   activeProvider === 'openai' ? !openaiKey.trim() :
                   activeProvider === 'claude' ? !claudeKey.trim() : !customBaseUrl.trim())
                }
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  (activeProvider === 'gemini' ? !inputKey.trim() :
                   activeProvider === 'deepseek' ? !deepseekKey.trim() :
                   activeProvider === 'openai' ? !openaiKey.trim() :
                   activeProvider === 'claude' ? !claudeKey.trim() : !customBaseUrl.trim())
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin text-red-600' : ''}`} />
                <span>{testStatus === 'testing' ? 'Đang kiểm tra...' : `Kiểm tra kết nối (${activeProvider.toUpperCase()})`}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                {activeProvider === 'gemini' && inputKey.trim() && apiKey === inputKey.trim() ? 'Đã lưu trên máy' : ''}
              </span>
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

          {/* Auto-Fallback Resilience Option */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="pr-3">
              <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span>Tự động chuyển tiếp phòng vệ (Auto-Fallback)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Khuyên dùng</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Tự động chuyển sang Google Gemini hoặc thuật toán Offline nếu nhà cung cấp gặp sự cố hoặc vượt hạn ngạch.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={autoFallback} 
                onChange={(e) => setAutoFallback(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Section: Privacy & Community Auto-Sharing */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Quyền Riêng Tư & Chia Sẻ Cộng Đồng</span>
            </label>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span>Tự động chia sẻ đề thi AI lên cộng đồng</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Mặc định</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Đề thi & bài đọc do AI sinh tự động thành tài nguyên chung của web. Tắt nếu bạn muốn mặc định lưu riêng tư cho tài khoản.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  checked={autoShareAi} 
                  onChange={(e) => setAutoShareAi(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start space-x-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Chính sách bảo mật:</strong> Hình ảnh & file âm thanh cá nhân bạn tải lên luôn được giữ riêng tư 100% và tự hủy sau khi làm bài (Zero-Storage), không bao giờ bị chia sẻ ra ngoài.
              </span>
            </div>
          </div>

          {/* Section: Storage Resilience & Backup */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span>Bộ Nhớ Trình Duyệt & Sao Lưu</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {storageMetrics.usedBytes ? `${(storageMetrics.usedBytes / 1024).toFixed(0)} KB` : '0 KB'} / 5 MB ({storageMetrics.usagePercent}%)
              </span>
            </div>

            {/* Storage Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  storageMetrics.usagePercent > 80 ? 'bg-rose-500' : storageMetrics.usagePercent > 50 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.max(2, storageMetrics.usagePercent)}%` }}
              />
            </div>

            {storageMessage && (
              <div className="text-[11px] p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-medium">
                {storageMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                title="Tải toàn bộ bài viết, lịch sử thi và ghi chú về máy"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Xuất Bản Sao Lưu</span>
              </button>

              <label className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Nhập Bản Sao Lưu</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportBackup}
                />
              </label>

              <button
                type="button"
                onClick={handlePruneStorage}
                className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-amber-100/60 text-slate-700 hover:text-amber-800 font-bold text-xs transition-colors"
                title="Giải phóng bộ nhớ bằng cách dọn dẹp các cache tạm thời"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                <span>Dọn Dẹp Cache</span>
              </button>
            </div>
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

