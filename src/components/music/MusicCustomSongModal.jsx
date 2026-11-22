import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Music,
  Sparkles,
  CheckCircle2,
  Link,
  FileText,
  Youtube,
  Lock,
  Wand2,
  Loader2,
  LogIn
} from 'lucide-react';
import { useTranslation } from '../../i18n/index.js';
import { parseLrcToMusicLines } from '../../utils/musicDictationGenerator.js';
import { MUSIC_GENRES } from '../../data/musicListeningData.js';

/**
 * Extracts an 11-character YouTube Video ID from any YouTube URL format
 * (youtube.com/watch?v=, youtu.be/, music.youtube.com/watch?v=, youtube.com/embed/, shorts/)
 * or returns null if the URL is a direct audio stream link.
 */
export function extractYouTubeId(rawInput = '') {
  const input = String(rawInput || '').trim();
  if (!input) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|music\.youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/(?:embed|shorts|live|v)\/)([a-zA-Z0-9_-]{11})/i
  ];
  for (const regex of patterns) {
    const match = input.match(regex);
    if (match && match[1]) return match[1];
  }
  return null;
}

/**
 * Cleans up raw YouTube video titles like "Ed Sheeran - Perfect (Official Music Video) [Lyrics]"
 * into { artist, title }.
 */
function parseYouTubeVideoTitle(rawVideoTitle = '', rawAuthorName = '') {
  let cleaned = String(rawVideoTitle || '')
    .replace(/\[[^\]]*?(official|lyric|audio|video|hd|4k|hq|mv|visualizer)[^\]]*?\]/gi, '')
    .replace(/\([^)]*?(official|lyric|audio|video|hd|4k|hq|mv|visualizer)[^)]*?\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  let fallbackArtist = String(rawAuthorName || '')
    .replace(/\s*(-?\s*Topic|VEVO|Official)$/i, '')
    .trim();

  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    const possibleArtist = parts[0].trim();
    const possibleTitle = parts.slice(1).join(' - ').replace(/^["'“”]+|["'“”]+$/g, '').trim();
    return {
      artist: possibleArtist || fallbackArtist,
      title: possibleTitle || cleaned
    };
  }

  return {
    artist: fallbackArtist,
    title: cleaned
  };
}

export default function MusicCustomSongModal({
  isOpen,
  onClose,
  onAddCustomSong,
  currentUser = null,
  onOpenAuth
}) {
  const { isEn } = useTranslation();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genreId, setGenreId] = useState('pop_ballad');
  const [bpm, setBpm] = useState('96');
  const [sourceUrl, setSourceUrl] = useState('');
  const [lrcContent, setLrcContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isFetchingLrc, setIsFetchingLrc] = useState(false);

  const detectedYoutubeId = extractYouTubeId(sourceUrl);

  // Auto-fetch YouTube Synced LRC from LRCLIB public CORS API
  const handleAutoFetchLrc = useCallback(
    async (overrideTitle, overrideArtist, silent = false) => {
      const qTitle = String(overrideTitle ?? title).trim();
      const qArtist = String(overrideArtist ?? artist).trim();
      if (!qTitle) {
        if (!silent) {
          setErrorMsg(
            isEn
              ? 'Please enter the Song Title (or paste a YouTube link) before auto-fetching lyrics.'
              : 'Vui lòng nhập Tên bài hát (hoặc dán link YouTube) trước khi tự động tìm lời .LRC.'
          );
        }
        return;
      }

      setIsFetchingLrc(true);
      setErrorMsg('');
      if (!silent) setInfoMsg('');

      try {
        const query = qArtist ? `${qTitle} ${qArtist}` : qTitle;
        const res = await fetch(
          `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error('LRCLIB search failed');
        const list = await res.json();

        if (Array.isArray(list) && list.length > 0) {
          // Prefer entry with timestamped syncedLyrics
          const bestSynced =
            list.find((item) => item?.syncedLyrics && item.syncedLyrics.trim().length > 40) ||
            list[0];

          if (bestSynced?.syncedLyrics) {
            setLrcContent(bestSynced.syncedLyrics.trim());
            setInfoMsg(
              isEn
                ? `Auto-loaded synced [MM:SS] .LRC lyrics for "${bestSynced.trackName || qTitle}"!`
                : `Đã tự động nạp lời .LRC khớp mốc thời gian [MM:SS] cho bài "${bestSynced.trackName || qTitle}"!`
            );
            return;
          }
          if (bestSynced?.plainLyrics) {
            setLrcContent(bestSynced.plainLyrics.trim());
            setInfoMsg(
              isEn
                ? `Loaded plain lyrics for "${bestSynced.trackName || qTitle}" (timestamps will be distributed automatically).`
                : `Đã nạp lời bài hát cho "${bestSynced.trackName || qTitle}" (hệ thống sẽ tự phân bổ mốc thời gian).`
            );
            return;
          }
        }

        if (!silent) {
          setErrorMsg(
            isEn
              ? 'Could not find synced .LRC automatically for this song. Please paste the lyrics manually below.'
              : 'Chưa tìm thấy lời .LRC tự động cho bài này. Bạn hãy copy và dán lời bài hát vào ô bên dưới nhé.'
          );
        }
      } catch (e) {
        if (!silent) {
          setErrorMsg(
            isEn
              ? 'Lyrics lookup service is unreachable right now. Please paste the lyrics manually.'
              : 'Không thể kết nối kho lời .LRC tự động. Vui lòng dán lời bài hát thủ công.'
          );
        }
      } finally {
        setIsFetchingLrc(false);
      }
    },
    [title, artist, isEn]
  );

  // When a valid YouTube ID is detected, auto-fetch video Title & Artist via YouTube oEmbed
  useEffect(() => {
    if (!isOpen || !detectedYoutubeId) return;
    let cancelled = false;
    setIsFetchingMeta(true);

    const watchUrl = `https://www.youtube.com/watch?v=${detectedYoutubeId}`;
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const parsed = parseYouTubeVideoTitle(data.title, data.author_name);
        setTitle((prev) => prev.trim() || parsed.title);
        setArtist((prev) => prev.trim() || parsed.artist);

        // If lyrics box is still empty, automatically try fetching synced .LRC for this YouTube song!
        setLrcContent((prevLrc) => {
          if (!prevLrc.trim() && parsed.title) {
            handleAutoFetchLrc(parsed.title, parsed.artist, true);
          }
          return prevLrc;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsFetchingMeta(false);
      });

    return () => {
      cancelled = true;
    };
  }, [detectedYoutubeId, isOpen, handleAutoFetchLrc]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser?.id) {
      setErrorMsg(
        isEn
          ? 'Please sign in to save custom songs privately to your personal account.'
          : 'Vui lòng đăng nhập để lưu bài nhạc riêng tư vào tài khoản cá nhân của bạn.'
      );
      return;
    }

    const cleanTitle = title.trim();
    const cleanUrl = sourceUrl.trim();
    const cleanLrc = lrcContent.trim();

    if (!cleanUrl) {
      setErrorMsg(
        isEn
          ? 'Please paste a YouTube link or a direct online audio URL (.mp3 / .m4a / R2).'
          : 'Vui lòng dán đường dẫn YouTube hoặc link nhạc trực tuyến (.mp3 / .m4a / R2).'
      );
      return;
    }

    // Strictly block local file blobs or base64 data URLs to protect web storage
    if (/^(blob:|data:|file:)/i.test(cleanUrl)) {
      setErrorMsg(
        isEn
          ? 'Direct file uploads are disabled to save web storage. Please paste a YouTube URL or an online audio link (https://...).'
          : 'Hệ thống không nhận file tải lên để tiết kiệm bộ nhớ web. Vui lòng dán link YouTube hoặc link nhạc trực tuyến (https://...).'
      );
      return;
    }

    if (!detectedYoutubeId && !/^https?:\/\//i.test(cleanUrl)) {
      setErrorMsg(
        isEn
          ? 'Please enter a valid YouTube link (youtube.com / youtu.be) or an https:// audio link.'
          : 'Vui lòng nhập link YouTube hợp lệ (youtube.com / youtu.be) hoặc link nhạc bắt đầu bằng https://.'
      );
      return;
    }

    if (!cleanTitle) {
      setErrorMsg(isEn ? 'Please enter a song title.' : 'Vui lòng nhập tên bài hát.');
      return;
    }

    if (!cleanLrc) {
      setErrorMsg(
        isEn
          ? 'Please auto-fetch or paste the song lyrics (with [MM:SS] LRC timestamps or plain lines).'
          : 'Vui lòng bấm "Tự lấy lời .LRC" hoặc dán lời bài hát vào ô bên dưới.'
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
    const isYt = Boolean(detectedYoutubeId);

    const customTrack = {
      id: `custom-music-${currentUser.id.slice(0, 8)}-${Date.now()}`,
      isCustom: true,
      ownerUserId: currentUser.id,
      ownerEmail: currentUser.email || '',
      genreId: genreId || 'pop_ballad',
      title: cleanTitle,
      titleEn: cleanTitle,
      titleVi: cleanTitle,
      artist: artist.trim() || (isEn ? 'Custom Artist' : 'Nghệ sĩ Tự chọn'),
      license: isYt ? 'YouTube Official Embed (Personal Account)' : 'External Audio Stream Link (Personal Account)',
      bandTarget: '5.5 - 7.5',
      bpm: Number(bpm) || 96,
      accentEn: isYt ? 'YouTube Stream' : 'External Audio Link',
      accentVi: isYt ? 'Phát từ YouTube' : 'Phát từ Link Nhạc',
      sourceType: isYt ? 'youtube' : 'r2',
      source: isYt ? 'youtube_custom_link' : 'external_audio_url',
      youtubeId: isYt ? detectedYoutubeId : undefined,
      audioUrl: isYt ? '' : cleanUrl,
      fallbackAudioUrl: isYt ? '' : cleanUrl,
      externalSourceUrl: cleanUrl,
      audioDuration: Math.max(60, Math.ceil(lastLineEnd + 8)),
      coverGradient: 'from-purple-600 via-pink-600 to-rose-600',
      pedagogicalFocusEn: 'Personal song linked via external stream URL across all 4 dictation modes.',
      pedagogicalFocusVi: 'Bài nhạc cá nhân gắn qua link trực tuyến trên cả 4 chế độ chép lời.',
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
                {isEn ? 'Link Personal Song (YouTube / Audio URL)' : 'Gắn Link Nhạc Cá Nhân (YouTube / Link Nhạc)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Stream directly from a YouTube link or online audio URL — 0 MB web storage used'
                  : 'Phát trực tiếp từ link YouTube hoặc link nhạc online — Không tải file lên web (0 MB)'}
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

        {/* Account Privacy Guard / Banner */}
        {!currentUser?.id ? (
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isEn
                  ? 'Sign In to Create Your Private Song List'
                  : 'Đăng Nhập Để Tạo Kho Nhạc Cá Nhân Riêng Tư'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Personal linked songs belong strictly to your account and are visible only to you across devices without taking up web file storage.'
                  : 'Các bài nhạc gắn link được lưu riêng tư theo từng tài khoản — tài khoản của ai chỉ hiển thị cho người đó và hoàn toàn không tốn dung lượng tải file lên web.'}
              </p>
            </div>
            <div className="flex items-center space-x-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Đóng'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onOpenAuth?.();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-extrabold inline-flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isEn ? 'Sign In Now' : 'Đăng Nhập Ngay'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Per-Account Isolation Notice */}
            <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 truncate">
                  {isEn
                    ? `Private to your account (${currentUser.email || 'Member'}) — only visible to you`
                    : `Lưu riêng cho tài khoản (${currentUser.email || 'Thành viên'}) — chỉ hiển thị cho mình bạn`}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold shrink-0">
                {isEn ? 'Link Only • 0 MB' : 'Chỉ dùng Link • 0 MB'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {infoMsg && !errorMsg && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* 1. YouTube Link or External Audio URL Input (Primary Field!) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isEn
                  ? '1. Paste YouTube Link or Direct Audio URL (.mp3 / .m4a) *'
                  : '1. Dán Link YouTube hoặc Link Nhạc Trực Tuyến (.mp3 / .m4a) *'}
              </label>
              <div className="relative">
                {detectedYoutubeId ? (
                  <Youtube className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={
                    isEn
                      ? 'https://www.youtube.com/watch?v=... or https://.../song.mp3'
                      : 'https://www.youtube.com/watch?v=... hoặc https://.../song.mp3'
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Instant YouTube Stream Detection Preview Card */}
              {detectedYoutubeId && (
                <div className="p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={`https://i.ytimg.com/vi/${detectedYoutubeId}/mqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      className="w-16 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase">
                          YouTube
                        </span>
                        <span className="text-xs font-bold text-emerald-400 truncate">
                          {isFetchingMeta
                            ? (isEn ? 'Auto-detecting song title...' : 'Đang tự nhận diện tên bài hát...')
                            : (isEn ? 'Ready to stream directly' : 'Đã nhận diện — Phát trực tiếp không tốn bộ nhớ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        Video ID: <span className="font-mono text-slate-200">{detectedYoutubeId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Song Title & Artist (Auto-filled from YouTube or manually editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEn ? '2. Song Title *' : '2. Tên bài hát *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isEn ? 'e.g. Perfect' : 'VD: Perfect'}
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

            {/* 3. LRC Lyrics Input + 1-Click Auto-Fetch Synced .LRC */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    {isEn
                      ? '3. Song Lyrics (.LRC [MM:SS.xx] or Plain Lines) *'
                      : '3. Lời bài hát (Chuẩn .LRC [MM:SS.xx] hoặc từng dòng) *'}
                  </span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleAutoFetchLrc(title, artist, false)}
                    disabled={isFetchingLrc}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-extrabold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isFetchingLrc ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    <span>
                      {isFetchingLrc
                        ? (isEn ? 'Searching .LRC...' : 'Đang tìm lời .LRC...')
                        : (isEn ? 'Auto-Fetch Synced .LRC' : 'Tự tìm lời .LRC khớp nhạc')}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setLrcContent(
                        `[00:05.00] Walking down the quiet avenue tonight\n[00:10.50] Every streetlamp shining with a golden light\n[00:16.20] Whispering the promises we used to know\n[00:22.00] Watching all the autumn shadows softly grow`
                      )
                    }
                    className="text-[11px] font-bold text-slate-500 hover:text-purple-600 hover:underline cursor-pointer"
                  >
                    {isEn ? 'Sample .LRC' : 'Mẫu .LRC'}
                  </button>
                </div>
              </div>
              <textarea
                rows={6}
                value={lrcContent}
                onChange={(e) => setLrcContent(e.target.value)}
                placeholder={
                  isEn
                    ? 'Paste a YouTube link above to auto-load synced [MM:SS] lyrics, or paste your .LRC / plain lyrics here...'
                    : 'Dán link YouTube ở trên để hệ thống tự tìm lời [MM:SS] .LRC, hoặc tự dán lời bài hát vào đây...'
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
                <span>{isEn ? 'Save to My Account & Practice' : 'Lưu Vào Tài Khoản & Luyện Tập'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
