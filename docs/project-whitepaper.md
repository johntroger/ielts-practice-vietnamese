# 🏛️ Cách Vận Hành Hệ Thống & Hồ Sơ Toàn Cảnh Dự Án

> **Phiên bản**: `v3.5 (2026 Living Edition)` | **Cập nhật gần nhất**: `2026-11-01`  
> **Quy mô hệ thống**: **45+ tính năng chuyên sâu** | **Kiến trúc**: `Local-First (90%) + Cloud & AI Examiner (10%)`

[← Quay lại Trang Chủ Cẩm Nang](README.md) • [Xem Ma Trận 45+ Tính Năng ↗](features/README.md)

---

## 1. Định Nghĩa Sản Phẩm Trong 1 Câu (Elevator Pitch)

> 💡 **Tuyên ngôn giá trị cốt lõi (Core Value Proposition):**  
> IELTS Studio là tổ hợp "Phòng thi máy tính quốc tế CDI + Phòng luyện 4 kỹ năng + Huấn luyện viên cá nhân 30 phút + Đấu trường từ vựng Atlas Arena" hoạt động trực tiếp trên trình duyệt — kết hợp giữa Động cơ chấm máy thuật toán siêu tốc (0.02 mili-giây) và Giám khảo Trí tuệ nhân tạo (AI Examiner) chuẩn 4 tiêu chí Cambridge.

### 📊 Bảng Đối Sánh Trực Diện Với Các Mô Hình Hiện Có

| Tiêu chí Đối sánh | Trung tâm IELTS Truyền thống | Web Luyện đề Thế hệ cũ | IELTS Studio Platform (Dự án này) |
| :--- | :--- | :--- | :--- |
| **Chi phí cho người học** | Rất cao (15 – 60 triệu VNĐ / khóa) | Thu phí theo lượt chấm hoặc chỉ có trắc nghiệm tĩnh | **Hoàn toàn tiếp cận (Chấm máy 0.02ms không giới hạn + Đầy đủ công cụ)** |
| **Tốc độ chấm Writing & Speaking** | Chờ giáo viên chấm từ 2 – 7 ngày | Chờ gọi API 15 – 40 giây, dễ nghẽn mạng | **Chấm Máy 0.02 mili-giây tức thì + Chấm AI chuyên sâu 4 tiêu chí** |
| **Mô phỏng phòng thi máy tính (CDI)** | Học trên giấy và bảng truyền thống | Giao diện trang web đọc báo thông thường | **Chuẩn 1:1 phòng thi máy IDP/BC (Chia đôi màn hình, Highlight, Contrast)** |
| **Giải thích đáp án Reading & Listening** | Giáo viên chữa miệng trên lớp, dễ quên | Chỉ báo Đúng/Sai hoặc hiện giải thích sơ sài | **Bộ giải mã 6 loại Bẫy khảo thí (Distractor Trap Decoder) & dẫn chứng** |
| **Cơ chế tạo động lực & Giữ chân** | Phụ thuộc hoàn toàn vào ý chí cá nhân | Rất thấp (Làm 1–2 đề rồi bỏ vì ngợp) | **Đấu trường Atlas Arena 100 cấp độ, Tháp Babel, Đấu Ma, Giải đấu & Streak** |
| **Hiệu quả chi phí vận hành (Unit Cost)** | Tốn chi phí mặt bằng & lương giáo viên lớn | Tốn phí API AI & Server trên mọi thao tác | **Tiết kiệm 85–90% chi phí Server/API nhờ xử lý Local-First 90% tại máy khách** |

---

## 2. Cách Vận Hành Của Website – Hành Trình Người Dùng 5 Bước Khép Kín

Toàn bộ nền tảng vận hành theo một **Vòng lặp Sư phạm Khép kín (Closed-Loop Pedagogical Engine)** gồm 5 bước liên hoàn, giúp bất kỳ người học nào từ lúc mới truy cập đến khi đi thi thật đều được dẫn dắt tự động:

### Bước 01: Chẩn Đoán Năng Lực & Định Vị Lộ Trình (`Bước Khởi Đầu`)
- **👤 Thao tác của Người dùng**: Người mất gốc bấm vào "🌱 Người Mới" để vào lộ trình 4 bước nhẹ nhàng (chơi game 90s nạp từ, giải mã thuật ngữ IELTS dễ hiểu, tập viết câu đơn 3 phút). Người đã có nền tảng làm bài Kiểm tra Chẩn đoán Đầu vào 10 phút.
- **⚙️ Xử lý tự động bên dưới của Hệ thống**: Bộ máy Diagnostic Placement phân tích ngữ pháp, vốn từ và đọc hiểu để xác định Band điểm hiện tại, tự động lập Lộ trình 30 ngày cá nhân hóa theo Target Band (5.0 đến 8.0+).
- **🎯 Giá trị thực tế nhận được**: Xóa bỏ hoàn toàn cảm giác quá tải hay sợ hãi ngày đầu tiên. Biết chính xác hôm nay cần bắt đầu từ đâu.

### Bước 02: Huấn Luyện Viên Nước Rút 30 Phút Hàng Ngày (`Thói Quen Mỗi Ngày`)
- **👤 Thao tác của Người dùng**: Mở "Huấn Luyện Viên 30P (Adaptive Sprint Coach)" hoặc bấm vào "Thẻ Gợi Ý Thông Minh Hàng Ngày" ngay đầu màn hình làm việc.
- **⚙️ Xử lý tự động bên dưới của Hệ thống**: Tự động quét Sổ tay lỗi sai và bài làm gần nhất để chia 30 phút thành 3 chặng tối ưu não bộ: Chặng 1 (7p Xóa bẫy ngữ pháp) ➔ Chặng 2 (15p Thực chiến Speaking/Writing) ➔ Chặng 3 (8p Nạp từ vựng C1/C2).
- **🎯 Giá trị thực tế nhận được**: Không còn bối rối "hôm nay học gì?". Biến 30 phút rảnh mỗi ngày thành bước tiến Band điểm thực chất kèm chuỗi ngày học Streak.

### Bước 03: Thực Chiến 4 Phòng Luyện Chuẩn CDI & Đấu Trường Arena (`4 Kỹ Năng & Game`)
- **👤 Thao tác của Người dùng**: Luyện tập Nghe – Nói – Đọc – Viết trên giao diện mô phỏng 1:1 phòng thi máy tính của IDP/British Council, hoặc vào Đấu trường phản xạ 90 giây Atlas Arena.
- **⚙️ Xử lý tự động bên dưới của Hệ thống**: Chạy thời gian thực Bản đồ nhiệt cấu trúc câu GRA, kiểm định đoạn văn PEEL, nâng cấp từ vựng C1/C2 1-chạm, sóng âm 60 FPS bắt từ đệm ngập ngừng (uh, um) và chia đôi màn hình tô sáng bài đọc.
- **🎯 Giá trị thực tế nhận được**: Quen tay 100% với thao tác phòng thi máy tính thực tế, không còn sốc tâm lý hay cháy giờ khi đi thi thật.

### Bước 04: Chấm Điểm Kép (0.02ms + AI) & Giải Mã Bẫy Khảo Thí (`0.02ms + AI`)
- **👤 Thao tác của Người dùng**: Bấm "Nộp Bài" và tùy chọn giữa ⚡ Chấm Máy Thuật Toán (0.02ms tức thì) hoặc 🤖 Chấm AI Giám Khảo Chuyên Sâu.
- **⚙️ Xử lý tự động bên dưới của Hệ thống**: Chấm chi tiết 4 tiêu chí Cambridge kèm biểu đồ Radar, viết lại bài mẫu nâng Band 8.0+, và kích hoạt Bộ Giải Mã Bẫy (Distractor Trap Decoder) chỉ rõ tâm lý bẫy ở từng câu Reading/Listening làm sai.
- **🎯 Giá trị thực tế nhận được**: Biết điểm và lỗi sai ngay lập tức mà không phải chờ giáo viên chấm cả tuần. Hiểu tận gốc vì sao mình bị lừa chọn đáp án nhiễu.

### Bước 05: Đơn Thuốc Sửa Lỗi SRS & Thi Thử Xuất Phiếu Điểm TRF (`Về Đích`)
- **👤 Thao tác của Người dùng**: Làm "Đơn Thuốc Sửa Lỗi 3 Phút" vào ngày hôm sau và tham gia phòng thi liên hoàn Marathon 3 Kỹ Năng.
- **⚙️ Xử lý tự động bên dưới của Hệ thống**: Tự động gom mọi lỗi sai thực tế vào Mistake Vault để tạo câu đố lặp lại ngắt quãng (SRS) cho đến khi học viên hết hẳn lỗi; xuất Phiếu điểm TRF PDF có mã QR và dự báo chính xác ngày đạt Band mục tiêu.
- **🎯 Giá trị thực tế nhận được**: Khắc phục triệt để tật lặp lại lỗi cũ và nắm chắc thời điểm vàng để đăng ký thi thật với tỷ lệ đạt mục tiêu cao nhất.

---

## 3. Kiến Trúc Kỹ Thuật Lai (Local-First 90% + Cloud & AI 10%)

Hệ thống giải quyết bài toán chi phí vận hành máy chủ và tốc độ phản hồi bằng cách phân bổ tải thông minh giữa thiết bị người học và đám mây:

### 🛡️ Kiến Trúc Local-First Tại Trình Duyệt (Client Edge & IndexedDB)
> **TẦNG 1 • XỬ LÝ 90% TÁC VỤ NGAY TRÊN THIẾT BỊ NGƯỜI DÙNG** — *Phản hồi 0 độ trễ, không bao giờ mất bài làm khi rớt mạng, chi phí máy chủ = 0đ*

- ⚡ Động cơ Chấm Máy Thuật Toán 0.02ms: Phân tích mật độ từ vựng CEFR (B1–C2), tỷ lệ câu phức GRA, độ đa dạng từ nối, tốc độ nói WPM và từ đệm ngay trên máy học viên.
- 💾 Lưu Trữ Cục Bộ 2 Tầng (IndexedDB + LocalStorage): Tự động lưu nháp bài viết từng mili-giây và lưu bản thu âm Speaking. Dù rớt mạng giữa bài thi 3 tiếng, bài làm vẫn an toàn 100%.
- 🎙️ Sóng Âm 60 FPS & Song Ngữ Tuyệt Đối: Xử lý âm thanh trực tiếp trên trình duyệt và chuyển đổi tức thì giữa 100% Tiếng Việt và 100% Tiếng Anh chuẩn khảo thí quốc tế.

### 🛡️ Tầng Đám Mây & Giám Khảo AI (Supabase + Cloudflare + LLM)
> **TẦNG 2 • 10% TÁC VỤ TRÍ TUỆ NHÂN TẠO & ĐỒNG BỘ ĐÁM MÂY** — *Chấm sâu ngữ nghĩa học thuật, bảng xếp hạng thời gian thực và sao lưu đa thiết bị*

- 🤖 Giám Khảo AI Chuyên Sâu 4 Tiêu Chí: Chỉ kích hoạt khi người học yêu cầu chấm sâu mạch lập luận, kiểm định PEEL và viết bài mẫu nâng Band ➔ Tiết kiệm 85–90% chi phí API AI.
- ☁️ Đồng Bộ Đám Mây Supabase & Chuyển Giao Khách (Guest Migration): Học thử ngay không cần đăng ký; khi tạo tài khoản sẽ tự động đồng bộ toàn bộ điểm XP, Streak và lịch sử lên mây.
- 🛡️ Mạng Biên Cloudflare & Tự Động Hóa Tài Liệu (SSOT): Phân phối học liệu âm thanh tốc độ cao và tự động cập nhật GitBook/Help Center từ một nguồn dữ liệu duy nhất (featureRegistry.js).

---

## 4. Lộ Trình Phát Triển Dự Án Theo Thời Gian Thực (Living Product Roadmap)

Tài liệu và lộ trình này được cập nhật liên tục theo từng cột mốc phát triển của dự án:

### 🚀 Giai đoạn 1 (Đã Hoàn Thiện & Vận Hành) — Hoàn Thiện 4 Phòng Thi CDI, Chấm Điểm Kép 0.02ms + AI & Đấu Trường Atlas Arena (`v1.0 – v3.5 (Hiện tại)` • `Đã Vận Hành 100%`)
- Vận hành mượt mà 45+ tính năng chuyên sâu cho cả 4 kỹ năng Nghe – Nói – Đọc – Viết.
- Tích hợp Động cơ chấm máy 0.02ms, Giám khảo AI 4 tiêu chí, kiểm định đoạn văn PEEL và Bản đồ nhiệt cấu trúc câu GRA.
- Ra mắt Đấu trường Atlas Arena 100 cấp độ, Tháp Babel, Đấu Ma (Ghost Duel), Boss Thế Giới và Ví thưởng Atlas.
- Hoàn thiện kiến trúc Song ngữ Anh – Việt tuyệt đối (Strict Global English UI) và đường ống đồng bộ GitBook tự động.

### 🚀 Giai đoạn 2 (Đang Mở Rộng Liên Tục) — Mở Rộng Kho Đề Chuẩn Khảo Thí & Tối Ưu Hóa Cá Nhân Hóa Sâu (`Q4/2026 – Q1/2027` • `Đang Cập Nhật Hàng Tuần`)
- Bổ sung liên tục các bộ đề thi Reading, Listening (kèm Audio phân đoạn & Transcript chuẩn), Writing và Speaking mới nhất.
- Tinh chỉnh thuật toán đường cong quên lãng Ebbinghaus 14 ngày trong Kho lỗi sai (Mistake Vault) và Sổ tay từ vựng SRS.
- Nâng cấp Huấn luyện viên nước rút 30 phút (Adaptive Sprint Coach) và dự báo ngày đạt Band theo dữ liệu thực học.

### 🚀 Giai đoạn 3 (Mốc Phát Triển Tiếp Theo) — Hệ Thống Quản Trị Lớp Học Cho Trung Tâm/Trường Học (B2B Hub) & Giọng AI Đa Vùng Miền (`Q2/2027 – Q3/2027` • `Kế Hoạch Tiếp Theo`)
- Ra mắt Bảng điều khiển Giáo viên & Trung tâm (Teacher Dashboard) giúp giao bài thi thử CDI và thống kê lỗi sai toàn lớp.
- Mở rộng Giám khảo Speaking đa giọng đọc bản xứ (Anh-Anh, Anh-Úc, Anh-Mỹ) và chấm ngữ điệu chuyên sâu.
- Tối ưu hóa gói cài đặt PWA cho phòng máy tính bảng và phòng lab khảo thí tại các trường THPT/Đại học.

### 🚀 Giai đoạn 4 (Tầm Nhìn Dài Hạn) — Vươn Ra Thị Trường Đông Nam Á & Nhân Bản Lõi Công Nghệ Khảo Thí (`2027 – 2028` • `Mở Rộng Quốc Tế`)
- Đẩy mạnh người dùng quốc tế tại Đông Nam Á và Châu Á nhờ hệ thống giao diện và giải thích 100% Tiếng Anh có sẵn.
- Nhân bản kiến trúc Local-First + Chấm điểm kép sang các bài thi chuẩn hóa quốc tế khác (PTE Academic, TOEIC 4 Kỹ năng, SAT).

---
*Tài liệu này được đồng bộ tự động từ `src/core/projectWhitepaperData.js` và `src/core/featureRegistry.js`. Xem thêm [Trung Tâm Tính Năng Hệ Thống](features/README.md).*
