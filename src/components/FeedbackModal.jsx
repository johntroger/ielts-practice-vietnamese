import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  FileDown, 
  Printer, 
  BookMarked, 
  TrendingUp, 
  X,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { exportToWord, printFormattedReport } from '../services/exportService';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function FeedbackModal({
  isOpen,
  onClose,
  evaluation,
  task,
  essayText,
  stats,
  onSaveToMistakeLog,
  onSaveToVocabNotebook,
  onOpenRevision
}) {
  if (!isOpen || !evaluation) return null;

  const [activeTab, setActiveTab] = useState('criteria'); // 'criteria' | 'corrections' | 'rewrite' | 'vocab'
  const [savedVocabs, setSavedVocabs] = useState({});
  const [savedMistakes, setSavedMistakes] = useState({});

  const trBand = evaluation.criteria?.tr?.band || 6.0;
  const ccBand = evaluation.criteria?.cc?.band || 6.0;
  const lrBand = evaluation.criteria?.lr?.band || 6.0;
  const graBand = evaluation.criteria?.gra?.band || 6.0;

  // Radar Chart Data
  const radarData = {
    labels: ['Task Response (TR)', 'Coherence & Cohesion (CC)', 'Lexical Resource (LR)', 'Grammar Range & Acc (GRA)'],
    datasets: [
      {
        label: 'Band Score của bạn',
        data: [trBand, ccBand, lrBand, graBand],
        backgroundColor: 'rgba(217, 26, 42, 0.2)',
        borderColor: '#D91A2A',
        pointBackgroundColor: '#D91A2A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#D91A2A'
      },
      {
        label: 'Mục tiêu Band 8.0',
        data: [8, 8, 8, 8],
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderDash: [4, 4],
        pointRadius: 0
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 9,
        ticks: { stepSize: 1.5, font: { size: 10 } },
        pointLabels: { font: { size: 11, weight: 'bold' }, color: '#334155' }
      }
    },
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
    }
  };

  const handleSaveVocab = (v, idx) => {
    onSaveToVocabNotebook({
      phrase: v.phrase || v.word,
      meaningVi: v.meaningVi || v.meaning,
      example: v.example || `Used in Task: ${task.title}`,
      topic: task.topic || 'General'
    });
    setSavedVocabs(prev => ({ ...prev, [idx]: true }));
  };

  const handleSaveMistake = (c, idx) => {
    onSaveToMistakeLog({
      original: c.original,
      corrected: c.corrected,
      type: c.type,
      explanation: c.explanation,
      taskTitle: task.title,
      date: new Date().toISOString()
    });
    setSavedMistakes(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold">Báo Cáo Đánh Giá Bài Thi (Strict Cambridge Rubric)</h2>
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-sm tracking-wide">
                  BAND {evaluation.overallBand ? evaluation.overallBand.toFixed(1) : '7.0'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Task {task.taskNumber}: {task.title} • {stats?.wordCount || 0} từ • Thời gian: {stats?.timeSpent || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Version 2 Rewrite Trigger Button */}
            {onOpenRevision && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRevision();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                title="Luyện viết lại lần 2 để nâng band"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Viết Lại Bản v2</span>
              </button>
            )}

            <button
              onClick={() => exportToWord({ task, essayText, evaluation, stats })}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              title="Xuất bài ra file Word .doc"
            >
              <FileDown className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Xuất Word</span>
            </button>
            <button
              onClick={printFormattedReport}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="In / Lưu thành PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'criteria' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            4 Tiêu Chí Chấm Điểm
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center space-x-1 ${
              activeTab === 'corrections' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Soi Lỗi Từng Câu</span>
            {evaluation.corrections && evaluation.corrections.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px]">
                {evaluation.corrections.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rewrite')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'rewrite' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Bản Nâng Cấp Band 8.5+
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'vocab' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Từ Vựng Vàng Trích Xuất
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: 4 CRITERIA & RADAR CHART */}
          {activeTab === 'criteria' && (
            <div className="space-y-6">
              
              {/* Radar Chart + Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="h-60 w-full flex items-center justify-center">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span>Tổng quan Band Score theo Cambridge:</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Task Response</span>
                      <strong className="text-base text-slate-900">Band {trBand.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Coherence & Cohesion</span>
                      <strong className="text-base text-slate-900">Band {ccBand.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Lexical Resource</span>
                      <strong className="text-base text-slate-900">Band {lrBand.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Grammar Range</span>
                      <strong className="text-base text-slate-900">Band {graBand.toFixed(1)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(evaluation.criteria || {}).map(([key, data]) => (
                  <div key={key} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-sm text-slate-900 uppercase">
                        {key === 'tr' ? 'Task Response (TR)' :
                         key === 'cc' ? 'Coherence & Cohesion (CC)' :
                         key === 'lr' ? 'Lexical Resource (LR)' : 'Grammar Range (GRA)'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold text-xs">
                        Band {data.band ? data.band.toFixed(1) : 'N/A'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {data.feedback}
                    </p>

                    {data.improvements && data.improvements.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 space-y-1">
                        <span className="font-semibold block text-amber-950">Điểm cần cải thiện:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {data.improvements.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: LINE-BY-LINE CORRECTIONS */}
          {activeTab === 'corrections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tìm thấy <strong>{evaluation.corrections?.length || 0}</strong> vị trí có thể cải thiện ngữ pháp & từ vựng:
                </span>
              </div>

              {evaluation.corrections && evaluation.corrections.length > 0 ? (
                evaluation.corrections.map((c, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                        {c.type || 'Grammar'}
                      </span>
                      {onSaveToMistakeLog && (
                        <button
                          onClick={() => handleSaveMistake(c, idx)}
                          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-600 font-medium transition-colors"
                        >
                          {savedMistakes[idx] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Đã lưu lỗi</span>
                            </>
                          ) : (
                            <>
                              <BookMarked className="w-3.5 h-3.5" />
                              <span>Lưu vào Sổ tay lỗi sai</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="p-2 rounded bg-red-50/60 border border-red-100 text-red-900">
                        <span className="font-bold text-red-700">Câu gốc: </span>
                        <strike>{c.original}</strike>
                      </div>
                      <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100 text-emerald-900">
                        <span className="font-bold text-emerald-700">Gợi ý sửa: </span>
                        <strong>{c.corrected}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>Giải thích:</strong> {c.explanation}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Không phát hiện lỗi nghiêm trọng nào. Bài viết của bạn rất chính xác!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BAND 8.5+ REWRITE */}
          {activeTab === 'rewrite' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950">
                <span className="font-bold block text-emerald-900 mb-1">
                  Đặc điểm của bản viết lại Band 8.5+:
                </span>
                <p>
                  Giữ nguyên 100% quan điểm và hướng lập luận ban đầu của bạn, nhưng nâng tầm cấu trúc câu phức, mệnh đề quan hệ và các collocations học thuật đắt giá theo chuẩn C1/C2.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans shadow-2xs">
                {evaluation.band8Rewrite || 'Đang cập nhật bài viết lại...'}
              </div>
            </div>
          )}

          {/* TAB 4: EXTRACTED KEY VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              <span className="text-xs text-slate-500 block">
                Các cụm từ vựng học thuật (Collocations) xuất hiện trong bản nâng cấp:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluation.keyVocabulary && evaluation.keyVocabulary.length > 0 ? (
                  evaluation.keyVocabulary.map((v, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {v.phrase || v.word}
                        </span>
                        <button
                          onClick={() => handleSaveVocab(v, idx)}
                          className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
                          title="Lưu vào sổ từ vựng"
                        >
                          {savedVocabs[idx] ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <BookMarked className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">
                        {v.meaningVi || v.meaning}
                      </p>
                      {v.example && (
                        <p className="text-[11px] text-slate-400 italic">
                          "{v.example}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                    Không có danh sách từ vựng bổ sung.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
