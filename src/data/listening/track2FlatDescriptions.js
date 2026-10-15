/**
 * IELTS Listening Practice: Property & Flat Descriptions (Track 2)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track2-flat-descriptions.mp3
 * 
 * Authentic Multi-Format IELTS Simulation covering 5 Major Question Types:
 * 1. Note / Form Completion (Questions 1–4)
 * 2. Pick Multiple (Choose TWO letters A–E) (Questions 5–6)
 * 3. Classification Matching (Questions 7–10)
 * 4. Sentence Completion (Questions 11–13)
 * 5. Short Answer Questions (Questions 14–16)
 */

export const track2FlatDescriptions = {
  id: 'ielts-listening-track2-flats',
  title: 'IELTS Listening Practice: Rental Property & Flat Inspection (Multi-Format Master)',
  description: 'Bộ luyện thi IELTS Listening tổng hợp đa dạng 5 dạng bài thực chiến: Note Completion, Pick Multiple (A-E), Matching, Sentence Completion & Short Answer. Giúp học viên làm quen với toàn bộ format thi Cambridge.',
  totalQuestions: 16,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track2-flat-descriptions.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track2-flat-descriptions.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Inspection & Comparison of Rental Flats',
      context: 'An estate agent provides comprehensive audio overviews of three residential flats available for rent or purchase.',
      audioTimestampStart: 0,
      audioTimestampEnd: 103,
      speakers: [
        { name: 'Agent 1', gender: 'Female', accent: 'British' },
        { name: 'Agent 2', gender: 'Male', accent: 'British' },
        { name: 'Agent 3', gender: 'Female', accent: 'American' }
      ],
      transcript: `[00:00] Track 2.
[00:02] One.
[00:03] This is a very nice ground floor two-bedroom flat. It was recently modernized with a new bathroom and kitchen. The main bedroom is a double bedroom with an en-suite bathroom and toilet, in addition to the main bathroom and toilet. There is a second smaller bedroom. The living room is spacious and there is a large kitchen which is big enough to be used as a dining room. The garden is accessible through the living room and the kitchen.

[00:33] Two.
[00:34] This first floor flat is in a very nice area of the town and is well-connected to local shops and services as well as having good transport connections. There are two double bedrooms, one bathroom, a newly fitted kitchen, a living room, and a separate dining room which could be turned into a third bedroom. There are stairs to the garden at the back. The flat needs some modernization, but it is very well kept and would be an excellent family home.

[01:04] Three.
[01:05] This is a lovely flat, suitable for a family or for people sharing. The flat is on two levels; there's a first floor and a second floor above a separate ground floor flat. Upstairs, there's a large double bedroom and a smaller double, as well as a third bedroom which is only a single but is still a good size. There's a large bathroom upstairs and also a small shower room downstairs. There's a spacious living room and a large kitchen-dining room with a rear door to steps leading to the garden.`,
      questionGroups: [
        // ==========================================
        // DẠNG 1: NOTE / FORM COMPLETION (Q1 - Q4)
        // ==========================================
        {
          id: 'qg-flats-1',
          type: 'note_completion',
          title: 'Questions 1–4: Note Completion',
          instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'ACCOMMODATION INSPECTION NOTES',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Flat 1: The main bedroom features an ................ bathroom and toilet.',
              prefixText: 'Flat 1: The main bedroom features an',
              suffixText: 'bathroom and toilet.',
              answer: 'en-suite',
              acceptableAnswers: ['en-suite', 'ensuite', 'en suite'],
              evidenceQuote: 'The main bedroom is a double bedroom with an en-suite bathroom and toilet...',
              evidenceTimestamp: 13,
              explanation: 'Phòng ngủ chính có phòng tắm và nhà vệ sinh khép kín riêng biệt ("en-suite").'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Flat 1: The kitchen is large enough to serve as a ................ room.',
              prefixText: 'Flat 1: The kitchen is large enough to serve as a',
              suffixText: 'room.',
              answer: 'dining',
              acceptableAnswers: ['dining', 'dinning'],
              evidenceQuote: '...there is a large kitchen which is big enough to be used as a dining room.',
              evidenceTimestamp: 25,
              explanation: 'Bếp rộng đủ để dùng làm phòng ăn (dining room).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Flat 2: The location offers easy access to local ................ and services.',
              prefixText: 'Flat 2: The location offers easy access to local',
              suffixText: 'and services.',
              answer: 'shops',
              acceptableAnswers: ['shops', 'shop'],
              evidenceQuote: '...well-connected to local shops and services as well as having good transport connections.',
              evidenceTimestamp: 39,
              explanation: 'Căn hộ số 2 nằm gần các cửa hàng tiện ích (local shops) và dịch vụ.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Flat 2: Outside stairs lead down to the ................ at the back.',
              prefixText: 'Flat 2: Outside stairs lead down to the',
              suffixText: 'at the back.',
              answer: 'garden',
              acceptableAnswers: ['garden'],
              evidenceQuote: 'There are stairs to the garden at the back.',
              evidenceTimestamp: 54,
              explanation: 'Có cầu thang phía sau dẫn thẳng xuống khu vườn (garden).'
            }
          ]
        },

        // ==========================================
        // DẠNG 2: PICK MULTIPLE (CHỌN 2 TRONG 5) (Q5 - Q6)
        // ==========================================
        {
          id: 'qg-flats-2',
          type: 'pick_multiple',
          title: 'Questions 5–6: Multiple Choice (Choose TWO)',
          instruction: 'Choose TWO letters, A–E.\nWhich TWO features are true regarding Flat 1?',
          maxSelections: 2,
          options: [
            { key: 'A', text: 'It is situated on the first floor above ground level.' },
            { key: 'B', text: 'It has been recently updated with a new kitchen and bathroom.' },
            { key: 'C', text: 'It contains three distinct double bedrooms.' },
            { key: 'D', text: 'The garden can be entered through two separate rooms.' },
            { key: 'E', text: 'It does not include any private ensuite facilities.' }
          ],
          questions: [
            {
              id: 5,
              order: 5,
              questionText: 'Select the first correct feature (Letter A–E):',
              answer: 'B',
              acceptableAnswers: ['B', 'b', 'D', 'd'],
              evidenceQuote: 'It was recently modernized with a new bathroom and kitchen.',
              evidenceTimestamp: 8,
              explanation: 'Đáp án B đúng: Căn hộ vừa mới được hiện đại hóa với bếp và phòng tắm mới.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Select the second correct feature (Letter A–E):',
              answer: 'D',
              acceptableAnswers: ['D', 'd', 'B', 'b'],
              evidenceQuote: 'The garden is accessible through the living room and the kitchen.',
              evidenceTimestamp: 28,
              explanation: 'Đáp án D đúng: Khu vườn có thể đi ra từ cả 2 phòng (phòng khách và bếp).'
            }
          ]
        },

        // ==========================================
        // DẠNG 3: CLASSIFICATION MATCHING (Q7 - Q10)
        // ==========================================
        {
          id: 'qg-flats-3',
          type: 'matching',
          title: 'Questions 7–10: Classification Matching',
          instruction: 'Which flat (A, B, or C) matches each statement?\nChoose the correct letter, A, B, or C from the box.',
          options: [
            { key: 'A', text: 'Flat 1 (Ground floor, 2 bedrooms)' },
            { key: 'B', text: 'Flat 2 (First floor, 2 double bedrooms)' },
            { key: 'C', text: 'Flat 3 (Two levels, 3 bedrooms)' }
          ],
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Has a dining area that could be converted into an additional bedroom',
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: '...and a separate dining room which could be turned into a third bedroom.',
              evidenceTimestamp: 51,
              explanation: 'Flat 2 có phòng ăn riêng biệt có tiềm năng sửa thành phòng ngủ thứ 3.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Includes a compact shower room on the lower floor level',
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'There\'s a large bathroom upstairs and also a small shower room downstairs.',
              evidenceTimestamp: 91,
              explanation: 'Flat 3 có phòng tắm vòi sen nhỏ ở tầng dưới (small shower room downstairs).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Provides two separate toilets located entirely on the ground level',
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: '...an en-suite bathroom and toilet, in addition to the main bathroom and toilet.',
              evidenceTimestamp: 15,
              explanation: 'Flat 1 nằm ở tầng trệt và có 2 toilet (1 trong phòng ngủ chính và 1 ở ngoài).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Is arranged across two separate floors above another residence',
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'The flat is on two levels; there\'s a first floor and a second floor above a separate ground floor flat.',
              evidenceTimestamp: 69,
              explanation: 'Flat 3 gồm tầng 1 và tầng 2 nằm phía trên một căn hộ tầng trệt riêng biệt.'
            }
          ]
        },

        // ==========================================
        // DẠNG 4: SENTENCE COMPLETION (Q11 - Q13)
        // ==========================================
        {
          id: 'qg-flats-4',
          type: 'sentence_completion',
          title: 'Questions 11–13: Sentence Completion',
          instruction: 'Complete the sentences below.\nWrite NO MORE THAN TWO WORDS for each answer.',
          headerTitle: 'PROPERTY HIGHLIGHTS & CONDITION',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'Even though Flat 2 needs some modernization, the agent notes that it is very ................ .',
              prefixText: 'Even though Flat 2 needs some modernization, the agent notes that it is very',
              suffixText: '.',
              answer: 'well kept',
              acceptableAnswers: ['well kept', 'well-kept', 'wellkept'],
              evidenceQuote: 'The flat needs some modernization, but it is very well kept...',
              evidenceTimestamp: 59,
              explanation: 'Người nói khen ngợi căn hộ được gìn giữ, bảo quản rất tốt ("very well kept").'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Flat 3 is situated directly above a separate ................ flat.',
              prefixText: 'Flat 3 is situated directly above a separate',
              suffixText: 'flat.',
              answer: 'ground floor',
              acceptableAnswers: ['ground floor', 'ground-floor'],
              evidenceQuote: '...above a separate ground floor flat.',
              evidenceTimestamp: 72,
              explanation: 'Căn hộ số 3 nằm phía trên một căn hộ tầng trệt riêng ("ground floor flat").'
            },
            {
              id: 13,
              order: 13,
              questionText: 'The third bedroom in Flat 3 is only a ................ but remains a good size.',
              prefixText: 'The third bedroom in Flat 3 is only a',
              suffixText: 'but remains a good size.',
              answer: 'single',
              acceptableAnswers: ['single', 'single bedroom'],
              evidenceQuote: '...a third bedroom which is only a single but is still a good size.',
              evidenceTimestamp: 84,
              explanation: 'Phòng ngủ thứ 3 chỉ là phòng đơn (single), nhưng diện tích vẫn khá rộng rãi.'
            }
          ]
        },

        // ==========================================
        // DẠNG 5: SHORT ANSWER QUESTIONS (Q14 - Q16)
        // ==========================================
        {
          id: 'qg-flats-5',
          type: 'short_answer',
          title: 'Questions 14–16: Short Answer Questions',
          instruction: 'Answer the questions below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          questions: [
            {
              id: 14,
              order: 14,
              questionText: 'How many double bedrooms does Flat 2 currently have?',
              answer: '2',
              acceptableAnswers: ['2', 'two', '2 double', 'two double'],
              evidenceQuote: 'There are two double bedrooms, one bathroom...',
              evidenceTimestamp: 44,
              explanation: 'Hiện trạng căn hộ 2 có 2 phòng ngủ đôi (phòng ăn mới chỉ có tiềm năng sửa thành phòng ngủ thứ 3).'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Through which exit in the kitchen-dining room can residents reach the steps to the garden in Flat 3?',
              answer: 'rear door',
              acceptableAnswers: ['rear door', 'the rear door', 'back door'],
              evidenceQuote: '...with a rear door to steps leading to the garden.',
              evidenceTimestamp: 98,
              explanation: 'Cửa sau (rear door) dẫn ra các bậc thang xuống vườn.'
            },
            {
              id: 16,
              order: 16,
              questionText: 'Besides people sharing, who else is Flat 3 particularly suitable for?',
              answer: 'family',
              acceptableAnswers: ['family', 'a family'],
              evidenceQuote: 'This is a lovely flat, suitable for a family or for people sharing.',
              evidenceTimestamp: 66,
              explanation: 'Căn hộ rất phù hợp cho một hộ gia đình (a family) hoặc nhóm người ở ghép.'
            }
          ]
        }
      ]
    }
  ]
};
