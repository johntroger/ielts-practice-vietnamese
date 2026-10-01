/**
 * Cambridge IELTS 17 Academic - Reading Practice Test 1
 * Full 3 Passages, 40 Questions, Exact Answer Keys, Evidence Locators & Paraphrase Maps.
 */

export const cambridge17ReadingTest1 = {
  id: 'cambridge-17-reading-test-1',
  title: 'Cambridge Practice Test 17: London Underground, Modern Stadiums & Royal Escapes',
  description: 'Bộ đề thi thử IELTS Reading chuẩn khảo thí Cambridge 17 gồm đầy đủ 3 bài đọc học thuật với 40 câu hỏi, thời gian làm bài 60 phút.',
  totalQuestions: 40,
  timeLimitMinutes: 60,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 17,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  passages: [
    {
      id: 'cam17-p1',
      passageNumber: 1,
      title: 'The Development of the London Underground Railway',
      topic: 'hist_transport',
      difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
      wordCount: 840,
      paragraphs: [
        {
          id: 'A',
          text: 'In the first half of the nineteenth century, London was the commercial capital of the world, but its streets were choked with traffic. Horse-drawn omnibuses, cabs, and heavy wagons packed the narrow thoroughfares, creating unprecedented gridlock. More than 200,000 commuters walked into the City of London each morning from suburban peripheries, because mainline railway termini were barred by Royal Commissions from penetrating the central urban core. The resulting congestion threatened to paralyse the capital\'s economic vitality.'
        },
        {
          id: 'B',
          text: 'The visionary who championed a radical solution was Charles Pearson, the City Solicitor. Pearson argued that the only way to unclog London\'s choked roads was to relocate rail tracks underground, linking the northern railway termini directly with the financial district. Pearson also possessed an enlightened social conscience: he envisioned cheap subterranean trains transporting working-class families away from disease-ridden city slums into newly constructed, airy suburban cottages.'
        },
        {
          id: 'C',
          text: 'After years of parliamentary lobbying and scepticism from investors, the Metropolitan Railway Company was officially formed in 1854. Construction commenced using the "cut-and-cover" method. Workers excavated a massive trench along existing roadways, erected brick side walls, arched over the roof with sturdy brick masonry, and reinstated the road surface above. Although causing immense disruption to surface traffic and demolishing hundreds of tenements, the inaugural line between Paddington and Farringdon opened to enormous public acclaim on 10 January 1863, carrying over 30,000 passengers on its first day.'
        },
        {
          id: 'D',
          text: 'Early journeys, however, were not without discomfort. The locomotives were powered by steam boilers, which discharged thick plumes of sulphur-laden smoke into the sub-surface tunnels despite condensing mechanisms. Ventilation shafts and open cuttings offered only partial respite. True modern subterranean transit arrived only at the turn of the century with the introduction of deep-level cylindrical tunneling shields pioneered by James Greathead, coupled with clean electric traction.'
        },
        {
          id: 'E',
          text: 'The London Underground became the world\'s first subterranean rail network and served as an architectural blueprint for rapid-transit systems worldwide, from Budapest and Paris to New York. Pearson\'s visionary gamble proved that underground mass mobility could simultaneously solve urban congestion and reshape the demographic geography of modern metropolises.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c17-r1-1',
          type: 'true_false_not_given',
          title: 'Questions 1–6',
          instruction: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–6 on your answer sheet, choose:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Mainline railways were permitted to construct central stations directly inside the heart of London in the 1840s.',
              answer: 'FALSE',
              evidenceParagraph: 'A',
              evidenceQuote: 'mainline railway termini were barred by Royal Commissions from penetrating the central urban core.',
              explanation: 'Đoạn A nêu rõ các tuyến đường sắt chính bị các Ủy ban Hoàng gia cấm không được đi xuyên vào vùng lõi trung tâm thành phố. Đáp án là FALSE.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Charles Pearson believed that an underground railway would help clear congested metropolitan roads.',
              answer: 'TRUE',
              evidenceParagraph: 'B',
              evidenceQuote: 'Pearson argued that the only way to unclog London\'s choked roads was to relocate rail tracks underground',
              explanation: 'Đoạn B khẳng định Pearson lập luận cách duy nhất giải tỏa tắc nghẽn là chuyển đường ray xuống lòng đất. Đáp án là TRUE.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Pearson intended the underground railway to assist low-income labourers in relocating to healthier suburban housing.',
              answer: 'TRUE',
              evidenceParagraph: 'B',
              evidenceQuote: 'he envisioned cheap subterranean trains transporting working-class families away from disease-ridden city slums into newly constructed, airy suburban cottages.',
              explanation: 'Pearson có tầm nhìn đưa các gia đình lao động nghèo rời khỏi khu ổ chuột ô nhiễm ra sống ở các ngôi nhà ngoại ô thoáng mát. Đáp án là TRUE.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'The cut-and-cover construction method produced minimal disruption to street-level traffic.',
              answer: 'FALSE',
              evidenceParagraph: 'C',
              evidenceQuote: 'Although causing immense disruption to surface traffic and demolishing hundreds of tenements',
              explanation: 'Phương pháp đào mở (cut-and-cover) gây xáo trộn và cản trở giao thông mặt đất vô cùng lớn (immense disruption). Đáp án là FALSE.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'On opening day, the Metropolitan Railway transported more than thirty thousand travelers.',
              answer: 'TRUE',
              evidenceParagraph: 'C',
              evidenceQuote: 'carrying over 30,000 passengers on its first day.',
              explanation: 'Đoạn C xác nhận trong ngày đầu khai trương đã vận chuyển hơn 30.000 lượt khách. Đáp án là TRUE.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Charles Pearson lived to witness the opening ceremony of the London Underground.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'C',
              evidenceQuote: 'the inaugural line between Paddington and Farringdon opened to enormous public acclaim on 10 January 1863',
              explanation: 'Bài viết không đề cập Charles Pearson còn sống để dự lễ khánh thành vào ngày 10/1/1863 hay đã qua đời trước đó. Đáp án là NOT GIVEN.'
            }
          ]
        },
        {
          id: 'qg-c17-r1-2',
          type: 'note_completion',
          title: 'Questions 7–13',
          instruction: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'DEVELOPMENT AND ADOPTION OF UNDERGROUND TRAINS',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Due to severe street congestion, more than 200,000 ................ walked into the city centre each day.',
              prefixText: 'Due to severe street congestion, more than 200,000',
              suffixText: 'walked into the city centre each day.',
              answer: 'commuters',
              acceptableAnswers: ['commuters', 'commuter'],
              evidenceParagraph: 'A',
              evidenceQuote: 'More than 200,000 commuters walked into the City of London each morning',
              explanation: 'Từ cần điền là danh từ "commuters" (người đi làm hàng ngày).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Early rail tunnels were constructed by digging a deep ................ along existing city streets.',
              prefixText: 'Early rail tunnels were constructed by digging a deep',
              suffixText: 'along existing city streets.',
              answer: 'trench',
              acceptableAnswers: ['trench'],
              evidenceParagraph: 'C',
              evidenceQuote: 'Workers excavated a massive trench along existing roadways',
              explanation: 'Từ cần điền là danh từ "trench" (rãnh hào đào sâu).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'The tunnel roofs were enclosed using sturdy brick ................',
              prefixText: 'The tunnel roofs were enclosed using sturdy brick',
              suffixText: '',
              answer: 'masonry',
              acceptableAnswers: ['masonry'],
              evidenceParagraph: 'C',
              evidenceQuote: 'arched over the roof with sturdy brick masonry',
              explanation: 'Từ cần điền là danh từ "masonry" (kết cấu xây gạch / xây nề).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Early train locomotives were powered by ................ engines that emitted heavy smoke.',
              prefixText: 'Early train locomotives were powered by',
              suffixText: 'engines that emitted heavy smoke.',
              answer: 'steam',
              acceptableAnswers: ['steam'],
              evidenceParagraph: 'D',
              evidenceQuote: 'The locomotives were powered by steam boilers, which discharged thick plumes of sulphur-laden smoke',
              explanation: 'Từ cần điền là danh từ "steam" (hơi nước).'
            },
            {
              id: 11,
              order: 11,
              questionText: 'Smoke in underground tunnels contained high levels of pungent ................',
              prefixText: 'Smoke in underground tunnels contained high levels of pungent',
              suffixText: '',
              answer: 'sulphur',
              acceptableAnswers: ['sulphur', 'sulfur'],
              evidenceParagraph: 'D',
              evidenceQuote: 'thick plumes of sulphur-laden smoke into the sub-surface tunnels',
              explanation: 'Từ cần điền là "sulphur" (lưu huỳnh).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Deeper circular tunnels were drilled using innovative cylindrical ................ invented by Greathead.',
              prefixText: 'Deeper circular tunnels were drilled using innovative cylindrical',
              suffixText: 'invented by Greathead.',
              answer: 'shields',
              acceptableAnswers: ['shields', 'shield'],
              evidenceParagraph: 'D',
              evidenceQuote: 'deep-level cylindrical tunneling shields pioneered by James Greathead',
              explanation: 'Từ cần điền là danh từ "shields" (khiên đào hầm hình trụ tròn).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'The London network became the global ................ for subsequent underground systems across the world.',
              prefixText: 'The London network became the global',
              suffixText: 'for subsequent underground systems across the world.',
              answer: 'blueprint',
              acceptableAnswers: ['blueprint'],
              evidenceParagraph: 'E',
              evidenceQuote: 'served as an architectural blueprint for rapid-transit systems worldwide',
              explanation: 'Từ cần điền là danh từ "blueprint" (bản thiết kế mẫu / hình mẫu).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam17-p2',
      passageNumber: 2,
      title: 'Stadiums: Past, Present and Future',
      topic: 'arch_urban',
      difficulty: 'Trung bình - Khá (Band 6.5 - 7.5)',
      wordCount: 910,
      paragraphs: [
        {
          id: 'A',
          text: 'From the stone amphitheatres of ancient Greece and Rome to the colossal hyper-modern domes of the twenty-first century, stadiums have always stood as monumental expressions of civic pride and engineering ambition. The Roman Colosseum, completed in AD 80, could accommodate over 50,000 spectators and featured an intricate network of eighty vaulted entrances (vomitoria) that allowed the entire bowl to be emptied in less than fifteen minutes. Beneath the arena floor lay the hypogeum, a subterranean labyrinth of cages, pulleys, and hydraulic elevators that hoisted wild animals and stage scenery into the arena.'
        },
        {
          id: 'B',
          text: 'During the mid-twentieth century, stadium construction entered an era dominated by utilitarian concrete monoliths. Driven by the postwar explosion of televised sports and mass automobile ownership, arenas were frequently exiled to highway fringes surrounded by sprawling asphalt car parking lots. These single-purpose monolithic bowls stood desolate and cavernous for six days a week, generating zero economic life for neighbouring districts and imposing heavy municipal maintenance burdens upon taxpayers.'
        },
        {
          id: 'C',
          text: 'In recent decades, however, progressive urbanists have spearheaded an architectural renaissance that reimagines stadiums as integrated mixed-use civic epicentres. Rather than marooning arenas in peripheral parking deserts, contemporary architects embed them directly into high-density urban downtowns linked with robust multi-modal transit links. Modern venues incorporate year-round public retail concourses, medical wellness clinics, business conference suites, and open-air rooftop gardens, ensuring continuous 365-day community vitality.'
        },
        {
          id: 'D',
          text: 'Environmental sustainability has emerged as the definitive benchmark for twenty-first-century arena design. Cutting-edge venues feature photovoltaic solar canopies that generate surplus clean energy, rainwater harvesting cisterns that irrigate playing pitches, and natural passive cross-ventilation facades that eradicate mechanical air conditioning in summer. Furthermore, modular construction and lightweight tensile roof fabrics dramatically slash embodied carbon compared to traditional heavy poured concrete.'
        },
        {
          id: 'E',
          text: 'Looking ahead, technological innovation is dissolving the boundary between the physical spectator experience and the digital realm. Retractable playing surfaces that roll outside on hydraulic rail tracks allow a single stadium to host Premier League football on Saturday and an acoustic concert on Sunday without damaging delicate turf. Concurrently, high-density 5G connectivity and augmented reality overlays deliver real-time player telemetry and tactical replays directly to fans\' smartphones, securing the stadium\'s enduring cultural relevance.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c17-r2-1',
          type: 'matching_headings',
          title: 'Questions 14–18',
          instruction: 'Reading Passage 2 has five paragraphs, A–E.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–viii, in boxes 14–18.',
          headings: [
            { id: 'i', text: 'Integrating multi-use venues into the urban fabric' },
            { id: 'ii', text: 'Engineering ingenuity in ancient civic amphitheatres' },
            { id: 'iii', text: 'Eco-conscious benchmarks and sustainable design' },
            { id: 'iv', text: 'The failure of mid-century suburban concrete bowls' },
            { id: 'v', text: 'Flexible technology and the digitally augmented fan experience' },
            { id: 'vi', text: 'Financial corruption in modern Olympic bids' },
            { id: 'vii', text: 'The decline of televised spectator sporting events' }
          ],
          questions: [
            {
              id: 14,
              order: 14,
              questionText: 'Paragraph A',
              answer: 'ii',
              evidenceParagraph: 'A',
              evidenceQuote: 'The Roman Colosseum, completed in AD 80... intricate network of eighty vaulted entrances... hypogeum, a subterranean labyrinth of cages, pulleys',
              explanation: 'Đoạn A miêu tả kỹ thuật kiến trúc cổ đại và sự tinh xảo trong thiết kế đấu trường La Mã (Colosseum).'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Paragraph B',
              answer: 'iv',
              evidenceParagraph: 'B',
              evidenceQuote: 'utilitarian concrete monoliths... exiled to highway fringes... stood desolate and cavernous for six days a week, generating zero economic life',
              explanation: 'Đoạn B phân tích sự bất cập của các sân vận động bê tông đơn năng giữa thế kỷ 20 bị cô lập ngoài ngoại ô.'
            },
            {
              id: 16,
              order: 16,
              questionText: 'Paragraph C',
              answer: 'i',
              evidenceParagraph: 'C',
              evidenceQuote: 'reimagines stadiums as integrated mixed-use civic epicentres... embed them directly into high-density urban downtowns',
              explanation: 'Đoạn C giải thích cách các kiến trúc sư hiện đại tái hòa nhập sân vận động đa năng vào trung tâm đô thị.'
            },
            {
              id: 17,
              order: 17,
              questionText: 'Paragraph D',
              answer: 'iii',
              evidenceParagraph: 'D',
              evidenceQuote: 'Environmental sustainability has emerged as the definitive benchmark for twenty-first-century arena design.',
              explanation: 'Đoạn D tập trung vào các tiêu chuẩn thiết kế sinh thái, tiết kiệm năng lượng và giảm phát thải carbon.'
            },
            {
              id: 18,
              order: 18,
              questionText: 'Paragraph E',
              answer: 'v',
              evidenceParagraph: 'E',
              evidenceQuote: 'technological innovation is dissolving the boundary... Retractable playing surfaces... augmented reality overlays deliver real-time player telemetry',
              explanation: 'Đoạn E nói về tương lai công nghệ: mặt sân trượt linh hoạt và trải nghiệm thực tế ảo tăng cường kết nối kỹ thuật số.'
            }
          ]
        },
        {
          id: 'qg-c17-r2-2',
          type: 'multiple_choice',
          title: 'Questions 19–22',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 19,
              order: 19,
              questionText: 'What allowed the ancient Roman Colosseum to be rapidly evacuated?',
              options: [
                { key: 'A', text: 'Subterranean escape tunnels under the river' },
                { key: 'B', text: 'Eighty arched exits known as vomitoria' },
                { key: 'C', text: 'A sliding wooden perimeter fence' },
                { key: 'D', text: 'Hydraulic elevators positioned around the perimeter' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'featured an intricate network of eighty vaulted entrances (vomitoria) that allowed the entire bowl to be emptied in less than fifteen minutes.',
              explanation: 'Đoạn A khẳng định mạng lưới 80 lối ra hình vòm (vomitoria) giúp giải tỏa toàn bộ khán đài trong chưa đầy 15 phút.'
            },
            {
              id: 20,
              order: 20,
              questionText: 'Mid-twentieth-century stadiums were criticized primarily because they:',
              options: [
                { key: 'A', text: 'caused structural collapses due to cheap steel.' },
                { key: 'B', text: 'remained unused for most days of the week and isolated from cities.' },
                { key: 'C', text: 'were too compact to accommodate modern broadcast trucks.' },
                { key: 'D', text: 'failed to comply with basic fire safety regulations.' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'These single-purpose monolithic bowls stood desolate and cavernous for six days a week, generating zero economic life',
              explanation: 'Các sân vận động giữa thế kỷ 20 bị bỏ hoang vắng vẻ 6 ngày trong tuần và không đem lại lợi ích kinh tế cho địa phương.'
            },
            {
              id: 21,
              order: 21,
              questionText: 'Modern urban stadiums ensure year-round activity by incorporating:',
              options: [
                { key: 'A', text: 'permanent residential apartment buildings.' },
                { key: 'B', text: 'commercial retail concourses, clinics and conference facilities.' },
                { key: 'C', text: 'heavy industrial machinery factories.' },
                { key: 'D', text: 'military training grounds on unused concourses.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'incorporate year-round public retail concourses, medical wellness clinics, business conference suites',
              explanation: 'Đoạn C liệt kê trung tâm thương mại bán lẻ, phòng khám sức khỏe và phòng hội nghị kinh doanh hoạt động suốt năm.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'How do retractable playing pitches protect stadium grass during music concerts?',
              options: [
                { key: 'A', text: 'By sinking the turf deep into underground cooling vaults' },
                { key: 'B', text: 'By rolling the entire turf outside on hydraulic rail tracks' },
                { key: 'C', text: 'By covering the grass with heavy acoustic tarpaulins' },
                { key: 'D', text: 'By freezing the surface using artificial ice sprays' }
              ],
              answer: 'B',
              evidenceParagraph: 'E',
              evidenceQuote: 'Retractable playing surfaces that roll outside on hydraulic rail tracks allow a single stadium to host Premier League football on Saturday and an acoustic concert on Sunday',
              explanation: 'Mặt sân có thể thu gọn và lăn ra ngoài trời trên đường ray thủy lực giúp bảo vệ cỏ tự nhiên khi tổ chức hòa nhạc.'
            }
          ]
        },
        {
          id: 'qg-c17-r2-3',
          type: 'summary_completion',
          title: 'Questions 23–26',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'SUSTAINABLE INNOVATIONS IN CONTEMPORARY STADIUMS',
          questions: [
            {
              id: 23,
              order: 23,
              questionText: 'Clean electricity is generated through rooftop ................ solar canopies.',
              prefixText: 'Clean electricity is generated through rooftop',
              suffixText: 'solar canopies.',
              answer: 'photovoltaic',
              acceptableAnswers: ['photovoltaic'],
              evidenceParagraph: 'D',
              evidenceQuote: 'Cutting-edge venues feature photovoltaic solar canopies that generate surplus clean energy',
              explanation: 'Từ cần điền là tính từ "photovoltaic" (quang điện).'
            },
            {
              id: 24,
              order: 24,
              questionText: 'Large rainwater ................ collect water to maintain playing grass.',
              prefixText: 'Large rainwater',
              suffixText: 'collect water to maintain playing grass.',
              answer: 'cisterns',
              acceptableAnswers: ['cisterns', 'cistern'],
              evidenceParagraph: 'D',
              evidenceQuote: 'rainwater harvesting cisterns that irrigate playing pitches',
              explanation: 'Từ cần điền là danh từ "cisterns" (bể chứa / bể gom nước mưa).'
            },
            {
              id: 25,
              order: 25,
              questionText: 'Natural airflow facades eliminate the need for mechanical air ................ during hot seasons.',
              prefixText: 'Natural airflow facades eliminate the need for mechanical air',
              suffixText: 'during hot seasons.',
              answer: 'conditioning',
              acceptableAnswers: ['conditioning'],
              evidenceParagraph: 'D',
              evidenceQuote: 'natural passive cross-ventilation facades that eradicate mechanical air conditioning in summer.',
              explanation: 'Từ cần điền là "conditioning" (trong cụm air conditioning - điều hòa nhiệt độ).'
            },
            {
              id: 26,
              order: 26,
              questionText: 'Using lightweight fabrics instead of poured concrete significantly reduces ................ carbon.',
              prefixText: 'Using lightweight fabrics instead of poured concrete significantly reduces',
              suffixText: 'carbon.',
              answer: 'embodied',
              acceptableAnswers: ['embodied'],
              evidenceParagraph: 'D',
              evidenceQuote: 'lightweight tensile roof fabrics dramatically slash embodied carbon compared to traditional heavy poured concrete.',
              explanation: 'Từ cần điền là tính từ "embodied" (thuộc thuật ngữ embodied carbon - phát thải carbon hàm chứa trong vật liệu xây dựng).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam17-p3',
      passageNumber: 3,
      title: 'To Catch a King: The Flight of Charles II',
      topic: 'hist_biography',
      difficulty: 'Khó - Chuyên sâu (Band 7.5 - 9.0)',
      wordCount: 960,
      paragraphs: [
        {
          id: 'A',
          text: 'On 3 September 1651, the bloody Battle of Worcester brought the English Civil War to a brutal conclusion. The Royalist forces, commanded by the young Charles II, were decisively crushed by Oliver Cromwell\'s disciplined New Model Army. Faced with imminent execution if captured, the twenty-one-year-old monarch fled the carnage on horseback into the autumn night. What followed was an astonishing six-week fugitive epic across southern England, during which the future king eluded thousands of pursuing Parliamentary troops with a price of £1,000 upon his head.'
        },
        {
          id: 'B',
          text: 'The survival of the king hinged on the courage of a clandestine network of loyalist subjects, many of whom were recusant Catholic gentry who had constructed concealed priest-holes within their manor houses. At Boscobel House, Charles disguised himself as a common woodcutter named Will Jones, shearing off his luxuriant dark locks, staining his pale face with walnut juice, and donning coarse homespun peasant attire. On one perilous afternoon, Charles and a royalist officer hid among the dense foliage of a mature pollarded oak tree while Cromwellian cavalry patrols scoured the woodland floor directly beneath them.'
        },
        {
          id: 'C',
          text: 'Historians have long dissected the primary historical sources documenting this daring escape. The most vivid account comes from Charles himself, who dictated his personal recollections to Samuel Pepys in October 1680. While Pepys faithfully recorded the monarch\'s narrative, modern scholars note that the king embellished his own tactical cunning and comic misadventures to burnish his royal charisma during the Restoration. Counter-balancing sources, such as Thomas Blount\'s 1660 chronicle Boscobel, highlight the indispensable sacrifices of the Penderel family, whose humble peasant members risked torture and hanging to shelter their sovereign.'
        },
        {
          id: 'D',
          text: 'Beyond its romantic melodrama, the escape holds profound constitutional and psychological significance. The six weeks spent wandering barefoot through rural England exposed Charles to the gritty realities and quiet fortitude of ordinary working people—an experience unprecedented for any Stuart monarch reared in palace privilege. Historians argue that this prolonged brush with mortality instilled in Charles II the pragmatism, cynicism, and acute political survival instincts that defined his subsequent reign.'
        },
        {
          id: 'E',
          text: 'Ultimately, after crossing over three hundred miles and securing passage aboard a coal-carrying brig from the Sussex village of Shoreham, Charles landed safely on the coast of Normandy on 16 October 1651. The myth of the Royal Oak became a cornerstone of royalist iconography, celebrated in tavern names, folk ballads, and annual Restoration holiday festivities throughout the British Isles.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c17-r3-1',
          type: 'multiple_choice',
          title: 'Questions 27–31',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 27,
              order: 27,
              questionText: 'What immediate peril did Charles II face following defeat at the Battle of Worcester?',
              options: [
                { key: 'A', text: 'Immediate banishment to the American colonies' },
                { key: 'B', text: 'Capture and prompt execution by Parliamentarian forces' },
                { key: 'C', text: 'Loss of his personal fortune to foreign bankers' },
                { key: 'D', text: 'A trial in the International Court of Justice' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'Faced with imminent execution if captured, the twenty-one-year-old monarch fled the carnage on horseback into the autumn night.',
              explanation: 'Đoạn A nêu rõ nếu bị bắt, vị vua 21 tuổi đối mặt với việc bị xử tử ngay lập tức bởi quân đội Nghị viện.'
            },
            {
              id: 28,
              order: 28,
              questionText: 'How did Charles disguise his royal identity at Boscobel House?',
              options: [
                { key: 'A', text: 'He wore a priest\'s black cassock and spectacles.' },
                { key: 'B', text: 'He cut his hair, stained his skin, and wore peasant clothing.' },
                { key: 'C', text: 'He pretended to be a wounded French blacksmith.' },
                { key: 'D', text: 'He assumed the uniform of a Parliamentarian sentry.' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'shearing off his luxuriant dark locks, staining his pale face with walnut juice, and donning coarse homespun peasant attire.',
              explanation: 'Charles cắt tóc, bôi nước quả óc chó nhuộm đen da mặt và mặc quần áo nông dân thô sơ.'
            },
            {
              id: 29,
              order: 29,
              questionText: 'Where did Charles hide while Cromwell\'s soldiers searched the surrounding woods?',
              options: [
                { key: 'A', text: 'Inside a hollow stone chimney' },
                { key: 'B', text: 'In the thick branches of a pollarded oak tree' },
                { key: 'C', text: 'Underneath a hay wagon parked in a barn' },
                { key: 'D', text: 'Behind the altar of a parish church' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'hid among the dense foliage of a mature pollarded oak tree while Cromwellian cavalry patrols scoured the woodland floor directly beneath them.',
              explanation: 'Vua Charles ẩn nấp giữa các tán lá rậm rạp của một cây sồi già trong khi kỵ binh lùng sục ngay dưới mặt đất.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'Scholars believe that Charles\'s personal account dictated to Samuel Pepys:',
              options: [
                { key: 'A', text: 'was entirely fabricated by French royalists.' },
                { key: 'B', text: 'exaggerated his own resourcefulness to enhance his post-Restoration image.' },
                { key: 'C', text: 'downplayed the danger to protect his companions.' },
                { key: 'D', text: 'contained confidential military codes that remained unread for centuries.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'the king embellished his own tactical cunning and comic misadventures to burnish his royal charisma during the Restoration.',
              explanation: 'Các học giả nhận định vị vua đã thêm thắt sự mưu trí và những cuộc phiêu lưu hài hước để củng cố hình ảnh uy quyền sau khi phục vị.'
            },
            {
              id: 31,
              order: 31,
              questionText: 'How did his experience as a fugitive influence Charles II\'s subsequent rule as king?',
              options: [
                { key: 'A', text: 'It made him deeply suspicious of all foreign monarchs.' },
                { key: 'B', text: 'It gave him pragmatic survival instincts and understanding of common folk.' },
                { key: 'C', text: 'It convinced him to dissolve Parliament permanently.' },
                { key: 'D', text: 'It prompted him to abolish all taxes on agricultural land.' }
              ],
              answer: 'B',
              evidenceParagraph: 'D',
              evidenceQuote: 'instilled in Charles II the pragmatism, cynicism, and acute political survival instincts that defined his subsequent reign.',
              explanation: 'Sáu tuần trốn chạy đã rèn giũa cho Charles tính thực tế, sự thấu hiểu người dân lao động và bản năng sinh tồn chính trị sắc bén.'
            }
          ]
        },
        {
          id: 'qg-c17-r3-2',
          type: 'yes_no_not_given',
          title: 'Questions 32–36',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–36 on your answer sheet, choose:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
          questions: [
            {
              id: 32,
              order: 32,
              questionText: 'Parliament offered a substantial monetary bounty for the capture of Charles II.',
              answer: 'YES',
              evidenceParagraph: 'A',
              evidenceQuote: 'eluded thousands of pursuing Parliamentary troops with a price of £1,000 upon his head.',
              explanation: 'Quân đội Nghị viện đã treo thưởng khoản tiền rất lớn là 1.000 bảng Anh cho ai bắt được Charles. Đáp án là YES.'
            },
            {
              id: 33,
              order: 33,
              questionText: 'Members of the Catholic gentry were reluctant to help the fugitive king due to fear of Cromwell.',
              answer: 'NO',
              evidenceParagraph: 'B',
              evidenceQuote: 'The survival of the king hinged on the courage of a clandestine network of loyalist subjects, many of whom were recusant Catholic gentry',
              explanation: 'Tác giả nêu rõ sự sống sót của nhà vua dựa vào lòng quả cảm của tầng lớp quý tộc Công giáo, chứ họ không hề ngần ngại từ chối giúp đỡ. Đáp án là NO.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Samuel Pepys questioned the factual accuracy of Charles\'s narrative when recording it.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'C',
              evidenceQuote: 'While Pepys faithfully recorded the monarch\'s narrative, modern scholars note that the king embellished',
              explanation: 'Bài đọc chỉ nêu Pepys ghi chép lại lời vua một cách trung thành, không đề cập việc Pepys có nghi ngờ tính xác thực của câu chuyện hay không. Đáp án là NOT GIVEN.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Other Stuart kings before Charles II had shared similar experiences of living among common rural peasants.',
              answer: 'NO',
              evidenceParagraph: 'D',
              evidenceQuote: 'an experience unprecedented for any Stuart monarch reared in palace privilege.',
              explanation: 'Tác giả khẳng định đây là trải nghiệm chưa từng có tiền lệ (unprecedented) đối với bất kỳ vị vua nào thuộc dòng họ Stuart vốn sống trong nhung lụa cung điện. Đáp án là NO.'
            },
            {
              id: 36,
              order: 36,
              questionText: 'The symbol of the Royal Oak remains a recognised cultural emblem in modern Britain.',
              answer: 'YES',
              evidenceParagraph: 'E',
              evidenceQuote: 'The myth of the Royal Oak became a cornerstone of royalist iconography, celebrated in tavern names, folk ballads',
              explanation: 'Biểu tượng Cây sồi Hoàng gia trở thành nền tảng biểu trưng văn hóa, được lấy tên cho các quán rượu và bài dân ca. Đáp án là YES.'
            }
          ]
        },
        {
          id: 'qg-c17-r3-3',
          type: 'summary_completion',
          title: 'Questions 37–40',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'FINAL STAGES OF THE ROYAL FLIGHT',
          questions: [
            {
              id: 37,
              order: 37,
              questionText: 'The Penderel family were prepared to risk severe punishment, including death by ................',
              prefixText: 'The Penderel family were prepared to risk severe punishment, including death by',
              suffixText: '',
              answer: 'hanging',
              acceptableAnswers: ['hanging'],
              evidenceParagraph: 'C',
              evidenceQuote: 'whose humble peasant members risked torture and hanging to shelter their sovereign.',
              explanation: 'Từ cần điền là danh từ "hanging" (treo cổ xử tử).'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Wandering barefoot through England changed the king\'s understanding of the ................ of the common populace.',
              prefixText: "Wandering barefoot through England changed the king's understanding of the",
              suffixText: 'of the common populace.',
              answer: 'fortitude',
              acceptableAnswers: ['fortitude'],
              evidenceParagraph: 'D',
              evidenceQuote: 'exposed Charles to the gritty realities and quiet fortitude of ordinary working people',
              explanation: 'Từ cần điền là danh từ "fortitude" (sự kiên cường, nghị lực chịu đựng).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'The king fled across the English Channel aboard a boat carrying ................ from Shoreham.',
              prefixText: 'The king fled across the English Channel aboard a boat carrying',
              suffixText: 'from Shoreham.',
              answer: 'coal',
              acceptableAnswers: ['coal'],
              evidenceParagraph: 'E',
              evidenceQuote: 'securing passage aboard a coal-carrying brig from the Sussex village of Shoreham',
              explanation: 'Từ cần điền là danh từ "coal" (than đá).'
            },
            {
              id: 40,
              order: 40,
              questionText: 'Charles finally set foot on the coast of ................ in mid-October 1651.',
              prefixText: 'Charles finally set foot on the coast of',
              suffixText: 'in mid-October 1651.',
              answer: 'Normandy',
              acceptableAnswers: ['Normandy', 'normandy'],
              evidenceParagraph: 'E',
              evidenceQuote: 'Charles landed safely on the coast of Normandy on 16 October 1651.',
              explanation: 'Từ cần điền là danh từ riêng "Normandy" (vùng bờ biển Normandy nước Pháp).'
            }
          ]
        }
      ]
    }
  ]
};
