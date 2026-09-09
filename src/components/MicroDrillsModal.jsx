import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  X, 
  RotateCcw,
  BookOpen,
  Award,
  Loader2,
  PlusCircle,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { INITIAL_MICRO_DRILLS } from '../data/microDrills';
import { evaluateParaphrase, generateMicroDrill } from '../services/geminiService';

export default function MicroDrillsModal({ isOpen, onClose, apiKey, model }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('fill-blanks'); // 'fill-blanks' | 'true-false' | 'paraphrase' | 'error-spotting' | 'collocation'
  
  // Custom Drills stored in LocalStorage
  const [allDrills, setAllDrills] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_micro_drills');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...INITIAL_MICRO_DRILLS, ...parsed];
      }
    } catch (e) {
      console.error('Error loading custom drills:', e);
    }
    return INITIAL_MICRO_DRILLS;
  });

  // AI Generating state
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);
  const [drillGenMessage, setDrillGenMessage] = useState('');

  // Fill blanks state
  const fillDrills = allDrills.filter(d => d.type === 'fill-blanks');
  const [selectedFillIndex, setSelectedFillIndex] = useState(0);
  const [userFillAnswers, setUserFillAnswers] = useState({});
  const [showFillResults, setShowFillResults] = useState(false);

  // True/False state
  const tfDrills = allDrills.filter(d => d.type === 'true-false');
  const [selectedTfIndex, setSelectedTfIndex] = useState(0);
  const [userTfAnswers, setUserTfAnswers] = useState({});
  const [showTfResults, setShowTfResults] = useState(false);

  // Paraphrase state
  const paraDrills = allDrills.filter(d => d.type === 'paraphrase');
  const [selectedParaIndex, setSelectedParaIndex] = useState(0);
  const [candidateParaText, setCandidateParaText] = useState('');
  const [isEvaluatingPara, setIsEvaluatingPara] = useState(false);
  const [paraEvaluation, setParaEvaluation] = useState(null);

  // Error spotting state
  const errorDrills = allDrills.filter(d => d.type === 'error-spotting');
  const [selectedErrorIndex, setSelectedErrorIndex] = useState(0);
  const [userCorrectionText, setUserCorrectionText] = useState('');
  const [showErrorAnswer, setShowErrorAnswer] = useState(false);

  // Collocation Matching state
  const collocDrills = allDrills.filter(d => d.type === 'collocation');
  const [selectedCollocIndex, setSelectedCollocIndex] = useState(0);
  const [userCollocAnswers, setUserCollocAnswers] = useState({});
  const [showCollocResults, setShowCollocResults] = useState(false);

  // Handlers
  const currentFill = fillDrills[selectedFillIndex] || fillDrills[0];
  const currentTf = tfDrills[selectedTfIndex] || tfDrills[0];
  const currentPara = paraDrills[selectedParaIndex] || paraDrills[0];
  const currentError = errorDrills[selectedErrorIndex] || errorDrills[0];
  const currentColloc = collocDrills[selectedCollocIndex] || collocDrills[0];

  // Current active drills list and active index based on activeTab
  const getActiveDrillInfo = () => {
    switch (activeTab) {
      case 'fill-blanks':
        return { list: fillDrills, index: selectedFillIndex, setIndex: setSelectedFillIndex, onReset: () => { setUserFillAnswers({}); setShowFillResults(false); } };
      case 'true-false':
        return { list: tfDrills, index: selectedTfIndex, setIndex: setSelectedTfIndex, onReset: () => { setUserTfAnswers({}); setShowTfResults(false); } };
      case 'paraphrase':
        return { list: paraDrills, index: selectedParaIndex, setIndex: setSelectedParaIndex, onReset: () => { setCandidateParaText(''); setParaEvaluation(null); } };
      case 'error-spotting':
        return { list: errorDrills, index: selectedErrorIndex, setIndex: setSelectedErrorIndex, onReset: () => { setUserCorrectionText(''); setShowErrorAnswer(false); } };
      case 'collocation':
        return { list: collocDrills, index: selectedCollocIndex, setIndex: setSelectedCollocIndex, onReset: () => { setUserCollocAnswers({}); setShowCollocResults(false); } };
      default:
        return { list: [], index: 0, setIndex: () => {}, onReset: () => {} };
    }
  };

  const handleSelectDrill = (newIdx) => {
    const { list, setIndex, onReset } = getActiveDrillInfo();
    if (newIdx >= 0 && newIdx < list.length) {
      setIndex(newIdx);
      onReset();
    }
  };

  /**
   * Smart pagination toolbar that scales gracefully from 1 to 50+ drills
   * Features: Previous/Next buttons, fast Select dropdown, and scrollable pill list
   */
  const renderPaginationBar = () => {
    const { list, index } = getActiveDrillInfo();
    const total = list.length;
    if (total <= 1) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        {/* Navigation Info & Arrows */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700 whitespace-nowrap">
            Câu hỏi: <span className="text-red-600 font-extrabold text-sm">{index + 1}</span> / {total}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleSelectDrill(index - 1)}
              disabled={index === 0}
              className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs"
              title="Câu trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSelectDrill(index + 1)}
              disabled={index === total - 1}
              className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs"
              title="Câu tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Pill List / Quick Select */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
          {/* If more than 15 questions, show a quick jump dropdown */}
          {total > 15 ? (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium whitespace-nowrap">Chuyển nhanh:</span>
              <select
                value={index}
                onChange={(e) => handleSelectDrill(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs"
              >
                {list.map((d, i) => (
                  <option key={d.id || i} value={i}>
                    Câu {i + 1}: {d.title || d.category || `Bài tập ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-1 overflow-x-auto py-0.5 max-w-md">
              {list.map((d, i) => (
                <button
                  key={d.id || i}
                  onClick={() => handleSelectDrill(i)}
                  className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    index === i
                      ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/20 scale-105'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleEvaluateParaphrase = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }
    if (!candidateParaText.trim()) return;

    setIsEvaluatingPara(true);
    setParaEvaluation(null);
    try {
      const res = await evaluateParaphrase({
        originalSentence: currentPara.originalSentence,
        candidateSentence: candidateParaText,
        apiKey,
        model
      });
      setParaEvaluation(res);
    } catch (err) {
      alert(err.message || 'Lỗi khi chấm câu.');
    } finally {
      setIsEvaluatingPara(false);
    }
  };

  const handleGenerateDrill = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
      return;
    }

    setIsGeneratingDrill(true);
    setDrillGenMessage('AI đang tạo bài tập mới chuẩn Cambridge...');

    try {
      const newDrill = await generateMicroDrill({
        drillType: activeTab,
        apiKey,
        model
      });

      // Update state and persist to LocalStorage
      const updated = [...allDrills, newDrill];
      setAllDrills(updated);

      try {
        const customOnly = updated.filter(d => d.isAiGenerated);
        localStorage.setItem('ielts_custom_micro_drills', JSON.stringify(customOnly));
      } catch (e) {
        console.error('Failed to persist drills to localStorage:', e);
      }

      // Switch to new drill
      if (activeTab === 'fill-blanks') {
        const newIdx = updated.filter(d => d.type === 'fill-blanks').length - 1;
        setSelectedFillIndex(newIdx);
        setUserFillAnswers({});
        setShowFillResults(false);
      } else if (activeTab === 'true-false') {
        const newIdx = updated.filter(d => d.type === 'true-false').length - 1;
        setSelectedTfIndex(newIdx);
        setUserTfAnswers({});
        setShowTfResults(false);
      } else if (activeTab === 'paraphrase') {
        const newIdx = updated.filter(d => d.type === 'paraphrase').length - 1;
        setSelectedParaIndex(newIdx);
        setCandidateParaText('');
        setParaEvaluation(null);
      } else if (activeTab === 'error-spotting') {
        const newIdx = updated.filter(d => d.type === 'error-spotting').length - 1;
        setSelectedErrorIndex(newIdx);
        setUserCorrectionText('');
        setShowErrorAnswer(false);
      } else if (activeTab === 'collocation') {
        const newIdx = updated.filter(d => d.type === 'collocation').length - 1;
        setSelectedCollocIndex(newIdx);
        setUserCollocAnswers({});
        setShowCollocResults(false);
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo bài tập mới từ AI.');
    } finally {
      setIsGeneratingDrill(false);
      setDrillGenMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-xs">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Phòng Luyện Bổ Trợ (Micro-Drills Studio)</h2>
              <p className="text-xs text-slate-400">Rèn luyện giới từ, từ nối, đọc số liệu và paraphrase câu ngắn trước khi viết full bài</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('fill-blanks')}
              className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                activeTab === 'fill-blanks' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              1. Điền Vào Chỗ Trống ({fillDrills.length})
            </button>
            <button
              onClick={() => setActiveTab('true-false')}
              className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                activeTab === 'true-false' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              2. Đúng / Sai ({tfDrills.length})
            </button>
            <button
              onClick={() => setActiveTab('paraphrase')}
              className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                activeTab === 'paraphrase' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span>3. Paraphrase Câu ({paraDrills.length})</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>
            <button
              onClick={() => setActiveTab('error-spotting')}
              className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                activeTab === 'error-spotting' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              4. Tìm Sửa Lỗi ({errorDrills.length})
            </button>
            <button
              onClick={() => setActiveTab('collocation')}
              className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                activeTab === 'collocation' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>5. Ghép Collocation ({collocDrills.length})</span>
            </button>
          </div>

          {/* AI Generator Quick Action */}
          <button
            onClick={handleGenerateDrill}
            disabled={isGeneratingDrill}
            className="mb-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1.5 shrink-0 disabled:opacity-50 transition-all active:scale-95"
            title="Nhờ Gemini tạo thêm 1 bài tập mới theo đúng dạng đang xem"
          >
            {isGeneratingDrill ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3 h-3" />
                <span>AI Tạo Bài Tập Mới</span>
              </>
            )}
          </button>
        </div>

        {drillGenMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between">
            <span>{drillGenMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* Universal Scalable Question Toolbar */}
          {renderPaginationBar()}
          
          {/* TAB 1: FILL IN BLANKS */}
          {activeTab === 'fill-blanks' && currentFill && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                    {currentFill.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">{currentFill.title}</h3>
                </div>
              </div>

              {/* Passage with blank pills */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-loose font-sans">
                {currentFill.passage.split('___').map((segment, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{segment}</span>
                    {idx < arr.length - 1 && (
                      <span className="inline-block mx-1.5 align-middle">
                        <select
                          value={userFillAnswers[idx] || ''}
                          onChange={(e) => setUserFillAnswers({ ...userFillAnswers, [idx]: e.target.value })}
                          disabled={showFillResults}
                          className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${
                            showFillResults
                              ? userFillAnswers[idx]?.toLowerCase() === currentFill.blanks[idx]?.answer.toLowerCase()
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                : 'bg-red-100 text-red-900 border-red-400'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="">[Chọn từ]</option>
                          {currentFill.blanks[idx]?.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserFillAnswers({});
                    setShowFillResults(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài này</span>
                </button>

                <button
                  onClick={() => setShowFillResults(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án
                </button>
              </div>

              {/* Detailed Explanations */}
              {showFillResults && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800">Giải thích chi tiết từng vị trí:</h4>
                  {currentFill.blanks.map((b, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <strong className="text-red-600 shrink-0">Vị trí {i + 1} ({b.answer}):</strong>
                      <span className="text-slate-600">{b.explanation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRUE / FALSE STATEMENTS */}
          {activeTab === 'true-false' && currentTf && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {currentTf.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentTf.title}</h3>
                </div>
              </div>

              {/* Context info card */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium">
                <strong>Dữ kiện biểu đồ:</strong> {currentTf.context}
              </div>

              {/* Question list */}
              <div className="space-y-3">
                {currentTf.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm text-slate-800 font-medium flex-1">
                        <strong>Câu {idx + 1}:</strong> "{q.statement}"
                      </p>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => setUserTfAnswers({ ...userTfAnswers, [q.id]: true })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            userTfAnswers[q.id] === true
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          ĐÚNG (True)
                        </button>
                        <button
                          onClick={() => setUserTfAnswers({ ...userTfAnswers, [q.id]: false })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            userTfAnswers[q.id] === false
                              ? 'bg-red-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          SAI (False)
                        </button>
                      </div>
                    </div>

                    {showTfResults && (
                      <div className={`p-2.5 rounded-lg text-xs mt-2 ${
                        userTfAnswers[q.id] === q.isTrue
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-red-50 text-red-900 border border-red-200'
                      }`}>
                        <div className="font-bold">
                          {userTfAnswers[q.id] === q.isTrue ? '✓ Bạn đã chọn đúng!' : '✕ Bạn đã chọn sai!'} (Đáp án: {q.isTrue ? 'ĐÚNG' : 'SAI'})
                        </div>
                        <div className="mt-1 text-slate-600 font-normal">
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserTfAnswers({});
                    setShowTfResults(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài này</span>
                </button>

                <button
                  onClick={() => setShowTfResults(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Xem Kết Quả & Giải Thích
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PARAPHRASE SENTENCE */}
          {activeTab === 'paraphrase' && currentPara && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                    {currentPara.category} • Mục tiêu {currentPara.targetBand}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentPara.title}</h3>
                </div>
              </div>

              {/* Original sentence card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-400">Câu gốc (Band 5.5):</span>
                <p className="text-sm font-semibold text-slate-900 font-sans">
                  "{currentPara.originalSentence}"
                </p>
                {currentPara.hints && (
                  <div className="pt-2 text-xs text-amber-800 space-y-0.5">
                    <span className="font-bold">Gợi ý từ vựng & cấu trúc:</span>
                    <ul className="list-disc list-inside text-[11px]">
                      {currentPara.hints.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* User input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Câu bạn viết lại (Paraphrase):</label>
                <textarea
                  rows={3}
                  value={candidateParaText}
                  onChange={(e) => setCandidateParaText(e.target.value)}
                  placeholder="Nhập câu nâng cấp Band 7.5+ của bạn tại đây..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none font-sans"
                />
              </div>

              {/* Submit evaluation */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {candidateParaText.split(/\s+/).filter(Boolean).length} từ
                </span>
                <button
                  onClick={handleEvaluateParaphrase}
                  disabled={isEvaluatingPara || candidateParaText.trim().length < 5}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isEvaluatingPara ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Gemini Đang Chấm Câu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Chấm Câu Với AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Feedback */}
              {paraEvaluation && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-sm text-emerald-900">
                        Đánh giá câu: BAND {paraEvaluation.band ? paraEvaluation.band.toFixed(1) : '7.0'}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-800">
                      {paraEvaluation.isAccurateMeaning ? '✓ Giữ đúng 100% ngữ nghĩa' : '⚠️ Có sai lệch ngữ nghĩa'}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-950 leading-relaxed font-sans">
                    {paraEvaluation.feedback}
                  </p>

                  {paraEvaluation.alternatives && (
                    <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
                      <span className="font-bold text-xs text-emerald-900 block">
                        Hai phương án viết lại Band 8.5+ gợi ý:
                      </span>
                      {paraEvaluation.alternatives.map((alt, i) => (
                        <div key={i} className="p-2 rounded bg-white text-xs text-slate-800 border border-emerald-100 font-sans italic">
                          • {alt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ERROR SPOTTING */}
          {activeTab === 'error-spotting' && currentError && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold">
                    {currentError.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentError.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-1">
                <span className="text-[11px] font-bold text-red-700 block">Câu chứa lỗi sai:</span>
                <p className="text-sm font-semibold text-red-950">
                  "{currentError.sentenceWithErrors}"
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Câu bạn sửa lại:</label>
                <input
                  type="text"
                  value={userCorrectionText}
                  onChange={(e) => setUserCorrectionText(e.target.value)}
                  placeholder="Gõ lại câu đúng..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorAnswer(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                >
                  Xem Câu Đúng & Giải Thích
                </button>
              </div>

              {showErrorAnswer && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-2">
                  <div className="text-emerald-800 font-bold">
                    ✓ Câu chuẩn: "{currentError.targetCorrection}"
                  </div>
                  <p className="text-slate-600">
                    <strong>Giải thích ngữ pháp:</strong> {currentError.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACADEMIC COLLOCATION PAIRING */}
          {activeTab === 'collocation' && currentColloc && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                    {currentColloc.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentColloc.title}</h3>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                <strong>Nhiệm vụ:</strong> Ghép cặp Động từ / Tính từ bên trái với Cụm từ bên phải để tạo thành Collocation học thuật chuẩn C1-C2.
              </div>

              <div className="space-y-2.5">
                {currentColloc.pairs.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{p.term} + ...</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={userCollocAnswers[p.term] || ''}
                        onChange={(e) => setUserCollocAnswers({ ...userCollocAnswers, [p.term]: e.target.value })}
                        disabled={showCollocResults}
                        className={`p-2 rounded-lg text-xs font-semibold border ${
                          showCollocResults
                            ? userCollocAnswers[p.term] === p.match
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                              : 'bg-red-100 text-red-900 border-red-400'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        <option value="">-- Chọn cụm danh từ phù hợp --</option>
                        {currentColloc.pairs.map((optPair, oIdx) => (
                          <option key={oIdx} value={optPair.match}>
                            {optPair.match}
                          </option>
                        ))}
                      </select>
                    </div>

                    {showCollocResults && (
                      <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded sm:max-w-xs">
                        👉 <strong>{p.term} {p.match}</strong>: {p.meaning}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserCollocAnswers({});
                    setShowCollocResults(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài này</span>
                </button>

                <button
                  onClick={() => setShowCollocResults(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án & Nghĩa
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
