import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Play, 
  Pause, 
  Search, 
  Volume2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  BookmarkPlus, 
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ListeningTranscriptModal({
  isOpen,
  onClose,
  currentTest,
  audioEngine,
  activePart = 1,
  onSelectPart,
  onSaveToVocabNotebook
}) {
  if (!isOpen || !currentTest) return null;

  const [selectedPartNum, setSelectedPartNum] = useState(activePart);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(null);

  // Sync selectedPartNum when activePart changes or modal reopens
  useEffect(() => {
    setSelectedPartNum(activePart);
  }, [activePart, isOpen]);

  const activePartData = currentTest.parts?.find(p => p.partNumber === selectedPartNum) || currentTest.parts?.[0];
  const transcripts = activePartData?.transcripts || [];

  // Find currently active sentence based on audio currentTime
  const currentSentenceIdx = transcripts.findIndex(
    s => audioEngine.currentTime >= s.start && audioEngine.currentTime < s.end
  );

  // Auto scroll active sentence into view
  const activeSentenceRef = useRef(null);
  useEffect(() => {
    if (activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentSentenceIdx]);

  // Jump audio to specific timestamp
  const handleSeekSentence = (startTime) => {
    if (audioEngine) {
      audioEngine.seek(startTime);
      if (!audioEngine.isPlaying) {
        audioEngine.play();
      }
    }
  };

  // Filter sentences by search
  const filteredTranscripts = transcripts.filter(s => 
    s.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.speaker && s.speaker.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-base">
                  Karaoke Interactive Transcript
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
                  Đồng Bộ Thời Gian Thực
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Bấm vào câu bất kỳ để nghe lại tức thì • Nhấp nháy theo nhịp audio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar: Part Switcher & Search */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Part Switcher */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
            {currentTest.parts?.map(p => (
              <button
                key={p.partNumber}
                onClick={() => {
                  setSelectedPartNum(p.partNumber);
                  if (onSelectPart) onSelectPart(p.partNumber);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedPartNum === p.partNumber
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                Part {p.partNumber}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm từ khóa trong lời thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
            />
          </div>
        </div>

        {/* Transcript Dialogue List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/50">
          {filteredTranscripts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              {searchTerm ? (
                <>
                  <p className="text-xs font-semibold text-slate-600">Không tìm thấy đoạn hội thoại nào phù hợp với từ khóa "{searchTerm}".</p>
                  <p className="text-[11px] text-slate-400 mt-1">Hãy thử xóa bộ lọc tìm kiếm để xem toàn bộ lời thoại.</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-600">Lời thoại (Transcript) của Part {selectedPartNum} đang được hoàn thiện.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Bạn có thể chuyển sang <strong>Part 1</strong> để trải nghiệm tính năng Karaoke Transcript đồng bộ âm thanh thời gian thực.</p>
                </>
              )}
            </div>
          ) : (
            filteredTranscripts.map((item, idx) => {
              const isActive = currentSentenceIdx === idx;
              const hasEvidence = item.targetQuestion !== undefined;

              return (
                <div
                  key={idx}
                  ref={isActive ? activeSentenceRef : null}
                  onClick={() => handleSeekSentence(item.start)}
                  className={`group p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isActive 
                      ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-400/30 shadow-xs' 
                      : hasEvidence 
                      ? 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-50' 
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                        item.speaker === 'Officer' || item.speaker === 'Interviewer' 
                          ? 'bg-blue-100 text-blue-800' 
                          : item.speaker === 'Martin' || item.speaker === 'Student' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.speaker || 'Speaker'}
                      </span>

                      {/* Timestamp Badge */}
                      <span className="font-mono text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400 inline" />
                        <span>{formatSeconds(item.start)} - {formatSeconds(item.end)}</span>
                      </span>

                      {/* Evidence Pill */}
                      {hasEvidence && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span>BẰNG CHỨNG CÂU {item.targetQuestion}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] text-purple-600 font-bold flex items-center space-x-1">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Nghe</span>
                      </span>
                    </div>
                  </div>

                  {/* Sentence Text with Karaoke Active Style */}
                  <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                    isActive 
                      ? 'text-purple-950 font-semibold' 
                      : hasEvidence 
                      ? 'text-slate-900 font-medium' 
                      : 'text-slate-700'
                  }`}>
                    {item.text}
                  </p>

                  {/* Word-level audio connected speech note if any */}
                  {item.speechTip && (
                    <div className="mt-2 pt-2 border-t border-purple-100/60 text-[11px] text-purple-700 font-medium flex items-center space-x-1.5">
                      <Volume2 className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                      <span>{item.speechTip}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span>Mẹo: Click chuột vào bất kỳ câu nào để tua audio và nghe lại lập tức</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng Lời Thoại
          </button>
        </div>

      </div>
    </div>
  );
}
