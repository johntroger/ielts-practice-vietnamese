/**
 * IELTS Reading Practice Tasks Dataset (Standard Cambridge Academic Format)
 * Full 3 Passages, 40 Questions, Exact Answer Keys, Evidence Locators & Paraphrase Maps.
 */

export const INITIAL_READING_TESTS = [
  {
    id: 'cambridge-academic-test-1',
    title: 'Cambridge Practice Test 01: Modern Innovation & Science',
    description: 'Bộ đề thi thử chuẩn Cambridge Academic gồm 3 bài đọc với đầy đủ 40 câu hỏi, thời gian làm bài 60 phút.',
    totalQuestions: 40,
    timeLimitMinutes: 60,
    passages: [
      {
        id: 'p1',
        passageNumber: 1,
        title: 'The Roman Shipwrecks of Pisa',
        topic: 'hist',
        difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
        wordCount: 820,
        paragraphs: [
          {
            id: 'A',
            text: 'In December 1998, workers digging the foundations for a new railway station at San Rossore, just outside the historic Italian city of Pisa, stumbled upon one of the most extraordinary archaeological finds of modern times. Buried beneath layers of mud, silt, and ancient river sediment lay the remarkably well-preserved remains of over thirty Roman ships, dating from the third century BC to the sixth century AD. The discovery was instantly hailed by classical historians and marine archaeologists as an unprecedented ancient maritime time capsule.'
          },
          {
            id: 'B',
            text: 'Pisa was known in antiquity as a vibrant port, situated at the confluence of the rivers Arno and Auser near the Ligurian Sea. Over the centuries, however, persistent silt deposition and severe seismic activity altered the local geography, causing catastrophic flash floods that engulfed the harbour. Torrential currents dragged commercial vessels, cargo barges, and riverboats down into an underwater graveyard, burying them so rapidly in oxygen-poor silt that decay was halted. The anaerobic environment preserved delicate organic materials—timber hulls, coiled ropes, woven baskets, leather sandals, and even intact jars filled with pickled olives and ancient wine.'
          },
          {
            id: 'C',
            text: 'Among the most spectacular vessels unearthed was an 18-metre-long merchant ship named the Alkedo (The Gull). Constructed from durable oak and soft pine, the ship retained its wooden benches, carved prow, and thirty oars. Inscribed on a pine plank inside the hull was the shipwright’s signature, confirming its provenance in the early first century AD. The cargo included terracotta amphorae loaded with fermented fish sauce (garum) from southern Spain, olive oil from North Africa, and marble slabs from the quarries of Carrara.'
          },
          {
            id: 'D',
            text: 'Excavating and conserving waterlogged timber presented monumental technical hurdles for the conservation team. Once exposed to atmospheric oxygen and ambient heat, the ancient wood risked shrinking, warping, and disintegrating into dust within hours. To forestall this destruction, specialists applied a continuous mist of cold water and biocides over the site. Subsequently, conservators impregnated the timbers with polyethylene glycol (PEG), a synthetic wax compound that gradually displaced moisture inside the plant cells, solidifying the wooden structure before controlled freeze-drying.'
          },
          {
            id: 'E',
            text: 'The archaeological site has now been transformed into the Museum of Ancient Ships of Pisa (Museo delle Navi Antiche di Pisa), housed within the 16th-century Arsenali Medicei. The exhibition offers visitors a vivid window into Mediterranean trade routes, shipbuilding technology, and the daily lives of sailors two thousand years ago. For historians, the Pisa fleet proves that Roman maritime dominance relied not merely on military power, but on a sophisticated, highly interconnected global commercial transport network.'
          }
        ],
        questionGroups: [
          {
            id: 'qg-1-1',
            type: 'true_false_not_given',
            title: 'Questions 1–6',
            instruction: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–6 on your answer sheet, choose:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
            questions: [
              {
                id: 1,
                order: 1,
                questionText: 'The ancient Roman vessels were uncovered during an intentional archaeological exploration.',
                answer: 'FALSE',
                evidenceParagraph: 'A',
                evidenceQuote: 'workers digging the foundations for a new railway station... stumbled upon one of the most extraordinary archaeological finds',
                explanation: 'Đề bài nói việc tìm thấy tàu là do "cuộc khai quật khảo cổ có chủ đích" (intentional archaeological exploration). Tuy nhiên bài đọc nói công nhân đang đào móng làm ga xe lửa thì tình cờ vấp phải (stumbled upon). Do đó đáp án là FALSE.'
              },
              {
                id: 2,
                order: 2,
                questionText: 'The ships discovered at San Rossore all originated from the same century.',
                answer: 'FALSE',
                evidenceParagraph: 'A',
                evidenceQuote: 'dating from the third century BC to the sixth century AD.',
                explanation: 'Đề bài nói các con tàu đều xuất phát từ cùng một thế kỷ. Trong bài nêu rõ các tàu có niên đại trải dài từ thế kỷ thứ 3 TCN đến thế kỷ thứ 6 SCN (gần 900 năm). Do đó đáp án là FALSE.'
              },
              {
                id: 3,
                order: 3,
                questionText: 'The absence of oxygen in the sediment prevented the wooden ships from rotting away.',
                answer: 'TRUE',
                evidenceParagraph: 'B',
                evidenceQuote: 'burying them so rapidly in oxygen-poor silt that decay was halted. The anaerobic environment preserved delicate organic materials',
                explanation: 'Đề bài nói "sự thiếu hụt oxy trong bùn trầm tích đã ngăn các tàu gỗ không bị mục rữa". Bài đọc khẳng định "oxygen-poor silt that decay was halted. The anaerobic environment preserved...". Ý hoàn toàn trùng khớp nên là TRUE.'
              },
              {
                id: 4,
                order: 4,
                questionText: 'The ship Alkedo was transporting olive oil brought directly from southern Spain.',
                answer: 'FALSE',
                evidenceParagraph: 'C',
                evidenceQuote: 'fermented fish sauce (garum) from southern Spain, olive oil from North Africa',
                explanation: 'Đề bài nói "tàu Alkedo chở dầu ô liu mang trực tiếp từ miền nam Tây Ban Nha". Bài đọc nêu dầu ô liu đến từ Bắc Phi (North Africa), còn Tây Ban Nha là nguồn cung cấp nước mắm lên men (garum). Do đó đáp án là FALSE.'
              },
              {
                id: 5,
                order: 5,
                questionText: 'Polyethylene glycol (PEG) was used to replace water content in the waterlogged timber.',
                answer: 'TRUE',
                evidenceParagraph: 'D',
                evidenceQuote: 'impregnated the timbers with polyethylene glycol (PEG), a synthetic wax compound that gradually displaced moisture inside the plant cells',
                explanation: 'Đề bài nói PEG được dùng để thay thế lượng nước trong các thanh gỗ ngậm nước. Bài đọc xác nhận PEG "gradually displaced moisture inside the plant cells". Hoàn toàn chính xác nên là TRUE.'
              },
              {
                id: 6,
                order: 6,
                questionText: 'The Museum of Ancient Ships of Pisa receives financial sponsorship from international heritage organisations.',
                answer: 'NOT GIVEN',
                evidenceParagraph: 'E',
                evidenceQuote: 'The archaeological site has now been transformed into the Museum of Ancient Ships of Pisa... housed within the 16th-century Arsenali Medicei.',
                explanation: 'Đoạn E có nhắc đến Bảo tàng được đặt tại Arsenali Medicei, nhưng hoàn toàn KHÔNG đề cập thông tin bảo tàng này có nhận tài trợ tài chính từ các tổ chức quốc tế hay không. Do đó đáp án là NOT GIVEN.'
              }
            ]
          },
          {
            id: 'qg-1-2',
            type: 'summary_completion',
            title: 'Questions 7–10',
            instruction: 'Complete the summary below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 7–10 on your answer sheet.',
            summaryText: 'The commercial vessel known as the Alkedo was an 18-metre ship built using a combination of pine and [q7]. Its date was authenticated due to the [q8] of the shipwright discovered inscribed on a hull plank. The diverse cargo items revealed broad trading routes: amphorae carrying Spanish [q9], alongside heavy building slabs made of [q10] from the local Carrara quarries.',
            questions: [
              {
                id: 7,
                order: 7,
                questionText: 'built using a combination of pine and...',
                answer: 'oak',
                acceptableAnswers: ['oak', 'durable oak'],
                evidenceParagraph: 'C',
                evidenceQuote: 'Constructed from durable oak and soft pine',
                explanation: 'Tàu Alkedo được đóng bằng gỗ thông (pine) kết hợp với gỗ sồi chắc chắn (oak).'
              },
              {
                id: 8,
                order: 8,
                questionText: 'authenticated due to the ... of the shipwright',
                answer: 'signature',
                acceptableAnswers: ['signature'],
                evidenceParagraph: 'C',
                evidenceQuote: 'Inscribed on a pine plank inside the hull was the shipwright’s signature',
                explanation: 'Niên đại tàu được xác thực nhờ vào chữ ký (signature) của người đóng tàu khắc trên ván gỗ.'
              },
              {
                id: 9,
                order: 9,
                questionText: 'amphorae carrying Spanish ...',
                answer: 'fish sauce',
                acceptableAnswers: ['fish sauce', 'garum'],
                evidenceParagraph: 'C',
                evidenceQuote: 'fermented fish sauce (garum) from southern Spain',
                explanation: 'Các bình gốm amphorae chứa nước mắm cá lên men (fish sauce / garum) xuất xứ từ Tây Ban Nha.'
              },
              {
                id: 10,
                order: 10,
                questionText: 'heavy building slabs made of ...',
                answer: 'marble',
                acceptableAnswers: ['marble'],
                evidenceParagraph: 'C',
                evidenceQuote: 'and marble slabs from the quarries of Carrara.',
                explanation: 'Các phiến đá xây dựng làm từ đá cẩm thạch (marble) khai thác từ mỏ đá Carrara.'
              }
            ]
          },
          {
            id: 'qg-1-3',
            type: 'multiple_choice_single',
            title: 'Questions 11–13',
            instruction: 'Choose the correct letter, A, B, C, or D.\nWrite the correct letter in boxes 11–13 on your answer sheet.',
            questions: [
              {
                id: 11,
                order: 11,
                questionText: 'According to Paragraph B, why were the ships so well preserved under the mud?',
                options: [
                  { letter: 'A', text: 'The river water contained high levels of volcanic minerals.' },
                  { letter: 'B', text: 'Rapid burial in oxygen-deprived sediment prevented bacterial decay.' },
                  { letter: 'C', text: 'Roman sailors had coated the wooden hulls with chemical wax.' },
                  { letter: 'D', text: 'Continuous flash floods washed away harmful microorganisms.' }
                ],
                answer: 'B',
                evidenceParagraph: 'B',
                evidenceQuote: 'burying them so rapidly in oxygen-poor silt that decay was halted. The anaerobic environment preserved delicate organic materials',
                explanation: 'Đáp án B chính xác vì sự vùi lấp nhanh trong lớp bùn không có oxy (anaerobic/oxygen-poor) đã ngăn chặn sự phân hủy của vi khuẩn.'
              },
              {
                id: 12,
                order: 12,
                questionText: 'What immediate risk did the ancient timber face upon excavation?',
                options: [
                  { letter: 'A', text: 'It would be infected by toxic chemical algae.' },
                  { letter: 'B', text: 'It could crumble and lose shape when exposed to air and heat.' },
                  { letter: 'C', text: 'The weight of the mud would break the oars and benches.' },
                  { letter: 'D', text: 'Polyethylene glycol would react adversely with the wood cells.' }
                ],
                answer: 'B',
                evidenceParagraph: 'D',
                evidenceQuote: 'Once exposed to atmospheric oxygen and ambient heat, the ancient wood risked shrinking, warping, and disintegrating into dust within hours.',
                explanation: 'Đáp án B đúng vì khi tiếp xúc với không khí và nhiệt độ (air and heat), gỗ có nguy cơ co lại, cong vênh và tan biến thành cát bụi trong vài giờ.'
              },
              {
                id: 13,
                order: 13,
                questionText: 'What overall conclusion does the author reach about the Roman Empire in Paragraph E?',
                options: [
                  { letter: 'A', text: 'Its survival depended entirely on military legions in Pisa.' },
                  { letter: 'B', text: 'Its naval engineering was inferior to Mediterranean competitors.' },
                  { letter: 'C', text: 'Its dominance was backed by a highly developed maritime trading network.' },
                  { letter: 'D', text: 'Its commercial fleet was repeatedly wiped out by natural disasters.' }
                ],
                answer: 'C',
                evidenceParagraph: 'E',
                evidenceQuote: 'Roman maritime dominance relied not merely on military power, but on a sophisticated, highly interconnected global commercial transport network.',
                explanation: 'Tác giả kết luận sự thống trị của La Mã không chỉ dựa vào quân sự mà còn nhờ vào mạng lưới giao thương hàng hải toàn cầu tinh vi và kết nối cao.'
              }
            ]
          }
        ]
      },
      {
        id: 'p2',
        passageNumber: 2,
        title: 'The Neuroscience of Bilingualism',
        topic: 'neuro',
        difficulty: 'Trung bình - Khá (Band 6.5 - 7.5)',
        wordCount: 890,
        paragraphs: [
          {
            id: 'A',
            text: 'For the greater part of the twentieth century, educators and paediatricians in the Western world cautioned parents against raising children bilingually. Monolingualism was presumed to be the neurological baseline, and introducing a second language early in life was believed to cause severe developmental deficits. Academics warned that juggling two linguistic codes would overburden the infant brain, resulting in cognitive confusion, stuttering, and an impoverished vocabulary in both tongues. Today, modern cognitive neuroscience has thoroughly debunked this fallacy, revealing that bilingualism confers profound, lifelong benefits upon the architecture of the human mind.'
          },
          {
            id: 'B',
            text: 'The primary cognitive advantage enjoyed by bilinguals resides in what psychologists term executive function. This complex neural network, centred largely in the prefrontal cortex, coordinates higher-order mental tasks: working memory, sustained attentional control, mental flexibility, and the ability to suppress irrelevant distractions. Whenever a bilingual individual speaks, both languages remain simultaneously active in the brain. If an English-French speaker wishes to say “dog”, the brain must constantly inhibit the competing French equivalent “chien”. This perpetual mental tug-of-war acts as continuous aerobic exercise for the prefrontal cortex, sharpening executive control far beyond that of monolingual peers.'
          },
          {
            id: 'C',
            text: 'Groundbreaking research conducted by Dr. Ellen Bialystok at York University in Toronto demonstrated that this mental workout provides a tangible shield against neurodegenerative decline. Studying hundreds of elderly patients diagnosed with Alzheimer’s disease, Bialystok made a staggering observation: while brain scans showed equivalent levels of cellular deterioration and plaque deposition, bilingual patients began displaying outward clinical symptoms of dementia four to five years later than their monolingual counterparts. Bilingual brains appear to cultivate superior cognitive reserve—a resilient reserve of redundant neural pathways that allows the brain to compensate for physical damage.'
          },
          {
            id: 'D',
            text: 'Beyond neurological resilience, bilingualism fosters heightened social intelligence. When children learn from infancy that people navigate the world through different linguistic prisms, they develop an earlier awareness that other individuals possess distinct beliefs, desires, and mental viewpoints. This cognitive milestone, known in developmental psychology as Theory of Mind, typically crystallises in bilingual children several months ahead of monolinguals. Consequently, bilingual adults frequently demonstrate superior communicative tact, perceptual empathy, and adeptness at resolving interpersonal friction.'
          },
          {
            id: 'E',
            text: 'Nevertheless, the bilingual brain does make subtle trade-offs. Comprehensive tests indicate that bilinguals occasionally experience greater difficulty with rapid lexical retrieval. They take fractions of a second longer to name everyday objects when presented with photographs, and they report more frequent occurrences of the “tip-of-the-tongue” phenomenon, wherein a familiar word is temporarily inaccessible. Cognitive linguists emphasise that this does not denote cognitive deficiency, but rather reflects the sheer logistical challenge of cataloguing and retrieving items from a mental lexicon that contains double the quantity of words.'
          }
        ],
        questionGroups: [
          {
            id: 'qg-2-1',
            type: 'matching_headings',
            title: 'Questions 14–18',
            instruction: 'Reading Passage 2 has five paragraphs, A–E.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–viii, in boxes 14–18 on your answer sheet.',
            headings: [
              { id: 'i', text: 'A physiological buffer against age-related degeneration' },
              { id: 'ii', text: 'The historical misconception of multilingual parenting' },
              { id: 'iii', text: 'Minor verbal retrieval delays and their underlying cause' },
              { id: 'iv', text: 'Structural damage caused by excessive linguistic processing' },
              { id: 'v', text: 'Strengthening the brain’s mental control centre' },
              { id: 'vi', text: 'The economic advantages of multilingual graduates' },
              { id: 'vii', text: 'Enhanced interpersonal insight and empathy' },
              { id: 'viii', text: 'Technological tools for infant language acquisition' }
            ],
            questions: [
              {
                id: 14,
                order: 14,
                questionText: 'Paragraph A',
                answer: 'ii',
                evidenceParagraph: 'A',
                evidenceQuote: 'cautioned parents against raising children bilingually... debunked this fallacy',
                explanation: 'Đoạn A nói về quan niệm sai lầm trong quá khứ khi các nhà giáo dục cảnh báo phụ huynh không nên nuôi dạy con song ngữ (ii. The historical misconception of multilingual parenting).'
              },
              {
                id: 15,
                order: 15,
                questionText: 'Paragraph B',
                answer: 'v',
                evidenceParagraph: 'B',
                evidenceQuote: 'This perpetual mental tug-of-war acts as continuous aerobic exercise for the prefrontal cortex, sharpening executive control',
                explanation: 'Đoạn B giải thích việc não bộ liên tục ức chế từ vựng giúp rèn luyện và tăng cường sức mạnh cho trung tâm điều hành prefrontal cortex (v. Strengthening the brain’s mental control centre).'
              },
              {
                id: 16,
                order: 16,
                questionText: 'Paragraph C',
                answer: 'i',
                evidenceParagraph: 'C',
                evidenceQuote: 'provides a tangible shield against neurodegenerative decline... four to five years later than their monolingual counterparts',
                explanation: 'Đoạn C nói về việc song ngữ trì hoãn triệu chứng Alzheimer từ 4-5 năm, tạo ra lớp đệm sinh lý chống lại sự suy thoái do tuổi tác (i. A physiological buffer against age-related degeneration).'
              },
              {
                id: 17,
                order: 17,
                questionText: 'Paragraph D',
                answer: 'vii',
                evidenceParagraph: 'D',
                evidenceQuote: 'Theory of Mind... superior communicative tact, perceptual empathy',
                explanation: 'Đoạn D nói về việc trẻ song ngữ phát triển "Theory of Mind" sớm hơn, gia tăng thấu cảm và hiểu biết xã hội giữa con người (vii. Enhanced interpersonal insight and empathy).'
              },
              {
                id: 18,
                order: 18,
                questionText: 'Paragraph E',
                answer: 'iii',
                evidenceParagraph: 'E',
                evidenceQuote: 'experience greater difficulty with rapid lexical retrieval... sheer logistical challenge of cataloguing and retrieving items',
                explanation: 'Đoạn E phân tích sự chậm trễ nhẹ trong việc truy xuất từ vựng (tip-of-the-tongue) và nguyên nhân do vốn từ vựng lớn gấp đôi (iii. Minor verbal retrieval delays and their underlying cause).'
              }
            ]
          },
          {
            id: 'qg-2-2',
            type: 'matching_features',
            title: 'Questions 19–22',
            instruction: 'Look at the following findings (Questions 19–22) and the list of researchers and concepts below.\nMatch each finding with the correct researcher or concept, A, B, C, or D.',
            features: [
              { letter: 'A', name: 'Prefrontal Cortex & Executive Control' },
              { letter: 'B', name: 'Dr. Ellen Bialystok' },
              { letter: 'C', name: 'Theory of Mind' },
              { letter: 'D', name: 'Tip-of-the-tongue Phenomenon' }
            ],
            questions: [
              {
                id: 19,
                order: 19,
                questionText: 'Clinical symptoms of memory-loss illness were postponed despite actual physical damage to the brain.',
                answer: 'B',
                evidenceParagraph: 'C',
                evidenceQuote: 'Bialystok made a staggering observation: while brain scans showed equivalent levels of cellular deterioration... patients began displaying outward clinical symptoms four to five years later',
                explanation: 'Nghiên cứu của Tiến sĩ Ellen Bialystok chứng minh triệu chứng suy giảm trí nhớ bị đẩy lùi 4-5 năm dù quét não cho thấy cùng mức độ tổn thương mô.'
              },
              {
                id: 20,
                order: 20,
                questionText: 'The mental mechanism responsible for inhibiting rival words operates like a physical exercise workout.',
                answer: 'A',
                evidenceParagraph: 'B',
                evidenceQuote: 'This perpetual mental tug-of-war acts as continuous aerobic exercise for the prefrontal cortex',
                explanation: 'Prefrontal Cortex hoạt động như bài tập thể dục aerobic liên tục để ức chế từ vựng cạnh tranh.'
              },
              {
                id: 21,
                order: 21,
                questionText: 'An early realisation that other individuals perceive circumstances through different viewpoints.',
                answer: 'C',
                evidenceParagraph: 'D',
                evidenceQuote: 'other individuals possess distinct beliefs, desires, and mental viewpoints. This cognitive milestone, known in developmental psychology as Theory of Mind',
                explanation: 'Đó chính là định nghĩa của khái niệm "Theory of Mind" trong tâm lý học phát triển.'
              },
              {
                id: 22,
                order: 22,
                questionText: 'A temporary difficulty experienced when searching for a well-known word inside a dual vocabulary storage.',
                answer: 'D',
                evidenceParagraph: 'E',
                evidenceQuote: 'tip-of-the-tongue phenomenon, wherein a familiar word is temporarily inaccessible.',
                explanation: 'Hiện tượng "đầu lưỡi" (tip-of-the-tongue) là khi một từ quen thuộc tạm thời không thể truy xuất ra được.'
              }
            ]
          },
          {
            id: 'qg-2-3',
            type: 'sentence_completion',
            title: 'Questions 23–26',
            instruction: 'Complete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 23–26 on your answer sheet.',
            questions: [
              {
                id: 23,
                order: 23,
                questionText: 'During the 20th century, scientists mistakenly assumed that [q23] was the standard neurological state for humans.',
                answer: 'monolingualism',
                acceptableAnswers: ['monolingualism'],
                evidenceParagraph: 'A',
                evidenceQuote: 'Monolingualism was presumed to be the neurological baseline',
                explanation: 'Trong thế kỷ 20, người ta lầm tưởng việc chỉ biết 1 thứ tiếng (monolingualism) là chuẩn mực thần kinh.'
              },
              {
                id: 24,
                order: 24,
                questionText: 'When speaking, a bilingual brain must deliberately suppress any [q24] word from the alternate tongue.',
                answer: 'competing',
                acceptableAnswers: ['competing'],
                evidenceParagraph: 'B',
                evidenceQuote: 'constantly inhibit the competing French equivalent “chien”',
                explanation: 'Bộ não phải chủ động ức chế từ vựng cạnh tranh (competing) từ ngôn ngữ còn lại.'
              },
              {
                id: 25,
                order: 25,
                questionText: 'Bilingual Alzheimer’s patients exhibited higher [q25] that helped mitigate brain degeneration.',
                answer: 'cognitive reserve',
                acceptableAnswers: ['cognitive reserve'],
                evidenceParagraph: 'C',
                evidenceQuote: 'Bilingual brains appear to cultivate superior cognitive reserve—a resilient reserve of redundant neural pathways',
                explanation: 'Bệnh nhân song ngữ sở hữu mức dự trữ nhận thức (cognitive reserve) cao hơn giúp bù đắp tổn thương não.'
              },
              {
                id: 26,
                order: 26,
                questionText: 'Slower picture naming among bilinguals reflects the complexity of navigating a mental [q26] that is twice as large.',
                answer: 'lexicon',
                acceptableAnswers: ['lexicon'],
                evidenceParagraph: 'E',
                evidenceQuote: 'retrieving items from a mental lexicon that contains double the quantity of words.',
                explanation: 'Do kho từ vựng tinh thần (lexicon) lớn gấp đôi nên việc truy xuất mất nhiều thời gian hơn.'
              }
            ]
          }
        ]
      },
      {
        id: 'p3',
        passageNumber: 3,
        title: 'Atmospheric Geoengineering: Humanity’s Perilous Dilemma',
        topic: 'env',
        difficulty: 'Khó - Nâng cao (Band 7.5 - 9.0)',
        wordCount: 960,
        paragraphs: [
          {
            id: 'A',
            text: 'As international carbon reduction pledges fall chronically behind scientific targets and global mean temperatures approach tipping points, a once-taboo fringe concept has migrated into mainstream geopolitical discourse: solar radiation management (SRM), colloquially termed solar geoengineering. Rather than tackling the tortuous task of decarbonising the global energy architecture, SRM proposes artificial manipulation of the planet’s albedo to reflect a fraction of incoming sunlight back into space. Proponents argue that it constitutes a swift, technologically feasible, and astonishingly inexpensive brake on runaway thermal acceleration. Opponents counter that it represents an act of hubris with irreversible ecological ramifications.'
          },
          {
            id: 'B',
            text: 'The primary technological vehicle for SRM draws inspiration from nature’s most violent volcanic episodes. When Mount Pinatubo erupted in the Philippines in June 1991, it injected nearly twenty million tons of sulfur dioxide gas high into the stratosphere. The resulting aerosol veil encircled the globe, reflecting solar radiation and cooling global surface temperatures by approximately 0.5 degrees Celsius for over eighteen months. Atmospheric engineers propose replicating this volcanic effect by deploying specialized high-altitude aircraft or artillery to continuously disperse sub-micrometer sulfate aerosols or diamond dust into the lower stratosphere. Climate models indicate that an annual deployment costing a modest few billion dollars could neutralize all global warming experienced since the Industrial Revolution.'
          },
          {
            id: 'C',
            text: 'Nevertheless, the thermodynamic simplicity of cooling the Earth belies horrifying atmospheric complexity. The climate system does not respond uniformly to solar deflection. Stratospheric aerosols would dramatically modify global circulation patterns, altering the temperature differential between landmasses and oceans. The most alarming projection involves the disruption of the South Asian and West African monsoon systems, upon which over two billion subsistence farmers depend for staple grain cultivation. A localized reduction in tropical rainfall could trigger regional agricultural collapses, precipitating famines of catastrophic scale. Furthermore, sulfur aerosols would delay the convalescence of the stratospheric ozone layer and cause ocean acidification to march onward unabated, since atmospheric carbon dioxide concentrations would continue their inexorable ascent.'
          },
          {
            id: 'D',
            text: 'Perhaps the most pernicious hazard is geopolitical and psychological, encapsulated in the twin concepts of “termination shock” and “moral hazard”. Were a nation or coalition to initiate stratospheric injection and subsequently halt operations abruptly—due to war, technical failure, or political insurrection—the masked radiative forcing would uncoil with catastrophic rapidity. Temperatures would spike by several degrees within a solitary decade, triggering an extinction pulse that would extinguish species incapable of rapid migration. Simultaneously, the seductive prospect of an inexpensive techno-fix risks enfeebling the political fortitude required to enact painful carbon emission cuts, providing fossil-fuel cartels with a convenient pretext for inaction.'
          },
          {
            id: 'E',
            text: 'Currently, solar geoengineering operates within an anarchic regulatory void. No binding international treaty exists to govern planetary temperature manipulation. The chilling reality is that the financial and technological threshold for SRM is so remarkably low that a single rogue state, a billionaire technocrat, or an aggrieved coalition facing lethal heatwaves could execute it unilaterally. Such a unilateral deployment could be perceived by opposing superpowers as an act of climate warfare, destabilising nuclear deterrence. Humanity stands before a Faustian pact: to refuse geoengineering research is to accept the catastrophe of extreme warming; to embrace it is to gamble with the planetary life-support machinery that sustains civilised existence.'
          }
        ],
        questionGroups: [
          {
            id: 'qg-3-1',
            type: 'yes_no_not_given',
            title: 'Questions 27–32',
            instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 27–32 on your answer sheet, choose:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
            questions: [
              {
                id: 27,
                order: 27,
                questionText: 'Solar radiation management aims to eliminate the excessive greenhouse gases already present in the atmosphere.',
                answer: 'NO',
                evidenceParagraph: 'A',
                evidenceQuote: 'Rather than tackling the tortuous task of decarbonising... SRM proposes artificial manipulation of the planet’s albedo to reflect sunlight',
                explanation: 'SRM không nhằm mục đích loại bỏ khí nhà kính (decarbonising) mà chỉ phản xạ lại ánh sáng mặt trời (reflect incoming sunlight). Do đó tuyên bố mâu thuẫn với tác giả (NO).'
              },
              {
                id: 28,
                order: 28,
                questionText: 'The natural cooling produced by Mount Pinatubo lasted for more than two years.',
                answer: 'NO',
                evidenceParagraph: 'B',
                evidenceQuote: 'cooling global surface temperatures by approximately 0.5 degrees Celsius for over eighteen months.',
                explanation: 'Bài đọc nêu tác động kéo dài hơn 18 tháng (1.5 năm), chứ không phải hơn hai năm (more than two years). Do đó đáp án là NO.'
              },
              {
                id: 29,
                order: 29,
                questionText: 'The total cost of manufacturing artificial diamond dust for SRM is excessively prohibitive for developing nations.',
                answer: 'NOT GIVEN',
                evidenceParagraph: 'B',
                evidenceQuote: 'continuously disperse sub-micrometer sulfate aerosols or diamond dust into the lower stratosphere.',
                explanation: 'Đoạn B có nhắc đến "diamond dust" nhưng không hề bàn luận chi phí sản xuất kim cương nhân tạo này có đắt đỏ đối với các nước đang phát triển hay không. Do đó là NOT GIVEN.'
              },
              {
                id: 30,
                order: 30,
                questionText: 'Stratospheric aerosols will protect the global marine biosphere from the consequences of ocean acidification.',
                answer: 'NO',
                evidenceParagraph: 'C',
                evidenceQuote: 'cause ocean acidification to march onward unabated, since atmospheric carbon dioxide concentrations would continue their inexorable ascent.',
                explanation: 'Aerosols không hề bảo vệ đại dương mà axit hóa đại dương vẫn tiếp diễn không thuyên giảm (unabated) vì lượng CO2 vẫn tiếp tục tăng. Do đó đáp án là NO.'
              },
              {
                id: 31,
                order: 31,
                questionText: 'Termination shock refers to the ecological disaster caused by sudden cessation of solar geoengineering.',
                answer: 'YES',
                evidenceParagraph: 'D',
                evidenceQuote: 'Were a nation... to initiate stratospheric injection and subsequently halt operations abruptly... temperatures would spike by several degrees within a solitary decade',
                explanation: 'Định nghĩa của "Termination shock" chính là việc dừng đột ngột khiến nhiệt độ tăng vọt trong 1 thập kỷ gây thảm họa sinh thái. Tác giả khẳng định điều này (YES).'
              },
              {
                id: 32,
                order: 32,
                questionText: 'International bodies have ratified comprehensive governance treaties to supervise solar geoengineering activities.',
                answer: 'NO',
                evidenceParagraph: 'E',
                evidenceQuote: 'Currently, solar geoengineering operates within an anarchic regulatory void. No binding international treaty exists',
                explanation: 'Bài khẳng định đang ở trong khoảng trống quản lý vô chính phủ (regulatory void) và chưa có hiệp ước quốc tế có tính ràng buộc nào tồn tại. Do đó đáp án là NO.'
              }
            ]
          },
          {
            id: 'qg-3-2',
            type: 'multiple_choice_single',
            title: 'Questions 33–36',
            instruction: 'Choose the correct letter, A, B, C, or D.\nWrite the correct letter in boxes 33–36 on your answer sheet.',
            questions: [
              {
                id: 33,
                order: 33,
                questionText: 'According to Paragraph B, what was the primary climatic effect of Mount Pinatubo’s 1991 eruption?',
                options: [
                  { letter: 'A', text: 'It created severe permanent droughts in equatorial regions.' },
                  { letter: 'B', text: 'It released diamond dust that accelerated polar cooling.' },
                  { letter: 'C', text: 'It temporarily lowered planetary surface temperatures via an aerosol veil.' },
                  { letter: 'D', text: 'It permanently reversed global warming since the Industrial Revolution.' }
                ],
                answer: 'C',
                acceptableAnswers: ['C'],
                evidenceParagraph: 'B',
                evidenceQuote: 'The resulting aerosol veil encircled the globe, reflecting solar radiation and cooling global surface temperatures by approximately 0.5 degrees Celsius for over eighteen months.',
                explanation: 'Đoạn B nêu rõ lớp màn sol khí từ núi lửa Pinatubo đã phản xạ bức xạ mặt trời và làm mát bề mặt trái đất 0.5 độ C trong 18 tháng (C).'
              },
              {
                id: 34,
                order: 34,
                questionText: 'In Paragraph C, why is the disruption of monsoon systems considered particularly alarming?',
                options: [
                  { letter: 'A', text: 'It would cause sudden catastrophic cooling in high-altitude polar zones.' },
                  { letter: 'B', text: 'Billions of subsistence farmers depend on monsoon rainfall for food cultivation.' },
                  { letter: 'C', text: 'It would immediately destroy all maritime cargo transport across the Indian Ocean.' },
                  { letter: 'D', text: 'It would accelerate carbon emissions from tropical rainforests.' }
                ],
                answer: 'B',
                acceptableAnswers: ['B'],
                evidenceParagraph: 'C',
                evidenceQuote: 'The most alarming projection involves the disruption of the South Asian and West African monsoon systems, upon which over two billion subsistence farmers depend for staple grain cultivation.',
                explanation: 'Đoạn C khẳng định hiểm họa đáng báo động nhất là hơn 2 tỷ nông dân canh tác tự cung tự cấp phụ thuộc vào nguồn nước mưa gió mùa này để trồng ngũ cốc sinh tồn (B).'
              },
              {
                id: 35,
                order: 35,
                questionText: 'According to Paragraph D, what danger is posed by the psychological concept of “moral hazard”?',
                options: [
                  { letter: 'A', text: 'It causes scientists to abandon laboratory safety protocols.' },
                  { letter: 'B', text: 'It prompts rapid species extinction pulses within a single decade.' },
                  { letter: 'C', text: 'It weakens the political willpower needed to implement painful carbon cuts.' },
                  { letter: 'D', text: 'It creates intense public panic regarding atmospheric chemistry.' }
                ],
                answer: 'C',
                acceptableAnswers: ['C'],
                evidenceParagraph: 'D',
                evidenceQuote: 'the seductive prospect of an inexpensive techno-fix risks enfeebling the political fortitude required to enact painful carbon emission cuts',
                explanation: 'Đoạn D giải thích "moral hazard" làm suy yếu nhuệ khí/ý chí chính trị (enfeebling political fortitude) trong việc thực thi các biện pháp cắt giảm phát thải (C).'
              },
              {
                id: 36,
                order: 36,
                questionText: 'What makes unilateral deployment of SRM a realistic possibility according to Paragraph E?',
                options: [
                  { letter: 'A', text: 'The relatively low financial and technological barrier to entry.' },
                  { letter: 'B', text: 'Widespread approval by the United Nations Security Council.' },
                  { letter: 'C', text: 'The existence of comprehensive international regulatory frameworks.' },
                  { letter: 'D', text: 'Guaranteed cooperation between competing nuclear superpowers.' }
                ],
                answer: 'A',
                acceptableAnswers: ['A'],
                evidenceParagraph: 'E',
                evidenceQuote: 'The chilling reality is that the financial and technological threshold for SRM is so remarkably low that a single rogue state, a billionaire technocrat... could execute it unilaterally.',
                explanation: 'Đoạn E nhấn mạnh ngưỡng chi phí tài chính và công nghệ thấp đến bất ngờ (remarkably low threshold) khiến một quốc gia cá biệt hoặc tỷ phú công nghệ có thể tự ý đơn phương triển khai (A).'
              }
            ]
          },
          {
            id: 'qg-3-3',
            type: 'summary_completion',
            title: 'Questions 37–40',
            instruction: 'Complete the summary below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 37–40 on your answer sheet.',
            summaryText: 'Solar radiation management proposes modifying Earth’s albedo to reflect sunlight, drawing inspiration from natural [q37] occurrences such as the 1991 Mount Pinatubo eruption. However, this intervention risks introducing severe hazards. Beyond climatic disruptions to monsoons, critics fear the concept of [q38], in which the existence of an easy techno-fix diminishes the political drive to curtail carbon emissions. Furthermore, if stratospheric dispersion ceased abruptly, an effect known as [q39] would unleash extremely rapid temperature increases. Because the technology currently lacks any [q40] to govern its application, unilateral deployment remains a grave risk.',
            questions: [
              {
                id: 37,
                order: 37,
                questionText: 'drawing inspiration from natural ... occurrences',
                answer: 'volcanic',
                acceptableAnswers: ['volcanic'],
                evidenceParagraph: 'B',
                evidenceQuote: 'draws inspiration from nature’s most violent volcanic episodes.',
                explanation: 'Lấy cảm hứng từ các hiện tượng tự nhiên của núi lửa (volcanic).'
              },
              {
                id: 38,
                order: 38,
                questionText: 'critics fear the concept of ...',
                answer: 'moral hazard',
                acceptableAnswers: ['moral hazard'],
                evidenceParagraph: 'D',
                evidenceQuote: 'encapsulated in the twin concepts of “termination shock” and “moral hazard”. ... risks enfeebling the political fortitude',
                explanation: 'Khái niệm rủi ro đạo đức (moral hazard) làm suy yếu ý chí chính trị trong việc cắt giảm khí thải.'
              },
              {
                id: 39,
                order: 39,
                questionText: 'an effect known as ... would unleash rapid temperature increases',
                answer: 'termination shock',
                acceptableAnswers: ['termination shock'],
                evidenceParagraph: 'D',
                evidenceQuote: 'encapsulated in the twin concepts of “termination shock” and “moral hazard”. Were a nation... halt operations abruptly',
                explanation: 'Hiện tượng sốc kết thúc (termination shock) khi việc phun sol khí bị dừng đột ngột.'
              },
              {
                id: 40,
                order: 40,
                questionText: 'currently lacks any ... to govern its application',
                answer: 'binding international treaty',
                acceptableAnswers: ['international treaty', 'binding treaty', 'binding international treaty'],
                evidenceParagraph: 'E',
                evidenceQuote: 'No binding international treaty exists to govern planetary temperature manipulation.',
                explanation: 'Thiếu vắng một hiệp ước quốc tế có tính ràng buộc (binding international treaty) để quản lý.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const IELTS_READING_BAND_SCORE_TABLE = [
  { minCorrect: 39, maxCorrect: 40, band: 9.0 },
  { minCorrect: 37, maxCorrect: 38, band: 8.5 },
  { minCorrect: 35, maxCorrect: 36, band: 8.0 },
  { minCorrect: 33, maxCorrect: 34, band: 7.5 },
  { minCorrect: 30, maxCorrect: 32, band: 7.0 },
  { minCorrect: 27, maxCorrect: 29, band: 6.5 },
  { minCorrect: 23, maxCorrect: 26, band: 6.0 },
  { minCorrect: 19, maxCorrect: 22, band: 5.5 },
  { minCorrect: 15, maxCorrect: 18, band: 5.0 },
  { minCorrect: 13, maxCorrect: 14, band: 4.5 },
  { minCorrect: 10, maxCorrect: 12, band: 4.0 },
  { minCorrect: 8,  maxCorrect: 9,  band: 3.5 },
  { minCorrect: 6,  maxCorrect: 7,  band: 3.0 },
  { minCorrect: 4,  maxCorrect: 5,  band: 2.5 },
  { minCorrect: 0,  maxCorrect: 3,  band: 2.0 },
];

export function calculateReadingBandScore(correctCount) {
  const score = Math.max(0, Math.min(40, Number(correctCount) || 0));
  const matched = IELTS_READING_BAND_SCORE_TABLE.find(
    row => score >= row.minCorrect && score <= row.maxCorrect
  );
  return matched ? matched.band : 2.0;
}

