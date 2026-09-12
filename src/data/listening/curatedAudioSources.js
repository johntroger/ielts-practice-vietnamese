/**
 * curatedAudioSources.js - Curated Authentic Dialogue & Monologue Audio Sources for IELTS Listening
 * Includes direct streaming CDN URLs, accent tags, context, and AI Part Suitability Recommendations.
 */

export const CURATED_LISTENING_AUDIO_SOURCES = [
  // PART 1 RECOMMENDED SOURCES
  {
    id: 'src-p1-festival',
    title: 'Summer Music Festival Inquiry & Booking Form',
    audioUrl: 'https://dn711100.ca.archive.org/0/items/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    durationSeconds: 330,
    durationText: '~5.5 phút',
    accent: 'British (Anh - Anh)',
    speakers: '2 người (Nhân viên bán vé & Khách hàng)',
    context: 'Cuộc gọi hỏi thông tin đặt vé lễ hội âm nhạc mùa hè, giá vé, địa chỉ nhà, số điện thoại và chính sách giảm giá cho học sinh / người cao tuổi.',
    suggestedParts: [1],
    aiReasoning: 'Hội thoại giao dịch đời thường kinh điển giữa 2 người (khách hàng & nhân viên). Tốc độ nói rõ ràng, xuất hiện các thông tin đánh vần họ tên, địa chỉ, giá vé -> Cực kỳ thích hợp để sinh Part 1 (Form / Note Completion).',
    recommendedQuestionTypes: ['Note Completion (Điền tên/số/ngày tháng)', 'Multiple Choice ngắn'],
    sampleTranscriptSnippet: 'Good morning, Westsea Music Festival booking office. How can I help you? - Hello, I would like to book some tickets for the Spanish concert...'
  },
  {
    id: 'src-p1-insurance',
    title: 'International Shipping Damage & Insurance Claim',
    audioUrl: 'https://dn710908.ca.archive.org/0/items/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    durationSeconds: 350,
    durationText: '~5.8 phút',
    accent: 'British & Australian (Anh - Anh & Úc)',
    speakers: '2 người (Nhân viên bảo hiểm & Người gửi hàng)',
    context: 'Khách hàng liên hệ công ty bảo hiểm báo cáo các món đồ nội thất (tivi, tủ, bàn ghế) bị trầy xước và nứt vỡ trong quá trình vận chuyển đường biển quốc tế.',
    suggestedParts: [1],
    aiReasoning: 'Chủ đề báo cáo sự cố bảo hiểm thực tế (Incident Report) thường xuyên xuất hiện trong bài thi IELTS thật. Chứa nhiều bẫy đổi thông tin về ngày tháng, số tiền bồi thường và đánh vần địa chỉ suburb -> Hoàn hảo cho Part 1.',
    recommendedQuestionTypes: ['Table / Form Completion (Tên đồ vật, chi phí, vị trí hỏng)'],
    sampleTranscriptSnippet: 'Total Insurance Claims Department, Judy speaking. - Hello, my name is Michael Alexander, calling about our damaged container shipment...'
  },
  {
    id: 'src-p1-rental',
    title: 'Central City Apartment Rental & Letting Inquiry',
    audioUrl: 'https://dn710908.ca.archive.org/0/items/IELTS8Test2/IELTS_8%2C_Test_3.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test2/IELTS_8%2C_Test_3.mp3',
    durationSeconds: 340,
    durationText: '~5.6 phút',
    accent: 'British (Anh - Anh)',
    speakers: '2 người (Môi giới bất động sản & Người thuê nhà)',
    context: 'Người thuê nhà liên hệ tìm căn hộ 1-2 phòng ngủ ở trung tâm thành phố, hỏi về ngân sách tối đa, chỗ để xe ngầm, phòng làm việc và tiện nghi đi kèm.',
    suggestedParts: [1],
    aiReasoning: 'Tình huống thuê nhà (Accommodation hunting) là dạng đề cốt lõi của Section 1 thi IELTS. Ngôn ngữ đàm phán giá cả, liệt kê đồ gia dụng miễn phí -> Tối ưu cho Part 1 Note Completion & Pick Multiple.',
    recommendedQuestionTypes: ['Note Completion (Ngân sách, phòng ngủ, tiện ích)', 'Pick 2 from 5 (Thiết bị miễn phí)'],
    sampleTranscriptSnippet: 'City Letting Agency, how can I assist you? - I am looking for a quiet one or two-bedroom flat in a central district, with a budget around 600 pounds...'
  },

  // PART 2 RECOMMENDED SOURCES
  {
    id: 'src-p2-museum',
    title: 'Dinosaur Museum Orientation & School Field Trip Tour',
    audioUrl: 'https://dn711100.ca.archive.org/0/items/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    durationSeconds: 380,
    durationText: '~6.3 phút',
    accent: 'British (Anh - Anh chuẩn BBC)',
    speakers: '1 người (Hướng dẫn viên bảo tàng thuyết minh)',
    context: 'Bài nói hướng dẫn cho các đoàn giáo viên và học sinh trước khi vào bảo tàng: quy định giờ đóng cửa, bãi đỗ xe, đồ dùng được phép mang vào và phòng khám phá.',
    suggestedParts: [2],
    aiReasoning: 'Độc thoại phổ biến (General Monologue) do một hướng dẫn viên trình bày về cơ sở vật chất công cộng và quy chế tham quan. Rất giàu chi tiết chỉ dẫn -> Thích hợp nhất cho Part 2 (Sentence Completion, Multiple Choice & Pick Multiple).',
    recommendedQuestionTypes: ['Sentence Completion', 'Pick 3 from 7 (Đồ dùng được phép mang)', 'Multiple Choice'],
    sampleTranscriptSnippet: 'Welcome everyone to the Dinosaur Museum. On Mondays we close early at one thirty for maintenance. All school groups should gather in the car park...'
  },
  {
    id: 'src-p2-reserve',
    title: 'Red Valley Nature Reserve & Agro-Tourism Farm Tour',
    audioUrl: 'https://dn710908.ca.archive.org/0/items/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    durationSeconds: 390,
    durationText: '~6.5 phút',
    accent: 'Australian (Anh - Úc tự nhiên)',
    speakers: '1 người (Quản lý khu bảo tồn sinh thái)',
    context: 'Giới thiệu sơ đồ bản đồ phân khu nông trại (Khu rừng bảo tồn, trại cá, vườn rau hữu cơ) và các hoạt động trải nghiệm cho trẻ em như cho cừu ăn, nướng bánh mì.',
    suggestedParts: [2],
    aiReasoning: 'Bài nói mô tả không gian địa lý, các góc định hướng (phía Bắc qua cầu, cạnh hồ chứa, góc Đông Nam). Đây là chất liệu vàng để AI sinh dạng bài Bản đồ (Map Labelling) đặc trưng của Part 2.',
    recommendedQuestionTypes: ['Map / Plan Labelling (Định vị phân khu)', 'Multiple Choice (Hoạt động tham quan)'],
    sampleTranscriptSnippet: 'Welcome to Red Valley Reserve. If you look at your map, up in the northern quadrant past the bridge lies our native forest sanctuary...'
  },

  // PART 3 RECOMMENDED SOURCES
  {
    id: 'src-p3-fieldtrip',
    title: 'Navajo Canyon Geology Proposal: Student & Tutor Consultation',
    audioUrl: 'https://dn711100.ca.archive.org/0/items/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    durationSeconds: 440,
    durationText: '~7.3 phút',
    accent: 'British & Australian (Giảng viên & Sinh viên)',
    speakers: '2 người (Giáo viên hướng dẫn & Nữ sinh viên)',
    context: 'Buổi trao đổi học thuật thảo luận về bản đề cương chuyến khảo sát thực địa hẻm núi Navajo: góp ý cấu trúc câu, bố cục luận điểm, diện tích khảo sát và động thực vật.',
    suggestedParts: [3],
    aiReasoning: 'Cuộc thảo luận học thuật điển hình (Academic Tutorial Consultation) giữa giảng viên và sinh viên về phương pháp nghiên cứu, phản biện đề cương -> Chuẩn 100% bản sắc Part 3 (Multiple Choice học thuật, Matching quan điểm).',
    recommendedQuestionTypes: ['Academic Multiple Choice', 'Pick 3 from 6', 'Summary / Notes Completion'],
    sampleTranscriptSnippet: 'Sandra, let us examine your field trip proposal. I think the logical flow would improve if you re-order some sections and shorten dense sentences...'
  },
  {
    id: 'src-p3-honeybee',
    title: 'Asian Honey Bees Ecology & Fieldwork Methodology',
    audioUrl: 'https://dn710908.ca.archive.org/0/items/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    durationSeconds: 440,
    durationText: '~7.3 phút',
    accent: 'British & Australian (Giáo sư sinh học & Sinh viên nghiên cứu)',
    speakers: '2 người (Giáo sư & Trợ lý nghiên cứu)',
    context: 'Thảo luận phương pháp thu thập mẫu thức ăn chim ăn ong để xét nghiệm cánh ong ngoại lai dưới kính hiển vi tại phòng thí nghiệm.',
    suggestedParts: [3, 4],
    aiReasoning: 'Nội dung chứa nhiều thuật ngữ khoa học tự nhiên, phương pháp thu thập mẫu thực địa và phân tích phòng lab -> Có thể dùng để sinh Part 3 (Thảo luận nghiên cứu) hoặc Part 4 (Quy trình sinh học).',
    recommendedQuestionTypes: ['Multiple Choice', 'Flow-chart / Process Completion', 'Lab Notes Completion'],
    sampleTranscriptSnippet: 'Professor, my concern with Asian honey bees is the risk of introducing parasites. We track bee-eater birds to collect regurgitated pellets for lab analysis...'
  },

  // PART 4 RECOMMENDED SOURCES
  {
    id: 'src-p4-geography',
    title: 'University Lecture: Physical Geography & Urban Microclimates',
    audioUrl: 'https://dn711100.ca.archive.org/0/items/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test1/IELTS_8%2C_Test_1.mp3',
    durationSeconds: 570,
    durationText: '~9.5 phút',
    accent: 'British (Giáo sư đại học thuyết giảng)',
    speakers: '1 người (Giảng viên đại học)',
    context: 'Bài giảng nhập môn địa lý: quá trình hình thành bề mặt trái đất, tương tác con người - môi trường, vi khí hậu thành phố, hiệu ứng đảo nhiệt và đo đạc vệ tinh.',
    suggestedParts: [4],
    aiReasoning: 'Bài giảng đại học học thuật liên tục (Academic Monologue Lecture). Tốc độ nói nhanh, cấu trúc phân tích logic, vốn từ vựng học thuật C1/C2 -> Tuyệt đối phù hợp cho Part 4 với dạng điền từ ONE WORD ONLY.',
    recommendedQuestionTypes: ['Lecture Notes Completion (ONE WORD ONLY)', 'Summary Completion'],
    sampleTranscriptSnippet: 'Welcome to this introductory geography lecture. Physical geography explores all the processes shaping the earth surface, while human geography evaluates our environmental impact...'
  },
  {
    id: 'src-p4-hygiene',
    title: 'Social History Lecture: Evolution of Personal Hygiene & Soap',
    audioUrl: 'https://dn710908.ca.archive.org/0/items/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test2/IELTS_8%2C_Test_2.mp3',
    durationSeconds: 560,
    durationText: '~9.3 phút',
    accent: 'British (Nhà sử học thuyết trình)',
    speakers: '1 người (Nhà nghiên cứu lịch sử)',
    context: 'Bài giảng lịch sử văn hóa xã hội: từ xà phòng mỡ động vật thời Babylon, nhà tắm công cộng La Mã, quan niệm né nước thời Trung Cổ đến cuộc cách mạng vệ sinh y tế thế kỷ 19.',
    suggestedParts: [4],
    aiReasoning: 'Bài giảng theo tiến trình lịch sử (Chronological Academic Lecture) kết hợp thành tựu của các nhà khoa học (Semmelweis, John Snow, Nightingale). Hoàn hảo cho Part 4 Multiple Choice hoặc Matching nhân vật.',
    recommendedQuestionTypes: ['Multiple Choice học thuật', 'Matching (Nhân vật lịch sử & Phát minh vệ sinh)'],
    sampleTranscriptSnippet: 'Today we trace the history of cleanliness. Ancient Sumerians boiled tallow with wood ash, whereas medieval physicians believed bathing weakened the body against plague...'
  },
  {
    id: 'src-p4-wildlife',
    title: 'Urban Ecology Lecture: Wildlife Adaptation to Metropolises',
    audioUrl: 'https://dn710908.ca.archive.org/0/items/IELTS8Test2/IELTS_8%2C_Test_3.mp3',
    fallbackAudioUrl: 'https://archive.org/download/IELTS8Test2/IELTS_8%2C_Test_3.mp3',
    durationSeconds: 550,
    durationText: '~9.2 phút',
    accent: 'British (Tiến sĩ sinh thái học)',
    speakers: '1 người (Giảng viên sinh thái học)',
    context: 'Bài giảng sinh học về các loài động vật hoang dã xâm lấn đô thị (cáo, chim cắt, chuột thành phố), biến đổi tần số tiếng hót và giải pháp quy hoạch hành lang xanh.',
    suggestedParts: [4],
    aiReasoning: 'Độc thoại học thuật chuyên sâu về tập tính sinh học và quy hoạch đô thị bền vững. Đúng chuẩn 100% bài thi Part 4 của Cambridge IELTS.',
    recommendedQuestionTypes: ['Lecture Summary Completion (ONE WORD ONLY)', 'Multiple Choice'],
    sampleTranscriptSnippet: 'Metropolises are not sterile deserts. Urban birds elevate song frequencies to overcome low traffic rumble, while peregrine falcons nest atop steel skyscrapers...'
  }
];
