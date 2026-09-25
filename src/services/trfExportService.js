/**
 * Official Cambridge IELTS Test Report Form (TRF) Simulator Service
 * Provides exact Cambridge rounding rules, CEFR mapping, and high-fidelity TRF generation.
 */

/**
 * Calculates official Cambridge IELTS Overall Band Score.
 * Rounding rules:
 * - Fractional part < 0.25 => round DOWN to nearest whole band (e.g. 6.125 -> 6.0)
 * - Fractional part >= 0.25 and < 0.75 => round to HALF band (e.g. 6.25 -> 6.5, 6.625 -> 6.5)
 * - Fractional part >= 0.75 => round UP to nearest whole band (e.g. 6.75 -> 7.0, 7.875 -> 8.0)
 * 
 * @param {number} listening - Listening band score (0-9)
 * @param {number} reading - Reading band score (0-9)
 * @param {number} writing - Writing band score (0-9)
 * @param {number} speaking - Speaking band score (0-9)
 * @returns {number} Standardized overall band score
 */
export function calculateCambridgeOverallBand(listening, reading, writing, speaking) {
  const scores = [listening, reading, writing, speaking].map(s => Number(s) || 0).filter(s => s > 0);
  if (scores.length === 0) return 0;

  const rawAverage = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const whole = Math.floor(rawAverage);
  const decimal = rawAverage - whole;

  if (decimal < 0.25) {
    return whole;
  } else if (decimal < 0.75) {
    return whole + 0.5;
  } else {
    return whole + 1.0;
  }
}

/**
 * Maps IELTS Band Score to Common European Framework of Reference (CEFR) levels.
 * 
 * @param {number} band - Overall Band score
 * @returns {string} CEFR Level (C2, C1, B2, B1, etc.)
 */
export function calculateCefrLevel(band) {
  const b = Number(band) || 0;
  if (b >= 8.5) return 'C2';
  if (b >= 7.0) return 'C1';
  if (b >= 5.5) return 'B2';
  if (b >= 4.0) return 'B1';
  return 'A2';
}

/**
 * Generates structured TRF candidate record
 */
export function generateTrfData({
  candidateName = 'CANDIDATE',
  candidateNumber = null,
  centreNumber = 'VN108',
  testDate = null,
  testType = 'Academic',
  listeningBand = 6.5,
  readingBand = 6.5,
  writingBand = 6.5,
  speakingBand = 6.5,
  examinerFeedback = ''
}) {
  const overallBand = calculateCambridgeOverallBand(listeningBand, readingBand, writingBand, speakingBand);
  const cefrLevel = calculateCefrLevel(overallBand);
  const dateStr = testDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const candNum = candidateNumber || String(Math.floor(100000 + Math.random() * 900000));

  return {
    candidateName: candidateName.toUpperCase(),
    candidateNumber: candNum,
    centreNumber,
    testDate: dateStr,
    testType,
    scores: {
      listening: Number(listeningBand) || 0,
      reading: Number(readingBand) || 0,
      writing: Number(writingBand) || 0,
      speaking: Number(speakingBand) || 0,
      overall: overallBand
    },
    cefrLevel,
    examinerFeedback: examinerFeedback || 'Candidate demonstrated competent linguistic operational capability across communicative contexts.',
    validationCode: `IELTS-${centreNumber}-${candNum}-${overallBand.toFixed(1)}`
  };
}

/**
 * Prints or downloads formatted Test Report Form (TRF)
 */
export function printTrfDocument(trfData) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Vui lòng cho phép popup để xuất và in phiếu điểm TRF.');
    return;
  }

  const {
    candidateName,
    candidateNumber,
    centreNumber,
    testDate,
    testType,
    scores,
    cefrLevel,
    examinerFeedback,
    validationCode
  } = trfData;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>IELTS Test Report Form - ${candidateName}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          margin: 0;
          padding: 20px;
          background: #fff;
          color: #111827;
        }
        .trf-container {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #000;
          padding: 24px 30px;
          position: relative;
          background: #fafafa;
        }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 76px;
          font-weight: 900;
          color: rgba(217, 26, 42, 0.05);
          pointer-events: none;
          letter-spacing: 6px;
          text-align: center;
          white-space: nowrap;
          z-index: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #D91A2A;
          padding-bottom: 12px;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .ielts-logo {
          font-size: 32px;
          font-weight: 900;
          color: #D91A2A;
          letter-spacing: 2px;
        }
        .trf-title {
          text-align: right;
        }
        .trf-title h2 {
          margin: 0;
          font-size: 18px;
          text-transform: uppercase;
          color: #111827;
        }
        .trf-title p {
          margin: 3px 0 0;
          font-size: 11px;
          color: #6B7280;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 18px;
          font-size: 12px;
          position: relative;
          z-index: 1;
        }
        .detail-row {
          display: flex;
          border-bottom: 1px dotted #D1D5DB;
          padding: 5px 0;
        }
        .detail-label {
          width: 140px;
          font-weight: bold;
          color: #4B5563;
        }
        .detail-value {
          flex: 1;
          font-weight: 600;
          color: #111827;
        }
        .candidate-photo {
          width: 110px;
          height: 130px;
          border: 1px solid #9CA3AF;
          background: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #6B7280;
          text-align: center;
          margin-left: auto;
        }
        .scores-section {
          margin-top: 20px;
          border: 1.5px solid #000;
          background: #fff;
          position: relative;
          z-index: 1;
        }
        .scores-header {
          background: #F3F4F6;
          border-bottom: 1px solid #000;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .scores-table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
        }
        .scores-table th, .scores-table td {
          border: 1px solid #D1D5DB;
          padding: 10px 8px;
          font-size: 12px;
        }
        .scores-table th {
          background: #FAFAFA;
          font-weight: 700;
          color: #374151;
        }
        .scores-table td.band-score {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
        }
        .scores-table td.overall-band {
          font-size: 22px;
          font-weight: 900;
          color: #D91A2A;
          background: #FEF2F2;
        }
        .cefr-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #111827;
          color: #fff;
          font-weight: bold;
          font-size: 12px;
          border-radius: 4px;
        }
        .footer-section {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 11px;
          position: relative;
          z-index: 1;
        }
        .stamp-box {
          border: 2px dashed #9CA3AF;
          border-radius: 50%;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 9px;
          font-weight: bold;
          color: #9CA3AF;
          text-transform: uppercase;
        }
        .validation-code {
          font-family: monospace;
          background: #E5E7EB;
          padding: 4px 8px;
          font-size: 10px;
          letter-spacing: 1px;
        }
        @media print {
          body {
            padding: 0;
          }
          .trf-container {
            border: 2px solid #000;
          }
        }
      </style>
    </head>
    <body>
      <div class="trf-container">
        <div class="watermark">IELTS OFFICIAL TEST REPORT</div>
        
        <div class="header">
          <div class="ielts-logo">IELTS</div>
          <div class="trf-title">
            <h2>Test Report Form</h2>
            <p>Academic Assessment Simulator</p>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <div class="detail-row">
              <span class="detail-label">Candidate Name:</span>
              <span class="detail-value">${candidateName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Candidate Number:</span>
              <span class="detail-value">${candidateNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Centre Number:</span>
              <span class="detail-value">${centreNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Test Date:</span>
              <span class="detail-value">${testDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scheme / Module:</span>
              <span class="detail-value">${testType}</span>
            </div>
          </div>
          <div>
            <div class="candidate-photo">
              Official<br/>Photo<br/>Verification
            </div>
          </div>
        </div>

        <div class="scores-section">
          <div class="scores-header">Test Results Summary</div>
          <table class="scores-table">
            <thead>
              <tr>
                <th>Listening</th>
                <th>Reading</th>
                <th>Writing</th>
                <th>Speaking</th>
                <th>Overall Band</th>
                <th>CEFR Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="band-score">${scores.listening.toFixed(1)}</td>
                <td class="band-score">${scores.reading.toFixed(1)}</td>
                <td class="band-score">${scores.writing.toFixed(1)}</td>
                <td class="band-score">${scores.speaking.toFixed(1)}</td>
                <td class="overall-band">${scores.overall.toFixed(1)}</td>
                <td><span class="cefr-badge">${cefrLevel}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 14px; font-size: 11px; color: #4B5563; font-style: italic;">
          <strong>Examiner Assessment Statement:</strong> ${examinerFeedback}
        </div>

        <div class="footer-section">
          <div>
            <div style="font-weight: bold; margin-bottom: 4px;">Security Validation Code:</div>
            <span class="validation-code">${validationCode}</span>
            <div style="margin-top: 6px; font-size: 10px; color: #6B7280;">
              British Council • IDP: IELTS Australia • Cambridge Assessment English
            </div>
          </div>
          <div class="stamp-box">
            Official<br/>Test Centre<br/>Stamp
          </div>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
