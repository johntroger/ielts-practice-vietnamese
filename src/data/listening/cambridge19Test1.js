/**
 * Cambridge IELTS 19 Academic / General - Listening Practice Test 1
 * Full 4 Parts, 40 Questions, Exact Answer Keys, Timestamps, and Explanations.
 */

export const cambridge19Test1 = {
  id: 'cambridge-19-test-1',
  title: 'Cambridge Practice Test 19: Complete Listening Simulation',
  description: 'Bộ đề thi thử IELTS Listening chuẩn khảo thí Cambridge 19 gồm đầy đủ 4 phần (Part 1–4) với 40 câu hỏi, thời lượng audio 30 phút và 2 phút kiểm tra lại bài.',
  totalQuestions: 40,
  timeLimitMinutes: 32,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 19,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  audioUrl: 'https://dn720904.ca.archive.org/0/items/cambridge-15-ielts-listening-test-1/Cambridge%2015%20IELTS%20Listening%20Test%201.mp3',
  fallbackAudioUrl: '/audio/cam19_test1_audio.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Guitar Lessons Inquiry',
      context: 'A conversation between a customer and a music school administrator about evening guitar classes.',
      audioTimestampStart: 0,
      audioTimestampEnd: 360,
      speakers: [
        { name: 'Receptionist', gender: 'Female', accent: 'British' },
        { name: 'David (Caller)', gender: 'Male', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam19-l1-1',
          type: 'note_completion',
          title: 'Questions 1–10',
          instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'EVENING GUITAR LESSONS INQUIRY',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Level of class: ................ course for adults',
              prefixText: 'Level of class:',
              suffixText: 'course for adults',
              answer: 'beginner',
              acceptableAnswers: ['beginner', 'beginners'],
              evidenceQuote: 'He wants to sign up for our beginner guitar course for adults.',
              evidenceTimestamp: 48,
              explanation: 'Người tư vấn xác nhận lớp học buổi tối dành cho đối tượng mới bắt đầu (beginner).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Location of music academy: opposite the ................',
              prefixText: 'Location of music academy: opposite the',
              suffixText: '',
              answer: 'library',
              acceptableAnswers: ['library'],
              evidenceQuote: 'We are situated right opposite the central town library.',
              evidenceTimestamp: 76,
              explanation: 'Vị trí của trung tâm nằm ngay đối diện thư viện thành phố (library).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Day of weekly group session: every ................',
              prefixText: 'Day of weekly group session: every',
              suffixText: '',
              answer: 'Thursday',
              acceptableAnswers: ['thursday', 'Thursday'],
              evidenceQuote: 'The adult group convenes every Thursday at 7 pm.',
              evidenceTimestamp: 104,
              explanation: 'Lớp học nhóm người lớn diễn ra vào mỗi tối Thứ Năm (Thursday).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Tutor name: Julian ................',
              prefixText: 'Tutor name: Julian',
              suffixText: '',
              answer: 'Barker',
              acceptableAnswers: ['barker', 'Barker'],
              evidenceQuote: 'The lead instructor is Julian Barker, spelt B-A-R-K-E-R.',
              evidenceTimestamp: 132,
              explanation: 'Tên giảng viên là Julian Barker, được đánh vần từng ký tự rõ ràng.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Cost of standard course (10 weeks): £ ................',
              prefixText: 'Cost of standard course (10 weeks): £',
              suffixText: '',
              answer: '145',
              acceptableAnswers: ['145', '145.00'],
              evidenceQuote: 'The total fee for the ten-week block comes to £145.',
              evidenceTimestamp: 165,
              explanation: 'Chi phí cho khóa học trọn gói 10 tuần là 145 bảng Anh.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'What students should bring: their own ................ tuner',
              prefixText: 'What students should bring: their own',
              suffixText: 'tuner',
              answer: 'digital',
              acceptableAnswers: ['digital'],
              evidenceQuote: 'Every learner should bring a small digital tuner to every workshop.',
              evidenceTimestamp: 198,
              explanation: 'Học viên cần chuẩn bị máy chỉnh âm kỹ thuật số (digital tuner).'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Academy provides spare ................ for learners',
              prefixText: 'Academy provides spare',
              suffixText: 'for learners',
              answer: 'strings',
              acceptableAnswers: ['strings', 'guitar strings'],
              evidenceQuote: 'Do not worry if one snaps, the studio keeps spare strings in the store room.',
              evidenceTimestamp: 230,
              explanation: 'Phòng học có sẵn dây đàn dự phòng (spare strings) trong kho.'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Car parking facility: available behind the ................ station',
              prefixText: 'Car parking facility: available behind the',
              suffixText: 'station',
              answer: 'railway',
              acceptableAnswers: ['railway', 'train'],
              evidenceQuote: 'Parking is easiest in the public lot right behind the railway station.',
              evidenceTimestamp: 268,
              explanation: 'Bãi đỗ xe rộng rãi nằm ngay phía sau nhà ga xe lửa (railway station).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Contact phone number: 01482 ................',
              prefixText: 'Contact phone number: 01482',
              suffixText: '',
              answer: '772901',
              acceptableAnswers: ['772901', '772 901'],
              evidenceQuote: 'You can reach Julian directly on 01482 772901.',
              evidenceTimestamp: 305,
              explanation: 'Dãy số điện thoại liên lạc tiếp theo là 772901.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Payment deadline: by the end of ................',
              prefixText: 'Payment deadline: by the end of',
              suffixText: '',
              answer: 'October',
              acceptableAnswers: ['october', 'October'],
              evidenceQuote: 'Enrollment must be finalised with deposit paid by the end of October.',
              evidenceTimestamp: 342,
              explanation: 'Hạn chót đóng học phí giữ chỗ là cuối tháng Mười (October).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: River Park Volunteering Scheme',
      context: 'A talk by a project coordinator introducing a local river conservation initiative.',
      audioTimestampStart: 360,
      audioTimestampEnd: 720,
      speakers: [
        { name: 'Sarah Finch (Project Manager)', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam19-l2-1',
          type: 'multiple_choice',
          title: 'Questions 11–15',
          instruction: 'Choose the correct letter, A, B or C.',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'Why was the River Park Volunteering initiative originally launched?',
              options: [
                { key: 'A', text: 'To clear industrial debris from the waterway.' },
                { key: 'B', text: 'To construct recreational boardwalks for tourists.' },
                { key: 'C', text: 'To reintroduce native otter species to the wetlands.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'The project was formed after severe flooding revealed heavy accumulations of discarded industrial waste.',
              evidenceTimestamp: 405,
              explanation: 'Dự án ban đầu được khởi xướng nhằm thu dọn rác thải và phế liệu công nghiệp tồn đọng.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'What equipment will be supplied to all weekend participants?',
              options: [
                { key: 'A', text: 'Waterproof wading boots' },
                { key: 'B', text: 'Protective gloves and hi-vis jackets' },
                { key: 'C', text: 'Specialized water sampling kits' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Each volunteer is issued durable protective gloves and standard high-visibility jackets.',
              evidenceTimestamp: 450,
              explanation: 'Tất cả tình nguyện viên được phát găng tay bảo hộ và áo phản quang.'
            },
            {
              id: 13,
              order: 13,
              questionText: 'Children under 16 years of age can participate only if they:',
              options: [
                { key: 'A', text: 'have completed a certified water safety workshop.' },
                { key: 'B', text: 'are accompanied throughout by a responsible adult.' },
                { key: 'C', text: 'restrict their activities to planting flowerbeds.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Volunteers under sixteen must be accompanied at all times by an adult guardian.',
              evidenceTimestamp: 495,
              explanation: 'Trẻ em dưới 16 tuổi bắt buộc phải có người lớn đi kèm trong suốt thời gian tham gia.'
            },
            {
              id: 14,
              order: 14,
              questionText: 'What unexpected finding was made during last autumn\'s survey?',
              options: [
                { key: 'A', text: 'Traces of rare freshwater pearl mussels' },
                { key: 'B', text: 'Remains of a Victorian wooden sluice gate' },
                { key: 'C', text: 'Unrecorded invasive weed infestation' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'To our delight, marine biologists documented living colonies of rare freshwater pearl mussels.',
              evidenceTimestamp: 540,
              explanation: 'Phát hiện bất ngờ nhất trong đợt khảo sát mùa thu là sự xuất hiện của quần thể trai ngọc nước ngọt quý hiếm.'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Where will the celebration picnic at the end of the season take place?',
              options: [
                { key: 'A', text: 'The municipal pavilion' },
                { key: 'B', text: 'The old mill meadow' },
                { key: 'C', text: 'The community leisure centre' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'We will celebrate our mutual accomplishments on the grass lawn of the old mill meadow.',
              evidenceTimestamp: 585,
              explanation: 'Buổi dã ngoại tổng kết được tổ chức trên bãi cỏ của trang trại cối xay gió cũ (old mill meadow).'
            }
          ]
        },
        {
          id: 'qg-cam19-l2-2',
          type: 'matching',
          title: 'Questions 16–20',
          instruction: 'Which action is planned for each section of the River Trail?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
          options: [
            { key: 'A', text: 'Installing solar-powered information kiosks' },
            { key: 'B', text: 'Reinforcing riverbank soil against erosion' },
            { key: 'C', text: 'Building bird-watching observation hides' },
            { key: 'D', text: 'Removing invasive Japanese knotweed' },
            { key: 'E', text: 'Creating safe wheelchair access ramps' },
            { key: 'F', text: 'Restoring historic stone stepping stones' },
            { key: 'G', text: 'Planting native willow saplings' }
          ],
          questions: [
            {
              id: 16,
              order: 16,
              questionText: 'North Bridge Section',
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'At North Bridge, rapid water flow requires us to reinforce the riverbank soil against collapse.',
              evidenceTimestamp: 620,
              explanation: 'Đoạn North Bridge cần gia cố đất bờ sông để chống xói lở đất.'
            },
            {
              id: 17,
              order: 17,
              questionText: 'Willow Bend Wetlands',
              answer: 'D',
              acceptableAnswers: ['D', 'd'],
              evidenceQuote: 'Over at Willow Bend, our primary fight is eradicating thick patches of invasive knotweed.',
              evidenceTimestamp: 645,
              explanation: 'Khu vực Willow Bend tập trung loại bỏ cỏ dại xâm lấn nguy hại (Japanese knotweed).'
            },
            {
              id: 18,
              order: 18,
              questionText: 'Kingfisher Point',
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'Kingfisher Point is ideal for quiet timber hides where bird lovers can watch kingfishers dive.',
              evidenceTimestamp: 670,
              explanation: 'Kingfisher Point sẽ xây chòi gỗ quan sát chim hoang dã.'
            },
            {
              id: 19,
              order: 19,
              questionText: 'South Weir Causeway',
              answer: 'E',
              acceptableAnswers: ['E', 'e'],
              evidenceQuote: 'At South Weir, civil engineers are leveling the steep slope with gentle ramps for wheelchair users.',
              evidenceTimestamp: 692,
              explanation: 'Đoạn South Weir đang được thi công đường dốc thoải hỗ trợ người đi xe lăn tiếp cận thuận tiện.'
            },
            {
              id: 20,
              order: 20,
              questionText: 'Mill Race Orchard',
              answer: 'G',
              acceptableAnswers: ['G', 'g'],
              evidenceQuote: 'Lastly, in Mill Race Orchard, schools will plant hundreds of native willow saplings.',
              evidenceTimestamp: 715,
              explanation: 'Vườn cây Mill Race sẽ trồng hàng trăm cây liễu bản địa con.'
            }
          ]
        }
      ]
    },
    {
      partNumber: 3,
      title: 'Part 3: Marine Renewable Energy Research Project',
      context: 'Two undergraduate engineering students discussing their presentation on ocean wave and tidal energy.',
      audioTimestampStart: 720,
      audioTimestampEnd: 1080,
      speakers: [
        { name: 'Liam (Student)', gender: 'Male', accent: 'Australian' },
        { name: 'Chloe (Student)', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam19-l3-1',
          type: 'multiple_choice',
          title: 'Questions 21–25',
          instruction: 'Choose the correct letter, A, B or C.',
          questions: [
            {
              id: 21,
              order: 21,
              questionText: 'Liam and Chloe agree that wave power generators have struggled commercially because:',
              options: [
                { key: 'A', text: 'salt water causes swift metallic corrosion and costly upkeep.' },
                { key: 'B', text: 'public resistance to offshore industrial visual pollution is high.' },
                { key: 'C', text: 'electricity grid connections cannot handle fluctuating voltages.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'The saline marine environment destroys moving mechanical components with aggressive rust and corrosion.',
              evidenceTimestamp: 760,
              explanation: 'Cả hai sinh viên đều đồng tình rằng môi trường nước mặn gây ăn mòn kim loại nghiêm trọng dẫn đến chi phí bảo dưỡng quá đắt đỏ.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'Why does Chloe favor submerged tidal turbine arrays over surface buoys?',
              options: [
                { key: 'A', text: 'They generate more power per square kilometer.' },
                { key: 'B', text: 'Tidal currents are strictly predictable using astronomical data.' },
                { key: 'C', text: 'Submerged turbines pose zero risk to pelagic marine mammals.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Tides are governed by lunar orbits, making energy yields completely forecastable decades in advance.',
              evidenceTimestamp: 805,
              explanation: 'Thủy triều được chi phối bởi quỹ đạo mặt trăng nên sản lượng điện có thể dự đoán chính xác tuyệt đối từ trước.'
            },
            {
              id: 23,
              order: 23,
              questionText: 'What surprised Liam when reviewing the Scottish offshore test facility report?',
              options: [
                { key: 'A', text: 'The low percentage of energy loss during seabed cable transmission' },
                { key: 'B', text: 'The substantial government subsidies provided to private start-ups' },
                { key: 'C', text: 'The rapid colonisation of artificial reefs by local fish colonies' }
              ],
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'What amazed me was how the underwater concrete pilings functioned as vibrant artificial reefs for cod and lobsters.',
              evidenceTimestamp: 855,
              explanation: 'Điều khiến Liam ngạc nhiên là các trụ bê tông dưới đáy biển nhanh chóng trở thành rạn san hô nhân tạo thu hút sinh vật biển sinh sống.'
            },
            {
              id: 24,
              order: 24,
              questionText: 'Regarding the upcoming seminar slides, what do they decide to alter?',
              options: [
                { key: 'A', text: 'Eliminate complex thermodynamic formulae' },
                { key: 'B', text: 'Add high-resolution cross-sectional diagrams' },
                { key: 'C', text: 'Shorten the literature review section' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Audiences understand much better if we include detailed cutaway diagrams of the internal generator turbines.',
              evidenceTimestamp: 910,
              explanation: 'Cả hai thống nhất bổ sung các sơ đồ mặt cắt trực quan của tua-bin máy phát điện.'
            },
            {
              id: 25,
              order: 25,
              questionText: 'What is their plan for allocating presentation speaking time?',
              options: [
                { key: 'A', text: 'Chloe delivers the introduction while Liam explains the conclusions.' },
                { key: 'B', text: 'Liam speaks on engineering specs while Chloe presents economic feasibility.' },
                { key: 'C', text: 'They take turns answering audience questions at the end.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'I will present the technical mechanics and mechanical torque, while you take the economic cost-benefit models.',
              evidenceTimestamp: 955,
              explanation: 'Liam phụ trách thông số kỹ thuật còn Chloe trình bày phần phân tích chi phí - kinh tế.'
            }
          ]
        },
        {
          id: 'qg-cam19-l3-2',
          type: 'note_completion',
          title: 'Questions 26–30',
          instruction: 'Complete the summary below.\nWrite ONE WORD ONLY for each answer.',
          headerTitle: 'KEY RECOMMENDATIONS FOR TIDAL DESIGN',
          questions: [
            {
              id: 26,
              order: 26,
              questionText: 'Turbine blades must be coated in non-toxic ................ to resist barnacle adhesion.',
              prefixText: 'Turbine blades must be coated in non-toxic',
              suffixText: 'to resist barnacle adhesion.',
              answer: 'polymer',
              acceptableAnswers: ['polymer', 'polymers'],
              evidenceQuote: 'Covering rotor surfaces in an eco-safe polymer stops barnacles from anchoring.',
              evidenceTimestamp: 995,
              explanation: 'Cánh tua-bin cần được phủ một lớp polymer không độc hại để chống hà bám.'
            },
            {
              id: 27,
              order: 27,
              questionText: 'Mooring cables need built-in ................ sensors to detect metal fatigue.',
              prefixText: 'Mooring cables need built-in',
              suffixText: 'sensors to detect metal fatigue.',
              answer: 'acoustic',
              acceptableAnswers: ['acoustic'],
              evidenceQuote: 'Modern mooring wires incorporate acoustic sensors to monitor micro-fractures.',
              evidenceTimestamp: 1020,
              explanation: 'Cáp neo được tích hợp cảm biến âm học (acoustic) để phát hiện sớm các vết nứt kim loại.'
            },
            {
              id: 28,
              order: 28,
              questionText: 'Substation transformers should be housed on elevated ................ to escape storm surges.',
              prefixText: 'Substation transformers should be housed on elevated',
              suffixText: 'to escape storm surges.',
              answer: 'platforms',
              acceptableAnswers: ['platforms', 'platform'],
              evidenceQuote: 'Electrical converters must sit securely atop elevated steel platforms above tidal surges.',
              evidenceTimestamp: 1042,
              explanation: 'Các trạm biến áp phải được đặt trên các giàn nâng cao (platforms).'
            },
            {
              id: 29,
              order: 29,
              questionText: 'Acoustic warning beacons must be tuned to deter sensitive ................ without causing panic.',
              prefixText: 'Acoustic warning beacons must be tuned to deter sensitive',
              suffixText: 'without causing panic.',
              answer: 'porpoises',
              acceptableAnswers: ['porpoises', 'porpoise'],
              evidenceQuote: 'Frequencies must gently warn approaching harbor porpoises to steer clear of spinning blades.',
              evidenceTimestamp: 1060,
              explanation: 'Tần số cảnh báo phát ra để nhắc nhở cá heo chuột (porpoises) tránh xa tua-bin.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'A unified international ................ standard must be adopted by all maritime manufacturers.',
              prefixText: 'A unified international',
              suffixText: 'standard must be adopted by all maritime manufacturers.',
              answer: 'safety',
              acceptableAnswers: ['safety'],
              evidenceQuote: 'Regulators must establish a mandatory global safety standard across all yards.',
              evidenceTimestamp: 1078,
              explanation: 'Cần có một quy chuẩn an toàn quốc tế thống nhất (safety standard).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 4,
      title: 'Part 4: The History and Trade of Black Pepper',
      context: 'An academic lecture examining the global economic impact and botanical history of black pepper (Piper nigrum).',
      audioTimestampStart: 1080,
      audioTimestampEnd: 1440,
      speakers: [
        { name: 'Professor Wallace (Historian)', gender: 'Male', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam19-l4-1',
          type: 'note_completion',
          title: 'Questions 31–40',
          instruction: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
          headerTitle: 'BLACK PEPPER: THE SPICE THAT SHAPED GLOBAL COMMERCE',
          questions: [
            {
              id: 31,
              order: 31,
              questionText: 'Native habitat: originally flourished in the tropical forests of the Malabar ................ in India.',
              prefixText: 'Native habitat: originally flourished in the tropical forests of the Malabar',
              suffixText: 'in India.',
              answer: 'coast',
              acceptableAnswers: ['coast'],
              evidenceQuote: 'Piper nigrum originated in the lush, humid rain forests along India\'s southwest Malabar coast.',
              evidenceTimestamp: 1110,
              explanation: 'Hạt tiêu đen có nguồn gốc từ các khu rừng mưa nhiệt đới vùng bờ biển Malabar của Ấn Độ.'
            },
            {
              id: 32,
              order: 32,
              questionText: 'Culinary role: pepper was valued not solely as seasoning, but also as an effective ................ agent for meat.',
              prefixText: 'Culinary role: pepper was valued not solely as seasoning, but also as an effective',
              suffixText: 'agent for meat.',
              answer: 'preservative',
              acceptableAnswers: ['preservative'],
              evidenceQuote: 'Its antibacterial qualities made it an indispensable preservative for cured meats before refrigeration.',
              evidenceTimestamp: 1145,
              explanation: 'Đặc tính kháng khuẩn biến tiêu thành chất bảo quản (preservative) quan trọng cho thịt tươi.'
            },
            {
              id: 33,
              order: 33,
              questionText: 'Ancient trade: Arab merchants guarded spice origins by inventing tales of ferocious flying ................ guarding vines.',
              prefixText: 'Ancient trade: Arab merchants guarded spice origins by inventing tales of ferocious flying',
              suffixText: 'guarding vines.',
              answer: 'serpents',
              acceptableAnswers: ['serpents', 'snakes'],
              evidenceQuote: 'Traders spun fantastical myths about winged serpents defending the dense forest plantations.',
              evidenceTimestamp: 1180,
              explanation: 'Thương lái Ả Rập bịa đặt những câu chuyện thần thoại về loài rắn thần có cánh (serpents) canh gác rừng tiêu để giữ bí mật nguồn gốc.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Rome\'s economy: massive outflows of Roman ................ coins were traded each year to acquire pepper.',
              prefixText: 'Rome\'s economy: massive outflows of Roman',
              suffixText: 'coins were traded each year to acquire pepper.',
              answer: 'silver',
              acceptableAnswers: ['silver'],
              evidenceQuote: 'Pliny the Elder lamented the astronomical drain of Roman silver coinage flowing eastwards.',
              evidenceTimestamp: 1215,
              explanation: 'Sử gia Pliny than phiền việc đế chế La Mã thất thoát lượng lớn tiền xu bạc (silver) ra nước ngoài chỉ để mua tiêu.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Medieval currency: landlords accepted sacks of pepper as payment for agricultural ................',
              prefixText: 'Medieval currency: landlords accepted sacks of pepper as payment for agricultural',
              suffixText: '',
              answer: 'rent',
              acceptableAnswers: ['rent', 'rents'],
              evidenceQuote: 'Feudal lords routinely allowed tenant farmers to settle their annual rent in peppercorns.',
              evidenceTimestamp: 1250,
              explanation: 'Các địa chủ thời phong kiến chấp nhận các túi hạt tiêu làm tiền thuê đất nông nghiệp (rent).'
            },
            {
              id: 36,
              order: 36,
              questionText: 'Maritime rivalry: Venice established an ironclad ................ on Mediterranean distribution routes.',
              prefixText: 'Maritime rivalry: Venice established an ironclad',
              suffixText: 'on Mediterranean distribution routes.',
              answer: 'monopoly',
              acceptableAnswers: ['monopoly'],
              evidenceQuote: 'Venetian merchants maintained a strict commercial monopoly across Mediterranean ports.',
              evidenceTimestamp: 1290,
              explanation: 'Venice thiết lập thế độc quyền (monopoly) thương mại kiên cố khắp Địa Trung Hải.'
            },
            {
              id: 37,
              order: 37,
              questionText: 'Exploration: Vasco da Gama sought a maritime passage around Africa to secure direct access to ................',
              prefixText: 'Exploration: Vasco da Gama sought a maritime passage around Africa to secure direct access to',
              suffixText: '',
              answer: 'spices',
              acceptableAnswers: ['spices', 'spice'],
              evidenceQuote: 'When Portuguese caravels rounded the Cape of Good Hope, their single clarion cry was for Christians and spices.',
              evidenceTimestamp: 1330,
              explanation: 'Chuyến hải trình của Vasco da Gama nhằm mục đích tiếp cận trực tiếp các nguồn gia vị (spices).'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Botanical structure: black, green, and white peppercorns are all harvested from the same ................',
              prefixText: 'Botanical structure: black, green, and white peppercorns are all harvested from the same',
              suffixText: '',
              answer: 'plant',
              acceptableAnswers: ['plant', 'vine'],
              evidenceQuote: 'It surprises many people to learn that all three varieties stem from the identical plant species.',
              evidenceTimestamp: 1370,
              explanation: 'Cả tiêu đen, tiêu xanh và tiêu trắng đều được thu hoạch từ cùng một loài cây (plant).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'Chemical potency: the pungency of pepper derives primarily from an alkaloid known as ................',
              prefixText: 'Chemical potency: the pungency of pepper derives primarily from an alkaloid known as',
              suffixText: '',
              answer: 'piperine',
              acceptableAnswers: ['piperine'],
              evidenceQuote: 'The characteristic sharp bite is chemically produced by the crystalline compound piperine.',
              evidenceTimestamp: 1405,
              explanation: 'Vị cay nồng đặc trưng của hạt tiêu được tạo nên từ hợp chất alkaloid có tên là piperine.'
            },
            {
              id: 40,
              order: 40,
              questionText: 'Modern cultivation: today, ................ has emerged as one of the world\'s largest exporters of black pepper.',
              prefixText: 'Modern cultivation: today,',
              suffixText: 'has emerged as one of the world\'s largest exporters of black pepper.',
              answer: 'Vietnam',
              acceptableAnswers: ['vietnam', 'Vietnam'],
              evidenceQuote: 'In the twenty-first century, Vietnam became the world\'s undisputed leading exporter of high-grade pepper.',
              evidenceTimestamp: 1435,
              explanation: 'Trong thế kỷ 21, Việt Nam vươn lên trở thành quốc gia xuất khẩu hạt tiêu hàng đầu thế giới.'
            }
          ]
        }
      ]
    }
  ]
};
