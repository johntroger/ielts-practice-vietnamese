/**
 * scripts/generate_gitbook_docs.js
 * Generates the entire GitBook documentation directory structure (docs/)
 * based on IELTS Master Theory Handbook and structured master guides.
 */

const fs = require('fs');
const path = require('path');
const { THEORY_HANDBOOK } = require('../src/data/theoryHandbook.js');

const DOCS_DIR = path.resolve(__dirname, '../docs');
const SECTIONS = ['writing', 'reading', 'listening', 'speaking'];

// Ensure target directories exist
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
SECTIONS.forEach(sec => {
  const dir = path.join(DOCS_DIR, sec);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to write file safely
function writeFile(relPath, content) {
  const fullPath = path.join(DOCS_DIR, relPath);
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// 1. Generate individual topic markdown files from THEORY_HANDBOOK
let count = 0;
THEORY_HANDBOOK.forEach(item => {
  const fileRelPath = path.join(item.skill, item.id + '.md');
  const fileContent = [
    '# ' + item.title,
    '',
    '> **Kỹ năng**: ' + item.skill.toUpperCase() + ' | **Chuyên mục**: ' + item.category,
    '> **Tóm tắt**: ' + item.summary,
    '',
    '---',
    '',
    item.content,
    '',
    '---',
    '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
  ].join('\n');

  writeFile(fileRelPath, fileContent);
  count++;
});
console.log('Successfully wrote ' + count + ' articles from THEORY_HANDBOOK into docs/');

// 2. Generate Dedicated Master Guides
// Writing Criteria Overview
writeFile('writing/criteria-overview.md', [
  '# 1. Tiêu Chí Chấm Điểm & Band Descriptors 2026 (Writing)',
  '',
  '> **Kỹ năng**: WRITING | **Chuyên mục**: General Strategy',
  '> **Tóm tắt**: Khảo cứu 4 tiêu chí chính thức của Cambridge IELTS: TR/TA, CC, LR, GRA và công thức bứt phá band điểm.',
  '',
  '---',
  '',
  '### Thang Điểm & Nguyên Tắc Tính Band',
  'Điểm IELTS Writing là trung bình cộng của 4 tiêu chí chính thức, chia đều 25% cho mỗi tiêu chí:',
  '1. **TR / TA (Task Response / Task Achievement)**: Trả lời đúng trọng tâm đề, đáp ứng đầy đủ yêu cầu bài thi.',
  '2. **CC (Coherence & Cohesion)**: Tính mạch lạc, logic của luận điểm và liên kết mượt mà giữa các đoạn / câu.',
  '3. **LR (Lexical Resource)**: Vốn từ vựng học thuật, độ chính xác của ngữ cảnh và Collocations tự nhiên.',
  '4. **GRA (Grammatical Range & Accuracy)**: Độ đa dạng của các cấu trúc câu (phức, ghép, đảo ngữ, bị động) và độ chính xác của ngữ pháp.',
  '',
  '*Quy tắc tính điểm tổng (Overall Writing)*:',
  '- 6.25 -> 6.5',
  '- 6.75 -> 7.0',
  '- 6.125 -> 6.0',
  '*Tỷ trọng*: Task 1 chiếm 1/3 điểm tổng, Task 2 chiếm 2/3 điểm tổng. Công thức: `Overall = (Task 1 + Task 2 * 2) / 3`.',
  '',
  '### Phân Bổ Thời Gian Vàng (60 Phút)',
  '- **Task 1 (20 Phút - Chiếm 1/3 tổng điểm)**:',
  '  - 3 phút: Đọc đề, phân tích trục/đơn vị/thì thời gian, xác định 2 đặc điểm nổi bật nhất cho Overview.',
  '  - 14 phút: Viết bài (Mở bài -> Overview -> 2 đoạn Thân bài chia nhóm logic).',
  '  - 3 phút: Kiểm tra lại số liệu, chính tả, chia động từ số ít/nhiều.',
  '- **Task 2 (40 Phút - Chiếm 2/3 tổng điểm)**:',
  '  - 5-7 phút: Phân tích kỹ yêu cầu đề, lập dàn ý (Outline: 2 luận điểm chính + ví dụ minh họa).',
  '  - 28-30 phút: Viết 4 đoạn hoàn chỉnh (Mở bài -> Thân bài 1 -> Thân bài 2 -> Kết bài).',
  '  - 3-5 phút: Rà soát lỗi mạo từ (a/an/the), danh từ đếm được/không đếm được, từ nối.',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Writing Task 1 Mastery
writeFile('writing/task1-mastery.md', [
  '# Master Chiến Lược Toàn Diện IELTS Writing Task 1',
  '',
  '> **Kỹ năng**: WRITING | **Chuyên mục**: Task 1 Master Guide',
  '> **Tóm tắt**: Hướng dẫn toàn diện giải quyết tất cả 7 dạng bài biểu đồ và hình vẽ Task 1 đạt chuẩn Band 7.5+.',
  '',
  '---',
  '',
  '## 1. Bản Đồ Phân Loại Dạng Bài',
  'Task 1 kiểm tra khả năng mô tả thông tin trực quan trong tối thiểu 150 từ (khuyến nghị 170-190 từ trong 20 phút):',
  '1. **Dynamic Charts (Biến thiên qua thời gian)**: Line Graph, Bar Chart thời gian, Table thời gian.',
  '2. **Static Charts (So sánh tĩnh tại 1 thời điểm)**: Pie Chart, Bar Chart tĩnh, Table tĩnh.',
  '3. **Processes (Quy trình sản xuất / Vòng đời tự nhiên)**: Luôn dùng thì hiện tại đơn & thể bị động.',
  '4. **Maps (Bản đồ quy hoạch / Thay đổi địa lý)**: Ngôn ngữ biến đổi không gian (demolished, erected, converted).',
  '5. **Mixed Charts (Biểu đồ kết hợp)**: Ví dụ Line + Bar hoặc Pie + Table.',
  '',
  '## 2. Bố Cục Chuẩn 4 Đoạn Bất Bại',
  '- **Đoạn 1: Introduction (1 câu)**: Paraphrase đề bài dùng các cấu trúc chuẩn mực:',
  '  - *"The line graph illustrates / compares the proportion of..."*',
  '  - *"The chart provides insights into..."*',
  '- **Đoạn 2: Overview (2 câu)**:',
  '  - Câu 1: Xu hướng tổng thể xuyên suốt (đối tượng nào tăng, giảm, ổn định).',
  '  - Câu 2: Đối tượng nắm giữ tỷ trọng cao nhất (highest/dominant) hoặc có biên độ biến động mạnh nhất.',
  '  - *Cảnh báo vàng*: Tuyệt đối không đưa số liệu chi tiết vào Overview!',
  '- **Đoạn 3: Body Paragraph 1 (Số liệu nhóm 1)**: Miêu tả xu hướng nhóm đối tượng 1 với số liệu khởi đầu và giữa kỳ.',
  '- **Đoạn 4: Body Paragraph 2 (Số liệu nhóm 2)**: Miêu tả nhóm đối tượng 2 và nêu bật các điểm giao cắt (crossovers) và số liệu kết thúc.',
  '',
  '## 3. Ngôn Ngữ Xấp Xỉ & Biến Động Số Liệu',
  '- **Tăng**: surge, soar, skyrocket, experience a remarkable upward trajectory.',
  '- **Giảm**: plunge, plummet, deteriorate, undergo a precipitous decline.',
  '- **Xấp xỉ**: roughly, approximately, just under, slightly in excess of, a negligible minority.',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Writing Task 2 PEEL Structure
writeFile('writing/task2-peel-structure.md', [
  '# Cấu Trúc Đoạn Văn PEEL & Dàn Bài Toàn Diện Task 2',
  '',
  '> **Kỹ năng**: WRITING | **Chuyên mục**: Task 2 Master Guide',
  '> **Tóm tắt**: Bí quyết xây dựng thân bài lập luận chặt chẽ đạt điểm tuyệt đối cho tiêu chí TR & CC.',
  '',
  '---',
  '',
  '## 1. Mô Hình PEEL Là Gì?',
  'PEEL là tiêu chuẩn vàng trong học thuật phương Tây giúp triển khai ý tưởng sâu sắc, không bị cộc lốc hay lan man:',
  '- **P - Point (Luận điểm cốt lõi)**: Câu chủ đề (Topic Sentence) nêu trực tiếp khía cạnh thảo luận.',
  '- **E - Explanation (Giải thích nguyên nhân - hệ quả)**: Phân tích sâu tại sao điều đó lại xảy ra bằng liên từ logic (This is primarily attributable to, consequently, thereby leading to).',
  '- **E - Example (Dẫn chứng cụ thể)**: Minh họa bằng ví dụ thực tiễn (A pertinent example is, for instance).',
  '- **L - Link (Câu kết nối / Chốt hạ)**: Khẳng định lại giá trị của luận điểm đối với câu hỏi của đề bài.',
  '',
  '## 2. Bố Cục 4 Đoạn Chuẩn Task 2 (40 Phút - 250+ từ)',
  '1. **Introduction (2 câu - 45 từ)**:',
  '   - Câu 1: Background Statement (Paraphrase đề bài).',
  '   - Câu 2: Thesis Statement (Tuyên ngôn luận điểm rõ ràng của người viết).',
  '2. **Body Paragraph 1 (PEEL - 90 từ)**: Thảo luận khía cạnh 1 hoặc phân tích quan điểm đối lập.',
  '3. **Body Paragraph 2 (PEEL - 90 từ)**: Thảo luận khía cạnh 2 hoặc bảo vệ quan điểm chính của bạn.',
  '4. **Conclusion (1-2 câu - 35 từ)**:',
  '   - Khẳng định lại Thesis Statement bằng từ vựng khác.',
  '   - Tuyệt đối không đưa ý tưởng mới vào phần kết bài.',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Writing Academic Hedging & Grammar 8.0+
writeFile('writing/academic-hedging.md', [
  '# Academic Hedging & Bộ Cấu Trúc Ngữ Pháp 8.0+',
  '',
  '> **Kỹ năng**: WRITING | **Chuyên mục**: Advanced GRA & Style',
  '> **Tóm tắt**: Kỹ thuật viết chừng mực (Hedging) tránh khẳng định tuyệt đối và các cấu trúc câu phức nâng cao.',
  '',
  '---',
  '',
  '## 1. Nghệ Thuật Viết Chừng Mực (Academic Hedging)',
  'Trong văn phong học thuật chuẩn quốc tế, không bao giờ khẳng định tuyệt đối 100% bằng các từ như all, always, every, definitely, never. Thay vào đó, hãy sử dụng **Hedging Devices**:',
  '- **Động từ khuyết thiếu**: tends to, appears to, might reasonably be expected to.',
  '- **Phó từ xác suất**: arguably, presumably, substantially, conceivably.',
  '- **Cụm từ khách quan**: *"There is compelling evidence to suggest that..."* thay vì *"Everyone knows that..."*.',
  '',
  '## 2. Bộ 4 Cấu Trúc Ngữ Pháp 8.0+ Đắt Giá',
  '1. **Đảo ngữ điều kiện (Inverted Conditionals)**:',
  '   - *Thay vì*: If governments had acted sooner, environmental degradation would be less severe.',
  '   - *8.0+*: **Had governments taken proactive measures earlier**, environmental degradation would be considerably less acute.',
  '2. **Danh từ hóa (Nominalization)**:',
  '   - *Thay vì*: Because people consume more fast food, obesity rates are rising rapidly.',
  '   - *8.0+*: **The escalated consumption of fast food** has directly catalyzed **a surge in obesity prevalence**.',
  '3. **Phân từ hoàn thành & Mệnh đề phân từ (Participle Clauses)**:',
  '   - *"Having realized the detrimental impact of fossil fuels, many nations are transitioning towards renewable alternatives."*',
  '4. **Cấu trúc Not only... but also đảo ngữ**:',
  '   - *"Not only does automation elevate productivity, but it also alleviates the physical burden on industrial laborers."*',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Reading Time Management
writeFile('reading/time-management.md', [
  '# Quản Trị Thời Gian Vàng 15 - 20 - 25 Phút (Reading)',
  '',
  '> **Kỹ năng**: READING | **Chuyên mục**: Time Management Strategy',
  '> **Tóm tắt**: Phân bổ áp suất thời gian 3 bài đọc khoa học và quy tắc 90 giây buông bỏ chiến thuật.',
  '',
  '---',
  '',
  '## 1. Ma Trận Thời Gian 15 - 20 - 25 Phút',
  'Tổng thời gian làm bài là 60 phút cho 40 câu hỏi trải dài trên 3 Passages với độ khó tăng dần:',
  '- **Passage 1 (15 Phút - Mục tiêu 12-13/13 câu)**:',
  '  - Chủ đề khoa học đại chúng hoặc đời sống, từ vựng dễ, thứ tự câu hỏi thẳng hàng.',
  '  - Phải làm nhanh để tích lũy thời gian cho Passage 3.',
  '- **Passage 2 (20 Phút - Mục tiêu 10-12/13 câu)**:',
  '  - Thường có dạng Matching Headings hoặc Matching Information. Đòi hỏi kỹ năng Skimming theo cụm đoạn.',
  '- **Passage 3 (25 Phút - Mục tiêu 9-11/14 câu)**:',
  '  - Chủ đề học thuật trừu tượng, quan điểm triết học/tâm lý học với nhiều từ chuyên ngành và câu phức nhiều tầng nghĩa.',
  '',
  '## 2. Quy Tắc 90 Giây & Nghệ Thuật Buông Bỏ',
  '- Không bao giờ dành quá 90 giây cho 1 câu hỏi đơn lẻ.',
  '- Nếu sau 90 giây không tìm thấy thông tin hoặc đang phân vân giữa 2 đáp án:',
  '  - Chọn đáp án có xác suất cao nhất.',
  '  - Đánh dấu ký hiệu chấm hỏi (?) lên đề thi.',
  '  - Tiếp tục tiến lên phía trước để không làm mất điểm của những câu dễ phía sau!',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Reading True / False / Not Given
writeFile('reading/true-false-not-given.md', [
  '# Phá Bẫy True / False / Not Given & Yes / No / Not Given',
  '',
  '> **Kỹ năng**: READING | **Chuyên mục**: Question Type Strategy',
  '> **Tóm tắt**: Bí kíp phân biệt ranh giới mong manh giữa False và Not Given với độ chính xác 100%.',
  '',
  '---',
  '',
  '## 1. Bản Chất Khác Biệt Giữa TFNG & YNNG',
  '- **True / False / Not Given**: Dựa trên **Facts (sự thật khách quan)** trong bài đọc.',
  '- **Yes / No / Not Given**: Dựa trên **Claims / Opinions (quan điểm, nhận định của tác giả)**.',
  '',
  '## 2. Định Nghĩa Chuẩn Xác Để Né Bẫy',
  '- **TRUE / YES**: Thông tin trong câu hỏi trùng khớp 100% với ý của bài đọc (được paraphrase).',
  '- **FALSE / NO**: Bài đọc đưa ra thông tin **mâu thuẫn trực tiếp (contradicts)** hoặc phủ định lại câu hỏi. Ta có thể dùng thông tin trong bài để sửa câu hỏi thành đúng.',
  '- **NOT GIVEN**: Bài đọc **không nhắc đến** hoặc chỉ nhắc đến một phần, không có đủ căn cứ để kết luận câu hỏi là đúng hay sai.',
  '',
  '## 3. Các Bẫy Kinh Điển Cần Nhận Diện Ngay',
  '1. **Bẫy Từ Hạn Định Tuyệt Đối (Absolutes vs Qualifiers)**:',
  '   - Đề bài: *all, always, impossible, completely*.',
  '   - Bài đọc: *most, often, difficult, partially*.',
  '   - => Kết quả: **FALSE** vì mức độ mâu thuẫn rõ rệt.',
  '2. **Bẫy So Sánh (Comparison Trap)**:',
  '   - Đề bài so sánh: *"X is more effective than Y."*',
  '   - Bài đọc chỉ nói: *"X is effective, and Y is also useful."* (không hề so sánh ai hơn ai).',
  '   - => Kết quả: **NOT GIVEN**!',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Reading Matching Headings
writeFile('reading/matching-headings.md', [
  '# Tuyệt Chiêu Xử Lý Matching Headings (Nối Tiêu Đề)',
  '',
  '> **Kỹ năng**: READING | **Chuyên mục**: Question Type Strategy',
  '> **Tóm tắt**: Chiến thuật Skimming ý chính đoạn văn, né bẫy trùng từ vựng và xử lý nhanh chóng.',
  '',
  '---',
  '',
  '## 1. Nguyên Tắc Sống Còn',
  '- **Luôn làm Matching Headings ĐẦU TIÊN** của Passage đó: Khi đọc hiểu cấu trúc các đoạn văn để nối tiêu đề, bạn đã vô tình nắm được vị trí thông tin để trả lời các câu hỏi chi tiết phía sau cực kỳ nhanh.',
  '- **Không tìm từ giống nhau (Word-matching Trap)**: Tiêu đề bẫy thường chứa nguyên vẹn từ vựng xuất hiện trong đoạn văn nhưng nội dung lại chỉ là một chi tiết phụ (minor detail) chứ không phải ý bao quát (main idea).',
  '',
  '## 2. Quy Trình 4 Bước Chuẩn Xác',
  '1. **Đọc lướt danh sách Headings**: Gạch chân từ khóa nội dung (Focus keywords) và các yếu tố hạn định.',
  '2. **Đọc câu đầu (Topic Sentence) và câu cuối của đoạn**: 70% các đoạn văn học thuật tuân theo lối diễn dịch (Deductive) hoặc quy nạp (Inductive).',
  '3. **Nếu đoạn văn có cấu trúc chuyển ý (Turnarounds)**: Chú ý các liên từ *However, Although, Yet, On the other hand*. Ý chính thực sự thường nằm sau các từ này!',
  '4. **Đối chiếu và loại trừ**: Loại bỏ ngay các tiêu đề đã chọn và cẩn thận với tiêu đề thừa (Distractors).',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Listening Distractor Traps
writeFile('listening/distractor-traps.md', [
  '# Bẫy Distractor & Đổi Ý Trong IELTS Listening',
  '',
  '> **Kỹ năng**: LISTENING | **Chuyên mục**: Listening Traps',
  '> **Tóm tắt**: Bắt bài các thủ thuật đổi hướng ý đồ (Correction & Self-correction) của người nói.',
  '',
  '---',
  '',
  '## 1. Cơ Chế Đặt Bẫy Của Người Bản Xứ',
  'Trong bài thi IELTS Listening, người nói rất hiếm khi đọc thẳng câu trả lời mà thường đưa ra một thông tin ban đầu, sau đó **bất ngờ đính chính lại**:',
  '- *"I\'d like to book the flight on Monday... oh wait, sorry, my schedule changed, let\'s make it Wednesday instead."*',
  '- Nếu bạn vội vã ghi ngay *Monday*, bạn đã rơi thẳng vào bẫy **Distractor**!',
  '',
  '## 2. Các Từ Tín Hiệu Báo Động (Warning Signposts)',
  'Hãy cảnh giác cao độ khi người nói phát ra các tín hiệu sau:',
  '- *Actually... / In fact...*',
  '- *Wait a second... / Hold on...*',
  '- *Sorry, I made a mistake...*',
  '- *I used to think that... but now...*',
  '- *No, on second thought...*',
  '',
  '## 3. Chiến Lược Phòng Thủ',
  '- Luôn giữ bút ở trạng thái sẵn sàng gạch bỏ thông tin đầu tiên nếu nghe thấy các từ tín hiệu trên.',
  '- Chỉ chốt đáp án vào bài làm khi câu chuyện đã di chuyển sang nội dung kế tiếp.',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Listening Spelling & Units
writeFile('listening/spelling-and-units.md', [
  '# Chính Tả, Con Số & Đơn Vị Đo Lường (Listening)',
  '',
  '> **Kỹ năng**: LISTENING | **Chuyên mục**: Part 1 & Foundation',
  '> **Tóm tắt**: Danh sách 80 từ sát thủ chính tả (Spelling Demons) và bẫy đơn vị tiền tệ, đo lường.',
  '',
  '---',
  '',
  '## 1. Quy Tắc Số & Đơn Vị',
  '- **Ký hiệu tiền tệ**: Viết trước số tiền ($50, £120, €75) hoặc viết sau chữ (50 dollars, 120 pounds). Nếu trên đề thi đã in sẵn ký hiệu $, bạn tuyệt đối **không được viết thêm** ký hiệu $ vào ô trả lời.',
  '- **Quy tắc số ít / số nhiều (-s)**: Mất điểm nhiều nhất trong Part 1 và Part 4. Nếu không nghe rõ âm đuôi, hãy căn cứ vào mạo từ `a/an` và động từ chia số ít/nhiều để suy luận!',
  '',
  '## 2. Top Từ Hay Sai Chính Tả Nhất',
  '- **Accommodate / Accommodation** (2 chữ c, 2 chữ m).',
  '- **Environment** (chú ý chữ n ở giữa).',
  '- **Government** (chú ý chữ n ở giữa).',
  '- **Separate** (chú ý s-e-p-a-r-a-t-e, không phải e ở giữa).',
  '- **Necessary** (1 chữ c, 2 chữ s).',
  '- **Questionnaire** (2 chữ n).',
  '- **Restaurant** (chú ý u-r-a-n-t).',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Listening Map & Signposting
writeFile('listening/map-and-signposting.md', [
  '# Bản Đồ Map Labelling & Tín Hiệu Chuyển Ý Signposting',
  '',
  '> **Kỹ năng**: LISTENING | **Chuyên mục**: Part 2 & Part 4',
  '> **Tóm tắt**: Ngôn ngữ không gian giải quyết bản đồ và kỹ năng bắt nhịp bài giảng học thuật.',
  '',
  '---',
  '',
  '## 1. Định Vị Không Gian Trong Map Labelling',
  'Trước khi băng chạy (thời gian chuẩn bị 30 giây):',
  '1. **Tìm điểm xuất phát (Starting Point)**: Thường là *Entrance, You are here, Reception, Main Gate*. Hãy đặt đầu bút chì ngay tại điểm đó!',
  '2. **Xác định hệ quy chiếu**:',
  '   - Nếu bản đồ có la bàn mũi tên `N - S - E - W`: Người nói sẽ dùng *North, South, East, West, North-East*.',
  '   - Nếu bản đồ không có la bàn: Người nói sẽ dùng phương hướng theo mắt nhìn: *Turn left, Turn right, On your left-hand side, Straight ahead, Opposite, Adjacent to*.',
  '',
  '## 2. Bắt Sóng Tín Hiệu Chuyển Ý (Signposting in Part 4)',
  'Part 4 là bài diễn thuyết học thuật không nghỉ giữa chừng. Hãy theo dõi bài giảng bằng các cột mốc:',
  '- **Mở đầu khía cạnh mới**: *"Now, let\'s turn our attention to...", "Moving on to the secondary factor..."*',
  '- **Đối lập / Ngoại lệ**: *"However, what surprised researchers was...", "Contrary to traditional beliefs..."*',
  '- **Minh họa ví dụ**: *"To illustrate this phenomenon...", "Take the case of..."*',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Speaking AREA Framework Part 1
writeFile('speaking/area-framework-part1.md', [
  '# Khung A.R.E.A - Trả Lời Tự Nhiên & Chuẩn Độ Dài Part 1',
  '',
  '> **Kỹ năng**: SPEAKING | **Chuyên mục**: Part 1 Strategy',
  '> **Tóm tắt**: Bí kíp trả lời tự nhiên từ 2-4 câu, không cộc lốc và không lan man lạc đề.',
  '',
  '---',
  '',
  '## 1. Công Thức Vàng A.R.E.A',
  'Nhiều thí sinh gặp lỗi trả lời quá ngắn (Yes/No cộc lốc) hoặc quá dài như một bài diễn thuyết nhỏ. Khung A.R.E.A chuẩn mực gồm:',
  '- **A - Answer**: Trả lời trực tiếp vào trọng tâm câu hỏi bằng cách paraphrase câu hỏi của giám khảo.',
  '- **R - Reason**: Nêu 1 nguyên nhân cốt lõi giải thích vì sao bạn lại cảm thấy như vậy.',
  '- **E - Example**: Đưa ra 1 ví dụ cụ thể về thói quen, trải nghiệm cá nhân gần đây.',
  '- **A - Alternative / Afterthought**: Một ý phụ mở rộng nhẹ hoặc câu chốt cảm xúc.',
  '',
  '## 2. Ví Dụ Mẫu Áp Dụng',
  '- **Examiner**: *"Do you prefer reading physical books or e-books?"*',
  '- **Candidate (A.R.E.A)**:',
  '  - *(Answer)*: "To be completely honest, I lean heavily towards **traditional paperbacks**."',
  '  - *(Reason)*: "There is something genuinely satisfying about the tactile feel of turning pages and the distinct scent of fresh paper, which digital screens simply cannot replicate."',
  '  - *(Example)*: "For instance, I recently finished a historical novel over the weekend, and doing so on a screen would have strained my eyes after hours of reading."',
  '  - *(Alternative)*: "Having said that, e-books are undeniably more convenient when I\'m traveling on the subway."',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Speaking Storytelling Part 2
writeFile('speaking/storytelling-part2.md', [
  '# Kỹ Thuật Storytelling Dòng Thời Gian PPF (Part 2)',
  '',
  '> **Kỹ năng**: SPEAKING | **Chuyên mục**: Part 2 Mastery',
  '> **Tóm tắt**: Tận dụng 1 phút ghi chú và kỹ thuật kể chuyện Past - Present - Future kéo dài 2 phút mượt mà.',
  '',
  '---',
  '',
  '## 1. Kỹ Thuật Dòng Thời Gian PPF (Past - Present - Future)',
  'Bí quyết giúp bài nói không bị tắc ý giữa chừng là mở rộng câu chuyện theo 3 mốc thời gian:',
  '1. **Past (Quá khứ - 45s)**: Hoàn cảnh khởi đầu, bạn đã biết đến đồ vật/người đó như thế nào, cảm xúc lần đầu tiên trải nghiệm.',
  '2. **Present (Hiện tại - 50s)**: Hiện nay mọi thứ như thế nào, bạn thường sử dụng/gặp gỡ họ ra sao và bài học/ảnh hưởng lớn nhất là gì.',
  '3. **Future (Tương lai - 25s)**: Dự định trong thời gian tới, bạn có ý định tiếp tục phát huy hoặc giới thiệu cho bạn bè hay không.',
  '',
  '## 2. Chiến Lược 1 Phút Chuẩn Bị',
  '- Không bao giờ viết thành câu hoàn chỉnh trên tờ giấy nháp!',
  '- Chỉ viết **từ khóa (keywords)** và **collocations đắt giá** theo sơ đồ dọc hoặc nhánh Mindmap để mắt có thể quét nhanh trong khi nói.',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Speaking Critical Thinking Part 3
writeFile('speaking/critical-thinking-part3.md', [
  '# Tư Duy Phản Biện & Ma Trận PEEL Trong Part 3',
  '',
  '> **Kỹ năng**: SPEAKING | **Chuyên mục**: Part 3 Advanced',
  '> **Tóm tắt**: Nâng tầm câu trả lời xã hội trừu tượng bằng góc nhìn đa chiều và lập luận học thuật.',
  '',
  '---',
  '',
  '## 1. Bản Chất Của Part 3',
  'Part 3 không hỏi về thói quen cá nhân của bạn nữa mà kiểm tra khả năng phân tích các vấn đề vĩ mô của xã hội:',
  '- Giáo dục, công nghệ, môi trường, chính sách công, sự thay đổi thế hệ.',
  '- **Không dùng câu chuyện cá nhân**: Tránh nói *"Me, my brother, my mom"*, hãy dùng các đối tượng vĩ mô: *citizens, younger generations, policymakers, working professionals*.',
  '',
  '## 2. Ma Trận Đa Chiều (Multi-Perspective Matrix)',
  'Khi gặp câu hỏi khó, hãy chia nhỏ vấn đề theo các cặp đối lập:',
  '- **Ngắn hạn vs Dài hạn (Short-term vs Long-term)**.',
  '- **Cá nhân vs Xã hội (Individual vs Collective level)**.',
  '- **Thế hệ trẻ vs Người cao tuổi (Demographic divide)**.',
  '- **Khu vực thành thị vs Nông thôn (Urban vs Rural areas)**.',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// Speaking Natural Fillers
writeFile('speaking/natural-fillers.md', [
  '# 50 Natural Fillers & Kỹ Thuật Câu Giờ Tự Nhiên',
  '',
  '> **Kỹ năng**: SPEAKING | **Chuyên mục**: Fluency & Coherence',
  '> **Tóm tắt**: Bí kíp duy trì độ trôi chảy (Fluency) khi cần suy nghĩ câu trả lời mà không bị giám khảo trừ điểm.',
  '',
  '---',
  '',
  '## 1. Tại Sao Lại Cần Natural Fillers?',
  'Khi gặp câu hỏi hóc búa, nếu im lặng quá 3 giây (dead air) hoặc phát ra các âm "uhm, ahh, er", điểm **Fluency & Coherence** sẽ bị kéo xuống dưới 6.0 ngay lập tức. Người bản xứ luôn sử dụng **Fillers** để vừa duy trì nhịp nói vừa có thêm 3-5 giây vàng để tổ chức ý tưởng!',
  '',
  '## 2. Bảng Cụm Từ Cứu Nguy Chia Theo Ngữ Cảnh',
  '### Khi Cần Khen Câu Hỏi & Mua Thời Gian (3-5 giây)',
  '- *"Well, to be quite frank, that\'s an intriguing question that I haven\'t really contemplated before..."*',
  '- *"That\'s a rather thought-provoking perspective, but if I had to pinpoint one main factor..."*',
  '- *"Off the top of my head, I\'d say that..."*',
  '',
  '### Khi Đang Tìm Từ Hoặc Muốn Paraphrase Lại',
  '- *"What I\'m trying to get at is that..."*',
  '- *"Or put it another way..."*',
  '- *"How should I phrase this... essentially..."*',
  '',
  '---',
  '*Tài liệu thuộc hệ thống Cẩm Nang Chiến Thuật IELTS Master (Đồng bộ trực tiếp qua GitHub & GitBook).*'
].join('\n'));

// 3. Generate docs/README.md
writeFile('README.md', [
  '# 📚 IELTS Master Handbook - Cẩm Nang Chiến Thuật Toàn Diện',
  '',
  'Chào mừng bạn đến với **IELTS Master Handbook** — Cẩm nang chiến thuật và lý thuyết luyện thi IELTS chuyên sâu, được biên soạn tỉ mỉ theo chuẩn khảo thí chính thức của **Cambridge Assessment English**, **British Council** và **IDP Education**.',
  '',
  'Tài liệu được thiết kế mở, tự động đồng bộ hóa thông qua **GitHub** và nền tảng **GitBook**, phục vụ miễn phí 100% cho cộng đồng người học IELTS tại Việt Nam.',
  '',
  '---',
  '',
  '## 🎯 Bản Đồ 4 Kỹ Năng Cốt Lõi',
  '',
  '| Kỹ Năng | Chuyên Đề Nổi Bật | Mục Tiêu Band |',
  '| :--- | :--- | :--- |',
  '| **✍️ Writing** | Overview Task 1, Mô hình PEEL Task 2, Academic Hedging, Collocations 8.0+ | **6.5 -> 8.5** |',
  '| **📖 Reading** | Quản trị thời gian 15-20-25m, True/False/Not Given, Matching Headings, Chunking 300+ WPM | **7.0 -> 9.0** |',
  '| **🎧 Listening** | Part 1-4 Protocols, Distractor Traps, Map Directions, CD-IELTS Hacks, Chép chính tả | **7.0 -> 9.0** |',
  '| **🗣️ Speaking** | Khung A.R.E.A Part 1, Storytelling PPF Part 2, Critical Thinking Part 3, 50 Natural Fillers | **6.5 -> 8.5** |',
  '',
  '---',
  '',
  '## 🚀 Tính Năng Nổi Bật',
  '',
  '- **Chuẩn Khảo Thí Cambridge**: Toàn bộ chiến thuật dựa trên Band Descriptors thực tế và phân tích đề thi Cambridge IELTS từ quyển 10 đến 19.',
  '- **Lộ Trình Bứt Phá Điểm Rõ Ràng**: Cung cấp các bài viết chuyên biệt hướng dẫn thí sinh vượt qua rào cản **Band 5.0 -> 6.5 -> 7.5+**.',
  '- **Đa Nền Tảng**: Đọc trực tiếp trên giao diện web của [Ứng Dụng Luyện Thi IELTS](https://ielts-practice-vietnamese.vercel.app/) thông qua tính năng Cẩm Nang Trực Tuyến, hoặc đọc trên cổng thông tin GitBook chuyên nghiệp.',
  '',
  '---',
  '',
  '## 🧭 Điều Hướng Nhanh',
  '',
  '- Bắt đầu với [Tiêu chí chấm điểm Writing](writing/criteria-overview.md)',
  '- Xem [Quản trị thời gian Reading](reading/time-management.md)',
  '- Nắm vững [Bẫy Distractor Listening](listening/distractor-traps.md)',
  '- Thực hành [Khung A.R.E.A Speaking](speaking/area-framework-part1.md)',
  '',
  '---',
  '*Biên soạn bởi Đội ngũ IELTS Practice Vietnamese. Mọi đóng góp xin gửi về repository GitHub chính thức.*'
].join('\n'));

// 4. Generate docs/SUMMARY.md (GitBook Table of Contents)
writeFile('SUMMARY.md', [
  '# Table of contents',
  '',
  '* [Giới thiệu](README.md)',
  '',
  '## ✍️ IELTS Writing',
  '* [1. Tiêu chí chấm điểm & Band Descriptors 2026](writing/criteria-overview.md)',
  '* [2. Master Chiến Lược Toàn Diện Task 1](writing/task1-mastery.md)',
  '* [3. Cấu Trúc Đoạn Văn PEEL & Dàn Bài Task 2](writing/task2-peel-structure.md)',
  '* [4. Academic Hedging & Bộ Cấu Trúc Ngữ Pháp 8.0+](writing/academic-hedging.md)',
  '* [5. Lộ trình nâng band Writing 5.0 lên 7.5+](writing/writing-progression-50-to-75.md)',
  '* [6. Task 1: Line Graph (Biểu Đồ Đường)](writing/task1-line-graph.md)',
  '* [7. Task 1: Bar Chart (Biểu Đồ Cột)](writing/task1-bar-chart.md)',
  '* [8. Task 1: Pie Chart (Biểu Đồ Tròn)](writing/task1-pie-chart.md)',
  '* [9. Task 1: Table (Bảng Số Liệu)](writing/task1-table.md)',
  '* [10. Task 1: Process (Quy Trình)](writing/task1-process.md)',
  '* [11. Task 1: Map (Bản Đồ)](writing/task1-map.md)',
  '* [12. Task 1: Mixed Chart (Biểu Đồ Kết Hợp)](writing/task1-mixed.md)',
  '* [13. Task 1: Ngôn ngữ biến động số liệu & Tỷ lệ xấp xỉ](writing/writing-task1-data-proportions.md)',
  '* [14. Task 1: Mốc thời gian dự báo tương lai](writing/writing-task1-future-projections.md)',
  '* [15. Task 2: Agree / Disagree](writing/task2-opinion.md)',
  '* [16. Task 2: Discuss Both Views](writing/task2-discussion.md)',
  '* [17. Task 2: Advantages vs Disadvantages](writing/task2-advantages-disadvantages.md)',
  '* [18. Task 2: Problem & Solution](writing/task2-problem-solution.md)',
  '* [19. Task 2: Two-Part Question](writing/task2-two-part.md)',
  '* [20. Task 2: Đoạn Phản Biện & Bác Bỏ (8.0+)](writing/writing-counter-argument-refutation.md)',
  '* [21. Task 2: 4 Cấu trúc ngữ pháp Band 8.0+](writing/writing-advanced-grammar-band8.md)',
  '* [22. Task 2: Top 60 Academic Collocations theo chủ đề](writing/writing-academic-collocations-topics.md)',
  '* [23. Task 2: Khung tìm ý tưởng PESTLE](writing/writing-ideation-pestle.md)',
  '* [24. Task 2: Tiêu chí CC 8.0+ Nghệ thuật liên kết ẩn](writing/writing-cc-thematic-progression.md)',
  '* [25. Task 2: 3 Công thức Paraphrase Mở bài & Thesis](writing/writing-paraphrase-thesis-intro.md)',
  '* [26. Checklist 10 lỗi sai dậm chân ở Band 5.5 - 6.0](writing/common-mistakes.md)',
  '* [27. Quy tắc dấu câu & Bẫy Comma Splice](writing/writing-punctuation-comma-splice.md)',
  '',
  '## 📖 IELTS Reading',
  '* [1. Quản Trị Thời Gian 15 - 20 - 25 Phút](reading/time-management.md)',
  '* [2. Phá Bẫy True / False / Not Given & Yes / No / Not Given](reading/true-false-not-given.md)',
  '* [3. Tuyệt Chiêu Xử Lý Matching Headings](reading/matching-headings.md)',
  '* [4. Chiến thuật cho Multiple Choice & Pick Multiple Options](reading/reading-multiple-choice.md)',
  '* [5. Matching Information & Matching Features](reading/reading-matching-info-features.md)',
  '* [6. Điền từ: Summary, Note, Table & Flow-chart](reading/reading-completion-forms.md)',
  '* [7. Summary Completion có khung từ chọn sẵn](reading/reading-summary-box-options.md)',
  '* [8. Diagram & Flow-Chart Labelling](reading/reading-diagram-flowchart.md)',
  '* [9. Bộ quy tắc Paraphrasing kinh điển](reading/reading-academic-paraphrasing.md)',
  '* [10. 50 Cặp từ Paraphrase lặp lại Cam 10-19](reading/reading-cambridge-synonym-lexicon.md)',
  '* [11. Đoán nghĩa từ qua gốc từ & ngữ cảnh](reading/reading-contextual-guessing-roots.md)',
  '* [12. Đọc phân cụm nghĩa Chunking (300+ từ/phút)](reading/reading-chunking-speed.md)',
  '* [13. Phân biệt ý kiến dẫn lại vs Quan điểm tác giả (Passage 3)](reading/reading-passage3-author-stance.md)',
  '* [14. Quy tắc 90 giây & Buông bỏ chiến thuật](reading/reading-strategic-time-management.md)',
  '* [15. Cấp cứu 5 phút cuối: Đoán mò có căn cứ khoa học](reading/reading-last-5-minutes-rescue.md)',
  '* [16. Lộ trình Reading từ Band 5.0 lên 7.5+](reading/reading-progression-50-to-75.md)',
  '',
  '## 🎧 IELTS Listening',
  '* [1. Bẫy Distractor & Đổi Ý Trong Listening](listening/distractor-traps.md)',
  '* [2. Chính Tả, Con Số & Đơn Vị Đo Lường](listening/spelling-and-units.md)',
  '* [3. Bản Đồ Map Labelling & Tín Hiệu Chuyển Ý Signposting](listening/map-and-signposting.md)',
  '* [4. Format thi Listening & Kỹ năng thi CD-IELTS](listening/listening-overview-format.md)',
  '* [5. Part 1: Bẫy đánh vần tên riêng, con số & mã bưu chính](listening/listening-part1-spelling-numbers.md)',
  '* [6. Part 2: Định hướng không gian & Bản đồ](listening/listening-part2-map-directions.md)',
  '* [7. Part 3: Trắc nghiệm học thuật & Bẫy đối kháng](listening/listening-part3-academic-discussion.md)',
  '* [8. Part 3: Cảm xúc, thái độ ngầm & mỉa mai](listening/listening-part3-tone-attitude-sarcasm.md)',
  '* [9. Part 4: Bắt tín hiệu chuyển ý bài giảng học thuật](listening/listening-part4-lecture-signposting.md)',
  '* [10. Cẩm nang âm học: Nối âm, Nuốt âm & Giảm âm](listening/listening-connected-speech-phonetics.md)',
  '* [11. Top 80 từ sát thủ dễ sai chính tả (Spelling Demons)](listening/listening-spelling-demons-100.md)',
  '* [12. Chiến thuật đoán số ít / số nhiều (-s)](listening/listening-plural-s-grammar-rule.md)',
  '* [13. Quy trình 30 giây đọc trước đề thi](listening/listening-pre-prediction-protocol.md)',
  '* [14. Phương pháp Chép chính tả & Nhại giọng (Shadowing)](listening/listening-dictation-shadowing-method.md)',
  '* [15. Cẩm nang nhận diện các giọng Accent địa phương](listening/listening-accents-guide.md)',
  '* [16. Lộ trình Listening từ Band 5.0 lên 7.5+](listening/listening-progression-50-to-75.md)',
  '',
  '## 🗣️ IELTS Speaking',
  '* [1. Khung A.R.E.A - Trả Lời Tự Nhiên Part 1](speaking/area-framework-part1.md)',
  '* [2. Kỹ Thuật Storytelling Dòng Thời Gian PPF (Part 2)](speaking/storytelling-part2.md)',
  '* [3. Tư Duy Phản Biện & Ma Trận PEEL Trong Part 3](speaking/critical-thinking-part3.md)',
  '* [4. 50 Natural Fillers & Kỹ Thuật Câu Giờ Tự Nhiên](speaking/natural-fillers.md)',
  '* [5. Bản đồ 4 tiêu chí chấm điểm Speaking & Làm tròn](speaking/speaking-criteria-descriptors.md)',
  '* [6. Tuyệt chiêu căn chuẩn nhịp độ 2 phút (Pacing)](speaking/speaking-part2-pacing-timing.md)',
  '* [7. 5 Câu chuyện mẫu vạn năng cho Part 2](speaking/speaking-5-universal-archetypes.md)',
  '* [8. Giữ giọng tự nhiên & Né bẫy học thuộc lòng](speaking/speaking-avoiding-memorization-trap.md)',
  '* [9. Ma trận khung trả lời so sánh đa chiều Part 3](speaking/speaking-part3-comparison-frameworks.md)',
  '* [10. Khắc phục lỗi âm đuôi, trọng âm & ngữ điệu](speaking/speaking-pronunciation-intonation.md)',
  '* [11. Tâm lý phòng thi & Khi bị giám khảo ngắt lời](speaking/speaking-examiner-interruption.md)',
  '* [12. Top 35+ thành ngữ Idiomatic tự nhiên Band 8.0+](speaking/speaking-idiomatic-lexicon-c1-c2.md)',
  '* [13. Lộ trình Speaking từ Band 5.0 lên 7.5+](speaking/speaking-progression-50-to-75.md)'
].join('\n'));

console.log('Successfully generated docs/README.md and docs/SUMMARY.md for GitBook!');
