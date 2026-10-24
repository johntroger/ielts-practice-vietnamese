/**
 * IELTS Listening Practice: Property Enquiry & Viewing Appointment (Track 3)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track3-property-enquiry.mp3
 * 
 * Standard Cambridge IELTS Part 1 Simulation:
 * - Enquiry Form Completion (Questions 1–6)
 * - Multiple Choice & Pick Multiple (Questions 7–9)
 * - Personal Details, Telephone Numbers & Spelling (Questions 10–12)
 */

export const track3PropertyEnquiry = {
  id: 'ielts-listening-track3-property',
  title: 'IELTS Listening Practice: House Enquiry & Viewing Form (Track 3)',
  description: 'Đề thi thử IELTS Listening Part 1 chuẩn khảo thí Cambridge: Cuộc gọi tìm hiểu nhà đất tại Church Hill Road, đặt lịch hẹn xem nhà, ghi chép số điện thoại và đánh vần tên riêng.',
  totalQuestions: 12,
  timeLimitMinutes: 12,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track3-property-enquiry.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track3-property-enquiry.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Property Enquiry & Viewing Appointment',
      context: 'A telephone conversation between a prospective home buyer, Caroline Prendergast, and an estate agent, Peter Eliot, from Morgan\'s Estate Agents.',
      audioTimestampStart: 0,
      audioTimestampEnd: 174,
      speakers: [
        { name: 'Peter Eliot (Estate Agent)', gender: 'Male', accent: 'British' },
        { name: 'Caroline Prendergast (Buyer)', gender: 'Female', accent: 'American' }
      ],
      transcript: `[00:00] Track 3.
[00:07] Morgan's Estate Agents, how can I help you?
[00:09] Hello, I'm calling about a property that you have for sale in Church Hill Road.
[00:14] Sorry, did you say Church Mill Road?
[00:17] No, Church Hill Road. C-H-U-R-C-H H-I-double L.
[00:25] Oh right. We have two for sale in Church Hill Road: a three-bedroom property and a two-bedroom one. Can you tell me which one you're calling about?
[00:34] It's the three-bedroom one.
[00:36] Oh yes. Would you like to arrange a viewing?
[00:40] Yes, but first of all, I'd like to check some details.
[00:44] Certainly. What would you like to know?
[00:47] Firstly, how many lounges has it got?
[00:50] There are two. There's a small one at the front and a larger one at the back leading to a sunroom.
[00:57] A sunroom? That's nice to know.
[01:00] Yes, it's perfect to sit in on those chilly or rainy days, as it's got its own heating, and you can get to the garden through the sunroom door.
[01:09] Oh, lovely. I've always liked the idea of outdoor space with a lawn. I do a bit of gardening myself. What about the kitchen?
[01:19] It's fully fitted, so it includes a cooker and a dishwasher and all the other things you'd expect in a kitchen. You can also get to the outside space through the kitchen door.
[01:29] That sounds great! Not having to buy a cooker and dishwasher.
[01:34] Yes, it would be perfect for you. I should add that there's a garage and a short driveway.
[01:40] Oh, that's very useful. My husband usually drives to work, but I mostly use public transport.
[01:47] Well, regarding transport, it's only five minutes from Edgley station, and there are regular buses to the town centre, so it's very well connected.
[01:56] That's excellent.
[01:58] So, would you like to arrange a viewing?
[02:00] I'm free tomorrow morning. Is 11:00 okay?
[02:06] Oh no, I'm sorry, I'm busy then.
[02:09] How about 1:00 then, or 1:45?
[02:13] 1:00 would be best for me.
[02:15] Okay, great! Let's meet then. Oh, my name is Caroline Prendergast. My number is 07945 872 310.
[02:29] I'm Peter Eliot.
[02:31] Is that with two Ls?
[02:33] No, one. E-L-I-O-T. My number is 07863 905 073. That's 07863 905 073. I look forward to seeing you then.
[02:50] Okay, goodbye.
[02:51] Bye.`,
      questionGroups: [
        // ==========================================
        // DẠNG 1: FORM COMPLETION (Q1 - Q6)
        // ==========================================
        {
          id: 'qg-prop-1',
          type: 'form_completion',
          title: 'Questions 1–6: Property Details Form',
          instruction: 'Complete the form below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'MORGAN\'S ESTATE AGENTS - PROPERTY ENQUIRY',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Street name: Church ................ Road',
              prefixText: 'Street name: Church',
              suffixText: 'Road',
              answer: 'Hill',
              acceptableAnswers: ['Hill', 'hill', 'HILL'],
              evidenceQuote: 'No, Church Hill Road. C-H-U-R-C-H H-I-double L.',
              evidenceTimestamp: 17,
              explanation: 'Người gọi đính chính lại tên đường là Church Hill (đánh vần H-I-double L), không phải Church Mill.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Number of bedrooms in chosen property: ................',
              prefixText: 'Number of bedrooms in chosen property:',
              suffixText: '',
              answer: '3',
              acceptableAnswers: ['3', 'three', 'Three'],
              evidenceQuote: 'It\'s the three-bedroom one.',
              evidenceTimestamp: 34,
              explanation: 'Người mua chọn căn 3 phòng ngủ (three-bedroom).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The back lounge leads directly to a ................ .',
              prefixText: 'The back lounge leads directly to a',
              suffixText: '.',
              answer: 'sunroom',
              acceptableAnswers: ['sunroom', 'sun room', 'sun-room'],
              evidenceQuote: '...and a larger one at the back leading to a sunroom.',
              evidenceTimestamp: 55,
              explanation: 'Phòng khách phía sau dẫn vào một phòng đón nắng (sunroom).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Fitted kitchen appliances include a cooker and a ................ .',
              prefixText: 'Fitted kitchen appliances include a cooker and a',
              suffixText: '.',
              answer: 'dishwasher',
              acceptableAnswers: ['dishwasher', 'dish-washer', 'dish washer'],
              evidenceQuote: '...so it includes a cooker and a dishwasher...',
              evidenceTimestamp: 82,
              explanation: 'Nhà bếp lắp sẵn bếp nấu và máy rửa bát (dishwasher).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'The caller commutes to work mainly using ................ transport.',
              prefixText: 'The caller commutes to work mainly using',
              suffixText: 'transport.',
              answer: 'public',
              acceptableAnswers: ['public', 'Public'],
              evidenceQuote: '...but I mostly use public transport.',
              evidenceTimestamp: 104,
              explanation: 'Người phụ nữ nói bà ấy chủ yếu đi làm bằng phương tiện công cộng (public transport).'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Distance to train station: 5 minutes from ................ station.',
              prefixText: 'Distance to train station: 5 minutes from',
              suffixText: 'station.',
              answer: 'Edgley',
              acceptableAnswers: ['Edgley', 'edgley', 'Edgeley'],
              evidenceQuote: '...it\'s only five minutes from Edgley station...',
              evidenceTimestamp: 110,
              explanation: 'Ngôi nhà chỉ cách ga tàu Edgley 5 phút.'
            }
          ]
        },

        // ==========================================
        // DẠNG 2: MULTIPLE CHOICE & PICK MULTIPLE (Q7 - Q9)
        // ==========================================
        {
          id: 'qg-prop-2',
          type: 'multiple_choice',
          title: 'Question 7: Confirmed Viewing Time',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'At what time have Caroline and the agent agreed to meet tomorrow?',
              options: [
                { key: 'A', text: '11:00 AM' },
                { key: 'B', text: '1:00 PM' },
                { key: 'C', text: '1:45 PM' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: '1:00 would be best for me. - Okay, great! Let\'s meet then.',
              evidenceTimestamp: 133,
              explanation: 'Bẫy đổi giờ: Khách đề xuất 11:00 (môi giới bận), sau đó đưa ra 1:00 hoặc 1:45. Môi giới chốt 1:00 PM.'
            }
          ]
        },
        {
          id: 'qg-prop-3',
          type: 'pick_multiple',
          title: 'Questions 8–9: Pick TWO Features',
          instruction: 'Choose TWO letters, A–E.\nWhich TWO features are included with the property on Church Hill Road?',
          maxSelections: 2,
          options: [
            { key: 'A', text: 'An outdoor swimming pool' },
            { key: 'B', text: 'A private garage and driveway' },
            { key: 'C', text: 'A garden space featuring a lawn' },
            { key: 'D', text: 'Solar panels installed on the roof' },
            { key: 'E', text: 'A basement storage workshop' }
          ],
          questions: [
            {
              id: 8,
              order: 8,
              questionText: 'Select the first included feature (Letter A–E):',
              answer: 'B',
              acceptableAnswers: ['B', 'b', 'C', 'c'],
              evidenceQuote: 'I should add that there\'s a garage and a short driveway.',
              evidenceTimestamp: 96,
              explanation: 'B đúng: Có gara và lối lái xe vào nhà (garage and driveway).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Select the second included feature (Letter A–E):',
              answer: 'C',
              acceptableAnswers: ['C', 'c', 'B', 'b'],
              evidenceQuote: 'I\'ve always liked the idea of outdoor space with a lawn.',
              evidenceTimestamp: 73,
              explanation: 'C đúng: Ngôi nhà có không gian ngoài trời với bãi cỏ (lawn).'
            }
          ]
        },

        // ==========================================
        // DẠNG 3: NAMES, SPELLING & NUMBERS (Q10 - Q12)
        // ==========================================
        {
          id: 'qg-prop-4',
          type: 'short_answer',
          title: 'Questions 10–12: Contact Details & Spelling',
          instruction: 'Answer the questions below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          questions: [
            {
              id: 10,
              order: 10,
              questionText: 'What is Caroline Prendergast\'s contact telephone number?',
              answer: '07945 872 310',
              acceptableAnswers: ['07945 872 310', '07945872310', '07945 872310'],
              evidenceQuote: 'My number is 07945 872 310.',
              evidenceTimestamp: 144,
              explanation: 'Số điện thoại của Caroline là 07945 872 310.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'What is the correct spelling of the estate agent\'s surname?',
              answer: 'Eliot',
              acceptableAnswers: ['Eliot', 'eliot', 'ELIOT'],
              evidenceQuote: 'Is that with two Ls? - No, one. E-L-I-O-T.',
              evidenceTimestamp: 153,
              explanation: 'Bẫy chính tả: Tên họ Eliot chỉ có 1 chữ L (E-L-I-O-T), không phải 2 chữ L (Elliott).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'What is Peter Eliot\'s telephone number?',
              answer: '07863 905 073',
              acceptableAnswers: ['07863 905 073', '07863905073', '07863 905073'],
              evidenceQuote: 'My number is 07863 905 073.',
              evidenceTimestamp: 158,
              explanation: 'Số điện thoại của Peter Eliot là 07863 905 073.'
            }
          ]
        }
      ]
    }
  ]
};
