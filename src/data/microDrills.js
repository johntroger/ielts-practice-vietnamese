/**
 * Initial dataset of Scaffolded IELTS Writing Micro-Drills
 * Categories:
 * 1. fill-blanks: Prepositions of data (Task 1) & Academic Cohesive Devices (Task 2)
 * 2. true-false: Data accuracy & logical statement verification
 * 3. paraphrase: Single-sentence rewriting drills
 * 4. error-spotting: Identify and fix classic grammar/collocation pitfalls
 */

export const INITIAL_MICRO_DRILLS = [
  // 1. FILL IN THE BLANKS DRILLS
  {
    id: 'drill-fill-1',
    type: 'fill-blanks',
    title: 'Giới từ miêu tả số liệu Task 1 (Prepositions of Data)',
    category: 'Task 1 Grammar',
    passage: 'The percentage of renewable energy in Germany stood ___ 17% in 2010. Over the next decade, it grew steadily ___ 35 percentage points to reach 52% in 2024. In contrast, Danish figures experienced a marked climb and peaked ___ an all-time high of 85%. Overall, clean electricity accounted ___ more than half of the national total.',
    blanks: [
      { index: 0, answer: 'at', options: ['at', 'in', 'on', 'by'], explanation: "'stood at + [số liệu]': đứng tại mốc bao nhiêu." },
      { index: 1, answer: 'by', options: ['by', 'to', 'with', 'from'], explanation: "'grew by + [khoảng chênh lệch]': tăng thêm một khoảng bao nhiêu." },
      { index: 2, answer: 'at', options: ['at', 'to', 'in', 'on'], explanation: "'peaked at + [số liệu đỉnh]': đạt đỉnh tại mức nào." },
      { index: 3, answer: 'for', options: ['for', 'of', 'with', 'in'], explanation: "'accounted for + [tỷ lệ/phần trăm]': chiếm bao nhiêu phần trăm." }
    ]
  },
  {
    id: 'drill-fill-2',
    type: 'fill-blanks',
    title: 'Từ nối học thuật Task 2 (Advanced Cohesive Devices)',
    category: 'Task 2 Cohesion',
    passage: 'Many developing nations continue to subsidize fossil fuels. ___, environmental scientists argue that continuing this practice accelerates global warming. ___, transitioning to solar power requires massive upfront capital; ___, international financial institutions must offer green grants. ___, sustainable growth remains an elusive ambition.',
    blanks: [
      { index: 0, answer: 'However', options: ['However', 'Therefore', 'Furthermore', 'Similarly'], explanation: "'However' thể hiện sự tương phản rõ ràng giữa chính sách trợ giá và cảnh báo của giới khoa học." },
      { index: 1, answer: 'Admittedly', options: ['Admittedly', 'Consequently', 'In addition', 'Namely'], explanation: "'Admittedly' dùng khi công nhận một sự thật/khó khăn khách quan trước khi đưa ra lập luận chính." },
      { index: 2, answer: 'hence', options: ['hence', 'although', 'whereas', 'despite'], explanation: "'hence' (vì vậy) nối với giải pháp tài chính cần thiết." },
      { index: 3, answer: 'Otherwise', options: ['Otherwise', 'Moreover', 'Besides', 'For example'], explanation: "'Otherwise' (nếu không thì) dự báo hậu quả tiêu cực nếu không có hành động can thiệp." }
    ]
  },

  // 2. TRUE / FALSE STATEMENTS (CHART READING & LOGIC)
  {
    id: 'drill-tf-1',
    type: 'true-false',
    title: 'Đọc hiểu & Kiểm tra số liệu biểu đồ Task 1 (Renewable Energy)',
    category: 'Task 1 Data Accuracy',
    context: 'Dựa trên biểu đồ: Denmark (2010: 32%, 2024: 85%), Germany (2010: 17%, 2024: 52%), Spain (2010: 35%, 2024: 50%), UK (2010: 7%, 2024: 48%).',
    questions: [
      {
        id: 'q1',
        statement: 'In 2010, Spain generated the highest proportion of renewable electricity among the four nations.',
        isTrue: true,
        explanation: 'Đúng (True). Năm 2010, Tây Ban Nha dẫn đầu với 35%, cao hơn Đan Mạch (32%), Đức (17%) và Anh (7%).'
      },
      {
        id: 'q2',
        statement: 'The United Kingdom had the lowest growth rate in renewable energy production between 2010 and 2024.',
        isTrue: false,
        explanation: 'Sai (False). Vương quốc Anh có mức tăng trưởng theo tỷ lệ ngoạn mục nhất, từ 7% tăng gần 7 lần lên 48%.'
      },
      {
        id: 'q3',
        statement: 'Denmark was the only country whose renewable energy share exceeded 80% by 2024.',
        isTrue: true,
        explanation: 'Đúng (True). Đan Mạch đạt 85%, trong khi 3 nước còn lại chỉ dao động trong khoảng 48% - 52%.'
      },
      {
        id: 'q4',
        statement: 'Germany and Spain ended the period with identical percentages in 2024.',
        isTrue: false,
        explanation: 'Sai (False). Đức đạt 52% còn Tây Ban Nha đạt 50%, có sự chênh lệch nhỏ 2%.'
      }
    ]
  },

  // 3. SENTENCE PARAPHRASING DRILLS
  {
    id: 'drill-para-1',
    type: 'paraphrase',
    title: 'Luyện Paraphrase Mở Bài: AI & Việc làm',
    category: 'Task 2 Introduction',
    originalSentence: 'A lot of people think that artificial intelligence will take away human jobs in the future.',
    targetBand: 'Band 7.5+',
    hints: ['Dùng danh từ hóa: automation, technological unemployment', 'Thay "a lot of people think" bằng "It is widely believed that..." hoặc "A prevailing viewpoint contends that..."'],
    sampleBand8: 'It is widely contended that the rapid proliferation of artificial intelligence will precipitate widespread technological unemployment.',
  },
  {
    id: 'drill-para-2',
    type: 'paraphrase',
    title: 'Luyện Paraphrase Câu Thân Bài: Ô nhiễm môi trường',
    category: 'Task 2 Body Explanation',
    originalSentence: 'Car smoke is very bad for the air in big cities, so people get sick.',
    targetBand: 'Band 7.5+',
    hints: ['Dùng từ vựng C1: vehicular exhaust emissions, degrade ambient air quality, respiratory ailments'],
    sampleBand8: 'Vehicular exhaust emissions significantly degrade urban ambient air quality, thereby triggering chronic respiratory ailments among metropolitan inhabitants.',
  },
  {
    id: 'drill-para-3',
    type: 'paraphrase',
    title: 'Luyện Paraphrase Task 1: Câu mở bài biểu đồ cột',
    category: 'Task 1 Introduction',
    originalSentence: 'The chart shows how much garbage people in different countries recycled in 2015 and 2025.',
    targetBand: 'Band 7.5+',
    hints: ['Dùng: illustrates/compares, the proportion of municipal waste, recycled across distinct regions'],
    sampleBand8: 'The bar chart delineates the proportion of household waste recycled across five distinct geographical regions in 2015, alongside projections for 2025.',
  },
  {
    id: 'drill-para-4',
    type: 'paraphrase',
    title: 'Luyện Paraphrase Câu Overview Task 1: Tăng trưởng & Dẫn đầu',
    category: 'Task 1 Overview',
    originalSentence: 'In general, all countries increased their car production, but Japan produced the most cars in every year.',
    targetBand: 'Band 8.0+',
    hints: ['Dùng: Overall, it is readily apparent that..., upward trajectories, undisputed global leader'],
    sampleBand8: 'Overall, it is readily apparent that while all surveyed nations experienced pronounced upward trajectories in automotive manufacturing, Japan maintained an undisputed dominance throughout the period.',
  },
  {
    id: 'drill-para-5',
    type: 'paraphrase',
    title: 'Luyện Paraphrase Câu Kết Bài Task 2: Giải pháp & Dự báo',
    category: 'Task 2 Conclusion',
    originalSentence: 'In conclusion, governments must spend money to fix traffic jams or cities will get worse.',
    targetBand: 'Band 8.0+',
    hints: ['Dùng: In conclusion, allocated capital towards urban transit infrastructure, catastrophic gridlock'],
    sampleBand8: 'In conclusion, proactive governmental investment in public transit infrastructure represents an indispensable prerequisite to avert chronic urban gridlock.',
  },

  // 4. ERROR SPOTTING & CORRECTION
  {
    id: 'drill-error-1',
    type: 'error-spotting',
    title: 'Sửa lỗi mạo từ & danh từ không đếm được',
    category: 'Grammar Accuracy',
    sentenceWithErrors: 'The government should provide more financial aids and advices to university students.',
    targetCorrection: 'The government should provide more financial aid and advice to university students.',
    explanation: "'aid' (sự viện trợ) và 'advice' (lời khuyên) là danh từ KHÔNG đếm được trong tiếng Anh học thuật, không bao giờ thêm đuôi 's'."
  },
  {
    id: 'drill-error-2',
    type: 'error-spotting',
    title: 'Sửa lỗi câu chắp vá (Run-on Sentence)',
    category: 'Grammar Range',
    sentenceWithErrors: 'Renewable energy is clean, it does not produce greenhouse gases, it is very expensive to install.',
    targetCorrection: 'Although renewable energy is clean and does not produce greenhouse gases, it remains prohibitively expensive to install.',
    explanation: "Lỗi phẩy nối (Comma splice / Run-on). Cần dùng liên từ phụ thuộc 'Although' hoặc tách câu để tạo câu phức chuẩn học thuật."
  },
  {
    id: 'drill-error-3',
    type: 'error-spotting',
    title: 'Sửa lỗi thì & từ vựng chỉ xu hướng sai trong đề Static',
    category: 'Task 1 Register',
    sentenceWithErrors: 'In 2022, the expenditure on healthcare in the US increased by 18%, reaching the highest position.',
    targetCorrection: 'In 2022, healthcare expenditure in the US accounted for 18% of total spending, representing the highest proportion.',
    explanation: "Đề bài chỉ có duy nhất năm 2022 (Static Task), KHÔNG được dùng động từ xu hướng 'increased by' vì không có thời gian trước đó để tăng. Phải dùng cấu trúc so sánh tỷ trọng 'accounted for 18%'."
  },
  {
    id: 'drill-error-4',
    type: 'error-spotting',
    title: 'Sửa lỗi hòa hợp Chủ ngữ - Vị ngữ phức tạp',
    category: 'Grammar Accuracy',
    sentenceWithErrors: 'The number of international students attending European universities have risen exponentially.',
    targetCorrection: 'The number of international students attending European universities has risen exponentially.',
    explanation: "Chủ ngữ là 'The number of...' (số lượng) nên động từ phải chia số ít là 'has risen', không chia theo danh từ 'students'."
  },

  // 5. ACADEMIC COLLOCATIONS MATCHING
  {
    id: 'drill-colloc-1',
    type: 'collocation',
    title: 'Collocation Học Thuật: Môi Trường & Năng Lượng',
    category: 'Lexical Resource (C1-C2)',
    pairs: [
      { term: 'mitigate', match: 'carbon emissions', meaning: 'giảm thiểu lượng khí thải carbon' },
      { term: 'prohibitively', match: 'expensive', meaning: 'đắt đỏ đến mức không thể chi trả' },
      { term: 'deplete', match: 'natural resources', meaning: 'làm cạn kiệt tài nguyên thiên nhiên' },
      { term: 'irreversible', match: 'environmental damage', meaning: 'tổn hại môi trường không thể phục hồi' }
    ]
  },
  {
    id: 'drill-colloc-2',
    type: 'collocation',
    title: 'Collocation Học Thuật: Công Nghệ & Trí Tuệ Nhân Tạo',
    category: 'Lexical Resource (C1-C2)',
    pairs: [
      { term: 'catalyze', match: 'industrial innovation', meaning: 'thúc đẩy đổi mới công nghiệp' },
      { term: 'precipitate', match: 'technological unemployment', meaning: 'gây ra tình trạng thất nghiệp do công nghệ' },
      { term: 'infringe upon', match: 'individual privacy', meaning: 'xâm phạm quyền riêng tư của cá nhân' },
      { term: 'algorithmic', match: 'bias and discrimination', meaning: 'sự thiên vị và phân biệt đối xử của thuật toán' }
    ]
  }
];
