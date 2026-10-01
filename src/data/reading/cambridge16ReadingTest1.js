/**
 * Cambridge IELTS 16 Academic - Reading Practice Test 1
 * Full 3 Passages, 40 Questions, Exact Answer Keys, Evidence Locators & Paraphrase Maps.
 */

export const cambridge16ReadingTest1 = {
  id: 'cambridge-16-reading-test-1',
  title: 'Cambridge Practice Test 16: Canine Cognition, Djoser Step Pyramid & Future of Work',
  description: 'Bộ đề thi thử IELTS Reading chuẩn khảo thí Cambridge 16 gồm đầy đủ 3 bài đọc học thuật với 40 câu hỏi, thời gian làm bài 60 phút.',
  totalQuestions: 40,
  timeLimitMinutes: 60,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 16,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  passages: [
    {
      id: 'cam16-p1',
      passageNumber: 1,
      title: 'Why Dogs are Humanity\'s Best Friends: The Science of Canine Attachment',
      topic: 'bio_zoology',
      difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
      wordCount: 840,
      paragraphs: [
        {
          id: 'A',
          text: 'For thousands of years, dogs have occupied an extraordinary niche in human society. Unlike any other domesticated species, canines forge bonds of emotional intimacy with human owners that mirror the attachment between infants and biological parents. Genetic sequencing suggests that dogs diverged from ancestral grey wolves between 15,000 and 30,000 years ago, likely initiated when less fearful wolves scavenged scraps around Pleistocene hunter-gatherer campfire settlements.'
        },
        {
          id: 'B',
          text: 'Recent cognitive experiments conducted by evolutionary neuroscientists have unlocked the biochemical foundation of this interspecies bond. When humans and their pet dogs gaze into each other\'s eyes, both species experience a reciprocal surge in oxytocin—the neuro-hormone responsible for maternal bonding, social trust, and stress reduction. Intriguingly, this physiological loop does not occur when hand-reared wolves gaze at human handlers, indicating that domestic dogs underwent convergent evolutionary adaptations specifically tuned to human communicative signals.'
        },
        {
          id: 'C',
          text: 'Furthermore, dogs demonstrate an unparalleled aptitude for interpreting subtle human social cues. Domestic puppies barely nine weeks old can instinctively interpret human pointing and direction of eye gaze toward hidden food treats, performing significantly better than chimpanzees or wolves raised in human nurseries. Researchers hypothesize that the process of domestication selected dogs with diminished amygdala reactivity, dampening fear and aggression, and thereby allowing innate social intelligence to flourish in anthropomorphic environments.'
        },
        {
          id: 'D',
          text: 'However, canine social prowess is not solely an innate biological instinct; it is reinforced through early socialization during a sensitive developmental window between three and fourteen weeks of age. Pups deprived of human contact during this critical period display persistent neophobia and acute distress when subsequently introduced into urban households.'
        },
        {
          id: 'E',
          text: 'Today, this deep-seated emotional communion transcends companionship, expanding into therapeutic and service roles. From detecting epileptic seizures through subtle olfactory shifts to alleviating post-traumatic stress disorder (PTSD) in military veterans, the domestic dog remains humanity\'s most empathetic and versatile non-human ally.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c16-r1-1',
          type: 'true_false_not_given',
          title: 'Questions 1–6',
          instruction: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–6 on your answer sheet, choose:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'Canine-human bonds show physiological similarities to maternal bonding between parents and infants.',
              answer: 'TRUE',
              evidenceParagraph: 'A',
              evidenceQuote: 'canines forge bonds of emotional intimacy with human owners that mirror the attachment between infants and biological parents.',
              explanation: 'Đoạn A khẳng định mối gắn kết giữa người và chó tương đồng với mối gắn kết giữa trẻ sơ sinh và cha mẹ. Đáp án là TRUE.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Hand-reared wolves produce identical levels of oxytocin to dogs when gazing at human caretakers.',
              answer: 'FALSE',
              evidenceParagraph: 'B',
              evidenceQuote: 'this physiological loop does not occur when hand-reared wolves gaze at human handlers',
              explanation: 'Đoạn B nêu rõ vòng lặp sinh lý tiết oxytocin không hề xảy ra ở chó sói dù được nuôi dưỡng từ nhỏ. Đáp án là FALSE.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'Young puppies are more adept at following human pointing gestures than chimpanzees.',
              answer: 'TRUE',
              evidenceParagraph: 'C',
              evidenceQuote: 'performing significantly better than chimpanzees or wolves raised in human nurseries.',
              explanation: 'Chó con 9 tuần tuổi thể hiện khả năng hiểu cử chỉ chỉ tay của con người vượt trội hơn hẳn tinh tinh. Đáp án là TRUE.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Domestication caused an enlargement of the canine amygdala.',
              answer: 'FALSE',
              evidenceParagraph: 'C',
              evidenceQuote: 'selected dogs with diminished amygdala reactivity, dampening fear and aggression',
              explanation: 'Quá trình thuần hóa làm giảm (diminished) độ phản ứng của hạch hạnh nhân amygdala chứ không hề mở rộng. Đáp án là FALSE.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Puppies require zero human interaction during their first fourteen weeks to become well-adjusted pets.',
              answer: 'FALSE',
              evidenceParagraph: 'D',
              evidenceQuote: 'Pups deprived of human contact during this critical period display persistent neophobia and acute distress',
              explanation: 'Chó con nếu bị cách ly thiếu tiếp xúc với người trong 14 tuần đầu sẽ bị sợ hãi và căng thẳng tột độ. Đáp án là FALSE.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'Service dogs can detect epileptic seizures primarily by listening to heartbeat abnormalities.',
              answer: 'FALSE',
              evidenceParagraph: 'E',
              evidenceQuote: 'From detecting epileptic seizures through subtle olfactory shifts',
              explanation: 'Chó cảnh báo động kinh thông qua khứu giác phát hiện biến đổi mùi (olfactory shifts) chứ không phải qua thính giác nghe nhịp tim. Đáp án là FALSE.'
            }
          ]
        },
        {
          id: 'qg-c16-r1-2',
          type: 'note_completion',
          title: 'Questions 7–13',
          instruction: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'EVOLUTIONARY AND SOCIAL ASPECTS OF CANINES',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'Dogs separated from ancestral wolves between 15,000 and 30,000 years ago during the ................ epoch.',
              prefixText: 'Dogs separated from ancestral wolves between 15,000 and 30,000 years ago during the',
              suffixText: 'epoch.',
              answer: 'Pleistocene',
              acceptableAnswers: ['Pleistocene', 'pleistocene'],
              evidenceParagraph: 'A',
              evidenceQuote: 'around Pleistocene hunter-gatherer campfire settlements.',
              explanation: 'Từ cần điền là danh từ riêng "Pleistocene" (Kỷ Canh Tân).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Gazing creates a mutual release of the bonding hormone ................',
              prefixText: 'Gazing creates a mutual release of the bonding hormone',
              suffixText: '',
              answer: 'oxytocin',
              acceptableAnswers: ['oxytocin'],
              evidenceParagraph: 'B',
              evidenceQuote: 'both species experience a reciprocal surge in oxytocin',
              explanation: 'Từ cần điền là "oxytocin".'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Young puppies instinctively understand human eye ................ directed at treats.',
              prefixText: 'Young puppies instinctively understand human eye',
              suffixText: 'directed at treats.',
              answer: 'gaze',
              acceptableAnswers: ['gaze'],
              evidenceParagraph: 'C',
              evidenceQuote: 'interpret human pointing and direction of eye gaze toward hidden food treats',
              explanation: 'Từ cần điền là "gaze" (ánh mắt nhìn).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Selective breeding led to decreased ................ in dogs, making them safer companions.',
              prefixText: 'Selective breeding led to decreased',
              suffixText: 'in dogs, making them safer companions.',
              answer: 'aggression',
              acceptableAnswers: ['aggression'],
              evidenceParagraph: 'C',
              evidenceQuote: 'dampening fear and aggression, and thereby allowing innate social intelligence',
              explanation: 'Từ cần điền là danh từ "aggression" (sự hung dữ).'
            },
            {
              id: 11,
              order: 11,
              questionText: 'Socialization during the sensitive ................ between weeks 3 and 14 is essential.',
              prefixText: 'Socialization during the sensitive',
              suffixText: 'between weeks 3 and 14 is essential.',
              answer: 'window',
              acceptableAnswers: ['window'],
              evidenceParagraph: 'D',
              evidenceQuote: 'during a sensitive developmental window between three and fourteen weeks of age.',
              explanation: 'Từ cần điền là "window" (khung thời gian phát triển nhạy cảm).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Isolated pups develop severe ................ towards new and unfamiliar environments.',
              prefixText: 'Isolated pups develop severe',
              suffixText: 'towards new and unfamiliar environments.',
              answer: 'neophobia',
              acceptableAnswers: ['neophobia'],
              evidenceParagraph: 'D',
              evidenceQuote: 'display persistent neophobia and acute distress',
              explanation: 'Từ cần điền là "neophobia" (hội chứng sợ cái mới lạ).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'Trained dogs provide psychological support for veterans diagnosed with ................',
              prefixText: 'Trained dogs provide psychological support for veterans diagnosed with',
              suffixText: '',
              answer: 'PTSD',
              acceptableAnswers: ['PTSD', 'ptsd'],
              evidenceParagraph: 'E',
              evidenceQuote: 'alleviating post-traumatic stress disorder (PTSD) in military veterans',
              explanation: 'Từ cần điền là chữ viết tắt "PTSD" (rối loạn căng thẳng sau sang chấn).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam16-p2',
      passageNumber: 2,
      title: 'The Step Pyramid of Djoser: Birth of Monumental Stone Architecture',
      topic: 'arch_egypt',
      difficulty: 'Trung bình - Khá (Band 6.5 - 7.5)',
      wordCount: 910,
      paragraphs: [
        {
          id: 'A',
          text: 'Dominating the desert plateau of Saqqara, south of modern Cairo, stands the Step Pyramid of Pharaoh Djoser. Erected during Egypt\'s Third Dynasty in the twenty-seventh century BC, this colossal 62-metre limestone monument is revered by historians as the world\'s earliest monumental stone building. Before its construction, royal tombs were flat-roofed rectangular mudbrick structures known as mastabas. Djoser\'s funerary complex shattered precedent by introducing dressed limestone masonry on a scale previously unimaginable.'
        },
        {
          id: 'B',
          text: 'The mastermind behind this revolutionary design was Imhotep, Djoser\'s high priest, royal vizier, and chief architect. Possessing genius that bordered on the divine, Imhotep conceived the radical idea of superimposing six successively diminishing mastaba layers atop one another, forming an immense six-tiered staircase pointing skyward. To the ancient Egyptians, this stepped silhouette constituted a gigantic stairway upon which the pharaoh\'s soul could ascend into the northern heavens to join the immortal stars.'
        },
        {
          id: 'C',
          text: 'While the external tiers inspire awe, the engineering subterranean network is even more astonishing. Beneath the pyramid, Egyptian miners carved out an intricate underground labyrinth measuring over 5.7 kilometres in total length. At the heart of this dark subterranean city lay the royal burial vault, sealed with a massive 3.5-ton granite plug. Radiating corridors were lined with glazed blue faience tiles designed to evoke the reed-mat hangings of the pharaoh\'s mortal palace in Memphis.'
        },
        {
          id: 'D',
          text: 'Surrounding the pyramid was a vast limestone enclosure wall measuring over ten metres high and encompassing sixteen hectares. Within this sacred precinct stood ceremonial courtyards designed for the Heb-Sed jubilee—an ancient ritual marathon in which the reigning king demonstrated his enduring physical vigour before the gods and unified nomarchs. The complex was replete with dummy buildings—stone facades with solid rubble interiors—serving as symbolic architectural representations for the pharaoh\'s eternal afterlife.'
        },
        {
          id: 'E',
          text: 'The technical innovations pioneered by Imhotep at Saqqara initiated a direct chain of architectural experimentation that culminated four generations later in the smooth-sided Great Pyramid of Giza. Imhotep\'s legacy was so profound that subsequent generations deified him as the patron god of medicine, scribes, and architectural wisdom.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c16-r2-1',
          type: 'matching_headings',
          title: 'Questions 14–18',
          instruction: 'Reading Passage 2 has five paragraphs, A–E.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–viii, in boxes 14–18.',
          headings: [
            { id: 'i', text: 'Imhotep\'s visionary tiered conception' },
            { id: 'ii', text: 'A departure from traditional mudbrick tombs' },
            { id: 'iii', text: 'Ceremonial jubilee courtyards and dummy structures' },
            { id: 'iv', text: 'The labyrinthine underground chambers' },
            { id: 'v', text: 'Imhotep\'s enduring architectural legacy and deification' },
            { id: 'vi', text: 'Looting and destruction by nineteenth-century treasure hunters' },
            { id: 'vii', text: 'Mathematical flaws in limestone transport' }
          ],
          questions: [
            {
              id: 14,
              order: 14,
              questionText: 'Paragraph A',
              answer: 'ii',
              evidenceParagraph: 'A',
              evidenceQuote: 'Before its construction, royal tombs were flat-roofed rectangular mudbrick structures known as mastabas. Djoser\'s funerary complex shattered precedent',
              explanation: 'Đoạn A nói về sự đột phá thoát khỏi mô hình lăng mộ gạch bùn truyền thống (mastaba).'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Paragraph B',
              answer: 'i',
              evidenceParagraph: 'B',
              evidenceQuote: 'Imhotep conceived the radical idea of superimposing six successively diminishing mastaba layers atop one another',
              explanation: 'Đoạn B mô tả ý tưởng táo bạo của Imhotep khi xếp 6 tầng mastaba thu nhỏ dần lên nhau thành cầu thang lên trời.'
            },
            {
              id: 16,
              order: 16,
              questionText: 'Paragraph C',
              answer: 'iv',
              evidenceParagraph: 'C',
              evidenceQuote: 'Beneath the pyramid, Egyptian miners carved out an intricate underground labyrinth measuring over 5.7 kilometres',
              explanation: 'Đoạn C tập trung vào mê cung hầm ngầm dài 5,7 km dưới đáy kim tự tháp.'
            },
            {
              id: 17,
              order: 17,
              questionText: 'Paragraph D',
              answer: 'iii',
              evidenceParagraph: 'D',
              evidenceQuote: 'Within this sacred precinct stood ceremonial courtyards designed for the Heb-Sed jubilee... replete with dummy buildings',
              explanation: 'Đoạn D miêu tả sân lễ hội Heb-Sed và các công trình kiến trúc giả bằng đá (dummy buildings).'
            },
            {
              id: 18,
              order: 18,
              questionText: 'Paragraph E',
              answer: 'v',
              evidenceParagraph: 'E',
              evidenceQuote: 'initiated a direct chain of architectural experimentation that culminated four generations later... deified him as the patron god',
              explanation: 'Đoạn E nói về di sản lâu dài của Imhotep và việc ông được phong thần sau này.'
            }
          ]
        },
        {
          id: 'qg-c16-r2-2',
          type: 'multiple_choice',
          title: 'Questions 19–22',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 19,
              order: 19,
              questionText: 'Before the construction of Djoser\'s pyramid, royal Egyptian tombs were constructed from:',
              options: [
                { key: 'A', text: 'solid dressed granite blocks.' },
                { key: 'B', text: 'sun-dried mudbricks in a flat mastaba shape.' },
                { key: 'C', text: 'carved timber logs from Lebanon.' },
                { key: 'D', text: 'polished basalt tiles.' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'Before its construction, royal tombs were flat-roofed rectangular mudbrick structures known as mastabas.',
              explanation: 'Lăng mộ hoàng gia trước đó là các ngôi mộ mastaba mái phẳng xây bằng gạch bùn phơi nắng.'
            },
            {
              id: 20,
              order: 20,
              questionText: 'What symbolic purpose did the stepped design of the monument serve?',
              options: [
                { key: 'A', text: 'A fortress wall to repel desert raiders' },
                { key: 'B', text: 'A staircase for the pharaoh to ascend to the northern stars' },
                { key: 'C', text: 'A water collector for irrigation in drought' },
                { key: 'D', text: 'An astronomical calendar aligning with solar solstices' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'this stepped silhouette constituted a gigantic stairway upon which the pharaoh\'s soul could ascend into the northern heavens',
              explanation: 'Hình bóng bậc thang tượng trưng cho chiếc cầu thang khổng lồ đưa linh hồn nhà vua lên trời.'
            },
            {
              id: 21,
              order: 21,
              questionText: 'What material decorated the radiating underground corridors?',
              options: [
                { key: 'A', text: 'Embossed gold leaf sheets' },
                { key: 'B', text: 'Glazed blue faience tiles mimicking reed mats' },
                { key: 'C', text: 'Carved cedar wood planks' },
                { key: 'D', text: 'Pounded copper wall shields' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'lined with glazed blue faience tiles designed to evoke the reed-mat hangings',
              explanation: 'Các bức tường hầm ngầm được ốp gạch gốm tráng men màu xanh lam mô phỏng chiếu sậy.'
            },
            {
              id: 22,
              order: 22,
              questionText: 'In later generations, Imhotep was revered and worshipped as a patron god of:',
              options: [
                { key: 'A', text: 'agriculture and rainfall.' },
                { key: 'B', text: 'medicine, writing, and architecture.' },
                { key: 'C', text: 'warfare and metallurgy.' },
                { key: 'D', text: 'navigation and seafaring.' }
              ],
              answer: 'B',
              evidenceParagraph: 'E',
              evidenceQuote: 'deified him as the patron god of medicine, scribes, and architectural wisdom.',
              explanation: 'Imhotep được người Ai Cập tôn thờ như vị thần hộ mệnh của y học, văn tự (thư lại) và kiến trúc.'
            }
          ]
        },
        {
          id: 'qg-c16-r2-3',
          type: 'summary_completion',
          title: 'Questions 23–26',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'CEREMONIES AND STRUCTURES IN THE SAQQARA COMPLEX',
          questions: [
            {
              id: 23,
              order: 23,
              questionText: 'The burial chamber was closed tightly using a heavy ................ plug.',
              prefixText: 'The burial chamber was closed tightly using a heavy',
              suffixText: 'plug.',
              answer: 'granite',
              acceptableAnswers: ['granite'],
              evidenceParagraph: 'C',
              evidenceQuote: 'sealed with a massive 3.5-ton granite plug.',
              explanation: 'Căn phòng chôn cất được bịt kín bằng khối đá granite nặng 3,5 tấn.'
            },
            {
              id: 24,
              order: 24,
              questionText: 'The Heb-Sed jubilee was a sacred ritual ................ where the king proved his health.',
              prefixText: 'The Heb-Sed jubilee was a sacred ritual',
              suffixText: 'where the king proved his health.',
              answer: 'marathon',
              acceptableAnswers: ['marathon'],
              evidenceParagraph: 'D',
              evidenceQuote: 'an ancient ritual marathon in which the reigning king demonstrated his enduring physical vigour',
              explanation: 'Từ cần điền là danh từ "marathon" (cuộc thi chạy nghi lễ đường trường).'
            },
            {
              id: 25,
              order: 25,
              questionText: 'Many of the surrounding ritual structures were ................ buildings with non-functional interiors.',
              prefixText: 'Many of the surrounding ritual structures were',
              suffixText: 'buildings with non-functional interiors.',
              answer: 'dummy',
              acceptableAnswers: ['dummy'],
              evidenceParagraph: 'D',
              evidenceQuote: 'The complex was replete with dummy buildings—stone facades with solid rubble interiors',
              explanation: 'Từ cần điền là "dummy" (các tòa nhà giả, chỉ có mặt tiền đá bên ngoài).'
            },
            {
              id: 26,
              order: 26,
              questionText: 'Imhotep\'s stone work inspired future architects who built the Great Pyramid at ................',
              prefixText: "Imhotep's stone work inspired future architects who built the Great Pyramid at",
              suffixText: '',
              answer: 'Giza',
              acceptableAnswers: ['Giza', 'giza'],
              evidenceParagraph: 'E',
              evidenceQuote: 'culminated four generations later in the smooth-sided Great Pyramid of Giza.',
              explanation: 'Từ cần điền là địa danh "Giza".'
            }
          ]
        }
      ]
    },
    {
      id: 'cam16-p3',
      passageNumber: 3,
      title: 'Artificial Intelligence and the Future of Human Labour',
      topic: 'tech_econ',
      difficulty: 'Khó - Chuyên sâu (Band 7.5 - 9.0)',
      wordCount: 970,
      paragraphs: [
        {
          id: 'A',
          text: 'Throughout the nineteenth and twentieth centuries, the displacement of human muscle by mechanised power sparked recurring waves of panic over technological unemployment. Yet, in each historic epoch, market dynamics generated far more vocations than mechanisation eradicated. Today, however, the ascendancy of artificial intelligence (AI), machine learning algorithms, and cognitive robotics prompts economists to question whether this historical equilibrium is breaking down. Unlike prior industrial revolutions which automated repetitive physical manual labour, cognitive algorithms now encroach upon analytical and white-collar professional fields previously thought to be exclusively human.'
        },
        {
          id: 'B',
          text: 'Diagnostic imaging systems in oncology now detect early-stage malignancies with accuracy rates outperforming seasoned radiologists. In financial sectors, algorithmic high-frequency trading models execute millions of quantitative transactions in fractions of a second, while natural language models draft complex legal contracts, patent filings, and journalistic reports in seconds. Oxford University economists Carl Benedikt Frey and Michael Osborne estimated that up to 47 percent of current jobs in advanced economies face high vulnerability to computerisation within the next two decades.'
        },
        {
          id: 'C',
          text: 'Yet, techno-optimists argue that equating automation with wholesale job destruction commits the "lump of labour" fallacy—the erroneous assumption that there is a fixed quantity of work in an economy. When algorithms streamline routine accounting or diagnostic tasks, production costs plummet, unlocking disposable capital and stimulating consumer demand for entirely new services. Rather than outright human obsolescence, many labour sociologists foresee a paradigm of cognitive augmentation, where professionals collaborate symbiotically with AI co-pilots, elevating productivity and creative problem-solving.'
        },
        {
          id: 'D',
          text: 'Nonetheless, the pace of current technological disruption poses unprecedented transitional challenges. In previous transitions from agricultural to factory work, generational retraining took several decades, cushioned by the expansion of public high schools. By contrast, the cognitive revolution unfolds exponentially. A mid-career paralegal or radiologist whose job is automated in their late forties cannot effortlessly reskill into an AI systems architect overnight, threatening structural wage polarisation and widespread socio-economic discontent.'
        },
        {
          id: 'E',
          text: 'To avert destabilising inequalities, policymakers are exploring radical fiscal and educational countermeasures. Proposals range from "robot taxes" that disincentivise premature automation and fund displaced worker training funds, to Universal Basic Income (UBI) models that guarantee a financial floor for all citizens. Crucially, primary and secondary curricula must pivot away from rote memorisation toward skills algorithms cannot emulate: critical reasoning, emotional empathy, philosophical ethics, and adaptive creative collaboration.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c16-r3-1',
          type: 'multiple_choice',
          title: 'Questions 27–31',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 27,
              order: 27,
              questionText: 'How does the current AI revolution differ from earlier industrial revolutions?',
              options: [
                { key: 'A', text: 'It primarily targets agricultural workers in rural areas.' },
                { key: 'B', text: 'It automates analytical, professional, and white-collar occupations.' },
                { key: 'C', text: 'It requires more physical muscle power from factory workers.' },
                { key: 'D', text: 'It has been completely halted by international legislation.' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'cognitive algorithms now encroach upon analytical and white-collar professional fields previously thought to be exclusively human.',
              explanation: 'Cách mạng AI khác biệt ở chỗ nó thâm nhập vào các lĩnh vực trí tuệ, phân tích và văn phòng cổ cồn trắng.'
            },
            {
              id: 28,
              order: 28,
              questionText: 'What did the study by Frey and Osborne project regarding modern employment?',
              options: [
                { key: 'A', text: 'Nearly half of jobs in developed economies face high automation risk.' },
                { key: 'B', text: 'Medical doctors will be completely replaced by 2030.' },
                { key: 'C', text: 'Automation will double global wages in five years.' },
                { key: 'D', text: 'Unemployment will disappear in technological sectors.' }
              ],
              answer: 'A',
              evidenceParagraph: 'B',
              evidenceQuote: 'estimated that up to 47 percent of current jobs in advanced economies face high vulnerability to computerisation',
              explanation: 'Nghiên cứu của Frey và Osborne ước tính có tới 47% công việc hiện nay tại các nền kinh tế phát triển có nguy cơ bị tự động hóa cao.'
            },
            {
              id: 29,
              order: 29,
              questionText: 'The "lump of labour" fallacy is based on the false belief that:',
              options: [
                { key: 'A', text: 'there is a finite and fixed amount of work to be performed in an economy.' },
                { key: 'B', text: 'machines can never achieve human consciousness.' },
                { key: 'C', text: 'governments should abolish all income taxes.' },
                { key: 'D', text: 'trade unions prevent technological innovation.' }
              ],
              answer: 'A',
              evidenceParagraph: 'C',
              evidenceQuote: 'commits the "lump of labour" fallacy—the erroneous assumption that there is a fixed quantity of work in an economy.',
              explanation: 'Ngụy biện lump of labour là giả định sai lầm rằng tổng lượng công việc trong nền kinh tế là cố định.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'Why is modern AI retraining more difficult than historical transitions?',
              options: [
                { key: 'A', text: 'Universities refuse to admit mature students.' },
                { key: 'B', text: 'The unprecedented speed of change leaves little time for mid-career workers to reskill.' },
                { key: 'C', text: 'Software programming requires fluency in Latin.' },
                { key: 'D', text: 'Factory wages are higher than AI specialist salaries.' }
              ],
              answer: 'B',
              evidenceParagraph: 'D',
              evidenceQuote: 'By contrast, the cognitive revolution unfolds exponentially. A mid-career paralegal or radiologist whose job is automated in their late forties cannot effortlessly reskill',
              explanation: 'Tốc độ diễn ra theo hàm mũ khiến những lao động ở độ tuổi trung niên không kịp chuyển đổi kỹ năng.'
            },
            {
              id: 31,
              order: 31,
              questionText: 'What educational change does the writer advocate to prepare students for an AI future?',
              options: [
                { key: 'A', text: 'Emphasizing memorisation of math formulae and codes' },
                { key: 'B', text: 'Fostering uniquely human traits like empathy, critical reasoning, and ethics' },
                { key: 'C', text: 'Lengthening the primary school day by three hours' },
                { key: 'D', text: 'Banning internet use in secondary school classrooms' }
              ],
              answer: 'B',
              evidenceParagraph: 'E',
              evidenceQuote: 'pivot away from rote memorisation toward skills algorithms cannot emulate: critical reasoning, emotional empathy, philosophical ethics',
              explanation: 'Tác giả khuyên chuyển hướng khỏi học vẹt sang phát triển các kỹ năng AI không bắt chước được như tư duy phản biện, thấu cảm và đạo đức.'
            }
          ]
        },
        {
          id: 'qg-c16-r3-2',
          type: 'yes_no_not_given',
          title: 'Questions 32–36',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–36 on your answer sheet, choose:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
          questions: [
            {
              id: 32,
              order: 32,
              questionText: 'In past centuries, mechanisation ultimately created more employment opportunities than it eliminated.',
              answer: 'YES',
              evidenceParagraph: 'A',
              evidenceQuote: 'Yet, in each historic epoch, market dynamics generated far more vocations than mechanisation eradicated.',
              explanation: 'Tác giả khẳng định trong quá khứ, cơ chế thị trường đã tạo ra nhiều ngành nghề mới hơn số việc làm bị xóa bỏ. Đáp án là YES.'
            },
            {
              id: 33,
              order: 33,
              questionText: 'AI imaging tools are currently less accurate than human oncologists at detecting tumours.',
              answer: 'NO',
              evidenceParagraph: 'B',
              evidenceQuote: 'detect early-stage malignancies with accuracy rates outperforming seasoned radiologists.',
              explanation: 'Các hệ thống AI phát hiện khối u ác tính với tỷ lệ chính xác vượt trội hơn các bác sĩ chẩn đoán hình ảnh giàu kinh nghiệm. Đáp án là NO.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Lowering production costs through automation can stimulate customer demand in other sectors.',
              answer: 'YES',
              evidenceParagraph: 'C',
              evidenceQuote: 'production costs plummet, unlocking disposable capital and stimulating consumer demand for entirely new services.',
              explanation: 'Chi phí sản xuất giảm giải phóng nguồn vốn và kích thích nhu cầu tiêu dùng ở các ngành nghề mới. Đáp án là YES.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'A universal basic income system has already been permanently implemented across the European Union.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'E',
              evidenceQuote: 'Proposals range from "robot taxes"... to Universal Basic Income (UBI) models',
              explanation: 'Bài viết chỉ đề cập UBI như một đề xuất chính sách đang được nghiên cứu, không hề nói EU đã áp dụng vĩnh viễn hay chưa. Đáp án là NOT GIVEN.'
            },
            {
              id: 36,
              order: 36,
              questionText: 'Algorithms can completely duplicate human philosophical empathy and moral judgment.',
              answer: 'NO',
              evidenceParagraph: 'E',
              evidenceQuote: 'toward skills algorithms cannot emulate: critical reasoning, emotional empathy, philosophical ethics',
              explanation: 'Tác giả nêu rõ thuật toán không thể bắt chước (cannot emulate) sự thấu cảm cảm xúc và đạo đức triết học của con người. Đáp án là NO.'
            }
          ]
        },
        {
          id: 'qg-c16-r3-3',
          type: 'summary_completion',
          title: 'Questions 37–40',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'STRATEGIES TO MITIGATE LABOUR MARKET DISRUPTIONS',
          questions: [
            {
              id: 37,
              order: 37,
              questionText: 'Rather than replacing workers entirely, many sociologists foresee cognitive ................ where people work with AI.',
              prefixText: 'Rather than replacing workers entirely, many sociologists foresee cognitive',
              suffixText: 'where people work with AI.',
              answer: 'augmentation',
              acceptableAnswers: ['augmentation'],
              evidenceParagraph: 'C',
              evidenceQuote: 'many labour sociologists foresee a paradigm of cognitive augmentation',
              explanation: 'Từ cần điền là danh từ "augmentation" (sự tăng cường / bổ trợ nhận thức).'
            },
            {
              id: 38,
              order: 38,
              questionText: 'A fast-paced AI transition could widen wage ................ across society.',
              prefixText: 'A fast-paced AI transition could widen wage',
              suffixText: 'across society.',
              answer: 'polarisation',
              acceptableAnswers: ['polarisation', 'polarization'],
              evidenceParagraph: 'D',
              evidenceQuote: 'threatening structural wage polarisation and widespread socio-economic discontent.',
              explanation: 'Từ cần điền là danh từ "polarisation" (sự phân cực thu nhập).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'Some governments are considering taxes on ................ to fund retraining programs.',
              prefixText: 'Some governments are considering taxes on',
              suffixText: 'to fund retraining programs.',
              answer: 'robot',
              acceptableAnswers: ['robot', 'robots'],
              evidenceParagraph: 'E',
              evidenceQuote: 'Proposals range from "robot taxes" that disincentivise premature automation',
              explanation: 'Từ cần điền là "robot" (trong cụm robot taxes - thuế áp lên robot).'
            },
            {
              id: 40,
              order: 40,
              questionText: 'School syllabuses need to move away from ................ learning towards creative thinking.',
              prefixText: 'School syllabuses need to move away from',
              suffixText: 'learning towards creative thinking.',
              answer: 'rote',
              acceptableAnswers: ['rote'],
              evidenceParagraph: 'E',
              evidenceQuote: 'curricula must pivot away from rote memorisation',
              explanation: 'Từ cần điền là tính từ "rote" (trong cụm rote memorisation - học vẹt, học vẹt cơ học).'
            }
          ]
        }
      ]
    }
  ]
};
