import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { buildCustomShadowingTask } from '../../data/shadowingData';
import { callGeminiApi } from '../../services/ai/coreGeminiClient';

export default function ShadowingCustomCreatorModal({
  isOpen,
  onClose,
  apiKey = '',
  model = 'gemini-3.6-flash',
  onCreatedTask,
  isEn
}) {
  const [customTitle, setCustomTitle] = useState('');
  const [customPart, setCustomPart] = useState('part2');
  const [customBand, setCustomBand] = useState('7.5');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customRawText, setCustomRawText] = useState(
    'I would like to talk about a memorable book that reshaped how I manage my time.\n\nRoughly two years ago, I felt constantly overwhelmed by university deadlines. Reading about deliberate focus habits helped me restructure my mornings and boost my productivity.'
  );
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [isGeneratingAiSample, setIsGeneratingAiSample] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiSample = async () => {
    if (!apiKey || !aiTopicPrompt.trim() || isGeneratingAiSample) return;
    setIsGeneratingAiSample(true);
    try {
      const prompt = `Write an authentic IELTS Speaking ${customPart.toUpperCase()} Band ${customBand} sample response on the topic: "${aiTopicPrompt.trim()}".
Separate paragraphs with a blank line. If ${customPart} is part1 or part3, prefix 2 examiner questions with "Examiner: " before the sample answers. Return ONLY the clean script text.`;
      const res = await callGeminiApi({
        model,
        apiKey,
        body: { contents: [{ parts: [{ text: prompt }] }] }
      });
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text.trim()) {
        setCustomRawText(text.trim());
        if (!customTitle.trim()) setCustomTitle(aiTopicPrompt.trim());
        if (!customPrompt.trim()) setCustomPrompt(aiTopicPrompt.trim());
      }
    } catch (err) {
      alert(err.message || (isEn ? 'Failed to generate sample.' : 'Không thể tạo bài mẫu bằng AI.'));
    } finally {
      setIsGeneratingAiSample(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const created = buildCustomShadowingTask({
      title: customTitle,
      part: customPart,
      bandLevel: customBand,
      prompt: customPrompt,
      rawText: customRawText
    });
    if (!created.segments || created.segments.length === 0) {
      alert(isEn ? 'Please enter at least 1 sentence or paragraph.' : 'Vui lòng nhập ít nhất 1 câu hoặc 1 đoạn.');
      return;
    }
    onCreatedTask?.(created);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92dvh] overflow-y-auto p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 text-slate-100 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">
            {isEn ? 'Add Speaking Sample for Shadowing' : 'Thêm Bài Mẫu Speaking Luyện Shadowing'}
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
              <span>{isEn ? 'Optional: Generate Band Sample with Gemini AI' : 'Tùy chọn: Tạo bài mẫu nhanh bằng Gemini AI'}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopicPrompt}
                onChange={e => setAiTopicPrompt(e.target.value)}
                placeholder={isEn ? 'e.g. Describe a helpful neighbour' : 'VD: Describe a helpful neighbour'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleGenerateAiSample}
                disabled={isGeneratingAiSample}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAiSample ? (isEn ? 'Writing...' : 'Đang viết...') : (isEn ? 'AI Write' : 'AI Viết')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            placeholder={isEn ? 'Sample title...' : 'Tiêu đề bài mẫu...'}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            required
          />
          <select
            value={customPart}
            onChange={e => setCustomPart(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="part1">Part 1</option>
            <option value="part2">Part 2 Cue Card</option>
            <option value="part3">Part 3 Discussion</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder={isEn ? 'Speaking prompt / cue card question...' : 'Đề bài / câu hỏi gợi ý...'}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          />
          <select
            value={customBand}
            onChange={e => setCustomBand(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="6.5">Band 6.5</option>
            <option value="7.0">Band 7.0</option>
            <option value="7.5">Band 7.5</option>
            <option value="8.0">Band 8.0</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">
            {isEn
              ? 'Sample Text (separate segments/paragraphs with a blank line; optional "Examiner:" prefix for questions)'
              : 'Nội dung bài mẫu (cách nhau bởi 1 dòng trống để chia câu/đoạn; có thể thêm "Examiner:" cho câu hỏi)'}
          </label>
          <textarea
            rows={6}
            value={customRawText}
            onChange={e => setCustomRawText(e.target.value)}
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black cursor-pointer"
          >
            {isEn ? 'Save & Shadow' : 'Lưu & Luyện Tập'}
          </button>
        </div>
      </form>
    </div>
  );
}
