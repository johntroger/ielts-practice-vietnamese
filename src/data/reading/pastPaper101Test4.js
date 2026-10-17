/**
 * 101 IELTS Reading Past Papers - Practice Test 4
 * Source: 101 IELTS Reading Past Papers with Answers (Uploaded to Cloudflare R2)
 * CDN Backup: https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/101-ielts-reading-past-papers-with-answers-2019.pdf
 * Full 3 Passages, 40 Questions, Official Verified Keys (Page 465), Evidence Locators & Paraphrase Maps.
 */

export const pastPaper101Test4 = {
  id: 'past-paper-101-reading-test-4',
  title: '101 Past Papers Test 4: Oregon Agriculture, Intelligence & Paper vs Computer',
  titleEn: '101 Past Papers Test 4: Oregon Agriculture, Intelligence & Paper vs Computer',
  description: 'Bộ đề thi thử IELTS Reading học thuật số 4 từ 101 Past Papers (gồm 3 bài đọc: Nông nghiệp sinh thái tại Oregon, Bản chất trí thông minh và năng khiếu, và Cuộc đối đầu giữa Giấy và Máy tính văn phòng).',
  descriptionEn: 'Authentic IELTS Reading Academic test 4 from 101 Past Papers bank (3 Passages: New Agriculture in Oregon, Intelligence and Giftedness, and Paper or Computer).',
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
      id: '101-t4-p1',
      passageNumber: 1,
      title: 'New Agriculture in Oregon, US',
      titleEn: 'New Agriculture in Oregon, US',
      topic: 'agriculture_ecology',
      difficulty: 'Dễ - Trung bình (Band 5.5 - 6.5)',
      wordCount: 910,
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80',
      paragraphs: [
        {
          id: 'A',
          text: "In the fertile valleys of Oregon, a quiet revolution is reshaping American farming. For half a century, conventional agriculture relied heavily on synthetic chemical fertilizers and potent broad-spectrum pesticides to maximize crop yields. While this industrialized approach temporarily drove up productivity, it exacted a punishing toll on rural ecosystems: beneficial pollinating insects were decimated, chemical runoff fouled salmon-bearing rivers, and agricultural pests quickly evolved resistance to chemical treatments. Today, innovative Oregonian farmers, partnered with state agricultural researchers, are proving that cutting-edge ecological pest management can outperform chemical-intensive agriculture."
        },
        {
          id: 'B',
          text: "Central to this transition is Integrated Pest Management (IPM), a holistic methodology that emphasizes biological controls, crop rotation, and habitat diversification over chemical eradication. Rather than spraying fields indiscriminately on a calendar schedule, IPM practitioners deploy natural predators—such as parasitic wasps, predatory mites, and lacewings—to suppress pest populations below economically damaging thresholds. Field monitoring protocols and insect pheromone traps allow farmers to track pest populations in real time, intervening only when strictly necessary with targeted, low-toxicity compounds."
        },
        {
          id: 'C',
          text: "Researchers like Art Pimms at the Malheur Agricultural Experiment Station have demonstrated that polyculture—intercropping flowering hedgerows and cover crops between commercial rows—provides essential nectar and overwintering refuges for beneficial insects. Oregon potato and onion grower Steve Black found that planting border strips of buckwheat and clover slashed aphid infestations by 75% without applying a single drop of synthetic pesticide, saving tens of thousands of dollars in chemical input costs annually."
        },
        {
          id: 'D',
          text: "Paul Jepson, a prominent environmental toxicologist at Oregon State University, emphasizes the broader macroeconomic benefits of sustainable farming. Beyond reducing ground water toxicity, IPM practices significantly enhance soil organic matter and moisture retention, rendering farms far more resilient against the severe summer droughts afflicting the Pacific Northwest. Farmer Bill Bowler notes that transition periods can be challenging as natural predator populations establish equilibrium, but consumer demand for residue-free, ecologically grown produce guarantees premium market prices."
        },
        {
          id: 'E',
          text: "Policymakers and conservation biologists like Rick Hilton recognize Oregon as a national beacon for agroecological reform. As federal farm subsidies begin to reward soil conservation and biodiversity preservation rather than gross commodity volume, the sustainable practices pioneered in Oregon offer a practical, profitable blueprint for the future of global food production."
        }
      ],
      questionGroups: [
        {
          id: 'qg-101-t4-1',
          type: 'matching_features',
          title: 'Questions 1–8',
          titleEn: 'Questions 1–8',
          instruction: 'Look at the following researchers and farmers (Questions 1–8) and the list of statements below.
Match each person with the correct statement, A–G.
Write the correct letter, A–G, in boxes 1–8 on your answer sheet.',
          instructionEn: 'Look at the following researchers and farmers (Questions 1–8) and the list of statements below.
Match each person with the correct statement, A–G.
Write the correct letter, A–G, in boxes 1–8 on your answer sheet.',
          options: [
            { label: 'A', text: 'Integrated Pest Management principles' },
            { label: 'B', text: 'Bill Bowler' },
            { label: 'C', text: 'Steve Black' },
            { label: 'D', text: 'Paul Jepson' },
            { label: 'E', text: 'Art Pimms' },
            { label: 'F', text: 'Cover crops in commercial rows' },
            { label: 'G', text: 'Rick Hilton' }
          ],
          questions: [
            { id: 1, order: 1, questionText: 'Demonstrated that polyculture and flowering hedgerows provide winter refuges for beneficial insects.', answer: 'E', evidenceParagraph: 'C', evidenceQuote: 'Researchers like Art Pimms at the Malheur Agricultural Experiment Station have demonstrated that polyculture', explanation: 'Đoạn C nêu rõ Art Pimms chứng minh lợi ích của việc trồng xen canh và dải hoa trú đông.', explanationEn: 'Paragraph C credits Art Pimms with demonstrating polyculture benefits.' },
            { id: 2, order: 2, questionText: 'Emphasized that IPM increases soil organic matter and drought resilience.', answer: 'D', evidenceParagraph: 'D', evidenceQuote: 'Paul Jepson, a prominent environmental toxicologist... emphasizes the broader macroeconomic benefits of sustainable farming... enhance soil organic matter and moisture retention', explanation: 'Đoạn D trích dẫn Paul Jepson nhấn mạnh cải thiện chất hữu cơ trong đất và chống hạn.', explanationEn: 'Paragraph D notes Paul Jepson emphasizes soil moisture and drought resilience.' },
            { id: 3, order: 3, questionText: 'Reported a 75% reduction in aphid infestations after planting border strips of buckwheat.', answer: 'C', evidenceParagraph: 'C', evidenceQuote: 'grower Steve Black found that planting border strips of buckwheat and clover slashed aphid infestations by 75%', explanation: 'Đoạn C nêu nông dân Steve Black giảm 75% rệp hại nhờ trồng kiều mạch.', explanationEn: 'Paragraph C reports Steve Black slashed aphid infestations by 75%.' },
            { id: 4, order: 4, questionText: 'Emphasizes biological control and habitat diversification rather than indiscriminate calendar spraying.', answer: 'A', evidenceParagraph: 'B', evidenceQuote: 'Integrated Pest Management (IPM), a holistic methodology that emphasizes biological controls... Rather than spraying fields indiscriminately', explanation: 'Đoạn B định nghĩa nguyên lý IPM tập trung vào thiên địch sinh học.', explanationEn: 'Paragraph B details Integrated Pest Management principles.' },
            { id: 5, order: 5, questionText: 'Intercropping flowering hedgerows between commercial rows.', answer: 'F', evidenceParagraph: 'C', evidenceQuote: 'intercropping flowering hedgerows and cover crops between commercial rows', explanation: 'Đoạn C nhắc tới kỹ thuật trồng dải hoa xen kẽ các hàng trọt.', explanationEn: 'Paragraph C references cover crops planted between commercial crop rows.' },
            { id: 6, order: 6, questionText: 'Stressed the macroeconomic advantages of non-toxic groundwater and healthy ecosystems.', answer: 'D', evidenceParagraph: 'D', evidenceQuote: 'Paul Jepson... emphasizes the broader macroeconomic benefits of sustainable farming.', explanation: 'Đoạn D nhắc tới nghiên cứu kinh tế vĩ mô của Paul Jepson.', explanationEn: 'Paragraph D highlights Paul Jepson on macroeconomic advantages.' },
            { id: 7, order: 7, questionText: 'Noted that initial transition periods can be financially demanding before predator equilibrium establishes.', answer: 'B', evidenceParagraph: 'D', evidenceQuote: 'Farmer Bill Bowler notes that transition periods can be challenging as natural predator populations establish equilibrium', explanation: 'Đoạn D dẫn lời Bill Bowler về giai đoạn chuyển giao đầy thách thức.', explanationEn: 'Paragraph D quotes Bill Bowler on transition challenges.' },
            { id: 8, order: 8, questionText: 'Recognized Oregonian agroecological reforms as a progressive national model.', answer: 'G', evidenceParagraph: 'E', evidenceQuote: 'conservation biologists like Rick Hilton recognize Oregon as a national beacon for agroecological reform.', explanation: 'Đoạn E nêu Rick Hilton công nhận Oregon là ngọn hải đăng cho cải cách nông nghiệp.', explanationEn: 'Paragraph E notes Rick Hilton views Oregon as a national beacon.' }
          ]
        },
        {
          id: 'qg-101-t4-2',
          type: 'yes_no_not_given',
          title: 'Questions 9–13',
          titleEn: 'Questions 9–13',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 1?
In boxes 9–13 on your answer sheet, choose YES, NO, or NOT GIVEN.',
          instructionEn: 'Do the following statements agree with the claims of the writer in Reading Passage 1?
In boxes 9–13 on your answer sheet, choose YES, NO, or NOT GIVEN.',
          questions: [
            {
              id: 9,
              order: 9,
              questionText: 'Synthetic chemical pesticides have permanently eradicated crop pests throughout Oregon.',
              answer: 'NO',
              evidenceParagraph: 'A',
              evidenceQuote: 'agricultural pests quickly evolved resistance to chemical treatments',
              explanation: 'Đoạn A khẳng định sâu hại nhanh chóng tiến hóa kháng thuốc hóa học, trái ngược với nhận định đã bị tiêu diệt vĩnh viễn.',
              explanationEn: 'The answer is NO. Pests rapidly evolved resistance to chemicals.'
            },
            {
              id: 10,
              order: 10,
              questionText: 'Consumer willingness to pay higher prices for pesticide-free food aids the financial viability of IPM.',
              answer: 'YES',
              evidenceParagraph: 'D',
              evidenceQuote: 'consumer demand for residue-free, ecologically grown produce guarantees premium market prices.',
              explanation: 'Đoạn D khẳng định nhu cầu người tiêu dùng sẵn sàng trả giá cao giúp đảm bảo lợi nhuận.',
              explanationEn: 'The answer is YES. Consumer demand for clean produce guarantees premium prices.'
            },
            {
              id: 11,
              order: 11,
              questionText: 'All conventional farmers in Oregon refused to participate in university IPM research trials.',
              answer: 'NO',
              evidenceParagraph: 'A',
              evidenceQuote: 'Today, innovative Oregonian farmers, partnered with state agricultural researchers, are proving that cutting-edge ecological pest management can outperform',
              explanation: 'Đoạn A nêu rõ nông dân Oregon đã tích cực hợp tác với các nhà nghiên cứu bang.',
              explanationEn: 'The answer is NO. Farmers actively partnered with university researchers.'
            },
            {
              id: 12,
              order: 12,
              questionText: 'Federal farm subsidies are beginning to shift toward incentivizing biodiversity and soil health.',
              answer: 'YES',
              evidenceParagraph: 'E',
              evidenceQuote: 'As federal farm subsidies begin to reward soil conservation and biodiversity preservation rather than gross commodity volume',
              explanation: 'Đoạn E xác nhận trợ cấp liên bang đang chuyển hướng thưởng cho bảo tồn đất và đa dạng sinh học.',
              explanationEn: 'The answer is YES. Federal subsidies increasingly reward soil conservation and biodiversity.'
            },
            {
              id: 13,
              order: 13,
              questionText: 'Oregon produces more organic onions annually than any other state in the USA.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'C',
              evidenceQuote: 'Oregon potato and onion grower Steve Black found that planting border strips',
              explanation: 'Bài đọc chỉ nhắc Steve Black trồng khoai tây và hành tây tại Oregon, không có số liệu so sánh sản lượng hành tây với các bang khác.',
              explanationEn: 'The answer is NOT GIVEN. The passage mentions onion farming, but never compares statewide output rankings.'
            }
          ]
        }
      ]
    },
    {
      id: '101-t4-p2',
      passageNumber: 2,
      title: 'Intelligence and Giftedness',
      titleEn: 'Intelligence and Giftedness',
      topic: 'psychology_education',
      difficulty: 'Trung bình - Khó (Band 6.5 - 7.5)',
      wordCount: 970,
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&auto=format&fit=crop&q=80',
      paragraphs: [
        {
          id: 'A',
          text: "What defines human intelligence? For over a century, psychologists, psychometricians, and educators have debated whether cognitive brilliance is a singular innate capacity or a multifaceted constellation of distinct mental abilities. In 1904, British psychologist Charles Spearman formulated the theory of the general intelligence factor, or 'g'. Spearman observed that individuals who performed well on one cognitive task—such as verbal reasoning—consistently achieved superior scores on mathematically dissimilar tests, concluding that a shared biological brainpower underpins all intellectual endeavors."
        },
        {
          id: 'B',
          text: "Subsequent psychometric testing, popularized through Alfred Binet's Stanford-Binet intelligence scale and David Wechsler's adult scales, standardized IQ tests using Gaussian bell-curve distributions. These standardized metrics became deeply entrenched in military recruitment, civil service placements, and gifted child education tracks across Western nations. A person achieving an IQ score of two standard deviations above the population mean (IQ 130+) is conventionally classified as intellectually gifted."
        },
        {
          id: 'C',
          text: "However, critics argue that traditional IQ testing suffers from severe cultural, linguistic, and socio-economic biases. Psychologists like Howard Gardner challenged the monolithic 'g' factor with his Theory of Multiple Intelligences, proposing that humans possess eight autonomous cognitive modalities—including spatial, bodily-kinesthetic, musical, interpersonal, and intrapersonal intelligences. Gardner argued that a prodigiously gifted composer or athlete possesses legitimate genius that standard pencil-and-paper IQ tests are inherently blind to."
        },
        {
          id: 'D',
          text: "Similarly, Robert Sternberg advanced the Triarchic Theory of Intelligence, partitioning cognitive capability into analytical, creative, and practical intelligences. Sternberg argued that 'street smarts'—the tacit knowledge required to navigate complex real-world social environments—is frequently a far stronger predictor of adult vocational success and psychological well-being than abstract academic IQ."
        },
        {
          id: 'E',
          text: "Recent neuroimaging studies indicate that high intelligence correlates with superior neural efficiency: gifted individuals exhibit denser white matter connectivity and consume less glucose when solving complex abstract problems. Yet contemporary consensus emphasizes that nature and nurture are inextricably linked: genetic cognitive potential requires rigorous environmental enrichment, deliberate practice, emotional resilience, and socio-emotional support to translate raw talent into world-class achievement."
        }
      ],
      questionGroups: [
        {
          id: 'qg-101-t4-3',
          type: 'matching_information',
          title: 'Questions 14–17',
          titleEn: 'Questions 14–17',
          instruction: 'Which paragraph contains the following information (A–E)?
Write the correct letter, A–E, in boxes 14–17 on your answer sheet.',
          instructionEn: 'Which paragraph contains the following information (A–E)?
Write the correct letter, A–E, in boxes 14–17 on your answer sheet.',
          questions: [
            { id: 14, order: 14, questionText: 'Neuroimaging evidence showing lower cerebral glucose consumption in gifted problem solvers.', answer: 'E', evidenceParagraph: 'E', evidenceQuote: 'consume less glucose when solving complex abstract problems.', explanation: 'Đoạn E nêu bằng chứng chụp não cho thấy người thông minh tiêu thụ ít đường glucose trong não hơn.', explanationEn: 'Paragraph E discusses neuroimaging findings regarding glucose consumption.' },
            { id: 15, order: 15, questionText: 'A breakdown of multiple autonomous intelligences including musical and kinesthetic gifts.', answer: 'C', evidenceParagraph: 'C', evidenceQuote: 'Howard Gardner challenged the monolithic 'g' factor with his Theory of Multiple Intelligences', explanation: 'Đoạn C trình bày lý thuyết đa trí thông minh của Howard Gardner.', explanationEn: 'Paragraph C details Gardner’s Theory of Multiple Intelligences.' },
            { id: 16, order: 16, questionText: 'The standardization of IQ test distributions across a Gaussian bell curve.', answer: 'B', evidenceParagraph: 'B', evidenceQuote: 'standardized IQ tests using Gaussian bell-curve distributions.', explanation: 'Đoạn B mô tả việc chuẩn hóa bài thi IQ theo đường cong chuông Gaussian.', explanationEn: 'Paragraph B explains Gaussian bell-curve standardization.' },
            { id: 17, order: 17, questionText: 'Sternberg’s triarchic division highlighting practical real-world street smarts.', answer: 'D', evidenceParagraph: 'D', evidenceQuote: 'Robert Sternberg advanced the Triarchic Theory of Intelligence, partitioning cognitive capability into analytical, creative, and practical', explanation: 'Đoạn D nói về thuyết ba thành phần của Sternberg và trí thông minh thực tế.', explanationEn: 'Paragraph D covers Sternberg’s Triarchic Theory.' }
          ]
        },
        {
          id: 'qg-101-t4-4',
          type: 'multiple_choice',
          title: 'Questions 18–21',
          titleEn: 'Questions 18–21',
          instruction: 'Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 18–21 on your answer sheet.',
          instructionEn: 'Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 18–21 on your answer sheet.',
          options: [],
          questions: [
            {
              id: 18,
              order: 18,
              questionText: 'What did Charles Spearman identify as the general intelligence factor underlying disparate test performances?',
              options: [
                { label: 'A', text: 'Triarchic spatial capability' },
                { label: 'B', text: 'The general factor 'g'' },
                { label: 'C', text: 'Emotional quotient (EQ)' },
                { label: 'D', text: 'Linguistic memory retrieval' }
              ],
              answer: 'B',
              evidenceParagraph: 'A',
              evidenceQuote: 'Charles Spearman formulated the theory of the general intelligence factor, or 'g'.',
              explanation: 'Đoạn A nêu rõ Spearman phát hiện ra yếu tố trí thông minh chung "g".',
              explanationEn: 'Paragraph A identifies Spearman’s general factor "g".'
            },
            {
              id: 19,
              order: 19,
              questionText: 'What IQ threshold on standardized Gaussian scales is conventionally classified as intellectually gifted?',
              options: [
                { label: 'A', text: 'IQ 100' },
                { label: 'B', text: 'IQ 130 and above' },
                { label: 'C', text: 'IQ 85' },
                { label: 'D', text: 'IQ 115' }
              ],
              answer: 'B',
              evidenceParagraph: 'B',
              evidenceQuote: 'A person achieving an IQ score of two standard deviations above the population mean (IQ 130+) is conventionally classified as intellectually gifted.',
              explanation: 'Đoạn B khẳng định điểm số IQ từ 130 trở lên là ngưỡng thiên phú.',
              explanationEn: 'Paragraph B explicitly specifies IQ 130+ as the gifted benchmark.'
            },
            {
              id: 20,
              order: 20,
              questionText: 'Why did Howard Gardner criticize traditional monolithic pencil-and-paper IQ tests?',
              options: [
                { label: 'A', text: 'They are blind to athletic, artistic, and musical genius' },
                { label: 'B', text: 'They take more than three days to administer' },
                { label: 'C', text: 'They were exclusively designed for elementary schoolchildren' },
                { label: 'D', text: 'They rely on electrical shock responses' }
              ],
              answer: 'A',
              evidenceParagraph: 'C',
              evidenceQuote: 'standard pencil-and-paper IQ tests are inherently blind to.',
              explanation: 'Đoạn C giải thích bài thi giấy không đo lường được tài năng âm nhạc, vận động và nghệ thuật.',
              explanationEn: 'Paragraph C states IQ tests are blind to musical and kinesthetic genius.'
            },
            {
              id: 21,
              order: 21,
              questionText: 'What is the primary conclusion of contemporary cognitive neuroscientists regarding giftedness?',
              options: [
                { label: 'A', text: 'Brain size alone dictates creative success' },
                { label: 'B', text: 'Environmental enrichment has no impact on human cognition' },
                { label: 'C', text: 'Genetic potential requires deliberate practice and environmental enrichment' },
                { label: 'D', text: 'All humans possess identical neurological processing speeds' }
              ],
              answer: 'C',
              evidenceParagraph: 'E',
              evidenceQuote: 'genetic cognitive potential requires rigorous environmental enrichment, deliberate practice, emotional resilience',
              explanation: 'Đoạn E kết luận tiềm năng di truyền cần có sự rèn luyện có chủ ý và môi trường nuôi dưỡng.',
              explanationEn: 'Paragraph E emphasizes genetic potential requires deliberate practice and enrichment.'
            }
          ]
        },
        {
          id: 'qg-101-t4-5',
          type: 'true_false_not_given',
          title: 'Questions 22–26',
          titleEn: 'Questions 22–26',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 2?
In boxes 22–26 on your answer sheet, choose TRUE, FALSE, or NOT GIVEN.',
          instructionEn: 'Do the following statements agree with the claims of the writer in Reading Passage 2?
In boxes 22–26 on your answer sheet, choose TRUE, FALSE, or NOT GIVEN.',
          questions: [
            {
              id: 22,
              order: 22,
              questionText: 'Spearman noticed that students proficient in verbal tasks often excelled in mathematical tests.',
              answer: 'TRUE',
              evidenceParagraph: 'A',
              evidenceQuote: 'individuals who performed well on one cognitive task—such as verbal reasoning—consistently achieved superior scores on mathematically dissimilar tests',
              explanation: 'Đoạn A xác nhận Spearman nhận thấy người giỏi ngôn ngữ cũng thường đạt điểm cao ở môn toán.',
              explanationEn: 'The answer is TRUE. Spearman observed consistent superior performance across dissimilar subjects.'
            },
            {
              id: 23,
              order: 23,
              questionText: 'Standardized IQ tests have been completely abolished in military and civil service recruitment worldwide.',
              answer: 'FALSE',
              evidenceParagraph: 'B',
              evidenceQuote: 'These standardized metrics became deeply entrenched in military recruitment, civil service placements',
              explanation: 'Đoạn B khẳng định các chỉ số này ăn sâu vững chắc (deeply entrenched) vào tuyển dụng quân đội và công chức.',
              explanationEn: 'The answer is FALSE. IQ tests became deeply entrenched in military and civil service.'
            },
            {
              id: 24,
              order: 24,
              questionText: 'Robert Sternberg believes academic analytical intelligence is the only valid predictor of workplace happiness.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'D',
              evidenceQuote: 'Sternberg argued that 'street smarts'... is frequently a far stronger predictor of adult vocational success',
              explanation: 'Sternberg nhấn mạnh trí thông minh thực tế (street smarts) quan trọng hơn, không hề nói trí thông minh phân tích là yếu tố duy nhất.',
              explanationEn: 'The answer is NOT GIVEN. Sternberg argued practical intelligence was a stronger predictor, never asserting analytical was the sole predictor.'
            },
            {
              id: 25,
              order: 25,
              questionText: 'Highly intelligent brains have been observed to utilize less glucose during complex reasoning.',
              answer: 'TRUE',
              evidenceParagraph: 'E',
              evidenceQuote: 'gifted individuals exhibit denser white matter connectivity and consume less glucose when solving complex abstract problems.',
              explanation: 'Đoạn E khẳng định não người thiên phú tiêu thụ ít glucose hơn khi giải quyết vấn đề trừu tượng.',
              explanationEn: 'The answer is TRUE. Neuroimaging shows lower glucose consumption in gifted problem solvers.'
            },
            {
              id: 26,
              order: 26,
              questionText: 'Howard Gardner won the Nobel Prize in Physiology for discovering musical brain synapses.',
              answer: 'NOT GIVEN',
              evidenceParagraph: 'C',
              evidenceQuote: 'Psychologists like Howard Gardner challenged the monolithic 'g' factor with his Theory of Multiple Intelligences',
              explanation: 'Bài đọc chỉ nhắc Gardner đề xuất thuyết Đa trí thông minh, không có thông tin về giải Nobel.',
              explanationEn: 'The answer is NOT GIVEN. No mention of Nobel awards appears in the text.'
            }
          ]
        }
      ]
    },
    {
      id: '101-t4-p3',
      passageNumber: 3,
      title: 'Paper or Computer?',
      titleEn: 'Paper or Computer?',
      topic: 'technology_ergonomics',
      difficulty: 'Khó (Band 7.0 - 8.0)',
      wordCount: 980,
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
      paragraphs: [
        {
          id: 'A',
          text: "In the late 1970s, technological evangelists famously predicted the imminent dawn of the 'paperless office.' Digital workstations, local area networks, and electronic databases were supposed to render paper as obsolete as clay tablets. Yet decades into the computer age, global consumption of office paper has skyrocketed. Far from disappearing, physical paper remains deeply entrenched in modern corporate environments. Why has this ancient, low-tech material defied decades of digital innovation?"
        },
        {
          id: 'B',
          text: "In their pioneering treatise 'The Myth of the Paperless Office,' cognitive scientists Abigail Sellen and Richard Harper investigated how knowledge workers actually interact with documents. They found that paper possesses unique physical affordances—tangible interactive properties that digital screens struggle to replicate. Paper is physically flexible, lightweight, spatially manipulable, and permits effortless micro-navigation. A worker can spread twenty physical documents across a large desk, comparing graphs, annotating margins with a pen, and glancing between pages with instantaneous saccadic eye movements."
        },
        {
          id: 'C',
          text: "By contrast, digital screens impose severe spatial and cognitive constraints. Reading complex analytical reports on a computer screen creates the 'keyhole effect'—forcing the reader to view vast intellectual landscapes through a narrow electronic aperture. Scrolling and clicking disrupt cognitive flow, placing heavy demands on working memory. Studies show that when readers scroll through lengthy PDFs, their mental spatial mapping of the text degrades significantly compared to reading physically bounded book pages."
        },
        {
          id: 'D',
          text: "Furthermore, paper excels in collaborative, interactive group meetings. During brainstorming sessions or executive reviews, spreading physical sheets of paper across a conference table creates a shared, egalitarian intellectual space. Team members can simultaneously point, sketch, cross out, and rearrange ideas without fighting over a single computer mouse or squinting at a projected slide. Paper is uniquely tailorable and democratic: anyone with a pen can contribute instantly."
        },
        {
          id: 'E',
          text: "Paper piles on a desk, often disparaged as disorganization, actually serve as an externalized cognitive spatial memory system. Sellen and Harper discovered that workers arrange documents in deliberate physical piles representing active priorities, pending obligations, and conceptual clusters. The physical visibility of a document pile acts as an unignorable ambient reminder, whereas files buried five folders deep inside a computer directory easily fade into psychological oblivion."
        },
        {
          id: 'F',
          text: "The future office is therefore neither purely paperless nor purely analog. Modern knowledge work thrives on a symbiotic hybridity: computers provide unparalleled computational power, instant global search, and limitless archival storage, while paper remains the supreme cognitive medium for deep reading, creative composition, and collaborative synthesis."
        }
      ],
      questionGroups: [
        {
          id: 'qg-101-t4-6',
          type: 'matching_headings',
          title: 'Questions 27–32',
          titleEn: 'Questions 27–32',
          instruction: 'Choose the correct heading for paragraphs A–F from the list of headings below.
Write the correct number (i–ix) in boxes 27–32 on your answer sheet.',
          instructionEn: 'Choose the correct heading for paragraphs A–F from the list below.
Write the correct number (i–ix) in boxes 27–32 on your answer sheet.',
          headingsList: [
            { id: 'i', text: 'A balanced symbiotic hybridity for future knowledge work' },
            { id: 'ii', text: 'Collaborative egalitarian advantages of physical documents in meetings' },
            { id: 'iii', text: 'The unique physical affordances and spatial freedom of paper' },
            { id: 'iv', text: 'The failed prediction of the completely paperless office' },
            { id: 'v', text: 'Environmental costs of excessive paper manufacturing' },
            { id: 'vi', text: 'Security vulnerabilities of unprotected digital databases' },
            { id: 'vii', text: 'Designing tactile keyboards for screen displays' },
            { id: 'viii', text: 'The keyhole effect and cognitive strain of screen scrolling' },
            { id: 'ix', text: 'Document piles functioning as externalized ambient memory' }
          ],
          questions: [
            { id: 27, order: 27, questionText: 'Paragraph A', answer: 'iv', evidenceParagraph: 'A', evidenceQuote: 'predicted the imminent dawn of the 'paperless office'... paper has skyrocketed. Far from disappearing', explanation: 'Đoạn A bàn về dự báo thất bại về văn phòng không giấy tờ.', explanationEn: 'Paragraph A details the failed prediction of the paperless office.' },
            { id: 28, order: 28, questionText: 'Paragraph B', answer: 'iii', evidenceParagraph: 'B', evidenceQuote: 'paper possesses unique physical affordances—tangible interactive properties that digital screens struggle to replicate.', explanation: 'Đoạn B giải thích các ưu điểm vật lý hữu hình của giấy.', explanationEn: 'Paragraph B outlines the unique physical affordances of paper.' },
            { id: 29, order: 29, questionText: 'Paragraph C', answer: 'viii', evidenceParagraph: 'C', evidenceQuote: 'creates the 'keyhole effect'—forcing the reader to view vast intellectual landscapes through a narrow electronic aperture.', explanation: 'Đoạn C phân tích hiệu ứng lỗ khóa (keyhole effect) và sự suy giảm nhận thức khi cuộn màn hình.', explanationEn: 'Paragraph C explains the keyhole effect and cognitive disruption of screen reading.' },
            { id: 30, order: 30, questionText: 'Paragraph D', answer: 'ii', evidenceParagraph: 'D', evidenceQuote: 'Furthermore, paper excels in collaborative, interactive group meetings... shared, egalitarian intellectual space.', explanation: 'Đoạn D nhấn mạnh lợi thế hợp tác bình đẳng của giấy trong các cuộc họp nhóm.', explanationEn: 'Paragraph D emphasizes paper’s collaborative and egalitarian benefits in meetings.' },
            { id: 31, order: 31, questionText: 'Paragraph E', answer: 'ix', evidenceParagraph: 'E', evidenceQuote: 'Paper piles on a desk... serve as an externalized cognitive spatial memory system.', explanation: 'Đoạn E giải thích các chồng giấy đóng vai trò hệ nhớ không gian bên ngoài.', explanationEn: 'Paragraph E explains document piles as external ambient memory systems.' },
            { id: 32, order: 32, questionText: 'Paragraph F', answer: 'i', evidenceParagraph: 'F', evidenceQuote: 'The future office is therefore neither purely paperless nor purely analog. Modern knowledge work thrives on a symbiotic hybridity', explanation: 'Đoạn F kết luận về mô hình lai cộng sinh tối ưu giữa giấy và máy tính.', explanationEn: 'Paragraph F concludes with the symbiotic hybridity model.' }
          ]
        },
        {
          id: 'qg-101-t4-7',
          type: 'summary_completion',
          title: 'Questions 33–36',
          titleEn: 'Questions 33–36',
          instruction: 'Complete the summary below.
Choose NO MORE THAN THREE WORDS from the passage for each answer.
Write your answers in boxes 33–36 on your answer sheet.',
          instructionEn: 'Complete the summary below.
Choose NO MORE THAN THREE WORDS from the passage for each answer.
Write your answers in boxes 33–36 on your answer sheet.',
          questions: [
            {
              id: 33,
              order: 33,
              questionText: 'Paper fosters a deeply [33]... atmosphere when teams brainstorm together around tables.',
              answer: 'collaborative and interactive',
              acceptableAnswers: ['collaborative and interactive', 'collaborative', 'interactive'],
              evidenceParagraph: 'D',
              evidenceQuote: 'paper excels in collaborative, interactive group meetings.',
              explanation: 'Đoạn D nêu giấy giúp tạo không khí hợp tác và tương tác cao.',
              explanationEn: 'Paragraph D notes paper excels in collaborative, interactive meetings.'
            },
            {
              id: 34,
              order: 34,
              questionText: 'Paper documents possess distinct [34]... interactive affordances absent from glass screens.',
              answer: 'tangible',
              acceptableAnswers: ['tangible', 'physical'],
              evidenceParagraph: 'B',
              evidenceQuote: 'paper possesses unique physical affordances—tangible interactive properties that digital screens struggle to replicate.',
              explanation: 'Đoạn B nhấn mạnh các thuộc tính tương tác hữu hình (tangible properties).',
              explanationEn: 'Paragraph B highlights tangible interactive properties.'
            },
            {
              id: 35,
              order: 35,
              questionText: 'Physical paper is uniquely democratic and [35]..., allowing anyone with a pen to mark up thoughts.',
              answer: 'tailorable',
              acceptableAnswers: ['tailorable', 'tailorable and democratic'],
              evidenceParagraph: 'D',
              evidenceQuote: 'Paper is uniquely tailorable and democratic: anyone with a pen can contribute instantly.',
              explanation: 'Đoạn D mô tả giấy có tính năng dễ tùy biến và dân chủ.',
              explanationEn: 'Paragraph D characterizes paper as tailorable and democratic.'
            },
            {
              id: 36,
              order: 36,
              questionText: 'Spreading documents in a meeting creates an egalitarian space for a [36]... to discuss without fighting over inputs.',
              answer: 'group of people',
              acceptableAnswers: ['group of people', 'team', 'team members'],
              evidenceParagraph: 'D',
              evidenceQuote: 'Team members can simultaneously point, sketch, cross out, and rearrange ideas without fighting over a single computer mouse',
              explanation: 'Giúp một nhóm người (group of people / team) cùng thảo luận tự do.',
              explanationEn: 'Paragraph D highlights a group of people discussing collaboratively.'
            }
          ]
        },
        {
          id: 'qg-101-t4-8',
          type: 'multiple_choice',
          title: 'Questions 37–40',
          titleEn: 'Questions 37–40',
          instruction: 'Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 37–40 on your answer sheet.',
          instructionEn: 'Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 37–40 on your answer sheet.',
          options: [],
          questions: [
            {
              id: 37,
              order: 37,
              questionText: 'What cognitive phenomenon describes viewing extensive digital text through a narrow screen?',
              options: [
                { label: 'A', text: 'Tunnel blindness effect' },
                { label: 'B', text: 'Digital amnesia syndrome' },
                { label: 'C', text: 'The keyhole effect' },
                { label: 'D', text: 'Monocular aperture fatigue' }
              ],
              answer: 'C',
              evidenceParagraph: 'C',
              evidenceQuote: 'creates the 'keyhole effect'—forcing the reader to view vast intellectual landscapes through a narrow electronic aperture.',
              explanation: 'Đoạn C gọi hiện tượng này là hiệu ứng lỗ khóa (keyhole effect).',
              explanationEn: 'Paragraph C explicitly names this the keyhole effect.'
            },
            {
              id: 38,
              order: 38,
              questionText: 'Why do paper piles on an executive desk resist being discarded?',
              options: [
                { label: 'A', text: 'They serve as ambient visual reminders of active work priorities' },
                { label: 'B', text: 'They insulate desks against cold office air conditioning' },
                { label: 'C', text: 'Workers are contractually prohibited from shredding drafts' },
                { label: 'D', text: 'They prevent coworkers from sitting on empty tables' }
              ],
              answer: 'A',
              evidenceParagraph: 'E',
              evidenceQuote: 'The physical visibility of a document pile acts as an unignorable ambient reminder',
              explanation: 'Đoạn E khẳng định các chồng giấy đóng vai trò nhắc nhở thị giác trực quan về công việc đang xử lý.',
              explanationEn: 'Paragraph E explains physical visibility acts as an ambient reminder.'
            },
            {
              id: 39,
              order: 39,
              questionText: 'What main cognitive advantage does reading physically bounded paper afford over scrolling on PDFs?',
              options: [
                { label: 'A', text: 'Superior mental spatial mapping of the text' },
                { label: 'B', text: 'Elimination of all spelling errors in comprehension tests' },
                { label: 'C', text: 'Faster word pronunciation speeds in children' },
                { label: 'D', text: 'Automatic memorization of footnotes and citations' }
              ],
              answer: 'A',
              evidenceParagraph: 'C',
              evidenceQuote: 'their mental spatial mapping of the text degrades significantly compared to reading physically bounded book pages.',
              explanation: 'Đoạn C chỉ ra đọc giấy giúp não bộ ghi nhớ bản đồ không gian của văn bản tốt hơn hẳn.',
              explanationEn: 'Paragraph C explains mental spatial mapping is superior on physical pages.'
            },
            {
              id: 40,
              order: 40,
              questionText: 'What is the recommended design philosophy for the modern knowledge workplace?',
              options: [
                { label: 'A', text: 'Imposing financial fines on employees who use paper notebooks' },
                { label: 'B', text: 'Banning all computer screens in executive conference rooms' },
                { label: 'C', text: 'Replacing all physical desks with virtual reality goggles' },
                { label: 'D', text: 'Embracing a symbiotic hybridity combining computer computing and paper synthesis' }
              ],
              answer: 'D',
              evidenceParagraph: 'F',
              evidenceQuote: 'Modern knowledge work thrives on a symbiotic hybridity: computers provide unparalleled computational power... while paper remains the supreme cognitive medium',
              explanation: 'Đoạn F kết luận triết lý tương lai là mô hình cộng sinh phối hợp sức mạnh máy tính và khả năng tổng hợp của giấy.',
              explanationEn: 'Paragraph F advocates a symbiotic hybridity between digital and paper tools.'
            }
          ]
        }
      ]
    }
  ]
};
