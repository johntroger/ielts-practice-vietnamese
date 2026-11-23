import { useEffect, useRef } from 'react';
import { trackSkillView } from '../services/analyticsService.js';

/**
 * Helper to bind a two-way route (mount check + popstate/hashchange listener)
 */
function useRouteListener(checkRoute, onEnter, onExit, deps = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (checkRoute()) {
      onEnter();
    }

    const handleLocationChange = () => {
      if (checkRoute()) {
        onEnter();
      } else {
        onExit();
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, deps);
}

/**
 * Dedicated Two-Way URL Routing & Deep-Linking for all Studio Modals & Pages:
 * - Atlas Arena (/atlas-arena, /arena)
 * - Vocab Vault (/vocab-vault, /so-tay-tu-vung)
 * - About Page (/about, /gioi-thieu)
 * - Micro-Drills (/micro-drills, /drills, /luyen-phan-xa)
 * - Vocab/Grammar/Spelling Studio (/vocab-studio, /grammar-studio, /spelling-studio)
 * - Pronunciation Studio (/pronunciation, /luyen-phat-am)
 * - Conversation & Shadowing Studio (/conversation, /shadowing, /luyen-hoi-thoai)
 * - Music & Lyrics Dictation Studio (/music-listening, /music-dictation, /luyen-nghe-nhac)
 */
export function useUrlDeepLinking({
  modals,
  openModal,
  closeModal,
  isAboutViewOpen,
  setIsAboutViewOpen
}) {
  // 1. Atlas Arena (/atlas-arena & /arena)
  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      return (
        pathname === '/atlas-arena' ||
        pathname.endsWith('/atlas-arena') ||
        pathname === '/arena' ||
        pathname.endsWith('/arena') ||
        hash === '#atlas-arena' ||
        hash === '#arena' ||
        search.get('mode') === 'atlas-arena' ||
        search.get('mode') === 'arena'
      );
    },
    () => openModal('atlasArena'),
    () => closeModal('atlasArena'),
    [openModal, closeModal]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isArenaOpen = Boolean(modals.atlasArena);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnArenaUrl =
      pathname === '/atlas-arena' ||
      pathname.endsWith('/atlas-arena') ||
      pathname === '/arena' ||
      pathname.endsWith('/arena') ||
      hash === '#atlas-arena' ||
      hash === '#arena';

    if (isArenaOpen && !isCurrentlyOnArenaUrl) {
      try {
        window.history.pushState({ modal: 'atlasArena' }, '', '/atlas-arena');
      } catch (e) {
        window.location.hash = 'atlas-arena';
      }
    } else if (!isArenaOpen && isCurrentlyOnArenaUrl) {
      try {
        if (hash === '#atlas-arena' || hash === '#arena') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.atlasArena]);

  // 2. Vocab Vault (/vocab-vault, /so-tay-tu-vung) & Irregular Verbs (/irregular-verbs, /dong-tu-bat-quy-tac)
  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      return (
        ['/vocab-vault', '/so-tay-tu-vung', '/irregular-verbs', '/dong-tu-bat-quy-tac'].includes(pathname) ||
        hash === '#vocab-vault' ||
        hash === '#irregular-verbs'
      );
    },
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const isIrregular =
        pathname === '/irregular-verbs' ||
        pathname === '/dong-tu-bat-quy-tac' ||
        hash === '#irregular-verbs';
      openModal('notebook', isIrregular ? { tab: 'irregular' } : true);
    },
    () => closeModal('notebook'),
    [openModal, closeModal]
  );

  const vaultMountedRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!vaultMountedRef.current) {
      vaultMountedRef.current = true;
      return;
    }
    const isOpen = Boolean(modals.notebook);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const onIrregularUrl = pathname === '/irregular-verbs' || pathname === '/dong-tu-bat-quy-tac';
    const onVaultUrl = pathname === '/vocab-vault' || pathname === '/so-tay-tu-vung' || onIrregularUrl;
    const targetUrl =
      modals.notebook && typeof modals.notebook === 'object' && modals.notebook.tab === 'irregular'
        ? '/irregular-verbs'
        : '/vocab-vault';

    try {
      if (isOpen && !onVaultUrl) {
        window.history.pushState({ modal: 'notebook' }, '', targetUrl);
      } else if (!isOpen && onVaultUrl) {
        window.history.pushState(null, '', '/');
      }
    } catch (e) {}
  }, [modals.notebook]);

  // 3. About Page (/about & /gioi-thieu)
  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      return (
        pathname === '/about' ||
        pathname.endsWith('/about') ||
        pathname === '/gioi-thieu' ||
        pathname.endsWith('/gioi-thieu') ||
        hash === '#about' ||
        hash === '#gioi-thieu' ||
        search.get('page') === 'about' ||
        search.get('view') === 'about'
      );
    },
    () => {
      setIsAboutViewOpen(true);
      trackSkillView('about');
    },
    () => setIsAboutViewOpen(false),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnAboutUrl =
      pathname === '/about' ||
      pathname.endsWith('/about') ||
      pathname === '/gioi-thieu' ||
      pathname.endsWith('/gioi-thieu') ||
      hash === '#about' ||
      hash === '#gioi-thieu';

    if (isAboutViewOpen && !isCurrentlyOnAboutUrl) {
      try {
        window.history.pushState({ page: 'about' }, '', '/about');
      } catch (e) {
        window.location.hash = 'about';
      }
      trackSkillView('about');
    } else if (!isAboutViewOpen && isCurrentlyOnAboutUrl) {
      try {
        if (hash === '#about' || hash === '#gioi-thieu') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [isAboutViewOpen]);

  // 4. Micro-Drills (/micro-drills, /micro-drill, /drills)
  const extractDrillParams = () => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const search = new URLSearchParams(window.location.search);
    let room = search.get('room') || search.get('skill');
    const tab = search.get('tab');
    const drillId = search.get('drill') || search.get('id') || search.get('drillid');
    const subpathMatch = pathname.match(/\/(?:micro-drills|micro-drill|drills|drill)\/([a-z0-9_-]+)/i);
    if (subpathMatch && subpathMatch[1]) {
      const sub = subpathMatch[1].toLowerCase();
      if (['general', 'writing', 'reading', 'listening', 'speaking'].includes(sub)) {
        room = sub;
      }
    }
    return { room, tab, drillId };
  };

  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const isPathMatch =
        pathname === '/micro-drills' || pathname.endsWith('/micro-drills') ||
        pathname === '/micro-drill' || pathname.endsWith('/micro-drill') ||
        pathname === '/microdrills' || pathname.endsWith('/microdrills') ||
        pathname === '/microdrill' || pathname.endsWith('/microdrill') ||
        pathname === '/drills' || pathname.endsWith('/drills') ||
        pathname === '/drill' || pathname.endsWith('/drill') ||
        pathname === '/luyen-phan-xa' || pathname.endsWith('/luyen-phan-xa') ||
        pathname.startsWith('/micro-drills/') || pathname.startsWith('/micro-drill/') || pathname.startsWith('/drills/');
      const isHashMatch =
        hash === '#micro-drills' || hash === '#micro-drill' || hash === '#microdrills' ||
        hash === '#microdrill' || hash === '#drills' || hash === '#drill' ||
        hash === '#luyen-phan-xa' || hash.startsWith('#micro-drills') || hash.startsWith('#drills');
      const mode = search.get('mode');
      const view = search.get('view');
      const page = search.get('page');
      const modal = search.get('modal');
      const isSearchMatch =
        ['drills', 'micro-drills', 'micro-drill', 'microdrills'].includes(mode) ||
        ['drills', 'micro-drills', 'micro-drill', 'microdrills'].includes(view) ||
        ['drills', 'micro-drills', 'micro-drill'].includes(page) ||
        ['drills', 'micro-drills'].includes(modal);
      return isPathMatch || isHashMatch || isSearchMatch;
    },
    () => openModal('drills', extractDrillParams()),
    () => closeModal('drills'),
    [openModal, closeModal]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDrillsOpen = Boolean(modals.drills);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnDrillsUrl =
      pathname === '/micro-drills' || pathname.endsWith('/micro-drills') ||
      pathname === '/micro-drill' || pathname.endsWith('/micro-drill') ||
      pathname === '/microdrills' || pathname.endsWith('/microdrills') ||
      pathname === '/microdrill' || pathname.endsWith('/microdrill') ||
      pathname === '/drills' || pathname.endsWith('/drills') ||
      pathname === '/drill' || pathname.endsWith('/drill') ||
      pathname === '/luyen-phan-xa' || pathname.endsWith('/luyen-phan-xa') ||
      pathname.startsWith('/micro-drills/') || pathname.startsWith('/micro-drill/') || pathname.startsWith('/drills/') ||
      hash === '#micro-drills' || hash === '#micro-drill' || hash === '#microdrills' ||
      hash === '#microdrill' || hash === '#drills' || hash === '#drill' ||
      hash === '#luyen-phan-xa' || hash.startsWith('#micro-drills') || hash.startsWith('#drills');

    if (isDrillsOpen && !isCurrentlyOnDrillsUrl) {
      try {
        const drillsPayload = typeof modals.drills === 'object' && modals.drills !== null ? modals.drills : null;
        const targetUrl = drillsPayload?.room ? `/micro-drills?room=${drillsPayload.room}` : '/micro-drills';
        window.history.pushState({ modal: 'drills' }, '', targetUrl);
      } catch (e) {
        window.location.hash = 'micro-drills';
      }
    } else if (!isDrillsOpen && isCurrentlyOnDrillsUrl) {
      try {
        if (hash.startsWith('#micro-drill') || hash.startsWith('#drills') || hash === '#drill' || hash === '#luyen-phan-xa') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.drills]);

  // 5. Vocab, Grammar & Spelling Studio (/vocab-studio & /grammar-studio)
  const extractVocabStudioParams = () => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const search = new URLSearchParams(window.location.search);
    let tab = search.get('tab');
    if (!tab) {
      if (pathname.includes('/grammar-studio') || pathname.endsWith('/grammar') || pathname.includes('/cambridge-grammar')) {
        tab = 'grammar';
      } else if (pathname.includes('/spelling-studio') || pathname.endsWith('/spelling')) {
        tab = 'spelling';
      } else if (pathname.includes('/thematic-vocab') || pathname.endsWith('/vocab')) {
        tab = 'vocab';
      } else if (pathname.endsWith('/synonyms')) {
        tab = 'synonyms';
      }
    }
    return { tab: tab || undefined };
  };

  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const isPathMatch =
        pathname === '/vocab-studio' || pathname.endsWith('/vocab-studio') || pathname.startsWith('/vocab-studio/') ||
        pathname === '/grammar-studio' || pathname.endsWith('/grammar-studio') || pathname.startsWith('/grammar-studio/') ||
        pathname === '/spelling-studio' || pathname.endsWith('/spelling-studio') ||
        pathname === '/studio' || pathname.endsWith('/studio') ||
        pathname === '/thematic-vocab' || pathname.endsWith('/thematic-vocab') ||
        pathname === '/cambridge-grammar' || pathname.endsWith('/cambridge-grammar');
      const isHashMatch =
        hash === '#vocab-studio' || hash === '#grammar-studio' || hash === '#spelling-studio' ||
        hash === '#studio' || hash.startsWith('#vocab-studio') || hash.startsWith('#grammar-studio');
      const modal = search.get('modal');
      const mode = search.get('mode');
      const view = search.get('view');
      const page = search.get('page');
      const isSearchMatch =
        ['vocab-studio', 'vocabGrammar', 'vocab', 'grammar', 'grammar-studio'].includes(modal) ||
        ['vocab-studio', 'vocab', 'grammar', 'grammar-studio'].includes(mode) ||
        ['vocab-studio', 'grammar-studio'].includes(view) ||
        ['vocab-studio', 'grammar-studio'].includes(page);
      return isPathMatch || isHashMatch || isSearchMatch;
    },
    () => {
      const { tab } = extractVocabStudioParams();
      openModal('vocabGrammar', tab ? { tab } : true);
    },
    () => closeModal('vocabGrammar'),
    [openModal, closeModal]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isVocabOpen = Boolean(modals.vocabGrammar);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnVocabStudioUrl =
      pathname === '/vocab-studio' || pathname.endsWith('/vocab-studio') || pathname.startsWith('/vocab-studio/') ||
      pathname === '/grammar-studio' || pathname.endsWith('/grammar-studio') || pathname.startsWith('/grammar-studio/') ||
      pathname === '/spelling-studio' || pathname.endsWith('/spelling-studio') ||
      pathname === '/studio' || pathname.endsWith('/studio') ||
      pathname === '/thematic-vocab' || pathname.endsWith('/thematic-vocab') ||
      pathname === '/cambridge-grammar' || pathname.endsWith('/cambridge-grammar') ||
      hash === '#vocab-studio' || hash === '#grammar-studio' || hash === '#spelling-studio' ||
      hash === '#studio' || hash.startsWith('#vocab-studio') || hash.startsWith('#grammar-studio');

    if (isVocabOpen && !isCurrentlyOnVocabStudioUrl) {
      try {
        const payloadTab = typeof modals.vocabGrammar === 'object' && modals.vocabGrammar !== null ? modals.vocabGrammar.tab : null;
        let targetUrl = '/vocab-studio';
        if (payloadTab && payloadTab !== 'spelling') {
          targetUrl = `/vocab-studio?tab=${payloadTab}`;
        }
        window.history.pushState({ modal: 'vocabGrammar' }, '', targetUrl);
      } catch (e) {
        window.location.hash = 'vocab-studio';
      }
    } else if (!isVocabOpen && isCurrentlyOnVocabStudioUrl) {
      try {
        if (hash.startsWith('#vocab-studio') || hash.startsWith('#grammar-studio') || hash === '#studio') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.vocabGrammar]);

  // 6. Pronunciation Studio (/pronunciation & /luyen-phat-am)
  const extractPronunciationParams = () => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const search = new URLSearchParams(window.location.search);
    let tab = search.get('tab');
    if (!tab) {
      if (pathname.endsWith('/phrases')) tab = 'phrases';
      else if (pathname.endsWith('/sentences')) tab = 'sentences';
      else if (pathname.endsWith('/words')) tab = 'words';
    }
    return { tab: tab || undefined };
  };

  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const isPathMatch =
        pathname === '/pronunciation' || pathname.endsWith('/pronunciation') || pathname.startsWith('/pronunciation/') ||
        pathname === '/luyen-phat-am' || pathname.endsWith('/luyen-phat-am');
      const isHashMatch =
        hash === '#pronunciation' || hash === '#luyen-phat-am' || hash.startsWith('#pronunciation');
      const isSearchMatch =
        search.get('modal') === 'pronunciation' || search.get('mode') === 'pronunciation' ||
        search.get('view') === 'pronunciation' || search.get('page') === 'pronunciation';
      return isPathMatch || isHashMatch || isSearchMatch;
    },
    () => {
      const { tab } = extractPronunciationParams();
      openModal('pronunciation', tab ? { tab } : true);
    },
    () => closeModal('pronunciation'),
    [openModal, closeModal]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isPronOpen = Boolean(modals.pronunciation);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnPronunciationUrl =
      pathname === '/pronunciation' || pathname.endsWith('/pronunciation') || pathname.startsWith('/pronunciation/') ||
      pathname === '/luyen-phat-am' || pathname.endsWith('/luyen-phat-am') ||
      hash === '#pronunciation' || hash === '#luyen-phat-am' || hash.startsWith('#pronunciation');

    if (isPronOpen && !isCurrentlyOnPronunciationUrl) {
      try {
        const payloadTab = typeof modals.pronunciation === 'object' && modals.pronunciation !== null ? modals.pronunciation.tab : null;
        let targetUrl = '/pronunciation';
        if (payloadTab && payloadTab !== 'words') {
          targetUrl = `/pronunciation?tab=${payloadTab}`;
        }
        window.history.pushState({ modal: 'pronunciation' }, '', targetUrl);
      } catch (e) {
        window.location.hash = 'pronunciation';
      }
    } else if (!isPronOpen && isCurrentlyOnPronunciationUrl) {
      try {
        if (hash.startsWith('#pronunciation') || hash === '#luyen-phat-am') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.pronunciation]);

  // 7. Conversation Studio (/conversation, /shadowing & /luyen-hoi-thoai)
  const extractConversationParams = () => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    const track = search.get('track');
    const scenario = search.get('scenario');
    const shadowingTask = search.get('task');
    let tab = search.get('tab');
    if (
      !tab &&
      (
        pathname.endsWith('/shadowing') || pathname.endsWith('/speech-shadowing') ||
        hash.startsWith('#shadowing') || hash.startsWith('#speech-shadowing') ||
        search.get('mode') === 'shadowing' || search.get('view') === 'shadowing'
      )
    ) {
      tab = 'shadowing';
    }
    return (track || scenario || tab || shadowingTask)
      ? {
          track: track || undefined,
          scenario: scenario || undefined,
          tab: tab || undefined,
          shadowingTask: shadowingTask || undefined
        }
      : true;
  };

  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const isPathMatch =
        pathname === '/conversation' || pathname.endsWith('/conversation') || pathname.startsWith('/conversation/') ||
        pathname === '/shadowing' || pathname.endsWith('/shadowing') ||
        pathname === '/speech-shadowing' || pathname.endsWith('/speech-shadowing') ||
        pathname === '/luyen-hoi-thoai' || pathname.endsWith('/luyen-hoi-thoai');
      const isHashMatch =
        hash === '#conversation' || hash === '#shadowing' || hash === '#speech-shadowing' ||
        hash === '#luyen-hoi-thoai' || hash.startsWith('#conversation') || hash.startsWith('#shadowing');
      const modal = search.get('modal');
      const mode = search.get('mode');
      const view = search.get('view');
      const page = search.get('page');
      const isSearchMatch =
        modal === 'conversation' || ['conversation', 'shadowing'].includes(mode) ||
        ['conversation', 'shadowing'].includes(view) || page === 'conversation';
      return isPathMatch || isHashMatch || isSearchMatch;
    },
    () => openModal('conversation', extractConversationParams()),
    () => closeModal('conversation'),
    [openModal, closeModal]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isConvOpen = Boolean(modals.conversation);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnConversationUrl =
      pathname === '/conversation' || pathname.endsWith('/conversation') || pathname.startsWith('/conversation/') ||
      pathname === '/shadowing' || pathname.endsWith('/shadowing') ||
      pathname === '/speech-shadowing' || pathname.endsWith('/speech-shadowing') ||
      pathname === '/luyen-hoi-thoai' || pathname.endsWith('/luyen-hoi-thoai') ||
      hash === '#conversation' || hash === '#shadowing' || hash === '#speech-shadowing' ||
      hash === '#luyen-hoi-thoai' || hash.startsWith('#conversation') || hash.startsWith('#shadowing');

    if (isConvOpen && !isCurrentlyOnConversationUrl) {
      try {
        const payload = typeof modals.conversation === 'object' && modals.conversation !== null ? modals.conversation : null;
        let targetUrl = '/conversation';
        if (payload?.tab === 'shadowing') {
          targetUrl = '/conversation?tab=shadowing';
        } else if (payload?.track && payload.track !== 'all') {
          targetUrl = `/conversation?track=${payload.track}`;
        }
        window.history.pushState({ modal: 'conversation' }, '', targetUrl);
      } catch (e) {
        window.location.hash = 'conversation';
      }
    } else if (!isConvOpen && isCurrentlyOnConversationUrl) {
      try {
        if (hash.startsWith('#conversation') || hash.startsWith('#shadowing') || hash === '#speech-shadowing' || hash === '#luyen-hoi-thoai') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.conversation]);

  // 8. Music & Lyrics Dictation Studio (/music-listening & /luyen-nghe-nhac)
  const extractMusicParams = () => {
    const search = new URLSearchParams(window.location.search);
    const genre = search.get('genre');
    const song = search.get('song');
    const mode = search.get('mode');
    const level = search.get('level');
    return (genre || song || mode || level)
      ? {
          genre: genre || undefined,
          song: song || undefined,
          mode: mode || undefined,
          level: level || undefined
        }
      : true;
  };

  useRouteListener(
    () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const isPathMatch =
        pathname === '/music-listening' || pathname.endsWith('/music-listening') || pathname.startsWith('/music-listening/') ||
        pathname === '/music-dictation' || pathname.endsWith('/music-dictation') ||
        pathname === '/luyen-nghe-nhac' || pathname.endsWith('/luyen-nghe-nhac');
      const isHashMatch =
        hash === '#music-listening' || hash === '#music-dictation' ||
        hash === '#luyen-nghe-nhac' || hash.startsWith('#music-listening');
      const modal = search.get('modal');
      const isSearchMatch =
        ['musicListening', 'music-listening'].includes(modal) ||
        search.get('mode') === 'music-listening' ||
        search.get('view') === 'music-listening' ||
        search.get('page') === 'music-listening';
      return isPathMatch || isHashMatch || isSearchMatch;
    },
    () => openModal('musicListening', extractMusicParams()),
    () => closeModal('musicListening'),
    [openModal, closeModal]
  );

  const musicMountedRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!musicMountedRef.current) {
      musicMountedRef.current = true;
      return;
    }
    const isMusicOpen = Boolean(modals.musicListening);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnMusicUrl =
      pathname === '/music-listening' || pathname.endsWith('/music-listening') || pathname.startsWith('/music-listening/') ||
      pathname === '/music-dictation' || pathname.endsWith('/music-dictation') ||
      pathname === '/luyen-nghe-nhac' || pathname.endsWith('/luyen-nghe-nhac') ||
      hash === '#music-listening' || hash === '#music-dictation' ||
      hash === '#luyen-nghe-nhac' || hash.startsWith('#music-listening');

    if (isMusicOpen && !isCurrentlyOnMusicUrl) {
      try {
        window.history.pushState({ modal: 'musicListening' }, '', '/music-listening');
      } catch (e) {
        window.location.hash = 'music-listening';
      }
    } else if (!isMusicOpen && isCurrentlyOnMusicUrl) {
      try {
        if (hash.startsWith('#music-') || hash === '#luyen-nghe-nhac') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.musicListening]);
}
