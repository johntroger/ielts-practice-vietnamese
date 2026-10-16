/**
 * IELTS Listening Practice: Inter-College Sports Competition Relocation & Road Navigation (Track 12)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track12-sports-centre-relocation-and-map.mp3
 * 
 * Standard Cambridge IELTS Section 2 Simulation:
 * - Part 1: Event Relocation Notice & Meeting Details (Questions 1–6)
 * - Part 2: Road Map Signpost Directives & Landmark Navigation (Questions 7–12)
 */

export const track12SportsCentreMap = {
  id: 'ielts-listening-track12-sports-map',
  title: 'IELTS Listening Practice: Sports Centre Relocation & Road Navigation (Track 12)',
  description: 'Bộ luyện thi IELTS Listening Section 2 thực chiến: Thông báo khẩn đổi địa điểm thi đấu do ngập nước (flooding, damaged floors & equipment), giờ tập trung chuẩn bị (Tuesday at 9:00), và hướng dẫn lộ trình bản đồ tránh tắc đường trung tâm (roundabout, flyover over motorway, Bramley Road, petrol station, Woodland Hotel).',
  totalQuestions: 12,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track12-sports-centre-relocation-and-map.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track12-sports-centre-relocation-and-map.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Sports Competition Venue Change & Schedule Details',
      context: 'Geoff leaves a voicemail explaining why the inter-college sports tournament must be relocated and provides meeting instructions for helpers.',
      audioTimestampStart: 0,
      audioTimestampEnd: 52,
      speakers: [
        { name: 'Geoff (Sports Coordinator)', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 12.
[00:02] Hi, this is Geoff here. I'm calling you all about the inter-college sports competition at the South Henton Sports Centre next week.
[00:10] I'm really sorry, but there's been a change of plan. We can't have the competition at the centre because of the flooding last week after all the rain. It damaged a lot of our equipment, and also the floors in some of the rooms.
[00:23] Luckily, I contacted the North Henton Sports Centre, and they've kindly agreed to let us use their centre and their equipment for the competition. So I'm phoning to give you directions on how to get there, and instructions about what to do there to prepare.
[00:37] You'll need to meet the others there next Tuesday at about 9:00 to get the centre ready.
[00:43] Okay, as I'm not sure if you know how to get to North Henton, I'll give you directions avoiding the town centre, because it can be quite busy in the morning.`,
      questionGroups: [
        {
          id: 'qg-t12-p1',
          type: 'form_completion',
          title: 'Questions 1–6: Competition Relocation Notice',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'INTER-COLLEGE TOURNAMENT BRIEFING',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'The event cannot be held at South Henton because of ................ following heavy rainfall.',
              prefixText: 'The event cannot be held at South Henton because of',
              suffixText: 'following heavy rainfall.',
              answer: 'flooding',
              acceptableAnswers: ['flooding', 'the flooding', 'flood'],
              evidenceQuote: "We can't have the competition at the centre because of the flooding last week after all the rain.",
              evidenceTimestamp: 16,
              explanation: 'Nguyên nhân không tổ chức được ở South Henton là do ngập nước (flooding) sau đợt mưa lớn.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Water infiltration caused severe damage to tournament gear and room ................',
              prefixText: 'Water infiltration caused severe damage to tournament gear and room',
              suffixText: '.',
              answer: 'floors',
              acceptableAnswers: ['floors', 'floor'],
              evidenceQuote: 'It damaged a lot of our equipment, and also the floors in some of the rooms.',
              evidenceTimestamp: 21,
              explanation: 'Nước ngập làm hư hỏng nhiều thiết bị và sàn nhà ở một số phòng (the floors in some of the rooms).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The replacement venue is situated at ................ Sports Centre.',
              prefixText: 'The replacement venue is situated at',
              suffixText: 'Sports Centre.',
              answer: 'North Henton',
              acceptableAnswers: ['North Henton', 'north henton'],
              evidenceQuote: 'Luckily, I contacted the North Henton Sports Centre...',
              evidenceTimestamp: 25,
              explanation: 'Địa điểm thay thế là Trung tâm Thể thao North Henton.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Preparation helpers are expected to assemble next ................ at 9:00 am.',
              prefixText: 'Preparation helpers are expected to assemble next',
              suffixText: 'at 9:00 am.',
              answer: 'Tuesday',
              acceptableAnswers: ['Tuesday', 'tuesday'],
              evidenceQuote: "You'll need to meet the others there next Tuesday at about 9:00 to get the centre ready.",
              evidenceTimestamp: 39,
              explanation: 'Nhóm chuẩn bị cần có mặt vào thứ Ba tuần tới (next Tuesday) lúc 9:00.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'The proposed navigation route intentionally bypasses the ................ to evade morning traffic.',
              prefixText: 'The proposed navigation route intentionally bypasses the',
              suffixText: 'to evade morning traffic.',
              answer: 'town centre',
              acceptableAnswers: ['town centre', 'town center', 'center of town', 'centre of town'],
              evidenceQuote: "I'll give you directions avoiding the town centre, because it can be quite busy in the morning.",
              evidenceTimestamp: 48,
              explanation: 'Lộ trình được hướng dẫn tránh đi qua trung tâm thị trấn (town centre) để không bị kẹt xe vào buổi sáng.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Drivers commence their journey by turning out onto ................ Road.',
              prefixText: 'Drivers commence their journey by turning out onto',
              suffixText: 'Road.',
              answer: 'Lily',
              acceptableAnswers: ['Lily', 'lily'],
              evidenceQuote: 'First, come out of our sports centre into Lily Road.',
              evidenceTimestamp: 54,
              explanation: 'Điểm xuất phát bắt đầu khi rẽ ra đường Lily (Lily Road).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Bypass Driving Route & Landmark Signposts',
      context: 'Geoff gives precise step-by-step turn directions passing roundabouts, a motorway flyover, and local landmarks towards North Henton Sports Centre.',
      audioTimestampStart: 53,
      audioTimestampEnd: 129,
      speakers: [
        { name: 'Geoff (Sports Coordinator)', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:52] First, come out of our sports centre into Lily Road. Turn left, and go about 200 metres, and you come to a roundabout.
[01:01] You'll see a sign to Henton saying 'Turn left', but that takes you into the centre of town, so don't take that one.
[01:08] Go straight over that roundabout and you come to a crossroads. The left turn here also takes you into the centre, so don't take that one either.
[01:17] Carry on for about a kilometre. The road goes up onto a flyover over the motorway to Longchester.
[01:24] After the flyover, you come to the junction with Bramley Road. This is where you go left, because that takes you round the town to the sports centre.
[01:34] Carry on for about 500 metres. Then you go left round a bend, and just after the bend, you see a petrol station on the left.
[01:43] The turning for Henton is just after that at the traffic lights, so make sure you look out for it. Turn right into West Road and carry on.
[01:52] The sports centre is on Green Lane, which is just past the Woodland Hotel on the right. You can't miss it. There's a car park there, so you shouldn't have a problem parking.
[02:03] Please don't be late as we have a lot to do.`,
      questionGroups: [
        {
          id: 'qg-t12-p2',
          type: 'sentence_completion',
          title: 'Questions 7–12: Route Landmark & Direction Mapping',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'ROUTE MAP GUIDELINES TO NORTH HENTON',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'At the initial roundabout 200m away, vehicles should proceed ................',
              prefixText: 'At the initial roundabout 200m away, vehicles should proceed',
              suffixText: '.',
              answer: 'straight over',
              acceptableAnswers: ['straight over', 'straight across', 'straight'],
              evidenceQuote: 'Go straight over that roundabout and you come to a crossroads.',
              evidenceTimestamp: 69,
              explanation: 'Tại bùng binh đầu tiên, tài xế phải đi thẳng qua (Go straight over that roundabout).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'The road crosses the motorway heading to Longchester via an elevated ................',
              prefixText: 'The road crosses the motorway heading to Longchester via an elevated',
              suffixText: '.',
              answer: 'flyover',
              acceptableAnswers: ['flyover', 'a flyover'],
              evidenceQuote: 'The road goes up onto a flyover over the motorway to Longchester.',
              evidenceTimestamp: 80,
              explanation: 'Đường đi vượt qua đường cao tốc nhờ một cầu vượt (flyover).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'At the junction with Bramley Road, turn ................ to circle around the town perimeter.',
              prefixText: 'At the junction with Bramley Road, turn',
              suffixText: 'to circle around the town perimeter.',
              answer: 'left',
              acceptableAnswers: ['left'],
              evidenceQuote: 'After the flyover, you come to the junction with Bramley Road. This is where you go left...',
              evidenceTimestamp: 88,
              explanation: 'Tại ngã giao với đường Bramley, rẽ trái (go left) để đi vòng quanh thị trấn.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'After curving left round a bend, drivers will notice a ................ situated on the left.',
              prefixText: 'After curving left round a bend, drivers will notice a',
              suffixText: 'situated on the left.',
              answer: 'petrol station',
              acceptableAnswers: ['petrol station', 'gas station'],
              evidenceQuote: 'and just after the bend, you see a petrol station on the left.',
              evidenceTimestamp: 100,
              explanation: 'Ngay sau khúc cua bên trái sẽ nhìn thấy một trạm xăng (petrol station) ở bên trái.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'At the traffic lights, turn ................ into West Road.',
              prefixText: 'At the traffic lights, turn',
              suffixText: 'into West Road.',
              answer: 'right',
              acceptableAnswers: ['right'],
              evidenceQuote: 'Turn right into West Road and carry on.',
              evidenceTimestamp: 109,
              explanation: 'Tại cụm đèn giao thông, rẽ phải (Turn right) vào đường West Road.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'North Henton Sports Centre is located on Green Lane, directly beyond the ................ on the right.',
              prefixText: 'North Henton Sports Centre is located on Green Lane, directly beyond the',
              suffixText: 'on the right.',
              answer: 'Woodland Hotel',
              acceptableAnswers: ['Woodland Hotel', 'woodland hotel'],
              evidenceQuote: 'The sports centre is on Green Lane, which is just past the Woodland Hotel on the right.',
              evidenceTimestamp: 116,
              explanation: 'Trung tâm thể thao nằm trên đường Green Lane, ngay sau khách sạn Woodland (Woodland Hotel) ở bên phải.'
            }
          ]
        }
      ]
    }
  ]
};
