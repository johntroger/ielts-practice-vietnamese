import { useState, useEffect } from 'react';

const CACHE_KEY = 'ielts_ipa_cache_v1';

// Built-in IPA for irregular verb forms (especially V2/V3 which dictionary APIs often lack)
// and high-frequency C1/C2 words for instant offline display.
const LOCAL_IPA = {
  // Irregular verbs V1 / V2 / V3
  abide: '/əˈbaɪd/', abode: '/əˈbəʊd/', abided: '/əˈbaɪdɪd/',
  alight: '/əˈlaɪt/', alit: '/əˈlɪt/', alighted: '/əˈlaɪtɪd/',
  arise: '/əˈraɪz/', arose: '/əˈrəʊz/', arisen: '/əˈrɪzən/',
  awake: '/əˈweɪk/', awoke: '/əˈwəʊk/', awoken: '/əˈwəʊkən/',
  be: '/biː/', was: '/wɒz/', were: '/wɜː/', been: '/biːn/',
  bear: '/beə/', bore: '/bɔː/', borne: '/bɔːn/',
  beat: '/biːt/', beaten: '/ˈbiːtən/',
  become: '/bɪˈkʌm/', became: '/bɪˈkeɪm/',
  befall: '/bɪˈfɔːl/', befell: '/bɪˈfel/', befallen: '/bɪˈfɔːlən/',
  beget: '/bɪˈɡet/', begot: '/bɪˈɡɒt/', begotten: '/bɪˈɡɒtən/',
  begin: '/bɪˈɡɪn/', began: '/bɪˈɡæn/', begun: '/bɪˈɡʌn/',
  behold: '/bɪˈhəʊld/', beheld: '/bɪˈheld/',
  bend: '/bend/', bent: '/bent/',
  bereave: '/bɪˈriːv/', bereft: '/bɪˈreft/', bereaved: '/bɪˈriːvd/',
  beseech: '/bɪˈsiːtʃ/', besought: '/bɪˈsɔːt/', beseeched: '/bɪˈsiːtʃt/',
  beset: '/bɪˈset/',
  bespeak: '/bɪˈspiːk/', bespoke: '/bɪˈspəʊk/', bespoken: '/bɪˈspəʊkən/',
  bet: '/bet/',
  bid: '/bɪd/', bide: '/baɪd/', bided: '/ˈbaɪdɪd/',
  bind: '/baɪnd/', bound: '/baʊnd/',
  bite: '/baɪt/', bit: '/bɪt/', bitten: '/ˈbɪtən/',
  bleed: '/bliːd/', bled: '/bled/',
  bless: '/bles/', blessed: '/blest/', blest: '/blest/',
  blow: '/bləʊ/', blew: '/bluː/', blown: '/bləʊn/',
  break: '/breɪk/', broke: '/brəʊk/', broken: '/ˈbrəʊkən/',
  breed: '/briːd/', bred: '/bred/',
  bring: '/brɪŋ/', brought: '/brɔːt/',
  broadcast: '/ˈbrɔːdkɑːst/',
  build: '/bɪld/', built: '/bɪlt/',
  burn: '/bɜːn/', burnt: '/bɜːnt/', burned: '/bɜːnd/',
  burst: '/bɜːst/',
  bust: '/bʌst/', busted: '/ˈbʌstɪd/',
  buy: '/baɪ/', bought: '/bɔːt/',
  cast: '/kɑːst/',
  catch: '/kætʃ/', caught: '/kɔːt/',
  chide: '/tʃaɪd/', chid: '/tʃɪd/', chidden: '/ˈtʃɪdən/', chided: '/ˈtʃaɪdɪd/',
  choose: '/tʃuːz/', chose: '/tʃəʊz/', chosen: '/ˈtʃəʊzən/',
  cleave: '/kliːv/', cleft: '/kleft/', clove: '/kləʊv/', cloven: '/ˈkləʊvən/',
  cling: '/klɪŋ/', clung: '/klʌŋ/',
  clothe: '/kləʊð/', clothed: '/kləʊðd/', clad: '/klæd/',
  come: '/kʌm/', came: '/keɪm/',
  cost: '/kɒst/',
  creep: '/kriːp/', crept: '/krept/',
  crow: '/krəʊ/', crowed: '/krəʊd/', crew: '/kruː/',
  cut: '/kʌt/',
  dare: '/deə/', dared: '/deəd/', durst: '/dɜːst/',
  deal: '/diːl/', dealt: '/delt/',
  dig: '/dɪɡ/', dug: '/dʌɡ/',
  dive: '/daɪv/', dived: '/daɪvd/', dove: '/dəʊv/',
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
  fling: '/flɪŋ/', flung: '/flʌŋ/',
  fly: '/flaɪ/', flew: '/fluː/', flown: '/fləʊn/',
  forbid: '/fəˈbɪd/', forbade: '/fəˈbæd/', forbidden: '/fəˈbɪdən/',
  forecast: '/ˈfɔːkɑːst/',
  foresee: '/fɔːˈsiː/', foresaw: '/fɔːˈsɔː/', foreseen: '/fɔːˈsiːn/',
  foretell: '/fɔːˈtel/', foretold: '/fɔːˈtəʊld/',
  forget: '/fəˈɡet/', forgot: '/fəˈɡɒt/', forgotten: '/fəˈɡɒtən/',
  forgive: '/fəˈɡɪv/', forgave: '/fəˈɡeɪv/', forgiven: '/fəˈɡɪvən/',
  forsake: '/fəˈseɪk/', forsook: '/fəˈsʊk/', forsaken: '/fəˈseɪkən/',
  freeze: '/friːz/', froze: '/frəʊz/', frozen: '/ˈfrəʊzən/',
  gainsay: '/ˌɡeɪnˈseɪ/', gainsaid: '/ˌɡeɪnˈsed/',
  get: '/ɡet/', got: '/ɡɒt/', gotten: '/ˈɡɒtən/',
  gild: '/ɡɪld/', gilded: '/ˈɡɪldɪd/', gilt: '/ɡɪlt/',
  gird: '/ɡɜːd/', girded: '/ˈɡɜːdɪd/', girt: '/ɡɜːt/',
  give: '/ɡɪv/', gave: '/ɡeɪv/', given: '/ˈɡɪvən/',
  go: '/ɡəʊ/', went: '/went/', gone: '/ɡɒn/',
  grind: '/ɡraɪnd/', ground: '/ɡraʊnd/',
  grow: '/ɡrəʊ/', grew: '/ɡruː/', grown: '/ɡrəʊn/',
  hang: '/hæŋ/', hung: '/hʌŋ/',
  have: '/hæv/', had: '/hæd/',
  hear: '/hɪə/', heard: '/hɜːd/',
  heave: '/hiːv/', heaved: '/hiːvd/', hove: '/həʊv/',
  hew: '/hjuː/', hewed: '/hjuːd/', hewn: '/hjuːn/',
  hide: '/haɪd/', hid: '/hɪd/', hidden: '/ˈhɪdən/',
  hit: '/hɪt/',
  hold: '/həʊld/', held: '/held/',
  hurt: '/hɜːt/',
  input: '/ˈɪnpʊt/',
  keep: '/kiːp/', kept: '/kept/',
  kneel: '/niːl/', knelt: '/nelt/',
  knit: '/nɪt/', knitted: '/ˈnɪtɪd/',
  know: '/nəʊ/', knew: '/njuː/', known: '/nəʊn/',
  lade: '/leɪd/', laded: '/ˈleɪdɪd/', laden: '/ˈleɪdən/',
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
  mislay: '/ˌmɪsˈleɪ/', mislaid: '/ˌmɪsˈleɪd/',
  mistake: '/mɪˈsteɪk/', mistook: '/mɪˈstʊk/', mistaken: '/mɪˈsteɪkən/',
  misunderstand: '/ˌmɪsʌndəˈstænd/', misunderstood: '/ˌmɪsʌndəˈstʊd/',
  mow: '/məʊ/', mowed: '/məʊd/', mown: '/məʊn/',
  offset: '/ˈɒfset/',
  outdo: '/ˌaʊtˈduː/', outdid: '/ˌaʊtˈdɪd/', outdone: '/ˌaʊtˈdʌn/',
  outgrow: '/ˌaʊtˈɡrəʊ/', outgrew: '/ˌaʊtˈɡruː/', outgrown: '/ˌaʊtˈɡrəʊn/',
  overcome: '/ˌəʊvəˈkʌm/', overcame: '/ˌəʊvəˈkeɪm/',
  oversee: '/ˌəʊvəˈsiː/', oversaw: '/ˌəʊvəˈsɔː/', overseen: '/ˌəʊvəˈsiːn/',
  overtake: '/ˌəʊvəˈteɪk/', overtook: '/ˌəʊvəˈtʊk/', overtaken: '/ˌəʊvəˈteɪkən/',
  overthrow: '/ˌəʊvəˈθrəʊ/', overthrew: '/ˌəʊvəˈθruː/', overthrown: '/ˌəʊvəˈθrəʊn/',
  pay: '/peɪ/', paid: '/peɪd/',
  plead: '/pliːd/', pleaded: '/ˈpliːdɪd/', pled: '/pled/',
  prove: '/pruːv/', proved: '/pruːvd/', proven: '/ˈpruːvən/',
  put: '/pʊt/',
  quit: '/kwɪt/',
  read: '/riːd/',
  rebuild: '/ˌriːˈbɪld/', rebuilt: '/ˌriːˈbɪlt/',
  rend: '/rend/', rent: '/rent/',
  repay: '/rɪˈpeɪ/', repaid: '/rɪˈpeɪd/',
  reset: '/ˌriːˈset/',
  rethink: '/ˌriːˈθɪŋk/', rethought: '/ˌriːˈθɔːt/',
  rewrite: '/ˌriːˈraɪt/', rewrote: '/ˌriːˈrəʊt/', rewritten: '/ˌriːˈrɪtən/',
  rid: '/rɪd/',
  ride: '/raɪd/', rode: '/rəʊd/', ridden: '/ˈrɪdən/',
  ring: '/rɪŋ/', rang: '/ræŋ/', rung: '/rʌŋ/',
  rise: '/raɪz/', rose: '/rəʊz/', risen: '/ˈrɪzən/',
  rive: '/raɪv/', rived: '/raɪvd/', riven: '/ˈrɪvən/',
  run: '/rʌn/', ran: '/ræn/',
  saw: '/sɔː/', sawed: '/sɔːd/', sawn: '/sɔːn/',
  say: '/seɪ/', said: '/sed/',
  see: '/siː/', seen: '/siːn/',
  seek: '/siːk/', sought: '/sɔːt/',
  sell: '/sel/', sold: '/səʊld/',
  send: '/send/', sent: '/sent/',
  set: '/set/',
  sew: '/səʊ/', sewed: '/səʊd/', sewn: '/səʊn/',
  shake: '/ʃeɪk/', shook: '/ʃʊk/', shaken: '/ˈʃeɪkən/',
  shave: '/ʃeɪv/', shaved: '/ʃeɪvd/', shaven: '/ˈʃeɪvən/',
  shear: '/ʃɪə/', sheared: '/ʃɪəd/', shorn: '/ʃɔːn/',
  shed: '/ʃed/',
  shine: '/ʃaɪn/', shone: '/ʃɒn/',
  shoe: '/ʃuː/', shod: '/ʃɒd/',
  shoot: '/ʃuːt/', shot: '/ʃɒt/',
  show: '/ʃəʊ/', showed: '/ʃəʊd/', shown: '/ʃəʊn/',
  shrink: '/ʃrɪŋk/', shrank: '/ʃræŋk/', shrunk: '/ʃrʌŋk/',
  shut: '/ʃʌt/',
  sing: '/sɪŋ/', sang: '/sæŋ/', sung: '/sʌŋ/',
  sink: '/sɪŋk/', sank: '/sæŋk/', sunk: '/sʌŋk/',
  sit: '/sɪt/', sat: '/sæt/',
  slay: '/sleɪ/', slew: '/sluː/', slain: '/sleɪn/',
  sleep: '/sliːp/', slept: '/slept/',
  slide: '/slaɪd/', slid: '/slɪd/',
  sling: '/slɪŋ/', slung: '/slʌŋ/',
  slink: '/slɪŋk/', slunk: '/slʌŋk/',
  slit: '/slɪt/',
  smell: '/smel/', smelt: '/smelt/', smelled: '/smeld/',
  smite: '/smaɪt/', smote: '/sməʊt/', smitten: '/ˈsmɪtən/',
  sneak: '/sniːk/', sneaked: '/sniːkt/', snuck: '/snʌk/',
  sow: '/səʊ/', sowed: '/səʊd/', sown: '/səʊn/',
  speak: '/spiːk/', spoke: '/spəʊk/', spoken: '/ˈspəʊkən/',
  speed: '/spiːd/', sped: '/sped/', speeded: '/ˈspiːdɪd/',
  spell: '/spel/', spelt: '/spelt/', spelled: '/speld/',
  spend: '/spend/', spent: '/spent/',
  spill: '/spɪl/', spilt: '/spɪlt/', spilled: '/spɪld/',
  spin: '/spɪn/', spun: '/spʌn/',
  spit: '/spɪt/', spat: '/spæt/',
  split: '/splɪt/',
  spoil: '/spɔɪl/', spoilt: '/spɔɪlt/', spoiled: '/spɔɪld/',
  spread: '/spred/',
  spring: '/sprɪŋ/', sprang: '/spræŋ/', sprung: '/sprʌŋ/',
  stand: '/stænd/', stood: '/stʊd/',
  stave: '/steɪv/', staved: '/steɪvd/', stove: '/stəʊv/',
  steal: '/stiːl/', stole: '/stəʊl/', stolen: '/ˈstəʊlən/',
  stick: '/stɪk/', stuck: '/stʌk/',
  sting: '/stɪŋ/', stung: '/stʌŋ/',
  stink: '/stɪŋk/', stank: '/stæŋk/', stunk: '/stʌŋk/',
  strew: '/struː/', strewed: '/struːd/', strewn: '/struːn/',
  stride: '/straɪd/', strode: '/strəʊd/', stridden: '/ˈstrɪdən/',
  strike: '/straɪk/', struck: '/strʌk/',
  string: '/strɪŋ/', strung: '/strʌŋ/',
  strive: '/straɪv/', strove: '/strəʊv/', striven: '/ˈstrɪvən/',
  swear: '/sweə/', swore: '/swɔː/', sworn: '/swɔːn/',
  sweat: '/swet/', sweated: '/ˈswetɪd/',
  sweep: '/swiːp/', swept: '/swept/',
  swell: '/swel/', swelled: '/sweld/', swollen: '/ˈswəʊlən/',
  swim: '/swɪm/', swam: '/swæm/', swum: '/swʌm/',
  swing: '/swɪŋ/', swung: '/swʌŋ/',
  take: '/teɪk/', took: '/tʊk/', taken: '/ˈteɪkən/',
  teach: '/tiːtʃ/', taught: '/tɔːt/',
  tear: '/teə/', tore: '/tɔː/', torn: '/tɔːn/',
  tell: '/tel/', told: '/təʊld/',
  think: '/θɪŋk/', thought: '/θɔːt/',
  thrive: '/θraɪv/', throve: '/θrəʊv/', thrived: '/θraɪvd/', thriven: '/ˈθrɪvən/',
  throw: '/θrəʊ/', threw: '/θruː/', thrown: '/θrəʊn/',
  thrust: '/θrʌst/',
  tread: '/tred/', trod: '/trɒd/', trodden: '/ˈtrɒdən/',
  undergo: '/ˌʌndəˈɡəʊ/', underwent: '/ˌʌndəˈwent/', undergone: '/ˌʌndəˈɡɒn/',
  underlie: '/ˌʌndəˈlaɪ/', underlay: '/ˌʌndəˈleɪ/', underlain: '/ˌʌndəˈleɪn/',
  understand: '/ˌʌndəˈstænd/', understood: '/ˌʌndəˈstʊd/',
  undertake: '/ˌʌndəˈteɪk/', undertook: '/ˌʌndəˈtʊk/', undertaken: '/ˌʌndəˈteɪkən/',
  undo: '/ʌnˈduː/', undid: '/ʌnˈdɪd/', undone: '/ʌnˈdʌn/',
  unwind: '/ʌnˈwaɪnd/', unwound: '/ʌnˈwaʊnd/',
  uphold: '/ʌpˈhəʊld/', upheld: '/ʌpˈheld/',
  upset: '/ʌpˈset/',
  wake: '/weɪk/', woke: '/wəʊk/', woken: '/ˈwəʊkən/',
  wear: '/weə/', wore: '/wɔː/', worn: '/wɔːn/',
  weave: '/wiːv/', wove: '/wəʊv/', woven: '/ˈwəʊvən/',
  wed: '/wed/', wedded: '/ˈwedɪd/',
  weep: '/wiːp/', wept: '/wept/',
  wet: '/wet/', wetted: '/ˈwetɪd/',
  win: '/wɪn/', won: '/wʌn/',
  wind: '/waɪnd/', wound: '/waʊnd/',
  withdraw: '/wɪðˈdrɔː/', withdrew: '/wɪðˈdruː/', withdrawn: '/wɪðˈdrɔːn/',
  withhold: '/wɪðˈhəʊld/', withheld: '/wɪðˈheld/',
  withstand: '/wɪðˈstænd/', withstood: '/wɪðˈstʊd/',
  wring: '/rɪŋ/', wrung: '/rʌŋ/',
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

const COMPOUND_PREFIXES = [
  ['inter', 'ˌɪntə'],
  ['under', 'ˌʌndə'],
  ['over', 'ˌəʊvə'],
  ['fore', 'fɔː'],
  ['out', 'ˌaʊt'],
  ['mis', 'ˌmɪs'],
  ['pre', 'ˌpriː'],
  ['re', 'ˌriː'],
  ['un', 'ʌn'],
  ['in', 'ɪn']
];

export function getCachedWordIpa(word) {
  const key = String(word || '').toLowerCase().trim();
  if (!key) return '';
  if (LOCAL_IPA[key]) return LOCAL_IPA[key];
  for (const [pref, prefIpa] of COMPOUND_PREFIXES) {
    if (key.startsWith(pref) && key.length > pref.length + 1) {
      const stem = key.slice(pref.length);
      if (LOCAL_IPA[stem]) {
        return `/${prefIpa}${LOCAL_IPA[stem].replace(/^\/|\/$/g, '')}/`;
      }
    }
  }
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
