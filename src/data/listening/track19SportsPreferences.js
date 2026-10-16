/**
 * IELTS Listening Practice: Sports Preferences, Hobbies & Lifestyle Constraints (Track 19)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track19-sports-preferences-and-hobbies.mp3
 * 
 * Standard Cambridge IELTS Simulation:
 * - Part 1: Sports & Hobby Preferences Note Completion (Questions 1–5)
 * - Part 2: Attitude, Wish Clauses & Constraint Traps (Questions 6–10)
 */

export const track19SportsPreferences = {
  id: 'ielts-listening-track19-sports-preferences',
  title: 'IELTS Listening Practice: Sports Preferences & Leisure Constraints (Track 19)',
  titleEn: 'IELTS Listening Practice: Sports Preferences & Leisure Constraints (Track 19)',
  titleVi: 'Luyện đề IELTS Listening: Sở thích thể thao & Rào cản sinh hoạt (Track 19)',
  description: 'Bộ luyện thi IELTS Listening Section 1/2 thực chiến: Phân tích 4 phát biểu thể hiện sở thích, mong muốn và các rào cản sinh hoạt thực tế (bộ môn khúc côn cầu hockey, cấu trúc ước muốn về địa điểm bơi lội, bẫy thiếu thời gian đi câu cá, và sự hào hứng đón chờ video games).',
  descriptionEn: 'Authentic Cambridge IELTS practice: Analyzing 4 statements on personal leisure pursuits, preferences, and constraints, covering hockey adoration, swimming venue limitations, fishing time restrictions, and anticipation of upcoming video games.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 1/2 thực chiến: Phân tích 4 phát biểu thể hiện sở thích, mong muốn và các rào cản sinh hoạt thực tế (bộ môn khúc côn cầu hockey, cấu trúc ước muốn về địa điểm bơi lội, bẫy thiếu thời gian đi câu cá, và sự hào hứng đón chờ video games).',
  totalQuestions: 10,
  timeLimitMinutes: 12,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track19-sports-preferences-and-hobbies.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track19-sports-preferences-and-hobbies.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Sports, Hobbies & Personal Comments',
      context: 'Listen to 4 speakers discussing their preferred sports, pastimes, and everyday limitations.',
      audioTimestampStart: 0,
      audioTimestampEnd: 59,
      speakers: [
        { name: 'Female Speaker 1', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker 1', gender: 'Male', accent: 'British' },
        { name: 'Female Speaker 2', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker 2', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 19.
[00:02] One.
[00:04] My favorite sport is hockey. It's amazing.
[00:09] My favorite sport is hockey. It's amazing.
[00:14]
[00:15] Two.
[00:16] I like swimming, but I wish there were more places to swim where I live.
[00:22] I like swimming, but I wish there were more places to swim where I live.
[00:27]
[00:28] Three.
[00:30] I've always liked fishing, but I don't have time to do it anymore.
[00:36] I've always liked fishing, but I don't have time to do it anymore.
[00:42]
[00:43] Four.
[00:44] I'm really excited about all the new video games that will come out soon. I can't wait.
[00:52] I'm really excited about all the new video games that will come out soon. I can't wait.`,
      questionGroups: [
        {
          id: 'qg-t19-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Leisure Pursuits & Constraints',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS for each answer.',
          headerTitle: 'SPORTS & LEISURE ACTIVITIES SUMMARY',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'The first speaker regards ................ as their favorite sporting activity.',
              prefixText: 'The first speaker regards',
              suffixText: 'as their favorite sporting activity.',
              answer: 'hockey',
              acceptableAnswers: ['hockey', 'Hockey'],
              evidenceQuote: 'My favorite sport is hockey.',
              evidenceTimestamp: 4,
              explanation: 'Môn thể thao yêu thích nhất của người nói thứ nhất là khúc côn cầu (hockey).',
              explanationEn: 'The first speaker clearly states that their favorite sport is hockey.',
              explanationVi: 'Môn thể thao yêu thích nhất của người nói thứ nhất là khúc côn cầu (hockey).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'The speaker expresses great enthusiasm by describing hockey as ................ .',
              prefixText: 'The speaker expresses great enthusiasm by describing hockey as',
              suffixText: '.',
              answer: 'amazing',
              acceptableAnswers: ['amazing', 'Amazing'],
              evidenceQuote: 'It\'s amazing.',
              evidenceTimestamp: 6,
              explanation: 'Tính từ miêu tả sự tuyệt vời của khúc côn cầu là "amazing".',
              explanationEn: 'The adjective used by the speaker to express adoration for hockey is "amazing".',
              explanationVi: 'Tính từ miêu tả sự tuyệt vời của khúc côn cầu là "amazing".'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The second speaker wishes there were more ................ to swim in their local area.',
              prefixText: 'The second speaker wishes there were more',
              suffixText: 'to swim in their local area.',
              answer: 'places',
              acceptableAnswers: ['places', 'Places'],
              evidenceQuote: 'I like swimming, but I wish there were more places to swim where I live.',
              evidenceTimestamp: 18,
              explanation: 'Người nói ước gì có nhiều địa điểm ("places") để bơi hơn ở nơi mình sống.',
              explanationEn: 'The speaker specifically wishes for more "places" to swim locally.',
              explanationVi: 'Người nói ước gì có nhiều địa điểm ("places") để bơi hơn ở nơi mình sống.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Although the third speaker has always enjoyed fishing, they lack the ................ to pursue it nowadays.',
              prefixText: 'Although the third speaker has always enjoyed fishing, they lack the',
              suffixText: 'to pursue it nowadays.',
              answer: 'time',
              acceptableAnswers: ['time', 'Time'],
              evidenceQuote: 'I\'ve always liked fishing, but I don\'t have time to do it anymore.',
              evidenceTimestamp: 31,
              explanation: 'Rào cản khiến người nói không còn đi câu cá nữa là do không có thời gian ("don\'t have time").',
              explanationEn: 'The constraint preventing the speaker from fishing is a lack of "time".',
              explanationVi: 'Rào cản khiến người nói không còn đi câu cá nữa là do không có thời gian ("don\'t have time").'
            },
            {
              id: 5,
              order: 5,
              questionText: 'The fourth speaker is eagerly looking forward to new ................ coming out soon.',
              prefixText: 'The fourth speaker is eagerly looking forward to new',
              suffixText: 'coming out soon.',
              answer: 'video games',
              acceptableAnswers: ['video games', 'Video games', 'video game'],
              evidenceQuote: 'I\'m really excited about all the new video games that will come out soon.',
              evidenceTimestamp: 46,
              explanation: 'Sản phẩm giải trí mới mà người nói mong chờ ra mắt là trò chơi điện tử ("video games").',
              explanationEn: 'The upcoming entertainment releases eagerly anticipated are "video games".',
              explanationVi: 'Sản phẩm giải trí mới mà người nói mong chờ ra mắt là trò chơi điện tử ("video games").'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Attitude, Language Nuance & Habit Analysis',
      context: 'Listen again to the 4 statements to evaluate attitudes, grammar intentions, and idiomatic meaning.',
      audioTimestampStart: 0,
      audioTimestampEnd: 59,
      speakers: [
        { name: 'Female Speaker 1', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker 1', gender: 'Male', accent: 'British' },
        { name: 'Female Speaker 2', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker 2', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 19.
[00:02] One.
[00:04] My favorite sport is hockey. It's amazing.
[00:09] My favorite sport is hockey. It's amazing.
[00:14]
[00:15] Two.
[00:16] I like swimming, but I wish there were more places to swim where I live.
[00:22] I like swimming, but I wish there were more places to swim where I live.
[00:27]
[00:28] Three.
[00:30] I've always liked fishing, but I don't have time to do it anymore.
[00:36] I've always liked fishing, but I don't have time to do it anymore.
[00:42]
[00:43] Four.
[00:44] I'm really excited about all the new video games that will come out soon. I can't wait.
[00:52] I'm really excited about all the new video games that will come out soon. I can't wait.`,
      questionGroups: [
        {
          id: 'qg-t19-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Attitude, Grammar Nuances & Comprehension',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'What is the speaker\'s tone and sentiment when discussing hockey in statement one?',
              options: [
                { id: 'A', text: 'Enthusiastic and deeply appreciative', textEn: 'Enthusiastic and deeply appreciative' },
                { id: 'B', text: 'Critical of recent tournament rule changes', textEn: 'Critical of recent tournament rule changes' },
                { id: 'C', text: 'Neutral with slight disappointment', textEn: 'Neutral with slight disappointment' }
              ],
              correctAnswer: 'A',
              explanation: 'Người nói dùng từ "amazing" với ngữ điệu hào hứng, thể hiện sự yêu thích nồng nhiệt (Enthusiastic and deeply appreciative).',
              explanationEn: 'The speaker uses the emphatic adjective "amazing" with lively intonation, demonstrating genuine enthusiasm.',
              explanationVi: 'Người nói dùng từ "amazing" với ngữ điệu hào hứng, thể hiện sự yêu thích nồng nhiệt (Enthusiastic and deeply appreciative).'
            },
            {
              id: 7,
              order: 7,
              questionText: 'In statement two, what does the clause "I wish there were more places to swim where I live" indicate?',
              options: [
                { id: 'A', text: 'The speaker\'s locality lacks an adequate number of swimming facilities', textEn: 'The speaker\'s locality lacks an adequate number of swimming facilities' },
                { id: 'B', text: 'The speaker dislikes swimming in outdoor natural bodies of water', textEn: 'The speaker dislikes swimming in outdoor natural bodies of water' },
                { id: 'C', text: 'Local swimming venues have permanently shut down for renovation', textEn: 'Local swimming venues have permanently shut down for renovation' }
              ],
              correctAnswer: 'A',
              explanation: 'Cấu trúc câu ước "I wish there were more places..." biểu thị thực tế hiện tại là không có đủ địa điểm bơi lội tại nơi cư trú.',
              explanationEn: 'The hypothetical wish structure indicates a real-world shortfall: there are currently insufficient swimming facilities locally.',
              explanationVi: 'Cấu trúc câu ước "I wish there were more places..." biểu thị thực tế hiện tại là không có đủ địa điểm bơi lội tại nơi cư trú.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'What is the decisive reason speaker three no longer goes fishing?',
              options: [
                { id: 'A', text: 'A shortage of available leisure time despite continuing to enjoy the hobby', textEn: 'A shortage of available leisure time despite continuing to enjoy the hobby' },
                { id: 'B', text: 'A sudden loss of interest and boredom with the sport', textEn: 'A sudden loss of interest and boredom with the sport' },
                { id: 'C', text: 'The prohibitive expense of professional angling rods', textEn: 'The prohibitive expense of professional angling rods' }
              ],
              correctAnswer: 'A',
              explanation: 'Bẫy động lực: Người nói khẳng định vẫn luôn thích câu cá ("I\'ve always liked fishing"), nhưng lý do ngừng tham gia là thiếu thời gian ("don\'t have time to do it anymore").',
              explanationEn: 'Motivation trap: The speaker affirms long-standing enjoyment ("always liked fishing"), but cites a time constraint ("don\'t have time anymore") as the sole reason for stopping.',
              explanationVi: 'Bẫy động lực: Người nói khẳng định vẫn luôn thích câu cá ("I\'ve always liked fishing"), nhưng lý do ngừng tham gia là thiếu thời gian ("don\'t have time to do it anymore").'
            },
            {
              id: 9,
              order: 9,
              questionText: 'What does the colloquial expression "I can\'t wait" signify in statement four?',
              options: [
                { id: 'A', text: 'Eager anticipation and immense excitement for an upcoming event', textEn: 'Eager anticipation and immense excitement for an upcoming event' },
                { id: 'B', text: 'Frustration with protracted production delays in software development', textEn: 'Frustration with protracted production delays in software development' },
                { id: 'C', text: 'Refusal to participate due to high purchase prices', textEn: 'Refusal to participate due to high purchase prices' }
              ],
              correctAnswer: 'A',
              explanation: 'Thành ngữ quen thuộc "I can\'t wait" diễn tả tâm trạng vô cùng mong ngóng, phấn khích đón chờ sản phẩm mới.',
              explanationEn: 'The idiomatic expression "I can\'t wait" conveys eager anticipation and excitement for the forthcoming releases.',
              explanationVi: 'Thành ngữ quen thuộc "I can\'t wait" diễn tả tâm trạng vô cùng mong ngóng, phấn khích đón chờ sản phẩm mới.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'What central theme unites all four recorded extracts?',
              options: [
                { id: 'A', text: 'Personal leisure pursuits, preferences, and lifestyle constraints', textEn: 'Personal leisure pursuits, preferences, and lifestyle constraints' },
                { id: 'B', text: 'Rigorous physical training requirements for elite Olympic competitions', textEn: 'Rigorous physical training requirements for elite Olympic competitions' },
                { id: 'C', text: 'The commercial impact of video games on outdoor recreation', textEn: 'The commercial impact of video games on outdoor recreation' }
              ],
              correctAnswer: 'A',
              explanation: 'Cả 4 phát biểu đều xoay quanh sở thích cá nhân, đam mê giải trí và các giới hạn thực tế trong cuộc sống hàng ngày.',
              explanationEn: 'All four extracts discuss personal leisure pursuits, sporting preferences, and real-life lifestyle limitations.',
              explanationVi: 'Cả 4 phát biểu đều xoay quanh sở thích cá nhân, đam mê giải trí và các giới hạn thực tế trong cuộc sống hàng ngày.'
            }
          ]
        }
      ]
    }
  ]
};
