import { useState, useEffect } from 'react';

const CACHE_KEY = 'ielts_ipa_cache_v1';

// Built-in IPA for irregular verb forms (especially V2/V3 which dictionary APIs often lack)
// and high-frequency C1/C2 words for instant offline display.
const LOCAL_IPA = {
  // Irregular verbs V1 / V2 / V3
  arise: '/əˈraɪz/', arose: '/əˈrəʊz/', arisen: '/əˈrɪzən/',
  awake: '/əˈweɪk/', awoke: '/əˈwəʊk/', awoken: '/əˈwəʊkən/',
  be: '/biː/', was: '/wɒz/', were: '/wɜː/', been: '/biːn/',
  bear: '/beə/', bore: '/bɔː/', borne: '/bɔːn/',
  become: '/bɪˈkʌm/', became: '/bɪˈkeɪm/',
  begin: '/bɪˈɡɪn/', began: '/bɪˈɡæn/', begun: '/bɪˈɡʌn/',
  bend: '/bend/', bent: '/bent/',
  bet: '/bet/',
  bind: '/baɪnd/', bound: '/baʊnd/',
  bite: '/baɪt/', bit: '/bɪt/', bitten: '/ˈbɪtən/',
  bleed: '/bliːd/', bled: '/bled/',
  blow: '/bləʊ/', blew: '/bluː/', blown: '/bləʊn/',
  break: '/breɪk/', broke: '/brəʊk/', broken: '/ˈbrəʊkən/',
  breed: '/briːd/', bred: '/bred/',
  bring: '/brɪŋ/', brought: '/brɔːt/',
  broadcast: '/ˈbrɔːdkɑːst/',
  build: '/bɪld/', built: '/bɪlt/',
  burn: '/bɜːn/', burnt: '/bɜːnt/', burned: '/bɜːnd/',
  burst: '/bɜːst/',
  buy: '/baɪ/', bought: '/bɔːt/',
  cast: '/kɑːst/',
  catch: '/kætʃ/', caught: '/kɔːt/',
  choose: '/tʃuːz/', chose: '/tʃəʊz/', chosen: '/ˈtʃəʊzən/',
  cling: '/klɪŋ/', clung: '/klʌŋ/',
  come: '/kʌm/', came: '/keɪm/',
  cost: '/kɒst/',
  creep: '/kriːp/', crept: '/krept/',
  cut: '/kʌt/',
  deal: '/diːl/', dealt: '/delt/',
  dig: '/dɪɡ/', dug: '/dʌɡ/',
  do: '/duː/', did: '/dɪd/', done: '/dʌn/',
  draw: '/drɔː/', drew: '/druː/', drawn: '/drɔːn/',
  dream: '/driːm/', dreamt: '/dremt/', dreamed: '/driːmd/',
  drink: '/drɪŋk/', drank: '/dræŋk/', drunk: '/drʌŋk/',
  drive: '/draɪv/', drove: '/drəʊv/', driven: '/ˈdrɪvən/',
  dwell: '/dwel/', dwelt: '/dwelt/',
  eat: '/iːt/', ate: '/et/', eaten: '/ˈiːtən/',
  fall: '/fɔːl/', fell: '/fel/', fallen: '/ˈfɔːlən/',
  feed: '/fiːd/', fed: '/fed/',
  feel: '/fiːl/', felt: '/felt/',
  fight: '/faɪt/', fought: '/fɔːt/',
  find: '/faɪnd/', found: '/faʊnd/',
  fit: '/fɪt/',
  flee: '/fliː/', fled: '/fled/',
  fly: '/flaɪ/', flew: '/fluː/', flown: '/fləʊn/',
  forbid: '/fəˈbɪd/', forbade: '/fəˈbæd/', forbidden: '/fəˈbɪdən/',
  forecast: '/ˈfɔːkɑːst/',
  foresee: '/fɔːˈsiː/', foresaw: '/fɔːˈsɔː/', foreseen: '/fɔːˈsiːn/',
  forget: '/fəˈɡet/', forgot: '/fəˈɡɒt/', forgotten: '/fəˈɡɒtən/',
  forgive: '/fəˈɡɪv/', forgave: '/fəˈɡeɪv/', forgiven: '/fəˈɡɪvən/',
  freeze: '/friːz/', froze: '/frəʊz/', frozen: '/ˈfrəʊzən/',
  get: '/ɡet/', got: '/ɡɒt/', gotten: '/ˈɡɒtən/',
  give: '/ɡɪv/', gave: '/ɡeɪv/', given: '/ˈɡɪvən/',
  go: '/ɡəʊ/', went: '/went/', gone: '/ɡɒn/',
  grind: '/ɡraɪnd/', ground: '/ɡraʊnd/',
  grow: '/ɡrəʊ/', grew: '/ɡruː/', grown: '/ɡrəʊn/',
  hang: '/hæŋ/', hung: '/hʌŋ/',
  have: '/hæv/', had: '/hæd/',
  hear: '/hɪə/', heard: '/hɜːd/',
  hide: '/haɪd/', hid: '/hɪd/', hidden: '/ˈhɪdən/',
  hit: '/hɪt/',
  hold: '/həʊld/', held: '/held/',
  hurt: '/hɜːt/',
  keep: '/kiːp/', kept: '/kept/',
  kneel: '/niːl/', knelt: '/nelt/',
  know: '/nəʊ/', knew: '/njuː/', known: '/nəʊn/',
  lay: '/leɪ/', laid: '/leɪd/',
  lead: '/liːd/', led: '/led/',
  lean: '/liːn/', leant: '/lent/', leaned: '/liːnd/',
  leap: '/liːp/', leapt: '/lept/', leaped: '/liːpt/',
  learn: '/lɜːn/', learnt: '/lɜːnt/', learned: '/lɜːnd/',
  leave: '/liːv/', left: '/left/',
  lend: '/lend/', lent: '/lent/',
  let: '/let/',
  lie: '/laɪ/', lain: '/leɪn/',
  light: '/laɪt/', lit: '/lɪt/', lighted: '/ˈlaɪtɪd/',
  lose: '/luːz/', lost: '/lɒst/',
  make: '/meɪk/', made: '/meɪd/',
  mean: '/miːn/', meant: '/ment/',
  meet: '/miːt/', met: '/met/',
  mislead: '/ˌmɪsˈliːd/', misled: '/ˌmɪsˈled/',
  overcome: '/ˌəʊvəˈkʌm/', overcame: '/ˌəʊvəˈkeɪm/',
  overtake: '/ˌəʊvəˈteɪk/', overtook: '/ˌəʊvəˈtʊk/', overtaken: '/ˌəʊvəˈteɪkən/',
  pay: '/peɪ/', paid: '/peɪd/',
  prove: '/pruːv/', proved: '/pruːvd/', proven: '/ˈpruːvən/',
  put: '/pʊt/',
  quit: '/kwɪt/',
  read: '/riːd/',
  rid: '/rɪd/',
  ride: '/raɪd/', rode: '/rəʊd/', ridden: '/ˈrɪdən/',
  ring: '/rɪŋ/', rang: '/ræŋ/', rung: '/rʌŋ/',
  rise: '/raɪz/', rose: '/rəʊz/', risen: '/ˈrɪzən/',
  run: '/rʌn/', ran: '/ræn/',
  say: '/seɪ/', said: '/sed/',
  see: '/siː/', saw: '/sɔː/', seen: '/siːn/',
  seek: '/siːk/', sought: '/sɔːt/',
  sell: '/sel/', sold: '/səʊld/',
  send: '/send/', sent: '/sent/',
  set: '/set/',
  shake: '/ʃeɪk/', shook: '/ʃʊk/', shaken: '/ˈʃeɪkən/',
  shed: '/ʃed/',
  shine: '/ʃaɪn/', shone: '/ʃɒn/',
  shoot: '/ʃuːt/', shot: '/ʃɒt/',
  show: '/ʃəʊ/', showed: '/ʃəʊd/', shown: '/ʃəʊn/',
  shrink: '/ʃrɪŋk/', shrank: '/ʃræŋk/', shrunk: '/ʃrʌŋk/',
  shut: '/ʃʌt/',
  sing: '/sɪŋ/', sang: '/sæŋ/', sung: '/sʌŋ/',
  sink: '/sɪŋk/', sank: '/sæŋk/', sunk: '/sʌŋk/',
  sit: '/sɪt/', sat: '/sæt/',
  sleep: '/sliːp/', slept: '/slept/',
  slide: '/slaɪd/', slid: '/slɪd/',
  smell: '/smel/', smelt: '/smelt/', smelled: '/smeld/',
  sow: '/səʊ/', sowed: '/səʊd/', sown: '/səʊn/',
  speak: '/spiːk/', spoke: '/spəʊk/', spoken: '/ˈspəʊkən/',
  spell: '/spel/', spelt: '/spelt/', spelled: '/speld/',
  spend: '/spend/', spent: '/spent/',
  spin: '/spɪn/', spun: '/spʌn/',
  split: '/splɪt/',
  spread: '/spred/',
  spring: '/sprɪŋ/', sprang: '/spræŋ/', sprung: '/sprʌŋ/',
  stand: '/stænd/', stood: '/stʊd/',
  steal: '/stiːl/', stole: '/stəʊl/', stolen: '/ˈstəʊlən/',
  stick: '/stɪk/', stuck: '/stʌk/',
  stride: '/straɪd/', strode: '/strəʊd/', stridden: '/ˈstrɪdən/',
  strike: '/straɪk/', struck: '/strʌk/',
  strive: '/straɪv/', strove: '/strəʊv/', striven: '/ˈstrɪvən/',
  swear: '/sweə/', swore: '/swɔː/', sworn: '/swɔːn/',
  sweep: '/swiːp/', swept: '/swept/',
  swell: '/swel/', swelled: '/sweld/', swollen: '/ˈswəʊlən/',
  swim: '/swɪm/', swam: '/swæm/', swum: '/swʌm/',
  swing: '/swɪŋ/', swung: '/swʌŋ/',
  take: '/teɪk/', took: '/tʊk/', taken: '/ˈteɪkən/',
  teach: '/tiːtʃ/', taught: '/tɔːt/',
  tear: '/teə/', tore: '/tɔː/', torn: '/tɔːn/',
  tell: '/tel/', told: '/təʊld/',
  think: '/θɪŋk/', thought: '/θɔːt/',
  throw: '/θrəʊ/', threw: '/θruː/', thrown: '/θrəʊn/',
  thrust: '/θrʌst/',
  tread: '/tred/', trod: '/trɒd/', trodden: '/ˈtrɒdən/',
  undergo: '/ˌʌndəˈɡəʊ/', underwent: '/ˌʌndəˈwent/', undergone: '/ˌʌndəˈɡɒn/',
  understand: '/ˌʌndəˈstænd/', understood: '/ˌʌndəˈstʊd/',
  undertake: '/ˌʌndəˈteɪk/', undertook: '/ˌʌndəˈtʊk/', undertaken: '/ˌʌndəˈteɪkən/',
  uphold: '/ʌpˈhəʊld/', upheld: '/ʌpˈheld/',
  upset: '/ʌpˈset/',
  wake: '/weɪk/', woke: '/wəʊk/', woken: '/ˈwəʊkən/',
  wear: '/weə/', wore: '/wɔː/', worn: '/wɔːn/',
  weave: '/wiːv/', wove: '/wəʊv/', woven: '/ˈwəʊvən/',
  weep: '/wiːp/', wept: '/wept/',
  win: '/wɪn/', won: '/wʌn/',
  wind: '/waɪnd/', wound: '/waʊnd/',
  withdraw: '/wɪðˈdrɔː/', withdrew: '/wɪðˈdruː/', withdrawn: '/wɪðˈdrɔːn/',
  withhold: '/wɪðˈhəʊld/', withheld: '/wɪðˈheld/',
  withstand: '/wɪðˈstænd/', withstood: '/wɪðˈstʊd/',
  write: '/raɪt/', wrote: '/rəʊt/', written: '/ˈrɪtən/'
};

let memoryCache = null;
const inFlight = new Map();

function loadCache() {
  if (memoryCache) return memoryCache;
  try {
    memoryCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    memoryCache = {};
  }
  return memoryCache;
}

function saveCacheEntry(word, ipa) {
  const cache = loadCache();
  cache[word] = ipa;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota full; memoryCache still works
  }
}

export function tokenizePhraseWords(phrase) {
  return String(phrase || '')
    .split(/[\s–—/]+/)
    .map(w => w.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, ''))
    .filter(w => /[a-zA-Z]/.test(w));
}

export function getCachedWordIpa(word) {
  const key = String(word || '').toLowerCase().trim();
  if (!key) return '';
  if (LOCAL_IPA[key]) return LOCAL_IPA[key];
  const cache = loadCache();
  return cache[key] || '';
}

export async function fetchWordIpa(word) {
  const key = String(word || '').toLowerCase().trim();
  if (!key || !/^[a-z'-]+$/.test(key)) return '';
  const existing = getCachedWordIpa(key);
  if (existing) return existing;

  if (inFlight.has(key)) return inFlight.get(key);

  const req = (async () => {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
      if (!res.ok) {
        saveCacheEntry(key, '');
        return '';
      }
      const data = await res.json();
      const entry = Array.isArray(data) ? data[0] : null;
      const phonetic =
        entry?.phonetic ||
        entry?.phonetics?.find(p => p?.text)?.text ||
        '';
      const cleaned = phonetic ? phonetic.trim() : '';
      saveCacheEntry(key, cleaned);
      return cleaned;
    } catch {
      return '';
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, req);
  return req;
}

export function formatPhraseIpa(phrase) {
  const words = tokenizePhraseWords(phrase);
  if (words.length === 0) return '';
  const parts = words.map(w => getCachedWordIpa(w)).filter(Boolean);
  if (parts.length !== words.length) return '';
  const inner = parts.map(p => p.replace(/^\/|\/$/g, '')).join(' ');
  return `/${inner}/`;
}

/**
 * React hook that resolves IPA for a list of phrases (e.g., current page of 24 items)
 * using local dictionary + localStorage cache + Free Dictionary API.
 */
export function useIpaLookup(phrases = []) {
  const [, setTick] = useState(0);
  const key = phrases.join('|');

  useEffect(() => {
    let cancelled = false;
    const missing = new Set();
    for (const p of phrases) {
      for (const w of tokenizePhraseWords(p)) {
        const lower = w.toLowerCase();
        const cache = loadCache();
        if (!LOCAL_IPA[lower] && !(lower in cache)) {
          missing.add(lower);
        }
      }
    }
    if (missing.size === 0) return undefined;

    Promise.all([...missing].slice(0, 30).map(fetchWordIpa)).then(() => {
      if (!cancelled) setTick(t => t + 1);
    });

    return () => {
      cancelled = true;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    getWordIpa: getCachedWordIpa,
    getPhraseIpa: formatPhraseIpa
  };
}
