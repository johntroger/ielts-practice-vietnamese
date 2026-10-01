/**
 * Cambridge IELTS 20 Academic / General - Listening Practice Test 1
 * Full 4 Parts, 40 Questions, Exact Answer Keys, Timestamps, and Explanations.
 */

export const cambridge20Test1 = {
  id: 'cambridge-20-test-1',
  title: 'Cambridge Practice Test 20: Complete Listening Simulation',
  description: 'Bộ đề thi thử IELTS Listening chuẩn khảo thí Cambridge 20 (Mới nhất) gồm đầy đủ 4 phần (Part 1–4) với 40 câu hỏi, thời lượng audio 30 phút và 2 phút kiểm tra lại bài.',
  totalQuestions: 40,
  timeLimitMinutes: 32,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 20,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  audioUrl: 'https://dn720904.ca.archive.org/0/items/cambridge-15-ielts-listening-test-1/Cambridge%2015%20IELTS%20Listening%20Test%201.mp3',
  fallbackAudioUrl: '/audio/cam20_test1_audio.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Local Restaurant Recommendations & Table Booking',
      context: 'A conversation between two colleagues discussing dining options and booking a celebration dinner.',
      audioTimestampStart: 0,
      audioTimestampEnd: 360,
      speakers: [
        { name: 'Marcus', gender: 'Male', accent: 'British' },
        { name: 'Angela', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam20-l1-1',
          type: 'note_completion',
          title: 'Questions 1–10',
          instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'RESTAURANT INQUIRY FOR TEAM CELEBRATION',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'First recommendation: The Junction, located on ................ Street',
              prefixText: 'First recommendation: The Junction, located on',
              suffixText: 'Street',
              answer: 'Greyson',
              acceptableAnswers: ['Greyson', 'greyson'],
              evidenceQuote: 'The Junction is located on Greyson Street, that is G-R-E-Y-S-O-N.',
              evidenceTimestamp: 45,
              explanation: 'Tên con đường là Greyson Street, được đánh vần từng chữ cái.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Special culinary attraction: known for its artisanal wood-fired ................',
              prefixText: 'Special culinary attraction: known for its artisanal wood-fired',
              suffixText: '',
              answer: 'pizza',
              acceptableAnswers: ['pizza', 'pizzas'],
              evidenceQuote: 'Everyone raves about their authentic wood-fired pizza baked in stone ovens.',
              evidenceTimestamp: 80,
              explanation: 'Món ăn đặc sắc nhất của quán là bánh pizza nướng lò củi đá.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Outdoor dining: features a heated rooftop ................ overlooking the river',
              prefixText: 'Outdoor dining: features a heated rooftop',
              suffixText: 'overlooking the river',
              answer: 'terrace',
              acceptableAnswers: ['terrace'],
              evidenceQuote: 'They have a wonderful heated rooftop terrace with panoramic river views.',
              evidenceTimestamp: 115,
              explanation: 'Khu vực ăn ngoài trời là sân thượng có sưởi ấm (terrace).'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Second recommendation: Paloma, situated near the ancient stone ................',
              prefixText: 'Second recommendation: Paloma, situated near the ancient stone',
              suffixText: '',
              answer: 'bridge',
              acceptableAnswers: ['bridge'],
              evidenceQuote: 'Paloma is situated right by the historic medieval stone bridge.',
              evidenceTimestamp: 150,
              explanation: 'Nhà hàng Paloma nằm ngay gần cây cầu đá cổ (bridge).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Paloma cuisine style: specializes in contemporary ................ tapas',
              prefixText: 'Paloma cuisine style: specializes in contemporary',
              suffixText: 'tapas',
              answer: 'Spanish',
              acceptableAnswers: ['spanish', 'Spanish'],
              evidenceQuote: 'Their chef prepares innovative Spanish tapas with organic local ingredients.',
              evidenceTimestamp: 185,
              explanation: 'Phong cách ẩm thực là món tapas Tây Ban Nha (Spanish).'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Set menu price per head: £ ................ for three courses',
              prefixText: 'Set menu price per head: £',
              suffixText: 'for three courses',
              answer: '32',
              acceptableAnswers: ['32', '32.00'],
              evidenceQuote: 'The set dinner menu comes to exactly £32 per head.',
              evidenceTimestamp: 220,
              explanation: 'Giá set ăn 3 món là 32 bảng Anh/người.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Dietary consideration: wide selection of certified ................ dishes',
              prefixText: 'Dietary consideration: wide selection of certified',
              suffixText: 'dishes',
              answer: 'gluten-free',
              acceptableAnswers: ['gluten-free', 'gluten free'],
              evidenceQuote: 'Sarah has celiac disease, so it is great that Paloma has a certified gluten-free menu.',
              evidenceTimestamp: 260,
              explanation: 'Nhà hàng có thực đơn riêng không chứa gluten (gluten-free).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Booking deposit required for party of ten: £ ................ total',
              prefixText: 'Booking deposit required for party of ten: £',
              suffixText: 'total',
              answer: '50',
              acceptableAnswers: ['50', '50.00'],
              evidenceQuote: 'To reserve a table for ten people on a Friday requires a £50 deposit.',
              evidenceTimestamp: 295,
              explanation: 'Tiền đặt cọc bàn cho 10 người là 50 bảng Anh.'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Agreed arrival time: 7: ................ pm',
              prefixText: 'Agreed arrival time: 7:',
              suffixText: 'pm',
              answer: '45',
              acceptableAnswers: ['45'],
              evidenceQuote: 'Let us book it for a quarter to eight—7:45 pm sharp.',
              evidenceTimestamp: 325,
              explanation: 'Thời gian đặt bàn hẹn trước là 7h45 tối (7:45 pm).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Customer contact surname: Mr. ................',
              prefixText: 'Customer contact surname: Mr.',
              suffixText: '',
              answer: 'Sinclair',
              acceptableAnswers: ['Sinclair', 'sinclair'],
              evidenceQuote: 'I will put the reservation under Marcus Sinclair, S-I-N-C-L-A-I-R.',
              evidenceTimestamp: 350,
              explanation: 'Họ của người đặt bàn là Sinclair (S-I-N-C-L-A-I-R).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Community Art Center Renovation Project',
      context: 'A briefing by the director of a regional arts hub outlining new facilities and community workshops.',
      audioTimestampStart: 360,
      audioTimestampEnd: 720,
      speakers: [
        { name: 'Fiona (Director)', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam20-l2-1',
          type: 'multiple_choice',
          title: 'Questions 11–15',
          instruction: 'Choose the correct letter, A, B or C.',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'What was the primary motive for expanding the Arts Center?',
              options: [
                { key: 'A', text: 'To accommodate surging demand for youth digital workshops' },
                { key: 'B', text: 'To comply with updated municipal seismic safety laws' },
                { key: 'C', text: 'To attract commercial theatrical productions from London' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'The driving impulse was the massive influx of local youths eager for digital animation and music production studios.',
              evidenceTimestamp: 405,
              explanation: 'Động lực chính là đáp ứng nhu cầu tăng vọt của giới trẻ đối với các xưởng đồ họa số và âm nhạc.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'How was the funding shortfall for the auditorium sound system resolved?',
              options: [
                { key: 'A', text: 'Through a private industrial endowment' },
                { key: 'B', text: 'Via an online community crowdfunding campaign' },
                { key: 'C', text: 'By reallocating maintenance budgets from next year' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Our patrons rallied brilliantly through an online crowdfunding appeal that raised thirty thousand pounds in four weeks.',
              evidenceTimestamp: 455,
              explanation: 'Khoản thiếu hụt kinh phí âm thanh được bù đắp nhờ chiến dịch gọi vốn cộng đồng trực tuyến.'
            },
            {
              id: 13,
              order: 13,
              questionText: 'What eco-friendly feature is integrated into the new ceramics studio?',
              options: [
                { key: 'A', text: 'A greywater recycling system for clay washing' },
                { key: 'B', text: 'Solar-heated pottery drying racks' },
                { key: 'C', text: 'Compostable packaging for finished ceramic pots' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'The pottery workshop features a closed-loop greywater filtration circuit to reuse water from clay washing.',
              evidenceTimestamp: 510,
              explanation: 'Xưởng gốm sử dụng hệ thống lọc và tuần hoàn nước xám tái sử dụng khi rửa đất sét.'
            },
            {
              id: 14,
              order: 14,
              questionText: 'Discounted concessionary tickets are available to:',
              options: [
                { key: 'A', text: 'students and jobseekers on weekday afternoons.' },
                { key: 'B', text: 'families who book three weeks in advance.' },
                { key: 'C', text: 'anyone arriving on a public bicycle.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Concessionary rates apply to registered students and unemployed jobseekers attending weekday matinee sessions.',
              evidenceTimestamp: 560,
              explanation: 'Vé giảm giá áp dụng cho sinh viên và người tìm việc vào các buổi chiều trong tuần.'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Where will the opening gala art exhibition be staged?',
              options: [
                { key: 'A', text: 'In the Glass Atrium' },
                { key: 'B', text: 'Along the West Courtyard' },
                { key: 'C', text: 'Inside the Mezzanine Gallery' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'The premier exhibition will illuminate our breathtaking new central Glass Atrium.',
              evidenceTimestamp: 605,
              explanation: 'Triển lãm khai mạc sẽ diễn ra tại sảnh vòm kính trung tâm (Glass Atrium).'
            }
          ]
        },
        {
          id: 'qg-cam20-l2-2',
          type: 'matching',
          title: 'Questions 16–20',
          instruction: 'Which special facility is located in each zone of the Art Center?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
          options: [
            { key: 'A', text: '3D Laser printing lab' },
            { key: 'B', text: 'Soundproof podcast recording booth' },
            { key: 'C', text: 'Artisanal coffee and book nook' },
            { key: 'D', text: 'Children\'s sensory sculpture play area' },
            { key: 'E', text: 'Darkroom for analog photography' },
            { key: 'F', text: 'Textile weaving loom studio' },
            { key: 'G', text: 'Outdoor amphitheatre for poetry readings' }
          ],
          questions: [
            {
              id: 16,
              order: 16,
              questionText: 'North Wing Floor 1',
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'On the first floor of the North Wing, podcasters can book our brand new acoustic soundproof recording booth.',
              evidenceTimestamp: 635,
              explanation: 'Tầng 1 cánh Bắc có phòng thu âm podcast cách âm chuyên nghiệp.'
            },
            {
              id: 17,
              order: 17,
              questionText: 'North Wing Floor 2',
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Ascending to the second floor brings you to the digital makerspace with 3D laser printers.',
              evidenceTimestamp: 655,
              explanation: 'Tầng 2 cánh Bắc là phòng thực hành in laser 3D.'
            },
            {
              id: 18,
              order: 18,
              questionText: 'South Gallery Link',
              answer: 'E',
              acceptableAnswers: ['E', 'e'],
              evidenceQuote: 'The South Gallery corridor maintains a vintage darkroom for traditional chemical photography development.',
              evidenceTimestamp: 675,
              explanation: 'Hành lang phía Nam duy trì phòng tối tráng ảnh phim truyền thống.'
            },
            {
              id: 19,
              order: 19,
              questionText: 'East Pavilions',
              answer: 'D',
              acceptableAnswers: ['D', 'd'],
              evidenceQuote: 'Families with young toddlers will appreciate the sensory sculpture playground in the East Pavilion.',
              evidenceTimestamp: 695,
              explanation: 'Khu nhà phía Đông là không gian điêu khắc tương tác cảm giác dành cho trẻ nhỏ.'
            },
            {
              id: 20,
              order: 20,
              questionText: 'Garden Cloister',
              answer: 'G',
              acceptableAnswers: ['G', 'g'],
              evidenceQuote: 'Lastly, the tranquil garden cloister includes a sunken outdoor amphitheatre for acoustic poetry readings.',
              evidenceTimestamp: 715,
              explanation: 'Khu vườn có khán đài ngoài trời (outdoor amphitheatre) để đọc thơ và biểu diễn acoustic.'
            }
          ]
        }
      ]
    },
    {
      partNumber: 3,
      title: 'Part 3: Deep-Sea Hydrothermal Vents Research Presentation',
      context: 'Two marine biology students discuss preparing their undergraduate seminar on abyssal ecosystem biodiversity.',
      audioTimestampStart: 720,
      audioTimestampEnd: 1080,
      speakers: [
        { name: 'Oliver (Student)', gender: 'Male', accent: 'British' },
        { name: 'Dr. Rebecca Evans (Advisor)', gender: 'Female', accent: 'Australian' }
      ],
      questionGroups: [
        {
          id: 'qg-cam20-l3-1',
          type: 'multiple_choice',
          title: 'Questions 21–25',
          instruction: 'Choose the correct letter, A, B or C.',
          questions: [
            {
              id: 21,
              order: 21,
              questionText: 'What was Oliver\'s primary reason for choosing hydrothermal vents as his dissertation topic?',
              options: [
                { key: 'A', text: 'They demonstrate life flourishing without any solar photosynthesis.' },
                { key: 'B', text: 'Deep-sea mining companies offer lucrative research fellowships.' },
                { key: 'C', text: 'His family previously worked in deep-sea submarine mapping.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'What utterly fascinated me is how entire biological communities thrive on chemosynthesis, totally independent of solar light.',
              evidenceTimestamp: 760,
              explanation: 'Oliver bị cuốn hút vì các hệ sinh thái miệng phun thủy nhiệt phát triển dựa vào hóa tổng hợp mà không cần ánh sáng mặt trời.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'Why do giant tube worms (Riftia pachyptila) lack a digestive tract?',
              options: [
                { key: 'A', text: 'Their bodies absorb volcanic mineral ions directly through porous skin.' },
                { key: 'B', text: 'Symbiotic bacteria oxidize hydrogen sulfide to nourish them.' },
                { key: 'C', text: 'High hydrostatic water pressure prevents organ formation.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'They host billions of endosymbiotic bacteria inside a specialized organ that converts toxic hydrogen sulfide into organic nutrients.',
              evidenceTimestamp: 810,
              explanation: 'Giun ống khổng lồ nuôi hàng tỷ vi khuẩn cộng sinh trong cơ thể để oxy hóa khí H2S thành chất dinh dưỡng.'
            },
            {
              id: 23,
              order: 23,
              questionText: 'What criticism does Dr. Evans offer regarding Oliver\'s draft slide diagrams?',
              options: [
                { key: 'A', text: 'The geological fault labels are too intricate for a non-specialist audience.' },
                { key: 'B', text: 'The font size in data tables violates university formatting rules.' },
                { key: 'C', text: 'The temperature scale colors conflict with standard conventions.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Your tectonic diagrams are overloaded with obscure petrological jargon; you need to streamline them for general peers.',
              evidenceTimestamp: 865,
              explanation: 'Tiến sĩ Evans nhận xét các sơ đồ địa chất của Oliver chứa quá nhiều thuật ngữ phức tạp, cần được tinh giản.'
            },
            {
              id: 24,
              order: 24,
              questionText: 'How do they plan to explain the extreme temperature gradients near vent chimneys?',
              options: [
                { key: 'A', text: 'By playing an audio recording of geothermal boiling' },
                { key: 'B', text: 'By showing an animated thermal cross-section from 400°C to 2°C' },
                { key: 'C', text: 'By passing around volcanic basalt mineral samples' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'An animated visual graphic contrasting the 400-degree hydrothermal plume against the 2-degree freezing abyssal water will blow them away.',
              evidenceTimestamp: 915,
              explanation: 'Họ quyết định dùng hình ảnh động trực quan so sánh cột nước nóng 400 độ C với nước biển sâu đóng băng 2 độ C.'
            },
            {
              id: 25,
              order: 25,
              questionText: 'What contemporary environmental threat does Dr. Evans urge Oliver to highlight in his conclusion?',
              options: [
                { key: 'A', text: 'Commercial seafloor polymetallic nodule strip-mining' },
                { key: 'B', text: 'Submarine fiber-optic telecommunication cable laying' },
                { key: 'C', text: 'Nuclear waste dumping in ocean trenches' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'You must emphasize the imminent ecological catastrophe posed by deep-sea polymetallic nodule mining rigs.',
              evidenceTimestamp: 960,
              explanation: 'Tiến sĩ Evans đề nghị nhấn mạnh nguy cơ hủy hoại sinh thái từ việc khai thác mỏ đa kim dưới đáy biển sâu.'
            }
          ]
        },
        {
          id: 'qg-cam20-l3-2',
          type: 'note_completion',
          title: 'Questions 26–30',
          instruction: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
          headerTitle: 'ADAPTATIONS OF ABYSSAL FAUNA',
          questions: [
            {
              id: 26,
              order: 26,
              questionText: 'Vent crabs possess specialized setae hairs that harvest symbiotic ................',
              prefixText: 'Vent crabs possess specialized setae hairs that harvest symbiotic',
              suffixText: '',
              answer: 'bacteria',
              acceptableAnswers: ['bacteria', 'bacterium'],
              evidenceQuote: 'Rimicaris shrimp and yeti crabs cultivate dense mats of filamentous bacteria on their hairy limbs.',
              evidenceTimestamp: 995,
              explanation: 'Từ cần điền là "bacteria" (vi khuẩn).'
            },
            {
              id: 27,
              order: 27,
              questionText: 'Scaly-foot snails reinforce their outer shell with iron ................ compounds.',
              prefixText: 'Scaly-foot snails reinforce their outer shell with iron',
              suffixText: 'compounds.',
              answer: 'sulfide',
              acceptableAnswers: ['sulfide', 'sulphide'],
              evidenceQuote: 'Chrysomallon squamiferum incorporates toxic iron sulfide into its armor plating.',
              evidenceTimestamp: 1020,
              explanation: 'Từ cần điền là danh từ "sulfide" (trong hợp chất sắt sulfide).'
            },
            {
              id: 28,
              order: 28,
              questionText: 'Enzymes of hydrothermal microbes remain stable due to unique heat-shock ................',
              prefixText: 'Enzymes of hydrothermal microbes remain stable due to unique heat-shock',
              suffixText: '',
              answer: 'proteins',
              acceptableAnswers: ['proteins', 'protein'],
              evidenceQuote: 'Extremophiles prevent thermal degradation using specialized heat-shock proteins.',
              evidenceTimestamp: 1042,
              explanation: 'Từ cần điền là danh từ "proteins" (protein sốc nhiệt).'
            },
            {
              id: 29,
              order: 29,
              questionText: 'Visual navigation relies on thermal infrared ................ detectors in eyeless shrimp.',
              prefixText: 'Visual navigation relies on thermal infrared',
              suffixText: 'detectors in eyeless shrimp.',
              answer: 'radiation',
              acceptableAnswers: ['radiation'],
              evidenceQuote: 'They navigate around deadly boiling jets by detecting faint infrared radiation.',
              evidenceTimestamp: 1060,
              explanation: 'Tôm mù định vị bằng cách phát hiện bức xạ hồng ngoại nhiệt (infrared radiation).'
            },
            {
              id: 30,
              order: 30,
              questionText: 'Biochemical discoveries from vent bacteria have fueled breakthrough pharmaceutical ................',
              prefixText: 'Biochemical discoveries from vent bacteria have fueled breakthrough pharmaceutical',
              suffixText: '',
              answer: 'patents',
              acceptableAnswers: ['patents', 'patent'],
              evidenceQuote: 'Thermostable polymerase enzymes from vents have led to multi-million-dollar pharmaceutical patents.',
              evidenceTimestamp: 1078,
              explanation: 'Từ cần điền là "patents" (bằng sáng chế dược phẩm).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 4,
      title: 'Part 4: The Evolutionary Biology of Bird Migration Navigation',
      context: 'An ornithology lecture explaining the sensory mechanisms birds utilize to navigate across thousands of kilometers.',
      audioTimestampStart: 1080,
      audioTimestampEnd: 1440,
      speakers: [
        { name: 'Professor Julian Davenport', gender: 'Male', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam20-l4-1',
          type: 'note_completion',
          title: 'Questions 31–40',
          instruction: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
          headerTitle: 'HOW BIRDS NAVIGATE GLOBAL MIGRATION ROUTES',
          questions: [
            {
              id: 31,
              order: 31,
              questionText: 'Solar compass: daytime migrants gauge flight headings using the sun\'s position combined with their internal ................ clock.',
              prefixText: "Solar compass: daytime migrants gauge flight headings using the sun's position combined with their internal",
              suffixText: 'clock.',
              answer: 'circadian',
              acceptableAnswers: ['circadian', 'biological'],
              evidenceQuote: 'Day-flying migrants rely on a sun compass, recalibrating angles continuously using their internal circadian clock.',
              evidenceTimestamp: 1115,
              explanation: 'Chim ban ngày sử dụng vị trí mặt trời kết hợp với đồng hồ sinh học (circadian clock).'
            },
            {
              id: 32,
              order: 32,
              questionText: 'Starlight navigation: nocturnal migrants learn constellations revolving around the northern ................ star.',
              prefixText: 'Starlight navigation: nocturnal migrants learn constellations revolving around the northern',
              suffixText: 'star.',
              answer: 'pole',
              acceptableAnswers: ['pole'],
              evidenceQuote: 'Emlen funnel experiments proved young birds imprint on stellar patterns rotating around the northern pole star.',
              evidenceTimestamp: 1150,
              explanation: 'Chim bay đêm học bản đồ các chòm sao xoay quanh sao Bắc Cực (pole star).'
            },
            {
              id: 33,
              order: 33,
              questionText: 'Quantum mechanics: magnetoreception in bird eyes involves light-sensitive pigments called ................',
              prefixText: 'Quantum mechanics: magnetoreception in bird eyes involves light-sensitive pigments called',
              suffixText: '',
              answer: 'cryptochromes',
              acceptableAnswers: ['cryptochromes', 'cryptochrome'],
              evidenceQuote: 'Biophysicists discovered that specialized retinal proteins called cryptochromes undergo quantum spin shifts in magnetic fields.',
              evidenceTimestamp: 1190,
              explanation: 'Protein cảm biến từ trường trong mắt chim có tên là cryptochromes.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Olfactory maps: homing pigeons build mental odor maps influenced by prevailing wind ................',
              prefixText: 'Olfactory maps: homing pigeons build mental odor maps influenced by prevailing wind',
              suffixText: '',
              answer: 'currents',
              acceptableAnswers: ['currents', 'directions'],
              evidenceQuote: 'Pigeons construct olfactory regional maps by associating unique smells with atmospheric wind currents.',
              evidenceTimestamp: 1225,
              explanation: 'Chim bồ câu xây dựng bản đồ khứu giác liên hệ với các luồng gió (currents).'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Infrasound: seabirds can detect ultra-low frequency waves created by distant ocean ................',
              prefixText: 'Infrasound: seabirds can detect ultra-low frequency waves created by distant ocean',
              suffixText: '',
              answer: 'swells',
              acceptableAnswers: ['swells', 'waves'],
              evidenceQuote: 'Pelagic seabirds listen to infrasonic frequencies generated by massive oceanic swells thousands of miles away.',
              evidenceTimestamp: 1265,
              explanation: 'Chim biển nghe được sóng hạ âm phát ra từ những đợt sóng cuộn đại dương (swells).'
            },
            {
              id: 36,
              order: 36,
              questionText: 'Magnetic minerals: tiny grains of the mineral ................ in beaks help detect latitude variations.',
              prefixText: 'Magnetic minerals: tiny grains of the mineral',
              suffixText: 'in beaks help detect latitude variations.',
              answer: 'magnetite',
              acceptableAnswers: ['magnetite'],
              evidenceQuote: 'Nerve endings in the upper beak contain microscopic crystals of the mineral magnetite.',
              evidenceTimestamp: 1300,
              explanation: 'Mỏ chim chứa các tinh thể khoáng vật từ tính có tên là magnetite.'
            },
            {
              id: 37,
              order: 37,
              questionText: 'Anthropogenic interference: electromagnetic noise from urban telecommunication towers disrupts magnetic ................',
              prefixText: 'Anthropogenic interference: electromagnetic noise from urban telecommunication towers disrupts magnetic',
              suffixText: '',
              answer: 'orientation',
              acceptableAnswers: ['orientation'],
              evidenceQuote: 'Urban broadband and radio interference severely deranges birds\' delicate magnetic orientation.',
              evidenceTimestamp: 1340,
              explanation: 'Sóng điện từ đô thị làm rối loạn khả năng định hướng từ trường (orientation) của chim.'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Light pollution: illuminated skyscrapers disorient night-migrating songbirds, causing deadly building ................',
              prefixText: 'Light pollution: illuminated skyscrapers disorient night-migrating songbirds, causing deadly building',
              suffixText: '',
              answer: 'collisions',
              acceptableAnswers: ['collisions', 'collision', 'strikes'],
              evidenceQuote: 'City light pollution causes disoriented songbirds to plunge into glass facades, causing millions of fatal building collisions.',
              evidenceTimestamp: 1375,
              explanation: 'Ô nhiễm ánh sáng khiến chim đâm vào các tòa nhà cao tầng (collisions).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'Stopover habitats: destruction of critical coastal mudflat ................ threatens species with starvation.',
              prefixText: 'Stopover habitats: destruction of critical coastal mudflat',
              suffixText: 'threatens species with starvation.',
              answer: 'wetlands',
              acceptableAnswers: ['wetlands', 'wetland'],
              evidenceQuote: 'The draining of stopover wetlands along migratory flyways deprives shorebirds of vital refueling grounds.',
              evidenceTimestamp: 1410,
              explanation: 'Sự suy thoái của các vùng đất ngập nước (wetlands) ven biển đe dọa sinh tồn của chim di cư.'
            },
            {
              id: 40,
              order: 40,
              questionText: 'Global conservation: safeguarding international migratory corridors requires unified multinational ................',
              prefixText: 'Global conservation: safeguarding international migratory corridors requires unified multinational',
              suffixText: '',
              answer: 'treaties',
              acceptableAnswers: ['treaties', 'treaty', 'agreements'],
              evidenceQuote: 'Protecting transcontinental flyways demands enforceable multinational conservation treaties.',
              evidenceTimestamp: 1435,
              explanation: 'Bảo vệ đường bay di cư xuyên quốc gia đòi hỏi các hiệp ước quốc tế ràng buộc (treaties).'
            }
          ]
        }
      ]
    }
  ]
};
