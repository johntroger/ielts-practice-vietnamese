/**
 * IELTS Listening Micro Practice: En-suite Bathroom & Morning Routine (Track 7)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track7-ensuite-bathroom-clip.mp3
 * 
 * Focused High-Yield Reflex Drill:
 * - Sentence Completion (en-suite, shower unit, main bathroom)
 * - Multiple Choice & Idiomatic Language ("come in very useful")
 */

export const track7EnsuiteMicroDrill = {
  id: 'ielts-listening-track7-ensuite',
  title: 'IELTS Listening Micro-Drill: En-Suite Fixtures & Morning Routines (Track 7)',
  description: 'Bài luyện nghe vi mô chuyên sâu 18 giây: Kiểm tra từ vựng nhà ở "en-suite bathroom", phân biệt giữa "shower unit" và "big bath", cùng thành ngữ thông dụng "come in very useful".',
  totalQuestions: 5,
  timeLimitMinutes: 5,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track7-ensuite-bathroom-clip.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track7-ensuite-bathroom-clip.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Master Bedroom Bathroom Inspection',
      context: 'The estate agent highlights the features of the master bedroom bathroom, and the buyer explains its morning benefits for the family.',
      audioTimestampStart: 0,
      audioTimestampEnd: 18,
      speakers: [
        { name: 'Peter Elliot', gender: 'Male', accent: 'British' },
        { name: 'Caroline Prendergast', gender: 'Female', accent: 'American' }
      ],
      transcript: `[00:00] Track 7.
[00:02] And there's an en-suite bathroom here, though it only has a shower unit, and not a big bath like the main bathroom.
[00:10] That would come in very useful when we all get up to get ready for school or work.`,
      questionGroups: [
        {
          id: 'qg-ensuite-1',
          type: 'sentence_completion',
          title: 'Questions 1–3: Sentence Completion',
          instruction: 'Complete the sentences below.\nWrite NO MORE THAN TWO WORDS for each answer.',
          headerTitle: 'FIXTURE & ROUTINE NOTES',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'The master bedroom is directly connected to an ................ bathroom.',
              prefixText: 'The master bedroom is directly connected to an',
              suffixText: 'bathroom.',
              answer: 'en-suite',
              acceptableAnswers: ['en-suite', 'ensuite', 'en suite'],
              evidenceQuote: 'And there\'s an en-suite bathroom here...',
              evidenceTimestamp: 2,
              explanation: 'Phòng ngủ chính nối liền với một phòng tắm khép kín (en-suite).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Unlike the main family bathroom, this private bathroom only features a ................ unit.',
              prefixText: 'Unlike the main family bathroom, this private bathroom only features a',
              suffixText: 'unit.',
              answer: 'shower',
              acceptableAnswers: ['shower', 'Shower'],
              evidenceQuote: '...though it only has a shower unit and not a big bath...',
              evidenceTimestamp: 5,
              explanation: 'Phòng tắm này chỉ có buồng tắm vòi sen (shower unit).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The buyer anticipates the extra bathroom will help when preparing for school or ................ in the morning.',
              prefixText: 'The buyer anticipates the extra bathroom will help when preparing for school or',
              suffixText: 'in the morning.',
              answer: 'work',
              acceptableAnswers: ['work'],
              evidenceQuote: '...when we all get up to get ready for school or work.',
              evidenceTimestamp: 13,
              explanation: 'Phòng tắm giúp ích nhiều cho buổi sáng khi cả nhà chuẩn bị đi học hoặc đi làm (school or work).'
            }
          ]
        },
        {
          id: 'qg-ensuite-2',
          type: 'multiple_choice',
          title: 'Questions 4–5: Idioms & Rationale',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 4,
              order: 4,
              questionText: 'What does Caroline mean by saying the en-suite "would come in very useful"?',
              options: [
                { key: 'A', text: 'It will significantly reduce household morning congestion and save time.' },
                { key: 'B', text: 'It will be used solely by visiting weekend guests.' },
                { key: 'C', text: 'It is too luxurious and unnecessary for daily family use.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'That would come in very useful when we all get up to get ready for school or work.',
              evidenceTimestamp: 10,
              explanation: 'Cụm "come in very useful" có nghĩa là rất tiện lợi và giải quyết được tình trạng chen chúc chuẩn bị buổi sáng.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'How does the en-suite bathroom differ from the main bathroom?',
              options: [
                { key: 'A', text: 'It has two washbasins instead of one.' },
                { key: 'B', text: 'It lacks a bathtub and only includes a shower.' },
                { key: 'C', text: 'It is situated downstairs next to the sunroom.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: '...and not a big bath like the main bathroom.',
              evidenceTimestamp: 7,
              explanation: 'Khác biệt lớn nhất là không có bồn tắm lớn như phòng tắm chính.'
            }
          ]
        }
      ]
    }
  ]
};
