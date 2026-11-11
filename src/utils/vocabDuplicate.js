import { isEnglish } from '../i18n/i18nService';

export const normalizeVocabPhrase = (s) =>
  String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();

export function findDuplicateVocab(list, phrase) {
  const key = normalizeVocabPhrase(phrase);
  if (!key || !Array.isArray(list)) return null;
  return list.find((item) => normalizeVocabPhrase(item?.phrase) === key) || null;
}

function showDuplicateToast(phrase) {
  if (typeof document === 'undefined') return;
  const en = isEnglish();
  const el = document.createElement('div');
  el.setAttribute('role', 'alert');
  el.textContent = en
    ? `"${phrase}" already exists in your Vocab Vault.`
    : `"${phrase}" đã tồn tại trong sổ tay từ vựng của bạn.`;
  el.style.cssText =
    'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;' +
    'background:#b91c1c;color:#fff;padding:10px 16px;border-radius:12px;font-size:13px;' +
    'font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

/**
 * Adds a vocab item to the front of the list unless the phrase already exists.
 * Returns true if added, false if it was a duplicate (a warning toast is shown).
 */
export function addVocabUnique(list, item, setList) {
  const dup = findDuplicateVocab(list, item?.phrase);
  if (dup) {
    showDuplicateToast(dup.phrase);
    return false;
  }
  setList((prev) => (findDuplicateVocab(prev, item?.phrase) ? prev : [item, ...prev]));
  return true;
}
