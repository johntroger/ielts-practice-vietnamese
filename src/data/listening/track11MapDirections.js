/**
 * IELTS Listening Practice: Map Labelling, Navigation Directives & Road Signpost Lab (Track 11)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track11-map-directions-and-navigation.mp3
 * 
 * Standard Cambridge IELTS Simulation:
 * - Driving Directives & Road Layout Transcription (Questions 1–6)
 * - Map Navigation & Traffic Signpost Multiple Choice (Questions 7–10)
 */

export const track11MapDirections = {
  id: 'ielts-listening-track11-map-directions',
  title: 'IELTS Listening Practice: Map Labelling & Road Directions Lab (Track 11)',
  description: 'Bộ luyện thi IELTS Listening Section 2 chuyên sâu về dạng bài Bản đồ & Chỉ đường (Map & Plan Labelling): Làn đường cao tốc (middle lane, motorway), đèn tín hiệu (wait on the right), bùng binh (third exit on roundabout), khúc cua gắt (slow down, sharp left turn) và ngã ba cuối đường (end of road, left turn).',
  totalQuestions: 10,
  timeLimitMinutes: 12,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track11-map-directions-and-navigation.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track11-map-directions-and-navigation.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Spoken Navigation Directives (Items 1–6)',
      context: 'Listen to 6 spoken traffic and driving instructions commonly encountered in IELTS Listening Map and Direction questions.',
      audioTimestampStart: 0,
      audioTimestampEnd: 43,
      speakers: [
        { name: 'Male Speaker', gender: 'Male', accent: 'British' },
        { name: 'Female Speaker', gender: 'Female', accent: 'American' }
      ],
      transcript: `[00:00] Track 11.
[00:02] 1. Stay in the middle lane so that you can go over the motorway.
[00:09] 2. You'll have to wait on the right till it changes for you to turn.
[00:16] 3. Go round and take the third exit on the right.
[00:23] 4. Slow down here because it goes to the left quite sharply.
[00:30] 5. When you get there, go straight across.
[00:36] 6. When you get to the end of this road, take the left turn.`,
      questionGroups: [
        {
          id: 'qg-t11-p1',
          type: 'sentence_completion',
          title: 'Questions 1–6: Route Guidance Completion',
          instruction: 'Complete the directives below.\nWrite NO MORE THAN TWO WORDS for each answer.',
          headerTitle: 'NAVIGATION & DRIVING INSTRUCTIONS',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Motorists intending to pass over the motorway must remain in the ................',
              prefixText: 'Motorists intending to pass over the motorway must remain in the',
              suffixText: '.',
              answer: 'middle lane',
              acceptableAnswers: ['middle lane', 'center lane'],
              evidenceQuote: 'Stay in the middle lane so that you can go over the motorway.',
              evidenceTimestamp: 3,
              explanation: 'Để đi qua đường cao tốc (motorway), tài xế cần giữ xe ở làn giữa (middle lane).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Before turning, vehicles are required to wait on the ................ until lights change.',
              prefixText: 'Before turning, vehicles are required to wait on the',
              suffixText: 'until lights change.',
              answer: 'right',
              acceptableAnswers: ['right'],
              evidenceQuote: "You'll have to wait on the right till it changes for you to turn.",
              evidenceTimestamp: 10,
              explanation: 'Phải chờ ở làn bên phải (on the right) cho đến khi tín hiệu đèn thay đổi để rẽ.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'At the roundabout, drivers should navigate around and take the ................',
              prefixText: 'At the roundabout, drivers should navigate around and take the',
              suffixText: '.',
              answer: 'third exit',
              acceptableAnswers: ['third exit', '3rd exit'],
              evidenceQuote: 'Go round and take the third exit on the right.',
              evidenceTimestamp: 17,
              explanation: 'Tại bùng binh (go round), lấy lối ra thứ ba (third exit) ở bên phải.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Vehicles must ................ due to a sudden sharp bend to the left.',
              prefixText: 'Vehicles must',
              suffixText: 'due to a sudden sharp bend to the left.',
              answer: 'slow down',
              acceptableAnswers: ['slow down'],
              evidenceQuote: 'Slow down here because it goes to the left quite sharply.',
              evidenceTimestamp: 24,
              explanation: 'Phải giảm tốc độ (slow down) vì con đường uốn cong gắt về bên trái.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Upon arriving at the junction, motorists are instructed to go ................',
              prefixText: 'Upon arriving at the junction, motorists are instructed to go',
              suffixText: '.',
              answer: 'straight across',
              acceptableAnswers: ['straight across', 'straight ahead'],
              evidenceQuote: 'When you get there, go straight across.',
              evidenceTimestamp: 31,
              explanation: 'Khi đến ngã tư/nút giao, tiếp tục đi thẳng băng qua (go straight across).'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Reaching the terminus of the thoroughfare, drivers should take the ................',
              prefixText: 'Reaching the terminus of the thoroughfare, drivers should take the',
              suffixText: '.',
              answer: 'left turn',
              acceptableAnswers: ['left turn'],
              evidenceQuote: 'When you get to the end of this road, take the left turn.',
              evidenceTimestamp: 37,
              explanation: 'Khi đi đến cuối con đường (end of this road), rẽ về phía bên trái (take the left turn).'
            }
          ]
        },
        {
          id: 'qg-t11-p2-mcq',
          type: 'multiple_choice',
          title: 'Questions 7–10: Directional Logic & Road Manoeuvres',
          instruction: 'Choose the correct letter, A, B, or C.',
          headerTitle: 'TACTICAL MANOEUVRES IN MAP QUESTIONS',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Why is lane positioning in Directive 1 essential?',
              options: [
                'A. To facilitate merging onto the left slip road',
                'B. To cross smoothly over the elevated motorway bridge',
                'C. To allow emergency vehicles to overtake on the right'
              ],
              answer: 'B',
              evidenceQuote: 'Stay in the middle lane so that you can go over the motorway.',
              evidenceTimestamp: 4,
              explanation: 'Làn giữa giúp tài xế đi vượt qua đường cao tốc (go over the motorway).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'In Directive 3, the instruction "Go round and take the third exit on the right" indicates',
              options: [
                'A. a motorway junction with three traffic signals',
                'B. a circular roundabout navigation manoeuvre',
                'C. an underground multi-storey parking ramp'
              ],
              answer: 'B',
              evidenceQuote: 'Go round and take the third exit on the right.',
              evidenceTimestamp: 18,
              explanation: 'Cụm từ "Go round and take the third exit" là chỉ dẫn điều hướng kinh điển tại bùng binh (roundabout).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Directive 4 advises slowing down specifically because of',
              options: [
                'A. a sharp curve bending towards the left',
                'B. pedestrian zebra crossings across the highway',
                'C. temporary construction resurfacing'
              ],
              answer: 'A',
              evidenceQuote: 'Slow down here because it goes to the left quite sharply.',
              evidenceTimestamp: 25,
              explanation: 'Giảm tốc do khúc cua ngoặt gấp về bên trái (goes to the left quite sharply).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'What road layout is implied in Directive 6 ("When you get to the end of this road...")?',
              options: [
                'A. A continuous dual carriageway',
                'B. A T-junction where straight travel is no longer possible',
                'C. A spiral one-way ring road'
              ],
              answer: 'B',
              evidenceQuote: 'When you get to the end of this road, take the left turn.',
              evidenceTimestamp: 38,
              explanation: 'Khi đến cuối đường và buộc phải rẽ trái, đây là bố cục ngã ba chữ T (T-junction).'
            }
          ]
        }
      ]
    }
  ]
};
