/**
 * IELTS Listening Practice: Intonation, Sentence Stress & Speaker Emotion (Track 29)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track29-intonation-stress-speaker-attitude.mp3
 * 
 * Standard Cambridge IELTS Section 3 Phonological & Attitude Simulation:
 * - Part 1: Speaker Attitude & Emotion Identification (Questions 1–6)
 * - Part 2: Acoustic Stress & Discourse Intonation Analysis (Questions 7–10)
 */

export const track29IntonationAttitude = {
  id: 'ielts-listening-track29-intonation-attitude',
  title: 'IELTS Listening Practice: Intonation, Stress & Speaker Attitude (Track 29)',
  titleEn: 'IELTS Listening Practice: Intonation, Stress & Speaker Attitude (Track 29)',
  titleVi: 'Luyện đề IELTS Listening: Ngữ điệu, Trọng âm câu & Thái độ người nói (Track 29)',
  description: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Phân tích 6 cặp câu đối chiếu (1A-1B đến 6A-6B) để nhận diện thái độ cảm xúc, sự nhấn giọng có chủ đích (emotive stress), sự ngạc nhiên, bi kịch và tính trang trọng trong phát ngôn tiếng Anh chuẩn khảo thí.',
  descriptionEn: 'Authentic Cambridge IELTS Section 3 phonological analysis: Examine six comparative utterance pairs (1A–1B through 6A–6B) to distinguish expressive emotional emphasis, dramatic pitch inflection, and speaker attitude from neutral, matter-of-fact delivery.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 3 học thuật: Phân tích 6 cặp câu đối chiếu (1A-1B đến 6A-6B) để nhận diện thái độ cảm xúc, sự nhấn giọng có chủ đích (emotive stress), sự ngạc nhiên, bi kịch và tính trang trọng trong phát ngôn tiếng Anh chuẩn khảo thí.',
  totalQuestions: 10,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track29-intonation-stress-speaker-attitude.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track29-intonation-stress-speaker-attitude.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Speaker Attitude & Emotive Emphasis Detection',
      titleEn: 'Part 1: Speaker Attitude & Emotive Emphasis Detection',
      titleVi: 'Phần 1: Nhận diện thái độ & Mức độ nhấn mạnh cảm xúc của người nói',
      context: 'Listen to six pairs of statements (1A/1B through 6A/6B). In each pair, decide which speaker expresses stronger emotion, enthusiasm, anxiety, or dramatic emphasis.',
      contextEn: 'Listen to six pairs of statements (1A/1B through 6A/6B). In each pair, decide which speaker expresses stronger emotion, enthusiasm, anxiety, or dramatic emphasis.',
      contextVi: 'Lắng nghe 6 cặp phát ngôn (1A/1B đến 6A/6B). Trong mỗi cặp, hãy xác định người nói nào (A hoặc B) thể hiện cảm xúc, sự nhiệt tình, lo lắng hoặc sắc thái nhấn mạnh mạnh mẽ hơn.',
      audioTimestampStart: 0,
      audioTimestampEnd: 65,
      speakers: [
        { name: 'Narrator', gender: 'Female', accent: 'British' },
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 29.
[00:02] 1A: When the report came in to say the mission was a success, everyone felt that we'd seen something extraordinary.
[00:12] 1B: When the report came in to say the mission was a success, everyone felt that we'd seen something extraordinary.
[00:23] 2A: The disaster was a dreadful tragedy with a massive loss of life.
[00:29] 2B: The disaster was a dreadful tragedy, with a massive loss of life.
[00:37] 3A: I'm feeling pretty uncomfortable about the situation. I hope we can find a solution soon.
[00:46] 3B: I'm feeling pretty uncomfortable about the situation. I hope we can find a solution soon.`,
      questionGroups: [
        {
          id: 'qg-t29-p1',
          type: 'multiple_choice',
          title: 'Questions 1–6: Speaker Attitude Discrimination',
          titleEn: 'Questions 1–6: Speaker Attitude Discrimination',
          titleVi: 'Câu hỏi 1–6: Phân biệt thái độ và cảm xúc người nói',
          instruction: 'Listen and choose the speaker, A or B, who expresses stronger emotion, conviction, or emphasis.',
          instructionEn: 'Listen and choose the speaker, A or B, who expresses stronger emotion, conviction, or emphasis.',
          instructionVi: 'Lắng nghe và chọn người nói, A hoặc B, thể hiện cảm xúc, sự quả quyết hoặc mức độ nhấn mạnh mạnh mẽ hơn.',
          questions: [
            {
              id: 1,
              order: 1,
              type: 'multiple_choice',
              questionText: 'Item 1: Which speaker expresses genuine enthusiasm and awe regarding the mission outcome?',
              questionTextEn: 'Item 1: Which speaker expresses genuine enthusiasm and awe regarding the mission outcome?',
              questionTextVi: 'Mục 1: Người nói nào thể hiện sự nhiệt tình và kinh ngạc chân thực về kết quả của nhiệm vụ?',
              options: [
                { letter: 'A', text: 'Speaker 1A (expressive rising pitch on "extraordinary")', textEn: 'Speaker 1A (expressive rising pitch on "extraordinary")', textVi: 'Người nói 1A (ngữ điệu luyến cao đầy biểu cảm ở từ "extraordinary")' },
                { letter: 'B', text: 'Speaker 1B (flat, monotone reporting)', textEn: 'Speaker 1B (flat, monotone reporting)', textVi: 'Người nói 1B (giọng đều đều, đơn điệu như đọc báo cáo)' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người nói 1A nhấn giọng nổi bật và luyến cao ở từ "extraordinary" và "success", thể hiện sự khâm phục và hứng khởi rõ rệt, trong khi 1B đọc đều đều không cảm xúc.',
              explanationEn: 'Speaker 1A employs dynamic pitch modulation and stress on "extraordinary", whereas 1B speaks with a detached, flat rhythm.',
              audioTimestamp: 4
            },
            {
              id: 2,
              order: 2,
              type: 'multiple_choice',
              questionText: 'Item 2: Which speaker conveys solemn sorrow and heavy emotional gravity over the disaster?',
              questionTextEn: 'Item 2: Which speaker conveys solemn sorrow and heavy emotional gravity over the disaster?',
              questionTextVi: 'Mục 2: Người nói nào truyền tải sự đau buồn trang nghiêm và sức nặng cảm xúc sâu sắc về thảm họa?',
              options: [
                { letter: 'A', text: 'Speaker 2A (fast, matter-of-fact pace)', textEn: 'Speaker 2A (fast, matter-of-fact pace)', textVi: 'Người nói 2A (nhịp độ nhanh, đọc sự việc đơn thuần)' },
                { letter: 'B', text: 'Speaker 2B (prolonged vowels, deeper sorrowful resonance)', textEn: 'Speaker 2B (prolonged vowels, deeper sorrowful resonance)', textVi: 'Người nói 2B (kéo dài nguyên âm, độ ngân vang trầm buồn sâu sắc)' }
              ],
              answer: 'B',
              correctAnswer: 'B',
              explanation: 'Người nói 2B hạ thấp âm lượng, kéo dài nguyên âm và ngắt nhịp trang nghiêm ở "dreadful tragedy" và "massive loss of life", tạo cảm giác bi thương sâu sắc.',
              explanationEn: 'Speaker 2B uses lengthened vowel duration and somber resonance on "dreadful tragedy" and "massive loss", conveying genuine tragedy.',
              audioTimestamp: 30
            },
            {
              id: 3,
              order: 3,
              type: 'multiple_choice',
              questionText: 'Item 3: Which speaker demonstrates heightened personal unease and acute psychological stress?',
              questionTextEn: 'Item 3: Which speaker demonstrates heightened personal unease and acute psychological stress?',
              questionTextVi: 'Mục 3: Người nói nào bộc lộ sự bất an cá nhân gia tăng và căng thẳng tâm lý rõ rệt?',
              options: [
                { letter: 'A', text: 'Speaker 3A (calm, neutral pacing)', textEn: 'Speaker 3A (calm, neutral pacing)', textVi: 'Người nói 3A (nhịp độ điềm tĩnh, trung tính)' },
                { letter: 'B', text: 'Speaker 3B (higher pitch peak and anxious inflection)', textEn: 'Speaker 3B (higher pitch peak and anxious inflection)', textVi: 'Người nói 3B (đỉnh cao độ vút lên và ngữ điệu đầy lo lắng)' }
              ],
              answer: 'B',
              correctAnswer: 'B',
              explanation: 'Người nói 3B nâng cao độ đột ngột ở cụm "pretty uncomfortable", thể hiện rõ sự bồn chồn lo lắng trong lòng.',
              explanationEn: 'Speaker 3B exhibits a pronounced pitch spike on "pretty uncomfortable", communicating genuine anxiety.',
              audioTimestamp: 48
            },
            {
              id: 4,
              order: 4,
              type: 'multiple_choice',
              questionText: 'Item 4: Which speaker expresses warm praise and sincere admiration for the team\'s results?',
              questionTextEn: 'Item 4: Which speaker expresses warm praise and sincere admiration for the team\'s results?',
              questionTextVi: 'Mục 4: Người nói nào thể hiện lời khen ngợi nồng nhiệt và sự khâm phục chân thành dành cho kết quả của đội?',
              options: [
                { letter: 'A', text: 'Speaker 4A (enthusiastic cadence on "stunning" and "marvelous")', textEn: 'Speaker 4A (enthusiastic cadence on "stunning" and "marvelous")', textVi: 'Người nói 4A (nhịp điệu hồ hởi ở các từ "stunning" và "marvelous")' },
                { letter: 'B', text: 'Speaker 4B (indifferent, subdued delivery)', textEn: 'Speaker 4B (indifferent, subdued delivery)', textVi: 'Người nói 4B (phát âm lãnh đạm, chùng giọng)' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người nói 4A nhấn âm rõ ràng, giọng bừng sáng ở "stunning" và "marvelous job", trong khi 4B phát âm đều đều thiếu nhiệt huyết.',
              explanationEn: 'Speaker 4A delivers the adjectives "stunning" and "marvelous" with bright, ascending stress.',
              audioTimestamp: 58
            },
            {
              id: 5,
              order: 5,
              type: 'multiple_choice',
              questionText: 'Item 5: Which speaker projects intense sensory awe and vivid excitement about the visual spectacle?',
              questionTextEn: 'Item 5: Which speaker projects intense sensory awe and vivid excitement about the visual spectacle?',
              questionTextVi: 'Mục 5: Người nói nào bộc lộ sự choáng ngợp thị giác mãnh liệt và hào hứng sống động trước quang cảnh?',
              options: [
                { letter: 'A', text: 'Speaker 5A (vibrant pitch dynamic on "impressive" and "tremendous")', textEn: 'Speaker 5A (vibrant pitch dynamic on "impressive" and "tremendous")', textVi: 'Người nói 5A (biên độ cao độ sống động ở "impressive" và "tremendous")' },
                { letter: 'B', text: 'Speaker 5B (flat, restrained intonation)', textEn: 'Speaker 5B (flat, restrained intonation)', textVi: 'Người nói 5B (ngữ điệu phẳng, kìm nén)' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người nói 5A phát âm với cảm giác choáng ngợp, cường độ âm thanh mạnh mẽ ở "impressive sight" và "tremendous".',
              explanationEn: 'Speaker 5A utilizes wide pitch excursions on "impressive" and "tremendous", creating vivid sensory impact.',
              audioTimestamp: 74
            },
            {
              id: 6,
              order: 6,
              type: 'multiple_choice',
              questionText: 'Item 6: Which speaker conveys profound bewilderment and total astonishment at the unexplained mystery?',
              questionTextEn: 'Item 6: Which speaker conveys profound bewilderment and total astonishment at the unexplained mystery?',
              questionTextVi: 'Mục 6: Người nói nào truyền tải sự bối rối sâu sắc và kinh ngạc tột độ trước bí ẩn chưa được giải đáp?',
              options: [
                { letter: 'A', text: 'Speaker 6A (standard declarative statement)', textEn: 'Speaker 6A (standard declarative statement)', textVi: 'Người nói 6A (câu trần thuật tiêu chuẩn)' },
                { letter: 'B', text: 'Speaker 6B (dramatic pauses and emphatic stress on "bizarre" and "incredible")', textEn: 'Speaker 6B (dramatic pauses and emphatic stress on "bizarre" and "incredible")', textVi: 'Người nói 6B (ngắt nhịp kịch tính và nhấn mạnh dứt khoát ở "bizarre" và "incredible")' }
              ],
              answer: 'B',
              correctAnswer: 'B',
              explanation: 'Người nói 6B sử dụng điểm dừng nhấn mạnh và kéo dài âm ở "such a bizarre event" và "incredible", thể hiện sự ngỡ ngàng tột độ.',
              explanationEn: 'Speaker 6B emphasizes "bizarre" and "incredible" with prominent dramatic stress and incredulity.',
              audioTimestamp: 100
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Phonological Features & Applied Discourse Analysis',
      titleEn: 'Part 2: Phonological Features & Applied Discourse Analysis',
      titleVi: 'Phần 2: Đặc điểm âm vị học & Phân tích diễn ngôn ứng dụng',
      context: 'Listen to the remaining audio excerpts (Statements 4–6) and analyze the linguistic mechanisms speakers use to project emotion, urgency, and attitude.',
      contextEn: 'Listen to the remaining audio excerpts (Statements 4–6) and analyze the linguistic mechanisms speakers use to project emotion, urgency, and attitude.',
      contextVi: 'Lắng nghe các trích đoạn âm thanh còn lại (Phát ngôn 4–6) và phân tích các cơ chế ngôn ngữ học được người nói sử dụng để truyền tải cảm xúc, tính cấp bách và thái độ.',
      audioTimestampStart: 56,
      audioTimestampEnd: 110,
      speakers: [
        { name: 'Male Speaker', gender: 'Male', accent: 'British' },
        { name: 'Female Speaker', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:56] 4A: The results were stunning, and the team had done a marvelous job.
[01:04] 4B: The results were stunning, and the team had done a marvelous job.
[01:11] 5A: It was such an impressive sight, and the noise that followed it was tremendous.
[01:21] 5B: It was such an impressive sight, and the noise that followed it was tremendous.
[01:29] 6A: This was such a bizarre event, and it's incredible that we haven't been able to find out what caused it.
[01:38] 6B: This was such a bizarre event, and it's incredible that we haven't been able to find out what caused it.`,
      questionGroups: [
        {
          id: 'qg-t29-p2',
          type: 'multiple_choice',
          title: 'Questions 7–10: Discourse Phonology & Contrastive Stress',
          titleEn: 'Questions 7–10: Discourse Phonology & Contrastive Stress',
          titleVi: 'Câu hỏi 7–10: Âm vị học diễn ngôn & Trọng âm tương phản',
          instruction: 'Choose the correct letter, A, B, or C.',
          instructionEn: 'Choose the correct letter, A, B, or C.',
          instructionVi: 'Chọn chữ cái chính xác, A, B, hoặc C.',
          questions: [
            {
              id: 7,
              order: 7,
              type: 'multiple_choice',
              questionText: 'What phonetic device is employed in 1A to highlight the historic scale of the achievement?',
              questionTextEn: 'What phonetic device is employed in 1A to highlight the historic scale of the achievement?',
              questionTextVi: 'Biện pháp ngữ âm nào được sử dụng trong câu 1A để làm nổi bật quy mô lịch sử của thành tựu?',
              options: [
                { letter: 'A', text: 'Nuclear pitch movement and syllable lengthening on the evaluative adjective "extraordinary"', textEn: 'Nuclear pitch movement and syllable lengthening on the evaluative adjective "extraordinary"', textVi: 'Chuyển động cao độ hạt nhân và kéo dài âm tiết ở tính từ đánh giá "extraordinary"' },
                { letter: 'B', text: 'Abrupt glottal stops inserted between auxiliary verbs', textEn: 'Abrupt glottal stops inserted between auxiliary verbs', textVi: 'Chèn âm tắc thanh hầu đột ngột giữa các trợ động từ' },
                { letter: 'C', text: 'Whispered articulation across the introductory subordinate clause', textEn: 'Whispered articulation across the introductory subordinate clause', textVi: 'Phát âm thì thầm trong suốt mệnh đề phụ mở đầu' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Trong 1A, tính từ "extraordinary" nhận trọng âm chính (nuclear stress) với cao độ vút lên rồi hạ xuống, biểu đạt rõ sự kinh ngạc trước kỳ tích.',
              explanationEn: 'The evaluative adjective "extraordinary" carries the nucleus of the intonation phrase with prominent pitch excursion.',
              audioTimestamp: 8
            },
            {
              id: 8,
              order: 8,
              type: 'multiple_choice',
              questionText: 'Why does Speaker 2B sound significantly more sympathetic and mournful than Speaker 2A?',
              questionTextEn: 'Why does Speaker 2B sound significantly more sympathetic and mournful than Speaker 2A?',
              questionTextVi: 'Tại sao người nói 2B nghe có vẻ đồng cảm và đau xót hơn đáng kể so với người nói 2A?',
              options: [
                { letter: 'A', text: 'Through slower tempo, low pitch register, and expressive pausing around tragic nouns', textEn: 'Through slower tempo, low pitch register, and expressive pausing around tragic nouns', textVi: 'Nhờ nhịp độ chậm hơn, âm vực thấp và các khoảng dừng biểu cảm quanh các danh từ bi kịch' },
                { letter: 'B', text: 'By speaking in an aggressively high-pitched falsetto tone', textEn: 'By speaking in an aggressively high-pitched falsetto tone', textVi: 'Bằng cách nói bằng giọng giả thanh the the cao bất thường' },
                { letter: 'C', text: 'By deliberately omitting unstressed function words', textEn: 'By deliberately omitting unstressed function words', textVi: 'Bằng cách chủ ý lược bỏ các hư từ không mang trọng âm' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người nói 2B giảm tốc độ nói (tempo), hạ thấp cao độ và tạo khoảng ngắt trang trọng quanh "dreadful tragedy" và "massive loss of life" để tạo sắc thái thương cảm.',
              explanationEn: 'Speaker 2B utilizes a reduced speech tempo, lower pitch register, and strategic pausing to express solemn mourning.',
              audioTimestamp: 33
            },
            {
              id: 9,
              order: 9,
              type: 'multiple_choice',
              questionText: 'What vocal characteristic reveals the sense of overwhelming power in statement 5A?',
              questionTextEn: 'What vocal characteristic reveals the sense of overwhelming power in statement 5A?',
              questionTextVi: 'Đặc điểm giọng nói nào làm lộ rõ cảm giác về một sức mạnh choáng ngợp trong phát ngôn 5A?',
              options: [
                { letter: 'A', text: 'A dynamic increase in vocal intensity and acoustic volume on "tremendous"', textEn: 'A dynamic increase in vocal intensity and acoustic volume on "tremendous"', textVi: 'Sự gia tăng cường độ giọng nói và âm lượng âm học ở từ "tremendous"' },
                { letter: 'B', text: 'A monotone robotic delivery with zero pitch variance', textEn: 'A monotone robotic delivery with zero pitch variance', textVi: 'Cách nói đều đều như người máy không có biến thiên cao độ' },
                { letter: 'C', text: 'A sudden dropping of the final consonants in all content words', textEn: 'A sudden dropping of the final consonants in all content words', textVi: 'Sự nuốt phụ âm cuối đột ngột ở tất cả các thực từ' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Ở câu 5A, từ "tremendous" được phát âm với cường độ âm lượng (volume) và năng lượng giọng nói gia tăng rõ rệt, tái hiện sự choáng ngợp của âm thanh.',
              explanationEn: 'The adjective "tremendous" receives intense acoustic energy and volume amplification, reflecting magnitude.',
              audioTimestamp: 77
            },
            {
              id: 10,
              order: 10,
              type: 'multiple_choice',
              questionText: 'In statement 6B, how does the speaker signal that the unsolved nature of the incident defies belief?',
              questionTextEn: 'In statement 6B, how does the speaker signal that the unsolved nature of the incident defies belief?',
              questionTextVi: 'Trong câu 6B, người nói làm thế nào để báo hiệu rằng tính chất chưa được giải đáp của sự cố vượt qua mọi sự tin tưởng thông thường?',
              options: [
                { letter: 'A', text: 'By placing heavy emphasis and sharp disbelieving stress on "bizarre" and "incredible"', textEn: 'By placing heavy emphasis and sharp disbelieving stress on "bizarre" and "incredible"', textVi: 'Bằng cách nhấn rất mạnh và thể hiện sự hoài nghi sâu sắc ở các từ "bizarre" và "incredible"' },
                { letter: 'B', text: 'By laughing sarcastically between each grammatical clause', textEn: 'By laughing sarcastically between each grammatical clause', textVi: 'Bằng cách cười mỉa mai giữa các mệnh đề ngữ pháp' },
                { letter: 'C', text: 'By whispering the word "bizarre" at inaudible acoustic frequencies', textEn: 'By whispering the word "bizarre" at inaudible acoustic frequencies', textVi: 'Bằng cách thì thầm từ "bizarre" ở dải tần số hầu như không nghe thấy' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người nói 6B nhấn mạnh cực kỳ dứt khoát vào "bizarre" và "incredible", kéo dài âm tiết để diễn tả sự không thể tin nổi khi một sự việc kỳ lạ như vậy lại chưa tìm ra nguyên nhân.',
              explanationEn: 'Emphatic stress on "bizarre" and "incredible" combined with incredulous intonation underscores that the unresolved mystery is truly extraordinary.',
              audioTimestamp: 104
            }
          ]
        }
      ]
    }
  ]
};
