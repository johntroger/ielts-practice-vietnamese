import React, { useState } from 'react';
import { Sparkles, Compass, Check, Copy, X, Lightbulb, ArrowRight } from 'lucide-react';
import { callGeminiApi } from '../services/geminiService';

export default function IdeaMatrixModal({ isOpen, onClose, promptText, onInsertToOutline, apiKey, model }) {
  if (!isOpen) return null;

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [matrixData, setMatrixData] = useState(null);

  const defaultDimensions = [
    {
      dimension: '1. Cá Nhân vs Xã Hội (Micro vs Macro)',
      question: 'Chính sách/hiện tượng này tác động đến quyền lợi từng cá nhân ra sao? Đến sự ổn định của toàn xã hội ra sao?',
      ideas: ['Cá nhân: Tăng sự tự do, giảm áp lực tài chính gia đình.', 'Xã hội: Nâng cao mặt bằng dân trí, giảm tỷ lệ tội phạm do thất nghiệp.']
    },
    {
      dimension: '2. Kinh Tế vs Môi Trường (Financial vs Ecological)',
      question: 'Lợi ích kinh tế thu về có bù đắp được các tổn hại về môi trường và tài nguyên hay không?',
      ideas: ['Kinh tế: Kích thích tiêu dùng, tạo ra nhiều việc làm trong ngành dịch vụ.', 'Môi trường: Tăng lượng rác thải sinh hoạt và phát thải khí carbon.']
    },
    {
      dimension: '3. Ngắn Hạn vs Dài Hạn (Short-Term vs Sustainable)',
      question: 'Hiệu quả đạt được ngay lập tức là gì? Sau 10-20 năm tới sẽ để lại hệ lụy gì?',
      ideas: ['Ngắn hạn: Giúp giải quyết nhanh bài toán ngân sách trước mắt.', 'Dài hạn: Nguy cơ phụ thuộc công nghệ và mất dần các kỹ năng thủ công truyền thống.']
    },
    {
      dimension: '4. Chính Phủ vs Doanh Nghiệp (State vs Private Sector)',
      question: 'Nhà nước có trách nhiệm gì (luật pháp, trợ cấp)? Doanh nghiệp tư nhân đóng vai trò gì?',
      ideas: ['Chính phủ: Ban hành hành lang pháp lý nghiêm ngặt và đánh thuế ô nhiễm.', 'Doanh nghiệp: Đầu tư R&D để đổi mới công nghệ xanh.']
    }
  ];

  const handleFetchAiMatrix = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }
    setIsAiLoading(true);
    try {
      const prompt = `Act as an expert IELTS Writing Master. Apply the 4-Stakeholder Thinking Matrix to generate multi-dimensional arguments for this Task 2 prompt:
"${promptText}"

Generate ideas under 4 lenses:
1. Micro vs Macro (Individual vs Society)
2. Financial vs Ecological (Economy vs Environment)
3. Short-term vs Long-term (Immediate vs 20-year horizon)
4. State vs Private (Government regulation vs Corporate responsibility)

Return ONLY valid JSON in this schema:
[
  { "dimension": "1. Cá Nhân vs Xã Hội", "question": "...", "ideas": ["Ý 1 cá nhân...", "Ý 2 xã hội..."] },
  { "dimension": "2. Kinh Tế vs Môi Trường", "question": "...", "ideas": ["Ý 1 kinh tế...", "Ý 2 môi trường..."] },
  { "dimension": "3. Ngắn Hạn vs Dài Hạn", "question": "...", "ideas": ["Ý 1 ngắn hạn...", "Ý 2 dài hạn..."] },
  { "dimension": "4. Nhà Nước vs Doanh Nghiệp", "question": "...", "ideas": ["Ý 1 nhà nước...", "Ý 2 doanh nghiệp..."] }
]`;

      const response = await callGeminiApi({
        model,
        apiKey,
        body: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, responseMimeType: 'application/json' }
        }
      });

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      setMatrixData(JSON.parse(cleaned));
    } catch (err) {
      alert('Không thể tạo ma trận bằng AI. Đang hiển thị khung gợi ý chuẩn.');
      setMatrixData(defaultDimensions);
    } finally {
      setIsAiLoading(false);
    }
  };

  const displayData = matrixData || defaultDimensions;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Ma Trận Ý Tưởng Đa Chiều (Stakeholder Matrix)</h2>
              <p className="text-xs text-slate-400">Đập tan bế tắc ý tưởng Task 2 bằng 4 lăng kính tư duy phản biện</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Context & AI Auto-fill trigger */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600 max-w-xl truncate">
            <strong>Đề bài đang giải quyết: </strong> {promptText}
          </div>
          <button
            onClick={handleFetchAiMatrix}
            disabled={isAiLoading}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiLoading ? 'AI Đang Phân Tích Ma Trận...' : 'AI Điền Ý Tưởng Cho Đề Này'}</span>
          </button>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-1.5">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block border-b pb-1.5 text-blue-900">
                  {item.dimension}
                </span>
                <p className="text-xs text-slate-500 italic">
                  {item.question}
                </p>
                <div className="space-y-1 pt-1">
                  {item.ideas.map((idea, i) => (
                    <div key={i} className="p-2 rounded bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start justify-between gap-2">
                      <span>• {idea}</span>
                      <button
                        onClick={() => {
                          onInsertToOutline(idea);
                          alert('Đã chèn ý này vào khung Dàn Ý!');
                        }}
                        className="text-blue-600 hover:text-blue-800 text-[10px] font-bold shrink-0"
                        title="Chèn ý này vào Dàn bài"
                      >
                        + Dàn ý
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
