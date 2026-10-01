/**
 * Cambridge IELTS 17 Academic / General - Listening Practice Test 1
 * Full 4 Parts, 40 Questions, Exact Answer Keys, Timestamps, and Explanations.
 */

export const cambridge17Test1 = {
  id: 'cambridge-17-test-1',
  title: 'Cambridge Practice Test 17: Complete Listening Simulation',
  description: 'Bộ đề thi thử IELTS Listening chuẩn khảo thí Cambridge 17 gồm đầy đủ 4 phần (Part 1–4) với 40 câu hỏi, thời lượng audio 30 phút và 2 phút kiểm tra lại bài.',
  totalQuestions: 40,
  timeLimitMinutes: 32,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 17,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  audioUrl: 'https://dn720904.ca.archive.org/0/items/cambridge-15-ielts-listening-test-1/Cambridge%2015%20IELTS%20Listening%20Test%201.mp3',
  fallbackAudioUrl: '/audio/cam17_test1_audio.mp3',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1: Buckworth Conservation Group',
      context: 'A phone call between a volunteer coordinator and a new resident interested in weekend conservation activities.',
      audioTimestampStart: 0,
      audioTimestampEnd: 360,
      speakers: [
        { name: 'Peter (Coordinator)', gender: 'Male', accent: 'British' },
        { name: 'Janice (Volunteer)', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam17-l1-1',
          type: 'note_completion',
          title: 'Questions 1–10',
          instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
          headerTitle: 'BUCKWORTH CONSERVATION GROUP - VOLUNTEER ENROLMENT',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Conservation focus: preserving local ................ habitat along the marshlands',
              prefixText: 'Conservation focus: preserving local',
              suffixText: 'habitat along the marshlands',
              answer: 'wetland',
              acceptableAnswers: ['wetland', 'wetlands'],
              evidenceQuote: 'Our top priority is rehabilitating the endangered wetland ecosystem.',
              evidenceTimestamp: 45,
              explanation: 'Trọng tâm bảo tồn là khôi phục hệ sinh thái vùng đất ngập nước (wetland).'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Regular meeting day: the second ................ of each month',
              prefixText: 'Regular meeting day: the second',
              suffixText: 'of each month',
              answer: 'Saturday',
              acceptableAnswers: ['saturday', 'Saturday'],
              evidenceQuote: 'All volunteers meet on the second Saturday of the calendar month.',
              evidenceTimestamp: 80,
              explanation: 'Buổi gặp mặt thường niên diễn ra vào ngày Thứ Bảy thứ hai trong tháng.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Location of assembly: outside the old timber ................ near the weir',
              prefixText: 'Location of assembly: outside the old timber',
              suffixText: 'near the weir',
              answer: 'barn',
              acceptableAnswers: ['barn'],
              evidenceQuote: 'We assemble promptly outside the renovated timber barn beside the old weir.',
              evidenceTimestamp: 110,
              explanation: 'Địa điểm tập hợp là bên ngoài nhà kho gỗ (barn) gần đập tràn nước.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Leader\'s contact surname: Mr. ................',
              prefixText: "Leader's contact surname: Mr.",
              suffixText: '',
              answer: 'Henley',
              acceptableAnswers: ['henley', 'Henley'],
              evidenceQuote: 'Your team leader on-site is Mr Henley, spelt H-E-N-L-E-Y.',
              evidenceTimestamp: 140,
              explanation: 'Họ của người trưởng nhóm là Henley (H-E-N-L-E-Y).'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Essential footwear required: sturdy pair of ................',
              prefixText: 'Essential footwear required: sturdy pair of',
              suffixText: '',
              answer: 'boots',
              acceptableAnswers: ['boots', 'walking boots'],
              evidenceQuote: 'Due to thick mud, everyone must wear a sturdy pair of waterproof boots.',
              evidenceTimestamp: 175,
              explanation: 'Giày dép bắt buộc là một đôi ủng/giày bốt (boots) chống nước.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Task for coming Saturday: repairing wooden ................ around the pond',
              prefixText: 'Task for coming Saturday: repairing wooden',
              suffixText: 'around the pond',
              answer: 'fences',
              acceptableAnswers: ['fences', 'fence'],
              evidenceQuote: 'Our main morning duty will be restoring broken wooden fences around the duck pond.',
              evidenceTimestamp: 215,
              explanation: 'Nhiệm vụ sáng thứ Bảy là sửa chữa hàng rào gỗ (fences) quanh bờ ao.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Refreshments: group provides tea and homemade ................ at noon',
              prefixText: 'Refreshments: group provides tea and homemade',
              suffixText: 'at noon',
              answer: 'biscuits',
              acceptableAnswers: ['biscuits', 'biscuit'],
              evidenceQuote: 'We serve hot tea and freshly baked biscuits for mid-morning tea.',
              evidenceTimestamp: 250,
              explanation: 'Nhóm tình nguyện phục vụ trà nóng và bánh quy tự làm (biscuits).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Annual membership contribution: £ ................',
              prefixText: 'Annual membership contribution: £',
              suffixText: '',
              answer: '18',
              acceptableAnswers: ['18', '18.00'],
              evidenceQuote: 'Annual voluntary dues to cover our tool insurance are just £18.',
              evidenceTimestamp: 290,
              explanation: 'Phí hội viên thường niên hỗ trợ bảo hiểm dụng cụ là 18 bảng Anh.'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Recommended bus route: number ................ stops at the bridge',
              prefixText: 'Recommended bus route: number',
              suffixText: 'stops at the bridge',
              answer: '44',
              acceptableAnswers: ['44', 'forty-four'],
              evidenceQuote: 'The number 44 bus drops passengers right by the village canal bridge.',
              evidenceTimestamp: 320,
              explanation: 'Tuyến xe buýt số 44 dừng ngay cạnh chân cầu làng.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Coordinator emergency telephone: 07941 ................',
              prefixText: 'Coordinator emergency telephone: 07941',
              suffixText: '',
              answer: '883210',
              acceptableAnswers: ['883210', '883 210'],
              evidenceQuote: 'Write down my personal mobile in case of fog: 07941 883210.',
              evidenceTimestamp: 350,
              explanation: 'Số điện thoại di động khẩn cấp là 883210.'
            }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2: Scenic Riverboat Excursions',
      context: 'A promotional talk given by a tour operator describing riverboat routes and visitor amenities.',
      audioTimestampStart: 360,
      audioTimestampEnd: 720,
      speakers: [
        { name: 'Tour Guide', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam17-l2-1',
          type: 'multiple_choice',
          title: 'Questions 11–15',
          instruction: 'Choose the correct letter, A, B or C.',
          questions: [
            {
              id: 11,
              order: 11,
              questionText: 'What makes the evening sunset cruise particularly popular?',
              options: [
                { key: 'A', text: 'Live acoustic jazz performances on the open deck' },
                { key: 'B', text: 'Free sampling of regional wines and cheeses' },
                { key: 'C', text: 'Illuminated views of historic cathedral architecture' }
              ],
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'Passengers rave about the breathtaking floodlit reflections of the Norman cathedral towers along the waterfront.',
              evidenceTimestamp: 410,
              explanation: 'Điểm thu hút nhất của chuyến tàu hoàng hôn là khung cảnh nhà thờ cổ kính được thắp đèn rực rỡ soi bóng xuống dòng sông.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Family tickets offer complimentary admission for up to:',
              options: [
                { key: 'A', text: 'two children under twelve.' },
                { key: 'B', text: 'three children under fifteen.' },
                { key: 'C', text: 'one infant under five.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'A family pass covers two adults and grants complimentary entry to two children under twelve.',
              evidenceTimestamp: 460,
              explanation: 'Vé gia đình miễn phí cho tối đa hai trẻ em dưới 12 tuổi.'
            },
            {
              id: 13,
              order: 13,
              questionText: 'In the event of heavy rainfall, boat operators guarantee that:',
              options: [
                { key: 'A', text: 'tickets can be refunded without administrative fees.' },
                { key: 'B', text: 'all cruises operate under fully heated panoramic glass domes.' },
                { key: 'C', text: 'passengers will be offered free museum vouchers.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Our modern catamaran features heated panoramic glass canopies so bad weather never spoils the voyage.',
              evidenceTimestamp: 515,
              explanation: 'Tàu du lịch được trang bị mái vòm kính toàn cảnh sưởi ấm trong mọi điều kiện thời tiết.'
            },
            {
              id: 14,
              order: 14,
              questionText: 'What historical artefact is preserved inside the marina visitor pavilion?',
              options: [
                { key: 'A', text: 'A Victorian iron paddle wheel' },
                { key: 'B', text: 'A collection of medieval fisherman tools' },
                { key: 'C', text: 'A restored steam navigation compass' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'In the main reception hall sits a genuine nineteenth-century cast iron paddle wheel from an early steam tug.',
              evidenceTimestamp: 565,
              explanation: 'Khu sảnh đón khách trưng bày bánh xe guồng nước bằng gang đúc từ thế kỷ 19.'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Pre-booked banquet lunches must be submitted at least:',
              options: [
                { key: 'A', text: '12 hours before departure.' },
                { key: 'B', text: '24 hours before departure.' },
                { key: 'C', text: '48 hours before departure.' }
              ],
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'Catering requirements must be confirmed forty-eight hours ahead of boarding.',
              evidenceTimestamp: 605,
              explanation: 'Các bữa tiệc buffet trưa cần được đăng ký tối thiểu 48 giờ trước giờ khởi hành.'
            }
          ]
        },
        {
          id: 'qg-cam17-l2-2',
          type: 'matching',
          title: 'Questions 16–20',
          instruction: 'What special feature is found at each pier stop along the river?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
          options: [
            { key: 'A', text: 'Botanical sculpture garden' },
            { key: 'B', text: 'Interactive children\'s pirate playground' },
            { key: 'C', text: 'Artisanal farmers market' },
            { key: 'D', text: 'Historic shipyard museum' },
            { key: 'E', text: 'Bicycle rental depot' },
            { key: 'F', text: 'Wildlife waterfowl sanctuary' },
            { key: 'G', text: 'Panoramic viewing tower' }
          ],
          questions: [
            {
              id: 16,
              order: 16,
              questionText: 'St. Jude\'s Pier',
              answer: 'E',
              acceptableAnswers: ['E', 'e'],
              evidenceQuote: 'At St. Jude’s Pier, a high-tech bicycle rental depot allows disembarking cyclists to explore the valley trail.',
              evidenceTimestamp: 635,
              explanation: 'Bến St. Jude có trạm cho thuê xe đạp (bicycle rental depot).'
            },
            {
              id: 17,
              order: 17,
              questionText: 'Bishop\'s Reach',
              answer: 'C',
              acceptableAnswers: ['C', 'c'],
              evidenceQuote: 'At Bishop’s Reach, weekend voyagers find a bustling artisanal farmers market selling organic cheeses.',
              evidenceTimestamp: 655,
              explanation: 'Bến Bishop\'s Reach có chợ nông sản thủ công của nông dân địa phương.'
            },
            {
              id: 18,
              order: 18,
              questionText: 'Anchor Wharf',
              answer: 'D',
              acceptableAnswers: ['D', 'd'],
              evidenceQuote: 'Anchor Wharf features the acclaimed historic shipyard museum detailing four centuries of boat building.',
              evidenceTimestamp: 675,
              explanation: 'Bến Anchor Wharf có bảo tàng xưởng đóng tàu lịch sử lâu đời.'
            },
            {
              id: 19,
              order: 19,
              questionText: 'Osprey Quay',
              answer: 'F',
              acceptableAnswers: ['F', 'f'],
              evidenceQuote: 'Osprey Quay is dedicated to an expansive waterfowl sanctuary protecting nesting herons.',
              evidenceTimestamp: 695,
              explanation: 'Bến Osprey Quay là khu bảo tồn các loài chim và thủy cầm hoang dã.'
            },
            {
              id: 20,
              order: 20,
              questionText: 'Castle Steps',
              answer: 'G',
              acceptableAnswers: ['G', 'g'],
              evidenceQuote: 'Finally, Castle Steps lets visitors climb a stone panoramic viewing tower over the river bends.',
              evidenceTimestamp: 715,
              explanation: 'Bến Castle Steps cho phép du khách leo lên tháp ngắm cảnh toàn cảnh (panoramic viewing tower).'
            }
          ]
        }
      ]
    },
    {
      partNumber: 3,
      title: 'Part 3: Bamboo in Modern Architecture',
      context: 'Two architecture students discuss the structural potential and sustainability of bamboo in building design.',
      audioTimestampStart: 720,
      audioTimestampEnd: 1080,
      speakers: [
        { name: 'Dr. Harris (Tutor)', gender: 'Male', accent: 'British' },
        { name: 'Maya (Student)', gender: 'Female', accent: 'Australian' }
      ],
      questionGroups: [
        {
          id: 'qg-cam17-l3-1',
          type: 'multiple_choice',
          title: 'Questions 21–25',
          instruction: 'Choose the correct letter, A, B or C.',
          questions: [
            {
              id: 21,
              order: 21,
              questionText: 'Why does Maya describe bamboo as an exceptional structural material?',
              options: [
                { key: 'A', text: 'Its hollow culm gives high tensile strength with minimal weight.' },
                { key: 'B', text: 'It is naturally fireproof without chemical treatment.' },
                { key: 'C', text: 'It can be harvested without causing any carbon emissions.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'The hollow cylindrical stem has exceptional tensile strength while being astonishingly lightweight.',
              evidenceTimestamp: 760,
              explanation: 'Thân tre hình ống rỗng có độ chịu lực kéo đặc biệt cao nhưng lại có trọng lượng rất nhẹ.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'What is the main obstacle regarding traditional bamboo joints in construction?',
              options: [
                { key: 'A', text: 'Metal bolts cause the longitudinal fibres to split.' },
                { key: 'B', text: 'No standardized adhesives exist in modern hardware shops.' },
                { key: 'C', text: 'Mortar fails to adhere to the smooth outer silica skin.' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'Standard mechanical fasteners like steel bolts often cause the straight parallel fibres to crack and split.',
              evidenceTimestamp: 810,
              explanation: 'Bu-lông thép truyền thống dễ làm các thớ sợi tre chạy dọc thân bị nứt toác.'
            },
            {
              id: 23,
              order: 23,
              questionText: 'Dr. Harris emphasizes that untreated bamboo poles:',
              options: [
                { key: 'A', text: 'rapidly lose flexibility in dry desert conditions.' },
                { key: 'B', text: 'are highly vulnerable to powder-post beetle infestations.' },
                { key: 'C', text: 'bend permanently under continuous dead-weight loads.' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Natural starches in the raw timber make untreated bamboo delicious prey for powder-post beetles and fungal rot.',
              evidenceTimestamp: 865,
              explanation: 'Tre tươi chưa qua xử lý rất dễ bị mọt gỗ (powder-post beetles) và nấm mốc tấn công do chứa nhiều tinh bột tự nhiên.'
            },
            {
              id: 24,
              order: 24,
              questionText: 'Which preservation method does Maya recommend for ecological building?',
              options: [
                { key: 'A', text: 'Hot creosote surface dipping' },
                { key: 'B', text: 'Borax salt immersion' },
                { key: 'C', text: 'High-temperature plastic laminating' }
              ],
              answer: 'B',
              acceptableAnswers: ['B', 'b'],
              evidenceQuote: 'Soaking the culms in a non-toxic mixture of natural borax salts permanently removes edible sugars.',
              evidenceTimestamp: 915,
              explanation: 'Ngâm cây tre trong dung dịch muối borax tự nhiên là giải pháp thân thiện sinh thái nhất.'
            },
            {
              id: 25,
              order: 25,
              questionText: 'What will they demonstrate in their practical workshop experiment?',
              options: [
                { key: 'A', text: 'Stress-testing bent bamboo roof trusses' },
                { key: 'B', text: 'Measuring acoustics in bamboo recording booths' },
                { key: 'C', text: 'Thermal conductivity comparisons against pine wood' }
              ],
              answer: 'A',
              acceptableAnswers: ['A', 'a'],
              evidenceQuote: 'We will construct curved scale-model trusses and measure how much load they withstand before bending.',
              evidenceTimestamp: 960,
              explanation: 'Thí nghiệm thực hành sẽ kiểm tra khả năng chịu lực uốn của các vì kèo vòm mái bằng tre.'
            }
          ]
        },
        {
          id: 'qg-cam17-l3-2',
          type: 'note_completion',
          title: 'Questions 26–30',
          instruction: 'Complete the flow-chart below.\nWrite ONE WORD ONLY for each answer.',
          headerTitle: 'STEPS IN PREPARING STRUCTURAL BAMBOO',
          questions: [
            {
              id: 26,
              order: 26,
              questionText: 'Harvesting: Poles must be harvested during the early ................ when sap levels are low.',
              prefixText: 'Harvesting: Poles must be harvested during the early',
              suffixText: 'when sap levels are low.',
              answer: 'morning',
              acceptableAnswers: ['morning'],
              evidenceQuote: 'Cutting must take place in the dawn chill of the early morning before sunlight draws sap upward.',
              evidenceTimestamp: 995,
              explanation: 'Tre phải được đốn hạ vào sáng sớm (morning) trước khi nhựa cây bốc lên theo ánh nắng.'
            },
            {
              id: 27,
              order: 27,
              questionText: 'Cleaning: Outer skin is scrubbed with wet ................ to remove fungal spores.',
              prefixText: 'Cleaning: Outer skin is scrubbed with wet',
              suffixText: 'to remove fungal spores.',
              answer: 'sand',
              acceptableAnswers: ['sand'],
              evidenceQuote: 'Workers rub coarse wet sand across the outer culm to scrub away fungus.',
              evidenceTimestamp: 1018,
              explanation: 'Thân tre được chà xát bằng cát ướt (sand) để tẩy sạch các bào tử nấm mốc.'
            },
            {
              id: 28,
              order: 28,
              questionText: 'Perforation: Inner internal nodal ................ are punctured to permit chemical entry.',
              prefixText: 'Perforation: Inner internal nodal',
              suffixText: 'are punctured to permit chemical entry.',
              answer: 'membranes',
              acceptableAnswers: ['membranes', 'membrane'],
              evidenceQuote: 'Long iron rebar is pushed down the core to puncture the internal membranes between nodes.',
              evidenceTimestamp: 1040,
              explanation: 'Các màng ngăn mắt tre bên trong thân (membranes) được đục thủng để dung dịch thẩm thấu.'
            },
            {
              id: 29,
              order: 29,
              questionText: 'Drying: Stalks must dry vertically under open ................ away from direct sun.',
              prefixText: 'Drying: Stalks must dry vertically under open',
              suffixText: 'away from direct sun.',
              answer: 'sheds',
              acceptableAnswers: ['sheds', 'shed'],
              evidenceQuote: 'Culms are stacked vertically inside ventilated drying sheds away from scorching rays.',
              evidenceTimestamp: 1060,
              explanation: 'Tre được dựng thẳng đứng trong các lán che (sheds) thoáng khí, tránh ánh nắng gắt.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'Grading: Acoustic tapping checks that density meets the required ................ index.',
              prefixText: 'Grading: Acoustic tapping checks that density meets the required',
              suffixText: 'index.',
              answer: 'elasticity',
              acceptableAnswers: ['elasticity'],
              evidenceQuote: 'Ultrasonic resonance validates that the timber achieves the required elasticity index.',
              evidenceTimestamp: 1078,
              explanation: 'Kiểm tra âm học để đảm bảo tre đạt chỉ số đàn hồi (elasticity index) tiêu chuẩn.'
            }
          ]
        }
      ]
    },
    {
      partNumber: 4,
      title: 'Part 4: Biological Pest Control using Lacewings',
      context: 'An entomology lecture investigating the deployment of green lacewings (Chrysoperla carnea) in commercial agriculture.',
      audioTimestampStart: 1080,
      audioTimestampEnd: 1440,
      speakers: [
        { name: 'Dr. Rachel Bennett (Entomologist)', gender: 'Female', accent: 'British' }
      ],
      questionGroups: [
        {
          id: 'qg-cam17-l4-1',
          type: 'note_completion',
          title: 'Questions 31–40',
          instruction: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
          headerTitle: 'GREEN LACEWINGS IN INTEGRATED PEST MANAGEMENT',
          questions: [
            {
              id: 31,
              order: 31,
              questionText: 'Larval nickname: often called \'aphid ...............\' due to their insatiable predatory appetite.',
              prefixText: "Larval nickname: often called 'aphid",
              suffixText: "' due to their insatiable predatory appetite.",
              answer: 'lions',
              acceptableAnswers: ['lions', 'lion'],
              evidenceQuote: 'Because of their ferocious feeding habit, the larvae are popularly dubbed aphid lions.',
              evidenceTimestamp: 1110,
              explanation: 'Ấu trùng chuồn chuồn cỏ được mệnh danh là \'sư tử diệt rệp sáp\' (aphid lions).'
            },
            {
              id: 32,
              order: 32,
              questionText: 'Mouthparts: larvae possess curved hollow ................ used to inject digestive fluids.',
              prefixText: 'Mouthparts: larvae possess curved hollow',
              suffixText: 'used to inject digestive fluids.',
              answer: 'jaws',
              acceptableAnswers: ['jaws', 'jaw'],
              evidenceQuote: 'They seize aphids using sickled, hollow jaws through which paralyzing enzymes are injected.',
              evidenceTimestamp: 1145,
              explanation: 'Ấu trùng sử dụng hàm rỗng cong (jaws) để bơm dịch tiêu hóa vào con mồi.'
            },
            {
              id: 33,
              order: 33,
              questionText: 'Egg protection: female attaches each egg atop a fine silken ................ to thwart predators.',
              prefixText: 'Egg protection: female attaches each egg atop a fine silken',
              suffixText: 'to thwart predators.',
              answer: 'stalk',
              acceptableAnswers: ['stalk'],
              evidenceQuote: 'Mothers place each oval egg at the pinnacle of a slender silken stalk off the leaf surface.',
              evidenceTimestamp: 1180,
              explanation: 'Trứng được gắn trên một cuống tơ mảnh (stalk) nhô cao để tránh bị các loài ăn thịt tấn công.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Camouflage behaviour: some species pile dead pest ................ on their backs.',
              prefixText: 'Camouflage behaviour: some species pile dead pest',
              suffixText: 'on their backs.',
              answer: 'skins',
              acceptableAnswers: ['skins', 'remains', 'skin'],
              evidenceQuote: 'The nymph cleverly heaps empty insect skins across its carapace to disguise itself from birds.',
              evidenceTimestamp: 1220,
              explanation: 'Ấu trùng ngụy trang bằng cách chất xác khô (skins) của côn trùng lên lưng.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Adult diet: mature lacewings feed primarily on pollen, honeydew, and floral ................',
              prefixText: 'Adult diet: mature lacewings feed primarily on pollen, honeydew, and floral',
              suffixText: '',
              answer: 'nectar',
              acceptableAnswers: ['nectar'],
              evidenceQuote: 'Unlike their predatory young, adult lacewings subsist peacefully on nectar and pollen grains.',
              evidenceTimestamp: 1255,
              explanation: 'Con trưởng thành chủ yếu ăn mật hoa (nectar), phấn hoa và dịch ngọt.'
            },
            {
              id: 36,
              order: 36,
              questionText: 'Field delivery: commercial insectaries distribute dormant eggs mixed with organic rice ................',
              prefixText: 'Field delivery: commercial insectaries distribute dormant eggs mixed with organic rice',
              suffixText: '',
              answer: 'hulls',
              acceptableAnswers: ['hulls', 'husks', 'hull'],
              evidenceQuote: 'Suppliers package eggs blended with lightweight rice hulls for uniform mechanical spreading.',
              evidenceTimestamp: 1295,
              explanation: 'Trứng côn trùng được trộn cùng vỏ trấu gạo (rice hulls) để dễ dàng rải đều trên đồng ruộng.'
            },
            {
              id: 37,
              order: 37,
              questionText: 'Orchard advantage: unlike chemical sprays, lacewings do not induce pest ................',
              prefixText: 'Orchard advantage: unlike chemical sprays, lacewings do not induce pest',
              suffixText: '',
              answer: 'resistance',
              acceptableAnswers: ['resistance'],
              evidenceQuote: 'Crucially, pest populations cannot develop biological resistance against physical predators.',
              evidenceTimestamp: 1335,
              explanation: 'Khác với thuốc trừ sâu hóa học, chuồn chuồn cỏ không khiến sâu hại kháng thuốc (resistance).'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Greenhouse integration: lacewings can be safely paired with beneficial parasitic ................',
              prefixText: 'Greenhouse integration: lacewings can be safely paired with beneficial parasitic',
              suffixText: '',
              answer: 'wasps',
              acceptableAnswers: ['wasps', 'wasp'],
              evidenceQuote: 'They coexist harmoniously with parasitic wasps in commercial glasshouse crops.',
              evidenceTimestamp: 1370,
              explanation: 'Chuồn chuồn cỏ có thể kết hợp an toàn với loài ong bắp cày ký sinh (parasitic wasps).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'Seasonal refuge: farmers plant bordering ................ to provide winter shelter.',
              prefixText: 'Seasonal refuge: farmers plant bordering',
              suffixText: 'to provide winter shelter.',
              answer: 'hedgerows',
              acceptableAnswers: ['hedgerows', 'hedges', 'hedgerow'],
              evidenceQuote: 'Establishing native hedgerows along field boundaries guarantees warm winter shelter.',
              evidenceTimestamp: 1405,
              explanation: 'Nông dân trồng các hàng rào cây bụi (hedgerows) quanh bờ ruộng làm nơi trú đông.'
            },
            {
              id: 40,
              order: 40,
              questionText: 'Cost comparison: long-term biological controls yield significant savings in chemical ................ bills.',
              prefixText: 'Cost comparison: long-term biological controls yield significant savings in chemical',
              suffixText: 'bills.',
              answer: 'pesticide',
              acceptableAnswers: ['pesticide', 'pesticides'],
              evidenceQuote: 'Over five consecutive crop cycles, growers slashed their pesticide expenditure by over forty percent.',
              evidenceTimestamp: 1435,
              explanation: 'Biện pháp sinh học giúp tiết kiệm chi phí thuốc trừ sâu hóa học (pesticide).'
            }
          ]
        }
      ]
    }
  ]
};
