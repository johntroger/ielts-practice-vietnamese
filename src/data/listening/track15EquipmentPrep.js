/**
 * IELTS Listening Practice: Sports Equipment Setup & Room Logistics (Track 15)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track15-sports-equipment-and-preparation.mp3
 * 
 * Standard Cambridge IELTS Section 2 Simulation:
 * - Part 1: Equipment Placement & Note Completion (Questions 1–6)
 * - Part 2: Logistics & Facility Status Matching / Multiple Choice (Questions 7–12)
 */

export const track15EquipmentPrep = {
  id: 'ielts-listening-track15-equipment-prep',
  title: 'IELTS Listening Practice: Sports Equipment Setup & Room Logistics (Track 15)',
  description: 'Bộ luyện thi IELTS Listening Section 2 thực chiến: Hướng dẫn lắp đặt dụng cụ thể thao chi tiết (lưới cầu lông, vợt dự phòng, ngựa nhảy vaulting horse, thảm mat, xà kép/đơn nam nữ, bàn bóng bàn gấp gọn, tạ barbell, giá phấn chalk) và lịch xuất hiện của điều phối viên Geoff lúc 10:00.',
  totalQuestions: 12,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track15-sports-equipment-and-preparation.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track15-sports-equipment-and-preparation.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Sports Equipment Layout & Assembly Instructions',
      context: 'Geoff gives detailed instructions to volunteers on setting up sports equipment in each room and confirms his arrival time.',
      audioTimestampStart: 0,
      audioTimestampEnd: 122,
      speakers: [
        { name: 'Geoff (Sports Coordinator)', gender: 'Male', accent: 'British' }
      ],
      transcript: `[00:00] Track 15.
[00:02] Now, about the equipment.
[00:04] For the badminton in the Dean Room, there are two nets in the storeroom to set up, and you know what to do, so it shouldn't take you long.
[00:12] The players will bring their own rackets with them, but there are some spare ones, so take them into the badminton room as well, just in case.
[00:20] There are also a couple of boxes of shuttlecocks, if we need them.
[00:24] For the basketball in the afternoon, you only need to bring in the balls, because the nets are always up and ready, so you can do that between the sports events.
[00:33] In the Carsley Room, you'll have to get the gymnastics equipment in place in the morning. That means bringing in the vaulting horse and putting it in the middle. Put one mat in front and another behind the horse, and have some other mats ready for the floor exercises.
[00:48] Then on the side, set up the bars for the gymnastics. There are two sets of bars, one for the men, and one for the women.
[00:56] The other equipment, such as the rings and pommel horse, are already in there, so you don't need to worry about those.
[01:03] It's also a good idea to bring in the tables and nets for the table tennis at the same time. There's enough room to leave them folded while the gymnastics is going on, but you'll be able to set them up more quickly later.
[01:16] The players should bring their own bats with them, but there's a box of bats there, so bring those in as well, as we might need them.
[01:24] For the weightlifting, get someone to help you bring in the barbells and the other weights, so that you don't try to carry too much. The bench for the bench press should be in there already, so check that it is when you arrive.
[01:37] But you'll need to bring in the stand with the chalk for the lifters to put on their hands.
[01:42] I'll be there at about 10:00, as I have an appointment first thing, so you should be ready by then. We can check everything together, and then get ready to welcome the contestants and the spectators.
[01:53] I hope everything goes well, and I'm sure we can do it. Call me if you need any extra information.`,
      questionGroups: [
        {
          id: 'qg-t15-p1',
          type: 'form_completion',
          title: 'Questions 1–6: Equipment Setup Checklist',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'ROOM EQUIPMENT PREPARATION',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Helpers should bring extra ................ into the Dean Room in case competitors forget theirs.',
              prefixText: 'Helpers should bring extra',
              suffixText: 'into the Dean Room in case competitors forget theirs.',
              answer: 'rackets',
              acceptableAnswers: ['rackets', 'racquets', 'spare rackets'],
              evidenceQuote: 'The players will bring their own rackets with them, but there are some spare ones, so take them into the badminton room as well, just in case.',
              evidenceTimestamp: 16,
              explanation: 'Người chơi tự mang vợt nhưng tình nguyện viên cần mang thêm vợt dự phòng ("spare rackets") đề phòng.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'For morning gymnastics in the Carsley Room, place the ................ horse in the center of the hall.',
              prefixText: 'For morning gymnastics in the Carsley Room, place the',
              suffixText: 'horse in the center of the hall.',
              answer: 'vaulting',
              acceptableAnswers: ['vaulting'],
              evidenceQuote: 'That means bringing in the vaulting horse and putting it in the middle.',
              evidenceTimestamp: 39,
              explanation: 'Dụng cụ thể dục dụng cụ đặt ở giữa phòng là ngựa nhảy ("vaulting horse").'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Safety mats must be positioned both directly in front of and ................ the apparatus.',
              prefixText: 'Safety mats must be positioned both directly in front of and',
              suffixText: 'the apparatus.',
              answer: 'behind',
              acceptableAnswers: ['behind'],
              evidenceQuote: 'Put one mat in front and another behind the horse',
              evidenceTimestamp: 43,
              explanation: 'Thảm bảo hộ được đặt ở phía trước và phía sau con ngựa nhảy ("another behind the horse").'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Along the wall, assemble two sets of gymnastics bars designated separately for men and ................',
              prefixText: 'Along the wall, assemble two sets of gymnastics bars designated separately for men and',
              suffixText: '.',
              answer: 'women',
              acceptableAnswers: ['women', 'the women'],
              evidenceQuote: 'There are two sets of bars, one for the men, and one for the women.',
              evidenceTimestamp: 54,
              explanation: 'Có hai bộ xà thể dục ở bên hông: một cho nam và một cho nữ ("one for the women").'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Table tennis tables should be moved in early and kept ................ to save space during gymnastics.',
              prefixText: 'Table tennis tables should be moved in early and kept',
              suffixText: 'to save space during gymnastics.',
              answer: 'folded',
              acceptableAnswers: ['folded'],
              evidenceQuote: 'There\'s enough room to leave them folded while the gymnastics is going on',
              evidenceTimestamp: 69,
              explanation: 'Bàn bóng bàn mang vào sớm và để ở trạng thái gấp gọn ("leave them folded") trong lúc thi đấu thể dục dụng cụ.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Lifters in the Forster Room require a dedicated stand holding ................ to apply to their hands.',
              prefixText: 'Lifters in the Forster Room require a dedicated stand holding',
              suffixText: 'to apply to their hands.',
              answer: 'chalk',
              acceptableAnswers: ['chalk', 'the chalk'],
              evidenceQuote: "you'll need to bring in the stand with the chalk for the lifters to put on their hands.",
              evidenceTimestamp: 98,
              explanation: 'Vận động viên cử tạ cần giá đỡ đựng bột phấn ("chalk") để xoa vào tay trước khi nâng.'
            }
          ]
        },
        {
          id: 'qg-t15-p2',
          type: 'multiple_choice',
          title: 'Questions 7–12: Equipment Logistics & Schedule Coordination',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Which items are ALREADY present in the Carsley Room and do NOT need to be brought in?',
              options: [
                { key: 'A', text: 'The rings and pommel horse' },
                { key: 'B', text: 'The vaulting horse and floor exercise mats' },
                { key: 'C', text: 'The table tennis tables and folded nets' }
              ],
              answer: 'A',
              evidenceQuote: 'The other equipment, such as the rings and pommel horse, are already in there, so you don\'t need to worry about those.',
              evidenceTimestamp: 59,
              explanation: 'Vòng treo (rings) và ngựa tay quay (pommel horse) đã có sẵn trong phòng nên không cần chuyển vào.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Why is basketball setup considered minimal for the afternoon?',
              options: [
                { key: 'A', text: 'The basketball nets are permanently installed and ready' },
                { key: 'B', text: 'Competitors bring their own basketballs with them' },
                { key: 'C', text: 'The match will take place outdoors in the courtyard' }
              ],
              answer: 'A',
              evidenceQuote: 'you only need to bring in the balls, because the nets are always up and ready',
              evidenceTimestamp: 29,
              explanation: 'Chỉ cần mang bóng vào vì lưới bóng rổ lúc nào cũng được giăng sẵn ("nets are always up and ready").'
            },
            {
              id: 9,
              order: 9,
              questionText: 'What health and safety advice is given regarding the weightlifting gear?',
              options: [
                { key: 'A', text: 'Always wear steel-capped boots during transit' },
                { key: 'B', text: 'Get assistance from others to avoid carrying excessive loads' },
                { key: 'C', text: 'Roll the plates along the floor instead of lifting them' }
              ],
              answer: 'B',
              evidenceQuote: 'get someone to help you bring in the barbells and the other weights, so that you don\'t try to carry too much.',
              evidenceTimestamp: 86,
              explanation: 'Geoff nhắc nhờ người phụ giúp để không phải tự vác quá nặng ("don\'t try to carry too much").'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Which piece of weightlifting equipment should already be in the Forster Room?',
              options: [
                { key: 'A', text: 'The chalk stand' },
                { key: 'B', text: 'The bench for the bench press' },
                { key: 'C', text: 'The heavy barbells' }
              ],
              answer: 'B',
              evidenceQuote: 'The bench for the bench press should be in there already, so check that it is when you arrive.',
              evidenceTimestamp: 93,
              explanation: 'Ghế đẩy tạ (bench for the bench press) đáng lẽ đã có sẵn trong phòng, cần kiểm tra lại khi đến.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'At what time does Geoff plan to arrive at the North Henton Sports Centre?',
              options: [
                { key: 'A', text: 'At 9:00 am' },
                { key: 'B', text: 'At around 10:00 am' },
                { key: 'C', text: 'At 11:30 am' }
              ],
              answer: 'B',
              evidenceQuote: "I'll be there at about 10:00, as I have an appointment first thing, so you should be ready by then.",
              evidenceTimestamp: 104,
              explanation: 'Geoff sẽ đến lúc khoảng 10:00 sáng ("at about 10:00") sau cuộc hẹn đầu giờ.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Why cannot Geoff arrive earlier with the volunteers?',
              options: [
                { key: 'A', text: 'He is stuck in heavy town centre motorway traffic' },
                { key: 'B', text: 'He has an appointment scheduled first thing in the morning' },
                { key: 'C', text: 'He needs to register the athletes at South Henton College' }
              ],
              answer: 'B',
              evidenceQuote: 'as I have an appointment first thing, so you should be ready by then.',
              evidenceTimestamp: 106,
              explanation: 'Lý do Geoff đến muộn hơn là vì có một cuộc hẹn vào sáng sớm ("an appointment first thing").'
            }
          ]
        }
      ]
    }
  ]
};
