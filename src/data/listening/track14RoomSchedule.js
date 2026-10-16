/**
 * IELTS Listening Practice: Sports Competition Room Scheduling & Setup (Track 14)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track14-sports-centre-room-schedule.mp3
 * 
 * Standard Cambridge IELTS Section 2 Simulation:
 * - Part 1: Table & Note Completion: Competition Rooms & Morning Schedule (Questions 1–5)
 * - Part 2: Multiple Choice & Schedule Revision Traps: Afternoon Adjustments (Questions 6–10)
 */

export const track14RoomSchedule = {
  id: 'ielts-listening-track14-room-schedule',
  title: 'IELTS Listening Practice: Sports Competition Room Scheduling & Setup (Track 14)',
  description: 'Bộ luyện thi IELTS Listening Section 2 thực chiến: Phân bổ 3 phòng thi đấu (Dean, Carsley, Forster) cho 5 bộ môn (Badminton, Gymnastics, Weightlifting, Basketball, Table tennis), bẫy tự sửa thông tin (Self-Correction Trap) buổi chiều và thủ tục nhận chìa khóa kho tại Reception.',
  totalQuestions: 10,
  timeLimitMinutes: 12,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track14-sports-centre-room-schedule.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track14-sports-centre-room-schedule.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Tournament Room Scheduling & Afternoon Changes',
      context: 'Geoff briefs student helpers on how to prepare the three sports rooms and outlines the morning and afternoon schedules.',
      audioTimestampStart: 0,
      audioTimestampEnd: 95,
      speakers: [
        { name: 'Geoff (Sports Coordinator)', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 14.
[00:02] Okay, so when you get there, you'll have to start setting up the rooms for the people taking part in the competition.
[00:09] I've been there and looked at the rooms, and the equipment they've got is not as good as ours, but it'll be okay.
[00:16] There's a big storeroom with all the equipment in it. You should be able to get the key from reception. They'll be there waiting for us.
[00:23] There are three rooms where the competitions are taking place. Remember that two of the rooms have different competitions in the morning and afternoon.
[00:32] So first of all, let me give you the schedule for the morning.
[00:36] The Dean Room is for the badminton competition. There are two courts in there, so you'll have to set up both of them.
[00:44] Then, the Carsley Room is where the gymnastics will be, and there's quite a lot of equipment to bring in for that.
[00:50] We have to get the Forster Room ready for the weightlifting, which is taking place in there all day. So once you set up the room for the weightlifting, you won't have to change anything, but there's a lot of equipment to put in there.
[01:04] Now, in the afternoon, the table tennis is taking place in the Dean Room, so you'll need to... Oh, wait a minute!
[01:11] We had to change that because there are no basketball nets in the Carsley Room, so actually, the basketball will be in the Dean Room, but as the nets are already there, you won't need to set anything up for that.
[01:23] That means the table tennis will be taking place in the Carsley Room in the afternoon, so you'll have to make sure all the equipment is in there, as there will be a lot to do to change the room around.`,
      questionGroups: [
        {
          id: 'qg-t14-p1',
          type: 'table_completion',
          title: 'Questions 1–5: Competition Schedule & Setup Notes',
          instruction: 'Complete the table below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'NORTH HENTON SPORTS CENTRE - SCHEDULE & LOGISTICS',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Helpers can retrieve the key to the equipment storeroom directly from ................',
              prefixText: 'Helpers can retrieve the key to the equipment storeroom directly from',
              suffixText: '.',
              answer: 'reception',
              acceptableAnswers: ['reception', 'the reception'],
              evidenceQuote: 'There\'s a big storeroom with all the equipment in it. You should be able to get the key from reception.',
              evidenceTimestamp: 19,
              explanation: 'Chìa khóa nhà kho đựng dụng cụ lấy trực tiếp tại bàn tiếp tân ("from reception").'
            },
            {
              id: 2,
              order: 2,
              questionText: 'In the Dean Room, volunteers are required to set up ................ badminton courts.',
              prefixText: 'In the Dean Room, volunteers are required to set up',
              suffixText: 'badminton courts.',
              answer: 'two',
              acceptableAnswers: ['two', '2', 'both'],
              evidenceQuote: 'The Dean Room is for the badminton competition. There are two courts in there, so you\'ll have to set up both of them.',
              evidenceTimestamp: 40,
              explanation: 'Tại phòng Dean có 2 sân cầu lông ("two courts"), tình nguyện viên cần chuẩn bị cả hai sân.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'During the morning session, the Carsley Room will be reserved for ................',
              prefixText: 'During the morning session, the Carsley Room will be reserved for',
              suffixText: '.',
              answer: 'gymnastics',
              acceptableAnswers: ['gymnastics'],
              evidenceQuote: "Then, the Carsley Room is where the gymnastics will be, and there's quite a lot of equipment to bring in for that.",
              evidenceTimestamp: 46,
              explanation: 'Buổi sáng phòng Carsley được dành cho môn thể dục dụng cụ (gymnastics).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'The weightlifting event in the Forster Room is scheduled to last ................ without requiring room changes.',
              prefixText: 'The weightlifting event in the Forster Room is scheduled to last',
              suffixText: 'without requiring room changes.',
              answer: 'all day',
              acceptableAnswers: ['all day'],
              evidenceQuote: 'We have to get the Forster Room ready for the weightlifting, which is taking place in there all day.',
              evidenceTimestamp: 54,
              explanation: 'Môn cử tạ tại phòng Forster diễn ra suốt cả ngày ("all day") nên không cần đổi phòng buổi chiều.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'In the afternoon, the Dean Room will host ................ since the required nets are pre-installed.',
              prefixText: 'In the afternoon, the Dean Room will host',
              suffixText: 'since the required nets are pre-installed.',
              answer: 'basketball',
              acceptableAnswers: ['basketball'],
              evidenceQuote: 'actually, the basketball will be in the Dean Room, but as the nets are already there, you won\'t need to set anything up for that.',
              evidenceTimestamp: 77,
              explanation: 'Sau khi đính chính, môn bóng rổ (basketball) sẽ diễn ra tại Dean Room vì lưới đã lắp sẵn.'
            }
          ]
        },
        {
          id: 'qg-t14-p2',
          type: 'multiple_choice',
          title: 'Questions 6–10: Afternoon Arrangements & Distractor Analysis',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'Where will the table tennis competition take place in the afternoon?',
              options: [
                { key: 'A', text: 'In the Dean Room' },
                { key: 'B', text: 'In the Carsley Room' },
                { key: 'C', text: 'In the Forster Room' }
              ],
              answer: 'B',
              evidenceQuote: 'That means the table tennis will be taking place in the Carsley Room in the afternoon',
              evidenceTimestamp: 84,
              explanation: 'Bẫy tự đính chính: Ban đầu người nói bảo table tennis ở Dean Room, nhưng sau đó đổi lại thành Carsley Room.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Why did the coordinator change the afternoon venue for basketball?',
              options: [
                { key: 'A', text: 'The Carsley Room lacks basketball nets' },
                { key: 'B', text: 'The floor in the Carsley Room was too slippery' },
                { key: 'C', text: 'The Dean Room has more spectator seating' }
              ],
              answer: 'A',
              evidenceQuote: 'We had to change that because there are no basketball nets in the Carsley Room',
              evidenceTimestamp: 73,
              explanation: 'Lý do phải đổi là vì phòng Carsley không có lưới bóng rổ ("there are no basketball nets in the Carsley Room").'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Why is NO preparation needed for basketball in the Dean Room?',
              options: [
                { key: 'A', text: 'The referee brings their own portable equipment' },
                { key: 'B', text: 'The basketball nets are already fitted in the room' },
                { key: 'C', text: 'Volunteers from other colleges will set it up' }
              ],
              answer: 'B',
              evidenceQuote: "as the nets are already there, you won't need to set anything up for that.",
              evidenceTimestamp: 80,
              explanation: 'Không cần chuẩn bị gì vì lưới bóng rổ đã có sẵn trong phòng Dean ("as the nets are already there").'
            },
            {
              id: 9,
              order: 9,
              questionText: "What was Geoff's assessment of the sports equipment at North Henton?",
              options: [
                { key: 'A', text: 'It is vastly superior to their own college gear' },
                { key: 'B', text: 'It is not as good as their own, but satisfactory' },
                { key: 'C', text: 'It is badly damaged and mostly unusable' }
              ],
              answer: 'B',
              evidenceQuote: "the equipment they've got is not as good as ours, but it'll be okay.",
              evidenceTimestamp: 12,
              explanation: 'Geoff nhận xét dụng cụ ở đó không tốt bằng trường mình nhưng vẫn dùng ổn ("not as good as ours, but it\'ll be okay").'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Which room does NOT require any rearrangement between morning and afternoon?',
              options: [
                { key: 'A', text: 'The Dean Room' },
                { key: 'B', text: 'The Carsley Room' },
                { key: 'C', text: 'The Forster Room' }
              ],
              answer: 'C',
              evidenceQuote: "once you set up the room for the weightlifting, you won't have to change anything",
              evidenceTimestamp: 57,
              explanation: 'Phòng Forster tổ chức môn cử tạ cả ngày ("all day") nên sau khi dựng xong sáng sớm thì không cần thay đổi gì.'
            }
          ]
        }
      ]
    }
  ]
};
