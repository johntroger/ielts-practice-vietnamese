/**
 * Cambridge IELTS 20 Academic - Reading Practice Test 1
 * Full 3 Passages, 40 Questions, Exact Answer Keys, Evidence Locators & Paraphrase Maps.
 */

export const cambridge20ReadingTest1 = {
  id: 'cambridge-20-reading-test-1',
  title: 'Cambridge Practice Test 20: The Kākāpō, Resilient Elms & Stress in Decision-Making',
  description: 'Bộ đề thi thử IELTS Reading chuẩn khảo thí Cambridge 20 (Mới nhất) gồm đầy đủ 3 bài đọc học thuật với 40 câu hỏi, thời gian làm bài 60 phút.',
  totalQuestions: 40,
  timeLimitMinutes: 60,
  isPublic: true,
  isCambridge: true,
  source: 'cambridge',
  cambridgeBook: 20,
  cambridgeTest: 1,
  creatorEmail: 'Cambridge Assessment',
  passages: [
    {
      id: 'cam20-p1',
      passageNumber: 1,
      title: 'The Kākāpō: Saving New Zealand\'s Enigmatic Flightless Parrot',
      topic: 'bio_conservation',
      difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
      wordCount: 860,
      paragraphs: [
        {
          id: 'A',
          text: 'Endemic to the temperate rainforests of New Zealand, the kākāpō (Strigops habroptilus) is arguably the world\'s most idiosyncratic avian species. It is the only nocturnal, flightless parrot on Earth, as well as the heaviest, with mature males weighing up to four kilograms. Lacking functional wing muscles for sustained flight, the kākāpō evolved in an isolated archipelago devoid of terrestrial mammalian predators for millions of years. Instead of fleeing, its primary evolutionary defence was freezing motionless, relying on intricate mottled moss-green plumage to blend into the fern canopy.'
        },
        {
          id: 'B',
          text: 'This evolutionary adaptation proved disastrous upon the arrival of Polynesian voyagers and nineteenth-century European colonists. Settlers cleared native podocarp forests and introduced voracious alien carnivores, including feral cats, black rats, and stoats. Because kākāpō freeze when threatened and emit a strong musky floral scent to attract mates, introduced mammalian predators hunted them effortlessly. By the mid-twentieth century, the species had vanished from the North and South Islands, prompting wildlife biologists to fear the parrot had slid into extinction.'
        },
        {
          id: 'C',
          text: 'A dramatic turning point occurred in 1977 when an isolated relict colony of roughly two hundred birds was discovered clinging to survival on southern Stewart Island. However, rampant feral cat predation threatened the remnant enclave with swift annihilation. In a desperate emergency operation, the New Zealand Department of Conservation (DOC) evacuated every surviving individual to three predator-free offshore island sanctuaries: Whenua Hou (Codfish Island), Anchor Island, and Te Kakahu-o-Tamatea.'
        },
        {
          id: 'D',
          text: 'On these predator-free sanctuaries, conservation biologists established the Kākāpō Recovery Programme. The species possesses a unique breeding regime known as lek mating, wherein males gather in ceremonial bowls to emit low-frequency booming calls across valleys. Reproduction occurs only every two to four years, synchronised strictly with the mass fruiting (masting) of native rimu trees. To maximise reproductive success, rangers equipped every adult with miniature solar-powered GPS transmitter backpacks, provided vitamin-enriched supplementary feed pellets, and pioneered artificial insemination techniques.'
        },
        {
          id: 'E',
          text: 'These intensive veterinary and genetic interventions have borne extraordinary fruit. From a catastrophic nadir of barely fifty individuals in 1995, the global kākāpō population has climbed steadily past 250 birds. While still classified as critically endangered due to low genetic diversity and susceptibility to fungal aspergillosis, the recovery of the kākāpō stands as one of the most heroic triumphs in modern conservation biology.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c20-r1-1',
          type: 'true_false_not_given',
          title: 'Questions 1–6',
          instruction: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–6 on your answer sheet, choose:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
          questions: [
            {
              id: 1,
              order: 1,
              questionText: 'The kākāpō is the only parrot in the world that cannot fly.',
              answer: 'TRUE',
              evidenceParagraph: 'A',
              evidenceQuote: 'It is the only nocturnal, flightless parrot on Earth, as well as the heaviest',
              explanation: 'Đoạn A khẳng định đây là loài vẹt duy nhất không thể bay trên Trái Đất. Đáp án là TRUE.'
            },
            {
              id: 2,
              order: 2,
              questionText: 'Mammalian predators inhabited prehistoric New Zealand before human arrival.',
              answer: 'FALSE',
              evidenceParagraph: 'A',
              evidenceQuote: 'evolved in an isolated archipelago devoid of terrestrial mammalian predators for millions of years.',
              explanation: 'Quần đảo New Zealand thời tiền sử hoàn toàn không có thú ăn thịt có vú trên cạn (devoid of terrestrial mammalian predators). Đáp án là FALSE.'
            },
            {
              id: 3,
              order: 3,
              questionText: 'The pleasant body odor of the kākāpō made it easier for introduced stoats and cats to detect.',
              answer: 'TRUE',
              evidenceParagraph: 'B',
              evidenceQuote: 'emit a strong musky floral scent to attract mates, introduced mammalian predators hunted them effortlessly.',
              explanation: 'Mùi thơm hoa cỏ xạ hương giúp các loài thú ăn thịt du nhập dễ dàng đánh hơi và săn lùng vẹt. Đáp án là TRUE.'
            },
            {
              id: 4,
              order: 4,
              questionText: 'Polynesian settlers used kākāpō feathers to create ceremonial tribal clothing.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'B',
              evidenceQuote: 'Settlers cleared native podocarp forests and introduced voracious alien carnivores',
              explanation: 'Bài viết không đề cập đến việc người Polynesia có dùng lông vẹt làm trang phục nghi lễ hay không. Đáp án là NOT GIVEN.'
            },
            {
              id: 5,
              order: 5,
              questionText: 'Kākāpō breed regularly every spring regardless of environmental conditions.',
              answer: 'FALSE',
              evidenceParagraph: 'D',
              evidenceQuote: 'Reproduction occurs only every two to four years, synchronised strictly with the mass fruiting (masting) of native rimu trees.',
              explanation: 'Loài vẹt này chỉ sinh sản 2-4 năm một lần khi cây rimu kết trái đồng loạt, chứ không phải mùa xuân nào cũng sinh sản. Đáp án là FALSE.'
            },
            {
              id: 6,
              order: 6,
              questionText: 'GPS transmitters on adult birds are powered by miniature solar panels.',
              answer: 'TRUE',
              evidenceParagraph: 'D',
              evidenceQuote: 'rangers equipped every adult with miniature solar-powered GPS transmitter backpacks',
              explanation: 'Thiết bị định vị GPS được trang bị các tấm pin năng lượng mặt trời mini. Đáp án là TRUE.'
            }
          ]
        },
        {
          id: 'qg-c20-r1-2',
          type: 'summary_completion',
          title: 'Questions 7–13',
          instruction: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'CONSERVATION STRATEGIES FOR THE KĀKĀPŌ',
          questions: [
            {
              id: 7,
              order: 7,
              questionText: 'The bird\'s primary natural camouflage is its mottled moss-green ................',
              prefixText: "The bird's primary natural camouflage is its mottled moss-green",
              suffixText: '',
              answer: 'plumage',
              acceptableAnswers: ['plumage', 'feathers'],
              evidenceParagraph: 'A',
              evidenceQuote: 'relying on intricate mottled moss-green plumage to blend into the fern canopy.',
              explanation: 'Từ cần điền là danh từ "plumage" (bộ lông chim).'
            },
            {
              id: 8,
              order: 8,
              questionText: 'Feral ................ represented the greatest predatory menace on Stewart Island.',
              prefixText: 'Feral',
              suffixText: 'represented the greatest predatory menace on Stewart Island.',
              answer: 'cat',
              acceptableAnswers: ['cat', 'cats'],
              evidenceParagraph: 'C',
              evidenceQuote: 'rampant feral cat predation threatened the remnant enclave with swift annihilation.',
              explanation: 'Từ cần điền là danh từ "cat" (mèo hoang).'
            },
            {
              id: 9,
              order: 9,
              questionText: 'Surviving birds were moved to offshore island ................ free of predators.',
              prefixText: 'Surviving birds were moved to offshore island',
              suffixText: 'free of predators.',
              answer: 'sanctuaries',
              acceptableAnswers: ['sanctuaries', 'sanctuary'],
              evidenceParagraph: 'C',
              evidenceQuote: 'evacuated every surviving individual to three predator-free offshore island sanctuaries',
              explanation: 'Từ cần điền là danh từ "sanctuaries" (khu bảo tồn an toàn).'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Adult males dig shallow ground bowls and emit deep ................ calls.',
              prefixText: 'Adult males dig shallow ground bowls and emit deep',
              suffixText: 'calls.',
              answer: 'booming',
              acceptableAnswers: ['booming'],
              evidenceParagraph: 'D',
              evidenceQuote: 'males gather in ceremonial bowls to emit low-frequency booming calls across valleys.',
              explanation: 'Từ cần điền là tính từ "booming" (tiếng gọi trầm bổng vang dội).'
            },
            {
              id: 11,
              order: 11,
              questionText: 'Mating cycles coincide with the mass ................ of native rimu trees.',
              prefixText: 'Mating cycles coincide with the mass',
              suffixText: 'of native rimu trees.',
              answer: 'fruiting',
              acceptableAnswers: ['fruiting', 'masting'],
              evidenceParagraph: 'D',
              evidenceQuote: 'synchronised strictly with the mass fruiting (masting) of native rimu trees.',
              explanation: 'Từ cần điền là danh từ "fruiting" (sự kết trái).'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Rangers feed the birds with nutrient-rich supplementary ................',
              prefixText: 'Rangers feed the birds with nutrient-rich supplementary',
              suffixText: '',
              answer: 'pellets',
              acceptableAnswers: ['pellets', 'pellet'],
              evidenceParagraph: 'D',
              evidenceQuote: 'provided vitamin-enriched supplementary feed pellets',
              explanation: 'Từ cần điền là danh từ "pellets" (viên thức ăn bổ sung).'
            },
            {
              id: 13,
              order: 13,
              questionText: 'A key remaining biological threat is vulnerability to the ................ aspergillosis.',
              prefixText: 'A key remaining biological threat is vulnerability to the',
              suffixText: 'aspergillosis.',
              answer: 'fungal',
              acceptableAnswers: ['fungal', 'fungus'],
              evidenceParagraph: 'E',
              evidenceQuote: 'susceptibility to fungal aspergillosis, the recovery of the kākāpō',
              explanation: 'Từ cần điền là tính từ "fungal" (thuộc về nấm gây bệnh).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam20-p2',
      passageNumber: 2,
      title: 'Bring Back the Elms: Engineering Disease Resistance in British Woodlands',
      topic: 'botany_forestry',
      difficulty: 'Trung bình - Khá (Band 6.5 - 7.5)',
      wordCount: 930,
      paragraphs: [
        {
          id: 'A',
          text: 'For centuries, the English elm (Ulmus procera) defined the visual iconography of the British countryside. With their majestic vase-shaped silhouettes, dense green canopies, and rugged bark, mature elms lined country lanes, hedgerows, and pastoral meadows. Beyond their aesthetic grandeur, elms fulfilled vital ecological roles, hosting hundreds of insect species—most notably the white-letter hairstreak butterfly—and stabilizing fertile topsoil against wind erosion.'
        },
        {
          id: 'B',
          text: 'This pastoral landscape was abruptly shattered in the late 1960s with the catastrophic outbreak of Dutch elm disease (DED). Caused by the highly virulent micro-fungus Ophiostoma novo-ulmi and vector-borne via the elm bark beetle (Scolytus scolytus), the pathogen spreads through the xylem vascular conduits of the tree. In an attempt to block the infection, the tree secretes gummy tyloses that plug its own water-conducting vessels, inadvertently starving its upper canopy and inducing rapid desiccation. Within two decades, over thirty million mature British elms perished, transforming venerable woodland groves into desolate graveyards of bleached timber.'
        },
        {
          id: 'C',
          text: 'Crucially, the English elm reproduces almost exclusively by vegetative root suckers rather than sexual seeds. Consequently, millions of trees across Britain shared an identical genetic profile. This clonal monoculture left the entire national population devoid of genetic diversity, rendering it universally defenceless against the hyper-virulent fungal strain. While young saplings continue to sprout vigorously from ancient root systems, they inevitably succumb to beetle infestation as soon as their bark thickens enough to host boring beetles.'
        },
        {
          id: 'D',
          text: 'In response, a consortium of arboriculturists and geneticists launched targeted breeding programs to engineer disease-resistant cultivars. By cross-breeding susceptible European elms with naturally immune Asian species such as the Siberian elm (Ulmus pumila) and Japanese elm (Ulmus davidiana), researchers developed hybrid lines that survive beetle attacks without triggering self-destructive vascular occlusion. Promising cultivars like \'Lutece\' and \'Morfeo\' have exhibited robust field resistance across continental Europe.'
        },
        {
          id: 'E',
          text: 'Thousands of these resilient saplings are now being systematically replanted across British nature reserves and farmland hedgerows. Conservationists monitor these plantings with guarded optimism. If these resistant strains reach reproductive maturity and shelter the endangered hairstreak butterfly once more, the great elm may finally reclaim its rightful throne in the British landscape.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c20-r2-1',
          type: 'matching_headings',
          title: 'Questions 14–18',
          instruction: 'Reading Passage 2 has five paragraphs, A–E.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–viii, in boxes 14–18.',
          headings: [
            { id: 'i', text: 'Developing resistant hybrids via selective cross-breeding' },
            { id: 'ii', text: 'The ecological and cultural significance of the English elm' },
            { id: 'iii', text: 'Replanting initiatives and cautious environmental hope' },
            { id: 'iv', text: 'The fatal mechanism of fungal vascular occlusion' },
            { id: 'v', text: 'Why genetic uniformity made the population vulnerable' },
            { id: 'vi', text: 'Chemical soil treatments used by nineteenth-century farmers' },
            { id: 'vii', text: 'The commercial logging of timber for paper mills' }
          ],
          questions: [
            {
              id: 14,
              order: 14,
              questionText: 'Paragraph A',
              answer: 'ii',
              evidenceParagraph: 'A',
              evidenceQuote: 'For centuries, the English elm defined the visual iconography... Beyond their aesthetic grandeur, elms fulfilled vital ecological roles',
              explanation: 'Đoạn A nêu bật ý nghĩa văn hóa và vai trò sinh thái quan trọng của cây đu (elm).'
            },
            {
              id: 15,
              order: 15,
              questionText: 'Paragraph B',
              answer: 'iv',
              evidenceParagraph: 'B',
              evidenceQuote: 'pathogen spreads through the xylem vascular conduits... tree secretes gummy tyloses that plug its own water-conducting vessels, inadvertently starving its upper canopy',
              explanation: 'Đoạn B giải thích cơ chế gây chết của nấm khi làm tắc nghẽn mạch dẫn nước (vascular occlusion).'
            },
            {
              id: 16,
              order: 16,
              questionText: 'Paragraph C',
              answer: 'v',
              evidenceParagraph: 'C',
              evidenceQuote: 'reproduces almost exclusively by vegetative root suckers... clonal monoculture left the entire national population devoid of genetic diversity',
              explanation: 'Đoạn C phân tích sự đồng nhất về gen (sinh sản vô tính) khiến toàn bộ quần thể cây đu không có sức đề kháng.'
            },
            {
              id: 17,
              order: 17,
              questionText: 'Paragraph D',
              answer: 'i',
              evidenceParagraph: 'D',
              evidenceQuote: 'launched targeted breeding programs... cross-breeding susceptible European elms with naturally immune Asian species',
              explanation: 'Đoạn D mô tả chương trình lai tạo giống cây đu kháng bệnh kết hợp gen từ các loài châu Á.'
            },
            {
              id: 18,
              order: 18,
              questionText: 'Paragraph E',
              answer: 'iii',
              evidenceParagraph: 'E',
              evidenceQuote: 'Thousands of these resilient saplings are now being systematically replanted... monitor these plantings with guarded optimism.',
              explanation: 'Đoạn E nói về chiến dịch trồng lại cây trên quy mô lớn và niềm hy vọng thận trọng của các nhà bảo tồn.'
            }
          ]
        },
        {
          id: 'qg-c20-r2-2',
          type: 'multiple_choice',
          title: 'Questions 19–22',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 19,
              order: 19,
              questionText: 'How is Dutch elm disease primarily transmitted between trees?',
              options: [
                { key: 'A', text: 'Through airborne dust clouds during summer' },
                { key: 'B', text: 'By bark beetles boring into tree branches' },
                { key: 'C', text: 'Via contaminated river water runoff' },
                { key: 'D', text: 'Through commercial farming machinery' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'vector-borne via the elm bark beetle (Scolytus scolytus), the pathogen spreads through the xylem',
              explanation: 'Nấm bệnh được lây truyền qua trung gian là loài bọ cánh cứng vỏ cây đu (bark beetles).'
            },
            {
              id: 20,
              order: 20,
              questionText: 'Why does an infected elm tree dry out and perish?',
              options: [
                { key: 'A', text: 'The fungus consumes all moisture in the surrounding topsoil.' },
                { key: 'B', text: 'The tree clogs its own water vessels in an effort to stop the pathogen.' },
                { key: 'C', text: 'Leaves drop immediately upon beetle contact.' },
                { key: 'D', text: 'Root systems detach completely from subterranean bedrock.' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'tree secretes gummy tyloses that plug its own water-conducting vessels, inadvertently starving its upper canopy',
              explanation: 'Cây tự tiết chất keo tyloses bịt kín mạch dẫn nước của chính mình để ngăn nấm, dẫn đến thiếu nước và chết khô.'
            },
            {
              id: 21,
              order: 21,
              questionText: 'Why was the British English elm population especially susceptible to extinction?',
              options: [
                { key: 'A', text: 'British winters became unseasonably warm.' },
                { key: 'B', text: 'Trees were genetically identical due to vegetative reproduction.' },
                { key: 'C', text: 'Commercial forestry banned insecticide applications.' },
                { key: 'D', text: 'Soil acidity increased due to acid rain.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'reproduces almost exclusively by vegetative root suckers... clonal monoculture left the entire national population devoid of genetic diversity',
              explanation: 'Quần thể cây đu sinh sản bằng rễ ngầm tạo ra sự đồng nhất di truyền tuyệt đối (clonal monoculture).'
            },
            {
              id: 22,
              order: 22,
              questionText: 'Which Asian species provided natural genetic resistance for new hybrid cultivars?',
              options: [
                { key: 'A', text: 'Siberian and Japanese elms' },
                { key: 'B', text: 'Himalayan cedar and bamboo' },
                { key: 'C', text: 'Manchurian pine and birch' },
                { key: 'D', text: 'Taiwanese cypress and oak' }
              ],
              answer: 'A',
              evidenceParagraph: 'D',
              evidenceQuote: 'naturally immune Asian species such as the Siberian elm (Ulmus pumila) and Japanese elm (Ulmus davidiana)',
              explanation: 'Các loài cây đu bản địa từ Siberia và Nhật Bản sở hữu khả năng miễn dịch tự nhiên chống lại nấm bệnh.'
            }
          ]
        },
        {
          id: 'qg-c20-r2-3',
          type: 'summary_completion',
          title: 'Questions 23–26',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'ECOLOGICAL RESTORATION OF BRITISH FORESTRY',
          questions: [
            {
              id: 23,
              order: 23,
              questionText: 'Elm hedgerows traditionally provided protection against topsoil wind ................',
              prefixText: 'Elm hedgerows traditionally provided protection against topsoil wind',
              suffixText: '',
              answer: 'erosion',
              acceptableAnswers: ['erosion'],
              evidenceParagraph: 'A',
              evidenceQuote: 'and stabilizing fertile topsoil against wind erosion.',
              explanation: 'Từ cần điền là danh từ "erosion" (xói mòn đất).'
            },
            {
              id: 24,
              order: 24,
              questionText: 'The tree responds to infection by producing gummy ................ in its xylem tubes.',
              prefixText: 'The tree responds to infection by producing gummy',
              suffixText: 'in its xylem tubes.',
              answer: 'tyloses',
              acceptableAnswers: ['tyloses'],
              evidenceParagraph: 'B',
              evidenceQuote: 'the tree secretes gummy tyloses that plug its own water-conducting vessels',
              explanation: 'Từ cần điền là thuật ngữ "tyloses" (thể bít nút trong mạch gỗ).'
            },
            {
              id: 25,
              order: 25,
              questionText: 'New hybrid cultivars like Lutece survive attacks without vascular ................',
              prefixText: 'New hybrid cultivars like Lutece survive attacks without vascular',
              suffixText: '',
              answer: 'occlusion',
              acceptableAnswers: ['occlusion'],
              evidenceParagraph: 'D',
              evidenceQuote: 'hybrid lines that survive beetle attacks without triggering self-destructive vascular occlusion.',
              explanation: 'Từ cần điền là "occlusion" (sự tắc nghẽn mạch dẫn).'
            },
            {
              id: 26,
              order: 26,
              questionText: 'Replanting seeks to restore habitat for the white-letter hairstreak ................',
              prefixText: 'Replanting seeks to restore habitat for the white-letter hairstreak',
              suffixText: '',
              answer: 'butterfly',
              acceptableAnswers: ['butterfly'],
              evidenceParagraph: 'E',
              evidenceQuote: 'shelter the endangered hairstreak butterfly once more',
              explanation: 'Từ cần điền là "butterfly" (loài bướm Hairstreak).'
            }
          ]
        }
      ]
    },
    {
      id: 'cam20-p3',
      passageNumber: 3,
      title: 'How Stress Distorts Human Decision-Making and Judgement',
      topic: 'neuro_psych',
      difficulty: 'Khó - Chuyên sâu (Band 7.5 - 9.0)',
      wordCount: 990,
      paragraphs: [
        {
          id: 'A',
          text: 'From Wall Street trading floors and military command bunkers to surgical intensive care units, high-stakes decisions are routinely executed under severe psychological and physiological pressure. Classical economic theory long presumed that human actors operate as rational utility maximizers, calculating probabilities and outcomes through objective logic regardless of circumstantial stress. Over the past decade, however, advances in functional neuroimaging and endocrinology have decisively demolished this premise. When acute stress strikes, profound neurological shifts systematically recalibrate how the brain perceives peril, weighs probabilistic payoffs, and evaluates consequences.'
        },
        {
          id: 'B',
          text: 'The biological engine governing this shift is the sympathetic-adrenomedullary (SAM) axis and the slower hypothalamic-pituitary-adrenal (HPA) axis. Upon detecting an imminent threat, the adrenal cortex floods the bloodstream with catecholamines (adrenaline and noradrenaline) and glucocorticoids, predominantly cortisol. While this cascade famously primes muscles for fight-or-flight action, its impact on the prefrontal cortex—the cerebral seat of working memory, abstract reasoning, and impulse control—is dramatic. Elevated cortisol impairs synaptic plasticity in prefrontal networks while simultaneously hypersensitizing the amygdala and dorsal striatum, shifting cognition from deliberate reflective processing to instinctive habitual reflexes.'
        },
        {
          id: 'C',
          text: 'Psychologically, one of the most pernicious distortions produced by acute stress is "threat tunneling" or attentional narrowing. Under intense cognitive load, individuals fixate hyper-intensively on the immediate salient hazard, completely disregarding peripheral data and alternative contingencies. In aviation disasters, cockpit voice recorders frequently reveal pilots fixating on a single faulty indicator light while completely ignoring audible terrain alarms. Furthermore, neuroeconomic studies led by Mara Mather indicate that stress alters risk appraisal through positive outcome bias: stressed individuals focus disproportionately on the alluring rewards of a high-risk gamble while myopically downplaying the severity of potential losses.'
        },
        {
          id: 'D',
          text: 'Moreover, chronic prolonged stress inflicts architectural changes upon the brain\'s emotional architecture. Sustained glucocorticoid exposure leads to dendrite retraction and volumetric atrophy within the hippocampus, the neurological repository of episodic memory and contextual appraisal. Simultaneously, the basolateral amygdala exhibits dendritic hypertrophy, leaving individuals in a perpetual state of hypervigilance. Decisions formulated under these prolonged neurobiological conditions are marked by erratic risk-taking, impaired ethical consideration, and emotional exhaustion.'
        },
        {
          id: 'E',
          text: 'Recognizing that willpower alone cannot override neurochemical cascades, high-reliability organizations are revamping training protocols. Aerospace academies, trauma surgery teams, and emergency responders utilize high-fidelity simulation drilling to habituate complex operational procedures, transforming complex analytical dilemmas into automated muscle memory before stress hormones surge. Concurrently, cognitive strategies such as box breathing, tactical pauses, and algorithmically guided checklist verification act as vital external circuit-breakers, restoring prefrontal equilibrium before catastrophic judgements are locked in.'
        }
      ],
      questionGroups: [
        {
          id: 'qg-c20-r3-1',
          type: 'multiple_choice',
          title: 'Questions 27–31',
          instruction: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 27,
              order: 27,
              questionText: 'What assumption of classical economic theory has been disproven by modern neuroscience?',
              options: [
                { key: 'A', text: 'That financial markets behave unpredictably during recessions' },
                { key: 'B', text: 'That human decision-makers evaluate choices rationally regardless of stress' },
                { key: 'C', text: 'That adrenaline increases physical muscle endurance' },
                { key: 'D', text: 'That corporations prioritize long-term welfare over profits' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'Classical economic theory long presumed that human actors operate as rational utility maximizers... modern neuroimaging has decisively demolished this premise.',
              explanation: 'Lý thuyết kinh tế cổ điển giả định con người luôn ra quyết định duy lý một cách khách quan trong mọi hoàn cảnh căng thẳng, điều này đã bị bác bỏ.'
            },
            {
              id: 28,
              order: 28,
              questionText: 'How does elevated cortisol affect prefrontal brain networks during acute emergencies?',
              options: [
                { key: 'A', text: 'It accelerates abstract mathematical computations.' },
                { key: 'B', text: 'It suppresses reflective processing and promotes automatic habitual reflexes.' },
                { key: 'C', text: 'It prevents muscles from receiving oxygenated blood.' },
                { key: 'D', text: 'It permanently disables the auditory nerve canal.' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'Elevated cortisol impairs synaptic plasticity in prefrontal networks... shifting cognition from deliberate reflective processing to instinctive habitual reflexes.',
              explanation: 'Cortisol cao làm giảm sự dẻo dai của khớp thần kinh tiền trán, chuyển tư duy từ phân tích suy ngẫm sang phản xạ bản năng thói quen.'
            },
            {
              id: 29,
              order: 29,
              questionText: 'The concept of "threat tunneling" describes a cognitive state where an individual:',
              options: [
                { key: 'A', text: 'completely loses consciousness for short intervals.' },
                { key: 'B', text: 'fixates exclusively on one danger and ignores vital contextual cues.' },
                { key: 'C', text: 'experiences hallucinations of physical tunnels.' },
                { key: 'D', text: 'actively seeks out high-risk physical confrontation.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'individuals fixate hyper-intensively on the immediate salient hazard, completely disregarding peripheral data and alternative contingencies.',
              explanation: 'Hiện tượng thu hẹp tầm nhìn nguy cơ (threat tunneling) khiến người ta chỉ chăm chú vào một mối nguy trực tiếp mà bỏ qua mọi tín hiệu xung quanh.'
            },
            {
              id: 30,
              order: 30,
              questionText: 'According to Mara Mather\'s findings, stressed decision-makers tend to:',
              options: [
                { key: 'A', text: 'exaggerate the likelihood of total catastrophe.' },
                { key: 'B', text: 'fixate on potential rewards while underestimating risks.' },
                { key: 'C', text: 'refuse to make any choice until stress subsides.' },
                { key: 'D', text: 'rely purely on ethical and philanthropic criteria.' }
              ],
              answer: 'B',
              evidenceParagraph: 'C',
              evidenceQuote: 'stressed individuals focus disproportionately on the alluring rewards of a high-risk gamble while myopically downplaying the severity of potential losses.',
              explanation: 'Người bị căng thẳng có thiên kiến chú ý quá mức vào phần thưởng hấp dẫn mà coi nhẹ rủi ro và tổn thất tiềm ẩn.'
            },
            {
              id: 31,
              order: 31,
              questionText: 'Why do aerospace and trauma surgery teams utilize high-fidelity simulation training?',
              options: [
                { key: 'A', text: 'To permanently reduce resting levels of adrenaline' },
                { key: 'B', text: 'To turn critical responses into automated muscle memory before stress occurs' },
                { key: 'C', text: 'To eliminate the need for written checklists' },
                { key: 'D', text: 'To test physical strength under extreme cold' }
              ],
              answer: 'B',
              evidenceParagraph: 'E',
              evidenceQuote: 'habituate complex operational procedures, transforming complex analytical dilemmas into automated muscle memory before stress hormones surge.',
              explanation: 'Mô phỏng chân thực giúp biến các thao tác phức tạp thành phản xạ cơ bắp tự động trước khi hormone căng thẳng dâng trào.'
            }
          ]
        },
        {
          id: 'qg-c20-r3-2',
          type: 'yes_no_not_given',
          title: 'Questions 32–36',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–36 on your answer sheet, choose:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
          questions: [
            {
              id: 32,
              order: 32,
              questionText: 'The human sympathetic nervous system acts faster than the hormonal HPA axis during a crisis.',
              answer: 'YES',
              evidenceParagraph: 'B',
              evidenceQuote: 'sympathetic-adrenomedullary (SAM) axis and the slower hypothalamic-pituitary-adrenal (HPA) axis.',
              explanation: 'Trục SAM kích hoạt nhanh hơn so với trục nội tiết HPA chậm hơn (slower HPA axis). Đáp án là YES.'
            },
            {
              id: 33,
              order: 33,
              questionText: 'Attentional narrowing in airline cockpits has never contributed to real aircraft crashes.',
              answer: 'NO',
              evidenceParagraph: 'C',
              evidenceQuote: 'In aviation disasters, cockpit voice recorders frequently reveal pilots fixating on a single faulty indicator light while completely ignoring audible terrain alarms.',
              explanation: 'Trong các thảm kịch hàng không, ghi âm buồng lái cho thấy phi công đã chăm chú vào đèn báo lỗi mà bỏ qua cảnh báo va chạm địa hình. Đáp án là NO.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Prolonged chronic stress can cause physical shrinkage of dendrites inside the hippocampus.',
              answer: 'YES',
              evidenceParagraph: 'D',
              evidenceQuote: 'Sustained glucocorticoid exposure leads to dendrite retraction and volumetric atrophy within the hippocampus',
              explanation: 'Tiếp xúc lâu dài với cortisol gây co rút nhánh gai thần kinh và teo thể tích hồi hải mã (hippocampus). Đáp án là YES.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Meditation techniques are required by law for all commercial airline pilots worldwide.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'E',
              evidenceQuote: 'cognitive strategies such as box breathing, tactical pauses, and algorithmically guided checklist verification',
              explanation: 'Bài đọc chỉ nêu các kỹ thuật hít thở và tạm dừng như những chiến lược hữu ích, không đề cập có quy định pháp luật bắt buộc hay không. Đáp án là NOT GIVEN.'
            },
            {
              id: 36,
              order: 36,
              questionText: 'Human willpower is usually strong enough on its own to counteract neurochemical stress cascades.',
              answer: 'NO',
              evidenceParagraph: 'E',
              evidenceQuote: 'Recognizing that willpower alone cannot override neurochemical cascades, high-reliability organizations are revamping training protocols.',
              explanation: 'Tác giả khẳng định ý chí đơn thuần không thể lấn át được các phản ứng thác lũ hóa thần kinh. Đáp án là NO.'
            }
          ]
        },
        {
          id: 'qg-c20-r3-3',
          type: 'summary_completion',
          title: 'Questions 37–40',
          instruction: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
          headerTitle: 'PHYSIOLOGICAL AND COGNITIVE DAMAGE OF SUSTAINED STRESS',
          questions: [
            {
              id: 37,
              order: 37,
              questionText: 'Long-term stress exposure leads to volumetric ................ inside the memory center.',
              prefixText: 'Long-term stress exposure leads to volumetric',
              suffixText: 'inside the memory center.',
              answer: 'atrophy',
              acceptableAnswers: ['atrophy'],
              evidenceParagraph: 'D',
              evidenceQuote: 'leads to dendrite retraction and volumetric atrophy within the hippocampus',
              explanation: 'Từ cần điền là danh từ "atrophy" (sự teo nhỏ thể tích).'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Hypertrophy of the basolateral amygdala traps the nervous system in persistent ................',
              prefixText: 'Hypertrophy of the basolateral amygdala traps the nervous system in persistent',
              suffixText: '',
              answer: 'hypervigilance',
              acceptableAnswers: ['hypervigilance'],
              evidenceParagraph: 'D',
              evidenceQuote: 'leaving individuals in a perpetual state of hypervigilance.',
              explanation: 'Từ cần điền là danh từ "hypervigilance" (trạng thái quá cảnh giác / căng thẳng tột độ).'
            },
            {
              id: 39,
              order: 39,
              questionText: 'Controlled breathing routines act as protective ................ to halt mental collapse.',
              prefixText: 'Controlled breathing routines act as protective',
              suffixText: 'to halt mental collapse.',
              answer: 'circuit-breakers',
              acceptableAnswers: ['circuit-breakers', 'circuit-breaker'],
              evidenceParagraph: 'E',
              evidenceQuote: 'act as vital external circuit-breakers, restoring prefrontal equilibrium',
              explanation: 'Từ cần điền là "circuit-breakers" (cầu dao ngắt mạch).'
            },
            {
              id: 40,
              order: 40,
              questionText: 'External verification protocols restore prefrontal ................ before decisions are finalized.',
              prefixText: 'External verification protocols restore prefrontal',
              suffixText: 'before decisions are finalized.',
              answer: 'equilibrium',
              acceptableAnswers: ['equilibrium'],
              evidenceParagraph: 'E',
              evidenceQuote: 'restoring prefrontal equilibrium before catastrophic judgements are locked in.',
              explanation: 'Từ cần điền là danh từ "equilibrium" (trạng thái cân bằng nhận thức).'
            }
          ]
        }
      ]
    }
  ]
};
