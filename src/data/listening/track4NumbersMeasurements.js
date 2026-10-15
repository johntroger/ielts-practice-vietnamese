/**
 * IELTS Listening Practice: Numbers, Measurements & Codes Reflex (Track 4)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track4-numbers-measurements.mp3
 * 
 * Standard IELTS Part 1 Core Reflex Simulation:
 * - Prices & Currencies (£53.72)
 * - Distances & Units (472 km)
 * - Telephone Numbers with Self-Correction (01897 625 730)
 * - Dimensions: Length & Width (110m x 55m)
 * - Alphanumeric Codes & Acoustic Confusion: B vs D (B1074)
 */

export const track4NumbersMeasurements = {
  id: 'ielts-listening-track4-numbers',
  title: 'IELTS Listening Practice: Numbers, Prices, Distances & Alphanumeric Codes (Track 4)',
  description: 'Bộ luyện tập phản xạ con số cốt lõi trong IELTS Listening Part 1: Giá tiền lẻ, khoảng cách km, số điện thoại nhiều chữ số kèm đính chính, kích thước sân bóng và mã thẻ hội viên dễ nhầm giữa B và D.',
  totalQuestions: 10,
  timeLimitMinutes: 10,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track4-numbers-measurements.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track4-numbers-measurements.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Five Short Everyday Information Dialogues',
      context: 'Five brief everyday interactions involving payment calculations, route distances, telephone messages, sports pitch dimensions, and course booking codes.',
      audioTimestampStart: 0,
      audioTimestampEnd: 101,
      speakers: [
        { name: 'Speakers (Conversation 1-5)', gender: 'Mixed', accent: 'British' }
      ],
      transcript: `[00:00] Track 4.
[00:02] Conversation 1.
[00:04] How much is that all together?
[00:07] That's £53.72 please.
[00:10] Sorry, did you say £43.72?
[00:14] No, £53.72.

[00:19] Conversation 2.
[00:21] So how far is it to Paris?
[00:23] I've just checked, it's 472 km.
[00:27] 472 km? That's a long way! Are you sure you want to drive?

[00:35] Conversation 3.
[00:37] Someone left a message for you, Mr. Hemmings. He wants you to call him on 01897 625 730.
[00:46] Sorry, I didn't get all that. Did you say 01857 629 730?
[00:55] No, it's 01897 625 730.

[01:03] Conversation 4.
[01:05] So how big is the football field?
[01:08] It's 110 meters by 55 meters.
[01:12] 110 meters long and 55 meters wide? Mhm. That's quite big!

[01:20] Conversation 5.
[01:22] Can I book a place on the course on Saturday please?
[01:26] Certainly madam. What's your membership number?
[01:29] It's B1074.
[01:31] Sorry, did you say D1074?
[01:34] No, B1074.
[01:37] Oh, okay. Thank you.`,
      questionGroups: [
        // ==========================================
        // DẠNG 1: NOTE & FORM COMPLETION (Q1 - Q5)
        // ==========================================
        {
          id: 'qg-num-1',
          type: 'note_completion',
          title: 'Questions 1–5: Information Note Completion',
          instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'DAILY TRANSACTION & ENQUIRY RECORDS',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Total payment due: £ ................',
              prefixText: 'Total payment due: £',
              suffixText: '',
              answer: '53.72',
              acceptableAnswers: ['53.72', '53.72 pounds', 'fifty-three pounds seventy-two'],
              evidenceQuote: 'No, £53.72.',
              evidenceTimestamp: 14,
              explanation: 'Bẫy âm 43 vs 53: Khách hỏi lại 43.72 nhưng thu ngân đính chính là 53.72.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Total driving distance to Paris: ................ km',
              prefixText: 'Total driving distance to Paris:',
              suffixText: 'km',
              answer: '472',
              acceptableAnswers: ['472', '472 km', 'four hundred and seventy-two', 'four hundred and seventy two'],
              evidenceQuote: 'I\'ve just checked, it\'s 472 km.',
              evidenceTimestamp: 23,
              explanation: 'Khoảng cách đường bộ tới Paris là 472 km.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Telephone number for Mr. Hemmings to call back: ................',
              prefixText: 'Telephone number for Mr. Hemmings to call back:',
              suffixText: '',
              answer: '01897 625 730',
              acceptableAnswers: ['01897 625 730', '01897625730', '01897 625730'],
              evidenceQuote: 'No, it\'s 01897 625 730.',
              evidenceTimestamp: 55,
              explanation: 'Bẫy số giữa 857 vs 897 và 629 vs 625. Dãy số chuẩn là 01897 625 730.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Football field width: ................ meters',
              prefixText: 'Football field width:',
              suffixText: 'meters',
              answer: '55',
              acceptableAnswers: ['55', 'fifty-five', 'fifty five'],
              evidenceQuote: '110 meters long and 55 meters wide?',
              evidenceTimestamp: 72,
              explanation: 'Chiều rộng của sân bóng là 55 mét (chiều dài là 110 mét).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Saturday course attendee membership code: ................',
              prefixText: 'Saturday course attendee membership code:',
              suffixText: '',
              answer: 'B1074',
              acceptableAnswers: ['B1074', 'b1074', 'B 1074'],
              evidenceQuote: 'No, B1074.',
              evidenceTimestamp: 94,
              explanation: 'Bẫy âm chữ cái B vs D: Nhân viên nghe nhầm D1074, khách hàng đính chính là B1074.'
            }
          ]
        },

        // ==========================================
        // DẠNG 2: MULTIPLE CHOICE (Q6 - Q8)
        // ==========================================
        {
          id: 'qg-num-2',
          type: 'multiple_choice',
          title: 'Questions 6–8: Multiple Choice',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'What incorrect price did the customer initially ask to confirm?',
              options: [
                { key: 'A', text: '£35.72' },
                { key: 'B', text: '£43.72' },
                { key: 'C', text: '£53.27' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Sorry, did you say £43.72?',
              evidenceTimestamp: 10,
              explanation: 'Khách hàng nghe nhầm lúc đầu và hỏi lại: "Did you say £43.72?".'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Which letter did the course administrator mishear during booking?',
              options: [
                { key: 'A', text: 'The letter D instead of B' },
                { key: 'B', text: 'The letter P instead of B' },
                { key: 'C', text: 'The letter T instead of D' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Sorry, did you say D1074? - No, B1074.',
              evidenceTimestamp: 91,
              explanation: 'Người tiếp tân nghe nhầm chữ B thành chữ D (D1074).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'On which day of the week does the booked course take place?',
              options: [
                { key: 'A', text: 'Friday' },
                { key: 'B', text: 'Saturday' },
                { key: 'C', text: 'Sunday' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Can I book a place on the course on Saturday please?',
              evidenceTimestamp: 82,
              explanation: 'Khóa học diễn ra vào thứ Bảy (Saturday).'
            }
          ]
        },

        // ==========================================
        // DẠNG 3: SHORT ANSWER QUESTIONS (Q9 - Q10)
        // ==========================================
        {
          id: 'qg-num-3',
          type: 'short_answer',
          title: 'Questions 9–10: Measurements & Transportation',
          instruction: 'Answer the questions below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          questions: [
            {
              id: 9,
              order: 9,
              questionText: 'What is the exact length of the football field in meters?',
              answer: '110',
              acceptableAnswers: ['110', '110 meters', '110m', 'one hundred and ten'],
              evidenceQuote: 'It\'s 110 meters by 55 meters. - 110 meters long...',
              evidenceTimestamp: 68,
              explanation: 'Chiều dài sân là 110 mét.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'What mode of travel was the driver considering taking to Paris?',
              answer: 'drive',
              acceptableAnswers: ['drive', 'driving', 'by car'],
              evidenceQuote: 'That\'s a long way! Are you sure you want to drive?',
              evidenceTimestamp: 28,
              explanation: 'Người nói thắc mắc liệu đối phương có chắc chắn muốn lái xe (drive) một quãng đường xa như vậy không.'
            }
          ]
        }
      ]
    }
  ]
};
