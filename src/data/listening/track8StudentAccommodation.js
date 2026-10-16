/**
 * IELTS Listening Practice: Student Shared Housing & City Shopping Habits (Track 8)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track8-student-accommodation-and-shopping.mp3
 * 
 * Standard Cambridge IELTS Simulation:
 * - Student Housing Details & Commute (Questions 1–6)
 * - Living Challenges & Household Tasks (Questions 7–8)
 * - City Gate Shopping Centre & Transport Queues (Questions 9–10)
 * - Retail Preferences & Local Market Attitude (Questions 11–12)
 */

export const track8StudentAccommodation = {
  id: 'ielts-listening-track8-student-housing',
  title: 'IELTS Listening Practice: Student Housing & City Shopping Habits (Track 8)',
  description: 'Bộ luyện thi IELTS Listening Section 1 & 2: Khảo sát chỗ ở sinh viên (nhà 2 tầng, phòng tắm chung, đi bộ 5 phút ra ga tàu, xe buýt 20 phút đến trường, bạn cùng nhà Romania/China/India) và thói quen mua sắm tại City Gate Shopping Centre cùng bẫy chợ truyền thống.',
  totalQuestions: 12,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track8-student-accommodation-and-shopping.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track8-student-accommodation-and-shopping.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Student Accommodation Survey & Daily Commutes',
      context: 'An interviewer asks an international student about her shared house in the city centre, housemates, and local amenities.',
      audioTimestampStart: 0,
      audioTimestampEnd: 95,
      speakers: [
        { name: 'Examiner', gender: 'Male', accent: 'British' },
        { name: 'Student', gender: 'Female', accent: 'European (Romanian)' }
      ],
      transcript: `[00:00] Track 8.
[00:02] Now in this section of the test, I'd like to ask you some questions about yourself and where you live.
[00:09] Do you live in a house or an apartment at the moment?
[00:12] Right now, I'm living in a house with two other students. It's a pretty big house with two floors, a garden, and a shared bathroom. I moved in during the summer.
[00:26] Where do you live, in the city or the countryside?
[00:30] Our house is in the city centre, about 5 minutes' walk from the train station. We're close to all of the shops and restaurants, and our school is about a 20-minute bus ride from my house. There's lots to see and do around there, so I'm pretty happy with the location.
[00:50] Who else lives with you where you live?
[00:53] Well, as I said, I live with two other students. They both go to the same school as me. One of them is from China and the other is from India. I'm from Romania, so I think we live in a pretty international house.
[01:11] Is there anything you don't like about where you live?
[01:14] Well, I don't like sharing my bathroom with others, and the kitchen is often very busy, but I think that's normal for a shared house. Also, we need to do the gardening regularly or things get out of control. Sometimes the trains can be a little loud as well, especially in the mornings.`,
      questionGroups: [
        {
          id: 'qg-t8-p1-notes',
          type: 'form_completion',
          title: 'Questions 1–6: Student Housing Record Form',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'STUDENT ACCOMMODATION PROFILE',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Property structure: A house featuring ................ floors and a garden.',
              prefixText: 'Property structure: A house featuring',
              suffixText: 'floors and a garden.',
              answer: 'two',
              acceptableAnswers: ['two', '2'],
              evidenceQuote: "It's a pretty big house with two floors, a garden, and a shared bathroom.",
              evidenceTimestamp: 18,
              explanation: 'Người nói mô tả ngôi nhà khá lớn với 2 tầng (two floors).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Move-in period: during the ................',
              prefixText: 'Move-in period: during the',
              suffixText: '',
              answer: 'summer',
              acceptableAnswers: ['summer'],
              evidenceQuote: 'I moved in during the summer.',
              evidenceTimestamp: 24,
              explanation: 'Sinh viên chuyển vào ở trong suốt mùa hè (during the summer).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Distance to train station: approximately a ................ walk.',
              prefixText: 'Distance to train station: approximately a',
              suffixText: 'walk.',
              answer: '5 minutes',
              acceptableAnswers: ['5 minutes', 'five minutes', '5 minute', 'five minute', "5 minutes'"],
              evidenceQuote: "Our house is in the city centre, about 5 minutes' walk from the train station.",
              evidenceTimestamp: 33,
              explanation: 'Khoảng cách đi bộ từ nhà đến ga xe lửa là khoảng 5 phút.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Travel time to school: roughly a 20-minute journey by ................',
              prefixText: 'Travel time to school: roughly a 20-minute journey by',
              suffixText: '.',
              answer: 'bus',
              acceptableAnswers: ['bus', 'bus ride'],
              evidenceQuote: 'and our school is about a 20-minute bus ride from my house.',
              evidenceTimestamp: 42,
              explanation: 'Đến trường mất khoảng 20 phút đi bằng xe buýt (bus ride).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Speaker\'s country of origin: ................',
              prefixText: "Speaker's country of origin:",
              suffixText: '',
              answer: 'Romania',
              acceptableAnswers: ['Romania', 'romania'],
              evidenceQuote: "One of them is from China and the other is from India. I'm from Romania...",
              evidenceTimestamp: 65,
              explanation: 'Hai bạn cùng nhà đến từ Trung Quốc và Ấn Độ, còn bản thân người nói đến từ Romania.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Unwanted morning noise originates from the ................',
              prefixText: 'Unwanted morning noise originates from the',
              suffixText: '.',
              answer: 'trains',
              acceptableAnswers: ['trains', 'train'],
              evidenceQuote: 'Sometimes the trains can be a little loud as well, especially in the mornings.',
              evidenceTimestamp: 91,
              explanation: 'Âm thanh ồn ào vào buổi sáng xuất phát từ các đoàn tàu chạy gần đó (trains).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Shopping Centers & Retail Habits Discussion',
      context: 'The student explains why young people flock to City Gate Shopping Centre and compares modern shopping malls with traditional local markets.',
      audioTimestampStart: 95,
      audioTimestampEnd: 195,
      speakers: [
        { name: 'Examiner', gender: 'Male', accent: 'British' },
        { name: 'Student', gender: 'Female', accent: 'European (Romanian)' }
      ],
      transcript: `[01:35] Now, let's talk about shopping. Where do most people go shopping where you live?
[01:41] Most people go to the City Gate Shopping Centre, as it's the biggest and has the most shops and restaurants. There is also a cinema and ice rink, so people go there not just to shop, but to hang out with their friends as well. It has all of the famous brands, and most importantly, it's warm in the winter.
[02:04] When do you usually go shopping?
[02:07] I usually go at the weekends, as I'm too busy with my studies to go in the week. The only problem is that the City Gate gets very full at weekends, and you have to wait a long time to get a bus back home, because so many people are trying to catch the bus at the same time as you.
[02:26] Why do lots of young people like to go shopping at big shopping centres?
[02:30] I think it's because everything is in one place, and they're clean and comfortable, and it's safe for young people to meet. Where else can you go that has all of the shops and entertainment under one roof that the big malls have?
[02:47] Would you ever do your shopping at the local market?
[02:50] I'm not really sure, as the local market is more for older people who just want to go and buy some cheaper food or clothes, and the styles and brands on sale at the market are a bit old-fashioned for me personally. Maybe my parents would be fine with going to the market, but there's really nothing interesting for me there.`,
      questionGroups: [
        {
          id: 'qg-t8-p2-mcq',
          type: 'multiple_choice',
          title: 'Questions 7–12: Multiple Choice & Sentence Analysis',
          instruction: 'Choose the correct letter, A, B, or C.',
          headerTitle: 'RETAIL HABITS & MALL ATTRACTIONS',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Besides dining and retail stores, City Gate Shopping Centre provides an entertainment facility in the form of a cinema and a(n)',
              options: [
                'A. bowling alley',
                'B. ice rink',
                'C. indoor swimming pool'
              ],
              answer: 'B',
              evidenceQuote: 'There is also a cinema and ice rink, so people go there not just to shop, but to hang out with their friends as well.',
              evidenceTimestamp: 111,
              explanation: 'Trung tâm mua sắm City Gate có rạp chiếu phim và sân trượt băng (ice rink).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'What is highlighted as the most significant benefit of City Gate during cold weather?',
              options: [
                'A. Extended indoor opening hours',
                'B. Heated underground car parking',
                'C. It provides a warm environment in winter'
              ],
              answer: 'C',
              evidenceQuote: "It has all of the famous brands, and most importantly, it's warm in the winter.",
              evidenceTimestamp: 122,
              explanation: 'Điểm cộng quan trọng nhất vào mùa lạnh là trung tâm này rất ấm áp vào mùa đông (warm in the winter).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Why does the speaker exclusively shop on weekends?',
              options: [
                'A. Her academic timetable keeps her too occupied on weekdays.',
                'B. Public buses only service the retail park on Saturdays and Sundays.',
                'C. Retail shops offer substantial student discounts at the weekend.'
              ],
              answer: 'A',
              evidenceQuote: "I usually go at the weekends, as I'm too busy with my studies to go in the week.",
              evidenceTimestamp: 127,
              explanation: 'Cô ấy bận học trong tuần nên chỉ có thể đi mua sắm vào cuối tuần (too busy with my studies).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'What major drawback does the speaker experience when visiting City Gate on weekends?',
              options: [
                'A. High restaurant prices due to surge charges',
                'B. Long queues waiting to catch a bus back home',
                'C. Inability to access popular clothing brands'
              ],
              answer: 'B',
              evidenceQuote: 'and you have to wait a long time to get a bus back home, because so many people are trying to catch the bus at the same time as you.',
              evidenceTimestamp: 138,
              explanation: 'Vào cuối tuần, trung tâm rất đông và phải đợi xe buýt về nhà rất lâu vì quá nhiều người bắt xe cùng lúc.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'According to the speaker, large malls attract young people primarily because they offer',
              options: [
                'A. free public Wi-Fi and student lounges',
                'B. comprehensive entertainment and retail all under one roof',
                'C. cheaper merchandise than suburban street stores'
              ],
              answer: 'B',
              evidenceQuote: 'Where else can you go that has all of the shops and entertainment under one roof that the big malls have?',
              evidenceTimestamp: 164,
              explanation: 'Trung tâm thương mại lớn thu hút giới trẻ vì tập hợp mọi cửa hàng và dịch vụ giải trí dưới cùng một mái nhà (under one roof).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'The speaker avoids shopping at the traditional local market because',
              options: [
                'A. the fashion styles and goods sold there appear old-fashioned to her',
                'B. food items are more expensive than at the supermarket',
                'C. it is located too far from the city train station'
              ],
              answer: 'A',
              evidenceQuote: 'and the styles and brands on sale at the market are a bit old-fashioned for me personally.',
              evidenceTimestamp: 184,
              explanation: 'Người nói thấy các mẫu mã và thương hiệu ở chợ truyền thống bị lỗi thời (a bit old-fashioned for me personally).'
            }
          ]
        }
      ]
    }
  ]
};
