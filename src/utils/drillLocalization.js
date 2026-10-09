/**
 * drillLocalization.js
 * Comprehensive bilingual localization utilities for IELTS Micro-Drills Studio.
 * Handles drill titles, categories, labels, and options for English and Vietnamese modes.
 */

const KNOWN_TITLE_MAP = {
  // Writing Drills
  'Giới từ miêu tả xu hướng và số liệu': 'Prepositions for Describing Trends & Data',
  'Giới từ miêu tả số liệu Task 1 (Prepositions of Data)': 'Task 1 Prepositions of Data',
  'Từ nối học thuật Task 2 (Advanced Cohesive Devices)': 'Task 2 Advanced Cohesive Devices',
  'Đọc hiểu & Kiểm tra số liệu biểu đồ Task 1 (Renewable Energy)': 'Task 1 Chart Reading & Data Verification (Renewable Energy)',
  'Luyện Paraphrase Mở Bài: Giáo dục & Nghề nghiệp': 'Introduction Paraphrase: Education & Careers',
  'Luyện Paraphrase Task 1: Câu mở bài biểu đồ đường': 'Task 1 Line Graph Introduction Paraphrase',
  'Luyện Paraphrase Mở Bài: AI & Việc làm': 'Introduction Paraphrase: AI & Employment',
  'Luyện Paraphrase Câu Thân Bài: Ô nhiễm môi trường': 'Body Paragraph Paraphrase: Environmental Pollution',
  'Luyện Paraphrase Task 1: Câu mở bài biểu đồ cột': 'Task 1 Bar Chart Introduction Paraphrase',
  'Luyện Paraphrase Câu Overview Task 1: Tăng trưởng & Dẫn đầu': 'Task 1 Overview Paraphrase: Growth & Dominance',
  'Luyện Paraphrase Câu Kết Bài Task 2: Giải pháp & Dự báo': 'Task 2 Conclusion Paraphrase: Solutions & Forecasts',
  'Sửa lỗi mạo từ & danh từ không đếm được': 'Error Spotting: Articles & Uncountable Nouns',
  'Sửa lỗi câu chắp vá (Run-on Sentence)': 'Error Spotting: Run-on Sentence & Comma Splices',
  'Sửa lỗi thì & từ vựng chỉ xu hướng sai trong đề Static': 'Error Spotting: Tense & Trend Verbs in Static Tasks',
  'Sửa lỗi hòa hợp Chủ ngữ - Vị ngữ phức tạp': 'Error Spotting: Complex Subject-Verb Agreement',
  'Collocation Học Thuật: Môi Trường & Năng Lượng': 'Academic Collocations: Environment & Energy',
  'Collocation Học Thuật: Công Nghệ & Trí Tuệ Nhân Tạo': 'Academic Collocations: Technology & Artificial Intelligence',

  // Community Drills
  'Từ nối lập luận: Trí tuệ nhân tạo & Lao động': 'Argumentative Transitions: AI & Labor',
  'Giới từ số liệu Task 1: Xu hướng đô thị hóa': 'Task 1 Data Prepositions: Urbanization Trends',
  'Phân tích số liệu biểu đồ Task 1: Năng lượng tái tạo': 'Task 1 Chart Analysis: Renewable Energy',
  'Viết lại câu mở bài Task 2: Giảm thải Carbon': 'Task 2 Introduction Paraphrase: Carbon Reduction',
  'Bẫy suy diễn Not Given vs False: AI trong chẩn đoán y khoa': 'Not Given vs False Trap: AI in Medical Diagnosis',

  // Reading Drills (Curated Dataset & Community)
  'Phân biệt bẫy Not Given vs False: Thụ phấn nhân tạo': 'Not Given vs False Trap: Artificial Pollination',
  'Phân biệt bẫy Not Given vs False: Khảo cổ học nền văn minh Maya': 'Not Given vs False Trap: Maya Civilization Archaeology',
  'Phân biệt bẫy Not Given vs True: Nhiệt độ đại dương sâu': 'Not Given vs True Trap: Deep-Sea Hydrothermal Temperatures',
  'Phân biệt bẫy Not Given vs False: Ngủ ngắn (Power Nap) & Năng suất': 'Not Given vs False Trap: Power Naps & Productivity',
  'Phân biệt bẫy Not Given vs False: Siêu cá heo & Sóng siêu âm': 'Not Given vs False Trap: Dolphin Echolocation',
  'Phân biệt bẫy Not Given vs True: Lớp băng vĩnh cửu tan chảy': 'Not Given vs True Trap: Permafrost Thawing',
  'Truy tìm Paraphrase: Năng lượng tái tạo & Chi phí sản xuất': 'Paraphrase Hunter: Renewable Energy & Production Costs',
  'Truy tìm Paraphrase: Trí nhớ & Giấc ngủ sâu': 'Paraphrase Hunter: Memory & Deep Sleep',
  'Truy tìm Paraphrase: Tác động biến đổi khí hậu lên đô thị ven biển': 'Paraphrase Hunter: Climate Change Impact on Coastal Cities',
  'Paraphrase Hunter: Trí nhớ & Giấc ngủ sâu': 'Paraphrase Hunter: Memory & Deep Sleep',
  'Paraphrase Hunter: Năng lượng tái tạo & Chi phí sản xuất': 'Paraphrase Hunter: Renewable Energy & Production Costs',
  'Paraphrase Hunter: Tác động biến đổi khí hậu lên đô thị ven biển': 'Paraphrase Hunter: Climate Change Impact on Coastal Cities',
  'Truy tìm Paraphrase: Trí tuệ nhân tạo & Y tế': 'Paraphrase Hunter: AI & Healthcare',
  'Truy tìm Paraphrase: Năng lượng tái tạo & Lưới điện': 'Paraphrase Hunter: Renewable Energy & Grid Integration',
  'Truy tìm Paraphrase: Quy hoạch đô thị & Thành phố 15 phút': 'Paraphrase Hunter: Urban Planning & 15-Minute Cities',
  'Truy tìm Paraphrase: Đa dạng sinh học đại dương sâu': 'Paraphrase Hunter: Deep-Sea Marine Biodiversity',
  'Phá bẫy Matching Headings: Hệ thống phòng thủ của rạn san hô': 'Matching Headings Trap: Coral Reef Defense Mechanisms',
  'Phá bẫy Matching Headings: Sự trỗi dậy của lao động từ xa': 'Matching Headings Trap: The Rise of Remote Work',
  'Phá bẫy Matching Headings: Đột phá công nghệ giao thông siêu tốc Hyperloop': 'Matching Headings Trap: Hyperloop High-Speed Transport',
  'Phá bẫy Matching Headings: Tâm lý học hành vi người tiêu dùng kỹ thuật số': 'Matching Headings Trap: Digital Consumer Behavior Psychology',
  'Phá bẫy Matching Headings: Tác động sinh thái của ngành dệt may thời trang nhanh': 'Matching Headings Trap: Ecological Impact of Fast Fashion',

  // General Core Foundation Drills
  'Đoán nghĩa từ: ephemeral': 'Context Vocab: ephemeral',
  'Đoán nghĩa từ: "ephemeral"': 'Context Vocab: "ephemeral"',
  'Đoán nghĩa từ: exacerbate': 'Context Vocab: exacerbate',
  'Đoán nghĩa từ: ubiquitous': 'Context Vocab: ubiquitous',
  'Đoán nghĩa từ: detrimental': 'Context Vocab: detrimental',
  'Đoán nghĩa từ: "obfuscate"': 'Context Vocab: "obfuscate"',
  'Giải phẫu câu phức: Tác động của đô thị hóa lên nguồn nước ngầm': 'Complex Sentence S-V-O: Impact of Urbanization on Groundwater',
  'Giải phẫu câu phức: Cơ chế tiến hóa của vi khuẩn kháng kháng sinh': 'Complex Sentence S-V-O: Evolutionary Mechanisms of Antibiotic-Resistant Bacteria',
  'Giải phẫu câu phức: Biến đổi khí hậu & Đa dạng sinh học': 'Complex Sentence S-V-O: Climate Change & Biodiversity',
  'Giải phẫu câu phức: Trí tuệ nhân tạo & Thị trường lao động': 'Complex Sentence S-V-O: AI & Labor Market Disruption',
  'Giải phẫu câu phức: Đô thị hóa & Giao thông công cộng': 'Complex Sentence S-V-O: Urbanization & Transit Infrastructure',

  // Listening Micro Drills
  'Dictation Cấp 1 (Cơ bản): Đăng ký thông tin lưu trú khách sạn': 'Dictation Level 1 (Basic): Hotel Accommodation Registration',
  'Dictation Cấp 1 (Cơ bản): Mượn tài liệu thư viện trường': 'Dictation Level 1 (Basic): University Library Borrowing',
  'Dictation Cấp 1 (Cơ bản): Lịch bảo dưỡng xe định kỳ': 'Dictation Level 1 (Basic): Periodic Vehicle Maintenance',
  'Dictation Cấp 2 (Thực chiến): Thảo luận về dự án bảo tồn nguồn nước': 'Dictation Level 2 (Combat): Water Conservation Project Discussion',
  'Dictation Cấp 2 (Thực chiến): Phân tích chiến lược phát triển đô thị': 'Dictation Level 2 (Combat): Urban Development Strategy Analysis',
  'Dictation Cấp 3 (Học thuật): Thuyết trình khảo cổ học thời kỳ đồ đồng': 'Dictation Level 3 (Academic): Bronze Age Archaeology Presentation',
  'Dictation Cấp 3 (Học thuật): Nghiên cứu tiến hóa hành vi linh trưởng': 'Dictation Level 3 (Academic): Primate Behavioral Evolution Study',
  'Đánh vần tên đường phố dễ nhầm lẫn (British Accent)': 'Street Name Spelling Traps (British Accent)',
  'Phân biệt đuôi -teen vs -ty và mã bưu chính (Postcode)': 'Distinguishing -teen vs -ty & UK Postcodes',
  'Ngày tháng & Số tiền có phí đặt cọc hoàn lại': 'Dates & Refundable Deposit Amounts',
  'Bẫy số lặp & Số không trong số điện thoại (Double numbers)': 'Double Numbers & Zero in Phone Numbers',
  'Đánh vần họ tên người Scotland / Ireland (Mac / Mc)': 'Scottish / Irish Surnames Spelling (Mac / Mc)',
  'Ngày thi khởi hành (Departure date & time)': 'Departure Date & Time Traps',
  'Bẫy tự đính chính (Self-Correction Trap): Thời gian khởi hành xe buýt': 'Self-Correction Trap: Bus Departure Time',
  'Bẫy phủ định ngầm (Implicit Negation): Đồ dùng được ban tổ chức chuẩn bị sẵn': 'Implicit Negation Trap: Equipment Provided by Organizers',
  'Bẫy Người thứ 2 phản bác (Disagreement Trap): Đề tài bài tập nhóm': 'Disagreement Trap: Group Project Topic',
  'Bẫy Quá khứ vs Hiện tại (Temporal Shift Trap): Cơ cấu tổ chức công ty': 'Temporal Shift Trap: Company Organization Structure',
  'Định hướng ngã ba & Lối rẽ: Tìm Phòng Hội Nghị Trung Tâm': 'T-Junction & Turn Navigation: Central Conference Room',
  'Định hướng La bàn & Vòng xuyến (Roundabout & Compass Points)': 'Compass Navigation & Roundabouts',
  'Tín hiệu Chuyển Luận Điểm: Từ bối cảnh lịch sử sang Nguyên nhân cốt lõi': 'Signposting: Context Shift to Root Causes',
  'Tín hiệu Phản biện & Bất ngờ (Contrasting & Counter-intuitive Evidence)': 'Signposting: Contrasting & Counter-intuitive Evidence',

  // Speaking Micro Drills
  'A.R.E.A Reflex 1: Nơi Ở - Căn Hộ hay Nhà Riêng?': 'A.R.E.A Reflex 1: Accommodation - Apartment or House?',
  'A.R.E.A Reflex 2: Thói Quen Đọc Sách': 'A.R.E.A Reflex 2: Reading Habits',
  'A.R.E.A Reflex 3: Học Tập Một Mình hay Theo Nhóm?': 'A.R.E.A Reflex 3: Studying Solo vs in Groups',
  'A.R.E.A Reflex 4: Nấu Ăn Tại Nhà': 'A.R.E.A Reflex 4: Home Cooking',
  'A.R.E.A Reflex 5: Trẻ Em Dùng Thiết Bị Điện Tử': 'A.R.E.A Reflex 5: Screen Time & Young Children',
  'Từ Đệm 1: Hồi Tưởng Sự Việc Trong Quá Khứ Xa Xôi': 'Filler 1: Recalling the Distant Past',
  'Từ Đệm 2: Suy Đoán Về Tương Lai Không Chắc Chắn': 'Filler 2: Speculating on Uncertain Future',
  'Từ Đệm 3: Thừa Nhận Một Thực Tế Ngược Đời / Khó Xử': 'Filler 3: Acknowledging an Irony or Awkward Truth',
  'Từ Đệm 4: Câu Hỏi Về Lĩnh Vực Bạn Không Rành Lắm': 'Filler 4: Talking About Unfamiliar Topics',
  'Idiom 1: Vui Mừng Tột Cùng Khi Nhận Tin Tốt': 'Idiom 1: Over the Moon with Good News',
  'Idiom 2: Giá Cả Quá Đắt Đỏ (Part 1/2)': 'Idiom 2: Cost an Arm and a Leg',
  'Idiom 3: Dậy Cực Kỳ Sớm Vào Buổi Sáng': 'Idiom 3: Up at the Crack of Dawn',
  'Idiom 4: Nạp Lại Năng Lượng Sau Chuỗi Ngày Mệt Mỏi': 'Idiom 4: Recharging Your Batteries',
  'Phản Biện Part 3: Công Nghệ Kết Nối hay Cô Lập Con Người?': 'Part 3 Rebuttal: Technology - Connecting or Isolating People?',
  'Phản Biện Part 3: Bảo Tồn Lịch Sử vs Phát Triển Đô Thị Hiện Đại': 'Part 3 Rebuttal: Historic Preservation vs Modern Urban Development'
};

const KNOWN_TOPIC_SUBTITLE_MAP = {
  'Trí nhớ & Giấc ngủ sâu': 'Memory & Deep Sleep',
  'Năng lượng tái tạo & Chi phí sản xuất': 'Renewable Energy & Production Costs',
  'Tác động biến đổi khí hậu lên đô thị ven biển': 'Climate Change Impact on Coastal Cities',
  'Hệ thống phòng thủ của rạn san hô': 'Coral Reef Defense Mechanisms',
  'Sự trỗi dậy của lao động từ xa': 'The Rise of Remote Work',
  'Thụ phấn nhân tạo': 'Artificial Pollination',
  'Khảo cổ học nền văn minh Maya': 'Maya Civilization Archaeology',
  'Nhiệt độ đại dương sâu': 'Deep-Sea Hydrothermal Temperatures',
  'Ngủ ngắn (Power Nap) & Năng suất': 'Power Naps & Productivity',
  'Tác động của đô thị hóa lên nguồn nước ngầm': 'Impact of Urbanization on Groundwater',
  'Cơ chế tiến hóa của vi khuẩn kháng kháng sinh': 'Evolutionary Mechanisms of Antibiotic-Resistant Bacteria',
  'Trí tuệ nhân tạo & Y tế': 'AI & Healthcare',
  'Năng lượng tái tạo & Lưới điện': 'Renewable Energy & Grid Integration',
  'Quy hoạch đô thị & Thành phố 15 phút': 'Urban Planning & 15-Minute Cities',
  'Đa dạng sinh học đại dương sâu': 'Deep-Sea Marine Biodiversity',
  'Đột phá công nghệ giao thông siêu tốc Hyperloop': 'Hyperloop High-Speed Transport',
  'Tâm lý học hành vi người tiêu dùng kỹ thuật số': 'Digital Consumer Behavior Psychology',
  'Tác động sinh thái của ngành dệt may thời trang nhanh': 'Ecological Impact of Fast Fashion',
  'Siêu cá heo & Sóng siêu âm': 'Dolphin Echolocation',
  'Lớp băng vĩnh cửu tan chảy': 'Permafrost Thawing',
  'Xu hướng đô thị hóa': 'Urbanization Trends',
  'Năng lượng tái tạo': 'Renewable Energy',
  'Giảm thải Carbon': 'Carbon Reduction',
  'AI trong chẩn đoán y khoa': 'AI in Medical Diagnosis',
  'Biến đổi khí hậu & Đa dạng sinh học': 'Climate Change & Biodiversity',
  'Trí tuệ nhân tạo & Thị trường lao động': 'AI & Labor Market Disruption',
  'Đô thị hóa & Giao thông công cộng': 'Urbanization & Transit Infrastructure',
  'Trí nhớ': 'Memory',
  'Giấc ngủ sâu': 'Deep Sleep',
  'Tác động xã hội của Vườn đô thị': 'Social Impact of Urban Gardens',
  'Tác động xã hội': 'Social Impact',
  'Vườn đô thị': 'Urban Gardens',

  // Listening Drill Topics
  'Dịch Vụ Thẻ Thành Viên': 'Membership Card Services',
  'Dịch vụ thẻ thành viên': 'Membership Card Services',
  'Thẻ thành viên': 'Membership Card',
  'Thẻ Thành Viên': 'Membership Card',
  'Dịch vụ khách hàng': 'Customer Service',
  'Dịch Vụ Khách Hàng': 'Customer Service',
  'Thủ tục sinh viên': 'Student Procedures',
  'Thủ Tục Sinh Viên': 'Student Procedures',
  'Đăng ký thông tin lưu trú khách sạn': 'Hotel Accommodation Registration',
  'Lưu trú khách sạn': 'Hotel Accommodation',
  'Mượn tài liệu thư viện trường': 'University Library Borrowing',
  'Mượn tài liệu thư viện': 'Library Book Borrowing',
  'Lịch bảo dưỡng xe định kỳ': 'Periodic Vehicle Maintenance',
  'Bảo dưỡng xe định kỳ': 'Periodic Vehicle Maintenance',
  'Thảo luận về dự án bảo tồn nguồn nước': 'Water Conservation Project Discussion',
  'Bảo tồn nguồn nước': 'Water Conservation',
  'Phân tích chiến lược phát triển đô thị': 'Urban Development Strategy Analysis',
  'Chiến lược phát triển đô thị': 'Urban Development Strategy',
  'Phát triển đô thị': 'Urban Development',
  'Thuyết trình khảo cổ học thời kỳ đồ đồng': 'Bronze Age Archaeology Presentation',
  'Khảo cổ học thời kỳ đồ đồng': 'Bronze Age Archaeology',
  'Thời kỳ đồ đồng': 'Bronze Age',
  'Nghiên cứu tiến hóa hành vi linh trưởng': 'Primate Behavioral Evolution Study',
  'Tiến hóa hành vi linh trưởng': 'Primate Behavioral Evolution',
  'Hành vi linh trưởng': 'Primate Behavior',
  'Tên đường phố dễ nhầm lẫn': 'Confusable Street Names',
  'Tên đường phố': 'Street Names',
  'Đuôi -teen vs -ty và mã bưu chính': 'Distinguishing -teen vs -ty & UK Postcodes',
  'Mã bưu chính': 'UK Postcodes',
  'Mã bưu điện': 'Postcodes',
  'Số điện thoại': 'Phone Numbers',
  'Ngày tháng & Số tiền có phí đặt cọc hoàn lại': 'Dates & Refundable Deposit Amounts',
  'Phí đặt cọc hoàn lại': 'Refundable Deposit Fee',
  'Số tiền đặt cọc': 'Deposit Amount',
  'Bẫy số lặp & Số không trong số điện thoại': 'Double Numbers & Zero in Phone Numbers',
  'Số lặp & Số không': 'Double Numbers & Zero',
  'Đánh vần họ tên người Scotland / Ireland': 'Scottish / Irish Surnames Spelling',
  'Ngày thi khởi hành': 'Departure Date & Time Traps',
  'Thời gian khởi hành xe buýt': 'Bus Departure Time',
  'Thời gian khởi hành': 'Departure Time',
  'Khởi hành xe buýt': 'Bus Departure',
  'Đồ dùng được ban tổ chức chuẩn bị sẵn': 'Equipment Provided by Organizers',
  'Ban tổ chức chuẩn bị sẵn': 'Equipment Provided by Organizers',
  'Ban tổ chức': 'Organizers',
  'Đề tài bài tập nhóm': 'Group Project Topic',
  'Bài tập nhóm': 'Group Project',
  'Cơ cấu tổ chức công ty': 'Company Organizational Structure',
  'Cơ cấu tổ chức': 'Company Organizational Structure',
  'Tìm Phòng Hội Nghị Trung Tâm': 'Locating Central Conference Room',
  'Phòng Hội Nghị Trung Tâm': 'Central Conference Room',
  'Phòng hội nghị trung tâm': 'Central Conference Room',
  'Phòng hội nghị': 'Conference Room',
  'Ngã ba & Lối rẽ': 'T-Junction & Turns',
  'La bàn & Vòng xuyến': 'Compass Navigation & Roundabouts',
  'Từ bối cảnh lịch sử sang Nguyên nhân cốt lõi': 'From Historical Context to Root Causes',
  'Bối cảnh lịch sử': 'Historical Context',
  'Nguyên nhân cốt lõi': 'Root Causes',
  'Phản biện & Bất ngờ': 'Contrasting & Counter-intuitive Evidence',
  'Quản lý chi tiêu sinh viên': 'Student Expense Management',
  'Quản lý rác thải nhựa': 'Plastic Waste Management'
};

const KNOWN_CATEGORY_MAP = {
  'Phòng Chung': 'General Studio',
  'Chuyên Writing': 'Writing Drills',
  'Chuyên Reading': 'Reading Drills',
  'Chuyên Listening': 'Listening Drills',
  'Chuyên Speaking': 'Speaking Drills',
  'Academic Reading Skills': 'Academic Reading Skills',
  'Cognitive Science': 'Cognitive Science',
  'Urban Planning': 'Urban Planning',
  'Marine Biology': 'Marine Biology',
  'Workplace & Sociology': 'Workplace & Sociology',
  'Core Academic Vocabulary': 'Core Academic Vocabulary',
  'Academic Discourse': 'Academic Discourse',
  'Academic Sentence Mastery': 'Academic Sentence Mastery',
  'Medical Science': 'Medical Science',
  'Science & Ecology': 'Science & Ecology',
  'History & Archaeology': 'History & Archaeology',
  'Environmental Science': 'Environmental Science',
  'Psychology & Physiology': 'Psychology & Physiology',
  'IELTS Reading Matching Headings': 'IELTS Reading Matching Headings',
  'Daily Conversation & Travel': 'Daily Conversation & Travel',
  'Campus Services': 'Campus Services',
  'Customer Service': 'Customer Service',
  'Academic Lecture & Archaeology': 'Academic Lecture & Archaeology',
  'Evolutionary Biology': 'Evolutionary Biology',
  'Personal Names & Addresses': 'Personal Names & Addresses',
  'Numbers & Postcodes': 'Numbers & Postcodes',
  'Dates & Currency': 'Dates & Currency',
  'Phone Numbers': 'Phone Numbers',
  'Personal Names': 'Personal Names',
  'Travel Schedule': 'Travel Schedule',
  'Transport Schedule': 'Transport Schedule',
  'Workshops & Equipment': 'Workshops & Equipment',
  'Academic Discussion': 'Academic Discussion',
  'Business & Management': 'Business & Management',
  'Campus & Facility Layout': 'Campus & Facility Layout',
  'Town & Park Navigation': 'Town & Park Navigation',
  'Academic Signposting (Part 4)': 'Academic Signposting (Part 4)',
  'Marine Biology Lecture': 'Marine Biology Lecture',
  'Chép chính tả': 'Dictation Practice',
  'Đánh vần & Con số': 'Spelling & Numbers',
  'Bẫy nhiễu nghe hiểu': 'Distractor Traps',
  'Bản đồ & Định hướng': 'Maps & Directions',
  'Tín hiệu chuyển đoạn': 'Signposting Signals',
  'Dịch vụ & Đời sống': 'Daily Life & Services',
  'Thủ tục sinh viên': 'Student Procedures',
  'Giao thông công cộng': 'Public Transport',
  'Mở Rộng Ý A.R.E.A': 'A.R.E.A Expansion',
  'Từ Đệm Tự Nhiên': 'Natural Fillers',
  'Collocations Tự Nhiên': 'Natural Collocations',
  'Phản Biện Đa Chiều Part 3': 'Part 3 Two-Sided Debate'
};

/**
 * Returns localized drill title based on the active language mode.
 * @param {Object} drill - The drill object
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized title
 */
export function getLocalizedDrillTitle(drill, isEn = false) {
  if (!drill) return '';
  if (!isEn) return drill.title || '';

  // 1. If explicit English title provided in data
  if (drill.titleEn) return drill.titleEn;

  const rawTitle = drill.title || '';

  // Check prefix for Community / AI generated tags
  const isCommunityTagged = rawTitle.includes('[AI Cộng Đồng]') || rawTitle.includes('[AI Community]');
  const isAiTagged = rawTitle.includes('[AI]');
  let cleanTitle = rawTitle
    .replace(/✨\s*\[AI Cộng Đồng\]\s*/i, '')
    .replace(/✨\s*\[AI Community\]\s*/i, '')
    .replace(/\[AI\]\s*/i, '')
    .trim();

  // 2. Direct dictionary match
  if (KNOWN_TITLE_MAP[cleanTitle]) {
    const matched = KNOWN_TITLE_MAP[cleanTitle];
    if (isCommunityTagged) return `✨ [AI Community] ${matched}`;
    if (isAiTagged) return `[AI] ${matched}`;
    return matched;
  }
  if (KNOWN_TITLE_MAP[rawTitle]) {
    return KNOWN_TITLE_MAP[rawTitle];
  }

  // Subtitle topic translator helper
  const translateTopicSubtitle = (sub) => {
    if (!sub) return '';
    let s = sub.trim();
    if (KNOWN_TOPIC_SUBTITLE_MAP[s]) return KNOWN_TOPIC_SUBTITLE_MAP[s];

    const topicPhrases = [
      [/Tác động xã hội của Vườn đô thị/gi, 'Social Impact of Urban Gardens'],
      [/Tác động xã hội/gi, 'Social Impact'],
      [/Tác động kinh tế/gi, 'Economic Impact'],
      [/Tác động môi trường/gi, 'Environmental Impact'],
      [/Tác động sinh thái/gi, 'Ecological Impact'],
      [/Vườn đô thị/gi, 'Urban Gardens'],
      [/nông nghiệp đô thị/gi, 'Urban Agriculture'],
      [/không gian xanh/gi, 'Green Spaces'],
      [/gắn kết cộng đồng/gi, 'Community Cohesion'],
      [/gắn kết xã hội/gi, 'Social Cohesion'],
      [/sức khỏe tinh thần/gi, 'Mental Health'],
      [/biến đổi khí hậu/gi, 'Climate Change'],
      [/năng lượng tái tạo/gi, 'Renewable Energy'],
      [/trí tuệ nhân tạo/gi, 'Artificial Intelligence'],
      [/lao động từ xa/gi, 'Remote Work'],
      [/giao thông công cộng/gi, 'Public Transit'],
      [/đa dạng sinh học/gi, 'Biodiversity'],
      [/bảo tồn thiên nhiên/gi, 'Nature Conservation'],
      [/phát triển bền vững/gi, 'Sustainable Development'],
      [/đô thị hóa/gi, 'Urbanization'],
      [/ngành dệt may/gi, 'Textile Industry'],
      [/thời trang nhanh/gi, 'Fast Fashion'],
      [/kinh tế tuần hoàn/gi, 'Circular Economy'],
      [/chất lượng không khí/gi, 'Air Quality'],
      [/ô nhiễm nguồn nước/gi, 'Water Pollution'],
      [/rác thải nhựa/gi, 'Plastic Waste'],
      [/giáo dục đại học/gi, 'Higher Education'],
      [/học tập trực tuyến/gi, 'Online Learning'],
      [/chuyển đổi số/gi, 'Digital Transformation'],
      [/bảo mật thông tin/gi, 'Cybersecurity'],
      [/lịch sử và văn hóa/gi, 'History & Culture'],
      [/di sản văn hóa/gi, 'Cultural Heritage'],

      // Listening Phrases
      [/dịch vụ thẻ thành viên/gi, 'Membership Card Services'],
      [/thẻ thành viên/gi, 'Membership Card'],
      [/dịch vụ khách hàng/gi, 'Customer Service'],
      [/thủ tục sinh viên/gi, 'Student Procedures'],
      [/đăng ký thông tin lưu trú khách sạn/gi, 'Hotel Accommodation Registration'],
      [/lưu trú khách sạn/gi, 'Hotel Accommodation'],
      [/mượn tài liệu thư viện trường/gi, 'University Library Borrowing'],
      [/mượn tài liệu thư viện/gi, 'Library Book Borrowing'],
      [/lịch bảo dưỡng xe định kỳ/gi, 'Periodic Vehicle Maintenance'],
      [/bảo dưỡng xe định kỳ/gi, 'Periodic Vehicle Maintenance'],
      [/thảo luận về dự án bảo tồn nguồn nước/gi, 'Water Conservation Project Discussion'],
      [/bảo tồn nguồn nước/gi, 'Water Conservation'],
      [/phân tích chiến lược phát triển đô thị/gi, 'Urban Development Strategy Analysis'],
      [/chiến lược phát triển đô thị/gi, 'Urban Development Strategy'],
      [/phát triển đô thị/gi, 'Urban Development'],
      [/thuyết trình khảo cổ học thời kỳ đồ đồng/gi, 'Bronze Age Archaeology Presentation'],
      [/khảo cổ học thời kỳ đồ đồng/gi, 'Bronze Age Archaeology'],
      [/thời kỳ đồ đồng/gi, 'Bronze Age'],
      [/nghiên cứu tiến hóa hành vi linh trưởng/gi, 'Primate Behavioral Evolution Study'],
      [/tiến hóa hành vi linh trưởng/gi, 'Primate Behavioral Evolution'],
      [/hành vi linh trưởng/gi, 'Primate Behavior'],
      [/tên đường phố dễ nhầm lẫn/gi, 'Confusable Street Names'],
      [/tên đường phố/gi, 'Street Names'],
      [/đuôi -teen vs -ty và mã bưu chính/gi, 'Distinguishing -teen vs -ty & UK Postcodes'],
      [/mã bưu chính/gi, 'UK Postcodes'],
      [/mã bưu điện/gi, 'Postcodes'],
      [/số điện thoại/gi, 'Phone Numbers'],
      [/ngày tháng & số tiền có phí đặt cọc hoàn lại/gi, 'Dates & Refundable Deposit Amounts'],
      [/phí đặt cọc hoàn lại/gi, 'Refundable Deposit Fee'],
      [/số tiền đặt cọc/gi, 'Deposit Amount'],
      [/bẫy số lặp & số không trong số điện thoại/gi, 'Double Numbers & Zero in Phone Numbers'],
      [/số lặp & số không/gi, 'Double Numbers & Zero'],
      [/đánh vần họ tên người Scotland \/ Ireland/gi, 'Scottish / Irish Surnames Spelling'],
      [/ngày thi khởi hành/gi, 'Departure Date & Time Traps'],
      [/thời gian khởi hành xe buýt/gi, 'Bus Departure Time'],
      [/thời gian khởi hành/gi, 'Departure Time'],
      [/khởi hành xe buýt/gi, 'Bus Departure'],
      [/đồ dùng được ban tổ chức chuẩn bị sẵn/gi, 'Equipment Provided by Organizers'],
      [/ban tổ chức chuẩn bị sẵn/gi, 'Equipment Provided by Organizers'],
      [/ban tổ chức/gi, 'Organizers'],
      [/đề tài bài tập nhóm/gi, 'Group Project Topic'],
      [/bài tập nhóm/gi, 'Group Project'],
      [/cơ cấu tổ chức công ty/gi, 'Company Organizational Structure'],
      [/cơ cấu tổ chức/gi, 'Company Organizational Structure'],
      [/tìm phòng hội nghị trung tâm/gi, 'Locating Central Conference Room'],
      [/phòng hội nghị trung tâm/gi, 'Central Conference Room'],
      [/phòng hội nghị/gi, 'Conference Room'],
      [/ngã ba & lối rẽ/gi, 'T-Junction & Turns'],
      [/ngã ba/gi, 'T-Junction'],
      [/lối rẽ/gi, 'Turns'],
      [/la bàn & vòng xuyến/gi, 'Compass Navigation & Roundabouts'],
      [/vòng xuyến/gi, 'Roundabouts'],
      [/từ bối cảnh lịch sử sang nguyên nhân cốt lõi/gi, 'From Historical Context to Root Causes'],
      [/từ bối cảnh lịch sử sang/gi, 'From Historical Context to'],
      [/nguyên nhân cốt lõi/gi, 'Root Causes'],
      [/bối cảnh lịch sử/gi, 'Historical Context'],
      [/phản biện & bất ngờ/gi, 'Contrasting & Counter-intuitive Evidence'],
      [/quản lý chi tiêu sinh viên/gi, 'Student Expense Management'],
      [/quản lý rác thải nhựa/gi, 'Plastic Waste Management'],
      [/quản lý tài chính/gi, 'Financial Management'],
      [/đối diện/gi, 'opposite'],
      [/phía bắc/gi, 'North'],
      [/phía nam/gi, 'South'],
      [/phía đông/gi, 'East'],
      [/phía tây/gi, 'West'],

      // Dynamic Listening Topics from Tests & Community
      [/công viên\s+bách thảo\s+([A-Za-z0-9\s]+)/gi, '$1 Botanical Park'],
      [/công viên\s+bách thảo/gi, 'Botanical Park'],
      [/công viên\s+bờ sông/gi, 'Riverside Waterfront Park'],
      [/công viên\s+trung tâm/gi, 'Central Park'],
      [/công viên\s+([A-Za-z0-9\s]+)/gi, '$1 Park'],
      [/công viên/gi, 'Park'],
      [/đặt phòng họp sự kiện/gi, 'Event Meeting Room Booking'],
      [/đặt phòng họp công ty/gi, 'Corporate Meeting Room Booking'],
      [/đặt phòng hội thảo/gi, 'Seminar Room Booking'],
      [/đặt phòng họp/gi, 'Meeting Room Booking'],
      [/đặt phòng/gi, 'Room Booking'],
      [/đặt bàn nhà hàng/gi, 'Restaurant Table Reservation'],
      [/đặt bàn/gi, 'Table Reservation'],
      [/đặt lịch sân thể thao/gi, 'Sports Field Booking'],
      [/đặt lịch/gi, 'Booking Schedule'],
      [/thay đổi lịch hẹn dịch vụ/gi, 'Service Appointment Rescheduling'],
      [/thay đổi lịch hẹn/gi, 'Appointment Rescheduling'],
      [/lịch hẹn dịch vụ/gi, 'Service Appointment'],
      [/giờ học yoga for người mới bắt đầu/gi, 'Beginner Yoga Class Schedule'],
      [/giờ học yoga/gi, 'Yoga Class Schedule'],
      [/giờ học/gi, 'Class Schedule'],
      [/phí hội viên trung tâm thể thao/gi, 'Sports Center Membership Fee'],
      [/phí hội viên/gi, 'Membership Fee'],
      [/trung tâm thể thao/gi, 'Sports Center'],
      [/đăng ký tour tham quan miễn phí/gi, 'Free Guided Tour Registration'],
      [/tour tham quan miễn phí/gi, 'Free Guided Tour'],
      [/tour tham quan/gi, 'Guided Tour'],
      [/tham quan miễn phí/gi, 'Free Tour'],
      [/đăng ký thẻ thư viện công cộng/gi, 'Public Library Card Registration'],
      [/gia hạn thẻ thư viện/gi, 'Library Card Renewal'],
      [/thẻ thư viện công cộng/gi, 'Public Library Card'],
      [/thẻ thư viện/gi, 'Library Card'],
      [/gia hạn/gi, 'Renewal'],
      [/đăng ký khóa học cộng đồng/gi, 'Community Course Registration'],
      [/đăng ký khóa học/gi, 'Course Registration'],
      [/khóa học cộng đồng/gi, 'Community Course'],
      [/khóa học/gi, 'Course'],
      [/vi khí hậu đô thị & hiệu ứng đảo nhiệt/gi, 'Urban Microclimate & Urban Heat Island Effect'],
      [/hiệu ứng đảo nhiệt/gi, 'Urban Heat Island Effect'],
      [/nghiên cứu vi khí hậu đô thị/gi, 'Urban Microclimate Research'],
      [/vi khí hậu đô thị/gi, 'Urban Microclimate'],
      [/vi khí hậu/gi, 'Microclimate'],
      [/kinh tế học urban agriculture/gi, 'Economics of Urban Agriculture'],
      [/kinh tế học/gi, 'Economics of'],
      [/sinh vật học biển/gi, 'Marine Biology'],
      [/sinh thái học đại dương/gi, 'Marine Ecology'],
      [/hiện tượng sinh học biển/gi, 'Marine Biological Phenomena'],
      [/tác động của green spaces đô thị/gi, 'Impact of Urban Green Spaces'],
      [/tác động of hạ tầng xanh/gi, 'Impact of Green Infrastructure'],
      [/tác động của hạ tầng xanh/gi, 'Impact of Green Infrastructure'],
      [/hạ tầng xanh/gi, 'Green Infrastructure'],
      [/urbanization và kiến trúc xanh/gi, 'Urbanization & Green Architecture'],
      [/kiến trúc xanh/gi, 'Green Architecture'],
      [/cơ chế lưu trữ trí nhớ/gi, 'Memory Storage Mechanisms'],
      [/lưu trữ trí nhớ/gi, 'Memory Storage'],
      [/khảo cổ học & tuyến thương mại cổ đại/gi, 'Archaeology & Ancient Trade Routes'],
      [/tuyến thương mại cổ đại/gi, 'Ancient Trade Routes'],
      [/tuyến thương mại/gi, 'Trade Routes'],
      [/cổ đại/gi, 'Ancient'],
      [/tên đường & uk postcodes/gi, 'Street Names & UK Postcodes'],
      [/tên đường & tự sửa lỗi/gi, 'Street Names & Self-Correction'],
      [/tên đường/gi, 'Street Names'],
      [/tự sửa lỗi/gi, 'Self-Correction'],
      [/bẫy tự sửa lỗi/gi, 'Self-Correction Trap'],
      [/bẫy sửa miệng/gi, 'Self-Correction Trap'],
      [/sửa miệng/gi, 'Self-Correction'],
      [/họ khách hàng xuất hóa đơn/gi, 'Customer Surname for Invoicing'],
      [/khách hàng xuất hóa đơn/gi, 'Invoicing Customer'],
      [/xuất hóa đơn/gi, 'Invoicing'],
      [/tên họ & bẫy tự sửa lỗi/gi, 'Full Name & Self-Correction Trap'],
      [/tên họ/gi, 'Full Names'],
      [/họ người & bẫy tự đính chính/gi, 'Surname Spelling & Self-Correction Trap'],
      [/họ người/gi, 'Surnames'],
      [/bẫy tự đính chính/gi, 'Self-Correction Trap'],
      [/tự đính chính/gi, 'Self-Correction'],
      [/cho người mới bắt đầu/gi, 'for Beginners'],
      [/người mới bắt đầu/gi, 'Beginners'],
      [/nghiên cứu/gi, 'Research on'],

      [/\bcủa\b/gi, 'of'],
      [/\bvà\b/gi, '&'],
      [/\btrong\b/gi, 'in'],
      [/\bcho\b/gi, 'for'],
      [/\bvới\b/gi, 'with'],
      [/\btại\b/gi, 'at']
    ];

    for (const [pattern, repl] of topicPhrases) {
      s = s.replace(pattern, repl);
    }

    for (const [k, v] of Object.entries(KNOWN_TOPIC_SUBTITLE_MAP)) {
      if (s.includes(k)) {
        s = s.replace(new RegExp(k, 'g'), v);
      }
    }
    return s.trim();
  };

  const translatePrefix = (p) => {
    if (!p) return '';
    const cleanP = p.trim();
    const map = {
      'Dictation Cấp 1 (Cơ bản)': 'Dictation Level 1 (Basic)',
      'Dictation Cấp 2 (Thực chiến)': 'Dictation Level 2 (Combat)',
      'Dictation Cấp 3 (Học thuật)': 'Dictation Level 3 (Academic)',
      'Dictation Cấp 1': 'Dictation Level 1',
      'Dictation Cấp 2': 'Dictation Level 2',
      'Dictation Cấp 3': 'Dictation Level 3',
      'Dictation Thực Chiến': 'Combat Dictation',
      'Combat Dictation': 'Combat Dictation',
      'Dictation Cơ Bản': 'Basic Dictation',
      'Basic Dictation': 'Basic Dictation',
      'Dictation Học Thuật': 'Academic Dictation',
      'Academic Dictation': 'Academic Dictation',
      'Dictation Nâng Cao': 'Advanced Dictation',
      'Advanced Dictation': 'Advanced Dictation',
      'Dictation': 'Dictation',
      'Chép chính tả': 'Dictation',
      'Đánh vần tên riêng & Mã bưu chính UK': 'Proper Names & Postcodes',
      'Đánh vần tên riêng & Mã bưu chính': 'Proper Names & Postcodes',
      'Đánh vần & Con số': 'Spelling & Numbers',
      'Đánh vần': 'Spelling',
      'Spelling': 'Spelling',
      'Bẫy tự đính chính (Self-Correction Trap)': 'Self-Correction Trap',
      'Bẫy tự đính chính': 'Self-Correction Trap',
      'Bẫy sửa miệng (Self-Correction Trap)': 'Self-Correction Trap',
      'Bẫy sửa miệng': 'Self-Correction Trap',
      'Self-Correction Trap': 'Self-Correction Trap',
      'Self-correction': 'Self-Correction Trap',
      'Bẫy phủ định ngầm (Implicit Negation)': 'Implicit Negation Trap',
      'Bẫy phủ định ngầm': 'Implicit Negation Trap',
      'Implicit Negation Trap': 'Implicit Negation Trap',
      'Bẫy Người thứ 2 phản bác (Disagreement Trap)': 'Disagreement Trap',
      'Bẫy Người thứ 2 phản bác': 'Disagreement Trap',
      'Disagreement Trap': 'Disagreement Trap',
      'Bẫy Quá khứ vs Hiện tại (Temporal Shift Trap)': 'Temporal Shift Trap',
      'Bẫy Quá khứ vs Hiện tại': 'Temporal Shift Trap',
      'Temporal Shift Trap': 'Temporal Shift Trap',
      'Bẫy đổi ý': 'Mind-Change Distractor Trap',
      'Bẫy gây nhiễu': 'Distractor Trap',
      'Phá bẫy đổi ý': 'Mind-Change Distractor Hunter',
      'Định hướng ngã ba & Lối rẽ': 'T-Junction & Turn Navigation',
      'Định hướng La bàn & Vòng xuyến': 'Compass Navigation & Roundabouts',
      'Định hướng sơ đồ': 'Map Navigation',
      'Định hướng bản đồ': 'Map Navigation',
      'Map Navigation': 'Map Navigation',
      'Bản đồ & Định hướng': 'Maps & Directions',
      'Bản đồ & Hướng đi': 'Maps & Directions',
      'Maps & Directions': 'Maps & Directions',
      'Tín hiệu Chuyển Luận Điểm': 'Signposting Shift',
      'Tín hiệu Phản biện & Bất ngờ': 'Signposting Contrast',
      'Bắt tín hiệu chuyển ý': 'Signposting Catcher',
      'Bắt tín hiệu': 'Signposting Catcher',
      'Signposting Catcher': 'Signposting Catcher',
      'Tín hiệu chuyển đoạn': 'Signposting Signals',
      'Từ nối lập luận': 'Argumentative Transitions',
      'Phân biệt bẫy Not Given vs False': 'Not Given vs False Trap',
      'Phân biệt bẫy Not Given vs True': 'Not Given vs True Trap',
      'Bẫy suy diễn Not Given vs False': 'Not Given vs False Trap',
      'Truy tìm Paraphrase': 'Paraphrase Hunter',
      'Phá bẫy Matching Headings': 'Matching Headings Trap',
      'Giải phẫu câu phức': 'Complex Sentence S-V-O',
      'Sửa lỗi': 'Error Spotting',
      'Luyện Paraphrase': 'Paraphrase Drill',
      'Collocation Học Thuật': 'Academic Collocations',
      'A.R.E.A Mở rộng ý': 'A.R.E.A Expansion',
      'Phản biện Part 3': 'Part 3 Rebuttal'
    };
    if (map[cleanP]) return map[cleanP];
    return translateTopicSubtitle(cleanP);
  };

  // 3. Pattern / Regex-based translations for dynamic drills
  if (/^Giới từ miêu tả xu hướng/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + 'Prepositions for Describing Trends & Data';
  }
  if (/^Giới từ miêu tả số liệu/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + 'Task 1 Prepositions of Data';
  }
  if (/^Từ nối học thuật/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + 'Task 2 Advanced Cohesive Devices';
  }
  if (/^Từ nối lập luận:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Argumentative Transitions: ${translateTopicSubtitle(RegExp.$1)}`;
  }
  if (/^(Phân biệt bẫy Not Given vs False|Not Given vs False Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Not Given vs False Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Phân biệt bẫy Not Given vs True|Not Given vs True Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Not Given vs True Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^Bẫy suy diễn Not Given vs False:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Not Given vs False Trap: ${translateTopicSubtitle(RegExp.$1)}`;
  }
  if (/^(Truy tìm Paraphrase|Paraphrase Hunter):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Paraphrase Hunter: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Phá bẫy Matching Headings|Matching Headings Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Matching Headings Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Đoán nghĩa từ|Context Vocab):\s*(.*)/i.test(cleanTitle)) {
    return `Context Vocab: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Giải phẫu câu phức|Complex Sentence S-V-O):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Complex Sentence S-V-O: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^Sửa lỗi\s*(.*)/i.test(cleanTitle)) {
    return `Error Spotting: ${translateTopicSubtitle(RegExp.$1)}`;
  }
  if (/^Luyện Paraphrase\s*(.*)/i.test(cleanTitle)) {
    return `Paraphrase Drill: ${translateTopicSubtitle(RegExp.$1)}`;
  }
  if (/^Collocation Học Thuật:\s*(.*)/i.test(cleanTitle)) {
    return `Academic Collocations: ${translateTopicSubtitle(RegExp.$1)}`;
  }

  // Listening Specific Regex Patterns
  if (/^(Dictation Cấp 1\s*\(Cơ bản\)|Dictation Level 1\s*\(Basic\)):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Dictation Level 1 (Basic): ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation Cấp 2\s*\(Thực chiến\)|Dictation Level 2\s*\(Combat\)):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Dictation Level 2 (Combat): ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation Cấp 3\s*\(Học thuật\)|Dictation Level 3\s*\(Academic\)):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Dictation Level 3 (Academic): ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation Thực Chiến|Combat Dictation):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Combat Dictation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation Cơ Bản|Basic Dictation):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Basic Dictation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation Học Thuật|Academic Dictation):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Academic Dictation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation Nâng Cao|Advanced Dictation):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Advanced Dictation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Dictation|Chép chính tả):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Dictation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^Đánh vần tên đường phố\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Street Name Spelling Traps ${translateTopicSubtitle(RegExp.$1)}`;
  }
  if (/^Phân biệt đuôi -teen vs -ty\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Distinguishing -teen vs -ty & UK Postcodes';
  }
  if (/^Ngày tháng & Số tiền\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Dates & Refundable Deposit Amounts';
  }
  if (/^Bẫy số lặp & Số không\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Double Numbers & Zero in Phone Numbers';
  }
  if (/^Đánh vần họ tên\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Scottish / Irish Surnames Spelling (Mac / Mc)';
  }
  if (/^Ngày thi khởi hành\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Departure Date & Time Traps';
  }
  if (/^(Đánh vần tên riêng & Mã bưu chính UK|Đánh vần tên riêng & Mã bưu chính):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Proper Names & Postcodes: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Đánh vần|Spelling):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Spelling: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Bẫy tự đính chính\s*\(Self-Correction Trap\)|Bẫy tự đính chính|Bẫy sửa miệng\s*\(Self-Correction Trap\)|Bẫy sửa miệng|Self-Correction Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Self-Correction Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Bẫy phủ định ngầm\s*\(Implicit Negation\)|Bẫy phủ định ngầm|Implicit Negation Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Implicit Negation Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Bẫy Người thứ 2 phản bác\s*\(Disagreement Trap\)|Bẫy Người thứ 2 phản bác|Disagreement Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Disagreement Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Bẫy Quá khứ vs Hiện tại\s*\(Temporal Shift Trap\)|Bẫy Quá khứ vs Hiện tại|Temporal Shift Trap):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Temporal Shift Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Bẫy đổi ý|Bẫy gây nhiễu|Bẫy Distractor|Phá bẫy đổi ý):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Mind-Change Distractor Trap: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Định hướng ngã ba & Lối rẽ|T-Junction & Turn Navigation):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `T-Junction & Turn Navigation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^Định hướng La bàn & Vòng xuyến\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Compass Navigation & Roundabouts';
  }
  if (/^(Định hướng sơ đồ|Map Navigation|Định hướng bản đồ):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Map Navigation: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Bản đồ & Định hướng|Bản đồ & Hướng đi):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Maps & Directions: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Tín hiệu Chuyển Luận Điểm|Signposting Shift):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Signposting: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^Tín hiệu Phản biện & Bất ngờ\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Signposting: Contrasting & Counter-intuitive Evidence';
  }
  if (/^(Bắt tín hiệu chuyển ý|Bắt tín hiệu|Signposting Catcher):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Signposting Catcher: ${translateTopicSubtitle(RegExp.$2)}`;
  }
  if (/^(Tín hiệu chuyển đoạn|Tín hiệu Part 4):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Part 4 Signposting: ${translateTopicSubtitle(RegExp.$2)}`;
  }

  // Non-colon and special listening titles
  if (/^Đánh vần Họ người & Bẫy tự đính chính/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Surname Spelling & Self-Correction Trap';
  }
  if (/^Đánh vần tên đường & UK Postcodes/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Street Names Spelling & UK Postcodes';
  }
  if (/^Đánh vần tên đường & Tự sửa lỗi/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Street Names Spelling & Self-Correction';
  }
  if (/^Đánh vần họ khách hàng xuất hóa đơn/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Customer Surname Spelling for Invoicing';
  }
  if (/^Đánh vần tên họ & Bẫy tự sửa lỗi/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Full Name Spelling & Self-Correction Trap';
  }
  if (/^Self-correction$/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + 'Self-Correction Trap';
  }
  if (/^Bẫy sửa miệng\s*\(Self-Correction Trap\):\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Self-Correction Trap: ${translateTopicSubtitle(RegExp.$1)}`;
  }
  if (/^Bẫy sửa miệng:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `Self-Correction Trap: ${translateTopicSubtitle(RegExp.$1)}`;
  }

  // 4. If title contains English in parentheses e.g. "Giới từ... (Prepositions of Data)"
  const parenMatch = cleanTitle.match(/\(([^)]+)\)$/);
  if (parenMatch && /[a-zA-Z\s]{4,}/.test(parenMatch[1])) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + parenMatch[1].trim();
  }

  // 5. Intelligent Colon-Separated Fallback (e.g. "Prefix: Suffix")
  if (cleanTitle.includes(':')) {
    const parts = cleanTitle.split(':');
    const prefix = parts[0].trim();
    const suffix = parts.slice(1).join(':').trim();
    const transPrefix = translatePrefix(prefix);
    const transSuffix = translateTopicSubtitle(suffix);
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + `${transPrefix}: ${transSuffix}`;
  }

  // 6. Generic single-phrase topic fallback
  const fallback = translateTopicSubtitle(cleanTitle);
  if (fallback && fallback !== cleanTitle) {
    return (isCommunityTagged ? '✨ [AI Community] ' : (isAiTagged ? '[AI] ' : '')) + fallback;
  }

  return rawTitle;
}

/**
 * Returns localized drill category.
 * @param {Object} drill - The drill object
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized category
 */
export function getLocalizedDrillCategory(drill, isEn = false) {
  if (!drill) return '';
  if (!isEn) return drill.category || '';
  if (drill.categoryEn) return drill.categoryEn;
  const raw = drill.category || '';
  if (KNOWN_CATEGORY_MAP[raw]) return KNOWN_CATEGORY_MAP[raw];
  const translated = getLocalizedDrillTitle({ title: raw }, true);
  if (translated && translated !== raw) return translated;
  return raw;
}

/**
 * Returns localized drill context (e.g. Task 1 charts and given data numbers).
 * @param {Object|string} drillOrContext - Drill object or raw context string
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized data summary
 */
export function getLocalizedDrillContext(drillOrContext, isEn = false) {
  if (!drillOrContext) return '';
  const raw = typeof drillOrContext === 'object' 
    ? (isEn && drillOrContext.contextEn ? drillOrContext.contextEn : drillOrContext.context) 
    : drillOrContext;

  if (!raw || !isEn) return raw || '';

  let text = String(raw);

  const phraseReplacements = [
    [/Dữ liệu phát điện sạch\s*(\d*):?/gi, 'Clean electricity generation data $1:'],
    [/Dữ liệu năm\s*(\d+)\s*(và|với)\s*(\d+)\s*về tỷ lệ các nguồn năng lượng tiêu thụ tại (quốc gia|nước)\s*([A-Za-z0-9]+):?/gi, 'Data for $1 and $3 on the proportion of energy consumed in Country $5:'],
    [/Dữ liệu năm\s*(\d+)\s*(và|với)\s*(\d+)\s*về tỷ lệ các nguồn năng lượng tại (quốc gia|nước)\s*([A-Za-z0-9]+):?/gi, 'Data for $1 and $3 on energy source shares in Country $5:'],
    [/Dữ liệu năm\s*(\d+)\s*(và|với)\s*(\d+):?/gi, 'Data for $1 and $3:'],
    [/Dữ liệu năm\s*(\d+):?/gi, 'Data for $1:'],
    [/Dựa trên biểu đồ:\s*/gi, 'Based on the chart: '],
    [/Dựa trên biểu đồ\s*/gi, 'Based on the chart: '],
    [/về tỷ lệ các nguồn năng lượng tiêu thụ tại/gi, 'on the proportion of energy consumed in'],
    [/về tỷ lệ các nguồn năng lượng tại/gi, 'on energy source shares in'],
    [/về tỷ lệ tiêu thụ năng lượng tại/gi, 'on energy consumption shares in'],
    [/về tỷ lệ các nguồn năng lượng/gi, 'on energy source shares'],
    [/về tỷ lệ/gi, 'on the proportion of'],
    [/tiêu thụ tại/gi, 'consumed in'],
    [/quốc gia\s*([A-Za-z0-9]+)/gi, 'Country $1'],
    [/quốc gia/gi, 'Country'],
    [/nước\s*([A-Za-z0-9]+)/gi, 'Country $1'],
    [/nước/gi, 'Country'],
    [/Than đá/gi, 'Coal'],
    [/Than/gi, 'Coal'],
    [/Năng lượng tái tạo/gi, 'Renewable energy'],
    [/Khí đốt/gi, 'Natural gas'],
    [/Khí tự nhiên/gi, 'Natural gas'],
    [/Hạt nhân/gi, 'Nuclear'],
    [/Năng lượng hạt nhân/gi, 'Nuclear energy'],
    [/Dầu mỏ/gi, 'Oil'],
    [/Thủy điện/gi, 'Hydroelectric power'],
    [/Điện mặt trời/gi, 'Solar energy'],
    [/Điện gió/gi, 'Wind energy'],
    [/Tây Ban Nha/gi, 'Spain'],
    [/Đan Mạch/gi, 'Denmark'],
    [/Đức/gi, 'Germany'],
    [/Anh/gi, 'UK'],
    [/Vương quốc Anh/gi, 'UK'],
    [/Úc/gi, 'Australia'],
    [/Nhật Bản/gi, 'Japan'],
    [/Nhật/gi, 'Japan'],
    [/Hoa Kỳ|Mỹ/gi, 'US'],
    [/Pháp/gi, 'France'],
    [/\bvà\b/gi, 'and'],
    [/\bvới\b/gi, 'with']
  ];

  for (const [pattern, repl] of phraseReplacements) {
    text = text.replace(pattern, repl);
  }

  return text.trim();
}

/**
 * Returns localized explanation for drills, questions, blanks, or errors.
 * @param {Object|string} itemOrExplanation - Item object with explanation or raw string
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized explanation
 */
export function getLocalizedDrillExplanation(itemOrExplanation, isEn = false) {
  if (!itemOrExplanation) return '';
  const raw = typeof itemOrExplanation === 'object'
    ? (isEn && itemOrExplanation.explanationEn ? itemOrExplanation.explanationEn : itemOrExplanation.explanation)
    : itemOrExplanation;

  if (!raw || !isEn) return raw || '';

  let text = String(raw);

  const explanationReplacements = [
    [/^Đúng\s*\((True|TRUE)\)\.?\s*/i, 'Correct (TRUE). '],
    [/^Sai\s*\((False|FALSE)\)\.?\s*/i, 'Incorrect (FALSE). '],
    [/^Đúng\.?\s*/i, 'Correct. '],
    [/^Sai\.?\s*/i, 'Incorrect. '],
    [/Năm (\d+)/gi, 'In $1'],
    [/dẫn đầu với/gi, 'led with'],
    [/cao hơn/gi, 'higher than'],
    [/thấp hơn/gi, 'lower than'],
    [/đạt đỉnh tại/gi, 'peaked at'],
    [/đạt/gi, 'reached'],
    [/trong khi/gi, 'while'],
    [/còn/gi, 'while'],
    [/có sự chênh lệch nhỏ/gi, 'there was a slight difference of'],
    [/có mức tăng trưởng theo tỷ lệ ngoạn mục nhất/gi, 'had the most remarkable growth rate'],
    [/từ (\d+)% tăng gần (\d+) lần lên (\d+)%/gi, 'increasing nearly $2-fold from $1% to $3%'],
    [/Tây Ban Nha/gi, 'Spain'],
    [/Đan Mạch/gi, 'Denmark'],
    [/Đức/gi, 'Germany'],
    [/Anh/gi, 'UK'],
    [/Vương quốc Anh/gi, 'UK'],
    [/Úc/gi, 'Australia'],
    [/Nhật Bản/gi, 'Japan'],
    [/Nhật/gi, 'Japan'],
    [/'stood at \+ \[số liệu\]':\s*đứng tại mốc bao nhiêu\./gi, "'stood at + [data point]': indicates a specific data level."],
    [/'grew by \+ \[khoảng chênh lệch\]':\s*tăng thêm một khoảng bao nhiêu\./gi, "'grew by + [difference]': indicates the amount of increase."],
    [/'peaked at \+ \[số liệu đỉnh\]':\s*đạt đỉnh tại mức nào\./gi, "'peaked at + [peak figure]': indicates reaching a peak."],
    [/'accounted for \+ \[tỷ lệ\/phần trăm\]':\s*chiếm bao nhiêu phần trăm\./gi, "'accounted for + [percentage]': represents or comprises a proportion."],
    [/Manh mối tương phản/gi, 'Contrast clue'],
    [/Manh mối định nghĩa/gi, 'Definition clue'],
    [/Manh mối nhân quả/gi, 'Cause & effect clue'],
    [/Manh mối ví dụ/gi, 'Example clue'],
    [/cho thấy từ\s*"?([A-Za-z]+)"?\s*có nghĩa là/gi, 'shows that "$1" means'],
    [/cho thấy/gi, 'shows that'],
    [/đối lập với/gi, 'contrasts with'],
    [/kết hợp với/gi, 'combined with'],
    [/chi tiết/gi, 'detail'],
    [/do đó/gi, 'therefore'],
    [/suy ra/gi, 'inferring that'],
    [/có nghĩa là/gi, 'means'],
    [/ngắn ngủi, phù du, thoáng qua/gi, 'short-lived, transient, ephemeral'],
    [/làm lu mờ, gây bối rối, đánh hỏa mù/gi, 'to obscure, confuse, obfuscate'],
    [/làm cải thiện, làm cho tốt lên/gi, 'to improve, make better, ameliorate'],
    [/làm trầm trọng thêm, tồi tệ đi/gi, 'to exacerbate, worsen'],
    [/làm trầm trọng thêm/gi, 'to exacerbate, worsen'],

    // Listening Specific Explanations & Questions
    [/Cụm từ nào báo hiệu người nói đang chuyển sang phân tích Nguyên nhân\s*\(Primary catalyst\)\?/gi, 'Which phrase signals that the speaker is shifting to the primary catalyst?'],
    [/Từ ngữ tín hiệu nào báo hiệu kết quả thực tế trái ngược với dự đoán ban đầu\?/gi, 'Which signposting signal indicates that the actual result contradicts initial predictions?'],
    [/Cụm từ nào báo hiệu/gi, 'Which phrase signals'],
    [/Từ ngữ tín hiệu nào báo hiệu/gi, 'Which signpost signal indicates'],
    [/trái ngược với dự đoán ban đầu/gi, 'contradicts the initial prediction'],
    [/chuyển sang phân tích/gi, 'shifting to analyzing'],
    [/Người nói đưa ra 3 mốc giờ liên tiếp/gi, 'The speaker mentions 3 consecutive timestamps'],
    [/Thí sinh vội vàng sẽ ghi ngay đáp án/gi, 'Hasty test-takers will prematurely choose option'],
    [/Từ nối đổi ý/gi, 'The self-correcting discourse marker'],
    [/là dấu hiệu chốt thông tin cuối cùng:?/gi, 'is the definitive signal confirming the final choice:'],
    [/Bẫy dùng cụm/gi, 'The trap utilizes the phrase'],
    [/nhưng đảo ngược lại với/gi, 'but reverses course with'],
    [/Giấy vẽ và bút màu đã có sẵn; chỉ có tạp dề \(apron\) là không còn được cấp, người tham gia bắt buộc phải tự mang theo\./gi, 'Drafting paper and colored pencils are provided; only aprons are no longer supplied, so participants must bring their own.'],
    [/Liam đề xuất A \(Tidal power\), nhưng Chloe phản bác do thiếu dữ liệu và đề xuất B \(Geothermal\)\. Liam đồng ý với "Fair enough, let us go with that"\./gi, 'Liam proposes A (Tidal power), but Chloe objects due to lack of data and suggests B (Geothermal). Liam agrees with "Fair enough, let us go with that".'],
    [/Đề tài cuối cùng được hai sinh viên thống nhất chọn là/gi, 'The final presentation topic mutually agreed upon is'],
    [/Dùng cấu trúc "used to be" cho Manchester, "briefly relocated" cho Birmingham, và chốt hiện tại với/gi, 'Uses "used to be" for Manchester, "briefly relocated" for Birmingham, and confirms current location with'],
    [/Trụ sở hiện tại của công ty nằm ở/gi, 'The company’s current headquarters is located in'],
    [/Theo lộ trình:\s*Cổng nam -> đi thẳng qua đài phun nước -> ngã ba rẽ trái -> đi qua hồ nước -> Phòng hội nghị nằm ngay bên tay phải, đối diện bãi đậu xe đạp\./gi, 'Following the route: South entrance -> straight past fountain -> turn left at T-junction -> walk past the pond -> Conference Center is on the right-hand side, opposite bike racks.'],
    [/Từ quầy du lịch đi về hướng Bắc đến vòng xuyến -> rẽ lối đầu tiên về phía Đông dọc đường River Lane -> cối xay cổ nằm ở bờ phía Bắc, ngay trước cây cầu bộ hành\./gi, 'From tourist kiosk head north to roundabout -> take first exit eastward along River Lane -> historic mill is on northern bank, just before footbridge.'],
    [/Bẫy âm dễ nhầm:\s*/gi, 'Confusable sound trap: '],
    [/Chữ cái V \/viː\/ và B \/biː\/, chữ R \/ɑːr\/ câm trong giọng Anh\./gi, 'Letters V /viː/ and B /biː/, silent R /ɑːr/ in British accent.'],
    [/Người nói đánh vần rõ:\s*/gi, 'The speaker clearly spells: '],
    [/Bẫy số đảo ngược:\s*/gi, 'Inverted digits trap: '],
    [/Postcode UK luôn có cấu trúc chữ - số - khoảng cách\./gi, 'UK postcodes always follow the letter - digit - space format.'],
    [/Mã bưu chính chuẩn xác là/gi, 'The correct postcode is'],
    [/Người nói cố tình chỉnh lại số máy nhánh để đánh lạc hướng\./gi, 'The speaker intentionally corrects the extension number as a distractor.'],
    [/Bẫy số 95 \(giá chuẩn\), 15 \(ngày hết hạn\), 10 \(tiền cọc\)\. Giá vé sớm thực tế là £75\./gi, 'Trap numbers 95 (standard fee), 15 (deadline), 10 (deposit). The actual early-bird fare is £75.'],
    [/Giá vé đăng ký sớm là 75 bảng \(£75\)\./gi, 'The early bird registration ticket is seventy-five pounds (£75).'],
    [/Cách đọc đặc trưng UK:\s*"double-seven double-oh" = 7700, "five double-two" = 522\./gi, 'Characteristic UK pronunciation: "double-seven double-oh" = 7700, "five double-two" = 522.'],
    [/Dãy số chuẩn là/gi, 'The correct number sequence is'],
    [/Bẫy viết hoa chữ I ở giữa \(MacIntyre\) và phân biệt Y với I\./gi, 'Trap of capitalizing middle letter I (MacIntyre) and distinguishing Y from I.'],
    [/Giáo viên đánh vần/gi, 'The speaker spells'],
    [/Không điền ngày trong tuần \(Wednesday\) hoặc giờ \(8:45\) nếu đề chỉ hỏi ngày khởi hành\./gi, 'Do not write the day of week (Wednesday) or time (8:45) when only the departure date is requested.'],
    [/Ngày xuất bến là/gi, 'The departure date is'],
    [/Chú ý nối âm:\s*/gi, 'Note connected speech: '],
    [/Chú ý nối âm phụ âm\s*-\s*nguyên âm ở/gi, 'Note consonant-to-vowel linking in'],
    [/cùng âm giảm nhẹ của từ/gi, 'along with the weak form of'],
    [/âm giảm nhẹ của từ/gi, 'weak form of'],
    [/phụ âm\s*-\s*nguyên âm/gi, 'consonant-to-vowel'],
    [/nối âm/gi, 'linking'],
    [/Bẫy tự đính chính\s*\(Self-correction\):\s*/gi, 'Self-correction trap: '],
    [/Bẫy tự đính chính:\s*/gi, 'Self-correction trap: '],
    [/Bẫy sửa miệng\s*\(Self-correction\):\s*/gi, 'Self-correction trap: '],
    [/Bẫy sửa miệng:\s*/gi, 'Self-correction trap: '],
    [/Người nói đưa ra tên đệm\s*([A-Za-z0-9]+)\s*trước,\s*sau đó mới đính chính lại họ chính xác là\s*([A-Za-z0-9]+)\./gi, 'The speaker mentions middle name $1 first, then corrects to the accurate surname $2.'],
    [/Người nói đưa ra tên đệm/gi, 'The speaker mentions the middle name'],
    [/trước,\s*sau đó mới đính chính lại họ chính xác là/gi, 'first, then corrects to the accurate surname'],
    [/sau đó mới đính chính lại họ chính xác là/gi, 'then corrects to the accurate surname'],
    [/họ chính xác là/gi, 'accurate surname is'],
    [/họ chính xác/gi, 'accurate surname'],
    [/tên đệm/gi, 'middle name'],
    [/đính chính lại/gi, 'corrects to'],
    [/người nói đang/gi, 'the speaker is'],
    [/khía cạnh tài chính của dự án/gi, 'the financial aspect of the project'],
    [/khía cạnh tài chính/gi, 'the financial aspect'],
    [/của dự án/gi, 'of the project'],
    [/Chú ý từ ghép/gi, 'Note compound word'],
    [/và âm đuôi số nhiều/gi, 'and plural ending sounds'],
    [/Chú ý âm đuôi động cơ/gi, 'Note ending sound of'],
    [/Chú ý nuốt âm và âm đuôi:\s*/gi, 'Note elision and ending sounds: '],
    [/Chú ý trạng từ chỉ mức độ/gi, 'Note degree adverb'],
    [/Chú ý các thuật ngữ học thuật phức tạp:\s*/gi, 'Note complex academic terminology: '],
    [/Thuật ngữ học thuật/gi, 'Academic terminology'],
    [/Cụm "let us now turn our attention to \[X\]\.\.\." là tín hiệu chuyển ý kinh điển trong Part 4 giúp thí sinh biết bài nói chuẩn bị trả lời cho câu hỏi tiếp theo trong đề thi\./gi, '"let us now turn our attention to [X]..." is a textbook Part 4 signpost signaling that the lecture is transitioning to the next question on the exam sheet.'],
    [/"Surprisingly, however\.\.\." là từ nối báo hiệu kết quả đi ngược lại giả thuyết ban đầu \(thường là mấu chốt để trả lời câu hỏi điền từ hoặc trắc nghiệm\)\./gi, '"Surprisingly, however..." is a contrasting signpost indicating an outcome contrary to initial hypotheses (frequently crucial for gap-fills and MCQs).']
  ];

  for (const [pattern, repl] of explanationReplacements) {
    text = text.replace(pattern, repl);
  }

  // Remove Vietnamese text inside parenthesis if preceded by English title
  text = text.replace(/\s*\([^)]*[\u00C0-\u1EF9]+[^)]*\)/g, '');

  return text.trim();
}

/**
 * Returns localized hint for paraphrase exercises.
 * @param {string} hint - Raw hint string
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized hint
 */
export function getLocalizedHint(hint, isEn = false) {
  if (!hint || !isEn) return hint || '';
  let text = String(hint);
  if (/^Thay\s+"([^"]+)"\s+bằng\s+"([^"]+)"\s+hoặc\s+"([^"]+)"/i.test(text)) {
    return `Replace "${RegExp.$1}" with "${RegExp.$2}" or "${RegExp.$3}"`;
  }
  if (/^Thay\s+"([^"]+)"\s+bằng\s+"([^"]+)"/i.test(text)) {
    return `Replace "${RegExp.$1}" with "${RegExp.$2}"`;
  }
  if (/^Dùng danh từ hóa:\s*(.*)/i.test(text)) {
    return `Use nominalization: ${RegExp.$1}`;
  }
  if (/^Dùng từ vựng C1:\s*(.*)/i.test(text)) {
    return `Use C1 vocabulary: ${RegExp.$1}`;
  }
  if (/^Dùng:\s*(.*)/i.test(text)) {
    return `Use: ${RegExp.$1}`;
  }
  return text;
}

const KNOWN_OPTION_TRANSLATIONS = {
  'làm cải thiện, làm cho tốt lên': 'To improve, make better',
  'làm cải thiện, làm cho tốt hơn': 'To improve, make better',
  'làm trầm trọng thêm, tồi tệ đi': 'To worsen, exacerbate',
  'làm trầm trọng thêm, tối tệ đi': 'To worsen, exacerbate',
  'làm trầm trọng thêm': 'To worsen, exacerbate',
  'duy trì trạng thái không thay đổi': 'To maintain an unchanged state',
  'phân tích và giám sát chặt chẽ': 'To closely analyze and monitor',
  'làm suy giảm, suy yếu': 'To weaken, diminish',
  'làm tăng lên, thúc đẩy': 'To increase, stimulate',
  'ngăn chặn, kìm hãm': 'To prevent, hinder',
  'thay thế hoàn toàn': 'To completely replace',
  'tạo điều kiện thuận lợi': 'To facilitate, foster',
  'gây hại, nguy hiểm': 'To harm, endanger',
  'bảo vệ, gìn giữ': 'To protect, preserve'
};

/**
 * Returns localized text for Context Vocab option pills.
 * @param {Object|string} optionOrText - Option object or raw text
 * @param {boolean} isEn - English mode flag
 * @returns {string}
 */
export function getLocalizedVocabOption(optionOrText, isEn = false) {
  if (!optionOrText) return '';
  const rawText = typeof optionOrText === 'object'
    ? (isEn && optionOrText.textEn ? optionOrText.textEn : optionOrText.text)
    : optionOrText;
    
  if (!rawText || !isEn) return rawText || '';

  const clean = String(rawText).trim();
  const lower = clean.toLowerCase();

  if (KNOWN_OPTION_TRANSLATIONS[lower]) {
    return KNOWN_OPTION_TRANSLATIONS[lower];
  }

  // Parenthetical notes in options e.g. "8:15 AM (Thời gian dự kiến ban đầu)"
  let res = clean
    .replace(/\(Thời gian dự kiến ban đầu\)/gi, '(Initial scheduled time)')
    .replace(/\(Thời gian điều chỉnh lần 1\)/gi, '(First revised time)')
    .replace(/\(Thời gian chốt cuối cùng\)/gi, '(Final confirmed time)')
    .replace(/\(Thời gian dự kiến\)/gi, '(Scheduled time)')
    .replace(/\(Thời gian chốt\)/gi, '(Confirmed time)')
    .replace(/\(Giá chuẩn\)/gi, '(Standard price)')
    .replace(/\(Giá ưu đãi\)/gi, '(Discounted price)')
    .replace(/\(Tùy chọn bổ sung\)/gi, '(Additional option)');

  if (res !== clean) {
    return res;
  }

  // Regex rule matching
  if (/làm cải thiện|cải thiện|làm cho tốt/i.test(clean)) {
    return 'To improve, make better';
  }
  if (/trầm trọng|tồi tệ đi|tối tệ đi/i.test(clean)) {
    return 'To worsen, exacerbate';
  }
  if (/duy trì|không thay đổi|giữ nguyên/i.test(clean)) {
    return 'To maintain an unchanged state';
  }
  if (/phân tích|giám sát|theo dõi/i.test(clean)) {
    return 'To closely analyze and monitor';
  }
  if (/ngăn chặn|kìm hãm|cản trở/i.test(clean)) {
    return 'To prevent, hinder, impede';
  }
  if (/thúc đẩy|tăng trưởng|phát triển/i.test(clean)) {
    return 'To promote, stimulate growth';
  }
  if (/suy giảm|suy yếu|giảm bớt/i.test(clean)) {
    return 'To diminish, decline, weaken';
  }
  if (/thay thế|hoán đổi/i.test(clean)) {
    return 'To replace, substitute';
  }

  return clean;
}


