import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, Sparkles, RefreshCw, Play, Square, Pause, Trash2, ArrowRight 
} from 'lucide-react';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';

export default function SpeakingSoundcheckModal({
  isOpen,
  onClose,
  onPassedSoundcheck,
  examiner,
  speechEngine
}) {
  const [testedSpeaker, setTestedSpeaker] = useState(false);
  const [testedMic, setTestedMic] = useState(false);
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);
  const testAudioRef = useRef(null);

  const soundcheckClip = speechEngine.audioClips['soundcheck_clip'];

  const isChromium = typeof window !== 'undefined' && 
    (!!window.chrome || navigator.userAgent.indexOf('Edg') !== -1);

  // Auto clean mic on modal close
  useEffect(() => {
    if (!isOpen) {
      if (speechEngine.isListening) {
        speechEngine.stopListening();
      }
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
      setIsPlayingTestAudio(false);
      setTestedSpeaker(false);
      setTestedMic(false);
    }
  }, [isOpen, speechEngine]);

  if (!isOpen) return null;

  const handleTestSpeaker = () => {
    speechEngine.speak(
      `Hello! Can you hear me clearly? I am ${examiner.name}, and this is your equipment soundcheck before we enter the examination room.`,
      { examinerId: examiner.id },
      () => {
        setTestedSpeaker(true);
      }
    );
  };

  const handleToggleMicTest = async () => {
    if (speechEngine.isListening) {
      speechEngine.stopListening();
      setTestedMic(true);
    } else {
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip('soundcheck_clip');
      }
      await speechEngine.startListening('soundcheck_clip');
      setTestedMic(true);
    }
  };

  const handleTogglePlayTestAudio = () => {
    if (!soundcheckClip?.url) return;
    if (!testAudioRef.current) {
      testAudioRef.current = new Audio(soundcheckClip.url);
      testAudioRef.current.onended = () => setIsPlayingTestAudio(false);
      testAudioRef.current.onerror = () => setIsPlayingTestAudio(false);
    } else if (testAudioRef.current.src !== soundcheckClip.url) {
      testAudioRef.current.src = soundcheckClip.url;
      testAudioRef.current.onended = () => setIsPlayingTestAudio(false);
      testAudioRef.current.onerror = () => setIsPlayingTestAudio(false);
    }

    if (isPlayingTestAudio) {
      testAudioRef.current.pause();
      testAudioRef.current.currentTime = 0;
      setIsPlayingTestAudio(false);
    } else {
      testAudioRef.current.play().then(() => {
        setIsPlayingTestAudio(true);
      }).catch(err => {
        console.warn('Audio playback error:', err);
        setIsPlayingTestAudio(false);
      });
    }
  };

  const handleConfirmAndClearClip = () => {
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      setIsPlayingTestAudio(false);
    }
    if (speechEngine.deleteAudioClip) {
      speechEngine.deleteAudioClip('soundcheck_clip');
    }
    setTestedMic(true);
  };

  const canProceed = testedSpeaker && testedMic;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/60 to-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Kiểm Tra Thiết Bị (Soundcheck)</h3>
              <p className="text-xs text-slate-400">Đảm bảo Loa và Micro hoạt động tốt trước khi vào thi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Steps */}
        <div className="p-6 space-y-5">
          
          {/* Browser check indicator */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-300">
                {isChromium ? 'Trình duyệt tối ưu (Chrome / Edge)' : 'Khuyên dùng Chrome/Edge để có STT tốt nhất'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              Sẵn sàng
            </span>
          </div>

          {/* STEP 1: Test Speaker (TTS) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/50">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bước 1: Kiểm tra Loa / Tai nghe</h4>
                  <p className="text-[11px] text-slate-400">Giọng giám khảo: {examiner.name} ({examiner.accent})</p>
                </div>
              </div>
              {testedSpeaker && (
                <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã nghe rõ</span>
                </span>
              )}
            </div>

            <button
              onClick={handleTestSpeaker}
              disabled={speechEngine.isSpeaking}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-bold border border-purple-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{speechEngine.isSpeaking ? 'Giám khảo đang nói...' : 'Bấm để nghe thử giọng Giám khảo'}</span>
            </button>
          </div>

          {/* STEP 2: Test Microphone (STT & Volume) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  speechEngine.isListening 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {speechEngine.isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bước 2: Kiểm tra Micro</h4>
                  <p className="text-[11px] text-slate-400">Nói thử một câu bất kỳ để kiểm tra sóng âm & giọng nói</p>
                </div>
              </div>

              {/* Status Badge with distinctive colors */}
              <div className="flex items-center space-x-1.5">
                {speechEngine.isListening ? (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-extrabold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>REC • ĐANG GHI ÂM</span>
                  </span>
                ) : testedMic ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Micro tốt</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                    <span>ĐÃ TẮT MIC</span>
                  </span>
                )}
              </div>
            </div>

            {/* Live Waveform Box */}
            <div className={`h-16 rounded-xl border overflow-hidden relative flex items-center justify-center transition-all ${
              speechEngine.isListening 
                ? 'bg-slate-900 border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/50' 
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <SpeechWaveVisualizer 
                mode={speechEngine.isListening ? 'candidate_speaking' : 'idle'}
                analyserNode={speechEngine.analyserNode}
                className="w-full h-full"
              />
              {!speechEngine.isListening && !soundcheckClip && (
                <span className="absolute text-[11px] text-slate-500 pointer-events-none">
                  Sóng âm sẽ hiển thị khi bạn bật Micro
                </span>
              )}
            </div>

            {/* Mic Error Prompt if blocked */}
            {speechEngine.speechError === 'not-allowed' && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Trình duyệt đang chặn Micro!</span>
                </div>
                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  Hãy bấm vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ trình duyệt, chọn <strong>Cho phép (Allow) Micro</strong> rồi thử lại.
                </p>
              </div>
            )}

            {/* Live Transcript Preview */}
            {speechEngine.isListening && (
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold mr-1">Nghe được:</span>
                <span>{speechEngine.transcript || speechEngine.interimTranscript || 'Đang lắng nghe bạn nói...'}</span>
              </div>
            )}

            {/* Big Distinctive Toggle Button */}
            <button
              onClick={handleToggleMicTest}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                speechEngine.isListening 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50 ring-2 ring-rose-400 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
              }`}
            >
              {speechEngine.isListening ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>DỪNG THỬ MICRO (HOÀN TẤT NÓI)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>BẬT MICRO & NÓI THỬ 1 CÂU</span>
                </>
              )}
            </button>

            {/* Playback & Zero RAM Verification Box */}
            {soundcheckClip && !speechEngine.isListening && (
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-white">Đoạn âm thanh thử bạn vừa nói ({soundcheckClip.duration || 1}s):</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/40">
                    RAM-Only
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlayTestAudio}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isPlayingTestAudio
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/40'
                    }`}
                  >
                    {isPlayingTestAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Tạm Dừng Nghe</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>🔊 Nghe Lại Giọng Của Bạn</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleConfirmAndClearClip}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Âm thanh đã rõ, xóa file tạm để giải phóng bộ nhớ RAM web"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Âm Thanh Đạt Chuẩn (Xóa File Tạm)</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  💡 Giọng bạn được lưu tạm trên RAM để kiểm tra âm lượng. Khi bạn bấm "Âm Thanh Đạt Chuẩn" hoặc thoát phòng thi, dữ liệu âm thanh sẽ lập tức được xóa hoàn toàn khỏi bộ nhớ.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Footer Proceed Action */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
          >
            Quay Lại
          </button>

          <button
            onClick={() => {
              if (speechEngine.isListening) {
                speechEngine.stopListening();
              }
              if (testAudioRef.current) {
                testAudioRef.current.pause();
              }
              if (speechEngine.deleteAudioClip) {
                speechEngine.deleteAudioClip('soundcheck_clip');
              }
              onPassedSoundcheck();
            }}
            disabled={!canProceed}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-900/40 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Tôi Đã Sẵn Sàng Vào Phòng Thi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
