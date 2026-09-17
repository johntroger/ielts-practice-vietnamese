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
        Được xuất từ IELTS Practice Vietnamese - Local Practice & Gemini AI Engine
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

/**
 * Export IELTS Speaking Mock Exam Report to Word (.doc)
 */
export function exportSpeakingReport({ mockPack, examiner, evaluation, dialogueHistory = [], totalDurationSec = 0 }) {
  const dateStr = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const overallBand = evaluation?.overallBand ? evaluation.overallBand.toFixed(1) : '6.0';
  const criteria = evaluation?.criteria || {};
  const durationMin = Math.round(totalDurationSec / 60) || 12;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>IELTS Speaking Report - ${mockPack?.title || 'Mock Test'}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #0F172A; margin: 40px; }
        h1 { color: #581C87; font-size: 20pt; border-bottom: 2pt solid #581C87; padding-bottom: 6px; text-transform: uppercase; }
        h2 { color: #1E293B; font-size: 13pt; margin-top: 24px; border-bottom: 1pt solid #CBD5E1; padding-bottom: 4px; text-transform: uppercase; }
        .meta-box { background: #F8FAFC; border: 1pt solid #E2E8F0; padding: 14px; margin-bottom: 20px; }
        .band-badge { display: inline-block; background: #6B21A8; color: white; padding: 4px 14px; font-size: 14pt; font-weight: bold; border-radius: 6px; }
        .table-criteria { width: 100%; border-collapse: collapse; margin-top: 12px; border-top: 2pt solid #0F172A; border-bottom: 2pt solid #0F172A; }
        .table-criteria th { border-bottom: 1pt solid #0F172A; padding: 8px 10px; text-align: left; font-weight: bold; background: #F1F5F9; }
        .table-criteria td { border: none; padding: 8px 10px; text-align: left; vertical-align: top; border-bottom: 1pt solid #E2E8F0; }
        .dialogue-turn { margin-bottom: 16px; padding: 12px; border-left: 3pt solid #7C3AED; background: #FAF5FF; }
        .candidate-ans { font-style: italic; color: #1E1B4B; }
        .upgrade-box { background: #F0FDF4; border: 1pt solid #BBF7D0; padding: 10px; margin-top: 6px; color: #14532D; }
        .mistake-box { background: #FEF2F2; border: 1pt solid #FECACA; padding: 8px; margin-top: 6px; color: #7F1D1D; }
      </style>
    </head>
    <body>
      <h1>BÁO CÁO KẾT QUẢ THI THỬ IELTS SPEAKING</h1>
      <div class="meta-box">
        <p><strong>Gói đề thi:</strong> ${mockPack?.title || 'IELTS Speaking Full Mock Test'}</p>
        <p><strong>Giám khảo khảo thí:</strong> ${examiner?.name || 'Senior IELTS Examiner'} (${examiner?.accent || 'Standard Accent'})</p>
        <p><strong>Ngày thực hiện:</strong> ${dateStr}</p>
        <p><strong>Thời lượng:</strong> ${durationMin} phút • <strong>Số từ:</strong> ${evaluation?.speechAnalytics?.totalWords || 0} từ (~${evaluation?.speechAnalytics?.wordsPerMinute || 0} wpm)</p>
        <p><strong>Điểm Đánh Giá Tổng:</strong> <span class="band-badge">BAND ${overallBand}</span></p>
      </div>

      <h2>1. ĐIỂM SỐ 4 TIÊU CHÍ CHUẨN CAMBRIDGE</h2>
      <table class="table-criteria">
        <tr>
          <th style="width: 25%;">Tiêu chí</th>
          <th style="width: 12%;">Band</th>
          <th>Điểm mạnh & Điểm cần khắc phục</th>
        </tr>
        <tr>
          <td><strong>Fluency & Coherence (FC)</strong><br><small>Độ trôi chảy & mạch lạc</small></td>
          <td><strong>${criteria.fc?.band || '6.0'}</strong></td>
          <td>${criteria.fc?.strengths || ''}<br><em>Lưu ý:</em> ${criteria.fc?.weaknesses || ''}</td>
        </tr>
        <tr>
          <td><strong>Lexical Resource (LR)</strong><br><small>Vốn từ vựng học thuật</small></td>
          <td><strong>${criteria.lr?.band || '6.0'}</strong></td>
          <td>${criteria.lr?.strengths || ''}<br><em>Lưu ý:</em> ${criteria.lr?.weaknesses || ''}</td>
        </tr>
        <tr>
          <td><strong>Grammar Range & Accuracy (GRA)</strong><br><small>Ngữ pháp & cấu trúc câu</small></td>
          <td><strong>${criteria.gra?.band || '6.0'}</strong></td>
          <td>${criteria.gra?.strengths || ''}<br><em>Lưu ý:</em> ${criteria.gra?.weaknesses || ''}</td>
        </tr>
        <tr>
          <td><strong>Pronunciation (PR)</strong><br><small>Phát âm, nhịp ngắt & ngữ điệu</small></td>
          <td><strong>${criteria.pr?.band || '6.0'}</strong></td>
          <td>${criteria.pr?.strengths || ''}<br><em>Lưu ý:</em> ${criteria.pr?.weaknesses || ''}</td>
        </tr>
      </table>

      <h2>2. NHẬN XÉT CỦA GIÁM KHẢO & 3 HÀNH ĐỘNG CẦN LÀM ĐỂ TĂNG 0.5 BAND</h2>
      <p style="background: #F8FAFC; border-left: 3pt solid #6B21A8; padding: 12px;">${evaluation?.examinerSummaryVerdict || ''}</p>
      <ul>
        ${(evaluation?.topActionablePriorities || []).map(p => `<li><strong>${p}</strong></li>`).join('')}
      </ul>

      <h2>3. CHI TIẾT KỊCH BẢN ĐỐI THOẠI & PHÂN TÍCH TỪNG CÂU</h2>
      ${(evaluation?.turnEvaluations || []).map((t, idx) => `
        <div class="dialogue-turn">
          <p><strong>Câu ${idx + 1} (${(t.stage || '').toUpperCase()}):</strong> ${t.question}</p>
          <p class="candidate-ans"><strong>Câu trả lời của bạn:</strong> "${t.candidateAnswer}"</p>
          ${t.inlineFeedback ? `<p style="font-size: 10pt; color: #475569;"><em>Nhận xét:</em> ${t.inlineFeedback}</p>` : ''}
          ${t.corrections && t.corrections.length > 0 ? `
            <div class="mistake-box">
              ${t.corrections.map(c => `<p>❌ <em>"${c.original}"</em> &rarr; ✅ <strong>"${c.corrected}"</strong>: ${c.explanation}</p>`).join('')}
            </div>
          ` : ''}
          ${t.upgradedBand8 ? `
            <div class="upgrade-box">
              <strong>✨ Gợi ý nâng cấp Band 8.5+:</strong> "${t.upgradedBand8}"
            </div>
          ` : ''}
        </div>
      `).join('')}

      <br><hr>
      <p style="text-align: center; font-size: 9pt; color: #94A3B8;">
        IELTS Studio Academic AI • Báo cáo thi thử Speaking mô phỏng 100% chuẩn khảo thí IDP / British Council
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
  a.download = `IELTS_Speaking_Report_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

