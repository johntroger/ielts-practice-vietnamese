import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { buildCustomPronunciationDrill } from '../../data/pronunciationData';
import { callGeminiApi } from '../../services/ai/coreGeminiClient';

export default function PronunciationCustomDrillModal({
  isOpen,
  onClose,
  apiKey = '',
  model = 'gemini-3.6-flash',
  vocabList = [],
  onCreatedDrill,
  isEn
}) {
  const [customText, setCustomText] = useState('');
  const [customType, setCustomType] = useState('auto');
  const [customMeaning, setCustomMeaning] = useState('');
  const [customBand, setCustomBand] = useState('7.0');
  const [aiDrillTopic, setAiDrillTopic] = useState('');
  const [isGeneratingAiDrill, setIsGeneratingAiDrill] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiDrill = async () => {
    if (!apiKey || !aiDrillTopic.trim() || isGeneratingAiDrill) return;
    setIsGeneratingAiDrill(true);
    try {
      const targetKind =
        customType === 'words'
          ? '1 high-value IELTS academic single word'
          : customType === 'phrases'
          ? '1 natural IELTS academic collocation/phrase (3-5 words)'
          : customType === 'sentences'
          ? '1 authentic IELTS Speaking sentence (12-18 words)'
          : '1 high-value IELTS Speaking collocation or sentence';
      const prompt = `Generate ${targetKind} for IELTS Band ${customBand} pronunciation practice on the topic: "${aiDrillTopic.trim()}".
Return STRICTLY valid JSON: {"text": "...", "meaning": "${isEn ? 'concise English meaning & pronunciation tip' : 'nghĩa tiếng Việt ngắn gọn kèm lưu ý phát âm'}"}`;
      const res = await callGeminiApi({
        model,
        apiKey,
        body: { contents: [{ parts: [{ text: prompt }] }] }
      });
      const raw = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.text) setCustomText(String(parsed.text).trim());
        if (parsed.meaning) setCustomMeaning(String(parsed.meaning).trim());
      } else if (raw.trim()) {
        setCustomText(raw.trim().replace(/^["']|["']$/g, ''));
      }
    } catch (err) {
      alert(err.message || (isEn ? 'Failed to generate drill with AI.' : 'Không thể tạo bài tập bằng AI.'));
    } finally {
      setIsGeneratingAiDrill(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!customText.trim()) return;

    const newDrill = buildCustomPronunciationDrill({
      text: customText.trim(),
      type: customType,
      bandLevel: customBand,
      topic: isEn ? 'Custom Drill' : 'Bài tập tự tạo',
      meaning: customMeaning.trim()
    });

    setCustomText('');
    setCustomMeaning('');
    onCreatedDrill?.(newDrill);
  };

  const handleImportFromVocabVault = (vocabItem) => {
    if (!vocabItem?.word) return;
    const newDrill = buildCustomPronunciationDrill({
      text: vocabItem.word,
      type: 'auto',
      bandLevel: vocabItem.band || '7.0',
      topic: vocabItem.topic || (isEn ? 'Vocab Vault' : 'Sổ tay từ vựng'),
      meaning: vocabItem.meaning || ''
    });
    onCreatedDrill?.(newDrill);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92dvh] overflow-y-auto p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl space-y-4 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">
              {isEn
                ? 'Create Custom Pronunciation Exercise'
                : 'Tạo Bài Tập Phát Âm Mới (Từ / Cụm Từ / Câu)'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {apiKey && (
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'Optional: Suggest a Pronunciation Drill with Gemini AI'
                    : 'Tùy chọn: Gợi ý nhanh bài luyện phát âm bằng Gemini AI'}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiDrillTopic}
                  onChange={e => setAiDrillTopic(e.target.value)}
                  placeholder={
                    isEn
                      ? 'e.g., Climate change, AI ethics, or silent letters...'
                      : 'VD: Biến đổi khí hậu, Trí tuệ nhân tạo, hoặc âm câm...'
                  }
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiDrill}
                  disabled={isGeneratingAiDrill || !aiDrillTopic.trim()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isGeneratingAiDrill
                    ? isEn ? 'Generating...' : 'Đang tạo...'
                    : isEn ? 'AI Suggest' : 'AI Gợi Ý'}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isEn
                ? 'Target English Word, Phrase, or Full Sentence *'
                : 'Nhập Từ đơn, Cụm từ hoặc Câu tiếng Anh cần luyện phát âm *'}
            </label>
            <textarea
              rows={2}
              required
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder={
                isEn
                  ? 'e.g., conscientious, play a pivotal role in, or a full IELTS Speaking sentence...'
                  : 'VD: conscientious, play a pivotal role in, hoặc cả một câu IELTS Speaking...'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isEn ? 'Exercise Track' : 'Phân loại bài tập'}
              </label>
              <select
                value={customType}
                onChange={e => setCustomType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="auto">
                  {isEn ? 'Auto-detect (Word/Phrase/Sentence)' : 'Tự động nhận diện (Từ/Cụm/Câu)'}
                </option>
                <option value="words">{isEn ? 'Single Word (+15 XP)' : 'Từ đơn (+15 XP)'}</option>
                <option value="phrases">{isEn ? 'Phrase / Collocation (+25 XP)' : 'Cụm từ (+25 XP)'}</option>
                <option value="sentences">{isEn ? 'Full Sentence (+35 XP)' : 'Cả câu (+35 XP)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isEn ? 'Target Band Level' : 'Mức Band mục tiêu'}
              </label>
              <select
                value={customBand}
                onChange={e => setCustomBand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="6.0">Band 6.0</option>
                <option value="6.5">Band 6.5</option>
                <option value="7.0">Band 7.0</option>
                <option value="7.5">Band 7.5</option>
                <option value="8.0">Band 8.0+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isEn ? 'Meaning or Pronunciation Note (Optional)' : 'Nghĩa hoặc ghi chú phát âm (Tùy chọn)'}
            </label>
            <input
              type="text"
              value={customMeaning}
              onChange={e => setCustomMeaning(e.target.value)}
              placeholder={
                isEn
                  ? 'e.g., Thorough and careful; pay attention to /ʃ/ sound'
                  : 'VD: Tận tâm, chu đáo; chú ý âm /ʃ/ ở giữa từ'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>

          {/* Quick Import from Personal Vocabulary Notebook if available */}
          {Array.isArray(vocabList) && vocabList.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-amber-400 mb-1.5">
                {isEn
                  ? 'Or 1-Click Import from Your Personal Vocabulary Notebook:'
                  : 'Hoặc nạp nhanh 1-chạm từ Sổ Tay Từ Vựng Cá Nhân của bạn:'}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {vocabList.slice(0, 12).map(v => (
                  <button
                    key={v.id || v.word}
                    type="button"
                    onClick={() => handleImportFromVocabVault(v)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-[11px] font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    + {v.word}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Hủy'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg cursor-pointer"
            >
              {isEn ? 'Create & Practice Now' : 'Tạo Bài Tập & Luyện Ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
