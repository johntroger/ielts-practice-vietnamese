import React, { useState } from 'react';
import {
  X,
  Music,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Link,
  FileText
} from 'lucide-react';
import { useTranslation } from '../../i18n/index.js';
import { saveAudioBlob, getAudioPlayableUrl } from '../../utils/audioStorage.js';
import { parseLrcToMusicLines } from '../../utils/musicDictationGenerator.js';
import { MUSIC_GENRES } from '../../data/musicListeningData.js';

export default function MusicCustomSongModal({
  isOpen,
  onClose,
  onAddCustomSong
}) {
  const { isEn } = useTranslation();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genreId, setGenreId] = useState('acoustic_folk');
  const [bpm, setBpm] = useState('96');
  const [audioUrl, setAudioUrl] = useState('');
  const [localAudioId, setLocalAudioId] = useState(null);
  const [localFileName, setLocalFileName] = useState('');
  const [lrcContent, setLrcContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    setErrorMsg('');
    try {
      const id = `custom-music-blob-${Date.now()}`;
      await saveAudioBlob(id, file, { name: file.name });
      const playableUrl = await getAudioPlayableUrl(id);
      if (playableUrl) {
        setLocalAudioId(id);
        setLocalFileName(file.name);
        setAudioUrl(playableUrl);
        if (!title) {
          setTitle(file.name.replace(/\.(mp3|wav|m4a|ogg)$/i, '').replace(/[-_]/g, ' '));
        }
      }
    } catch (err) {
      setErrorMsg(
        isEn
          ? 'Could not cache audio file locally. Please try pasting a direct MP3/R2 URL.'
          : 'Không thể lưu file nhạc cục bộ. Vui lòng thử dán đường dẫn MP3/R2 trực tiếp.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanTitle = title.trim();
    const cleanUrl = audioUrl.trim();
    const cleanLrc = lrcContent.trim();

    if (!cleanTitle) {
      setErrorMsg(isEn ? 'Please enter a song title.' : 'Vui lòng nhập tên bài hát.');
      return;
    }
    if (!cleanUrl) {
      setErrorMsg(
        isEn
          ? 'Please provide an R2 / MP3 audio URL or upload an MP3 file.'
          : 'Vui lòng dán đường dẫn nhạc R2 / MP3 hoặc tải file MP3 từ máy.'
      );
      return;
    }
    if (!cleanLrc) {
      setErrorMsg(
        isEn
          ? 'Please paste the song lyrics (with [MM:SS] LRC timestamps or plain lines).'
          : 'Vui lòng dán lời bài hát (định dạng [MM:SS] .LRC hoặc từng dòng lời).'
      );
      return;
    }

    const lines = parseLrcToMusicLines(cleanLrc, 210);
    if (lines.length === 0) {
      setErrorMsg(
        isEn
          ? 'Could not parse any valid lyric lines. Please check your lyrics input.'
          : 'Không phân tích được câu hát nào hợp lệ. Vui lòng kiểm tra lại lời bài hát.'
      );
      return;
    }

    const lastLineEnd = lines[lines.length - 1]?.end || 180;
    const customTrack = {
      id: `custom-music-${Date.now()}`,
      isCustom: true,
      localAudioId: localAudioId || null,
      genreId: genreId || 'acoustic_folk',
      title: cleanTitle,
      titleEn: cleanTitle,
      titleVi: cleanTitle,
      artist: artist.trim() || (isEn ? 'Custom Artist' : 'Nghệ sĩ Tự chọn'),
      license: 'Custom Practice Track',
      bandTarget: '5.5 - 7.5',
      bpm: Number(bpm) || 96,
      accentEn: 'Custom English Track',
      accentVi: 'Bài Nhạc Tự Chọn',
      source: localAudioId ? 'indexeddb_local' : 'cloudflare_r2_custom',
      audioUrl: cleanUrl,
      fallbackAudioUrl: cleanUrl,
      audioDuration: Math.max(60, Math.ceil(lastLineEnd + 8)),
      coverGradient: 'from-purple-600 via-pink-600 to-rose-600',
      pedagogicalFocusEn: 'Custom song dictation practice across all 4 modes (Full, Sentence, Word, Mixed).',
      pedagogicalFocusVi: 'Bài nhạc tự nạp luyện chép lời trên cả 4 chế độ (Nguyên bài, Trống câu, Trống từ, Kết hợp).',
      lines,
      vocabHighlights: []
    };

    onAddCustomSong?.(customTrack);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                {isEn ? 'Import Custom Song & LRC Lyrics' : 'Tự Nạp Bài Nhạc & Lời Bài Hát (.LRC)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Paste a Cloudflare R2 / MP3 link or upload an MP3 file with [MM:SS] lyrics'
                  : 'Dán link nhạc Cloudflare R2 / MP3 hoặc tải file MP3 kèm lời định dạng [MM:SS]'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? 'Song Title *' : 'Tên bài hát *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isEn ? 'e.g. Perfect Acoustic' : 'VD: Perfect Acoustic'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? 'Artist / Singer' : 'Ca sĩ / Nghệ sĩ'}
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder={isEn ? 'e.g. Ed Sheeran' : 'VD: Ed Sheeran'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? 'Music Genre' : 'Thể loại nhạc'}
              </label>
              <select
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              >
                {MUSIC_GENRES.filter(g => g.id !== 'all').map(g => (
                  <option key={g.id} value={g.id}>
                    {isEn ? g.labelEn : g.labelVi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? 'Tempo (BPM)' : 'Tốc độ nhịp (BPM)'}
              </label>
              <input
                type="number"
                min="50"
                max="200"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Audio Source: R2 URL or Local MP3 File */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isEn
                ? 'Audio Source (Cloudflare R2 URL or Local MP3 Upload) *'
                : 'Nguồn phát nhạc (Link Cloudflare R2 / MP3 hoặc Tải file từ máy) *'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={audioUrl}
                  onChange={(e) => {
                    setAudioUrl(e.target.value);
                    setLocalAudioId(null);
                    setLocalFileName('');
                  }}
                  placeholder="https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/music-your-track.mp3"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <label className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold cursor-pointer shrink-0">
                <UploadCloud className="w-4 h-4" />
                <span>
                  {isSaving
                    ? (isEn ? 'Caching...' : 'Đang nạp...')
                    : localFileName
                    ? (isEn ? 'Change MP3' : 'Đổi file MP3')
                    : (isEn ? 'Upload .MP3' : 'Chọn file .MP3')}
                </span>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {localFileName && (
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? `Cached locally in IndexedDB: ${localFileName}`
                    : `Đã lưu cục bộ vào IndexedDB: ${localFileName}`}
                </span>
              </div>
            )}
          </div>

          {/* LRC Lyrics Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  {isEn
                    ? 'Song Lyrics (.LRC [MM:SS.xx] or Plain Lines) *'
                    : 'Lời bài hát (Chuẩn .LRC [MM:SS.xx] hoặc từng dòng) *'}
                </span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setLrcContent(
                    `[00:05.00] Walking down the quiet avenue tonight\n[00:10.50] Every streetlamp shining with a golden light\n[00:16.20] Whispering the promises we used to know\n[00:22.00] Watching all the autumn shadows softly grow`
                  )
                }
                className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
              >
                {isEn ? 'Insert Sample .LRC' : 'Chèn mẫu .LRC'}
              </button>
            </div>
            <textarea
              rows={7}
              value={lrcContent}
              onChange={(e) => setLrcContent(e.target.value)}
              placeholder={
                isEn
                  ? '[00:12.40] First line of the song...\n[00:17.80] Second line of the song...'
                  : '[00:12.40] Câu hát thứ nhất...\n[00:17.80] Câu hát thứ hai...'
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Submit Row */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Hủy'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Create & Start Dictation' : 'Tạo Bài & Bắt Đầu Chép Lời'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
