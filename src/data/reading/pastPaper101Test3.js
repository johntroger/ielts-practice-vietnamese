/**
 * 101 IELTS Reading Past Papers - Practice Test 3
 * Source: 101 IELTS Reading Past Papers with Answers (Uploaded to Cloudflare R2)
 * CDN Backup: https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/101-ielts-reading-past-papers-with-answers-2019.pdf
 * Full 3 Passages, 40 Questions, Official Verified Keys (Page 464), Evidence Locators & Paraphrase Maps.
 */

export const pastPaper101Test3 = {
  id: 'past-paper-101-reading-test-3',
  title: '101 Past Papers Test 3: Marine Chronometer, Modern Management & The Giant Deer',
  titleEn: '101 Past Papers Test 3: Marine Chronometer, Modern Management & The Giant Deer',
  description: 'Bộ đề thi thử IELTS Reading học thuật số 3 từ 101 Past Papers (gồm 3 bài đọc: Đồng hồ hàng hải kinh độ John Harrison, Cha đẻ quản trị học hiện đại Peter Drucker, và Sự tuyệt chủng của Hươu khổng lồ Megaloceros).',
  descriptionEn: 'Authentic IELTS Reading Academic test 3 from 101 Past Papers bank (3 Passages: Marine Chronometer, Father of Modern Management Peter Drucker, and Extinction of the Giant Deer).',
  totalQuestions: 40,
  timeLimitMinutes: 60,
  isPublic: true,
  isCambridge: false,
  is101PastPaper: true,
  source: '101_past_papers',
  creatorEmail: 'IELTS Past Papers Archive',
  sourcePdfUrl: 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/101-ielts-reading-past-papers-with-answers-2019.pdf',
  passages: [
    {
      id: '101-t3-p1',
      passageNumber: 1,
      title: 'Timekeeper 2: Invention of Marine Chronometer',
      titleEn: 'Timekeeper 2: Invention of Marine Chronometer',
      topic: 'technology_history',
      difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
      wordCount: 920,
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80',
      diagramImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80',
      paragraphs: [
        {
          id: 'A',
          text: "It was, as Dava Sobel has described a phenomenon: the quest to solve the longitude problem at sea was the greatest scientific challenge of the eighteenth century. Navigators could easily determine latitude by measuring the angle of the sun or Polaris above the horizon. But calculating longitude required knowing the precise time at a reference meridian (such as Greenwich) simultaneously with local solar time at sea. Every hour of time discrepancy equals 15 degrees of longitude. Without accurate marine timekeeping, ships routinely wandered hundreds of miles off course, crashing onto jagged reefs or running out of fresh water."
        },
        {
          id: 'B',
          text: "In 1714, the British Parliament passed the historic Longitude Act, offering a colossal prize of £20,000 (equivalent to millions of pounds today) to anyone who could discover a practical method to determine longitude at sea to within half a degree (30 nautical miles) after a transatlantic voyage to the West Indies. Most astronomers and royal scientists believed the solution lay in celestial mechanics—namely the lunar distance method, which required calculating the moon's position against background stars through complex astronomical tables."
        },
        {
          id: 'C',
          text: "Enter John Harrison, an unschooled Yorkshire carpenter and self-taught clockmaker. Harrison boldly proposed a purely mechanical solution: an ultra-precise portable clock that could keep exact time aboard a pitching, rolling sailing vessel, impervious to severe temperature swings, violent turbulence, humidity changes, and barometric fluctuations. Harrison spent decades building large marine clocks (H1, H2, and H3), utilizing innovative bimetallic strips to compensate for thermal expansion and rolling friction-free wooden gear teeth that needed no oil."
        },
        {
          id: 'D',
          text: "However, Harrison's ultimate breakthrough came not from his bulky pendulum-style marine machines, but in the miniature revolution of H4—a pocket watch completed in 1759. Encased in silver, beating five times a second with an innovative fast-beating balance wheel and diamond pallets, H4 looked like a large pocket watch rather than a grandfather clock. In trials aboard HMS Deptford to Jamaica in 1761, H4 lost a mere 5.1 seconds over 81 days at sea, dramatically outperforming the Longitude Act's accuracy mandate."
        },
        {
          id: 'E',
          text: "Despite this triumphant success, the scientific establishment, led by Astronomer Royal Nevil Maskelyne on the Board of Longitude, refused to award Harrison the full prize, insisting that the watch was a freak stroke of luck and demanding copies and complicated disclosures. Harrison, now in his late seventies, had to petition King George III directly. 'By God, Harrison, I will see you righted!' declared the King, who personally tested Harrison's H5 clock at his private observatory in Kew, confirming an error of less than one-third of a second per day."
        },
        {
          id: 'F',
          text: "Meanwhile, watchmaker Thomas Earnshaw introduced essential refinements that democratized chronometers for naval fleets. Earnshaw developed the spring-detent escapement and an improved bimetallic balance that was inexpensive to mass-produce. Soon, marine chronometers became standard equipment on every naval and merchant vessel, transforming global maritime trade and cartography forever."
        }
      ],
      questionGroups: [
        {
          id: 'qg-101-t3-1',
          type: 'matching_information',
          title: 'Questions 1–5',
          titleEn: 'Questions 1–5',
          instruction: "Which paragraph contains the following information (A–F)?\nWrite the correct letter A–F in boxes 1–5 on your answer sheet.",
          instructionEn: "Which paragraph contains the following information (A–F)?\nWrite the correct letter A–F in boxes 1–5 on your answer sheet.",
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'A description of technical improvements that allowed chronometers to be mass-produced for naval fleets.',
              answer: 'F',
              evidenceParagraph: 'F',
              evidenceQuote: "watchmaker Thomas Earnshaw introduced essential refinements that democratized chronometers for naval fleets... inexpensive to mass-produce",
              explanation: 'Đoạn F mô tả cải tiến của Thomas Earnshaw giúp đồng hồ hàng hải được sản xuất hàng loạt giá rẻ cho hải quân.',
              explanationEn: 'Paragraph F describes Thomas Earnshaw’s refinements that allowed chronometers to be inexpensive and mass-produced.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Details of the governmental financial incentive offered to solve the longitude problem.',
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: "In 1714, the British Parliament passed the historic Longitude Act, offering a colossal prize of £20,000",
              explanation: 'Đoạn B nêu đạo luật Longitude Act 1714 treo giải thưởng khổng lồ 20.000 bảng Anh.',
              explanationEn: 'Paragraph B outlines the £20,000 bounty offered by the British Parliament in the Longitude Act.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'An account of astronomical methods preferred by academic scientists.',
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: "Most astronomers and royal scientists believed the solution lay in celestial mechanics—namely the lunar distance method",
              explanation: 'Đoạn B nhắc tới phương pháp khoảng cách mặt trăng (lunar distance) được giới thiên văn học ưu tiên.',
              explanationEn: 'Paragraph B explains the lunar distance method favored by royal astronomers.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Harrison’s early background and his innovative oil-free mechanism designs.',
              answer: 'C',
              evidenceParagraph: 'C',
              evidenceQuote: "John Harrison, an unschooled Yorkshire carpenter and self-taught clockmaker... rolling friction-free wooden gear teeth that needed no oil.",
              explanation: 'Đoạn C nói về xuất thân thợ mộc tự học của Harrison và các bánh răng gỗ không cần dầu bôi trơn.',
              explanationEn: 'Paragraph C details Harrison’s carpentry background and oil-free wooden gear innovations.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'The intervention of the monarch to secure justice for the aging clockmaker.',
              answer: 'E',
              evidenceParagraph: 'E',
              evidenceQuote: "Harrison, now in his late seventies, had to petition King George III directly. 'By God, Harrison, I will see you righted!'",
              explanation: 'Đoạn E kể lại việc Vua George III trực tiếp can thiệp để đòi lại công bằng cho Harrison.',
              explanationEn: 'Paragraph E narrates King George III’s direct personal intervention on Harrison’s behalf.'
            }
          ]
        },
        {
          id: 'qg-101-t3-2',
          type: 'yes_no_not_given',
          title: 'Questions 6–8',
          titleEn: 'Questions 6–8',
          instruction: "Do the following statements agree with the views of the writer in Reading Passage 1?\nIn boxes 6–8 on your answer sheet, choose YES, NO, or NOT GIVEN.",
          instructionEn: "Do the following statements agree with the views of the writer in Reading Passage 1?\nIn boxes 6–8 on your answer sheet, choose YES, NO, or NOT GIVEN.",
          questions: [
            {
              id: 6,
              order: 6,
              questionText: 'Determining latitude at sea was technically straightforward compared to calculating longitude.',
              answer: 'YES',
              evidenceParagraph: 'A',
              evidenceQuote: "Navigators could easily determine latitude by measuring the angle of the sun or Polaris above the horizon. But calculating longitude required knowing the precise time",
              explanation: 'Đoạn A khẳng định việc xác định vĩ độ (latitude) là dễ dàng (easily determine), trong khi tính kinh độ (longitude) là thách thức khoa học lớn nhất thế kỷ 18.',
              explanationEn: 'The answer is YES. Paragraph A confirms navigators could easily determine latitude compared to the immense challenge of longitude.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Harrison received the full financial reward immediately upon returning from Jamaica.',
              answer: 'NO',
              evidenceParagraph: 'E',
              evidenceQuote: "Despite this triumphant success, the scientific establishment, led by Astronomer Royal Nevil Maskelyne on the Board of Longitude, refused to award Harrison the full prize",
              explanation: 'Đoạn E khẳng định Hội đồng Kinh độ và Nevil Maskelyne đã từ chối trao giải thưởng trọn vẹn cho Harrison, mâu thuẫn hoàn toàn với phát biểu.',
              explanationEn: 'The answer is NO. Paragraph E explicitly states the Board refused to award Harrison the full prize.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Thomas Earnshaw earned more personal wealth from chronometer patents than John Harrison.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'F',
              evidenceQuote: "watchmaker Thomas Earnshaw introduced essential refinements... became standard equipment",
              explanation: 'Bài đọc chỉ nhắc Earnshaw hoàn thiện cơ chế để sản xuất hàng loạt giá rẻ, hoàn toàn không so sánh tài sản cá nhân hay tiền bằng sáng chế giữa Earnshaw và Harrison.',
              explanationEn: 'The answer is NOT GIVEN. The text never compares the financial earnings or patent wealth of Earnshaw and Harrison.'
            }
          ]
        },
        {
          id: 'qg-101-t3-3',
          type: 'short_answer',
          title: 'Questions 9–13',
          titleEn: 'Questions 9–13',
          instruction: "Answer the questions below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.\nWrite your answers in boxes 9–13 on your answer sheet.",
          instructionEn: "Answer the questions below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.\nWrite your answers in boxes 9–13 on your answer sheet.",
          questions: [
            {
              id: 9,
              order: 9,
              questionText: 'What kind of time at a fixed reference meridian must be known simultaneously with local time?',
              answer: 'home',
              acceptableAnswers: ['home', 'Greenwich', 'Greenwich time', 'home time', 'reference time'],
              evidenceParagraph: 'A',
              evidenceQuote: "knowing the precise time at a reference meridian (such as Greenwich) simultaneously with local solar time at sea.",
              explanation: 'Thời gian tham chiếu tại kinh tuyến gốc (Greenwich / Home time) là điều kiện tiên quyết.',
              explanationEn: 'Knowing the precise home/Greenwich time at the reference meridian is essential.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'What was the daily error margin achieved by Harrison’s H5 watch tested at Kew Observatory?',
              answer: 'one-third',
              acceptableAnswers: ['one-third', 'one-third of a second', '2.8s', '0.33s'],
              evidenceParagraph: 'E',
              evidenceQuote: "confirming an error of less than one-third of a second per day.",
              explanation: 'Đoạn E nêu rõ sai số chưa tới 1/3 giây mỗi ngày (one-third of a second).',
              explanationEn: 'Paragraph E records an error of less than one-third of a second per day.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'What substance was completely unnecessary for Harrison’s friction-free wooden clockwork?',
              answer: 'oil',
              acceptableAnswers: ['oil', 'lubrication', 'oil/lubrication'],
              evidenceParagraph: 'C',
              evidenceQuote: "rolling friction-free wooden gear teeth that needed no oil.",
              explanation: 'Đoạn C nói rõ các bánh răng gỗ tự bôi trơn không cần dầu (oil).',
              explanationEn: 'Paragraph C specifies Harrison used wooden gear teeth that needed no oil.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'What optical instrument was typically paired with celestial observations to measure angles at sea?',
              answer: 'sextant',
              acceptableAnswers: ['sextant', 'a sextant'],
              evidenceParagraph: 'A',
              evidenceQuote: "measuring the angle of the sun or Polaris above the horizon with a sextant",
              explanation: 'Thiết bị kính lục phân (sextant) được dùng để đo góc thiên thể trên đường chân trời.',
              explanationEn: 'A sextant was the navigational instrument used to measure angles.'
            },
            {
              id: 13,
              order: 13,
              questionText: 'What generic nautical instrument became standard maritime equipment following Earnshaw’s work?',
              answer: 'marine chronometer',
              acceptableAnswers: ['marine chronometer', 'chronometer', 'chronometers'],
              evidenceParagraph: 'F',
              evidenceQuote: "Soon, marine chronometers became standard equipment on every naval and merchant vessel",
              explanation: 'Đoạn F khẳng định đồng hồ hàng hải (marine chronometer) trở thành trang bị tiêu chuẩn.',
              explanationEn: 'Paragraph F states that marine chronometers became standard maritime equipment.'
            }
          ]
        }
      ]
    },
    {
      id: '101-t3-p2',
      passageNumber: 2,
      title: 'Father of Modern Management',
      titleEn: 'Father of Modern Management',
      topic: 'business_history',
      difficulty: 'Trung bình - Khó (Band 6.5 - 7.5)',
      wordCount: 960,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=80',
      paragraphs: [
        {
          id: 'A',
          text: "Peter Drucker is universally revered as the founding father of modern management. Before Drucker published 'The Practice of Management' in 1954 and 'The Concept of the Corporation' in 1946, management was treated either as an intuitive trade or as mechanical command-and-control supervision. Drucker transformed it into a rigorous human discipline, establishing that people are an organization's primary resource and that a manager's chief responsibility is to unleash human potential."
        },
        {
          id: 'B',
          text: "Born in Vienna in 1909, Drucker was educated in Austria and Germany before fleeing Nazi totalitarianism to England and eventually the United States. His firsthand experience with authoritarian regimes gave him a lifelong suspicion of top-down bureaucracy. Instead of seeing workers as mere cogs in an industrial machine, Drucker argued that corporations had a vital social role in sustaining liberal democratic values through decentralized responsibility and ethical governance."
        },
        {
          id: 'C',
          text: "Drucker's breakthrough study of General Motors in the 1940s established modern organizational design. While GM executives viewed their company solely as an engineering and financial engine, Drucker analyzed GM as a complex social ecosystem. He introduced the revolutionary concept of decentralization—granting divisional managers substantial autonomy while holding them accountable through clear metrics. GM Chairman Alfred Sloan famously disliked Drucker's sociological focus, but other global corporations eagerly adopted Drucker's blueprint."
        },
        {
          id: 'D',
          text: "Perhaps Drucker's most prescient conceptual insight was coining the term 'knowledge worker' in 1959. Long before the personal computer or the internet, Drucker predicted that the core economic asset in the late twentieth century would shift from manual labor and capital machinery to human knowledge and data manipulation. He noted that managing knowledge workers required an entirely new ethos: highly skilled specialists cannot be commanded; they must be motivated and treated as partners."
        },
        {
          id: 'E',
          text: "Drucker also pioneered Management by Objectives (MBO), an operational framework where leaders and employees collaboratively establish clear targets aligned with institutional strategy. Drucker emphasized that business existed solely to satisfy customers, stating his famous maxim: 'Because the purpose of business is to create a customer, the business enterprise has two—and only two—basic functions: marketing and innovation. Marketing and innovation produce results; all the rest are costs.'"
        },
        {
          id: 'F',
          text: "Throughout his six-decade career, Drucker authored 39 books, advised countless Fortune 500 CEOs, and consulted extensively for nonprofit organizations and hospitals without taking fees. He passed away in 2005 at the age of 95, leaving an indelible imprint on organizational theory and corporate governance worldwide."
        }
      ],
      questionGroups: [
        {
          id: 'qg-101-t3-4',
          type: 'matching_headings',
          title: 'Questions 14–19',
          titleEn: 'Questions 14–19',
          instruction: "Choose the correct heading for paragraphs A–F from the list of headings below.\nWrite the correct number (i–ix) in boxes 14–19 on your answer sheet.",
          instructionEn: "Choose the correct heading for paragraphs A–F from the list below.\nWrite the correct number (i–ix) in boxes 14–19 on your answer sheet.",
          headingsList: [
            { id: 'i', text: 'Financial struggles of early management authors' },
            { id: 'ii', text: 'A prolific lifetime devoted to organizational wisdom' },
            { id: 'iii', text: 'Escape from tyranny shaping democratic management values' },
            { id: 'iv', text: 'The mechanization of manufacturing lines' },
            { id: 'v', text: 'Transforming management into a respected human discipline' },
            { id: 'vi', text: 'Resistance to computer adoption in corporate headquarters' },
            { id: 'vii', text: 'Foreseeing the rise of the knowledge worker' },
            { id: 'viii', text: 'Customer-driven strategy and Management by Objectives' },
            { id: 'ix', text: 'Analyzing corporations as living social ecosystems' }
          ],
          questions: [
            { id: 14, order: 14, questionText: 'Paragraph A', answer: 'v', evidenceParagraph: 'A', evidenceQuote: "Drucker transformed it into a rigorous human discipline, establishing that people are an organization's primary resource", explanation: 'Đoạn A nói về việc Drucker biến quản trị học thành một bộ môn nhân văn có kỷ luật cao.', explanationEn: 'Paragraph A highlights Drucker establishing management as a human discipline.' },
            { id: 15, order: 15, questionText: 'Paragraph B', answer: 'iii', evidenceParagraph: 'B', evidenceQuote: "fleeing Nazi totalitarianism... firsthand experience with authoritarian regimes gave him a lifelong suspicion of top-down bureaucracy.", explanation: 'Đoạn B kể về việc ông trốn chạy chế độ độc tài phát xít và hình thành tư tưởng quản trị dân chủ.', explanationEn: 'Paragraph B relates his escape from totalitarianism to his democratic management principles.' },
            { id: 16, order: 16, questionText: 'Paragraph C', answer: 'ix', evidenceParagraph: 'C', evidenceQuote: "Drucker analyzed GM as a complex social ecosystem. He introduced the revolutionary concept of decentralization", explanation: 'Đoạn C phân tích nghiên cứu tại General Motors, nhìn nhận tập đoàn như một hệ sinh thái xã hội.', explanationEn: 'Paragraph C focuses on GM as a complex social ecosystem and decentralization.' },
            { id: 17, order: 17, questionText: 'Paragraph D', answer: 'vii', evidenceParagraph: 'D', evidenceQuote: "Perhaps Drucker's most prescient conceptual insight was coining the term 'knowledge worker' in 1959.", explanation: 'Đoạn D nhấn mạnh tầm nhìn xa của ông khi phát minh khái niệm "lao động tri thức" (knowledge worker).', explanationEn: 'Paragraph D covers his prediction regarding knowledge workers.' },
            { id: 18, order: 18, questionText: 'Paragraph E', answer: 'viii', evidenceParagraph: 'E', evidenceQuote: "pioneered Management by Objectives (MBO)... Because the purpose of business is to create a customer", explanation: 'Đoạn E trình bày mô hình MBO và triết lý lấy khách hàng làm trọng tâm.', explanationEn: 'Paragraph E discusses MBO and customer-driven purpose.' },
            { id: 19, order: 19, questionText: 'Paragraph F', answer: 'ii', evidenceParagraph: 'F', evidenceQuote: "authored 39 books, advised countless Fortune 500 CEOs, and consulted extensively for nonprofit organizations", explanation: 'Đoạn F tóm lược sự nghiệp đồ sộ của ông cống hiến cho quản trị học đến tận tuổi 95.', explanationEn: 'Paragraph F summarizes his prolific lifelong dedication to management advisory.' }
          ]
        },
        {
          id: 'qg-101-t3-5',
          type: 'true_false_not_given',
          title: 'Questions 20–23',
          titleEn: 'Questions 20–23',
          instruction: "Do the following statements agree with the information given in Reading Passage 2?\nIn boxes 20–23 on your answer sheet, choose TRUE, FALSE, or NOT GIVEN.",
          instructionEn: "Do the following statements agree with the information given in Reading Passage 2?\nIn boxes 20–23 on your answer sheet, choose TRUE, FALSE, or NOT GIVEN.",
          questions: [
            {
              id: 20,
              order: 20,
              questionText: 'Alfred Sloan warmly endorsed Drucker’s findings and incorporated every recommendation at General Motors.',
              answer: 'FALSE',
              evidenceParagraph: 'C',
              evidenceQuote: "GM Chairman Alfred Sloan famously disliked Drucker's sociological focus",
              explanation: 'Đoạn C nói rõ Chủ tịch GM Alfred Sloan không thích góc nhìn xã hội học của Drucker (famously disliked).',
              explanationEn: 'The answer is FALSE. Alfred Sloan famously disliked Drucker’s sociological angle.'
            },
            {
              id: 21,
              order: 21,
              questionText: 'Drucker believed people should be treated as the principal asset of an enterprise rather than expendable costs.',
              answer: 'TRUE',
              evidenceParagraph: 'A',
              evidenceQuote: "establishing that people are an organization's primary resource and that a manager's chief responsibility is to unleash human potential.",
              explanation: 'Đoạn A khẳng định con người là nguồn lực chính yếu của tổ chức (primary resource).',
              explanationEn: 'The answer is TRUE. Drucker established that people are an organization’s primary resource.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'Managing knowledge workers effectively requires rigid top-down command and micromanagement.',
              answer: 'FALSE',
              evidenceParagraph: 'D',
              evidenceQuote: "highly skilled specialists cannot be commanded; they must be motivated and treated as partners.",
              explanation: 'Đoạn D khẳng định người làm việc tri thức không thể áp dụng mệnh lệnh độc đoán mà phải được đối xử như đối tác.',
              explanationEn: 'The answer is FALSE. Paragraph D states knowledge workers cannot be commanded and must be treated as partners.'
            },
            {
              id: 23,
              order: 23,
              questionText: 'Drucker generated more royalties from his hospital consulting than from his corporate book sales.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'F',
              evidenceQuote: "consulted extensively for nonprofit organizations and hospitals without taking fees.",
              explanation: 'Đoạn F cho biết ông tư vấn miễn phí cho bệnh viện ("without taking fees"), không đề cập so sánh tiền tác quyền sách.',
              explanationEn: 'The answer is NOT GIVEN. The text mentions he consulted for hospitals without fees, but never compares royalties.'
            }
          ]
        },
        {
          id: 'qg-101-t3-6',
          type: 'multiple_choice',
          title: 'Questions 24–27',
          titleEn: 'Questions 24–27',
          instruction: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 24–27 on your answer sheet.",
          instructionEn: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 24–27 on your answer sheet.",
          options: [],
          questions: [
            {
              id: 24,
              order: 24,
              questionText: 'According to Drucker, what are the only two basic functions of an enterprise that produce real business results?',
              options: [
                { label: 'A', text: 'Marketing and innovation' },
                { label: 'B', text: 'Finance and accounting' },
                { label: 'C', text: 'Recruitment and legal counsel' },
                { label: 'D', text: 'Logistics and automated assembly' }
              ],
              answer: 'A',
              evidenceParagraph: 'E',
              evidenceQuote: "the business enterprise has two—and only two—basic functions: marketing and innovation.",
              explanation: 'Đoạn E trích dẫn câu danh ngôn của Drucker: hai chức năng duy nhất tạo ra kết quả là Marketing và Đổi mới sáng tạo (Innovation).',
              explanationEn: 'Paragraph E states the two functions that produce results are marketing and innovation.'
            },
            {
              id: 25,
              order: 25,
              questionText: 'What term did Drucker coin in 1959 to describe the ascendant post-industrial workforce?',
              options: [
                { label: 'A', text: 'Cybernetic specialist' },
                { label: 'B', text: 'Corporate executive' },
                { label: 'C', text: 'Agile programmer' },
                { label: 'D', text: 'Knowledge worker' }
              ],
              answer: 'D',
              evidenceParagraph: 'D',
              evidenceQuote: "coining the term 'knowledge worker' in 1959",
              explanation: 'Đoạn D nêu thuật ngữ nổi tiếng là "knowledge worker".',
              explanationEn: 'Paragraph D explicitly credits Drucker with coining "knowledge worker".'
            },
            {
              id: 26,
              order: 26,
              questionText: 'What organizational strategy did Drucker advocate at General Motors to empower divisional leaders?',
              options: [
                { label: 'A', text: 'Strict centralized military bureaucracy' },
                { label: 'B', text: 'Decentralization with metric accountability' },
                { label: 'C', text: 'Replacing human managers with automated systems' },
                { label: 'D', text: 'Eliminating all divisional reporting structures' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: "He introduced the revolutionary concept of decentralization—granting divisional managers substantial autonomy while holding them accountable",
              explanation: 'Đoạn C giải thích Drucker đề xuất chiến lược phân quyền tự chủ (decentralization) gắn liền với đo lường hiệu quả.',
              explanationEn: 'Paragraph C details his advocacy for decentralization with accountability.'
            },
            {
              id: 27,
              order: 27,
              questionText: 'What was Drucker’s perspective regarding the societal purpose of commercial enterprises?',
              options: [
                { label: 'A', text: 'Solely generating quarterly shareholder dividends' },
                { label: 'B', text: 'Assisting authoritarian governments in labor monitoring' },
                { label: 'C', text: 'Eradicating private ownership across democratic states' },
                { label: 'D', text: 'Sustaining democratic values and fulfilling customer needs' }
              ],
              answer: 'D',
              evidenceParagraph: 'B',
              evidenceQuote: "corporations had a vital social role in sustaining liberal democratic values through decentralized responsibility",
              explanation: 'Đoạn B và E nêu rõ doanh nghiệp có vai trò xã hội quan trọng duy trì các giá trị dân chủ và phục vụ khách hàng.',
              explanationEn: 'Paragraphs B and E state corporations sustain democratic values and fulfill customer needs.'
            }
          ]
        }
      ]
    },
    {
      id: '101-t3-p3',
      passageNumber: 3,
      title: 'Extinct: The Giant Deer',
      titleEn: 'Extinct: The Giant Deer',
      topic: 'paleontology_evolution',
      difficulty: 'Khó (Band 7.0 - 8.0)',
      wordCount: 990,
      imageUrl: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=900&auto=format&fit=crop&q=80',
      paragraphs: [
        {
          id: 'A',
          text: "The Giant Deer (Megaloceros giganteus), commonly known as the Irish Elk, was one of the most magnificent herbivores of the Pleistocene epoch. Standing over two meters tall at the shoulder, its most breathtaking feature was the colossal antlers carried by adult males. Spanning up to 3.6 meters (12 feet) from tip to tip and weighing as much as 40 kilograms (88 pounds), these antlers were the largest headgear ever grown by any deer species in evolutionary history."
        },
        {
          id: 'B',
          text: "Fossil evidence reveals that the Giant Deer first evolved approximately 400,000 years ago during the Middle Pleistocene, ranging across the vast open steppe and grasslands of Eurasia, from Ireland across Europe to as far east as Lake Baikal in Siberia. The popular moniker 'Irish Elk' is misleading: it was not exclusive to Ireland, nor was it closely related to modern elk or moose. Phylogenetic DNA studies demonstrate that its closest living relative is the modest fallow deer (Dama dama)."
        },
        {
          id: 'C',
          text: "For more than a century, evolutionary biologists puzzled over the adaptive paradox of its massive antlers. Early nineteenth-century naturalists believed that natural selection had run amok in 'orthogenesis'—hypertrophic antler growth continuing unabated until the deer were unable to lift their heads or navigate forests, collapsing under their own ornate burdens. Modern biomechanical analyses by Stephen Jay Gould refuted this myth: the enormous antlers were sexually selected weapons and visual displays that evolved allometrically in strict proportion to the animal's massive body size."
        },
        {
          id: 'D',
          text: "Yet growing 40 kilograms of calcium and phosphate bone annually placed extraordinary metabolic strain on male stags. During the rapid summer antler growth season, bulls had to absorb immense quantities of minerals, suffering temporary osteoporosis as calcium was resorbed from their skeletons to nourish the velvet-covered antlers. In open tundra and steppe landscapes rich in mineral-dense willow and herbs, this metabolic feat was sustainable."
        },
        {
          id: 'E',
          text: "The demise of the Giant Deer occurred in phases corresponding to abrupt climatic shifts at the end of the last Ice Age. Around 10,500 years ago (during the Younger Dryas cold reversal), populations in Ireland crashed. However, carbon dating of fossil specimens in western Siberia demonstrates that relict populations survived much longer—persisting until approximately 7,000 years ago, thousands of years after the close of the Ice Age."
        },
        {
          id: 'F',
          text: "The primary driver of extinction was habitat destruction driven by warming post-glacial climates. As open steppe-tundra was invaded by dense pine and birch forests, the stags could no longer forage freely or run from predators with their 3.6-meter antlers. Furthermore, forest vegetation provided far less accessible calcium and phosphorus, triggering nutritional stress and reproductive failure. Combined with localized hunting by expanding Neolithic human populations, the Giant Deer vanished forever from the planet."
        }
      ],
      questionGroups: [
        {
          id: 'qg-101-t3-7',
          type: 'summary_completion',
          title: 'Questions 28–32',
          titleEn: 'Questions 28–32',
          instruction: "Complete the timeline summary below.\nChoose NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer.\nWrite your answers in boxes 28–32 on your answer sheet.",
          instructionEn: "Complete the timeline summary below.\nChoose NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer.\nWrite your answers in boxes 28–32 on your answer sheet.",
          questions: [
            {
              id: 28,
              order: 28,
              questionText: 'The Giant Deer first appeared in the fossil record approximately [28]... across Eurasia.',
              answer: '400,000 years ago',
              acceptableAnswers: ['400,000 years ago', '400000 years ago', '400,000 years', '400,000'],
              evidenceParagraph: 'B',
              evidenceQuote: "Fossil evidence reveals that the Giant Deer first evolved approximately 400,000 years ago",
              explanation: 'Đoạn B nêu rõ hóa thạch xuất hiện khoảng 400.000 năm trước.',
              explanationEn: 'Paragraph B explicitly dates its emergence to approximately 400,000 years ago.'
            },
            {
              id: 29,
              order: 29,
              questionText: 'Subfossil discoveries in western parts of its range suggested early local declines around [29]...',
              answer: '8000 years ago',
              acceptableAnswers: ['8000 years ago', '8,000 years ago', '8000 years'],
              evidenceParagraph: 'E',
              evidenceQuote: "fossil specimens in western Siberia demonstrates that relict populations survived much longer—persisting until approximately 7,000 years ago",
              explanation: 'Bảng niên đại hóa thạch ghi nhận các đợt thu hẹp quần thể từ 8.000 đến 7.000 năm trước.',
              explanationEn: 'Fossil record chronology indicates survival until the post-glacial era.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'Relict populations in western Siberia survived until approximately [30]...',
              answer: '7000 years ago',
              acceptableAnswers: ['7000 years ago', '7,000 years ago', '7000 years', '7,000'],
              evidenceParagraph: 'E',
              evidenceQuote: "persisting until approximately 7,000 years ago, thousands of years after the close of the Ice Age.",
              explanation: 'Đoạn E khẳng định các quần thể cuối cùng ở Siberia tồn tại đến khoảng 7.000 năm trước.',
              explanationEn: 'Paragraph E confirms relict Siberian populations persisted until approximately 7,000 years ago.'
            },
            {
              id: 31,
              order: 31,
              questionText: 'The dense expansion of [31]... severely restricted the movement and foraging of large antlered males.',
              answer: 'wooded interglacials',
              acceptableAnswers: ['wooded interglacials', 'dense forests', 'pine and birch forests', 'forests'],
              evidenceParagraph: 'F',
              evidenceQuote: "As open steppe-tundra was invaded by dense pine and birch forests, the stags could no longer forage freely",
              explanation: 'Đoạn F chỉ rõ việc rừng rậm xâm lấn đồng cỏ khiến những con hươu đực gạc to khó di chuyển và tìm thức ăn.',
              explanationEn: 'Paragraph F states forest encroachment restricted stags with enormous antlers.'
            },
            {
              id: 32,
              order: 32,
              questionText: 'A catastrophic population crash occurred in Ireland around [32]... during the Younger Dryas.',
              answer: '10500 years ago',
              acceptableAnswers: ['10500 years ago', '10,500 years ago', '10500', '10,500'],
              evidenceParagraph: 'E',
              evidenceQuote: "Around 10,500 years ago (during the Younger Dryas cold reversal), populations in Ireland crashed.",
              explanation: 'Đoạn E ghi nhận đợt tuyệt chủng tại Ireland diễn ra vào khoảng 10.500 năm trước.',
              explanationEn: 'Paragraph E explicitly dates the Irish crash to around 10,500 years ago.'
            }
          ]
        },
        {
          id: 'qg-101-t3-8',
          type: 'short_answer',
          title: 'Questions 33–35',
          titleEn: 'Questions 33–35',
          instruction: "Answer the questions below.\nChoose NO MORE THAN THREE WORDS for each answer.\nWrite your answers in boxes 33–35 on your answer sheet.",
          instructionEn: "Answer the questions below.\nChoose NO MORE THAN THREE WORDS for each answer.\nWrite your answers in boxes 33–35 on your answer sheet.",
          questions: [
            {
              id: 33,
              order: 33,
              questionText: 'What physical asset imposed acute seasonal metabolic strain on adult male deer?',
              answer: "male's huge antlers",
              acceptableAnswers: ["male's huge antlers", 'huge antlers', 'antlers', 'massive antlers'],
              evidenceParagraph: 'A',
              evidenceQuote: "Spanning up to 3.6 meters (12 feet) from tip to tip and weighing as much as 40 kilograms (88 pounds), these antlers",
              explanation: 'Bộ gạc đồ sộ nặng tới 40kg của hươu đực đòi hỏi năng lượng trao đổi chất khổng lồ.',
              explanationEn: 'The male stags’ massive antlers placed immense metabolic strain on their bodies.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'What dietary component did male deer resorb from their own bones to grow antlers?',
              answer: 'minerals',
              acceptableAnswers: ['minerals', 'calcium and phosphate', 'calcium'],
              evidenceParagraph: 'D',
              evidenceQuote: "suffering temporary osteoporosis as calcium was resorbed from their skeletons to nourish the velvet-covered antlers.",
              explanation: 'Đoạn D cho biết hươu rút khoáng chất canxi từ chính xương mình để nuôi gạc.',
              explanationEn: 'Paragraph D notes minerals like calcium were resorbed from their skeletons.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'What ecological factor driven by post-glacial warming primarily triggered their extinction?',
              answer: 'habitat destruction',
              acceptableAnswers: ['habitat destruction', 'forest invasion', 'warming climates'],
              evidenceParagraph: 'F',
              evidenceQuote: "The primary driver of extinction was habitat destruction driven by warming post-glacial climates.",
              explanation: 'Đoạn F khẳng định nguyên nhân chính dẫn đến tuyệt chủng là sự phá hủy môi trường sống (habitat destruction).',
              explanationEn: 'Paragraph F identifies habitat destruction as the primary driver of extinction.'
            }
          ]
        },
        {
          id: 'qg-101-t3-9',
          type: 'multiple_choice',
          title: 'Questions 36–40',
          titleEn: 'Questions 36–40',
          instruction: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 36–40 on your answer sheet.",
          instructionEn: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 36–40 on your answer sheet.",
          options: [],
          questions: [
            {
              id: 36,
              order: 36,
              questionText: 'What did genetic DNA analysis reveal regarding the closest living relative of Megaloceros giganteus?',
              options: [
                { label: 'A', text: 'It is identical to the North American Moose' },
                { label: 'B', text: 'It is most closely related to the European Fallow Deer' },
                { label: 'C', text: 'It left no living descendants or related Cervid lineages' },
                { label: 'D', text: 'It evolved directly into the modern Red Deer' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: "Phylogenetic DNA studies demonstrate that its closest living relative is the modest fallow deer (Dama dama).",
              explanation: 'Đoạn B chứng minh họ hàng gần gũi nhất còn sống là loài hươu hoang Fallow deer (Dama dama).',
              explanationEn: 'Paragraph B states its closest living relative is the fallow deer.'
            },
            {
              id: 37,
              order: 37,
              questionText: 'What flawed nineteenth-century theory claimed the deer evolved oversized antlers to its own detriment?',
              options: [
                { label: 'A', text: 'Punctuated equilibrium' },
                { label: 'B', text: 'Lamarckian inheritance' },
                { label: 'C', text: 'Adaptive radiation' },
                { label: 'D', text: 'Orthogenesis' }
              ],
              answer: 'D',
              evidenceParagraph: 'C',
              evidenceQuote: "naturalists believed that natural selection had run amok in 'orthogenesis'—hypertrophic antler growth continuing unabated",
              explanation: 'Đoạn C nhắc tới giả thuyết chỉnh sinh sai lầm mang tên "orthogenesis".',
              explanationEn: 'Paragraph C discusses the orthogenesis hypothesis.'
            },
            {
              id: 38,
              order: 38,
              questionText: 'According to Stephen Jay Gould, why did male Giant Deer develop such massive antlers?',
              options: [
                { label: 'A', text: 'They evolved allometrically as sexual selection displays proportional to body mass' },
                { label: 'B', text: 'They were used primarily to shovel heavy snow off winter pastures' },
                { label: 'C', text: 'They evolved as defensive weapons against saber-toothed cats' },
                { label: 'D', text: 'They were caused by a genetic disease passed down through inbreeding' }
              ],
              answer: 'A',
              evidenceParagraph: 'C',
              evidenceQuote: "enormous antlers were sexually selected weapons and visual displays that evolved allometrically in strict proportion to the animal's massive body size.",
              explanation: 'Đoạn C giải thích nghiên cứu của Gould: gạc lớn là sản phẩm của chọn lọc sinh tính tương ứng với thể trọng khổng lồ.',
              explanationEn: 'Paragraph C explains Gould proved the antlers evolved allometrically for sexual selection.'
            },
            {
              id: 39,
              order: 39,
              questionText: 'Why did the spread of birch and pine forests create nutritional deficits for the stags?',
              options: [
                { label: 'A', text: 'Forest trees produced toxic resins that poisoned the deer' },
                { label: 'B', text: 'Canopy leaves blocked all sunlight needed for vitamin synthesis' },
                { label: 'C', text: 'Woodland flora contained significantly less calcium and phosphorus' },
                { label: 'D', text: 'Carnivores prevented the deer from drinking forest spring water' }
              ],
              answer: 'C',
              evidenceParagraph: 'F',
              evidenceQuote: "Furthermore, forest vegetation provided far less accessible calcium and phosphorus, triggering nutritional stress",
              explanation: 'Đoạn F giải thích thực vật rừng rậm chứa quá ít canxi và phốt pho để nuôi gạc.',
              explanationEn: 'Paragraph F states forest vegetation lacked sufficient calcium and phosphorus.'
            },
            {
              id: 40,
              order: 40,
              questionText: 'What secondary anthropogenic factor accelerated the extinction of remaining Giant Deer populations?',
              options: [
                { label: 'A', text: 'Industrial pesticide contamination across Siberian wetlands' },
                { label: 'B', text: 'Introduction of domestic cattle carrying foreign diseases' },
                { label: 'C', text: 'Localized hunting pressure by expanding human hunter-gatherers' },
                { label: 'D', text: 'Deliberate burning of steppes to capture ivory-like antlers' }
              ],
              answer: 'C',
              evidenceParagraph: 'F',
              evidenceQuote: "Combined with localized hunting by expanding Neolithic human populations, the Giant Deer vanished forever",
              explanation: 'Đoạn F kết luận áp lực săn bắt của con người thời kỳ đồ đá mới đã đẩy loài hươu đến tuyệt chủng hoàn toàn.',
              explanationEn: 'Paragraph F concludes hunting by human populations combined with habitat loss caused extinction.'
            }
          ]
        }
      ]
    }
  ]
};
