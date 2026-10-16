/**
 * IELTS Listening Practice: Hometown Descriptions, Urban Environment & Academic Lexis (Track 9)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track9-hometown-architecture-and-living.mp3
 * 
 * Standard Cambridge IELTS Simulation:
 * - High-Yield Sentence Completion: Housing, Infrastructure & Culture (Questions 1–8)
 * - Environment, Geography & Lifestyle Analysis (Questions 9–16)
 */

export const track9HometownSentences = {
  id: 'ielts-listening-track9-hometown-lexis',
  title: 'IELTS Listening Practice: Hometown Descriptions & Urban Lexis (Track 9)',
  description: 'Bộ luyện thi IELTS Listening Section 1 & 2 chuyên sâu về từ vựng miêu tả quê hương và đô thị: Nhà ở (apartment, accommodation), kiến trúc (architecture, escalators, monument), xã hội và cư dân (inhabitants, easygoing, residential areas) cùng địa lý và môi trường (traffic, countryside, valleys, regional food).',
  totalQuestions: 16,
  timeLimitMinutes: 20,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track9-hometown-architecture-and-living.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track9-hometown-architecture-and-living.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Housing, Architecture & Civic Monuments (Items 1–8)',
      context: 'Eight distinct spoken statements describing personal living situations, architectural marvels, civic amenities, and local populations.',
      audioTimestampStart: 0,
      audioTimestampEnd: 114,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 9.
[00:01] 1. Right now, I'm living in an apartment with my friends. (repeated)
[00:13] 2. I'm not too happy with my current accommodation. It's too small. (repeated)
[00:26] 3. The architecture in my hometown is fascinating. (repeated)
[00:38] 4. I get up early as there's a lot of construction going on across the road. (repeated)
[00:51] 5. My shopping mall has a lot of escalators as there are 10 floors in total. (repeated)
[01:08] 6. The inhabitants of my hometown are pretty easygoing as we live in a place with good weather. (repeated)
[01:24] 7. The most famous monument in my hometown is the Statue of Liberty. (repeated)
[01:39] 8. Most visitors to my hometown go to the museum as it's very famous. (repeated)`,
      questionGroups: [
        {
          id: 'qg-t9-p1',
          type: 'sentence_completion',
          title: 'Questions 1–8: Sentence Completion',
          instruction: 'Complete the sentences below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'HOMETOWN ARCHITECTURE & LIVING CONDITIONS',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Currently, the speaker resides in an ................ alongside friends.',
              prefixText: 'Currently, the speaker resides in an',
              suffixText: 'alongside friends.',
              answer: 'apartment',
              acceptableAnswers: ['apartment'],
              evidenceQuote: "Right now, I'm living in an apartment with my friends.",
              evidenceTimestamp: 3,
              explanation: 'Người nói hiện đang sống trong một căn hộ (apartment) cùng bạn bè.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'The resident expresses dissatisfaction with the lodging because it is ................',
              prefixText: 'The resident expresses dissatisfaction with the lodging because it is',
              suffixText: '.',
              answer: 'too small',
              acceptableAnswers: ['too small', 'small'],
              evidenceQuote: "I'm not too happy with my current accommodation. It's too small.",
              evidenceTimestamp: 16,
              explanation: 'Nơi ở hiện tại bị phàn nàn là quá chật chội (too small).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The town\'s ................ is regarded by the speaker as fascinating.',
              prefixText: "The town's",
              suffixText: 'is regarded by the speaker as fascinating.',
              answer: 'architecture',
              acceptableAnswers: ['architecture'],
              evidenceQuote: 'The architecture in my hometown is fascinating.',
              evidenceTimestamp: 28,
              explanation: 'Kiến trúc (architecture) của thị trấn được miêu tả là rất lôi cuốn, hấp dẫn.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Early morning wakefulness is triggered by road-facing ................ work.',
              prefixText: 'Early morning wakefulness is triggered by road-facing',
              suffixText: 'work.',
              answer: 'construction',
              acceptableAnswers: ['construction'],
              evidenceQuote: "I get up early as there's a lot of construction going on across the road.",
              evidenceTimestamp: 41,
              explanation: 'Việc thức dậy sớm do hoạt động xây dựng (construction) diễn ra bên kia đường.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Due to having 10 floors, the shopping centre is equipped with numerous ................',
              prefixText: 'Due to having 10 floors, the shopping centre is equipped with numerous',
              suffixText: '.',
              answer: 'escalators',
              acceptableAnswers: ['escalators', 'escalator'],
              evidenceQuote: 'My shopping mall has a lot of escalators as there are 10 floors in total.',
              evidenceTimestamp: 54,
              explanation: 'Vì trung tâm thương mại có 10 tầng nên được lắp đặt rất nhiều thang cuốn (escalators).'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Local ................ are known for their easygoing disposition due to favourable weather.',
              prefixText: 'Local',
              suffixText: 'are known for their easygoing disposition due to favourable weather.',
              answer: 'inhabitants',
              acceptableAnswers: ['inhabitants', 'residents', 'inhabitant'],
              evidenceQuote: 'The inhabitants of my hometown are pretty easygoing as we live in a place with good weather.',
              evidenceTimestamp: 70,
              explanation: 'Cư dân (inhabitants) địa phương rất dễ tính, thoải mái (easygoing) nhờ thời tiết đẹp.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'The most renowned civic ................ is the Statue of Liberty.',
              prefixText: 'The most renowned civic',
              suffixText: 'is the Statue of Liberty.',
              answer: 'monument',
              acceptableAnswers: ['monument'],
              evidenceQuote: 'The most famous monument in my hometown is the Statue of Liberty.',
              evidenceTimestamp: 86,
              explanation: 'Tượng Nữ thần Tự do là công trình kỷ niệm / đài tưởng niệm (monument) nổi tiếng nhất.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Tourists predominantly flock to the ................ because of its fame.',
              prefixText: 'Tourists predominantly flock to the',
              suffixText: 'because of its fame.',
              answer: 'museum',
              acceptableAnswers: ['museum'],
              evidenceQuote: "Most visitors to my hometown go to the museum as it's very famous.",
              evidenceTimestamp: 101,
              explanation: 'Hầu hết du khách ghé thăm viện bảo tàng (museum) vì danh tiếng của nó.'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Geography, Environment & Regional Traditions (Items 9–16)',
      context: 'Eight statements detailing urban zoning, sports facilities, rural migration, environmental challenges, geography, and local culinary culture.',
      audioTimestampStart: 114,
      audioTimestampEnd: 242,
      speakers: [
        { name: 'Female Speaker', gender: 'Female', accent: 'British' },
        { name: 'Male Speaker', gender: 'Male', accent: 'British' }
      ],
      transcript: `[01:54] 9. The most boring places in my hometown are the residential areas as there are no shops there. (repeated)
[02:12] 10. My hometown has a huge stadium where people go to see the local football team. (repeated)
[02:27] 11. These days, many people are leaving the city to go to the countryside, where it's cleaner. (repeated)
[02:43] 12. I'd say that due to the traffic in my hometown, the environment there is getting worse. (repeated)
[02:59] 13. My hometown has interesting geography, with big mountains and deep valleys. (repeated)
[03:16] 14. The most interesting thing about where I live is the regional food that you can only get here. (repeated)
[03:32] 15. On average, we get pretty warm temperatures here in my hometown. (repeated)
[03:45] 16. Because I live in the countryside, the scenery here is beautiful, very colorful and bright. (repeated)`,
      questionGroups: [
        {
          id: 'qg-t9-p2',
          type: 'sentence_completion',
          title: 'Questions 9–16: Environmental & Geographic Characteristics',
          instruction: 'Complete the sentences below.\nWrite NO MORE THAN TWO WORDS for each answer.',
          headerTitle: 'URBAN ZONING & REGIONAL PROFILE',
          questions: [
            {
              id: 9,
              order: 9,
              questionText: 'Suburban ................ are viewed as dull because they lack commercial outlets.',
              prefixText: 'Suburban',
              suffixText: 'are viewed as dull because they lack commercial outlets.',
              answer: 'residential areas',
              acceptableAnswers: ['residential areas', 'residential area'],
              evidenceQuote: 'The most boring places in my hometown are the residential areas as there are no shops there.',
              evidenceTimestamp: 118,
              explanation: 'Các khu dân cư (residential areas) bị coi là nhàm chán nhất vì không có cửa hàng buôn bán.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Fans assemble at a massive ................ to support their local football club.',
              prefixText: 'Fans assemble at a massive',
              suffixText: 'to support their local football club.',
              answer: 'stadium',
              acceptableAnswers: ['stadium'],
              evidenceQuote: 'My hometown has a huge stadium where people go to see the local football team.',
              evidenceTimestamp: 134,
              explanation: 'Người dân đến sân vận động (stadium) khổng lồ để xem đội bóng đá địa phương thi đấu.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'Citizens relocate to rural districts because the surroundings are ................',
              prefixText: 'Citizens relocate to rural districts because the surroundings are',
              suffixText: '.',
              answer: 'cleaner',
              acceptableAnswers: ['cleaner'],
              evidenceQuote: "These days, many people are leaving the city to go to the countryside, where it's cleaner.",
              evidenceTimestamp: 151,
              explanation: 'Nhiều người rời thành phố về vùng nông thôn vì ở đó môi trường sạch hơn (cleaner).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Environmental degradation in the town is primarily blamed on vehicular ................',
              prefixText: 'Environmental degradation in the town is primarily blamed on vehicular',
              suffixText: '.',
              answer: 'traffic',
              acceptableAnswers: ['traffic'],
              evidenceQuote: "I'd say that due to the traffic in my hometown, the environment there is getting worse.",
              evidenceTimestamp: 166,
              explanation: 'Tình trạng môi trường ngày càng tồi tệ hơn chủ yếu do ách tắc và lưu lượng giao thông (traffic).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'The local landscape is characterized by high mountains alongside deep ................',
              prefixText: 'The local landscape is characterized by high mountains alongside deep',
              suffixText: '.',
              answer: 'valleys',
              acceptableAnswers: ['valleys', 'valley'],
              evidenceQuote: 'My hometown has interesting geography, with big mountains and deep valleys.',
              evidenceTimestamp: 182,
              explanation: 'Địa lý địa phương có những ngọn núi lớn và những thung lũng sâu (deep valleys).'
            },
            {
              id: 14,
              order: 14,
              questionText: 'A standout attraction unique to the region is its distinctive ................',
              prefixText: 'A standout attraction unique to the region is its distinctive',
              suffixText: '.',
              answer: 'regional food',
              acceptableAnswers: ['regional food', 'food'],
              evidenceQuote: 'The most interesting thing about where I live is the regional food that you can only get here.',
              evidenceTimestamp: 198,
              explanation: 'Điểm thú vị nhất là món ăn đặc sản vùng miền (regional food) chỉ có tại địa phương này.'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Climatically, the hometown enjoys generally ................ throughout the year.',
              prefixText: 'Climatically, the hometown enjoys generally',
              suffixText: 'throughout the year.',
              answer: 'warm temperatures',
              acceptableAnswers: ['warm temperatures', 'warm temperature'],
              evidenceQuote: 'On average, we get pretty warm temperatures here in my hometown.',
              evidenceTimestamp: 214,
              explanation: 'Về khí hậu, trung bình thị trấn có nền nhiệt độ khá ấm áp (warm temperatures).'
            },
            {
              id: 16,
              order: 16,
              questionText: 'The countryside scenery is praised for being picturesque, vibrant and ................',
              prefixText: 'The countryside scenery is praised for being picturesque, vibrant and',
              suffixText: '.',
              answer: 'bright',
              acceptableAnswers: ['bright'],
              evidenceQuote: 'Because I live in the countryside, the scenery here is beautiful, very colorful and bright.',
              evidenceTimestamp: 231,
              explanation: 'Phong cảnh vùng nông thôn được khen ngợi là rất đẹp, rực rỡ sắc màu và tươi sáng (colorful and bright).'
            }
          ]
        }
      ]
    }
  ]
};
