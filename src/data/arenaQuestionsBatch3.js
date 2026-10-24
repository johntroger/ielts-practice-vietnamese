/**
 * src/data/arenaQuestionsBatch3.js
 * 
 * Batch 3: 100 Core Authentic Cambridge & GitBook Questions for Atlas English Arena v8.2.
 * 
 * Sources:
 * - Cambridge 20 Academic (Reading Test 1: The Kākāpō, Resilient Elms, Stress in Decision-Making)
 * - Cambridge 18 Academic (Reading Test 1: Urban Farming, Forest Schools, Orbital Space Debris)
 * - Cambridge 17 Academic (Reading Test 1: London Underground, Stadium Architecture, Charles II)
 * - Cambridge 16 Academic (Reading Test 1: Canine Attachment, Djoser Step Pyramid, AI & Labour)
 * - 101 Past Papers (Reading Test 2 & 3: Save the Turtles, Corporate Social Responsibility, TV Addiction, Marine Chronometers, Polar Calving)
 * - Cambridge 8 (Listening Tests 1, 2, 3: Music Festival, Dinosaur Museum, Total Insurance, Asian Honeybees, Short-term Accommodation, Business Repetition)
 * - Master Bank (Top Spelling Demons, Cambridge Synonym Matrix, Academic Hedging, Task 1 Process & Chart Vectors)
 * 
 * Strict Tier Distribution:
 * - Easy (Band 4.0 - 5.0): 25 questions
 * - Medium (Band 5.5 - 6.5): 35 questions
 * - Hard (Band 7.0 - 8.0): 25 questions
 * - Nightmare (Band 8.5 - 9.0): 15 questions
 * 
 * Full Bilingual Compliance:
 * 100% Native English in English mode (Zero Vietnamese leaks) with authentic Cambridge Examiner rationale.
 */

export const ARENA_BATCH_3_QUESTIONS = [
  {
    "id": "b3_easy_spell_01",
    "difficulty": "easy",
    "topic": "education",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #07",
    "prompt": "Chọn từ viết đúng chính tả Cambridge cho danh từ chỉ \"sự lúng túng, bối rối\":",
    "promptVi": "Chọn từ viết đúng chính tả Cambridge cho danh từ chỉ \"sự lúng túng, bối rối\":",
    "promptEn": "Select the authentic Cambridge spelling for the noun meaning \"feeling of self-conscious distress\":",
    "context": "The public speaking blunder caused considerable _____ to the young researcher.",
    "contextVi": "The public speaking blunder caused considerable _____ to the young researcher.",
    "contextEn": "The public speaking blunder caused considerable _____ to the young researcher.",
    "options": [
      "embarrassment",
      "embarassment",
      "embarrasment",
      "emabarassment"
    ],
    "optionsVi": [
      "embarrassment (đúng 2 chữ r và 2 chữ s)",
      "embarassment (thiếu chữ r)",
      "embarrasment (thiếu cả r và s)",
      "emabarassment (thừa chữ a)"
    ],
    "optionsEn": [
      "embarrassment",
      "embarassment",
      "embarrasment",
      "emabarassment"
    ],
    "correctIndex": 0,
    "correctAnswer": "embarrassment",
    "correctAnswerEn": "embarrassment",
    "explanation": "Từ \"embarrassment\" có quy tắc nhân đôi cả hai phụ âm: 2 chữ \"r\" và 2 chữ \"s\" (double R, double S).",
    "explanationVi": "Từ \"embarrassment\" có quy tắc nhân đôi cả hai phụ âm: 2 chữ \"r\" và 2 chữ \"s\" (double R, double S).",
    "explanationEn": "The word \"embarrassment\" features doubled consonants throughout: double \"r\" and double \"s\" (-rr- and -ss-)."
  },
  {
    "id": "b3_easy_spell_02",
    "difficulty": "easy",
    "topic": "culture",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #14",
    "prompt": "Chọn phương án viết đúng chính tả cho từ mang nghĩa \"đặc ân, đặc quyền\":",
    "promptVi": "Chọn phương án viết đúng chính tả cho từ mang nghĩa \"đặc ân, đặc quyền\":",
    "promptEn": "Select the correct Cambridge spelling for the noun denoting \"a special right or advantage\":",
    "context": "Higher education should be accessible to all rather than remaining the _____ of the wealthy.",
    "contextVi": "Higher education should be accessible to all rather than remaining the _____ of the wealthy.",
    "contextEn": "Higher education should be accessible to all rather than remaining the _____ of the wealthy.",
    "options": [
      "privilege",
      "privelege",
      "priviledge",
      "privelidge"
    ],
    "optionsVi": [
      "privilege (2 chữ i, kết thúc -ege)",
      "privelege (sai chữ e đầu)",
      "priviledge (thừa chữ d)",
      "privelidge (sai cả e và d)"
    ],
    "optionsEn": [
      "privilege",
      "privelege",
      "priviledge",
      "privelidge"
    ],
    "correctIndex": 0,
    "correctAnswer": "privilege",
    "correctAnswerEn": "privilege",
    "explanation": "Từ \"privilege\" có 2 chữ \"i\" ở 2 âm tiết đầu và kết thúc bằng \"-lege\" (không bao giờ có chữ \"d\").",
    "explanationVi": "Từ \"privilege\" có 2 chữ \"i\" ở 2 âm tiết đầu và kết thúc bằng \"-lege\" (không bao giờ có chữ \"d\").",
    "explanationEn": "\"Privilege\" contains two \"i\" vowels in the first two syllables and ends in \"-ege\", with no \"d\"."
  },
  {
    "id": "b3_easy_spell_03",
    "difficulty": "easy",
    "topic": "science",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #22",
    "prompt": "Chọn từ viết đúng chính tả cho danh từ chỉ \"khoảng thời gian một thiên niên kỷ (1000 năm)\":",
    "promptVi": "Chọn từ viết đúng chính tả cho danh từ chỉ \"khoảng thời gian một thiên niên kỷ (1000 năm)\":",
    "promptEn": "Select the authentic spelling for the noun meaning \"a period of one thousand years\":",
    "context": "The ancient bristlecone pine has survived for over a _____.",
    "contextVi": "The ancient bristlecone pine has survived for over a _____.",
    "contextEn": "The ancient bristlecone pine has survived for over a _____.",
    "options": [
      "millennium",
      "millenium",
      "milenium",
      "milennium"
    ],
    "optionsVi": [
      "millennium (2 chữ l và 2 chữ n)",
      "millenium (thiếu n)",
      "milenium (thiếu cả l và n)",
      "milennium (thiếu l)"
    ],
    "optionsEn": [
      "millennium",
      "millenium",
      "milenium",
      "milennium"
    ],
    "correctIndex": 0,
    "correctAnswer": "millennium",
    "correctAnswerEn": "millennium",
    "explanation": "\"Millennium\" bắt nguồn từ tiếng Latin, luôn có 2 chữ \"l\" và 2 chữ \"n\" (double L, double N).",
    "explanationVi": "\"Millennium\" bắt nguồn từ tiếng Latin, luôn có 2 chữ \"l\" và 2 chữ \"n\" (double L, double N).",
    "explanationEn": "\"Millennium\" derives from Latin mille + annus and strictly requires double \"l\" and double \"n\"."
  },
  {
    "id": "b3_easy_spell_04",
    "difficulty": "easy",
    "topic": "education",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #31",
    "prompt": "Chọn từ viết đúng chính tả cho danh từ \"bảng câu hỏi khảo sát nghiên cứu\":",
    "promptVi": "Chọn từ viết đúng chính tả cho danh từ \"bảng câu hỏi khảo sát nghiên cứu\":",
    "promptEn": "Select the correct spelling for a set of printed research survey questions:",
    "context": "Participants were requested to complete an anonymous _____ regarding their study habits.",
    "contextVi": "Participants were requested to complete an anonymous _____ regarding their study habits.",
    "contextEn": "Participants were requested to complete an anonymous _____ regarding their study habits.",
    "options": [
      "questionnaire",
      "questionaire",
      "questionare",
      "questionnair"
    ],
    "optionsVi": [
      "questionnaire (2 chữ n, kết thúc -aire)",
      "questionaire (thiếu chữ n)",
      "questionare (thiếu cả n và i)",
      "questionnair (thiếu chữ e cuối)"
    ],
    "optionsEn": [
      "questionnaire",
      "questionaire",
      "questionare",
      "questionnair"
    ],
    "correctIndex": 0,
    "correctAnswer": "questionnaire",
    "correctAnswerEn": "questionnaire",
    "explanation": "\"Questionnaire\" giữ nguyên từ \"question\" và thêm hậu tố tiếng Pháp \"-naire\" nên có 2 chữ \"n\".",
    "explanationVi": "\"Questionnaire\" giữ nguyên từ \"question\" và thêm hậu tố tiếng Pháp \"-naire\" nên có 2 chữ \"n\".",
    "explanationEn": "\"Questionnaire\" combines \"question\" with the French suffix \"-naire\", resulting in double \"n\"."
  },
  {
    "id": "b3_easy_spell_05",
    "difficulty": "easy",
    "topic": "education",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #03",
    "prompt": "Chọn từ viết đúng chính tả cho danh từ \"cách phát âm\":",
    "promptVi": "Chọn từ viết đúng chính tả cho danh từ \"cách phát âm\":",
    "promptEn": "Select the correct spelling for the noun referring to how a word is spoken:",
    "context": "Accurate _____ is essential for achieving a Band 7+ in the IELTS Speaking test.",
    "contextVi": "Accurate _____ is essential for achieving a Band 7+ in the IELTS Speaking test.",
    "contextEn": "Accurate _____ is essential for achieving a Band 7+ in the IELTS Speaking test.",
    "options": [
      "pronunciation",
      "pronounciation",
      "pronunceation",
      "prononciation"
    ],
    "optionsVi": [
      "pronunciation (đúng: -nun-)",
      "pronounciation (sai: nhầm với động từ pronounce)",
      "pronunceation (sai vần)",
      "prononciation (sai chữ o)"
    ],
    "optionsEn": [
      "pronunciation",
      "pronounciation",
      "pronunceation",
      "prononciation"
    ],
    "correctIndex": 0,
    "correctAnswer": "pronunciation",
    "correctAnswerEn": "pronunciation",
    "explanation": "Động từ là \"pronounce\" (có chữ \"o\"), nhưng danh từ biến âm thành \"pronunciation\" (không có chữ \"o\" ở âm tiết thứ hai).",
    "explanationVi": "Động từ là \"pronounce\" (có chữ \"o\"), nhưng danh từ biến âm thành \"pronunciation\" (không có chữ \"o\" ở âm tiết thứ hai).",
    "explanationEn": "While the verb is \"pronounce\" (with \"ou\"), the noun changes its vowel root to \"pronunciation\" (with \"-nun-\")."
  },
  {
    "id": "b3_easy_spell_06",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #45",
    "prompt": "Chọn phương án viết đúng chính tả cho từ chỉ \"sự liên lạc, sự làm cầu nối thông tin\":",
    "promptVi": "Chọn phương án viết đúng chính tả cho từ chỉ \"sự liên lạc, sự làm cầu nối thông tin\":",
    "promptEn": "Select the correct spelling for the term meaning close working communication between organisations:",
    "context": "The department appointed an officer to maintain close _____ with local businesses.",
    "contextVi": "The department appointed an officer to maintain close _____ with local businesses.",
    "contextEn": "The department appointed an officer to maintain close _____ with local businesses.",
    "options": [
      "liaison",
      "liason",
      "liaisonne",
      "laision"
    ],
    "optionsVi": [
      "liaison (đúng: l-i-a-i-s-o-n)",
      "liason (thiếu chữ i thứ hai)",
      "liaisonne (thừa ne)",
      "laision (đảo lộn chữ a và i)"
    ],
    "optionsEn": [
      "liaison",
      "liason",
      "liaisonne",
      "laision"
    ],
    "correctIndex": 0,
    "correctAnswer": "liaison",
    "correctAnswerEn": "liaison",
    "explanation": "\"Liaison\" có 2 chữ \"i\" (l-I-a-I-s-o-n). Đây là một trong những từ thí sinh hay quên chữ \"i\" thứ hai nhất.",
    "explanationVi": "\"Liaison\" có 2 chữ \"i\" (l-I-a-I-s-o-n). Đây là một trong những từ thí sinh hay quên chữ \"i\" thứ hai nhất.",
    "explanationEn": "\"Liaison\" requires two \"i\" letters flanking the \"a\" (l-i-a-i-s-o-n), preserving its French etymology."
  },
  {
    "id": "b3_easy_spell_07",
    "difficulty": "easy",
    "topic": "health",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #19",
    "prompt": "Chọn phương án viết đúng cho danh từ chỉ \"sự xuất hiện, sự cố xảy ra\":",
    "promptVi": "Chọn phương án viết đúng cho danh từ chỉ \"sự xuất hiện, sự cố xảy ra\":",
    "promptEn": "Select the correct spelling for the noun denoting an incident or an event:",
    "context": "The sudden outbreak of the waterborne virus was an unforeseen _____.",
    "contextVi": "The sudden outbreak of the waterborne virus was an unforeseen _____.",
    "contextEn": "The sudden outbreak of the waterborne virus was an unforeseen _____.",
    "options": [
      "occurrence",
      "occurance",
      "occurence",
      "ocurrence"
    ],
    "optionsVi": [
      "occurrence (2 chữ c, 2 chữ r, đuôi -ence)",
      "occurance (sai đuôi -ance)",
      "occurence (thiếu r)",
      "ocurrence (thiếu c)"
    ],
    "optionsEn": [
      "occurrence",
      "occurance",
      "occurence",
      "ocurrence"
    ],
    "correctIndex": 0,
    "correctAnswer": "occurrence",
    "correctAnswerEn": "occurrence",
    "explanation": "\"Occurrence\" nhân đôi cả chữ \"c\" và chữ \"r\", và kết thúc bằng đuôi \"-ence\" (-cc- + -rr- + -ence).",
    "explanationVi": "\"Occurrence\" nhân đôi cả chữ \"c\" và chữ \"r\", và kết thúc bằng đuôi \"-ence\" (-cc- + -rr- + -ence).",
    "explanationEn": "\"Occurrence\" doubles both consonants (double \"c\" and double \"r\") and takes the suffix \"-ence\"."
  },
  {
    "id": "b3_easy_spell_08",
    "difficulty": "easy",
    "topic": "urbanization",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #52",
    "prompt": "Chọn phương án viết đúng chính tả cho từ \"hệ thống cấp bậc, thứ bậc\":",
    "promptVi": "Chọn phương án viết đúng chính tả cho từ \"hệ thống cấp bậc, thứ bậc\":",
    "promptEn": "Select the authentic spelling for the noun denoting a ranked organizational system:",
    "context": "The civil service adheres to a rigid administrative _____.",
    "contextVi": "The civil service adheres to a rigid administrative _____.",
    "contextEn": "The civil service adheres to a rigid administrative _____.",
    "options": [
      "hierarchy",
      "heirarchy",
      "hierachy",
      "hierarcy"
    ],
    "optionsVi": [
      "hierarchy (đúng: h-i-e-r-a-r-c-h-y)",
      "heirarchy (sai: đảo e trước i)",
      "hierachy (thiếu chữ r thứ hai)",
      "hierarcy (thiếu chữ h trước y)"
    ],
    "optionsEn": [
      "hierarchy",
      "heirarchy",
      "hierachy",
      "hierarcy"
    ],
    "correctIndex": 0,
    "correctAnswer": "hierarchy",
    "correctAnswerEn": "hierarchy",
    "explanation": "Quy tắc: bắt đầu bằng \"hier-\" (chữ i trước e, giống \"hieroglyph\") rồi đến \"-archy\".",
    "explanationVi": "Quy tắc: bắt đầu bằng \"hier-\" (chữ i trước e, giống \"hieroglyph\") rồi đến \"-archy\".",
    "explanationEn": "\"Hierarchy\" begins with \"hier-\" (i before e) followed by \"-archy\", referring to institutional ranks."
  },
  {
    "id": "b3_easy_lis_c8_t1_01",
    "difficulty": "easy",
    "topic": "culture",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 1 Listening Part 1",
    "prompt": "Xác định loại vé cuối cùng người gọi chọn đặt sau khi điều chỉnh:",
    "promptVi": "Xác định loại vé cuối cùng người gọi chọn đặt sau khi điều chỉnh:",
    "promptEn": "Identify the final ticket option confirmed by the caller following the self-correction:",
    "context": "Agent: We have adult weekend passes for £45, or the full 4-day festival pass for £70.\nCaller: I initially thought I could only make Saturday, but my leave was approved. Let's make it the 4-day festival pass please.",
    "contextVi": "Agent: We have adult weekend passes for £45, or the full 4-day festival pass for £70.\nCaller: I initially thought I could only make Saturday, but my leave was approved. Let's make it the 4-day festival pass please.",
    "contextEn": "Agent: We have adult weekend passes for £45, or the full 4-day festival pass for £70.\nCaller: I initially thought I could only make Saturday, but my leave was approved. Let's make it the 4-day festival pass please.",
    "options": [
      "Vé trọn gói 4 ngày (£70 full 4-day pass)",
      "Vé cuối tuần (£45 weekend pass)",
      "Vé ngày thứ Bảy đơn lẻ (Single Saturday pass)",
      "Vé ưu đãi sinh viên (£35 student concession)"
    ],
    "optionsVi": [
      "Vé trọn gói 4 ngày (£70 full 4-day pass)",
      "Vé cuối tuần (£45 weekend pass)",
      "Vé ngày thứ Bảy đơn lẻ (Single Saturday pass)",
      "Vé ưu đãi sinh viên (£35 student concession)"
    ],
    "optionsEn": [
      "Full 4-day festival pass (£70)",
      "Weekend pass (£45)",
      "Single Saturday pass",
      "Student concession pass (£35)"
    ],
    "correctIndex": 0,
    "correctAnswer": "Vé trọn gói 4 ngày (£70 full 4-day pass)",
    "correctAnswerEn": "Full 4-day festival pass (£70)",
    "explanation": "Bẫy đổi ý điển hình: người gọi ban đầu định đi thứ Bảy, nhưng vì được nghỉ phép nên chốt \"make it the 4-day festival pass please\".",
    "explanationVi": "Bẫy đổi ý điển hình: người gọi ban đầu định đi thứ Bảy, nhưng vì được nghỉ phép nên chốt \"make it the 4-day festival pass please\".",
    "explanationEn": "Classic distractor reversal: the caller originally considered a Saturday visit, but ultimately books the full 4-day festival pass after work leave approval."
  },
  {
    "id": "b3_easy_lis_c8_t1_02",
    "difficulty": "easy",
    "topic": "education",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 1 Listening Part 2",
    "prompt": "Khu vực nào trong bảo tàng khủng long KHÔNG cho phép học sinh mang đồ ăn vào?",
    "promptVi": "Khu vực nào trong bảo tàng khủng long KHÔNG cho phép học sinh mang đồ ăn vào?",
    "promptEn": "Which specific section of the Dinosaur Museum strictly prohibits food and beverages?",
    "context": "Guide: Packed lunches may be eaten in the glass conservatory and on the picnic lawn outside. However, no food or drinks whatsoever are permitted inside the Interactive Fossil Gallery.",
    "contextVi": "Guide: Packed lunches may be eaten in the glass conservatory and on the picnic lawn outside. However, no food or drinks whatsoever are permitted inside the Interactive Fossil Gallery.",
    "contextEn": "Guide: Packed lunches may be eaten in the glass conservatory and on the picnic lawn outside. However, no food or drinks whatsoever are permitted inside the Interactive Fossil Gallery.",
    "options": [
      "Phòng trưng bày hóa thạch tương tác (Interactive Fossil Gallery)",
      "Nhà kính ngoài trời (Glass conservatory)",
      "Bãi cỏ dã ngoại (Picnic lawn)",
      "Quầy lưu niệm bảo tàng (Museum gift shop)"
    ],
    "optionsVi": [
      "Phòng trưng bày hóa thạch tương tác (Interactive Fossil Gallery)",
      "Nhà kính ngoài trời (Glass conservatory)",
      "Bãi cỏ dã ngoại (Picnic lawn)",
      "Quầy lưu niệm bảo tàng (Museum gift shop)"
    ],
    "optionsEn": [
      "Interactive Fossil Gallery",
      "Glass conservatory",
      "Picnic lawn",
      "Museum gift shop"
    ],
    "correctIndex": 0,
    "correctAnswer": "Phòng trưng bày hóa thạch tương tác (Interactive Fossil Gallery)",
    "correctAnswerEn": "Interactive Fossil Gallery",
    "explanation": "Hướng dẫn viên nói rõ: nhà kính và bãi cỏ được phép ăn trưa, \"However, no food or drinks whatsoever are permitted inside the Interactive Fossil Gallery\".",
    "explanationVi": "Hướng dẫn viên nói rõ: nhà kính và bãi cỏ được phép ăn trưa, \"However, no food or drinks whatsoever are permitted inside the Interactive Fossil Gallery\".",
    "explanationEn": "The guide explicitly contrasts permitted picnic areas with the Interactive Fossil Gallery, where food and drink are strictly banned."
  },
  {
    "id": "b3_easy_lis_c8_t2_01",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 2 Listening Part 1",
    "prompt": "Số tiền bảo hiểm được hoàn trả sau khi trừ mức miễn thường (excess) là bao nhiêu?",
    "promptVi": "Số tiền bảo hiểm được hoàn trả sau khi trừ mức miễn thường (excess) là bao nhiêu?",
    "promptEn": "What is the net insurance payout after deducting the mandatory policy excess?",
    "context": "Officer: The stolen laptop is assessed at £800 replacement value. Your policy has an excess of £150, meaning your payout will be exactly £650.",
    "contextVi": "Officer: The stolen laptop is assessed at £800 replacement value. Your policy has an excess of £150, meaning your payout will be exactly £650.",
    "contextEn": "Officer: The stolen laptop is assessed at £800 replacement value. Your policy has an excess of £150, meaning your payout will be exactly £650.",
    "options": [
      "£650",
      "£800",
      "£150",
      "£950"
    ],
    "optionsVi": [
      "£650 (số tiền thực nhận)",
      "£800 (tổng giá trị máy)",
      "£150 (tiền khấu trừ)",
      "£950 (tổng cộng sai)"
    ],
    "optionsEn": [
      "£650",
      "£800",
      "£150",
      "£950"
    ],
    "correctIndex": 0,
    "correctAnswer": "£650",
    "correctAnswerEn": "£650",
    "explanation": "Bẫy số: £800 là giá trị định giá, £150 là mức khấu trừ, số tiền công ty chi trả thực tế (payout) là £650.",
    "explanationVi": "Bẫy số: £800 là giá trị định giá, £150 là mức khấu trừ, số tiền công ty chi trả thực tế (payout) là £650.",
    "explanationEn": "Numeric calculation trap: £800 is the replacement value, £150 is the policy excess, making the net payout £650."
  },
  {
    "id": "b3_easy_lis_c8_t3_01",
    "difficulty": "easy",
    "topic": "urbanization",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 3 Listening Part 1",
    "prompt": "Hợp đồng thuê căn hộ ngắn hạn bao gồm chi phí dịch vụ nào sau đây?",
    "promptVi": "Hợp đồng thuê căn hộ ngắn hạn bao gồm chi phí dịch vụ nào sau đây?",
    "promptEn": "Which utility bill is explicitly included in the weekly rental fee?",
    "context": "Tenant: Are utilities covered in the £220 weekly rent?\nLandlord: Water rates and wireless internet are included, but tenants must pay electricity meters separately.",
    "contextVi": "Tenant: Are utilities covered in the £220 weekly rent?\nLandlord: Water rates and wireless internet are included, but tenants must pay electricity meters separately.",
    "contextEn": "Tenant: Are utilities covered in the £220 weekly rent?\nLandlord: Water rates and wireless internet are included, but tenants must pay electricity meters separately.",
    "options": [
      "Tiền nước và Internet không dây (Water rates and Wi-Fi)",
      "Tiền điện sinh hoạt (Electricity)",
      "Thuế hội đồng địa phương (Council tax)",
      "Phí đỗ xe có mái che (Covered parking fee)"
    ],
    "optionsVi": [
      "Tiền nước và Internet không dây (Water rates and Wi-Fi)",
      "Tiền điện sinh hoạt (Electricity)",
      "Thuế hội đồng địa phương (Council tax)",
      "Phí đỗ xe có mái che (Covered parking fee)"
    ],
    "optionsEn": [
      "Water rates and wireless internet",
      "Electricity meter bills",
      "Council tax",
      "Covered parking fee"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tiền nước và Internet không dây (Water rates and Wi-Fi)",
    "correctAnswerEn": "Water rates and wireless internet",
    "explanation": "Chủ nhà khẳng định: \"Water rates and wireless internet are included\", còn điện (\"electricity\") phải tự trả riêng.",
    "explanationVi": "Chủ nhà khẳng định: \"Water rates and wireless internet are included\", còn điện (\"electricity\") phải tự trả riêng.",
    "explanationEn": "The landlord explicitly specifies that water and Wi-Fi are included, whereas electricity must be metered and paid separately."
  },
  {
    "id": "b3_easy_vocab_01",
    "difficulty": "easy",
    "topic": "environment",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 5.5 to 6.5",
    "prompt": "Chọn từ đồng nghĩa chuẩn xác nhất thay thế cho \"harmful\" trong ngữ cảnh môi trường:",
    "promptVi": "Chọn từ đồng nghĩa chuẩn xác nhất thay thế cho \"harmful\" trong ngữ cảnh môi trường:",
    "promptEn": "Select the most accurate academic synonym for \"harmful\" in environmental science:",
    "context": "The discharge of untreated chemical effluent has a highly _____ effect on marine ecosystems.",
    "contextVi": "The discharge of untreated chemical effluent has a highly _____ effect on marine ecosystems.",
    "contextEn": "The discharge of untreated chemical effluent has a highly _____ effect on marine ecosystems.",
    "options": [
      "detrimental",
      "superficial",
      "negligible",
      "temporary"
    ],
    "optionsVi": [
      "detrimental (gây tổn hại nghiêm trọng)",
      "superficial (nông cạn, bề ngoài)",
      "negligible (không đáng kể)",
      "temporary (tạm thời)"
    ],
    "optionsEn": [
      "detrimental",
      "superficial",
      "negligible",
      "temporary"
    ],
    "correctIndex": 0,
    "correctAnswer": "detrimental",
    "correctAnswerEn": "detrimental",
    "explanation": "\"Detrimental\" là tính từ học thuật C1 đồng nghĩa với \"harmful / damaging\", thường đi kèm \"detrimental effect on\".",
    "explanationVi": "\"Detrimental\" là tính từ học thuật C1 đồng nghĩa với \"harmful / damaging\", thường đi kèm \"detrimental effect on\".",
    "explanationEn": "\"Detrimental\" is an authentic academic synonym for \"harmful\" frequently paired as \"detrimental effect on\"."
  },
  {
    "id": "b3_easy_vocab_02",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 6.0",
    "prompt": "Chọn collocation học thuật phù hợp điền vào chỗ trống:",
    "promptVi": "Chọn collocation học thuật phù hợp điền vào chỗ trống:",
    "promptEn": "Select the standard academic collocation to complete the sentence:",
    "context": "The government launched an ambitious campaign to _____ awareness of cyber fraud.",
    "contextVi": "The government launched an ambitious campaign to _____ awareness of cyber fraud.",
    "contextEn": "The government launched an ambitious campaign to _____ awareness of cyber fraud.",
    "options": [
      "raise",
      "rise",
      "lift",
      "arise"
    ],
    "optionsVi": [
      "raise (raise awareness - nâng cao nhận thức)",
      "rise (nội động từ, không có tân ngữ)",
      "lift (nâng cơ học)",
      "arise (phát sinh)"
    ],
    "optionsEn": [
      "raise",
      "rise",
      "lift",
      "arise"
    ],
    "correctIndex": 0,
    "correctAnswer": "raise",
    "correctAnswerEn": "raise",
    "explanation": "Collocation chuẩn là \"raise awareness\" (nâng cao nhận thức). \"Rise\" là nội động từ nên không đi kèm tân ngữ trực tiếp.",
    "explanationVi": "Collocation chuẩn là \"raise awareness\" (nâng cao nhận thức). \"Rise\" là nội động từ nên không đi kèm tân ngữ trực tiếp.",
    "explanationEn": "The fixed academic collocation is \"raise awareness\". \"Rise\" is intransitive and cannot take a direct object."
  },
  {
    "id": "b3_easy_read_c20_p1_01",
    "difficulty": "easy",
    "topic": "environment",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Đánh giá nhận định theo thông tin bài đọc về vẹt Kākāpō:",
    "promptVi": "Đánh giá nhận định theo thông tin bài đọc về vẹt Kākāpō:",
    "promptEn": "Evaluate the statement based on the Cambridge 20 reading passage on Kākāpō parrots:",
    "context": "Passage: Endemic to New Zealand, the kākāpō is the only nocturnal, flightless parrot on Earth. Because mature adults can weigh up to four kilograms, it is also universally recognized as the heaviest parrot species.\n\nStatement: The kākāpō is capable of flying short distances when fleeing predators.",
    "contextVi": "Đoạn văn: Là loài đặc hữu của New Zealand, vẹt kākāpō là loài vẹt duy nhất trên Trái Đất sống về đêm và hoàn toàn không biết bay. Con trưởng thành có thể nặng tới 4kg, là loài vẹt nặng nhất thế giới.\n\nNhận định: Vẹt kākāpō có thể bay được những khoảng cách ngắn khi chạy trốn kẻ săn mồi.",
    "contextEn": "Passage: Endemic to New Zealand, the kākāpō is the only nocturnal, flightless parrot on Earth. Because mature adults can weigh up to four kilograms, it is also universally recognized as the heaviest parrot species.\n\nStatement: The kākāpō is capable of flying short distances when fleeing predators.",
    "options": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "FALSE (Sai - bài nêu rõ vẹt hoàn toàn không biết bay \"flightless\")",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "FALSE",
    "correctAnswerEn": "FALSE",
    "explanation": "Bài đọc khẳng định vẹt kākāpō là loài \"flightless\" (hoàn toàn không biết bay), mâu thuẫn trực tiếp với nhận định \"capable of flying short distances\".",
    "explanationVi": "Bài đọc khẳng định vẹt kākāpō là loài \"flightless\" (hoàn toàn không biết bay), mâu thuẫn trực tiếp với nhận định \"capable of flying short distances\".",
    "explanationEn": "The passage explicitly defines the kākāpō as \"flightless\", contradicting the claim that it can fly short distances."
  },
  {
    "id": "b3_easy_read_c18_p1_01",
    "difficulty": "easy",
    "topic": "urbanization",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Lợi thế chính của phương pháp nông nghiệp thẳng đứng (vertical farming) trong đô thị là gì?",
    "promptVi": "Lợi thế chính của phương pháp nông nghiệp thẳng đứng (vertical farming) trong đô thị là gì?",
    "promptEn": "According to the passage on urban agriculture, what is the primary structural advantage of vertical farming?",
    "context": "Vertical farming architectures stack crop tiers upward within climate-controlled indoor towers. This method cuts water usage by up to 95% compared with conventional open-field agriculture and eliminates vulnerability to seasonal droughts.",
    "contextVi": "Mô hình nông nghiệp thẳng đứng xếp các tầng cây trồng hướng lên trên trong các tháp trong nhà có kiểm soát vi khí hậu. Phương pháp này giảm tới 95% lượng nước so với canh tác ngoài trời truyền thống và loại bỏ sự tổn thương trước hạn hán theo mùa.",
    "contextEn": "Vertical farming architectures stack crop tiers upward within climate-controlled indoor towers. This method cuts water usage by up to 95% compared with conventional open-field agriculture and eliminates vulnerability to seasonal droughts.",
    "options": [
      "Tiết kiệm tới 95% lượng nước ngọt tiêu thụ (Cuts water usage by up to 95%)",
      "Giảm hoàn toàn chi phí tiêu thụ điện năng chiếu sáng",
      "Chỉ phù hợp trồng các loại cây ngũ cốc thân cao",
      "Đòi hỏi diện tích đất canh tác rộng hơn cánh đồng"
    ],
    "optionsVi": [
      "Tiết kiệm tới 95% lượng nước ngọt tiêu thụ (Cuts water usage by up to 95%)",
      "Giảm hoàn toàn chi phí tiêu thụ điện năng chiếu sáng",
      "Chỉ phù hợp trồng các loại cây ngũ cốc thân cao",
      "Đòi hỏi diện tích đất canh tác rộng hơn cánh đồng"
    ],
    "optionsEn": [
      "Cuts freshwater usage by up to 95%",
      "Completely eliminates electrical lighting expenditure",
      "Exclusively viable for tall cereal grains",
      "Requires larger surface acreage than rural farms"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tiết kiệm tới 95% lượng nước ngọt tiêu thụ (Cuts water usage by up to 95%)",
    "correctAnswerEn": "Cuts freshwater usage by up to 95%",
    "explanation": "Bài đọc nêu rõ: \"This method cuts water usage by up to 95% compared with conventional open-field agriculture\".",
    "explanationVi": "Bài đọc nêu rõ: \"This method cuts water usage by up to 95% compared with conventional open-field agriculture\".",
    "explanationEn": "The text directly highlights that vertical indoor agriculture \"cuts water usage by up to 95% compared with conventional open-field agriculture\"."
  },
  {
    "id": "b3_easy_read_c17_p1_01",
    "difficulty": "easy",
    "topic": "urbanization",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 17 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Kỹ thuật thi công nào được sử dụng để xây dựng tuyến đường sắt đô thị ngầm đầu tiên tại London?",
    "promptVi": "Kỹ thuật thi công nào được sử dụng để xây dựng tuyến đường sắt đô thị ngầm đầu tiên tại London?",
    "promptEn": "Which engineering methodology was utilized to build the world's earliest London Underground line?",
    "context": "The Metropolitan Railway opened in 1863 using the \"cut-and-cover\" method: a massive trench was excavated along public streets, brick tunnels were constructed, and the roadway was subsequently rebuilt overhead.",
    "contextVi": "Tuyến đường sắt Metropolitan mở cửa năm 1863 bằng phương pháp \"đào và lấp\" (cut-and-cover): một rãnh hào khổng lồ được đào dọc các con phố công cộng, xây dựng hầm gạch, rồi làm lại mặt đường bên trên.",
    "contextEn": "The Metropolitan Railway opened in 1863 using the \"cut-and-cover\" method: a massive trench was excavated along public streets, brick tunnels were constructed, and the roadway was subsequently rebuilt overhead.",
    "options": [
      "Phương pháp đào và lấp (Cut-and-cover technique)",
      "Khiên đào hầm áp lực sâu (Deep pneumatic shield tunneling)",
      "Khoan nổ mìn bằng thuốc nổ dynamite",
      "Lắp ghép hầm đúc sẵn dưới đáy sông"
    ],
    "optionsVi": [
      "Phương pháp đào và lấp (Cut-and-cover technique)",
      "Khiên đào hầm áp lực sâu (Deep pneumatic shield tunneling)",
      "Khoan nổ mìn bằng thuốc nổ dynamite",
      "Lắp ghép hầm đúc sẵn dưới đáy sông"
    ],
    "optionsEn": [
      "Cut-and-cover excavation method",
      "Deep pneumatic shield tunneling",
      "Subterranean dynamite blasting",
      "Submerged precast concrete tube assembly"
    ],
    "correctIndex": 0,
    "correctAnswer": "Phương pháp đào và lấp (Cut-and-cover technique)",
    "correctAnswerEn": "Cut-and-cover excavation method",
    "explanation": "Đoạn văn xác nhận rõ: \"The Metropolitan Railway opened in 1863 using the cut-and-cover method\".",
    "explanationVi": "Đoạn văn xác nhận rõ: \"The Metropolitan Railway opened in 1863 using the cut-and-cover method\".",
    "explanationEn": "The passage explicitly names the \"cut-and-cover\" excavation method as the technique used for the 1863 Metropolitan Railway."
  },
  {
    "id": "b3_easy_read_c16_p1_01",
    "difficulty": "easy",
    "topic": "science",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "Cambridge 16 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Đánh giá nhận định theo nghiên cứu về mối liên kết giữa loài chó và con người:",
    "promptVi": "Đánh giá nhận định theo thông tin nghiên cứu về mối liên kết giữa loài chó và con người:",
    "promptEn": "Evaluate the statement based on the Cambridge 16 study of canine-human attachment:",
    "context": "Passage: Neurobiological scans demonstrate that mutual eye contact between domestic dogs and their owners triggers a reciprocal surge in oxytocin—the hormone responsible for bonding—mimicking the physiological feedback loop observed between mothers and infants.\n\nStatement: Mutual gaze between dogs and their owners stimulates the production of oxytocin.",
    "contextVi": "Đoạn văn: Quét hình ảnh sinh học thần kinh chứng minh rằng việc nhìn vào mắt nhau giữa chó nhà và chủ nhân kích hoạt sự gia tăng oxytocin - hormone chịu trách nhiệm gắn kết - mô phỏng vòng phản hồi sinh lý giữa mẹ và trẻ sơ sinh.\n\nNhận định: Việc nhìn vào mắt nhau giữa chó và chủ nhân kích thích sản sinh oxytocin.",
    "contextEn": "Passage: Neurobiological scans demonstrate that mutual eye contact between domestic dogs and their owners triggers a reciprocal surge in oxytocin—the hormone responsible for bonding—mimicking the physiological feedback loop observed between mothers and infants.\n\nStatement: Mutual gaze between dogs and their owners stimulates the production of oxytocin.",
    "options": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "TRUE (Đúng với bài)",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "TRUE",
    "correctAnswerEn": "TRUE",
    "explanation": "\"Mutual eye contact... triggers a reciprocal surge in oxytocin\" hoàn toàn đồng nghĩa với nhận định \"Mutual gaze stimulates the production of oxytocin\".",
    "explanationVi": "\"Mutual eye contact... triggers a reciprocal surge in oxytocin\" hoàn toàn đồng nghĩa với nhận định \"Mutual gaze stimulates the production of oxytocin\".",
    "explanationEn": "The passage confirms that \"mutual eye contact... triggers a reciprocal surge in oxytocin\", verifying the statement as TRUE."
  },
  {
    "id": "b3_easy_grammar_01",
    "difficulty": "easy",
    "topic": "education",
    "skillCategory": "grammar",
    "type": "hedging",
    "cambridgeSource": "Academic Hedging Handbook - Modal Distractors",
    "prompt": "Chọn phương án sử dụng từ giảm nhẹ (hedging) phù hợp nhất cho văn phong học thuật:",
    "promptVi": "Chọn phương án sử dụng từ giảm nhẹ (hedging) phù hợp nhất cho văn phong học thuật:",
    "promptEn": "Select the sentence that properly incorporates academic hedging to avoid over-generalization:",
    "context": "Which version presents a balanced, evidence-based academic claim?",
    "contextVi": "Phiên bản nào thể hiện lập luận học thuật chuẩn mực, tránh phán đoán tuyệt đối hóa?",
    "contextEn": "Which version presents a balanced, evidence-based academic claim?",
    "options": [
      "The evidence suggests that excessive screen exposure tends to correlate with reduced sleep duration.",
      "Screen exposure always and completely destroys sleep for all children.",
      "There is zero doubt that computers cause 100% of insomnia cases.",
      "Smartphones undeniably ruin every single student's cognitive capacity."
    ],
    "optionsVi": [
      "The evidence suggests that excessive screen exposure tends to correlate with reduced sleep duration. (Chuẩn học thuật: suggests, tends to)",
      "Screen exposure always and completely destroys sleep for all children. (Tuyệt đối hóa sai lệch)",
      "There is zero doubt that computers cause 100% of insomnia cases. (Phán đoán cực đoan)",
      "Smartphones undeniably ruin every single student's cognitive capacity. (Ngôn ngữ cảm tính)"
    ],
    "optionsEn": [
      "The evidence suggests that excessive screen exposure tends to correlate with reduced sleep duration.",
      "Screen exposure always and completely destroys sleep for all children.",
      "There is zero doubt that computers cause 100% of insomnia cases.",
      "Smartphones undeniably ruin every single student's cognitive capacity."
    ],
    "correctIndex": 0,
    "correctAnswer": "The evidence suggests that excessive screen exposure tends to correlate with reduced sleep duration.",
    "correctAnswerEn": "The evidence suggests that excessive screen exposure tends to correlate with reduced sleep duration.",
    "explanation": "Văn phong học thuật IELTS Writing tránh dùng các từ tuyệt đối (\"always\", \"completely\", \"zero doubt\") mà dùng các động từ dè dặt như \"suggests\", \"tends to correlate\".",
    "explanationVi": "Văn phong học thuật IELTS Writing tránh dùng các từ tuyệt đối (\"always\", \"completely\", \"zero doubt\") mà dùng các động từ dè dặt như \"suggests\", \"tends to correlate\".",
    "explanationEn": "Academic register mandates cautious language (\"suggests\", \"tends to correlate\") over dogmatic absolutes like \"always\" or \"completely\"."
  },
  {
    "id": "b3_easy_vis_chart_01",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "visual_data",
    "type": "chart_reading",
    "cambridgeSource": "Writing Task 1 Data Bank - Trend Analysis",
    "prompt": "Dựa vào bảng số liệu, xu hướng nổi bật nhất của dòng vốn FDI vào năng lượng tái tạo là gì?",
    "promptVi": "Dựa vào bảng số liệu, xu hướng nổi bật nhất của dòng vốn FDI vào năng lượng tái tạo là gì?",
    "promptEn": "Based on the trend summary, what was the principal trajectory of FDI in renewable technologies?",
    "context": "Data Overview: 2010: $45 billion -> 2015: $110 billion -> 2020: $280 billion -> 2025: $490 billion.",
    "contextVi": "Dữ liệu: Năm 2010 ($45 tỷ) -> 2015 ($110 tỷ) -> 2020 ($280 tỷ) -> 2025 ($490 tỷ).",
    "contextEn": "Data Overview: 2010: $45 billion -> 2015: $110 billion -> 2020: $280 billion -> 2025: $490 billion.",
    "options": [
      "Tăng trưởng liên tục hơn 10 lần trong vòng 15 năm (Over a tenfold continuous increase)",
      "Dao động thất thường không có xu hướng rõ ràng",
      "Giảm mạnh vào giai đoạn 2015 - 2020",
      "Đạt đỉnh vào năm 2010 rồi đi ngang"
    ],
    "optionsVi": [
      "Tăng trưởng liên tục hơn 10 lần trong vòng 15 năm (Over a tenfold continuous increase)",
      "Dao động thất thường không có xu hướng rõ ràng",
      "Giảm mạnh vào giai đoạn 2015 - 2020",
      "Đạt đỉnh vào năm 2010 rồi đi ngang"
    ],
    "optionsEn": [
      "A tenfold sustained upward trajectory over 15 years",
      "Erratic fluctuations without discernable pattern",
      "A sharp contraction between 2015 and 2020",
      "Peaked in 2010 followed by stagnation"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tăng trưởng liên tục hơn 10 lần trong vòng 15 năm (Over a tenfold continuous increase)",
    "correctAnswerEn": "A tenfold sustained upward trajectory over 15 years",
    "explanation": "Dữ liệu tăng liên tục từ $45 tỷ lên $490 tỷ (hơn 10 lần), thể hiện xu hướng tăng trưởng bền vững (\"sustained upward trajectory\").",
    "explanationVi": "Dữ liệu tăng liên tục từ $45 tỷ lên $490 tỷ (hơn 10 lần), thể hiện xu hướng tăng trưởng bền vững (\"sustained upward trajectory\").",
    "explanationEn": "Investment rose continuously from $45B to $490B, representing an uninterrupted tenfold expansion."
  },
  {
    "id": "b3_med_read_c20_p1_02",
    "difficulty": "medium",
    "topic": "environment",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Hành vi sinh sản nào của loài kākāpō khiến chúng đặc biệt nhạy cảm với sự tuyệt chủng?",
    "promptVi": "Hành vi sinh sản nào của loài kākāpō khiến chúng đặc biệt nhạy cảm với sự tuyệt chủng?",
    "promptEn": "Which reproductive characteristic renders the kākāpō species acutely vulnerable to population collapse?",
    "context": "The species exhibits a lek breeding system wherein males assemble in hollow bowls to produce booming calls. Reproduction occurs solely every two to four years, synchronised strictly with the mass fruiting (masting) of rimu trees. In non-masting years, no breeding takes place.",
    "contextVi": "Loài này thể hiện hệ thống ghép đôi theo bầy (lek breeding) khi con đực tập hợp phát ra tiếng kêu trầm bổng. Việc sinh sản chỉ diễn ra 2 đến 4 năm một lần, đồng bộ nghiêm ngặt với mùa đậu quả hàng loạt của cây rimu bản địa. Những năm cây không đậu quả, chúng hoàn toàn không sinh sản.",
    "contextEn": "The species exhibits a lek breeding system wherein males assemble in hollow bowls to produce booming calls. Reproduction occurs solely every two to four years, synchronised strictly with the mass fruiting (masting) of rimu trees. In non-masting years, no breeding takes place.",
    "options": [
      "Chỉ sinh sản 2 đến 4 năm một lần phụ thuộc mùa quả rimu (Breeds only every 2-4 years)",
      "Đẻ mỗi lứa hàng chục trứng nhưng không biết ấp",
      "Chỉ giao phối khi di cư qua các đảo xa xôi",
      "Từ chối sinh sản khi nuôi nhốt trong lồng"
    ],
    "optionsVi": [
      "Chỉ sinh sản 2 đến 4 năm một lần phụ thuộc mùa quả rimu (Breeds only every 2-4 years)",
      "Đẻ mỗi lứa hàng chục trứng nhưng không biết ấp",
      "Chỉ giao phối khi di cư qua các đảo xa xôi",
      "Từ chối sinh sản khi nuôi nhốt trong lồng"
    ],
    "optionsEn": [
      "Breeding only every 2–4 years synchronized with rimu mast fruiting",
      "Laying dozens of eggs per clutch but failing to brood",
      "Mating exclusively following inter-island maritime migration",
      "Refusing to copulate in predator-free island enclosures"
    ],
    "correctIndex": 0,
    "correctAnswer": "Chỉ sinh sản 2 đến 4 năm một lần phụ thuộc mùa quả rimu (Breeds only every 2-4 years)",
    "correctAnswerEn": "Breeding only every 2–4 years synchronized with rimu mast fruiting",
    "explanation": "Đoạn văn nêu rõ sự gián đoạn sinh sản: \"Reproduction occurs solely every two to four years, synchronised strictly with the mass fruiting of rimu trees\".",
    "explanationVi": "Đoạn văn nêu rõ sự gián đoạn sinh sản: \"Reproduction occurs solely every two to four years, synchronised strictly with the mass fruiting of rimu trees\".",
    "explanationEn": "The text highlights that reproduction happens exclusively every two to four years during native rimu mast fruiting seasons."
  },
  {
    "id": "b3_med_read_c20_p2_01",
    "difficulty": "medium",
    "topic": "science",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 2)",
    "prompt": "Vật trung gian (vector) truyền nấm gây bệnh héo rũ cây du (Dutch Elm Disease) là gì?",
    "promptVi": "Vật trung gian (vector) truyền nấm gây bệnh héo rũ cây du (Dutch Elm Disease) là gì?",
    "promptEn": "What biological vector is responsible for transmitting the pathogenic fungus in Dutch Elm Disease?",
    "context": "The lethal ascomycete fungus Ophiostoma novo-ulmi relies on bark beetles of the genus Scolytus as its primary transmission vector. When emerging adults bore feeding grooves in healthy elm twig crotches, fungal spores adhering to their bodies infect the tree's vascular xylems.",
    "contextVi": "Loài nấm ascomycete Ophiostoma novo-ulmi phụ thuộc vào bọ cánh cứng vỏ cây chi Scolytus làm vật trung gian truyền bệnh chính. Khi bọ trưởng thành đục các rãnh ăn trên nhánh cây du khỏe mạnh, các bào tử nấm dính trên thân chúng sẽ xâm nhập mạch gỗ của cây.",
    "contextEn": "The lethal ascomycete fungus Ophiostoma novo-ulmi relies on bark beetles of the genus Scolytus as its primary transmission vector. When emerging adults bore feeding grooves in healthy elm twig crotches, fungal spores adhering to their bodies infect the tree's vascular xylems.",
    "options": [
      "Bọ cánh cứng đục vỏ cây chi Scolytus (Scolytus bark beetles)",
      "Các đàn chim di cư mang bào tử nấm",
      "Nước mưa axit thấm qua rễ ngầm",
      "Tuyến trùng ký sinh trong đất"
    ],
    "optionsVi": [
      "Bọ cánh cứng đục vỏ cây chi Scolytus (Scolytus bark beetles)",
      "Các đàn chim di cư mang bào tử nấm",
      "Nước mưa axit thấm qua rễ ngầm",
      "Tuyến trùng ký sinh trong đất"
    ],
    "optionsEn": [
      "Scolytus genus bark beetles",
      "Migratory avian spore carriers",
      "Acid rain leaching through subsoil",
      "Soil-dwelling parasitic nematodes"
    ],
    "correctIndex": 0,
    "correctAnswer": "Bọ cánh cứng đục vỏ cây chi Scolytus (Scolytus bark beetles)",
    "correctAnswerEn": "Scolytus genus bark beetles",
    "explanation": "Đoạn văn chỉ rõ bọ cánh cứng vỏ cây \"bark beetles of the genus Scolytus\" là vật trung gian (\"primary transmission vector\") truyền bào tử nấm.",
    "explanationVi": "Đoạn văn chỉ rõ bọ cánh cứng vỏ cây \"bark beetles of the genus Scolytus\" là vật trung gian (\"primary transmission vector\") truyền bào tử nấm.",
    "explanationEn": "The passage explicitly names \"bark beetles of the genus Scolytus\" as the primary transmission vector of fungal spores."
  },
  {
    "id": "b3_med_read_c18_p2_01",
    "difficulty": "medium",
    "topic": "education",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 2)",
    "prompt": "Mục tiêu cốt lõi của phong trào \"Trường học trong rừng\" (Forest Schools) là gì?",
    "promptVi": "Mục tiêu cốt lõi của phong trào \"Trường học trong rừng\" (Forest Schools) là gì?",
    "promptEn": "According to Cambridge 18, what is the central pedagogical objective of the Forest Schools movement?",
    "context": "Originating in Scandinavia, Forest Schools prioritize learner-led discovery through regular outdoor sessions in woodland ecosystems. Rather than shielding children from every hazard, practitioners introduce manageable risk—such as whittling wood with supervised blades and fire-making—to cultivate resilience and emotional self-regulation.",
    "contextVi": "Bắt nguồn từ vùng Scandinavia, mô hình Trường học trong rừng ưu tiên việc khám phá do người học tự dẫn dắt thông qua các buổi học ngoài trời định kỳ. Thay vì bao bọc bảo vệ trẻ khỏi mọi hiểm nguy, các chuyên viên áp dụng \"rủi ro có thể kiểm soát\" (manageable risk) như gọt gỗ có giám sát và nhóm lửa để xây dựng tính kiên cường và khả năng tự điều chỉnh cảm xúc.",
    "contextEn": "Originating in Scandinavia, Forest Schools prioritize learner-led discovery through regular outdoor sessions in woodland ecosystems. Rather than shielding children from every hazard, practitioners introduce manageable risk—such as whittling wood with supervised blades and fire-making—to cultivate resilience and emotional self-regulation.",
    "options": [
      "Rèn luyện sự kiên cường thông qua rủi ro có thể kiểm soát (Cultivate resilience via manageable risk)",
      "Đào tạo kỹ năng sinh tồn chuyên nghiệp để trở thành kiểm lâm",
      "Thay thế hoàn toàn chương trình học toán và ngôn ngữ truyền thống",
      "Ngăn chặn trẻ em tiếp xúc với các công cụ kim loại"
    ],
    "optionsVi": [
      "Rèn luyện sự kiên cường thông qua rủi ro có thể kiểm soát (Cultivate resilience via manageable risk)",
      "Đào tạo kỹ năng sinh tồn chuyên nghiệp để trở thành kiểm lâm",
      "Thay thế hoàn toàn chương trình học toán và ngôn ngữ truyền thống",
      "Ngăn chặn trẻ em tiếp xúc với các công cụ kim loại"
    ],
    "optionsEn": [
      "Cultivating emotional resilience and self-regulation via manageable risk",
      "Training minors for professional wilderness rangers",
      "Completely abandoning literacy and mathematics curricula",
      "Prohibiting any interaction with metallic hand tools"
    ],
    "correctIndex": 0,
    "correctAnswer": "Rèn luyện sự kiên cường thông qua rủi ro có thể kiểm soát (Cultivate resilience via manageable risk)",
    "correctAnswerEn": "Cultivating emotional resilience and self-regulation via manageable risk",
    "explanation": "Bài viết nhấn mạnh việc cho trẻ tiếp cận \"manageable risk\" để bồi đắp tính tự cường và tự chủ cảm xúc (\"cultivate resilience and emotional self-regulation\").",
    "explanationVi": "Bài viết nhấn mạnh việc cho trẻ tiếp cận \"manageable risk\" để bồi đắp tính tự cường và tự chủ cảm xúc (\"cultivate resilience and emotional self-regulation\").",
    "explanationEn": "The passage underscores the introduction of \"manageable risk\" to develop children's emotional resilience and autonomy."
  },
  {
    "id": "b3_med_read_c18_p3_01",
    "difficulty": "medium",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 3)",
    "prompt": "Đánh giá nhận định về rác thải không gian quỹ đạo Trái Đất (Space Debris):",
    "promptVi": "Đánh giá nhận định về rác thải không gian quỹ đạo Trái Đất (Space Debris):",
    "promptEn": "Evaluate the statement regarding orbital space debris according to Cambridge 18:",
    "context": "Passage: The Kessler Syndrome describes a catastrophic tipping point in Low Earth Orbit where orbital object density is high enough that collisions produce cascades of fragments, each becoming an untracked projectile capable of triggering further impacts.\n\nStatement: In the Kessler Syndrome scenario, every new collision creates fragments that amplify the likelihood of subsequent orbital impacts.",
    "contextVi": "Đoạn văn: Hội chứng Kessler mô tả một điểm bùng phát thảm họa ở Quỹ đạo tầm thấp Trái Đất nơi mật độ vật thể đủ dày đặc khiến các vụ va chạm sinh ra hàng loạt mảnh vỡ, mỗi mảnh vỡ lại trở thành một đầu đạn không thể theo dõi có khả năng kích hoạt thêm nhiều vụ va chạm tiếp theo.\n\nNhận định: Trong kịch bản Hội chứng Kessler, mỗi vụ va chạm mới sinh ra các mảnh vỡ làm gia tăng nguy cơ của các vụ va chạm quỹ đạo tiếp theo.",
    "contextEn": "Passage: The Kessler Syndrome describes a catastrophic tipping point in Low Earth Orbit where orbital object density is high enough that collisions produce cascades of fragments, each becoming an untracked projectile capable of triggering further impacts.\n\nStatement: In the Kessler Syndrome scenario, every new collision creates fragments that amplify the likelihood of subsequent orbital impacts.",
    "options": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "TRUE (Đúng hoàn toàn với nội dung chuỗi va chạm phân mảnh)",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "TRUE",
    "correctAnswerEn": "TRUE",
    "explanation": "Khái niệm Kessler Syndrome xác nhận vụ va chạm tạo ra mảnh vỡ (\"cascades of fragments... capable of triggering further impacts\"), hoàn toàn khớp với phát biểu.",
    "explanationVi": "Khái niệm Kessler Syndrome xác nhận vụ va chạm tạo ra mảnh vỡ (\"cascades of fragments... capable of triggering further impacts\"), hoàn toàn khớp với phát biểu.",
    "explanationEn": "The description of cascading fragments triggering further impacts directly confirms the statement as TRUE."
  },
  {
    "id": "b3_med_read_c17_p2_01",
    "difficulty": "medium",
    "topic": "urbanization",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 17 Academic - Reading Test 1 (Passage 2)",
    "prompt": "Theo Cambridge 17, tại sao các sân vận động hiện đại chuyển hướng thiết kế thành tổ hợp đa năng?",
    "promptVi": "Theo Cambridge 17, tại sao các sân vận động hiện đại chuyển hướng thiết kế thành tổ hợp đa năng?",
    "promptEn": "Why are contemporary stadium architects designing sports venues as multi-functional complexes?",
    "context": "Historically, specialized mega-stadiums stood vacant for over three hundred days a year, creating financial white elephants. Modern designs integrate retail hubs, conference centres, and modular retractable pitches to ensure uninterrupted daily economic activity.",
    "contextVi": "Trong lịch sử, các siêu sân vận động đơn năng thường bị bỏ hoang hơn 300 ngày mỗi năm, trở thành gánh nặng tài chính. Thiết kế hiện đại tích hợp các trung tâm bán lẻ, hội nghị và mặt sân trượt đa năng để đảm bảo hoạt động kinh tế diễn ra liên tục mỗi ngày.",
    "contextEn": "Historically, specialized mega-stadiums stood vacant for over three hundred days a year, creating financial white elephants. Modern designs integrate retail hubs, conference centres, and modular retractable pitches to ensure uninterrupted daily economic activity.",
    "options": [
      "Để tránh lãng phí kinh tế và tạo nguồn thu liên tục quanh năm (Avoid financial white elephants)",
      "Để giảm tải trọng lực lượng khán giả bóng đá cuối tuần",
      "Để loại bỏ hoàn toàn các khu vực thi đấu thể thao",
      "Do các quy chuẩn xây dựng cấm sân vận động ngoài trời"
    ],
    "optionsVi": [
      "Để tránh lãng phí kinh tế và tạo nguồn thu liên tục quanh năm (Avoid financial white elephants)",
      "Để giảm tải trọng lực lượng khán giả bóng đá cuối tuần",
      "Để loại bỏ hoàn toàn các khu vực thi đấu thể thao",
      "Do các quy chuẩn xây dựng cấm sân vận động ngoài trời"
    ],
    "optionsEn": [
      "To avoid idle white-elephant expenditures and generate sustained year-round revenue",
      "To decrease weekend spectator capacity for professional football",
      "To gradually phase out athletic competitions entirely",
      "Because urban planning codes forbid open-air venues"
    ],
    "correctIndex": 0,
    "correctAnswer": "Để tránh lãng phí kinh tế và tạo nguồn thu liên tục quanh năm (Avoid financial white elephants)",
    "correctAnswerEn": "To avoid idle white-elephant expenditures and generate sustained year-round revenue",
    "explanation": "Bài viết đối chiếu thực trạng \"financial white elephants\" (bỏ hoang hơn 300 ngày) với giải pháp đa năng nhằm duy trì \"uninterrupted daily economic activity\".",
    "explanationVi": "Bài viết đối chiếu thực trạng \"financial white elephants\" (bỏ hoang hơn 300 ngày) với giải pháp đa năng nhằm duy trì \"uninterrupted daily economic activity\".",
    "explanationEn": "Architects integrate commercial and event functions to prevent idle maintenance costs (\"financial white elephants\") and generate daily revenues."
  },
  {
    "id": "b3_med_read_101_t2_p1_01",
    "difficulty": "medium",
    "topic": "environment",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 2 (Passage 1)",
    "prompt": "Thiết bị TED (Turtle Excluder Device) hoạt động theo nguyên lý cơ học nào trong lưới đánh cá?",
    "promptVi": "Thiết bị TED (Turtle Excluder Device) hoạt động theo nguyên lý cơ học nào trong lưới đánh cá?",
    "promptEn": "How does a Turtle Excluder Device (TED) mechanically prevent sea turtle bycatch in trawl nets?",
    "context": "A Turtle Excluder Device is a specialized metal grid fitted into shrimp trawl nets. While small shrimp pass freely through the bars into the net bag, large sea turtles bump against the slanted bars and are deflected outward through an escape hatch flap.",
    "contextVi": "Thiết bị loại trừ rùa (TED) là một khung kim loại chuyên dụng gắn vào lưới kéo tôm. Trong khi tôm nhỏ lọt tự do qua các song chắn vào túi lưới, rùa biển lớn khi va vào các thanh chắn nghiêng sẽ được dẫn hướng thoát ra ngoài qua một nắp thoát hiểm.",
    "contextEn": "A Turtle Excluder Device is a specialized metal grid fitted into shrimp trawl nets. While small shrimp pass freely through the bars into the net bag, large sea turtles bump against the slanted bars and are deflected outward through an escape hatch flap.",
    "options": [
      "Khung kim loại nghiêng dẫn rùa thoát ra ngoài nắp lưới (Slanted metal grid with escape flap)",
      "Hệ thống sóng siêu âm xua đuổi rùa từ xa",
      "Đèn LED phát quang sinh học gắn trên phao lưới",
      "Lưới tự động phân hủy sinh học khi chạm vào mai rùa"
    ],
    "optionsVi": [
      "Khung kim loại nghiêng dẫn rùa thoát ra ngoài nắp lưới (Slanted metal grid with escape flap)",
      "Hệ thống sóng siêu âm xua đuổi rùa từ xa",
      "Đèn LED phát quang sinh học gắn trên phao lưới",
      "Lưới tự động phân hủy sinh học khi chạm vào mai rùa"
    ],
    "optionsEn": [
      "A slanted grid that deflects large turtles out through an escape flap while retaining shrimp",
      "An ultrasonic acoustic beacon that deters approaching turtles",
      "Bioluminescent strobe diodes mounted on perimeter net corks",
      "Enzymatic netting that dissolves upon contact with turtle carapaces"
    ],
    "correctIndex": 0,
    "correctAnswer": "Khung kim loại nghiêng dẫn rùa thoát ra ngoài nắp lưới (Slanted metal grid with escape flap)",
    "correctAnswerEn": "A slanted grid that deflects large turtles out through an escape flap while retaining shrimp",
    "explanation": "Đoạn văn giải thích rõ cấu tạo: \"metal grid... large sea turtles bump against the slanted bars and are deflected outward through an escape hatch flap\".",
    "explanationVi": "Đoạn văn giải thích rõ cấu tạo: \"metal grid... large sea turtles bump against the slanted bars and are deflected outward through an escape hatch flap\".",
    "explanationEn": "The passage explains that small shrimp pass through grid bars while larger sea turtles are guided out via the escape hatch flap."
  },
  {
    "id": "b3_med_read_101_t2_p2_01",
    "difficulty": "medium",
    "topic": "economy",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 2 (Passage 2)",
    "prompt": "Khái niệm \"Greenwashing\" trong quản trị doanh nghiệp ám chỉ hành vi nào?",
    "promptVi": "Khái niệm \"Greenwashing\" trong quản trị doanh nghiệp ám chỉ hành vi nào?",
    "promptEn": "What corporate practice is denoted by the critical term \"Greenwashing\"?",
    "context": "When consumer skepticism surrounds corporate social responsibility, critics cite greenwashing—the practice of spending substantially more capital on marketing environmentally friendly imagery than on actual emissions reduction or sustainable operational changes.",
    "contextVi": "Khi sự hoài nghi của người tiêu dùng bủa vây trách nhiệm xã hội của doanh nghiệp, các nhà phê bình chỉ ra hiện tượng \"greenwashing\" (tẩy xanh) - hành vi chi nhiều tiền vào việc quảng cáo hình ảnh thân thiện môi trường hơn là thực hiện cắt giảm khí thải thực tế.",
    "contextEn": "When consumer skepticism surrounds corporate social responsibility, critics cite greenwashing—the practice of spending substantially more capital on marketing environmentally friendly imagery than on actual emissions reduction or sustainable operational changes.",
    "options": [
      "Chi tiền quảng cáo hình ảnh xanh nhiều hơn cắt giảm khí thải thực tế (Deceptive eco-marketing)",
      "Lắp đặt các hệ thống xử lý nước thải đắt đỏ",
      "Áp dụng công nghệ rửa trôi hóa chất bằng enzyme sinh học",
      "Công khai minh bạch toàn bộ chuỗi cung ứng carbon"
    ],
    "optionsVi": [
      "Chi tiền quảng cáo hình ảnh xanh nhiều hơn cắt giảm khí thải thực tế (Deceptive eco-marketing)",
      "Lắp đặt các hệ thống xử lý nước thải đắt đỏ",
      "Áp dụng công nghệ rửa trôi hóa chất bằng enzyme sinh học",
      "Công khai minh bạch toàn bộ chuỗi cung ứng carbon"
    ],
    "optionsEn": [
      "Spending more funds marketing an eco-friendly image than executing genuine decarbonization",
      "Investing substantial capital into municipal wastewater infrastructure",
      "Employing biological enzyme washes on industrial pipelines",
      "Publishing third-party audited carbon footprints across the supply chain"
    ],
    "correctIndex": 0,
    "correctAnswer": "Chi tiền quảng cáo hình ảnh xanh nhiều hơn cắt giảm khí thải thực tế (Deceptive eco-marketing)",
    "correctAnswerEn": "Spending more funds marketing an eco-friendly image than executing genuine decarbonization",
    "explanation": "Định nghĩa nêu rõ: \"spending substantially more capital on marketing environmentally friendly imagery than on actual emissions reduction\".",
    "explanationVi": "Định nghĩa nêu rõ: \"spending substantially more capital on marketing environmentally friendly imagery than on actual emissions reduction\".",
    "explanationEn": "\"Greenwashing\" describes disproportionate expenditures on eco-friendly PR relative to substantive environmental remediation."
  },
  {
    "id": "b3_med_lis_c8_t2_p3_01",
    "difficulty": "medium",
    "topic": "science",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 2 Listening Part 3",
    "prompt": "Loài ký sinh trùng nào là mối đe dọa lớn nhất đối với đàn ong mật theo bài nghe?",
    "promptVi": "Loài ký sinh trùng nào là mối đe dọa lớn nhất đối với đàn ong mật theo bài nghe?",
    "promptEn": "Which specific parasitic organism is highlighted as the primary ecological threat to honey bee colonies?",
    "context": "Student A: We looked at fungal spores first, but our supervisor clarified that the invasive Varroa destructor mite causes the most severe colony collapse by transmitting debilitating wing deformities.",
    "contextVi": "Student A: We looked at fungal spores first, but our supervisor clarified that the invasive Varroa destructor mite causes the most severe colony collapse by transmitting debilitating wing deformities.",
    "contextEn": "Student A: We looked at fungal spores first, but our supervisor clarified that the invasive Varroa destructor mite causes the most severe colony collapse by transmitting debilitating wing deformities.",
    "options": [
      "Bét ký sinh Varroa (Varroa destructor mite)",
      "Bào tử nấm vi khuẩn trong tổ (Fungal hive spores)",
      "Thuốc trừ sâu hóa học trong nước tưới",
      "Chim ăn ong di cư theo mùa"
    ],
    "optionsVi": [
      "Bét ký sinh Varroa (Varroa destructor mite)",
      "Bào tử nấm vi khuẩn trong tổ (Fungal hive spores)",
      "Thuốc trừ sâu hóa học trong nước tưới",
      "Chim ăn ong di cư theo mùa"
    ],
    "optionsEn": [
      "Varroa destructor mite",
      "Airborne fungal spores",
      "Neonicotinoid irrigation runoff",
      "Migratory avian predators"
    ],
    "correctIndex": 0,
    "correctAnswer": "Bét ký sinh Varroa (Varroa destructor mite)",
    "correctAnswerEn": "Varroa destructor mite",
    "explanation": "Sinh viên ban đầu xét đến nấm (\"fungal spores first\"), nhưng giáo viên hướng dẫn làm rõ mối đe dọa hàng đầu là bét ký sinh (\"Varroa destructor mite causes the most severe colony collapse\").",
    "explanationVi": "Sinh viên ban đầu xét đến nấm (\"fungal spores first\"), nhưng giáo viên hướng dẫn làm rõ mối đe dọa hàng đầu là bét ký sinh (\"Varroa destructor mite causes the most severe colony collapse\").",
    "explanationEn": "The student corrects their initial hypothesis (fungal spores) after their supervisor confirms that the Varroa destructor mite causes the worst colony collapse."
  },
  {
    "id": "b3_med_vocab_03",
    "difficulty": "medium",
    "topic": "economy",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Collocations & Synonyms - Band 7.0 Target",
    "prompt": "Chọn tính từ học thuật C1 diễn tả một \"khoản đầu tư sinh lời cao\":",
    "promptVi": "Chọn tính từ học thuật C1 diễn tả một \"khoản đầu tư sinh lời cao\":",
    "promptEn": "Select the high-yield C1 academic adjective to replace \"profitable\" in an economic essay:",
    "context": "The venture capital firm secured a highly _____ commercial partnership in green hydrogen.",
    "contextVi": "The venture capital firm secured a highly _____ commercial partnership in green hydrogen.",
    "contextEn": "The venture capital firm secured a highly _____ commercial partnership in green hydrogen.",
    "options": [
      "lucrative",
      "precarious",
      "volatile",
      "stagnant"
    ],
    "optionsVi": [
      "lucrative (sinh lời béo bở, lợi nhuận cao)",
      "precarious (bấp bênh, nguy hiểm)",
      "volatile (dễ biến động thất thường)",
      "stagnant (trì trệ)"
    ],
    "optionsEn": [
      "lucrative",
      "precarious",
      "volatile",
      "stagnant"
    ],
    "correctIndex": 0,
    "correctAnswer": "lucrative",
    "correctAnswerEn": "lucrative",
    "explanation": "\"Lucrative\" (producing a great deal of profit) là từ vựng nâng cấp Band 7.5+ chuẩn cho \"profitable\".",
    "explanationVi": "\"Lucrative\" (producing a great deal of profit) là từ vựng nâng cấp Band 7.5+ chuẩn cho \"profitable\".",
    "explanationEn": "\"Lucrative\" is the standard C1 lexical upgrade for \"highly profitable\" in formal business writing."
  },
  {
    "id": "b3_med_vis_map_01",
    "difficulty": "medium",
    "topic": "urbanization",
    "skillCategory": "visual_data",
    "type": "visual_data",
    "cambridgeSource": "Writing Task 1 Map Transformation Bank",
    "prompt": "Theo bản đồ quy hoạch, cơ sở hạ tầng nào đã được xây dựng thay thế cho khu đất công nghiệp cũ ở phía Tây?",
    "promptVi": "Theo bản đồ quy hoạch, cơ sở hạ tầng nào đã được xây dựng thay thế cho khu đất công nghiệp cũ ở phía Tây?",
    "promptEn": "According to the development layout, what facility replaced the former industrial zone on the western perimeter?",
    "context": "Blueprint comparison: In 2000, the western sector comprised an abandoned textile factory. By 2025, this site has been redeveloped into a high-density student residential precinct with pedestrianized avenues.",
    "contextVi": "So sánh bản đồ: Năm 2000, khu vực phía Tây gồm một nhà máy dệt bỏ hoang. Đến năm 2025, khu đất này đã được tái thiết thành khu ký túc xá sinh viên mật độ cao kèm lối đi bộ.",
    "contextEn": "Blueprint comparison: In 2000, the western sector comprised an abandoned textile factory. By 2025, this site has been redeveloped into a high-density student residential precinct with pedestrianized avenues.",
    "options": [
      "Khu ký túc xá sinh viên với lối đi bộ (Student residential precinct)",
      "Một trung tâm thương mại phức hợp 5 tầng",
      "Bãi đỗ xe ngầm nhiều tầng",
      "Khu liên hợp thể thao dưới nước"
    ],
    "optionsVi": [
      "Khu ký túc xá sinh viên với lối đi bộ (Student residential precinct)",
      "Một trung tâm thương mại phức hợp 5 tầng",
      "Bãi đỗ xe ngầm nhiều tầng",
      "Khu liên hợp thể thao dưới nước"
    ],
    "optionsEn": [
      "Student residential precinct with pedestrianized avenues",
      "A five-storey indoor shopping mall",
      "Multi-level underground parking complex",
      "An aquatic sports stadium"
    ],
    "correctIndex": 0,
    "correctAnswer": "Khu ký túc xá sinh viên với lối đi bộ (Student residential precinct)",
    "correctAnswerEn": "Student residential precinct with pedestrianized avenues",
    "explanation": "Dữ liệu bản đồ nêu rõ sự chuyển đổi: nhà máy dệt bỏ hoang được thay thế bằng \"high-density student residential precinct\".",
    "explanationVi": "Dữ liệu bản đồ nêu rõ sự chuyển đổi: nhà máy dệt bỏ hoang được thay thế bằng \"high-density student residential precinct\".",
    "explanationEn": "The map legend details the direct brownfield conversion of the derelict textile mill into a student residential precinct."
  },
  {
    "id": "b3_hard_read_c20_p3_01",
    "difficulty": "hard",
    "topic": "health",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 3)",
    "prompt": "Nồng độ cortisol tăng vọt khi căng thẳng cấp tính ảnh hưởng như thế nào đến khả năng ra quyết định?",
    "promptVi": "Nồng độ cortisol tăng vọt khi căng thẳng cấp tính ảnh hưởng như thế nào đến khả năng ra quyết định?",
    "promptEn": "How does an acute surge in circulating cortisol physiologically impair human decision-making under pressure?",
    "context": "When acute psychosocial stressors flood the systemic circulation with cortisol and noradrenaline, functional connectivity between the prefrontal cortex—the locus of analytical deliberative calculation—and the amygdala becomes disrupted. Consequently, individuals exhibit cognitive tunneling, defaulting to habitual heuristics and disproportionately overweighting immediate short-term losses over optimal strategic payoffs.",
    "contextVi": "Khi các tác nhân gây căng thẳng xã hội cấp tính làm tràn ngập tuần hoàn bằng cortisol và noradrenaline, tính kết nối chức năng giữa vỏ não trước trán (nơi xử lý tính toán phân tích) và hạch hạnh nhân bị gián đoạn. Do đó, con người rơi vào hiện tượng thu hẹp nhận thức (cognitive tunneling), quay về các thói quen phán đoán dựa vào trực giác và quá lo sợ các mất mát ngắn hạn trước mắt.",
    "contextEn": "When acute psychosocial stressors flood the systemic circulation with cortisol and noradrenaline, functional connectivity between the prefrontal cortex—the locus of analytical deliberative calculation—and the amygdala becomes disrupted. Consequently, individuals exhibit cognitive tunneling, defaulting to habitual heuristics and disproportionately overweighting immediate short-term losses over optimal strategic payoffs.",
    "options": [
      "Làm gián đoạn vỏ não trước trán, dẫn đến việc thu hẹp nhận thức và thiên vị mất mát ngắn hạn (Cognitive tunneling)",
      "Tăng cường khả năng tính toán toán học phức tạp",
      "Kích hoạt sự bình tĩnh tuyệt đối trong mọi tình huống khẩn cấp",
      "Vô hiệu hóa hoàn toàn ký ức dài hạn vĩnh viễn"
    ],
    "optionsVi": [
      "Làm gián đoạn vỏ não trước trán, dẫn đến việc thu hẹp nhận thức và thiên vị mất mát ngắn hạn (Cognitive tunneling)",
      "Tăng cường khả năng tính toán toán học phức tạp",
      "Kích hoạt sự bình tĩnh tuyệt đối trong mọi tình huống khẩn cấp",
      "Vô hiệu hóa hoàn toàn ký ức dài hạn vĩnh viễn"
    ],
    "optionsEn": [
      "Disrupts prefrontal connectivity, triggering cognitive tunneling and overweighting short-term losses",
      "Significantly enhances long-term mathematical probability calculations",
      "Induces complete emotional equilibrium across all emergency contexts",
      "Permanently obliterates historical episodic memory pathways"
    ],
    "correctIndex": 0,
    "correctAnswer": "Làm gián đoạn vỏ não trước trán, dẫn đến việc thu hẹp nhận thức và thiên vị mất mát ngắn hạn (Cognitive tunneling)",
    "correctAnswerEn": "Disrupts prefrontal connectivity, triggering cognitive tunneling and overweighting short-term losses",
    "explanation": "Đoạn văn phân tích: cortisol làm gián đoạn liên kết giữa vỏ não trước trán và hạch hạnh nhân, gây ra hiện tượng \"cognitive tunneling\" và khiến con người thiên vị mất mát ngắn hạn.",
    "explanationVi": "Đoạn văn phân tích: cortisol làm gián đoạn liên kết giữa vỏ não trước trán và hạch hạnh nhân, gây ra hiện tượng \"cognitive tunneling\" và khiến con người thiên vị mất mát ngắn hạn.",
    "explanationEn": "The text highlights that cortisol disrupts prefrontal-amygdala connectivity, provoking cognitive tunneling and an aversion to short-term risk."
  },
  {
    "id": "b3_hard_read_c16_p3_01",
    "difficulty": "hard",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 16 Academic - Reading Test 1 (Passage 3)",
    "prompt": "Hiện tượng \"Phân cực việc làm\" (Job Polarization) do tự động hóa AI được định nghĩa ra sao trong bài đọc?",
    "promptVi": "Hiện tượng \"Phân cực việc làm\" (Job Polarization) do tự động hóa AI được định nghĩa ra sao trong bài đọc?",
    "promptEn": "How does Cambridge 16 define \"Job Polarization\" induced by algorithmic automation in the labour market?",
    "context": "Economists observe that algorithmic task execution hollows out middle-skill routine occupations—such as administrative data entry, paralegal research, and assembly fabrication—while accelerating demand at the polarized extremes: high-wage analytical cognitive professions and low-wage manual personal care services.",
    "contextVi": "Các nhà kinh tế học quan sát thấy việc thực thi tác vụ bằng thuật toán làm xói mòn các nghề nghiệp kỹ năng trung cấp mang tính lặp lại (như nhập liệu hành chính, nghiên cứu pháp lý sơ bộ, lắp ráp sản xuất), trong khi lại thúc đẩy nhu cầu ở hai thái cực phân hóa: nhóm nghề nhận thức phân tích lương cao và nhóm dịch vụ chăm sóc cá nhân thủ công lương thấp.",
    "contextEn": "Economists observe that algorithmic task execution hollows out middle-skill routine occupations—such as administrative data entry, paralegal research, and assembly fabrication—while accelerating demand at the polarized extremes: high-wage analytical cognitive professions and low-wage manual personal care services.",
    "options": [
      "Xói mòn việc làm kỹ năng trung cấp lặp lại, chỉ gia tăng ở hai cực lương rất cao và lương rất thấp (Hollows out middle-skill routine jobs)",
      "Xóa sổ toàn bộ mọi công việc lao động trong xã hội",
      "Tăng lương đồng đều cho mọi tầng lớp lao động",
      "Chỉ ảnh hưởng duy nhất đến ngành nông nghiệp nông thôn"
    ],
    "optionsVi": [
      "Xói mòn việc làm kỹ năng trung cấp lặp lại, chỉ gia tăng ở hai cực lương rất cao và lương rất thấp (Hollows out middle-skill routine jobs)",
      "Xóa sổ toàn bộ mọi công việc lao động trong xã hội",
      "Tăng lương đồng đều cho mọi tầng lớp lao động",
      "Chỉ ảnh hưởng duy nhất đến ngành nông nghiệp nông thôn"
    ],
    "optionsEn": [
      "Hollowing out middle-tier routine occupations while expanding polarized cognitive high-wage and manual low-wage sectors",
      "Universally abolishing all forms of human wage employment",
      "Evenly compressing wealth disparities across the entire workforce",
      "Restricting automation consequences solely to agrarian cultivation"
    ],
    "correctIndex": 0,
    "correctAnswer": "Xói mòn việc làm kỹ năng trung cấp lặp lại, chỉ gia tăng ở hai cực lương rất cao và lương rất thấp (Hollows out middle-skill routine jobs)",
    "correctAnswerEn": "Hollowing out middle-tier routine occupations while expanding polarized cognitive high-wage and manual low-wage sectors",
    "explanation": "Đoạn văn dùng cụm \"hollows out middle-skill routine occupations while accelerating demand at the polarized extremes\".",
    "explanationVi": "Đoạn văn dùng cụm \"hollows out middle-skill routine occupations while accelerating demand at the polarized extremes\".",
    "explanationEn": "The passage explicitly defines polarization as the contraction of routine middle-tier occupations while the polarized poles expand."
  },
  {
    "id": "b3_hard_read_101_t2_p3_01",
    "difficulty": "hard",
    "topic": "health",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 2 (Passage 3)",
    "prompt": "Cơ chế \"phản xạ định hướng\" (orienting response) đóng vai trò gì trong sự lệ thuộc vào màn hình truyền hình?",
    "promptVi": "Cơ chế \"phản xạ định hướng\" (orienting response) đóng vai trò gì trong sự lệ thuộc vào màn hình truyền hình?",
    "promptEn": "What physiological role does the Pavlovian \"orienting response\" play in television and digital screen dependency?",
    "context": "The orienting response is an innate evolutionary survival mechanism that automatically redirects attention toward novel sensory stimuli, sudden scene cuts, or rapid motion. Commercial broadcasts deliberately exploit this neurological reflex via frequent camera shifts every few seconds, compelling viewers to remain visually transfixed despite physical passivity.",
    "contextVi": "Phản xạ định hướng là một cơ chế sinh tồn tiến hóa bẩm sinh giúp tự động chuyển hướng chú ý về phía các kích thích cảm giác mới lạ, các cảnh cắt đột ngột hoặc chuyển động nhanh. Các chương trình truyền hình thương mại cố ý khai thác phản xạ thần kinh này thông qua việc chuyển góc máy liên tục sau mỗi vài giây, buộc người xem phải dán mắt vào màn hình dù cơ thể đang ở trạng thái thụ động.",
    "contextEn": "The orienting response is an innate evolutionary survival mechanism that automatically redirects attention toward novel sensory stimuli, sudden scene cuts, or rapid motion. Commercial broadcasts deliberately exploit this neurological reflex via frequent camera shifts every few seconds, compelling viewers to remain visually transfixed despite physical passivity.",
    "options": [
      "Tự động hướng mắt vào các chuyển cảnh đột ngột, bị nhà đài khai thác để giữ chân người xem (Exploited by frequent camera shifts)",
      "Giúp não bộ phân tích sâu sắc các thông tin logic phức tạp",
      "Gây buồn ngủ ngay lập tức khi xem phim tài liệu",
      "Kích thích cơ bắp vận động mạnh mẽ trong khi xem"
    ],
    "optionsVi": [
      "Tự động hướng mắt vào các chuyển cảnh đột ngột, bị nhà đài khai thác để giữ chân người xem (Exploited by frequent camera shifts)",
      "Giúp não bộ phân tích sâu sắc các thông tin logic phức tạp",
      "Gây buồn ngủ ngay lập tức khi xem phim tài liệu",
      "Kích thích cơ bắp vận động mạnh mẽ trong khi xem"
    ],
    "optionsEn": [
      "Forces involuntary visual fixation triggered by rapid visual edits, keeping viewers glued to screens",
      "Facilitates high-order logical deliberations during fast-paced programming",
      "Triggers instantaneous somnolence when viewing non-fiction documentaries",
      "Stimulates significant skeletal muscular exertion in viewers"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tự động hướng mắt vào các chuyển cảnh đột ngột, bị nhà đài khai thác để giữ chân người xem (Exploited by frequent camera shifts)",
    "correctAnswerEn": "Forces involuntary visual fixation triggered by rapid visual edits, keeping viewers glued to screens",
    "explanation": "Bài đọc chỉ ra phản xạ định hướng khiến người xem dán mắt vào màn hình do bị khai thác bởi \"frequent camera shifts every few seconds\".",
    "explanationVi": "Bài đọc chỉ ra phản xạ định hướng khiến người xem dán mắt vào màn hình do bị khai thác bởi \"frequent camera shifts every few seconds\".",
    "explanationEn": "The author explains that television producers manipulate the orienting reflex through rapid edits to compel involuntary visual engagement."
  },
  {
    "id": "b3_hard_grammar_inversion_01",
    "difficulty": "hard",
    "topic": "culture",
    "skillCategory": "grammar",
    "type": "hedging",
    "cambridgeSource": "Academic Writing Band 8.0 Inversion Handbook",
    "prompt": "Chọn câu sử dụng cấu trúc đảo ngữ (Negative Inversion) hoàn toàn chính xác về ngữ pháp học thuật:",
    "promptVi": "Chọn câu sử dụng cấu trúc đảo ngữ (Negative Inversion) hoàn toàn chính xác về ngữ pháp học thuật:",
    "promptEn": "Select the sentence that demonstrates impeccable academic negative inversion:",
    "context": "Identify the grammatically flawless inverted clause suitable for an IELTS Writing Task 2 essay:",
    "contextVi": "Xác định mệnh đề đảo ngữ chuẩn xác phục vụ bài thi IELTS Writing Task 2:",
    "contextEn": "Identify the grammatically flawless inverted clause suitable for an IELTS Writing Task 2 essay:",
    "options": [
      "Seldom have environmental policymakers confronted a challenge as multifaceted as ocean acidification.",
      "Seldom environmental policymakers have confronted a challenge as multifaceted as ocean acidification.",
      "Seldom has environmental policymakers confronted a challenge as multifaceted as ocean acidification.",
      "Seldom have environmental policymakers confront a challenge as multifaceted as ocean acidification."
    ],
    "optionsVi": [
      "Seldom have environmental policymakers confronted... (Chuẩn: Seldom + have + S nhiều + V3)",
      "Seldom environmental policymakers have... (Sai: thiếu đảo trợ động từ lên trước S)",
      "Seldom has environmental policymakers... (Sai: policymakers số nhiều nhưng dùng has)",
      "Seldom have environmental policymakers confront... (Sai: sau have phải dùng confronted)"
    ],
    "optionsEn": [
      "Seldom have environmental policymakers confronted a challenge as multifaceted as ocean acidification.",
      "Seldom environmental policymakers have confronted a challenge as multifaceted as ocean acidification.",
      "Seldom has environmental policymakers confronted a challenge as multifaceted as ocean acidification.",
      "Seldom have environmental policymakers confront a challenge as multifaceted as ocean acidification."
    ],
    "correctIndex": 0,
    "correctAnswer": "Seldom have environmental policymakers confronted a challenge as multifaceted as ocean acidification.",
    "correctAnswerEn": "Seldom have environmental policymakers confronted a challenge as multifaceted as ocean acidification.",
    "explanation": "Cấu trúc đảo ngữ phủ định: Seldom + Trợ động từ (have) + Chủ ngữ số nhiều (policymakers) + Quá khứ phân từ (confronted).",
    "explanationVi": "Cấu trúc đảo ngữ phủ định: Seldom + Trợ động từ (have) + Chủ ngữ số nhiều (policymakers) + Quá khứ phân từ (confronted).",
    "explanationEn": "Negative inversion requires: Negative Adverb (Seldom) + Auxiliary (have) + Plural Subject (policymakers) + Past Participle (confronted)."
  },
  {
    "id": "b3_nightmare_read_c20_p2_deep_01",
    "difficulty": "nightmare",
    "topic": "science",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 2 In-Depth)",
    "prompt": "Nghịch lý lớn nhất trong việc nhân giống cây du lai kháng nấm (resistant elm cultivars) là gì?",
    "promptVi": "Nghịch lý lớn nhất trong việc nhân giống cây du lai kháng nấm (resistant elm cultivars) là gì?",
    "promptEn": "What fundamental genetic trade-off complicates the widespread ecological deployment of hybrid resistant elm cultivars?",
    "context": "While backcrossing European elms with Asian taxa like Ulmus pumila successfully confers physiological resistance against Ophiostoma novo-ulmi, forest ecologists caution against genetic bottlenecking. Widespread propagation of a narrow cohort of cloned hybrids compromises the overarching adaptive plasticity of temperate canopy forests against nascent pathogens and unpredictable climatic extremes.",
    "contextVi": "Mặc dù việc lai hồi giao cây du châu Âu với các loài châu Á như Ulmus pumila đã mang lại khả năng kháng nấm Ophiostoma novo-ulmi thành công, các nhà sinh thái học cảnh báo về hiện tượng \"nút thắt cổ chai di truyền\" (genetic bottlenecking). Việc nhân rộng một số ít dòng vô tính lai làm suy giảm tính thích nghi tiến hóa tổng thể của tán rừng trước các mầm bệnh mới và thời tiết cực đoan.",
    "contextEn": "While backcrossing European elms with Asian taxa like Ulmus pumila successfully confers physiological resistance against Ophiostoma novo-ulmi, forest ecologists caution against genetic bottlenecking. Widespread propagation of a narrow cohort of cloned hybrids compromises the overarching adaptive plasticity of temperate canopy forests against nascent pathogens and unpredictable climatic extremes.",
    "options": [
      "Nguy cơ thắt cổ chai di truyền làm suy giảm tính thích nghi của rừng trước các mầm bệnh mới (Genetic bottlenecking)",
      "Cây lai hoàn toàn không thể phát triển tán lá trong mùa xuân",
      "Nấm Ophiostoma lập tức phát triển khả năng ăn thịt bọ cánh cứng",
      "Chi phí nhân giống cây vô tính rẻ hơn cây tự nhiên"
    ],
    "optionsVi": [
      "Nguy cơ thắt cổ chai di truyền làm suy giảm tính thích nghi của rừng trước các mầm bệnh mới (Genetic bottlenecking)",
      "Cây lai hoàn toàn không thể phát triển tán lá trong mùa xuân",
      "Nấm Ophiostoma lập tức phát triển khả năng ăn thịt bọ cánh cứng",
      "Chi phí nhân giống cây vô tính rẻ hơn cây tự nhiên"
    ],
    "optionsEn": [
      "Genetic bottlenecking from cloned hybrids erodes broad ecological resilience against novel pathogens",
      "Cloned hybrids suffer physiological cessation of photosynthesis during spring",
      "The fungus rapidly mutates to consume adult insect vectors",
      "Cloning micropropagation expenditures are negligible compared to wild saplings"
    ],
    "correctIndex": 0,
    "correctAnswer": "Nguy cơ thắt cổ chai di truyền làm suy giảm tính thích nghi của rừng trước các mầm bệnh mới (Genetic bottlenecking)",
    "correctAnswerEn": "Genetic bottlenecking from cloned hybrids erodes broad ecological resilience against novel pathogens",
    "explanation": "Tác giả nêu rõ nghịch lý: dù kháng được nấm cũ, việc nhân bản đơn nhất (\"cloned hybrids\") dẫn tới \"genetic bottlenecking\", làm mất đi tính thích ứng (\"adaptive plasticity\") của rừng trước các hiểm họa mới.",
    "explanationVi": "Tác giả nêu rõ nghịch lý: dù kháng được nấm cũ, việc nhân bản đơn nhất (\"cloned hybrids\") dẫn tới \"genetic bottlenecking\", làm mất đi tính thích ứng (\"adaptive plasticity\") của rừng trước các hiểm họa mới.",
    "explanationEn": "The critical paradox is that clonal uniformity induces genetic bottlenecking, compromising long-term canopy adaptability."
  },
  {
    "id": "b3_nightmare_read_c18_p3_debris_01",
    "difficulty": "nightmare",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 3 Extreme)",
    "prompt": "Rào cản pháp lý quốc tế lớn nhất cản trở việc thu gom dọn dẹp các mảnh vỡ vệ tinh cũ là gì?",
    "promptVi": "Rào cản pháp lý quốc tế lớn nhất cản trở việc thu gom dọn dẹp các mảnh vỡ vệ tinh cũ là gì?",
    "promptEn": "According to international aerospace jurisprudence, what is the principal legal impediment to active orbital debris remediation?",
    "context": "Under the 1967 Outer Space Treaty, space objects and their fragments remain the perpetual sovereign property and jurisdiction of the launching state indefinitely. Consequently, an autonomous remediation vehicle launched by one nation cannot legally capture, de-orbit, or physically grapple with derelict upper rocket stages belonging to another nation without explicit prior diplomatic authorization, regardless of collision risks.",
    "contextVi": "Theo Hiệp ước Không gian Vũ trụ năm 1967, các vật thể không gian và mảnh vỡ của chúng thuộc quyền sở hữu chủ quyền và tài phán vĩnh viễn của quốc gia phóng. Do đó, một tàu thu gom tự hành của một quốc gia không thể tự ý bắt giữ, kéo hạ quỹ đạo hoặc can thiệp vật lý vào các tầng tên lửa cũ của quốc gia khác nếu không có sự ủy quyền ngoại giao rõ ràng.",
    "contextEn": "Under the 1967 Outer Space Treaty, space objects and their fragments remain the perpetual sovereign property and jurisdiction of the launching state indefinitely. Consequently, an autonomous remediation vehicle launched by one nation cannot legally capture, de-orbit, or physically grapple with derelict upper rocket stages belonging to another nation without explicit prior diplomatic authorization, regardless of collision risks.",
    "options": [
      "Quyền tài phán và sở hữu chủ quyền vĩnh viễn của quốc gia phóng theo Hiệp ước 1967 (Perpetual sovereign jurisdiction)",
      "Vận tốc của rác không gian vượt quá tốc độ ánh sáng",
      "Không có công nghệ nào trên Trái Đất có thể tiếp cận quỹ đạo thấp",
      "Các mảnh vỡ không gian tự bốc cháy sau 24 giờ"
    ],
    "optionsVi": [
      "Quyền tài phán và sở hữu chủ quyền vĩnh viễn của quốc gia phóng theo Hiệp ước 1967 (Perpetual sovereign jurisdiction)",
      "Vận tốc của rác không gian vượt quá tốc độ ánh sáng",
      "Không có công nghệ nào trên Trái Đất có thể tiếp cận quỹ đạo thấp",
      "Các mảnh vỡ không gian tự bốc cháy sau 24 giờ"
    ],
    "optionsEn": [
      "Perpetual sovereign ownership and jurisdiction under the 1967 Outer Space Treaty prohibiting unauthorized interception",
      "Orbital velocities exceeding the cosmic speed of electromagnetic propagation",
      "Total absence of propulsive technologies capable of Low Earth Orbit rendezvous",
      "All orbital detritus naturally dematerializes within 24 hours of collision"
    ],
    "correctIndex": 0,
    "correctAnswer": "Quyền tài phán và sở hữu chủ quyền vĩnh viễn của quốc gia phóng theo Hiệp ước 1967 (Perpetual sovereign jurisdiction)",
    "correctAnswerEn": "Perpetual sovereign ownership and jurisdiction under the 1967 Outer Space Treaty prohibiting unauthorized interception",
    "explanation": "Hiệp ước Không gian Vũ trụ năm 1967 quy định vật thể không gian là \"perpetual sovereign property\", cấm các quốc gia khác can thiệp thu dọn nếu không có sự cho phép ngoại giao.",
    "explanationVi": "Hiệp ước Không gian Vũ trụ năm 1967 quy định vật thể không gian là \"perpetual sovereign property\", cấm các quốc gia khác can thiệp thu dọn nếu không có sự cho phép ngoại giao.",
    "explanationEn": "The 1967 Outer Space Treaty confers perpetual sovereign jurisdiction to the launching state, legally barring third-party salvage."
  },
  {
    "id": "b3_nightmare_c1_lexical_01",
    "difficulty": "nightmare",
    "topic": "science",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Masterclass - Band 9.0 Nuance",
    "prompt": "Chọn tính từ học thuật C2 diễn tả bản chất \"thoáng qua, ngắn ngủi và mau tàn\" của các hiện tượng tự nhiên:",
    "promptVi": "Chọn tính từ học thuật C2 diễn tả bản chất \"thoáng qua, ngắn ngủi và mau tàn\" của các hiện tượng tự nhiên:",
    "promptEn": "Select the Band 9.0 C2 academic adjective meaning \"lasting for only a very brief moment\":",
    "context": "The blooming of desert succulents following rare flash floods is a remarkably _____ biological phenomenon.",
    "contextVi": "The blooming of desert succulents following rare flash floods is a remarkably _____ biological phenomenon.",
    "contextEn": "The blooming of desert succulents following rare flash floods is a remarkably _____ biological phenomenon.",
    "options": [
      "ephemeral",
      "perpetual",
      "ubiquitous",
      "immutable"
    ],
    "optionsVi": [
      "ephemeral (thoáng qua, sớm nở tối tàn)",
      "perpetual (vĩnh viễn không dứt)",
      "ubiquitous (phổ biến khắp nơi)",
      "immutable (bất biến, không thể thay đổi)"
    ],
    "optionsEn": [
      "ephemeral",
      "perpetual",
      "ubiquitous",
      "immutable"
    ],
    "correctIndex": 0,
    "correctAnswer": "ephemeral",
    "correctAnswerEn": "ephemeral",
    "explanation": "\"Ephemeral\" (/ɪˈfemərəl/ - lasting for a very short time) là từ vựng C2 đắt giá miêu tả các hiện tượng thoáng qua trong tự nhiên hoặc xã hội.",
    "explanationVi": "\"Ephemeral\" (/ɪˈfemərəl/ - lasting for a very short time) là từ vựng C2 đắt giá miêu tả các hiện tượng thoáng qua trong tự nhiên hoặc xã hội.",
    "explanationEn": "\"Ephemeral\" is an authentic Band 9.0 C2 adjective denoting transient, short-lived biological or temporal occurrences."
  },
  {
    "id": "b3_easy_spell_09",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #60",
    "prompt": "Chọn từ viết đúng chính tả cho danh từ \"bộ máy quan liêu hành chính\":",
    "promptVi": "Chọn từ viết đúng chính tả cho danh từ \"bộ máy quan liêu hành chính\":",
    "promptEn": "Select the authentic Cambridge spelling for the noun denoting administrative officialdom:",
    "context": "Excessive _____ often stymies the agility of small startup enterprises.",
    "contextVi": "Excessive _____ often stymies the agility of small startup enterprises.",
    "contextEn": "Excessive _____ often stymies the agility of small startup enterprises.",
    "options": [
      "bureaucracy",
      "beuracracy",
      "buerocracy",
      "bureacracy"
    ],
    "optionsVi": [
      "bureaucracy (đúng: b-u-r-e-a-u-c-r-a-c-y)",
      "beuracracy (sai: đảo e trước u)",
      "buerocracy (sai chữ o)",
      "bureacracy (thiếu chữ u trong eau)"
    ],
    "optionsEn": [
      "bureaucracy",
      "beuracracy",
      "buerocracy",
      "bureacracy"
    ],
    "correctIndex": 0,
    "correctAnswer": "bureaucracy",
    "correctAnswerEn": "bureaucracy",
    "explanation": "Từ \"bureaucracy\" bắt nguồn từ chữ Pháp \"bureau\" (b-u-r-e-a-u) ghép với đuôi \"-cracy\".",
    "explanationVi": "Từ \"bureaucracy\" bắt nguồn từ chữ Pháp \"bureau\" (b-u-r-e-a-u) ghép với đuôi \"-cracy\".",
    "explanationEn": "\"Bureaucracy\" derives from French \"bureau\" (b-u-r-e-a-u) combined with the Greek suffix \"-cracy\"."
  },
  {
    "id": "b3_easy_spell_10",
    "difficulty": "easy",
    "topic": "technology",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #65",
    "prompt": "Chọn phương án viết đúng chính tả Anh-Anh cho danh từ \"sự thao diễn, điều động\":",
    "promptVi": "Chọn phương án viết đúng chính tả Anh-Anh cho danh từ \"sự thao diễn, điều động\":",
    "promptEn": "Select the correct British English spelling for the noun meaning skilled tactical movement:",
    "context": "The pilot executed a complex aerial _____ to evade turbulent storm clouds.",
    "contextVi": "The pilot executed a complex aerial _____ to evade turbulent storm clouds.",
    "contextEn": "The pilot executed a complex aerial _____ to evade turbulent storm clouds.",
    "options": [
      "manoeuvre",
      "maneuver",
      "manouvre",
      "manuevre"
    ],
    "optionsVi": [
      "manoeuvre (chuẩn Anh - Anh: -oeu-)",
      "maneuver (chuẩn Mỹ)",
      "manouvre (sai vần)",
      "manuevre (sai đảo chữ)"
    ],
    "optionsEn": [
      "manoeuvre",
      "maneuver",
      "manouvre",
      "manuevre"
    ],
    "correctIndex": 0,
    "correctAnswer": "manoeuvre",
    "correctAnswerEn": "manoeuvre",
    "explanation": "Trong chuẩn Cambridge (British English), từ này được viết là \"manoeuvre\" với cụm \"oeu\". Chuẩn Mỹ là \"maneuver\".",
    "explanationVi": "Trong chuẩn Cambridge (British English), từ này được viết là \"manoeuvre\" với cụm \"oeu\". Chuẩn Mỹ là \"maneuver\".",
    "explanationEn": "In British Cambridge examination standards, the accepted spelling is \"manoeuvre\" with the \"oeu\" cluster."
  },
  {
    "id": "b3_easy_spell_11",
    "difficulty": "easy",
    "topic": "science",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #72",
    "prompt": "Chọn từ viết đúng chính tả cho tính từ \"huỳnh quang, phát sáng\":",
    "promptVi": "Chọn từ viết đúng chính tả cho tính từ \"huỳnh quang, phát sáng\":",
    "promptEn": "Select the authentic spelling for the adjective meaning emitting light through absorption of radiation:",
    "context": "Biologists tagged the specimens with vivid _____ dyes for nocturnal tracking.",
    "contextVi": "Biologists tagged the specimens with vivid _____ dyes for nocturnal tracking.",
    "contextEn": "Biologists tagged the specimens with vivid _____ dyes for nocturnal tracking.",
    "options": [
      "fluorescent",
      "florescent",
      "flourescent",
      "fluorecent"
    ],
    "optionsVi": [
      "fluorescent (đúng: f-l-u-o-r-e-s-c-e-n-t)",
      "florescent (sai: thiếu chữ u)",
      "flourescent (sai: đảo o trước u)",
      "fluorecent (thiếu s trước c)"
    ],
    "optionsEn": [
      "fluorescent",
      "florescent",
      "flourescent",
      "fluorecent"
    ],
    "correctIndex": 0,
    "correctAnswer": "fluorescent",
    "correctAnswerEn": "fluorescent",
    "explanation": "Quy tắc: bắt đầu bằng \"fluor-\" (u trước o, như chất fluorine) và đuôi \"-escent\" (có cả s và c).",
    "explanationVi": "Quy tắc: bắt đầu bằng \"fluor-\" (u trước o, như chất fluorine) và đuôi \"-escent\" (có cả s và c).",
    "explanationEn": "\"Fluorescent\" begins with \"fluor-\" (u precedes o) and concludes with \"-escent\" (featuring both s and c)."
  },
  {
    "id": "b3_easy_spell_12",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #81",
    "prompt": "Chọn phương án viết đúng chính tả cho danh từ \"nhà khởi nghiệp, doanh nhân\":",
    "promptVi": "Chọn phương án viết đúng chính tả cho danh từ \"nhà khởi nghiệp, doanh nhân\":",
    "promptEn": "Select the correct spelling for an innovator who founds and operates a commercial venture:",
    "context": "The visionary _____ secured substantial seed funding for the renewable clean tech venture.",
    "contextVi": "The visionary _____ secured substantial seed funding for the renewable clean tech venture.",
    "contextEn": "The visionary _____ secured substantial seed funding for the renewable clean tech venture.",
    "options": [
      "entrepreneur",
      "enterpreneur",
      "entrepeneur",
      "entrepenuer"
    ],
    "optionsVi": [
      "entrepreneur (đúng: e-n-t-r-e-p-r-e-n-e-u-r)",
      "enterpreneur (sai: enter-)",
      "entrepeneur (thiếu r thứ hai)",
      "entrepenuer (sai đuôi -uer)"
    ],
    "optionsEn": [
      "entrepreneur",
      "enterpreneur",
      "entrepeneur",
      "entrepenuer"
    ],
    "correctIndex": 0,
    "correctAnswer": "entrepreneur",
    "correctAnswerEn": "entrepreneur",
    "explanation": "\"Entrepreneur\" bắt đầu bằng \"entre-\" (chứ không phải \"enter-\") và có chữ \"r\" thứ hai trước \"e-n-e-u-r\".",
    "explanationVi": "\"Entrepreneur\" bắt đầu bằng \"entre-\" (chứ không phải \"enter-\") và có chữ \"r\" thứ hai trước \"e-n-e-u-r\".",
    "explanationEn": "\"Entrepreneur\" opens with \"entre-\" and preserves the French diphthong \"-eur\" at its conclusion."
  },
  {
    "id": "b3_easy_spell_13",
    "difficulty": "easy",
    "topic": "education",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #89",
    "prompt": "Chọn phương án viết đúng cho tính từ \"tận tụy, có lương tâm chu đáo\":",
    "promptVi": "Chọn phương án viết đúng cho tính từ \"tận tụy, có lương tâm chu đáo\":",
    "promptEn": "Select the authentic spelling for the adjective describing diligent, meticulous dedication:",
    "context": "The doctoral candidate was extraordinarily _____ in documenting laboratory trials.",
    "contextVi": "The doctoral candidate was extraordinarily _____ in documenting laboratory trials.",
    "contextEn": "The doctoral candidate was extraordinarily _____ in documenting laboratory trials.",
    "options": [
      "conscientious",
      "conscientous",
      "consciencious",
      "concentious"
    ],
    "optionsVi": [
      "conscientious (đúng: c-o-n-s-c-i-e-n-t-i-o-u-s)",
      "conscientous (thiếu i trước o)",
      "consciencious (sai chữ c thay t)",
      "concentious (thiếu âm sci)"
    ],
    "optionsEn": [
      "conscientious",
      "conscientous",
      "consciencious",
      "concentious"
    ],
    "correctIndex": 0,
    "correctAnswer": "conscientious",
    "correctAnswerEn": "conscientious",
    "explanation": "\"Conscientious\" xuất phát từ \"conscience\" nhưng chuyển đuôi thành \"-tious\" (c-o-n-s-c-i-e-n-t-i-o-u-s).",
    "explanationVi": "\"Conscientious\" xuất phát từ \"conscience\" nhưng chuyển đuôi thành \"-tious\" (c-o-n-s-c-i-e-n-t-i-o-u-s).",
    "explanationEn": "\"Conscientious\" alters the \"-ce\" of \"conscience\" into \"-tious\" (c-o-n-s-c-i-e-n-t-i-o-u-s)."
  },
  {
    "id": "b3_easy_vocab_04",
    "difficulty": "easy",
    "topic": "health",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 6.0",
    "prompt": "Chọn từ đồng nghĩa học thuật C1 chuẩn xác thay thế cho \"reduce / make less severe\":",
    "promptVi": "Chọn từ đồng nghĩa học thuật C1 chuẩn xác thay thế cho \"reduce / make less severe\":",
    "promptEn": "Select the C1 academic verb meaning to make an undesirable condition less severe:",
    "context": "Prompt therapeutic intervention can effectively _____ the acute symptoms of respiratory inflammation.",
    "contextVi": "Prompt therapeutic intervention can effectively _____ the acute symptoms of respiratory inflammation.",
    "contextEn": "Prompt therapeutic intervention can effectively _____ the acute symptoms of respiratory inflammation.",
    "options": [
      "alleviate",
      "exacerbate",
      "amplify",
      "provoke"
    ],
    "optionsVi": [
      "alleviate (làm thuyên giảm, xoa dịu)",
      "exacerbate (làm trầm trọng thêm - trái nghĩa)",
      "amplify (khuếch đại)",
      "provoke (khiêu khích, kích động)"
    ],
    "optionsEn": [
      "alleviate",
      "exacerbate",
      "amplify",
      "provoke"
    ],
    "correctIndex": 0,
    "correctAnswer": "alleviate",
    "correctAnswerEn": "alleviate",
    "explanation": "\"Alleviate\" mang nghĩa làm giảm nhẹ đau đớn, khó khăn hoặc triệu chứng bệnh (make suffering less severe).",
    "explanationVi": "\"Alleviate\" mang nghĩa làm giảm nhẹ đau đớn, khó khăn hoặc triệu chứng bệnh (make suffering less severe).",
    "explanationEn": "\"Alleviate\" is the standard academic term for reducing or easing physical or socioeconomic discomfort."
  },
  {
    "id": "b3_easy_vocab_05",
    "difficulty": "easy",
    "topic": "environment",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 6.5",
    "prompt": "Chọn từ đồng nghĩa C1 thay thế cho cụm \"make worse\" trong bài luận:",
    "promptVi": "Chọn từ đồng nghĩa C1 thay thế cho cụm \"make worse\" trong bài luận:",
    "promptEn": "Select the formal C1 academic verb meaning to worsen an existing problem:",
    "context": "Prolonged droughts will inevitably _____ the severe freshwater scarcity in arid regions.",
    "contextVi": "Prolonged droughts will inevitably _____ the severe freshwater scarcity in arid regions.",
    "contextEn": "Prolonged droughts will inevitably _____ the severe freshwater scarcity in arid regions.",
    "options": [
      "exacerbate",
      "mitigate",
      "rectify",
      "ameliorate"
    ],
    "optionsVi": [
      "exacerbate (làm trầm trọng thêm)",
      "mitigate (làm dịu đi - trái nghĩa)",
      "rectify (chỉnh sửa đúng)",
      "ameliorate (cải thiện - trái nghĩa)"
    ],
    "optionsEn": [
      "exacerbate",
      "mitigate",
      "rectify",
      "ameliorate"
    ],
    "correctIndex": 0,
    "correctAnswer": "exacerbate",
    "correctAnswerEn": "exacerbate",
    "explanation": "\"Exacerbate\" là động từ C1 đắt giá chỉ hành động làm cho tình hình xấu đi thêm (worsen / aggravate).",
    "explanationVi": "\"Exacerbate\" là động từ C1 đắt giá chỉ hành động làm cho tình hình xấu đi thêm (worsen / aggravate).",
    "explanationEn": "\"Exacerbate\" is an authentic C1 upgrade for \"make worse\", denoting the deterioration of a crisis."
  },
  {
    "id": "b3_easy_lis_c8_t3_p2_01",
    "difficulty": "easy",
    "topic": "culture",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 3 Listening Part 2",
    "prompt": "Trung tâm văn hóa nghệ thuật mở cửa phục vụ công chúng vào ngày nào trong tuần?",
    "promptVi": "Trung tâm văn hóa nghệ thuật mở cửa phục vụ công chúng vào ngày nào trong tuần?",
    "promptEn": "On which days of the week is the Civic Arts Centre open for public admissions?",
    "context": "Spokesperson: Administrative staff work Monday through Saturday, but public gallery access is strictly scheduled from Wednesday to Sunday every week.",
    "contextVi": "Spokesperson: Administrative staff work Monday through Saturday, but public gallery access is strictly scheduled from Wednesday to Sunday every week.",
    "contextEn": "Spokesperson: Administrative staff work Monday through Saturday, but public gallery access is strictly scheduled from Wednesday to Sunday every week.",
    "options": [
      "Thứ Tư đến Chủ Nhật (Wednesday to Sunday)",
      "Thứ Hai đến Thứ Bảy (Monday through Saturday)",
      "Chỉ mở cửa hai ngày cuối tuần (Weekends only)",
      "Mở cửa đủ cả 7 ngày trong tuần (Seven days a week)"
    ],
    "optionsVi": [
      "Thứ Tư đến Chủ Nhật (Wednesday to Sunday)",
      "Thứ Hai đến Thứ Bảy (Monday through Saturday)",
      "Chỉ mở cửa hai ngày cuối tuần (Weekends only)",
      "Mở cửa đủ cả 7 ngày trong tuần (Seven days a week)"
    ],
    "optionsEn": [
      "Wednesday to Sunday",
      "Monday through Saturday",
      "Weekends only",
      "Seven days a week"
    ],
    "correctIndex": 0,
    "correctAnswer": "Thứ Tư đến Chủ Nhật (Wednesday to Sunday)",
    "correctAnswerEn": "Wednesday to Sunday",
    "explanation": "Bẫy thông tin hành chính: Thứ Hai đến Thứ Bảy là giờ làm việc của nhân viên văn phòng, còn công chúng vào xem tranh là \"Wednesday to Sunday\".",
    "explanationVi": "Bẫy thông tin hành chính: Thứ Hai đến Thứ Bảy là giờ làm việc của nhân viên văn phòng, còn công chứng vào xem tranh là \"Wednesday to Sunday\".",
    "explanationEn": "The speaker contrasts internal staff hours (Monday–Saturday) with public exhibition hours (Wednesday–Sunday)."
  },
  {
    "id": "b3_easy_read_c16_p2_01",
    "difficulty": "easy",
    "topic": "culture",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 16 Academic - Reading Test 1 (Passage 2)",
    "prompt": "Kiến trúc sư thiên tài nào đã thiết kế Kim tự tháp bậc thang Djoser tại Saqqara?",
    "promptVi": "Kiến trúc sư thiên tài nào đã thiết kế Kim tự tháp bậc thang Djoser tại Saqqara?",
    "promptEn": "Which legendary royal architect conceived and constructed the Step Pyramid of Djoser at Saqqara?",
    "context": "Pharaoh Djoser entrusted the commission of his eternal funerary monument to his high priest and chancellor Imhotep, who revolutionized Egyptian masonry by stacking six limestone mastabas of diminishing volume atop one another.",
    "contextVi": "Pharaoh Djoser giao phó công trình lăng mộ vĩnh cửu của mình cho tể tướng Imhotep, người đã cách mạng hóa kiến trúc xây dựng Ai Cập bằng cách xếp 6 lăng mộ mastaba bằng đá vôi có kích thước giảm dần lên nhau.",
    "contextEn": "Pharaoh Djoser entrusted the commission of his eternal funerary monument to his high priest and chancellor Imhotep, who revolutionized Egyptian masonry by stacking six limestone mastabas of diminishing volume atop one another.",
    "options": [
      "Imhotep",
      "Sneferu",
      "Khufu",
      "Ramesses"
    ],
    "optionsVi": [
      "Imhotep (đúng)",
      "Sneferu",
      "Khufu",
      "Ramesses"
    ],
    "optionsEn": [
      "Imhotep",
      "Sneferu",
      "Khufu",
      "Ramesses"
    ],
    "correctIndex": 0,
    "correctAnswer": "Imhotep",
    "correctAnswerEn": "Imhotep",
    "explanation": "Đoạn văn nêu đích danh vị tể tướng và kiến trúc sư đại tài là \"Imhotep\".",
    "explanationVi": "Đoạn văn nêu đích danh vị tể tướng và kiến trúc sư đại tài là \"Imhotep\".",
    "explanationEn": "The text explicitly identifies Pharaoh Djoser's chancellor \"Imhotep\" as the revolutionary mastermind behind the Step Pyramid."
  },
  {
    "id": "b3_easy_vis_process_01",
    "difficulty": "easy",
    "topic": "science",
    "skillCategory": "visual_data",
    "type": "visual_data",
    "cambridgeSource": "Writing Task 1 Process Flow Bank",
    "prompt": "Trong quy trình sản xuất cà phê hòa tan, bước sấy khô diễn ra sau công đoạn nào?",
    "promptVi": "Trong quy trình sản xuất cà phê hòa tan, bước sấy khô diễn ra sau công đoạn nào?",
    "promptEn": "In the industrial soluble coffee manufacturing cycle, which phase immediately precedes drying?",
    "context": "Process Flow: 1. Harvesting beans -> 2. Roasting and grinding -> 3. Hot water extraction -> 4. Freezing and crystallization -> 5. Vacuum freeze-drying.",
    "contextVi": "Chu trình: 1. Thu hoạch hạt -> 2. Rang và xay -> 3. Chiết xuất bằng nước nóng -> 4. Làm đông và kết tinh -> 5. Sấy thăng hoa chân không.",
    "contextEn": "Process Flow: 1. Harvesting beans -> 2. Roasting and grinding -> 3. Hot water extraction -> 4. Freezing and crystallization -> 5. Vacuum freeze-drying.",
    "options": [
      "Làm đông và kết tinh (Freezing and crystallization)",
      "Rang và xay thô",
      "Thu hoạch quả chín",
      "Đóng gói bao bì bán lẻ"
    ],
    "optionsVi": [
      "Làm đông và kết tinh (Freezing and crystallization)",
      "Rang và xay thô",
      "Thu hoạch quả chín",
      "Đóng gói bao bì bán lẻ"
    ],
    "optionsEn": [
      "Freezing and crystallization phase",
      "Roasting and grinding phase",
      "Bean harvesting phase",
      "Retail packaging phase"
    ],
    "correctIndex": 0,
    "correctAnswer": "Làm đông và kết tinh (Freezing and crystallization)",
    "correctAnswerEn": "Freezing and crystallization phase",
    "explanation": "Theo sơ đồ quy trình, bước 4 (Làm đông và kết tinh) diễn ra ngay trước bước 5 (Sấy thăng hoa).",
    "explanationVi": "Theo sơ đồ quy trình, bước 4 (Làm đông và kết tinh) diễn ra ngay trước bước 5 (Sấy thăng hoa).",
    "explanationEn": "According to the diagram sequence, phase 4 (Freezing and crystallization) directly precedes phase 5 (Vacuum freeze-drying)."
  },
  {
    "id": "b3_med_read_101_t3_p1_01",
    "difficulty": "medium",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 3 (Passage 1)",
    "prompt": "Nhà sáng chế John Harrison đã giải quyết bài toán xác định kinh độ hàng hải bằng phát minh nào?",
    "promptVi": "Nhà sáng chế John Harrison đã giải quyết bài toán xác định kinh độ hàng hải bằng phát minh nào?",
    "promptEn": "Which mechanical invention by John Harrison conclusively solved the historic longitude problem at sea?",
    "context": "For centuries, navigating the open oceans was fraught with peril because mariners lacked a reliable means of calculating longitude. While astronomers favored celestial charting, self-taught carpenter John Harrison engineered the marine chronometer—a frictionless, temperature-compensated mechanical clock capable of keeping exact Greenwich time aboard rocking vessels.",
    "contextVi": "Hàng thế kỷ qua, việc định vị kinh độ trên biển là thách thức lớn. Trong khi các nhà thiên văn học chuộng phương pháp đo sao, người thợ mộc tự học John Harrison đã sáng chế đồng hồ bấm giờ hàng hải (marine chronometer) - một cỗ máy cơ học chống ma sát và bù trừ nhiệt độ duy trì chính xác giờ Greenwich trên tàu lắc lư.",
    "contextEn": "For centuries, navigating the open oceans was fraught with peril because mariners lacked a reliable means of calculating longitude. While astronomers favored celestial charting, self-taught carpenter John Harrison engineered the marine chronometer—a frictionless, temperature-compensated mechanical clock capable of keeping exact Greenwich time aboard rocking vessels.",
    "options": [
      "Đồng hồ bấm giờ hàng hải cơ học (Marine chronometer)",
      "Kính thiên văn quang học phản xạ",
      "Bản đồ định vị vệ tinh từ trường",
      "La bàn nước con thoi quay"
    ],
    "optionsVi": [
      "Đồng hồ bấm giờ hàng hải cơ học (Marine chronometer)",
      "Kính thiên văn quang học phản xạ",
      "Bản đồ định vị vệ tinh từ trường",
      "La bàn nước con thoi quay"
    ],
    "optionsEn": [
      "Marine chronometer",
      "Reflective optical telescope",
      "Magnetic satellite contour map",
      "Rotating liquid gyroscopic compass"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đồng hồ bấm giờ hàng hải cơ học (Marine chronometer)",
    "correctAnswerEn": "Marine chronometer",
    "explanation": "Đoạn văn nêu rõ John Harrison đã phát minh ra \"marine chronometer\" (đồng hồ bấm giờ hàng hải) để giải quyết vấn đề kinh độ.",
    "explanationVi": "Đoạn văn nêu rõ John Harrison đã phát minh ra \"marine chronometer\" (đồng hồ bấm giờ hàng hải) để giải quyết vấn đề kinh độ.",
    "explanationEn": "The passage credits John Harrison with engineering the \"marine chronometer\", which solved marine longitude reckoning."
  },
  {
    "id": "b3_med_read_101_t3_p2_01",
    "difficulty": "medium",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 3 (Passage 2)",
    "prompt": "Sự ra đời của dịch vụ bưu chính tem giá rẻ Penny Post năm 1840 đã tạo ra chuyển biến xã hội nào tại Anh?",
    "promptVi": "Sự ra đời của dịch vụ bưu chính tem giá rẻ Penny Post năm 1840 đã tạo ra chuyển biến xã hội nào tại Anh?",
    "promptEn": "What major socioeconomic transformation was catalyzed by Rowland Hill's 1840 Penny Post in Britain?",
    "context": "Before 1840, postage was prohibitively expensive and collected from the recipient upon delivery, excluding the working classes from postal communication. Rowland Hill's introduction of the uniform pre-paid Penny Post democratized correspondence, sparking an exponential surge in national literacy and commercial transaction volume.",
    "contextVi": "Trước năm 1840, cước bưu chính rất đắt đỏ và thu từ người nhận, ngăn cản tầng lớp lao động tiếp cận thư từ. Việc Rowland Hill áp dụng tem Penny Post trả trước đồng giá 1 xu đã dân chủ hóa việc trao đổi thư từ, tạo bước nhảy vọt về tỷ lệ biết chữ và giao dịch thương mại toàn quốc.",
    "contextEn": "Before 1840, postage was prohibitively expensive and collected from the recipient upon delivery, excluding the working classes from postal communication. Rowland Hill's introduction of the uniform pre-paid Penny Post democratized correspondence, sparking an exponential surge in national literacy and commercial transaction volume.",
    "options": [
      "Dân chủ hóa thư tín, thúc đẩy tỷ lệ biết chữ và thương mại (Democratized correspondence)",
      "Giảm số lượng thư từ vận chuyển bằng tàu hỏa",
      "Khiến ngành in ấn tem thư bị phá sản",
      "Ngăn cản tầng lớp lao động tiếp cận việc học viết"
    ],
    "optionsVi": [
      "Dân chủ hóa thư tín, thúc đẩy tỷ lệ biết chữ và thương mại (Democratized correspondence)",
      "Giảm số lượng thư từ vận chuyển bằng tàu hỏa",
      "Khiến ngành in ấn tem thư bị phá sản",
      "Ngăn cản tầng lớp lao động tiếp cận việc học viết"
    ],
    "optionsEn": [
      "Democratized written correspondence, fostering national literacy and trade",
      "Drastically reduced postal transport volumes on railways",
      "Prompted the bankruptcy of national security printing houses",
      "Prevented working-class citizens from acquiring literacy skills"
    ],
    "correctIndex": 0,
    "correctAnswer": "Dân chủ hóa thư tín, thúc đẩy tỷ lệ biết chữ và thương mại (Democratized correspondence)",
    "correctAnswerEn": "Democratized written correspondence, fostering national literacy and trade",
    "explanation": "Bài đọc chỉ ra tem Penny Post đã \"democratized correspondence, sparking an exponential surge in national literacy and commercial transaction volume\".",
    "explanationVi": "Bài đọc chỉ ra tem Penny Post đã \"democratized correspondence, sparking an exponential surge in national literacy and commercial transaction volume\".",
    "explanationEn": "The passage underscores that the uniform Penny Post \"democratized correspondence\", driving up national literacy and commerce."
  },
  {
    "id": "b3_med_read_c17_p3_01",
    "difficulty": "medium",
    "topic": "culture",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 17 Academic - Reading Test 1 (Passage 3)",
    "prompt": "Vua Charles II đã sử dụng nơi trú ẩn nổi tiếng nào để trốn thoát đội quân Nghị viện sau trận Worcester?",
    "promptVi": "Vua Charles II đã sử dụng nơi trú ẩn nổi tiếng nào để trốn thoát đội quân Nghị viện sau trận Worcester?",
    "promptEn": "Which legendary natural refuge did King Charles II conceal himself in to evade Parliamentary troops following the Battle of Worcester?",
    "context": "Following his catastrophic defeat at Worcester in 1651, the young monarch spent six perilous weeks evading Oliver Cromwell's roundheads. His most celebrated concealment occurred at Boscobel House, where he spent an entire daylight day perched among the leafy canopy of a great Royal Oak while Parliamentary patrols searched below.",
    "contextVi": "Sau thất bại tại Worcester năm 1651, vị vua trẻ trải qua 6 tuần lẩn trốn quân đội Oliver Cromwell. Nơi ẩn nấp nổi tiếng nhất là tại Boscobel House, nơi ông trốn cả ngày trên tán lá một cây sồi cổ thụ (Royal Oak) trong khi lính tuần tra tìm kiếm ngay bên dưới.",
    "contextEn": "Following his catastrophic defeat at Worcester in 1651, the young monarch spent six perilous weeks evading Oliver Cromwell's roundheads. His most celebrated concealment occurred at Boscobel House, where he spent an entire daylight day perched among the leafy canopy of a great Royal Oak while Parliamentary patrols searched below.",
    "options": [
      "Tán lá cây sồi cổ thụ hoàng gia (The Royal Oak at Boscobel)",
      "Một hầm ngục bí mật dưới lòng sông Thames",
      "Hầm chứa rượu của tu viện Westminster",
      "Trên một chiếc tàu buôn ngụy trang mang cờ Hà Lan"
    ],
    "optionsVi": [
      "Tán lá cây sồi cổ thụ hoàng gia (The Royal Oak at Boscobel)",
      "Một hầm ngục bí mật dưới lòng sông Thames",
      "Hầm chứa rượu của tu viện Westminster",
      "Trên một chiếc tàu buôn ngụy trang mang cờ Hà Lan"
    ],
    "optionsEn": [
      "The leafy canopy of the Royal Oak at Boscobel",
      "A subterranean vault beneath the River Thames",
      "The wine cellars of Westminster Abbey",
      "A disguised merchant vessel under Dutch registry"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tán lá cây sồi cổ thụ hoàng gia (The Royal Oak at Boscobel)",
    "correctAnswerEn": "The leafy canopy of the Royal Oak at Boscobel",
    "explanation": "Chi tiết lịch sử nổi tiếng được văn bản khẳng định: Charles II trốn trên tán lá cây sồi cổ thụ \"Royal Oak\" ở Boscobel.",
    "explanationVi": "Chi tiết lịch sử nổi tiếng được văn bản khẳng định: Charles II trốn trên tán lá cây sồi cổ thụ \"Royal Oak\" ở Boscobel.",
    "explanationEn": "The text recounts King Charles II's iconic evasion hidden inside the dense foliage of the \"Royal Oak at Boscobel\"."
  },
  {
    "id": "b3_med_read_c16_p1_02",
    "difficulty": "medium",
    "topic": "science",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "Cambridge 16 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Đánh giá nhận định về khả năng đọc cử chỉ chỉ tay của loài chó so với loài sói:",
    "promptVi": "Đánh giá nhận định về khả năng đọc cử chỉ chỉ tay của loài chó so với loài sói:",
    "promptEn": "Evaluate the statement regarding canine versus lupine responsiveness to human pointing gestures:",
    "context": "Passage: Comparative cognitive trials reveal that even hand-reared wolf pups fail to intuitively interpret human pointing cues toward hidden food, whereas domestic puppies succeed effortlessly from as early as six weeks of age without prior training.\n\nStatement: Domestic puppies outperform human-raised wolf pups in understanding human pointing gestures.",
    "contextVi": "Đoạn văn: Các thử nghiệm nhận thức so sánh cho thấy ngay cả những chú chó sói con được con người nuôi nấng từ nhỏ cũng không thể hiểu được các cử chỉ chỉ tay hướng về nơi giấu thức ăn, trong khi chó con nuôi nhà lại làm được điều này dễ dàng từ 6 tuần tuổi mà không cần huấn luyện.\n\nNhận định: Chó con nuôi nhà vượt trội hơn chó sói con được người nuôi trong việc hiểu cử chỉ chỉ tay của con người.",
    "contextEn": "Passage: Comparative cognitive trials reveal that even hand-reared wolf pups fail to intuitively interpret human pointing cues toward hidden food, whereas domestic puppies succeed effortlessly from as early as six weeks of age without prior training.\n\nStatement: Domestic puppies outperform human-raised wolf pups in understanding human pointing gestures.",
    "options": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "TRUE (Đúng với bài)",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "TRUE",
    "correctAnswerEn": "TRUE",
    "explanation": "Bài đọc nêu rõ chó sói con (\"fail to interpret\") trong khi chó nhà (\"succeed effortlessly\"), xác nhận nhận định là TRUE.",
    "explanationVi": "Bài đọc nêu rõ chó sói con (\"fail to interpret\") trong khi chó nhà (\"succeed effortlessly\"), xác nhận nhận định là TRUE.",
    "explanationEn": "The text directly contrasts wolves' failure with domestic puppies' effortless success at understanding pointing, confirming TRUE."
  },
  {
    "id": "b3_med_vocab_06",
    "difficulty": "medium",
    "topic": "science",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 7.0",
    "prompt": "Chọn tính từ học thuật C1 diễn tả một giả thuyết \"hợp lý, đáng tin cậy\":",
    "promptVi": "Chọn tính từ học thuật C1 diễn tả một giả thuyết \"hợp lý, đáng tin cậy\":",
    "promptEn": "Select the formal C1 academic adjective meaning seemingly reasonable or credible:",
    "context": "The astrophysicist presented a highly _____ mathematical hypothesis explaining galactic dark matter.",
    "contextVi": "The astrophysicist presented a highly _____ mathematical hypothesis explaining galactic dark matter.",
    "contextEn": "The astrophysicist presented a highly _____ mathematical hypothesis explaining galactic dark matter.",
    "options": [
      "plausible",
      "specious",
      "fallacious",
      "arbitrary"
    ],
    "optionsVi": [
      "plausible (hợp lý, có cơ sở đáng tin)",
      "specious (chỉ có vẻ hợp lý nhưng thực ra sai)",
      "fallacious (ngụy biện)",
      "arbitrary (tùy tiện, ngẫu hứng)"
    ],
    "optionsEn": [
      "plausible",
      "specious",
      "fallacious",
      "arbitrary"
    ],
    "correctIndex": 0,
    "correctAnswer": "plausible",
    "correctAnswerEn": "plausible",
    "explanation": "\"Plausible\" (/ˈplɔːzəbl/ - seeming reasonable or probable) là từ học thuật chuẩn để miêu tả một lý thuyết hoặc giải thích đáng tin.",
    "explanationVi": "\"Plausible\" (/ˈplɔːzəbl/ - seeming reasonable or probable) là từ học thuật chuẩn để miêu tả một lý thuyết hoặc giải thích đáng tin.",
    "explanationEn": "\"Plausible\" designates an argument, mechanism, or hypothesis that is logically sound and believable."
  },
  {
    "id": "b3_med_lis_c8_t1_p3_01",
    "difficulty": "medium",
    "topic": "environment",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 1 Listening Part 3",
    "prompt": "Giảng viên yêu cầu sinh viên điều chỉnh trọng tâm nghiên cứu chuyến đi thực địa sang vấn đề gì?",
    "promptVi": "Giảng viên yêu cầu sinh viên điều chỉnh trọng tâm nghiên cứu chuyến đi thực địa sang vấn đề gì?",
    "promptEn": "What thematic adjustment does the academic tutor mandate for the student field trip proposal?",
    "context": "Tutor: Your initial focus on tourist visitor numbers is rather generic. I want your group to analyze the ecological impact of off-road vehicle trails on native scrub soil erosion instead.",
    "contextVi": "Tutor: Your initial focus on tourist visitor numbers is rather generic. I want your group to analyze the ecological impact of off-road vehicle trails on native scrub soil erosion instead.",
    "contextEn": "Tutor: Your initial focus on tourist visitor numbers is rather generic. I want your group to analyze the ecological impact of off-road vehicle trails on native scrub soil erosion instead.",
    "options": [
      "Tác động xói mòn đất do xe địa hình (Soil erosion caused by off-road vehicles)",
      "Số lượng khách du lịch lưu trú hàng năm",
      "Doanh thu từ phí bán vé vào cổng công viên",
      "Thói quen ăn uống của các loài bò sát bản địa"
    ],
    "optionsVi": [
      "Tác động xói mòn đất do xe địa hình (Soil erosion caused by off-road vehicles)",
      "Số lượng khách du lịch lưu trú hàng năm",
      "Doanh thu từ phí bán vé vào cổng công viên",
      "Thói quen ăn uống của các loài bò sát bản địa"
    ],
    "optionsEn": [
      "Soil erosion caused by off-road vehicle trails",
      "Annual tourist visitor headcounts",
      "Gate ticket revenue generated by national park authorities",
      "Dietary foraging patterns of native desert reptiles"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tác động xói mòn đất do xe địa hình (Soil erosion caused by off-road vehicles)",
    "correctAnswerEn": "Soil erosion caused by off-road vehicle trails",
    "explanation": "Giảng viên bác bỏ ý tưởng đếm lượng khách (\"rather generic\") và chuyển sang nghiên cứu xói mòn đất do xe địa hình (\"off-road vehicle trails on native scrub soil erosion\").",
    "explanationVi": "Giảng viên bác bỏ ý tưởng đếm lượng khách (\"rather generic\") và chuyển sang nghiên cứu xói mòn đất do xe địa hình (\"off-road vehicle trails on native scrub soil erosion\").",
    "explanationEn": "The tutor redirects the research proposal from visitor counts to off-road vehicular soil erosion."
  },
  {
    "id": "b3_hard_read_c20_p3_02",
    "difficulty": "hard",
    "topic": "health",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 3 Stress)",
    "prompt": "Tại sao căng thẳng mãn tính (chronic stress) lại làm suy giảm khả năng tư duy sáng tạo (divergent thinking)?",
    "promptVi": "Tại sao căng thẳng mãn tính (chronic stress) lại làm suy giảm khả năng tư duy sáng tạo (divergent thinking)?",
    "promptEn": "Why does chronic prolonged stress selectively suppress divergent, creative problem-solving capacity?",
    "context": "Sustained exposure to glucocorticoids causes structural dendritic atrophy within the hippocampus and prefrontal networks while promoting dendritic hypertrophy in the basolateral amygdala. This morphological reconfiguration locks the brain into hypervigilant threat detection, prioritizing stereotyped, threat-avoidant routines at the expense of cognitive flexibility, associative memory retrieval, and divergent hypothesis generation.",
    "contextVi": "Việc tiếp xúc kéo dài với glucocorticoid gây teo đuôi gai cấu trúc trong vùng hồi hải mã và mạng lưới vỏ não trước trán trong khi lại phì đại hạch hạnh nhân. Sự tái cấu trúc này giam hãm não bộ vào trạng thái cảnh giác quá mức trước các mối đe dọa, ưu tiên các phản xạ rập khuôn phòng thủ và làm tê liệt sự linh hoạt nhận thức cũng như tư duy phân kỳ sáng tạo.",
    "contextEn": "Sustained exposure to glucocorticoids causes structural dendritic atrophy within the hippocampus and prefrontal networks while promoting dendritic hypertrophy in the basolateral amygdala. This morphological reconfiguration locks the brain into hypervigilant threat detection, prioritizing stereotyped, threat-avoidant routines at the expense of cognitive flexibility, associative memory retrieval, and divergent hypothesis generation.",
    "options": [
      "Gây teo đuôi gai ở vỏ não trước trán và khóa não vào chế độ cảnh giác phòng vệ rập khuôn (Dendritic atrophy)",
      "Kích hoạt bán cầu não phải hoạt động quá mức",
      "Làm tê liệt thính giác và thị giác vĩnh viễn",
      "Tăng cường số lượng nơ-ron thần kinh ở vùng ngôn ngữ"
    ],
    "optionsVi": [
      "Gây teo đuôi gai ở vỏ não trước trán và khóa não vào chế độ cảnh giác phòng vệ rập khuôn (Dendritic atrophy)",
      "Kích hoạt bán cầu não phải hoạt động quá mức",
      "Làm tê liệt thính giác và thị giác vĩnh viễn",
      "Tăng cường số lượng nơ-ron thần kinh ở vùng ngôn ngữ"
    ],
    "optionsEn": [
      "Induces prefrontal dendritic atrophy, locking neural architecture into threat-avoidant stereotyped routines",
      "Excessively hyperactivates the right hemisphere creative loci",
      "Permanently damages peripheral auditory sensory nerves",
      "Accelerates adult neurogenesis in temporal language lobes"
    ],
    "correctIndex": 0,
    "correctAnswer": "Gây teo đuôi gai ở vỏ não trước trán và khóa não vào chế độ cảnh giác phòng vệ rập khuôn (Dendritic atrophy)",
    "correctAnswerEn": "Induces prefrontal dendritic atrophy, locking neural architecture into threat-avoidant stereotyped routines",
    "explanation": "Bài đọc giải thích cơ chế sinh học: glucocorticoid làm teo đuôi gai (\"dendritic atrophy\") và biến đổi thần kinh ưu tiên sự cảnh giác mối đe dọa, làm mất tính linh hoạt sáng tạo.",
    "explanationVi": "Bài đọc giải thích cơ chế sinh học: glucocorticoid làm teo đuôi gai (\"dendritic atrophy\") và biến đổi thần kinh ưu tiên sự cảnh giác mối đe dọa, làm mất tính linh hoạt sáng tạo.",
    "explanationEn": "The passage highlights that prolonged stress causes dendritic atrophy, locking the neural state into hypervigilant defense routines."
  },
  {
    "id": "b3_hard_vocab_c1_07",
    "difficulty": "hard",
    "topic": "technology",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Matrix - Band 8.0 Target",
    "prompt": "Chọn tính từ học thuật C1 diễn tả công nghệ \"có mặt ở khắp mọi nơi, phổ biến cùng lúc\":",
    "promptVi": "Chọn tính từ học thuật C1 diễn tả công nghệ \"có mặt ở khắp mọi nơi, phổ biến cùng lúc\":",
    "promptEn": "Select the high-tier academic adjective meaning present, appearing, or found everywhere simultaneously:",
    "context": "Smartphones and algorithmic recommendation engines have become virtually _____ in modern metropolitan life.",
    "contextVi": "Smartphones and algorithmic recommendation engines have become virtually _____ in modern metropolitan life.",
    "contextEn": "Smartphones and algorithmic recommendation engines have become virtually _____ in modern metropolitan life.",
    "options": [
      "ubiquitous",
      "intermittent",
      "sporadic",
      "parochial"
    ],
    "optionsVi": [
      "ubiquitous (phổ biến khắp nơi, đâu đâu cũng thấy)",
      "intermittent (chập chờn ngắt quãng)",
      "sporadic (rải rác thưa thớt)",
      "parochial (mang tính cục bộ hạn hẹp)"
    ],
    "optionsEn": [
      "ubiquitous",
      "intermittent",
      "sporadic",
      "parochial"
    ],
    "correctIndex": 0,
    "correctAnswer": "ubiquitous",
    "correctAnswerEn": "ubiquitous",
    "explanation": "\"Ubiquitous\" (/juːˈbɪkwɪtəs/ - present, appearing, or found everywhere) là từ vựng C1/C2 cực kỳ chuẩn xác cho bài thi Writing & Speaking.",
    "explanationVi": "\"Ubiquitous\" (/juːˈbɪkwɪtəs/ - present, appearing, or found everywhere) là từ vựng C1/C2 cực kỳ chuẩn xác cho bài thi Writing & Speaking.",
    "explanationEn": "\"Ubiquitous\" is an elite academic synonym for \"pervasive\" or \"omnipresent\" in sociocultural and technological essays."
  },
  {
    "id": "b3_hard_grammar_cleft_01",
    "difficulty": "hard",
    "topic": "urbanization",
    "skillCategory": "grammar",
    "type": "hedging",
    "cambridgeSource": "Academic Complex Sentence Structure - Cleft Sentence",
    "prompt": "Chọn câu chẻ (Cleft Sentence) nhấn mạnh giải pháp quy hoạch đô thị hoàn toàn chính xác về ngữ pháp:",
    "promptVi": "Chọn câu chẻ (Cleft Sentence) nhấn mạnh giải pháp quy hoạch đô thị hoàn toàn chính xác về ngữ pháp:",
    "promptEn": "Select the cleft sentence that flawlessly emphasizes the urban planning intervention:",
    "context": "Identify the sophisticated cleft structure for an IELTS Task 2 argument:",
    "contextVi": "Xác định cấu trúc câu chẻ học thuật phục vụ bài thi IELTS Writing Task 2:",
    "contextEn": "Identify the sophisticated cleft structure for an IELTS Task 2 argument:",
    "options": [
      "It is through subsidized mass transit, rather than penalizing private car owners, that urban gridlock can be permanently mitigated.",
      "It is through subsidized mass transit, rather than penalizing private car owners, who urban gridlock can be permanently mitigated.",
      "What urban gridlock can permanently be mitigated is through subsidized mass transit.",
      "It was through subsidized mass transit that urban gridlock can permanently mitigated."
    ],
    "optionsVi": [
      "It is through subsidized mass transit... that... (Cleft chuẩn: It is + Prep phrase + THAT)",
      "It is... who... (Sai: dùng who cho vật)",
      "What urban gridlock... is through... (Sai trật tự cú pháp)",
      "It was... can permanently mitigated (Sai thì và thiếu to be ở bị động)"
    ],
    "optionsEn": [
      "It is through subsidized mass transit, rather than penalizing private car owners, that urban gridlock can be permanently mitigated.",
      "It is through subsidized mass transit, rather than penalizing private car owners, who urban gridlock can be permanently mitigated.",
      "What urban gridlock can permanently be mitigated is through subsidized mass transit.",
      "It was through subsidized mass transit that urban gridlock can permanently mitigated."
    ],
    "correctIndex": 0,
    "correctAnswer": "It is through subsidized mass transit, rather than penalizing private car owners, that urban gridlock can be permanently mitigated.",
    "correctAnswerEn": "It is through subsidized mass transit, rather than penalizing private car owners, that urban gridlock can be permanently mitigated.",
    "explanation": "Cấu trúc It-cleft chuẩn nhấn mạnh cụm trạng từ: It is + [Through ...] + THAT + mệnh đề.",
    "explanationVi": "Cấu trúc It-cleft chuẩn nhấn mạnh cụm trạng từ: It is + [Through ...] + THAT + mệnh đề.",
    "explanationEn": "The canonical it-cleft formula to emphasize a prepositional instrument is: It is + [Prepositional Phrase] + THAT + clause."
  },
  {
    "id": "b3_nightmare_read_c16_p3_baumol_01",
    "difficulty": "nightmare",
    "topic": "economy",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 16 Academic - AI & Labour Macroeconomics",
    "prompt": "Hiệu ứng \"Bệnh chi phí Baumol\" (Baumol's Cost Disease) trong kỷ nguyên tự động hóa AI dẫn đến kết quả kinh tế vĩ mô nào?",
    "promptVi": "Hiệu ứng \"Bệnh chi phí Baumol\" (Baumol's Cost Disease) trong kỷ nguyên tự động hóa AI dẫn đến kết quả kinh tế vĩ mô nào?",
    "promptEn": "According to macroeconomic analysis, how does Baumol's Cost Disease manifest as artificial intelligence automates cognitive labour?",
    "context": "As algorithmic automation exponentially drives down production costs in technologically progressive sectors like software, manufacturing, and analytics, non-automatable personal human services—such as healthcare, personalized pedagogy, and artisanal craftsmanship—experience escalating relative costs. Because wages in stagnant personal sectors must rise to match economy-wide norms despite flat physical productivity, total economic expenditure shifts disproportionately toward human-centric services.",
    "contextVi": "Khi tự động hóa bằng thuật toán làm giảm cấp số nhân chi phí sản xuất ở các ngành công nghệ tiến bộ (như phần mềm, sản xuất, phân tích dữ liệu), các dịch vụ cá nhân không thể tự động hóa của con người (như chăm sóc y tế, giảng dạy cá nhân hóa, thủ công mỹ nghệ) lại có chi phí tương đối tăng vọt. Do tiền lương ở các ngành trì trệ này phải tăng để bắt kịp mức chung của nền kinh tế dù năng suất vật lý không đổi, chi tiêu của nền kinh tế sẽ dịch chuyển áp đảo về phía các dịch vụ do con người đảm nhận.",
    "contextEn": "As algorithmic automation exponentially drives down production costs in technologically progressive sectors like software, manufacturing, and analytics, non-automatable personal human services—such as healthcare, personalized pedagogy, and artisanal craftsmanship—experience escalating relative costs. Because wages in stagnant personal sectors must rise to match economy-wide norms despite flat physical productivity, total economic expenditure shifts disproportionately toward human-centric services.",
    "options": [
      "Tổng chi tiêu xã hội dịch chuyển áp đảo sang các dịch vụ nhân văn không thể tự động hóa dù giá cả tăng cao (Disproportionately shifts toward human services)",
      "Mọi dịch vụ chăm sóc y tế và giáo dục đều giảm giá về 0",
      "Tất cả con người đều chuyển sang làm việc trong các nhà máy phần mềm",
      "Tỷ lệ lạm phát biến mất hoàn toàn trên toàn cầu"
    ],
    "optionsVi": [
      "Tổng chi tiêu xã hội dịch chuyển áp đảo sang các dịch vụ nhân văn không thể tự động hóa dù giá cả tăng cao (Disproportionately shifts toward human services)",
      "Mọi dịch vụ chăm sóc y tế và giáo dục đều giảm giá về 0",
      "Tất cả con người đều chuyển sang làm việc trong các nhà máy phần mềm",
      "Tỷ lệ lạm phát biến mất hoàn toàn trên toàn cầu"
    ],
    "optionsEn": [
      "Total expenditure shifts disproportionately toward non-automatable personal services despite their rising relative prices",
      "All medical healthcare and educational services become entirely free of charge",
      "The entire global workforce transitions into algorithmic software manufacturing",
      "Global monetary inflation permanently ceases to exist"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tổng chi tiêu xã hội dịch chuyển áp đảo sang các dịch vụ nhân văn không thể tự động hóa dù giá cả tăng cao (Disproportionately shifts toward human services)",
    "correctAnswerEn": "Total expenditure shifts disproportionately toward non-automatable personal services despite their rising relative prices",
    "explanation": "Bệnh chi phí Baumol giải thích rằng tự động hóa làm đồ công nghệ rẻ đi, nhưng chi tiêu xã hội lại dồn ngày càng nhiều vào y tế, giáo dục do năng suất con người không thể nhân bản bằng máy móc.",
    "explanationVi": "Bệnh chi phí Baumol giải thích rằng tự động hóa làm đồ công nghệ rẻ đi, nhưng chi tiêu xã hội lại dồn ngày càng nhiều vào y tế, giáo dục do năng suất con người không thể nhân bản bằng máy móc.",
    "explanationEn": "Baumol's cost disease demonstrates that automating goods pushes overall expenditure toward stagnant, human-centric services."
  },
  {
    "id": "b3_nightmare_c2_nuance_01",
    "difficulty": "nightmare",
    "topic": "culture",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Nuance - Band 9.0 Distinctions",
    "prompt": "Chọn tính từ học thuật C2 diễn tả một lập luận \"mỏng manh, thiếu căn cứ xác thực\":",
    "promptVi": "Chọn tính từ học thuật C2 diễn tả một lập luận \"mỏng manh, thiếu căn cứ xác thực\":",
    "promptEn": "Select the Band 9.0 C2 academic adjective meaning extremely weak, insubstantial, or fragile:",
    "context": "The historian argued that the documentary evidence linking the anonymous manuscript to the court clerk was remarkably _____.",
    "contextVi": "The historian argued that the documentary evidence linking the anonymous manuscript to the court clerk was remarkably _____.",
    "contextEn": "The historian argued that the documentary evidence linking the anonymous manuscript to the court clerk was remarkably _____.",
    "options": [
      "tenuous",
      "robust",
      "irrefutable",
      "substantive"
    ],
    "optionsVi": [
      "tenuous (mỏng manh, yếu ớt, thiếu cơ sở)",
      "robust (vững chắc, cường tráng - trái nghĩa)",
      "irrefutable (không thể bác bỏ - trái nghĩa)",
      "substantive (thực chất, trọng yếu - trái nghĩa)"
    ],
    "optionsEn": [
      "tenuous",
      "robust",
      "irrefutable",
      "substantive"
    ],
    "correctIndex": 0,
    "correctAnswer": "tenuous",
    "correctAnswerEn": "tenuous",
    "explanation": "\"Tenuous\" (/ˈtenjuəs/ - very weak or slight) là tính từ C2 kinh điển miêu tả các liên kết, lập luận hoặc bằng chứng mong manh.",
    "explanationVi": "\"Tenuous\" (/ˈtenjuəs/ - very weak or slight) là tính từ C2 kinh điển miêu tả các liên kết, lập luận hoặc bằng chứng mong manh.",
    "explanationEn": "\"Tenuous\" describes an association, link, argument, or empirical premise that is extraordinarily flimsy and ungrounded."
  },
  {
    "id": "b3_easy_spell_14",
    "difficulty": "easy",
    "topic": "urbanization",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #94",
    "prompt": "Chọn từ viết đúng chính tả cho danh từ \"quốc hội, nghị viện\":",
    "promptVi": "Chọn từ viết đúng chính tả cho danh từ \"quốc hội, nghị viện\":",
    "promptEn": "Select the authentic spelling for the supreme legislative body:",
    "context": "The new environmental legislation was ratified by _____ yesterday afternoon.",
    "contextVi": "The new environmental legislation was ratified by _____ yesterday afternoon.",
    "contextEn": "The new environmental legislation was ratified by _____ yesterday afternoon.",
    "options": [
      "parliament",
      "parliment",
      "parlaiment",
      "parleament"
    ],
    "optionsVi": [
      "parliament (đúng: có chữ i giữa a và a)",
      "parliment (thiếu chữ a)",
      "parlaiment (đảo vị trí i)",
      "parleament (sai vần)"
    ],
    "optionsEn": [
      "parliament",
      "parliment",
      "parlaiment",
      "parleament"
    ],
    "correctIndex": 0,
    "correctAnswer": "parliament",
    "correctAnswerEn": "parliament",
    "explanation": "Từ \"parliament\" có chữ \"ia\" (p-a-r-l-I-A-m-e-n-t), bắt nguồn từ tiếng Pháp parler (nói).",
    "explanationVi": "Từ \"parliament\" có chữ \"ia\" (p-a-r-l-I-A-m-e-n-t), bắt nguồn từ tiếng Pháp parler (nói).",
    "explanationEn": "\"Parliament\" contains the vowel digraph \"-ia-\" (p-a-r-l-i-a-m-e-n-t), stemming from Old French parler."
  },
  {
    "id": "b3_easy_spell_15",
    "difficulty": "easy",
    "topic": "science",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #97",
    "prompt": "Chọn phương án viết đúng cho danh từ \"nhịp điệu, tiết tấu\":",
    "promptVi": "Chọn phương án viết đúng cho danh từ \"nhịp điệu, tiết tấu\":",
    "promptEn": "Select the authentic spelling for the noun denoting a regular repeated pattern of movement or sound:",
    "context": "Circadian _____ governs human hormonal release and body temperature fluctuations.",
    "contextVi": "Circadian _____ governs human hormonal release and body temperature fluctuations.",
    "contextEn": "Circadian _____ governs human hormonal release and body temperature fluctuations.",
    "options": [
      "rhythm",
      "rythm",
      "rhytm",
      "rhythym"
    ],
    "optionsVi": [
      "rhythm (đúng: r-h-y-t-h-m)",
      "rythm (thiếu chữ h đầu)",
      "rhytm (thiếu chữ h thứ hai)",
      "rhythym (thừa chữ y)"
    ],
    "optionsEn": [
      "rhythm",
      "rythm",
      "rhytm",
      "rhythym"
    ],
    "correctIndex": 0,
    "correctAnswer": "rhythm",
    "correctAnswerEn": "rhythm",
    "explanation": "\"Rhythm\" có 2 chữ \"h\": một sau chữ r, một sau chữ t (r-H-y-t-H-m).",
    "explanationVi": "\"Rhythm\" có 2 chữ \"h\": một sau chữ r, một sau chữ t (r-H-y-t-H-m).",
    "explanationEn": "\"Rhythm\" strictly requires two \"h\" consonants flanking the \"y\" and \"t\" (r-h-y-t-h-m)."
  },
  {
    "id": "b3_easy_spell_16",
    "difficulty": "easy",
    "topic": "technology",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #99",
    "prompt": "Chọn phương án viết đúng cho danh từ \"đồng hồ đo áp suất, thước đo\":",
    "promptVi": "Chọn phương án viết đúng cho danh từ \"đồng hồ đo áp suất, thước đo\":",
    "promptEn": "Select the correct spelling for a device used for measuring magnitude, amount, or contents:",
    "context": "The laboratory technician calibrated the digital pressure _____ prior to testing.",
    "contextVi": "The laboratory technician calibrated the digital pressure _____ prior to testing.",
    "contextEn": "The laboratory technician calibrated the digital pressure _____ prior to testing.",
    "options": [
      "gauge",
      "guage",
      "gage",
      "gague"
    ],
    "optionsVi": [
      "gauge (đúng: a trước u)",
      "guage (sai: nhầm u trước a)",
      "gage (sai chuẩn khảo thí)",
      "gague (thừa chữ g)"
    ],
    "optionsEn": [
      "gauge",
      "guage",
      "gage",
      "gague"
    ],
    "correctIndex": 0,
    "correctAnswer": "gauge",
    "correctAnswerEn": "gauge",
    "explanation": "\"Gauge\" có chữ \"a\" đứng trước chữ \"u\" (g-a-u-g-e).",
    "explanationVi": "\"Gauge\" có chữ \"a\" đứng trước chữ \"u\" (g-a-u-g-e).",
    "explanationEn": "\"Gauge\" places \"a\" prior to \"u\" (g-a-u-g-e), a perpetual spelling obstacle in technical listening."
  },
  {
    "id": "b3_easy_lis_c8_t2_p1_02",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 2 Listening Part 1",
    "prompt": "Đồ vật nào của người khai báo bảo hiểm KHÔNG bị đánh cắp trong vụ trộm?",
    "promptVi": "Đồ vật nào của người khai báo bảo hiểm KHÔNG bị đánh cắp trong vụ trộm?",
    "promptEn": "Which item belonging to the policyholder was NOT taken during the residential burglary?",
    "context": "Caller: The thieves took my digital camera and the work laptop from the dining table. Fortunately, my designer sunglasses and wallet were still inside my jacket pocket in the hallway.",
    "contextVi": "Caller: The thieves took my digital camera and the work laptop from the dining table. Fortunately, my designer sunglasses and wallet were still inside my jacket pocket in the hallway.",
    "contextEn": "Caller: The thieves took my digital camera and the work laptop from the dining table. Fortunately, my designer sunglasses and wallet were still inside my jacket pocket in the hallway.",
    "options": [
      "Kính râm và ví tiền (Designer sunglasses and wallet)",
      "Máy tính xách tay cơ quan (Work laptop)",
      "Máy ảnh kỹ thuật số (Digital camera)",
      "Tất cả các tài sản đều bị lấy sạch"
    ],
    "optionsVi": [
      "Kính râm và ví tiền (Designer sunglasses and wallet)",
      "Máy tính xách tay cơ quan (Work laptop)",
      "Máy ảnh kỹ thuật số (Digital camera)",
      "Tất cả các tài sản đều bị lấy sạch"
    ],
    "optionsEn": [
      "Designer sunglasses and wallet",
      "Work laptop",
      "Digital camera",
      "All household possessions were stolen"
    ],
    "correctIndex": 0,
    "correctAnswer": "Kính râm và ví tiền (Designer sunglasses and wallet)",
    "correctAnswerEn": "Designer sunglasses and wallet",
    "explanation": "Người gọi làm rõ: kính râm và ví tiền may mắn vẫn còn trong túi áo khoác (\"Fortunately, my designer sunglasses and wallet were still inside my jacket pocket\").",
    "explanationVi": "Người gọi làm rõ: kính râm và ví tiền may mắn vẫn còn trong túi áo khoác (\"Fortunately, my designer sunglasses and wallet were still inside my jacket pocket\").",
    "explanationEn": "The caller explicitly confirms that the sunglasses and wallet remained untouched inside a jacket pocket."
  },
  {
    "id": "b3_easy_lis_c8_t3_p1_02",
    "difficulty": "easy",
    "topic": "urbanization",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 3 Listening Part 1",
    "prompt": "Thời hạn thuê tối thiểu đối với căn hộ một phòng ngủ là bao lâu?",
    "promptVi": "Thời hạn thuê tối thiểu đối với căn hộ một phòng ngủ là bao lâu?",
    "promptEn": "What is the minimum statutory lease duration for the furnished studio apartment?",
    "context": "Agent: While we occasionally permit three-month seasonal sublets during winter, this particular landlord insists on a minimum six-month tenancy agreement.",
    "contextVi": "Agent: While we occasionally permit three-month seasonal sublets during winter, this particular landlord insists on a minimum six-month tenancy agreement.",
    "contextEn": "Agent: While we occasionally permit three-month seasonal sublets during winter, this particular landlord insists on a minimum six-month tenancy agreement.",
    "options": [
      "6 tháng (6 months)",
      "3 tháng (3 months)",
      "12 tháng (12 months)",
      "1 tháng (1 month)"
    ],
    "optionsVi": [
      "6 tháng (6 months)",
      "3 tháng (3 months)",
      "12 tháng (12 months)",
      "1 tháng (1 month)"
    ],
    "optionsEn": [
      "6 months",
      "3 months",
      "12 months",
      "1 month"
    ],
    "correctIndex": 0,
    "correctAnswer": "6 tháng (6 months)",
    "correctAnswerEn": "6 months",
    "explanation": "Bẫy thời gian: đại lý nhắc tới 3 tháng mùa đông, nhưng nhấn mạnh chủ nhà này yêu cầu tối thiểu 6 tháng (\"minimum six-month tenancy agreement\").",
    "explanationVi": "Bẫy thời gian: đại lý nhắc tới 3 tháng mùa đông, nhưng nhấn mạnh chủ nhà này yêu cầu tối thiểu 6 tháng (\"minimum six-month tenancy agreement\").",
    "explanationEn": "Distractor trap: the agent mentions winter 3-month sublets but specifies this landlord requires a \"minimum six-month tenancy\"."
  },
  {
    "id": "b3_med_read_c20_p1_03",
    "difficulty": "medium",
    "topic": "environment",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Biện pháp công nghệ hiện đại nào được các nhà bảo tồn New Zealand áp dụng để theo dõi vẹt Kākāpō?",
    "promptVi": "Biện pháp công nghệ hiện đại nào được các nhà bảo tồn New Zealand áp dụng để theo dõi vẹt Kākāpō?",
    "promptEn": "Which advanced technological device is fitted to adult kākāpō to monitor their movements and survival?",
    "context": "To maximize monitoring precision on offshore sanctuaries, conservation rangers equipped every adult bird with a miniature solar-powered GPS transmitter backpack, allowing real-time positional logging and automated distress telemetry.",
    "contextVi": "Để tối đa hóa độ chính xác theo dõi trên các đảo bảo tồn, các nhân viên kiểm lâm đã trang bị cho mỗi cá thể vẹt trưởng thành một balo máy phát GPS mini chạy bằng năng lượng mặt trời, cho phép ghi nhận vị trí thời gian thực và tự động phát tín hiệu cấp cứu.",
    "contextEn": "To maximize monitoring precision on offshore sanctuaries, conservation rangers equipped every adult bird with a miniature solar-powered GPS transmitter backpack, allowing real-time positional logging and automated distress telemetry.",
    "options": [
      "Balo gắn máy phát tín hiệu định vị GPS mini chạy bằng năng lượng mặt trời (Solar-powered GPS transmitter backpack)",
      "Vòng kim loại truyền thống gắn ở chân",
      "Gắn chip dưới da bằng laser",
      "Máy bay không người lái bay theo đàn liên tục"
    ],
    "optionsVi": [
      "Balo gắn máy phát tín hiệu định vị GPS mini chạy bằng năng lượng mặt trời (Solar-powered GPS transmitter backpack)",
      "Vòng kim loại truyền thống gắn ở chân",
      "Gắn chip dưới da bằng laser",
      "Máy bay không người lái bay theo đàn liên tục"
    ],
    "optionsEn": [
      "Miniature solar-powered GPS transmitter backpacks",
      "Traditional aluminum leg bands",
      "Subdermal laser microchips",
      "Continuous low-altitude surveillance drones"
    ],
    "correctIndex": 0,
    "correctAnswer": "Balo gắn máy phát tín hiệu định vị GPS mini chạy bằng năng lượng mặt trời (Solar-powered GPS transmitter backpack)",
    "correctAnswerEn": "Miniature solar-powered GPS transmitter backpacks",
    "explanation": "Đoạn văn nêu rõ trang bị hiện đại là \"miniature solar-powered GPS transmitter backpack\".",
    "explanationVi": "Đoạn văn nêu rõ trang bị hiện đại là \"miniature solar-powered GPS transmitter backpack\".",
    "explanationEn": "The passage explicitly mentions \"miniature solar-powered GPS transmitter backpack\" fitted onto each adult parrot."
  },
  {
    "id": "b3_med_read_c18_p1_02",
    "difficulty": "medium",
    "topic": "urbanization",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Đánh giá nhận định về việc sử dụng thuốc bảo vệ thực vật trong nông nghiệp thẳng đứng khép kín:",
    "promptVi": "Đánh giá nhận định về việc sử dụng thuốc bảo vệ thực vật trong nông nghiệp thẳng đứng khép kín:",
    "promptEn": "Evaluate the statement regarding chemical pesticides in closed vertical farming architectures:",
    "context": "Passage: Because vertical growing trays operate within hermetically sealed, biosecure indoor chambers filtered against pests, crops are cultivated entirely free of synthetic chemical pesticides and fungicides.\n\nStatement: Vertical indoor farms require synthetic chemical pesticides to protect high-density crops from insect infestations.",
    "contextVi": "Đoạn văn: Do các khay trồng thẳng đứng hoạt động bên trong các phòng kín kín khí, được lọc bảo vệ sinh học chống sâu bọ, cây trồng được canh tác hoàn toàn không sử dụng thuốc trừ sâu hóa học và thuốc diệt nấm tổng hợp.\n\nNhận định: Nông trại thẳng đứng trong nhà đòi hỏi thuốc trừ sâu hóa học tổng hợp để bảo vệ cây trồng mật độ cao khỏi sâu bệnh.",
    "contextEn": "Passage: Because vertical growing trays operate within hermetically sealed, biosecure indoor chambers filtered against pests, crops are cultivated entirely free of synthetic chemical pesticides and fungicides.\n\nStatement: Vertical indoor farms require synthetic chemical pesticides to protect high-density crops from insect infestations.",
    "options": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "FALSE (Sai - bài nêu cây trồng hoàn toàn không dùng thuốc trừ sâu hóa học \"entirely free\")",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "FALSE",
    "correctAnswerEn": "FALSE",
    "explanation": "Bài viết khẳng định cây trồng \"entirely free of synthetic chemical pesticides\", trái ngược hoàn toàn với nhận định \"require synthetic chemical pesticides\". Do đó đáp án là FALSE.",
    "explanationVi": "Bài viết khẳng định cây trồng \"entirely free of synthetic chemical pesticides\", trái ngược hoàn toàn với nhận định \"require synthetic chemical pesticides\". Do đó đáp án là FALSE.",
    "explanationEn": "The passage asserts crops are \"entirely free of synthetic chemical pesticides\", directly contradicting the statement."
  },
  {
    "id": "b3_med_read_c17_p1_02",
    "difficulty": "medium",
    "topic": "urbanization",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 17 Academic - Reading Test 1 (Passage 1)",
    "prompt": "Vấn đề môi trường nào từng khiến hành khách tuyến tàu điện ngầm đầu tiên của London phàn nàn nhiều nhất?",
    "promptVi": "Vấn đề môi trường nào từng khiến hành khách tuyến tàu điện ngầm đầu tiên của London phàn nàn nhiều nhất?",
    "promptEn": "What environmental nuisance generated the most severe passenger complaints on London's earliest underground lines?",
    "context": "Because the original underground locomotives were powered by burning coal steam engines, tunnels were frequently engulfed in suffocating clouds of sulfurous smoke and soot, causing severe eye irritation and respiratory distress despite rudimentary ventilation blowholes.",
    "contextVi": "Vì các đầu máy ngầm ban đầu chạy bằng động cơ hơi nước đốt than, các đường hầm thường xuyên bị bao trùm trong những đám khói lưu huỳnh và bồ hóng ngột ngạt, gây cay mắt và khó thở nghiêm trọng dù có các giếng thông gió thô sơ.",
    "contextEn": "Because the original underground locomotives were powered by burning coal steam engines, tunnels were frequently engulfed in suffocating clouds of sulfurous smoke and soot, causing severe eye irritation and respiratory distress despite rudimentary ventilation blowholes.",
    "options": [
      "Khói lưu huỳnh và bồ hóng ngột ngạt từ đầu máy hơi nước (Sulfurous smoke and soot from coal steam engines)",
      "Nhiệt độ đóng băng vào mùa đông",
      "Nước ngầm ngập lụt quá đầu gối",
      "Tiếng ồn động cơ điện siêu thanh"
    ],
    "optionsVi": [
      "Khói lưu huỳnh và bồ hóng ngột ngạt từ đầu máy hơi nước (Sulfurous smoke and soot from coal steam engines)",
      "Nhiệt độ đóng băng vào mùa đông",
      "Nước ngầm ngập lụt quá đầu gối",
      "Tiếng ồn động cơ điện siêu thanh"
    ],
    "optionsEn": [
      "Suffocating sulfurous smoke and soot from coal steam locomotives",
      "Sub-zero freezing temperatures inside carriages",
      "Knee-deep groundwater inundations during storms",
      "Ultrasonic screeching from early electric traction dynamos"
    ],
    "correctIndex": 0,
    "correctAnswer": "Khói lưu huỳnh và bồ hóng ngột ngạt từ đầu máy hơi nước (Sulfurous smoke and soot from coal steam engines)",
    "correctAnswerEn": "Suffocating sulfurous smoke and soot from coal steam locomotives",
    "explanation": "Bài đọc chỉ rõ nguyên nhân ô nhiễm là khói lưu huỳnh và bồ hóng (\"sulfurous smoke and soot\") do đầu máy hơi nước đốt than xả ra trong đường hầm.",
    "explanationVi": "Bài đọc chỉ rõ nguyên nhân ô nhiễm là khói lưu huỳnh và bồ hóng (\"sulfurous smoke and soot\") do đầu máy hơi nước đốt than xả ra trong đường hầm.",
    "explanationEn": "The passage details that steam-powered locomotives generated choking clouds of sulfurous smoke and soot."
  },
  {
    "id": "b3_med_read_101_t2_p1_02",
    "difficulty": "medium",
    "topic": "environment",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "101 Past Papers - Reading Test 2 (Passage 1 Turtles)",
    "prompt": "Đánh giá nhận định về tập tính định vị bãi đẻ của loài rùa biển da (Leatherback Sea Turtle):",
    "promptVi": "Đánh giá nhận định về tập tính định vị bãi đẻ của loài rùa biển da (Leatherback Sea Turtle):",
    "promptEn": "Evaluate the statement regarding nesting site philopatry in Leatherback Sea Turtles:",
    "context": "Passage: Adult female leatherbacks navigate thousands of maritime kilometers across the Pacific to return precisely to the natal beach where they hatched decades earlier, guided by internal geomagnetic imprinting.\n\nStatement: Female leatherback turtles lay their eggs on random coastlines regardless of where they were originally born.",
    "contextVi": "Đoạn văn: Rùa da cái trưởng thành điều hướng hàng ngàn km trên Thái Bình Dương để quay trở lại chính xác bãi biển nơi chúng nở ra nhiều thập kỷ trước, được dẫn đường bởi ký ức từ trường Trái Đất bẩm sinh.\n\nNhận định: Rùa da cái đẻ trứng ở các bờ biển ngẫu nhiên bất kể nơi chúng sinh ra.",
    "contextEn": "Passage: Adult female leatherbacks navigate thousands of maritime kilometers across the Pacific to return precisely to the natal beach where they hatched decades earlier, guided by internal geomagnetic imprinting.\n\nStatement: Female leatherback turtles lay their eggs on random coastlines regardless of where they were originally born.",
    "options": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "FALSE (Sai - rùa quay về chính xác bãi biển nơi sinh ra \"natal beach\")",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "FALSE",
    "correctAnswerEn": "FALSE",
    "explanation": "Bài đọc nêu rùa quay về chính xác bãi biển nơi sinh ra (\"precisely to the natal beach\"), mâu thuẫn hoàn toàn với nhận định \"random coastlines\". Do đó đáp án là FALSE.",
    "explanationVi": "Bài đọc nêu rùa quay về chính xác bãi biển nơi sinh ra (\"precisely to the natal beach\"), mâu thuẫn hoàn toàn với nhận định \"random coastlines\". Do đó đáp án là FALSE.",
    "explanationEn": "The text verifies that females return \"precisely to the natal beach\", refuting the assertion that they nest randomly."
  },
  {
    "id": "b3_med_vocab_08",
    "difficulty": "medium",
    "topic": "economy",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 7.0",
    "prompt": "Chọn tính từ học thuật C1 diễn tả giải pháp mang tính \"thực tế, chú trọng kết quả khả thi\":",
    "promptVi": "Chọn tính từ học thuật C1 diễn tả giải pháp mang tính \"thực tế, chú trọng kết quả khả thi\":",
    "promptEn": "Select the C1 academic adjective meaning dealing with things sensibly and realistically based on practical rather than theoretical considerations:",
    "context": "The economic committee adopted a _____ approach to fiscal deficit reduction.",
    "contextVi": "The economic committee adopted a _____ approach to fiscal deficit reduction.",
    "contextEn": "The economic committee adopted a _____ approach to fiscal deficit reduction.",
    "options": [
      "pragmatic",
      "dogmatic",
      "utopian",
      "esoteric"
    ],
    "optionsVi": [
      "pragmatic (thực dụng, chú trọng thực tiễn khả thi)",
      "dogmatic (giáo điều, bảo thủ)",
      "utopian (không tưởng, viển vông)",
      "esoteric (hàn lâm khó hiểu, chỉ người trong cuộc biết)"
    ],
    "optionsEn": [
      "pragmatic",
      "dogmatic",
      "utopian",
      "esoteric"
    ],
    "correctIndex": 0,
    "correctAnswer": "pragmatic",
    "correctAnswerEn": "pragmatic",
    "explanation": "\"Pragmatic\" (/præɡˈmætɪk/) là từ vựng nâng cấp Band 7.5+ chuẩn cho \"practical / sensible\".",
    "explanationVi": "\"Pragmatic\" (/præɡˈmætɪk/) là từ vựng nâng cấp Band 7.5+ chuẩn cho \"practical / sensible\".",
    "explanationEn": "\"Pragmatic\" is the standard formal term for a realistic, practice-oriented methodology."
  },
  {
    "id": "b3_med_vis_chart_02",
    "difficulty": "medium",
    "topic": "urbanization",
    "skillCategory": "visual_data",
    "type": "chart_reading",
    "cambridgeSource": "Writing Task 1 Data Bank - Pie Chart Modal Split",
    "prompt": "Dựa vào cơ cấu phương tiện giao thông, phương thức nào chiếm tỷ trọng áp đảo hơn 50%?",
    "promptVi": "Dựa vào cơ cấu phương tiện giao thông, phương thức nào chiếm tỷ trọng áp đảo hơn 50%?",
    "promptEn": "According to the municipal commuter modal split, which transit mode accounts for an outright majority (>50%)?",
    "context": "Data Distribution: Underground Metro: 54%, Public Bus: 22%, Private Passenger Car: 16%, Bicycle & Walking: 8%.",
    "contextVi": "Phân bổ: Tàu điện ngầm: 54%, Xe buýt: 22%, Ô tô cá nhân: 16%, Đi bộ & Xe đạp: 8%.",
    "contextEn": "Data Distribution: Underground Metro: 54%, Public Bus: 22%, Private Passenger Car: 16%, Bicycle & Walking: 8%.",
    "options": [
      "Tàu điện ngầm (Underground Metro - 54%)",
      "Xe buýt công cộng (Public Bus - 22%)",
      "Ô tô cá nhân (Private Passenger Car - 16%)",
      "Đi bộ và xe đạp (Bicycle & Walking - 8%)"
    ],
    "optionsVi": [
      "Tàu điện ngầm (Underground Metro - 54%)",
      "Xe buýt công cộng (Public Bus - 22%)",
      "Ô tô cá nhân (Private Passenger Car - 16%)",
      "Đi bộ và xe đạp (Bicycle & Walking - 8%)"
    ],
    "optionsEn": [
      "Underground Metro (54%)",
      "Public Bus (22%)",
      "Private Passenger Car (16%)",
      "Bicycle & Walking (8%)"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tàu điện ngầm (Underground Metro - 54%)",
    "correctAnswerEn": "Underground Metro (54%)",
    "explanation": "Tàu điện ngầm (Underground Metro) đạt 54%, là phương tiện duy nhất vượt quá ngưỡng đa số tuyệt đối 50%.",
    "explanationVi": "Tàu điện ngầm (Underground Metro) đạt 54%, là phương tiện duy nhất vượt quá ngưỡng đa số tuyệt đối 50%.",
    "explanationEn": "The Underground Metro comprises 54%, representing the only mode securing an outright statistical majority."
  },
  {
    "id": "b3_hard_read_c18_p3_02",
    "difficulty": "hard",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 3 Space Debris)",
    "prompt": "Tại sao việc rác vũ trụ va chạm ở vận tốc quỹ đạo (orbital velocity) lại có sức tàn phá khủng khiếp ngay cả với các hạt sơn li ti?",
    "promptVi": "Tại sao việc rác vũ trụ va chạm ở vận tốc quỹ đạo (orbital velocity) lại có sức tàn phá khủng khiếp ngay cả với các hạt sơn li ti?",
    "promptEn": "Why do millimeter-sized flecks of space debris possess catastrophic kinetic destruction potential in Low Earth Orbit?",
    "context": "In Low Earth Orbit, operational satellites and debris travel at hypervelocities of approximately 7.5 to 8 kilometers per second (over 27,000 km/h). Because kinetic energy scales quadratically with velocity (KE = 1/2 mv^2), even a millimeter-sized fleck of peeling paint impacts with the destructive force equivalent to an artillery projectile, piercing pressurized spacecraft hulls.",
    "contextVi": "Ở Quỹ đạo tầm thấp Trái Đất, vệ tinh và mảnh vỡ di chuyển ở vận tốc siêu cao khoảng 7,5 đến 8 km/giây (hơn 27.000 km/h). Vì động năng tỉ lệ thuận với bình phương vận tốc, ngay cả một vảy sơn bong tróc cỡ milimét cũng va chạm với sức công phá tương đương một viên đạn pháo, xuyên thủng vỏ tàu vũ trụ chịu áp.",
    "contextEn": "In Low Earth Orbit, operational satellites and debris travel at hypervelocities of approximately 7.5 to 8 kilometers per second (over 27,000 km/h). Because kinetic energy scales quadratically with velocity (KE = 1/2 mv^2), even a millimeter-sized fleck of peeling paint impacts with the destructive force equivalent to an artillery projectile, piercing pressurized spacecraft hulls.",
    "options": [
      "Động năng tăng theo bình phương vận tốc siêu cao (7,5 - 8 km/s), tạo sức công phá như đạn pháo (Kinetic energy scales quadratically with hypervelocity)",
      "Vảy sơn chứa chất phóng xạ phân rạch hạt nhân",
      "Mảnh rác vũ trụ tự động tăng trọng lượng gấp nghìn lần khi bay",
      "Mảnh vỡ bị hút bởi từ trường cực mạnh của tàu vũ trụ"
    ],
    "optionsVi": [
      "Động năng tăng theo bình phương vận tốc siêu cao (7,5 - 8 km/s), tạo sức công phá như đạn pháo (Kinetic energy scales quadratically with hypervelocity)",
      "Vảy sơn chứa chất phóng xạ phân rạch hạt nhân",
      "Mảnh rác vũ trụ tự động tăng trọng lượng gấp nghìn lần khi bay",
      "Mảnh vỡ bị hút bởi từ trường cực mạnh của tàu vũ trụ"
    ],
    "optionsEn": [
      "Kinetic energy scales quadratically with hypervelocity (7.5-8 km/s), matching the impact of artillery shells",
      "Paint flecks harbor weaponized nuclear fissile isotopes",
      "Orbital detritus spontaneously multiplies its mass a thousandfold",
      "Debris is pulled by electromagnetic attraction toward pressurized hulls"
    ],
    "correctIndex": 0,
    "correctAnswer": "Động năng tăng theo bình phương vận tốc siêu cao (7,5 - 8 km/s), tạo sức công phá như đạn pháo (Kinetic energy scales quadratically with hypervelocity)",
    "correctAnswerEn": "Kinetic energy scales quadratically with hypervelocity (7.5-8 km/s), matching the impact of artillery shells",
    "explanation": "Đoạn văn phân tích định luật vật lý: vận tốc 7,5–8 km/s khiến động năng tăng theo bình phương (quadratically), biến hạt sơn thành vật thể có sức công phá như đạn pháo.",
    "explanationVi": "Đoạn văn phân tích định luật vật lý: vận tốc 7,5–8 km/s khiến động năng tăng theo bình phương (quadratically), biến hạt sơn thành vật thể có sức công phá như đạn pháo.",
    "explanationEn": "The text explains that orbital hypervelocities mean kinetic energy scales quadratically, making tiny flecks as destructive as artillery."
  },
  {
    "id": "b3_hard_read_c16_p2_02",
    "difficulty": "hard",
    "topic": "culture",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 16 Academic - Reading Test 1 (Passage 2 Djoser)",
    "prompt": "Hệ thống mê cung đường hầm ngầm bên dưới Kim tự tháp Djoser được thiết kế nhằm mục đích chính nào?",
    "promptVi": "Hệ thống mê cung đường hầm ngầm bên dưới Kim tự tháp Djoser được thiết kế nhằm mục đích chính nào?",
    "promptEn": "What primary funerary and logistical objective did the subterranean labyrinth beneath the Step Pyramid serve?",
    "context": "Beneath the monumental superstructure lies a colossal subterranean labyrinth spanning nearly six kilometers of interconnected galleries, shafts, and chambers. This subterranean complex served not only as the eternal resting vault for Pharaoh Djoser and forty royal family members, but also as an impenetrable vault safeguarding over forty thousand carved stone vessels to deter grave robbers.",
    "contextVi": "Bên dưới kiến trúc đồ sộ là một mê cung ngầm khổng lồ dài gần 6 km gồm các hành lang, giếng thông và phòng thông nhau. Khu phức hợp dưới lòng đất này không chỉ là nơi an nghỉ vĩnh hằng cho Pharaoh Djoser và 40 thành viên hoàng tộc, mà còn là kho báu kiên cố lưu giữ hơn 40.000 chiếc bình đá chạm khắc để ngăn chặn những kẻ đào trộm mộ.",
    "contextEn": "Beneath the monumental superstructure lies a colossal subterranean labyrinth spanning nearly six kilometers of interconnected galleries, shafts, and chambers. This subterranean complex served not only as the eternal resting vault for Pharaoh Djoser and forty royal family members, but also as an impenetrable vault safeguarding over forty thousand carved stone vessels to deter grave robbers.",
    "options": [
      "Nơi an táng hoàng tộc và cất giữ hơn 40.000 bình đá quý chống trộm mộ (Resting vault and security deterrent)",
      "Bể chứa nước ngầm phục vụ tưới tiêu sông Nile",
      "Khu trại giam các tù binh chiến tranh",
      "Hệ thống cống thoát nước mưa đô thị"
    ],
    "optionsVi": [
      "Nơi an táng hoàng tộc và cất giữ hơn 40.000 bình đá quý chống trộm mộ (Resting vault and security deterrent)",
      "Bể chứa nước ngầm phục vụ tưới tiêu sông Nile",
      "Khu trại giam các tù binh chiến tranh",
      "Hệ thống cống thoát nước mưa đô thị"
    ],
    "optionsEn": [
      "Royal burial chambers and impenetrable vault securing 40,000 carved stone vessels against grave looters",
      "Subterranean freshwater reservoir for Nile irrigation",
      "Detention garrison for foreign prisoners of war",
      "Municipal storm sewer drainage network for Saqqara"
    ],
    "correctIndex": 0,
    "correctAnswer": "Nơi an táng hoàng tộc và cất giữ hơn 40.000 bình đá quý chống trộm mộ (Resting vault and security deterrent)",
    "correctAnswerEn": "Royal burial chambers and impenetrable vault securing 40,000 carved stone vessels against grave looters",
    "explanation": "Đoạn văn nêu rõ công năng kép: nơi an táng của Djoser cùng 40 thành viên hoàng tộc và cất giữ hơn 40.000 bình đá để ngăn trộm mộ.",
    "explanationVi": "Đoạn văn nêu rõ công năng kép: nơi an táng của Djoser cùng 40 thành viên hoàng tộc và cất giữ hơn 40.000 bình đá để ngăn trộm mộ.",
    "explanationEn": "The passage highlights its dual purpose: interring the royal dynasty and securing 40,000 stone vessels against looters."
  },
  {
    "id": "b3_hard_vocab_c1_09",
    "difficulty": "hard",
    "topic": "education",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Matrix - Band 8.0 Target",
    "prompt": "Chọn tính từ học thuật C1 diễn tả một tác giả hoặc học giả \"sáng tác rất nhiều công trình, có năng suất sáng tạo vượt bậc\":",
    "promptVi": "Chọn tính từ học thuật C1 diễn tả một tác giả hoặc học giả \"sáng tác rất nhiều công trình, có năng suất sáng tạo vượt bậc\":",
    "promptEn": "Select the C1 academic adjective describing an author, artist, or scholar who produces a vast quantity of work:",
    "context": "The university honored the _____ historian who authored over thirty definitive monographs on Tudor statecraft.",
    "contextVi": "The university honored the _____ historian who authored over thirty definitive monographs on Tudor statecraft.",
    "contextEn": "The university honored the _____ historian who authored over thirty definitive monographs on Tudor statecraft.",
    "options": [
      "prolific",
      "dormant",
      "mediocre",
      "frugal"
    ],
    "optionsVi": [
      "prolific (năng suất sáng tạo dồi dào, xuất bản nhiều)",
      "dormant (ngủ yên, bất hoạt)",
      "mediocre (tầm thường)",
      "frugal (tiết kiệm, thanh đạm)"
    ],
    "optionsEn": [
      "prolific",
      "dormant",
      "mediocre",
      "frugal"
    ],
    "correctIndex": 0,
    "correctAnswer": "prolific",
    "correctAnswerEn": "prolific",
    "explanation": "\"Prolific\" (/prəˈlɪfɪk/ - producing much fruit or foliage or many works) là từ học thuật cao cấp chỉ người sáng tác nhiều.",
    "explanationVi": "\"Prolific\" (/prəˈlɪfɪk/ - producing much fruit or foliage or many works) là từ học thuật cao cấp chỉ người sáng tác nhiều.",
    "explanationEn": "\"Prolific\" designates a scholar, creator, or thinker celebrated for producing an abundant volume of intellectual works."
  },
  {
    "id": "b3_nightmare_read_c20_p3_executive_01",
    "difficulty": "nightmare",
    "topic": "health",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 3 Executive Control)",
    "prompt": "Sự suy giảm khả năng ức chế (inhibitory control) dưới tác động của áp lực thời gian cao thể hiện qua hành vi nào?",
    "promptVi": "Sự suy giảm khả năng ức chế (inhibitory control) dưới tác động của áp lực thời gian cao thể hiện qua hành vi nào?",
    "promptEn": "How does degraded prefrontal inhibitory control under acute temporal scarcity manifest in behavioral game theory?",
    "context": "When experimental participants face decisions under severe time pressure and high cognitive load, neurological suppression of top-down inhibitory gating mechanisms in the dorsolateral prefrontal cortex triggers pre-potent impulsivity. Participants systematically abandon normative expected-utility maximization, exhibiting disproportionate susceptibility to framing effects, sunk-cost fallacies, and short-term hyperbolic discounting.",
    "contextVi": "Khi người tham gia thí nghiệm đối mặt với quyết định dưới áp lực thời gian ngặt nghèo và tải trọng nhận thức cao, sự ức chế thần kinh đối với các cơ chế kiểm soát từ trên xuống ở vỏ não trước trán kích hoạt tính bốc đồng tiềm ẩn. Họ từ bỏ việc tối đa hóa lợi ích kỳ vọng chuẩn mực, thể hiện sự nhạy cảm thái quá trước hiệu ứng đóng khung (framing effect), ngụy biện chi phí chìm (sunk-cost fallacy) và chiết khấu tức thời ngắn hạn.",
    "contextEn": "When experimental participants face decisions under severe time pressure and high cognitive load, neurological suppression of top-down inhibitory gating mechanisms in the dorsolateral prefrontal cortex triggers pre-potent impulsivity. Participants systematically abandon normative expected-utility maximization, exhibiting disproportionate susceptibility to framing effects, sunk-cost fallacies, and short-term hyperbolic discounting.",
    "options": [
      "Từ bỏ tính toán lợi ích tối ưu, dễ bị chi phối bởi hiệu ứng đóng khung và ngụy biện chi phí chìm (Systematically abandon expected-utility maximization)",
      "Phân tích xác suất thống kê nhanh và chính xác hơn bình thường",
      "Hoàn toàn miễn nhiễm trước mọi lời thao túng tâm lý",
      "Luôn chọn phương án có lợi ích xa nhất trong tương lai"
    ],
    "optionsVi": [
      "Từ bỏ tính toán lợi ích tối ưu, dễ bị chi phối bởi hiệu ứng đóng khung và ngụy biện chi phí chìm (Systematically abandon expected-utility maximization)",
      "Phân tích xác suất thống kê nhanh và chính xác hơn bình thường",
      "Hoàn toàn miễn nhiễm trước mọi lời thao túng tâm lý",
      "Luôn chọn phương án có lợi ích xa nhất trong tương lai"
    ],
    "optionsEn": [
      "Systematically abandoning expected-utility calculation and succumbing to framing biases and sunk-cost fallacies",
      "Accelerating mathematical statistical precision beyond normative baseline",
      "Exhibiting absolute psychological invulnerability to framing distortions",
      "Consistently prioritizing intertemporal future utility over immediate gains"
    ],
    "correctIndex": 0,
    "correctAnswer": "Từ bỏ tính toán lợi ích tối ưu, dễ bị chi phối bởi hiệu ứng đóng khung và ngụy biện chi phí chìm (Systematically abandon expected-utility maximization)",
    "correctAnswerEn": "Systematically abandoning expected-utility calculation and succumbing to framing biases and sunk-cost fallacies",
    "explanation": "Đoạn văn phân tích rằng khi mất khả năng ức chế, người ra quyết định bỏ qua tính toán lợi ích (\"abandon expected-utility maximization\") và rơi vào bẫy tâm lý (\"framing effects, sunk-cost fallacies\").",
    "explanationVi": "Đoạn văn phân tích rằng khi mất khả năng ức chế, người ra quyết định bỏ qua tính toán lợi ích (\"abandon expected-utility maximization\") và rơi vào bẫy tâm lý (\"framing effects, sunk-cost fallacies\").",
    "explanationEn": "The passage demonstrates that suppressed inhibitory control induces reflexive heuristic errors like framing and sunk-cost bias."
  },
  {
    "id": "b3_nightmare_c2_nuance_02",
    "difficulty": "nightmare",
    "topic": "science",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Nuance - Band 9.0 Distinctions",
    "prompt": "Chọn tính từ học thuật C2 diễn tả một luận điểm hoặc sự thật \"không thể chối cãi, không thể bác bỏ\":",
    "promptVi": "Chọn tính từ học thuật C2 diễn tả một luận điểm hoặc sự thật \"không thể chối cãi, không thể bác bỏ\":",
    "promptEn": "Select the Band 9.0 C2 academic adjective meaning impossible to deny or disprove:",
    "context": "The glaciological ice core samples provided _____ empirical proof of anthropogenically driven atmospheric greenhouse warming.",
    "contextVi": "The glaciological ice core samples provided _____ empirical proof of anthropogenically driven atmospheric greenhouse warming.",
    "contextEn": "The glaciological ice core samples provided _____ empirical proof of anthropogenically driven atmospheric greenhouse warming.",
    "options": [
      "irrefutable",
      "debatable",
      "speculative",
      "conjectural"
    ],
    "optionsVi": [
      "irrefutable (không thể chối cãi, vững như bàn thạch)",
      "debatable (còn gây tranh cãi)",
      "speculative (mang tính suy đoán viển vông)",
      "conjectural (chỉ là phỏng đoán)"
    ],
    "optionsEn": [
      "irrefutable",
      "debatable",
      "speculative",
      "conjectural"
    ],
    "correctIndex": 0,
    "correctAnswer": "irrefutable",
    "correctAnswerEn": "irrefutable",
    "explanation": "\"Irrefutable\" (/ˌɪrɪˈfjuːtəbl/ - impossible to deny or disprove) là tính từ đỉnh cao Band 9.0 để khẳng định bằng chứng khoa học đanh thép.",
    "explanationVi": "\"Irrefutable\" (/ˌɪrɪˈfjuːtəbl/ - impossible to deny or disprove) là tính từ đỉnh cao Band 9.0 để khẳng định bằng chứng khoa học đanh thép.",
    "explanationEn": "\"Irrefutable\" characterizes empirical observations or logical deductions that cannot be challenged or disproved."
  },
  {
    "id": "b3_easy_spell_17",
    "difficulty": "easy",
    "topic": "technology",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #84",
    "prompt": "Chọn phương án viết đúng cho động từ mang nghĩa \"thay thế, thế chỗ\":",
    "promptVi": "Chọn phương án viết đúng cho động từ mang nghĩa \"thay thế, thế chỗ\":",
    "promptEn": "Select the authentic Cambridge spelling for the verb meaning to take the place of a person or thing previously in authority or use:",
    "context": "Renewable solar grids will gradually _____ antiquated coal-fired generators.",
    "contextVi": "Renewable solar grids will gradually _____ antiquated coal-fired generators.",
    "contextEn": "Renewable solar grids will gradually _____ antiquated coal-fired generators.",
    "options": [
      "supersede",
      "supercede",
      "superseed",
      "supercead"
    ],
    "optionsVi": [
      "supersede (đúng: s-e-d-e)",
      "supercede (sai chữ c)",
      "superseed (sai chữ seed)",
      "supercead (sai vần)"
    ],
    "optionsEn": [
      "supersede",
      "supercede",
      "superseed",
      "supercead"
    ],
    "correctIndex": 0,
    "correctAnswer": "supersede",
    "correctAnswerEn": "supersede",
    "explanation": "Từ \"supersede\" bắt nguồn từ tiếng Latin supersedere, có đuôi \"-sede\" chứ không phải \"-cede\".",
    "explanationVi": "Từ \"supersede\" bắt nguồn từ tiếng Latin supersedere, có đuôi \"-sede\" chứ không phải \"-cede\".",
    "explanationEn": "\"Supersede\" stems from Latin supersedere and is spelled with \"-sede\", an infamous examiner distractor."
  },
  {
    "id": "b3_easy_spell_18",
    "difficulty": "easy",
    "topic": "culture",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #88",
    "prompt": "Chọn từ viết đúng chính tả cho danh từ \"vốn tiết mục biểu diễn, kho tàng kỹ năng\":",
    "promptVi": "Chọn từ viết đúng chính tả cho danh từ \"vốn tiết mục biểu diễn, kho tàng kỹ năng\":",
    "promptEn": "Select the authentic spelling for a stock of plays, dances, or pieces that a performer knows:",
    "context": "The classical pianist demonstrated an extraordinarily versatile _____.",
    "contextVi": "The classical pianist demonstrated an extraordinarily versatile _____.",
    "contextEn": "The classical pianist demonstrated an extraordinarily versatile _____.",
    "options": [
      "repertoire",
      "repertoir",
      "repatore",
      "repertwoir"
    ],
    "optionsVi": [
      "repertoire (đúng: r-e-p-e-r-t-o-i-r-e)",
      "repertoir (thiếu e cuối)",
      "repatore (sai âm tiết)",
      "repertwoir (sai chính tả ngữ âm)"
    ],
    "optionsEn": [
      "repertoire",
      "repertoir",
      "repatore",
      "repertwoir"
    ],
    "correctIndex": 0,
    "correctAnswer": "repertoire",
    "correctAnswerEn": "repertoire",
    "explanation": "\"Repertoire\" mượn từ tiếng Pháp, kết thúc bằng \"-toire\" (r-e-p-e-r-t-o-i-r-e).",
    "explanationVi": "\"Repertoire\" mượn từ tiếng Pháp, kết thúc bằng \"-toire\" (r-e-p-e-r-t-o-i-r-e).",
    "explanationEn": "\"Repertoire\" retains its French spelling ending in \"-toire\"."
  },
  {
    "id": "b3_easy_spell_19",
    "difficulty": "easy",
    "topic": "economy",
    "skillCategory": "spelling",
    "type": "spelling",
    "cambridgeSource": "IELTS Master Spelling Bank - Trap #90",
    "prompt": "Chọn phương án viết đúng chính tả cho danh từ \"quyền chủ quyền quốc gia\":",
    "promptVi": "Chọn phương án viết đúng chính tả cho danh từ \"quyền chủ quyền quốc gia\":",
    "promptEn": "Select the correct spelling for the noun meaning supreme power or sovereign authority:",
    "context": "The maritime treaty formally affirmed the island state's territorial _____.",
    "contextVi": "The maritime treaty formally affirmed the island state's territorial _____.",
    "contextEn": "The maritime treaty formally affirmed the island state's territorial _____.",
    "options": [
      "sovereignty",
      "sovereinty",
      "soverignty",
      "soverenty"
    ],
    "optionsVi": [
      "sovereignty (đúng: s-o-v-e-r-e-i-g-n-t-y)",
      "sovereinty (thiếu g)",
      "soverignty (thiếu e)",
      "soverenty (sai hoàn toàn cụm eign)"
    ],
    "optionsEn": [
      "sovereignty",
      "sovereinty",
      "soverignty",
      "soverenty"
    ],
    "correctIndex": 0,
    "correctAnswer": "sovereignty",
    "correctAnswerEn": "sovereignty",
    "explanation": "\"Sovereignty\" có cụm \"eign\" (s-o-v-e-r-E-I-G-N-t-y) giống như \"foreign\" hay \"reign\".",
    "explanationVi": "\"Sovereignty\" có cụm \"eign\" (s-o-v-e-r-E-I-G-N-t-y) giống như \"foreign\" hay \"reign\".",
    "explanationEn": "\"Sovereignty\" incorporates the silent \"-eign-\" cluster (s-o-v-e-r-e-i-g-n-t-y)."
  },
  {
    "id": "b3_easy_lis_c8_t1_p1_02",
    "difficulty": "easy",
    "topic": "culture",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 1 Listening Part 1",
    "prompt": "Khu cắm trại lễ hội có phụ thu thêm khoản phí nào sau đây không?",
    "promptVi": "Khu cắm trại lễ hội có phụ thu thêm khoản phí nào sau đây không?",
    "promptEn": "Does the music festival campsite impose any mandatory supplementary surcharge for shower facilities?",
    "context": "Caller: Are hot showers an extra charge?\nAgent: No, standard hot water showers are fully included with every camping wristband, though electrical hookups require an extra £10.",
    "contextVi": "Caller: Are hot showers an extra charge?\nAgent: No, standard hot water showers are fully included with every camping wristband, though electrical hookups require an extra £10.",
    "contextEn": "Caller: Are hot showers an extra charge?\nAgent: No, standard hot water showers are fully included with every camping wristband, though electrical hookups require an extra £10.",
    "options": [
      "Không, dịch vụ tắm nước nóng hoàn toàn miễn phí đi kèm vòng đeo tay (Hot showers are fully included)",
      "Có, phụ thu £10 mỗi lần tắm",
      "Chỉ miễn phí cho trẻ em dưới 5 tuổi",
      "Khu cắm trại không có hệ thống nước nóng"
    ],
    "optionsVi": [
      "Không, dịch vụ tắm nước nóng hoàn toàn miễn phí đi kèm vòng đeo tay (Hot showers are fully included)",
      "Có, phụ thu £10 mỗi lần tắm",
      "Chỉ miễn phí cho trẻ em dưới 5 tuổi",
      "Khu cắm trại không có hệ thống nước nóng"
    ],
    "optionsEn": [
      "No, standard hot showers are fully included with every camping wristband",
      "Yes, a mandatory £10 surcharge per shower",
      "Free exclusively for children under 5 years old",
      "The campground lacks hot water plumbing entirely"
    ],
    "correctIndex": 0,
    "correctAnswer": "Không, dịch vụ tắm nước nóng hoàn toàn miễn phí đi kèm vòng đeo tay (Hot showers are fully included)",
    "correctAnswerEn": "No, standard hot showers are fully included with every camping wristband",
    "explanation": "Đại lý khẳng định tắm nước nóng đã bao gồm trong giá vé (\"fully included\"), chỉ có đầu cắm điện mới thu thêm £10.",
    "explanationVi": "Đại lý khẳng định tắm nước nóng đã bao gồm trong giá vé (\"fully included\"), chỉ có đầu cắm điện mới thu thêm £10.",
    "explanationEn": "The booking agent confirms that hot showers are included; the £10 fee applies only to electrical hookups."
  },
  {
    "id": "b3_easy_lis_c8_t2_p2_01",
    "difficulty": "easy",
    "topic": "environment",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 2 Listening Part 2",
    "prompt": "Chuyến xe buýt nông trại khởi hành lúc mấy giờ từ cổng chính?",
    "promptVi": "Chuyến xe buýt nông trại khởi hành lúc mấy giờ từ cổng chính?",
    "promptEn": "At what time does the guided agricultural tractor tour depart from the main reception gate?",
    "context": "Guide: While the welcome leaflet lists 10:15 am, our morning engine checks mean the tractor tour departs promptly at 10:45 am.",
    "contextVi": "Guide: While the welcome leaflet lists 10:15 am, our morning engine checks mean the tractor tour departs promptly at 10:45 am.",
    "contextEn": "Guide: While the welcome leaflet lists 10:15 am, our morning engine checks mean the tractor tour departs promptly at 10:45 am.",
    "options": [
      "10:45 am",
      "10:15 am",
      "11:00 am",
      "10:00 am"
    ],
    "optionsVi": [
      "10:45 am (giờ khởi hành thực tế)",
      "10:15 am (giờ in trên tờ rơi cũ)",
      "11:00 am",
      "10:00 am"
    ],
    "optionsEn": [
      "10:45 am",
      "10:15 am",
      "11:00 am",
      "10:00 am"
    ],
    "correctIndex": 0,
    "correctAnswer": "10:45 am",
    "correctAnswerEn": "10:45 am",
    "explanation": "Bẫy giờ giấc kinh điển: 10:15 am là giờ in trên tờ rơi cũ, còn giờ khởi hành thực tế là 10:45 am.",
    "explanationVi": "Bẫy giờ giấc kinh điển: 10:15 am là giờ in trên tờ rơi cũ, còn giờ khởi hành thực tế là 10:45 am.",
    "explanationEn": "Classic timetable distractor: 10:15 am is printed on the brochure, but the actual departure time is 10:45 am."
  },
  {
    "id": "b3_easy_vocab_10",
    "difficulty": "easy",
    "topic": "environment",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 6.5",
    "prompt": "Chọn từ đồng nghĩa C1 thay thế cho \"reduce the impact of something bad\":",
    "promptVi": "Chọn từ đồng nghĩa C1 thay thế cho \"reduce the impact of something bad\":",
    "promptEn": "Select the C1 academic verb meaning to make something bad less severe, serious, or painful:",
    "context": "Reforestation along riverbanks can significantly _____ seasonal flood hazards.",
    "contextVi": "Reforestation along riverbanks can significantly _____ seasonal flood hazards.",
    "contextEn": "Reforestation along riverbanks can significantly _____ seasonal flood hazards.",
    "options": [
      "mitigate",
      "aggravate",
      "escalate",
      "trigger"
    ],
    "optionsVi": [
      "mitigate (giảm nhẹ tác hại, làm dịu)",
      "aggravate (làm nặng thêm - trái nghĩa)",
      "escalate (leo thang)",
      "trigger (châm ngòi, kích hoạt)"
    ],
    "optionsEn": [
      "mitigate",
      "aggravate",
      "escalate",
      "trigger"
    ],
    "correctIndex": 0,
    "correctAnswer": "mitigate",
    "correctAnswerEn": "mitigate",
    "explanation": "\"Mitigate\" mang nghĩa giảm nhẹ rủi ro hoặc hậu quả xấu (\"mitigate hazards / risks\").",
    "explanationVi": "\"Mitigate\" mang nghĩa giảm nhẹ rủi ro hoặc hậu quả xấu (\"mitigate hazards / risks\").",
    "explanationEn": "\"Mitigate\" is the canonical academic term for lessening the severity or impact of negative phenomena."
  },
  {
    "id": "b3_med_read_c20_p2_02",
    "difficulty": "medium",
    "topic": "science",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 2 Elms)",
    "prompt": "Đánh giá nhận định về tính kháng bệnh của loài cây du châu Á (Asian elm species):",
    "promptVi": "Đánh giá nhận định về tính kháng bệnh của loài cây du châu Á (Asian elm species):",
    "promptEn": "Evaluate the statement regarding Dutch Elm Disease resistance in Asian elm taxa:",
    "context": "Passage: Unlike their vulnerable European counterparts, Asian elm taxa such as Ulmus pumila co-evolved alongside Ophiostoma fungi for millennia, developing endogenous chemical defenses that prevent fungal hyphae from choking their sapwood.\n\nStatement: Asian elm species possess natural biological mechanisms that resist the Dutch Elm Disease pathogen.",
    "contextVi": "Đoạn văn: Không giống như các loài du châu Âu dễ bị tổn thương, các loài du châu Á như Ulmus pumila đã cùng tiến hóa với loài nấm Ophiostoma suốt hàng thiên niên kỷ, phát triển các cơ chế phòng vệ hóa học nội sinh ngăn không cho các sợi nấm làm tắc mạch gỗ.\n\nNhận định: Các loài du châu Á sở hữu cơ chế sinh học tự nhiên kháng lại mầm bệnh héo rũ cây du.",
    "contextEn": "Passage: Unlike their vulnerable European counterparts, Asian elm taxa such as Ulmus pumila co-evolved alongside Ophiostoma fungi for millennia, developing endogenous chemical defenses that prevent fungal hyphae from choking their sapwood.\n\nStatement: Asian elm species possess natural biological mechanisms that resist the Dutch Elm Disease pathogen.",
    "options": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "TRUE (Đúng với bài)",
      "FALSE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "TRUE",
      "FALSE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "TRUE",
    "correctAnswerEn": "TRUE",
    "explanation": "Bài đọc nêu rõ du châu Á phát triển cơ chế phòng vệ nội sinh (\"endogenous chemical defenses\"), xác nhận nhận định là TRUE.",
    "explanationVi": "Bài đọc nêu rõ du châu Á phát triển cơ chế phòng vệ nội sinh (\"endogenous chemical defenses\"), xác nhận nhận định là TRUE.",
    "explanationEn": "The passage explicitly verifies that Asian elms co-evolved \"endogenous chemical defenses\" against the pathogen, making this TRUE."
  },
  {
    "id": "b3_med_read_101_t3_p3_01",
    "difficulty": "medium",
    "topic": "science",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 3 (Passage 3 Glaciology)",
    "prompt": "Theo các nhà băng học Bắc Cực, hiện tượng \"băng sụt lở\" (ice shelf calving) được tăng tốc bởi yếu tố nào?",
    "promptVi": "Theo các nhà băng học Bắc Cực, hiện tượng \"băng sụt lở\" (ice shelf calving) được tăng tốc bởi yếu tố nào?",
    "promptEn": "Which oceanographic factor directly accelerates ice shelf calving in polar marine margins?",
    "context": "Glaciologists determined that while surface atmospheric warming melts top snowpacks, the primary driver of catastrophic ice shelf calving is sub-surface basal melting caused by deep intrusion of warming, saline circumpolar deep water eroding the marine ice shelves from underneath.",
    "contextVi": "Các nhà băng học kết luận rằng trong khi sự ấm lên của khí quyển làm tan lớp tuyết bề mặt, tác nhân hàng đầu đẩy nhanh sự sụp đổ thềm băng là hiện tượng tan chảy dưới đáy do các dòng nước mặn sâu ấm xâm nhập và bào mòn thềm băng từ bên dưới.",
    "contextEn": "Glaciologists determined that while surface atmospheric warming melts top snowpacks, the primary driver of catastrophic ice shelf calving is sub-surface basal melting caused by deep intrusion of warming, saline circumpolar deep water eroding the marine ice shelves from underneath.",
    "options": [
      "Hiện tượng tan chảy đáy thềm băng do các dòng nước mặn sâu ấm bào mòn từ bên dưới (Sub-surface basal melting)",
      "Tác động trực tiếp từ gió mùa đông bắc",
      "Sự xuất hiện của các tàu phá băng du lịch",
      "Địa chấn do động đất đáy biển"
    ],
    "optionsVi": [
      "Hiện tượng tan chảy đáy thềm băng do các dòng nước mặn sâu ấm bào mòn từ bên dưới (Sub-surface basal melting)",
      "Tác động trực tiếp từ gió mùa đông bắc",
      "Sự xuất hiện của các tàu phá băng du lịch",
      "Địa chấn do động đất đáy biển"
    ],
    "optionsEn": [
      "Sub-surface basal melting driven by warm saline circumpolar deep water intrusions",
      "Direct surface shear from Arctic winter gales",
      "Mechanical vibrations from commercial tourist icebreakers",
      "Submarine tectonic earthquake fault lines"
    ],
    "correctIndex": 0,
    "correctAnswer": "Hiện tượng tan chảy đáy thềm băng do các dòng nước mặn sâu ấm bào mòn từ bên dưới (Sub-surface basal melting)",
    "correctAnswerEn": "Sub-surface basal melting driven by warm saline circumpolar deep water intrusions",
    "explanation": "Bài viết khẳng định tác nhân chính (\"primary driver\") là sự tan chảy dưới đáy do dòng nước ấm xâm nhập (\"sub-surface basal melting\").",
    "explanationVi": "Bài viết khẳng định tác nhân chính (\"primary driver\") là sự tan chảy dưới đáy do dòng nước ấm xâm nhập (\"sub-surface basal melting\").",
    "explanationEn": "The text isolates \"sub-surface basal melting\" from warm marine intrusions as the primary catalyst of calving."
  },
  {
    "id": "b3_med_lis_c8_t2_p4_01",
    "difficulty": "medium",
    "topic": "health",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 2 Listening Part 4",
    "prompt": "Yếu tố nào được các bệnh nhân trong cuộc khảo sát y tế đánh giá là quan trọng nhất?",
    "promptVi": "Yếu tố nào được các bệnh nhân trong cuộc khảo sát y tế đánh giá là quan trọng nhất?",
    "promptEn": "Which dimension of general practice care was ranked highest in patient satisfaction surveys?",
    "context": "Researcher: We predicted clinic punctuality would rank first. Surprisingly, over 70% of respondents rated having their physician actively listen without rushing above clinic decor and waiting times.",
    "contextVi": "Researcher: We predicted clinic punctuality would rank first. Surprisingly, over 70% of respondents rated having their physician actively listen without rushing above clinic decor and waiting times.",
    "contextEn": "Researcher: We predicted clinic punctuality would rank first. Surprisingly, over 70% of respondents rated having their physician actively listen without rushing above clinic decor and waiting times.",
    "options": [
      "Bác sĩ chăm chú lắng nghe bệnh nhân mà không vội vã (Physician actively listening without rushing)",
      "Sự đúng giờ của lịch hẹn khám bệnh",
      "Nội thất sang trọng của phòng chờ bệnh viện",
      "Khả năng đặt lịch hẹn qua ứng dụng di động"
    ],
    "optionsVi": [
      "Bác sĩ chăm chú lắng nghe bệnh nhân mà không vội vã (Physician actively listening without rushing)",
      "Sự đúng giờ của lịch hẹn khám bệnh",
      "Nội thất sang trọng của phòng chờ bệnh viện",
      "Khả năng đặt lịch hẹn qua ứng dụng di động"
    ],
    "optionsEn": [
      "Physicians actively listening without rushing consultations",
      "Punctual appointment adherence by clinic staff",
      "High-end interior furnishings in waiting lounges",
      "Mobile application appointment scheduling features"
    ],
    "correctIndex": 0,
    "correctAnswer": "Bác sĩ chăm chú lắng nghe bệnh nhân mà không vội vã (Physician actively listening without rushing)",
    "correctAnswerEn": "Physicians actively listening without rushing consultations",
    "explanation": "Nhà nghiên cứu dự đoán sự đúng giờ, nhưng kết quả thực tế cho thấy hơn 70% bệnh nhân đánh giá cao nhất việc bác sĩ lắng nghe tận tâm (\"actively listen without rushing\").",
    "explanationVi": "Nhà nghiên cứu dự đoán sự đúng giờ, nhưng kết quả thực tế cho thấy hơn 70% bệnh nhân đánh giá cao nhất việc bác sĩ lắng nghe tận tâm (\"actively listen without rushing\").",
    "explanationEn": "Surpassing the predicted choice (punctuality), 70% of patients prioritized empathetic, unhurried listening."
  },
  {
    "id": "b3_med_lis_c8_t3_p3_01",
    "difficulty": "medium",
    "topic": "education",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 3 Listening Part 3",
    "prompt": "Điều kiện tiên quyết để đăng ký học phần Nghiên cứu Lịch sử Mỹ Latinh là gì?",
    "promptVi": "Điều kiện tiên quyết để đăng ký học phần Nghiên cứu Lịch sử Mỹ Latinh là gì?",
    "promptEn": "What is the mandatory academic prerequisite for enrolling in the Latin American Studies module?",
    "context": "Advisor: Although fluency in Spanish is recommended, the only strict prerequisite is having completed at least one introductory course in post-colonial history.",
    "contextVi": "Advisor: Although fluency in Spanish is recommended, the only strict prerequisite is having completed at least one introductory course in post-colonial history.",
    "contextEn": "Advisor: Although fluency in Spanish is recommended, the only strict prerequisite is having completed at least one introductory course in post-colonial history.",
    "options": [
      "Đã hoàn thành ít nhất một khóa nhập môn lịch sử hậu thuộc địa (Introductory post-colonial history)",
      "Thành thạo tiếng Tây Ban Nha trình độ C1",
      "Đã từng đi thực tế tại Nam Mỹ",
      "Đạt điểm GPA tuyệt đối 4.0"
    ],
    "optionsVi": [
      "Đã hoàn thành ít nhất một khóa nhập môn lịch sử hậu thuộc địa (Introductory post-colonial history)",
      "Thành thạo tiếng Tây Ban Nha trình độ C1",
      "Đã từng đi thực tế tại Nam Mỹ",
      "Đạt điểm GPA tuyệt đối 4.0"
    ],
    "optionsEn": [
      "Completion of at least one introductory course in post-colonial history",
      "C1 certified fluency in conversational Spanish",
      "Prior archaeological fieldwork experience in South America",
      "A cumulative 4.0 grade point average"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đã hoàn thành ít nhất một khóa nhập môn lịch sử hậu thuộc địa (Introductory post-colonial history)",
    "correctAnswerEn": "Completion of at least one introductory course in post-colonial history",
    "explanation": "Bẫy điều kiện: tiếng Tây Ban Nha chỉ là khuyến khích (\"recommended\"), điều kiện tiên quyết duy nhất bắt buộc (\"strict prerequisite\") là đã học lịch sử hậu thuộc địa.",
    "explanationVi": "Bẫy điều kiện: tiếng Tây Ban Nha chỉ là khuyến khích (\"recommended\"), điều kiện tiên quyết duy nhất bắt buộc (\"strict prerequisite\") là đã học lịch sử hậu thuộc địa.",
    "explanationEn": "Spanish proficiency is merely recommended; the sole formal prerequisite is a completed post-colonial history module."
  },
  {
    "id": "b3_med_read_101_t2_p3_02",
    "difficulty": "medium",
    "topic": "health",
    "skillCategory": "reading",
    "type": "tfng",
    "cambridgeSource": "101 Past Papers - Reading Test 2 (Passage 3 TV Addiction)",
    "prompt": "Đánh giá nhận định về phản ứng tâm lý khi đột ngột tắt màn hình tivi sau nhiều giờ xem liên tục:",
    "promptVi": "Đánh giá nhận định về phản ứng tâm lý khi đột ngột tắt màn hình tivi sau nhiều giờ xem liên tục:",
    "promptEn": "Evaluate the statement regarding affective states following the abrupt cessation of prolonged television viewing:",
    "context": "Passage: EEG monitoring demonstrates that while viewing induces a passive hypnotic relaxation, turning the television set off precipitates an immediate drop in mood and a subjective sensation of restlessness, driving viewers to turn it back on.\n\nStatement: Viewers typically report feeling energized and invigorated immediately after switching off the television.",
    "contextVi": "Đoạn văn: Theo dõi điện não đồ cho thấy trong khi xem tivi tạo ra trạng thái thư giãn thôi miên thụ động, việc tắt màn hình lại gây ra sự sụt giảm tâm trạng tức thì và cảm giác bồn chồn khó chịu, thôi thúc người xem bật lại.\n\nNhận định: Người xem thường cảm thấy tràn đầy năng lượng và phấn chấn ngay sau khi tắt tivi.",
    "contextEn": "Passage: EEG monitoring demonstrates that while viewing induces a passive hypnotic relaxation, turning the television set off precipitates an immediate drop in mood and a subjective sensation of restlessness, driving viewers to turn it back on.\n\nStatement: Viewers typically report feeling energized and invigorated immediately after switching off the television.",
    "options": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsVi": [
      "FALSE (Sai - bài nêu người xem rơi vào trạng thái tụt tâm trạng và bồn chồn \"drop in mood and restlessness\")",
      "TRUE",
      "NOT GIVEN"
    ],
    "optionsEn": [
      "FALSE",
      "TRUE",
      "NOT GIVEN"
    ],
    "correctIndex": 0,
    "correctAnswer": "FALSE",
    "correctAnswerEn": "FALSE",
    "explanation": "Bài đọc chỉ ra tắt tivi gây tụt tâm trạng và bồn chồn (\"immediate drop in mood and restlessness\"), trái ngược hoàn toàn với nhận định \"feeling energized and invigorated\".",
    "explanationVi": "Bài đọc chỉ ra tắt tivi gây tụt tâm trạng và bồn chồn (\"immediate drop in mood and restlessness\"), trái ngược hoàn toàn với nhận định \"feeling energized and invigorated\".",
    "explanationEn": "The text notes that switching off induces an immediate drop in mood, contradicting claims of feeling energized."
  },
  {
    "id": "b3_med_vocab_11",
    "difficulty": "medium",
    "topic": "education",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Cambridge Synonym Matrix - Band 7.0",
    "prompt": "Chọn động từ học thuật C1 mang nghĩa \"cung cấp bằng chứng chứng minh, làm sáng tỏ một tuyên bố\":",
    "promptVi": "Chọn động từ học thuật C1 mang nghĩa \"cung cấp bằng chứng chứng minh, làm sáng tỏ một tuyên bố\":",
    "promptEn": "Select the formal C1 academic verb meaning to provide evidence to support or prove the truth of a claim:",
    "context": "The laboratory results failed to _____ the initial theoretical allegations.",
    "contextVi": "The laboratory results failed to _____ the initial theoretical allegations.",
    "contextEn": "The laboratory results failed to _____ the initial theoretical allegations.",
    "options": [
      "substantiate",
      "contradict",
      "repudiate",
      "disregard"
    ],
    "optionsVi": [
      "substantiate (chứng minh bằng bằng chứng xác thực)",
      "contradict (mâu thuẫn với)",
      "repudiate (từ chối, bác bỏ)",
      "disregard (bỏ qua, xem nhẹ)"
    ],
    "optionsEn": [
      "substantiate",
      "contradict",
      "repudiate",
      "disregard"
    ],
    "correctIndex": 0,
    "correctAnswer": "substantiate",
    "correctAnswerEn": "substantiate",
    "explanation": "\"Substantiate\" (/səbˈstænʃieɪt/) là động từ học thuật chuẩn để diễn tả việc chứng minh luận điểm bằng dữ liệu thực nghiệm.",
    "explanationVi": "\"Substantiate\" (/səbˈstænʃieɪt/) là động từ học thuật chuẩn để diễn tả việc chứng minh luận điểm bằng dữ liệu thực nghiệm.",
    "explanationEn": "\"Substantiate\" denotes verifying claims with concrete empirical findings or historical corroboration."
  },
  {
    "id": "b3_hard_lis_c8_t3_p4_01",
    "difficulty": "hard",
    "topic": "economy",
    "skillCategory": "listening",
    "type": "listening_trap",
    "cambridgeSource": "Cambridge 8 Test 3 Listening Part 4",
    "prompt": "Tại sao các công ty thành công thường thất bại khi cố gắng sao chép công thức chiến thắng trong quá khứ?",
    "promptVi": "Tại sao các công ty thành công thường thất bại khi cố gắng sao chép công thức chiến thắng trong quá khứ?",
    "promptEn": "According to the business lecture, why do corporate incumbents fail when attempting to repeat past success?",
    "context": "Lecturer: Leaders fall prey to the competency trap. They codify historical operating procedures so rigidly that the organization develops cognitive blindness to shifts in consumer expectations and disruptive technological paradigms.",
    "contextVi": "Lecturer: Leaders fall prey to the competency trap. They codify historical operating procedures so rigidly that the organization develops cognitive blindness to shifts in consumer expectations and disruptive technological paradigms.",
    "contextEn": "Lecturer: Leaders fall prey to the competency trap. They codify historical operating procedures so rigidly that the organization develops cognitive blindness to shifts in consumer expectations and disruptive technological paradigms.",
    "options": [
      "Rơi vào bẫy năng lực cốt lõi cứng nhắc, dẫn đến mù quáng trước thay đổi thị trường (The competency trap)",
      "Thiếu nguồn vốn lưu động ngắn hạn",
      "Chi quá nhiều tiền thuê chuyên gia tư vấn chiến lược bên ngoài",
      "Nhân viên đình công đòi tăng lương liên tục"
    ],
    "optionsVi": [
      "Rơi vào bẫy năng lực cốt lõi cứng nhắc, dẫn đến mù quáng trước thay đổi thị trường (The competency trap)",
      "Thiếu nguồn vốn lưu động ngắn hạn",
      "Chi quá nhiều tiền thuê chuyên gia tư vấn chiến lược bên ngoài",
      "Nhân viên đình công đòi tăng lương liên tục"
    ],
    "optionsEn": [
      "Succumbing to the competency trap, fostering organizational blindness to paradigm shifts",
      "Severe chronic insolvency in liquid operational cash reserves",
      "Excessive budget allocation to third-party management consultants",
      "Protracted industrial strike action by labor unions"
    ],
    "correctIndex": 0,
    "correctAnswer": "Rơi vào bẫy năng lực cốt lõi cứng nhắc, dẫn đến mù quáng trước thay đổi thị trường (The competency trap)",
    "correctAnswerEn": "Succumbing to the competency trap, fostering organizational blindness to paradigm shifts",
    "explanation": "Giảng viên phân tích nguyên nhân là \"competency trap\" (bẫy năng lực) - khi doanh nghiệp quá cứng nhắc với quy trình cũ đến mức không nhận ra sự thay đổi của công nghệ.",
    "explanationVi": "Giảng viên phân tích nguyên nhân là \"competency trap\" (bẫy năng lực) - khi doanh nghiệp quá cứng nhắc với quy trình cũ đến mức không nhận ra sự thay đổi của công nghệ.",
    "explanationEn": "The lecturer highlights the \"competency trap\": over-codifying obsolete formulas induces blindness to technological shifts."
  },
  {
    "id": "b3_hard_grammar_subjunctive_01",
    "difficulty": "hard",
    "topic": "economy",
    "skillCategory": "grammar",
    "type": "hedging",
    "cambridgeSource": "Academic Grammar - Present Subjunctive Register",
    "prompt": "Chọn câu sử dụng thể giả định hiện tại (Present Subjunctive) chuẩn xác nhất cho bài luận kiến nghị chính sách:",
    "promptVi": "Chọn câu sử dụng thể giả định hiện tại (Present Subjunctive) chuẩn xác nhất cho bài luận kiến nghị chính sách:",
    "promptEn": "Select the sentence that accurately utilizes the formal present subjunctive mood in policy recommendations:",
    "context": "Identify the formal academic subjunctive construction:",
    "contextVi": "Xác định cấu trúc giả định thức học thuật cho đề xuất chính sách:",
    "contextEn": "Identify the formal academic subjunctive construction:",
    "options": [
      "It is imperative that the central regulatory authority maintain strict oversight of algorithmic trading platforms.",
      "It is imperative that the central regulatory authority maintains strict oversight of algorithmic trading platforms.",
      "It is imperative that the central regulatory authority maintained strict oversight of algorithmic trading platforms.",
      "It is imperative that the central regulatory authority will maintain strict oversight of algorithmic trading platforms."
    ],
    "optionsVi": [
      "It is imperative that... maintain... (Subjunctive chuẩn: S + V nguyên thể không to)",
      "It is imperative that... maintains... (Sai: chia -s theo ngôi thứ ba)",
      "It is imperative that... maintained... (Sai thì quá khứ)",
      "It is imperative that... will maintain... (Sai: không dùng will sau imperative that)"
    ],
    "optionsEn": [
      "It is imperative that the central regulatory authority maintain strict oversight of algorithmic trading platforms.",
      "It is imperative that the central regulatory authority maintains strict oversight of algorithmic trading platforms.",
      "It is imperative that the central regulatory authority maintained strict oversight of algorithmic trading platforms.",
      "It is imperative that the central regulatory authority will maintain strict oversight of algorithmic trading platforms."
    ],
    "correctIndex": 0,
    "correctAnswer": "It is imperative that the central regulatory authority maintain strict oversight of algorithmic trading platforms.",
    "correctAnswerEn": "It is imperative that the central regulatory authority maintain strict oversight of algorithmic trading platforms.",
    "explanation": "Thể giả định học thuật sau các tính từ cấp thiết (imperative, vital, essential): It is imperative that + S + V(nguyên thể không chia) -> \"authority maintain\".",
    "explanationVi": "Thể giả định học thuật sau các tính từ cấp thiết (imperative, vital, essential): It is imperative that + S + V(nguyên thể không chia) -> \"authority maintain\".",
    "explanationEn": "The subjunctive construction following mandative adjectives mandates base verb form without inflection: \"authority maintain\"."
  },
  {
    "id": "b3_hard_read_c17_p2_02",
    "difficulty": "hard",
    "topic": "urbanization",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 17 Academic - Reading Test 1 (Passage 2 Stadiums)",
    "prompt": "Mái che có thể thu vào (retractable roofs) của các sân vận động gặp phải nhược điểm môi trường nào?",
    "promptVi": "Mái che có thể thu vào (retractable roofs) của các sân vận động gặp phải nhược điểm môi trường nào?",
    "promptEn": "What ecological and engineering drawback is associated with mechanical retractable stadium roofs?",
    "context": "While motorized retractable canopies insulate mega-events from adverse precipitation, their massive structural tonnage demands immense steel reinforcement, creating huge upfront embodied carbon emissions during construction and requiring continuous electrical load during operation.",
    "contextVi": "Mặc dù mái che cơ học có thể đóng mở giúp bảo vệ các sự kiện lớn khỏi mưa bão, tải trọng thép khổng lồ của chúng đòi hỏi gia cố kết cấu lớn, tạo ra lượng khí thải carbon ẩn tàng (embodied carbon) khổng lồ trong quá trình thi công và tiêu hao điện năng liên tục khi vận hành.",
    "contextEn": "While motorized retractable canopies insulate mega-events from adverse precipitation, their massive structural tonnage demands immense steel reinforcement, creating huge upfront embodied carbon emissions during construction and requiring continuous electrical load during operation.",
    "options": [
      "Lượng khí thải carbon ẩn tàng khổng lồ từ kết cấu thép và tiêu thụ điện năng vận hành lớn (Massive embodied carbon and high operational power)",
      "Làm cản trở hoàn toàn sóng viễn thông 5G",
      "Gây ngập lụt các tuyến đường lân cận khi đóng mái",
      "Thu hút các loài chim săn mồi làm tổ trên mái"
    ],
    "optionsVi": [
      "Lượng khí thải carbon ẩn tàng khổng lồ từ kết cấu thép và tiêu thụ điện năng vận hành lớn (Massive embodied carbon and high operational power)",
      "Làm cản trở hoàn toàn sóng viễn thông 5G",
      "Gây ngập lụt các tuyến đường lân cận khi đóng mái",
      "Thu hút các loài chim săn mồi làm tổ trên mái"
    ],
    "optionsEn": [
      "Massive upfront embodied carbon from steel reinforcements and continuous operational energy load",
      "Complete blockage of municipal telecommunications frequencies",
      "Severe storm sewer flooding triggered exclusively by closing canopies",
      "Attracting predatory avians that compromise aviation flightpaths"
    ],
    "correctIndex": 0,
    "correctAnswer": "Lượng khí thải carbon ẩn tàng khổng lồ từ kết cấu thép và tiêu thụ điện năng vận hành lớn (Massive embodied carbon and high operational power)",
    "correctAnswerEn": "Massive upfront embodied carbon from steel reinforcements and continuous operational energy load",
    "explanation": "Bài đọc chỉ ra nhược điểm sinh thái là lượng \"embodied carbon emissions\" rất lớn từ thép gia cố và nhu cầu năng lượng vận hành cao.",
    "explanationVi": "Bài đọc chỉ ra nhược điểm sinh thái là lượng \"embodied carbon emissions\" rất lớn từ thép gia cố và nhu cầu năng lượng vận hành cao.",
    "explanationEn": "The passage highlights the hidden ecological cost: massive embodied carbon from steel fabrication and heavy energy draw."
  },
  {
    "id": "b3_hard_vocab_c1_12",
    "difficulty": "hard",
    "topic": "science",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Matrix - Band 8.0 Target",
    "prompt": "Chọn động từ học thuật C1 mang nghĩa \"xác nhận, củng cố thêm tính chân thực của phát hiện khoa học\":",
    "promptVi": "Chọn động từ học thuật C1 mang nghĩa \"xác nhận, củng cố thêm tính chân thực của phát hiện khoa học\":",
    "promptEn": "Select the C1 academic verb meaning to confirm or give support to a statement, theory, or finding:",
    "context": "Subsequent satellite radar observations served to _____ the glaciologists' basal melting model.",
    "contextVi": "Subsequent satellite radar observations served to _____ the glaciologists' basal melting model.",
    "contextEn": "Subsequent satellite radar observations served to _____ the glaciologists' basal melting model.",
    "options": [
      "corroborate",
      "invalidate",
      "obfuscate",
      "undermine"
    ],
    "optionsVi": [
      "corroborate (chứng thực, củng cố tính xác thực)",
      "invalidate (làm mất hiệu lực - trái nghĩa)",
      "obfuscate (làm tối nghĩa, che giấu)",
      "undermine (làm xói mòn, phá hoại)"
    ],
    "optionsEn": [
      "corroborate",
      "invalidate",
      "obfuscate",
      "undermine"
    ],
    "correctIndex": 0,
    "correctAnswer": "corroborate",
    "correctAnswerEn": "corroborate",
    "explanation": "\"Corroborate\" (/kəˈrɒbəreɪt/ - confirm or give support to) là từ vựng nâng cấp Band 8.0 chuẩn cho \"confirm / support with evidence\".",
    "explanationVi": "\"Corroborate\" (/kəˈrɒbəreɪt/ - confirm or give support to) là từ vựng nâng cấp Band 8.0 chuẩn cho \"confirm / support with evidence\".",
    "explanationEn": "\"Corroborate\" is the standard scholarly term for lending empirical support to confirm an existing thesis."
  },
  {
    "id": "b3_hard_read_c16_p1_03",
    "difficulty": "hard",
    "topic": "science",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 16 Academic - Reading Test 1 (Passage 1 Wolves vs Dogs)",
    "prompt": "Khi đối mặt với một câu đố giải quyết vấn đề không thể mở (unsolvable problem), chó nhà phản ứng khác chó sói như thế nào?",
    "promptVi": "Khi đối mặt với một câu đố giải quyết vấn đề không thể mở (unsolvable problem), chó nhà phản ứng khác chó sói như thế nào?",
    "promptEn": "When confronted with an unsolvable puzzle box containing food, how do domestic dogs behaviorally diverge from wolves?",
    "context": "When presented with a locked plastic container containing meat, wolves persist relentlessly with solitary biting, scratching, and gnawing until exhaustion. In stark contrast, domestic dogs attempt the task for only a few seconds before shifting their gaze upward to make pleading eye contact with human observers, effectively treating humans as social problem-solving partners.",
    "contextVi": "Khi đối diện với hộp nhựa khóa kín chứa thịt, chó sói kiên trì cắn, cào và gặm một mình cho đến khi kiệt sức. Hoàn toàn trái ngược, chó nhà chỉ tự thử vài giây trước khi ngước mắt nhìn lên tìm kiếm ánh mắt cầu cứu từ con người, xem con người là đối tác xã hội giúp giải quyết vấn đề.",
    "contextEn": "When presented with a locked plastic container containing meat, wolves persist relentlessly with solitary biting, scratching, and gnawing until exhaustion. In stark contrast, domestic dogs attempt the task for only a few seconds before shifting their gaze upward to make pleading eye contact with human observers, effectively treating humans as social problem-solving partners.",
    "options": [
      "Nhanh chóng ngước nhìn tìm kiếm sự trợ giúp từ ánh mắt con người thay vì cố gắng đơn độc (Shift gaze to make eye contact with humans)",
      "Tấn công con người để cướp chìa khóa mở hộp",
      "Bỏ cuộc ngay lập tức và ngủ thiếp đi",
      "Cố gắng đập vỡ hộp mạnh mẽ hơn chó sói"
    ],
    "optionsVi": [
      "Nhanh chóng ngước nhìn tìm kiếm sự trợ giúp từ ánh mắt con người thay vì cố gắng đơn độc (Shift gaze to make eye contact with humans)",
      "Tấn công con người để cướp chìa khóa mở hộp",
      "Bỏ cuộc ngay lập tức và ngủ thiếp đi",
      "Cố gắng đập vỡ hộp mạnh mẽ hơn chó sói"
    ],
    "optionsEn": [
      "Quickly shifting their gaze to recruit human assistance via eye contact rather than persevering in isolation",
      "Aggressively attacking human experimenters to seize the keys",
      "Immediately abandoning the arena and falling asleep",
      "Exerting far greater mechanical jaw crushing force than wolves"
    ],
    "correctIndex": 0,
    "correctAnswer": "Nhanh chóng ngước nhìn tìm kiếm sự trợ giúp từ ánh mắt con người thay vì cố gắng đơn độc (Shift gaze to make eye contact with humans)",
    "correctAnswerEn": "Quickly shifting their gaze to recruit human assistance via eye contact rather than persevering in isolation",
    "explanation": "Bài đọc mô tả hành vi tiến hóa độc đáo của chó nhà: chúng ngước nhìn con người để nhờ vả (\"shifting their gaze upward to make pleading eye contact with human observers\").",
    "explanationVi": "Bài đọc mô tả hành vi tiến hóa độc đáo của chó nhà: chúng ngước nhìn con người để nhờ vả (\"shifting their gaze upward to make pleading eye contact with human observers\").",
    "explanationEn": "The experiment highlights that domestic dogs solicit human intervention through mutual gaze when encountering obstacles."
  },
  {
    "id": "b3_hard_vis_flowchart_01",
    "difficulty": "hard",
    "topic": "technology",
    "skillCategory": "visual_data",
    "type": "visual_data",
    "cambridgeSource": "Writing Task 1 Flowchart System Architecture Bank",
    "prompt": "Trong hệ thống xử lý nước thải tuần hoàn khép kín, bước nào khử các ion muối khoáng hòa tan?",
    "promptVi": "Trong hệ thống xử lý nước thải tuần hoàn khép kín, bước nào khử các ion muối khoáng hòa tan?",
    "promptEn": "In the closed-loop desalination and water reclamation flowchart, which unit process strips dissolved mineral ions?",
    "context": "Sequence: Primary Screening (Coarse debris) -> Flocculation & Settling (Colloidal solids) -> Micro-filtration (Bacteria & microplastics) -> Reverse Osmosis Membranes (Dissolved salts & heavy metals) -> Ultraviolet Disinfection.",
    "contextVi": "Trình tự: Lọc thô sơ cấp -> Keo tụ & Lắng cặn -> Vi lọc màng -> Màng thẩm thấu ngược RO (Muối khoáng hòa tan & kim loại nặng) -> Khử trùng tia cực tím UV.",
    "contextEn": "Sequence: Primary Screening (Coarse debris) -> Flocculation & Settling (Colloidal solids) -> Micro-filtration (Bacteria & microplastics) -> Reverse Osmosis Membranes (Dissolved salts & heavy metals) -> Ultraviolet Disinfection.",
    "options": [
      "Màng thẩm thấu ngược RO (Reverse Osmosis Membranes)",
      "Khử trùng bằng tia cực tím UV",
      "Bể keo tụ và lắng cặn",
      "Lưới chắn rác sơ cấp"
    ],
    "optionsVi": [
      "Màng thẩm thấu ngược RO (Reverse Osmosis Membranes)",
      "Khử trùng bằng tia cực tím UV",
      "Bể keo tụ và lắng cặn",
      "Lưới chắn rác sơ cấp"
    ],
    "optionsEn": [
      "Reverse Osmosis Membranes",
      "Ultraviolet Disinfection",
      "Flocculation and settling tank",
      "Primary coarse bar screening"
    ],
    "correctIndex": 0,
    "correctAnswer": "Màng thẩm thấu ngược RO (Reverse Osmosis Membranes)",
    "correctAnswerEn": "Reverse Osmosis Membranes",
    "explanation": "Theo lưu đồ kỹ thuật, màng thẩm thấu ngược RO là công đoạn xử lý muối hòa tan và kim loại nặng (\"Dissolved salts & heavy metals\").",
    "explanationVi": "Theo lưu đồ kỹ thuật, màng thẩm thấu ngược RO là công đoạn xử lý muối hòa tan và kim loại nặng (\"Dissolved salts & heavy metals\").",
    "explanationEn": "The technical flowchart identifies Reverse Osmosis as the specific phase separating dissolved mineral ions."
  },
  {
    "id": "b3_nightmare_read_c18_p3_drag_01",
    "difficulty": "nightmare",
    "topic": "technology",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 18 Academic - Reading Test 1 (Passage 3 Space Drag)",
    "prompt": "Tại sao lực cản khí quyển (atmospheric drag) ở quỹ đạo trên 800 km không thể tự động dọn sạch rác vũ trụ trong thời gian ngắn?",
    "promptVi": "Tại sao lực cản khí quyển (atmospheric drag) ở quỹ đạo trên 800 km không thể tự động dọn sạch rác vũ trụ trong thời gian ngắn?",
    "promptEn": "Why is passive atmospheric drag incapable of naturally clearing orbital debris residing above 800 kilometers altitude within human lifetimes?",
    "context": "While atmospheric drag in very low orbits (below 400 km) naturally de-orbits derelict hardware within months, atmospheric gas density decreases exponentially with altitude. At altitudes exceeding 800 kilometers, the thermosphere is so exceedingly tenuous that orbital decay timescales stretch from centuries into millennia, effectively preserving unmitigated debris in perpetual orbital trajectories.",
    "contextVi": "Trong khi lực cản khí quyển ở quỹ đạo rất thấp (dưới 400 km) tự nhiên kéo hạ các thiết bị hỏng trong vài tháng, mật độ khí quyển giảm theo cấp số nhân theo độ cao. Ở độ cao trên 800 km, tầng nhiệt quyển mỏng manh đến mức thời gian phân rã quỹ đạo kéo dài từ hàng thế kỷ đến hàng thiên niên kỷ, bảo tồn các mảnh rác vĩnh cửu.",
    "contextEn": "While atmospheric drag in very low orbits (below 400 km) naturally de-orbits derelict hardware within months, atmospheric gas density decreases exponentially with altitude. At altitudes exceeding 800 kilometers, the thermosphere is so exceedingly tenuous that orbital decay timescales stretch from centuries into millennia, effectively preserving unmitigated debris in perpetual orbital trajectories.",
    "options": [
      "Mật độ khí quyển giảm theo cấp số nhân, khiến thời gian phân rã quỹ đạo kéo dài hàng thế kỷ đến thiên niên kỷ (Decay timescales stretch into millennia)",
      "Khí quyển tại độ cao 800 km đẩy các vật thể bay xa khỏi Trái Đất",
      "Mảnh rác vũ trụ có gắn động cơ đẩy phản lực tự kích hoạt",
      "Từ trường Trái Đất giữ chặt các hạt kim loại"
    ],
    "optionsVi": [
      "Mật độ khí quyển giảm theo cấp số nhân, khiến thời gian phân rã quỹ đạo kéo dài hàng thế kỷ đến thiên niên kỷ (Decay timescales stretch into millennia)",
      "Khí quyển tại độ cao 800 km đẩy các vật thể bay xa khỏi Trái Đất",
      "Mảnh rác vũ trụ có gắn động cơ đẩy phản lực tự kích hoạt",
      "Từ trường Trái Đất giữ chặt các hạt kim loại"
    ],
    "optionsEn": [
      "Atmospheric density decays exponentially, extending natural orbital decay timescales into centuries or millennia",
      "Upper thermospheric winds actively propel debris outward into interplanetary space",
      "Derelict fragments are fitted with autonomous station-keeping thrusters",
      "The geomagnetic field locks metallic alloys into permanent stationary orbits"
    ],
    "correctIndex": 0,
    "correctAnswer": "Mật độ khí quyển giảm theo cấp số nhân, khiến thời gian phân rã quỹ đạo kéo dài hàng thế kỷ đến thiên niên kỷ (Decay timescales stretch into millennia)",
    "correctAnswerEn": "Atmospheric density decays exponentially, extending natural orbital decay timescales into centuries or millennia",
    "explanation": "Bài đọc giải thích mật độ khí quyển giảm theo cấp số nhân nên trên 800 km, thời gian rơi tự nhiên kéo dài hàng thế kỷ đến thiên niên kỷ (\"stretch from centuries into millennia\").",
    "explanationVi": "Bài đọc giải thích mật độ khí quyển giảm theo cấp số nhân nên trên 800 km, thời gian rơi tự nhiên kéo dài hàng thế kỷ đến thiên niên kỷ (\"stretch from centuries into millennia\").",
    "explanationEn": "Exponential atmospheric density reduction means drag takes centuries or millennia above 800 km."
  },
  {
    "id": "b3_nightmare_c2_lexical_03",
    "difficulty": "nightmare",
    "topic": "education",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Nuance - Band 9.0 Distinctions",
    "prompt": "Chọn tính từ học thuật C2 diễn tả một đặc điểm \"bản sắc riêng biệt, mang tính cá biệt độc nhất\":",
    "promptVi": "Chọn tính từ học thuật C2 diễn tả một đặc điểm \"bản sắc riêng biệt, mang tính cá biệt độc nhất\":",
    "promptEn": "Select the Band 9.0 C2 academic adjective meaning distinctive, peculiar, or unique to an individual or system:",
    "context": "The philosopher developed a highly _____ ontological taxonomy that defied conventional scholastic classification.",
    "contextVi": "The philosopher developed a highly _____ ontological taxonomy that defied conventional scholastic classification.",
    "contextEn": "The philosopher developed a highly _____ ontological taxonomy that defied conventional scholastic classification.",
    "options": [
      "idiosyncratic",
      "conventional",
      "homogeneous",
      "derivative"
    ],
    "optionsVi": [
      "idiosyncratic (mang tính cá biệt, độc đáo riêng)",
      "conventional (thông thường, truyền thống - trái nghĩa)",
      "homogeneous (đồng nhất - trái nghĩa)",
      "derivative (vay mượn, thiếu sáng tạo - trái nghĩa)"
    ],
    "optionsEn": [
      "idiosyncratic",
      "conventional",
      "homogeneous",
      "derivative"
    ],
    "correctIndex": 0,
    "correctAnswer": "idiosyncratic",
    "correctAnswerEn": "idiosyncratic",
    "explanation": "\"Idiosyncratic\" (/ˌɪdiəsɪŋˈkrætɪk/ - relating to idiosyncrasy; peculiar or individual) là từ vựng C2 thượng thừa chỉ phong cách cá biệt độc đáo.",
    "explanationVi": "\"Idiosyncratic\" (/ˌɪdiəsɪŋˈkrætɪk/ - relating to idiosyncrasy; peculiar or individual) là từ vựng C2 thượng thừa chỉ phong cách cá biệt độc đáo.",
    "explanationEn": "\"Idiosyncratic\" designates traits, methodologies, or frameworks that are uniquely and distinctively characteristic."
  },
  {
    "id": "b3_nightmare_read_101_t2_csr_01",
    "difficulty": "nightmare",
    "topic": "economy",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "101 Past Papers - Reading Test 2 (Passage 2 CSR Governance)",
    "prompt": "Sự xung đột căn bản giữa lý thuyết cổ đông (Shareholder Primacy) và lý thuyết các bên liên quan (Stakeholder Theory) nằm ở đâu?",
    "promptVi": "Sự xung đột căn bản giữa lý thuyết cổ đông (Shareholder Primacy) và lý thuyết các bên liên quan (Stakeholder Theory) nằm ở đâu?",
    "promptEn": "What fundamental governance divergence separates Friedmanite Shareholder Primacy from Stakeholder Capitalism in corporate ethics?",
    "context": "Milton Friedman's orthodox shareholder doctrine posits that corporate directors possess an exclusive fiduciary duty to maximize financial returns for equity owners within the bounds of the law. In radical philosophical contrast, contemporary stakeholder theory contends that corporations operate under an implicit societal charter, obligating executive management to balance wealth creation with environmental stewardship, employee welfare, and local community impact even when such considerations dampen quarterly return on equity.",
    "contextVi": "Học thuyết cổ đông chính thống của Milton Friedman cho rằng ban giám đốc có nghĩa vụ ủy thác duy nhất là tối đa hóa lợi nhuận tài chính cho các chủ sở hữu vốn trong khuôn khổ pháp luật. Trái ngược lại, lý thuyết các bên liên quan hiện đại khẳng định doanh nghiệp hoạt động theo một khế ước xã hội ngầm, buộc nhà quản lý phải cân bằng việc tạo ra của cải với việc bảo vệ môi trường, phúc lợi nhân viên và tác động cộng đồng ngay cả khi điều này làm giảm lợi nhuận ngắn hạn trên vốn chủ sở hữu.",
    "contextEn": "Milton Friedman's orthodox shareholder doctrine posits that corporate directors possess an exclusive fiduciary duty to maximize financial returns for equity owners within the bounds of the law. In radical philosophical contrast, contemporary stakeholder theory contends that corporations operate under an implicit societal charter, obligating executive management to balance wealth creation with environmental stewardship, employee welfare, and local community impact even when such considerations dampen quarterly return on equity.",
    "options": [
      "Tối đa hóa độc tôn lợi nhuận cho cổ đông đối lập với nghĩa vụ xã hội cân bằng phúc lợi cộng đồng và môi trường (Exclusive fiduciary profit vs broad social stewardship)",
      "Cả hai lý thuyết đều coi tiền mặt là mục tiêu duy nhất",
      "Lý thuyết các bên liên quan cấm doanh nghiệp bán sản phẩm ra thị trường",
      "Lý thuyết cổ đông bắt buộc chia đều lợi nhuận cho toàn bộ người dân"
    ],
    "optionsVi": [
      "Tối đa hóa độc tôn lợi nhuận cho cổ đông đối lập với nghĩa vụ xã hội cân bằng phúc lợi cộng đồng và môi trường (Exclusive fiduciary profit vs broad social stewardship)",
      "Cả hai lý thuyết đều coi tiền mặt là mục tiêu duy nhất",
      "Lý thuyết các bên liên quan cấm doanh nghiệp bán sản phẩm ra thị trường",
      "Lý thuyết cổ đông bắt buộc chia đều lợi nhuận cho toàn bộ người dân"
    ],
    "optionsEn": [
      "Exclusive fiduciary profit maximization for equity owners versus balancing societal welfare and ecological stewardship",
      "Both doctrines postulate that liquidity reserves are the singular moral metric of enterprise",
      "Stakeholder theory prohibits corporations from commercial product monetization",
      "Shareholder doctrine legally compels equal dividend distribution to all national citizens"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tối đa hóa độc tôn lợi nhuận cho cổ đông đối lập với nghĩa vụ xã hội cân bằng phúc lợi cộng đồng và môi trường (Exclusive fiduciary profit vs broad social stewardship)",
    "correctAnswerEn": "Exclusive fiduciary profit maximization for equity owners versus balancing societal welfare and ecological stewardship",
    "explanation": "Bài đọc đối chiếu sự đối lập: học thuyết cổ đông đặt nặng nghĩa vụ tài chính (\"maximize financial returns for equity owners\"), trong khi lý thuyết stakeholder yêu cầu phụng sự xã hội (\"balance wealth creation with environmental stewardship and community impact\").",
    "explanationVi": "Bài đọc đối chiếu sự đối lập: học thuyết cổ đông đặt nặng nghĩa vụ tài chính (\"maximize financial returns for equity owners\"), trong khi lý thuyết stakeholder yêu cầu phụng sự xã hội (\"balance wealth creation with environmental stewardship and community impact\").",
    "explanationEn": "The core friction is fiduciary profit maximization versus societal stewardship balancing environmental and human concerns."
  },
  {
    "id": "b3_nightmare_c2_nuance_04",
    "difficulty": "nightmare",
    "topic": "science",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Nuance - Band 9.0 Distinctions",
    "prompt": "Chọn tính từ học thuật C2 diễn tả một kết quả hoặc hiện tượng \"hoàn toàn không thể đoán trước, hay thay đổi thất thường\":",
    "promptVi": "Chọn tính từ học thuật C2 diễn tả một kết quả hoặc hiện tượng \"hoàn toàn không thể đoán trước, hay thay đổi thất thường\":",
    "promptEn": "Select the Band 9.0 C2 academic adjective meaning liable to unpredictable, sudden, or erratic change:",
    "context": "The geopolitical tensions introduced highly _____ supply fluctuations into the global microchip semiconductor sector.",
    "contextVi": "The geopolitical tensions introduced highly _____ supply fluctuations into the global microchip semiconductor sector.",
    "contextEn": "The geopolitical tensions introduced highly _____ supply fluctuations into the global microchip semiconductor sector.",
    "options": [
      "mercurial",
      "steadfast",
      "monolithic",
      "quiescent"
    ],
    "optionsVi": [
      "mercurial (hay biến đổi bất thường, khó lường như thủy ngân)",
      "steadfast (kiên định, vững vàng - trái nghĩa)",
      "monolithic (nguyên khối, đồng nhất - trái nghĩa)",
      "quiescent (yên tĩnh, bất hoạt - trái nghĩa)"
    ],
    "optionsEn": [
      "mercurial",
      "steadfast",
      "monolithic",
      "quiescent"
    ],
    "correctIndex": 0,
    "correctAnswer": "mercurial",
    "correctAnswerEn": "mercurial",
    "explanation": "\"Mercurial\" (/mɜːˈkjʊəriəl/ - subject to sudden or unpredictable changes of mood or mind) là từ vựng C2 chỉ tính biến động thất thường.",
    "explanationVi": "\"Mercurial\" (/mɜːˈkjʊəriəl/ - subject to sudden or unpredictable changes of mood or mind) là từ vựng C2 chỉ tính biến động thất thường.",
    "explanationEn": "\"Mercurial\" is an elite C2 adjective for rapid, unpredictable fluctuations or volatility."
  },
  {
    "id": "b3_hard_read_c20_p1_sanctuary_01",
    "difficulty": "hard",
    "topic": "environment",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 20 Academic - Reading Test 1 (Passage 1 Sanctuaries)",
    "prompt": "Tại sao việc sơ tán loài vẹt Kākāpō sang các hòn đảo không có thú ăn thịt (offshore island sanctuaries) lại là quyết định sống còn?",
    "promptVi": "Tại sao việc sơ tán loài vẹt Kākāpō sang các hòn đảo không có thú ăn thịt (offshore island sanctuaries) lại là quyết định sống còn?",
    "promptEn": "Why was the emergency evacuation of surviving kākāpō to predator-free offshore islands deemed biologically indispensable?",
    "context": "Because the kākāpō evolved in an isolated archipelago devoid of terrestrial mammalian predators for millions of years, its instinctive defense was freezing motionless while relying on camouflage and emitting a strong musky scent. On the mainland, introduced feral cats and stoats detected this scent effortlessly, wiping out adults and nests alike. Only on completely predator-free islands could this evolutionary vulnerability be circumvented.",
    "contextVi": "Vì loài kākāpō tiến hóa trên một quần đảo biệt lập không có động vật có vú ăn thịt trên cạn trong hàng triệu năm, phản xạ tự vệ bản năng của chúng là đứng bất động nhờ ngụy trang và tỏa ra mùi xạ hương nồng. Trên đất liền, mèo hoang và chồn ec-min ngoại lai phát hiện mùi này dễ dàng, xóa sổ cả chim trưởng thành lẫn tổ. Chỉ trên các hòn đảo hoàn toàn không có thú săn mồi thì điểm yếu tiến hóa này mới được hóa giải.",
    "contextEn": "Because the kākāpō evolved in an isolated archipelago devoid of terrestrial mammalian predators for millions of years, its instinctive defense was freezing motionless while relying on camouflage and emitting a strong musky scent. On the mainland, introduced feral cats and stoats detected this scent effortlessly, wiping out adults and nests alike. Only on completely predator-free islands could this evolutionary vulnerability be circumvented.",
    "options": [
      "Loài vẹt phát ra mùi xạ hương và đứng bất động khi gặp nguy hiểm, khiến chúng trở thành mồi ngon cho mèo và chồn trên đất liền (Emits scent and freezes, making it helpless on mainland)",
      "Các hòn đảo ngoài khơi có khí hậu ấm áp hơn đất liền 10 độ C",
      "Trên đất liền chim không tìm thấy nước uống",
      "Chính phủ New Zealand muốn giấu loài chim này khỏi khách du lịch"
    ],
    "optionsVi": [
      "Loài vẹt phát ra mùi xạ hương và đứng bất động khi gặp nguy hiểm, khiến chúng trở thành mồi ngon cho mèo và chồn trên đất liền (Emits scent and freezes, making it helpless on mainland)",
      "Các hòn đảo ngoài khơi có khí hậu ấm áp hơn đất liền 10 độ C",
      "Trên đất liền chim không tìm thấy nước uống",
      "Chính phủ New Zealand muốn giấu loài chim này khỏi khách du lịch"
    ],
    "optionsEn": [
      "Its evolutionary habit of freezing motionless while emitting a heavy scent made it easy prey for introduced mammalian carnivores",
      "Offshore islands maintained ambient temperatures ten degrees higher than the mainland",
      "The mainland experienced total subterranean freshwater depletion",
      "The New Zealand wildlife agency sought to conceal the birds from ecotourists"
    ],
    "correctIndex": 0,
    "correctAnswer": "Loài vẹt phát ra mùi xạ hương và đứng bất động khi gặp nguy hiểm, khiến chúng trở thành mồi ngon cho mèo và chồn trên đất liền (Emits scent and freezes, making it helpless on mainland)",
    "correctAnswerEn": "Its evolutionary habit of freezing motionless while emitting a heavy scent made it easy prey for introduced mammalian carnivores",
    "explanation": "Bài đọc phân tích điểm yếu tiến hóa: chim đứng bất động và tỏa mùi xạ hương khiến mèo hoang săn bắt dễ dàng, do đó chỉ có đảo sạch thú ăn thịt mới cứu được chúng.",
    "explanationVi": "Bài đọc phân tích điểm yếu tiến hóa: chim đứng bất động và tỏa mùi xạ hương khiến mèo hoang săn bắt dễ dàng, do đó chỉ có đảo sạch thú ăn thịt mới cứu được chúng.",
    "explanationEn": "The passage highlights the parrot's maladaptive freeze-and-scent response to mammalian carnivores on the mainland."
  },
  {
    "id": "b3_hard_vocab_c1_13",
    "difficulty": "hard",
    "topic": "culture",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Matrix - Band 8.0 Target",
    "prompt": "Chọn tính từ học thuật C1 mang nghĩa \"chỉ tồn tại trong thời gian ngắn ngủi, mang tính tạm thời\":",
    "promptVi": "Chọn tính từ học thuật C1 mang nghĩa \"chỉ tồn tại trong thời gian ngắn ngủi, mang tính tạm thời\":",
    "promptEn": "Select the C1 academic adjective meaning lasting only for a short time; impermanent or transient:",
    "context": "The economic boom proved to be entirely _____, followed quickly by a protracted recession.",
    "contextVi": "The economic boom proved to be entirely _____, followed quickly by a protracted recession.",
    "contextEn": "The economic boom proved to be entirely _____, followed quickly by a protracted recession.",
    "options": [
      "transient",
      "perennial",
      "chronic",
      "inveterate"
    ],
    "optionsVi": [
      "transient (tạm thời, chóng qua)",
      "perennial (tồn tại lâu năm, trường tồn - trái nghĩa)",
      "chronic (mãn tính, kinh niên - trái nghĩa)",
      "inveterate (thâm căn cố đế - trái nghĩa)"
    ],
    "optionsEn": [
      "transient",
      "perennial",
      "chronic",
      "inveterate"
    ],
    "correctIndex": 0,
    "correctAnswer": "transient",
    "correctAnswerEn": "transient",
    "explanation": "\"Transient\" (/ˈtrænziənt/ - lasting only for a short time; impermanent) là từ nâng cấp Band 8.0 cho \"temporary / short-lived\".",
    "explanationVi": "\"Transient\" (/ˈtrænziənt/ - lasting only for a short time; impermanent) là từ nâng cấp Band 8.0 cho \"temporary / short-lived\".",
    "explanationEn": "\"Transient\" designates economic, sociological, or temporal phenomena that are fleeting and temporary."
  },
  {
    "id": "b3_nightmare_c2_nuance_05",
    "difficulty": "nightmare",
    "topic": "technology",
    "skillCategory": "vocab",
    "type": "synonym",
    "cambridgeSource": "Academic Lexical Nuance - Band 9.0 Distinctions",
    "prompt": "Chọn động từ học thuật C2 diễn tả hành động \"làm giảm bớt giá trị, xúc phạm hoặc làm lu mờ thành tựu\":",
    "promptVi": "Chọn động từ học thuật C2 diễn tả hành động \"làm giảm bớt giá trị, xúc phạm hoặc làm lu mờ thành tựu\":",
    "promptEn": "Select the Band 9.0 C2 academic verb meaning to diminish the worth or value of an achievement:",
    "context": "Subsequent experimental flaws should not _____ from the revolutionary conceptual breakthrough of the team.",
    "contextVi": "Subsequent experimental flaws should not _____ from the revolutionary conceptual breakthrough of the team.",
    "contextEn": "Subsequent experimental flaws should not _____ from the revolutionary conceptual breakthrough of the team.",
    "options": [
      "detract",
      "enhance",
      "complement",
      "elevate"
    ],
    "optionsVi": [
      "detract (detract from - làm giảm đi giá trị, lu mờ)",
      "enhance (nâng cao - trái nghĩa)",
      "complement (bổ sung - trái nghĩa)",
      "elevate (nâng tầm - trái nghĩa)"
    ],
    "optionsEn": [
      "detract",
      "enhance",
      "complement",
      "elevate"
    ],
    "correctIndex": 0,
    "correctAnswer": "detract",
    "correctAnswerEn": "detract",
    "explanation": "\"Detract from\" (/dɪˈtrækt frəm/) là cụm C2 chỉ việc làm lu mờ hoặc giảm bớt giá trị của một thành tựu.",
    "explanationVi": "\"Detract from\" (/dɪˈtrækt frəm/) là cụm C2 chỉ việc làm lu mờ hoặc giảm bớt giá trị của một thành tựu.",
    "explanationEn": "\"Detract from\" is the definitive C2 phrase for diminishing the recognized significance of an accomplishment."
  },
  {
    "id": "b3_nightmare_read_c17_p3_pepys_01",
    "difficulty": "nightmare",
    "topic": "culture",
    "skillCategory": "reading",
    "type": "reading_trap",
    "cambridgeSource": "Cambridge 17 Academic - Reading Test 1 (Passage 3 Pepys Dictation)",
    "prompt": "Nguồn tư liệu lịch sử nào được xem là bằng chứng trực tiếp và xác thực nhất về cuộc trốn chạy của Vua Charles II?",
    "promptVi": "Nguồn tư liệu lịch sử nào được xem là bằng chứng trực tiếp và xác thực nhất về cuộc trốn chạy của Vua Charles II?",
    "promptEn": "Which historical primary source is considered the most authoritative direct narrative of Charles II's royal escape?",
    "context": "While dozens of royalist pamphlets mythologized the escape after the 1660 Restoration, modern historians consider Samuel Pepys's verbatim shorthand manuscript the gold standard of primary evidence. In October 1680, King Charles II personally dictated his exhaustive, unvarnished memoirs directly to Pepys across multiple private sessions in Newmarket, recounting intimate tactical decisions and peasant disguises.",
    "contextVi": "Trong khi hàng chục cuốn truyền đơn của phe bảo hoàng đã thần thoại hóa cuộc trốn chạy sau cuộc Phục hưng năm 1660, các nhà sử học hiện đại coi bản thảo ghi nhanh tốc ký của Samuel Pepys là tiêu chuẩn vàng của bằng chứng sơ cấp. Vào tháng 10 năm 1680, đích thân Vua Charles II đã trực tiếp đọc toàn bộ hồi ký chân thực của mình cho Pepys ghi lại trong nhiều buổi riêng tư tại Newmarket.",
    "contextEn": "While dozens of royalist pamphlets mythologized the escape after the 1660 Restoration, modern historians consider Samuel Pepys's verbatim shorthand manuscript the gold standard of primary evidence. In October 1680, King Charles II personally dictated his exhaustive, unvarnished memoirs directly to Pepys across multiple private sessions in Newmarket, recounting intimate tactical decisions and peasant disguises.",
    "options": [
      "Bản tốc ký do chính Vua Charles II trực tiếp đọc cho Samuel Pepys ghi lại năm 1680 (Verbatim dictation by King Charles II to Samuel Pepys)",
      "Các truyền đơn do quân đội Oliver Cromwell in sau chiến tranh",
      "Một bài thơ ballad dân gian truyền miệng của người chăn cừu",
      "Các bức thư ngoại giao do triều đình Pháp gửi sang London"
    ],
    "optionsVi": [
      "Bản tốc ký do chính Vua Charles II trực tiếp đọc cho Samuel Pepys ghi lại năm 1680 (Verbatim dictation by King Charles II to Samuel Pepys)",
      "Các truyền đơn do quân đội Oliver Cromwell in sau chiến tranh",
      "Một bài thơ ballad dân gian truyền miệng của người chăn cừu",
      "Các bức thư ngoại giao do triều đình Pháp gửi sang London"
    ],
    "optionsEn": [
      "Verbatim shorthand manuscript dictated directly by King Charles II to Samuel Pepys in 1680",
      "Propaganda broadsides published by Parliamentary forces following the battle",
      "An oral folk ballad collected from Shropshire shepherd folklore",
      "Diplomatic correspondence dispatched from the French Court of Versailles"
    ],
    "correctIndex": 0,
    "correctAnswer": "Bản tốc ký do chính Vua Charles II trực tiếp đọc cho Samuel Pepys ghi lại năm 1680 (Verbatim dictation by King Charles II to Samuel Pepys)",
    "correctAnswerEn": "Verbatim shorthand manuscript dictated directly by King Charles II to Samuel Pepys in 1680",
    "explanation": "Đoạn văn nêu rõ tư liệu gốc xác thực nhất là bản tốc ký do chính nhà vua đọc cho Samuel Pepys (\"verbatim shorthand manuscript dictated directly by King Charles II to Pepys in 1680\").",
    "explanationVi": "Đoạn văn nêu rõ tư liệu gốc xác thực nhất là bản tốc ký do chính nhà vua đọc cho Samuel Pepys (\"verbatim shorthand manuscript dictated directly by King Charles II to Pepys in 1680\").",
    "explanationEn": "The passage highlights Pepys's 1680 direct royal shorthand dictation as the gold standard of primary historical evidence."
  }
];
