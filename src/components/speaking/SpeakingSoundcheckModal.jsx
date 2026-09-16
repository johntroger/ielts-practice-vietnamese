import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, Sparkles, RefreshCw, Play, Square, Pause, Trash2, ArrowRight,
  RotateCcw, Check, Radio
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
  const [hasDetectedAudioWave, setHasDetectedAudioWave] = useState(false);
  const [audioErrorHint, setAudioErrorHint] = useState(null);
  const testAudioRef = useRef(null);

  const soundcheckClip = speechEngine.audioClips['soundcheck_clip'];

  const [showEdgeGuide, setShowEdgeGuide] = useState(false);

  // Accurate browser detection
  const isEdge = typeof window !== 'undefined' && /Edg\//i.test(navigator.userAgent);
  const isChrome = typeof window !== 'undefined' && /Chrome\//i.test(navigator.userAgent) && !isEdge;
  const isSafariOrFirefox = typeof window !== 'undefined' && !isChrome && !isEdge;

  // Auto-detect mic activity when micLevel > 12
  useEffect(() => {
    if (speechEngine.isListening && speechEngine.micLevel > 12) {
      setHasDetectedAudioWave(true);
      setTestedMic(true);
    }
  }, [speechEngine.isListening, speechEngine.micLevel]);

  // If speech recognition transcribes any word, mic is definitely working
  useEffect(() => {
    if (speechEngine.transcript || speechEngine.interimTranscript) {
      setTestedMic(true);
    }
  }, [speechEngine.transcript, speechEngine.interimTranscript]);

  // Clean mic & test audio on modal close
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
      setHasDetectedAudioWave(false);
      setAudioErrorHint(null);
      setShowEdgeGuide(false);
    }
  }, [isOpen, speechEngine]);

  if (!isOpen) return null;

  // STEP 1: Test Speaker with auto-pass + manual pass toggle
  const handleTestSpeaker = () => {
    setAudioErrorHint(null);
    try {
      // Warm up and wake up any audio contexts in case Edge user gesture suspended it
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }

      speechEngine.speak(
        `Hello! Can you hear me clearly? I am ${examiner.name}, and this is your equipment soundcheck before we enter the examination room.`,
        { examinerId: examiner.id },
        () => {
          setTestedSpeaker(true);
        }
      );
      // Auto enable pass after 2 seconds as user hears the prompt
      setTimeout(() => setTestedSpeaker(true), 1500);
    } catch (err) {
      console.warn('Speaker test error:', err);
      setAudioErrorHint('Trình duyệt chưa cho phép phát âm. Hãy bấm lại hoặc kiểm tra âm lượng máy tính.');
      setTestedSpeaker(true); // Allow candidate to override
    }
  };

  // STEP 2: Toggle Mic Test
  const handleToggleMicTest = async () => {
    setAudioErrorHint(null);
    if (speechEngine.isListening) {
      speechEngine.stopListening();
      setTestedMic(true);
    } else {
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip('soundcheck_clip');
      }
      try {
        await speechEngine.startListening('soundcheck_clip');
        setTestedMic(true);
      } catch (err) {
        console.warn('Start listening error:', err);
        setAudioErrorHint('Không thể kết nối Micro. Hãy kiểm tra quyền Micro của trình duyệt.');
      }
    }
  };

  // Playback candidate recorded audio clip
  const handleTogglePlayTestAudio = () => {
    if (!soundcheckClip?.url) return;
    try {
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
    } catch (e) {
      setIsPlayingTestAudio(false);
    }
  };

  // Confirm sound quality & revoke RAM blob
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

  // Can proceed if speaker is confirmed AND mic is confirmed/tested
  const canProceed = testedSpeaker && (testedMic || hasDetectedAudioWave || soundcheckClip);

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
              <p className="text-xs text-slate-400">Đảm bảo Loa và Micro hoạt động ổn định trước khi thi</p>
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
          {isChrome ? (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-200">
                  Trình duyệt tối ưu: Google Chrome (Khuyên Dùng 100%)
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 uppercase bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                Chuẩn Nhất
              </span>
            </div>
          ) : isEdge ? (
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start sm:items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <span className="font-semibold text-amber-200 leading-snug">
                  Đang dùng Edge: Khuyên dùng <strong>Google Chrome</strong> để có giọng đọc & micro mượt nhất
                </span>
              </div>
              <button
                onClick={() => setShowEdgeGuide(!showEdgeGuide)}
                className="self-end sm:self-auto text-[11px] font-bold text-amber-300 hover:text-white underline cursor-pointer shrink-0"
              >
                {showEdgeGuide ? 'Đóng mẹo' : 'Mẹo xử lý âm thanh Edge'}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold text-rose-200">
                  Khuyên dùng <strong>Google Chrome</strong> để hỗ trợ nhận diện giọng nói Speaking đầy đủ
                </span>
              </div>
              <span className="text-[10px] font-bold text-rose-300 uppercase bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700/50">
                Chú ý
              </span>
            </div>
          )}

          {/* Collapsible Edge Troubleshooting Box */}
          {showEdgeGuide && isEdge && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs space-y-2 animate-in fade-in duration-150">
              <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Hướng dẫn nếu Microsoft Edge không phát ra tiếng:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed pl-1">
                <li>Bấm vào biểu tượng <strong>Khóa (Bảo mật)</strong> trên thanh địa chỉ Edge $\rightarrow$ Chọn <strong>Quyền trang web</strong> $\rightarrow$ Bật <strong>Âm thanh (Sound)</strong> sang <em>Cho phép</em>.</li>
                <li>Vào Cài đặt Windows: <em>Settings $\rightarrow$ Privacy & Security $\rightarrow$ Speech</em> $\rightarrow$ Bật <strong>Online speech recognition</strong>.</li>
                <li><span className="text-emerald-400 font-semibold">Khuyến nghị nhanh nhất:</span> Mở đường dẫn này bằng trình duyệt <strong>Google Chrome</strong> để thi ngay mà không cần chỉnh cài đặt.</li>
              </ol>
            </div>
          )}

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

              {/* Status or Manual Toggle */}
              <button
                onClick={() => setTestedSpeaker(!testedSpeaker)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  testedSpeaker
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
                title="Bấm để xác nhận hoặc bỏ chọn"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{testedSpeaker ? 'Đã nghe rõ' : 'Chưa thử'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSpeaker}
                disabled={speechEngine.isSpeaking}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-bold border border-purple-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{speechEngine.isSpeaking ? 'Giám khảo đang nói...' : 'Bấm để nghe thử giọng Giám khảo'}</span>
              </button>

              {speechEngine.isSpeaking && (
                <button
                  onClick={speechEngine.stopSpeaking}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold border border-rose-500/30 cursor-pointer"
                  title="Dừng tiếng nói"
                >
                  Dừng
                </button>
              )}
            </div>
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
                  <p className="text-[11px] text-slate-400">Nói thử một câu để kiểm tra sóng âm & giọng nói</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-1.5">
                {speechEngine.isListening ? (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-extrabold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>REC • ĐANG BẬT MIC</span>
                  </span>
                ) : testedMic || hasDetectedAudioWave ? (
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
                  Sóng âm sẽ chuyển động khi bạn bật Micro
                </span>
              )}
            </div>

            {/* Mic Error Prompt if blocked */}
            {(speechEngine.speechError === 'not-allowed' || audioErrorHint) && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 space-y-1 animate-in fade-in duration-150">
                <div className="font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{speechEngine.speechError === 'not-allowed' ? 'Trình duyệt đang chặn Micro!' : 'Lưu ý âm thanh'}</span>
                </div>
                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  {audioErrorHint || 'Hãy bấm vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ trình duyệt, chọn Cho phép (Allow) Micro rồi thử lại.'}
                </p>
              </div>
            )}

            {/* Live Transcript Preview */}
            {speechEngine.isListening && (
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold mr-1">Nghe được:</span>
                  <span>{speechEngine.transcript || speechEngine.interimTranscript || 'Đang lắng nghe bạn nói...'}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">
                  {speechEngine.micLevel}%
                </span>
              </div>
            )}

            {/* Distinctive Toggle Button */}
            <button
              onClick={handleToggleMicTest}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                speechEngine.isListening 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 ring-2 ring-rose-400 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
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
                    <span>Âm Thanh Rõ & Xóa File Tạm</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick manual mic validation fallback */}
            {!testedMic && !soundcheckClip && !speechEngine.isListening && (
              <div className="text-center pt-1">
                <button
                  onClick={() => setTestedMic(true)}
                  className="text-[11px] text-slate-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Micro tôi vẫn hoạt động tốt, bỏ qua kiểm tra micro
                </button>
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
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-900/40 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Tôi Đã Sẵn Sàng Vào Phòng Thi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
