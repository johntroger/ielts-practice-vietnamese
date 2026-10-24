/**
 * IELTS Listening Practice: Athletic Requirements & Sports Identification (Track 13)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track13-sports-and-physical-skills.mp3
 * 
 * Standard Cambridge IELTS Section 2 / Section 3 Simulation:
 * - Part 1: Sports Identification & Matching Requirements (Questions 1–5)
 * - Part 2: Note & Sentence Completion (Questions 6–10)
 */

export const track13SportsAndSkills = {
  id: 'ielts-listening-track13-sports-skills',
  title: 'IELTS Listening Practice: Athletic Requirements & Sports Identification (Track 13)',
  titleEn: 'IELTS Listening Practice: Athletic Requirements & Sports Identification (Track 13)',
  titleVi: 'Luyện đề IELTS Listening: Yêu cầu thể lực & Nhận diện môn thể thao (Track 13)',
  description: 'Bộ luyện thi IELTS Listening mô phỏng chuẩn Cambridge: Phân tích các đặc thù thể thao, yêu cầu thể lực và kỹ năng vận động (Badminton, Gymnastics, Table Tennis, Weightlifting, Basketball) qua 5 đoạn mô tả ngắn.',
  descriptionEn: 'Authentic Cambridge IELTS practice: Analysis of athletic requirements and movement profiles across five sports (badminton, gymnastics, table tennis, weightlifting, basketball) via short descriptive recordings.',
  descriptionVi: 'Bộ luyện thi IELTS Listening mô phỏng chuẩn Cambridge: Phân tích các đặc thù thể thao, yêu cầu thể lực và kỹ năng vận động (Badminton, Gymnastics, Table Tennis, Weightlifting, Basketball) qua 5 đoạn mô tả ngắn.',
  totalQuestions: 10,
  timeLimitMinutes: 12,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track13-sports-and-physical-skills.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track13-sports-and-physical-skills.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Sports Classification & Feature Matching',
      context: 'Listen to five short descriptions of different sports and their physical requirements.',
      audioTimestampStart: 0,
      audioTimestampEnd: 81,
      speakers: [
        { name: 'Male Speaker', gender: 'Male', accent: 'British' },
        { name: 'Female Speaker', gender: 'Female', accent: 'British' }
      ],
      transcript: `[00:00] Track 13.
[00:02] One. This game is similar to tennis, but you don't need to have such strong arms to play it. The playing area is smaller and people hit a shuttlecock, a light object with feathers, instead of a ball. You need to think and move quickly.
[00:22] Two. You have to be very strong in your arms and legs, but also light and flexible to do this sport, because you use your whole body all the time.
[00:35] Three. You don't need to move around a lot in this sport, but you need to think very fast, and move your arms quickly and accurately, because the playing area is so small, and the ball is so light.
[00:51] Four. You have to train hard every day to get very strong arms if you want to be good at this sport. You also need to have very strong legs to support yourself, but you don't move around to do it.
[01:07] Five. People who play this sport are usually very tall, but you also have to be able to run a lot, move quickly, and throw very well.`,
      questionGroups: [
        {
          id: 'qg-t13-p1',
          type: 'multiple_choice',
          title: 'Questions 1–5: Sport Identification & Feature Matching',
          instruction: 'Which sport is described in each of the 5 recordings?\nChoose the correct sport for each question.',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Description 1 describes which sport?',
              options: [
                { key: 'A', text: 'Tennis' },
                { key: 'B', text: 'Badminton' },
                { key: 'C', text: 'Squash' },
                { key: 'D', text: 'Volleyball' }
              ],
              answer: 'B',
              evidenceQuote: "This game is similar to tennis... people hit a shuttlecock, a light object with feathers, instead of a ball. You need to think and move quickly.",
              evidenceTimestamp: 13,
              explanation: 'Badminton is played with a feathered shuttlecock instead of a ball in a smaller area.',
              explanationEn: 'Badminton is played with a feathered shuttlecock instead of a ball in a smaller area.',
              explanationVi: 'Môn thể thao tương tự quần vợt nhưng dùng quả cầu lông (shuttlecock - light object with feathers) và sân nhỏ hơn chính là cầu lông (Badminton).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Description 2 describes which sport?',
              options: [
                { key: 'A', text: 'Gymnastics' },
                { key: 'B', text: 'Weightlifting' },
                { key: 'C', text: 'Swimming' },
                { key: 'D', text: 'Running' }
              ],
              answer: 'A',
              evidenceQuote: 'You have to be very strong in your arms and legs, but also light and flexible to do this sport, because you use your whole body all the time.',
              evidenceTimestamp: 27,
              explanation: 'Gymnastics requires strong limbs while remaining light, flexible, and engaging the whole body.',
              explanationEn: 'Gymnastics requires strong limbs while remaining light, flexible, and engaging the whole body.',
              explanationVi: 'Môn thể thao đòi hỏi tay chân khỏe, cơ thể nhẹ nhàng dẻo dai (light and flexible) và dùng toàn bộ cơ thể liên tục chính là thể dục dụng cụ (Gymnastics).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Description 3 describes which sport?',
              options: [
                { key: 'A', text: 'Golf' },
                { key: 'B', text: 'Table tennis' },
                { key: 'C', text: 'Badminton' },
                { key: 'D', text: 'Cricket' }
              ],
              answer: 'B',
              evidenceQuote: "You don't need to move around a lot... move your arms quickly and accurately, because the playing area is so small, and the ball is so light.",
              evidenceTimestamp: 44,
              explanation: 'Table tennis involves minimal foot movement, rapid reflexes, and high arm precision over a compact surface.',
              explanationEn: 'Table tennis involves minimal foot movement, rapid reflexes, and high arm precision over a compact surface.',
              explanationVi: 'Môn thể thao không cần di chuyển nhiều, suy nghĩ cực nhanh, tay cử động nhanh và chuẩn xác, sân chơi rất nhỏ và bóng rất nhẹ chính là bóng bàn (Table tennis).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Description 4 describes which sport?',
              options: [
                { key: 'A', text: 'Weightlifting' },
                { key: 'B', text: 'Rowing' },
                { key: 'C', text: 'Boxing' },
                { key: 'D', text: 'Wrestling' }
              ],
              answer: 'A',
              evidenceQuote: 'train hard every day to get very strong arms... very strong legs to support yourself, but you don\'t move around to do it.',
              evidenceTimestamp: 57,
              explanation: 'Weightlifting demands daily training for powerful arms and strong supporting legs without moving across the floor.',
              explanationEn: 'Weightlifting demands daily training for powerful arms and strong supporting legs without moving across the floor.',
              explanationVi: 'Môn thể thao cần tay cực khỏe, chân khỏe để trụ vững và không di chuyển vòng quanh chính là cử tạ (Weightlifting).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Description 5 describes which sport?',
              options: [
                { key: 'A', text: 'Football' },
                { key: 'B', text: 'Basketball' },
                { key: 'C', text: 'Baseball' },
                { key: 'D', text: 'Rugby' }
              ],
              answer: 'B',
              evidenceQuote: 'People who play this sport are usually very tall, but you also have to be able to run a lot, move quickly, and throw very well.',
              evidenceTimestamp: 72,
              explanation: 'Basketball players are typically tall and must run extensively, maneuver quickly, and throw accurately.',
              explanationEn: 'Basketball players are typically tall and must run extensively, maneuver quickly, and throw accurately.',
              explanationVi: 'Môn thể thao mà vận động viên thường rất cao (very tall), chạy nhiều, di chuyển nhanh và ném bóng chuẩn (throw very well) chính là bóng rổ (Basketball).'
            }
          ]
        },
        {
          id: 'qg-t13-p2',
          type: 'form_completion',
          title: 'Questions 6–10: Sport Characteristics & Requirements',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'ATHLETIC SKILLS & GEAR SUMMARY',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'Unlike tennis, players in badminton hit a ................ with feathers rather than a ball.',
              prefixText: 'Unlike tennis, players in badminton hit a',
              suffixText: 'with feathers rather than a ball.',
              answer: 'shuttlecock',
              acceptableAnswers: ['shuttlecock', 'a shuttlecock'],
              evidenceQuote: 'people hit a shuttlecock, a light object with feathers, instead of a ball.',
              evidenceTimestamp: 14,
              explanation: 'The projectile used in badminton is called a "shuttlecock".',
              explanationEn: 'The projectile used in badminton is called a "shuttlecock".',
              explanationVi: 'Quả cầu lông trong tiếng Anh là "shuttlecock".'
            },
            {
              id: 7,
              order: 7,
              questionText: 'In gymnastics, athletes must possess arms and legs that are strong, while remaining light and ................',
              prefixText: 'In gymnastics, athletes must possess arms and legs that are strong, while remaining light and',
              suffixText: '.',
              answer: 'flexible',
              acceptableAnswers: ['flexible'],
              evidenceQuote: 'You have to be very strong in your arms and legs, but also light and flexible to do this sport',
              evidenceTimestamp: 28,
              explanation: 'Gymnasts must remain both "light and flexible".',
              explanationEn: 'Gymnasts must remain both "light and flexible".',
              explanationVi: 'Vận động viên thể dục dụng cụ cần "light and flexible" (nhẹ nhàng và dẻo dai).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Table tennis players must react swiftly and move their arms both quickly and ................',
              prefixText: 'Table tennis players must react swiftly and move their arms both quickly and',
              suffixText: '.',
              answer: 'accurately',
              acceptableAnswers: ['accurately'],
              evidenceQuote: 'move your arms quickly and accurately, because the playing area is so small',
              evidenceTimestamp: 43,
              explanation: 'Players must move their arms "quickly and accurately".',
              explanationEn: 'Players must move their arms "quickly and accurately".',
              explanationVi: 'Người chơi bóng bàn phải di chuyển cánh tay "quickly and accurately" (nhanh chóng và chính xác).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'In weightlifting, you do not walk around, but you need powerful legs to ................',
              prefixText: 'In weightlifting, you do not walk around, but you need powerful legs to',
              suffixText: '.',
              answer: 'support yourself',
              acceptableAnswers: ['support yourself', 'support themselves', 'support'],
              evidenceQuote: 'You also need to have very strong legs to support yourself, but you don\'t move around to do it.',
              evidenceTimestamp: 61,
              explanation: 'Athletes rely on leg power to "support yourself".',
              explanationEn: 'Athletes rely on leg power to "support yourself".',
              explanationVi: 'Chân khỏe dùng để "support yourself" (trụ vững cơ thể).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Apart from exceptional height and running speed, basketball players must know how to ................ proficiently.',
              prefixText: 'Apart from exceptional height and running speed, basketball players must know how to',
              suffixText: 'proficiently.',
              answer: 'throw very well',
              acceptableAnswers: ['throw very well', 'throw'],
              evidenceQuote: 'run a lot, move quickly, and throw very well.',
              evidenceTimestamp: 77,
              explanation: 'Basketball players must possess the ability to "throw very well".',
              explanationEn: 'Basketball players must possess the ability to "throw very well".',
              explanationVi: 'Kỹ năng ném bóng trong đoạn băng là "throw very well".'
            }
          ]
        }
      ]
    }
  ]
};
