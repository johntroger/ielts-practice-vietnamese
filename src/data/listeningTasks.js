/**
 * IELTS Listening Practice Tasks Dataset (Standard Cambridge Academic / General Training Format)
 * Full 4 Parts, 40 Questions, Exact Answer Keys, Evidence Locators & Audio Timestamps.
 */

// Cambridge IELTS Listening Raw Score to Band Score Conversion Table
export function calculateListeningBandScore(rawScore) {
  const score = Math.max(0, Math.min(40, Number(rawScore) || 0));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 6) return 3.5;
  if (score >= 4) return 3.0;
  return 2.5;
}

export const INITIAL_LISTENING_TESTS = [
  {
    id: 'cambridge-18-test-1',
    title: 'Cambridge Practice Test 18: Complete Listening Simulation',
    description: 'Bộ đề thi thử IELTS Listening chuẩn khảo thí Cambridge 18 gồm đầy đủ 4 phần (Part 1–4) với 40 câu hỏi, thời lượng audio 30 phút và 2 phút kiểm tra lại bài.',
    totalQuestions: 40,
    timeLimitMinutes: 32,
    audioUrl: 'https://cdn.jsdelivr.net/gh/johntroger/ielts-audio-assets@main/cam18_test1_audio.mp3',
    fallbackAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    parts: [
      {
        partNumber: 1,
        title: 'Part 1: Transport Survey & Cycling Club Inquiry',
        context: 'A conversation between an officer and a resident regarding transport habits and a local cycling club.',
        audioTimestampStart: 0,
        audioTimestampEnd: 380,
        speakers: [
          { name: 'Officer (Interviewer)', gender: 'Female', accent: 'British' },
          { name: 'Martin (Resident)', gender: 'Male', accent: 'British' }
        ],
        questionGroups: [
          {
            id: 'qg-l1-1',
            type: 'note_completion',
            title: 'Questions 1–10',
            instruction: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
            headerTitle: 'TRANSPORT SURVEY & CYCLING CLUB',
            questions: [
              {
                id: 1,
                order: 1,
                questionText: 'Name of resident: Martin ................',
                prefixText: 'Name of resident: Martin',
                suffixText: '',
                answer: 'Clarke',
                acceptableAnswers: ['clarke', 'Clarke', 'CLARKE'],
                evidenceQuote: 'My surname is Clarke, that is C-L-A-R-K-E.',
                evidenceTimestamp: 62,
                explanation: 'Người đàn ông đánh vần họ của mình là C-L-A-R-K-E.'
              },
              {
                id: 2,
                order: 2,
                questionText: 'Occupation: works as a ................',
                prefixText: 'Occupation: works as a',
                suffixText: '',
                answer: 'dentist',
                acceptableAnswers: ['dentist', 'Dentist'],
                evidenceQuote: 'I used to be a teacher, but now I work as a dentist at the city hospital.',
                evidenceTimestamp: 94,
                explanation: 'Bẫy tự đổi thông tin: Ông ấy từng là giáo viên (used to be a teacher), nhưng hiện tại làm nha sĩ (dentist).'
              },
              {
                id: 3,
                order: 3,
                questionText: 'Travels to work mainly by ................',
                prefixText: 'Travels to work mainly by',
                suffixText: '',
                answer: 'train',
                acceptableAnswers: ['train', 'Train'],
                evidenceQuote: 'Usually I catch the morning train, although occasionally I cycle when the weather is fine.',
                evidenceTimestamp: 125,
                explanation: 'Người nói cho biết phương tiện chính hàng ngày là tàu hỏa (train), thỉnh thoảng mới đạp xe.'
              },
              {
                id: 4,
                order: 4,
                questionText: 'Average travel time each way: ................ minutes',
                prefixText: 'Average travel time each way:',
                suffixText: 'minutes',
                answer: '45',
                acceptableAnswers: ['45', 'forty-five', 'forty five'],
                evidenceQuote: 'Door-to-door, it takes just around 45 minutes.',
                evidenceTimestamp: 152,
                explanation: 'Thời gian di chuyển trung bình một chiều là 45 phút.'
              },
              {
                id: 5,
                order: 5,
                questionText: 'Club membership cost per year: £ ................',
                prefixText: 'Club membership cost per year: £',
                suffixText: '',
                answer: '120',
                acceptableAnswers: ['120', 'one hundred and twenty', '120 pounds'],
                evidenceQuote: 'Full individual membership is £120 annually.',
                evidenceTimestamp: 188,
                explanation: 'Phí hội viên câu lạc bộ cả năm là 120 bảng Anh.'
              },
              {
                id: 6,
                order: 6,
                questionText: 'Club meets every ................ evening at 7:00 PM',
                prefixText: 'Club meets every',
                suffixText: 'evening at 7:00 PM',
                answer: 'Thursday',
                acceptableAnswers: ['thursday', 'Thursday', 'THURSDAY'],
                evidenceQuote: 'We hold regular group meetings every Thursday evening.',
                evidenceTimestamp: 218,
                explanation: 'Câu lạc bộ tổ chức họp vào mỗi tối thứ Năm (Thursday).'
              },
              {
                id: 7,
                order: 7,
                questionText: 'Location of meeting place: near the old ................',
                prefixText: 'Location of meeting place: near the old',
                suffixText: '',
                answer: 'library',
                acceptableAnswers: ['library', 'Library'],
                evidenceQuote: 'We gather right by the steps of the old library.',
                evidenceTimestamp: 247,
                explanation: 'Địa điểm tập hợp là bên cạnh toà thư viện cũ (library).'
              },
              {
                id: 8,
                order: 8,
                questionText: 'Must wear a ................ during night rides',
                prefixText: 'Must wear a',
                suffixText: 'during night rides',
                answer: 'helmet',
                acceptableAnswers: ['helmet', 'Helmet'],
                evidenceQuote: 'Safety is paramount, so every member must wear a suitable helmet at all times.',
                evidenceTimestamp: 279,
                explanation: 'Quy tắc an toàn bắt buộc đội mũ bảo hiểm (helmet).'
              },
              {
                id: 9,
                order: 9,
                questionText: 'Club organizes a special weekend ride to the ................',
                prefixText: 'Club organizes a special weekend ride to the',
                suffixText: '',
                answer: 'coast',
                acceptableAnswers: ['coast', 'Coast'],
                evidenceQuote: 'Once a month we organize a scenic long-distance ride to the coast.',
                evidenceTimestamp: 310,
                explanation: 'Chuyến đi đặc biệt cuối tuần là đạp xe ra bờ biển (coast).'
              },
              {
                id: 10,
                order: 10,
                questionText: 'Emergency contact phone number: 07700 ................',
                prefixText: 'Emergency contact phone number: 07700',
                suffixText: '',
                answer: '900358',
                acceptableAnswers: ['900358', '900 358'],
                evidenceQuote: 'You can reach our coordinator on 07700 900358.',
                evidenceTimestamp: 342,
                explanation: 'Dãy số điện thoại liên hệ là 900358.'
              }
            ]
          }
        ]
      },
      {
        partNumber: 2,
        title: 'Part 2: Community Heritage Centre & Nature Reserve Tour',
        context: 'A guide giving an introductory talk about facilities and renovations at a local nature reserve.',
        audioTimestampStart: 381,
        audioTimestampEnd: 790,
        speakers: [
          { name: 'Tour Guide', gender: 'Female', accent: 'Australian' }
        ],
        questionGroups: [
          {
            id: 'qg-l2-1',
            type: 'multiple_choice',
            title: 'Questions 11–14',
            instruction: 'Choose the correct letter, A, B or C.',
            questions: [
              {
                id: 11,
                order: 11,
                questionText: 'Why was the reserve originally established in 1985?',
                options: [
                  { key: 'A', text: 'To protect rare wetland birds and their nesting sites.' },
                  { key: 'B', text: 'To provide recreational sports areas for local schools.' },
                  { key: 'C', text: 'To harvest organic timber for regional construction.' }
                ],
                answer: 'A',
                evidenceQuote: 'The sanctuary was founded back in 1985 specifically to shield vulnerable wetland birds from urban encroachment.',
                evidenceTimestamp: 420,
                explanation: 'Khu bảo tồn được thành lập năm 1985 với mục tiêu bảo vệ các loài chim vùng ngập nước quý hiếm.'
              },
              {
                id: 12,
                order: 12,
                questionText: 'What recent improvement has been made to the visitor centre?',
                options: [
                  { key: 'A', text: 'A completely new gift shop has been opened.' },
                  { key: 'B', text: 'Wheelchair ramps have been added throughout the building.' },
                  { key: 'C', text: 'The entrance fee has been permanently waived.' }
                ],
                answer: 'B',
                evidenceQuote: 'Over the winter break, we installed comprehensive wheelchair ramps to guarantee full accessibility.',
                evidenceTimestamp: 475,
                explanation: 'Điểm cải tiến mới nhất là lắp đặt thêm đường dốc cho xe lăn (wheelchair ramps) để mọi người tiếp cận thuận tiện.'
              },
              {
                id: 13,
                order: 13,
                questionText: 'Volunteers at the reserve are required to:',
                options: [
                  { key: 'A', text: 'Commit to at least one full weekend per month.' },
                  { key: 'B', text: 'Have prior professional background in environmental science.' },
                  { key: 'C', text: 'Provide their own specialized gardening equipment.' }
                ],
                answer: 'A',
                evidenceQuote: 'We warmly invite new volunteers, asking only that you dedicate one weekend monthly to assist our rangers.',
                evidenceTimestamp: 520,
                explanation: 'Tình nguyện viên được yêu cầu cam kết tham gia ít nhất 1 cuối tuần mỗi tháng.'
              },
              {
                id: 14,
                order: 14,
                questionText: 'Where can visitors purchase seasonal refreshments?',
                options: [
                  { key: 'A', text: 'At the outdoor marquee next to the main lake.' },
                  { key: 'B', text: 'Only in the town centre cafe 2 miles away.' },
                  { key: 'C', text: 'At the newly refurbished Lakeside Pavilion.' }
                ],
                answer: 'C',
                evidenceQuote: 'Delicious light lunches and organic teas are served daily in our refurbished Lakeside Pavilion.',
                evidenceTimestamp: 565,
                explanation: 'Đồ uống giải khát và bữa ăn nhẹ được phục vụ tại nhà mái che ven hồ mới tân trang (Lakeside Pavilion).'
              }
            ]
          },
          {
            id: 'qg-l2-2',
            type: 'map_labelling',
            title: 'Questions 15–20',
            instruction: 'Label the map below.\nWrite the correct letter, A–H, next to Questions 15–20.',
            mapImageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=900&auto=format&fit=crop&q=80',
            questions: [
              {
                id: 15,
                order: 15,
                questionText: 'Bird Observatory Hide',
                answer: 'D',
                evidenceQuote: 'If you walk directly north along the willow path until the fork, take the left track; the Bird Observatory Hide is right at the end overlooking the marsh.',
                evidenceTimestamp: 620,
                explanation: 'Đi theo con đường rặng liễu về hướng Bắc, rẽ trái tại ngã ba là đài quan sát chim (vị trí D).'
              },
              {
                id: 16,
                order: 16,
                questionText: 'Children’s Adventure Playground',
                answer: 'B',
                evidenceQuote: 'Immediately south of the main entrance, situated safely behind the picnic lawn, you will find the Children Adventure Playground.',
                evidenceTimestamp: 655,
                explanation: 'Nằm ngay phía Nam cổng vào chính, phía sau bãi cỏ dã ngoại (vị trí B).'
              },
              {
                id: 17,
                order: 17,
                questionText: 'Herb & Butterfly Garden',
                answer: 'F',
                evidenceQuote: 'Passing the information kiosk and heading due east towards the sun terrace, the Herb and Butterfly Garden is enclosed within a brick courtyard.',
                evidenceTimestamp: 690,
                explanation: 'Đi về hướng Đông qua quầy thông tin là vườn bướm và thảo mộc (vị trí F).'
              },
              {
                id: 18,
                order: 18,
                questionText: 'Canoe Launching Dock',
                answer: 'A',
                evidenceQuote: 'On the western bank of the river, just beside the wooden footbridge, lies our Canoe Launching Dock.',
                evidenceTimestamp: 720,
                explanation: 'Nằm ở bờ phía Tây con sông, ngay sát cây cầu gỗ dành cho người đi bộ (vị trí A).'
              },
              {
                id: 19,
                order: 19,
                questionText: 'Ranger Station & First Aid',
                answer: 'E',
                evidenceQuote: 'Centrally positioned at the crossroads between the main trail and forest trail is the wooden cabin housing the Ranger Station.',
                evidenceTimestamp: 748,
                explanation: 'Tại ngã tư giữa đường mòn chính và đường xuyên rừng là trạm kiểm lâm (vị trí E).'
              },
              {
                id: 20,
                order: 20,
                questionText: 'Wildlife Photography Shelter',
                answer: 'C',
                evidenceQuote: 'Tucked away quietly at the far southeastern tip of the pine woods is the discreet Photography Shelter.',
                evidenceTimestamp: 775,
                explanation: 'Nằm ẩn mình ở góc cực Đông Nam của rừng thông là chòi chụp ảnh động vật hoang dã (vị trí C).'
              }
            ]
          }
        ]
      },
      {
        partNumber: 3,
        title: 'Part 3: Academic Research Project on Vertical Farming',
        context: 'Two undergraduate biology students, Maya and Liam, discussing their university assignment on sustainable urban agriculture.',
        audioTimestampStart: 791,
        audioTimestampEnd: 1220,
        speakers: [
          { name: 'Maya (Student)', gender: 'Female', accent: 'North American' },
          { name: 'Liam (Student)', gender: 'Male', accent: 'British' }
        ],
        questionGroups: [
          {
            id: 'qg-l3-1',
            type: 'pick_multiple',
            title: 'Questions 21–22',
            instruction: 'Choose TWO letters, A–E.\nWhich TWO advantages of vertical farming do both students agree on?',
            maxSelections: 2,
            options: [
              { key: 'A', text: 'Significant reduction in commercial water usage' },
              { key: 'B', text: 'Complete elimination of all initial capital equipment costs' },
              { key: 'C', text: 'Year-round crop yields independent of weather fluctuations' },
              { key: 'D', text: 'Zero requirement for artificial LED grow lighting' },
              { key: 'E', text: 'Instant worldwide adoption across all grain commodities' }
            ],
            questions: [
              {
                id: 21,
                order: 21,
                questionText: 'Advantage 1 agreed by both students',
                answer: 'A',
                acceptableAnswers: ['A', 'C'],
                evidenceQuote: 'Maya: The closed hydroponic loop recycles up to 95% of moisture! Liam: Yes, that water saving is undisputed.',
                evidenceTimestamp: 850,
                explanation: 'Cả hai sinh viên đều đồng ý rằng việc tiết kiệm nước (lên tới 95%) là ưu điểm vượt trội.'
              },
              {
                id: 22,
                order: 22,
                questionText: 'Advantage 2 agreed by both students',
                answer: 'C',
                acceptableAnswers: ['A', 'C'],
                evidenceQuote: 'Liam: You can harvest leafy vegetables in December just as reliably as in June because external storms do not matter. Maya: Absolutely, stable harvests all year round.',
                evidenceTimestamp: 895,
                explanation: 'Cả hai đồng thuận việc canh tác trong nhà mang lại mùa màng đều đặn quanh năm không lo thời tiết xấu.'
              }
            ]
          },
          {
            id: 'qg-l3-2',
            type: 'matching',
            title: 'Questions 23–26',
            instruction: 'What challenge is associated with each component of vertical farming systems?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 23–26.',
            options: [
              { key: 'A', text: 'High dependency on continuous electrical power' },
              { key: 'B', text: 'Vulnerability to rapid spread of bacterial pathogens in water' },
              { key: 'C', text: 'Lack of consumer acceptance due to perceived unnaturalness' },
              { key: 'D', text: 'Heavy weight placing stress on building structural foundations' },
              { key: 'E', text: 'Difficulty in calibrating automatic mineral dosage' },
              { key: 'F', text: 'Short lifespan of specialized optical sensor probes' }
            ],
            questions: [
              {
                id: 23,
                order: 23,
                questionText: 'Closed Hydroponic Reservoir',
                answer: 'B',
                evidenceQuote: 'Maya: If a root pathogen enters the circulating water tank, it infects every single plant within hours.',
                evidenceTimestamp: 960,
                explanation: 'Bình chứa nước tuần hoàn có rủi ro mầm bệnh lây lan cực nhanh sang toàn bộ cây trồng.'
              },
              {
                id: 24,
                order: 24,
                questionText: 'Full-Spectrum LED Arrays',
                answer: 'A',
                evidenceQuote: 'Liam: Keeping lights powered 16 hours a day creates huge electricity bills and leaves farmers crippled if a blackout strikes.',
                evidenceTimestamp: 1010,
                explanation: 'Dàn đèn LED tiêu thụ điện năng liên tục và phụ thuộc hoàn toàn vào nguồn điện.'
              },
              {
                id: 25,
                order: 25,
                questionText: 'Rooftop Multi-tier Racks',
                answer: 'D',
                evidenceQuote: 'Maya: Wet soil and water towers are incredibly dense; many historical city roofs simply cannot bear that physical load.',
                evidenceTimestamp: 1055,
                explanation: 'Các giàn nhiều tầng trên sân thượng quá nặng, gây áp lực lên kết cấu chịu lực của tòa nhà.'
              },
              {
                id: 26,
                order: 26,
                questionText: 'Marketed Packaged Produce',
                answer: 'C',
                evidenceQuote: 'Liam: Some organic shoppers still feel greens grown under neon lights without real sunlight are fake or sterile.',
                evidenceTimestamp: 1098,
                explanation: 'Một bộ phận người tiêu dùng vẫn ngần ngại vì cảm thấy rau trồng đèn nhân tạo thiếu tự nhiên.'
              }
            ]
          },
          {
            id: 'qg-l3-3',
            type: 'flow_chart',
            title: 'Questions 27–30',
            instruction: 'Complete the flow-chart below.\nWrite NO MORE THAN TWO WORDS for each answer.',
            headerTitle: 'EXPERIMENTAL TRIAL PROCEDURE',
            questions: [
              {
                id: 27,
                order: 27,
                questionText: 'Step 1: Select 50 uniform seedlings of ................ lettuce',
                prefixText: 'Step 1: Select 50 uniform seedlings of',
                suffixText: 'lettuce',
                answer: 'romaine',
                acceptableAnswers: ['romaine', 'Romaine'],
                evidenceQuote: 'We agreed to start the pilot trial using 50 uniform seedlings of crisp romaine lettuce.',
                evidenceTimestamp: 1140,
                explanation: 'Bước 1 sử dụng 50 cây xà lách romaine.'
              },
              {
                id: 28,
                order: 28,
                questionText: 'Step 2: Maintain constant ................ levels at 22 degrees Celsius',
                prefixText: 'Step 2: Maintain constant',
                suffixText: 'levels at 22 degrees Celsius',
                answer: 'temperature',
                acceptableAnswers: ['temperature', 'Temperature'],
                evidenceQuote: 'The climate control unit must keep the ambient temperature steady at 22 degrees Celsius.',
                evidenceTimestamp: 1170,
                explanation: 'Duy trì mức nhiệt độ (temperature) ổn định ở 22 độ C.'
              },
              {
                id: 29,
                order: 29,
                questionText: 'Step 3: Measure daily ................ uptake through digital flow meters',
                prefixText: 'Step 3: Measure daily',
                suffixText: 'uptake through digital flow meters',
                answer: 'nutrient',
                acceptableAnswers: ['nutrient', 'Nutrient', 'nutrients'],
                evidenceQuote: 'Using our digital flow meters, we will log daily nutrient uptake by each rack.',
                evidenceTimestamp: 1195,
                explanation: 'Đo lường lượng hấp thụ chất dinh dưỡng (nutrient uptake) hàng ngày.'
              },
              {
                id: 30,
                order: 30,
                questionText: 'Step 4: Present final comparative ................ to the tutorial group',
                prefixText: 'Step 4: Present final comparative',
                suffixText: 'to the tutorial group',
                answer: 'charts',
                acceptableAnswers: ['charts', 'Charts', 'graphs'],
                evidenceQuote: 'Finally, we compile our findings into comparative charts to present to our tutorial classmates.',
                evidenceTimestamp: 1215,
                explanation: 'Bước 4 tổng hợp các biểu đồ so sánh (charts) để trình bày trước nhóm học tập.'
              }
            ]
          }
        ]
      },
      {
        partNumber: 4,
        title: 'Part 4: Academic Lecture on Elephant Infrasonic Communication',
        context: 'A lecture by a behavioral ecologist examining low-frequency acoustic signaling in African savanna elephants.',
        audioTimestampStart: 1221,
        audioTimestampEnd: 1800,
        speakers: [
          { name: 'Dr. Alistair Finch (Lecturer)', gender: 'Male', accent: 'British' }
        ],
        questionGroups: [
          {
            id: 'qg-l4-1',
            type: 'note_completion',
            title: 'Questions 31–40',
            instruction: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
            headerTitle: 'ELEPHANT INFRASONIC COMMUNICATION',
            questions: [
              {
                id: 31,
                order: 31,
                questionText: 'Human auditory threshold begins above 20 Hertz, whereas elephants produce sounds in the ................ range.',
                prefixText: 'Human auditory threshold begins above 20 Hertz, whereas elephants produce sounds in the',
                suffixText: 'range.',
                answer: 'infrasound',
                acceptableAnswers: ['infrasound', 'infrasonic'],
                evidenceQuote: 'These deep rumbles drop well below 20 Hertz into the infrasound spectrum, undetectable by ordinary human ears.',
                evidenceTimestamp: 1290,
                explanation: 'Sóng âm của voi rơi vào dải hạ âm (infrasound) dưới 20 Hz mà tai người không nghe được.'
              },
              {
                id: 32,
                order: 32,
                questionText: 'Deep vibrations can propagate across distances of up to ten ................ under calm atmospheric conditions.',
                prefixText: 'Deep vibrations can propagate across distances of up to ten',
                suffixText: 'under calm atmospheric conditions.',
                answer: 'kilometres',
                acceptableAnswers: ['kilometres', 'kilometers', 'km'],
                evidenceQuote: 'When evening temperature inversions take place, these rumbles travel unimpeded for up to ten kilometres across the savanna.',
                evidenceTimestamp: 1345,
                explanation: 'Sóng âm có thể truyền xa tới mười kilômét (kilometres).'
              },
              {
                id: 33,
                order: 33,
                questionText: 'Elephants detect incoming ground waves through nerve receptors located inside their ................ pads.',
                prefixText: 'Elephants detect incoming ground waves through nerve receptors located inside their',
                suffixText: 'pads.',
                answer: 'foot',
                acceptableAnswers: ['foot', 'feet'],
                evidenceQuote: 'Pacinian corpuscles—densely packed tactile mechanoreceptors nestled within their spongy foot pads—detect ground tremors.',
                evidenceTimestamp: 1410,
                explanation: 'Voi cảm nhận chấn động truyền qua mặt đất nhờ thụ thể thần kinh ở đệm bàn chân (foot pads).'
              },
              {
                id: 34,
                order: 34,
                questionText: 'Vibrations travel upward through the elephant’s leg bones directly into the middle ................ cavities.',
                prefixText: 'Vibrations travel upward through the elephant’s leg bones directly into the middle',
                suffixText: 'cavities.',
                answer: 'ear',
                acceptableAnswers: ['ear', 'Ear'],
                evidenceQuote: 'Seismic signals travel up the skeletal column, channeled straight into the hypertrophied middle ear cavities.',
                evidenceTimestamp: 1465,
                explanation: 'Chấn động truyền qua xương chân thẳng vào khoang tai giữa (middle ear).'
              },
              {
                id: 35,
                order: 35,
                questionText: 'Vocal rumbles are used by the herd matriarch to signal immediate ................ to younger calves.',
                prefixText: 'Vocal rumbles are used by the herd matriarch to signal immediate',
                suffixText: 'to younger calves.',
                answer: 'danger',
                acceptableAnswers: ['danger', 'Danger'],
                evidenceQuote: 'The experienced matriarch emits a sharp low growl to warn calves of imminent danger, such as nearby predators.',
                evidenceTimestamp: 1520,
                explanation: 'Tiếng gầm trầm được voi đầu đàn dùng để cảnh báo mối nguy hiểm (danger) tức thì.'
              },
              {
                id: 36,
                order: 36,
                questionText: 'Separated family groups coordinate their travel directions towards distant ................ holes.',
                prefixText: 'Separated family groups coordinate their travel directions towards distant',
                suffixText: 'holes.',
                answer: 'water',
                acceptableAnswers: ['water', 'Water'],
                evidenceQuote: 'Satellite tracking demonstrates herds miles apart synchronizing marches towards vital water holes.',
                evidenceTimestamp: 1575,
                explanation: 'Các đàn voi điều hướng di chuyển để hội tụ về các hố nước (water holes).'
              },
              {
                id: 37,
                order: 37,
                questionText: 'During mating seasons, female elephants announce their reproductive status via ................ calls.',
                prefixText: 'During mating seasons, female elephants announce their reproductive status via',
                suffixText: 'calls.',
                answer: 'estrus',
                acceptableAnswers: ['estrus', 'oestrus'],
                evidenceQuote: 'Receptive females vocalize powerful estrus calls that summon competitive dominant bulls across regional territories.',
                evidenceTimestamp: 1630,
                explanation: 'Voi cái phát ra tiếng gọi động dục (estrus calls) trong mùa giao phối.'
              },
              {
                id: 38,
                order: 38,
                questionText: 'Human urban expansion creates continuous acoustic ................ that masks elephant signaling.',
                prefixText: 'Human urban expansion creates continuous acoustic',
                suffixText: 'that masks elephant signaling.',
                answer: 'pollution',
                acceptableAnswers: ['pollution', 'Pollution'],
                evidenceQuote: 'Mining drills, highway traffic, and low-flying aircraft contribute severe acoustic pollution that drowns out natural seismic cues.',
                evidenceTimestamp: 1685,
                explanation: 'Tiếng ồn đô thị tạo ra ô nhiễm âm thanh (acoustic pollution) làm át tín hiệu của voi.'
              },
              {
                id: 39,
                order: 39,
                questionText: 'Seismic sensors originally developed for monitoring ................ are now used to safeguard herds against poachers.',
                prefixText: 'Seismic sensors originally developed for monitoring',
                suffixText: 'are now used to safeguard herds against poachers.',
                answer: 'earthquakes',
                acceptableAnswers: ['earthquakes', 'earthquake'],
                evidenceQuote: 'Instruments originally fabricated to record miniature earthquakes have been repurposed along national park borders.',
                evidenceTimestamp: 1735,
                explanation: 'Cảm biến chấn địa vốn dùng để theo dõi động đất (earthquakes) nay được dùng để chống lâm tặc săn trộm.'
              },
              {
                id: 40,
                order: 40,
                questionText: 'Conserving regional elephant populations requires preserving uninterrupted ecological ................ corridors.',
                prefixText: 'Conserving regional elephant populations requires preserving uninterrupted ecological',
                suffixText: 'corridors.',
                answer: 'migration',
                acceptableAnswers: ['migration', 'Migration'],
                evidenceQuote: 'Ultimately, we must safeguard open migration corridors so these intelligent creatures can maintain their ancient acoustic dialogue.',
                evidenceTimestamp: 1775,
                explanation: 'Bảo tồn voi đòi hỏi phải giữ vững các hành lang di cư (migration corridors) sinh thái thông suốt.'
              }
            ]
          }
        ]
      }
    ]
  }
];
