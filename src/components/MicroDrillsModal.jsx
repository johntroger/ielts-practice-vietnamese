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
  ChevronRight,
  Headphones,
  Mic,
  Compass,
  FileText,
  Target,
  Search,
  Split,
  Lightbulb,
  Clock,
  Flame,
  Zap
} from 'lucide-react';
import { INITIAL_MICRO_DRILLS } from '../data/microDrills';
import { READING_MICRO_DRILLS } from '../data/readingMicroDrills';
import { evaluateParaphrase, generateMicroDrill } from '../services/geminiService';

export default function MicroDrillsModal({ isOpen, onClose, apiKey, model, activeSkill = 'writing' }) {
  if (!isOpen) return null;

  // Active Room: 'general' | 'writing' | 'reading' | 'listening' | 'speaking'
  const [activeRoom, setActiveRoom] = useState(() => {
    return activeSkill === 'reading' ? 'reading' : 'writing';
  });

  // Active Tab within each room
  // General: 'collocation' | 'context-vocab' | 'sentence-chunking'
  // Writing: 'fill-blanks' | 'true-false' | 'paraphrase' | 'error-spotting'
  // Reading: 'reading-tfng' | 'reading-paraphrase' | 'reading-headings'
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSkill === 'reading') return 'reading-tfng';
    return 'fill-blanks';
  });

  // When room changes, auto-select the first tab of that room
  const handleRoomChange = (room) => {
    setActiveRoom(room);
    if (room === 'general') setActiveTab('collocation');
    else if (room === 'writing') setActiveTab('fill-blanks');
    else if (room === 'reading') setActiveTab('reading-tfng');
  };

  // Drills stored in LocalStorage combined with defaults
  const [allDrills, setAllDrills] = useState(() => {
    const combinedDefaults = [...INITIAL_MICRO_DRILLS, ...READING_MICRO_DRILLS];
    try {
      const saved = localStorage.getItem('ielts_custom_micro_drills');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...combinedDefaults, ...parsed];
      }
    } catch (e) {
      console.error('Error loading custom drills:', e);
    }
    return combinedDefaults;
  });

  // AI Generating state
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);
  const [drillGenMessage, setDrillGenMessage] = useState('');

  // ----------------------------------------------------
  // WRITING DRILLS STATE
  // ----------------------------------------------------
  const fillDrills = allDrills.filter(d => d.type === 'fill-blanks');
  const [selectedFillIndex, setSelectedFillIndex] = useState(0);
  const [userFillAnswers, setUserFillAnswers] = useState({});
  const [showFillResults, setShowFillResults] = useState(false);

  const tfDrills = allDrills.filter(d => d.type === 'true-false');
  const [selectedTfIndex, setSelectedTfIndex] = useState(0);
  const [userTfAnswers, setUserTfAnswers] = useState({});
  const [showTfResults, setShowTfResults] = useState(false);

  const paraDrills = allDrills.filter(d => d.type === 'paraphrase');
  const [selectedParaIndex, setSelectedParaIndex] = useState(0);
  const [candidateParaText, setCandidateParaText] = useState('');
  const [isEvaluatingPara, setIsEvaluatingPara] = useState(false);
  const [paraEvaluation, setParaEvaluation] = useState(null);

  const errorDrills = allDrills.filter(d => d.type === 'error-spotting');
  const [selectedErrorIndex, setSelectedErrorIndex] = useState(0);
  const [userCorrectionText, setUserCorrectionText] = useState('');
  const [showErrorAnswer, setShowErrorAnswer] = useState(false);

  // ----------------------------------------------------
  // GENERAL CORE FOUNDATION STATE
  // ----------------------------------------------------
  const collocDrills = allDrills.filter(d => d.type === 'collocation');
  const [selectedCollocIndex, setSelectedCollocIndex] = useState(0);
  const [userCollocAnswers, setUserCollocAnswers] = useState({});
  const [showCollocResults, setShowCollocResults] = useState(false);

  const contextVocabDrills = allDrills.filter(d => d.type === 'context-vocab');
  const [selectedVocabIndex, setSelectedVocabIndex] = useState(0);
  const [userVocabChoice, setUserVocabChoice] = useState(null);
  const [showVocabResult, setShowVocabResult] = useState(false);

  const chunkDrills = allDrills.filter(d => d.type === 'sentence-chunking');
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);
  const [showChunkAnalysis, setShowChunkAnalysis] = useState(false);

  // ----------------------------------------------------
  // READING DRILLS STATE
  // ----------------------------------------------------
  const readingTfngDrills = allDrills.filter(d => d.type === 'reading-tfng');
  const [selectedTfngIndex, setSelectedTfngIndex] = useState(0);
  const [userTfngChoice, setUserTfngChoice] = useState(null);
  const [showTfngResult, setShowTfngResult] = useState(false);

  const readingParaDrills = allDrills.filter(d => d.type === 'reading-paraphrase');
  const [selectedReadingParaIndex, setSelectedReadingParaIndex] = useState(0);
  const [showReadingParaAnalysis, setShowReadingParaAnalysis] = useState(false);

  const readingHeadingsDrills = allDrills.filter(d => d.type === 'reading-headings');
  const [selectedHeadingsIndex, setSelectedHeadingsIndex] = useState(0);
  const [userHeadingChoice, setUserHeadingChoice] = useState(null);
  const [showHeadingsResult, setShowHeadingsResult] = useState(false);

  // Current items
  const currentFill = fillDrills[selectedFillIndex] || fillDrills[0];
  const currentTf = tfDrills[selectedTfIndex] || tfDrills[0];
  const currentPara = paraDrills[selectedParaIndex] || paraDrills[0];
  const currentError = errorDrills[selectedErrorIndex] || errorDrills[0];
  const currentColloc = collocDrills[selectedCollocIndex] || collocDrills[0];
  const currentVocab = contextVocabDrills[selectedVocabIndex] || contextVocabDrills[0];
  const currentChunk = chunkDrills[selectedChunkIndex] || chunkDrills[0];
  const currentTfng = readingTfngDrills[selectedTfngIndex] || readingTfngDrills[0];
  const currentReadingPara = readingParaDrills[selectedReadingParaIndex] || readingParaDrills[0];
  const currentHeadings = readingHeadingsDrills[selectedHeadingsIndex] || readingHeadingsDrills[0];

  // Current active drills list and active index based on activeTab
  const getActiveDrillInfo = () => {
    switch (activeTab) {
      // Writing
      case 'fill-blanks':
        return { list: fillDrills, index: selectedFillIndex, setIndex: setSelectedFillIndex, onReset: () => { setUserFillAnswers({}); setShowFillResults(false); } };
      case 'true-false':
        return { list: tfDrills, index: selectedTfIndex, setIndex: setSelectedTfIndex, onReset: () => { setUserTfAnswers({}); setShowTfResults(false); } };
      case 'paraphrase':
        return { list: paraDrills, index: selectedParaIndex, setIndex: setSelectedParaIndex, onReset: () => { setCandidateParaText(''); setParaEvaluation(null); } };
      case 'error-spotting':
        return { list: errorDrills, index: selectedErrorIndex, setIndex: setSelectedErrorIndex, onReset: () => { setUserCorrectionText(''); setShowErrorAnswer(false); } };
      // General
      case 'collocation':
        return { list: collocDrills, index: selectedCollocIndex, setIndex: setSelectedCollocIndex, onReset: () => { setUserCollocAnswers({}); setShowCollocResults(false); } };
      case 'context-vocab':
        return { list: contextVocabDrills, index: selectedVocabIndex, setIndex: setSelectedVocabIndex, onReset: () => { setUserVocabChoice(null); setShowVocabResult(false); } };
      case 'sentence-chunking':
        return { list: chunkDrills, index: selectedChunkIndex, setIndex: setSelectedChunkIndex, onReset: () => { setShowChunkAnalysis(false); } };
      // Reading
      case 'reading-tfng':
        return { list: readingTfngDrills, index: selectedTfngIndex, setIndex: setSelectedTfngIndex, onReset: () => { setUserTfngChoice(null); setShowTfngResult(false); } };
      case 'reading-paraphrase':
        return { list: readingParaDrills, index: selectedReadingParaIndex, setIndex: setSelectedReadingParaIndex, onReset: () => { setShowReadingParaAnalysis(false); } };
      case 'reading-headings':
        return { list: readingHeadingsDrills, index: selectedHeadingsIndex, setIndex: setSelectedHeadingsIndex, onReset: () => { setUserHeadingChoice(null); setShowHeadingsResult(false); } };
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
   */
  const renderPaginationBar = () => {
    const { list, index } = getActiveDrillInfo();
    const total = list.length;
    if (total <= 1) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700 whitespace-nowrap">
            Bài tập: <span className="text-red-600 font-extrabold text-sm">{index + 1}</span> / {total}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleSelectDrill(index - 1)}
              disabled={index === 0}
              className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs"
              title="Bài trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSelectDrill(index + 1)}
              disabled={index === total - 1}
              className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs"
              title="Bài tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
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
                    Bài {i + 1}: {d.title || d.category || `Bài tập ${i + 1}`}
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
    setDrillGenMessage('AI đang tạo bài tập mới chuẩn Cambridge IELTS...');

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

      // Automatically switch to the newly created drill
      const targetList = updated.filter(d => d.type === activeTab);
      const newIdx = targetList.length - 1;
      const { setIndex, onReset } = getActiveDrillInfo();
      setIndex(newIdx);
      onReset();
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo bài tập mới từ AI.');
    } finally {
      setIsGeneratingDrill(false);
      setDrillGenMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] max-h-[94dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-xs">
              <Puzzle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-xl font-bold">Phòng Luyện Bổ Trợ (Micro-Drills)</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wide">
                  Đa Kỹ Năng
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                Rèn luyện phản xạ ngôn ngữ, phá các bẫy tư duy kinh điển trước khi bước vào phòng thi thật
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level 1: Room Selector Bar (Phòng Chuyên Môn) */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar touch-pan-x shrink-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
              Phòng Luyện:
            </span>

            {/* Room 1: Chung */}
            <button
              onClick={() => handleRoomChange('general')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'general'
                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Phòng Chung</span>
            </button>

            {/* Room 2: Chuyên Writing */}
            <button
              onClick={() => handleRoomChange('writing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'writing'
                  ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chuyên Writing</span>
            </button>

            {/* Room 3: Chuyên Reading */}
            <button
              onClick={() => handleRoomChange('reading')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'reading'
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chuyên Reading</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-black">
                MỚI
              </span>
            </button>

            {/* Room 4: Chuyên Listening (Roadmap) */}
            <button
              onClick={() => handleRoomChange('listening')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'listening'
                  ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Listening</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 text-[9px] font-medium">
                ⏳ Sắp có
              </span>
            </button>

            {/* Room 5: Chuyên Speaking (Roadmap) */}
            <button
              onClick={() => handleRoomChange('speaking')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeRoom === 'speaking'
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speaking</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 text-[9px] font-medium">
                ⏳ Sắp có
              </span>
            </button>
          </div>
        </div>

        {/* Level 2: Sub-tabs within Active Room & AI Generator Button */}
        {activeRoom !== 'listening' && activeRoom !== 'speaking' && (
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 sm:px-4 pt-2 gap-2 overflow-x-auto no-scrollbar touch-pan-x text-xs font-semibold text-slate-600 shrink-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
              {/* SUB-TABS FOR GENERAL */}
              {activeRoom === 'general' && (
                <>
                  <button
                    onClick={() => setActiveTab('collocation')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'collocation' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Collocations C1-C2 ({collocDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('context-vocab')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'context-vocab' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đoán Nghĩa Từ Ngữ Cảnh ({contextVocabDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sentence-chunking')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'sentence-chunking' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5 text-blue-600" />
                    <span>Giải Phẫu Câu Phức S-V-O ({chunkDrills.length})</span>
                  </button>
                </>
              )}

              {/* SUB-TABS FOR WRITING */}
              {activeRoom === 'writing' && (
                <>
                  <button
                    onClick={() => setActiveTab('fill-blanks')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                      activeTab === 'fill-blanks' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    1. Điền Chỗ Trống ({fillDrills.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('true-false')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
                      activeTab === 'true-false' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    2. Đọc Số Liệu Task 1 ({tfDrills.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('paraphrase')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'paraphrase' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <span>3. Paraphrase Mở/Thân Bài ({paraDrills.length})</span>
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
                </>
              )}

              {/* SUB-TABS FOR READING */}
              {activeRoom === 'reading' && (
                <>
                  <button
                    onClick={() => setActiveTab('reading-tfng')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'reading-tfng' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <span>1. Bẫy True / False / Not Given ({readingTfngDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reading-paraphrase')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'reading-paraphrase' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-amber-500" />
                    <span>2. Săn Paraphrase Bài Đọc ({readingParaDrills.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reading-headings')}
                    className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
                      activeTab === 'reading-headings' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>3. Phá Bẫy Matching Headings ({readingHeadingsDrills.length})</span>
                  </button>
                </>
              )}
            </div>

            {/* AI Generator Button */}
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
                  <span>AI Tạo Bài Mới</span>
                </>
              )}
            </button>
          </div>
        )}

        {drillGenMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between">
            <span>{drillGenMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 sm:pb-8 space-y-4">
          
          {/* Render Pagination Bar if not in Roadmap rooms */}
          {activeRoom !== 'listening' && activeRoom !== 'speaking' && renderPaginationBar()}

          {/* ============================================================ */}
          {/* READING ROOM: 1. TRUE / FALSE / NOT GIVEN                    */}
          {/* ============================================================ */}
          {activeRoom === 'reading' && activeTab === 'reading-tfng' && currentTfng && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                    {currentTfng.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentTfng.title}</h3>
                </div>
              </div>

              {/* Passage Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Đoạn trích bài đọc (Reading Excerpt):
                </span>
                <p className="text-sm font-serif leading-relaxed text-slate-800">
                  {currentTfng.passage}
                </p>
              </div>

              {/* Statement Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  Phát biểu cần xác thực (Statement):
                </span>
                <p className="text-sm sm:text-base font-semibold text-blue-950">
                  "{currentTfng.statement}"
                </p>
              </div>

              {/* Interactive 3 Choice Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Lựa chọn của bạn:</label>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  {[
                    { val: 'TRUE', label: 'TRUE', desc: 'Bài đọc khẳng định đúng', color: 'emerald' },
                    { val: 'FALSE', label: 'FALSE', desc: 'Bài đọc mâu thuẫn trực tiếp', color: 'rose' },
                    { val: 'NOT GIVEN', label: 'NOT GIVEN', desc: 'Không có thông tin / Suy diễn', color: 'amber' }
                  ].map(opt => {
                    const isSelected = userTfngChoice === opt.val;
                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                    
                    if (isSelected) {
                      if (opt.val === 'TRUE') btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30';
                      else if (opt.val === 'FALSE') btnStyle = 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30';
                      else btnStyle = 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-400/30';
                    }

                    return (
                      <button
                        key={opt.val}
                        onClick={() => setUserTfngChoice(opt.val)}
                        disabled={showTfngResult}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${btnStyle}`}
                      >
                        <span className="text-sm sm:text-base font-black tracking-wide">{opt.label}</span>
                        <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserTfngChoice(null);
                    setShowTfngResult(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại câu này</span>
                </button>

                <button
                  onClick={() => {
                    if (!userTfngChoice) {
                      alert('Vui lòng chọn TRUE, FALSE hoặc NOT GIVEN trước khi kiểm tra.');
                      return;
                    }
                    setShowTfngResult(true);
                  }}
                  disabled={!userTfngChoice}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án & Mổ Xẻ Bẫy
                </button>
              </div>

              {/* In-depth Result & Trap Breakdown */}
              {showTfngResult && (
                <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
                  userTfngChoice === currentTfng.answer
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {userTfngChoice === currentTfng.answer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                      <span className={`font-bold text-sm ${
                        userTfngChoice === currentTfng.answer ? 'text-emerald-900' : 'text-rose-900'
                      }`}>
                        {userTfngChoice === currentTfng.answer
                          ? 'CHÍNH XÁC! Bạn đã phá bẫy thành công.'
                          : `CHƯA ĐÚNG! Đáp án chuẩn là: ${currentTfng.answer}`}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[11px] font-bold">
                      {currentTfng.trapType}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {currentTfng.explanation}
                  </p>

                  {currentTfng.evidence && (
                    <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700">
                      <strong>Manh mối bài đọc:</strong> <span className="italic font-serif">"{currentTfng.evidence}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* READING ROOM: 2. READING PARAPHRASE HUNTER                   */}
          {/* ============================================================ */}
          {activeRoom === 'reading' && activeTab === 'reading-paraphrase' && currentReadingPara && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                    {currentReadingPara.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentReadingPara.title}</h3>
                </div>
              </div>

              {/* Question vs Excerpt Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                    1. Câu hỏi trong đề thi (Exam Question):
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-blue-950 font-sans leading-relaxed">
                    "{currentReadingPara.questionText}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    2. Câu gốc trong bài đọc (Passage Excerpt):
                  </span>
                  <p className="text-xs sm:text-sm font-serif text-emerald-950 leading-relaxed">
                    "{currentReadingPara.passageExcerpt}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setShowReadingParaAnalysis(!showReadingParaAnalysis)}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{showReadingParaAnalysis ? 'Ẩn Phân Tích' : 'Khám Phá Các Cặp Từ Đồng Nghĩa'}</span>
                </button>
              </div>

              {/* Synonymous Pairs Table */}
              {showReadingParaAnalysis && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                      Bảng Đối Sánh Paraphrase (Synonym Mapping Table):
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentReadingPara.pairs.map((pair, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-600 font-sans">{pair.questionWord}</span>
                          <span className="text-slate-400 font-bold">↔</span>
                          <span className="font-bold text-emerald-600 font-serif">{pair.passageWord}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                          👉 Nghĩa: {pair.meaning}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    💡 <strong>Bí kíp Reading Band 8+:</strong> Khi làm bài thi thật, hãy gạch chân các cụm từ này để xác định vị trí đáp án thay vì đi tìm từ khóa y hệt!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* READING ROOM: 3. MATCHING HEADINGS TRAP-BREAKER              */}
          {/* ============================================================ */}
          {activeRoom === 'reading' && activeTab === 'reading-headings' && currentHeadings && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
                    {currentHeadings.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentHeadings.title}</h3>
                </div>
              </div>

              {/* Paragraph Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Đoạn văn cần đặt tiêu đề (Paragraph):
                </span>
                <p className="text-sm font-serif leading-relaxed text-slate-800">
                  {currentHeadings.paragraph}
                </p>
              </div>

              {/* Headings List Choice */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Chọn Tiêu Đề phù hợp nhất cho đoạn văn trên:
                </label>
                {currentHeadings.headings.map((h, idx) => {
                  const isSelected = userHeadingChoice === idx;
                  let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';
                  
                  if (showHeadingsResult) {
                    if (h.isCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30';
                    } else if (isSelected && !h.isCorrect) {
                      cardStyle = 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/30';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20';
                  }

                  return (
                    <div
                      key={h.id || idx}
                      onClick={() => !showHeadingsResult && setUserHeadingChoice(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            {h.text}
                          </p>
                          {showHeadingsResult && (
                            <div className="text-xs pt-1.5 border-t border-slate-200/60 space-y-1">
                              <span className={`font-bold ${h.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {h.isCorrect ? '✓ TIÊU ĐỀ ĐÚNG:' : `⚠️ ${h.type}:`}
                              </span>
                              <p className="text-slate-600 text-[11px] leading-relaxed">
                                {h.analysis}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserHeadingChoice(null);
                    setShowHeadingsResult(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại câu này</span>
                </button>

                <button
                  onClick={() => {
                    if (userHeadingChoice === null) {
                      alert('Vui lòng chọn một Tiêu đề trước khi kiểm tra.');
                      return;
                    }
                    setShowHeadingsResult(true);
                  }}
                  disabled={userHeadingChoice === null}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra & Phân Tích Bẫy Tiêu Đề
                </button>
              </div>

              {/* Topic Sentence Highlight */}
              {showHeadingsResult && currentHeadings.topicSentence && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <strong>Câu chủ đề cốt lõi (Topic Sentence):</strong>
                  <p className="italic font-serif">"{currentHeadings.topicSentence}"</p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* GENERAL ROOM: 1. CONTEXTUAL VOCABULARY DECRYPTION            */}
          {/* ============================================================ */}
          {activeRoom === 'general' && activeTab === 'context-vocab' && currentVocab && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                    {currentVocab.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentVocab.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Câu chứa từ mới:
                </span>
                <p className="text-sm sm:text-base font-serif leading-relaxed text-slate-800">
                  {currentVocab.sentence.split(currentVocab.targetWord).map((seg, i, arr) => (
                    <React.Fragment key={i}>
                      <span>{seg}</span>
                      {i < arr.length - 1 && (
                        <span className="bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-300 font-sans mx-1">
                          {currentVocab.targetWord}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
                <div className="text-xs text-amber-800 pt-1">
                  💡 <strong>Gợi ý loại manh mối:</strong> {currentVocab.clueType}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Dựa vào ngữ cảnh, từ "{currentVocab.targetWord}" có nghĩa là gì?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentVocab.options.map((opt, idx) => {
                    const isSelected = userVocabChoice === idx;
                    let style = 'border-slate-200 bg-white hover:border-slate-300';
                    if (showVocabResult) {
                      if (opt.isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                      else if (isSelected) style = 'border-rose-500 bg-rose-50 text-rose-950';
                    } else if (isSelected) {
                      style = 'border-amber-500 bg-amber-50 text-amber-900 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !showVocabResult && setUserVocabChoice(idx)}
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start space-x-2 ${style}`}
                      >
                        <span className="font-bold opacity-60">{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setUserVocabChoice(null);
                    setShowVocabResult(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại câu này</span>
                </button>

                <button
                  onClick={() => {
                    if (userVocabChoice === null) {
                      alert('Vui lòng chọn 1 đáp án.');
                      return;
                    }
                    setShowVocabResult(true);
                  }}
                  disabled={userVocabChoice === null}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Nghĩa & Manh Mối
                </button>
              </div>

              {showVocabResult && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-200">
                  <h4 className="font-bold text-slate-800">Giải thích phương pháp luận đoán:</h4>
                  <p className="text-slate-600 leading-relaxed">{currentVocab.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* GENERAL ROOM: 2. SENTENCE CHUNKING (S-V-O)                   */}
          {/* ============================================================ */}
          {activeRoom === 'general' && activeTab === 'sentence-chunking' && currentChunk && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                    {currentChunk.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentChunk.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Câu học thuật phức dài (40+ từ):
                </span>
                <p className="text-sm sm:text-base font-serif leading-relaxed text-slate-900">
                  "{currentChunk.fullSentence}"
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowChunkAnalysis(!showChunkAnalysis)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>{showChunkAnalysis ? 'Ẩn Giải Phẫu' : 'Giải Phẫu Cấu Trúc Xương Sống (S-V-O)'}</span>
                </button>
              </div>

              {showChunkAnalysis && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                      <span className="text-xs font-bold text-blue-800 block">1. Chủ ngữ chính (Core Subject):</span>
                      <p className="text-xs font-semibold text-blue-950 font-serif">
                        {currentChunk.subject}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-xs font-bold text-emerald-800 block">2. Vị ngữ nòng cốt (Core Verb):</span>
                      <p className="text-xs font-semibold text-emerald-950 font-serif">
                        {currentChunk.coreVerb}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                      <span className="text-xs font-bold text-purple-800 block">3. Tân ngữ / Kết quả (Object / Result):</span>
                      <p className="text-xs font-semibold text-purple-950 font-serif">
                        {currentChunk.objectResult}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
                      <span className="text-xs font-bold text-slate-700 block">4. Thành phần phụ (Modifiers):</span>
                      <p className="text-xs text-slate-600 italic">
                        {currentChunk.subModifier}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    💡 <strong>Bài học cốt lõi:</strong> {currentChunk.takeawayVietnamese}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* GENERAL ROOM: 3. COLLOCATIONS MATCHING                       */}
          {/* ============================================================ */}
          {activeRoom === 'general' && activeTab === 'collocation' && currentColloc && (
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án & Nghĩa
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* WRITING ROOM: 1. FILL IN BLANKS                              */}
          {/* ============================================================ */}
          {activeRoom === 'writing' && activeTab === 'fill-blanks' && currentFill && (
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

          {/* ============================================================ */}
          {/* WRITING ROOM: 2. TRUE / FALSE DATA ACCURACY                  */}
          {/* ============================================================ */}
          {activeRoom === 'writing' && activeTab === 'true-false' && currentTf && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                    {currentTf.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentTf.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-mono">
                📊 <strong>Dữ liệu cho trước:</strong> {currentTf.context}
              </div>

              <div className="space-y-3">
                {currentTf.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {idx + 1}. {q.statement}
                      </p>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => setUserTfAnswers({ ...userTfAnswers, [q.id]: true })}
                          disabled={showTfResults}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                            userTfAnswers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          TRUE
                        </button>
                        <button
                          onClick={() => setUserTfAnswers({ ...userTfAnswers, [q.id]: false })}
                          disabled={showTfResults}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                            userTfAnswers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          FALSE
                        </button>
                      </div>
                    </div>

                    {showTfResults && (
                      <div className={`p-2.5 rounded-lg text-xs ${
                        userTfAnswers[q.id] === q.isTrue ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}>
                        <span className="font-bold">
                          {q.isTrue ? '✓ Đúng (TRUE):' : '✕ Sai (FALSE):'}
                        </span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

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
                  Kiểm Tra Đáp Án
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* WRITING ROOM: 3. PARAPHRASE EVALUATOR                        */}
          {/* ============================================================ */}
          {activeRoom === 'writing' && activeTab === 'paraphrase' && currentPara && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
                    {currentPara.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{currentPara.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                  Mục tiêu: {currentPara.targetBand}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                <span className="text-[11px] font-bold text-purple-700 block">Câu gốc (Band 5.5 - 6.0):</span>
                <p className="text-sm font-semibold text-purple-950 font-serif">
                  "{currentPara.originalSentence}"
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">💡 Gợi ý nâng cấp:</span>
                <div className="flex flex-wrap gap-2">
                  {currentPara.hints.map((h, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Câu bạn viết lại (Band 7.5+):</label>
                <textarea
                  rows={3}
                  value={candidateParaText}
                  onChange={(e) => setCandidateParaText(e.target.value)}
                  placeholder="Nhập câu paraphrase của bạn..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setCandidateParaText('');
                    setParaEvaluation(null);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Viết lại từ đầu</span>
                </button>

                <button
                  onClick={handleEvaluateParaphrase}
                  disabled={isEvaluatingPara || !candidateParaText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
                >
                  {isEvaluatingPara ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Đang Chấm Câu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Chấm Điểm Câu Bằng AI</span>
                    </>
                  )}
                </button>
              </div>

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
                        Phương án viết lại Band 8.5+ gợi ý:
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

          {/* ============================================================ */}
          {/* WRITING ROOM: 4. ERROR SPOTTING                              */}
          {/* ============================================================ */}
          {activeRoom === 'writing' && activeTab === 'error-spotting' && currentError && (
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

          {/* ============================================================ */}
          {/* ROADMAP ROOM: LISTENING                                      */}
          {/* ============================================================ */}
          {activeRoom === 'listening' && (
            <div className="space-y-6 py-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white space-y-4 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-purple-300 shadow-sm">
                  <Headphones className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-400/30">
                    Đang Nghiên Cứu & Phát Triển
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-2">
                    Phòng Luyện Chuyên Listening (Listening Micro-Lab)
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto mt-1">
                    Trang bị các bài tập phản xạ âm thanh siêu tốc nhằm trị dứt điểm các bẫy nghe phổ biến nhất trong bài thi Cambridge IELTS.
                  </p>
                </div>
              </div>

              {/* Feature Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Bẫy Đổi Ý Người Nói</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Luyện phản xạ nhận diện các cấu trúc lật kèo của người nói như <em>"Actually, wait...", "No, on second thought...", "I used to, but now..."</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    🔢
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Chép Chính Tả Số & Tên</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tốc ký số điện thoại, giá tiền, mã bưu điện, và đánh vần tên riêng nước ngoài theo tốc độ nói tự nhiên của người bản xứ.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    📻
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Nhận Diện Nối & Nuốt Âm</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Luyện nghe các hiện tượng âm thanh thực tế: Connected Speech, Weak forms, Flap T và Elision trong các bài độc thoại Section 4.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ROADMAP ROOM: SPEAKING                                       */}
          {/* ============================================================ */}
          {activeRoom === 'speaking' && (
            <div className="space-y-6 py-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white space-y-4 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-emerald-300 shadow-sm">
                  <Mic className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
                    Đang Nghiên Cứu & Phát Triển
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-2">
                    Phòng Luyện Chuyên Speaking (Speaking Fluency Studio)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto mt-1">
                    Rèn phản xạ mở rộng ý tưởng tức thì (Instant Idea Generation) và duy trì sự trôi chảy tự nhiên không ngập ngừng.
                  </p>
                </div>
              </div>

              {/* Feature Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ⏱️
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Công Thức Mở Rộng A.R.E.A</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Luyện trả lời câu hỏi Part 1 chuẩn cấu trúc: <strong>Answer</strong> (Trả lời trực diện) $\rightarrow$ <strong>Reason</strong> (Lý do) $\rightarrow$ <strong>Example</strong> (Ví dụ thực tế) $\rightarrow$ <strong>Alternative</strong> (Góc nhìn đối chiếu).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    💬
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Từ Đệm & Phản Xạ Tự Nhiên</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sử dụng các cụm diễn đạt tự nhiên (Natural Fillers) như <em>"Well, to be perfectly honest...", "If my memory serves me correctly..."</em> để mua thời gian suy nghĩ mà không bị mất điểm Fluency.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    🎙️
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Phản Biện Sâu Part 3</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Rèn luyện kỹ năng phân tích 2 mặt của một vấn đề xã hội (pros vs cons, short-term vs long-term impact) để đạt tiêu chí tư duy trừu tượng Band 7.5+.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
