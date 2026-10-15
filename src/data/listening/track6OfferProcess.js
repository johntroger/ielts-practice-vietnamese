/**
 * IELTS Listening Practice: Property Offer, Finance & Sale Conveyancing (Track 6)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track6-offer-and-sale-process.mp3
 * 
 * Standard Cambridge IELTS Part 1 & 2 Simulation:
 * - Application Form Completion (Prendergast, Lanchester, Postcode KE7 8UD, Phone) (Questions 1–6)
 * - Financial Terms & Conveyancing Process (Mortgage, Deposit, Roof, Timeline) (Questions 7–10)
 * - Multiple Choice (Family Chain, Relatives, School Deadline, Survey) (Questions 11–14)
 */

export const track6OfferProcess = {
  id: 'ielts-listening-track6-offer',
  title: 'IELTS Listening Practice: House Purchase Offer & Legal Conveyancing (Track 6)',
  description: 'Bộ luyện thi IELTS Listening Part 1 & 2 nâng cao: Điền thông tin cá nhân (đánh vần họ Prendergast, đường Lanchester, mã bưu điện KE7 8UD), cơ cấu tài chính (vay thế chấp, tiền đặt cọc 15%), quy trình thẩm định ngân hàng và bẫy ưu tiên chuyển nhà trước kỳ khai giảng.',
  totalQuestions: 14,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track6-offer-and-sale-process.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track6-offer-and-sale-process.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Formal Purchase Offer & Conveyancing Registration',
      context: 'Peter Elliot records Caroline Prendergast\'s contact details, formal purchase offer, mortgage arrangements, and explains the steps leading to completion.',
      audioTimestampStart: 0,
      audioTimestampEnd: 256,
      speakers: [
        { name: 'Peter Elliot (Estate Agent)', gender: 'Male', accent: 'British' },
        { name: 'Caroline Prendergast (Buyer)', gender: 'Female', accent: 'American' }
      ],
      transcript: `[00:00] Track 6.
[00:02] So, Mrs. Prendergast, let me take your details. I'll just enter your name. How do you spell it?
[00:09] P-R-E-N-D-E-R-G-A-S-T.
[00:17] Okay, that's it. And what's your present address?
[00:22] 52 Lanchester Road, that's L-A-N-C-H-E-S-T-E-R. It's in the riverside part of town. The postcode is KE7 8UD.
[00:41] And your home phone number?
[00:43] 01594 398 210.
[00:50] And I've got your mobile number: 07945 872 310.
[00:58] Yes, that's right.
[01:00] Okay. Now the house is on the market for £350,000, but I know that the owners would be happy to accept a close offer as it's been on for a few months. What would your first offer be?
[01:13] I think £340,000 would be fair.
[01:18] Okay, I'll put that offer to them and we'll see what they say. Now, usually buyers have a mortgage arranged with a bank - a loan to buy the house - so that we can quickly complete the sale. Do you have one arranged yet?
[01:33] We've spoken to our bank, and they're happy to offer us what we need, up to £300,000. We also have a 15% deposit in our bank account, about £52,000, so that won't be a problem.
[01:51] And is anyone buying your house? Will the sellers of this property need to wait for you to sell yours?
[01:58] No, we sold it a couple of months ago and we're staying with relatives, so we're ready to move in as soon as the sale is completed.
[02:07] So, when do you think you can get an answer on the offer?
[02:11] I should be able to get one tomorrow. Then, if they agree, we can do things quite quickly. Your bank will do the survey - you know, send someone to check the house is in good condition and at the right price - and if that's okay, we can then prepare the contracts for you and the seller to sign.
[02:31] How long do you think the sale will take after that?
[02:34] Well, it's difficult to say. If things go well, we should complete it in about two months at the most. Most sales take about two months. However, if there are any problems, it could take longer, but we hope it won't be more than three months. For example, part of the house, like the roof, might be in bad condition and might need some work, or there might be plans for a new road in the local area. Anything like that can delay the sale, but most of our sales go through quickly.
[03:06] Oh, I hope nothing like that happens. We're really looking forward to moving in soon. It's not easy living a long time with relatives, and my husband has a long journey to get to work. But those aren't the things I'm really worried about. If we can move in before the end of the summer, it'll be much easier for the children to go to their new school. That's why I hope we can complete everything on time.
[03:34] Don't worry. I don't see any problems with this sale, so I'm quite sure you'll be in the house by then. So, just to go over things again: I'll talk to the sellers tomorrow. If they accept your offer, then we can continue. If they don't, you'll need to put in a higher one quickly, but we should be able to agree by the end of the week. Then you ask your bank to send someone to check the house. If that's all okay, the next step is to prepare the contracts for you and the seller to sign, and we should complete the sale soon after that.
[04:08] Wonderful. I look forward to your call tomorrow. Bye!
[04:13] Bye.`,
      questionGroups: [
        // ==========================================
        // DẠNG 1: FORM COMPLETION (Q1 - Q6)
        // ==========================================
        {
          id: 'qg-offer-1',
          type: 'form_completion',
          title: 'Questions 1–6: Buyer Registration Form',
          instruction: 'Complete the form below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'PURCHASE OFFER & REGISTRATION RECORD',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Buyer\'s surname: ................',
              prefixText: 'Buyer\'s surname:',
              suffixText: '',
              answer: 'Prendergast',
              acceptableAnswers: ['Prendergast', 'prendergast', 'PRENDERGAST'],
              evidenceQuote: 'How do you spell it? - P-R-E-N-D-E-R-G-A-S-T.',
              evidenceTimestamp: 9,
              explanation: 'Người mua đánh vần họ của mình là P-R-E-N-D-E-R-G-A-S-T.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Street address: 52 ................ Road',
              prefixText: 'Street address: 52',
              suffixText: 'Road',
              answer: 'Lanchester',
              acceptableAnswers: ['Lanchester', 'lanchester', 'LANCHESTER'],
              evidenceQuote: '52 Lanchester Road, that\'s L-A-N-C-H-E-S-T-E-R.',
              evidenceTimestamp: 22,
              explanation: 'Tên đường hiện tại là Lanchester (đánh vần L-A-N-C-H-E-S-T-E-R).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Town district: in the ................ part of town',
              prefixText: 'Town district: in the',
              suffixText: 'part of town',
              answer: 'riverside',
              acceptableAnswers: ['riverside', 'Riverside'],
              evidenceQuote: 'It\'s in the riverside part of town.',
              evidenceTimestamp: 33,
              explanation: 'Khu vực bà đang sống nằm ven sông (riverside).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Current postcode: ................',
              prefixText: 'Current postcode:',
              suffixText: '',
              answer: 'KE7 8UD',
              acceptableAnswers: ['KE7 8UD', 'ke7 8ud', 'KE78UD'],
              evidenceQuote: 'The postcode is KE7 8UD.',
              evidenceTimestamp: 37,
              explanation: 'Mã bưu điện chuẩn là KE7 8UD.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Home landline telephone number: ................',
              prefixText: 'Home landline telephone number:',
              suffixText: '',
              answer: '01594 398 210',
              acceptableAnswers: ['01594 398 210', '01594398210', '01594 398210'],
              evidenceQuote: '01594 398 210.',
              evidenceTimestamp: 43,
              explanation: 'Số điện thoại cố định tại nhà là 01594 398 210.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'First formal purchase offer submitted: £ ................',
              prefixText: 'First formal purchase offer submitted: £',
              suffixText: '',
              answer: '340,000',
              acceptableAnswers: ['340,000', '340000', '340 000'],
              evidenceQuote: 'I think £340,000 would be fair.',
              evidenceTimestamp: 73,
              explanation: 'Mức giá đề xuất đầu tiên là £340,000.'
            }
          ]
        },

        // ==========================================
        // DẠNG 2: FLOW-CHART / NOTE COMPLETION (Q7 - Q10)
        // ==========================================
        {
          id: 'qg-offer-2',
          type: 'note_completion',
          title: 'Questions 7–10: Financing & Conveyancing Milestones',
          instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          headerTitle: 'TRANSACTION SCHEDULE & FINANCING',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Maximum mortgage loan pre-approved by bank: £ ................',
              prefixText: 'Maximum mortgage loan pre-approved by bank: £',
              suffixText: '',
              answer: '300,000',
              acceptableAnswers: ['300,000', '300000', '300 000'],
              evidenceQuote: '...they\'re happy to offer us what we need, up to £300,000.',
              evidenceTimestamp: 98,
              explanation: 'Ngân hàng đồng ý cho vay tối đa £300,000.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Cash deposit available in account: ................ % (approx. £52,000)',
              prefixText: 'Cash deposit available in account:',
              suffixText: '% (approx. £52,000)',
              answer: '15',
              acceptableAnswers: ['15', 'fifteen', '15%'],
              evidenceQuote: 'We also have a 15% deposit in our bank account, about £52,000...',
              evidenceTimestamp: 103,
              explanation: 'Tiền đặt cọc có sẵn là 15% (khoảng 52,000 bảng).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Expected duration of transaction without complications: approximately ................',
              prefixText: 'Expected duration of transaction without complications: approximately',
              suffixText: '',
              answer: 'two months',
              acceptableAnswers: ['two months', '2 months', '2 month'],
              evidenceQuote: 'If things go well, we should complete it in about two months at the most.',
              evidenceTimestamp: 157,
              explanation: 'Nếu suôn sẻ, hợp đồng mua bán sẽ hoàn tất trong khoảng 2 tháng (two months).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'A potential structural defect that could delay the sale: poor condition of the ................',
              prefixText: 'A potential structural defect that could delay the sale: poor condition of the',
              suffixText: '',
              answer: 'roof',
              acceptableAnswers: ['roof', 'the roof'],
              evidenceQuote: 'For example, part of the house, like the roof, might be in bad condition...',
              evidenceTimestamp: 172,
              explanation: 'Mái nhà (roof) nếu bị hư hỏng sẽ làm chậm tiến độ giao dịch.'
            }
          ]
        },

        // ==========================================
        // DẠNG 3: MULTIPLE CHOICE (Q11 - Q14)
        // ==========================================
        {
          id: 'qg-offer-3',
          type: 'multiple_choice',
          title: 'Questions 11–14: Multiple Choice',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'Where is the Prendergast family currently accommodating while looking for a home?',
              options: [
                { key: 'A', text: 'In their old house waiting for final settlement' },
                { key: 'B', text: 'Staying temporarily with relatives' },
                { key: 'C', text: 'In a short-term rented city apartment' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'No, we sold it a couple of months ago and we\'re staying with relatives...',
              evidenceTimestamp: 120,
              explanation: 'Gia đình đã bán nhà cũ và hiện đang ở nhờ nhà người thân (staying with relatives).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'What is Caroline\'s primary reason for wanting to move in before the summer ends?',
              options: [
                { key: 'A', text: 'Her husband dislikes the long commute to his workplace.' },
                { key: 'B', text: 'To ensure a smooth transition for her children entering their new school.' },
                { key: 'C', text: 'Living with relatives has become too stressful and crowded.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'If we can move in before the end of the summer, it\'ll be much easier for the children to go to their new school.',
              evidenceTimestamp: 204,
              explanation: 'Bẫy thông tin ưu tiên: Bà nhắc đến việc đi làm xa và ở nhờ, nhưng nhấn mạnh lý do lớn nhất là con cái nhập học trường mới.'
            },
            {
              id: 13,
              order: 13,
              questionText: 'What mandatory inspection will the buyer\'s mortgage bank conduct?',
              options: [
                { key: 'A', text: 'A property survey to assess physical condition and true valuation' },
                { key: 'B', text: 'A personal credit and financial background audit of the seller' },
                { key: 'C', text: 'An environmental assessment of traffic emissions on Church Hill Road' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Your bank will do the survey - you know, send someone to check the house is in good condition and at the right price...',
              evidenceTimestamp: 138,
              explanation: 'Ngân hàng cử chuyên viên đi giám định (survey) tình trạng nhà và định giá tài sản.'
            },
            {
              id: 14,
              order: 14,
              questionText: 'If the sellers reject the £340,000 offer tomorrow, what is the agreed next step?',
              options: [
                { key: 'A', text: 'Caroline will cancel the purchase process.' },
                { key: 'B', text: 'Caroline will submit a higher offer promptly to conclude by week\'s end.' },
                { key: 'C', text: 'The agent will request the bank to renegotiate the valuation.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'If they don\'t, you\'ll need to put in a higher one quickly, but we should be able to agree by the end of the week.',
              evidenceTimestamp: 230,
              explanation: 'Nếu người bán từ chối, Caroline sẽ nhanh chóng nâng giá đề xuất để chốt hợp đồng trước cuối tuần.'
            }
          ]
        }
      ]
    }
  ]
};
