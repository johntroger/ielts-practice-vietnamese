/**
 * IELTS Listening Practice: Property Viewing & Room-by-Room Inspection (Track 5)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track5-property-viewing.mp3
 * 
 * Standard IELTS Part 1 & 2 Comprehensive Walkthrough:
 * - Table Completion (Dimensions: Length & Width with Decimals) (Questions 1–6)
 * - Note Completion (Features & Fixtures) (Questions 7–10)
 * - Multiple Choice (Asking Price, Occupants & Decisions) (Questions 11–14)
 */

export const track5PropertyViewing = {
  id: 'ielts-listening-track5-viewing',
  title: 'IELTS Listening Practice: House Tour, Dimensions & Final Offer (Track 5)',
  description: 'Bộ luyện thi IELTS Listening mô phỏng chuyến tham quan trực tiếp ngôi nhà: Bảng thông số kích thước từng phòng (dài x rộng), bẫy giá niêm yết £340,000 vs £350,000, trang thiết bị phòng tắm và quyết định trả giá mua nhà.',
  totalQuestions: 14,
  timeLimitMinutes: 14,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track5-property-viewing.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track5-property-viewing.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: On-site Property Inspection Tour',
      context: 'Peter Elliot guides Caroline Prendergast through the house, noting the exact dimensions of the lounges, garden, and bedrooms.',
      audioTimestampStart: 0,
      audioTimestampEnd: 231,
      speakers: [
        { name: 'Peter Elliot (Estate Agent)', gender: 'Male', accent: 'British' },
        { name: 'Caroline Prendergast (Buyer)', gender: 'Female', accent: 'American' }
      ],
      transcript: `[00:00] Track 5.
[00:03] Hello, I'm Peter Elliot. You must be Mrs. Prendergast.
[00:07] Yes, that's right.
[00:08] So, this is the property.
[00:10] Oh, I just wanted to check one thing - the price. If I remember rightly, it's £340,000?
[00:19] Actually, it's £350,000 at the moment, but we can discuss that later if you like.
[00:25] Ah.
[00:26] As you can see, the front garden is very well kept.
[00:29] Yes, the owners have taken very good care of it.
[00:33] Shall we go in? Follow me.
[00:40] So, here's the hall and the front lounge to the left.
[00:44] Hmm, yes, it's very nice. What are the dimensions?
[00:50] It's 4.3 meters by 3.28 meters. That's very spacious for a smaller lounge.
[00:58] Hmm, yes. 4.3 meters long and 3.28 meters wide. Can we go through to the second lounge?
[01:10] Certainly, if you'd like to follow me. And here we are.
[01:15] Oh, it's lovely! What's the size of this room?
[01:19] Let's see. The second lounge, it's 6.5 meters by 4.25 meters. And you can see the sunroom at the back and the garden.
[01:32] Can we go and have a look?
[01:33] Of course, walk this way.
[01:37] As you can see, there's enough room here for some plants and two sofas. You could even put a dining suite here.
[01:45] That would be perfect for cooler days. I love it!
[01:49] And as you can see, there's a patio and a large lawn with flowers around the edges.
[01:54] What are the dimensions of the garden?
[01:57] It's 30 meters long and 10 meters wide.
[02:01] 30 meters by 10 meters? That's a good size for a family. It would be lovely in summer.
[02:09] Of course. Would you like to look upstairs?
[02:12] Yes, okay.
[02:15] Here's the main bedroom. It's 4.91 meters by 3.95 meters. Perfect for a large double bed. Oh sorry, that's 4.9 meters long and 3.95 meters wide.
[02:30] And there's an en-suite bathroom here, though it only has a shower unit and not a big bath like the main bathroom.
[02:38] That would come in very useful when we all get up to get ready for school or work.
[02:44] Yes, that's a real positive. Here's the second bedroom. It's 4.2 meters by 3.55 meters. Ideal for children to share.
[02:57] 4.2 meters long and 3.55 meters wide? Okay, that's good. Yes, it's got plenty of room to play in.
[03:10] And here's the last bedroom, which is 3.25 meters by 2.5 meters. It would be ideal for a child.
[03:20] Yes, it would be fine for my older daughter.
[03:23] The bathroom is just over here. It's got a large bath as well as a shower fitting.
[03:30] Great, it's just what we need.
[03:33] So, would you like to put in an offer?
[03:36] Yes, please! This is the best property I've seen so far. I don't think I'll find a more suitable one.
[03:43] Wonderful. If you'd like to come back to the office, I can take your details and arrange everything.`,
      questionGroups: [
        // ==========================================
        // DẠNG 1: TABLE COMPLETION (DIMENSIONS) (Q1 - Q6)
        // ==========================================
        {
          id: 'qg-tour-1',
          type: 'table_completion',
          title: 'Questions 1–6: Property Dimensions Specification Table',
          instruction: 'Complete the table below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'ROOM MEASUREMENTS & DIMENSIONS SHEET',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Front lounge width: ................ meters',
              prefixText: 'Front lounge width:',
              suffixText: 'meters',
              answer: '3.28',
              acceptableAnswers: ['3.28', '3.28m', '3.28 meters'],
              evidenceQuote: 'It\'s 4.3 meters by 3.28 meters. - 4.3 meters long and 3.28 meters wide.',
              evidenceTimestamp: 50,
              explanation: 'Chiều rộng của phòng khách phía trước là 3.28 mét.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Second (back) lounge length: ................ meters',
              prefixText: 'Second (back) lounge length:',
              suffixText: 'meters',
              answer: '6.5',
              acceptableAnswers: ['6.5', '6.5m', '6.5 meters'],
              evidenceQuote: 'The second lounge, it\'s 6.5 meters by 4.25 meters.',
              evidenceTimestamp: 79,
              explanation: 'Chiều dài của phòng khách thứ hai là 6.5 mét.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Rear garden width: ................ meters',
              prefixText: 'Rear garden width:',
              suffixText: 'meters',
              answer: '10',
              acceptableAnswers: ['10', '10m', '10 meters', 'ten'],
              evidenceQuote: 'It\'s 30 meters long and 10 meters wide.',
              evidenceTimestamp: 117,
              explanation: 'Chiều rộng của khu vườn sau là 10 mét (chiều dài là 30 mét).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Main bedroom length (after correction): ................ meters',
              prefixText: 'Main bedroom length (after correction):',
              suffixText: 'meters',
              answer: '4.9',
              acceptableAnswers: ['4.9', '4.9m', '4.9 meters'],
              evidenceQuote: 'Oh sorry, that\'s 4.9 meters long and 3.95 meters wide.',
              evidenceTimestamp: 145,
              explanation: 'Bẫy tự đính chính: Môi giới đọc nhầm 4.91m rồi xin lỗi sửa lại thành 4.9 mét.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Second bedroom width: ................ meters',
              prefixText: 'Second bedroom width:',
              suffixText: 'meters',
              answer: '3.55',
              acceptableAnswers: ['3.55', '3.55m', '3.55 meters'],
              evidenceQuote: '4.2 meters long and 3.55 meters wide?',
              evidenceTimestamp: 177,
              explanation: 'Chiều rộng của phòng ngủ thứ hai là 3.55 mét.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Third bedroom length: ................ meters',
              prefixText: 'Third bedroom length:',
              suffixText: 'meters',
              answer: '3.25',
              acceptableAnswers: ['3.25', '3.25m', '3.25 meters'],
              evidenceQuote: '...which is 3.25 meters by 2.5 meters.',
              evidenceTimestamp: 191,
              explanation: 'Chiều dài của phòng ngủ thứ ba là 3.25 mét.'
            }
          ]
        },

        // ==========================================
        // DẠNG 2: NOTE COMPLETION (FIXTURES & FEATURES) (Q7 - Q10)
        // ==========================================
        {
          id: 'qg-tour-2',
          type: 'note_completion',
          title: 'Questions 7–10: Property Inspection Notes',
          instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'PROPERTY STATUS & AMENITIES',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Current official asking price: £ ................',
              prefixText: 'Current official asking price: £',
              suffixText: '',
              answer: '350,000',
              acceptableAnswers: ['350,000', '350000', '350 000', '350 thousand'],
              evidenceQuote: 'Actually, it\'s £350,000 at the moment...',
              evidenceTimestamp: 19,
              explanation: 'Bẫy giá: Khách nhớ là 340,000 nhưng giá niêm yết hiện tại là £350,000.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'The sunroom provides sufficient space for two ................ or a dining suite.',
              prefixText: 'The sunroom provides sufficient space for two',
              suffixText: 'or a dining suite.',
              answer: 'sofas',
              acceptableAnswers: ['sofas', 'sofa', 'couches'],
              evidenceQuote: '...there\'s enough room here for some plants and two sofas.',
              evidenceTimestamp: 97,
              explanation: 'Phòng đón nắng có đủ chỗ đặt 2 chiếc ghế sofa (two sofas).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'The en-suite bathroom is equipped only with a ................ unit.',
              prefixText: 'The en-suite bathroom is equipped only with a',
              suffixText: 'unit.',
              answer: 'shower',
              acceptableAnswers: ['shower', 'Shower'],
              evidenceQuote: '...though it only has a shower unit and not a big bath like the main bathroom.',
              evidenceTimestamp: 151,
              explanation: 'Phòng tắm khép kín chỉ có buồng tắm vòi sen (shower unit), không có bồn tắm lớn.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'The family bathroom has a large bathtub as well as a shower ................ .',
              prefixText: 'The family bathroom has a large bathtub as well as a shower',
              suffixText: '.',
              answer: 'fitting',
              acceptableAnswers: ['fitting', 'fittings'],
              evidenceQuote: 'It\'s got a large bath as well as a shower fitting.',
              evidenceTimestamp: 206,
              explanation: 'Phòng tắm gia đình có bồn tắm lớn kèm bộ vòi sen (shower fitting).'
            }
          ]
        },

        // ==========================================
        // DẠNG 3: MULTIPLE CHOICE (Q11 - Q14)
        // ==========================================
        {
          id: 'qg-tour-3',
          type: 'multiple_choice',
          title: 'Questions 11–14: Multiple Choice',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'What price did Mrs. Prendergast initially recall for the property?',
              options: [
                { key: 'A', text: '£340,000' },
                { key: 'B', text: '£350,000' },
                { key: 'C', text: '£345,000' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'If I remember rightly, it\'s £340,000?',
              evidenceTimestamp: 15,
              explanation: 'Bà Prendergast nhớ ban đầu là £340,000 trước khi được môi giới đính chính là £350,000.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Who will be assigned to sleep in the third (smallest) bedroom?',
              options: [
                { key: 'A', text: 'Two younger children sharing' },
                { key: 'B', text: 'Caroline\'s older daughter' },
                { key: 'C', text: 'Visiting weekend guests' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Yes, it would be fine for my older daughter.',
              evidenceTimestamp: 200,
              explanation: 'Phòng ngủ nhỏ nhất thứ 3 được dành cho con gái lớn của bà (older daughter).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'What feature borders the perimeter of the garden lawn?',
              options: [
                { key: 'A', text: 'Tall wooden security fencing' },
                { key: 'B', text: 'Flowers around the edges' },
                { key: 'C', text: 'A paved stone bicycle track' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: '...and a large lawn with flowers around the edges.',
              evidenceTimestamp: 111,
              explanation: 'Viền quanh bãi cỏ có các luống hoa (flowers around the edges).'
            },
            {
              id: 14,
              order: 14,
              questionText: 'What conclusion does Caroline reach by the end of the viewing?',
              options: [
                { key: 'A', text: 'She decides to put in a purchase offer immediately.' },
                { key: 'B', text: 'She asks to view other alternative houses in the town.' },
                { key: 'C', text: 'She postpones her decision until her husband inspects it.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Would you like to put in an offer? - Yes, please! This is the best property I\'ve seen so far.',
              evidenceTimestamp: 216,
              explanation: 'Bà quyết định đặt giá mua ngay vì đây là căn nhà ưng ý nhất từ trước tới nay.'
            }
          ]
        }
      ]
    }
  ]
};
