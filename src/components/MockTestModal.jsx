import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  BarChart2, 
  X,
  Sparkles,
  Award,
  BookOpen,
  Shuffle,
  Play,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { countWords } from '../utils/textAnalytics';
import { evaluateEssay } from '../services/geminiService';
import ChartRenderer from './ChartRenderer';
import ProcessMapRenderer from './ProcessMapRenderer';
import { INITIAL_READING_TESTS } from '../data/readingTasks';
import { createRandomFullTest, extractPassageBank } from '../utils/readingTestAssembler';

export default function MockTestModal({
  isOpen,
  onClose,
  allTasks = [],
  onSaveMockResult,
  apiKey,
  model,
  activeSkill = 'writing',
  onStartReadingMockExam,
  currentUser
}) {
  if (!isOpen) return null;

  // Active Tab: 'writing' | 'reading'
  const [activeMockTab, setActiveMockTab] = useState(() => {
    return activeSkill === 'reading' ? 'reading' : 'writing';
  });

  // ----------------------------------------------------
  // WRITING MOCK STATE
  // ----------------------------------------------------
  const task1List = allTasks.filter(t => t.taskNumber === 1);
  const task2List = allTasks.filter(t => t.taskNumber === 2);

  const [t1Id, setT1Id] = useState(task1List[0]?.id || '');
  const [t2Id, setT2Id] = useState(task2List[0]?.id || '');
  const [isTestStarted, setIsTestStarted] = useState(false);

  // Essays
  const [t1Text, setT1Text] = useState('');
  const [t2Text, setT2Text] = useState('');
  const [activeTaskTab, setActiveTaskTab] = useState(1); // 1 or 2

  // 60-minute continuous timer (3600 seconds)
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isGrading, setIsGrading] = useState(false);
  const [mockReport, setMockReport] = useState(null);

  const currentTask1 = allTasks.find(t => t.id === t1Id) || task1List[0];
  const currentTask2 = allTasks.find(t => t.id === t2Id) || task2List[0];

  const t1Words = countWords(t1Text);
  const t2Words = countWords(t2Text);

  // ----------------------------------------------------
  // READING MOCK STATE
  // ----------------------------------------------------
  const [allReadingTests, setAllReadingTests] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_reading_custom_tests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...INITIAL_READING_TESTS, ...parsed];
        }
      }
    } catch (e) {}
    return INITIAL_READING_TESTS;
  });

  // Filter 3-passage tests for Reading full mock
  const availableFullReadingTests = useMemo(() => {
    return allReadingTests.filter(t => (t.passages?.length || 1) >= 3);
  }, [allReadingTests]);

  const [selectedReadingTestId, setSelectedReadingTestId] = useState(() => {
    return availableFullReadingTests[0]?.id || allReadingTests[0]?.id;
  });

  const [isCreatingRandomReading, setIsCreatingRandomReading] = useState(false);

  // Writing Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTestStarted && timeRemaining > 0 && !mockReport) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmitWriting();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestStarted, timeRemaining, mockReport]);

  const handleStartWritingMock = () => {
    setIsTestStarted(true);
    setTimeRemaining(3600);
    setMockReport(null);
  };

  const handleAutoSubmitWriting = async () => {
    if (!apiKey) {
      alert('Vui lòng cấu hình Gemini API Key trước.');
      return;
    }

    setIsGrading(true);
    try {
      // Evaluate Task 1
      const eval1 = await evaluateEssay({
        task: currentTask1,
        essayText: t1Text || 'No text submitted for Task 1.',
        apiKey,
        model
      });

      // Evaluate Task 2
      const eval2 = await evaluateEssay({
        task: currentTask2,
        essayText: t2Text || 'No text submitted for Task 2.',
        apiKey,
        model
      });

      const b1 = eval1.overallBand || 5.0;
      const b2 = eval2.overallBand || 5.0;

      // Official IELTS Weighted Formula: (Task 1 + Task 2 * 2) / 3
      const rawCombined = (b1 + b2 * 2) / 3;
      // Standard IELTS Rounding
      const decimal = rawCombined - Math.floor(rawCombined);
      let roundedCombined = Math.floor(rawCombined);
      if (decimal >= 0.75) roundedCombined += 1.0;
      else if (decimal >= 0.25) roundedCombined += 0.5;

      const report = {
        date: new Date().toLocaleDateString('vi-VN'),
        t1Band: b1,
        t2Band: b2,
        finalOverall: roundedCombined,
        eval1,
        eval2,
        t1Words,
        t2Words
      };

      setMockReport(report);
      if (onSaveMockResult) onSaveMockResult(report);
    } catch (err) {
      alert('Lỗi khi chấm điểm bài thi thử.');
    } finally {
      setIsGrading(false);
    }
  };

  // Start Reading Mock Exam Handler
  const handleLaunchReadingMock = (testId) => {
    if (!testId) {
      alert('Vui lòng chọn một đề thi 3 Passages.');
      return;
    }
    if (onStartReadingMockExam) {
      onStartReadingMockExam(testId);
    }
    onClose();
  };

  // Create Random 3-Passage Reading Test and start immediately
  const handleRandomReadingExam = () => {
    setIsCreatingRandomReading(true);
    try {
      const fullTest = createRandomFullTest({
        allReadingTests,
        userEmail: currentUser?.email || 'Thành viên'
      });

      if (!fullTest) {
        alert('Chưa có đủ số lượng bài đọc trong ngân hàng đề để tạo Full Test 3 Passages.');
        return;
      }

      // Persist to custom tests
      const updated = [fullTest, ...allReadingTests];
      setAllReadingTests(updated);
      try {
        const customOnly = updated.filter(t => t.id.startsWith('custom-test-'));
        localStorage.setItem('ielts_reading_custom_tests', JSON.stringify(customOnly));
      } catch (e) {}

      // Launch exam
      handleLaunchReadingMock(fullTest.id);
    } catch (err) {
      alert('Lỗi khi tạo đề thi ngẫu nhiên: ' + err.message);
    } finally {
      setIsCreatingRandomReading(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-600/30 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">Phòng Thi Thử 60 Phút Áp Lực Cao (Mock Test Vault)</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase">
                  Áp Lực Phòng Thi
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Mô phỏng 100% quy trình thi thật: 60 phút liên tục chuẩn Cambridge cho cả Writing và Reading
              </span>
            </div>
          </div>

          {isTestStarted && !mockReport && (
            <div className="flex items-center space-x-2 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="font-mono text-base font-bold text-red-400">{formatTimer(timeRemaining)}</span>
            </div>
          )}

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level 1: Skill Switcher Tab (Writing vs Reading) - Only visible before test starts */}
        {!isTestStarted && (
          <div className="bg-slate-900/95 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider hidden sm:inline">
                Kỹ Năng Thi Thử:
              </span>
              
              <button
                onClick={() => setActiveMockTab('writing')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeMockTab === 'writing'
                    ? 'bg-red-600 text-white shadow-md ring-2 ring-red-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>✍️ Thi Thử IELTS Writing (Task 1 + Task 2)</span>
              </button>

              <button
                onClick={() => setActiveMockTab('reading')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeMockTab === 'reading'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>📖 Thi Thử IELTS Reading (Full 3 Passages - 40 Câu)</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-black">
                  MỚI
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* READING MOCK SETUP VIEW                                      */}
        {/* ============================================================ */}
        {!isTestStarted && activeMockTab === 'reading' && (
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Phòng Thi Thử IELTS Reading 60 Phút
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Bạn sẽ làm trọn vẹn <strong>3 Bài đọc học thuật (Passage 1, 2, 3)</strong> với đầy đủ <strong>40 câu hỏi</strong> trong đúng <strong>60 phút</strong>. Toàn bộ giải thích, manh mối và từ điển sẽ bị khóa để mô phỏng 100% áp lực phòng thi thật trên máy tính.
              </p>
            </div>

            {/* Exam Conditions Badges */}
            <div className="grid grid-cols-3 gap-3 w-full text-left">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Thời gian thi</span>
                <div className="flex items-center space-x-1.5 text-blue-600 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>60:00 Phút</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Quy mô đề</span>
                <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>3 Passages / 40 Câu</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Đánh giá</span>
                <div className="flex items-center space-x-1.5 text-amber-600 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>Band 1.0 - 9.0</span>
                </div>
              </div>
            </div>

            {/* Test Selection Form */}
            <div className="w-full text-left space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <label className="font-bold text-slate-800 text-xs">
                  Chọn Bộ Đề 3 Passages (40 câu) để thi:
                </label>
                <span className="text-slate-500 font-medium">
                  {availableFullReadingTests.length} bộ đề sẵn sàng
                </span>
              </div>

              {availableFullReadingTests.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedReadingTestId}
                    onChange={(e) => setSelectedReadingTestId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {availableFullReadingTests.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.passages?.length || 3} Passages - {t.totalQuestions || 40} câu)
                      </option>
                    ))}
                  </select>

                  <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
                    💡 Đề này bao gồm 3 bài đọc liên hoàn, câu hỏi được đánh số thứ tự từ 1 đến 40.
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <strong>Chưa có bộ đề 3 Passages sẵn:</strong>
                  <p>Hãy bấm nút "🎲 Bốc Đề Thi Thử Ngẫu Nhiên" bên dưới, hệ thống sẽ tự động ghép 3 bài đọc Passage 1, 2, 3 thành 1 bài thi hoàn chỉnh cho bạn.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={handleRandomReadingExam}
                disabled={isCreatingRandomReading}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                <Shuffle className="w-4 h-4" />
                <span>🎲 Bốc Đề Thi Ngẫu Nhiên (Random 3 Passages)</span>
              </button>

              <button
                onClick={() => handleLaunchReadingMock(selectedReadingTestId)}
                disabled={!selectedReadingTestId}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt Đầu Thi Đề Này (60:00)</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* WRITING MOCK SETUP VIEW                                      */}
        {/* ============================================================ */}
        {!isTestStarted && activeMockTab === 'writing' && (
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Phòng Thi Thử IELTS Writing 60 Phút
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn sẽ viết liên tục cả <strong>Task 1 (tối thiểu 150 từ)</strong> và <strong>Task 2 (tối thiểu 250 từ)</strong> trong vòng 60 phút. Toàn bộ tính năng hỗ trợ, từ điển và bài mẫu sẽ bị khóa để rèn bản lĩnh thi thật.
              </p>
            </div>

            {/* Task selector */}
            <div className="w-full text-left space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Đề Task 1 cho ca thi này:</label>
                <select 
                  value={t1Id} 
                  onChange={(e) => setT1Id(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  {task1List.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Đề Task 2 cho ca thi này:</label>
                <select 
                  value={t2Id} 
                  onChange={(e) => setT2Id(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  {task2List.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleStartWritingMock}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
            >
              BẮT ĐẦU TÍNH GIỜ WRITING 60 PHÚT
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* WRITING MOCK: VIEW 3: COMBINED MOCK REPORT                   */}
        {/* ============================================================ */}
        {isTestStarted && mockReport && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase font-semibold">Kết quả thi thử trọn gói 60 phút:</span>
                <h3 className="text-2xl font-bold flex items-center space-x-2">
                  <span>OVERALL WRITING:</span>
                  <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-extrabold text-xl">
                    BAND {mockReport.finalOverall.toFixed(1)}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Công thức trọng số Cambridge: (Task 1 × 1/3) + (Task 2 × 2/3)
                </p>
              </div>

              <div className="flex space-x-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="text-slate-400 block">Task 1 (Report)</span>
                  <strong className="text-base text-blue-400 font-bold">Band {mockReport.t1Band.toFixed(1)}</strong>
                  <span className="text-[10px] text-slate-400 block">{mockReport.t1Words} từ</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="text-slate-400 block">Task 2 (Essay)</span>
                  <strong className="text-base text-red-400 font-bold">Band {mockReport.t2Band.toFixed(1)}</strong>
                  <span className="text-[10px] text-slate-400 block">{mockReport.t2Words} từ</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Nhận xét Task 1:</h4>
                <p className="text-slate-600 leading-relaxed font-sans">{mockReport.eval1?.criteria?.tr?.feedback}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Nhận xét Task 2:</h4>
                <p className="text-slate-600 leading-relaxed font-sans">{mockReport.eval2?.criteria?.tr?.feedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* WRITING MOCK: VIEW 2: LIVE 60-MINUTE WORKSPACE               */}
        {/* ============================================================ */}
        {isTestStarted && !mockReport && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Task Switcher Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTaskTab(1)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                    activeTaskTab === 1 
                      ? 'bg-blue-600 text-white shadow-2xs' 
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Task 1 ({t1Words}/150 từ)</span>
                </button>

                <button
                  onClick={() => setActiveTaskTab(2)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                    activeTaskTab === 2 
                      ? 'bg-red-600 text-white shadow-2xs' 
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Task 2 ({t2Words}/250 từ)</span>
                </button>
              </div>

              <button
                onClick={handleAutoSubmitWriting}
                disabled={isGrading}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                {isGrading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isGrading ? 'Giám Khảo Đang Chấm...' : 'Nộp Bài Thi Thử'}</span>
              </button>
            </div>

            {/* Split Screen Workspace for Current Active Task */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
              
              {/* Left Column: Prompt & Visuals */}
              <div className="p-5 overflow-y-auto space-y-4 bg-white">
                {activeTaskTab === 1 ? (
                  <>
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">IELTS Task 1</span>
                      <h3 className="font-bold text-base text-slate-900">{currentTask1.title}</h3>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{currentTask1.prompt}</p>
                    </div>
                    {currentTask1.chartData && <ChartRenderer chartData={currentTask1.chartData} />}
                    {(currentTask1.type === 'process' || currentTask1.type === 'map') && <ProcessMapRenderer task={currentTask1} />}
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold">IELTS Task 2</span>
                      <h3 className="font-bold text-base text-slate-900">{currentTask2.title}</h3>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{currentTask2.prompt}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Editor */}
              <div className="p-5 overflow-y-auto flex flex-col space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Số từ hiện tại: <strong>{activeTaskTab === 1 ? t1Words : t2Words} từ</strong></span>
                  <span>Tối thiểu: {activeTaskTab === 1 ? '150 từ' : '250 từ'}</span>
                </div>

                <textarea
                  value={activeTaskTab === 1 ? t1Text : t2Text}
                  onChange={(e) => activeTaskTab === 1 ? setT1Text(e.target.value) : setT2Text(e.target.value)}
                  placeholder={`Gõ bài viết cho Task ${activeTaskTab} tại đây...`}
                  className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-white text-sm font-sans leading-relaxed focus:outline-none resize-none min-h-[350px]"
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
