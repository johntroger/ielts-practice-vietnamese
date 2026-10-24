/**
 * IELTS Listening Practice: Sports Competition Staff Duty Allocations (Track 16)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track16-sports-event-organizers-duty.mp3
 * 
 * Standard Cambridge IELTS Section 2 Simulation:
 * - Part 1: Morning Staff Allocation & Note Completion (Questions 1–6)
 * - Part 2: Afternoon Schedule Traps & Volunteer Matching (Questions 7–12)
 */

export const track16EventDuties = {
  id: 'ielts-listening-track16-event-duties',
  title: 'IELTS Listening Practice: Competition Staff Duty Allocations (Track 16)',
  titleEn: 'IELTS Listening Practice: Competition Staff Duty Allocations (Track 16)',
  titleVi: 'Luyện đề IELTS Listening: Phân công nhiệm vụ Ban tổ chức (Track 16)',
  description: 'Bộ luyện thi IELTS Listening Section 2 thực chiến: Phân công nhiệm vụ điều phối thi đấu giữa Geoff, Amanda, Steve và Malik; các bẫy tự đính chính (self-correction) môn cử tạ, bóng rổ, cầu lông, thể dục dụng cụ và phương án dự phòng buổi chiều.',
  descriptionEn: 'Authentic Cambridge IELTS Section 2 practice: Tournament staff duty assignments between Geoff, Amanda, Steve, and Malik, featuring morning responsibilities and afternoon self-correction traps across badminton, gymnastics, weightlifting, basketball, and table tennis.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 2 thực chiến: Phân công nhiệm vụ điều phối thi đấu giữa Geoff, Amanda, Steve và Malik; các bẫy tự đính chính (self-correction) môn cử tạ, bóng rổ, cầu lông, thể dục dụng cụ và phương án dự phòng buổi chiều.',
  totalQuestions: 12,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track16-sports-event-organizers-duty.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track16-sports-event-organizers-duty.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Morning Staff Roles & Qualification Matching',
      context: 'Geoff leaves a voice message assigning morning event supervision duties to Amanda, Steve, and Malik based on their background and qualifications.',
      audioTimestampStart: 0,
      audioTimestampEnd: 86,
      speakers: [
        { name: 'Geoff (Sports Coordinator)', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 16.
[00:02] Hi guys, it's me again, Geoff. Can you let me know when you've received this message?
[00:08] I've just realized that I probably won't be able to be there at the start of the competition, because I have an appointment that I can't cancel.
[00:15] So I'm going to tell you what event I want each of you to organize during the day, just so that you know.
[00:21] I've tried to work it out so that each of you can be in charge of the event you prefer, as far as possible.
[00:27] So, first of all, the morning.
[00:30] Now, Steve and Amanda, I know that you both like badminton, and Amanda, you used to do gymnastics, so I know you'd be happy with either.
[00:39] But I have to make sure of the best arrangement on the day.
[00:42] Amanda, if I remember rightly, you also once did some training in the rules of badminton, so it might be best if you take that on, rather than the gymnastics.
[00:52] It will be useful to have you there to help with judging line calls and so on.
[00:56] That means either you, Steve, or you, Malik, with the gymnastics.
[01:01] Either of you is capable of doing that, but that leaves the weightlifting.
[01:06] Both of you do a lot of the general training in our sports centre, but this is a bit more specialist in terms of getting the weights right for each competitor.
[01:14] Okay, for the moment, I'll put Steve in charge of the gymnastics, and Malik can take care of the weightlifting in the morning, as I think you have just that bit more experience of dealing with weights, Malik.`,
      questionGroups: [
        {
          id: 'qg-t16-p1',
          type: 'form_completion',
          title: 'Questions 1–6: Morning Event Allocation Notes',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'MORNING TOURNAMENT DUTY ALLOCATIONS',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Geoff cannot attend the start of the competition because of an unavoidable ................',
              prefixText: 'Geoff cannot attend the start of the competition because of an unavoidable',
              suffixText: '.',
              answer: 'appointment',
              acceptableAnswers: ['appointment', 'an appointment'],
              evidenceQuote: "I've just realized that I probably won't be able to be there at the start of the competition, because I have an appointment that I can't cancel.",
              evidenceTimestamp: 13,
              explanation: 'Geoff vắng mặt đầu buổi thi đấu vì vướng một cuộc hẹn không thể hủy (an appointment that I can\'t cancel).',
              explanationEn: 'Geoff cannot be present at the start of the competition due to an uncancelable appointment.',
              explanationVi: 'Geoff vắng mặt đầu buổi thi đấu vì vướng một cuộc hẹn không thể hủy (an appointment that I can\'t cancel).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Geoff has tried to ensure each helper is in charge of the event they ................',
              prefixText: 'Geoff has tried to ensure each helper is in charge of the event they',
              suffixText: '.',
              answer: 'prefer',
              acceptableAnswers: ['prefer', 'preference', 'preferences'],
              evidenceQuote: "I've tried to work it out so that each of you can be in charge of the event you prefer, as far as possible.",
              evidenceTimestamp: 25,
              explanation: 'Các nhiệm vụ được sắp xếp theo môn mà từng người yêu thích (the event you prefer).',
              explanationEn: 'Assignments are arranged matching the event each volunteer prefers as far as possible.',
              explanationVi: 'Các nhiệm vụ được sắp xếp theo môn mà từng người yêu thích (the event you prefer).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Amanda is designated to supervise badminton because of previous training in tournament ................',
              prefixText: 'Amanda is designated to supervise badminton because of previous training in tournament',
              suffixText: '.',
              answer: 'rules',
              acceptableAnswers: ['rules', 'the rules'],
              evidenceQuote: 'Amanda, if I remember rightly, you also once did some training in the rules of badminton, so it might be best if you take that on, rather than the gymnastics.',
              evidenceTimestamp: 46,
              explanation: 'Amanda được chọn cho môn cầu lông vì từng được tập huấn về luật thi đấu (rules of badminton).',
              explanationEn: 'Amanda is assigned to badminton because she previously underwent training in the rules of the sport.',
              explanationVi: 'Amanda được chọn cho môn cầu lông vì từng được tập huấn về luật thi đấu (rules of badminton).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Amanda will particularly assist referees by judging ................ during matches.',
              prefixText: 'Amanda will particularly assist referees by judging',
              suffixText: 'during matches.',
              answer: 'line calls',
              acceptableAnswers: ['line calls', 'line-calls'],
              evidenceQuote: 'It will be useful to have you there to help with judging line calls and so on.',
              evidenceTimestamp: 54,
              explanation: 'Amanda sẽ hỗ trợ việc phán đoán các pha cầu chạm vạch/ngoài sân (judging line calls).',
              explanationEn: 'Amanda\'s role includes aiding with court boundary judging (line calls).',
              explanationVi: 'Amanda sẽ hỗ trợ việc phán đoán các pha cầu chạm vạch/ngoài sân (judging line calls).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'During the morning session, Steve is placed in charge of ................',
              prefixText: 'During the morning session, Steve is placed in charge of',
              suffixText: '.',
              answer: 'gymnastics',
              acceptableAnswers: ['gymnastics', 'the gymnastics'],
              evidenceQuote: "Okay, for the moment, I'll put Steve in charge of the gymnastics...",
              evidenceTimestamp: 76,
              explanation: 'Vào buổi sáng, Steve được giao phụ trách môn thể dục dụng cụ (gymnastics).',
              explanationEn: 'For the morning period, Steve is given charge of gymnastics.',
              explanationVi: 'Vào buổi sáng, Steve được giao phụ trách môn thể dục dụng cụ (gymnastics).'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Malik manages weightlifting because he has greater ................ handling weights.',
              prefixText: 'Malik manages weightlifting because he has greater',
              suffixText: 'handling weights.',
              answer: 'experience',
              acceptableAnswers: ['experience', 'more experience'],
              evidenceQuote: 'Malik can take care of the weightlifting in the morning, as I think you have just that bit more experience of dealing with weights, Malik.',
              evidenceTimestamp: 83,
              explanation: 'Malik được giao môn cử tạ vì có nhiều kinh nghiệm hơn về tạ (more experience of dealing with weights).',
              explanationEn: 'Malik oversees weightlifting owing to his superior experience with weights.',
              explanationVi: 'Malik được giao môn cử tạ vì có nhiều kinh nghiệm hơn về tạ (more experience of dealing with weights).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Afternoon Schedule Shifts & Role Reallocation',
      context: 'Geoff explains afternoon role adjustments, including self-corrections regarding basketball, weightlifting, table tennis, and reserve duties.',
      audioTimestampStart: 86,
      audioTimestampEnd: 153,
      speakers: [
        { name: 'Geoff (Sports Coordinator)', gender: 'Male', accent: 'British' }
      ],
      transcript: `[01:26] For the afternoon, I know Amanda and Malik would both love to do the basketball, as you both play it.
[01:32] But Malik, you're already doing the weightlifting, so perhaps Amanda, you can do the basketball.
[01:38] Actually, no. I've just thought: I'm pretty certain I'll be in for the afternoon, so Malik, you won't need to do the weightlifting then.
[01:47] How about you do the basketball, Malik? Then I can take over the weightlifting in the afternoon, as I'm particularly keen on that, as you all know, and I'd like a chance to get involved with it.
[01:58] So then, Amanda, you can do the table tennis.
[02:02] But that leaves Steve without anything.
[02:04] No, that's okay, actually, if we leave it at that. Steve, you can be available to help wherever you're needed in the afternoon.
[02:12] And if something happens and I can't make it in the early afternoon, you can take care of the weightlifting till I arrive, though I don't think there'll be any problems.
[02:22] Okay, if you need to check on anything, call me on my mobile. Otherwise, see you next week. I think we're going to have a great day.`,
      questionGroups: [
        {
          id: 'qg-t16-p2-matching',
          type: 'matching',
          title: 'Questions 7–10: Afternoon Event Assignments',
          instruction: 'Which person is assigned to organize each event or duty in the AFTERNOON?\nChoose the correct letter, A, B, C or D, next to Questions 7–10.\n\nA. Amanda\nB. Steve\nC. Malik\nD. Geoff',
          headerTitle: 'AFTERNOON EVENT ALLOCATIONS',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Basketball event coordinator',
              options: [
                { id: 'A', text: 'Amanda', textEn: 'Amanda' },
                { id: 'B', text: 'Steve', textEn: 'Steve' },
                { id: 'C', text: 'Malik', textEn: 'Malik' },
                { id: 'D', text: 'Geoff', textEn: 'Geoff' }
              ],
              answer: 'C',
              acceptableAnswers: ['C', 'Malik'],
              evidenceQuote: "How about you do the basketball, Malik? Then I can take over the weightlifting in the afternoon...",
              evidenceTimestamp: 107,
              explanation: 'Bẫy tự đính chính: Ban đầu Geoff định giao basketball cho Amanda, nhưng sau đó đổi ý giao cho Malik ("How about you do the basketball, Malik?").',
              explanationEn: 'Self-correction trap: Geoff initially proposed Amanda, but changed his mind and officially assigned basketball to Malik.',
              explanationVi: 'Bẫy tự đính chính: Ban đầu Geoff định giao basketball cho Amanda, nhưng sau đó đổi ý giao cho Malik ("How about you do the basketball, Malik?").'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Weightlifting primary coordinator',
              options: [
                { id: 'A', text: 'Amanda', textEn: 'Amanda' },
                { id: 'B', text: 'Steve', textEn: 'Steve' },
                { id: 'C', text: 'Malik', textEn: 'Malik' },
                { id: 'D', text: 'Geoff', textEn: 'Geoff' }
              ],
              answer: 'D',
              acceptableAnswers: ['D', 'Geoff'],
              evidenceQuote: "Then I can take over the weightlifting in the afternoon, as I'm particularly keen on that, as you all know...",
              evidenceTimestamp: 111,
              explanation: 'Buổi chiều Geoff sẽ trực tiếp phụ trách môn cử tạ vì anh ấy đặc biệt thích môn này.',
              explanationEn: 'Geoff takes over the afternoon weightlifting himself because he is particularly keen on it.',
              explanationVi: 'Buổi chiều Geoff sẽ trực tiếp phụ trách môn cử tạ vì anh ấy đặc biệt thích môn này.'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Table tennis coordinator',
              options: [
                { id: 'A', text: 'Amanda', textEn: 'Amanda' },
                { id: 'B', text: 'Steve', textEn: 'Steve' },
                { id: 'C', text: 'Malik', textEn: 'Malik' },
                { id: 'D', text: 'Geoff', textEn: 'Geoff' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'Amanda'],
              evidenceQuote: 'So then, Amanda, you can do the table tennis.',
              evidenceTimestamp: 119,
              explanation: 'Sau khi Malik nhận bóng rổ, Amanda được phân công phụ trách môn bóng bàn ("So then, Amanda, you can do the table tennis").',
              explanationEn: 'With Malik reassigned to basketball, Amanda is placed in charge of table tennis.',
              explanationVi: 'Sau khi Malik nhận bóng rổ, Amanda được phân công phụ trách môn bóng bàn ("So then, Amanda, you can do the table tennis").'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Flexible helper across all events',
              options: [
                { id: 'A', text: 'Amanda', textEn: 'Amanda' },
                { id: 'B', text: 'Steve', textEn: 'Steve' },
                { id: 'C', text: 'Malik', textEn: 'Malik' },
                { id: 'D', text: 'Geoff', textEn: 'Geoff' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'Steve'],
              evidenceQuote: "Steve, you can be available to help wherever you're needed in the afternoon.",
              evidenceTimestamp: 128,
              explanation: 'Steve được phân công làm người hỗ trợ linh hoạt, có mặt ở bất cứ đâu cần người trợ giúp.',
              explanationEn: 'Steve serves as a flexible roving assistant available wherever needed.',
              explanationVi: 'Steve được phân công làm người hỗ trợ linh hoạt, có mặt ở bất cứ đâu cần người trợ giúp.'
            }
          ]
        },
        {
          id: 'qg-t16-p2-mcq',
          type: 'multiple_choice',
          title: 'Questions 11–12: Contingency Plan & Communication',
          instruction: 'Choose the correct letter, A, B, C or D.',
          headerTitle: 'CONTINGENCY & CONTACT PROCEDURES',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'What contingency role will Steve undertake if Geoff is unexpectedly delayed in the early afternoon?',
              options: [
                { id: 'A', text: 'Supervising the weightlifting until Geoff arrives', textEn: 'Supervising the weightlifting until Geoff arrives' },
                { id: 'B', text: 'Taking over table tennis management from Amanda', textEn: 'Taking over table tennis management from Amanda' },
                { id: 'C', text: 'Managing line calls for the basketball games', textEn: 'Managing line calls for the basketball games' },
                { id: 'D', text: 'Greeting spectators at the main reception entrance', textEn: 'Greeting spectators at the main reception entrance' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: "And if something happens and I can't make it in the early afternoon, you can take care of the weightlifting till I arrive...",
              evidenceTimestamp: 136,
              explanation: 'Nếu Geoff đến muộn vào đầu giờ chiều, Steve sẽ tạm thời trông coi môn cử tạ cho đến khi Geoff tới.',
              explanationEn: 'If Geoff is delayed, Steve will temporarily manage weightlifting until his arrival.',
              explanationVi: 'Nếu Geoff đến muộn vào đầu giờ chiều, Steve sẽ tạm thời trông coi môn cử tạ cho đến khi Geoff tới.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'How are volunteers advised to reach Geoff if they require immediate assistance?',
              options: [
                { id: 'A', text: 'By calling him directly on his mobile phone', textEn: 'By calling him directly on his mobile phone' },
                { id: 'B', text: 'By leaving an urgent note with reception', textEn: 'By leaving an urgent note with reception' },
                { id: 'C', text: 'By contacting the sports centre duty manager', textEn: 'By contacting the sports centre duty manager' },
                { id: 'D', text: 'By sending a message to the tournament email', textEn: 'By sending a message to the tournament email' }
              ],
              answer: 'A',
              acceptableAnswers: ['A'],
              evidenceQuote: 'Okay, if you need to check on anything, call me on my mobile.',
              evidenceTimestamp: 144,
              explanation: 'Geoff hướng dẫn nếu cần kiểm tra thông tin gì thì gọi điện trực tiếp vào số di động của anh ấy (call me on my mobile).',
              explanationEn: 'Geoff advises helpers to telephone him on his mobile phone for any urgent checks.',
              explanationVi: 'Geoff hướng dẫn nếu cần kiểm tra thông tin gì thì gọi điện trực tiếp vào số di động của anh ấy (call me on my mobile).'
            }
          ]
        }
      ]
    }
  ]
};
