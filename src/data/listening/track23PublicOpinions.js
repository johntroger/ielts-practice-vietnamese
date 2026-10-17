/**
 * IELTS Listening Practice: Public Policies & Community Opinions (Track 23)
 * Audio hosted on Cloudflare R2:
 * https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track23-public-policies-and-opinions.mp3
 * 
 * Standard Cambridge IELTS Section 1 & 3 Simulation:
 * - Part 1: Multiple Choice on Public News & Community Attitudes (Questions 1–6)
 * - Part 2: Notes & Sentence Completion on Policy Proposals (Questions 7–10)
 */

export const track23PublicOpinions = {
  id: 'ielts-listening-track23-public-opinions',
  title: 'IELTS Listening Practice: Public Policies & Community Opinions (Track 23)',
  titleEn: 'IELTS Listening Practice: Public Policies & Community Opinions (Track 23)',
  titleVi: 'Luyện đề IELTS Listening: Chính sách công & Thảo luận xã hội (Track 23)',
  description: 'Authentic Cambridge IELTS Listening practice across 6 everyday public conversations: tax increases in the government budget, off-peak bus fare reductions, air traffic controller strikes, complimentary dental checks for seniors over 60, high-profile sports transfer valuations, and overseas medical recruitment.',
  descriptionEn: 'Authentic Cambridge IELTS Listening practice across 6 everyday public conversations: tax increases in the government budget, off-peak bus fare reductions, air traffic controller strikes, complimentary dental checks for seniors over 60, high-profile sports transfer valuations, and overseas medical recruitment.',
  descriptionVi: 'Bộ luyện thi IELTS Listening Section 1 & 3 thực chiến qua 6 đoạn hội thoại đời sống & chính sách: tăng thuế ngân sách, giảm giá vé xe buýt sau 10h sáng, đình công kiểm soát không lưu, khám răng miễn phí cho người trên 60 tuổi, phí chuyển nhượng cầu thủ bóng đá 40 triệu bảng, và tuyển dụng nhân viên y tế từ nước ngoài.',
  totalQuestions: 10,
  timeLimitMinutes: 15,
  isPublic: true,
  isCambridge: false,
  source: 'cloudflare_r2',
  audioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track23-public-policies-and-opinions.mp3',
  fallbackAudioUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track23-public-policies-and-opinions.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Public Affairs & Social Policy Dialogues',
      titleEn: 'Part 1: Public Affairs & Social Policy Dialogues',
      titleVi: 'Phần 1: Các đoạn hội thoại về vấn đề xã hội & chính sách công',
      context: 'Listen to 6 short conversations discussing current news items, public policies, and community viewpoints.',
      audioTimestampStart: 0,
      audioTimestampEnd: 114,
      speakers: [
        { name: 'Speaker A', gender: 'Male/Female', accent: 'British' },
        { name: 'Speaker B', gender: 'Male/Female', accent: 'British' }
      ],
      transcript: `[00:00] Track 23.
[00:02] Conversation 1.
[00:04] It looks like the government is going to raise taxes in the budget tomorrow.
[00:08] Seriously? I really don't see how that could be a good idea. It'll reduce spending and affect the economy without a doubt.

[00:18] Conversation 2.
[00:20] They just said on the local news that the bus companies are planning to reduce fares for travel after 10:00 to get more people to come into town.
[00:29] That certainly sounds like it would work well. It would definitely help shops and businesses, as well as the local attractions.

[00:38] Conversation 3.
[00:40] Oh no, not again. The air traffic controllers are going on strike. That will cause massive delays at the airports and ruin a lot of travel plans.
[00:50] Well, to be honest, I'm not really worried. I'm traveling by train for my holiday.

[00:57] Conversation 4.
[00:59] It says here in today's paper that the government is going to offer free dental checks to people over 60.
[01:06] I'm all for that. Anything that helps people take care of their teeth has to be a good thing.

[01:14] Conversation 5.
[01:16] There's a report in the sports section that says Athletic are going to buy that Brazilian striker Reginaldo for 40 million pounds.
[01:25] That much? I can't seriously believe that. I really don't think he's as good as the experts say he is.

[01:34] Conversation 6.
[01:36] The government is going to bring more doctors and medical staff from abroad to fill vacancies. Maybe they should try to find more here.
[01:44] It's all the same to me. As long as they're qualified and speak good English, it shouldn't matter where they're from.`,
      questionGroups: [
        {
          id: 'qg-t23-mc',
          type: 'multiple_choice',
          title: 'Questions 1–6: Listening for Attitudes & Policy Details',
          instruction: 'Choose the correct letter, A, B, or C.',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'What negative economic effect does the woman predict if taxes are raised?',
              options: [
                { id: 'A', text: 'It will significantly curb consumer expenditure and harm economic growth.', textEn: 'It will significantly curb consumer expenditure and harm economic growth.', textVi: 'Làm giảm chi tiêu tiêu dùng và gây ảnh hưởng tiêu cực tới nền kinh tế.' },
                { id: 'B', text: 'It will cause immediate widespread unemployment in public services.', textEn: 'It will cause immediate widespread unemployment in public services.', textVi: 'Gây ra tình trạng thất nghiệp lan rộng ngay lập tức trong dịch vụ công.' },
                { id: 'C', text: 'It will force the central government to borrow heavily from abroad.', textEn: 'It will force the central government to borrow heavily from abroad.', textVi: 'Buộc chính phủ phải vay nợ nặng từ nước ngoài.' }
              ],
              correctAnswer: 'A',
              answer: 'A',
              evidenceQuote: "It'll reduce spending and affect the economy without a doubt.",
              evidenceTimestamp: 13,
              explanation: 'Người phụ nữ khẳng định chắc chắn rằng việc tăng thuế sẽ giảm chi tiêu ("reduce spending") và tác động tiêu cực đến nền kinh tế ("affect the economy without a doubt").',
              explanationEn: 'The woman states with certainty that raising taxes will "reduce spending and affect the economy without a doubt", supporting Option A.',
              explanationVi: 'Người phụ nữ khẳng định chắc chắn rằng việc tăng thuế sẽ giảm chi tiêu ("reduce spending") và tác động tiêu cực đến nền kinh tế ("affect the economy without a doubt").'
            },
            {
              id: 2,
              order: 2,
              questionText: 'According to the news report in Conversation 2, when will discounted bus fares apply?',
              options: [
                { id: 'A', text: 'During early morning rush hours before 08:00.', textEn: 'During early morning rush hours before 08:00.', textVi: 'Trong khung giờ cao điểm buổi sáng trước 08:00.' },
                { id: 'B', text: 'For off-peak travel commencing after 10:00.', textEn: 'For off-peak travel commencing after 10:00.', textVi: 'Cho các chuyến đi ngoài giờ cao điểm bắt đầu sau 10:00.' },
                { id: 'C', text: 'Only on weekend evenings throughout the summer.', textEn: 'Only on weekend evenings throughout the summer.', textVi: 'Chỉ áp dụng vào các buổi tối cuối tuần trong mùa hè.' }
              ],
              correctAnswer: 'B',
              answer: 'B',
              evidenceQuote: 'the bus companies are planning to reduce fares for travel after 10:00',
              evidenceTimestamp: 24,
              explanation: 'Bản tin địa phương thông báo các hãng xe buýt dự định giảm giá vé cho các chuyến đi sau 10 giờ ("after 10:00").',
              explanationEn: 'The speaker explicitly mentions that bus companies plan to "reduce fares for travel after 10:00", making Option B correct.',
              explanationVi: 'Bản tin địa phương thông báo các hãng xe buýt dự định giảm giá vé cho các chuyến đi sau 10 giờ ("after 10:00").'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Why is the woman unconcerned about the air traffic controllers\' industrial action?',
              options: [
                { id: 'A', text: 'Her flight has already been rescheduled to an alternate airport.', textEn: 'Her flight has already been rescheduled to an alternate airport.', textVi: 'Chuyến bay của cô đã được đổi lịch sang sân bay thay thế.' },
                { id: 'B', text: 'She is taking the train for her holiday travel.', textEn: 'She is taking the train for her holiday travel.', textVi: 'Cô ấy đi nghỉ bằng tàu hỏa thay vì máy bay.' },
                { id: 'C', text: 'The strike action has been officially declared unlawful.', textEn: 'The strike action has been officially declared unlawful.', textVi: 'Cuộc đình công đã chính thức bị tuyên bố là trái luật.' }
              ],
              correctAnswer: 'B',
              answer: 'B',
              evidenceQuote: "I'm not really worried. I'm traveling by train for my holiday.",
              evidenceTimestamp: 51,
              explanation: 'Người phụ nữ không lo lắng vì kỳ nghỉ này cô di chuyển bằng tàu hỏa ("I\'m traveling by train for my holiday").',
              explanationEn: 'The woman explains she is not worried because she is "traveling by train for my holiday", which aligns with Option B.',
              explanationVi: 'Người phụ nữ không lo lắng vì kỳ nghỉ này cô di chuyển bằng tàu hỏa ("I\'m traveling by train for my holiday").'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Which demographic group is entitled to the free dental checks mentioned in Conversation 4?',
              options: [
                { id: 'A', text: 'Schoolchildren under the age of 16.', textEn: 'Schoolchildren under the age of 16.', textVi: 'Học sinh phổ thông dưới 16 tuổi.' },
                { id: 'B', text: 'Senior citizens aged 60 and above.', textEn: 'Senior citizens aged 60 and above.', textVi: 'Người cao tuổi từ 60 tuổi trở lên.' },
                { id: 'C', text: 'Low-income full-time university students.', textEn: 'Low-income full-time university students.', textVi: 'Sinh viên đại học chính quy có thu nhập thấp.' }
              ],
              correctAnswer: 'B',
              answer: 'B',
              evidenceQuote: 'the government is going to offer free dental checks to people over 60',
              evidenceTimestamp: 63,
              explanation: 'Báo nêu rõ chính phủ sẽ cung cấp dịch vụ khám răng miễn phí cho người trên 60 tuổi ("people over 60").',
              explanationEn: 'The prompt specifies that the policy offers free dental checks to "people over 60", which corresponds to Option B.',
              explanationVi: 'Báo nêu rõ chính phủ sẽ cung cấp dịch vụ khám răng miễn phí cho người trên 60 tuổi ("people over 60").'
            },
            {
              id: 5,
              order: 5,
              questionText: 'What is the man\'s view regarding the £40 million transfer bid for striker Reginaldo?',
              options: [
                { id: 'A', text: 'He believes the player does not live up to the high praise of football experts.', textEn: 'He believes the player does not live up to the high praise of football experts.', textVi: 'Anh ấy cho rằng cầu thủ này không xuất sắc như lời ca ngợi của các chuyên gia.' },
                { id: 'B', text: 'He thinks Athletic cannot afford to finance such an expensive contract.', textEn: 'He thinks Athletic cannot afford to finance such an expensive contract.', textVi: 'Anh ấy nghĩ câu lạc bộ Athletic không đủ khả năng tài chính để chi trả.' },
                { id: 'C', text: 'He is confident that Reginaldo will guarantee a championship title.', textEn: 'He is confident that Reginaldo will guarantee a championship title.', textVi: 'Anh ấy tự tin rằng Reginaldo sẽ bảo đảm chức vô địch.' }
              ],
              correctAnswer: 'A',
              answer: 'A',
              evidenceQuote: "I really don't think he's as good as the experts say he is.",
              evidenceTimestamp: 129,
              explanation: 'Người đàn ông hoài nghi giá chuyển nhượng 40 triệu bảng và nhận định cầu thủ không giỏi như các chuyên gia khen ngợi ("I really don\'t think he\'s as good as the experts say he is").',
              explanationEn: 'The man expresses skepticism, noting: "I really don\'t think he\'s as good as the experts say he is", pointing directly to Option A.',
              explanationVi: 'Người đàn ông hoài nghi giá chuyển nhượng 40 triệu bảng và nhận định cầu thủ không giỏi như các chuyên gia khen ngợi ("I really don\'t think he\'s as good as the experts say he is").'
            },
            {
              id: 6,
              order: 6,
              questionText: 'What condition does the woman consider essential for overseas medical practitioners in Conversation 6?',
              options: [
                { id: 'A', text: 'They must possess recognized qualifications and speak fluent English.', textEn: 'They must possess recognized qualifications and speak fluent English.', textVi: 'Họ phải có bằng cấp chuyên môn đạt chuẩn và nói tiếng Anh tốt.' },
                { id: 'B', text: 'They must have completed at least five years of residency locally.', textEn: 'They must have completed at least five years of residency locally.', textVi: 'Họ phải hoàn thành ít nhất 5 năm nội trú tại địa phương.' },
                { id: 'C', text: 'They must commit to working exclusively in rural community clinics.', textEn: 'They must commit to working exclusively in rural community clinics.', textVi: 'Họ phải cam kết chỉ làm việc tại các trạm y tế nông thôn.' }
              ],
              correctAnswer: 'A',
              answer: 'A',
              evidenceQuote: "As long as they're qualified and speak good English, it shouldn't matter where they're from.",
              evidenceTimestamp: 147,
              explanation: 'Người phụ nữ cho rằng nguồn gốc xuất thân không quan trọng, miễn là họ có chuyên môn (qualified) và nói tiếng Anh tốt ("speak good English").',
              explanationEn: 'The woman states: "As long as they\'re qualified and speak good English, it shouldn\'t matter where they\'re from", which confirms Option A.',
              explanationVi: 'Người phụ nữ cho rằng nguồn gốc xuất thân không quan trọng, miễn là họ có chuyên môn (qualified) và nói tiếng Anh tốt ("speak good English").'
            }
          ]
        },
        {
          id: 'qg-t23-notes',
          type: 'form_completion',
          title: 'Questions 7–10: Policy & Public News Summary Notes',
          instruction: 'Complete the sentences below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'The man in Conversation 2 anticipates that cheaper bus fares will benefit retail shops and ................ .',
              prefixText: 'The man in Conversation 2 anticipates that cheaper bus fares will benefit retail shops and',
              suffixText: '.',
              answer: 'businesses',
              acceptableAnswers: ['businesses', 'local businesses'],
              evidenceQuote: 'It would definitely help shops and businesses',
              evidenceTimestamp: 33,
              explanation: 'Người đàn ông khẳng định việc giảm giá vé xe buýt sẽ giúp ích cho các cửa hàng và doanh nghiệp ("shops and businesses").',
              explanationEn: 'The recording confirms that lower fares "would definitely help shops and businesses".',
              explanationVi: 'Người đàn ông khẳng định việc giảm giá vé xe buýt sẽ giúp ích cho các cửa hàng và doanh nghiệp ("shops and businesses").'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Industrial action by air traffic controllers is forecast to trigger widespread ................ at major airports.',
              prefixText: 'Industrial action by air traffic controllers is forecast to trigger widespread',
              suffixText: 'at major airports.',
              answer: 'delays',
              acceptableAnswers: ['delays', 'massive delays'],
              evidenceQuote: 'That will cause massive delays at the airports',
              evidenceTimestamp: 46,
              explanation: 'Đoạn băng nêu rõ cuộc đình công sẽ gây ra sự chậm trễ nghiêm trọng ("massive delays") tại các sân bay.',
              explanationEn: 'The speaker states that the industrial action "will cause massive delays at the airports".',
              explanationVi: 'Đoạn băng nêu rõ cuộc đình công sẽ gây ra sự chậm trễ nghiêm trọng ("massive delays") tại các sân bay.'
            },
            {
              id: 9,
              order: 9,
              questionText: 'The proposed transfer fee for Brazilian striker Reginaldo stands at ................ million pounds.',
              prefixText: 'The proposed transfer fee for Brazilian striker Reginaldo stands at',
              suffixText: 'million pounds.',
              answer: '40',
              acceptableAnswers: ['40', 'forty', '40 million', 'forty million'],
              evidenceQuote: 'buy that Brazilian striker Reginaldo for 40 million pounds',
              evidenceTimestamp: 122,
              explanation: 'Số tiền chuyển nhượng được đề cập rõ ràng là 40 triệu bảng ("40 million pounds").',
              explanationEn: 'The reported transfer fee is explicitly stated as "40" million pounds.',
              explanationVi: 'Số tiền chuyển nhượng được đề cập rõ ràng là 40 triệu bảng ("40 million pounds").'
            },
            {
              id: 10,
              order: 10,
              questionText: 'The government aims to recruit overseas healthcare specialists to resolve critical staffing ................ .',
              prefixText: 'The government aims to recruit overseas healthcare specialists to resolve critical staffing',
              suffixText: '.',
              answer: 'vacancies',
              acceptableAnswers: ['vacancies', 'vacancy'],
              evidenceQuote: 'bring more doctors and medical staff from abroad to fill vacancies',
              evidenceTimestamp: 140,
              explanation: 'Mục đích tuyển dụng bác sĩ và nhân viên y tế từ nước ngoài là để lấp đầy các vị trí còn trống ("fill vacancies").',
              explanationEn: 'The stated reason for overseas recruitment is to "fill vacancies" in medical facilities.',
              explanationVi: 'Mục đích tuyển dụng bác sĩ và nhân viên y tế từ nước ngoài là để lấp đầy các vị trí còn trống ("fill vacancies").'
            }
          ]
        }
      ]
    }
  ]
};
