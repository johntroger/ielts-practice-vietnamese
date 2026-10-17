import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SPEAKING_PART1_TOPICS,
  SPEAKING_PART2_CUECARDS,
  SPEAKING_PART3_QUESTIONS,
  SPEAKING_MOCK_TEST_PACKS,
  COMMUNITY_DEFAULT_P1_TOPICS,
  COMMUNITY_DEFAULT_P2_CARDS,
  COMMUNITY_DEFAULT_P3_SETS
} from '../data/speakingTopics';
import {
  deduplicateSpeakingP1Topics,
  deduplicateSpeakingP2Cards,
  deduplicateSpeakingP3Sets
} from '../services/deduplicationService';

export function useSpeakingTopics({ isEn = false } = {}) {
  // 1. Mock packs state (preloaded + user generated with AI)
  const [allMockPacks, setAllMockPacks] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_speaking_custom_packs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...SPEAKING_MOCK_TEST_PACKS, ...parsed];
        }
      }
    } catch (e) {}
    return SPEAKING_MOCK_TEST_PACKS;
  });

  const [selectedMockId, setSelectedMockId] = useState(SPEAKING_MOCK_TEST_PACKS[0]?.id || 'mock-spk-tech-future');
  const [mockFilter, setMockFilter] = useState('all'); // 'all' | 'cambridge' | 'manual' | 'ai'

  // 2. Custom practice topics, cards & discussion sets with auto-deduplication
  const [customP1Topics, setCustomP1Topics] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('ielts_speaking_custom_p1_topics');
      const savedCommunity = localStorage.getItem('ielts_speaking_community_p1_topics');
      const custom = savedCustom ? JSON.parse(savedCustom) : [];
      const comm = savedCommunity ? JSON.parse(savedCommunity) : [];
      const map = new Map();
      [...comm, ...custom].forEach(t => { if (t && t.id) map.set(t.id, t); });
      const rawList = Array.from(map.values());
      const { cleanedTopics, removedCount } = deduplicateSpeakingP1Topics(rawList, 0.75);
      if (removedCount > 0) {
        localStorage.setItem('ielts_speaking_custom_p1_topics', JSON.stringify(cleanedTopics));
      }
      return cleanedTopics;
    } catch (e) { return []; }
  });

  const [customP2Cards, setCustomP2Cards] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('ielts_speaking_custom_p2_cards');
      const savedCommunity = localStorage.getItem('ielts_speaking_community_p2_cards');
      const custom = savedCustom ? JSON.parse(savedCustom) : [];
      const comm = savedCommunity ? JSON.parse(savedCommunity) : [];
      const map = new Map();
      [...comm, ...custom].forEach(c => { if (c && c.id) map.set(c.id, c); });
      const rawList = Array.from(map.values());
      const { cleanedCards, removedCount } = deduplicateSpeakingP2Cards(rawList, 0.75);
      if (removedCount > 0) {
        localStorage.setItem('ielts_speaking_custom_p2_cards', JSON.stringify(cleanedCards));
      }
      return cleanedCards;
    } catch (e) { return []; }
  });

  const [customP3Sets, setCustomP3Sets] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('ielts_speaking_custom_p3_sets');
      const savedCommunity = localStorage.getItem('ielts_speaking_community_p3_sets');
      const custom = savedCustom ? JSON.parse(savedCustom) : [];
      const comm = savedCommunity ? JSON.parse(savedCommunity) : [];
      const map = new Map();
      [...comm, ...custom].forEach(s => { const key = s.linkedPart2Id || s.id; if (key) map.set(key, s); });
      const rawList = Array.from(map.values());
      const { cleanedSets, removedCount } = deduplicateSpeakingP3Sets(rawList, 0.75);
      if (removedCount > 0) {
        localStorage.setItem('ielts_speaking_custom_p3_sets', JSON.stringify(cleanedSets));
      }
      return cleanedSets;
    } catch (e) { return []; }
  });

  // Selected state
  const [selectedP1TopicId, setSelectedP1TopicId] = useState(SPEAKING_PART1_TOPICS[0]?.id || 'p1-work-study');
  const [selectedP2CueCardId, setSelectedP2CueCardId] = useState(SPEAKING_PART2_CUECARDS[0]?.id || 'p2-tech-device');
  const [selectedP3Id, setSelectedP3Id] = useState(() => {
    return SPEAKING_PART3_QUESTIONS[0]?.linkedPart2Id || 'p3-tech-society';
  });
  const [activeP1QuestionIndex, setActiveP1QuestionIndex] = useState(0);

  // 3. Merged topic collections with deduplication
  const allP1Topics = useMemo(() => {
    const combined = [...SPEAKING_PART1_TOPICS, ...COMMUNITY_DEFAULT_P1_TOPICS, ...customP1Topics];
    const { cleanedTopics } = deduplicateSpeakingP1Topics(combined, 0.75);
    return cleanedTopics;
  }, [customP1Topics]);

  const allP2Cards = useMemo(() => {
    const combined = [...SPEAKING_PART2_CUECARDS, ...COMMUNITY_DEFAULT_P2_CARDS, ...customP2Cards];
    const { cleanedCards } = deduplicateSpeakingP2Cards(combined, 0.75);
    return cleanedCards;
  }, [customP2Cards]);

  const allP3Sets = useMemo(() => {
    const combined = [...SPEAKING_PART3_QUESTIONS, ...COMMUNITY_DEFAULT_P3_SETS, ...customP3Sets];
    const { cleanedSets } = deduplicateSpeakingP3Sets(combined, 0.75);
    return cleanedSets;
  }, [customP3Sets]);

  // 4. Real-time multi-tab localStorage synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ielts_speaking_custom_p1_topics') {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setCustomP1Topics(updated);
        } catch (err) {}
      }
      if (e.key === 'ielts_speaking_custom_p2_cards') {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setCustomP2Cards(updated);
        } catch (err) {}
      }
      if (e.key === 'ielts_speaking_custom_p3_sets') {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setCustomP3Sets(updated);
        } catch (err) {}
      }
      if (e.key === 'ielts_speaking_custom_packs') {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setAllMockPacks([...SPEAKING_MOCK_TEST_PACKS, ...updated]);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 5. CRUD Helpers for Part 1
  const handleAddP1Topic = useCallback((newTopic) => {
    setCustomP1Topics(prev => {
      const combined = [newTopic, ...prev];
      const { cleanedTopics } = deduplicateSpeakingP1Topics(combined, 0.75);
      try { 
        localStorage.setItem('ielts_speaking_custom_p1_topics', JSON.stringify(cleanedTopics)); 
        if (newTopic.isPublic) {
          const commOnly = cleanedTopics.filter(t => t.isPublic);
          localStorage.setItem('ielts_speaking_community_p1_topics', JSON.stringify(commOnly));
        }
      } catch (e) {}
      return cleanedTopics;
    });
    setSelectedP1TopicId(newTopic.id);
    setActiveP1QuestionIndex(0);
  }, []);

  const handleDeleteP1Topic = useCallback((topicId) => {
    setCustomP1Topics(prev => {
      const updated = prev.filter(t => t.id !== topicId);
      try { 
        localStorage.setItem('ielts_speaking_custom_p1_topics', JSON.stringify(updated));
        const commOnly = updated.filter(t => t.isPublic);
        localStorage.setItem('ielts_speaking_community_p1_topics', JSON.stringify(commOnly));
      } catch (e) {}
      return updated;
    });
    setSelectedP1TopicId(current => {
      if (current === topicId) {
        return SPEAKING_PART1_TOPICS[0]?.id || 'p1-work-study';
      }
      return current;
    });
    setActiveP1QuestionIndex(0);
  }, []);

  const handleAddP1Question = useCallback((topicId, newQuestion) => {
    setCustomP1Topics(prev => {
      const existing = prev.find(t => t.id === topicId) || allP1Topics.find(t => t.id === topicId);
      if (!existing) return prev;
      const updatedTopic = {
        ...existing,
        isCustom: true,
        questions: [...(existing.questions || []), newQuestion]
      };
      const updated = [updatedTopic, ...prev.filter(t => t.id !== topicId)];
      try {
        localStorage.setItem('ielts_speaking_custom_p1_topics', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [allP1Topics]);

  const handleDeleteP1Question = useCallback((topicId, questionId) => {
    setCustomP1Topics(prev => {
      const existing = prev.find(t => t.id === topicId) || allP1Topics.find(t => t.id === topicId);
      if (!existing) return prev;
      const updatedQuestions = (existing.questions || []).filter((q, idx) => (q.qId || `q-${idx}`) !== questionId && q.id !== questionId);
      const updatedTopic = {
        ...existing,
        questions: updatedQuestions
      };
      const updated = [updatedTopic, ...prev.filter(t => t.id !== topicId)];
      try {
        localStorage.setItem('ielts_speaking_custom_p1_topics', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [allP1Topics]);

  // 6. CRUD Helpers for Part 2
  const handleAddP2Card = useCallback((newCard) => {
    setCustomP2Cards(prev => {
      const combined = [newCard, ...prev];
      const { cleanedCards } = deduplicateSpeakingP2Cards(combined, 0.75);
      try { 
        localStorage.setItem('ielts_speaking_custom_p2_cards', JSON.stringify(cleanedCards)); 
        if (newCard.isPublic) {
          const commOnly = cleanedCards.filter(c => c.isPublic);
          localStorage.setItem('ielts_speaking_community_p2_cards', JSON.stringify(commOnly));
        }
      } catch (e) {}
      return cleanedCards;
    });
    setSelectedP2CueCardId(newCard.id);
  }, []);

  const handleDeleteP2Card = useCallback((cardId) => {
    setCustomP2Cards(prev => {
      const updated = prev.filter(c => c.id !== cardId);
      try { 
        localStorage.setItem('ielts_speaking_custom_p2_cards', JSON.stringify(updated));
        const commOnly = updated.filter(c => c.isPublic);
        localStorage.setItem('ielts_speaking_community_p2_cards', JSON.stringify(commOnly));
      } catch (e) {}
      return updated;
    });
    setSelectedP2CueCardId(current => {
      if (current === cardId) {
        return SPEAKING_PART2_CUECARDS[0]?.id || 'p2-tech-device';
      }
      return current;
    });
  }, []);

  // 7. CRUD Helpers for Part 3
  const handleAddP3Set = useCallback((newSet) => {
    setCustomP3Sets(prev => {
      const combined = [newSet, ...prev];
      const { cleanedSets } = deduplicateSpeakingP3Sets(combined, 0.75);
      try { 
        localStorage.setItem('ielts_speaking_custom_p3_sets', JSON.stringify(cleanedSets)); 
        if (newSet.isPublic) {
          const commOnly = cleanedSets.filter(s => s.isPublic);
          localStorage.setItem('ielts_speaking_community_p3_sets', JSON.stringify(commOnly));
        }
      } catch (e) {}
      return cleanedSets;
    });
    setSelectedP3Id(newSet.linkedPart2Id || newSet.id);
  }, []);

  const handleDeleteP3Set = useCallback((setId) => {
    setCustomP3Sets(prev => {
      const updated = prev.filter(s => (s.linkedPart2Id || s.id) !== setId);
      try { 
        localStorage.setItem('ielts_speaking_custom_p3_sets', JSON.stringify(updated));
        const commOnly = updated.filter(s => s.isPublic);
        localStorage.setItem('ielts_speaking_community_p3_sets', JSON.stringify(commOnly));
      } catch (e) {}
      return updated;
    });
    setSelectedP3Id(current => {
      if (current === setId) {
        return SPEAKING_PART3_QUESTIONS[0]?.linkedPart2Id || 'p3-tech-society';
      }
      return current;
    });
  }, []);

  const handleAddP3Question = useCallback((setId, newQuestion) => {
    setCustomP3Sets(prev => {
      const existing = prev.find(s => (s.linkedPart2Id || s.id) === setId) || allP3Sets.find(s => (s.linkedPart2Id || s.id) === setId);
      if (!existing) return prev;
      const updatedSet = {
        ...existing,
        isCustom: true,
        questions: [...(existing.questions || []), newQuestion]
      };
      const updated = [updatedSet, ...prev.filter(s => (s.linkedPart2Id || s.id) !== setId)];
      try {
        localStorage.setItem('ielts_speaking_custom_p3_sets', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [allP3Sets]);

  const handleDeleteP3Question = useCallback((setId, questionId) => {
    setCustomP3Sets(prev => {
      const existing = prev.find(s => (s.linkedPart2Id || s.id) === setId) || allP3Sets.find(s => (s.linkedPart2Id || s.id) === setId);
      if (!existing) return prev;
      const updatedQuestions = (existing.questions || []).filter((q, idx) => (q.qId || `q-${idx}`) !== questionId && q.id !== questionId);
      const updatedSet = {
        ...existing,
        questions: updatedQuestions
      };
      const updated = [updatedSet, ...prev.filter(s => (s.linkedPart2Id || s.id) !== setId)];
      try {
        localStorage.setItem('ielts_speaking_custom_p3_sets', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [allP3Sets]);

  // 8. Mock Pack Management
  const handlePackGenerated = useCallback((newPack) => {
    setAllMockPacks(prev => {
      const updated = [newPack, ...prev];
      try {
        const customOnly = updated.filter(p => p.isCustom);
        localStorage.setItem('ielts_speaking_custom_packs', JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
    setSelectedMockId(newPack.id);
  }, []);

  const handleDeleteCustomPack = useCallback((packId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(isEn ? 'Are you sure you want to delete this custom speaking test pack?' : 'Bạn có chắc chắn muốn xóa bộ đề thi Speaking tự sinh này?')) return;
    setAllMockPacks(prev => {
      const updated = prev.filter(p => p.id !== packId);
      try {
        const customOnly = updated.filter(p => p.isCustom);
        localStorage.setItem('ielts_speaking_custom_packs', JSON.stringify(customOnly));
      } catch (err) {}
      return updated;
    });
    setSelectedMockId(current => {
      if (current === packId) {
        return SPEAKING_MOCK_TEST_PACKS[0]?.id || 'mock-spk-tech-future';
      }
      return current;
    });
  }, [isEn]);

  const mockPackCounts = useMemo(() => {
    return {
      all: allMockPacks.length,
      cambridge: allMockPacks.filter(p => p.isCambridge || !p.isCustom).length,
      manual: allMockPacks.filter(p => p.isManual || (p.isCustom && !p.isAiGenerated)).length,
      ai: allMockPacks.filter(p => p.isAiGenerated).length
    };
  }, [allMockPacks]);

  const filteredMockPacks = useMemo(() => {
    if (mockFilter === 'cambridge') {
      return allMockPacks.filter(p => p.isCambridge || !p.isCustom);
    }
    if (mockFilter === 'manual') {
      return allMockPacks.filter(p => p.isManual || (p.isCustom && !p.isAiGenerated));
    }
    if (mockFilter === 'ai') {
      return allMockPacks.filter(p => p.isAiGenerated);
    }
    return allMockPacks;
  }, [allMockPacks, mockFilter]);

  const currentPackIndex = useMemo(() => {
    const idx = filteredMockPacks.findIndex(p => p.id === selectedMockId);
    return idx >= 0 ? idx : 0;
  }, [filteredMockPacks, selectedMockId]);

  const handlePrevPack = useCallback(() => {
    if (filteredMockPacks.length === 0) return;
    const newIdx = (currentPackIndex - 1 + filteredMockPacks.length) % filteredMockPacks.length;
    setSelectedMockId(filteredMockPacks[newIdx].id);
  }, [filteredMockPacks, currentPackIndex]);

  const handleNextPack = useCallback(() => {
    if (filteredMockPacks.length === 0) return;
    const newIdx = (currentPackIndex + 1) % filteredMockPacks.length;
    setSelectedMockId(filteredMockPacks[newIdx].id);
  }, [filteredMockPacks, currentPackIndex]);

  // Active items derived from selections
  const activeMockPack = useMemo(() => {
    return allMockPacks.find(m => m.id === selectedMockId) || allMockPacks[0] || {};
  }, [allMockPacks, selectedMockId]);

  const mockP1 = useMemo(() => {
    return activeMockPack.customPart1 
      || SPEAKING_PART1_TOPICS.find(p => p.id === activeMockPack.part1TopicId) 
      || SPEAKING_PART1_TOPICS[0];
  }, [activeMockPack]);

  const mockP2 = useMemo(() => {
    return activeMockPack.customPart2 
      || SPEAKING_PART2_CUECARDS.find(p => p.id === activeMockPack.part2CueCardId) 
      || SPEAKING_PART2_CUECARDS[0];
  }, [activeMockPack]);

  const mockP3 = useMemo(() => {
    return activeMockPack.customPart3 
      || SPEAKING_PART3_QUESTIONS.find(p => p.linkedPart2Id === activeMockPack.part3DiscussionId) 
      || SPEAKING_PART3_QUESTIONS[0];
  }, [activeMockPack]);

  const activeP1Topic = useMemo(() => {
    return allP1Topics.find(p => p.id === selectedP1TopicId) || allP1Topics[0];
  }, [allP1Topics, selectedP1TopicId]);

  const activeP2Card = useMemo(() => {
    return allP2Cards.find(p => p.id === selectedP2CueCardId) || allP2Cards[0];
  }, [allP2Cards, selectedP2CueCardId]);

  const activeP3Set = useMemo(() => {
    return allP3Sets.find(p => p.linkedPart2Id === selectedP2CueCardId) || allP3Sets[0];
  }, [allP3Sets, selectedP2CueCardId]);

  return {
    // Part 1
    allP1Topics,
    selectedP1TopicId,
    setSelectedP1TopicId,
    activeP1Topic,
    activeP1QuestionIndex,
    setActiveP1QuestionIndex,
    handleAddP1Topic,
    handleDeleteP1Topic,
    handleAddP1Question,
    handleDeleteP1Question,

    // Part 2
    allP2Cards,
    selectedP2CueCardId,
    setSelectedP2CueCardId,
    activeP2Card,
    handleAddP2Card,
    handleDeleteP2Card,

    // Part 3
    allP3Sets,
    selectedP3Id,
    setSelectedP3Id,
    activeP3Set,
    handleAddP3Set,
    handleDeleteP3Set,
    handleAddP3Question,
    handleDeleteP3Question,

    // Mock Packs
    allMockPacks,
    setAllMockPacks,
    selectedMockId,
    setSelectedMockId,
    activeMockPack,
    mockFilter,
    setMockFilter,
    mockPackCounts,
    filteredMockPacks,
    handlePrevPack,
    handleNextPack,
    handlePackGenerated,
    handleDeleteCustomPack,
    mockP1,
    mockP2,
    mockP3
  };
}
