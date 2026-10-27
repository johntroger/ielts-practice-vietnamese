import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { recordAttempt, applySmartFilterAndSort } from '../services/ratingPopularityService';
import {
  IELTS_SPELLING_TRAPS,
  IELTS_GRAMMAR_PACK,
  IELTS_THEMATIC_VOCAB_DECKS,
  CAMBRIDGE_SYNONYM_PAIRS
} from '../data/vocabGrammarSpellingData';
import {
  fetchPublicVocabGrammarItems
} from '../services/dataSyncService';
import { useTranslation } from '../i18n';

// Modular Subcomponents (ForumFlash EdTech Architecture)
import VocabStudioHeader from './vocabStudio/VocabStudioHeader';
import VocabStudioSidebar from './vocabStudio/VocabStudioSidebar';
import SpellingDemonStage from './vocabStudio/SpellingDemonStage';
import GrammarArchitectureStage from './vocabStudio/GrammarArchitectureStage';
import ThematicVocabStage from './vocabStudio/ThematicVocabStage';
import CambridgeSynonymsStage from './vocabStudio/CambridgeSynonymsStage';

export default function VocabGrammarSpellingModal({
  isOpen,
  onClose,
  apiKey,
  model,
  onSaveToNotebook,
  currentUser,
  masteredIds = [],
  onToggleMastered,
  onOpenAuth
}) {
  const { t, isEn } = useTranslation();

  // Active Track: 'spelling' | 'grammar' | 'vocab' | 'synonyms'
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('ielts_vocab_studio_active_tab') || 'spelling';
    } catch (e) {
      return 'spelling';
    }
  });

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('ielts_vocab_studio_active_tab', tabId);
    } catch (e) {}
  };

  // Fullscreen / Expanded Workspace Mode (Alt+Z)
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      return localStorage.getItem('ielts_vocab_grammar_expanded') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleExpanded = () => {
    setIsExpanded(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ielts_vocab_grammar_expanded', String(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleExpanded();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Mobile Sidebar Slide-over State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Band Filter: 'all' | 'band-5.5' | 'band-6' | 'band-7'
  const [selectedBandTier, setSelectedBandTier] = useState('all');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpellingCategory, setSelectedSpellingCategory] = useState('all');

  // Mastered Items Visibility Toggle
  const [hideMastered, setHideMastered] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_hide_mastered_vg');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const handleToggleHideMastered = (val) => {
    setHideMastered(val);
    try {
      localStorage.setItem('ielts_hide_mastered_vg', JSON.stringify(val));
    } catch (e) {}
  };

  // Gamification Streak Counter
  const [streak, setStreak] = useState(0);

  // Cloud Sync State
  const [isSyncing, setIsSyncing] = useState(false);

  // ==========================================
  // TRACK 1: SPELLING SPRINT STATE
  // ==========================================
  const [rawSpellingList, setRawSpellingList] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_spelling_traps_v2');
      if (saved) return [...IELTS_SPELLING_TRAPS, ...JSON.parse(saved)];
    } catch (e) {}
    return IELTS_SPELLING_TRAPS;
  });

  const filteredSpellingList = useMemo(() => {
    let list = rawSpellingList;
    if (selectedBandTier === 'band-5.5') {
      list = list.filter(item => item.bandLevel === '5.5' || item.bandLevel === '6.0');
    } else if (selectedBandTier === 'band-6') {
      list = list.filter(item => item.bandLevel === '6.0' || item.bandLevel === '6.5');
    } else if (selectedBandTier === 'band-7') {
      list = list.filter(item => item.bandLevel === '7.0' || item.bandLevel === '7.5');
    }

    if (selectedSpellingCategory !== 'all') {
      list = list.filter(item => item.category === selectedSpellingCategory);
    }

    return applySmartFilterAndSort(list, {
      searchQuery,
      masteredIds,
      hideMastered: hideMastered && currentUser
    });
  }, [rawSpellingList, selectedBandTier, selectedSpellingCategory, searchQuery, hideMastered, currentUser, masteredIds]);

  const [currentSpellingIdx, setCurrentSpellingIdx] = useState(0);

  useEffect(() => {
    setCurrentSpellingIdx(0);
  }, [selectedBandTier, selectedSpellingCategory, searchQuery]);

  // ==========================================
  // TRACK 2: GRAMMAR LAB STATE
  // ==========================================
  const [rawGrammarList, setRawGrammarList] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_grammar_drills_v2');
      if (saved) return [...IELTS_GRAMMAR_PACK, ...JSON.parse(saved)];
    } catch (e) {}
    return IELTS_GRAMMAR_PACK;
  });

  const filteredGrammarList = useMemo(() => {
    let list = rawGrammarList;
    if (selectedBandTier === 'band-5.5') {
      list = list.filter(item => item.bandLevel === '5.5' || item.bandLevel === '6.0' || item.bandTarget?.includes('5.5'));
    } else if (selectedBandTier === 'band-6') {
      list = list.filter(item => item.bandLevel === '6.0' || item.bandLevel === '6.5' || item.bandTarget?.includes('6.'));
    } else if (selectedBandTier === 'band-7') {
      list = list.filter(item => item.bandLevel === '7.0' || item.bandLevel === '7.5' || item.bandTarget?.includes('7.'));
    }
    return applySmartFilterAndSort(list, {
      searchQuery,
      masteredIds,
      hideMastered: hideMastered && currentUser
    });
  }, [rawGrammarList, selectedBandTier, searchQuery, hideMastered, currentUser, masteredIds]);

  const [currentGrammarIdx, setCurrentGrammarIdx] = useState(0);

  useEffect(() => {
    setCurrentGrammarIdx(0);
  }, [selectedBandTier, searchQuery]);

  // ==========================================
  // TRACK 3: THEMATIC VOCAB DECKS STATE
  // ==========================================
  const [thematicDecks, setThematicDecks] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_thematic_decks_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always ensure built-in decks (including 72 Harold Levine decks) are present
          const builtInIds = new Set(IELTS_THEMATIC_VOCAB_DECKS.map(d => d.id));
          const customDecks = parsed.filter(d => !builtInIds.has(d.id));
          return [...IELTS_THEMATIC_VOCAB_DECKS, ...customDecks];
        }
      }
    } catch (e) {}
    return IELTS_THEMATIC_VOCAB_DECKS;
  });

  // Self-healing: if thematicDecks lacks Harold Levine decks from an earlier cached session
  useEffect(() => {
    if (thematicDecks.length < IELTS_THEMATIC_VOCAB_DECKS.length) {
      const existingIds = new Set(thematicDecks.map(d => d.id));
      const missingDecks = IELTS_THEMATIC_VOCAB_DECKS.filter(d => !existingIds.has(d.id));
      if (missingDecks.length > 0) {
        setThematicDecks(prev => [...prev, ...missingDecks]);
      }
    }
  }, [thematicDecks.length]);

  const [activeDeckId, setActiveDeckId] = useState(thematicDecks[0]?.id || 'deck-tech');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);

  const currentDeck = thematicDecks.find(d => d.id === activeDeckId) || thematicDecks[0];

  const filteredCards = useMemo(() => {
    if (!currentDeck) return [];
    let cards = currentDeck.cards || [];
    if (selectedBandTier === 'band-5.5') {
      cards = cards.filter(c => c.bandLevel === '5.5' || c.bandLevel === '6.0' || c.bandScore === '5.5' || c.bandScore === '6.0');
    } else if (selectedBandTier === 'band-6') {
      cards = cards.filter(c => c.bandLevel === '6.0' || c.bandLevel === '6.5');
    } else if (selectedBandTier === 'band-7') {
      cards = cards.filter(c => c.bandLevel === '7.0' || c.bandLevel === '7.5');
    }
    return applySmartFilterAndSort(cards, {
      searchQuery,
      masteredIds,
      hideMastered: hideMastered && currentUser
    });
  }, [currentDeck, selectedBandTier, searchQuery, hideMastered, currentUser, masteredIds]);

  useEffect(() => {
    setCurrentCardIdx(0);
  }, [activeDeckId, selectedBandTier, searchQuery]);

  // ==========================================
  // TRACK 4: CAMBRIDGE SYNONYMS STATE
  // ==========================================
  const filteredSynonymsList = useMemo(() => {
    let list = CAMBRIDGE_SYNONYM_PAIRS || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(item =>
      item.questionStem?.toLowerCase().includes(q) ||
      item.passageMatch?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const [currentSynonymIdx, setCurrentSynonymIdx] = useState(0);

  useEffect(() => {
    setCurrentSynonymIdx(0);
  }, [searchQuery]);

  // Mastered Guard
  const handleToggleMasteredItem = (itemId) => {
    if (!currentUser) {
      alert(isEn ? 'The "Mastered" feature hides mastered items from practice. Please log in to save your progress!' : 'Tính năng "Đã thuộc" giúp ẩn bài tập đã thuần thục. Vui lòng đăng nhập để lưu tiến trình!');
      onOpenAuth?.();
      return;
    }
    onToggleMastered?.(itemId);
  };

  // Attempt & Streak handler
  const handleRecordAttempt = (itemId, isCorrect) => {
    if (itemId) recordAttempt(itemId);
    if (isCorrect) setStreak(prev => prev + 1);
    else setStreak(0);
  };

  // Cloud Sync
  const reloadFromCloud = useCallback(async () => {
    try {
      const cloudItems = await fetchPublicVocabGrammarItems();
      if (cloudItems && cloudItems.length > 0) {
        const cloudSpelling = cloudItems.filter(item => item.id?.startsWith('ai-sp-'));
        const cloudGrammar = cloudItems.filter(item => item.id?.startsWith('ai-gr-'));

        if (cloudSpelling.length > 0) {
          setRawSpellingList(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            cloudSpelling.forEach(item => map.set(item.id, { ...item, isPublic: true, isCommunity: true }));
            return Array.from(map.values());
          });
        }

        if (cloudGrammar.length > 0) {
          setRawGrammarList(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            cloudGrammar.forEach(item => map.set(item.id, { ...item, isPublic: true, isCommunity: true }));
            return Array.from(map.values());
          });
        }
      }
    } catch (err) {
      console.warn('Cloud reload notice:', err);
    }
  }, []);

  useEffect(() => {
    reloadFromCloud();
  }, [reloadFromCloud]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await reloadFromCloud();
      alert(isEn ? 'Sync completed successfully!' : 'Đồng bộ dữ liệu thành công!');
    } catch (e) {
      alert(isEn ? 'Sync completed.' : 'Đồng bộ hoàn tất.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Navigation handlers
  const handleNextItem = () => {
    if (activeTab === 'spelling') {
      setCurrentSpellingIdx(prev => (prev < filteredSpellingList.length - 1 ? prev + 1 : 0));
    } else if (activeTab === 'grammar') {
      setCurrentGrammarIdx(prev => (prev < filteredGrammarList.length - 1 ? prev + 1 : 0));
    } else if (activeTab === 'vocab') {
      setCurrentCardIdx(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0));
    } else if (activeTab === 'synonyms') {
      setCurrentSynonymIdx(prev => (prev < filteredSynonymsList.length - 1 ? prev + 1 : 0));
    }
  };

  const handlePrevItem = () => {
    if (activeTab === 'spelling') {
      setCurrentSpellingIdx(prev => Math.max(0, prev - 1));
    } else if (activeTab === 'grammar') {
      setCurrentGrammarIdx(prev => Math.max(0, prev - 1));
    } else if (activeTab === 'vocab') {
      setCurrentCardIdx(prev => Math.max(0, prev - 1));
    } else if (activeTab === 'synonyms') {
      setCurrentSynonymIdx(prev => Math.max(0, prev - 1));
    }
  };

  // Resolve active items list & current index for sidebar
  const currentSidebarData = useMemo(() => {
    if (activeTab === 'spelling') {
      return { items: filteredSpellingList, index: currentSpellingIdx, setIndex: setCurrentSpellingIdx };
    }
    if (activeTab === 'grammar') {
      return { items: filteredGrammarList, index: currentGrammarIdx, setIndex: setCurrentGrammarIdx };
    }
    if (activeTab === 'vocab') {
      return { items: filteredCards, index: currentCardIdx, setIndex: setCurrentCardIdx };
    }
    return { items: filteredSynonymsList, index: currentSynonymIdx, setIndex: setCurrentSynonymIdx };
  }, [activeTab, filteredSpellingList, currentSpellingIdx, filteredGrammarList, currentGrammarIdx, filteredCards, currentCardIdx, filteredSynonymsList, currentSynonymIdx]);

  const totalVocabCardsCount = useMemo(() => {
    return thematicDecks.reduce((sum, d) => sum + (d.cards?.length || 0), 0);
  }, [thematicDecks]);

  const totalAllStudioItems = useMemo(() => {
    return IELTS_SPELLING_TRAPS.length + IELTS_GRAMMAR_PACK.length + totalVocabCardsCount + CAMBRIDGE_SYNONYM_PAIRS.length;
  }, [totalVocabCardsCount]);

  const allMasteredCount = useMemo(() => {
    if (!Array.isArray(masteredIds)) return 0;
    return masteredIds.length;
  }, [masteredIds]);

  // Active Track Hero Info & Definitions
  const tracksCatalog = [
    {
      id: 'spelling',
      icon: '🎯',
      label: isEn ? 'Spelling Traps' : 'Bẫy chính tả',
      kicker: isEn ? '• 100 LISTENING SPELLING DEMONS' : '• LỘ TRÌNH 100 BẪY CHÍNH TẢ',
      title: isEn ? 'Listening Spelling Demons' : '100 Bẫy Chính Tả Listening',
      description: isEn
        ? 'High-frequency distractor traps, silent letters & double consonants in Cambridge Section 1 & 4.'
        : 'Khắc phục các lỗi sai chính tả kinh điển thường làm mất điểm oan trong Listening Section 1 & 4.'
    },
    {
      id: 'grammar',
      icon: '🏛️',
      label: isEn ? 'Grammar' : 'Ngữ pháp',
      kicker: isEn ? '• GRAMMAR ARCHITECTURE & SCAFFOLDING' : '• LỘ TRÌNH NGỮ PHÁP ĐIỂM TỰA',
      title: isEn ? 'Grammar Architecture' : 'Ngữ Pháp Điểm Tựa Band 7.5+',
      description: isEn
        ? 'Mathematical sentence formulas and inversions to push Grammatical Range & Accuracy in Writing Task 2.'
        : 'Công thức câu phức & đảo ngữ toán học giúp bứt phá tiêu chí GRA trong Writing Task 2.'
    },
    {
      id: 'vocab',
      icon: '📖',
      label: isEn ? 'Thematic Vocab' : 'Từ vựng chủ đề',
      kicker: isEn ? '• THEMATIC ACTIVE RECALL' : '• TỪ VỰNG THEMATIC & COLLOCATIONS',
      title: currentDeck?.topicName || (isEn ? 'Thematic Vocabulary' : 'Từ Vựng Theo Chủ Đề'),
      description: isEn
        ? 'Authentic C1/C2 collocations and 3D active recall flashcards across 25 IELTS topics.'
        : 'Thẻ ghi nhớ phản xạ 3D và cụm từ kết hợp điểm cao theo các chuyên đề IELTS then chốt.'
    },
    {
      id: 'synonyms',
      icon: '🔄',
      label: isEn ? 'Paraphrase' : 'Paraphrase',
      kicker: isEn ? '• CAMBRIDGE READING PARAPHRASE' : '• LỘ TRÌNH PARAPHRASE READING',
      title: isEn ? 'Cambridge Paraphrase Hunter' : '50 Cặp Paraphrase Cambridge',
      description: isEn
        ? 'Decode keyword disguise patterns used by Cambridge test makers in Academic Reading passages.'
        : 'Bí kíp bắt bẫy từ đồng nghĩa và định vị đoạn văn chứa đáp án trong bài thi IELTS Reading.'
    }
  ];

  const currentTrackInfo = tracksCatalog.find(t => t.id === activeTab) || tracksCatalog[0];

  if (!isOpen) return null;

  const currentSpellingItem = filteredSpellingList[currentSpellingIdx] || filteredSpellingList[0];
  const currentGrammarItem = filteredGrammarList[currentGrammarIdx] || filteredGrammarList[0];
  const currentVocabCard = filteredCards[currentCardIdx] || filteredCards[0];
  const currentSynonymPair = filteredSynonymsList[currentSynonymIdx] || filteredSynonymsList[0];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-200 ${
        isExpanded ? 'p-0 bg-slate-950' : 'p-1 sm:p-2 lg:p-4 bg-slate-900/60 backdrop-blur-xs'
      }`}
    >
      <div
        className={`bg-[#f7f5ef] shadow-2xl border border-[#d9e3e4] flex flex-col overflow-hidden overscroll-contain transition-all duration-200 ${
          isExpanded
            ? 'w-full h-[100dvh] max-w-none max-h-none rounded-none'
            : 'rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1550px] h-[96dvh] max-h-[96dvh]'
        }`}
      >
        {/* GLOBAL MINIMALIST HEADER */}
        <VocabStudioHeader
          isEn={isEn}
          t={t}
          isExpanded={isExpanded}
          onToggleExpanded={toggleExpanded}
          isSyncing={isSyncing}
          onManualSync={handleManualSync}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onClose={onClose}
          masteredCount={allMasteredCount}
          totalItems={totalAllStudioItems}
          streak={streak}
        />

        {/* 2-COLUMN BODY */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT SIDEBAR (ForumFlash .world-sidebar) */}
          <VocabStudioSidebar
            isEn={isEn}
            t={t}
            activeTab={activeTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            spellingCategories={[
              { id: 'all', label: isEn ? 'All' : 'Tất cả' },
              { id: 'Environment', label: isEn ? 'Environment' : 'Môi trường' },
              { id: 'Society & Law', label: isEn ? 'Society' : 'Xã hội' },
              { id: 'Academic Register', label: isEn ? 'Academic' : 'Học thuật' },
              { id: 'Task 1 Data', label: isEn ? 'Task 1 Data' : 'Số liệu T1' },
              { id: 'Task 1 & 2 Core', label: isEn ? 'Task 1 & 2 Core' : 'Trọng tâm' }
            ]}
            selectedSpellingCategory={selectedSpellingCategory}
            onSelectSpellingCategory={setSelectedSpellingCategory}
            vocabDecks={thematicDecks}
            selectedDeckId={activeDeckId}
            onSelectDeckId={setActiveDeckId}
            items={currentSidebarData.items}
            currentIndex={currentSidebarData.index}
            onSelectIndex={currentSidebarData.setIndex}
            masteredIds={masteredIds}
            hideMastered={hideMastered}
            onToggleHideMastered={handleToggleHideMastered}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* RIGHT WORKSPACE / HERO STAGE */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#f7f5ef]">
            {/* HERO HEADER & SEGMENTED TRACK SWITCHER (ForumFlash style!) */}
            <div className="px-4 sm:px-8 pt-5 pb-3.5 bg-[#f7f5ef] border-b border-[#e5e9ea] flex flex-wrap items-center justify-between gap-3.5 shrink-0">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#27c4b5]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#004646]">
                    {currentTrackInfo.kicker}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#004646] tracking-tight mt-0.5">
                  {currentTrackInfo.title}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                  {currentTrackInfo.description}
                </p>
              </div>

              {/* SEGMENTED TRACK SWITCHER (Pill buttons: [ Spelling | Grammar | Vocab | Paraphrase ]) */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-[#d9e3e4] shadow-2xs">
                {tracksCatalog.map(trk => {
                  const isActive = activeTab === trk.id;
                  return (
                    <button
                      key={trk.id}
                      type="button"
                      onClick={() => handleSelectTab(trk.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isActive
                          ? 'bg-[#004646] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{trk.icon}</span>
                      <span className="hidden md:inline">{trk.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STAGE CONTENT */}
            {activeTab === 'spelling' && (
              <SpellingDemonStage
                isEn={isEn}
                trap={currentSpellingItem}
                currentIndex={currentSpellingIdx}
                totalItems={filteredSpellingList.length}
                onPrev={handlePrevItem}
                onNext={handleNextItem}
                isMastered={currentSpellingItem ? masteredIds.includes(currentSpellingItem.id) : false}
                onToggleMastered={handleToggleMasteredItem}
                onSaveToNotebook={onSaveToNotebook}
                onRecordAttempt={handleRecordAttempt}
              />
            )}

            {activeTab === 'grammar' && (
              <GrammarArchitectureStage
                isEn={isEn}
                grammarItem={currentGrammarItem}
                currentIndex={currentGrammarIdx}
                totalItems={filteredGrammarList.length}
                onPrev={handlePrevItem}
                onNext={handleNextItem}
                isMastered={currentGrammarItem ? masteredIds.includes(currentGrammarItem.id) : false}
                onToggleMastered={handleToggleMasteredItem}
                onSaveToNotebook={onSaveToNotebook}
                onRecordAttempt={handleRecordAttempt}
              />
            )}

            {activeTab === 'vocab' && (
              <ThematicVocabStage
                isEn={isEn}
                deck={currentDeck}
                card={currentVocabCard}
                currentIndex={currentCardIdx}
                totalItems={filteredCards.length}
                onPrev={handlePrevItem}
                onNext={handleNextItem}
                isMastered={currentVocabCard ? masteredIds.includes(currentVocabCard.id) : false}
                onToggleMastered={handleToggleMasteredItem}
                onSaveToNotebook={onSaveToNotebook}
                onRecordAttempt={handleRecordAttempt}
              />
            )}

            {activeTab === 'synonyms' && (
              <CambridgeSynonymsStage
                isEn={isEn}
                pair={currentSynonymPair}
                allPairs={filteredSynonymsList}
                currentIndex={currentSynonymIdx}
                totalItems={filteredSynonymsList.length}
                onPrev={handlePrevItem}
                onNext={handleNextItem}
                onSelectIndex={setCurrentSynonymIdx}
                isMastered={currentSynonymPair ? masteredIds.includes(currentSynonymPair.id) : false}
                onToggleMastered={handleToggleMasteredItem}
                onSaveToNotebook={onSaveToNotebook}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
