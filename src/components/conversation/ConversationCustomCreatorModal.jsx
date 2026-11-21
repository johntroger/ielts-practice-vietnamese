import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { buildCustomConversation } from '../../data/conversationData';
import { callGeminiApi } from '../../services/ai/coreGeminiClient';

export default function ConversationCustomCreatorModal({
  isOpen,
  onClose,
  apiKey = '',
  model = 'gemini-3.6-flash',
  onCreatedScenario,
  isEn
}) {
  const [customTitle, setCustomTitle] = useState('');
  const [customTrack, setCustomTrack] = useState('daily');
  const [customBand, setCustomBand] = useState('7.0');
  const [customRoleA, setCustomRoleA] = useState('Partner');
  const [customRoleB, setCustomRoleB] = useState('You');
  const [customScript, setCustomScript] = useState(
    'A: Hi! Have you finished reviewing the quarterly presentation?\nB: Almost! I am just polishing the final financial summary.'
  );
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [isGeneratingAiScript, setIsGeneratingAiScript] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiScript = async () => {
    if (!apiKey || !aiTopicPrompt.trim() || isGeneratingAiScript) return;
    setIsGeneratingAiScript(true);
    try {
      const prompt = `Create a natural 6-turn English dialogue (alternating A: and B:) for IELTS Band ${customBand} practice on the topic: "${aiTopicPrompt.trim()}".
Return ONLY plain dialogue lines starting with "A:" and "B:", 1-2 sentences per turn, no extra commentary.`;
      const res = await callGeminiApi({
        model,
        apiKey,
        body: { contents: [{ parts: [{ text: prompt }] }] }
      });
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text.trim()) {
        setCustomScript(text.trim());
        if (!customTitle.trim()) {
          setCustomTitle(aiTopicPrompt.trim());
        }
      }
    } catch (err) {
      alert(err.message || (isEn ? 'Failed to generate dialogue.' : 'Không thể tạo hội thoại bằng AI.'));
    } finally {
      setIsGeneratingAiScript(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const created = buildCustomConversation({
      title: customTitle,
      track: customTrack,
      bandLevel: customBand,
      roleAName: customRoleA,
      roleBName: customRoleB,
      rawScript: customScript
    });
    if (!created.turns || created.turns.length < 2) {
      alert(
        isEn
          ? 'Please enter at least 2 dialogue lines (A: ... / B: ...).'
          : 'Vui lòng nhập ít nhất 2 dòng thoại (A: ... / B: ...).'
      );
      return;
    }
    onCreatedScenario?.(created);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92dvh] overflow-y-auto p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 text-slate-100 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">
            {isEn ? 'Create Custom Conversation' : 'Tạo Kịch Bản Hội Thoại Mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {apiKey && (
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Optional: Generate Script with Gemini AI' : 'Tùy chọn: Tạo nhanh kịch bản bằng Gemini AI'}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopicPrompt}
                onChange={e => setAiTopicPrompt(e.target.value)}
                placeholder={isEn ? 'e.g. Returning a defective laptop at a store' : 'VD: Đổi trả laptop bị lỗi tại cửa hàng'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleGenerateAiScript}
                disabled={isGeneratingAiScript}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAiScript ? (isEn ? 'Generating...' : 'Đang tạo...') : (isEn ? 'AI Write' : 'AI Viết')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            placeholder={isEn ? 'Scenario title...' : 'Tiêu đề hội thoại...'}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            required
          />
          <select
            value={customTrack}
            onChange={e => setCustomTrack(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="daily">{isEn ? 'Daily & Travel' : 'Đời Sống'}</option>
            <option value="ielts">IELTS Speaking</option>
            <option value="academic">{isEn ? 'Workplace & Academic' : 'Học Thuật'}</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <input
            type="text"
            value={customRoleA}
            onChange={e => setCustomRoleA(e.target.value)}
            placeholder="Role A"
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          />
          <input
            type="text"
            value={customRoleB}
            onChange={e => setCustomRoleB(e.target.value)}
            placeholder="Role B"
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          />
          <select
            value={customBand}
            onChange={e => setCustomBand(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="6.0">Band 6.0</option>
            <option value="7.0">Band 7.0</option>
            <option value="8.0">Band 8.0</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">
            {isEn ? 'Dialogue Lines (prefix with A: and B:)' : 'Nội dung thoại (mỗi dòng bắt đầu bằng A: hoặc B:)'}
          </label>
          <textarea
            rows={6}
            value={customScript}
            onChange={e => setCustomScript(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
          >
            {isEn ? 'Cancel' : 'Hủy'}
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-black cursor-pointer"
          >
            {isEn ? 'Save & Practice' : 'Lưu & Thực Hành'}
          </button>
        </div>
      </form>
    </div>
  );
}
