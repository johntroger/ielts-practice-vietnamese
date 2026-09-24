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
  Layers,
  GraduationCap,
  Globe,
  Lock,
  RefreshCw,
  Search
} from 'lucide-react';
import StarRatingWidget from './common/StarRatingWidget';
import { recordAttempt, applySmartFilterAndSort } from '../services/ratingPopularityService';
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
import {
  fetchPublicVocabGrammarItems,
  savePublicVocabGrammarItem,
  deletePublicVocabGrammarItem
} from '../services/dataSyncService';

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
  // Active Tab: 'spelling' | 'grammar' | 'vocab'
  const [activeTab, setActiveTab] = useState('spelling');

  // Band Filter: 'all' (Tất cả 5.5 - 7.5) | 'band-5.5' (Band 5.5 - 6.0) | 'band-6' (Band 6.0 - 6.5) | 'band-7' (Band 7.0 - 7.5)
  const [selectedBandTier, setSelectedBandTier] = useState('all');

  // Sharing & Privacy State (Defaults to true: Public community resource)
  const [isAutoShare, setIsAutoShare] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_auto_share_ai_content');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

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

  const [isSyncing, setIsSyncing] = useState(false);

  // Smart Discovery, Rating & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [vgQuickFilter, setVgQuickFilter] = useState('all');
  const [vgSortBy, setVgSortBy] = useState('rating_desc');

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

  // Filtered spelling items by band tier, smart search, quick filter, sort & mastered status
  const filteredSpellingList = useMemo(() => {
    let list = rawSpellingList;
    if (selectedBandTier === 'band-5.5') {
      list = list.filter(item => item.bandLevel === '5.5' || item.bandLevel === '6.0');
    } else if (selectedBandTier === 'band-6') {
      list = list.filter(item => item.bandLevel === '6.0' || item.bandLevel === '6.5');
    } else if (selectedBandTier === 'band-7') {
      list = list.filter(item => item.bandLevel === '7.0' || item.bandLevel === '7.5');
    }
    return applySmartFilterAndSort(list, {
      searchQuery,
      quickFilter: vgQuickFilter,
      sortBy: vgSortBy,
      masteredIds,
      hideMastered: hideMastered && currentUser
    });
  }, [rawSpellingList, selectedBandTier, searchQuery, vgQuickFilter, vgSortBy, hideMastered, currentUser, masteredIds]);

  const totalMasteredSpelling = useMemo(() => {
    if (!currentUser || !Array.isArray(masteredIds)) return 0;
    return rawSpellingList.filter(item => masteredIds.includes(item.id)).length;
  }, [rawSpellingList, currentUser, masteredIds]);

  const [currentSpellingIdx, setCurrentSpellingIdx] = useState(0);
  const [selectedSpellingChoice, setSelectedSpellingChoice] = useState(null);
  const [isSpellingChecked, setIsSpellingChecked] = useState(false);
  const [spellingScore, setSpellingScore] = useState({ correct: 0, total: 0 });
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Reset index when band filter changes or tab changes
  useEffect(() => {
    setCurrentSpellingIdx(0);
  }, [selectedBandTier, searchQuery, vgQuickFilter, vgSortBy]);

  const currentTrap = filteredSpellingList[currentSpellingIdx] || filteredSpellingList[0];

  // Shuffle options whenever trap changes
  useEffect(() => {
    if (!currentTrap) return;
    const opts = [currentTrap.correct, ...(currentTrap.distractors || [])];
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
    if (currentTrap?.id) {
      recordAttempt(currentTrap.id);
    }
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
      quickFilter: vgQuickFilter,
      sortBy: vgSortBy,
      masteredIds,
      hideMastered: hideMastered && currentUser
    });
  }, [rawGrammarList, selectedBandTier, searchQuery, vgQuickFilter, vgSortBy, hideMastered, currentUser, masteredIds]);

  const totalMasteredGrammar = useMemo(() => {
    if (!currentUser || !Array.isArray(masteredIds)) return 0;
    return rawGrammarList.filter(item => masteredIds.includes(item.id)).length;
  }, [rawGrammarList, currentUser, masteredIds]);

  const [currentGrammarIdx, setCurrentGrammarIdx] = useState(0);
  const [userGrammarInput, setUserGrammarInput] = useState('');
  const [showGrammarAnswer, setShowGrammarAnswer] = useState(false);

  useEffect(() => {
    setCurrentGrammarIdx(0);
  }, [selectedBandTier, searchQuery, vgQuickFilter, vgSortBy]);

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

  // Filter cards by selected band tier, search query, quick filter, sort & mastered status
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
      quickFilter: vgQuickFilter,
      sortBy: vgSortBy,
      masteredIds,
      hideMastered: hideMastered && currentUser
    });
  }, [currentDeck, selectedBandTier, searchQuery, vgQuickFilter, vgSortBy, hideMastered, currentUser, masteredIds]);

  const totalMasteredVocab = useMemo(() => {
    if (!currentUser || !Array.isArray(masteredIds) || !currentDeck) return 0;
    return (currentDeck.cards || []).filter(c => masteredIds.includes(c.id)).length;
  }, [currentDeck, currentUser, masteredIds]);

  const currentCard = filteredCards[currentCardIdx] || filteredCards[0];

  useEffect(() => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
  }, [activeDeckId, selectedBandTier, searchQuery, vgQuickFilter, vgSortBy]);

  // Mastered button handler with login guard
  const handleToggleMasteredItem = (itemId) => {
    if (!currentUser) {
      alert('Tính năng "Đã thuộc" giúp ẩn bài tập đã thuần thục khỏi danh sách luyện tập. Vui lòng đăng nhập để lưu tiến trình!');
      onOpenAuth?.();
      return;
    }
    onToggleMastered?.(itemId);
  };

  const handleUpdateMastery = (status) => {
    if (!currentCard) return;
    if (currentCard?.id) {
      recordAttempt(currentCard.id);
    }
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

    // If marked as 'mastered', automatically add to user's masteredIds if logged in
    if (status === 'mastered' && currentUser && !masteredIds.includes(currentCard.id)) {
      onToggleMastered?.(currentCard.id);
    }

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
  // SUPABASE CLOUD & REALTIME SYNC (Like Micro Drills)
  // ==========================================
  const reloadFromCloud = React.useCallback(async () => {
    try {
      const cloudItems = await fetchPublicVocabGrammarItems();
      if (cloudItems && cloudItems.length > 0) {
        const cloudSpelling = cloudItems.filter(item => item.id?.startsWith('ai-sp-'));
        const cloudGrammar = cloudItems.filter(item => item.id?.startsWith('ai-gr-'));
        const cloudCards = cloudItems.filter(item => item.id?.startsWith('ai-card-'));

        if (cloudSpelling.length > 0) {
          setRawSpellingList(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            cloudSpelling.forEach(item => map.set(item.id, { ...item, isPublic: true, isCommunity: true }));
            const merged = Array.from(map.values());
            try {
              const customOnly = merged.filter(item => item.id?.startsWith('ai-sp-'));
              localStorage.setItem('ielts_custom_spelling_traps_v2', JSON.stringify(customOnly));
            } catch (e) {}
            return merged;
          });
        }

        if (cloudGrammar.length > 0) {
          setRawGrammarList(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            cloudGrammar.forEach(item => map.set(item.id, { ...item, isPublic: true, isCommunity: true }));
            const merged = Array.from(map.values());
            try {
              const customOnly = merged.filter(item => item.id?.startsWith('ai-gr-'));
              localStorage.setItem('ielts_custom_grammar_drills_v2', JSON.stringify(customOnly));
            } catch (e) {}
            return merged;
          });
        }

        if (cloudCards.length > 0) {
          setThematicDecks(prev => {
            const updated = prev.map(deck => {
              const deckCards = [...deck.cards];
              const cardMap = new Map();
              deckCards.forEach(c => cardMap.set(c.id, c));
              cloudCards.forEach(card => {
                if (card.deckId === deck.id || (!card.deckId && deck.id === 'deck-tech')) {
                  cardMap.set(card.id, { ...card, isPublic: true, isCommunity: true });
                }
              });
              return { ...deck, cards: Array.from(cardMap.values()) };
            });
            try {
              localStorage.setItem('ielts_custom_thematic_decks_v2', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      }
    } catch (err) {
      console.warn('Cloud reload notice for vocab/grammar:', err);
    }
  }, []);

  // BroadcastChannel for instant cross-tab sync
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
        bc.onmessage = (event) => {
          const { type, item, itemId, nextPub, category } = event.data || {};
          if (type === 'NEW_ITEM' && item) {
            if (category === 'spelling') {
              setRawSpellingList(prev => prev.some(x => x.id === item.id) ? prev : [item, ...prev]);
            } else if (category === 'grammar') {
              setRawGrammarList(prev => prev.some(x => x.id === item.id) ? prev : [item, ...prev]);
            } else if (category === 'vocab') {
              setThematicDecks(prev => prev.map(d => (d.id === (item.deckId || d.id)) ? { ...d, cards: [item, ...d.cards.filter(c => c.id !== item.id)] } : d));
            }
          } else if (type === 'TOGGLE_PUBLIC' && itemId) {
            setRawSpellingList(prev => prev.map(x => x.id === itemId ? { ...x, isPublic: nextPub, isCommunity: nextPub } : x));
            setRawGrammarList(prev => prev.map(x => x.id === itemId ? { ...x, isPublic: nextPub, isCommunity: nextPub } : x));
            setThematicDecks(prev => prev.map(d => ({ ...d, cards: d.cards.map(c => c.id === itemId ? { ...c, isPublic: nextPub, isCommunity: nextPub } : c) })));
          } else if (type === 'SYNC_ALL') {
            reloadFromCloud();
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
    return () => {
      if (bc) bc.close();
    };
  }, [reloadFromCloud]);

  // Sync with Cloud on mount, auto-migrate, heartbeat polling, window focus
  useEffect(() => {
    reloadFromCloud();

    try {
      const savedSp = JSON.parse(localStorage.getItem('ielts_custom_spelling_traps_v2') || '[]');
      const savedGr = JSON.parse(localStorage.getItem('ielts_custom_grammar_drills_v2') || '[]');
      savedSp.forEach(item => {
        if (item.id && item.id.startsWith('ai-sp-')) {
          savePublicVocabGrammarItem({ ...item, isPublic: true, isCommunity: true });
        }
      });
      savedGr.forEach(item => {
        if (item.id && item.id.startsWith('ai-gr-')) {
          savePublicVocabGrammarItem({ ...item, isPublic: true, isCommunity: true });
        }
      });
    } catch (e) {}

    const handleFocus = () => reloadFromCloud();
    window.addEventListener('focus', handleFocus);
    const pollInterval = setInterval(() => reloadFromCloud(), 4000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, [reloadFromCloud]);

  // Manual 1-click Cloud Sync Handler
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await reloadFromCloud();
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
          bc.postMessage({ type: 'SYNC_ALL' });
          bc.close();
        }
      } catch (e) {}
      alert('Đồng bộ thành công! Toàn bộ bẫy chính tả, ngữ pháp và thẻ từ vựng đã được cập nhật từ Cloud.');
    } catch (e) {
      alert('Đồng bộ hoàn tất.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Publicity for AI generated items
  const handleToggleItemPublicity = (itemId, itemType) => {
    if (itemType === 'spelling') {
      setRawSpellingList(prev => {
        const target = prev.find(x => x.id === itemId);
        const nextPub = target ? !target.isPublic : true;
        const updated = prev.map(x => x.id === itemId ? { ...x, isPublic: nextPub, isCommunity: nextPub } : x);
        try {
          const customOnly = updated.filter(x => x.id?.startsWith('ai-sp-'));
          localStorage.setItem('ielts_custom_spelling_traps_v2', JSON.stringify(customOnly));
        } catch (e) {}
        if (target) {
          if (nextPub) savePublicVocabGrammarItem({ ...target, isPublic: true, isCommunity: true });
          else deletePublicVocabGrammarItem(itemId);
        }
        try {
          if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
            bc.postMessage({ type: 'TOGGLE_PUBLIC', itemId, nextPub, category: 'spelling' });
            bc.close();
          }
        } catch (e) {}
        return updated;
      });
    } else if (itemType === 'grammar') {
      setRawGrammarList(prev => {
        const target = prev.find(x => x.id === itemId);
        const nextPub = target ? !target.isPublic : true;
        const updated = prev.map(x => x.id === itemId ? { ...x, isPublic: nextPub, isCommunity: nextPub } : x);
        try {
          const customOnly = updated.filter(x => x.id?.startsWith('ai-gr-'));
          localStorage.setItem('ielts_custom_grammar_drills_v2', JSON.stringify(customOnly));
        } catch (e) {}
        if (target) {
          if (nextPub) savePublicVocabGrammarItem({ ...target, isPublic: true, isCommunity: true });
          else deletePublicVocabGrammarItem(itemId);
        }
        try {
          if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
            bc.postMessage({ type: 'TOGGLE_PUBLIC', itemId, nextPub, category: 'grammar' });
            bc.close();
          }
        } catch (e) {}
        return updated;
      });
    } else if (itemType === 'vocab') {
      setThematicDecks(prev => {
        let target = null;
        const updated = prev.map(d => ({
          ...d,
          cards: d.cards.map(c => {
            if (c.id === itemId) {
              const nextPub = !c.isPublic;
              target = { ...c, isPublic: nextPub, isCommunity: nextPub, deckId: d.id };
              return target;
            }
            return c;
          })
        }));
        try {
          localStorage.setItem('ielts_custom_thematic_decks_v2', JSON.stringify(updated));
        } catch (e) {}
        if (target) {
          if (target.isPublic) savePublicVocabGrammarItem(target);
          else deletePublicVocabGrammarItem(itemId);
          try {
            if ('BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
              bc.postMessage({ type: 'TOGGLE_PUBLIC', itemId, nextPub: target.isPublic, category: 'vocab' });
              bc.close();
            }
          } catch (e) {}
        }
        return updated;
      });
    }
  };

  // ==========================================
  // AI GENERATOR INTEGRATION (CALIBRATED TO BAND 5.5 - 7.5)
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

    const isPub = Boolean(isAutoShare);
    const creatorLabel = isPub ? (currentUser?.email ? `${currentUser.email.split('@')[0]} (Thành viên)` : 'Cộng Đồng IELTS') : 'Tôi';

    try {
      if (activeTab === 'spelling') {
        const rawTrap = await generateSpellingTrapAi({ apiKey, model, bandLevel: targetBand });
        const newTrap = {
          ...rawTrap,
          isPublic: isPub,
          isCommunity: isPub,
          isAiGenerated: true,
          creatorEmail: creatorLabel
        };
        const updated = [newTrap, ...rawSpellingList];
        setRawSpellingList(updated);
        setCurrentSpellingIdx(0);
        try {
          const customOnly = updated.filter(item => item.id?.startsWith('ai-sp-'));
          localStorage.setItem('ielts_custom_spelling_traps_v2', JSON.stringify(customOnly));
          if (isPub) {
            savePublicVocabGrammarItem(newTrap);
            if ('BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
              bc.postMessage({ type: 'NEW_ITEM', item: newTrap, category: 'spelling' });
              bc.close();
            }
          }
        } catch (e) {}
        setAiMessage(`Đã tạo bẫy chính tả Band ${targetBand}: "${newTrap.correct}"!`);
      } else if (activeTab === 'grammar') {
        const types = targetBand === '5.5'
          ? ['Subject-Verb Agreement with Complex Subjects', 'Compound Sentences & Eliminating Comma Splices', 'Cause and Effect with Because / As a result']
          : targetBand.startsWith('6') 
            ? ['Concession with While/Although', 'Relative Clauses', 'Academic Passive Voice']
            : ['Participle Clause V-ing', 'Cleft Sentence', 'Not only Inversion', 'Nominalization'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const rawGrammar = await generateGrammarDrillAi({ apiKey, model, grammarType: randomType, bandLevel: targetBand });
        const newGrammar = {
          ...rawGrammar,
          isPublic: isPub,
          isCommunity: isPub,
          isAiGenerated: true,
          creatorEmail: creatorLabel
        };
        const updated = [newGrammar, ...rawGrammarList];
        setRawGrammarList(updated);
        setCurrentGrammarIdx(0);
        try {
          const customOnly = updated.filter(item => item.id?.startsWith('ai-gr-'));
          localStorage.setItem('ielts_custom_grammar_drills_v2', JSON.stringify(customOnly));
          if (isPub) {
            savePublicVocabGrammarItem(newGrammar);
            if ('BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
              bc.postMessage({ type: 'NEW_ITEM', item: newGrammar, category: 'grammar' });
              bc.close();
            }
          }
        } catch (e) {}
        setAiMessage(`Đã tạo bài tập ngữ pháp Band ${targetBand}: "${newGrammar.title}"!`);
      } else if (activeTab === 'vocab') {
        const topicNames = ['Technology & Digital Life', 'Environment & Climate', 'Society & Urban Life'];
        const currentDeckName = currentDeck ? currentDeck.topicName : topicNames[0];
        const rawCards = await generateThematicVocabAi({ apiKey, model, topic: currentDeckName, bandLevel: targetBand });
        const enrichedCards = rawCards.map(c => ({
          ...c,
          deckId: activeDeckId,
          isPublic: isPub,
          isCommunity: isPub,
          isAiGenerated: true,
          creatorEmail: creatorLabel
        }));

        setThematicDecks(prev => {
          const updated = prev.map(deck => {
            if (deck.id === activeDeckId) {
              return { ...deck, cards: [...enrichedCards, ...deck.cards] };
            }
            return deck;
          });
          try {
            localStorage.setItem('ielts_custom_thematic_decks_v2', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });

        if (isPub) {
          enrichedCards.forEach(c => savePublicVocabGrammarItem(c));
          try {
            if ('BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_vocab_grammar_realtime');
              enrichedCards.forEach(c => bc.postMessage({ type: 'NEW_ITEM', item: c, category: 'vocab' }));
              bc.close();
            }
          } catch (e) {}
        }
        setCurrentCardIdx(0);
        setIsFlipped(false);
        setAiMessage(`Đã nạp ${enrichedCards.length} thẻ từ vựng thực chiến Band ${targetBand}!`);
      }
      setTimeout(() => setAiMessage(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Lỗi khi gọi Gemini AI sinh nội dung.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  /**
   * Universal scalable question navigation toolbar
   * Designed to scale gracefully from 1 to 200+ questions:
   * - Explicit numbering: "Câu: X / Y"
   * - Numbered pill buttons (1, 2, 3...) with indicator dot for "Đã thuộc" items
   * - Previous & Next buttons (<, >)
   * - Quick Jump Select Dropdown for direct access when items > 8
   * - Mastered button & Community publicity badge for current item
   * - Hide Mastered Checkbox
   */
  const renderScalableNavToolbar = ({
    type,
    list = [],
    currentIndex = 0,
    onSelectIndex,
    themeColor = 'red',
    totalMastered = 0,
    currentItem,
    getItemTitle = (item, idx) => `Câu ${idx + 1}`
  }) => {
    const total = list.length;
    if (total === 0) return null;

    const activeBgColor = themeColor === 'red' 
      ? 'bg-red-600 ring-red-500/30' 
      : themeColor === 'indigo' 
        ? 'bg-indigo-600 ring-indigo-500/30' 
        : 'bg-emerald-600 ring-emerald-500/30';
    const textAccentColor = themeColor === 'red' ? 'text-red-600' : themeColor === 'indigo' ? 'text-indigo-600' : 'text-emerald-600';
    const bgLightColor = themeColor === 'red' 
      ? 'bg-red-50 text-red-800 border-red-200' 
      : themeColor === 'indigo' 
        ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
        : 'bg-emerald-50 text-emerald-800 border-emerald-200';

    return (
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        {/* TOP ROW: Progress, Quick Jump, Hide Mastered & Current Item Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center flex-wrap gap-2">
            {/* Step Counter */}
            <div className={`px-3 py-1 rounded-lg border font-black text-xs flex items-center space-x-1 ${bgLightColor}`}>
              <span>Câu:</span>
              <span className={`text-sm font-extrabold ${textAccentColor}`}>{currentIndex + 1}</span>
              <span className="opacity-60 font-semibold">/ {total}</span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => onSelectIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition cursor-pointer shadow-2xs"
                title="Câu trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelectIndex(Math.min(total - 1, currentIndex + 1))}
                disabled={currentIndex === total - 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition cursor-pointer shadow-2xs"
                title="Câu tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Select Dropdown for Scalability (When total > 8) */}
            {total > 8 && (
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-500 font-semibold hidden md:inline">Chuyển nhanh:</span>
                <select
                  value={currentIndex}
                  onChange={(e) => onSelectIndex(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-2xs max-w-[200px] sm:max-w-[260px] truncate cursor-pointer"
                >
                  {list.map((item, idx) => {
                    const isM = masteredIds.includes(item.id);
                    return (
                      <option key={item.id || idx} value={idx}>
                        Câu {idx + 1}: {getItemTitle(item, idx)} {isM ? ' [Đã thuộc ✓]' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Hide Mastered Checkbox */}
            {currentUser && totalMastered > 0 && (
              <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={hideMastered}
                  onChange={(e) => handleToggleHideMastered(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="font-semibold text-emerald-800 text-[11px]">Ẩn câu đã thuộc ({totalMastered})</span>
              </label>
            )}
          </div>

          {/* Current Item Badges & Mastered Action */}
          {currentItem && (
            <div className="flex items-center flex-wrap gap-2">
              {/* Interactive 5-Star Rating & Real Attempts Count */}
              <StarRatingWidget
                itemId={currentItem.id}
                size="xs"
                showAttempts={true}
              />

              {/* Mastered / Đã Thuộc Button */}
              <button
                type="button"
                onClick={() => handleToggleMasteredItem(currentItem.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 transition-all cursor-pointer shadow-2xs ${
                  masteredIds.includes(currentItem.id)
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                }`}
                title={masteredIds.includes(currentItem.id)
                  ? "Câu này đã thuộc. Bấm để bỏ đánh dấu (Ôn tập lại)"
                  : "Đánh dấu 'Đã thuộc'"}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>{masteredIds.includes(currentItem.id) ? 'Đã thuộc' : 'Thuộc câu này'}</span>
              </button>

              {/* Community / Private Badge */}
              {currentItem.isCommunity || currentItem.isPublic ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  <span>🌐 Cộng Đồng</span>
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-300 flex items-center gap-1 shadow-2xs">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>🔒 Riêng tư</span>
                </span>
              )}

              {currentItem.isAiGenerated && (
                <button
                  type="button"
                  onClick={() => handleToggleItemPublicity(currentItem.id, type)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                  title={currentItem.isPublic ? 'Khóa riêng' : 'Mở chia sẻ bài tập này cho mọi người'}
                >
                  {currentItem.isPublic ? 'Khóa riêng' : 'Mở chia sẻ'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM ROW: Numbered Pill Buttons (1, 2, 3...) with horizontal scroll and indicator */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-300">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">Danh sách câu:</span>
          {list.map((item, idx) => {
            const isActive = currentIndex === idx;
            const isMastered = masteredIds.includes(item.id);
            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`relative min-w-[32px] h-8 px-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                  isActive
                    ? `${activeBgColor} text-white shadow-xs ring-2 scale-105 z-10`
                    : isMastered
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
                title={`Câu ${idx + 1}: ${getItemTitle(item, idx)}${isMastered ? ' (Đã thuộc)' : ''}`}
              >
                <span>{idx + 1}</span>
                {/* Dot indicator for Mastered items */}
                {isMastered && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Safe early return placed AFTER ALL HOOKS
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 lg:p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[98vw] 2xl:max-w-[1600px] h-[96dvh] max-h-[96dvh] flex flex-col overflow-hidden overscroll-contain">
        
        {/* MODAL HEADER */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">Luyện Từ Vựng, Ngữ Pháp & Chính Tả</h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  Band 5.5 - 7.5+
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden md:block">
                Active Recall, bẫy chính tả & công thức ngữ pháp độc quyền chuẩn Cambridge IELTS
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Auto Share Toggle */}
            <label className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-300 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg border border-white/10 cursor-pointer transition">
              <input
                type="checkbox"
                checked={isAutoShare}
                onChange={(e) => {
                  setIsAutoShare(e.target.checked);
                  try {
                    localStorage.setItem('ielts_auto_share_ai_content', JSON.stringify(e.target.checked));
                  } catch (err) {}
                }}
                className="rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
              />
              <span className="font-semibold text-white text-[11px]">Chia sẻ cộng đồng</span>
            </label>

            {/* Cloud Sync Button */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer shadow-2xs"
              title="Đồng bộ tức thời với Supabase Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : 'text-slate-300'}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Đang sync...' : 'Đồng bộ'}</span>
            </button>

            {/* AI Generator Button */}
            <button
              onClick={handleGenerateAiItem}
              disabled={isAiGenerating}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Nhờ Gemini tạo thêm bài tập thực chiến theo dải điểm đã chọn"
            >
              {isAiGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isAiGenerating ? 'Đang tạo...' : 'Gemini Sinh Bài Luyện'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BAND LEVEL & SMART FILTER BAR */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Trình độ:</span>
            </div>

            <div className="flex items-center space-x-1 bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setSelectedBandTier('all')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBandTier === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Toàn Bộ
              </button>
              <button
                type="button"
                onClick={() => setSelectedBandTier('band-5.5')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBandTier === 'band-5.5'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                📗 5.5 - 6.0
              </button>
              <button
                type="button"
                onClick={() => setSelectedBandTier('band-6')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBandTier === 'band-6'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                📘 6.0 - 6.5
              </button>
              <button
                type="button"
                onClick={() => setSelectedBandTier('band-7')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBandTier === 'band-7'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                🚀 7.0 - 7.5
              </button>
            </div>
          </div>

          {/* Instant Search & Quick Sort Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Instant Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ vựng, bẫy, ngữ pháp..."
                className="pl-8 pr-7 py-1 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-44 sm:w-56 font-medium text-slate-800 shadow-2xs placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center space-x-1 bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setVgQuickFilter('all')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  vgQuickFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setVgQuickFilter('top_rated')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  vgQuickFilter === 'top_rated' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Đánh giá từ 4.8★ trở lên"
              >
                ⭐ 4.8★+
              </button>
              <button
                type="button"
                onClick={() => setVgQuickFilter('trending')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  vgQuickFilter === 'trending' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Nhiều lượt luyện tập nhất"
              >
                🔥 Hot
              </button>
            </div>

            {/* Sort Select */}
            <select
              value={vgSortBy}
              onChange={(e) => setVgSortBy(e.target.value)}
              className="px-2 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-2xs cursor-pointer"
            >
              <option value="rating_desc">⭐ Rating cao nhất</option>
              <option value="attempts_desc">🔥 Luyện nhiều nhất</option>
              <option value="difficulty_desc">💎 Độ khó cao</option>
              <option value="difficulty_asc">🌱 Độ khó cơ bản</option>
              <option value="title_asc">🔤 Tên A-Z</option>
            </select>
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('spelling')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">

          {/* ========================================== */}
          {/* TAB 1: SPELLING SPRINT                     */}
          {/* ========================================== */}
          {activeTab === 'spelling' && (
            <div className="max-w-3xl mx-auto space-y-5">
              
              {/* Scalable Navigation Toolbar */}
              {renderScalableNavToolbar({
                type: 'spelling',
                list: filteredSpellingList,
                currentIndex: currentSpellingIdx,
                onSelectIndex: (idx) => {
                  setCurrentSpellingIdx(idx);
                  setSelectedSpellingChoice(null);
                  setIsSpellingChecked(false);
                },
                themeColor: 'red',
                totalMastered: totalMasteredSpelling,
                currentItem: currentTrap,
                getItemTitle: (item, idx) => item.correct ? `${item.correct} (Band ${item.bandLevel || '6.5'})` : `Bẫy chính tả ${idx + 1}`
              })}

              {/* Category & Score Bar */}
              {currentTrap && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs font-bold text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-semibold">Chủ đề:</span>
                    <span className="text-slate-800 font-extrabold">{currentTrap.category || 'Academic English'}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-100 text-blue-800">
                      Band {currentTrap.bandLevel || '6.5'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Điểm đúng:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                      {spellingScore.correct} / {spellingScore.total}
                    </span>
                    {spellingScore.total > 0 && (
                      <span className="text-slate-400 font-semibold">
                        ({Math.round((spellingScore.correct / spellingScore.total) * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Congratulatory Empty State when all are mastered */}
              {filteredSpellingList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-900 text-base">
                    Tuyệt vời! Bạn đã đánh dấu "Đã thuộc" toàn bộ {totalMasteredSpelling} bẫy chính tả trong dải điểm này.
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Các từ đã thuộc được tự động ẩn khỏi danh sách luyện tập để bạn tập trung vào từ mới. Lịch sử và thống kê của bạn luôn được bảo toàn đầy đủ.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleToggleHideMastered(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hiện lại tất cả từ đã thuộc để ôn tập</span>
                  </button>
                </div>
              ) : currentTrap ? (
                /* Challenge Card */
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
                          className={`p-4 rounded-xl border-2 text-base font-bold transition-all text-left flex items-center justify-between cursor-pointer ${btnStyle}`}
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
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => handleToggleMasteredItem(currentTrap.id)}
                          className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition cursor-pointer"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>{masteredIds.includes(currentTrap.id) ? 'Bỏ thuộc từ này' : 'Đánh dấu đã thuộc từ này'}</span>
                        </button>

                        <button
                          onClick={handleNextSpelling}
                          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <span>Câu tiếp theo</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: GRAMMAR LAB (Band 6.0 - 7.5)        */}
          {/* ========================================== */}
          {activeTab === 'grammar' && (
            <div className="max-w-4xl mx-auto space-y-5">
              
              {/* Scalable Navigation Toolbar */}
              {renderScalableNavToolbar({
                type: 'grammar',
                list: filteredGrammarList,
                currentIndex: currentGrammarIdx,
                onSelectIndex: (idx) => {
                  setCurrentGrammarIdx(idx);
                  setUserGrammarInput('');
                  setShowGrammarAnswer(false);
                },
                themeColor: 'indigo',
                totalMastered: totalMasteredGrammar,
                currentItem: currentGrammar,
                getItemTitle: (item, idx) => item.title ? `${item.title} (${item.bandTarget || `Band ${item.bandLevel}`})` : `Cấu trúc ${idx + 1}`
              })}

              {/* Congratulatory Empty State when all are mastered */}
              {filteredGrammarList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-900 text-base">
                    Tuyệt vời! Bạn đã đánh dấu "Đã thuộc" toàn bộ {totalMasteredGrammar} cấu trúc ngữ pháp trong dải điểm này.
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Các cấu trúc đã thuộc được tự động ẩn khỏi danh sách luyện tập để tập trung vào kiến thức mới.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleToggleHideMastered(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hiện lại tất cả cấu trúc đã thuộc để ôn tập</span>
                  </button>
                </div>
              ) : currentGrammar ? (
                <>
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
                        onClick={() => {
                          setShowGrammarAnswer(prev => {
                            if (!prev && currentGrammar?.id) {
                              recordAttempt(currentGrammar.id);
                            }
                            return !prev;
                          });
                        }}
                        className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
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
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
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
                </>
              ) : null}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: THEMATIC VOCAB & COLLOCATION CARDS */}
          {/* ========================================== */}
          {activeTab === 'vocab' && currentDeck && (
            <div className="max-w-3xl mx-auto space-y-5">
              
              {/* Topic Selector Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
                {thematicDecks.map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => setActiveDeckId(deck.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

              {/* Congratulatory Empty State when all are mastered */}
              {filteredCards.length === 0 ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-900 text-base">
                    Tuyệt vời! Bạn đã đánh dấu "Đã thuộc" toàn bộ {totalMasteredVocab} thẻ từ vựng trong chủ đề này.
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Các thẻ đã thuộc được tự động ẩn khỏi danh sách luyện tập để bạn tập trung vào từ mới.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleToggleHideMastered(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hiện lại tất cả thẻ đã thuộc để ôn tập</span>
                  </button>
                </div>
              ) : currentCard ? (
                <div className="space-y-4">
                  {/* Scalable Navigation Toolbar */}
                  {renderScalableNavToolbar({
                    type: 'vocab',
                    list: filteredCards,
                    currentIndex: currentCardIdx,
                    onSelectIndex: (idx) => {
                      setCurrentCardIdx(idx);
                      setIsFlipped(false);
                    },
                    themeColor: 'emerald',
                    totalMastered: totalMasteredVocab,
                    currentItem: currentCard,
                    getItemTitle: (item, idx) => item.term ? `${item.term} (${item.wordType || `Band ${item.bandScore || item.bandLevel || '6.5'}`})` : `Thẻ từ vựng ${idx + 1}`
                  })}

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
                        className="flex items-center space-x-1 font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
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
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCurrentCardIdx(prev => Math.min(filteredCards.length - 1, prev + 1))}
                        disabled={currentCardIdx === filteredCards.length - 1}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleUpdateMastery('learning')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        Chưa nhớ
                      </button>
                      <button
                        onClick={() => handleUpdateMastery('reviewed')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        Tạm nhớ
                      </button>
                      <button
                        onClick={() => handleUpdateMastery('mastered')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Đã thuộc lòng</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
