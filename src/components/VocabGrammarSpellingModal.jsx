import React, { useState, useEffect, useMemo } from 'react';
import {
  SpellCheck2,
  BookOpen,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  PlusCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Bookmark,
  Check,
  Zap,
  Lightbulb,
  X,
  Filter,
  Layers
} from 'lucide-react';
import {
  IELTS_SPELLING_TRAPS,
  IELTS_GRAMMAR_PACK,
  IELTS_THEMATIC_VOCAB_DECKS
} from '../data/vocabGrammarSpellingData';
import {
  generateSpellingTrapAi,
  generateGrammarDrillAi,
  generateThematicVocabAi
} from '../services/geminiService';

export default function VocabGrammarSpellingModal({
  isOpen,
  onClose,
  apiKey,
  model,
  onSaveToNotebook
}) {
  if (!isOpen) return null;

  // Active Tab: 'spelling' | 'grammar' | 'vocab'
  const [activeTab, setActiveTab] = useState('spelling');

  // Band Filter: 'all' (Tất cả 5.5 - 7.5) | 'band-5.5' (Band 5.5 - 6.0) | 'band-6' (Band 6.0 - 6.5) | 'band-7' (Band 7.0 - 7.5)
  const [selectedBandTier, setSelectedBandTier] = useState('all');

  // ==========================================
  // TAB 1: SPELLING SPRINT STATE
  // ==========================================
  const [rawSpellingList, setRawSpellingList] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_spelling_traps_v2');
      if (saved) return [...IELTS_SPELLING_TRAPS, ...JSON.parse(saved)];
    } catch (e) {}
    return IELTS_SPELLING_TRAPS;
  });

  // Filtered spelling items by band tier
  const filteredSpellingList = useMemo(() => {
    if (selectedBandTier === 'band-5.5') {
      return rawSpellingList.filter(item => item.bandLevel === '5.5' || item.bandLevel === '6.0');
    }
    if (selectedBandTier === 'band-6') {
      return rawSpellingList.filter(item => item.bandLevel === '6.0' || item.bandLevel === '6.5');
    }
    if (selectedBandTier === 'band-7') {
      return rawSpellingList.filter(item => item.bandLevel === '7.0' || item.bandLevel === '7.5');
    }
    return rawSpellingList;
  }, [rawSpellingList, selectedBandTier]);

  const [currentSpellingIdx, setCurrentSpellingIdx] = useState(0);
  const [selectedSpellingChoice, setSelectedSpellingChoice] = useState(null);
  const [isSpellingChecked, setIsSpellingChecked] = useState(false);
  const [spellingScore, setSpellingScore] = useState({ correct: 0, total: 0 });
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Reset index when band filter changes
  useEffect(() => {
    setCurrentSpellingIdx(0);
  }, [selectedBandTier]);

  const currentTrap = filteredSpellingList[currentSpellingIdx] || filteredSpellingList[0];

  // Shuffle options whenever trap changes
  useEffect(() => {
    if (!currentTrap) return;
    const opts = [currentTrap.correct, ...currentTrap.distractors];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    setShuffledOptions(opts);
    setSelectedSpellingChoice(null);
    setIsSpellingChecked(false);
  }, [currentSpellingIdx, currentTrap]);

  const handleCheckSpelling = (option) => {
    if (isSpellingChecked || !currentTrap) return;
    setSelectedSpellingChoice(option);
    setIsSpellingChecked(true);
    const isCorrect = option === currentTrap.correct;
    setSpellingScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNextSpelling = () => {
    if (currentSpellingIdx < filteredSpellingList.length - 1) {
      setCurrentSpellingIdx(prev => prev + 1);
    } else {
      setCurrentSpellingIdx(0);
    }
  };

  // ==========================================
  // TAB 2: GRAMMAR LAB STATE
  // ==========================================
  const [rawGrammarList, setRawGrammarList] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_grammar_drills_v2');
      if (saved) return [...IELTS_GRAMMAR_PACK, ...JSON.parse(saved)];
    } catch (e) {}
    return IELTS_GRAMMAR_PACK;
  });

  const filteredGrammarList = useMemo(() => {
    if (selectedBandTier === 'band-5.5') {
      return rawGrammarList.filter(item => item.bandLevel === '5.5' || item.bandLevel === '6.0' || item.bandTarget?.includes('5.5'));
    }
    if (selectedBandTier === 'band-6') {
      return rawGrammarList.filter(item => item.bandLevel === '6.0' || item.bandLevel === '6.5' || item.bandTarget?.includes('6.'));
    }
    if (selectedBandTier === 'band-7') {
      return rawGrammarList.filter(item => item.bandLevel === '7.0' || item.bandLevel === '7.5' || item.bandTarget?.includes('7.'));
    }
    return rawGrammarList;
  }, [rawGrammarList, selectedBandTier]);

  const [currentGrammarIdx, setCurrentGrammarIdx] = useState(0);
  const [userGrammarInput, setUserGrammarInput] = useState('');
  const [showGrammarAnswer, setShowGrammarAnswer] = useState(false);

  useEffect(() => {
    setCurrentGrammarIdx(0);
  }, [selectedBandTier]);

  const currentGrammar = filteredGrammarList[currentGrammarIdx] || filteredGrammarList[0];

  useEffect(() => {
    setUserGrammarInput('');
    setShowGrammarAnswer(false);
  }, [currentGrammarIdx]);

  // ==========================================
  // TAB 3: ACTIVE RECALL FLASHCARDS STATE
  // ==========================================
  const [thematicDecks, setThematicDecks] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_thematic_decks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return IELTS_THEMATIC_VOCAB_DECKS;
  });

  const [activeDeckId, setActiveDeckId] = useState(thematicDecks[0]?.id || 'deck-tech');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  const currentDeck = thematicDecks.find(d => d.id === activeDeckId) || thematicDecks[0];

  // Filter cards by selected band tier
  const filteredCards = useMemo(() => {
    if (!currentDeck) return [];
    if (selectedBandTier === 'band-5.5') {
      return currentDeck.cards.filter(c => c.bandLevel === '5.5' || c.bandLevel === '6.0' || c.bandScore === '5.5' || c.bandScore === '6.0');
    }
    if (selectedBandTier === 'band-6') {
      return currentDeck.cards.filter(c => c.bandLevel === '6.0' || c.bandLevel === '6.5');
    }
    if (selectedBandTier === 'band-7') {
      return currentDeck.cards.filter(c => c.bandLevel === '7.0' || c.bandLevel === '7.5');
    }
    return currentDeck.cards;
  }, [currentDeck, selectedBandTier]);

  const currentCard = filteredCards[currentCardIdx] || filteredCards[0];

  useEffect(() => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
  }, [activeDeckId, selectedBandTier]);

  const handleUpdateMastery = (status) => {
    if (!currentCard) return;
    setThematicDecks(prev => {
      const updated = prev.map(deck => {
        if (deck.id !== activeDeckId) return deck;
        return {
          ...deck,
          cards: deck.cards.map(c => c.id === currentCard.id ? { ...c, mastery: status } : c)
        };
      });
      try {
        localStorage.setItem('ielts_custom_thematic_decks_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentCardIdx < filteredCards.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handleSaveToNotebook = (card) => {
    if (onSaveToNotebook && card) {
      onSaveToNotebook({
        id: `card-${Date.now()}`,
        phrase: card.term,
        meaningVi: card.meaningVi,
        example: card.example,
        topic: activeDeckId.replace('deck-', '')
      });
      setSavedSuccessMsg(`Đã lưu "${card.term}" vào Sổ tay từ vựng!`);
      setTimeout(() => setSavedSuccessMsg(''), 3000);
    }
  };

  // ==========================================
  // AI GENERATOR INTEGRATION (CALIBRATED TO BAND 6.0 - 7.5)
  // ==========================================
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const handleGenerateAiItem = async () => {
    if (!apiKey) {
      alert('Vui lòng vào Cài đặt (biểu tượng bánh răng) để cấu hình Gemini API Key trước!');
      return;
    }
    setIsAiGenerating(true);
    setAiMessage('Gemini đang tạo bài tập chuẩn trọng tâm theo dải điểm...');

    const targetBand = selectedBandTier === 'band-5.5'
      ? '5.5'
      : selectedBandTier === 'band-6'
        ? '6.5'
        : selectedBandTier === 'band-7'
          ? '7.5'
          : '6.0';

    try {
      if (activeTab === 'spelling') {
        const newTrap = await generateSpellingTrapAi({ apiKey, model, bandLevel: targetBand });
        const updated = [newTrap, ...rawSpellingList];
        setRawSpellingList(updated);
        setCurrentSpellingIdx(0);
        try {
          const customOnly = updated.filter(item => item.id.startsWith('ai-sp-'));
          localStorage.setItem('ielts_custom_spelling_traps_v2', JSON.stringify(customOnly));
        } catch (e) {}
        setAiMessage(`Đã tạo bẫy chính tả Band ${targetBand}: "${newTrap.correct}"!`);
      } else if (activeTab === 'grammar') {
        const types = targetBand === '5.5'
          ? ['Subject-Verb Agreement with Complex Subjects', 'Compound Sentences & Eliminating Comma Splices', 'Cause and Effect with Because / As a result']
          : targetBand.startsWith('6') 
            ? ['Concession with While/Although', 'Relative Clauses', 'Academic Passive Voice']
            : ['Participle Clause V-ing', 'Cleft Sentence', 'Not only Inversion', 'Nominalization'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const newGrammar = await generateGrammarDrillAi({ apiKey, model, grammarType: randomType, bandLevel: targetBand });
        const updated = [newGrammar, ...rawGrammarList];
        setRawGrammarList(updated);
        setCurrentGrammarIdx(0);
        try {
          const customOnly = updated.filter(item => item.id.startsWith('ai-gr-'));
          localStorage.setItem('ielts_custom_grammar_drills_v2', JSON.stringify(customOnly));
        } catch (e) {}
        setAiMessage(`Đã tạo bài tập ngữ pháp Band ${targetBand}: "${newGrammar.title}"!`);
      } else if (activeTab === 'vocab') {
        const topicNames = ['Technology & Digital Life', 'Environment & Climate', 'Society & Urban Life'];
        const currentDeckName = currentDeck ? currentDeck.topicName : topicNames[0];
        const newCards = await generateThematicVocabAi({ apiKey, model, topic: currentDeckName, bandLevel: targetBand });
        
        setThematicDecks(prev => {
          const updated = prev.map(deck => {
            if (deck.id === activeDeckId) {
              return { ...deck, cards: [...newCards, ...deck.cards] };
            }
            return deck;
          });
          try {
            localStorage.setItem('ielts_custom_thematic_decks_v2', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        setCurrentCardIdx(0);
        setIsFlipped(false);
        setAiMessage(`Đã nạp ${newCards.length} thẻ từ vựng thực chiến Band ${targetBand}!`);
      }
      setTimeout(() => setAiMessage(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Lỗi khi gọi Gemini AI sinh nội dung.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">Luyện Từ Vựng, Ngữ Pháp & Chính Tả</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  Trọng Tâm Band 5.5 - 7.5+
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Phương pháp Active Recall, phân tầng rõ rệt: Band 5.5-6.0 (Nền tảng vững chắc), Band 6.0-6.5 (Cốt lõi) và Band 7.0-7.5 (Bứt phá)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* AI Generator Button */}
            <button
              onClick={handleGenerateAiItem}
              disabled={isAiGenerating}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="Nhờ Gemini tạo thêm bài tập thực chiến theo dải điểm đã chọn"
            >
              {isAiGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isAiGenerating ? 'Đang tạo...' : 'Gemini Sinh Đề Luyện'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BAND LEVEL FILTER BAR */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Phân Loại Trình Độ Luyện Tập:</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setSelectedBandTier('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedBandTier === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Toàn Bộ (5.5 - 7.5+)
            </button>
            <button
              onClick={() => setSelectedBandTier('band-5.5')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedBandTier === 'band-5.5'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📗 Band 5.5 - 6.0 (Nền tảng & Chống mất điểm)
            </button>
            <button
              onClick={() => setSelectedBandTier('band-6')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedBandTier === 'band-6'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📘 Band 6.0 - 6.5 (Cốt lõi chuẩn xác)
            </button>
            <button
              onClick={() => setSelectedBandTier('band-7')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedBandTier === 'band-7'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🚀 Band 7.0 - 7.5 (Bứt phá học thuật)
            </button>
          </div>
        </div>

        {/* AI Notification Banner */}
        {aiMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-900 flex items-center justify-between shrink-0">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{aiMessage}</span>
            </span>
          </div>
        )}

        {/* SUCCESS NOTIFICATION */}
        {savedSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-900 flex items-center space-x-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('spelling')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'spelling'
                ? 'border-red-600 text-red-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <SpellCheck2 className="w-4 h-4" />
            <span>Chính Tả Thần Tốc (Spelling Sprint)</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] bg-red-100 text-red-700 font-extrabold">
              {filteredSpellingList.length} bẫy
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'grammar'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Ngữ Pháp Band 6.0 - 7.5 (Grammar Lab)</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] bg-indigo-100 text-indigo-700 font-extrabold">
              {filteredGrammarList.length} cấu trúc
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'vocab'
                ? 'border-emerald-600 text-emerald-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thẻ Từ Vựng & Collocation (Active Recall)</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-700 font-extrabold">
              {filteredCards.length} thẻ
            </span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">

          {/* ========================================== */}
          {/* TAB 1: SPELLING SPRINT                     */}
          {/* ========================================== */}
          {activeTab === 'spelling' && currentTrap && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Score & Progress bar */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-lg text-red-700 font-black text-xs">
                    Bẫy {currentSpellingIdx + 1} / {filteredSpellingList.length}
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    Band {currentTrap.bandLevel || '6.5'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Chủ đề: <strong className="text-slate-800">{currentTrap.category}</strong>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                  <span>Điểm đúng:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                    {spellingScore.correct} / {spellingScore.total}
                  </span>
                  {spellingScore.total > 0 && (
                    <span className="text-slate-400">
                      ({Math.round((spellingScore.correct / spellingScore.total) * 100)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Challenge Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-center">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-3">
                    🔍 Bẫy chính tả thường gặp Band {currentTrap.bandLevel || '6.0 - 7.5'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    Chọn từ viết đúng chính tả vào chỗ trống:
                  </h3>
                </div>

                {/* Context Sentence */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-base sm:text-lg text-slate-700 font-serif leading-relaxed italic">
                  "{currentTrap.contextSentence}"
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {shuffledOptions.map((opt, idx) => {
                    let btnStyle = 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800';
                    if (isSpellingChecked) {
                      if (opt === currentTrap.correct) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/30';
                      } else if (opt === selectedSpellingChoice) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-900 line-through';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleCheckSpelling(opt)}
                        disabled={isSpellingChecked}
                        className={`p-4 rounded-xl border-2 text-base font-bold transition-all text-left flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="font-mono">{opt}</span>
                        {isSpellingChecked && opt === currentTrap.correct && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isSpellingChecked && opt === selectedSpellingChoice && opt !== currentTrap.correct && (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Mnemonic Rules */}
                {isSpellingChecked && (
                  <div className="pt-4 border-t border-slate-100 text-left space-y-4 animate-in fade-in">
                    <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                      selectedSpellingChoice === currentTrap.correct 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                        : 'bg-red-50/70 border-red-200 text-red-900'
                    }`}>
                      {selectedSpellingChoice === currentTrap.correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="text-sm">
                        <strong className="block font-bold">
                          {selectedSpellingChoice === currentTrap.correct ? 'Chính xác tuyệt đối!' : 'Rất tiếc, bạn đã mắc bẫy!'}
                        </strong>
                        <p className="mt-1">
                          Từ đúng là: <span className="font-mono font-black underline">{currentTrap.correct}</span>
                        </p>
                      </div>
                    </div>

                    {/* Mnemonic Rule Box */}
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2">
                      <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Mẹo nhớ nhanh không bị nhầm lẫn:</span>
                      </div>
                      <p className="font-medium">{currentTrap.rule}</p>
                      <p className="text-xs text-amber-700/90 pt-1 border-t border-amber-200/60">
                        <strong>Nguồn gốc & Giải thích:</strong> {currentTrap.explanation}
                      </p>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextSpelling}
                        className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                      >
                        <span>Câu tiếp theo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: GRAMMAR LAB (Band 6.0 - 7.5)        */}
          {/* ========================================== */}
          {activeTab === 'grammar' && currentGrammar && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Pattern Selector Carousel */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => setCurrentGrammarIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentGrammarIdx === 0}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                    Cấu trúc {currentGrammarIdx + 1} / {filteredGrammarList.length} • {currentGrammar.bandTarget}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">{currentGrammar.title}</h3>
                </div>

                <button
                  onClick={() => setCurrentGrammarIdx(prev => Math.min(filteredGrammarList.length - 1, prev + 1))}
                  disabled={currentGrammarIdx === filteredGrammarList.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grammar Formula & Rationale */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Công thức chuẩn {currentGrammar.bandTarget}
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">
                    ⭐ Đảm bảo tiêu chí Grammatical Range & Accuracy
                  </span>
                </div>
                
                <div className="p-4 rounded-xl bg-white/10 border border-white/15 font-mono text-sm sm:text-base text-amber-200 font-bold">
                  {currentGrammar.formula}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong>💡 Lợi ích chấm điểm:</strong> {currentGrammar.rationale}
                </p>
              </div>

              {/* Comparison: Band 5.5-6.0 vs Band 6.5-7.5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">
                    Câu văn Band 5.5 - 6.0 (Đơn điệu / Rời rạc)
                  </span>
                  <p className="text-sm text-slate-700 italic">
                    "{currentGrammar.basicSentence}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Nâng cấp {currentGrammar.bandTarget} (Mạch lạc & Chuẩn xác)
                  </span>
                  <p className="text-sm font-semibold text-emerald-950">
                    "{currentGrammar.band8Sentence}"
                  </p>
                </div>
              </div>

              {/* Interactive Upgrade Drill */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                    Thực hành Nâng Cấp Câu
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{currentGrammar.prompt}</h4>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 font-serif">
                  "{currentGrammar.testInput}"
                </div>

                <textarea
                  value={userGrammarInput}
                  onChange={(e) => setUserGrammarInput(e.target.value)}
                  placeholder="Gõ câu viết lại của bạn vào đây để tự kiểm tra..."
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium resize-none"
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setShowGrammarAnswer(prev => !prev)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{showGrammarAnswer ? 'Ẩn đáp án gợi ý' : 'Xem đáp án mẫu'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentGrammarIdx < filteredGrammarList.length - 1) {
                        setCurrentGrammarIdx(prev => prev + 1);
                      } else {
                        setCurrentGrammarIdx(0);
                      }
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                  >
                    <span>Cấu trúc tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {showGrammarAnswer && (
                  <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2 text-xs sm:text-sm animate-in fade-in">
                    <strong className="text-indigo-950 font-bold block">✨ Đáp án chuẩn {currentGrammar.bandTarget}:</strong>
                    <p className="font-serif font-semibold text-indigo-900 italic">
                      "{currentGrammar.modelAnswer}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: THEMATIC VOCAB & COLLOCATION CARDS */}
          {/* ========================================== */}
          {activeTab === 'vocab' && currentDeck && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Topic Selector Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {thematicDecks.map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => setActiveDeckId(deck.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      deck.id === activeDeckId
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {deck.topicName.split('(')[0]}
                    <span className="ml-1.5 opacity-70">
                      ({deck.cards.filter(c => selectedBandTier === 'band-6' ? (c.bandLevel === '6.0' || c.bandLevel === '6.5') : selectedBandTier === 'band-7' ? (c.bandLevel === '7.0' || c.bandLevel === '7.5') : true).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Flashcard Component (Click to flip) */}
              {currentCard ? (
                <div className="space-y-4">
                  {/* Card Navigation and Progress */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                    <span>Thẻ {currentCardIdx + 1} / {filteredCards.length}</span>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md font-extrabold bg-blue-100 text-blue-800">
                        Band {currentCard.bandScore || currentCard.bandLevel || '6.5'}
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {currentCard.mastery === 'mastered' ? '✅ Thuần thục' : currentCard.mastery === 'reviewed' ? '🟡 Đang nhớ' : '⚪ Cần luyện'}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Flip Card */}
                  <div 
                    onClick={() => setIsFlipped(prev => !prev)}
                    className="cursor-pointer min-h-[320px] rounded-3xl p-8 border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative group select-none overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 group-hover:text-slate-600 flex items-center space-x-1">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Bấm để lật về thuật ngữ' : 'Bấm để lật xem nghĩa & ví dụ'}</span>
                    </div>

                    {!isFlipped ? (
                      /* Front Side */
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-auto">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Band {currentCard.bandScore || currentCard.bandLevel || '6.5'} • {currentCard.wordType}
                        </span>
                        
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                          {currentCard.term}
                        </h3>

                        <p className="font-mono text-sm sm:text-base text-slate-500">
                          {currentCard.phonetic}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          {currentCard.collocations?.map((col, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                              + {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Back Side */
                      <div className="flex-1 flex flex-col justify-center space-y-4 my-auto animate-in fade-in">
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                            Định nghĩa tiếng Việt
                          </span>
                          <p className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                            {currentCard.meaningVi}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800 block">
                            Ví dụ thực tế trong bài thi IELTS Writing:
                          </span>
                          <p className="text-sm font-serif italic leading-relaxed">
                            "{currentCard.example}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bottom action hint inside card */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Mẹo: Tự nhớ nghĩa trong đầu trước khi lật thẻ</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToNotebook(currentCard);
                        }}
                        className="flex items-center space-x-1 font-bold text-emerald-600 hover:text-emerald-800"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Lưu vào Sổ tay</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Recall Buttons (Spaced Repetition Feedback) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentCardIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentCardIdx === 0}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCurrentCardIdx(prev => Math.min(filteredCards.length - 1, prev + 1))}
                        disabled={currentCardIdx === filteredCards.length - 1}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleUpdateMastery('learning')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all active:scale-95"
                      >
                        Chưa nhớ
                      </button>
                      <button
                        onClick={() => handleUpdateMastery('reviewed')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all active:scale-95"
                      >
                        Tạm nhớ
                      </button>
                      <button
                        onClick={() => handleUpdateMastery('mastered')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all active:scale-95"
                      >
                        Đã thuộc lòng
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">Chưa có thẻ từ vựng nào trong phân tầng này</h4>
                  <p className="text-xs text-slate-500">
                    Hãy bấm nút <strong className="text-emerald-600">+ AI Sinh Bài Mới</strong> phía trên để Gemini tự động bổ sung thẻ từ vựng chuẩn Band mục tiêu cho bạn!
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
