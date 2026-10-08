import React, { useState } from 'react';
import { 
  X, Sparkles, Compass, Lightbulb, CheckCircle2, Copy, BookOpen, 
  HelpCircle, ArrowRight, Layers, Target, Clock, ShieldCheck 
} from 'lucide-react';
import { useTranslation } from '../../i18n';

const getFiveWOneH = (isEn) => [
  {
    label: isEn ? 'WHO (Subject / Agent)' : 'WHO (Chủ thể)',
    prompt: isEn ? 'Who participated, accompanied, or exerted the greatest influence?' : 'Ai là người tham gia, đồng hành, hoặc gây ảnh hưởng lớn nhất?',
    template: 'Speaking of who was involved, I primarily shared this experience with my...',
    exampleKeyword: isEn ? 'Close confidants, mentor, colleagues, family members' : 'Close confidants, mentor, colleagues, family members'
  },
  {
    label: isEn ? 'WHAT (Core Subject)' : 'WHAT (Bản chất sự việc)',
    prompt: isEn ? 'What is the core essence of this event, object, or phenomenon?' : 'Bản chất cốt lõi của sự việc / đồ vật / hiện tượng này là gì?',
    template: 'At its core, this revolves around a state-of-the-art / fascinating...',
    exampleKeyword: isEn ? 'Pivotal milestone, cutting-edge device, extracurricular project' : 'Pivotal milestone, cutting-edge device, extracurricular project'
  },
  {
    label: isEn ? 'WHERE (Setting / Context)' : 'WHERE (Không gian / Bối cảnh)',
    prompt: isEn ? 'Where did it take place? What atmosphere or vibe did the environment convey?' : 'Diễn ra ở đâu? Không gian mang lại cảm giác thế nào?',
    template: 'This took place in a serene / bustling setting, nestled in...',
    exampleKeyword: isEn ? 'Metropolitan hub, idyllic countryside, tranquil campus library' : 'Metropolitan hub, idyllic countryside, tranquil campus library'
  },
  {
    label: isEn ? 'WHEN (Time / Background)' : 'WHEN (Thời gian / Hoàn cảnh)',
    prompt: isEn ? 'When did it occur? During what stage of your life?' : 'Thời điểm nào? Trong giai đoạn nào của cuộc đời?',
    template: 'If my memory serves me correctly, this occurred roughly two years ago when...',
    exampleKeyword: isEn ? 'During my freshman year, at a pivotal crossroads, in the midst of' : 'During my freshman year, at a pivotal crossroads, in the midst of'
  },
  {
    label: isEn ? 'WHY (Motivations & Drivers)' : 'WHY (Lý do & Động lực)',
    prompt: isEn ? 'Why was this significant, memorable, or transformative?' : 'Tại sao việc này lại quan trọng hoặc đáng nhớ?',
    template: 'The primary driving factor behind this was my ardent desire to...',
    exampleKeyword: isEn ? 'Expand horizons, conquer comfort zone, foster mental well-being' : 'Expand horizons, conquer comfort zone, foster mental well-being'
  },
  {
    label: isEn ? 'HOW (Emotions & Key Takeaways)' : 'HOW (Cảm xúc & Bài học)',
    prompt: isEn ? 'How did it feel and what valuable lessons did you draw?' : 'Cảm nhận thế nào và bạn đã rút ra bài học gì?',
    template: 'Looking back, this experience profoundly reshaped my outlook by teaching me that...',
    exampleKeyword: isEn ? 'Reap rewarding dividends, foster resilience, invaluable epiphany' : 'Reap rewarding dividends, foster resilience, invaluable epiphany'
  }
];

const getMultiAngles = (isEn) => [
  {
    dimension: isEn ? 'Individual & Emotional' : 'Cá nhân & Cảm xúc (Individual & Emotional)',
    angle: isEn ? 'Direct impact on mental well-being, personal productivity, and intrinsic passions' : 'Tác động trực tiếp lên sức khỏe tinh thần, năng suất và sở thích',
    starters: 'From a personal standpoint, engaging in this serves as an indispensable sanctuary to decompress and recharge my batteries.'
  },
  {
    dimension: isEn ? 'Social & Interpersonal' : 'Xã hội & Cộng đồng (Social & Interpersonal)',
    angle: isEn ? 'Nurturing interpersonal relationships, team dynamics, and communal bonds' : 'Gắn kết các mối quan hệ, tinh thần đồng đội hoặc văn hóa gia đình',
    starters: 'On an interpersonal level, it acts as a cultural glue that strengthens mutual empathy and community cohesion.'
  },
  {
    dimension: isEn ? 'Financial & Professional' : 'Kinh tế & Nghề nghiệp (Financial & Professional)',
    angle: isEn ? 'Career advancement, opportunity costs, and financial resource optimization' : 'Cơ hội thăng tiến, chi phí cơ hội, tối ưu hóa nguồn lực tài chính',
    starters: 'From an economic viewpoint, adopting this strategy yields lucrative returns while minimizing wasteful expenditure.'
  },
  {
    dimension: isEn ? 'Technological & Future Trends' : 'Công nghệ & Xu hướng Tương lai (Technological & Trends)',
    angle: isEn ? 'Digital transformation, the proliferation of AI, and modern lifestyle patterns' : 'Chuyển đổi số, sự bùng nổ của AI, và lối sống hiện đại',
    starters: 'In this digital epoch, this phenomenon mirrors the rapid transition toward automation and algorithmic convenience.'
  }
];

const getPpfTimeline = (isEn) => [
  {
    period: isEn ? 'PAST' : 'QUÁ KHỨ (Past)',
    focus: isEn ? 'Former habits, past beliefs, or initial starting point' : 'Thói quen xưa, quan niệm cũ hoặc xuất phát điểm',
    starter: 'Harking back to my early adolescence, I used to be quite averse to...',
    tips: isEn ? 'Grammar focus: used to + V, was once convinced that, in retrospect' : 'Dùng cấu trúc: used to + V, was once convinced that, in retrospect'
  },
  {
    period: isEn ? 'PRESENT' : 'HIỆN TẠI (Present)',
    focus: isEn ? 'Current status quo, psychological or behavioral evolution' : 'Thực trạng bây giờ, sự chuyển biến tư duy',
    starter: 'However, at present, I make a conscious effort to regularly...',
    tips: isEn ? 'Grammar focus: have developed a penchant for, has undergone a radical shift' : 'Dùng cấu trúc: have developed a penchant for, has undergone a radical shift'
  },
  {
    period: isEn ? 'FUTURE' : 'TƯƠNG LAI (Future)',
    focus: isEn ? 'Aspirations, anticipated trajectories, and prospective goals' : 'Kỳ vọng, dự đoán phát triển tiếp theo',
    starter: 'Looking ahead into the foreseeable future, I aspire to further delve into...',
    tips: isEn ? 'Grammar focus: In the foreseeable future, should circumstances permit, I anticipate that' : 'Dùng cấu trúc: In the foreseeable future, should circumstances permit, I anticipate that'
  }
];

export default function SpeakingIdeaMatrixModal({
  isOpen,
  onClose,
  topicTitle = '',
  questionText = '',
  part = 1
}) {
  const { t, isEn } = useTranslation();
  const [activeFramework, setActiveFramework] = useState('5w1h'); // '5w1h' | 'multi_angle' | 'ppf'
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const fiveWOneH = getFiveWOneH(isEn);
  const multiAngles = getMultiAngles(isEn);
  const ppfTimeline = getPpfTimeline(isEn);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">
                  {isEn ? 'Idea Matrix (Idea Generation Framework)' : 'Idea Matrix (Ma Trận Khơi Nguồn Ý Tưởng)'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {isEn ? 'Band 7.5+ Strategy' : 'Band 7.5+ Tool'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEn ? 'Overcome idea blocks with 3 examiner-approved thinking frameworks' : 'Không bao giờ lo bí ý tưởng với 3 lăng kính tư duy chuẩn khảo thí'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Topic Reference */}
        {(questionText || topicTitle) && (
          <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="truncate">
              <span className="text-purple-400 font-bold mr-1.5">
                {isEn ? 'Active Prompt:' : 'Đề bài đang luyện:'}
              </span>
              <span className="text-slate-300 font-semibold italic">"{questionText || topicTitle}"</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold shrink-0">
              Part {part}
            </span>
          </div>
        )}

        {/* Framework Selector Tabs */}
        <div className="px-6 pt-4 pb-2 flex items-center space-x-2 shrink-0 border-b border-slate-800/60 bg-slate-900">
          <button
            onClick={() => setActiveFramework('5w1h')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeFramework === '5w1h'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{isEn ? '5W1H Matrix (Comprehensive)' : 'Ma Trận 5W1H (Toàn Diện)'}</span>
          </button>

          <button
            onClick={() => setActiveFramework('multi_angle')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeFramework === 'multi_angle'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isEn ? 'Multi-Angle Perspectives' : 'Đa Góc Nhìn (Multi-Angle)'}</span>
          </button>

          <button
            onClick={() => setActiveFramework('ppf')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeFramework === 'ppf'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isEn ? 'Timeline Progression (PPF)' : 'Dòng Thời Gian (PPF)'}</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* 1. FRAMEWORK 5W1H */}
          {activeFramework === '5w1h' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                {isEn ? (
                  <>💡 <strong>Examiner Insight:</strong> When faced with an unfamiliar prompt, rapidly scan these 6 branches. Covering just 2 to 3 branches yields a fluent, coherent 30–45 second response.</>
                ) : (
                  <>💡 <strong>Bí quyết khảo thí:</strong> Khi gặp bất kỳ câu hỏi khó nào, hãy quét nhanh qua 6 ô câu hỏi này. Bạn chỉ cần trả lời 2 đến 3 nhánh là đã có câu trả lời 30-45 giây cực kỳ mạch lạc và trôi chảy.</>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fiveWOneH.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-purple-500/40 transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">
                        {item.label}
                      </span>
                      <button
                        onClick={() => handleCopy(item.template, idx)}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer transition-opacity"
                        title={isEn ? "Copy sentence starter" : "Copy mẫu câu mở đầu"}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{isEn ? 'Copied' : 'Đã chép'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isEn ? 'Copy template' : 'Chép mẫu'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {item.prompt}
                    </p>

                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-purple-300 italic">
                      "{item.template}"
                    </div>

                    <div className="text-[10px] text-slate-500">
                      {isEn ? 'Suggested keywords:' : 'Từ khóa gợi ý:'}{' '}
                      <span className="text-slate-400 font-medium">{item.exampleKeyword}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. FRAMEWORK MULTI-ANGLE */}
          {activeFramework === 'multi_angle' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                {isEn ? (
                  <>💡 <strong>Part 3 Strategy:</strong> Examiners reward candidates who evaluate issues across multiple dimensions (Individual, Social, Economic, Technological).</>
                ) : (
                  <>💡 <strong>Bí quyết Part 3:</strong> Giám khảo luôn đánh giá rất cao thí sinh biết nhìn nhận vấn đề từ nhiều lăng kính (Cá nhân, Xã hội, Kinh tế, Công nghệ).</>
                )}
              </div>

              <div className="space-y-3">
                {multiAngles.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 group hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>{item.dimension}</span>
                      </span>
                      <button
                        onClick={() => handleCopy(item.starters, idx + 20)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedIndex === idx + 20 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{isEn ? 'Copied' : 'Đã chép'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isEn ? 'Copy starter' : 'Chép câu mẫu'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">{item.angle}</p>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-purple-200 font-mono italic">
                      "{item.starters}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FRAMEWORK PPF (PAST - PRESENT - FUTURE) */}
          {activeFramework === 'ppf' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                {isEn ? (
                  <>💡 <strong>Range Extension Weapon:</strong> The PPF technique displays diverse grammatical structures (Past Simple, Present Perfect, Unreal Future/Conditionals) to satisfy Band 8.0 GRA criteria.</>
                ) : (
                  <>💡 <strong>Vũ khí kéo dài thời gian:</strong> Kỹ thuật PPF giúp bạn phô diễn đa dạng thì ngữ pháp (Quá khứ đơn, Hiện tại hoàn thành, Tương lai giả định) để dễ dàng chạm mốc Band 8.0 tiêu chí GRA.</>
                )}
              </div>

              <div className="space-y-3">
                {ppfTimeline.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 group hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-400">
                        {item.period} — {item.focus}
                      </span>
                      <button
                        onClick={() => handleCopy(item.starter, idx + 40)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedIndex === idx + 40 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{isEn ? 'Copied' : 'Đã chép'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isEn ? 'Copy starter' : 'Chép câu mẫu'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-purple-200 font-mono italic">
                      "{item.starter}"
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      💡 {item.tips}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {isEn ? 'Click "Copy starter" to incorporate ideas into your speaking response' : 'Bấm "Chép mẫu" để lấy ý tưởng ráp vào câu trả lời của bạn'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {isEn ? 'Understood & Return to Practice' : 'Đã Hiểu & Quay Lại Luyện Nói'}
          </button>
        </div>
      </div>
    </div>
  );
}
