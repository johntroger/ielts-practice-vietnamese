import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartRenderer({ chartData }) {
  if (!chartData || !chartData.datasets) {
    return (
      <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-center text-slate-500 text-sm">
        Không có dữ liệu biểu đồ số liệu cho bài này.
      </div>
    );
  }

  const chartType = chartData.type || 'line';

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 14,
          font: { family: 'Inter', size: 12, weight: '500' },
          color: '#334155',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: chartType === 'pie' ? {} : {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' }
      },
      x: {
        grid: { color: '#f8fafc' },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' }
      }
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="h-64 sm:h-72 w-full flex items-center justify-center">
        {chartType === 'line' && <Line data={chartData} options={defaultOptions} />}
        {chartType === 'bar' && <Bar data={chartData} options={defaultOptions} />}
        {chartType === 'pie' && <Pie data={chartData} options={defaultOptions} />}
        {chartType !== 'line' && chartType !== 'bar' && chartType !== 'pie' && (
          <Bar data={chartData} options={defaultOptions} />
        )}
      </div>
      <p className="mt-2 text-center text-xs text-slate-400 italic">
        Biểu đồ trực quan do hệ thống render từ số liệu đề bài
      </p>
    </div>
  );
}
