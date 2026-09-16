import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Play, Pause, Square, RotateCcw, CheckCircle2, 
  Sparkles, BookOpen, Layers, Clock, Award, Shield, Compass, Headphones, 
  ChevronRight, ArrowRight, Lightbulb, Copy, Info, AlertCircle 
} from 'lucide-react';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';
import { speakingSoundEffects } from '../../utils/speakingSoundEffects';

export default function SpeakingPracticePane({
  practicePart = 1,
  setPracticePart,
  // Part 1 data & state
  part1Topics = [],
  selectedP1TopicId,
  setSelectedP1TopicId,
  activeP1QuestionIndex,
  setActiveP1QuestionIndex,
  // Part 2 data & state
  part2Cards = [],
  selectedP2CueCardId,
  setSelectedP2CueCardId,
  // Part 3 data & state
  part3Sets = [],
  activeP3Set,
  // Engine & callbacks
  speechEngine,
  activeExaminer,
  onOpenIdeaMatrix,
  onOpenShadowing,
  onSaveToVocabNotebook
}) {
  // Common state
  const [showVocabHints, setShowVocabHints] = useState(true);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isPlayingPracticeAudio, setIsPlayingPracticeAudio] = useState(false);
  const practiceAudioRef = useRef(null);

  // Part 2 Specific Timers & Pacing State
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [speakSecondsElapsed, setSpeakSecondsElapsed] = useState(0);
  const [isPart2Speaking, setIsPart2Speaking] = useState(false);
  const prepTimerRef = useRef(null);
  const speakTimerRef = useRef(null);

  // Active items
  const activeP1Topic = part1Topics.find(t => t.id === selectedP1TopicId) || part1Topics[0] || {};
  const activeP2Card = part2Cards.find(c => c.id === selectedP2CueCardId) || part2Cards[0] || {};
  const currentP1Question = activeP1Topic.questions?.[activeP1QuestionIndex] || null;

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      if (practiceAudioRef.current) practiceAudioRef.current.pause();
    };
  }, [practicePart]);

  // Read examiner text
  const handleReadText = (text) => {
    speechEngine.speak(text, { examinerId: activeExaminer.id });
  };

  // Toggle generic practice recording
  const handleTogglePracticeRecord = (clipKey) => {
    if (speechEngine.isListening) {
      speechEngine.stopListening();
    } else {
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(clipKey);
      speechEngine.startListening(clipKey);
    }
  };

  // -------------------------------------------------------------
  // PART 2 PREP TIMER & PACING LOGIC
  // -------------------------------------------------------------
  const handleStartPart2Prep = () => {
    if (isPrepping) {
      clearInterval(prepTimerRef.current);
      setIsPrepping(false);
      return;
    }

    setPrepSecondsRemaining(60);
    setIsPrepping(true);

    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    prepTimerRef.current = setInterval(() => {
      setPrepSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          setIsPrepping(false);
          speakingSoundEffects.playPrepTimeEndChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTogglePart2Speaking = async () => {
    const clipKey = `p2_${activeP2Card.id}`;
    if (isPart2Speaking || speechEngine.isListening) {
      clearInterval(speakTimerRef.current);
      setIsPart2Speaking(false);
      speechEngine.stopListening();
    } else {
      setSpeakSecondsElapsed(0);
      setIsPart2Speaking(true);
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(clipKey);
      await speechEngine.startListening(clipKey);

      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      speakTimerRef.current = setInterval(() => {
        setSpeakSecondsElapsed(prev => {
          if (prev >= 120) {
            clearInterval(speakTimerRef.current);
            setIsPart2Speaking(false);
            speechEngine.stopListening();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Render Playback Voice Box
  const renderAudioPlayback = (clipKey) => {
    const clip = speechEngine.audioClips[clipKey];
    if (!clip || speechEngine.isListening) return null;

    const handleTogglePlay = () => {
      if (!clip?.url) return;
      if (!practiceAudioRef.current) {
        practiceAudioRef.current = new Audio(clip.url);
        practiceAudioRef.current.onended = () => setIsPlayingPracticeAudio(false);
        practiceAudioRef.current.onerror = () => setIsPlayingPracticeAudio(false);
      } else if (practiceAudioRef.current.src !== clip.url) {
        practiceAudioRef.current.src = clip.url;
        practiceAudioRef.current.onended = () => setIsPlayingPracticeAudio(false);
        practiceAudioRef.current.onerror = () => setIsPlayingPracticeAudio(false);
      }

      if (isPlayingPracticeAudio) {
        practiceAudioRef.current.pause();
        practiceAudioRef.current.currentTime = 0;
        setIsPlayingPracticeAudio(false);
      } else {
        practiceAudioRef.current.play().then(() => {
          setIsPlayingPracticeAudio(true);
        }).catch(() => setIsPlayingPracticeAudio(false));
      }
    };

    const handleClearClip = () => {
      if (practiceAudioRef.current) {
        practiceAudioRef.current.pause();
        setIsPlayingPracticeAudio(false);
      }
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip(clipKey);
      }
    };

    return (
      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2 animate-in fade-in duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Nghe lại câu trả lời vừa thu ({clip.duration || 1}s):</span>
          </span>
          <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/40">
            RAM-Only
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              isPlayingPracticeAudio
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
            }`}
          >
            {isPlayingPracticeAudio ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Tạm Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🔊 Nghe Lại Giọng Của Bạn</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearClip}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1 cursor-pointer transition-colors"
            title="Xóa file âm thanh tạm để giải phóng RAM"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OK & Xóa File Tạm (Tiết Kiệm RAM)</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Navigation & Part Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setPracticePart(1);
              setShowSampleAnswer(false);
              speechEngine.resetTranscript();
            }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              practicePart === 1 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Part 1: Phỏng Vấn (A.R.E.A)</span>
          </button>

          <button
            onClick={() => {
              setPracticePart(2);
              setShowSampleAnswer(false);
              speechEngine.resetTranscript();
            }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              practicePart === 2 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Part 2: Cue Card & Pacing</span>
          </button>

          <button
            onClick={() => {
              setPracticePart(3);
              setShowSampleAnswer(false);
              speechEngine.resetTranscript();
            }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              practicePart === 3 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Part 3: Thảo Luận (PEEL)</span>
          </button>
        </div>

        {/* Action Tools: Idea Matrix & Shadowing Studio */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenIdeaMatrix}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-purple-200 border border-purple-700/50 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Mở bảng ma trận gợi ý ý tưởng 5W1H & Đa góc nhìn"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Idea Matrix</span>
          </button>

          <button
            onClick={onOpenShadowing}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Luyện nghe và nhại lại giọng đọc chuẩn Band 8.5+"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Shadowing 8.5</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PART 1 PRACTICE VIEW                                    */}
      {/* ========================================================= */}
      {practicePart === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Topic Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {part1Topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedP1TopicId(topic.id);
                  setActiveP1QuestionIndex(0);
                  setShowSampleAnswer(false);
                  speechEngine.resetTranscript();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedP1TopicId === topic.id
                    ? 'bg-purple-600 text-white border border-purple-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>

          {/* Question Card */}
          {currentP1Question && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Câu {activeP1QuestionIndex + 1} / {activeP1Topic.questions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{activeP1Topic.title}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setShowVocabHints(!showVocabHints)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  >
                    {showVocabHints ? 'Ẩn Gợi Ý Từ Vựng' : 'Hiện Từ Vựng Band 7+'}
                  </button>
                  <button
                    onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                    className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 transition-colors cursor-pointer"
                  >
                    {showSampleAnswer ? 'Ẩn Bài Mẫu' : 'Xem Bài Mẫu 8.5'}
                  </button>
                </div>
              </div>

              {/* The Question Text with Examiner Voice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Câu hỏi khảo thí:</span>
                  <button
                    onClick={() => handleReadText(currentP1Question.question)}
                    className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speechEngine.isSpeaking ? 'Đang đọc...' : 'Nghe Giám khảo đọc câu hỏi'}</span>
                  </button>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                  "{currentP1Question.question}"
                </h2>
                <p className="text-xs text-slate-400 italic">
                  💡 {currentP1Question.strategy}
                </p>
              </div>

              {/* Interactive Recorder Box */}
              <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
                speechEngine.isListening 
                  ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30' 
                  : 'bg-slate-950 border-slate-800/90'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg border transition-colors ${
                      speechEngine.isListening 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {speechEngine.isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block text-white">
                        {speechEngine.isListening ? 'Đang Thu Âm Trả Lời' : 'Luyện Nói Cho Câu Này'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {speechEngine.isListening ? 'Giọng bạn đang được phân tích trực tiếp' : 'Mic hiện đang tắt'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {speechEngine.isListening ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>REC • MICRO ĐANG BẬT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold">
                        <span>ĐÃ TẮT MIC</span>
                      </span>
                    )}
                    {speechEngine.isListening && (
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">
                        {speechEngine.micLevel}%
                      </span>
                    )}
                  </div>
                </div>

                <div className={`h-16 rounded-xl border overflow-hidden transition-all ${
                  speechEngine.isListening 
                    ? 'bg-slate-900 border-emerald-500/40 ring-2 ring-emerald-500/20' 
                    : 'bg-slate-900 border-slate-800'
                }`}>
                  <SpeechWaveVisualizer
                    mode={speechEngine.isListening ? 'candidate_speaking' : speechEngine.isSpeaking ? 'examiner_speaking' : 'idle'}
                    analyserNode={speechEngine.analyserNode}
                    className="w-full h-full"
                  />
                </div>

                {/* Realtime Live Transcript */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs min-h-[50px] flex items-center justify-between">
                  <p className="italic leading-relaxed text-slate-200">
                    {speechEngine.transcript || speechEngine.interimTranscript ? (
                      <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                    ) : (
                      <span className="text-slate-500">Bấm nút "Bật Micro Luyện Nói" bên dưới và bắt đầu trả lời bằng tiếng Anh...</span>
                    )}
                  </p>
                  {speechEngine.transcript && !speechEngine.isListening && (
                    <button
                      onClick={() => {
                        speechEngine.resetTranscript();
                        const key = `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`;
                        if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(key);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors ml-2 shrink-0 cursor-pointer"
                      title="Xóa làm lại câu này"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                  <span className="text-[11px] text-slate-400">
                    {speechEngine.transcript ? (
                      <span className="text-purple-300 font-semibold">Đã nói: {speechEngine.transcript.split(' ').filter(Boolean).length} từ</span>
                    ) : (
                      '💡 Mẹo: Nhấn phím Space để bật/tắt mic nhanh'
                    )}
                  </span>

                  <button
                    onClick={() => handleTogglePracticeRecord(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                      speechEngine.isListening 
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-2 ring-rose-400 animate-pulse' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                    }`}
                  >
                    {speechEngine.isListening ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>DỪNG THU ÂM (HOÀN TẤT)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>BẬT MICRO LUYỆN NÓI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Playback Box */}
                {renderAudioPlayback(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`)}
              </div>

              {/* Vocab Hints */}
              {showVocabHints && currentP1Question.vocabHints?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Gợi ý Collocations & Idioms Band 7.5+:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentP1Question.vocabHints.map((v, idx) => (
                      <div key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs flex items-center space-x-1">
                        <span className="font-bold text-purple-300">{v.phrase}</span>
                        <span className="text-slate-400 text-[11px]">({v.meaningVi})</span>
                        {onSaveToVocabNotebook && (
                          <button
                            onClick={() => onSaveToVocabNotebook({
                              id: `v-spk-${Date.now()}-${idx}`,
                              phrase: v.phrase,
                              meaningVi: v.meaningVi,
                              example: currentP1Question.sampleAnswer,
                              topic: 'speaking'
                            })}
                            className="ml-1 text-[10px] text-purple-400 hover:text-purple-200 cursor-pointer font-bold"
                            title="Lưu vào Sổ tay từ vựng"
                          >
                            +Lưu
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Answer */}
              {showSampleAnswer && currentP1Question.sampleAnswer && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Câu trả lời mẫu Band 8.5+ (Theo công thức A.R.E.A):
                    </span>
                    <button
                      onClick={() => handleReadText(currentP1Question.sampleAnswer)}
                      className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Nghe đọc mẫu</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{currentP1Question.sampleAnswer}"
                  </p>
                </div>
              )}

              {/* Question Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  disabled={activeP1QuestionIndex === 0}
                  onClick={() => {
                    if (speechEngine.isListening) speechEngine.stopListening();
                    setActiveP1QuestionIndex(prev => prev - 1);
                    setShowSampleAnswer(false);
                    speechEngine.resetTranscript();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Câu Trước
                </button>
                <button
                  disabled={activeP1QuestionIndex >= activeP1Topic.questions.length - 1}
                  onClick={() => {
                    if (speechEngine.isListening) speechEngine.stopListening();
                    setActiveP1QuestionIndex(prev => prev + 1);
                    setShowSampleAnswer(false);
                    speechEngine.resetTranscript();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Câu Kế Tiếp →
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PART 2 PRACTICE VIEW WITH PACING BAR & 60s PREP TIMER  */}
      {/* ========================================================= */}
      {practicePart === 2 && activeP2Card && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150 shadow-xl">
          
          {/* Header & Cue Card Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Part 2 Long Turn (2 Phút Nói)
                </span>
                <span className="text-xs text-slate-400 font-semibold">{activeP2Card.category}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">{activeP2Card.title}</h3>
            </div>

            <select
              value={selectedP2CueCardId}
              onChange={(e) => {
                setSelectedP2CueCardId(e.target.value);
                setShowSampleAnswer(false);
                setSpeakSecondsElapsed(0);
                setIsPart2Speaking(false);
                setIsPrepping(false);
                speechEngine.resetTranscript();
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none cursor-pointer shrink-0"
            >
              {part2Cards.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Cue Card Frame */}
          <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">{activeP2Card.cueCard?.intro}</span>
              <button
                onClick={() => handleReadText(`${activeP2Card.title}. ${activeP2Card.cueCard?.bullets.join('. ')}`)}
                className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe đọc đề</span>
              </button>
            </div>
            <ul className="space-y-2 pl-4 list-disc text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {activeP2Card.cueCard?.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </div>

          {/* 60s PREPARATION TIMER & 4-QUADRANT MINDMAP */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Giai đoạn 1: Chuẩn bị 1 Phút (60s Note-taking)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-mono font-black ${
                  prepSecondsRemaining <= 10 && prepSecondsRemaining > 0 ? 'text-rose-400 animate-ping' : 'text-emerald-400'
                }`}>
                  00:{prepSecondsRemaining.toString().padStart(2, '0')}
                </span>
                <button
                  onClick={handleStartPart2Prep}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isPrepping 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {isPrepping ? 'Dừng Nháp' : 'Bắt Đầu Đếm 60s Nháp'}
                </button>
              </div>
            </div>

            {/* 4-Quadrant Mindmap Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeP2Card.mindmapNotes?.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-purple-400 mr-1.5">Ô {idx + 1}:</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2-MINUTE PACING BAR & LIVE RECORDER */}
          <div className={`p-5 rounded-2xl border space-y-4 transition-all ${
            isPart2Speaking || speechEngine.isListening
              ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : 'bg-slate-950 border-slate-800'
          }`}>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  Giai đoạn 2: Luyện Nói 2 Phút (Pacing Bar)
                </span>
                <span className="text-[11px] text-slate-400">
                  Thanh định nhịp giúp bạn căn chuẩn mốc 1:30 - 2:00 mà không bị non giờ
                </span>
              </div>
              <span className="text-sm font-mono font-black text-emerald-400">
                {Math.floor(speakSecondsElapsed / 60)}:{(speakSecondsElapsed % 60).toString().padStart(2, '0')} / 02:00
              </span>
            </div>

            {/* CALM 3-STAGE PACING BAR */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                {/* 0 - 60s (Emerald) */}
                <div 
                  className="bg-emerald-500 transition-all duration-300 h-full"
                  style={{ width: `${Math.min(50, (speakSecondsElapsed / 120) * 100)}%` }}
                  title="0 - 60s: Mở đầu & bối cảnh"
                />
                {/* 60 - 90s (Amber) */}
                <div 
                  className="bg-amber-500 transition-all duration-300 h-full"
                  style={{ width: `${Math.max(0, Math.min(25, ((speakSecondsElapsed - 60) / 120) * 100))}%` }}
                  title="60 - 90s: Chi tiết cốt lõi & cảm xúc"
                />
                {/* 90 - 120s (Purple/Rose) */}
                <div 
                  className="bg-rose-500 transition-all duration-300 h-full"
                  style={{ width: `${Math.max(0, Math.min(25, ((speakSecondsElapsed - 90) / 120) * 100))}%` }}
                  title="90 - 120s: Kết luận & bài học"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>0s (Bắt đầu)</span>
                <span className="text-emerald-400">60s (Đã đủ bối cảnh)</span>
                <span className="text-amber-400">90s (Vùng an toàn 7.0+)</span>
                <span className="text-rose-400">120s (Chuẩn Cambridge)</span>
              </div>
            </div>

            {/* Waveform */}
            <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <SpeechWaveVisualizer
                mode={isPart2Speaking || speechEngine.isListening ? 'candidate_speaking' : 'idle'}
                analyserNode={speechEngine.analyserNode}
                className="w-full h-full"
              />
            </div>

            {/* Live Transcript */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs min-h-[50px] text-slate-200">
              <p className="italic leading-relaxed">
                {speechEngine.transcript || speechEngine.interimTranscript ? (
                  <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                ) : (
                  <span className="text-slate-500">Bấm nút "Bắt Đầu Nói 2 Phút" bên dưới khi bạn đã sẵn sàng...</span>
                )}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {speechEngine.transcript ? `Đã nói: ${speechEngine.transcript.split(' ').filter(Boolean).length} từ` : 'Phím tắt: [Space] bật/tắt'}
              </span>

              <button
                onClick={handleTogglePart2Speaking}
                className={`px-6 py-3 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  isPart2Speaking || speechEngine.isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-2 ring-rose-400 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                {isPart2Speaking || speechEngine.isListening ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>DỪNG NÓI PART 2</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>BẮT ĐẦU NÓI 2 PHÚT</span>
                  </>
                )}
              </button>
            </div>

            {/* Playback Box */}
            {renderAudioPlayback(`p2_${activeP2Card.id}`)}

          </div>

          {/* Sample Answer Band 8.5 */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 cursor-pointer transition-colors"
              >
                {showSampleAnswer ? 'Ẩn Bài Mẫu Band 8.5' : 'Xem & Nghe Bài Mẫu Band 8.5 Cho Part 2'}
              </button>

              {showSampleAnswer && (
                <button
                  onClick={() => handleReadText(activeP2Card.sampleAnswer)}
                  className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe Giám khảo đọc toàn bộ bài mẫu</span>
                </button>
              )}
            </div>

            {showSampleAnswer && activeP2Card.sampleAnswer && (
              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3 animate-in fade-in duration-150">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line italic">
                  {activeP2Card.sampleAnswer}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PART 3 PRACTICE VIEW (PEEL FRAMEWORK)                   */}
      {/* ========================================================= */}
      {practicePart === 3 && activeP3Set && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in duration-150 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Part 3: Thảo Luận Hai Chiều (Chuyên Sâu)
            </span>
            <span className="text-xs font-bold text-slate-300">{activeP3Set.topic}</span>
          </div>

          <div className="space-y-4">
            {activeP3Set.questions?.map((q, idx) => {
              const clipKey = `p3_${q.qId || idx}`;
              return (
                <div key={q.qId || idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                      Câu hỏi {idx + 1} ({q.analysisType})
                    </span>
                    <button
                      onClick={() => handleReadText(q.question)}
                      className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe đọc</span>
                    </button>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "{q.question}"
                  </h4>
                  <p className="text-xs text-slate-400 italic">
                    💡 Chiến lược PEEL: {q.strategy}
                  </p>

                  {/* Micro recorder for this Part 3 question */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Cấu trúc PEEL: Point $\rightarrow$ Explanation $\rightarrow$ Example $\rightarrow$ Link
                    </span>
                    <button
                      onClick={() => handleTogglePracticeRecord(clipKey)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        speechEngine.isListening 
                          ? 'bg-rose-600 text-white animate-pulse' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{speechEngine.isListening ? 'Dừng Thu Âm' : 'Luyện Nói Câu Này'}</span>
                    </button>
                  </div>

                  {renderAudioPlayback(clipKey)}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
