/**
 * Export Service for IELTS Writing Master
 * Exports candidate essays and examiner reports to Word (.doc) and PDF formats.
 */

export function exportToWord({ task, essayText, evaluation, stats }) {
  const dateStr = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const overallBand = evaluation?.overallBand ? evaluation.overallBand.toFixed(1) : 'Chưa chấm';

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>IELTS Writing Report - ${task.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.4; color: #111827; margin: 40px; }
        h1 { color: #881337; font-size: 18pt; border-bottom: 2pt solid #881337; padding-bottom: 6px; text-transform: uppercase; }
        h2 { color: #1E293B; font-size: 13pt; margin-top: 24px; border-bottom: 1pt solid #CBD5E1; padding-bottom: 4px; text-transform: uppercase; }
        .meta-box { background: #F8FAFC; border: 1pt solid #E2E8F0; padding: 14px; margin-bottom: 20px; }
        .band-badge { display: inline-block; background: #881337; color: white; padding: 4px 12px; font-size: 13pt; font-weight: bold; }
        .essay-content { background: #F8FAFC; border-left: 3pt solid #2563EB; padding: 14px; font-size: 11.5pt; line-height: 1.5; white-space: pre-wrap; font-style: italic; }
        /* APA 7th Table Design: 3 horizontal borders only, no vertical borders */
        .table-criteria { width: 100%; border-collapse: collapse; margin-top: 12px; border-top: 2pt solid #111827; border-bottom: 2pt solid #111827; }
        .table-criteria th { border-bottom: 1pt solid #111827; padding: 8px 10px; text-align: left; font-weight: bold; }
        .table-criteria td { border: none; padding: 8px 10px; text-align: left; vertical-align: top; }
        .table-criteria tr:last-child td { border-bottom: none; }
        .callout-box { background: #FEF2F2; border-left: 3pt solid #DC2626; padding: 10px 14px; margin-bottom: 12px; font-size: 11pt; }
        .callout-success { background: #F0FDF4; border-left: 3pt solid #16A34A; padding: 14px; font-size: 11.5pt; line-height: 1.5; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1>BÁO CÁO BÀI THI IELTS WRITING</h1>
      <div class="meta-box">
        <p><strong>Đề bài:</strong> Task ${task.taskNumber} - ${task.title}</p>
        <p><strong>Ngày thực hiện:</strong> ${dateStr}</p>
        <p><strong>Số từ thực tế:</strong> ${stats?.wordCount || 0} từ (Yêu cầu tối thiểu: ${task.minWords} từ)</p>
        <p><strong>Thời gian hoàn thành:</strong> ${stats?.timeSpent || 'N/A'}</p>
        <p><strong>Điểm Overall Band ước tính:</strong> <span class="band-badge">BAND ${overallBand}</span></p>
      </div>

      <h2>1. ĐỀ BÀI (PROMPT)</h2>
      <p style="white-space: pre-wrap;">${task.prompt}</p>

      <h2>2. BÀI VIẾT CỦA BẠN (STUDENT ESSAY)</h2>
      <div class="essay-content">${essayText}</div>

      ${evaluation ? `
      <h2>3. NHẬN XÉT THEO 4 TIÊU CHÍ (EXAMINER CRITERIA)</h2>
      <table class="table-criteria">
        <tr>
          <th>Tiêu chí</th>
          <th>Band</th>
          <th>Nhận xét của Giám khảo</th>
        </tr>
        <tr>
          <td><strong>Task Achievement / Response (TR)</strong></td>
          <td><strong>${evaluation.criteria?.tr?.band || 'N/A'}</strong></td>
          <td>${evaluation.criteria?.tr?.feedback || ''}</td>
        </tr>
        <tr>
          <td><strong>Coherence & Cohesion (CC)</strong></td>
          <td><strong>${evaluation.criteria?.cc?.band || 'N/A'}</strong></td>
          <td>${evaluation.criteria?.cc?.feedback || ''}</td>
        </tr>
        <tr>
          <td><strong>Lexical Resource (LR)</strong></td>
          <td><strong>${evaluation.criteria?.lr?.band || 'N/A'}</strong></td>
          <td>${evaluation.criteria?.lr?.feedback || ''}</td>
        </tr>
        <tr>
          <td><strong>Grammatical Range & Accuracy (GRA)</strong></td>
          <td><strong>${evaluation.criteria?.gra?.band || 'N/A'}</strong></td>
          <td>${evaluation.criteria?.gra?.feedback || ''}</td>
        </tr>
      </table>

      ${evaluation.corrections && evaluation.corrections.length > 0 ? `
      <h2>4. CÁC LỖI SAI CẦN SỬA (LINE-BY-LINE CORRECTIONS)</h2>
      ${evaluation.corrections.map((c, i) => `
        <div class="correction-item">
          <p><strong>Lỗi ${i + 1}:</strong> <strike style="color: #DC2626;">"${c.original}"</strike></p>
          <p><strong>Sửa lại:</strong> <span style="color: #16A34A; font-weight: bold;">"${c.corrected}"</span></p>
          <p><em>Giải thích:</em> ${c.explanation}</p>
        </div>
      `).join('')}
      ` : ''}

      ${evaluation.band8Rewrite ? `
      <h2>5. BẢN NÂNG CẤP THAM KHẢO (BAND 8.5+ REWRITE)</h2>
      <div style="background: #F0FDF4; border-left: 4px solid #16A34A; padding: 15px; font-size: 11pt; white-space: pre-wrap;">
        ${evaluation.band8Rewrite}
      </div>
      ` : ''}
      ` : ''}

      <br><hr>
      <p style="text-align: center; font-size: 9pt; color: #94A3B8;">
        Được xuất từ IELTS Writing Master - Local Practice & Gemini AI Engine
      </p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `IELTS_Writing_Task${task.taskNumber}_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printFormattedReport() {
  window.print();
}
