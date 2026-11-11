import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Check, X, PenLine, ListChecks, Headphones, RotateCw } from 'lucide-react';
import { buildSession, normalizeAnswer } from '../utils/vocabPractice';
import { calculateNextReview, SRS_GRADES } from '../utils/srsService';
import { computeDictationDiff } from '../utils/dictationDiff';
import { speakText, stopSpeech } from '../utils/speechAudio';
import { getLocalizedVocabMeaning } from '../utils/vocabLocalization';

const SESSION_SIZE = 10;

const MODES = [
  {
    id: 'cloze',
    icon: PenLine,
    titleEn: 'Fill in the blank',
    titleVi: 'Điền từ vào chỗ trống',
    descEn: 'Type the missing word from your saved example sentence.',
    descVi: 'Gõ từ còn thiếu trong câu ví dụ bạn đã lưu.'
  },
  {
    id: 'choice',
    icon: ListChecks,
    titleEn: 'Multiple choice',
    titleVi: 'Trắc nghiệm',
    descEn: 'Pick the correct word for the meaning shown.',
    descVi: 'Chọn từ đúng với nghĩa được hiển thị.',
    minWords: 4
  },
  {
    id: 'dictation',
    icon: Headphones,
    titleEn: 'Listen & type',
    titleVi: 'Nghe và gõ lại',
    descEn: 'Listen to the word and spell it correctly.',
    descVi: 'Nghe phát âm và gõ lại từ đúng chính tả.'
  }
];

export default function VocabPracticePanel({ vocabList, isEn, onUpdateVocab }) {
  const [mode, setMode] = useState(null);
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // { correct, diff? }
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  const question = session[index];

  useEffect(() => {
    if (mode === 'dictation' && question && !result) {
      speakText(question.answer, { rate: 0.85 });
    }
    if (!result) inputRef.current?.focus();
  }, [mode, index, result, question]);

  useEffect(() => () => stopSpeech(), []);

  const start = (m) => {
    setMode(m);
    setSession(buildSession(vocabList, m, { size: SESSION_SIZE, isEn }));
    setIndex(0);
    setInput('');
    setResult(null);
    setScore(0);
    setFinished(false);
  };

  const exit = () => {
    stopSpeech();
    setMode(null);
    setSession([]);
  };

  const submit = (value) => {
    if (!question || result) return;
    const answer = value ?? input;
    let correct;
    let diff = null;
    if (question.mode === 'dictation') {
      diff = computeDictationDiff(question.answer, answer);
      correct = diff.isExactMatch;
    } else {
      correct = normalizeAnswer(answer) === normalizeAnswer(question.answer);
    }
    if (correct) setScore(s => s + 1);
    setResult({ correct, diff, given: answer });
    if (onUpdateVocab) {
      onUpdateVocab(calculateNextReview(question.item, correct ? SRS_GRADES.GOOD : SRS_GRADES.AGAIN));
    }
  };

  const next = () => {
    if (index >= session.length - 1) {
      setFinished(true);
      return;
    }
    setIndex(i => i + 1);
    setInput('');
    setResult(null);
  };

  const eligibleModes = MODES.map(m => ({
    ...m,
    disabled: vocabList.length === 0 || (m.minWords && vocabList.length < m.minWords)
  }));

  // ---------- Mode selection ----------
  if (!mode) {
    return (
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {isEn ? 'Active Recall Practice' : 'Luyện Tập Chủ Động'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isEn
                ? `${SESSION_SIZE} random words per round. Correct answers lengthen your review interval; wrong ones bring the word back sooner.`
                : `Mỗi lượt ${SESSION_SIZE} từ ngẫu nhiên. Trả lời đúng sẽ kéo dài chu kỳ ôn, trả lời sai từ sẽ quay lại sớm hơn.`}
            </p>
          </div>
          {vocabList.length === 0 && (
            <div className="text-xs text-slate-400 py-6 text-center">
              {isEn ? 'Add some words to your vault first.' : 'Hãy thêm vài từ vào sổ tay trước.'}
            </div>
          )}
          <div className="grid gap-3">
            {eligibleModes.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => start(m.id)}
                  disabled={m.disabled}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-white text-left hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{isEn ? m.titleEn : m.titleVi}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{isEn ? m.descEn : m.descVi}</div>
                    {m.minWords && vocabList.length < m.minWords && (
                      <div className="text-[11px] text-amber-600 mt-1">
                        {isEn ? `Needs at least ${m.minWords} words` : `Cần ít nhất ${m.minWords} từ`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Summary ----------
  if (finished) {
    const pct = Math.round((score / session.length) * 100);
    return (
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <div className="text-center space-y-3 max-w-sm">
          <div className="text-4xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
          <h3 className="text-lg font-bold text-slate-800">
            {score} / {session.length} ({pct}%)
          </h3>
          <p className="text-xs text-slate-500">
            {pct >= 80
              ? (isEn ? 'Excellent recall! Keep the momentum going.' : 'Nhớ rất tốt! Hãy giữ nhịp học này nhé.')
              : (isEn ? 'Missed words will return sooner in your review queue.' : 'Những từ sai sẽ quay lại sớm hơn trong lịch ôn.')}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button onClick={() => start(mode)} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 cursor-pointer inline-flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />{isEn ? 'Another round' : 'Lượt mới'}
            </button>
            <button onClick={exit} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer">
              {isEn ? 'Change mode' : 'Đổi chế độ'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  // ---------- Question ----------
  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-8">
      <div className="max-w-xl mx-auto space-y-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <button onClick={exit} className="hover:text-slate-800 cursor-pointer">← {isEn ? 'Modes' : 'Chế độ'}</button>
          <span>{isEn ? `Question ${index + 1} / ${session.length}` : `Câu ${index + 1} / ${session.length}`}</span>
          <span className="text-emerald-600">{isEn ? `Score ${score}` : `Điểm ${score}`}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all" style={{ width: `${((index + (result ? 1 : 0)) / session.length) * 100}%` }} />
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3 min-h-[140px] flex flex-col items-center justify-center">
          {question.mode === 'dictation' ? (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {isEn ? 'Listen and type the word' : 'Nghe và gõ lại từ'}
              </div>
              <button
                onClick={() => speakText(question.answer, { rate: 0.85 })}
                className="p-4 rounded-full bg-amber-500 hover:bg-amber-600 cursor-pointer"
                aria-label={isEn ? 'Play again' : 'Nghe lại'}
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <div className="text-[11px] text-slate-400">{getLocalizedVocabMeaning(question.item, isEn)}</div>
            </>
          ) : question.mode === 'choice' ? (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {isEn ? 'Which word means…' : 'Từ nào có nghĩa…'}
              </div>
              <div className="text-lg font-bold">{question.prompt}</div>
            </>
          ) : (
            <>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {question.isMeaningFallback
                  ? (isEn ? 'Type the English word for' : 'Gõ từ tiếng Anh có nghĩa')
                  : (isEn ? 'Complete the sentence' : 'Hoàn thành câu')}
              </div>
              <div className="text-base font-semibold leading-relaxed">{question.prompt}</div>
              {question.hint && <div className="text-xs text-slate-400">💡 {question.hint}</div>}
            </>
          )}
        </div>

        {question.mode === 'choice' ? (
          <div className="grid gap-2">
            {question.options.map(opt => {
              const isAnswer = normalizeAnswer(opt) === normalizeAnswer(question.answer);
              const isPicked = result && normalizeAnswer(result.given) === normalizeAnswer(opt);
              let cls = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400';
              if (result && isAnswer) cls = 'bg-emerald-50 border-emerald-400 text-emerald-800';
              else if (result && isPicked) cls = 'bg-red-50 border-red-400 text-red-700';
              return (
                <button
                  key={opt}
                  onClick={() => submit(opt)}
                  disabled={Boolean(result)}
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all cursor-pointer disabled:cursor-default ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); result ? next() : submit(); }} className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={Boolean(result)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={isEn ? 'Type your answer…' : 'Gõ câu trả lời…'}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:bg-slate-50"
            />
            {!result && (
              <button type="submit" disabled={!input.trim()} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                {isEn ? 'Check' : 'Kiểm tra'}
              </button>
            )}
          </form>
        )}

        {result && (
          <div className={`p-4 rounded-xl border text-sm space-y-1 ${result.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="font-bold inline-flex items-center gap-1.5">
              {result.correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {result.correct ? (isEn ? 'Correct!' : 'Chính xác!') : (isEn ? 'Not quite' : 'Chưa đúng')}
            </div>
            {!result.correct && (
              <div className="text-xs">
                {isEn ? 'Answer: ' : 'Đáp án: '}<span className="font-bold">{question.answer}</span>
              </div>
            )}
            {question.item.example && (
              <div className="text-xs italic opacity-80">"{question.item.example}"</div>
            )}
          </div>
        )}

        {result && (
          <div className="flex gap-2">
            {question.mode !== 'choice' && (
              <button
                onClick={() => speakText(question.answer, { rate: 0.85 })}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                aria-label={isEn ? 'Listen' : 'Nghe'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={next} className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer">
              {index >= session.length - 1 ? (isEn ? 'Finish' : 'Hoàn thành') : (isEn ? 'Next' : 'Tiếp theo')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
