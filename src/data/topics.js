export const IELTS_TOPICS = [
  { id: 'tech', name: 'Technology & AI', vi: 'Công nghệ & Trí tuệ nhân tạo (Automation, Generative AI, Privacy)' },
  { id: 'edu', name: 'Education & Learning', vi: 'Giáo dục & Học tập (Curriculum, Tuition, Online Learning, AI in Schools)' },
  { id: 'env', name: 'Environment & Climate', vi: 'Môi trường & Biến đổi khí hậu (Renewable Energy, Carbon Footprint, Waste)' },
  { id: 'health', name: 'Health & Well-being', vi: 'Sức khỏe & Y tế (Public Healthcare, Sedentary Lifestyles, Mental Health)' },
  { id: 'work', name: 'Work & Employment', vi: 'Công việc & Xu hướng lao động (Remote Work, 4-day Week, Automation, Gig Economy)' },
  { id: 'gov', name: 'Government Spending & Public Policy', vi: 'Ngân sách nhà nước & Chính sách (Public Services vs Art/Sports, Welfare)' },
  { id: 'tourism', name: 'Tourism & Travel', vi: 'Du lịch & Di chuyển quốc tế (Overtourism, Ecotourism, Aviation Tax, Local Heritage)' },
  { id: 'culture', name: 'Culture & Globalisation', vi: 'Văn hóa & Toàn cầu hóa (Cultural Identity, Loss of Native Languages, Uniformity)' },
  { id: 'family', name: 'Family & Children', vi: 'Gia đình & Trẻ em (Working Parents, Generational Gap, Screen Time, Parenting)' },
  { id: 'housing', name: 'Urbanization & Housing', vi: 'Đô thị hóa & Khủng hoảng nhà ở (Affordable Housing, Mega-cities, Infrastructure)' },
  { id: 'art', name: 'Art, Music & Sports', vi: 'Nghệ thuật & Thể thao (Funding for Arts, Professional Athletes, National Pride)' },
  { id: 'media', name: 'Media & Social Networks', vi: 'Truyền thông & Mạng xã hội (Fake News, Targeted Advertising, Influencers)' },
  { id: 'crime', name: 'Crime, Justice & Law', vi: 'Tội phạm & Pháp luật (Rehabilitation, Capital Punishment, Youth Delinquency, Surveillance)' },
  { id: 'consumerism', name: 'Consumerism & Economy', vi: 'Chủ nghĩa tiêu dùng & Kinh tế (Throwaway Culture, Materialism, Fast Fashion)' },
  { id: 'transport', name: 'Transport & Infrastructure', vi: 'Giao thông & Hạ tầng (Electric Vehicles, Public Transit, Congestion Charges)' },
  { id: 'society', name: 'Society & Demographics', vi: 'Xã hội & Nhân khẩu học (Ageing Population, Wealth Disparity, Gender Equality)' },
];

export const TASK2_TYPES = [
  { id: 'opinion', label: 'Agree or Disagree', vi: 'Đồng ý hay Không đồng ý' },
  { id: 'discussion', label: 'Discuss Both Views & Give Opinion', vi: 'Bàn luận 2 quan điểm & nêu ý kiến' },
  { id: 'advantages', label: 'Advantages vs Disadvantages', vi: 'Ưu điểm & Nhược điểm' },
  { id: 'problems', label: 'Causes & Solutions / Problems & Solutions', vi: 'Nguyên nhân & Giải pháp' },
  { id: 'twopart', label: 'Two-part Direct Question', vi: 'Câu hỏi trực tiếp 2 phần' },
];

export const TIME_FRAME_TYPES = [
  { 
    id: 'any', 
    label: 'Tự động (AI Quyết định)', 
    desc: 'Để AI tự chọn khung thời gian phù hợp với dạng biểu đồ' 
  },
  { 
    id: 'dynamic', 
    label: 'Dynamic (Có thay đổi qua thời gian)', 
    desc: 'Từ 2 năm/mốc thời gian trở lên, tập trung miêu tả xu hướng (tăng, giảm, dao động) & tốc độ biến đổi' 
  },
  { 
    id: 'static', 
    label: 'Static (Cố định 1 mốc thời gian)', 
    desc: 'Chỉ 1 năm duy nhất (hoặc không mốc thời gian), tập trung so sánh hơn/nhất & cơ cấu tỷ trọng tuyệt đối' 
  }
];

export const TASK1_TYPES = [
  { id: 'line', label: 'Line Graph (Đường)', icon: 'Activity', desc: 'Biểu đồ đường xu hướng (luôn là Dynamic)', defaultTimeFrame: 'dynamic' },
  { id: 'bar', label: 'Bar Chart (Cột)', icon: 'BarChart3', desc: 'Biểu đồ cột (có thể Dynamic hoặc Static)', defaultTimeFrame: 'dynamic' },
  { id: 'pie', label: 'Pie Chart (Tròn)', icon: 'PieChart', desc: 'Biểu đồ tròn (Static 1 năm hoặc Dynamic 2-3 năm)', defaultTimeFrame: 'dynamic' },
  { id: 'table', label: 'Table (Bảng số liệu)', icon: 'Table', desc: 'Bảng thống kê (Dynamic nhiều năm hoặc Static 1 năm)', defaultTimeFrame: 'dynamic' },
  { id: 'mixed', label: 'Mixed / Combo (Hỗn hợp)', icon: 'Layers', desc: 'Kết hợp 2 biểu đồ (Pie + Bar, Table + Line)', defaultTimeFrame: 'dynamic' },
  { id: 'process', label: 'Process (Quy trình)', icon: 'GitMerge', desc: 'Sơ đồ các giai đoạn sản xuất / tự nhiên', defaultTimeFrame: 'process' },
  { id: 'map', label: 'Map (Bản đồ biến đổi)', icon: 'Compass', desc: 'Quy hoạch cải tạo trước & sau (Dynamic 2 mốc thời gian)', defaultTimeFrame: 'dynamic' },
];

export const BAND_CRITERIA_INFO = {
  tr: {
    name: 'Task Achievement / Task Response',
    vi: 'Khả năng hoàn thành yêu cầu đề bài',
    desc: 'Đánh giá mức độ trả lời đầy đủ tất cả các phần của đề bài, có quan điểm rõ ràng, lập luận sâu sắc và bao quát các số liệu nổi bật (Task 1).'
  },
  cc: {
    name: 'Coherence & Cohesion',
    vi: 'Tính mạch lạc và liên kết',
    desc: 'Đánh giá cách tổ chức ý tưởng, phân chia đoạn văn hợp lý, sử dụng các từ nối (linking words) tự nhiên, không bị gượng gạo hay lạm dụng.'
  },
  lr: {
    name: 'Lexical Resource',
    vi: 'Vốn từ vựng',
    desc: 'Đánh giá độ phong phú và chính xác của từ vựng học thuật, collocations, khả năng paraphrase linh hoạt và hạn chế tối đa lỗi chính tả.'
  },
  gra: {
    name: 'Grammatical Range & Accuracy',
    vi: 'Độ đa dạng và chính xác của ngữ pháp',
    desc: 'Đánh giá việc kết hợp linh hoạt giữa câu đơn, câu ghép, câu phức, mệnh đề quan hệ, đảo ngữ và tỷ lệ câu hoàn toàn không mắc lỗi.'
  }
};
