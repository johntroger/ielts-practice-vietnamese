import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Volume2, Mic, Play, Pause, RotateCcw, CheckCircle2, 
  Sparkles, Headphones, ArrowRight, BookOpen, Layers, ShieldCheck 
} from 'lucide-react';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';

export default function SpeakingShadowingModal({
  isOpen,
  onClose,
  sampleText = '',
  topicTitle = '',
  examiner,
  speechEngine
}) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.9); // 0.8 | 0.9 | 1.0
  const [isRecordingShadow, setIsRecordingShadow] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const userAudioRef = useRef(null);

  // Split sample answer into manageable sentences for shadowing
  const sentences = React.useMemo(() => {
    if (!sampleText) return [];
    return sampleText
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 5);
  }, [sampleText]);

  const currentSentence = sentences[activeSentenceIndex] || sampleText;
  const shadowClipKey = `shadow_${activeSentenceIndex}`;
  const shadowClip = speechEngine.audioClips[shadowClipKey];

  useEffect(() => {
    if (!isOpen) {
      if (speechEngine.isListening) speechEngine.stopListening();
      if (userAudioRef.current) userAudioRef.current.pause();
      setIsPlayingUserAudio(false);
      setIsRecordingShadow(false);
      setActiveSentenceIndex(0);
    }
    return () => {
      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
          userAudioRef.current.src = '';
        } catch (e) {}
      }
    };
  }, [isOpen, speechEngine]);

  if (!isOpen || !sentences.length) return null;

  // TTS Examiner read current sentence
  const handlePlaySentence = () => {
    speechEngine.speak(
      currentSentence,
      { examinerId: examiner.id, rate: playbackSpeed }
    );
  };

  // Toggle user shadow recording
  const handleToggleShadowRecord = async () => {
    if (isRecordingShadow) {
      speechEngine.stopListening();
      setIsRecordingShadow(false);
    } else {
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip(shadowClipKey);
      }
      setIsRecordingShadow(true);
      await speechEngine.startListening(shadowClipKey);
    }
  };

  // Playback user shadow voice
  const handleTogglePlayUserAudio = () => {
    if (!shadowClip?.url) return;
    if (!userAudioRef.current) {
      userAudioRef.current = new Audio(shadowClip.url);
      userAudioRef.current.onended = () => setIsPlayingUserAudio(false);
      userAudioRef.current.onerror = () => setIsPlayingUserAudio(false);
    } else if (userAudioRef.current.src !== shadowClip.url) {
      userAudioRef.current.src = shadowClip.url;
      userAudioRef.current.onended = () => setIsPlayingUserAudio(false);
      userAudioRef.current.onerror = () => setIsPlayingUserAudio(false);
    }

    if (isPlayingUserAudio) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
      setIsPlayingUserAudio(false);
    } else {
      userAudioRef.current.play().then(() => {
        setIsPlayingUserAudio(true);
      }).catch(() => setIsPlayingUserAudio(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">Shadowing Studio (Luyện Ngữ Điệu 8.5)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Pronunciation & Intonation
                </span>
              </div>
              <p className="text-xs text-slate-400">Nghe từng câu mẫu chuẩn bản xứ và nhại lại theo ngữ điệu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sentence Progress Bar */}
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold">
            Câu {activeSentenceIndex + 1} / {sentences.length}
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 text-[11px]">Tốc độ đọc:</span>
            {[0.8, 0.9, 1.0].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Sentence Display Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
              Câu đang luyện phát âm:
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              "{currentSentence}"
            </p>
            
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handlePlaySentence}
                disabled={speechEngine.isSpeaking}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Volume2 className="w-4 h-4" />
                <span>{speechEngine.isSpeaking ? 'Giám khảo đang đọc...' : '1. Nghe Giám Khảo Đọc'}</span>
              </button>
            </div>
          </div>

          {/* User Shadow Practice Area */}
          <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
            isRecordingShadow 
              ? 'bg-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30' 
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                2. Nhại Lại Câu Này (Shadowing):
              </span>
              <div className="flex items-center space-x-2">
                {isRecordingShadow ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold animate-pulse">
                    REC • ĐANG GHI ÂM
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-semibold">
                    ĐÃ TẮT MIC
                  </span>
                )}
              </div>
            </div>

            {/* Visualizer */}
            <div className="h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <SpeechWaveVisualizer
                mode={isRecordingShadow ? 'candidate_speaking' : speechEngine.isSpeaking ? 'examiner_speaking' : 'idle'}
                analyserNode={speechEngine.analyserNode}
                className="w-full h-full"
              />
            </div>

            {/* Record / Stop Button */}
            <button
              onClick={handleToggleShadowRecord}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                isRecordingShadow
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-900/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecordingShadow ? 'Dừng Thu Âm Nhại Lại' : 'Bật Mic Để Nhại Lại'}</span>
            </button>

            {/* Playback Voice Shadow Clip */}
            {shadowClip && !isRecordingShadow && (
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Giọng bạn vừa nhại lại ({shadowClip.duration || 1}s):</span>
                  </span>
                  <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded">
                    RAM-Only
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlayUserAudio}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      isPlayingUserAudio 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {isPlayingUserAudio ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Tạm Dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>🔊 Nghe Lại & So Sánh Ngữ Điệu</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (userAudioRef.current) userAudioRef.current.pause();
                      setIsPlayingUserAudio(false);
                      if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(shadowClipKey);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1 cursor-pointer"
                    title="Xóa âm thanh tạm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OK & Xóa File Tạm</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            disabled={activeSentenceIndex === 0}
            onClick={() => {
              if (speechEngine.isListening) speechEngine.stopListening();
              setIsRecordingShadow(false);
              setActiveSentenceIndex(prev => prev - 1);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Câu Trước
          </button>

          <span className="text-[11px] text-slate-500">
            Lặp lại 2-3 lần mỗi câu để hình thành phản xạ ngữ điệu
          </span>

          <button
            disabled={activeSentenceIndex >= sentences.length - 1}
            onClick={() => {
              if (speechEngine.isListening) speechEngine.stopListening();
              setIsRecordingShadow(false);
              setActiveSentenceIndex(prev => prev + 1);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Câu Kế Tiếp →
          </button>
        </div>

      </div>
    </div>
  );
}
