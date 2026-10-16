/**
 * IELTS Listening Practice: Sporting Achievements, Olympic Rankings & Athletic Feats (Track 18)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track18-sports-facts-and-achievements.mp3
 * 
 * Standard Cambridge IELTS Simulation:
 * - Part 1: Sports Figures, Olympics & Marathon Note Completion (Questions 1–5)
 * - Part 2: Rankings, Idioms & Intention vs Reality Traps (Questions 6–10)
 */

export const track18SportsAchievements = {
  id: 'ielts-listening-track18-sports-achievements',
  title: 'IELTS Listening Practice: Sporting Achievements & Athletic Feats (Track 18)',
  titleEn: 'IELTS Listening Practice: Sporting Achievements & Athletic Feats (Track 18)',
  titleVi: 'Luyện đề IELTS Listening: Thành tích thể thao & Kỷ lục thi đấu (Track 18)',
  description: 'Bộ luyện thi IELTS Listening Section 1/2 thực chiến: Phân tích 5 phát biểu thực tế về huyền thoại bóng đá Ryan Giggs, bảng xếp hạng huy chương Olympic London 2012, bẫy đổi ý tập gym (was going to... but decided not to bother), kỷ lục bóng rổ NBA Michael Jordan vs LeBron James, và thử thách giải chạy London Marathon.',
  descriptionEn: 'Authentic Cambridge IELTS practice: Analyzing 5 real-world statements covering football legend Ryan Giggs, London 2012 Olympic medal standings, mind-change traps regarding gym visits, NBA playoff scoring records (Jordan vs James), and marathon endurance.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 1/2 thực chiến: Phân tích 5 phát biểu thực tế về huyền thoại bóng đá Ryan Giggs, bảng xếp hạng huy chương Olympic London 2012, bẫy đổi ý tập gym (was going to... but decided not to bother), kỷ lục bóng rổ NBA Michael Jordan vs LeBron James, và thử thách giải chạy London Marathon.',
  totalQuestions: 10,
  timeLimitMinutes: 12,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track18-sports-facts-and-achievements.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track18-sports-facts-and-achievements.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Key Sporting Facts, Figures & Records',
      context: 'Listen to 5 factual statements regarding athletic records, Olympic medal distributions, and personal workout intentions.',
      audioTimestampStart: 0,
      audioTimestampEnd: 52,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 18.
[00:02] One.
[00:03] Ryan Giggs was a famous player for Manchester United. He played hundreds of games.
[00:10]
[00:11] Two.
[00:12] At London 2012, the United States was top of the medals table, followed by China, then Great Britain and Northern Ireland.
[00:22]
[00:23] Three.
[00:24] Last weekend, I was going to go to the gym, but I decided not to bother.
[00:30]
[00:31] Four.
[00:32] Michael Jordan is the number one all-time point scorer in the NBA playoffs, although LeBron James is catching up.
[00:42]
[00:43] Five.
[00:44] I ran in the London marathon last year. I thought I was never going to make it to the end.`,
      questionGroups: [
        {
          id: 'qg-t18-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Athletic Records & Statements',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'SPORTS RECORDS & STATEMENTS SUMMARY',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Ryan Giggs represented ................ throughout his prolific sporting career.',
              prefixText: 'Ryan Giggs represented',
              suffixText: 'throughout his prolific sporting career.',
              answer: 'Manchester United',
              acceptableAnswers: ['Manchester United', 'manchester united'],
              evidenceQuote: 'Ryan Giggs was a famous player for Manchester United.',
              evidenceTimestamp: 4,
              explanation: 'Câu lạc bộ bóng đá mà Ryan Giggs thi đấu là Manchester United.',
              explanationEn: 'The football club Ryan Giggs played for is Manchester United.',
              explanationVi: 'Câu lạc bộ bóng đá mà Ryan Giggs thi đấu là Manchester United.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'At the 2012 London Olympic Games, the ................ secured first place on the medal table.',
              prefixText: 'At the 2012 London Olympic Games, the',
              suffixText: 'secured first place on the medal table.',
              answer: 'United States',
              acceptableAnswers: ['United States', 'the United States', 'USA', 'US'],
              evidenceQuote: 'At London 2012, the United States was top of the medals table...',
              evidenceTimestamp: 13,
              explanation: 'Quốc gia đứng đầu bảng tổng sắp huy chương Olympic London 2012 là Hoa Kỳ (United States).',
              explanationEn: 'The nation leading the London 2012 medal table was the United States.',
              explanationVi: 'Quốc gia đứng đầu bảng tổng sắp huy chương Olympic London 2012 là Hoa Kỳ (United States).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The team finishing directly behind the United States on the medal table was ................',
              prefixText: 'The team finishing directly behind the United States on the medal table was',
              suffixText: '.',
              answer: 'China',
              acceptableAnswers: ['China', 'china'],
              evidenceQuote: 'followed by China, then Great Britain and Northern Ireland.',
              evidenceTimestamp: 17,
              explanation: 'Quốc gia xếp ngay sau Mỹ ở vị trí thứ nhì là Trung Quốc (China).',
              explanationEn: 'The country ranked immediately after the leaders was China.',
              explanationVi: 'Quốc gia xếp ngay sau Mỹ ở vị trí thứ nhì là Trung Quốc (China).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'The third speaker initially planned a visit to the ................ last weekend.',
              prefixText: 'The third speaker initially planned a visit to the',
              suffixText: 'last weekend.',
              answer: 'gym',
              acceptableAnswers: ['gym', 'the gym'],
              evidenceQuote: 'Last weekend, I was going to go to the gym, but I decided not to bother.',
              evidenceTimestamp: 25,
              explanation: 'Người nói thứ 3 ban đầu định đi tập tại phòng gym ("go to the gym").',
              explanationEn: 'The speaker had planned to go to the gym before abandoning the idea.',
              explanationVi: 'Người nói thứ 3 ban đầu định đi tập tại phòng gym ("go to the gym").'
            },
            {
              id: 5,
              order: 5,
              questionText: 'The historical leader in playoff scoring points across NBA history is ................',
              prefixText: 'The historical leader in playoff scoring points across NBA history is',
              suffixText: '.',
              answer: 'Michael Jordan',
              acceptableAnswers: ['Michael Jordan', 'michael jordan'],
              evidenceQuote: 'Michael Jordan is the number one all-time point scorer in the NBA playoffs...',
              evidenceTimestamp: 33,
              explanation: 'Cầu thủ giữ kỷ lục ghi điểm nhiều nhất lịch sử vòng playoff NBA là Michael Jordan.',
              explanationEn: 'Michael Jordan is named as the all-time number one point scorer in NBA playoffs.',
              explanationVi: 'Cầu thủ giữ kỷ lục ghi điểm nhiều nhất lịch sử vòng playoff NBA là Michael Jordan.'
            }
          ]
        },
        {
          id: 'qg-t18-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Strategic Comprehension & Distractor Analysis',
          instruction: 'Choose the correct letter, A, B, C or D.',
          headerTitle: 'EXAMINER ANALYSIS OF SPORTING STATEMENTS',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'Which entity placed THIRD in the London 2012 Olympic medal standings?',
              options: [
                { id: 'A', text: 'Great Britain and Northern Ireland', textEn: 'Great Britain and Northern Ireland' },
                { id: 'B', text: 'China', textEn: 'China' },
                { id: 'C', text: 'The United States', textEn: 'The United States' },
                { id: 'D', text: 'Australia', textEn: 'Australia' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'the United States was top of the medals table, followed by China, then Great Britain and Northern Ireland.',
              evidenceTimestamp: 19,
              explanation: 'Thứ tự xếp hạng: 1. Mỹ (top), 2. Trung Quốc (followed by), 3. Great Britain and Northern Ireland (then...). Do đó đáp án là A.',
              explanationEn: 'Sequence on the medal table: 1st United States, 2nd China, 3rd Great Britain and Northern Ireland. Therefore A is correct.',
              explanationVi: 'Thứ tự xếp hạng: 1. Mỹ (top), 2. Trung Quốc (followed by), 3. Great Britain and Northern Ireland (then...). Do đó đáp án là A.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'What did the third speaker ultimately do regarding their gym plans?',
              options: [
                { id: 'A', text: 'They changed their mind and did not go', textEn: 'They changed their mind and did not go' },
                { id: 'B', text: 'They completed a high-intensity workout session', textEn: 'They completed a high-intensity workout session' },
                { id: 'C', text: 'They substituted the gym with an outdoor run', textEn: 'They substituted the gym with an outdoor run' },
                { id: 'D', text: 'They postponed the workout to Monday morning', textEn: 'They postponed the workout to Monday morning' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'Last weekend, I was going to go to the gym, but I decided not to bother.',
              evidenceTimestamp: 27,
              explanation: 'Bẫy đổi ý: Cụm "I was going to... but I decided not to bother" cho thấy người nói đã đổi ý và không đi tập gym.',
              explanationEn: 'The expression "was going to... but decided not to bother" indicates a change of mind where the speaker did not attend.',
              explanationVi: 'Bẫy đổi ý: Cụm "I was going to... but I decided not to bother" cho thấy người nói đã đổi ý và không đi tập gym.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'What is true regarding LeBron James in comparison to Michael Jordan?',
              options: [
                { id: 'A', text: 'He is progressively closing the point deficit behind Jordan', textEn: 'He is progressively closing the point deficit behind Jordan' },
                { id: 'B', text: 'He has successfully surpassed Jordan\'s playoff total', textEn: 'He has successfully surpassed Jordan\'s playoff total' },
                { id: 'C', text: 'He retired with an identical number of playoff points', textEn: 'He retired with an identical number of playoff points' },
                { id: 'D', text: 'He has stopped competing in championship playoffs', textEn: 'He has stopped competing in championship playoffs' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'Michael Jordan is the number one all-time point scorer in the NBA playoffs, although LeBron James is catching up.',
              evidenceTimestamp: 38,
              explanation: 'Cụm "although LeBron James is catching up" (đang đuổi kịp phía sau) chứng minh Michael Jordan vẫn đang dẫn đầu, còn LeBron James đang thu hẹp dần khoảng cách.',
              explanationEn: 'The clause "although LeBron James is catching up" shows Jordan currently remains ahead while James is closing the margin.',
              explanationVi: 'Cụm "although LeBron James is catching up" (đang đuổi kịp phía sau) chứng minh Michael Jordan vẫn đang dẫn đầu, còn LeBron James đang thu hẹp dần khoảng cách.'
            },
            {
              id: 9,
              order: 9,
              questionText: 'How did the runner in statement 5 view their chances during the London marathon?',
              options: [
                { id: 'A', text: 'They doubted whether they would manage to reach the finish line', textEn: 'They doubted whether they would manage to reach the finish line' },
                { id: 'B', text: 'They were confident of finishing within their target pace', textEn: 'They were confident of finishing within their target pace' },
                { id: 'C', text: 'They found the final section much easier than anticipated', textEn: 'They found the final section much easier than anticipated' },
                { id: 'D', text: 'They were forced to pull out before completing the race', textEn: 'They were forced to pull out before completing the race' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'I ran in the London marathon last year. I thought I was never going to make it to the end.',
              evidenceTimestamp: 47,
              explanation: 'Cụm từ "I thought I was never going to make it to the end" thể hiện sự hoài nghi về khả năng về đích của bản thân do quá mệt.',
              explanationEn: 'The remark "I thought I was never going to make it to the end" reflects self-doubt about being able to finish the race.',
              explanationVi: 'Cụm từ "I thought I was never going to make it to the end" thể hiện sự hoài nghi về khả năng về đích của bản thân do quá mệt.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'In English everyday idioms, what does "decided not to bother" mean in statement 3?',
              options: [
                { id: 'A', text: 'Decided not to make the effort to do something', textEn: 'Decided not to make the effort to do something' },
                { id: 'B', text: 'Decided to complain about a facility issue', textEn: 'Decided to complain about a facility issue' },
                { id: 'C', text: 'Decided to invite a workout partner along', textEn: 'Decided to invite a workout partner along' },
                { id: 'D', text: 'Decided to seek professional medical advice', textEn: 'Decided to seek professional medical advice' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'Last weekend, I was going to go to the gym, but I decided not to bother.',
              evidenceTimestamp: 28,
              explanation: 'Cụm thành ngữ "not to bother" trong tiếng Anh có nghĩa là quyết định không tốn công sức làm một việc gì đó (lười/bỏ qua không làm).',
              explanationEn: 'The idiomatic phrase "not to bother" means choosing not to expend effort or trouble on an activity.',
              explanationVi: 'Cụm thành ngữ "not to bother" trong tiếng Anh có nghĩa là quyết định không tốn công sức làm một việc gì đó (lười/bỏ qua không làm).'
            }
          ]
        }
      ]
    }
  ]
};
