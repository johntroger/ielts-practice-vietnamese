import React, { useState } from 'react';
import { Sparkles, Compass, Check, Copy, X, Lightbulb, ArrowRight, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { callGeminiApi } from '../services/geminiService';
import { getGitBookBaseUrl } from '../core/featureRegistry';

export default function IdeaMatrixModal({ isOpen, onClose, promptText, onInsertToOutline, apiKey, model }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('pestle'); // 'pestle' | 'stakeholders'
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [pestleData, setPestleData] = useState(null);
  const [stakeholderData, setStakeholderData] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);

  // Default PESTLE 6 Dimensions from GitBook Guide
  const defaultPestleDimensions = [
    {
      code: 'P',
      title: 'P - Political & Institutional (Chính Trị & Thể Chế)',
      color: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      badge: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
      question: 'Chính phủ có nên can thiệp? Chính sách thuế, trợ cấp hay quan hệ quốc tế tác động ra sao?',
      ideas: [
        'Chính phủ cần đóng vai trò điều tiết chính thông qua các gói trợ cấp và chính sách ưu đãi.',
        'Sự hợp tác đa phương giữa các quốc gia là điều kiện tiên quyết để giải quyết tận gốc vấn đề.'
      ],
      collocations: ['regulatory framework', 'state intervention', 'multilateral treaty', 'fiscal subsidies']
    },
    {
      code: 'E',
      title: 'E - Economic & Financial (Kinh Tế & Thị Trường)',
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
      badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
      question: 'Tác động đến ngân sách công, việc làm, chi tiêu hộ gia đình hay tăng trưởng kinh tế?',
      ideas: [
        'Tạo ra thêm công ăn việc làm mới và kích cầu tiêu dùng nội địa trong trung và dài hạn.',
        'Đặt gánh nặng tài chính khổng lồ lên ngân sách quốc gia và người nộp thuế.'
      ],
      collocations: ['fiscal burden', 'commercial viability', 'job creation', 'market incentive']
    },
    {
      code: 'S',
      title: 'S - Social & Cultural (Xã Hội & Lối Sống)',
      color: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
      badge: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
      question: 'Hiện tượng này ảnh hưởng đến sự gắn kết xã hội, bình đẳng hay lối sống của người dân?',
      ideas: [
        'Góp phần thu hẹp khoảng cách giàu nghèo và nâng cao chất lượng cuộc sống cho người yếu thế.',
        'Nguy cơ làm xói mòn các giá trị văn hóa truyền thống và sự gắn kết gia đình.'
      ],
      collocations: ['social cohesion', 'cultural erosion', 'marginalized communities', 'quality of life']
    },
    {
      code: 'T',
      title: 'T - Technological & Digital (Công Nghệ & Kỹ Thuật Số)',
      color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
      badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
      question: 'Ứng dụng AI, tự động hóa hay chuyển đổi số mang lại đột phá gì và rủi ro gì?',
      ideas: [
        'Tối ưu hóa năng suất lao động và xóa bỏ rào cản địa lý trong học tập, làm việc.',
        'Nguy cơ gia tăng khoảng cách kỹ thuật số và đe dọa an ninh dữ liệu cá nhân.'
      ],
      collocations: ['disruptive innovation', 'digital divide', 'technological breakthrough', 'automation']
    },
    {
      code: 'L',
      title: 'L - Legal & Compliance (Luật Pháp & Chế Tài)',
      color: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
      badge: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
      question: 'Có cần ban hành luật mới? Chế tài phạt và hành lang pháp lý đã đủ tính răn đe chưa?',
      ideas: [
        'Cần thiết lập khung pháp lý chặt chẽ với các mức phạt mang tính răn đe cao đối với hành vi vi phạm.',
        'Bảo vệ quyền lợi hợp pháp và quyền riêng tư của công dân trước các hành vi trục lợi.'
      ],
      collocations: ['punitive measures', 'statutory regulations', 'legal deterrence', 'stringent enforcement']
    },
    {
      code: 'E',
      title: 'E - Environmental & Ecological (Môi Trường & Sinh Thái)',
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
      question: 'Lợi ích thu về có đánh đổi phát thải carbon, ô nhiễm hay cạn kiệt tài nguyên thiên nhiên?',
      ideas: [
        'Thúc đẩy quá trình chuyển dịch xanh và giảm thiểu lượng khí thải nhà kính ra khí quyển.',
        'Khai thác quá mức tài nguyên thiên nhiên dẫn đến suy giảm đa dạng sinh học trầm trọng.'
      ],
      collocations: ['ecological footprint', 'carbon emissions', 'sustainable transition', 'depletion of resources']
    }
  ];

  // Default Stakeholder 4 Dimensions
  const defaultStakeholderDimensions = [
    {
      code: '1',
      title: '1. Cá Nhân vs Xã Hội (Micro vs Macro)',
      color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
      badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
      question: 'Chính sách/hiện tượng này tác động đến quyền lợi từng cá nhân ra sao? Đến sự ổn định của toàn xã hội ra sao?',
      ideas: [
        'Cá nhân: Tăng sự tự do lựa chọn, nâng cao kỹ năng mềm và giảm áp lực tài chính gia đình.',
        'Xã hội: Nâng cao mặt bằng dân trí tổng thể, giảm thiểu tỷ lệ tội phạm phát sinh do thất nghiệp.'
      ],
      collocations: ['individual autonomy', 'societal welfare', 'collective consciousness', 'civic duty']
    },
    {
      code: '2',
      title: '2. Kinh Tế vs Môi Trường (Financial vs Ecological)',
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
      badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
      question: 'Lợi ích kinh tế thu về có bù đắp được các tổn hại về môi trường và cạn kiệt tài nguyên hay không?',
      ideas: [
        'Kinh tế: Kích thích tiêu dùng, tạo thêm nguồn thu thuế dồi dào và nhiều việc làm trong ngành dịch vụ.',
        'Môi trường: Tăng lượng rác thải sinh hoạt, ô nhiễm nguồn nước ngầm và tăng tốc độ biến đổi khí hậu.'
      ],
      collocations: ['economic boon', 'ecological toll', 'unsustainable exploitation', 'green growth']
    },
    {
      code: '3',
      title: '3. Ngắn Hạn vs Dài Hạn (Short-Term vs Sustainable Horizon)',
      color: 'border-teal-500/50 bg-teal-500/10 text-teal-300',
      badge: 'bg-teal-500/20 text-teal-200 border-teal-500/40',
      question: 'Hiệu quả đạt được ngay lập tức là gì? Sau 10-20 năm tới sẽ để lại hệ lụy hoặc chuyển biến gì?',
      ideas: [
        'Ngắn hạn: Giúp giải quyết nhanh bài toán áp lực ngân sách trước mắt và xoa dịu dư luận.',
        'Dài hạn: Nguy cơ phụ thuộc thái quá vào công nghệ ngoại lai và làm suy giảm năng lực tự chủ quốc gia.'
      ],
      collocations: ['stopgap measure', 'long-term ramifications', 'sustainable trajectory', 'lasting legacy']
    },
    {
      code: '4',
      title: '4. Chính Phủ vs Doanh Nghiệp (State vs Private Sector)',
      color: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
      badge: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
      question: 'Nhà nước có trách nhiệm gì (luật pháp, định hướng)? Doanh nghiệp tư nhân đóng vai trò gì?',
      ideas: [
        'Chính phủ: Ban hành hành lang pháp lý nghiêm ngặt, thanh tra độc lập và đánh thuế đánh mạnh vào ô nhiễm.',
        'Doanh nghiệp: Tăng cường trách nhiệm xã hội (CSR), đầu tư R&D để đổi mới giải pháp xanh.'
      ],
      collocations: ['statutory oversight', 'corporate social responsibility', 'public-private partnership', 'ethical conduct']
    }
  ];

  const handleFetchAiMatrix = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
      return;
    }
    setIsAiLoading(true);
    try {
      if (activeTab === 'pestle') {
        const prompt = `Act as an expert Cambridge IELTS Writing Master (Band 8.5+ examiner). Apply the 6-Dimensional P.E.S.T.L.E Framework to brainstorm multi-dimensional arguments for this Task 2 topic:
"${promptText}"

Analyze across 6 academic dimensions:
1. P - Political & Institutional (Chính trị & Thể chế)
2. E - Economic & Financial (Kinh tế & Thị trường)
3. S - Social & Cultural (Xã hội & Văn hóa)
4. T - Technological & Digital (Công nghệ & Chuyển đổi số)
5. L - Legal & Compliance (Luật pháp & Chế tài)
6. E - Environmental & Ecological (Môi trường & Sinh thái)

For each dimension, provide:
- code: "P", "E", "S", "T", "L", or "E"
- title: clear Vietnamese + English label
- question: 1 reflective critical trigger question in Vietnamese
- ideas: 2 sharply developed arguments (in Vietnamese, suitable for essay main points)
- collocations: 3-4 Band 7.5+ English academic collocations related to that angle

Return ONLY valid JSON matching this schema:
[
  {
    "code": "P",
    "title": "P - Chính Trị & Thể Chế",
    "question": "...",
    "ideas": ["Ý 1...", "Ý 2..."],
    "collocations": ["regulatory framework", "state intervention"]
  },
  ...
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
        const parsed = JSON.parse(cleaned);
        setPestleData(parsed);
      } else {
        const prompt = `Act as an expert IELTS Writing Master. Apply the 4-Stakeholder Thinking Matrix to generate multi-dimensional arguments for this Task 2 prompt:
"${promptText}"

Generate ideas under 4 lenses:
1. Micro vs Macro (Individual vs Society)
2. Financial vs Ecological (Economy vs Environment)
3. Short-term vs Long-term (Immediate vs 20-year horizon)
4. State vs Private (Government regulation vs Corporate responsibility)

Return ONLY valid JSON in this schema:
[
  { "code": "1", "title": "1. Cá Nhân vs Xã Hội", "question": "...", "ideas": ["Ý 1 cá nhân...", "Ý 2 xã hội..."], "collocations": ["individual autonomy", "societal welfare"] },
  { "code": "2", "title": "2. Kinh Tế vs Môi Trường", "question": "...", "ideas": ["Ý 1 kinh tế...", "Ý 2 môi trường..."], "collocations": ["economic boon", "ecological toll"] },
  { "code": "3", "title": "3. Ngắn Hạn vs Dài Hạn", "question": "...", "ideas": ["Ý 1 ngắn hạn...", "Ý 2 dài hạn..."], "collocations": ["stopgap measure", "long-term ramifications"] },
  { "code": "4", "title": "4. Nhà Nước vs Doanh Nghiệp", "question": "...", "ideas": ["Ý 1 nhà nước...", "Ý 2 doanh nghiệp..."], "collocations": ["statutory oversight", "corporate responsibility"] }
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
        const parsed = JSON.parse(cleaned);
        setStakeholderData(parsed);
      }
    } catch (err) {
      alert('Không thể tạo ma trận bằng AI lúc này. Hệ thống đang hiển thị khung gợi ý chuẩn theo cẩm nang.');
      if (activeTab === 'pestle') {
        setPestleData(defaultPestleDimensions);
      } else {
        setStakeholderData(defaultStakeholderDimensions);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentDisplayList = activeTab === 'pestle'
    ? (pestleData || defaultPestleDimensions)
    : (stakeholderData || defaultStakeholderDimensions);

  const handleInsert = (text) => {
    if (onInsertToOutline) {
      onInsertToOutline(text);
      setCopiedItem(text);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const pestleGuideUrl = `${getGitBookBaseUrl()}/writing/writing-ideation-pestle`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] max-h-[94dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Kho Lăng Kính Ý Tưởng Task 2 (Ideation Matrix)
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Chuẩn Band 8.0+
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Đập tan bế tắc ý tưởng bằng 6 lăng kính P.E.S.T.L.E hoặc 4 góc nhìn Stakeholder đa chiều
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={pestleGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Đọc cẩm nang chi tiết trên GitBook"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Cẩm Nang PESTLE</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Topic Context */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('pestle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'pestle'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ma Trận 6 Lăng Kính P.E.S.T.L.E</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stakeholders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'stakeholders'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ma Trận 4 Stakeholder</span>
            </button>
          </div>

          {/* Prompt context & AI trigger */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-1 min-w-0">
            <div className="text-xs text-slate-300 truncate max-w-md hidden lg:block" title={promptText}>
              <strong className="text-slate-400">Đề bài: </strong> {promptText || 'Chưa chọn đề bài cụ thể'}
            </div>

            <button
              onClick={handleFetchAiMatrix}
              disabled={isAiLoading}
              className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-md transition-all shrink-0 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAiLoading ? 'AI Đang Phân Tích Ma Trận...' : `AI Điền ${activeTab === 'pestle' ? '6 Lăng Kính PESTLE' : '4 Góc Nhìn'}`}</span>
            </button>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={`grid grid-cols-1 ${activeTab === 'pestle' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            {currentDisplayList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-inner"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <span className="font-black text-xs sm:text-sm text-slate-100 flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {item.code || (idx + 1)}
                      </span>
                      <span className="truncate">{item.title || item.dimension}</span>
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-400 italic leading-relaxed">
                    💡 {item.question}
                  </p>

                  {/* Bullet Ideas */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Luận điểm gợi ý:
                    </span>
                    {(item.ideas || []).map((idea, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-200 flex items-start justify-between gap-2 hover:bg-slate-850 transition-colors"
                      >
                        <span className="leading-relaxed flex-1">• {idea}</span>
                        {onInsertToOutline && (
                          <button
                            type="button"
                            onClick={() => handleInsert(idea)}
                            className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 text-[10px] font-bold border border-blue-500/30 shrink-0 transition-colors cursor-pointer flex items-center space-x-1"
                            title="Chèn luận điểm này vào dàn ý"
                          >
                            {copiedItem === idea ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Đã chèn</span>
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-3 h-3" />
                                <span>+ Dàn ý</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Band 7.5+ Collocations */}
                  {Array.isArray(item.collocations) && item.collocations.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                        Collocations C1/C2 gợi ý:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.collocations.map((colloc, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleInsert(colloc)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900 transition-colors cursor-pointer flex items-center space-x-1"
                            title="Bấm để chèn Collocation này vào dàn ý"
                          >
                            <span>{colloc}</span>
                            <span className="text-indigo-400 text-[8px]">+</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-1 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-850">
                  <span>Góc nhìn #{idx + 1}</span>
                  <span className="text-slate-400">Bấm "+ Dàn ý" để chèn</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Mẹo phòng thi:</strong> Không cần nhồi nhét cả 6 lăng kính vào 1 bài. Chỉ cần chọn 2-3 lăng kính tương phản rõ nét nhất để phát triển thành 2 thân bài (Body 1 & Body 2).
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer text-xs"
          >
            Đóng Ma Trận
          </button>
        </div>

      </div>
    </div>
  );
}
