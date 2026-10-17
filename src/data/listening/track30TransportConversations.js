/**
 * IELTS Listening Practice: Everyday Transport & Travel Conversations (Track 30)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track30-transport-travel-conversations.mp3
 * 
 * Standard Cambridge IELTS Section 1 Everyday Social Context Simulation:
 * - Part 1: Note & Table Completion on Transit Schedules, Delays & Travel Choices (Questions 1–5)
 * - Part 2: Multiple Choice on Commuting Decisions, Safety Precautions & Opinions (Questions 6–10)
 */

export const track30TransportConversations = {
  id: 'ielts-listening-track30-transport-conversations',
  title: 'IELTS Listening Practice: Everyday Transport & Travel Scenarios (Track 30)',
  titleEn: 'IELTS Listening Practice: Everyday Transport & Travel Scenarios (Track 30)',
  titleVi: 'Luyện đề IELTS Listening: Tình huống giao thông & Di chuyển hàng ngày (Track 30)',
  description: 'Bộ luyện thi IELTS Listening Section 1 giao tiếp xã hội: 5 đoạn hội thoại thực tế về giao thông công cộng và phương tiện cá nhân (chờ xe buýt trễ giờ, tàu hỏa gặp sự cố phải chuyển sang xe buýt thay thế, tắc đường do sương mù trên cao tốc đi Bristol, lời khuyên đạp xe đi làm vì sức khỏe, và tranh luận về việc mua xe máy sau khi nghỉ hưu).',
  descriptionEn: 'Authentic Cambridge IELTS Section 1 social dialogue practice: Five everyday transport conversations covering bus frequency delays, train cancellations and replacement bus services, motorway weather gridlock, healthy bicycle commuting versus driving, and retirement motorcycle safety debates.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 1 giao tiếp xã hội: 5 đoạn hội thoại thực tế về giao thông công cộng và phương tiện cá nhân (chờ xe buýt trễ giờ, tàu hỏa gặp sự cố phải chuyển sang xe buýt thay thế, tắc đường do sương mù trên cao tốc đi Bristol, lời khuyên đạp xe đi làm vì sức khỏe, và tranh luận về việc mua xe máy sau khi nghỉ hưu).',
  totalQuestions: 10,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track30-transport-travel-conversations.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track30-transport-travel-conversations.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Transit Delays, Disruption Reports & Commute Details',
      titleEn: 'Part 1: Transit Delays, Disruption Reports & Commute Details',
      titleVi: 'Phần 1: Chậm chuyến, Báo cáo gián đoạn & Chi tiết lộ trình di chuyển',
      context: 'Listen to Conversations 1, 2, and 3 discussing urban bus delays, train disruptions to London, and route alternatives to Bristol.',
      contextEn: 'Listen to Conversations 1, 2, and 3 discussing urban bus delays, train disruptions to London, and route alternatives to Bristol.',
      contextVi: 'Lắng nghe các Hội thoại 1, 2 và 3 bàn luận về việc xe buýt nội đô bị trễ, sự cố đường ray tàu hỏa đi London và lựa chọn lộ trình đi Bristol.',
      audioTimestampStart: 0,
      audioTimestampEnd: 95,
      speakers: [
        { name: 'Bus Passengers (Man & Woman)', gender: 'Mixed', accent: 'British' },
        { name: 'Train Passenger & Station Attendant', gender: 'Mixed', accent: 'British' },
        { name: 'Travelers (Man & Woman)', gender: 'Mixed', accent: 'British' }
      ],
      transcript: `[00:00] Track 30.
[00:02] Conversation 1:
[00:05] Man: The next bus should be here soon.
[00:07] Woman: No, it won't. I just checked. It's due in 20 minutes.
[00:11] Man: 20? I don't believe it! It should be every 10 minutes. This service is getting worse and worse.
[00:20] Woman: You're right. It was never this bad. The bus company just doesn't care about passengers anymore, as long as they get the money.

[00:32] Conversation 2:
[00:35] Woman: Excuse me, could you tell me why the 4:50 train to London hasn't arrived yet?
[00:40] Station Attendant: I'm afraid there's been an accident on the line at the station before this one.
[00:44] Woman: Ah, sorry to hear that. Do you have any idea when it might arrive?
[00:49] Station Attendant: Well, at the moment the line's closed, but I've just heard that the company is arranging buses to take passengers to London. There should be one here soon.
[00:57] Woman: Thanks for letting me know.

[01:03] Conversation 3:
[01:05] Man: What do you think? Should we take the car? It's the quickest way to get to Bristol. It's straight down the motorway. We should be there in two hours.
[01:13] Woman: Haven't you heard? There's fog on the motorway, and there are massive jams all the way down. There's really no point in driving.
[01:22] Man: Oh, really? Well, shall we take the train? I know it's expensive, but maybe we can get a cheaper fare. I'll have a look at the train website.
[01:30] Woman: Good idea. At least we can get there fairly quickly and safely.`,
      questionGroups: [
        {
          id: 'qg-t30-p1',
          type: 'form_completion',
          title: 'Questions 1–5: Daily Transport Log & Schedule Notes',
          titleEn: 'Questions 1–5: Daily Transport Log & Schedule Notes',
          titleVi: 'Câu hỏi 1–5: Nhật ký giao thông & Ghi chú lịch trình',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionEn: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          instructionVi: 'Hoàn thành các ghi chú dưới đây.\nViết KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT SỐ cho mỗi câu trả lời.',
          headerTitle: 'DAILY TRANSIT INCIDENT & COMMUTE NOTES',
          headerTitleEn: 'DAILY TRANSIT INCIDENT & COMMUTE NOTES',
          headerTitleVi: 'GHI CHÚ SỰ CỐ GIAO THÔNG & LỘ TRÌNH ĐI LẠI',
          questions: [
            {
              id: 1,
              order: 1,
              type: 'form_completion',
              prefix: 'Bus route standard frequency: Under normal operating conditions, buses should arrive every',
              prefixEn: 'Bus route standard frequency: Under normal operating conditions, buses should arrive every',
              prefixVi: 'Tần suất chuẩn của tuyến buýt: Trong điều kiện vận hành bình thường, xe buýt phải đến sau mỗi',
              suffix: 'rather than twenty.',
              suffixEn: 'rather than twenty.',
              suffixVi: 'thay vì phải đợi hai mươi phút.',
              answer: '10 minutes',
              acceptableAnswers: ['10 minutes', 'ten minutes', '10 mins'],
              wordLimit: 2,
              questionText: 'Bus route standard frequency: Under normal operating conditions, buses should arrive every [10 minutes] rather than twenty.',
              questionTextEn: 'Bus route standard frequency: Under normal operating conditions, buses should arrive every ......... rather than twenty.',
              questionTextVi: 'Tần suất chuẩn của tuyến buýt: Trong điều kiện vận hành bình thường, xe buýt phải đến sau mỗi ......... thay vì phải đợi hai mươi phút.',
              explanation: 'Người đàn ông bực bội cho biết tần suất quy định thông thường là cứ mỗi 10 phút một chuyến: "It should be every 10 minutes".',
              explanationEn: 'Direct extraction: The man states the regular bus schedule "should be every 10 minutes".',
              audioTimestamp: 16
            },
            {
              id: 2,
              order: 2,
              type: 'form_completion',
              prefix: 'London rail disruption: The 4:50 service was delayed because of an',
              prefixEn: 'London rail disruption: The 4:50 service was delayed because of an',
              prefixVi: 'Gián đoạn đường sắt London: Chuyến tàu 4:50 bị trễ do một vụ',
              suffix: 'at the preceding station.',
              suffixEn: 'at the preceding station.',
              suffixVi: 'tại nhà ga phía trước.',
              answer: 'accident',
              acceptableAnswers: ['accident'],
              wordLimit: 2,
              questionText: 'London rail disruption: The 4:50 service was delayed because of an [accident] at the preceding station.',
              questionTextEn: 'London rail disruption: The 4:50 service was delayed because of an ......... at the preceding station.',
              questionTextVi: 'Gián đoạn đường sắt London: Chuyến tàu 4:50 bị trễ do một vụ ......... tại nhà ga phía trước.',
              explanation: 'Nhân viên ga giải thích lý do tàu chưa đến là vì có tai nạn trên đường ray: "there\'s been an accident on the line at the station before this one".',
              explanationEn: 'Causal retrieval: The attendant confirms "there\'s been an accident on the line".',
              audioTimestamp: 42
            },
            {
              id: 3,
              order: 3,
              type: 'form_completion',
              prefix: 'Bristol highway hazard: Drivers encountered severe congestion caused by thick',
              prefixEn: 'Bristol highway hazard: Drivers encountered severe congestion caused by thick',
              prefixVi: 'Nguy cơ trên đường cao tốc Bristol: Các tài xế gặp phải tắc đường nghiêm trọng do',
              suffix: 'along the motorway.',
              suffixEn: 'along the motorway.',
              suffixVi: 'dày đặc bao phủ suốt tuyến cao tốc.',
              answer: 'fog',
              acceptableAnswers: ['fog'],
              wordLimit: 2,
              questionText: 'Bristol highway hazard: Drivers encountered severe congestion caused by thick [fog] along the motorway.',
              questionTextEn: 'Bristol highway hazard: Drivers encountered severe congestion caused by thick ......... along the motorway.',
              questionTextVi: 'Nguy cơ trên đường cao tốc Bristol: Các tài xế gặp phải tắc đường nghiêm trọng do ......... dày đặc bao phủ suốt tuyến cao tốc.',
              explanation: 'Người phụ nữ thông báo trên cao tốc có sương mù và kẹt xe nghiêm trọng: "There\'s fog on the motorway, and there are massive jams all the way down".',
              explanationEn: 'Weather condition retrieval: The woman warns "There\'s fog on the motorway".',
              audioTimestamp: 74
            },
            {
              id: 4,
              order: 4,
              type: 'form_completion',
              prefix: 'Workplace health advice: The commuter was instructed by his',
              prefixEn: 'Workplace health advice: The commuter was instructed by his',
              prefixVi: 'Khuyên bảo sức khỏe khi đi làm: Người đi làm được',
              suffix: 'to increase physical exercise and lose weight.',
              suffixEn: 'to increase physical exercise and lose weight.',
              suffixVi: 'yêu cầu phải tăng cường vận động thể chất và giảm cân.',
              answer: 'doctor',
              acceptableAnswers: ['doctor', 'the doctor'],
              wordLimit: 2,
              questionText: 'Workplace health advice: The commuter was instructed by his [doctor] to increase physical exercise and lose weight.',
              questionTextEn: 'Workplace health advice: The commuter was instructed by his ......... to increase physical exercise and lose weight.',
              questionTextVi: 'Khuyên bảo sức khỏe khi đi làm: Người đi làm được ......... yêu cầu phải tăng cường vận động thể chất và giảm cân.',
              explanation: 'Người vợ nhắc lại chỉ định của bác sĩ: "Remember what the doctor said? You need to get more exercise and lose weight".',
              explanationEn: 'Medical advisor: The wife reminds him "Remember what the doctor said?".',
              audioTimestamp: 104
            },
            {
              id: 5,
              order: 5,
              type: 'form_completion',
              prefix: 'Motorcycle experience: The retired woman had not ridden a motorbike for at least',
              prefixEn: 'Motorcycle experience: The retired woman had not ridden a motorbike for at least',
              prefixVi: 'Kinh nghiệm đi xe máy: Người phụ nữ nghỉ hưu đã không lái xe máy trong ít nhất',
              suffix: 'years.',
              suffixEn: 'years.',
              suffixVi: 'năm.',
              answer: '30',
              acceptableAnswers: ['30', 'thirty', '30 years', 'thirty years'],
              wordLimit: 2,
              questionText: 'Motorcycle experience: The retired woman had not ridden a motorbike for at least [30] years.',
              questionTextEn: 'Motorcycle experience: The retired woman had not ridden a motorbike for at least ......... years.',
              questionTextVi: 'Kinh nghiệm đi xe máy: Người phụ nữ nghỉ hưu đã không lái xe máy trong ít nhất ......... năm.',
              explanation: 'Người đàn ông chỉ ra rằng bà đã không lái xe máy ít nhất 30 năm rồi: "It must be at least 30 years ago".',
              explanationEn: 'Temporal duration retrieval: The man points out "It must be at least 30 years ago".',
              audioTimestamp: 160
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Commuting Choices, Safety Debates & Travel Logistics',
      titleEn: 'Part 2: Commuting Choices, Safety Debates & Travel Logistics',
      titleVi: 'Phần 2: Quyết định phương tiện, Tranh luận an toàn & Hậu cần đi lại',
      context: 'Listen to Conversations 4 and 5 exploring health trade-offs in commuting to work and risk evaluation regarding purchasing a motorcycle after retirement.',
      contextEn: 'Listen to Conversations 4 and 5 exploring health trade-offs in commuting to work and risk evaluation regarding purchasing a motorcycle after retirement.',
      contextVi: 'Lắng nghe các Hội thoại 4 và 5 phân tích các cân nhắc sức khỏe khi đi làm và đánh giá rủi ro an toàn khi mua xe máy sau khi về hưu.',
      audioTimestampStart: 96,
      audioTimestampEnd: 179,
      speakers: [
        { name: 'Husband & Wife', gender: 'Mixed', accent: 'British' },
        { name: 'Retired Woman & Friend', gender: 'Mixed', accent: 'British' }
      ],
      transcript: `[01:36] Conversation 4:
[01:38] Husband: Okay darling, I'm off to work.
[01:41] Wife: You're not using the car, are you? Remember what the doctor said? You need to get more exercise and lose weight, especially now that your leg is better.
[01:50] Husband: I know, but my leg hurts a bit today. I'd prefer to use the car.
[01:55] Wife: Yes, but it won't get better if you sit in the car all day. I really think you should do some more exercise. And it's a lovely day for cycling! You can use the car when it rains.
[02:07] Husband: Okay, okay, I'll cycle today, but I'll need to use the car tomorrow, as I've got a lot of things to take to work.

[02:16] Conversation 5:
[02:18] Woman: I'm thinking of buying a motorbike now that I've retired. I'll have a lot of time to ride around like I used to.
[02:25] Man: A bike? Are you sure? I really don't think that's a good idea. They're really dangerous.
[02:31] Woman: Only if you don't know what you're doing. I used to ride one when I was younger.
[02:37] Man: How long ago was that? It must be at least 30 years ago. Have you been on one since?
[02:44] Woman: No, but I'm sure I can remember how to ride one.
[02:48] Man: Well, if you ask me, I think you're making a big mistake. I wouldn't get back on a bike after so much time. But it's your decision.`,
      questionGroups: [
        {
          id: 'qg-t30-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Multiple Choice Travel Analysis',
          titleEn: 'Questions 6–10: Multiple Choice Travel Analysis',
          titleVi: 'Câu hỏi 6–10: Phân tích trắc nghiệm các tình huống giao thông',
          instruction: 'Choose the correct letter, A, B, or C.',
          instructionEn: 'Choose the correct letter, A, B, or C.',
          instructionVi: 'Chọn chữ cái chính xác, A, B, hoặc C.',
          questions: [
            {
              id: 6,
              order: 6,
              type: 'multiple_choice',
              questionText: 'In Conversation 1, what underlying complaint do both passengers express about the bus company?',
              questionTextEn: 'In Conversation 1, what underlying complaint do both passengers express about the bus company?',
              questionTextVi: 'Trong Hội thoại 1, phàn nàn sâu xa nào được cả hai hành khách đưa ra về công ty xe buýt?',
              options: [
                { letter: 'A', text: 'Service reliability is deteriorating because the company prioritizes profit over passenger welfare', textEn: 'Service reliability is deteriorating because the company prioritizes profit over passenger welfare', textVi: 'Độ tin cậy của dịch vụ ngày càng sa sút vì công ty coi trọng lợi nhuận hơn quyền lợi hành khách' },
                { letter: 'B', text: 'Ticket inspectors are issuing unjustified fines during morning peak hours', textEn: 'Ticket inspectors are issuing unjustified fines during morning peak hours', textVi: 'Nhân viên soát vé đang phạt tiền vô lý trong giờ cao điểm buổi sáng' },
                { letter: 'C', text: 'The bus stop has been permanently moved to a hazardous highway junction', textEn: 'The bus stop has been permanently moved to a hazardous highway junction', textVi: 'Điểm dừng xe buýt đã bị dời vĩnh viễn đến ngã ba đường cao tốc nguy hiểm' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Hành khách bức xúc vì chất lượng ngày càng tệ ("service is getting worse and worse") và công ty xe buýt chỉ quan tâm đến việc thu tiền chứ không quan tâm đến hành khách ("doesn\'t care about passengers anymore, as long as they get the money").',
              explanationEn: 'The woman states the operator "doesn\'t care about passengers anymore, as long as they get the money", confirming profit over service priority.',
              audioTimestamp: 20
            },
            {
              id: 7,
              order: 7,
              type: 'multiple_choice',
              questionText: 'In Conversation 2, how is the rail operator accommodating passengers stranded by the track closure?',
              questionTextEn: 'In Conversation 2, how is the rail operator accommodating passengers stranded by the track closure?',
              questionTextVi: 'Trong Hội thoại 2, đơn vị vận hành đường sắt đang sắp xếp phương án nào cho hành khách bị kẹt lại?',
              options: [
                { letter: 'A', text: 'Arranging replacement buses to transport passengers into London', textEn: 'Arranging replacement buses to transport passengers into London', textVi: 'Bố trí các chuyến xe buýt thay thế để vận chuyển hành khách đến London' },
                { letter: 'B', text: 'Distributing automatic full ticket refunds at digital ticket kiosks', textEn: 'Distributing automatic full ticket refunds at digital ticket kiosks', textVi: 'Phát tiền hoàn vé tự động 100% tại các quầy vé điện tử' },
                { letter: 'C', text: 'Directing all travelers onto an underground subway express link', textEn: 'Directing all travelers onto an underground subway express link', textVi: 'Hướng dẫn toàn bộ hành khách chuyển sang tuyến tàu điện ngầm cao tốc' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Nhân viên thông báo công ty đang điều động xe buýt để đưa hành khách đến London: "the company is arranging buses to take passengers to London".',
              explanationEn: 'The attendant explains: "the company is arranging buses to take passengers to London".',
              audioTimestamp: 52
            },
            {
              id: 8,
              order: 8,
              type: 'multiple_choice',
              questionText: 'In Conversation 3, why do the travelers decide against driving to Bristol as originally planned?',
              questionTextEn: 'In Conversation 3, why do the travelers decide against driving to Bristol as originally planned?',
              questionTextVi: 'Trong Hội thoại 3, tại sao những người đi lại lại hủy kế hoạch tự lái ô tô đến Bristol?',
              options: [
                { letter: 'A', text: 'Dense motorway fog has triggered massive, impassable traffic jams', textEn: 'Dense motorway fog has triggered massive, impassable traffic jams', textVi: 'Sương mù dày đặc trên đường cao tốc đã gây ra các vụ tắc đường quy mô lớn' },
                { letter: 'B', text: 'Motorway tolls have surged beyond their travel budget', textEn: 'Motorway tolls have surged beyond their travel budget', textVi: 'Phí cầu đường cao tốc đã tăng vọt vượt quá ngân sách di chuyển của họ' },
                { letter: 'C', text: 'The car has completely exhausted its petrol reserves', textEn: 'The car has completely exhausted its petrol reserves', textVi: 'Chiếc ô tô đã cạn kiệt hoàn toàn nhiên liệu xăng' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người phụ nữ giải thích trên cao tốc có sương mù và kẹt xe kéo dài ("fog on the motorway, and there are massive jams all the way down. There\'s really no point in driving").',
              explanationEn: 'The woman highlights weather and gridlock: "There\'s fog on the motorway, and there are massive jams all the way down".',
              audioTimestamp: 75
            },
            {
              id: 9,
              order: 9,
              type: 'multiple_choice',
              questionText: 'In Conversation 4, why does the husband insist he must use the car tomorrow instead of his bicycle?',
              questionTextEn: 'In Conversation 4, why does the husband insist he must use the car tomorrow instead of his bicycle?',
              questionTextVi: 'Trong Hội thoại 4, tại sao người chồng lại khẳng định ngày mai anh bắt buộc phải đi ô tô thay vì xe đạp?',
              options: [
                { letter: 'A', text: 'He has an extensive volume of items to transport to his workplace', textEn: 'He has an extensive volume of items to transport to his workplace', textVi: 'Anh có rất nhiều đồ đạc cần phải mang đến nơi làm việc' },
                { letter: 'B', text: 'Meteorological forecasts indicate persistent heavy rainfall', textEn: 'Meteorological forecasts indicate persistent heavy rainfall', textVi: 'Dự báo khí tượng cho biết sẽ có mưa lớn kéo dài' },
                { letter: 'C', text: 'His bicycle brakes require an urgent overhaul at a repair shop', textEn: 'His bicycle brakes require an urgent overhaul at a repair shop', textVi: 'Hệ thống phanh xe đạp của anh cần đại tu khẩn cấp tại tiệm sửa chữa' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người chồng đồng ý đạp xe hôm nay nhưng nói ngày mai phải đi ô tô vì có nhiều đồ phải mang đến chỗ làm: "I\'ll need to use the car tomorrow, as I\'ve got a lot of things to take to work".',
              explanationEn: 'The husband states: "I\'ll need to use the car tomorrow, as I\'ve got a lot of things to take to work".',
              audioTimestamp: 130
            },
            {
              id: 10,
              order: 10,
              type: 'multiple_choice',
              questionText: 'In Conversation 5, why does the friend strongly advise the woman against purchasing a motorbike?',
              questionTextEn: 'In Conversation 5, why does the friend strongly advise the woman against purchasing a motorbike?',
              questionTextVi: 'Trong Hội thoại 5, tại sao người bạn lại kiên quyết khuyên người phụ nữ không nên mua xe máy?',
              options: [
                { letter: 'A', text: 'He considers motorbikes inherently dangerous and notes she has not ridden for thirty years', textEn: 'He considers motorbikes inherently dangerous and notes she has not ridden for thirty years', textVi: 'Anh cho rằng xe máy vốn rất nguy hiểm và nhấn mạnh bà đã không lái xe suốt 30 năm qua' },
                { letter: 'B', text: 'Motorcycle registration and insurance premiums are unaffordable for retirees', textEn: 'Motorcycle registration and insurance premiums are unaffordable for retirees', textVi: 'Chi phí đăng ký và bảo hiểm xe máy quá đắt đỏ đối với người đã về hưu' },
                { letter: 'C', text: 'Local traffic regulations restrict older citizens from highway riding', textEn: 'Local traffic regulations restrict older citizens from highway riding', textVi: 'Luật giao thông địa phương cấm người cao tuổi lái xe trên đường quốc lộ' }
              ],
              answer: 'A',
              correctAnswer: 'A',
              explanation: 'Người bạn cảnh báo xe máy rất nguy hiểm ("really dangerous") và bà đã không lái suốt ít nhất 30 năm ("at least 30 years ago"), nên việc mua xe là một sai lầm lớn ("making a big mistake").',
              explanationEn: 'The friend warns that motorbikes are "really dangerous" and cautions that attempting to ride after a thirty-year gap is "a big mistake".',
              audioTimestamp: 168
            }
          ]
        }
      ]
    }
  ]
};
