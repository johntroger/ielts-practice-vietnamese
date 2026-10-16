/**
 * IELTS Listening Practice: Analytical Discussions on Politics, Film Critique & Robotics (Track 20)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track20-discussions-politics-film-robotics.mp3
 * 
 * Standard Cambridge IELTS Section 3 Simulation:
 * - Part 1: Note & Summary Completion (Questions 1–5)
 * - Part 2: Multiple Choice & Perspective Evaluation (Questions 6–10)
 */

export const track20Discussions = {
  id: 'ielts-listening-track20-discussions',
  title: 'IELTS Listening Practice: Topical Discussions on Politics, Cinema & Robotics (Track 20)',
  titleEn: 'IELTS Listening Practice: Topical Discussions on Politics, Cinema & Robotics (Track 20)',
  titleVi: 'Luyện đề IELTS Listening: Thảo luận chuyên sâu về Bầu cử, Điện ảnh & Robot (Track 20)',
  description: 'Bộ luyện thi IELTS Listening Section 3 thực chiến: Phân tích 3 đoạn đàm thoại đa chiều về tác động kinh tế của bầu cử chính phủ, góc nhìn phê bình phim khoa học viễn tưởng (phát triển nhân vật vs hiệu ứng thương mại), và giải bóng đá robot tự động cùng tiềm năng thương mại hóa.',
  descriptionEn: 'Authentic Cambridge IELTS Section 3 practice: Analyzing 3 multidimensional discussions covering general election economic impacts, sci-fi film criticism (character depth vs commercial spectacle), and autonomous robot soccer competitions with commercialization potential.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 3 thực chiến: Phân tích 3 đoạn đàm thoại đa chiều về tác động kinh tế của bầu cử chính phủ, góc nhìn phê bình phim khoa học viễn tưởng (phát triển nhân vật vs hiệu ứng thương mại), và giải bóng đá robot tự động cùng tiềm năng thương mại hóa.',
  totalQuestions: 10,
  timeLimitMinutes: 14,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track20-discussions-politics-film-robotics.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track20-discussions-politics-film-robotics.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Key Arguments & Factual Notes',
      context: 'Listen to three distinct conversational extracts between two speakers discussing political elections, a new sci-fi film, and robotic sports.',
      audioTimestampStart: 0,
      audioTimestampEnd: 104,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 20.
[00:02] Discussion one.
[00:04] All I'm saying is that if this government wins the election tomorrow, I think they'll just continue with the same things they've been doing over the last 5 years, and make the economic situation worse in this country. People are already finding it difficult to live with prices going up and salaries staying the same.
[00:21] I don't think they'll win. People have had enough and are ready to vote for a change. I hope they do. If the other party gets in, it'll be like them winning the World Cup.
[00:33] Discussion two.
[00:35] Yeah, I saw it last night. I think it was really good the way that all the characters were actually well developed and interacted with each other. The danger with that kind of film is that the science fiction aspect just takes over, and you get spaceships and battles with aliens who are trying to take over the Earth.
[00:53] I'm going to see it tonight. I listened to the review on the radio this afternoon, and the critic really liked it, which is unusual because he doesn't usually recommend big commercial projects which just aim to make as much money as possible.
[01:08] Discussion three.
[01:11] Did you see that report on the news tonight, the one about the robot football competition?
[01:17] Yeah, it was quite amazing. I mean, it wasn't like real football, but it is amazing what they can get machines to do with the right programming these days. I mean, those robots can detect the ball as it moves around the pitch and pass it to each other. And that winning goal was like Messi scoring.
[01:34] Yeah! I can see it becoming a real money-making business, just like the real thing.`,
      questionGroups: [
        {
          id: 'qg-t20-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Factual Note Completion',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'SUMMARY NOTES: DISCUSSIONS ON POLITICS, CINEMA & TECHNOLOGY',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Discussion 1: The current administration has implemented its policies over the past ................ years.',
              prefixText: 'Discussion 1: The current administration has implemented its policies over the past',
              suffixText: 'years.',
              answer: '5',
              acceptableAnswers: ['5', 'five', '5 years', 'five years'],
              evidenceQuote: 'over the last 5 years',
              evidenceTimestamp: 10,
              explanation: 'Người phụ nữ nhắc đến quãng thời gian 5 năm qua: "over the last 5 years".',
              explanationEn: 'The woman references the current government\'s record "over the last 5 years".',
              explanationVi: 'Người phụ nữ nhắc đến quãng thời gian 5 năm qua: "over the last 5 years".'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Discussion 1: Living conditions are deteriorating because prices are climbing while ................ remain unchanged.',
              prefixText: 'Discussion 1: Living conditions are deteriorating because prices are climbing while',
              suffixText: 'remain unchanged.',
              answer: 'salaries',
              acceptableAnswers: ['salaries', 'Salaries', 'salary'],
              evidenceQuote: 'with prices going up and salaries staying the same.',
              evidenceTimestamp: 19,
              explanation: 'Nguyên nhân khó khăn kinh tế là giá cả tăng cao trong khi tiền lương không đổi: "salaries staying the same".',
              explanationEn: 'The economic strain is caused by prices rising while "salaries" stay the same.',
              explanationVi: 'Nguyên nhân khó khăn kinh tế là giá cả tăng cao trong khi tiền lương không đổi: "salaries staying the same".'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Discussion 2: The male speaker was impressed that all the ................ were well developed and interacted meaningfully.',
              prefixText: 'Discussion 2: The male speaker was impressed that all the',
              suffixText: 'were well developed and interacted meaningfully.',
              answer: 'characters',
              acceptableAnswers: ['characters', 'Characters', 'character'],
              evidenceQuote: 'all the characters were actually well developed and interacted with each other.',
              evidenceTimestamp: 40,
              explanation: 'Điểm đáng khen ngợi của bộ phim là các nhân vật ("characters") được xây dựng sâu sắc và tương tác tốt.',
              explanationEn: 'The film\'s praised feature is that all "characters" were well developed.',
              explanationVi: 'Điểm đáng khen ngợi của bộ phim là các nhân vật ("characters") được xây dựng sâu sắc và tương tác tốt.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Discussion 2: The radio critic normally avoids recommending large ................ projects designed strictly for profit.',
              prefixText: 'Discussion 2: The radio critic normally avoids recommending large',
              suffixText: 'projects designed strictly for profit.',
              answer: 'commercial',
              acceptableAnswers: ['commercial', 'Commercial'],
              evidenceQuote: 'he doesn\'t usually recommend big commercial projects',
              evidenceTimestamp: 62,
              explanation: 'Nhà phê bình radio thường không đánh giá cao các dự án thương mại ("commercial") chỉ nhắm tới doanh thu.',
              explanationEn: 'The radio critic rarely recommends large "commercial" projects intended solely for profit.',
              explanationVi: 'Nhà phê bình radio thường không đánh giá cao các dự án thương mại ("commercial") chỉ nhắm tới doanh thu.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Discussion 3: Modern programming allows autonomous robots to ................ the ball as it travels across the pitch.',
              prefixText: 'Discussion 3: Modern programming allows autonomous robots to',
              suffixText: 'the ball as it travels across the pitch.',
              answer: 'detect',
              acceptableAnswers: ['detect', 'Detect'],
              evidenceQuote: 'those robots can detect the ball as it moves around the pitch',
              evidenceTimestamp: 87,
              explanation: 'Kỹ thuật lập trình giúp robot có thể phát hiện và định vị quả bóng ("detect the ball").',
              explanationEn: 'Sophisticated programming enables the soccer robots to "detect" the ball on the pitch.',
              explanationVi: 'Kỹ thuật lập trình giúp robot có thể phát hiện và định vị quả bóng ("detect the ball").'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Evaluative Judgment & Speaker Perspectives',
      context: 'Listen to the discussions again to identify rhetorical devices, speaker attitudes, and analytical predictions.',
      audioTimestampStart: 0,
      audioTimestampEnd: 104,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 20.
[00:02] Discussion one.
[00:04] All I'm saying is that if this government wins the election tomorrow, I think they'll just continue with the same things they've been doing over the last 5 years, and make the economic situation worse in this country. People are already finding it difficult to live with prices going up and salaries staying the same.
[00:21] I don't think they'll win. People have had enough and are ready to vote for a change. I hope they do. If the other party gets in, it'll be like them winning the World Cup.
[00:33] Discussion two.
[00:35] Yeah, I saw it last night. I think it was really good the way that all the characters were actually well developed and interacted with each other. The danger with that kind of film is that the science fiction aspect just takes over, and you get spaceships and battles with aliens who are trying to take over the Earth.
[00:53] I'm going to see it tonight. I listened to the review on the radio this afternoon, and the critic really liked it, which is unusual because he doesn't usually recommend big commercial projects which just aim to make as much money as possible.
[01:08] Discussion three.
[01:11] Did you see that report on the news tonight, the one about the robot football competition?
[01:17] Yeah, it was quite amazing. I mean, it wasn't like real football, but it is amazing what they can get machines to do with the right programming these days. I mean, those robots can detect the ball as it moves around the pitch and pass it to each other. And that winning goal was like Messi scoring.
[01:34] Yeah! I can see it becoming a real money-making business, just like the real thing.`,
      questionGroups: [
        {
          id: 'qg-t20-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Analytical & Multiple Choice Evaluation',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'In Discussion 1, how does the male speaker characterize the prospect of the opposition party winning the election?',
              options: [
                { id: 'A', text: 'As an extraordinary triumph comparable to winning the World Cup', textEn: 'As an extraordinary triumph comparable to winning the World Cup' },
                { id: 'B', text: 'As an inevitable but mediocre outcome that will change very little', textEn: 'As an inevitable but mediocre outcome that will change very little' },
                { id: 'C', text: 'As an unlikely event due to widespread voter apathy', textEn: 'As an unlikely event due to widespread voter apathy' }
              ],
              correctAnswer: 'A',
              explanation: 'Người đàn ông dùng hình ảnh so sánh: "If the other party gets in, it\'ll be like them winning the World Cup" (chiến thắng vang dội như vô địch World Cup).',
              explanationEn: 'The man uses an emphatic simile, describing an opposition victory as "like them winning the World Cup".',
              explanationVi: 'Người đàn ông dùng hình ảnh so sánh: "If the other party gets in, it\'ll be like them winning the World Cup" (chiến thắng vang dội như vô địch World Cup).'
            },
            {
              id: 7,
              order: 7,
              questionText: 'In Discussion 2, what artistic risk does the man identify regarding science fiction cinema?',
              options: [
                { id: 'A', text: 'Special effects and alien battles dominating at the expense of character depth', textEn: 'Special effects and alien battles dominating at the expense of character depth' },
                { id: 'B', text: 'Excessively high production budgets leading to financial bankruptcy', textEn: 'Excessively high production budgets leading to financial bankruptcy' },
                { id: 'C', text: 'Overly philosophical scripts confusing younger audiences', textEn: 'Overly philosophical scripts confusing younger audiences' }
              ],
              correctAnswer: 'A',
              explanation: 'Mối nguy hiểm của phim sci-fi là yếu tố viễn tưởng lấn át nội dung ("science fiction aspect just takes over"), sa đà vào tàu vũ trụ và chiến đấu với người ngoài hành tinh.',
              explanationEn: 'The speaker warns against the sci-fi elements taking over with excessive alien battles at the cost of character interaction.',
              explanationVi: 'Mối nguy hiểm của phim sci-fi là yếu tố viễn tưởng lấn át nội dung ("science fiction aspect just takes over"), sa đà vào tàu vũ trụ và chiến đấu với người ngoài hành tinh.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Why was the female speaker surprised by the radio critic\'s review in Discussion 2?',
              options: [
                { id: 'A', text: 'The critic rarely praises large-scale commercial films aimed purely at box-office revenue', textEn: 'The critic rarely praises large-scale commercial films aimed purely at box-office revenue' },
                { id: 'B', text: 'The critic had publicly boycotted the director\'s previous film works', textEn: 'The critic had publicly boycotted the director\'s previous film works' },
                { id: 'C', text: 'The review was broadcast before the movie premiered in theatres', textEn: 'The review was broadcast before the movie premiered in theatres' }
              ],
              correctAnswer: 'A',
              explanation: 'Sự bất ngờ đến từ việc nhà phê bình rất khắt khe và thường không giới thiệu các dự án bom tấn thương mại đơn thuần ("doesn\'t usually recommend big commercial projects").',
              explanationEn: 'The woman found it unusual because the critic typically avoids endorsing high-budget, profit-focused commercial blockbusters.',
              explanationVi: 'Sự bất ngờ đến từ việc nhà phê bình rất khắt khe và thường không giới thiệu các dự án bom tấn thương mại đơn thuần ("doesn\'t usually recommend big commercial projects").'
            },
            {
              id: 9,
              order: 9,
              questionText: 'In Discussion 3, what comparison does the man use to illustrate the robotic winning goal?',
              options: [
                { id: 'A', text: 'The technical artistry and flair of Lionel Messi', textEn: 'The technical artistry and flair of Lionel Messi' },
                { id: 'B', text: 'A completely computerized calculation devoid of human feeling', textEn: 'A completely computerized calculation devoid of human feeling' },
                { id: 'C', text: 'A random deflection caused by mechanical malfunction', textEn: 'A random deflection caused by mechanical malfunction' }
              ],
              correctAnswer: 'A',
              explanation: 'Người đàn ông ví von bàn thắng quyết định tuyệt đẹp giống như Messi ghi bàn ("And that winning goal was like Messi scoring").',
              explanationEn: 'The man highlights the quality of the winning strike by likening it to Lionel Messi scoring a goal.',
              explanationVi: 'Người đàn ông ví von bàn thắng quyết định tuyệt đẹp giống như Messi ghi bàn ("And that winning goal was like Messi scoring").'
            },
            {
              id: 10,
              order: 10,
              questionText: 'What commercial forecast does the woman provide regarding robot soccer competitions?',
              options: [
                { id: 'A', text: 'It holds the potential to grow into a lucrative commercial entertainment industry', textEn: 'It holds the potential to grow into a lucrative commercial entertainment industry' },
                { id: 'B', text: 'It will remain an unprofitable academic demonstration for engineering students', textEn: 'It will remain an unprofitable academic demonstration for engineering students' },
                { id: 'C', text: 'It will soon be outlawed due to ethical concerns over artificial intelligence', textEn: 'It will soon be outlawed due to ethical concerns over artificial intelligence' }
              ],
              correctAnswer: 'A',
              explanation: 'Người phụ nữ dự đoán bóng đá robot sẽ trở thành một ngành kinh doanh kiếm tiền thực sự giống như bóng đá truyền thống ("a real money-making business, just like the real thing").',
              explanationEn: 'The woman anticipates the competition turning into a highly profitable enterprise comparable to real professional soccer.',
              explanationVi: 'Người phụ nữ dự đoán bóng đá robot sẽ trở thành một ngành kinh doanh kiếm tiền thực sự giống như bóng đá truyền thống ("a real money-making business, just like the real thing").'
            }
          ]
        }
      ]
    }
  ]
};
