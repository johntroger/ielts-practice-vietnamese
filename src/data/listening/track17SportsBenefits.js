/**
 * IELTS Listening Practice: Athletic Motivations & Sport Benefits (Track 17)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track17-sports-benefits-and-opinions.mp3
 * 
 * Standard Cambridge IELTS Section 1/2 Simulation:
 * - Part 1: Stated Motivations & Note Completion (Questions 1–4)
 * - Part 2: Sports Attitude & Reason Analysis (Questions 5–6)
 */

export const track17SportsBenefits = {
  id: 'ielts-listening-track17-sports-benefits',
  title: 'IELTS Listening Practice: Athletic Motivations & Sport Benefits (Track 17)',
  titleEn: 'IELTS Listening Practice: Athletic Motivations & Sport Benefits (Track 17)',
  titleVi: 'Luyện đề IELTS Listening: Động lực & Lợi ích tập luyện thể thao (Track 17)',
  description: 'Bộ luyện thi IELTS Listening thực chiến: Luyện nghe nhận diện quan điểm cá nhân và động lực rèn luyện thể thao giữa môn chèo thuyền (rowing - stay fit and healthy) và quần vợt (tennis - competitive, beat my friends).',
  descriptionEn: 'Authentic Cambridge IELTS practice: Identifying personal attitudes, motivations, and sport benefits comparing rowing (staying fit and healthy) and tennis (competitiveness and beating friends).',
  descriptionVi: 'Bộ luyện thi IELTS Listening thực chiến: Luyện nghe nhận diện quan điểm cá nhân và động lực rèn luyện thể thao giữa môn chèo thuyền (rowing - stay fit and healthy) và quần vợt (tennis - competitive, beat my friends).',
  totalQuestions: 6,
  timeLimitMinutes: 10,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track17-sports-benefits-and-opinions.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track17-sports-benefits-and-opinions.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Speaker Statements on Sport Preferences',
      context: 'Listen to two speakers expressing their personal reasons and motivations for participating in rowing and tennis.',
      audioTimestampStart: 0,
      audioTimestampEnd: 20,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:00] Track 17.
[00:02] One.
[00:03] I think that rowing is a great sport if you want to stay fit and healthy.
[00:08]
[00:10] Two.
[00:11] I often enjoy tennis, as it is very competitive, and I like to beat my friends.`,
      questionGroups: [
        {
          id: 'qg-t17-p1',
          type: 'form_completion',
          title: 'Questions 1–4: Sport Motivation Notes',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'SURVEY OF SPORTING MOTIVATIONS',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'The first speaker considers ................ to be an excellent sport for physical condition.',
              prefixText: 'The first speaker considers',
              suffixText: 'to be an excellent sport for physical condition.',
              answer: 'rowing',
              acceptableAnswers: ['rowing', 'Rowing'],
              evidenceQuote: 'I think that rowing is a great sport if you want to stay fit and healthy.',
              evidenceTimestamp: 3,
              explanation: 'Môn thể thao được người nói số 1 đánh giá cao là chèo thuyền (rowing).',
              explanationEn: 'The sport praised by the first speaker is rowing.',
              explanationVi: 'Môn thể thao được người nói số 1 đánh giá cao là chèo thuyền (rowing).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'The primary goal mentioned for doing rowing is to remain fit and ................',
              prefixText: 'The primary goal mentioned for doing rowing is to remain fit and',
              suffixText: '.',
              answer: 'healthy',
              acceptableAnswers: ['healthy'],
              evidenceQuote: 'I think that rowing is a great sport if you want to stay fit and healthy.',
              evidenceTimestamp: 6,
              explanation: 'Mục đích chính của môn chèo thuyền là giữ vóc dáng cân đối và khỏe mạnh ("stay fit and healthy").',
              explanationEn: 'The purpose cited is to remain fit and healthy.',
              explanationVi: 'Mục đích chính của môn chèo thuyền là giữ vóc dáng cân đối và khỏe mạnh ("stay fit and healthy").'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The second speaker frequently plays tennis because it is considered extremely ................',
              prefixText: 'The second speaker frequently plays tennis because it is considered extremely',
              suffixText: '.',
              answer: 'competitive',
              acceptableAnswers: ['competitive'],
              evidenceQuote: 'I often enjoy tennis, as it is very competitive...',
              evidenceTimestamp: 13,
              explanation: 'Người nói số 2 thích tennis vì môn này mang tính cạnh tranh cao ("very competitive").',
              explanationEn: 'Tennis appeals to the second speaker because it is very competitive.',
              explanationVi: 'Người nói số 2 thích tennis vì môn này mang tính cạnh tranh cao ("very competitive").'
            },
            {
              id: 4,
              order: 4,
              questionText: 'When participating in tennis, the speaker takes pleasure in being able to ................ their peers.',
              prefixText: 'When participating in tennis, the speaker takes pleasure in being able to',
              suffixText: 'their peers.',
              answer: 'beat',
              acceptableAnswers: ['beat'],
              evidenceQuote: 'and I like to beat my friends.',
              evidenceTimestamp: 16,
              explanation: 'Người nói thích cảm giác chiến thắng/đánh bại bạn bè của mình ("beat my friends").',
              explanationEn: 'The speaker enjoys being able to beat their friends in tennis matches.',
              explanationVi: 'Người nói thích cảm giác chiến thắng/đánh bại bạn bè của mình ("beat my friends").'
            }
          ]
        },
        {
          id: 'qg-t17-p2',
          type: 'multiple_choice',
          title: 'Questions 5–6: Attitude & Objective Analysis',
          instruction: 'Choose the correct letter, A, B, C or D.',
          headerTitle: 'ANALYSIS OF REASONS & ATTITUDES',
          questions: [
            {
              id: 5,
              order: 5,
              questionText: 'What is the speaker\'s principal motivation for recommending rowing?',
              options: [
                { id: 'A', text: 'Preserving overall bodily fitness and wellness', textEn: 'Preserving overall bodily fitness and wellness' },
                { id: 'B', text: 'Preparing for national university regattas', textEn: 'Preparing for national university regattas' },
                { id: 'C', text: 'Fostering teamwork and camaraderie outdoors', textEn: 'Fostering teamwork and camaraderie outdoors' },
                { id: 'D', text: 'Relieving psychological pressure from studies', textEn: 'Relieving psychological pressure from studies' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'I think that rowing is a great sport if you want to stay fit and healthy.',
              evidenceTimestamp: 4,
              explanation: 'Lý do chính người nói khuyên tập chèo thuyền là để giữ vóc dáng và sức khỏe tốt ("stay fit and healthy").',
              explanationEn: 'The primary rationale for rowing is preserving bodily fitness and health.',
              explanationVi: 'Lý do chính người nói khuyên tập chèo thuyền là để giữ vóc dáng và sức khỏe tốt ("stay fit and healthy").'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Why does the second speaker favor tennis over non-competitive leisure sports?',
              options: [
                { id: 'A', text: 'They relish rivalry and outperforming their acquaintances', textEn: 'They relish rivalry and outperforming their acquaintances' },
                { id: 'B', text: 'It demands far less equipment transport than water sports', textEn: 'It demands far less equipment transport than water sports' },
                { id: 'C', text: 'Tennis courts are readily available regardless of weather', textEn: 'Tennis courts are readily available regardless of weather' },
                { id: 'D', text: 'It minimizes physical contact while maximizing reflexes', textEn: 'It minimizes physical contact while maximizing reflexes' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'I often enjoy tennis, as it is very competitive, and I like to beat my friends.',
              evidenceTimestamp: 13,
              explanation: 'Người nói yêu thích tennis vì tính cạnh tranh và cảm giác đánh bại bạn bè ("very competitive, and I like to beat my friends").',
              explanationEn: 'The speaker favors tennis because they thrive on competitive rivalry and outplaying their peers.',
              explanationVi: 'Người nói yêu thích tennis vì tính cạnh tranh và cảm giác đánh bại bạn bè ("very competitive, and I like to beat my friends").'
            }
          ]
        }
      ]
    }
  ]
};
