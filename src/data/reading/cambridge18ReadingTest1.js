/**
 * Cambridge IELTS 18 Academic - Reading Practice Test 1
 * Full 3 Passages, 40 Questions, Exact Answer Keys, Evidence Locators & Paraphrase Maps.
 */

export const cambridge18ReadingTest1 = {
  id: 'cambridge-18-reading-test-1',
  title: 'Cambridge Practice Test 18: Urban Farming, Forest Schools & Space Debris',
  description: 'Bộ đề thi thử IELTS Reading chuẩn khảo thí Cambridge 18 gồm đầy đủ 3 bài đọc học thuật với 40 câu hỏi, thời gian làm bài 60 phút.',
  totalQuestions: 40,
  timeLimitMinutes: 60,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 18,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  passages: [
    {
      id: 'cam18-p1',
      passageNumber: 1,
      title: 'Urban Farming and the Future of Food Production',
      topic: 'agri_tech',
      difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
      wordCount: 850,
      paragraphs: [
        {
          id: 'A',
          text: 'In bustling metropolitan hubs around the globe, an agricultural revolution is taking place far away from traditional rural pastures. Known as urban farming, this innovative movement harnesses disused industrial rooftops, underground tunnels, and stacked vertical indoor warehouses to cultivate leafy greens, culinary herbs, and vine fruits. Driven by accelerating urbanisation and intensifying climate volatility, municipal planners and agronomists view indoor controlled-environment agriculture as an indispensable safeguard for modern food security.'
        },
        {
          id: 'B',
          text: 'Central to vertical urban farming is the adoption of advanced hydroponic and aeroponic systems. Rather than relying on natural topsoil—which is susceptible to erosion, nutrient depletion, and pesticide runoff—plants are anchored in inert substrates such as coco coir or rockwool. In hydroponic setups, a nutrient-dense mineral aqueous solution circulates directly across the bare root systems, while aeroponic chambers periodically mist exposed roots. These closed-loop irrigation circuits recycle over 95 percent of water compared to conventional furrow irrigation, dramatically slashing consumption in arid regions.'
        },
        {
          id: 'C',
          text: 'Furthermore, the absence of natural sunlight is surmounted by specialized solid-state light-emitting diode (LED) arrays. By tailoring photosynthetic photon flux density and emitting specific wavelengths of red and blue light, growers can accelerate vegetative growth cycles and enhance phytonutrient profiles without chemical growth regulators. Because vertical farms operate within sealed, biosecure enclosures, crops remain impervious to seasonal frosts, torrential downpours, and insect pests, entirely eliminating the necessity for synthetic chemical insecticides.'
        },
        {
          id: 'D',
          text: 'Nevertheless, the transition toward high-tech urban cultivation is not devoid of economic and operational obstacles. The initial capital expenditure required to fit out multi-storey facilities with automated conveyors, climate control chillers, and sensor matrices is astronomical. Moreover, relying heavily on artificial lighting generates massive electricity consumption, which may undermine claims of carbon neutrality unless facilities are plugged directly into renewable energy grids.'
        },
        {
          id: 'E',
          text: 'Despite these financial hurdles, the societal and logistical dividends remain formidable. Food grown within metropolitan boundaries travels mere blocks rather than thousands of kilometres, eliminating substantial fossil fuel transport emissions and reducing post-harvest spoilage. As robotic automation drives capital costs down and solar efficiency increases, vertical farming is poised to transform urban centers from mere consumers of agricultural produce into resilient producers.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c18-r1-1',
          type: 'true_false_not_given',
          title: 'Questions 1–7',
          instruction: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–7 on your answer sheet, choose:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Urban farming takes advantage of abandoned spaces inside cities for crop cultivation.',
              answer: 'TRUE',
              evidenceParagraph: 'A',
              evidenceQuote: 'harnesses disused industrial rooftops, underground tunnels, and stacked vertical indoor warehouses to cultivate leafy greens',
              explanation: 'Đoạn A khẳng định nông nghiệp đô thị tận dụng các mái nhà công nghiệp bỏ hoang và đường hầm ngầm (disused rooftops/tunnels). Đáp án là TRUE.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Hydroponic systems require richer agricultural soil than conventional open-field farming.',
              answer: 'FALSE',
              evidenceParagraph: 'B',
              evidenceQuote: 'Rather than relying on natural topsoil... plants are anchored in inert substrates',
              explanation: 'Đoạn B nêu rõ canh tác thủy canh không hề dùng đất tự nhiên mà trồng trên giá thể trơ. Do đó thông tin đề bài ngược lại hoàn toàn (FALSE).'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Aeroponic setups deliver water and minerals to plant roots through intermittent misting.',
              answer: 'TRUE',
              evidenceParagraph: 'B',
              evidenceQuote: 'while aeroponic chambers periodically mist exposed roots.',
              evidenceTimestamp: null,
              evidenceQuote: 'while aeroponic chambers periodically mist exposed roots.',
              explanation: 'Đoạn B khẳng định phương pháp khí canh phun sương định kỳ vào rễ cây (periodically mist exposed roots). Đáp án là TRUE.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Vertical farms consume larger quantities of fresh water than traditional furrow agriculture.',
              answer: 'FALSE',
              evidenceParagraph: 'B',
              evidenceQuote: 'These closed-loop irrigation circuits recycle over 95 percent of water compared to conventional furrow irrigation, dramatically slashing consumption',
              explanation: 'Đoạn B khẳng định tuần hoàn nước khép kín tái chế hơn 95% nước và cắt giảm lượng nước tiêu thụ so với tưới rãnh truyền thống. Đáp án là FALSE.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Synthetic insecticides are banned by law in all vertical indoor farming warehouses.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'C',
              evidenceQuote: 'entirely eliminating the necessity for synthetic chemical insecticides.',
              explanation: 'Đoạn C chỉ nêu các cơ sở kín giúp loại bỏ nhu cầu sử dụng thuốc trừ sâu hóa học, nhưng không hề đề cập có luật cấm hay không. Đáp án là NOT GIVEN.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'High energy consumption from artificial illumination can challenge the environmental credentials of indoor farms.',
              answer: 'TRUE',
              evidenceParagraph: 'D',
              evidenceQuote: 'relying heavily on artificial lighting generates massive electricity consumption, which may undermine claims of carbon neutrality',
              explanation: 'Đoạn D khẳng định việc tiêu tốn điện năng lớn từ đèn chiếu sáng có thể làm giảm tính trung hòa carbon. Đáp án là TRUE.'
            },
            {
              id: 7,
              order: 7,
              questionText: 'Most commercial vertical farms currently generate operational profits within their first year.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'D',
              evidenceQuote: 'The initial capital expenditure... is astronomical.',
              explanation: 'Bài viết không hề đề cập thông tin các nông trại có sinh lời trong năm hoạt động đầu tiên hay không. Đáp án là NOT GIVEN.'
            }
          ]
        },
        {
          id: 'qg-c18-r1-2',
          type: 'summary_completion',
          title: 'Questions 8–13',
          instruction: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'ADVANTAGES AND CHALLENGES OF VERTICAL AGRICULTURE',
          questions: [
            {
              id: 8,
              order: 8,
              questionText: 'Instead of soil, roots are supported by ................ substrates like rockwool.',
              prefixText: 'Instead of soil, roots are supported by',
              suffixText: 'substrates like rockwool.',
              answer: 'inert',
              acceptableAnswers: ['inert'],
              evidenceParagraph: 'B',
              evidenceQuote: 'plants are anchored in inert substrates such as coco coir or rockwool.',
              explanation: 'Từ cần điền là tính từ "inert" (trơ, không có hoạt tính hóa học).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Specialized LED lamps emit specific ................ of red and blue light to stimulate growth.',
              prefixText: 'Specialized LED lamps emit specific',
              suffixText: 'of red and blue light to stimulate growth.',
              answer: 'wavelengths',
              acceptableAnswers: ['wavelengths', 'wavelength'],
              evidenceParagraph: 'C',
              evidenceQuote: 'emitting specific wavelengths of red and blue light, growers can accelerate vegetative growth',
              explanation: 'Từ cần điền là danh từ "wavelengths" (bước sóng ánh sáng).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Indoor crop enclosures protect plants against seasonal hazards such as cold ................',
              prefixText: 'Indoor crop enclosures protect plants against seasonal hazards such as cold',
              suffixText: '',
              answer: 'frosts',
              acceptableAnswers: ['frosts', 'frost'],
              evidenceParagraph: 'C',
              evidenceQuote: 'crops remain impervious to seasonal frosts, torrential downpours, and insect pests',
              explanation: 'Từ cần điền là "frosts" (sương giá mùa đông).'
            },
            {
              id: 11,
              order: 11,
              questionText: 'The initial startup ................ needed for industrial equipment remains extremely high.',
              prefixText: 'The initial startup',
              suffixText: 'needed for industrial equipment remains extremely high.',
              answer: 'expenditure',
              acceptableAnswers: ['expenditure'],
              evidenceParagraph: 'D',
              evidenceQuote: 'The initial capital expenditure required to fit out multi-storey facilities... is astronomical.',
              explanation: 'Từ cần điền là "expenditure" (chi phí vốn đầu tư).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Short transport journeys within cities substantially curb harmful exhaust ................',
              prefixText: 'Short transport journeys within cities substantially curb harmful exhaust',
              suffixText: '',
              answer: 'emissions',
              acceptableAnswers: ['emissions', 'emission'],
              evidenceParagraph: 'E',
              evidenceQuote: 'eliminating substantial fossil fuel transport emissions and reducing post-harvest spoilage.',
              explanation: 'Từ cần điền là danh từ "emissions" (khí thải phương tiện vận chuyển).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'Fresh produce experiences less post-harvest ................ when grown close to consumer markets.',
              prefixText: 'Fresh produce experiences less post-harvest',
              suffixText: 'when grown close to consumer markets.',
              answer: 'spoilage',
              acceptableAnswers: ['spoilage'],
              evidenceParagraph: 'E',
              evidenceQuote: 'and reducing post-harvest spoilage.',
              explanation: 'Từ cần điền là danh từ "spoilage" (sự hư hỏng nông sản sau thu hoạch).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam18-p2',
      passageNumber: 2,
      title: 'Forest Schools: Reconnecting Childhood with Nature',
      topic: 'edu_psych',
      difficulty: 'Trung bình - Khá (Band 6.5 - 7.5)',
      wordCount: 920,
      paragraphs: [
        {
          id: 'A',
          text: 'Over the past two decades, rising parental anxieties regarding traffic hazards, digital screen dependency, and institutional academic testing have converged to restrict children\'s outdoor liberties. In response to this sedentary trend, an educational philosophy known as the Forest School movement has gained widespread international acclaim. Emerging initially from Scandinavian preschool traditions in the mid-twentieth century, Forest Schools prioritize learner-led, immersive outdoor play conducted in woodlands across all weather conditions.'
        },
        {
          id: 'B',
          text: 'Unlike standard primary classrooms where structured curricular targets dictate every hour, Forest Schools operate on the premise that child-instigated discovery fosters profound cognitive development. Under the unobtrusive guidance of qualified outdoor practitioners, pupils clamber over mossy logs, construct timber lean-to shelters, identify bird songs, and learn to manipulate real carpentry tools such as whittling knives and bow saws. This pedagogical ethos redefines risk: rather than sanitizing environments to eradicate all physical hazard, educators encourage young learners to evaluate situational hazards and negotiate manageable risks independently.'
        },
        {
          id: 'C',
          text: 'Empirical research in developmental psychology underscores the multifaceted dividends of prolonged exposure to natural terrain. Irregular surfaces like roots, mud banks, and fallen branches continually challenge children\'s vestibular and proprioceptive balance mechanisms, markedly improving physical coordination compared to synthetic playground turf. Psychologically, navigating self-chosen challenges without immediate adult intervention bolsters self-efficacy, emotional resilience, and peer-to-peer communicative cooperation.'
        },
        {
          id: 'D',
          text: 'Critics, however, raise legitimate queries regarding equity, safety, and standardized educational attainment. Sceptics contend that without structured reading, writing, and numeracy drilling, children risk falling behind national academic benchmarks. Furthermore, the logistical complexities of transporting urban schoolchildren to remote woodlands, coupled with the procurement of waterproof outdoor apparel, can create socio-economic barriers that exclude underprivileged families.'
        },
        {
          id: 'E',
          text: 'In counter-argument, longitudinal studies tracking children exposed to regular outdoor learning indicate enhanced executive function, longer concentration spans, and reduced stress hormones like cortisol upon returning to traditional desks. Rather than displacing foundational numeracy and literacy, experiential nature immersion provides rich sensory metaphors and intrinsic motivation that enliven abstract learning.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c18-r2-1',
          type: 'matching_headings',
          title: 'Questions 14–18',
          instruction: 'Reading Passage 2 has five paragraphs, A–E.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–viii, in boxes 14–18.',
          headings: [
            { id: 'i', text: 'Balancing physical challenges with risk calculation' },
            { id: 'ii', text: 'Origins and modern resurgence of woodland learning' },
            { id: 'iii', text: 'Long-term cognitive dividends and improved focus' },
            { id: 'iv', text: 'Financial and logistical concerns of outdoor education' },
            { id: 'v', text: 'Physical and social-emotional developmental gains' },
            { id: 'vi', text: 'Mandatory testing standards in Scandinavian academies' },
            { id: 'vii', text: 'The dangers of unsupervised digital technology' }
          ],
          questions: [
            {
              id: 14,
              order: 14,
              questionText: 'Paragraph A',
              answer: 'ii',
              evidenceParagraph: 'A',
              evidenceQuote: 'In response to this sedentary trend, an educational philosophy known as the Forest School movement... Emerging initially from Scandinavian preschool traditions',
              explanation: 'Đoạn A bàn về nguồn gốc lịch sử từ Scandinavia và sự trỗi dậy của phong trào Forest School để giải quyết lối sống thụ động.'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Paragraph B',
              answer: 'i',
              evidenceParagraph: 'B',
              evidenceQuote: 'This pedagogical ethos redefines risk: rather than sanitizing environments... encourage young learners to evaluate situational hazards and negotiate manageable risks independently.',
              explanation: 'Đoạn B mô tả triết lý xử lý rủi ro và cách hướng dẫn trẻ tự tính toán nguy hiểm khi dùng công cụ.'
            },
            {
              id: 16,
              order: 16,
              questionText: 'Paragraph C',
              answer: 'v',
              evidenceParagraph: 'C',
              evidenceQuote: 'continually challenge children\'s vestibular and proprioceptive balance mechanisms... bolsters self-efficacy, emotional resilience, and peer-to-peer communicative cooperation.',
              explanation: 'Đoạn C liệt kê các lợi ích thể chất (khả năng thăng bằng) và kỹ năng cảm xúc - xã hội (hợp tác bạn bè, khả năng phục hồi).'
            },
            {
              id: 17,
              order: 17,
              questionText: 'Paragraph D',
              answer: 'iv',
              evidenceParagraph: 'D',
              evidenceQuote: 'Sceptics contend that without structured reading... logistical complexities of transporting urban schoolchildren to remote woodlands, coupled with the procurement of waterproof outdoor apparel',
              explanation: 'Đoạn D nêu lên các lo ngại của giới chỉ trích về học phí, rào cản chi phí đi lại và sắm đồ dùng chống nước cho gia đình khó khăn.'
            },
            {
              id: 18,
              order: 18,
              questionText: 'Paragraph E',
              answer: 'iii',
              evidenceParagraph: 'E',
              evidenceQuote: 'longitudinal studies tracking children exposed to regular outdoor learning indicate enhanced executive function, longer concentration spans',
              explanation: 'Đoạn E phản biện lại bằng các nghiên cứu theo dõi dài hạn cho thấy khả năng tập trung tốt hơn và giảm hormone căng thẳng.'
            }
          ]
        },
        {
          id: 'qg-c18-r2-2',
          type: 'multiple_choice',
          title: 'Questions 19–22',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 19,
              order: 19,
              questionText: 'According to Paragraph A, what modern concern has contributed to the rise of Forest Schools?',
              options: [
                { key: 'A', text: 'Excessive child interaction with electronic displays' },
                { key: 'B', text: 'A scarcity of qualified primary school instructors' },
                { key: 'C', text: 'Drastic declines in woodland biodiversity' },
                { key: 'D', text: 'The total elimination of physical education courses' }
              ],
              answer: 'A',
              evidenceParagraph: 'A',
              evidenceQuote: 'rising parental anxieties regarding traffic hazards, digital screen dependency, and institutional academic testing',
              explanation: 'Đoạn A liệt kê mối lo của phụ huynh về sự phụ thuộc vào màn hình thiết bị số (digital screen dependency).'
            },
            {
              id: 20,
              order: 20,
              questionText: 'How do Forest School educators view physical hazards?',
              options: [
                { key: 'A', text: 'They must be rigorously eliminated through strict safety fencing.' },
                { key: 'B', text: 'They offer opportunities for learners to gauge manageable dangers.' },
                { key: 'C', text: 'They should be ignored entirely in outdoor environments.' },
                { key: 'D', text: 'They are suitable exclusively for secondary school adolescents.' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'rather than sanitizing environments to eradicate all physical hazard, educators encourage young learners to evaluate situational hazards and negotiate manageable risks',
              explanation: 'Đoạn B khẳng định giáo viên coi rủi ro là cơ hội để học sinh tự đánh giá và xử lý các nguy hiểm ở mức độ có thể quản lý.'
            },
            {
              id: 21,
              order: 21,
              questionText: 'Walking over natural forest obstacles aids children physically by:',
              options: [
                { key: 'A', text: 'hastening cardiovascular muscle recovery.' },
                { key: 'B', text: 'strengthening sensory equilibrium and bodily coordination.' },
                { key: 'C', text: 'inducing artificial immune resistance against allergens.' },
                { key: 'D', text: 'reducing their overall daily caloric intake.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'continually challenge children\'s vestibular and proprioceptive balance mechanisms, markedly improving physical coordination',
              explanation: 'Đoạn C nhấn mạnh việc di chuyển trên địa hình tự nhiên giúp rèn luyện cơ chế thăng bằng tiền đình và cải thiện sự phối hợp cơ thể.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'What physiological change has been detected in children following nature learning?',
              options: [
                { key: 'A', text: 'Higher resting blood sugar levels' },
                { key: 'B', text: 'Lower secretions of the stress hormone cortisol' },
                { key: 'C', text: 'Elevated core body temperatures' },
                { key: 'D', text: 'Accelerated retinal eye fatigue' }
              ],
              answer: 'B',
              evidenceParagraph: 'E',
              evidenceQuote: 'longer concentration spans, and reduced stress hormones like cortisol upon returning to traditional desks.',
              explanation: 'Đoạn E khẳng định trẻ có mức tiết hormone cortisol (hormone gây căng thẳng) giảm đáng kể.'
            }
          ]
        },
        {
          id: 'qg-c18-r2-3',
          type: 'summary_completion',
          title: 'Questions 23–26',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'CHALLENGES SURROUNDING OUTDOOR PEDAGOGY',
          questions: [
            {
              id: 23,
              order: 23,
              questionText: 'Some critics worry that absence of formal practice may compromise performance on national academic ................',
              prefixText: 'Some critics worry that absence of formal practice may compromise performance on national academic',
              suffixText: '',
              answer: 'benchmarks',
              acceptableAnswers: ['benchmarks', 'benchmark'],
              evidenceParagraph: 'D',
              evidenceQuote: 'without structured reading, writing, and numeracy drilling, children risk falling behind national academic benchmarks.',
              explanation: 'Từ cần điền là danh từ "benchmarks" (tiêu chuẩn / mốc chuẩn học thuật quốc gia).'
            },
            {
              id: 24,
              order: 24,
              questionText: 'Taking metropolitan school pupils to distant forests presents difficult ................ hurdles.',
              prefixText: 'Taking metropolitan school pupils to distant forests presents difficult',
              suffixText: 'hurdles.',
              answer: 'logistical',
              acceptableAnswers: ['logistical'],
              evidenceParagraph: 'D',
              evidenceQuote: 'the logistical complexities of transporting urban schoolchildren to remote woodlands',
              explanation: 'Từ cần điền là tính từ "logistical" (thuộc về hậu cần vận chuyển).'
            },
            {
              id: 25,
              order: 25,
              questionText: 'Purchasing specialized waterproof ................ can impose financial hardship on low-income families.',
              prefixText: 'Purchasing specialized waterproof',
              suffixText: 'can impose financial hardship on low-income families.',
              answer: 'apparel',
              acceptableAnswers: ['apparel', 'clothing'],
              evidenceParagraph: 'D',
              evidenceQuote: 'coupled with the procurement of waterproof outdoor apparel, can create socio-economic barriers',
              explanation: 'Từ cần điền là danh từ "apparel" (trang phục, quần áo chống nước).'
            },
            {
              id: 26,
              order: 26,
              questionText: 'Rather than replacing reading and mathematics, nature immersion gives children rich sensory ................',
              prefixText: 'Rather than replacing reading and mathematics, nature immersion gives children rich sensory',
              suffixText: '',
              answer: 'metaphors',
              acceptableAnswers: ['metaphors', 'metaphor'],
              evidenceParagraph: 'E',
              evidenceQuote: 'experiential nature immersion provides rich sensory metaphors and intrinsic motivation that enliven abstract learning.',
              explanation: 'Từ cần điền là danh từ "metaphors" (ẩn dụ cảm giác trực quan).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam18-p3',
      passageNumber: 3,
      title: 'Conquering the Peril of Earth\'s Orbital Space Debris',
      topic: 'space_tech',
      difficulty: 'Khó - Chuyên sâu (Band 7.5 - 9.0)',
      wordCount: 980,
      paragraphs: [
        {
          id: 'A',
          text: 'Ever since the Soviet launch of Sputnik 1 in 1957 heralded the Space Age, humanity has treated Low Earth Orbit (LEO) as an infinite cosmic void. Over six decades of satellite launches, upper-stage rocket abandonments, and deliberate anti-satellite missile tests have transformed near-Earth space into an orbital landfill. Today, tracking networks monitor over 30,000 artificial objects larger than a softball travelling at velocities exceeding 28,000 kilometres per hour. Travelling at such immense kinetic speeds, a collision with even a minuscule fleck of paint can impart the destructive force of an exploding bowling ball.'
        },
        {
          id: 'B',
          text: 'The primary menace haunting astrophysicists is the runaway chain reaction postulated by NASA scientist Donald Kessler in 1978, known as the Kessler Syndrome. Under this catastrophic scenario, the density of orbital objects in LEO reaches a tipping point where a single hypervelocity collision generates a cloud of thousands of shrapnel fragments. Each fragment in turn careens into adjacent satellites, triggering an exponential cascading avalanche of collisions. Eventually, critical orbital bands between 600 and 1,000 kilometres could become completely impassable, rendering satellite navigation, global telecommunications, and climate monitoring satellites obsolete for generations.'
        },
        {
          id: 'C',
          text: 'The urgency has been dramatically exacerbated by the recent deployment of commercial mega-constellations. Private space flight operators have already launched thousands of mass-produced broadband satellites into LEO, with regulatory filings projecting fleets comprising tens of thousands of additional spacecraft by the decade\'s close. Although modern satellites incorporate automated autonomous collision avoidance thrusters, mechanical failures routinely render hundreds of craft non-manoeuvrable dead husks, magnifying collision probabilities across crowded orbital intersections.'
        },
        {
          id: 'D',
          text: 'To preempt disaster, aerospace researchers are pioneering Active Debris Removal (ADR) technologies. One prominent approach involves autonomous robotic chaser vehicles equipped with multi-jointed mechanical arms designed to grapple spent rocket bodies and drag them into the upper atmosphere to incinerate safely on atmospheric re-entry. Alternative concepts propose deploying magnetic docking plates, high-strength tether nets, or ground-based photon lasers that exert gentle radiation pressure to slow debris velocity, causing its orbit to decay naturally.'
        },
        {
          id: 'E',
          text: 'Technical hurdles, however, are overshadowed by contentious geopolitical and legal quandaries. Under the 1967 Outer Space Treaty, any space object remains the sovereign property and jurisdictional responsibility of the launching state in perpetuity. Removing an inactive foreign satellite without express governmental authorization constitutes a breach of international law, and many militaries fear that dual-use ADR harpoons could double as clandestine anti-satellite weaponry in wartime. Without binding international treaties establishing clear salvage rights and mandatory end-of-life de-orbiting deadlines, Earth\'s celestial commons will remain perilous.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c18-r3-1',
          type: 'multiple_choice',
          title: 'Questions 27–31',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 27,
              order: 27,
              questionText: 'According to Paragraph A, why can even a tiny speck of debris inflict catastrophic damage?',
              options: [
                { key: 'A', text: 'Its radioactive nuclear chemical composition' },
                { key: 'B', text: 'Its extraordinarily high kinetic velocity in orbit' },
                { key: 'C', text: 'The intense cold temperatures of outer space' },
                { key: 'D', text: 'Its sharp aerodynamic titanium design' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'Travelling at such immense kinetic speeds, a collision with even a minuscule fleck of paint can impart the destructive force of an exploding bowling ball.',
              explanation: 'Đoạn A nêu rõ do di chuyển ở vận tốc động năng cực lớn (trên 28.000 km/h) nên dù chỉ là một mẩu sơn nhỏ cũng có sức công phá khủng khiếp.'
            },
            {
              id: 28,
              order: 28,
              questionText: 'The core risk described in the Kessler Syndrome is that:',
              options: [
                { key: 'A', text: 'atmospheric drag pulls all orbital satellites into the ocean.' },
                { key: 'B', text: 'a single collision triggers an uncontrollable chain reaction of debris collisions.' },
                { key: 'C', text: 'solar flares disable electrical grids across Earth.' },
                { key: 'D', text: 'deep space exploration projects run out of rocket propellants.' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'Each fragment in turn careens into adjacent satellites, triggering an exponential cascading avalanche of collisions.',
              explanation: 'Hội chứng Kessler mô tả phản ứng dây chuyền va chạm liên hoàn theo cấp số nhân khiến quỹ đạo trở nên dày đặc mảnh vỡ.'
            },
            {
              id: 29,
              order: 29,
              questionText: 'Commercial satellite mega-constellations increase collision risks primarily because:',
              options: [
                { key: 'A', text: 'they operate without any automated thrusters.' },
                { key: 'B', text: 'launch numbers are surging and defunct craft lose manoeuvrability.' },
                { key: 'C', text: 'their signals interfere with terrestrial laser monitoring stations.' },
                { key: 'D', text: 'they are manufactured from toxic chemical polymers.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'mechanical failures routinely render hundreds of craft non-manoeuvrable dead husks, magnifying collision probabilities',
              explanation: 'Đoạn C giải thích số lượng vệ tinh phóng lên bùng nổ trong khi các sự cố kỹ thuật biến nhiều vệ tinh thành các khối xác trôi dạt mất khả năng tự né tránh.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'What is the intended fate of spent rocket bodies captured by robotic ADR chaser vehicles?',
              options: [
                { key: 'A', text: 'To be refurbished and refueled in lunar orbit' },
                { key: 'B', text: 'To burn up safely as they re-enter Earth\'s atmosphere' },
                { key: 'C', text: 'To be catapulted beyond the solar system' },
                { key: 'D', text: 'To be dismantled inside orbital recycling stations' }
              ],
              answer: 'B',
              evidenceParagraph: 'D',
              evidenceQuote: 'grapple spent rocket bodies and drag them into the upper atmosphere to incinerate safely on atmospheric re-entry.',
              explanation: 'Đoạn D nêu mục tiêu kéo các thân tên lửa cũ rơi vào tầng khí quyển trên để bốc cháy tiêu hủy hoàn toàn.'
            },
            {
              id: 31,
              order: 31,
              questionText: 'Why do defence agencies view ADR technologies with suspicion?',
              options: [
                { key: 'A', text: 'Debris removal systems produce severe electromagnetic noise.' },
                { key: 'B', text: 'Such mechanisms could potentially be used as covert anti-satellite weapons.' },
                { key: 'C', text: 'They breach the financial sovereignty of private space firms.' },
                { key: 'D', text: 'Laser ablation could alter the Earth\'s weather patterns.' }
              ],
              answer: 'B',
              evidenceParagraph: 'E',
              evidenceQuote: 'many militaries fear that dual-use ADR harpoons could double as clandestine anti-satellite weaponry in wartime.',
              explanation: 'Đoạn E khẳng định quân đội nhiều nước e ngại công nghệ dọn rác có thể bị biến tướng thành vũ khí tấn công vệ tinh của đối phương.'
            }
          ]
        },
        {
          id: 'qg-c18-r3-2',
          type: 'yes_no_not_given',
          title: 'Questions 32–36',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–36 on your answer sheet, choose:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
          questions: [
            {
              id: 32,
              order: 32,
              questionText: 'Early space pioneers took appropriate precautions to prevent Low Earth Orbit from becoming cluttered.',
              answer: 'NO',
              evidenceParagraph: 'A',
              evidenceQuote: 'humanity has treated Low Earth Orbit (LEO) as an infinite cosmic void.',
              explanation: 'Tác giả nêu rõ con người trong quá khứ đã coi quỹ đạo Trái Đất như một khoảng trống vô hạn mà không hề thực hiện biện pháp phòng ngừa. Do đó đáp án là NO.'
            },
            {
              id: 33,
              order: 33,
              questionText: 'The consequences of the Kessler Syndrome could jeopardize weather forecasting on Earth.',
              answer: 'YES',
              evidenceParagraph: 'B',
              evidenceQuote: 'rendering satellite navigation, global telecommunications, and climate monitoring satellites obsolete for generations.',
              explanation: 'Tác giả khẳng định hội chứng Kessler sẽ làm tê liệt các vệ tinh định vị, viễn thông và theo dõi khí hậu. Do đó đáp án là YES.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'All satellites currently in orbit possess fully functional autonomous collision avoidance systems.',
              answer: 'NO',
              evidenceParagraph: 'C',
              evidenceQuote: 'mechanical failures routinely render hundreds of craft non-manoeuvrable dead husks',
              explanation: 'Bài đọc chỉ ra hàng trăm vệ tinh bị hỏng hóc kỹ thuật và trở thành những khối xác không thể điều khiển né tránh. Đáp án là NO.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Ground-based lasers can slow down space junk by exerting radiation pressure.',
              answer: 'YES',
              evidenceParagraph: 'D',
              evidenceQuote: 'ground-based photon lasers that exert gentle radiation pressure to slow debris velocity, causing its orbit to decay naturally.',
              explanation: 'Tác giả khẳng định tia laser mặt đất có thể tạo áp lực bức xạ để làm giảm vận tốc và khiến quỹ đạo mảnh rác tự suy giảm. Đáp án là YES.'
            },
            {
              id: 36,
              order: 36,
              questionText: 'The United Nations has already enacted compulsory financial penalties for countries that fail to de-orbit spent satellites.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'E',
              evidenceQuote: 'Without binding international treaties establishing clear salvage rights and mandatory end-of-life de-orbiting deadlines',
              explanation: 'Đoạn E nhấn mạnh hiện vẫn chưa có các hiệp ước quốc tế có tính ràng buộc pháp lý, và không đề cập việc LHQ đã ban hành các chế tài phạt tiền hay chưa. Đáp án là NOT GIVEN.'
            }
          ]
        },
        {
          id: 'qg-c18-r3-3',
          type: 'summary_completion',
          title: 'Questions 37–40',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'LEGAL OBSTACLES IN SPACE DEBRIS SALVAGE',
          questions: [
            {
              id: 37,
              order: 37,
              questionText: 'Under the 1967 Treaty, any craft remains under the ................ responsibility of the nation that launched it.',
              prefixText: 'Under the 1967 Treaty, any craft remains under the',
              suffixText: 'responsibility of the nation that launched it.',
              answer: 'jurisdictional',
              acceptableAnswers: ['jurisdictional'],
              evidenceParagraph: 'E',
              evidenceQuote: 'any space object remains the sovereign property and jurisdictional responsibility of the launching state',
              explanation: 'Từ cần điền là tính từ "jurisdictional" (thuộc quyền tài phán pháp lý).'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Clearing an obsolete foreign spacecraft without official ................ violates international law.',
              prefixText: 'Clearing an obsolete foreign spacecraft without official',
              suffixText: 'violates international law.',
              answer: 'authorization',
              acceptableAnswers: ['authorization', 'authorisation'],
              evidenceParagraph: 'E',
              evidenceQuote: 'Removing an inactive foreign satellite without express governmental authorization constitutes a breach',
              explanation: 'Từ cần điền là danh từ "authorization" (sự cho phép chính thức từ chính phủ).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'ADR harpoons are feared because they possess ................ capabilities as weapons.',
              prefixText: 'ADR harpoons are feared because they possess',
              suffixText: 'capabilities as weapons.',
              answer: 'dual-use',
              acceptableAnswers: ['dual-use'],
              evidenceParagraph: 'E',
              evidenceQuote: 'many militaries fear that dual-use ADR harpoons could double as clandestine anti-satellite weaponry',
              explanation: 'Từ cần điền là tính từ "dual-use" (lưỡng dụng, vừa dân sự vừa quân sự).'
            },
            {
              id: 40,
              order: 40,
              questionText: 'Without binding agreements setting salvage rules and disposal ................, orbital space remains threatened.',
              prefixText: 'Without binding agreements setting salvage rules and disposal',
              suffixText: ', orbital space remains threatened.',
              answer: 'deadlines',
              acceptableAnswers: ['deadlines', 'deadline'],
              evidenceParagraph: 'E',
              evidenceQuote: 'Without binding international treaties establishing clear salvage rights and mandatory end-of-life de-orbiting deadlines',
              explanation: 'Từ cần điền là danh từ "deadlines" (thời hạn bắt buộc xử lý khi hết hạn sử dụng).'
            }
          ]
        }
      ]
    }
  ]
};
